import { useMemo } from "react";
import { query } from "../../utils/storage";
import { Product } from "../products/types";

export const useProducts = (): Product[] =>
  useMemo(() => query<Product>("products"), []);

export const useLowStock = (): Product[] =>
  useMemo(
    () => query<Product>("products").filter((p) => p.low && p.qty > 0),
    []
  );

export const useNormalStock = (): Product[] =>
  useMemo(
    () => query<Product>("products").filter((p) => !p.low && p.qty > 0),
    []
  );

export const useOutOfStock = (): Product[] =>
  useMemo(() => query<Product>("products").filter((p) => p.qty === 0), []);
