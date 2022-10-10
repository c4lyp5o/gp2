import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowAltCircleUp } from 'react-icons/fa';

function LandingPage() {
  const [showKlinikSubMenu, setShowKlinikSubMenu] = useState(false);

  return (
    <>
      {/* header */}
      <div className='absolute top-0 left-0 right-0 grid grid-cols-1 md:grid-cols-2 grid-rows-1 items-center h-28 bg-user2 text-userWhite font-sans capitalize justify-evenly'>
        <div className='grid grid-cols-1 md:grid-cols-2'>
          <div className='grid grid-rows-[50px_10px_10px] md:gap-1 text-center col-start-1 md:col-start-2 md:justify-end'>
            <img
              className='w-full h-full'
              src='https://upload.wikimedia.org/wikipedia/commons/9/94/Jata_MalaysiaV2.svg'
              alt='missing jata negara'
            />
            <p className='uppercase text-[0.55rem] lg:text-[0.65rem]'>
              kementerian kesihatan malaysia
            </p>
            <p className='uppercase text-[0.55rem] lg:text-[0.65rem]'>
              program kesihatan pergigian
            </p>
            <h1 className='md:hidden text-lg font-semibold'>
              sistem gi-Ret 2.0
            </h1>
          </div>
        </div>
        <div className='hidden md:grid grid-rows-2 text-2xl font-bold text-start'>
          <h1 className='row-span-2 mb-3'>sistem gi-Ret 2.0</h1>
        </div>
      </div>
      {/* content */}
      <div className='absolute inset-0 -z-10 flex bg-user5 text-center justify-center items-center capitalize'>
        <div className='w-5/6 lg:w-1/2 h-[25rem] mt-20 mb-5 bg-userWhite outline outline-1 outline-userBlack rounded-md shadow-xl'>
          <div className='grid ml-auto mr-auto p-5'>
            <div className='justify-center items-center text-xl font-semibold mt-7'>
              <h1>SELAMAT DATANG</h1>
              <h1>KE SISTEM GI-RET 2.0</h1>
              <p className='mt-3'>SILA PILIH FUNGSI APLIKASI</p>
              <p className='lg:hidden text-sm text-user6 mt-3'>
                MOBILE BOLEH MENGGUNAKAN MODUL PENGGUNA & PENDAFTARAN
              </p>
            </div>
            <div className='grid lg:grid-cols-2 ml-auto mr-auto mt-7 lg:mt-10 h-60'>
              <div className='w-56 h-max transition-all'>
                <div
                  onClick={() => {
                    setShowKlinikSubMenu(!showKlinikSubMenu);
                  }}
                  className='flex items-center justify-center rounded-md shadow-md p-3 m-1 bg-user3 hover:bg-user2 hover:text-userWhite transition-all hover:cursor-pointer'
                >
                  <span>Klinik</span>
                  <span className='ml-10'>
                    <FaArrowAltCircleUp
                      className={`transition-all ${
                        showKlinikSubMenu && 'rotate-180'
                      }`}
                    />
                  </span>
                </div>
                <div
                  className={`grid transition-all ${
                    showKlinikSubMenu ? 'max-h-96' : 'max-h-0 overflow-hidden'
                  }`}
                >
                  <Link
                    to='/kaunter'
                    className='grid bg-kaunter2 rounded-md shadow-md p-3 my-0.5 mx-1 hover:bg-kaunter1 hover:text-kaunterWhite transition-all'
                  >
                    Pendaftaran
                  </Link>
                  <Link
                    to='/pengguna'
                    className='bg-user4 rounded-md shadow-md p-3 my-0.5 mx-1 hover:bg-user3 hover:text-userWhite transition-all'
                  >
                    Pengguna
                  </Link>
                </div>
              </div>
              <Link
                to='/pentadbir'
                className='hidden lg:grid bg-admin3 rounded-md shadow-md p-3 h-max w-56 ml-auto mt-1 hover:bg-admin2 hover:text-userWhite text-center justify-center transition-all'
              >
                Pentadbir
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* footer */}
      <div className='absolute bottom-0 left-0 right-0 grid grid-cols-2 bg-user3 uppercase'>
        <p className='text-left ml-1 my-1 text-xs'>hak cipta kkm</p>
        <p className='text-right mr-1 my-1 text-xs whitespace-nowrap overflow-x-auto'>
          <a
            className='text-admin2 underline'
            href='https://forms.gle/v9P7w9qweTX86Nxn8'
          >
            helpdesk: borang maklumbalas
          </a>
        </p>
      </div>
    </>
  );
}

export default LandingPage;
