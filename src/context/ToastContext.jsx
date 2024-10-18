import React, { createContext, useContext, useState } from 'react';
import ToastMessage from '../components/ToastMessage';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 10000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <ToastMessage message={toast.message} type={toast.type} />}
    </ToastContext.Provider>
  );
};
