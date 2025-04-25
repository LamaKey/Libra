export interface Order {
    id: string;
    product: string;
    supplier: string;
    qty: number;
    value: number;
    currency: string;
    delivery: string;   // ISO
  }
  