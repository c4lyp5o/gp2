import moment from 'moment';
import { FaWindowClose, FaUserCheck, FaRegPaperPlane } from 'react-icons/fa';

export default function ModalConfirmMuridKohortBuatKumuranFMR(props) {
  return (
    <>
      <div className='absolute inset-x-0 inset-y-0 lg:inset-x-1/4 lg:inset-y-60 text-sm bg-userWhite z-20 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'>
        <FaWindowClose
          onClick={props.closeModal}
          className='absolute mr-1 mt-1 text-xl text-userBlack right-0 hover:cursor-pointer hover:text-user2 transition-all'
        />
        <div className='grid grid-rows-[1fr_8fr_1fr] h-full'>
          <h5 className='bg-user9 text-userWhite font-semibold text-xl h-7'>
            PERHATIAN
          </h5>
          <div className='mt-1 py-1'>
            <span className='relative flex items-center justify-center mt-4'>
              <FaUserCheck className='text-4xl text-user9 mx-auto absolute animate-ping' />
              <FaUserCheck className='text-4xl text-user9 mx-auto absolute' />
            </span>
            <p className='px-1 font-semibold mt-7'>
              Anda YAKIN untuk mendaftar maklumat kumuran murid bagi kohort
              tahun 1?
            </p>
            <p>Maklumat yang telah didaftarkan tidak boleh diubah!</p>
            <>
              <div className='grid grid-cols-[1fr_2fr]'>
                <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                  Nama Sekolah:{' '}
                </p>
                <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                  {Object.keys(props.users)
                    .filter((key) => props.users[key].masukKohort === true)
                    .map((key) => props.users[key].namaSekolah)
                    .filter(
                      (value, index, self) => self.indexOf(value) === index
                    )
                    .join(', ')}
                </p>
              </div>
              <div className='grid grid-cols-[1fr_2fr]'>
                <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                  Nama Kelas:{' '}
                </p>
                <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                  {Object.keys(props.users)
                    .filter((key) => props.users[key].masukKohort === true)
                    .map((key) => props.users[key].kelasPelajar)
                    .filter(
                      (value, index, self) => self.indexOf(value) === index
                    )
                    .join(', ')}
                </p>
              </div>
              <div className='grid grid-cols-[1fr_2fr]'>
                <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                  Tarikh:{' '}
                </p>
                <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                  {moment(props.tarikhKumuran).format('DD/MM/YYYY')}
                </p>
              </div>
              <div className='grid grid-cols-[1fr_2fr]'>
                <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                  Jumlah Murid Hadir FMR:{' '}
                </p>
                <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                  {
                    Object.keys(props.users).filter(
                      (key) => props.users[key].masukKohort === true
                    ).length
                  }
                </p>
              </div>
            </>
          </div>
          <div className='sticky grid grid-cols-2 bottom-0 right-0 left-0 m-2 mx-10 bg-userWhite px-5 py-2'>
            <button
              type='button'
              className='capitalize bg-userWhite text-userBlack rounded-md p-2 ml-3 hover:bg-user5 transition-all'
              onClick={props.closeModal}
            >
              KEMBALI
            </button>
            <button
              type='button'
              className='capitalize bg-user9 text-userWhite rounded-md shadow-xl p-2 mr-3 hover:bg-user1 transition-all flex justify-center items-center'
              onClick={props.handleSubmit}
            >
              <FaRegPaperPlane className='inline-flex ml-1' />
              HANTAR
            </button>
          </div>
        </div>
      </div>
      <div
        onClick={props.closeModal}
        className='absolute inset-0 bg-user1 opacity-75 z-10'
      />
    </>
  );
}
