import Head from "next/head";
import styles from "@/pages/styles/home.module.scss";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import UploadDataset from "@/components/UploadDataset/UploadDataset";
import DatasetExample from "@/components/DatasetExample/DatasetExample";
import AlgorithmSelector from "@/components/Algorithms/AlgorithmSelector/AlgorithmSelector";
import { ProfilingAlgorithm } from "@/model/profilingAlgorithm";
import ProfilingOverview from "@/components/ProfilingOverview/ProfilingOverview";
import TwitterInput from "@/components/TwitterInput/TwitterInput";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [algorithm, setAlgorithm] = useState<ProfilingAlgorithm | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  function handleImportFile(file: File) {
    setFile(file);
  }

  function handleRemoveFile() {
    setFile(null);
    setAlgorithm(null);
    setUsername(null);
  }

  return (
    <div>
      <Head>
        <title>AI Profiler</title>
      </Head>

      <div className={styles.externalContainer}>
        <h1 className={styles.title}>AI PROFILER</h1>
        <h3 className={styles.subtitle}>
          A powerful tool that lets you infer personal characteristics of people
          from the text they write.
        </h3>
        <div className={styles.carouselContainer}>
          <AnimatePresence>
            {!file && !algorithm && !username && (
              <motion.div
                key="dataInput"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.21 } }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <TwitterInput setUsername={setUsername} />
                <div className={styles.divider}>
                  <div className={styles.line} />
                  <span>OR</span>
                  <div className={styles.line} />
                </div>
                <UploadDataset handleImportFile={handleImportFile} />
              </motion.div>
            )}
            {(file || username) && !algorithm && (
              <AlgorithmSelector
                setAlgorithm={setAlgorithm}
                goBack={() => {
                  setFile(null);
                  setUsername(null);
                }}
              />
            )}
            {(file || username) && algorithm && (
              <ProfilingOverview
                file={file}
                username={username}
                algorithm={algorithm}
                removeFile={handleRemoveFile}
                goBack={() => setAlgorithm(null)}
              />
            )}
          </AnimatePresence>
        </div>

        <h2 className={styles.examplesTitle}>DATASET EXAMPLES</h2>
        <h3 className={styles.examplesSubtitle}>
          The uploaded dataset must have the following fields:
          <span className={styles.fieldName}>id</span>
          <span className={styles.fieldName}>text</span>
        </h3>
        <DatasetExample className={styles.datasetExample} />
      </div>
    </div>
  );
}
