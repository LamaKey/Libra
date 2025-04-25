import React from "react";
import styles from "./TableToolbar.module.css";
import Button from "./Button";
import CombinedFilters from "./CombinedFilters";

interface Props {
  title: string;
  search?: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
  };
  filters?: React.ReactNode;
  combinedFilters?: Parameters<typeof CombinedFilters>[0];
  onAdd?: () => void;
  addLabel?: string;
}

export default function TableToolbar({
  title,
  search,
  filters,
  combinedFilters,
  addLabel,
  onAdd,
}: Props) {
  return (
    <header className={styles.wrap}>
      <h1>{title}</h1>

      <div className={styles.actions}>
        {search && (
          <input
            className={styles.search}
            type="text"
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
            placeholder={search.placeholder}
          />
        )}

        {combinedFilters ? <CombinedFilters {...combinedFilters} /> : filters}

        {onAdd && (
          <Button size="sm" onClick={onAdd}>
            {addLabel}
          </Button>
        )}
      </div>
    </header>
  );
}
