import React, { useState } from 'react';
import { TextField, Button, MenuItem, Box, Typography, Link, Card, CardContent, CardActions } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { addUser, selectUserExists } from '../../features/user-slice';
import { useNavigate } from 'react-router-dom';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  userType: 'Freelancer' | 'Employer';
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  userType?: string;
  existingUser?: string;
}

const SignUp = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    userType: 'Freelancer',
  });

  const dispatch = useDispatch<AppDispatch>();
  const usersList = useSelector((state: RootState) => state.users);
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();

  const allowedFreelancerDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'freelancer.com'];

  const validateField = (name: string, value: string) => {
    const newErrors: FormErrors = { ...errors };

    switch (name) {
      case 'firstName':
        newErrors.firstName = value ? '' : 'First name is required';
        break;
      case 'lastName':
        newErrors.lastName = value ? '' : 'Last name is required';
        break;
      case 'email':
        if (!value) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.email = 'Enter a valid email';
        } else {
          const domain = value.split('@')[1];
          if (formData.userType === 'Employer' && domain === 'gmail.com') {
            newErrors.email = 'Employers cannot use gmail.com';
          } else if (formData.userType === 'Freelancer' && !allowedFreelancerDomains.includes(domain)) {
            newErrors.email = 'Freelancers must use gmail.com, yahoo.com,freelancer.com, or outlook.com';
          } else {
            newErrors.email = '';
          }
        }
        break;
      case 'password':
        newErrors.password = value ? '' : 'Password is required';
        break;
      case 'phoneNumber':
        newErrors.phoneNumber = /^[0-9]{10}$/.test(value) ? '' : 'Phone number must be 10 digits';
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email';
    } else {
      const domain = formData.email.split('@')[1];
      if (formData.userType === 'Employer' && domain === 'employer.com') {
        newErrors.email = 'Employers cannot use employer.com';
      }
      if (formData.userType === 'Freelancer' && !allowedFreelancerDomains.includes(domain)) {
        newErrors.email = 'Freelancers must use gmail.com, yahoo.com, or outlook.com';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validate()) {
      if (selectUserExists(usersList, formData.email, formData.userType)) {
        const newErrors: FormErrors = { ...errors };
        newErrors.existingUser = 'User has already been registered';
        setErrors(newErrors);
      } else {
        dispatch(addUser(formData));
        navigate('/jobslist');
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    validateField(name, value);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Sign Up
          </Typography>
          {errors.existingUser && (
            <Typography color="error" variant="body2">
              {errors.existingUser}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
              margin="normal"
            />
            <TextField
              fullWidth
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
              margin="normal"
            />
            <TextField
              fullWidth
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
            />
            <TextField
              fullWidth
              type="password"
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              margin="normal"
            />
            <TextField
              fullWidth
              name="phoneNumber"
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              margin="normal"
            />
            <TextField
              select
              fullWidth
              name="userType"
              label="User Type"
              value={formData.userType}
              onChange={handleChange}
              error={!!errors.userType}
              helperText={errors.userType}
              margin="normal"
            >
              <MenuItem value="Freelancer">Freelancer</MenuItem>
              <MenuItem value="Employer">Employer</MenuItem>
            </TextField>
          </form>
        </CardContent>

        <CardActions sx={{ flexDirection: 'column' }}>
          <Button color="primary" variant="contained" fullWidth onClick={handleSubmit}>
            Sign Up
          </Button>

          <Typography sx={{ mt: 2 }}>
            Already registered?{' '}
            <Link href="/signin" underline="hover">
              Sign in
            </Link>
          </Typography>
        </CardActions>
      </Card>
    </Box>
  );
};

export default SignUp;
