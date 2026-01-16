import { useState, useEffect, useCallback } from 'react';
import { Plane } from 'lucide-react';

interface TakeoffAnimationProps {
  onComplete: () => void;
  airportCode?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  type: 'spark' | 'smoke' | 'trail';
}

interface Cloud {
  id: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  speed: number;
}

export function TakeoffAnimation({ onComplete, airportCode = 'JFK' }: TakeoffAnimationProps) {
  const [phase, setPhase] = useState<'taxiing' | 'accelerating' | 'liftoff' | 'climbing' | 'done'>('taxiing');
  const [planePosition, setPlanePosition] = useState({ x: -20, y: 70 });
  const [planeRotation, setPlaneRotation] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [clouds, setClouds] = useState<Cloud[]>([]);
  const [engineGlow, setEngineGlow] = useState(0.3);
  const [showText, setShowText] = useState(true);

  // Generate initial clouds
  useEffect(() => {
    const initialClouds: Cloud[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 120 - 10,
      y: Math.random() * 40 + 5,
      scale: 0.5 + Math.random() * 1,
      opacity: 0.1 + Math.random() * 0.2,
      speed: 0.3 + Math.random() * 0.5,
    }));
    setClouds(initialClouds);
  }, []);

  // Move clouds
  useEffect(() => {
    const interval = setInterval(() => {
      setClouds(prev =>
        prev.map(cloud => ({
          ...cloud,
          x: cloud.x > 110 ? -10 : cloud.x + cloud.speed,
        }))
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Particle generator
  const generateParticle = useCallback((type: Particle['type']) => {
    const baseX = planePosition.x + 5;
    const baseY = planePosition.y + 2;

    if (type === 'spark') {
      return {
        id: Date.now() + Math.random(),
        x: baseX - 3,
        y: baseY + (Math.random() - 0.5) * 4,
        vx: -3 - Math.random() * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1,
        size: 2 + Math.random() * 2,
        type,
      };
    } else if (type === 'smoke') {
      return {
        id: Date.now() + Math.random(),
        x: baseX - 5,
        y: baseY,
        vx: -1 - Math.random(),
        vy: -0.5 + Math.random() * 0.3,
        life: 1,
        size: 8 + Math.random() * 8,
        type,
      };
    } else {
      return {
        id: Date.now() + Math.random(),
        x: baseX,
        y: baseY,
        vx: -2,
        vy: 0,
        life: 1,
        size: 3,
        type,
      };
    }
  }, [planePosition]);

  // Animation phases
  useEffect(() => {
    const timeline = [
      { delay: 0, action: () => setPhase('taxiing') },
      { delay: 400, action: () => setShowText(false) },
      { delay: 600, action: () => setPhase('accelerating') },
      { delay: 600, action: () => setEngineGlow(0.8) },
      { delay: 1800, action: () => setPhase('liftoff') },
      { delay: 2400, action: () => setPhase('climbing') },
      { delay: 3200, action: () => setPhase('done') },
      { delay: 3400, action: onComplete },
    ];

    const timeouts = timeline.map(({ delay, action }) =>
      setTimeout(action, delay)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  // Plane movement based on phase
  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      setPlanePosition(prev => {
        let newX = prev.x;
        let newY = prev.y;

        switch (phase) {
          case 'taxiing':
            newX = Math.min(prev.x + 0.3, 15);
            break;
          case 'accelerating':
            newX = Math.min(prev.x + 1.5, 50);
            setEngineGlow(g => Math.min(g + 0.01, 1));
            break;
          case 'liftoff':
            newX = Math.min(prev.x + 2, 70);
            newY = Math.max(prev.y - 0.8, 55);
            setPlaneRotation(r => Math.min(r + 0.5, 15));
            break;
          case 'climbing':
            newX = prev.x + 2.5;
            newY = Math.max(prev.y - 1.5, -20);
            setPlaneRotation(r => Math.min(r + 0.3, 25));
            break;
        }

        return { x: newX, y: newY };
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [phase]);

  // Generate particles during flight
  useEffect(() => {
    if (phase === 'taxiing') return;

    const interval = setInterval(() => {
      setParticles(prev => {
        const newParticles = [...prev];

        if (phase === 'accelerating' || phase === 'liftoff') {
          if (Math.random() > 0.3) newParticles.push(generateParticle('spark'));
          if (Math.random() > 0.5) newParticles.push(generateParticle('smoke'));
        }
        if (phase === 'climbing') {
          if (Math.random() > 0.4) newParticles.push(generateParticle('trail'));
        }

        return newParticles.slice(-50);
      });
    }, 40);

    return () => clearInterval(interval);
  }, [phase, generateParticle]);

  // Update particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.03,
            size: p.type === 'smoke' ? p.size * 1.02 : p.size,
          }))
          .filter(p => p.life > 0)
      );
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-hidden">
      {/* Sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg,
            hsl(215 40% 8%) 0%,
            hsl(215 35% 12%) 40%,
            hsl(215 30% 18%) 70%,
            hsl(215 25% 22%) 100%
          )`,
        }}
      />

      {/* Stars */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              opacity: 0.3 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>

      {/* Clouds */}
      {clouds.map(cloud => (
        <div
          key={cloud.id}
          className="absolute rounded-full"
          style={{
            left: `${cloud.x}%`,
            top: `${cloud.y}%`,
            width: 60 * cloud.scale,
            height: 20 * cloud.scale,
            background: 'radial-gradient(ellipse, hsl(210 20% 40% / 0.3), transparent)',
            filter: 'blur(10px)',
            opacity: cloud.opacity,
          }}
        />
      ))}

      {/* Runway */}
      <div
        className="absolute bottom-[28%] left-0 right-0 h-2"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(210 20% 25%) 10%, hsl(210 20% 25%) 90%, transparent)',
        }}
      />

      {/* Runway markings */}
      <div className="absolute bottom-[28%] left-[10%] right-[10%] h-2 flex items-center justify-around">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="w-8 h-0.5 bg-amber-400/60"
            style={{
              opacity: 0.4 + (i / 12) * 0.4,
            }}
          />
        ))}
      </div>

      {/* Runway lights */}
      <div className="absolute bottom-[27%] left-[5%] right-[5%] flex justify-between">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="w-1 h-1 rounded-full"
            style={{
              background: i % 2 === 0 ? 'hsl(40 90% 60%)' : 'hsl(0 70% 55%)',
              boxShadow: `0 0 6px ${i % 2 === 0 ? 'hsl(40 90% 60%)' : 'hsl(0 70% 55%)'}`,
              animation: `pulse-soft 1s ease-in-out ${i * 0.1}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Ground */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[27%]"
        style={{
          background: 'linear-gradient(180deg, hsl(210 25% 12%), hsl(210 30% 8%))',
        }}
      />

      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            opacity: particle.life,
            background:
              particle.type === 'spark'
                ? 'radial-gradient(circle, hsl(40 100% 70%), hsl(25 100% 50%))'
                : particle.type === 'smoke'
                ? 'radial-gradient(circle, hsl(210 10% 50% / 0.4), transparent)'
                : 'linear-gradient(90deg, hsl(193 100% 67% / 0.8), transparent)',
            filter: particle.type === 'smoke' ? 'blur(4px)' : 'blur(1px)',
            boxShadow:
              particle.type === 'spark'
                ? '0 0 4px hsl(40 100% 60%)'
                : 'none',
          }}
        />
      ))}

      {/* Plane */}
      <div
        className="absolute transition-transform"
        style={{
          left: `${planePosition.x}%`,
          top: `${planePosition.y}%`,
          transform: `rotate(${-planeRotation}deg)`,
        }}
      >
        {/* Engine exhaust */}
        <div
          className="absolute -left-8 top-1/2 -translate-y-1/2"
          style={{
            width: 40 * engineGlow,
            height: 12,
            background: `linear-gradient(90deg, transparent, hsl(40 100% 60% / ${engineGlow * 0.6}), hsl(193 100% 67% / ${engineGlow * 0.8}))`,
            filter: 'blur(4px)',
            borderRadius: '50% 0 0 50%',
          }}
        />

        {/* Engine glow core */}
        <div
          className="absolute -left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
          style={{
            background: `radial-gradient(circle, hsl(193 100% 80% / ${engineGlow}), hsl(40 100% 60% / ${engineGlow * 0.5}), transparent)`,
            filter: 'blur(2px)',
          }}
        />

        {/* Plane body glow */}
        <div
          className="absolute inset-0 rounded-full scale-150"
          style={{
            background: `radial-gradient(circle, hsl(40 45% 60% / ${0.2 + engineGlow * 0.3}), transparent)`,
            filter: 'blur(8px)',
          }}
        />

        {/* Plane */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, hsl(40 45% 65%) 0%, hsl(40 45% 55%) 50%, hsl(40 35% 45%) 100%)',
            boxShadow: `
              0 0 30px hsl(40 45% 60% / ${0.4 + engineGlow * 0.3}),
              0 0 60px hsl(193 100% 67% / ${engineGlow * 0.3}),
              inset 0 2px 6px hsl(40 45% 80% / 0.4),
              inset 0 -2px 6px hsl(40 35% 30% / 0.4)
            `,
          }}
        >
          <Plane
            className="w-8 h-8"
            style={{
              color: 'hsl(215 30% 10%)',
              filter: 'drop-shadow(0 1px 2px rgba(255,255,255,0.4))',
            }}
          />
        </div>

        {/* Wing tip lights */}
        <div
          className="absolute -top-2 left-1/2 w-2 h-2 rounded-full"
          style={{
            background: 'hsl(0 70% 55%)',
            boxShadow: '0 0 8px hsl(0 70% 55%)',
            animation: 'pulse-soft 1s ease-in-out infinite',
          }}
        />
        <div
          className="absolute -bottom-2 left-1/2 w-2 h-2 rounded-full"
          style={{
            background: 'hsl(120 70% 45%)',
            boxShadow: '0 0 8px hsl(120 70% 45%)',
            animation: 'pulse-soft 1s ease-in-out 0.5s infinite',
          }}
        />
      </div>

      {/* Status text */}
      <div
        className="absolute bottom-12 left-0 right-0 text-center transition-opacity duration-500"
        style={{ opacity: showText ? 1 : 0 }}
      >
        <p className="text-primary font-display text-2xl font-bold tracking-wider mb-2">
          {airportCode}
        </p>
        <p className="text-muted-foreground text-sm uppercase tracking-widest">
          Calculating your timeline...
        </p>
      </div>

      {/* Phase indicator */}
      <div className="absolute top-8 right-8 text-right">
        <p className="text-xs text-muted-foreground/50 uppercase tracking-widest">
          {phase === 'taxiing' && 'Taxi'}
          {phase === 'accelerating' && 'Throttle Up'}
          {phase === 'liftoff' && 'Rotate'}
          {phase === 'climbing' && 'Climbing'}
        </p>
      </div>
    </div>
  );
}
