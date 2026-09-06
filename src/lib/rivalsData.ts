import { GameState } from '@/store/gameStore';

export interface MarketShareData {
  industry: string;
  totalMarketSize: number;
  playerRevenue: number;
  playerShare: number;
  competitors: { name: string; revenue: number; share: number; isLeader: boolean }[];
}

export function calculateEmpireWars(state: GameState): MarketShareData[] {
  // Define the core late-game industries for the "Empire Wars"
  const industries = ['Retail', 'Technology', 'Real Estate'];
  
  const wars: MarketShareData[] = [];

  // Calculate Player Revenue by Industry
  let playerRetailRev = 0;
  let playerTechRev = 0;
  let playerRealEstateRev = 0;

  (state.business.ownedBusinesses || []).forEach((biz: any) => {
     if (biz.industry === 'Retail') playerRetailRev += biz.lastMonthRevenue;
     if (biz.industry === 'Technology') playerTechRev += biz.lastMonthRevenue;
  });

  (state.realEstate.ownedProperties || []).forEach((prop: any) => {
     playerRealEstateRev += prop.monthlyRent * prop.occupancyRate;
  });
  
  // Include city builder properties
  const { CITY_BUILDINGS } = require('./cityData');
  (state.realEstate.cityBuildings || []).forEach((cb: any) => {
     if (cb.status === 'Operational') {
        const base = CITY_BUILDINGS.find((c: any) => c.id === cb.typeId);
        if (base) playerRealEstateRev += base.monthlyRevenue;
     }
  });

  industries.forEach(industry => {
     let playerRev = 0;
     if (industry === 'Retail') playerRev = playerRetailRev;
     if (industry === 'Technology') playerRev = playerTechRev;
     if (industry === 'Real Estate') playerRev = playerRealEstateRev;

     let totalMarketSize = playerRev;
     const compData: { name: string; revenue: number; share: number; isLeader: boolean }[] = [];

     // Add AI Competitors
     state.competitors.forEach((comp: any) => {
        let compRev = 0;
        
        // Very basic mock logic to assign their revenue to specific industries based on their strategy
        if (industry === 'Retail' && comp.holdings?.focusIndustry === 'Retail') {
           compRev = comp.monthlyRevenue * 0.8; 
        } else if (industry === 'Technology' && comp.holdings?.focusIndustry === 'Technology') {
           compRev = comp.monthlyRevenue * 0.9;
        } else if (industry === 'Real Estate' && comp.strategy === 'Real estate') {
           compRev = comp.monthlyRevenue * 0.95;
        } else {
           compRev = comp.monthlyRevenue * 0.1; // Baseline dabbling
        }

        totalMarketSize += compRev;
        compData.push({ name: comp.name, revenue: compRev, share: 0, isLeader: false });
     });

     // Base "Other Companies" market size to ensure player doesn't have 100% easily
     const otherCompaniesRev = 5000000; 
     totalMarketSize += otherCompaniesRev;
     compData.push({ name: 'Other Companies', revenue: otherCompaniesRev, share: 0, isLeader: false });

     // Calculate shares
     const playerShare = totalMarketSize > 0 ? (playerRev / totalMarketSize) * 100 : 0;
     
     compData.forEach(c => {
        c.share = totalMarketSize > 0 ? (c.revenue / totalMarketSize) * 100 : 0;
     });

     // Sort and determine leader
     compData.sort((a, b) => b.share - a.share);
     
     let highestShare = playerShare;
     compData.forEach(c => {
        if (c.share > highestShare) highestShare = c.share;
     });

     compData.forEach(c => { if (c.share === highestShare) c.isLeader = true; });
     const playerIsLeader = playerShare === highestShare && playerShare > 0;

     wars.push({
        industry,
        totalMarketSize,
        playerRevenue: playerRev,
        playerShare,
        competitors: compData.map(c => ({ ...c, isLeader: c.share === highestShare }))
     });
  });

  return wars;
}
