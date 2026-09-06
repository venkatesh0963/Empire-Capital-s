import sys

with open('gameStore.ts', 'r', encoding='utf-8') as f:
    text = f.read()

loop_injection = """
        // --- FOUNDER STARTUPS (DAILY) ---
        let updatedPlayerStartups = [...(state.founder?.playerStartups || [])];
        let startupNews = [];
        
        updatedPlayerStartups = updatedPlayerStartups.map(startup => {
           let s = { ...startup, daysActive: startup.daysActive + 1 };
           const ind = STARTUP_INDUSTRIES.find(i => i.id === s.industry) || STARTUP_INDUSTRIES[0];
           
           // Daily Burn Rate
           const dailyBurn = ((s.developers * ind.devSalary) + (s.marketers * ind.marketerSalary)) / 30;
           s.cash -= dailyBurn;
           
           // If bankrupt
           if (s.cash <= 0) {
              s.cash = 0;
              s.stage = 'IDEA'; // Effectively dead, but we keep it or bankrupt it
           }
           
           if (s.cash > 0) {
               // Stage Transitions
               if (s.stage === 'IDEA' && s.daysActive > 7) s.stage = 'DEVELOPMENT';
               
               // Dev Progress
               if (['DEVELOPMENT', 'BETA', 'GROWTH', 'MATURE'].includes(s.stage)) {
                   const devPower = s.developers * ind.devDifficulty * 0.1; // daily quality increase
                   s.productQuality = Math.min(100, s.productQuality + devPower);
               }
               
               // Marketing & Users
               if (['BETA', 'GROWTH', 'MATURE'].includes(s.stage)) {
                   const marketingPower = s.marketers * 0.5;
                   s.brandAwareness = Math.min(100, s.brandAwareness + marketingPower);
                   
                   const organicGrowth = (s.productQuality / 100) * ind.viralFactor;
                   const paidGrowth = (s.brandAwareness / 100) * 2;
                   
                   // New users per day
                   const newUsers = Math.floor(Math.max(1, s.users * 0.01) * (organicGrowth + paidGrowth));
                   s.users += newUsers;
                   
                   // Revenue (daily approx)
                   const dailyArpu = ind.arpu / 30;
                   s.revenue = s.users * dailyArpu * 30; // monthly projected
                   s.cash += s.users * dailyArpu; // daily cash influx
               }
               
               // Valuation
               const revenueMultiple = s.industry === 'ai' ? 20 : (s.industry === 'saas' ? 10 : 5);
               const userValue = s.users * (ind.arpu * 12) * 2;
               s.valuation = Math.max(s.cash, (s.revenue * 12 * revenueMultiple) + userValue);
           }
           
           return s;
        });
        
        // Remove bankrupt startups
        const deadStartups = updatedPlayerStartups.filter(s => s.cash <= 0 && s.daysActive > 14);
        if (deadStartups.length > 0) {
            deadStartups.forEach(ds => {
                news.unshift({ id: `n_bankrupt_${Date.now()}_${ds.id}`, date: `Y${year} M${month}`, headline: `⚠️ Startup Failed: ${ds.name} ran out of cash and shut down.`, type: 'negative' });
            });
            updatedPlayerStartups = updatedPlayerStartups.filter(s => s.cash > 0 || s.daysActive <= 14);
        }
"""

# Inject before global expansion calcs
text = text.replace(
    "// --- GLOBAL EXPANSION CALCS ---",
    loop_injection + "\n        // --- GLOBAL EXPANSION CALCS ---"
)

text = text.replace(
    "founder: { playerStartups: (state.founder?.playerStartups || []) },",
    "founder: { playerStartups: updatedPlayerStartups },"
)

with open('gameStore.ts', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated gameStore loop!")
