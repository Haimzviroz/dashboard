import React, { createContext, useContext, useState } from 'react';
import { Snackbar } from '@mui/material';
import MuiAlert, { AlertColor } from '@mui/material/Alert';

const ToastContext = createContext({} as { showToast: (msg: string, severity: AlertColor) => void });

export const useToast = () => {
  return useContext(ToastContext);
};

export const ToastProvider = ({ children }: any) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>("success");

  const showToast = (msg: string, severity: AlertColor = 'success') => {
    setMessage(msg);
    setSeverity(severity);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity={severity}
          sx={{ gap: 2, alignItems: "center" }}
        >
          {message}
        </MuiAlert>
      </Snackbar>
    </ToastContext.Provider>
  );
};
