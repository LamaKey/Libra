import { useState } from "react";
import TableToolbar from "../../components/TableToolbar";
import PaginatedTable from "../../components/PaginatedTable";
import { query, update } from "../../utils/storage";
import { Scale, Room } from "../rooms/types";
import { Product } from "../products/types";
import { recomputeProductQty, unitsOnScale } from "../../utils/stock";
import { generateAlertIfNeeded } from "../../utils/alerts";

export default function ScaleSimulationPage() {
  const [, ping] = useState(0);
  const rooms = query<Room>("rooms");
  const roomById = Object.fromEntries(rooms.map((r) => [r.id, r.name]));
  var scales = query<Scale>("scales").map((sc) => {
    const prod = query<Product>("products")
      .filter((p) => p.crateWeight && p.unitWeight && p.unitsPerCrate)
      .find((p) => p.id === sc.productId);
    if (prod) {
      return {
        ...sc,
        productName: prod?.name ?? "—",
        scaleLabel: `Scale ${sc.id} – ${roomById[sc.roomId] ?? "Unknown room"}`,
      };
    }
    return null;
  });

  const setWeight = (sc: Scale, raw: string) => {
    update("scales", sc.id, { currentWeight: raw });
    recomputeProductQty(sc.productId);
    ping((x) => x + 1);
  };

  return (
    <>
      <TableToolbar title="Simulation" />

      <PaginatedTable
        data={scales.filter((s) => s != null)}
        cols={[
          { key: "productName", header: "Product" },
          { key: "scaleLabel", header: "Scale" },
          {
            key: "currentWeight",
            header: "Weight (g)",
            render: (r) => {
              const sc = r as Scale;
              return (
                <input
                  style={{ width: 100 }}
                  value={sc.currentWeight ?? ""}
                  placeholder="0.0"
                  onChange={(e) => setWeight(sc, e.target.value)}
                  onBlur={() => {
                    const prod = query<Product>("products").find(
                      (p) => p.id === sc.productId
                    );
                    if (prod) {
                      generateAlertIfNeeded(prod, sc.roomId);
                    }
                  }}
                />
              );
            },
          },
          {
            key: "units",
            header: "Units on scale",
            render: (r) => {
              const sc = r as Scale;
              const prod = query<Product>("products").find(
                (p) => p.id === sc.productId
              );
              return prod ? unitsOnScale(sc, prod) : "—";
            },
          },
        ]}
      />
    </>
  );
}
