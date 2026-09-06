import sys

landing_code = """import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';

export function LandingPage({ onStart }: { onStart: () => void }) {
  const { player, updateProfile } = useGameStore();
  const [name, setName] = useState('');
  const [age, setAge] = useState(22);

  const handleStart = () => {
    if (!name.trim()) return alert('Please enter your character name.');
    updateProfile({ ...player.profile, name: name.trim(), age });
    onStart();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white overflow-hidden relative font-sans">
      
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/20 rounded-full blur-[128px] animate-pulse"></div>
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-profit/10 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '2s' }}></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg p-8">
        
        {/* Title Logo */}
        <div className="text-center mb-12 transform hover:scale-105 transition-transform duration-700">
           <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-gold to-brand-profit mb-6 shadow-[0_0_40px_rgba(245,196,81,0.4)] relative">
              <div className="absolute inset-1 bg-[#0a0a0a] rounded-2xl flex items-center justify-center">
                 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 14L8 8L12 11L16 5L20 9" stroke="var(--color-brand-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 14L4 18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V9" stroke="var(--color-brand-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 12H14M10 15H14M10 18H15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                 </svg>
              </div>
           </div>
           <h1 className="text-5xl font-black tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2">
              EMPIRE<br/>CAPITAL
           </h1>
           <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-bold">The Ultimate Wealth Simulator</p>
        </div>

        {/* Character Creation Form */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
           <h2 className="text-xl font-bold mb-6 text-center text-gray-200">Establish Your Legacy</h2>
           
           <div className="space-y-5">
              <div>
                 <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Character Name</label>
                 <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Richard Hendricks"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-lg font-bold text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                 />
              </div>

              <div>
                 <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex justify-between">
                    <span>Starting Age</span>
                    <span className="text-brand-gold">{age} Years Old</span>
                 </label>
                 <input 
                    type="range" 
                    min="18" 
                    max="50" 
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full accent-brand-gold h-2 bg-black/50 rounded-lg appearance-none cursor-pointer"
                 />
              </div>

              <div className="pt-4">
                 <button 
                    onClick={handleStart}
                    className="w-full relative group overflow-hidden rounded-xl bg-brand-gold text-black font-black text-lg py-4 transition-transform hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(245,196,81,0.3)] hover:shadow-[0_0_30px_rgba(245,196,81,0.6)]"
                 >
                    <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-12"></div>
                    <span className="relative flex items-center justify-center">
                       START JOURNEY
                       <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </span>
                 </button>
              </div>
           </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-8 font-medium">
           You have been granted $100,000 in seed capital.<br/>Build a business empire, manipulate markets, and conquer the globe.
        </p>

      </div>
    </div>
  );
}
"""

with open('src/components/LandingPage.tsx', 'w', encoding='utf-8') as f:
    f.write(landing_code)


page_code = """'use client';

import { useState, useEffect } from 'react';
import { GameEngine } from '@/components/GameEngine';
import { Dashboard } from '@/components/Dashboard';
import { GameLayout } from '@/components/Layout';
import { ExchangesView } from '@/components/ExchangesView';
import { VenturesView } from '@/components/VenturesView';
import { AlternativeView } from '@/components/AlternativeView';
import { LuxuryView } from '@/components/LuxuryView';
import { Bank } from '@/components/Bank';
import { AchievementsView } from '@/components/AchievementsView';
import { CEOView } from '@/components/CEOView';
import { HQView } from '@/components/HQView';
import { GlobalView } from '@/components/GlobalView';
import { RankingsView } from '@/components/RankingsView';
import { RivalsView } from '@/components/RivalsView';
import { StartupLabView } from '@/components/StartupLabView';
import { LandingPage } from '@/components/LandingPage';
import { useGameStore } from '@/store/gameStore';

export default function Home() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [hasStarted, setHasStarted] = useState<boolean | null>(null);
  const { player, time } = useGameStore();

  useEffect(() => {
    // If it's literally Day 1 Year 1 with base cash and default name, treat as new game
    const isNewGame = time.year === 1 && time.month === 1 && time.day === 1 && player.cash === 100000 && player.profile.name === 'The Founder';
    
    // Check local storage to see if they specifically already clicked start once
    const sessionStarted = localStorage.getItem('hasStartedSession');
    
    if (!isNewGame || sessionStarted) {
       setHasStarted(true);
    } else {
       setHasStarted(false);
    }
  }, [time.year, time.month, time.day, player.cash, player.profile.name]);

  const handleStartGame = () => {
    localStorage.setItem('hasStartedSession', 'true');
    useGameStore.getState().togglePause(); // Unpause the game when starting
    setHasStarted(true);
  };

  // Prevent hydration mismatch flashes by not rendering until mounted
  if (hasStarted === null) return null;

  if (!hasStarted) {
     return <LandingPage onStart={handleStartGame} />;
  }

  return (
    <>
      <GameEngine />
      <GameLayout currentView={currentView} setView={setCurrentView}>
        {currentView === 'ceo' && <CEOView />}
        {currentView === 'hq' && <HQView />}
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'global' && <GlobalView />}
        {currentView === 'rankings' && <RankingsView />}
        {currentView === 'rivals' && <RivalsView />}
        {currentView === 'exchanges' && <ExchangesView />}
        {currentView === 'startuplab' && <StartupLabView />}
        {currentView === 'ventures' && <VenturesView />}
        {currentView === 'alternative' && <AlternativeView />}
        {currentView === 'luxury' && <LuxuryView />}
        {currentView === 'bank' && <Bank />}
        {currentView === 'achievements' && <AchievementsView />}
      </GameLayout>
    </>
  );
}
"""

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(page_code)

print("Created LandingPage and updated page.tsx")
