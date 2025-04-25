import React from 'react';
import Badge from '../../components/Badge';
import styles from './StockList.module.css';
import { query } from '../../utils/storage';

type Product = { id:string; name:string; qty:number; img?:string; low:boolean };

export default function StockList({ lowOnly=false }: { lowOnly?: boolean }) {
  let items = query<Product>('products');
  items = lowOnly ? items.filter(p=>p.low) : items.filter(p=>!p.low);
  items.sort((a,b)=> lowOnly ? a.qty-b.qty : b.qty-a.qty);
  const shown = items.slice(0,5);

  return (
    <section className={styles.wrap}>
      <header className={styles.head}>
        <h2>{lowOnly?'Low Quantity Stock':'Stock'}</h2>
        <button onClick={()=>window.location.href='/inventory'}>See All</button>
      </header>
      <ul className={styles.list}>
        {shown.map(p=>(
          <li key={p.id} className={styles.item}>
            <img src={p.img||'/placeholder.png'} alt="" />
            <div className={styles.meta}>
              <span className={styles.title}>{p.name}</span>
              <span className={styles.sub}>Remaining: {p.qty}</span>
            </div>
            {p.low && <Badge tone="warning">Low</Badge>}
          </li>
        ))}
        {shown.length===0 && <p className={styles.empty}>– none –</p>}
      </ul>
    </section>
  );
}
