import Head from "next/head";
import styles from "@/pages/styles/home.module.scss";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import UploadDataset from "@/components/uploadDataset/UploadDataset";
import FilePreview from "@/components/filePreview/FilePreview";
import DatasetExample from "@/components/datasetExample/DatasetExample";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);

  function handleImportFile(file: File) {
    setFile(file);
  }

  function handleRemoveFile() {
    setFile(null);
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
        <div className={styles.uploadContainer}>
          <AnimatePresence>
            {!file ? (
              <UploadDataset handleImportFile={handleImportFile} />
            ) : (
              <FilePreview file={file} removeFile={handleRemoveFile} />
            )}
          </AnimatePresence>
        </div>

        <h2 className={styles.examplesTitle}>EXAMPLES</h2>
        <h3 className={styles.examplesSubtitle}>
          The uploaded dataset must be have following fields:
          <span className={styles.fieldName}>id</span>
          <span className={styles.fieldName}>text</span>
        </h3>
        <DatasetExample className={styles.datasetExample} />
      </div>
    </div>
  );
}
