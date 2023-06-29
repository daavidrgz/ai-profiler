import styles from "./scoreTable.module.scss";
import { TableProps } from "@mui/material";

interface Props extends TableProps {
  score: {
    regression?: {
      [key: string]: {
        name: string;
        mse: number;
      };
    };
    classification?: {
      [key: string]: {
        name: string;
        f1: number;
        accuracy: number;
      };
    };
  };
}

export default function ScoreTable({ score, className }: Props) {
  return (
    <div className={`${styles.container}  ${className}`}>
      {score.classification && (
        <div className={styles.classificationWrapper}>
          <h1 className={styles.title}>CLASSIFICATION</h1>
          <table className={styles.classificationTable}>
            <thead>
              <tr>
                <th className={styles.borderLeft}>CLASS</th>
                <th className={styles.borderLeft}>ACCURACY</th>
                <th>F1</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(score.classification).map((classScore) => (
                <tr key={classScore.name}>
                  <td className={styles.borderLeft}>{classScore.name}</td>
                  <td className={styles.borderLeft}>{classScore.accuracy}</td>
                  <td>{classScore.f1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {score.regression && (
        <div className={styles.regressionWrapper}>
          <h1 className={styles.title}>REGRESSION</h1>
          <table className={styles.regressionTable}>
            <thead>
              <tr>
                <th className={styles.borderLeft}>CLASS</th>
                <th>MSE</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(score.regression).map((classScore) => (
                <tr key={classScore.name}>
                  <td className={styles.borderLeft}>{classScore.name}</td>
                  <td className={styles.right}>{classScore.mse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
