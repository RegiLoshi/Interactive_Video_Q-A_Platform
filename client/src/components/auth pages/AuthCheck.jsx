import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useUserStore from '../../stores/userStore';

const AuthCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useUserStore((state) => state.token);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (location.pathname.startsWith('/auth/')) {
      return;
    }

    const checkAuth = async () => {
      if (!token) {
        try {
          const response = await fetch('http://localhost:3000/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', 
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          
          if (data.token && data.user) {
            useUserStore.getState().setToken(data.token);
            useUserStore.getState().setUser(data.user);
          } else {
            throw new Error('Invalid response data');
          }
        } catch (err) {
          console.error('Auth check error:', err);
          useUserStore.getState().logout();
          navigate('/auth/login');
        }
      }
    };

    checkAuth();
  }, [token, user, navigate, location.pathname]);

  return null;
};

export default AuthCheck; 