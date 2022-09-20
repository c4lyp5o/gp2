import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useGlobalUserAppContext } from '../context/userAppContext';

import KaunterHeader from '../components/KaunterHeader';
import KaunterFooter from '../components/KaunterFooter';

function KaunterLogin() {
  const { loginErrorMessage, isLoginError, loginKaunter } =
    useGlobalUserAppContext();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoggingIn(!loggingIn);
    setTimeout(() => {
      loginKaunter({ username, password });
      setLoggingIn(!loggingIn);
    }, 1000);
  };

  return (
    <>
      <KaunterHeader />
      <div className='absolute inset-0 -z-10 flex bg-kaunter3 text-center justify-center items-center capitalize'>
        <div className='w-1/2 h-[25rem] mt-20 mb-5 bg-kaunterWhite outline outline-1 outline-kaunterBlack rounded-md shadow-xl'>
          <div>
            <h3 className='text-xl font-semibold mt-20'>
              sila masukkan ID kaunter
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                className='mt-5 appearance-none leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-kaunter1 focus:outline-none rounded-md shadow-xl'
                type='text'
                placeholder='ID Kaunter'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <br />
              <input
                className='mt-5 appearance-none leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-kaunter1 focus:outline-none rounded-md shadow-xl'
                type='password'
                placeholder='Kata Laluan'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <br />
              {isLoginError && (
                <p className='max-w-max mx-auto mt-5 text-sm text-kaunter6'>
                  {loginErrorMessage}
                </p>
              )}
              <div className='grid grid-cols-2 gap-2 mt-7 ml-20 mr-20'>
                <Link
                  to='/'
                  className='capitalize bg-kaunter3 text-userWhite rounded-md shadow-xl p-2 hover:bg-kaunter1 transition-all'
                >
                  kembali ke halaman utama
                </Link>
                {loggingIn ? (
                  <button
                    type='button'
                    class='inline-flex items-center text-center justify-center px-4 py-2 capitalize bg-kaunter2 text-userWhite rounded-md shadow-xl p-2 hover:bg-kaunter1 transition-all ease-in-out duration-150 cursor-not-allowed'
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
                    Sedang Log Masuk...
                  </button>
                ) : (
                  <button
                    type='submit'
                    className='capitalize bg-kaunter2 text-userWhite rounded-md shadow-xl p-2 hover:bg-kaunter1 transition-all'
                  >
                    log masuk
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      <KaunterFooter />
    </>
  );
}

export default KaunterLogin;
