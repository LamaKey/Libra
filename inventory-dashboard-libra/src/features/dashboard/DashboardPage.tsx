import styles from "./DashboardPage.module.css";
import StockCard from "./StockCard";
import RoomsCarousel from "./RoomsCarousel";
import SummaryCard from "./SummaryCard";
import { query } from "../../utils/storage";
import { Product } from "../products/types";
import { Order } from "../orders/types";
import { useLowStock, useNormalStock, useOutOfStock } from "./hooks";
import SectionCard from "./SectionCard";
import { Alert } from "../alerts/types";

export enum summaryStyle {
  inHand,
  onTheWay,
  alerts,
}
export default function DashboardPage() {
  const products = query<Product>("products");
  const orders = query<Order>("orders");
  const alerts = query<Alert>("alerts");
  const low = useLowStock();
  const stock = useNormalStock();
  const out = useOutOfStock();

  const quantityInHand = products.reduce((sum, p) => sum + p.qty, 0);
  const toBeReceived = orders.reduce((sum, o) => sum + o.qty, 0);

  return (
    <div className={styles.page}>
      <SectionCard title="Inventory Summary">
        <section className={styles.summary}>
          <SummaryCard
            icon={"../../../public/Quantity.svg"}
            value={quantityInHand}
            label="Quantity in Hand"
            to="/inventory"
            style={summaryStyle.inHand}
          />
          <SummaryCard
            icon={"../../../public/onTheWay.svg"}
            value={toBeReceived}
            label="To be received"
            to="/orders"
            style={summaryStyle.onTheWay}
          />
          <SummaryCard
            icon={"../../../public/error.svg"}
            value={alerts.length}
            label="Alerts"
            to="/alerts"
            style={summaryStyle.alerts}
          />
        </section>
      </SectionCard>

      <SectionCard
        title="Rooms"
        onSeeAll={() => (window.location.href = "/rooms")}
      >
        <RoomsCarousel />
      </SectionCard>

      <section className={styles.stockRow}>
        <SectionCard
          title="Stock"
          onSeeAll={() => (window.location.href = "/inventory?filter=ok")}
        >
          <div className={styles.grid}>
            {stock.slice(0, 12).map((p) => (
              <StockCard key={p.id} data={p} />
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Low Quantity Stock"
          onSeeAll={() => (window.location.href = "/inventory?filter=low")}
        >
          <div className={styles.grid}>
            {low.slice(0, 12).map((p) => (
              <StockCard key={p.id} data={p} low />
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Out Of Stock"
          onSeeAll={() => (window.location.href = "/inventory?filter=out")}
        >
          <div className={styles.grid}>
            {out.slice(0, 12).map((p) => (
              <StockCard key={p.id} data={p} low />
            ))}
          </div>
        </SectionCard>
      </section>
    </div>
  );
}
