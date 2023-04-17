import moment from 'moment';
import { useEffect } from 'react';
import {
  FaWindowClose,
  FaCheckCircle,
  FaTimesCircle,
  FaUserCheck,
  FaRegPaperPlane,
  FaMinus,
  FaPlus,
} from 'react-icons/fa';

export default function ModalMuridMasukKohortFMR(props) {
  useEffect(() => {
    console.log(props);
  }, []);

  return (
    <>
      <div className='absolute inset-x-0 inset-y-0 lg:inset-x-1/3 lg:inset-y-6 text-sm bg-userWhite z-10 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'>
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
              Anda YAKIN untuk mendaftar maklumat kohort murid tahun 1?
            </p>
            <p>Maklumat yang telah didaftarkan tidak boleh diubah!</p>
            {props.selectedSekolah ? (
              <>
                <div className='grid grid-cols-[1fr_2fr]'>
                  <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                    Nama Sekolah:{' '}
                  </p>
                  <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                    {props.selectedSekolah}
                  </p>
                </div>
                <div className='grid grid-cols-[1fr_2fr]'>
                  <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                    Nama Kelas:{' '}
                  </p>
                  <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                    {props.selectedKelasBasedOnSekolah}
                  </p>
                </div>
                <div className='grid grid-cols-[1fr_2fr]'>
                  <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                    Jumlah:{' '}
                  </p>
                  <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                    {
                      Object.keys(props.users).filter(
                        (key) => props.users[key].masukKohort === true
                      ).length
                    }
                  </p>
                </div>
                <div className='grid grid-cols-[1fr_2fr]'>
                  <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                    Kohort:{' '}
                  </p>
                  <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                    Tahun 1 {new Date().getFullYear()}
                  </p>
                </div>
              </>
            ) : null}
          </div>
          <div className='sticky grid grid-cols-2 bottom-0 right-0 left-0 m-2 mx-10 bg-userWhite px-5 py-2'>
            <button
              className='capitalize bg-user9 text-userWhite rounded-md shadow-xl p-2 mr-3 hover:bg-user1 transition-all flex justify-center items-center'
              onClick={props.closeModal}
            >
              KEMBALI
              <FaRegPaperPlane className='inline-flex ml-1' />
            </button>
            <button
              className='capitalize bg-userWhite text-userBlack rounded-md p-2 ml-3 hover:bg-user5 transition-all'
              onClick={props.handleSubmit}
            >
              HANTAR
            </button>
          </div>
        </div>
      </div>
      <div
        onClick={props.closeModal}
        className='fixed inset-0 bg-userBlack opacity-50 z-0'
      />
    </>
  );
}
