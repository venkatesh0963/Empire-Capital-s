import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { formatCurrency } from '@/lib/utils';
import { Briefcase, Building2, Target, Users, Landmark, AlertCircle, RefreshCw } from 'lucide-react';

export function MAMarket() {
  const { maMarket, refreshMAMarket } = useGameStore();
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  if (!maMarket || !maMarket.targets || maMarket.targets.length === 0) {
     return (
        <div className="flex flex-col items-center justify-center h-full text-brand-muted">
           <Building2 size={64} className="mb-4 opacity-20" />
           <p className="text-lg">No acquisition targets currently available.</p>
           <button onClick={refreshMAMarket} className="mt-4 px-4 py-2 bg-brand-surface rounded-lg hover:bg-black/5 flex items-center">
              <RefreshCw size={16} className="mr-2" /> Refresh Market
           </button>
        </div>
     );
  }

  return (
    <div className="p-8 overflow-y-auto h-full">
      <div className="flex justify-between items-center mb-6">
         <div>
            <h2 className="text-2xl font-bold text-brand-text flex items-center">
               <Briefcase className="mr-2 text-brand-blue" /> M&A Opportunities
            </h2>
            <p className="text-brand-muted">Acquire established businesses to rapidly expand your empire.</p>
         </div>
         <button onClick={refreshMAMarket} className="px-4 py-2 bg-brand-surface border border-black/10 rounded-lg hover:bg-brand-blue/5 text-sm font-medium flex items-center">
            <RefreshCw size={16} className="mr-2" /> Refresh Deals
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {maMarket.targets.map(target => (
           <div key={target.id} className="bg-brand-card border border-black/10 rounded-xl p-6 flex flex-col hover:border-brand-blue/30 transition-colors shadow-lg relative overflow-hidden group">
              {target.sellerMotivation === 'Desperate' && (
                 <div className="absolute top-0 right-0 bg-brand-loss text-white text-xs font-bold px-3 py-1 rounded-bl-lg">Distressed Asset</div>
              )}
              {target.sellerMotivation === 'Greedy' && (
                 <div className="absolute top-0 right-0 bg-brand-gold text-black text-xs font-bold px-3 py-1 rounded-bl-lg">Premium Valuation</div>
              )}
              
              <div className="flex items-center space-x-2 mb-2">
                 <h3 className="text-xl font-bold text-brand-text">{target.name}</h3>
              </div>
              
              <div className="flex items-center space-x-3 mb-6">
                 <span className="bg-brand-surface text-brand-muted text-xs px-2 py-1 rounded border border-black/5">{target.industry}</span>
                 <span className="text-brand-muted text-xs flex items-center"><Users size={12} className="mr-1" /> {target.employees}</span>
                 <span className="text-brand-muted text-xs flex items-center"><Target size={12} className="mr-1" /> Lvl {target.level}</span>
              </div>

              <div className="space-y-3 mb-6">
                 <div className="flex justify-between text-sm">
                    <span className="text-brand-muted">Revenue / mo</span>
                    <span className="text-brand-text font-medium">{formatCurrency(target.lastMonthRevenue)}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-brand-muted">Profit / mo</span>
                    <span className="text-brand-profit font-medium">{formatCurrency(target.lastMonthProfit)}</span>
                 </div>
                 <div className="flex justify-between text-sm pt-2 border-t border-black/10">
                    <span className="text-brand-muted">Fair Valuation</span>
                    <span className="text-brand-text font-bold">{formatCurrency(target.valuation)}</span>
                 </div>
                 <div className="flex justify-between text-sm bg-brand-surface p-2 rounded border border-brand-blue/20">
                    <span className="text-brand-blue font-semibold">Asking Price</span>
                    <span className="text-brand-blue font-bold">{formatCurrency(target.askingPrice)}</span>
                 </div>
              </div>

              <button 
                 onClick={() => setSelectedTarget(target.id)}
                 className="mt-auto w-full py-3 bg-brand-blue text-white font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-md"
              >
                 Enter Negotiations
              </button>
           </div>
        ))}
      </div>

      {selectedTarget && (
         <NegotiationModal targetId={selectedTarget} onClose={() => setSelectedTarget(null)} />
      )}
    </div>
  );
}

function NegotiationModal({ targetId, onClose }: { targetId: string, onClose: () => void }) {
   const { maMarket, player, buyBusinessMA } = useGameStore();
   const [activeTab, setActiveTab] = useState<'diligence' | 'negotiate'>('diligence');
   const [offerType, setOfferType] = useState<'Cash' | 'Loan' | 'Earnout'>('Cash');
   const [offerValue, setOfferValue] = useState<number>(0);
   const [result, setResult] = useState<{success: boolean, message: string} | null>(null);

   const target = maMarket.targets.find(t => t.id === targetId);
   if (!target) return null;

   // Initialize offer value
   if (offerValue === 0) {
      setOfferValue(Math.floor(target.askingPrice * 0.95)); // Default to 5% under ask
   }

   const handleOffer = () => {
      const res = buyBusinessMA(target.id, offerType, offerValue);
      setResult(res);
      if (res.success) {
         setTimeout(onClose, 2000);
      }
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
         <div className="bg-brand-card border border-brand-blue/30 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-black/10 bg-brand-surface flex justify-between items-center">
               <h2 className="text-2xl font-black text-brand-text">{target.name}</h2>
               <button onClick={onClose} className="text-brand-muted hover:text-brand-loss text-xl font-bold">&times;</button>
            </div>

            <div className="flex border-b border-black/10">
               <button onClick={() => setActiveTab('diligence')} className={`flex-1 py-3 font-bold transition-all ${activeTab === 'diligence' ? 'bg-brand-bg text-brand-blue border-b-2 border-brand-blue' : 'text-brand-muted hover:bg-brand-surface'}`}>
                  Due Diligence
               </button>
               <button onClick={() => setActiveTab('negotiate')} className={`flex-1 py-3 font-bold transition-all ${activeTab === 'negotiate' ? 'bg-brand-bg text-brand-blue border-b-2 border-brand-blue' : 'text-brand-muted hover:bg-brand-surface'}`}>
                  Negotiation
               </button>
            </div>

            <div className="p-8 overflow-y-auto">
               {result ? (
                  <div className={`p-8 rounded-xl text-center border ${result.success ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                     <div className={`text-4xl mb-4 ${result.success ? 'text-brand-profit' : 'text-brand-loss'}`}>
                        {result.success ? '🤝 Deal Closed!' : '🚫 Deal Rejected'}
                     </div>
                     <p className="text-lg text-brand-text">{result.message}</p>
                     {!result.success && (
                        <button onClick={() => setResult(null)} className="mt-6 px-6 py-2 bg-brand-surface rounded-lg font-bold">Try New Terms</button>
                     )}
                  </div>
               ) : activeTab === 'diligence' ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                     <div>
                        <h3 className="text-xl font-black mb-3">Company Health</h3>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="bg-brand-surface p-4 rounded-xl">
                              <div className="text-sm text-brand-muted">Monthly Revenue</div>
                              <div className="font-bold text-lg">{formatCurrency(target.lastMonthRevenue)}</div>
                           </div>
                           <div className="bg-brand-surface p-4 rounded-xl">
                              <div className="text-sm text-brand-muted">Net Profit Margin</div>
                              <div className="font-bold text-lg text-brand-profit">{((target.lastMonthProfit / target.lastMonthRevenue) * 100).toFixed(1)}%</div>
                           </div>
                           <div className="bg-brand-surface p-4 rounded-xl">
                              <div className="text-sm text-brand-muted">Debt Liabilities</div>
                              <div className="font-bold text-lg text-brand-loss">{formatCurrency(target.dueDiligence?.debt || 0)}</div>
                           </div>
                           <div className="bg-brand-surface p-4 rounded-xl">
                              <div className="text-sm text-brand-muted">Customer Base</div>
                              <div className="font-bold text-lg">{(target.dueDiligence?.customers || 1000).toLocaleString()}</div>
                           </div>
                        </div>
                     </div>
                     
                     {target.dueDiligence?.risks && target.dueDiligence.risks.length > 0 && (
                        <div>
                           <h3 className="text-lg font-bold mb-3 text-brand-loss">Identified Risks</h3>
                           <ul className="space-y-2">
                              {target.dueDiligence.risks.map((risk, idx) => (
                                 <li key={idx} className="bg-red-500/10 text-brand-loss px-4 py-2 rounded-lg font-medium">{risk}</li>
                              ))}
                           </ul>
                        </div>
                     )}

                     <button onClick={() => setActiveTab('negotiate')} className="w-full py-3 bg-brand-blue text-white rounded-lg font-bold hover:bg-blue-600 transition">
                        Proceed to Negotiation
                     </button>
                  </div>
               ) : (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                     
                     <div className="bg-brand-bg rounded-xl p-6 border border-black/10">
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-brand-muted">Seller's Ask:</span>
                           <span className="text-xl font-bold text-brand-text">{formatCurrency(target.askingPrice)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-brand-muted">Motivation:</span>
                           <span className={`font-semibold ${target.sellerMotivation === 'Desperate' ? 'text-brand-loss' : target.sellerMotivation === 'Greedy' ? 'text-brand-gold' : 'text-brand-blue'}`}>
                              {target.sellerMotivation}
                           </span>
                        </div>
                     </div>

                     <div>
                        <h3 className="text-lg font-bold text-brand-text mb-4">Structure Offer</h3>
                        
                        <div className="grid grid-cols-3 gap-3 mb-6">
                           <button 
                              onClick={() => setOfferType('Cash')}
                              className={`p-3 rounded-lg border text-sm font-bold transition-all ${offerType === 'Cash' ? 'bg-brand-blue text-white border-brand-blue shadow-lg' : 'bg-brand-surface text-brand-muted border-black/10'}`}
                           >
                              All Cash
                           </button>
                           <button 
                              onClick={() => setOfferType('Loan')}
                              className={`p-3 rounded-lg border text-sm font-bold transition-all ${offerType === 'Loan' ? 'bg-brand-purple text-white border-brand-purple shadow-lg' : 'bg-brand-surface text-brand-muted border-black/10'}`}
                           >
                              Cash + Loan
                           </button>
                           <button 
                              onClick={() => setOfferType('Earnout')}
                              className={`p-3 rounded-lg border text-sm font-bold transition-all ${offerType === 'Earnout' ? 'bg-brand-gold text-black border-brand-gold shadow-lg' : 'bg-brand-surface text-brand-muted border-black/10'}`}
                           >
                              Earnout
                           </button>
                        </div>

                        <div className="mb-6">
                           <label className="block text-sm text-brand-muted mb-2 font-bold">Total Offer Value</label>
                           <input 
                              type="range" 
                              min={target.valuation * 0.5} 
                              max={target.askingPrice * 1.5} 
                              step={10000}
                              value={offerValue}
                              onChange={(e) => setOfferValue(Number(e.target.value))}
                              className={`w-full ${offerType === 'Cash' ? 'accent-brand-blue' : offerType === 'Loan' ? 'accent-brand-purple' : 'accent-brand-gold'}`}
                           />
                           <div className="text-center mt-3 text-3xl font-black text-brand-text">
                              {formatCurrency(offerValue)}
                           </div>
                        </div>

                        <div className="bg-brand-surface border border-black/10 p-5 rounded-xl">
                           <h4 className="font-bold text-brand-text mb-3">Terms Summary</h4>
                           {offerType === 'Cash' && (
                              <p className="text-brand-muted text-sm flex items-center"><AlertCircle size={14} className="mr-2 text-brand-blue"/> Pay {formatCurrency(offerValue)} in cold hard cash upfront. Highest acceptance rate.</p>
                           )}
                           {offerType === 'Loan' && (
                              <ul className="text-brand-muted text-sm space-y-2">
                                 <li className="flex justify-between"><span>Down Payment (20% Cash):</span> <span className="font-bold text-brand-loss">-{formatCurrency(offerValue * 0.2)}</span></li>
                                 <li className="flex justify-between"><span>Bank Financed (80%):</span> <span className="font-bold text-brand-text">{formatCurrency(offerValue * 0.8)}</span></li>
                                 <li className="flex justify-between pt-2 border-t border-black/10/50"><span>Est. Monthly Payment:</span> <span className="font-bold">~{formatCurrency((offerValue * 0.8) / 60)}/mo</span></li>
                              </ul>
                           )}
                           {offerType === 'Earnout' && (
                              <ul className="text-brand-muted text-sm space-y-2">
                                 <li className="flex justify-between"><span>Upfront Cash (30%):</span> <span className="font-bold text-brand-loss">-{formatCurrency(offerValue * 0.3)}</span></li>
                                 <li className="flex justify-between"><span>Deferred (70%):</span> <span className="font-bold text-brand-text">{formatCurrency(offerValue * 0.7)}</span></li>
                                 <li className="flex justify-between pt-2 border-t border-black/10/50"><span>Earnout Payout:</span> <span className="font-bold">~{formatCurrency((offerValue * 0.7) / 36)}/mo for 3 years</span></li>
                              </ul>
                           )}
                        </div>
                     </div>
                  </div>
               )}
            </div>

            {!result && (
               <div className="p-6 border-t border-black/10 bg-brand-bg mt-auto">
                  <button 
                     onClick={handleOffer}
                     className="w-full py-4 bg-brand-profit text-white font-black rounded-xl hover:bg-emerald-600 transition-colors shadow-[0_0_20px_rgba(32,214,138,0.3)] text-lg"
                  >
                     SUBMIT OFFER
                  </button>
               </div>
            )}
         </div>
      </div>
   );
}
