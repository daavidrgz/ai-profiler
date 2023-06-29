import * as React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import styles from "./linearProgressBar.module.scss";

interface Props {
  label: string;
}

export default function LinearProgressBar({ label }: Props) {
  return (
    <div className={styles.barContainer}>
      <p className={styles.label}>{label}</p>
      <LinearProgress className={styles.bar} />
    </div>
  );
}
