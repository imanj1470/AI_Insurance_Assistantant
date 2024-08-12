import React from 'react';
import { Box, Button, Typography } from '@mui/material'; // If using Material-UI

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      bgcolor="white"
      p={4}
      borderRadius={5}
      boxShadow="5px 4px 15px rgba(0, 0, 0, 0.2)"
      zIndex="1200"
    >
      <Button
        onClick={onClose}
        sx={{ position: 'absolute', top: 10, right: 10 }}
      >
        Close
      </Button>
      {children}
    </Box>

    
  );
};

export default Modal;