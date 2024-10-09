import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SignInDialog = ({ modelOpen, setModelOpen }: any) => {
  const navigate = useNavigate();
  const validateHandleApply = () => {
    navigate('/signin');
  };

  const handleClose = () => {
    setModelOpen(false);
  };

  return (
    <Dialog
      open={modelOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Sign In Required</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          To apply for this job, please sign in to your account. If you don’t have an account yet, you can easily create
          one.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Dismiss</Button>
        <Button onClick={validateHandleApply} autoFocus>
          Sign In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SignInDialog;
