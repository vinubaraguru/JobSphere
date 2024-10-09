import React from 'react';
import { Container, Card, CardContent, Box, Typography, Button } from '@mui/material';

const GeneralError = () => {
  const handleRefreshClick = () => {
    window.location.reload();
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
              Something went work, try again
            </Typography>
            <Button variant="contained" color="primary" onClick={handleRefreshClick} sx={{ mt: 2 }}>
              Refresh
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default GeneralError;
