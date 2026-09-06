'use client';

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
    const sessionStarted = localStorage.getItem('hasStartedSession');
    if (sessionStarted) {
       setHasStarted(true);
    } else {
       setHasStarted(false);
    }
  }, []);

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
