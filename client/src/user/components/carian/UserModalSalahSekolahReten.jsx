import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaWindowClose } from 'react-icons/fa';

import { useGlobalUserAppContext } from '../../context/userAppContext';

export default function UserModalSalahSekolah({
  carianSekolah,
  setModalSalahRetenSekolah,
}) {
  const { userToken, userinfo, reliefUserToken, toast } =
    useGlobalUserAppContext();

  const [otpQuestion, setOtpQuestion] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [showBothForm, setShowBothForm] = useState(false);
  const [hilangSekolah, setHilangSekolah] = useState(false);

  const handleOtpRequest = async () => {
    await toast.promise(
      axios.get(`/api/v1/getotp?id=${userinfo._id}&op=salah-reten-sekolah`, {
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
          setShowBothForm(true);
          setOtpQuestion(false);
          setHilangSekolah(true);
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
          onClick={() => setModalSalahRetenSekolah(false)}
        />
        <div className='h-10 bg-user9 flex justify-center items-center text-userWhite uppercase font-bold text-lg'>
          Pengesahan
        </div>
        <div className='flex flex-col items-center justify-center'>
          <h1 className='text-2xl font-bold text-center mt-3'>
            Anda pasti untuk menutup sekolah?
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
                sila masukkan kod OTP bagi mengesahkan kebenaran penutupan reten
                sekolah ini
              </div>
            )}
          </div>
          {showBothForm && (
            <div>
              <Link
                target='_blank'
                rel='noreferrer'
                to={`/pengguna/landing/carian/sekolah/form-sekolah/pemeriksaan/${
                  carianSekolah._id
                }/${
                  carianSekolah.pemeriksaanSekolah
                    ? carianSekolah.pemeriksaanSekolah._id
                    : 'tambah-pemeriksaan'
                }`}
                className={`${
                  carianSekolah.statusRawatan === 'enggan'
                    ? 'pointer-events-none text-userBlack shadow-none'
                    : carianSekolah.statusRawatan === 'tidak hadir'
                    ? 'pointer-events-none text-userBlack shadow-none'
                    : carianSekolah.pemeriksaanSekolah
                    ? 'bg-user7 text-userWhite shadow-md'
                    : filteredFasilitiSekolah.sekolahSelesaiReten === true
                    ? 'pointer-events-none text-userWhite bg-user4 shadow-none'
                    : 'bg-user6 text-userWhite shadow-md'
                } hover:bg-user8 rounded-sm p-1 m-1 transition-all`}
                onClick={() => setModalSalahRetenSekolah(false)}
              >
                {carianSekolah.statusRawatan === 'enggan'
                  ? 'Enggan'
                  : carianSekolah.statusRawatan === 'tidak hadir'
                  ? 'Tidak Hadir'
                  : carianSekolah.pemeriksaanSekolah
                  ? 'lihat pemeriksaan'
                  : 'Tambah Pemeriksaan'}
              </Link>
            </div>
          )}
          <div className='absolute grid grid-cols-2 bottom-0 right-0 left-0 m-2 mx-10'>
            <span
              className='capitalize bg-userWhite text-userBlack rounded-md p-2 mr-3 hover:bg-user5 hover:cursor-pointer transition-all'
              onClick={() => setModalSalahRetenSekolah(false)}
            >
              Batal
            </span>
            {hilangSekolah ? null : (
              <button
                type='submit'
                className={`capitalize text-userWhite rounded-md p-2 ml-3 hover:cursor-pointer transition-all ${
                  otpQuestion
                    ? 'bg-user2 hover:bg-user3 '
                    : 'bg-user9 hover:bg-user5 hover:text-userBlack'
                }`}
              >
                {otpQuestion ? 'Hantar' : 'TUTUP RETEN SEKOLAH'}
              </button>
            )}
          </div>
        </div>
      </form>
      <div
        onClick={() => setModalSalahRetenSekolah(false)}
        className='absolute inset-0 bg-user1 opacity-75 z-10'
      />
    </>
  );
}
