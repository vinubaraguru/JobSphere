import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  OutlinedInput,
  InputAdornment,
  Alert,
  Snackbar,
} from '@mui/material';
import { AppDispatch, RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { AutorenewRounded } from '@mui/icons-material';
import { updateProfile } from '../../features/user-slice';

const UserProfile = () => {
  const [formData, setFormData] = useState<any>(null);
  const [skillsOptions] = useState(['React', 'HTML', 'Java', 'Python', 'CSS']);
  const [projects, setProjects] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.users.loggedInUserInfo);
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      setFormData(user);
      setProjects(user.projects || []);
    }
  }, [user]);

  const handleSkillsChange = (event: React.ChangeEvent<{ value: unknown }> | any) => {
    const {
      target: { value },
    } = event;
    setFormData({
      ...formData,
      skills: typeof value === 'string' ? value.split(',') : (value as string[]),
    });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }
    if (!formData.githubProfile) {
      newErrors.githubProfile = 'GitHub username is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validate()) {
      formData.projects = projects;
      dispatch(updateProfile({ userId: user.id, updatedUserProfileData: formData }));
      setSuccess(true);
    }
  };

  const fetchProjects = async () => {
    try {
      const result = await axios(`https://api.github.com/users/${formData.githubProfile}/repos`);
      if (result && result.status === 200 && result.data) {
        const repoNames = result.data.map((repo: any) => repo.name);
        setProjects(repoNames);
        setErrors((prevErrors) => ({ ...prevErrors, githubProfile: '' }));
      }
    } catch (err) {
      const error = err as any;
      const errMsg = error.response?.data?.message || error.message || 'An error occurred';
      setErrors((prevErrors) => ({ ...prevErrors, githubProfile: errMsg }));
    }
  };

  const handleClose = () => {
    setSuccess(false);
  };

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Profile Form
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          name="firstName"
          label="First Name"
          fullWidth
          margin="normal"
          value={formData?.firstName}
          onChange={handleChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
        />
        <TextField
          name="lastName"
          label="Last Name"
          fullWidth
          margin="normal"
          value={formData?.lastName}
          onChange={handleChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
        />
        <TextField
          name="email"
          label="Email"
          fullWidth
          margin="normal"
          value={formData?.email}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          name="phoneNumber"
          label="Phone Number"
          fullWidth
          margin="normal"
          value={formData?.phoneNumber}
          onChange={handleChange}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber}
        />
        <TextField
          name="expectedSalary"
          label="Expected Salary (per hour)"
          type="number"
          fullWidth
          margin="normal"
          value={formData?.expectedSalary}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="skills-label">Skills</InputLabel>
          <Select
            labelId="skills-label"
            multiple
            value={formData?.skills || []}
            onChange={handleSkillsChange}
            input={<OutlinedInput id="select-multiple-chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected as string[])?.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {skillsOptions.map((skill) => (
              <MenuItem key={skill} value={skill}>
                {skill}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box display="flex" alignItems="center" marginY={2}>
          <TextField
            name="githubProfile"
            label="GitHub Profile"
            fullWidth
            margin="normal"
            value={formData?.githubProfile}
            onChange={handleChange}
            error={!!errors.githubProfile}
            helperText={errors.githubProfile}
            InputProps={{
              startAdornment: <InputAdornment position="start">https://github.com/</InputAdornment>,
            }}
          />
          <Button variant="contained" onClick={fetchProjects} sx={{ ml: 2, height: '50px' }}>
            <AutorenewRounded />
          </Button>
        </Box>
        {projects.length > 0 && (
          <Box mt={2}>
            <Typography variant="h6">Fetched Projects List:</Typography>
            <ul>
              {projects.map((project, index) => (
                <li key={index}>{project}</li>
              ))}
            </ul>
          </Box>
        )}

        <Box mt={2}>
          <Button type="submit" variant="contained" fullWidth>
            Update Profile
          </Button>
        </Box>
      </form>
      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Profile Updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfile;
