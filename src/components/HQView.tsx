import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { formatCurrency } from '@/lib/utils';
import { Building2, Home, Building, ShieldCheck, MapPin, CheckCircle, Lock, Plus } from 'lucide-react';

const HQ_TIERS = [
  { level: 1, name: 'Small Office', emoji: '🏚️', description: 'A cramped rental space in a strip mall.' },
  { level: 2, name: 'Startup Office', emoji: '🏢', description: 'A modern co-working floor downtown.', cost: 500000 },
  { level: 3, name: 'Corporate Tower', emoji: '🏙️', description: 'An entire glass tower with your logo on it.', cost: 2000000 },
  { level: 4, name: 'Headquarters', emoji: '🌆', description: 'A massive sprawling corporate campus.', cost: 10000000 },
  { level: 5, name: 'Empire Tower', emoji: '🏙️', description: 'The tallest skyscraper in the financial district.', cost: 50000000 },
  { level: 6, name: 'Global HQ', emoji: '🏰', description: 'A sovereign citadel of extreme wealth and power.', cost: 250000000 }
];

const HQ_MODULES = [
  { id: 'Trading Floor', name: 'Trading Floor', icon: Building2, cost: 1000000, reqLevel: 3, description: 'Increases stock market dividend yields by 20%.' },
  { id: 'Research Lab', name: 'R&D Laboratory', icon: ShieldCheck, cost: 3500000, reqLevel: 4, description: 'All businesses gain a 10% competitive edge in pricing.' },
  { id: 'Executive Suite', name: 'Executive Suite', icon: MapPin, cost: 5000000, reqLevel: 5, description: 'CEO gains XP 50% faster.' },
  { id: 'Private Bank', name: 'Private Bank', icon: Home, cost: 15000000, reqLevel: 6, description: 'Reduces interest rates on all new loans.' },
];

export function HQView() {
  const { player, upgradeHQ, buildHQModule } = useGameStore();
  const hq = player.hq || { level: 1, modules: [] };
  
  const currentTier = HQ_TIERS.find(t => t.level === hq.level)!;
  const nextTier = HQ_TIERS.find(t => t.level === hq.level + 1);

  return (
    <div className="p-8 h-full overflow-y-auto bg-brand-bg">
      <div className="max-w-5xl mx-auto space-y-8">
         
         <div className="flex justify-between items-end">
            <div>
               <h1 className="text-4xl font-black text-brand-text mb-2 tracking-tight">Empire Headquarters</h1>
               <p className="text-lg text-brand-muted">The physical manifestation of your wealth and power.</p>
            </div>
            <div className="text-right">
               <p className="text-sm text-brand-muted mb-1">Current Tier</p>
               <p className="text-2xl font-bold text-brand-blue">{currentTier.name}</p>
            </div>
         </div>

         {/* Current HQ Hero */}
         <div className="bg-gradient-to-br from-brand-card to-brand-bg border border-brand-blue/20 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            
            <div className="text-9xl mb-6 relative z-10 filter drop-shadow-2xl animate-in zoom-in">
               {currentTier.emoji}
            </div>
            
            <h2 className="text-4xl font-black text-brand-text mb-4 relative z-10">{typeof player.profile?.name === 'string' ? player.profile.name : (player.profile?.name as any)?.name || 'The Founder'}'s {currentTier.name}</h2>
            <p className="text-xl text-brand-muted max-w-2xl mx-auto relative z-10">{currentTier.description}</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Upgrade Path */}
            <div className="bg-brand-card border border-black/10 rounded-2xl p-8 shadow-lg">
               <h3 className="text-xl font-bold text-brand-text mb-6 flex items-center"><Building className="mr-2" /> HQ Expansion</h3>
               
               {nextTier ? (
                  <div className="bg-brand-surface border border-brand-blue/30 rounded-xl p-6 relative overflow-hidden group">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                           <p className="text-sm font-bold text-brand-blue mb-1 uppercase tracking-wider">Next Tier</p>
                           <h4 className="text-2xl font-black text-brand-text flex items-center">
                              <span className="text-3xl mr-3">{nextTier.emoji}</span> {nextTier.name}
                           </h4>
                        </div>
                        <div className="text-right">
                           <p className="text-sm text-brand-muted mb-1">Upgrade Cost</p>
                           <p className="font-bold text-brand-loss text-xl">{formatCurrency(nextTier.cost!)}</p>
                        </div>
                     </div>
                     <p className="text-brand-muted mb-6">{nextTier.description}</p>
                     
                     <button 
                        onClick={upgradeHQ}
                        disabled={player.cash < nextTier.cost!}
                        className="w-full py-4 bg-brand-blue text-white font-bold rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                     >
                        {player.cash >= nextTier.cost! ? 'INITIATE UPGRADE' : 'INSUFFICIENT FUNDS'}
                     </button>
                  </div>
               ) : (
                  <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-xl p-6 text-center">
                     <span className="text-6xl mb-4 block">👑</span>
                     <h4 className="text-2xl font-black text-brand-gold mb-2">Maximum Authority Reached</h4>
                     <p className="text-brand-text">You own the greatest headquarters on Earth.</p>
                  </div>
               )}
            </div>

            {/* Modules */}
            <div className="bg-brand-card border border-black/10 rounded-2xl p-8 shadow-lg">
               <h3 className="text-xl font-bold text-brand-text mb-6 flex items-center"><Plus className="mr-2" /> Special Facilities</h3>
               
               <div className="space-y-4">
                  {HQ_MODULES.map(module => {
                     const isUnlocked = hq.modules.includes(module.id);
                     const isLocked = hq.level < module.reqLevel;
                     
                     return (
                        <div key={module.id} className={`p-4 rounded-xl border flex items-center justify-between ${isUnlocked ? 'bg-emerald-500/5 border-emerald-500/20' : isLocked ? 'bg-black/5 border-black/10 opacity-60 grayscale' : 'bg-brand-surface border-black/10'}`}>
                           <div className="flex items-center">
                              <div className={`p-3 rounded-lg mr-4 ${isUnlocked ? 'bg-emerald-500/20 text-emerald-600' : isLocked ? 'bg-black/10 text-brand-muted' : 'bg-brand-blue/10 text-brand-blue'}`}>
                                 <module.icon size={24} />
                              </div>
                              <div>
                                 <h4 className="font-bold text-brand-text flex items-center">
                                    {module.name} 
                                    {isLocked && <Lock size={12} className="ml-2 text-brand-muted" />}
                                 </h4>
                                 <p className="text-sm text-brand-muted">{isLocked ? `Requires ${HQ_TIERS.find(t=>t.level===module.reqLevel)?.name}` : module.description}</p>
                              </div>
                           </div>
                           
                           <div className="text-right pl-4">
                              {isUnlocked ? (
                                 <div className="flex items-center text-emerald-600 font-bold bg-emerald-500/10 px-3 py-1 rounded">
                                    <CheckCircle size={16} className="mr-1" /> Built
                                 </div>
                              ) : isLocked ? (
                                 <span className="text-sm font-bold text-brand-muted">LOCKED</span>
                              ) : (
                                 <button 
                                    onClick={() => buildHQModule(module.id, module.cost)}
                                    disabled={player.cash < module.cost}
                                    className="px-4 py-2 bg-brand-blue text-white text-sm font-bold rounded-lg disabled:opacity-50"
                                 >
                                    {formatCurrency(module.cost)}
                                 </button>
                              )}
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>

         </div>

      </div>
    </div>
  );
}
