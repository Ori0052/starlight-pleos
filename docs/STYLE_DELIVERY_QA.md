# Production stylesheet delivery verification

On 2026-11-15 the local production build and previously packaged archive were inspected after a user reported an unstyled live screen.

The previous archive included the exact stylesheet and script referenced by `dist/index.html`; their hashes matched local output, and the cabin/sky background files were present. The latest script contains the current “별자리와 문화별 이야기” label rather than the older label visible in the user's report. Local packaged assets rendered correctly before the delivery change. These observations support a remote delivery or stale-version problem, but do not establish which live request failed.

## Compatibility repair check

`vite.config.mjs` adds a production-only post-build HTML transform. The compiled CSS is embedded in a `style[data-starlight-styles="bundled"]` element, and the separate stylesheet link is removed. The CSS asset remains in the bundle. Current background URLs use absolute public paths, so moving CSS into HTML does not change their resolution. The transform rejects missing styles, missing expected links and an unexpected closing-style sequence.

The exact rebuilt `dist/` output was served from a separate local static HTTP server. Installed Chromium deliberately aborted **every external stylesheet request**, including the Google Fonts CSS import.

Both tested sizes passed:

| Viewport | Inline CSS | Parsed rules | External stylesheet links | Result |
| --- | ---: | ---: | ---: | --- |
| 1920×1080 | 75,481 characters | 623 | 0 | Dark background, layout, cabin image and current guide label render. |
| 390×844 | 75,481 characters | 623 | 0 | Dark background, layout, cabin image and current guide label render; no document horizontal overflow. |

In both cases the main guide opens and exposes all three semantic tabs. The cabin image returns HTTP 200, the script returns HTTP 200 with JavaScript MIME type, and there are no uncaught browser errors. Blocking the optional font stylesheet does not remove the app's layout or color styles.

Evidence:

- `.qa/results/production-styles.json`
- `.qa/results/STYLES-css-blocked-1920.png`
- `.qa/results/STYLES-css-blocked-390.png`

Reproduce against the production output with a local static server:

```sh
python -m http.server 4175 --bind 127.0.0.1 --directory dist
node .qa/production-styles.mjs
```

`STARLIGHT_STATIC_QA_URL` can change the static-server address. The owned QA server was stopped after verification.

## Limit

This verifies the production artifact with external stylesheet requests unavailable. It does not verify authenticated live Sites responses, establish the original live error, bypass stale browser documents, or guarantee that live image/script requests succeed. Root is handling the live deployment check separately.
