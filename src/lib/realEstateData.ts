export type PropertyType = 'Apartment' | 'House' | 'Luxury Villa' | 'Retail Shop' | 'Office Space' | 'Warehouse';

export interface PropertyListing {
  id: string;
  name: string;
  type: PropertyType;
  price: number;
  monthlyRent: number;
  maintenanceCost: number;
  propertyTax: number;
  location: string;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Needs Work';
}

export interface OwnedProperty extends PropertyListing {
  purchasePrice: number;
  purchaseDate: string; // "Year X, Month Y"
  occupancyRate: number; // 0.0 to 1.0
  mortgage?: {
    principal: number;
    interestRate: number;
    monthlyPayment: number;
    remainingBalance: number;
  };
}

const LOCATIONS = ['Downtown', 'Suburbs', 'Uptown', 'Industrial District', 'Financial District', 'Riverside'];

export function generateRandomProperty(): PropertyListing {
  const typeRoll = Math.random();
  let type: PropertyType = 'Apartment';
  let basePrice = 100000;
  
  if (typeRoll > 0.9) { type = 'Luxury Villa'; basePrice = 1500000; }
  else if (typeRoll > 0.8) { type = 'Office Space'; basePrice = 800000; }
  else if (typeRoll > 0.6) { type = 'Warehouse'; basePrice = 500000; }
  else if (typeRoll > 0.4) { type = 'Retail Shop'; basePrice = 300000; }
  else if (typeRoll > 0.2) { type = 'House'; basePrice = 250000; }
  
  // Randomize price +/- 20%
  const price = Math.round(basePrice * (0.8 + Math.random() * 0.4));
  
  // Rent is typically 0.5% - 1% of property value per month
  const rentMultiplier = 0.005 + (Math.random() * 0.005);
  const monthlyRent = Math.round(price * rentMultiplier);
  
  // Maintenance is usually 10-20% of rent
  const maintenanceCost = Math.round(monthlyRent * (0.1 + Math.random() * 0.1));
  
  // Tax is roughly 1-2% of value annually (divided by 12)
  const propertyTax = Math.round((price * (0.01 + Math.random() * 0.01)) / 12);
  
  const conditions: PropertyListing['condition'][] = ['Excellent', 'Good', 'Fair', 'Needs Work'];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  
  const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  
  return {
    id: `prop_${Math.random().toString(36).substr(2, 9)}`,
    name: `${location} ${type}`,
    type,
    price,
    monthlyRent,
    maintenanceCost,
    propertyTax,
    location,
    condition
  };
}
