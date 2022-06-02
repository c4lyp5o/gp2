import { Navigate } from 'react-router-dom';
import { useGlobalUserAppContext } from '../context/userAppContext';

function UserProtectedRoute({ children }) {
  const { userToken } = useGlobalUserAppContext();

  if (!userToken) {
    return <Navigate to='/' />;
  }
  return children;
}

export default UserProtectedRoute;
