import Info from '@mui/icons-material/Info';
import styles from '../notification.module.scss';
import { AppNotification, NotificationType } from './Notification';

export default class NotificationInfo extends AppNotification {
  constructor(title: string, timeout = 4000) {
    super(NotificationType.INFO, title, timeout);
  }

  public getClassName(): string {
    return styles.Notification_info;
  }

  public getIcon(): JSX.Element {
    return <Info />;
  }
}
