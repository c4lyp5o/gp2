import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  BsFillCircleFill,
  BsFillCheckCircleFill,
  BsChevronDoubleRight,
  BsChevronDoubleLeft,
  BsDownload,
  BsEnvelopeX,
  BsHurricane,
} from 'react-icons/bs';

import { useGlobalUserAppContext } from '../../context/userAppContext';

import UserModalSelesaiSekolah from './UserModalSelesaiSekolah';
// import UserModalRefreshPelajar from './UserModalRefreshPelajar';

function UserSekolahList() {
  const {
    userToken,
    reliefUserToken,
    refreshTimer,
    setRefreshTimer,
    percentageCalc,
    toast,
    userinfo,
  } = useGlobalUserAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [allPersonSekolahs, setAllPersonSekolahs] = useState([]);
  const [namaSekolahs, setNamaSekolahs] = useState([]);
  // const [enrolmen, setEnrolmen] = useState([]);
  // const [kedatanganBaru, setKedatanganBaru] = useState([]);
  // const [kesSelesai, setKesSelesai] = useState([]);
  const [sekMenRen, setSekMenRen] = useState('');

  const [modalSelesaiSekolah, setModalSelesaiSekolah] = useState(false);
  // const [modalRefreshPelajar, setModalRefreshPelajar] = useState(false);
  const [idSekolah, setIdSekolah] = useState('');

  const [isTutup, setIsTutup] = useState(false);
  // const [isKemaskini, setIsKemaskini] = useState(false);
  const [isDownload, setIsDownload] = useState(false);

  const [isDownloading, setIsDownloading] = useState(false);
  const [reloadState, setReloadState] = useState(false);

  useEffect(() => {
    const fetchFasilitiSekolahs = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get('/api/v1/sekolah', {
          headers: {
            Authorization: `Bearer ${
              reliefUserToken ? reliefUserToken : userToken
            }`,
          },
        });
        data.fasilitiSekolahs.sort(
          (a, b) => a.sekolahSelesaiReten - b.sekolahSelesaiReten
        );
        setAllPersonSekolahs(data.allPersonSekolahs);
        setNamaSekolahs(data.fasilitiSekolahs);
        // data.fasilitiSekolahs
        //   .sort((a, b) => a.sekolahSelesaiReten - b.sekolahSelesaiReten)
        //   .forEach((singleSekolah) => {
        //     // kira enrolmen
        //     const tempEnrolmen = () => {
        //       return data.allPersonSekolahs.filter((person) =>
        //         person.namaSekolah.includes(singleSekolah.nama)
        //       ).length;
        //     };
        //     setEnrolmen((current) => [...current, tempEnrolmen()]);

        //     // kira kedatangan baru
        //     let tempKedatanganBaru = 0;
        //     data.allPersonSekolahs
        //       .filter((person) =>
        //         person.namaSekolah.includes(singleSekolah.nama)
        //       )
        //       .forEach((person) => {
        //         if (person.pemeriksaanSekolah /*&& person.rawatanSekolah[0]*/) {
        //           tempKedatanganBaru += 1;
        //         }
        //         // if (person.pemeriksaanSekolah && person.rawatanSekolah[0]) {
        //         //   if (
        //         //     person.pemeriksaanSekolah.tarikhPemeriksaanSemasa ===
        //         //     person.rawatanSekolah[0].tarikhRawatanSemasa
        //         //   ) {
        //         //     tempKedatanganBaru += 1;
        //         //   }
        //         // }
        //       });
        //     setKedatanganBaru((current) => [...current, tempKedatanganBaru]);

        //     // kira kes selesai from statusRawatan === 'selesai'
        //     let tempKesSelesai = 0;
        //     data.allPersonSekolahs
        //       .filter((person) =>
        //         person.namaSekolah.includes(singleSekolah.nama)
        //       )
        //       .forEach((person) => {
        //         if (person.statusRawatan === 'selesai') {
        //           tempKesSelesai += 1;
        //         }
        //       });
        //     setKesSelesai((current) => [...current, tempKesSelesai]);
        //   });
        setRefreshTimer(!refreshTimer);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFasilitiSekolahs();
  }, [reloadState]);

  const handleSelesaiSekolah = async (idSekolah) => {
    if (!modalSelesaiSekolah) {
      setModalSelesaiSekolah(true);
      return;
    }
    if (modalSelesaiSekolah) {
      let mdcMdtbNum = '';
      if (!userinfo.mdtbNumber) {
        mdcMdtbNum = userinfo.mdcNumber;
      }
      if (!userinfo.mdcNumber) {
        mdcMdtbNum = userinfo.mdtbNumber;
      }
      await toast.promise(
        axios.patch(
          `/api/v1/sekolah/fasiliti/${idSekolah}`,
          { sekolahSelesaiReten: true },
          {
            headers: {
              Authorization: `Bearer ${
                reliefUserToken ? reliefUserToken : userToken
              }`,
            },
          }
        ),
        {
          pending: 'Sedang menutup reten sekolah...',
          success: 'Sekolah telah ditandakan selesai!',
          error: 'Gagal untuk selesai sekolah. Sila cuba lagi.',
        },
        {
          autoClose: 3000,
        }
      );
      setModalSelesaiSekolah(false);
      setReloadState(!reloadState);
    }
  };

  const handleDownloadSenaraiSekolah = async (
    kodSekolah,
    namaSekolah,
    sesiTakwimSekolah
  ) => {
    const id = toast.loading('Sedang mencetak senarai pelajar...');
    try {
      setIsDownloading(true);
      const { data } = await axios.get(
        `/api/v1/sekolah/muatturun/${kodSekolah}`,
        {
          headers: {
            Authorization: `Bearer ${reliefUserToken ?? userToken}`,
          },
          responseType: 'blob',
        }
      );
      const currentTakwim = sesiTakwimSekolah.replace('/', '-');
      const link = document.createElement('a');
      link.download = `SENARAI PELAJAR ${namaSekolah} - ${currentTakwim}.xlsx`;
      link.href = URL.createObjectURL(new Blob([data]));
      link.addEventListener('click', (e) => {
        setTimeout(() => URL.revokeObjectURL(link.href), 100);
      });
      link.click();
      toast.update(id, {
        render: `Berjaya mencetak senarai pelajar ${namaSekolah}`,
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      toast.update(id, {
        render: 'Harap maaf, senarai pelajar tidak dapat dimuatturun',
        type: 'error',
        isLoading: false,
        autoClose: 2000,
      });
      console.log(error);
    } finally {
      setTimeout(() => {
        setIsDownloading(false);
      }, 10000);
    }
  };

  // const handleRefreshPelajar = async () => {
  //   if (!modalRefreshPelajar) {
  //     setModalRefreshPelajar(true);
  //     return;
  //   }
  //   if (modalRefreshPelajar) {
  //     let mdcMdtbNum = '';
  //     if (!userinfo.mdtbNumber) {
  //       mdcMdtbNum = userinfo.mdcNumber;
  //     }
  //     if (!userinfo.mdcNumber) {
  //       mdcMdtbNum = userinfo.mdtbNumber;
  //     }
  //     await toast.promise(
  //       axios.get(`/api/v1/sekolah/kemaskini/${idSekolah}`, {
  //         headers: {
  //           Authorization: `Bearer ${
  //             reliefUserToken ? reliefUserToken : userToken
  //           }`,
  //         },
  //       }),
  //       {
  //         pending: 'Sedang mengesahkan pengemaskinian pelajar...',
  //         success: 'Pengemaskinian pelajar akan dilakukan',
  //         error: 'Gagal untuk kemaskini pelajar. Sila cuba lagi.',
  //       },
  //       {
  //         autoClose: 3000,
  //       }
  //     );
  //     setModalRefreshPelajar(false);
  //     setReloadState(!reloadState);
  //   }
  // };

  // on tab focus reload data
  useEffect(() => {
    window.addEventListener('focus', setReloadState);
    setReloadState(!reloadState);
    return () => {
      window.removeEventListener('focus', setReloadState);
    };
  }, []);

  function kiraEnrolmen(allPersonSekolahs, singleNamaSekolah) {
    return allPersonSekolahs.filter((person) =>
      person.kodSekolah.includes(singleNamaSekolah.kodSekolah)
    ).length === 0
      ? 'Dalam semakan MOEIS'
      : allPersonSekolahs.filter((person) =>
          person.kodSekolah.includes(singleNamaSekolah.kodSekolah)
        ).length;
  }

  function kiraKedatanganBaru(allPersonSekolahs, singleNamaSekolah) {
    return allPersonSekolahs
      .filter((person) =>
        person.kodSekolah.includes(singleNamaSekolah.kodSekolah)
      )
      .filter((person) => person.pemeriksaanSekolah).length;
  }

  function kiraKesSelesai(allPersonSekolahs, singleNamaSekolah) {
    return allPersonSekolahs
      .filter((person) =>
        person.kodSekolah.includes(singleNamaSekolah.kodSekolah)
      )
      .filter((person) => person.statusRawatan === 'selesai').length;
  }

  return (
    <>
      <div className='px-3 lg:px-7 h-full p-3 overflow-y-auto'>
        <div>
          <h1 className='my-3 text-2xl font-bold'>RUMUSAN STATUS SEKOLAH</h1>
          <div className='my-4 flex flex-row justify-between'>
            <select
              className='bg-user3 w-72 text-userWhite rounded-md shadow-md p-2 mr-2'
              onChange={(e) => setSekMenRen(e.target.value)}
            >
              <option value=''>SEMUA SEKOLAH</option>
              <option value='sekolah-menengah'>SEKOLAH MENENGAH</option>
              <option value='sekolah-rendah'>SEKOLAH RENDAH</option>
            </select>
            {/* <Link
              to='sekolah'
              className='uppercase w-72 bg-[#c0392b] text-base text-userWhite rounded-md shadow-md p-2 hover:bg-user1 transition-all flex flex-row justify-center items-center'
            >
              <BsChevronDoubleRight className='animate-ping' />
              <BsChevronDoubleRight /> Masuk Reten Sekolah{' '}
              <BsChevronDoubleLeft />
              <BsChevronDoubleLeft className='animate-ping' />
            </Link> */}
          </div>
        </div>
        <div className='flex m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max'>
          <table className='table-auto'>
            <thead className='text-userWhite bg-user2'>
              <tr>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  BIL
                </th>
                <th className='outline outline-1 outline-offset-1 py-1 w-96'>
                  NAMA SEKOLAH
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 w-44'>
                  ENROLMEN
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 w-24'>
                  BIL. MURID BARU
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 w-24'>
                  BIL. KES SELESAI
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 w-24'>
                  PERATUS SELESAI
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 w-36'>
                  STATUS SEKOLAH
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 w-36'>
                  ISI RETEN
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 w-44'>
                  TINDAKAN
                </th>
              </tr>
            </thead>
            {isLoading ? (
              <tbody className='bg-user4'>
                <tr>
                  <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                  </td>
                  <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-24 rounded-xl'></span>
                  </td>
                  <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                  </td>
                  <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                  <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                  </td>
                  <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                  </td>
                  <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                  </td>
                  <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                  </td>
                  <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                    {userinfo.role === 'admin' && (
                      <>
                        <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                        <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                      </>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                  </td>
                  <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-24 rounded-xl'></span>
                  </td>
                  <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                  </td>
                  <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                  <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                  </td>
                  <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                  </td>
                  <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                  </td>
                  <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                  </td>
                  <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                    {userinfo.role === 'admin' && (
                      <>
                        <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                        <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                      </>
                    )}
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className='bg-user4'>
                {namaSekolahs
                  .filter((singleNamaSekolah) => {
                    if (sekMenRen === 'sekolah-menengah') {
                      return singleNamaSekolah.jenisFasiliti.includes(
                        'sekolah-menengah'
                      );
                    } else if (sekMenRen === 'sekolah-rendah') {
                      return singleNamaSekolah.jenisFasiliti.includes(
                        'sekolah-rendah'
                      );
                    } else {
                      return singleNamaSekolah;
                    }
                  })
                  .map((singleNamaSekolah, index) => {
                    return (
                      <tr key={singleNamaSekolah._id}>
                        <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                          {index + 1}
                        </td>
                        <td className='outline outline-1 outline-userWhite outline-offset-1 py-1 px-2 text-left'>
                          {singleNamaSekolah.nama}
                        </td>
                        <td className='outline outline-1 outline-userWhite outline-offset-1 py-1 normal-case'>
                          {kiraEnrolmen(allPersonSekolahs, singleNamaSekolah)}
                        </td>
                        <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                          {kiraKedatanganBaru(
                            allPersonSekolahs,
                            singleNamaSekolah
                          )}
                        </td>
                        <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                          {kiraKesSelesai(allPersonSekolahs, singleNamaSekolah)}
                        </td>
                        <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                          <span>
                            {percentageCalc(
                              kiraKesSelesai(
                                allPersonSekolahs,
                                singleNamaSekolah
                              ),
                              kiraKedatanganBaru(
                                allPersonSekolahs,
                                singleNamaSekolah
                              )
                            )}
                            %
                          </span>
                        </td>
                        <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                          {singleNamaSekolah.sekolahSelesaiReten ? (
                            <span className='text-userBlack px-2 whitespace-nowrap flex items-center justify-center'>
                              SELESAI{' '}
                              <BsFillCheckCircleFill className='text-user7 text-lg my-1 ml-2 bg-userWhite bg-blend-normal rounded-full outline outline-1 outline-user7 inline-flex' />
                            </span>
                          ) : (
                            <span className='text-userBlack px-2 whitespace-nowrap flex items-center justify-center'>
                              BELUM SELESAI
                              <BsFillCircleFill className='text-user9 text-lg my-1 ml-2 inline-flex' />
                            </span>
                          )}
                        </td>
                        <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                          <Link to={`sekolah/${singleNamaSekolah.kodSekolah}`}>
                            <button className='bg-user3 text-userWhite px-2 py-1 mx-2 rounded-lg hover:bg-user1 transition-all'>
                              PILIH
                            </button>
                          </Link>
                        </td>
                        <td className='outline outline-1 outline-userWhite outline-offset-1 py-1 flex flex-row justify-center'>
                          <div
                            className={`${
                              isDownload[singleNamaSekolah._id] ? '' : 'mx-0.5'
                            } ${
                              isDownloading
                                ? 'pointer-events-none opacity-50'
                                : ''
                            } flex justify-center items-center`}
                          >
                            <button
                              disabled={isDownloading}
                              title='Cetak senarai murid sekolah'
                              onClick={() => {
                                handleDownloadSenaraiSekolah(
                                  singleNamaSekolah.kodSekolah,
                                  singleNamaSekolah.nama,
                                  singleNamaSekolah.sesiTakwimSekolah
                                );
                              }}
                              onMouseEnter={() => {
                                setIsDownload({
                                  ...isDownload,
                                  [singleNamaSekolah._id]: true,
                                });
                              }}
                              onMouseLeave={() => {
                                setIsDownload({
                                  ...isDownload,
                                  [singleNamaSekolah._id]: false,
                                });
                              }}
                              className={`${
                                singleNamaSekolah.sekolahSelesaiReten
                                  ? 'bg-user3 shadow-md'
                                  : 'bg-user3 shadow-md'
                              } ${
                                isDownload[singleNamaSekolah._id]
                                  ? ''
                                  : 'w-7 h-7'
                              } text-userWhite px-2 py-1 rounded-full hover:bg-user1 transition-all duration-700 flex items-center`}
                            >
                              <BsDownload className='inline-flex' />
                              <p
                                className={`${
                                  isDownload[singleNamaSekolah._id]
                                    ? 'max-w-min ml-1 transition-all duration-700 '
                                    : 'w-0 overflow-hidden transition-all duration-700 translate-x-0'
                                }`}
                              >
                                CETAK
                              </p>
                            </button>
                          </div>
                          {userinfo.role === 'admin' && (
                            <>
                              {/* <div
                                className={`${
                                  isKemaskini[singleNamaSekolah._id]
                                    ? ''
                                    : 'mx-0.5'
                                } flex justify-center items-center`}
                              >
                                <button
                                  title='Kemaskini senarai murid sekolah terkini'
                                  onClick={() => {
                                    if (
                                      kiraEnrolmen(
                                        allPersonSekolahs,
                                        singleNamaSekolah
                                      ) === 'Dalam semakan MOEIS'
                                    ) {
                                      return;
                                    }
                                    setIdSekolah(singleNamaSekolah._id);
                                    setModalRefreshPelajar(true);
                                  }}
                                  onMouseEnter={() => {
                                    setIsKemaskini({
                                      ...isKemaskini,
                                      [singleNamaSekolah._id]: true,
                                    });
                                  }}
                                  onMouseLeave={() => {
                                    setIsKemaskini({
                                      ...isKemaskini,
                                      [singleNamaSekolah._id]: false,
                                    });
                                  }}
                                  className={`${
                                    singleNamaSekolah.sekolahSelesaiReten
                                      ? 'bg-user1 pointer-events-none px-5'
                                      : 'bg-user3 shadow-md'
                                  } ${
                                    isKemaskini[singleNamaSekolah._id]
                                      ? ''
                                      : 'w-7 h-7'
                                  } text-userWhite px-2 py-1 rounded-full hover:bg-user1 transition-all duration-700 flex items-center`}
                                >
                                  {kiraEnrolmen(
                                    allPersonSekolahs,
                                    singleNamaSekolah
                                  ) === 'Dalam semakan MOEIS' ? (
                                    '-'
                                  ) : (
                                    <BsHurricane className='inline-flex' />
                                  )}
                                  {kiraEnrolmen(
                                    allPersonSekolahs,
                                    singleNamaSekolah
                                  ) === 'Dalam semakan MOEIS' ? (
                                    '-'
                                  ) : (
                                    <p
                                      className={`${
                                        isKemaskini[singleNamaSekolah._id]
                                          ? 'max-w-min ml-1 transition-all duration-700 '
                                          : 'w-0 overflow-hidden transition-all duration-700 translate-x-0'
                                      }`}
                                    >
                                      {singleNamaSekolah.sekolahSelesaiReten
                                        ? 'TELAH DITUTUP'
                                        : 'KEMASKINI'}
                                    </p>
                                  )}
                                </button>
                              </div> */}
                              <div
                                className={`${
                                  isTutup[singleNamaSekolah._id] ? '' : 'mx-0.5'
                                } flex justify-center items-center`}
                              >
                                <button
                                  title='Tutup reten apabila perkhidmatan di sekolah telah selesai dijalankan'
                                  onClick={() => {
                                    setIdSekolah(singleNamaSekolah._id);
                                    setModalSelesaiSekolah(true);
                                  }}
                                  onMouseEnter={() => {
                                    setIsTutup({
                                      ...isTutup,
                                      [singleNamaSekolah._id]: true,
                                    });
                                  }}
                                  onMouseLeave={() => {
                                    setIsTutup({
                                      ...isTutup,
                                      [singleNamaSekolah._id]: false,
                                    });
                                  }}
                                  className={`${
                                    singleNamaSekolah.sekolahSelesaiReten
                                      ? 'bg-user7 pointer-events-none'
                                      : 'bg-user3 shadow-md'
                                  } ${
                                    isTutup[singleNamaSekolah._id]
                                      ? ''
                                      : 'w-7 h-7'
                                  } text-userWhite px-2 py-1 rounded-full hover:bg-user1 transition-all duration-700  flex items-center`}
                                >
                                  <BsEnvelopeX className='inline-flex ' />
                                  <p
                                    className={`${
                                      isTutup[singleNamaSekolah._id]
                                        ? 'max-w-min ml-1 transition-all duration-700 '
                                        : 'w-0 overflow-hidden transition-all duration-700 translate-x-0'
                                    }`}
                                  >
                                    {singleNamaSekolah.sekolahSelesaiReten
                                      ? 'TELAH DITUTUP'
                                      : 'TUTUP'}
                                  </p>
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            )}
          </table>
        </div>
        {modalSelesaiSekolah && (
          <UserModalSelesaiSekolah
            setModalSelesaiSekolah={setModalSelesaiSekolah}
            handleSelesaiSekolah={handleSelesaiSekolah}
            id={idSekolah}
          />
        )}
        {/* {modalRefreshPelajar && (
          <UserModalRefreshPelajar
            setModalRefreshPelajar={setModalRefreshPelajar}
            handleRefreshPelajar={handleRefreshPelajar}
            id={idSekolah}
          />
        )} */}
      </div>
    </>
  );
}

export default UserSekolahList;
