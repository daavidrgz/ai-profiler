import Head from "next/head";
import styles from "@/styles/home.module.scss";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { ChangeEvent } from "react";

export default function HomePage() {
  function handleImportFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <div>
      <Head>
        <title>AI Profiler</title>
      </Head>
      <div className={styles.externalContainer}>
        <h1 className={styles.title}>AI PROFILER</h1>

        <form className={styles.inputContainer} onSubmit={handleSubmit}>
          <label htmlFor="file-upload" className={styles.uploadLabel}>
            <button className={styles.uploadButton} type="button">
              <span>Upload dataset</span>
              <CloudUploadIcon />
            </button>
          </label>
          <input
            className={styles.uploadInput}
            onChange={handleImportFile}
            type="file"
            id="file-upload"
          />
        </form>
      </div>
    </div>
  );
}
