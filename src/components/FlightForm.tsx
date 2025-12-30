import { useState } from 'react';
import { FlightInputs } from '@/lib/timeline';
import { TOP_25_AIRPORTS } from '@/lib/airports';
import { Button } from '@/components/ui/button';
import { 
  Plane, 
  Shield, 
  Luggage, 
  Users, 
  Car, 
  CloudRain, 
  PartyPopper,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

interface FlightFormProps {
  onSubmit: (inputs: FlightInputs) => void;
}

export function FlightForm({ onSubmit }: FlightFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Form state
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [tripType, setTripType] = useState<'domestic' | 'international'>('domestic');
  const [hasPreCheck, setHasPreCheck] = useState(false);
  const [hasClear, setHasClear] = useState(false);
  const [hasCheckedBag, setHasCheckedBag] = useState(false);
  const [airport, setAirport] = useState('');
  const [groupType, setGroupType] = useState<'solo' | 'family'>('solo');
  const [transportType, setTransportType] = useState<'rideshare' | 'car'>('rideshare');
  const [isHoliday, setIsHoliday] = useState(false);
  const [isBadWeather, setIsBadWeather] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!departureDate || !departureTime) return;

    const departureDateTime = new Date(`${departureDate}T${departureTime}`);
    
    onSubmit({
      departureDateTime,
      tripType,
      hasPreCheck,
      hasClear,
      hasCheckedBag,
      airport: airport || undefined,
      groupType,
      transportType,
      isHoliday,
      isBadWeather,
    });
  };

  const isValid = departureDate && departureTime;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Flight Details Section */}
      <section className="space-y-4">
        <h2 className="deco-header text-sm text-primary tracking-widest flex items-center gap-2">
          <Plane className="w-4 h-4" />
          Flight Details
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
              required
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">
              Departure
            </label>
            <input
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="input-field w-full"
              required
            />
          </div>
        </div>

        {/* Trip type toggle */}
        <div>
          <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">
            Trip Type
          </label>
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
        </div>

        {/* Airport */}
        <div>
          <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">
            Airport (optional)
          </label>
          <input
            type="text"
            value={airport}
            onChange={(e) => setAirport(e.target.value)}
            placeholder="e.g., LAX or Los Angeles"
            className="input-field w-full"
            list="airports"
          />
          <datalist id="airports">
            {TOP_25_AIRPORTS.map((a) => (
              <option key={a.code} value={a.code}>
                {a.name}
              </option>
            ))}
          </datalist>
        </div>
      </section>

      <div className="deco-divider" />

      {/* Security Section */}
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
        Calculate Timeline
      </Button>
    </form>
  );
}
