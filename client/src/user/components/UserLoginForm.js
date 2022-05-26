import { useState } from 'react';

import UserForgotPassword from './UserForgotPassword';

function UserLoginForm() {
  const [idPengguna, setIdPengguna] = useState('');
  const [kataLaluan, setKataLaluan] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // some code here..
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
          value={idPengguna}
          onChange={(e) => setIdPengguna(e.target.value)}
          required
        />
        <br />
        <input
          className='mt-5 appearance-none leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-xl'
          type='password'
          placeholder='Kata Laluan'
          value={kataLaluan}
          onChange={(e) => setKataLaluan(e.target.value)}
          required
        />
        <br />
        <p
          className='max-w-max mx-auto mt-10 mb-3 text-xs text-user6 underline hover:cursor-pointer'
          onClick={() => setIsForgotPassword(true)}
        >
          lupa kata laluan
        </p>
        <button
          type='submit'
          className='capitalize bg-user3 text-userWhite rounded-md shadow-xl p-2 hover:bg-user1 transition-all'
        >
          log masuk
        </button>
      </form>
    </>
  );
}

export default UserLoginForm;
