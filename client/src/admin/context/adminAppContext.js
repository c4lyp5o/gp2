import React, { useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useToken, getTokenized } from './Tokenizer';

const AdminAppContext = React.createContext();

function AdminAppProvider({ children }) {
  const { token, setToken } = useToken();
  const navigate = useNavigate();

  // user

  async function getCurrentUser() {
    let response = await axios.post(`/api/v1/superadmin/newroute`, {
      token: getTokenized(),
      main: 'UserCenter',
      Fn: 'read',
    });
    return response;
  }

  // data

  const createData = async (type, data) => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'DataCenter',
      Fn: 'create',
      FType: type,
      Data: data,
      token: getTokenized(),
    });
    return response;
  };

  const readData = async (type) => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'DataCenter',
      Fn: 'read',
      FType: type,
      token: getTokenized(),
    });
    return response;
  };

  const readKpData = async () => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'DataCenter',
      Fn: 'read',
      FType: 'kp',
      token: getTokenized(),
    });
    return response;
  };

  const readSekolahData = async (FType) => {
    const response = await axios.get('https://erkm.calypsocloud.one/data');
    switch (FType) {
      case 'sr':
        return response.data.sekolahRendah;
      case 'sm':
        return response.data.sekolahMenengah;
      default:
        console.log('there was no request');
    }
  };

  const readOneData = async (type, id) => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'DataCenter',
      Fn: 'readOne',
      FType: type,
      Id: id,
      token: getTokenized(),
    });
    return response;
  };

  const updateData = async (type, id, data) => {
    console.log(data);
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'DataCenter',
      Fn: 'update',
      FType: type,
      Id: id,
      Data: data,
      token: getTokenized(),
    });
    return response;
  };

  const deleteData = async (type, id) => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'DataCenter',
      Fn: 'delete',
      FType: type,
      Id: id,
      token: getTokenized(),
    });
    return response;
  };

  //

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
        createData,
        readData,
        readOneData,
        readSekolahData,
        readKpData,
        updateData,
        deleteData,
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
