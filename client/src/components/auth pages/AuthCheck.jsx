import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../stores/userStore';

const AuthCheck = () => {
  const navigate = useNavigate();
  const token = useUserStore((state) => state.token);
  const refreshToken = useUserStore((state) => state.refreshToken);

  useEffect(() => {
    const checkAuth = async () => {
      if (!token || !refreshToken) {
        navigate('/auth/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ refreshToken })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.token && data.user) {
          useUserStore.getState().setToken(data.token);
          useUserStore.getState().setUser(data.user);
          if (data.refreshToken) {
            useUserStore.getState().setRefreshToken(data.refreshToken);
          }
        } else {
          throw new Error('Invalid response data');
        }
      } catch (err) {
        console.error('Auth check error:', err);
        useUserStore.getState().logout();
        navigate('/auth/login');
      }
    };

    checkAuth();
  }, [token, refreshToken, navigate]);

  return null;
};

export default AuthCheck; 