import { Lightbulb, TrendingDown, TrendingUp, Clock, Shield } from 'lucide-react';

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
    return (
      <div className="executive-summary-card">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="p-2 rounded-lg bg-primary/10">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <span className="text-sm font-mono">Select a crisis period and stock to generate executive insights</span>
        </div>
      </div>
    );
  }

  const stockName = insight.stockTicker.replace('.NS', '').replace('.BO', '');
  const stockDrawdownNum = parseFloat(insight.stockDrawdown);
  const indexDrawdownNum = parseFloat(insight.indexDrawdown);
  const outperformed = stockDrawdownNum < indexDrawdownNum;
  
  // Determine antifragility level
  const antifragilityLevel = insight.recoveryDays !== null 
    ? (insight.recoveryDays < 120 ? 'High' : 'Moderate')
    : (parseFloat(insight.totalRecovery) > 100 ? 'High' : 'Moderate');

  return (
    <div className="executive-summary-card animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-base font-bold text-foreground">
              Executive Summary
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-mono uppercase rounded-full bg-accent/20 text-accent border border-accent/30">
              {insight.crisisName}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="text-foreground font-semibold">Insight:</span> During the{' '}
            <span className="text-accent font-medium">{insight.crisisName}</span>,{' '}
            <span className="text-foreground font-bold">{stockName}</span> experienced a{' '}
            <span className="text-loss font-mono font-semibold">{insight.stockDrawdown}%</span> drawdown 
            compared to the Index's{' '}
            <span className="text-loss font-mono">{insight.indexDrawdown}%</span>.{' '}
            {insight.recoveryDays ? (
              <>
                It successfully reclaimed its pre-crash peak in{' '}
                <span className="text-xl font-bold text-primary">{insight.recoveryDays}</span>{' '}
                <span className="text-primary font-medium">trading days</span>,
              </>
            ) : (
              <>
                It has gained{' '}
                <span className="text-xl font-bold text-gain">{insight.totalRecovery}%</span>{' '}
                <span className="text-gain font-medium">from the trough</span>,
              </>
            )}{' '}
            demonstrating <span className={antifragilityLevel === 'High' ? 'text-primary font-bold' : 'text-accent font-medium'}>
              {antifragilityLevel} Antifragility
            </span>.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-loss/10 border border-loss/20">
              <TrendingDown className="w-4 h-4 text-loss" />
              <div className="text-xs font-mono">
                <span className="text-muted-foreground">Max Drawdown:</span>{' '}
                <span className="text-loss font-semibold">{insight.stockDrawdown}%</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gain/10 border border-gain/20">
              <TrendingUp className="w-4 h-4 text-gain" />
              <div className="text-xs font-mono">
                <span className="text-muted-foreground">Recovery:</span>{' '}
                <span className="text-gain font-semibold">{insight.totalRecovery}%</span>
              </div>
            </div>
            {insight.recoveryDays && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                <Clock className="w-4 h-4 text-primary" />
                <div className="text-xs font-mono">
                  <span className="text-muted-foreground">Recovery Days:</span>{' '}
                  <span className="text-primary font-bold text-sm">{insight.recoveryDays}</span>
                </div>
              </div>
            )}
            {outperformed && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono text-primary font-medium">
                  Outperformed Index
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
