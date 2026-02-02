# PRD: Share Trip Timeline

> **PROPOSED FEATURE - DO NOT IMPLEMENT WITHOUT CONFIRMATION FROM TAYLOR**
>
> This document represents a proposed enhancement to JetSweep. It is meant for review, discussion, and refinement before any implementation work begins. The ideas here are exploratory and subject to change based on feedback, technical feasibility, and strategic alignment.

---

## Document Information

| Field | Value |
|-------|-------|
| **PRD ID** | PRD-006 |
| **Feature Name** | Share Trip Timeline |
| **Status** | Proposed |
| **Author** | Claude (AI Assistant) |
| **Created** | 2026-02-01 |
| **Priority** | P2 - Growth & Viral Potential |

---

## Executive Summary

Share Trip Timeline allows users to send their departure plan to family, friends, or travel companions. When traveling with others or when someone needs to know your schedule, sharing creates both practical value and organic app discovery. This feature transforms individual users into advocates and addresses the coordination challenge of group travel.

---

## The Job To Be Done

### Core Job Statement

> **When I** have travel companions or family who need to know when we're leaving,
> **I want to** share my JetSweep timeline with them,
> **So I can** get everyone on the same page without explaining all the details verbally.

### Deeper Narrative: Travel Is Rarely Solo

The majority of air travel involves other people:
- Families traveling together
- Couples on vacation
- Business colleagues on the same flight
- Friends meeting at the airport
- Family members dropping you off

Each of these scenarios involves coordination. And coordination requires shared information.

**The Argument Problem:**

David and his wife Maria are flying from JFK to Miami for a wedding. David used JetSweep and it said to leave by 11:00am for their 3pm flight.

Maria sees this and says: "11am? That seems early. The flight's not until 3!"

David: "But we have to account for the Uber, JFK is huge, the security line..."

Maria: "I think 12 would be fine. We don't need to sit at the gate for hours."

David: "But what if there's traffic? What if security is backed up?"

Maria: *sighs* "Fine, whatever you say."

David has done the work. He has the data. But conveying that reasoning verbally is frustrating and sounds like nagging.

**The Shared Timeline Solution:**

David shares his JetSweep timeline with Maria. She opens it and sees:

```
YOUR DEPARTURE PLAN
JFK → Miami • 3:00pm flight

LEAVE BY: 11:00am

Timeline breakdown:
• 11:00am - Call Uber
• 11:15am - Pickup (15 min wait typical)
• 11:50am - Arrive JFK curb (35 min drive + traffic)
• 12:00pm - Security line (JFK Terminal 4: allow 45 min)
• 12:45pm - Walk to gate (JFK is large: 15 min)
• 1:00pm - Arrive gate
• 1:30pm - Boarding begins

Risk level: Balanced
Stress margin: 1.5 hours buffer
```

Maria sees the reasoning laid out. It's not David being paranoid—it's a logical plan with clear stages. She might still push back, but now it's a conversation about data, not feelings.

### Why Sharing Matters

1. **Coordination**: Group travel requires everyone knowing the plan
2. **Authority**: Shared plan is external authority (reduces conflict)
3. **Growth**: Every share is a potential new user
4. **Trust**: Seeing the breakdown builds confidence in the plan
5. **Simplicity**: One message replaces multiple explanations

---

## User Personas & Their Jobs

### Persona 1: The Family Trip Organizer
**Job:** "I need everyone ready on time without being the bad guy."

- Plans family trips and herds everyone out the door
- Tired of nagging and explaining timing
- Wants shared reference point everyone can see
- Uses sharing as accountability tool

### Persona 2: The Travel Coordinator
**Job:** "I'm organizing travel for a group and need everyone aligned."

- Coordinates business trips or friend group travel
- Needs to communicate one departure time to multiple people
- Values professional-looking summary to share
- May share to multiple channels (group chat, email, etc.)

### Persona 3: The "Keeping Family Posted" Traveler
**Job:** "My parents/spouse want to know when I'm leaving and arriving."

- Has family who track their travel
- Shares plan so family knows when to expect updates
- Values the "flight at 3pm, leaving at 11am" summary
- Reduces "what time are you leaving?" texts

### Persona 4: The JetSweep Advocate
**Job:** "I love this app and want to show my friends why."

- Enthusiastic user who recommends the app
- Uses sharing as demonstration ("look at this breakdown!")
- Wants share to include app download link
- Values the "wow factor" of the detailed timeline

---

## Functional Requirements

### FR-1: Share Sheet Trigger
"Share Plan" button on timeline results and saved trips.

**Share locations:**
- Timeline results screen (after calculation)
- Saved trip card (quick share)
- Trip detail view

### FR-2: Share Formats
Multiple share formats to suit different contexts:

**Format A: Summary Message**
Quick text suitable for SMS or messaging apps:
```
I'm flying from JFK to Miami on Feb 10.
✈️ Flight: 3:00pm
🚗 Leaving by: 11:00am (Balanced plan)

Get your own departure plan: [app link]
```

**Format B: Full Timeline**
Detailed breakdown for those who want context:
```
JetSweep Departure Plan
───────────────────────
JFK → Miami • Feb 10 • 3:00pm flight

LEAVE BY: 11:00am

Timeline:
11:00am ── Call Uber
11:15am ── Pickup
11:50am ── Arrive JFK
12:00pm ── Security
12:45pm ── Walk to gate
1:00pm ── Gate arrival
1:30pm ── Boarding

Risk: Balanced • Buffer: 1.5 hrs

Download JetSweep: [link]
```

**Format C: Image Share**
Visual timeline card for social sharing or screenshot:
- Styled card with JetSweep branding
- Key info: airport, flight time, leave time
- QR code or link to app

### FR-3: Share Channels
Integrate with native iOS share sheet:
- Messages (iMessage, SMS)
- WhatsApp, Telegram, Signal
- Email
- Notes
- Copy to clipboard
- AirDrop

### FR-4: Recipient Experience
Recipients without JetSweep:
- See full plan content (no app required to read)
- Link to download JetSweep
- No account/login wall to view shared content

Recipients with JetSweep:
- Can import shared trip to their own app
- One-tap to add notifications
- Deep link opens trip directly

### FR-5: Share Analytics (Optional)
Track sharing for growth insights:
- Share initiated (which format)
- Share completed
- Link clicked
- App installed from share

---

## Technical Requirements

### TR-1: Native Share Sheet
Use iOS share sheet (`UIActivityViewController`):
```swift
let items: [Any] = [shareText, shareURL]
let activityVC = UIActivityViewController(
    activityItems: items,
    applicationActivities: nil
)
present(activityVC, animated: true)
```

### TR-2: Dynamic Shareable Content
Generate share content on-demand:
```typescript
interface ShareContent {
    text: string;           // Summary or full text
    url: string;            // Deep link or App Store
    image?: string;         // Base64 card image
}

function generateShareContent(
    trip: SavedTrip,
    format: 'summary' | 'full' | 'image'
): ShareContent {
    // Generate appropriate content
}
```

### TR-3: Deep Linking
Allow shared trips to open in recipient's JetSweep:
- URL scheme: `jetsweep://trip/{tripId}`
- Universal links: `https://jetsweep.app/trip/{tripId}`
- Fallback to App Store if not installed

### TR-4: Image Generation
Create shareable visual card:
- Use Canvas API or server-side rendering
- Match app's visual design
- Include key information
- Add JetSweep branding and link

### TR-5: Capacitor Share Plugin
```typescript
import { Share } from '@capacitor/share';

await Share.share({
    title: 'JetSweep Departure Plan',
    text: shareText,
    url: shareUrl,
    dialogTitle: 'Share your departure plan',
});
```

---

## User Experience Flow

### Flow 1: Quick Share from Timeline

```
[User views calculated timeline]
     ↓
[Taps "Share Plan" button]
     ↓
[Format selection sheet:]
     • Quick summary
     • Full timeline
     • Visual card
     ↓
[User selects "Quick summary"]
     ↓
[iOS share sheet opens]
     ↓
[User selects Messages → Mom]
     ↓
[Preview shows:]
     "I'm flying from JFK to Miami on Feb 10.
      ✈️ Flight: 3:00pm
      🚗 Leaving by: 11:00am"
     ↓
[User sends]
     ↓
["Shared ✓" confirmation]
```

### Flow 2: Group Travel Coordination

```
[User on saved trip detail]
     ↓
[Taps "Share with Travel Companions"]
     ↓
[Selects "Full timeline"]
     ↓
[Share sheet → WhatsApp group]
     ↓
[Full timeline sent to "Miami Wedding Trip" group]
     ↓
[Group members see detailed plan]
     ↓
[Some tap link → Download JetSweep]
```

### Flow 3: Recipient Opens Shared Link

```
[Recipient gets shared message]
     ↓
[Taps jetsweep.app/trip/abc123 link]
     ↓
[If JetSweep installed:]
     App opens to shared trip view
     "David shared a trip with you"
     [Save to My Trips] [Set Reminder]
     ↓
[If not installed:]
     Web preview shows timeline
     [Download JetSweep] button prominent
     ↓
[User downloads app]
     ↓
[App opens with shared trip pre-loaded]
```

---

## Design Specifications

### Share Button
- **Location**: Top-right of timeline screen
- **Icon**: Share icon (iOS system icon)
- **Label**: "Share Plan" or just icon

### Format Selection Sheet

```
┌─────────────────────────────────────────┐
│ SHARE YOUR DEPARTURE PLAN               │
│ ─────────────────────────               │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 📝 Quick Summary                    │ │
│ │    "Leaving at 11am for 3pm flight" │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 📋 Full Timeline                    │ │
│ │    Complete breakdown with stages   │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🖼️ Visual Card                      │ │
│ │    Stylized image for sharing       │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Cancel]                                │
└─────────────────────────────────────────┘
```

### Visual Share Card

```
┌─────────────────────────────────────────┐
│                                         │
│           ✈️ JETSWEEP                   │
│                                         │
│     JFK → Miami                         │
│     Feb 10, 2026                        │
│                                         │
│     ─────────────────                   │
│     LEAVE BY                            │
│         11:00am                         │
│     ─────────────────                   │
│                                         │
│     Flight: 3:00pm                      │
│     Buffer: 1.5 hours                   │
│                                         │
│     ─────────────────                   │
│     jetsweep.app                        │
│                                         │
└─────────────────────────────────────────┘
```

### Shared Trip View (Recipient)

```
┌─────────────────────────────────────────┐
│ ← Back                                  │
│                                         │
│ SHARED TRIP                             │
│ From: David                             │
│                                         │
│ [Full timeline display, same as app]   │
│                                         │
│ ─────────────────────────               │
│                                         │
│ [Save to My Trips]                      │
│                                         │
│ ─────────────────────────               │
│                                         │
│ Don't have JetSweep?                    │
│ [Download on App Store]                 │
│                                         │
└─────────────────────────────────────────┘
```

---

## Growth Implications

### Viral Loop Potential

```
User creates plan → Shares with companion → Companion impressed →
Companion downloads JetSweep → Creates own plan → Shares with others →
...
```

**Key viral loop factors:**
- Share has inherent utility (not just promotion)
- Full content visible without download (reduces friction)
- Clear "get your own" call to action
- One-tap to import shared trip

### Share Attribution
Track organic growth from sharing:
- Unique link per share? (complex, but measurable)
- Or: General referral link (simpler)
- Install attribution via App Store analytics

---

## Success Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| Shares per user (first 30 days) | >0.5 | Most users share at least one trip |
| Share completion rate | >60% | Users follow through after tapping share |
| Link click-through rate | >20% | Recipients engage with shared content |
| Install from share | >5% of clicks | Share drives new users |
| Shared trip imports | >30% of recipients | JetSweep users save shared trips |

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Shares feel spammy/promotional | Medium | High | Lead with utility; make app link subtle |
| Complex deep linking setup | Medium | Medium | Start with simple share; add deep links in Phase 2 |
| Privacy concerns (sharing travel plans) | Low | Medium | Clear sharing controls; no location data |
| Low share adoption | Medium | Medium | Prominent placement; contextual prompts |

---

## Implementation Phases

### Phase 1: Basic Sharing (MVP)
- Summary text share
- Native share sheet
- App Store link only

### Phase 2: Enhanced Sharing
- Multiple format options
- Visual share card
- Deep linking to app

### Phase 3: Advanced
- Web preview for non-app users
- Trip import for recipients
- Share analytics

---

## Open Questions

1. **Should we require account for sharing?** Or allow anonymous shares?
2. **Privacy of shared trips?** Expiring links? Public URLs?
3. **Edit shared trips?** If original user updates trip, does shared version update?
4. **Share history?** Should users see what they've shared?
5. **Recipient notifications?** If sharer updates trip, notify recipients?

---

## Appendix: Example Share Messages

### Summary (SMS/iMessage)
```
I'm flying from JFK to Miami on Feb 10.
✈️ Flight: 3:00pm
🚗 Leaving by: 11:00am

Plan your own trip: jetsweep.app
```

### Full Timeline (Email)
```
Subject: JetSweep Departure Plan - JFK to Miami

Hi!

Here's my departure plan for our trip:

DESTINATION: Miami (MIA)
DEPARTURE: JFK on Feb 10
FLIGHT TIME: 3:00pm domestic

LEAVE BY: 11:00am

TIMELINE:
11:00am - Call Uber (allow 15 min pickup)
11:15am - Pickup
11:50am - Arrive JFK curb
12:00pm - Security (JFK Terminal 4 - allow 45 min)
12:45pm - Walk to gate
1:00pm - Arrive at gate
1:30pm - Boarding begins

RISK PREFERENCE: Balanced
BUFFER TIME: 1.5 hours before boarding

---
Create your own departure plan at jetsweep.app
```

---

*This PRD is a proposal. Implementation should only proceed after review and approval from Taylor.*
