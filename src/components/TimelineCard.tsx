import { TimelineStage, formatTime } from '@/lib/timeline';
import { 
  Plane, 
  DoorOpen, 
  ShieldCheck, 
  Luggage, 
  MapPin, 
  Car, 
  Smartphone,
  Home,
  Clock
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  plane: Plane,
  'door-open': DoorOpen,
  'shield-check': ShieldCheck,
  luggage: Luggage,
  'map-pin': MapPin,
  car: Car,
  smartphone: Smartphone,
  home: Home,
};

interface TimelineCardProps {
  stage: TimelineStage;
  index: number;
  isFirst: boolean;
  isLast: boolean;
}

export function TimelineCard({ stage, index, isFirst, isLast }: TimelineCardProps) {
  const Icon = iconMap[stage.icon] || Clock;
  
  return (
    <div 
      className={`relative flex gap-4 animate-slide-up opacity-0 stagger-${Math.min(index + 1, 8)}`}
      style={{ animationFillMode: 'forwards' }}
    >
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        <div 
          className={`w-12 h-12 rounded-full flex items-center justify-center border-2 z-10
            ${isFirst 
              ? 'bg-primary/20 border-primary text-primary' 
              : isLast 
                ? 'bg-accent/20 border-accent text-accent'
                : 'bg-secondary border-border text-muted-foreground'
            }`}
        >
          <Icon className="w-5 h-5" />
        </div>
        {!isLast && (
          <div className="timeline-connector flex-1 min-h-[40px]" />
        )}
      </div>

      {/* Card content */}
      <div className={`flex-1 pb-6 ${isLast ? 'pb-0' : ''}`}>
        <div className="card-elevated rounded-lg p-4 deco-border">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-display text-lg font-semibold text-foreground">
              {stage.label}
            </h3>
            <div className="text-right">
              <p className="text-cyan font-semibold text-sm">
                {formatTime(stage.startTime)}
              </p>
              {stage.startTime.getTime() !== stage.endTime.getTime() && (
                <p className="text-muted-foreground text-xs">
                  to {formatTime(stage.endTime)}
                </p>
              )}
            </div>
          </div>

          {/* Duration badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/50 text-muted-foreground text-xs mb-3">
            <Clock className="w-3 h-3" />
            <span>
              {stage.durationRange.min === stage.durationRange.max 
                ? `${stage.durationRange.min} min`
                : `${stage.durationRange.min}–${stage.durationRange.max} min`
              }
            </span>
          </div>

          {/* Note */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {stage.note}
          </p>
        </div>
      </div>
    </div>
  );
}
