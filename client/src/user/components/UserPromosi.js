import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

function UserPromosi() {
  return (
    <>
      <div className='px-3 lg:px-10 h-full p-3 overflow-y-auto'>
        <div className='grid grid-cols-3 outline outline-1 outline-userBlack m-3'>
          <form className='grid grid-cols-2 col-span-2'>
            <div>
              <div>
                <label htmlFor='kod-program'>kod program: </label>
                <input
                  type='text'
                  className='mt-3 appearance-none leading-7 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user3 focus:outline-none rounded-md peer'
                />
              </div>
              <div>
                <label htmlFor='nama-program'>nama program: </label>
                <select
                  name='nama-program'
                  id='nama-program'
                  className='w-full leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
                >
                  <option value=''>?</option>
                  <option value='?'>?</option>
                </select>
              </div>
              <div>
                <label htmlFor='jenis-program'>jenis program: </label>
                <select
                  name='jenis-program'
                  id='jenis-program'
                  className='w-full leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
                >
                  <option value=''>?</option>
                  <option value='?'>?</option>
                </select>
              </div>
            </div>
            <div>
              <button className='uppercase bg-user3 text-base text-userWhite rounded-md shadow-md p-2 hover:bg-user1 transition-all'>
                cari
              </button>
            </div>
          </form>
          <div>
            <FaPlus />
          </div>
        </div>
        <div className='outline outline-1 outline-userBlack m-3 pb-3'>
          <p>
            senarai acara bagi aktiviti promosi / pendidikan kesihatan pergigian
          </p>
          <div className='m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max'>
            <table className='table-auto'>
              <thead className='text-userWhite bg-user2'>
                <tr>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    BIL
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    KOD PROGRAM
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    NAMA PROGRAM
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 md:w-screen md:max-w-md lg:w-screen lg:max-w-screen-lg'>
                    NAMA ACARA
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    TARIKH MULA
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    TARIKH AKHIR
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-80'>
                    STATUS
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-80'>
                    AKTIFKAN
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    HAPUS
                  </th>
                </tr>
              </thead>
              <tbody className='bg-user4'>
                <tr>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    ayam
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    ayam
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    ayam
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    ayam
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    ayam
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    ayam
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    ayam
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    ayam
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    ayam
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className='outline outline-1 outline-userBlack m-3'>
            <p>placeholder 3</p>
          </div>
        </div>
        <Link
          to='form-promosi'
          className='uppercase bg-user3 text-base text-userWhite rounded-md shadow-md p-2 hover:bg-user1 transition-all'
        >
          ke form promosi
        </Link>
      </div>
    </>
  );
}

export default UserPromosi;
