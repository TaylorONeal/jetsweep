import { Plane } from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';

interface TimelineJetIconProps {
  stageCount: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  rotation: number;
}

export function TimelineJetIcon({ stageCount }: TimelineJetIconProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [smoothProgress, setSmoothProgress] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const lastScrollTime = useRef(Date.now());
  const lastScrollProgress = useRef(0);
  const particleIdRef = useRef(0);
  const animationFrameRef = useRef<number>();

  // Smooth physics-based interpolation
  useEffect(() => {
    const animate = () => {
      setSmoothProgress(prev => {
        const diff = scrollProgress - prev;
        const newVelocity = diff * 0.15;
        setVelocity(newVelocity);
        return prev + newVelocity;
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [scrollProgress]);

  // Generate contrail particles
  const generateParticle = useCallback(() => {
    if (Math.abs(velocity) > 0.001) {
      const newParticle: Particle = {
        id: particleIdRef.current++,
        x: 0,
        y: 0,
        opacity: 0.8,
        scale: 1,
        rotation: Math.random() * 360,
      };
      setParticles(prev => [...prev.slice(-12), newParticle]);
    }
  }, [velocity]);

  // Particle generation interval
  useEffect(() => {
    const interval = setInterval(generateParticle, 80);
    return () => clearInterval(interval);
  }, [generateParticle]);

  // Decay particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            opacity: p.opacity - 0.08,
            scale: p.scale * 1.15,
            y: p.y - 8,
          }))
          .filter(p => p.opacity > 0)
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, scrollTop / docHeight));

      lastScrollProgress.current = scrollProgress;
      lastScrollTime.current = Date.now();
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollProgress]);

  // Calculate vertical position based on smooth progress
  const topPercent = smoothProgress * 85;

  // Calculate banking angle based on velocity (tilts when accelerating/decelerating)
  const bankAngle = Math.max(-15, Math.min(15, velocity * 800));

  // Engine intensity based on movement
  const engineIntensity = Math.min(1, Math.abs(velocity) * 20 + 0.3);

  // Subtle oscillation for realism
  const wobble = Math.sin(Date.now() / 200) * 0.5;

  return (
    <div
      className="absolute left-[22px] z-20 pointer-events-none"
      style={{
        top: `${topPercent}%`,
        transform: `translateX(-50%) rotate(${90 + bankAngle + wobble}deg)`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      <div className="relative">
        {/* Contrail particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white/30"
            style={{
              width: 4 * particle.scale,
              height: 4 * particle.scale,
              left: -20 + particle.y * 0.3,
              top: particle.y,
              opacity: particle.opacity,
              transform: `rotate(${particle.rotation}deg)`,
              filter: 'blur(2px)',
            }}
          />
        ))}

        {/* Engine exhaust glow - rear */}
        <div
          className="absolute rounded-full"
          style={{
            width: 24,
            height: 8,
            left: -28,
            top: '50%',
            transform: 'translateY(-50%)',
            background: `radial-gradient(ellipse at right, hsl(193 100% 67% / ${engineIntensity * 0.6}), hsl(40 45% 60% / ${engineIntensity * 0.4}), transparent)`,
            filter: 'blur(4px)',
          }}
        />

        {/* Engine thrust cone */}
        <div
          className="absolute"
          style={{
            width: 40,
            height: 6,
            left: -45,
            top: '50%',
            transform: 'translateY(-50%)',
            background: `linear-gradient(to left, hsl(193 100% 67% / ${engineIntensity * 0.8}), hsl(40 45% 60% / ${engineIntensity * 0.3}), transparent)`,
            filter: 'blur(3px)',
            borderRadius: '0 50% 50% 0',
          }}
        />

        {/* Outer glow effect */}
        <div
          className="absolute inset-0 rounded-full scale-[2.5]"
          style={{
            background: `radial-gradient(circle, hsl(40 45% 60% / ${0.2 + engineIntensity * 0.2}), transparent 60%)`,
            filter: 'blur(8px)',
          }}
        />

        {/* Inner glow ring */}
        <div
          className="absolute inset-0 rounded-full scale-150"
          style={{
            background: `radial-gradient(circle, hsl(193 100% 67% / ${0.3 + engineIntensity * 0.2}), transparent 70%)`,
            filter: 'blur(4px)',
          }}
        />

        {/* Main jet body */}
        <div
          className="relative w-10 h-10 rounded-full flex items-center justify-center shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, hsl(40 45% 65%) 0%, hsl(40 45% 55%) 50%, hsl(40 35% 45%) 100%)',
            boxShadow: `
              0 0 20px hsl(40 45% 60% / 0.5),
              0 0 40px hsl(193 100% 67% / ${engineIntensity * 0.3}),
              inset 0 2px 4px hsl(40 45% 80% / 0.3),
              inset 0 -2px 4px hsl(40 35% 30% / 0.3)
            `,
          }}
        >
          <Plane
            className="w-5 h-5 drop-shadow-lg"
            style={{
              color: 'hsl(215 30% 10%)',
              filter: 'drop-shadow(0 1px 1px rgba(255,255,255,0.3))',
            }}
          />
        </div>

        {/* Wing tip vortices (visible when moving fast) */}
        {Math.abs(velocity) > 0.005 && (
          <>
            <div
              className="absolute w-1 h-8 rounded-full"
              style={{
                left: 4,
                top: -20,
                background: `linear-gradient(to top, hsl(193 100% 67% / ${Math.abs(velocity) * 30}), transparent)`,
                filter: 'blur(2px)',
              }}
            />
            <div
              className="absolute w-1 h-8 rounded-full"
              style={{
                left: 4,
                top: 24,
                background: `linear-gradient(to bottom, hsl(193 100% 67% / ${Math.abs(velocity) * 30}), transparent)`,
                filter: 'blur(2px)',
              }}
            />
          </>
        )}

        {/* Speed lines when scrolling fast */}
        {Math.abs(velocity) > 0.01 && (
          <div className="absolute -left-12 top-1/2 -translate-y-1/2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute h-px bg-gradient-to-l from-cyan/60 to-transparent"
                style={{
                  width: 20 + Math.random() * 20,
                  top: (i - 1) * 6,
                  left: -10 - i * 8,
                  opacity: Math.abs(velocity) * 30,
                }}
              />
            ))}
          </div>
        )}

        {/* Altitude indicator dots */}
        <div
          className="absolute -right-6 top-1/2 -translate-y-1/2 flex flex-col gap-1"
          style={{ opacity: 0.4 }}
        >
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full bg-primary"
              style={{
                opacity: i === 1 ? 1 : 0.4,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
