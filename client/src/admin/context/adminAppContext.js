import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToken, getTokenized } from './Tokenizer';
import axios from 'axios';

const AdminAppContext = React.createContext();

function AdminAppProvider({ children }) {
  const { token, setToken } = useToken();
  const navigate = useNavigate();

  async function getCurrentUser() {
    let response = await axios.post(`/api/v1/superadmin/getuser`, {
      token: getTokenized(),
    });
    return response;
  }

  const catchAxiosErrorAndLogout = () => {
    localStorage.removeItem('adminToken');
  };

  const Dictionary = {
    taska: 'Taska',
    tadika: 'Tadika',
    sr: 'Sekolah Rendah',
    sm: 'Sekolah Menengah',
    institusi: 'Institusi',
    'kp-bergerak': 'KP Bergerak',
  };

  return (
    <AdminAppContext.Provider
      value={{
        token,
        setToken,
        getCurrentUser,
        catchAxiosErrorAndLogout,
        Dictionary,
        navigate,
      }}
    >
      {children}
    </AdminAppContext.Provider>
  );
}

const useGlobalAdminAppContext = () => {
  return useContext(AdminAppContext);
};

export { AdminAppProvider, useGlobalAdminAppContext };
