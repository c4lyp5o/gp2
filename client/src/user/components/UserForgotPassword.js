import { useState } from 'react';

function UserForgotPassword() {
  const [isForgotSent, setIsForgotSent] = useState(true);
  const [emelKlinik, setEmelKlinik] = useState();

  const handleSubmit = () => {
    // do something..
  };

  if (isForgotSent === true) {
  }

  return (
    <>
      <div className='mt-10'>LUPA KATA LALUAN</div>
      {isForgotSent ? (
        <div>
          <div>kata laluan akan dihantar ke emel yang anda masukkan</div>
          <br />
          <div>sila semak inbox dan ikuti arahan</div>
          <br />
          <button
            type='button'
            className='capitalize bg-user3 text-userWhite rounded-md shadow-xl p-2 px-7 ml-10 hover:bg-user1 transition-all'
          >
            kembali
          </button>
        </div>
      ) : (
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
      )}
    </>
  );
}

export default UserForgotPassword;
