import { FaWindowClose, FaYinYang, FaDownload } from 'react-icons/fa';

import { useGlobalUserAppContext } from '../../../context/userAppContext';

export default function UserModalMuatTurun({
  handleDownloadSenaraiSekolah,
  handleDownloadSenaraiSekolahRujukan,
  sekolahMuatTurun,
  setModalMuatTurun,
  isDownloading,
}) {
  const { userToken, userinfo, reliefUserToken, toast } =
    useGlobalUserAppContext();

  return (
    <>
      <div className='absolute z-20 inset-x-1 lg:inset-x-1/3 inset-y-7 bg-userWhite text-user1 rounded-md shadow-md overflow-y-auto'>
        <FaWindowClose
          className='absolute top-2 right-2 text-2xl cursor-pointer'
          onClick={() => setModalMuatTurun(false)}
        />
        <div className='h-10 bg-user3 flex justify-center items-center text-userWhite uppercase font-bold text-lg'>
          Muat Turun
        </div>
        <div className='grid grid-rows-[4fr_1fr] px-2'>
          <div>
            <h1 className='text-2xl font-bold text-center my-3 py-3 border-b-2 border-user1'>
              Sila pilih senarai murid sekolah untuk di muat turun
            </h1>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <button
              onClick={() =>
                handleDownloadSenaraiSekolah(
                  sekolahMuatTurun.kodSekolah,
                  sekolahMuatTurun.nama,
                  sekolahMuatTurun.sesiTakwimSekolah
                )
              }
              className={`${
                isDownloading ? 'pointer-events-none opacity-50' : ''
              } capitalize text-userWhite rounded-md py-2 hover:cursor-pointer transition-all bg-user2 hover:bg-user3`}
            >
              {isDownloading ? (
                <>
                  <FaYinYang className='inline-flex mx-1 animate-spin' />
                  Sedang Muat Turun <i className='animate-pulse'>..</i>
                </>
              ) : (
                <>
                  <FaDownload className='inline-flex mx-1' />
                  Murid Sekolah
                </>
              )}
            </button>
            <button
              // onClick={() =>
              //   handleDownloadSenaraiSekolahRujukan(
              //     sekolahMuatTurun.kodSekolah,
              //     sekolahMuatTurun.nama,
              //     sekolahMuatTurun.sesiTakwimSekolah
              //   )
              // }
              className={`${
                isDownloading ? 'pointer-events-none opacity-50' : ''
              } capitalize text-userWhite rounded-md py-2 hover:cursor-not-allowed transition-all bg-user2 hover:bg-user3`}
            >
              {isDownloading ? (
                <>
                  <FaYinYang className='inline-flex mx-1 animate-spin' />
                  Sedang Muat Turun <i className='animate-pulse'>..</i>
                </>
              ) : (
                <>
                  <FaDownload className='inline-flex mx-1' />
                  Murid Rujukan
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <div
        onClick={() => setModalMuatTurun(false)}
        className='absolute inset-0 bg-user1 opacity-75 z-10'
      />
    </>
  );
}
