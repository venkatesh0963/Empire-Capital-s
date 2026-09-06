'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { Rocket, AlertTriangle, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

export function Startups() {
  const { player, startupMarket, portfolio, investInStartup } = useGameStore();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(value);
  };

  return (
    <div className="flex h-full bg-brand-bg overflow-y-auto p-8">
      <div className="w-full max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b border-black/10 pb-6">
          <div>
            <h2 className="text-3xl font-bold text-brand-text flex items-center">
              <Rocket className="mr-3 text-fuchsia-500" size={32} />
              Venture Capital
            </h2>
            <p className="text-brand-muted mt-2 max-w-xl">
              High risk, exponential reward. Fund early-stage startups and wait for them to either IPO or go bankrupt.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-brand-muted">Available Cash</p>
            <p className="text-2xl font-bold text-brand-purple">{formatCurrency(player.cash)}</p>
          </div>
        </div>

        {/* Pitch Deck */}
        <section>
          <h3 className="text-2xl font-bold text-brand-text mb-6">Live Pitches</h3>
          {startupMarket.pitches.length === 0 ? (
            <div className="p-8 text-center text-brand-muted bg-brand-card border border-black/10 rounded-xl">
              No new pitches at the moment. Check back later.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {startupMarket.pitches.map(pitch => (
                <div key={pitch.id} className="bg-brand-card border border-black/10 rounded-xl p-6 flex flex-col justify-between hover:border-fuchsia-900/30 transition">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-bold text-brand-text">{pitch.name}</h4>
                      <span className="px-2 py-1 bg-brand-surface text-brand-purple text-xs font-bold rounded">
                        {pitch.stage}
                      </span>
                    </div>
                    <p className="text-brand-muted text-sm mb-6">{pitch.description}</p>
                    
                    <div className="space-y-3 mb-6 bg-brand-bg p-4 rounded-lg border border-black/10">
                      <div className="flex justify-between text-sm">
                        <span className="text-brand-muted">Industry</span>
                        <span className="text-brand-muted font-medium">{pitch.industry}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-brand-muted">Valuation</span>
                        <span className="text-brand-muted font-medium">{formatCurrency(pitch.valuation)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-brand-muted">Required Investment</span>
                        <span className="text-brand-purple font-bold">{formatCurrency(pitch.investmentRequired)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-brand-muted">Success Probability</span>
                        <span className="text-brand-gold font-medium">{(pitch.successProbability * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-brand-muted">Potential Exit</span>
                        <span className="text-brand-profit font-bold">{pitch.potentialMultiplier.toFixed(1)}x in {pitch.monthsToExit} mo</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => investInStartup(pitch.id, pitch.investmentRequired)}
                    disabled={player.cash < pitch.investmentRequired}
                    className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 disabled:bg-brand-surface disabled:text-brand-muted text-brand-text font-bold py-3 rounded-lg transition"
                  >
                    Fund ${formatCurrency(pitch.investmentRequired).replace('$', '')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Portfolio */}
        <section>
          <h3 className="text-2xl font-bold text-brand-text mb-6">Your VC Portfolio</h3>
          {portfolio.startups.length === 0 ? (
            <div className="p-8 text-center text-brand-muted bg-brand-card border border-black/10 rounded-xl">
              You haven't funded any startups yet.
            </div>
          ) : (
            <div className="bg-brand-card border border-black/10 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-brand-bg text-brand-muted text-sm">
                    <th className="p-4 font-medium border-b border-black/10">Company</th>
                    <th className="p-4 font-medium border-b border-black/10">Invested</th>
                    <th className="p-4 font-medium border-b border-black/10">Equity</th>
                    <th className="p-4 font-medium border-b border-black/10">Time Left</th>
                    <th className="p-4 font-medium border-b border-black/10 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {portfolio.startups.map((su, idx) => (
                    <tr key={idx} className="border-b border-black/10/50 last:border-0 hover:bg-brand-surface/30">
                      <td className="p-4 font-bold text-brand-text">
                        {su.name} <span className="text-xs text-brand-muted font-normal ml-2">{su.industry}</span>
                      </td>
                      <td className="p-4 text-brand-muted">{formatCurrency(su.investedAmount)}</td>
                      <td className="p-4 text-brand-muted">{(su.equityOwned * 100).toFixed(2)}%</td>
                      <td className="p-4 text-brand-muted">
                        {su.status === 'Active' ? `${su.monthsRemaining} mo` : '-'}
                      </td>
                      <td className="p-4 text-right">
                        {su.status === 'Active' && <span className="text-brand-gold flex items-center justify-end"><TrendingUp className="mr-1" size={14}/> Developing</span>}
                        {su.status === 'IPO' && <span className="text-brand-profit flex items-center justify-end"><CheckCircle className="mr-1" size={14}/> IPO ({formatCurrency(su.exitValue)})</span>}
                        {su.status === 'Bankrupt' && <span className="text-brand-loss flex items-center justify-end"><XCircle className="mr-1" size={14}/> Bankrupt</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
