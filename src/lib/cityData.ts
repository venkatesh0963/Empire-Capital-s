export interface CityBuildingType {
  id: string;
  name: string;
  category: 'Commercial' | 'Industrial' | 'Municipal' | 'Landmark';
  icon: string;
  baseCost: number;
  monthlyRevenue: number;
  maintenanceCost: number;
  buildTimeDays: number;
  description: string;
}

export const CITY_BUILDINGS: CityBuildingType[] = [
  {
    id: 'b_office',
    name: 'Commercial Office Block',
    category: 'Commercial',
    icon: '🏢',
    baseCost: 8000000,
    monthlyRevenue: 120000,
    maintenanceCost: 15000,
    buildTimeDays: 60,
    description: 'A standard high-rise office block. Generates steady corporate rental yield.'
  },
  {
    id: 'b_factory',
    name: 'Industrial Factory',
    category: 'Industrial',
    icon: '🏭',
    baseCost: 15000000,
    monthlyRevenue: 280000,
    maintenanceCost: 40000,
    buildTimeDays: 90,
    description: 'Heavy industrial manufacturing plant. High yield but requires significant upkeep.'
  },
  {
    id: 'b_mall',
    name: 'Mega Shopping Mall',
    category: 'Commercial',
    icon: '🛍️',
    baseCost: 35000000,
    monthlyRevenue: 650000,
    maintenanceCost: 80000,
    buildTimeDays: 120,
    description: 'A sprawling retail paradise. Highly sensitive to economic booms and recessions.'
  },
  {
    id: 'b_hotel',
    name: 'Luxury Hotel',
    category: 'Commercial',
    icon: '🏨',
    baseCost: 50000000,
    monthlyRevenue: 950000,
    maintenanceCost: 150000,
    buildTimeDays: 150,
    description: 'A five-star luxury hotel in the heart of the city.'
  },
  {
    id: 'b_hospital',
    name: 'City Hospital',
    category: 'Municipal',
    icon: '🏥',
    baseCost: 120000000,
    monthlyRevenue: 1800000,
    maintenanceCost: 300000,
    buildTimeDays: 180,
    description: 'A state-of-the-art medical facility. Generates extremely stable, recession-proof revenue.'
  },
  {
    id: 'b_university',
    name: 'Private University',
    category: 'Municipal',
    icon: '🎓',
    baseCost: 250000000,
    monthlyRevenue: 4000000,
    maintenanceCost: 500000,
    buildTimeDays: 240,
    description: 'An elite academic institution. Boosts the global prestige of your empire.'
  },
  {
    id: 'b_stadium',
    name: 'Sports Stadium',
    category: 'Landmark',
    icon: '🏟️',
    baseCost: 600000000,
    monthlyRevenue: 8500000,
    maintenanceCost: 1000000,
    buildTimeDays: 300,
    description: 'A massive 80,000-seat arena for major sporting events and concerts.'
  },
  {
    id: 'b_airport',
    name: 'International Airport',
    category: 'Landmark',
    icon: '✈️',
    baseCost: 1500000000,
    monthlyRevenue: 22000000,
    maintenanceCost: 4500000,
    buildTimeDays: 365,
    description: 'A global transit hub. Yields monumental revenue but requires staggering capital to build.'
  },
  {
    id: 'b_financial_district',
    name: 'Financial District',
    category: 'Landmark',
    icon: '🏙️',
    baseCost: 5000000000,
    monthlyRevenue: 85000000,
    maintenanceCost: 12000000,
    buildTimeDays: 500,
    description: 'The ultimate megaproject. You now own the skyline.'
  }
];

export interface OwnedCityBuilding {
  id: string; // Unique instance ID
  typeId: string; // Refers to CityBuildingType.id
  status: 'Building' | 'Operational';
  daysUntilComplete: number;
}
