import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import EditProductModal from "./EditProductModal";
import Badge from "../../components/Badge";
import styles from "./ProductDetail.module.css";
import { Product } from "./types";
import * as D from "../../utils/defaults";
import { Room } from "../rooms/types";
import { Branch } from "../branches/types";
import { Scale } from "../rooms/types";
import { Alert } from "../alerts/types";
import { query } from "../../utils/storage";
import { unitsOnScale } from "../../utils/stock";
import { Order } from "../orders/types";

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>() as { id: string };
  const [prod, setProd] = useState<Product | undefined>(() =>
    query<Product>("products").find((p) => p.id === id)
  );
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const handler = () => {
      setProd(query<Product>("products").find((p) => p.id === id));
    };
    window.addEventListener("products-changed", handler);
    return () => window.removeEventListener("products-changed", handler);
  }, [id]);

  if (!prod) return <p>Product not found.</p>;

  const threshold = prod.threshold ?? D.DEFAULT_THRESHOLD;
  const crateWeight = prod.crateWeight ?? D.DEFAULT_CRATE_WEIGHT;
  const unitsPerCrate = prod.unitsPerCrate ?? D.DEFAULT_UNITS_PER_CRATE;

  const liveQty = (() => {
    const scal = query<Scale>("scales").filter((s) => s.productId === prod.id);
    return scal.reduce((sum, sc) => sum + unitsOnScale(sc, prod), 0);
  })();

  const onTheWayQty = query<Order>("orders")
    .filter((o) => o.product === prod.id)
    .reduce((sum, o) => sum + o.qty, 0);

  const opening = liveQty + (prod.onTheWay ?? 0);
  const suppliers = query<{
    id: string;
    name: string;
    email: string;
    contact: string;
  }>("suppliers");
  const rooms = query<Room>("rooms");
  const branches = query<Branch>("branches");

  const stockRows = (() => {
    const br = branches.find((b) => b.id === prod.location);
    return br ? [{ name: br.name, stock: prod.qty }] : [];
  })();

  const alerts = query<Alert>("alerts").filter((a) => a.productId === prod.id);

  return (
    <div className={styles.page}>
      <div className={styles.headRow}>
        <h1>{prod.name}</h1>

        <div className={styles.headActions}>
          <Button
            variant="ghost"
            onClick={() => navigate(`/calibration?product=${prod.id}`)}
          >
            Calibrate
          </Button>
          <Button onClick={() => setEdit(true)}>Edit</Button>
        </div>
      </div>
      <div className={styles.topRow}>
        <div className={styles.infoCol}>
          <section className={styles.card}>
            <h3>Primary details</h3>
            <table className={styles.tableMini}>
              <tbody>
                <tr>
                  <th>Product name</th> <td>{prod.name}</td>
                </tr>
                <tr>
                  <th>Product ID</th> <td>{prod.id}</td>
                </tr>
                <tr>
                  <th>Price</th> <td>{prod.price}</td>
                </tr>
                <tr>
                  <th>Currency</th>{" "}
                  <td>{prod.currency ?? D.DEFAULT_CURRENCY}</td>
                </tr>
                <tr>
                  <th>Unit weight</th> <td>{prod.unitWeight} g</td>
                </tr>
                <tr>
                  <th>Crate weight</th> <td>{crateWeight} g</td>
                </tr>
                <tr>
                  <th>Units / crate</th> <td>{unitsPerCrate}</td>
                </tr>
                <tr>
                  <th>Threshold value</th> <td>{threshold}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className={styles.card}>
            <h3>Supplier details</h3>
            <table className={styles.tableMini}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {prod.suppliers.map((id) => {
                  const s = suppliers.find((x) => x.id === id);
                  return (
                    <tr key={id}>
                      <td>{s?.name ?? "—"}</td>
                      <td>{s?.contact ?? "—"}</td>
                      <td>{s?.email ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        </div>

        <img
          className={styles.bigImg}
          src={prod.img || "../../../public/placeholder-wide.jpg.webp"}
          alt={prod.name}
        />
      </div>

      <div className={styles.grid2}>
        <section className={styles.card}>
          <h3>Stock</h3>
          <table className={styles.tableMini}>
            <tbody>
              <tr>
                <th>Opening stock</th> <td>{opening}</td>
              </tr>
              <tr>
                <th>Remaining stock</th> <td>{liveQty}</td>
              </tr>
              <tr>
                <th>On the way</th> <td>{onTheWayQty}</td>
              </tr>
              <tr>
                <th>Threshold value</th> <td>{threshold}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className={styles.card}>
          <h3>Current status</h3>
          {liveQty === 0 ? (
            <Badge tone="error">Out of stock</Badge>
          ) : liveQty <= threshold ? (
            <Badge tone="warning">Low stock</Badge>
          ) : (
            <Badge tone="success">In-stock</Badge>
          )}
        </section>
      </div>

      <div className={styles.grid2}>
        <section className={styles.card}>
          <h3>
            Stock locations <a href="/rooms">See all</a>
          </h3>
          <table className={styles.tableMini}>
            <thead>
              <tr>
                <th>Branch</th>
                <th style={{ textAlign: "right" }}>Stock in hand</th>
              </tr>
            </thead>
            <tbody>
              {stockRows.map((r) => (
                <tr key={r.name}>
                  <td>{r.name}</td>
                  <td style={{ textAlign: "right" }}>{r.stock}</td>
                </tr>
              ))}
              {stockRows.length === 0 && (
                <tr>
                  <td colSpan={2}>– none –</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section className={styles.card}>
          <h3>
            Alerts <a href="/alerts">See all</a>
          </h3>
          <table className={styles.tableMini}>
            <thead>
              <tr>
                <th>Alert</th>
                <th>Branch</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((a) => {
                const room = rooms.find((r) => r.id === a.id);
                const br = branches.find((b) => b.id === room?.location);
                return (
                  <tr key={a.id}>
                    <td>{a.message}</td>
                    <td>{br?.name ?? "–"}</td>
                  </tr>
                );
              })}
              {alerts.length === 0 && (
                <tr>
                  <td colSpan={2}>– none –</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>

      <EditProductModal
        product={prod}
        open={edit}
        onClose={() => setEdit(false)}
      />
    </div>
  );
}
