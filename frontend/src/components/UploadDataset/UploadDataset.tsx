import { ChangeEvent, DragEvent, useState } from "react";
import styles from "./uploadDataset.module.scss";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFile";
import { motion } from "framer-motion";

interface Props {
  handleImportFile: (file: File) => void;
}

export default function UploadDataset({ handleImportFile }: Props) {
  const [dragActive, setDragActive] = useState(false);

  function handleUploadChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) handleImportFile(file);
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
    <div className={styles.externalContainer}>
      <h2 className={styles.title}>UPLOAD YOUR DATASET</h2>
      <motion.form
        key="uploadDatasetForm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        data-drag_active={dragActive}
        className={styles.inputContainer}
        onDragEnter={handleDrag}
      >
        <span className={styles.inputText}>
          Drag and drop your dataset here or click the button below!
        </span>

        <label htmlFor="file-upload" className={styles.uploadLabel}>
          <button className={styles.uploadButton} type="button">
            <span>Upload dataset</span>
            <UploadFileRoundedIcon />
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
      </motion.form>
    </div>
  );
}
