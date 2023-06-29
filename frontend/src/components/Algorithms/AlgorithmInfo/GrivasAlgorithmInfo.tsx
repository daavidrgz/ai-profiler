import ScoreTable from "../ScoreTable/ScoreTable";
import styles from "./algorithmInfo.module.scss";

export default function MartincAlgorithmInfo() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Grivas Algorithm</h2>
      <p>
        The Grivas algorithm is an algorithm...
        <br />
        <br />
        It was trained using a{" "}
        <span className="bold">collection of tweets in English</span> from the
        dataset offered by the{" "}
        <a
          className="link"
          href="https://pan.webis.de/clef15/pan15-web/author-profiling.html"
          target="_blank"
        >
          Author Profiling PAN Competition (2015).
        </a>
        <br />
        <br />
        The algorithm obtains the following F1 score for each class:
      </p>
      <ScoreTable
        className={styles.scoreTable}
        score={{
          regression: {
            extroverted: { name: "Extroverted", mse: 0.2 },
            stable: { name: "Stable", mse: 0.2 },
            agreeable: { name: "Agreeable", mse: 0.2 },
            concientious: { name: "Concientious", mse: 0.2 },
            open: { name: "Open", mse: 0.2 },
          },
          classification: {
            gender: { name: "Gender", accuracy: 0.8, f1: 0.8 },
            age: { name: "Age", accuracy: 0.8, f1: 0.8 },
          },
        }}
      />
      <p className={styles.cite}>
        Martinc, M., Skrlj, B., & Pollak, S. (2019, September). Who is Hot and
        Who is Not? Profiling Celebs on Twitter.{" "}
        <a
          className="link"
          href="https://ceur-ws.org/Vol-2380/paper_203.pdf"
          target="_blank"
        >
          (https://ceur-ws.org/Vol-2380/paper_203.pdf)
        </a>
      </p>
    </div>
  );
}
