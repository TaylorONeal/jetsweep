# UX and timing model

The primary flow is Home → Your flight → Your journey → Review → Departure plan.
Progress rewards completing useful planning steps. There are no streaks, artificial delays,
or incentives to choose smaller safety margins. Calculation is immediate.

The journey step exposes transport, drive time, travel party, security programs, and bags.
The review step explains buffer choices and crowd/weather modifiers. Car means curbside
drop-off; parking/shuttle time is not included. Rideshare starts with requesting a ride,
so the result labels that action explicitly rather than calling it the physical leave time.

Recent trips retain all selected options. Reopening a trip opens an editable form with its
original departure; expired trips must be updated. Recent trip data is validated before use.
The Privacy page explains local storage and allows clearing it.

## Time assumptions

All input and output uses the **device timezone**, named in the form and results. An airport
in another timezone requires the traveler to convert the departure time. Airport-timezone
selection is not implemented. Default dates use local calendar fields, not UTC dates.

The model works backward from departure using airport tier estimates. The full departure
window includes travel stages, gate buffer, and the boarding-start offset. It excludes the
boarding duration from that sum because the boarding-start offset already includes it.
The recommended start must lie within that window. Overdue recommendations retain their
original timestamps and show an expired-plan warning; they are never silently shifted to now.
Future countdowns use days/hours or hours/minutes rather than unbounded hour totals.

Rush-hour classification checks the actual drive interval, including peak periods crossed
between its endpoints. The planner starts without a traffic allowance and expands it up to
three times as the longer drive moves its start earlier. Holiday checks remain tied to the
flight date. Holiday modifiers are heuristics, not live forecasts.
Weather adds rideshare pickup time, not live route conditions. The UI discloses those limits.
Airline check-in, bag-drop, and boarding cutoffs must be checked separately.

## Accessibility and native layout

- Native selects and date/time inputs; explicit labels and visible keyboard focus.
- Date/time fields stack on small screens so native input text does not clip.
- Selected options expose `aria-pressed`; errors use `role=alert`.
- Touch controls, reduced-motion support, pinch zoom, and landscape safe-area padding.
- Capacitor SystemBars CSS inset fallback supports Android WebViews and iOS safe areas.
- System font fallbacks are bundled by the operating system; no remote font request.
- Native builds disable PWA service-worker generation to prevent stale web bundles.

Airport defaults and location suggestions are documented in [Airport selection](AIRPORT-SELECTION.md).

Integration retains upstream revised airport buffer ranges, risk weights, and pickup timing.
The upstream full-budget accumulation includes gate cushion and boarding offset; actual-drive
rush-hour classification and original overdue timestamps remain applied.
