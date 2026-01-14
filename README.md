# 📈 Market Resilience Executive Report: Indian Equity Antifragility

A professional-grade financial analytics dashboard built to analyze the resilience and recovery velocity of the Indian Stock Market (NIFTY 50 & SENSEX) during historic systemic crises. Designed with a Business Intelligence (BI) aesthetic to provide actionable insights into asset "Antifragility."

**Live Demo:** [https://market-antifragile.lovable.app]

---

## 🎯 Project Objective & Goal
The primary goal of this platform is to move beyond simple price tracking. It aims to quantify **Market Resilience**—the ability of an asset to withstand a crash and the speed at which it reclaims its previous peak. 

By analyzing the 2008 GFC and the 2020 COVID-19 crash, this tool helps investors distinguish between:
1. **Resilient Assets:** Those that fall less than the index and recover faster.
2. **Laggards:** Those that suffer permanent capital impairment or extended recovery timelines.

## 📂 Dataset Overview
The dashboard processes approximately **400,000+ data points** sourced from historical NSE/BSE records, optimized for client-side browser performance:
- **Indices:** NIFTY 50 & SENSEX (LITE daily OHLCV data).
- **Constituents:** Top 50 blue-chip stocks (Reliance, HDFC Bank, TCS, etc.).
- **Time Horizon:** 20+ years of daily historical data.
- **Technical Indicators:** Pre-computed RSI (Relative Strength Index), MACD, and 50/200-day Simple Moving Averages.

---

## 📊 KPIs & Visualizations: What they tell you

### 1. The Executive KPI Strip
- **Recovery Days:** Tells you the exact count of trading sessions it took for the stock to return to its pre-crash high.
- **Antifragility Score:** A relative metric comparing the stock's maximum drawdown against the Index's drawdown.
- **Relative Volatility:** Measures how much "sharper" the stock's movements are compared to the benchmark during stress periods.

### 2. Comparative Trajectory Chart (Normalized)
- **The Story:** This chart re-bases both the Stock and the Index to a value of 100 at the start of a crisis. 
- **Insight:** It visually proves who "won" the recovery. If the blue line (Stock) stays above the grey line (Index), the stock showed superior relative strength.

### 3. Resilience Scatter Plot
- **The Story:** Plots every stock in the index on a grid of 'Max Drawdown' vs. 'Recovery %'.
- **Insight:** Top-left quadrant stocks are the "Antifragile" leaders—they fell the least and gained the most.

### 4. Technical Momentum Heatmap
- **The Story:** Uses RSI_14 to color-code stocks from Oversold (Green) to Overbought (Red).
- **Insight:** Identifies if a recovery is "healthy" or if the stock is becoming overextended.

---

## 📉 Dashboard Insights: The Narrative
This dashboard is designed to tell a **Story of Recovery**. 

When a user selects the **"2020 COVID-19 Crash"** and **"RELIANCE.NS"**, the dashboard immediately reveals a powerful narrative:
- It shows that while the NIFTY 50 plummeted ~38%, certain leaders reclaimed their peaks in record time (under 50 days), signaling a structural shift in market leadership.
- It highlights the **"Efficiency of the V-Shape"**: By comparing recovery days across different sectors (Tech vs. Banking), the dashboard reveals which sectors act as "Defensive Anchors" for the Indian economy.
- **Charts:** Recharts (SVG-based responsive visualizations).
- **UI Components:** Shadcn/UI & Lucide Icons.
