import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import UserDeleteModal from '../UserDeleteModal';

import { useGlobalUserAppContext } from '../../context/userAppContext';

export default function UserCarianPromosi() {
  const { userToken, userinfo, reliefUserToken, masterDatePicker, toast } =
    useGlobalUserAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [bulanPilih, setBulanPilih] = useState('');
  const [allProgramPromosi, setAllProgramPromosi] = useState([]);
  const [jenisProgram, setJenisProgram] = useState([]);
  const [jenisProgramResult, setJenisProgramResult] = useState([]);
  const [tarikhMulaAcara, setTarikhMulaAcara] = useState('');
  const [tarikhAkhirAcara, setTarikhAkhirAcara] = useState('');
  const [kodProgram, setKodProgram] = useState('');
  const [namaAcara, setNamaAcara] = useState('');
  const [mdcMdtbNumber, setMdcMdtbNumber] = useState('');
  const [individuOrKlinik, setIndividuOrKlinik] = useState('');
  const [queryResult, setQueryResult] = useState('');
  const [queryResultBulan, setQueryResultBulan] = useState('');
  const [flipCarian, setFlipCarian] = useState(false);
  const [pilihanId, setPilihanId] = useState('');
  const [pilihanNama, setPilihanNama] = useState('');
  const [modalHapusPromosi, setModalHapusPromosi] = useState(false);

  const [searchUrl, setSearchUrl] = useState('');
  const [refetch, setRefetch] = useState(false);

  // for datepicker
  const [tarikhMulaAcaraDP, setTarikhMulaAcaraDP] = useState(null);
  const [tarikhAkhirAcaraDP, setTarikhAkhirAcaraDP] = useState(null);

  const TarikhMula = () => {
    return masterDatePicker({
      selected: tarikhMulaAcaraDP,
      selectsStart: true,
      startDate: tarikhMulaAcaraDP,
      endDate: tarikhAkhirAcaraDP,
      onChange: (tarikhMula) => {
        const tempDate = moment(tarikhMula).format('YYYY-MM-DD');
        setTarikhMulaAcara(tempDate);
        setTarikhMulaAcaraDP(tarikhMula);
      },
      filterDate: (date) => {
        return moment() > date;
      },
      className:
        'appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent',
    });
  };

  const TarikhAkhir = () => {
    return masterDatePicker({
      selected: tarikhAkhirAcaraDP,
      selectsEnd: true,
      startDate: tarikhMulaAcaraDP,
      endDate: tarikhAkhirAcaraDP,
      minDate: tarikhMulaAcaraDP,
      onChange: (tarikhAkhir) => {
        const tempDate = moment(tarikhAkhir).format('YYYY-MM-DD');
        setTarikhAkhirAcara(tempDate);
        setTarikhAkhirAcaraDP(tarikhAkhir);
      },
      filterDate: (date) => {
        return moment() > date;
      },
      className:
        'appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent',
    });
  };

  useEffect(() => {
    const refetchDataOnDelete = async () => {
      try {
        const { data } = await axios.get(searchUrl, {
          headers: {
            Authorization: `Bearer ${
              reliefUserToken ? reliefUserToken : userToken
            }`,
          },
        });
        const desc = data.aktivitiPromosiResultQuery.sort((a, b) =>
          a.tarikhMula > b.tarikhMula ? -1 : 1
        );
        setQueryResult(desc);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    refetchDataOnDelete();
  }, [refetch]);

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
  }, [reliefUserToken, userToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const params = `/api/v1/query/promosi?${
        kodProgram ? `kodProgram=${kodProgram}&` : ''
      }${namaAcara ? `namaAcara=${namaAcara}&` : ''}${
        mdcMdtbNumber ? `mdcMdtbNumber=${mdcMdtbNumber}&` : ''
      }${individuOrKlinik ? `individuOrKlinik=${individuOrKlinik}&` : ''}`;
      setSearchUrl(params);
      const { data } = await axios.get(params, {
        headers: {
          Authorization: `Bearer ${
            reliefUserToken ? reliefUserToken : userToken
          }`,
        },
      });
      const desc = data.aktivitiPromosiResultQuery.sort((a, b) =>
        a.tarikhMula > b.tarikhMula ? -1 : 1
      );
      setQueryResult(desc);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setQueryResult([]);
      setIsLoading(false);
      toast.error('Tiada data promosi yang dijumpai');
    }
  };

  // query all promosi useEffect
  useEffect(() => {
    const fetchAllPromosi = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `/api/v1/query/promosi?tarikhAkhir=${bulanPilih}
        `,
          {
            headers: {
              Authorization: `Bearer ${
                reliefUserToken ? reliefUserToken : userToken
              }`,
            },
          }
        );
        const desc = data.aktivitiPromosiResultQuery.sort((a, b) =>
          a.tarikhMula > b.tarikhMula ? -1 : 1
        );
        setQueryResultBulan(desc);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPromosi();
  }, [reliefUserToken, userToken]);

  const handleResetAllFilter = () => {
    setTarikhMulaAcara('');
    setTarikhMulaAcaraDP(null);
    setTarikhAkhirAcara('');
    setTarikhAkhirAcaraDP(null);
    setJenisProgramResult('');
    setKodProgram('');
    setNamaAcara('');
    setMdcMdtbNumber('');
    setIndividuOrKlinik('');
    setQueryResult([]);
  };

  const handleDelete = async (singlePromosi, reason) => {
    if (!modalHapusPromosi) {
      setModalHapusPromosi(true);
      return;
    }
    if (modalHapusPromosi) {
      let mdcMdtbNum = '';
      if (!userinfo.mdtbNumber) {
        mdcMdtbNum = userinfo.mdcNumber;
      }
      if (!userinfo.mdcNumber) {
        mdcMdtbNum = userinfo.mdtbNumber;
      }
      await toast.promise(
        axios.patch(
          `/api/v1/promosi/aktiviti/delete/${singlePromosi}`,
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
      setModalHapusPromosi(false);
      setRefetch(!refetch);
    }
  };

  return (
    <>
      <div className='h-full p-3 lg:p-5 overflow-y-auto'>
        <div className='text-lg font-bold uppercase pb-2'>
          SENARAI ACARA BAGI AKTIVITI PROMOSI / PENDIDIKAN KESIHATAN PERGIGIAN
          BAGI {userinfo.kpSkrg}
        </div>
        {flipCarian ? (
          <form onSubmit={handleSubmit}>
            <div className='grid lg:grid-cols-2 gap-2'>
              <div className='m-auto w-full lg:grid lg:grid-cols-[1fr_3fr]'>
                <label
                  htmlFor='pilihanIndividuAtauKlinik'
                  className='whitespace-nowrap flex items-center mb-1 lg:justify-end mr-2'
                >
                  Jenis Reten :{' '}
                </label>
                <select
                  type='text'
                  name='pilihanIndividuAtauKlinik'
                  id='pilihanIndividuAtauKlinik'
                  value={individuOrKlinik}
                  className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  onChange={(e) => setIndividuOrKlinik(e.target.value)}
                >
                  <option value=''>Sila Pilih</option>
                  <option value='promosi-individu'>Individu</option>
                  <option value='promosi-klinik'>Klinik</option>
                </select>
              </div>
              <div className='m-auto w-full lg:grid lg:grid-cols-[1fr_3fr]'>
                <label
                  htmlFor='pilihanNama'
                  className='whitespace-nowrap flex items-center mb-1 lg:justify-end mr-2'
                >
                  Carian nama acara :{' '}
                </label>
                <input
                  type='search'
                  name='pilihanNama'
                  className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  id='pilihanNama'
                  onChange={(e) => {
                    setNamaAcara(e.target.value.toUpperCase());
                  }}
                />
              </div>
              <div className='m-auto w-full lg:grid lg:grid-cols-[1fr_3fr]'>
                <label
                  htmlFor='jenis-program'
                  className='whitespace-nowrap flex items-center mb-1 lg:justify-end mr-2'
                >
                  jenis program :
                </label>
                <select
                  type='text'
                  name='jenis-program'
                  id='jenis-program'
                  value={jenisProgramResult}
                  className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
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
              <div className='m-auto w-full lg:grid lg:grid-cols-[1fr_3fr]'>
                <label
                  htmlFor='kod-program'
                  className='whitespace-nowrap flex items-center mb-1 lg:justify-end mr-2'
                >
                  kod program :
                </label>
                <select
                  type='text'
                  value={kodProgram}
                  onChange={(e) => {
                    setKodProgram(e.target.value);
                  }}
                  className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
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
              <div className='m-auto w-full lg:grid lg:grid-cols-[1fr_7fr] lg:col-span-2'>
                <label
                  htmlFor='nama-program'
                  className='whitespace-nowrap flex items-center mb-1 lg:justify-end mr-2'
                >
                  nama program :
                </label>
                <p className='appearance-none w-full px-2 py-1 text-user1 text-left border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'>
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
            <div className='grid grid-cols-3 gap-3'>
              <div>
                <button
                  type='submit'
                  className={`${
                    tarikhMulaAcara === '' &&
                    tarikhAkhirAcara === '' &&
                    kodProgram === '' &&
                    individuOrKlinik === '' &&
                    namaAcara === ''
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  } w-full lg:w-96 mx-auto my-5 py-2 px-4 bg-user2 text-userWhite rounded-md shadow-md`}
                  disabled={
                    tarikhMulaAcara === '' &&
                    tarikhAkhirAcara === '' &&
                    kodProgram === '' &&
                    individuOrKlinik === '' &&
                    namaAcara === ''
                  }
                >
                  Hantar
                </button>
              </div>
              <div>
                <button
                  type='reset'
                  onClick={handleResetAllFilter}
                  className='w-full lg:w-96 mx-auto my-5 py-2 px-4 bg-user2 text-userWhite rounded-md shadow-md'
                >
                  Tetap Semula
                </button>
              </div>
              <div>
                <button
                  onClick={() => setFlipCarian(false)}
                  className='w-full lg:w-96 mx-auto my-5 py-2 px-4 bg-kaunter2 hover:bg-kaunter3 text-userWhite rounded-md shadow-md '
                >
                  Carian Mengikut Bulan
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className='flex flex-row items-center justify-center m-3'>
            <div className='m-auto w-full lg:grid lg:grid-cols-[1fr_3fr_1fr] lg:gap-3'>
              <label
                htmlFor='bulan'
                className='whitespace-nowrap flex items-center mb-1 lg:justify-end mr-2'
              >
                Bulan :{' '}
              </label>
              <select
                type='text'
                name='bulan'
                id='bulan'
                className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
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
              <span
                onClick={() => setFlipCarian(true)}
                className='cursor-pointer bg-kaunter2 hover:bg-kaunter3 text-userWhite text-sm px-2 py-1 rounded-md shadow-md whitespace-nowrap normal-case transition-all'
                data-cy='carian-tanpa-tarikh'
              >
                Carian Tanpa Bulan
              </span>
            </div>
          </div>
        )}
        <div className='m-auto overflow-x-auto overflow-y-hidden text-xs lg:text-sm rounded-md h-min max-w-max'>
          <table className='table-auto'>
            <thead className='text-userWhite bg-user2'>
              <tr>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  BIL
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  TARIKH MULA
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  TARIKH AKHIR
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1 whitespace-nowrap'>
                  TARIKH KEMASUKAN RETEN
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  KOD PROGRAM
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1  w-96 max-w-md'>
                  NAMA ACARA
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  DIBUAT OLEH
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  JENIS RETEN
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1 w-80'>
                  TINDAKAN
                </th>
              </tr>
            </thead>
            {!isLoading &&
              flipCarian === true &&
              queryResult.length > 0 &&
              queryResult
                .filter((q) => {
                  return q.statusReten === 'telah diisi';
                })
                .map((hasilQueryPromosi, index) => {
                  return (
                    <tbody className='bg-user4'>
                      <tr>
                        <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                          {index + 1}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                          {moment(hasilQueryPromosi.tarikhMula).format(
                            'DD/MM/YYYY'
                          )}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                          {moment(hasilQueryPromosi.tarikhAkhir).format(
                            'DD/MM/YYYY'
                          )}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                          {moment(hasilQueryPromosi.updatedAt)
                            .utcOffset(8)
                            .format('DD/MM/YYYY hh:mm A')}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                          {hasilQueryPromosi.kodProgram}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1 text-left pl-3'>
                          {hasilQueryPromosi.namaAcara}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                          {hasilQueryPromosi.createdByUsername}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                          {hasilQueryPromosi.promosiIndividu ? (
                            <span>Individu</span>
                          ) : (
                            <span>Klinik</span>
                          )}
                        </td>
                        <td
                          className={`${
                            pilihanId === hasilQueryPromosi._id && ''
                          } px-2 py-3 outline outline-1 outline-userWhite outline-offset-1 text-user2`}
                        >
                          {hasilQueryPromosi.statusReten === 'telah diisi' ||
                          hasilQueryPromosi.statusReten === 'reten salah' ? (
                            <Link
                              target='_blank'
                              rel='noreferrer'
                              to={`${
                                hasilQueryPromosi.promosiIndividu
                                  ? `/pengguna/landing/promosi-individu/form-promosi/${hasilQueryPromosi._id}`
                                  : `/pengguna/landing/promosi-klinik/form-promosi/${hasilQueryPromosi._id}`
                              }`}
                              className='m-2 p-2 uppercase bg-user3 text-sm text-userWhite rounded-md shadow-md whitespace-nowrap hover:bg-user1 transition-all'
                            >
                              lihat reten
                            </Link>
                          ) : null}
                          {(userinfo.role === 'admin' ||
                            userinfo.rolePromosiKlinik) &&
                            (hasilQueryPromosi.statusReten === 'telah diisi' ||
                            hasilQueryPromosi.statusReten === 'reten salah' ? (
                              <span
                                onClick={() => {
                                  setModalHapusPromosi(true);
                                  setPilihanId(hasilQueryPromosi._id);
                                  setPilihanNama(hasilQueryPromosi.namaAcara);
                                  // setPilihanStatusReten(
                                  //   hasilQueryPromosi.statusReten
                                  // );
                                }}
                                className='m-2 p-2 uppercase bg-user9 text-sm text-userWhite rounded-md shadow-md whitespace-nowrap hover:bg-user1 hover:cursor-pointer transition-all'
                              >
                                HAPUS RETEN
                              </span>
                            ) : null)}
                        </td>
                      </tr>
                    </tbody>
                  );
                })}
            {!isLoading &&
              flipCarian === false &&
              queryResultBulan.length > 0 &&
              queryResultBulan
                .filter((a) => {
                  if (bulanPilih === '') {
                    return a.statusReten === 'telah diisi';
                  } else if (a.tarikhAkhir.slice(5, 7) === bulanPilih) {
                    return a.statusReten === 'telah diisi';
                  }
                })
                .map((hasilQueryPromosi, index) => {
                  return (
                    <tbody className='bg-user4'>
                      <tr>
                        <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                          {index + 1}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                          {moment(hasilQueryPromosi.tarikhMula).format(
                            'DD/MM/YYYY'
                          )}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                          {moment(hasilQueryPromosi.tarikhAkhir).format(
                            'DD/MM/YYYY'
                          )}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                          {moment(hasilQueryPromosi.updatedAt)
                            .utcOffset(8)
                            .format('DD/MM/YYYY hh:mm A')}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                          {hasilQueryPromosi.kodProgram}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1 text-left pl-3'>
                          {hasilQueryPromosi.namaAcara}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                          {hasilQueryPromosi.createdByUsername}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                          {hasilQueryPromosi.promosiIndividu ? (
                            <span>Individu</span>
                          ) : (
                            <span>Klinik</span>
                          )}
                        </td>
                        <td
                          className={`${
                            pilihanId === hasilQueryPromosi._id && ''
                          } px-2 py-3 outline outline-1 outline-userWhite outline-offset-1 text-user2`}
                        >
                          {hasilQueryPromosi.statusReten === 'telah diisi' ||
                          hasilQueryPromosi.statusReten === 'reten salah' ? (
                            <Link
                              target='_blank'
                              rel='noreferrer'
                              to={`${
                                hasilQueryPromosi.promosiIndividu
                                  ? `/pengguna/landing/promosi-individu/form-promosi/${hasilQueryPromosi._id}`
                                  : `/pengguna/landing/promosi-klinik/form-promosi/${hasilQueryPromosi._id}`
                              }`}
                              className='m-2 p-2 uppercase bg-user3 text-sm text-userWhite rounded-md shadow-md whitespace-nowrap hover:bg-user1 transition-all'
                            >
                              lihat reten
                            </Link>
                          ) : null}
                          {(userinfo.role === 'admin' ||
                            userinfo.rolePromosiKlinik) &&
                            (hasilQueryPromosi.statusReten === 'telah diisi' ||
                            hasilQueryPromosi.statusReten === 'reten salah' ? (
                              <span
                                onClick={() => {
                                  setModalHapusPromosi(true);
                                  setPilihanId(hasilQueryPromosi._id);
                                  setPilihanNama(hasilQueryPromosi.namaAcara);
                                  // setPilihanStatusReten(
                                  //   hasilQueryPromosi.statusReten
                                  // );
                                }}
                                className='m-2 p-2 uppercase bg-user9 text-sm text-userWhite rounded-md shadow-md whitespace-nowrap hover:bg-user1 hover:cursor-pointer transition-all'
                              >
                                HAPUS RETEN
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
        {modalHapusPromosi && (
          <UserDeleteModal
            handleDelete={handleDelete}
            setModalHapus={setModalHapusPromosi}
            id={pilihanId}
            nama={pilihanNama}
          />
        )}
      </div>
    </>
  );
}
