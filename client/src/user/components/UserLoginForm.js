import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';

import { useGlobalUserAppContext } from '../context/userAppContext';

import UserForgotPassword from './UserForgotPassword';

function UserLoginForm() {
  const { loginErrorMessage, isLoginError, loginUser, loggingInUser } =
    useGlobalUserAppContext();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const hilang = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      loginUser({ username, password });
    }, 1000);
  };

  if (isForgotPassword === true) {
    return <UserForgotPassword setIsForgotPassword={setIsForgotPassword} />;
  }

  return (
    <>
      <h3 className='text-xl font-semibold mt-10'>sila masukkan kata laluan</h3>
      <form onSubmit={handleSubmit}>
        <div className='grid grid-rows-2 gap-2 justify-center items-center'>
          <div className='relative'>
            <input
              className='mt-5 appearance-none leading-7 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user3 focus:outline-none rounded-md peer'
              type='text'
              placeholder=' '
              id='username'
              name='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label
              htmlFor='username'
              className='absolute left-3 bottom-8 text-xs text-user3 bg-userWhite peer-placeholder-shown:text-user3 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-8 peer-focus:text-xs transition-all'
            >
              ID Pengguna
            </label>
          </div>
          <div className='relative'>
            <input
              className='mt-5 appearance-none leading-7 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user3 focus:outline-none rounded-md peer'
              type={showPassword ? 'text' : 'password'}
              placeholder=' '
              value={password}
              id='password'
              name='password'
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label
              htmlFor='password'
              className='absolute left-3 bottom-8 text-xs text-user3 bg-userWhite peer-placeholder-shown:text-user3 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-8 peer-focus:text-xs transition-all'
            >
              Kata Laluan
            </label>
            <div className='absolute top-7 right-3 text-xl text-user3'>
              {showPassword ? (
                <AiFillEye onClick={hilang} />
              ) : (
                <AiFillEyeInvisible onClick={hilang} />
              )}
            </div>
          </div>
        </div>
        {isLoginError && (
          <p className='max-w-max mx-auto mt-5 text-sm text-user6'>
            {loginErrorMessage}
          </p>
        )}
        {/* <p
          className='max-w-max mx-auto mt-5 mb-3 text-xs text-user6 underline hover:cursor-pointer'
          onClick={() => setIsForgotPassword(true)}
        >
          lupa kata laluan
        </p> */}
        <div className='grid lg:grid-cols-2 gap-2 mt-7 ml-20 mr-20'>
          <Link
            to='/'
            className='order-last lg:order-first capitalize bg-user6 text-userWhite rounded-md shadow-xl p-2 hover:bg-user1 transition-all'
          >
            kembali ke halaman utama
          </Link>
          {loggingInUser ? (
            <button
              type='button'
              className='inline-flex items-center text-center justify-center px-4 py-2 order-first lg:order-last capitalize bg-user3 text-userWhite rounded-md shadow-xl p-2 hover:bg-user1 transition-all ease-in-out duration-150 cursor-not-allowed'
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
