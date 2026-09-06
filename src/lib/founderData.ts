export type StartupStage = 'IDEA' | 'DEVELOPMENT' | 'BETA' | 'GROWTH' | 'MATURE';

export interface PlayerStartup {
  id: string;
  name: string;
  industry: string;
  stage: StartupStage;
  
  // Metrics
  cash: number;
  revenue: number; // Monthly
  users: number;
  
  // Team
  developers: number;
  marketers: number;
  
  // Status
  productQuality: number; // 0-100
  brandAwareness: number; // 0-100
  valuation: number;
  
  // Dates
  foundedDate: string; // "Y1 M2 D4"
  daysActive: number;
}

export interface StartupIndustryConfig {
  id: string;
  name: string;
  description: string;
  minSeed: number;
  devSalary: number;
  marketerSalary: number;
  arpu: number; // Average Revenue Per User (monthly)
  viralFactor: number; // Multiplier for user growth
  devDifficulty: number; // How hard it is to increase product quality
}

export const STARTUP_INDUSTRIES: StartupIndustryConfig[] = [
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    description: 'High dev costs, massive valuations, moderate ARPU.',
    minSeed: 250000,
    devSalary: 12000,
    marketerSalary: 7000,
    arpu: 25,
    viralFactor: 1.2,
    devDifficulty: 0.8
  },
  {
    id: 'saas',
    name: 'B2B SaaS',
    description: 'Steady growth, high ARPU, reliable exits.',
    minSeed: 50000,
    devSalary: 9000,
    marketerSalary: 8000,
    arpu: 150,
    viralFactor: 0.8,
    devDifficulty: 1.0
  },
  {
    id: 'fintech',
    name: 'FinTech',
    description: 'Regulatory hurdles, but massive scaling potential.',
    minSeed: 500000,
    devSalary: 11000,
    marketerSalary: 9000,
    arpu: 45,
    viralFactor: 1.0,
    devDifficulty: 0.7
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Hit-driven. Huge viral potential, lower ARPU.',
    minSeed: 25000,
    devSalary: 8000,
    marketerSalary: 6000,
    arpu: 12,
    viralFactor: 1.8,
    devDifficulty: 1.2
  },
  {
    id: 'healthtech',
    name: 'HealthTech',
    description: 'Capital intensive, low virality, but high valuations.',
    minSeed: 1000000,
    devSalary: 14000,
    marketerSalary: 8000,
    arpu: 200,
    viralFactor: 0.5,
    devDifficulty: 0.5
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    description: 'Easy to start, highly dependent on marketing.',
    minSeed: 15000,
    devSalary: 7000,
    marketerSalary: 5000,
    arpu: 35,
    viralFactor: 1.1,
    devDifficulty: 1.5
  }
];
