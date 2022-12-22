import { useEffect, useState } from 'react';
import { Spinner } from 'react-awesome-spinners';
import axios from 'axios';
import moment from 'moment';
import { BsFilePerson, BsFillFilePersonFill } from 'react-icons/bs';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import { useGlobalUserAppContext } from '../context/userAppContext';

export default function UserCarian() {
  const { userToken, reliefUserToken, masterDatePicker } =
    useGlobalUserAppContext();

  const [filter, setFilter] = useState('');
  const [tarikhKedatangan, setTarikhKedatangan] = useState('');

  // for datepicker
  const [tarikhKedatanganDP, setTarikhKedatanganDP] = useState();

  const TarikhKedatangan = () => {
    return masterDatePicker({
      selected: tarikhKedatanganDP,
      onChange: (tarikhKedatangan) => {
        const tempDate = moment(tarikhKedatangan).format('YYYY-MM-DD');
        setTarikhKedatangan(tempDate);
        setTarikhKedatanganDP(tarikhKedatangan);
      },
      className:
        'appearance-none w-auto text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md uppercase flex flex-row ml-2',
    });
  };

  return (
    <>
      <div className='text-lg text-user9 font-bold'>DALAM PEMBANGUNAN</div>
      <div className='flex justify-center my-3'>
        <div className='m-3 xl:w-96 flex flex-row'>
          <label
            htmlFor='pilihanNama'
            className='whitespace-nowrap flex items-center'
          >
            Carian Nama :{' '}
          </label>
          <input
            type='search'
            name='pilihanNama'
            className='appearance-none w-auto text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md uppercase ml-2'
            id='pilihanNama'
            placeholder='Cari nama pesakit...'
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
          />
        </div>
        <div className='m-3 xl:w-96 flex flex-row'>
          <label
            htmlFor='pilihanTarikh'
            className='whitespace-nowrap flex items-center'
          >
            Tarikh Kedatangan :{' '}
          </label>
          <TarikhKedatangan />
        </div>
      </div>
      <div>
        <div className='m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max'>
          <table className='table-auto'>
            <thead className='text-userWhite bg-user2'>
              <tr>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  BIL
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  MASA DAFTAR
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  NO. PENDAFTARAN
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1 w-96 max-w-md cursor-help'>
                  NAMA PESAKIT
                </th>
                <th
                  className={`px-2 py-1 outline outline-1 outline-offset-1 cursor-help`}
                >
                  NO. PENGENALAN DIRI
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  STATUS PESAKIT
                </th>
                <th
                  className={`px-2 py-1 outline outline-1 outline-offset-1 cursor-help`}
                >
                  STATUS PENGISIAN RETEN
                </th>
              </tr>
            </thead>
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
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
