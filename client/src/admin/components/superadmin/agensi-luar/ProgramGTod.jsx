import { useState, useEffect } from 'react';
import { BsPlusCircleDotted, BsTable } from 'react-icons/bs';

import { useAdminData } from '../../../context/admin-hooks/useAdminData';

import FormTambahProgramGtod from './FormTambahProgram';
import FormPemeriksaanProgramGtod from './FormPemeriksaanProgram';
import ModalDeleteGtod from './ModalProgram';

export default function ProgramGTod() {
  const { readData, readOneData } = useAdminData();

  const [showForm, setShowForm] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const [showFormPemeriksaan, setShowFormPemeriksaan] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [singleAgensiLuarGTod, setSingleAgensiLuarGTod] = useState(null);
  const [tableGtod, setTableGtod] = useState([]);
  const [idGTod, setIdGTod] = useState('');
  const [namaTaskaTadika, setNamaTaskaTadika] = useState('');
  const [visitNumber, setVisitNumber] = useState(0);
  const [pemeriksaanSatu, setPemeriksaanSatu] = useState(null);
  const [pemeriksaanDua, setPemeriksaanDua] = useState(null);

  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [reloadState, setReloadState] = useState(false);

  useEffect(() => {
    setIsLoadingTable(true);
    const fetchGtod = async () => {
      try {
        const { data } = await readData('gtod');
        setTableGtod(data);
        setIsLoadingTable(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGtod();
  }, [reloadState]);

  useEffect(() => {
    if (idGTod) {
      setIsLoadingForm(true);
      const fetchSingleGtod = async () => {
        try {
          const { data } = await readOneData('gtod', idGTod);

          setSingleAgensiLuarGTod(data);
          setIsLoadingForm(false);
        } catch (error) {
          console.log(error);
        }
      };
      fetchSingleGtod();
    }
  }, [idGTod, reloadState]);

  return (
    <>
      <div className='grid grid-cols-1 lg:grid-cols-[1fr_7fr] gap-5 mt-4 relative'>
        <div className='hidden lg:block'>
          <div
            onClick={() => {
              if (showTable) {
                setShowForm(true);
                setShowTable(false);
                setShowFormPemeriksaan(false);
                setIdGTod('');
                setSingleAgensiLuarGTod(null);
              }
            }}
            className={`${
              showTable
                ? 'bg-admin3 cursor-pointer'
                : 'bg-user1 bg-opacity-50 cursor-not-allowed'
            } py-6 px-3 shadow-md rounded-md flex justify-center`}
          >
            <span className='outline-none focus:outline-none flex items-center flex-col'>
              <BsPlusCircleDotted className='text-8xl text-adminWhite font-semibold' />
              <span className=' text-adminWhite font-semibold text-sm mt-2'>
                Tambah
              </span>
            </span>
          </div>
          <div
            onClick={() => {
              if (showForm) {
                setShowTable(true);
                setShowForm(false);
                setShowFormPemeriksaan(false);
              }
            }}
            className={`${
              showForm
                ? 'bg-admin3 cursor-pointer'
                : 'bg-user1 bg-opacity-50 cursor-not-allowed'
            } py-6 px-3 shadow-md rounded-md flex justify-center mt-5`}
          >
            <span className='outline-none focus:outline-none flex items-center flex-col'>
              <BsTable className='text-8xl text-adminWhite font-semibold' />
              <span className=' text-adminWhite font-semibold text-sm mt-2'>
                Senarai
              </span>
            </span>
          </div>
        </div>
        <div className='auto-rows-min flex flex-col px-10'>
          {showTable && (
            <>
              <div className='flex items-center justify-start pb-5'>
                <h1 className='text-3xl px-11 font-bold'>Program G-Tod</h1>
              </div>
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
                  {isLoadingTable ? (
                    <tbody className='bg-admin4'>
                      <tr>
                        <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                          <span className='h-2 text-admin1 bg-admin1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                        </td>
                        <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                          <span className='h-2 text-admin1 bg-admin1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                        </td>
                        <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                          <span className='h-2 text-admin1 bg-admin1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                        </td>
                        <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                          <span className='h-2 text-admin1 bg-admin1 bg-opacity-50 animate-pulse w-full px-20 rounded-xl'></span>
                        </td>
                        <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                          <span className='h-2 text-admin1 bg-admin1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                        </td>
                        <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                          <span className='h-2 text-admin1 bg-admin1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                        </td>
                        <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                          <span className='h-2 text-admin1 bg-admin1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                        </td>
                      </tr>
                      <tr>
                        <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                          <span className='h-2 text-admin1 bg-admin1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                        </td>
                        <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                          <span className='h-2 text-admin1 bg-admin1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                        </td>
                        <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                          <span className='h-2 text-admin1 bg-admin1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                        </td>
                        <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                          <span className='h-2 text-admin1 bg-admin1 bg-opacity-50 animate-pulse w-full px-20 rounded-xl'></span>
                        </td>
                        <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                          <span className='h-2 text-admin1 bg-admin1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                        </td>
                        <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                          <span className='h-2 text-admin1 bg-admin1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                        </td>
                        <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                          <span className='h-2 text-admin1 bg-admin1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                        </td>
                      </tr>
                      <tr>
                        <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                          <span className='h-2 text-admin1 bg-admin1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                        </td>
                        <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                          <span className='h-2 text-admin1 bg-admin1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                        </td>
                        <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                          <span className='h-2 text-admin1 bg-admin1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                        </td>
                        <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                          <span className='h-2 text-admin1 bg-admin1 bg-opacity-50 animate-pulse w-full px-20 rounded-xl'></span>
                        </td>
                        <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                          <span className='h-2 text-admin1 bg-admin1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                        </td>
                        <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                          <span className='h-2 text-admin1 bg-admin1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                        </td>
                        <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                          <span className='h-2 text-admin1 bg-admin1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody className='bg-admin4'>
                      {tableGtod ? (
                        tableGtod.map((agensi, idx) => (
                          <tr key={agensi._id}>
                            <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                              {idx + 1}
                            </td>
                            <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                              {agensi.jenisAgensiLuar}
                            </td>
                            <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                              {agensi.namaAgensiLuar}
                            </td>
                            <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                              {agensi.namaTaskaTadika}
                            </td>
                            <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
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
                                    setIdGTod(agensi._id);
                                    setShowModalDelete(true);
                                  }}
                                >
                                  Hapus
                                </button>
                              </span>
                            </td>
                            <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1 '>
                              {agensi.statusPenglibatan === 'aktif' ? (
                                <span className='flex items-center justify-center space-x-1'>
                                  {agensi.pemeriksaanAgensiLuar1 && (
                                    <button
                                      className='px-2 py-1 bg-user11 text-adminWhite rounded-md outline-none focus:outline-none hover:bg-admin2 transition duration-200 ease-in-out text-xs whitespace-nowrap'
                                      onClick={() => {
                                        setIdGTod(agensi._id);
                                        setNamaTaskaTadika(
                                          agensi.namaTaskaTadika
                                        );
                                        setVisitNumber(agensi.visitNumber);
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
                                        setNamaTaskaTadika(
                                          agensi.namaTaskaTadika
                                        );
                                        setVisitNumber(agensi.visitNumber);
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
                                        setNamaTaskaTadika(
                                          agensi.namaTaskaTadika
                                        );
                                        setVisitNumber(agensi.visitNumber);
                                        setShowFormPemeriksaan(true);
                                        setShowTable(false);
                                        setPemeriksaanSatu(null);
                                        setPemeriksaanDua(null);
                                      }}
                                    >
                                      <BsPlusCircleDotted className='mr-1' />{' '}
                                      Lawatan
                                    </button>
                                  )}
                                </span>
                              ) : null}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan='7' className='text-center py-2'>
                            Tiada Data
                          </td>
                        </tr>
                      )}
                    </tbody>
                  )}
                </table>
              </div>
            </>
          )}
          {showForm && (
            <>
              <div className='flex items-center justify-start pb-5'>
                <h1 className='text-3xl px-11 font-bold'>
                  {idGTod ? 'Kemaskini Program G-Tod' : 'Tambah Program G-Tod'}
                </h1>
              </div>
              <FormTambahProgramGtod
                singleAgensiLuarGTod={singleAgensiLuarGTod}
                setSingleAgensiLuarGTod={setSingleAgensiLuarGTod}
                isLoadingForm={isLoadingForm}
                setShowForm={setShowForm}
                setShowTable={setShowTable}
                idGTod={idGTod}
                reloadState={reloadState}
                setReloadState={setReloadState}
              />
            </>
          )}
          {showFormPemeriksaan && (
            <>
              <div className='flex items-center justify-start pb-5'>
                <h1 className='text-3xl px-11 font-bold'>
                  {pemeriksaanSatu
                    ? 'Lawatan Pertama'
                    : pemeriksaanDua
                    ? 'Lawatan Kedua'
                    : visitNumber === 1
                    ? 'Tambah Lawatan Kedua'
                    : 'Tambah Lawatan Pertama'}{' '}
                  {namaTaskaTadika}
                </h1>
              </div>
              <FormPemeriksaanProgramGtod
                singleAgensiLuarGTod={singleAgensiLuarGTod}
                idGTod={idGTod}
                setShowFormPemeriksaan={setShowFormPemeriksaan}
                setShowTable={setShowTable}
                visitNumber={visitNumber}
                pemeriksaanSatu={pemeriksaanSatu}
                setPemeriksaanSatu={setPemeriksaanSatu}
                pemeriksaanDua={pemeriksaanDua}
                setPemeriksaanDua={setPemeriksaanDua}
                reloadState={reloadState}
                setReloadState={setReloadState}
              />
            </>
          )}
        </div>
      </div>
      {showModalDelete && (
        <>
          <ModalDeleteGtod
            setShowModalDelete={setShowModalDelete}
            setShowTable={setShowTable}
            idGTod={idGTod}
            setIdGTod={setIdGTod}
            singleAgensiLuarGTod={singleAgensiLuarGTod}
            setSingleAgensiLuarGTod={setSingleAgensiLuarGTod}
            reloadState={reloadState}
            setReloadState={setReloadState}
          />
        </>
      )}
    </>
  );
}
