import { Navigate, Outlet } from 'react-router-dom';
import useUserStore from '../../stores/userStore';

const AdminRoute = () => {
  const token = useUserStore((state) => state.token);
  const user = useUserStore((state) => state.user);
  
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute; 