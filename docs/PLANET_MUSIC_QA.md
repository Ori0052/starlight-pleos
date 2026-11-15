# Per-planet background music verification

Focused Chromium/Playwright checks ran on 2026-11-15 against the local Vite app at `http://127.0.0.1:5173/`, after all seven local assets and the remote Jupiter assignment were finalized.

## Result

**9/9 focused checks passed**, followed by **2/2 production style-delivery checks** on the built output with external stylesheets blocked. Results are in `.qa/results/planet-music.json` and `.qa/results/production-styles.json`. After the final music-title wrapping adjustment, only the affected mobile/roof check was rerun; its passing result is in `.qa/results/planet-music-mobile-final.json`. The final production build was also rechecked at both style-test sizes.

| Area | Actually verified |
| --- | --- |
| Assignments | Exactly eight distinct planet IDs, track IDs and source files/URLs. The expected Minuet, Goldberg Aria, C-major Prelude, Allemande, Siciliano, Air, Andante and Sarabande assignments match. All three constellations keep Debussy; Sun and Moon have no assigned music. |
| Native local media | All seven local music files match their catalog hashes and decode in the browser without a media error. Their native clocks advance; seeking near each ending produces native loop-back; narration pause pauses the music and its clock holds. No music player callbacks or clocks are mocked. |
| Selection change | Selecting Venus while Mercury is playing clears and pauses the old media at zero. The new track receives **zero autoplay calls** before the user's next play action and starts near zero when requested. |
| Disclosure | Mars, Uranus and Neptune display “Digital performance”/“디지털 연주” and attribution. Mercury displays an excerpt title and the 22.2-second/full-98-second distinction. Music controls show source/license/performance disclosures, without a selection-rationale label or rationale text in the checked tracks. |
| Preferences | Toggle and nominal 23% volume persist after refresh. The actual native volume is 0.1495, reflecting the intentional 0.65 narration-dominance factor. |
| Unsupported remote source | An intentionally aborted native Jupiter music request shows the load error instead of a false music-playing state. Browser-narration fixture callbacks and the next caption continue, all four lesson sentences remain readable, and retry is disabled while narration is paused. |
| Mobile | At 390×844, Korean and English large-text music panels and expanded credits for Mercury and the three digital tracks have no document horizontal overflow or clipped text controls. The compact Neptune roof panel also fits; play/pause and ending the view work through normal vertical scrolling. |
| Runtime | No uncaught browser errors were observed in the focused flows. |
| Built delivery | The exact production output retains embedded app CSS. With all external stylesheet requests blocked, 1920×1080 and 390×844 display the dark background, layout, cabin image and current guide entry correctly, with no uncaught browser errors or document horizontal overflow. |

Native browser media durations observed:

| Local track | Observed duration |
| --- | ---: |
| Mercury · Minuet excerpt | 22.200 s |
| Venus · Goldberg Aria | 299.546 s |
| Earth · C-major Prelude | 162.920 s |
| Mars · Allemande digital piano | 84.964 s |
| Saturn · Air | 183.400 s |
| Uranus · Andante digital violin | 127.286 s |
| Neptune · Sarabande digital piano | 84.474 s |

Codec padding/metadata can make browser durations differ slightly from file-tool durations. Each file's full hash, decoded duration and test outcome are recorded in the JSON result.

## Reproduction and evidence

With the dev server running:

```sh
node .qa/planet-music.mjs
```

For production-style regression, serve `dist/` on port 4175 and run:

```sh
node .qa/production-styles.mjs
```

`STARLIGHT_QA_URL`, `STARLIGHT_QA_FILTER` and `STARLIGHT_QA_REPORT` control the main runner. The style runner uses `STARLIGHT_STATIC_QA_URL`. Installed Chromium required an approved execution escalation; no browser installation was performed. The owned static QA server was stopped after testing.

Visual evidence inspected:

- `.qa/results/PLANET-music-mobile-ko-large.png`
- `.qa/results/PLANET-music-mobile-en-large.png`
- `.qa/results/PLANET-music-roof-mobile-en-large.png`
- `.qa/results/STYLES-css-blocked-1920.png`
- `.qa/results/STYLES-css-blocked-390.png`

The final Korean large-text capture keeps “사라방드” together rather than leaving its last character on a separate line. Long scripts, expanded credits and the mobile roof may scroll vertically. The inspected controls and source disclosures reflow within the viewport width.

## Limits

- Narration uses a deterministic browser speech fixture to hold a lesson's real playback state while music is exercised. The music itself uses native `HTMLAudioElement` decoding, time, loop, pause and volume without simulated media behavior.
- Native music decoding and clock verification do not establish audible speaker quality, musical identification by ear, narration/music balance by listening or seamlessness of the loop boundary. Those listening checks remain unverified.
- Jupiter uses its declared remote Commons recording. The test intentionally aborts that request to verify failure handling; it does not establish successful live reachability, codec support or listening in the execution environment.
- This browser suite checks attribution visibility and catalog/file consistency; source-rights research and permission provenance are documented separately by the implementation owner.
- The production-style regression uses a local static server and deliberately blocked stylesheet requests. It does not verify authenticated live Sites delivery.
- No Pleos vehicle, external cross-device session, screen-reader participant or family field validation was performed.
