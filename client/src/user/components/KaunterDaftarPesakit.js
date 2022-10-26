import { useEffect, useState } from 'react';
import { Spinner } from 'react-awesome-spinners';
import axios from 'axios';
import moment from 'moment';
import { BsFilePerson, BsFillFilePersonFill } from 'react-icons/bs';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import { useGlobalUserAppContext } from '../context/userAppContext';

export default function DaftarPesakit({ createdByKp, createdByDaerah }) {
  const { Dictionary, dateToday, kaunterToken, toast } =
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

  function statusPesakit(p) {
    let status = '';
    if (p.umur < 5) {
      status = 'TOD';
    }
    if (p.umur > 4) {
      status = 'UMUM';
    }
    if (p.umur > 59) {
      status = 'WE';
    }
    if (p.bersekolah === true) {
      status = 'SEK';
    }
    if (p.ibuMengandung === true) {
      status += '/';
      status += 'IM';
    }
    if (p.oku === true) {
      status += '/';
      status += 'OKU';
    }
    if (p.statusPesara) {
      status += '/';
      status += 'PES';
    }
    return status;
  }

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
        <div className='m-3 xl:w-96'>
          <label htmlFor='pilihanNama'>Pilihan Nama </label>
          <input
            type='search'
            name='pilihanNama'
            className='outline outline-1 outline-userBlack rounded-md p-3'
            id='pilihanNama'
            placeholder='Cari pesakit...'
            onChange={(e) => setPhilter(e.target.value.toLowerCase())}
          />
        </div>
        <div className='m-3 xl:w-96'>
          <label htmlFor='pilihanTarikh'>Pilihan Tarikh </label>
          {/* <input
            required
            value={pilihanTarikh}
            onChange={(e) => {
              console.log(e.target.value);
              setPilihanTarikh(e.target.value);
            }}
            type='date'
            name='tarikhKedatangan'
            className='appearance-none w-36 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md'
          /> */}
          <CustomDatePicker />
        </div>
      </div>
      <div>
        <div className='justify-center items-center'>
          <div className='m-auto overflow-x-auto text-sm rounded-md h-min max-w-max'>
            <table className='m-auto mb-5 w-full outline outline-1 outline-kaunterBlack'>
              <tbody>
                <tr className='bg-kaunter3 p-2'>
                  <th className='outline outline-1 outline-kaunterBlack px-2'>
                    BIL
                  </th>
                  <th className='outline outline-1 outline-kaunterBlack whitespace-nowrap px-2'>
                    MASA PENDAFTARAN
                  </th>
                  <th className='outline outline-1 outline-kaunterBlack whitespace-nowrap px-2'>
                    NO. PENDAFTARAN
                  </th>
                  <th className='outline outline-1 outline-kaunterBlack px-2'>
                    NAMA
                  </th>
                  <th className='outline outline-1 outline-kaunterBlack px-2'>
                    NO. PENGENALAN DIRI
                  </th>
                  <th className='outline outline-1 outline-kaunterBlack px-2'>
                    STATUS PESAKIT
                  </th>
                  <th className='outline outline-1 outline-kaunterBlack px-2'>
                    STATUS PENGISIAN RETEN
                  </th>
                </tr>
                {data.kaunterResultQuery
                  .filter((item) => {
                    if (pilihanTarikh === '') return item;
                    if (item.tarikhKedatangan === pilihanTarikh) return item;
                  })
                  .filter((pt) => pt.nama.includes(philter))
                  .map((p, index) => (
                    <>
                      <tr>
                        <td className='outline outline-1 outline-kaunterBlack'>
                          {index + 1}
                        </td>
                        <td className='outline outline-1 outline-kaunterBlack'>
                          {moment(p.waktuSampai, 'HH:mm').format('h:mm A')}
                        </td>
                        {p.noPendaftaranBaru ? (
                          <td className='outline outline-1 outline-kaunterBlack lowercase whitespace-nowrap'>
                            {p.noPendaftaranBaru}
                            <BsFilePerson
                              className='text-user7 text-2xl inline-table mx-2 pb-1'
                              title='baru'
                            />
                          </td>
                        ) : (
                          <td className='outline outline-1 outline-kaunterBlack lowercase whitespace-nowrap'>
                            {p.noPendaftaranUlangan}
                            <BsFillFilePersonFill
                              className='text-user9 text-2xl inline-table mx-2 pb-1'
                              title='ulangan'
                            />
                          </td>
                        )}
                        <td className='outline outline-1 outline-kaunterBlack'>
                          {p.nama.toUpperCase()}
                        </td>
                        <td className='outline outline-1 outline-kaunterBlack'>
                          {p.ic.toUpperCase()}
                        </td>
                        <td className='outline outline-1 outline-kaunterBlack'>
                          {statusPesakit(p)}
                        </td>
                        <td className='outline outline-1 outline-kaunterBlack'>
                          {p.statusReten}
                        </td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
