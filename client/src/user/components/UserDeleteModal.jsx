import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaWindowClose } from 'react-icons/fa';

import { useGlobalUserAppContext } from '../context/userAppContext';

export default function DeleteModal({ handleDelete, setModalHapus, id, nama }) {
  const { userToken, userinfo, reliefUserToken, toast } =
    useGlobalUserAppContext();

  const [otpQuestion, setOtpQuestion] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [reasonForDelete, setReasonForDelete] = useState('');

  const handleOtpRequest = async () => {
    await toast.promise(
      axios.get(`/api/v1/getotp?id=${userinfo._id}`, {
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
  };

  const handleOtpVerify = async () => {
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
          handleDelete(id, reasonForDelete);
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
          onClick={() => setModalHapus(false)}
          className='absolute mr-1 mt-1 text-xl text-userBlack right-0 hover:cursor-pointer hover:text-user2 transition-all'
        />
        <h5 className='bg-user9 text-userWhite font-semibold text-xl'>AWAS!</h5>
        <div className='mt-5 p-1'>
          <span className='font-semibold'>
            anda YAKIN <span className='lowercase'>untuk menghapus</span>{' '}
            <span className='uppercase'>{nama}</span>?
          </span>
          {otpQuestion && (
            <>
              <div className='mt-5'>
                Sila <span className='lowercase'>masukkan</span> OTP{' '}
                <span className='lowercase'>
                  yang telah dihantar ke emel {userinfo.email}
                </span>
                <div className='mt-5'>
                  <label htmlFor='reason' className='mr-3'>
                    Sebab Penghapusan :
                  </label>
                  <input
                    required
                    type='text'
                    name='reason'
                    id='reason'
                    className='appearance-none leading-7 px-3 py-1 ring-2 w-1/2 lg:w-2/3 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
                    onChange={(e) => setReasonForDelete(e.target.value)}
                  />
                </div>
                <div className='mt-5'>
                  <label htmlFor='otp' className='mr-3'>
                    OTP :
                  </label>
                  <input
                    required
                    type='text'
                    name='otp'
                    id='otp'
                    className='appearance-none leading-7 px-3 py-1 ring-2 w-1/2 lg:w-1/3 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
                    onChange={(e) => setOtpInput(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        <div className='absolute grid grid-cols-2 bottom-0 right-0 left-0 m-2 mx-10'>
          <span
            className='capitalize bg-userWhite text-userBlack rounded-md p-2 mr-3 hover:bg-user5 hover:cursor-pointer transition-all'
            onClick={() => {
              setModalHapus(false);
            }}
          >
            Tidak
          </span>
          <button
            type='submit'
            className='capitalize bg-user9 text-userWhite rounded-md shadow-xl p-2 ml-3 hover:bg-user1 transition-all'
          >
            HAPUS
          </button>
        </div>
      </form>
      <div
        onClick={() => setModalHapus(false)}
        className='absolute inset-0 bg-user1 z-10 opacity-75'
      />
    </>
  );
}