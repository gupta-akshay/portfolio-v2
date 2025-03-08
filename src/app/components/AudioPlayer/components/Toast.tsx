import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faInfoCircle, 
  faExclamationCircle,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { ToastNotification } from '../types';

interface ToastProps {
  toast: ToastNotification;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return faCheckCircle;
      case 'error':
        return faExclamationCircle;
      case 'info':
      default:
        return faInfoCircle;
    }
  };

  return (
    <div className={`toast ${toast.type}`}>
      <div className="toastIcon">
        <FontAwesomeIcon icon={getIcon()} />
      </div>
      <div className="toastMessage">{toast.message}</div>
      <button 
        className="toastCloseButton" 
        onClick={() => onClose(toast.id)}
        aria-label="Close notification"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastNotification[];
  onClose: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toastContainer">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};

export default ToastContainer; 