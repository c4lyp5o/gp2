import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowAltCircleUp, FaBell } from 'react-icons/fa';

function LandingPage() {
  const [showKlinikSubMenu, setShowKlinikSubMenu] = useState(false);

  const [showUpdate, setShowUpdate] = useState(false);
  // dropdown notification
  let notificationRef = useRef();

  // useEffect(() => {
  //   let tutupNotification = (e) => {
  //     if (!notificationRef.current.contains(e.target)) {
  //       setShowUpdate(false);
  //     }
  //   };
  //   document.addEventListener('mousedown', tutupNotification);
  //   return () => {
  //     document.removeEventListener('mousedown', tutupNotification);
  //   };
  // });

  //footer
  const [showFooter, setShowFooter] = useState(false);

  let footerRef = useRef();

  useEffect(() => {
    let tutupFooter = (e) => {
      if (!footerRef.current.contains(e.target)) {
        setShowFooter(false);
      }
    };
    document.addEventListener('mousedown', tutupFooter);
    return () => {
      document.removeEventListener('mousedown', tutupFooter);
    };
  });

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
            <h1 className='md:hidden text-base font-semibold'>
              sistem gi-Ret 2.0
            </h1>
            <span className='lg:hidden text-xs text-user6 font-bold'>
              {import.meta.env.VITE_ENV}
            </span>
          </div>
        </div>
        <div className='hidden md:grid grid-rows-2 text-2xl font-bold text-start'>
          <h1 className='row-span-2 mb-3'>sistem gi-Ret 2.0</h1>
          <span className='ml-10 text-user6'>{import.meta.env.VITE_ENV}</span>
          <span className='hidden lg:block'>
            <img
              className='-my-14 mx-52'
              src='https://upload.wikimedia.org/wikipedia/commons/7/71/Ketupat.svg'
              alt='missing ketupat kanan'
            />
          </span>
        </div>
      </div>
      {/* <div ref={notificationRef}>
        <div className='absolute top-10 right-6'>
          <div className='relative'>
            <FaBell
              className='transition-colors hover:text-user hover:scale-110 duration-500 text-3xl text-userWhite cursor-pointer'
              onClick={() => {
                setShowUpdate(!showUpdate);
              }}
            />
            <span className='absolute top-0.5 right-0.5 -mr-1 -mt-1 w-3 h-3 rounded-full bg-user9 animate-ping'></span>
            <span className='absolute top-0.5 right-0.5 -mr-1 -mt-1 w-3 h-3 rounded-full bg-user9'></span>
            <div
              className={`absolute w-48 z-50 shadow-md bg-userWhite text-user1 top-9 right-1 transition-all duration-500 ${
                showUpdate
                  ? 'max-h-96 translate-y-1'
                  : 'max-h-0 overflow-hidden'
              }`}
            >
              <div className='flex flex-col overflow-x-auto'>
                <div className='flex flex-col justify-between p-2 border-l-4 border-l-user2  border-b-2 border-b-user1 border-opacity-50'>
                  <p className='text-xs font-thin'>8/1/2022</p>
                  <p className='text-sm font-mono'>
                    Butang penjanaan reten PG101 ditutup buat sementara waktu
                    untuk penambahbaikan
                  </p>
                </div>
              </div>
              <div className='flex flex-col overflow-x-auto'>
                <div className='flex flex-col justify-between p-2 border-l-4 border-l-user2  border-b-2 border-b-user1 border-opacity-50'>
                  <p className='text-base font-mono'>Kemaskini Terkini</p>
                  <p className='text-xs font-thin'>2.0.1/22</p>
                </div>
              </div>
              <div className='flex flex-col overflow-x-auto'>
                <div className='flex flex-col justify-between p-2 border-l-4 border-l-user2  border-b-2 border-b-user1 border-opacity-50'>
                  <p className='text-base font-mono'>Kemaskini Terkini</p>
                  <p className='text-xs font-thin'>2.0.1/22</p>
                </div>
              </div>
              <div className='flex flex-col overflow-x-auto'>
                <div className='flex flex-col justify-between p-2 border-l-4 border-l-user2  border-b-2 border-b-user1 border-opacity-50'>
                  <p className='text-base font-mono'>Kemaskini Terkini</p>
                  <p className='text-xs font-thin'>2.0.1/22</p>
                </div>
              </div>
              <div className='flex flex-col overflow-x-auto'>
                <div className='flex flex-col justify-between p-2 border-l-4 border-l-user2  border-b-2 border-b-user1 border-opacity-50'>
                  <p className='text-base font-mono'>Kemaskini Terkini</p>
                  <p className='text-xs font-thin'>2.0.1/22</p>
                </div>
              </div>
              <div className='flex flex-col overflow-x-auto'>
                <div className='flex flex-col justify-between p-2 border-l-4 border-l-user2  border-b-2 border-b-user1 border-opacity-50'>
                  <p className='text-base font-mono'>Kemaskini Terkini</p>
                  <p className='text-xs font-thin'>2.0.1/22</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
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
                  data-cy='klinik'
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
                    to='/pendaftaran'
                    className='grid bg-kaunter2 rounded-md shadow-md p-3 my-0.5 mx-1 hover:bg-kaunter1 hover:text-kaunterWhite transition-all'
                    data-cy='pendaftaran'
                  >
                    Pendaftaran
                  </Link>
                  <Link
                    to='/pengguna'
                    className='bg-user4 rounded-md shadow-md p-3 my-0.5 mx-1 hover:bg-user3 hover:text-userWhite transition-all'
                    data-cy='pengguna'
                  >
                    Pengguna
                  </Link>
                </div>
              </div>
              <Link
                to='/pentadbir'
                className='hidden lg:grid bg-admin3 rounded-md shadow-md p-3 h-max w-56 ml-auto mt-1 hover:bg-admin2 hover:text-userWhite text-center justify-center transition-all'
                data-cy='pentadbir'
              >
                Pentadbir
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* footer */}
      <div ref={footerRef}>
        <div className='absolute bottom-0 left-0 right-0 grid bg-user3 uppercase'>
          <div className='hidden lg:grid grid-cols-2 justify-start'>
            <p className='text-left ml-1 my-1 text-xs pl-2 whitespace-nowrap overflow-x-auto'>
              hak cipta kementerian kesihatan malaysia
            </p>
            <div className='hidden lg:flex flex-row justify-end pr-2'>
              <p className='flex justify-center text-center my-1 text-xs whitespace-nowrap overflow-x-auto pr-3 lowercase'>
                <a
                  target='_blank'
                  rel='noreferrer'
                  className='underline'
                  href='https://docs.google.com/document/d/1XxsCBJEyahOG7HGPZHC3OYBJ6nuhNH9yv5nHUmTp8Bw/edit'
                >
                  v{import.meta.env.VITE_VERSION}
                </a>
              </p>
              <p className='flex justify-center text-center my-1 text-xs whitespace-nowrap overflow-x-auto pr-3'>
                <a
                  target='_blank'
                  rel='noreferrer'
                  className='underline'
                  href='https://forms.gle/v9P7w9qweTX86Nxn8'
                >
                  meja bantuan
                </a>
              </p>
              <p className='text-right mr-1 my-1 text-xs whitespace-nowrap overflow-x-auto'>
                <Link
                  target='_blank'
                  rel='noreferrer'
                  to='/faq'
                  className='underline'
                >
                  soalan lazim
                </Link>
              </p>
            </div>
          </div>
          <div className='lg:hidden grid justify-start'>
            <div
              className='flex flex-row items-center justify-evenly cursor-pointer'
              onClick={() => setShowFooter(!showFooter)}
            >
              <p className='text-left ml-1 my-1 text-xs pl-2 whitespace-nowrap overflow-x-auto'>
                hak cipta kementerian kesihatan malaysia
              </p>
              <FaArrowAltCircleUp
                className={`ml-3 items-center text-right transition-all ${
                  showFooter && 'rotate-180'
                }`}
              />
            </div>
            <div
              className={`absolute z-10 bg-user4 bottom-5 right-0 w-full flex flex-col justify-center items-center text-center text-xs rounded-t-lg space-y-1 transition-all duration-500 ${
                showFooter
                  ? 'max-h-min -translate-y-1'
                  : 'max-h-0 overflow-hidden'
              }`}
            >
              <p className='flex justify-center text-center my-1 pb-2 py-1 text-xs whitespace-nowrap overflow-x-auto w-full border-b border-b-user1 border-opacity-50 lowercase'>
                <a
                  target='_blank'
                  rel='noreferrer'
                  className='underline'
                  href='https://docs.google.com/document/d/1XxsCBJEyahOG7HGPZHC3OYBJ6nuhNH9yv5nHUmTp8Bw/edit'
                >
                  v{import.meta.env.VITE_VERSION}
                </a>
              </p>
              <p className='flex justify-center text-center my-1 pb-2 py-1 text-xs whitespace-nowrap overflow-x-auto w-full border-b border-b-user1 border-opacity-50'>
                <a
                  target='_blank'
                  rel='noreferrer'
                  className='underline'
                  href='https://forms.gle/v9P7w9qweTX86Nxn8'
                >
                  meja bantuan
                </a>
              </p>
              <p className='text-center text-xs whitespace-nowrap overflow-x-auto py-1'>
                <Link
                  target='_blank'
                  rel='noreferrer'
                  to='/faq'
                  className='underline'
                >
                  soalan lazim
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;