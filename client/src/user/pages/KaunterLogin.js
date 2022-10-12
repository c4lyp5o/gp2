import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';

import { useGlobalUserAppContext } from '../context/userAppContext';

import KaunterHeader from '../components/KaunterHeader';
import KaunterFooter from '../components/KaunterFooter';

function KaunterLogin() {
  const { loginErrorMessage, isLoginError, loginKaunter } =
    useGlobalUserAppContext();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hilang = () => {
    setShowPassword(!showPassword);
  };

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
        <div className='w-5/6 lg:w-1/2 h-[25rem] mt-20 mb-5 bg-kaunterWhite outline outline-1 outline-kaunterBlack rounded-md shadow-xl'>
          <div>
            <h3 className='text-xl font-semibold mt-20'>
              sila masukkan ID pendaftaran
            </h3>
            <form onSubmit={handleSubmit}>
              <div className='grid grid-rows-2 gap-2 justify-center items-center'>
                <div className='relative'>
                  <input
                    className='mt-5 appearance-none leading-7 px-3 py-1 ring-2 ring-kaunter2 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md peer'
                    type='text'
                    placeholder='ID Pendaftaran'
                    id='username-pendaftaran'
                    name='username-pendaftaran'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <label
                    htmlFor='username-pendaftaran'
                    className='absolute left-3 bottom-8 text-xs text-kaunter2 bg-userWhite peer-placeholder-shown:text-kaunter2 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-8 peer-focus:text-xs transition-all'
                  >
                    ID Pendaftaran
                  </label>
                </div>
                <div className='relative'>
                  <input
                    className='mt-5 appearance-none leading-7 px-3 py-1 ring-2 ring-kaunter2 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md peer'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Kata Laluan'
                    id='password-pendaftaran'
                    name='password-pendaftaran'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label
                    htmlFor='password-pendaftaran'
                    className='absolute left-3 bottom-8 text-xs text-kaunter2 bg-userWhite peer-placeholder-shown:text-kaunter2 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-8 peer-focus:text-xs transition-all'
                  >
                    Kata Laluan
                  </label>
                  <div className='absolute top-7 right-3 text-xl text-kaunter2'>
                    {showPassword ? (
                      <AiFillEye onClick={hilang} />
                    ) : (
                      <AiFillEyeInvisible onClick={hilang} />
                    )}
                  </div>
                </div>
              </div>
              {isLoginError && (
                <p className='max-w-max mx-auto mt-5 text-sm text-kaunter6'>
                  {loginErrorMessage}
                </p>
              )}
              <div className='grid lg:grid-cols-2 gap-2 mt-7 ml-20 mr-20'>
                <Link
                  to='/'
                  className='order-last lg:order-first capitalize bg-kaunter3 text-userWhite rounded-md shadow-xl p-2 hover:bg-kaunter1 transition-all'
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
                    className='order-first lg:order-last capitalize bg-kaunter2 text-userWhite rounded-md shadow-xl p-2 hover:bg-kaunter1 transition-all'
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
