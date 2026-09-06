'use client';

import React, { useState, useEffect } from 'react';
import { Home, LayoutDashboard, TrendingUp, Briefcase, Building, Landmark, Gem, Crown, Sparkles, Trophy, User, Building2, Globe, Swords, Rocket } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { Smartphone } from './Smartphone';
import { Smartphone as PhoneIcon } from 'lucide-react';

export function GameLayout({ children, currentView, setView }: { children: React.ReactNode, currentView: string, setView: (v: string) => void }) {
  const { time, player, togglePause, setSpeed, togglePhone, inbox, isPhoneOpen } = useGameStore();
  const unreadCount = inbox?.filter(e => !e.isRead).length || 0;
  
  const [showMillionaire, setShowMillionaire] = useState(false);
  const [showBillionaire, setShowBillionaire] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
     if (player.milestones?.millionaire && !localStorage.getItem('seenMillionaire')) {
        setShowMillionaire(true);
        localStorage.setItem('seenMillionaire', 'true');
     }
     if (player.milestones?.billionaire && !localStorage.getItem('seenBillionaire')) {
        setShowBillionaire(true);
        localStorage.setItem('seenBillionaire', 'true');
     }
  }, [player.milestones]);

  const navItems = [
    { id: 'dashboard', label: 'Go To Home', icon: Home },
    { id: 'startuplab', label: 'Startup Lab', icon: Rocket },
    { id: 'ventures', label: 'Acquisitions & PE', icon: Briefcase },
    { id: 'global', label: 'Global Expansion', icon: Globe },
    { id: 'bank', label: 'Banking & Debt', icon: Landmark },
    { id: 'exchanges', label: 'Exchanges & Markets', icon: TrendingUp },
    { id: 'alternative', label: 'Real Estate & Assets', icon: Building },
    { id: 'luxury', label: 'Luxury & Lifestyle', icon: Gem }, 
    { id: 'ceo', label: 'My Profile (CEO)', icon: User },
    { id: 'hq', label: 'Empire HQ', icon: Building2 },
    { id: 'rivals', label: 'Rivals & Empires', icon: Swords },
    { id: 'rankings', label: 'Global Rankings', icon: Trophy },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
  ];

  return (
    <div className="flex h-screen bg-brand-bg text-brand-text font-sans overflow-hidden relative">
      {/* Mobile Header */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-16 bg-brand-surface border-b border-black/5 z-50 flex items-center justify-between px-4">
         <h1 className="text-lg font-bold text-brand-text tracking-widest">EMPIRE CAPITAL'S</h1>
         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-brand-muted hover:text-brand-text">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
         </button>
      </div>
      
      {/* Ambient Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-profit/10 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand-blue/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
         <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] bg-brand-purple/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Sidebar - Premium Banking */}
      <aside className={`fixed inset-y-0 left-0 transform ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition duration-200 ease-in-out w-64 bg-brand-surface border-r border-black/5 flex flex-col z-40 shadow-2xl`}>
        <div className="p-6 border-b border-black/5 flex flex-col items-center text-center mt-2">
          
          {/* E Crown Logo */}
          <div className="relative w-16 h-16 mb-4">
             <div className="absolute inset-0 bg-gradient-to-br from-brand-gold to-brand-profit rounded-xl blur opacity-30 animate-pulse"></div>
             <div className="relative bg-brand-bg border border-brand-gold/30 rounded-xl w-full h-full flex items-center justify-center shadow-lg">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   {/* Upward Graph / Crown Peaks */}
                   <path d="M4 14L8 8L12 11L16 5L20 9" stroke="var(--color-brand-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                   <path d="M4 14L4 18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V9" stroke="var(--color-brand-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                   {/* Central E */}
                   <path d="M10 12H14M10 15H14M10 18H15" stroke="var(--color-brand-text)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
             </div>
          </div>
          
          <h1 className="text-xl font-bold text-brand-text tracking-[0.1em] leading-tight">
            EMPIRE<br/>CAPITAL'S
          </h1>
          <p className="text-brand-gold text-[10px] mt-2 uppercase tracking-[0.2em] font-semibold">Wealth Simulator</p>
        </div>
        
        {/* Status Indicator */}
        <div className="mx-4 mt-4 p-3 rounded-lg border border-black/5 bg-brand-bg flex justify-between items-center shadow-inner">
           <span className="flex items-center text-xs font-bold tracking-wider uppercase">
              <div className={`w-2 h-2 rounded-full mr-2 ${time.isPaused ? 'bg-brand-loss' : 'bg-brand-profit animate-pulse shadow-[0_0_5px_rgba(32,214,138,0.8)]'}`}></div> 
              <span className={time.isPaused ? 'text-brand-loss' : 'text-brand-profit'}>
                 {time.isPaused ? 'Closed' : 'Open'}
              </span>
           </span>
           <span className="text-xs font-bold text-brand-text">Y{time.year} • M{time.month}</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => { setView(item.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 text-left relative group overflow-hidden ${
                  isActive 
                    ? 'text-brand-gold bg-brand-card shadow-lg shadow-black/5 border border-brand-gold/10' 
                    : 'text-brand-muted hover:text-brand-text hover:bg-brand-card/50'
                }`}
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <div className="absolute left-0 top-0 w-1 h-full bg-brand-gold rounded-r-md shadow-[0_0_8px_rgba(245,196,81,0.8)]"></div>
                )}
                
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <item.icon size={18} className={`relative z-10 ${isActive ? 'drop-shadow-[0_0_8px_rgba(245,196,81,0.5)]' : ''}`} />
                <span className="font-medium text-sm relative z-10">{item.label}</span>
              </button>
            )
          })}
        </nav>
        <div className="p-4 border-t border-black/5 mt-auto bg-brand-surface z-20">
          <button 
             onClick={() => {
                localStorage.removeItem('hasStartedSession');
                window.location.reload();
             }} 
             className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-brand-muted hover:text-brand-text hover:bg-brand-card/50 transition-all font-bold text-xs uppercase tracking-wider border border-transparent hover:border-black/5"
          >
             <span>Go to Landing Page</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-brand-bg relative z-10">
        {children}
        
        {/* Milestone Overlays */}
        {showMillionaire && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-bg/80 backdrop-blur-md">
              <div className="bg-brand-surface border border-brand-gold/50 rounded-2xl p-10 max-w-md w-full text-center shadow-[0_0_50px_rgba(245,196,81,0.2)] animate-bounce-in">
                 <Sparkles className="w-20 h-20 text-brand-gold mx-auto mb-6 animate-pulse" />
                 <h2 className="text-4xl font-black text-brand-gold mb-2 tracking-widest">MILLIONAIRE</h2>
                 <h3 className="text-xl font-bold text-brand-text mb-6">ACHIEVED</h3>
                 <p className="text-3xl font-bold text-brand-profit mb-8">$1,000,000</p>
                 <p className="text-brand-muted mb-8">You have reached your first million. The world of high finance is now open to you. New opportunities await.</p>
                 <button onClick={() => setShowMillionaire(false)} className="w-full py-4 bg-brand-gold text-black font-bold rounded-xl hover:bg-yellow-400 transition text-lg shadow-[0_0_15px_rgba(245,196,81,0.4)]">
                    Continue Empire Building
                 </button>
              </div>
           </div>
        )}

        {showBillionaire && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-bg/90 backdrop-blur-xl">
              <div className="bg-brand-card border-2 border-brand-purple rounded-3xl p-12 max-w-xl w-full text-center shadow-[0_0_100px_rgba(155,108,255,0.4)] relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 animate-pulse"></div>
                 <Crown className="w-24 h-24 text-brand-purple mx-auto mb-6 relative z-10" />
                 <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-blue mb-2 tracking-widest relative z-10">BILLIONAIRE</h2>
                 <p className="text-4xl font-black text-brand-text mb-8 relative z-10">$1,000,000,000</p>
                 <p className="text-brand-muted mb-10 text-lg relative z-10">You have achieved the ultimate financial supremacy. You are a Titan of Industry. Your empire spans the globe.</p>
                 <button onClick={() => setShowBillionaire(false)} className="w-full py-4 bg-gradient-to-r from-brand-purple to-brand-blue text-brand-text font-black rounded-xl hover:opacity-90 transition text-xl relative z-10 shadow-[0_0_30px_rgba(155,108,255,0.6)]">
                    RULE THE WORLD
                 </button>
              </div>
           </div>
        )}
        {/* Interactive Event Modal */}
        {player.activeEvent && (
           <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md">
              <div className="bg-brand-card border border-brand-blue/30 rounded-2xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden animate-in zoom-in-95">
                 {/* Decorative background glow */}
                 <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-blue/20 rounded-full blur-3xl"></div>
                 
                 <div className="relative z-10">
                    <h2 className="text-2xl font-black text-brand-text mb-2 flex items-center">
                       <span className="w-3 h-3 rounded-full bg-brand-loss animate-pulse mr-3"></span>
                       DECISION REQUIRED
                    </h2>
                    <h3 className="text-xl font-bold text-brand-blue mb-4">{player.activeEvent.title}</h3>
                    <p className="text-brand-muted mb-8 text-base leading-relaxed">{player.activeEvent.description}</p>
                    
                    <div className="space-y-3">
                       {player.activeEvent.options.map(opt => (
                          <button 
                             key={opt.id}
                             onClick={() => {
                                useGameStore.getState().resolveEvent(opt.id);
                                if (time.isPaused) togglePause(); // Auto unpause if they respond
                             }}
                             className="w-full text-left p-4 rounded-xl border border-black/10 bg-brand-surface hover:border-brand-blue hover:bg-brand-blue/5 transition-all group"
                          >
                             <div className="font-semibold text-brand-text group-hover:text-brand-blue transition-colors">
                                {opt.label}
                             </div>
                          </button>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        )}

      </main>

      {/* Floating Smartphone Button */}
      <button 
         onClick={togglePhone}
         className={`fixed bottom-8 right-8 w-16 h-16 rounded-full bg-brand-blue text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40 ${isPhoneOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
         <PhoneIcon size={28} />
         {unreadCount > 0 && (
            <div className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold border-2 border-brand-bg animate-pulse">
               {unreadCount}
            </div>
         )}
      </button>

      <Smartphone />
    </div>
  );
}

