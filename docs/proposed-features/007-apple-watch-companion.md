# PRD: Apple Watch Companion App

> **PROPOSED FEATURE - DO NOT IMPLEMENT WITHOUT CONFIRMATION FROM TAYLOR**
>
> This document represents a proposed enhancement to JetSweep. It is meant for review, discussion, and refinement before any implementation work begins. The ideas here are exploratory and subject to change based on feedback, technical feasibility, and strategic alignment.

---

## Document Information

| Field | Value |
|-------|-------|
| **PRD ID** | PRD-007 |
| **Feature Name** | Apple Watch Companion App |
| **Status** | Proposed |
| **Author** | Claude (AI Assistant) |
| **Created** | 2026-02-01 |
| **Priority** | P2 - Premium Experience |

---

## Executive Summary

An Apple Watch companion app brings JetSweep's departure countdown to the most glanceable screen in users' lives—their wrist. On travel days, users can check their departure status instantly without pulling out their phone. This feature signals premium quality, appeals to tech-forward early adopters, and provides genuine utility during the busiest, most hands-full moments of travel.

---

## The Job To Be Done

### Core Job Statement

> **When I** am getting ready to leave for the airport with bags and chaos around me,
> **I want to** glance at my wrist to see if it's time to go,
> **So I can** stay aware without fumbling for my phone.

### Deeper Narrative: The Hands-Full Traveler

The moments before leaving for the airport are characterized by divided attention and literal full hands:

- Carrying luggage to the door
- Checking windows and locks
- Wrangling children or pets
- Gathering last-minute items
- Loading the car

During these moments, checking your phone is friction. You have to:
1. Set something down
2. Pull out phone
3. Unlock
4. Find app
5. Check time
6. Put phone away
7. Pick things back up

**The Watch Difference:**

Jessica is doing her final walkthrough before heading to the airport. Her hands are full—phone in pocket, keys in hand, pulling a suitcase. She glances at her wrist:

```
┌────────────────────┐
│      ✈ LAX        │
│                    │
│   Leave in 12m    │
│                    │
│     by 11:30am     │
└────────────────────┘
```

One second. Zero hands required. She knows she has 12 minutes to finish up.

Five minutes later, another glance: "Leave in 7m"

She starts moving toward the door.

Glance: "Leave in 2m"

Time to go. She's out the door, no phone check needed.

### The Premium Signal

Apple Watch ownership correlates with:
- Higher income travelers (frequent flyers)
- Tech enthusiasts (early adopters)
- Quality-conscious consumers (willing to pay for good experiences)

A Watch app signals that JetSweep is a serious, premium product—not a throwaway utility.

---

## User Personas & Their Jobs

### Persona 1: The Frequent Flyer
**Job:** "I travel constantly and want the most efficient tools."

- Travels 2-4x monthly
- Owns Apple Watch (high correlation with frequent flyers)
- Values efficiency and polish
- Watch is already integral to their routine

### Persona 2: The Busy Parent
**Job:** "I'm managing kids and luggage—I need hands-free information."

- Travels with children
- Hands literally full during departure prep
- Can't easily check phone
- Watch glance is genuinely useful

### Persona 3: The Tech Enthusiast
**Job:** "I want apps that use all my devices well."

- Appreciates ecosystem integration
- Uses Watch for fitness, notifications, payments
- Expects quality apps to have Watch support
- Values the "complete" experience

### Persona 4: The Minimalist Traveler
**Job:** "I want to check my timing without pulling out my phone constantly."

- Prefers less phone use
- Uses Watch as primary notification surface
- Appreciates single-purpose, glanceable apps
- Values focus and minimal distraction

---

## Functional Requirements

### FR-1: Watch App
Standalone Watch app that:
- Shows next upcoming trip
- Displays departure countdown
- Shows key trip details
- Syncs with iPhone app

### FR-2: Complication Support
Complications for various watch faces:

| Face Type | Complication Content |
|-----------|---------------------|
| **Graphic Corner** | Airport code + countdown |
| **Modular Large** | Full departure info |
| **Circular** | Countdown only |
| **Inline** | "LAX 11:30am" text |

### FR-3: Glanceable Countdown
Primary view shows:
- Airport code/name
- "Leave in X hours Y min"
- Specific departure time
- Flight time (secondary)

### FR-4: Haptic Notifications
Wrist taps at key moments:
- 30 minutes before departure time
- 15 minutes before (if still not left)
- At departure time ("Time to leave")

### FR-5: Watch-to-Phone Handoff
- Tap on Watch → Opens full timeline on iPhone
- Complications link to app
- Force Touch for quick actions

### FR-6: Urgency States
Visual treatment changes based on time remaining:
- Normal (>1hr): Standard gold accent
- Attention (30-60min): Amber accent
- Urgent (<30min): Red accent, haptic pulse

---

## Technical Requirements

### TR-1: watchOS App Development
- SwiftUI for watchOS interface
- WatchKit for complications
- Independent Watch app (doesn't require phone)

### TR-2: Data Sync
WatchConnectivity framework:
- `WCSession` for phone↔watch communication
- Background transfers for trip data
- Complication updates via `transferCurrentComplicationUserInfo`

### TR-3: Complications Implementation
```swift
struct TripComplication: TimelineEntry {
    let date: Date
    let tripName: String
    let departureTime: Date
    let countdown: TimeInterval
    let urgency: UrgencyLevel
}

struct ComplicationProvider: TimelineProvider {
    func getTimeline(
        for complication: CLKComplication,
        withHandler handler: @escaping (CLKComplicationTimeline?) -> Void
    ) {
        // Generate timeline entries for countdown
    }
}
```

### TR-4: Haptic Patterns
```swift
// Use WKHapticType for different alerts
WKInterfaceDevice.current().play(.notification)  // Standard alert
WKInterfaceDevice.current().play(.directionUp)   // Urgent alert
```

### TR-5: Offline Capability
Watch app should function without phone nearby:
- Cache trip data on watch
- Countdown works independently
- Sync when phone reconnects

---

## User Experience Flow

### Flow 1: Setting Up Watch App

```
[User downloads JetSweep on iPhone]
     ↓
[Watch App auto-installs if Watch paired]
     ↓
[First iPhone trip saved]
     ↓
[Watch syncs trip data in background]
     ↓
[User adds JetSweep complication to watch face]
     ↓
[Complication shows: "LAX 11:30am"]
```

### Flow 2: Travel Day Experience

```
[Morning of travel]
     ↓
[User glances at watch face complication]
     [LAX • 4hr]
     ↓
[Gets ready, occasional glances]
     ↓
[Complication updates: LAX • 1hr]
     ↓
[Watch taps wrist: "30 minutes until departure"]
     ↓
[User glances: LAX • 30m (amber)]
     ↓
[Final prep, loading car]
     ↓
[Watch taps: "Time to leave for LAX"]
     ↓
[Glance: "Leave NOW" (red)]
     ↓
[User departs]
```

### Flow 3: Detailed View

```
[User taps complication or opens Watch app]
     ↓
[Full Watch app view:]
     ┌────────────────────────┐
     │   ✈ LOS ANGELES       │
     │                        │
     │   Leave in 1h 30m     │
     │      by 11:30am        │
     │                        │
     │   Flight: 3:00pm      │
     │   Domestic             │
     │                        │
     │   [View on iPhone]     │
     └────────────────────────┘
     ↓
[Tap "View on iPhone"]
     ↓
[iPhone opens JetSweep to full timeline]
```

---

## Design Specifications

### Watch App Main Screen

```
┌─────────────────────────┐
│                         │
│        ✈ LAX           │
│    Los Angeles          │
│                         │
│  ───────────────────    │
│                         │
│    Leave in            │
│       1h 30m           │
│                         │
│    by 11:30am          │
│                         │
│  ───────────────────    │
│                         │
│    Flight: 3:00pm       │
│                         │
└─────────────────────────┘
```

### Complication Designs

**Graphic Corner:**
```
┌─────────┐
│LAX      │
│ 1:30    │
└─────────┘
```

**Modular Large:**
```
┌───────────────────────┐
│ ✈ LAX • Leave 11:30am │
│   Flight at 3:00pm    │
└───────────────────────┘
```

**Circular:**
```
  ╭───────╮
  │ 1:30  │
  │  ✈️   │
  ╰───────╯
```

### Color System

| Urgency | Background | Accent | Text |
|---------|------------|--------|------|
| Normal | Black | Gold | White |
| Attention | Black | Amber | White |
| Urgent | Black | Red | White |
| Passed | Black | Red | Red flash |

### Typography
- Countdown number: SF Pro Display, Bold, 34pt
- Labels: SF Pro Text, 13pt
- Use system Dynamic Type when possible

---

## Success Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| Watch app install (% of iPhone users) | >15% | Among Watch owners |
| Complication adoption | >50% of Watch users | Core value prop |
| Haptic notification engagement | >80% don't disable | Notifications are useful |
| Watch app opens on travel days | >5 per trip | Glanceable value |
| NPS for Watch feature | >50 | Premium feature satisfaction |

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Small watch owner audience | Medium | Medium | Position as premium feature; prioritize after core features |
| watchOS development complexity | Medium | High | Start minimal (complications first); hire watchOS specialist |
| Battery drain concerns | Low | Medium | Efficient update intervals; test thoroughly |
| Sync reliability | Medium | Medium | Robust offline support; graceful degradation |
| Different watch sizes | Low | Low | Test all sizes; use SwiftUI adaptive layouts |

---

## App Store Considerations

### Watch App Review
- watchOS apps reviewed separately
- Must provide genuine utility
- Can't just be notification mirror

### Marketing Opportunity
- "Now on Apple Watch" badge
- Screenshot showing watch + phone
- Appeals to premium user segment

---

## Implementation Phases

### Phase 1: Complications Only
- Basic complications (inline, circular)
- Countdown display
- Phone→Watch sync

### Phase 2: Watch App
- Standalone Watch app view
- Haptic notifications
- Watch-to-phone handoff

### Phase 3: Advanced
- Full complication suite
- Independent offline operation
- Rich notifications with actions

---

## Open Questions

1. **Standalone vs. companion?** Should Watch work without phone entirely?
2. **Multiple trips?** Show only next trip or allow switching?
3. **Notification frequency?** How many haptics before it's annoying?
4. **Always-on display?** Optimize for watches with always-on screens?
5. **Cost-benefit?** Is Watch audience large enough to justify development?

---

## Appendix: Apple Watch Market Data

**Watch ownership among travelers:**
- ~35% of iPhone users own Apple Watch (2025)
- Higher among frequent flyers (~50%)
- Watch users have higher engagement with apps

**Competitive landscape:**
- Flighty: Excellent Watch app (flight tracking focus)
- TripIt: Basic Watch app
- Airline apps: Variable quality
- JetSweep opportunity: Departure-focused Watch experience

---

*This PRD is a proposal. Implementation should only proceed after review and approval from Taylor.*
