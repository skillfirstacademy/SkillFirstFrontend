import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../api/axios';
import { logout } from '../Features/authSlice';
import { showError } from '../Componnets/AppToaster';

export const useSessionValidator = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Check session validity every 10 seconds
    const validateSession = async () => {
      const token = localStorage.getItem('accessToken');
      
      if (!token) return;

      try {
        // Make a lightweight API call to verify session
        await api.get('/validate-session');
      } catch (error) {
        if (error.response?.status === 401 && error.response?.data?.code === 'DEVICE_MISMATCH') {          
          // Clear auth data
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          
          dispatch(logout());
          showError("You've been logged out - logged in from another device");
          navigate('/login');
        }
      }
    };

    // Validate immediately
    validateSession();

    // Then validate every 10 seconds
    const interval = setInterval(validateSession, 10000);

    return () => clearInterval(interval);
  }, [navigate, dispatch]);
};