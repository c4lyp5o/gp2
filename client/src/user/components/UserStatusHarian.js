import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import moment from 'moment';
import axios from 'axios';
import { Spinner } from 'react-awesome-spinners';
import {
  BsFillCircleFill,
  BsFillBookmarkXFill,
  BsFillCheckCircleFill,
} from 'react-icons/bs';

import { useGlobalUserAppContext } from '../context/userAppContext';

export default function UserStatusHarian() {
  const {
    userToken,
    reliefUserToken,
    Dictionary,
    dateToday,
    refreshTimer,
    setRefreshTimer,
  } = useGlobalUserAppContext();

  const [pickedDate, setPickedDate] = useState(
    moment(dateToday, moment.ISO_8601).toDate()
  );
  const [mark, setMark] = useState([]);
  const [markSelesai, setMarkSelesai] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tarikhKedatangan, setTarikhKedatangan] = useState(
    moment(dateToday, moment.ISO_8601).toDate()
  );
  const [queryResult, setQueryResult] = useState([]);
  const [pilih, setPilih] = useState('');

  const [reloadState, setReloadState] = useState(false);

  // query umum for the table
  useEffect(() => {
    const query = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `/api/v1/query/umum?tarikhKedatangan=${moment(
            tarikhKedatangan
          ).format('YYYY-MM-DD')}`,
          {
            headers: {
              Authorization: `Bearer ${
                reliefUserToken ? reliefUserToken : userToken
              }`,
            },
          }
        );
        // 👇️ sort by String property ASCENDING (A - Z)
        const desc = data.umumResultQuery.sort((a, b) =>
          a.statusReten > b.statusReten ? 1 : -1
        );
        setQueryResult(desc);
        setRefreshTimer(!refreshTimer);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    query();
  }, [tarikhKedatangan, reloadState, reliefUserToken, userToken]);

  //get allpersonumum filtered by date
  useEffect(() => {
    const fetchAllPersonUmum = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          '/api/v1/umum/status-harian', // 👈️ this is the route
          {
            headers: {
              Authorization: `Bearer ${
                reliefUserToken ? reliefUserToken : userToken
              }`,
            },
          }
        );
        const allPersonUmums = data.allPersonUmumStatus;
        const allPersonBelum = allPersonUmums.filter(
          (p) => p.statusReten === 'belum diisi'
        );
        const tarikhBelum = allPersonBelum.reduce(
          (arrSemuaUmum, umumSingle) => {
            if (!arrSemuaUmum.includes(umumSingle.tarikhKedatangan)) {
              arrSemuaUmum.push(umumSingle.tarikhKedatangan);
            }
            return arrSemuaUmum;
          },
          []
        );
        const allPersonSelesai = allPersonUmums.filter(
          (p) =>
            p.statusReten === 'telah diisi' || p.statusReten === 'reten salah'
        );
        const tarikhSelesai = allPersonSelesai.reduce(
          (arrSemuaUmum, umumSingle) => {
            if (!arrSemuaUmum.includes(umumSingle.tarikhKedatangan)) {
              arrSemuaUmum.push(umumSingle.tarikhKedatangan);
            }
            return arrSemuaUmum;
          },
          []
        );
        setMark(tarikhBelum);
        setMarkSelesai(tarikhSelesai);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPersonUmum();
  }, [reloadState, reliefUserToken, userToken]);

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
      <div className='h-full p-3 lg:p-7 overflow-y-auto'>
        <h1 className='mt-3 text-xl font-semibold'>JUMLAH DATA HARIAN</h1>
        <div className='grid lg:grid-cols-3 mt-3'>
          <div className='grid justify-center text-center auto-rows-min'>
            <Calendar
              onChange={(pickedDate) => {
                setPickedDate(pickedDate);
                setTarikhKedatangan(pickedDate);
              }}
              value={pickedDate}
              tileClassName={({ date }) => {
                if (mark.find((x) => x === moment(date).format('YYYY-MM-DD'))) {
                  return 'hightlight';
                } else if (
                  markSelesai.find(
                    (x) => x === moment(date).format('YYYY-MM-DD')
                  )
                ) {
                  return 'hightlightSiap';
                }
              }}
              className='font-semibold shadow-md m-auto'
              locale='ms-MY'
            />
            <div className='grid grid-cols-[1fr_3fr] my-2'>
              <div className='text-right flex justify-end items-center'>
                <span className='bg-user9 mr-3 h-5 w-5 outline outline-1 outline-userBlack rounded-full'></span>
              </div>
              <p className='text-left text-sm'>perlu dikemaskini</p>
            </div>
            <div className='grid grid-cols-[1fr_3fr] my-2'>
              <div className='text-right flex justify-end items-center'>
                <span className='bg-user8 mr-3 h-5 w-5 outline outline-1 outline-userBlack rounded-full'></span>
              </div>
              <p className='text-left text-sm'>
                <strike>data tiada kerana tidak hadir</strike>
              </p>
            </div>
            <div className='grid grid-cols-[1fr_3fr] my-2'>
              <div className='text-right flex justify-end items-center'>
                <span className='bg-user7 mr-3 h-5 w-5 outline outline-1 outline-userBlack rounded-full'></span>
              </div>
              <p className='text-left text-sm'>Telah Selesai Diisi</p>
            </div>
          </div>
          <div className='lg:col-span-2 overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max'>
            <table className='table-auto'>
              <thead className='text-userWhite bg-user2'>
                <tr>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    BIL.
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    TARIKH KEDATANGAN
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 md:w-screen md:max-w-md lg:w-screen lg:max-w-screen-lg'>
                    NAMA PESAKIT
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    PENGENALAN DIRI
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    JENIS FASILITI
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    OPERATOR
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    CATATAN
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    STATUS PENGISIAN RETEN
                  </th>
                </tr>
              </thead>
              {!isLoading &&
                queryResult.map((singlePersonUmum, index) => {
                  return (
                    <tbody className='bg-user4'>
                      <tr>
                        <td
                          className={`${
                            pilih === singlePersonUmum._id && 'bg-user3'
                          } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                        >
                          {index + 1}
                        </td>
                        <td
                          className={`${
                            pilih === singlePersonUmum._id && 'bg-user3'
                          } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                        >
                          {moment(singlePersonUmum.tarikhKedatangan).format(
                            'DD/MM/YYYY'
                          )}
                        </td>
                        <td
                          className={`${
                            pilih === singlePersonUmum._id && 'bg-user3'
                          } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                        >
                          {singlePersonUmum.nama.toUpperCase()}
                        </td>
                        <td
                          className={`${
                            pilih === singlePersonUmum._id && 'bg-user3'
                          } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1 normal-case`}
                        >
                          {singlePersonUmum.ic}
                        </td>
                        <td
                          className={`${
                            pilih === singlePersonUmum._id && 'bg-user3'
                          } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                        >
                          {Dictionary[singlePersonUmum.jenisFasiliti]}
                        </td>
                        <td
                          className={`${
                            pilih === singlePersonUmum._id && 'bg-user3'
                          } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                        >
                          {singlePersonUmum.createdByUsername === 'kaunter'
                            ? null
                            : singlePersonUmum.createdByUsername}
                        </td>
                        <td
                          className={`${
                            pilih === singlePersonUmum._id && 'bg-user3'
                          } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                        >
                          {singlePersonUmum.catatan}
                        </td>
                        <td
                          className={`${
                            pilih === singlePersonUmum._id && 'bg-user3'
                          } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                        >
                          {singlePersonUmum.statusReten === 'belum diisi' ? (
                            <div className='flex items-center justify-center whitespace-nowrap'>
                              <span>Belum Diisi</span>
                              <BsFillCircleFill className='text-user9 text-lg my-1 ml-2' />
                            </div>
                          ) : singlePersonUmum.statusKehadiran === true &&
                            singlePersonUmum.statusReten === 'reten salah' ? (
                            <div className='flex items-center justify-center whitespace-nowrap'>
                              <span>Terdapat Kesalahan Reten</span>
                              <BsFillBookmarkXFill className='text-user9 text-lg my-1 ml-2' />
                            </div>
                          ) : singlePersonUmum.statusKehadiran === true ? (
                            <div className='flex items-center justify-center whitespace-nowrap'>
                              <strike>data tiada</strike>
                              <BsFillCircleFill className='text-user8 text-lg my-1 ml-2' />{' '}
                            </div>
                          ) : singlePersonUmum.statusReten === 'telah diisi' ? (
                            <div className='flex items-center justify-center whitespace-nowrap'>
                              <span>Selesai Diisi</span>
                              <BsFillCheckCircleFill className='text-user7 text-lg my-1 ml-2 bg-userWhite bg-blend-normal rounded-full outline outline-1 outline-user7' />
                            </div>
                          ) : singlePersonUmum.statusReten === 'reten salah' ? (
                            <div className='flex items-center justify-center whitespace-nowrap'>
                              <span>Terdapat Kesalahan Reten</span>
                              <BsFillBookmarkXFill className='text-user9 text-lg my-1 ml-2' />
                            </div>
                          ) : null}
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
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-24 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-12 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-12 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-12 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-12 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-12 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-12 rounded-xl'></span>
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
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-12 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-12 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-12 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-12 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-12 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-12 rounded-xl'></span>
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
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-12 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-12 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-12 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-12 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-12 rounded-xl'></span>
                    </td>
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-12 rounded-xl'></span>
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
