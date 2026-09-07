const fs = require('fs');
let text = fs.readFileSync('src/store/gameStore.ts', 'utf8');

const actionsInterface = `  approveLendLoan: (appId: string, interestRate: number) => { success: boolean; message: string };
  rejectLendLoan: (appId: string) => void;
  takeLoan: (amount: number, termYears: number, type: BankLoan['type']) => boolean;`;

text = text.replace("  takeLoan: (amount: number, termYears: number, type: BankLoan['type']) => boolean;", actionsInterface);

const actionsImpl = `      approveLendLoan: (appId, interestRate) => {
         const state = get();
         const app = state.banking.loanApplications?.find(a => a.id === appId);
         if (!app) return { success: false, message: 'Application not found' };
         if (state.player.cash < app.requestedAmount) return { success: false, message: 'Not enough cash to fund this loan' };
         if (interestRate > app.maxInterestRate) return { success: false, message: 'The borrower rejected your interest rate offer.' };

         const monthlyRate = interestRate / 12;
         const monthlyPayment = (app.requestedAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -app.termMonths));

         const newLoan = {
            id: \`lended_\${Math.random().toString(36).substr(2, 9)}\`,
            borrowerName: app.borrowerName,
            purpose: app.purpose,
            principal: app.requestedAmount,
            remainingBalance: app.requestedAmount,
            interestRate,
            monthlyPayment,
            termMonths: app.termMonths,
            monthsPaid: 0,
            status: 'active' as const
         };

         set(state => ({
            player: { ...state.player, cash: state.player.cash - app.requestedAmount },
            banking: {
               ...state.banking,
               lendedLoans: [...(state.banking.lendedLoans || []), newLoan],
               loanApplications: state.banking.loanApplications?.filter(a => a.id !== appId) || []
            }
         }));
         get().recalculateNetWorth();
         return { success: true, message: 'Loan funded successfully!' };
      },

      rejectLendLoan: (appId) => {
         set(state => ({
            banking: {
               ...state.banking,
               loanApplications: state.banking.loanApplications?.filter(a => a.id !== appId) || []
            }
         }));
      },

      takeLoan: (amount, termYears, type) => {`;

text = text.replace("      takeLoan: (amount, termYears, type) => {", actionsImpl);

fs.writeFileSync('src/store/gameStore.ts', text);
console.log('Fixed banking store actions!');
