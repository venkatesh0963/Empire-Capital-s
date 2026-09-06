'use client';

import React, { useState } from 'react';
import { useGameStore, BankLoan } from '@/store/gameStore';
import { Landmark, FileText, FileDown, ShieldAlert, CheckCircle2 } from 'lucide-react';

export function Bank() {
  const { player, banking, takeLoan, payDownLoan } = useGameStore();
  const [activeTab, setActiveTab] = useState<'apply' | 'manage'>('apply');

  // Application State
  const [loanAmount, setLoanAmount] = useState<number>(50000);
  const [loanTerm, setLoanTerm] = useState<number>(5);
  const [loanType, setLoanType] = useState<BankLoan['type']>('Personal');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(value);
  };

  // Preview Calculations
  const baseRate = 0.07;
  const creditMultiplier = (700 - player.creditScore) / 1000;
  let interestRate = Math.max(0.03, baseRate + creditMultiplier);
  if (loanType === 'Personal') interestRate += 0.05;
  if (loanType === 'Mortgage') interestRate -= 0.02;

  const termMonths = loanTerm * 12;
  const monthlyRate = interestRate / 12;
  const monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));

  const totalDebt = banking.loans.reduce((acc, loan) => acc + loan.remainingBalance, 0);
  
  // DTI (Debt to Income Ratio) approx based on gross estimated income
  const estimatedIncome = player.passiveIncome > 0 ? player.passiveIncome + 5000 : 5000; 
  const dti = ((player.monthlyExpenses + monthlyPayment) / estimatedIncome) * 100;
  
  const approvalProb = player.creditScore > 750 && dti < 40 ? 95 : 
                       player.creditScore > 650 && dti < 50 ? 70 : 
                       player.creditScore > 500 ? 30 : 5;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (Math.random() * 100 < approvalProb) {
       if (takeLoan(loanAmount, loanTerm, loanType)) {
           alert("Loan Approved! Funds have been deposited.");
           setActiveTab('manage');
       }
    } else {
       alert("Loan Denied. Your credit profile or debt-to-income ratio does not meet our requirements.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-brand-bg">
      <div className="p-6 border-b border-black/10 bg-brand-card flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-brand-text flex items-center">
            <Landmark size={24} className="mr-2 text-brand-profit" /> Capital Bank
          </h2>
          <p className="text-sm text-brand-muted mt-1">Leverage debt to build your empire.</p>
        </div>
        <div className="flex space-x-2 bg-brand-bg p-1 rounded-lg border border-black/10">
          <button 
            onClick={() => setActiveTab('apply')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'apply' ? 'bg-brand-surface text-brand-profit' : 'text-brand-muted hover:text-brand-text'}`}
          >
            Apply for Loan
          </button>
          <button 
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'manage' ? 'bg-brand-surface text-brand-profit' : 'text-brand-muted hover:text-brand-text'}`}
          >
            Manage Debt ({banking.loans.length})
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex justify-center">
        
        {activeTab === 'apply' && (
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-brand-card border border-black/10 rounded-xl p-8">
              <h3 className="text-xl font-bold text-brand-text mb-6 border-b border-black/10 pb-4">Loan Application</h3>
              
              <form onSubmit={handleApply} className="space-y-6">
                <div>
                  <label className="block text-brand-muted text-sm mb-2">Loan Type</label>
                  <select 
                    value={loanType} 
                    onChange={(e) => setLoanType(e.target.value as BankLoan['type'])}
                    className="w-full bg-brand-bg border border-black/10 rounded-lg p-3 text-brand-text focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Personal">Personal Loan (Higher Interest)</option>
                    <option value="Business">Business Loan (Standard)</option>
                    <option value="Mortgage">Mortgage (Lower Interest, requires asset)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-brand-muted text-sm mb-2">Requested Amount</label>
                  <input 
                    type="number" min="5000" max="5000000" step="5000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full bg-brand-bg border border-black/10 rounded-lg p-3 text-brand-text focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-brand-muted text-sm mb-2">Term (Years)</label>
                  <input 
                    type="range" min="1" max="30" step="1"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full accent-brand-profit"
                  />
                  <div className="text-right text-brand-muted mt-1 font-bold">{loanTerm} Years</div>
                </div>

                <div className="pt-4 border-t border-black/10">
                  <button 
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-brand-text font-bold py-4 px-4 rounded-lg transition-colors"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-6">
              <div className="bg-brand-card border border-black/10 rounded-xl p-6">
                <h3 className="text-lg font-bold text-brand-text mb-4">Credit Profile</h3>
                <div className="flex items-center justify-between mb-2">
                   <span className="text-brand-muted">Credit Score</span>
                   <span className={`text-2xl font-bold ${player.creditScore >= 700 ? 'text-brand-profit' : 'text-brand-gold'}`}>{player.creditScore}</span>
                </div>
                <div className="w-full bg-brand-surface rounded-full h-2 mb-4">
                  <div className="bg-emerald-400 h-2 rounded-full" style={{ width: `${(player.creditScore / 850) * 100}%` }}></div>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-brand-muted">Total Debt</span>
                   <span className="text-brand-loss font-medium">{formatCurrency(totalDebt)}</span>
                </div>
              </div>

              <div className="bg-brand-card border border-black/10 rounded-xl p-6 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
                <h3 className="text-lg font-bold text-brand-text mb-4 flex items-center">
                   <FileText size={18} className="mr-2 text-brand-muted" /> Terms Preview
                </h3>
                <div className="space-y-3">
                   <div className="flex justify-between pb-2 border-b border-black/10/50">
                     <span className="text-brand-muted">Interest Rate (APR)</span>
                     <span className="text-brand-text font-bold">{(interestRate * 100).toFixed(2)}%</span>
                   </div>
                   <div className="flex justify-between pb-2 border-b border-black/10/50">
                     <span className="text-brand-muted">Monthly Payment</span>
                     <span className="text-brand-profit font-bold">{formatCurrency(monthlyPayment)}</span>
                   </div>
                   <div className="flex justify-between pb-2 border-b border-black/10/50">
                     <span className="text-brand-muted">Total Interest</span>
                     <span className="text-brand-loss font-bold">{formatCurrency((monthlyPayment * termMonths) - loanAmount)}</span>
                   </div>
                   <div className="flex justify-between pt-2">
                     <span className="text-brand-muted">Approval Odds</span>
                     <span className={`font-bold flex items-center ${approvalProb > 80 ? 'text-brand-profit' : approvalProb > 40 ? 'text-brand-gold' : 'text-brand-loss'}`}>
                        {approvalProb > 80 ? <CheckCircle2 size={16} className="mr-1" /> : <ShieldAlert size={16} className="mr-1" />}
                        {approvalProb}%
                     </span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="w-full max-w-5xl">
            {banking.loans.length === 0 ? (
              <div className="text-center py-20 text-brand-muted bg-brand-card border border-black/10 rounded-xl">
                <FileDown size={48} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium mb-2">Debt Free!</h3>
                <p>You currently have no active loans.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {banking.loans.map(loan => (
                  <div key={loan.id} className="bg-brand-card border border-black/10 rounded-xl p-6">
                     <div className="flex justify-between items-start mb-4 border-b border-black/10 pb-4">
                        <div>
                           <h3 className="font-bold text-lg text-brand-text">{loan.type} Loan</h3>
                           <p className="text-xs text-brand-muted">ID: {loan.id.toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-sm text-brand-muted">Original Principal</p>
                           <p className="font-bold text-brand-text">{formatCurrency(loan.principal)}</p>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                           <p className="text-xs text-brand-muted">Remaining Balance</p>
                           <p className="text-xl font-bold text-brand-loss">{formatCurrency(loan.remainingBalance)}</p>
                        </div>
                        <div>
                           <p className="text-xs text-brand-muted">Monthly Payment</p>
                           <p className="text-xl font-bold text-brand-text">{formatCurrency(loan.monthlyPayment)}</p>
                        </div>
                        <div>
                           <p className="text-xs text-brand-muted">Interest Rate</p>
                           <p className="font-bold text-brand-muted">{(loan.interestRate * 100).toFixed(2)}% APR</p>
                        </div>
                        <div>
                           <p className="text-xs text-brand-muted">Progress</p>
                           <p className="font-bold text-brand-muted">{loan.monthsPaid} / {loan.termMonths} mo</p>
                        </div>
                     </div>

                     <div className="flex space-x-3">
                         <button 
                           onClick={() => payDownLoan(loan.id, loan.monthlyPayment * 5)}
                           disabled={player.cash < loan.monthlyPayment * 5}
                           className="flex-1 bg-brand-surface hover:bg-brand-surface disabled:opacity-50 text-brand-text py-2 rounded text-sm transition"
                         >
                            Pay Extra (5 mo)
                         </button>
                         <button 
                           onClick={() => payDownLoan(loan.id, loan.remainingBalance)}
                           disabled={player.cash < loan.remainingBalance}
                           className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-brand-surface disabled:text-brand-muted text-brand-text font-bold py-2 rounded text-sm transition"
                         >
                            Payoff Full
                         </button>
                     </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
