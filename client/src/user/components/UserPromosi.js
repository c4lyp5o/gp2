import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import {
  BsFillCircleFill,
  BsFillCheckCircleFill,
  BsFillArrowUpCircleFill,
  BsExclamationCircleFill,
} from 'react-icons/bs';
import { FaSort, FaSortUp } from 'react-icons/fa';

import UserModalPromosi from './form-promosi/UserModalPromosi';
import UserDeleteModal from './UserDeleteModal';

import { useGlobalUserAppContext } from '../context/userAppContext';

function UserPromosi({ individuOrKlinik }) {
  const {
    userToken,
    userinfo,
    reliefUserToken,
    toast,
    refreshTimer,
    setRefreshTimer,
  } = useGlobalUserAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [allProgramPromosi, setAllProgramPromosi] = useState([]);
  const [kodProgram, setKodProgram] = useState('');
  const [jenisProgram, setJenisProgram] = useState([]);
  const [jenisProgramResult, setJenisProgramResult] = useState('');
  const [bulanPilih, setBulanPilih] = useState('');
  const [showTambahAcara, setShowTambahAcara] = useState(false);

  const [allAktivitiPromosi, setAllAktivitiPromosi] = useState([]);
  const [pilih, setPilih] = useState('');
  const [resultPilih, setResultPilih] = useState([]);
  const [operasiHapus, setOperasiHapus] = useState(false);
  const [modalHapus, setModalHapus] = useState(false);

  const [reloadState, setReloadState] = useState(false);

  const [sort, setSort] = useState({
    kodProgram: false,
    tarikhMula: false,
    tarikhAkhir: false,
    statusReten: false,
  });

  const bawahRef = useRef(null);
  const atasRef = useRef(null);

  useEffect(() => {
    const fetchAllProgramPromosi = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get('/api/v1/promosi', {
          headers: {
            Authorization: `Bearer ${
              reliefUserToken ? reliefUserToken : userToken
            }`,
          },
        });
        const withoutDuplicateJenisProgram = data.allProgramPromosi.map(
          (a) => a.jenisProgram
        );
        const withoutDuplicate = [...new Set(withoutDuplicateJenisProgram)];
        setJenisProgram(withoutDuplicate);
        setAllProgramPromosi(data.allProgramPromosi);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllProgramPromosi();
  }, []);

  const clearKodProgram = () => {
    setKodProgram('');
  };

  const tambahAcara = () => {
    setShowTambahAcara(true);
  };

  //scroll to bottom if resultPilih.length > 1
  const scrollBottom = () => {
    bawahRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (resultPilih.length > 0) {
      scrollBottom();
    }
  }, [resultPilih]);

  useEffect(() => {
    const query = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `/api/v1/query/promosi?tarikhAkhir=${bulanPilih}&individuOrKlinik=${individuOrKlinik}`,
          {
            headers: {
              Authorization: `Bearer ${
                reliefUserToken ? reliefUserToken : userToken
              }`,
            },
          }
        );
        setAllAktivitiPromosi(data.aktivitiPromosiResultQuery);
        setRefreshTimer(!refreshTimer);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    query();
  }, [individuOrKlinik, bulanPilih, showTambahAcara, reloadState]);

  useEffect(() => {
    const resultFilter = allAktivitiPromosi.filter((a) => {
      return a._id === pilih;
    });
    setResultPilih(resultFilter);
  }, [pilih]);

  // clear pilihan if change individuOrKlinik, kodProgram, reloadState
  useEffect(() => {
    if (modalHapus === false) {
      setPilih('');
      setResultPilih([]);
    }
  }, [individuOrKlinik, kodProgram, reloadState]);

  //clear kodProgram if change jenisProgram
  useEffect(() => {
    setKodProgram('');
  }, [jenisProgramResult]);

  // clear kodProgram & showTambahAcara if change from individiu or klinik
  useEffect(() => {
    setJenisProgramResult('');
    setKodProgram('');
    setShowTambahAcara(false);
  }, [individuOrKlinik]);

  //clear pilih & resultPilih if change bulanPilih
  useEffect(() => {
    setPilih('');
    setResultPilih([]);
  }, [bulanPilih]);

  // on tab focus reload data
  useEffect(() => {
    window.addEventListener('focus', setReloadState);
    setReloadState(!reloadState);
    return () => {
      window.removeEventListener('focus', setReloadState);
    };
  }, []);

  const handleDelete = async (singleAktiviti, reason) => {
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
          `/api/v1/promosi/aktiviti/delete/${singleAktiviti}`,
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
          pending: 'Menghapus acara...',
          success: 'Acara berjaya dihapus',
          error: 'Acara gagal dihapus',
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
      <div className='px-3 lg:px-3 h-full p-3 overflow-y-auto'>
        <div className='relative grid  outline outline-1 outline-userBlack m-3 p-2'>
          <div className=''>
            <div>
              <h2 className='text-xl text-left ml-5 mt-2 font-semibold flex flex-row'>
                PROGRAM PROMOSI{' '}
                {individuOrKlinik === 'promosi-individu'
                  ? 'INDIVIDU'
                  : 'KLINIK'}
              </h2>
              <div className='w-full flex flex-col lg:flex-row items-center'>
                <label
                  htmlFor='jenis-program'
                  className='font-semibold whitespace-nowrap mr-7 mx-5'
                >
                  jenis program :
                </label>
                <select
                  type='text'
                  name='jenis-program'
                  id='jenis-program'
                  value={jenisProgramResult}
                  className='w-full my-3 mx-4 leading-7 px-3 py-2 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
                  onChange={(e) => setJenisProgramResult(e.target.value)}
                >
                  <option value=''>Sila Pilih</option>
                  {jenisProgram.map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
              </div>
              <div className='w-full flex flex-col lg:flex-row items-center'>
                <label
                  htmlFor='kod-program'
                  className='font-semibold whitespace-nowrap mr-8 mx-5'
                >
                  kod program :
                </label>
                <select
                  type='text'
                  value={kodProgram}
                  onChange={(e) => {
                    setKodProgram(e.target.value);
                  }}
                  className='w-full my-3 mx-4 leading-7 px-3 py-2 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
                >
                  <option value=''>Sila Pilih</option>
                  {allProgramPromosi
                    .filter((p) => p.jenisProgram === jenisProgramResult)
                    .map((p) => {
                      return (
                        <option value={p.kodProgram}>
                          {p.kodProgram} | {p.namaProgram}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className='w-full flex flex-col lg:flex-row items-center'>
                <label
                  htmlFor='nama-program'
                  className='font-semibold whitespace-nowrap mx-5 text-left'
                >
                  nama program :
                </label>
                <div className='w-full my-3 mx-4 appearance-none leading-7 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user3 focus:outline-none rounded-md shadow-md whitespace-nowrap bg-user1 bg-opacity-25'>
                  <p className='whitespace-pre-wrap flex flex-row'>
                    {kodProgram !== ''
                      ? allProgramPromosi
                          .filter((p) => p.kodProgram.includes(kodProgram))
                          .map((p) => {
                            return <span>{p.namaProgram}</span>;
                          })
                      : '..'}
                  </p>
                </div>
              </div>
              {kodProgram && (
                <div className='relative my-1 text-right'>
                  <span
                    onClick={tambahAcara}
                    className='uppercase text-xs text-user1 bg-user8 p-2 py-2 whitespace-nowrap rounded-l-lg shadow-md hover:cursor-pointer hover:bg-user1 hover:text-userWhite'
                  >
                    tambah acara
                  </span>
                  <span
                    onClick={clearKodProgram}
                    className='uppercase bg-user3 text-xs text-userWhite rounded-r-lg shadow-md p-2 py-2 whitespace-nowrap hover:bg-user1 hover:cursor-pointer transition-all'
                  >
                    pilih semula
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='relative outline outline-1 outline-userBlack m-3 pt-1 pb-3'>
          <h1 className='text-lg font-semibold m-3'>
            SENARAI ACARA BAGI AKTIVITI PROMOSI / PENDIDIKAN KESIHATAN PERGIGIAN
          </h1>
          <div className='flex flex-col lg:flex-row items-center font-light lg:absolute left-1 top-2'>
            <label
              htmlFor='bulan'
              className='font-semibold whitespace-nowrap mr-2 mx-5 flex flex-row items-center'
            >
              bulan
              <BsExclamationCircleFill
                className='ml-2 text-lg text-user3'
                title='Pilih Bulan Yang Telah Ditetapkan Pada Tarikh Akhir Program'
              />
            </label>
            <select
              type='text'
              name='bulan'
              id='bulan'
              className='w-28 my-2 mx-4 leading-7 p-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
              onChange={(e) => setBulanPilih(e.target.value)}
            >
              <option value=''>Semua</option>
              <option value='01'>Januari</option>
              <option value='02'>Februari</option>
              <option value='03'>Mac</option>
              <option value='04'>April</option>
              <option value='05'>Mei</option>
              <option value='06'>Jun</option>
              <option value='07'>Julai</option>
              <option value='08'>Ogos</option>
              <option value='09'>September</option>
              <option value='10'>Oktober</option>
              <option value='11'>November</option>
              <option value='12'>Disember</option>
            </select>
          </div>
          <section className='p-3'>
            <div className='m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max'>
              <table className='table-auto'>
                <thead className='text-userWhite bg-user2' ref={atasRef}>
                  <tr>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                      BIL
                    </th>
                    <th
                      className={`px-2 py-1 outline outline-1 outline-offset-1 w-60 lg:whitespace-nowrap cursor-pointer ${
                        sort.kodProgram ? 'text-bold text-kaunterBlack' : ''
                      }`}
                      onClick={() => {
                        setSort({
                          ...sort,
                          kodProgram: !sort.kodProgram,
                        });
                      }}
                    >
                      KOD PROGRAM
                      {sort.kodProgram ? (
                        <FaSortUp className='inline-flex items-center' />
                      ) : (
                        <FaSort className='inline-flex items-center' />
                      )}
                    </th>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                      NAMA PROGRAM
                    </th>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1 md:w-screen md:max-w-md lg:w-screen lg:max-w-screen-lg'>
                      NAMA ACARA
                    </th>
                    <th
                      className={`px-2 py-1 outline outline-1 outline-offset-1 w-60 cursor-pointer ${
                        sort.tarikhMula ? 'text-bold text-kaunterBlack' : ''
                      }`}
                      onClick={() => {
                        setSort({
                          ...sort,
                          tarikhMula: !sort.tarikhMula,
                        });
                      }}
                    >
                      TARIKH MULA
                      {sort.tarikhMula ? (
                        <FaSortUp className='inline-flex items-center' />
                      ) : (
                        <FaSort className='inline-flex items-center' />
                      )}
                    </th>
                    <th
                      className={`px-2 py-1 outline outline-1 outline-offset-1 w-60 cursor-pointer ${
                        sort.tarikhAkhir ? 'text-bold text-kaunterBlack' : ''
                      }`}
                      onClick={() => {
                        setSort({
                          ...sort,
                          tarikhAkhir: !sort.tarikhAkhir,
                        });
                      }}
                    >
                      TARIKH AKHIR
                      {sort.tarikhAkhir ? (
                        <FaSortUp className='inline-flex items-center' />
                      ) : (
                        <FaSort className='inline-flex items-center' />
                      )}
                    </th>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                      DIBUAT OLEH
                    </th>
                    <th
                      className={`px-2 py-1 outline outline-1 outline-offset-1 w-80 cursor-pointer ${
                        sort.statusReten ? 'text-bold text-kaunterBlack' : ''
                      }`}
                      onClick={() => {
                        setSort({
                          ...sort,
                          statusReten: !sort.statusReten,
                        });
                      }}
                    >
                      STATUS
                      {sort.statusReten ? (
                        <FaSortUp className='inline-flex items-center' />
                      ) : (
                        <FaSort className='inline-flex items-center' />
                      )}
                    </th>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1 w-80'>
                      AKTIFKAN
                    </th>
                    {(userinfo.role === 'admin' ||
                      userinfo.rolePromosiKlinik === true) && (
                      <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                        HAPUS
                      </th>
                    )}
                  </tr>
                </thead>
                {!isLoading &&
                  allAktivitiPromosi
                    .filter((a) => {
                      if (bulanPilih === '') {
                        return a;
                      } else if (a.tarikhAkhir.slice(5, 7) === bulanPilih) {
                        return a;
                      }
                    })
                    .sort((a, b) => {
                      if (sort.kodProgram) {
                        return a.kodProgram.localeCompare(b.kodProgram);
                      }
                    })
                    .sort((a, b) => {
                      if (sort.tarikhMula) {
                        return a.tarikhMula.localeCompare(b.tarikhMula);
                      }
                    })
                    .sort((a, b) => {
                      if (sort.tarikhAkhir) {
                        return a.tarikhAkhir.localeCompare(b.tarikhAkhir);
                      }
                    })
                    .sort((a, b) => {
                      if (sort.statusReten) {
                        return a.statusReten.localeCompare(b.statusReten);
                      }
                    })
                    .map((a, index) => {
                      return (
                        <tbody className='bg-user4'>
                          <tr>
                            <td
                              className={`${
                                pilih === a._id && 'bg-user3'
                              } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                            >
                              {index + 1}
                            </td>
                            <td
                              className={`${
                                pilih === a._id && 'bg-user3'
                              } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                            >
                              {a.kodProgram}
                            </td>
                            <td
                              className={`${
                                pilih === a._id && 'bg-user3'
                              } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                            >
                              {allProgramPromosi
                                .filter((b) => {
                                  if (b.kodProgram === a.kodProgram) {
                                    return b;
                                  }
                                })
                                .map((b) => {
                                  return b.namaProgram;
                                })}
                            </td>
                            <td
                              className={`${
                                pilih === a._id && 'bg-user3'
                              } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                            >
                              {a.namaAcara}
                            </td>
                            <td
                              className={`${
                                pilih === a._id && 'bg-user3'
                              } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                            >
                              {moment(a.tarikhMula).format('DD/MM/YYYY')}
                            </td>
                            <td
                              className={`${
                                pilih === a._id && 'bg-user3'
                              } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                            >
                              {moment(a.tarikhAkhir).format('DD/MM/YYYY')}
                            </td>
                            <td
                              className={`${
                                pilih === a._id && 'bg-user3'
                              } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                            >
                              {a.createdByUsername}
                            </td>
                            <td
                              className={`${
                                pilih === a._id && 'bg-user3'
                              } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                            >
                              {a.statusReten === 'belum diisi' ? (
                                <span className='flex flex-row justify-center items-center whitespace-nowrap'>
                                  Belum Diisi
                                  <BsFillCircleFill className='text-lg text-user9 ml-1' />
                                </span>
                              ) : (
                                <span className='flex flex-row justify-center items-center whitespace-nowrap'>
                                  Telah Diisi
                                  <BsFillCheckCircleFill className='text-user7 text-lg my-1 ml-2 bg-userWhite bg-blend-normal rounded-full outline outline-2 outline-user7' />
                                </span>
                              )}
                            </td>
                            <td
                              onClick={() => {
                                setOperasiHapus(false);
                                setPilih(a._id);
                                scrollBottom();
                              }}
                              className={`${
                                pilih === a._id && 'bg-user3'
                              } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1 hover:cursor-pointer text-user2`}
                            >
                              <u>PILIH</u>
                            </td>
                            {(userinfo.role === 'admin' ||
                              userinfo.rolePromosiKlinik === true) && (
                              <td
                                onClick={() => {
                                  setOperasiHapus(true);
                                  setPilih(a._id);
                                  scrollBottom();
                                }}
                                className={`${
                                  pilih === a._id && 'bg-user3'
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
                      <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                        <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                      </td>
                      <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                        <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                      </td>
                      <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                        <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                      </td>
                    </tr>
                    <tr>
                      <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                        <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                      </td>
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
                      <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                        <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                      </td>
                      <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                        <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
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
                      <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                        <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                      </td>
                      <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                        <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </section>
          <section
            className='outline outline-1 outline-userBlack grid grid-cols-1 lg:grid-cols-2 m-3'
            ref={bawahRef}
          >
            {resultPilih.map((a) => {
              return (
                <>
                  <div className='lg:mb-3'>
                    <div className='text-l font-bold flex flex-row pl-5 p-2'>
                      <h1>MAKLUMAT ACARA</h1>
                    </div>
                    <div className='text-xs lg:text-sm flex flex-row pl-5'>
                      <h2 className='font-semibold'>jenis program :</h2>
                      <p className='ml-1'>
                        {/* if include kodProgram map jenisProgram */}
                        {allProgramPromosi
                          .filter((b) => b.kodProgram === a.kodProgram)
                          .map((c) => c.jenisProgram)}
                      </p>
                    </div>
                    <div className='text-xs lg:text-sm flex flex-row pl-5'>
                      <h2 className='font-semibold'>nama acara :</h2>
                      <p className='ml-1'>{a.namaAcara}</p>
                    </div>
                  </div>
                  <div className='lg:pt-10'>
                    <div className='text-xs lg:text-sm flex flex-row pl-5'>
                      <h2 className='font-semibold'>tarikh mula :</h2>
                      <p className='ml-1'>
                        {moment(a.tarikhMula).format('DD/MM/YYYY')}
                      </p>
                    </div>
                    <div className='text-xs lg:text-sm flex flex-row pl-5'>
                      <h2 className='font-semibold'>tarikh akhir :</h2>
                      <p className='ml-1'>
                        {moment(a.tarikhAkhir).format('DD/MM/YYYY')}
                      </p>
                    </div>
                    {operasiHapus ? (
                      <button
                        className='float-right m-2 p-2 uppercase bg-user9 text-base text-userWhite rounded-md shadow-md hover:bg-user1 transition-all'
                        onClick={() => {
                          setModalHapus(true);
                        }}
                      >
                        hapus acara?
                      </button>
                    ) : a.statusReten === 'belum diisi' ? (
                      <Link
                        target='_blank'
                        to={`form-promosi/${a._id}`}
                        className='float-right m-2 p-2 uppercase bg-user3 text-base text-userWhite rounded-md shadow-md hover:bg-user1 transition-all'
                      >
                        masukkan reten
                      </Link>
                    ) : a.statusReten === 'telah diisi' ? (
                      <Link
                        target='_blank'
                        to={`form-promosi/${a._id}`}
                        className='float-right m-2 p-2 uppercase bg-user3 text-base text-userWhite rounded-md shadow-md hover:bg-user1 transition-all'
                      >
                        lihat reten
                      </Link>
                    ) : null}
                  </div>
                  {modalHapus && (
                    <UserDeleteModal
                      handleDelete={handleDelete}
                      setModalHapus={setModalHapus}
                      id={a._id}
                      nama={a.namaAcara}
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
              <span className='bg-user3 text-userWhite text-sm p-1 flex flex-row items-center rounded-md'>
                Kembali Ke Atas
                <BsFillArrowUpCircleFill className='animate-bounce ml-1' />
              </span>
            </button>
          )}
        </div>
      </div>
      {showTambahAcara && (
        <UserModalPromosi
          individuOrKlinik={individuOrKlinik}
          setShowTambahAcara={setShowTambahAcara}
          kodProgram={kodProgram}
          toast={toast}
        />
      )}
    </>
  );
}

export default UserPromosi;
