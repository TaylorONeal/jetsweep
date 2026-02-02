# PRD: Trip Saving & Quick Access

> **PROPOSED FEATURE - DO NOT IMPLEMENT WITHOUT CONFIRMATION FROM TAYLOR**
>
> This document represents a proposed enhancement to JetSweep. It is meant for review, discussion, and refinement before any implementation work begins. The ideas here are exploratory and subject to change based on feedback, technical feasibility, and strategic alignment.

---

## Document Information

| Field | Value |
|-------|-------|
| **PRD ID** | PRD-002 |
| **Feature Name** | Trip Saving & Quick Access |
| **Status** | Proposed |
| **Author** | Claude (AI Assistant) |
| **Created** | 2026-02-01 |
| **Priority** | P0 - Critical for App Store MVP |

---

## Executive Summary

Trip Saving transforms JetSweep from a one-time calculator into a persistent travel companion. Users can save upcoming trips, access their departure timelines with one tap, and maintain a clear view of their travel schedule. This feature is foundational—it enables notifications, widgets, sharing, and every other feature that requires trip persistence.

---

## The Job To Be Done

### Core Job Statement

> **When I** book a flight days or weeks in advance,
> **I want to** save my JetSweep calculation and access it instantly later,
> **So I can** reference my departure plan without re-entering all my details every time.

### Deeper Narrative: The Planning-to-Departure Gap

There's a peculiar pattern in how people plan for flights:

**The Planning Moment** happens when you book—you're engaged, thinking ahead, willing to enter details. This is when you might use JetSweep.

**The Departure Moment** happens days or weeks later—you're rushed, distracted, and just need the answer. You don't want to fill out a form; you want to see your plan.

**The Problem:**

Marcus books a flight to Denver on January 15th for a trip on February 8th. He uses JetSweep that same day—enters his airport, flight time, security status, everything. It tells him to leave at 1:30pm. Great. He takes a mental note.

Three weeks pass. It's February 8th. Marcus wakes up and thinks: "What time was I supposed to leave?" He opens JetSweep. His recent searches show Denver, but clicking it starts a new calculation. He has to re-enter his flight time, remember if he had PreCheck, decide if today is a holiday...

By the time he's done, he's stressed and second-guessing everything. The magic of that calm, deliberate planning moment has evaporated.

**The Insight:**

Travel planning has two distinct phases with different user needs:
1. **Planning Phase**: Detailed input, deliberation, exploration of options
2. **Execution Phase**: Quick reference, confidence, action

JetSweep currently optimizes only for Phase 1. Trip Saving creates a bridge to Phase 2.

### The Emotional Journey

| Phase | User Emotion | JetSweep's Role |
|-------|--------------|-----------------|
| Booking (weeks before) | Optimistic, organized | "I'm being smart about this" |
| Planning (days before) | Thoughtful, deliberate | "Let me figure this out" |
| Day before | Anticipatory, checking | "Is everything ready?" |
| Morning of | Rushed, anxious | "When do I leave again?!" |
| At departure time | Decisive, acting | "Time to go" |

Trip Saving ensures JetSweep is valuable at every phase, not just the initial planning.

---

## User Personas & Their Jobs

### Persona 1: The Frequent Traveler
**Job:** "I have 3 trips in the next month—I want to see them all in one place."

- Travels 2-4 times monthly for work
- Books trips in batches, plans them later
- Values organization and overview
- Wants: Dashboard of upcoming trips with departure times

### Persona 2: The Vacation Planner
**Job:** "I want to plan once and trust my plan."

- Plans one major trip with care and attention
- Returns to check details multiple times before travel
- Values confidence that the plan is still valid
- Wants: One-tap access to saved timeline

### Persona 3: The Last-Minute Checker
**Job:** "I'm at the hotel and just need to confirm when I'm leaving for my return flight."

- Already calculated the return trip days ago
- Doesn't want to think—just wants the answer
- Values instant access over detailed information
- Wants: Departure time visible without opening the full timeline

### Persona 4: The Family Trip Coordinator
**Job:** "I need to keep track of our family's multiple segments—outbound, return, and the kids' different flight."

- Managing multiple trips for multiple people
- Needs clear labeling and organization
- Values: Clear trip naming, easy differentiation
- Wants: Trip list with custom names

---

## Functional Requirements

### FR-1: Save Trip Action
After calculating a timeline, users can save the trip.

**Saved data includes:**
- Trip name (auto-generated, editable)
- All calculation inputs (airport, flight time, security, transport, etc.)
- Calculated timeline (stages, times, leave time)
- Calculation timestamp
- User notes (optional)

**Auto-generated names:**
- Format: "[Airport Code] on [Date]"
- Example: "DEN on Feb 8" or "LAX on Mar 15"
- User can edit to: "Denver Work Trip" or "Spring Break Return"

### FR-2: Saved Trips List
Landing page displays saved trips prominently.

**Display hierarchy:**
1. **Active Trips** (flight in next 48 hours) - Featured/highlighted
2. **Upcoming Trips** (flight in 2-30 days) - Standard cards
3. **Past Trips** - Collapsed section, auto-archive

**Card contents:**
- Trip name
- Airport code + city name
- Flight date and time
- Calculated departure time
- Risk preference badge (Early Bird/Balanced/Seat of Pants)
- Notification status (if set)

### FR-3: One-Tap Timeline Access
Tapping a saved trip opens the full timeline immediately.

**No re-calculation needed**—displays the saved result.

**Option to recalculate** if user wants to adjust inputs or conditions have changed.

### FR-4: Trip Editing
Users can modify saved trips:
- Change trip name
- Update flight time (triggers recalculation prompt)
- Modify inputs (security type, transport, etc.)
- Add/edit notes
- Update risk preference

### FR-5: Trip Deletion
- Swipe to delete on trip list
- Confirmation for trips with notifications set
- Bulk delete for past trips

### FR-6: Trip Archival
Trips automatically move to archive after flight time passes.

**Archive accessible** but de-emphasized.

**Auto-cleanup**: Trips older than 90 days are deleted (with user setting to extend).

### FR-7: Data Persistence
**Local storage** (MVP):
- JSON structure in localStorage
- Maximum 20 active trips
- Unlimited archived trips (up to storage limits)

**Future: Cloud sync** (post-MVP):
- Optional account creation
- Sync across devices
- Backup and restore

---

## User Experience Flow

### Flow 1: Saving a Trip

```
[User completes timeline calculation]
     ↓
[Timeline results screen]
     ↓
[Prominent "Save Trip" button below summary]
     ↓
[User taps "Save Trip"]
     ↓
[Quick modal: Trip name (pre-filled), optional note]
     ↓
[User confirms or edits name]
     ↓
["Trip Saved" confirmation with option to set reminder]
     ↓
[Timeline screen shows "Saved ✓" badge]
```

### Flow 2: Accessing a Saved Trip

```
[User opens JetSweep]
     ↓
[Landing page shows "Your Trips" section]
     ↓
[Cards: "DEN on Feb 8 • Leave at 1:30pm"]
     ↓
[User taps trip card]
     ↓
[Full timeline loads instantly]
     ↓
[All stages visible, ready for day-of reference]
```

### Flow 3: Day-of-Travel Quick Check

```
[User wakes up on travel day]
     ↓
[Opens JetSweep]
     ↓
[Active trip is highlighted at top]
     [TODAY: DEN • Flight 4:15pm • Leave by 1:30pm]
     ↓
[Departure time visible without tapping]
     ↓
[User has answer in 2 seconds]
```

### Flow 4: Managing Multiple Trips

```
[User has 3 upcoming trips saved]
     ↓
[Landing page: "Your Trips (3)"]
     ↓
[Cards stacked chronologically]
     • TODAY: DEN on Feb 8 • 1:30pm
     • LAX on Feb 15 • 10:45am
     • ORD on Mar 2 • 7:15am
     ↓
[User can reorder, edit, delete any trip]
```

---

## Design Specifications

### Save Trip Button
- **Location**: Timeline results screen, below summary
- **Style**: Secondary button (not competing with "Set Reminder")
- **Label**: "Save Trip" → transforms to "Saved ✓" after saving
- **Icon**: Bookmark or folder icon

### Trip Card Design

```
┌─────────────────────────────────────────┐
│  ✈ DEN on Feb 8              [Edit ✎]  │
│  Denver International                    │
│                                          │
│  Flight: 4:15pm domestic                 │
│  Leave by: 1:30pm                        │
│                                          │
│  [🔔 Reminder set]  [Balanced]           │
└─────────────────────────────────────────┘
```

**Active trip (day-of) variant:**
- Highlighted border (gold)
- "TODAY" badge
- Larger departure time
- Countdown: "Leave in 3 hours"

### Your Trips Section (Landing Page)

```
YOUR TRIPS
─────────────────────────────

[TODAY] ━━━━━━━━━━━━━━━━━━━━━
┌─────────────────────────────┐
│ ✈ DEN • Leave by 1:30pm    │
│ Flight: 4:15pm • 3 hrs away │
└─────────────────────────────┘

[UPCOMING] ━━━━━━━━━━━━━━━━━━
┌─────────────────────────────┐
│ ✈ LAX on Feb 15 • 10:45am  │
└─────────────────────────────┘
┌─────────────────────────────┐
│ ✈ ORD on Mar 2 • 7:15am    │
└─────────────────────────────┘

[+ Plan New Trip]
```

### Empty State
When no trips are saved:
```
No trips saved yet.
Plan your next flight and save it for quick access.
[Plan a Trip →]
```

---

## Data Model

```typescript
interface SavedTrip {
  id: string;                    // UUID
  name: string;                  // User-editable name
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp

  // Flight details
  airportCode: string;
  airportName: string;
  flightDate: string;            // YYYY-MM-DD
  flightTime: string;            // HH:MM
  isInternational: boolean;

  // Calculation inputs
  inputs: {
    hasPreCheck: boolean;
    hasClear: boolean;
    hasCheckedBags: boolean;
    isFamily: boolean;
    transportType: 'rideshare' | 'car';
    riskPreference: 'early' | 'balanced' | 'risky';
    customDriveTime?: number;
    weatherImpact: boolean;
    holidayOverride: boolean;
  };

  // Calculated results (cached)
  result: {
    leaveTime: string;           // HH:MM
    earliestLeave: string;
    latestLeave: string;
    stressMargin: number;        // minutes
    confidence: 'normal' | 'risky' | 'high_variance';
    stages: TimelineStage[];
  };

  // Notification (if set)
  notification?: {
    scheduledTime: string;
    notificationId: string;
    status: 'pending' | 'delivered' | 'cancelled';
  };

  // User additions
  notes?: string;
  status: 'active' | 'archived';
}
```

---

## Success Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| Trips saved (% of calculations) | >30% | Feature is discoverable and useful |
| Saved trips accessed again | >60% | Users return to check their plans |
| Day-of access rate | >80% | Primary use case is working |
| Average trips per user | >2 | Users adopt for multiple trips |
| Edit rate | <20% | Initial calculation is trusted |

---

## Technical Considerations

### Storage Limits
- localStorage limit: ~5MB
- Single trip: ~2KB average
- Can store ~2,000+ trips safely
- Implement cleanup for very old archived trips

### Migration Path
- Current: `recentSearches` in localStorage (limited data)
- New: `savedTrips` with full calculation data
- Maintain backwards compatibility with recent searches

### Performance
- Trip list should render instantly (<100ms)
- Timeline from saved data should display immediately (no recalculation)
- Lazy load archived trips section

### Offline Capability
- All saved trip data available offline
- Recalculation works offline (deterministic)
- Only cloud sync requires network (future)

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Users forget to save trips | Medium | Medium | Prompt to save after calculation; auto-save option |
| Too many saved trips clutters UI | Low | Medium | Smart archival; collapsible sections; search |
| Stale calculations mislead users | Low | High | Show "calculated on [date]" badge; offer recalculation |
| Data loss (localStorage cleared) | Low | High | Export/backup option; future cloud sync |

---

## Integration with Other Features

| Feature | Integration |
|---------|-------------|
| **Notifications** | Saved trips enable notification scheduling |
| **Widgets** | Widgets display saved trip data |
| **Calendar Sync** | Imported flights become saved trips |
| **Sharing** | Share a saved trip with others |
| **Watch App** | Watch displays saved trip departure times |

This feature is **foundational**—it unlocks the entire ecosystem of features that require trip persistence.

---

## Implementation Phases

### Phase 1: Core Saving (MVP)
- Save trip after calculation
- Trip list on landing page
- One-tap access to timeline
- Basic edit/delete

### Phase 2: Enhanced Management
- Trip naming and notes
- Active/upcoming/past sections
- Day-of highlighting
- Swipe gestures

### Phase 3: Advanced
- Cloud sync (optional account)
- Trip export/import
- Trip templates (frequent routes)
- Family trip sharing

---

## Open Questions

1. **Auto-save vs. manual save?** Should every calculation auto-save, or require explicit action?
2. **How to handle round trips?** Separate trips or linked pair?
3. **Should we import from recent searches?** Migrate existing data to new format?
4. **Duplicate detection?** Warn if saving same airport/date twice?

---

## Appendix: User Research Insights

### Why Users Don't Just Use Notes/Calendar

In informal research, users report:
- "I put it in my calendar but I never trust the time I entered"
- "I take a screenshot but then I can't find it"
- "I text myself but the context is gone"
- "I remember the time but forget if that was Early Bird or Balanced"

The common thread: **external tools lose context**. JetSweep saving keeps the full calculation with its reasoning intact.

---

*This PRD is a proposal. Implementation should only proceed after review and approval from Taylor.*
