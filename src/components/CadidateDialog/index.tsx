import React, { useState, useEffect } from 'react';
import { Typography, Dialog, DialogTitle, DialogContent, Card, CardContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';

const CandidateDialog = ({ open, handleClose, candidateIds }: any) => {
  const [candidates, setCandidates] = useState<any>([]);
  const { usersList } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    if (candidateIds.length > 0) {
      const filteredCandidates = usersList.filter((user: any) => candidateIds.includes(user.id));
      setCandidates(filteredCandidates);
    }
  }, [open, candidateIds]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Applied Candidates List
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
          sx={{ position: 'absolute', right: 12, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {candidates.length > 0 ? (
          candidates.map((candidate: any) => (
            <Card key={candidate.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">
                  {candidate.firstName} 
{' '}
{candidate.lastName}
                </Typography>
                <Typography variant="body2">{candidate.email}</Typography>
                <Typography variant="body2">
                  Phone:
                  {candidate.phoneNumber}
                </Typography>
                <Typography variant="body2">
                  Skills:
                  {candidate.skills.join(', ')}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>No candidates available.</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CandidateDialog;
