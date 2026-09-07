const fs = require('fs');
let text = fs.readFileSync('src/components/Bank.tsx', 'utf8');

const oldCredit = `<div className="flex justify-between text-sm">
                   <span className="text-brand-muted">Total Debt</span>
                   <span className="text-brand-loss font-medium">{formatCurrency(totalDebt)}</span>
                </div>`;

const newCredit = `<div className="flex justify-between text-sm mb-2">
                   <span className="text-brand-muted">Total Debt</span>
                   <span className="text-brand-loss font-medium">{formatCurrency(totalDebt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-brand-muted">Projected DTI</span>
                   <span className={\`font-medium \${dti > 70 ? 'text-brand-loss' : dti > 40 ? 'text-brand-gold' : 'text-brand-profit'}\`}>{dti.toFixed(1)}%</span>
                </div>`;

text = text.replace(oldCredit, newCredit);
fs.writeFileSync('src/components/Bank.tsx', text);
console.log('Fixed bank UI');
