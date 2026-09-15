# JetSweep Android reviewer packet — 2026-09-15

Owner: JetSweep engineering task for code/artifacts; Taylor/Admin for publisher and signing;
release tester for device acceptance. **Unsigned engineering candidate, not store-ready.**

## Candidate and identity

Existing code identity `com.jetsweep.app`, version 0.1.0/build 1 is preserved, not claimed as
verified publisher-owned. Artifacts and hashes: `release-assets/candidates/2026-09-15/manifest.json`.
Debug APK uses a local development signer. Release AAB is unsigned. No account agreements,
new signing keys, production auth changes, store uploads, push, or merge were performed in this pass.

Admin reported the previous publisher account closed for inactivity and non-reactivatable;
no replacement account or owned package identity is verified. Account follow-up stays with Admin.

## Reviewer walkthrough (no account required)

1. Open app → Plan my departure. Choose JFK; choose a future local date/time.
2. Enter 55 minutes driving time, checked bag and PreCheck; review and build the plan.
3. Read recommended request-ride time, full window and stage estimates; edit details.
4. Save an airport default; restart a new plan. Remove default to use the most recent airport.
5. Optional Use my location → accept/deny; selection requires a tap. Outside supported US
   coverage, manual airport selection remains available.
6. Open Privacy; clear recent plans and airport preferences. Repeat offline after first load.

No login, paywall, subscriptions, advertisements, push notifications or live flight/traffic API.
Location is a one-time, user-requested approximate reading; coordinates are processed locally
and not persisted/uploaded by JetSweep. OS/provider behavior remains platform-controlled.
Recent plans/defaults remain in local storage; OS backups may retain app data.

## Listing and disclosures

- Reviewed copy: [store listing](STORE-LISTING.md), with planning-estimate/timezone limits.
- In-app privacy text: `src/pages/Privacy.tsx`; real support contact and stable public privacy/
  support URLs must come from the publisher. No placeholder URL is presented as live.
- Suggested category for publisher review: Travel & Local. Confirm audience/content rating
  and app-access answers in the actual publisher account. Data Safety requires review of
  the final binary/SDKs and current form; this document is not a submitted declaration.
- Graphics: `release-assets/store/play-icon-512.png` and `feature-graphic-1024x500.png`.
  Sources and Lucide ISC license are adjacent; no remote image/font dependency.
- Five browser preview screenshots remain illustrative, not native screenshots. Replace with
  final-device captures after [physical-device QA](ANDROID-DEVICE-QA.md).
- Artwork dimensions follow [Google Play preview asset guidance](https://support.google.com/googleplay/android-developer/answer/9866151).

## Exact remaining signing/publishing step

Admin/Taylor must verify an active publisher, ownership/availability of `com.jetsweep.app`,
versionCode availability and an upload-key arrangement. If an existing upload keystore is
provided, copy the unsigned AAB and sign the copy using that key; never commit credentials:

```sh
# Replace the two named placeholders with the verified keystore path and alias.
# jarsigner prompts for credentials interactively; do not put passwords in shell history.
"$JAVA_HOME/bin/jarsigner" -keystore /path/to/verified-upload.jks \
  -signedjar /path/to/jetsweep-signed.aab \
  release-assets/candidates/2026-09-15/jetsweep-0.1.0-build1-unsigned.aab verified-upload-alias
"$JAVA_HOME/bin/jarsigner" -verify -verbose -certs /path/to/jetsweep-signed.aab
```

Then verify the signer certificate matches the publisher's upload certificate, execute the
physical-device/internal-test checklist, complete listing/contact/Data Safety declarations,
and obtain store-submission authorization. Do not confuse a debug signature with release signing.

Closure gates: active/verified publisher + identity/key; signed candidate + certificate check;
actual device results; real URLs/contact; final screenshot/artwork approval; explicit submission.
