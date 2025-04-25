import { query, update } from "./storage";
import { Product } from "../features/products/types";
import { Scale } from "../features/rooms/types";
import * as D from "./defaults";

export function unitsOnScale(scale: Scale, prod: Product): number {
  if (
    scale.currentWeight == null ||
    prod.unitWeight <= 0 ||
    prod.crateWeight == null ||
    prod.unitsPerCrate == null
  )
    return 0;

  const w = scale.currentWeight;
  const fullCrateWeight =
    prod.crateWeight + prod.unitsPerCrate * prod.unitWeight;
  const crateCount = Math.floor(w / fullCrateWeight);
  const rem = w - crateCount * fullCrateWeight;
  const unitsWeight = rem - prod.crateWeight;
  const extraUnits =
    unitsWeight > 0 ? Math.round(unitsWeight / prod.unitWeight) : 0;

  return (
    crateCount * prod.unitsPerCrate + Math.min(extraUnits, prod.unitsPerCrate)
  );
}

export function recomputeProductQty(productId: string): void {
  const prod = query<Product>("products").find((p) => p.id === productId);
  if (!prod) return;

  const scales = query<Scale>("scales").filter(
    (s) => s.productId === productId
  );
  const qty = scales.reduce((sum, sc) => sum + unitsOnScale(sc, prod), 0);

  update<Product>("products", productId, {
    qty,
    low: qty <= (prod.threshold ?? D.DEFAULT_THRESHOLD),
  });
}
