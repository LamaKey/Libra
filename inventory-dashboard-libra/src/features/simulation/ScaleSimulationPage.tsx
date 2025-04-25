import React, { useState }             from 'react';
import TableToolbar                    from '../../components/TableToolbar';
import PaginatedTable                  from '../../components/PaginatedTable';
import { query, update }               from '../../utils/storage';
import { Scale, Room }                 from '../rooms/types';
import { Product }                     from '../products/types';
import { recomputeProductQty, unitsOnScale } from '../../utils/stock';
import { sanitizeNumberInput }         from '../../utils/sanitizeNumberInput';
import { generateAlertIfNeeded } from '../../utils/alerts';

export default function ScaleSimulationPage() {
  const [, ping] = useState(0);                 // just to force re-render

  /* ---------- rows ---------- */
  const rooms      = query<Room>('rooms');
  const roomById   = Object.fromEntries(rooms.map(r => [r.id, r.name]));
  const scales = query<Scale>('scales').map(sc => {
    const prod = query<Product>('products').find(p => p.id === sc.productId);
    return {
      ...sc,
      productName : prod?.name ?? '—',
      scaleLabel  : `Scale ${sc.id} – ${roomById[sc.roomId] ?? 'Unknown room'}`
    };
  });

  /* ---------- update ---------- */
  const setWeight = (sc: Scale, raw: string) => {
    update('scales', sc.id, { currentWeight: raw });
    recomputeProductQty(sc.productId);
    ping(x => x + 1);                            // refresh table *without* remount
  };

  /* ---------- render ---------- */
  return (
    <>
      <TableToolbar title="Simulation" />

      <PaginatedTable
        data={scales}
        cols={[
          { key: 'productName', header: 'Product' },
          { key: 'scaleLabel',  header: 'Scale'   },
          {
            key   : 'currentWeight',
            header: 'Weight (g)',
            render: r => {
              const sc = r as Scale;
              return (
                <input
                  style={{ width: 100 }}
                  value={sc.currentWeight ?? ''}
                  placeholder="0.0"
                  onChange={e => setWeight(sc, e.target.value)}
                  onBlur={e => {
                    var prod = query<Product>('products').find(p => p.id === sc.productId);
                    if (prod) {
                        generateAlertIfNeeded(prod);
                    }}
                }
                />
              );
            }
          },
          {
            key   : 'units',
            header: 'Units on scale',
            render: r => {
              const sc   = r as Scale;
              const prod = query<Product>('products').find(p => p.id === sc.productId);
              return prod ? unitsOnScale(sc, prod) : '—';
            }
          }
        ]}
      />
    </>
  );
}
