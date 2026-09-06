'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { INITIAL_BONDS } from '@/lib/bondData';
import { INITIAL_IP } from '@/lib/alternativeData';
import { Play, Pause, RotateCcw, AlertTriangle, TrendingUp, TrendingDown, Newspaper, Trophy, DollarSign, Activity, Briefcase, Building, Landmark, AlertCircle, Clock, FileText, ChevronRight, Gem, Globe, PieChart as PieChartIcon, LineChart as LineChartIcon, Wallet, CreditCard, Rocket } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function Dashboard() {
  const { player, time, togglePause, setSpeed, resetGame, economy, news, competitors, business, realEstate, portfolio, market, cryptoMarket, commoditiesMarket, banking, activeOpportunities, buyOpportunity, founder, inbox } = useGameStore();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(value);
  };
  const formatCompact = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(value);
  };

  // --- Startups ---
  let founderStartups = 0, founderValuation = 0, founderIncome = 0, founderExpenses = 0;
  (founder?.playerStartups || []).forEach(su => {
      founderStartups++;
      founderValuation += su.valuation;
      founderIncome += su.revenue;
      const burn = (((su.developers * 5000) + (su.marketers * 4000))) * 0.75;
      founderExpenses += burn;
  });
  const founderProfit = founderIncome - founderExpenses;

  // --- Businesses & Angel ---
  let bizCount = 0, angelCount = 0, bizInvested = 0, bizValuation = 0, bizIncome = 0, bizExpenses = 0, bizProfit = 0;
  business.ownedBusinesses.forEach(biz => {
      bizCount++;
      const val = Math.max(10000, biz.lastMonthProfit * 12 * 3);
      bizValuation += val;
      // We don't track pure 'invested' natively for businesses easily, let's use a heuristic or just val / 2
      bizInvested += val * 0.4; 
      bizIncome += biz.lastMonthRevenue;
      bizExpenses += (biz.lastMonthRevenue - biz.lastMonthProfit);
      bizProfit += biz.lastMonthProfit;
  });
  (portfolio.startups || []).forEach(su => {
      if (su.status === 'Active') {
         angelCount++;
         bizInvested += su.investedAmount;
         bizValuation += su.exitValue || su.investedAmount; // expected exit
      }
  });

  // --- Markets ---
  let mktInvested = 0, mktValue = 0, mktDividends = 0;
  Object.entries(portfolio.stocks || {}).forEach(([sym, pos]) => {
      const q = typeof pos === 'number' ? pos : pos.quantity;
      const avg = typeof pos === 'object' ? pos.averageCost : 0;
      const p = market.prices[sym] || 0;
      mktInvested += q * avg;
      mktValue += q * p;
      // approximate dividend
      mktDividends += (q * p) * 0.001; // dummy monthly yield
  });
  Object.entries(portfolio.crypto || {}).forEach(([sym, pos]) => {
      const q = typeof pos === 'number' ? pos : pos.quantity;
      const avg = typeof pos === 'object' ? pos.averageCost : 0;
      const p = cryptoMarket?.prices?.[sym] || 0;
      mktInvested += q * avg;
      mktValue += q * p;
  });
  Object.entries(portfolio.commodities || {}).forEach(([sym, pos]) => {
      const q = typeof pos === 'number' ? pos : pos.quantity;
      const avg = typeof pos === 'object' ? pos.averageCost : 0;
      const p = commoditiesMarket?.prices?.[sym] || 0;
      mktInvested += q * avg;
      mktValue += q * p;
  });
  (portfolio.bonds || []).forEach(bond => {
      mktInvested += bond.principal;
      mktValue += bond.principal;
      const b = INITIAL_BONDS.find(x => x.id === bond.bondId); if (b) mktDividends += (bond.principal * b.yieldRate) / 12;
  });
  const mktProfit = mktValue - mktInvested;

  // --- Real Estate & Alts ---
  let reOwned = 0, reBought = 0, reValue = 0, reRent = 0;
  realEstate.ownedProperties.forEach(prop => {
      reOwned++;
      reBought += prop.price * 0.8; // Approx
      reValue += prop.price;
      reRent += prop.monthlyRent * prop.occupancyRate;
  });
  (realEstate.cityBuildings || []).forEach(b => {
      reOwned++;
      reBought += 500000;
      reValue += 600000;
  });
  (portfolio.ip || []).forEach(ip => {
      reOwned++;
      reBought += ip.purchasePrice;
      const mult = ip.currentRoyalty / (INITIAL_IP.find(i=>i.id===ip.ipId)?.monthlyRoyalty || 1);
      reValue += ip.purchasePrice * mult;
      reRent += ip.currentRoyalty;
  });
  (portfolio.collectibles || []).forEach(col => {
      reOwned++;
      reBought += col.purchasePrice;
      reValue += col.currentValue;
  });

  // --- Luxury ---
  let luxOwned = 0, luxBought = 0, luxValue = 0;
  (portfolio.luxury || []).forEach(lux => {
      luxOwned++;
      luxBought += lux.purchasePrice;
      luxValue += lux.currentValue;
  });
  const luxDepreciation = luxBought - luxValue;

  // --- Banking ---
  let activeLoans = 0, totalDebt = 0, totalEmi = 0;
  banking.loans.forEach(loan => {
      activeLoans++;
      totalDebt += loan.remainingBalance;
      totalEmi += loan.monthlyPayment;
  });

  // --- Top Level ---
  const totalAssets = player.cash + founderValuation + bizValuation + mktValue + reValue + luxValue;
  const totalIncome = player.passiveIncome + founderIncome + bizIncome + mktDividends + reRent;
  const totalExpenses = player.monthlyExpenses + founderExpenses + bizExpenses + totalEmi;
  const netMonthly = totalIncome - totalExpenses;
  const netWorth = totalAssets - totalDebt; // Use calculated or player.netWorth? player.netWorth is often stale until end of day, so we use calculated.

  return (
    <div className="p-8 overflow-y-auto h-full space-y-8 relative z-10 bg-brand-bg text-brand-text">
      
      {/* Header */}
      <header className="flex justify-between items-center bg-brand-card/80 backdrop-blur-md p-4 rounded-xl border border-black/10 shadow-sm">
        <div>
          <h2 className="text-2xl font-black">Command Center</h2>
          <div className="flex items-center space-x-3 mt-1">
             <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${economy.status === 'BOOM' ? 'bg-emerald-500/20 text-brand-profit' : economy.status === 'RECESSION' || economy.status === 'CRISIS' ? 'bg-rose-500/20 text-brand-loss' : 'bg-cyan-500/20 text-brand-blue'}`}>
                ECONOMY: {economy.status}
             </span>
             <span className="text-brand-muted text-sm font-medium">Interest Rate: {(economy.interestRateBase * 100).toFixed(1)}%</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 bg-brand-surface p-1.5 rounded-lg border border-black/5 shadow-inner">
          <button onClick={togglePause} className={`p-2 rounded hover:bg-brand-bg transition shadow-sm ${time.isPaused ? 'text-brand-gold bg-brand-card' : 'text-brand-profit'}`}>
            {time.isPaused ? <Play size={18} /> : <Pause size={18} />}
          </button>
          <div className="h-5 w-px bg-black/10 mx-1"></div>
          {[1, 2, 5, 10].map(speed => (
            <button key={speed} onClick={() => setSpeed(speed)} className={`px-3 py-1.5 text-xs rounded font-bold transition ${time.speed === speed ? 'bg-brand-blue text-white shadow' : 'text-brand-muted hover:text-brand-text hover:bg-brand-card'}`}>
              {speed}x
            </button>
          ))}
          <div className="h-5 w-px bg-black/10 mx-1"></div>
          <button onClick={() => { if(confirm('Are you sure you want to reset your entire empire? This cannot be undone.')) resetGame(); }} className="p-2 rounded hover:bg-brand-loss/10 text-brand-muted hover:text-brand-loss transition shadow-sm" title="Reset Game">
             <RotateCcw size={16} />
          </button>
        </div>
      </header>

      {/* ROW 1: Wealth Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard title="Cash" value={formatCompact(player.cash)} icon={<Wallet size={16}/>} />
        <StatCard title="Total Assets" value={formatCompact(totalAssets)} icon={<Building size={16}/>} />
        <StatCard title="Net Worth" value={formatCompact(netWorth)} highlight="emerald" icon={<Trophy size={16}/>} />
        <StatCard title="Income" value={formatCompact(totalIncome)} isPositive={true} icon={<TrendingUp size={16}/>} />
        <StatCard title="Expenses" value={formatCompact(totalExpenses)} isPositive={false} icon={<TrendingDown size={16}/>} />
        <StatCard title="Debt" value={formatCompact(totalDebt)} highlight={totalDebt > 0 ? "rose" : ""} icon={<CreditCard size={16}/>} isDebt={totalDebt > 0} />
      </div>

      {/* ROW 2: Overall Cashflow & Startups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* OVERALL */}
         <DetailedCard title="Overall Financials" icon={<Activity size={16}/>} data={[
            { label: 'Total Income (All Assets)', value: formatCurrency(totalIncome), highlight: true },
            { label: 'Total Expenses (All Ops & Debt)', value: formatCurrency(totalExpenses), isDebt: true },
            { label: 'Net Overall Profit', value: formatCurrency(netMonthly), highlight: netMonthly >= 0, isDebt: netMonthly < 0 }
         ]} />
         
         {/* STARTUPS */}
         <DetailedCard title="Founder Startups" icon={<Rocket size={16}/>} data={[
            { label: 'Startups Founded', value: founderStartups.toString() },
            { label: 'Combined Valuation', value: formatCurrency(founderValuation) },
            { label: 'Total Income', value: formatCurrency(founderIncome), highlight: true },
            { label: 'Total Expenses (Burn)', value: formatCurrency(founderExpenses), isDebt: true },
            { label: 'Net Profit', value: formatCurrency(founderProfit), highlight: founderProfit >= 0, isDebt: founderProfit < 0 }
         ]} />
      </div>

      {/* ROW 3: Businesses & Markets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* BUSINESSES & ANGEL */}
         <DetailedCard title="Businesses & Angel Buyouts" icon={<Briefcase size={16}/>} data={[
            { label: 'Owned Businesses (M&A)', value: bizCount.toString() },
            { label: 'Angel Investments Active', value: angelCount.toString() },
            { label: 'Money Invested', value: formatCurrency(bizInvested) },
            { label: 'Combined Valuation', value: formatCurrency(bizValuation) },
            { label: 'Total Income', value: formatCurrency(bizIncome), highlight: true },
            { label: 'Total Expenses', value: formatCurrency(bizExpenses), isDebt: true },
            { label: 'Net Profit', value: formatCurrency(bizProfit), highlight: bizProfit >= 0, isDebt: bizProfit < 0 }
         ]} />

         {/* MARKETS */}
         <DetailedCard title="Markets (Stocks, Crypto, Commodities, Bonds)" icon={<TrendingUp size={16}/>} data={[
            { label: 'Money Put (Invested)', value: formatCurrency(mktInvested) },
            { label: 'Current Value', value: formatCurrency(mktValue) },
            { label: 'Profit / Loss', value: formatCurrency(mktProfit), highlight: mktProfit >= 0, isDebt: mktProfit < 0 },
            { label: 'Dividends & Yield (Monthly)', value: formatCurrency(mktDividends), highlight: true }
         ]} />
      </div>

      {/* ROW 4: Real Estate & Luxury */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* REAL ESTATE & CITY & IP */}
         <DetailedCard title="Real Estate, City & Alts" icon={<Building size={16}/>} data={[
            { label: 'Buildings & Assets Owned', value: reOwned.toString() },
            { label: 'Buy Value (Est)', value: formatCurrency(reBought) },
            { label: 'Market Value', value: formatCurrency(reValue) },
            { label: 'Monthly Rent / Royalties', value: formatCurrency(reRent), highlight: true }
         ]} />

         {/* LUXURY */}
         <DetailedCard title="Luxury Assets" icon={<Gem size={16}/>} data={[
            { label: 'Luxury Items Owned', value: luxOwned.toString() },
            { label: 'Value Bought', value: formatCurrency(luxBought) },
            { label: 'Current Value', value: formatCurrency(luxValue) },
            { label: 'Total Depreciation', value: formatCurrency(luxDepreciation), isDebt: luxDepreciation > 0 }
         ]} />
      </div>

      {/* ROW 5: Banking & Extras */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* BANKING */}
         <DetailedCard title="Banking & Debt" icon={<Landmark size={16}/>} data={[
            { label: 'Active Loans', value: activeLoans.toString() },
            { label: 'Total Debt Amount', value: formatCurrency(totalDebt), isDebt: true },
            { label: 'EMI (Monthly Payment)', value: formatCurrency(totalEmi), isDebt: true },
            { label: 'To Be Paid (Remaining)', value: formatCurrency(totalDebt), isDebt: true }
         ]} />
         
         {/* NEWS */}
         <div className="bg-brand-card border border-black/10 rounded-xl p-5 shadow-sm h-72 flex flex-col">
            <h3 className="text-sm font-bold text-brand-muted uppercase tracking-wider mb-4 border-b border-black/5 pb-2 flex items-center"><Newspaper size={16} className="mr-2"/> Global News</h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
               {news.map((n, idx) => (
                  <div key={`news-${idx}`} className="text-[10px] bg-brand-surface p-2 rounded-lg border border-black/5">
                     <span className="font-bold text-brand-muted block mb-0.5">{n.date}</span>
                     <span className={`font-medium leading-relaxed ${n.type === 'economy' ? 'text-brand-gold' : n.type === 'negative' ? 'text-brand-loss' : n.type === 'positive' ? 'text-brand-profit' : 'text-brand-text'}`}>{n.headline}</span>
                  </div>
               ))}
            </div>
         </div>

         {/* INBOX */}
         <div className="bg-brand-card border border-black/10 rounded-xl p-5 shadow-sm h-72 flex flex-col">
            <h3 className="text-sm font-bold text-brand-muted uppercase tracking-wider mb-4 border-b border-black/5 pb-2 flex items-center"><FileText size={16} className="mr-2"/> Direct Inbox</h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
               {(inbox || []).length === 0 ? <div className="text-xs text-brand-muted text-center pt-8">No messages.</div> : 
               (inbox || []).map(m => (
                  <div key={m.id} className="text-[10px] bg-brand-surface p-2 rounded-lg border border-black/5">
                     <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-brand-blue">{m.sender}</span>
                        <span className="text-[9px] text-brand-muted">{m.date}</span>
                     </div>
                     <div className="font-bold text-brand-text mb-0.5 truncate">{m.subject}</div>
                     <div className="text-brand-muted line-clamp-2">{m.body}</div>
                  </div>
               ))}
            </div>
         </div>
      </div>

    </div>
  );
}

function StatCard({ title, value, isPositive, highlight, icon, isDebt }: { title: string; value: string; isPositive?: boolean; highlight?: string; icon?: React.ReactNode; isDebt?: boolean }) {
  return (
    <div className={`bg-brand-card border ${highlight === 'emerald' ? 'border-brand-profit/30 shadow-[0_2px_15px_-3px_rgba(16,185,129,0.2)]' : highlight === 'rose' ? 'border-brand-loss/30' : 'border-black/10'} rounded-xl p-4 flex items-center justify-between shadow-sm`}>
      <div>
         <h4 className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">{title}</h4>
         <p className={`text-lg font-black ${isPositive === true ? 'text-brand-profit' : isPositive === false ? 'text-brand-loss' : isDebt ? 'text-brand-loss' : 'text-brand-text'}`}>
            {value}
         </p>
      </div>
      {icon && <div className={`p-2 rounded-lg ${highlight === 'emerald' ? 'bg-brand-profit/10 text-brand-profit' : highlight === 'rose' ? 'bg-brand-loss/10 text-brand-loss' : 'bg-brand-surface text-brand-blue'}`}>{icon}</div>}
    </div>
  );
}

function DetailedCard({ title, icon, data }: { title: string, icon: React.ReactNode, data: {label:string, value:string, highlight?:boolean, isDebt?:boolean}[] }) {
   return (
      <div className="bg-brand-card border border-black/10 rounded-xl p-5 shadow-sm">
         <h3 className="text-sm font-bold text-brand-muted uppercase tracking-wider mb-4 border-b border-black/5 pb-2 flex items-center">
            <span className="text-brand-blue mr-2 opacity-80">{icon}</span> {title}
         </h3>
         <div className="space-y-3">
            {data.map((d, i) => (
               <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-brand-muted font-medium">{d.label}</span>
                  <span className={`font-bold ${d.highlight ? 'text-brand-profit' : d.isDebt ? 'text-brand-loss' : 'text-brand-text'}`}>{d.value}</span>
               </div>
            ))}
         </div>
      </div>
   );
}
