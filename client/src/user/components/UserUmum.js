import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { useGlobalUserAppContext } from '../context/userAppContext';

function UserUmum() {
  const { userToken, dateToday } = useGlobalUserAppContext();

  const [nama, setNama] = useState('');
  const [tarikhKedatangan, setTarikhKedatangan] = useState(dateToday);
  const [queryResult, setQueryResult] = useState([]);

  useEffect(() => {
    const query = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/query/umum?nama=${nama}&tarikhKedatangan=${tarikhKedatangan}`,
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
        setQueryResult(data.umumResultQuery);
      } catch (error) {
        console.log(error);
      }
    };
    query();
  }, [nama, tarikhKedatangan]);

  return (
    <>
      <div className='px-10 h-full p-3 overflow-y-auto'>
        <form className='text-left'>
          <h2 className='text-xl font-semibold flex flex-row p-2'>CARIAN</h2>
          <label htmlFor='nama-pesakit' className='flex flex-row p-2'>
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
            className='appearance-none leading-7 px-3 py-1 ring-2 w-full focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
          />
          <label htmlFor='kad-pengenalan' className='flex flex-row p-2'>
            tarikh kedatangan
          </label>
          <input
            onChange={(e) => {
              setTarikhKedatangan(e.target.value);
            }}
            value={tarikhKedatangan}
            type='date'
            name='tarikh-kedatangan'
            id='tarikh-kedatangan'
            className='outline outline-1 outline-user1'
          />
          <button
            type='submit'
            className='bg-user3 p-2 ml-3 w-1/5 justify-center hover:bg-user1 hover:text-userWhite transition-all'
          >
            CARI
          </button>
        </form>
        <section className='my-5 p-1 outline outline-1 outline-user1'>
          <h2 className='text-xl font-semibold flex flex-row pl-12 p-2'>
            SENARAI CARIAN
          </h2>
          <table className='m-auto mb-3 w-11/12 outline outline-1 outline-userBlack'>
            <tr className='bg-user3 p-2'>
              <th className='outline outline-1 outline-userBlack'>BIL</th>
              <th className='outline outline-1 outline-userBlack px-20'>
                NAMA PESAKIT
              </th>
              <th className='outline outline-1 outline-userBlack'>
                KAD PENGENALAN
              </th>
              <th className='outline outline-1 outline-userBlack'>
                TARIKH LAWATAN TERAKHIR
              </th>
              <th className='outline outline-1 outline-userBlack'>AKTIFKAN</th>
            </tr>
            {queryResult.map((singlePersonUmum) => {
              return (
                <tr>
                  <td className='outline outline-1 outline-userBlack'>1</td>
                  <td className='outline outline-1 outline-userBlack px-20'>
                    {singlePersonUmum.nama}
                  </td>
                  <td className='outline outline-1 outline-userBlack'>
                    {singlePersonUmum.ic}
                  </td>
                  <td className='outline outline-1 outline-userBlack'>
                    {singlePersonUmum.tarikhKedatangan}
                  </td>
                  <td className='outline outline-1 outline-userBlack'>Pilih</td>
                </tr>
              );
            })}
          </table>
        </section>
        <section className='outline outline-1 outline-userBlack grid grid-cols-1 md:grid-cols-2'>
          <div className='mb-3'>
            <div className='text-l font-bold flex flex-row pl-5 p-2'>
              <h1>MAKLUMAT AM PESAKIT</h1>
            </div>
            <div className='text-s flex flex-row pl-5'>
              <h2 className='font-semibold'>NAMA :</h2>
              <p className='ml-1'>ahmad abu</p>
            </div>
            <div className='text-s flex flex-row pl-5'>
              <h2 className='font-semibold'>UMUR :</h2>
              <p className='ml-1'>51 tahun</p>
            </div>
          </div>
          <div className='md:pt-10'>
            <div className='text-s flex flex-row pl-5'>
              <h2 className='font-semibold'>JANTINA :</h2>
              <p className='ml-1'>lelaki</p>
            </div>
            <div className='text-s flex flex-row pl-5'>
              <h2 className='font-semibold'>IC/Passport :</h2>
              <p className='ml-1'>210145-12-2344</p>
            </div>
            <Link
              to='/user/form-umum/123'
              className='float-right m-2 p-2 capitalize bg-user3 hover:bg-user1 hover:text-userWhite transition-all'
            >
              masukkan reten
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

export default UserUmum;
