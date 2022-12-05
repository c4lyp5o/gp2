import axios from 'axios';
import { BsFilePerson, BsFillFilePersonFill } from 'react-icons/bs';
import { TbArrowBigLeftLine } from 'react-icons/tb';

import { useGlobalUserAppContext } from '../../context/userAppContext';

export default function PatientData({
  data,
  setData,
  setIsLoading,
  setIsError,
  philter,
  setPhilter,
  showForm,
  setShowForm,
  editForm,
  setEditId,
  showPilihanProgram,
  jenisProgram,
  namaProgram,
  jenisFasiliti,
  kp,
}) {
  const {
    kaunterToken,
    Dictionary,
    dateToday,
    formatTime,
    noPendaftaranSplitter,
    statusPesakit,
    toast,
    navigate,
  } = useGlobalUserAppContext();

  const saveFile = (blob) => {
    const link = document.createElement('a');
    link.download = `PG101-${kp}-${dateToday}.xlsx`;
    link.href = URL.createObjectURL(new Blob([blob]));
    link.addEventListener('click', (e) => {
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
      }, 100);
    });
    link.click();
  };

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

  const handleJana = async (e) => {
    e.preventDefault();
    await toast
      .promise(
        axios.get(
          // `/api/v1/generate/download?jenisReten=PG101&sekolah=${pilihanSekolah}&dateToday=${dateToday}&pg101date=${pg101date}&startDate=${startDate}&endDate=${endDate}&formatFile=${formatFile}`,
          `/api/v1/generate/download?jenisReten=PG101&tarikhMula=${dateToday}&tarikhAkhir=&formatFile=xlsx`,
          {
            headers: { Authorization: `Bearer ${kaunterToken}` },
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
      setIsError(true);
      setIsLoading(false);
    }
  };

  if (!showForm && !editForm && !showPilihanProgram) {
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
                    navigate(-1);
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
          <div className='mb-3 xl:w-96'>
            <input
              type='search'
              className='outline outline-1 outline-userBlack rounded-md p-3'
              id='carianPesakit'
              placeholder='Carian Pesakit'
              onChange={(e) => setPhilter(e.target.value.toLowerCase())}
            />
          </div>
        </div>
        <button
          type='button'
          className='px-6 py-2.5 m-1 w-52 bg-kaunter3 hover:bg-kaunter2 font-medium text-xs uppercase rounded-md shadow-md transition-all'
          onClick={() => setShowForm(true)}
        >
          Daftar Pesakit
        </button>
        <button
          type='button'
          className='px-6 py-2.5 m-1 w-52 bg-kaunter3 hover:bg-kaunter2 font-medium text-xs uppercase rounded-md shadow-md transition-all'
          onClick={handleJana}
        >
          Jana Laporan PG101
        </button>
        <div className='mt-2'>
          <div className='justify-center items-center'>
            <p className='text-xs text-user9 lowercase'>
              * sekiranya terdapat dua pendaftaran yang sama, sila hubungi
              pengguna
              <i className='mr-1'>
                <b> 'admin'</b>
              </i>
              di klinik
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
                      MASA DAFTAR
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
                    {jenisFasiliti === 'projek-komuniti-lain' ? (
                      <th className='px-2 py-1 outline outline-1 outline-offset-1 w-80'>
                        NAMA PROJEK
                      </th>
                    ) : null}
                    <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                      KEMASKINI
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
                            {formatTime(p.waktuSampai)}
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
                          {jenisFasiliti === 'projek-komuniti-lain' ? (
                            <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1'>
                              {p.namaProgram}
                            </td>
                          ) : null}
                          <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1'>
                            <button
                              className='px-6 py-2.5 my-1 bg-kaunter2 hover:bg-kaunter1 font-medium text-xs uppercase rounded-md shadow-md transition-all'
                              onClick={(e) => {
                                setEditId(p._id);
                                setShowForm(true);
                              }}
                            >
                              Kemaskini
                            </button>
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
