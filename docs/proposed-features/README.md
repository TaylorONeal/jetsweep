# Proposed Features for JetSweep

> **IMPORTANT: These are proposals only. Do not implement without review and confirmation from Taylor.**

This folder contains Product Requirement Documents (PRDs) for proposed enhancements to JetSweep. Each document explores a potential feature with detailed Jobs-to-Be-Done analysis, technical requirements, and implementation considerations.

## Purpose

These PRDs serve as:
- A library of well-researched feature ideas
- Starting points for discussion and refinement
- Technical blueprints for future development
- Documentation of product thinking and rationale

## Guiding Principles

All proposals align with JetSweep's core philosophy:
- **Planning over prediction**: Conservative, explainable recommendations
- **Buffers over averages**: Safety margins that absorb real-world variability
- **Asymmetric risk awareness**: Being early is cheap; missing a flight is not
- **User trust**: Every feature should increase confidence, not complexity

## Target Outcome: App Store MVP

These features are proposed with App Store readiness in mind:
- Creating a compelling, differentiated value proposition
- Building features that justify native app installation over web
- Ensuring great first-user experience for pioneering adopters
- Meeting Apple's quality and utility expectations

---

## Proposed Features Overview

### Priority 0 (Critical for MVP)

| PRD | Feature | Key Value |
|-----|---------|-----------|
| [001](./001-smart-departure-notifications.md) | **Smart Departure Notifications** | Closes the plan→action loop with timely reminders |
| [002](./002-trip-saving-quick-access.md) | **Trip Saving & Quick Access** | Foundation for all trip-persistent features |
| [008](./008-enhanced-onboarding.md) | **Enhanced Onboarding** | Critical first-30-seconds user experience |

### Priority 1 (High Value)

| PRD | Feature | Key Value |
|-----|---------|-----------|
| [003](./003-flight-status-integration.md) | **Flight Status Integration** | Adjusts departure for delays—unique differentiation |
| [004](./004-ios-home-screen-widgets.md) | **iOS Home Screen Widgets** | Glanceable departure countdown on home screen |
| [005](./005-calendar-integration.md) | **Calendar Integration** | Import flights, export departure times |
| [009](./009-offline-mode.md) | **Enhanced Offline Mode** | Works flawlessly without connectivity |

### Priority 2 (Enhanced Experience)

| PRD | Feature | Key Value |
|-----|---------|-----------|
| [006](./006-share-trip-timeline.md) | **Share Trip Timeline** | Coordinate with travel companions; viral growth |
| [007](./007-apple-watch-companion.md) | **Apple Watch Companion** | Wrist-level glanceability for travel day |
| [010](./010-siri-shortcuts.md) | **Siri Shortcuts** | Voice-activated departure queries |

---

## Feature Dependency Map

```
                    ┌─────────────────────┐
                    │   Trip Saving       │
                    │   (Foundation)      │
                    └─────────┬───────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ Notifications │    │   Widgets     │    │   Sharing     │
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │
        ▼                     ▼
┌───────────────┐    ┌───────────────┐
│ Flight Status │    │  Apple Watch  │
└───────────────┘    └───────────────┘

┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   Calendar    │    │    Offline    │    │     Siri      │
│  (Standalone) │    │  (Standalone) │    │  (Standalone) │
└───────────────┘    └───────────────┘    └───────────────┘

┌─────────────────────────────────────────────────────────┐
│              Enhanced Onboarding (Day 1)                │
└─────────────────────────────────────────────────────────┘
```

## Recommended Implementation Order

### Phase 1: Foundation & First Impression
1. **Enhanced Onboarding** - Ensure great first experience
2. **Trip Saving** - Enable persistence (everything depends on this)
3. **Enhanced Offline Mode** - Ensure reliability

### Phase 2: Core Value Amplification
4. **Smart Notifications** - Complete the plan→action loop
5. **iOS Widgets** - Home screen presence
6. **Calendar Integration** - Meet users where they are

### Phase 3: Differentiation
7. **Flight Status Integration** - Unique delay-aware planning
8. **Share Trip Timeline** - Coordination + growth

### Phase 4: Premium Experience
9. **Apple Watch** - Premium users, premium signal
10. **Siri Shortcuts** - Apple ecosystem integration

---

## PRD Template Structure

Each PRD follows a consistent structure:

1. **Proposal Notice** - Clear statement that this is not approved
2. **Document Info** - ID, status, author, priority
3. **Executive Summary** - One-paragraph overview
4. **Job To Be Done** - Core job statement + deeper narrative
5. **User Personas** - Who benefits and how
6. **Functional Requirements** - What it does
7. **Technical Requirements** - How it's built
8. **User Experience Flows** - Step-by-step interactions
9. **Design Specifications** - Visual details
10. **Success Metrics** - How we measure success
11. **Risks & Mitigations** - What could go wrong
12. **Implementation Phases** - MVP → Enhanced → Advanced
13. **Open Questions** - Decisions to be made

---

## Technical Context

These PRDs are written with awareness of JetSweep's current architecture:

- **Frontend**: React 18 + TypeScript, Vite, Tailwind CSS, shadcn/ui
- **State**: Component-level useState, localStorage for persistence
- **PWA**: vite-plugin-pwa, service worker, installable
- **Calculation Engine**: Deterministic, pure functions, fully client-side
- **No Backend**: All logic runs locally (API integration would change this)

Native iOS features (widgets, notifications, Siri) require:
- Capacitor or native iOS wrapper
- Xcode project and native code
- App Store distribution (not just PWA)

---

## How to Use These Documents

### For Review
1. Read the Executive Summary and Job To Be Done for quick understanding
2. Skim Functional Requirements for scope
3. Check Open Questions for decision points
4. Note any concerns or suggestions

### For Implementation
1. Review Technical Requirements for architecture fit
2. Follow Implementation Phases for MVP scoping
3. Use Success Metrics to define acceptance criteria
4. Reference UX Flows for detailed behavior

### For Discussion
1. Each PRD stands alone—can discuss individually
2. Dependency map helps sequence conversations
3. Priority levels are suggestions, not mandates
4. All aspects are open to revision

---

## Notes

- **Created**: February 2026
- **Author**: Claude (AI Assistant)
- **Status**: All proposals pending review
- **Stack Context**: React/Vite PWA, targeting native iOS via Capacitor

These documents represent thoughtful exploration of JetSweep's potential, not commitments. They are meant to spark discussion, inform decisions, and provide a foundation for future development.

---

*All features in this folder are proposals. Implementation should only proceed after review and approval from Taylor.*
