import { useState } from 'react';
import axios from 'axios';
import {
  BsFilePerson,
  BsFillFilePersonFill,
  BsFillInfoCircleFill,
} from 'react-icons/bs';
import { TbArrowBigLeftLine } from 'react-icons/tb';
import { toast } from 'react-toastify';
import moment from 'moment';

import { useGlobalUserAppContext } from '../../context/userAppContext';

import PrintPatientDetails from './PrintPatientDetails';

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
    dictionaryBulan,
  } = useGlobalUserAppContext();

  const [generating, setGenerating] = useState(false);
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

  //carian ic semua
  const keys = ['nama', 'ic', 'statusReten'];

  const penjanaanReten = async (e) => {
    try {
      const res = await axios.get(
        `/api/v1/generate/download?jenisReten=PG101A&tarikhMula=${moment(
          new Date()
        )
          .startOf('month')
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
          toast.error('Tiada data untuk tarikh yang dipilih');
          break;
        default:
          toast.error('Internal Server Error');
          break;
      }
    }
  };

  const handleJana = async (e) => {
    setGenerating(true);
    const id = toast.loading('Sedang menjana reten...');
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
        // kalau diorang refresh, hehehe...
        const cooldown = setInterval(() => {
          setDefaultTimer((timer) => timer - 1);
        }, 1000);
        setTimeout(() => {
          clearInterval(cooldown);
          setDefaultTimer(60);
          setGenerating(false);
        }, 60000);
      });
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

  if (!showForm && !showPilihanProgram) {
    return (
      <>
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
            {generating ? (
              <button
                className='px-6 py-2.5 m-1 w-60 bg-kaunter3 hover:bg-kaunter2 font-medium text-xs uppercase rounded-md shadow-md transition-all'
                type='button'
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
                      stroke-width='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8v1a7 7 0 00-7 7h1z'
                    ></path>
                  </svg>
                  <span>Cooldown {defaultTimer} saat</span>
                </div>
              </button>
            ) : (
              <button
                onClick={() => handleJana()}
                className='px-6 py-2.5 m-1 w-60 bg-kaunter3 hover:bg-kaunter2 font-medium text-xs uppercase rounded-md shadow-md transition-all'
              >
                Jana Reten PG101A ({dictionaryBulan[new Date().getMonth() + 1]})
              </button>
            )}
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
                    keys.some((key) => pt[key].toLowerCase().includes(philter))
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
        </div>
      </>
    );
  }
}
