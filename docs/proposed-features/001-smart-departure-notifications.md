# PRD: Smart Departure Notifications

> **PROPOSED FEATURE - DO NOT IMPLEMENT WITHOUT CONFIRMATION FROM TAYLOR**
>
> This document represents a proposed enhancement to JetSweep. It is meant for review, discussion, and refinement before any implementation work begins. The ideas here are exploratory and subject to change based on feedback, technical feasibility, and strategic alignment.

---

## Document Information

| Field | Value |
|-------|-------|
| **PRD ID** | PRD-001 |
| **Feature Name** | Smart Departure Notifications |
| **Status** | Proposed |
| **Author** | Claude (AI Assistant) |
| **Created** | 2026-02-01 |
| **Priority** | P0 - Critical for App Store MVP |

---

## Executive Summary

Smart Departure Notifications transforms JetSweep from a "check when you remember" tool into an always-on travel companion that proactively tells users when it's time to leave for the airport. This feature addresses the fundamental gap between planning and action—users currently calculate their departure time but must remember to act on it themselves.

---

## The Job To Be Done

### Core Job Statement

> **When I** have a flight coming up and I'm going about my day,
> **I want to** be reminded at exactly the right moment to leave,
> **So I can** stop worrying about watching the clock and trust that I won't miss my flight.

### Deeper Narrative: The Cognitive Burden of Travel

Travel anxiety doesn't begin at the airport—it begins the moment you book your flight. From that point forward, a low-grade background process runs in your mind: *Don't forget the flight. Don't leave too late. What time do I need to leave again?*

**Sarah's Story:**

Sarah has a 2pm domestic flight out of LAX. She used JetSweep yesterday and it told her to leave by 10:45am (with her "Balanced" risk preference). She wrote it on a Post-it note.

This morning, she's finishing a work task. She glances at the clock: 9:30am. Good, plenty of time. She returns to her work, gets absorbed. The next time she looks up, it's 10:52am. Her stomach drops. She grabs her bags and rushes out, already stressed.

The irony: **She had the information. She did the planning. But the plan couldn't reach her at the moment of decision.**

JetSweep's value proposition—conservative, reliable departure times—is only as good as the user's ability to act on that information. Smart Departure Notifications closes this loop.

### Why This Matters More Than Other Features

1. **Completes the core value loop**: Plan → Remember → Act becomes Plan → Notification → Act
2. **Differentiates from competitors**: Most flight apps notify about delays, not departure times
3. **Drives daily active usage**: Users set notifications, then trust the app to work
4. **Justifies App Store presence**: Push notifications are the #1 reason to install a native app over using a website
5. **Reduces anxiety (our core promise)**: The relief of knowing you'll be reminded is the product

---

## User Personas & Their Jobs

### Persona 1: The Anxious Planner
**Job:** "I want to stop obsessively checking the clock because I'm terrified of being late."

- Already uses calendar reminders but doesn't trust them (they don't account for traffic, TSA, etc.)
- Would set multiple JetSweep notifications at different intervals for peace of mind
- Values the "you can relax now" feeling more than the notification itself

### Persona 2: The Busy Professional
**Job:** "I want to work/live until the last responsible moment without cognitive overhead."

- Has back-to-back meetings before travel days
- Needs one reliable notification, not a system they have to monitor
- Values "set it and forget it" simplicity

### Persona 3: The Family Coordinator
**Job:** "I want to wrangle everyone out the door on time without being the bad guy."

- Uses the notification as external authority ("The app says we need to leave NOW")
- Wants notifications to go to multiple family members
- Values the shared accountability notifications provide

### Persona 4: The "Seat of Pants" Traveler
**Job:** "I want to maximize my time at home/hotel, but I need a hard backstop."

- Pushes timing to the limit intentionally
- Uses JetSweep's aggressive estimates but wants a notification at that exact moment
- Values precision timing over early buffers

---

## Functional Requirements

### FR-1: Notification Scheduling
When a user calculates a departure time, they can optionally schedule a notification.

**Options:**
- **At departure time**: "Time to leave for LAX"
- **15 minutes before**: "Leave in 15 minutes for your flight"
- **30 minutes before**: "30 minutes until you should head to the airport"
- **1 hour before**: "Your LAX departure window opens in an hour"
- **Custom offset**: User-specified minutes before

**Multiple notifications allowed**: Users can set several reminders for the same trip.

### FR-2: Notification Content
Each notification includes:
- Airport code and flight time
- Recommended leave time
- Risk preference used (Early Bird/Balanced/Seat of Pants)
- Deep link to view full timeline

**Example:**
```
🛫 Time to leave for LAX
Your 2:00pm flight • Leave by 10:45am for Balanced timing
Tap to view your full timeline
```

### FR-3: Trip Persistence (Prerequisite)
Notifications require saving trip data:
- Flight details (airport, date, time)
- Calculation inputs (security type, transport, etc.)
- Calculated departure time
- Notification preferences

This data persists locally and syncs notification state with the OS.

### FR-4: Notification Management
Users can:
- View all scheduled notifications
- Edit notification times
- Cancel individual notifications
- Cancel all notifications for a trip
- Receive confirmation when notifications are set

### FR-5: Smart Recalculation (Future Enhancement)
If the user changes their flight time or inputs, offer to update notifications accordingly.

---

## Technical Requirements

### TR-1: iOS Push Notification Implementation
- Use `UNUserNotificationCenter` for local notifications
- Request notification permission at appropriate moment (not on first launch)
- Handle notification actions (deep link to timeline)
- Support notification categories for quick actions

### TR-2: React Native / Capacitor Bridge
Given current Vite/React architecture, implementation options:
1. **Capacitor**: Add `@capacitor/local-notifications` plugin
2. **Expo**: If migrating to Expo, use `expo-notifications`
3. **Native iOS wrapper**: Wrap the PWA in a native shell with notification capability

**Recommendation**: Capacitor is lowest-friction given existing Vite setup.

### TR-3: Data Persistence
- Extend localStorage schema to include notification metadata
- Store: tripId, notificationIds, scheduledTime, status
- Handle notification cleanup when trips expire

### TR-4: Background Handling
- Notifications fire even when app is closed (OS-level scheduling)
- App badge can show number of upcoming trips (optional)
- Handle notification tap when app is cold-started

---

## User Experience Flow

### Flow 1: Setting a Notification

```
[User completes timeline calculation]
     ↓
[Timeline results screen shows "Set Reminder" button]
     ↓
[User taps "Set Reminder"]
     ↓
[Bottom sheet appears with timing options]
     • At departure time (10:45am) ✓
     • 15 minutes before (10:30am)
     • 30 minutes before (10:15am)
     • 1 hour before (9:45am)
     • Custom...
     ↓
[User selects one or more options]
     ↓
[If first time: iOS permission prompt appears]
     ↓
[Confirmation: "Reminder set for 10:45am tomorrow"]
     ↓
[Timeline screen shows "🔔 Reminder set" badge]
```

### Flow 2: Receiving a Notification

```
[Time reaches 10:45am]
     ↓
[iOS notification appears]
     🛫 Time to leave for LAX
     Your 2:00pm flight • Leave now for Balanced timing
     ↓
[User taps notification]
     ↓
[App opens directly to saved timeline]
     ↓
[User can see full stage breakdown, grab bags, go]
```

### Flow 3: Managing Notifications

```
[User opens app]
     ↓
[Landing page shows "Upcoming Trips" section]
     ↓
[Trip card shows: LAX • Feb 15 • 🔔 10:45am]
     ↓
[Tap card → Full timeline with edit options]
     ↓
[Swipe card → Delete trip and all notifications]
```

---

## Design Specifications

### Notification Permission Request
**When**: After user's first successful timeline calculation and taps "Set Reminder"
**Why**: Context makes the permission request meaningful
**Copy**: "JetSweep needs permission to remind you when it's time to leave for your flight. You'll never miss a departure again."

### Reminder Button Design
- Primary gold button: "Set Departure Reminder"
- Icon: Bell (🔔)
- Position: Below timeline summary, above detailed stages
- After setting: Button transforms to "🔔 Reminder Set • Edit"

### Confirmation Toast
- Appears at bottom of screen
- Shows: "Reminder set for [time] on [date]"
- Includes "Undo" action for 5 seconds

### Upcoming Trips Section (Landing Page)
- Appears above "Recent Searches"
- Card format showing: Airport • Date • Notification time
- Visual indicator for notification status (bell icon)
- Swipe to delete, tap to view

---

## Success Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| Notification permission grant rate | >70% | Users see clear value |
| Reminders set per user (first 30 days) | >2 | Feature is useful and used |
| App retention at Day 7 (with notification) | >40% | Notifications drive return usage |
| Notification tap-through rate | >60% | Content is relevant and timely |
| Timeline views from notification | >50% | Deep link works, users engage |

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Users deny notification permission | Medium | High | Request at moment of clear value; explain benefit; don't request on first launch |
| Notifications feel spammy | Low | High | User controls exactly when/how many; no marketing notifications ever |
| iOS kills notifications for inactive apps | Low | Medium | Local notifications persist at OS level; test thoroughly |
| Data sync issues between app/notifications | Medium | Medium | Treat notification IDs as source of truth; validate on app open |
| Users set reminders then change plans | Medium | Low | Easy cancellation; trip deletion clears notifications |

---

## App Store Impact

### Why This Feature Matters for App Store Approval

1. **Native capability justification**: Push notifications require a native app—this justifies App Store presence over PWA
2. **Clear utility**: Apple favors apps that provide clear, specific value
3. **No web equivalent**: Users cannot get this functionality from a website
4. **Privacy-respecting**: Local notifications, no server tracking

### App Store Screenshot Opportunity
"Never Miss a Flight" - Show notification on lock screen with departure time

---

## Implementation Phases

### Phase 1: Foundation (MVP)
- Add Capacitor local notifications plugin
- Implement single notification per trip
- Basic permission flow
- Deep link to timeline

### Phase 2: Enhanced
- Multiple notification times per trip
- Upcoming trips section on landing page
- Notification management UI
- Custom time offset

### Phase 3: Advanced
- Smart recalculation when inputs change
- Trip sharing (send notification to family)
- Notification sound customization
- Badge count for upcoming trips

---

## Open Questions

1. **Should we bundle this with trip saving?** Notifications require saved trips—should this be one feature or two?
2. **What's the right default notification time?** At departure time? 15 minutes before? User preference?
3. **How do we handle timezone changes?** User travels to different timezone before their flight.
4. **Should notifications include weather/traffic updates?** Or keep them simple?

---

## Appendix: Competitive Analysis

| App | Departure Notifications | Notes |
|-----|------------------------|-------|
| TripIt | Flight reminders only | "Leave for airport" based on generic timing |
| Google Maps | Traffic-based | Location-dependent, not flight-aware |
| Flighty | Sophisticated | Gate changes, delays—not departure planning |
| Apple Calendar | Manual | User must calculate and set themselves |
| **JetSweep** | **Proposed** | **Airport-intelligent departure timing** |

JetSweep's differentiation: Our notifications are based on airport-specific, risk-adjusted, conservative timing—not generic estimates or real-time speculation.

---

*This PRD is a proposal. Implementation should only proceed after review and approval from Taylor.*
