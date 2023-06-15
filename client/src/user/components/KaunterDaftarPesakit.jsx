import { useEffect, useState } from 'react';
import { Spinner } from 'react-awesome-spinners';
import axios from 'axios';
import { BsFilePerson, BsFillFilePersonFill } from 'react-icons/bs';
import {
  GiTakeMyMoney,
  GiMedicalPack,
  GiMustache,
  GiBeehive,
} from 'react-icons/gi';
import { FaSort, FaSortUp, FaSortDown, FaInfoCircle } from 'react-icons/fa';
import moment from 'moment';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

import KemaskiniResit from './pt-registration/KemaskiniResit';
// import PrintPatientDetails from './pt-registration/PrintPatientDetails';

import 'react-datepicker/dist/react-datepicker.css';

import { useGlobalUserAppContext } from '../context/userAppContext';

export default function DaftarPesakit({ createdByKp }) {
  const {
    kaunterToken,
    dateToday,
    dateYesterday,
    datePastTwoDays,
    formatTime,
    noPendaftaranSplitter,
    statusPesakit,
    percentageCalc,
    masterDatePicker,
    Dictionary,
    toast,
  } = useGlobalUserAppContext();

  const [allPersonKaunter, setAllPersonKaunter] = useState(null);
  const [philter, setPhilter] = useState('');
  const [tarikhKedatangan, setTarikhKedatangan] = useState(
    moment(dateToday).format('YYYY-MM-DD')
  );
  const [generating, setGenerating] = useState(false);

  //tukar carian semua
  const [flipCarian, setFlipCarian] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isShown, setIsShown] = useState(false);

  const [pilihQuery, setPilihQuery] = useState('ic');
  const [idQuery, setIdQuery] = useState('');
  const [nameQuery, setNameQuery] = useState('');

  //other
  const [showDoughnut, setShowDoughnut] = useState(false);

  // datepicker issue
  const [tarikhKedatanganDP, setTarikhKedatanganDP] = useState(
    moment(dateToday, moment.ISO_8601).toDate()
  );

  const [sort, setSort] = useState({
    tarikhKedatangan: false,
    masaDaftar: false,
    nama: false,
    noPid: false,
    jenisFasiliti: false,
  });

  const [totalPesakit, setTotalPesakit] = useState({
    totalPesakit: 0,
    totalBaru: 0,
    totalUlangan: 0,
    totalEgl: 0,
    totalBayaran: 0,
    totalStatus: 0,
  });

  // state untuk kemaskini resit pt bagi 3 hari yang lepas
  const [showKemaskiniResit, setShowKemaskiniResit] = useState(false);
  const [editId, setEditId] = useState('');

  const saveFile = (blob) => {
    const link = document.createElement('a');
    link.download = `PG101A-${createdByKp}-${moment(dateToday).format(
      'DD-MM-YYYY'
    )}.xlsx`;
    link.href = URL.createObjectURL(new Blob([blob]));
    link.addEventListener('click', (e) => {
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
      }, 100);
    });
    link.click();
  };

  const handleJana = async (e) => {
    e.preventDefault();
    setGenerating(true);
    await toast
      .promise(
        axios.get(
          `/api/v1/generate/download?jenisReten=PG101A&tarikhMula=2023-01-01&tarikhAkhir=2023-12-31&formatFile=xlsx`,
          {
            headers: { Authorization: kaunterToken },
            responseType: 'blob',
          }
        ),
        {
          pending: 'Menghasilkan reten...',
          success: 'Reten berjaya dihasilkan',
          error: 'Reten tidak berjaya dihasilkan',
        },
        { autoClose: 2000 }
      )
      .then((blob) => {
        saveFile(blob.data);
      });
    setTimeout(() => {
      setGenerating(false);
    }, 5000);
  };

  const TarikhKedatangan = () => {
    return masterDatePicker({
      selected: tarikhKedatanganDP,
      onChange: (tarikhKedatangan) => {
        const tempDate = moment(tarikhKedatangan).format('YYYY-MM-DD');
        setTarikhKedatangan(tempDate);
        setTarikhKedatanganDP(tarikhKedatangan);
      },
      className:
        'appearance-none w-auto text-sm leading-7 px-2 py-1 ring-2 ring-kaunter2 focus:ring-2 focus:ring-kaunter1 focus:outline-none rounded-md shadow-md uppercase flex flex-row ml-2',
    });
  };

  useEffect(() => {
    if (showKemaskiniResit === false) {
      const fetchAllPersonKaunter = async () => {
        try {
          setAllPersonKaunter(null);
          const { data } = await axios.get(
            `/api/v1/query/kaunter?tarikhKedatangan=${tarikhKedatangan}`,
            {
              headers: { Authorization: `Bearer ${kaunterToken}` },
            }
          );
          setAllPersonKaunter(data);

          //calculate total pesakit if ada tarikh kedatangan same
          const totalPesakit = data.kaunterResultQuery.filter(
            (item) => item.tarikhKedatangan === tarikhKedatangan
          );
          const totalBaru = totalPesakit.filter(
            (item) => item.kedatangan === 'baru-kedatangan'
          );
          const totalLama = totalPesakit.filter(
            (item) => item.kedatangan === 'ulangan-kedatangan'
          );
          const totalEgl = totalPesakit.filter(
            (item) => item.kakitanganKerajaan === true
          );
          let sum = 0;
          totalPesakit.forEach((obj) => {
            sum += parseFloat(obj.noBayaran.replace('RM ', '')) || 0;
            sum += parseFloat(obj.noBayaran2.replace('RM ', '')) || 0;
            sum += parseFloat(obj.noBayaran3.replace('RM ', '')) || 0;
          });
          const totalStatus = totalPesakit.filter(
            (item) => item.statusReten === 'telah diisi'
          );

          setTotalPesakit({
            totalPesakit: totalPesakit.length,
            totalBaru: totalBaru.length,
            totalUlangan: totalLama.length,
            totalEgl: totalEgl.length,
            totalBayaran: sum,
            totalStatus: totalStatus.length,
          });
        } catch (error) {
          console.log(error);
          // toast.error(
          //   'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: kaunter-reg-mlt'
          // );
        }
      };
      fetchAllPersonKaunter();
    }
  }, [tarikhKedatangan, showKemaskiniResit]);

  //handlesubmit ic and nama search query
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (pilihQuery === 'ic') {
      if (idQuery.trim().length <= 7) {
        toast.error('Sila masukkan nombor kad pengenalan melebihi 8 aksara');
        return;
      }
      try {
        const { data } = await axios.get(
          `/api/v1/query/kaunter?ic=${idQuery}`,
          {
            headers: { Authorization: `Bearer ${kaunterToken}` },
          }
        );
        setSearchResults(data.kaunterResultQuery);
        if (data.kaunterResultQuery.length === 0) {
          toast.error('Tiada rekod ditemui di klinik ini');
        } else {
          toast.success('Rekod ditemui');
        }
      } catch (error) {
        console.log(error);
        setSearchResults([]);
      }
    }
    if (pilihQuery === 'nama') {
      if (nameQuery.trim().length <= 4) {
        toast.error('Sila masukkan nama melebihi 5 aksara');
        return;
      }
      try {
        const { data } = await axios.get(
          `/api/v1/query/kaunter?nama=${nameQuery}`,
          {
            headers: { Authorization: `Bearer ${kaunterToken}` },
          }
        );
        setSearchResults(data.kaunterResultQuery);
        if (data.kaunterResultQuery.length === 0) {
          toast.error('Tiada rekod ditemui di klinik ini');
        } else {
          toast.success('Rekod ditemui');
        }
      } catch (error) {
        console.log(error);
        setSearchResults([]);
      }
    }
  };

  //reset carian
  useEffect(() => {
    if (pilihQuery === 'ic') {
      setNameQuery('');
      setSearchResults([]);
    } else {
      setIdQuery('');
      setSearchResults([]);
    }
  }, [pilihQuery]);

  useEffect(() => {
    if (flipCarian) {
      setNameQuery('');
      setIdQuery('');
      setSearchResults([]);
    }
  }, [flipCarian]);

  //carian ic semua
  const keys = ['nama', 'ic'];

  const data = {
    labels: ['Telah Diisi', 'Belum Diisi'],
    datasets: [
      {
        label: 'Jumlah',
        data: [
          totalPesakit.totalStatus,
          totalPesakit.totalPesakit - totalPesakit.totalStatus,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 1)', // Filled color
          'rgba(255, 99, 132, 1)', // Remaining color
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)', // Filled border color
          'rgba(255, 99, 132, 1)', // Remaining border color
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <div className='px-2 lg:px-7 h-full py-3 overflow-y-auto'>
        <div className='flex items-center justify-center mb-2 sticky'>
          <h1 className='text-xl font-bold'>CARIAN DAFTAR PESAKIT</h1>
          <div className='md:absolute right-5 ml-2'>
            {flipCarian ? (
              <span
                onClick={() => setFlipCarian(false)}
                className='cursor-pointer bg-kaunter2 hover:bg-kaunter3 text-userWhite text-sm px-2 py-1 rounded-md shadow-md whitespace-nowrap normal-case transition-all'
                data-cy='carian-tanpa-tarikh'
              >
                Carian dengan tarikh kedatangan
              </span>
            ) : (
              <span
                onClick={() => setFlipCarian(true)}
                className='cursor-pointer bg-kaunter2 hover:bg-kaunter3 text-userWhite text-sm px-2 py-1 rounded-md shadow-md whitespace-nowrap normal-case transition-all'
                data-cy='carian-tanpa-tarikh'
              >
                Carian tanpa tarikh kedatangan
              </span>
            )}
          </div>
        </div>
        {flipCarian ? (
          <form
            onSubmit={handleSubmit}
            className='flex flex-col md:flex-row justify-center gap-1 mb-2'
          >
            <div className='flex flex-row w-full md:w-96'>
              <div className='relative w-40 flex flex-row'>
                <select
                  name='pilih-query'
                  id='pilih-query'
                  value={pilihQuery}
                  onChange={(e) => {
                    setPilihQuery(e.target.value);
                  }}
                  className='bg-kaunter4 text-kaunterWhite appearance-none w-40 text-sm leading-7 px-2 py-1 border border-user1 focus:outline-none rounded-md shadow-md uppercase mr-2'
                  data-cy='pilih-query'
                >
                  <option value='ic'>PENGENALAN DIRI</option>
                  <option value='nama'>NAMA</option>
                </select>
                <span>
                  <FaSortDown className='absolute top-2 right-3 text-kaunterWhite' />
                </span>
              </div>
              {pilihQuery === 'nama' ? (
                <label
                  className='flex w-full md:w-52'
                  title='Carian nama mesti mengandungi sekurang-kurangnya 5 huruf'
                >
                  <input
                    type='text'
                    value={nameQuery}
                    onChange={(event) => setNameQuery(event.target.value)}
                    className='appearance-none text-sm w-full md:w-52 leading-7 px-2 py-1 border border-user1 focus:outline-none rounded-md shadow-md uppercase'
                    data-cy='name-query'
                  />
                </label>
              ) : (
                <label
                  className='flex w-full md:w-52'
                  title='Carian kad pengenalan mesti mengandungi sekurang-kurangnya 8 aksara'
                >
                  <input
                    type='text'
                    value={idQuery}
                    onChange={(event) => setIdQuery(event.target.value)}
                    className='appearance-none w-full md:w-52 text-sm leading-7 px-2 py-1 border border-user1 focus:outline-none rounded-md shadow-md uppercase'
                    data-cy='id-query'
                  />
                </label>
              )}
              <div className='relative flex items-center ml-1'>
                <FaInfoCircle
                  className='text-lg text-kaunter1'
                  onClick={() => setIsShown(!isShown)}
                />
                {isShown && pilihQuery === 'nama' && (
                  <div className='absolute top-8 right-2 w-36 text-left z-10 bg-kaunter4 text-kaunterWhite text-sm px-2 py-1 rounded-md whitespace-pre-wrap'>
                    <p className='text-center'>
                      Carian nama hanya dihasilkan apabila melebihi lima huruf
                    </p>
                  </div>
                )}
                {isShown && pilihQuery === 'ic' && (
                  <div className='absolute top-8 right-2 w-36 text-left z-10 bg-kaunter4 text-kaunterWhite text-sm px-2 py-1 rounded-md whitespace-pre-wrap'>
                    <p className='text-center'>
                      Carian dengan pengenalan diri hanya dihasilkan apabila
                      melebihi lapan aksara
                    </p>
                  </div>
                )}
                <div
                  className={`fixed inset-0 h-full w-full ${
                    isShown ? 'block' : 'hidden'
                  }`}
                  onClick={() => setIsShown(!isShown)}
                />
              </div>
            </div>
            <div className='flex justify-end'>
              <button
                type='submit'
                className='appearance-none w-16 text-sm leading-7 px-2 py-1 ml-2 focus:outline-none rounded-md shadow-md uppercase bg-kaunter2 hover:bg-kaunter3'
                data-cy='cari'
              >
                Cari
              </button>
            </div>
          </form>
        ) : (
          <div className='flex flex-col lg:flex-row justify-center items-center mb-2'>
            <div
              className='mx-2 px-5 lg:px-0 flex flex-col lg:flex-row lg:items-center lg:justify-center w-full lg:w-auto'
              title='carian nama dan kad pengenalan'
            >
              <label
                htmlFor='pilihanNama'
                className='whitespace-nowrap flex flex-row justify-start text-left'
              >
                Carian :{' '}
              </label>
              <input
                type='search'
                name='pilihanNama'
                className='appearance-none w-full lg:w-auto text-sm leading-7 px-2 py-1 ring-2 ring-kaunter2 focus:ring-2 focus:ring-kaunter1 focus:outline-none rounded-md shadow-md uppercase ml-2'
                id='pilihanNama'
                placeholder='Cari pesakit...'
                onChange={(e) => setPhilter(e.target.value.toLowerCase())}
              />
            </div>
            <div className='flex flex-row w-full lg:w-auto px-5 lg:px-0'>
              <div className='flex flex-col lg:flex-row lg:items-center lg:justify-center mx-2'>
                <label
                  htmlFor='pilihanTarikh'
                  className='whitespace-nowrap flex flex-row justify-start text-left'
                >
                  Tarikh Kedatangan :{' '}
                </label>
                <TarikhKedatangan />
              </div>
            </div>
            {/* <div className='m-3 hidden lg:flex flex-row items-center justify-center'>
            {generating ? (
              <button
                type='button'
                className='inline-flex items-center text-center justify-center px-4 py-2 order-first lg:order-last capitalize rounded-md shadow-xl p-2 transition-all ease-in-out duration-150 cursor-not-allowed bg-kaunter2 text-userWhite hover:bg-kaunter1'
                disabled=''
              >
                <svg
                  className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
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
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Sedang menjana reten...
              </button>
            ) : (
              <button
                type='button'
                className='px-6 py-2.5 m-1 w-52 bg-kaunter3 hover:bg-kaunter2 font-medium text-xs uppercase rounded-md shadow-md transition-all'
                onClick={handleJana}
              >
                Jana Laporan PG101
              </button>
            )}
          </div> */}
          </div>
        )}
        {flipCarian ? (
          <div className='m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max'>
            <table className='table-auto'>
              <thead className='text-userWhite bg-kaunter2'>
                <tr>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    BIL
                  </th>
                  <th
                    className={`px-2 py-1 outline outline-1 outline-offset-1 w-32 cursor-pointer ${
                      sort.tarikhKedatangan ? 'text-bold text-kaunterBlack' : ''
                    }`}
                    onClick={() =>
                      setSort({
                        ...sort,
                        tarikhKedatangan: !sort.tarikhKedatangan,
                      })
                    }
                  >
                    TARIKH KEDATANGAN
                    {sort.tarikhKedatangan ? (
                      <FaSortUp className='inline-flex items-center' />
                    ) : (
                      <FaSort className='inline-flex items-center' />
                    )}
                  </th>
                  <th
                    className={`px-2 py-1 outline outline-1 outline-offset-1 w-60 cursor-pointer ${
                      sort.masaDaftar ? 'text-bold text-kaunterBlack' : ''
                    }`}
                    onClick={() =>
                      setSort({ ...sort, masaDaftar: !sort.masaDaftar })
                    }
                  >
                    WAKTU SAMPAI
                    {sort.masaDaftar ? (
                      <FaSortUp className='inline-flex items-center' />
                    ) : (
                      <FaSort className='inline-flex items-center' />
                    )}
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    NO. PENDAFTARAN
                  </th>
                  <th
                    className={`px-2 py-1 outline outline-1 outline-offset-1 w-96 md:w-screen md:max-w-md lg:w-screen lg:max-w-screen-lg cursor-pointer ${
                      sort.nama ? 'text-bold text-kaunterBlack' : ''
                    }`}
                    onClick={() => setSort({ ...sort, nama: !sort.nama })}
                  >
                    NAMA PESAKIT
                    {sort.nama ? (
                      <FaSortUp className='inline-flex items-center' />
                    ) : (
                      <FaSort className='inline-flex items-center' />
                    )}
                  </th>
                  <th
                    className={`px-2 py-1 outline outline-1 outline-offset-1 w-80 cursor-pointer ${
                      sort.noPid ? 'text-bold text-kaunterBlack' : ''
                    }`}
                    onClick={() => setSort({ ...sort, noPid: !sort.noPid })}
                  >
                    NO. PENGENALAN DIRI
                    {sort.noPid ? (
                      <FaSortUp className='inline-flex items-center' />
                    ) : (
                      <FaSort className='inline-flex items-center' />
                    )}
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    STATUS PESAKIT
                  </th>
                  <th
                    className={`px-2 py-1 outline outline-1 outline-offset-1 w-60 cursor-pointer ${
                      sort.jenisFasiliti ? 'text-bold text-kaunterBlack' : ''
                    }`}
                    onClick={() =>
                      setSort({ ...sort, jenisFasiliti: !sort.jenisFasiliti })
                    }
                  >
                    JENIS FASILITI
                    {sort.jenisFasiliti ? (
                      <FaSortUp className='inline-flex items-center' />
                    ) : (
                      <FaSort className='inline-flex items-center' />
                    )}
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    OPERATOR
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    MAKLUMAT TAMBAHAN
                  </th>
                </tr>
              </thead>
              <tbody className='bg-kaunter3'>
                {searchResults
                  .sort((a, b) => {
                    if (sort.tarikhKedatangan)
                      return b.tarikhKedatangan.localeCompare(
                        a.tarikhKedatangan
                      );
                  })
                  .sort((a, b) => {
                    if (sort.masaDaftar)
                      return b.waktuSampai.localeCompare(a.waktuSampai);
                  })
                  .sort((a, b) => {
                    if (sort.nama) return a.nama.localeCompare(b.nama);
                  })
                  .sort((a, b) => {
                    if (sort.noPid) return a.ic.localeCompare(b.ic);
                  })
                  .sort((a, b) => {
                    if (sort.jenisFasiliti)
                      return a.jenisFasiliti.localeCompare(b.jenisFasiliti);
                  })
                  .map((item, index) => (
                    <tr key={item._id}>
                      <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1'>
                        {index + 1}
                      </td>
                      <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1'>
                        {moment(item.tarikhKedatangan).format('DD/MM/YYYY')}
                      </td>
                      <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1'>
                        {item.waktuSampai !== ''
                          ? formatTime(item.waktuSampai)
                          : '-'}
                      </td>
                      {item.noPendaftaranBaru ? (
                        <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1 uppercase'>
                          {noPendaftaranSplitter(item.noPendaftaranBaru)}
                          <BsFilePerson
                            className='text-user7 text-2xl inline-table mx-2 pb-1'
                            title='Baru'
                          />
                        </td>
                      ) : (
                        <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1 uppercase'>
                          {noPendaftaranSplitter(item.noPendaftaranUlangan)}
                          <BsFillFilePersonFill
                            className='text-user9 text-2xl inline-table mx-2 pb-1'
                            title='Ulangan'
                          />
                        </td>
                      )}
                      <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1 uppercase'>
                        {item.nama}
                      </td>
                      <td
                        className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1 normal-case'
                        data-cy='pengenalan-diri'
                      >
                        {item.ic}
                      </td>
                      <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1'>
                        {statusPesakit(item)}
                      </td>
                      <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1'>
                        {Dictionary[item.jenisFasiliti]}
                        {item.jenisFasiliti === 'projek-komuniti-lain' ? (
                          <span className='text-kaunterBlack'>
                            {' '}
                            || {item.namaProgram}
                          </span>
                        ) : null}
                      </td>
                      <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1'>
                        {item.createdByUsername === 'kaunter'
                          ? null
                          : item.createdByUsername}
                      </td>
                      <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1 normal-case'>
                        {item.nomborTelefon} {item.nomborTelefon2} {item.emel}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='m-auto overflow-x-auto text-xs lg:text-sm h-full max-w-max'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-2 p-2 my-2'>
              <div className='grid  gap-2 items-center'>
                <div className='border-l-8 border-kaunter1 shadow-md shadow-user1 rounded-md py-2 pr-2'>
                  <div className='flex flex-row items-center'>
                    <div>
                      <BsFillFilePersonFill className='text-kaunter1 t-user2 text-5xl m-1' />
                    </div>
                    <div className='pl-2'>
                      <p className='text-xs flex flex-row'>Jumlah Pesakit</p>
                      <span className='font-mono text-3xl flex flex-row'>
                        {totalPesakit.totalPesakit}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  onMouseEnter={() => {
                    setShowDoughnut(true);
                  }}
                  onMouseLeave={() => {
                    setShowDoughnut(false);
                  }}
                  className='border-l-8 border-kaunter1 shadow-md shadow-user1 rounded-md py-2 pr-2 relative'
                >
                  <div className='flex flex-row items-center'>
                    <GiBeehive className='text-kaunter1  text-3xl m-1' />
                    <div className='pl-2'>
                      <p className='text-xs flex flex-row'>
                        Peratus Reten Telah Diisi
                      </p>
                      <span className='font-mono text-3xl flex flex-row'>
                        {percentageCalc(
                          totalPesakit.totalStatus,
                          totalPesakit.totalPesakit
                        )}
                        %
                      </span>
                    </div>
                  </div>
                  {showDoughnut && (
                    <div className='absolute top-14 left-7 z-30 bg-userWhite rounded-md shadow-md shadow-user1'>
                      <Doughnut data={data} />
                    </div>
                  )}
                </div>
              </div>
              <div className='grid  gap-2 items-center'>
                <div className='border-l-8 border-kaunter1 shadow-md shadow-user1 rounded-md py-2 pr-2'>
                  <div className='flex flex-row items-center'>
                    <GiMedicalPack className='text-kaunter1  text-3xl m-1' />
                    <div className='pl-2'>
                      <p className='text-xs flex flex-row'>
                        Jumlah Pesakit Baru
                      </p>
                      <span className='font-mono text-3xl flex flex-row'>
                        {totalPesakit.totalBaru}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='border-l-8 border-kaunter1 shadow-md shadow-user1 rounded-md py-2 pr-2'>
                  <div className='flex flex-row items-center'>
                    <GiMedicalPack className='text-kaunter1  text-3xl m-1' />
                    <div className='pl-2'>
                      <p className='text-xs flex flex-row'>
                        Jumlah Pesakit Ulangan
                      </p>
                      <span className='font-mono text-3xl flex flex-row'>
                        {totalPesakit.totalUlangan}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='grid  gap-2 items-center'>
                <div className='border-l-8 border-kaunter1 shadow-md shadow-user1 rounded-md py-2 pr-2'>
                  <div className='flex flex-row items-center'>
                    <GiTakeMyMoney className='text-kaunter1  text-3xl m-1' />
                    <div className='pl-2'>
                      <p className='text-xs flex flex-row'>Jumlah Bayaran</p>
                      <span className='font-mono text-3xl flex flex-row'>
                        RM {totalPesakit.totalBayaran}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='border-l-8 border-kaunter1 shadow-md shadow-user1 rounded-md py-2 pr-2'>
                  <div className='flex flex-row items-center'>
                    <GiMustache className='text-kaunter1 text-3xl m-1' />
                    <div className='pl-2'>
                      <p className='text-xs flex flex-row normal-case'>
                        Jumlah Pesakit e-GL
                      </p>
                      <span className='font-mono text-3xl flex flex-row'>
                        {totalPesakit.totalEgl}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <table className='table-auto rounded-md'>
              <thead className='text-userWhite bg-kaunter2'>
                <tr>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    BIL
                  </th>
                  <th
                    className={`px-2 py-1 outline outline-1 outline-offset-1 w-32 cursor-pointer ${
                      sort.tarikhKedatangan ? 'text-bold text-kaunterBlack' : ''
                    }`}
                    onClick={() =>
                      setSort({
                        ...sort,
                        tarikhKedatangan: !sort.tarikhKedatangan,
                      })
                    }
                  >
                    TARIKH KEDATANGAN
                    {sort.tarikhKedatangan ? (
                      <FaSortUp className='inline-flex items-center' />
                    ) : (
                      <FaSort className='inline-flex items-center' />
                    )}
                  </th>
                  <th
                    className={`px-2 py-1 outline outline-1 outline-offset-1 w-60 cursor-pointer ${
                      sort.masaDaftar ? 'text-bold text-kaunterBlack' : ''
                    }`}
                    onClick={() =>
                      setSort({ ...sort, masaDaftar: !sort.masaDaftar })
                    }
                  >
                    WAKTU SAMPAI
                    {sort.masaDaftar ? (
                      <FaSortUp className='inline-flex items-center' />
                    ) : (
                      <FaSort className='inline-flex items-center' />
                    )}
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    NO. PENDAFTARAN
                  </th>
                  <th
                    className={`px-2 py-1 outline outline-1 outline-offset-1 w-96 md:w-screen md:max-w-md lg:w-screen lg:max-w-screen-lg cursor-pointer ${
                      sort.nama ? 'text-bold text-kaunterBlack' : ''
                    }`}
                    onClick={() => setSort({ ...sort, nama: !sort.nama })}
                  >
                    NAMA PESAKIT
                    {sort.nama ? (
                      <FaSortUp className='inline-flex items-center' />
                    ) : (
                      <FaSort className='inline-flex items-center' />
                    )}
                  </th>
                  <th
                    className={`px-2 py-1 outline outline-1 outline-offset-1 w-80 cursor-pointer ${
                      sort.noPid ? 'text-bold text-kaunterBlack' : ''
                    }`}
                    onClick={() => setSort({ ...sort, noPid: !sort.noPid })}
                  >
                    NO. PENGENALAN DIRI
                    {sort.noPid ? (
                      <FaSortUp className='inline-flex items-center' />
                    ) : (
                      <FaSort className='inline-flex items-center' />
                    )}
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    STATUS PESAKIT
                  </th>
                  <th
                    className={`px-2 py-1 outline outline-1 outline-offset-1 w-60 cursor-pointer ${
                      sort.jenisFasiliti ? 'text-bold text-kaunterBlack' : ''
                    }`}
                    onClick={() =>
                      setSort({ ...sort, jenisFasiliti: !sort.jenisFasiliti })
                    }
                  >
                    JENIS FASILITI
                    {sort.jenisFasiliti ? (
                      <FaSortUp className='inline-flex items-center' />
                    ) : (
                      <FaSort className='inline-flex items-center' />
                    )}
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    MAKLUMAT TAMBAHAN
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    BAYARAN & NO. RESIT
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    TINDAKAN
                  </th>
                </tr>
              </thead>
              {allPersonKaunter &&
                allPersonKaunter.kaunterResultQuery
                  .filter((item) => {
                    if (tarikhKedatangan === '') return item;
                    if (item.tarikhKedatangan === tarikhKedatangan) return item;
                  })
                  .filter((pt) =>
                    keys.some((key) => pt[key].toLowerCase().includes(philter))
                  )
                  .sort((a, b) => {
                    if (sort.tarikhKedatangan)
                      return b.tarikhKedatangan.localeCompare(
                        a.tarikhKedatangan
                      );
                  })
                  .sort((a, b) => {
                    if (sort.masaDaftar)
                      return b.waktuSampai.localeCompare(a.waktuSampai);
                  })
                  .sort((a, b) => {
                    if (sort.nama) return a.nama.localeCompare(b.nama);
                  })
                  .sort((a, b) => {
                    if (sort.noPid) return a.ic.localeCompare(b.ic);
                  })
                  .sort((a, b) => {
                    if (sort.jenisFasiliti)
                      return a.jenisFasiliti.localeCompare(b.jenisFasiliti);
                  })
                  .map((p, index) => (
                    <>
                      <tbody className='bg-kaunter3'>
                        <tr>
                          <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1'>
                            {index + 1}
                          </td>
                          <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1'>
                            {moment(p.tarikhKedatangan).format('DD/MM/YYYY')}
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
                          <td
                            className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1 normal-case'
                            data-cy='pengenalan-diri'
                          >
                            {p.ic}
                          </td>
                          <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1'>
                            {statusPesakit(p)}
                          </td>
                          <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1'>
                            {Dictionary[p.jenisFasiliti]}
                          </td>
                          <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1 normal-case'>
                            {p.nomborTelefon} {p.nomborTelefon2} {p.emel}
                          </td>
                          <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1 whitespace-nowrap'>
                            {p.noBayaran || p.noResit ? (
                              `PENDAFTARAN: ${p.noBayaran} - ${p.noResit}`
                            ) : (
                              <span className='text-kaunter5'>
                                TIADA bayaran PENDAFTARAN
                              </span>
                            )}
                            <br />
                            {p.noBayaran2 || p.noResit2 ? (
                              `RAWATAN: ${p.noBayaran2} - ${p.noResit2}`
                            ) : (
                              <span className='text-kaunter5'>
                                TIADA bayaran RAWATAN
                              </span>
                            )}
                            <br />
                            {p.noBayaran3 || p.noResit3 ? (
                              `TAMBAHAN: ${p.noBayaran3} - ${p.noResit3}`
                            ) : (
                              <span className='text-kaunter5'>
                                TIADA bayaran TAMBAHAN
                              </span>
                            )}
                            <br />
                            {p.catatan ? (
                              `CATATAN: ${p.catatan}`
                            ) : (
                              <span className='text-kaunter5'>
                                TIADA CATATAN
                              </span>
                            )}
                          </td>
                          <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1'>
                            {p.tarikhKedatangan ===
                              moment(dateToday).format('YYYY-MM-DD') ||
                            p.tarikhKedatangan ===
                              moment(dateYesterday).format('YYYY-MM-DD') ||
                            p.tarikhKedatangan ===
                              moment(datePastTwoDays).format('YYYY-MM-DD') ? (
                              <button
                                className='w-36 py-2.5 my-1 mx-1 bg-kaunter2 hover:bg-kaunter1 font-medium text-xs uppercase rounded-md shadow-md transition-all'
                                onClick={() => {
                                  setEditId(p._id);
                                  setShowKemaskiniResit(true);
                                }}
                              >
                                Kemaskini{' '}
                                {p.jenisFasiliti === 'kp' ||
                                p.jenisFasiliti === 'projek-komuniti-lain'
                                  ? 'Bayaran, No. Resit & '
                                  : null}
                                Catatan
                              </button>
                            ) : null}
                            {/* <PrintPatientDetails data={p} /> */}
                          </td>
                        </tr>
                      </tbody>
                    </>
                  ))}
            </table>
            {!allPersonKaunter && (
              <div className='mt-10'>
                <Spinner />
              </div>
            )}
          </div>
        )}
        {showKemaskiniResit && (
          <KemaskiniResit
            setShowKemaskiniResit={setShowKemaskiniResit}
            editId={editId}
          />
        )}
      </div>
    </>
  );
}
