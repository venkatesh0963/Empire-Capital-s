const fs = require('fs');
let layout = fs.readFileSync('src/components/Layout.tsx', 'utf8');
layout = layout.replace(/Rocket \} from 'lucide-react';/, "Rocket, HandCoins } from 'lucide-react';");
fs.writeFileSync('src/components/Layout.tsx', layout);
console.log('Fixed HandCoins');
