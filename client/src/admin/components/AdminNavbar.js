import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

function AdminNavbar() {
  const [showLinks, setShowLinks] = useState(false);

  const toggleLinks = () => {
    setShowLinks(!showLinks);
  };

  return (
    <>
      <nav
        className={`absolute w-60 h-screen bg-admin2 text-adminWhite text-center top-0 left-0 transition-all ${
          showLinks ? 'translate-x-0' : '-translate-x-60'
        }`}
      >
        <div className='h-28'></div>
        <div className='grid'>
          <NavLink
            className='outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
            to='/admin/landing'
            onClick={() => toggleLinks}
          >
            PAPARAN UTAMA
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
            }
            to='kp'
            onClick={() => toggleLinks}
          >
            KLINIK PERGIGIAN
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
            }
            to='pp'
            onClick={() => toggleLinks}
          >
            PEGAWAI PERGIGIAN
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
            }
            to='jp'
            onClick={() => toggleLinks}
          >
            JURUTERAPI PERGIGIAN
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
            }
            to='taska'
            onClick={() => toggleLinks}
          >
            TASKA
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
            }
            to='tadika'
            onClick={() => toggleLinks}
          >
            TADIKA
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
            }
            to='sr'
            onClick={() => toggleLinks}
          >
            SEKOLAH RENDAH
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
            }
            to='sm'
            onClick={() => toggleLinks}
          >
            SEKOLAH MENENGAH
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
            }
            to='ins'
            onClick={() => toggleLinks}
          >
            INSTITUSI
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
            }
            to='kpb'
            onClick={() => toggleLinks}
          >
            KP BERGERAK
          </NavLink>
        </div>
      </nav>
      <div className='absolute w-60 top-0 left-0 flex text-center justify-center h-28'>
        <button
          className='text-2xl bg-adminWhite text-adminBlack mt-8 mb-8 px-3 rounded-md shadow-xl hover:rotate-90 transition-all'
          onClick={() => setShowLinks(!showLinks)}
        >
          <FaBars />
        </button>
      </div>
    </>
  );
}

export default AdminNavbar;
