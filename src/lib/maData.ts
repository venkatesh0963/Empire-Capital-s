import { BusinessIndustry, BUSINESS_TEMPLATES } from './businessData';

export interface AcquisitionTarget {
  id: string;
  name: string;
  industry: BusinessIndustry;
  level: number;
  employees: number;
  lastMonthRevenue: number;
  lastMonthProfit: number;
  valuation: number;
  askingPrice: number;
  sellerMotivation: 'Desperate' | 'Neutral' | 'Greedy';
  brandValue: number;
  dueDiligence: {
    debt: number;
    customers: number;
    growth: number;
    risks: string[];
  };
}

const COMPANY_NAMES = {
  'Technology': ['TechFlow', 'CyberNova', 'DataSync', 'CloudStack', 'Aura Systems'],
  'Real Estate': ['Apex Holdings', 'Meridian Properties', 'Stone & Co', 'Urban Edge', 'Skyline Trust'],
  'Retail': ['FreshMart', 'NextGen Apparel', 'Value Plus', 'Prime Goods', 'Echo Retail'],
  'Manufacturing': ['SteelCore', 'Titan Industries', 'Global Dynamics', 'Precision Forge', 'AeroMotive'],
  'Services': ['Elite Consulting', 'ProCare Services', 'Summit Solutions', 'Nexus Agency', 'BrightPath'],
  'Energy': ['Solaris Grid', 'Volt Energy', 'NeoPower', 'Terra Resources', 'GreenFlow']
};

export function generateAcquisitionTarget(): AcquisitionTarget {
  const industries = Object.keys(BUSINESS_TEMPLATES) as BusinessIndustry[];
  const industry = industries[Math.floor(Math.random() * industries.length)];
  const nameChoices = COMPANY_NAMES[industry] || ['Acme Corp'];
  const name = nameChoices[Math.floor(Math.random() * nameChoices.length)] + ' ' + ['LLC', 'Inc', 'Group', 'Partners'][Math.floor(Math.random() * 4)];
  
  const level = Math.floor(Math.random() * 5) + 2; // Level 2-6
  const employees = level * (Math.floor(Math.random() * 10) + 5);
  
  const template = BUSINESS_TEMPLATES[industry];
  const revenue = template.baseRevenue * level * employees * 0.5 * (0.8 + Math.random() * 0.4);
  const profit = revenue * (1 - template.baseCOGS - template.basePayroll) * (0.8 + Math.random() * 0.4);
  
  const valuation = profit * 12 * (3 + Math.random() * 2); // 3-5x revenue multiple
  
  const motivations: ('Desperate' | 'Neutral' | 'Greedy')[] = ['Desperate', 'Neutral', 'Neutral', 'Greedy'];
  const sellerMotivation = motivations[Math.floor(Math.random() * motivations.length)];
  
  let askMultiplier = 1.1; // Neutral asks 10% more
  if (sellerMotivation === 'Desperate') askMultiplier = 0.9;
  if (sellerMotivation === 'Greedy') askMultiplier = 1.3;

  const possibleRisks = [
     'High employee turnover',
     'Supplier dependency',
     'Aging equipment',
     'Pending lawsuit',
     'Outdated brand identity',
     'High debt burden',
     'Toxic company culture',
     'Unreliable revenue streams'
  ];
  
  // Assign 0-3 random risks
  const numRisks = Math.floor(Math.random() * 4);
  const risks = [...possibleRisks].sort(() => 0.5 - Math.random()).slice(0, numRisks).map(r => `⚠️ ${r}`);

  return {
    id: `ma_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    name,
    industry,
    level,
    employees,
    lastMonthRevenue: revenue,
    lastMonthProfit: profit,
    valuation,
    askingPrice: valuation * askMultiplier,
    sellerMotivation,
    brandValue: Math.floor(Math.random() * 100),
    dueDiligence: {
       debt: valuation * (Math.random() * 0.4),
       customers: Math.floor(revenue / (Math.random() * 50 + 10)),
       growth: (Math.random() * 0.2) - 0.05,
       risks
    }
  };
}
