import { useState } from 'react';
import axios from 'axios';
import {
  FaWindowClose,
  FaCheckCircle,
  FaTimesCircle,
  FaMinus,
  FaPlus,
  FaRegPaperPlane,
  FaUserCheck,
} from 'react-icons/fa';

import { useGlobalUserAppContext } from '../../../context/userAppContext';

const ConfirmModal = ({ children, data, salahReten }) => {
  const { userToken, userinfo, reliefUserToken, toast } =
    useGlobalUserAppContext();

  const [open, setOpen] = useState(false);
  const [openSalah, setOpenSalah] = useState(false);
  const [callback, setCallback] = useState(null);

  //otp
  const [otpQuestion, setOtpQuestion] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  const show = (callback) => (event) => {
    event.preventDefault();
    setOpen(true);
    event = {
      ...event,
      target: {
        ...event.target,
        value: event.target.value,
      },
    };
    setCallback({
      run: () => callback(event),
    });
  };

  const closeModal = () => {
    setCallback(null);
    setOpen(false);
  };

  const confirm = () => {
    callback.run();
    closeModal();
    setOpenSalah(false);
  };

  const closeSalah = () => {
    setOpenSalah(false);
    setOpen(false);
  };

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
          setOtpQuestion(false);
          setOtpVerified(true);
        }
      });
  };

  // simplified data output before - e.g. 'ya-sedia-ada-status-denture-reten-salah'
  const simplifiedDataRadio = (e) => {
    const data = e.split('-');
    return data[0];
  };

  return (
    <>
      {children(show)}
      {open && (
        <>
          <div className='absolute z-10 inset-x-1 lg:inset-x-1/3 inset-y-7 bg-userWhite text-user1 rounded-md shadow-md overflow-y-auto'>
            <FaWindowClose
              onClick={closeModal}
              className='absolute mr-1 mt-1 text-xl text-userBlack right-0 hover:cursor-pointer hover:text-user2 transition-all'
            />
            <div className='grid grid-rows-[1fr_8fr_1fr] h-full'>
              <h5 className='bg-user9 text-userWhite font-semibold text-xl h-7'>
                PERHATIAN
              </h5>
              <div className='mt-1 py-1'>
                <span className='relative flex items-center justify-center mt-4'>
                  <FaUserCheck className='text-4xl text-user9 mx-auto absolute animate-ping' />
                  <FaUserCheck className='text-4xl text-user9 mx-auto absolute' />
                </span>
                {salahReten === 'pemeriksaan-salah' && (
                  <p className='px-1 font-semibold mt-7'>
                    Anda YAKIN untuk menanda salah??
                  </p>
                )}
                {data.pilihanDataSalah &&
                  salahReten === 'pemeriksaan-salah' && (
                    <>
                      {data.pilihanDataSalah
                        .yaTidakSediaAdaStatusDentureCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            {data.pilihanDataSalah
                              .yaTidakSediaAdaStatusDentureCBox === true &&
                              'Status Sedia Ada Denture'}
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {simplifiedDataRadio(
                              data.pilihanDataSalah.yaTidakSediaAdaStatusDenture
                            )}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah
                        .separaPenuhAtasSediaAdaDentureCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            {data.pilihanDataSalah
                              .separaPenuhAtasSediaAdaDentureCBox === true &&
                              'Separa Penuh Atas'}
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {simplifiedDataRadio(
                              data.pilihanDataSalah
                                .separaPenuhAtasSediaAdaDenture
                            )}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah
                        .separaPenuhBawahSediaAdaDentureCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            {data.pilihanDataSalah
                              .separaPenuhBawahSediaAdaDentureCBox === true &&
                              'Bawah'}
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {simplifiedDataRadio(
                              data.pilihanDataSalah
                                .separaPenuhBawahSediaAdaDenture
                            )}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.yaTidakPerluStatusDentureCBox ===
                        true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            {data.pilihanDataSalah
                              .yaTidakPerluStatusDentureCBox === true &&
                              'Status Perlu Denture'}
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {simplifiedDataRadio(
                              data.pilihanDataSalah.yaTidakPerluStatusDenture
                            )}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.separaPenuhAtasPerluDentureCBox ===
                        true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            {data.pilihanDataSalah
                              .separaPenuhAtasPerluDentureCBox === true &&
                              'Separa Penuh Atas'}
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {simplifiedDataRadio(
                              data.pilihanDataSalah.separaPenuhAtasPerluDenture
                            )}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah
                        .separaPenuhBawahPerluDentureCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            {data.pilihanDataSalah
                              .separaPenuhBawahPerluDentureCBox === true &&
                              'Bawah'}
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {simplifiedDataRadio(
                              data.pilihanDataSalah.separaPenuhBawahPerluDenture
                            )}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.kebersihanMulutOralHygieneCBox ===
                        true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            {data.pilihanDataSalah
                              .kebersihanMulutOralHygieneCBox === true &&
                              'Skor Plak'}
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.pilihanDataSalah.kebersihanMulutOralHygiene}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.perluPenskaleranOralHygieneCBox ===
                        true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Perlu Penskaleran
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.pilihanDataSalah
                              .perluPenskaleranOralHygiene === true && (
                              <FaCheckCircle className='text-user10' />
                            )}
                            {data.pilihanDataSalah
                              .perluPenskaleranOralHygiene === false && (
                              <FaTimesCircle className='text-user9' />
                            )}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.skorGisMulutOralHygieneCBox ===
                        true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Skor GIS
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.pilihanDataSalah.skorGisMulutOralHygiene}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.skorBpeOralHygieneCBox ===
                        true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Skor BPE
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.pilihanDataSalah.skorBpeOralHygiene}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.adaDesidusCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5 normal-case'>
                            Ada Desidus
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.pilihanDataSalah.adaDesidus === true && (
                              <FaCheckCircle className='text-user10' />
                            )}
                            {data.pilihanDataSalah.adaDesidus === false && (
                              <FaTimesCircle className='text-user9' />
                            )}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.dAdaGigiDesidusCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5 normal-case'>
                            d
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.pilihanDataSalah.dAdaGigiDesidus}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.fAdaGigiDesidusCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5 normal-case'>
                            f
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.pilihanDataSalah.fAdaGigiDesidus}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.xAdaGigiDesidusCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5 normal-case'>
                            x
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.pilihanDataSalah.xAdaGigiDesidus}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.adaKekalCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Ada Kekal
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.pilihanDataSalah.adaKekal === true && (
                              <FaCheckCircle className='text-user10' />
                            )}
                            {data.pilihanDataSalah.adaKekal === false && (
                              <FaTimesCircle className='text-user9' />
                            )}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.melaksanakanSaringanMerokokCBox ===
                        true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            {data.pilihanDataSalah
                              .melaksanakanSaringanMerokokCBox === true &&
                              'Melaksanakan saringan merokok melalui Program KOTAK'}
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {simplifiedDataRadio(
                              data.pilihanDataSalah.melaksanakanSaringanMerokok
                            )}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.dAdaGigiKekalCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            D
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.pilihanDataSalah.dAdaGigiKekal}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.classIDCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Class I D
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.pilihanDataSalah.classID}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.classIIDCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Class II D
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.pilihanDataSalah.classIID}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.mAdaGigiKekalCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            M
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.pilihanDataSalah.mAdaGigiKekal}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.fAdaGigiKekalCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5 normal-case'>
                            F
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.pilihanDataSalah.fAdaGigiKekal}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.classIFCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5 normal-case'>
                            Class I F
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.pilihanDataSalah.classIF}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.classIIFCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5 normal-case'>
                            Class II F
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.pilihanDataSalah.classIIF}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.xAdaGigiKekalCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5 normal-case'>
                            X
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.pilihanDataSalah.xAdaGigiKekal}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.eAdaGigiKekalCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5 normal-case'>
                            E
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.pilihanDataSalah.eAdaGigiKekal}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.jumlahFaktorRisikoCBox ===
                        true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5 normal-case'>
                            Jumlah faktor risiko
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.pilihanDataSalah.jumlahFaktorRisiko}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.toothSurfaceLossCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5 normal-case'>
                            Kehilangan Permukaan Gigi (TSL)
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.pilihanDataSalah.toothSurfaceLoss ===
                              true && <FaCheckCircle className='text-user10' />}
                            {data.pilihanDataSalah.toothSurfaceLoss ===
                              false && <FaTimesCircle className='text-user9' />}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah
                        .kecederaanGigiAnteriorTraumaCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5 normal-case'>
                            Kecederaan Gigi Anterior (Trauma)
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.pilihanDataSalah
                              .kecederaanGigiAnteriorTrauma === true && (
                              <FaCheckCircle className='text-user10' />
                            )}
                            {data.pilihanDataSalah
                              .kecederaanGigiAnteriorTrauma === false && (
                              <FaTimesCircle className='text-user9' />
                            )}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.tisuLembutTraumaCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5 normal-case'>
                            Tisu Lembut (Trauma)
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.pilihanDataSalah.tisuLembutTrauma ===
                              true && <FaCheckCircle className='text-user10' />}
                            {data.pilihanDataSalah.tisuLembutTrauma ===
                              false && <FaTimesCircle className='text-user9' />}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.tisuKerasTraumaCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5 normal-case'>
                            Tisu Keras (Trauma)
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.pilihanDataSalah.tisuKerasTrauma === true && (
                              <FaCheckCircle className='text-user10' />
                            )}
                            {data.pilihanDataSalah.tisuKerasTrauma ===
                              false && <FaTimesCircle className='text-user9' />}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah
                        .gicBilanganFsDibuat3TahunLepasCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5 normal-case'>
                            GIC (Bilangan FS dibuat 3 tahun lepas)
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {
                              data.pilihanDataSalah
                                .gicBilanganFsDibuat3TahunLepas
                            }
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah
                        .resinBilanganFsDibuat3TahunLepasCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5 normal-case'>
                            Resin (Bilangan FS dibuat 3 tahun lepas)
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {
                              data.pilihanDataSalah
                                .resinBilanganFsDibuat3TahunLepas
                            }
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah
                        .lainLainBilanganFsDibuat3TahunLepasCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5 normal-case'>
                            Lain-lain (Bilangan FS dibuat 3 tahun lepas)
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {
                              data.pilihanDataSalah
                                .lainLainBilanganFsDibuat3TahunLepas
                            }
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah
                        .dBilanganFsDibuat3TahunLepasTerjadiCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5 normal-case'>
                            D (Bilangan FS dibuat 3 tahun lepas terjadi)
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {
                              data.pilihanDataSalah
                                .dBilanganFsDibuat3TahunLepasTerjadi
                            }
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah
                        .mBilanganFsDibuat3TahunLepasTerjadiCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5 normal-case'>
                            M (Bilangan FS dibuat 3 tahun lepas terjadi)
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {
                              data.pilihanDataSalah
                                .mBilanganFsDibuat3TahunLepasTerjadi
                            }
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah
                        .fBilanganFsDibuat3TahunLepasTerjadiCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5 normal-case'>
                            F (Bilangan FS dibuat 3 tahun lepas terjadi)
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {
                              data.pilihanDataSalah
                                .fBilanganFsDibuat3TahunLepasTerjadi
                            }
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah
                        .xBilanganFsDibuat3TahunLepasTerjadiCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5 normal-case'>
                            X (Bilangan FS dibuat 3 tahun lepas terjadi)
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {
                              data.pilihanDataSalah
                                .xBilanganFsDibuat3TahunLepasTerjadi
                            }
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah
                        .eBilanganFsDibuat3TahunLepasTerjadiCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5 normal-case'>
                            E (Bilangan FS dibuat 3 tahun lepas terjadi)
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {
                              data.pilihanDataSalah
                                .eBilanganFsDibuat3TahunLepasTerjadi
                            }
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.baruJumlahGigiKekalPerluFsCBox ===
                        true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            jumlah gigi kekal perlu Pengapan Fisur (E10)
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.pilihanDataSalah.baruJumlahGigiKekalPerluFs}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.baruJumlahGigiKekalPerluFvCBox ===
                        true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            jumlah gigi kekal perlu Sapuan Fluorida(FV) (E13)
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.pilihanDataSalah.baruJumlahGigiKekalPerluFv}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah
                        .baruJumlahGigiKekalPerluPrrJenis1CBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            jumlah gigi kekal perlu Resin Pencegahan Jenis 1
                            (PRR Type I) (E12)
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {
                              data.pilihanDataSalah
                                .baruJumlahGigiKekalPerluPrrJenis1
                            }
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah
                        .baruGDAnteriorSewarnaJumlahTampalanDiperlukanCBox ===
                        true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Jumlah GD Baru
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {
                              data.pilihanDataSalah
                                .baruGDAnteriorSewarnaJumlahTampalanDiperlukan
                            }
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah
                        .semulaGDAnteriorSewarnaJumlahTampalanDiperlukanCBox ===
                        true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Jumlah GD Semula
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {
                              data.pilihanDataSalah
                                .semulaGDAnteriorSewarnaJumlahTampalanDiperlukan
                            }
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah
                        .baruGKAnteriorSewarnaJumlahTampalanDiperlukanCBox ===
                        true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Jumlah GK Baru
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {
                              data.pilihanDataSalah
                                .baruGKAnteriorSewarnaJumlahTampalanDiperlukan
                            }
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah
                        .semulaGKAnteriorSewarnaJumlahTampalanDiperlukanCBox ===
                        true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Jumlah GK Semula
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {
                              data.pilihanDataSalah
                                .semulaGKAnteriorSewarnaJumlahTampalanDiperlukan
                            }
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah
                        .baruGDPosteriorSewarnaJumlahTampalanDiperlukanCBox ===
                        true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Jumlah GD Baru
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {
                              data.pilihanDataSalah
                                .baruGDPosteriorSewarnaJumlahTampalanDiperlukan
                            }
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah
                        .semulaGDPosteriorSewarnaJumlahTampalanDiperlukanCBox ===
                        true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Jumlah GD Semula
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {
                              data.pilihanDataSalah
                                .semulaGDPosteriorSewarnaJumlahTampalanDiperlukan
                            }
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah
                        .baruGKPosteriorSewarnaJumlahTampalanDiperlukanCBox ===
                        true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Jumlah GK Baru
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {
                              data.pilihanDataSalah
                                .baruGKPosteriorSewarnaJumlahTampalanDiperlukan
                            }
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah
                        .semulaGKPosteriorSewarnaJumlahTampalanDiperlukanCBox ===
                        true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Jumlah GK Semula
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {
                              data.pilihanDataSalah
                                .semulaGKPosteriorSewarnaJumlahTampalanDiperlukan
                            }
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah
                        .baruGDPosteriorAmalgamJumlahTampalanDiperlukanCBox ===
                        true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Jumlah GD Baru
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {
                              data.pilihanDataSalah
                                .baruGDPosteriorAmalgamJumlahTampalanDiperlukan
                            }
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah
                        .semulaGDPosteriorAmalgamJumlahTampalanDiperlukanCBox ===
                        true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Jumlah GD Semula
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {
                              data.pilihanDataSalah
                                .semulaGDPosteriorAmalgamJumlahTampalanDiperlukan
                            }
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah
                        .baruGKPosteriorAmalgamJumlahTampalanDiperlukanCBox ===
                        true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Jumlah GK Baru
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {
                              data.pilihanDataSalah
                                .baruGKPosteriorAmalgamJumlahTampalanDiperlukan
                            }
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah
                        .semulaGKPosteriorAmalgamJumlahTampalanDiperlukanCBox ===
                        true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Jumlah GK Semula
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {
                              data.pilihanDataSalah
                                .semulaGKPosteriorAmalgamJumlahTampalanDiperlukan
                            }
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.menerimaNasihatRingkasCBox ===
                        true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            {data.pilihanDataSalah
                              .menerimaNasihatRingkasCBox === true &&
                              'Menerima nasihat ringkas'}
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {simplifiedDataRadio(
                              data.pilihanDataSalah.menerimaNasihatRingkas
                            )}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.statusMCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Status Merokok
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.pilihanDataSalah.statusM}
                          </p>
                        </div>
                      )}
                      {data.pilihanDataSalah.bersediaDirujukCBox === true && (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            {data.pilihanDataSalah.bersediaDirujukCBox ===
                              true &&
                              'Murid BERSETUJU untuk dirujuk menjalani intervensi'}
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {simplifiedDataRadio(
                              data.pilihanDataSalah.bersediaDirujuk
                            )}
                          </p>
                        </div>
                      )}
                    </>
                  )}
              </div>
              <div className='sticky grid grid-cols-2 bottom-0 right-0 left-0 m-2 mx-10 bg-userWhite px-5 py-2'>
                <button
                  className='capitalize bg-user9 text-userWhite rounded-md shadow-xl p-2 mr-3 hover:bg-user1 transition-all flex justify-center items-center'
                  onClick={() => {
                    if (salahReten === 'pemeriksaan-salah') {
                      setOpenSalah(true);
                    } else {
                      confirm();
                    }
                  }}
                >
                  YA
                  <FaRegPaperPlane className='inline-flex ml-1' />
                </button>
                <button
                  className='capitalize bg-userWhite text-userBlack rounded-md p-2 ml-3 hover:bg-user5 transition-all'
                  onClick={closeModal}
                >
                  Tidak
                </button>
              </div>
            </div>
          </div>
          <div
            onClick={closeModal}
            className='absolute inset-0 bg-user1 opacity-75 z-10'
          />
        </>
      )}
      {openSalah && (
        <>
          <form
            onSubmit={confirm}
            className='absolute z-30 inset-x-1 lg:inset-x-1/3 inset-y-7 bg-userWhite text-user1 rounded-md shadow-md overflow-y-auto'
          >
            <FaWindowClose
              onClick={closeSalah}
              className='absolute mr-1 mt-1 text-xl text-userBlack right-0 hover:cursor-pointer hover:text-user2 transition-all'
            />
            <h5 className='bg-user9 text-userWhite font-semibold text-xl h-7'>
              PERHATIAN
            </h5>
            {otpVerified && (
              <div className='flex flex-col justify-center mb-3 2xl:mb-10 px-4'>
                <span className='relative flex justify-center items-center mt-14'>
                  <FaUserCheck className='text-7xl text-user9 mx-auto absolute animate-ping' />
                  <FaUserCheck className='text-7xl text-user9 mx-auto absolute' />
                </span>
                <p className='text-center text-xl font-bold mt-20'>
                  Adakah anda yakin?
                </p>
                <p className='text-center text-sm normal-case'>
                  Anda
                  <strong className='text-user9 mx-1'>TIDAK</strong>dibenarkan
                  untuk menanda reten salah lagi selepas manghantar
                </p>
              </div>
            )}
            <div>
              {otpQuestion ? (
                <>
                  <span className='relative flex justify-center items-center mt-12'>
                    <FaUserCheck className='text-7xl text-user9 mx-auto absolute animate-ping' />
                    <FaUserCheck className='text-7xl text-user9 mx-auto absolute' />
                  </span>
                  <div className='normal-case mt-16'>
                    Sila Masukkan OTP Yang Telah Dihantar Ke Emel{' '}
                    {userinfo.email}
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
                    <span
                      className='bg-user9 text-userWhite rounded-md p-2 mt-3 hover:bg-kaunter2 transition-all cursor-pointer'
                      onClick={handleOtpVerify}
                    >
                      Sahkan
                    </span>
                  </div>
                </>
              ) : (
                !otpVerified && (
                  <div className='text-center mt-4 flex flex-col px-4'>
                    <span className='relative flex justify-center items-center mt-8'>
                      <FaUserCheck className='text-7xl text-user9 mx-auto absolute animate-ping' />
                      <FaUserCheck className='text-7xl text-user9 mx-auto absolute' />
                    </span>
                    <p className='text-center text-xl font-bold mt-14 text-user1'>
                      sila masukkan kod OTP bagi menandakan reten salah sekolah
                      di pilihan anda
                    </p>
                    <div className='flex justify-center'>
                      <span
                        className='bg-user9 text-userWhite rounded-md p-2 mt-3 hover:bg-kaunter2 transition-all cursor-pointer'
                        onClick={handleOtpRequest}
                      >
                        Meminta OTP
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
            {otpVerified && (
              <div className='max-[1024px]:absolute min-[1536px]:absolute grid grid-cols-2 bottom-0 right-0 left-0 m-2 mx-10'>
                <button
                  type='submit'
                  className='capitalize bg-user9 text-userWhite rounded-md shadow-xl p-2 mr-3 hover:bg-kaunter2 transition-all flex items-center justify-center'
                  data-cy='submit-confirm-salah'
                >
                  HANTAR
                  <FaRegPaperPlane className='inline-flex ml-1' />
                </button>
                <button
                  className='capitalize bg-userWhite text-userBlack rounded-md p-2 ml-3 hover:bg-user5 transition-all'
                  onClick={closeSalah}
                >
                  Tidak
                </button>
              </div>
            )}
          </form>
        </>
      )}
    </>
  );
};

export default ConfirmModal;
