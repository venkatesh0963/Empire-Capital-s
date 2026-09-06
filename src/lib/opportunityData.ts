export interface SpecialOpportunity {
  id: string;
  type: 'RealEstate' | 'Business' | 'Startup';
  title: string;
  description: string;
  marketValue: number;
  askingPrice: number;
  daysRemaining: number;
  financials: {
    revenue: number;
    profit: number;
    debt: number;
  };
  risks: string[];
}

export function generateOpportunity(): SpecialOpportunity {
  const types: ('RealEstate' | 'Business' | 'Startup')[] = ['RealEstate', 'Business', 'Startup'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  const id = `opp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  const daysRemaining = Math.floor(Math.random() * 10) + 5; // 5-14 days
  
  let title = '';
  let description = '';
  let marketValue = 0;
  let askingPrice = 0;
  let financials = { revenue: 0, profit: 0, debt: 0 };
  let risks: string[] = [];

  if (type === 'RealEstate') {
    title = 'Struggling Hotel Chain';
    description = 'A regional hotel chain is facing immediate bankruptcy and liquidating prime real estate.';
    marketValue = 8200000 + (Math.random() * 4000000);
    askingPrice = marketValue * 0.65; // Massive discount
    financials = { revenue: 850000, profit: -120000, debt: 4500000 };
    risks = ['⚠️ Massive deferred maintenance', '⚠️ High debt burden', '⚠️ Union strikes'];
  } else if (type === 'Business') {
    title = 'Generational Manufacturer';
    description = 'The founder is retiring abruptly and wants to offload the factory immediately without a broker.';
    marketValue = 14500000 + (Math.random() * 5000000);
    askingPrice = marketValue * 0.75;
    financials = { revenue: 1200000, profit: 340000, debt: 500000 };
    risks = ['⚠️ Aging equipment', '⚠️ Key supplier dependency'];
  } else {
    title = 'Distressed Tech Startup';
    description = 'A previously high-flying AI startup ran out of runway and needs an immediate buyout.';
    marketValue = 25000000;
    askingPrice = 4000000;
    financials = { revenue: 200000, profit: -800000, debt: 1500000 };
    risks = ['⚠️ Cash burn is lethal', '⚠️ Co-founders suing each other'];
  }

  return {
    id,
    type,
    title,
    description,
    marketValue,
    askingPrice,
    daysRemaining,
    financials,
    risks
  };
}
