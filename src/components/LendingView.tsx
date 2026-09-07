import React, { useState } from 'react';
import { HandCoins, UserCheck, AlertTriangle, CheckCircle2, TrendingUp, XCircle } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { formatCurrency } from '@/lib/utils';

export default function LendingView() {
  const { banking, approveLendLoan, rejectLendLoan, player } = useGameStore();
  const [activeTab, setActiveTab] = useState<'applications' | 'portfolio'>('applications');
  
  // Local state for proposed interest rates
  const [proposedRates, setProposedRates] = useState<Record<string, number>>({});

  const handleRateChange = (id: string, rate: number) => {
    setProposedRates(prev => ({ ...prev, [id]: rate }));
  };

  const handleApprove = (id: string) => {
    const rate = proposedRates[id] || 0.10; // Default 10%
    const result = approveLendLoan(id, rate);
    alert(result.message);
  };

  const handleReject = (id: string) => {
    rejectLendLoan(id);
  };

  const activeLended = banking.lendedLoans?.filter(l => l.status === 'active') || [];
  const pastLended = banking.lendedLoans?.filter(l => l.status !== 'active') || [];
  
  const totalLent = activeLended.reduce((acc, l) => acc + l.principal, 0);
  const totalExpectedReturn = activeLended.reduce((acc, l) => acc + (l.monthlyPayment * l.termMonths), 0);
  const totalMonthlyIncome = activeLended.reduce((acc, l) => acc + l.monthlyPayment, 0);

  return (
    <div className="flex flex-col h-full bg-brand-bg">
      <div className="p-6 border-b border-black/10 bg-brand-card flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-brand-text flex items-center">
            <HandCoins className="mr-3 text-brand-profit" /> Lending & Private Credit
          </h2>
          <p className="text-brand-muted">Act as a private lender. Offer loans to individuals and businesses for high yields.</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-brand-muted mb-1">Available Liquidity</div>
          <div className="text-xl font-bold text-brand-profit">{formatCurrency(player.cash)}</div>
        </div>
      </div>

      <div className="flex px-6 pt-4 border-b border-black/10">
        <button 
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-3 font-bold border-b-2 transition-colors ${activeTab === 'applications' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-brand-muted hover:text-brand-text'}`}
        >
          Pending Applications ({banking.loanApplications?.length || 0})
        </button>
        <button 
          onClick={() => setActiveTab('portfolio')}
          className={`px-4 py-3 font-bold border-b-2 transition-colors ${activeTab === 'portfolio' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-brand-muted hover:text-brand-text'}`}
        >
          Active Loans ({activeLended.length})
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'applications' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(banking.loanApplications || []).length === 0 ? (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-black/10 rounded-xl bg-brand-surface">
                <AlertTriangle size={48} className="mx-auto text-brand-muted mb-4" />
                <h3 className="text-lg font-bold text-brand-text mb-2">No Applications Right Now</h3>
                <p className="text-brand-muted">Check back later. As time passes, borrowers will come to you looking for capital.</p>
              </div>
            ) : (
              (banking.loanApplications || []).map(app => {
                const currentRate = proposedRates[app.id] || 0.10;
                const monthlyRate = currentRate / 12;
                const monthlyPayment = (app.requestedAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -app.termMonths));
                const totalReturn = monthlyPayment * app.termMonths;
                const profit = totalReturn - app.requestedAmount;

                return (
                  <div key={app.id} className="bg-brand-card border border-black/10 rounded-xl p-6 flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 right-0 bg-brand-surface px-3 py-1 rounded-bl-lg border-b border-l border-black/10 text-xs font-bold text-brand-muted">
                      Expires in {app.expiresInDays}d
                    </div>
                    
                    <div className="flex items-start justify-between mb-4 mt-2">
                      <div>
                        <h3 className="font-bold text-brand-text text-lg">{app.borrowerName}</h3>
                        <div className="text-xs text-brand-muted flex items-center mt-1">
                          <UserCheck size={12} className="mr-1" /> FICO: 
                          <span className={`ml-1 font-bold ${app.creditScore >= 700 ? 'text-brand-profit' : app.creditScore >= 600 ? 'text-brand-gold' : 'text-brand-loss'}`}>
                            {app.creditScore}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 text-sm">
                      <span className="text-brand-muted block text-xs uppercase tracking-wider mb-1">Purpose</span>
                      <span className="text-brand-text font-medium">{app.purpose}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-black/10">
                      <div>
                        <span className="text-brand-muted block text-xs uppercase tracking-wider mb-1">Requested</span>
                        <span className="text-brand-text font-bold text-lg">{formatCurrency(app.requestedAmount)}</span>
                      </div>
                      <div>
                        <span className="text-brand-muted block text-xs uppercase tracking-wider mb-1">Term</span>
                        <span className="text-brand-text font-bold text-lg">{app.termMonths} Months</span>
                      </div>
                    </div>

                    <div className="mb-6 flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-brand-muted text-sm font-bold">Offer Interest Rate</span>
                        <span className="text-brand-primary font-bold">{(currentRate * 100).toFixed(1)}% APR</span>
                      </div>
                      <input 
                        type="range" min="0.05" max="0.30" step="0.01"
                        value={currentRate}
                        onChange={(e) => handleRateChange(app.id, Number(e.target.value))}
                        className="w-full accent-brand-primary"
                      />
                      
                      <div className="grid grid-cols-2 gap-2 mt-4 text-sm bg-brand-surface p-3 rounded-lg border border-black/5">
                         <div>
                            <span className="text-brand-muted text-xs block">Monthly Est.</span>
                            <span className="font-bold text-brand-profit">{formatCurrency(monthlyPayment)}</span>
                         </div>
                         <div>
                            <span className="text-brand-muted text-xs block">Total Profit</span>
                            <span className="font-bold text-brand-profit">+{formatCurrency(profit)}</span>
                         </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-auto">
                      <button 
                        onClick={() => handleReject(app.id)}
                        className="py-3 px-4 rounded-lg font-bold border border-black/10 text-brand-muted hover:bg-brand-surface hover:text-brand-loss transition-colors flex items-center justify-center"
                      >
                        <XCircle size={18} className="mr-2" /> Reject
                      </button>
                      <button 
                        onClick={() => handleApprove(app.id)}
                        disabled={player.cash < app.requestedAmount}
                        className="py-3 px-4 rounded-lg font-bold bg-brand-primary text-white hover:bg-opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center"
                      >
                        <CheckCircle2 size={18} className="mr-2" /> Fund
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-brand-card p-6 rounded-xl border border-black/10 flex items-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center mr-4">
                  <HandCoins size={24} className="text-brand-primary" />
                </div>
                <div>
                  <div className="text-brand-muted text-sm font-bold uppercase tracking-wider mb-1">Total Lent Out</div>
                  <div className="text-2xl font-black text-brand-text">{formatCurrency(totalLent)}</div>
                </div>
              </div>

              <div className="bg-brand-card p-6 rounded-xl border border-black/10 flex items-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mr-4">
                  <TrendingUp size={24} className="text-emerald-600" />
                </div>
                <div>
                  <div className="text-brand-muted text-sm font-bold uppercase tracking-wider mb-1">Monthly Income</div>
                  <div className="text-2xl font-black text-brand-profit">+{formatCurrency(totalMonthlyIncome)}</div>
                </div>
              </div>

              <div className="bg-brand-card p-6 rounded-xl border border-black/10 flex items-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center mr-4">
                  <AlertTriangle size={24} className="text-brand-gold" />
                </div>
                <div>
                  <div className="text-brand-muted text-sm font-bold uppercase tracking-wider mb-1">Default Rate</div>
                  <div className="text-2xl font-black text-brand-text">
                    {pastLended.length > 0 ? ((pastLended.filter(l => l.status === 'defaulted').length / pastLended.length) * 100).toFixed(1) : '0.0'}%
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-brand-card border border-black/10 rounded-xl overflow-hidden shadow-sm">
               <div className="px-6 py-4 border-b border-black/10 bg-brand-surface">
                 <h3 className="font-bold text-brand-text">Active Lended Loans</h3>
               </div>
               
               {activeLended.length === 0 ? (
                  <div className="p-8 text-center text-brand-muted">You have no active loans right now. Head over to Applications to lend money.</div>
               ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-brand-surface/50 border-b border-black/5">
                          <th className="p-4 font-bold text-brand-muted text-xs uppercase tracking-wider">Borrower</th>
                          <th className="p-4 font-bold text-brand-muted text-xs uppercase tracking-wider">Rate</th>
                          <th className="p-4 font-bold text-brand-muted text-xs uppercase tracking-wider">Remaining</th>
                          <th className="p-4 font-bold text-brand-muted text-xs uppercase tracking-wider">Monthly Payment</th>
                          <th className="p-4 font-bold text-brand-muted text-xs uppercase tracking-wider">Progress</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeLended.map(loan => (
                          <tr key={loan.id} className="border-b border-black/5 hover:bg-black/[0.02] transition-colors">
                            <td className="p-4">
                               <div className="font-bold text-brand-text">{loan.borrowerName}</div>
                               <div className="text-xs text-brand-muted mt-1">{loan.purpose}</div>
                            </td>
                            <td className="p-4 font-medium text-brand-text">{(loan.interestRate * 100).toFixed(1)}%</td>
                            <td className="p-4 font-bold text-brand-text">{formatCurrency(loan.remainingBalance)}</td>
                            <td className="p-4 font-bold text-brand-profit">+{formatCurrency(loan.monthlyPayment)}</td>
                            <td className="p-4">
                               <div className="flex items-center">
                                  <div className="w-full bg-brand-surface rounded-full h-2 mr-2 border border-black/5">
                                    <div className="bg-brand-primary h-2 rounded-full" style={{ width: `${(loan.monthsPaid / loan.termMonths) * 100}%` }}></div>
                                  </div>
                                  <span className="text-xs font-bold text-brand-muted w-10">{loan.monthsPaid}/{loan.termMonths}</span>
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               )}
            </div>
            
            {pastLended.length > 0 && (
               <div className="bg-brand-card border border-black/10 rounded-xl overflow-hidden shadow-sm opacity-70">
                 <div className="px-6 py-4 border-b border-black/10 bg-brand-surface">
                   <h3 className="font-bold text-brand-text">Past Loans</h3>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-brand-surface/50 border-b border-black/5">
                          <th className="p-4 font-bold text-brand-muted text-xs uppercase tracking-wider">Borrower</th>
                          <th className="p-4 font-bold text-brand-muted text-xs uppercase tracking-wider">Principal</th>
                          <th className="p-4 font-bold text-brand-muted text-xs uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pastLended.map(loan => (
                          <tr key={loan.id} className="border-b border-black/5">
                            <td className="p-4 font-bold text-brand-text">{loan.borrowerName}</td>
                            <td className="p-4 font-medium text-brand-text">{formatCurrency(loan.principal)}</td>
                            <td className="p-4">
                               {loan.status === 'paid_off' ? (
                                  <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold uppercase">Paid Off</span>
                               ) : (
                                  <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-bold uppercase">Defaulted</span>
                               )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
