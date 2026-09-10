import { useState } from "react";
import { Link } from "react-router-dom";
import { clearRecentSearches } from "@/lib/recentSearches";
import { clearAirportPreferences } from "@/lib/airportPreferences";
export default function Privacy() {
  const [preferencesMessage, setPreferencesMessage] = useState("");
  const [clearMessage, setClearMessage] = useState("");
  return (
    <main className="container max-w-lg py-8 pt-safe space-y-5">
      <Link to="/" className="inline-block py-4 text-primary">
        ← Home
      </Link>
      <h1 className="text-3xl">Your plans, on your device.</h1>
      <p>
        JetSweep calculates departure plans on your device. It stores up to five
        recent plans in local storage, including airport, flight time, and
        selected travel options. Your default and most recently selected airports are also saved locally.
      </p>
      <p>
        No account, advertising, or analytics service is used by this app. When you tap “Use my location,” the app requests a one-time location reading to suggest nearby supported airports. Coordinates are processed on your device, never saved by JetSweep, and never sent to a JetSweep server. The web hosting provider may receive ordinary request
        information when you visit the website. Native builds bundle the planner
        for offline use.
      </p>
      <p>
        Clearing app or browser data removes saved plans. Device backups may
        retain app data according to your system settings.
      </p>
      <button
        className="rounded-xl border border-border p-4"
        onClick={() => {
          setClearMessage(clearRecentSearches()
            ? "Recent plans cleared on this device."
            : "Could not clear recent plans. Try clearing app or browser data.");
        }}
      >
        Clear recent plans
      </button>
      {clearMessage && <p role="status">{clearMessage}</p>}
      <button className="rounded-xl border border-border p-4" onClick={() => {
        if (clearAirportPreferences()) setPreferencesMessage("Saved airport preferences cleared.");
        else setPreferencesMessage("Could not clear preferences. Try clearing app or browser data.");
      }}>Clear saved airport preferences</button>
      {preferencesMessage && <p role="status">{preferencesMessage}</p>}
      <p className="text-sm text-muted-foreground">
        Planning estimates are not live flight, traffic, or security
        information.
      </p>
    </main>
  );
}
