import { useEffect, useState } from 'react';

interface JetTrailDividerProps {
  className?: string;
}

/** Thin animated jet contrail divider line with micro-plane */
export function JetTrailDivider({ className = '' }: JetTrailDividerProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    let frame: number;
    const tick = () => {
      setPhase(prev => (prev + 0.003) % 1);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const planeX = phase * 100;

  return (
    <div className={`relative h-8 w-full overflow-hidden ${className}`}>
      {/* Base divider line */}
      <div
        className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(var(--border)) 15%, hsl(var(--border)) 85%, transparent)',
        }}
      />

      {/* Jet contrail — fades behind the plane */}
      <div
        className="absolute top-1/2 h-px -translate-y-1/2"
        style={{
          left: 0,
          width: `${planeX}%`,
          background: `linear-gradient(90deg, transparent 0%, hsl(var(--gold) / 0.05) 30%, hsl(var(--gold) / 0.25) 85%, hsl(var(--cyan) / 0.5) 100%)`,
          transition: 'none',
        }}
      />

      {/* Glow at plane position */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
        style={{
          left: `${planeX}%`,
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: 'radial-gradient(circle, hsl(var(--gold) / 0.2), transparent 70%)',
          filter: 'blur(4px)',
        }}
      />

      {/* Tiny plane icon (SVG triangle) */}
      <svg
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
        style={{ left: `${planeX}%` }}
        width="10"
        height="10"
        viewBox="0 0 10 10"
      >
        <polygon
          points="10,5 0,2 2,5 0,8"
          fill="hsl(var(--gold) / 0.7)"
        />
      </svg>
    </div>
  );
}
