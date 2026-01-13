import { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import type { IndexDataPoint, CompanyDataPoint, IndexType, CrisisPreset, MarketMetrics, StockResilienceData, NormalizedChartData } from '@/types/market';

interface RawDataRow {
  Date: string;
  Close: string;
  High: string;
  Low: string;
  Open: string;
  Volume: string;
  SMA_20?: string;
  SMA_50?: string;
  MACD?: string;
  Signal_Line?: string;
  RSI_14?: string;
  BB_Upper?: string;
  BB_Lower?: string;
  Ticker?: string;
}

const parseNumber = (value: string | undefined): number | null => {
  if (!value || value === '' || value === 'null' || value === 'undefined') return null;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
};

const parseDataPoint = (row: RawDataRow): IndexDataPoint => ({
  Date: row.Date,
  Close: parseFloat(row.Close) || 0,
  High: parseFloat(row.High) || 0,
  Low: parseFloat(row.Low) || 0,
  Open: parseFloat(row.Open) || 0,
  Volume: parseFloat(row.Volume) || 0,
  SMA_20: parseNumber(row.SMA_20),
  SMA_50: parseNumber(row.SMA_50),
  MACD: parseNumber(row.MACD),
  Signal_Line: parseNumber(row.Signal_Line),
  RSI_14: parseNumber(row.RSI_14),
  BB_Upper: parseNumber(row.BB_Upper),
  BB_Lower: parseNumber(row.BB_Lower),
});

const parseCompanyDataPoint = (row: RawDataRow): CompanyDataPoint => ({
  ...parseDataPoint(row),
  Ticker: row.Ticker || '',
});

async function loadCSV<T>(url: string, parser: (row: RawDataRow) => T): Promise<T[]> {
  const response = await fetch(url);
  const text = await response.text();
  
  return new Promise((resolve, reject) => {
    Papa.parse<RawDataRow>(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data.map(parser);
        resolve(data);
      },
      error: (error) => reject(error),
    });
  });
}

// Default crisis preset for 2020 COVID-19 Crash
const DEFAULT_CRISIS: CrisisPreset = {
  id: 'covid-2020',
  name: '2020 COVID-19 Crash',
  startDate: '2020-02-01',
  endDate: '2020-12-31',
  description: 'COVID-19 Pandemic Crash',
};

export function useMarketData() {
  const [niftyIndex, setNiftyIndex] = useState<IndexDataPoint[]>([]);
  const [sensexIndex, setSensexIndex] = useState<IndexDataPoint[]>([]);
  const [niftyCompanies, setNiftyCompanies] = useState<CompanyDataPoint[]>([]);
  const [sensexCompanies, setSensexCompanies] = useState<CompanyDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<IndexType>('NIFTY');
  const [selectedTicker, setSelectedTicker] = useState<string | null>('RELIANCE.NS');
  const [selectedCrisis, setSelectedCrisis] = useState<CrisisPreset | null>(DEFAULT_CRISIS);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setIsLoading(true);
        const [niftyIdx, sensexIdx, niftyCo, sensexCo] = await Promise.all([
          loadCSV('/data/NIFTY_50_LITE.csv', parseDataPoint),
          loadCSV('/data/SENSEX_LITE.csv', parseDataPoint),
          loadCSV('/data/NIFTY_50_COMPANIES_LITE.csv', parseCompanyDataPoint),
          loadCSV('/data/SENSEX_COMPANIES_LITE.csv', parseCompanyDataPoint),
        ]);

        setNiftyIndex(niftyIdx);
        setSensexIndex(sensexIdx);
        setNiftyCompanies(niftyCo);
        setSensexCompanies(sensexCo);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load market data');
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

  const indexData = useMemo(() => {
    return selectedIndex === 'NIFTY' ? niftyIndex : sensexIndex;
  }, [selectedIndex, niftyIndex, sensexIndex]);

  const companiesData = useMemo(() => {
    return selectedIndex === 'NIFTY' ? niftyCompanies : sensexCompanies;
  }, [selectedIndex, niftyCompanies, sensexCompanies]);

  const tickers = useMemo(() => {
    const uniqueTickers = new Set(companiesData.map(d => d.Ticker));
    return Array.from(uniqueTickers).filter(t => t).sort();
  }, [companiesData]);

  const filteredIndexData = useMemo(() => {
    if (!selectedCrisis) return indexData;
    return indexData.filter(d => 
      d.Date >= selectedCrisis.startDate && d.Date <= selectedCrisis.endDate
    );
  }, [indexData, selectedCrisis]);

  const filteredCompaniesData = useMemo(() => {
    if (!selectedCrisis) return companiesData;
    return companiesData.filter(d => 
      d.Date >= selectedCrisis.startDate && d.Date <= selectedCrisis.endDate
    );
  }, [companiesData, selectedCrisis]);

  const selectedTickerData = useMemo(() => {
    if (!selectedTicker) return [];
    return filteredCompaniesData.filter(d => d.Ticker === selectedTicker);
  }, [filteredCompaniesData, selectedTicker]);

  const marketMetrics = useMemo((): MarketMetrics => {
    const latestData = new Map<string, CompanyDataPoint>();
    companiesData.forEach(d => {
      const existing = latestData.get(d.Ticker);
      if (!existing || d.Date > existing.Date) {
        latestData.set(d.Ticker, d);
      }
    });

    const latestPoints = Array.from(latestData.values());
    const aboveSMA50 = latestPoints.filter(d => d.SMA_50 && d.Close > d.SMA_50).length;
    const marketBreadth = latestPoints.length > 0 ? (aboveSMA50 / latestPoints.length) * 100 : 0;

    const recentIndex = indexData.slice(-252);
    const returns = recentIndex.slice(1).map((d, i) => 
      (d.Close - recentIndex[i].Close) / recentIndex[i].Close * 100
    );
    const currentVolatility = returns.length > 0 
      ? Math.sqrt(returns.slice(-20).reduce((sum, r) => sum + r * r, 0) / 20)
      : 0;
    const historicalVolatility = returns.length > 0
      ? Math.sqrt(returns.reduce((sum, r) => sum + r * r, 0) / returns.length)
      : 0;

    return {
      marketBreadth,
      avgRecoveryDays: 0,
      currentVolatility,
      historicalVolatility,
      volatilityRatio: historicalVolatility > 0 ? currentVolatility / historicalVolatility : 1,
    };
  }, [indexData, companiesData]);

  const stockResilienceData = useMemo((): StockResilienceData[] => {
    const dataByTicker = new Map<string, CompanyDataPoint[]>();
    filteredCompaniesData.forEach(d => {
      if (!dataByTicker.has(d.Ticker)) {
        dataByTicker.set(d.Ticker, []);
      }
      dataByTicker.get(d.Ticker)!.push(d);
    });

    return Array.from(dataByTicker.entries()).map(([ticker, data]) => {
      data.sort((a, b) => a.Date.localeCompare(b.Date));
      
      if (data.length === 0) {
        return { ticker, maxDrawdown: 0, totalRecovery: 0, recoveryDays: null, currentPrice: 0, rsi: null, status: 'Lagging' as const };
      }

      let peak = data[0].Close;
      let maxDrawdown = 0;
      let troughIdx = 0;
      let troughPrice = data[0].Close;

      data.forEach((d, i) => {
        if (d.Close > peak) peak = d.Close;
        const drawdown = (peak - d.Close) / peak * 100;
        if (drawdown > maxDrawdown) {
          maxDrawdown = drawdown;
          troughIdx = i;
          troughPrice = d.Close;
        }
      });

      const currentPrice = data[data.length - 1].Close;
      const totalRecovery = troughPrice > 0 ? ((currentPrice - troughPrice) / troughPrice) * 100 : 0;

      let recoveryDays: number | null = null;
      const preCrisisPeak = Math.max(...data.slice(0, troughIdx + 1).map(d => d.Close));
      for (let i = troughIdx + 1; i < data.length; i++) {
        if (data[i].Close >= preCrisisPeak) {
          recoveryDays = i - troughIdx;
          break;
        }
      }

      const latestRsi = data[data.length - 1].RSI_14;
      const latestSma50 = data[data.length - 1].SMA_50;
      
      let status: 'Leading' | 'Lagging' | 'Recovered' = 'Lagging';
      if (latestRsi && latestSma50) {
        if (currentPrice > latestSma50 && latestRsi > 50) {
          status = 'Leading';
        } else if (recoveryDays !== null) {
          status = 'Recovered';
        }
      }

      return {
        ticker,
        maxDrawdown,
        totalRecovery,
        recoveryDays,
        currentPrice,
        rsi: latestRsi,
        status,
      };
    });
  }, [filteredCompaniesData]);

  const normalizedChartData = useMemo((): NormalizedChartData[] => {
    if (!selectedTicker || selectedTickerData.length === 0 || filteredIndexData.length === 0) {
      return [];
    }

    const stockByDate = new Map(selectedTickerData.map(d => [d.Date, d]));
    const indexByDate = new Map(filteredIndexData.map(d => [d.Date, d]));

    const allDates = Array.from(new Set([
      ...selectedTickerData.map(d => d.Date),
      ...filteredIndexData.map(d => d.Date),
    ])).sort();

    const commonDates = allDates.filter(d => stockByDate.has(d) && indexByDate.has(d));
    if (commonDates.length === 0) return [];

    const baseStock = stockByDate.get(commonDates[0])!.Close;
    const baseIndex = indexByDate.get(commonDates[0])!.Close;

    return commonDates.map(date => {
      const stock = stockByDate.get(date)!;
      const index = indexByDate.get(date)!;
      return {
        date,
        stock: (stock.Close / baseStock) * 100,
        index: (index.Close / baseIndex) * 100,
        stockPrice: stock.Close,
        indexPrice: index.Close,
      };
    });
  }, [selectedTicker, selectedTickerData, filteredIndexData]);

  const smartInsight = useMemo(() => {
    if (!selectedTicker || !selectedCrisis || selectedTickerData.length === 0) {
      return null;
    }

    const stockResilience = stockResilienceData.find(s => s.ticker === selectedTicker);
    if (!stockResilience) return null;

    const indexPrices = filteredIndexData.map(d => d.Close);
    if (indexPrices.length === 0) return null;

    let indexPeak = indexPrices[0];
    let indexMaxDrawdown = 0;
    indexPrices.forEach(price => {
      if (price > indexPeak) indexPeak = price;
      const dd = (indexPeak - price) / indexPeak * 100;
      if (dd > indexMaxDrawdown) indexMaxDrawdown = dd;
    });

    return {
      crisisName: selectedCrisis.name,
      stockTicker: selectedTicker,
      stockDrawdown: stockResilience.maxDrawdown.toFixed(1),
      indexDrawdown: indexMaxDrawdown.toFixed(1),
      recoveryDays: stockResilience.recoveryDays,
      totalRecovery: stockResilience.totalRecovery.toFixed(1),
    };
  }, [selectedTicker, selectedCrisis, selectedTickerData, stockResilienceData, filteredIndexData]);

  return {
    isLoading,
    error,
    selectedIndex,
    setSelectedIndex,
    selectedTicker,
    setSelectedTicker,
    selectedCrisis,
    setSelectedCrisis,
    tickers,
    indexData: filteredIndexData,
    companiesData: filteredCompaniesData,
    selectedTickerData,
    marketMetrics,
    stockResilienceData,
    normalizedChartData,
    smartInsight,
  };
}
