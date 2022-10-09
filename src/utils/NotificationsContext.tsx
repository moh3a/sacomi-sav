import { createContext, ReactNode, useState } from "react";

const NotificationsContext = createContext<{
  notification: NotificationStatus;
  notificationText: string | null;
  success: (text: string, timeout: number) => void;
  warning: (text: string, timeout: number) => void;
  error: (text: string, timeout: number) => void;
  clear: () => void;
} | null>(null);
NotificationsContext.displayName = "NotificationsContext";

interface NotificationsProviderProps {
  children: ReactNode;
}

export enum NotificationStatus {
  None,
  Success,
  Warning,
  Error,
}

const NotificationsProvider = ({ children }: NotificationsProviderProps) => {
  const [notification, setNotification] = useState(NotificationStatus.None);
  const [notificationText, setNotificationText] = useState<string | null>(null);

  return (
    <NotificationsContext.Provider
      value={{
        notification,
        notificationText,
        success: (text: string, timeout: number) => {
          setNotificationText(text);
          setNotification(NotificationStatus.Success);
          setTimeout(() => {
            setNotification(NotificationStatus.None);
            setNotificationText(null);
          }, timeout || 10000);
        },
        warning: (text: string, timeout: number) => {
          setNotificationText(text);
          setNotification(NotificationStatus.Warning);
          setTimeout(() => {
            setNotification(NotificationStatus.None);
            setNotificationText(null);
          }, timeout || 10000);
        },
        error: (text: string, timeout: number) => {
          setNotificationText(text);
          setNotification(NotificationStatus.Error);
          setTimeout(() => {
            setNotification(NotificationStatus.None);
            setNotificationText(null);
          }, timeout || 10000);
        },
        clear: () => {
          setNotification(NotificationStatus.None);
          setNotificationText(null);
        },
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export { NotificationsProvider };
export default NotificationsContext;
