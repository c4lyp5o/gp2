import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useGlobalAdminAppContext } from '../context/adminAppContext';

import AdminHeader from '../components/AdminHeader';
import AdminFooter from '../components/AdminFooter';

async function loginUser(credentials) {
  const response = await axios.post(`/api/v1/superadmin/newroute`, {
    username: credentials.username,
    password: credentials.password,
    main: 'UserCenter',
    Fn: 'update',
  });
  return response;
}

async function checkUser(username) {
  const response = await axios.post(`/api/v1/superadmin/newroute`, {
    username,
    main: 'UserCenter',
    Fn: 'readOne',
  });
  return response;
}

function userIDBox({ setUserName, showUserIDBox }) {
  if (showUserIDBox === true) {
    return (
      <div>
        <input
          className='mt-5 appearance-none leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-admin1 focus:outline-none rounded-md shadow-xl'
          type='text'
          placeholder='ID Pengguna'
          onChange={(e) => setUserName(e.target.value)}
          required
        />
      </div>
    );
  }
}

function passwordBox({ setPassword, showPasswordBox, showTempPass }) {
  if (showPasswordBox === true) {
    return (
      <div>
        <h3 className='text-xl font-semibold mt-10'>
          sila masukkan Key verifikasi
        </h3>
        <p className='text-admin2 lowercase'>
          Password sementara (copypaste ke box password): {showTempPass}
        </p>
        <input
          className='mt-5 appearance-none leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-admin1 focus:outline-none rounded-md shadow-xl'
          type='password'
          placeholder='Kata Laluan'
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
    );
  }
}

export default function AdminLoginForm() {
  const { setToken } = useGlobalAdminAppContext();
  const [username, setUserName] = useState();
  const [showUserIDBox, setShowUserIDBox] = useState(true);
  const [password, setPassword] = useState();
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [ErrMsg, setErrMsg] = useState('');
  const [showTempPass, setShowTempPass] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (showPasswordBox === false) {
      if (!username) {
        setErrMsg('Sila masukkan ID Pengguna');
        return;
      }
      setErrMsg('');
      try {
        const response = await checkUser(username);
        setShowTempPass(response.data.tempKey);
      } catch (error) {
        setErrMsg(error.response.data.message);
        return;
      }
      setShowPasswordBox(true);
    }

    if (showPasswordBox === true) {
      if (!password) {
        setErrMsg('Sila masukkan Kata Laluan');
        return;
      }
      setErrMsg('');
      const key = process.env.REACT_APP_API_KEY;
      const token = await loginUser({
        username,
        password,
        key,
      });
      console.log(token);
      if (token.status === 401) {
        setErrMsg(token.data.message);
      } else {
        setToken(token.data.adminToken);
        navigate('/admin/landing');
      }
    }
  };

  return (
    <>
      <AdminHeader />
      <div className='absolute inset-0 -z-10 flex bg-admin5 text-center justify-center items-center capitalize'>
        <div className='w-1/2 h-[25rem] mt-20 mb-5 bg-adminWhite outline outline-1 outline-userBlack rounded-md shadow-xl'>
          <div className='login-wrapper'>
            <h3 className='text-xl font-semibold mt-10'>
              sila masukkan ID pengguna
            </h3>
            <form onSubmit={handleSubmit}>
              {userIDBox({ setUserName, showUserIDBox })}
              {passwordBox({ setPassword, showPasswordBox, showTempPass })}
              <p className='mt-5 text-xs text-admin1'>{ErrMsg}</p>
              <div className='mt-5 text-xs text-admin6 underline'>
                <a href='#lupa-kata-laluan'>lupa kata laluan</a>
              </div>
              <br />
              <button
                type='submit'
                className='capitalize bg-admin3 text-adminWhite rounded-md shadow-xl p-2 hover:bg-admin1 transition-all'
              >
                log masuk
              </button>
            </form>
          </div>
        </div>
      </div>
      <AdminFooter />
    </>
  );
}
