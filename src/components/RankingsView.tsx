import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { formatCurrency } from '@/lib/utils';
import { Trophy, TrendingUp, Building, Briefcase, DollarSign } from 'lucide-react';

type SortMetric = 'netWorth' | 'revenue' | 'assets';

export function RankingsView() {
  const { player, competitors } = useGameStore();
  const [sortBy, setSortBy] = useState<SortMetric>('netWorth');

  // Player Stats
  let playerTotalRev = player.passiveIncome; // Base passive
  let playerAssetsCount = (player.unlockedCities?.length || 1); 

  const allTycoons = [
     {
        id: 'player',
        name: typeof player.profile?.name === 'string' ? player.profile.name : (player.profile?.name as any)?.name || 'You',
        isPlayer: true,
        netWorth: player.netWorth,
        revenue: playerTotalRev * 12, // Annualized roughly
        assets: playerAssetsCount,
        strategy: 'Diverse Portfolio'
     },
     ...competitors.map(c => ({
        id: c.id,
        name: c.name,
        isPlayer: false,
        netWorth: c.netWorth,
        revenue: c.monthlyRevenue * 12,
        assets: (c.holdings?.businesses || 0) + (c.holdings?.realEstate || 0),
        strategy: c.strategy
     }))
  ];

  // Sort logic
  allTycoons.sort((a, b) => {
     if (sortBy === 'netWorth') return b.netWorth - a.netWorth;
     if (sortBy === 'revenue') return b.revenue - a.revenue;
     if (sortBy === 'assets') return b.assets - a.assets;
     return 0;
  });

  return (
    <div className="p-6 h-full overflow-y-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-brand-bg">
      <div className="flex items-center space-x-4 mb-6">
         <div className="p-3 bg-brand-gold/10 rounded-xl">
            <Trophy className="text-brand-gold" size={32} />
         </div>
         <div>
            <h1 className="text-3xl font-black text-brand-text">Global Rankings</h1>
            <p className="text-brand-muted">See how you stack up against the world's most powerful tycoons.</p>
         </div>
      </div>

      <div className="bg-brand-card border border-black/10 rounded-xl overflow-hidden">
         <div className="p-4 border-b border-black/10 bg-brand-surface flex space-x-2">
            <button 
               onClick={() => setSortBy('netWorth')}
               className={`px-4 py-2 rounded-md text-sm font-bold transition flex items-center ${sortBy === 'netWorth' ? 'bg-brand-bg text-brand-text shadow-sm' : 'text-brand-muted hover:text-brand-text'}`}
            >
               <DollarSign size={16} className="mr-2" /> Net Worth
            </button>
            <button 
               onClick={() => setSortBy('revenue')}
               className={`px-4 py-2 rounded-md text-sm font-bold transition flex items-center ${sortBy === 'revenue' ? 'bg-brand-bg text-brand-text shadow-sm' : 'text-brand-muted hover:text-brand-text'}`}
            >
               <TrendingUp size={16} className="mr-2" /> Annual Revenue
            </button>
            <button 
               onClick={() => setSortBy('assets')}
               className={`px-4 py-2 rounded-md text-sm font-bold transition flex items-center ${sortBy === 'assets' ? 'bg-brand-bg text-brand-text shadow-sm' : 'text-brand-muted hover:text-brand-text'}`}
            >
               <Building size={16} className="mr-2" /> Total Assets
            </button>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-brand-bg text-brand-muted text-sm border-b border-black/10">
                     <th className="p-4 font-medium w-16 text-center">Rank</th>
                     <th className="p-4 font-medium">Tycoon</th>
                     <th className="p-4 font-medium text-right">Net Worth</th>
                     <th className="p-4 font-medium text-right">Est. Annual Revenue</th>
                     <th className="p-4 font-medium text-center">Asset Count</th>
                     <th className="p-4 font-medium">Known Strategy</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-black/5">
                  {allTycoons.map((tycoon, idx) => (
                     <tr key={tycoon.id} className={`transition hover:bg-black/5 ${tycoon.isPlayer ? 'bg-brand-surface' : ''}`}>
                        <td className="p-4 text-center font-black text-brand-muted">#{idx + 1}</td>
                        <td className="p-4">
                           <div className="flex items-center font-bold">
                              <span className={tycoon.isPlayer ? 'text-brand-profit' : 'text-brand-text'}>
                                 {tycoon.name}
                              </span>
                              {tycoon.isPlayer && <span className="ml-2 px-2 py-0.5 text-xs bg-brand-profit/20 text-brand-profit rounded-full">YOU</span>}
                           </div>
                        </td>
                        <td className="p-4 text-right font-bold text-brand-text">{formatCurrency(tycoon.netWorth)}</td>
                        <td className="p-4 text-right font-medium text-brand-text">{formatCurrency(tycoon.revenue)}</td>
                        <td className="p-4 text-center font-medium text-brand-muted">{tycoon.assets}</td>
                        <td className="p-4 text-sm text-brand-muted">
                           <span className="flex items-center">
                              {tycoon.strategy === 'Technology' && <Briefcase size={14} className="mr-2 text-brand-blue" />}
                              {tycoon.strategy === 'Real estate' && <Building size={14} className="mr-2 text-brand-gold" />}
                              {tycoon.strategy === 'Aggressive acquisitions' && <TrendingUp size={14} className="mr-2 text-brand-loss" />}
                              {tycoon.strategy}
                           </span>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
