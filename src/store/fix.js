const fs = require('fs');
const file = 'gameStore.ts';
let content = fs.readFileSync(file, 'utf8');

// Find INITIAL_COMMODITIES.forEach...
const marker1 = 'INITIAL_COMMODITIES.forEach(com => { initialCommodityPrices[com.symbol] = com.basePrice; initialCommodityHistory[com.symbol] = [com.basePrice]; });';

const injection = `
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
      banking: { loans: [] },
      economy: { ...INITIAL_ECONOMY_STATE },
      competitors: [...INITIAL_COMPETITORS],
      news: [{ id: 'init', date: 'Y1 M1', headline: 'Welcome to Empire Builder! You have been granted $100,000 to start your journey.', type: 'positive' }],
      maMarket: { targets: [] },
      activeOpportunities: [],

      togglePause: () => set((state) => ({ time: { ...state.time, isPaused: !state.time.isPaused } })),
      setSpeed: (speed) => set((state) => ({ time: { ...state.time, speed } })),

      advanceDay: () => set((state) => {
        let { year, month, day } = state.time;
        day++;
        
        let newCash = state.player.cash;
        let newCreditScore = state.player.creditScore;
        let economy = { ...state.economy };
        let news = [...state.news];

        // --- GLOBAL EXPANSION CALCS ---
        const unlockedCities = state.player.unlockedCities || ['nyc'];
        let totalTax = 0;`;

content = content.replace(marker1 + '\n\n        let totalSalaryMult = 0;', marker1 + '\n' + injection + '\n        let totalSalaryMult = 0;');
fs.writeFileSync(file, content);
console.log('Fixed!');
