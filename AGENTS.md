# JetSweep agent workflow

JetSweep is the airport departure timing application. Preserve the existing timing
engine, privacy promises, local storage behavior, package identity, and release gates.
Do not treat a successful web build, D-U-N-S issuance, or browser screenshot as native
release acceptance.

## When to load the delivery process

For feature/specification, UI, screenshots/store listing, build/native configuration,
or release changes, use the shared `app-delivery-process` skill when available.
Read its instructions before implementation. If the skill is unavailable, follow
this repository fallback so the workflow works in any checkout:

1. Read [documentation index](docs/INDEX.md), relevant feature/model documentation,
   and [Android launch checklist](docs/ANDROID-LAUNCH-CHECKLIST.md).
2. Identify the concrete task and acceptance evidence. Update the matching JS-* item
   or add a stable ID; preserve completed evidence and explicit unknowns.
3. Make bounded changes without rewriting unrelated libraries or changing schemas,
   package IDs, publisher facts, or privacy claims by assumption.
4. Run `npm run check`; for date/timing changes also run `npm run test:timezones`.
   Relevant UI changes require browser tests and visual review. Native changes require
   the Android CI build/lint path plus applicable device QA.
5. For UI/store changes, follow [artwork and capture process](release-assets/README.md),
   run `npm run screenshots:preview` where Chromium is available or inspect the CI
   artifact, and visually review affected screens. Keep source/browser/device/build
   provenance. Never relabel mobile-web previews as native captures.
6. Update related documentation and checklist with commands, commit/build evidence,
   actual pass/fail results and remaining blocker/owner. Never mark unexecuted QA done.

## Release-specific sources

- [Release tooling and requirements](docs/RELEASE.md)
- [Native device acceptance](docs/ANDROID-DEVICE-QA.md)
- [Store listing](docs/STORE-LISTING.md)
- [Data-safety evidence](docs/DATA-SAFETY-FACTS.md)
- [Reviewer packet](docs/ANDROID-REVIEWER-PACKET.md)

Publisher account details belong in the private GTM tracker. Do not commit account
IDs, identity documents, credentials, or signing keys. Production submission,
agreements, signing-key creation and other external actions require the applicable
user authorization. A checklist or skill does not grant that authorization.
