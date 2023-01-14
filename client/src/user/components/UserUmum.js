import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  BsFilePerson,
  BsFillFilePersonFill,
  BsFillCircleFill,
  BsFillBookmarkXFill,
  BsFillCheckCircleFill,
  BsPersonCircle,
  BsCalendarPlusFill,
  BsFillCaretDownFill,
  BsFillArrowUpCircleFill,
  BsExclamationCircleFill,
} from 'react-icons/bs';
import moment from 'moment';

import UserDeleteModal from './UserDeleteModal';

import { useGlobalUserAppContext } from '../context/userAppContext';

function UserUmum({ sekolahIdc }) {
  const {
    userToken,
    userinfo,
    reliefUserToken,
    dateToday,
    masterDatePicker,
    formatTime,
    noPendaftaranSplitter,
    statusPesakit,
    toast,
    refreshTimer,
    setRefreshTimer,
  } = useGlobalUserAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [nama, setNama] = useState('');
  const [tarikhKedatangan, setTarikhKedatangan] = useState(dateToday);
  const [jenisFasiliti, setJenisFasiliti] = useState(
    sekolahIdc === 'umum-sekolah' ? 'projek-komuniti-lain' : 'kp'
  );
  const [jenisProgram, setJenisProgram] = useState(
    sekolahIdc === 'umum-sekolah' ? 'incremental' : ''
  );
  const [queryResult, setQueryResult] = useState([]);
  const [pilih, setPilih] = useState('');
  const [resultPilih, setResultPilih] = useState([]);
  const [operasiHapus, setOperasiHapus] = useState(false);
  const [modalHapus, setModalHapus] = useState(false);

  const [reloadState, setReloadState] = useState(false);

  //carian ic semua
  const keys = ['nama', 'ic', 'createdByUsername'];

  const bawahRef = useRef(null);
  const atasRef = useRef(null);

  // datepicker issues
  const [tarikhKedatanganDP, setTarikhKedatanganDP] = useState(
    new Date(dateToday)
  );
  const TarikhKedatangan = () => {
    return masterDatePicker({
      selected: tarikhKedatanganDP,
      onChange: (tarikhKedatangan) => {
        const tempDate = moment(tarikhKedatangan).format('YYYY-MM-DD');
        setTarikhKedatangan(tempDate);
        setTarikhKedatanganDP(tarikhKedatangan);
      },
      className:
        'appearance-none w-64 text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md uppercase flex flex-row',
    });
  };

  useEffect(() => {
    const query = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `/api/v1/query/umum?tarikhKedatangan=${moment(
            tarikhKedatangan
          ).format(
            'YYYY-MM-DD'
          )}&jenisFasiliti=${jenisFasiliti}&jenisProgram=${jenisProgram}`,
          {
            headers: {
              Authorization: `Bearer ${
                reliefUserToken ? reliefUserToken : userToken
              }`,
            },
          }
        );
        // 👇️ sort by String property ASCENDING (A - Z)
        const desc = data.umumResultQuery.sort((a, b) =>
          a.statusReten > b.statusReten ? 1 : -1
        );
        setQueryResult(desc);
        setRefreshTimer(!refreshTimer);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    query();
  }, [tarikhKedatangan, jenisFasiliti, jenisProgram, reloadState]);

  useEffect(() => {
    const resultFilter = queryResult.filter((singlePersonUmum) => {
      return singlePersonUmum._id === pilih;
    });
    setResultPilih(resultFilter);
  }, [pilih]);

  //scrollBawah after resultPilih
  const scrollBawah = () => {
    bawahRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    if (resultPilih.length > 0) {
      scrollBawah();
    }
  }, [resultPilih]);

  // clear pilihan if change nama, tarikhKedatangan, jenisFasiliti, jenisProgram, reloadState
  useEffect(() => {
    if (modalHapus === false) {
      setPilih('');
      setResultPilih([]);
    }
  }, [nama, tarikhKedatangan, jenisFasiliti, jenisProgram, reloadState]);

  // clear program if change jenisFasiliti
  useEffect(() => {
    setJenisProgram('');
  }, [jenisFasiliti]);

  // on tab focus reload data
  useEffect(() => {
    window.addEventListener('focus', setReloadState);
    setReloadState(!reloadState);
    return () => {
      window.removeEventListener('focus', setReloadState);
    };
  }, []);

  //clear jenisFasiliti if change sekolahIdc
  useEffect(() => {
    if (modalHapus === false) {
      setJenisFasiliti(
        sekolahIdc === 'umum-sekolah' ? 'projek-komuniti-lain' : 'kp'
      );
    }
  }, [sekolahIdc]);

  useEffect(() => {
    if (modalHapus === false) {
      if (sekolahIdc === 'umum-sekolah') {
        setJenisProgram('incremental');
      }
    }
  }, [sekolahIdc, jenisFasiliti]);

  const handleDelete = async (singlePerson, reason) => {
    if (!modalHapus) {
      setModalHapus(true);
      return;
    }
    if (modalHapus) {
      let mdcMdtbNum = '';
      if (!userinfo.mdtbNumber) {
        mdcMdtbNum = userinfo.mdcNumber;
      }
      if (!userinfo.mdcNumber) {
        mdcMdtbNum = userinfo.mdtbNumber;
      }
      await toast.promise(
        axios.patch(
          `/api/v1/umum/delete/${singlePerson}`,
          {
            deleteReason: reason,
            createdByMdcMdtb: mdcMdtbNum,
          },
          {
            headers: {
              Authorization: `Bearer ${
                reliefUserToken ? reliefUserToken : userToken
              }`,
            },
          }
        ),
        {
          pending: 'Menghapus pesakit...',
          success: 'Pesakit berjaya dihapus',
          error: 'Pesakit gagal dihapus',
        },
        {
          autoClose: 5000,
        }
      );
      setModalHapus(false);
      setReloadState(!reloadState);
    }
  };

  return (
    <>
      <div className='px-3 lg:px-10 h-full p-3 overflow-y-auto'>
        <form className='text-left grid grid-cols-1 lg:grid-cols-3'>
          <h2 className='text-xl font-semibold flex flex-row px-2 lg:col-span-3'>
            {sekolahIdc === 'umum-sekolah' ? (
              <span className='mr-2'>
                CARIAN PESAKIT PROGRAM PERGIGIAN SEKOLAH SESI 2022/2023
              </span>
            ) : (
              <span className='mr-2'>CARIAN PESAKIT UMUM</span>
            )}
          </h2>
          <div className='relative flex flex-col lg:col-span-3 ml-2 py-2'>
            <label
              htmlFor='nama-pesakit'
              className='flex flex-row my-2 items-center'
            >
              carian pesakit
              <BsExclamationCircleFill
                className='ml-2 text-lg text-user3'
                title='carian untuk nama , kad pengenalan dan operator'
              />
            </label>
            <input
              onChange={(e) => {
                setNama(e.target.value);
              }}
              value={nama}
              type='text'
              name='nama-pesakit'
              id='nama-pesakit'
              className='appearance-none leading-7 py-1 px-3 ring-2 w-full focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md col-span-2 lg:mb-2'
            />
            <span className='absolute text-user3 bottom-4 lg:bottom-6 text-xl right-2'>
              <BsPersonCircle />
            </span>
          </div>
          <div className='mx-2 flex flex-col mb-2'>
            <label
              htmlFor='kad-pengenalan'
              className='whitespace-nowrap flex items-center pb-1 text-base font-medium'
            >
              tarikh kedatangan :
            </label>
            <div className='relative w-64'>
              <TarikhKedatangan />
              <span className='absolute top-2 right-3 lg:right-2 text-user3'>
                <BsCalendarPlusFill />
              </span>
            </div>
          </div>
          <div className='mx-2 flex flex-col mb-2'>
            <label
              className='whitespace-nowrap flex items-center pb-1 text-base font-medium'
              htmlFor='jenis-fasiliti'
            >
              pilih jenis fasiliti:
            </label>
            <div className='relative w-64'>
              <select
                disabled={sekolahIdc === 'umum-sekolah' ? true : false}
                name='jenis-fasiliti'
                id='jenis-fasiliti'
                value={jenisFasiliti}
                onChange={(e) => {
                  setJenisFasiliti(e.target.value);
                }}
                className='appearance-none leading-7 px-3 py-1 ring-2 w-64 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md '
              >
                <option value='kp'>Klinik Pergigian</option>
                <option value='kk-kd'>Klinik Kesihatan / Klinik Desa</option>
                <option value='taska-tadika'>Taska / Tadika</option>
                <option value='projek-komuniti-lain'>Program Komuniti</option>
              </select>
              <span>
                <BsFillCaretDownFill className='absolute top-3 right-2 text-user3' />
              </span>
            </div>
          </div>
          {jenisFasiliti === 'projek-komuniti-lain' && (
            <div className='mx-2 flex flex-col mb-2'>
              <label
                className='whitespace-nowrap flex items-center pb-1 text-base font-medium'
                htmlFor='jenis-program'
              >
                jenis program:
              </label>
              <div className='relative w-64'>
                <select
                  disabled={sekolahIdc === 'umum-sekolah' ? true : false}
                  name='jenis-program'
                  id='jenis-program'
                  value={jenisProgram}
                  onChange={(e) => {
                    setJenisProgram(e.target.value);
                  }}
                  className='appearance-none leading-7 px-3 py-1 pr-6 ring-2 w-64 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md '
                >
                  <option value=''>Jenis Program / Aktiviti</option>
                  <option value='programDewasaMuda'>Program Dewasa Muda</option>
                  <option value='kampungAngkatPergigian'>
                    Program Kampung Angkat Pergigian
                  </option>
                  <option value='ppr'>Projek Perumahan Rakyat</option>
                  <option value='we'>Institusi Warga Emas</option>
                  <option value='oku'>Institusi OKU / PDK</option>
                  <option value='projek-komuniti'>Projek Komuniti</option>
                  <option value='ppkps'>
                    Program Pemasyarakatan Perkhidmatan Klinik Pergigian Sekolah
                    (PPKPS)
                  </option>
                  <option value='oap'>Program Orang Asli dan Penan</option>
                  <option value='penjara-koreksional'>Institusi Penjara</option>
                  {userinfo.createdByNegeri === 'Sabah' && (
                    <option value='fds'>Flying Dental Service</option>
                  )}
                  {userinfo.createdByNegeri === 'Kelantan' && (
                    <option value='rtc'>RTC Kelantan, Tunjung</option>
                  )}
                  <option value='incremental'>
                    Program Pergigian Sekolah Sesi 2022/2023
                  </option>
                </select>
                <span>
                  <BsFillCaretDownFill className='absolute top-3 right-2 text-user3' />
                </span>
              </div>
            </div>
          )}
        </form>
        <section className='my-5 p-1 outline outline-1 outline-user1'>
          <h2 className='text-xl font-semibold flex flex-row pl-12 p-2'>
            SENARAI CARIAN
          </h2>
          <div className='m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max'>
            <table className='table-auto'>
              <thead className='text-userWhite bg-user2' ref={atasRef}>
                <tr>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    BIL
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    WAKTU SAMPAI
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    NO. PENDAFTARAN
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 md:w-screen md:max-w-md lg:w-screen lg:max-w-screen-lg'>
                    NAMA PESAKIT
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    KAD PENGENALAN
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    STATUS PESAKIT
                  </th>
                  {jenisFasiliti === 'kk-kd' ? (
                    <th className='px-2 py-1 outline outline-1 outline-offset-1 w-80'>
                      NAMA KKIA / KD
                    </th>
                  ) : null}
                  {jenisFasiliti === 'taska-tadika' ? (
                    <th className='px-2 py-1 outline outline-1 outline-offset-1 w-80'>
                      NAMA TASKA/TADIKA
                    </th>
                  ) : null}
                  {jenisFasiliti === 'projek-komuniti-lain' ? (
                    <th className='px-2 py-1 outline outline-1 outline-offset-1 w-80'>
                      NAMA PROGRAM
                    </th>
                  ) : null}
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-80'>
                    OPERATOR
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-80'>
                    STATUS PENGISIAN RETEN
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    AKTIFKAN
                  </th>
                  {userinfo.role === 'admin' && (
                    <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                      HAPUS
                    </th>
                  )}
                </tr>
              </thead>
              {!isLoading &&
                queryResult
                  .filter((pt) =>
                    keys.some((key) => pt[key].toLowerCase().includes(nama))
                  )
                  .map((singlePersonUmum, index) => {
                    return (
                      <tbody className='bg-user4'>
                        <tr>
                          <td
                            className={`${
                              pilih === singlePersonUmum._id && 'bg-user3'
                            } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                          >
                            {index + 1}
                          </td>
                          <td
                            className={`${
                              pilih === singlePersonUmum._id && 'bg-user3'
                            } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                          >
                            {formatTime(singlePersonUmum.waktuSampai)}
                          </td>
                          {singlePersonUmum.noPendaftaranBaru ? (
                            <td
                              className={`${
                                pilih === singlePersonUmum._id && 'bg-user3'
                              } px-2 py-1 lowercase outline outline-1 outline-userWhite outline-offset-1`}
                            >
                              {noPendaftaranSplitter(
                                singlePersonUmum.noPendaftaranBaru
                              )}
                              <BsPersonCircle
                                className='text-user7 text-2xl inline-table mx-2 bg-userWhite bg-blend-normal rounded-full outline outline-1 outline-user7'
                                title='Baru'
                              />
                            </td>
                          ) : (
                            <td
                              className={`${
                                pilih === singlePersonUmum._id && 'bg-user3'
                              } px-2 py-1 lowercase outline outline-1 outline-userWhite outline-offset-1`}
                            >
                              {noPendaftaranSplitter(
                                singlePersonUmum.noPendaftaranUlangan
                              )}
                              <BsPersonCircle
                                className='text-user9 text-2xl inline-table mx-2 bg-userWhite bg-blend-normal rounded-full outline outline-1 outline-user9'
                                title='Ulangan'
                              />
                            </td>
                          )}
                          <td
                            className={`${
                              pilih === singlePersonUmum._id && 'bg-user3'
                            } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                          >
                            {singlePersonUmum.nama.toUpperCase()}
                          </td>
                          <td
                            className={`${
                              pilih === singlePersonUmum._id && 'bg-user3'
                            } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                          >
                            {singlePersonUmum.ic.toUpperCase()}
                          </td>
                          <td
                            className={`${
                              pilih === singlePersonUmum._id && 'bg-user3'
                            } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                          >
                            {statusPesakit(singlePersonUmum)}
                          </td>
                          {jenisFasiliti === 'kk-kd' ? (
                            <td
                              className={`${
                                pilih === singlePersonUmum._id && 'bg-user3'
                              } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                            >
                              {singlePersonUmum.namaFasilitiKkKd}
                            </td>
                          ) : null}
                          {jenisFasiliti === 'taska-tadika' ? (
                            <td
                              className={`${
                                pilih === singlePersonUmum._id && 'bg-user3'
                              } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                            >
                              {singlePersonUmum.namaFasilitiTaskaTadika}
                            </td>
                          ) : null}
                          {jenisFasiliti === 'projek-komuniti-lain' ? (
                            <td
                              className={`${
                                pilih === singlePersonUmum._id && 'bg-user3'
                              } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                            >
                              {singlePersonUmum.namaProgram}
                            </td>
                          ) : null}
                          <td
                            className={`${
                              pilih === singlePersonUmum._id && 'bg-user3'
                            } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                          >
                            {singlePersonUmum.createdByUsername === 'kaunter'
                              ? null
                              : singlePersonUmum.createdByUsername}
                          </td>
                          <td
                            className={`${
                              pilih === singlePersonUmum._id && 'bg-user3'
                            } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                          >
                            {singlePersonUmum.statusReten === 'belum diisi' ? (
                              <div className='flex items-center justify-center whitespace-nowrap'>
                                <span>Belum Diisi</span>
                                <BsFillCircleFill className='text-user9 text-lg my-1 ml-2' />
                              </div>
                            ) : singlePersonUmum.statusKehadiran === true &&
                              singlePersonUmum.statusReten === 'reten salah' ? (
                              <div className='flex items-center justify-center whitespace-nowrap'>
                                <span>Terdapat Kesalahan Reten</span>
                                <BsFillBookmarkXFill className='text-user9 text-lg my-1 ml-2' />
                              </div>
                            ) : singlePersonUmum.statusKehadiran === true ? (
                              <div className='flex items-center justify-center whitespace-nowrap'>
                                <strike>data tiada</strike>
                                <BsFillCircleFill className='text-user8 text-lg my-1 ml-2' />{' '}
                              </div>
                            ) : singlePersonUmum.statusReten ===
                              'telah diisi' ? (
                              <div className='flex items-center justify-center whitespace-nowrap'>
                                <span>Selesai Diisi</span>
                                <BsFillCheckCircleFill className='text-user7 text-lg my-1 ml-2 bg-userWhite bg-blend-normal rounded-full outline outline-1 outline-user7' />
                              </div>
                            ) : singlePersonUmum.statusReten ===
                              'reten salah' ? (
                              <div className='flex items-center justify-center whitespace-nowrap'>
                                <span>Terdapat Kesalahan Reten</span>
                                <BsFillBookmarkXFill className='text-user9 text-lg my-1 ml-2' />
                              </div>
                            ) : null}
                          </td>
                          <td
                            onClick={() => {
                              setOperasiHapus(false);
                              setPilih(singlePersonUmum._id);
                              scrollBawah();
                            }}
                            className={`${
                              pilih === singlePersonUmum._id && 'bg-user3'
                            } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1 hover:cursor-pointer text-user2`}
                          >
                            <u>PILIH</u>
                          </td>
                          {userinfo.role === 'admin' && (
                            <td
                              onClick={() => {
                                setOperasiHapus(true);
                                setPilih(singlePersonUmum._id);
                              }}
                              className={`${
                                pilih === singlePersonUmum._id && 'bg-user3'
                              } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1 hover:cursor-pointer text-user2`}
                            >
                              <u>HAPUS</u>
                            </td>
                          )}
                        </tr>
                      </tbody>
                    );
                  })}
              {isLoading && (
                <tbody className='bg-user4'>
                  <tr>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-20 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                    </td>
                    {jenisFasiliti === 'kk-kd' ? (
                      <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                        <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                      </td>
                    ) : null}
                    {jenisFasiliti === 'taska-tadika' ? (
                      <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                        <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                      </td>
                    ) : null}
                    {jenisFasiliti === 'projek-komuniti-lain' ? (
                      <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                        <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                      </td>
                    ) : null}
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                    </td>
                    {userinfo.role === 'admin' && (
                      <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                        <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-20 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                    </td>
                    {jenisFasiliti === 'kk-kd' ? (
                      <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                        <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                      </td>
                    ) : null}
                    {jenisFasiliti === 'taska-tadika' ? (
                      <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                        <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                      </td>
                    ) : null}
                    {jenisFasiliti === 'projek-komuniti-lain' ? (
                      <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                        <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                      </td>
                    ) : null}
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                    </td>
                    {userinfo.role === 'admin' && (
                      <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                        <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-20 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                    </td>
                    {jenisFasiliti === 'kk-kd' ? (
                      <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                        <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                      </td>
                    ) : null}
                    {jenisFasiliti === 'taska-tadika' ? (
                      <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                        <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                      </td>
                    ) : null}
                    {jenisFasiliti === 'projek-komuniti-lain' ? (
                      <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                        <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                      </td>
                    ) : null}
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                    </td>
                    {userinfo.role === 'admin' && (
                      <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                        <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                      </td>
                    )}
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </section>
        <div ref={bawahRef}>
          <section className='outline outline-1 outline-userBlack grid grid-cols-1 lg:grid-cols-2'>
            {resultPilih.map((singlePersonUmum) => {
              return (
                <>
                  <div className='lg:mb-3'>
                    <div className='text-l font-bold flex flex-row pl-5 p-2'>
                      <h1>
                        MAKLUMAT AM PESAKIT{' '}
                        {singlePersonUmum.kedatangan === 'baru-kedatangan' ? (
                          <span className='text-user7 inline-flex' title='Baru'>
                            <BsFilePerson />
                          </span>
                        ) : (
                          <span
                            className='text-user9 inline-flex'
                            title='Ulangan'
                          >
                            <BsFillFilePersonFill />
                          </span>
                        )}
                      </h1>
                    </div>
                    <div className='text-xs lg:text-sm flex flex-row pl-5'>
                      <h2 className='font-semibold'>NAMA :</h2>
                      <p className='ml-1'>{singlePersonUmum.nama}</p>
                    </div>
                    <div className='text-xs lg:text-sm flex flex-row pl-5'>
                      <h2 className='font-semibold'>UMUR :</h2>
                      <p className='ml-1'>
                        {singlePersonUmum.umur} tahun{' '}
                        {singlePersonUmum.umurBulan} bulan
                      </p>
                    </div>
                  </div>
                  <div className='lg:pt-10'>
                    <div className='text-xs lg:text-sm flex flex-row pl-5'>
                      <h2 className='font-semibold'>JANTINA :</h2>
                      <p className='ml-1'>{singlePersonUmum.jantina}</p>
                    </div>
                    <div className='text-xs lg:text-sm flex flex-row pl-5'>
                      <h2 className='font-semibold'>IC/Passport :</h2>
                      <p className='ml-1'>{singlePersonUmum.ic}</p>
                    </div>
                    {operasiHapus ? (
                      <button
                        className='float-right m-2 p-2 uppercase bg-user9 text-base text-userWhite rounded-md shadow-md hover:bg-user1 transition-all'
                        onClick={() => {
                          setModalHapus(true);
                        }}
                      >
                        hapus pesakit?
                      </button>
                    ) : singlePersonUmum.statusReten === 'telah diisi' ||
                      singlePersonUmum.rawatanDibuatOperatorLain === true ? (
                      <Link
                        target='_blank'
                        to={`form-umum/${singlePersonUmum._id}`}
                        className='float-right m-2 p-2 uppercase bg-user3 text-base text-userWhite rounded-md shadow-md hover:bg-user1 transition-all'
                      >
                        lihat reten
                      </Link>
                    ) : singlePersonUmum.statusReten === 'reten salah' ||
                      singlePersonUmum.rawatanDibuatOperatorLain === true ? (
                      <Link
                        target='_blank'
                        to={`form-umum/${singlePersonUmum._id}`}
                        className='float-right m-2 p-2 uppercase bg-user3 text-base text-userWhite rounded-md shadow-md hover:bg-user1 transition-all'
                      >
                        lihat reten
                      </Link>
                    ) : singlePersonUmum.statusReten === 'belum diisi' ? (
                      <Link
                        target='_blank'
                        to={`form-umum/${singlePersonUmum._id}`}
                        className='float-right m-2 p-2 uppercase bg-user3 text-base text-userWhite rounded-md shadow-md hover:bg-user1 transition-all'
                      >
                        masukkan reten
                      </Link>
                    ) : null}
                    {singlePersonUmum.statusReten === 'belum diisi' &&
                      singlePersonUmum.rawatanDibuatOperatorLain === true && (
                        <Link
                          target='_blank'
                          to={`form-umum/${singlePersonUmum._id}/rawatan-operator-lain`}
                          className='float-right m-2 p-2 uppercase bg-user3 text-base text-userWhite rounded-md shadow-md hover:bg-user1 transition-all'
                        >
                          masukkan reten bagi operator tambahan
                        </Link>
                      )}
                  </div>
                  {modalHapus && (
                    <UserDeleteModal
                      handleDelete={handleDelete}
                      setModalHapus={setModalHapus}
                      id={singlePersonUmum._id}
                      nama={singlePersonUmum.nama}
                    />
                  )}
                </>
              );
            })}
          </section>
          {resultPilih.length === 1 && (
            <button
              className='mt-3'
              onClick={() => {
                atasRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <BsFillArrowUpCircleFill className='text-user3 text-2xl animate-bounce' />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default UserUmum;
