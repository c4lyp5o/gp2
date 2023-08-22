import { Navigate } from 'react-router-dom';

import { useToken } from '../context/useToken';

function AdminProtectedRoute({ children }) {
  const { adminToken } = useToken();

  if (!adminToken) {
    return <Navigate to='/pentadbir' />;
  }
  return children;
}

export default AdminProtectedRoute;
