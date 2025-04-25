import { Link } from "react-router-dom";
import { FiBox } from "react-icons/fi";
import styles from "./StockCard.module.css";
import { Product } from "../products/types";

export default function StockCard({
  data,
  low,
}: {
  data: Product;
  low?: boolean;
}) {
  const isOut = data.qty === 0;
  const isLowSafe = !isOut && low;

  const card = (
    <>
      {data.img ? (
        <img src={data.img} className={styles.thumb} />
      ) : (
        <FiBox size={48} className={styles.thumbIcon} />
      )}
      <div className={styles.info}>
        <span className={styles.name}>{data.name}</span>
        <span className={styles.qty}>Remaining: {data.qty}</span>
        {isLowSafe && <span className={styles.badgeLow}>Low</span>}
        {isOut && <span className={styles.badgeOut}>Out of stock</span>}
        {!isOut && !isLowSafe && data.qty > 0 && (
          <span className={styles.badge}>In stock</span>
        )}
      </div>
    </>
  );

  return (
    <Link
      to={`/inventory/${data.id}`}
      className={isOut ? styles.out : isLowSafe ? styles.low : styles.card}
    >
      {card}
    </Link>
  );
}
