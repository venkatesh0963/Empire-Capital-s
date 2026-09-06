import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_STOCKS, STOCK_CATALYSTS, StockCompany } from '@/lib/stockData';
import { GLOBAL_CITIES } from '@/lib/globalData';
import { INITIAL_CRYPTO, CryptoCoin } from '@/lib/cryptoData';
import { INITIAL_COMMODITIES, Commodity } from '@/lib/commodityData';
import { INITIAL_BONDS, Bond } from '@/lib/bondData';
import { PropertyListing, OwnedProperty, generateRandomProperty } from '@/lib/realEstateData';
import { BusinessIndustry, OwnedBusiness, BUSINESS_TEMPLATES } from '@/lib/businessData';
import { StartupPitch, OwnedStartup, generateStartupPitch } from '@/lib/startupData';
import { LuxuryItem, OwnedLuxury, INITIAL_LUXURY_ITEMS } from '@/lib/luxuryData';
import { IntellectualProperty, OwnedIP, Collectible, OwnedCollectible, INITIAL_IP, INITIAL_COLLECTIBLES } from '@/lib/alternativeData';
import { ACHIEVEMENTS } from '@/lib/achievementsData';
import { RANDOM_EVENTS, GameEventTemplate } from '@/lib/eventsData';
import { Executive, ExecutiveRole, generateRandomExecutive } from '@/lib/employeeData';
import { generateAcquisitionTarget, AcquisitionTarget } from '@/lib/maData';
import { OwnedCityBuilding } from '@/lib/cityData';
import { generateOpportunity, SpecialOpportunity } from '@/lib/opportunityData';
import { PlayerStartup, STARTUP_INDUSTRIES } from '@/lib/founderData';
export interface GameEvent {
  id: string;
  title: string;
  description: string;
  options: {
    id: string;
    label: string;
  }[];
}

export interface PlayerProfile {
  name: string;
  age: number;
  level: number;
  xp: number;
  reputation: number; // 0-100
  skillPoints: number;
}

export interface PlayerSkills {
  business: number; // 1-10
  investment: number; // 1-10
  negotiation: number; // 1-10
  leadership: number; // 1-10
}

export interface Earnout { remainingBalance?: number;
  id: string;
  businessName: string;
  totalAmount: number;
  remainingAmount: number;
  monthlyPayment: number;
}

export interface HQState {
  level: number; // 1 = Small Office, 2 = Startup Office, 3 = Corporate Tower, 4 = Headquarters, 5 = Empire Tower, 6 = Global HQ
  modules: string[]; // e.g., 'Trading Floor', 'Research Lab', 'Executive Suite', 'Private Bank'
}


export interface PlayerState {
  cash: number;
  netWorth: number;
  creditScore: number;
  passiveIncome: number;
  monthlyExpenses: number;
  milestones: { millionaire: boolean, billionaire: boolean };
  unlockedAchievements: { id: string; date: string; claimed?: boolean }[];
  activeEvent: GameEvent | null;
  profile: PlayerProfile;
  skills: PlayerSkills;
  hq: HQState;
  unlockedCities?: string[];
}

export interface TimeState { year: number; month: number; day: number; isPaused: boolean; speed: number; }


export interface BankLoan {
  id: string; type: 'Personal' | 'Business' | 'Mortgage';
  principal: number; remainingBalance: number; interestRate: number;
  monthlyPayment: number; termMonths: number; monthsPaid: number;
}

export interface OwnedBond {
  bondId: string;
  principal: number;
  monthsRemaining: number;
}

export interface EconomyState {
  status: 'BOOM' | 'GROWTH' | 'STABLE' | 'SLOWDOWN' | 'RECESSION' | 'CRISIS';
  inflationMultiplier: number; 
  demandMultiplier: number; 
  interestRateBase: number;
}

export interface NewsEvent { id: string; date: string; headline: string; type: 'neutral' | 'positive' | 'negative' | 'economy'; }
export interface Competitor { 
  id: string; 
  name: string; 
  netWorth: number; 
  growthRate: number;
  strategy: string;
  monthlyRevenue: number;
  holdings: {
     realEstate: number;
     businesses: number;
     focusIndustry?: string;
  };
}
export interface Position {
  quantity: number;
  averageCost: number;

}

export interface PlayerPortfolio {
  stocks: Record<string, Position>;
  crypto: Record<string, Position>;
  commodities: Record<string, Position>;
  bonds: OwnedBond[];
  startups: OwnedStartup[];
  luxury: OwnedLuxury[];
  ip: OwnedIP[];
  collectibles: OwnedCollectible[];
}

export interface RealEstateState {
  marketListings: PropertyListing[];
  ownedProperties: OwnedProperty[];
  cityBuildings: OwnedCityBuilding[];
}

export interface BusinessState {
  ownedBusinesses: OwnedBusiness[];
  earnouts: Earnout[];
}

interface BankingState {
  loans: BankLoan[];
}

export interface Email { id: string; date: string; sender: string; subject: string; body: string; isRead: boolean; }

export interface GameState {
  player: PlayerState;
  time: TimeState;
  market: { prices: Record<string, number>; history: Record<string, number[]> };
  cryptoMarket: { prices: Record<string, number>; history: Record<string, number[]> };
  commoditiesMarket: { prices: Record<string, number>; history: Record<string, number[]> };
  economy: EconomyState;
  portfolio: PlayerPortfolio;
  realEstate: RealEstateState;
  business: BusinessState;
  founder: { playerStartups: PlayerStartup[] };
  inbox: Email[];
  isPhoneOpen: boolean;
  banking: BankingState;
  startupMarket: { pitches: StartupPitch[] };
  competitors: Competitor[];
  news: NewsEvent[];
  maMarket: { targets: AcquisitionTarget[] };
  activeOpportunities: import('@/lib/opportunityData').SpecialOpportunity[];
  
  // Actions
  togglePause: () => void;
  setSpeed: (speed: number) => void;
  advanceDay: () => void;
  recalculateNetWorth: () => void;
  resetGame: () => void;
  togglePhone: () => void;
  markEmailRead: (id: string) => void;
  foundStartup: (name: string, industryId: string, initialCapital: number) => void;
  injectCashStartup: (id: string, amount: number) => void;
  hireStartupEmployee: (id: string, role: 'developer' | 'marketer', count: number) => void;
  launchStartupProduct: (id: string) => void;
  sellStartup: (id: string) => void;
  payStartupDividend: (id: string, amount: number) => void;
  
  buyStock: (symbol: string, quantity: number) => boolean;
  sellStock: (symbol: string, quantity: number) => boolean;
  buyCrypto: (symbol: string, quantity: number) => boolean;
  sellCrypto: (symbol: string, quantity: number) => boolean;
  buildCityBuilding: (typeId: string, cost: number) => boolean;
  buyCommodity: (symbol: string, quantity: number) => boolean;
  sellCommodity: (symbol: string, quantity: number) => boolean;
  buyBond: (id: string, principal: number) => boolean;
  investInStartup: (pitchId: string, amount: number) => boolean;
  buyLuxuryItem: (itemId: string) => boolean;
  sellLuxuryItem: (itemId: string) => boolean;
  buyIP: (ipId: string) => boolean;
  sellIP: (ipId: string) => boolean;
  buyCollectible: (colId: string) => boolean;
  sellCollectible: (colId: string) => boolean;

  refreshPropertyMarket: () => void;
  buyProperty: (id: string) => boolean;
  sellProperty: (id: string) => boolean;
  createBusiness: (name: string, industry: BusinessIndustry, investment: number) => boolean;
  updateBusinessSettings: (id: string, marketing: number, priceMultiplier: number) => void;
  hireEmployee: (id: string) => void;
  fireEmployee: (id: string) => void;
  expandBusiness: (id: string, cost: number) => boolean;
  hireExecutive: (bizId: string, role: ExecutiveRole) => void;
  fireExecutive: (bizId: string, execId: string) => void;
  buyBusinessMA: (targetId: string, offerType: 'Cash' | 'Loan' | 'Earnout', offerValue: number) => { success: boolean; message: string };
  refreshMAMarket: () => void;
  upgradeHQ: () => boolean;
  buildHQModule: (module: string, cost: number) => boolean;
  takeLoan: (amount: number, termYears: number, type: BankLoan['type']) => boolean;
  payDownLoan: (id: string, amount: number) => boolean;
  claimAchievementReward: (id: string) => void;
  resolveEvent: (optionId: string) => void;
  allocateSkillPoint: (skill: keyof PlayerSkills) => void;
  updateProfile: (updates: Partial<PlayerProfile>) => void;
  unlockCity: (cityId: string, cost: number) => boolean;
  buyOpportunity: (id: string) => { success: boolean; message: string };
}

const INITIAL_PLAYER_STATE: PlayerState = { 
  cash: 100000, netWorth: 100000, creditScore: 700, passiveIncome: 0, monthlyExpenses: 2100, 
  milestones: { millionaire: false, billionaire: false }, unlockedAchievements: [], activeEvent: null,
  profile: { name: 'The Founder', age: 25, level: 1, xp: 0, reputation: 50, skillPoints: 0 },
  skills: { business: 1, investment: 1, negotiation: 1, leadership: 1 },
  hq: { level: 1, modules: [] },
  unlockedCities: ['nyc']
};

const INITIAL_TIME_STATE: TimeState = { year: 1, month: 1, day: 1, isPaused: true, speed: 1 };
const INITIAL_ECONOMY_STATE: EconomyState = { status: 'STABLE', inflationMultiplier: 1.0, demandMultiplier: 1.0, interestRateBase: 0.05 };

const INITIAL_COMPETITORS: Competitor[] = [
  { id: 'c1', name: 'Daniel Stone', netWorth: 82000000, growthRate: 1.015, strategy: 'Aggressive acquisitions', monthlyRevenue: 850000, holdings: { realEstate: 2, businesses: 8, focusIndustry: 'Retail' } },
  { id: 'c2', name: 'Sophia Morgan', netWorth: 61000000, growthRate: 1.012, strategy: 'Real estate', monthlyRevenue: 420000, holdings: { realEstate: 15, businesses: 2 } },
  { id: 'c3', name: 'Victor King', netWorth: 104000000, growthRate: 1.02, strategy: 'Technology', monthlyRevenue: 1200000, holdings: { realEstate: 1, businesses: 5, focusIndustry: 'Technology' } },
];

const initialPrices: Record<string, number> = {};
const initialHistory: Record<string, number[]> = {};
INITIAL_STOCKS.forEach(stock => { initialPrices[stock.symbol] = stock.basePrice; initialHistory[stock.symbol] = [stock.basePrice]; });

const initialCryptoPrices: Record<string, number> = {};
const initialCryptoHistory: Record<string, number[]> = {};
INITIAL_CRYPTO.forEach(coin => { initialCryptoPrices[coin.symbol] = coin.basePrice; initialCryptoHistory[coin.symbol] = [coin.basePrice]; });

const initialCommodityPrices: Record<string, number> = {};
const initialCommodityHistory: Record<string, number[]> = {};
INITIAL_COMMODITIES.forEach(com => { initialCommodityPrices[com.symbol] = com.basePrice; initialCommodityHistory[com.symbol] = [com.basePrice]; });

const initialProperties = Array(6).fill(null).map(() => generateRandomProperty());
const initialStartups = Array(4).fill(null).map(() => generateStartupPitch());

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      player: { ...INITIAL_PLAYER_STATE },
      time: { ...INITIAL_TIME_STATE },
      market: { prices: initialPrices, history: initialHistory },
      cryptoMarket: { prices: initialCryptoPrices, history: initialCryptoHistory },
      commoditiesMarket: { prices: initialCommodityPrices, history: initialCommodityHistory },
      startupMarket: { pitches: initialStartups },
      portfolio: { stocks: {}, crypto: {}, commodities: {}, bonds: [], startups: [], luxury: [], ip: [], collectibles: [] },
      realEstate: { marketListings: initialProperties, ownedProperties: [], cityBuildings: [] },
      business: { ownedBusinesses: [], earnouts: [] },
      founder: { playerStartups: [] }, inbox: [{ id: 'welcome_email', date: 'Y1 M1 D1', sender: 'Victor King', subject: 'Welcome to the big leagues', body: 'I heard you just got $100,000 in seed capital. Don\'t lose it all in one place. If you ever want to sell a company, give me a call.', isRead: false }], isPhoneOpen: false,
      banking: { loans: [] },
      economy: { ...INITIAL_ECONOMY_STATE },
      competitors: [...INITIAL_COMPETITORS],
      news: [{ id: 'init', date: 'Y1 M1', headline: 'Welcome to Empire Builder! You have been granted $100,000 to start your journey.', type: 'positive' }],
      maMarket: { targets: [] },
      activeOpportunities: [],

      togglePause: () => set((state) => ({ time: { ...state.time, isPaused: !state.time.isPaused } })),
      setSpeed: (speed) => set((state) => ({ time: { ...state.time, speed } })),



      togglePhone: () => set((state) => ({ isPhoneOpen: !state.isPhoneOpen })),
      markEmailRead: (id) => set((state) => ({ inbox: state.inbox.map(e => e.id === id ? { ...e, isRead: true } : e) })),

      foundStartup: (name, industryId, initialCapital) => set((state) => {
         if (state.player.cash < initialCapital) return state;
         
         const newStartup: PlayerStartup = {
            id: `startup_${Date.now()}`,
            name,
            industry: industryId,
            stage: 'IDEA',
            cash: initialCapital,
            revenue: 0,
            users: 0,
            developers: 1, // You!
            marketers: 0,
            productQuality: 10,
            brandAwareness: 0,
            valuation: initialCapital,
            foundedDate: `Y${state.time.year} M${state.time.month} D${state.time.day}`,
            daysActive: 0
         };
         
         return {
            player: { ...state.player, cash: state.player.cash - initialCapital },
            founder: { playerStartups: [...(state.founder?.playerStartups || []), newStartup] }
         };
      }),

      injectCashStartup: (id, amount) => set((state) => {
         if (state.player.cash < amount) return state;
         const startups = state.founder?.playerStartups || [];
         const updated = startups.map(s => s.id === id ? { ...s, cash: s.cash + amount } : s);
         return {
            player: { ...state.player, cash: state.player.cash - amount },
            founder: { playerStartups: updated }
         };
      }),

      hireStartupEmployee: (id, role, count) => set((state) => {
         const startups = state.founder?.playerStartups || [];
         const updated = startups.map(s => {
            if (s.id === id) {
               return {
                  ...s,
                  developers: role === 'developer' ? s.developers + count : s.developers,
                  marketers: role === 'marketer' ? s.marketers + count : s.marketers
               };
            }
            return s;
         });
         return { founder: { playerStartups: updated } };
      }),

      launchStartupProduct: (id) => set((state) => {
         const startups = state.founder?.playerStartups || [];
         const updated = startups.map(s => {
            if (s.id === id && s.stage === 'DEVELOPMENT') {
               return { ...s, stage: 'BETA' as any };
            }
            return s;
         });
         return { founder: { playerStartups: updated } };
      }),

      sellStartup: (id) => set((state) => {
         const startups = state.founder?.playerStartups || [];
         const target = startups.find(s => s.id === id);
         if (!target) return state;
         
         const payout = target.valuation;
         return {
            player: { ...state.player, cash: state.player.cash + payout },
            founder: { playerStartups: startups.filter(s => s.id !== id) }
         };
      }),
      payStartupDividend: (id, amount) => set((state) => {
         const startups = state.founder?.playerStartups || [];
         const updated = startups.map(s => {
             if (s.id === id && s.cash >= amount) {
                 return { ...s, cash: s.cash - amount };
             }
             return s;
         });
         
         // Verify we actually deducted it
         const target = startups.find(s => s.id === id);
         if (!target || target.cash < amount) return state;
         
         return {
            player: { ...state.player, cash: state.player.cash + amount },
            founder: { playerStartups: updated }
         };
      }),

      advanceDay: () => set((state) => {
        let { year, month, day } = state.time;
        day++;
        
        let newCash = state.player.cash;
        let newCreditScore = state.player.creditScore;
        let economy = { ...state.economy };
        let news = [...state.news];

        
        // --- FOUNDER STARTUPS (DAILY) ---
        let updatedPlayerStartups = [...(state.founder?.playerStartups || [])];
        let startupNews = [];
        
        updatedPlayerStartups = updatedPlayerStartups.map(startup => {
           let s = { ...startup, daysActive: startup.daysActive + 1 };
           const ind = STARTUP_INDUSTRIES.find(i => i.id === s.industry) || STARTUP_INDUSTRIES[0];
           
           // Daily Burn Rate
           const dailyBurn = (((s.developers * ind.devSalary) + (s.marketers * ind.marketerSalary)) / 30) * 0.75;
           s.cash -= dailyBurn;
           
           // If bankrupt
           if (s.cash <= 0) {
              s.cash = 0;
              s.stage = 'IDEA'; // Effectively dead, but we keep it or bankrupt it
           }
           
           if (s.cash > 0) {
               // Stage Transitions
               if (s.stage === 'IDEA' && s.daysActive > 7) s.stage = 'DEVELOPMENT';
               
               // Dev Progress
               if (['DEVELOPMENT', 'BETA', 'GROWTH', 'MATURE'].includes(s.stage)) {
                   const devPower = s.developers * ind.devDifficulty * 0.75; // daily quality increase
                   s.productQuality = Math.min(100, s.productQuality + devPower);
               }
               
               // Marketing & Users
               if (['BETA', 'GROWTH', 'MATURE'].includes(s.stage)) {
                   const marketingPower = s.marketers * 0.5;
                   s.brandAwareness = Math.min(100, s.brandAwareness + marketingPower);
                   
                   const organicGrowth = (s.productQuality / 100) * ind.viralFactor;
                   const paidGrowth = (s.brandAwareness / 100) * 2;
                   
                   // New users per day
                   const newUsers = Math.floor(Math.max(5, s.users * 0.02) * (organicGrowth + paidGrowth));
                   s.users += newUsers;
                   
                   // Revenue (daily approx)
                   const dailyArpu = ind.arpu / 30;
                   s.revenue = s.users * dailyArpu * 30; // monthly projected
                   s.cash += s.users * dailyArpu; // daily cash influx
               }
               
               // Valuation
               const revenueMultiple = s.industry === 'ai' ? 20 : (s.industry === 'saas' ? 10 : 5);
               const userValue = s.users * (ind.arpu * 12) * 2;
               s.valuation = Math.max(s.cash, (s.revenue * 12 * revenueMultiple) + userValue);
           }
           
           return s;
        });
        
        // Remove bankrupt startups
        const deadStartups = updatedPlayerStartups.filter(s => s.cash <= 0 && s.daysActive > 14);
        if (deadStartups.length > 0) {
            deadStartups.forEach(ds => {
                news.unshift({ id: `n_bankrupt_${Date.now()}_${ds.id}`, date: `Y${year} M${month}`, headline: `⚠️ Startup Failed: ${ds.name} ran out of cash and shut down.`, type: 'negative' });
            });
            updatedPlayerStartups = updatedPlayerStartups.filter(s => s.cash > 0 || s.daysActive <= 14);
        }

        // --- GLOBAL EXPANSION CALCS ---
        const unlockedCities = state.player.unlockedCities || ['nyc'];
        let totalTax = 0;
        let totalSalaryMult = 0;
        unlockedCities.forEach(cid => {
           const city = GLOBAL_CITIES.find(c => c.id === cid) || GLOBAL_CITIES[0];
           totalTax += city.taxRate;
           totalSalaryMult += city.salaryMultiplier;
        });
const avgTaxRate = totalTax / unlockedCities.length;
        const avgSalaryMult = totalSalaryMult / unlockedCities.length;
        
        // --- DAILY MARKET FLUCTUATIONS ---
        const newPrices = { ...state.market.prices };
        const newHistory = { ...state.market.history };
        
        const safeCryptoMarket = state.cryptoMarket || { prices: initialCryptoPrices, history: initialCryptoHistory };
        const newCryptoPrices = { ...safeCryptoMarket.prices };
        const newCryptoHistory = { ...safeCryptoMarket.history };
        
        let marketDrift = 0;
        let cryptoDrift = 0; // Crypto reacts wildly to economy
        if (economy.status === 'BOOM') { marketDrift = 0.005; cryptoDrift = 0.015; }
        if (economy.status === 'RECESSION') { marketDrift = -0.005; cryptoDrift = -0.02; }
        if (economy.status === 'CRISIS') { marketDrift = -0.015; cryptoDrift = -0.04; }

        // Update Stocks
        let activeCatalyst: typeof STOCK_CATALYSTS[0] | null = null;
        if (Math.random() < 0.05) { // 5% chance daily for a major news catalyst
           activeCatalyst = STOCK_CATALYSTS[Math.floor(Math.random() * STOCK_CATALYSTS.length)];
           news.unshift({ id: `news_${Date.now()}_${activeCatalyst.id}`, date: `Y${year} M${month} D${day}`, headline: activeCatalyst.headline, type: (activeCatalyst.impactMultiplier > 1 ? 'positive' : 'negative') as 'positive' | 'negative' });
        }

        INITIAL_STOCKS.forEach(stock => {
          let catalystEffect = 0;
          if (activeCatalyst && activeCatalyst.symbol === stock.symbol) {
             catalystEffect = activeCatalyst.impactMultiplier - 1; // e.g. 1.15 - 1 = 0.15
          }
          const changePercent = ((Math.random() * 2 - 1) * stock.volatility) + marketDrift + catalystEffect;
          let newPrice = newPrices[stock.symbol] * (1 + changePercent);
          if (newPrice < 1) newPrice = 1;
          newPrices[stock.symbol] = Number(newPrice.toFixed(2));
          const history = [...newHistory[stock.symbol], newPrice];
          if (history.length > 30) history.shift();
          newHistory[stock.symbol] = history;
        });

        // Update Crypto
        INITIAL_CRYPTO.forEach(coin => {
          let spike = 0;
          if (Math.random() < 0.02) spike = (Math.random() * 0.3) * (Math.random() > 0.5 ? 1 : -1);
          
          const changePercent = ((Math.random() * 2 - 1) * coin.volatility) + cryptoDrift + spike;
          let newPrice = newCryptoPrices[coin.symbol] * (1 + changePercent);
          if (newPrice < 0.01) newPrice = 0.01;
          newCryptoPrices[coin.symbol] = Number(newPrice.toFixed(4));
          const history = [...newCryptoHistory[coin.symbol], newPrice];
          if (history.length > 30) history.shift();
          newCryptoHistory[coin.symbol] = history;
        });

        // Update Commodities
        const safeComMarket = state.commoditiesMarket || { prices: initialCommodityPrices, history: initialCommodityHistory };
        const newComPrices = { ...safeComMarket.prices };
        const newComHistory = { ...safeComMarket.history };

        INITIAL_COMMODITIES.forEach(com => {
          let ecoEffect = 0;
          if (economy.status === 'BOOM') ecoEffect = 0.01 * com.economySensitivity;
          if (economy.status === 'CRISIS' || economy.status === 'RECESSION') ecoEffect = -0.015 * com.economySensitivity;
          
          const changePercent = ((Math.random() * 2 - 1) * com.volatility) + ecoEffect;
          let newPrice = newComPrices[com.symbol] * (1 + changePercent);
          if (newPrice < 0.01) newPrice = 0.01;
          newComPrices[com.symbol] = Number(newPrice.toFixed(2));
          const history = [...newComHistory[com.symbol], newPrice];
          if (history.length > 30) history.shift();
          newComHistory[com.symbol] = history;
        });

        const marketState = { prices: newPrices, history: newHistory };
        const cryptoState = { prices: newCryptoPrices, history: newCryptoHistory };
        const comState = { prices: newComPrices, history: newComHistory };

        // --- SPECIAL OPPORTUNITIES ---
        let updatedOpportunities = (state.activeOpportunities || []).map(opp => ({
           ...opp,
           daysRemaining: opp.daysRemaining - 1
        })).filter(opp => opp.daysRemaining > 0);

        if (Math.random() < 0.05 && updatedOpportunities.length < 3) { // 5% chance daily
           const newOpp = generateOpportunity();
           updatedOpportunities.push(newOpp);
           news.unshift({ id: `n_opp_${Date.now()}`, date: `Y${year} M${month}`, headline: `💎 OPPORTUNITY: ${newOpp.title} available for the next ${newOpp.daysRemaining} days!`, type: 'positive' });
        }

        if (day > 30) {
          day = 1;
          month++;
          
  
        // --- INBOX EVENTS ---
        let updatedInbox = [...(state.inbox || [])];
        if (Math.random() < 0.05) { // 5% chance daily for an email
           const emailTemplates = [
              { sender: 'Apex Bank', subject: 'Credit Limit Increase', body: 'Congratulations. Based on your recent account history, we have pre-approved you for a higher commercial credit limit.' },
              { sender: 'Sophia Morgan', subject: 'Real Estate Tip', body: 'I just passed on a commercial property downtown. It needs work, but you might want to look into it before it goes public.' },
              { sender: 'VP of Sales', subject: 'Quarterly Projections', body: 'We are tracking slightly ahead of our quarterly projections. If the economy holds up, we should see a record month.' },
              { sender: 'Daniel Stone', subject: 'Market Rumors', body: 'I heard you were looking to expand. Be careful, the logistics sector is getting crowded.' }
           ];
           const tmpl = emailTemplates[Math.floor(Math.random() * emailTemplates.length)];
           updatedInbox.unshift({
              id: `email_${Date.now()}`,
              date: `Y${year} M${month} D${day}`,
              sender: tmpl.sender,
              subject: tmpl.subject,
              body: tmpl.body,
              isRead: false
           });
           
           if (updatedInbox.length > 50) updatedInbox.pop();
        }

        // --- MONTHLY ECONOMY SHIFTS ---
          if (Math.random() < 0.05) { 
              const states: EconomyState['status'][] = ['BOOM', 'GROWTH', 'STABLE', 'SLOWDOWN', 'RECESSION', 'CRISIS'];
              const newState = states[Math.floor(Math.random() * states.length)];
              
              if (newState !== economy.status) {
                  let headline = '';
                  if (newState === 'BOOM') { economy.demandMultiplier = 1.2; economy.inflationMultiplier = 1.1; economy.interestRateBase = 0.06; headline = 'Global Economic Boom! Consumer spending skyrockets.'; }
                  else if (newState === 'GROWTH') { economy.demandMultiplier = 1.1; economy.inflationMultiplier = 1.05; economy.interestRateBase = 0.05; headline = 'Economy enters strong growth phase.'; }
                  else if (newState === 'STABLE') { economy.demandMultiplier = 1.0; economy.inflationMultiplier = 1.0; economy.interestRateBase = 0.04; headline = 'Markets stabilize. Standard economic conditions return.'; }
                  else if (newState === 'SLOWDOWN') { economy.demandMultiplier = 0.9; economy.inflationMultiplier = 0.95; economy.interestRateBase = 0.03; headline = 'Economic slowdown reported. Retail spending dips.'; }
                  else if (newState === 'RECESSION') { economy.demandMultiplier = 0.75; economy.inflationMultiplier = 0.9; economy.interestRateBase = 0.02; headline = '🚨 GLOBAL RECESSION. Markets tumble as unemployment rises.'; }
                  else if (newState === 'CRISIS') { economy.demandMultiplier = 0.6; economy.inflationMultiplier = 1.2; economy.interestRateBase = 0.08; headline = '🚨 ECONOMIC CRISIS. Stagflation hits the markets hard!'; }
                  
                  economy.status = newState;
                  news.unshift({ id: `n_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`, date: `Y${year} M${month}`, headline, type: 'economy' });
                  if (news.length > 15) news.pop();
              }
          }

          // --- MONTHLY DIVIDENDS & PASSIVE INCOME ---
          let monthlyDividends = 0;
          Object.entries(state.portfolio.stocks || {}).forEach(([symbol, position]) => {
             const stock = INITIAL_STOCKS.find(s => s.symbol === symbol);
             const hqTradingBonus = state.player.hq?.modules.includes('Trading Floor') ? 1.2 : 1.0;
             if (stock) monthlyDividends += (position.quantity * newPrices[symbol] * stock.dividendYield) / 12 * hqTradingBonus;
          });

          let reIncome = 0;
          let reExpenses = 0;
          const updatedOwnedProperties = state.realEstate.ownedProperties.map(prop => {
            let newOccupancy = prop.occupancyRate;
            if (economy.status === 'RECESSION' || economy.status === 'CRISIS') newOccupancy -= 0.05;
            else if (economy.status === 'BOOM') newOccupancy += 0.02;
            newOccupancy = Math.max(0.4, Math.min(1.0, newOccupancy));
            reIncome += prop.monthlyRent * newOccupancy;
            reExpenses += prop.maintenanceCost * economy.inflationMultiplier + prop.propertyTax;
            const newPrice = prop.price * (1 + (Math.random() * 0.004 - 0.001) * economy.demandMultiplier);
            return { ...prop, price: Math.round(newPrice), occupancyRate: newOccupancy };
          });

          const { CITY_BUILDINGS } = require('../lib/cityData');
          const updatedCityBuildings = (state.realEstate.cityBuildings || []).map(b => {
             if (b.status === 'Building') {
                const newDays = b.daysUntilComplete - 30; // Roughly a month
                if (newDays <= 0) {
                   const base = CITY_BUILDINGS.find((cb: any) => cb.id === b.typeId);
                   news.unshift({ id: `news_cb_${Date.now()}`, date: `Y${year} M${month}`, headline: `🏗️ Construction complete! Your ${base?.name} is now operational.`, type: 'positive' });
                   return { ...b, status: 'Operational' as 'Operational', daysUntilComplete: 0 };
                }
                return { ...b, daysUntilComplete: newDays };
             } else {
                const base = CITY_BUILDINGS.find((cb: any) => cb.id === b.typeId);
                if (base) {
                   // Global real estate multiplier applies to revenue and maintenance
                   reIncome += base.monthlyRevenue * economy.demandMultiplier * avgSalaryMult; 
                   reExpenses += base.maintenanceCost * economy.inflationMultiplier;
                }
                return b;
             }
          });

          let businessProfit = 0;
          const updatedBusinesses = state.business.ownedBusinesses.map(biz => {
            const template = BUSINESS_TEMPLATES[biz.industry] || BUSINESS_TEMPLATES['Services'];
            const marketingEffect = 1 + (Math.sqrt(biz.marketingBudget) / 100);
            
            // Economy Balance: As inflation rises, customers tolerate higher prices
            const inflationAdjustedPrice = biz.productPriceMultiplier / economy.inflationMultiplier;
            const priceEffect = Math.max(0.1, 2 - inflationAdjustedPrice); 
            
            // CEO Skills
            const ceoLeadershipBonus = 1 + ((state.player.skills?.leadership || 1) * 0.05);
            const ceoBusinessBonus = 1 - ((state.player.skills?.business || 1) * 0.02);

            // Executive Skills
            let execSalesBonus = 1;
            let execFinanceBonus = 1;
            let execPayroll = 0;
            
            (biz.executives || []).forEach(exec => {
               execSalesBonus += exec.skills.sales * 0.05; // Each sales star = +5% revenue
               execFinanceBonus -= exec.skills.finance * 0.02; // Each finance star = -2% expenses
               execPayroll += exec.salary;
            });
            execFinanceBonus = Math.max(0.5, execFinanceBonus);

            const employeeEffect = 1 + (biz.employees * 0.1); 
            const randomMarketFluctuation = 0.9 + (Math.random() * 0.2); 
            const hqResearchBonus = state.player.hq?.modules.includes('Research Lab') ? 1.1 : 1.0;
            
            const bizLevelMult = (biz.level || 1);
            const revenue = template.baseRevenue * bizLevelMult * biz.productPriceMultiplier * marketingEffect * priceEffect * employeeEffect * randomMarketFluctuation * economy.demandMultiplier * ceoLeadershipBonus * execSalesBonus * hqResearchBonus;
            
            const cogs = revenue * template.baseCOGS * economy.inflationMultiplier * ceoBusinessBonus * execFinanceBonus;
            const payroll = (biz.employees * template.basePayroll * economy.inflationMultiplier * avgSalaryMult * bizLevelMult) + execPayroll;
            const expenses = cogs + payroll + biz.marketingBudget;
            
            let preTaxProfit = revenue - expenses;
            const taxAmount = preTaxProfit > 0 ? preTaxProfit * avgTaxRate : 0;
            const profit = preTaxProfit - taxAmount;

            businessProfit += profit;
            const newBrandValue = Math.min(100, biz.brandValue + (biz.marketingBudget > 500 ? 1 : 0));
            return { ...biz, lastMonthRevenue: revenue, lastMonthExpenses: expenses, lastMonthProfit: profit, brandValue: newBrandValue };
          });
          
          let totalLoanPayments = 0;
          let failedPayment = false;

          const updatedLoans = state.banking.loans.map(loan => {
             if (loan.remainingBalance <= 0) return loan;
             totalLoanPayments += loan.monthlyPayment;
             const interestPortion = loan.remainingBalance * (loan.interestRate / 12);
             const principalPortion = loan.monthlyPayment - interestPortion;
             return { ...loan, monthsPaid: loan.monthsPaid + 1, remainingBalance: Math.max(0, loan.remainingBalance - principalPortion) };
          }).filter(loan => loan.remainingBalance > 0);

          let totalEarnoutPayments = 0;
          const updatedEarnouts = (state.business.earnouts || []).map(earnout => {
             if ((earnout.remainingBalance || 0) <= 0) return earnout;
             const payment = Math.min(earnout.monthlyPayment, (earnout.remainingBalance || 0));
             totalEarnoutPayments += payment;
             return { ...earnout, remainingBalance: (earnout.remainingBalance || 0) - payment };
          }).filter(e => (e.remainingBalance || 0) > 0);

          let bondIncome = 0;
          state.portfolio.bonds.forEach(bond => {
             const bondData = INITIAL_BONDS.find(b => b.id === bond.bondId);
             if (bondData) {
               bondIncome += (bond.principal * bondData.yieldRate) / 12;
               bond.monthsRemaining--;
               if (bond.monthsRemaining <= 0) {
                 newCash += bond.principal; // Bond matures
               }
             }
          });
          const activeBonds = state.portfolio.bonds.filter(b => b.monthsRemaining > 0);

          // Process Startups
          let updatedStartups = [...(state.portfolio.startups || [])];
          let startupMarketPitches = [...(state.startupMarket?.pitches || [])];
          
          updatedStartups = updatedStartups.map(su => {
            if (su.status !== 'Active') return su;
            const newMonths = su.monthsRemaining - 1;
            if (newMonths <= 0) {
              const pitch = INITIAL_COMPETITORS; // dummy, we need original pitch data
              // Instead of saving pitch, let's just use su properties which we will save when buying
              const isSuccess = Math.random() < (su.successProbability || 0.1); // Fallback
              if (isSuccess) {
                 const payout = su.exitValue;
                 newCash += payout;
                 news.unshift({ id: `n_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`, date: `Y${year} M${month}`, headline: `🚀 ${su.name} went public! Your equity paid out $${payout.toLocaleString()}.`, type: 'positive' });
                 return { ...su, monthsRemaining: 0, status: 'IPO' };
              } else {
                 news.unshift({ id: `n_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`, date: `Y${year} M${month}`, headline: `📉 ${su.name} went bankrupt. You lost your $${su.investedAmount.toLocaleString()} investment.`, type: 'negative' });
                 return { ...su, monthsRemaining: 0, status: 'Bankrupt', exitValue: 0 };
              }
            }
            return { ...su, monthsRemaining: newMonths };
          });
          
          if (Math.random() < 0.2) {
             startupMarketPitches.push(generateStartupPitch());
             if (startupMarketPitches.length > 8) startupMarketPitches.shift();
          }

          // Process Luxury
          let luxuryMaintenance = 0;
          let extraStatus = 0;
          let updatedLuxury = (state.portfolio.luxury || []).map(lux => {
             const baseItem = INITIAL_LUXURY_ITEMS.find(i => i.id === lux.itemId);
             if (!baseItem) return lux;
             luxuryMaintenance += baseItem.monthlyMaintenance;
             extraStatus += baseItem.statusBoost;
             
             // Monthly depreciation
             const monthlyDepr = baseItem.depreciationRate / 12;
             const newValue = lux.currentValue * (1 - monthlyDepr);
             
             return { ...lux, currentValue: newValue, monthsOwned: lux.monthsOwned + 1 };
          });

          // Process IP
          let ipIncome = 0;
          let updatedIp = (state.portfolio.ip || []).map(ip => {
             ipIncome += ip.currentRoyalty;
             const baseData = INITIAL_IP.find(i => i.id === ip.ipId);
             // decay royalty slowly
             const newRoyalty = ip.currentRoyalty * (1 - ((baseData?.popularityDecay || 0.05) / 12));
             return { ...ip, currentRoyalty: newRoyalty };
          });

          // Process Collectibles
          let updatedCollectibles = (state.portfolio.collectibles || []).map(col => {
             const baseData = INITIAL_COLLECTIBLES.find(c => c.id === col.collectibleId);
             if (!baseData) return col;
             const monthlyAppreciation = baseData.appreciationRate / 12;
             const volatility = (Math.random() * baseData.volatility) - (baseData.volatility / 2); // Random monthly swing
             const newValue = col.currentValue * (1 + monthlyAppreciation + volatility);
             return { ...col, currentValue: Math.max(1, newValue) };
          });

          const ceoInvestmentBonus = 1 + ((state.player.skills?.investment || 1) * 0.05);

          const totalPassiveIncome = (monthlyDividends + bondIncome + (reIncome - reExpenses) + businessProfit + ipIncome) * ceoInvestmentBonus;
          const totalMonthlyExpenses = (2100 * economy.inflationMultiplier) + totalLoanPayments + totalEarnoutPayments + luxuryMaintenance;
          const netMonthly = totalPassiveIncome - totalMonthlyExpenses;
          newCash += netMonthly;
          
          if (newCash < 0) {
             failedPayment = true;
             newCreditScore = Math.max(300, newCreditScore - 20);
             newCash -= 50; 
             news.unshift({ id: `n_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`, date: `Y${year} M${month}`, headline: 'Overdraft! Bank charged a $50 fee and your credit score dropped.', type: 'negative' });
             if (news.length > 15) news.pop();
          } else if (updatedLoans.length > 0 && !failedPayment && Math.random() > 0.7) {
             newCreditScore = Math.min(850, newCreditScore + 2);
          }
          
          // Luxury status boost increases credit slowly
          if (extraStatus > 50 && Math.random() < 0.5) {
             newCreditScore = Math.min(850, newCreditScore + 1);
          }

          if (month > 12) { 
             month = 1; 
             year++; 
             // Yearly base inflation to punish holding raw cash
             economy.inflationMultiplier = Number((economy.inflationMultiplier * 1.03).toFixed(3)); 
             news.unshift({ id: `n_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`, date: `Y${year} M1`, headline: `Happy New Year! Annual inflation applied. Cash holding is riskier.`, type: 'economy' });
             if (news.length > 15) news.pop();

             // Random Interactive Event trigger (30% chance per year)
             if (Math.random() < 0.3 && !state.player.activeEvent) {
                const randomEvent = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
                state.player.activeEvent = { ...randomEvent };
                state.time.isPaused = true; // Pause game for event
             }
             
             // Age up CEO
             if (state.player.profile) state.player.profile.age += 1;
          }
          
          // Generate M&A targets every month if there are less than 3
          let newMATargets = state.maMarket?.targets || [];
          if (newMATargets.length < 3 && Math.random() < 0.2) {
             newMATargets = [...newMATargets, generateAcquisitionTarget()];
          }

          // XP and Level Up Logic
          const currentProfile = state.player.profile || { name: 'The Founder', age: 25, level: 1, xp: 0, reputation: 50, skillPoints: 0 };
          const hqExecBonus = state.player.hq?.modules.includes('Executive Suite') ? 1.5 : 1.0;
          let newXp = currentProfile.xp + ((netMonthly > 0 ? netMonthly * 0.01 : 10) * hqExecBonus);
          let newLevel = currentProfile.level;
          let newSkillPoints = currentProfile.skillPoints;
          const xpRequired = newLevel * 5000;
          if (newXp >= xpRequired && newLevel < 50) {
             newXp -= xpRequired;
             newLevel++;
             newSkillPoints += 1;
             news.unshift({ id: `n_${Date.now()}_lvl`, date: `Y${year} M${month}`, headline: `🎉 LEVEL UP! You are now a Level ${newLevel} CEO. You gained 1 Skill Point.`, type: 'positive' });
          }
          
          let newMarketListings = [...state.realEstate.marketListings];
          if (newMarketListings.length > 3) newMarketListings.shift(); 
          newMarketListings.push(generateRandomProperty());

          const updatedCompetitors = state.competitors.map(comp => {
              const newNetWorth = Math.round(comp.netWorth * (comp.growthRate + (Math.random() * 0.02 - 0.01)));
              
              // Simulate competitor actions every month
              let newHoldings = { ...comp.holdings };
              let newMonthlyRevenue = comp.monthlyRevenue;
              
              if (Math.random() < 0.15) {
                 if (comp.strategy === 'Real estate') {
                    newHoldings.realEstate += 1;
                    newMonthlyRevenue += 20000 + (Math.random() * 50000);
                    if (Math.random() < 0.3) {
                       news.unshift({ id: `n_comp_${Date.now()}_${comp.id}`, date: `Y${year} M${month}`, headline: `🏢 COMPETITOR: ${comp.name} just acquired another major commercial property.`, type: 'neutral' });
                    }
                 } else if (comp.strategy === 'Aggressive acquisitions' || comp.strategy === 'Technology') {
                    newHoldings.businesses += 1;
                    newMonthlyRevenue += 50000 + (Math.random() * 150000);
                    if (Math.random() < 0.3) {
                       news.unshift({ id: `n_comp_${Date.now()}_${comp.id}`, date: `Y${year} M${month}`, headline: `💼 COMPETITOR: ${comp.name} acquired a new ${comp.holdings.focusIndustry || 'startup'} business.`, type: 'neutral' });
                    }
                 }
              }

              return {
                  ...comp,
                  netWorth: newNetWorth,
                  holdings: newHoldings,
                  monthlyRevenue: newMonthlyRevenue
              };
          }).sort((a, b) => b.netWorth - a.netWorth);

          // Evaluate Achievements
          const unlockedAchievements = [...(state.player.unlockedAchievements || [])];
          const checkAchievement = (id: string, condition: boolean) => {
             if (condition && !unlockedAchievements.find(a => a.id === id)) {
                unlockedAchievements.push({ id, date: `Y${year} M${month}`, claimed: false });
                const ach = ACHIEVEMENTS.find(a => a.id === id);
                if (ach) {
                   news.unshift({ id: `n_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`, date: `Y${year} M${month}`, headline: `🏆 ACHIEVEMENT UNLOCKED: ${ach.name} - ${ach.description} (Reward: $${ach.reward.toLocaleString()} waiting to be claimed!)`, type: 'positive' });
                }
             }
          };

          // Net worth checks (approximate within advanceDay, precise in recalculateNetWorth)
          const estNetWorth = newCash + totalPassiveIncome * 12; // Just a rough fallback, actual net worth updates in UI
          const nw = state.player.netWorth; 
          checkAchievement('nw_150k', nw >= 150000);
          checkAchievement('nw_1m', nw >= 1000000);
          checkAchievement('nw_10m', nw >= 10000000);
          checkAchievement('nw_100m', nw >= 100000000);
          checkAchievement('nw_1b', nw >= 1000000000);

          checkAchievement('pi_1k', totalPassiveIncome >= 1000);
          checkAchievement('pi_25k', totalPassiveIncome >= 25000);
          checkAchievement('pi_100k', totalPassiveIncome >= 100000);

          checkAchievement('biz_1', updatedBusinesses.length >= 1);
          checkAchievement('biz_5', updatedBusinesses.length >= 5);
          checkAchievement('biz_10', updatedBusinesses.length >= 10);
          // biz_ipo handled in IPO logic

          checkAchievement('re_1', updatedOwnedProperties.length >= 1);
          checkAchievement('re_10', updatedOwnedProperties.length >= 10);
          const totalReValue = updatedOwnedProperties.reduce((sum, p) => sum + p.price, 0);
          checkAchievement('re_10m', totalReValue >= 10000000);

          const hasLiquidMkt = Object.keys(state.portfolio.stocks || {}).length > 0 || Object.keys(state.portfolio.crypto || {}).length > 0;
          checkAchievement('mkt_1', hasLiquidMkt);

          const totalDebtAmt = updatedLoans.reduce((sum, l) => sum + l.remainingBalance, 0);
          checkAchievement('debt_5m', totalDebtAmt >= 5000000);
          checkAchievement('lux_jet', updatedLuxury.some(l => l?.itemId?.toLowerCase().includes('jet')));

          return {
            time: { ...state.time, year, month, day },
            player: { 
               ...state.player, 
               cash: newCash, 
               passiveIncome: totalPassiveIncome, 
               monthlyExpenses: totalMonthlyExpenses, 
               creditScore: newCreditScore, 
               unlockedAchievements,
               profile: { ...currentProfile, xp: newXp, level: newLevel, skillPoints: newSkillPoints },
               skills: state.player.skills || { business: 1, investment: 1, negotiation: 1, leadership: 1 }
            },
            portfolio: { ...state.portfolio, bonds: activeBonds, startups: updatedStartups, luxury: updatedLuxury, ip: updatedIp, collectibles: updatedCollectibles },
            startupMarket: { pitches: startupMarketPitches },
            market: marketState,
            cryptoMarket: cryptoState,
            commoditiesMarket: comState,
            realEstate: { ...state.realEstate, marketListings: newMarketListings, ownedProperties: updatedOwnedProperties, cityBuildings: updatedCityBuildings },
            business: { ...state.business, ownedBusinesses: updatedBusinesses, earnouts: updatedEarnouts },
            banking: { ...state.banking, loans: updatedLoans },
            maMarket: { targets: newMATargets },
            economy,
            news: news as any,
            competitors: updatedCompetitors,
            founder: { playerStartups: updatedPlayerStartups },
            inbox: updatedInbox,
            activeOpportunities: updatedOpportunities
          };
        }

        return { time: { ...state.time, year, month, day }, market: marketState, cryptoMarket: cryptoState, commoditiesMarket: comState, activeOpportunities: updatedOpportunities };
      }),

      buyStock: (symbol, quantity) => {
        const state = get();
        const price = state.market.prices[symbol];
        const totalCost = price * quantity;
        if (state.player.cash >= totalCost) {
          const existingPos = state.portfolio.stocks[symbol];
          const oldQty = typeof existingPos === 'number' ? existingPos : (existingPos?.quantity || 0);
          const oldAvgCost = typeof existingPos === 'object' ? existingPos.averageCost : price; // fallback
          
          const newQty = oldQty + quantity;
          const newAvgCost = oldQty === 0 ? price : ((oldQty * oldAvgCost) + totalCost) / newQty;

          set((state) => ({
            player: { ...state.player, cash: state.player.cash - totalCost },
            portfolio: { ...state.portfolio, stocks: { ...state.portfolio.stocks, [symbol]: { quantity: newQty, averageCost: newAvgCost } } }
          }));
          get().recalculateNetWorth();
          return true;
        }
        return false;
      },

      sellStock: (symbol, quantity) => {
        const state = get();
        const existingPos = state.portfolio.stocks[symbol];
        const currentOwned = typeof existingPos === 'number' ? existingPos : (existingPos?.quantity || 0);
        
        if (currentOwned >= quantity) {
          const price = state.market.prices[symbol];
          const totalRevenue = price * quantity;
          const newStocks = { ...state.portfolio.stocks };
          
          const newQty = currentOwned - quantity;
          if (newQty === 0) {
              delete newStocks[symbol];
          } else {
              const avgCost = typeof existingPos === 'object' ? existingPos.averageCost : price;
              newStocks[symbol] = { quantity: newQty, averageCost: avgCost };
          }
          
          set((state) => ({
            player: { ...state.player, cash: state.player.cash + totalRevenue },
            portfolio: { ...state.portfolio, stocks: newStocks }
          }));
          get().recalculateNetWorth();
          return true;
        }
        return false;
      },

      buyCrypto: (symbol, quantity) => {
        const state = get();
        const price = state.cryptoMarket.prices[symbol];
        const totalCost = price * quantity;
        if (state.player.cash >= totalCost) {
          const existingPos = state.portfolio.crypto[symbol];
          const oldQty = typeof existingPos === 'number' ? existingPos : (existingPos?.quantity || 0);
          const oldAvgCost = typeof existingPos === 'object' ? existingPos.averageCost : price;
          
          const newQty = oldQty + quantity;
          const newAvgCost = oldQty === 0 ? price : ((oldQty * oldAvgCost) + totalCost) / newQty;

          set((state) => ({
            player: { ...state.player, cash: state.player.cash - totalCost },
            portfolio: { ...state.portfolio, crypto: { ...state.portfolio.crypto, [symbol]: { quantity: newQty, averageCost: newAvgCost } } }
          }));
          get().recalculateNetWorth();
          return true;
        }
        return false;
      },

      sellCrypto: (symbol, quantity) => {
        const state = get();
        const existingPos = state.portfolio.crypto[symbol];
        const currentOwned = typeof existingPos === 'number' ? existingPos : (existingPos?.quantity || 0);
        
        if (currentOwned >= quantity) {
          const price = state.cryptoMarket.prices[symbol];
          const totalRevenue = price * quantity;
          const newCrypto = { ...state.portfolio.crypto };
          
          const newQty = currentOwned - quantity;
          if (newQty === 0) {
              delete newCrypto[symbol];
          } else {
              const avgCost = typeof existingPos === 'object' ? existingPos.averageCost : price;
              newCrypto[symbol] = { quantity: newQty, averageCost: avgCost };
          }

          set((state) => ({
            player: { ...state.player, cash: state.player.cash + totalRevenue },
            portfolio: { ...state.portfolio, crypto: newCrypto }
          }));
          get().recalculateNetWorth();
          get().recalculateNetWorth();
          return true;
        }
        return false;
      },

      buyCommodity: (symbol, quantity) => {
        const state = get();
        const price = state.commoditiesMarket.prices[symbol];
        const totalCost = price * quantity;
        if (state.player.cash >= totalCost) {
          const existingPos = state.portfolio.commodities[symbol];
          const oldQty = existingPos?.quantity || 0;
          const oldAvgCost = existingPos?.averageCost || price;
          
          const newQty = oldQty + quantity;
          const newAvgCost = oldQty === 0 ? price : ((oldQty * oldAvgCost) + totalCost) / newQty;

          set((state) => ({
            player: { ...state.player, cash: state.player.cash - totalCost },
            portfolio: { ...state.portfolio, commodities: { ...state.portfolio.commodities, [symbol]: { quantity: newQty, averageCost: newAvgCost } } }
          }));
          get().recalculateNetWorth();
          return true;
        }
        return false;
      },

      sellCommodity: (symbol, quantity) => {
        const state = get();
        const existingPos = state.portfolio.commodities[symbol];
        const currentOwned = existingPos?.quantity || 0;
        
        if (currentOwned >= quantity) {
          const price = state.commoditiesMarket.prices[symbol];
          const totalRevenue = price * quantity;
          const newComs = { ...state.portfolio.commodities };
          
          const newQty = currentOwned - quantity;
          if (newQty === 0) {
              delete newComs[symbol];
          } else {
              newComs[symbol] = { quantity: newQty, averageCost: existingPos.averageCost };
          }

          set((state) => ({
            player: { ...state.player, cash: state.player.cash + totalRevenue },
            portfolio: { ...state.portfolio, commodities: newComs }
          }));
          get().recalculateNetWorth();
          return true;
        }
        return false;
      },

      buyBond: (id, principal) => {
         const state = get();
         const bondData = INITIAL_BONDS.find(b => b.id === id);
         if (bondData && state.player.cash >= principal && principal >= bondData.faceValue) {
            set((state) => ({
               player: { ...state.player, cash: state.player.cash - principal },
               portfolio: { 
                 ...state.portfolio, 
                 bonds: [...state.portfolio.bonds, { bondId: id, principal, monthsRemaining: bondData.durationYears * 12 }]
               }
            }));
            get().recalculateNetWorth();
            return true;
         }
         return false;
      },

      investInStartup: (pitchId, amount) => {
         const state = get();
         const pitchIndex = state.startupMarket.pitches.findIndex(p => p.id === pitchId);
         if (pitchIndex > -1) {
             const pitch = state.startupMarket.pitches[pitchIndex];
             if (state.player.cash >= amount && amount >= pitch.investmentRequired) {
                 const equity = amount / pitch.valuation;
                 const expectedExit = (pitch.valuation * pitch.potentialMultiplier) * equity;
                 
                 const newPitches = [...state.startupMarket.pitches];
                 newPitches.splice(pitchIndex, 1);

                 set((state) => ({
                    player: { ...state.player, cash: state.player.cash - amount },
                    startupMarket: { pitches: newPitches },
                    portfolio: {
                       ...state.portfolio,
                       startups: [...state.portfolio.startups, {
                           id: pitch.id,
                           name: pitch.name,
                           industry: pitch.industry,
                           investedAmount: amount,
                           equityOwned: equity,
                           monthsRemaining: pitch.monthsToExit,
                           status: 'Active',
                           exitValue: expectedExit,
                           successProbability: pitch.successProbability
                       } as OwnedStartup]
                    }
                 }));
                 get().recalculateNetWorth();
                 return true;
             }
         }
         return false;
      },

      buyLuxuryItem: (itemId) => {
         const state = get();
         const item = INITIAL_LUXURY_ITEMS.find(i => i.id === itemId);
         if (item && state.player.cash >= item.price) {
             set((state) => ({
                 player: { ...state.player, cash: state.player.cash - item.price },
                 portfolio: {
                     ...state.portfolio,
                     luxury: [...state.portfolio.luxury, {
                         itemId: item.id,
                         purchasePrice: item.price,
                         currentValue: item.price,
                         monthsOwned: 0
                     }]
                 }
             }));
             get().recalculateNetWorth();
             return true;
         }
         return false;
      },

      sellLuxuryItem: (itemId) => {
         const state = get();
         const itemIndex = state.portfolio.luxury.findIndex(i => i.itemId === itemId);
         if (itemIndex > -1) {
             const item = state.portfolio.luxury[itemIndex];
             const newLuxury = [...state.portfolio.luxury];
             newLuxury.splice(itemIndex, 1);

             set((state) => ({
                 player: { ...state.player, cash: state.player.cash + item.currentValue },
                 portfolio: { ...state.portfolio, luxury: newLuxury }
             }));
             get().recalculateNetWorth();
             return true;
         }
         return false;
      },

      buyIP: (ipId) => {
         const state = get();
         const ip = INITIAL_IP.find(i => i.id === ipId);
         if (ip && state.player.cash >= ip.basePrice) {
            set((state) => ({
               player: { ...state.player, cash: state.player.cash - ip.basePrice },
               portfolio: { ...state.portfolio, ip: [...(state.portfolio.ip || []), { ipId, purchasePrice: ip.basePrice, currentRoyalty: ip.monthlyRoyalty }] }
            }));
            get().recalculateNetWorth();
            return true;
         }
         return false;
      },

      sellIP: (ipId) => {
         const state = get();
         const ipIndex = (state.portfolio.ip || []).findIndex(i => i.ipId === ipId);
         if (ipIndex > -1) {
            const ip = state.portfolio.ip[ipIndex];
            const newIp = [...state.portfolio.ip];
            newIp.splice(ipIndex, 1);
            
            // Sell for a bit less than purchase or proportional to royalty
            const sellPrice = ip.purchasePrice * (ip.currentRoyalty / (INITIAL_IP.find(i=>i.id===ipId)?.monthlyRoyalty || 1));
            
            set((state) => ({
               player: { ...state.player, cash: state.player.cash + sellPrice },
               portfolio: { ...state.portfolio, ip: newIp }
            }));
            get().recalculateNetWorth();
            return true;
         }
         return false;
      },

      buyCollectible: (colId) => {
         const state = get();
         const col = INITIAL_COLLECTIBLES.find(c => c.id === colId);
         if (col && state.player.cash >= col.basePrice) {
            set((state) => ({
               player: { ...state.player, cash: state.player.cash - col.basePrice },
               portfolio: { ...state.portfolio, collectibles: [...(state.portfolio.collectibles || []), { collectibleId: colId, purchasePrice: col.basePrice, currentValue: col.basePrice }] }
            }));
            get().recalculateNetWorth();
            return true;
         }
         return false;
      },

      sellCollectible: (colId) => {
         const state = get();
         const colIndex = (state.portfolio.collectibles || []).findIndex(c => c.collectibleId === colId);
         if (colIndex > -1) {
            const col = state.portfolio.collectibles[colIndex];
            const newCols = [...state.portfolio.collectibles];
            newCols.splice(colIndex, 1);
            
            set((state) => ({
               player: { ...state.player, cash: state.player.cash + col.currentValue },
               portfolio: { ...state.portfolio, collectibles: newCols }
            }));
            get().recalculateNetWorth();
            return true;
         }
         return false;
      },

      refreshPropertyMarket: () => set((state) => ({ realEstate: { ...state.realEstate, marketListings: Array(6).fill(null).map(() => generateRandomProperty()) } })),

      buyProperty: (id) => {
        const state = get();
        const property = state.realEstate.marketListings.find(p => p.id === id);
        if (property) {
            const negotiationDiscount = 1 - ((state.player.skills?.negotiation || 1) * 0.015); // Up to 15% discount
            const finalPrice = property.price * negotiationDiscount;
            
            if (state.player.cash >= finalPrice) {
               const newOwned: OwnedProperty = { ...property, purchasePrice: finalPrice, purchaseDate: `Y${state.time.year} M${state.time.month}`, occupancyRate: 0.95 };
               set((state) => ({
                   player: { ...state.player, cash: state.player.cash - finalPrice },
                   realEstate: { marketListings: state.realEstate.marketListings.filter(p => p.id !== id), ownedProperties: [...state.realEstate.ownedProperties, newOwned] }
               }));
               get().recalculateNetWorth();
               return true;
            }
        }
        return false;
      },

      sellProperty: (id) => {
        const state = get();
        const propertyIndex = state.realEstate.ownedProperties.findIndex(p => p.id === id);
        if (propertyIndex >= 0) {
            const property = state.realEstate.ownedProperties[propertyIndex];
            const revenue = property.price * 0.95; 
            const newOwned = [...state.realEstate.ownedProperties];
            newOwned.splice(propertyIndex, 1);
            set((state) => ({
                player: { ...state.player, cash: state.player.cash + revenue },
                realEstate: { ...state.realEstate, ownedProperties: newOwned }
            }));
            get().recalculateNetWorth();
            return true;
        }
        return false;
      },

      createBusiness: (name, industry, investment) => {
        const state = get();
        const template = BUSINESS_TEMPLATES[industry];
        if (state.player.cash >= investment && investment >= template.minInvestment) {
          const newBusiness: OwnedBusiness = {
            id: `biz_${Math.random().toString(36).substr(2, 9)}`, name, industry, level: 1, employees: 1, executives: [], marketingBudget: 500, productPriceMultiplier: 1.0,
            lastMonthRevenue: 0, lastMonthExpenses: 0, lastMonthProfit: 0, customerSatisfaction: 80, brandValue: 10,
          } as any;
          set((state) => ({ player: { ...state.player, cash: state.player.cash - investment }, business: { ...state.business, ownedBusinesses: [...state.business.ownedBusinesses, newBusiness] } }));
          get().recalculateNetWorth();
          return true;
        }
        return false;
      },

      updateBusinessSettings: (id, marketing, priceMultiplier) => set((state) => ({ business: { ...state.business, ownedBusinesses: state.business.ownedBusinesses.map(biz => biz.id === id ? { ...biz, marketingBudget: marketing, productPriceMultiplier: priceMultiplier } : biz) } })),
      hireEmployee: (id) => set((state) => ({ business: { ...state.business, ownedBusinesses: state.business.ownedBusinesses.map(biz => biz.id === id ? { ...biz, employees: biz.employees + 1 } : biz) } })),
            expandBusiness: (id: string, cost: number) => {
         const state = get();
         const biz = state.business.ownedBusinesses.find(b => b.id === id);
         if (biz && state.player.cash >= cost) {
            set({
               player: { ...state.player, cash: state.player.cash - cost },
               business: {
                  ...state.business,
                  ownedBusinesses: state.business.ownedBusinesses.map(b => 
                     b.id === id ? { ...b, level: (b.level || 1) + 1 } : b
                  )
               }
            });
            return true;
         }
         return false;
      },
      fireEmployee: (id) => set((state) => ({ business: { ...state.business, ownedBusinesses: state.business.ownedBusinesses.map(biz => biz.id === id && biz.employees > 1 ? { ...biz, employees: biz.employees - 1 } : biz) } })),
      
      hireExecutive: (bizId, role) => set((state) => {
         const bizIndex = state.business.ownedBusinesses.findIndex(b => b.id === bizId);
         if (bizIndex === -1) return state;
         
         const biz = state.business.ownedBusinesses[bizIndex];
         // Only one executive per role allowed per business
         if ((biz.executives || []).some(e => e.role === role)) return state;

         const newExec = generateRandomExecutive(role);
         
         const updatedBiz = { ...biz, executives: [...(biz.executives || []), newExec] };
         const updatedBusinesses = [...state.business.ownedBusinesses];
         updatedBusinesses[bizIndex] = updatedBiz;
         
         const newNews = [...state.news];
         newNews.unshift({ id: `n_${Date.now()}_exec`, date: `Y${state.time.year} M${state.time.month}`, headline: `Hired ${newExec.name} as ${role} for ${biz.name}.`, type: 'positive' });
         if (newNews.length > 15) newNews.pop();

         return { business: { ...state.business, ownedBusinesses: updatedBusinesses }, news: newNews };
      }),

      fireExecutive: (bizId, execId) => set((state) => {
         const bizIndex = state.business.ownedBusinesses.findIndex(b => b.id === bizId);
         if (bizIndex === -1) return state;
         
         const biz = state.business.ownedBusinesses[bizIndex];
         const updatedBiz = { ...biz, executives: (biz.executives || []).filter(e => e.id !== execId) };
         
         const updatedBusinesses = [...state.business.ownedBusinesses];
         updatedBusinesses[bizIndex] = updatedBiz;

         return { business: { ...state.business, ownedBusinesses: updatedBusinesses } };
      }),

      refreshMAMarket: () => set((state) => ({ 
         maMarket: { targets: Array(3).fill(null).map(() => generateAcquisitionTarget()) } 
      })),

      buyBusinessMA: (targetId, offerType, offerValue) => {
         const state = get();
         const targetIndex = state.maMarket.targets.findIndex(t => t.id === targetId);
         if (targetIndex === -1) return { success: false, message: 'Target not found' };
         
         const target = state.maMarket.targets[targetIndex];
         const negSkill = state.player.skills?.negotiation || 1;
         
         // Base acceptance probability based on offer vs asking
         let acceptanceProb = 0.5;
         
         if (offerType === 'Cash') {
            if (state.player.cash < offerValue) return { success: false, message: 'Not enough cash' };
            acceptanceProb += (offerValue / target.askingPrice) - 1.0; 
            acceptanceProb += (negSkill * 0.05); // High negotiation helps
            if (target.sellerMotivation === 'Desperate') acceptanceProb += 0.3;
            if (target.sellerMotivation === 'Greedy') acceptanceProb -= 0.2;
         } else if (offerType === 'Loan') {
            // Cash + Loan = offerValue is the TOTAL offer. Player pays 20% down.
            const downPayment = offerValue * 0.2;
            const loanAmount = offerValue * 0.8;
            if (state.player.cash < downPayment) return { success: false, message: 'Not enough cash for 20% down payment' };
            
            acceptanceProb += (offerValue / target.askingPrice) - 1.05; // Sellers dislike loans slightly
            acceptanceProb += (negSkill * 0.04);
            if (target.sellerMotivation === 'Desperate') acceptanceProb += 0.4; // Desperate sellers love quick financing
         } else if (offerType === 'Earnout') {
            // Earnout = 30% upfront, rest paid over 3 years
            const upfront = offerValue * 0.3;
            if (state.player.cash < upfront) return { success: false, message: 'Not enough cash for 30% upfront' };
            
            acceptanceProb += (offerValue / target.askingPrice) - 1.15; // Sellers hate earnouts
            acceptanceProb += (negSkill * 0.06); // High negotiation makes earnouts possible
            if (target.sellerMotivation === 'Greedy') acceptanceProb += 0.2; // Greedy sellers want the big final number
         }

         if (Math.random() > acceptanceProb && offerValue < target.askingPrice * 1.5) {
            return { success: false, message: `Offer rejected. Seller felt the terms were inadequate.` };
         }

         // Offer Accepted!
         let newCash = state.player.cash;
         let newLoans = [...state.banking.loans];
         let newEarnouts = [...(state.business.earnouts || [])];

         if (offerType === 'Cash') {
            newCash -= offerValue;
         } else if (offerType === 'Loan') {
            newCash -= (offerValue * 0.2);
            const loanAmount = offerValue * 0.8;
            const hqBankBonus = state.player.hq?.modules.includes('Private Bank') ? 0.02 : 0; // 2% reduction
            const finalRate = Math.max(0.01, state.economy.interestRateBase + 0.04 - hqBankBonus);
            
            newLoans.push({
               id: `loan_${Math.random().toString(36).substr(2, 9)}`, type: 'Business', principal: loanAmount, remainingBalance: loanAmount, 
               interestRate: finalRate, monthlyPayment: (loanAmount * finalRate) / 12 + (loanAmount/60), 
               termMonths: 60, monthsPaid: 0
            });
         } else if (offerType === 'Earnout') {
            newCash -= (offerValue * 0.3);
            const earnoutAmount = offerValue * 0.7;
            newEarnouts.push({
               id: `earn_${Math.random().toString(36).substr(2, 9)}`, businessName: target.name, totalAmount: earnoutAmount, remainingAmount: earnoutAmount,
               monthlyPayment: earnoutAmount / 36 // Paid over 3 years
            });
         }

         const newBusiness: OwnedBusiness = {
            id: `biz_${Math.random().toString(36).substr(2, 9)}`, name: target.name, industry: target.industry, level: target.level, 
            employees: target.employees, executives: [], marketingBudget: 1000, productPriceMultiplier: 1.0,
            lastMonthRevenue: target.lastMonthRevenue, lastMonthExpenses: target.lastMonthRevenue - target.lastMonthProfit, 
            lastMonthProfit: target.lastMonthProfit, brandValue: target.brandValue, customerSatisfaction: 80
         } as any;

         const newTargets = [...state.maMarket.targets];
         newTargets.splice(targetIndex, 1);

         set((state) => ({
            player: { ...state.player, cash: newCash },
            banking: { ...state.banking, loans: newLoans },
            business: { ...state.business, ownedBusinesses: [...state.business.ownedBusinesses, newBusiness], earnouts: newEarnouts },
            maMarket: { targets: newTargets },
            news: [{ id: `n_${Date.now()}_ma`, date: `Y${state.time.year} M${state.time.month}`, headline: `Acquired ${target.name} for $${offerValue.toLocaleString()} via ${offerType}`, type: 'positive' }, ...state.news].slice(0,15)
         }));
         
         get().recalculateNetWorth();
         return { success: true, message: `Acquisition successful!` };
      },

      upgradeHQ: () => {
         const state = get();
         const hq = state.player.hq || { level: 1, modules: [] };
         const upgradeCosts: Record<number, number> = {
           1: 250000,
           2: 1500000,
           3: 10000000,
           4: 50000000,
           5: 250000000
         };
         
         if (hq.level < 6 && state.player.cash >= upgradeCosts[hq.level]) {
            set((state) => ({
               player: { 
                  ...state.player, 
                  cash: state.player.cash - upgradeCosts[hq.level],
                  hq: { ...hq, level: hq.level + 1 } 
               }
            }));
            return true;
         }
         return false;
      },

      buildHQModule: (module, cost) => {
         const state = get();
         const hq = state.player.hq || { level: 1, modules: [] };
         
         if (state.player.cash >= cost && !hq.modules.includes(module)) {
            set((state) => ({
               player: { 
                  ...state.player, 
                  cash: state.player.cash - cost,
                  hq: { ...hq, modules: [...hq.modules, module] } 
               }
            }));
            return true;
         }
         return false;
      },

      takeLoan: (amount, termYears, type) => {
          const state = get();
          const baseRate = state.economy.interestRateBase;
          const creditMultiplier = (700 - state.player.creditScore) / 1000;
          const hqBankBonus = state.player.hq?.modules.includes('Private Bank') ? 0.02 : 0;
          let interestRate = Math.max(0.01, baseRate + creditMultiplier - hqBankBonus);
          if (type === 'Personal') interestRate += 0.05;
          if (type === 'Mortgage') interestRate -= 0.02;
          const termMonths = termYears * 12;
          const monthlyRate = interestRate / 12;
          const monthlyPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
          const newLoan: BankLoan = { id: `loan_${Math.random().toString(36).substr(2, 9)}`, type, principal: amount, remainingBalance: amount, interestRate, monthlyPayment, termMonths, monthsPaid: 0 };
          set(state => ({ player: { ...state.player, cash: state.player.cash + amount }, banking: { loans: [...state.banking.loans, newLoan] } }));
          get().recalculateNetWorth();
          return true;
      },

      payDownLoan: (id, amount) => {
          const state = get();
          const loanIndex = state.banking.loans.findIndex(l => l.id === id);
          if (loanIndex >= 0 && state.player.cash >= amount) {
              const loan = state.banking.loans[loanIndex];
              const newLoans = [...state.banking.loans];
              if (amount >= loan.remainingBalance) newLoans.splice(loanIndex, 1);
              else newLoans[loanIndex] = { ...loan, remainingBalance: loan.remainingBalance - amount };
              set(state => ({ player: { ...state.player, cash: state.player.cash - amount }, banking: { loans: newLoans } }));
              get().recalculateNetWorth();
              return true;
          }
          return false;
      },

      recalculateNetWorth: () => set((state) => {
        let stocksValue = 0;
        Object.entries(state.portfolio.stocks || {}).forEach(([symbol, pos]) => { 
            const qty = typeof pos === 'number' ? pos : pos.quantity;
            stocksValue += state.market.prices[symbol] * qty; 
        });
        
        let cryptoValue = 0;
        Object.entries(state.portfolio.crypto || {}).forEach(([symbol, pos]) => { 
            const qty = typeof pos === 'number' ? pos : pos.quantity;
            const price = state.cryptoMarket?.prices ? state.cryptoMarket.prices[symbol] : 0;
            cryptoValue += price * qty; 
        });

        let comValue = 0;
        Object.entries(state.portfolio.commodities || {}).forEach(([symbol, pos]) => { 
            const price = state.commoditiesMarket?.prices ? state.commoditiesMarket.prices[symbol] : 0;
            comValue += price * pos.quantity; 
        });

        let bondValue = 0;
        (state.portfolio.bonds || []).forEach(bond => { bondValue += bond.principal; });
        
        let startupValue = 0;
        (state.portfolio.startups || []).forEach(su => {
            if (su.status === 'Active') {
                startupValue += su.investedAmount; // conservatively value at cost basis until exit
            }
        });
        
        let luxuryValue = 0;
        (state.portfolio.luxury || []).forEach(lux => { luxuryValue += lux.currentValue; });

        let ipValue = 0;
        (state.portfolio.ip || []).forEach(ip => { ipValue += ip.purchasePrice * (ip.currentRoyalty / (INITIAL_IP.find(i=>i.id===ip.ipId)?.monthlyRoyalty || 1)); });
        
        let colValue = 0;
        (state.portfolio.collectibles || []).forEach(col => { colValue += col.currentValue; });

        let reValue = 0;
        state.realEstate.ownedProperties.forEach(prop => { reValue += prop.price; });
        let bizValue = 0;
        state.business.ownedBusinesses.forEach(biz => { bizValue += Math.max(10000, biz.lastMonthProfit * 12 * 3); });
        let totalDebt = 0;
        state.banking.loans.forEach(loan => { totalDebt += loan.remainingBalance; });

        const newNetWorth = state.player.cash + stocksValue + cryptoValue + comValue + bondValue + startupValue + luxuryValue + ipValue + colValue + reValue + bizValue - totalDebt; 
        
        const newMilestones = { ...state.player.milestones };
        if (newNetWorth >= 1000000 && !newMilestones.millionaire) {
           newMilestones.millionaire = true;
           get().time.isPaused = true; // Pause to show achievement
        }
        if (newNetWorth >= 1000000000 && !newMilestones.billionaire) {
           newMilestones.billionaire = true;
           get().time.isPaused = true;
        }

        return { player: { ...state.player, netWorth: newNetWorth, milestones: newMilestones } };
      }),

      claimAchievementReward: (id: string) => set((state) => {
        const achIndex = state.player.unlockedAchievements?.findIndex(a => a.id === id);
        if (achIndex === undefined || achIndex === -1) return state;
        
        const achRef = state.player.unlockedAchievements[achIndex];
        if (achRef.claimed) return state; // Already claimed

        const baseAch = ACHIEVEMENTS.find(a => a.id === id);
        if (!baseAch) return state;

        const newAchievements = [...state.player.unlockedAchievements];
        newAchievements[achIndex] = { ...achRef, claimed: true };

        const newNews = [...state.news];
        newNews.unshift({ id: `n_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`, date: `Y${state.time.year} M${state.time.month}`, headline: `💰 CLAIMED: $${baseAch.reward.toLocaleString()} added to your account for completing ${baseAch.name}!`, type: 'positive' });
        if (newNews.length > 15) newNews.pop();

        return { 
          player: { ...state.player, cash: state.player.cash + baseAch.reward, unlockedAchievements: newAchievements },
          news: newNews
        };
      }),

      resolveEvent: (optionId: string) => set((state) => {
        if (!state.player.activeEvent) return state;

        let newCash = state.player.cash;
        let newEconomy = { ...state.economy };
        const newNews = [...state.news];

        switch(optionId) {
           case 'opt_sell':
              newCash += 50000;
              break;
           case 'opt_bailout':
              newCash -= 10000;
              newEconomy.interestRateBase -= 0.01;
              break;
           case 'opt_market_push':
              newCash -= 15000;
              break;
           case 'opt_invest':
              newCash -= 50000;
              break;
        }

        newNews.unshift({ id: `n_${Date.now()}_evt`, date: `Y${state.time.year} M${state.time.month}`, headline: `Action Taken: Responded to ${state.player.activeEvent.title}.`, type: 'economy' });
        if (newNews.length > 15) newNews.pop();

        return {
           player: { ...state.player, cash: newCash, activeEvent: null },
           economy: newEconomy,
           news: newNews
        };
      }),

      allocateSkillPoint: (skill: keyof PlayerSkills) => set((state) => {
         const currentProfile = state.player.profile || { name: 'The Founder', age: 25, level: 1, xp: 0, reputation: 50, skillPoints: 0 };
         const currentSkills = state.player.skills || { business: 1, investment: 1, negotiation: 1, leadership: 1 };
         
         if (currentProfile.skillPoints > 0 && currentSkills[skill] < 10) {
            return {
               player: {
                  ...state.player,
                  profile: { ...currentProfile, skillPoints: currentProfile.skillPoints - 1 },
                  skills: { ...currentSkills, [skill]: currentSkills[skill] + 1 }
               }
            };
         }
         return state;
      }),

      updateProfile: (updates: Partial<PlayerProfile>) => set((state) => ({
         player: {
            ...state.player,
            profile: { ...state.player.profile, ...updates }
         }
      })),

      buildCityBuilding: (typeId, cost) => {
         const state = get();
         if (state.player.cash >= cost) {
            const newBuilding: OwnedCityBuilding = {
               id: `cb_${Math.random().toString(36).substr(2, 9)}`,
               typeId,
               status: 'Building',
               daysUntilComplete: require('../lib/cityData').CITY_BUILDINGS.find((c: any) => c.id === typeId)?.buildTimeDays || 90
            };
            set({ 
               player: { ...state.player, cash: state.player.cash - cost },
               realEstate: { ...state.realEstate, cityBuildings: [...(state.realEstate.cityBuildings || []), newBuilding] }
            });
            return true;
         }
         return false;
      },

      resetGame: () => {
        localStorage.removeItem('hasStartedSession');
        window.location.reload(); // Force reload to show landing page
        set({ 
        player: { ...INITIAL_PLAYER_STATE }, time: { ...INITIAL_TIME_STATE }, market: { prices: initialPrices, history: initialHistory }, 
        cryptoMarket: { prices: initialCryptoPrices, history: initialCryptoHistory }, 
        commoditiesMarket: { prices: initialCommodityPrices, history: initialCommodityHistory },
        startupMarket: { pitches: initialStartups },
        portfolio: { stocks: {}, crypto: {}, commodities: {}, bonds: [], startups: [], luxury: [], ip: [], collectibles: [] }, 
        realEstate: { marketListings: initialProperties, ownedProperties: [], cityBuildings: [] }, business: { ownedBusinesses: [], earnouts: [] }, founder: { playerStartups: [] }, inbox: [{ id: 'welcome_email', date: 'Y1 M1 D1', sender: 'Victor King', subject: 'Welcome to the big leagues', body: 'I heard you just got $100,000 in seed capital. Don\'t lose it all in one place. If you ever want to sell a company, give me a call.', isRead: false }], isPhoneOpen: false, banking: { loans: [] },
        economy: { ...INITIAL_ECONOMY_STATE }, competitors: [...INITIAL_COMPETITORS], news: [{ id: 'init', date: 'Y1 M1', headline: 'Welcome to Empire Builder! You have been granted $100,000 to start your journey.', type: 'positive' }]
      });
      },

      unlockCity: (cityId: string, cost: number) => {
         const state = get();
         const cities = state.player.unlockedCities || ['nyc']; // nyc is default
         if (state.player.cash >= cost && !cities.includes(cityId)) {
            set({ player: { ...state.player, cash: state.player.cash - cost, unlockedCities: [...cities, cityId] } });
            return true;
         }
         return false;
      },

      buyOpportunity: (id: string) => {
         const state = get();
         const opp = (state.activeOpportunities || []).find((o: any) => o.id === id);
         if (!opp) return { success: false, message: 'Opportunity expired or not found.' };
         
         if (state.player.cash < opp.askingPrice) {
            return { success: false, message: 'Insufficient capital.' };
         }
         
         const newCash = state.player.cash - opp.askingPrice;
         const remainingOpps = state.activeOpportunities.filter((o: any) => o.id !== id);
         
         // Add asset to portfolio based on type
         const newState: any = {
            player: { ...state.player, cash: newCash },
            activeOpportunities: remainingOpps
         };
         
         if (opp.type === 'RealEstate') {
            const newProp = {
               id: `re_${Date.now()}`,
               name: opp.title,
               price: opp.marketValue,
               monthlyRent: opp.financials.revenue,
               maintenanceCost: opp.financials.debt / 12,
               occupancyRate: 0.6,
               propertyTax: opp.marketValue * 0.01 / 12
            };
            newState.realEstate = { ...state.realEstate, ownedProperties: [...state.realEstate.ownedProperties, newProp] };
         } else {
            const newBiz = {
               id: `biz_${Date.now()}`,
               name: opp.title,
               industry: 'Services', // Generic
               level: 3,
               employees: 100,
               marketingBudget: 5000,
               productPriceMultiplier: 1.0,
               lastMonthRevenue: opp.financials.revenue,
               lastMonthProfit: opp.financials.profit,
               executives: []
            };
            newState.business = { ...state.business, ownedBusinesses: [...state.business.ownedBusinesses, newBiz] };
         }
         
         set(newState);
         return { success: true, message: `Successfully acquired ${opp.title}!` };
      }
    }),
    { name: 'empire-builder-storage' }
  )
);
