import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

import { useGlobalUserAppContext } from '../context/userAppContext';

function KaunterProtectedRoute({ children }) {
  const { kaunterToken, catchAxiosErrorAndLogout } = useGlobalUserAppContext();

  const [isTokenCorrect, setIsTokenCorrect] = useState(null);

  useEffect(() => {
    const fetchIdentity = async () => {
      try {
        await axios.get('/api/v1/identity', {
          headers: { Authorization: `Bearer ${kaunterToken}` },
        });
        setIsTokenCorrect(true);
      } catch (error) {
        catchAxiosErrorAndLogout();
        setIsTokenCorrect(false);
      }
    };
    fetchIdentity();
  }, [kaunterToken]);

  if (isTokenCorrect === false) {
    return <Navigate to='/kaunter' />;
  }
  if (isTokenCorrect === true) {
    return children;
  }
}

export default KaunterProtectedRoute;
