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
      <div className="pbi-tooltip">
        <p className="text-sm font-semibold text-foreground mb-2">
          {data.ticker.replace('.NS', '').replace('.BO', '')}
        </p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Max Drawdown:</span>
            <span className="text-loss font-medium">{data.maxDrawdown.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Total Recovery:</span>
            <span className="text-gain font-medium">{data.totalRecovery.toFixed(1)}%</span>
          </div>
          {data.recoveryDays && (
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Recovery Days:</span>
              <span className="text-primary font-medium">{data.recoveryDays}</span>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Status:</span>
            <span className={`font-medium ${
              data.status === 'Leading' ? 'text-gain' : 
              data.status === 'Recovered' ? 'text-primary' : 'text-loss'
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
      case 'Leading': return '#01B8AA'; // Teal
      case 'Recovered': return '#118DFF'; // Blue
      default: return '#E66C37'; // Orange-Red
    }
  };

  if (chartData.length === 0) {
    return (
      <div className="pbi-card h-full">
        <div className="pbi-card-header">Resilience Scatter Plot</div>
        <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
          No data available for selected period
        </div>
      </div>
    );
  }

  return (
    <div className="pbi-card h-full">
      <div className="flex items-center justify-between mb-4">
        <span className="pbi-card-header mb-0">Resilience Scatter: Drawdown vs Recovery</span>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#01B8AA' }} /> Leading
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#118DFF' }} /> Recovered
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#E66C37' }} /> Lagging
          </span>
        </div>
      </div>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E1E1E1" />
            <XAxis
              type="number"
              dataKey="maxDrawdown"
              name="Max Drawdown %"
              stroke="#606060"
              tick={{ fontSize: 11, fill: '#606060' }}
              label={{ 
                value: 'Max Drawdown %', 
                position: 'bottom', 
                offset: 0,
                style: { fontSize: 11, fill: '#606060' }
              }}
              axisLine={{ stroke: '#E1E1E1' }}
              tickLine={{ stroke: '#E1E1E1' }}
            />
            <YAxis
              type="number"
              dataKey="totalRecovery"
              name="Total Recovery %"
              stroke="#606060"
              tick={{ fontSize: 11, fill: '#606060' }}
              label={{ 
                value: 'Total Recovery %', 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: 11, fill: '#606060' }
              }}
              axisLine={{ stroke: '#E1E1E1' }}
              tickLine={{ stroke: '#E1E1E1' }}
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
                  stroke={entry.ticker === selectedTicker ? '#000' : 'transparent'}
                  strokeWidth={entry.ticker === selectedTicker ? 2 : 0}
                  opacity={entry.ticker === selectedTicker ? 1 : 0.8}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
