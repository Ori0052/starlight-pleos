# Android release verification

Checked 2026-11-15. The release is an Android WebView host for the real bundled React service. It is not an assertion of native Pleos SDK integration or actual vehicle control.

## Built artifact

- Package: `com.starlight.pleos`
- Version: `1.0.0-contest` / versionCode `1`
- APK: `starlight-pleos-release.apk` (rename to the final team/app filename when submitting)
- Size: 37,250,016 bytes
- SHA-256: `36549533b4e845e11916645baef55a4f32ad860ff80cc8b30f23c4dcfca45fed`
- Signature: one separate prototype release signer, RSA 3072, APK Signature Scheme v2 verified
- Public certificate SHA-256: `ffa91388250f65f89e48834a0818f16d35fbd421dca10dc903c953b37510210a`
- Web index SHA-256: `dbc417d6cdbf687dd27f909aad650af0cb811cb45e5e9df0d562fadaa6846d31`

The signing key and password metadata are stored outside the repository and submission artifacts. They are not distributed with the source, build report or APK.

## Completed checks

1. `assembleRelease` completed successfully using JDK 21, Gradle 8.14.3, AGP 8.13.0, compile API 36 and Build Tools 36.0.0. Cached AndroidX versions are explicitly pinned for repeatable dependency resolution.
2. `apksigner verify --verbose --print-certs` passed. This is signed release output, not an unsigned/debug APK.
3. `aapt dump badging` confirmed application ID, version, min API 26, target API 35 and a launcher activity. The APK is not marked debuggable.
4. ZIP integrity passed. The bundled `assets/index.html` matches the verified web `dist/index.html` byte for byte. The approved icon matches the web app icon byte for byte. Local audio and web assets are present.
5. No keystore or signing-password file is included in the APK. The host has no camera, location, microphone or vehicle permission request. AndroidX's internal signature-scoped receiver permission is separate from `INTERNET`.

The current build used `--skip-web-build` so it could copy the already verified web output without changing the parallel submission screen recording. On a fresh checkout, use the default helper workflow to build the web first.

## Runtime verification scope

A separate generic AOSP Android 16 / API 36 x86_64 emulator is being used for installation/launch validation at 960×540, density 160. It runs software rendering because this environment has no `/dev/kvm`. It is **not** the Pleos Connect emulator or an Automotive system image. Runtime installation/interaction results are added only after observed completion; build/signature/package checks alone do not establish them.

No physical vehicle, Pleos-specific runtime, vehicle SDK, real HVAC/window/seat operation or native Pleos speech service has been validated. The service's vehicle panels are explicitly labeled simulation. Public SDK documentation may permit emulator development despite a workspace preparing badge; this APK simply has not integrated those SDKs.
