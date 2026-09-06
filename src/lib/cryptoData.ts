export interface CryptoCoin {
  symbol: string;
  name: string;
  basePrice: number;
  volatility: number; // Crypto is much more volatile than stocks (e.g., 0.05 to 0.20)
  riskRating: 'Extreme' | 'High' | 'Medium';
}

export const INITIAL_CRYPTO: CryptoCoin[] = [
  { symbol: 'BTCX', name: 'BitCore', basePrice: 45000, volatility: 0.08, riskRating: 'Medium' },
  { symbol: 'ETHN', name: 'EtherNova', basePrice: 2800, volatility: 0.12, riskRating: 'High' },
  { symbol: 'SOLR', name: 'Solaris', basePrice: 120, volatility: 0.18, riskRating: 'High' },
  { symbol: 'DOGE', name: 'DogeMeme', basePrice: 0.15, volatility: 0.25, riskRating: 'Extreme' },
];
