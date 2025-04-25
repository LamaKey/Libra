// src/features/rooms/ScaleTile.tsx
import React from 'react';
import styles from './ScaleTile.module.css';

interface Props {
  label: string;
  low: boolean;
  imgUrl?: string;
}

export default function ScaleTile({ label, low, imgUrl }: Props) {
  return (
    <div className={styles.tile}>
      {imgUrl ? (
        <img src={imgUrl} alt={label} className={styles.iconImg} />
      ) : (
        <div className={styles.icon}>{label.charAt(0)}</div>
      )}
      <span className={styles.label}>{label}</span>
      {low && <span className={styles.badge}>!</span>}
    </div>
  );
}
