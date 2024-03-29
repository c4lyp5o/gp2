import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useGlobalUserAppContext } from '../context/userAppContext';

import UserForgotPassword from './UserForgotPassword';

function UserLoginForm() {
  const { loginErrorMessage, isLoginError, loginUser } =
    useGlobalUserAppContext();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoggingIn(!loggingIn);
    setTimeout(() => {
      loginUser({ username, password });
      setLoggingIn(!loggingIn);
    }, 1000);
  };

  if (isForgotPassword === true) {
    return <UserForgotPassword setIsForgotPassword={setIsForgotPassword} />;
  }

  return (
    <>
      <h3 className='text-xl font-semibold mt-10'>sila masukkan kata laluan</h3>
      <form onSubmit={handleSubmit}>
        <input
          className='mt-5 appearance-none leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-xl'
          type='text'
          placeholder='ID Pengguna'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <input
          className='mt-5 appearance-none leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-xl'
          type='password'
          placeholder='Kata Laluan'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        {isLoginError && (
          <p className='max-w-max mx-auto mt-5 text-sm text-user6'>
            {loginErrorMessage}
          </p>
        )}
        <p
          className='max-w-max mx-auto mt-5 mb-3 text-xs text-user6 underline hover:cursor-pointer'
          onClick={() => setIsForgotPassword(true)}
        >
          lupa kata laluan
        </p>
        <div className='grid lg:grid-cols-2 gap-2 mt-5 ml-20 mr-20'>
          <Link
            to='/'
            className='order-last lg:order-first capitalize bg-user6 text-userWhite rounded-md shadow-xl p-2 hover:bg-user1 transition-all'
          >
            kembali ke halaman utama
          </Link>
          {loggingIn ? (
            <button
              type='button'
              class='inline-flex items-center text-center justify-center px-4 py-2 order-first lg:order-last capitalize bg-user3 text-userWhite rounded-md shadow-xl p-2 hover:bg-user1 transition-all ease-in-out duration-150 cursor-not-allowed'
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
              className='order-first lg:order-last capitalize bg-user3 text-userWhite rounded-md shadow-xl p-2 hover:bg-user1 transition-all'
            >
              log masuk
            </button>
          )}
        </div>
      </form>
    </>
  );
}

export default UserLoginForm;
