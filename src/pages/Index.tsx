import { useState } from 'react';
import { FlightForm } from '@/components/FlightForm';
import { Timeline } from '@/components/Timeline';
import { FlightInputs, TimelineResult, computeTimeline } from '@/lib/timeline';
import { Plane } from 'lucide-react';

const Index = () => {
  const [result, setResult] = useState<TimelineResult | null>(null);
  const [flightTime, setFlightTime] = useState<Date | null>(null);

  const handleSubmit = (inputs: FlightInputs) => {
    const timeline = computeTimeline(inputs);
    setResult(timeline);
    setFlightTime(inputs.departureDateTime);
  };

  const handleBack = () => {
    setResult(null);
    setFlightTime(null);
  };

  if (result && flightTime) {
    return <Timeline result={result} flightTime={flightTime} onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="pt-safe">
        <div className="container py-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 mb-4">
              <Plane className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
              JetLag
            </h1>
            <p className="text-muted-foreground mt-2">
              Never miss a flight again
            </p>
          </div>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/50" />
            <div className="w-2 h-2 rotate-45 bg-primary/50" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/50" />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container pb-12">
        <div className="max-w-md mx-auto">
          <div className="card-elevated rounded-2xl p-6 deco-border">
            <FlightForm onSubmit={handleSubmit} />
          </div>

          {/* Footer tip */}
          <p className="text-center text-xs text-muted-foreground mt-6 px-4">
            Calculations include airport-specific data for the top 25 US airports
            with realistic buffer ranges for each travel stage.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
