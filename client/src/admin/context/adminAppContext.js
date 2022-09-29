import React, { useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useToken, getTokenized } from './Tokenizer';

const AdminAppContext = React.createContext();

function AdminAppProvider({ children }) {
  const { token, setToken } = useToken();
  const navigate = useNavigate();

  async function pingApdmServer() {
    const response = await axios.get(`https://erkm.calypsocloud.one/`);
    return response;
  }

  const encryptEmail = (email) => {
    if (!email) return 'No email provided';
    const letterToEncrypt = Math.round(email.split('@')[0].length / 1.5);
    const encrypted =
      email
        .split('@')[0]
        .replace(
          email.split('@')[0].substring(0, letterToEncrypt),
          '*'.repeat(letterToEncrypt)
        ) +
      '@' +
      email.split('@')[1];
    return encrypted;
  };

  const encryptPassword = (password) => {
    if (!password) return 'No password provided';
    const letterToEncrypt = password.length;
    const encrypted = password.replace(
      password.substring(0, letterToEncrypt),
      '*'.repeat(letterToEncrypt)
    );
    return encrypted;
  };

  // user

  async function getCurrentUser() {
    let response = await axios.post(`/api/v1/superadmin/newroute`, {
      apiKey: process.env.REACT_APP_API_KEY,
      main: 'UserCenter',
      Fn: 'read',
      token: getTokenized(),
    });
    return response;
  }

  // data

  const createData = async (type, data) => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      apiKey: process.env.REACT_APP_API_KEY,
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
      apiKey: process.env.REACT_APP_API_KEY,
      main: 'DataCenter',
      Fn: 'read',
      FType: type,
      token: getTokenized(),
    });
    return response;
  };

  const readKpData = async () => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      apiKey: process.env.REACT_APP_API_KEY,
      main: 'DataCenter',
      Fn: 'read',
      FType: 'kp',
      token: getTokenized(),
    });
    return response;
  };

  const readOneData = async (type, id) => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      apiKey: process.env.REACT_APP_API_KEY,
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
      apiKey: process.env.REACT_APP_API_KEY,
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
      apiKey: process.env.REACT_APP_API_KEY,
      main: 'DataCenter',
      Fn: 'delete',
      FType: type,
      Id: id,
      token: getTokenized(),
    });
    return response;
  };

  // erkm

  const readSekolahData = async (FType) => {
    const response = await axios.get(
      'https://erkm.calypsocloud.one/listsekolah'
    );
    switch (FType) {
      case 'sr':
        return response.data[1].sekolahRendah;
      case 'sm':
        return response.data[2].sekolahMenengah;
      default:
        console.log('there was no request');
    }
  };

  // get mdtb data

  const readMdtbData = async () => {
    const response = await axios.get('https://erkm.calypsocloud.one/mdtb');
    return response.data;
  };

  const catchAxiosErrorAndLogout = () => {
    localStorage.removeItem('adminToken');
  };

  const Dictionary = {
    pp: 'Pegawai Pergigian',
    jp: 'Juruterapi Pergigian',
    taska: 'Taska',
    tadika: 'Tadika',
    sr: 'Sekolah Rendah',
    sm: 'Sekolah Menengah',
    ins: 'Institusi',
    kpb: 'KP Bergerak',
    mp: 'Makmal Pergigian',
  };

  // Components library

  function BusyButton({ label }) {
    return (
      <>
        <button
          type='button'
          class='inline-flex items-center text-center justify-center px-4 py-2 bg-admin3 text-adminWhite rounded-md shadow-xl p-2 hover:bg-admin1 transition-all ease-in-out duration-150 cursor-not-allowed'
          disabled=''
        >
          <svg
            class='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              class='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              stroke-width='4'
            ></circle>
            <path
              class='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            ></path>
          </svg>
          {label}
        </button>
      </>
    );
  }

  function SubmitButtton({ label }) {
    return (
      <button
        type='submit'
        className='capitalize bg-admin3 text-adminWhite rounded-md shadow-xl p-2 hover:bg-admin1 transition-all'
      >
        {label}
      </button>
    );
  }

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
        readMdtbData,
        readKpData,
        updateData,
        deleteData,
        navigate,
        toast,
        getTokenized,
        pingApdmServer,
        encryptEmail,
        encryptPassword,
        BusyButton,
        SubmitButtton,
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
