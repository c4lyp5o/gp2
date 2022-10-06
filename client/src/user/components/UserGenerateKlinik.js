import { useState, useEffect } from 'react';
import axios from 'axios';

import { useGlobalUserAppContext } from '../context/userAppContext';

export default function UserGenerateKlinik() {
  const { userToken, toast, dateToday } = useGlobalUserAppContext();
  const [pg101dates, setPg101dates] = useState([]);
  const [pg101date, setPg101date] = useState('');
  const [jenisReten, setJenisReten] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [formatFile, setFormatFile] = useState('');
  const [pilihanSekolah, setPilihanSekolah] = useState('');
  const [allPersonSekolahs, setAllPersonSekolahs] = useState([]);
  const [namaSekolahs, setNamaSekolahs] = useState([]);
  const [currentKp, setCurrentKp] = useState('');

  useEffect(() => {
    const fetchSekolah = async () => {
      try {
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
      } catch (error) {
        console.log(error);
      }
    };
    const getDatesInPG101 = async () => {
      let theKp = '';
      try {
        await axios
          .get('/api/v1/identity', {
            headers: { Authorization: `Bearer ${userToken}` },
          })
          .then((res) => {
            theKp = res.data.kp;
          });
        const { data } = await axios.get(
          `/api/v1/generate/getdataman?tarikh=${dateToday}&kp=${theKp}`,
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );
        let uniqueDates = [
          ...new Set(data && data.map((item) => item.tarikhKedatangan)),
        ];
        setPg101dates(uniqueDates);
      } catch (error) {
        console.log(error);
      }
    };
    getDatesInPG101();
    fetchSekolah();
  }, []);

  const saveFile = (blob) => {
    const link = document.createElement('a');
    link.download = `${jenisReten}-${currentKp}-${pg101date}.${formatFile}`;
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
          `/api/v1/generate/testdownload?kp=${currentKp}&jenisReten=${jenisReten}&sekolah=${pilihanSekolah}&dateToday=${dateToday}&pg101date=${pg101date}&startDate=${startDate}&endDate=${endDate}&formatFile=${formatFile}`,
          {
            responseType: 'blob',
          }
        ),
        {
          pending: 'Menghasilkan reten...',
          success: 'Reten berjaya dihasilkan',
          error: 'Reten tidak berjaya dihasilkan',
        },
        { autoClose: 2000 }
      )
      .then((theBits) => {
        saveFile(theBits.data);
      });
  };

  return (
    <>
      <div className='p-2'>
        <h1 className='font-bold text-base '>Penjanaan Laporan</h1>
        <form onSubmit={handleJana}>
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-2'>
            <div>
              <strong>Laporan: </strong>
              <select
                required
                name='jenisReten'
                id='jenisReten'
                onChange={(e) => setJenisReten(e.target.value)}
                className='outline outline-1 outline-userBlack'
              >
                <option value=''>Sila pilih reten</option>
                <option value='PG101'>PG101</option>
                {/* <option value='BEGIN'>BEGIN 01/2020</option>
                <option value='PGS203'>PGS203 (Pind. 1/2021)</option>
                <option value='CPPC1'>CPPC 1</option>
                <option value='CPPC2'>CPPC 2</option>
                <option value='PG201A'>PG201A</option>
                <option value='MMI1'>BORANG MMI/1</option>
                <option value='FV'>FV</option>
                <option value='PG201'>PG201</option>
                <option value='PG201SMKP'>PG201 SMKP</option>
                <option value='GIS'>GIS</option>
                <option value='PERSIS1'>PERSiS-1</option>
                <option value='PPIM03'>PPIM 03-2020</option>
                <option value='PPIM04'>PPIM 04</option>
                <option value='PPIM05'>PPIM 05-2020</option>
                <option value='PPKPS'>PPKPS</option>
                <option value='MGH'>MGH</option> */}
              </select>
            </div>
            <div>
              <strong>Sekolah: </strong>
              <select
                value={pilihanSekolah}
                onChange={(e) => {
                  setPilihanSekolah(e.target.value);
                }}
                className='capitalize outline outline-1 outline-userBlack'
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
            <div>
              {/* <strong>Daripada</strong>
              <input
                type='date'
                name='startDate'
                id='startDate'
                onChange={(e) => setStartDate(e.target.value)}
                className='outline outline-1 outline-userBlack'
              />
            </div>
            <div>
              <strong>Sehingga</strong>
              <input
                type='date'
                name='endDate'
                id='endDate'
                onChange={(e) => setEndDate(e.target.value)}
                className='outline outline-1 outline-userBlack'
              /> */}
              <label htmlFor='tarikhPg101' className='font-bold'>
                Sila pilih tarikh
              </label>
              <select
                required
                name='tarikhPg101'
                id='tarikhPg101'
                className='outline outline-1 outline-userBlack w- m-3 text-sm font-m'
                onChange={(e) => {
                  setPg101date(e.target.value);
                }}
              >
                <option value=''>Sila pilih tarikh</option>
                {pg101dates.map((singleDate, index) => {
                  return (
                    <option value={singleDate} key={index}>
                      {singleDate}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div>
            {/* <button className='capitalize bg-user3 text-userWhite rounded-md shadow-xl p-2 mr-2 hover:bg-user1 transition-all'>
              cetak
            </button> */}
            <div className=''>
              <p className='items-center pl-5 font-semibold'>Format : </p>
              <select
                required
                name='formatFile'
                id='formatFile'
                onChange={(e) => setFormatFile(e.target.value)}
                className='outline outline-1 outline-userBlack w- m-3 text-sm font-m'
              >
                <option value=''>Sila pilih format file</option>
                <option value='xlsx'>Excel</option>
                <option value='pdf'>PDF</option>
              </select>
            </div>
            <button
              className='capitalize bg-user3 text-userWhite rounded-md shadow-xl p-2 ml-2 hover:bg-user1 transition-all'
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
