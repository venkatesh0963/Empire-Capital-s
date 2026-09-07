const fs = require('fs');

let layout = fs.readFileSync('src/components/Layout.tsx', 'utf8');
if (!layout.includes('HandCoins')) {
   layout = layout.replace(/LogOut \} from 'lucide-react';/, "LogOut, HandCoins } from 'lucide-react';");
}
fs.writeFileSync('src/components/Layout.tsx', layout);

let page = fs.readFileSync('src/app/page.tsx', 'utf8');
if (!page.includes('LendingView')) {
   page = page.replace("import Bank from '@/components/Bank';", "import Bank from '@/components/Bank';\nimport LendingView from '@/components/LendingView';");
   page = page.replace("{currentView === 'bank' && <Bank />}", "{currentView === 'bank' && <Bank />}\n        {currentView === 'lending' && <LendingView />}");
}
fs.writeFileSync('src/app/page.tsx', page);
console.log('Fixed Layout and Page');
