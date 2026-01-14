import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { StockResilienceData } from '@/types/market';

interface MomentumTreemapProps {
  data: StockResilienceData[];
  selectedTicker: string | null;
  onSelectTicker: (ticker: string) => void;
}

export function MomentumTreemap({ data, selectedTicker, onSelectTicker }: MomentumTreemapProps) {
  const sortedData = useMemo(() => {
    return [...data]
      .filter(d => d.rsi !== null)
      .sort((a, b) => (b.rsi || 0) - (a.rsi || 0))
      .slice(0, 30);
  }, [data]);

  // Power BI style color scale
  const getColor = (rsi: number | null) => {
    if (rsi === null) return 'bg-muted';
    if (rsi >= 70) return 'bg-[#E66C37]'; // Orange-Red (Overbought)
    if (rsi >= 60) return 'bg-[#FD625E]'; // Light red
    if (rsi >= 50) return 'bg-[#F2C80F]'; // Yellow
    if (rsi >= 40) return 'bg-[#01B8AA]'; // Teal
    if (rsi >= 30) return 'bg-[#118DFF]'; // Blue
    return 'bg-[#12239E]'; // Dark Blue (Oversold)
  };

  const getTextColor = (rsi: number | null) => {
    if (rsi === null) return 'text-muted-foreground';
    if (rsi >= 50 && rsi < 60) return 'text-black';
    return 'text-white';
  };

  if (sortedData.length === 0) {
    return (
      <div className="pbi-card h-full">
        <div className="pbi-card-header">Momentum Heatmap</div>
        <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
          No RSI data available
        </div>
      </div>
    );
  }

  return (
    <div className="pbi-card h-full">
      <div className="flex items-center justify-between mb-4">
        <span className="pbi-card-header mb-0">Momentum Heatmap (RSI)</span>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="w-3 h-2 bg-[#12239E] rounded-sm" /> Oversold
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-2 bg-[#118DFF] rounded-sm" /> 30-40
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-2 bg-[#01B8AA] rounded-sm" /> 40-50
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-2 bg-[#F2C80F] rounded-sm" /> 50-60
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-2 bg-[#FD625E] rounded-sm" /> 60-70
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-2 bg-[#E66C37] rounded-sm" /> Overbought
          </span>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-1">
        {sortedData.map((stock) => (
          <button
            key={stock.ticker}
            onClick={() => onSelectTicker(stock.ticker)}
            className={cn(
              "p-2 rounded transition-all duration-150 text-center",
              getColor(stock.rsi),
              getTextColor(stock.rsi),
              selectedTicker === stock.ticker && "ring-2 ring-foreground ring-offset-2 ring-offset-card"
            )}
          >
            <div className="text-[10px] font-medium truncate">
              {stock.ticker.replace('.NS', '').replace('.BO', '')}
            </div>
            <div className="text-[9px] opacity-80">
              {stock.rsi?.toFixed(0)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
