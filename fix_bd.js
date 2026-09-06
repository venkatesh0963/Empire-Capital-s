const fs = require('fs');
let text = fs.readFileSync('src/lib/businessData.ts', 'utf8');

text = text.replace('basePayroll: number; // Base monthly payroll per employee\n}', 'basePayroll: number;\n  description: string;\n}');

text = text.replace(/'([^']+)': \{ industry: '[^']+',([^}]+)\}/g, (match, p1, p2) => {
    return `'${p1}': { industry: '${p1}',${p2}, description: 'A lucrative venture in ${p1}' }`;
});

fs.writeFileSync('src/lib/businessData.ts', text);
console.log('Fixed businessData.ts');
