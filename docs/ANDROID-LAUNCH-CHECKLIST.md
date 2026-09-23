# JetSweep Android launch workstream

Audit date: September 23, 2026. Engineering baseline:
`1af454eed74c21b393ef99a4bceb030bd2b6713d` (main).
Status: **engineering candidate built; release acceptance incomplete**.

This is the airport timing app workstream. Keep it independent of CueCraft,
WakeState, and AlpinePack. Shared publisher verification is an external dependency;
D-U-N-S issuance alone does not make the app approved or ready for production.

## Verified preparation

- [x] Capacitor Android project, application ID `com.jetsweep.app`, version 0.1.0/build 1.
- [x] Target/compile API 36, minimum API 24; Java 21 and Node 22 CI.
- [x] Web checks/browser tests and Android build pipeline passed at the baseline.
- [x] Debug APK, unsigned AAB, and lint report available from the
  [successful baseline run](https://github.com/TaylorONeal/jetsweep/actions/runs/35047503207).
- [x] Store copy, icon, feature graphic, and code-based data-safety inventory prepared.
- [x] Offline bundled planner; no accounts, ads, payments, or analytics in current code.

Artifact availability was checked September 23; GitHub lists expiration December 15,
2026. These are engineering artifacts, not a signed release. Download from that run
or rebuild the approved commit. Do not rely on the historical local candidate paths
in earlier notes: those directories are not in the repository.

## Do now while publisher verification is pending

| Work | Owner | Acceptance evidence | Status |
| --- | --- | --- | --- |
| Device acceptance | Release tester + engineering | Complete every applicable row of [device QA](ANDROID-DEVICE-QA.md), API 24 and API 36+, with build hash/device/WebView version | NOT RUN |
| Native screenshots | Release tester | Capture actual final native UI; replace mobile-web previews for store use | NOT RUN |
| Public privacy/support | Publisher + engineering | Confirm owned stable URLs, real support contact, hosting disclosures, and add approved identity/contact to privacy page | BLOCKED on publisher inputs |
| Final SDK/data review | Engineering + publisher | Review final merged manifest/dependencies, local storage/backup/location behavior; approve [facts](DATA-SAFETY-FACTS.md) against final binary | DRAFT only |
| Package/upload-key ownership | Publisher | Verify package availability, versionCode, Play App Signing setup and upload-certificate custody | NOT VERIFIED |
| Release candidate | Engineering | Rebuild approved commit, sign with approved upload key, verify certificate, record binary SHA-256 | UNSIGNED only |
| Listing package | Publisher + engineering | Reviewed title/copy/category, graphics, support/privacy URLs, native screenshots, audience/content-rating/app-access/Data Safety answers | DRAFT only |

Keep publisher account IDs, credentials, D-U-N-S documents, and signing material
out of this public repository. Shared account status belongs in the private GTM
tracker. The prior closed-account note is historical and must not be treated as the
current account state.

## When the organization account is verified

1. Confirm the active Play Console organization and legal identity, then create or
   verify JetSweep's app record with the existing package ID. Do not casually rename it.
2. Configure Play App Signing and upload-key handling; upload the signed AAB to
   internal testing. Record upload certificate, versionCode, and build hash securely.
3. Install through Play, run update/restart/offline/location tests and review the
   pre-launch report. Resolve crashes, policy warnings, and accessibility defects.
4. Complete final listing and policy declarations from the reviewed evidence.
5. Check the account's actual production-access/testing requirements. Do not infer
   an exemption or a mandatory closed-test duration from the old personal account.
6. Request production submission approval only when every gate has evidence.

## Release stop conditions

No production submission with unsigned artifacts, unexecuted native QA, missing
privacy/contact URLs, unverified package/key ownership, or unresolved Play review
findings. Do not describe estimates as live traffic, flight, or security-wait data.

This audit changed documentation only. It did not execute new native/device tests,
configure signing, edit account settings, accept agreements, or submit to a store.

## Automated timezone regression coverage

`npm run test:timezones` runs departure/timeline tests in separate Node processes
for UTC, New York, London, and Makassar. It checks real seasonal offsets, local
midnight persistence, previous-day departure plans, and US/UK spring-forward gaps.
CI runs this alongside existing web and Android checks. This does not replace
physical-device clock/timezone, WebView, or offline acceptance.

## Actionable backlog IDs

| ID | Next action | Owner | Blocker / required evidence |
| --- | --- | --- | --- |
| JS-01 | Download exact-commit CI preview artifact and review seven images + manifest | Engineering/reviewer | CI run and manifest hashes; browser previews only |
| JS-02 | Capture API 24 and API 36+ installed candidate results for every QA row | Release tester | Devices + candidate hash; record WebView, navigation mode, actual pass/fail |
| JS-03 | Capture native plan, journey, review, shortcuts, flight shots using shot plan | Release tester | JS-02; signed candidate, device provenance and unclipped controls |
| JS-04 | Supply approved publisher contact and owned support/privacy URLs; implement and verify live pages | Publisher then engineering | Real approved values; HTTP reachability and matching in-app/store links |
| JS-05 | Verify package/version availability and approved upload-key custody | Publisher | Console evidence and upload certificate; never commit key or credentials |
| JS-06 | Build signed release candidate and verify its signer and SHA-256 | Engineering | JS-05; approved key access, reproducible commit and signing evidence |
| JS-07 | Review final merged manifest/SDKs against data inventory and policy questionnaires | Publisher + engineering | JS-04/06; signed build and approved Data Safety, audience, rating/app access |
| JS-08 | Install via Play internal testing, repeat recovery/offline, resolve pre-launch findings | Release tester + engineering | Organization verification and JS-06; report + device results |
| JS-09 | Submit production release after checklist acceptance | Publisher | JS-02 through JS-08 complete; account-specific testing/production access met |

JS-01 is automatically prepared by CI, not evidence that JS-02 or JS-03 passed.
The September 23 local runtime could not launch Chromium (download archive failure);
CI capture status and visual review of its output must be checked separately.
