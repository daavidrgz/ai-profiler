import styles from "./notification.module.scss";
import { createContext, useCallback, useContext, useState } from "react";
import NotificationToast from "./NotificationToast";
import { AppNotification } from "./notifications/Notification";
import { AnimatePresence } from "framer-motion";
import { v4 } from "uuid";
import NotificationSuccess from "./notifications/NotificationSuccess";
import NotificationError from "./notifications/NotificationError";
import NotificationInfo from "./notifications/NotificationInfo";

export const NotificationContext = createContext<
  | {
      createSuccessNotification: (title: string, timeout?: number) => void;
      createErrorNotification: (title: string, timeout?: number) => void;
      createInfoNotification: (title: string, timeout?: number) => void;
      deleteNotification: (id: string) => void;
    }
  | undefined
>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

interface Props {
  children: React.ReactNode;
}

export default function NotificationManager({ children }: Props): JSX.Element {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const createNotification = useCallback((notification: AppNotification) => {
    notification.setId(v4());
    setNotifications((prev) => [...prev, notification]);
  }, []);

  const createSuccessNotification = useCallback(
    (title: string, timeout?: number) => {
      createNotification(new NotificationSuccess(title, timeout));
    },
    [createNotification]
  );

  const createErrorNotification = useCallback(
    (title: string, timeout?: number) => {
      createNotification(new NotificationError(title, timeout));
    },
    [createNotification]
  );

  const createInfoNotification = useCallback(
    (title: string, timeout?: number) => {
      createNotification(new NotificationInfo(title, timeout));
    },
    [createNotification]
  );

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        createSuccessNotification,
        createErrorNotification,
        createInfoNotification,
        deleteNotification,
      }}
    >
      <div className={styles.Notification_aggregator}>
        <AnimatePresence>
          {notifications.map((notification) => (
            <NotificationToast
              key={notification.id}
              notification={notification}
            />
          ))}
        </AnimatePresence>
      </div>

      {children}
    </NotificationContext.Provider>
  );
}
