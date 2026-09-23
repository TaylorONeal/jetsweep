# JetSweep store artwork and preview evidence

Seven PNGs in `screenshots/` are **mobile-web draft previews, not Android captures**.
They show actual app UI at 360×640 CSS pixels, scale 3 (1080×1920 output), with an
illustrative ATL flight on June 10, 2030, a fixed 5 AM clock, and New York timezone.
The airport-shortcut screen uses simulated Midtown Manhattan location. Each image
is a viewport excerpt, not the complete scrollable screen.

## Reproduce and inspect

```sh
npm ci
npx playwright install chromium
npm run screenshots:preview
```

The command builds the production web app, starts a local preview on port 4180,
captures all seven screens, and stops the server. For an existing preview, set
`JETSWEEP_PREVIEW_URL`. Set `JETSWEEP_SCREENSHOT_OUTPUT` to keep a separate run.
The generated manifest records source commit, browser version, viewport, sample
clock, location scenario, image dimensions, scroll positions, and SHA-256 hashes.
It explicitly records `nativeCapture: false`. Fonts are ready before each capture.

CI captures after browser tests and uploads `jetsweep-mobile-web-store-previews`.
Download that artifact for the exact reviewed commit; do not relabel it as a native
capture. Reviewed snapshots and their matching manifest are checked in for durable evidence.

## September 23 visual review and shot plan

All seven existing previews and the 1024×500 feature graphic were visually reviewed.
The dark/gold visual language, contrast, and readable controls are consistent.
Keep the icon and feature graphic. Fresh CI review identified the home-screen plane clipped by a 1px divider and
the review CTA overflowing a narrow viewport. Both were corrected in the actual UI
with bounded sizing/wrapping changes; capture now rejects horizontal overflow. The flight form,
journey and privacy screens are long, so these excerpts omit lower content. Do not
claim the privacy excerpt demonstrates the deletion controls or entire policy.

| Priority | Existing shot | Purpose | Final capture instruction |
| --- | --- | --- | --- |
| 1 | 04-plan | Show the actual leave-time recommendation | Capture native result header and estimate disclaimer; separate timeline shot below |
| 2 | 06-journey-options | Show customizable travel assumptions | Capture drive time, transport and party selection; avoid keyboard overlay |
| 3 | 03-review | Show transparent trip inputs and buffer | Include summary and selected buffer, with unclipped primary action |
| 4 | 05-airport-shortcuts | Show optional local airport discovery | Use disclosed sample location and no personal data; include full suggestion cards |
| 5 | 02-flight | Show airport/date entry | Scroll to include selected date/time; existing top excerpt omits these fields |
| QA only | 01-home, 07-privacy | Branding and policy evidence | Review decorative clipping; capture deletion controls separately |

Do not add fake phone frames, simulated Android system bars, live flight/traffic
claims, or artwork that obscures app controls. Final store screenshots must be
reviewed against the signed native candidate, with device/build provenance.

## Other assets

`store/` contains the owned 512×512 icon, 1024×500 feature graphic, source and Lucide
ISC license. Regenerate with `node scripts/prepare-android-artwork.mjs`.
`android-builds.json` is historical local build evidence, not current device QA.
Current APK/AAB availability and release gates are tracked in
[the Android checklist](../docs/ANDROID-LAUNCH-CHECKLIST.md). Historical local
`candidates/` directories are ignored and absent from the repository.
