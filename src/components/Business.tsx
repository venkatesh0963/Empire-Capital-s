'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { BUSINESS_TEMPLATES, BusinessIndustry } from '@/lib/businessData';
import { Briefcase, Building2, Store, Cog, Plus, Users, Target, TrendingUp, User, Star } from 'lucide-react';

export function Business() {
  const { player, business, createBusiness, updateBusinessSettings, hireEmployee, fireEmployee, expandBusiness, hireExecutive, fireExecutive } = useGameStore();
  const [activeTab, setActiveTab] = useState<'manage' | 'create'>('manage');
  const [newBizName, setNewBizName] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<BusinessIndustry>('Services');
  const [investment, setInvestment] = useState(50000);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(value);
  };

  const handleCreate = () => {
    if (!newBizName) return alert('Enter a business name');
    if (player.cash < investment) return alert('Not enough cash');
    if (investment < BUSINESS_TEMPLATES[selectedIndustry].minInvestment) return alert('Investment too low for this industry');
    
    createBusiness(newBizName, selectedIndustry, investment);
    setNewBizName('');
    setActiveTab('manage');
  };

  return (
    <div className="p-8 overflow-y-auto h-full space-y-8 relative z-10 bg-brand-bg text-brand-text">
      
      {/* Header */}
      <div className="flex justify-between items-end bg-brand-card/80 backdrop-blur-md p-6 rounded-2xl border border-black/10 shadow-sm">
        <div>
          <h2 className="text-3xl font-black mb-2 flex items-center"><Building2 className="mr-3 text-brand-blue" size={28}/> Empire HQ</h2>
          <p className="text-brand-muted text-sm font-medium">Manage your traditional business empire, operations, and scaling.</p>
        </div>
        <div className="flex space-x-2 bg-brand-surface p-1 rounded-xl border border-black/5 shadow-inner">
          <button 
            onClick={() => setActiveTab('manage')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'manage' ? 'bg-white shadow-sm text-brand-text' : 'text-brand-muted hover:text-brand-text'}`}
          >
            My Operations
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'create' ? 'bg-white shadow-sm text-brand-text' : 'text-brand-muted hover:text-brand-text'}`}
          >
            Found Company
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {activeTab === 'create' && (
          <div className="bg-brand-card rounded-2xl border border-black/10 p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Start a New Business</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-brand-muted mb-2 uppercase tracking-wider">Company Name</label>
                <input 
                  type="text" 
                  value={newBizName}
                  onChange={e => setNewBizName(e.target.value)}
                  className="w-full bg-brand-surface border border-black/10 rounded-xl p-4 font-bold focus:ring-2 focus:ring-brand-blue outline-none transition"
                  placeholder="e.g. Prestige Worldwide"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-muted mb-2 uppercase tracking-wider">Industry</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(Object.keys(BUSINESS_TEMPLATES) as BusinessIndustry[]).map(ind => {
                    const temp = BUSINESS_TEMPLATES[ind];
                    const isSelected = selectedIndustry === ind;
                    return (
                      <div 
                        key={ind}
                        onClick={() => { setSelectedIndustry(ind); setInvestment(temp.minInvestment); }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-brand-blue bg-brand-blue/5 shadow-sm' : 'border-black/5 bg-brand-surface hover:border-black/20'}`}
                      >
                        <h4 className="font-bold text-lg mb-1">{ind}</h4>
                        <p className="text-xs text-brand-muted mb-3">{temp.description}</p>
                        <div className="flex justify-between items-center text-xs font-bold bg-white/50 p-2 rounded">
                           <span className="text-brand-muted">Min Capital:</span>
                           <span className="text-brand-text">{formatCurrency(temp.minInvestment)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-muted mb-2 uppercase tracking-wider">Initial Capital Injection</label>
                <input 
                  type="range" 
                  min={BUSINESS_TEMPLATES[selectedIndustry].minInvestment} 
                  max={Math.max(player.cash, BUSINESS_TEMPLATES[selectedIndustry].minInvestment * 2)} 
                  step="10000"
                  value={investment}
                  onChange={e => setInvestment(Number(e.target.value))}
                  className="w-full accent-brand-blue"
                />
                <div className="flex justify-between text-sm font-bold mt-2">
                  <span className="text-brand-muted">Selected: {formatCurrency(investment)}</span>
                  <span className={player.cash >= investment ? 'text-brand-profit' : 'text-brand-loss'}>
                    Available: {formatCurrency(player.cash)}
                  </span>
                </div>
              </div>

              <button 
                onClick={handleCreate}
                disabled={player.cash < investment || !newBizName}
                className="w-full py-4 bg-brand-blue text-white font-black rounded-xl hover:bg-brand-blue/90 disabled:opacity-50 transition shadow-sm"
              >
                Launch Company
              </button>
            </div>
          </div>
        )}

        {activeTab === 'manage' && (
          <div>
            {business.ownedBusinesses.length === 0 ? (
              <div className="text-center py-20 bg-brand-card rounded-2xl border border-black/10 border-dashed">
                <Store size={48} className="mx-auto text-brand-muted mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-brand-text mb-2">No Operations Found</h3>
                <p className="text-brand-muted mb-6">You don't own any traditional businesses yet.</p>
                <button onClick={() => setActiveTab('create')} className="px-6 py-2 bg-brand-blue text-white font-bold rounded-lg hover:bg-brand-blue/90 shadow-sm transition">Start First Company</button>
              </div>
            ) : (
              <div className="space-y-6">
                {business.ownedBusinesses.map(biz => {
                  const expansionCost = (biz.level || 1) * 50000;
                  return (
                    <div key={biz.id} className="bg-brand-card rounded-xl border border-black/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                      
                      {/* Top Header */}
                      <div className="bg-brand-surface p-4 border-b border-black/10 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-lg mr-4">
                            <Briefcase size={20} />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-brand-text flex items-center">
                               {biz.name}
                               <span className="ml-2 text-[10px] bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Level {biz.level || 1}</span>
                            </h3>
                            <p className="text-xs text-brand-muted">{biz.industry} Industry</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-brand-muted font-bold uppercase tracking-wider mb-1">Monthly Profit</p>
                          <p className={`text-xl font-black ${biz.lastMonthProfit >= 0 ? 'text-brand-profit' : 'text-brand-loss'}`}>
                            {biz.lastMonthProfit >= 0 ? '+' : ''}{formatCurrency(biz.lastMonthProfit)}
                          </p>
                        </div>
                      </div>

                      {/* Main Dashboard */}
                      <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
                        
                        {/* Financial Summary */}
                        <div className="bg-brand-surface/50 rounded-xl p-4 border border-black/5">
                          <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-4 flex items-center">
                            <TrendingUp size={14} className="mr-2" /> Financial Health
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Revenue</span>
                              <span className="text-sm font-bold text-brand-profit">{formatCurrency(biz.lastMonthRevenue)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Expenses</span>
                              <span className="text-sm font-bold text-brand-loss">-{formatCurrency(biz.lastMonthExpenses)}</span>
                            </div>
                            <div className="w-full h-px bg-black/10 my-2"></div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Net Profit</span>
                              <span className={`text-sm font-black ${biz.lastMonthProfit >= 0 ? 'text-brand-profit' : 'text-brand-loss'}`}>
                                 {formatCurrency(biz.lastMonthProfit)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Core Operations */}
                        <div className="bg-brand-surface/50 rounded-xl p-4 border border-black/5 flex flex-col justify-between">
                          <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-4 flex items-center">
                            <Cog size={14} className="mr-2" /> Operations & Strategy
                          </h4>
                          
                          <div className="space-y-4">
                             <div>
                               <div className="flex justify-between text-xs mb-1">
                                 <span className="font-bold text-brand-muted">Pricing Multiplier</span>
                                 <span className="font-bold text-brand-blue">{biz.productPriceMultiplier.toFixed(1)}x</span>
                               </div>
                               <input type="range" min="0.5" max="5.0" step="0.1" value={biz.productPriceMultiplier}
                                 onChange={(e) => updateBusinessSettings(biz.id, biz.marketingBudget, Number(e.target.value))}
                                 className="w-full accent-brand-blue" />
                             </div>

                             <div>
                               <div className="flex justify-between text-xs mb-1">
                                 <span className="font-bold text-brand-muted">Marketing Budget</span>
                                 <span className="font-bold text-brand-profit">{formatCurrency(biz.marketingBudget)}</span>
                               </div>
                               <input type="range" min="100" max="10000" step="100" value={biz.marketingBudget}
                                 onChange={(e) => updateBusinessSettings(biz.id, Number(e.target.value), biz.productPriceMultiplier)}
                                 className="w-full accent-brand-profit" />
                             </div>
                          </div>
                        </div>

                        {/* Team & Expansion */}
                        <div className="bg-brand-surface/50 rounded-xl p-4 border border-black/5 flex flex-col justify-between">
                          <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-4 flex items-center">
                            <Building2 size={14} className="mr-2" /> Growth & Expansion
                          </h4>
                          
                          <div className="flex items-center justify-between bg-brand-bg rounded p-2 border border-black/5 mb-3">
                             <div className="flex items-center text-sm font-bold"><Users size={14} className="mr-2 text-brand-muted"/> {biz.employees} Workers</div>
                             <div className="flex space-x-1">
                               <button onClick={() => fireEmployee(biz.id)} disabled={biz.employees <= 1} className="px-2 py-1 bg-brand-surface hover:bg-black/5 disabled:opacity-50 text-brand-muted rounded text-xs font-bold">- Fire</button>
                               <button onClick={() => hireEmployee(biz.id)} className="px-2 py-1 bg-brand-surface hover:bg-black/5 text-brand-muted rounded text-xs font-bold">+ Hire</button>
                             </div>
                          </div>
                          
                          <div className="mt-auto">
                             <button 
                               onClick={() => expandBusiness(biz.id, expansionCost)}
                               disabled={player.cash < expansionCost}
                               className="w-full py-2 bg-brand-gold text-brand-bg font-black text-sm rounded hover:brightness-110 disabled:opacity-50 transition shadow-sm flex justify-center items-center"
                             >
                               <Plus size={16} className="mr-1" /> Expand Business ({formatCurrency(expansionCost)})
                             </button>
                             <p className="text-[9px] text-center text-brand-muted mt-1 leading-tight">Increases scale, revenue limits, and payroll base costs.</p>
                          </div>
                        </div>
                      </div>

                      {/* C-Suite Executives */}
                      <div className="px-6 pb-6">
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {(['CFO', 'Sales Director', 'Operations Manager', 'CTO'] as const).map(role => {
                               const exec = (biz.executives || []).find((e: any) => e.role === role);
                               if (exec) {
                                  return (
                                     <div key={exec.id} className="bg-brand-surface border border-brand-gold/20 rounded p-2 text-center relative group">
                                        <p className="text-[10px] text-brand-muted font-bold uppercase">{exec.role}</p>
                                        <p className="text-xs font-bold text-brand-text truncate">{exec.name}</p>
                                        <button onClick={() => fireExecutive(biz.id, exec.id)} className="absolute inset-0 bg-brand-loss/90 text-white text-xs font-bold rounded opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">FIRE</button>
                                     </div>
                                  );
                               }
                               return (
                                  <button key={role} onClick={() => hireExecutive(biz.id, role)} className="bg-brand-surface/50 hover:bg-brand-surface border border-black/5 border-dashed rounded p-2 text-center text-[10px] font-bold text-brand-muted transition">
                                     + HIRE {role}
                                  </button>
                               );
                            })}
                         </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
