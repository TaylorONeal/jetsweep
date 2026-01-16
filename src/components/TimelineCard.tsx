import { TimelineStage, formatTime } from '@/lib/timeline';
import { HeadsUpCallout } from './HeadsUpCallout';
import {
  Plane,
  DoorOpen,
  ShieldCheck,
  Luggage,
  MapPin,
  Car,
  Smartphone,
  Home,
  Clock,
  Navigation,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  plane: Plane,
  'door-open': DoorOpen,
  'shield-check': ShieldCheck,
  luggage: Luggage,
  'map-pin': MapPin,
  car: Car,
  smartphone: Smartphone,
  home: Home,
  navigation: Navigation,
};

interface TimelineCardProps {
  stage: TimelineStage;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  painPoint?: string;
}

export function TimelineCard({ stage, index, isFirst, isLast, painPoint }: TimelineCardProps) {
  const Icon = iconMap[stage.icon] || Clock;

  return (
    <div
      className={cn(
        "relative flex gap-4 animate-slide-up opacity-0",
        `stagger-${Math.min(index + 1, 8)}`
      )}
      style={{ animationFillMode: 'forwards' }}
    >
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-300",
            isFirst
              ? 'bg-primary/20 border-primary text-primary shadow-[0_0_20px_hsl(40_45%_60%_/_0.3)]'
              : isLast
                ? 'bg-accent/20 border-accent text-accent shadow-[0_0_20px_hsl(193_100%_67%_/_0.3)]'
                : 'bg-secondary border-border text-muted-foreground hover:border-border/80'
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
        {!isLast && (
          <div className="timeline-connector flex-1 min-h-[40px] relative">
            {/* Animated pulse traveling down the connector */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-4 rounded-full bg-primary/60"
              style={{
                animation: 'altitudeRise 2s linear infinite',
                animationDelay: `${index * 0.3}s`,
              }}
            />
          </div>
        )}
      </div>

      {/* Card content */}
      <div className={cn("flex-1 pb-6", isLast && "pb-0")}>
        <div className="card-elevated rounded-lg p-4 deco-border card-hover group">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {stage.label}
              </h3>
              {isFirst && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                  Start
                </span>
              )}
              {isLast && (
                <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                  Goal
                </span>
              )}
            </div>
            <div className="text-right">
              <p className="text-cyan font-semibold text-sm flex items-center gap-1">
                {formatTime(stage.startTime)}
                {stage.startTime.getTime() !== stage.endTime.getTime() && (
                  <>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground text-xs">
                      {formatTime(stage.endTime)}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Duration badge */}
          <div className="flex items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/50 text-muted-foreground text-xs transition-all duration-200 group-hover:bg-secondary">
              <Clock className="w-3 h-3" />
              <span>
                {stage.durationRange.min === stage.durationRange.max
                  ? `${stage.durationRange.min} min`
                  : `${stage.durationRange.min}–${stage.durationRange.max} min`
                }
              </span>
            </div>

            {/* Progress bar for duration visualization */}
            <div className="flex-1 h-1 bg-secondary/30 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  isFirst
                    ? "bg-gradient-to-r from-primary to-primary/50"
                    : isLast
                      ? "bg-gradient-to-r from-accent/50 to-accent"
                      : "bg-gradient-to-r from-muted-foreground/30 to-muted-foreground/10"
                )}
                style={{
                  width: `${Math.min(100, (stage.durationRange.max / 60) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Note */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {stage.note}
          </p>
        </div>

        {/* Inline pain point callout for this stage */}
        {painPoint && (
          <div className="mt-3 animate-fade-in">
            <HeadsUpCallout message={painPoint} />
          </div>
        )}
      </div>
    </div>
  );
}
