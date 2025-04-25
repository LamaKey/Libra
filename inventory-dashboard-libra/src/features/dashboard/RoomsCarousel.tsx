import { Link } from "react-router-dom";
import styles from "./RoomsCarousel.module.css";
import { query } from "../../utils/storage";
import { Branch } from "../branches/types";
import { Room } from "../rooms/types";

export default function RoomsCarousel() {
  const branches = query<Branch>("branches");
  const valid = new Set(branches.map((b) => b.id));
  const rooms = query<Room>("rooms").filter((r) => valid.has(r.location));
  const visible = rooms.slice(0, 5);

  if (rooms.length === 0) return null;

  return (
    <div className={styles.track}>
      {visible.map((r) => (
        <Link key={r.id} to={`/rooms/${r.id}`} className={styles.tile}>
          <img className={styles.icon} src="../../../public/house.svg" />
          <span>{r.name}</span>
        </Link>
      ))}
    </div>
  );
}
