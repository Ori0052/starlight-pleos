#!/usr/bin/env python3
"""Build a signed, non-debuggable Android host for the current web prototype.

Prototype signing material is kept outside the repository. No password is passed
on the command line or printed. Set STARLIGHT_SIGNING_DIR to choose its location.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import secrets
import shutil
import subprocess


def run(args, *, cwd=None, env=None, capture=False):
    guarded = env is not None and bool(env.get('STARLIGHT_KEYSTORE_PASSWORD'))
    result = subprocess.run([str(x) for x in args], cwd=cwd, env=env,
                            text=True, capture_output=capture or guarded)
    if guarded:
        for key in ('STARLIGHT_KEYSTORE_PASSWORD', 'STARLIGHT_KEY_PASSWORD'):
            value = env.get(key)
            if value:
                result.stdout = result.stdout.replace(value, '[redacted]')
                result.stderr = result.stderr.replace(value, '[redacted]')
        if not capture:
            if result.stdout:
                print(result.stdout, end='', flush=True)
            if result.stderr:
                print(result.stderr, end='', flush=True)
    result.check_returncode()
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--skip-web-build', action='store_true',
                        help='Use an already verified dist/ without modifying it.')
    parser.add_argument('--offline', action='store_true',
                        help='Use only cached Gradle dependencies.')
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    android = Path(__file__).resolve().parents[1]
    project = android.parent
    if not args.skip_web_build:
        run(['npm', 'run', 'build'], cwd=project)
    if not (project / 'dist/index.html').is_file():
        raise SystemExit('dist/index.html is missing; build the web app first.')

    env = os.environ.copy()
    external_keys = all(env.get(k) for k in (
        'STARLIGHT_KEYSTORE_FILE', 'STARLIGHT_KEYSTORE_PASSWORD',
        'STARLIGHT_KEY_ALIAS', 'STARLIGHT_KEY_PASSWORD'))
    signing_kind = 'provided-release-key'
    if not external_keys:
        signing_kind = 'separate-prototype-release-key'
        folder = Path(env.get('STARLIGHT_SIGNING_DIR',
                       str(Path.home() / '.local/share/starlight-pleos-signing'))).resolve()
        if folder == project or project in folder.parents:
            raise SystemExit('Signing material must be outside the source repository.')
        folder.mkdir(parents=True, exist_ok=True, mode=0o700)
        os.chmod(folder, 0o700)
        metadata = folder / 'release-signing.json'
        keystore = folder / 'starlight-prototype-release.p12'
        if metadata.exists():
            credentials = json.loads(metadata.read_text())
        else:
            if keystore.exists():
                raise SystemExit('Keystore exists without its local signing metadata; preserve it and recover the credentials.')
            password = secrets.token_urlsafe(40)
            credentials = {'alias': 'starlight-prototype', 'password': password}
            fd = os.open(metadata, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
            with os.fdopen(fd, 'w') as output:
                json.dump(credentials, output)
        env.update({
            'STARLIGHT_KEYSTORE_FILE': str(keystore),
            'STARLIGHT_KEYSTORE_PASSWORD': credentials['password'],
            'STARLIGHT_KEY_ALIAS': credentials['alias'],
            'STARLIGHT_KEY_PASSWORD': credentials['password'],
        })
        if not keystore.exists():
            keytool = shutil.which('keytool')
            if not keytool:
                raise SystemExit('keytool is unavailable; configure JAVA_HOME/PATH for JDK 21.')
            run([keytool, '-genkeypair', '-noprompt', '-storetype', 'PKCS12',
                 '-keystore', keystore,
                 '-storepass:env', 'STARLIGHT_KEYSTORE_PASSWORD',
                 '-keypass:env', 'STARLIGHT_KEY_PASSWORD',
                 '-alias', credentials['alias'], '-keyalg', 'RSA', '-keysize', '3072',
                 '-validity', '10000',
                 '-dname', 'CN=STARLIGHT PLEOS Prototype,O=STARLIGHT Prototype,C=KR'], env=env)
        os.chmod(keystore, 0o600)

    gradle = android / ('gradlew.bat' if os.name == 'nt' else 'gradlew')
    command = [gradle, '--no-daemon', '--console=plain']
    if args.offline:
        command.append('--offline')
    command.append('assembleRelease')
    run(command, cwd=android, env=env)
    built = android / 'app/build/outputs/apk/release/app-release.apk'
    if not built.exists():
        raise SystemExit('Signed release APK was not produced.')
    sdk = Path(env.get('ANDROID_HOME') or env.get('ANDROID_SDK_ROOT') or '')
    tools = sorted((sdk / 'build-tools').glob('*'), reverse=True)
    signer = next((p / ('apksigner.bat' if os.name == 'nt' else 'apksigner')
                   for p in tools if (p / 'apksigner').is_file()), None)
    if signer is None:
        raise SystemExit('Android build-tools/apksigner is unavailable.')
    verification = run([signer, 'verify', '--verbose', '--print-certs', built], env=env, capture=True)
    destination = args.output.resolve() if args.output else built
    if destination != built:
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(built, destination)
    result = {
        'application_id': 'com.starlight.pleos',
        'version_name': '1.0.0-contest',
        'apk': str(destination),
        'size_bytes': destination.stat().st_size,
        'sha256': hashlib.sha256(destination.read_bytes()).hexdigest(),
        'web_index_sha256': hashlib.sha256((project / 'dist/index.html').read_bytes()).hexdigest(),
        'signing': signing_kind,
        'signature_verification': verification.stdout.strip(),
        'vehicle_sdk_connected': False,
    }
    destination.with_suffix('.build.json').write_text(json.dumps(result, indent=2, ensure_ascii=False) + '\n')
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()

