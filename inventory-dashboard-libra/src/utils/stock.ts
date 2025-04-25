import { query, update }      from './storage';
import { Product }            from '../features/products/types';
import { Scale }              from '../features/rooms/types';
import * as D                 from './defaults';
import { generateAlertIfNeeded } from './alerts';

/** how many units one scale is currently holding,
 *  capped at your calibrated per-crate maximum */
export function unitsOnScale(scale: Scale, prod: Product): number {
    if (
      scale.currentWeight == null ||
      prod.unitWeight   <= 0    ||
      prod.crateWeight  == null ||
      prod.unitsPerCrate == null
    ) return 0;
  
    const w = scale.currentWeight;
  
    // 1) weight of one fully loaded crate:
    const fullCrateWeight = prod.crateWeight + prod.unitsPerCrate * prod.unitWeight;
  
    // 2) how many _whole_ crates fit?
    const crateCount = Math.floor(w / fullCrateWeight);
  
    // 3) leftover weight after removing all those full crates:
    const rem = w - crateCount * fullCrateWeight;
  
    // 4) from the remainder we subtract one empty crate
    //    (because you always have an empty crate shell before you start counting units):
    const unitsWeight = rem - prod.crateWeight;
  
    // 5) how many additional units in that partial crate?
    const extraUnits = unitsWeight > 0
      ? Math.floor(unitsWeight / prod.unitWeight)
      : 0;
  
    // 6) total units = full crates × max units plus any extras
    return crateCount * prod.unitsPerCrate + Math.min(extraUnits, prod.unitsPerCrate);
  }
  
/** re-calculate product.qty across all its scales,
 *  and flag low-stock if below threshold */
export function recomputeProductQty(productId: string): void {
  const prod   = query<Product>('products').find(p => p.id === productId);
  if (!prod) return;

  const scales = query<Scale>('scales').filter(s => s.productId === productId);
  const qty    = scales.reduce((sum, sc) => sum + unitsOnScale(sc, prod), 0);

  update<Product>('products', productId, {
    qty,
    low: qty <= (prod.threshold ?? D.DEFAULT_THRESHOLD)
  });
}
