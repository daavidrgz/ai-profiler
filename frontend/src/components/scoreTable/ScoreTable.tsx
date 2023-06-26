import styles from "./scoreTable.module.scss";
import { TableProps } from "@mui/material";

interface Props extends TableProps {
  score: {
    [key: string]: {
      name: string;
      f1: number;
    };
  };
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
        {Object.values(score).map((classScore) => (
          <tr key={classScore.name}>
            <td className={styles.tableLeft}>{classScore.name}</td>
            <td className={styles.tableRight}>{classScore.f1}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
