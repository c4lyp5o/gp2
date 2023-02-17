import { Navigate } from 'react-router-dom';

import { useGlobalAdminAppContext } from '../context/adminAppContext';

function AdminProtectedRoute({ children }) {
  const { adminToken } = useGlobalAdminAppContext();

  if (!adminToken) {
    return <Navigate to='/pentadbir' />;
  }
  return children;
}

export default AdminProtectedRoute;
