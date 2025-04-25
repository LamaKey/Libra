import { Order } from "../features/orders/types";
import { Product } from "../features/products/types";
import { Room, Scale } from "../features/rooms/types";
import { Alert } from "./alerts";

export type TableKey =
  | "rooms"
  | "scales"
  | "products"
  | "suppliers"
  | "alerts"
  | "orders"
  | "branches";

function getData<T = unknown>(key: TableKey): T[] {
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as T[];
  } catch {
    console.warn(`Bad JSON for ${key}`);
    return [];
  }
}

function setData<T>(key: TableKey, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

function emitChange(key: TableKey) {
  window.dispatchEvent(new CustomEvent(`${key}-changed`));
}

export function query<T>(key: TableKey): T[] {
  const rows = getData<T>(key);

  const removeBroken = (invalidRows: T[]) => {
    if (invalidRows.length > 0) {
      const validRows = rows.filter((r) => !invalidRows.includes(r));
      setData(key, validRows);
      emitChange(key);
    }
  };

  if (key === "scales") {
    const roomIds = new Set(getData<any>("rooms").map((r) => r.id));
    const productIds = new Set(getData<any>("products").map((p) => p.id));
    const invalid = rows.filter(
      (s: any) => !roomIds.has(s.roomId) || !productIds.has(s.productId)
    );
    removeBroken(invalid);
    return rows.filter(
      (s: any) => roomIds.has(s.roomId) && productIds.has(s.productId)
    );
  }

  if (key === "orders") {
    const productIds = new Set(getData<any>("products").map((p) => p.id));
    const supplierIds = new Set(getData<any>("suppliers").map((s) => s.id));
    const invalid = rows.filter(
      (o: any) => !productIds.has(o.product) || !supplierIds.has(o.supplier)
    );
    removeBroken(invalid);
    return rows.filter(
      (o: any) => productIds.has(o.product) && supplierIds.has(o.supplier)
    );
  }

  if (key === "alerts") {
    const productIds = new Set(getData<any>("products").map((p) => p.id));
    const invalid = rows.filter((a: any) => !productIds.has(a.productId));
    removeBroken(invalid);
    return rows.filter((a: any) => productIds.has(a.productId));
  }

  if (key === "rooms") {
    const branchIds = new Set(getData<any>("branches").map((b) => b.id));
    const invalid = rows.filter((r: any) => !branchIds.has(r.location));
    removeBroken(invalid);
    return rows.filter((r: any) => branchIds.has(r.location));
  }

  if (key === "products") {
    const supplierIds = new Set(getData<any>("suppliers").map((s) => s.id));
    const invalid = rows.filter(
      (p: any) =>
        !(p.suppliers ?? []).every((sid: string) => supplierIds.has(sid))
    );
    removeBroken(invalid);
    return rows.filter((p: any) =>
      (p.suppliers ?? []).every((sid: string) => supplierIds.has(sid))
    );
  }

  return rows;
}

export function insert<T extends { id: string }>(key: TableKey, record: T) {
  setData(key, [...getData<T>(key), record]);
  emitChange(key);
}

export function update<T>(key: TableKey, id: string, patch: Partial<T>) {
  const rows = getData<any>(key).map((r) =>
    r.id === id ? { ...r, ...patch } : r
  );
  setData(key, rows);
  emitChange(key);
}

export function remove(key: TableKey, id: string) {
  if (key === "rooms") {
    query<Scale>("scales")
      .filter((s) => s.roomId === id)
      .forEach((s) => remove("scales", s.id));
  }

  if (key === "products") {
    query<Order>("orders")
      .filter((o) => o.product === id)
      .forEach((o) => remove("orders", o.id));

    query<Alert>("alerts")
      .filter((a) => a.productId === id)
      .forEach((a) => remove("alerts", a.id));

    query<Scale>("scales")
      .filter((s) => s.productId === id)
      .forEach((s) => remove("scales", s.id));
  }

  if (key === "suppliers") {
    const products = query<Product>("products");
    products.forEach((p) => {
      if (p.suppliers?.includes(id)) {
        p.suppliers = p.suppliers.filter((sid: string) => sid !== id);
        update("products", p.id, { suppliers: p.suppliers });
      }
    });
  }

  if (key === "branches") {
    query<Room>("rooms")
      .filter((r) => r.location === id)
      .forEach((r) => remove("rooms", r.id));
  }

  setData(
    key,
    getData<any>(key).filter((r: any) => r.id !== id)
  );
  emitChange(key);
  window.location.reload();
}
