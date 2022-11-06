import { NavLink } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { FaBars, FaArrowAltCircleUp } from 'react-icons/fa';

function KaunterNavbar() {
  const [showLinks, setShowLinks] = useState(false);
  const [showOutreachSubMenu, setShowOutreachSubMenu] = useState(false);
  const [outreachIsOn, setOutreachIsOn] = useState(false);

  const toggleLinks = () => {
    setShowLinks(!showLinks);
    setShowOutreachSubMenu(false);
    if (outreachIsOn === true && showLinks === false) {
      setShowOutreachSubMenu(true);
    }
  };

  const toggleOutreachSubMenu = () => {
    setShowOutreachSubMenu(!showOutreachSubMenu);
  };

  const outreachOn = () => {
    setShowLinks(!showLinks);
    setOutreachIsOn(true);
    setShowOutreachSubMenu(false);
  };

  const outreachOff = () => {
    setShowLinks(!showLinks);
    setOutreachIsOn(false);
    setShowOutreachSubMenu(false);
  };

  let barSisiRef = useRef();

  useEffect(() => {
    let tutupBarSisi = (e) => {
      if (!barSisiRef.current.contains(e.target)) {
        setShowLinks(false);
        setShowOutreachSubMenu(false);
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
        {/* nav stack for outreach submenu */}
        <nav
          className={`absolute w-60 h-full bg-kaunter1 text-kaunterWhite text-center top-0 left-60 transition-all overflow-y-auto ${
            showOutreachSubMenu ? 'translate-x-0' : '-translate-x-[480px]'
          }`}
        >
          <div className='h-80 lg:h-60'></div>
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
              to='institusi-warga-emas'
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
              to='institusi-oku'
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
              to='kampung-angkat'
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
              to='projek-komuniti-lain'
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
            {/* <NavLink
            to='rtc-kelantan'
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
          </NavLink> */}
          </div>
        </nav>
        {/* main nav stack */}
        <nav
          className={`absolute w-60 max-h-screen h-screen bg-kaunter1 text-kaunterWhite text-center top-0 left-0 transition-all overflow-y-auto ${
            showLinks ? 'translate-x-0' : '-translate-x-60'
          }`}
        >
          <div className='lg:h-28'></div>
          <div className='lg:hidden grid grid-rows-[50px_10px_10px] h-48 gap-1 text-center pt-24'>
            <img
              className='w-full h-full'
              src='https://upload.wikimedia.org/wikipedia/commons/9/94/Jata_MalaysiaV2.svg'
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
              to='/pendaftaran/daftar'
              onClick={() => {
                outreachOff();
              }}
              className='bg-kaunter2 rounded-md shadow-xl p-3 m-1 hover:bg-kaunter3 transition-all'
            >
              PAPARAN UTAMA
            </NavLink>
            <NavLink
              to='kp'
              onClick={() => {
                outreachOff();
              }}
              className={({ isActive }) =>
                isActive
                  ? 'bg-kaunter3 rounded-md shadow-xl p-3 m-1 hover:bg-kaunter3 transition-all'
                  : 'bg-kaunter2 rounded-md shadow-xl p-3 m-1 hover:bg-kaunter3 transition-all'
              }
            >
              KLINIK PERGIGIAN
            </NavLink>
            <NavLink
              to='kk-kd'
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
              to='taska-tadika'
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
              to='ipt-kolej'
              onClick={() => {
                outreachOff();
              }}
              className={({ isActive }) =>
                isActive
                  ? 'bg-kaunter3 rounded-md shadow-xl p-3 m-1 hover:bg-kaunter2 transition-all'
                  : 'bg-kaunter2 rounded-md shadow-xl p-3 m-1 hover:bg-kaunter3 transition-all'
              }
            >
              IPT / KOLEJ
            </NavLink>
            <div>
              <div
                className={`${
                  showOutreachSubMenu ? 'bg-kaunter3' : 'bg-kaunter2'
                } flex items-center justify-center rounded-md shadow-xl p-3 m-1 hover:bg-kaunter3 transition-all hover:cursor-pointer`}
                onClick={toggleOutreachSubMenu}
              >
                <span>PROGRAM KOMUNITI</span>
                <span className='ml-5'>
                  <FaArrowAltCircleUp
                    className={`transition-all ${
                      showOutreachSubMenu && 'rotate-90'
                    }`}
                  />
                </span>
              </div>
            </div>
            <NavLink
              to='registry'
              onClick={() => {
                outreachOff();
              }}
              className={({ isActive }) =>
                isActive
                  ? 'bg-kaunter3 rounded-md shadow-xl p-3 m-1 hover:bg-kaunter2 transition-all'
                  : 'bg-kaunter2 rounded-md shadow-xl p-3 m-1 hover:bg-kaunter3 transition-all'
              }
            >
              SENARAI DAFTAR PESAKIT
            </NavLink>
            {/* <div className='mx-3 lg:hidden capitalize'>
              <div className='m-3 space-y-1 text-center text-sm'>
                <p className='font-semibold text-base'>pendaftaran:</p>
                <p>{namaKlinik}</p>
              </div>
              <button
                type='button'
                className='p-1 text-user2 bg-kaunter3 hover:bg-opacity-80 rounded-sm shadow-xl outline outline-1 outline-kaunter4 transition-all'
                onClick={logout}
              >
                LOG KELUAR
              </button>
            </div> */}
          </div>
        </nav>
        {/* the toggle button */}
        <div className='absolute w-60 top-0 left-0 flex text-center h-28 lg:justify-center pl-5 lg:pl-0'>
          <button
            className='text-2xl bg-kaunterWhite text-kaunterBlack mt-8 mb-8 px-3 rounded-md shadow-xl hover:rotate-90 transition-all'
            onClick={toggleLinks}
          >
            <FaBars />
          </button>
        </div>
      </div>
    </>
  );
}

export default KaunterNavbar;
