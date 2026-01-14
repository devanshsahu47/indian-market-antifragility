import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Search, TrendingUp, TrendingDown, X } from 'lucide-react';
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
    <aside className="w-72 min-w-72 bg-sidebar border-r border-sidebar-border flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-sm font-semibold text-foreground uppercase tracking-wide">Filter Pane</h1>
      </div>

      {/* Index Slicer */}
      <div className="p-4 border-b border-sidebar-border">
        <label className="text-xs text-muted-foreground uppercase tracking-wide font-semibold block mb-2">
          Index
        </label>
        <Tabs 
          value={selectedIndex} 
          onValueChange={(v) => {
            setSelectedIndex(v as IndexType);
            setSelectedTicker(null);
          }}
        >
          <TabsList className="w-full bg-muted/50 border border-border">
            <TabsTrigger 
              value="NIFTY" 
              className="flex-1 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              NIFTY 50
            </TabsTrigger>
            <TabsTrigger 
              value="SENSEX" 
              className="flex-1 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              SENSEX
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Ticker Search Slicer */}
      <div className="p-4 border-b border-sidebar-border">
        <label className="text-xs text-muted-foreground uppercase tracking-wide font-semibold block mb-2">
          Ticker
        </label>
        <div className="pbi-slicer flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <Input
            placeholder="Search ticker..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 bg-transparent p-0 h-auto text-sm focus-visible:ring-0"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-muted-foreground hover:text-foreground">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Ticker List */}
      <ScrollArea className="flex-1 scrollbar-pbi">
        <div className="p-2">
          {filteredTickers.map((ticker) => {
            const metrics = getTickerMetrics(ticker);
            const isActive = ticker === selectedTicker;
            const isGain = metrics && metrics.totalRecovery > 0;
            
            return (
              <div
                key={ticker}
                className={cn("ticker-item", isActive && "active")}
                onClick={() => setSelectedTicker(ticker)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{ticker.replace('.NS', '').replace('.BO', '')}</span>
                  <div className={cn(
                    "flex items-center gap-1 text-xs",
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
                      "text-[10px] px-1.5 py-0.5 rounded uppercase font-medium",
                      metrics.status === 'Leading' && "bg-success/15 text-success",
                      metrics.status === 'Recovered' && "bg-primary/15 text-primary",
                      metrics.status === 'Lagging' && "bg-destructive/15 text-destructive"
                    )}>
                      {metrics.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      DD: {metrics.maxDrawdown.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border bg-sidebar">
        <div className="flex items-center gap-2">
          <div className="pulse-dot" />
          <span className="text-xs text-muted-foreground">
            {tickers.length} stocks loaded
          </span>
        </div>
      </div>
    </aside>
  );
}
