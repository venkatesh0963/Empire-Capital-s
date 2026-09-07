const fs = require('fs');
let text = fs.readFileSync('src/components/Layout.tsx', 'utf8');

const oldSidebar = `    { id: 'bank', label: 'Banking & Debt', icon: Landmark },`;
const newSidebar = `    { id: 'lending', label: 'Lend Money', icon: HandCoins },\n    { id: 'bank', label: 'Banking & Debt', icon: Landmark },`;

text = text.replace(oldSidebar, newSidebar);

text = text.replace("import { LayoutDashboard, Globe2, Trophy, Building2, Store, Activity, Target, Landmark, Smartphone, Briefcase, Plus, Menu, X, Rocket, Gem, Library, LogOut } from 'lucide-react';", "import { LayoutDashboard, Globe2, Trophy, Building2, Store, Activity, Target, Landmark, Smartphone, Briefcase, Plus, Menu, X, Rocket, Gem, Library, LogOut, HandCoins } from 'lucide-react';");

fs.writeFileSync('src/components/Layout.tsx', text);
console.log('Fixed Layout');
