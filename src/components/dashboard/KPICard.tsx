import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  infoTooltip?: string;
}

export function KPICard({ title, value, subtitle, trend, trendValue, icon, infoTooltip }: KPICardProps) {
  return (
    <div className="terminal-card p-4 animate-scale-in">
      <div className="terminal-header -mx-4 -mt-4 mb-4">
        <span className="terminal-title flex items-center gap-2">
          {icon}
          {title}
          {infoTooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-accent cursor-help transition-colors" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[250px] text-xs">
                  {infoTooltip}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </span>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-mono",
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
    </div>
  );
}
