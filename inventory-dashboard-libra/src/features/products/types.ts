export interface Product {
  id   : string;
  name : string;
  price: number;

  /** live stock – kept up-to-date by utils/stock.ts */
  qty  : number;

  /* calibration data */
  unitWeight    : number;      // g
  crateWeight?  : number;      // g
  unitsPerCrate?: number;
  threshold?    : number;
  onTheWay?     : number;

  crateSize?    : string;      // descriptive

  location?: string;           // branch id
  img?: string;
  low : boolean;
  suppliers: string[];
  currency?: string;
}
