# JetSweep

JetSweep is a planning-first airport timing application designed to help travelers determine **when to leave for the airport** based on realistic operational friction rather than optimistic averages or real-time predictions.

The core problem JetSweep addresses is **risk management**, not route optimization.  
Arriving early is inexpensive. Missing a flight is not.

JetSweep is intentionally conservative, deterministic, and explainable.

---

## Problem

Most travel applications attempt to answer questions such as:

- What is the fastest route to the airport?
- What time should I arrive?

These answers typically rely on:
- optimistic traffic assumptions
- narrow TSA wait estimates
- single-point arrival times

They fail to account for:
- curb congestion
- security volatility
- terminal scale and layout
- airport-specific failure modes that experienced travelers recognize

JetSweep answers a different question:

> When should I leave so that I arrive at my gate with sufficient margin, given how airports actually behave?

---

## Design Principles

- **Planning over prediction**  
  JetSweep does not attempt to forecast real-time conditions.

- **Buffers over averages**  
  All time values are modeled as ranges intended to absorb variability.

- **Explainability over precision**  
  If the recommendation is wrong, the reason should be understandable.

- **Asymmetric risk awareness**  
  The cost of being early is small; the cost of missing a flight is high.

---

## Architecture Overview

JetSweep uses a layered, deterministic timing model.

### 1. Airport Tier Model (Backbone)

All U.S. airports are categorized into four tiers based on scale and operational complexity:

- MEGA
- LARGE
- MEDIUM
- GENERIC

Each tier defines default planning ranges for:

- curb-to-gate walk time
- curb congestion overhead
- parking-to-terminal time
- rideshare pickup overhead
- security variability
- checked baggage overhead
- typical off-peak drive time from city center

These values are **planning buffers**, not historical averages.

---

### 2. Exception Airport Overrides

A small, fixed set of airports consistently violate tier assumptions due to layout, access constraints, or operational behavior.

For these airports, JetSweep applies **surgical overrides** that:

- adjust only the rel
