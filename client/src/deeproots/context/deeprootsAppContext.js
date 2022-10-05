import React, { useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useToken, getTokenized } from './Tokenizer';

const DeeprootsAppContext = React.createContext();

function DeeprootsProvider({ children }) {
  const { token, setToken } = useToken();
  const navigate = useNavigate();

  async function loginUser(credentials) {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      apiKey: process.env.REACT_APP_API_KEY,
      username: credentials.username,
      password: credentials.password,
      main: 'Deeproots',
      Fn: 'update',
    });
    return response;
  }

  async function checkUser(username) {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      apiKey: process.env.REACT_APP_API_KEY,
      username: username,
      main: 'Deeproots',
      Fn: 'read',
    });
    return response;
  }

  // read pegawai data

  const readPegawaiData = async () => {
    const response = await axios.get('https://erkm.calypsocloud.one/pegawai');
    return response.data;
  };

  // get mdtb data

  const readMdtbData = async () => {
    const response = await axios.get('https://erkm.calypsocloud.one/mdtb');
    console.log(response.data);
    return response.data;
  };

  // read fasiliti data

  const readFasilitiData = async () => {
    const response = await axios.get('https://erkm.calypsocloud.one/fasiliti');
    console.log(response.data);
    return response.data;
  };

  const catchAxiosErrorAndLogout = () => {
    localStorage.removeItem('deeprootsToken');
  };

  const setDeeprootsToken = (token) => {
    token = { ...token, expires: Date.now() + 1000 * 60 * 60 * 24 * 7 };
    localStorage.setItem('deeprootsToken', JSON.stringify(token));
  };

  // query data
  const readUmumData = async (type) => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      apiKey: process.env.REACT_APP_API_KEY,
      main: 'Deeproots',
      Fn: 'readUmumData',
      // FType: type,
      // token: getTokenized(),
    });
    return response;
  };

  const readSpecificUmumData = async (type, kodFasiliti) => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      apiKey: process.env.REACT_APP_API_KEY,
      main: 'Deeproots',
      Fn: 'readSpecificUmumData',
      // FType: type,
      kodFasiliti: kodFasiliti,
      // token: getTokenized(),
    });
    return response;
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

  return (
    <DeeprootsAppContext.Provider
      value={{
        loginUser,
        checkUser,
        token,
        setToken,
        setDeeprootsToken,
        catchAxiosErrorAndLogout,
        Dictionary,
        readPegawaiData,
        readMdtbData,
        readFasilitiData,
        navigate,
        toast,
        getTokenized,
        readUmumData,
        readSpecificUmumData,
      }}
    >
      {children}
    </DeeprootsAppContext.Provider>
  );
}

const useGlobalDeeprootsContext = () => {
  return useContext(DeeprootsAppContext);
};

export { DeeprootsProvider, useGlobalDeeprootsContext };
