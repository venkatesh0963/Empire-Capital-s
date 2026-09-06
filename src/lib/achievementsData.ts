export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'diamond' | 'crown';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  tier: AchievementTier;
  category: 'networth' | 'business' | 'realestate' | 'market' | 'general';
  reward: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  // NET WORTH
  { id: 'nw_150k', name: 'Getting Started', description: 'Reach $150,000 net worth.', tier: 'bronze', category: 'networth', reward: 5000 },
  { id: 'nw_1m', name: 'Millionaire', description: 'Reach $1,000,000 net worth.', tier: 'gold', category: 'networth', reward: 50000 },
  { id: 'nw_10m', name: 'Multi-Millionaire', description: 'Reach $10,000,000 net worth.', tier: 'diamond', category: 'networth', reward: 250000 },
  { id: 'nw_100m', name: 'Centimillionaire', description: 'Reach $100,000,000 net worth.', tier: 'diamond', category: 'networth', reward: 2500000 },
  { id: 'nw_1b', name: 'Billionaire', description: 'Reach $1,000,000,000 net worth.', tier: 'crown', category: 'networth', reward: 25000000 },

  // PASSIVE INCOME
  { id: 'pi_1k', name: 'Passive Earner', description: 'Earn $1,000/month in passive income.', tier: 'bronze', category: 'networth', reward: 2500 },
  { id: 'pi_25k', name: 'Financial Freedom', description: 'Earn $25,000/month in passive income.', tier: 'silver', category: 'networth', reward: 25000 },
  { id: 'pi_100k', name: 'Passive Mogul', description: 'Earn $100,000/month in passive income.', tier: 'gold', category: 'networth', reward: 100000 },

  // BUSINESS
  { id: 'biz_1', name: 'Entrepreneur', description: 'Start your first business.', tier: 'bronze', category: 'business', reward: 5000 },
  { id: 'biz_5', name: 'Business Owner', description: 'Own 5 businesses simultaneously.', tier: 'silver', category: 'business', reward: 25000 },
  { id: 'biz_10', name: 'Empire Builder', description: 'Own 10 businesses simultaneously.', tier: 'gold', category: 'business', reward: 100000 },
  { id: 'biz_ipo', name: 'Going Public', description: 'Have a startup successfully IPO.', tier: 'diamond', category: 'business', reward: 500000 },

  // REAL ESTATE
  { id: 're_1', name: 'First Property', description: 'Buy your first real estate property.', tier: 'bronze', category: 'realestate', reward: 5000 },
  { id: 're_10', name: 'Landlord', description: 'Own 10 properties simultaneously.', tier: 'silver', category: 'realestate', reward: 50000 },
  { id: 're_10m', name: 'Property Mogul', description: 'Own $10,000,000 in real estate.', tier: 'gold', category: 'realestate', reward: 250000 },

  // MARKETS
  { id: 'mkt_1', name: 'First Investment', description: 'Buy your first stock or crypto.', tier: 'bronze', category: 'market', reward: 1000 },
  { id: 'mkt_1m', name: 'Market Master', description: 'Hold $1,000,000 in liquid markets (Stocks/Crypto/Bonds).', tier: 'gold', category: 'market', reward: 50000 },

  // GENERAL
  { id: 'debt_5m', name: 'Banker\'s Friend', description: 'Hold over $5,000,000 in bank debt.', tier: 'silver', category: 'general', reward: 50000 },
  { id: 'lux_jet', name: 'Sky High', description: 'Purchase a Private Jet.', tier: 'diamond', category: 'general', reward: 500000 }
];
