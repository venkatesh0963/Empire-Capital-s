'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { INITIAL_LUXURY_ITEMS, LuxuryCategory } from '@/lib/luxuryData';
import { Gem, Anchor, Plane, Car, Watch, CheckCircle2 } from 'lucide-react';

export function LuxuryStore() {
  const { player, portfolio, buyLuxuryItem, sellLuxuryItem } = useGameStore();
  const [activeCategory, setActiveCategory] = useState<LuxuryCategory>('Cars');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(value);
  };

  const getCategoryIcon = (cat: LuxuryCategory) => {
    switch(cat) {
      case 'Watches': return <Watch size={18} className="mr-2" />;
      case 'Cars': return <Car size={18} className="mr-2" />;
      case 'Yachts': return <Anchor size={18} className="mr-2" />;
      case 'Jets': return <Plane size={18} className="mr-2" />;
      case 'Art': return <Gem size={18} className="mr-2" />;
    }
  };

  const filteredItems = INITIAL_LUXURY_ITEMS.filter(i => i.category === activeCategory);
  const categories: LuxuryCategory[] = ['Watches', 'Art', 'Cars', 'Yachts', 'Jets'];

  return (
    <div className="flex h-full bg-brand-bg overflow-hidden">
      
      {/* Sidebar Navigation */}
      <div className="w-64 border-r border-black/10 bg-brand-card flex flex-col">
        <div className="p-6 border-b border-black/10">
          <h2 className="text-xl font-bold text-yellow-500 flex items-center">
            <Gem className="mr-2" /> Lifestyle
          </h2>
          <p className="text-xs text-brand-muted mt-2">Elevate your status.</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`w-full flex items-center p-3 rounded-lg text-sm font-medium transition ${
                activeCategory === cat 
                  ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' 
                  : 'text-brand-muted hover:text-brand-text hover:bg-brand-surface'
              }`}
            >
              {getCategoryIcon(cat)}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="flex justify-between items-end border-b border-black/10 pb-4">
            <div>
              <h2 className="text-3xl font-bold text-brand-text">{activeCategory}</h2>
              <p className="text-brand-muted mt-1">Purchase high-end assets. Note: Most vehicles depreciate heavily and incur massive maintenance costs.</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-brand-muted">Available Cash</p>
              <p className="text-2xl font-bold text-yellow-500">{formatCurrency(player.cash)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => {
              const ownedInstance = portfolio.luxury.find(l => l.itemId === item.id);
              const isOwned = !!ownedInstance;

              return (
                <div key={item.id} className="bg-brand-card border border-black/10 rounded-xl overflow-hidden flex flex-col hover:border-black/10 transition">
                  <div className="h-32 bg-brand-surface flex items-center justify-center">
                     {getCategoryIcon(item.category)}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-brand-text mb-4">{item.name}</h3>
                    
                    <div className="space-y-2 mb-6 text-sm flex-1">
                      <div className="flex justify-between">
                        <span className="text-brand-muted">Price</span>
                        <span className="text-brand-text font-medium">{formatCurrency(item.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-muted">Maint/mo</span>
                        <span className="text-brand-loss font-medium">{formatCurrency(item.monthlyMaintenance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-muted">Depreciation</span>
                        <span className={item.depreciationRate > 0 ? 'text-brand-loss' : 'text-brand-profit'}>
                          {(item.depreciationRate * 100).toFixed(0)}%/yr
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-muted">Status Boost</span>
                        <span className="text-yellow-400 font-medium">+{item.statusBoost}</span>
                      </div>
                    </div>

                    {isOwned ? (
                      <div className="space-y-2">
                        <div className="bg-emerald-900/20 text-brand-profit text-center py-2 rounded-lg text-sm font-bold flex items-center justify-center border border-emerald-900/50">
                          <CheckCircle2 size={16} className="mr-2" /> Owned
                        </div>
                        <button 
                          onClick={() => sellLuxuryItem(item.id)}
                          className="w-full bg-brand-surface hover:bg-brand-surface text-brand-muted font-medium py-2 rounded-lg transition text-sm"
                        >
                          Sell for {formatCurrency(ownedInstance.currentValue)}
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => buyLuxuryItem(item.id)}
                        disabled={player.cash < item.price}
                        className="w-full bg-yellow-600 hover:bg-yellow-500 disabled:bg-brand-surface disabled:text-brand-muted text-brand-text font-bold py-2 rounded-lg transition"
                      >
                        Buy Item
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
  );
}
