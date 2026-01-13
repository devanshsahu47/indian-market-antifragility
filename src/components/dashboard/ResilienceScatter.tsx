import { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ZAxis } from 'recharts';
import type { StockResilienceData } from '@/types/market';

interface ResilienceScatterProps {
  data: StockResilienceData[];
  selectedTicker: string | null;
  onSelectTicker: (ticker: string) => void;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
        <p className="text-sm font-mono font-semibold text-foreground mb-2">
          {data.ticker.replace('.NS', '').replace('.BO', '')}
        </p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Max Drawdown:</span>
            <span className="font-mono text-loss">{data.maxDrawdown.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Total Recovery:</span>
            <span className="font-mono text-gain">{data.totalRecovery.toFixed(1)}%</span>
          </div>
          {data.recoveryDays && (
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Recovery Days:</span>
              <span className="font-mono text-accent">{data.recoveryDays}</span>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Status:</span>
            <span className={`font-mono ${
              data.status === 'Leading' ? 'text-gain' : 
              data.status === 'Recovered' ? 'text-accent' : 'text-loss'
            }`}>{data.status}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function ResilienceScatter({ data, selectedTicker, onSelectTicker }: ResilienceScatterProps) {
  const chartData = useMemo(() => {
    return data.filter(d => d.maxDrawdown > 0 || d.totalRecovery !== 0);
  }, [data]);

  const getColor = (status: string) => {
    switch (status) {
      case 'Leading': return 'hsl(160, 84%, 39%)';
      case 'Recovered': return 'hsl(188, 94%, 43%)';
      default: return 'hsl(0, 72%, 51%)';
    }
  };

  if (chartData.length === 0) {
    return (
      <div className="terminal-card h-full">
        <div className="terminal-header">
          <span className="terminal-title">Resilience Scatter Plot</span>
        </div>
        <div className="flex items-center justify-center h-[300px] text-muted-foreground font-mono text-sm">
          No data available for selected period
        </div>
      </div>
    );
  }

  return (
    <div className="terminal-card h-full">
      <div className="terminal-header">
        <span className="terminal-title">Resilience Scatter: Drawdown vs Recovery</span>
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary" /> Leading
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent" /> Recovered
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-destructive" /> Lagging
          </span>
        </div>
      </div>
      <div className="p-4 h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 28%, 17%)" />
            <XAxis
              type="number"
              dataKey="maxDrawdown"
              name="Max Drawdown %"
              stroke="hsl(215, 20%, 55%)"
              tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
              label={{ 
                value: 'Max Drawdown %', 
                position: 'bottom', 
                offset: 0,
                style: { fontSize: 10, fontFamily: 'JetBrains Mono', fill: 'hsl(215, 20%, 55%)' }
              }}
            />
            <YAxis
              type="number"
              dataKey="totalRecovery"
              name="Total Recovery %"
              stroke="hsl(215, 20%, 55%)"
              tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
              label={{ 
                value: 'Total Recovery %', 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: 10, fontFamily: 'JetBrains Mono', fill: 'hsl(215, 20%, 55%)' }
              }}
            />
            <ZAxis range={[50, 200]} />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter 
              data={chartData} 
              onClick={(data) => onSelectTicker(data.ticker)}
              cursor="pointer"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getColor(entry.status)}
                  stroke={entry.ticker === selectedTicker ? '#fff' : 'transparent'}
                  strokeWidth={entry.ticker === selectedTicker ? 2 : 0}
                  opacity={entry.ticker === selectedTicker ? 1 : 0.7}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
