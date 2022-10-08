import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectNotifications } from "../redux/notificationsSlice";

export default function useNotifications() {
  const dispatch = useDispatch();
  const notification = useSelector(selectNotifications);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [type, setType] = useState<"success" | "warning" | "error" | undefined>(
    undefined
  );

  useEffect(() => {
    if (notification.type && notification.message) {
      setMessage(notification.message);
      setType(notification.type);
    }
  }, [notification, dispatch]);

  return {
    message,
    type,
  };
}
