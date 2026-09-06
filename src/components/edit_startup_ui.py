import sys
with open('StartupLabView.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add payStartupDividend to destructuring
text = text.replace(
    "const { player, founder, foundStartup, investInStartup, hireStartupEmployee, launchStartupProduct, sellStartup } = useGameStore();",
    "const { player, founder, foundStartup, investInStartup, hireStartupEmployee, launchStartupProduct, sellStartup, payStartupDividend } = useGameStore();"
)

# 2. Add Net Profit box
metrics_marker = """                     <div className="bg-brand-surface p-3 rounded-lg border border-black/5">
                        <div className="flex items-center text-brand-muted mb-1 text-xs font-bold"><TrendingUp size={14} className="mr-1"/> Revenue</div>
                        <div className="font-mono font-bold text-sm text-brand-profit">{formatCurrency(startup.revenue)}/mo</div>
                        <div className="text-[10px] text-brand-muted mt-0.5">ARPU: {formatCurrency(industry?.arpu || 0)}</div>
                     </div>"""

metrics_injection = """                     <div className="bg-brand-surface p-3 rounded-lg border border-black/5">
                        <div className="flex items-center text-brand-muted mb-1 text-xs font-bold"><TrendingUp size={14} className="mr-1"/> Revenue</div>
                        <div className="font-mono font-bold text-sm text-brand-profit">{formatCurrency(startup.revenue)}/mo</div>
                        <div className="text-[10px] text-brand-muted mt-0.5">ARPU: {formatCurrency(industry?.arpu || 0)}</div>
                     </div>
                     <div className="bg-brand-surface p-3 rounded-lg border border-black/5">
                        <div className="flex items-center text-brand-muted mb-1 text-xs font-bold"><Activity size={14} className="mr-1"/> Net Profit</div>
                        <div className={`font-mono font-bold text-sm ${(startup.revenue - burnRate) >= 0 ? 'text-brand-profit' : 'text-brand-loss'}`}>
                           {(startup.revenue - burnRate) >= 0 ? '+' : ''}{formatCurrency(startup.revenue - burnRate)}/mo
                        </div>
                        <div className="text-[10px] text-brand-muted mt-0.5">After Burn</div>
                     </div>"""

text = text.replace(metrics_marker, metrics_injection)
text = text.replace('className="grid grid-cols-3 gap-2 mb-6"', 'className="grid grid-cols-4 gap-2 mb-6"')

# 3. Add Dividend Button
action_marker = """                  {/* Actions */}
                  <div className="mt-6 flex space-x-2">"""

action_injection = """                  {/* Actions */}
                  <div className="mt-6 flex flex-col space-y-2">
                     {startup.cash >= 100000 && (
                        <button 
                           onClick={() => payStartupDividend(startup.id, Math.floor(startup.cash * 0.5))}
                           className="w-full py-2 bg-brand-gold/10 text-brand-gold font-bold text-sm rounded-lg hover:bg-brand-gold/20 transition border border-brand-gold/30"
                        >
                           Pay Dividend (Extract {formatCurrency(Math.floor(startup.cash * 0.5))})
                        </button>
                     )}
                     <div className="flex space-x-2">"""

text = text.replace(action_marker, action_injection)
text = text.replace("                     </button>\n                  </div>\n               </div>", "                     </button>\n                  </div>\n                  </div>\n               </div>")

with open('StartupLabView.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated Startup UI!")
