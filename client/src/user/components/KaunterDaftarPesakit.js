import { useEffect, useState } from 'react';
import { Spinner } from 'react-awesome-spinners';
import axios from 'axios';
import { BsFilePerson, BsFillFilePersonFill } from 'react-icons/bs';
import { FaSort, FaSortUp } from 'react-icons/fa';
import moment from 'moment';

import KemaskiniResit from './pt-registration/KemaskiniResit';
import PrintPatientDetails from './pt-registration/PrintPatientDetails';

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

  // datepicker issue
  const [tarikhKedatanganDP, setTarikhKedatanganDP] = useState(
    moment(dateToday, moment.ISO_8601).toDate()
  );

  const [sort, setSort] = useState({
    masaDaftar: false,
    nama: false,
    noPid: false,
    statusReten: false,
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
        } catch (error) {
          console.log(error);
        }
      };
      fetchAllPersonKaunter();
    }
  }, [tarikhKedatangan, showKemaskiniResit]);

  //carian ic semua
  const keys = ['nama', 'ic'];

  return (
    <>
      <div className='px-2 lg:px-7 h-full py-3 overflow-y-auto'>
        <div className='flex flex-col lg:flex-row justify-center items-center'>
          <div
            className='m-1 lg:m-3 px-5 lg:px-0 flex flex-col lg:flex-row lg:items-center lg:justify-center w-full lg:w-auto'
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
            <div className='flex flex-col lg:flex-row lg:items-center lg:justify-center m-1 lg:m-3'>
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
                    return b.tarikhKedatangan.localeCompare(a.tarikhKedatangan);
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
                        <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1 normal-case'>
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
                            <span className='text-kaunter5'>TIADA CATATAN</span>
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
