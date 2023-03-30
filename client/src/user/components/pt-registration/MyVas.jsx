import { useState } from 'react';
import axios from 'axios';
import { FaWindowClose } from 'react-icons/fa';

import { useGlobalUserAppContext } from '../../context/userAppContext';

export default function MyVas({ setShowMyVas }) {
  const { userToken, userinfo, reliefUserToken, toast } =
    useGlobalUserAppContext();

  const handleSubmit = (e) => {
    e.preventDefalt();
    console.log('submit');
  };

  return (
    <>
      <div className='absolute inset-x-1 inset-y-1 bg-userWhite z-20 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'>
        <FaWindowClose
          className='absolute top-0.5 right-2 text-xl cursor-pointer text-userWhite hover:text-kaunter3'
          onClick={() => setShowMyVas(false)}
        />
        <div className='h-7 bg-user1 flex justify-center items-center text-userWhite normal-case font-semibold text-lg'>
          <img
            src='https://upload.wikimedia.org/wikipedia/commons/9/90/MySejahtera.png'
            alt='MySejahtera Logo'
            className='w-6 h-6 inline-block m-1'
          />{' '}
          MyVas
        </div>
        <h1 className='my-2 text-lg font-bold'>Janji Temu</h1>
        <div className='flex m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max mt-2'>
          <table className='table-auto'>
            <thead className='text-userWhite bg-kaunter2'>
              <tr>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  BIL
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  NAMA
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  KAD PENGENALAN
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  NO. TELEFON
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  WAKTU JANJI TEMU
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  STATUS KEHADIRAN
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  PILIHAN
                </th>
              </tr>
            </thead>
            <tbody className='bg-kaunter3'>
              <tr>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  1
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  ABDUL RAHMAN BIN ABDUL RAZAK
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  900101-01-5555
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  012-3456789
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  12:00 PM
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  HADIR
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  <span className='bg-user1 text-userWhite px-2 py-1 rounded-md'>
                    PILIH
                  </span>
                </td>
              </tr>
              <tr>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  2
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  ABDUL RAHMAN BIN ABDUL RAZAK
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  900101-01-5555
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  012-3456789
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  12:00 PM
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  HADIR
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  <span className='bg-user1 text-userWhite px-2 py-1 rounded-md'>
                    PILIH
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <h1 className='my-2 text-lg font-bold'>
          <i>Walk In</i>
        </h1>
        <div className='flex m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max mt-2'>
          <table className='table-auto'>
            <thead className='text-userWhite bg-kaunter2'>
              <tr>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  BIL
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  NAMA
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  KAD PENGENALAN
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  NO. TELEFON
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  STATUS KEHADIRAN
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody className='bg-kaunter3'>
              <tr>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  1
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  ABDUL RAHMAN BIN ABDUL RAZAK
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  900101-01-5555
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  012-3456789
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  HADIR
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  <span className='bg-user1 text-userWhite px-2 py-1 rounded-md'>
                    PILIH
                  </span>
                </td>
              </tr>
              <tr>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  2
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  ABDUL RAHMAN BIN ABDUL RAZAK
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  900101-01-5555
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  012-3456789
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  HADIR
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  <span className='bg-user1 text-userWhite px-2 py-1 rounded-md'>
                    PILIH
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div
        onClick={() => setShowMyVas(false)}
        className='fixed inset-0 bg-black z-10'
      />
    </>
  );
}
