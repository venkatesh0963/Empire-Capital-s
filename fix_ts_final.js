const fs = require('fs');
let text = fs.readFileSync('src/store/gameStore.ts', 'utf8');

text = text.replace('realEstate: { marketListings: newMarketListings, ownedProperties: updatedOwnedProperties }', 'realEstate: { marketListings: newMarketListings, ownedProperties: updatedOwnedProperties, cityBuildings: state.realEstate.cityBuildings || [] }')

text = text.replace("type: activeCatalyst.impactMultiplier > 1 ? 'positive' : 'negative'", "type: (activeCatalyst.impactMultiplier > 1 ? 'positive' : 'negative') as 'positive' | 'negative'")

fs.writeFileSync('src/store/gameStore.ts', text);
console.log('Fixed!');
