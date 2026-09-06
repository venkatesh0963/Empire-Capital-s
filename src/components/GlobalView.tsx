import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { formatCurrency } from '@/lib/utils';
import { Globe, MapPin, CheckCircle, Lock, TrendingDown, Percent, Info } from 'lucide-react';
import { GLOBAL_CITIES } from '@/lib/globalData';
import { Building, Users, Briefcase, TrendingUp } from 'lucide-react';



const CITY_COORDS: Record<string, { x: number, y: number }> = {
  'nyc': { x: 25, y: 35 },
  'london': { x: 45, y: 30 },
  'tokyo': { x: 85, y: 35 },
  'singapore': { x: 75, y: 65 },
  'dubai': { x: 60, y: 45 },
  'mumbai': { x: 68, y: 50 },
  'paris': { x: 48, y: 32 },
  'berlin': { x: 50, y: 30 },
  'sydney': { x: 90, y: 80 },
  'toronto': { x: 25, y: 30 }
};

export function GlobalView() {
  const { player, unlockCity, business, founder, realEstate } = useGameStore();
  const unlockedCities = player.unlockedCities || ['nyc'];
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const getRegionalMetrics = (cityId: string) => {
     const cityIndex = unlockedCities.indexOf(cityId);
     if (cityIndex === -1) return null;
     
     let regionalBiz = 0;
     let regionalRev = 0;
     let regionalEmp = 0;
     business.ownedBusinesses.forEach((b, i) => {
        if (i % unlockedCities.length === cityIndex) {
           regionalBiz++;
           regionalRev += b.lastMonthRevenue;
           regionalEmp += b.employees;
        }
     });

     let regionalStartups = 0;
     (founder?.playerStartups || []).forEach((s, i) => {
        if (i % unlockedCities.length === cityIndex) {
           regionalStartups++;
           regionalRev += s.revenue;
           regionalEmp += (s.developers + s.marketers);
        }
     });

     let regionalProps = 0;
     realEstate.ownedProperties.forEach((p, i) => {
        if (i % unlockedCities.length === cityIndex) {
           regionalProps++;
           regionalRev += p.monthlyRent;
        }
     });

     return {
        businesses: regionalBiz,
        startups: regionalStartups,
        properties: regionalProps,
        employees: regionalEmp,
        revenue: regionalRev
     };
  };

  const handleUnlock = (cityId: string, cost: number) => {
     unlockCity(cityId, cost);
  };

  // Calculate current global blends
  let totalTax = 0;
  let totalSalary = 0;
  unlockedCities.forEach(cid => {
     const city = GLOBAL_CITIES.find(c => c.id === cid) || GLOBAL_CITIES[0];
     totalTax += city.taxRate;
     totalSalary += city.salaryMultiplier;
  });
  const avgTaxRate = totalTax / unlockedCities.length;
  const avgSalaryMult = totalSalary / unlockedCities.length;

  return (
    <div className="p-8 h-full overflow-y-auto bg-brand-bg">
      <div className="max-w-6xl mx-auto space-y-8">
         
         <div className="flex justify-between items-end">
            <div>
               <h1 className="text-4xl font-black text-brand-text mb-2 tracking-tight flex items-center">
                  <Globe className="mr-3 text-brand-blue" size={36} /> Global Expansion
               </h1>
               <p className="text-lg text-brand-muted max-w-3xl">Unlock international markets to optimize your global operations. Blending low-tax havens with cheap labor markets will drastically increase your overall margins.</p>
            </div>
         </div>

         {/* Stats Panel */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-brand-card border border-black/10 rounded-xl p-6 flex justify-between items-center shadow-sm">
               <div>
                  <p className="text-sm font-bold text-brand-muted uppercase tracking-wider mb-1">Effective Corp Tax Rate</p>
                  <p className="text-3xl font-black text-brand-loss">{(avgTaxRate * 100).toFixed(1)}%</p>
               </div>
               <div className="p-4 bg-brand-loss/10 text-brand-loss rounded-full"><Percent size={24} /></div>
            </div>
            <div className="bg-brand-card border border-black/10 rounded-xl p-6 flex justify-between items-center shadow-sm">
               <div>
                  <p className="text-sm font-bold text-brand-muted uppercase tracking-wider mb-1">Global Salary Cost</p>
                  <p className="text-3xl font-black text-brand-blue">x{avgSalaryMult.toFixed(2)}</p>
               </div>
               <div className="p-4 bg-brand-blue/10 text-brand-blue rounded-full"><TrendingDown size={24} /></div>
            </div>
         </div>

         {/* Interactive Empire Map */}
         <div className="w-full h-96 bg-brand-bg border border-black/10 rounded-2xl relative overflow-hidden shadow-sm flex items-center justify-center">
            {/* Minimalist World Map Background (SVG paths could go here, using a dotted grid for now) */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
            
            <svg className="absolute inset-0 w-full h-full z-10" xmlns="http://www.w3.org/2000/svg">
               {unlockedCities.map((cid, idx) => {
                  if (idx === 0) return null;
                  const prev = CITY_COORDS[unlockedCities[idx-1]];
                  const curr = CITY_COORDS[cid];
                  if (!prev || !curr) return null;
                  return (
                     <line 
                        key={`line-${cid}`}
                        x1={`${prev.x}%`} y1={`${prev.y}%`}
                        x2={`${curr.x}%`} y2={`${curr.y}%`}
                        stroke="#3b82f6" strokeWidth="2" strokeDasharray="4"
                        className="opacity-60 animate-pulse"
                     />
                  );
               })}
            </svg>

            {GLOBAL_CITIES.map(city => {
               const isUnlocked = unlockedCities.includes(city.id);
               const coords = CITY_COORDS[city.id];
               if (!coords) return null;
               
               return (
                  <div 
                     key={`node-${city.id}`} 
                     className={`absolute z-20 flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 cursor-pointer ${isUnlocked ? 'opacity-100' : 'opacity-40 grayscale'}`}
                     style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                     onClick={() => isUnlocked && setSelectedCity(city.id)}
                  >
                     <div className={`w-4 h-4 rounded-full mb-1 border-2 ${isUnlocked ? 'bg-brand-blue border-brand-bg shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'bg-brand-muted border-brand-bg'}`}></div>
                     <span className={`text-[10px] font-bold ${isUnlocked ? 'text-brand-text' : 'text-brand-muted'}`}>{city.name}</span>
                  </div>
               )
            })}
         </div>

         {/* Regional Detail Modal */}
         {selectedCity && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-bg/80 backdrop-blur-sm p-4 animate-in fade-in">
               <div className="bg-brand-card border border-black/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
                  <div className="absolute top-4 right-4">
                     <button onClick={() => setSelectedCity(null)} className="text-brand-muted hover:text-brand-text font-bold p-2 bg-brand-surface rounded-full">✕</button>
                  </div>
                  
                  {(() => {
                     const city = GLOBAL_CITIES.find(c => c.id === selectedCity);
                     const metrics = getRegionalMetrics(selectedCity);
                     if (!city || !metrics) return null;
                     return (
                        <div className="p-6">
                           <div className="text-4xl mb-2">{city.flag}</div>
                           <h2 className="text-2xl font-black text-brand-text mb-1">{city.name} Regional HQ</h2>
                           <p className="text-brand-muted text-sm mb-6">Operational Footprint & Assets</p>
                           
                           <div className="grid grid-cols-2 gap-4">
                              <div className="bg-brand-surface border border-black/5 rounded-xl p-4">
                                 <div className="flex items-center text-brand-muted mb-1 text-xs font-bold uppercase tracking-wider"><TrendingUp size={14} className="mr-2"/> Revenue</div>
                                 <div className="font-mono font-bold text-lg text-brand-profit">{formatCurrency(metrics.revenue)}<span className="text-xs text-brand-muted font-sans">/mo</span></div>
                              </div>
                              <div className="bg-brand-surface border border-black/5 rounded-xl p-4">
                                 <div className="flex items-center text-brand-muted mb-1 text-xs font-bold uppercase tracking-wider"><Users size={14} className="mr-2"/> Employees</div>
                                 <div className="font-mono font-bold text-lg text-brand-text">{metrics.employees.toLocaleString()}</div>
                              </div>
                              <div className="bg-brand-surface border border-black/5 rounded-xl p-4">
                                 <div className="flex items-center text-brand-muted mb-1 text-xs font-bold uppercase tracking-wider"><Briefcase size={14} className="mr-2"/> Businesses</div>
                                 <div className="font-mono font-bold text-lg text-brand-text">{metrics.businesses + metrics.startups}</div>
                              </div>
                              <div className="bg-brand-surface border border-black/5 rounded-xl p-4">
                                 <div className="flex items-center text-brand-muted mb-1 text-xs font-bold uppercase tracking-wider"><Building size={14} className="mr-2"/> Properties</div>
                                 <div className="font-mono font-bold text-lg text-brand-text">{metrics.properties}</div>
                              </div>
                           </div>
                        </div>
                     )
                  })()}
               </div>
            </div>
         )}

         {/* Cities Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GLOBAL_CITIES.map(city => {
               const isUnlocked = unlockedCities.includes(city.id);
               return (
                  <div key={city.id} className={`bg-brand-card border rounded-2xl p-6 relative overflow-hidden transition-all ${isUnlocked ? 'border-brand-blue/30 shadow-lg' : 'border-black/10 shadow-sm opacity-80'}`}>
                     
                     {isUnlocked && (
                        <div className="absolute top-0 right-0 bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center">
                           <CheckCircle size={12} className="mr-1" /> OPERATIONAL
                        </div>
                     )}

                     <div className="text-5xl mb-3">{city.flag}</div>
                     <h3 className="text-2xl font-black text-brand-text mb-1">{city.name}</h3>
                     <p className="text-sm font-medium text-brand-muted mb-4">{city.country}</p>

                     <p className="text-sm text-brand-text/80 mb-6 min-h-[40px]">{city.description}</p>

                     <div className="space-y-3 mb-6 bg-brand-surface p-4 rounded-xl border border-black/5">
                        <div className="flex justify-between items-center text-sm">
                           <span className="text-brand-muted font-semibold">Corporate Tax</span>
                           <span className="font-black text-brand-loss">{(city.taxRate * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                           <span className="text-brand-muted font-semibold">Salary Cost</span>
                           <span className="font-black text-brand-blue">x{city.salaryMultiplier.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm pt-2 border-t border-black/10">
                           <span className="text-brand-muted font-semibold">Economic Risk</span>
                           <span className={`font-bold ${city.economicRisk === 'Low' ? 'text-brand-profit' : city.economicRisk === 'Medium' ? 'text-brand-gold' : 'text-brand-loss'}`}>{city.economicRisk}</span>
                        </div>
                     </div>

                     {!isUnlocked && (
                        <button 
                           onClick={() => handleUnlock(city.id, city.unlockCost)}
                           disabled={player.cash < city.unlockCost}
                           className="w-full py-3 bg-brand-text text-white font-bold rounded-lg hover:bg-black disabled:opacity-50 transition-all flex items-center justify-center"
                        >
                           <Lock size={16} className="mr-2" /> Expand: {formatCurrency(city.unlockCost)}
                        </button>
                     )}
                     
                     {isUnlocked && (
                        <div className="w-full py-3 bg-brand-blue/10 text-brand-blue font-bold rounded-lg text-center flex items-center justify-center border border-brand-blue/20">
                           <MapPin size={16} className="mr-2" /> HQ Established
                        </div>
                     )}

                  </div>
               );
            })}
         </div>

      </div>
    </div>
  );
}
