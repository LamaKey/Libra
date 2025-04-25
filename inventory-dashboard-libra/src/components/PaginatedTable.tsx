import React, { useMemo, useState } from "react";
import Pagination from "./Pagination";
import styles from "./PaginatedTable.module.css";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  numeric?: boolean;
}

interface Props<T> {
  cols: Column<T>[];
  data: T[];
  perPage?: number;
  onRowClick?: (row: T) => void;
}
export default function PaginatedTable<T extends { id: string }>({
  cols,
  data,
  onRowClick,
  perPage = 10,
}: Props<T>) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(data.length / perPage));
  const slice = useMemo(() => {
    const start = (page - 1) * perPage;
    return data.slice(start, start + perPage);
  }, [page, perPage, data]);

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={c.key as string}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slice.map((r) => (
            <tr
              key={r.id}
              onClick={() => onRowClick?.(r)}
              className={onRowClick ? styles.clickable : undefined}
            >
              {cols.map((c) => (
                <td
                  key={c.key as string}
                  style={c.numeric ? { textAlign: "left" } : undefined}
                >
                  {c.render ? c.render(r) : (r as any)[c.key]}
                </td>
              ))}
            </tr>
          ))}
          {slice.length === 0 && (
            <tr>
              <td colSpan={cols.length} className={styles.empty}>
                No data.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination page={page} pages={pages} onChange={setPage} />
    </>
  );
}
