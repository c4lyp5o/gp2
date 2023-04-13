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
  const [allPersonKohortKotak, setAllPersonKohortKotak] = useState([]);
  const [pilihanSekolah, setPilihanSekolah] = useState('');
  const [pilihanKohort, setPilihanKohort] = useState('');
  const [pilihanNamaKelas, setPilihanNamaKelas] = useState('');

  const [namaSekolahs, setNamaSekolahs] = useState([]);
  const [kohort, setKohort] = useState([]);

  const [reloadState, setReloadState] = useState(false);

  const init = useRef(false);

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
            data.kohortKotakResultQuery.map(
              (item) => item.dalamPemantauanKohort
            )
          ),
        ];
        // 👇️ sort by String property ASCENDING (A - Z)
        const desc = data.kohortKotakResultQuery.sort((a, b) =>
          a.statusKotak > b.statusKotak ? 1 : -1
        );
        setNamaSekolahs(namaSekolahs);
        setKohort(kohort);
        setAllPersonKohortKotak(desc);
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
                    {pilihanSekolah ? (
                      kohort.map((kohort, index) => {
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
                    ) : (
                      <option value=''>SILA PILIH SEKOLAH</option>
                    )}
                  </select>
                </span>
              </p>
              <p className='grid grid-cols-[1fr_3fr] pb-1'>
                <span className='font-bold uppercase text-xs lg:text-sm flex justify-end place-items-center mr-2'>
                  No. Kad Pengenalan:
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
                    {/* {pilihanKohort ? (
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
              </tr>
            </thead>
            {!isLoading ? (
              <tbody className='bg-user4'>
                {allPersonKohortKotak
                  .filter((singlePersonKohortKotak) => {
                    if (pilihanSekolah === 'semua') {
                      return singlePersonKohortKotak;
                    } else if (
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
                  .map((singlePersonKohortKotak, index) => {
                    return (
                      <tr key={index}>
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
                        <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-2'>
                          <Link
                            target='_blank'
                            rel='noreferrer'
                            to={`${singlePersonKohortKotak._id}`}
                            className={`${
                              singlePersonKohortKotak.statusKotak ===
                              'selesai sesi 1'
                                ? 'bg-[#00b894] text-userWhite hover:shadow-none hover:bg-[#55efc4]'
                                : singlePersonKohortKotak.statusKotak ===
                                  'selesai sesi 2'
                                ? 'bg-[#0984e3] text-userWhite hover:shadow-none hover:bg-[#81ecec]'
                                : singlePersonKohortKotak.statusKotak ===
                                  'selesai sesi 3'
                                ? 'bg-user8 text-userWhite hover:bg-user8 hover:shadow-none'
                                : 'bg-user6 text-userWhite hover:shadow-none hover:bg-[#74b9ff]'
                            } shadow-md shadow-user3 rounded-md p-1 m-1 transition-all my-2`}
                          >
                            {singlePersonKohortKotak.statusKotak ===
                            'belum mula'
                              ? 'tambah KOTAK'
                              : singlePersonKohortKotak.statusKotak}
                          </Link>
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
                          {singlePersonKohortKotak.statusSelepas6Bulan}
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
