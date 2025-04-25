/* src/features/dashboard/SummaryCard.tsx */
import { useNavigate } from 'react-router-dom';
import styles from './SummaryCard.module.css';

interface Props {
  icon : React.ReactNode;
  value: number;
  label: string;
  to?  : string;          // ← optional navigation target
}

export default function SummaryCard({ icon, value, label, to }: Props) {
  const nav = useNavigate();
  return (
    <button
      className={styles.card}
      onClick={() => to && nav(to)}
      aria-label={`Go to ${label}`}
    >
      {icon}
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
    </button>
  );
}
