import { Navigate } from 'react-router-dom';

import { useGlobalAdminAppContext } from '../context/adminAppContext';

function AdminProtectedRoute({ children }) {
  const { adminToken } = useGlobalAdminAppContext();

  if (!adminToken) {
    return <Navigate to='/' />;
  }
  return children;
}

export default AdminProtectedRoute;
