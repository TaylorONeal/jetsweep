# PRD: Flight Status Integration

> **PROPOSED FEATURE - DO NOT IMPLEMENT WITHOUT CONFIRMATION FROM TAYLOR**
>
> This document represents a proposed enhancement to JetSweep. It is meant for review, discussion, and refinement before any implementation work begins. The ideas here are exploratory and subject to change based on feedback, technical feasibility, and strategic alignment.

---

## Document Information

| Field | Value |
|-------|-------|
| **PRD ID** | PRD-003 |
| **Feature Name** | Flight Status Integration |
| **Status** | Proposed |
| **Author** | Claude (AI Assistant) |
| **Created** | 2026-02-01 |
| **Priority** | P1 - High Value for Differentiation |

---

## Executive Summary

Flight Status Integration connects JetSweep's departure planning with real-time flight information—delays, gate assignments, and terminal changes. When your flight is delayed 45 minutes, JetSweep automatically recalculates your departure time so you don't rush to the airport only to wait. This feature bridges JetSweep's planning philosophy with the reality that flight schedules change.

---

## The Job To Be Done

### Core Job Statement

> **When I** have a flight that might be delayed or has operational changes,
> **I want to** have my departure plan automatically adjust to reflect reality,
> **So I can** use my time wisely and not stress about information I can't control.

### Deeper Narrative: The Delay Dilemma

JetSweep was built on a core principle: **planning over prediction**. We don't try to forecast traffic or TSA lines because those predictions are unreliable. But there's a critical piece of travel information that IS knowable: whether your flight is on time.

**Jennifer's Story:**

Jennifer has a 3pm flight from Chicago O'Hare. JetSweep told her to leave at 11:30am. She's been tracking her flight on another app and sees it's delayed to 4:15pm due to the inbound aircraft running late.

She now faces a dilemma:
1. Leave at 11:30am anyway (1+ hour extra waiting at airport)
2. Mentally recalculate (error-prone, stressful)
3. Re-enter everything in JetSweep with the new time (tedious)
4. Wing it and hope she's not cutting it too close

**The Insight:**

JetSweep's value is answering "when should I leave?" But that question assumes a fixed flight time. When the flight time changes, the user has to do manual work to get the new answer—work that could be automated.

### The Conservative Delay Philosophy

Flight delays create an interesting tension with JetSweep's conservative approach:

**Too eager to adjust = risk**
If we update departure time immediately for every 15-minute delay, users might leave later and then get caught when the delay gets shorter (or the flight goes on time).

**Too slow to adjust = wasted time**
If we ignore delays, users spend hours at the airport unnecessarily.

**Our approach:**
- Only adjust for **confirmed, significant delays** (30+ minutes)
- Always maintain JetSweep's standard buffers ON TOP of the new time
- Clearly communicate the uncertainty inherent in delay situations
- Let user override if they want to be extra conservative

---

## User Personas & Their Jobs

### Persona 1: The Informed Traveler
**Job:** "I already track my flight—I want JetSweep to do the same."

- Uses Flighty or airline app for flight status
- Frustrated by context-switching between apps
- Wants one source of truth for "when to leave"

### Persona 2: The Busy Professional
**Job:** "I don't have time to track flights—just tell me when plans change."

- Won't actively monitor flight status
- Wants proactive notification if departure time should change
- Values "set and forget" automation

### Persona 3: The Anxious Planner
**Job:** "Delays stress me out—I want JetSweep to help me handle them rationally."

- Tends to overreact to delays (leave way too early or panic)
- Wants authoritative guidance on new departure time
- Values the confidence JetSweep provides

### Persona 4: The Optimizer
**Job:** "If my flight is delayed, I want that extra time productively."

- Sees delay as opportunity (more sleep, finish task, later checkout)
- Wants precise new departure time, not vague "check back later"
- Values JetSweep's specificity

---

## Functional Requirements

### FR-1: Flight Identification
Allow users to enter flight number to identify their specific flight.

**Input options:**
- Flight number (e.g., "UA 1234")
- Airline + flight number (e.g., "United 1234")
- Auto-detect from date + time + airport (fuzzy match)

**Stored with trip:**
Flight number becomes part of saved trip data for ongoing tracking.

### FR-2: Flight Status Retrieval
Fetch real-time status for identified flights.

**Data retrieved:**
- Scheduled departure time
- Estimated/actual departure time
- Delay status and duration
- Gate assignment
- Terminal
- Boarding time

**Update frequency:**
- Manual refresh: User-initiated
- Background refresh: Every 30 minutes for trips within 24 hours
- Active refresh: Every 5 minutes for trips within 3 hours

### FR-3: Delay-Adjusted Departure Time
When a significant delay is detected, calculate new departure time.

**Threshold for adjustment:**
- Delay ≥ 30 minutes triggers recalculation
- Delay < 30 minutes shows warning but keeps original time
- "Cancelled" status shows prominent alert, no departure time

**Recalculation:**
- Uses original inputs (security, transport, etc.)
- Applies to NEW estimated departure time
- Maintains all standard buffers and safety margins

### FR-4: Status Display
Show flight status alongside departure plan.

**Display elements:**
- Flight status badge: "On Time" / "Delayed 45min" / "Gate Change"
- Original vs. new departure time (if changed)
- Gate and terminal (when available)
- Last updated timestamp
- Refresh button

### FR-5: Change Notifications
Alert users when their departure time should change.

**Notification triggers:**
- Delay exceeds 30 minutes (new departure time)
- Delay shortened significantly (return to earlier time)
- Gate change (informational)
- Cancellation (urgent alert)

### FR-6: Manual Override
Users can choose to ignore delay adjustments.

**Options:**
- "Keep original departure time" (for conservative travelers)
- "Use adjusted time" (default for significant delays)
- "I'll decide later" (dismisses prompt)

---

## Technical Requirements

### TR-1: Flight Data API
**Option A: FlightAware API**
- Industry standard for flight tracking
- Real-time updates
- Cost: ~$0.01-0.05 per lookup
- Requires API key and terms agreement

**Option B: AeroDataBox (RapidAPI)**
- Budget-friendly option
- Good coverage for US domestic
- Cost: Free tier available, paid for volume

**Option C: Aviation Edge**
- Comprehensive global coverage
- Real-time + historical
- Cost: Subscription model

**Recommendation:** Start with AeroDataBox for MVP (lower cost), migrate to FlightAware for production scale.

### TR-2: Flight Number Parsing
Parse various flight number formats:
- "UA1234" → United Airlines, Flight 1234
- "United 1234" → United Airlines, Flight 1234
- "UA 1234" → United Airlines, Flight 1234
- IATA and ICAO codes supported

### TR-3: Background Refresh
- Use background fetch (iOS) for silent updates
- Respect OS limitations on background activity
- Queue updates efficiently (batch API calls)

### TR-4: Caching Strategy
- Cache flight status for 5 minutes (prevents excessive API calls)
- Store last-known status for offline access
- Clear cache for departed flights

### TR-5: Error Handling
- Flight not found: Prompt user to verify number
- API unavailable: Show last known status, indicate staleness
- Rate limited: Queue request, notify user of delay

---

## User Experience Flow

### Flow 1: Adding Flight Number

```
[User on timeline calculation form]
     ↓
[Optional field: "Flight Number (for live status)"]
     ↓
[User enters: "UA 1234"]
     ↓
[System validates and shows: "United 1234 • SFO → DEN • Feb 8"]
     ↓
[User confirms, continues with calculation]
     ↓
[Flight number saved with trip]
```

### Flow 2: Viewing Flight Status

```
[User opens saved trip]
     ↓
[Timeline header shows flight status]
     ┌─────────────────────────────────────┐
     │ United 1234 to DEN                  │
     │ Status: Delayed 45 min              │
     │ New departure: 4:00pm (was 3:15pm)  │
     │ Gate: B22 • Terminal: 3             │
     │ Updated 2 min ago    [Refresh ↻]    │
     └─────────────────────────────────────┘
     ↓
[Below: Adjusted departure time]
     "Leave by 1:15pm (adjusted for delay)"
     "Original plan was 12:30pm"
```

### Flow 3: Delay Notification

```
[Flight delay exceeds 30 minutes]
     ↓
[Push notification:]
     "✈️ UA 1234 delayed to 4:00pm
      Your new departure time: 1:15pm
      (45 min later than planned)"
     ↓
[User taps notification]
     ↓
[Opens trip with full explanation]
     ↓
[User sees adjusted timeline with all stages recalculated]
```

### Flow 4: Handling Uncertainty

```
[Flight shows "Delayed - checking" status]
     ↓
[JetSweep shows:]
     "Your flight shows a potential delay.
      We recommend keeping your original
      departure time (12:30pm) until the
      delay is confirmed.

      [Keep Original Time]
      [Notify Me When Confirmed]"
```

---

## Design Specifications

### Flight Number Input
- **Location**: Optional field in calculation form
- **Label**: "Flight Number (optional)"
- **Helper text**: "Enter to get live delay alerts"
- **Validation**: Real-time airline code lookup
- **Example format**: "UA 1234" or "United 1234"

### Status Badge System

| Status | Badge Color | Icon |
|--------|-------------|------|
| On Time | Green | ✓ |
| Delayed <30min | Yellow | ⚠ |
| Delayed 30+ min | Orange | ⏰ |
| Delayed 60+ min | Red | ⚠ |
| Cancelled | Red | ✕ |
| Boarding | Green | 🚶 |
| Departed | Gray | ✈ |
| Landed | Gray | ✓ |

### Adjusted Time Display

```
┌─────────────────────────────────────────┐
│ ⚠ DEPARTURE TIME ADJUSTED              │
│                                         │
│ Flight delayed 45 minutes               │
│                                         │
│ NEW: Leave by 1:15pm                    │
│ (was 12:30pm)                           │
│                                         │
│ Your buffers are preserved.             │
│ [Use Adjusted Time] [Keep Original]     │
└─────────────────────────────────────────┘
```

### Gate/Terminal Information

```
┌─────────────────────────────────────────┐
│ Gate: B22 • Terminal: 3                 │
│ Walk time adjusted: 18-25 min           │
│ (Terminal 3 is farther from security)   │
└─────────────────────────────────────────┘
```

---

## API Cost Analysis

| Scenario | API Calls | Estimated Cost |
|----------|-----------|----------------|
| Single trip, day-of | ~30 calls | $0.30-1.50 |
| Power user, 5 trips/month | ~150 calls | $1.50-7.50 |
| Average user, 1 trip/month | ~30 calls | $0.30-1.50 |

**Cost mitigation strategies:**
- Aggressive caching (5-minute minimum)
- Background refresh only within 24 hours
- Free tier for MVP testing
- Optional premium tier for heavy usage

---

## Success Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| Flight numbers entered (% of trips) | >40% | Feature is valuable and used |
| Delay adjustment acceptance rate | >70% | Adjusted times are trusted |
| Notification engagement (delay alerts) | >80% | Alerts are timely and relevant |
| Time saved (user survey) | >30 min avg | Delays handled efficiently |
| User satisfaction (delay handling) | >4.5/5 | Feature delivers on promise |

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| API costs exceed budget | Medium | High | Usage caps; premium tier; caching |
| Stale data misleads users | Medium | High | Clear timestamps; manual refresh |
| Over-adjusting for short delays | Medium | Medium | 30-min threshold; user override |
| Flight not found (charter, etc.) | Low | Low | Graceful degradation; manual mode |
| Privacy concerns (tracking flights) | Low | Medium | Local processing; no server logs |

---

## Philosophy Alignment

This feature extends but doesn't violate JetSweep's core philosophy:

| Principle | How This Feature Aligns |
|-----------|------------------------|
| **Planning over prediction** | We don't predict delays; we respond to confirmed ones |
| **Buffers over averages** | Adjusted times maintain all original buffers |
| **Explainability** | We show exactly how and why the time changed |
| **Asymmetric risk** | Conservative threshold; user can always keep original time |

---

## Implementation Phases

### Phase 1: Basic Status (MVP)
- Flight number input
- Manual status refresh
- Simple status display
- No automatic adjustment

### Phase 2: Smart Adjustment
- Automatic delay detection
- Departure time recalculation
- Push notifications for significant changes
- User override options

### Phase 3: Advanced
- Gate-specific walk times
- Terminal information
- Boarding alerts
- Integration with airline apps (if APIs allow)

---

## Open Questions

1. **Who pays for API calls?** Free for users? Premium feature? Ad-supported?
2. **How aggressive should auto-adjustment be?** 30 minutes? 45? User setting?
3. **Should we track inbound aircraft?** ("Your plane is still in Dallas...")
4. **International coverage?** Start US-only or global from day one?
5. **What about codeshare flights?** Multiple flight numbers, same aircraft.

---

## Appendix: Competitive Positioning

| App | Flight Tracking | Departure Planning |
|-----|-----------------|-------------------|
| Flighty | Excellent | None |
| TripIt | Good | Basic reminders |
| Google Maps | None | Traffic-based ETA |
| Airline Apps | Own flights only | Minimal |
| **JetSweep** | **Proposed** | **Core competency** |

JetSweep's differentiation: **We connect flight status to departure planning**—something no competitor does well. When your flight is delayed, we don't just tell you; we tell you what that means for when you should leave.

---

*This PRD is a proposal. Implementation should only proceed after review and approval from Taylor.*
