'use client';

import React, { useState } from 'react';
import { Business } from '@/components/Business';
import { Startups } from '@/components/Startups';
import { MAMarket } from '@/components/MAMarket';

export function VenturesView() {
  const [activeTab, setActiveTab] = useState<'businesses' | 'startups' | 'pe'>('businesses');

  return (
    <div className="flex flex-col h-full bg-brand-bg">
      <div className="p-4 border-b border-black/10 bg-brand-card flex space-x-2">
        <button 
          onClick={() => setActiveTab('businesses')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'businesses' ? 'bg-brand-surface text-brand-profit' : 'text-brand-muted hover:text-brand-muted'}`}
        >
          My Businesses
        </button>
        <button 
          onClick={() => setActiveTab('pe')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'pe' ? 'bg-brand-surface text-brand-blue' : 'text-brand-muted hover:text-brand-muted'}`}
        >
          M&A Targets (Buyouts)
        </button>
        <button 
          onClick={() => setActiveTab('startups')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'startups' ? 'bg-brand-surface text-brand-purple' : 'text-brand-muted hover:text-brand-muted'}`}
        >
          Angel Investing
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'businesses' && <Business />}
        {activeTab === 'pe' && <MAMarket />}
        {activeTab === 'startups' && <Startups />}
      </div>
    </div>
  );
}
