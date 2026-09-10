import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plane,
  Search,
  ShieldCheck,
} from "lucide-react";
import { FlightInputs } from "@/lib/timeline";
import {
  getAllAirports,
  OTHER_AIRPORT_OPTIONS,
  getAirportProfile,
} from "@/lib/airports";
import { AirportShortcuts } from "@/components/AirportShortcuts";
import { preferredAirport, saveAirportPreference } from "@/lib/airportPreferences";
import { Button } from "@/components/ui/button";
import { toLocalDate, validateFlight } from "@/lib/flightValidation";

interface FlightFormProps {
  onSubmit: (inputs: FlightInputs) => void;
  initialInputs?: Partial<FlightInputs>;
}

const airports = [...getAllAirports(), ...OTHER_AIRPORT_OPTIONS];
const steps = ["Your flight", "Your journey", "Ready to go"];

function Choice<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium mb-2">{label}</legend>
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={`flex-1 rounded-xl border px-2 py-3 text-sm transition-colors ${value === option.value ? "border-primary bg-primary/15 text-primary" : "border-border bg-secondary text-muted-foreground"}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function FlightForm({ onSubmit, initialInputs }: FlightFormProps) {
  const [step, setStep] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [step]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [inputs, setInputs] = useState<FlightInputs>(() => ({
    departureDateTime: new Date(Date.now() + 4 * 3600000),
    tripType: "domestic",
    hasPreCheck: false,
    hasClear: false,
    hasCheckedBag: false,
    airport: preferredAirport(),
    groupType: "solo",
    transportType: "rideshare",
    isHoliday: false,
    isBadWeather: false,
    riskPreference: "balanced",
    ...initialInputs,
  }));
  const [date, setDate] = useState(() => toLocalDate(inputs.departureDateTime));
  const [time, setTime] = useState(() =>
    inputs.departureDateTime.toTimeString().slice(0, 5),
  );
  const [drive, setDrive] = useState(() =>
    String(
      inputs.driveTime ??
        (inputs.airport
          ? getAirportProfile(inputs.airport).profile.typicalDriveTime
          : 25),
    ),
  );
  const update = <K extends keyof FlightInputs>(
    key: K,
    value: FlightInputs[K],
  ) => setInputs((previous) => ({ ...previous, [key]: value }));
  const [storageMessage, setStorageMessage] = useState("");
  const selectAirport = (code: string) => {
    update("airport", code);
    setQuery("");
    if (code) {
      setDrive(String(getAirportProfile(code).profile.typicalDriveTime));
      setStorageMessage(saveAirportPreference("lastAirport", code) ? "" : "This device could not remember your airport.");
    }
  };
  const selectedAirport = airports.find((a) => a.code === inputs.airport);
  const filtered = airports.filter((a) =>
    `${a.code} ${a.name}`.toLowerCase().includes(query.toLowerCase()),
  );
  const advance = () => {
    const next = {
      ...inputs,
      departureDateTime: new Date(`${date}T${time}`),
      driveTime: Number(drive),
    };
    const message = validateFlight(next);
    if (message) {
      setError(message);
      return;
    }
    setError("");
    setInputs(next);
    if (step < 2) setStep(step + 1);
    else onSubmit(next);
  };
  const toggle = (
    key:
      | "hasPreCheck"
      | "hasClear"
      | "hasCheckedBag"
      | "isHoliday"
      | "isBadWeather",
    label: string,
    note: string,
  ) => (
    <label className="flex items-center gap-3 rounded-xl border border-border p-4 bg-secondary/40 cursor-pointer focus-within:ring-2 focus-within:ring-primary">
      <input
        type="checkbox"
        checked={inputs[key]}
        onChange={(e) => update(key, e.target.checked)}
        className="h-5 w-5 accent-amber-300 shrink-0"
      />
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-muted-foreground mt-1">{note}</span>
      </span>
    </label>
  );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        advance();
      }}
      className="space-y-6"
    >
      <ol aria-label="Planning progress" className="flex gap-2">
        {steps.map((label, index) => (
          <li
            key={label}
            aria-current={step === index ? "step" : undefined}
            className="flex-1"
          >
            <div
              className={`h-1 rounded-full mb-2 ${index <= step ? "bg-primary" : "bg-secondary"}`}
            />
            <span
              className={`text-xs flex items-center gap-1 ${index <= step ? "text-primary" : "text-muted-foreground"}`}
            >
              {index < step ? <Check className="w-3 h-3" /> : `${index + 1}.`}{" "}
              {label}
            </span>
          </li>
        ))}
      </ol>
      <div key={step} className="space-y-5 animate-fade-in">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary mb-2">
            Step {step + 1} of 3
          </p>
          <h1 ref={heading} tabIndex={-1} className="text-2xl outline-none">
            {
              [
                "Where are you taking off?",
                "Make the plan yours.",
                "A little buffer. A better trip.",
              ][step]
            }
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {
              [
                "Choose your airport and confirm your departure.",
                "Every detail helps us build in the right time.",
                "Review your plan, then get your departure time.",
              ][step]
            }
          </p>
        </div>
        {step === 0 && (
          <>
            <div className="space-y-2">
              <label
                htmlFor="airport-search"
                className="text-sm flex gap-2 items-center"
              >
                <Search className="w-4 h-4" /> Find an airport
              </label>
              <input
                id="airport-search"
                className="input-field w-full"
                placeholder="Airport code or city"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <label htmlFor="airport" className="sr-only">
                Departure airport
              </label>
              <select
                id="airport"
                className="input-field w-full"
                value={inputs.airport}
                onChange={(e) => selectAirport(e.target.value)}
              >
                <option value="">Select airport</option>
                {selectedAirport && !filtered.includes(selectedAirport) && (
                  <option value={selectedAirport.code}>
                    {selectedAirport.code} · {selectedAirport.name}
                  </option>
                )}
                {filtered.map((a) => (
                  <option key={a.code} value={a.code}>
                    {a.code} · {a.name}
                  </option>
                ))}
              </select>
              {!filtered.length && (
                <p className="text-sm text-muted-foreground">
                  No match. Clear the search to choose a generic airport size.
                </p>
              )}
            </div>
            <AirportShortcuts airport={inputs.airport ?? ""} onSelect={selectAirport} />
            {storageMessage && <p role="status" className="text-sm text-muted-foreground">{storageMessage}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="departure-date" className="text-sm block mb-2">
                  Departure date
                </label>
                <input
                  id="departure-date"
                  type="date"
                  required
                  min={toLocalDate(new Date())}
                  className="input-field w-full min-w-0"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="departure-time" className="text-sm block mb-2">
                  Departure time
                </label>
                <input
                  id="departure-time"
                  type="time"
                  required
                  className="input-field w-full min-w-0"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              All times use your device timezone:{" "}
              <strong>
                {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </strong>
              . Convert your flight time if your airport is in another timezone.
            </p>
            <Choice
              label="Flight type"
              value={inputs.tripType}
              onChange={(v) => update("tripType", v)}
              options={[
                { value: "domestic", label: "Domestic" },
                { value: "international", label: "International" },
              ]}
            />
          </>
        )}
        {step === 1 && (
          <>
            <Choice
              label="Getting there"
              value={inputs.transportType}
              onChange={(v) => update("transportType", v)}
              options={[
                { value: "rideshare", label: "Rideshare" },
                { value: "car", label: "Car drop-off" },
              ]}
            />
            <div>
              <label htmlFor="drive-time" className="block text-sm mb-2">
                Drive time (minutes)
              </label>
              <input
                id="drive-time"
                type="number"
                min="1"
                max="360"
                required
                className="input-field w-full"
                value={drive}
                onChange={(e) => setDrive(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Starts with a city-center estimate. Check your route in Maps.
                Parking is not included.
              </p>
            </div>
            <Choice
              label="Travel party"
              value={inputs.groupType}
              onChange={(v) => update("groupType", v)}
              options={[
                { value: "solo", label: "Solo / couple" },
                { value: "family", label: "Family / group" },
              ]}
            />
            <div className="space-y-2">
              {toggle(
                "hasPreCheck",
                "TSA PreCheck",
                "Expedited security screening",
              )}
              {toggle("hasClear", "CLEAR", "Biometric identity verification")}
              {toggle(
                "hasCheckedBag",
                "Checking a bag",
                "Include time at the airline counter",
              )}
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div className="rounded-2xl bg-primary/10 border border-primary/30 p-4 flex gap-3">
              <Plane className="text-primary shrink-0 w-6 h-6" />
              <div>
                <p className="font-semibold">
                  {inputs.airport} · {inputs.tripType}
                </p>
                <p className="text-sm text-muted-foreground">
                  {inputs.departureDateTime.toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {drive} min drive ·{" "}
                  {inputs.transportType === "car"
                    ? "Car drop-off"
                    : "Rideshare"}{" "}
                  · {inputs.hasCheckedBag ? "Checked bag" : "Carry-on only"}
                </p>
              </div>
            </div>
            <Choice
              label="Your buffer"
              value={inputs.riskPreference}
              onChange={(v) => update("riskPreference", v)}
              options={[
                { value: "early", label: "Extra time" },
                { value: "balanced", label: "Balanced" },
                { value: "risky", label: "Less buffer" },
              ]}
            />
            <p className="text-xs text-muted-foreground">
              {inputs.riskPreference === "risky"
                ? "Less buffer leaves less room for delays. Extra time is the safer choice."
                : "Time to breathe before boarding. Your buffer is included in the plan."}
            </p>
            <div className="space-y-2">
              {toggle(
                "isHoliday",
                "Busy travel period",
                "Add time for crowds; known US holidays are detected automatically",
              )}
              {toggle(
                "isBadWeather",
                "Bad weather expected",
                "Adds rideshare pickup time; check road conditions separately",
              )}
            </div>
            <p className="flex gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              Planning estimates, not live traffic or airline deadlines. Check
              your airline’s check-in and boarding cutoffs.
            </p>
          </>
        )}
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-xl bg-destructive/10 p-3 text-sm text-red-300"
        >
          {error}
        </p>
      )}
      <div className="flex gap-3 sticky bottom-0 bg-card py-3 pb-safe">
        {step > 0 && (
          <Button
            type="button"
            variant="outline"
            aria-label="Previous step"
            onClick={() => {
              setStep(step - 1);
              setError("");
            }}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <Button type="submit" variant="gold" className="flex-1 min-h-12">
          {step === 2 ? "Build my departure plan" : "Continue"}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
