import styles from "./filePreview.module.scss";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import { formatBytes } from "@/utils/formatter";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ProfilingService from "@/services/ProfilingService";
import { useNotifications } from "@/components/notificationManager/NotificationManager";
import { useData } from "../dataProvider/DataProvider";
import { useRouter } from "next/router";
import { toProfilingData } from "@/model/profilingDataDto";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LinearProgressBar from "../linearProgressBar/LinearProgressBar";

interface Props {
  file: File;
}

export default function FilePreview({ file }: Props) {
  const { createSuccessNotification, createErrorNotification } =
    useNotifications();
  const { setData } = useData();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const waitForResult = (profilingId: string) => {
    ProfilingService.getProfilingData(profilingId)
      .then((profilingDataDto) => {
        if (profilingDataDto.status == "PENDING") {
          setTimeout(() => waitForResult(profilingId), 500);
          return;
        }

        createSuccessNotification("Profiling successfull", 5000);
        setData(toProfilingData(profilingDataDto));
        setIsProcessing(false);
        router.push("/resume");
      })
      .catch((message) => {
        setIsProcessing(false);
        createErrorNotification(message, 5000);
      });
  };

  const handleClick = () => {
    setIsProcessing(true);
    ProfilingService.autoprofile(file)
      .then((profilingId) => waitForResult(profilingId))
      .catch((message) => createErrorNotification(message, 5000));
  };

  return (
    <div className={styles.container}>
      <AnimatePresence>
        <motion.div
          key="fileInfoContainer"
          layout
          transition={{ duration: 0.2 }}
          className={styles.fileInfoContainer}
        >
          <DescriptionRoundedIcon className={styles.fileIcon} />
          <div className={styles.fileInfo}>
            <div className={styles.fileName}>{file.name}</div>
            <div className={styles.fileSize}>{formatBytes(file.size)}</div>
          </div>
        </motion.div>

        {isProcessing && (
          <motion.div
            key="processing"
            className={styles.barContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LinearProgressBar label="Processing dataset..." />
          </motion.div>
        )}

        <motion.button
          layout
          transition={{ duration: 0.2 }}
          key="startButton"
          data-disabled={isProcessing}
          className={styles.startButton}
          onClick={handleClick}
        >
          <span>START</span>
          <PlayArrowRoundedIcon />
        </motion.button>
      </AnimatePresence>
    </div>
  );
}
