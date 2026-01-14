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
      <div className="pbi-tooltip">
        <p className="text-xs text-muted-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm">
            <span style={{ color: entry.color }}>
              {entry.name}
            </span>
            <span className="font-medium text-foreground">
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
      <div className="pbi-card h-full">
        <div className="pbi-card-header">Comparative Trajectory</div>
        <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
          Select a stock to view trajectory comparison
        </div>
      </div>
    );
  }

  return (
    <div className="pbi-card h-full">
      <div className="flex items-center justify-between mb-4">
        <span className="pbi-card-header mb-0">Comparative Trajectory (Normalized to 100)</span>
        <span className="text-xs text-primary font-medium">
          {stockTicker.replace('.NS', '').replace('.BO', '')} vs {indexName}
        </span>
      </div>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#118DFF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#118DFF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="indexGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#606060" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#606060" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E1E1E1" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#606060"
              tick={{ fontSize: 11, fill: '#606060' }}
              interval="preserveStartEnd"
              axisLine={{ stroke: '#E1E1E1' }}
              tickLine={{ stroke: '#E1E1E1' }}
            />
            <YAxis 
              stroke="#606060"
              tick={{ fontSize: 11, fill: '#606060' }}
              domain={['auto', 'auto']}
              axisLine={{ stroke: '#E1E1E1' }}
              tickLine={{ stroke: '#E1E1E1' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
            />
            <Area
              type="monotone"
              dataKey="stock"
              name={stockTicker.replace('.NS', '').replace('.BO', '')}
              stroke="#118DFF"
              fill="url(#stockGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="index"
              name={indexName}
              stroke="#606060"
              fill="url(#indexGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
