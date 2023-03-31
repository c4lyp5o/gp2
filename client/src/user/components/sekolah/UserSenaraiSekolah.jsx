import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  BsFillCircleFill,
  BsFillCheckCircleFill,
  BsChevronDoubleRight,
  BsChevronDoubleLeft,
} from 'react-icons/bs';

import { useGlobalUserAppContext } from '../../context/userAppContext';

import UserModalSelesaiSekolah from './UserModalSelesaiSekolah';

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
  const [enrolmen, setEnrolmen] = useState([]);
  const [kedatanganBaru, setKedatanganBaru] = useState([]);
  const [kesSelesai, setKesSelesai] = useState([]);
  const [sekMenRen, setSekMenRen] = useState('');

  const [modalSelesaiSekolah, setModalSelesaiSekolah] = useState(false);
  const [idSekolah, setIdSekolah] = useState('');

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
        setAllPersonSekolahs(data.allPersonSekolahs);
        setNamaSekolahs(data.fasilitiSekolahs);
        data.fasilitiSekolahs
          .sort((a, b) => a.sekolahSelesaiReten - b.sekolahSelesaiReten)
          .forEach((singleSekolah) => {
            // kira enrolmen
            const tempEnrolmen = () => {
              return data.allPersonSekolahs.filter((person) =>
                person.namaSekolah.includes(singleSekolah.nama)
              ).length;
            };
            setEnrolmen((current) => [...current, tempEnrolmen()]);

            // kira kedatangan baru
            let tempKedatanganBaru = 0;
            data.allPersonSekolahs
              .filter((person) =>
                person.namaSekolah.includes(singleSekolah.nama)
              )
              .forEach((person) => {
                if (person.pemeriksaanSekolah /*&& person.rawatanSekolah[0]*/) {
                  tempKedatanganBaru += 1;
                }
                // if (person.pemeriksaanSekolah && person.rawatanSekolah[0]) {
                //   if (
                //     person.pemeriksaanSekolah.tarikhPemeriksaanSemasa ===
                //     person.rawatanSekolah[0].tarikhRawatanSemasa
                //   ) {
                //     tempKedatanganBaru += 1;
                //   }
                // }
              });
            setKedatanganBaru((current) => [...current, tempKedatanganBaru]);

            // kira kes selesai from statusRawatan === 'selesai'
            let tempKesSelesai = 0;
            data.allPersonSekolahs
              .filter((person) =>
                person.namaSekolah.includes(singleSekolah.nama)
              )
              .forEach((person) => {
                if (person.statusRawatan === 'selesai') {
                  tempKesSelesai += 1;
                }
              });
            setKesSelesai((current) => [...current, tempKesSelesai]);
          });
        setRefreshTimer(!refreshTimer);
        setIsLoading(false);
        // console.log(data);
      } catch (error) {
        console.log(error);
        // toast.error(
        //   'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: user-senarai-sekolah-fetchFasilitiSekolahs'
        // );
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
          loading: 'Sedang menyimpan...',
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
        <div>
          <h1 className='my-3 text-2xl font-bold'>RUMUSAN STATUS SEKOLAH</h1>
          <div className='my-4 flex flex-row justify-between'>
            <select
              className='bg-user3 w-72 text-userWhite rounded-md shadow-md p-2 mr-2'
              onChange={(e) => setSekMenRen(e.target.value)}
            >
              <option value=''>SEMUA SEKOLAH</option>
              <option value='prasekolah'>PRASEKOLAH</option>
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
                <th className='outline outline-1 outline-offset-1 px-2 py-1 w-24'>
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
                {userinfo.role === 'admin' && (
                  <th className='outline outline-1 outline-offset-1 px-2 py-1 w-32'>
                    TUTUP RETEN SEKOLAH
                  </th>
                )}
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
                  {userinfo.role === 'admin' && (
                    <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                    </td>
                  )}
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
                    } else if (sekMenRen === 'prasekolah') {
                      return singleNamaSekolah.jenisFasiliti.includes(
                        'prasekolah'
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
                      <tr>
                        <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                          {index + 1}
                        </td>
                        <td className='outline outline-1 outline-userWhite outline-offset-1 py-1 px-2'>
                          {singleNamaSekolah.nama}
                        </td>
                        <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                          {enrolmen[index]}
                        </td>
                        <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                          {kedatanganBaru[index]}
                        </td>
                        <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                          {kesSelesai[index]}
                        </td>
                        <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                          <span>
                            {percentageCalc(
                              kesSelesai[index],
                              kedatanganBaru[index]
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
                        {userinfo.role === 'admin' && (
                          <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                            <button
                              // disabled={true}
                              onClick={() => {
                                setIdSekolah(singleNamaSekolah._id);
                                setModalSelesaiSekolah(true);
                              }}
                              className={`${
                                singleNamaSekolah.sekolahSelesaiReten
                                  ? 'bg-user7 pointer-events-none'
                                  : 'bg-user3 shadow-md'
                              } text-userWhite px-2 py-1 mx-2 rounded-lg hover:bg-user1 transition-all`}
                            >
                              {singleNamaSekolah.sekolahSelesaiReten
                                ? 'Telah Ditutup'
                                : 'TUTUP'}
                            </button>
                          </td>
                        )}
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
      </div>
    </>
  );
}

export default UserSekolahList;
