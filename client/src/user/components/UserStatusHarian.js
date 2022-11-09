import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import moment from 'moment';
import axios from 'axios';
import { Spinner } from 'react-awesome-spinners';
import { BsFillCircleFill, BsFillCheckCircleFill } from 'react-icons/bs';

import { useGlobalUserAppContext } from '../context/userAppContext';

export default function UserStatusHarian() {
  const {
    userToken,
    reliefUserToken,
    Dictionary,
    dateToday,
    toast,
    refreshTimer,
    setRefreshTimer,
  } = useGlobalUserAppContext();

  const [status, setStatus] = useState('pengguna');
  const [pickedDate, setPickedDate] = useState(new Date());
  const [convertedDate, setConvertedDate] = useState('');
  const [mark, setMark] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nama, setNama] = useState('');
  const [tarikhKedatangan, setTarikhKedatangan] = useState(new Date(dateToday));
  const [queryResult, setQueryResult] = useState([]);
  const [pilih, setPilih] = useState('');

  const [reloadState, setReloadState] = useState(false);

  // convert to standard date format to query to db
  useEffect(() => {
    const dd = String(pickedDate.getDate()).padStart(2, '0');
    const mm = String(pickedDate.getMonth() + 1).padStart(2, '0');
    const yyyy = pickedDate.getFullYear();
    const stringDate = yyyy + '-' + mm + '-' + dd;
    setConvertedDate(stringDate);
  }, [pickedDate]);

  useEffect(() => {
    const query = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `/api/v1/query/umum?nama=${nama}&tarikhKedatangan=${moment(
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
        const userData = JSON.parse(localStorage.getItem('userinfo'));
        setStatus(userData.role);
        // 👇️ sort by String property ASCENDING (A - Z)
        const desc = data.umumResultQuery.sort((a, b) =>
          a.statusReten > b.statusReten ? 1 : -1
        );
        setQueryResult(desc);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    query();
  }, [nama, tarikhKedatangan, reloadState]);

  //get allpersonumum filtered by date
  useEffect(() => {
    const fetchAllPersonUmum = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          '/api/v1/umum', // 👈️ this is the route
          {
            headers: {
              Authorization: `Bearer ${
                reliefUserToken ? reliefUserToken : userToken
              }`,
            },
          }
        );
        const allPersonUmums = data.allPersonUmum;
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
        setMark(tarikhBelum);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPersonUmum();
  }, [reloadState]);

  // on tab focus reload data
  useEffect(() => {
    window.addEventListener('focus', setReloadState);
    setReloadState(!reloadState);
    setRefreshTimer(!refreshTimer);
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
                  return 'text-user9 font-bold bg-user5';
                }
              }}
              className='font-semibold shadow-md m-auto'
            />
            <div className='flex my-3 py-3 justify-center items-start'>
              <div className='bg-user9 mr-3 h-5 w-5 outline outline-1 outline-userBlack rounded-full'></div>
              <p className='text-left text-sm'>perlu dikemaskini</p>
            </div>
            <div className='flex my-3 py-3 justify-center items-start'>
              <div className='bg-user8 mr-3 h-5 w-5 outline outline-1 outline-userBlack rounded-full'></div>
              <p className='text-left text-sm'>
                <strike>data tiada kerana tidak hadir</strike>
              </p>
            </div>
          </div>
          <div className='lg:col-span-2 lg:m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max'>
            <table className='table-auto'>
              <thead className='text-userWhite bg-user2'>
                <tr>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    BIL.
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 md:w-screen md:max-w-md lg:w-screen lg:max-w-screen-lg'>
                    NAMA PESAKIT
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    KAD PENGENALAN
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    JENIS FASILITI
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    STATUS KEMASKINI RETEN
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
                          {singlePersonUmum.nama.toUpperCase()}
                        </td>
                        <td
                          className={`${
                            pilih === singlePersonUmum._id && 'bg-user3'
                          } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                        >
                          {singlePersonUmum.ic.toUpperCase()}
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
                          {singlePersonUmum.statusReten === 'belum diisi' ? (
                            <div className='flex items-center justify-center whitespace-nowrap'>
                              <span>Belum Diisi</span>
                              <BsFillCircleFill className='text-user9 text-lg my-1 ml-2' />
                            </div>
                          ) : singlePersonUmum.statusKehadiran === true ? (
                            <div className='flex items-center justify-center whitespace-nowrap'>
                              <strike>data tiada</strike>
                              <BsFillCircleFill className='text-user8 text-lg my-1 ml-2' />{' '}
                            </div>
                          ) : (
                            <div className='flex items-center justify-center whitespace-nowrap'>
                              <span>Selesai Diisi</span>
                              <BsFillCheckCircleFill className='text-user7 text-lg my-1 ml-2 bg-userWhite bg-blend-normal rounded-full outline outline-1 outline-user7' />
                            </div>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  );
                })}
              {isLoading && (
                <p className='text-xl font-semibold flex justify-center items-center p-4 lg:col-span-2 lg:m-auto'>
                  <Spinner color='#1f315f' />
                </p>
              )}
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
