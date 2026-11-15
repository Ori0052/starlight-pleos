# Planet background music

The user's eight requested works are assigned one per planet. Selection rationale is provided only in chat; it is not displayed in the app or published with the music catalog. The product displays only the current music, playback controls, recording/source credits, license and relevant edition labels.

| Planet | Work | App edition |
| --- | --- | --- |
| Mercury | Minuet in G major, BWV Anh. 114 — Christian Petzold | KasraR human performance, 22.2-second excerpt; explicitly labeled excerpt and looped |
| Venus | Goldberg Variations, BWV 988 — Aria | Kimiko Ishizaka (2012), CC0 recording |
| Earth | Well-Tempered Clavier I — C major Prelude, BWV 846 | Kimiko Ishizaka (2015), CC0 recording; no fugue |
| Mars | French Suite No. 2, BWV 813 — Allemande | Attributed John Sankey MIDI, digitally rendered piano; explicit digital label |
| Jupiter | Organ Concerto after Vivaldi, BWV 596 — Siciliano / Largo e spiccato | Metzner's 2009 organ recording, CC BY 3.0, full remote Commons audio |
| Saturn | Orchestral Suite No. 3, BWV 1068 — Air | USAF Air Force Strings (2000), Commons official-duty public-domain declaration; strings version, not claimed to be the strict Wilhelmj solo arrangement |
| Uranus | Solo Violin Sonata No. 2, BWV 1003 III — Andante | Hajo Dezelski/Mutopia score MIDI, digitally rendered violin, CC BY-SA 3.0; explicit digital label |
| Neptune | French Suite No. 2, BWV 813 — Sarabande | Attributed John Sankey MIDI, digitally rendered piano; explicit digital label |

The three constellation stories retain Debussy's Clair de lune. The Sun and Moon have no additional track assigned by this update. The optional visual-description prelude and the selected story share the current object's music; no music starts before actual narration playback.

## Playback and transitions

`musicTrack.ts` separates track data from the player. `getMusicTrack(objectId)` returns the matching track. `useBackgroundMusic` owns one lazy media element, loops it at an independently controlled low volume, and follows verified narration playing/paused state. A changed object stops narration before selection changes; the previous music is released and the next track waits for playback. Pending promises and stale callbacks from a previous track are ignored.

Toggle and music level remain in local browser storage. Story and roof views share the same media player and settings. Music errors do not interrupt the transcript or narration. The UI offers retry only while the story is playing, with an explanation when paused. This is browser media playback, not Pleos audio SDK or vehicle speaker control.

## Rights, provenance and editions

The composition being old does not establish the recording's reuse rights. Each adopted recording has separate attribution and provenance. `public/audio/planets/catalog.json` contains the served file/URL, selected license and source credits; additional source notices accompany digital editions under `public/audio/planets/sources/`.

The Minuet uses its creator KasraR's explicit worldwide public-domain dedication. The local excerpt removes the mirror film's silent end card and applies short edge fades; it is not described as the complete 98-second performance. WTC and Goldberg use Kimiko Ishizaka's CC0 releases. Air uses a pinned AAC mirror with Commons provenance and a U.S. Air Force official-duty declaration, not a claim that every recording of Air is free.

BWV 596 is the requested slow organ-concerto movement after Vivaldi. It is not replaced with the different, better-known flute Siciliano BWV 1031. Its full source URL was observed from the Commons original-file link. The execution network cannot download that host, so it remains external; connectivity and codec support are required, and live retrieval/actual playback of this track remains unverified here.

The Andante uses the exact encoded notes/rhythm of Mutopia 1456, credited to Hajo Dezelski, from Bach-Gesellschaft Edition 1879 Band 27.1. It is one pass without unfolded score repeats, rendered at 42 BPM using a sampled violin. The resulting audio and original MIDI are made available under CC BY-SA 3.0. French Suite movements use attributed Sankey MIDI and preserve its timing while changing the rendered instrument to piano. The copyright and permission notice accompanies the MIDI. These are genuine works rendered digitally, not recordings by a named violinist or pianist. GeneralUser GS's original license explicitly permits private and commercial rendered music; that license and the rendering settings are retained.

Modern exact solo-violin recordings without clear reuse terms and historical digitizations whose host warns about rights outside Germany/Europe were not adopted. The identified Marco Alejandro Gil Esteva French Suite recordings were not silently claimed as the adopted files when their downloads could not be obtained. No NC-only score or recording is used for the digital fallback.

## Verification limits

Local audio is decoded and exercised with native browser media separately from deterministic narration/media callback tests. Automated tests do not constitute audible listening, professional mix balancing or verification of the remote Jupiter recording. See `PLANET_MUSIC_QA.md` for actual results and `STYLE_DELIVERY_QA.md` for the independent stylesheet-delivery repair.
