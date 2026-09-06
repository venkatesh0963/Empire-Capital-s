const fs = require('fs');
let text = fs.readFileSync('src/store/gameStore.ts', 'utf8');

text = text.replace(/status: 'Operational'/g, "status: 'Operational' as 'Operational'");
text = text.replace(/earnout\.remainingBalance/g, '(earnout.remainingBalance || 0)');
text = text.replace(/e\.remainingBalance/g, '(e.remainingBalance || 0)');
text = text.replace(/name' does not exist on type 'OwnedLuxury'/, ""); // just comment

fs.writeFileSync('src/store/gameStore.ts', text);
console.log('Fixed TS literal inferencing and undefined');
