import { useState } from 'react';

function UserForgotPassword() {
  const [isForgotSent, setIsForgotSent] = useState(false);
  const [emelKlinik, setEmelKlinik] = useState();

  const handleSubmit = () => {
    // do something..
  };

  return (
    <>
      <div>LUPA KATA LALUAN</div>
      <form onSubmit={handleSubmit}>
        <div>sila masukkan emel klinik</div>
        <input
          className='mt-5 appearance-none leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-xl'
          type='text'
          placeholder='Emel klinik'
          value={emelKlinik}
          onChange={(e) => setEmelKlinik(e.target.value)}
          required
        ></input>
        <button
          type='submit'
          className='capitalize bg-user3 text-userWhite rounded-md shadow-xl p-2 px-7 ml-10 hover:bg-user1 transition-all'
        >
          reset
        </button>
      </form>
    </>
  );
}

export default UserForgotPassword;
