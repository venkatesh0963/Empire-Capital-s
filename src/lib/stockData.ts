export interface StockCompany {
  symbol: string;
  name: string;
  sector: string;
  basePrice: number;
  volatility: number; // How much it swings (0.01 to 0.1)
  dividendYield: number; // Annual dividend yield percentage (e.g., 0.02 = 2%)
  riskRating: 'Low' | 'Medium' | 'High';
}

export const INITIAL_STOCKS: StockCompany[] = [
  { symbol: 'TNV', name: 'TechNova', sector: 'Technology', basePrice: 120.50, volatility: 0.04, dividendYield: 0.015, riskRating: 'High' },
  { symbol: 'CLD', name: 'CloudCore', sector: 'Technology', basePrice: 85.00, volatility: 0.035, dividendYield: 0.01, riskRating: 'Medium' },
  { symbol: 'GRG', name: 'GreenGrid', sector: 'Energy', basePrice: 45.20, volatility: 0.025, dividendYield: 0.035, riskRating: 'Medium' },
  { symbol: 'HTX', name: 'HealthAxis', sector: 'Healthcare', basePrice: 150.00, volatility: 0.015, dividendYield: 0.025, riskRating: 'Low' },
  { symbol: 'MGM', name: 'MegaMart', sector: 'Retail', basePrice: 65.80, volatility: 0.02, dividendYield: 0.04, riskRating: 'Low' },
  { symbol: 'FNC', name: 'FinCore', sector: 'Banking', basePrice: 95.00, volatility: 0.03, dividendYield: 0.045, riskRating: 'Medium' },
  { symbol: 'ATC', name: 'AutoSphere', sector: 'Automotive', basePrice: 110.00, volatility: 0.045, dividendYield: 0.02, riskRating: 'High' },
];

export interface StockCatalyst {
  id: string;
  symbol: string;
  headline: string;
  impactMultiplier: number; // e.g. 1.15 for +15%, 0.8 for -20%
}

export const STOCK_CATALYSTS: StockCatalyst[] = [
  { id: 'cat_tnv_up', symbol: 'TNV', headline: '🔴 BREAKING: TechNova announces revolutionary quantum processor.', impactMultiplier: 1.18 },
  { id: 'cat_tnv_down', symbol: 'TNV', headline: '🔴 BREAKING: Massive data breach at TechNova. CEO resigns.', impactMultiplier: 0.75 },
  { id: 'cat_cld_up', symbol: 'CLD', headline: '🔴 BREAKING: CloudCore wins $10B government defense contract.', impactMultiplier: 1.12 },
  { id: 'cat_cld_down', symbol: 'CLD', headline: '🔴 BREAKING: CloudCore servers down globally for 48 hours.', impactMultiplier: 0.88 },
  { id: 'cat_grg_up', symbol: 'GRG', headline: '🔴 BREAKING: GreenGrid discovers new highly efficient solar material.', impactMultiplier: 1.15 },
  { id: 'cat_htx_up', symbol: 'HTX', headline: '🔴 BREAKING: HealthAxis FDA approval for highly anticipated drug.', impactMultiplier: 1.20 },
  { id: 'cat_htx_down', symbol: 'HTX', headline: '🔴 BREAKING: HealthAxis drug recalled due to severe side effects.', impactMultiplier: 0.70 },
  { id: 'cat_mgm_up', symbol: 'MGM', headline: '🔴 BREAKING: MegaMart reports record-breaking holiday earnings.', impactMultiplier: 1.08 },
  { id: 'cat_mgm_down', symbol: 'MGM', headline: '🔴 BREAKING: MegaMart faces massive labor strike across 500 stores.', impactMultiplier: 0.90 },
  { id: 'cat_fnc_down', symbol: 'FNC', headline: '🔴 BREAKING: FinCore under investigation for money laundering.', impactMultiplier: 0.65 },
  { id: 'cat_atc_up', symbol: 'ATC', headline: '🔴 BREAKING: AutoSphere unveils self-driving car that actually works.', impactMultiplier: 1.25 },
];
