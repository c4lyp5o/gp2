import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { FaInfoCircle, FaPlus, FaMinus } from 'react-icons/fa';

import { useGlobalUserAppContext } from '../../../context/userAppContext';

import ConfirmationDeleteKotak from './ConfirmationDeleteKOTAK';
import UserDeleteModal from '../../UserDeleteModal';

function KohortKotak() {
  const { userinfo, userToken, reliefUserToken, navigate, toast } =
    useGlobalUserAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isShown, setIsShown] = useState(false);
  const [isPhilterShown, setIsPhilterShown] = useState(false);
  const [allPersonKohortKotak, setAllPersonKohortKotak] = useState([]);
  const [pilihanSekolah, setPilihanSekolah] = useState('');
  const [pilihanKohort, setPilihanKohort] = useState('');
  const [philter, setPhilter] = useState('');

  const [namaSekolahs, setNamaSekolahs] = useState([]);
  const [kohort, setKohort] = useState([]);

  //delete kotak
  const [pilihanHapusId, setPilihanHapusId] = useState('');
  const [pilihanHapusNama, setPilihanHapusNama] = useState('');
  const [modalConfirmDeleteKotak, setModalConfirmDeleteKotak] = useState(false);
  const [melaksanakanSaringanMerokok, setMelaksanakanSaringanMerokok] =
    useState('');
  const [statusM, setStatusM] = useState('');
  const [menerimaNasihatRingkas, setMenerimaNasihatRingkas] = useState('');
  const [modalHapus, setModalHapus] = useState(false);

  const [reloadState, setReloadState] = useState(false);

  //accordian
  const [accordian, setAccordian] = useState([]);

  // init fetch allPersonKohortKotak
  useEffect(() => {
    const fetchAllPersonKohort = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get('/api/v1/kohort/kotak', {
          headers: {
            Authorization: `Bearer ${
              reliefUserToken ? reliefUserToken : userToken
            }`,
          },
        });
        //without duplicate namaSekolah and kohort
        const namaSekolahs = [
          ...new Set(
            data.kohortKotakResultQuery.map((item) => item.namaSekolah)
          ),
        ];
        const kohort = [
          ...new Set(
            data.kohortKotakResultQuery
              .map((item) => item.dalamPemantauanKohort)
              //witout empty string
              .filter((item) => item !== '')
          ),
        ];
        // 👇️ sort by String property ASCENDING (A - Z)
        const desc = data.kohortKotakResultQuery.sort((a, b) =>
          a.statusKotak > b.statusKotak ? 1 : -1
        );
        setNamaSekolahs(namaSekolahs);
        // setKohort(kohort);
        setAllPersonKohortKotak(desc);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPersonKohort();
  }, [reloadState]);

  // *Function to handle change in selected namaSekolah
  const handleChangeNamaSekolah = (event) => {
    const selectedNamaSekolah = event.target.value;
    setPilihanSekolah(selectedNamaSekolah);

    // *Filter the allPersonKohortKotak data based on the selectedNamaSekolah and remove duplicates from kohort options
    const filteredData = allPersonKohortKotak.filter(
      (item) => item.namaSekolah === selectedNamaSekolah
    );
    const kohortSet = new Set(
      filteredData
        .map((item) => item.dalamPemantauanKohort)
        .filter((item) => item !== '')
        .sort((a, b) => {
          const yearA = parseInt(a.split(' ')[1], 10);
          const yearB = parseInt(b.split(' ')[1], 10);
          return yearA - yearB; // Sort in ascending order, use `yearB - yearA` for descending order
        })
    );
    const kohortOptions = Array.from(kohortSet);
    setKohort(kohortOptions);
    setPilihanKohort(''); // Reset the selected kohort when changing namaSekolahs
  };

  const handleDelete = async (singlePelajarKOTAK, reason) => {
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
          `/api/v1/kohort/kotak/delete/${singlePelajarKOTAK}`,
          {
            deleteReason: reason,
            createdByMdcMdtb: mdcMdtbNum,
            melaksanakanSaringanMerokok,
            statusM,
            menerimaNasihatRingkas,
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
          error: {
            render({ data }) {
              if (data.response.status === 409) {
                return data.response.data.msg;
              } else {
                return 'Pesakit gagal dihapus';
              }
            },
          },
        },
        { autoClose: 5000 }
      );
      setModalHapus(false);
      setReloadState(!reloadState);
    }
  };

  // on tab focus reload data
  useEffect(() => {
    window.addEventListener('focus', setReloadState);
    setReloadState(!reloadState);
    return () => {
      window.removeEventListener('focus', setReloadState);
    };
  }, []);

  const handleAccordian = (e) => {
    if (accordian.includes(e)) {
      setAccordian(accordian.filter((a) => a !== e));
    } else {
      setAccordian([...accordian, e]);
    }
  };

  const keys = ['nama', 'tahunTingkatan'];

  return (
    <>
      <div className='px-3 lg:px-7 h-full p-3 overflow-y-auto'>
        <div className='relative mb-2'>
          <div className=''>
            <div className='flex flex-col pb-2'>
              <div className='flex justify-between items-center'>
                <h1 className='text-xl lg:text-3xl text-user9 font-bold flex flex-row pl-5 pt-1'>
                  SULIT
                </h1>
                <div className='flex justify-end items-center text-right mt-2'>
                  <button
                    onClick={() => {
                      navigate(-1);
                    }}
                    className='capitalize bg-user3 text-xs text-userWhite rounded-md shadow-xl p-1 mr-2 hover:bg-user1 transition-all'
                  >
                    kembali ke senarai data kohort
                  </button>
                </div>
              </div>
              <h2 className='text-sm text-left lg:text-xl font-semibold flex flex-row pl-5 pt-2'>
                SENARAI NAMA MURID MENJALANI PROGRAM INTERVENSI MEROKOK MELALUI
                PROGRAM KOTAK DI SEKOLAH RENDAH / MENENGAH
              </h2>
            </div>
            <div className='grid grid-cols-2'>
              <p className='grid grid-cols-[1fr_3fr] pb-1'>
                <span className='font-bold uppercase text-xs lg:text-sm flex justify-end place-items-center mr-2'>
                  Sekolah:
                </span>{' '}
                <span className=' uppercase text-xs lg:text-sm w-full'>
                  <select
                    value={pilihanSekolah}
                    // onChange={(e) => {
                    //   setPilihanSekolah(e.target.value);
                    // }}
                    onChange={handleChangeNamaSekolah}
                    className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  >
                    <option value=''>SILA PILIH</option>
                    {namaSekolahs.map((singleNamaSekolah, index) => {
                      return (
                        <option
                          value={singleNamaSekolah}
                          key={index}
                          className='capitalize'
                        >
                          {singleNamaSekolah}
                        </option>
                      );
                    })}
                  </select>
                </span>
              </p>
              <p className='grid grid-cols-[1fr_3fr] pb-1'>
                <span className='font-bold uppercase text-xs lg:text-sm flex justify-end place-items-center mr-2'>
                  Kohort:
                </span>{' '}
                <span className=' uppercase text-xs lg:text-sm w-full'>
                  <select
                    value={pilihanKohort}
                    onChange={(e) => {
                      setPilihanKohort(e.target.value);
                    }}
                    className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  >
                    <option value=''>SILA PILIH</option>
                    {pilihanSekolah
                      ? kohort.map((kohort, index) => {
                          return (
                            <option
                              value={kohort}
                              key={index}
                              className='capitalize'
                            >
                              {kohort}
                            </option>
                          );
                        })
                      : ''}
                  </select>
                </span>
              </p>
              <p className='grid grid-cols-[1fr_7fr] pb-1 col-span-2'>
                <span className='font-bold uppercase text-xs lg:text-sm flex justify-end place-items-center mr-2'>
                  Carian{' '}
                  <div className='relative flex items-center ml-1'>
                    <FaInfoCircle
                      className='text-lg text-kaunter1'
                      onClick={() => setIsPhilterShown(!isPhilterShown)}
                    />
                    {isPhilterShown && (
                      <div className='absolute top-6 left-2 w-36 text-left z-10 bg-kaunter4 text-kaunterWhite font-normal text-sm px-2 py-1 rounded-md whitespace-pre-wrap'>
                        <p className='text-center'>
                          Carian Nama / Tahun / Tingkatan
                        </p>
                      </div>
                    )}
                  </div>
                </span>{' '}
                <span className=' uppercase text-xs lg:text-sm w-full'>
                  <input
                    type='search'
                    name='pilihanNama'
                    className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                    id='pilihanNama'
                    placeholder='CARIAN NAMA / TAHUN / TINGKATAN'
                    onChange={(e) => setPhilter(e.target.value.toLowerCase())}
                  />
                </span>
              </p>
              {/* {pilihanKohort && (
                <p className='grid grid-cols-[1fr_3fr] pb-1'>
                  <span className='font-bold uppercase text-xs lg:text-sm flex justify-end place-items-center mr-2'>
                    Nama Pelajar:
                  </span>
                  <span className=' uppercase text-xs lg:text-sm w-full'>
                    <input
                      type='text'
                      value={filterNama}
                      onChange={(e) => {
                        setFilterNama(e.target.value.toUpperCase());
                      }}
                      className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                    />
                  </span>
                </p>
              )} */}
            </div>
          </div>
        </div>
        <div className='m-auto text-xs lg:text-sm rounded-md h-min max-w-max overflow-x-auto'>
          <table className='table-auto'>
            <thead className='text-userWhite bg-user2'>
              <tr>
                <th className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  BIL.
                </th>
                <th className='outline outline-1 outline-userWhite outline-offset-1 py-1 px-10 lg:px-20'>
                  NAMA
                </th>
                <th className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1 whitespace-nowrap'>
                  TAHUN / TINGKATAN
                </th>
                <th className='outline outline-1 outline-userWhite outline-offset-1 px-5 py-1'>
                  NO. TELEFON
                </th>
                <th className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1 w-40'>
                  KOHORT
                </th>
                <th className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  INTERVENSI KOTAK
                </th>
                <th className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  TARIKH KEHADIRAN INTERVENSI SESI 1
                </th>
                <th className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1 uppercase w-72'>
                  status selepas 6 bulan daripada tarikh kehadiran intervensi
                  sesi 1
                </th>
                {userinfo.role === 'admin' && (
                  <th className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                    HAPUS
                  </th>
                )}
              </tr>
            </thead>
            {!isLoading && pilihanSekolah ? (
              <tbody className='bg-user4'>
                {allPersonKohortKotak
                  .filter((singlePersonKohortKotak) => {
                    if (singlePersonKohortKotak.deleted !== true) {
                      return singlePersonKohortKotak;
                    }
                  })
                  .filter((singlePersonKohortKotak) => {
                    if (
                      singlePersonKohortKotak.namaSekolah === pilihanSekolah
                    ) {
                      return singlePersonKohortKotak;
                    }
                  })
                  .filter((singlePersonKohortKotak) => {
                    if (pilihanKohort === '') {
                      return singlePersonKohortKotak;
                    } else if (
                      singlePersonKohortKotak.dalamPemantauanKohort ===
                      pilihanKohort
                    ) {
                      return singlePersonKohortKotak;
                    }
                  })
                  .filter((pt) =>
                    keys.some((key) => pt[key].toLowerCase().includes(philter))
                  )
                  .map((singlePersonKohortKotak, index) => {
                    return (
                      <tr key={singlePersonKohortKotak._id}>
                        <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                          {index + 1}
                        </td>
                        <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1 text-left'>
                          {singlePersonKohortKotak.nama}
                        </td>
                        <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                          {singlePersonKohortKotak.tahunTingkatan}
                        </td>
                        <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                          {singlePersonKohortKotak.noTelefon}
                        </td>
                        <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                          {singlePersonKohortKotak.dalamPemantauanKohort}
                        </td>
                        <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-2 whitespace-nowrap'>
                          <Link
                            target='_blank'
                            rel='noreferrer'
                            to={`${singlePersonKohortKotak._id}`}
                            className={`${
                              singlePersonKohortKotak.statusKotak ===
                              'selesai sesi 1'
                                ? 'bg-user10 text-userWhite hover:bg-user11'
                                : singlePersonKohortKotak.statusKotak ===
                                  'selesai sesi 2'
                                ? 'bg-user12 text-userWhite hover:bg-user13'
                                : singlePersonKohortKotak.statusKotak ===
                                  'selesai sesi 3'
                                ? 'bg-user8 text-userWhite hover:bg-user14'
                                : 'bg-user6 text-userWhite hover:bg-user15'
                            } shadow-sm rounded-md p-1 m-1 transition-all my-2`}
                          >
                            {singlePersonKohortKotak.statusKotak ===
                            'belum mula'
                              ? 'tambah KOTAK'
                              : singlePersonKohortKotak.statusKotak}
                          </Link>
                          {/* keluar berapa lawatan kotak & lawatan apa */}
                          {singlePersonKohortKotak.createdByNameMdcMdtb.filter(
                            (singleLawatan) => {
                              if (
                                singleLawatan.thisUsernameData.tarikh1 ||
                                singleLawatan.thisUsernameData.tarikh2 ||
                                singleLawatan.thisUsernameData.tarikh3 ||
                                singleLawatan.thisUsernameData
                                  .rujukGuruKaunseling ===
                                  'ya-rujuk-guru-kaunseling' ||
                                singleLawatan.thisUsernameData.tarikhQ ||
                                singleLawatan.thisUsernameData
                                  .statusSelepas6Bulan
                              ) {
                                return singleLawatan;
                              }
                            }
                          ).length >= 1 && (
                            <div className='inline-flex'>
                              <span
                                className='hover:cursor-pointer text-xs font-medium bg-user8 rounded-full px-2 py-1 capitalize transition-all whitespace-nowrap'
                                onClick={() => {
                                  setIsShown({
                                    ...isShown,
                                    [singlePersonKohortKotak._id]: true,
                                  });
                                }}
                              >
                                {
                                  singlePersonKohortKotak.createdByNameMdcMdtb.filter(
                                    (singleLawatan) => {
                                      if (
                                        singleLawatan.thisUsernameData
                                          .tarikh1 ||
                                        singleLawatan.thisUsernameData
                                          .tarikh2 ||
                                        singleLawatan.thisUsernameData
                                          .tarikh3 ||
                                        singleLawatan.thisUsernameData
                                          .rujukGuruKaunseling ===
                                          'ya-rujuk-guru-kaunseling' ||
                                        singleLawatan.thisUsernameData
                                          .tarikhQ ||
                                        singleLawatan.thisUsernameData
                                          .statusSelepas6Bulan
                                      ) {
                                        return singleLawatan;
                                      }
                                    }
                                  ).length
                                }
                              </span>
                              <div
                                className={`${
                                  isShown[singlePersonKohortKotak._id]
                                    ? 'block p-2 px-5 overflow-y-auto'
                                    : 'hidden '
                                } absolute z-30 inset-x-1 lg:inset-x-1/3 inset-y-10 lg:inset-y-28 bg-userWhite text-user1 rounded-md shadow-md m-2`}
                              >
                                <div className='flex justify-between'>
                                  <h1 className='text-lg font-medium'>
                                    LAWATAN
                                  </h1>
                                </div>
                                {singlePersonKohortKotak.createdByNameMdcMdtb
                                  .filter((singleLawatan) => {
                                    if (
                                      singleLawatan.thisUsernameData.tarikh1 ||
                                      singleLawatan.thisUsernameData.tarikh2 ||
                                      singleLawatan.thisUsernameData.tarikh3 ||
                                      singleLawatan.thisUsernameData
                                        .rujukGuruKaunseling ===
                                        'ya-rujuk-guru-kaunseling' ||
                                      singleLawatan.thisUsernameData.tarikhQ ||
                                      singleLawatan.thisUsernameData
                                        .statusSelepas6Bulan
                                    ) {
                                      return singleLawatan;
                                    }
                                  })
                                  .map((singleLawatan, index) => {
                                    return (
                                      <div className='flex flex-col'>
                                        <h1
                                          onClick={() => handleAccordian(index)}
                                          className='text-sm text-start font-semibold bg-user1 bg-opacity-5 flex flex-row items-center rounded-md p-1 m-1 cursor-pointer'
                                        >
                                          {accordian.includes(index) ? (
                                            <FaMinus className='m-1' />
                                          ) : (
                                            <FaPlus className='m-1' />
                                          )}
                                          Kedatangan {index + 1}
                                        </h1>
                                        {accordian.includes(index) && (
                                          <div className='flex flex-col mx-1 px-1'>
                                            <span className='text-xs font-semibold text-start flex flex-row items-center'>
                                              {/* <FaUser className='m-1' /> */}
                                              {singleLawatan.createdByUsername}
                                            </span>
                                            {singleLawatan.thisUsernameData
                                              .tarikh1 && (
                                              <span className='text-xs  text-start flex flex-row items-center'>
                                                {/* <FaCalendarAlt className='m-1' /> */}
                                                TARIKH SESI 1 ={' '}
                                                {moment(
                                                  singleLawatan.thisUsernameData
                                                    .tarikh1
                                                ).format('DD/MM/YYYY')}
                                              </span>
                                            )}
                                            {singleLawatan.thisUsernameData
                                              .tarikh2 && (
                                              <p className='text-xs  text-start flex flex-row items-center'>
                                                {/* <FaSmokingBan className='m-1' /> */}
                                                TARIKH SESI 2 ={' '}
                                                {moment(
                                                  singleLawatan.thisUsernameData
                                                    .tarikh2
                                                ).format('DD/MM/YYYY')}
                                              </p>
                                            )}
                                            {singleLawatan.thisUsernameData
                                              .tarikh3 && (
                                              <p className='text-xs  text-start flex flex-row items-center'>
                                                {/* <FaSmokingBan className='m-1' /> */}
                                                TARIKH SESI 3 ={' '}
                                                {moment(
                                                  singleLawatan.thisUsernameData
                                                    .tarikh3
                                                ).format('DD/MM/YYYY')}
                                              </p>
                                            )}
                                            {singleLawatan.thisUsernameData
                                              .rujukGuruKaunseling ===
                                              'ya-rujuk-guru-kaunseling' && (
                                              <p className='text-xs  text-start flex flex-row items-center'>
                                                {/* <FaSmokingBan className='m-1' /> */}
                                                RUJUK GURU KAUNSELING
                                              </p>
                                            )}
                                            {singleLawatan.thisUsernameData
                                              .tarikhQ && (
                                              <p className='text-xs  text-start flex flex-row items-center'>
                                                {/* <FaSmokingBan className='m-1' /> */}
                                                TARIKH BERHENTI MEROKOK ={' '}
                                                {moment(
                                                  singleLawatan.thisUsernameData
                                                    .tarikhQ
                                                ).format('DD/MM/YYYY')}
                                              </p>
                                            )}
                                            {singleLawatan.thisUsernameData
                                              .statusSelepas6Bulan && (
                                              <p className='text-xs  text-start flex flex-row items-center'>
                                                {/* <FaSmokingBan className='m-1' /> */}
                                                STATUS SELEPAS 6 BULAN ={' '}
                                                {singleLawatan.thisUsernameData
                                                  .statusSelepas6Bulan ===
                                                'berhenti'
                                                  ? 'BERHENTI MEROKOK'
                                                  : 'TIDAK BERHENTI MEROKOK'}
                                              </p>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                          {!singlePersonKohortKotak.tarikhIntervensi1 ? (
                            <span className='text-red-500'>
                              BELUM DITETAPKAN
                            </span>
                          ) : (
                            <span>
                              {moment(
                                singlePersonKohortKotak.tarikhIntervensi1
                              ).format('DD/MM/YYYY')}
                            </span>
                          )}
                        </td>
                        <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                          {singlePersonKohortKotak.statusSelepas6Bulan
                            ? singlePersonKohortKotak.statusSelepas6Bulan ===
                              'berhenti'
                              ? 'BERHENTI MEROKOK'
                              : 'TIDAK BERHENTI MEROKOK'
                            : null}
                        </td>
                        {userinfo.role === 'admin' && (
                          <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                            {singlePersonKohortKotak.statusKotak ===
                              'belum mula' && (
                              <button
                                className='bg-user9 w-16 text-userWhite shadow-md hover:bg-user8 rounded-md p-1 m-1 transition-all'
                                onClick={() => {
                                  setModalConfirmDeleteKotak(true);
                                  setPilihanHapusId(
                                    singlePersonKohortKotak._id
                                  );
                                  setPilihanHapusNama(
                                    singlePersonKohortKotak.nama
                                  );
                                  setMelaksanakanSaringanMerokok('');
                                  setStatusM('');
                                  setMenerimaNasihatRingkas('');
                                }}
                              >
                                HAPUS
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            ) : (
              <tbody className='text-user1 bg-user4'>
                <tr>
                  <td
                    colSpan={9}
                    className='outline outline-1 outline-offset-1 px-2 py-1'
                  >
                    Sila pilih sekolah
                  </td>
                </tr>
              </tbody>
            )}
            {isLoading && !pilihanSekolah && (
              <tbody className='text-user1 bg-user4'>
                <tr>
                  <td
                    colSpan={9}
                    className='outline outline-1 outline-offset-1 px-2 py-1'
                  >
                    Loading
                  </td>
                </tr>
              </tbody>
            )}
          </table>
          {modalConfirmDeleteKotak && (
            <ConfirmationDeleteKotak
              nama={pilihanHapusNama}
              modalConfirmDeleteKotak={modalConfirmDeleteKotak}
              setModalConfirmDeleteKotak={setModalConfirmDeleteKotak}
              melaksanakanSaringanMerokok={melaksanakanSaringanMerokok}
              setMelaksanakanSaringanMerokok={setMelaksanakanSaringanMerokok}
              statusM={statusM}
              setStatusM={setStatusM}
              menerimaNasihatRingkas={menerimaNasihatRingkas}
              setMenerimaNasihatRingkas={setMenerimaNasihatRingkas}
              modalHapus={modalHapus}
              setModalHapus={setModalHapus}
            />
          )}
          {modalHapus && (
            <UserDeleteModal
              handleDelete={handleDelete}
              setModalHapus={setModalHapus}
              id={pilihanHapusId}
              nama={pilihanHapusNama}
            />
          )}
          <div
            className={`absolute z-10 inset-0 bg-user1 bg-opacity-30 ${
              isShown ? 'block' : 'hidden'
            }`}
            onClick={() => setIsShown(false)}
          />
          <div
            className={`fixed inset-0 h-full w-full ${
              isPhilterShown ? 'block' : 'hidden'
            }`}
            onClick={() => setIsPhilterShown(!isPhilterShown)}
          />
        </div>
      </div>
    </>
  );
}

export default KohortKotak;