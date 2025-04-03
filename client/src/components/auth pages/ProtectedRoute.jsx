import { Navigate, Outlet } from 'react-router-dom';
import useUserStore from '../../stores/userStore';

const ProtectedRoute = () => {
  const token = useUserStore((state) => state.token);
  
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute; 