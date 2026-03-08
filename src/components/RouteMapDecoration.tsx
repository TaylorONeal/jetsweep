import { useEffect, useRef, useState } from 'react';

interface RouteMapDecorationProps {
  className?: string;
  variant?: 'hero' | 'section' | 'card';
}

/** Thin-line SVG route map with animated dashed flight path and traveling plane dot */
export function RouteMapDecoration({ className = '', variant = 'hero' }: RouteMapDecorationProps) {
  const [dashOffset, setDashOffset] = useState(0);
  const animRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      setDashOffset(prev => (prev - 0.5) % 1000);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  if (variant === 'card') {
    return (
      <svg className={`pointer-events-none ${className}`} viewBox="0 0 200 40" fill="none" preserveAspectRatio="none">
        <path
          d="M0 30 Q50 5 100 20 T200 10"
          stroke="hsl(var(--gold) / 0.15)"
          strokeWidth="1"
          strokeDasharray="4 6"
          strokeDashoffset={dashOffset * 0.3}
        />
        <circle r="2" fill="hsl(var(--gold) / 0.5)">
          <animateMotion dur="4s" repeatCount="indefinite" path="M0 30 Q50 5 100 20 T200 10" />
        </circle>
      </svg>
    );
  }

  if (variant === 'section') {
    return (
      <svg className={`pointer-events-none ${className}`} viewBox="0 0 400 60" fill="none">
        {/* Thin route line */}
        <path
          d="M0 50 C80 10, 160 50, 200 30 S320 10, 400 40"
          stroke="hsl(var(--gold) / 0.12)"
          strokeWidth="0.75"
          strokeDasharray="6 8"
          strokeDashoffset={dashOffset * 0.4}
        />
        {/* Waypoint dots */}
        <circle cx="0" cy="50" r="2" fill="hsl(var(--gold) / 0.3)" />
        <circle cx="200" cy="30" r="2" fill="hsl(var(--cyan) / 0.3)" />
        <circle cx="400" cy="40" r="2" fill="hsl(var(--gold) / 0.3)" />
        {/* Traveling plane dot */}
        <circle r="2.5" fill="hsl(var(--cyan) / 0.6)">
          <animateMotion dur="6s" repeatCount="indefinite" path="M0 50 C80 10, 160 50, 200 30 S320 10, 400 40" />
        </circle>
        {/* Glow on plane dot */}
        <circle r="6" fill="hsl(var(--cyan) / 0.15)">
          <animateMotion dur="6s" repeatCount="indefinite" path="M0 50 C80 10, 160 50, 200 30 S320 10, 400 40" />
        </circle>
      </svg>
    );
  }

  // Hero variant - large sweeping route
  return (
    <svg className={`pointer-events-none ${className}`} viewBox="0 0 500 120" fill="none">
      {/* Great-circle arc route */}
      <path
        d="M20 100 C100 20, 200 10, 280 40 S400 100, 480 20"
        stroke="hsl(var(--gold) / 0.1)"
        strokeWidth="1"
        strokeDasharray="8 12"
        strokeDashoffset={dashOffset * 0.5}
      />
      {/* Second ghost route */}
      <path
        d="M40 90 C120 60, 240 20, 340 50 S420 80, 460 30"
        stroke="hsl(var(--cyan) / 0.06)"
        strokeWidth="0.5"
        strokeDasharray="4 10"
        strokeDashoffset={dashOffset * 0.3}
      />
      {/* Origin marker */}
      <circle cx="20" cy="100" r="3" fill="none" stroke="hsl(var(--gold) / 0.3)" strokeWidth="1" />
      <circle cx="20" cy="100" r="1.5" fill="hsl(var(--gold) / 0.4)" />
      {/* Destination marker */}
      <circle cx="480" cy="20" r="3" fill="none" stroke="hsl(var(--cyan) / 0.3)" strokeWidth="1" />
      <circle cx="480" cy="20" r="1.5" fill="hsl(var(--cyan) / 0.4)" />
      {/* Midpoint waypoint */}
      <circle cx="280" cy="40" r="1.5" fill="hsl(var(--gold) / 0.2)" />

      {/* Traveling plane with trail */}
      <g>
        <circle r="3" fill="hsl(var(--gold) / 0.7)">
          <animateMotion dur="8s" repeatCount="indefinite" path="M20 100 C100 20, 200 10, 280 40 S400 100, 480 20" />
        </circle>
        <circle r="8" fill="hsl(var(--gold) / 0.1)">
          <animateMotion dur="8s" repeatCount="indefinite" path="M20 100 C100 20, 200 10, 280 40 S400 100, 480 20" />
        </circle>
      </g>
    </svg>
  );
}
