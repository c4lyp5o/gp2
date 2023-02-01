import { useState } from 'react';
import axios from 'axios';
import {
  BsFilePerson,
  BsFillFilePersonFill,
  BsFillInfoCircleFill,
} from 'react-icons/bs';
import { FaWindowClose } from 'react-icons/fa';
import { TbArrowBigLeftLine } from 'react-icons/tb';
import { toast } from 'react-toastify';
import moment from 'moment';

import { useGlobalUserAppContext } from '../../context/userAppContext';
import PrintPatientDetails from './PrintPatientDetails';

const PilihanBulan = (props) => {
  const noWayBack = () => {
    if (props.generatingNoWayBack) {
      toast.warning('Sila sabar menunggu...', {
        autoClose: 2000,
        pauseOnHover: false,
      });
      return;
    }
    if (!props.generatingNoWayBack) {
      props.setShowBulan(false);
    }
  };

  return (
    <>
      <div className='absolute inset-x-10 inset-y-5 lg:inset-x-1/3 lg:inset-y-7 text-sm bg-userWhite z-20 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'>
        <FaWindowClose
          onClick={noWayBack}
          className='absolute mr-1 mt-1 text-xl text-userBlack right-0 hover:cursor-pointer hover:text-user2 transition-all'
        />

        <h5 className='bg-kaunter1 text-userWhite font-semibold text-lg'>
          Pilih Bulan Untuk Penjanaan PG101A
        </h5>
        <form onSubmit={props.handleJana}>
          <div className='p-10'>
            <label
              htmlFor='bulan-jana'
              className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
            >
              Bulan:
            </label>
            <select
              required
              name='bulan-jana'
              id='bulan-jana'
              onChange={(e) => {
                props.setPilihanBulan(e.target.value);
              }}
              className='w-full leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md'
            >
              <option value=''>Sila pilih bulan..</option>
              {props.namaNamaBulan.map((n, index) => {
                return (
                  <option value={n.value} key={index} className='capitalize'>
                    {n.nama}
                  </option>
                );
              })}
            </select>
          </div>
          <div className='absolute grid grid-cols-2 bottom-0 right-0 left-0 m-2 mx-10'>
            {props.generating ? (
              <button
                type='button'
                className='capitalize bg-kaunter3 justify-center rounded-md p-2 mr-2 inline-flex cursor-not-allowed'
                disabled
              >
                <div className='flex flex-row items-center'>
                  <svg
                    className='animate-spin -ml-1 mr-3 h-3 w-5 text-userWhite'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8v1a7 7 0 00-7 7h1z'
                    ></path>
                  </svg>
                  <span className='text-userWhite'>{props.defaultTimer}</span>
                </div>
              </button>
            ) : (
              <button
                type='submit'
                className='capitalize bg-kaunter1 text-userWhite rounded-md shadow-xl p-2 mr-3 hover:bg-kaunter2 transition-all'
              >
                Jana !
              </button>
            )}
            <span
              className='capitalize bg-userWhite text-userBlack rounded-md p-2 ml-3 hover:bg-user5 hover:cursor-pointer transition-all'
              onClick={noWayBack}
            >
              Kembali
            </span>
          </div>
        </form>
      </div>
      <div
        onClick={noWayBack}
        className='absolute inset-0 bg-user1 z-10 opacity-75'
      />
    </>
  );
};

export default function PatientData({
  jenisFasiliti,
  data,
  setData,
  setIsLoading,
  philter,
  setPhilter,
  showForm,
  setShowForm,
  setEditId,
  jenisProgram,
  setJenisProgram,
  namaProgram,
  setNamaProgram,
  showPilihanProgram,
  setShowPilihanProgram,
  kp,
}) {
  const {
    kaunterToken,
    Dictionary,
    dateToday,
    formatTime,
    noPendaftaranSplitter,
    statusPesakit,
  } = useGlobalUserAppContext();

  const [showBulan, setShowBulan] = useState(false);
  const [pilihanBulan, setPilihanBulan] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatingNoWayBack, setGeneratingNoWayBack] = useState(false);
  const [defaultTimer, setDefaultTimer] = useState(60);

  const formatMelayu = (date) => {
    const months = {
      1: 'Januari',
      2: 'Februari',
      3: 'Mac',
      4: 'April',
      5: 'Mei',
      6: 'Jun',
      7: 'Julai',
      8: 'Ogos',
      9: 'September',
      10: 'Oktober',
      11: 'November',
      12: 'Disember',
    };
    const dateObj = new Date(date);
    const month = months[dateObj.getMonth() + 1];
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();
    const output = day + ' ' + month + ' ' + year;
    return output;
  };

  // carian dengan nama, ic, statusReten
  const keys = ['nama', 'ic', 'statusReten'];

  // bulan untuk jana reten PG101A
  const namaNamaBulan = [
    { nama: 'Januari', value: `${new Date().getFullYear()}-01-01` },
    { nama: 'Februari', value: `${new Date().getFullYear()}-02-01` },
    { nama: 'Mac', value: `${new Date().getFullYear()}-03-01` },
    { nama: 'April', value: `${new Date().getFullYear()}-04-01` },
    { nama: 'Mei', value: `${new Date().getFullYear()}-05-01` },
    { nama: 'Jun', value: `${new Date().getFullYear()}-06-01` },
    { nama: 'Julai', value: `${new Date().getFullYear()}-07-01` },
    { nama: 'Ogos', value: `${new Date().getFullYear()}-08-01` },
    { nama: 'September', value: `${new Date().getFullYear()}-09-01` },
    { nama: 'Oktober', value: `${new Date().getFullYear()}-10-01` },
    { nama: 'November', value: `${new Date().getFullYear()}-11-01` },
    { nama: 'Disember', value: `${new Date().getFullYear()}-12-01` },
  ];

  const penjanaanReten = async (e) => {
    try {
      const res = await axios.get(
        `/api/v1/generate/download?jenisReten=PG101A&tarikhMula=${moment(
          pilihanBulan
        )
          .startOf('month')
          .format('YYYY-MM-DD')}&tarikhAkhir=${moment(pilihanBulan)
          .endOf('month')
          .format('YYYY-MM-DD')}`,
        {
          headers: {
            Authorization: kaunterToken,
          },
          responseType: 'blob',
        }
      );
      return res;
    } catch (err) {
      // console.log(err.response);
      switch (err.response.status) {
        case 401:
          toast.error(
            'Anda telah mencapai jumlah batasan penjanaan PG101A bagi bulan ini'
          );
          break;
        case 403:
          toast.error('Anda tidak dibenarkan untuk menjana reten');
          break;
        case 404:
          toast.error('Tiada pesakit untuk bulan yang dipilih');
          break;
        default:
          toast.error('Internal Server Error');
          break;
      }
    }
  };

  const handleJana = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setGeneratingNoWayBack(true);
    const id = toast.loading('Sedang menjana reten, sila tunggu...');
    setTimeout(async () => {
      await penjanaanReten()
        .then((res) => {
          saveFile(res.data);
        })
        .then(() => {
          toast.update(id, {
            render: 'Berjaya menjana reten',
            type: 'success',
            isLoading: false,
            autoClose: 2000,
          });
          setGeneratingNoWayBack(false);
          // kalau diorang refresh, hehehe...
          const cooldown = setInterval(() => {
            setDefaultTimer((timer) => timer - 1);
          }, 1000);
          setTimeout(() => {
            clearInterval(cooldown);
            setDefaultTimer(60);
            setGenerating(false);
          }, 60000);
          setShowBulan(false);
        })
        .catch((err) => {
          toast.dismiss(id);
          setGenerating(false);
          setGeneratingNoWayBack(false);
        });
    }, 10000);
  };

  const saveFile = (blob) => {
    const link = document.createElement('a');
    link.download = `PG101A_${kp}_${moment(new Date()).format(
      'DDMMYYYY'
    )}.xlsx`;
    link.href = URL.createObjectURL(new Blob([blob]));
    link.addEventListener('click', (e) => {
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
      }, 100);
    });
    link.click();
  };

  const reloadData = async () => {
    try {
      setIsLoading(true);
      if (jenisFasiliti !== 'projek-komuniti-lain') {
        const { data } = await axios.get(
          `/api/v1/query/kaunter?tarikhKedatangan=${dateToday}&jenisFasiliti=${jenisFasiliti}`,
          { headers: { Authorization: `Bearer ${kaunterToken}` } }
        );
        setData(data);
      }
      if (jenisFasiliti === 'projek-komuniti-lain') {
        const { data } = await axios.get(
          `/api/v1/query/kaunter?tarikhKedatangan=${dateToday}&namaProgram=${namaProgram}`,
          { headers: { Authorization: `Bearer ${kaunterToken}` } }
        );
        setData(data);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const props = {
    handleJana,
    pilihanBulan,
    setPilihanBulan,
    setShowBulan,
    namaNamaBulan,
    generating,
    generatingNoWayBack,
    defaultTimer,
  };

  if (!showForm && !showPilihanProgram) {
    return (
      <>
        <div className='py-3'>
          <div className='grid grid-cols-1 lg:grid-cols-2'>
            <div className='font-semibold text-user6 mt-2 ml-3 lg:mr-auto'>
              <p className='flex flex-row'>
                Fasiliti: {Dictionary[jenisFasiliti]}
              </p>
              {jenisFasiliti === 'projek-komuniti-lain' ? (
                <>
                  <span
                    className='absolute top-5 left-2 text-admin2 text-lg h-96 cursor-pointer'
                    onClick={() => {
                      setNamaProgram('');
                      setShowPilihanProgram(true);
                    }}
                  >
                    <TbArrowBigLeftLine />
                  </span>
                  <p className='flex flex-row'>
                    Jenis Program: {Dictionary[jenisProgram]}
                  </p>
                  <p className='flex flex-row'>Nama Program: {namaProgram}</p>
                </>
              ) : null}
            </div>
            <p className='font-semibold text-user6 lg:mt-2 mr-3 lg:ml-auto'>
              Tarikh: {formatMelayu(dateToday)}
            </p>
          </div>
          <div className='flex justify-center'>
            <div className='mb-3 w-64 relative'>
              <input
                type='search'
                className='outline outline-1 outline-userBlack rounded-md p-3'
                id='carianPesakit'
                placeholder='Carian Pesakit'
                title='Ruangan carian ini hanyalah untuk tujuan kemaskini pesakit yg didaftar pada hari tersebut sahaja'
                onChange={(e) => setPhilter(e.target.value.toLowerCase())}
              />
              <BsFillInfoCircleFill
                className='text-user9 text-2xl inline-table ml-5 pb-1 absolute top-3 -right-5'
                title='Ruangan carian ini hanyalah untuk tujuan kemaskini pesakit yg didaftar pada hari tersebut sahaja'
              />
            </div>
          </div>
          {jenisFasiliti === 'kp' ? (
            <div>
              <button
                type='button'
                className='px-6 py-2.5 m-1 w-60 bg-kaunter3 hover:bg-kaunter2 font-medium text-xs uppercase rounded-md shadow-md transition-all'
                onClick={() => setShowForm(true)}
              >
                Daftar Pesakit
              </button>
              <button
                onClick={() => setShowBulan(true)}
                className='px-6 py-2.5 m-1 w-60 bg-kaunter3 hover:bg-kaunter2 font-medium text-xs uppercase rounded-md shadow-md transition-all'
              >
                Jana Reten PG101A
              </button>
            </div>
          ) : (
            <button
              type='button'
              className='px-6 py-2.5 m-1 w-60 bg-kaunter3 hover:bg-kaunter2 font-medium text-xs uppercase rounded-md shadow-md transition-all'
              onClick={() => setShowForm(true)}
            >
              Daftar Pesakit
            </button>
          )}
          <div className='mt-2'>
            <div className='justify-center items-center'>
              <p className='text-xs text-user9 lowercase'>
                * sekiranya terdapat dua pendaftaran yang sama, sila hubungi
                pengguna
                <b className='mr-1 uppercase'> 'pentadbir'</b>
                klinik pergigian anda
              </p>
              <button
                onClick={reloadData}
                className='flex ml-auto pr-3 px-6 py-2.5 my-1 bg-kaunter2 hover:bg-kaunter3 font-medium text-xs uppercase rounded-md shadow-md transition-all'
              >
                Kemaskini senarai pesakit
              </button>
              <div className='m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max'>
                <table className='table-auto'>
                  <thead className='text-userWhite bg-kaunter2'>
                    <tr>
                      <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                        BIL
                      </th>
                      <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                        WAKTU SAMPAI
                      </th>
                      <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                        NO. PENDAFTARAN
                      </th>
                      <th className='px-2 py-1 outline outline-1 outline-offset-1 md:w-screen md:max-w-md lg:w-screen lg:max-w-screen-lg'>
                        NAMA PESAKIT
                      </th>
                      <th className='px-2 py-1 outline outline-1 outline-offset-1 w-80'>
                        NO. PENGENALAN DIRI
                      </th>
                      <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                        STATUS PESAKIT
                      </th>
                      <th className='px-2 py-1 outline outline-1 outline-offset-1 w-80'>
                        STATUS PENGISIAN RETEN
                      </th>
                      {jenisFasiliti === 'kk-kd' ? (
                        <th className='px-2 py-1 outline outline-1 outline-offset-1 w-80'>
                          NAMA KKIA / KD
                        </th>
                      ) : null}
                      {jenisFasiliti === 'taska-tadika' ? (
                        <th className='px-2 py-1 outline outline-1 outline-offset-1 w-80'>
                          NAMA TASKA/TADIKA
                        </th>
                      ) : null}
                      {jenisFasiliti === 'projek-komuniti-lain' ? (
                        <th className='px-2 py-1 outline outline-1 outline-offset-1 w-80'>
                          NAMA PROGRAM
                        </th>
                      ) : null}
                      <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                        TINDAKAN
                      </th>
                    </tr>
                  </thead>
                  {data.kaunterResultQuery
                    .filter((pt) =>
                      keys.some((key) =>
                        pt[key].toLowerCase().includes(philter)
                      )
                    )
                    .map((p, index) => (
                      <>
                        <tbody className='bg-kaunter3'>
                          <tr>
                            <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1'>
                              {index + 1}
                            </td>
                            <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1'>
                              {p.waktuSampai !== ''
                                ? formatTime(p.waktuSampai)
                                : '-'}
                            </td>
                            {p.noPendaftaranBaru ? (
                              <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1 uppercase'>
                                {noPendaftaranSplitter(p.noPendaftaranBaru)}
                                <BsFilePerson
                                  className='text-user7 text-2xl inline-table mx-2 pb-1'
                                  title='Baru'
                                />
                              </td>
                            ) : (
                              <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1 uppercase'>
                                {noPendaftaranSplitter(p.noPendaftaranUlangan)}
                                <BsFillFilePersonFill
                                  className='text-user9 text-2xl inline-table mx-2 pb-1'
                                  title='Ulangan'
                                />
                              </td>
                            )}
                            <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1 uppercase'>
                              {p.nama}
                            </td>
                            <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1 uppercase'>
                              {p.ic}
                            </td>
                            <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1'>
                              {statusPesakit(p)}
                            </td>
                            <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1'>
                              {p.statusReten}
                            </td>
                            {jenisFasiliti === 'kk-kd' ? (
                              <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1'>
                                {p.namaFasilitiKkKd}
                              </td>
                            ) : null}
                            {jenisFasiliti === 'taska-tadika' ? (
                              <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1'>
                                {p.namaFasilitiTaskaTadika}
                              </td>
                            ) : null}
                            {jenisFasiliti === 'projek-komuniti-lain' ? (
                              <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1'>
                                {p.namaProgram}
                              </td>
                            ) : null}
                            <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1 flex flex-row'>
                              <button
                                className='w-24 py-2.5 my-1 mx-1 bg-kaunter2 hover:bg-kaunter1 font-medium text-xs uppercase rounded-md shadow-md transition-all'
                                onClick={(e) => {
                                  setEditId(p._id);
                                  setShowForm(true);
                                }}
                              >
                                Kemaskini
                              </button>
                              {/* <PrintPatientDetails data={p} /> */}
                            </td>
                          </tr>
                        </tbody>
                      </>
                    ))}
                </table>
              </div>
            </div>
            {showBulan ? <PilihanBulan {...props} /> : null}
          </div>
        </div>
      </>
    );
  }
}
