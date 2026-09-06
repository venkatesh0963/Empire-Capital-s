import sys

dashboard_code = """'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { INITIAL_BONDS } from '@/lib/bondData';
import { INITIAL_IP } from '@/lib/alternativeData';
import { Play, Pause, RotateCcw, AlertTriangle, TrendingUp, TrendingDown, Newspaper, Trophy, DollarSign, Activity, Briefcase, Building, Landmark, AlertCircle, Clock, FileText, ChevronRight, Gem, Globe, PieChart as PieChartIcon, LineChart as LineChartIcon, Wallet, CreditCard } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function Dashboard() {
  const { player, time, togglePause, setSpeed, resetGame, economy, news, competitors, business, realEstate, portfolio, market, cryptoMarket, commoditiesMarket, banking, activeOpportunities, buyOpportunity, founder, inbox } = useGameStore();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };
  const formatCompact = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(value);
  };

  const netMonthly = player.passiveIncome - player.monthlyExpenses;

  // --- Calculations ---
  let bizValue = 0, bizProfit = 0;
  business.ownedBusinesses.forEach(biz => {
    bizValue += Math.max(10000, biz.lastMonthProfit * 12 * 3);
    bizProfit += biz.lastMonthProfit;
  });

  let reValue = 0, reIncome = 0;
  realEstate.ownedProperties.forEach(prop => {
    reValue += prop.price;
    reIncome += prop.monthlyRent * prop.occupancyRate;
  });

  let portfolioValue = 0;
  let stockValue = 0, cryptoValue = 0, commsValue = 0;
  Object.entries(portfolio.stocks || {}).forEach(([sym, pos]) => {
      const v = (market.prices[sym] || 0) * (typeof pos === 'number' ? pos : pos.quantity);
      portfolioValue += v; stockValue += v;
  });
  Object.entries(portfolio.crypto || {}).forEach(([sym, pos]) => {
      const v = (cryptoMarket?.prices?.[sym] || 0) * (typeof pos === 'number' ? pos : pos.quantity);
      portfolioValue += v; cryptoValue += v;
  });
  Object.entries(portfolio.commodities || {}).forEach(([sym, pos]) => {
      const v = (commoditiesMarket?.prices?.[sym] || 0) * (typeof pos === 'number' ? pos : pos.quantity);
      portfolioValue += v; commsValue += v;
  });
  let bondValue = 0;
  (portfolio.bonds || []).forEach(bond => { bondValue += bond.principal; });
  portfolioValue += bondValue;

  let startupValue = 0;
  (portfolio.startups || []).forEach(su => {
      if (su.status === 'Active') startupValue += su.investedAmount;
  });
  let playerStartupValue = 0;
  (founder?.playerStartups || []).forEach(su => {
      playerStartupValue += su.valuation;
  });

  let luxuryValue = 0;
  (portfolio.luxury || []).forEach(lux => { luxuryValue += lux.currentValue; });

  let ipValue = 0;
  (portfolio.ip || []).forEach(ip => { ipValue += ip.purchasePrice * (ip.currentRoyalty / (INITIAL_IP.find(i=>i.id===ip.ipId)?.monthlyRoyalty || 1)); });
  
  let colValue = 0;
  (portfolio.collectibles || []).forEach(col => { colValue += col.currentValue; });

  let totalDebt = 0, debtPayment = 0;
  banking.loans.forEach(loan => {
      totalDebt += loan.remainingBalance;
      debtPayment += loan.monthlyPayment;
  });

  const totalAssets = player.cash + bizValue + startupValue + playerStartupValue + reValue + portfolioValue + luxuryValue + ipValue + colValue;

  // Chart Data
  const assetData = [
    { name: 'Business', value: bizValue + playerStartupValue + startupValue, color: '#3b82f6' },
    { name: 'Real Estate', value: reValue, color: '#eab308' },
    { name: 'Markets', value: portfolioValue, color: '#10b981' },
    { name: 'Alternatives', value: luxuryValue + ipValue + colValue, color: '#a855f7' },
    { name: 'Cash', value: player.cash, color: '#94a3b8' },
  ].filter(d => d.value > 0);
  if (assetData.length === 0) assetData.push({ name: 'Cash', value: player.cash || 1, color: '#94a3b8' });

  // Mock Net Worth History (trend line ending at current NW)
  const nwHistory = Array.from({ length: 12 }).map((_, i) => ({
    month: `M${i+1}`,
    value: Math.max(100000, player.netWorth * (0.5 + (i * 0.045) + (Math.random() * 0.05)))
  }));
  nwHistory[11].value = player.netWorth;

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
        </div>
      </header>

      {/* ROW 1: Wealth Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard title="Cash" value={formatCompact(player.cash)} icon={<Wallet size={16}/>} />
        <StatCard title="Total Assets" value={formatCompact(totalAssets)} icon={<Building size={16}/>} />
        <StatCard title="Total Debt" value={formatCompact(totalDebt)} highlight={totalDebt > 0 ? "rose" : ""} icon={<CreditCard size={16}/>} isDebt={totalDebt > 0} />
        <StatCard title="Net Worth" value={formatCompact(player.netWorth)} highlight="emerald" icon={<Trophy size={16}/>} />
        <StatCard title="Passive Income" value={formatCompact(player.passiveIncome)} icon={<TrendingUp size={16}/>} />
        <StatCard title="Monthly Profit" value={formatCompact(netMonthly)} isPositive={netMonthly >= 0} icon={<Activity size={16}/>} />
      </div>

      {/* ROW 2: Charts & Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-brand-card border border-black/10 rounded-xl p-5 shadow-sm">
           <h3 className="text-sm font-bold text-brand-muted uppercase tracking-wider mb-4 flex items-center"><LineChartIcon size={16} className="mr-2"/> Net Worth Trajectory</h3>
           <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={nwHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#00000010" vertical={false} />
                    <XAxis dataKey="month" stroke="#00000040" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#00000040" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => '$' + (val / 1000000).toFixed(1) + 'M'} />
                    <RechartsTooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                 </LineChart>
              </ResponsiveContainer>
           </div>
        </div>
        <div className="bg-brand-card border border-black/10 rounded-xl p-5 shadow-sm flex flex-col">
           <h3 className="text-sm font-bold text-brand-muted uppercase tracking-wider mb-4 flex items-center"><PieChartIcon size={16} className="mr-2"/> Asset Allocation</h3>
           <div className="flex-1 min-h-[200px] relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie data={assetData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                       {assetData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-xs font-bold text-brand-muted">Total</span>
                 <span className="text-lg font-black text-brand-text">{formatCompact(totalAssets)}</span>
              </div>
           </div>
           <div className="mt-4 space-y-2">
              {assetData.map(d => (
                 <div key={d.name} className="flex justify-between items-center text-xs">
                    <div className="flex items-center"><div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: d.color}}></div><span className="font-medium text-brand-text">{d.name}</span></div>
                    <span className="font-bold">{((d.value / totalAssets) * 100).toFixed(1)}%</span>
                 </div>
              ))}
           </div>
        </div>
      </div>

      {/* ROW 3: Income & Cash Flow + Portfolio Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-brand-card border border-black/10 rounded-xl p-6 shadow-sm">
           <h3 className="text-sm font-bold text-brand-muted uppercase tracking-wider mb-4 border-b border-black/5 pb-2">Cash Flow Breakdown</h3>
           <div className="space-y-4">
              <div className="flex justify-between items-center">
                 <span className="text-sm font-medium">Business Revenue</span>
                 <span className="font-bold text-brand-profit">+{formatCurrency(bizProfit + (founder?.playerStartups || []).reduce((a,b)=>a+b.revenue,0))}</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-sm font-medium">Real Estate Rent</span>
                 <span className="font-bold text-brand-profit">+{formatCurrency(reIncome)}</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-sm font-medium">Market Dividends / Yield</span>
                 <span className="font-bold text-brand-profit">+{formatCurrency(player.passiveIncome - bizProfit - reIncome)}</span>
              </div>
              <div className="w-full h-px bg-black/10 my-2"></div>
              <div className="flex justify-between items-center">
                 <span className="text-sm font-medium">Operating Expenses</span>
                 <span className="font-bold text-brand-loss">-{formatCurrency(player.monthlyExpenses - debtPayment)}</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-sm font-medium">Debt Servicing</span>
                 <span className="font-bold text-brand-loss">-{formatCurrency(debtPayment)}</span>
              </div>
              <div className="w-full h-px bg-black/10 my-2"></div>
              <div className="flex justify-between items-center text-lg">
                 <span className="font-black">Net Monthly Flow</span>
                 <span className={`font-black ${netMonthly >= 0 ? 'text-brand-profit' : 'text-brand-loss'}`}>{netMonthly >= 0 ? '+' : ''}{formatCurrency(netMonthly)}</span>
              </div>
           </div>
        </div>
        
        <div className="bg-brand-card border border-black/10 rounded-xl p-6 shadow-sm">
           <h3 className="text-sm font-bold text-brand-muted uppercase tracking-wider mb-4 border-b border-black/5 pb-2">Portfolio Performance</h3>
           <div className="space-y-4 overflow-y-auto max-h-64 pr-2">
              {Object.keys(portfolio.stocks || {}).length === 0 && Object.keys(portfolio.crypto || {}).length === 0 ? (
                 <div className="text-brand-muted text-sm text-center py-8">No active market positions.</div>
              ) : (
                 <>
                    {Object.entries(portfolio.stocks || {}).slice(0,3).map(([sym, pos]) => {
                       const p = market.prices[sym] || 0;
                       const q = typeof pos === 'number' ? pos : pos.quantity;
                       const avg = typeof pos === 'object' ? pos.averageCost : p;
                       const val = p * q;
                       const cost = avg * q;
                       const pnl = val - cost;
                       return <PerformanceRow key={sym} name={sym} type="Stock" val={val} pnl={pnl} />
                    })}
                    {Object.entries(portfolio.crypto || {}).slice(0,3).map(([sym, pos]) => {
                       const p = cryptoMarket?.prices?.[sym] || 0;
                       const q = typeof pos === 'number' ? pos : pos.quantity;
                       const avg = typeof pos === 'object' ? pos.averageCost : p;
                       const val = p * q;
                       const cost = avg * q;
                       const pnl = val - cost;
                       return <PerformanceRow key={sym} name={sym} type="Crypto" val={val} pnl={pnl} />
                    })}
                 </>
              )}
           </div>
        </div>
      </div>

      {/* ROW 4: Operations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <DetailedCard title="Business Empire" icon={<Briefcase size={16}/>} data={[
            { label: 'Operational Companies', value: business.ownedBusinesses.length.toString() },
            { label: 'Startups Founded', value: (founder?.playerStartups || []).length.toString() },
            { label: 'Total Valuation', value: formatCompact(bizValue + playerStartupValue) },
            { label: 'Combined Profit', value: formatCompact(bizProfit), highlight: true }
         ]} />
         <DetailedCard title="Real Estate" icon={<Building size={16}/>} data={[
            { label: 'Properties Owned', value: realEstate.ownedProperties.length.toString() },
            { label: 'Total Value', value: formatCompact(reValue) },
            { label: 'Monthly Rent', value: formatCompact(reIncome), highlight: true },
            { label: 'Avg Occupancy', value: realEstate.ownedProperties.length > 0 ? (realEstate.ownedProperties.reduce((a,b)=>a+b.occupancyRate,0)/realEstate.ownedProperties.length * 100).toFixed(0) + '%' : '0%' }
         ]} />
         <DetailedCard title="Alternative Investments" icon={<Gem size={16}/>} data={[
            { label: 'Luxury Assets', value: (portfolio.luxury || []).length.toString() },
            { label: 'Intellectual Property', value: (portfolio.ip || []).length.toString() },
            { label: 'Collectibles', value: (portfolio.collectibles || []).length.toString() },
            { label: 'Total Value', value: formatCompact(luxuryValue + ipValue + colValue) }
         ]} />
      </div>

      {/* ROW 5: Markets & Debt */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <DetailedCard title="Market Snapshot" icon={<TrendingUp size={16}/>} data={[
            { label: 'Stock Portfolio', value: formatCompact(stockValue) },
            { label: 'Commodities', value: formatCompact(commsValue) },
            { label: 'Total Market Assets', value: formatCompact(stockValue + commsValue) }
         ]} />
         <DetailedCard title="Crypto Assets" icon={<Activity size={16}/>} data={[
            { label: 'Holdings Value', value: formatCompact(cryptoValue) },
            { label: 'Active Coins', value: Object.keys(portfolio.crypto || {}).length.toString() }
         ]} />
         <DetailedCard title="Banking & Debt" icon={<Landmark size={16}/>} data={[
            { label: 'Active Loans', value: banking.loans.length.toString() },
            { label: 'Total Debt', value: formatCompact(totalDebt), isDebt: true },
            { label: 'Monthly Service', value: formatCompact(debtPayment), isDebt: true },
            { label: 'Credit Score', value: player.creditScore.toString() }
         ]} />
      </div>

      {/* ROW 6: News, Inbox, Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
         {/* News */}
         <div className="bg-brand-card border border-black/10 rounded-xl p-5 shadow-sm h-80 flex flex-col">
            <h3 className="text-sm font-bold text-brand-muted uppercase tracking-wider mb-4 border-b border-black/5 pb-2 flex items-center"><Newspaper size={16} className="mr-2"/> Global News</h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
               {news.map((n, idx) => (
                  <div key={`news-${idx}`} className="text-xs bg-brand-surface p-3 rounded-lg border border-black/5">
                     <span className="font-bold text-brand-muted block mb-1">{n.date}</span>
                     <span className={`font-medium leading-relaxed ${n.type === 'economy' ? 'text-brand-gold' : n.type === 'negative' ? 'text-brand-loss' : n.type === 'positive' ? 'text-brand-profit' : 'text-brand-text'}`}>{n.headline}</span>
                  </div>
               ))}
            </div>
         </div>
         {/* Inbox */}
         <div className="bg-brand-card border border-black/10 rounded-xl p-5 shadow-sm h-80 flex flex-col">
            <h3 className="text-sm font-bold text-brand-muted uppercase tracking-wider mb-4 border-b border-black/5 pb-2 flex items-center"><FileText size={16} className="mr-2"/> Direct Inbox</h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
               {(inbox || []).length === 0 ? <div className="text-xs text-brand-muted text-center pt-8">No messages.</div> : 
               (inbox || []).map(m => (
                  <div key={m.id} className="text-xs bg-brand-surface p-3 rounded-lg border border-black/5">
                     <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-brand-blue">{m.sender}</span>
                        <span className="text-[10px] text-brand-muted">{m.date}</span>
                     </div>
                     <div className="font-bold text-brand-text mb-1 truncate">{m.subject}</div>
                     <div className="text-brand-muted line-clamp-2">{m.body}</div>
                  </div>
               ))}
            </div>
         </div>
         {/* Opportunities */}
         <div className="bg-brand-card border border-brand-gold/30 rounded-xl p-5 shadow-sm h-80 flex flex-col">
            <h3 className="text-sm font-bold text-brand-gold uppercase tracking-wider mb-4 border-b border-brand-gold/20 pb-2 flex items-center"><AlertCircle size={16} className="mr-2 animate-pulse"/> Opportunities</h3>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
               {activeOpportunities.length === 0 ? <div className="text-xs text-brand-muted text-center pt-8">No active deals.</div> :
               activeOpportunities.map(opp => (
                  <div key={opp.id} className="text-xs bg-brand-surface p-4 rounded-lg border border-brand-gold/20">
                     <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-brand-text text-sm leading-tight">{opp.title}</span>
                        <span className="font-bold text-brand-loss bg-brand-loss/10 px-1.5 py-0.5 rounded text-[10px]">{opp.daysRemaining}d</span>
                     </div>
                     <p className="text-brand-muted mb-3 leading-relaxed">{opp.description}</p>
                     <div className="space-y-1 mb-3 bg-brand-bg p-2 rounded border border-black/5">
                        <div className="flex justify-between"><span className="text-brand-muted">Valuation:</span><span className="line-through">{formatCurrency(opp.marketValue)}</span></div>
                        <div className="flex justify-between"><span className="text-brand-muted">Asking:</span><span className="font-bold text-brand-profit">{formatCurrency(opp.askingPrice)}</span></div>
                     </div>
                     <button onClick={() => buyOpportunity(opp.id)} disabled={player.cash < opp.askingPrice} className="w-full py-2 bg-brand-gold text-brand-bg font-bold rounded hover:brightness-110 disabled:opacity-50 transition">
                        {player.cash >= opp.askingPrice ? 'Execute Buyout' : 'Need Capital'}
                     </button>
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

function PerformanceRow({ name, type, val, pnl }: { name: string, type: string, val: number, pnl: number }) {
   const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
   return (
      <div className="flex justify-between items-center p-3 bg-brand-surface border border-black/5 rounded-xl">
         <div>
            <div className="font-bold text-brand-text text-sm">{name}</div>
            <div className="text-[10px] text-brand-muted uppercase tracking-wider">{type}</div>
         </div>
         <div className="text-right">
            <div className="font-bold text-sm text-brand-text">{formatCurrency(val)}</div>
            <div className={`text-xs font-bold ${pnl >= 0 ? 'text-brand-profit' : 'text-brand-loss'}`}>{pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}</div>
         </div>
      </div>
   );
}
"""

with open('src/components/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(dashboard_code)
print('Dashboard rebuilt!')
