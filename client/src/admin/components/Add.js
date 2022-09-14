import { useGlobalAdminAppContext } from '../context/adminAppContext';
import { useRef, useEffect, useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { Ring } from 'react-awesome-spinners';
import styles from '../Modal.module.css';

const Modal = ({ setShowAddModal, FType, daerah }) => {
  const {
    Dictionary,
    toast,
    createData,
    readSekolahData,
    readKpData,
    pingApdmServer,
  } = useGlobalAdminAppContext();

  const currentName = useRef();
  const currentEmail = useRef();
  const currentStatusPerkhidmatan = useRef();
  const currentKodSekolah = useRef();
  const currentKp = useRef();
  const currentKodFasiliti = useRef();
  const currentRegNumber = useRef();
  const currentGred = useRef();
  const currentRole = useRef('');
  const currentRisiko = useRef();
  // taska
  const currentKodTastad = useRef();
  const currentCatatanTastad = useRef();
  // APDM
  const statusApdm = useRef();
  // data
  const [klinik, setKlinik] = useState([]);
  const [sekolah, setSekolah] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let Data = {};
    Data = {
      ...Data,
      nama: currentName.current,
      handler: currentKp.current,
      statusPerkhidmatan: currentStatusPerkhidmatan.current,
    };
    if (FType === 'pp') {
      Data = {
        nama: currentName.current,
        statusPegawai: 'pp',
        mdcNumber: currentRegNumber.current,
        gred: currentGred.current,
        kpSkrg: currentKp.current,
        role: currentRole.current,
      };
    }
    if (FType === 'jp') {
      Data = {
        nama: currentName.current,
        statusPegawai: 'jp',
        mdtbNumber: currentRegNumber.current,
        gred: currentGred.current,
        kpSkrg: currentKp.current,
        role: currentRole.current,
      };
    }
    if (FType === 'kp') {
      if (currentRole.current === '') {
        currentRole.current = 'klinik';
      }
      Data = {
        kp: currentName.current,
        accountType: 'kpUser',
        email: currentEmail.current,
        statusRoleKlinik: currentRole.current,
        statusPerkhidmatan: currentStatusPerkhidmatan.current,
        kodFasiliti: currentKodFasiliti.current,
      };
    }
    if (FType === 'taska' || FType === 'tadika') {
      Data = {
        ...Data,
        kodSekolah: currentKodTastad.current,
        catatanTastad: currentCatatanTastad.current,
      };
    }
    if (FType === 'sr' || FType === 'sm') {
      Data = {
        ...Data,
        kodSekolah: currentKodSekolah.current,
        risikoSekolahPersis: currentRisiko.current,
      };
    }
    createData(FType, Data).then((res) => {
      console.log(res);
      if (res.statusText === 'OK') {
        toast.info(`Data berjaya ditambah`);
        setShowAddModal(false);
      } else {
        toast.error(`Data tidak berjaya ditambah`);
        setShowAddModal(false);
      }
    });
  };

  useEffect(() => {
    pingApdmServer().then((res) => {
      if (res.status === 200) {
        statusApdm.current = true;
      } else {
        statusApdm.current = false;
      }
    });
    if (FType === 'sr' || FType === 'sm') {
      readSekolahData(FType).then((res) => {
        setSekolah(res);
      });
    }
    if (FType !== 'kp') {
      readKpData().then((res) => {
        setKlinik(res.data);
      });
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [FType]);

  function Klinik() {
    return (
      <>
        <form onSubmit={handleSubmit}>
          <div
            className={styles.darkBG}
            onClick={() => setShowAddModal(false)}
          />
          <div className={styles.centered}>
            <div className={styles.modalAdd}>
              <div className={styles.modalHeader}>
                <h5 className={styles.heading}>TAMBAH KLINIK PERGIGIAN</h5>
              </div>
              <span
                className={styles.closeBtn}
                onClick={() => setShowAddModal(false)}
              >
                <RiCloseLine style={{ marginBottom: '-3px' }} />
              </span>
              <div className={styles.modalContent}>
                <div className='admin-pegawai-handler-container'>
                  <div className='admin-pegawai-handler-input'>
                    <div className='grid gap-1'>
                      <label htmlFor='nama'>Nama Klinik</label>
                      <input
                        required
                        className='border-2'
                        type='text'
                        name='nama'
                        id='nama'
                        onChange={(e) => (currentName.current = e.target.value)}
                      />
                      <label htmlFor='nama'>Kod Fasiliti</label>
                      <input
                        required
                        className='border-2'
                        type='text'
                        name='kod'
                        id='kod'
                        onChange={(e) =>
                          (currentKodFasiliti.current = e.target.value)
                        }
                      />
                      <label htmlFor='nama'>Email</label>
                      <input
                        required
                        className='border-2'
                        type='text'
                        name='email'
                        id='email'
                        onChange={(e) =>
                          (currentEmail.current = e.target.value)
                        }
                      />
                    </div>
                    <p>Role Klinik Pergigian</p>
                    <div className='grid grid-cols-4 gap-1'>
                      <label htmlFor='nama'>KEPP</label>
                      <input
                        type='radio'
                        id='role'
                        name='checkbox'
                        value='kepp'
                        onChange={(e) => (currentRole.current = e.target.value)}
                      />
                      <label htmlFor='nama'>UTC</label>
                      <input
                        type='radio'
                        id='role'
                        name='checkbox'
                        value='utc'
                        onChange={(e) => (currentRole.current = e.target.value)}
                      />
                      <label htmlFor='nama'>RTC</label>
                      <input
                        type='radio'
                        id='role'
                        name='checkbox'
                        value='rtc'
                        onChange={(e) => (currentRole.current = e.target.value)}
                      />
                      <label htmlFor='nama'>Visiting</label>
                      <input
                        type='radio'
                        id='role'
                        name='checkbox'
                        value='visiting'
                        onChange={(e) => (currentRole.current = e.target.value)}
                      />
                    </div>
                    <p>Status Klinik Pergigian</p>
                    <div className='grid grid-cols-2'>
                      <label htmlFor='nama'>Aktif</label>
                      <input
                        type='radio'
                        name='status'
                        value='active'
                        onChange={(e) =>
                          (currentStatusPerkhidmatan.current = e.target.value)
                        }
                      />
                      <label htmlFor='nama'>Tidak Aktif</label>
                      <input
                        type='radio'
                        name='status'
                        value='non-active'
                        onChange={(e) =>
                          (currentStatusPerkhidmatan.current = e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.modalActions}>
                <div className={styles.actionsContainer}>
                  <button className={styles.deleteBtn} type='submit'>
                    TAMBAH
                  </button>
                  <span
                    className={styles.cancelBtn}
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </>
    );
  }

  function Pegawai() {
    return (
      <>
        <form onSubmit={handleSubmit}>
          <div
            className={styles.darkBG}
            onClick={() => setShowAddModal(false)}
          />
          <div className={styles.centered}>
            <div className={styles.modalAdd}>
              <div className={styles.modalHeader}>
                <h5 className={styles.heading}>TAMBAH {Dictionary[FType]}</h5>
              </div>
              <span
                className={styles.closeBtn}
                onClick={() => setShowAddModal(false)}
              >
                <RiCloseLine style={{ marginBottom: '-3px' }} />
              </span>
              <div className={styles.modalContent}>
                <div className='admin-pegawai-handler-container'>
                  <div className='admin-pegawai-handler-input'>
                    <p>
                      Nama {Dictionary[FType]}{' '}
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <div className='grid gap-1'>
                      <input
                        required
                        className='border-2'
                        type='text'
                        name='Nama'
                        id='nama'
                        onChange={(e) => (currentName.current = e.target.value)}
                      />
                    </div>
                    {FType === 'pp' && (
                      <p>
                        Nombor MDC{' '}
                        <span className='font-semibold text-lg text-user6'>
                          *
                        </span>
                      </p>
                    )}
                    {FType === 'jp' && (
                      <p>
                        Nombor MDTB{' '}
                        <span className='font-semibold text-lg text-user6'>
                          *
                        </span>
                      </p>
                    )}
                    <div className='grid gap-1'>
                      <input
                        required
                        className='border-2'
                        type='text'
                        name='mdc'
                        id='mdc'
                        onChange={(e) =>
                          (currentRegNumber.current = e.target.value)
                        }
                      />
                    </div>
                    <div className='grid gap-1'>
                      <p>
                        Gred{' '}
                        <span className='font-semibold text-lg text-user6'>
                          *
                        </span>
                      </p>
                      {FType === 'pp' && (
                        <select
                          required
                          className='border-2'
                          onChange={(e) =>
                            (currentGred.current = e.target.value)
                          }
                        >
                          <option value=''>Pilih Gred</option>
                          <option value='jusa'>JUSA</option>
                          <option value='ug56'>UG56</option>
                          <option value='ug54'>UG54</option>
                          <option value='ug52'>UG52</option>
                          <option value='ug48'>UG48</option>
                          <option value='ug44'>UG44</option>
                          <option value='ug41'>UG41</option>
                        </select>
                      )}
                      {FType === 'jp' && (
                        <select
                          required
                          className='border-2'
                          onChange={(e) =>
                            (currentGred.current = e.target.value)
                          }
                        >
                          <option value=''>Pilih Gred</option>
                          <option value='u40'>U40</option>
                          <option value='u38'>U38</option>
                          <option value='u36'>U36</option>
                          <option value='u32'>U32</option>
                          <option value='u29'>U29</option>
                        </select>
                      )}
                    </div>
                    <div className='grid gap-1'>
                      <p>
                        Klinik Bertugas{' '}
                        <span className='font-semibold text-lg text-user6'>
                          *
                        </span>
                      </p>
                      <select
                        required
                        className='border-2'
                        onChange={(e) => (currentKp.current = e.target.value)}
                      >
                        <option value=''>Pilih Klinik</option>
                        {klinik.map((k) => (
                          <option value={k.kp}>{k.kp}</option>
                        ))}
                      </select>
                    </div>
                    <div className='grid gap-1'>
                      <p>
                        Role{' '}
                        <span className='font-semibold text-lg text-user6'>
                          *
                        </span>
                      </p>
                      <select
                        required
                        className='border-2'
                        onChange={(e) => (currentRole.current = e.target.value)}
                      >
                        <option value=''>Pilih Role</option>
                        <option value='admin'>Admin</option>
                        <option value='umum'>Umum</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.modalActions}>
                <div className={styles.actionsContainer}>
                  <button className={styles.deleteBtn} type='submit'>
                    TAMBAH
                  </button>
                  <span
                    className={styles.cancelBtn}
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </>
    );
  }

  function Facility() {
    return (
      <>
        <form onSubmit={handleSubmit}>
          <div
            className={styles.darkBG}
            onClick={() => setShowAddModal(false)}
          />
          <div className={styles.centered}>
            <div className={styles.modalAdd}>
              <div className={styles.modalHeader}>
                <h5 className={styles.heading}>Tambah {Dictionary[FType]}</h5>
              </div>
              <span
                className={styles.closeBtn}
                onClick={() => setShowAddModal(false)}
              >
                <RiCloseLine style={{ marginBottom: '-3px' }} />
              </span>
              <div className={styles.modalContent}>
                <div className='admin-pegawai-handler-container'>
                  <div className='mb-3'>
                    {(FType === 'sm' || FType === 'sr') &&
                      (statusApdm.current === true ? (
                        <>
                          <div>
                            <span className='bg-user7 text-kaunterWhite text-xs font-semibold px-2.5 py-0.5 rounded'>
                              APDM Aktif
                            </span>
                          </div>
                          <div>
                            <span>
                              Tarikh data:{' '}
                              {new Date().toLocaleDateString('en-GB')}
                            </span>
                          </div>
                        </>
                      ) : (
                        <span className='bg-admin2 text-kaunterWhite text-xs font-semibold px-2.5 py-0.5 rounded'>
                          APDM Tidak Aktif
                        </span>
                      ))}
                    {FType === 'kpb' || FType === 'mp' ? (
                      <div>Nombor plat {Dictionary[FType]}</div>
                    ) : (
                      <div>
                        <p>
                          Nama {Dictionary[FType]}
                          <span className='font-semibold text-lg text-user6'>
                            *
                          </span>
                        </p>
                      </div>
                    )}
                    {FType !== 'sr' && FType !== 'sm' ? (
                      <div className='grid gap-1'>
                        <input
                          required
                          className='border-2'
                          type='text'
                          name='nama'
                          id='nama'
                          onChange={(e) =>
                            (currentName.current = e.target.value)
                          }
                        />
                      </div>
                    ) : (
                      <div className='grid gap-1'>
                        <select
                          className='border-2 max-w-sm'
                          name='kp'
                          onChange={(e) => {
                            currentName.current = e.target.value;
                            const index = e.target.selectedIndex;
                            const el = e.target.childNodes[index];
                            currentKodSekolah.current = el.getAttribute('id');
                          }}
                        >
                          <option value=''>Pilih Sekolah</option>
                          {sekolah.map((s) => (
                            <option value={s.namaSekolah} id={s.kodSekolah}>
                              {s.namaSekolah}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  {(FType === 'taska' || FType === 'tadika') && (
                    <>
                      <div>
                        <p>
                          Kod {Dictionary[FType]}
                          <span className='font-semibold text-lg text-user6'>
                            *
                          </span>
                        </p>
                      </div>
                      <div className='grid gap-1'>
                        <input
                          required
                          className='border-2'
                          type='text'
                          name='kodTastad'
                          id='kodTastad'
                          onChange={(e) =>
                            (currentKodTastad.current = e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <p>
                          Catatan {Dictionary[FType]}
                          <span className='font-semibold text-lg text-user6'>
                            *
                          </span>
                        </p>
                      </div>
                      <div className='grid gap-1'>
                        <input
                          required
                          className='border-2'
                          type='text'
                          name='catatan'
                          id='catatan'
                          onChange={(e) =>
                            (currentCatatanTastad.current = e.target.value)
                          }
                        />
                      </div>
                    </>
                  )}
                  <p>Status {Dictionary[FType]}</p>
                  <div className='grid grid-cols-2'>
                    <label htmlFor='nama'>Aktif</label>
                    <input
                      type='checkbox'
                      name='checkbox'
                      value='active'
                      onChange={(e) =>
                        (currentStatusPerkhidmatan.current = e.target.value)
                      }
                    />
                    <label htmlFor='nama'>Tidak Aktif</label>
                    <input
                      type='checkbox'
                      name='checkbox'
                      value='non-active'
                      onChange={(e) =>
                        (currentStatusPerkhidmatan.current = e.target.value)
                      }
                    />
                  </div>
                  <p>
                    Klinik Bertugas{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
                  <div className='grid gap-1'>
                    <select
                      required
                      className='border-2'
                      onChange={(e) => (currentKp.current = e.target.value)}
                    >
                      <option value=''>Pilih Klinik</option>
                      {klinik.map((k) => (
                        <option value={k.kp}>{k.kp}</option>
                      ))}
                    </select>
                  </div>
                  {FType !== 'sr' && FType !== 'sm' ? null : (
                    <p>
                      Risiko Sekolah (PERSiS){' '}
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                  )}
                  {FType !== 'sr' && FType !== 'sm' ? null : (
                    <div className='grid gap-1'>
                      <select
                        required
                        className='border-2'
                        onChange={(e) =>
                          (currentRisiko.current = e.target.value)
                        }
                      >
                        <option value=''>Pilih Risiko</option>
                        <option value='rendah'>Rendah</option>
                        <option value='tinggi'>Tinggi</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.modalActions}>
                <div className={styles.actionsContainer}>
                  <button className={styles.deleteBtn} type='submit'>
                    TAMBAH
                  </button>
                  <span
                    className={styles.cancelBtn}
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <div className={styles.darkBG} />
        <div className={styles.modalContent}>
          <div className={styles.centered}>
            <Ring size={100} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {FType === 'kp' && <Klinik />}
      {(FType === 'pp' || FType === 'jp') && <Pegawai />}
      {FType !== 'kp' && FType !== 'pp' && FType !== 'jp' && <Facility />}
    </>
  );
};

export default Modal;
