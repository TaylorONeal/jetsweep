# PRD: Siri Shortcuts Integration

> **PROPOSED FEATURE - DO NOT IMPLEMENT WITHOUT CONFIRMATION FROM TAYLOR**
>
> This document represents a proposed enhancement to JetSweep. It is meant for review, discussion, and refinement before any implementation work begins. The ideas here are exploratory and subject to change based on feedback, technical feasibility, and strategic alignment.

---

## Document Information

| Field | Value |
|-------|-------|
| **PRD ID** | PRD-010 |
| **Feature Name** | Siri Shortcuts Integration |
| **Status** | Proposed |
| **Author** | Claude (AI Assistant) |
| **Created** | 2026-02-01 |
| **Priority** | P2 - Enhanced User Experience |

---

## Executive Summary

Siri Shortcuts integration lets users ask "Hey Siri, when should I leave for the airport?" and get their JetSweep departure time spoken back. This feature brings JetSweep into the voice assistant ecosystem, enabling hands-free access to departure information during the busy, hands-full moments before travel. It also signals iOS integration maturity and appeals to users who have invested in the Apple ecosystem.

---

## The Job To Be Done

### Core Job Statement

> **When I** am busy getting ready and can't look at my phone,
> **I want to** ask Siri when I should leave,
> **So I can** get the answer hands-free without stopping what I'm doing.

### Deeper Narrative: Voice Is the Ultimate Glance

We've talked about glanceability with widgets and watches—but voice is even more frictionless. You don't need to look at anything. You don't need your hands. You just ask.

**The Pre-Departure Chaos:**

Kevin is showering before his 3pm flight. His phone is on the counter. He suddenly wonders: "What time did JetSweep say I need to leave?"

**Without Siri:**
1. Finish shower
2. Dry hands
3. Pick up phone
4. Unlock
5. Find JetSweep
6. Open saved trip
7. Read time

**With Siri:**
Kevin: "Hey Siri, when should I leave for the airport?"
Siri: "For your flight to Denver at 3pm, JetSweep says to leave by 11:30am. That's in 2 hours."

Same information. Zero friction. No wet phone.

### The Apple Ecosystem Signal

Siri Shortcuts integration signals:
- Deep iOS integration (not just a wrapped web app)
- Investment in the Apple ecosystem
- Premium app quality
- Modern iOS feature adoption

Users who use Siri regularly will appreciate (and expect) this integration.

---

## User Personas & Their Jobs

### Persona 1: The Siri Power User
**Job:** "I use Siri for everything—my travel app should work with it."

- Uses Siri for timers, reminders, messages
- Expects quality apps to have Siri integration
- Disappointed when apps don't support shortcuts
- Will create custom shortcuts if given the option

### Persona 2: The Hands-Busy Traveler
**Job:** "I'm packing/driving/cooking—I can't look at my phone."

- Needs information while hands are occupied
- Uses voice to check things without stopping
- Values the convenience of verbal answers
- Often uses Siri in car via CarPlay

### Persona 3: The CarPlay User
**Job:** "I'm driving to drop someone at the airport—Siri should help."

- Uses CarPlay in the car
- Can't touch phone while driving
- Siri is primary interface in car
- "When should we leave?" is natural car question

### Persona 4: The Accessibility User
**Job:** "Voice interfaces are easier for me than visual apps."

- May have visual or motor impairments
- Relies on Siri for many tasks
- Appreciates apps with voice support
- Siri shortcuts improve accessibility

---

## Functional Requirements

### FR-1: Pre-Built Shortcuts
JetSweep provides shortcuts that appear in the Shortcuts app:

**Shortcut 1: "When should I leave?"**
- Speaks departure time for next upcoming trip
- Shows card with trip details
- Works with HomePod, AirPods, CarPlay

**Shortcut 2: "My flight timeline"**
- Opens JetSweep to next trip's timeline
- Quick access shortcut

**Shortcut 3: "What time is my flight?"**
- Speaks flight time for next trip
- Simpler query for just flight time

### FR-2: Custom Phrase Support
Users can customize trigger phrases:

- Default: "When should I leave for the airport"
- Custom: "Flight time", "Airport departure", "JetSweep"

### FR-3: Siri Response Content
When invoked, Siri speaks:

**Standard response:**
"For your flight to [destination] at [time], JetSweep recommends leaving by [departure time]. That's in [countdown]."

**Example:**
"For your flight to Denver at 3pm, JetSweep recommends leaving by 11:30am. That's in 2 hours and 15 minutes."

### FR-4: Shortcut Donation
App donates shortcuts based on user activity:

- After saving a trip → Donate "When should I leave"
- After viewing timeline → Donate "My flight timeline"
- Shortcuts appear in Siri suggestions

### FR-5: Shortcuts App Integration
Shortcuts visible in Apple's Shortcuts app:

- JetSweep section with available shortcuts
- Users can add to home screen
- Users can include in automation workflows

### FR-6: Multi-Trip Handling
When user has multiple trips:

**Siri behavior:**
- Default: Answer for next upcoming trip
- If ambiguous: "You have 2 upcoming trips. Which one—Denver on February 8th or LA on February 15th?"
- User can specify: "When should I leave for Denver?"

---

## Technical Requirements

### TR-1: SiriKit Integration
Use SiriKit Intents framework:
```swift
import Intents

class IntentHandler: INExtension, DepartureTimeIntentHandling {
    func handle(intent: DepartureTimeIntent,
                completion: @escaping (DepartureTimeIntentResponse) -> Void) {
        // Fetch next trip from shared data
        // Return spoken response
    }
}
```

### TR-2: App Intents (iOS 16+)
Newer App Intents framework for simpler implementation:
```swift
import AppIntents

struct GetDepartureTime: AppIntent {
    static var title: LocalizedStringResource = "When should I leave?"
    static var description = IntentDescription("Get your JetSweep departure time")

    func perform() async throws -> some IntentResult & ProvidesDialog {
        let trip = TripManager.shared.nextTrip
        let response = "Leave by \(trip.departureTime) for your \(trip.flightTime) flight."
        return .result(dialog: "\(response)")
    }
}
```

### TR-3: Shortcut Donation
```swift
import Intents

func donateShortcut(for trip: SavedTrip) {
    let intent = DepartureTimeIntent()
    intent.tripId = trip.id
    intent.suggestedInvocationPhrase = "When should I leave for \(trip.airportName)"

    let interaction = INInteraction(intent: intent, response: nil)
    interaction.donate { error in
        // Handle donation result
    }
}
```

### TR-4: Shared Data Access
Intents extension needs access to trip data:
- Use App Groups for shared container
- Store trips in shared location
- Intent handler reads from same data source

### TR-5: Capacitor/Native Bridge
If using Capacitor:
- Create native iOS intent extension
- Bridge data between Capacitor and native
- Consider Capacitor plugins or custom native module

---

## User Experience Flow

### Flow 1: Voice Query

```
[User getting ready for trip]
     ↓
[Says: "Hey Siri, when should I leave for the airport?"]
     ↓
[Siri processes, queries JetSweep intent]
     ↓
[Siri speaks:]
     "For your flight to Denver at 3pm,
      JetSweep recommends leaving by 11:30am.
      That's in 2 hours."
     ↓
[Optional: Siri shows card with trip summary]
     ↓
[User continues with task, informed]
```

### Flow 2: Custom Shortcut Setup

```
[User opens Shortcuts app]
     ↓
[Searches for "JetSweep"]
     ↓
[Sees available shortcuts:]
     • When should I leave?
     • My flight timeline
     • What time is my flight?
     ↓
[Taps "When should I leave?"]
     ↓
[Adds custom phrase: "Flight time check"]
     ↓
[Saves shortcut]
     ↓
[Now "Hey Siri, flight time check" works]
```

### Flow 3: CarPlay Usage

```
[User driving to airport (dropping someone)]
     ↓
[Says: "Hey Siri, when does Sarah need to leave?"]
     ↓
[Siri (via CarPlay):]
     "Sarah's flight to Boston is at 5pm.
      She should leave by 2:15pm, which is in 45 minutes."
     ↓
[Driver knows to head to the airport soon]
```

### Flow 4: Automation Workflow

```
[User creates Shortcuts automation:]
     "At 8am on travel days, announce departure time"
     ↓
[Morning of travel day]
     ↓
[Shortcut runs automatically]
     ↓
[HomePod announces:]
     "Good morning! Your flight to Miami is at 2pm.
      JetSweep recommends leaving by 10:30am."
```

---

## Design Specifications

### Siri Response Card

When Siri shows visual response:
```
┌─────────────────────────────────────────┐
│        ✈ JETSWEEP                       │
│                                         │
│   Leave by 11:30am                      │
│   for Denver (DEN)                      │
│                                         │
│   Flight: 3:00pm                        │
│   In: 2 hours 15 minutes                │
│                                         │
│   [Open JetSweep]                       │
│                                         │
└─────────────────────────────────────────┘
```

### Shortcuts App Gallery

```
┌─────────────────────────────────────────┐
│ JETSWEEP                                │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ✈ When should I leave?             │ │
│ │   Get departure time for next trip  │ │
│ │                          [Add]      │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 📋 My flight timeline              │ │
│ │   Open your upcoming trip           │ │
│ │                          [Add]      │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🕐 What time is my flight?         │ │
│ │   Hear your flight departure time   │ │
│ │                          [Add]      │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### Voice Response Guidelines

**Keep responses:**
- Concise (under 15 seconds spoken)
- Informative (include key details)
- Natural (conversational phrasing)
- Consistent (same format each time)

**Response formula:**
"For your flight to [destination] at [flight time], JetSweep recommends leaving by [departure time]. That's in [countdown]."

---

## Success Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| Siri queries per user/month | >1 | Feature is used |
| Shortcut additions | >20% of users | Users customize |
| Query success rate | >95% | Siri understands and responds |
| User satisfaction | >4/5 | Voice responses are helpful |
| CarPlay usage | Trackable | Demonstrates hands-free value |

---

## App Store Considerations

### Siri Integration Highlight
- Can feature in App Store description
- "Works with Siri" badge potential
- Appeals to Apple ecosystem users

### Voice Demo in Screenshots
- Show Siri card response
- "Ask Siri when to leave" callout
- Demonstrates iOS integration depth

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Siri misunderstands queries | Medium | Medium | Provide common phrase variations |
| No trips saved = no response | Medium | Medium | Prompt user to save trip, or guide to app |
| Complex multi-trip scenarios | Low | Medium | Clear disambiguation dialog |
| iOS version requirements | Low | Low | Target iOS 15+; graceful degradation |
| Privacy concerns (Siri) | Low | Low | Data stays local; clear in description |

---

## Implementation Phases

### Phase 1: Basic Integration (MVP)
- Single shortcut: "When should I leave"
- Voice response only
- Requires saved trip

### Phase 2: Enhanced
- Multiple shortcut types
- Siri Suggestions (donated shortcuts)
- Visual response card

### Phase 3: Advanced
- Custom phrase support
- Multi-trip disambiguation
- Shortcuts app workflows
- CarPlay optimization

---

## Open Questions

1. **Which iOS version minimum?** iOS 15 for App Intents? iOS 13 for SiriKit?
2. **Custom phrases—how many?** Let users define unlimited?
3. **Family trip handling?** "When should WE leave?"
4. **Parameterized shortcuts?** "When should I leave for [airport]?"
5. **Localization?** Support multiple languages for Siri?

---

## Appendix: Example Siri Interactions

### Query Variations (All Should Work)

| User Says | JetSweep Hears |
|-----------|----------------|
| "When should I leave for the airport?" | Next trip departure |
| "Hey Siri, JetSweep departure time" | Next trip departure |
| "What time should I leave for my flight?" | Next trip departure |
| "When should I leave for Denver?" | Specific trip departure |
| "Open JetSweep" | Opens app |

### Response Examples

**Single trip:**
"For your flight to Denver at 3pm, leave by 11:30am. That's in 2 hours."

**Multiple trips:**
"You have 2 upcoming trips. For Denver on February 8th, leave by 11:30am. For LA on February 15th, leave by 10:45am. Which would you like details on?"

**No trips:**
"You don't have any saved trips in JetSweep. Open the app to plan your departure."

**Today's trip:**
"Your flight to Denver is today at 3pm. You should leave by 11:30am—that's in 45 minutes."

---

*This PRD is a proposal. Implementation should only proceed after review and approval from Taylor.*
