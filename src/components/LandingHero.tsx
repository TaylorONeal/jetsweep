import { Button } from '@/components/ui/button';
import { Plane } from 'lucide-react';

interface LandingHeroProps {
  onStart: () => void;
}

export function LandingHero({ onStart }: LandingHeroProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* App name - top, small but confident */}
      <header className="pt-12 px-6">
        <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
          JetSweep
        </p>
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
