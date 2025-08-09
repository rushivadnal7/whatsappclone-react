import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store/index';
import { getProfile, initializeAuth } from '../store/slices/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { isAuthenticated, loading, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Initialize auth state from localStorage
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    // If authenticated but no user data, fetch profile
    if (isAuthenticated && !user && !loading) {
      dispatch(getProfile());
    }
  }, [isAuthenticated, user, loading, dispatch]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
