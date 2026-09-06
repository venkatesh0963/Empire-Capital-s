const fs = require('fs');
const file = 'gameStore.ts';
let content = fs.readFileSync(file, 'utf8');

const marker = '          if (newPrice < 0.01) newPrice = 0.01;\n          newComPrices[com.symbol] = Number(newPrice.toFixed(2));';

const injection = `
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
           const { generateOpportunity } = require('../lib/opportunityData');
           const newOpp = generateOpportunity();
           updatedOpportunities.push(newOpp);
           news.unshift({ id: \`n_opp_\${Date.now()}\`, date: \`Y\${year} M\${month}\`, headline: \`💎 OPPORTUNITY: \${newOpp.title} available for the next \${newOpp.daysRemaining} days!\`, type: 'positive' });
        }

        if (day > 30) {
          day = 1;
          month++;
`;

content = content.replace(marker + '\n          // --- MONTHLY ECONOMY SHIFTS ---', marker + '\n' + injection + '\n          // --- MONTHLY ECONOMY SHIFTS ---');
fs.writeFileSync(file, content);
console.log('Fixed2!');
