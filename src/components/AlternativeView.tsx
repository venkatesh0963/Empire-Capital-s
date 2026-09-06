'use client';

import React, { useState } from 'react';
import { RealEstate } from '@/components/RealEstate';
import { AlternativeMarket } from '@/components/AlternativeMarket';
import { CityBuilder } from '@/components/CityBuilder';

export function AlternativeView() {
  const [activeTab, setActiveTab] = useState<'realestate' | 'city' | 'ip' | 'collectibles'>('realestate');

  return (
    <div className="flex flex-col h-full bg-brand-bg">
      <div className="p-4 border-b border-black/10 bg-brand-card flex space-x-2">
        <button 
          onClick={() => setActiveTab('realestate')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'realestate' ? 'bg-brand-surface text-brand-text' : 'text-brand-muted hover:text-brand-muted'}`}
        >
          Real Estate
        </button>
        <button 
          onClick={() => setActiveTab('city')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'city' ? 'bg-brand-surface text-brand-blue' : 'text-brand-muted hover:text-brand-muted'}`}
        >
          City Development
        </button>
        <button 
          onClick={() => setActiveTab('ip')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'ip' ? 'bg-brand-surface text-brand-purple' : 'text-brand-muted hover:text-brand-muted'}`}
        >
          Intellectual Property
        </button>
        <button 
          onClick={() => setActiveTab('collectibles')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'collectibles' ? 'bg-brand-surface text-brand-gold' : 'text-brand-muted hover:text-brand-muted'}`}
        >
          Collectibles
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'realestate' && <RealEstate />}
        {activeTab === 'city' && <CityBuilder />}
        {activeTab === 'ip' && <AlternativeMarket type="ip" />}
        {activeTab === 'collectibles' && <AlternativeMarket type="collectibles" />}
      </div>
    </div>
  );
}
