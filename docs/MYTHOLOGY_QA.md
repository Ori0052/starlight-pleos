# Mythology feature verification

Historical report for the browser-speech version. Korean mythology now uses prerecorded Annie audio; see `AUDIO_QA.md` for the subsequent playback and library-guide update.

The frozen, reviewed scripts were tested on 2026-11-14 against the local Vite app at `http://127.0.0.1:5173/`, using the environment's installed Chromium and Playwright. This report covers the mythology update; it does not repeat or replace the earlier full-app checks in `QA.md`.

## Result

**11/11 focused checks passed.** Machine-readable results are in `.qa/results/mythology.json`; the reproducible runner is `.qa/mythology.mjs`.

| Area | Actually checked |
| --- | --- |
| Packaged sources | All three myth scripts have distinct titles, revision IDs, source/history/permalink links, modification notices and CC BY-SA 4.0 attribution. The served source snapshot contains the referenced revisions. |
| Full script display | Orion, Ursa Major and Cassiopeia each display their own 18-sentence complete script, caption and contributor/license block. |
| Narration bindings | A deterministic browser speech stub compared all **108 segments** (3 stories × 2 languages × 18 sentences). Every `SpeechSynthesisUtterance.text` exactly matched the selected transcript and current caption. |
| Changing story type | Switching an active mythology story to science cancels the old utterance, resets progress and uses the science script on the next play. |
| Saved memories | Mythology and science save as distinct `storyId` records. Repeated mythology save stays one entry. Each saved story reopens the correct title and type; the type also survives refresh. |
| Ceiling and companion | Both show the active mythology title/caption. Changing the companion's selected constellation updates the active myth. |
| Visual description | The distinct visual-description utterance matches the main caption and companion caption at position `-1`; the next callback advances both to the first myth sentence. |
| Cached content | After the page and app code load, going offline still allows mythology/science switching and complete transcript display. No live Wikipedia request is made by playback. |
| Mobile and keyboard | At 390×844, English plus large text produces no document horizontal overflow, no out-of-viewport text controls and no broken loaded images. The story picker works by keyboard Enter/Space. |
| Runtime and native fallback | No uncaught browser errors. Native headless Chromium exposes zero speech voices, reports the unavailable error, keeps progress at **0%**, and retains the full mythology transcript. |

Final script sizes and source revisions:

| Story | Korean characters | English words | Displayed estimate (KO / EN) | Revision |
| --- | ---: | ---: | --- | ---: |
| Orion | 781 | 261 | 2.4 / 1.8 min | 41081776 |
| Ursa Major | 782 | 263 | 2.4 / 1.8 min | 40597122 |
| Cassiopeia | 778 | 261 | 2.3 / 1.8 min | 40004560 |

The estimates are reading-rate calculations, not measured playback times.

## Evidence and reproduction

With the dev server running:

```sh
node .qa/mythology.mjs
```

`STARLIGHT_QA_URL` can override the server URL. The runner uses the existing environment's Chromium and Playwright; no browser installation was performed. The filesystem sandbox required an approved browser execution escalation.

Captures:

- `.qa/results/MYTH-story-desktop.png`
- `.qa/results/MYTH-story-mobile-en-large.png`

The desktop and mobile layouts were visually inspected for the story picker, long transcript and source/license/history block. Long transcripts intentionally scroll vertically.

## Limits

- The speech stub establishes exact content and callback/state bindings. It does **not** establish audible speaker output, real speech quality, caption timing on an audio-capable device or the estimated duration. Actual listening remains unverified.
- Offline checks start **after the app loads**. A first visit or full page reload without connectivity is not claimed to work.
- QA verifies the packaged source snapshot and displayed attribution. The content acquisition and independent editorial source checks are documented separately in `MYTHOLOGY.md` and `MYTHOLOGY_REVIEW.md`; this browser suite does not fetch Wikipedia again.
- No Pleos hardware, external cross-device server, screen-reader user or child/family field validation was performed.
