import { AlertTriangle } from 'lucide-react';

interface HeadsUpCalloutProps {
  message: string;
}

export function HeadsUpCallout({ message }: HeadsUpCalloutProps) {
  return (
    <div className="card-elevated rounded-lg p-4 mb-6 border-l-2 border-l-amber-400/70 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-400/10 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <p className="text-amber-400 font-medium text-sm uppercase tracking-wider mb-1">
            Heads up
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
