import { insert } from "./storage";
import { Product } from "../features/products/types";
import { v4 as uuid } from "uuid";

export interface Alert {
  id: string;
  productId: string;
  roomId?: string;
  message: string;
  date: string;
}

export function generateAlertIfNeeded(prod: Product, roomId?: string) {
  const tone =
    prod.qty === 0
      ? "Out of stock"
      : prod.qty <= (prod.threshold ?? 10)
      ? "Low stock"
      : "";
  if (!tone) return;

  insert<Alert>("alerts", {
    id: uuid(),
    productId: prod.id,
    roomId,
    message: `${prod.name} – ${tone}`,
    date: new Date().toISOString(),
  });
}
