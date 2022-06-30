import { useState } from 'react';
import axios from 'axios';

export default function UserGenerateKlinik() {
  const [jenisReten, setJenisReten] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [formatFile, setFormatFile] = useState('');

  const saveFile = async (blob) => {
    const link = document.createElement('a');
    link.download = `${jenisReten}.${formatFile}`;
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
    const theBits = await axios.get(
      `/api/v1/generate/testdownload?jenisReten=${jenisReten}&startDate=${startDate}&endDate=${endDate}`,
      {
        responseType: 'blob',
      }
    );
    saveFile(theBits.data);
  };

  return (
    <>
      <div className='display-flex'>
        <form action=''>
          <div className='grid grid-cols-4 grid-flow-col'>
            <strong>Reten: </strong>
            <select
              name='jenisReten'
              id='jenisReten'
              onChange={(e) => setJenisReten(e.target.value)}
            >
              <option selected value='null'>
                Sila pilih reten
              </option>
              <option value='plsSlct'>Sila pilih reten</option>
              <option value='BEGIN'>BEGIN 01/2020</option>
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
              <option value='MGH'>MGH</option>
            </select>
            <strong>Daripada</strong>
            <input
              type='date'
              name='startDate'
              id='startDate'
              onChange={(e) => setStartDate(e.target.value)}
            />
            <strong>Sehingga</strong>
            <input
              type='date'
              name='endDate'
              id='endDate'
              onChange={(e) => setEndDate(e.target.value)}
            />
            <strong>Format: </strong>
            <select
              name='formatFile'
              id='formatFile'
              onChange={(e) => setFormatFile(e.target.value)}
            >
              <option selected value='null'>
                Sila pilih format file
              </option>
              <option value='xlsx'>Excel</option>
              <option value='pdf'>PDF</option>
              <option value='yeezus'>Holy Grail</option>
            </select>
          </div>
          <br />
          <div>
            <button className='capitalize bg-user3 text-userWhite rounded-md shadow-xl p-2 mr-2 hover:bg-user1 transition-all'>
              cetak
            </button>
            <button
              className='capitalize bg-user3 text-userWhite rounded-md shadow-xl p-2 ml-2 hover:bg-user1 transition-all'
              onClick={handleJana}
            >
              jana
            </button>
          </div>
          <div className='p-2 items-center mt-2'>
            <iframe
              className='w-full'
              height='400'
              title='iframe'
              src=''
              frameborder='0'
            ></iframe>
          </div>
        </form>
      </div>
    </>
  );
}
