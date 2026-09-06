export type IPType = 'Patent' | 'Book Rights' | 'Music Catalog' | 'Software License';

export interface IntellectualProperty {
  id: string;
  name: string;
  type: IPType;
  basePrice: number;
  monthlyRoyalty: number; // Passive income generated
  popularityDecay: number; // Royalties might decay over time unless it's a classic
}

export const INITIAL_IP: IntellectualProperty[] = [
  { id: 'ip_1', name: 'AI Optimization Algorithm', type: 'Patent', basePrice: 150000, monthlyRoyalty: 2500, popularityDecay: 0.05 },
  { id: 'ip_2', name: 'The Midnight Chronicles (Book)', type: 'Book Rights', basePrice: 45000, monthlyRoyalty: 600, popularityDecay: 0.10 },
  { id: 'ip_3', name: '80s Synthwave Hits', type: 'Music Catalog', basePrice: 350000, monthlyRoyalty: 4000, popularityDecay: 0.02 },
  { id: 'ip_4', name: 'Cloud Server Utility', type: 'Software License', basePrice: 85000, monthlyRoyalty: 1200, popularityDecay: 0.08 },
];

export interface OwnedIP {
  ipId: string;
  purchasePrice: number;
  currentRoyalty: number;
}

export type CollectibleType = 'Art' | 'Coin' | 'Trading Card' | 'Wine' | 'Classic Car' | 'Watch' | 'Artifact';

export interface Collectible {
  id: string;
  name: string;
  type: CollectibleType;
  basePrice: number;
  appreciationRate: number; // Annual appreciation
  volatility: number;
  rarity: number; // 1 to 5 stars
}

export const INITIAL_COLLECTIBLES: Collectible[] = [
  { id: 'col_1', name: 'First Edition Charizard', type: 'Trading Card', basePrice: 350000, appreciationRate: 0.12, volatility: 0.15, rarity: 4 },
  { id: 'col_2', name: '1933 Double Eagle', type: 'Coin', basePrice: 7500000, appreciationRate: 0.05, volatility: 0.02, rarity: 5 },
  { id: 'col_3', name: 'Château Margaux 1787', type: 'Wine', basePrice: 225000, appreciationRate: 0.08, volatility: 0.05, rarity: 4 },
  { id: 'col_4', name: 'Abstract Canvas #4', type: 'Art', basePrice: 50000, appreciationRate: 0.06, volatility: 0.10, rarity: 3 },
  { id: 'col_5', name: 'Phantom X', type: 'Classic Car', basePrice: 2800000, appreciationRate: 0.08, volatility: 0.04, rarity: 5 },
  { id: 'col_6', name: 'Patek Celestial', type: 'Watch', basePrice: 300000, appreciationRate: 0.07, volatility: 0.03, rarity: 4 },
  { id: 'col_7', name: 'Roman Gladiator Gladius', type: 'Artifact', basePrice: 120000, appreciationRate: 0.04, volatility: 0.05, rarity: 5 },
  { id: 'col_8', name: 'Original Apple-1 Computer', type: 'Artifact', basePrice: 1500000, appreciationRate: 0.09, volatility: 0.08, rarity: 5 },
  { id: 'col_9', name: 'Mona Lisa Replica (18th C)', type: 'Art', basePrice: 15000, appreciationRate: 0.03, volatility: 0.12, rarity: 2 },
  { id: 'col_10', name: '1962 Ferrari 250 GTO', type: 'Classic Car', basePrice: 48000000, appreciationRate: 0.15, volatility: 0.05, rarity: 5 }
];

export interface OwnedCollectible {
  collectibleId: string;
  purchasePrice: number;
  currentValue: number;
}
