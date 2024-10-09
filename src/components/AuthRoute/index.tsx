import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import AuthRequired from '../AuthRequired';

const AuthRoute = ({ children }: any) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.users.loggedInUserInfo);
  return isAuthenticated === true ? children : <AuthRequired />;
};

export default AuthRoute;
