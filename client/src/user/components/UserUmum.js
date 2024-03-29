import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Spinner } from 'react-awesome-spinners';

import { useGlobalUserAppContext } from '../context/userAppContext';

function UserUmum() {
  const { userToken, Dictionary, dateToday } = useGlobalUserAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [nama, setNama] = useState('');
  const [tarikhKedatangan, setTarikhKedatangan] = useState(dateToday);
  const [jenisFasiliti, setJenisFasiliti] = useState('kp');
  const [queryResult, setQueryResult] = useState([]);
  const [pilih, setPilih] = useState('');
  const [resultPilih, setResultPilih] = useState([]);

  useEffect(() => {
    const query = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `/api/v1/query/umum?nama=${nama}&tarikhKedatangan=${tarikhKedatangan}&jenisFasiliti=${jenisFasiliti}`,
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
        setQueryResult(data.umumResultQuery);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    query();
  }, [nama, tarikhKedatangan, jenisFasiliti]);

  useEffect(() => {
    const resultFilter = queryResult.filter((singlePersonUmum) => {
      return singlePersonUmum._id === pilih;
    });
    setResultPilih(resultFilter);
  }, [pilih]);

  return (
    <>
      <div className='px-3 lg:px-10 h-full p-3 overflow-y-auto'>
        <form className='text-left grid grid-cols-2'>
          <h2 className='text-xl font-semibold flex flex-row p-2 col-span-2'>
            CARIAN
          </h2>
          <label
            htmlFor='nama-pesakit'
            className='flex flex-row p-2 col-span-2'
          >
            nama pesakit
          </label>
          <input
            onChange={(e) => {
              setNama(e.target.value);
            }}
            value={nama}
            type='text'
            name='nama-pesakit'
            id='nama-pesakit'
            className='appearance-none leading-7 px-3 py-1 ring-2 w-full focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md col-span-2 mb-2'
          />
          <div className='m-2 col-span-2 lg:col-span-1'>
            <label htmlFor='kad-pengenalan'>tarikh kedatangan :</label>
            <input
              onChange={(e) => {
                setTarikhKedatangan(e.target.value);
              }}
              value={tarikhKedatangan}
              type='date'
              name='tarikh-kedatangan'
              id='tarikh-kedatangan'
              className='outline outline-1 outline-user1 ml-3'
            />
          </div>
          <div className='m-2 col-span-2 lg:col-span-1'>
            <label className='' htmlFor='jenis-fasiliti'>
              pilih jenis fasiliti:
            </label>
            <select
              name='jenis-fasiliti'
              id='jenis-fasiliti'
              value={jenisFasiliti}
              onChange={(e) => {
                setJenisFasiliti(e.target.value);
              }}
              className='ml-3'
            >
              <option value='kp'>Klinik Pergigian</option>
              <option value='kk-kd'>Klinik kesihatan / Klinik desa</option>
              <option value='taska-tadika'>Taska / Tadika</option>
              <option value='ipt-kolej'>IPT / KOLEJ</option>
              <option value='orang-asli'>Orang asli</option>
              <option value='ppr'>PPR</option>
              <option value='institusi-warga-emas'>Institusi warga emas</option>
              <option value='institusi-oku'>Institusi OKU</option>
              <option value='kampung-angkat'>Kampung angkat</option>
              <option value='projek-komuniti-lain'>Projek komuniti lain</option>
              {/* <option value='rtc-kelantan'>RTC (Kelantan sahaja)</option> */}
            </select>
          </div>
        </form>
        <section className='my-5 p-1 outline outline-1 outline-user1'>
          <h2 className='text-xl font-semibold flex flex-row pl-12 p-2'>
            SENARAI CARIAN
          </h2>
          <div className='m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max'>
            <table className='table-auto'>
              <thead className='text-userWhite bg-user2'>
                <tr>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    BIL
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    NAMA PESAKIT
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    JENIS FASILITI
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    KAD PENGENALAN
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    TARIKH LAWATAN TERAKHIR
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    AKTIFKAN
                  </th>
                </tr>
              </thead>
              {!isLoading &&
                queryResult.map((singlePersonUmum, index) => {
                  return (
                    <tbody className='bg-user4'>
                      <tr>
                        <td
                          className={`${
                            pilih === singlePersonUmum._id && 'bg-user3'
                          } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                        >
                          {index + 1}
                        </td>
                        <td
                          className={`${
                            pilih === singlePersonUmum._id && 'bg-user3'
                          } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                        >
                          {singlePersonUmum.nama}
                        </td>
                        <td
                          className={`${
                            pilih === singlePersonUmum._id && 'bg-user3'
                          } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                        >
                          {Dictionary[singlePersonUmum.jenisFasiliti]}
                        </td>
                        <td
                          className={`${
                            pilih === singlePersonUmum._id && 'bg-user3'
                          } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                        >
                          {singlePersonUmum.ic}
                        </td>
                        <td
                          className={`${
                            pilih === singlePersonUmum._id && 'bg-user3'
                          } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1`}
                        >
                          {singlePersonUmum.tarikhKedatangan}
                        </td>
                        <td
                          onClick={() => setPilih(singlePersonUmum._id)}
                          className={`${
                            pilih === singlePersonUmum._id && 'bg-user3'
                          } px-2 py-1 outline outline-1 outline-userWhite outline-offset-1 hover:cursor-pointer text-user2`}
                        >
                          <u>PILIH</u>
                        </td>
                      </tr>
                    </tbody>
                  );
                })}
            </table>
          </div>
          {isLoading && (
            <p className='text-xl font-semibold flex justify-center p-4'>
              <Spinner color='#1f315f' />
            </p>
          )}
        </section>
        <section className='outline outline-1 outline-userBlack grid grid-cols-1 lg:grid-cols-2'>
          {resultPilih.map((singlePersonUmum) => {
            return (
              <>
                <div className='lg:mb-3'>
                  <div className='text-l font-bold flex flex-row pl-5 p-2'>
                    <h1>MAKLUMAT AM PESAKIT</h1>
                  </div>
                  <div className='text-xs lg:text-sm flex flex-row pl-5'>
                    <h2 className='font-semibold'>NAMA :</h2>
                    <p className='ml-1'>{singlePersonUmum.nama}</p>
                  </div>
                  <div className='text-xs lg:text-sm flex flex-row pl-5'>
                    <h2 className='font-semibold'>UMUR :</h2>
                    <p className='ml-1'>{singlePersonUmum.umur} tahun</p>
                  </div>
                </div>
                <div className='lg:pt-10'>
                  <div className='text-xs lg:text-sm flex flex-row pl-5'>
                    <h2 className='font-semibold'>JANTINA :</h2>
                    <p className='ml-1'>{singlePersonUmum.jantina}</p>
                  </div>
                  <div className='text-xs lg:text-sm flex flex-row pl-5'>
                    <h2 className='font-semibold'>IC/Passport :</h2>
                    <p className='ml-1'>{singlePersonUmum.ic}</p>
                  </div>
                  <Link
                    to={`form-umum/${singlePersonUmum._id}`}
                    className='float-right m-2 p-2 capitalize bg-user3 hover:bg-user1 hover:text-userWhite transition-all'
                  >
                    masukkan reten
                  </Link>
                </div>
              </>
            );
          })}
        </section>
      </div>
    </>
  );
}

export default UserUmum;
