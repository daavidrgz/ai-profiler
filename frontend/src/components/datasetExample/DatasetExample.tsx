import { DivProps } from "@/utils/defaultInterfaces";
import styles from "./datasetExample.module.scss";

interface Props extends DivProps {}

export default function DatasetExample({ className }: Props) {
  return (
    <div className={className}>
      <div className={styles.codeContainer}></div>
      <div className={styles.buttonsContainer}>
        <button className={styles.formatButton}>NDJSON</button>
        <button className={styles.formatButton}>CSV</button>
      </div>
    </div>
  );
}
