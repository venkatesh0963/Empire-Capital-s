import sys

with open('gameStore.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# We need to replace the gap between initialCryptoPrices and unlockedCities.forEach
marker = "const initialCryptoPrices: Record<string, number> = {};"
marker_end = "        });"

start_idx = text.find(marker)
end_idx = text.find("const avgTaxRate", start_idx)

if start_idx == -1 or end_idx == -1:
    print("Markers not found")
    sys.exit(1)

injection = """const initialCryptoPrices: Record<string, number> = {};
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
        let totalTax = 0;
        let totalSalaryMult = 0;
        unlockedCities.forEach(cid => {
           const city = GLOBAL_CITIES.find(c => c.id === cid) || GLOBAL_CITIES[0];
           totalTax += city.taxRate;
           totalSalaryMult += city.salaryMultiplier;
        });
"""

# Find where the messed up block starts and ends
# start_idx is at "const initialCryptoPrices: Record<string, number> = {};"
# end_idx is at "const avgTaxRate ="
# We need to replace everything in between.
new_text = text[:start_idx] + injection + text[end_idx:]

with open('gameStore.ts', 'w', encoding='utf-8') as f:
    f.write(new_text)
print("Repaired!")
