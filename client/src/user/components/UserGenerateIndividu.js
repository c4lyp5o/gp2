import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

import { useGlobalUserAppContext } from '../context/userAppContext';

export default function UserGenerateIndividu() {
  const {
    userToken,
    toast,
    catchAxiosErrorAndLogout,
    navigate,
    masterDatePicker,
  } = useGlobalUserAppContext();
  const [jenisReten, setJenisReten] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [formatFile, setFormatFile] = useState('');
  const [month, setMonth] = useState('');
  const [status, setStatus] = useState('');
  const [nama, setNama] = useState('');
  const [kp, setKp] = useState('');
  const [id, setId] = useState('');

  //datepicker range
  const [startDatePicker, setStartDatePicker] = useState(null);
  const [endDatePicker, setEndDatePicker] = useState(null);

  const TarikhAwal = () => {
    return masterDatePicker({
      selectsStart: startDatePicker,
      startDate: startDatePicker,
      endDate: endDatePicker,
      selected: startDatePicker,
      onChange: (startDate) => {
        setStartDatePicker(startDate);
        setStartDate(moment(startDate).format('YYYY-MM-DD'));
      },
      filterDate: (date) => {
        return moment() > date;
      },
      className:
        'appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent',
    });
  };

  const TarikhAkhir = () => {
    return masterDatePicker({
      selectsEnd: endDatePicker,
      startDate: startDatePicker,
      endDate: endDatePicker,
      selected: endDatePicker,
      minDate: startDatePicker,
      onChange: (endDate) => {
        setEndDatePicker(endDate);
        setEndDate(moment(endDate).format('YYYY-MM-DD'));
      },
      filterDate: (date) => {
        return moment() > date;
      },
      className:
        'appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent',
    });
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userinfo'));
    if (!userData) {
      catchAxiosErrorAndLogout();
      navigate('/pengguna');
    }
    setNama(userData.nama);
    setStatus(userData.statusPegawai);
    setKp(userData.kpSkrg);
    if (userData.numberMdc) {
      setId(userData.numberMdc);
    }
    if (!userData.numberMdc) {
      setId(userData.numberMdtb);
    }
  }, []);

  const saveFile = (blob) => {
    const link = document.createElement('a');
    link.download = `${jenisReten}-${kp}-${nama}-Bulan_${
      month.split('-')[0]
    }.${formatFile}`;
    link.href = URL.createObjectURL(new Blob([blob]));
    link.addEventListener('click', (e) => {
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
      }, 100);
    });
    link.click();
  };

  const handleJana = async (e) => {
    e.preventDefault();
    await toast
      .promise(
        axios.get(
          `/api/v1/generate/download?jenisReten=${jenisReten}&tarikhMula=${startDate}&tarikhAkhir=${endDate}&bulan=${new Date().getFullYear()}-${month}&formatFile=${formatFile}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              pegawai: nama,
              id: id,
            },
            responseType: 'blob',
          }
        ),
        {
          pending: 'Menghasilkan reten...',
          success: 'Reten berjaya dihasilkan',
          error: 'Tiada data bagi tarikh yang dipilih',
        },
        { autoClose: 2000 }
      )
      .then((blob) => {
        saveFile(blob.data);
      });
  };

  return (
    <>
      <div className='p-2'>
        <h1 className='font-bold text-lg text-user1 '>Penjanaan Laporan</h1>
        <form onSubmit={handleJana}>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-2'>
            <div className='px-3 py-1'>
              <label
                htmlFor='jenisReten'
                className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
              >
                Laporan:
              </label>
              <select
                required
                name='jenisReten'
                id='jenisReten'
                onChange={(e) => setJenisReten(e.target.value)}
                className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
              >
                <option value=''>Sila pilih reten</option>
                {status === 'jp' && <option value='PG206'>PG206</option>}
                {status === 'pp' && <option value='PG207'>PG207</option>}
                {/* <option value='BEGIN'>BEGIN 01/2020</option>
                <option value='PGS203'>PGS203 (Pind. 1/2021)</option>
                <option value='CPPC1'>CPPC 1</option>
                <option value='CPPC2'>CPPC 2</option>
                <option value='PG201A'>PG201A</option>
                <option value='MMI1'>BORANG MMI/1</option>
                <option value='FV'>FV</option>
                <option value='PG201'>PG201</option>
                <option value='GIS'>GIS</option>
                <option value='PERSIS1'>PERSiS-1</option>
                <option value='PPIM03'>PPIM 03-2020</option>
                <option value='PPIM04'>PPIM 04</option>
                <option value='PPIM05'>PPIM 05-2020</option>
                <option value='PPKPS'>PPKPS</option>
                <option value='MGH'>MGH</option> */}
              </select>
            </div>
            {/* <div className='px-3 py-1'>
              <label
                htmlFor='startDate'
                className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
              >
                Daripada
              </label>
              <input
                type='date'
                name='startDate'
                id='startDate'
                onChange={(e) => setStartDate(e.target.value)}
                className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
              />
            </div>
            <div className='px-3 py-1'>
              <label
                htmlFor='endDate'
                className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
              >
                Sehingga
              </label>
              <input
                type='date'
                name='endDate'
                id='endDate'
                onChange={(e) => setEndDate(e.target.value)}
                className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
              />
            </div> */}
            {(jenisReten === 'PG206' || jenisReten === 'PG207') && (
              <div className='px-3 py-1'>
                <label
                  htmlFor='bulanpg207207'
                  className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                >
                  Sila pilih bulan
                </label>
                <select
                  required
                  name='bulanpg207207'
                  id='bulanpg207207'
                  className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  onChange={(e) => {
                    setMonth(e.target.value);
                  }}
                >
                  <option value=''>Sila pilih bulan</option>
                  <option value='01-01'>Januari</option>
                  <option value='02-01'>Februari</option>
                  <option value='03-01'>Mac</option>
                  <option value='04-01'>April</option>
                  <option value='05-01'>Mei</option>
                  <option value='06-01'>Jun</option>
                  <option value='07-01'>Julai</option>
                  <option value='08-01'>Ogos</option>
                  <option value='09-01'>September</option>
                  <option value='10-01'>Oktober</option>
                  <option value='11-01'>November</option>
                  <option value='12-01'>Disember</option>
                </select>
              </div>
            )}
          </div>
          <div className='grid grid-cols-3 '>
            {/* <button className='capitalize bg-user3 text-userWhite rounded-md shadow-xl p-2 mr-2 hover:bg-user1 transition-all'>
              cetak
            </button> */}
            <div className='px-3 py-1 col-start-2'>
              <label
                htmlFor='formatFile'
                className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
              >
                Format:
              </label>
              <select
                required
                name='formatFile'
                id='formatFile'
                onChange={(e) => setFormatFile(e.target.value)}
                className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
              >
                <option value=''>Sila pilih format file</option>
                <option value='xlsx'>Excel</option>
                {/* <option value='pdf'>PDF</option> */}
              </select>
            </div>
            <button
              className='capitalize bg-user3 text-userWhite rounded-md shadow-xl px-3 py-2 mx-3 my-2 hover:bg-user1 transition-all col-start-2'
              type='submit'
            >
              jana
            </button>
          </div>
          {/* <div className='p-2 items-center mt-2'>
            <iframe
              className='w-full'
              height='400'
              title='iframe'
              src=''
              frameBorder='0'
            ></iframe>
          </div> */}
        </form>
      </div>
    </>
  );
}
