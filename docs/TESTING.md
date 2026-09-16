# Current release verification — 2026-09-15

- 56 unit/form tests passed; TypeScript and ESLint passed (7 existing warnings).
- 10 Chromium/WebKit tests passed, including nonexistent New York DST time rejection,
  saved defaults/recent trips, denied location (unit coverage), and real origin outage.
- Android debug APK, unsigned release AAB, device-test APK and lint passed.
- Debug APK signature verifies; release AAB is unsigned. APK identity/API metadata checked.
- Android lint: 0 errors, 18 warnings (remaining template resources, splash-density and
  version notices). Legacy icon shape and missing monochrome warnings are resolved.
- No attached device: actual Android/permission/installation QA is NOT EXECUTED.
- Xcode license acceptance is now pending; Android did not require accepting it.
- Base upstream remains 9550c02; this preparation has not been pushed or merged.
- Candidate hashes, logs and source revision are in `release-assets/candidates/2026-09-15/`.

See [reviewer packet](ANDROID-REVIEWER-PACKET.md) and [device record](ANDROID-DEVICE-QA.md).

---

# Historical verification — 2026-09-10

The tested story is Home → flight details → journey options → review → local timing
calculation → departure timeline → edit/reuse saved trip. No API or database is involved.

## Automated coverage

- 54 unit/form tests: departure-window bounds across airports, buffer preferences, and
  transport modes; ordered timeline stages; bags/family/international offsets; overdue
  plans; invalid inputs; local dates; Thanksgiving; corrupted storage; full wizard submission
  and retained options when going back; traffic at road time and peak overlap; airport
  default/recent precedence, coordinate coverage and ranking, optional location, and denial.
- Playwright mobile Chromium (Pixel 7) and WebKit (iPhone 13): plan, edit, recent-trip reuse,
  saved/default persistence and real browser geolocation suggestions,
  browser Back, horizontal overflow, JavaScript errors, and offline reload.
- GitHub Actions: web checks, both browser engines, Android lint, debug APK, and unsigned
  release bundle, and device-test APK compilation. Remote results are recorded in the
  repository’s Actions checks.

## Local results

- TypeScript checks: passed.
- ESLint: passed with seven existing Fast Refresh warnings in shared UI primitives.
- Unit/form tests: 54 passed.
- Web production build: passed; PWA cache generated.
- Native web build and platform scaffolding: passed.
- npm audit: zero reported vulnerabilities after dependency updates.
- Mobile Chromium planning/edit/reuse/navigation and offline reload: passed.
- Mobile WebKit planning/edit/reuse/navigation and cached reload with the server shut down:
  passed. Browser total: **8 passed**. The outage test also completes a new calculation.
  WebKit's `context.setOffline(true)` simulation still fails on a minimal cache-only page,
  but the same page works with the actual server stopped. The regression now shuts down an
  isolated real origin and independently confirms it is unreachable before reloading.
  No test is skipped or marked as an expected failure. This verifies cached app behavior,
  not every real-device airplane-mode scenario.
- Android debug APK: `npm run android:debug` passed with Java 21, API 36, Build Tools
  36.0.0, and checksum-verified Gradle 8.14.3. APK signature verification passed (v2);
  packaged metadata confirms `com.jetsweep.app`, version 0.1.0/build 1, min API 24, target 36.
  Rebuilt with Capacitor Geolocation 8.2.2; packaged permissions include approximate
  location and network state, with no precise/background location permission.
- Android unsigned release bundle: passed. Both archives pass ZIP integrity checks, include
  the bundled web index, and exclude PWA service workers. Artifact sizes/hashes are recorded
  in `release-assets/android-builds.json`.
- Android lint: **0 errors, 30 warnings** after correcting manifest ordering. Remaining
  warnings cover generated icon/splash dimensions and shapes, missing themed monochrome
  icons, unused template resources, and available Gradle/AppCompat updates. These warnings
  are visible, not suppressed; artwork review remains a release requirement.
  `adb devices -l` found no attached Android device for installation checks.
- iOS binary: Xcode first-launch checks and Swift package resolution now succeed. Compilation
  is blocked by the missing iOS 26.5 platform component. The installed 26.2 simulator cannot
  serve as a destination for this Xcode. The 8.52 GB download was paused to prioritize Android.
- Five 1080×1920 browser preview screenshots are captured with a fixed sample date and clock.
  These document the UI; they are not evidence of native rendering or signed installation.

## Remaining manual checks

Physical-device rendering, Android system Back/gesture navigation, keyboard resizing,
TalkBack/VoiceOver, large text, device timezone changes, process death, signed installation,
store pre-launch/TestFlight checks, and final artwork review are not covered by browser
emulation. Android compilation is verified; runtime/device behavior and store release are not.

See [release checklist](RELEASE.md) for setup and publishing steps.

## Merge verification

Integrated upstream main timing/accessibility fixes before merge. The generated Android
instrumentation smoke test now checks the actual `com.jetsweep.app` package identity.
Device execution remains pending; `assembleDebugAndroidTest` compilation passed.

Privacy deletion also checks storage failures before reporting success.

## Independent branding candidate (September 15)

The platform cleanup retains 56 passing unit/form tests and 10 passing browser
checks. Android debug, unsigned release bundle and instrumentation APK rebuilt;
lint: 0 errors, 28 warnings after consistent day/night splash generation.
Browser favicon and image evidence, new hashes, and logs are in
`release-assets/candidates/2026-09-15-independent/`. No physical-device QA or iOS
compile was performed. This supersedes the earlier artwork candidate.

## September 16 follow-up

- `npm run check`: 56 tests pass, TypeScript passes, lint 0 errors/7 existing warnings, web build passes.
- `npm run test:e2e`: 14 pass across Chromium and WebKit. Added deletion/persistence
  verification and deterministic denied-location fallback. Permission denial is
  simulated at the browser API boundary; this does not test Android system dialogs.
- Production dependency audit: 0 known vulnerabilities at time of run.
- Android lint rerun: succeeds, 0 errors/28 existing warnings. Native runtime and
  package source unchanged; existing September 15 independent binaries remain applicable.
- Seven refreshed 1080x1920 mobile-web draft previews visually inspected. They are
  viewport captures with scrollable content, not final native store screenshots.
- adb still lists no devices; Android emulator/system images are not installed.
