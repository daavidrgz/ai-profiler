import ScoreTable from "../scoreTable/ScoreTable";
import styles from "./algorithmInfo.module.scss";

export default function MartincAlgorithmInfo() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Martinc Algorithm</h2>
      <p className={styles.body}>
        The Martinc algorithm is a profiling algorithm that uses the
        <span className="bold"> TF-IDF</span>, a statistical measure that
        evaluates the relevance of each word in a collection of documents.
        <br />
        <br />
        It was trained using a{" "}
        <span className="bold">
          collection of tweets from 48335 celebrities
        </span>{" "}
        from the dataset offered by the{" "}
        <a
          className="link"
          href="https://pan.webis.de/clef19/pan19-web/celebrity-profiling.html"
          target="_blank"
        >
          Celebrity Profiling PAN competition (2019).
        </a>
        <br />
        <br />
        The algorithm obtains the following score for each class:
      </p>
      <ScoreTable
        className={styles.scoreTable}
        score={{
          classification: {
            // f1: 0.6352445174796177, accuracy: 0.6398752399232246
            age: { name: "Age", f1: 0.63524, accuracy: 0.63988 },
            // f1: 0.9010101273653148, accuracy: 0.9021113243761996
            gender: { name: "Gender", f1: 0.90101, accuracy: 0.90211 },
            // f1: 0.7188096306992375, accuracy: 0.7335652591170825
            occupation: { name: "Occupation", f1: 0.71881, accuracy: 0.73357 },
            // f1: 0.7329561368668326, accuracy: 0.7555182341650671
            fame: { name: "Fame", f1: 0.73296, accuracy: 0.75552 },
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
