export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  img?: string;
  /* product field removed to break circular dependency */
}
