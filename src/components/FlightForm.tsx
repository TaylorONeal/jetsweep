import { useState, useEffect, useMemo } from 'react';
import { FlightInputs } from '@/lib/timeline';
import { getAllAirports, OTHER_AIRPORT_OPTIONS, getAirportProfile, AirportProfile } from '@/lib/airports';
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
  Navigation,
  Check,
  ChevronsUpDown,
  Plane,
  AlertCircle
} from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

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

// Form section component with animation
function FormSection({
  children,
  icon: Icon,
  title,
  isComplete,
  isActive,
  delay = 0
}: {
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  title?: string;
  isComplete?: boolean;
  isActive?: boolean;
  delay?: number;
}) {
  return (
    <section
      className={cn(
        "space-y-4 relative transition-all duration-300",
        isActive && "scale-[1.01]"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="deco-header text-sm text-primary tracking-widest flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4" />}
            {title}
          </h2>
          {isComplete && (
            <div className="flex items-center gap-1 text-emerald-400 text-xs animate-fade-in">
              <Check className="w-3 h-3" />
              <span>Done</span>
            </div>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

// Animated toggle button
function ToggleButton({
  selected,
  onClick,
  children,
  icon,
  className = ""
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "py-3 px-4 rounded-lg border text-sm font-medium transition-all duration-200",
        "hover:scale-[1.02] active:scale-[0.98]",
        selected
          ? 'bg-primary/20 border-primary text-primary shadow-[0_0_20px_hsl(40_45%_60%_/_0.15)]'
          : 'bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-border/80',
        className
      )}
    >
      {icon && <span className="block text-lg mb-1">{icon}</span>}
      {children}
    </button>
  );
}

// Animated checkbox option
function CheckOption({
  checked,
  onChange,
  icon: Icon,
  title,
  description
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
}) {
  return (
    <label
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200",
        "hover:scale-[1.01] active:scale-[0.99]",
        checked
          ? "bg-primary/10 border-primary/50 shadow-[0_0_15px_hsl(40_45%_60%_/_0.1)]"
          : "bg-secondary/50 border-border hover:bg-secondary"
      )}
    >
      <div className={cn(
        "w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200",
        checked
          ? "bg-primary border-primary"
          : "border-muted-foreground/50"
      )}>
        {checked && <Check className="w-3 h-3 text-primary-foreground" />}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
          <span className="text-foreground font-medium">{title}</span>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
    </label>
  );
}

export function FlightForm({ onSubmit }: FlightFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [airportOpen, setAirportOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize with defaults (4 hours from now)
  const defaults = getDefaultDateTime();

  // Get sorted airports (memoized)
  const allAirports = useMemo(() => getAllAirports(), []);

  // Form state
  const [departureDate, setDepartureDate] = useState(defaults.dateStr);
  const [departureTime, setDepartureTime] = useState(defaults.timeStr);
  const [tripType, setTripType] = useState<'domestic' | 'international'>('domestic');
  const [hasPreCheck, setHasPreCheck] = useState(false);
  const [hasClear, setHasClear] = useState(false);
  const [hasCheckedBag, setHasCheckedBag] = useState(false);
  const [airport, setAirport] = useState('');
  const [groupType, setGroupType] = useState<'solo' | 'family'>('solo');
  const [useRideshare, setUseRideshare] = useState(true);
  const [riskPreference, setRiskPreference] = useState<'early' | 'balanced' | 'risky'>('balanced');
  const [isHoliday, setIsHoliday] = useState(false);
  const [isBadWeather, setIsBadWeather] = useState(false);
  const [driveTime, setDriveTime] = useState<string>('');
  const [defaultDriveTime, setDefaultDriveTime] = useState<number>(25);

  // Get selected airport display
  const selectedAirport = useMemo(() => {
    if (!airport) return null;
    const found = allAirports.find(a => a.code === airport);
    if (found) return found;
    const other = OTHER_AIRPORT_OPTIONS.find(a => a.code === airport);
    if (other) return { code: other.code, name: other.name } as AirportProfile;
    return null;
  }, [airport, allAirports]);

  // Update default drive time when airport changes
  useEffect(() => {
    if (airport) {
      const { profile } = getAirportProfile(airport);
      setDefaultDriveTime(profile.typicalDriveTime);
      // Always update drive time when airport changes
      setDriveTime(profile.typicalDriveTime.toString());
    }
  }, [airport]);

  // Calculate form completion progress
  const formProgress = useMemo(() => {
    let completed = 0;
    if (airport) completed += 40;
    if (departureDate && departureTime) completed += 30;
    if (tripType) completed += 15;
    if (riskPreference) completed += 15;
    return completed;
  }, [airport, departureDate, departureTime, tripType, riskPreference]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!airport) return;

    setIsSubmitting(true);

    // Build departure date/time from inputs
    const today = new Date().toISOString().split('T')[0];
    const finalDate = departureDate || today;
    const finalTime = departureTime || '12:00';
    const departureDateTime = new Date(`${finalDate}T${finalTime}`);

    // Small delay for button animation
    setTimeout(() => {
      onSubmit({
        departureDateTime,
        tripType,
        hasPreCheck,
        hasClear,
        hasCheckedBag,
        airport: airport || undefined,
        groupType,
        transportType: useRideshare ? 'rideshare' : 'car',
        riskPreference,
        isHoliday,
        isBadWeather,
        driveTime: driveTime ? parseInt(driveTime, 10) : undefined,
      });
    }, 200);
  };

  const isValid = airport;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress indicator */}
      <div className="relative">
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary via-primary to-accent transition-all duration-500 ease-out"
            style={{ width: `${formProgress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Start</span>
          <span className={cn(
            "transition-colors",
            formProgress === 100 && "text-primary font-medium"
          )}>
            {formProgress === 100 ? 'Ready!' : `${formProgress}%`}
          </span>
        </div>
      </div>

      {/* Airport Selection - Primary */}
      <FormSection
        icon={MapPin}
        title="Airport"
        isComplete={!!airport}
        delay={0}
      >
        <Popover open={airportOpen} onOpenChange={setAirportOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={airportOpen}
              className={cn(
                "w-full input-field h-auto py-4 justify-between font-normal transition-all duration-200",
                "hover:scale-[1.01] active:scale-[0.99]",
                airport && "border-primary/50 shadow-[0_0_20px_hsl(40_45%_60%_/_0.1)]"
              )}
            >
              {selectedAirport ? (
                <span className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Plane className="w-4 h-4 text-primary" />
                  </span>
                  <span className="flex flex-col items-start">
                    <span className="font-mono text-primary text-lg">{selectedAirport.code}</span>
                    <span className="text-muted-foreground text-xs truncate">{selectedAirport.name}</span>
                  </span>
                </span>
              ) : (
                <span className="flex items-center gap-3 text-muted-foreground">
                  <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <span>Search or select airport...</span>
                </span>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-card border-border" align="start">
            <Command className="bg-transparent">
              <CommandInput placeholder="Type airport code or name..." className="border-none focus:ring-0" />
              <CommandList className="max-h-[300px]">
                <CommandEmpty>No airport found.</CommandEmpty>
                <CommandGroup heading="Top 100 US Airports">
                  {allAirports.map((a) => (
                    <CommandItem
                      key={a.code}
                      value={`${a.code} ${a.name}`}
                      onSelect={() => {
                        setAirport(a.code);
                        setAirportOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          airport === a.code ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="font-mono text-primary mr-2">{a.code}</span>
                      <span className="text-foreground truncate">{a.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandGroup heading="Other Airports">
                  {OTHER_AIRPORT_OPTIONS.map((a) => (
                    <CommandItem
                      key={a.code}
                      value={a.name}
                      onSelect={() => {
                        setAirport(a.code);
                        setAirportOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          airport === a.code ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="text-foreground">{a.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </FormSection>

      {/* Drive Time */}
      <FormSection
        icon={Navigation}
        title="Drive Time to Airport"
        isComplete={!!driveTime}
        delay={50}
      >
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="number"
              min="1"
              max="180"
              value={driveTime}
              onChange={(e) => setDriveTime(e.target.value)}
              placeholder={defaultDriveTime.toString()}
              className="input-field w-full pr-12 transition-all duration-200 hover:border-border/80 focus:scale-[1.01]"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              min
            </span>
          </div>
          {driveTime && parseInt(driveTime) !== defaultDriveTime && (
            <button
              type="button"
              onClick={() => setDriveTime(defaultDriveTime.toString())}
              className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
            >
              Reset to {defaultDriveTime}
            </button>
          )}
        </div>

        <p className="text-xs text-muted-foreground flex items-start gap-2">
          <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <span>Check <span className="text-foreground">Google Maps</span> or <span className="text-foreground">Apple Maps</span> for your actual drive time from home.</span>
        </p>
      </FormSection>

      <div className="deco-divider" />

      {/* Trip Type */}
      <FormSection title="Trip Type" isComplete={true} delay={100}>
        <div className="grid grid-cols-2 gap-3">
          <ToggleButton
            selected={tripType === 'domestic'}
            onClick={() => setTripType('domestic')}
          >
            Domestic
          </ToggleButton>
          <ToggleButton
            selected={tripType === 'international'}
            onClick={() => setTripType('international')}
          >
            International
          </ToggleButton>
        </div>
      </FormSection>

      <div className="deco-divider" />

      {/* Risk Preference */}
      <FormSection title="How do you travel?" isComplete={true} delay={150}>
        <div className="grid grid-cols-3 gap-2">
          <ToggleButton
            selected={riskPreference === 'early'}
            onClick={() => setRiskPreference('early')}
            icon="🦅"
            className="text-center text-xs"
          >
            Early Bird
          </ToggleButton>
          <ToggleButton
            selected={riskPreference === 'balanced'}
            onClick={() => setRiskPreference('balanced')}
            icon="⚖️"
            className="text-center text-xs"
          >
            Balanced
          </ToggleButton>
          <ToggleButton
            selected={riskPreference === 'risky'}
            onClick={() => setRiskPreference('risky')}
            icon="🎲"
            className="text-center text-xs"
          >
            Seat of Pants
          </ToggleButton>
        </div>
      </FormSection>

      <div className="deco-divider" />

      {/* Security & Bags */}
      <FormSection icon={Shield} title="Security & Bags" delay={200}>
        <div className="space-y-2">
          <CheckOption
            checked={hasPreCheck}
            onChange={setHasPreCheck}
            title="TSA PreCheck"
            description="Expedited security screening"
          />
          <CheckOption
            checked={hasClear}
            onChange={setHasClear}
            title="CLEAR"
            description="Biometric identity verification"
          />
          <CheckOption
            checked={hasCheckedBag}
            onChange={setHasCheckedBag}
            icon={Luggage}
            title="Checked Bag"
          />
        </div>
      </FormSection>

      <div className="deco-divider" />

      {/* Flight Departure Time - Primary */}
      <FormSection
        icon={Clock}
        title="Flight Departure"
        isComplete={!!(departureDate && departureTime)}
        delay={250}
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">
              Date
            </label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="input-field w-full transition-all duration-200 hover:border-border/80"
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
              className="input-field w-full transition-all duration-200 hover:border-border/80"
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Pre-filled for 4 hours from now. Adjust as needed.
        </p>
      </FormSection>

      <div className="deco-divider" />

      {/* Advanced options toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full flex items-center justify-between py-2 text-muted-foreground hover:text-foreground transition-all duration-200 group"
      >
        <span className="text-sm font-medium">Advanced Options</span>
        <div className={cn(
          "transition-transform duration-300",
          showAdvanced && "rotate-180"
        )}>
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {showAdvanced && (
        <div className="space-y-6 animate-fade-in">
          {/* Group & Transport */}
          <FormSection icon={Users} title="Travel Party" delay={0}>
            <div className="grid grid-cols-2 gap-3">
              <ToggleButton
                selected={groupType === 'solo'}
                onClick={() => setGroupType('solo')}
              >
                Solo / Couple
              </ToggleButton>
              <ToggleButton
                selected={groupType === 'family'}
                onClick={() => setGroupType('family')}
              >
                Family / Group
              </ToggleButton>
            </div>
          </FormSection>

          <FormSection icon={Car} title="Transportation" delay={50}>
            <CheckOption
              checked={useRideshare}
              onChange={setUseRideshare}
              title="Using Rideshare"
              description="Uber, Lyft, etc. (includes wait time)"
            />
          </FormSection>

          {/* Risk Modifiers */}
          <FormSection title="Risk Modifiers" delay={100}>
            <div className="space-y-2">
              <CheckOption
                checked={isHoliday}
                onChange={setIsHoliday}
                icon={PartyPopper}
                title="Holiday Travel"
              />
              <CheckOption
                checked={isBadWeather}
                onChange={setIsBadWeather}
                icon={CloudRain}
                title="Bad Weather Expected"
              />
            </div>
          </FormSection>
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        variant="gold"
        size="xl"
        disabled={!isValid || isSubmitting}
        className={cn(
          "w-full mt-6 transition-all duration-300",
          "hover:scale-[1.02] active:scale-[0.98]",
          isSubmitting && "animate-pulse"
        )}
      >
        {isSubmitting ? (
          <>
            <Plane className="w-5 h-5 animate-bounce" />
            Preparing for takeoff...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Show me when to leave
          </>
        )}
      </Button>
    </form>
  );
}
