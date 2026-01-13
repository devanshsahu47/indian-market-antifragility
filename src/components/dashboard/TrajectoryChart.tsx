import { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { NormalizedChartData } from '@/types/market';

interface TrajectoryChartProps {
  data: NormalizedChartData[];
  stockTicker: string | null;
  indexName: string;
}

const CustomTooltip = ({ active, payload, label, isNormalized }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
        <p className="text-xs text-muted-foreground font-mono mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm">
            <span className="font-mono" style={{ color: entry.color }}>
              {entry.name}
            </span>
            <span className="font-mono font-medium">
              {isNormalized ? entry.value.toFixed(2) : `₹${entry.value.toFixed(2)}`}
            </span>
          </div>
        ))}
        {!isNormalized && payload[0]?.payload && (
          <div className="mt-2 pt-2 border-t border-border text-xs text-muted-foreground">
            <div>Normalized Stock: {payload[0].payload.stock?.toFixed(2)}</div>
            <div>Normalized Index: {payload[0].payload.index?.toFixed(2)}</div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export function TrajectoryChart({ data, stockTicker, indexName }: TrajectoryChartProps) {
  const [isNormalized, setIsNormalized] = useState(true);

  const chartData = useMemo(() => {
    return data.map(d => ({
      ...d,
      date: new Date(d.date).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
    }));
  }, [data]);

  if (!stockTicker || data.length === 0) {
    return (
      <div className="terminal-card h-full">
        <div className="terminal-header">
          <span className="terminal-title">Comparative Trajectory</span>
        </div>
        <div className="flex items-center justify-center h-[300px] text-muted-foreground font-mono text-sm">
          Select a stock to view trajectory comparison
        </div>
      </div>
    );
  }

  const stockLabel = stockTicker.replace('.NS', '').replace('.BO', '');

  return (
    <div className="terminal-card h-full">
      <div className="terminal-header">
        <span className="terminal-title">
          Comparative Trajectory {isNormalized && '(Base 100)'}
        </span>
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-accent">
            {stockLabel} vs {indexName}
          </span>
          <div className="flex items-center gap-2">
            <Switch
              id="normalize-toggle"
              checked={isNormalized}
              onCheckedChange={setIsNormalized}
              className="data-[state=checked]:bg-primary"
            />
            <Label htmlFor="normalize-toggle" className="text-xs font-mono text-muted-foreground cursor-pointer">
              Normalized
            </Label>
          </div>
        </div>
      </div>
      <div className="p-4 h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="indexGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 28%, 17%)" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(215, 20%, 55%)"
              tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="hsl(215, 20%, 55%)"
              tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
              domain={['auto', 'auto']}
              tickFormatter={(value) => isNormalized ? value.toFixed(0) : `₹${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip isNormalized={isNormalized} />} />
            <Legend 
              wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: '11px' }}
            />
            <Area
              type="monotone"
              dataKey={isNormalized ? "stock" : "stockPrice"}
              name={stockLabel}
              stroke="hsl(160, 84%, 39%)"
              fill="url(#stockGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey={isNormalized ? "index" : "indexPrice"}
              name={indexName}
              stroke="hsl(262, 83%, 58%)"
              fill="url(#indexGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
