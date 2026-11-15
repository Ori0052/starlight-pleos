# STARLIGHT PLEOS verification

This file distinguishes checks actually run from intended behavior. Browser checks use the installed Chromium with Playwright; they do not establish Pleos SDK, physical vehicle, camera AR, assistive technology, or real cross-device server compatibility.

## Representative checks run

| Task | Browser verification |
| --- | --- |
| A | **Pass.** Select constellation on map and list, enter detail/story, complete transcript and save one memory. Repeated save produces one local entry. |
| B–C | **Pass.** Overview/list share selection. All eight planets have distinct detail text and loaded photos; return to solar screen works. |
| D | **Pass.** Ceiling view changes object; brightness changes the rendered filter to `brightness(0.45)`; 10-second timer exits ceiling view and resets narration. |
| E | **Pass.** Full story is readable and completable without audio. Native headless synthesis reports unavailable rather than showing fake playback. |
| F | **Pass.** Four switches change independently, persist exact values after reload, and affect captions, visual description, text size and motion. |
| G | **Pass.** Desktop 1920×1080 and mobile 390×844 screenshots checked. English plus large text has no horizontal document overflow across sky, solar, detail, story, travel and records. |
| H | **Pass.** Complete Tab/Enter/Space-only constellation → detail → settings → transcript → save flow. Modal contains focus, closes with Escape, restores launcher focus and shows a 3px focus outline. |
| I | **Pass.** Waiting, explicit phone approval, mobile object command, command attribution, disconnect, local continuation and reconnect all work in the same-browser demonstration. |
| J | **Pass.** `restricted`, `permission-denied`, `unsupported`, `disconnected` and `stale` vehicle states block ceiling entry and provide a transcript alternative. |
| K | **Pass.** Memory note accepts sequential typing, persists after reload, reopens the story, and deletes through confirmation. Empty state returns after deletion. |
| L | **Pass.** Desktop and mobile primary object/story/save flows completed. Mobile navigation remains usable in English with large text. |

## Actual results

Run against the local Vite app at `http://127.0.0.1:5173/` on 2026-11-14 using installed Chromium and Playwright.

- Main end-to-end suite: **11/11 checks passed** (`.qa/results/checks.json`).
- Actual setting effects and native speech fallback: **3/3 checks passed** (`.qa/results/behaviors.json`).
- Final original-asset and layout smoke check: **5/5 checks passed** (`.qa/results/final-smoke.json`).
- Keyboard-only complete flow: **passed** (`.qa/results/keyboard.json`).
- No uncaught browser errors in the tested flows.
- Final checks verified all eight `/assets/original-planets/` photos, the Sun image and NASA full-disc Moon image load with nonzero natural dimensions.
- Desktop story title increases from **44px to 54px** when large text is enabled. The setting also changes the related content layout.
- Native headless Chromium exposes **zero speech voices** in this environment. Playback produces an explicit unavailable message; progress remains **0%** and the transcript stays available. Audible speaker output and speech/subtitle alignment on an audio-capable device are **not verified**.

The large-text desktop heading initially remained the same size; the wide-screen CSS was corrected and rechecked. Note editing initially risked losing focus on each render; the dialog effect was corrected and sequential typing plus persistence passed.

The 1920px solar model was shortened to keep its primary action visible: the action ends at y=880px above the navigation at y=970px and receives pointer hits. Restoring the original PDF image alpha masks removed the rectangular planet mattes; final solar and Earth-detail screenshots were recaptured and visually confirmed.

The mobile sky intentionally crops parts of the draggable constellation field. The document itself does not overflow; the list alternative provides the same object choices. Long mobile pages and the settings dialog scroll vertically.

## Reproduce

With the dev server running, use the installed Playwright runner:

```sh
node .qa/run.mjs
node .qa/behaviors.mjs
node .qa/smoke.mjs
node .qa/keyboard.mjs
```

The runner uses `/usr/bin/chromium` and the execution environment's existing Playwright installation. In the Codex filesystem sandbox Chromium required an approved execution escalation to start; no browser was installed. `STARLIGHT_QA_URL` can override the main suite URL.

Final visual evidence is stored under `.qa/results/FINAL-*.png`, including clean Korean desktop sky/solar/ceiling screens and mobile English large-text screens.

## Verification limits

- Browser speech support and audio output vary with browser/operating system. A progress bar must not advance as if speech plays when synthesis is unavailable.
- Browser automation checks semantic controls and focus behavior; screen reader and disabled-user validation require separate testing.
- Shared viewing in this version is a browser-local demonstration unless an actual server-backed implementation is present.
- The Figma provider returned a Starter-plan MCP limit before providing the requested frame screenshot or source assets. Exact comparison to the latest Figma frame is unverified.
- Direct browsing of the provided reference site could not be verified from this execution environment: both shell and existing Chromium requests failed through the environment network tunnel. This is separate from assets obtained through the project source workflow.


후속 검수: 스타일 전달 호환성 수정은 [STYLE_DELIVERY_QA.md](STYLE_DELIVERY_QA.md), 행성별 BGM은 [PLANET_MUSIC_QA.md](PLANET_MUSIC_QA.md)를 참고하세요. 이전 버전의 행성 무음악 동작은 새 지정 곡으로 변경되었습니다.
