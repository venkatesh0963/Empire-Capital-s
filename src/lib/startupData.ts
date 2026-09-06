export interface StartupPitch {
  id: string;
  name: string;
  industry: string;
  description: string;
  stage: 'Seed' | 'Series A' | 'Series B' | 'Pre-IPO';
  investmentRequired: number;
  valuation: number;
  successProbability: number; // 0.0 to 1.0
  potentialMultiplier: number;
  monthsToExit: number;
}

export interface OwnedStartup {
  id: string;
  name: string;
  industry: string;
  investedAmount: number;
  equityOwned: number;
  monthsRemaining: number;
  status: 'Active' | 'Bankrupt' | 'IPO';
  exitValue: number; // 0 if bankrupt, else equityOwned * IPO valuation
  successProbability: number;
}

export const generateStartupPitch = (): StartupPitch => {
  const industries = ['AI', 'Biotech', 'Fintech', 'Robotics', 'SpaceTech', 'Web3', 'Green Energy'];
  const prefixes = ['Quantum', 'Aura', 'Nexus', 'Vertex', 'Stratos', 'Omni', 'Cyber'];
  const suffixes = ['AI', 'Dynamics', 'Labs', 'Health', 'Genetics', 'Systems', 'Pay'];
  
  const industry = industries[Math.floor(Math.random() * industries.length)];
  const name = `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
  
  const stages: StartupPitch['stage'][] = ['Seed', 'Series A', 'Series B', 'Pre-IPO'];
  // Weight towards earlier stages
  const stageWeights = [50, 30, 15, 5];
  const totalWeight = stageWeights.reduce((a,b)=>a+b,0);
  let rand = Math.random() * totalWeight;
  let stage: StartupPitch['stage'] = 'Seed';
  for(let i=0; i<stages.length; i++) {
     if(rand < stageWeights[i]) { stage = stages[i]; break; }
     rand -= stageWeights[i];
  }

  let investmentRequired, valuation, successProbability, potentialMultiplier, monthsToExit;

  switch (stage) {
    case 'Seed':
      valuation = (Math.random() * 4 + 1) * 1000000; // $1M - $5M
      investmentRequired = valuation * (Math.random() * 0.15 + 0.05); // 5-20% equity
      successProbability = 0.1; // 10% chance
      potentialMultiplier = Math.random() * 50 + 50; // 50x - 100x
      monthsToExit = Math.floor(Math.random() * 24 + 36); // 3-5 years
      break;
    case 'Series A':
      valuation = (Math.random() * 15 + 5) * 1000000; // $5M - $20M
      investmentRequired = valuation * (Math.random() * 0.10 + 0.05); // 5-15% equity
      successProbability = 0.25;
      potentialMultiplier = Math.random() * 10 + 10; // 10x - 20x
      monthsToExit = Math.floor(Math.random() * 12 + 24); // 2-3 years
      break;
    case 'Series B':
      valuation = (Math.random() * 50 + 20) * 1000000; // $20M - $70M
      investmentRequired = valuation * (Math.random() * 0.10 + 0.02); // 2-12% equity
      successProbability = 0.5;
      potentialMultiplier = Math.random() * 3 + 3; // 3x - 6x
      monthsToExit = Math.floor(Math.random() * 12 + 12); // 1-2 years
      break;
    case 'Pre-IPO':
      valuation = (Math.random() * 500 + 100) * 1000000; // $100M - $600M
      investmentRequired = valuation * (Math.random() * 0.05 + 0.01); // 1-6% equity
      successProbability = 0.8;
      potentialMultiplier = Math.random() * 1 + 1.5; // 1.5x - 2.5x
      monthsToExit = Math.floor(Math.random() * 6 + 6); // 6-12 months
      break;
  }

  return {
    id: `startup_${Date.now()}_${Math.floor(Math.random()*1000)}`,
    name,
    industry,
    description: `A promising ${stage} stage startup disrupting the ${industry} space.`,
    stage,
    investmentRequired: Math.round(investmentRequired),
    valuation: Math.round(valuation),
    successProbability,
    potentialMultiplier,
    monthsToExit
  };
};
