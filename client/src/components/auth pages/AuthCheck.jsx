import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useUserStore from '../../stores/userStore';
import axiosInstance from '../../api/axios';

const AuthCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useUserStore((state) => state.token);
  const user = useUserStore((state) => state.user);
  const isLoggedOut = useUserStore((state) => state.isLoggedOut);

  useEffect(() => {
    if (location.pathname.startsWith('/auth/')) {
      return;
    }

    const checkAuth = async () => {
      if (!token && !isLoggedOut) {
        try {
          const { data } = await axiosInstance.post('/refresh');
          
          if (data.token && data.user) {
            useUserStore.getState().setToken(data.token);
            useUserStore.getState().setUser(data.user);
            useUserStore.getState().setLoggedOut(false);
          } else {
            throw new Error('Invalid response data');
          }
        } catch (err) {
          console.error('Auth check error:', err);
          useUserStore.getState().logout();
          navigate('/auth/login');
        }
      } else if (!token && isLoggedOut) {
        navigate('/auth/login');
      }
    };

    checkAuth();
  }, [token, user, navigate, location.pathname, isLoggedOut]);

  return null;
};

export default AuthCheck; 