# Approved voice recordings

On 2026-11-15 the user approved a 21.50-second Korean Orion sample generated with HeyGen's public **Annie - Lifelike** voice (`330290724a1b470fb63153f34d4c0183`). The same voice and default synthesis settings were used for the three existing, frozen Korean mythology scripts. This is HeyGen speech, not OpenAI, Gleo, or Pleos SDK speech. No new constellation story was added.

| Script | Synthesis duration | Caption cues |
| --- | ---: | ---: |
| Orion | 96.64 s | 18 |
| Ursa Major | 95.39 s | 18 |
| Cassiopeia | 96.43 s | 18 |

The input is the exact `mythology.ts` Korean transcript, joined with paragraph breaks. Returned original characters match those inputs. Caption sentence boundaries are derived from the synthesis service's character timestamps; no evenly spaced or invented timing is used. `scripts/build-narration-manifest.mjs` creates a bundled catalog plus inspectable public metadata in `public/audio/`. Generation was performed once for each full script; rebuilding the metadata does not generate new speech or incur a synthesis call.

`useNarration` selects these recordings synchronously for Korean mythology. Real HTMLAudio events and `currentTime` control playback status, seeking, captions, duration and progress. Loading is cancellable. Playback errors retain the full transcript and offer an explicit device-voice alternative. There is no silent voice substitution. English, science stories and the optional separate visual-description prelude use browser speech. If that prelude is unsupported, its script remains available and the selected story recording can continue.

The generated MP3 URLs are currently hosted on HeyGen's CDN. The execution network rejected downloads from that hostname (HTTP 403), so these three recordings are **not bundled locally**. Availability and long-term retention of those CDN URLs are not independently guaranteed. A future production release should copy the authorized outputs into durable app storage when network access is available. Do not claim offline narration.

The user heard and approved the sample. Full-recording text/timing metadata was checked, but these full files could not be independently downloaded, decoded, transcribed or listened to here. Automated media-callback fixtures verify UI behavior, not audible quality or pronunciation. The packaged Clair de lune music is a separate local asset; its actual decode and native browser playback are tested separately. See `MUSIC.md` and `AUDIO_QA.md`.

Original source and script adaptation credits remain below each story. The separate background-music control includes recording-specific attribution and license links. Provider metadata is in `/audio/narration-provenance.json`.
