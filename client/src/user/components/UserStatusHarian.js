import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import moment from 'moment';
import axios from 'axios';

export default function UserStatusHarian() {
  const [pickedDate, setPickedDate] = useState(new Date());
  const [convertedDate, setConvertedDate] = useState('');
  const mark = ['2022-08-02', '2022-08-01'];

  const [tidakHadir, setTidakHadir] = useState(true);

  // convert to standard date format to query to db
  useEffect(() => {
    const dd = String(pickedDate.getDate()).padStart(2, '0');
    const mm = String(pickedDate.getMonth() + 1).padStart(2, '0');
    const yyyy = pickedDate.getFullYear();
    const stringDate = yyyy + '-' + mm + '-' + dd;
    setConvertedDate(stringDate);
  }, [pickedDate]);

  console.log(convertedDate);

  return (
    <>
      <div className='h-full p-3 lg:p-7 overflow-y-auto'>
        <h1 className='mt-3 text-xl font-semibold'>JUMLAH DATA HARIAN</h1>
        <div className='grid lg:grid-cols-3 mt-3'>
          <div className='grid justify-center text-center'>
            <Calendar
              onChange={setPickedDate}
              value={pickedDate}
              tileClassName={({ date }) => {
                if (mark.find((x) => x === moment(date).format('YYYY-MM-DD'))) {
                  return 'text-user6 font-bold';
                }
              }}
              className='font-semibold shadow-lg m-auto'
            />
            <div className='flex my-3 m-auto'>
              <div className='bg-user6 mr-3 h-5 w-5 outline outline-1 outline-userBlack'></div>
              <p className='text-left text-sm'>perlu dikemaskini</p>
            </div>
          </div>
          <div className='lg:col-span-2 lg:m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max'>
            <table className='table-auto'>
              <thead className='text-userWhite bg-user2'>
                <tr>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    BIL.
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    NAMA PESAKIT
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    NAMA PEGAWAI / JP
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    TARIKH LAWATAN TERAKHIR
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    STATUS KEMASKINI RETEN
                  </th>
                </tr>
              </thead>
              <tbody className='bg-user4'>
                <tr>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    1
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    hana damia
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'></td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    2022-07-31
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    <div className='grid my-1'>
                      <p className='leading-3 pt-1'>belum selesai</p>
                      <Link
                        to='/pengguna/landing/umum'
                        className='mt-2 p-1 rounded-md shadow-md bg-user3 transition-all hover:bg-user1 hover:text-userWhite '
                      >
                        KEMASKINI
                      </Link>
                      <div className='mt-2 mb-1 flex justify-center text-center'>
                        <input
                          id='tidak-hadir'
                          type='checkbox'
                          checked={tidakHadir}
                          onChange={() => {
                            setTidakHadir(!tidakHadir);
                          }}
                          className='w-4 h-4 rounded'
                        />
                        <label
                          htmlFor='tidak-hadir'
                          className='ml-1 whitespace-nowrap'
                        >
                          tidak diperiksa
                        </label>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    1
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    mohd solleh bin muhammadlsadkfjlsdf abu samad abu bakar bin
                    ali nama panjang fsalkfjalkfjsdlkfjsldkfjsldkfj
                    lsadkjflsadfjlsfjlskadfjlasdkfj lsadfjksadlfjsdlkfjsdaklfj
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    dr muhammad izyan
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    2022-07-31
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    <div className='grid my-1'>
                      <p className='leading-3 pt-1'>selesai</p>
                      <Link
                        to='/pengguna/landing/umum'
                        className='mt-2 p-1 rounded-md shadow-md bg-user1 transition-all pointer-events-none'
                      >
                        KEMASKINI
                      </Link>
                      <div className='mt-2 mb-1 flex justify-center text-center'>
                        <input
                          id='tidak-hadir'
                          type='checkbox'
                          checked={tidakHadir}
                          onChange={() => {
                            setTidakHadir(!tidakHadir);
                          }}
                          className='w-4 h-4 rounded'
                        />
                        <label
                          htmlFor='tidak-hadir'
                          className='ml-1 whitespace-nowrap'
                        >
                          tidak diperiksa
                        </label>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    1
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    mohd haikal
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'></td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    2022-07-31
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    <div className='grid my-1'>
                      <Link
                        to='/pengguna/landing/umum'
                        className='mt-2 p-1 rounded-md shadow-md bg-user1 transition-all pointer-events-none'
                      >
                        KEMASKINI
                      </Link>
                      <div className='mt-2 mb-1 flex justify-center text-center'>
                        <input
                          id='tidak-hadir'
                          type='checkbox'
                          checked={tidakHadir}
                          onChange={() => {
                            setTidakHadir(!tidakHadir);
                          }}
                          className='w-4 h-4 rounded'
                        />
                        <label
                          htmlFor='tidak-hadir'
                          className='ml-1 whitespace-nowrap'
                        >
                          tidak diperiksa
                        </label>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
