import styles from "./notification.module.scss";
import { useCallback, useContext, useEffect } from "react";
import { NotificationContext } from "./NotificationManager";
import { AppNotification } from "./notifications/Notification";
import { motion } from "framer-motion";
import CloseCircle from "./CloseCirlce";

interface Props {
  notification: AppNotification;
}

export default function NotificationToast({
  notification,
}: Props): JSX.Element {
  const { id, title, timeout } = notification;
  const { deleteNotification } = useContext(NotificationContext)!;

  const closeNotification = useCallback(() => {
    deleteNotification(id!);
  }, [id, deleteNotification]);

  useEffect(() => {
    if (timeout == 0) return;
    setTimeout(() => closeNotification(), timeout);
  }, [closeNotification, timeout]);

  return (
    <motion.div
      layout
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      initial={{ left: "-20vw", opacity: 0 }}
      animate={{ left: 0, opacity: 1 }}
      exit={{ left: "-20vw", opacity: 0 }}
      className={`${
        styles.Notification_container
      } ${notification.getClassName()}`}
      onClick={() => closeNotification()}
    >
      <div className={styles.Notification_topBar}>
        <h3 className={styles.Notification_title}>
          {notification.getIcon()}
          {title}
        </h3>
        <CloseCircle onClick={() => closeNotification()} timeout={timeout} />
      </div>
    </motion.div>
  );
}
