import sys
with open('Dashboard.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's add playerStartups into the calculation
startup_calc_marker = """  let startupValue = 0;
  (portfolio.startups || []).forEach(su => {
      if (su.status === 'Active') startupValue += su.investedAmount;
  });"""

startup_calc_injection = """  let startupValue = 0;
  let playerStartupValue = 0;
  let playerStartupCount = 0;
  const { founder } = useGameStore();
  (portfolio.startups || []).forEach(su => {
      if (su.status === 'Active') startupValue += su.investedAmount;
  });
  (founder?.playerStartups || []).forEach(su => {
      playerStartupValue += su.valuation;
      playerStartupCount++;
  });"""

text = text.replace(startup_calc_marker, startup_calc_injection)

# Update BreakdownCard for Ventures
ventures_marker = "<BreakdownCard title=\"Ventures\" value={bizValue + startupValue} subtext={`${business.ownedBusinesses.length} Biz | ${(portfolio.startups || []).filter(s=>s.status==='Active').length} Startups`} />"
ventures_injection = "<BreakdownCard title=\"Ventures\" value={bizValue + startupValue + playerStartupValue} subtext={`${business.ownedBusinesses.length} Biz | ${playerStartupCount} Founded | ${(portfolio.startups || []).filter(s=>s.status==='Active').length} Angel`} />"

text = text.replace(ventures_marker, ventures_injection)

with open('Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated Dashboard with playerStartups!")
