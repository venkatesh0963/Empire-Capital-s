'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { INITIAL_IP, INITIAL_COLLECTIBLES } from '@/lib/alternativeData';
import { Book, Coins, TrendingUp, Star } from 'lucide-react';

export function AlternativeMarket({ type }: { type: 'ip' | 'collectibles' }) {
  const { player, portfolio, buyIP, sellIP, buyCollectible, sellCollectible } = useGameStore();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(value);
  };

  if (type === 'ip') {
    return (
      <div className="p-8 overflow-y-auto h-full space-y-8 bg-brand-bg">
        <div>
          <h2 className="text-2xl font-bold text-brand-text flex items-center">
             <Book className="mr-2 text-brand-purple" /> Intellectual Property
          </h2>
          <p className="text-brand-muted mt-1">Purchase patents and rights to earn passive royalties.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {INITIAL_IP.map(ip => {
             const owned = (portfolio.ip || []).find(i => i.ipId === ip.id);
             return (
                <div key={ip.id} className="bg-brand-card border border-black/10 rounded-xl p-6">
                   <h3 className="text-xl font-bold text-brand-text mb-1">{ip.name}</h3>
                   <p className="text-sm text-brand-purple font-medium mb-4">{ip.type}</p>
                   
                   <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                         <span className="text-brand-muted">Base Price</span>
                         <span className="text-brand-muted font-medium">{formatCurrency(ip.basePrice)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                         <span className="text-brand-muted">Monthly Royalty</span>
                         <span className="text-brand-profit font-medium">+{formatCurrency(owned ? owned.currentRoyalty : ip.monthlyRoyalty)}/mo</span>
                      </div>
                   </div>

                   {owned ? (
                      <button 
                         onClick={() => sellIP(ip.id)}
                         className="w-full bg-brand-surface hover:bg-brand-surface text-brand-muted py-2 rounded-lg font-medium transition"
                      >
                         Sell Rights
                      </button>
                   ) : (
                      <button 
                         onClick={() => buyIP(ip.id)}
                         disabled={player.cash < ip.basePrice}
                         className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-brand-surface disabled:text-brand-muted text-brand-text py-2 rounded-lg font-bold transition"
                      >
                         Buy for {formatCurrency(ip.basePrice)}
                      </button>
                   )}
                </div>
             );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 overflow-y-auto h-full space-y-8 bg-brand-bg">
      <div>
        <h2 className="text-2xl font-bold text-brand-text flex items-center">
           <Coins className="mr-2 text-brand-gold" /> Rare Collectibles
        </h2>
        <p className="text-brand-muted mt-1">Invest in physical assets that appreciate over time.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {INITIAL_COLLECTIBLES.map(col => {
           const owned = (portfolio.collectibles || []).find(c => c.collectibleId === col.id);
           return (
               <div key={col.id} className="bg-brand-card border border-black/10 rounded-xl p-6 relative">
                  <div className="absolute top-4 right-4 flex space-x-1">
                     {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < col.rarity ? "text-brand-gold fill-brand-gold" : "text-brand-muted"} />
                     ))}
                  </div>
                 <h3 className="text-xl font-bold text-brand-text mb-1">{col.name}</h3>
                 <p className="text-sm text-brand-gold font-medium mb-4">{col.type}</p>
                 
                 <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                       <span className="text-brand-muted">{owned ? 'Current Value' : 'Price'}</span>
                       <span className="text-brand-muted font-medium">{formatCurrency(owned ? owned.currentValue : col.basePrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="text-brand-muted">Appreciation</span>
                       <span className="text-brand-profit font-medium flex items-center">
                          <TrendingUp size={14} className="mr-1" />
                          {(col.appreciationRate * 100).toFixed(1)}%/yr
                       </span>
                    </div>
                 </div>

                 {owned ? (
                    <button 
                       onClick={() => sellCollectible(col.id)}
                       className="w-full bg-brand-surface hover:bg-brand-surface text-brand-muted py-2 rounded-lg font-medium transition"
                    >
                       Sell for {formatCurrency(owned.currentValue)}
                    </button>
                 ) : (
                    <button 
                       onClick={() => buyCollectible(col.id)}
                       disabled={player.cash < col.basePrice}
                       className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-brand-surface disabled:text-brand-muted text-brand-text py-2 rounded-lg font-bold transition"
                    >
                       Buy for {formatCurrency(col.basePrice)}
                    </button>
                 )}
              </div>
           );
        })}
      </div>
    </div>
  );
}
