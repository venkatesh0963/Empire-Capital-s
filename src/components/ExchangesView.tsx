'use client';

import React, { useState } from 'react';
import { StockMarket } from '@/components/StockMarket';
import { CryptoMarket } from '@/components/CryptoMarket';
import { CommoditiesMarket } from '@/components/CommoditiesMarket';
import { BondsMarket } from '@/components/BondsMarket';

export function ExchangesView() {
  const [activeTab, setActiveTab] = useState<'stocks' | 'crypto' | 'bonds' | 'commodities'>('stocks');

  return (
    <div className="flex flex-col h-full bg-brand-bg">
      <div className="p-4 border-b border-black/10 bg-brand-card flex space-x-2">
        <button 
          onClick={() => setActiveTab('stocks')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'stocks' ? 'bg-brand-surface text-brand-text' : 'text-brand-muted hover:text-brand-muted'}`}
        >
          Stock Market
        </button>
        <button 
          onClick={() => setActiveTab('crypto')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'crypto' ? 'bg-brand-surface text-brand-blue' : 'text-brand-muted hover:text-brand-muted'}`}
        >
          Crypto Exchange
        </button>
        <button 
          onClick={() => setActiveTab('commodities')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'commodities' ? 'bg-brand-surface text-brand-gold' : 'text-brand-muted hover:text-brand-muted'}`}
        >
          Commodities
        </button>
        <button 
          onClick={() => setActiveTab('bonds')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'bonds' ? 'bg-brand-surface text-brand-profit' : 'text-brand-muted hover:text-brand-muted'}`}
        >
          Bonds
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'stocks' && <StockMarket />}
        {activeTab === 'crypto' && <CryptoMarket />}
        {activeTab === 'commodities' && <CommoditiesMarket />}
        {activeTab === 'bonds' && <BondsMarket />}
      </div>
    </div>
  );
}
