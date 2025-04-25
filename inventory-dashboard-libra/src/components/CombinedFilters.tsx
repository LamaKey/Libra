import React, { useState, useEffect, ReactNode, useRef } from 'react';
import SearchSelect, { Option } from './SearchSelect';
import styles from './CombinedFilters.module.css';

/* simple descriptor for arbitrary controls */
interface Field {
  label: string;
  control: ReactNode;
}

interface Props {
  /* quick helpers for inventory-style pages */
  availability?: { value: string; onChange: (v: string) => void; options: Option[] };
  location?:     { value: string; onChange: (v: string) => void; options: Option[] };

  /* free-form controls for other pages (orders, suppliers, …) */
  extra?: Field[];
}

export default function CombinedFilters({ availability, location, extra = [] }: Props) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  /* ─ click-outside closes ─ */
  useEffect(() => {
    const h = (e: MouseEvent) =>
    open && !boxRef.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  
  /* build the list we’ll render */
  const fields: Field[] = [];
  if (availability)
    fields.push({ label: 'Availability', control: <SearchSelect {...availability} /> });
  if (location)
    fields.push({ label: 'Location', control: <SearchSelect {...location} /> });
  if (extra.length) fields.push(...extra);
 /* ---- compute if anything is selected ---- */
const hasActive =
    (!!availability && !!availability.value) ||
    (!!location     && !!location.value);

/* ---- clear helper ---- */
const clearAll = () => {
    availability?.onChange('');
    location?.onChange('');
    // custom extras can expose their own “clear” buttons in the control itself
    setOpen(false);
};
  return (
     <div className={styles.wrap} ref={boxRef}>
        <button type="button" onClick={() => setOpen(!open)}>
            <span style={{marginRight:4,fontWeight:500, color: 'black', fontSize: 15}}>Filters ▾</span>
        </button>

        {open && (
            <div className={styles.pop}>
                <strong style={{ marginBottom: 4 }}>Filters</strong>
                {fields.map(({ label, control }) => (
                <label key={label}>
                    {label}
                    {control}
                </label>
                ))}
                {/* ---------- clear button ---------- */}
                <button
                  className={styles.clearBtn}
                  onClick={clearAll}
                  disabled={!hasActive}
                  type="button"
                >
                  Clear filters
                </button>
            </div>
        )}
    </div>
  );
}
