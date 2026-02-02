# PRD: Enhanced Offline Mode

> **PROPOSED FEATURE - DO NOT IMPLEMENT WITHOUT CONFIRMATION FROM TAYLOR**
>
> This document represents a proposed enhancement to JetSweep. It is meant for review, discussion, and refinement before any implementation work begins. The ideas here are exploratory and subject to change based on feedback, technical feasibility, and strategic alignment.

---

## Document Information

| Field | Value |
|-------|-------|
| **PRD ID** | PRD-009 |
| **Feature Name** | Enhanced Offline Mode |
| **Status** | Proposed |
| **Author** | Claude (AI Assistant) |
| **Created** | 2026-02-01 |
| **Priority** | P1 - Critical for Reliability & App Store |

---

## Executive Summary

Enhanced Offline Mode ensures JetSweep works flawlessly without an internet connection. Travelers often need departure information in connectivity-challenged situations: airplane mode, international roaming, basement parking garages, or congested airport networks. Since JetSweep's core calculation is deterministic and requires no external data, full offline functionality is achievable—and expected by users of a serious travel app.

---

## The Job To Be Done

### Core Job Statement

> **When I** need my departure time but don't have reliable internet,
> **I want to** access my JetSweep plan without connectivity,
> **So I can** trust the app when I need it most.

### Deeper Narrative: The Connectivity Gap

Travel is paradoxically one of the most connectivity-challenged activities:

**At Home (Planning Phase):**
- Strong WiFi
- Unlimited data
- No connectivity issues
- This is when you DON'T urgently need the app

**Day of Travel (Critical Phase):**
- Phone in airplane mode
- International roaming (expensive/slow)
- Airport WiFi (congested, requires login)
- Basement parking garage (no signal)
- Uber ride (spotty cell coverage)
- Boarding (phone airplane mode required)

**The irony:** JetSweep is most valuable precisely when connectivity is most unreliable.

**The Failure Scenario:**

Anna is in an Uber heading to the airport. She opens JetSweep to check her timeline. Her phone shows "E" (poor cellular). The app spins, trying to load something. After 30 seconds of frustration, she closes it and texts her husband: "When did that app say to leave?"

The app failed her when she needed it most. She'll never trust it again.

**The Offline-First Approach:**

With proper offline support, Anna opens JetSweep and immediately sees her saved trip with full timeline—no spinner, no network request. The app works whether she's in airplane mode, international roaming, or a WiFi dead zone.

### Why Offline Matters for App Store

1. **User expectation**: Travel apps should work while traveling
2. **Review prevention**: "App doesn't work without WiFi" = 1-star review
3. **Apple guidelines**: Apps should handle offline gracefully
4. **Differentiation**: Many apps fail offline; JetSweep shouldn't

---

## User Personas & Their Jobs

### Persona 1: The International Traveler
**Job:** "I travel abroad and can't afford data roaming—the app must work offline."

- Avoids international data charges
- Uses phone in airplane mode + WiFi only
- Hotel WiFi for planning, offline for execution
- Will delete apps that require constant connectivity

### Persona 2: The Subway Commuter
**Job:** "I'm underground or in transit with no signal—I need my info cached."

- Frequent connectivity drops during commute to airport
- Underground transit, tunnels, parking garages
- Can't wait for network when they need quick answer
- Expects apps to work instantly, always

### Persona 3: The Battery Saver
**Job:** "I turn off data to save battery—the app shouldn't need internet."

- Conserves battery for long travel days
- Disables cellular data when not needed
- Expects apps to work with data off
- Annoyed by unnecessary network requests

### Persona 4: The Airplane Mode User
**Job:** "I put my phone in airplane mode early to comply with regulations."

- Follows boarding rules strictly
- Phone in airplane mode during taxi/takeoff
- May need to check departure time for return trip while in air
- JetSweep should work entirely offline

---

## Current State Analysis

### What Already Works Offline

JetSweep's current PWA implementation:
- App shell is cached (service worker)
- Core JavaScript/CSS loads offline
- Static assets (icons, images) cached
- Recent searches stored in localStorage

### What Doesn't Work Offline

Current gaps:
- No "saved trips" with full timeline data
- Fresh calculations require app to be open (cache warm)
- No explicit offline indicator
- No offline-specific UX guidance

### Why Full Offline Is Achievable

JetSweep's core is **deterministic and local**:
- Airport data: Static, bundled in app
- Holiday calendar: Static, bundled in app
- Rush hour logic: Static, built-in rules
- Timeline calculation: Pure function, no API

**No external API required for core functionality.**

Only these potential features need network:
- Flight status (proposed feature, optional)
- Cloud sync (future, optional)
- App updates

---

## Functional Requirements

### FR-1: Complete Offline Calculation
Users can create new timeline calculations without any network connection.

**Requirements:**
- All airport data cached locally
- Holiday/rush hour logic works offline
- Form submission works offline
- Results display immediately

### FR-2: Saved Trips Offline Access
All saved trips available offline with full timeline data.

**Requirements:**
- Trips stored locally (localStorage/IndexedDB)
- Full timeline data cached, not just inputs
- Offline trips load instantly
- No network required to view saved content

### FR-3: Offline State Indicator
Clear communication when app is offline.

**Indicator types:**
- Subtle: Small icon showing offline status
- Contextual: Features needing network show explanation
- Never blocking: User can always use core features

### FR-4: Graceful Degradation
Network-dependent features fail gracefully offline.

**Examples:**
- Flight status: "Flight status unavailable offline"
- Cloud sync: "Will sync when online"
- Updates: Check for updates on next connection

### FR-5: Background Caching
Proactively cache data when online for offline use.

**Strategy:**
- Cache all static assets on first load
- Refresh cache periodically when online
- Pre-cache airports and holiday calendar
- Cache user's frequent airports

### FR-6: Offline Notification Scheduling
Notifications scheduled offline work when online.

**Behavior:**
- Notifications use device-level scheduling
- Work regardless of app network state
- Persist through app restarts

---

## Technical Requirements

### TR-1: Service Worker Enhancement
Upgrade existing service worker (via vite-plugin-pwa):
```javascript
// Enhanced caching strategy
workbox.routing.registerRoute(
  ({request}) => request.destination === 'document',
  new workbox.strategies.NetworkFirst({
    cacheName: 'pages',
    networkTimeoutSeconds: 3,  // Fall back to cache quickly
  })
);

// Cache static assets aggressively
workbox.routing.registerRoute(
  ({request}) => ['style', 'script', 'image'].includes(request.destination),
  new workbox.strategies.CacheFirst({
    cacheName: 'assets',
  })
);
```

### TR-2: Data Persistence Layer
```typescript
// Use IndexedDB for larger data
import { openDB } from 'idb';

const db = await openDB('jetsweep', 1, {
  upgrade(db) {
    db.createObjectStore('trips', { keyPath: 'id' });
    db.createObjectStore('airports', { keyPath: 'code' });
    db.createObjectStore('settings');
  },
});

// Save trip (works offline)
await db.put('trips', tripData);

// Get trip (instant, offline)
const trip = await db.get('trips', tripId);
```

### TR-3: Network Status Detection
```typescript
const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};
```

### TR-4: Offline-First Architecture
```typescript
// Calculate timeline - always local, no network
function computeTimeline(inputs: FlightInputs): TimelineResult {
  // This is already fully offline-capable
  // Uses bundled airport data, holiday calendar, etc.
  return result;
}

// Save trip - local first
async function saveTrip(trip: SavedTrip) {
  // Save to IndexedDB immediately
  await localDB.put('trips', trip);

  // Queue sync for when online (future cloud feature)
  if (navigator.onLine && cloudSyncEnabled) {
    await syncToCloud(trip);
  }
}
```

### TR-5: Cache Preloading
```typescript
// On first load or update, cache critical data
async function preloadOfflineData() {
  // Airports already bundled in airports.ts
  // Holiday calendar in travelConditions.ts
  // Nothing to fetch - all static

  // Ensure service worker is active
  if ('serviceWorker' in navigator) {
    await navigator.serviceWorker.ready;
  }
}
```

---

## User Experience Flow

### Flow 1: New Calculation Offline

```
[User opens JetSweep without internet]
     ↓
[App loads from cache (instant)]
     ↓
[Small "Offline" indicator in corner]
     ↓
[User fills out flight form]
     ↓
[Taps "Calculate"]
     ↓
[Timeline calculates instantly (all local)]
     ↓
[User sees full results]
     ↓
[User can save trip (to local storage)]
```

### Flow 2: Viewing Saved Trip Offline

```
[User in airplane mode on flight]
     ↓
[Opens JetSweep]
     ↓
[App loads from cache]
     ↓
["Your Trips" shows saved return flight]
     ↓
[User taps trip]
     ↓
[Full timeline displays instantly]
     ↓
[User has all info needed]
```

### Flow 3: Network-Dependent Feature Offline

```
[User has trip with flight number]
     ↓
[Opens trip while offline]
     ↓
[Timeline shows normally]
     ↓
[Flight status section shows:]
     "Flight status unavailable offline.
      Check back when connected."
     ↓
[Rest of app works normally]
```

---

## Design Specifications

### Offline Indicator

**Subtle Mode (Default):**
```
┌─────────────────────────────────────────┐
│ JETSWEEP                    [📶 Offline]│
│                                         │
```
- Small text in header
- Not alarming
- Informational only

**Feature-Specific:**
```
┌─────────────────────────────────────────┐
│ FLIGHT STATUS                           │
│                                         │
│ ╔═══════════════════════════════════╗   │
│ ║ 📶 Flight status unavailable      ║   │
│ ║    while offline.                  ║   │
│ ╚═══════════════════════════════════╝   │
│                                         │
│ Your departure plan is still valid.     │
│                                         │
└─────────────────────────────────────────┘
```

### No Blocking Modals
Never show:
- "No internet connection" blocking modal
- "Please connect to continue" error
- Spinner waiting for network

**Instead**: Graceful fallbacks and clear explanations

### Offline Badge on Saved Trips
```
┌─────────────────────────────────────────┐
│ ✈ DEN on Feb 8                [✓ Saved] │
│ Available offline                        │
└─────────────────────────────────────────┘
```

---

## Success Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| Offline calculation success rate | 100% | Core feature must always work |
| App launch time (offline) | <1 sec | Cached experience should be fast |
| Offline session completion | >90% | Users accomplish goals offline |
| "Works offline" reviews | Positive mentions | Feature noticed and valued |
| Network-related crashes | 0 | No crashes from connectivity issues |

---

## App Store Impact

### Review Guidelines Compliance
Apple expects apps to:
- Handle network errors gracefully
- Not crash without connectivity
- Provide value offline when possible

JetSweep exceeds this by working fully offline.

### Marketing Opportunity
- "Works completely offline"
- "No internet required"
- "Use it in airplane mode"

### Review Prevention
Eliminating "Doesn't work without WiFi" complaints.

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Stale airport data | Low | Medium | Rare changes; prompt update check |
| IndexedDB storage limits | Low | Low | Trips are small; 5MB limit unlikely hit |
| Service worker issues | Medium | Medium | Thorough testing; fallback to network |
| User doesn't realize offline | Low | Low | Subtle indicator; feature works anyway |

---

## Implementation Phases

### Phase 1: Verify Current State (MVP)
- Audit existing offline capabilities
- Test all core flows without network
- Fix any offline calculation issues
- Add offline indicator

### Phase 2: Enhanced Caching
- IndexedDB for saved trips
- Explicit cache preloading
- Background sync setup

### Phase 3: Complete Offline Experience
- All features work or gracefully degrade
- Cloud sync queuing (when feature added)
- Offline-first architecture throughout

---

## Testing Requirements

### Offline Test Scenarios

| Scenario | Expected Behavior |
|----------|-------------------|
| App launch with no network | Loads from cache instantly |
| New calculation offline | Works completely |
| View saved trip offline | Full timeline visible |
| Set notification offline | Notification scheduled |
| Flight status offline | "Unavailable" message, no crash |
| Transition offline → online | Seamless, background sync |
| First-ever launch offline | May need online for initial download |

### Testing Methods
- Chrome DevTools "Offline" mode
- Airplane mode testing on device
- Network throttling (simulate poor connection)
- Service worker cache inspection

---

## Open Questions

1. **First-launch offline?** Can't download app without internet—how to handle?
2. **Stale data warnings?** Warn if airport data is X months old?
3. **Background sync priority?** Which data syncs first when reconnected?
4. **Storage management?** Auto-delete old trips to free space?

---

## Appendix: Current PWA Configuration

From `vite.config.ts`:
```typescript
VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: "JetSweep – When to leave for the airport",
    short_name: "JetSweep",
    display: "standalone",
    // ...
  }
})
```

Current service worker: Auto-generated by vite-plugin-pwa
Current caching: Basic asset caching

**Recommendation**: Enhance with Workbox strategies for network-first with fast fallback.

---

*This PRD is a proposal. Implementation should only proceed after review and approval from Taylor.*
