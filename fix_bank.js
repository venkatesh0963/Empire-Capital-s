const fs = require('fs');
let text = fs.readFileSync('src/components/Bank.tsx', 'utf8');

const oldProb = `  const approvalProb = player.creditScore > 750 && dti < 40 ? 95 : 
                       player.creditScore > 650 && dti < 50 ? 70 : 
                       player.creditScore > 500 ? 30 : 5;`;

const newProb = `  // Bank approval logic is more forgiving to high credit scores
  const approvalProb = dti > 90 ? 5 : 
                       dti > 70 ? 25 : 
                       player.creditScore >= 750 ? 95 : 
                       player.creditScore >= 650 ? 80 : 
                       player.creditScore >= 500 ? 50 : 10;`;

text = text.replace(oldProb, newProb);
fs.writeFileSync('src/components/Bank.tsx', text);
console.log('Fixed Bank logic');
