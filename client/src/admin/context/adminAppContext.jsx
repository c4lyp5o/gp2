import { createContext, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useToken } from './useToken';
import { useLogininfo } from './useLogininfo';
import { useOndemandSetting } from './useOndemandSetting';

const AdminAppContext = createContext();

function AdminAppProvider({ children }) {
  const navigate = useNavigate();
  const { adminToken, saveAdminToken, saveTotpToken, removeAdminToken } =
    useToken();
  const { removeLoginInfo } = useLogininfo();
  const { removeCurrentondemandSetting } = useOndemandSetting();

  // login data
  const readNegeri = async () => {
    const response = await axios.get('/api/v1/superadmin/getnegeri');
    return response;
  };
  const readDaerah = async (negeri) => {
    const response = await axios.get(
      `/api/v1/superadmin/getdaerah?negeri=${negeri}`
    );
    return response;
  };
  const readKlinik = async (daerah) => {
    const response = await axios.get(
      `/api/v1/superadmin/getklinik?daerah=${daerah}`
    );
    return response;
  };
  const readAdmins = async (kod) => {
    const response = await axios.get(
      `/api/v1/superadmin/getadmins?kodFasiliti=${kod}`
    );
    return response;
  };

  // login method
  const loginUser = async (credentials) => {
    const response = await axios.post(`/api/v1/superadmin/login`, {
      username: credentials.username,
      password: credentials.password,
    });
    if (response.data.adminToken) {
      saveAdminToken(response.data.adminToken);
    }
    return response;
  };
  const checkUser = async (username) => {
    const response = await axios.get(
      `/api/v1/superadmin/check?username=${username}`
    );
    return response;
  };

  // totp
  const generateSecret = async () => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'TotpManager',
      Fn: 'create',
      token: adminToken,
    });
    saveTotpToken(response.data.totpToken);
    return response;
  };
  const verifyInitialSecret = async (secret) => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'TotpManager',
      Fn: 'update',
      token: adminToken,
      initialTotpCode: secret,
      initialTotpToken: totpToken,
    });
    return response;
  };
  const verifySecret = async (secret) => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'TotpManager',
      Fn: 'update',
      token: adminToken,
      totpCode: secret,
    });
    return response;
  };

  // misc
  const getCurrentUser = async () => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'UserCenter',
      Fn: 'read',
      token: adminToken,
    });
    return response;
  };
  const saveCurrentUser = async (data) => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'UserCenter',
      Fn: 'updateOne',
      token: adminToken,
      data: data,
    });
    saveAdminToken(response.data.adminToken);
    return response;
  };
  const logOutUser = () => {
    removeAdminToken();
    removeLoginInfo();
    removeCurrentondemandSetting();
    navigate('/pentadbir');
  };

  return (
    <AdminAppContext.Provider
      value={{
        // toast
        toast,
        // navigation
        navigate,
        // login data
        readNegeri,
        readDaerah,
        readKlinik,
        readAdmins,
        // login method
        loginUser,
        checkUser,
        // totp
        generateSecret,
        verifyInitialSecret,
        verifySecret,
        // misc
        getCurrentUser,
        saveCurrentUser,
        logOutUser,
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
