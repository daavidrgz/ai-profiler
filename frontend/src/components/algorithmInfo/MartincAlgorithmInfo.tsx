import ScoreTable from "../scoreTable/ScoreTable";
import styles from "./algorithmInfo.module.scss";

export default function MartincAlgorithmInfo() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Martinc Algorithm</h2>
      <p>
        The Martinc algorithm is a profiling algorithm that uses the
        <span className="bold"> TF-IDF</span>, a statistical measure that
        evaluates the relevance of each word in a collection of documents. Thus,
        the underlying AI model is able to determine the classes of each person,
        using the most relevant words of their texts.
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
        The algorithm obtains the following F1 score for each class:
      </p>
      <ScoreTable
        className={styles.scoreTable}
        score={{
          birthDecade: 0.8,
          gender: 0.9,
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
