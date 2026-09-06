import sys
with open('gameStore.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Add INITIAL_COMMODITIES to imports if not there
if "INITIAL_COMMODITIES" not in text:
    text = text.replace(
        "import { INITIAL_CRYPTO, initialCryptoPrices, initialCryptoHistory } from '@/lib/cryptoData';",
        "import { INITIAL_CRYPTO, initialCryptoPrices, initialCryptoHistory } from '@/lib/cryptoData';\nimport { INITIAL_COMMODITIES, initialCommodityPrices, initialCommodityHistory } from '@/lib/commodityData';"
    )

crypto_update_marker = """        // Update Crypto
        INITIAL_CRYPTO.forEach(coin => {
          let spike = 0;
          if (Math.random() < 0.02) spike = (Math.random() * 0.3) * (Math.random() > 0.5 ? 1 : -1);
          
          const changePercent = ((Math.random() * 2 - 1) * coin.volatility) + cryptoDrift + spike;
          let newPrice = newCryptoPrices[coin.symbol] * (1 + changePercent);
          if (newPrice < 0.01) newPrice = 0.01;
          newCryptoPrices[coin.symbol] = Number(newPrice.toFixed(2));
          const history = [...newCryptoHistory[coin.symbol], newPrice];
          if (history.length > 30) history.shift();
          newCryptoHistory[coin.symbol] = history;
        });"""

commodity_update_injection = """
        const safeCommoditiesMarket = state.commoditiesMarket || { prices: initialCommodityPrices, history: initialCommodityHistory };
        const newCommoditiesPrices = { ...safeCommoditiesMarket.prices };
        const newCommoditiesHistory = { ...safeCommoditiesMarket.history };

        // Update Commodities
        INITIAL_COMMODITIES.forEach(commodity => {
          let economyImpact = 0;
          if (economy.status === 'BOOM') economyImpact = 0.005 * commodity.economySensitivity;
          if (economy.status === 'RECESSION') economyImpact = -0.005 * commodity.economySensitivity;
          if (economy.status === 'CRISIS') economyImpact = -0.015 * commodity.economySensitivity;
          
          let eventSpike = 0;
          // E.g., Gold spikes randomly in fear
          if (commodity.symbol === 'GLD' && Math.random() < 0.05) eventSpike = 0.02;
          
          const changePercent = ((Math.random() * 2 - 1) * commodity.volatility) + economyImpact + eventSpike;
          let newPrice = newCommoditiesPrices[commodity.symbol] * (1 + changePercent);
          if (newPrice < 1) newPrice = 1;
          newCommoditiesPrices[commodity.symbol] = Number(newPrice.toFixed(2));
          const history = [...newCommoditiesHistory[commodity.symbol], newPrice];
          if (history.length > 30) history.shift();
          newCommoditiesHistory[commodity.symbol] = history;
        });
"""

text = text.replace(crypto_update_marker, crypto_update_marker + commodity_update_injection)

# Add commoditiesMarket to the return object of advanceDay
return_marker = """            market: { prices: newPrices, history: newHistory },
            cryptoMarket: { prices: newCryptoPrices, history: newCryptoHistory },"""

return_injection = """            market: { prices: newPrices, history: newHistory },
            cryptoMarket: { prices: newCryptoPrices, history: newCryptoHistory },
            commoditiesMarket: { prices: newCommoditiesPrices, history: newCommoditiesHistory },"""

text = text.replace(return_marker, return_injection)

with open('gameStore.ts', 'w', encoding='utf-8') as f:
    f.write(text)
print("Added commodities update logic")
