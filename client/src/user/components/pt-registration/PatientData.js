import { Spinner } from 'react-awesome-spinners';
import axios from 'axios';

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
        <div className='flex'>
          <p className='font-semibold text-user6 mt-3 ml-3'>
            Fasiliti: {Dictionary[jenisFasiliti]}
          </p>
          <p className='font-semibold text-user6 mt-3 mr-3 ml-auto'>
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
          className='px-6 py-2.5 mr-3 bg-kaunter3 font-medium text-xs uppercase rounded-md shadow-md transition-all'
          onClick={(e) => setShowForm(true)}
        >
          Daftar Pesakit Baru
        </button>
        <button
          type='button'
          className='px-6 py-2.5 bg-kaunter3 font-medium text-xs uppercase rounded-md shadow-md transition-all'
          onClick={handleJana}
        >
          Jana Laporan PG101
        </button>
        <div className='border mt-2'>
          <div className='justify-center items-center'>
            <div className='mt-2 overflow-x-auto text-sm lg:text-lg font-medium outline outline-1 outline-userBlack'>
              <table className='m-auto mb-5 w-11/12 outline outline-1 outline-kaunterBlack'>
                <tbody>
                  <tr className='bg-kaunter3 p-2'>
                    <th className='outline outline-1 outline-kaunterBlack'>
                      BIL
                    </th>
                    <th className='outline outline-1 outline-kaunterBlack'>
                      NO. PENDAFTARAN
                    </th>
                    <th className='outline outline-1 outline-kaunterBlack'>
                      NAMA
                    </th>
                    <th className='outline outline-1 outline-kaunterBlack'>
                      NO. KAD PENGENALAN
                    </th>
                    <th className='outline outline-1 outline-kaunterBlack'>
                      TARIKH KEDATANGAN
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
                            <td className='outline outline-1 outline-kaunterBlack text lowercase'>
                              {p.noPendaftaranBaru}
                            </td>
                          ) : (
                            <td className='outline outline-1 outline-kaunterBlack lowercase'>
                              {p.noPendaftaranUlangan}
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
                            <button
                              className='px-6 py-2.5 my-1 bg-kaunter3 font-medium text-xs uppercase rounded-md shadow-md transition-all'
                              onClick={(e) => {
                                setEditId(p._id);
                                // setEditForm(true);
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
