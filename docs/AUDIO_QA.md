# Recorded narration, background music and library verification

Historical verification before per-planet music was added. The original planet-without-music expectation is superseded by `PLANET_MUSIC_QA.md`; constellation narration/library checks remain relevant.

Focused browser checks ran on 2026-11-15 against the local Vite application at `http://127.0.0.1:5173/`, with the installed Chromium and Playwright. This report distinguishes native media behavior from controlled narration callbacks.

## Result

**10 unique focused checks passed.** The latest observed result per check is collected in `.qa/results/audio-experience-final.json`, with its source run listed for every result. Core checks were followed by targeted passes for the guide entry, recording slider, fallback, mobile roof controls and paused music-retry state.

| Area | Verified behavior |
| --- | --- |
| Recording catalog | Exactly three Korean Annie myth recordings, one for each existing constellation. Each submitted text matches the saved 18-sentence script. All 54 cues have ordered starts/ends within the declared duration. No new stories or constellations were added. |
| Recorded narration controls | With explicitly simulated recorded-media callbacks, all three sets of cue timestamps select the exact saved captions. The time slider scrubs to the requested media time, pause holds the player, and selecting the endpoint leaves it paused at 100% rather than restarting. |
| Native local music | The bundled `/audio/clair-de-lune.mp3` loads and decodes in Chromium with no media error. Native time increased from approximately 0.04s to 0.39s. Seeking near the end of the approximately 304-second file demonstrated actual native looping back to its beginning. Narration pause pauses music and stops its clock. |
| Music preferences | The displayed 23% level sets native playback volume to `0.23 × 0.65 = 0.1495`. Toggle and level persist after reload. Planet content has neither music controls nor a music player. |
| Music-load failure | A native failed local-music request shows load-error guidance. Retry is disabled while narration is paused, with the helper explaining how to resume; retry becomes enabled and can be invoked while narration plays. |
| Library guide | The guide distinguishes 88 official sky regions, three playable Greek myths and seven cultural introductions. ArrowRight and End tab navigation work; the Greek collection opens the existing story. Reference links use HTTPS and open externally. |
| English and mobile | English stories use the browser-voice path and are not labeled as Korean Annie recordings. At 390×844 with large text, all three guide panels have no horizontal clipping inside the dialog, no broken loaded images and no document horizontal overflow. |
| Mobile ceiling | The compact music panel fits the 390×844 English large-text roof view without horizontal clipping. Play/pause and end-viewing controls can be reached and operated through normal vertical scrolling. |
| Failure handling | A native aborted recording request produces the explicit recorded-audio error, leaves time/progress at `0:00 / 1:36`, `0%`, and retains all 18 transcript sentences. The explicit “Use this device’s voice” action switches to the browser-voice path. No automatic fake playback was shown. |
| Runtime | No uncaught browser errors were observed in the tested narration, music, guide and roof flows. |

The catalog declares the following recording durations; these are provider/manifest values, not listening measurements:

- Orion: 96.6408 seconds.
- Ursa Major: 95.3876 seconds.
- Cassiopeia: 96.4318 seconds.

The mobile sky intentionally crops parts of its draggable constellation field. Those pre-existing offscreen scene buttons can still appear in a global geometry audit behind an open dialog. The guide dialog itself has no horizontally clipped controls or text; this distinction is retained in the result data.

## Evidence and reproduction

With the local dev server running:

```sh
node .qa/audio-experience.mjs
```

Use `STARLIGHT_QA_URL` to change the server address or `STARLIGHT_QA_FILTER` to run a focused subset. `STARLIGHT_QA_REPORT` chooses a distinct JSON report filename for targeted runs. The script uses the existing Chromium and Playwright installation. Browser launch required an approved execution escalation; no browser was installed.

Relevant screenshots:

- `.qa/results/AUDIO-guide-mobile-en-large-0.png`
- `.qa/results/AUDIO-guide-mobile-en-large-1.png`
- `.qa/results/AUDIO-guide-mobile-en-large-2.png`
- `.qa/results/AUDIO-story-mobile-en-large.png`
- `.qa/results/AUDIO-roof-mobile-en-large.png`
- `.qa/results/AUDIO-recording-error.png`

The mobile guide, story music row and ceiling control layout were visually inspected in addition to geometry checks.

## Verification limits

- HeyGen CDN narration could not be fetched in the execution environment. Narration timing/control checks therefore use a clearly marked recorded-media fixture with provider duration and cue data. They verify state and content binding, **not** the actual remote recording, voice quality, audible subtitle alignment or live CDN availability.
- Local background music checks use the **real bundled MP3 and native Chromium media clock/decoder/loop/pause**, not the narration fixture. Speaker listening and musical identification by ear were not verified.
- English device narration is exercised through a browser speech stub for its text/control path. Actual English voice output remains device-dependent and unverified.
- No live Pleos hardware, external cross-device session, screen-reader participant or family field validation was performed.
