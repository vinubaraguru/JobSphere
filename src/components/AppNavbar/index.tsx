import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar, Menu, MenuItem, Box, Switch } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { logout } from '../../features/user-slice';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../../themeContextProvider/ThemeContextProvider';

const AppNavBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const userInfo = useSelector((state: RootState) => state.users.loggedInUserInfo);
  const navigate = useNavigate();
  const { toggleTheme, themeMode } = useThemeContext();

  const handleAvatarClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    dispatch(logout());
    navigate('/signin');
    handleMenuClose();
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleProfile = () => {
    navigate('/userprofile');
    handleMenuClose();
  };

  const handlePostJob = () => {
    navigate('/postjob');
  };

  const handleHomePage = () => {
    navigate('/jobslist');
  };

  useEffect(() => {
    if (userInfo) {
      setLoggedInUser(userInfo.user);
    }
  }, [userInfo]);

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={handleHomePage}>
          JobSphere
        </Typography>
        <Switch checked={themeMode === 'dark'} onChange={toggleTheme} name="themeToggle" color="primary" />
        {!loggedInUser && (
          <Button color="inherit" onClick={handleSignIn}>
            Sign In
          </Button>
        )}

        {loggedInUser && loggedInUser.userType === 'Employer' && (
          <Button color="inherit" onClick={handlePostJob}>
            Post Job
          </Button>
        )}

        {loggedInUser && (
          <Box>
            <Button
              color="inherit"
              startIcon={<Avatar>{loggedInUser?.firstName?.charAt(0).toUpperCase()}</Avatar>}
              onClick={handleAvatarClick}
            />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppNavBar;
