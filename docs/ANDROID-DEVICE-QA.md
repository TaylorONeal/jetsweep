# Android physical-device acceptance record

Evidence date: 2026-09-15. Owner: Taylor/release tester. Status: **NOT EXECUTED**.
`adb devices -l` returned no devices. Browser emulation and compiled instrumentation tests
are not device evidence. Complete this record against the candidate SHA-256 in the packet.

Record: tester / date / device model / Android API / navigation mode / WebView version /
candidate hash / installation source / pass-fail evidence link. Test API 24 and API 36+.

| Test | Steps and expected result | Actual result |
|---|---|---|
| Install/launch | Install debug APK via adb; cold launch with no blank frame/crash; inspect icon/splash | NOT RUN |
| Core plan | JFK, future date/time, 55 min drive, checked bag; review and create ordered plan | NOT RUN |
| Input errors | Empty airport, past departure, bad/empty drive time; actionable error without losing inputs | NOT RUN |
| Persistence | Set LAX default; choose JFK; force-stop/reopen → LAX; clear default/reopen → JFK | NOT RUN |
| Recent recovery | Save trip, kill process/reopen, reopen trip; all options retained; expired trip needs new date | NOT RUN |
| Offline | Launch once; airplane mode; force-stop/reopen; create/edit plan without network | NOT RUN |
| Location denial | Tap location, deny; keep manual selection; app remains usable | NOT RUN |
| Approximate location | Grant approximate access; select suggestion; no background/precise permission requested | NOT RUN |
| Location unavailable | Disable system location; retry/manual search remains usable | NOT RUN |
| Navigation | System Back / gesture Back from form and result; keyboard does not trap navigation | NOT RUN |
| Insets/keyboard | Portrait/landscape, keyboard open, gesture/three-button nav; controls reachable above system bars | NOT RUN |
| Accessibility | TalkBack labels/order, 200% text/display scale, reduced motion; no clipped primary controls | NOT RUN |
| Clock/timezone | Change timezone; confirm displayed device zone and flight conversion; test DST gap and midnight | NOT RUN |
| Privacy reset | Clear recent plans and saved airport preferences; reopen and confirm deletion | NOT RUN |
| Themed icon | Light/dark wallpaper, themed icons on/off; plane visible and centered without clipping | NOT RUN |
| Signed candidate | Install through Play internal testing; update existing install with same signer; repeat recovery/offline | BLOCKED: publisher/signing |

Developer commands (do not substitute them for recording results):

```sh
adb devices -l
adb install -r release-assets/candidates/2026-09-15/jetsweep-0.1.0-build1-debug.apk
adb shell am force-stop com.jetsweep.app
adb shell monkey -p com.jetsweep.app 1
# Only after a device is connected:
JAVA_HOME="$HOME/.local/share/jetsweep-toolchain/jdk" ANDROID_HOME="$HOME/Library/Android/sdk" \
  ./android/gradlew -p android :app:connectedDebugAndroidTest
```

Closure: all rows have actual pass/fail evidence against the final signed candidate;
failures are fixed and relevant rows retested. Publisher facts are handled by Admin.
