import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { FaBars, FaArrowAltCircleUp } from 'react-icons/fa';

function KaunterNavbar() {
  const [showLinks, setShowLinks] = useState(false);
  const [showOutreachSubMenu, setshowOutreachSubMenu] = useState(false);
  const [outreachIsOn, setOutreachIsOn] = useState(false);

  const toggleLinks = () => {
    setShowLinks(!showLinks);
    outreachIsOn === true
      ? setshowOutreachSubMenu(!showOutreachSubMenu)
      : console.log('hehe'); // anyone got any ideas?
  };

  const toggleOutreachSubMenu = () => {
    setshowOutreachSubMenu(!showOutreachSubMenu);
  };

  const outreachOn = () => {
    setShowLinks(!showLinks);
    setOutreachIsOn(true);
    setshowOutreachSubMenu(!showOutreachSubMenu);
  };

  const outreachOff = () => {
    setShowLinks(!showLinks);
    setOutreachIsOn(false);
    setshowOutreachSubMenu(false);
  };

  return (
    <>
      <nav
        className={`absolute w-60 h-screen bg-kaunter1 text-kaunterWhite text-center top-0 left-0 transition-all ${
          showLinks ? 'translate-x-0' : '-translate-x-60'
        }`}
      >
        <div className='h-28'></div>
        <div className='grid'>
          <NavLink
            to='/kaunter/daftar'
            onClick={() => {
              outreachOff();
            }}
            className='bg-kaunter2 rounded-md shadow-xl p-3 m-1 hover:bg-kaunter3 transition-all'
          >
            DASHBOARD
          </NavLink>
          <NavLink
            to='klinik'
            onClick={() => {
              outreachOff();
            }}
            className={({ isActive }) =>
              isActive
                ? 'bg-kaunter3 rounded-md shadow-xl p-3 m-1 hover:bg-kaunter3 transition-all'
                : 'bg-kaunter2 rounded-md shadow-xl p-3 m-1 hover:bg-kaunter3 transition-all'
            }
          >
            KLINIK
          </NavLink>
          <NavLink
            to='kkkd'
            onClick={() => {
              outreachOff();
            }}
            className={({ isActive }) =>
              isActive
                ? 'bg-kaunter3 rounded-md shadow-xl p-3 m-1 hover:bg-kaunter2 transition-all'
                : 'bg-kaunter2 rounded-md shadow-xl p-3 m-1 hover:bg-kaunter3 transition-all'
            }
          >
            KK / KD
          </NavLink>
          <NavLink
            to='tastad'
            onClick={() => {
              outreachOff();
            }}
            className={({ isActive }) =>
              isActive
                ? 'bg-kaunter3 rounded-md shadow-xl p-3 m-1 hover:bg-kaunter2 transition-all'
                : 'bg-kaunter2 rounded-md shadow-xl p-3 m-1 hover:bg-kaunter3 transition-all'
            }
          >
            TASKA / TADIKA
          </NavLink>
          <NavLink
            to='ipt'
            onClick={() => {
              outreachOff();
            }}
            className={({ isActive }) =>
              isActive
                ? 'bg-kaunter3 rounded-md shadow-xl p-3 m-1 hover:bg-kaunter2 transition-all'
                : 'bg-kaunter2 rounded-md shadow-xl p-3 m-1 hover:bg-kaunter3 transition-all'
            }
          >
            IPTA / IPTS
          </NavLink>
          <div>
            <div
              className={`${
                setshowOutreachSubMenu ? 'bg-kaunter2' : 'bg-kaunter3'
              } flex items-center justify-center rounded-md shadow-xl p-3 m-1 hover:bg-kaunter3 transition-all hover:cursor-pointer`}
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
              className={`absolute w-60 h-screen bg-kaunter1 text-kaunterWhite text-center top-0 left-60 transition-all -z-20 ${
                showOutreachSubMenu ? 'translate-x-0' : 'hidden -translate-x-60'
              }`}
            >
              <div className='h-28'></div>
              <div className='grid'>
                <NavLink
                  to='orang-asli'
                  onClick={() => {
                    outreachOn();
                  }}
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-user8 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                      : 'bg-kaunter2 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                  }
                >
                  ORANG ASLI
                </NavLink>
                <NavLink
                  to='ppr'
                  onClick={() => {
                    outreachOn();
                  }}
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-user8 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                      : 'bg-kaunter2 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                  }
                >
                  PPR
                </NavLink>
                <NavLink
                  to='iwe'
                  onClick={() => {
                    outreachOn();
                  }}
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-user8 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                      : 'bg-kaunter2 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                  }
                >
                  INSTITUSI WARGA EMAS
                </NavLink>
                <NavLink
                  to='oku'
                  onClick={() => {
                    outreachOn();
                  }}
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-user8 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                      : 'bg-kaunter2 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                  }
                >
                  INSTITUSI OKU
                </NavLink>
                <NavLink
                  to='ngangkat'
                  onClick={() => {
                    outreachOn();
                  }}
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-user8 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                      : 'bg-kaunter2 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                  }
                >
                  KAMPUNG ANGKAT
                </NavLink>
                <NavLink
                  to='komlain'
                  onClick={() => {
                    outreachOn();
                  }}
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-user8 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                      : 'bg-kaunter2 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                  }
                >
                  PROJEK KOMUNITI LAIN
                </NavLink>
                <NavLink
                  to='kelantan'
                  onClick={() => {
                    outreachOn();
                  }}
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-user8 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                      : 'bg-kaunter2 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
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
          className='text-2xl bg-kaunterWhite text-kaunterBlack mt-8 mb-8 px-3 rounded-md shadow-xl hover:rotate-90 transition-all'
          onClick={toggleLinks}
        >
          <FaBars />
        </button>
      </div>
    </>
  );
}

export default KaunterNavbar;
