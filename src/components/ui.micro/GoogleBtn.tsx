import React from 'react';
import { Button } from '@mui/material';

interface GoogleButtonProps {
  onClick: () => void;
  label: string;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ onClick, label }) => {
  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: '#fff',
        color: '#000',
        width: '100%',
        height: 40,
        borderRadius: 1,
        padding: '0 8px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        textTransform: 'none',
        fontSize: '14px',
        fontFamily: 'Roboto',
        '&:hover': {
          backgroundColor: '#fff',
          color: '#000',
        },
      }}
      startIcon={<img height="18px" width={'18px'} src="/google.svg" />}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default GoogleButton;
