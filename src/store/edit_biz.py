import sys
import re

with open('gameStore.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add to interface
interface_marker = "  updateBusinessSettings: (id: string, marketing: number, price: number) => void;"
interface_injection = "  updateBusinessSettings: (id: string, marketing: number, price: number) => void;\n  expandBusiness: (id: string, amount: number) => void;"
if interface_marker in text and "expandBusiness: (" not in text:
    text = text.replace(interface_marker, interface_injection)

# 2. Add implementation
impl_marker = "      updateBusinessSettings: (id, marketing, price) => set((state) => ({"
impl_injection = """      expandBusiness: (id, amount) => set((state) => {
         if (state.player.cash < amount) return state;
         return {
            player: { ...state.player, cash: state.player.cash - amount },
            business: {
               ...state.business,
               ownedBusinesses: state.business.ownedBusinesses.map(b => 
                  b.id === id ? { ...b, level: (b.level || 1) + 1 } : b
               )
            }
         };
      }),

      updateBusinessSettings: (id, marketing, price) => set((state) => ({"""
if impl_marker in text and "expandBusiness: (id, amount)" not in text:
    text = text.replace(impl_marker, impl_injection)

# 3. Update the advanceDay loop to use biz.level
loop_marker = "const revenue = template.baseRevenue * biz.productPriceMultiplier * marketingEffect * priceEffect * employeeEffect * randomMarketFluctuation * economy.demandMultiplier * ceoLeadershipBonus * execSalesBonus * hqResearchBonus;"
loop_injection = "const bizLevelMult = (biz.level || 1);\n            const revenue = template.baseRevenue * bizLevelMult * biz.productPriceMultiplier * marketingEffect * priceEffect * employeeEffect * randomMarketFluctuation * economy.demandMultiplier * ceoLeadershipBonus * execSalesBonus * hqResearchBonus;"
if loop_marker in text:
    text = text.replace(loop_marker, loop_injection)

loop_marker_2 = "const payroll = (biz.employees * template.basePayroll * economy.inflationMultiplier * avgSalaryMult) + execPayroll;"
loop_injection_2 = "const payroll = (biz.employees * template.basePayroll * economy.inflationMultiplier * avgSalaryMult * bizLevelMult) + execPayroll;"
if loop_marker_2 in text:
    text = text.replace(loop_marker_2, loop_injection_2)

with open('gameStore.ts', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated gameStore with expandBusiness")
