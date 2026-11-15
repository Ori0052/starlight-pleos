# Vehicle simulator QA

**18/18 browser checks passed on 2026-11-15** in `/workspace/sites/starlight-settings-review`, using Chromium at 1920×1080 and 390×844 against the integrated Vite app. A three-case follow-up also passed and confirmed that a custom 23% music preference survives all vehicle entry/return paths. A five-case visual/control follow-up also passed, checking window percentage/glass height, seat SVG transforms before acknowledgement and after reset, example refresh, climate readback text and the dedicated retry button. No app source was changed by this QA task.

Navigation subsequently changed: Vehicle is now the fifth primary bottom navigation item, after Sky, Solar system, Journey and Memories; the duplicate header entry was removed. The browser script now uses `vehicle-entry-nav`. The results and entry descriptions below preserve the original QA run, which tested the former header entry; they do not claim a rerun of the full suite for this navigation change.

Focused navigation verification passed after the change: the TypeScript/Vite production build; 16 large-text layouts at widths 320, 390, 700, 701, 768, 900, 1024 and 1920 in Korean and English; five bottom-menu routes and active labels; keyboard Enter into Vehicle and return to Sky. Two initially observed narrow English layout issues were corrected before the final 16-layout pass. The existing entry/return case was also rerun and passed, preserving selected Orion, the Debussy assignment and the custom 23% music preference across bottom-navigation, parking and roof entry paths. Captures and measurements are in `.qa/results/NAV-*.png`, `nav-layout-final.json` and `vehicle-nav-return.json`. No uncaught browser errors were observed. Vertical scrolling and two-line English menu labels on the smallest screen remain intentional.

Centering follow-up: desktop/tablet navigation now occupies the middle column between equal side tracks, independently of the two contextual actions. Its center differed from the viewport center by less than 0.02 px across 44 Korean/English/default/large-text configurations at 320–1920 px. Three narrow English side-action overlaps were found and corrected by using the compact navigation-only bar at 701–900 px; the affected widths plus the supplied 1003 px reference width passed a final 16-case check. Mobile flex layout remains unchanged. Final production build passed. Evidence: `.qa/results/nav-center.json`, `nav-center-followup.json` and `CENTER-1003.png`.

This is a browser-local simulator. These results do not establish real Pleos SDK support, actual vehicle telemetry, physical movement, medical diagnosis, permissions on a real vehicle or a production vehicle safety policy. New unified Annie recordings were not generated or tested as part of this vehicle change.

## Verified behavior

| Area | Observed result |
| --- | --- |
| Initial state | Explicit example/connection-demo labeling; all command categories disabled until explicit demo start. Example battery 85%, range 420 km, cabin temperature 21.5°C. |
| Command acknowledgement | Door lock, climate, lighting and seat values stay unchanged while a command is pending, then update after the simulator acknowledgement. |
| Four windows | Every window moved independently to 25%; each was stopped at 5%, remained there without resuming, then reopened to 25% and closed to 0%. Stopping before the delayed acknowledgement also prevented subsequent movement. Native simulator timers were used. |
| Climate zones | Front applied 24°C / fan 4, rear 19°C / fan 1. Power and fresh-air changes remained independent by zone. Draft edits did not change applied values. |
| Lighting | Applied brightness changed the actual ambient-preview CSS variable and glow opacity from 0.35 to 0.78; switching off changed both to 0. |
| Four seats | Each seat independently applied different recline/slide values, retained the other three seats and reset to 20° / 50%. SVG translation/rotation stayed unchanged during drafts and pending requests, changed after acknowledgement and returned to the original transforms on reset. |
| Errors and retry | Developer-panel rejection and timeout each retained previous values; the dedicated “Retry the same request” button applied the requested setting. |
| State and capability gating | All categories were gated for permission-denied, unsupported, disconnected and stale control data, and for every non-parked vehicle policy status. Individual unsupported window, climate, lighting, seat and lock features were disabled without disabling supported peer features. |
| Policy interruption | A fixture-triggered driving restriction cancelled a pending light request and stopped a moving window at 5%. Neither resumed after waiting or restoring parked state. Ending the demo also cancelled pending work. |
| Entry and return | Header, parking-status and roof entries returned to the previous sky, story or roof context with Orion selected and the Debussy assignment retained. Music enabled state and a custom 23% volume remained unchanged. |
| Roof timer | A real ten-second timer continued while vehicle controls were open. Synthetic speech callbacks represented narration, while a real bundled Debussy MP3 used native media playback and advanced its clock. Expiry stopped narration, paused that actual media element and returned to Sky. Climate, lighting, seats, windows and lock readbacks did not change. |
| Manual condition | The explicitly self-entered “rest” preference persisted after reload. Vehicle examples reset to inactive preview after reload; this is module-session telemetry rather than persistent live vehicle data. |
| Mobile and keyboard | All five tabs in Korean and English large text fit a 390 px document with no measured horizontal overflow. Arrow-key tab navigation, visible focus, window controls, climate range adjustment/application and back-button focus worked. Vertical scrolling is needed for the longer screens. |
| Existing content | All three Korean recorded constellation story bindings and all eight planet music assignments remained present in their actual story/transcript screens. Remote narration listening was not verified. |
| Browser/network | No uncaught page errors. External requests were blocked during this suite; no paid-generation, billing, subscription or physical-vehicle requests were performed. |

Ordinary commands were exercised through the rendered UI. Read-only adapter snapshots supplemented visible readbacks. Availability, fault and capability matrices used the development-panel controls. Exact cancellation races used the same exported development setters immediately after a UI command, so navigation could not consume the 400 ms acknowledgement interval.

## Reproduction and evidence

Run the existing local preview, then execute:

```sh
node .qa/vehicle.mjs
```

`STARLIGHT_QA_BASE` selects the preview URL (default `http://127.0.0.1:5173`). `STARLIGHT_QA_FILTER` selects case-name substrings separated by `|`, and `STARLIGHT_QA_REPORT` selects the output JSON basename. Browser launch needs the executor's normal Chromium permission. All fixtures and limitations are explicit in the script.

- Full results: `.qa/results/vehicle.json` — 18/18 passed.
- Follow-up context/custom-volume results: `.qa/results/vehicle-targeted.json` — 3/3 passed.
- Visual/control follow-up: `.qa/results/vehicle-visual-targeted.json` — 5/5 passed.
- Desktop screenshots: `.qa/results/VEHICLE-initial-1920.png`, `VEHICLE-active-care-1920.png`, `VEHICLE-climate-1920.png`.
- Mobile screenshots: `.qa/results/VEHICLE-mobile-{ko,en}-large-{care,windows,climate,lighting,seats}.png`.
- Separate adapter-owner tests: `.qa/vehicle-adapter.mjs`, `.qa/results/vehicle-adapter.json` — owner reported 15/15 passed; these are not additional browser cases.

No functional failure was observed in the executed browser cases. Actual vehicle hardware/SDK response, real sensor data, physical safety/permission behavior, screen-reader testing with assistive technology, and remote narration speaker listening remain unverified.
