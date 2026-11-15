# Android release verification

Checked 2026-11-15. The release is an Android WebView host for the real bundled React service. It is not an assertion of native Pleos SDK integration or actual vehicle control.

## Built artifact

- Package: `com.starlight.pleos`
- Version: `1.0.0-contest` / versionCode `1`
- APK: `starlight-pleos-release.apk` (rename to the final team/app filename when submitting)
- Size: 37,243,664 bytes
- SHA-256: `4631d1032cef8a08c9b4e7e1d52cd793f9780733da825c221cb970f1a8b11611`
- Signature: one separate prototype release signer, RSA 3072, APK Signature Scheme v2 verified
- Public certificate SHA-256: `ffa91388250f65f89e48834a0818f16d35fbd421dca10dc903c953b37510210a`
- Web index SHA-256: `dbc417d6cdbf687dd27f909aad650af0cb811cb45e5e9df0d562fadaa6846d31`

The signing key and password metadata are stored outside the repository and submission artifacts. They are not distributed with the source, build report or APK.

## Completed checks

1. `assembleRelease` completed successfully using JDK 21, Gradle 8.14.3, AGP 8.13.0, compile API 36 and Build Tools 36.0.0. Cached AndroidX versions are explicitly pinned for repeatable dependency resolution.
2. `apksigner verify --verbose --print-certs` passed. This is signed release output, not an unsigned/debug APK.
3. `aapt dump badging` confirmed application ID, version, min API 26, target API 35 and a launcher activity. The APK is not marked debuggable.
4. ZIP integrity passed. The bundled `assets/index.html` matches the verified web `dist/index.html` byte for byte. The bundled web icon matches the approved web app icon byte for byte. The native adaptive foreground adds uniform black safety padding, preserving the silhouette within Android's adaptive safe region. Local audio and web assets are present.
5. No keystore or signing-password file is included in the APK. The host has no camera, location, microphone or vehicle permission request. AndroidX's internal signature-scoped receiver permission is separate from `INTERNET`.

The current build used `--skip-web-build` so it could copy the already verified web output without changing the parallel submission screen recording. On a fresh checkout, use the default helper workflow to build the web first.

## Runtime verification scope

A separate generic AOSP Android 16 / API 36 x86_64 system image was used at 960×540, density 160, with Android Emulator 37.2.12 (build 16428233) and Android System WebView 133.0.6943.137. It runs software rendering because this environment has no `/dev/kvm`. It is **not** the Pleos Connect emulator or an Automotive system image.

The exact final APK above installed successfully with `adb` at 2026-11-15 08:02:57 UTC (`Success`, return code 0). Airplane mode was set and Wi-Fi disabled before the first launch. Installation/signature checks passed, but offline UI operation was **not** established: the app reached the Android launch splash, then stock WebView's native library raised SIGTRAP before the React UI painted. No app Java exception or asset-404 failure was observed in that launch.

A control using the separately installed stock `org.chromium.webview_shell` also raised native SIGTRAP at 08:13:46 UTC, at the same `libwebviewchromium.so` offset as the app. The same emulator additionally showed stock Quickstep ANR and other system-component failures. One bounded follow-up disabled system animations, cleared the blocking dialog and retried a simple local-HTML stock control; it still timed out and showed only the system launch splash. The root cause is undetermined; these observations do not establish a GPU or CPU cause.

This demonstrates a WebView/runtime failure outside the app as well; it does not prove this APK will work on another device. Consequently, foreground UI flows, audio playback, offline operation and actual Pleos compatibility remain unverified on Android. The separate desktop/mobile web tests must not be represented as native-emulator success. No production security settings were relaxed to bypass the failure, and the final signed APK above was not modified during diagnosis.

Evidence outside the source tree: `research/native-runtime-verdict.json`, `research/native-install-final.json`, `research/native-app-crash-logcat.txt` and `research/native-control-crash-logcat.txt`. Android splash/diagnostic captures are not screenshots of the service's Sky screen.

No physical vehicle, Pleos-specific runtime, vehicle SDK, real HVAC/window/seat operation or native Pleos speech service has been validated. The service's vehicle panels are explicitly labeled simulation. Public SDK documentation may permit emulator development despite a workspace preparing badge; this APK simply has not integrated those SDKs.
