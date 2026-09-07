const fs = require('fs');
let code = fs.readFileSync('src/store/gameStore.ts', 'utf8');

const marketUpdateLogic = `        let marketDrift = 0;
        let cryptoDrift = 0; // Crypto reacts wildly to economy
        if (economy.status === 'BOOM') { marketDrift = 0.001; cryptoDrift = 0.003; }
        if (economy.status === 'RECESSION') { marketDrift = -0.001; cryptoDrift = -0.004; }
        if (economy.status === 'CRISIS') { marketDrift = -0.003; cryptoDrift = -0.008; }

        // Update Stocks
        let activeCatalyst: typeof STOCK_CATALYSTS[0] | null = null;
        if (Math.random() < 0.05) { // 5% chance daily for a major news catalyst
           activeCatalyst = STOCK_CATALYSTS[Math.floor(Math.random() * STOCK_CATALYSTS.length)];
           news.unshift({ id: \`news_\${Date.now()}_\${activeCatalyst.id}\`, date: \`Y\${year} M\${month} D\${day}\`, headline: activeCatalyst.headline, type: (activeCatalyst.impactMultiplier > 1 ? 'positive' : 'negative') as 'positive' | 'negative' });
        }

        INITIAL_STOCKS.forEach(stock => {
          let catalystEffect = 0;
          if (activeCatalyst && activeCatalyst.symbol === stock.symbol) {
             catalystEffect = activeCatalyst.impactMultiplier - 1; // e.g. 1.15 - 1 = 0.15
          }
          const currentPrice = newPrices[stock.symbol];
          const meanReversion = (stock.basePrice - currentPrice) / stock.basePrice * 0.005; // Gentle pull towards base
          const changePercent = ((Math.random() * 2 - 1) * stock.volatility) + marketDrift + catalystEffect + meanReversion;
          
          let newPrice = currentPrice * (1 + changePercent);
          if (newPrice < stock.basePrice * 0.1) newPrice = stock.basePrice * 0.1; // Max 90% drop floor
          if (newPrice > stock.basePrice * 10) newPrice = stock.basePrice * 10; // Max 10x ceiling
          
          newPrices[stock.symbol] = Number(newPrice.toFixed(2));
          const history = [...newHistory[stock.symbol], newPrice];
          if (history.length > 30) history.shift();
          newHistory[stock.symbol] = history;
        });

        // Update Crypto
        INITIAL_CRYPTO.forEach(coin => {
          let spike = 0;
          if (Math.random() < 0.02) spike = (Math.random() * 0.3) * (Math.random() > 0.5 ? 1 : -1);
          
          const currentPrice = newCryptoPrices[coin.symbol];
          const meanReversion = (coin.basePrice - currentPrice) / coin.basePrice * 0.005;
          const changePercent = ((Math.random() * 2 - 1) * coin.volatility) + cryptoDrift + spike + meanReversion;
          
          let newPrice = currentPrice * (1 + changePercent);
          if (newPrice < coin.basePrice * 0.01) newPrice = coin.basePrice * 0.01; // Can drop 99%
          if (newPrice > coin.basePrice * 50) newPrice = coin.basePrice * 50; // Can moon 50x
          
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
          if (economy.status === 'BOOM') ecoEffect = 0.002 * com.economySensitivity;
          if (economy.status === 'CRISIS' || economy.status === 'RECESSION') ecoEffect = -0.003 * com.economySensitivity;
          
          const currentPrice = newComPrices[com.symbol];
          const meanReversion = (com.basePrice - currentPrice) / com.basePrice * 0.01; // Stronger pull to base
          const changePercent = ((Math.random() * 2 - 1) * com.volatility) + ecoEffect + meanReversion;
          
          let newPrice = currentPrice * (1 + changePercent);
          if (newPrice < com.basePrice * 0.2) newPrice = com.basePrice * 0.2; // Commodities don't drop as far
          if (newPrice > com.basePrice * 5) newPrice = com.basePrice * 5; // Nor do they moon as high
          
          newComPrices[com.symbol] = Number(newPrice.toFixed(2));
          const history = [...newComHistory[com.symbol], newPrice];
          if (history.length > 30) history.shift();
          newComHistory[com.symbol] = history;
        });`;

const startIdx = code.indexOf('        let marketDrift = 0;');
const endIdx = code.indexOf('        const marketState = { prices: newPrices, history: newHistory };');

if (startIdx !== -1 && endIdx !== -1) {
  code = code.substring(0, startIdx) + marketUpdateLogic + '\n' + code.substring(endIdx);
  fs.writeFileSync('src/store/gameStore.ts', code);
  console.log('Fixed market logic!');
} else {
  console.log('Could not find injection point', startIdx, endIdx);
}
