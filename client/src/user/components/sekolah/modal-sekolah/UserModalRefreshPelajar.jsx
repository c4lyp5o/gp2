import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaWindowClose } from 'react-icons/fa';

import { useGlobalUserAppContext } from '../../../context/userAppContext';

export default function UserModalRefreshSekolah({
  handleRefreshPelajar,
  setModalRefreshPelajar,
  id,
}) {
  const { userToken, userinfo, reliefUserToken, toast } =
    useGlobalUserAppContext();

  const [otpQuestion, setOtpQuestion] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  const handleOtpRequest = async () => {
    setIsSubmitDisabled(true);
    await toast.promise(
      axios.get(`/api/v1/getotp?id=${userinfo._id}&op=kemaskini-pelajar`, {
        headers: {
          Authorization: `Bearer ${
            reliefUserToken ? reliefUserToken : userToken
          }`,
        },
      }),
      {
        pending: `Menghantar OTP ke emel ${userinfo.email}`,
        success: `OTP telah dihantar ke emel ${userinfo.email}`,
        error: `OTP gagal dihantar`,
      },
      {
        autoClose: 5000,
      }
    );
    setOtpQuestion(true);
    setIsSubmitDisabled(false);
  };

  const handleOtpVerify = async () => {
    setIsSubmitDisabled(true);
    await toast
      .promise(
        axios.get(`/api/v1/getotp/verify?id=${userinfo._id}&otp=${otpInput}`, {
          headers: {
            Authorization: `Bearer ${
              reliefUserToken ? reliefUserToken : userToken
            }`,
          },
        }),
        {
          pending: 'Mengesahkan OTP...',
          success: 'OTP berjaya disahkan',
          error: 'OTP gagal disahkan',
        },
        { autoClose: 3000 }
      )
      .then((res) => {
        if (res.data.msg === 'OTP verified') {
          handleRefreshPelajar(id);
          setOtpQuestion(false);
        }
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otpQuestion) {
      handleOtpRequest();
    }
    if (otpQuestion) {
      handleOtpVerify();
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className='absolute inset-x-5 inset-y-20 lg:inset-x-1/4 2xl:inset-x-1/3 2xl:inset-y-20 bg-userWhite z-20 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'
      >
        <FaWindowClose
          className='absolute top-2 right-2 text-2xl cursor-pointer'
          onClick={() => setModalRefreshPelajar(false)}
        />
        <div className='h-10 bg-user9 flex justify-center items-center text-userWhite uppercase font-bold text-lg'>
          Pengesahan
        </div>
        <div className='flex flex-col items-center justify-center'>
          <h1 className='text-2xl font-bold text-center mt-3'>
            Anda pasti untuk mengemaskini senarai pelajar?
          </h1>
          <div>
            {otpQuestion ? (
              <>
                <div className='normal-case'>
                  Sila Masukkan OTP Yang Telah Dihantar Ke Emel {userinfo.email}
                </div>
                <div className='flex flex-col items-center justify-center'>
                  <label htmlFor='otpInput' className='sr-only'>
                    OTP
                  </label>
                  <input
                    type='text'
                    name='otpInput'
                    id='otpInput'
                    className='w-1/2 p-2 border border-userBlack rounded-md'
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <div className='text-center'>
                sila masukkan kod OTP bagi mengesahkan kebenaran kemaskini
                pelajar sekolah ini
              </div>
            )}
          </div>
          <div></div>
          <div className='absolute grid grid-cols-2 bottom-0 right-0 left-0 m-2 mx-10'>
            <span
              className='capitalize bg-userWhite text-userBlack rounded-md p-2 mr-3 hover:bg-user5 hover:cursor-pointer transition-all'
              onClick={() => setModalRefreshPelajar(false)}
            >
              Batal
            </span>
            {!isSubmitDisabled ? (
              <button
                type='submit'
                className={`capitalize text-userWhite rounded-md p-2 ml-3 hover:cursor-pointer transition-all ${
                  otpQuestion
                    ? 'bg-user2 hover:bg-user3 '
                    : 'bg-user9 hover:bg-user5 hover:text-userBlack'
                }`}
              >
                {otpQuestion ? 'Hantar' : 'KEMASKINI PELAJAR'}
              </button>
            ) : (
              <button
                disabled={true}
                className='capitalize text-userWhite rounded-md p-2 ml-3 transition-all bg-user2 cursor-not-allowed'
              >
                <svg
                  className='animate-spin m-auto h-5 w-5 text-white'
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
              </button>
            )}
          </div>
        </div>
      </form>
      <div
        onClick={() => setModalRefreshPelajar(false)}
        className='absolute inset-0 bg-user1 opacity-75 z-10'
      />
    </>
  );
}
