import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { NormalizedChartData } from '@/types/market';

interface TrajectoryChartProps {
  data: NormalizedChartData[];
  stockTicker: string | null;
  indexName: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
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
              {entry.value.toFixed(2)}
            </span>
          </div>
        ))}
        {payload[0]?.payload && (
          <div className="mt-2 pt-2 border-t border-border text-xs text-muted-foreground">
            <div>Stock: ₹{payload[0].payload.stockPrice?.toFixed(2)}</div>
            <div>Index: {payload[0].payload.indexPrice?.toFixed(2)}</div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export function TrajectoryChart({ data, stockTicker, indexName }: TrajectoryChartProps) {
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

  return (
    <div className="terminal-card h-full">
      <div className="terminal-header">
        <span className="terminal-title">Comparative Trajectory (Normalized to 100)</span>
        <span className="text-xs font-mono text-accent">
          {stockTicker.replace('.NS', '').replace('.BO', '')} vs {indexName}
        </span>
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
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: '11px' }}
            />
            <Area
              type="monotone"
              dataKey="stock"
              name={stockTicker.replace('.NS', '').replace('.BO', '')}
              stroke="hsl(160, 84%, 39%)"
              fill="url(#stockGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="index"
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
