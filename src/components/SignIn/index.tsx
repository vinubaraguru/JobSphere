import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Card, CardContent, CardActions, Tabs, Tab, Link } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { login, User } from '../../features/user-slice';
import { useNavigate } from 'react-router-dom';

interface SignInData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const SignIn = () => {
  const [activeTab, setActiveTab] = useState<number>(0); // 0 for Freelancer, 1 for Employer
  const [freelancerData, setFreelancerData] = useState<SignInData>({ email: '', password: '' });
  const [employerData, setEmployerData] = useState<SignInData>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});

  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.users);
  const navigate = useNavigate();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const validateField = (name: string, value: string, type: 'Freelancer' | 'Employer') => {
    const newErrors: FormErrors = { ...errors };

    if (!value) {
      newErrors[name as keyof FormErrors] = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    } else if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
      newErrors.email = 'Enter a valid email';
    } else {
      newErrors[name as keyof FormErrors] = '';
    }

    setErrors(newErrors);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: 'Freelancer' | 'Employer'
  ) => {
    const { name, value } = event.target;

    if (type === 'Freelancer') {
      setFreelancerData({ ...freelancerData, [name]: value });
    } else {
      setEmployerData({ ...employerData, [name]: value });
    }

    validateField(name, value, type);
  };

  const validate = (type: 'Freelancer' | 'Employer') => {
    const formData = type === 'Freelancer' ? freelancerData : employerData;
    const newErrors: FormErrors = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (type: 'Freelancer' | 'Employer') => {
    if (validate(type)) {
      const userData = type === 'Freelancer' ? freelancerData : employerData;

      const findUser = users.usersList.find(
        (user: User) => user.email === userData.email && user.password === userData.password && user.userType === type
      );
      if (findUser) {
        dispatch(login(findUser));
        navigate('/jobslist');
      } else {
        alert('Invalid credentials');
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 5 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            Sign In
          </Typography>

          <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Freelancer" />
            <Tab label="Employer" />
          </Tabs>

          {activeTab === 0 && (
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                value={freelancerData.email}
                onChange={(e) => handleChange(e, 'Freelancer')}
                error={!!errors.email}
                helperText={errors.email}
                margin="normal"
              />
              <TextField
                fullWidth
                type="password"
                name="password"
                label="Password"
                value={freelancerData.password}
                onChange={(e) => handleChange(e, 'Freelancer')}
                error={!!errors.password}
                helperText={errors.password}
                margin="normal"
              />
            </Box>
          )}

          {activeTab === 1 && (
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                value={employerData.email}
                onChange={(e) => handleChange(e, 'Employer')}
                error={!!errors.email}
                helperText={errors.email}
                margin="normal"
              />
              <TextField
                fullWidth
                type="password"
                name="password"
                label="Password"
                value={employerData.password}
                onChange={(e) => handleChange(e, 'Employer')}
                error={!!errors.password}
                helperText={errors.password}
                margin="normal"
              />
            </Box>
          )}
        </CardContent>

        <CardActions sx={{ flexDirection: 'column' }}>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={() => handleSubmit(activeTab === 0 ? 'Freelancer' : 'Employer')}
          >
            Sign In
          </Button>
          <Typography sx={{ mt: 2 }}>
            Not registered?{' '}
            <Link href="/signup" underline="hover">
              Sign Up
            </Link>
          </Typography>
        </CardActions>
      </Card>
    </Box>
  );
};

export default SignIn;
