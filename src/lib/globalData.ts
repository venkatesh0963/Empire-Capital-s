export interface GlobalCity {
  id: string;
  name: string;
  country: string;
  flag: string;
  unlockCost: number;
  taxRate: number; // Applied to corporate profits
  salaryMultiplier: number; // Multiplies employee costs
  realEstateMultiplier: number; // Multiplies property costs/rents
  economicRisk: 'Low' | 'Medium' | 'High';
  description: string;
}

export const GLOBAL_CITIES: GlobalCity[] = [
  {
    id: 'nyc',
    name: 'New York',
    country: 'USA',
    flag: '🇺🇸',
    unlockCost: 5000000,
    taxRate: 0.28,
    salaryMultiplier: 1.5,
    realEstateMultiplier: 2.0,
    economicRisk: 'Medium',
    description: 'The financial capital of the world. High salaries, high taxes, but massive revenue potential.'
  },
  {
    id: 'ldn',
    name: 'London',
    country: 'UK',
    flag: '🇬🇧',
    unlockCost: 4000000,
    taxRate: 0.25,
    salaryMultiplier: 1.3,
    realEstateMultiplier: 1.8,
    economicRisk: 'Medium',
    description: 'A global banking hub bridging the US and Europe.'
  },
  {
    id: 'tyo',
    name: 'Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    unlockCost: 8000000,
    taxRate: 0.30,
    salaryMultiplier: 1.2,
    realEstateMultiplier: 2.5,
    economicRisk: 'Low',
    description: 'Stable, low risk, high real estate costs. Perfect for safe expansion.'
  },
  {
    id: 'sin',
    name: 'Singapore',
    country: 'Singapore',
    flag: '🇸🇬',
    unlockCost: 10000000,
    taxRate: 0.17,
    salaryMultiplier: 1.4,
    realEstateMultiplier: 1.9,
    economicRisk: 'Low',
    description: 'A wealth haven with exceptionally low corporate tax rates.'
  },
  {
    id: 'dxb',
    name: 'Dubai',
    country: 'UAE',
    flag: '🇦🇪',
    unlockCost: 15000000,
    taxRate: 0.09,
    salaryMultiplier: 1.1,
    realEstateMultiplier: 1.5,
    economicRisk: 'Medium',
    description: 'Virtually no taxes. The ultimate destination for late-game wealth accumulation.'
  },
  {
    id: 'bom',
    name: 'Mumbai',
    country: 'India',
    flag: '🇮🇳',
    unlockCost: 2000000,
    taxRate: 0.25,
    salaryMultiplier: 0.4,
    realEstateMultiplier: 0.8,
    economicRisk: 'High',
    description: 'Incredible labor arbitrage opportunities due to low salary multipliers.'
  },
  {
    id: 'par',
    name: 'Paris',
    country: 'France',
    flag: '🇫🇷',
    unlockCost: 3500000,
    taxRate: 0.33,
    salaryMultiplier: 1.2,
    realEstateMultiplier: 1.6,
    economicRisk: 'Medium',
    description: 'High taxes, but excellent for luxury and fashion businesses.'
  },
  {
    id: 'ber',
    name: 'Berlin',
    country: 'Germany',
    flag: '🇩🇪',
    unlockCost: 3000000,
    taxRate: 0.30,
    salaryMultiplier: 1.1,
    realEstateMultiplier: 1.2,
    economicRisk: 'Low',
    description: 'The industrial heart of Europe.'
  },
  {
    id: 'syd',
    name: 'Sydney',
    country: 'Australia',
    flag: '🇦🇺',
    unlockCost: 4500000,
    taxRate: 0.30,
    salaryMultiplier: 1.3,
    realEstateMultiplier: 1.7,
    economicRisk: 'Low',
    description: 'A stable resource-heavy economy.'
  },
  {
    id: 'yto',
    name: 'Toronto',
    country: 'Canada',
    flag: '🇨🇦',
    unlockCost: 2500000,
    taxRate: 0.26,
    salaryMultiplier: 1.0,
    realEstateMultiplier: 1.4,
    economicRisk: 'Low',
    description: 'A rapidly growing tech and finance hub.'
  }
];
