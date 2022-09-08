import React, { useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from 'react-toastify';
import { useToken, getTokenized } from './Tokenizer';

const AdminAppContext = React.createContext();

function AdminAppProvider({ children }) {
  const { token, setToken } = useToken();
  const navigate = useNavigate();
  const toast = useToast();

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
    ins: 'Institusi',
    kpb: 'KP Bergerak',
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
        toast,
        getTokenized,
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
