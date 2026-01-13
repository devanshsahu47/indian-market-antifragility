import { cn } from '@/lib/utils';
import { CRISIS_PRESETS, type CrisisPreset } from '@/types/market';
import { Calendar, X } from 'lucide-react';

interface CrisisSelectorProps {
  selectedCrisis: CrisisPreset | null;
  setSelectedCrisis: (crisis: CrisisPreset | null) => void;
}

export function CrisisSelector({ selectedCrisis, setSelectedCrisis }: CrisisSelectorProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider flex items-center gap-1">
        <Calendar className="w-3 h-3" />
        Crisis Period:
      </span>
      {CRISIS_PRESETS.map((crisis) => (
        <button
          key={crisis.id}
          onClick={() => setSelectedCrisis(selectedCrisis?.id === crisis.id ? null : crisis)}
          className={cn(
            "crisis-badge transition-all duration-200",
            selectedCrisis?.id === crisis.id && "active"
          )}
        >
          {crisis.name}
        </button>
      ))}
      {selectedCrisis && (
        <button
          onClick={() => setSelectedCrisis(null)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <X className="w-3 h-3" />
          Clear
        </button>
      )}
    </div>
  );
}
