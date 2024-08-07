import React, { useState, useEffect } from "react";
import "./ToastNotification.css"; // Assuming you have some CSS for styling

const ToastNotification = ({ message, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!isVisible) return null;

  return <div className="toast-notification">{message}</div>;
};

export default ToastNotification;
