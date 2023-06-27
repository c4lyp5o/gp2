import { useState, useEffect } from 'react';
import { BsPlusCircleDotted, BsTable } from 'react-icons/bs';

import { useGlobalAdminAppContext } from '../../../context/adminAppContext';

import FormPemeriksaanProgramGtod from './FormPemeriksaanProgram';
import FormTambahProgramGtod from './FormTambahProgram';
import ModalDeleteGtod from './ModalProgram';

import { set } from 'lodash';

export default function ProgramGTod() {
  const { loginInfo, readData, readOneData, createData, toast } =
    useGlobalAdminAppContext();

  const [showForm, setShowForm] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const [showFormPemeriksaan, setShowFormPemeriksaan] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [singleAgensiLuarGTod, setSingleAgensiLuarGTod] = useState(null);
  const [tableGtod, setTableGtod] = useState([]);
  const [idGTod, setIdGTod] = useState('');
  const [pemeriksaanSatu, setPemeriksaanSatu] = useState(null);
  const [pemeriksaanDua, setPemeriksaanDua] = useState(null);

  useEffect(() => {
    const fetchGtod = async () => {
      try {
        const { data } = await readData('gtod');
        setTableGtod(data);
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGtod();
  }, []);

  useEffect(() => {
    if (idGTod) {
      const fetchSingleGtod = async () => {
        try {
          const { data } = await readOneData('gtod', idGTod);

          setSingleAgensiLuarGTod(data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchSingleGtod();
    }
  }, [idGTod]);

  return (
    <>
      <div className='grid grid-cols-1 lg:grid-cols-[1fr_7fr] gap-5 mt-4 relative'>
        <div className='hidden lg:block'>
          <div className='py-6 px-3 shadow-md shadow-user1 rounded-md flex justify-center'>
            <button
              className='outline-none focus:outline-none flex items-center flex-col'
              onClick={() => {
                setShowForm(true);
                setShowTable(false);
                setShowFormPemeriksaan(false);
              }}
            >
              <BsPlusCircleDotted className='text-8xl text-admin1' />
              <span className=' text-admin1 text-sm mt-2'>Tambah</span>
            </button>
          </div>
          <div className='py-6 px-3 shadow-md shadow-user1 rounded-md flex justify-center mt-5'>
            <button
              className='outline-none focus:outline-none flex items-center flex-col'
              onClick={() => {
                setShowTable(true);
                setShowForm(false);
                setShowFormPemeriksaan(false);
              }}
            >
              <BsTable className='text-8xl text-admin1' />
              <span className=' text-admin1 text-sm mt-2'>Senarai</span>
            </button>
          </div>
        </div>
        <div className='auto-rows-min flex flex-col px-10'>
          <div className='flex items-center justify-start pb-5'>
            <h1 className='text-3xl font-bold'>Program G-Tod</h1>
          </div>
          {showTable && (
            <>
              <div className='overflow-x-auto text-sm rounded-md h-min max-w-max '>
                <table className='table-auto'>
                  <thead className='text-adminWhite bg-admin3'>
                    <tr>
                      <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                        Bil.
                      </th>
                      <th className='px-2 py-1 outline outline-1 outline-offset-1 md:w-screen md:max-w-md lg:w-screen lg:max-w-screen-lg'>
                        Jenis Agensi Luar
                      </th>
                      <th className='px-2 py-1 outline outline-1 outline-offset-1 md:w-screen md:max-w-md lg:w-screen lg:max-w-screen-lg'>
                        Nama Agensi Luar
                      </th>
                      <th className='px-2 py-1 outline outline-1 outline-offset-1 md:w-screen md:max-w-md lg:w-screen lg:max-w-screen-lg'>
                        Nama Taska/Tadika
                      </th>
                      <th className='px-2 py-1 outline outline-1 outline-offset-1 md:w-screen md:max-w-md lg:w-screen lg:max-w-screen-lg'>
                        Alamat Taska/Tadika
                      </th>
                      <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                        Tindakan
                      </th>
                      <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                        Status Lawatan
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-admin4'>
                    {tableGtod?.map((agensi, idx) => (
                      <tr key={agensi._id}>
                        <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                          {idx + 1}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                          {' '}
                          {agensi.jenisAgensiLuar}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                          {' '}
                          {agensi.namaAgensiLuar}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                          {' '}
                          {agensi.namaTaskaTadika}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                          {' '}
                          {agensi.alamatTaskaTadika}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                          <span className='flex items-center justify-center space-x-1'>
                            <button
                              className='px-2 py-1 bg-user6 text-adminWhite rounded-md outline-none focus:outline-none hover:bg-admin2 transition duration-200 ease-in-out text-xs'
                              onClick={() => {
                                setIdGTod(agensi._id);
                                setShowForm(true);
                                setShowTable(false);
                              }}
                            >
                              Kemaskini
                            </button>
                            <button
                              id={agensi._id}
                              className='px-2 py-1 bg-user9 text-adminWhite rounded-md outline-none focus:outline-none hover:bg-admin2 transition duration-200 ease-in-out text-xs'
                              onClick={() => {
                                setShowModalDelete(true);
                                setIdGTod(agensi._id);
                              }}
                            >
                              Hapus
                            </button>
                          </span>
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1 '>
                          <span className='flex items-center justify-center space-x-1'>
                            {agensi.pemeriksaanAgensiLuar1 && (
                              <button
                                className='px-2 py-1 bg-user11 text-adminWhite rounded-md outline-none focus:outline-none hover:bg-admin2 transition duration-200 ease-in-out text-xs whitespace-nowrap'
                                onClick={() => {
                                  setIdGTod(agensi._id);
                                  setPemeriksaanSatu(
                                    agensi.pemeriksaanAgensiLuar1
                                  );
                                  setShowFormPemeriksaan(true);
                                  setShowTable(false);
                                }}
                              >
                                Lawatan 1
                              </button>
                            )}
                            {agensi.pemeriksaanAgensiLuar2 ? (
                              <button
                                className='px-2 py-1 bg-user11 text-adminWhite rounded-md outline-none focus:outline-none hover:bg-admin2 transition duration-200 ease-in-out text-xs whitespace-nowrap'
                                onClick={() => {
                                  setIdGTod(agensi._id);
                                  setPemeriksaanDua(
                                    agensi.pemeriksaanAgensiLuar2
                                  );
                                  setShowFormPemeriksaan(true);
                                  setShowTable(false);
                                }}
                              >
                                Lawatan 2
                              </button>
                            ) : (
                              <button
                                className='px-2 py-1 bg-user6 text-adminWhite rounded-md outline-none focus:outline-none hover:bg-admin2 transition duration-200 ease-in-out text-xs flex flex-row items-center'
                                onClick={() => {
                                  setIdGTod(agensi._id);
                                  setShowFormPemeriksaan(true);
                                  setShowTable(false);
                                }}
                              >
                                <BsPlusCircleDotted className='mr-1' /> Lawatan
                              </button>
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {showForm && (
            <FormTambahProgramGtod
              singleAgensiLuarGTod={singleAgensiLuarGTod}
              setSingleAgensiLuarGTod={setSingleAgensiLuarGTod}
              setShowForm={setShowForm}
              idGTod={idGTod}
            />
          )}
          {showFormPemeriksaan && (
            <FormPemeriksaanProgramGtod
              singleAgensiLuarGTod={singleAgensiLuarGTod}
              idGTod={idGTod}
              setShowFormPemeriksaan={setShowFormPemeriksaan}
              setShowTable={setShowTable}
              pemeriksaanSatu={pemeriksaanSatu}
              pemeriksaanDua={pemeriksaanDua}
            />
          )}
        </div>
      </div>
      {showModalDelete && (
        <>
          <ModalDeleteGtod
            setShowModalDelete={setShowModalDelete}
            idGTod={idGTod}
            singleAgensiLuarGTod={singleAgensiLuarGTod}
          />
        </>
      )}
    </>
  );
}
