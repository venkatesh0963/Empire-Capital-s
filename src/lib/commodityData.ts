export interface Commodity {
  symbol: string;
  name: string;
  basePrice: number;
  volatility: number;
  economySensitivity: number; // How much it reacts to boom/bust (1.0 = normal, >1 = high)
}

export const INITIAL_COMMODITIES: Commodity[] = [
  { symbol: 'GLD', name: 'Gold', basePrice: 2000, volatility: 0.02, economySensitivity: -1.5 }, // Spikes in crises
  { symbol: 'OIL', name: 'Crude Oil', basePrice: 80, volatility: 0.05, economySensitivity: 2.0 },  // Crashes in crises, booms in growth
  { symbol: 'WHT', name: 'Wheat', basePrice: 6, volatility: 0.03, economySensitivity: 0.5 },
  { symbol: 'CPR', name: 'Copper', basePrice: 4, volatility: 0.04, economySensitivity: 1.5 }, // Industrial demand
];

export const initialCommodityPrices: Record<string, number> = {};
export const initialCommodityHistory: Record<string, number[]> = {};

INITIAL_COMMODITIES.forEach(c => {
  initialCommodityPrices[c.symbol] = c.basePrice;
  initialCommodityHistory[c.symbol] = [c.basePrice];
});
