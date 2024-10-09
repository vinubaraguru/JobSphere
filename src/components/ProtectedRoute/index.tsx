import React, { useEffect, useState } from 'react';
import Unauthorized from '../Unauthorized';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const ProtectedRoute = ({ children, allowedRoles }: any) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.users.loggedInUserInfo);
  useEffect(() => {
    if (isAuthenticated) {
      let authorized = false;
      authorized = allowedRoles?.includes(user?.userType) && isAuthenticated;
      setIsAuthorized(authorized);
    }
  }, [isAuthenticated]);
  return isAuthorized === null ? null : isAuthorized === true ? children : <Unauthorized />;
};

export default ProtectedRoute;
