# PRD: Enhanced Onboarding Experience

> **PROPOSED FEATURE - DO NOT IMPLEMENT WITHOUT CONFIRMATION FROM TAYLOR**
>
> This document represents a proposed enhancement to JetSweep. It is meant for review, discussion, and refinement before any implementation work begins. The ideas here are exploratory and subject to change based on feedback, technical feasibility, and strategic alignment.

---

## Document Information

| Field | Value |
|-------|-------|
| **PRD ID** | PRD-008 |
| **Feature Name** | Enhanced Onboarding Experience |
| **Status** | Proposed |
| **Author** | Claude (AI Assistant) |
| **Created** | 2026-02-01 |
| **Priority** | P0 - Critical for App Store Success |

---

## Executive Summary

Enhanced Onboarding transforms JetSweep's first-run experience from a blank form into a guided journey that demonstrates value before asking for input. For App Store success, onboarding is critical—users who don't understand the app's value in the first 30 seconds often delete it. This feature ensures every new user understands why JetSweep exists, how it's different, and experiences the "aha moment" quickly.

---

## The Job To Be Done

### Core Job Statement

> **When I** open a new travel app for the first time,
> **I want to** immediately understand what it does and why I should care,
> **So I can** decide if it's worth my time and trust.

### Deeper Narrative: The 30-Second Window

App Store data consistently shows that users make keep-or-delete decisions within 30 seconds of first launch. In that window, they're asking:

1. "What does this do?"
2. "Why is it better than what I have?"
3. "Is it worth the effort to learn?"

If any answer is unclear, they close the app. If they close without understanding, they delete.

**The Current Gap:**

Today, JetSweep opens to a landing page with recent searches (empty for new users) and a "Plan Your Trip" button. A new user sees:

```
JETSWEEP

[Empty recent searches]

[Plan Your Trip →]
```

They might tap "Plan Your Trip" and see a complex form with airports, dates, security options, transport types...

**The Internal Monologue:**

"Ok, I pick an airport... enter a time... what's risk preference? Seat of Pants? Is this a game? Why is this better than just leaving 2 hours early like always?"

They haven't experienced the value. They don't understand the differentiation. They close the app.

**The Onboarding Opportunity:**

What if the first 30 seconds looked like this:

```
[Screen 1: The Problem]
"Most travel apps tell you the fastest route.
They don't tell you when to leave."

[Screen 2: The Risk]
"Arriving late = catastrophic.
Arriving early = fine.
So why do we plan for average?"

[Screen 3: JetSweep's Approach]
"JetSweep plans for reality:
✓ Airport-specific security times
✓ Holiday and rush hour patterns
✓ Conservative buffers, not optimistic guesses"

[Screen 4: See It In Action]
"Let's try it with a sample flight."
[Interactive demo with LAX at 3pm]

[Screen 5: Your Turn]
"Ready to plan your real trip?"
[Begin →]
```

Now the user understands: this app answers a question no other app answers well, and it does so with airport intelligence and risk awareness.

---

## User Personas & Their Jobs

### Persona 1: The Skeptical Downloader
**Job:** "Convince me this app is worth keeping."

- Downloaded after seeing App Store listing or recommendation
- Has 50+ apps, actively prunes unused ones
- Needs clear value proposition fast
- Won't read paragraphs—needs visual communication

### Persona 2: The Anxious Traveler
**Job:** "Show me this will help with my airport stress."

- Downloaded specifically because travel makes them anxious
- Looking for confidence and reassurance
- Needs to see how the app reduces uncertainty
- Wants emotional resonance, not just features

### Persona 3: The Power User
**Job:** "Skip the basics—let me use the full features immediately."

- Has seen the app before or was referred by a friend
- Knows what they want
- Wants option to skip onboarding entirely
- Will explore features on their own

### Persona 4: The Confused First-Timer
**Job:** "Walk me through exactly how this works."

- Not sure what "departure planning" even means
- Needs hand-holding through first calculation
- Benefits from guided tutorial
- Will abandon if confused

---

## Functional Requirements

### FR-1: First-Launch Detection
Detect first app launch and show onboarding flow.

**State management:**
- Track `hasCompletedOnboarding` in localStorage
- Show onboarding only once (unless user resets)
- Allow "Skip" at any point for power users

### FR-2: Onboarding Screens
Progressive disclosure of value proposition:

**Screen 1: The Hook**
- Headline: "When should you leave for the airport?"
- Subtext: "It's the most important travel question nobody answers well."
- Visual: Clock with uncertainty visualization

**Screen 2: The Problem**
- Headline: "Most apps optimize for speed."
- Subtext: "JetSweep optimizes for peace of mind."
- Visual: Comparison (fast route vs. safe timing)

**Screen 3: The Approach**
- Headline: "We plan for how airports actually work."
- Three cards:
  - "Airport intelligence" (50+ airports, tier-based)
  - "Real-world patterns" (holidays, rush hour)
  - "Your risk preference" (Early Bird to Seat of Pants)
- Visual: Icons for each concept

**Screen 4: Interactive Demo**
- Headline: "See it in action"
- Pre-filled sample: LAX, 3:00pm, domestic, Balanced
- User sees timeline generate with explanation
- Highlights: "This is your leave time. Here's why."

**Screen 5: Your Turn**
- Headline: "Ready to plan your trip?"
- Subtext: "It takes 30 seconds."
- CTA: "Plan My Trip"
- Secondary: "Maybe Later" (goes to landing page)

### FR-3: Skip Option
Power users can skip at any point.

- "Skip" button visible on every screen
- Tapping goes directly to main app
- Remembers onboarding as complete

### FR-4: Progress Indication
Users know where they are in the flow.

- Dots or progress bar: ●●●○○
- Swipe or tap to navigate
- Can go back to previous screens

### FR-5: Replay Access
Users can re-watch onboarding from settings.

- Settings → "View Introduction"
- Same flow, any time

---

## Technical Requirements

### TR-1: Onboarding State
```typescript
interface OnboardingState {
  hasCompletedOnboarding: boolean;
  completedAt?: string;
  skippedAt?: string;  // Track if skipped
  viewCount: number;   // How many times viewed
}

// Check on app launch
const shouldShowOnboarding = !localStorage.getItem('onboardingComplete');
```

### TR-2: Screen Components
Each onboarding screen as a component:
```typescript
interface OnboardingScreen {
  id: string;
  headline: string;
  subtext?: string;
  visual: React.ReactNode;
  cta?: {
    text: string;
    action: () => void;
  };
}
```

### TR-3: Animation/Transitions
Smooth transitions between screens:
- Swipe left/right
- Fade or slide animations
- Progress indicator updates smoothly

### TR-4: Interactive Demo
Sample timeline with real calculation:
- Pre-filled inputs
- Actual `computeTimeline` call
- Annotated results explaining each stage

### TR-5: Analytics (Optional)
Track onboarding engagement:
- Screen reached
- Time per screen
- Skip rate and skip screen
- Completion rate

---

## User Experience Flow

### Flow 1: First Launch (Full Onboarding)

```
[User opens JetSweep for first time]
     ↓
[Onboarding Screen 1: The Hook]
     "When should you leave for the airport?"
     [Next →]
     ↓
[Screen 2: The Problem]
     "Most apps optimize for speed..."
     [Next →]
     ↓
[Screen 3: The Approach]
     Three feature cards
     [Next →]
     ↓
[Screen 4: Interactive Demo]
     Sample LAX timeline generates
     User sees breakdown explained
     [Got It →]
     ↓
[Screen 5: Your Turn]
     "Ready to plan your trip?"
     [Plan My Trip →]
     ↓
[Main app: Flight form]
```

### Flow 2: Skip to App

```
[User opens JetSweep for first time]
     ↓
[Onboarding Screen 1]
     ↓
[User taps "Skip" in corner]
     ↓
[Main landing page immediately]
     ↓
[onboardingComplete = true]
```

### Flow 3: Return Visit

```
[User opens JetSweep (not first time)]
     ↓
[Main landing page (no onboarding)]
     ↓
[Recent searches or saved trips visible]
```

---

## Design Specifications

### Visual Language
Match JetSweep's existing premium aesthetic:
- Dark background (#0a0a0a)
- Gold and cyan accents
- Playfair Display for headlines
- Inter for body text
- Generous whitespace

### Screen Layouts

**Screen 1: The Hook**
```
┌─────────────────────────────────────────┐
│                                         │
│            [Skip]                       │
│                                         │
│                                         │
│        When should you                  │
│        leave for the                    │
│          airport?                       │
│                                         │
│    It's the most important travel       │
│    question nobody answers well.        │
│                                         │
│                                         │
│           [Clock Visual]                │
│                                         │
│                                         │
│                                         │
│              ●○○○○                      │
│           [Next →]                      │
│                                         │
└─────────────────────────────────────────┘
```

**Screen 3: The Approach**
```
┌─────────────────────────────────────────┐
│                                         │
│            [Skip]                       │
│                                         │
│     We plan for how airports            │
│        actually work.                   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │ 🏛️ Airport Intelligence        │   │
│   │ 50+ airports with custom timing │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │ 📅 Real-World Patterns          │   │
│   │ Holidays, rush hour, weather    │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │ 🎚️ Your Risk Preference         │   │
│   │ From cautious to cutting close  │   │
│   └─────────────────────────────────┘   │
│                                         │
│              ●●●○○                      │
│           [Next →]                      │
│                                         │
└─────────────────────────────────────────┘
```

**Screen 4: Interactive Demo**
```
┌─────────────────────────────────────────┐
│                                         │
│            [Skip]                       │
│                                         │
│         See it in action                │
│                                         │
│   Sample: LAX, 3pm flight, domestic     │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │                                 │   │
│   │   LEAVE BY: 11:45am            │   │
│   │                                 │   │
│   │   Timeline:                     │   │
│   │   11:45am - Leave home         │   │
│   │   12:30pm - Arrive LAX         │   │
│   │   12:45pm - Security           │   │
│   │   1:30pm  - Gate               │   │
│   │   2:30pm  - Boarding           │   │
│   │                                 │   │
│   │   ⬅ LAX is large, so we add   │   │
│   │     extra walk time.            │   │
│   │                                 │   │
│   └─────────────────────────────────┘   │
│                                         │
│              ●●●●○                      │
│           [Got It →]                    │
│                                         │
└─────────────────────────────────────────┘
```

### Micro-Animations
- Screens slide left/right on swipe or button tap
- Feature cards fade in sequentially
- Timeline demo animates as if calculating
- Progress dots smoothly transition

---

## Copywriting Guidelines

### Tone
- Confident but not arrogant
- Empathetic to traveler anxiety
- Clear, not clever
- Short sentences

### Key Messages
1. This app answers a question others don't
2. It's based on real airport data, not guesses
3. It optimizes for peace of mind, not speed
4. It takes 30 seconds to use

### Headlines (Max 8 Words)
- "When should you leave for the airport?"
- "Most apps optimize for speed."
- "We plan for how airports actually work."
- "See it in action."
- "Ready to plan your trip?"

---

## Success Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| Onboarding completion rate | >70% | Users find it valuable |
| Skip rate | <20% | Onboarding is engaging |
| First calculation rate | >60% | Onboarding drives action |
| Day 1 retention | >40% | Users understand value |
| Day 7 retention | >25% | Value persists beyond onboarding |

---

## App Store Impact

### First Impression Matters
- App Store reviewers experience onboarding
- Clear value prop = favorable review
- Confused users = 1-star ratings

### Screenshot Opportunity
- Onboarding screens can be App Store screenshots
- "Here's what JetSweep does" clearly communicated
- Visual progression tells the story

### Keyword Alignment
Ensure onboarding reinforces App Store keywords:
- "airport departure time"
- "when to leave for flight"
- "travel planning"

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Users skip without understanding | Medium | High | Make screens genuinely valuable; don't make skip too prominent |
| Onboarding feels too long | Medium | Medium | Keep to 5 screens max; allow swipe-through |
| Interactive demo confuses | Low | Medium | Use simple, relatable sample (LAX, 3pm) |
| Power users annoyed | Low | Low | Clear skip option; remember preference |

---

## Implementation Phases

### Phase 1: Foundation (MVP)
- 5 screen onboarding flow
- Static content
- Skip functionality
- Completion tracking

### Phase 2: Enhanced
- Interactive demo calculation
- Animations and transitions
- Analytics tracking
- A/B testing capability

### Phase 3: Advanced
- Personalized onboarding (different paths)
- Contextual tips after onboarding
- In-app education system

---

## Open Questions

1. **How many screens?** 5 seems right, but should test 3 vs 5 vs 7
2. **Interactive or static demo?** Interactive shows power but adds complexity
3. **Personalization?** Should we ask "Do you travel often?" and adjust?
4. **Gamification?** Progress bar with "achievement" at end?
5. **Video vs. screens?** Short video might be more engaging?

---

## Appendix: Onboarding Best Practices

### What Works
- Show value before asking for anything
- Progressive disclosure (don't overwhelm)
- Clear progress indication
- Easy skip for returning users
- Single action per screen

### What Doesn't Work
- Asking for permissions upfront
- Too many screens (fatigue)
- No clear benefit communication
- Required account creation
- Dense text explanations

---

*This PRD is a proposal. Implementation should only proceed after review and approval from Taylor.*
