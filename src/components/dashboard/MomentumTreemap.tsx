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

  const getColor = (rsi: number | null) => {
    if (rsi === null) return 'bg-muted';
    if (rsi >= 70) return 'bg-red-600'; // Overbought
    if (rsi >= 60) return 'bg-orange-500';
    if (rsi >= 50) return 'bg-yellow-500';
    if (rsi >= 40) return 'bg-emerald-500';
    if (rsi >= 30) return 'bg-cyan-500';
    return 'bg-blue-600'; // Oversold
  };

  const getTextColor = (rsi: number | null) => {
    if (rsi === null) return 'text-muted-foreground';
    if (rsi >= 60 || rsi < 40) return 'text-white';
    return 'text-black';
  };

  if (sortedData.length === 0) {
    return (
      <div className="terminal-card h-full">
        <div className="terminal-header">
          <span className="terminal-title">Momentum Heatmap</span>
        </div>
        <div className="flex items-center justify-center h-[200px] text-muted-foreground font-mono text-sm">
          No RSI data available
        </div>
      </div>
    );
  }

  return (
    <div className="terminal-card h-full">
      <div className="terminal-header">
        <span className="terminal-title">Momentum Heatmap (RSI)</span>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="flex items-center gap-1">
            <span className="w-3 h-2 bg-blue-600 rounded-sm" /> Oversold
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-2 bg-cyan-500 rounded-sm" /> 30-40
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-2 bg-emerald-500 rounded-sm" /> 40-50
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-2 bg-yellow-500 rounded-sm" /> 50-60
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-2 bg-orange-500 rounded-sm" /> 60-70
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-2 bg-red-600 rounded-sm" /> Overbought
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-6 gap-1">
          {sortedData.map((stock) => (
            <button
              key={stock.ticker}
              onClick={() => onSelectTicker(stock.ticker)}
              className={cn(
                "p-2 rounded transition-all duration-200 text-center",
                getColor(stock.rsi),
                getTextColor(stock.rsi),
                selectedTicker === stock.ticker && "ring-2 ring-white ring-offset-2 ring-offset-background"
              )}
            >
              <div className="font-mono text-[10px] font-medium truncate">
                {stock.ticker.replace('.NS', '').replace('.BO', '')}
              </div>
              <div className="font-mono text-[9px] opacity-80">
                {stock.rsi?.toFixed(0)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
