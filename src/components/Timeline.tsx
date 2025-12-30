import { TimelineResult, formatTime, StressLevel } from '@/lib/timeline';
import { TimelineCard } from './TimelineCard';
import { StressMarginMeter } from './StressMarginMeter';
import { HeadsUpCallout } from './HeadsUpCallout';
import { TimelineJetIcon } from './TimelineJetIcon';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle,
  Plane,
  ArrowLeft,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    },
    'risky': {
      icon: AlertCircle,
      label: 'Risky',
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      border: 'border-amber-400/30',
    },
    'high-variance': {
      icon: AlertTriangle,
      label: 'High Variance',
      color: 'text-red-400',
      bg: 'bg-red-400/10',
      border: 'border-red-400/30',
    },
  };

  const stressConfig: Record<StressLevel, { label: string; color: string; bg: string; border: string }> = {
    'CALM': {
      label: 'Calm',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      border: 'border-emerald-400/30',
    },
    'TIGHT': {
      label: 'Tight',
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      border: 'border-amber-400/30',
    },
    'RISKY': {
      label: 'Risky',
      color: 'text-red-400',
      bg: 'bg-red-400/10',
      border: 'border-red-400/30',
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
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Edit Details</span>
          </button>

          {/* Leave time hero */}
          <div className="text-center">
            {isLeaveNow ? (
              <div className="animate-pulse-soft">
                <p className="text-amber-400 text-sm font-medium uppercase tracking-wider mb-1">
                  Leave Now
                </p>
                <h1 className="font-display text-4xl font-bold text-primary">
                  Time to Go!
                </h1>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground text-sm uppercase tracking-wider mb-1">
                  Leave by
                </p>
                <h1 className="font-display text-5xl font-bold text-primary tracking-tight">
                  {formatTime(leaveTime)}
                </h1>
                <p className="text-muted-foreground text-xs mt-1">
                  Window: {formatTime(leaveTimeWindow.earliest)} – {formatTime(leaveTimeWindow.latest)}
                </p>
              </>
            )}
            
            <div className="flex items-center justify-center gap-3 mt-3">
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <Plane className="w-4 h-4" />
                <span>Departs {formatTime(flightTime)}</span>
              </div>
              <span className="text-border">•</span>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <Clock className="w-4 h-4" />
                <span>{leaveTimeRange.min}–{leaveTimeRange.max} min total</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-6">
        {/* Summary Card */}
        <div className="card-elevated rounded-lg p-4 mb-6 deco-border">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {/* Confidence badge */}
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${conf.bg} ${conf.border}`}>
                <ConfIcon className={`w-4 h-4 ${conf.color}`} />
                <span className={`text-sm font-medium ${conf.color}`}>{conf.label}</span>
              </div>

              {/* Stress level badge */}
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${stress.bg} ${stress.border}`}>
                <span className={`text-sm font-medium ${stress.color}`}>{stress.label}</span>
                <span className="text-xs text-muted-foreground">({stressMargin} min buffer)</span>
              </div>

              {/* Airport badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border">
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
          <HeadsUpCallout message={airportProfile.painPoint} />
        )}

        {/* Timeline with animated jet */}
        <div className="relative">
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

        {/* Bottom summary card */}
        <div className="card-elevated rounded-lg p-4 mt-6 deco-border">
          <div className="text-center">
            <p className="text-muted-foreground text-sm mb-1">Recommended Leave Time</p>
            <p className="font-display text-2xl font-bold text-primary">{formatTime(leaveTime)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatTime(leaveTimeWindow.earliest)} (earliest) – {formatTime(leaveTimeWindow.latest)} (latest)
            </p>
          </div>
        </div>

        {/* Bottom action */}
        <div className="mt-8 text-center">
          <Button 
            onClick={onBack}
            variant="outline"
            className="border-border text-muted-foreground hover:text-foreground"
          >
            Recalculate
          </Button>
        </div>
      </main>
    </div>
  );
}
