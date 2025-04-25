import { useNavigate } from "react-router-dom";
import styles from "./SummaryCard.module.css";
import { summaryStyle } from "./DashboardPage";

interface Props {
  icon: string;
  value: number;
  label: string;
  to?: string;
  style?: summaryStyle;
}

export default function SummaryCard({ icon, value, label, to, style }: Props) {
  const nav = useNavigate();
  const className =
    style == summaryStyle.inHand
      ? styles.inHand
      : style == summaryStyle.onTheWay
      ? styles.onTheWay
      : styles.alerts;
  return (
    <button
      className={className}
      onClick={() => to && nav(to)}
      aria-label={`Go to ${label}`}
    >
      <img src={icon} />
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
    </button>
  );
}
