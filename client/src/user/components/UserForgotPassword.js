import { useState } from 'react';

function UserForgotPassword({ setIsForgotPassword }) {
  const [emelKlinik, setEmelKlinik] = useState('');
  const [isForgotSent, setIsForgotSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsForgotSent(true);
    // do something with email sent for password reset..
  };

  return (
    <div className='mt-20 ml-10 mr-10 p-3 outline outline-1 outline-userBlack rounded-md shadow-xl'>
      <div className='py-1 bg-user3 font-bold'>LUPA KATA LALUAN</div>
      {isForgotSent ? (
        <div>
          <div className='mt-3 font-bold'>
            kata laluan akan dihantar ke emel yang anda masukkan
          </div>
          <br />
          <div className='font-bold'>sila semak inbox dan ikuti arahan</div>
          <br />
          <button
            onClick={() => setIsForgotPassword(false)}
            type='button'
            className='capitalize bg-user3 text-userWhite rounded-md shadow-xl p-2 px-7 hover:bg-user1 transition-all'
          >
            kembali
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className='mt-3 font-bold'>sila masukkan emel klinik</div>
          <input
            className='mt-5 appearance-none leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-xl'
            type='email'
            placeholder='Emel klinik'
            value={emelKlinik}
            onChange={(e) => setEmelKlinik(e.target.value)}
            // required // disabled for testing purpose
          ></input>
          <button
            type='submit'
            className='capitalize bg-user3 text-userWhite rounded-md shadow-xl p-2 px-7 ml-10 hover:bg-user1 transition-all'
          >
            reset
          </button>
          <br />
          <button
            onClick={() => setIsForgotPassword(false)}
            type='button'
            className='capitalize bg-user3 text-userWhite rounded-md shadow-xl p-2 mt-10 px-7 hover:bg-user1 transition-all'
          >
            kembali
          </button>
        </form>
      )}
    </div>
  );
}

export default UserForgotPassword;
