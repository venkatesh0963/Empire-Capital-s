const fs = require('fs');
let text = fs.readFileSync('src/lib/maData.ts', 'utf8');

text = text.replace(
    /const COMPANY_NAMES = \{[\s\S]+?\};/,
    `const COMPANY_NAMES: Record<BusinessIndustry, string[]> = {
  'Software': ['TechFlow', 'CyberNova', 'DataSync', 'CloudStack', 'Aura Systems'],
  'SaaS': ['CloudFlow', 'SyncNova', 'DataCloud', 'MetricStack', 'Aura SaaS'],
  'Retail': ['FreshMart', 'NextGen Apparel', 'Value Plus', 'Prime Goods', 'Echo Retail'],
  'Manufacturing': ['SteelCore', 'Titan Industries', 'Global Dynamics', 'Precision Forge', 'AeroMotive'],
  'Services': ['Elite Consulting', 'ProCare Services', 'Summit Solutions', 'Nexus Agency', 'BrightPath'],
  'Franchise': ['Burger King', 'McDonalds', 'Subway', 'KFC', 'Taco Bell'],
  'Agriculture': ['FarmCorp', 'AgriGen', 'HarvestTech', 'CropCore', 'GreenField'],
  'Energy': ['EcoPower', 'SolarGen', 'GreenEnergy', 'Aura Energy', 'PowerCore'],
  'Infrastructure': ['BuildCorp', 'MetroWorks', 'CityBuild', 'CoreStruct', 'Aura Infra']
};`
);

fs.writeFileSync('src/lib/maData.ts', text);
console.log('Fixed maData.ts');
