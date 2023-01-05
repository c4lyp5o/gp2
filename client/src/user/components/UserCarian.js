import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import {
  BsFilePerson,
  BsFillFilePersonFill,
  BsFillCircleFill,
  BsFillBookmarkXFill,
  BsFillCheckCircleFill,
  BsPersonCircle,
  BsCalendarPlusFill,
  BsFillCaretDownFill,
} from 'react-icons/bs';
import DatePicker from 'react-datepicker';

import UserRetenSalahModal from './UserRetenSalahModal';

import { useGlobalUserAppContext } from '../context/userAppContext';

export default function UserCarian() {
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

  const [namaKlinik, setNamaKlinik] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [nama, setNama] = useState('');
  const [tarikhKedatangan, setTarikhKedatangan] = useState(dateToday);
  const [jenisFasiliti, setJenisFasiliti] = useState('kp');
  const [jenisProgram, setJenisProgram] = useState('');
  const [queryResult, setQueryResult] = useState('');
  const [pilihanId, setPilihanId] = useState('');
  const [pilihanNama, setPilihanNama] = useState('');
  const [pilihanStatusReten, setPilihanStatusReten] = useState('');
  const [modalRetenSalah, setModalRetenSalah] = useState(false);

  // for datepicker
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
        'appearance-none w-auto text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md uppercase flex flex-row lg:ml-2',
    });
  };

  useEffect(() => {
    const fetchIdentity = async () => {
      try {
        const { data } = await axios.get('/api/v1/identity', {
          headers: {
            Authorization: `Bearer ${
              reliefUserToken ? reliefUserToken : userToken
            }`,
          },
        });
        setNamaKlinik(data.kp);
      } catch (error) {
        console.log(error);
      }
    };
    fetchIdentity();
  }, []);

  useEffect(() => {
    if (modalRetenSalah === false) {
      const query = async () => {
        try {
          setIsLoading(true);
          const { data } = await axios.get(
            `/api/v1/query/umum?nama=${nama}&tarikhKedatangan=${moment(
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
          // 👇️ sort by String property DESCENDING (Z - A)
          const desc = data.umumResultQuery.sort((a, b) =>
            a.statusReten > b.statusReten ? -1 : 1
          );
          setQueryResult(desc);
          setRefreshTimer(!refreshTimer);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
        }
      };
      setPilihanId('');
      setPilihanNama('');
      setPilihanStatusReten('');
      query();
    }
  }, [nama, tarikhKedatangan, jenisFasiliti, jenisProgram, modalRetenSalah]);

  // clear program if change jenisFasiliti
  useEffect(() => {
    setJenisProgram('');
  }, [jenisFasiliti]);

  const handleRetenSalah = async (singlePerson, reason) => {
    if (!modalRetenSalah) {
      setModalRetenSalah(true);
      return;
    }
    if (modalRetenSalah) {
      let mdcMdtbNum = '';
      if (!userinfo.mdtbNumber) {
        mdcMdtbNum = userinfo.mdcNumber;
      }
      if (!userinfo.mdcNumber) {
        mdcMdtbNum = userinfo.mdtbNumber;
      }
      await toast.promise(
        axios.patch(
          `/api/v1/umum/salah/${singlePerson}`,
          {
            retenSalahReason: reason,
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
          pending: 'Menanda reten pesakit...',
          success: 'Reten pesakit berjaya ditanda',
          error: 'Reten pesakit gagal ditanda',
        },
        {
          autoClose: 5000,
        }
      );
      setModalRetenSalah(false);
    }
  };

  return (
    <>
      <div className='h-full p-3 lg:p-5 overflow-y-auto'>
        <div className='text-lg font-bold uppercase'>
          senarai sejarah kedatangan pesakit bagi {namaKlinik}
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 justify-center my-5'>
          <div>
            <div className='m-auto w-96 lg:flex lg:flex-row py-3'>
              <label
                htmlFor='pilihanTarikh'
                className='whitespace-nowrap flex items-center mb-1'
              >
                Tarikh Kedatangan :{' '}
              </label>
              <TarikhKedatangan />
            </div>
            <div className='m-auto w-full lg:w-96 lg:flex lg:flex-row py-3'>
              <label
                htmlFor='pilihanNama'
                className='whitespace-nowrap flex items-center mb-1'
              >
                Carian Nama :{' '}
              </label>
              <input
                type='search'
                name='pilihanNama'
                className='appearance-none w-full text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md uppercase lg:ml-2'
                id='pilihanNama'
                onChange={(e) => {
                  setNama(e.target.value);
                }}
              />
            </div>
          </div>
          <div>
            <div className='w-96 lg:flex lg:flex-row py-3'>
              <label
                className='whitespace-nowrap flex items-center pb-1 text-base font-medium mr-3'
                htmlFor='jenis-fasiliti'
              >
                pilih jenis fasiliti:
              </label>
              <div className='relative w-64'>
                <select
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
              <div className='w-96 lg:flex lg:flex-row py-3'>
                <label
                  className='whitespace-nowrap flex items-center pb-1 text-base font-medium mr-3'
                  htmlFor='jenis-program'
                >
                  jenis program:
                </label>
                <div className='relative w-64'>
                  <select
                    name='jenis-program'
                    id='jenis-program'
                    value={jenisProgram}
                    onChange={(e) => {
                      setJenisProgram(e.target.value);
                    }}
                    className='appearance-none leading-7 px-3 py-1 ring-2 w-64 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md '
                  >
                    <option value=''>Jenis Program / Aktiviti</option>
                    <option value='programDewasaMuda'>
                      Program Dewasa Muda
                    </option>
                    <option value='kampungAngkatPergigian'>
                      Program Kampung Angkat Pergigian
                    </option>
                    <option value='ppr'>Projek Perumahan Rakyat</option>
                    <option value='we'>Institusi Warga Emas</option>
                    <option value='oku'>Institusi OKU / PDK</option>
                    <option value='projek-komuniti'>Projek Komuniti</option>
                    <option value='ppkps'>
                      Program Pemasyarakatan Perkhidmatan Klinik Pergigian
                      Sekolah
                    </option>
                    <option value='oap'>Program Orang Asli dan Penan</option>
                    <option value='penjara-koreksional'>
                      Program di Penjara / Pusat Koreksional
                    </option>
                    {userinfo.createdByNegeri === 'Sabah' && (
                      <option value='fds'>Flying Dental Service (Sabah)</option>
                    )}
                    {userinfo.createdByNegeri === 'Kelantan' && (
                      <option value='rtc'>RTC (Kelantan)</option>
                    )}
                    <option value='incremental'>
                      Program Pergigian Sekolah sesi 2022/2023
                    </option>
                  </select>
                  <span>
                    <BsFillCaretDownFill className='absolute top-3 right-2 text-user3' />
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='m-auto overflow-x-auto overflow-y-hidden text-xs lg:text-sm rounded-md h-min max-w-max'>
          <table className='table-auto'>
            <thead className='text-userWhite bg-user2'>
              <tr>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  BIL
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  WAKTU SAMPAI
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  NO. PENDAFTARAN
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1 w-96 max-w-md'>
                  NAMA PESAKIT
                </th>
                <th className={`px-2 py-1 outline outline-1 outline-offset-1`}>
                  NO. PENGENALAN DIRI
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
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
                <th className={`px-2 py-1 outline outline-1 outline-offset-1`}>
                  OPERATOR
                </th>
                <th className={`px-2 py-1 outline outline-1 outline-offset-1`}>
                  STATUS PENGISIAN RETEN
                </th>
                <th
                  className={`px-2 py-1 outline outline-1 outline-offset-1 w-80`}
                >
                  TINDAKAN
                </th>
              </tr>
            </thead>
            {!isLoading &&
              queryResult.map((singlePersonUmum, index) => {
                return (
                  <tbody className='bg-user4'>
                    <tr>
                      <td
                        className={`${
                          pilihanId === singlePersonUmum._id && 'bg-user3'
                        } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                      >
                        {index + 1}
                      </td>
                      <td
                        className={`${
                          pilihanId === singlePersonUmum._id && 'bg-user3'
                        } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                      >
                        {formatTime(singlePersonUmum.waktuSampai)}
                      </td>
                      {singlePersonUmum.noPendaftaranBaru ? (
                        <td
                          className={`${
                            pilihanId === singlePersonUmum._id && 'bg-user3'
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
                            pilihanId === singlePersonUmum._id && 'bg-user3'
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
                          pilihanId === singlePersonUmum._id && 'bg-user3'
                        } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                      >
                        {singlePersonUmum.nama.toUpperCase()}
                      </td>
                      <td
                        className={`${
                          pilihanId === singlePersonUmum._id && 'bg-user3'
                        } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                      >
                        {singlePersonUmum.ic.toUpperCase()}
                      </td>
                      <td
                        className={`${
                          pilihanId === singlePersonUmum._id && 'bg-user3'
                        } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                      >
                        {statusPesakit(singlePersonUmum)}
                      </td>
                      {jenisFasiliti === 'kk-kd' ? (
                        <td
                          className={`${
                            pilihanId === singlePersonUmum._id && 'bg-user3'
                          } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                        >
                          {singlePersonUmum.namaFasilitiKkKd}
                        </td>
                      ) : null}
                      {jenisFasiliti === 'taska-tadika' ? (
                        <td
                          className={`${
                            pilihanId === singlePersonUmum._id && 'bg-user3'
                          } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                        >
                          {singlePersonUmum.namaFasilitiTaskaTadika}
                        </td>
                      ) : null}
                      {jenisFasiliti === 'projek-komuniti-lain' ? (
                        <td
                          className={`${
                            pilihanId === singlePersonUmum._id && 'bg-user3'
                          } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                        >
                          {singlePersonUmum.namaProgram}
                        </td>
                      ) : null}
                      <td
                        className={`${
                          pilihanId === singlePersonUmum._id && 'bg-user3'
                        } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                      >
                        {singlePersonUmum.createdByUsername === 'kaunter'
                          ? null
                          : singlePersonUmum.createdByUsername}
                      </td>
                      <td
                        className={`${
                          pilihanId === singlePersonUmum._id && 'bg-user3'
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
                        ) : singlePersonUmum.statusReten === 'telah diisi' ? (
                          <div className='flex items-center justify-center whitespace-nowrap'>
                            <span>Selesai Diisi</span>
                            <BsFillCheckCircleFill className='text-user7 text-lg my-1 ml-2 bg-userWhite bg-blend-normal rounded-full outline outline-1 outline-user7' />
                          </div>
                        ) : singlePersonUmum.statusReten === 'reten salah' ? (
                          <div className='flex items-center justify-center whitespace-nowrap'>
                            <span>Terdapat Kesalahan Reten</span>
                            <BsFillBookmarkXFill className='text-user9 text-lg my-1 ml-2' />
                          </div>
                        ) : null}
                      </td>
                      <td
                        className={`${
                          pilihanId === singlePersonUmum._id && 'bg-user3'
                        } px-2 py-3 outline outline-1 outline-userWhite outline-offset-1 text-user2`}
                      >
                        {singlePersonUmum.statusReten === 'telah diisi' ||
                        singlePersonUmum.statusReten === 'reten salah' ? (
                          <Link
                            target='_blank'
                            to={`/pengguna/landing/umum/form-umum/${singlePersonUmum._id}`}
                            className='m-2 p-2 uppercase bg-user3 text-sm text-userWhite rounded-md shadow-md whitespace-nowrap hover:bg-user1 transition-all'
                          >
                            lihat reten
                          </Link>
                        ) : null}
                        {userinfo.role === 'admin' &&
                          (singlePersonUmum.statusReten === 'telah diisi' ||
                          singlePersonUmum.statusReten === 'reten salah' ? (
                            <span
                              onClick={() => {
                                setModalRetenSalah(true);
                                setPilihanId(singlePersonUmum._id);
                                setPilihanNama(singlePersonUmum.nama);
                                setPilihanStatusReten(
                                  singlePersonUmum.statusReten
                                );
                              }}
                              className='m-2 p-2 uppercase bg-user9 text-sm text-userWhite rounded-md shadow-md whitespace-nowrap hover:bg-user1 hover:cursor-pointer transition-all'
                            >
                              RETEN SALAH
                            </span>
                          ) : null)}
                      </td>
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
                  {jenisFasiliti === 'kk-kd' ? (
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                    </td>
                  ) : null}
                  {jenisFasiliti === 'taska-tadika' ? (
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                    </td>
                  ) : null}
                  {jenisFasiliti === 'projek-komuniti-lain' ? (
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                    </td>
                  ) : null}
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                  </td>
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
                  {jenisFasiliti === 'kk-kd' ? (
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                    </td>
                  ) : null}
                  {jenisFasiliti === 'taska-tadika' ? (
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                    </td>
                  ) : null}
                  {jenisFasiliti === 'projek-komuniti-lain' ? (
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                    </td>
                  ) : null}
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                  </td>
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
                  {jenisFasiliti === 'kk-kd' ? (
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                    </td>
                  ) : null}
                  {jenisFasiliti === 'taska-tadika' ? (
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                    </td>
                  ) : null}
                  {jenisFasiliti === 'projek-komuniti-lain' ? (
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                    </td>
                  ) : null}
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
        {modalRetenSalah && (
          <UserRetenSalahModal
            handleRetenSalah={handleRetenSalah}
            setModalRetenSalah={setModalRetenSalah}
            id={pilihanId}
            nama={pilihanNama}
            statusReten={pilihanStatusReten}
          />
        )}
      </div>
    </>
  );
}
