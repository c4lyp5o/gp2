import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaArrowAltCircleUp } from 'react-icons/fa';

import { useGlobalAdminAppContext } from '../context/adminAppContext';

export default function Navbar(props) {
  const { loginInfo } = useGlobalAdminAppContext();

  const [showLinks, setShowLinks] = useState(false);
  const [showPenetapanSubMenu, setShowPenetapanSubMenu] = useState(false);
  const [showMedSosSubMenu, setShowMedSosSubMenu] = useState(false);
  const [showPromosiSubMenu, setShowPromosiSubMenu] = useState(false);
  const [showMaklumatLainSubMenu, setShowMaklumatLainSubMenu] = useState(false);
  const [showAgensiLuarSubMenu, setShowAgensiLuarSubMenu] = useState(false);

  const togglePenetapanSubMenu = () => {
    setShowPenetapanSubMenu(!showPenetapanSubMenu);
    setShowPromosiSubMenu(false);
    setShowMedSosSubMenu(false);
    setShowMaklumatLainSubMenu(false);
    setShowAgensiLuarSubMenu(false);
  };

  const toggleSubMenuPromosi = () => {
    setShowPromosiSubMenu(!showPromosiSubMenu);
    setShowPenetapanSubMenu(false);
    setShowMedSosSubMenu(false);
    setShowMaklumatLainSubMenu(false);
    setShowAgensiLuarSubMenu(false);
  };

  const toggleSubMenuMedSos = () => {
    setShowMedSosSubMenu(!showMedSosSubMenu);
    setShowPenetapanSubMenu(false);
    // setShowPromosiSubMenu(false);
    setShowMaklumatLainSubMenu(false);
  };

  const toggleSubMenuMaklumatLain = () => {
    setShowMaklumatLainSubMenu(!showMaklumatLainSubMenu);
    setShowPenetapanSubMenu(false);
    setShowPromosiSubMenu(false);
    setShowMedSosSubMenu(false);
    setShowAgensiLuarSubMenu(false);
  };

  const toggleSubMenuAgensiLuar = () => {
    setShowAgensiLuarSubMenu(!showAgensiLuarSubMenu);
    setShowPenetapanSubMenu(false);
    setShowPromosiSubMenu(false);
    setShowMedSosSubMenu(false);
    setShowMaklumatLainSubMenu(false);
  };

  const toggleLinks = () => {
    setShowLinks(!showLinks);
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
          className={`absolute w-60 h-screen bg-admin2 text-adminWhite text-center top-0 left-0 transition-all overflow-y-auto ${
            showLinks ? 'translate-x-0' : '-translate-x-60'
          }`}
        >
          <div className='h-28'></div>
          <div className='grid mb-10'>
            <NavLink
              className='outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
              to='/pentadbir/landing'
              onClick={() => {
                setShowLinks(!showLinks);
                setShowPenetapanSubMenu(false);
                setShowMedSosSubMenu(false);
                setShowMaklumatLainSubMenu(false);
              }}
            >
              PAPARAN UTAMA
            </NavLink>
            {/* TODO rearrange pentadbir navbar according to AdminAfterLogin, easier to maintain & read for all the CSS and design stuff */}
            {loginInfo.accountType === 'daerahSuperadmin' && (
              <>
                <div>
                  <div
                    className={`${
                      showPenetapanSubMenu ? 'bg-admin3' : 'bg-admin2'
                    } outline outline-admin3 outline-1 flex items-center justify-center rounded-md shadow-xl p-3 m-1 hover:bg-admin3 cursor-pointer transition-all`}
                    onClick={togglePenetapanSubMenu}
                  >
                    <span>PENETAPAN</span>
                    <span className='inline-flex ml-2'>
                      <FaArrowAltCircleUp
                        className={`transition-all ${
                          showPenetapanSubMenu && 'rotate-180'
                        }`}
                      />
                    </span>
                  </div>
                  <div
                    className={`grid transition-all ${
                      showPenetapanSubMenu
                        ? 'max-h-[50rem]'
                        : 'max-h-0 overflow-hidden'
                    }`}
                  >
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? 'outline outline-admin3 outline-1 bg-admin7 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                          : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                      }
                      to='kp'
                      onClick={() => setShowLinks(!showLinks)}
                    >
                      KLINIK PERGIGIAN
                    </NavLink>
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? 'outline outline-admin3 outline-1 bg-admin7 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                          : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                      }
                      to='kkiakd'
                      onClick={() => setShowLinks(!showLinks)}
                    >
                      KKIA / KD
                    </NavLink>
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? 'outline outline-admin3 outline-1 bg-admin7 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                          : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                      }
                      to='pp'
                      onClick={() => setShowLinks(!showLinks)}
                    >
                      PEGAWAI PERGIGIAN
                    </NavLink>
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? 'outline outline-admin3 outline-1 bg-admin7 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                          : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                      }
                      to='jp'
                      onClick={() => setShowLinks(!showLinks)}
                    >
                      JURUTERAPI PERGIGIAN
                    </NavLink>
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? 'outline outline-admin3 outline-1 bg-admin7 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                          : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                      }
                      to='taska'
                      onClick={() => setShowLinks(!showLinks)}
                    >
                      TASKA
                    </NavLink>
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? 'outline outline-admin3 outline-1 bg-admin7 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                          : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                      }
                      to='tadika'
                      onClick={() => setShowLinks(!showLinks)}
                    >
                      TADIKA
                    </NavLink>
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? 'outline outline-admin3 outline-1 bg-admin7 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                          : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                      }
                      to='sr'
                      onClick={() => setShowLinks(!showLinks)}
                    >
                      SEKOLAH RENDAH
                    </NavLink>
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? 'outline outline-admin3 outline-1 bg-admin7 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                          : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                      }
                      to='sm'
                      onClick={() => setShowLinks(!showLinks)}
                    >
                      SEKOLAH MENENGAH
                    </NavLink>
                    {/* <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? 'outline outline-admin3 outline-1 bg-admin7 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                          : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                      }
                      to='ins'
                      onClick={() => setShowLinks(!showLinks)}
                    >
                      INSTITUSI
                    </NavLink> */}
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? 'outline outline-admin3 outline-1 bg-admin7 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                          : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                      }
                      to='program'
                      onClick={() => setShowLinks(!showLinks)}
                    >
                      PROGRAM KOMUNITI
                    </NavLink>
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? 'outline outline-admin3 outline-1 bg-admin7 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                          : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                      }
                      to='kpb'
                      onClick={() => setShowLinks(!showLinks)}
                    >
                      KLINIK PERGIGIAN BERGERAK
                    </NavLink>
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? 'outline outline-admin3 outline-1 bg-admin7 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                          : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                      }
                      to='mpb'
                      onClick={() => setShowLinks(!showLinks)}
                    >
                      MAKMAL PERGIGIAN BERGERAK
                    </NavLink>
                  </div>
                </div>
                <div>
                  <div
                    className={`${
                      showPromosiSubMenu ? 'bg-admin3' : 'bg-admin2'
                    } outline outline-admin3 outline-1 flex items-center justify-center rounded-md shadow-xl p-3 m-1 hover:bg-admin3 cursor-pointer transition-all`}
                    onClick={toggleSubMenuPromosi}
                  >
                    <span>PROMOSI</span>
                    <span className='inline-flex ml-2'>
                      <FaArrowAltCircleUp
                        className={`transition-all ${
                          showPromosiSubMenu && 'rotate-180'
                        }`}
                      />
                    </span>
                  </div>
                  <div
                    className={`grid transition-all ${
                      showPromosiSubMenu
                        ? 'max-h-96'
                        : 'max-h-0 overflow-hidden'
                    }`}
                  >
                    {import.meta.env.VITE_ENV === 'UNSTABLE' ||
                    import.meta.env.VITE_ENV === 'DEV' ? (
                      <NavLink
                        className={({ isActive }) =>
                          isActive
                            ? 'outline outline-admin3 outline-1 bg-admin7 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack text-sm transition-all'
                            : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack text-sm transition-all'
                        }
                        to='maklumat-asas'
                        onClick={() => setShowLinks(!showLinks)}
                      >
                        MAKLUMAT ASAS
                      </NavLink>
                    ) : null}
                    <div
                      className={`${
                        showMedSosSubMenu ? 'bg-admin7' : 'bg-admin7'
                      } outline outline-admin3 outline-1 flex items-center justify-center rounded-md shadow-xl text-adminBlack p-3 m-1 hover:bg-admin5 cursor-pointer transition-all`}
                      onClick={toggleSubMenuMedSos}
                    >
                      <span>MEDIA SOSIAL</span>
                      <span className='inline-flex ml-2'>
                        <FaArrowAltCircleUp
                          className={`transition-all ${
                            showMedSosSubMenu && 'rotate-180'
                          }`}
                        />
                      </span>
                    </div>
                    <div
                      className={`grid transition-all ${
                        showMedSosSubMenu
                          ? 'max-h-96'
                          : 'max-h-0 overflow-hidden'
                      }`}
                    >
                      <NavLink
                        className={({ isActive }) =>
                          isActive
                            ? 'outline outline-admin3 outline-1 bg-admin7 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack text-sm transition-all'
                            : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack text-sm transition-all'
                        }
                        to='followers'
                        onClick={() => setShowLinks(!showLinks)}
                      >
                        <i>FOLLOWERS</i> MEDIA SOSIAL
                      </NavLink>
                      <NavLink
                        className={({ isActive }) =>
                          isActive
                            ? 'outline outline-admin3 outline-1 bg-admin7 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all text-sm'
                            : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all text-sm'
                        }
                        to='sosmed'
                        onClick={() => setShowLinks(!showLinks)}
                      >
                        AKTIVITI MEDIA SOSIAL
                      </NavLink>
                    </div>
                  </div>
                </div>
                <div
                  className={`${
                    showAgensiLuarSubMenu ? 'bg-admin3' : 'bg-admin2'
                  } outline outline-admin3 outline-1 flex items-center justify-center rounded-md shadow-xl p-3 m-1 hover:bg-admin3 cursor-pointer transition-all`}
                  onClick={toggleSubMenuAgensiLuar}
                >
                  <span>AGENSI LUAR</span>
                  <span className='inline-flex ml-2'>
                    <FaArrowAltCircleUp
                      className={`transition-all ${
                        showAgensiLuarSubMenu && 'rotate-180'
                      }`}
                    />
                  </span>
                </div>
                <div
                  className={`grid transition-all ${
                    showAgensiLuarSubMenu
                      ? 'max-h-[50rem]'
                      : 'max-h-0 overflow-hidden'
                  }`}
                >
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? 'outline outline-admin3 outline-1 bg-admin7 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                        : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                    }
                    to='program-gtod'
                    onClick={() => setShowLinks(!showLinks)}
                  >
                    PROGRAM G-TOD
                  </NavLink>
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? 'outline outline-admin3 outline-1 bg-admin7 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                        : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                    }
                    to='program-warga-emas'
                    onClick={() => setShowLinks(!showLinks)}
                  >
                    PROGRAM WARGA EMAS
                  </NavLink>
                </div>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                      : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                  }
                  to='generate'
                  onClick={() => {
                    setShowLinks(!showLinks);
                    setShowPenetapanSubMenu(false);
                    setShowMedSosSubMenu(false);
                    setShowMaklumatLainSubMenu(false);
                  }}
                >
                  PENJANAAN RETEN
                </NavLink>
                {/* <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                      : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                  }
                  to='aq'
                  onClick={() => setShowLinks(!showLinks)}
                >
                  AD-HOC QUERY
                </NavLink> */}
              </>
            )}
            {loginInfo.accountType === 'kpUser' &&
              loginInfo.role === 'admin' && (
                <>
                  <div>
                    <div
                      className={`${
                        showPenetapanSubMenu ? 'bg-admin3' : 'bg-admin2'
                      } outline outline-admin3 outline-1 flex items-center justify-center rounded-md shadow-xl p-3 m-1 hover:bg-admin3 cursor-pointer transition-all`}
                      onClick={togglePenetapanSubMenu}
                    >
                      <span>PENETAPAN</span>
                      <span className='inline-flex ml-2'>
                        <FaArrowAltCircleUp
                          className={`transition-all ${
                            showPenetapanSubMenu && 'rotate-180'
                          }`}
                        />
                      </span>
                    </div>
                    <div
                      className={`grid transition-all ${
                        showPenetapanSubMenu
                          ? 'max-h-[50rem]'
                          : 'max-h-0 overflow-hidden'
                      }`}
                    >
                      <NavLink
                        className={({ isActive }) =>
                          isActive
                            ? 'outline outline-admin3 outline-1 bg-admin7 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                            : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                        }
                        to='kp/pp'
                        onClick={() => setShowLinks(!showLinks)}
                      >
                        PEGAWAI PERGIGIAN
                      </NavLink>
                      <NavLink
                        className={({ isActive }) =>
                          isActive
                            ? 'outline outline-admin3 outline-1 bg-admin7 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                            : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                        }
                        to='kp/jp'
                        onClick={() => setShowLinks(!showLinks)}
                      >
                        JURUTERAPI PERGIGIAN
                      </NavLink>
                      <NavLink
                        className={({ isActive }) =>
                          isActive
                            ? 'outline outline-admin3 outline-1 bg-admin7 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                            : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                        }
                        to='kp/tastad'
                        onClick={() => setShowLinks(!showLinks)}
                      >
                        TASKA/TADIKA
                      </NavLink>
                      <NavLink
                        className={({ isActive }) =>
                          isActive
                            ? 'outline outline-admin3 outline-1 bg-admin7 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                            : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                        }
                        to='kp/program'
                        onClick={() => setShowLinks(!showLinks)}
                      >
                        PROGRAM KOMUNITI
                      </NavLink>
                      <NavLink
                        className={({ isActive }) =>
                          isActive
                            ? 'outline outline-admin3 outline-1 bg-admin7 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                            : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                        }
                        to='kp/kpb'
                        onClick={() => setShowLinks(!showLinks)}
                      >
                        KLINIK PERGIGIAN BERGERAK
                      </NavLink>
                      <NavLink
                        className={({ isActive }) =>
                          isActive
                            ? 'outline outline-admin3 outline-1 bg-admin7 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                            : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack transition-all'
                        }
                        to='kp/mpb'
                        onClick={() => setShowLinks(!showLinks)}
                      >
                        MAKMAL PERGIGIAN BERGERAK
                      </NavLink>
                    </div>
                  </div>
                  <div>
                    <div
                      className={`${
                        showMedSosSubMenu ? 'bg-admin3' : 'bg-admin2'
                      } outline outline-admin3 outline-1 flex items-center justify-center rounded-md shadow-xl p-3 m-1 hover:bg-admin3 cursor-pointer transition-all`}
                      onClick={toggleSubMenuMedSos}
                    >
                      <span>MEDIA SOSIAL</span>
                      <span className='inline-flex ml-2'>
                        <FaArrowAltCircleUp
                          className={`transition-all ${
                            showMedSosSubMenu && 'rotate-180'
                          }`}
                        />
                      </span>
                    </div>
                    <div
                      className={`grid transition-all ${
                        showMedSosSubMenu
                          ? 'max-h-96'
                          : 'max-h-0 overflow-hidden'
                      }`}
                    >
                      <NavLink
                        className={({ isActive }) =>
                          isActive
                            ? 'outline outline-admin3 outline-1 bg-admin7 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack text-sm transition-all'
                            : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack text-sm transition-all'
                        }
                        to='followers'
                        onClick={() => setShowLinks(!showLinks)}
                      >
                        <i>FOLLOWERS</i> MEDIA SOSIAL
                      </NavLink>
                      <NavLink
                        className={({ isActive }) =>
                          isActive
                            ? 'outline outline-admin3 outline-1 bg-admin7 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack text-sm transition-all'
                            : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack text-sm transition-all'
                        }
                        to='sosmed'
                        onClick={() => setShowLinks(!showLinks)}
                      >
                        AKTIVITI MEDIA SOSIAL
                      </NavLink>
                    </div>
                  </div>
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                        : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                    }
                    to='kp/generate'
                    onClick={() => {
                      setShowLinks(!showLinks);
                      setShowPenetapanSubMenu(false);
                      setShowMedSosSubMenu(false);
                      setShowMaklumatLainSubMenu(false);
                    }}
                  >
                    PENJANAAN RETEN
                  </NavLink>
                </>
              )}
            {/* {loginInfo.role === 'sosmedadmin' && (
              <div>
                <div
                  className={`${
                    showMedSosSubMenu ? 'bg-admin3' : 'bg-admin2'
                  } outline outline-admin3 outline-1 flex items-center justify-center rounded-md shadow-xl p-3 m-1 hover:bg-admin3 cursor-pointer transition-all`}
                  onClick={toggleSubMenuMedSos}
                >
                  <span>MEDIA SOSIAL</span>
                  <span className='inline-flex ml-2'>
                    <FaArrowAltCircleUp
                      className={`transition-all ${
                        showMedSosSubMenu && 'rotate-180'
                      }`}
                    />
                  </span>
                </div>
                <div
                  className={`grid transition-all ${
                    showMedSosSubMenu ? 'max-h-96' : 'max-h-0 overflow-hidden'
                  }`}
                >
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? 'outline outline-admin3 outline-1 bg-user8 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack text-sm transition-all'
                        : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack text-sm transition-all'
                    }
                    to='followers'
                    onClick={() => setShowLinks(!showLinks)}
                  >
                    <i>FOLLOWERS</i> MEDIA SOSIAL
                  </NavLink>
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? 'outline outline-admin3 outline-1 bg-user8 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack text-sm transition-all'
                        : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack text-sm transition-all'
                    }
                    to='sosmed'
                    onClick={() => setShowLinks(!showLinks)}
                  >
                    AKTIVITI MEDIA SOSIAL
                  </NavLink>
                </div>
              </div>
            )} */}
            {loginInfo.accountType === 'negeriSuperadmin' && (
              <>
                {/* <NavLink
                className={({ isActive }) =>
                  isActive
                    ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                    : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                }
                to='aq'
                onClick={() => setShowLinks(!showLinks)}
              >
                AD-HOC QUERY
              </NavLink> */}
                <div>
                  <div
                    className={`${
                      showMedSosSubMenu ? 'bg-admin3' : 'bg-admin2'
                    } outline outline-admin3 outline-1 flex items-center justify-center rounded-md shadow-xl p-3 m-1 hover:bg-admin3 cursor-pointer transition-all`}
                    onClick={toggleSubMenuMedSos}
                  >
                    <span>MEDIA SOSIAL</span>
                    <span className='inline-flex ml-2'>
                      <FaArrowAltCircleUp
                        className={`transition-all ${
                          showMedSosSubMenu && 'rotate-180'
                        }`}
                      />
                    </span>
                  </div>
                  <div
                    className={`grid transition-all ${
                      showMedSosSubMenu ? 'max-h-96' : 'max-h-0 overflow-hidden'
                    }`}
                  >
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? 'outline outline-admin3 outline-1 bg-user8 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack text-sm transition-all'
                          : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack text-sm transition-all'
                      }
                      to='followers'
                      onClick={() => setShowLinks(!showLinks)}
                    >
                      <i>FOLLOWERS</i> MEDIA SOSIAL
                    </NavLink>
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? 'outline outline-admin3 outline-1 bg-user8 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack text-sm transition-all'
                          : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack text-sm transition-all'
                      }
                      to='sosmed'
                      onClick={() => setShowLinks(!showLinks)}
                    >
                      AKTIVITI MEDIA SOSIAL
                    </NavLink>
                  </div>
                </div>
                <div>
                  <div
                    className={`${
                      showMaklumatLainSubMenu ? 'bg-admin3' : 'bg-admin2'
                    } outline outline-admin3 outline-1 flex items-center justify-center rounded-md shadow-xl p-3 m-1 hover:bg-admin3 cursor-pointer transition-all`}
                    onClick={toggleSubMenuMaklumatLain}
                  >
                    <span>MAKLUMAT LAIN</span>
                    <span className='inline-flex ml-2'>
                      <FaArrowAltCircleUp
                        className={`transition-all ${
                          showMaklumatLainSubMenu && 'rotate-180'
                        }`}
                      />
                    </span>
                  </div>
                  <div
                    className={`grid transition-all ${
                      showMaklumatLainSubMenu
                        ? 'max-h-96'
                        : 'max-h-0 overflow-hidden'
                    }`}
                  >
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? 'outline outline-admin3 outline-1 bg-user8 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack text-sm transition-all'
                          : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack text-sm transition-all'
                      }
                      to='negeri/pp'
                      onClick={() => setShowLinks(!showLinks)}
                    >
                      PEGAWAI PERGIGIAN
                    </NavLink>
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? 'outline outline-admin3 outline-1 bg-user8 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack text-sm transition-all'
                          : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack text-sm transition-all'
                      }
                      to='negeri/jp'
                      onClick={() => setShowLinks(!showLinks)}
                    >
                      JURUTERAPI PERGIGIAN
                    </NavLink>
                  </div>
                </div>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                      : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                  }
                  to='generate'
                  onClick={() => {
                    setShowLinks(!showLinks);
                    setShowPenetapanSubMenu(false);
                    setShowMedSosSubMenu(false);
                    setShowMaklumatLainSubMenu(false);
                  }}
                >
                  PENJANAAN RETEN
                </NavLink>
              </>
            )}
            {loginInfo.accountType === 'hqSuperadmin' && (
              <>
                {/* <NavLink
                className={({ isActive }) =>
                  isActive
                    ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                    : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                }
                to='aq'
                onClick={() => setShowLinks(!showLinks)}
              >
                AD-HOC QUERY
              </NavLink> */}
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                      : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                  }
                  to='generate'
                  onClick={() => {
                    setShowLinks(!showLinks);
                    setShowPenetapanSubMenu(false);
                    setShowMedSosSubMenu(false);
                    setShowMaklumatLainSubMenu(false);
                  }}
                >
                  PENJANAAN RETEN
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                      : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                  }
                  to='ondemand'
                  onClick={() => {
                    setShowLinks(!showLinks);
                    setShowPenetapanSubMenu(false);
                    setShowMedSosSubMenu(false);
                    setShowMaklumatLainSubMenu(false);
                  }}
                >
                  ON DEMAND SETTING
                </NavLink>
                {/* <div>
                  <div
                    className={`${
                      showMedSosSubMenu ? 'bg-admin3' : 'bg-admin2'
                    } outline outline-admin3 outline-1 flex items-center justify-center rounded-md shadow-xl p-3 m-1 hover:bg-admin3 cursor-pointer transition-all`}
                    onClick={toggleSubMenuMedSos}
                  >
                    <span>MEDIA SOSIAL</span>
                    <span className='inline-flex ml-2'>
                      <FaArrowAltCircleUp
                        className={`transition-all ${
                          showMedSosSubMenu && 'rotate-180'
                        }`}
                      />
                    </span>
                  </div>
                  <div
                    className={`grid transition-all ${
                      showMedSosSubMenu ? 'max-h-96' : 'max-h-0 overflow-hidden'
                    }`}
                  >
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? 'outline outline-admin3 outline-1 bg-user8 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack text-sm transition-all'
                          : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack text-sm transition-all'
                      }
                      to='followers'
                      onClick={() => setShowLinks(!showLinks)}
                    >
                      <i>FOLLOWERS</i> MEDIA SOSIAL
                    </NavLink>
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? 'outline outline-admin3 outline-1 bg-user8 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack text-sm transition-all'
                          : 'outline outline-admin3 outline-1 bg-admin4 rounded-md shadow-xl p-3 m-1 hover:bg-admin5 hover:text-adminBlack text-sm transition-all'
                      }
                      to='sosmed'
                      onClick={() => setShowLinks(!showLinks)}
                    >
                      AKTIVITI MEDIA SOSIAL
                    </NavLink>
                  </div>
                </div> */}
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
      </div>
    </>
  );
}
