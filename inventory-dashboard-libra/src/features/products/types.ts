export interface Product {
  id: string;
  name: string;
  price: number;
  qty: number;
  unitWeight: number;
  crateWeight?: number;
  unitsPerCrate?: number;
  threshold?: number;
  onTheWay?: number;
  crateSize?: string;
  location?: string;
  img?: string;
  low: boolean;
  suppliers: string[];
  currency?: string;
}
