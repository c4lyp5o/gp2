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

import RegisterFMRModal from './RegisterFMRModal';

import { useGlobalUserAppContext } from '../../../context/userAppContext';

function KohortFMR() {
  const { userToken, reliefUserToken, navigate, userinfo, toast } =
    useGlobalUserAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [modalRegisterSekolah, setModalRegisterSekolah] = useState(false);
  const [allSekolahKohortFMR, setAllSekolahKohortFMR] = useState([]);
  const [currentKodSekolah, setCurrentKodSekolah] = useState('');

  const [reloadState, setReloadState] = useState(false);

  const init = useRef(false);

  useEffect(() => {
    const fetchAllSekolahKohortFMR = async () => {
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
          console.log(data);
          setAllSekolahKohortFMR(data.allSekolahKohortFMR);
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
    fetchAllSekolahKohortFMR();
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
          <div>
            <div className='flex justify-between'>
              <h2 className='text-sm lg:text-xl font-semibold flex flex-row pl-2 lg:pl-12 pt-2'>
                SENARAI SEKOLAH KOHORT FMR
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
          </div>
        </div>
        <div className='m-auto text-xs lg:text-sm rounded-md h-min max-w-max overflow-x-auto mt-3'>
          <table className='table-auto'>
            <thead className='text-userWhite bg-user2'>
              <tr>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  BIL.
                </th>
                <th className='outline outline-1 outline-offset-1 py-1 px-10 lg:px-20'>
                  NAMA SEKOLAH
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 whitespace-nowrap'>
                  ENROLMEN
                </th>
                <th className='outline outline-1 outline-offset-1 px-5 py-1'>
                  BIL. MURID BARU
                </th>
                {userinfo.role === 'admin' ? (
                  <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                    DAFTAR KOHORT TAHUN 1
                  </th>
                ) : null}
              </tr>
            </thead>
            {!isLoading ? (
              <>
                <tbody className='text-user1'>
                  {allSekolahKohortFMR.map((singleSekolahKohortFMR, index) => {
                    return (
                      <tr key={index}>
                        <td className='outline outline-1 outline-offset-1 px-2 py-1'>
                          {index + 1}
                        </td>
                        <td className='outline outline-1 outline-offset-1 px-2 py-1'>
                          {singleSekolahKohortFMR.nama}
                        </td>
                        <td className='outline outline-1 outline-offset-1 px-2 py-1'>
                          {singleSekolahKohortFMR.kelas}
                        </td>
                        <td className='outline outline-1 outline-offset-1 px-2 py-1'>
                          {singleSekolahKohortFMR.noTelefon}
                        </td>
                        <td className='outline outline-1 outline-offset-1 px-2 py-1'>
                          {!singleSekolahKohortFMR.statusFMRTelahDaftarDarjahSatu ? (
                            // <button
                            //   className='bg-user3 text-xs text-userWhite rounded-md shadow-xl p-1 mb-2 mr-2 hover:bg-user1 transition-all'
                            //   onClick={() => {
                            //     setCurrentKodSekolah(
                            //       singleSekolahKohortFMR.kodSekolah
                            //     );
                            //     console.log(singleSekolahKohortFMR.kodSekolah);
                            //     setModalRegisterSekolah(true);
                            //   }}
                            // >
                            //   DAFTAR
                            // </button>
                            <Link
                              to={`/pengguna/landing/kohort/fmr/daftar/${singleSekolahKohortFMR.kodSekolah}`}
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
                      </tr>
                    );
                  })}
                </tbody>
              </>
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
        <div className='grid grid-cols-2 shadow-md shadow-user3 mt-5'>
          <div className='flex justify-center items-center'>
            <Link
              to='daftar'
              className='bg-user3 text-md text-userWhite rounded-md shadow-xl p-1 mb-2 mr-2 hover:bg-user1 transition-all'
            >
              DAFTAR KUMURAN MURID TAHUN 1
            </Link>
          </div>
          {/* <div className='flex justify-center items-center'>
            <Link
              to='carian'
              className='bg-user3 text-md text-userWhite rounded-md shadow-xl p-1 mb-2 mr-2 hover:bg-user1 transition-all'
            >
              CARIAN
            </Link>
          </div> */}
          <div className='flex justify-center items-center'>
            <button
              className='bg-user3 text-md text-userWhite rounded-md shadow-xl p-1 mb-2 mr-2 hover:bg-user1 transition-all'
              onClick={() => {
                setModalRegisterSekolah(true);
              }}
            >
              DAFTAR KUMURAN MURID KOHORT
            </button>
          </div>
        </div>
        {modalRegisterSekolah ? (
          <RegisterFMRModal
            modalRegisterSekolah={modalRegisterSekolah}
            setModalRegisterSekolah={setModalRegisterSekolah}
            currentKodSekolah={currentKodSekolah}
            setReloadState={setReloadState}
          />
        ) : null}
      </div>
    </>
  );
}

export default KohortFMR;
