export type ExecutiveRole = 'CFO' | 'Sales Director' | 'Operations Manager' | 'CTO';

export interface Executive {
  id: string;
  name: string;
  role: ExecutiveRole;
  skills: {
    finance: number; // 1-5
    sales: number; // 1-5
    leadership: number; // 1-5
    tech: number; // 1-5
  };
  salary: number; // per month
  loyalty: number; // 0-100
  experienceYears: number;
}

const FIRST_NAMES = ['Sarah', 'Marcus', 'David', 'Elena', 'James', 'Aisha', 'Michael', 'Chloe', 'Robert', 'Wei', 'William', 'Priya', 'Daniel', 'Sophia', 'Alexander'];
const LAST_NAMES = ['Chen', 'Reed', 'Smith', 'Rodriguez', 'Johnson', 'Patel', 'Williams', 'Kim', 'Brown', 'Wang', 'Jones', 'Garcia', 'Miller', 'Davis', 'Taylor'];

export function generateRandomExecutive(role: ExecutiveRole): Executive {
  const name = `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`;
  const experienceYears = Math.floor(Math.random() * 20) + 2;
  
  // Base skills 1-3
  let skills = {
    finance: Math.floor(Math.random() * 3) + 1,
    sales: Math.floor(Math.random() * 3) + 1,
    leadership: Math.floor(Math.random() * 3) + 1,
    tech: Math.floor(Math.random() * 3) + 1,
  };

  // Boost primary skill based on role (3-5)
  if (role === 'CFO') skills.finance = Math.floor(Math.random() * 3) + 3;
  if (role === 'Sales Director') skills.sales = Math.floor(Math.random() * 3) + 3;
  if (role === 'Operations Manager') skills.leadership = Math.floor(Math.random() * 3) + 3;
  if (role === 'CTO') skills.tech = Math.floor(Math.random() * 3) + 3;

  // Calculate salary based on primary skills and experience
  const baseSalary = 5000;
  const skillBonus = (skills.finance + skills.sales + skills.leadership + skills.tech) * 500;
  const expBonus = experienceYears * 200;
  const salary = baseSalary + skillBonus + expBonus;

  return {
    id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    name,
    role,
    skills,
    salary,
    loyalty: Math.floor(Math.random() * 40) + 60, // 60-100
    experienceYears
  };
}
