# PRD: iOS Home Screen Widgets

> **PROPOSED FEATURE - DO NOT IMPLEMENT WITHOUT CONFIRMATION FROM TAYLOR**
>
> This document represents a proposed enhancement to JetSweep. It is meant for review, discussion, and refinement before any implementation work begins. The ideas here are exploratory and subject to change based on feedback, technical feasibility, and strategic alignment.

---

## Document Information

| Field | Value |
|-------|-------|
| **PRD ID** | PRD-004 |
| **Feature Name** | iOS Home Screen Widgets |
| **Status** | Proposed |
| **Author** | Claude (AI Assistant) |
| **Created** | 2026-02-01 |
| **Priority** | P1 - High Value for App Store Appeal |

---

## Executive Summary

iOS Home Screen Widgets bring JetSweep's departure countdown directly to where users spend their time—their home screen. At a glance, without opening the app, users see their upcoming trip and exactly when they need to leave. For a travel app, widgets transform occasional use into ambient awareness, and they're a significant factor in App Store discovery and user retention.

---

## The Job To Be Done

### Core Job Statement

> **When I** have an upcoming flight and I'm going about my day,
> **I want to** see my departure countdown at a glance without opening any app,
> **So I can** maintain situational awareness without active effort.

### Deeper Narrative: The Glanceable Travel Companion

There's a psychological difference between checking information and being presented with information.

**Checking** requires:
1. Deciding to check
2. Finding the app
3. Opening it
4. Parsing the interface
5. Finding the relevant data

**Being presented** requires:
1. Looking at your phone

That's not laziness—it's cognitive efficiency. Travel days are already cognitively demanding. Every mental task we can eliminate is a gift.

**The Widget's Power:**

Michael has a 6pm flight. His JetSweep widget shows:

```
┌─────────────────────┐
│ ✈ DEN → ORD        │
│ Leave in 4h 23m    │
│ by 1:30pm          │
└─────────────────────┘
```

Every time Michael glances at his phone—checking the time, responding to a text, anything—he sees his status. The countdown ticks. When it gets to "Leave in 30m," the urgency is visceral. When it says "Time to leave," there's no ambiguity.

The widget creates **ambient urgency without anxiety**. Michael doesn't need to remember to check. The information is simply there, woven into his phone's home screen like the weather or calendar.

### Why Widgets Matter for App Store Success

1. **Discovery**: Widget-enabled apps get featured in "Best New Apps" and "Apps with Great Widgets"
2. **Retention**: Users with widgets are 3-4x more likely to open the associated app regularly
3. **Differentiation**: Few travel apps do departure planning widgets well
4. **Delight**: A beautiful, useful widget signals a quality app
5. **Home screen presence**: The app stays visible even when not in use

---

## User Personas & Their Jobs

### Persona 1: The Glance Checker
**Job:** "I want to know my status instantly, without any friction."

- Checks phone frequently throughout the day
- Values quick information over detailed information
- Widget is primary interface on travel days
- Rarely opens full app once widget is set

### Persona 2: The Countdown Lover
**Job:** "I want to see time ticking down—it helps me pace my day."

- Uses countdown timers for various activities
- Finds the decreasing number motivating
- Wants precision (hours AND minutes, not just "a few hours")
- Enjoys the visual feedback loop

### Persona 3: The Multi-Trip Manager
**Job:** "I travel a lot and want to see my next few trips at a glance."

- Has 2-3 trips in the coming weeks
- Wants the widget to show the most relevant trip
- Values automatic updating (next trip after current one ends)
- Uses large widget to see multiple upcoming trips

### Persona 4: The Aesthetic User
**Job:** "My home screen is curated—the widget needs to look good AND be useful."

- Won't add widgets that clash with their home screen aesthetic
- Appreciates dark theme, clean design
- Values JetSweep's existing visual language
- Widget must match app's premium feel

---

## Functional Requirements

### FR-1: Widget Sizes
Support all standard iOS widget sizes:

| Size | Name | Purpose |
|------|------|---------|
| Small (2×2) | **Departure Countdown** | Single trip, countdown focus |
| Medium (4×2) | **Trip Overview** | Single trip with more detail |
| Large (4×4) | **Multi-Trip View** | Multiple upcoming trips |

### FR-2: Small Widget Content
The minimal, focused countdown view:

```
┌─────────────────────┐
│      ✈ DEN         │
│   Leave in         │
│    4h 23m          │
│    by 1:30pm       │
└─────────────────────┘
```

**Elements:**
- Airport code (destination)
- "Leave in" with countdown
- Specific time below

**States:**
- Normal: Gold accent countdown
- Urgent (<1 hour): Amber/orange treatment
- Critical (<30 min): Red treatment with pulse
- Passed: "Now" or "Go!"
- No upcoming trip: "No trips planned"

### FR-3: Medium Widget Content
More context while remaining scannable:

```
┌───────────────────────────────────────────┐
│  ✈ Denver (DEN)              Today      │
│    Flight: 6:00pm domestic              │
│                                          │
│    Leave in 4h 23m                       │
│    by 1:30pm                             │
│                              [Balanced]  │
└───────────────────────────────────────────┘
```

**Additional elements:**
- Airport name
- Flight time
- "Today" or date
- Risk preference badge

### FR-4: Large Widget Content
Multi-trip dashboard:

```
┌───────────────────────────────────────────┐
│  YOUR UPCOMING TRIPS                      │
│  ─────────────────────────                │
│                                           │
│  TODAY                                    │
│  ✈ DEN • Leave in 4h 23m • 1:30pm       │
│                                           │
│  FEB 15                                   │
│  ✈ LAX • Leave at 10:45am               │
│                                           │
│  MAR 2                                    │
│  ✈ ORD • Leave at 7:15am                │
│                                           │
└───────────────────────────────────────────┘
```

**Features:**
- Up to 3 upcoming trips
- Chronological order
- Today's trip highlighted
- Tap any trip to open full timeline

### FR-5: Widget Configuration
Users can configure widgets:
- Select which saved trip to display (or "auto-select next")
- Choose time format (12h/24h)
- Theme: Auto (match system) / Always dark / Always light

### FR-6: Real-Time Updates
Widgets update their countdown in near real-time:
- Update frequency: Every minute
- Background refresh: System-managed
- Graceful degradation: Show "Updated 5m ago" if stale

### FR-7: Deep Linking
Tapping the widget opens the relevant trip:
- Small/Medium: Opens displayed trip's timeline
- Large: Tapping specific trip opens that timeline
- Tapping empty state: Opens trip planning form

---

## Technical Requirements

### TR-1: WidgetKit Implementation
Use Apple's WidgetKit framework:
- TimelineProvider for scheduled updates
- WidgetFamily for multiple sizes
- IntentConfiguration for user customization

### TR-2: App Groups
Share data between main app and widget extension:
- Create App Group container
- Store saved trips in shared container
- Widget reads from shared container

### TR-3: Timeline Generation
```swift
struct TripWidgetEntry: TimelineEntry {
    let date: Date
    let trip: SavedTrip?
    let countdown: TimeInterval
    let urgencyLevel: UrgencyLevel
}

enum UrgencyLevel {
    case normal      // > 1 hour
    case attention   // 30-60 minutes
    case urgent      // < 30 minutes
    case now         // Past departure time
}
```

### TR-4: Update Schedule
```swift
func getTimeline(for configuration: TripWidgetIntent,
                 in context: Context,
                 completion: @escaping (Timeline<TripWidgetEntry>) -> Void) {

    var entries: [TripWidgetEntry] = []

    // Generate entries for next 2 hours, every minute
    // Then every 5 minutes for next 6 hours
    // Then every 15 minutes beyond that

    let timeline = Timeline(entries: entries, policy: .atEnd)
    completion(timeline)
}
```

### TR-5: Native iOS Required
Widgets require native iOS development:
- **Capacitor approach**: Create widget extension in native Xcode project
- **Data sharing**: Use App Groups to share localStorage equivalent
- **Build process**: Widget builds separately, bundled in app

---

## User Experience Flow

### Flow 1: Adding Widget

```
[User long-presses home screen]
     ↓
[Enters jiggle mode, taps "+"]
     ↓
[Widget gallery opens]
     ↓
[User searches "JetSweep" or scrolls to find]
     ↓
[JetSweep widget options shown: Small, Medium, Large]
     ↓
[User selects Medium, taps "Add Widget"]
     ↓
[Widget appears on home screen]
     ↓
[User taps widget to configure]
     ↓
[Configuration: Select trip (or "Next upcoming")]
     ↓
[Widget shows selected trip's countdown]
```

### Flow 2: Travel Day Experience

```
[Morning of travel]
     ↓
[User wakes up, checks phone]
     ↓
[Widget shows: "✈ LAX • Leave in 5h 12m"]
     ↓
[User goes about morning routine]
     ↓
[Glances at phone periodically]
     ↓
[Widget: "Leave in 2h 30m" → "Leave in 1h" → "Leave in 30m"]
     ↓
[Widget turns orange: "Leave in 30m ⚠"]
     ↓
[User knows it's time to prepare]
     ↓
[Widget: "Leave in 10m" - Red]
     ↓
[User grabs bags, heads out]
```

### Flow 3: Post-Trip Auto-Update

```
[User's LAX trip departs]
     ↓
[Widget automatically switches to next trip]
     ↓
[Now shows: "✈ ORD • Mar 2 • 7:15am"]
     ↓
[No manual intervention needed]
```

---

## Design Specifications

### Visual Design Language
Widgets should match JetSweep's existing aesthetic:
- **Background**: Dark cockpit theme (#0a0a0a) or light equivalent
- **Primary accent**: Gold (#d4a84b) for key elements
- **Text**: High contrast, Inter font
- **Icons**: Lucide airplane icon, minimal

### Small Widget States

| State | Background | Countdown Color | Indicator |
|-------|------------|-----------------|-----------|
| Normal (>1hr) | Dark | Gold | None |
| Attention (30-60m) | Dark | Amber | Subtle glow |
| Urgent (<30m) | Dark | Red | Pulsing glow |
| Now | Dark | Red | "NOW" with emphasis |
| No trip | Dark | Gray | "Plan a trip" |

### Typography Hierarchy

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Countdown number | 32pt (small), 28pt (medium) | Bold | Gold/Amber/Red |
| Airport code | 18pt | Semibold | White |
| "Leave in/by" | 13pt | Regular | Gray |
| Flight time | 13pt | Regular | Gray |

### Animation (Where Supported)
- Smooth countdown tick
- Color transitions as urgency changes
- Subtle pulse for urgent state

---

## Success Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| Widget adoption (% of users) | >25% | Feature is discoverable and appealing |
| Widget retained after 7 days | >70% | Widget provides ongoing value |
| App opens from widget | >40% | Widget drives engagement |
| Travel-day widget views | >10 per user | Widget consulted frequently |
| App Store mentions | Positive | Widgets noted in reviews |

---

## App Store Impact

### Featured Potential
Apple frequently features apps with well-designed widgets:
- "Best New Apps" section values widget innovation
- "Apps We Love" often highlights widgets
- Travel category has few standout widget implementations

### Screenshot Opportunity
App Store screenshots can prominently feature widget:
- "See your departure at a glance"
- Show widget on beautiful home screen mockup
- Demonstrate different sizes

### Review Catalyst
Users who add widgets often mention them in reviews:
- "The widget is so useful"
- "I check it constantly before trips"
- Social proof for potential users

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Complex native development | Medium | High | Use Capacitor with native extension; hire iOS dev if needed |
| Widget not updating reliably | Medium | Medium | Thorough testing; fallback "Updated X ago" display |
| Users don't discover widgets | Low | Medium | In-app prompt; onboarding mention; App Store screenshots |
| Performance impact on phone | Low | Medium | Efficient timeline generation; minimal memory use |
| Data sync issues app ↔ widget | Medium | High | Robust App Groups implementation; shared data validation |

---

## Implementation Phases

### Phase 1: Foundation (MVP)
- Small widget only
- Single next-trip display
- Basic countdown
- Deep link to trip

### Phase 2: Enhanced
- Medium widget
- Widget configuration
- Multiple urgency states
- Time format preferences

### Phase 3: Advanced
- Large multi-trip widget
- Lock Screen widgets (iOS 16+)
- StandBy support (iOS 17+)
- Complications for Apple Watch (separate feature)

---

## Open Questions

1. **Should widget show flight status?** If integrated, show "On Time" / "Delayed" badge?
2. **Multiple trip selection?** Let user choose OR auto-show next?
3. **Widget without saved trips?** Show "Plan your next trip" or hide?
4. **Lock Screen widget?** iOS 16+ supports Lock Screen widgets—prioritize?
5. **Live Activities?** Show departure countdown as Live Activity (iOS 16.1+)?

---

## Appendix: Competitive Widget Landscape

| App | Widget Quality | Departure Focus |
|-----|----------------|-----------------|
| Flighty | Excellent | Flight tracking, not departure |
| TripIt | Basic | Shows next trip, no countdown |
| Google Maps | None | N/A |
| Airline apps | Variable | Boarding time, not leave time |
| **JetSweep** | **Proposed** | **Departure countdown focus** |

JetSweep has an opportunity to own the "departure countdown" widget space—a clear, specific job that no current app does well.

---

*This PRD is a proposal. Implementation should only proceed after review and approval from Taylor.*
