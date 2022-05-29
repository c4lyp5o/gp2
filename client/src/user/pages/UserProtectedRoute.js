import { Navigate } from 'react-router-dom';
import { useGlobalUserAppContext } from '../context/userAppContext';

function UserProtectedRoute({ children }) {
  const { user } = useGlobalUserAppContext();

  if (!user) {
    return <Navigate to='/' />;
  }
  return children;
}

export default UserProtectedRoute;
