const fs = require('fs');
let text = fs.readFileSync('src/app/page.tsx', 'utf8');

const importLending = "import Bank from '@/components/Bank';\nimport LendingView from '@/components/LendingView';";
text = text.replace("import Bank from '@/components/Bank';", importLending);

const renderLending = "{currentView === 'bank' && <Bank />}\n        {currentView === 'lending' && <LendingView />}";
text = text.replace("{currentView === 'bank' && <Bank />}", renderLending);

fs.writeFileSync('src/app/page.tsx', text);
console.log('Fixed page.tsx');
