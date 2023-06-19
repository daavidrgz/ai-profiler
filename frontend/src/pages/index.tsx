import Head from "next/head";
import styles from "@/pages/styles/home.module.scss";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { ChangeEvent, FormEvent, useState, DragEvent } from "react";
import ProfilingService from "@/services/ProfilingService";
import { useNotifications } from "@/components/notificationManager/NotificationManager";

export default function HomePage() {
  const [dragActive, setDragActive] = useState(false);

  const { createErrorNotification, createSuccessNotification } =
    useNotifications();

  function handleImportFile(file: File) {
    ProfilingService.autoprofile(file)
      .then((res) => {
        createSuccessNotification("Dataset uploaded successfully!");
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleUploadChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) handleImportFile(file);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  function handleDrag(e: DragEvent<HTMLDivElement | HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImportFile(e.dataTransfer.files[0]);
  }

  return (
    <div>
      <Head>
        <title>AI Profiler</title>
      </Head>
      <div className={styles.externalContainer}>
        <h1 className={styles.title}>AI PROFILER</h1>

        <form
          data-drag_active={dragActive}
          className={styles.inputContainer}
          onSubmit={handleSubmit}
          onDragEnter={handleDrag}
        >
          <span className={styles.inputText}>
            Drag and drop your dataset here or click the button below!
          </span>

          <label htmlFor="file-upload" className={styles.uploadLabel}>
            <button className={styles.uploadButton} type="button">
              <span>Upload dataset</span>
              <CloudUploadIcon />
            </button>
          </label>
          <input
            className={styles.uploadInput}
            onChange={handleUploadChange}
            type="file"
            id="file-upload"
          />

          {dragActive && (
            <div
              className={styles.dragOverlay}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            />
          )}
        </form>
      </div>
    </div>
  );
}
