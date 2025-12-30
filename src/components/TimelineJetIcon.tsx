import { Plane } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TimelineJetIconProps {
  stageCount: number;
}

export function TimelineJetIcon({ stageCount }: TimelineJetIconProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, scrollTop / docHeight));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate vertical position based on scroll (travels down the timeline)
  const topPercent = scrollProgress * 85; // 0-85% of container height

  return (
    <div 
      className="absolute left-[22px] z-20 transition-all duration-150 ease-out pointer-events-none"
      style={{ top: `${topPercent}%` }}
    >
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 blur-lg bg-primary/40 rounded-full scale-150" />
        
        {/* Jet icon */}
        <div className="relative w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
          <Plane className="w-4 h-4 text-primary-foreground rotate-90" />
        </div>
        
        {/* Trail effect */}
        <div 
          className="absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gradient-to-t from-primary/60 to-transparent"
        />
      </div>
    </div>
  );
}
