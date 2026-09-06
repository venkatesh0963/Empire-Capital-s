export type BusinessIndustry = 'Retail' | 'Software' | 'Manufacturing' | 'Services' | 'SaaS' | 'Franchise' | 'Agriculture' | 'Energy' | 'Infrastructure';

export interface BusinessTemplate {
  industry: BusinessIndustry;
  minInvestment: number;
  baseRevenue: number; // Base monthly revenue
  baseCOGS: number; // Cost of goods sold as a percentage (0.0 to 1.0)
  basePayroll: number;
  description: string;
}

export const BUSINESS_TEMPLATES: Record<BusinessIndustry, BusinessTemplate> = {
  'Retail': { industry: 'Retail', minInvestment: 50000, baseRevenue: 5000, baseCOGS: 0.60, basePayroll: 1500 , description: 'A lucrative venture in Retail' },
  'Software': { industry: 'Software', minInvestment: 100000, baseRevenue: 8000, baseCOGS: 0.15, basePayroll: 4000 , description: 'A lucrative venture in Software' },
  'Manufacturing': { industry: 'Manufacturing', minInvestment: 500000, baseRevenue: 15000, baseCOGS: 0.45, basePayroll: 3000 , description: 'A lucrative venture in Manufacturing' },
  'Services': { industry: 'Services', minInvestment: 10000, baseRevenue: 4000, baseCOGS: 0.20, basePayroll: 2000 , description: 'A lucrative venture in Services' },
  'SaaS': { industry: 'SaaS', minInvestment: 150000, baseRevenue: 12000, baseCOGS: 0.10, basePayroll: 5000 , description: 'A lucrative venture in SaaS' },
  'Franchise': { industry: 'Franchise', minInvestment: 80000, baseRevenue: 7000, baseCOGS: 0.50, basePayroll: 2000 , description: 'A lucrative venture in Franchise' },
  'Agriculture': { industry: 'Agriculture', minInvestment: 300000, baseRevenue: 20000, baseCOGS: 0.40, basePayroll: 1500 , description: 'A lucrative venture in Agriculture' },
  'Energy': { industry: 'Energy', minInvestment: 2000000, baseRevenue: 50000, baseCOGS: 0.35, basePayroll: 8000 , description: 'A lucrative venture in Energy' },
  'Infrastructure': { industry: 'Infrastructure', minInvestment: 5000000, baseRevenue: 100000, baseCOGS: 0.30, basePayroll: 10000 , description: 'A lucrative venture in Infrastructure' },
};

export interface OwnedBusiness {
  executives?: any[];
  id: string;
  name: string;
  industry: BusinessIndustry;
  level: number; // 1 to 7
  employees: number;
  marketingBudget: number; // Monthly marketing spend
  productPriceMultiplier: number; // 1.0 is default. >1 means premium, <1 means discount.
  
  // Dynamic monthly stats calculated by the engine
  lastMonthRevenue: number;
  lastMonthExpenses: number;
  lastMonthProfit: number;
  customerSatisfaction: number; // 0 to 100
  brandValue: number;
}
