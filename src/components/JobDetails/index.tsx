import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Typography, Chip, Stack, Avatar, Paper, Divider, Tooltip, Link } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { applyJob } from '../../features/job-slice';
import { updateUser } from '../../features/user-slice';
import SignInDialog from '../SignInDialog';
const CandidateDialog = React.lazy(() => import('../CadidateDialog'));

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [isApplied, setIsApplied] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const jobList = useSelector((state: RootState) => state.jobs.jobList);
  const loggedInUser = useSelector((state: RootState) => state.users.loggedInUserInfo);
  const [dialogs, setDialogs] = useState({ signIn: false, candidate: false });
  const [candidateIds, setCandidateIds] = useState([]);

  useEffect(() => {
    const foundJob = jobList.find((job) => job.id === id);
    if (foundJob) {
      setJob(foundJob);
      setIsApplied(foundJob.appliedUsers.includes(loggedInUser.user?.id));
    }
  }, [id, jobList, loggedInUser]);

  const handleApply = useCallback(() => {
    if (loggedInUser?.user?.id) {
      dispatch(applyJob({ id: job.id, userId: loggedInUser.user.id }));
      dispatch(updateUser({ id: job.id, userId: loggedInUser.user.id }));
      setIsApplied(true);
    } else {
      setDialogs((prev) => ({ ...prev, signIn: true }));
    }
  }, [dispatch, job, loggedInUser]);

  const handleShowCandidates = () => {
    const appliedUserIds = job?.appliedUsers || [];
    setCandidateIds(appliedUserIds);
    setDialogs((prev) => ({ ...prev, candidate: true }));
  };

  const requiredSkills = useMemo(
    () =>
      job?.requiredSkills.map((skill: any) => (
        <Tooltip title={`Skill: ${skill}`} key={skill}>
          <Chip label={skill} variant="outlined" />
        </Tooltip>
      )),
    [job]
  );

  if (!job) return <Typography>Loading job details...</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar alt={job.company} src={`/${job.company}.png`} />
          <Typography variant="h4" fontWeight="bold">
            {job.title}
          </Typography>
        </Stack>

        <Typography variant="subtitle1" sx={{ mt: 1, color: 'text.secondary' }}>
          {job.company} -
{job.location}
        </Typography>

        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
          Posted on: {new Date(job.createdAt).toLocaleDateString()} | Status: {job.status}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {loggedInUser?.user?.userType === 'Employer' && (
          <>
            {job?.appliedUsers?.length > 0 ? (
              <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold', color: 'text.primary' }}>
                <Link component="button" onClick={handleShowCandidates} underline="none" sx={{ color: 'primary' }}>
                  {job.appliedUsers.length} candidates have applied. Click here to view the list.
                </Link>
              </Typography>
            ) : (
              <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold', color: 'primary' }}>
                No candidates have applied yet.
              </Typography>
            )}
            <Divider sx={{ my: 2 }} />
          </>
        )}

        <Box>
          <Typography variant="h6">Required Skills:</Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            {requiredSkills}
          </Stack>
        </Box>

        <br />
        <Typography variant="subtitle1">Description:</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {job.description}
        </Typography>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Salary/Hour: ₹{job.offeredSalary}
        </Typography>
        {loggedInUser?.user?.userType !== 'Employer' && (
          <Box sx={{ mt: 4 }}>
            <Button
              variant={isApplied ? 'outlined' : 'contained'}
              color={isApplied ? 'secondary' : 'primary'}
              onClick={handleApply}
              disabled={isApplied}
              sx={{ width: '100%' }}
            >
              {isApplied ? 'APPLIED' : 'APPLY'}
            </Button>
          </Box>
        )}
      </Paper>
      <SignInDialog
        modelOpen={dialogs.signIn}
        setModelOpen={(open: boolean) => setDialogs((prev) => ({ ...prev, signIn: open }))}
      />
      <CandidateDialog
        open={dialogs.candidate}
        handleClose={() => setDialogs((prev) => ({ ...prev, candidate: false }))}
        candidateIds={candidateIds}
      />
    </Box>
  );
};

export default JobDetails;
