import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

export default function Navbar(props) {
  const [showLinks, setShowLinks] = useState(false);

  const toggleLinks = () => {
    setShowLinks(!showLinks);
  };

  return (
    <>
      <nav
        className={`absolute w-60 h-screen bg-admin2 text-adminWhite text-center top-0 left-0 transition-all overflow-y-auto ${
          showLinks ? 'translate-x-0' : '-translate-x-60'
        }`}
      >
        <div className='h-28'></div>
        <div className='grid mb-10'>
          <NavLink
            className='outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
            to='/pentadbir/landing'
            onClick={() => setShowLinks(!showLinks)}
          >
            PAPARAN UTAMA
          </NavLink>
          {props.loginInfo.accountType !== 'kpUser' &&
            props.loginInfo.accountType !== 'negeriSuperadmin' &&
            props.loginInfo.accountType !== 'hqSuperadmin' && (
              <>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                      : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                  }
                  to='kp'
                  onClick={() => setShowLinks(!showLinks)}
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
                  onClick={() => setShowLinks(!showLinks)}
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
                  onClick={() => setShowLinks(!showLinks)}
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
                  onClick={() => setShowLinks(!showLinks)}
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
                  onClick={() => setShowLinks(!showLinks)}
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
                  onClick={() => setShowLinks(!showLinks)}
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
                  onClick={() => setShowLinks(!showLinks)}
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
                  onClick={() => setShowLinks(!showLinks)}
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
                  onClick={() => setShowLinks(!showLinks)}
                >
                  KP BERGERAK
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                      : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                  }
                  to='mp'
                  onClick={() => setShowLinks(!showLinks)}
                >
                  MAKMAL PERGIGIAN BERGERAK
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                      : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                  }
                  to='sosmed'
                  onClick={() => setShowLinks(!showLinks)}
                >
                  MEDIA SOSIAL
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                      : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                  }
                  to='aq'
                  onClick={() => setShowLinks(!showLinks)}
                >
                  AD-HOC QUERY
                </NavLink>
              </>
            )}
          {props.loginInfo.accountType === 'kpUser' && (
            <>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                    : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                }
                to='kp/program'
                onClick={() => setShowLinks(!showLinks)}
              >
                PROGRAM
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                    : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                }
                to='sosmed'
                onClick={() => setShowLinks(!showLinks)}
              >
                MEDIA SOSIAL
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                    : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                }
                to='kp/tastad'
                onClick={() => setShowLinks(!showLinks)}
              >
                TASKA/TADIKA
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                    : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                }
                to='kp/pp'
                onClick={() => setShowLinks(!showLinks)}
              >
                PEGAWAI
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                    : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                }
                to='kp/jp'
                onClick={() => setShowLinks(!showLinks)}
              >
                JURUTERAPI PERGIGIAN
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                    : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                }
                to='kp/institusi'
                onClick={() => setShowLinks(!showLinks)}
              >
                INSTITUSI
              </NavLink>
            </>
          )}
          {(props.loginInfo.accountType === 'negeriSuperadmin' ||
            props.loginInfo.accountType === 'hqSuperadmin') && (
            <>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                    : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                }
                to='aq'
                onClick={() => setShowLinks(!showLinks)}
              >
                AD-HOC QUERY
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                    : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                }
                to='sosmed'
                onClick={() => setShowLinks(!showLinks)}
              >
                MEDIA SOSIAL
              </NavLink>
            </>
          )}
        </div>
      </nav>

      <div className='absolute w-60 top-0 left-0 flex text-center justify-center h-28'>
        <button
          className='text-2xl bg-adminWhite text-adminBlack mt-8 mb-8 px-3 rounded-md shadow-xl hover:rotate-90 transition-all'
          onClick={toggleLinks}
        >
          <FaBars />
        </button>
      </div>
    </>
  );
}
