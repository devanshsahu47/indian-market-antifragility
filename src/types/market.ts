export interface IndexDataPoint {
  Date: string;
  Close: number;
  High: number;
  Low: number;
  Open: number;
  Volume: number;
  SMA_20: number | null;
  SMA_50: number | null;
  MACD: number | null;
  Signal_Line: number | null;
  RSI_14: number | null;
  BB_Upper: number | null;
  BB_Lower: number | null;
}

export interface CompanyDataPoint extends IndexDataPoint {
  Ticker: string;
}

export type IndexType = 'NIFTY' | 'SENSEX';

export interface CrisisPreset {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface MarketMetrics {
  marketBreadth: number;
  avgRecoveryDays: number;
  currentVolatility: number;
  historicalVolatility: number;
  volatilityRatio: number;
}

export interface StockResilienceData {
  ticker: string;
  maxDrawdown: number;
  totalRecovery: number;
  recoveryDays: number | null;
  currentPrice: number;
  rsi: number | null;
  status: 'Leading' | 'Lagging' | 'Recovered';
}

export interface NormalizedChartData {
  date: string;
  stock: number;
  index: number;
  stockPrice: number;
  indexPrice: number;
}

export const CRISIS_PRESETS: CrisisPreset[] = [
  {
    id: '2008-crisis',
    name: '2008 GFC',
    startDate: '2008-01-01',
    endDate: '2009-12-31',
    description: 'Global Financial Crisis',
  },
  {
    id: '2020-covid',
    name: '2020 COVID',
    startDate: '2020-02-01',
    endDate: '2021-12-31',
    description: 'COVID-19 Pandemic Crash',
  },
  {
    id: '2024-momentum',
    name: '2024-25',
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    description: 'Current Momentum Analysis',
  },
];
