JetSweep

JetSweep is a planning-first airport timing application that helps travelers determine when to leave for the airport based on realistic operational friction rather than optimistic averages or real-time predictions.

The core problem JetSweep addresses is not route optimization, but risk management. Missing a flight has a high cost, and most existing tools systematically underestimate airport-side variability.

JetSweep is designed to be conservative, explainable, and predictable.

Problem Statement

Most travel applications answer questions like:

“What is the fastest route to the airport?”

“What time should I arrive?”

These answers typically rely on:

optimistic traffic assumptions

narrow TSA wait estimates

single-point arrival times

They do not model:

curb congestion

security volatility

terminal scale

operational edge cases that experienced travelers recognize

JetSweep instead answers a different question:

When should I leave to arrive at my gate with sufficient margin, given how airports actually behave?

Core Principles

Planning over prediction
JetSweep does not attempt to forecast real-time conditions.

Buffers over averages
All time values are modeled as ranges intended to absorb variability.

Explainability over precision
If the recommendation is wrong, the reason should be understandable.

Asymmetric risk awareness
Arriving early is cheap. Missing a flight is expensive.

Architecture Overview

JetSweep uses a layered, deterministic model:

1. Airport Tier Model (Backbone)

All U.S. airports are categorized into four tiers based on scale and operational complexity:

MEGA

LARGE

MEDIUM

GENERIC

Each tier defines default ranges for:

curb-to-gate walk time

curb congestion overhead

parking-to-terminal time

rideshare pickup overhead

security variability

checked baggage overhead

typical off-peak drive time from city center

These values represent planning buffers, not historical averages.

2. Exception Airport Overrides

A small, fixed set of airports consistently violate tier assumptions due to layout, access constraints, or operational behavior.

For these airports, JetSweep applies surgical overrides that adjust only the relevant fields and attach a human-readable advisory.

Overrides are intentionally limited in scope and count to preserve:

maintainability

clarity

long-term correctness

3. Deterministic Timeline Calculation

Inputs include:

flight departure time

airport

domestic vs international

checked baggage

security program (none, PreCheck, PreCheck + Clear)

transport mode

travel day type (regular vs peak/holiday)

The system produces a stage-based timeline, including:

leave home window

arrival overhead

bag drop

security

terminal transit

boarding buffer

gate arrival

Each stage is represented as a time window, not a point estimate.

4. Stress Margin Classification

JetSweep classifies the resulting plan using a margin-based heuristic:

CALM: ≥ 25 minutes at gate

TIGHT: 10–24 minutes

RISKY: < 10 minutes

This classification is surfaced prominently and is not softened or hidden.

User Interface

Mobile-first layout

Vertical timeline visualization

Explicit time windows at each stage

Clear separation between recommendation and explanation

Subtle motion used only to improve comprehension

A small advisory element (“Heads up”) is displayed when an airport-specific pain point applies.

Data Model

JetSweep relies on a static, versioned airport model with the following structure:

{
  code: string;                  // IATA
  name: string;                  // Full airport name
  tier: 'MEGA' | 'LARGE' | 'MEDIUM' | 'GENERIC';
  walk: [number, number];
  curb: [number, number];
  parking: [number, number];
  rideshare: [number, number];
  securityAdd: [number, number];
  baggageAdd: [number, number];
  painPoint?: string;
  typicalDriveTime: number;
}


No external APIs are required for core functionality.

What JetSweep Explicitly Does Not Do

No real-time traffic integration

No TSA wait-time scraping

No flight tracking

No probabilistic predictions

This is an intentional design constraint.

Intended Audience

Frequent travelers

Travelers managing tight schedules

Users who value reliability over optimism

Teams exploring explainable planning models

Future Work

Potential extensions include:

international airport coverage

optional user calibration over time

refined holiday modeling

scenario comparison views

No commitments are implied.
