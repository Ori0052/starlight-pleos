# Image assets and provenance

App icon update (2026-11-15): original OpenAI-generated monochrome organic mark following the user's latest visual references: rounded planetary forms, an orbital sweep and a four-point star share flowing boundaries and negative space. Exported to `/icons/` plus `/favicon.ico`. This is an app mark, not a planet photograph or an official Hyundai/Pleos logo. Sizes, masking and web/native scope are recorded in [APP_ICON.md](APP_ICON.md).

Checked 2026-11-14. All files are served locally from `public/assets`. No generative image model was used for celestial images. The supplied reference site initially failed web/HTTP access, then its source was recovered read-only via the Sites source repository into `/workspace/reference-starlight-materials`. The reference site was not edited. Original embedded background rasters were extracted directly from the supplied presentation PDF; the supplied PDF also contains its original separate planet-image rasters. Font source files were not included.

## Images selected for the finished app

- Sky and ceiling views: supplied `cabin-original.jpg`.
- Solar overview: supplied `cabin-front-original.jpg`.
- Vehicle environment: supplied `vehicle-interior-original.jpg` as the desktop cabin background and mobile vehicle hero; `vehicle-night-original.jpg` as a quiet backdrop. Both remain the user's service concept imagery, with no claim that they depict a connected physical vehicle. The latest user-supplied HVAC dashboard image guided layout, compact status and round actions; it is not shipped as a UI image or copied sportscar branding.
- All eight planets: supplied `original-planets/<id>.png`, using `original-planets/venus-clouds.png` for Venus. The PNGs combine the PDF's original image pixels with their existing PDF soft-mask alpha (`fitz.Pixmap(base, mask)`), preserving original full dimensions and transparency, without invented or AI-generated pixels. These preserve the user's original design imagery; **no NASA/public-domain licence is asserted for these supplied files** because the original source does not supply individual author/mission/licence metadata. They are reused as the user's provided materials for the requested implementation. The Venus cloud image is distinct from the unused radar-surface replacement.
- Sun: `sun.jpg`, NASA/SDO ultraviolet full-disc visualization through the documented cosmos mirror below.
- Moon: `moon-full.jpg`, a 512×512 full lunar disc, visually checked to be a globe with recognizable maria and craters; **not** an equirectangular texture. NASA Scientific Visualization Studio rendering from LRO surface/topography data. Credit: NASA's Scientific Visualization Studio; Ernie Wright (visualization), Noah Petro (science), David Ladd (production). Primary [Moon Phase and Libration, 2024](https://svs.gsfc.nasa.gov/5187/) identifies the LRO data and full-disc visualization credits. Download mirror: `https://raw.githubusercontent.com/acamarata/moon-cycle/main/mm-512-85/354.webp`; converted from WebP to JPEG quality 95 with no other alteration. This fixed learning image does not assert the present lunar phase or local sky visibility.

Other downloaded maps/photos listed below are retained as unused alternative/reference assets. A supplied-original provenance statement is not interchangeable with the licence terms of those external replacements.

## Recovered supplied originals (preferred visual reference)

Source: [STARLIGHT PLEOS materials](https://starlight-pleos-materials-1113.rhfenrdltkfk.chatgpt.site/), `files/STARLIGHT_PLEOS_presentation_updated.pdf`. The repository contains 46 presentation page previews, 16 planning page previews, 4 design previews and PDFs/DOCX/ZIP, not a standalone raw-photo folder. The presentation PDF retains separate embedded background and planet images, allowing extraction without rendered UI text. Images below are byte-for-byte extracted rasters, not screenshots cropped out of a presentation page. The source does not identify photographers, renderers, or individual usage licenses; treat them as user-supplied reference assets for this requested implementation. Vehicle/sky scenes are **service concept visualizations**, not proof of live-camera AR, vehicle glass projection, or photos of an installed service.

| App file | Source PDF page / image xref | Content |
| --- | --- | --- |
| `cabin-original.jpg` | 22 / 681 | 1672×941 upward panoramic-roof view, night sky and blankets. No baked text, constellation or UI. Preferred ceiling-mode background. |
| `family-recline-original.jpg` | 21 / 657 | Family reclining beneath a panoramic roof; no UI. |
| `family-original.jpg` | 2 / 161 | Three generations relaxing in warm vehicle interior; no UI. |
| `family-sky-original.jpg` | 34 / 933 | Three generations looking upward from reclining seats; no UI. |
| `cabin-front-original.jpg` | 3 / 205 | Front cabin, cool blue ambient lighting, panoramic roof. Used as full-solar reference background. |
| `constellation-window-original.jpg` | 8 / 280 | Vehicle window and sky with **baked bear silhouette and star lines**. Do not reuse as generic Orion/Cassiopeia sky. |
| `vehicle-interior-original.jpg` | 29 / 830 | Side view of seats and cabin, no text. |
| `vehicle-night-original.jpg` | 1 / 79 | Vehicle, campsite and family under night sky; a constellation is baked into the sky. |

`original-planets/{mercury,venus-clouds,earth,mars,jupiter,saturn,uranus,neptune}.png` retain all eight raw planet images and their original transparency embedded in the supplied presentation (PDF page 12). Base/mask xref pairs are 444/445, 448/449, 436/437, 442/443, 446/447, 440/441, 438/439, 434/435 respectively. The `.jpg` siblings retain the original embedded JPEG streams before applying those masks and are unused alternatives. The Venus original is a visible cloud image, clearly distinct from the Magellan radar surface replacement below. The original source does not contain per-image mission/photo credits, so the source-backed replacement photographs below remain available when precise credit provenance is needed.

Reference-only visual previews are copied under `docs/reference/`: `design-01.jpg` through `design-04.jpg` and presentation pages 08, 09, 22, 23, 26. They are not used as interactive app screens. Latest design foundations specify Noto Sans CJK KR, Background #050B17, Surface #0C1B2D, Text #F4F7FF, Secondary #B9C8D8, Accent #64DCFF, Warm #F2C58D; 1920×1080 reference type sizes 60 headline / 36 title / 28–32 body / 22–24 labels, and spacing 8/16/24/32/48/64.

## Alternative full-disc images (downloaded before original assets were recovered)

The optimized JPEGs below retain the content and framing of the downloaded originals, resized to a maximum side of 1600 pixels and encoded at JPEG quality 91. Corresponding `.png` files retain the downloaded source bytes. They were obtained from the publicly accessible [Protonmatter/cosmos source repository](https://github.com/Protonmatter/cosmos), whose `solar-system.dc.html` captions and README identify the missions and image providers. NASA spacecraft images are generally public domain in the US; partner credits remain attached and no NASA endorsement is implied. See [NASA media usage guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/).

| App file | Image and credit | Downloaded source |
| --- | --- | --- |
| `mercury.jpg` | Mercury global mosaic, NASA / Johns Hopkins University APL / Carnegie Institution; MESSENGER. Grey, cratered Mercury, not the Moon. | https://raw.githubusercontent.com/Protonmatter/cosmos/main/planets/mercury.png |
| `venus.jpg` | Venus **colourized radar surface**, NASA / JPL-Caltech; Magellan. This is not a visible-light photograph of Venus's clouds. | https://raw.githubusercontent.com/Protonmatter/cosmos/main/planets/venus.png |
| `earth.jpg` | Earth full disc, NASA; DSCOVR. | https://raw.githubusercontent.com/Protonmatter/cosmos/main/planets/earth.png |
| `mars.jpg` | Mars global view centred on Valles Marineris, NASA / JPL-Caltech; Viking. | https://raw.githubusercontent.com/Protonmatter/cosmos/main/planets/mars.png |
| `jupiter.jpg` | Jupiter JunoCam full disc, NASA / JPL-Caltech / SwRI / MSSS; processed by a citizen scientist (individual processor not identified in mirror). | https://raw.githubusercontent.com/Protonmatter/cosmos/main/images/27-full-disc.png |
| `saturn.jpg` | Saturn and rings, Cassini mosaic 2016, NASA / JPL-Caltech / Space Science Institute. Use `object-fit:contain` so the rings remain visible. | https://raw.githubusercontent.com/Protonmatter/cosmos/main/planets/saturn.png |
| `uranus.jpg` | Uranus, Voyager 2, 1986, NASA / JPL-Caltech. | https://raw.githubusercontent.com/Protonmatter/cosmos/main/planets/uranus.png |
| `neptune.jpg` | Neptune, Voyager 2, 1989, NASA / JPL-Caltech; historical enhanced-blue rendering. | https://raw.githubusercontent.com/Protonmatter/cosmos/main/planets/neptune.png |
| `sun.jpg` | Sun, full disc in extreme ultraviolet, NASA / SDO; orange is a visualization of ultraviolet observations. | https://raw.githubusercontent.com/Protonmatter/cosmos/main/planets/sun.png |

Primary subject references: [NASA planets](https://science.nasa.gov/solar-system/planets/), [Sun](https://science.nasa.gov/sun/), [Moon](https://science.nasa.gov/moon/).

## Maps and textures

[Solar System Scope](https://www.solarsystemscope.com/textures/) maps are provided under [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/). Required credit: **Solar System Scope, CC BY 4.0; maps based on NASA mission observations**. Downloaded via [elymas/solar-simulator](https://github.com/elymas/solar-simulator), whose README supplies this attribution. The files were copied without visual alteration except where expressly described above.

- `night-sky.jpg` and `stars_milky_way.jpg`: the same `2k_stars_milky_way.jpg` map. A Milky Way panorama for a demonstration backdrop, **not** a live local sky photo or calculated sky position.
- `mercury-texture.jpg`, `jupiter-texture.jpg`, `mars-texture.jpg`, `saturn-texture.jpg`, `uranus-texture.jpg`, `neptune-texture.jpg`, `sun-texture.jpg`: original `2k_<body>.jpg` equirectangular maps.
- `venus_surface.jpg`: `2k_venus_surface.jpg`; a surface map, not clouds.
- `earth_daymap.jpg`: `2k_earth_daymap.jpg`.
- `moon.jpg`: `2k_moon.jpg`; **an equirectangular surface map, not a full-disc photograph**. Use as a mapped learning illustration and label it as such.
- `2k_saturn_ring_alpha.png`: ring texture, CC BY 4.0.

Mirror URL pattern: `https://raw.githubusercontent.com/elymas/solar-simulator/main/public/textures/2k_<name>.jpg`; ring file uses `.png`.

`moon-disc.jpg` was downloaded from `https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg`; despite the local filename this is also a surface map. It is not used as a Moon photograph; prefer the clearly attributed `moon.jpg` map.

## Remaining missing source materials

- Individual photographer/renderer credits and licenses for supplied concept vehicle/family imagery.
- Standalone original Figma source image/font files (the recovered PDFs retain embedded rasters).
- Original narration recordings.

A code-drawn cabin frame, a map backdrop and supplied rendered/composited cabin imagery are experience visualizations; they are not live glass projection, camera AR feeds, or vehicle control integration. No unrelated vehicle marketing photo was copied as a substitute.

## Packaging note

Only the images actually used by the app are shipped in `public/assets`: the original eight planets, original panoramic roof, front cabin, vehicle interior and night vehicle scene, the Milky Way map, the NASA Sun image, and `moon-full.jpg`. The vehicle interior and night scene were copied byte-for-byte from the recovered supplied originals for the vehicle environment update. Downloaded alternative NASA files, unused textures and family/reference images are preserved separately in `/workspace/starlight-reference-assets/` rather than included in the Site payload. File tables above retain their provenance for inspection.


## 2026-11-15 음성·음악 업데이트

- `public/audio/clair-de-lune.mp3`: Claude Debussy 작곡, Laurens Goedhart 2011년 연주·녹음, CC BY 3.0. 원본 변환 Akaniji. 녹음별 링크·사용 조건·해시와 미러 다운로드 검증은 [MUSIC.md](MUSIC.md)에 기록했습니다.
- 한국어 신화 3편: 승인된 HeyGen Annie 음성 합성 결과. 원문 출처·각색 대본은 기존 신화 크레딧을 유지합니다. 앱은 현재 외부 CDN을 재생하며, 오프라인 저장이나 전체 음성 청취 검증을 완료하지 않았습니다. [NARRATION.md](NARRATION.md)를 참고하세요.


## 행성별 BGM 업데이트

8개 행성에 각각 다른 요청 곡을 지정했습니다. 음원 자체의 권리와 작곡 저작권은 구분하며, 자세한 출처·수정·발췌·디지털 연주 범위는 [PLANET_MUSIC.md](PLANET_MUSIC.md), 실제 재생 검수는 [PLANET_MUSIC_QA.md](PLANET_MUSIC_QA.md)에 기록합니다. 런타임 파일·해시·권리는 `/audio/planets/catalog.json`, 원본 출처 대조는 `/audio/planets/provenance.json`입니다. 선정 이유는 앱에 싣지 않습니다.

로컬 7곡, 외부 Commons 원본 연결 1곡(목성 시칠리아노)입니다. 수성 미뉴엣은 KasraR 실제 연주의 22.2초 발췌, 천왕성 안단테·화성 알라망드·해왕성 사라방드는 명시된 디지털 연주입니다. 위 출처 목록에 이름만 확인된 다른 실제 연주를 사용한 것처럼 표시하지 않습니다.
