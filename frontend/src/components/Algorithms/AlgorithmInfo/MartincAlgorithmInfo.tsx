import ScoreTable from "../ScoreTable/ScoreTable";
import styles from "./algorithmInfo.module.scss";

export default function MartincAlgorithmInfo() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Martinc Algorithm</h2>
      <p className={styles.body}>
        The Martinc algorithm is a profiling algorithm that uses the
        <span className="bold"> TF-IDF</span>, a statistical measure that
        evaluates the relevance of each word in a collection of documents.
        <span className="vSpace" />
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
        <span className="vSpace" />
        The algorithm obtains the following score for each class:
      </p>
      <ScoreTable
        className={styles.scoreTable}
        score={{
          classification: {
            // f1: 0.63938864960046, accuracy: 0.6456692588906378
            age: { name: "Age", f1: 0.63939, accuracy: 0.64567 },
            // f1: 0.90155573796346, accuracy: 0.903816227695403
            gender: { name: "Gender", f1: 0.90156, accuracy: 0.90382 },
            // f1: 0.7187109022083055, accuracy: 0.7306396978467134
            occupation: { name: "Occupation", f1: 0.71871, accuracy: 0.73064 },
            // f1: 0.7346527759428802, accuracy: 0.7552848111585246
            fame: { name: "Fame", f1: 0.73465, accuracy: 0.75528 },
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
