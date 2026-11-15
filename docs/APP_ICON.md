# STARLIGHT PLEOS app icon

Created 2026-11-15 with OpenAI image generation for this app. This is original generated brand artwork, not a celestial photograph or an official Hyundai/Pleos corporate mark. The user's latest direction prioritizes organic planetary forms, a recognizable four-point star, Gestalt closure and optical balance. Open circular crescents and a tilted orbital band share flowing boundaries around the star. Larger black cutouts reduce the solid mass; interrupted outer curves suggest the rest of the spherical planet through closure. The star proportion, orbital tilt and crescent openings differ from the user-supplied construction reference. It has no lettering, glow, construction guides or colored accents.

The final 1254×1254 image-generation master is retained at `/workspace/generated_images/exec-485f8d43-00c1-4f4e-8d80-369309d2590e.png`. ImageMagick exports change resolution only; the exported artwork is not creatively retouched in code. This is raster artwork, not an assertion of exact vector construction. The regular and maskable 512 px files use the same composition, whose meaningful symbol fits the circular safe area, without an inset background seam.

| Export | Use |
| --- | --- |
| `/icons/starlight-icon-1024.png` | 1024×1024 master download |
| `/icons/icon-512.png`, `/icons/icon-192.png` | Web manifest `any` icons |
| `/icons/icon-maskable-512.png` | Opaque maskable 512×512; meaningful artwork kept inside the circular safety region |
| `/icons/apple-touch-icon.png` | 180×180 Apple home-screen icon |
| `/icons/favicon-32.png` | Browser tab PNG |
| `/favicon.ico` | 16/32/48 px browser fallback |
| `/downloads/starlight-pleos-icons.zip` | Export bundle, web manifest and usage notes |

The background bleeds to straight square edges. The OS applies its own corner or circular mask. Meaningful maskable artwork is inset within the central circular safety region; do not add rounded corners to exported artwork.

`index.html` links the browser and Apple icons plus `/manifest.webmanifest`. The manifest declares app identity, home route, standalone display, color and icon variants. This adds web icon metadata; it does not add an offline service worker or establish installation eligibility in every browser. Existing app behavior and audience are unchanged.

The approved mark also replaces the former `✦` in the shared app header. `src/BrandMark.tsx` renders the existing `/icons/icon-512.png` through an SVG luminance mask, so the icon's black background is transparent over the night scene. The display viewBox removes empty source margins without altering the approved silhouette. The SVG is a raster-backed display wrapper, not a vector tracing. Existing wordmark text remains beside it, and the home button has Korean/English accessible names. Desktop/mobile sizes are shared in `src/brandMark.css`.

Header verification covered 320/360/390/768/1003/1920 px in Korean/English and default/large text. An initially observed 320 px overflow was corrected with compact spacing and wordmark sizing; the final eight 320/360 cases passed, along with the unaffected wider layouts. The Korean language-switch label no longer wraps vertically. The approved source icon bytes are unchanged. Desktop/mobile captures confirmed the SVG mask paints the mark without a black rectangle. Keyboard Enter from the Vehicle page activated the named home button and returned to Sky. Final TypeScript/Vite build and diff checks passed. Evidence: `.qa/results/brand-logo.json`, `brand-logo-followup.json`, `brand-logo-narrow-final.json` and `BRAND-*.png`.

These are web/master exports. No native Android/Pleos launcher or store submission is configured; a native project would need its own adaptive foreground/background assets, density resources and device-mask verification.

Verification covers exported dimensions/opacity, manifest/head references, production build output and browser image decoding. Physical iOS/Android/Pleos installation is not verified.

Final export, masking and browser evidence is recorded in `.qa/results/app-icon.json`; the checks cover these exact current files rather than earlier design drafts.

The current production build, ZIP integrity, four head references, PNG/ICO/manifest/ZIP HTTP responses and all six PNG decodes passed. No uncaught browser errors were observed. Independent source-image measurements found the bright-pixel centroid 0.13% left and 0.87% above center, with no material optical imbalance; maximum bright radius is 34.60% of canvas width, within the 40% maskable safety radius. The planet/orbit/star read at 32 px, with fine taper softening; at 16 px the star becomes a bright central fleck. These raster measurements are not a claim of exact vector congruence.
