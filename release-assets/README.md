# Pre-release artwork

`screenshots/` contains five 1080×1920 browser-preview images using an illustrative ATL
flight in June 2030, a fixed sample clock at 5 AM, and the America/New_York device timezone. The fifth uses a simulated Midtown Manhattan location to show airport shortcuts. They show actual app UI,
but do not prove native-device behavior. Review and replace with native release-candidate
captures before store submission if platform UI differs.

To regenerate, start a production preview on port 4180, then run:

```sh
node scripts/capture-screenshots.mjs
```

Set `JETSWEEP_PREVIEW_URL` for a different local preview. Publisher metadata is drafted in
[the store listing](../docs/STORE-LISTING.md). Existing native icons derive from `resources/icon.png`.

`android-builds.json` records the locally verified debug APK and unsigned release bundle.
The binaries remain in ignored `android/app/build/outputs/` directories; regenerate them
with `npm run android:debug` and `npm run android:bundle`. These are build artifacts, not
proof of physical-device testing or store approval.

September 15: new Android legacy/adaptive/themed icons and Play graphics are reproducible
with `node scripts/prepare-android-artwork.mjs`. Store sources and ISC license are in `store/`.
The unsigned candidate, checksums, QA packet and evidence are in ignored `candidates/2026-09-15/`.

## September 16 store-review supplement

Seven refreshed PNGs in `screenshots/` are **mobile-web draft previews**, not Android
captures. Captured at 360x640 CSS pixels, scale 3, using sample future flight data
and a fixed clock. They show real scrollable UI; each image is a viewport excerpt.
Added journey options and privacy to the five earlier flows. Store upload requires
final native/device capture review. Existing owned 512px Play icon and 1024x500
feature graphic are reused unchanged. See `docs/DATA-SAFETY-FACTS.md`.
