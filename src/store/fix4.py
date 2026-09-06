import sys
with open('gameStore.ts', 'r', encoding='utf-8') as f:
    text = f.read()

marker = """          newComPrices[com.symbol] = Number(newPrice.toFixed(2));
          // --- MONTHLY ECONOMY SHIFTS ---"""

injection = """          newComPrices[com.symbol] = Number(newPrice.toFixed(2));
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
          
          // --- MONTHLY ECONOMY SHIFTS ---"""

if marker in text:
    text = text.replace(marker, injection)
    with open('gameStore.ts', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Fixed!")
else:
    print("Marker not found!")
