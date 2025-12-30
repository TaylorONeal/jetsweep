import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plane, Clock, History } from 'lucide-react';
import { RecentSearch, formatRecentSearchTime } from '@/lib/recentSearches';
import { getAirportProfile } from '@/lib/airports';

interface LandingHeroProps {
  onStart: () => void;
  recentSearches?: RecentSearch[];
  onQuickSearch?: (search: RecentSearch) => void;
}

export function LandingHero({ onStart, recentSearches = [], onQuickSearch }: LandingHeroProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* App name - top, small but confident */}
      <header className="pt-12 px-6 flex items-center justify-between">
        <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
          JetSweep
        </p>
        <Link 
          to="/about" 
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          About
        </Link>
      </header>

      {/* Main content - centered vertically */}
      <main className="flex-1 flex flex-col justify-center px-6 pb-24">
        <div className="max-w-md mx-auto w-full">
          {/* Primary headline - largest text */}
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Get to the airport on time.
          </h1>

          {/* Airplane motion divider */}
          <div className="my-10 relative">
            <div className="h-px bg-border" />
            <div className="airplane-track absolute inset-0 overflow-hidden">
              <Plane 
                className="w-4 h-4 text-primary airplane-icon absolute top-1/2 -translate-y-1/2" 
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* Secondary line - one sentence, smaller, muted */}
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            A precise exit plan based on your airport, flight, and risk.
          </p>

          {/* Primary CTA button */}
          <Button 
            onClick={onStart}
            variant="gold"
            size="xl"
            className="w-full mt-10"
          >
            Show me when to leave
          </Button>

          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-3">
                <History className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Recent</span>
              </div>
              <div className="space-y-2">
                {recentSearches.slice(0, 3).map((search) => {
                  const { profile } = getAirportProfile(search.airport);
                  return (
                    <button
                      key={search.id}
                      onClick={() => onQuickSearch?.(search)}
                      className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border hover:bg-secondary transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-primary text-sm">{search.airport}</span>
                        <span className="text-foreground text-sm">{search.tripType}</span>
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
      <footer className="pb-8 px-6">
        <p className="text-center text-xs text-muted-foreground/70">
          Airport-specific logic. Real buffers. No guessing.
        </p>
      </footer>
    </div>
  );
}
