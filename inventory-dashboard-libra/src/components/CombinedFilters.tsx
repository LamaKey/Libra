import { useState, useEffect, ReactNode, useRef } from "react";
import { Option } from "./SearchSelect";
import styles from "./CombinedFilters.module.css";
import SearchSelectTable from "./SearchSelectTable";

interface Field {
  label: string;
  control: ReactNode;
}

interface Props {
  availability?: {
    value: string;
    onChange: (v: string) => void;
    options: Option[];
  };
  location?: {
    value: string;
    onChange: (v: string) => void;
    options: Option[];
  };
  extra?: Field[];
}

export default function CombinedFilters({
  availability,
  location,
  extra = [],
}: Props) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) =>
      open && !boxRef.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  const fields: Field[] = [];

  if (availability)
    fields.push({
      label: "Availability",
      control: <SearchSelectTable {...availability} />,
    });

  if (location)
    fields.push({
      label: "Location",
      control: <SearchSelectTable {...location} />,
    });

  if (extra.length) fields.push(...extra);
  const hasActive =
    (!!availability && !!availability.value) ||
    (!!location && !!location.value);

  const clearAll = () => {
    availability?.onChange("");
    location?.onChange("");
    setOpen(false);
  };
  return (
    <div className={styles.wrap} ref={boxRef}>
      <button type="button" onClick={() => setOpen(!open)}>
        <span
          style={{
            marginRight: 4,
            fontWeight: 500,
            color: "black",
            fontSize: 15,
          }}
        >
          Filters ▾
        </span>
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
