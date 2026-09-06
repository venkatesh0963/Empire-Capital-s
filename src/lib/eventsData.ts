export interface GameEventTemplate {
  id: string;
  title: string;
  description: string;
  options: {
    id: string;
    label: string;
  }[];
}

export const RANDOM_EVENTS: GameEventTemplate[] = [
  {
    id: 'e_recession',
    title: 'Global Recession Begins',
    description: 'A sudden economic shock has sent the global economy into a recession. Interest rates are rising, demand for businesses is dropping, and stock markets are crashing.',
    options: [
      { id: 'opt_hold', label: 'Hold steady and weather the storm (No cost)' },
      { id: 'opt_sell', label: 'Liquidate 20% of your stock portfolio to cash' },
      { id: 'opt_bailout', label: 'Lobby government for a bailout (Costs $10k, lowers rates slightly)' }
    ]
  },
  {
    id: 'e_boom',
    title: 'Economic Boom',
    description: 'Consumer confidence is at an all-time high! The economy is entering a golden age of spending.',
    options: [
      { id: 'opt_celebrate', label: 'Excellent.' },
      { id: 'opt_market_push', label: 'Double all marketing budgets across businesses (Automatically costs cash)' }
    ]
  },
  {
    id: 'e_ai',
    title: 'AI Breakthrough',
    description: 'A massive breakthrough in Artificial General Intelligence has occurred. Tech stocks are surging wildly, but traditional businesses are facing disruption.',
    options: [
      { id: 'opt_ignore', label: 'Ignore the hype' },
      { id: 'opt_invest', label: 'Invest $50k immediately into Tech Startups' }
    ]
  }
];
