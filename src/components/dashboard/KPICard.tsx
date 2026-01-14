import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
}

export function KPICard({ title, value, subtitle, trend, trendValue, icon }: KPICardProps) {
  return (
    <div className="pbi-card flex flex-col items-center justify-center min-h-[120px]">
      <div className="pbi-card-header flex items-center gap-1.5 justify-center">
        {icon}
        {title}
      </div>
      <div className={cn(
        "kpi-value",
        trend === 'up' && "text-gain",
        trend === 'down' && "text-loss"
      )}>
        {value}
      </div>
      {subtitle && (
        <p className="kpi-label mt-1">{subtitle}</p>
      )}
      {trend && trendValue && (
        <div className={cn(
          "flex items-center gap-1 text-xs mt-2",
          trend === 'up' && "text-gain",
          trend === 'down' && "text-loss",
          trend === 'neutral' && "text-muted-foreground"
        )}>
          {trend === 'up' && <TrendingUp className="w-3 h-3" />}
          {trend === 'down' && <TrendingDown className="w-3 h-3" />}
          {trend === 'neutral' && <Minus className="w-3 h-3" />}
          {trendValue}
        </div>
      )}
    </div>
  );
}
