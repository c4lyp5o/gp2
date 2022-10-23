import { Spinner } from 'react-awesome-spinners';
import axios from 'axios';
import { BsFilePerson, BsFillFilePersonFill } from 'react-icons/bs';

import { useGlobalUserAppContext } from '../../context/userAppContext';

export default function PatientData({
  data,
  loading,
  error,
  philter,
  setPhilter,
  showForm,
  setShowForm,
  editForm,
  setEditForm,
  setEditId,
  jenisFasiliti,
  kp,
}) {
  const { Dictionary, dateToday, kaunterToken, toast } =
    useGlobalUserAppContext();

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

  if (loading)
    return (
      <div className='mt-20'>
        <Spinner />
      </div>
    );

  if (error) return <p>Error :(</p>;

  if (!showForm && !editForm) {
    return (
      <>
        <div className='grid grid-cols-1 lg:grid-cols-2'>
          <p className='font-semibold text-user6 mt-2 ml-3 lg:mr-auto'>
            Fasiliti: {Dictionary[jenisFasiliti]}
          </p>
          <p className='font-semibold text-user6 lg:mt-2 mr-3 lg:ml-auto'>
            Tarikh: {dateToday}
          </p>
        </div>
        <div className='flex justify-center'>
          <div className='mb-3 xl:w-96'>
            <input
              type='search'
              className='outline outline-1 outline-userBlack rounded-md p-3'
              id='carianPesakit'
              placeholder='Cari pesakit...'
              onChange={(e) => setPhilter(e.target.value.toLowerCase())}
            />
          </div>
        </div>
        <button
          type='button'
          className='px-6 py-2.5 m-1 w-52 bg-kaunter3 font-medium text-xs uppercase rounded-md shadow-md transition-all'
          onClick={(e) => setShowForm(true)}
        >
          Daftar Pesakit
        </button>
        <button
          type='button'
          className='px-6 py-2.5 m-1 w-52 bg-kaunter3 font-medium text-xs uppercase rounded-md shadow-md transition-all'
          onClick={handleJana}
        >
          Jana Laporan PG101
        </button>
        <div className=' mt-2'>
          <div className='justify-center items-center'>
            <div className='mt-2 overflow-x-auto text-sm lg:text-lg font-medium outline outline-1 outline-userBlack'>
              <table className='m-auto mb-5 w-11/12 outline outline-1 outline-kaunterBlack'>
                <tbody>
                  <tr className='bg-kaunter3 p-2'>
                    <th className='outline outline-1 outline-kaunterBlack px-2'>
                      BIL
                    </th>
                    <th className='outline outline-1 outline-kaunterBlack whitespace-nowrap px-2'>
                      NO. PENDAFTARAN
                    </th>
                    <th className='outline outline-1 outline-kaunterBlack px-2'>
                      NAMA
                    </th>
                    <th className='outline outline-1 outline-kaunterBlack px-2'>
                      NO. KAD PENGENALAN
                    </th>
                    <th className='outline outline-1 outline-kaunterBlack px-2'>
                      TARIKH KEDATANGAN
                    </th>
                    <th className='outline outline-1 outline-kaunterBlack px-2'>
                      STATUS PENGISIAN RETEN
                    </th>
                    <th className='outline outline-1 outline-kaunterBlack'>
                      KEMASKINI
                    </th>
                  </tr>
                  {data.kaunterResultQuery
                    .filter((pt) => pt.nama.includes(philter))
                    .map((p, index) => (
                      <>
                        <tr>
                          <td className='outline outline-1 outline-kaunterBlack'>
                            {index + 1}
                          </td>
                          {p.noPendaftaranBaru ? (
                            <td className='outline outline-1 outline-kaunterBlack lowercase whitespace-nowrap'>
                              {p.noPendaftaranBaru}
                              <BsFilePerson
                                className='text-user7 text-2xl inline-table mx-2 pb-1'
                                title='baru'
                              />
                            </td>
                          ) : (
                            <td className='outline outline-1 outline-kaunterBlack lowercase whitespace-nowrap'>
                              {p.noPendaftaranUlangan}
                              <BsFillFilePersonFill
                                className='text-user9 text-2xl inline-table mx-2 pb-1'
                                title='ulangan'
                              />
                            </td>
                          )}
                          <td className='outline outline-1 outline-kaunterBlack'>
                            {p.nama.toUpperCase()}
                          </td>
                          <td className='outline outline-1 outline-kaunterBlack'>
                            {p.ic.toUpperCase()}
                          </td>
                          <td className='outline outline-1 outline-kaunterBlack'>
                            {p.tarikhKedatangan}
                          </td>
                          <td className='outline outline-1 outline-kaunterBlack'>
                            {p.statusReten}
                          </td>
                          <td className='outline outline-1 outline-kaunterBlack px-2'>
                            <button
                              className='px-6 py-2.5 my-1 bg-kaunter3 font-medium text-xs uppercase rounded-md shadow-md transition-all'
                              onClick={(e) => {
                                setEditId(p._id);
                                setShowForm(true);
                              }}
                            >
                              Kemaskini
                            </button>
                          </td>
                        </tr>
                      </>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  }
}
