export type LuxuryCategory = 'Watches' | 'Cars' | 'Yachts' | 'Jets' | 'Art';

export interface LuxuryItem {
  id: string;
  name: string;
  category: LuxuryCategory;
  price: number;
  monthlyMaintenance: number; // 0 for watches/art, very high for yachts/jets
  statusBoost: number; // helps with credit score, or business deals (narrative)
  depreciationRate: number; // Annual % it loses (or gains if negative)
}

export const INITIAL_LUXURY_ITEMS: LuxuryItem[] = [
  // Watches & Art (Appreciating / Stable)
  { id: 'l_watch1', name: 'Rolex Daytona', category: 'Watches', price: 35000, monthlyMaintenance: 50, statusBoost: 5, depreciationRate: -0.05 }, // Appreciates 5% a year
  { id: 'l_watch2', name: 'Patek Philippe Nautilus', category: 'Watches', price: 120000, monthlyMaintenance: 100, statusBoost: 15, depreciationRate: -0.08 },
  { id: 'l_art1', name: 'Modern Art Piece', category: 'Art', price: 500000, monthlyMaintenance: 500, statusBoost: 20, depreciationRate: -0.04 },
  
  // Cars (Depreciating)
  { id: 'l_car1', name: 'Porsche 911 GT3', category: 'Cars', price: 220000, monthlyMaintenance: 1200, statusBoost: 25, depreciationRate: 0.10 }, // Loses 10% a year
  { id: 'l_car2', name: 'Rolls Royce Phantom', category: 'Cars', price: 480000, monthlyMaintenance: 2000, statusBoost: 40, depreciationRate: 0.15 },
  { id: 'l_car3', name: 'Bugatti Chiron', category: 'Cars', price: 3200000, monthlyMaintenance: 10000, statusBoost: 100, depreciationRate: 0.05 },
  
  // Yachts (Heavy Depreciating & Maintenance)
  { id: 'l_yacht1', name: '60ft Motor Yacht', category: 'Yachts', price: 2500000, monthlyMaintenance: 15000, statusBoost: 80, depreciationRate: 0.10 },
  { id: 'l_yacht2', name: '200ft Superyacht', category: 'Yachts', price: 75000000, monthlyMaintenance: 400000, statusBoost: 500, depreciationRate: 0.08 },
  
  // Jets
  { id: 'l_jet1', name: 'Cessna Citation', category: 'Jets', price: 4500000, monthlyMaintenance: 35000, statusBoost: 150, depreciationRate: 0.08 },
  { id: 'l_jet2', name: 'Gulfstream G650', category: 'Jets', price: 65000000, monthlyMaintenance: 250000, statusBoost: 600, depreciationRate: 0.06 },
];

export interface OwnedLuxury {
  itemId: string;
  purchasePrice: number;
  currentValue: number;
  monthsOwned: number;
}
