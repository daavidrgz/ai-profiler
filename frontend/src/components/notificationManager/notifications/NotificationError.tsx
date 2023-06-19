import Error from '@mui/icons-material/Error';
import styles from '../notification.module.scss';
import { AppNotification, NotificationType } from './Notification';

export default class NotificationError extends AppNotification {
  constructor(title: string, timeout = 0) {
    super(NotificationType.ERROR, title, timeout);
  }

  public getClassName(): string {
    return styles.Notification_error;
  }

  public getIcon(): JSX.Element {
    return <Error />;
  }
}
