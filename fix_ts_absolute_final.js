const fs = require('fs');
let text = fs.readFileSync('src/store/gameStore.ts', 'utf8');

text = text.replace(/type: 'positive'/g, "type: 'positive' as 'positive'");
text = text.replace(/type: 'negative'/g, "type: 'negative' as 'negative'");
text = text.replace(/type: 'neutral'/g, "type: 'neutral' as 'neutral'");
text = text.replace(/type: 'economy'/g, "type: 'economy' as 'economy'");

text = text.replace(
  'realEstate: { marketListings: state.realEstate.marketListings.filter(p => p.id !== id), ownedProperties: [...state.realEstate.ownedProperties, newOwned] }',
  'realEstate: { marketListings: state.realEstate.marketListings.filter(p => p.id !== id), ownedProperties: [...state.realEstate.ownedProperties, newOwned], cityBuildings: state.realEstate.cityBuildings || [] }'
);

fs.writeFileSync('src/store/gameStore.ts', text);
console.log('Fixed final TS errors!');
