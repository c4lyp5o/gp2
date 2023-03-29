import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaCaretUp,
  FaCaretDown,
} from 'react-icons/fa';

import { useGlobalUserAppContext } from '../../../context/userAppContext';

function KohortKotak() {
  const { userToken, reliefUserToken, navigate, toast } =
    useGlobalUserAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isShown, setIsShown] = useState(false);
  const [allPersonKohorts, setAllPersonKohorts] = useState([]);
  const [pilihanSekolah, setPilihanSekolah] = useState('');
  const [pilihanTahun, setPilihanTahun] = useState('');
  const [pilihanNamaKelas, setPilihanNamaKelas] = useState('');

  const [fasilitiSekolah, setFasilitiSekolah] = useState([]);

  const [reloadState, setReloadState] = useState(false);

  const init = useRef(false);

  // init fetch allPersonKohortKotak
  useEffect(() => {
    const fetchAllPersonKohort = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get('/api/v1/kohort?jenisKohort=kotak', {
          headers: {
            Authorization: `Bearer ${
              reliefUserToken ? reliefUserToken : userToken
            }`,
          },
        });
        // const allPersonKohorts = data.allPersonSekolahs;
        // const namaSekolahs = allPersonSekolahs.reduce(
        //   (arrNamaSekolahs, singlePersonSekolah) => {
        //     if (!arrNamaSekolahs.includes(singlePersonSekolah.namaSekolah)) {
        //       arrNamaSekolahs.push(singlePersonSekolah.namaSekolah);
        //     }
        //     return arrNamaSekolahs.filter((valid) => valid);
        //   },
        //   ['']
        // );
        setAllPersonKohorts(data.kohortResultQuery);
        // setNamaSekolahs(namaSekolahs);
        // setRefreshTimer(!refreshTimer);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        // toast.error(
        //   'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: user-sekolah-fetchAllPersonSekolahs'
        // );
      }
    };
    fetchAllPersonKohort();
  }, [reloadState]);

  //   useEffect(() => {
  //     const filteredSekolahs = allPersonSekolahs.filter((person) =>
  //       person.namaSekolah.includes(pilihanSekolah)
  //     );
  //     const tahun = filteredSekolahs.reduce(
  //       (arrTahun, singlePersonSekolah) => {
  //         if (!arrTahun.includes(singlePersonSekolah.tahun)) {
  //           arrTahun.push(singlePersonSekolah.tahun);
  //         }
  //         return arrTahun.filter((valid) => valid);
  //       },
  //       ['']
  //     );
  //     setTahun(tahun);
  //     setDahFilterSekolahs(filteredSekolahs);
  //   }, [pilihanSekolah]);

  //   useEffect(() => {
  //     const filteredTahun = dahFilterSekolahs.filter((person) =>
  //       person.tahun.includes(pilihanTahun)
  //     );
  //     const namaKelas = filteredTahun.reduce(
  //       (arrNamaKelas, singlePersonSekolah) => {
  //         if (!arrNamaKelas.includes(singlePersonSekolah.namaKelas)) {
  //           arrNamaKelas.push(singlePersonSekolah.namaKelas);
  //         }
  //         return arrNamaKelas.filter((valid) => valid);
  //       },
  //       ['']
  //     );
  //     setNamaKelas(namaKelas);
  //     setDahFilterTahun(filteredTahun);
  //   }, [pilihanTahun]);

  //   // reset value
  //   useEffect(() => {
  //     setPilihanTahun('');
  //     setPilihanNamaKelas('');
  //     setFilterNama('');
  //   }, [pilihanSekolah]);

  //   useEffect(() => {
  //     setPilihanNamaKelas('');
  //     setFilterNama('');
  //   }, [pilihanTahun]);

  //   useEffect(() => {
  //     setFilterNama('');
  //   }, [pilihanNamaKelas]);

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

  // on tab focus reload data
  useEffect(() => {
    window.addEventListener('focus', setReloadState);
    setReloadState(!reloadState);
    return () => {
      window.removeEventListener('focus', setReloadState);
    };
  }, []);

  return (
    <>
      <div className='px-3 lg:px-7 h-full p-3 overflow-y-auto'>
        <div className='relative shadow-md drop-shadow-sm mb-2'>
          <div className=''>
            <div className='flex justify-between'>
              <h2 className='text-sm lg:text-xl font-semibold flex flex-row pl-2 lg:pl-12 pt-2'>
                CARIAN KOHORT KOTAK
              </h2>
              <div className='flex justify-end items-center text-right mt-2'>
                <button
                  onClick={() => {
                    navigate(-1);
                  }}
                  className='capitalize bg-user3 text-xs text-userWhite rounded-md shadow-xl p-1 mb-2 mr-2 hover:bg-user1 transition-all'
                >
                  kembali ke senarai data kohort
                </button>
              </div>
            </div>
            <div className='grid grid-cols-2'>
              <p className='grid grid-cols-[1fr_3fr] pb-1'>
                <span className='font-bold uppercase text-xs lg:text-sm flex justify-end place-items-center mr-2'>
                  Sekolah:
                </span>{' '}
                <span className=' uppercase text-xs lg:text-sm w-full'>
                  <select
                    value={pilihanSekolah}
                    onChange={(e) => {
                      setPilihanSekolah(e.target.value);
                    }}
                    className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  >
                    <option value=''>SILA PILIH</option>
                    {/* {namaSekolahs.map((singleNamaSekolah, index) => {
                      return (
                        <option
                          value={singleNamaSekolah}
                          key={index}
                          className='capitalize'
                        >
                          {singleNamaSekolah}
                        </option>
                      );
                    })} */}
                  </select>
                </span>
              </p>
              <p className='grid grid-cols-[1fr_3fr] pb-1'>
                <span className='font-bold uppercase text-xs lg:text-sm flex justify-end place-items-center mr-2'>
                  Kohort:
                </span>{' '}
                <span className=' uppercase text-xs lg:text-sm w-full'>
                  <select
                    value={pilihanTahun}
                    onChange={(e) => {
                      setPilihanTahun(e.target.value);
                    }}
                    className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  >
                    <option value=''>SILA PILIH</option>
                    {/* {pilihanSekolah ? (
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
                    )} */}
                  </select>
                </span>
              </p>
              <p className='grid grid-cols-[1fr_3fr] pb-1'>
                <span className='font-bold uppercase text-xs lg:text-sm flex justify-end place-items-center mr-2'>
                  No. Pengenalan:
                </span>{' '}
                <span className=' uppercase text-xs lg:text-sm w-full'>
                  <select
                    value={pilihanNamaKelas}
                    onChange={(e) => {
                      setPilihanNamaKelas(e.target.value);
                    }}
                    className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  >
                    <option value=''>SILA PILIH</option>
                    {/* {pilihanTahun ? (
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
                    )} */}
                  </select>
                </span>
              </p>
              {/* {pilihanTahun && (
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
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  BIL.
                </th>
                <th className='outline outline-1 outline-offset-1 py-1 px-10 lg:px-20'>
                  NAMA
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 whitespace-nowrap'>
                  KELAS
                </th>
                <th className='outline outline-1 outline-offset-1 px-5 py-1'>
                  NO. TELEFON
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  INTERVENSI KOTAK
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  TARIKH KEHADIRAN INTERVENSI 1
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  STATUS SELEPAS 6 BULAN
                </th>
              </tr>
            </thead>
            {!isLoading ? (
              <tbody className='text-user1'>
                {allPersonKohorts.map((singlePersonKohort, index) => {
                  return (
                    <tr key={index}>
                      <td className='outline outline-1 outline-offset-1 px-2 py-1'>
                        {index + 1}
                      </td>
                      <td className='outline outline-1 outline-offset-1 px-2 py-1'>
                        {singlePersonKohort.nama}
                      </td>
                      <td className='outline outline-1 outline-offset-1 px-2 py-1'>
                        {singlePersonKohort.kelas}
                      </td>
                      <td className='outline outline-1 outline-offset-1 px-2 py-1'>
                        {singlePersonKohort.noTelefon}
                      </td>
                      <td className='outline outline-1 outline-offset-1 px-2 py-1'>
                        <Link
                          target='_blank'
                          rel='noreferrer'
                          to={`${singlePersonKohort._id}`}
                        >
                          tambah KOTAK
                        </Link>
                      </td>
                      <td className='outline outline-1 outline-offset-1 px-2 py-1'>
                        {!singlePersonKohort.tarikhIntervensi1 ? (
                          <span className='text-red-500'>BELUM DITETAPKAN</span>
                        ) : (
                          <span>{singlePersonKohort.tarikhIntervensi1}</span>
                        )}
                      </td>
                      <td className='outline outline-1 outline-offset-1 px-2 py-1'>
                        {singlePersonKohort.statusSelepas6Bulan}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            ) : (
              <tbody className='text-user1'>
                <tr>
                  <td className='outline outline-1 outline-offset-1 px-2 py-1'>
                    Loading...
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

export default KohortKotak;
