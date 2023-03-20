import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaCaretUp,
  FaCaretDown,
} from 'react-icons/fa';
import { Spinner } from 'react-awesome-spinners';

import { useGlobalUserAppContext } from '../../context/userAppContext';

function UserSekolah() {
  const {
    userToken,
    reliefUserToken,
    navigate,
    refreshTimer,
    setRefreshTimer,
    toast,
  } = useGlobalUserAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isShown, setIsShown] = useState(false);
  const [allPersonSekolahs, setAllPersonSekolahs] = useState([]);
  const [dahFilterSekolahs, setDahFilterSekolahs] = useState([]);
  const [dahFilterTahun, setDahFilterTahun] = useState([]);
  const [sekMenRen, setSekMenRen] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const [namaSekolahs, setNamaSekolahs] = useState([]);
  const [tahun, setTahun] = useState([]);
  const [namaKelas, setNamaKelas] = useState([]);
  const [pilihanSekolah, setPilihanSekolah] = useState('');
  const [pilihanTahun, setPilihanTahun] = useState('');
  const [pilihanNamaKelas, setPilihanNamaKelas] = useState('');
  const [filterNama, setFilterNama] = useState('');

  const [fasilitiSekolah, setFasilitiSekolah] = useState([]);
  const [filteredFasilitiSekolah, setFilteredFasilitiSekolah] = useState([]);

  const [reloadState, setReloadState] = useState(false);

  // init fetch allPersonSekolahs
  useEffect(() => {
    const fetchAllPersonSekolahs = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get('/api/v1/sekolah/populate', {
          headers: {
            Authorization: `Bearer ${
              reliefUserToken ? reliefUserToken : userToken
            }`,
          },
        });
        const allPersonSekolahs = data.allPersonSekolahs;
        const namaSekolahs = allPersonSekolahs.reduce(
          (arrNamaSekolahs, singlePersonSekolah) => {
            if (!arrNamaSekolahs.includes(singlePersonSekolah.namaSekolah)) {
              arrNamaSekolahs.push(singlePersonSekolah.namaSekolah);
            }
            return arrNamaSekolahs.filter((valid) => valid);
          },
          ['']
        );
        setAllPersonSekolahs(data.allPersonSekolahs);
        setNamaSekolahs(namaSekolahs);
        setRefreshTimer(!refreshTimer);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        // toast.error(
        //   'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: user-sekolah-fetchAllPersonSekolahs'
        // );
      }
    };
    fetchAllPersonSekolahs();
  }, [reloadState]);

  useEffect(() => {
    const filteredSekolahs = allPersonSekolahs.filter((person) =>
      person.namaSekolah.includes(pilihanSekolah)
    );
    const tahun = filteredSekolahs.reduce(
      (arrTahun, singlePersonSekolah) => {
        if (!arrTahun.includes(singlePersonSekolah.tahun)) {
          arrTahun.push(singlePersonSekolah.tahun);
        }
        return arrTahun.filter((valid) => valid);
      },
      ['']
    );
    setTahun(tahun);
    setDahFilterSekolahs(filteredSekolahs);
  }, [pilihanSekolah]);

  useEffect(() => {
    const filteredTahun = dahFilterSekolahs.filter((person) =>
      person.tahun.includes(pilihanTahun)
    );
    const namaKelas = filteredTahun.reduce(
      (arrNamaKelas, singlePersonSekolah) => {
        if (!arrNamaKelas.includes(singlePersonSekolah.namaKelas)) {
          arrNamaKelas.push(singlePersonSekolah.namaKelas);
        }
        return arrNamaKelas.filter((valid) => valid);
      },
      ['']
    );
    setNamaKelas(namaKelas);
    setDahFilterTahun(filteredTahun);
  }, [pilihanTahun]);

  // reset value
  useEffect(() => {
    setPilihanTahun('');
    setPilihanNamaKelas('');
    setFilterNama('');
  }, [pilihanSekolah]);

  useEffect(() => {
    setPilihanNamaKelas('');
    setFilterNama('');
  }, [pilihanTahun]);

  useEffect(() => {
    setFilterNama('');
  }, [pilihanNamaKelas]);

  // fetch fasiliti sekolah to determine selesai reten
  useEffect(() => {
    const fetchFasilitiSekolahs = async () => {
      try {
        const { data } = await axios.get('/api/v1/sekolah', {
          headers: {
            Authorization: `Bearer ${
              reliefUserToken ? reliefUserToken : userToken
            }`,
          },
        });
        setFasilitiSekolah(data.fasilitiSekolahs);
        setFilteredFasilitiSekolah(data.fasilitiSekolahs);
      } catch (error) {
        console.log(error);
        // toast.error(
        //   'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: user-sekolah-fetchFasilitiSekolahs'
        // );
      }
    };
    fetchFasilitiSekolahs();
  }, []);

  useEffect(() => {
    setFilteredFasilitiSekolah(
      fasilitiSekolah.filter((f) => f.nama.includes(pilihanSekolah))
    );
  }, [pilihanSekolah]);

  // useEffect(() => {
  //   setSekMenRen(
  //     fasilitiSekolah.filter((f) => f.kodSekolah.includes(namaSekolahs[0]))
  //   );
  // }, [fasilitiSekolah]);

  // on tab focus reload data
  useEffect(() => {
    window.addEventListener('focus', setReloadState);
    setReloadState(!reloadState);
    return () => {
      window.removeEventListener('focus', setReloadState);
    };
  }, []);

  // specific refreshTimer for this UserSekolah special case
  useEffect(() => {
    setRefreshTimer(!refreshTimer);
  }, [pilihanSekolah, pilihanTahun, pilihanNamaKelas, filterNama]);

  return (
    <>
      <div className='px-3 lg:px-7 h-full p-3 overflow-y-auto'>
        <div className='relative shadow-md drop-shadow-sm mb-2'>
          <div className=''>
            <div className='flex justify-between'>
              <h2 className='text-sm lg:text-xl font-semibold flex flex-row pl-2 lg:pl-12 pt-2'>
                CARIAN MURID SEKOLAH
              </h2>
              <div className='flex justify-end items-center text-right mt-2'>
                <button
                  onClick={() => {
                    navigate(-1);
                  }}
                  className='capitalize bg-user3 text-xs text-userWhite rounded-md shadow-xl p-1 mb-2 mr-2 hover:bg-user1 transition-all'
                >
                  kembali ke senarai sekolah
                </button>
              </div>
            </div>
            <div className='grid grid-cols-2'>
              <p className='grid grid-cols-[1fr_3fr] pb-1'>
                <span className='font-bold uppercase text-xs lg:text-sm flex justify-end place-items-center mr-2'>
                  Sekolah:
                </span>{' '}
                <span className=' uppercase text-xs lg:text-sm w-full'>
                  {/* {pilihanSekolah ? pilihanSekolah : 'Sila pilih sekolah'} */}
                  <select
                    value={pilihanSekolah}
                    onChange={(e) => {
                      setPilihanSekolah(e.target.value);
                    }}
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
                  Tahun:
                </span>{' '}
                <span className=' uppercase text-xs lg:text-sm w-full'>
                  {/* {pilihanTahun ? pilihanTahun : 'Sila pilih tahun'} */}
                  <select
                    value={pilihanTahun}
                    onChange={(e) => {
                      setPilihanTahun(e.target.value);
                    }}
                    className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  >
                    <option value=''>SILA PILIH</option>
                    {pilihanSekolah ? (
                      tahun.map((singleTahun, index) => {
                        return (
                          <option
                            value={singleTahun}
                            key={index}
                            className='capitalize'
                          >
                            {singleTahun}
                          </option>
                        );
                      })
                    ) : (
                      <option value=''>SILA PILIH SEKOLAH</option>
                    )}
                  </select>
                </span>
              </p>
              <p className='grid grid-cols-[1fr_3fr] pb-1'>
                <span className='font-bold uppercase text-xs lg:text-sm flex justify-end place-items-center mr-2'>
                  Kelas:
                </span>{' '}
                <span className=' uppercase text-xs lg:text-sm w-full'>
                  {/* {pilihanNamaKelas ? pilihanNamaKelas : 'Sila pilih kelas'} */}
                  <select
                    value={pilihanNamaKelas}
                    onChange={(e) => {
                      setPilihanNamaKelas(e.target.value);
                    }}
                    className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  >
                    <option value=''>SILA PILIH</option>
                    {pilihanTahun ? (
                      namaKelas.map((singleNamaKelas, index) => {
                        return (
                          <option
                            value={singleNamaKelas}
                            key={index}
                            className='capitalize'
                          >
                            {singleNamaKelas}
                          </option>
                        );
                      })
                    ) : (
                      <option value=''>SILA PILIH TAHUN</option>
                    )}
                  </select>
                </span>
              </p>
              <p className='grid grid-cols-[1fr_3fr] pb-1'>
                <span className='font-bold uppercase text-xs lg:text-sm flex justify-end place-items-center mr-2'>
                  Status sekolah:
                </span>{' '}
                {pilihanSekolah ? (
                  <span className='uppercase text-xs lg:text-sm w-full'>
                    {pilihanSekolah &&
                    filteredFasilitiSekolah[0].sekolahSelesaiReten === true ? (
                      <input
                        type='text'
                        className='appearance-none w-full px-2 py-1 text-userBlack bg-user7 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                        value='Sekolah sudah selesai reten'
                        readOnly
                      />
                    ) : (
                      <input
                        type='text'
                        className='appearance-none w-full px-2 py-1 text-userBlack bg-user9 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                        value='Sekolah belum selesai reten'
                        readOnly
                      />
                    )}
                  </span>
                ) : (
                  <input
                    type='text'
                    className='appearance-none text-xs lg:text-sm w-full px-2 py-1 text-userBlack border border-user1 rounded-lg shadow-sm focus:outline-none focus:border-transparent'
                    value='Sila Pilih Sekolah'
                    readOnly
                  />
                )}
              </p>
              <p className='grid grid-cols-[1fr_3fr] pb-1'>
                <span className='font-bold uppercase text-xs lg:text-sm flex justify-end place-items-center mr-2'>
                  Tarikh Mula:
                </span>
              </p>
              <p className='grid grid-cols-[1fr_3fr] pb-1'>
                <span className='font-bold uppercase text-xs lg:text-sm flex justify-end place-items-center mr-2'>
                  Tarikh Tamat:
                </span>
              </p>
              {pilihanTahun && (
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
              )}
            </div>
          </div>
        </div>
        <div className='m-auto text-xs lg:text-sm rounded-md h-min max-w-max overflow-x-auto'>
          {pilihanSekolah ? (
            <table className='table-auto'>
              <thead className='text-userWhite bg-user2'>
                <tr>
                  <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                    BIL
                  </th>
                  <th className='outline outline-1 outline-offset-1 py-1 px-10 lg:px-20'>
                    NAMA
                  </th>
                  <th className='outline outline-1 outline-offset-1 px-2 py-1 whitespace-nowrap'>
                    OPERATOR PEMERIKSAAN
                  </th>
                  <th className='outline outline-1 outline-offset-1 px-5 py-1'>
                    STATUS RAWATAN
                  </th>
                  <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                    PEMERIKSAAN
                  </th>
                  <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                    RAWATAN
                  </th>
                  {/* <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                    KOTAK
                  </th> */}
                </tr>
              </thead>
              {!isLoading &&
                pilihanSekolah &&
                allPersonSekolahs
                  .filter(
                    (person) =>
                      person.namaSekolah.includes(pilihanSekolah) &&
                      person.tahun.includes(pilihanTahun) &&
                      person.namaKelas.includes(pilihanNamaKelas) &&
                      person.nama.includes(filterNama)
                  )
                  .map((singlePersonSekolah, index) => {
                    return (
                      <>
                        <tbody className='bg-user4'>
                          <tr key={singlePersonSekolah._id}>
                            <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                              {index + 1}
                            </td>
                            <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                              {singlePersonSekolah.nama}
                            </td>
                            <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                              {singlePersonSekolah.pemeriksaanSekolah
                                ? singlePersonSekolah.pemeriksaanSekolah
                                    .createdByUsername
                                : null}
                            </td>
                            <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                              {singlePersonSekolah.statusRawatan}
                            </td>
                            <td className='outline outline-1 outline-userWhite outline-offset-1 p-2 whitespace-nowrap'>
                              <Link
                                target='_blank'
                                rel='noreferrer'
                                to={`form-sekolah/pemeriksaan/${
                                  singlePersonSekolah._id
                                }/${
                                  singlePersonSekolah.pemeriksaanSekolah
                                    ? singlePersonSekolah.pemeriksaanSekolah._id
                                    : 'tambah-pemeriksaan'
                                }`}
                                className={`${
                                  singlePersonSekolah.pemeriksaanSekolah
                                    ? 'bg-user7 shadow-md'
                                    : filteredFasilitiSekolah[0]
                                        .sekolahSelesaiReten === true
                                    ? 'pointer-events-none bg-user4 shadow-none'
                                    : 'bg-user6 shadow-md'
                                } hover:bg-user8 text-userWhite rounded-sm p-1 m-1 transition-all`}
                              >
                                {singlePersonSekolah.pemeriksaanSekolah
                                  ? 'lihat pemeriksaan'
                                  : filteredFasilitiSekolah[0]
                                      .sekolahSelesaiReten === true
                                  ? 'Pemeriksaan Ditutup'
                                  : 'Tambah Pemeriksaan'}
                              </Link>
                            </td>
                            <td className='outline outline-1 outline-userWhite outline-offset-1 p-2 whitespace-nowrap'>
                              {filteredFasilitiSekolah[0]
                                .sekolahSelesaiReten === false ? (
                                <Link
                                  target='_blank'
                                  rel='noreferrer'
                                  to={`form-sekolah/rawatan/${singlePersonSekolah._id}`}
                                  className={`${
                                    !singlePersonSekolah.pemeriksaanSekolah ||
                                    singlePersonSekolah.statusRawatan ===
                                      'selesai'
                                      ? 'pointer-events-none bg-user4 shadow-none'
                                      : 'bg-user3 hover:bg-user2 shadow-md'
                                  } text-userWhite rounded-sm  p-1 m-1 transition-all`}
                                >
                                  {singlePersonSekolah.statusRawatan ===
                                  'selesai'
                                    ? 'selesai rawatan'
                                    : 'tambah rawatan'}
                                </Link>
                              ) : (
                                <span className='bg-user4 text-userWhite rounded-sm  p-1 m-1 transition-all'>
                                  rawatan ditutup
                                </span>
                              )}
                              {/* keluar berapa rawatan & rawatan apa */}
                              {singlePersonSekolah.rawatanSekolah.length >=
                                1 && (
                                <div className='relative inline-flex'>
                                  <span
                                    className='hover:cursor-pointer text-xs font-medium bg-user8 rounded-full px-2 py-1 capitalize transition-all whitespace-nowrap'
                                    onMouseEnter={() => {
                                      setIsShown({
                                        ...isShown,
                                        [singlePersonSekolah._id]: true,
                                      });
                                    }}
                                    onMouseLeave={() => {
                                      setIsShown({
                                        ...isShown,
                                        [singlePersonSekolah._id]: false,
                                      });
                                    }}
                                  >
                                    {singlePersonSekolah.rawatanSekolah.length}
                                  </span>
                                  <div
                                    className={`${
                                      isShown[singlePersonSekolah._id]
                                        ? 'block p-2'
                                        : 'hidden '
                                    } absolute z-10 right-4 bg-userWhite text-user1 rounded-md shadow-md m-2 w-60`}
                                  >
                                    {singlePersonSekolah.rawatanSekolah.map(
                                      (rawatan) => {
                                        // sum rawatan
                                        const semuaGD = [
                                          rawatan.gdBaruAnteriorSewarnaJumlahTampalanDibuat,
                                          rawatan.gdSemulaAnteriorSewarnaJumlahTampalanDibuat,
                                          rawatan.gdBaruPosteriorSewarnaJumlahTampalanDibuat,
                                          rawatan.gdSemulaPosteriorSewarnaJumlahTampalanDibuat,
                                          rawatan.gdBaruPosteriorAmalgamJumlahTampalanDibuat,
                                          rawatan.gdSemulaPosteriorAmalgamJumlahTampalanDibuat,
                                        ];
                                        const semuaGK = [
                                          rawatan.gkBaruAnteriorSewarnaJumlahTampalanDibuat,
                                          rawatan.gkSemulaAnteriorSewarnaJumlahTampalanDibuat,
                                          rawatan.gkBaruPosteriorSewarnaJumlahTampalanDibuat,
                                          rawatan.gkSemulaPosteriorSewarnaJumlahTampalanDibuat,
                                          rawatan.gkBaruPosteriorAmalgamJumlahTampalanDibuat,
                                          rawatan.gkSemulaPosteriorAmalgamJumlahTampalanDibuat,
                                        ];
                                        const semuaICDAS = [
                                          rawatan.baruJumlahGigiKekalDibuatFs,
                                          rawatan.baruJumlahGigiKekalDiberiFv,
                                          rawatan.baruJumlahGigiKekalDiberiPrrJenis1,
                                        ];
                                        let sumGigiDesidus = 0;
                                        semuaGD.forEach((rawatan) => {
                                          sumGigiDesidus += rawatan;
                                        });
                                        let sumGigiKekal = 0;
                                        semuaGK.forEach((rawatan) => {
                                          sumGigiKekal += rawatan;
                                        });
                                        let sumICDAS = 0;
                                        semuaICDAS.forEach((rawatan) => {
                                          sumICDAS += rawatan;
                                        });
                                        return (
                                          <div
                                            key={rawatan._id}
                                            className='flex flex-col'
                                          >
                                            <span className='text-xs font-bold text-start border-t border-t-user1 border-opacity-5 pt-1 '>
                                              {moment(
                                                rawatan.tarikhRawatanSemasa
                                              ).format('DD/MM/YYYY')}
                                            </span>
                                            <span className='text-xs font-semibold text-start'>
                                              {rawatan.createdByUsername}
                                            </span>
                                            {rawatan.cabutDesidusSekolahRawatan >=
                                              1 && (
                                              <span className='text-xs font-medium text-start'>
                                                cabut desidus :
                                                {
                                                  rawatan.cabutDesidusSekolahRawatan
                                                }
                                              </span>
                                            )}
                                            {rawatan.cabutKekalSekolahRawatan >=
                                              1 && (
                                              <span className='text-xs font-medium text-start'>
                                                cabut desidus :
                                                {
                                                  rawatan.cabutKekalSekolahRawatan
                                                }
                                              </span>
                                            )}
                                            {sumGigiDesidus >= 1 && (
                                              <span className='text-xs font-medium text-start'>
                                                tampalan gigi desidus :{' '}
                                                {sumGigiDesidus}
                                              </span>
                                            )}
                                            {sumGigiKekal >= 1 && (
                                              <span className='text-xs font-medium text-start'>
                                                tampalan gigi kekal :{' '}
                                                {sumGigiKekal}
                                              </span>
                                            )}
                                            {sumICDAS >= 1 && (
                                              <span className='text-xs font-medium text-start'>
                                                ICDAS : {sumICDAS}
                                              </span>
                                            )}
                                            {rawatan.jumlahTampalanSementaraSekolahRawatan >=
                                              1 && (
                                              <span className='text-xs font-medium text-start'>
                                                tampalan sementara :{' '}
                                                {
                                                  rawatan.jumlahTampalanSementaraSekolahRawatan
                                                }
                                              </span>
                                            )}
                                            {rawatan.pulpotomiSekolahRawatan >=
                                              1 && (
                                              <span className='text-xs font-medium text-start'>
                                                pulpotomi :{' '}
                                                {
                                                  rawatan.pulpotomiSekolahRawatan
                                                }
                                              </span>
                                            )}
                                            {rawatan.endodontikSekolahRawatan >=
                                              1 && (
                                              <span className='text-xs font-medium text-start'>
                                                endodontik :{' '}
                                                {
                                                  rawatan.endodontikSekolahRawatan
                                                }
                                              </span>
                                            )}
                                            {rawatan.absesSekolahRawatan >=
                                              1 && (
                                              <span className='text-xs font-medium text-start'>
                                                abses :{' '}
                                                {rawatan.absesSekolahRawatan}
                                              </span>
                                            )}
                                            {rawatan.penskaleranSekolahRawatan >=
                                              1 && (
                                              <span className='text-xs font-medium text-start'>
                                                penskaleran :{' '}
                                                {
                                                  rawatan.penskaleranSekolahRawatan
                                                }
                                              </span>
                                            )}
                                            {rawatan.rujukSekolahRawatan ===
                                              true && (
                                              <span className='text-xs font-medium text-start flex items-center flex-wrap'>
                                                Dirujuk{' '}
                                                <FaCheckCircle className='text-user7 text-center mx-1' />
                                                untuk{' '}
                                                {rawatan.rujukCabutanGigiKekalSekolahRawatan ===
                                                true
                                                  ? 'cabutan ,'
                                                  : ''}
                                                {rawatan.rujukRawatanEndodontikSekolahRawatan ===
                                                true
                                                  ? 'rawatan endodontik ,'
                                                  : ''}
                                                {rawatan.rujukRawatanOrtodontikSekolahRawatan ===
                                                true
                                                  ? 'rawatan penskaleran ,'
                                                  : ''}
                                                {rawatan.rujukRawatanPeriodontikSekolahRawatan ===
                                                true
                                                  ? 'rawatan periodontik ,'
                                                  : ''}
                                                {rawatan.rujukLainLainSekolahRawatan ===
                                                true
                                                  ? rawatan.rujukLainLainTulisSekolahRawatan
                                                  : ''}
                                              </span>
                                            )}
                                            {rawatan.kesSelesaiSekolahRawatan ===
                                              true && (
                                              <span className='text-xs font-medium text-start flex items-center'>
                                                kes selesai{' '}
                                                <FaCheckCircle className='text-user7 inline-flex text-center ml-1' />
                                              </span>
                                            )}
                                            {rawatan.kesSelesaiIcdasSekolahRawatan ===
                                              true && (
                                              <span className='text-xs font-medium text-start flex items-center'>
                                                kes selesai ICDAS{' '}
                                                <FaCheckCircle className='text-user7 inline-flex text-center ml-1' />
                                              </span>
                                            )}
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                </div>
                              )}
                            </td>
                            {/* <td className='outline outline-1 outline-userWhite outline-offset-1 p-2 whitespace-nowrap'>
                              <Link
                                target='_blank'
                                rel='noreferrer'
                                to={`form-sekolah/kotak/${
                                  singlePersonSekolah._id
                                }/${
                                  singlePersonSekolah.kotakSekolah
                                    ? singlePersonSekolah.kotakSekolah._id
                                    : 'tambah-kotak'
                                }`}
                                className={`${
                                  !singlePersonSekolah.kotakSekolah &&
                                  singlePersonSekolah.pemeriksaanSekolah &&
                                  singlePersonSekolah.pemeriksaanSekolah
                                    ? // .inginMelakukanIntervensiMerokok ===
                                      // 'ya-ingin-melakukan-intervensi-merokok'
                                      'bg-user6'
                                    : singlePersonSekolah.kotakSekolah &&
                                      singlePersonSekolah.pemeriksaanSekolah &&
                                      singlePersonSekolah.pemeriksaanSekolah
                                    ? // .inginMelakukanIntervensiMerokok ===
                                      // 'ya-ingin-melakukan-intervensi-merokok'
                                      'bg-user7'
                                    : 'pointer-events-none bg-user4'
                                } hover:bg-user8 text-userWhite rounded-sm shadow-md p-1 m-1 transition-all`}
                              >
                                {!singlePersonSekolah.kotakSekolah &&
                                singlePersonSekolah.pemeriksaanSekolah &&
                                singlePersonSekolah.pemeriksaanSekolah
                                  ? // .inginMelakukanIntervensiMerokok ===
                                    // 'ya-ingin-melakukan-intervensi-merokok'
                                    'tambah KOTAK'
                                  : singlePersonSekolah.kotakSekolah &&
                                    singlePersonSekolah.pemeriksaanSekolah &&
                                    // singlePersonSekolah.pemeriksaanSekolah
                                    //   .inginMelakukanIntervensiMerokok ===
                                    'ya-ingin-melakukan-intervensi-merokok'
                                  ? 'ubah KOTAK'
                                  : 'tidak perlu KOTAK'}
                              </Link>
                            </td> */}
                          </tr>
                        </tbody>
                      </>
                    );
                  })}
              {isLoading && (
                // <p className='text-xl font-semibold'>
                //   <Spinner color='#1f315f' />
                // </p>
                <tbody className='bg-user4'>
                  <tr>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-24 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                    </td>
                    {/* <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                    </td> */}
                  </tr>
                  <tr>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-24 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                    </td>
                    {/* <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                    </td> */}
                  </tr>
                </tbody>
              )}
            </table>
          ) : (
            <p className='text-xl font-bold text-center h-full w-full'>
              Sila Pilih Sekolah Terlebih Dahulu
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default UserSekolah;
