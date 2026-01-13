import { useMarketData } from '@/hooks/useMarketData';
import { TickerSidebar } from './TickerSidebar';
import { CrisisSelector } from './CrisisSelector';
import { KPICard } from './KPICard';
import { TrajectoryChart } from './TrajectoryChart';
import { ResilienceScatter } from './ResilienceScatter';
import { MomentumTreemap } from './MomentumTreemap';
import { SmartInsight } from './SmartInsight';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { Activity, BarChart3, Clock, TrendingUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function Dashboard() {
  const {
    isLoading,
    error,
    selectedIndex,
    setSelectedIndex,
    selectedTicker,
    setSelectedTicker,
    selectedCrisis,
    setSelectedCrisis,
    tickers,
    marketMetrics,
    stockResilienceData,
    normalizedChartData,
    smartInsight,
  } = useMarketData();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  const volatilityTrend = marketMetrics.volatilityRatio > 1.1 ? 'up' : 
                          marketMetrics.volatilityRatio < 0.9 ? 'down' : 'neutral';

  const avgRecoveryDays = stockResilienceData
    .filter(s => s.recoveryDays !== null)
    .reduce((sum, s) => sum + (s.recoveryDays || 0), 0) / 
    stockResilienceData.filter(s => s.recoveryDays !== null).length || 0;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <TickerSidebar
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        tickers={tickers}
        selectedTicker={selectedTicker}
        setSelectedTicker={setSelectedTicker}
        stockResilienceData={stockResilienceData}
      />
      
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-screen">
          <div className="p-6 space-y-6">
            {/* Header */}
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Market Antifragility
                </h1>
                <p className="text-sm text-muted-foreground font-mono">
                  Indian Equity Resilience Dashboard • {selectedIndex}
                </p>
              </div>
              <CrisisSelector
                selectedCrisis={selectedCrisis}
                setSelectedCrisis={setSelectedCrisis}
              />
            </header>

            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard
                title="Market Breadth"
                value={`${marketMetrics.marketBreadth.toFixed(1)}%`}
                subtitle="Stocks above SMA50"
                trend={marketMetrics.marketBreadth > 50 ? 'up' : 'down'}
                trendValue={marketMetrics.marketBreadth > 50 ? 'Bullish' : 'Bearish'}
                icon={<BarChart3 className="w-3 h-3" />}
              />
              <KPICard
                title="Avg Recovery Speed"
                value={avgRecoveryDays > 0 ? `${Math.round(avgRecoveryDays)}` : '—'}
                subtitle="Trading days to reclaim peak"
                icon={<Clock className="w-3 h-3" />}
              />
              <KPICard
                title="Volatility Pulse"
                value={`${(marketMetrics.volatilityRatio * 100).toFixed(0)}%`}
                subtitle="Current vs Historical"
                trend={volatilityTrend}
                trendValue={volatilityTrend === 'up' ? 'Elevated' : volatilityTrend === 'down' ? 'Calm' : 'Normal'}
                icon={<Activity className="w-3 h-3" />}
              />
              <KPICard
                title="Leading Stocks"
                value={stockResilienceData.filter(s => s.status === 'Leading').length}
                subtitle={`of ${stockResilienceData.length} total`}
                trend="up"
                icon={<TrendingUp className="w-3 h-3" />}
              />
            </div>

            {/* Smart Insight */}
            <SmartInsight insight={smartInsight} />

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <TrajectoryChart
                data={normalizedChartData}
                stockTicker={selectedTicker}
                indexName={selectedIndex}
              />
              <ResilienceScatter
                data={stockResilienceData}
                selectedTicker={selectedTicker}
                onSelectTicker={setSelectedTicker}
              />
            </div>

            {/* Momentum Heatmap */}
            <MomentumTreemap
              data={stockResilienceData}
              selectedTicker={selectedTicker}
              onSelectTicker={setSelectedTicker}
            />

            {/* Footer */}
            <footer className="text-center text-xs text-muted-foreground font-mono py-4 border-t border-border">
              Data sourced from NIFTY 50 & SENSEX historical records • Analytics computed in real-time
            </footer>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
