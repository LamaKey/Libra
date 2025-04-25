import { Link }     from 'react-router-dom';
import { FiBox }    from 'react-icons/fi';
import styles       from './StockCard.module.css';
import { Product }  from '../products/types';

export default function StockCard({ data, low }: { data: Product; low?: boolean }) {
  const card = (
    <>
      {data.img
        ? <img src={data.img} className={styles.thumb} />
        : <FiBox size={48} className={styles.thumbIcon} />}
      <div className={styles.info}>
        <span className={styles.name}>{data.name}</span>
        <span className={styles.qty}>Remaining: {data.qty}</span>
        {low && <span className={styles.badge}>Low</span>}
      </div>
    </>
  );

  return (
    <Link to={`/inventory/${data.id}`} className={low ? styles.low : styles.card}>
      {card}
    </Link>
  );
}
