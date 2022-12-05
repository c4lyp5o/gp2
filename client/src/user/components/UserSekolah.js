import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

import { useGlobalUserAppContext } from '../context/userAppContext';

function UserSekolah() {
  const {
    userToken,
    reliefUserToken,
    navigate,
    refreshTimer,
    setRefreshTimer,
  } = useGlobalUserAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isShown, setIsShown] = useState(false);
  const [allPersonSekolahs, setAllPersonSekolahs] = useState([]);
  const [dahFilterSekolahs, setDahFilterSekolahs] = useState([]);
  const [dahFilterTahun, setDahFilterTahun] = useState([]);
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
      }
    };
    fetchFasilitiSekolahs();
  }, []);

  useEffect(() => {
    setFilteredFasilitiSekolah(
      fasilitiSekolah.filter((f) => f.nama.includes(pilihanSekolah))
    );
  }, [pilihanSekolah]);

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
        <div>
          <h2 className='text-xl font-semibold flex flex-row pl-5 lg:pl-12 p-2'>
            SILA PILIH
          </h2>
          <p className='flex flex-row pl-5 lg:pl-12 p-2'>Nama Sekolah</p>
          <select
            value={pilihanSekolah}
            onChange={(e) => {
              setPilihanSekolah(e.target.value);
            }}
            className='w-11/12 leading-7 px-3 py-1 mb-3 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
          >
            <option value=''>Sila pilih..</option>
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
          {pilihanSekolah && (
            <>
              <p className='flex flex-row pl-5 lg:pl-12 p-2'>Tahun</p>
              <select
                value={pilihanTahun}
                onChange={(e) => {
                  setPilihanTahun(e.target.value);
                }}
                className='w-11/12 leading-7 px-3 py-1 mb-3 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
              >
                <option value=''>Sila pilih..</option>
                {tahun.map((singleTahun, index) => {
                  return (
                    <option
                      value={singleTahun}
                      key={index}
                      className='capitalize'
                    >
                      {singleTahun}
                    </option>
                  );
                })}
              </select>
            </>
          )}
          {pilihanTahun && (
            <>
              <p className='flex flex-row pl-5 lg:pl-12 p-2'>Nama Kelas</p>
              <select
                value={pilihanNamaKelas}
                onChange={(e) => {
                  setPilihanNamaKelas(e.target.value);
                }}
                className='w-11/12 leading-7 px-3 py-1 mb-3 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
              >
                <option value=''>Sila pilih..</option>
                {namaKelas.map((singleNamaKelas, index) => {
                  return (
                    <option
                      value={singleNamaKelas}
                      key={index}
                      className='capitalize'
                    >
                      {singleNamaKelas}
                    </option>
                  );
                })}
              </select>
            </>
          )}
          {pilihanNamaKelas && (
            <>
              <p className='flex flex-row pl-5 lg:pl-12 p-2'>Nama Pelajar</p>
              <input
                type='text'
                value={filterNama}
                onChange={(e) => {
                  setFilterNama(e.target.value.toUpperCase());
                }}
                className='lowercase w-11/12 appearance-none leading-7 px-3 py-1 mb-3 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
              />
            </>
          )}
          <div className='flex justify-end px-12 '>
            <button
              onClick={() => {
                navigate(-1);
              }}
              className='capitalize bg-user3 text-sm text-userWhite rounded-md shadow-xl p-1 mb-2 mr-2 hover:bg-user1 transition-all'
            >
              kembali ke senarai sekolah
            </button>
          </div>
        </div>
        {pilihanSekolah &&
          filteredFasilitiSekolah[0].sekolahSelesaiReten === true && (
            <div>reten sekolah telah ditutup</div>
          )}
        {pilihanSekolah &&
          filteredFasilitiSekolah[0].sekolahSelesaiReten === false && (
            <div>reten sekolah masih dibuka</div>
          )}
        <div className='m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max'>
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
                  OPERATOR TERAKHIR
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
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  KOTAK
                </th>
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
                            {singlePersonSekolah.rawatanSekolah.length >= 1 &&
                              singlePersonSekolah.rawatanSekolah.at(-1)
                                .createdByUsername}
                          </td>
                          <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                            {singlePersonSekolah.statusRawatan}
                          </td>
                          <td className='outline outline-1 outline-userWhite outline-offset-1 p-2 whitespace-nowrap'>
                            <Link
                              target='_blank'
                              to={`form-sekolah/pemeriksaan/${
                                singlePersonSekolah._id
                              }/${
                                singlePersonSekolah.pemeriksaanSekolah
                                  ? singlePersonSekolah.pemeriksaanSekolah._id
                                  : 'tambah-pemeriksaan'
                              }`}
                              className={`${
                                singlePersonSekolah.pemeriksaanSekolah
                                  ? 'bg-user7'
                                  : 'bg-user6'
                              } hover:bg-user8 text-userWhite rounded-sm shadow-md p-1 m-1 transition-all`}
                            >
                              {singlePersonSekolah.pemeriksaanSekolah
                                ? 'ubah pemeriksaan'
                                : 'tambah pemeriksaan'}
                            </Link>
                          </td>
                          <td className='outline outline-1 outline-userWhite outline-offset-1 p-2 whitespace-nowrap'>
                            <Link
                              target='_blank'
                              to={`form-sekolah/rawatan/${singlePersonSekolah._id}`}
                              className={`${
                                !singlePersonSekolah.pemeriksaanSekolah ||
                                singlePersonSekolah.statusRawatan === 'selesai'
                                  ? 'pointer-events-none bg-user4'
                                  : 'bg-user3 hover:bg-user2'
                              } text-userWhite rounded-sm shadow-md p-1 m-1 transition-all`}
                            >
                              {singlePersonSekolah.statusRawatan === 'selesai'
                                ? 'selesai rawatan'
                                : 'tambah rawatan'}
                            </Link>
                            {/* keluar berapa rawatan & rawatan apa */}
                            {singlePersonSekolah.rawatanSekolah.length >= 1 && (
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
                                              {rawatan.cabutKekalSekolahRawatan}
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
                                              {rawatan.pulpotomiSekolahRawatan}
                                            </span>
                                          )}
                                          {rawatan.endodontikSekolahRawatan >=
                                            1 && (
                                            <span className='text-xs font-medium text-start'>
                                              endodontik :{' '}
                                              {rawatan.endodontikSekolahRawatan}
                                            </span>
                                          )}
                                          {rawatan.absesSekolahRawatan >= 1 && (
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
                          <td className='outline outline-1 outline-userWhite outline-offset-1 p-2 whitespace-nowrap'>
                            <Link
                              target='_blank'
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
                          </td>
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
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
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
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
}

export default UserSekolah;
