/* src/features/dashboard/DashboardPage.tsx */
import React from 'react';
import styles from './DashboardPage.module.css';
import StockCard from './StockCard';
import RoomsCarousel from './RoomsCarousel';
import SummaryCard from './SummaryCard';
import { FiPackage, FiInbox, FiAlertTriangle } from 'react-icons/fi';
import { query } from '../../utils/storage';
import { Product } from '../products/types';
import { Order }   from '../orders/types';
import { useLowStock, useNormalStock } from './hooks';

export default function DashboardPage() {
  /* ---------- data ---------- */
  const products = query<Product>('products');
  const orders   = query<Order>('orders');
  const low      = useLowStock();
  const stock    = useNormalStock();

  const quantityInHand = products.reduce((sum, p) => sum + p.qty, 0);

  /* anything not yet delivered */
  const toBeReceived   = orders.reduce((sum, o) => sum + o.qty, 0);

  /* ---------- render ---------- */
  return (
    <div className={styles.page}>
      <section className={styles.summary}>
        <SummaryCard
          icon={<FiPackage size={28} color="#252525" />}
          value={quantityInHand}
          label="Quantity in Hand"
          to="/inventory"
        />
        <SummaryCard
          icon={<FiInbox size={28} color="#252525" />}
          value={toBeReceived}
          label="To be received"
          to="/orders"
        />
        <SummaryCard
          icon={<FiAlertTriangle size={28} color="#d32f2f" />}
          value={low.length}
          label="Alerts"
          to="/alerts"
        />
      </section>

      <RoomsCarousel />

      <section className={styles.stockRow}>
        <div className={styles.block}>
          <header>
            <span>Stock</span>
            <a href="/inventory">See all</a>
          </header>
          <div className={styles.grid}>
            {stock.slice(0, 6).map((p) => (
              <StockCard key={p.id} data={p} />
            ))}
          </div>
        </div>

        <div className={styles.block}>
          <header>
            <span>Low Quantity Stock</span>
            <a href="/inventory?filter=low">See all</a>
          </header>
          <div className={styles.grid}>
            {low.slice(0, 6).map((p) => (
              <StockCard key={p.id} data={p} low />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
