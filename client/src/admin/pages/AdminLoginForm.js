import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

import { useGlobalAdminAppContext } from '../context/adminAppContext';

import { ToastContainer } from 'react-toastify';

import AdminHeader from '../components/AdminHeader';
import AdminFooter from '../components/AdminFooter';

async function loginUser(credentials) {
  const response = await axios.post(`/api/v1/superadmin/newroute`, {
    apiKey: process.env.REACT_APP_API_KEY,
    username: credentials.username,
    password: credentials.password,
    main: 'UserCenter',
    Fn: 'update',
  });
  return response;
}

async function checkUser(username) {
  const response = await axios.post(`/api/v1/superadmin/newroute`, {
    apiKey: process.env.REACT_APP_API_KEY,
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
  console.log(showTempPass);
  if (showPasswordBox === true) {
    return (
      <div>
        <h3 className='text-xl font-semibold mt-10'>
          sila masukkan Key verifikasi
        </h3>
        {/* <p className='text-admin2 lowercase'>
          Password sementara (copypaste ke box password): {showTempPass}
        </p> */}
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
  const { setToken, toast } = useGlobalAdminAppContext();
  const [username, setUserName] = useState();
  const [showUserIDBox, setShowUserIDBox] = useState(true);
  const [password, setPassword] = useState();
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [ErrMsg, setErrMsg] = useState('');
  const [showTempPass, setShowTempPass] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

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
        toast.error(error.response.data.message);
        return;
      }
      setShowPasswordBox(true);
    }

    if (showPasswordBox === true) {
      setLoggingIn(true);
      if (!password) {
        setErrMsg('Sila masukkan Kata Laluan');
        return;
      }
      setErrMsg('');
      setTimeout(async () => {
        try {
          const response = await loginUser({
            username,
            password,
          });
          setToken(response.data.adminToken);
          setLoggingIn(false);
          navigate('/pentadbir/landing');
        } catch (error) {
          toast.error(error.response.data.message);
          setLoggingIn(false);
        }
      }, 1000);
    }
  };

  return (
    <>
      <AdminHeader />
      <div className='absolute inset-0 -z-10 flex bg-admin5 text-center justify-center items-center capitalize'>
        <div className='w-1/2 h-[25rem] mt-20 mb-5 bg-adminWhite outline outline-1 outline-userBlack rounded-md shadow-xl'>
          <div className='login-wrapper'>
            <h3 className='text-xl font-semibold mt-10'>
              sila masukkan ID pendatbir
            </h3>
            <form onSubmit={handleSubmit}>
              {userIDBox({ setUserName, showUserIDBox })}
              {passwordBox({ setPassword, showPasswordBox, showTempPass })}
              <p className='mt-10 mb-5 text-xs text-admin1'>{ErrMsg}</p>
              <div className='grid grid-cols-2 gap-2 ml-20 mr-20'>
                <Link
                  to='/'
                  className='capitalize bg-admin4 text-adminWhite rounded-md shadow-xl p-2 hover:bg-admin1 transition-all'
                >
                  kembali ke halaman utama
                </Link>
                {loggingIn ? (
                  <button
                    type='button'
                    className='inline-flex items-center text-center justify-center px-4 py-2 bg-admin3 text-adminWhite rounded-md shadow-xl p-2 hover:bg-admin1 transition-all ease-in-out duration-150 cursor-not-allowed'
                    disabled=''
                  >
                    <svg
                      className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    Sedang Log Masuk...
                  </button>
                ) : (
                  <button
                    type='submit'
                    className='capitalize bg-admin3 text-adminWhite rounded-md shadow-xl p-2 hover:bg-admin1 transition-all'
                  >
                    log masuk
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      <AdminFooter />
      <ToastContainer />
    </>
  );
}
