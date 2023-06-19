import CheckCircle from '@mui/icons-material/CheckCircle';
import styles from '../notification.module.scss';
import { AppNotification, NotificationType } from './Notification';

export default class NotificationSuccess extends AppNotification {
  constructor(title: string, timeout = 2000) {
    super(NotificationType.SUCCESS, title, timeout);
  }

  public getClassName(): string {
    return styles.Notification_success;
  }

  public getIcon(): JSX.Element {
    return <CheckCircle />;
  }
}
