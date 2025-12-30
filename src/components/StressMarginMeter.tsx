import { StressLevel } from '@/lib/timeline';

interface StressMarginMeterProps {
  margin: number;
  level: StressLevel;
}

export function StressMarginMeter({ margin, level }: StressMarginMeterProps) {
  // Calculate fill percentage (0-40 min maps to 0-100%)
  const fillPercent = Math.min(100, Math.max(0, (margin / 40) * 100));
  
  const colorClass = {
    'CALM': 'bg-emerald-400',
    'TIGHT': 'bg-amber-400',
    'RISKY': 'bg-red-400',
  }[level];

  const glowClass = {
    'CALM': 'shadow-[0_0_10px_hsl(142,69%,58%/0.4)]',
    'TIGHT': 'shadow-[0_0_10px_hsl(45,93%,47%/0.4)]',
    'RISKY': 'shadow-[0_0_10px_hsl(0,84%,60%/0.4)]',
  }[level];

  return (
    <div className="flex items-center gap-3">
      <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${colorClass} ${glowClass}`}
          style={{ width: `${fillPercent}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {margin} min
      </span>
    </div>
  );
}
