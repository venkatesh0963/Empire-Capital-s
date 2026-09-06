const fs = require('fs');
let text = fs.readFileSync('src/store/gameStore.ts', 'utf8');
const regex = /export interface NewsEvent \{[^\}]+\}/;
text = text.replace(regex, "export interface NewsEvent { id: string; date: string; headline: string; type: 'neutral' | 'positive' | 'negative' | 'economy'; }");
fs.writeFileSync('src/store/gameStore.ts', text);
console.log('Fixed interface!');
