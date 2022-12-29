import { useGlobalUserAppContext } from '../context/userAppContext';
import moment from 'moment';

export default function KaunterKomunitiLain({
  jenisFasiliti,
  semuaProgram,
  setSemuaProgram,
  jenisProgram,
  setJenisProgram,
  namaProgram,
  setNamaProgram,
  showPilihanProgram,
  setShowPilihanProgram,
  fetchProgramData,
  setFetchProgramData,
  kp,
}) {
  if (
    jenisFasiliti === 'projek-komuniti-lain' &&
    semuaProgram.length < 1 &&
    jenisProgram.length < 1
  ) {
    return (
      <div className='m-auto mt-5 font-semibold text-lg uppercase'>
        <p>tiada program komuniti didaftarkan di modul pentadbir bagi</p>
        <p>{kp}</p>
      </div>
    );
  }

  if (
    showPilihanProgram &&
    jenisFasiliti === 'projek-komuniti-lain' &&
    semuaProgram.length > 0
  ) {
    return (
      <div className='flex flex-col gap-3 mt-2 ml-2'>
        <h1 className='flex flex-row text-3xl font-bold text-left'>
          Senarai Program / Aktiviti
        </h1>
        <p className='flex justify-start font-semibold text-lg'>
          Jenis Program
          <span className='font-semibold text-lg text-user6'>*</span>
        </p>
        <div className='grid gap-1'>
          <select
            required
            value={jenisProgram}
            onChange={(e) => setJenisProgram(e.target.value)}
            name='jenisProgram'
            id='jenisProgram'
            className='appearance-none border-2 border-user6 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-md'
          >
            <option value=''>Jenis Program / Aktiviti</option>
            <option value='programDewasaMuda'>Program Dewasa Muda</option>
            <option value='kampungAngkatPergigian'>
              Program Kampung Angkat Pergigian
            </option>
            <option value='ppr'>Projek Perumahan Rakyat</option>
            <option value='we'>Institusi Warga Emas</option>
            <option value='oku'>Institusi OKU / PDK</option>
            <option value='projek-komuniti'>Projek Komuniti</option>
            <option value='ppkps'>
              Program Pemasyarakatan Perkhidmatan Klinik Pergigian Sekolah
            </option>
            <option value='oap'>Program Orang Asli dan Penan</option>
            <option value='penjara-koreksional'>
              Program di Penjara / Pusat Koreksional
            </option>
            <option value='fds'>Flying Dental Service (Sabah)</option>
            <option value='rtc'>RTC (Kelantan)</option>
            <option value='incremental'>
              Program Pergigian Sekolah sesi 2022/2023
            </option>
          </select>
        </div>
        <div className='m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max'>
          <table className='table-auto'>
            <thead className='text-userWhite bg-kaunter2'>
              <tr>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  BIL
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  NAMA PROGRAM
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  TARIKH
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  DAFTAR
                </th>
              </tr>
            </thead>
            {semuaProgram
              .filter((program) => program.jenisEvent === jenisProgram)
              .map((e, index) => (
                <>
                  <tbody className='bg-kaunter3'>
                    <tr>
                      <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1'>
                        {index + 1}
                      </td>
                      <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1 uppercase'>
                        {e.nama}
                      </td>
                      <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1 uppercase'>
                        {moment(e.tarikhStart).format('DD/MM/YYYY')}-
                        {moment(e.tarikhEnd).format('DD/MM/YYYY')}
                      </td>
                      <td className='px-2 py-1 outline outline-1 outline-kaunterWhite outline-offset-1'>
                        <button
                          onClick={() => {
                            setNamaProgram(e.nama);
                            setShowPilihanProgram(false);
                            setFetchProgramData(!fetchProgramData);
                          }}
                          className='px-6 py-2.5 my-1 bg-kaunter2 hover:bg-kaunter1 font-medium text-xs uppercase rounded-md shadow-md transition-all'
                        >
                          Pilih Program
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </>
              ))}
          </table>
        </div>
      </div>
    );
  }
}
