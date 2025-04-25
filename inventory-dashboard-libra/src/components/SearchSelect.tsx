import { useState, useRef, useEffect, MouseEvent } from "react";
import ReactDOM from "react-dom";
import styles from "./SearchSelect.module.css";

export interface Option {
  value: string;
  label: string;
}

export default function SearchSelect({
  value,
  onChange,
  options,
  placeholder = "Select…",
  multi = false,
}: {
  value: string | string[];
  onChange: (v: any) => void;
  options: Option[];
  placeholder?: string;
  multi?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [open]);

  useEffect(() => {
    function handleClick(e: MouseEvent | globalThis.MouseEvent) {
      const target = e.target as Node;
      if (
        open &&
        !triggerRef.current?.contains(target) &&
        !popRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick as any);
    return () => document.removeEventListener("mousedown", handleClick as any);
  }, [open]);

  const list = options.filter((o) =>
    o.label.toLowerCase().includes(filter.toLowerCase())
  );

  const toggle = (v: string) => {
    if (multi) {
      const s = new Set(value as string[]);
      s.has(v) ? s.delete(v) : s.add(v);
      onChange(Array.from(s));
    } else onChange(v);
  };

  const display = multi
    ? (value as string[])
        .map((v) => options.find((o) => o.value === v)?.label)
        .join(", ")
    : options.find((o) => o.value === value)?.label;

  return (
    <div className={styles.box}>
      <button
        type="button"
        ref={triggerRef}
        onClick={() => setOpen((o) => !o)}
        className={styles.trigger}
      >
        {display || placeholder}
        <span className={styles.chev}>▾</span>
      </button>

      {open &&
        ReactDOM.createPortal(
          <div
            ref={popRef}
            className={styles.pop}
            style={{
              position: "absolute",
              top: coords.top,
              left: coords.left,
              width: coords.width,
              zIndex: 9999,
            }}
          >
            <input
              autoFocus
              placeholder="Search…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <ul>
              {list.map((o) => (
                <li
                  key={o.value}
                  onClick={() => {
                    toggle(o.value);
                    if (!multi) setOpen(false);
                  }}
                >
                  {multi && (
                    <input
                      type="checkbox"
                      readOnly
                      checked={(value as any[]).includes?.(o.value)}
                    />
                  )}
                  {o.label}
                </li>
              ))}
              {list.length === 0 && <li className={styles.empty}>No match</li>}
            </ul>
          </div>,
          document.body
        )}
    </div>
  );
}
