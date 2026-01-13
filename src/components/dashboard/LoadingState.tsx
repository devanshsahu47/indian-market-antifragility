import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
        <h2 className="text-lg font-mono text-foreground mb-2">Loading Market Data</h2>
        <p className="text-sm text-muted-foreground font-mono">
          Parsing CSV files and computing analytics...
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-100" />
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-200" />
        </div>
      </div>
    </div>
  );
}
