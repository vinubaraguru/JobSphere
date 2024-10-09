import React, { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, MenuItem, Snackbar, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { postJob } from '../../features/job-slice';

const MAX_DESCRIPTION_LENGTH = 16 * 1024; // 16KB in bytes

const PostJob = () => {
  const initialPostJob = {
    title: '',
    description: '',
    status: '',
    requiredSkills: [],
    company: '',
    location: '',
    offeredSalary: '',
    createdby: '',
  };
  const [formValues, setFormValues] = useState(initialPostJob);

  const [errors, setErrors] = useState<any>({});
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const loggedInUser = useSelector((state: RootState) => state.users.loggedInUserInfo);

  const handleChange = (event: any) => {
    const { name, value } = event.target;

    if (name === 'description' && value.length > MAX_DESCRIPTION_LENGTH) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        description: 'Job description cannot exceed 16KB (16,384 characters)',
      }));
    } else {
      setErrors((prevErrors: any) => ({ ...prevErrors, [name]: '' }));
    }

    setFormValues({ ...formValues, [name]: value });
  };

  const handleSkillsChange = (event: any) => {
    const { value } = event.target;
    if (value.length <= 3) {
      setFormValues({ ...formValues, requiredSkills: value });
      if (value.length > 0) {
        setErrors((prevErrors: any) => ({ ...prevErrors, requiredSkills: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formValues.title) newErrors.title = 'Job title is required';
    if (!formValues.description) newErrors.description = 'Description is required';
    if (formValues.description.length > MAX_DESCRIPTION_LENGTH) {
      newErrors.description = 'Job description cannot exceed 16KB';
    }
    if (!formValues.status) newErrors.status = 'Status is required';
    if (!formValues.requiredSkills.length) newErrors.requiredSkills = 'At least 1 skill is required';
    if (!formValues.company) newErrors.company = 'Company name is required';
    if (!formValues.location) newErrors.location = 'Location is required';
    if (!formValues.offeredSalary) newErrors.offeredSalary = 'Offered salary is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (validateForm()) {
      formValues.createdby = loggedInUser?.user.id;
      dispatch(postJob(formValues));
      setSuccess(true);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setFormValues(initialPostJob);
  };

  return (
    <>
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#f5f5f5',
          paddingTop: '64px',
        }}
      >
        <Card sx={{ width: 500 }}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              Post a Job
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Job Title"
                name="title"
                value={formValues.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                margin="normal"
              />

              <Typography variant="h6">Description</Typography>
              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Job Description"
                name="description"
                value={formValues.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description || 'Job description document with maximum length of 16KB'}
                margin="normal"
              />

              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={formValues.status}
                onChange={handleChange}
                error={!!errors.status}
                helperText={errors.status}
                margin="normal"
              >
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </TextField>

              <TextField
                fullWidth
                select
                label="Required Skills"
                name="requiredSkills"
                value={formValues.requiredSkills}
                onChange={handleSkillsChange}
                SelectProps={{
                  multiple: true,
                }}
                error={!!errors.requiredSkills}
                helperText={errors.requiredSkills}
                margin="normal"
              >
                <MenuItem value="JavaScript">JavaScript</MenuItem>
                <MenuItem value="React">React</MenuItem>
                <MenuItem value="Node.js">Node.js</MenuItem>
                <MenuItem value="Python">Python</MenuItem>
                <MenuItem value="Java">Java</MenuItem>
              </TextField>

              <TextField
                fullWidth
                label="Company"
                name="company"
                value={formValues.company}
                onChange={handleChange}
                error={!!errors.company}
                helperText={errors.company}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formValues.location}
                onChange={handleChange}
                error={!!errors.location}
                helperText={errors.location}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Offered Salary"
                name="offeredSalary"
                value={formValues.offeredSalary}
                onChange={handleChange}
                error={!!errors.offeredSalary}
                helperText={errors.offeredSalary}
                margin="normal"
              />

              <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                Submit
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Job posted successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default PostJob;
