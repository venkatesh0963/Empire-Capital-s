import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { ACHIEVEMENTS, Achievement, AchievementTier } from '@/lib/achievementsData';
import { Trophy, Star, Crown, Diamond, Medal } from 'lucide-react';

export function AchievementsView() {
  const { player } = useGameStore();
  const unlocked = player.unlockedAchievements || [];

  const getTierColors = (tier: AchievementTier) => {
    switch (tier) {
      case 'bronze': return { bg: 'bg-[#CD7F32]/10', border: 'border-[#CD7F32]/30', text: 'text-[#CD7F32]', glow: 'shadow-[#CD7F32]/20', icon: Medal };
      case 'silver': return { bg: 'bg-slate-400/10', border: 'border-slate-400/30', text: 'text-slate-500', glow: 'shadow-slate-400/20', icon: Medal };
      case 'gold': return { bg: 'bg-brand-gold/10', border: 'border-brand-gold/30', text: 'text-brand-gold', glow: 'shadow-brand-gold/20', icon: Star };
      case 'diamond': return { bg: 'bg-brand-blue/10', border: 'border-brand-blue/30', text: 'text-brand-blue', glow: 'shadow-brand-blue/20', icon: Diamond };
      case 'crown': return { bg: 'bg-brand-purple/10', border: 'border-brand-purple/40', text: 'text-brand-purple', glow: 'shadow-brand-purple/30', icon: Crown };
      default: return { bg: 'bg-black/5', border: 'border-black/10', text: 'text-brand-muted', glow: '', icon: Trophy };
    }
  };

  // Group achievements by category
  const categories = ['networth', 'business', 'realestate', 'market', 'general'] as const;
  const categoryNames = {
    networth: 'Wealth & Income',
    business: 'Business Empire',
    realestate: 'Real Estate Mogul',
    market: 'Markets & Trading',
    general: 'Lifestyle & Status'
  };

  return (
    <div className="p-8 overflow-y-auto h-full space-y-10 relative z-10">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-brand-text flex items-center">
            <Trophy className="mr-3 text-brand-gold" size={32} />
            Hall of Fame
          </h2>
          <p className="text-brand-muted mt-2">Unlock achievements by building your empire. {unlocked.length} / {ACHIEVEMENTS.length} completed.</p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-64 text-right">
           <div className="flex justify-between text-xs font-bold text-brand-muted mb-2 uppercase tracking-wider">
              <span>Progress</span>
              <span className="text-brand-gold">{Math.round((unlocked.length / ACHIEVEMENTS.length) * 100)}%</span>
           </div>
           <div className="w-full bg-brand-surface rounded-full h-3 border border-black/5 overflow-hidden">
              <div className="bg-gradient-to-r from-brand-gold to-brand-profit h-3 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(245,196,81,0.5)]" style={{ width: `${(unlocked.length / ACHIEVEMENTS.length) * 100}%` }}></div>
           </div>
        </div>
      </header>

      {categories.map(cat => {
        const catAch = ACHIEVEMENTS.filter(a => a.category === cat);
        if (catAch.length === 0) return null;

        return (
          <section key={cat} className="space-y-4">
            <h3 className="text-xl font-semibold text-brand-text border-b border-black/5 pb-2 uppercase tracking-wider">{categoryNames[cat]}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {catAch.map(ach => {
                const isUnlocked = unlocked.find(u => u.id === ach.id);
                const colors = getTierColors(ach.tier);
                const Icon = colors.icon;
                
                return (
                  <div key={ach.id} className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                    isUnlocked 
                      ? `${colors.bg} ${colors.border} ${colors.glow} shadow-lg backdrop-blur-md` 
                      : 'bg-brand-surface border-black/5 opacity-60 grayscale hover:grayscale-0'
                  }`}>
                    {/* Background glow if unlocked */}
                    {isUnlocked && <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>}
                    
                    <div className="flex items-start justify-between relative z-10">
                       <div>
                          <h4 className={`font-bold text-lg ${isUnlocked ? colors.text : 'text-brand-text'}`}>{ach.name}</h4>
                          <p className={`text-sm mt-1 mb-2 ${isUnlocked ? 'text-brand-text' : 'text-brand-muted'}`}>{ach.description}</p>
                          
                          <div className={`text-xs font-bold px-2 py-1 inline-block rounded-md ${isUnlocked ? 'bg-brand-profit/20 text-brand-profit' : 'bg-black/5 text-brand-muted'}`}>
                             Reward: ${ach.reward.toLocaleString()}
                          </div>
                          
                          {isUnlocked && (
                             <div className="mt-4 flex flex-col space-y-2">
                                <div className="text-xs font-semibold text-brand-muted tracking-wider uppercase">
                                   Unlocked: {isUnlocked.date}
                                </div>
                                {!isUnlocked.claimed && (
                                   <button 
                                      onClick={() => useGameStore.getState().claimAchievementReward(ach.id)}
                                      className="py-1.5 px-3 bg-brand-gold text-white font-bold rounded-lg text-xs hover:bg-yellow-500 shadow-lg transition-all animate-pulse shadow-brand-gold/50 border border-brand-gold"
                                   >
                                      CLAIM REWARD
                                   </button>
                                )}
                                {isUnlocked.claimed && (
                                   <div className="text-xs font-bold text-brand-profit uppercase flex items-center">
                                      <span className="mr-1">✓</span> Claimed
                                   </div>
                                )}
                             </div>
                          )}
                       </div>
                       
                       <div className={`p-3 rounded-xl ${isUnlocked ? 'bg-white/20' : 'bg-black/5'}`}>
                          <Icon size={24} className={isUnlocked ? colors.text : 'text-slate-400'} />
                       </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
