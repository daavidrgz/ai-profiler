import { Score } from "@/model/score";
import styles from "./scoreTable.module.scss";
import { TableProps } from "@mui/material";

interface Props extends TableProps {
  score: Score;
}

export default function ScoreTable({ score, className }: Props) {
  return (
    <table className={`${styles.table} ${className}`}>
      <thead className={styles.tableHeader}>
        <tr>
          <th>CLASS</th>
          <th>F1 SCORE</th>
        </tr>
      </thead>
      <tbody className={styles.tableBody}>
        {Object.entries(score).map(([key, value]) => (
          <tr key={key}>
            <td className={styles.tableLeft}>{key}</td>
            <td className={styles.tableRight}>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
