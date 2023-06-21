import { Score } from "@/model/score";
import styles from "./scoreTable.module.scss";

interface Props {
  score: Score;
}

export default function ScoreTable({ score }: Props) {
  return (
    <table className={styles.scoreTable}>
      <thead>
        <tr>
          <th>CLASS</th>
          <th>F1 SCORE</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(score).map(([key, value]) => (
          <tr key={key}>
            <td>{key}</td>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
