export interface AppNotification {
  id: string;
  title: string;
  message: string;
  createdAtLabel: string;
  read: boolean;

  icon?: string;
  variant?: string;
  avatar?: string;
  to?: string;
}
