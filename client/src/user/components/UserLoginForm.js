import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useGlobalUserAppContext } from '../context/userAppContext';

import UserForgotPassword from './UserForgotPassword';

function UserLoginForm() {
  const { loginErrorMessage, isLoginError, loginUser } =
    useGlobalUserAppContext();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser({ username, password });
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
          <button
            type='submit'
            className='order-first lg:order-last capitalize bg-user3 text-userWhite rounded-md shadow-xl p-2 hover:bg-user1 transition-all'
          >
            log masuk
          </button>
        </div>
      </form>
    </>
  );
}

export default UserLoginForm;
