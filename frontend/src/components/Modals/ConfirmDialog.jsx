import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';

const ConfirmDialog = ({
  open,
  title = 'Confirmation',
  message = 'Voulez-vous confirmer cette action ?',
  confirmText = 'Oui',
  cancelText = 'Non',
  onConfirm,
  onCancel
}) => {
  if (!open) return null;

  const handleClose = (confirmed) => {
    if (confirmed && onConfirm) onConfirm();
    if (!confirmed && onCancel) onCancel();
  };

  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, pt: 0 }}>
        <Button
          onClick={() => handleClose(false)}
          variant="outlined"
        >
          {cancelText}
        </Button>
        <Button
          onClick={() => handleClose(true)}
          variant="contained"
          color="error"
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;

