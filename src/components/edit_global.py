import sys
with open('GlobalView.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import_marker = "import { GLOBAL_CITIES } from '@/lib/globalData';"
import_injection = "import { Building, Users, Briefcase, TrendingUp } from 'lucide-react';\n"
if "Building, Users" not in text:
    text = text.replace(import_marker, import_marker + "\n" + import_injection)

# Add CITY_COORDS
coords_injection = """
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
"""
text = text.replace("export function GlobalView() {", coords_injection + "\nexport function GlobalView() {")

# Add state and helper
state_injection = """  const { player, unlockCity, business, founder, realEstate } = useGameStore();
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
           regionalRev += p.revenue;
        }
     });

     return {
        businesses: regionalBiz,
        startups: regionalStartups,
        properties: regionalProps,
        employees: regionalEmp,
        revenue: regionalRev
     };
  };"""

text = text.replace(
    "  const { player, unlockCity } = useGameStore();\n  const unlockedCities = player.unlockedCities || ['nyc'];",
    state_injection
)

# Replace Map placeholder
map_marker = """         {/* Map placeholder or visual element */}
         <div className="w-full h-48 bg-gradient-to-r from-brand-blue/90 to-brand-purple/90 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="text-white text-center relative z-10">
               <p className="text-sm font-bold uppercase tracking-[0.2em] mb-2 opacity-80">Empire Footprint</p>
               <h2 className="text-5xl font-black">{unlockedCities.length} / {GLOBAL_CITIES.length} Cities</h2>
            </div>
         </div>"""

map_injection = """         {/* Interactive Empire Map */}
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
         )}"""

text = text.replace(map_marker, map_injection)

with open('GlobalView.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated GlobalView.tsx!")
