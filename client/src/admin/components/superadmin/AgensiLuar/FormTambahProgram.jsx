import { useState, useEffect } from 'react';
import moment from 'moment';
import { BiWorld } from 'react-icons/bi';

import { useGlobalAdminAppContext } from '../../../context/adminAppContext';

const FormTambahProgramGtod = ({
  singleAgensiLuarGTod,
  setSingleAgensiLuarGTod,
  setShowForm,
  idGTod,
}) => {
  const {
    loginInfo,
    readData,
    readOneData,
    createData,
    masterDatePicker,
    updateData,
    toast,
  } = useGlobalAdminAppContext();

  const [jenisAgensiLuar, setJenisAgensiLuar] = useState('');
  const [namaAgensiLuar, setNamaAgensiLuar] = useState('');
  const [namaTaskaTadika, setNamaTaskaTadika] = useState('');
  const [alamatTaskaTadika, setAlamatTaskaTadika] = useState('');
  const [bilPegawaiPergigian, setBilPegawaiPergigian] = useState(0);
  const [bilJuruterapi, setBilJuruterapi] = useState(0);

  const [addingData, setAddingData] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAddingData(true);
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
      bilPegawaiPergigian: singleAgensiLuarGTod
        ? singleAgensiLuarGTod.bilPegawaiPergigian
        : bilPegawaiPergigian,
      bilJuruterapi: singleAgensiLuarGTod
        ? singleAgensiLuarGTod.bilJuruterapi
        : bilJuruterapi,
      namaTaskaTadika: singleAgensiLuarGTod
        ? singleAgensiLuarGTod.namaTaskaTadika
        : namaTaskaTadika,
      alamatTaskaTadika: singleAgensiLuarGTod
        ? singleAgensiLuarGTod.alamatTaskaTadika
        : alamatTaskaTadika,
    };
    // console.log(Data);
    const kemaskiniAda = singleAgensiLuarGTod
      ? updateData('gtod', idGTod, Data)
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

  return (
    <>
      <form
        className='grid grid-cols-2 auto-rows-min gap-5 mx-10'
        onSubmit={handleSubmit}
      >
        <div className='grid grid-cols-2'>
          <label
            htmlFor='nama-agensi-luar'
            className='font-bold uppercase text-xs lg:text-sm flex justify-start place-items-center mr-2'
          >
            Nama Agensi Luar :
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
            className='font-bold uppercase text-xs lg:text-sm flex justify-start place-items-center mr-2'
          >
            Jenis Agensi Luar :
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
            <option value='universiti awam'>Universiti Awam</option>
            <option value='universiti swasta'>Universiti Swasta</option>
            <option value='pengamal pergigian swasta'>
              Pengamal Pergigian Swasta
            </option>
            <option value='badan bukan kerajaan'>
              Badan Bukan Kerajaan (NGO)
            </option>
            <option value='pemain industri'>Pemain Industri</option>
            <option value='lain-lain agensi'>Lain-Lain Agensi</option>
          </select>
        </div>
        <div className='grid grid-cols-2'>
          <label
            htmlFor='bil-pegawai-pergigian'
            className='font-bold uppercase text-xs lg:text-sm flex justify-start place-items-center mr-2'
          >
            Bilangan Pegawai Pergigian :
          </label>
          <input
            className='appearance-none w-full h-8 px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
            type='number'
            min='0'
            name='bil-pegawai-pergigian'
            id='bil-pegawai-pergigian'
            required
            value={
              singleAgensiLuarGTod
                ? singleAgensiLuarGTod.bilPegawaiPergigian
                : bilPegawaiPergigian
            }
            onChange={(e) => {
              if (singleAgensiLuarGTod) {
                setSingleAgensiLuarGTod({
                  ...singleAgensiLuarGTod,
                  bilPegawaiPergigian: e.target.value,
                });
              } else {
                setBilPegawaiPergigian(e.target.value);
              }
            }}
          />
        </div>
        <div className='grid grid-cols-2'>
          <label
            htmlFor='bil-juruterapi'
            className='font-bold uppercase text-xs lg:text-sm flex justify-start place-items-center mr-2'
          >
            Bilangan Juruterapi Pergigian :
          </label>
          <input
            className='appearance-none w-full h-8 px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
            type='number'
            min='0'
            name='bil-juruterapi'
            id='bil-juruterapi'
            required
            value={
              singleAgensiLuarGTod
                ? singleAgensiLuarGTod.bilJuruterapi
                : bilJuruterapi
            }
            onChange={(e) => {
              if (singleAgensiLuarGTod) {
                setSingleAgensiLuarGTod({
                  ...singleAgensiLuarGTod,
                  bilJuruterapi: e.target.value,
                });
              } else {
                setBilJuruterapi(e.target.value);
              }
            }}
          />
        </div>
        <div className='grid grid-cols-2'>
          <label
            htmlFor='nama-taska-tadika'
            className='font-bold uppercase text-xs lg:text-sm flex justify-start pt-1 mr-2'
          >
            Nama Taska/Tadika :
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
            className='font-bold uppercase text-xs lg:text-sm flex justify-start pt-1 mr-2'
          >
            Alamat Taska/Tadika :
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
        <span
          className='px-4 py-2 text-adminBlack rounded-md cursor-pointer hover:bg-user1 hover:bg-opacity-25'
          onClick={() => {
            setShowForm(false);
            window.location.reload();
          }}
        >
          Batal
        </span>
        {addingData ? (
          <span
            className='px-4 py-2 text-adminWhite bg-admin1 rounded-md cursor-not-allowed inline-flex justify-center items-center space-x-2'
            disabled
          >
            <BiWorld className='animate-spin' /> Menghantar
          </span>
        ) : (
          <button
            className='px-4 py-2 text-adminWhite bg-admin1 rounded-md cursor-pointer hover:bg-admin3'
            type='submit'
          >
            Hantar
          </button>
        )}
      </form>
    </>
  );
};

export default FormTambahProgramGtod;
