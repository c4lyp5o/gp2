import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import { useGlobalUserAppContext } from '../../../context/userAppContext';

function KohortFMR() {
  const { userToken, reliefUserToken, navigate, userinfo, toast } =
    useGlobalUserAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [allSekolahFMR, setAllSekolahFMR] = useState([]);

  const [reloadState, setReloadState] = useState(false);

  const init = useRef(false);

  useEffect(() => {
    const fetchAllSekolahFMR = async () => {
      if (init.current === false) {
        try {
          setIsLoading(true);
          const { data } = await axios.get('/api/v1/kohort/fmr', {
            headers: {
              Authorization: `Bearer ${
                reliefUserToken ? reliefUserToken : userToken
              }`,
            },
          });
          // console.log(data);
          setAllSekolahFMR(data.allSekolahFMR);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          // toast.error(
          //   'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: user-sekolah-fetchAllPersonSekolahs'
          // );
        }
      }
      init.current = true;
    };
    if (init.current === true) {
      init.current === false;
    }
    fetchAllSekolahFMR();
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
          <div className='flex justify-between'>
            <h2 className='text-sm lg:text-xl font-semibold flex flex-row pl-2 lg:pl-12 pt-2'>
              SENARAI SEKOLAH KOHORT FMR
            </h2>
            <div className='flex justify-end items-center text-right mt-2'>
              <button
                onClick={() => {
                  navigate('/pengguna/landing/kohort');
                }}
                className='capitalize bg-user3 text-xs text-userWhite rounded-md shadow-xl p-1 mb-2 mr-2 hover:bg-user1 transition-all'
              >
                kembali ke senarai data kohort
              </button>
            </div>
          </div>
        </div>
        <div className='m-auto overflow-x-auto overflow-y-hidden text-xs lg:text-sm rounded-md h-min max-w-max mt-5'>
          <table className='table-auto'>
            <thead className='text-userWhite bg-user2'>
              <tr>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  BIL.
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1 w-96 max-w-md'>
                  NAMA SEKOLAH
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  ENROLMEN
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  BIL. MURID BARU
                </th>
                {userinfo.role === 'admin' ? (
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    DAFTAR KOHORT TAHUN 1
                  </th>
                ) : null}
              </tr>
            </thead>
            {!isLoading ? (
              <>
                <tbody className='bg-user4'>
                  {allSekolahFMR.map((singleSekolahFMR, index) => {
                    return (
                      <tr key={index}>
                        <td className='p-2 outline outline-1 outline-userWhite outline-offset-1'>
                          {index + 1}
                        </td>
                        <td className='p-2 outline outline-1 outline-userWhite outline-offset-1'>
                          {singleSekolahFMR.nama}
                        </td>
                        <td className='p-2 outline outline-1 outline-userWhite outline-offset-1'>
                          {singleSekolahFMR.kelas}
                        </td>
                        <td className='p-2 outline outline-1 outline-userWhite outline-offset-1'>
                          {singleSekolahFMR.noTelefon}
                        </td>
                        {userinfo.role === 'admin' ? (
                          <td className='p-2 outline outline-1 outline-userWhite outline-offset-1'>
                            {!singleSekolahFMR.statusFMRTelahDaftarDarjahSatu ? (
                              <Link
                                to={`/pengguna/landing/kohort/fmr/daftar-murid/${singleSekolahFMR.kodSekolah}`}
                                className='bg-user3 text-xs text-userWhite rounded-md shadow-xl p-1 mb-2 mr-2 hover:bg-user1 transition-all'
                              >
                                DAFTAR
                              </Link>
                            ) : (
                              <button
                                disabled={true}
                                className='bg-user6 text-xs text-userWhite rounded-md shadow-xl p-1 mb-2 mr-2 hover:bg-user1 transition-all cursor-not-allowed'
                              >
                                TELAH DAFTAR
                              </button>
                            )}
                          </td>
                        ) : null}
                      </tr>
                    );
                  })}
                </tbody>
              </>
            ) : (
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
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
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
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
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
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
        <div className='grid grid-cols-3 shadow-md shadow-user3 m-5'>
          <div className='flex justify-center items-center'>
            <Link
              to='daftar-kumur'
              className='bg-user3 text-md text-userWhite rounded-md shadow-xl p-1 mb-2 mr-2 hover:bg-user1 transition-all'
            >
              DAFTAR KUMURAN MURID TAHUN 1
            </Link>
          </div>
          <div className='flex justify-center items-center'>
            <Link
              to='carian'
              className='bg-user3 text-md text-userWhite rounded-md shadow-xl p-1 mb-2 mr-2 hover:bg-user1 transition-all'
            >
              CARIAN
            </Link>
          </div>
          <div className='flex justify-center items-center'>
            <Link
              to='daftar-kumur-kohort'
              className='bg-user3 text-md text-userWhite rounded-md shadow-xl p-1 mb-2 mr-2 hover:bg-user1 transition-all'
            >
              DAFTAR KUMURAN MURID KOHORT TAHUN 1
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default KohortFMR;
