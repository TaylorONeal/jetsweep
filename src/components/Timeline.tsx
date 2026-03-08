import { TimelineResult, formatTime, StressLevel } from '@/lib/timeline';
import { TimelineCard } from './TimelineCard';
import { StressMarginMeter } from './StressMarginMeter';
import { HeadsUpCallout } from './HeadsUpCallout';
import { TimelineJetIcon } from './TimelineJetIcon';
import { RouteMapDecoration } from './RouteMapDecoration';
import { JetTrailDivider } from './JetTrailDivider';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Plane,
  ArrowLeft,
  Info,
  MapPin,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TimelineProps {
  result: TimelineResult;
  flightTime: Date;
  onBack: () => void;
}

export function Timeline({ result, flightTime, onBack }: TimelineProps) {
  const {
    stages,
    leaveTime,
    leaveTimeRange,
    leaveTimeWindow,
    confidence,
    airportProfile,
    isAirportEstimate,
    isLeaveNow,
    stressMargin,
    stressLevel,
  } = result;

  const confidenceConfig = {
    'normal': {
      icon: CheckCircle2,
      label: 'Normal',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      border: 'border-emerald-400/30',
      glow: 'shadow-[0_0_15px_hsl(142_70%_45%_/_0.2)]',
    },
    'risky': {
      icon: AlertCircle,
      label: 'Risky',
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      border: 'border-amber-400/30',
      glow: 'shadow-[0_0_15px_hsl(45_90%_50%_/_0.2)]',
    },
    'high-variance': {
      icon: AlertTriangle,
      label: 'High Variance',
      color: 'text-red-400',
      bg: 'bg-red-400/10',
      border: 'border-red-400/30',
      glow: 'shadow-[0_0_15px_hsl(0_70%_55%_/_0.2)]',
    },
  };

  const stressConfig: Record<StressLevel, { label: string; color: string; bg: string; border: string; glow: string }> = {
    'CALM': {
      label: 'Calm',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      border: 'border-emerald-400/30',
      glow: 'shadow-[0_0_15px_hsl(142_70%_45%_/_0.2)]',
    },
    'TIGHT': {
      label: 'Tight',
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      border: 'border-amber-400/30',
      glow: 'shadow-[0_0_15px_hsl(45_90%_50%_/_0.2)]',
    },
    'RISKY': {
      label: 'Risky',
      color: 'text-red-400',
      bg: 'bg-red-400/10',
      border: 'border-red-400/30',
      glow: 'shadow-[0_0_15px_hsl(0_70%_55%_/_0.2)]',
    },
  };

  const conf = confidenceConfig[confidence];
  const stress = stressConfig[stressLevel];
  const ConfIcon = conf.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform duration-300" />
            <span className="text-sm relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-primary after:transition-all after:duration-300 group-hover:after:w-full">Edit Details</span>
          </button>

          {/* Leave time hero */}
          <div className="text-center">
            {isLeaveNow ? (
              <div className="animate-pulse-soft">
                <p className="text-amber-400 text-sm font-medium uppercase tracking-wider mb-1">
                  Leave Now
                </p>
                <h1 className="font-display text-4xl font-bold text-primary animate-glow-pulse">
                  Time to Go!
                </h1>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground text-sm uppercase tracking-wider mb-1 flex items-center justify-center gap-2">
                  <MapPin className="w-3 h-3" />
                  Leave by
                </p>
                <h1
                  className="font-display text-5xl font-bold text-primary tracking-tight animate-scale-in"
                  style={{
                    textShadow: '0 0 40px hsl(40 45% 60% / 0.3)',
                  }}
                >
                  {formatTime(leaveTime)}
                </h1>
                <p className="text-muted-foreground text-xs mt-2 animate-fade-in">
                  Window: {formatTime(leaveTimeWindow.earliest)} – {formatTime(leaveTimeWindow.latest)}
                </p>
              </>
            )}

            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm px-3 py-1.5 rounded-full bg-secondary/50 hover:bg-secondary transition-colors duration-300">
                <Plane className="w-4 h-4 text-primary" />
                <span>Departs {formatTime(flightTime)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm px-3 py-1.5 rounded-full bg-secondary/50 hover:bg-secondary transition-colors duration-300">
                <Clock className="w-4 h-4 text-accent" />
                <span>{leaveTimeRange.min}–{leaveTimeRange.max} min total</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-6">
        {/* Route map decoration between header and content */}
        <div className="mb-6 animate-fade-in">
          <RouteMapDecoration variant="section" className="w-full h-10 opacity-50" />
        </div>

        {/* Summary Card */}
        <div className="card-elevated rounded-lg p-4 mb-6 deco-border animate-slide-up relative overflow-hidden group">
          {/* Subtle route background on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <RouteMapDecoration variant="card" className="w-full h-full" />
          </div>
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {/* Confidence badge */}
              <div className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 hover:scale-105",
                conf.bg, conf.border, conf.glow
              )}>
                <ConfIcon className={cn("w-4 h-4", conf.color)} />
                <span className={cn("text-sm font-medium", conf.color)}>{conf.label}</span>
              </div>

              {/* Stress level badge */}
              <div className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 hover:scale-105",
                stress.bg, stress.border, stress.glow
              )}>
                <span className={cn("text-sm font-medium", stress.color)}>{stress.label}</span>
                <span className="text-xs text-muted-foreground">({stressMargin} min buffer)</span>
              </div>

              {/* Airport badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border hover:border-primary/30 transition-all duration-300 hover:scale-105">
                <span className="text-sm font-mono text-primary">{airportProfile.code}</span>
                {isAirportEstimate && (
                  <>
                    <span className="text-border">•</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      Estimated
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Stress meter */}
            <StressMarginMeter margin={stressMargin} level={stressLevel} />
          </div>
        </div>

        {/* Heads up callout for pain point */}
        {airportProfile.painPoint && (
          <div className="animate-slide-up stagger-1" style={{ animationFillMode: 'forwards', opacity: 0 }}>
            <HeadsUpCallout message={airportProfile.painPoint} />
          </div>
        )}

        {/* Flight path header */}
        <div className="flex items-center gap-3 mb-4 animate-slide-up stagger-2" style={{ animationFillMode: 'forwards', opacity: 0 }}>
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Target className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="deco-header text-sm text-primary tracking-widest">Flight Path</h2>
            <p className="text-xs text-muted-foreground">Your journey to the gate</p>
          </div>
        </div>

        {/* Timeline with animated jet */}
        <div className="relative flight-path">
          <TimelineJetIcon stageCount={stages.length} />

          <div className="space-y-0">
            {stages.map((stage, index) => (
              <TimelineCard
                key={stage.id}
                stage={stage}
                index={index}
                isFirst={index === 0}
                isLast={index === stages.length - 1}
                painPoint={stage.id === 'security' && airportProfile.painPoint?.toLowerCase().includes('security')
                  ? airportProfile.painPoint
                  : stage.id === 'arrival' && airportProfile.painPoint?.toLowerCase().includes('curb')
                    ? airportProfile.painPoint
                    : undefined}
              />
            ))}
          </div>
        </div>

        {/* Jet trail divider before summary */}
        <JetTrailDivider className="my-4 opacity-50" />

        {/* Bottom summary card */}
        <div className="card-elevated rounded-lg p-6 mt-2 deco-border animate-slide-up relative overflow-hidden group" style={{ animationDelay: '0.5s', animationFillMode: 'forwards', opacity: 0 }}>
          {/* Route map bg */}
          <div className="absolute inset-0 opacity-30">
            <RouteMapDecoration variant="card" className="w-full h-full" />
          </div>

          <div className="relative z-10 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 group-hover:shadow-[0_0_25px_hsl(var(--gold)_/_0.2)] transition-all duration-500">
              <Plane className="w-6 h-6 text-primary group-hover:rotate-[-15deg] transition-transform duration-500" />
            </div>
            <p className="text-muted-foreground text-sm mb-2">Recommended Leave Time</p>
            <p
              className="font-display text-3xl font-bold text-primary"
              style={{
                textShadow: '0 0 30px hsl(40 45% 60% / 0.3)',
              }}
            >
              {formatTime(leaveTime)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {formatTime(leaveTimeWindow.earliest)} (earliest) – {formatTime(leaveTimeWindow.latest)} (latest)
            </p>

            {/* Mini timeline visualization with animated fill */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Leave</span>
                <div className="flex-1 mx-4 h-1 bg-secondary rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-[shimmer_2s_linear_infinite]"
                    style={{
                      width: '100%',
                      backgroundSize: '200% 100%',
                      backgroundImage: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))',
                    }}
                  />
                  {/* Traveling dot on mini timeline */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_hsl(var(--cyan)_/_0.5)]"
                    style={{
                      animation: 'shimmer 3s linear infinite',
                      left: '50%',
                    }}
                  />
                </div>
                <span>Board</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-primary font-mono">{formatTime(leaveTime)}</span>
                <span className="text-muted-foreground">{leaveTimeRange.min}–{leaveTimeRange.max} min</span>
                <span className="text-accent font-mono">{formatTime(flightTime)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom action */}
        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Button
            onClick={onBack}
            variant="outline"
            className="border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-300 group hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Recalculate
          </Button>
        </div>
      </main>
    </div>
  );
}
