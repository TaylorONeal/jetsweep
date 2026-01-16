import { useState, useEffect } from 'react';
import { FlightForm } from '@/components/FlightForm';
import { Timeline } from '@/components/Timeline';
import { FlightInputs, TimelineResult, computeTimeline } from '@/lib/timeline';
import { LandingHero } from '@/components/LandingHero';
import { TakeoffAnimation } from '@/components/TakeoffAnimation';
import { getRecentSearches, saveRecentSearch, RecentSearch } from '@/lib/recentSearches';
import { getAirportProfile } from '@/lib/airports';

const Index = () => {
  const [result, setResult] = useState<TimelineResult | null>(null);
  const [flightTime, setFlightTime] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showTakeoff, setShowTakeoff] = useState(false);
  const [pendingInputs, setPendingInputs] = useState<FlightInputs | null>(null);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  const handleSubmit = (inputs: FlightInputs) => {
    // Store inputs and show takeoff animation
    setPendingInputs(inputs);
    setShowTakeoff(true);
  };

  const handleTakeoffComplete = () => {
    if (!pendingInputs) return;

    const timeline = computeTimeline(pendingInputs);
    setResult(timeline);
    setFlightTime(pendingInputs.departureDateTime);
    setShowTakeoff(false);
    setShowForm(false);

    // Save to recent searches
    if (pendingInputs.airport) {
      const { profile } = getAirportProfile(pendingInputs.airport);
      saveRecentSearch({
        airport: pendingInputs.airport,
        airportName: profile.name,
        tripType: pendingInputs.tripType,
        leaveTime: timeline.leaveTime.toISOString(),
        flightTime: pendingInputs.departureDateTime.toISOString(),
      });
      setRecentSearches(getRecentSearches());
    }

    setPendingInputs(null);
  };

  const handleBack = () => {
    setResult(null);
    setFlightTime(null);
  };

  const handleBackToLanding = () => {
    setShowForm(false);
    setResult(null);
    setFlightTime(null);
  };

  const handleStartFlow = () => {
    setShowForm(true);
  };

  const handleQuickSearch = (search: RecentSearch) => {
    // Create a quick calculation with defaults from the recent search
    const departureDateTime = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const inputs: FlightInputs = {
      departureDateTime,
      tripType: search.tripType,
      hasPreCheck: false,
      hasClear: false,
      hasCheckedBag: false,
      airport: search.airport,
      groupType: 'solo',
      transportType: 'rideshare',
      isHoliday: false,
      isBadWeather: false,
      riskPreference: 'balanced',
    };
    handleSubmit(inputs);
  };

  // Show takeoff animation
  if (showTakeoff && pendingInputs) {
    return (
      <TakeoffAnimation
        onComplete={handleTakeoffComplete}
        airportCode={pendingInputs.airport}
      />
    );
  }

  // Show timeline results
  if (result && flightTime) {
    return <Timeline result={result} flightTime={flightTime} onBack={handleBack} />;
  }

  // Show input form
  if (showForm) {
    return (
      <div className="min-h-screen bg-background">
        <header className="pt-safe">
          <div className="container py-6">
            <button 
              onClick={handleBackToLanding}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              ← Back
            </button>
            <h1 className="font-display text-2xl font-semibold text-foreground mt-4">
              Build your timeline
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Enter your flight details below.
            </p>
          </div>
        </header>

        <main className="container pb-12">
          <div className="max-w-md mx-auto">
            <div className="card-elevated rounded-2xl p-6 deco-border">
              <FlightForm onSubmit={handleSubmit} />
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6 px-4">
              Calculations include airport-specific data for the top 25 US airports
              with realistic buffer ranges for each travel stage.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Show landing hero
  return (
    <LandingHero 
      onStart={handleStartFlow} 
      recentSearches={recentSearches}
      onQuickSearch={handleQuickSearch}
    />
  );
};

export default Index;
