const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else if (dirFile.endsWith('.tsx')) {
      filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = [
  ...walkSync(path.join(__dirname, 'src', 'components')),
  ...walkSync(path.join(__dirname, 'src', 'app'))
];

const colorMap = [
  // Backgrounds & Borders
  { from: /bg-slate-50/g, to: 'bg-brand-bg' },
  { from: /bg-white/g, to: 'bg-brand-card' },
  { from: /bg-slate-100/g, to: 'bg-brand-surface' },
  { from: /bg-slate-200/g, to: 'bg-brand-surface' }, // fallback
  { from: /border-slate-200/g, to: 'border-white/10' },
  { from: /border-slate-300/g, to: 'border-white/20' },
  { from: /shadow-slate-300\/50/g, to: 'shadow-black/50' },
  { from: /from-slate-900\/5/g, to: 'from-white/5' },
  
  // Texts
  { from: /text-slate-900/g, to: 'text-brand-text' },
  { from: /text-slate-800/g, to: 'text-brand-text' },
  { from: /text-slate-700/g, to: 'text-brand-muted' },
  { from: /text-slate-500/g, to: 'text-brand-muted' },
  { from: /text-slate-400/g, to: 'text-brand-muted' },
  
  // Accents
  { from: /text-emerald-600/g, to: 'text-brand-profit' },
  { from: /text-emerald-500/g, to: 'text-brand-profit' },
  { from: /text-emerald-400/g, to: 'text-brand-profit' },
  { from: /text-rose-600/g, to: 'text-brand-loss' },
  { from: /text-rose-400/g, to: 'text-brand-loss' },
  { from: /text-cyan-600/g, to: 'text-brand-blue' },
  { from: /text-cyan-400/g, to: 'text-brand-blue' },
  { from: /text-amber-600/g, to: 'text-brand-gold' },
  { from: /text-amber-500/g, to: 'text-brand-gold' },
  { from: /text-amber-400/g, to: 'text-brand-gold' },
  { from: /text-indigo-600/g, to: 'text-brand-purple' },
  { from: /text-fuchsia-600/g, to: 'text-brand-purple' },
  
  // Base background
  { from: /bg-emerald-600\/10/g, to: 'bg-brand-profit/10' },
  { from: /bg-cyan-600\/10/g, to: 'bg-brand-blue/10' },
  { from: /bg-fuchsia-600\/5/g, to: 'bg-brand-purple/10' },
  { from: /from-emerald-400/g, to: 'from-brand-profit' },
  { from: /to-cyan-400/g, to: 'to-brand-blue' },
  { from: /to-cyan-500/g, to: 'to-brand-blue' },
  { from: /bg-emerald-500\/10/g, to: 'bg-brand-profit/10' },
  { from: /border-emerald-500\/20/g, to: 'border-brand-profit/20' },
  { from: /border-emerald-500\/50/g, to: 'border-brand-profit/50' },
  { from: /accent-emerald-500/g, to: 'accent-brand-profit' },
  { from: /accent-cyan-500/g, to: 'accent-brand-blue' }
];

let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  colorMap.forEach(({ from, to }) => {
    newContent = newContent.replace(from, to);
  });

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedCount++;
    console.log(`Updated ${file}`);
  }
});

console.log(`\nFinished! Modified ${changedCount} files to Premium Theme.`);
