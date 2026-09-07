const fs = require('fs');
let text = fs.readFileSync('src/store/gameStore.ts', 'utf8');

const logic = `
        // --- LENDING PAYMENTS ---
        let updatedLendedLoans = [...(state.banking.lendedLoans || [])];
        let updatedLoanApps = [...(state.banking.loanApplications || [])];
        let lendedPayments = 0;
        let lendedDefaults = 0;

        if (day === 1) {
           updatedLendedLoans = updatedLendedLoans.map(loan => {
              if (loan.status !== 'active') return loan;
              
              // Default check
              const defaultChance = loan.interestRate > 0.15 ? 0.05 : 0.01;
              if (Math.random() < defaultChance) {
                 lendedDefaults += loan.remainingBalance;
                 news.unshift({ id: \`n_def_\${Date.now()}_\${loan.id}\`, date: \`Y\${year} M\${month}\`, headline: \`⚠️ Borrower Defaulted: \${loan.borrowerName} defaulted on their loan. You lost $\${loan.remainingBalance.toLocaleString()}.\`, type: 'negative' as const });
                 return { ...loan, status: 'defaulted' };
              }

              lendedPayments += loan.monthlyPayment;
              const newBalance = loan.remainingBalance - loan.monthlyPayment;
              
              if (newBalance <= 0) {
                 news.unshift({ id: \`n_poff_\${Date.now()}_\${loan.id}\`, date: \`Y\${year} M\${month}\`, headline: \`✅ Loan Paid Off: \${loan.borrowerName} successfully paid off their loan!\`, type: 'positive' as const });
                 return { ...loan, remainingBalance: 0, monthsPaid: loan.monthsPaid + 1, status: 'paid_off' };
              }
              
              return { ...loan, remainingBalance: newBalance, monthsPaid: loan.monthsPaid + 1 };
           });

           newCash += lendedPayments;
        }

        // expire old ones
        updatedLoanApps = updatedLoanApps.map(app => ({ ...app, expiresInDays: app.expiresInDays - 1 })).filter(app => app.expiresInDays > 0);
        
        // randomly add new ones
        if (Math.random() < 0.1 && updatedLoanApps.length < 5) {
           const names = ["Emily Chen", "Marcus Johnson", "TechNova Inc.", "Sarah Williams", "GreenScape Landscaping", "David Rodriguez", "Horizon Enterprises"];
           const purposes = ["Business Expansion", "Medical Bills", "Real Estate Investment", "Debt Consolidation", "Startup Capital"];
           const rName = names[Math.floor(Math.random() * names.length)];
           const rPurpose = purposes[Math.floor(Math.random() * purposes.length)];
           
           const isBusiness = rName.includes("Inc.") || rName.includes("Enterprises") || rName.includes("Landscaping");
           const credit = Math.floor(Math.random() * 350) + 450; // 450 - 800
           const amount = isBusiness ? (Math.floor(Math.random() * 10) + 1) * 50000 : (Math.floor(Math.random() * 10) + 1) * 5000;
           
           // Max rate they accept based on credit score
           const maxRate = credit > 750 ? 0.08 : credit > 650 ? 0.12 : credit > 550 ? 0.18 : 0.25;

           updatedLoanApps.push({
              id: \`app_\${Date.now()}_\${Math.random().toString(36).substr(2, 5)}\`,
              borrowerName: rName,
              purpose: rPurpose,
              creditScore: credit,
              requestedAmount: amount,
              termMonths: [12, 24, 36, 48, 60][Math.floor(Math.random() * 5)],
              maxInterestRate: maxRate,
              expiresInDays: Math.floor(Math.random() * 7) + 3
           });
        }
`;

text = text.replace('const updatedLoans = state.banking.loans.map(loan => {', logic + '\n        const updatedLoans = state.banking.loans.map(loan => {');
fs.writeFileSync('src/store/gameStore.ts', text);
console.log('Fixed advanceDay logic properly!');
