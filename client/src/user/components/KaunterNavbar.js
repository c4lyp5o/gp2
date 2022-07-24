import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { FaBars, FaArrowAltCircleUp } from 'react-icons/fa';

function KaunterNavbar() {
  const [showLinks, setShowLinks] = useState(false);
  const [showOutreachSubMenu, setshowOutreachSubMenu] = useState(false);

  const toggleLinks = () => {
    setshowOutreachSubMenu(false);
    setShowLinks(!showLinks);
  };

  const toggleOutreachSubMenu = () => {
    setshowOutreachSubMenu(!showOutreachSubMenu);
  };

  return (
    <>
      <nav
        className={`absolute w-60 h-screen bg-user2 text-userWhite text-center top-0 left-0 transition-all ${
          showLinks ? 'translate-x-0' : '-translate-x-60'
        }`}
      >
        <div className='h-28'></div>
        <div className='grid'>
          <NavLink
            to='/kaunter/daftar'
            onClick={() => {
              toggleLinks();
            }}
            className='bg-user4 rounded-md shadow-xl p-3 m-1 hover:bg-user3 transition-all'
          >
            DASHBOARD
          </NavLink>
          <NavLink
            to='klinik'
            onClick={() => {
              toggleLinks();
            }}
            className={({ isActive }) =>
              isActive
                ? 'bg-user3 rounded-md shadow-xl p-3 m-1 hover:bg-user3 transition-all'
                : 'bg-user4 rounded-md shadow-xl p-3 m-1 hover:bg-user3 transition-all'
            }
          >
            KLINIK
          </NavLink>
          <NavLink
            to='kkkd'
            onClick={() => {
              toggleLinks();
            }}
            className={({ isActive }) =>
              isActive
                ? 'bg-user3 rounded-md shadow-xl p-3 m-1 hover:bg-user3 transition-all'
                : 'bg-user4 rounded-md shadow-xl p-3 m-1 hover:bg-user3 transition-all'
            }
          >
            KK / KD
          </NavLink>
          <NavLink
            to='tastad'
            onClick={() => {
              toggleLinks();
            }}
            className={({ isActive }) =>
              isActive
                ? 'bg-user3 rounded-md shadow-xl p-3 m-1 hover:bg-user3 transition-all'
                : 'bg-user4 rounded-md shadow-xl p-3 m-1 hover:bg-user3 transition-all'
            }
          >
            TASKA / TADIKA
          </NavLink>
          <NavLink
            to='ipt'
            onClick={() => {
              toggleLinks();
            }}
            className={({ isActive }) =>
              isActive
                ? 'bg-user3 rounded-md shadow-xl p-3 m-1 hover:bg-user3 transition-all'
                : 'bg-user4 rounded-md shadow-xl p-3 m-1 hover:bg-user3 transition-all'
            }
          >
            IPTA / IPTS
          </NavLink>
          <div>
            <div
              className={`${
                setshowOutreachSubMenu ? 'bg-user3' : 'bg-user4'
              } flex items-center justify-center rounded-md shadow-xl p-3 m-1 hover:bg-user3 transition-all hover:cursor-pointer`}
              onClick={toggleOutreachSubMenu}
            >
              <span>OUTREACH</span>
              <span className='ml-10'>
                <FaArrowAltCircleUp
                  className={`transition-all ${
                    showOutreachSubMenu && 'rotate-90'
                  }`}
                />
              </span>
            </div>
            <div
              className={`absolute w-60 h-screen bg-user2 text-userWhite text-center top-0 left-60 transition-all -z-20 ${
                showOutreachSubMenu ? 'translate-x-0' : 'hidden -translate-x-60'
              }`}
            >
              <div className='h-28'></div>
              <div className='grid'>
                <NavLink
                  to='orang-asli'
                  onClick={() => {
                    setShowLinks(!showLinks);
                    showOutreachSubMenu(false);
                  }}
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-user8 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                      : 'bg-user1 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                  }
                >
                  ORANG ASLI
                </NavLink>
                <NavLink
                  to='ppr'
                  onClick={() => {
                    setShowLinks(!showLinks);
                    showOutreachSubMenu(false);
                  }}
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-user8 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                      : 'bg-user1 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                  }
                >
                  PPR
                </NavLink>
                <NavLink
                  to='iwe'
                  onClick={() => {
                    setShowLinks(!showLinks);
                    showOutreachSubMenu(false);
                  }}
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-user8 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                      : 'bg-user1 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                  }
                >
                  INSTITUSI WARGA EMAS
                </NavLink>
                <NavLink
                  to='oku'
                  onClick={() => {
                    setShowLinks(!showLinks);
                    showOutreachSubMenu(false);
                  }}
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-user8 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                      : 'bg-user1 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                  }
                >
                  INSTITUSI OKU
                </NavLink>
                <NavLink
                  to='ngangkat'
                  onClick={() => {
                    setShowLinks(!showLinks);
                    showOutreachSubMenu(false);
                  }}
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-user8 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                      : 'bg-user1 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                  }
                >
                  KAMPUNG ANGKAT
                </NavLink>
                <NavLink
                  to='komlain'
                  onClick={() => {
                    setShowLinks(!showLinks);
                    showOutreachSubMenu(false);
                  }}
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-user8 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                      : 'bg-user1 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                  }
                >
                  PROJEK KOMUNITI LAIN
                </NavLink>
                <NavLink
                  to='kelantan'
                  onClick={() => {
                    setShowLinks(!showLinks);
                    showOutreachSubMenu(false);
                  }}
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-user8 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                      : 'bg-user1 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                  }
                >
                  RTC (KELANTAN SAHAJA)
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className='absolute w-60 top-0 left-0 flex text-center justify-center h-28'>
        <button
          className='text-2xl bg-userWhite text-userBlack mt-8 mb-8 px-3 rounded-md shadow-xl hover:rotate-90 transition-all'
          onClick={toggleLinks}
        >
          <FaBars />
        </button>
      </div>
    </>
  );
}

export default KaunterNavbar;
