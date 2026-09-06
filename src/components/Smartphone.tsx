import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Mail, Wallet, X, User, ChevronLeft, Building2, TrendingUp, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export function Smartphone() {
  const { isPhoneOpen, togglePhone, inbox, markEmailRead, player } = useGameStore();
  const [activeApp, setActiveApp] = useState<'home' | 'mail' | 'wallet'>('home');
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  if (!isPhoneOpen) return null;

  const unreadCount = inbox.filter(e => !e.isRead).length;

  const openEmail = (id: string) => {
     markEmailRead(id);
     setSelectedEmail(id);
  };

  const renderHome = () => (
     <div className="grid grid-cols-4 gap-4 p-6">
        {/* Mail App */}
        <div className="flex flex-col items-center">
           <button 
              onClick={() => setActiveApp('mail')}
              className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg relative hover:scale-105 transition-transform"
           >
              <Mail size={24} />
              {unreadCount > 0 && (
                 <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-brand-card">
                    {unreadCount}
                 </div>
              )}
           </button>
           <span className="text-[10px] font-medium text-brand-text mt-2">Mail</span>
        </div>

        {/* Wallet App */}
        <div className="flex flex-col items-center">
           <button 
              onClick={() => setActiveApp('wallet')}
              className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
           >
              <Wallet size={24} />
           </button>
           <span className="text-[10px] font-medium text-brand-text mt-2">Wallet</span>
        </div>

        {/* Dummy Apps for aesthetic */}
        <div className="flex flex-col items-center opacity-50">
           <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <TrendingUp size={24} />
           </div>
           <span className="text-[10px] font-medium text-brand-text mt-2">Stocks</span>
        </div>
        <div className="flex flex-col items-center opacity-50">
           <div className="w-14 h-14 bg-brand-gold rounded-2xl flex items-center justify-center text-brand-bg shadow-lg">
              <Building2 size={24} />
           </div>
           <span className="text-[10px] font-medium text-brand-text mt-2">Real Estate</span>
        </div>
     </div>
  );

  const renderMail = () => {
     if (selectedEmail) {
        const email = inbox.find(e => e.id === selectedEmail);
        if (!email) return null;
        
        return (
           <div className="flex flex-col h-full bg-brand-bg">
              <div className="flex items-center p-4 border-b border-black/5 bg-brand-surface">
                 <button onClick={() => setSelectedEmail(null)} className="mr-3 text-brand-blue hover:opacity-70"><ChevronLeft size={24} /></button>
                 <h2 className="font-bold">Inbox</h2>
              </div>
              <div className="p-5 flex-1 overflow-y-auto">
                 <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center text-brand-blue mr-3 font-bold text-lg">
                       {email.sender.charAt(0)}
                    </div>
                    <div>
                       <div className="font-bold text-brand-text">{email.sender}</div>
                       <div className="text-xs text-brand-muted">{email.date}</div>
                    </div>
                 </div>
                 <h3 className="font-black text-xl mb-4">{email.subject}</h3>
                 <p className="text-brand-text leading-relaxed whitespace-pre-wrap">{email.body}</p>
              </div>
           </div>
        );
     }

     return (
        <div className="flex flex-col h-full bg-brand-bg">
           <div className="p-4 border-b border-black/5 bg-brand-surface sticky top-0 flex justify-between items-center z-10">
              <button onClick={() => setActiveApp('home')} className="text-brand-blue hover:opacity-70"><ChevronLeft size={24} /></button>
              <h2 className="font-bold">Mail</h2>
              <div className="w-6"></div> {/* spacer */}
           </div>
           <div className="flex-1 overflow-y-auto">
              {inbox.length === 0 ? (
                 <div className="p-8 text-center text-brand-muted text-sm">No messages.</div>
              ) : (
                 inbox.map(email => (
                    <div 
                       key={email.id} 
                       onClick={() => openEmail(email.id)}
                       className={`p-4 border-b border-black/5 cursor-pointer hover:bg-black/5 flex items-start transition-colors ${!email.isRead ? 'bg-brand-blue/5' : ''}`}
                    >
                       {!email.isRead && <div className="w-2 h-2 rounded-full bg-brand-blue mt-1.5 mr-3 flex-shrink-0"></div>}
                       <div className={`flex-1 ${!email.isRead ? 'ml-0' : 'ml-5'}`}>
                          <div className="flex justify-between items-baseline mb-1">
                             <div className={`font-bold ${!email.isRead ? 'text-brand-text' : 'text-brand-text/80'}`}>{email.sender}</div>
                             <div className="text-[10px] text-brand-muted">{email.date}</div>
                          </div>
                          <div className={`text-sm mb-1 ${!email.isRead ? 'font-bold text-brand-text' : 'text-brand-text/70'}`}>{email.subject}</div>
                          <div className="text-xs text-brand-muted truncate">{email.body}</div>
                       </div>
                    </div>
                 ))
              )}
           </div>
        </div>
     );
  };

  const renderWallet = () => (
     <div className="flex flex-col h-full bg-brand-bg">
        <div className="p-4 border-b border-black/5 bg-brand-surface sticky top-0 flex justify-between items-center">
           <button onClick={() => setActiveApp('home')} className="text-brand-blue hover:opacity-70"><ChevronLeft size={24} /></button>
           <h2 className="font-bold">Wallet</h2>
           <div className="w-6"></div>
        </div>
        <div className="p-6 flex-1">
           <div className="bg-gradient-to-br from-brand-blue to-blue-700 rounded-2xl p-6 text-white shadow-xl mb-6 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10"><DollarSign size={100}/></div>
              <div className="text-white/80 text-sm font-medium mb-1">Personal Cash Balance</div>
              <div className="text-3xl font-black font-mono mb-4">{formatCurrency(player.cash)}</div>
              
              <div className="text-white/80 text-sm font-medium mb-1">Credit Score</div>
              <div className="text-xl font-bold">{player.creditScore}</div>
           </div>

           <div className="bg-brand-surface border border-black/5 rounded-xl p-4">
              <div className="text-brand-muted text-xs font-bold uppercase tracking-wider mb-2">Total Net Worth</div>
              <div className="text-2xl font-black text-brand-text">{formatCurrency(player.netWorth)}</div>
           </div>
        </div>
     </div>
  );

  return (
    <>
       {/* Backdrop to close phone */}
       <div className="fixed inset-0 z-40" onClick={togglePhone}></div>
       
       {/* Phone Frame */}
       <div className="fixed bottom-24 right-8 w-80 h-[600px] bg-black rounded-[40px] shadow-2xl z-50 p-2 animate-in slide-in-from-bottom-8 fade-in duration-300">
          <div className="w-full h-full bg-[#f2f2f7] rounded-[32px] overflow-hidden relative flex flex-col">
             
             {/* Notch */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20"></div>

             {/* Status Bar */}
             <div className="h-10 w-full flex justify-between items-center px-6 text-xs font-bold text-black z-10 pt-2">
                <span>9:41</span>
                <div className="flex space-x-1">
                   <div className="w-1 h-2 bg-black rounded-sm"></div>
                   <div className="w-1 h-2.5 bg-black rounded-sm"></div>
                   <div className="w-1 h-3 bg-black rounded-sm"></div>
                   <div className="w-1 h-3.5 bg-black/30 rounded-sm"></div>
                </div>
             </div>

             {/* Screen Content */}
             <div className="flex-1 overflow-hidden relative">
                {activeApp === 'home' && renderHome()}
                {activeApp === 'mail' && renderMail()}
                {activeApp === 'wallet' && renderWallet()}
             </div>
             
             {/* Home Indicator */}
             <div className="h-6 w-full flex justify-center items-center bg-transparent z-10 absolute bottom-0">
                <div 
                   className="w-1/3 h-1 bg-black rounded-full cursor-pointer hover:h-1.5 transition-all"
                   onClick={() => { setActiveApp('home'); setSelectedEmail(null); }}
                ></div>
             </div>
          </div>
       </div>
    </>
  );
}
