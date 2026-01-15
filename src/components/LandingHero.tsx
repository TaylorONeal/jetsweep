import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plane, Clock, History, Download, Sparkles } from 'lucide-react';
import { RecentSearch, formatRecentSearchTime } from '@/lib/recentSearches';
import { getAirportProfile } from '@/lib/airports';
import { usePWAInstall } from '@/hooks/use-pwa-install';
import { useState, useEffect } from 'react';

interface LandingHeroProps {
  onStart: () => void;
  recentSearches?: RecentSearch[];
  onQuickSearch?: (search: RecentSearch) => void;
}

// Animated plane component with trail
function AnimatedPlane() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="airplane-track absolute inset-0 overflow-hidden">
      {/* Contrail effect */}
      <div
        className="absolute top-1/2 -translate-y-1/2 h-px airplane-icon"
        style={{
          left: '-5%',
          width: 60,
          background: 'linear-gradient(90deg, transparent, hsl(40 45% 60% / 0.4), hsl(193 100% 67% / 0.6))',
          filter: 'blur(1px)',
        }}
      />

      {/* Glow effect behind plane */}
      <div
        className="absolute top-1/2 -translate-y-1/2 airplane-icon"
        style={{
          left: '-5%',
          width: 20,
          height: 20,
          marginLeft: 50,
          background: 'radial-gradient(circle, hsl(40 45% 60% / 0.3), transparent)',
          filter: 'blur(6px)',
          transform: 'translateY(-50%)',
        }}
      />

      {/* Main plane */}
      <Plane
        className="w-5 h-5 text-primary airplane-icon absolute top-1/2 -translate-y-1/2"
        style={{
          filter: 'drop-shadow(0 0 4px hsl(40 45% 60% / 0.5))',
        }}
        strokeWidth={2}
      />
    </div>
  );
}

export function LandingHero({ onStart, recentSearches = [], onQuickSearch }: LandingHeroProps) {
  const { isInstallable, install } = usePWAInstall();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, hsl(40 45% 60% / 0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, hsl(193 100% 67% / 0.03) 0%, transparent 40%)
          `,
        }}
      />

      {/* App name - top, small but confident */}
      <header className="pt-12 px-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Plane className="w-4 h-4 text-primary" />
          </div>
          <p className="text-foreground text-sm font-medium tracking-widest uppercase">
            JetSweep
          </p>
        </div>
        <div className="flex items-center gap-4">
          {isInstallable && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 text-primary hover:text-primary/80 text-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              Install
            </button>
          )}
          <Link
            to="/about"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            About
          </Link>
        </div>
      </header>

      {/* Main content - centered vertically */}
      <main className="flex-1 flex flex-col justify-center px-6 pb-24 relative z-10">
        <div className="max-w-md mx-auto w-full">
          {/* Primary headline - largest text */}
          <h1
            className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight animate-fade-in"
            style={{
              textShadow: '0 0 60px hsl(40 45% 60% / 0.15)',
            }}
          >
            Get to the airport on time.
          </h1>

          {/* Airplane motion divider */}
          <div className="my-10 relative">
            <div
              className="h-px"
              style={{
                background: 'linear-gradient(90deg, transparent, hsl(var(--border)) 20%, hsl(var(--border)) 80%, transparent)',
              }}
            />
            <AnimatedPlane />
          </div>

          {/* Secondary line - one sentence, smaller, muted */}
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            A precise exit plan based on your airport, flight, and risk.
          </p>

          {/* Primary CTA button */}
          <Button
            onClick={onStart}
            variant="gold"
            size="xl"
            className="w-full mt-10 group animate-fade-in hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            style={{ animationDelay: '0.3s' }}
          >
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Show me when to leave
          </Button>

          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-2 mb-3">
                <History className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Recent</span>
              </div>
              <div className="space-y-2">
                {recentSearches.slice(0, 3).map((search, index) => {
                  const { profile } = getAirportProfile(search.airport);
                  return (
                    <button
                      key={search.id}
                      onClick={() => onQuickSearch?.(search)}
                      className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border hover:bg-secondary hover:border-primary/30 transition-all duration-200 text-left group hover:scale-[1.01] active:scale-[0.99]"
                      style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <span className="font-mono text-primary text-xs">{search.airport}</span>
                        </div>
                        <span className="text-foreground text-sm capitalize">{search.tripType}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Clock className="w-3 h-3" />
                        {formatRecentSearchTime(search.createdAt)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Subtle credibility line - very small, near bottom */}
      <footer className="pb-8 px-6 relative z-10">
        <p className="text-center text-xs text-muted-foreground/70 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          Airport-specific logic. Real buffers. No guessing.
        </p>
      </footer>
    </div>
  );
}
