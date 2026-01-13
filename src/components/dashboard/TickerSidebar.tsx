import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { IndexType, StockResilienceData } from '@/types/market';

interface TickerSidebarProps {
  selectedIndex: IndexType;
  setSelectedIndex: (index: IndexType) => void;
  tickers: string[];
  selectedTicker: string | null;
  setSelectedTicker: (ticker: string | null) => void;
  stockResilienceData: StockResilienceData[];
}

export function TickerSidebar({
  selectedIndex,
  setSelectedIndex,
  tickers,
  selectedTicker,
  setSelectedTicker,
  stockResilienceData,
}: TickerSidebarProps) {
  const [search, setSearch] = useState('');

  const filteredTickers = tickers.filter(ticker =>
    ticker.toLowerCase().includes(search.toLowerCase())
  );

  const getTickerMetrics = (ticker: string) => {
    return stockResilienceData.find(s => s.ticker === ticker);
  };

  return (
    <aside className="w-72 min-w-72 bg-sidebar border-r border-sidebar-border flex flex-col h-screen max-md:hidden">
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-lg font-semibold text-foreground mb-1">Market Antifragility</h1>
        <p className="text-xs text-muted-foreground">Indian Equity Resilience Dashboard</p>
      </div>

      <div className="p-4 border-b border-sidebar-border">
        <Tabs 
          value={selectedIndex} 
          onValueChange={(v) => {
            setSelectedIndex(v as IndexType);
            setSelectedTicker(null);
          }}
        >
          <TabsList className="w-full bg-muted">
            <TabsTrigger value="NIFTY" className="flex-1 font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              NIFTY 50
            </TabsTrigger>
            <TabsTrigger value="SENSEX" className="flex-1 font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              SENSEX
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="p-4 border-b border-sidebar-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search ticker..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted border-border font-mono text-sm"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 scrollbar-terminal">
        <div className="p-2">
          {filteredTickers.map((ticker) => {
            const metrics = getTickerMetrics(ticker);
            const isActive = ticker === selectedTicker;
            const isGain = metrics && metrics.totalRecovery > 0;
            
            return (
              <div
                key={ticker}
                className={cn(
                  "ticker-item cursor-pointer transition-all duration-200",
                  isActive && "active bg-primary/20 border-l-2 border-l-primary ring-1 ring-primary/30"
                )}
                onClick={() => setSelectedTicker(ticker)}
              >
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "font-mono text-sm font-medium",
                    isActive && "text-primary"
                  )}>
                    {ticker.replace('.NS', '').replace('.BO', '')}
                  </span>
                  <div className={cn(
                    "flex items-center gap-1 text-xs font-mono",
                    isGain ? "text-gain" : "text-loss"
                  )}>
                    {isGain ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {metrics ? `${Math.abs(metrics.totalRecovery).toFixed(1)}%` : '—'}
                  </div>
                </div>
                {metrics && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded font-mono uppercase",
                      metrics.status === 'Leading' && "bg-primary/20 text-primary",
                      metrics.status === 'Recovered' && "bg-accent/20 text-accent",
                      metrics.status === 'Lagging' && "bg-destructive/20 text-destructive"
                    )}>
                      {metrics.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      DD: {metrics.maxDrawdown.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-sidebar-border bg-sidebar">
        <div className="flex items-center gap-2">
          <div className="pulse-dot" />
          <span className="text-xs text-muted-foreground font-mono">
            {tickers.length} stocks loaded
          </span>
        </div>
      </div>
    </aside>
  );
}
