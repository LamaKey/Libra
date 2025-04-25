import { ReactNode } from "react";
import styles from "./SectionCard.module.css";
import Button from "../../components/Button";

interface Props {
  title: string;
  onSeeAll?: () => void;
  children: ReactNode;
}

export default function SectionCard({ title, onSeeAll, children }: Props) {
  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h2>{title}</h2>
        <div className={styles.controls}>
          {onSeeAll && (
            <Button size="sm" variant="ghost" onClick={onSeeAll}>
              See all
            </Button>
          )}
        </div>
      </header>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
