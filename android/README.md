# STARLIGHT PLEOS Android prototype

This module packages the React/TypeScript service as a real, signed Android release APK. The UI, bundled images, reviewed scripts, local records, settings and local music are loaded from assets through AndroidX `WebViewAssetLoader` at `https://appassets.androidplatform.net/`. It does not load the hosted website as its application shell. The approved app icon is included as a native adaptive launcher resource; its foreground adds uniform technical safety padding for Android's smaller adaptive-icon safe region, without changing the approved silhouette or web icon.

## Build

Requirements: Node/npm for the web build, Python 3, JDK 21, Android SDK platform 36 and Build Tools 36.0.0, Gradle 8.14.3 (wrapper) and Android Gradle Plugin 8.13.0. The app compiles against API 36, targets API 35 and supports API 26+ devices with a modern Android System WebView. It resizes for vehicle landscape and phone portrait layouts; native system-bar insets remain reserved.

From the repository root:

```sh
npm ci
python3 android/scripts/build_release.py --output apk/starlight-pleos-release.apk
```

The helper builds `dist/`, stages it into generated Android assets and runs `assembleRelease`. To use an already verified web build without touching it, add `--skip-web-build`. Use `--offline` only when all Gradle dependencies are cached. `ANDROID_HOME` or `ANDROID_SDK_ROOT` must identify the installed SDK; `JAVA_HOME` and `PATH` must identify the JDK. The Gradle wrapper is included.

The output includes `*.build.json` with APK/web-asset hashes and public certificate verification. The submission filename can be renamed to the organizer's `팀명_앱이름_release.apk` after the actual team name is finalized. Record the final repository commit and APK path in the submission.

## Release signing

The helper uses a separate prototype release key, stored outside the repository under `STARLIGHT_SIGNING_DIR` (default: the user's local data folder). Directory/file permissions restrict local access. This is a non-debuggable `release` variant, not an unsigned APK or the unrelated project's debug key. Preserve the key privately for future updates. Never commit or upload the key, its password metadata, or a signing-properties file.

To sign with an owner-managed key instead, set all four environment values before running the helper:

```text
STARLIGHT_KEYSTORE_FILE
STARLIGHT_KEYSTORE_PASSWORD
STARLIGHT_KEY_ALIAS
STARLIGHT_KEY_PASSWORD
```

Passwords are supplied through environment variables, not command arguments or source code. For a quick unsigned development build, `cd android && ./gradlew assembleDebug` uses Android's standard debug workflow and produces a different `.debug` package; do not confuse it with the submitted signed release.

## Install

```sh
adb install -r apk/starlight-pleos-release.apk
adb shell am start -n com.starlight.pleos/.MainActivity
```

The host requests `INTERNET` and no dangerous camera/location/microphone permissions. AndroidX also contributes the app's signature-scoped internal `DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`; it is not a vehicle permission. File/content access and mixed HTTP content are disabled, release WebView debugging is disabled, and no JavaScript-to-native vehicle interface is exposed. External maps/reference links open an installed browser/map app, with a visible alternative message if none is available. The wrapper denies camera/microphone/location permission requests because these integrations are not implemented. It does not pretend to read physical vehicle state. Android app backup is disabled; local records/settings are not uploaded by the host.

## Exact scope

- Local UI/assets and reviewed reading scripts work without the hosted site. Native local storage uses the application WebView origin and does not sync with a desktop browser.
- Recorded narration, one external planetary music source, external references/maps and network font downloads require connectivity. An unavailable voice can be read through the same transcript. Browser `speechSynthesis` availability varies by WebView; it is not a Pleos TTS integration.
- Vehicle care/windows/climate/lights/seats remain explicitly labeled demo state. No seat/window/HVAC/lock command reaches a vehicle.
- The app declares Automotive hardware as optional for installation compatibility; this does not certify Pleos compatibility or implement native vehicle SDKs. It does not mark itself distraction optimized. Vehicle/AAOS UX policy and native SDK readback must be verified separately on the actual Pleos Connect emulator.
- Latest contest notices distinguish public SDK documentation/available emulator testing from incomplete integration in this prototype. Do not infer that an SDK is unavailable merely from a workspace “preparing” badge.

See `BUILD_VERIFICATION.md` for the actual release/signature/install tests and the exact emulator used. Generic Android testing is reported separately from Pleos/Automotive validation.
