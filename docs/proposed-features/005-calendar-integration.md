# PRD: Calendar Integration

> **PROPOSED FEATURE - DO NOT IMPLEMENT WITHOUT CONFIRMATION FROM TAYLOR**
>
> This document represents a proposed enhancement to JetSweep. It is meant for review, discussion, and refinement before any implementation work begins. The ideas here are exploratory and subject to change based on feedback, technical feasibility, and strategic alignment.

---

## Document Information

| Field | Value |
|-------|-------|
| **PRD ID** | PRD-005 |
| **Feature Name** | Calendar Integration |
| **Status** | Proposed |
| **Author** | Claude (AI Assistant) |
| **Created** | 2026-02-01 |
| **Priority** | P1 - High Value for User Convenience |

---

## Executive Summary

Calendar Integration allows JetSweep to import flight information from users' calendars and export departure times back to their calendar. This creates a seamless loop: book a flight, JetSweep sees it; plan your departure, the calendar knows when you're leaving. Calendar is where people manage their time—JetSweep should integrate with that reality, not compete with it.

---

## The Job To Be Done

### Core Job Statement

> **When I** book a flight and it appears in my calendar,
> **I want to** automatically have JetSweep plan my departure for that flight,
> **So I can** see my "leave for airport" time right alongside all my other commitments.

### Deeper Narrative: The Calendar Is the Source of Truth

For most people, the calendar isn't just where they track appointments—it's how they understand their day. A flight that's not in the calendar doesn't feel real. A departure time that's not in the calendar doesn't get respected.

**Elena's Story:**

Elena books a flight from SFO to Boston. Her booking confirmation goes to her email. Gmail automatically creates a calendar event for "Flight SFO → BOS • 2:00pm" on March 10th.

A week later, she opens her calendar to plan that day. She sees:
- 9:00am - Team standup (30 min)
- 2:00pm - Flight SFO → BOS

She thinks: "I have the morning free. Maybe I can squeeze in that coffee meeting."

But wait—her flight is at 2pm. When does she actually need to leave? She doesn't know. She'd need to open JetSweep, enter all the details, calculate, then mentally figure out if that coffee meeting works.

**The Integrated Experience:**

With Calendar Integration, Elena's calendar shows:
- 9:00am - Team standup (30 min)
- **11:00am - 🚗 Leave for SFO (JetSweep)**
- 2:00pm - Flight SFO → BOS

Now she immediately sees: "I have 9-11am free. Yes to coffee at 9:30."

The departure time isn't hidden in another app—it's embedded in the tool she uses to plan her life.

### Why Calendar Integration Matters

1. **Meets users where they are**: Calendar is daily-use; JetSweep is occasional-use
2. **Eliminates manual work**: No re-entering flight details that already exist digitally
3. **Creates blocking effect**: Calendar event prevents scheduling conflicts
4. **Enables reminders**: Users get calendar reminders they already trust
5. **Family coordination**: Shared calendars mean shared awareness

---

## User Personas & Their Jobs

### Persona 1: The Calendar-Driven Professional
**Job:** "My calendar runs my life—travel needs to fit into that system."

- Lives by their calendar
- Expects everything time-based to be in one place
- Frustrated when travel info is scattered across apps
- Wants departure time as a real calendar event

### Persona 2: The Automation Enthusiast
**Job:** "I don't want to enter information twice—systems should talk to each other."

- Values workflow automation
- Knows their flights are already in their calendar (via Gmail, TripIt, etc.)
- Expects modern apps to import data, not require re-entry
- Frustrated by manual data transcription

### Persona 3: The Family Coordinator
**Job:** "I need my spouse to see when we're leaving so they're ready on time."

- Uses shared family calendar
- Needs departure time visible to everyone
- Uses calendar as coordination tool, not just personal record
- Values the "external authority" of a calendar event

### Persona 4: The Meeting Scheduler
**Job:** "I need to know what time I'm unavailable on travel days."

- Uses calendar availability for meeting requests
- Doesn't want to block off entire day "just in case"
- Wants precise "busy" time for departure period
- Values accurate availability display

---

## Functional Requirements

### FR-1: Calendar Import (Read)
Detect flights in user's calendar and offer to create JetSweep trips.

**Supported patterns:**
- "Flight [Airline] [Number]"
- "[Airport] → [Airport]"
- "Flight to [City]"
- Events containing flight confirmation details in notes
- TripIt-generated events
- Airline app-generated events
- Gmail-generated flight events

**Import flow:**
1. Request calendar read permission
2. Scan future events for flight patterns
3. Present detected flights to user
4. User confirms and provides any missing details
5. JetSweep creates trip with imported data

### FR-2: Calendar Export (Write)
Add "Leave for airport" event to user's calendar.

**Event details:**
- Title: "🚗 Leave for [Airport] (JetSweep)"
- Start time: Calculated departure time
- End time: Start time + 30 minutes (or travel duration)
- Alert: 15 minutes before (configurable)
- Location: User's departure point (if known)
- Notes: "Flight at [time] to [destination]. Allow [X] minutes for airport."

### FR-3: Smart Detection
Intelligently parse flight information:
- Extract airport codes from city names ("Boston" → BOS)
- Detect domestic vs. international from airports
- Handle multi-segment trips (detect connections)
- Ignore past flights

### FR-4: Two-Way Sync (Advanced)
Keep calendar and JetSweep in sync:
- Flight time changes in calendar → Update JetSweep trip
- JetSweep departure time changes → Update calendar event
- Trip deleted → Remove calendar event

### FR-5: Calendar Selection
User chooses which calendars to:
- Read from (for import)
- Write to (for export)
- Ignore (work calendar, for privacy)

### FR-6: Conflict Detection
Warn when departure time conflicts with other events:
- "You have a meeting at 10am—your departure time is 10:30am. Is that enough time?"
- Suggest adjusting risk preference to accommodate

---

## Technical Requirements

### TR-1: iOS Calendar Framework
Use EventKit for native iOS calendar access:
- `EKEventStore` for permission and access
- `EKEvent` for reading/writing events
- Background refresh to detect new flights

### TR-2: Calendar Permission Flow
```swift
// Request access
eventStore.requestAccess(to: .event) { granted, error in
    // Handle permission result
}
```

**Permission types:**
- Full access: Can read and write all events
- Add-only access (iOS 17+): Can only add new events
- Denied: Cannot access calendar

### TR-3: Flight Pattern Matching
```typescript
const flightPatterns = [
    /Flight\s+([A-Z]{2})\s*(\d{1,4})/i,           // "Flight UA 1234"
    /([A-Z]{3})\s*[→\-to]\s*([A-Z]{3})/i,         // "SFO → BOS" or "SFO to BOS"
    /Flight to\s+([A-Za-z\s]+)/i,                  // "Flight to Boston"
    /Depart(?:ure|ing)?\s+([A-Z]{3})/i,           // "Departing SFO"
    /([A-Z]{2})\s*(\d{1,4})\s+Flight/i            // "UA 1234 Flight"
];

const airportCityMap = {
    'Boston': 'BOS',
    'Los Angeles': 'LAX',
    'San Francisco': 'SFO',
    // ... comprehensive mapping
};
```

### TR-4: Calendar Event Creation
```typescript
interface CalendarExportEvent {
    title: string;           // "🚗 Leave for LAX (JetSweep)"
    startDate: Date;         // Calculated departure time
    endDate: Date;           // +30 min or travel duration
    calendar: string;        // User-selected calendar ID
    alerts: number[];        // [-15, -30] minutes before
    notes: string;           // Trip details
    url?: string;            // Deep link to JetSweep trip
}
```

### TR-5: Capacitor Calendar Plugin
For cross-platform implementation:
- `@capacitor-community/calendar` plugin
- Handles iOS and Android differences
- Native permission flows

---

## User Experience Flow

### Flow 1: Import from Calendar

```
[User opens JetSweep]
     ↓
[First time: "Would you like to import flights from your calendar?"]
     ↓
[User taps "Yes, Connect Calendar"]
     ↓
[iOS calendar permission prompt]
     ↓
[User grants permission]
     ↓
[JetSweep scans calendar, finds 2 flights]
     ↓
[Shows: "We found 2 upcoming flights"]
     ┌─────────────────────────────────────┐
     │ ✈ United 1234                       │
     │ SFO → BOS • Mar 10 • 2:00pm        │
     │ [Import]                            │
     ├─────────────────────────────────────┤
     │ ✈ Delta 567                         │
     │ BOS → SFO • Mar 15 • 5:30pm        │
     │ [Import]                            │
     └─────────────────────────────────────┘
     ↓
[User taps Import on first flight]
     ↓
[Pre-filled form with: SFO, Mar 10, 2:00pm, domestic]
     ↓
[User adds: PreCheck=yes, rideshare, Balanced]
     ↓
[Calculates: Leave by 11:00am]
     ↓
[Trip saved with calendar link]
```

### Flow 2: Export to Calendar

```
[User saves a trip in JetSweep]
     ↓
[Prompt: "Add departure time to your calendar?"]
     ↓
[User taps "Yes, Add to Calendar"]
     ↓
[If first time: calendar write permission]
     ↓
[Select calendar: "Personal" ✓ / "Work" / "Family"]
     ↓
[Preview event:]
     "🚗 Leave for LAX (JetSweep)
      Mar 10, 11:00am - 11:30am
      Alert: 15 min before"
     ↓
[User confirms]
     ↓
["Added to Personal calendar ✓"]
     ↓
[User opens Apple Calendar]
     ↓
[Sees event at 11:00am on Mar 10]
```

### Flow 3: Automatic Sync

```
[User changes flight time in their calendar]
     (2:00pm → 3:30pm due to airline reschedule)
     ↓
[JetSweep detects change on next app open]
     ↓
[Alert: "Your SFO flight moved to 3:30pm"]
     "Would you like us to recalculate your departure time?"
     ↓
[User taps "Recalculate"]
     ↓
[New departure: 12:30pm (was 11:00am)]
     ↓
[Calendar event automatically updated]
```

---

## Design Specifications

### Calendar Connection UI

```
┌─────────────────────────────────────────┐
│ CALENDAR SYNC                           │
│ ─────────────────────────               │
│                                         │
│ Import flights from:                    │
│ ☑ Personal                              │
│ ☑ iCloud                                │
│ ☐ Work (not connected)                  │
│                                         │
│ Export departure times to:              │
│ ◉ Personal                              │
│ ○ Family                                │
│ ○ Don't export                          │
│                                         │
│ [Scan for Flights]                      │
└─────────────────────────────────────────┘
```

### Detected Flight Card

```
┌─────────────────────────────────────────┐
│ ✈ DETECTED FLIGHT                       │
│ ─────────────────────────               │
│                                         │
│ United 1234                             │
│ San Francisco (SFO) → Boston (BOS)      │
│ March 10, 2026 • 2:00pm                 │
│                                         │
│ From your: Personal Calendar            │
│                                         │
│ [Create Trip from This Flight]          │
│ [Ignore]                                │
└─────────────────────────────────────────┘
```

### Calendar Export Preview

```
┌─────────────────────────────────────────┐
│ ADD TO CALENDAR                         │
│ ─────────────────────────               │
│                                         │
│ 🚗 Leave for LAX (JetSweep)             │
│                                         │
│ Tuesday, March 10, 2026                 │
│ 11:00am - 11:30am                       │
│                                         │
│ Calendar: [Personal        ▼]           │
│                                         │
│ Reminder: ☑ 15 minutes before           │
│                                         │
│ Notes:                                  │
│ "Flight at 2:00pm to Boston.            │
│  Allow 3 hours for airport."            │
│                                         │
│ [Cancel]            [Add to Calendar]   │
└─────────────────────────────────────────┘
```

---

## Privacy Considerations

### Data Handling
- Flight patterns extracted locally, not sent to server
- No calendar data stored beyond detected flights user confirms
- Calendar permissions can be revoked at any time
- Clear explanation of what JetSweep accesses

### Permission Messaging
"JetSweep reads your calendar to find flights and saves departure times as events. Your calendar data stays on your device and is never sent to our servers."

### Granular Control
Users can:
- Choose which calendars to read/write
- Disable import without disabling export (and vice versa)
- Delete exported events without deleting JetSweep trip
- Disconnect calendar entirely

---

## Success Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| Calendar permission grant rate | >50% | Clear value proposition |
| Flights detected and imported | >60% of eligible | Detection works reliably |
| Departure events exported | >40% of trips | Export is valuable |
| Calendar conflicts avoided | Measurable reduction | Feature prevents overbooking |
| User satisfaction | >4.2/5 | Feature works as expected |

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Calendar permission denied | Medium | High | Clear value explanation; work without permission |
| Flight detection misses events | Medium | Medium | Show "Can't find your flight? Enter manually" |
| False positives (non-flight detected) | Medium | Low | User confirms before import; easy dismiss |
| iOS permission changes | Low | High | Abstract permission handling; quick updates |
| Performance scanning large calendars | Medium | Medium | Limit scan range (next 90 days); background processing |

---

## Implementation Phases

### Phase 1: Export Only (MVP)
- Add departure time to calendar
- Calendar selection
- Basic confirmation flow

### Phase 2: Import
- Scan calendars for flights
- Pattern matching engine
- Import flow with confirmation

### Phase 3: Sync
- Detect flight time changes
- Two-way sync
- Conflict detection and warnings

---

## Open Questions

1. **Which calendars by default?** Read all or require explicit selection?
2. **How to handle work calendars?** Privacy concerns for employer-managed calendars
3. **Multiple calendar apps?** Support Google Calendar app directly, or only iOS Calendar?
4. **Travel time in event?** Should event duration reflect actual travel time to airport?
5. **Shared calendars?** Allow export to shared family calendars?

---

## Appendix: Flight Detection Patterns

### High Confidence (Auto-Detect)
- "Flight UA 1234 SFO to BOS"
- "SFO → BOS 2pm"
- Events from airline apps (American, United, Delta known formats)

### Medium Confidence (Suggest)
- "Trip to Boston"
- "Flying to LA"
- Events containing "airport" or "flight"

### Low Confidence (Manual Entry)
- "Going to see family"
- "Vacation"
- Any ambiguous travel mention

---

*This PRD is a proposal. Implementation should only proceed after review and approval from Taylor.*
