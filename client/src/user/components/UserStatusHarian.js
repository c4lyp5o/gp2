import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import moment from 'moment';
import axios from 'axios';

export default function UserStatusHarian() {
  const [pickedDate, setPickedDate] = useState(new Date());
  const [convertedDate, setConvertedDate] = useState('');
  const mark = ['2022-07-28', '2022-07-27', '2022-07-25'];

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
      <div className='h-full p-3 overflow-y-auto'>
        <h1 className='mt-3 text-xl font-semibold'>JUMLAH DATA HARIAN</h1>
        <div className='grid grid-cols-3 mt-5'>
          <div className='grid justify-center text-center'>
            <Calendar
              onChange={setPickedDate}
              value={pickedDate}
              tileClassName={({ date }) => {
                if (mark.find((x) => x === moment(date).format('YYYY-MM-DD'))) {
                  return 'text-user6 font-bold';
                }
              }}
              className='font-semibold shadow-lg'
            />
            <div className='flex mt-3'>
              <div className='bg-user6 ml-3 mr-3 h-5 w-5 outline outline-1 outline-userBlack'></div>
              <p className='text-left text-sm'>perlu dikemaskini</p>
            </div>
          </div>
          <div className='col-span-2'>
            <table className='m-auto mb-3 w-11/12 outline outline-1 outline-userBlack'>
              <tr className='bg-user2 text-userWhite'>
                <th className='outline outline-1 outline-userBlack p-2'>
                  nama pesakit
                </th>
                <th className='outline outline-1 outline-userBlack p-2'>
                  nama pegawai / JP
                </th>
                <th className='outline outline-1 outline-userBlack p-2'>
                  tarikh lawatan terakhir
                </th>
                <th className='outline outline-1 outline-userBlack p-2'>
                  status kemaskini reten
                </th>
              </tr>
              <tr>
                <td className='outline outline-1 outline-userBlack p-2'>
                  hana damia
                </td>
                <td className='outline outline-1 outline-userBlack p-2'>
                  dr low
                </td>
                <td className='outline outline-1 outline-userBlack p-2'>
                  2022-07-31
                </td>
                <td className='outline outline-1 outline-userBlack p-2'>
                  belum selesai
                  <Link
                    to='/user/umum'
                    className='m-2 p-2 capitalize bg-user3 hover:bg-user1 hover:text-userWhite transition-all'
                  >
                    kemaskini
                  </Link>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
