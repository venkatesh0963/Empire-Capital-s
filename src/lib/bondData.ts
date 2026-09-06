export interface Bond {
  id: string;
  name: string;
  faceValue: number;
  yieldRate: number; // Annual yield
  durationYears: number; // Years until maturity
  riskRating: 'AAA' | 'BBB' | 'Junk';
}

export const INITIAL_BONDS: Bond[] = [
  { id: 'treasury_1y', name: '1-Year Govt Treasury', faceValue: 10000, yieldRate: 0.04, durationYears: 1, riskRating: 'AAA' },
  { id: 'treasury_5y', name: '5-Year Govt Treasury', faceValue: 10000, yieldRate: 0.05, durationYears: 5, riskRating: 'AAA' },
  { id: 'corp_aaa', name: 'MegaCorp Stable Bond', faceValue: 50000, yieldRate: 0.065, durationYears: 3, riskRating: 'AAA' },
  { id: 'corp_junk', name: 'High-Yield Junk Bond', faceValue: 20000, yieldRate: 0.12, durationYears: 2, riskRating: 'Junk' },
];
