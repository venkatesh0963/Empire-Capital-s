'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Building, Home, Key, MapPin, DollarSign, Wrench, Percent } from 'lucide-react';

export function RealEstate() {
  const { player, realEstate, buyProperty, sellProperty } = useGameStore();
  const [activeTab, setActiveTab] = useState<'market' | 'portfolio'>('market');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(value);
  };

  return (
    <div className="flex flex-col h-full bg-brand-bg">
      {/* Header */}
      <div className="p-6 border-b border-black/10 bg-brand-card flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-brand-text">Real Estate</h2>
          <p className="text-sm text-brand-muted mt-1">Acquire cash-flowing properties to build passive income.</p>
        </div>
        <div className="flex space-x-2 bg-brand-bg p-1 rounded-lg border border-black/10">
          <button 
            onClick={() => setActiveTab('market')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'market' ? 'bg-brand-surface text-brand-profit' : 'text-brand-muted hover:text-brand-text'}`}
          >
            Property Market
          </button>
          <button 
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'portfolio' ? 'bg-brand-surface text-brand-profit' : 'text-brand-muted hover:text-brand-text'}`}
          >
            My Properties ({realEstate.ownedProperties.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        
        {activeTab === 'market' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {realEstate.marketListings.map(property => {
              const netCashFlow = property.monthlyRent - property.maintenanceCost - property.propertyTax;
              const roi = ((netCashFlow * 12) / property.price) * 100;
              const canAfford = player.cash >= property.price;

              return (
                <div key={property.id} className="bg-brand-card border border-black/10 rounded-xl overflow-hidden hover:border-black/10 transition">
                  <div className="h-32 bg-brand-surface flex items-center justify-center relative">
                    <Building className="text-brand-muted" size={48} />
                    <div className="absolute top-3 right-3 bg-emerald-500/20 text-brand-profit px-2 py-1 rounded text-xs font-bold">
                      {roi.toFixed(1)}% ROI
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-brand-text">{property.name}</h3>
                    <div className="flex items-center text-brand-muted text-sm mt-1 mb-4">
                      <MapPin size={14} className="mr-1" /> {property.location}
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-brand-muted">Asking Price</span>
                        <span className="font-bold text-brand-text">{formatCurrency(property.price)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-brand-muted">Gross Rent</span>
                        <span className="text-brand-profit">+{formatCurrency(property.monthlyRent)}/mo</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-brand-muted">Expenses</span>
                        <span className="text-brand-loss">-{formatCurrency(property.maintenanceCost + property.propertyTax)}/mo</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-black/10/50">
                        <span className="text-brand-muted font-medium">Net Cash Flow</span>
                        <span className="font-bold text-brand-profit">+{formatCurrency(netCashFlow)}/mo</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => buyProperty(property.id)}
                      disabled={!canAfford}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-brand-surface disabled:text-brand-muted text-brand-text py-2 rounded-lg font-medium transition"
                    >
                      {canAfford ? 'Buy Property' : 'Insufficient Funds'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div>
            {realEstate.ownedProperties.length === 0 ? (
              <div className="text-center py-20 text-brand-muted">
                <Home size={48} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium mb-2">No Properties Owned</h3>
                <p>Visit the Property Market to buy your first real estate asset.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {realEstate.ownedProperties.map(property => {
                  const grossRent = property.monthlyRent * property.occupancyRate;
                  const expenses = property.maintenanceCost + property.propertyTax;
                  const netCashFlow = grossRent - expenses;

                  return (
                    <div key={property.id} className="bg-brand-card border border-brand-profit/20 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                      <div className="p-5 border-b border-black/10">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg text-brand-text">{property.name}</h3>
                            <div className="flex items-center text-brand-muted text-xs mt-1">
                              <MapPin size={12} className="mr-1" /> {property.location}
                            </div>
                          </div>
                          <div className="bg-brand-bg px-2 py-1 rounded border border-black/10 text-xs text-brand-muted">
                            Purchased: {property.purchaseDate}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-5 space-y-4 bg-brand-card">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-brand-bg p-3 rounded-lg border border-black/10">
                            <p className="text-xs text-brand-muted mb-1">Current Value</p>
                            <p className="font-bold text-brand-text">{formatCurrency(property.price)}</p>
                          </div>
                          <div className="bg-brand-bg p-3 rounded-lg border border-black/10">
                            <p className="text-xs text-brand-muted mb-1">Occupancy</p>
                            <p className="font-bold text-brand-profit">{(property.occupancyRate * 100).toFixed(0)}%</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-brand-muted">Collected Rent</span>
                            <span className="text-brand-profit">+{formatCurrency(grossRent)}/mo</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-brand-muted">Maintenance & Taxes</span>
                            <span className="text-brand-loss">-{formatCurrency(expenses)}/mo</span>
                          </div>
                          <div className="flex justify-between text-sm pt-2 border-t border-black/10/50">
                            <span className="text-brand-muted font-medium">Net Cash Flow</span>
                            <span className="font-bold text-brand-profit">+{formatCurrency(netCashFlow)}/mo</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => sellProperty(property.id)}
                          className="w-full bg-brand-bg border border-black/10 hover:bg-rose-950/30 hover:border-rose-900 hover:text-brand-loss text-brand-muted py-2 rounded-lg font-medium transition text-sm mt-4"
                        >
                          Sell Property (5% Fee)
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
