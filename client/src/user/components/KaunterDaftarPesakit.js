import { useEffect, useState } from 'react';
import { Spinner } from 'react-awesome-spinners';
import axios from 'axios';
import moment from 'moment';
import { BsFilePerson, BsFillFilePersonFill } from 'react-icons/bs';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import { useGlobalUserAppContext } from '../context/userAppContext';

export default function DaftarPesakit({ createdByKp }) {
  const {
    kaunterToken,
    statusPesakit,
    formatTime,
    noPendaftaranSplitter,
    toast,
  } = useGlobalUserAppContext();

  const [data, setData] = useState(null);
  const [philter, setPhilter] = useState('');
  const [date, setDate] = useState(new Date());
  const [pilihanTarikh, setPilihanTarikh] = useState(
    moment(new Date()).format('YYYY-MM-DD')
  );
  const [sort, setSort] = useState({
    masaDaftar: false,
    nama: false,
    noPid: false,
    statusReten: false,
  });

  const saveFile = (blob) => {
    const link = document.createElement('a');
    link.download = `PG101-${createdByKp}-${new Date().toDateString()}.xlsx`;
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
          // `/api/v1/generate/download?jenisReten=PG101&sekolah=${pilihanSekolah}&dateToday=${dateToday}&pg101date=${pg101date}&startDate=${startDate}&endDate=${endDate}&formatFile=${formatFile}`,
          `/api/v1/generate/download?jenisReten=PG101&tarikhMula=2022-01-01&tarikhAkhir=2022-12-31&formatFile=xlsx`,
          {
            headers: { Authorization: `Bearer ${kaunterToken}` },
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
      .then((blob) => {
        saveFile(blob.data);
      });
  };

  const CustomDatePicker = () => {
    return (
      <DatePicker
        dateFormat='dd/MM/yyyy'
        selected={date}
        onChange={(date) => {
          const tempDate = moment(date).format('YYYY-MM-DD');
          setDate(date);
          setPilihanTarikh(tempDate);
        }}
        peekNextMonth
        showMonthDropdown
        showYearDropdown
        dropdownMode='select'
        className='appearance-none w-auto text-sm leading-7 px-2 py-1 ring-2 ring-kaunter2 focus:ring-2 focus:ring-kaunter1 focus:outline-none rounded-md shadow-md uppercase flex flex-row ml-2'
      />
    );
  };

  useEffect(() => {
    const fetchPersonUmum = async () => {
      try {
        const { data } = await axios.get(`/api/v1/query/kaunter`, {
          headers: { Authorization: `Bearer ${kaunterToken}` },
        });
        setData(data);
      } catch (error) {
        console.log(error);
        setData([]);
      }
    };
    fetchPersonUmum();
  }, []);

  //carian ic semua
  const keys = ['nama', 'ic', 'statusReten'];

  if (!data) {
    return (
      <div className='mt-20'>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className='flex justify-center'>
        <div className='m-3 xl:w-96 flex flex-row'>
          <label
            htmlFor='pilihanNama'
            className='whitespace-nowrap flex items-center'
          >
            Pilihan Nama :{' '}
          </label>
          <input
            type='search'
            name='pilihanNama'
            className='appearance-none w-auto text-sm leading-7 px-2 py-1 ring-2 ring-kaunter2 focus:ring-2 focus:ring-kaunter1 focus:outline-none rounded-md shadow-md uppercase ml-2'
            id='pilihanNama'
            placeholder='Cari pesakit...'
            onChange={(e) => setPhilter(e.target.value.toLowerCase())}
          />
        </div>
        <div className='m-3 xl:w-96 flex flex-row'>
          <label
            htmlFor='pilihanTarikh'
            className='whitespace-nowrap flex items-center'
          >
            Pilihan Tarikh :{' '}
          </label>
          <CustomDatePicker />
        </div>
        <div className='m-3 xl:w-96 flex flex-row'>
          <button
            type='button'
            className='px-6 py-2.5 m-1 w-52 bg-kaunter3 hover:bg-kaunter2 font-medium text-xs uppercase rounded-md shadow-md transition-all'
            onClick={handleJana}
          >
            Jana Laporan PG101
          </button>
        </div>
      </div>
      <div>
        <div className='justify-center items-center'>
          <div className='m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max p-2'>
            <table className='table-auto'>
              <thead className='text-userWhite bg-kaunter2'>
                <tr>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    BIL
                  </th>
                  <th
                    className={`px-2 py-1 outline outline-1 outline-offset-1 cursor-help ${
                      sort.masaDaftar ? 'text-bold text-kaunterBlack' : ''
                    }`}
                    onClick={() =>
                      setSort({ ...sort, masaDaftar: !sort.masaDaftar })
                    }
                  >
                    MASA DAFTAR
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    NO. PENDAFTARAN
                  </th>
                  <th
                    className={`px-2 py-1 outline outline-1 outline-offset-1 w-96 max-w-md cursor-help ${
                      sort.nama ? 'text-bold text-kaunterBlack' : ''
                    }`}
                    onClick={() => setSort({ ...sort, nama: !sort.nama })}
                  >
                    NAMA PESAKIT
                  </th>
                  <th
                    className={`px-2 py-1 outline outline-1 outline-offset-1 cursor-help ${
                      sort.noPid ? 'text-bold text-kaunterBlack' : ''
                    }`}
                    onClick={() => setSort({ ...sort, noPid: !sort.noPid })}
                  >
                    NO. PENGENALAN DIRI
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    STATUS PESAKIT
                  </th>
                  <th
                    className={`px-2 py-1 outline outline-1 outline-offset-1 cursor-help ${
                      sort.statusReten ? 'text-bold text-kaunterBlack' : ''
                    }`}
                    onClick={() =>
                      setSort({ ...sort, statusReten: !sort.statusReten })
                    }
                  >
                    STATUS PENGISIAN RETEN
                  </th>
                </tr>
              </thead>
              {data.kaunterResultQuery
                .filter((item) => {
                  if (pilihanTarikh === '') return item;
                  if (item.tarikhKedatangan === pilihanTarikh) return item;
                })
                .filter((pt) =>
                  keys.some((key) => pt[key].toLowerCase().includes(philter))
                )
                .sort((a, b) => {
                  if (sort.masaDaftar)
                    return b.waktuSampai.localeCompare(a.waktuSampai);
                })
                .sort((a, b) => {
                  if (sort.nama) return a.nama.localeCompare(b.nama);
                })
                .sort((a, b) => {
                  if (sort.noPid) return a.ic.localeCompare(b.ic);
                })
                .sort((a, b) => {
                  if (sort.statusReten)
                    return a.statusReten.localeCompare(b.statusReten);
                })
                .map((p, index) => (
                  <>
                    <tbody className='bg-kaunter3'>
                      <tr>
                        <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1'>
                          {index + 1}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1'>
                          {formatTime(p.waktuSampai)}
                        </td>
                        {p.noPendaftaranBaru ? (
                          <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1 uppercase'>
                            {noPendaftaranSplitter(p.noPendaftaranBaru)}
                            <BsFilePerson
                              className='text-user7 text-2xl inline-table mx-2 pb-1'
                              title='Baru'
                            />
                          </td>
                        ) : (
                          <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1 uppercase'>
                            {noPendaftaranSplitter(p.noPendaftaranUlangan)}
                            <BsFillFilePersonFill
                              className='text-user9 text-2xl inline-table mx-2 pb-1'
                              title='Ulangan'
                            />
                          </td>
                        )}
                        <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1 uppercase'>
                          {p.nama}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1 uppercase'>
                          {p.ic}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1'>
                          {statusPesakit(p)}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1'>
                          {p.statusReten}
                        </td>
                      </tr>
                    </tbody>
                  </>
                ))}
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
