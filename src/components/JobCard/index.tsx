import { Card, CardContent, Stack, Avatar, Box, Typography, Chip, Button } from '@mui/material';
import React from 'react';

const JobCard = React.memo(({ job, userId, onApply, onMoreInfo, userType }: any) => {
  const isApplied = job.appliedUsers?.includes(userId);

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" spacing={2}>
          <Avatar alt={job.company} src={`/${job.company}.png`} />
          <Box>
            <Typography variant="h6" onClick={() => onMoreInfo(job.id)} sx={{ cursor: 'pointer' }}>
              {job.title.length > 25 ? `${job.title.substring(0, 20)}...` : job.title}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {job.company} {job.location}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              {job.requiredSkills.map((skill: any) => (
                <Chip key={skill} label={skill} />
              ))}
            </Stack>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Salary/Hour: ₹ {job.offeredSalary}
            </Typography>
          </Box>
        </Stack>

        {userType !== 'Employer' && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant={isApplied ? 'outlined' : 'contained'}
              color={isApplied ? 'secondary' : 'primary'}
              onClick={() => onApply(job.id)}
              disabled={isApplied}
            >
              {isApplied ? 'APPLIED' : 'APPLY'}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
});

export default JobCard;
