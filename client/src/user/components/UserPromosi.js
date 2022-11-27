import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';

import UserModalPromosi from './form-promosi/UserModalPromosi';

import { useGlobalUserAppContext } from '../context/userAppContext';

function UserPromosi() {
  const { userToken, reliefUserToken, toast, refreshTimer, setRefreshTimer } =
    useGlobalUserAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [allProgramPromosi, setAllProgramPromosi] = useState([]);
  const [kodProgram, setKodProgram] = useState('');

  const [reloadState, setReloadState] = useState(false);

  const [showTambahAcara, setShowTambahAcara] = useState(false);

  useEffect(() => {
    const fetchAllProgramPromosi = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get('/api/v1/promosi', {
          headers: {
            Authorization: `Bearer ${
              reliefUserToken ? reliefUserToken : userToken
            }`,
          },
        });
        setAllProgramPromosi(data.allProgramPromosi);

        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllProgramPromosi();
  }, []);

  const tambahAcara = () => {
    setShowTambahAcara(true);
  };

  return (
    <>
      <div className='px-3 lg:px-3 h-full p-3 overflow-y-auto'>
        <div className='relative grid grid-cols-3 outline outline-1 outline-userBlack m-3'>
          <div className='col-span-2 grid grid-cols-2'>
            <div>
              <div className='w-full flex'>
                <label
                  htmlFor='kod-program'
                  className='font-semibold whitespace-nowrap m-auto mx-5'
                >
                  kod program :
                </label>
                <select
                  type='text'
                  value={kodProgram}
                  onChange={(e) => {
                    setKodProgram(e.target.value);
                  }}
                  className='w-full my-3 ml-4 leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
                >
                  <option value=''></option>
                  {allProgramPromosi.map((p) => {
                    return (
                      <option value={p.kodProgram}>
                        {p.kodProgram} | {p.jenisProgram} | {p.namaProgram}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className='flex'>
                <label
                  htmlFor='jenis-program'
                  className='font-semibold whitespace-nowrap m-auto mx-5'
                >
                  jenis program :
                </label>
                <p className='w-full my-3 ml-2 appearance-none leading-7 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user3 focus:outline-none rounded-md shadow-md'>
                  {kodProgram !== ''
                    ? allProgramPromosi
                        .filter((p) => p.kodProgram.includes(kodProgram))
                        .map((p) => {
                          return <h1>{p.jenisProgram}</h1>;
                        })
                    : 'Sila pilih..'}
                </p>
              </div>
              <div className='flex'>
                <label
                  htmlFor='nama-program'
                  className='font-semibold whitespace-nowrap m-auto mx-5'
                >
                  nama program :
                </label>
                <p className='w-full my-3 appearance-none leading-7 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user3 focus:outline-none rounded-md shadow-md'>
                  {kodProgram !== ''
                    ? allProgramPromosi
                        .filter((p) => p.kodProgram.includes(kodProgram))
                        .map((p) => {
                          return <h1>{p.namaProgram}</h1>;
                        })
                    : 'Sila pilih..'}
                </p>
              </div>
            </div>
            <div className='relative'>
              <button className='absolute left-5 top-3 uppercase bg-user3 text-base text-userWhite rounded-md shadow-md p-2 hover:bg-user1 transition-all'>
                cari
              </button>
            </div>
          </div>
          <div className='relative'>
            <div
              onClick={tambahAcara}
              className='absolute right-5 top-5 text-4xl text-userWhite bg-user3 p-2 rounded-md shadow-md hover:cursor-pointer hover:bg-user4'
            >
              <FaPlus />
            </div>
          </div>
        </div>
        <div className='outline outline-1 outline-userBlack m-3 pt-1 pb-3'>
          <h1 className='text-lg font-semibold m-3'>
            SENARAI ACARA BAGI AKTIVITI PROMOSI / PENDIDIKAN KESIHATAN PERGIGIAN
          </h1>
          <section className='p-3'>
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
          </section>
          <section className='relative outline outline-1 outline-userBlack grid grid-cols-1 lg:grid-cols-2 m-3'>
            <div className='lg:mb-3'>
              <div className='text-l font-bold flex flex-row pl-5 p-2'>
                <h1>MAKLUMAT ACARA</h1>
              </div>
              <div className='text-xs lg:text-sm flex flex-row pl-5'>
                <h2 className='font-semibold'>jenis program :</h2>
                <p className='ml-1'>mengemas rumah</p>
              </div>
              <div className='text-xs lg:text-sm flex flex-row pl-5'>
                <h2 className='font-semibold'>nama acara :</h2>
                <p className='ml-1'>mop lantai</p>
              </div>
              <div className='text-xs lg:text-sm flex flex-row pl-5'>
                <h2 className='font-semibold'>tarikh mula :</h2>
                <p className='ml-1'>01/01/2022</p>
              </div>
            </div>
            <div className='lg:pt-10 relative'>
              <div className='text-xs lg:text-sm flex flex-row pl-5 lg:absolute lg:bottom-3'>
                <h2 className='font-semibold'>tarikh akhir :</h2>
                <p className='ml-1'>02/01/2022</p>
              </div>
            </div>
            <div className='absolute right-3 bottom-5'>
              <Link
                target='_blank'
                to='form-promosi'
                className='uppercase bg-user3 text-base text-userWhite rounded-md shadow-md p-2 hover:bg-user1 transition-all'
              >
                ke form promosi
              </Link>
            </div>
          </section>
        </div>
      </div>
      {showTambahAcara && (
        <UserModalPromosi
          setShowTambahAcara={setShowTambahAcara}
          toast={toast}
        />
      )}
    </>
  );
}

export default UserPromosi;
