import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { formatCurrency } from '@/lib/utils';
import { CITY_BUILDINGS } from '@/lib/cityData';
import { Pickaxe, Clock, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export function CityBuilder() {
  const { player, realEstate, buildCityBuilding } = useGameStore();
  const ownedBuildings = realEstate.cityBuildings || [];

  return (
    <div className="p-6 h-full overflow-y-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-brand-blue/10 border border-brand-blue/30 rounded-xl p-6 text-brand-blue flex items-start">
        <Pickaxe className="mr-4 mt-1 flex-shrink-0" size={24} />
        <div>
          <h3 className="font-bold text-lg mb-1">City Megaprojects</h3>
          <p className="text-sm opacity-90">Construct massive municipal and commercial developments. These require huge capital and time to build, but provide unparalleled passive revenue once operational.</p>
        </div>
      </div>

      {/* Owned Buildings */}
      {ownedBuildings.length > 0 && (
        <div>
          <h3 className="text-xl font-black text-brand-text mb-4">Your Developments</h3>
          <div className="space-y-4">
            {ownedBuildings.map(b => {
               const base = CITY_BUILDINGS.find(cb => cb.id === b.typeId);
               if (!base) return null;
               
               const isBuilding = b.status === 'Building';
               const progress = isBuilding ? Math.max(0, 100 - (b.daysUntilComplete / base.buildTimeDays) * 100) : 100;

               return (
                 <div key={b.id} className="bg-brand-card border border-black/10 rounded-xl p-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
                   <div className="flex items-center space-x-4">
                      <div className="text-4xl p-2 bg-brand-surface rounded-lg">{base.icon}</div>
                      <div>
                         <h4 className="font-bold text-brand-text text-lg">{base.name}</h4>
                         <div className="flex items-center text-sm font-medium mt-1">
                            {isBuilding ? (
                               <span className="text-brand-gold flex items-center"><Clock size={14} className="mr-1" /> Under Construction</span>
                            ) : (
                               <span className="text-brand-profit flex items-center"><CheckCircle size={14} className="mr-1" /> Operational</span>
                            )}
                         </div>
                      </div>
                   </div>

                   {isBuilding ? (
                     <div className="w-full md:w-64">
                        <div className="flex justify-between text-xs font-bold text-brand-muted mb-1">
                           <span>{Math.round(progress)}% Complete</span>
                           <span>{b.daysUntilComplete} days left</span>
                        </div>
                        <div className="w-full bg-black/10 rounded-full h-2">
                           <div className="bg-brand-gold h-2 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                        </div>
                     </div>
                   ) : (
                     <div className="flex space-x-6 text-sm">
                        <div>
                           <p className="text-brand-muted font-semibold">Revenue</p>
                           <p className="font-bold text-brand-profit">+{formatCurrency(base.monthlyRevenue)}/mo</p>
                        </div>
                        <div>
                           <p className="text-brand-muted font-semibold">Maintenance</p>
                           <p className="font-bold text-brand-loss">-{formatCurrency(base.maintenanceCost)}/mo</p>
                        </div>
                     </div>
                   )}
                 </div>
               );
            })}
          </div>
        </div>
      )}

      {/* Available Projects */}
      <div>
         <h3 className="text-xl font-black text-brand-text mb-4">Available Projects</h3>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {CITY_BUILDINGS.map(project => {
               const canAfford = player.cash >= project.baseCost;

               return (
                  <div key={project.id} className="bg-brand-card border border-black/10 rounded-xl p-5 hover:border-black/20 transition-all flex flex-col h-full">
                     <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                           <span className="text-3xl mr-3">{project.icon}</span>
                           <div>
                              <h4 className="font-bold text-brand-text text-lg">{project.name}</h4>
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-surface text-brand-muted uppercase tracking-wider">{project.category}</span>
                           </div>
                        </div>
                     </div>
                     
                     <p className="text-sm text-brand-muted mb-4 flex-grow">{project.description}</p>

                     <div className="grid grid-cols-2 gap-4 mb-4 bg-brand-surface p-3 rounded-lg text-sm">
                        <div>
                           <p className="text-brand-muted font-semibold mb-1">Cost</p>
                           <p className="font-black text-brand-text">{formatCurrency(project.baseCost)}</p>
                        </div>
                        <div>
                           <p className="text-brand-muted font-semibold mb-1">Build Time</p>
                           <p className="font-bold text-brand-text flex items-center"><Clock size={14} className="mr-1" /> {project.buildTimeDays} days</p>
                        </div>
                        <div>
                           <p className="text-brand-muted font-semibold mb-1">Revenue</p>
                           <p className="font-bold text-brand-profit">+{formatCurrency(project.monthlyRevenue)}/mo</p>
                        </div>
                        <div>
                           <p className="text-brand-muted font-semibold mb-1">Maintenance</p>
                           <p className="font-bold text-brand-loss">-{formatCurrency(project.maintenanceCost)}/mo</p>
                        </div>
                     </div>

                     <button
                        onClick={() => buildCityBuilding(project.id, project.baseCost)}
                        disabled={!canAfford}
                        className="w-full py-2.5 rounded-lg font-bold text-sm transition-all bg-brand-text text-white hover:bg-black disabled:opacity-50 flex items-center justify-center"
                     >
                        <Pickaxe size={16} className="mr-2" />
                        {canAfford ? 'Start Construction' : 'Insufficient Capital'}
                     </button>
                  </div>
               );
            })}
         </div>
      </div>
    </div>
  );
}
