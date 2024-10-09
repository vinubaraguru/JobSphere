import React from 'react';
import { Container, Card, CardContent, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  const handleHomePageClick = () => {
    navigate('/');
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
              This could be because either the page does not exist or you do not have permissions. Please check the URL.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleHomePageClick} sx={{ mt: 2 }}>
              Go to Homepage
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default NotFound;
