import React,{useState} from 'react';
import TableToolbar   from '../../components/TableToolbar';
import PaginatedTable from '../../components/PaginatedTable';
import { query, update } from '../../utils/storage';
import { Scale }   from '../rooms/types';
import { Product } from '../products/types';
import { generateAlertIfNeeded } from '../../utils/alerts';

export default function AdminSimPage(){
  const [search,setSearch] = useState('');

  const scales   = query<Scale>('scales');
  const products = query<Product>('products');

  const rows = scales.map(s=>{
    const p = products.find(pr=>pr.id===s.productId);
    return {
      id:s.id,
      roomId:s.roomId,
      productId:p?.id ?? '',
      product:p?.name ?? '—',
      qty:p?.qty ?? 0,
      unitsPerCrate:p?.unitsPerCrate ?? 1
    };
  }).filter(r=>r.product.toLowerCase().includes(search.toLowerCase()));

  const bump = (id:string,delta:number)=>{
    const prod = products.find(p=>p.id===id);
    if(!prod) return;
    const newQty = Math.max(0,prod.qty+delta);
    update<Product>('products',prod.id,{ qty:newQty,low:newQty<=10 });
    generateAlertIfNeeded({ ...prod, qty:newQty, low:newQty<=10 });
    window.dispatchEvent(new Event('products-changed'));
  };

  return(
    <>
      <TableToolbar
        title="Scale Simulation (Admin)"
        search={{value:search,onChange:setSearch,placeholder:'Search product'}}
      />

      <PaginatedTable
        data={rows}
        cols={[
          { key:'product', header:'Product' },
          { key:'qty', header:'Quantity', render:r=>{
              const row = r as any;
              return (
                <div style={{display:'flex',alignItems:'center',gap:6}}>
                  <button className="small" onClick={()=>bump(row.productId,-row.unitsPerCrate)}>-crate</button>
                  <button className="small" onClick={()=>bump(row.productId,-1)}>-unit</button>
                  {row.qty}
                  <button className="small" onClick={()=>bump(row.productId,1)}>+unit</button>
                  <button className="small" onClick={()=>bump(row.productId,row.unitsPerCrate)}>+crate</button>
                </div>
              );
            }},
          { key:'roomId', header:'Room ID' }
        ]}
      />
    </>
  );
}
