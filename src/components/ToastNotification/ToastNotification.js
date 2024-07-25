import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./ToastNotification.css"; // Assuming you have some CSS for styling

const ToastNotification = ({ message, duration, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration || 3000);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!isVisible) return null;

  return <div className="toast-notification">{message}</div>;
};

ToastNotification.propTypes = {
  message: PropTypes.string.isRequired,
  duration: PropTypes.number,
  onClose: PropTypes.func,
};

export default ToastNotification;
