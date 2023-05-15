import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import {
  FaWindowClose,
  FaMinus,
  FaPlus,
  FaTooth,
  FaCheckCircle,
} from 'react-icons/fa';

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

  //accordian
  const [accordian, setAccordian] = useState([]);

  // const handleOtpRequest = async () => {
  //   await toast.promise(
  //     axios.get(`/api/v1/getotp?id=${userinfo._id}&op=salah-reten-sekolah`, {
  //       headers: {
  //         Authorization: `Bearer ${
  //           reliefUserToken ? reliefUserToken : userToken
  //         }`,
  //       },
  //     }),
  //     {
  //       pending: `Menghantar OTP ke emel ${userinfo.email}`,
  //       success: `OTP telah dihantar ke emel ${userinfo.email}`,
  //       error: `OTP gagal dihantar`,
  //     },
  //     {
  //       autoClose: 5000,
  //     }
  //   );
  //   setOtpQuestion(true);
  // };

  // const handleOtpVerify = async () => {
  //   await toast
  //     .promise(
  //       axios.get(`/api/v1/getotp/verify?id=${userinfo._id}&otp=${otpInput}`, {
  //         headers: {
  //           Authorization: `Bearer ${
  //             reliefUserToken ? reliefUserToken : userToken
  //           }`,
  //         },
  //       }),
  //       {
  //         pending: 'Mengesahkan OTP...',
  //         success: 'OTP berjaya disahkan',
  //         error: 'OTP gagal disahkan',
  //       },
  //       { autoClose: 3000 }
  //     )
  //     .then((res) => {
  //       if (res.data.msg === 'OTP verified') {
  //         setShowBothForm(true);
  //         setOtpQuestion(false);
  //         setHilangSekolah(true);
  //       }
  //     });
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (!otpQuestion) {
  //     handleOtpRequest();
  //   }
  //   if (otpQuestion) {
  //     handleOtpVerify();
  //   }
  // };

  const handleAccordian = (e) => {
    if (accordian.includes(e)) {
      setAccordian(accordian.filter((a) => a !== e));
    } else {
      setAccordian([...accordian, e]);
    }
  };

  return (
    <>
      <form
        // onSubmit={handleSubmit}
        className='absolute z-30 inset-x-1 lg:inset-x-1/3 inset-y-7 bg-userWhite text-user1 rounded-md shadow-md overflow-y-auto'
      >
        <FaWindowClose
          className='absolute top-2 right-2 text-2xl cursor-pointer'
          onClick={() => setModalSalahRetenSekolah(false)}
        />
        <div className='h-10 bg-user9 flex justify-center items-center text-userWhite uppercase font-bold text-lg rounded-t-md'>
          Pengesahan
        </div>
        <div className='flex flex-col items-center justify-center px-3'>
          <h1 className='text-2xl font-bold text-center mt-3 border-b border-b-user1 py-3'>
            Anda perlu memilih reten untuk menanda reten salah murid ini
          </h1>
          {/* <div>
            {otpQuestion ? (
              <>
                <div className='normal-case mt-4'>
                  Sila Masukkan OTP Yang Telah Dihantar Ke Emel {userinfo.email}
                </div>
                <div className='flex flex-col items-center justify-center mt-3'>
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
              !showBothForm && (
                <div className='text-center mt-4'>
                  sila masukkan kod OTP bagi menandakan reten salah sekolah di
                  pilihan anda
                </div>
              )
            )}
          </div> */}
          <div className='mt-5 flex flex-col'>
            <p className='my-2 font-semibold'>
              Sila pilih mengikut pilihan anda
            </p>
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
            <Link
              target='_blank'
              rel='noreferrer'
              to={`/pengguna/landing/carian/sekolah/form-sekolah/rawatan/${
                carianSekolah._id
              }/${
                carianSekolah.rawatanSekolah
                  ? carianSekolah.rawatanSekolah._id
                  : 'tambah-rawatan'
              }`}
              className={`${
                carianSekolah.statusRawatan === 'enggan'
                  ? 'pointer-events-none text-userBlack shadow-none'
                  : carianSekolah.statusRawatan === 'tidak hadir'
                  ? 'pointer-events-none text-userBlack shadow-none'
                  : carianSekolah.statusRawatan === 'enggan rawatan'
                  ? 'pointer-events-none text-userBlack shadow-none'
                  : carianSekolah.statusRawatan === 'tidak hadir rawatan'
                  ? 'pointer-events-none text-userBlack shadow-none'
                  : carianSekolah.statusRawatan === 'selesai'
                  ? ' bg-user7 text-userWhite shadow-md hover:bg-user8'
                  : !carianSekolah.pemeriksaanSekolah
                  ? 'pointer-events-none text-userWhite bg-user4 shadow-none'
                  : 'bg-user3 text-userWhite hover:bg-user2 shadow-md'
              } rounded-sm  p-1 m-1 transition-all`}
            >
              {carianSekolah.statusRawatan === 'enggan'
                ? 'Enggan'
                : carianSekolah.statusRawatan === 'tidak hadir'
                ? 'Tidak Hadir'
                : carianSekolah.statusRawatan === 'enggan rawatan'
                ? 'Enggan Rawatan'
                : carianSekolah.statusRawatan === 'tidak hadir rawatan'
                ? 'Tidak Hadir Rawatan'
                : carianSekolah.statusRawatan === 'selesai'
                ? 'selesai rawatan'
                : 'Lihat rawatan'}
            </Link>
          </div>
          {/* <div className='grid grid-cols-2 bottom-0 right-0 left-0 m-2 mx-10'>
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
                {otpQuestion ? 'VERIFIKASI' : 'DAPATKAN OTP'}
              </button>
            )}
          </div> */}
        </div>
      </form>
      <div
        onClick={() => setModalSalahRetenSekolah(false)}
        className='absolute inset-0 bg-user1 opacity-75 z-10'
      />
    </>
  );
}
