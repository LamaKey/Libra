import React from "react";
import styles from "./Badge.module.css";
type Tone = "success" | "warning" | "error";

export default function Badge({
  tone,
  children,
}: {
  tone: Tone;
  children: React.ReactNode;
}) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}
