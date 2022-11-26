import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaWindowClose } from 'react-icons/fa';
import { FaInfoCircle } from 'react-icons/fa';
import moment from 'moment';

import { useGlobalUserAppContext } from '../../context/userAppContext';

function UserModalPromosi({}) {
  const { userToken, reliefUserToken, masterDatePicker } =
    useGlobalUserAppContext();

  const [namaAcara, setNamaAcara] = useState('');
  const [tarikhMula, setTarikhMula] = useState('');
  const [tarikhAkhir, setTarikhAkhir] = useState('');
  const [lokasi, setLokasi] = useState('');

  // datepicker issues
  const [tarikhMulaDP, setTarikhMulaDP] = useState(null);
  const [tarikhAkhirDP, setTarikhAkhirDP] = useState(null);

  const TarikhMula = () => {
    return masterDatePicker({
      onchange: (tarikhMula) => {
        const tempDate = moment(tarikhMula).format('YYYY-MM-DD');
        setTarikhMula(tempDate);
        setTarikhMulaDP(tarikhMula);
      },
      filterDate: (date) => {
        return moment() > date;
      },
      className:
        'appearance-none w-36 text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md uppercase flex flex-row',
    });
  };

  const TarikhAkhir = () => {
    return masterDatePicker({
      onchange: (tarikhAkhir) => {
        const tempDate = moment(tarikhAkhir).format('YYYY-MM-DD');
        setTarikhAkhir(tempDate);
        setTarikhAkhirDP(tarikhAkhir);
      },
      minDate: new Date(),
      className:
        'appearance-none w-36 text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md uppercase flex flex-row',
    });
  };

  return (
    <>
      <div className='absolute inset-10 lg:inset-16 lg:inset-x-96 2xl:inset-x-[40rem] bg-userWhite z-20 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'>
        <div className='sticky top-0 z-50'>
          <FaWindowClose className='absolute mr-1 mt-1 text-xl text-userBlack right-0 hover:cursor-pointer hover:text-user6 transition-all' />
          <h1 className='bg-user3 text-userWhite font-semibold text-xl'>
            tambah acara
          </h1>
        </div>
        <form>
          <div className='grid'>
            <div>
              <label htmlFor='nama-acara'>nama acara</label>
              <input
                type='text'
                id='nama-acara'
                name='nama-acara'
                className='outline outline-1'
              />
            </div>
            <div>
              <label htmlFor='tarikh-mula'>tarikh mula</label>
              <input type='text' />
            </div>
          </div>
        </form>
      </div>
      <div className='absolute inset-0 bg-user1 z-10 opacity-75' />
    </>
  );
}

export default UserModalPromosi;
