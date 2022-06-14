import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

import { useGlobalUserAppContext } from '../context/userAppContext';

function UserProtectedRoute({ children }) {
  const { userToken, username, catchAxiosErrorAndLogout } =
    useGlobalUserAppContext();

  const [isTokenCorrect, setIsTokenCorrect] = useState(null);

  useEffect(() => {
    const fetchIdentity = async () => {
      try {
        await axios.get('/api/v1/identity', {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setIsTokenCorrect(true);
      } catch (error) {
        catchAxiosErrorAndLogout();
        setIsTokenCorrect(false);
      }
    };
    fetchIdentity();
  }, [userToken]);

  if (isTokenCorrect === false || !username) {
    return <Navigate to='/' />;
  }
  if (isTokenCorrect === true && username) {
    return children;
  }
}

export default UserProtectedRoute;
