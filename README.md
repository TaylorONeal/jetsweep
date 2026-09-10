# JetSweep

A mobile airport departure planner. Choose your flight, personalize your journey, and receive
a conservative, explainable timeline with buffers for security, bags, and airport access.

## Develop and verify

Requires Node 22+. Use npm and the committed package-lock.json.

```sh
npm ci
npm run dev          # Vite; prints its available local URL
npm run check        # TypeScript, ESLint, unit/form tests, production PWA build
npx playwright install chromium webkit
npm run test:e2e     # Mobile Chromium + WebKit; includes offline reload
npm run build        # PWA → dist/
npm run preview
```

## Native apps

Android and iOS projects are scaffolded with Capacitor 8.4.3. The Android target is API 36;
iOS uses Swift Package Manager and requires Xcode 26+. Native web bundles disable the PWA
service worker and contain no remote font dependency.

```sh
npm run cap:sync      # build native bundle; sync both projects
npm run cap:android   # sync and open Android Studio
npm run android:debug # requires Java 21 and Android SDK; detects standard local installs
npm run android:lint  # Android lint checks
npm run android:bundle # unsigned release bundle; signing is configured separately
npm run cap:ios       # sync and open Xcode
```

These are development/release-preparation commands, not store submissions. Signing, device
QA, publisher metadata, and store assets need completion before release.

See [documentation index](docs/INDEX.md), [release checklist](docs/RELEASE.md),
[UX/model assumptions](docs/UX-AND-MODEL.md), and [test results](docs/TESTING.md).

The planner is deterministic and local. It does not fetch live traffic, flight status,
security waits, or airline cutoffs. All times use the device timezone shown in the interface.
Recent plans stay in local storage and can be deleted from the Privacy page.

Optional one-time location suggestions and saved airport defaults reduce repeat entry.
See [airport selection](docs/AIRPORT-SELECTION.md) for coverage and privacy details.
