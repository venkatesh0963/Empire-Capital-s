import sys
import re

with open('Dashboard.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# We need to rebuild the entire return statement
start_idx = text.find('  return (')
end_idx = text.rfind('  );\n}')

if start_idx == -1 or end_idx == -1:
    print("Could not find return block")
    sys.exit(1)

new_return = """  return (
    <div className="p-8 overflow-y-auto h-full space-y-8 relative z-10 bg-brand-bg">
      {/* Header & Time Controls */}
      <header className="flex justify-between items-center bg-brand-card/60 backdrop-blur-md p-5 rounded-xl border border-black/10 shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-brand-text">Global Empire Dashboard</h2>
          <div className="flex items-center space-x-3 mt-1">
             <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                economy.status === 'BOOM' ? 'bg-emerald-500/20 text-brand-profit' :
                economy.status === 'RECESSION' || economy.status === 'CRISIS' ? 'bg-rose-500/20 text-brand-loss' :
                'bg-cyan-500/20 text-brand-blue'
             }`}>
                ECONOMY: {economy.status}
             </span>
             <span className="text-brand-muted text-sm">Interest Rate: {(economy.interestRateBase * 100).toFixed(1)}%</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 bg-brand-bg p-2 rounded-lg border border-black/10 shadow-sm">
          <button onClick={togglePause} className={`p-2 rounded hover:bg-brand-surface transition ${time.isPaused ? 'text-brand-gold' : 'text-brand-profit'}`}>
            {time.isPaused ? <Play size={20} /> : <Pause size={20} />}
          </button>
          <div className="h-6 w-px bg-brand-surface mx-2"></div>
          {[1, 2, 5, 10].map(speed => (
            <button key={speed} onClick={() => setSpeed(speed)} className={`px-3 py-1 text-sm rounded font-medium transition ${time.speed === speed ? 'bg-brand-blue text-white shadow' : 'text-brand-muted hover:text-brand-text'}`}>
              {speed}x
            </button>
          ))}
        </div>
      </header>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Net Worth" value={formatCurrency(player.netWorth)} highlight="emerald" icon={<Trophy size={20}/>} />
        <StatCard title="Liquid Cash" value={formatCurrency(player.cash)} icon={<DollarSign size={20}/>} />
        <StatCard title="Monthly Net Flow" value={formatCurrency(netMonthly)} isPositive={netMonthly >= 0} icon={<Activity size={20}/>} />
        <StatCard title="Credit Rating" value={player.creditScore.toString()} isPositive={player.creditScore >= 700 ? true : player.creditScore < 600 ? false : undefined} icon={<Landmark size={20}/>} />
      </div>

      {/* Division 1: Operations */}
      <div>
        <h3 className="text-lg font-bold text-brand-text mb-4 border-b border-black/10 pb-2">Active Operations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-brand-card border border-black/10 rounded-xl p-5 shadow-sm">
              <div className="flex items-center text-brand-muted font-bold mb-4 uppercase text-xs tracking-wider"><Briefcase size={16} className="mr-2"/> Traditional Businesses</div>
              <div className="text-3xl font-black text-brand-text mb-1">{business.ownedBusinesses.length}</div>
              <div className="text-sm text-brand-muted mb-4">Operational Companies</div>
              <div className="flex justify-between text-sm border-t border-black/5 pt-2">
                 <span className="text-brand-muted">Total Valuation:</span>
                 <span className="font-bold">{formatCurrency(bizValue)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                 <span className="text-brand-muted">Monthly Profit:</span>
                 <span className="font-bold text-brand-profit">+{formatCurrency(bizProfit)}</span>
              </div>
           </div>

           <div className="bg-brand-card border border-brand-blue/30 rounded-xl p-5 shadow-sm">
              <div className="flex items-center text-brand-blue font-bold mb-4 uppercase text-xs tracking-wider"><Activity size={16} className="mr-2"/> Tech Startups</div>
              <div className="text-3xl font-black text-brand-text mb-1">{playerStartupCount}</div>
              <div className="text-sm text-brand-muted mb-4">Founded Startups</div>
              <div className="flex justify-between text-sm border-t border-black/5 pt-2">
                 <span className="text-brand-muted">Total Valuation:</span>
                 <span className="font-bold">{formatCurrency(playerStartupValue)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                 <span className="text-brand-muted">Angel Investments:</span>
                 <span className="font-bold">{formatCurrency(startupValue)}</span>
              </div>
           </div>

           <div className="bg-brand-card border border-brand-gold/30 rounded-xl p-5 shadow-sm">
              <div className="flex items-center text-brand-gold font-bold mb-4 uppercase text-xs tracking-wider"><Building size={16} className="mr-2"/> Real Estate</div>
              <div className="text-3xl font-black text-brand-text mb-1">{realEstate.ownedProperties.length}</div>
              <div className="text-sm text-brand-muted mb-4">Owned Properties</div>
              <div className="flex justify-between text-sm border-t border-black/5 pt-2">
                 <span className="text-brand-muted">Total Value:</span>
                 <span className="font-bold">{formatCurrency(reValue)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                 <span className="text-brand-muted">Monthly Rent:</span>
                 <span className="font-bold text-brand-profit">+{formatCurrency(reIncome)}</span>
              </div>
           </div>
        </div>
      </div>

      {/* Division 2: Markets & Alternative Assets */}
      <div>
        <h3 className="text-lg font-bold text-brand-text mb-4 border-b border-black/10 pb-2">Investments & Footprint</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-brand-card border border-black/10 rounded-xl p-5 shadow-sm">
              <div className="flex items-center text-brand-muted font-bold mb-4 uppercase text-xs tracking-wider"><TrendingUp size={16} className="mr-2"/> Liquid Markets</div>
              <div className="text-3xl font-black text-brand-text mb-1">{formatCurrency(portfolioValue)}</div>
              <div className="text-sm text-brand-muted mb-4">Stocks, Crypto, Bonds, Commodities</div>
              <div className="flex justify-between text-sm border-t border-black/5 pt-2">
                 <span className="text-brand-muted">Total Debt:</span>
                 <span className="font-bold text-brand-loss">-{formatCurrency(totalDebt)}</span>
              </div>
           </div>

           <div className="bg-brand-card border border-black/10 rounded-xl p-5 shadow-sm">
              <div className="flex items-center text-brand-muted font-bold mb-4 uppercase text-xs tracking-wider"><Gem size={16} className="mr-2"/> Alternative Assets</div>
              <div className="text-3xl font-black text-brand-text mb-1">{formatCurrency(ipValue + colValue + luxuryValue)}</div>
              <div className="text-sm text-brand-muted mb-4">IP, Collectibles, Luxury Goods</div>
              <div className="flex justify-between text-sm border-t border-black/5 pt-2">
                 <span className="text-brand-muted">Items Owned:</span>
                 <span className="font-bold">{(portfolio.ip || []).length + (portfolio.collectibles || []).length + (portfolio.luxury || []).length}</span>
              </div>
           </div>

           <div className="bg-brand-card border border-black/10 rounded-xl p-5 shadow-sm">
              <div className="flex items-center text-brand-muted font-bold mb-4 uppercase text-xs tracking-wider"><Globe size={16} className="mr-2"/> Global Footprint</div>
              <div className="text-3xl font-black text-brand-text mb-1">{player.unlockedCities?.length || 1} <span className="text-lg text-brand-muted font-normal">Cities</span></div>
              <div className="text-sm text-brand-muted mb-4">Operational Headquarters</div>
              <div className="flex justify-between text-sm border-t border-black/5 pt-2">
                 <span className="text-brand-muted">HQ Upgrades:</span>
                 <span className="font-bold">{player.hq?.level || 1}</span>
              </div>
           </div>
        </div>
      </div>

      {/* Special Opportunities (if any) */}
      {activeOpportunities.length > 0 && (
         <div>
            <h3 className="text-lg font-bold text-brand-gold mb-4 flex items-center border-b border-black/10 pb-2">
               <AlertCircle size={20} className="mr-2 animate-pulse" /> 
               Special Opportunities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {activeOpportunities.map(opp => (
                  <div key={opp.id} className="bg-brand-surface p-4 rounded-xl border border-brand-gold/30 flex flex-col justify-between">
                     <div>
                        <div className="flex justify-between items-start mb-2">
                           <h4 className="font-bold text-brand-text leading-tight">{opp.title}</h4>
                           <span className="text-xs font-bold text-brand-loss flex items-center bg-brand-loss/10 px-2 py-0.5 rounded-full">
                              <Clock size={12} className="mr-1" /> {opp.daysRemaining}d
                           </span>
                        </div>
                        <p className="text-xs text-brand-muted mb-4">{opp.description}</p>
                        <div className="flex justify-between text-sm mb-1">
                           <span className="text-brand-muted">Market Value:</span>
                           <span className="line-through">{formatCurrency(opp.marketValue)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold">
                           <span className="text-brand-muted">Asking Price:</span>
                           <span className="text-brand-profit">{formatCurrency(opp.askingPrice)}</span>
                        </div>
                     </div>
                     <button
                        onClick={() => buyOpportunity(opp.id)}
                        disabled={player.cash < opp.askingPrice}
                        className="w-full mt-4 py-2 bg-brand-gold text-brand-bg font-bold rounded-lg hover:brightness-110 disabled:opacity-50 transition-all text-sm"
                     >
                        {player.cash >= opp.askingPrice ? 'Acquire Asset' : 'Insufficient Capital'}
                     </button>
                  </div>
               ))}
            </div>
         </div>
      )}

      {/* Footer padding */}
      <div className="h-10"></div>
    </div>
  );
}

function StatCard({ title, value, isPositive, highlight, icon }: { title: string; value: string; isPositive?: boolean; highlight?: string; icon?: React.ReactNode }) {
  return (
    <div className={`bg-brand-card/80 backdrop-blur-sm border ${highlight === 'emerald' ? 'border-brand-profit/30 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.2)]' : 'border-black/10'} rounded-xl p-5 flex items-center justify-between`}>
      <div>
         <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-1">{title}</h4>
         <p className={`text-2xl font-black ${isPositive === true ? 'text-brand-profit' : isPositive === false ? 'text-brand-loss' : 'text-brand-text'}`}>
            {value}
         </p>
      </div>
      {icon && <div className={`p-3 rounded-xl ${highlight === 'emerald' ? 'bg-brand-profit/10 text-brand-profit' : 'bg-brand-surface text-brand-muted'}`}>{icon}</div>}
    </div>
  );
}
"""

text = text[:start_idx] + new_return
# Also add Globe to imports
if "Globe" not in text:
    text = text.replace("} from 'lucide-react';", ", Globe } from 'lucide-react';")

with open('Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print("Rewrote Dashboard!")
