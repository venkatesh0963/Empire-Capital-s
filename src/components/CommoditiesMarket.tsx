'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { INITIAL_COMMODITIES } from '@/lib/commodityData';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

export function CommoditiesMarket() {
  const [selectedCommodity, setSelectedCommodity] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  const { player, commoditiesMarket, portfolio, buyCommodity, sellCommodity } = useGameStore();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(value);
  };

  const selectedData = INITIAL_COMMODITIES.find(c => c.symbol === selectedCommodity);
  const currentPrice = selectedCommodity && commoditiesMarket?.prices ? commoditiesMarket.prices[selectedCommodity] : 0;
  
  const pos = selectedCommodity && portfolio.commodities ? portfolio.commodities[selectedCommodity] : 0;
  const owned = typeof pos === 'number' ? (pos || 0) : (pos?.quantity || 0);
  const avgCost = typeof pos === 'object' ? pos.averageCost : currentPrice;
  const pnl = (currentPrice * owned) - (avgCost * owned);
  const pnlPercent = (avgCost > 0 && owned > 0) ? (pnl / (avgCost * owned)) * 100 : 0;

  return (
    <div className="flex h-full">
      {/* List */}
      <div className="w-1/2 border-r border-black/10 flex flex-col h-full bg-brand-bg">
        <div className="p-6 border-b border-black/10 bg-brand-card">
          <h2 className="text-xl font-bold text-brand-gold">Commodities Exchange</h2>
          <p className="text-sm text-brand-muted mt-1">Trade raw materials and resources.</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {INITIAL_COMMODITIES.map(com => {
            const price = commoditiesMarket?.prices ? commoditiesMarket.prices[com.symbol] || com.basePrice : com.basePrice;
            const history = commoditiesMarket?.history ? commoditiesMarket.history[com.symbol] || [com.basePrice] : [com.basePrice];
            const previousPrice = history.length > 1 ? history[history.length - 2] : price;
            const isUp = price >= previousPrice;
            const chartData = history.map((p, i) => ({ price: p, index: i }));

            return (
              <div 
                key={com.symbol}
                onClick={() => setSelectedCommodity(com.symbol)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedCommodity === com.symbol 
                    ? 'bg-brand-surface border-amber-500/50' 
                    : 'bg-brand-card border-black/10 hover:border-black/10'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-bold text-brand-text">{com.symbol}</h3>
                    <p className="text-xs text-brand-muted">{com.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand-text">{formatCurrency(price)}</p>
                    <p className={`text-xs ${isUp ? 'text-brand-profit' : 'text-brand-loss'}`}>
                      {isUp ? '▲' : '▼'} {Math.abs(price - previousPrice).toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <div className="h-12 w-full mt-2 opacity-70">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <YAxis domain={['auto', 'auto']} hide />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke={isUp ? '#34d399' : '#fb7185'} 
                        strokeWidth={2} 
                        dot={false}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trading Panel */}
      <div className="w-1/2 p-8 bg-brand-bg h-full overflow-y-auto">
        {selectedData ? (
          <div>
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-bold text-brand-text">{selectedData.name} ({selectedData.symbol})</h2>
                <p className="text-brand-muted">Macro Sensitivity: {selectedData.economySensitivity > 1 ? 'High' : selectedData.economySensitivity < 0 ? 'Inverse' : 'Normal'}</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-brand-gold">{formatCurrency(currentPrice)}</p>
              </div>
            </div>

            <div className="bg-brand-card border border-black/10 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-brand-text mb-4">Trading Desk</h3>
              
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-sm text-brand-muted">Available Cash</p>
                  <p className="text-xl font-bold text-brand-text">{formatCurrency(player.cash)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-brand-muted">Contracts Owned</p>
                  <p className="text-xl font-bold text-brand-text">{owned}</p>
                </div>
              </div>
              
              {owned > 0 && (
                <div className="flex justify-between items-center mb-6 p-3 bg-brand-bg rounded-lg border border-black/10">
                   <div>
                     <p className="text-xs text-brand-muted">Average Cost</p>
                     <p className="font-bold text-brand-text">{formatCurrency(avgCost)}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-xs text-brand-muted">Unrealized P/L</p>
                     <p className={`font-bold ${pnl >= 0 ? 'text-brand-profit' : 'text-brand-loss'}`}>
                        {pnl >= 0 ? '+' : ''}{formatCurrency(pnl)} ({pnlPercent.toFixed(1)}%)
                     </p>
                   </div>
                </div>
              )}

              <div className="flex items-center space-x-4 mb-6">
                <label className="text-brand-muted">Quantity:</label>
                <input 
                  type="number" 
                  min="1" step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                  className="bg-brand-bg border border-black/10 rounded p-2 text-brand-text w-24 text-center focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex space-x-4 border-t border-black/10 pt-6">
                <button 
                  onClick={() => buyCommodity(selectedData.symbol, quantity)}
                  disabled={player.cash < (currentPrice * quantity) || quantity <= 0}
                  className="flex-1 bg-amber-600 hover:bg-amber-500 disabled:bg-brand-surface disabled:text-brand-muted text-brand-text font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Buy for {formatCurrency(currentPrice * quantity)}
                </button>
                <button 
                  onClick={() => sellCommodity(selectedData.symbol, quantity)}
                  disabled={owned < quantity || quantity <= 0}
                  className="flex-1 bg-rose-600 hover:bg-rose-500 disabled:bg-brand-surface disabled:text-brand-muted text-brand-text font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Sell for {formatCurrency(currentPrice * quantity)}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-brand-muted">
            Select a commodity to view details and trade.
          </div>
        )}
      </div>
    </div>
  );
}
