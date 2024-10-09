import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Stack,
  Pagination,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  debounce,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { applyJob } from '../../features/job-slice';
import { updateUser } from '../../features/user-slice';
import LoadingSpinner from '../LoadingSpinner';
import JobCard from '../JobCard';
const SignInDialog = React.lazy(() => import('../SignInDialog'));

const JobList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const jobs = useSelector((state: RootState) => state.jobs.jobList);
  const loggedInUser = useSelector((state: RootState) => state.users.loggedInUserInfo);
  const navigate = useNavigate();

  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [minSalary, setMinSalary] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUser, setCurrentUser] = useState<any>('');
  const [modelOpen, setModelOpen] = useState<boolean>(false);

  const jobsPerPage = 40; // 40 jobs per page

  useEffect(() => {
    setFilteredJobs(jobs);
  }, [jobs]);

  useEffect(() => {
    if (loggedInUser.user?.id) {
      setCurrentUser(loggedInUser?.user);
    }
  }, [loggedInUser]);

  const handleSearchTextChange = debounce((event: any) => {
    const { value } = event.target;
    setSearchText(value);
  }, 1000);

  const handleSkillChange = (event: any) => {
    const { value } = event.target;
    setSelectedSkills(value);
  };

  const handleSalaryChange = (event: any) => {
    const { value } = event.target;
    setMinSalary(value);
  };

  const filterJobs = useMemo(() => {
    return jobs.filter((job) => {
      const meetsSearchText =
        job.title.toLowerCase().includes(searchText.toLowerCase()) ||
        job.company.toLowerCase().includes(searchText.toLowerCase());
      const meetsSkills =
        selectedSkills.length === 0 || selectedSkills.every((skill: any) => job.requiredSkills.includes(skill));
      const meetsSalary = minSalary === 0 || job.offeredSalary >= minSalary;
      return meetsSearchText && meetsSkills && meetsSalary;
    });
  }, [jobs, searchText, selectedSkills, minSalary]);

  useEffect(() => {
    setFilteredJobs(filterJobs);
    setCurrentPage(1);
  }, [filterJobs]);

  const handleApply = useCallback(
    (jobId: string) => {
      if (currentUser?.id) {
        setFilteredJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === jobId ? { ...job, appliedUsers: [...job.appliedUsers, currentUser?.id] } : job
          )
        );
        dispatch(applyJob({ id: jobId, userId: currentUser?.id }));
        dispatch(updateUser({ id: jobId, userId: currentUser?.id }));
      } else {
        setModelOpen(true);
      }
    },
    [currentUser, dispatch]
  );

  const handleMoreInfo = (jobId: string) => {
    navigate(`/jobdetails/${jobId}`);
  };

  const handleChangePage = (event: any, value: any) => {
    setCurrentPage(value);
  };

  const paginatedJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  return (
    <Box>
      <Box sx={{ p: 2, position: 'sticky', top: '64px', zIndex: 10, backgroundColor: 'white' }}>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Search by Job Name or Company"
            variant="outlined"
            fullWidth
            onChange={handleSearchTextChange}
          />
          <FormControl fullWidth>
            <InputLabel>Filter by Skills</InputLabel>
            <Select
              multiple
              value={selectedSkills}
              onChange={handleSkillChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {['React', 'JavaScript', 'Node.js', 'MongoDB'].map((skill) => (
                <MenuItem key={skill} value={skill}>
                  {skill}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField label="Minimum Salary" variant="outlined" type="number" fullWidth onChange={handleSalaryChange} />
        </Stack>
      </Box>

      <Box sx={{ p: 2, height: 'calc(100vh - 180px)', overflowY: 'auto' }}>
        <Grid container spacing={2}>
          {paginatedJobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={job.id}>
              <JobCard
                job={job}
                userId={currentUser?.id}
                onApply={handleApply}
                onMoreInfo={handleMoreInfo}
                userType={currentUser?.userType}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          position: 'sticky',
          bottom: 0,
          backgroundColor: 'white',
          p: 2,
        }}
      >
        <Pagination
          count={Math.ceil(filteredJobs.length / jobsPerPage)}
          page={currentPage}
          onChange={handleChangePage}
          color="primary"
        />
      </Box>
      <Suspense fallback={<LoadingSpinner />}>
        <SignInDialog modelOpen={modelOpen} setModelOpen={setModelOpen} />
      </Suspense>
    </Box>
  );
};

export default JobList;
