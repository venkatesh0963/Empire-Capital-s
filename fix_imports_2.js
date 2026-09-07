const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf8');
if (!page.includes("import LendingView from '@/components/LendingView';")) {
   page = page.replace("import { Bank } from '@/components/Bank';", "import { Bank } from '@/components/Bank';\nimport LendingView from '@/components/LendingView';");
}
fs.writeFileSync('src/app/page.tsx', page);

let layout = fs.readFileSync('src/components/Layout.tsx', 'utf8');
if (!layout.includes('HandCoins')) {
   layout = layout.replace(/LogOut \} from 'lucide-react';/, "LogOut, HandCoins } from 'lucide-react';");
}
fs.writeFileSync('src/components/Layout.tsx', layout);

console.log('Fixed imports!');
