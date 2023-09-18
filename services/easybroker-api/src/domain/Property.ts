export class Property {
  agent: string;
  public_id: string;
  title: string;
  title_image_full: string;
  title_image_thumb: string;
  bedrooms: number;
  bathrooms: number;
  parking_spaces: number;
  location: string;
  property_type: string;
  updated_at: string;
  show_prices: boolean;
  share_commission: boolean;
  operations: SaleOrRentalWithCommission[] | TemporaryRental[];
  lot_size: number;
  construction_size: number;
}

class Operation {
  type: OperationType;
  amount: number;
  formatted_amount: string;
  currency: string;
}

class SaleOrRentalWithCommission extends Operation {
  unit: Unit;
  commission: Commision;
}

class TemporaryRental extends Operation {
  period: Period;
}

class Commision {
  type: CommissionType;
  value: number;
  currency: string;
}

type CommissionType = 'percentage' | 'months' | 'amount';
type Period = 'monthly' | 'weekly' | 'daily';
type OperationType = 'sale' | 'rental';
type Unit = 'total' | 'square_meter' | 'hectare';
