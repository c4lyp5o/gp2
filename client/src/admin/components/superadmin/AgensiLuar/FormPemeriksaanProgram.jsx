import { useState, useEffect } from 'react';
import moment from 'moment';
import { BiWorld } from 'react-icons/bi';

import { useGlobalAdminAppContext } from '../../../context/adminAppContext';

const FormPemeriksaanProgramGtod = ({
  idGTod,
  setShowFormPemeriksaan,
  setShowTable,
  visitNumber,
  pemeriksaanSatu,
  setPemeriksaanSatu,
  pemeriksaanDua,
  setPemeriksaanDua,
  reloadState,
  setReloadState,
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

  const [tarikhMulaLawatan, setTarikhMulaLawatan] = useState('');
  const [tarikhAkhirLawatan, setTarikhAkhirLawatan] = useState('');
  // const [enrolmenKurang4Tahun, setEnrolmenKurang4Tahun] = useState(0);
  // const [enrolmen5Tahun, setEnrolmen5Tahun] = useState(0);
  // const [enrolmen6Tahun, setEnrolmen6Tahun] = useState(0);
  const [kedatanganBaru, setKedatanganBaru] = useState(0);
  const [kedatanganUlangan, setKedatanganUlangan] = useState(0);
  const [dDesidus, setDDesidus] = useState(0);
  const [mDesidus, setMDesidus] = useState(0);
  const [fDesidus, setFDesidus] = useState(0);
  const [xDesidus, setXDesidus] = useState(0);
  const [aKebersihanMulut, setAKebersihanMulut] = useState(0);
  const [cKebersihanMulut, setCKebersihanMulut] = useState(0);
  const [eKebersihanMulut, setEKebersihanMulut] = useState(0);
  const [takPerluRawatan, setTakPerluRawatan] = useState(0);
  const [sapuanFvarnish, setSapuanFvarnish] = useState(0);
  const [todDirujuk, setTodDirujuk] = useState(0);
  const [hadirDirujuk, setHadirDirujuk] = useState(0);
  const [todAbses, setTodAbses] = useState(0);
  const [penilaianRisikoRendah, setPenilaianRisikoRendah] = useState(0);
  const [penilaianRisikoSederhana, setPenilaianRisikoSederhana] = useState(0);
  const [penilaianRisikoTinggi, setPenilaianRisikoTinggi] = useState(0);

  //datePicker issue
  const [tarikhMulaLawatanDP, setTarikhMulaLawatanDP] = useState(null);
  const [tarikhAkhirLawatanDP, setTarikhAkhirLawatanDP] = useState(null);

  const [addingData, setAddingData] = useState(false);

  let dataPemeriksaan = null;
  if (!pemeriksaanSatu) {
    dataPemeriksaan = pemeriksaanDua;
  }
  if (!pemeriksaanDua) {
    dataPemeriksaan = pemeriksaanSatu;
  }
  let isDisabled = false;
  if (dataPemeriksaan) {
    isDisabled = true;
  }

  const TarikhMulaLawatan = () => {
    return masterDatePicker({
      selected: dataPemeriksaan
        ? new Date(dataPemeriksaan.tarikhMulaLawatan)
        : tarikhMulaLawatanDP,
      disabled: isDisabled,
      required: true,
      selectsStart: true,
      startDate: tarikhMulaLawatanDP,
      endDate: tarikhAkhirLawatanDP,
      onChange: (date) => {
        const tempDate = moment(date).format('YYYY-MM-DD');
        setTarikhMulaLawatan(tempDate);
        setTarikhMulaLawatanDP(date);
      },
      filterDate: (date) => {
        return moment() > date;
      },
      className:
        'appearance-none w-28 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md hover:bg-admin4',
    });
  };

  const TarikhAkhirLawatan = () => {
    return masterDatePicker({
      selected: dataPemeriksaan
        ? new Date(dataPemeriksaan.tarikhAkhirLawatan)
        : tarikhAkhirLawatanDP,
      disabled: isDisabled,
      required: true,
      selectsEnd: true,
      startDate: tarikhMulaLawatanDP,
      endDate: tarikhAkhirLawatanDP,
      minDate: tarikhMulaLawatanDP,
      onChange: (date) => {
        const tempDate = moment(date).format('YYYY-MM-DD');
        setTarikhAkhirLawatan(tempDate);
        setTarikhAkhirLawatanDP(date);
      },
      filterDate: (date) => {
        return moment() > date;
      },
      className:
        'appearance-none w-28 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md hover:bg-admin4',
    });
  };

  const handleSubmitPemeriksaan = async (e) => {
    e.preventDefault();
    setAddingData(true);
    let Data;
    Data = {
      Id: idGTod,
      tarikhMulaLawatan: tarikhMulaLawatan,
      tarikhAkhirLawatan: tarikhAkhirLawatan,
      // enrolmenKurang4Tahun: enrolmenKurang4Tahun,
      // enrolmen5Tahun: enrolmen5Tahun,
      // enrolmen6Tahun: enrolmen6Tahun,
      kedatanganBaru: kedatanganBaru,
      kedatanganUlangan: kedatanganUlangan,
      dDesidus: dDesidus,
      mDesidus: mDesidus,
      fDesidus: fDesidus,
      xDesidus: xDesidus,
      aKebersihanMulut: aKebersihanMulut,
      cKebersihanMulut: cKebersihanMulut,
      eKebersihanMulut: eKebersihanMulut,
      takPerluRawatan: takPerluRawatan,
      sapuanFvarnish: sapuanFvarnish,
      todDirujuk: todDirujuk,
      hadirDirujuk: hadirDirujuk,
      todAbses: todAbses,
      penilaianRisikoRendah: penilaianRisikoRendah,
      penilaianRisikoSederhana: penilaianRisikoSederhana,
      penilaianRisikoTinggi: penilaianRisikoTinggi,
    };
    // console.log(Data);
    await toast
      .promise(
        createData('pemeriksaanGtod', Data),
        {
          pending: 'Memproses ...',
          success: 'Berjaya menambah data pemeriksaan',
          error: 'Gagal menambah data pemeriksaan',
        },
        {
          autoclose: 3000,
        }
      )
      .then((res) => {
        setShowFormPemeriksaan(false);
        setShowTable(true);
        setReloadState(!reloadState);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <form
        onSubmit={handleSubmitPemeriksaan}
        className='grid grid-cols-1 lg:grid-cols-2 gap-2'
      >
        <article className='flex flex-col p-2 pl-5 space-y-2 border border-user1 rounded-md col-span-1 lg:col-span-2'>
          <p className='flex font-semibold'>Tarikh Lawatan</p>
          <div className='flex justify-start place-items-center text-left space-x-2'>
            <p className='whitespace-nowrap'>
              Tarikh Mula<strong className='text-user9'>*</strong>
            </p>
            <TarikhMulaLawatan />
            <p className='whitespace-nowrap'>
              Tarikh Akhir<strong className='text-user9'>*</strong>
            </p>
            <TarikhAkhirLawatan />
          </div>
        </article>
        {/* <article className='flex flex-col p-2 pl-5 space-y-2 border border-user1 rounded-md'>
          <p className='flex font-semibold'>Enrolmen Tahun Semasa</p>
          <div className='flex flex-wrap space-x-3 items-center'>
            <label className='text-center'>{'< 4 tahun'}</label>
            <input
              type='number'
              min='0'
              required
              disabled={isDisabled}
              className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md shadow-user1'
              name='enrolmenKurang4Tahun'
              id='enrolmenKurang4Tahun'
              value={
                dataPemeriksaan
                  ? dataPemeriksaan.enrolmenKurang4Tahun
                  : enrolmenKurang4Tahun
              }
              onChange={(e) => {
                setEnrolmenKurang4Tahun(e.target.value);
              }}
            />
            <label className='text-center'>5 tahun</label>
            <input
              type='number'
              min='0'
              required
              disabled={isDisabled}
              className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md shadow-user1'
              name='enrolmen5Tahun'
              id='enrolmen5Tahun'
              value={
                dataPemeriksaan
                  ? dataPemeriksaan.enrolmen5Tahun
                  : enrolmen5Tahun
              }
              onChange={(e) => {
                setEnrolmen5Tahun(e.target.value);
              }}
            />
            <label className='text-center'>6 tahun</label>
            <input
              type='number'
              min='0'
              required
              disabled={isDisabled}
              className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md shadow-user1'
              name='enrolmen6Tahun'
              id='enrolmen6Tahun'
              value={
                dataPemeriksaan
                  ? dataPemeriksaan.enrolmen6Tahun
                  : enrolmen6Tahun
              }
              onChange={(e) => {
                setEnrolmen6Tahun(e.target.value);
              }}
            />
          </div>
        </article> */}
        <article className='flex flex-col p-2 pl-5 space-y-2 border border-user1 rounded-md'>
          <p className='flex font-semibold'>Kedatangan</p>
          <div className='flex flex-wrap space-x-3 items-center'>
            <label className='text-center'>
              Baru <strong className='text-user9'>*</strong>
            </label>
            <input
              type='number'
              min='0'
              required
              disabled={isDisabled}
              className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md hover:bg-admin4'
              name='kedatanganBaru'
              id='kedatanganBaru'
              value={
                dataPemeriksaan
                  ? dataPemeriksaan.kedatanganBaru
                  : kedatanganBaru
              }
              onChange={(e) => {
                setKedatanganBaru(e.target.value);
              }}
            />
            <label className='text-center'>
              Ulangan<strong className='text-user9'>*</strong>
            </label>
            <input
              type='number'
              min='0'
              required
              disabled={isDisabled}
              className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md hover:bg-admin4'
              name='kedatanganUlangan'
              id='kedatanganUlangan'
              value={
                dataPemeriksaan
                  ? dataPemeriksaan.kedatanganUlangan
                  : kedatanganUlangan
              }
              onChange={(e) => {
                setKedatanganUlangan(e.target.value);
              }}
            />
          </div>
        </article>
        <article className='flex flex-col p-2 pl-5 space-y-2 border border-user1 rounded-md normal-case'>
          <p className='flex font-semibold'>Status dmfx</p>
          <div className='flex flex-wrap space-x-3 items-center'>
            <label className='text-center'>
              d<strong className='text-user9'>*</strong>
            </label>
            <input
              type='number'
              min='0'
              required
              disabled={isDisabled}
              className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md hover:bg-admin4'
              name='dDesidus'
              id='dDesidus'
              value={dataPemeriksaan ? dataPemeriksaan.dDesidus : dDesidus}
              onChange={(e) => {
                setDDesidus(e.target.value);
              }}
            />
            <label className='text-center'>
              m<strong className='text-user9'>*</strong>
            </label>
            <input
              type='number'
              min='0'
              required
              disabled={isDisabled}
              className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md hover:bg-admin4'
              name='mDesidus'
              id='mDesidus'
              value={dataPemeriksaan ? dataPemeriksaan.mDesidus : mDesidus}
              onChange={(e) => {
                setMDesidus(e.target.value);
              }}
            />
            <label className='text-center'>
              f<strong className='text-user9'>*</strong>
            </label>
            <input
              type='number'
              min='0'
              required
              disabled={isDisabled}
              className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md hover:bg-admin4'
              name='fDesidus'
              id='fDesidus'
              value={dataPemeriksaan ? dataPemeriksaan.fDesidus : fDesidus}
              onChange={(e) => {
                setFDesidus(e.target.value);
              }}
            />
            <label className='text-center'>
              x<strong className='text-user9'>*</strong>
            </label>
            <input
              type='number'
              min='0'
              required
              disabled={isDisabled}
              className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md hover:bg-admin4'
              name='xDesidus'
              id='xDesidus'
              value={dataPemeriksaan ? dataPemeriksaan.xDesidus : xDesidus}
              onChange={(e) => {
                setXDesidus(e.target.value);
              }}
            />
          </div>
        </article>
        <article className='flex flex-col p-2 pl-5 space-y-2 border border-user1 rounded-md'>
          <p className='flex font-semibold'>Kebersihan Mulut</p>
          <div className='flex flex-wrap space-x-3 items-center'>
            <label className='text-center'>
              a<strong className='text-user9'>*</strong>
            </label>
            <input
              type='number'
              min='0'
              required
              disabled={isDisabled}
              className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md hover:bg-admin4'
              name='aKebersihanMulut'
              id='aKebersihanMulut'
              value={
                dataPemeriksaan
                  ? dataPemeriksaan.aKebersihanMulut
                  : aKebersihanMulut
              }
              onChange={(e) => {
                setAKebersihanMulut(e.target.value);
              }}
            />
            <label className='text-center'>
              c<strong className='text-user9'>*</strong>
            </label>
            <input
              type='number'
              min='0'
              required
              disabled={isDisabled}
              className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2  focus:border-b-admin1 focus:outline-none mb-1 shadow-md hover:bg-admin4'
              name='cKebersihanMulut'
              id='cKebersihanMulut'
              value={
                dataPemeriksaan
                  ? dataPemeriksaan.cKebersihanMulut
                  : cKebersihanMulut
              }
              onChange={(e) => {
                setCKebersihanMulut(e.target.value);
              }}
            />
            <label className='text-center'>
              e<strong className='text-user9'>*</strong>
            </label>
            <input
              type='number'
              min='0'
              required
              disabled={isDisabled}
              className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2  focus:border-b-admin1 focus:outline-none mb-1 shadow-md hover:bg-admin4'
              name='eKebersihanMulut'
              id='eKebersihanMulut'
              value={
                dataPemeriksaan
                  ? dataPemeriksaan.eKebersihanMulut
                  : eKebersihanMulut
              }
              onChange={(e) => {
                setEKebersihanMulut(e.target.value);
              }}
            />
          </div>
        </article>
        <article className='flex flex-col p-2 pl-5 space-y-2 border border-user1 rounded-md'>
          <p className='flex font-semibold'>
            Bilangan Tidak Perlu Rawatan (TPR)
          </p>
          <div className='flex flex-wrap space-x-3 items-center'>
            <label className='text-center'>
              Tak Perlu Rawatan<strong className='text-user9'>*</strong>
            </label>
            <input
              type='number'
              min='0'
              required
              disabled={isDisabled}
              className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2  focus:border-b-admin1 focus:outline-none mb-1 shadow-md hover:bg-admin4'
              name='takPerluRawatan'
              id='takPerluRawatan'
              value={
                dataPemeriksaan
                  ? dataPemeriksaan.takPerluRawatan
                  : takPerluRawatan
              }
              onChange={(e) => {
                setTakPerluRawatan(e.target.value);
              }}
            />
          </div>
        </article>
        <article className='flex flex-col p-2 pl-5 space-y-2 border border-user1 rounded-md'>
          <p className='flex font-semibold'>
            Bilangan Toddler Perlu Sapuan Varnish Berfluorida
          </p>
          <div className='flex flex-wrap space-x-3 items-center'>
            <label className='text-center'>
              Sapuan Varnish Berfluorida
              <strong className='text-user9'>*</strong>
            </label>
            <input
              type='number'
              min='0'
              required
              disabled={isDisabled}
              className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2  focus:border-b-admin1 focus:outline-none mb-1 shadow-md hover:bg-admin4'
              name='sapuanFvarnish'
              id='sapuanFvarnish'
              value={
                dataPemeriksaan
                  ? dataPemeriksaan.sapuanFvarnish
                  : sapuanFvarnish
              }
              onChange={(e) => {
                setSapuanFvarnish(e.target.value);
              }}
            />
          </div>
        </article>
        <article className='flex flex-col p-2 pl-5 space-y-2 border border-user1 rounded-md'>
          <p className='flex font-semibold'>
            Bilangan toddler dirujuk ke klinik pergigian (kali pertama)
          </p>
          <div className='flex flex-wrap space-x-3 items-center'>
            <label className='text-center'>
              Dirujuk<strong className='text-user9'>*</strong>
            </label>
            <input
              type='number'
              min='0'
              required
              disabled={isDisabled}
              className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2  focus:border-b-admin1 focus:outline-none mb-1 shadow-md hover:bg-admin4'
              name='todDirujuk'
              id='todDirujuk'
              value={dataPemeriksaan ? dataPemeriksaan.todDirujuk : todDirujuk}
              onChange={(e) => {
                setTodDirujuk(e.target.value);
              }}
            />
            {visitNumber === 1 && !pemeriksaanSatu && (
              <p className='flex'>
                <label className='text-center'>
                  Hadir Rujukan Lawatan Pertama
                  <strong className='text-user9'>*</strong>
                </label>
                <input
                  type='number'
                  min='0'
                  required
                  disabled={isDisabled}
                  className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2  focus:border-b-admin1 focus:outline-none mb-1 shadow-md hover:bg-admin4'
                  name='hadirDirujuk'
                  id='hadirDirujuk'
                  value={
                    dataPemeriksaan
                      ? dataPemeriksaan.hadirDirujuk
                      : hadirDirujuk
                  }
                  onChange={(e) => {
                    setHadirDirujuk(e.target.value);
                  }}
                />
              </p>
            )}
          </div>
        </article>
        <article className='flex flex-col p-2 pl-5 space-y-2 border border-user1 rounded-md'>
          <p className='flex font-semibold'>Bilangan Abses</p>
          <div className='flex flex-wrap space-x-3 items-center'>
            <label className='text-center'>
              Gigi Abses<strong className='text-user9'>*</strong>
            </label>
            <input
              type='number'
              min='0'
              required
              disabled={isDisabled}
              className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2  focus:border-b-admin1 focus:outline-none mb-1 shadow-md hover:bg-admin4'
              name='todAbses'
              id='todAbses'
              value={dataPemeriksaan ? dataPemeriksaan.todAbses : todAbses}
              onChange={(e) => {
                setTodAbses(e.target.value);
              }}
            />
          </div>
        </article>
        <article className='flex flex-col p-2 pl-5 space-y-2 border border-user1 rounded-md'>
          <p className='flex font-semibold'>Penilaian Risiko</p>
          <div className='flex flex-wrap space-x-3 items-center'>
            <label className='text-center'>Rendah</label>
            <input
              type='number'
              min='0'
              required
              disabled={isDisabled}
              className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2  focus:border-b-admin1 focus:outline-none mb-1 shadow-md hover:bg-admin4'
              name='penilaianRisikoRendah'
              id='penilaianRisikoRendah'
              value={
                dataPemeriksaan
                  ? dataPemeriksaan.penilaianRisikoRendah
                  : penilaianRisikoRendah
              }
              onChange={(e) => {
                setPenilaianRisikoRendah(e.target.value);
              }}
            />
            <label className='text-center'>Sederhana</label>
            <input
              type='number'
              min='0'
              required
              disabled={isDisabled}
              className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2  focus:border-b-admin1 focus:outline-none mb-1 shadow-md hover:bg-admin4'
              name='penilaianRisikoSederhana'
              id='penilaianRisikoSederhana'
              value={
                dataPemeriksaan
                  ? dataPemeriksaan.penilaianRisikoSederhana
                  : penilaianRisikoSederhana
              }
              onChange={(e) => {
                setPenilaianRisikoSederhana(e.target.value);
              }}
            />
            <label className='text-center'>Tinggi</label>
            <input
              type='number'
              min='0'
              required
              disabled={isDisabled}
              className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2  focus:border-b-admin1 focus:outline-none mb-1 shadow-md hover:bg-admin4'
              name='penilaianRisikoTinggi'
              id='penilaianRisikoTinggi'
              value={
                dataPemeriksaan
                  ? dataPemeriksaan.penilaianRisikoTinggi
                  : penilaianRisikoTinggi
              }
              onChange={(e) => {
                setPenilaianRisikoTinggi(e.target.value);
              }}
            />
          </div>
        </article>
        <span
          className='px-4 py-2 text-adminBlack shadow-md border border-user1 bg-admin5 rounded-md cursor-pointer hover:bg-user1 hover:bg-opacity-25'
          onClick={() => {
            setShowFormPemeriksaan(false);
            setShowTable(true);
            setReloadState(!reloadState);
            setPemeriksaanSatu(null);
            setPemeriksaanDua(null);
          }}
        >
          batal
        </span>
        {addingData ? (
          <span
            className='px-4 py-2 text-adminWhite bg-admin1 rounded-md cursor-not-allowed inline-flex justify-center items-center space-x-2'
            disabled
          >
            <BiWorld className='animate-spin' /> Menghantar
          </span>
        ) : dataPemeriksaan ? null : (
          <button
            className='px-4 py-2 text-adminWhite shadow-md border border-user1 bg-admin1 rounded-md cursor-pointer hover:bg-admin3'
            type='submit'
          >
            Hantar
          </button>
        )}
      </form>
    </>
  );
};

export default FormPemeriksaanProgramGtod;
