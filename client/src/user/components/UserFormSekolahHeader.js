import { useRef } from 'react';
import axios from 'axios';
import Pendaftaran from './form-sekolah/Pendaftaran';
import PemeriksaanAwal from './form-sekolah/PemeriksaanAwal';

function UserFormSekolah() {
  const masterForm = {};
  masterForm.kpBergerak = useRef(null);
  masterForm.pasukanPergigianBergerak = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(masterForm.kpBergerak.current.checked);
    console.log(masterForm.pasukanPergigianBergerak.current.checked);
  };

  const handleNext = () => {
    // do something..
  };

  return (
    <>
      <div className='container px-10 h-full p-3 overflow-y-auto'>
        <div className='p-2'>
          <article className='outline outline-1 outline-userBlack grid grid-cols-1 md:grid-cols-2'>
            <div className=''>
              <div>
                <h1 className='text-l font-bold flex flex-row pl-5 pt-5'>
                  BASIC DEMOGRAFIK
                </h1>
                <div className='text-s flex flex-row pl-5'>
                  <h2 className='font-semibold'>NAMA:</h2>
                  <p className=''>izzuddin</p>
                </div>
                <div className='text-s flex flex-row pl-5'>
                  <h2 className='font-semibold'>JANTINA:</h2>
                  <p>Lelaki</p>
                </div>
                <div className='text-s flex flex-row pl-5'>
                  <h2 className='font-semibold'>UMUR:</h2>
                  <p>28</p>
                </div>
                <div className='text-s flex flex-row pl-5'>
                  <h2 className='font-semibold'>NO IC:</h2>
                  <p>123456-10-7891</p>
                </div>
              </div>
            </div>
            <div className='md:pt-10'>
              <div className='text-s flex flex-row pl-5'>
                <h2 className='font-semibold'>NAMA SEKOLAH:</h2>
                <p className='flex flex-row'>SEKOLAH SERI HOGWART</p>
              </div>
              <div className='text-s flex flex-row pl-5'>
                <h2 className='font-semibold'>DARJAH/TINGKATAN:</h2>
                <p>1</p>
              </div>
              <div className='text-s flex flex-row pl-5'>
                <h2 className='font-semibold'>KELAS:</h2>
                <p>1 ARIF</p>
              </div>
            </div>
          </article>
        </div>
        <form onSubmit={handleSubmit}>
          <Pendaftaran {...masterForm} />
          {/* <PemeriksaanAwal /> */}
          <div className='grid grid-cols-1 lg:grid-cols-2 col-start-1 md:col-start-2 gap-2 col-span-2 md:col-span-1'>
            <div className='grid grid-cols-2 gap-3 lg:col-start-2'>
              <button className='flex bg-user3 p-2 w-full capitalize justify-center hover:bg-user1 hover:text-userWhite'>
                clear
              </button>
              <button className='flex bg-user3 p-2 w-full capitalize justify-center hover:bg-user1 hover:text-userWhite'>
                next
              </button>
              <button
                type='submit'
                className='flex bg-user3 p-2 w-full capitalize justify-center hover:bg-user1 hover:text-userWhite'
              >
                submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default UserFormSekolah;
