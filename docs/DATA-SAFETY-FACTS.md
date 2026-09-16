# Privacy and data-safety facts for publisher review

Prepared September 16, 2026 from current repository code. This is an evidence
sheet, not submitted policy answers or a legal attestation. The publisher must
review the final signed build and hosting arrangement before submission.

| Data/capability | Observed app behavior | Evidence |
| --- | --- | --- |
| Flight plans | Up to five recent plans saved locally: airport, flight date/time, travel options and calculated timing. No server upload code. | src/lib/recentSearches.ts |
| Airport preferences | Default and most recent airport saved in local storage. | src/lib/airportPreferences.ts |
| Location | Requested only when the user taps Use my location; one reading, low accuracy requested, nearby search computed locally. No coordinate persistence or transmission in app code. | src/components/AirportShortcuts.tsx; src/lib/nearbyAirports.ts |
| Android permission | Coarse location and internet permissions declared; no background or fine-location permission in the app manifest. | android/app/src/main/AndroidManifest.xml |
| Deletion | Separate controls remove recent plans and airport preferences. Browser/app data removal also clears local state. | src/pages/Privacy.tsx |
| Backups | Android allowBackup=true. System backup settings may retain app data; do not promise deletion from device backups. | AndroidManifest.xml |
| Accounts/ads/analytics | No sign-in, advertising, analytics or payment integration in current application code. | src; package.json |
| Hosting | Web visitors request files from the selected host; provider access logs and policies are not established here. Native app bundles its web files. | vite.config.ts; capacitor.config.ts |
| Accuracy | Deterministic estimates; no live traffic, airline status or security-wait feed. Device timezone is used. | src/lib/timeline.ts; listing draft |

Do not equate a location permission with off-device collection, or automatically
copy “no data collected” into a store form. Review the current store definitions,
final dependencies, backup behavior, and actual hosting before selecting answers.
The app's own data flows are local; platform/OS/provider behavior needs publisher
review. No retention promise or legal identity has been invented.

## Remaining publisher inputs

- Verified legal publisher, package ownership and support contact.
- Owned public privacy/support URLs and hosting-provider disclosures.
- Final Data Safety, audience, content rating and permissions declarations.
- Signed native/device testing and final review of store screenshots.
