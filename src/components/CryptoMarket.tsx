'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { INITIAL_CRYPTO } from '@/lib/cryptoData';
import { LineChart, Line, YAxis, ResponsiveContainer } from 'recharts';

export function CryptoMarket() {
  const { player, cryptoMarket, portfolio, buyCrypto, sellCrypto } = useGameStore();
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const formatCurrency = (value: number) => {
    // Show more decimals for crypto if price is low
    const digits = value < 1 ? 4 : value < 100 ? 2 : 0;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(value);
  };

  const selectedCoinData = INITIAL_CRYPTO.find(s => s.symbol === selectedCoin);
  const currentPrice = selectedCoin && cryptoMarket.prices ? cryptoMarket.prices[selectedCoin] : 0;
  
  const pos = selectedCoin && portfolio.crypto ? portfolio.crypto[selectedCoin] : 0;
  const owned = typeof pos === 'number' ? (pos || 0) : (pos?.quantity || 0);
  const avgCost = typeof pos === 'object' ? pos.averageCost : currentPrice;
  const pnl = (currentPrice * owned) - (avgCost * owned);
  const pnlPercent = (avgCost > 0 && owned > 0) ? (pnl / (avgCost * owned)) * 100 : 0;

  return (
    <div className="flex h-full">
      {/* Coin List */}
      <div className="w-1/2 border-r border-black/10 flex flex-col h-full bg-brand-bg">
        <div className="p-6 border-b border-black/10 bg-brand-card">
          <h2 className="text-xl font-bold text-brand-text text-brand-blue">Crypto Exchange</h2>
          <p className="text-sm text-brand-muted mt-1">High risk, high reward digital assets.</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {INITIAL_CRYPTO.map(coin => {
            const price = cryptoMarket?.prices ? cryptoMarket.prices[coin.symbol] || coin.basePrice : coin.basePrice;
            const history = cryptoMarket?.history ? cryptoMarket.history[coin.symbol] || [coin.basePrice] : [coin.basePrice];
            const previousPrice = history.length > 1 ? history[history.length - 2] : price;
            const isUp = price >= previousPrice;
            const chartData = history.map((p, i) => ({ price: p, index: i }));

            return (
              <div 
                key={coin.symbol}
                onClick={() => setSelectedCoin(coin.symbol)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedCoin === coin.symbol 
                    ? 'bg-brand-surface border-cyan-500/50' 
                    : 'bg-brand-card border-black/10 hover:border-black/10'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-bold text-brand-text">{coin.symbol}</h3>
                    <p className="text-xs text-brand-muted">{coin.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand-text">{formatCurrency(price)}</p>
                    <p className={`text-xs ${isUp ? 'text-brand-profit' : 'text-brand-loss'}`}>
                      {isUp ? '▲' : '▼'} {Math.abs(price - previousPrice).toFixed(4)}
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
        {selectedCoinData ? (
          <div>
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-bold text-brand-text">{selectedCoinData.name} ({selectedCoinData.symbol})</h2>
                <p className="text-brand-muted">Risk Level: <span className={
                  selectedCoinData.riskRating === 'Extreme' ? 'text-rose-500 font-bold' :
                  selectedCoinData.riskRating === 'High' ? 'text-brand-loss' : 'text-brand-gold'
                }>{selectedCoinData.riskRating}</span></p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-brand-blue">{formatCurrency(currentPrice)}</p>
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
                  <p className="text-sm text-brand-muted">Coins Owned</p>
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
                  min="0.1" step="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                  className="bg-brand-bg border border-black/10 rounded p-2 text-brand-text w-24 text-center focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex space-x-4 border-t border-black/10 pt-6">
                <button 
                  onClick={() => buyCrypto(selectedCoinData.symbol, quantity)}
                  disabled={player.cash < (currentPrice * quantity) || quantity <= 0}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 disabled:bg-brand-surface disabled:text-brand-muted text-brand-text font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Buy for {formatCurrency(currentPrice * quantity)}
                </button>
                <button 
                  onClick={() => sellCrypto(selectedCoinData.symbol, quantity)}
                  disabled={owned < quantity || quantity <= 0}
                  className="flex-1 bg-rose-600 hover:bg-rose-500 disabled:bg-brand-surface disabled:text-brand-muted text-brand-text font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Sell for {formatCurrency(currentPrice * quantity)}
                </button>
              </div>
            </div>
            
            <div className="bg-brand-card border border-black/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-brand-text mb-2">Warning</h3>
              <p className="text-brand-muted leading-relaxed text-sm">
                Cryptocurrency markets are highly speculative and volatile. Prices can swing wildly on any given day, independent of broader economic conditions. Never invest money you cannot afford to lose!
              </p>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-brand-muted">
            Select a coin to view details and trade.
          </div>
        )}
      </div>
    </div>
  );
}
