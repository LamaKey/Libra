import React, { useState } from 'react';
import { Link }           from 'react-router-dom';
import Button             from '../../components/Button';
import styles             from './RoomsCarousel.module.css';
import { query }          from '../../utils/storage';

type Room = { id: string; name: string };

export default function RoomsCarousel() {
  const rooms   = query<Room>('rooms');
  const [start, setStart] = useState(0);
  const visible = rooms.slice(start, start + 4);

  if (rooms.length === 0) return null;

  return (
    <section className={styles.wrap}>
      <header className={styles.head}>
        <h2>Rooms</h2>
        <div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setStart((s) => (s + 4) % rooms.length)}
          >
            Next
          </Button>
          <Button size="sm" variant="ghost" onClick={() => (window.location.href = '/rooms')}>
            See All
          </Button>
        </div>
      </header>

      <div className={styles.track}>
        {visible.map((r) => (
          /* ▼ tile wrapped in <Link> so it’s fully clickable */
          <Link key={r.id} to={`/rooms/${r.id}`} className={styles.tile}>
            <div className={styles.icon} />
            <span>{r.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
