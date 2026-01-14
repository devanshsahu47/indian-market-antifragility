import { Lightbulb, TrendingDown, TrendingUp, Clock } from 'lucide-react';

interface SmartInsightProps {
  insight: {
    crisisName: string;
    stockTicker: string;
    stockDrawdown: string;
    indexDrawdown: string;
    recoveryDays: number | null;
    totalRecovery: string;
  } | null;
}

export function SmartInsight({ insight }: SmartInsightProps) {
  if (!insight) {
    return null;
  }

  const stockName = insight.stockTicker.replace('.NS', '').replace('.BO', '');
  const outperformed = parseFloat(insight.stockDrawdown) < parseFloat(insight.indexDrawdown);

  return (
    <div className="insight-card animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded bg-primary/10">
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground mb-2">
            Smart Analysis: {insight.crisisName}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            During the <span className="text-primary font-medium">{insight.crisisName}</span> period,{' '}
            <span className="text-foreground font-semibold">{stockName}</span> fell{' '}
            <span className="text-loss font-medium">{insight.stockDrawdown}%</span>{' '}
            (Index fell <span className="text-loss">{insight.indexDrawdown}%</span>)
            {insight.recoveryDays ? (
              <>
                {' '}and recovered its pre-crisis value in{' '}
                <span className="text-primary font-medium">{insight.recoveryDays}</span> trading days.
              </>
            ) : (
              <>
                {' '}and has gained{' '}
                <span className="text-gain font-medium">{insight.totalRecovery}%</span> from the trough.
              </>
            )}
          </p>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-loss" />
              <span className="text-xs text-muted-foreground">
                Drawdown: <span className="text-loss font-medium">{insight.stockDrawdown}%</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-gain" />
              <span className="text-xs text-muted-foreground">
                Recovery: <span className="text-gain font-medium">{insight.totalRecovery}%</span>
              </span>
            </div>
            {insight.recoveryDays && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">
                  Days: <span className="text-primary font-medium">{insight.recoveryDays}</span>
                </span>
              </div>
            )}
          </div>
          {outperformed && (
            <div className="mt-3 text-xs text-success font-medium">
              ✓ {stockName} showed stronger resilience than the Index
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
