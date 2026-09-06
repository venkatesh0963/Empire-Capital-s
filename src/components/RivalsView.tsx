import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { calculateEmpireWars } from '@/lib/rivalsData';
import { formatCurrency } from '@/lib/utils';
import { Swords, Trophy, Crown, Briefcase, Building, Target } from 'lucide-react';

export function RivalsView() {
  const state = useGameStore();
  const { competitors } = state;
  const empireWars = calculateEmpireWars(state);

  return (
    <div className="p-6 h-full overflow-y-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-brand-bg">
      <div className="flex items-center space-x-4 mb-6">
         <div className="p-3 bg-brand-loss/10 rounded-xl">
            <Swords className="text-brand-loss" size={32} />
         </div>
         <div>
            <h1 className="text-3xl font-black text-brand-text">Rivals & Empires</h1>
            <p className="text-brand-muted">Compete against global AI tycoons for market dominance.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {competitors.map((comp, idx) => (
            <div key={comp.id} className="bg-brand-card border border-black/10 rounded-xl p-6 flex flex-col relative overflow-hidden">
               <div className="absolute top-0 left-0 w-2 h-full bg-brand-loss/30"></div>
               <div className="pl-4">
                  <h3 className="text-xl font-black text-brand-text flex items-center">
                     {comp.name} 
                     {idx === 0 && <Crown size={16} className="ml-2 text-brand-gold" />}
                  </h3>
                  <p className="text-sm text-brand-muted font-bold mb-4">Net Worth: {formatCurrency(comp.netWorth)}</p>
                  
                  <div className="space-y-3 bg-brand-surface p-4 rounded-lg">
                     <div className="flex items-center text-sm">
                        <Target size={16} className="text-brand-blue mr-2" />
                        <span className="text-brand-muted mr-2">Strategy:</span>
                        <span className="font-bold text-brand-text">{comp.strategy}</span>
                     </div>
                     <div className="flex items-center text-sm">
                        <Briefcase size={16} className="text-brand-purple mr-2" />
                        <span className="text-brand-muted mr-2">Businesses:</span>
                        <span className="font-bold text-brand-text">{comp.holdings?.businesses || 0}</span>
                     </div>
                     <div className="flex items-center text-sm">
                        <Building size={16} className="text-brand-gold mr-2" />
                        <span className="text-brand-muted mr-2">Real Estate:</span>
                        <span className="font-bold text-brand-text">{comp.holdings?.realEstate || 0}</span>
                     </div>
                  </div>
               </div>
            </div>
         ))}
      </div>

      <div className="pt-6 border-t border-black/10">
         <h2 className="text-2xl font-black text-brand-text mb-6">Empire Wars: Market Share</h2>
         
         <div className="space-y-8">
            {empireWars.map(war => {
               const playerIsLeader = war.playerShare > war.competitors[0]?.share;
               
               return (
                  <div key={war.industry} className="bg-brand-card border border-black/10 rounded-xl p-6">
                     <div className="flex justify-between items-end mb-4">
                        <div>
                           <h3 className="text-xl font-bold text-brand-text flex items-center">
                              {war.industry} Market
                              {playerIsLeader && <Trophy size={18} className="ml-2 text-brand-gold" />}
                           </h3>
                           <p className="text-sm text-brand-muted">Total Monthly Volume: {formatCurrency(war.totalMarketSize)}</p>
                        </div>
                     </div>

                     {/* Progress Bars */}
                     <div className="space-y-4 mt-6">
                        {/* Player Bar */}
                        <div>
                           <div className="flex justify-between text-sm font-bold mb-1">
                              <span className={playerIsLeader ? 'text-brand-gold' : 'text-brand-text'}>You (Player)</span>
                              <span className="text-brand-muted">{war.playerShare.toFixed(1)}% ({formatCurrency(war.playerRevenue)})</span>
                           </div>
                           <div className="w-full bg-black/5 rounded-full h-3">
                              <div className={`h-3 rounded-full transition-all duration-1000 ${playerIsLeader ? 'bg-brand-gold' : 'bg-brand-blue'}`} style={{ width: `${Math.min(100, Math.max(1, war.playerShare))}%` }}></div>
                           </div>
                        </div>

                        {/* Competitor Bars */}
                        {war.competitors.slice(0, 3).map(comp => (
                           <div key={comp.name}>
                              <div className="flex justify-between text-sm font-bold mb-1">
                                 <span className={comp.isLeader ? 'text-brand-loss' : 'text-brand-muted'}>{comp.name}</span>
                                 <span className="text-brand-muted/70">{comp.share.toFixed(1)}% ({formatCurrency(comp.revenue)})</span>
                              </div>
                              <div className="w-full bg-black/5 rounded-full h-3">
                                 <div className={`h-3 rounded-full transition-all duration-1000 ${comp.isLeader ? 'bg-brand-loss' : 'bg-black/20'}`} style={{ width: `${Math.min(100, Math.max(1, comp.share))}%` }}></div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               );
            })}
         </div>
      </div>
    </div>
  );
}
