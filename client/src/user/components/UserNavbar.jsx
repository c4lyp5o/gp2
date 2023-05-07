import { NavLink } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { FaBars, FaArrowAltCircleUp } from 'react-icons/fa';

import { useGlobalUserAppContext } from '../context/userAppContext';

import jatanegara from '../../assets/Jata_MalaysiaV2.svg';
function UserNavbar() {
  const { userinfo } = useGlobalUserAppContext();

  const [showLinks, setShowLinks] = useState(false);
  const [showRetenSubMenu, setShowRetenSubMenu] = useState(false);
  const [showCarianSubMenu, setShowCarianSubMenu] = useState(false);

  const toggleLinks = () => {
    setShowLinks(!showLinks);
  };

  const toggleRetenSubMenu = () => {
    setShowRetenSubMenu(!showRetenSubMenu);
    setShowCarianSubMenu(false);
  };

  const toggleCarianSubMenu = () => {
    setShowCarianSubMenu(!showCarianSubMenu);
    setShowRetenSubMenu(false);
  };

  let barSisiRef = useRef();

  useEffect(() => {
    let tutupBarSisi = (e) => {
      if (!barSisiRef.current.contains(e.target)) {
        setShowLinks(false);
      }
    };
    document.addEventListener('mousedown', tutupBarSisi);
    return () => {
      document.removeEventListener('mousedown', tutupBarSisi);
    };
  });

  return (
    <>
      <div ref={barSisiRef}>
        <nav
          className={`absolute w-60 h-screen bg-user2 text-userWhite text-center top-0 left-0 transition-all overflow-y-auto ${
            showLinks ? 'translate-x-0' : '-translate-x-60'
          }`}
        >
          <div className='lg:h-28'></div>
          <div className='lg:hidden grid grid-rows-[50px_10px_10px] h-48 gap-1 text-center pt-24'>
            <img
              className='w-full h-full'
              src={jatanegara}
              alt='missing jata negara'
            />
            <p className='uppercase text-[0.65rem]'>
              kementerian kesihatan malaysia
            </p>
            <p className='uppercase text-[0.65rem]'>
              program kesihatan pergigian
            </p>
          </div>
          <div className='grid'>
            <NavLink
              to='/pengguna/landing'
              onClick={() => {
                setShowLinks(!showLinks);
                setShowRetenSubMenu(false);
                setShowCarianSubMenu(false);
              }}
              className='bg-user4 rounded-md shadow-xl p-3 m-1 hover:bg-user3 transition-all'
            >
              PAPARAN UTAMA
            </NavLink>
            <NavLink
              to='status-harian'
              onClick={() => {
                setShowLinks(!showLinks);
                setShowRetenSubMenu(false);
                setShowCarianSubMenu(false);
              }}
              className={({ isActive }) =>
                isActive
                  ? 'bg-user3 rounded-md shadow-xl p-3 m-1 hover:bg-user3 transition-all'
                  : 'bg-user4 rounded-md shadow-xl p-3 m-1 hover:bg-user3 transition-all'
              }
            >
              STATUS HARIAN
            </NavLink>
            <div>
              <div
                className={`${
                  showRetenSubMenu ? 'bg-user3' : 'bg-user4'
                } flex items-center justify-center rounded-md shadow-xl p-3 m-1 hover:bg-user3 transition-all hover:cursor-pointer`}
                onClick={toggleRetenSubMenu}
                data-cy='navbar-pengisian-data'
              >
                <span>PENGISIAN DATA</span>
                <span className='ml-10'>
                  <FaArrowAltCircleUp
                    className={`transition-all ${
                      showRetenSubMenu && 'rotate-180'
                    }`}
                  />
                </span>
              </div>
              <div
                className={`grid transition-all ${
                  showRetenSubMenu ? 'max-h-96' : 'max-h-0 overflow-hidden'
                }`}
              >
                <NavLink
                  to='umum'
                  onClick={() => {
                    setShowLinks(!showLinks);
                  }}
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-user8 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                      : 'bg-user1 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                  }
                  data-cy='navbar-umum'
                >
                  UMUM
                </NavLink>
                {import.meta.env.VITE_ENV === 'TRAINING' ||
                import.meta.env.VITE_ENV === 'UNSTABLE' ||
                import.meta.env.VITE_ENV === 'DEV' ? (
                  <NavLink
                    to='senarai-sekolah'
                    onClick={() => {
                      setShowLinks(!showLinks);
                    }}
                    className={({ isActive }) =>
                      isActive
                        ? 'bg-user8 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                        : 'bg-user1 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                    }
                  >
                    SEKOLAH
                  </NavLink>
                ) : null}
                <NavLink
                  to='promosi-individu'
                  onClick={() => {
                    setShowLinks(!showLinks);
                  }}
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-user8 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                      : 'bg-user1 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                  }
                >
                  PROMOSI INDIVIDU
                </NavLink>
                {userinfo.rolePromosiKlinik === true && (
                  <NavLink
                    to='promosi-klinik'
                    onClick={() => {
                      setShowLinks(!showLinks);
                    }}
                    className={({ isActive }) =>
                      isActive
                        ? 'bg-user8 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                        : 'bg-user1 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                    }
                  >
                    PROMOSI KLINIK
                  </NavLink>
                )}
                {import.meta.env.VITE_ENV === 'TRAINING' ||
                import.meta.env.VITE_ENV === 'UNSTABLE' ||
                import.meta.env.VITE_ENV === 'DEV' ? (
                  <NavLink
                    to='kohort'
                    onClick={() => {
                      setShowLinks(!showLinks);
                    }}
                    className={({ isActive }) =>
                      isActive
                        ? 'bg-user8 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                        : 'bg-user1 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                    }
                  >
                    KOHORT
                  </NavLink>
                ) : null}
              </div>
            </div>
            {/* {reliefUserToken ? null : (
              <div>
                <div
                  className={`${
                    showGenerateSubMenu ? 'bg-user3' : 'bg-user4'
                  } flex items-center justify-center rounded-md shadow-xl p-3 m-1 hover:bg-user3 transition-all hover:cursor-pointer`}
                  onClick={toggleGenerateSubMenu}
                >
                  <span>JANA LAPORAN</span>
                  <span className='ml-10'>
                    <FaArrowAltCircleUp
                      className={`transition-all ${
                        showGenerateSubMenu && 'rotate-180'
                      }`}
                    />
                  </span>
                </div>
                <div
                  className={`grid transition-all ${
                    showGenerateSubMenu ? 'max-h-96' : 'max-h-0 overflow-hidden'
                  }`}
                >
                  <NavLink
                    to='generate-individu'
                    onClick={() => {
                      setShowLinks(!showLinks);
                      setShowRetenSubMenu(false);
                    }}
                    className={({ isActive }) =>
                      isActive
                        ? 'bg-user8 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                        : 'bg-user1 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                    }
                  >
                    INDIVIDU
                  </NavLink>
                  {userinfo.role === 'admin' ? (
                    <NavLink
                      to='generate-klinik'
                      onClick={() => {
                        setShowLinks(!showLinks);
                        setShowRetenSubMenu(false);
                      }}
                      className={({ isActive }) =>
                        isActive
                          ? 'bg-user8 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                          : 'bg-user1 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                      }
                    >
                      KLINIK
                    </NavLink>
                  ) : null}
                </div>
              </div>
            )} */}
            <div>
              <div
                className={`${
                  showCarianSubMenu ? 'bg-user3' : 'bg-user4'
                } flex items-center justify-center rounded-md shadow-xl p-3 m-1 hover:bg-user3 transition-all hover:cursor-pointer`}
                onClick={toggleCarianSubMenu}
                data-cy='navbar-pengisian-data'
              >
                <span>CARIAN</span>
                <span className='ml-10'>
                  <FaArrowAltCircleUp
                    className={`transition-all ${
                      showCarianSubMenu && 'rotate-180'
                    }`}
                  />
                </span>
              </div>
              <div
                className={`grid transition-all ${
                  showCarianSubMenu ? 'max-h-96' : 'max-h-0 overflow-hidden'
                }`}
              >
                <NavLink
                  to='carian/pesakit'
                  onClick={() => {
                    setShowLinks(!showLinks);
                  }}
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-user8 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                      : 'bg-user1 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                  }
                >
                  CARIAN PESAKIT
                </NavLink>
                {import.meta.env.VITE_ENV === 'DEV' ? (
                  <NavLink
                    to='carian/sekolah'
                    onClick={() => {
                      setShowLinks(!showLinks);
                    }}
                    className={({ isActive }) =>
                      isActive
                        ? 'bg-user8 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                        : 'bg-user1 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                    }
                  >
                    CARIAN MURID SEKOLAH
                  </NavLink>
                ) : null}
                <NavLink
                  to='carian/promosi'
                  onClick={() => {
                    setShowLinks(!showLinks);
                  }}
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-user8 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                      : 'bg-user1 rounded-md shadow-xl p-3 my-0.5 mx-1 hover:bg-user8 transition-all'
                  }
                >
                  CARIAN AKTIVITI PROMOSI
                </NavLink>
              </div>
            </div>
            <NavLink
              to='summary'
              onClick={() => {
                setShowLinks(!showLinks);
                setShowRetenSubMenu(false);
                setShowCarianSubMenu(false);
              }}
              className={({ isActive }) =>
                isActive
                  ? 'bg-user3 rounded-md shadow-xl p-3 m-1 hover:bg-user3 transition-all mb-10'
                  : 'bg-user4 rounded-md shadow-xl p-3 m-1 hover:bg-user3 transition-all mb-10'
              }
            >
              REKOD PEGAWAI
            </NavLink>
          </div>
        </nav>
        <div className='absolute w-60 top-0 left-0 flex text-center h-28 lg:justify-center pl-5 lg:pl-0'>
          <button
            className='text-2xl bg-userWhite text-userBlack mt-8 mb-8 px-3 rounded-md shadow-xl hover:rotate-90 transition-all'
            onClick={toggleLinks}
            data-cy='navbar-button-pengguna'
          >
            <FaBars />
          </button>
        </div>
      </div>
    </>
  );
}

export default UserNavbar;
