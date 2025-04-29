import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useUserStore from '../../stores/userStore';

const ProtectedRoute = () => {
  const token = useUserStore((state) => state.token);
  const user = useUserStore((state) => state.user);
  const location = useLocation();
  
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user?.role === 'ADMIN' && location.pathname === '/dashboard') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute; 