# Verification — 2026-09-10

The tested story is Home → flight details → journey options → review → local timing
calculation → departure timeline → edit/reuse saved trip. No API or database is involved.

## Automated coverage

- 53 unit/form tests: departure-window bounds across airports, buffer preferences, and
  transport modes; ordered timeline stages; bags/family/international offsets; overdue
  plans; invalid inputs; local dates; Thanksgiving; corrupted storage; full wizard submission
  and retained options when going back; traffic at road time and peak overlap; airport
  default/recent precedence, coordinate coverage and ranking, optional location, and denial.
- Playwright mobile Chromium (Pixel 7) and WebKit (iPhone 13): plan, edit, recent-trip reuse,
  saved/default persistence and real browser geolocation suggestions,
  browser Back, horizontal overflow, JavaScript errors, and offline reload.
- GitHub Actions: web checks, both browser engines, Android lint, debug APK, and unsigned
  release bundle. Added,
  but not executed remotely in this session.

## Local results

- TypeScript checks: passed.
- ESLint: passed with seven existing Fast Refresh warnings in shared UI primitives.
- Unit/form tests: 53 passed.
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
