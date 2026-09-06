import sys
with open('gameStore.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import_marker = "import { OwnedCityBuilding } from '@/lib/cityData';"
import_injection = "\nimport { generateOpportunity, SpecialOpportunity } from '@/lib/opportunityData';"
text = text.replace(import_marker, import_marker + import_injection)

marker = """          const history = [...newComHistory[com.symbol], newPrice];
          if (history.length > 30) history.shift();
          newComHistory[com.symbol] = history;
        });

        const marketState = { prices: newPrices, history: newHistory };
        const cryptoState = { prices: newCryptoPrices, history: newCryptoHistory };
        const comState = { prices: newComPrices, history: newComHistory };"""

injection = """

        // --- SPECIAL OPPORTUNITIES ---
        let updatedOpportunities = (state.activeOpportunities || []).map(opp => ({
           ...opp,
           daysRemaining: opp.daysRemaining - 1
        })).filter(opp => opp.daysRemaining > 0);

        if (Math.random() < 0.05 && updatedOpportunities.length < 3) { // 5% chance daily
           const newOpp = generateOpportunity();
           updatedOpportunities.push(newOpp);
           news.unshift({ id: `n_opp_${Date.now()}`, date: `Y${year} M${month}`, headline: `💎 OPPORTUNITY: ${newOpp.title} available for the next ${newOpp.daysRemaining} days!`, type: 'positive' });
        }"""

text = text.replace(marker, marker + injection)

return_marker1 = """            competitors: updatedCompetitors
          };
        }

        return { time: { ...state.time, year, month, day }, market: marketState, cryptoMarket: cryptoState, commoditiesMarket: comState };"""
        
return_injection1 = """            competitors: updatedCompetitors,
            activeOpportunities: updatedOpportunities
          };
        }

        return { time: { ...state.time, year, month, day }, market: marketState, cryptoMarket: cryptoState, commoditiesMarket: comState, activeOpportunities: updatedOpportunities };"""

text = text.replace(return_marker1, return_injection1)

with open('gameStore.ts', 'w', encoding='utf-8') as f:
    f.write(text)
print("Injected Opportunities cleanly!")
