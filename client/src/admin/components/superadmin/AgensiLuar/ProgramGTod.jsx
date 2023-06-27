import { useState, useEffect } from 'react';
import { BsPlusCircleDotted, BsTable } from 'react-icons/bs';

import { useGlobalAdminAppContext } from '../../../context/adminAppContext';

import FormProgramGtod from './FormProgramGtod';

import { SubmitButton, BusyButton } from '../../Buttons';
import { set } from 'lodash';

export default function ProgramGTod() {
  const {
    loginInfo,
    readData,
    readOneData,
    createData,
    updateData,
    deleteData,
    newRouteCreateData,
    newRouteUpdateData,
    newRouteDeleteData,
    toast,
  } = useGlobalAdminAppContext();

  const [showForm, setShowForm] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const [showFormPemeriksaan, setShowFormPemeriksaan] = useState(false);
  const [singleAgensiLuarGTod, setSingleAgensiLuarGTod] = useState(null);
  const [tableGtod, setTableGtod] = useState([]);
  const [kemaskiniGTod, setKemaskiniGTod] = useState('');
  const [pemeriksaanSatu, setPemeriksaanSatu] = useState(null);
  const [pemeriksaanDua, setPemeriksaanDua] = useState(null);

  const [jenisAgensiLuar, setJenisAgensiLuar] = useState('');
  const [namaAgensiLuar, setNamaAgensiLuar] = useState('');
  const [namaTaskaTadika, setNamaTaskaTadika] = useState('');
  const [alamatTaskaTadika, setAlamatTaskaTadika] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    let Data;
    Data = {
      tahunSemasa: new Date().getFullYear(),
      createdByNegeri: loginInfo?.negeri,
      createdByDaerah: loginInfo?.daerah,
      jenisAgensiLuar: singleAgensiLuarGTod
        ? singleAgensiLuarGTod.jenisAgensiLuar
        : jenisAgensiLuar,
      namaAgensiLuar: singleAgensiLuarGTod
        ? singleAgensiLuarGTod.namaAgensiLuar
        : namaAgensiLuar,
      namaTaskaTadika: singleAgensiLuarGTod
        ? singleAgensiLuarGTod.namaTaskaTadika
        : namaTaskaTadika,
      alamatTaskaTadika: singleAgensiLuarGTod
        ? singleAgensiLuarGTod.alamatTaskaTadika
        : alamatTaskaTadika,
    };
    // console.log(Data);
    const kemaskiniAda = singleAgensiLuarGTod
      ? updateData('gtod', kemaskiniGTod, Data)
      : createData('gtod', Data);
    await toast
      .promise(
        kemaskiniAda,
        {
          pending: 'Memproses ...',
          success: 'Berjaya menambah data agensi luar',
          error: 'Gagal menambah data agensi luar',
        },
        {
          autoclose: 3000,
        }
      )
      .then((result) => {
        setShowForm(false);
        // reload page
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = async (id) => {
    await toast
      .promise(
        deleteData('gtod', id),
        {
          pending: 'Memproses ...',
          success: 'Berjaya memadam data agensi luar',
          error: 'Gagal memadam data agensi luar',
        },
        {
          autoclose: 3000,
        }
      )
      .then((result) => {
        // reload page
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
    if (kemaskiniGTod) {
      const fetchSingleGtod = async () => {
        try {
          const { data } = await readOneData('gtod', kemaskiniGTod);

          setSingleAgensiLuarGTod(data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchSingleGtod();
    }
  }, [kemaskiniGTod]);

  return (
    <>
      <div className='grid grid-cols-[1fr_7fr] gap-5 mt-4 relative'>
        <div className=''>
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
          {showTable && !showForm && (
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
                                setKemaskiniGTod(agensi._id);
                                setShowForm(true);

                                setShowTable(false);
                              }}
                            >
                              Kemaskini
                            </button>
                            <button
                              className='px-2 py-1 bg-user9 text-adminWhite rounded-md outline-none focus:outline-none hover:bg-admin2 transition duration-200 ease-in-out text-xs'
                              onClick={() => {
                                setKemaskiniGTod(agensi._id);
                                handleDelete(agensi._id);
                              }}
                            >
                              Padam
                            </button>
                          </span>
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1 '>
                          <span className='flex items-center justify-center space-x-1'>
                            {agensi.pemeriksaanAgensiLuar1 && (
                              <button
                                className='px-2 py-1 bg-user11 text-adminWhite rounded-md outline-none focus:outline-none hover:bg-admin2 transition duration-200 ease-in-out text-xs'
                                onClick={() => {
                                  setKemaskiniGTod(agensi._id);
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
                                className='px-2 py-1 bg-user11 text-adminWhite rounded-md outline-none focus:outline-none hover:bg-admin2 transition duration-200 ease-in-out text-xs'
                                onClick={() => {
                                  setKemaskiniGTod(agensi._id);
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
                                  setKemaskiniGTod(agensi._id);
                                  setShowFormPemeriksaan(true);
                                  setShowTable(false);
                                }}
                              >
                                <BsPlusCircleDotted /> Lawatan
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
          {showForm && !showTable && (
            <form
              className='grid grid-cols-2 auto-rows-min gap-5 mx-10'
              onSubmit={handleSubmit}
            >
              <div className='grid grid-cols-2'>
                <label
                  htmlFor='nama-agensi-luar'
                  className='font-bold uppercase text-xs lg:text-sm flex justify-end place-items-center mr-2'
                >
                  Nama Agensi Luar
                </label>
                <input
                  className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  type='text'
                  name='nama-agensi-luar'
                  id='nama-agensi-luar'
                  required
                  value={
                    singleAgensiLuarGTod
                      ? singleAgensiLuarGTod.namaAgensiLuar
                      : namaAgensiLuar
                  }
                  onChange={(e) => {
                    if (singleAgensiLuarGTod) {
                      setSingleAgensiLuarGTod({
                        ...singleAgensiLuarGTod,
                        namaAgensiLuar: e.target.value,
                      });
                    } else {
                      setNamaAgensiLuar(e.target.value);
                    }
                  }}
                />
              </div>
              <div className='grid grid-cols-2'>
                <label
                  htmlFor='jenis-agensi-luar'
                  className='font-bold uppercase text-xs lg:text-sm flex justify-end place-items-center mr-2'
                >
                  Jenis Agensi Luar
                </label>
                <select
                  className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  name='jenis-agensi-luar'
                  id='jenis-agensi-luar'
                  required
                  value={
                    singleAgensiLuarGTod
                      ? singleAgensiLuarGTod.jenisAgensiLuar
                      : jenisAgensiLuar
                  }
                  onChange={(e) => {
                    if (singleAgensiLuarGTod) {
                      setSingleAgensiLuarGTod({
                        ...singleAgensiLuarGTod,
                        jenisAgensiLuar: e.target.value,
                      });
                    } else {
                      setJenisAgensiLuar(e.target.value);
                    }
                  }}
                >
                  <option value=''>Pilih Jenis Agensi Luar</option>
                  <option value='angkatan tentera malaysia'>
                    Angkatan Tentera Malaysia
                  </option>
                  <option value='universiti awam'>universiti awam</option>
                  <option value='universiti swasta'>universiti swasta</option>
                  <option value='pengamal pergigian swasta'>
                    pengamal pergigian swasta
                  </option>
                  <option value='badan bukan kerajaan'>
                    badan bukan kerajaan (NGO)
                  </option>
                  <option value='pemain industri'>pemain industri</option>
                  <option value='lain-lain agensi'>lain-lain agensi</option>
                </select>
              </div>
              <div className='grid grid-cols-2'>
                <label
                  htmlFor='nama-taska-tadika'
                  className='font-bold uppercase text-xs lg:text-sm flex justify-end pt-1 mr-2'
                >
                  Nama Taska/Tadika
                </label>
                <input
                  className='appearance-none w-full h-8 px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  type='text'
                  name='nama-taska-tadika'
                  id='nama-taska-tadika'
                  required
                  value={
                    singleAgensiLuarGTod
                      ? singleAgensiLuarGTod.namaTaskaTadika
                      : namaTaskaTadika
                  }
                  onChange={(e) => {
                    if (singleAgensiLuarGTod) {
                      setSingleAgensiLuarGTod({
                        ...singleAgensiLuarGTod,
                        namaTaskaTadika: e.target.value,
                      });
                    } else {
                      setNamaTaskaTadika(e.target.value);
                    }
                  }}
                />
              </div>
              <div className='grid grid-cols-2'>
                <label
                  htmlFor='alamat-taska-tadika'
                  className='font-bold uppercase text-xs lg:text-sm flex justify-end pt-1 mr-2'
                >
                  Alamat Taska/Tadika
                </label>
                <textarea
                  className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  name='alamat-taska-tadika'
                  id='alamat-taska-tadika'
                  required
                  value={
                    singleAgensiLuarGTod
                      ? singleAgensiLuarGTod.alamatTaskaTadika
                      : alamatTaskaTadika
                  }
                  onChange={(e) => {
                    if (singleAgensiLuarGTod) {
                      setSingleAgensiLuarGTod({
                        ...singleAgensiLuarGTod,
                        alamatTaskaTadika: e.target.value,
                      });
                    } else {
                      setAlamatTaskaTadika(e.target.value);
                    }
                  }}
                />
              </div>
              <div className='grid grid-cols-2'>
                <span
                  className='flex flex-col gap-5'
                  onClick={() => {
                    setShowForm(false);
                    window.location.reload();
                  }}
                >
                  batal
                </span>
                <button className='flex flex-col gap-5' type='submit'>
                  hantar
                </button>
              </div>
            </form>
          )}
          {showFormPemeriksaan && (
            <FormProgramGtod
              singleAgensiLuarGTod={singleAgensiLuarGTod}
              kemaskiniGTod={kemaskiniGTod}
              setShowFormPemeriksaan={setShowFormPemeriksaan}
              setShowTable={setShowTable}
              pemeriksaanSatu={pemeriksaanSatu}
              pemeriksaanDua={pemeriksaanDua}
            />
          )}
        </div>
      </div>
    </>
  );
}
