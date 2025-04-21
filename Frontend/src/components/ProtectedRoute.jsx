import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const authToken = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole');
  
  if (!authToken || !allowedRoles.includes(userRole)) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    
    console.log('Unauthorized access attempt. User logged out.');
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;