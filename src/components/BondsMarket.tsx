'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { INITIAL_BONDS } from '@/lib/bondData';
import { ShieldCheck } from 'lucide-react';

export function BondsMarket() {
  const { player, portfolio, buyBond } = useGameStore();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(value);
  };

  return (
    <div className="flex h-full bg-brand-bg p-8 overflow-y-auto">
      <div className="w-full max-w-5xl mx-auto">
        
        <div className="flex justify-between items-end mb-8 border-b border-black/10 pb-4">
          <div>
            <h2 className="text-3xl font-bold text-brand-text flex items-center">
              <ShieldCheck className="mr-3 text-brand-profit" size={32} />
              Bond Market
            </h2>
            <p className="text-brand-muted mt-2">Ultra-safe, fixed-yield assets for capital preservation.</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-brand-muted">Available Cash</p>
            <p className="text-2xl font-bold text-brand-profit">{formatCurrency(player.cash)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {INITIAL_BONDS.map(bond => {
            return (
              <div key={bond.id} className="bg-brand-card border border-black/10 rounded-xl p-6 flex flex-col justify-between hover:border-black/10 transition">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-brand-text">{bond.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${bond.riskRating === 'AAA' ? 'bg-emerald-900/50 text-brand-profit' : 'bg-rose-900/50 text-brand-loss'}`}>
                      {bond.riskRating}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-6 text-sm">
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Face Value</span>
                      <span className="text-brand-text font-medium">{formatCurrency(bond.faceValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Annual Yield</span>
                      <span className="text-brand-profit font-bold">{(bond.yieldRate * 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Term Length</span>
                      <span className="text-brand-text">{bond.durationYears} Years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Monthly Payout</span>
                      <span className="text-brand-profit">+{formatCurrency((bond.faceValue * bond.yieldRate) / 12)}/mo</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => buyBond(bond.id, bond.faceValue)}
                  disabled={player.cash < bond.faceValue}
                  className="w-full bg-brand-surface hover:bg-brand-surface disabled:opacity-50 disabled:cursor-not-allowed text-brand-text font-medium py-3 rounded-lg transition"
                >
                  Purchase Bond
                </button>
              </div>
            );
          })}
        </div>

        <h3 className="text-xl font-bold text-brand-text mb-4 border-b border-black/10 pb-2">Your Active Bonds</h3>
        {portfolio.bonds.length === 0 ? (
          <div className="text-center py-10 bg-brand-card/50 rounded-lg border border-black/10/50 text-brand-muted">
            You do not own any bonds. Buy some to secure guaranteed monthly income.
          </div>
        ) : (
          <div className="bg-brand-card border border-black/10 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-bg text-brand-muted text-sm">
                  <th className="p-4 font-medium border-b border-black/10">Bond</th>
                  <th className="p-4 font-medium border-b border-black/10">Principal</th>
                  <th className="p-4 font-medium border-b border-black/10">Yield</th>
                  <th className="p-4 font-medium border-b border-black/10">Time to Maturity</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {portfolio.bonds.map((b, idx) => {
                  const bondData = INITIAL_BONDS.find(bd => bd.id === b.bondId);
                  if (!bondData) return null;
                  return (
                    <tr key={idx} className="border-b border-black/10/50 last:border-0 hover:bg-brand-surface/30">
                      <td className="p-4 font-medium text-brand-text">{bondData.name}</td>
                      <td className="p-4 text-brand-muted">{formatCurrency(b.principal)}</td>
                      <td className="p-4 text-brand-profit">+{formatCurrency((b.principal * bondData.yieldRate) / 12)}/mo</td>
                      <td className="p-4 text-brand-muted">{b.monthsRemaining} months</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
