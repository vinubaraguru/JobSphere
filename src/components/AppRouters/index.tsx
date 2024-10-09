import React, { lazy, Suspense, memo } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner';

const SignIn = lazy(() => import('../SignIn'));
const SignUp = lazy(() => import('../SignUp'));
const PostJob = lazy(() => import('../PostJob'));
const UserProfile = lazy(() => import('../UserProfile'));
const JobsList = lazy(() => import('../JobsList'));
const JobDetails = lazy(() => import('../JobDetails'));
const NotFound = lazy(() => import('../NotFound'));
const AuthRoute = lazy(() => import('../AuthRoute'));
const ProtectedRoute = lazy(() => import('../ProtectedRoute'));

const AppRoutes = memo(() => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/postjob"
          element={
            <AuthRoute>
              <ProtectedRoute allowedRoles={['Employer']}>
                <PostJob />
              </ProtectedRoute>
            </AuthRoute>
          }
        />
        <Route
          path="/userprofile"
          element={
            <AuthRoute>
              <UserProfile />
            </AuthRoute>
          }
        />
        <Route path="/" element={<JobsList />} />
        <Route path="/jobslist" element={<JobsList />} />
        <Route path="/jobdetails/:id" element={<JobDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
});

export default AppRoutes;
