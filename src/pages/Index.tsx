import { useEffect, useState } from "react";
import { FlightForm } from "@/components/FlightForm";
import { Timeline } from "@/components/Timeline";
import { FlightInputs, computeTimeline } from "@/lib/timeline";
import { LandingHero } from "@/components/LandingHero";
import {
  getRecentSearches,
  saveRecentSearch,
  RecentSearch,
} from "@/lib/recentSearches";

const Index = () => {
  const [screen, setScreen] = useState<"home" | "form" | "result">("home");
  const [inputs, setInputs] = useState<Partial<FlightInputs>>();
  const [result, setResult] = useState<ReturnType<
    typeof computeTimeline
  > | null>(null);
  const [recentSearches, setRecentSearches] = useState(getRecentSearches);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);
  // Use browser history for Android's system back gesture as well as browser Back.
  useEffect(() => {
    const back = () => setScreen("home");
    window.addEventListener("popstate", back);
    return () => window.removeEventListener("popstate", back);
  }, []);
  const openForm = (initial?: Partial<FlightInputs>) => {
    setInputs(initial);
    if (screen === "home")
      window.history.pushState({}, "", window.location.href);
    setScreen("form");
  };
  const submit = (next: FlightInputs) => {
    const timeline = computeTimeline(next);
    setInputs(next);
    setResult(timeline);
    const { departureDateTime, ...savedInputs } = next;
    saveRecentSearch({
      airport: next.airport!,
      airportName: timeline.airportProfile.name,
      tripType: next.tripType,
      leaveTime: timeline.leaveTime.toISOString(),
      flightTime: departureDateTime.toISOString(),
      inputs: savedInputs,
    });
    setRecentSearches(getRecentSearches());
    setScreen("result");
  };
  const reuse = (search: RecentSearch) =>
    openForm({
      ...search.inputs,
      airport: search.airport,
      tripType: search.tripType,
      departureDateTime: new Date(search.flightTime),
    });
  if (screen === "result" && result && inputs?.departureDateTime)
    return (
      <Timeline
        result={result}
        flightTime={inputs.departureDateTime}
        onBack={() => setScreen("form")}
      />
    );
  if (screen === "form")
    return (
      <div className="min-h-screen bg-background pt-safe pb-safe">
        <header className="container max-w-lg py-4">
          <button
            className="text-sm text-muted-foreground min-h-11"
            onClick={() => window.history.back()}
          >
            ← Home
          </button>
          <p className="text-primary text-xs tracking-[0.25em] uppercase mt-2">
            JetSweep / Departure planner
          </p>
        </header>
        <main className="container max-w-lg pb-8">
          <div className="card-elevated rounded-3xl p-5 sm:p-6">
            <FlightForm onSubmit={submit} initialInputs={inputs} />
          </div>
          <p className="text-center text-xs text-muted-foreground mt-5">
            Your recent plans stay on this device.
          </p>
        </main>
      </div>
    );
  return (
    <LandingHero
      onStart={() => openForm()}
      recentSearches={recentSearches}
      onQuickSearch={reuse}
    />
  );
};
export default Index;
