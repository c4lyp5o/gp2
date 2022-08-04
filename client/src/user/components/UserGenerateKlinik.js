import { useState, useEffect } from 'react';
import axios from 'axios';

import { useGlobalUserAppContext } from '../context/userAppContext';

export default function UserGenerateKlinik() {
  const { userToken } = useGlobalUserAppContext();
  const [jenisReten, setJenisReten] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [formatFile, setFormatFile] = useState('');
  const [pilihanSekolah, setPilihanSekolah] = useState('');
  // const [isLoading, setIsLoading] = useState(false);
  // const [pilihanSekolah, setPilihanSekolah] = useState([]);
  const [allPersonSekolahs, setAllPersonSekolahs] = useState([]);
  const [namaSekolahs, setNamaSekolahs] = useState([]);
  const [currentKp, setCurrentKp] = useState('');

  useEffect(() => {
    const fetchSekolah = async () => {
      try {
        // setIsLoading(true);
        const { data } = await axios.get('/api/v1/sekolah/populate', {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        axios
          .get('/api/v1/identity', {
            headers: { Authorization: `Bearer ${userToken}` },
          })
          .then((res) => {
            setCurrentKp(res.data.kp);
          });
        const allPersonSekolahs = data.allPersonSekolahs;
        const namaSekolahs = allPersonSekolahs.reduce(
          (arrNamaSekolahs, singlePersonSekolah) => {
            if (!arrNamaSekolahs.includes(singlePersonSekolah.namaSekolah)) {
              arrNamaSekolahs.push(singlePersonSekolah.namaSekolah);
            }
            return arrNamaSekolahs.filter((valid) => valid);
          },
          ['']
        );
        setAllPersonSekolahs(data.allPersonSekolahs);
        setNamaSekolahs(namaSekolahs);
        // setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSekolah();
  }, []);

  const saveFile = (blob) => {
    const link = document.createElement('a');
    link.download = `${jenisReten}-${currentKp}-${pilihanSekolah}.xlsx`;
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
    try {
      const theBits = await axios.get(
        `/api/v1/generate/testdownload?kp=${currentKp}&jenisReten=${jenisReten}&sekolah=${pilihanSekolah}&startDate=${startDate}&endDate=${endDate}`,
        {
          responseType: 'blob',
        }
      );
      saveFile(theBits.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <>
      <div className='p-2'>
        <h1 className='font-bold text-base '>Generate Reten</h1>
        <form onSubmit={handleJana}>
          <div className='grid grid-cols-4 gap-3'>
            <div className='flex flex-row'>
              <p className='flex items-center flex-row pl-5 font-semibold'>
                reten :{' '}
              </p>
              <select
                required
                name='jenisReten'
                id='jenisReten'
                onChange={(e) => setJenisReten(e.target.value)}
                className='outline outline-1 outline-userBlack w-32 m-3 text-sm font-m'
              >
                <option value=''>Sila pilih reten</option>
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
            </div>
            <div className='flex flex-row'>
              <p className='flex items-center flex-row pl-5 font-semibold'>
                Sekolah :{' '}
              </p>
              <select
                value={pilihanSekolah}
                onChange={(e) => {
                  setPilihanSekolah(e.target.value);
                }}
                className='outline outline-1 outline-userBlack w-32 m-3 text-sm font-m'
              >
                <option value=''>Sila pilih..</option>
                {namaSekolahs.map((singleNamaSekolah, index) => {
                  return (
                    <option
                      value={singleNamaSekolah}
                      key={index}
                      className='capitalize'
                    >
                      {singleNamaSekolah}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className='flex flex-row'>
              <p className='flex items-center flex-row pl-5 font-semibold'>
                Daripada :{' '}
              </p>
              <input
                type='date'
                name='startDate'
                id='startDate'
                onChange={(e) => setStartDate(e.target.value)}
                className='outline outline-1 outline-userBlack w-32 m-3 text-sm font-m'
              />
            </div>
            <div className='flex flex-row'>
              <p className='flex items-center flex-row pl-5 font-semibold'>
                Sehingga :{' '}
              </p>
              <input
                type='date'
                name='endDate'
                id='endDate'
                onChange={(e) => setEndDate(e.target.value)}
                className='outline outline-1 outline-userBlack w-32 m-3 text-sm font-m'
              />
            </div>
            <div className='col-span-4'>
              {/* <button className='capitalize bg-user3 text-userWhite rounded-md shadow-xl p-2 mr-2 hover:bg-user1 transition-all'>
              cetak
            </button> */}
              <div className=''>
                <p className='items-center pl-5 font-semibold'>Format : </p>
                <select
                  name='formatFile'
                  id='formatFile'
                  onChange={(e) => setFormatFile(e.target.value)}
                  className='outline outline-1 outline-userBlack w- m-3 text-sm font-m'
                >
                  <option value=''>Sila pilih format file</option>
                  <option value='xlsx'>Excel</option>
                  <option value='pdf'>PDF</option>
                  <option value='yeezus'>Holy Grail</option>
                </select>
              </div>
              <button
                className='capitalize bg-user3 text-userWhite rounded-md shadow-xl p-2 ml-2 hover:bg-user1 transition-all'
                type='submit'
              >
                jana
              </button>
            </div>
          </div>

          <div className='p-2 items-center mt-2'>
            <iframe
              className='w-full'
              height='400'
              title='iframe'
              src=''
              frameBorder='0'
            ></iframe>
          </div>
        </form>
      </div>
    </>
  );
}
