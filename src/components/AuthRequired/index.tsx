import React from 'react';
import { Typography, Button, Container, Box, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const AuthRequired = () => {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate('/signin');
  };

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60vh',
      }}
    >
      <Card sx={{ minWidth: 275, maxWidth: 400 }}>
        <CardContent>
          <Box textAlign="center" mt={2} mb={2}>
            <Typography variant="h6" gutterBottom>
              Please sign in to continue accessing this page
            </Typography>
            <Button variant="contained" color="primary" onClick={handleSignInClick} sx={{ mt: 2 }}>
              Sign In
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AuthRequired;
