import { useState, useEffect } from 'react';
import { FlightInputs } from '@/lib/timeline';
import { TOP_25_AIRPORTS, OTHER_AIRPORT_OPTIONS, getAirportProfile } from '@/lib/airports';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Luggage, 
  Users, 
  Car, 
  CloudRain, 
  PartyPopper,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Navigation
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';

interface FlightFormProps {
  onSubmit: (inputs: FlightInputs) => void;
}

// Helper to get default date/time (4 hours from now)
function getDefaultDateTime() {
  const defaultDate = new Date(Date.now() + 4 * 60 * 60 * 1000);
  const dateStr = defaultDate.toISOString().split('T')[0];
  const timeStr = defaultDate.toTimeString().slice(0, 5);
  return { dateStr, timeStr };
}

export function FlightForm({ onSubmit }: FlightFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Initialize with defaults (4 hours from now)
  const defaults = getDefaultDateTime();
  
  // Form state
  const [departureDate, setDepartureDate] = useState(defaults.dateStr);
  const [departureTime, setDepartureTime] = useState(defaults.timeStr);
  const [tripType, setTripType] = useState<'domestic' | 'international'>('domestic');
  const [hasPreCheck, setHasPreCheck] = useState(false);
  const [hasClear, setHasClear] = useState(false);
  const [hasCheckedBag, setHasCheckedBag] = useState(false);
  const [airport, setAirport] = useState('');
  const [groupType, setGroupType] = useState<'solo' | 'family'>('solo');
  const [transportType, setTransportType] = useState<'rideshare' | 'car'>('rideshare');
  const [riskPreference, setRiskPreference] = useState<'early' | 'balanced' | 'risky'>('balanced');
  const [isHoliday, setIsHoliday] = useState(false);
  const [isBadWeather, setIsBadWeather] = useState(false);
  const [driveTime, setDriveTime] = useState<string>('');
  const [defaultDriveTime, setDefaultDriveTime] = useState<number>(25);

  // Update default drive time when airport changes
  useEffect(() => {
    if (airport) {
      const { profile } = getAirportProfile(airport);
      setDefaultDriveTime(profile.typicalDriveTime);
      // Always update drive time when airport changes
      setDriveTime(profile.typicalDriveTime.toString());
    }
  }, [airport]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!airport) return;

    // Build departure date/time from inputs
    const today = new Date().toISOString().split('T')[0];
    const finalDate = departureDate || today;
    const finalTime = departureTime || '12:00';
    const departureDateTime = new Date(`${finalDate}T${finalTime}`);
    
    onSubmit({
      departureDateTime,
      tripType,
      hasPreCheck,
      hasClear,
      hasCheckedBag,
      airport: airport || undefined,
      groupType,
      transportType,
      riskPreference,
      isHoliday,
      isBadWeather,
      driveTime: driveTime ? parseInt(driveTime, 10) : undefined,
    });
  };

  const isValid = airport;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Airport Selection - Primary */}
      <section className="space-y-4">
        <h2 className="deco-header text-sm text-primary tracking-widest flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Airport
        </h2>
        
        <Select value={airport} onValueChange={setAirport}>
          <SelectTrigger className="w-full input-field h-auto py-3">
            <SelectValue placeholder="Select your airport" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border max-h-[300px]">
            <SelectGroup>
              <SelectLabel className="text-muted-foreground text-xs uppercase tracking-wider">
                Top 25 US Airports
              </SelectLabel>
              {TOP_25_AIRPORTS.map((a) => (
                <SelectItem 
                  key={a.code} 
                  value={a.code}
                  className="cursor-pointer"
                >
                  <span className="font-mono text-primary mr-2">{a.code}</span>
                  <span className="text-foreground">{a.name}</span>
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel className="text-muted-foreground text-xs uppercase tracking-wider mt-2">
                Other Airports
              </SelectLabel>
              {OTHER_AIRPORT_OPTIONS.map((a) => (
                <SelectItem 
                  key={a.code} 
                  value={a.code}
                  className="cursor-pointer"
                >
                  <span className="text-foreground">{a.name}</span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </section>

      {/* Drive Time */}
      <section className="space-y-3">
        <h2 className="deco-header text-sm text-primary tracking-widest flex items-center gap-2">
          <Navigation className="w-4 h-4" />
          Drive Time to Airport
        </h2>
        
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="relative">
              <input
                type="number"
                min="1"
                max="180"
                value={driveTime}
                onChange={(e) => setDriveTime(e.target.value)}
                placeholder={defaultDriveTime.toString()}
                className="input-field w-full pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                min
              </span>
            </div>
          </div>
          {driveTime && parseInt(driveTime) !== defaultDriveTime && (
            <button
              type="button"
              onClick={() => setDriveTime(defaultDriveTime.toString())}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Reset to {defaultDriveTime}
            </button>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground">
          💡 Check <span className="text-foreground">Google Maps</span> or <span className="text-foreground">Apple Maps</span> for your actual drive time from home.
        </p>
      </section>

      <div className="deco-divider" />

      {/* Trip Type */}
      <section className="space-y-4">
        <h2 className="deco-header text-sm text-primary tracking-widest">
          Trip Type
        </h2>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setTripType('domestic')}
            className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all
              ${tripType === 'domestic' 
                ? 'bg-primary/20 border-primary text-primary' 
                : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
              }`}
          >
            Domestic
          </button>
          <button
            type="button"
            onClick={() => setTripType('international')}
            className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all
              ${tripType === 'international' 
                ? 'bg-primary/20 border-primary text-primary' 
                : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
              }`}
          >
            International
          </button>
        </div>
      </section>

      <div className="deco-divider" />

      {/* Risk Preference */}
      <section className="space-y-4">
        <h2 className="deco-header text-sm text-primary tracking-widest">
          How do you travel?
        </h2>
        
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setRiskPreference('early')}
            className={`py-3 px-2 rounded-lg border text-xs font-medium transition-all text-center
              ${riskPreference === 'early' 
                ? 'bg-primary/20 border-primary text-primary' 
                : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
              }`}
          >
            <span className="block text-lg mb-1">🦅</span>
            Early Bird
          </button>
          <button
            type="button"
            onClick={() => setRiskPreference('balanced')}
            className={`py-3 px-2 rounded-lg border text-xs font-medium transition-all text-center
              ${riskPreference === 'balanced' 
                ? 'bg-primary/20 border-primary text-primary' 
                : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
              }`}
          >
            <span className="block text-lg mb-1">⚖️</span>
            Balanced
          </button>
          <button
            type="button"
            onClick={() => setRiskPreference('risky')}
            className={`py-3 px-2 rounded-lg border text-xs font-medium transition-all text-center
              ${riskPreference === 'risky' 
                ? 'bg-primary/20 border-primary text-primary' 
                : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
              }`}
          >
            <span className="block text-lg mb-1">🎲</span>
            Seat of Pants
          </button>
        </div>
      </section>

      <div className="deco-divider" />
      <section className="space-y-4">
        <h2 className="deco-header text-sm text-primary tracking-widest flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Security & Bags
        </h2>

        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border cursor-pointer hover:bg-secondary transition-colors">
            <input
              type="checkbox"
              checked={hasPreCheck}
              onChange={(e) => setHasPreCheck(e.target.checked)}
              className="checkbox-deco"
            />
            <div>
              <span className="text-foreground font-medium">TSA PreCheck</span>
              <p className="text-xs text-muted-foreground">Expedited security screening</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border cursor-pointer hover:bg-secondary transition-colors">
            <input
              type="checkbox"
              checked={hasClear}
              onChange={(e) => setHasClear(e.target.checked)}
              className="checkbox-deco"
            />
            <div>
              <span className="text-foreground font-medium">CLEAR</span>
              <p className="text-xs text-muted-foreground">Biometric identity verification</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border cursor-pointer hover:bg-secondary transition-colors">
            <input
              type="checkbox"
              checked={hasCheckedBag}
              onChange={(e) => setHasCheckedBag(e.target.checked)}
              className="checkbox-deco"
            />
            <div className="flex items-center gap-2">
              <Luggage className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">Checked Bag</span>
            </div>
          </label>
        </div>
      </section>

      <div className="deco-divider" />

      {/* Flight Departure Time - Primary */}
      <section className="space-y-4">
        <h2 className="deco-header text-sm text-primary tracking-widest flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Flight Departure
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">
              Date
            </label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Time
            </label>
            <input
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="input-field w-full"
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Pre-filled for 4 hours from now. Adjust as needed.
        </p>
      </section>

      <div className="deco-divider" />

      {/* Advanced options toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full flex items-center justify-between py-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="text-sm font-medium">Advanced Options</span>
        {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {showAdvanced && (
        <div className="space-y-6 animate-fade-in">
          {/* Group & Transport */}
          <section className="space-y-4">
            <h2 className="deco-header text-sm text-primary tracking-widest flex items-center gap-2">
              <Users className="w-4 h-4" />
              Travel Party
            </h2>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGroupType('solo')}
                className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all
                  ${groupType === 'solo' 
                    ? 'bg-primary/20 border-primary text-primary' 
                    : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
                  }`}
              >
                Solo / Couple
              </button>
              <button
                type="button"
                onClick={() => setGroupType('family')}
                className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all
                  ${groupType === 'family' 
                    ? 'bg-primary/20 border-primary text-primary' 
                    : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
                  }`}
              >
                Family / Group
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="deco-header text-sm text-primary tracking-widest flex items-center gap-2">
              <Car className="w-4 h-4" />
              Transportation
            </h2>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTransportType('rideshare')}
                className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all
                  ${transportType === 'rideshare' 
                    ? 'bg-primary/20 border-primary text-primary' 
                    : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
                  }`}
              >
                Rideshare
              </button>
              <button
                type="button"
                onClick={() => setTransportType('car')}
                className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all
                  ${transportType === 'car' 
                    ? 'bg-primary/20 border-primary text-primary' 
                    : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
                  }`}
              >
                Personal Car
              </button>
            </div>
          </section>

          {/* Risk Modifiers */}
          <section className="space-y-4">
            <h2 className="deco-header text-sm text-primary tracking-widest">
              Risk Modifiers
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border cursor-pointer hover:bg-secondary transition-colors">
                <input
                  type="checkbox"
                  checked={isHoliday}
                  onChange={(e) => setIsHoliday(e.target.checked)}
                  className="checkbox-deco"
                />
                <div className="flex items-center gap-2">
                  <PartyPopper className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground font-medium">Holiday Travel</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border cursor-pointer hover:bg-secondary transition-colors">
                <input
                  type="checkbox"
                  checked={isBadWeather}
                  onChange={(e) => setIsBadWeather(e.target.checked)}
                  className="checkbox-deco"
                />
                <div className="flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground font-medium">Bad Weather Expected</span>
                </div>
              </label>
            </div>
          </section>
        </div>
      )}

      {/* Submit */}
      <Button 
        type="submit" 
        variant="gold"
        size="xl"
        disabled={!isValid}
        className="w-full mt-6"
      >
        <Sparkles className="w-5 h-5" />
        Show me when to leave
      </Button>
    </form>
  );
}
