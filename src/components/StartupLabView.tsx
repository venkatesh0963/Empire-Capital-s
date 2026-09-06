import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { formatCurrency } from '@/lib/utils';
import { Rocket, Users, Code, Megaphone, DollarSign, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { STARTUP_INDUSTRIES } from '@/lib/founderData';

export function StartupLabView() {
  const { player, founder, foundStartup, injectCashStartup, hireStartupEmployee, launchStartupProduct, sellStartup, payStartupDividend } = useGameStore();
  const startups = founder?.playerStartups || [];

  const [isFounding, setIsFounding] = useState(false);
  const [newStartupName, setNewStartupName] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState(STARTUP_INDUSTRIES[0].id);
  const [seedCapital, setSeedCapital] = useState(STARTUP_INDUSTRIES[0].minSeed);

  const handleFound = () => {
    if (newStartupName && player.cash >= seedCapital) {
      foundStartup(newStartupName, selectedIndustry, seedCapital);
      setIsFounding(false);
      setNewStartupName('');
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-brand-bg">
      <div className="flex items-center justify-between mb-6">
         <div className="flex items-center space-x-4">
            <div className="p-3 bg-brand-blue/10 rounded-xl">
               <Rocket className="text-brand-blue" size={32} />
            </div>
            <div>
               <h1 className="text-3xl font-black text-brand-text">Startup Lab</h1>
               <p className="text-brand-muted">Found, build, and scale your own technology companies.</p>
            </div>
         </div>
         <button 
            onClick={() => setIsFounding(!isFounding)}
            className="px-6 py-3 bg-brand-blue text-brand-bg font-bold rounded-xl shadow-lg hover:brightness-110 transition flex items-center"
         >
            <Rocket size={18} className="mr-2" /> 
            {isFounding ? 'Cancel' : 'Found New Startup'}
         </button>
      </div>

      {isFounding && (
         <div className="bg-brand-card border border-black/10 rounded-xl p-6 mb-8 relative overflow-hidden">
            <h2 className="text-xl font-bold mb-4">Found a New Startup</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-bold text-brand-muted mb-1">Company Name</label>
                     <input 
                        type="text" 
                        value={newStartupName} 
                        onChange={(e) => setNewStartupName(e.target.value)}
                        className="w-full bg-brand-bg border border-black/10 rounded-lg p-3 text-brand-text focus:outline-none focus:border-brand-blue transition"
                        placeholder="e.g. Pied Piper"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-brand-muted mb-1">Industry</label>
                     <select 
                        value={selectedIndustry} 
                        onChange={(e) => {
                           setSelectedIndustry(e.target.value);
                           const ind = STARTUP_INDUSTRIES.find(i => i.id === e.target.value);
                           if (ind) setSeedCapital(ind.minSeed);
                        }}
                        className="w-full bg-brand-bg border border-black/10 rounded-lg p-3 text-brand-text focus:outline-none focus:border-brand-blue transition"
                     >
                        {STARTUP_INDUSTRIES.map(ind => (
                           <option key={ind.id} value={ind.id}>{ind.name}</option>
                        ))}
                     </select>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-brand-muted mb-1">Seed Capital (from Personal Cash)</label>
                     <input 
                        type="number" 
                        value={seedCapital} 
                        onChange={(e) => setSeedCapital(Number(e.target.value))}
                        className="w-full bg-brand-bg border border-black/10 rounded-lg p-3 text-brand-text focus:outline-none focus:border-brand-blue transition"
                        min={STARTUP_INDUSTRIES.find(i => i.id === selectedIndustry)?.minSeed || 0}
                     />
                     <div className="text-xs text-brand-muted mt-1">Minimum: {formatCurrency(STARTUP_INDUSTRIES.find(i => i.id === selectedIndustry)?.minSeed || 0)}</div>
                  </div>
                  <button 
                     onClick={handleFound}
                     disabled={!newStartupName || player.cash < seedCapital}
                     className="w-full py-3 bg-brand-profit text-brand-bg font-bold rounded-lg hover:brightness-110 disabled:opacity-50 transition"
                  >
                     Found Company (-{formatCurrency(seedCapital)})
                  </button>
               </div>
               <div className="bg-brand-surface rounded-xl p-4 border border-black/5">
                  <h3 className="font-bold mb-2">Industry Intelligence</h3>
                  {STARTUP_INDUSTRIES.find(i => i.id === selectedIndustry) && (() => {
                     const ind = STARTUP_INDUSTRIES.find(i => i.id === selectedIndustry)!;
                     return (
                        <div className="space-y-3 text-sm">
                           <p className="text-brand-muted italic">{ind.description}</p>
                           <div className="flex justify-between border-b border-black/5 pb-1">
                              <span className="text-brand-muted">Avg Developer Salary:</span>
                              <span className="font-medium">{formatCurrency(ind.devSalary)}/mo</span>
                           </div>
                           <div className="flex justify-between border-b border-black/5 pb-1">
                              <span className="text-brand-muted">Avg Marketer Salary:</span>
                              <span className="font-medium">{formatCurrency(ind.marketerSalary)}/mo</span>
                           </div>
                           <div className="flex justify-between border-b border-black/5 pb-1">
                              <span className="text-brand-muted">ARPU (Est. Monthly):</span>
                              <span className="font-medium">{formatCurrency(ind.arpu)}</span>
                           </div>
                           <div className="flex justify-between border-b border-black/5 pb-1">
                              <span className="text-brand-muted">Viral Factor:</span>
                              <span className="font-medium">{ind.viralFactor}x</span>
                           </div>
                        </div>
                     )
                  })()}
               </div>
            </div>
         </div>
      )}

      {startups.length === 0 && !isFounding && (
         <div className="bg-brand-surface rounded-xl p-12 text-center border border-black/5 flex flex-col items-center">
            <Rocket className="text-brand-muted mb-4 opacity-50" size={64} />
            <h2 className="text-2xl font-bold text-brand-text mb-2">No Active Startups</h2>
            <p className="text-brand-muted max-w-md">You haven't founded any companies yet. Click 'Found New Startup' to begin your journey from a garage to a global tech giant.</p>
         </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {startups.map(startup => {
            const industry = STARTUP_INDUSTRIES.find(i => i.id === startup.industry);
            const burnRate = industry ? ((startup.developers * industry.devSalary) + (startup.marketers * industry.marketerSalary)) * 0.75 : 0;
            const runway = burnRate > 0 ? (startup.cash / burnRate) : 999;
            const isDanger = startup.cash > 0 && runway < 3;

            return (
               <div key={startup.id} className="bg-brand-card border border-black/10 rounded-xl p-6 relative overflow-hidden flex flex-col">
                  {/* Status Banner */}
                  <div className={`absolute top-0 left-0 w-full h-1 ${
                     startup.stage === 'IDEA' || startup.stage === 'DEVELOPMENT' ? 'bg-brand-blue' :
                     startup.stage === 'BETA' ? 'bg-brand-gold' :
                     'bg-brand-profit'
                  }`}></div>
                  
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <h2 className="text-xl font-bold text-brand-text flex items-center">
                           {startup.name}
                        </h2>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-surface text-brand-muted mt-1 inline-block uppercase">
                           {industry?.name} • {startup.stage}
                        </span>
                     </div>
                     <div className="text-right">
                        <div className="text-lg font-mono font-bold text-brand-profit">{formatCurrency(startup.valuation)}</div>
                        <div className="text-xs text-brand-muted">Valuation</div>
                     </div>
                  </div>

                  {/* Core Metrics */}
                  <div className="grid grid-cols-4 gap-2 mb-6">
                     <div className="bg-brand-surface p-3 rounded-lg border border-black/5">
                        <div className="flex items-center text-brand-muted mb-1 text-xs font-bold"><DollarSign size={14} className="mr-1"/> Cash</div>
                        <div className={`font-mono font-bold text-sm ${isDanger ? 'text-brand-loss animate-pulse' : 'text-brand-text'}`}>{formatCurrency(startup.cash)}</div>
                        <div className="text-[10px] text-brand-muted mt-0.5">Burn: {formatCurrency(burnRate)}/mo</div>
                     </div>
                     <div className="bg-brand-surface p-3 rounded-lg border border-black/5">
                        <div className="flex items-center text-brand-muted mb-1 text-xs font-bold"><Users size={14} className="mr-1"/> Users</div>
                        <div className="font-mono font-bold text-sm text-brand-text">{startup.users.toLocaleString()}</div>
                        <div className="text-[10px] text-brand-muted mt-0.5">+{startup.brandAwareness.toFixed(1)}% brand</div>
                     </div>
                     <div className="bg-brand-surface p-3 rounded-lg border border-black/5">
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
                     </div>
                  </div>

                  {/* Product Progress */}
                  <div className="mb-6 space-y-3">
                     <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                           <span className="text-brand-muted flex items-center"><Code size={12} className="mr-1"/> Product Quality</span>
                           <span>{Math.floor(startup.productQuality)}/100</span>
                        </div>
                        <div className="h-2 w-full bg-brand-surface rounded-full overflow-hidden">
                           <div className="h-full bg-brand-blue" style={{ width: `${startup.productQuality}%` }}></div>
                        </div>
                     </div>
                  </div>

                  {/* Team & Controls */}
                  <div className="flex-1"></div>
                  
                  <div className="space-y-3 pt-4 border-t border-black/10">
                     <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-brand-text flex items-center">
                           <Code size={16} className="mr-2 text-brand-blue" />
                           Devs: {startup.developers}
                        </div>
                        <button 
                           onClick={() => hireStartupEmployee(startup.id, 'developer', 1)}
                           className="px-3 py-1 bg-brand-surface text-brand-text text-xs font-bold rounded hover:bg-black/5 transition"
                        >
                           Hire (+1)
                        </button>
                     </div>
                     <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-brand-text flex items-center">
                           <Megaphone size={16} className="mr-2 text-brand-gold" />
                           Marketers: {startup.marketers}
                        </div>
                        <button 
                           onClick={() => hireStartupEmployee(startup.id, 'marketer', 1)}
                           className="px-3 py-1 bg-brand-surface text-brand-text text-xs font-bold rounded hover:bg-black/5 transition"
                        >
                           Hire (+1)
                        </button>
                     </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-col space-y-2">
                     {startup.cash >= 100000 && (
                        <button 
                           onClick={() => payStartupDividend(startup.id, Math.floor(startup.cash * 0.5))}
                           className="w-full py-2 bg-brand-gold/10 text-brand-gold font-bold text-sm rounded-lg hover:bg-brand-gold/20 transition border border-brand-gold/30"
                        >
                           Pay Dividend (Extract {formatCurrency(Math.floor(startup.cash * 0.5))})
                        </button>
                     )}
                     <div className="flex space-x-2">
                     <button 
                        onClick={() => injectCashStartup(startup.id, 100000)}
                        disabled={player.cash < 100000}
                        className="flex-1 py-2 bg-brand-surface text-brand-text font-bold text-sm rounded-lg border border-black/10 hover:bg-black/5 transition"
                     >
                        Inject $100k
                     </button>
                     {startup.stage === 'DEVELOPMENT' && (
                        <button 
                           onClick={() => launchStartupProduct(startup.id)}
                           disabled={startup.productQuality < 20}
                           className="flex-1 py-2 bg-brand-blue text-brand-bg font-bold text-sm rounded-lg hover:brightness-110 disabled:opacity-50 transition"
                        >
                           Launch Beta
                        </button>
                     )}
                     <button 
                        onClick={() => sellStartup(startup.id)}
                        className="flex-1 py-2 bg-brand-profit text-brand-bg font-bold text-sm rounded-lg hover:brightness-110 transition"
                     >
                        Exit / Sell
                     </button>
                  </div>
                  </div>
               </div>
            );
         })}
      </div>
    </div>
  );
}
