# Airport shortcuts

New plans start with the saved default airport, otherwise the last selected airport,
otherwise the most recent completed trip. Opening/editing an existing trip always keeps
that trip's airport and options. A default is only changed with the explicit default button.
Search/manual selection remains available. Preferences are validated against supported
codes; blocked storage does not prevent planning. Privacy includes a preference reset.

“Use my location” performs a one-time, user-initiated location request. Android requests
approximate location only; iOS includes the usage descriptions required by the official
Capacitor Geolocation plugin. No background watch is started. Coordinates are kept only in
memory long enough to rank airports; JetSweep neither persists nor uploads them.

Up to three supported airports within 200 km are shown, ranked by great-circle distance.
The user must tap a suggestion to select it. Distances do not estimate driving time. The
existing airport drive-time default still needs traveler confirmation. Location failure,
denial, timeout, excessive uncertainty (>50 km), and unsupported regions retain manual
selection. Current airport coverage is US-only; being in another country does not select
a distant US airport.

## Coordinate provenance / audit — 2026-09-10

- New canonical file: `src/lib/airportCoordinates.json`; previously no airport coordinates.
- Source: [OurAirports public-domain registry](https://ourairports.com/data/), downloaded
  from [the source CSV](https://raw.githubusercontent.com/davidmegginson/ourairports-data/main/airports.csv).
- Fields copied as named `latitude` / `longitude` from `latitude_deg` / `longitude_deg`.
  [Source field definitions](https://ourairports.com/help/data-dictionary.html).
- Every supported airport matched one US medium/large airport record; code coverage,
  uniqueness, bounds, self-nearest distance, and NYC alternatives are tested.
- Legacy PBI matches the registry's KPBI identifier (West Palm Beach), now labeled DJT in
  that registry. Existing app codes are preserved; this alias refers to the same airport.
- Limitations: registry coordinates are airport reference points, not terminal entrances.
  Individual operator/map-pin verification of every airport is not claimed. There is no
  map UI to audit; nearby cards and selection are verified in mobile browser tests.
- Generic size choices are excluded from location matching.

Native permission setup follows [Capacitor Geolocation](https://capacitorjs.com/docs/apis/geolocation).
Real Android/iOS permission dialogs and location-provider behavior still need device QA.
