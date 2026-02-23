// components/Modals/FormModal.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const FormModal = ({
  open,
  onClose,
  title,
  children,
  onSubmit,
  submitText = 'Enregistrer',
  maxWidth = 'sm',
  fullWidth = true
}) => {
  if (!open) return null;

  return ReactDOM.createPortal(
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          margin: 2,
          maxHeight: 'calc(100% - 64px)',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) !important',
          width: '100%'
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2.5, 
        bgcolor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography variant="h6" component="span" sx={{ fontWeight: 600, color: '#1e293b' }}>
          {title}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: '#64748b',
            '&:hover': { bgcolor: '#f1f5f9' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit) {
          const formData = new FormData(e.currentTarget);
          const data = Object.fromEntries(formData.entries());
          onSubmit(data);
        }
      }}>
        <DialogContent sx={{ p: 3 }}>
          {children}
        </DialogContent>

        <DialogActions sx={{ p: 2.5, pt: 0, gap: 2 }}>
          <Button 
            onClick={onClose} 
            variant="outlined"
            sx={{
              borderColor: '#e2e8f0',
              color: '#64748b',
              '&:hover': { borderColor: '#94a3b8', bgcolor: '#f8fafc' }
            }}
          >
            Annuler
          </Button>
          {onSubmit && (
            <Button 
              type="submit" 
              variant="contained"
              sx={{
                bgcolor: '#006400',
                '&:hover': { bgcolor: '#005000' }
              }}
            >
              {submitText}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>,
    document.getElementById('modal-root')
  );
};

export default FormModal;