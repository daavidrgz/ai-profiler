import ScoreTable from "../ScoreTable/ScoreTable";
import styles from "./algorithmInfo.module.scss";

export default function MartincAlgorithmInfo() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Grivas Algorithm</h2>
      <p>
        The Grivas algorithm is an algorithm that, in order to classify the
        author of the posts and characterize him/her, it uses two group of
        features extracted from the text they write:
        <span className="bold"> Stylometric </span>
        <span className="italic">(TF-IDF trigrams, word length...) </span>
        and
        <span className="bold"> Structural </span>
        <span className="italic">(number of hashtags, number of links...)</span>
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
        </a>{" "}
        This collection includes <span className="bold">152 users</span> used
        for the training set and <span className="bold">142 users</span> for the
        test set.
        <br />
        <br />
        The algorithm obtains the following scores for each class:
      </p>
      <ScoreTable
        className={styles.scoreTable}
        score={{
          regression: {
            extroverted: { name: "Extroverted", mse: 0.12365 },
            stable: { name: "Stable", mse: 0.18683 },
            agreeable: { name: "Agreeable", mse: 0.13595 },
            conscientious: { name: "Conscientious", mse: 0.11283 },
            open: { name: "Open", mse: 0.11656 },
          },
          classification: {
            age: { name: "Age", accuracy: 0.78873, f1: 0.74943 },
            gender: { name: "Gender", accuracy: 0.83099, f1: 0.83045 },
          },
        }}
      />
      <p className={styles.cite}>
        Grivas, A., Krithara, A., & Giannakopoulos, G. (2015, September). Author
        Profiling Using Stylometric and Structural Feature Groupings.{" "}
        <a
          className="link"
          href="https://ceur-ws.org/Vol-1391/68-CR.pdf"
          target="_blank"
        >
          (https://ceur-ws.org/Vol-1391/68-CR.pdf)
        </a>
      </p>
    </div>
  );
}
