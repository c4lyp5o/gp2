import { useEffect, useState } from 'react';
import { Spinner } from 'react-awesome-spinners';
import axios from 'axios';
import moment from 'moment';
import { BsFilePerson, BsFillFilePersonFill } from 'react-icons/bs';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import { useGlobalUserAppContext } from '../context/userAppContext';

export default function DaftarPesakit() {
  const { kaunterToken, statusPesakit, formatTime, noPendaftaranSplitter } =
    useGlobalUserAppContext();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [philter, setPhilter] = useState('');
  const [date, setDate] = useState(new Date());
  const [pilihanTarikh, setPilihanTarikh] = useState(
    moment(new Date()).format('YYYY-MM-DD')
  );

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
        setLoading(true);
        const { data } = await axios.get(`/api/v1/query/kaunter`, {
          headers: { Authorization: `Bearer ${kaunterToken}` },
        });
        setData(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(true);
        setLoading(false);
      }
    };
    fetchPersonUmum();
  }, []);

  if (loading)
    return (
      <div className='mt-20'>
        <Spinner />
      </div>
    );

  if (error) return <p>Error :(</p>;

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
      </div>
      <div>
        <div className='justify-center items-center'>
          <div className='m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max'>
            <table className='table-auto'>
              <thead className='text-userWhite bg-kaunter2'>
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
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-96 max-w-md'>
                    NAMA PESAKIT
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    NO. PENGENALAN DIRI
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    STATUS PESAKIT
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    STATUS PENGISIAN RETEN
                  </th>
                </tr>
              </thead>
              {data.kaunterResultQuery
                .filter((item) => {
                  if (pilihanTarikh === '') return item;
                  if (item.tarikhKedatangan === pilihanTarikh) return item;
                })
                .filter((pt) => pt.nama.includes(philter))
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
