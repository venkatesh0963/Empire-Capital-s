const fs = require('fs');
let text = fs.readFileSync('src/store/gameStore.ts', 'utf8');

const newTypes = `export interface LendedLoan {
  id: string;
  borrowerName: string;
  purpose: string;
  principal: number;
  remainingBalance: number;
  interestRate: number;
  monthlyPayment: number;
  termMonths: number;
  monthsPaid: number;
  status: 'active' | 'defaulted' | 'paid_off';
}

export interface LoanApplication {
  id: string;
  borrowerName: string;
  creditScore: number;
  purpose: string;
  requestedAmount: number;
  termMonths: number;
  maxInterestRate: number;
  expiresInDays: number;
}`;

text = text.replace('interface BankingState {\r\n  loans: BankLoan[];\r\n}', newTypes + '\r\n\r\ninterface BankingState {\r\n  loans: BankLoan[];\r\n  lendedLoans: LendedLoan[];\r\n  loanApplications: LoanApplication[];\r\n}');
text = text.replace('interface BankingState {\n  loans: BankLoan[];\n}', newTypes + '\n\ninterface BankingState {\n  loans: BankLoan[];\n  lendedLoans: LendedLoan[];\n  loanApplications: LoanApplication[];\n}');

// Update initial states
text = text.replace(/banking: \{ loans: \[\] \}/g, 'banking: { loans: [], lendedLoans: [], loanApplications: [] }');
text = text.replace(/banking: \{ loans: \[\] \},/g, 'banking: { loans: [], lendedLoans: [], loanApplications: [] },');

fs.writeFileSync('src/store/gameStore.ts', text);
console.log('Fixed banking store types!');
