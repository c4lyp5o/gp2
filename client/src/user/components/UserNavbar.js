import { useState } from 'react';
import { FaBars } from 'react-icons/fa';

function UserNavbar() {
  const [showLinks, setShowLinks] = useState(false);

  const toggleLinks = () => {
    setShowLinks(!showLinks);
  };

  return (
    <>
      <nav
        className={`absolute w-60 h-screen bg-user2 text-userWhite text-center top-0 left-0 transition-all ${
          showLinks ? 'translate-x-0' : '-translate-x-60'
        }`}
      >
        <div className='h-40'></div>
        <div className='grid'>
          <a
            className='bg-user3 rounded-md shadow-xl p-3 m-1 hover:bg-user1 transition-all'
            href='#dashboard'
          >
            DASHBOARD
          </a>
          <a
            className='bg-user3 rounded-md shadow-xl p-3 m-1 hover:bg-user1 transition-all'
            href='#taska'
          >
            TASKA
          </a>
          <a
            className='bg-user3 rounded-md shadow-xl p-3 m-1 hover:bg-user1 transition-all'
            href='#sekolah'
          >
            SEKOLAH
          </a>
          <a
            className='bg-user3 rounded-md shadow-xl p-3 m-1 hover:bg-user1 transition-all'
            href='#institusi'
          >
            INSTITUSI
          </a>
          <a
            className='bg-user3 rounded-md shadow-xl p-3 m-1 hover:bg-user1 transition-all'
            href='#generate'
          >
            GENERATE RETEN
          </a>
        </div>
      </nav>
      <div className='absolute w-60 top-0 left-0 flex text-center justify-center h-40'>
        <button
          className='text-2xl bg-userWhite text-userBlack mt-14 mb-14 px-3 rounded-md shadow-xl hover:rotate-90 transition-all'
          onClick={toggleLinks}
        >
          <FaBars />
        </button>
      </div>
    </>
  );
}

export default UserNavbar;
