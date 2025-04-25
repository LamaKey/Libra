export interface Room {
  id: string;
  name: string;
  location: string;  // branch id
  alerts: number;
  scales: number;
  icon?: string;
}

export interface Scale {
  id: string;
  /* free-hand position inside the room */
  x: number;
  y: number;
  /* room the scale sits in */
  roomId: string;
  /* product weighed by this scale */
  productId: string;

  /* NEW – live reading (grams) */
  currentWeight?: number;

  /* optional thumbnail */
  img?: string;
  alerts?: boolean;
}
