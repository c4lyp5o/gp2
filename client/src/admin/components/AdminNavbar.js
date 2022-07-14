import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

function AdminNavbar({
  setShowData,
  setShowFacility,
  setShowPegawai,
  setShowKlinik,
  setShowWelcome,
  setFacilityType,
  getFacilities,
  getOperators,
  daerah,
}) {
  const [showLinks, setShowLinks] = useState(false);

  const toggleData = () => {
    setShowLinks(!showLinks);
    setShowWelcome(false);
    setShowData(true);
  };

  const showWelcomeScreen = () => {
    setShowLinks(!showLinks);
    setShowWelcome(true);
    setShowData(false);
    setShowFacility(false);
    setShowPegawai(false);
    setShowKlinik(false);
  };

  const showFacilNotKlinik = () => {
    setShowFacility(true);
    setShowKlinik(false);
    setShowPegawai(false);
  };

  const showKlinikNotFacil = () => {
    setShowKlinik(true);
    setShowFacility(false);
    setShowPegawai(false);
  };

  const showPegawaiOnly = () => {
    setShowPegawai(true);
    setShowKlinik(false);
    setShowFacility(false);
  };

  const reset = () => {
    setShowLinks(!showLinks);
    setShowWelcome(false);
    setShowData(false);
    setShowFacility(false);
    setShowPegawai(false);
    setShowKlinik(false);
  };

  return (
    <>
      <nav
        className={`absolute w-60 h-screen bg-admin2 text-adminWhite text-center top-0 left-0 transition-all ${
          showLinks ? 'translate-x-0' : '-translate-x-60'
        }`}
      >
        <div className='h-40'></div>
        <div className='grid'>
          <button
            className='outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
            onClick={() => {
              showWelcomeScreen();
            }}
          >
            PAPARAN UTAMA
          </button>
          <button
            className='outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
            onClick={() => {
              reset();
              setFacilityType('Klinik');
              showKlinikNotFacil();
              setTimeout(() => {
                getFacilities({
                  variables: {
                    jenisFasiliti: 'Klinik',
                    daerah: daerah,
                  },
                });
                toggleData();
              }, 100);
            }}
          >
            KLINIK PERGIGIAN
          </button>
          <button
            className='outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
            onClick={() => {
              reset();
              setFacilityType('Pegawai');
              showPegawaiOnly();
              setTimeout(() => {
                getOperators({
                  variables: {
                    daerah: daerah,
                  },
                });
                toggleData();
              }, 100);
            }}
          >
            PEGAWAI PERGIGIAN
          </button>
          {/* <NavLink
            className={({ isActive }) =>
              isActive
                ? 'outline outline-admin3 outline-1 bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
                : 'outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
            }
            to='jp'
            onClick={() => {
              setShowLinks(!showLinks);
            }}
          >
            JURUTERAPI PERGIGIAN
          </NavLink> */}
          <button
            className='outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
            onClick={() => {
              reset();
              setFacilityType('Taska');
              showFacilNotKlinik();
              setTimeout(() => {
                getFacilities({
                  variables: {
                    jenisFasiliti: 'Taska',
                    daerah: daerah,
                  },
                });
                toggleData();
              }, 100);
            }}
          >
            TASKA
          </button>
          <button
            className='outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
            onClick={() => {
              reset();
              setFacilityType('Tadika');
              showFacilNotKlinik();
              setTimeout(() => {
                getFacilities({
                  variables: {
                    jenisFasiliti: 'Tadika',
                    daerah: daerah,
                  },
                });
                toggleData();
              }, 100);
            }}
          >
            TADIKA
          </button>
          <button
            className='outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
            onClick={() => {
              reset();
              setFacilityType('Sekolah Rendah');
              showFacilNotKlinik();
              setTimeout(() => {
                getFacilities({
                  variables: {
                    jenisFasiliti: 'Sekolah Rendah',
                    daerah: daerah,
                  },
                });
                toggleData();
              }, 100);
            }}
          >
            SEKOLAH RENDAH
          </button>
          <button
            className='outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
            onClick={() => {
              reset();
              setFacilityType('Sekolah Menengah');
              showFacilNotKlinik();
              setTimeout(() => {
                getFacilities({
                  variables: {
                    jenisFasiliti: 'Sekolah Menengah',
                    daerah: daerah,
                  },
                });
                toggleData();
              }, 100);
            }}
          >
            SEKOLAH MENENGAH
          </button>
          <button
            className='outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
            onClick={() => {
              reset();
              setFacilityType('Institusi');
              showFacilNotKlinik();
              setTimeout(() => {
                getFacilities({
                  variables: {
                    jenisFasiliti: 'Institusi',
                    daerah: daerah,
                  },
                });
                toggleData();
              }, 100);
            }}
          >
            INSTITUSI
          </button>
          <button
            className='outline outline-admin3 outline-1 bg-admin2 rounded-md shadow-xl p-3 m-1 hover:bg-admin3 transition-all'
            onClick={() => {
              reset();
              setFacilityType('KP Bergerak');
              showFacilNotKlinik();
              setTimeout(() => {
                getFacilities({
                  variables: {
                    jenisFasiliti: 'KP Bergerak',
                    daerah: daerah,
                  },
                });
                toggleData();
              }, 100);
            }}
          >
            KP BERGERAK
          </button>
        </div>
      </nav>
      <div className='absolute w-60 top-0 left-0 flex text-center justify-center h-40'>
        <button
          className='text-2xl bg-adminWhite text-adminBlack mt-14 mb-14 px-3 rounded-md shadow-xl hover:rotate-90 transition-all'
          onClick={() => setShowLinks(!showLinks)}
        >
          <FaBars />
        </button>
      </div>
    </>
  );
}

export default AdminNavbar;
