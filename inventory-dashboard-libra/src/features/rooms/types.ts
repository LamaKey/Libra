export interface Room {
  id: string;
  name: string;
  location: string;
  alerts: number;
  scales: number;
  icon?: string;
}

export interface Scale {
  id: string;
  x: number;
  y: number;
  roomId: string;
  productId: string;
  currentWeight?: number;
  img?: string;
  alerts?: boolean;
}
