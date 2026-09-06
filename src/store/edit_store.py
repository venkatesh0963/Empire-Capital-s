import sys
import re

with open('gameStore.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Imports
text = text.replace(
    "import { generateOpportunity, SpecialOpportunity } from '@/lib/opportunityData';",
    "import { generateOpportunity, SpecialOpportunity } from '@/lib/opportunityData';\nimport { PlayerStartup, STARTUP_INDUSTRIES } from '@/lib/founderData';"
)

# 2. Interfaces
text = text.replace(
    "  business: BusinessState;",
    "  business: BusinessState;\n  founder: { playerStartups: PlayerStartup[] };"
)

text = text.replace(
    "  resetGame: () => void;",
    """  resetGame: () => void;
  foundStartup: (name: string, industryId: string, initialCapital: number) => void;
  investInStartup: (id: string, amount: number) => void;
  hireStartupEmployee: (id: string, role: 'developer' | 'marketer', count: number) => void;
  launchStartupProduct: (id: string) => void;
  sellStartup: (id: string) => void;"""
)

# 3. Store Initialization
text = text.replace(
    "      business: { ownedBusinesses: [], earnouts: [] },",
    "      business: { ownedBusinesses: [], earnouts: [] },\n      founder: { playerStartups: [] },"
)

# 4. Store resetGame
text = text.replace(
    "business: { ownedBusinesses: [], earnouts: [] }, banking:",
    "business: { ownedBusinesses: [], earnouts: [] }, founder: { playerStartups: [] }, banking:"
)

# 5. Actions
actions_injection = """
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

      investInStartup: (id, amount) => set((state) => {
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

      advanceDay:"""

text = text.replace("      advanceDay:", actions_injection)

# 6. advanceDay return hook
text = text.replace(
    "            news,\n            competitors: updatedCompetitors,",
    "            news,\n            competitors: updatedCompetitors,\n            founder: { playerStartups: (state.founder?.playerStartups || []) },"
)

with open('gameStore.ts', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated gameStore with founder actions!")
