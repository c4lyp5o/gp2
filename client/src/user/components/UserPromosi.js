import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { BsFillCircleFill, BsFillCheckCircleFill } from 'react-icons/bs';

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
  const [showTambahAcara, setShowTambahAcara] = useState(false);

  const [allAktivitiPromosi, setAllAktivitiPromosi] = useState([]);
  const [pilih, setPilih] = useState('');
  const [resultPilih, setResultPilih] = useState([]);
  const [operasiHapus, setOperasiHapus] = useState(false);
  const [modalHapus, setModalHapus] = useState(false);

  const [reloadState, setReloadState] = useState(false);

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
        setAllProgramPromosi(data.allProgramPromosi);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllProgramPromosi();
  }, [reliefUserToken, userToken]);

  const clearKodProgram = () => {
    setKodProgram('');
  };

  const tambahAcara = () => {
    setShowTambahAcara(true);
  };

  useEffect(() => {
    const query = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `/api/v1/query/promosi?kodProgram=${kodProgram}&individuOrKlinik=${individuOrKlinik}`,
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
  }, [
    individuOrKlinik,
    kodProgram,
    showTambahAcara,
    reloadState,
    reliefUserToken,
    userToken,
  ]);

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

  // clear kodProgram & showTambahAcara if change from individiu or klinik
  useEffect(() => {
    setKodProgram('');
    setShowTambahAcara(false);
  }, [individuOrKlinik]);

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
                  htmlFor='kod-program'
                  className='font-semibold whitespace-nowrap m-auto mx-5'
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
                  <option value=''></option>
                  {allProgramPromosi.map((p) => {
                    return (
                      <option value={p.kodProgram}>
                        {p.kodProgram} | {p.jenisProgram} | {p.namaProgram}
                      </option>
                    );
                  })}
                </select>
                {kodProgram && (
                  <div className='relative'>
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
              <div className='flex'>
                <label
                  htmlFor='jenis-program'
                  className='font-semibold whitespace-nowrap m-auto mx-5'
                >
                  jenis program :
                </label>
                <div className='w-full my-3 ml-2 mr-4 appearance-none leading-7 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user3 focus:outline-none rounded-md shadow-md whitespace-nowrap bg-user1 bg-opacity-25'>
                  <p className='whitespace-nowrap overflow-y-auto flex flex-row'>
                    {kodProgram !== ''
                      ? allProgramPromosi
                          .filter((p) => p.kodProgram.includes(kodProgram))
                          .map((p) => {
                            return <span>{p.jenisProgram}</span>;
                          })
                      : '..'}
                  </p>
                </div>
              </div>
              <div className='flex'>
                <label
                  htmlFor='nama-program'
                  className='font-semibold whitespace-nowrap m-auto mx-5'
                >
                  nama program :
                </label>
                <div className='w-full my-3 mr-4 appearance-none leading-7 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user3 focus:outline-none rounded-md shadow-md whitespace-nowrap bg-user1 bg-opacity-25'>
                  <p className='whitespace-nowrap overflow-y-auto flex flex-row'>
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
            </div>
          </div>
        </div>
        <div className='outline outline-1 outline-userBlack m-3 pt-1 pb-3'>
          <h1 className='text-lg font-semibold m-3'>
            SENARAI ACARA BAGI AKTIVITI PROMOSI / PENDIDIKAN KESIHATAN PERGIGIAN
          </h1>
          <section className='p-3'>
            <div className='m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max'>
              <table className='table-auto'>
                <thead className='text-userWhite bg-user2'>
                  <tr>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                      BIL
                    </th>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                      KOD PROGRAM
                    </th>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                      NAMA PROGRAM
                    </th>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1 md:w-screen md:max-w-md lg:w-screen lg:max-w-screen-lg'>
                      NAMA ACARA
                    </th>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                      TARIKH MULA
                    </th>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                      TARIKH AKHIR
                    </th>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                      DIBUAT OLEH
                    </th>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1 w-80'>
                      STATUS
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
                  allAktivitiPromosi.map((a, index) => {
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
                            {kodProgram !== '' &&
                              allProgramPromosi
                                .filter((p) =>
                                  p.kodProgram.includes(kodProgram)
                                )
                                .map((p) => {
                                  return <span>{p.namaProgram}</span>;
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
                              <span className='flex flex-row justify-center items-center'>
                                Belum Diisi
                                <BsFillCircleFill className='text-lg text-user9 ml-1' />
                              </span>
                            ) : (
                              <span className='flex flex-row justify-center items-center'>
                                Telah Diisi
                                <BsFillCheckCircleFill className='text-user7 text-lg my-1 ml-2 bg-userWhite bg-blend-normal rounded-full outline outline-2 outline-user7' />
                              </span>
                            )}
                          </td>
                          <td
                            onClick={() => {
                              setOperasiHapus(false);
                              setPilih(a._id);
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
          <section className='outline outline-1 outline-userBlack grid grid-cols-1 lg:grid-cols-2 m-3'>
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
                        {kodProgram !== '' &&
                          allProgramPromosi
                            .filter((p) => p.kodProgram.includes(kodProgram))
                            .map((p) => {
                              return <span>{p.jenisProgram}</span>;
                            })}
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
