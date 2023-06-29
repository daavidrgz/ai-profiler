export enum NotificationType {
  SUCCESS,
  ERROR,
  INFO,
}

export abstract class AppNotification {
  id: string | undefined;
  type: NotificationType;
  title: string;
  timeout: number;

  constructor(type: NotificationType, title: string, timeout = 0) {
    this.type = type;
    this.title = title;
    this.timeout = timeout;
  }

  public setId(id: string) {
    this.id = id;
  }

  public abstract getClassName(): string;
  public abstract getIcon(): JSX.Element;
}
