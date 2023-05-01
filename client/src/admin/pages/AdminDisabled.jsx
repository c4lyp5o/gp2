import { useEffect, useState } from 'react';

import { useGlobalAdminAppContext } from '../context/adminAppContext';
// component -----------------------------------------------------------
// header & navbar
import Header from '../components/Header';

// footer
import Footer from '../components/Footer';

export default function AdminDisabled() {
  const { logOutUser } = useGlobalAdminAppContext();

  const [countdown, setCountdown] = useState(10);

  // dealing with this later
  const props = {
    timer: 0,
  };

  useEffect(() => {
    setTimeout(() => {
      logOutUser();
    }, 11000);
    let timer = setInterval(() => {
      setCountdown((countdown) => countdown - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Header />
      <div className='absolute inset-0 -z-10 bg-admin5'></div>
      <div className='absolute inset-2 top-[7.5rem] bottom-[2rem] -z-10 bg-adminWhite text-center justify-center items-center outline outline-1 outline-adminBlack rounded-md shadow-xl capitalize overflow-y-auto overflow-x-hidden pt-2 pb-2 px-3'>
        <div className='flex flex-col items-center gap-5'>
          <h1 className='text-3xl font-bold mt-10 mb-10'>
            Maaf, laman pentadbir sistem Gi-Ret 2.0 sedang dalam proses
            penyelenggaraan. Kami memohon maaf atas segala kesulitan yang
            berlaku. Anda akan di log out dalam masa{' '}
            <span className='text-user9 text-3xl'>{countdown}</span> saat.
          </h1>
        </div>
      </div>
      <Footer />
    </>
  );
}
