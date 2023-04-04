import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import UserDeleteModal from '../UserDeleteModal';

import { useGlobalUserAppContext } from '../../context/userAppContext';

export default function UserCarianPromosi() {
  const {
    userToken,
    userinfo,
    reliefUserToken,
    dateToday,
    masterDatePicker,
    toast,
  } = useGlobalUserAppContext();

  const [isLoading, setIsLoading] = useState(true);
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
      onChange: (tarikhMula) => {
        const tempDate = moment(tarikhMula).format('YYYY-MM-DD');
        setTarikhMulaAcara(tempDate);
        setTarikhMulaAcaraDP(tarikhMula);
      },
      className:
        'appearance-none w-full lg:w-auto text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md uppercase flex flex-row lg:ml-2',
    });
  };

  const TarikhAkhir = () => {
    return masterDatePicker({
      selected: tarikhAkhirAcaraDP,
      onChange: (tarikhAkhir) => {
        const tempDate = moment(tarikhAkhir).format('YYYY-MM-DD');
        setTarikhAkhirAcara(tempDate);
        setTarikhAkhirAcaraDP(tarikhAkhir);
      },
      className:
        'appearance-none w-full lg:w-auto text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md uppercase flex flex-row lg:ml-2',
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
        // toast.error(
        //   'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: user-promosi-refetchDataOnDelete'
        // );
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
        // toast.error(
        //   'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: user-promosi-fetchAllProgramPromosi'
        // );
      }
    };
    fetchAllProgramPromosi();
  }, [reliefUserToken, userToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const params = `/api/v1/query/promosi?${
        tarikhMulaAcara ? `tarikhMulaAcara=${tarikhMulaAcara}&` : ''
      }${tarikhAkhirAcara ? `tarikhAkhirAcara=${tarikhAkhirAcara}&` : ''}${
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
        <div className='text-lg font-bold uppercase'>
          SENARAI ACARA BAGI AKTIVITI PROMOSI / PENDIDIKAN KESIHATAN PERGIGIAN
          BAGI {userinfo.kpSkrg}
        </div>
        <form onSubmit={handleSubmit}>
          <div className='grid lg:grid-cols-2 gap-2'>
            <div>
              <div className='m-auto w-full lg:flex lg:flex-row lg:py-2 lg:w-96'>
                <label
                  htmlFor='pilihanTarikh'
                  className='whitespace-nowrap flex items-center mb-1'
                >
                  Tarikh Mula Acara :{' '}
                </label>
                <TarikhMula />
              </div>
              <div className='m-auto w-full lg:flex lg:flex-row lg:py-2 lg:w-96'>
                <label
                  htmlFor='pilihanTarikh'
                  className='whitespace-nowrap flex items-center mb-1'
                >
                  Tarikh Akhir Acara :{' '}
                </label>
                <TarikhAkhir />
              </div>
              <div className='m-auto w-full lg:flex lg:flex-row lg:py-2 lg:w-96'>
                <label
                  htmlFor='pilihanNama'
                  className='whitespace-nowrap flex items-center mb-1'
                >
                  Carian nama acara :{' '}
                </label>
                <input
                  type='search'
                  name='pilihanNama'
                  className='appearance-none w-full text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md uppercase lg:ml-2'
                  id='pilihanNama'
                  onChange={(e) => {
                    setNamaAcara(e.target.value.toUpperCase());
                  }}
                />
              </div>
              <div className='m-auto w-96 lg:flex lg:flex-row mt-3'>
                <label
                  htmlFor='pilihanIndividuAtauKlinik'
                  className='whitespace-nowrap mr-7 mx-5'
                >
                  Individu/Klinik :{' '}
                </label>
                <select
                  type='text'
                  name='pilihanIndividuAtauKlinik'
                  id='pilihanIndividuAtauKlinik'
                  value={individuOrKlinik}
                  className='w-full my-3 mx-4 leading-7 px-3 py-2 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
                  onChange={(e) => setIndividuOrKlinik(e.target.value)}
                >
                  <option value=''>Sila Pilih</option>
                  <option value='promosi-individu'>Individu</option>
                  <option value='promosi-klinik'>Klinik</option>
                </select>
              </div>
            </div>
            <div>
              <div className='m-auto w-96 lg:flex lg:flex-row'>
                <label
                  htmlFor='jenis-program'
                  className='whitespace-nowrap mr-7 mx-5'
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
              <div className='m-auto w-96 lg:flex lg:flex-row'>
                <label
                  htmlFor='kod-program'
                  className='whitespace-nowrap mr-8 mx-5'
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
              <div className='m-auto w-96 lg:flex lg:flex-row'>
                <label
                  htmlFor='nama-program'
                  className='whitespace-nowrap mx-5 text-left'
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
            </div>
          </div>
          <div className='grid grid-cols-2 gap-3'>
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
          </div>
        </form>
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
              queryResult.length > 0 &&
              queryResult.map((hasilQueryPromosi, index) => {
                return (
                  <tbody className='bg-user4'>
                    <tr>
                      <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                        {index + 1}
                      </td>
                      <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                        {hasilQueryPromosi.tarikhMula}
                      </td>
                      <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                        {hasilQueryPromosi.tarikhAkhir}
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
                          pilihanId === hasilQueryPromosi._id && 'bg-user3'
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
