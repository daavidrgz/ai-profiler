import Head from "next/head";
import styles from "@/pages/styles/home.module.scss";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import UploadDataset from "@/components/uploadDataset/UploadDataset";
import FilePreview from "@/components/filePreview/FilePreview";

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
        <h2 className={styles.subtitle}>
          A powerful tool that lets you infer personal characteristics of people
          from the text they write.
        </h2>
        <AnimatePresence>
          {!file ? (
            <motion.div
              key="uploadContainer"
              className={styles.uploadContainer}
              initial={{ opacity: 0, display: "none" }}
              animate={{
                opacity: 1,
                display: "flex",
                transition: { delay: 0.25 },
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <UploadDataset handleImportFile={handleImportFile} />
            </motion.div>
          ) : (
            <motion.div
              key="filePreviewContainer"
              className={styles.uploadContainer}
              initial={{ opacity: 0, display: "none" }}
              animate={{
                opacity: 1,
                display: "flex",
                transition: { delay: 0.25 },
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FilePreview file={file} removeFile={handleRemoveFile} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
