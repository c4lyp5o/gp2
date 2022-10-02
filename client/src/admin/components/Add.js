import { useGlobalAdminAppContext } from '../context/adminAppContext';
import { useRef, useEffect, useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { Ring } from 'react-awesome-spinners';
import styles from '../Modal.module.css';

const Modal = ({ setShowAddModal, FType, daerah, reload, setReload }) => {
  const {
    Dictionary,
    toast,
    createData,
    readSekolahData,
    readKpData,
    pingApdmServer,
    readMdtbData,
    readFasilitiData,
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
  const [addingData, setAddingData] = useState(false);
  // MDTB
  const [mdtbMembers, setMdtbMembers] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAddingData(true);
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
        setAddingData(false);
        setReload(!reload);
      } else {
        toast.error(`Data tidak berjaya ditambah`);
        setShowAddModal(false);
        setAddingData(false);
      }
    });
  };

  useEffect(() => {
    if (FType === 'sr' || FType === 'sm') {
      pingApdmServer().then((res) => {
        if (res.status === 200) {
          statusApdm.current = true;
        } else {
          statusApdm.current = false;
        }
      });
      readSekolahData(FType).then((res) => {
        // console.log(res);
        setSekolah(res);
      });
    }
    if (FType === 'jp') {
      readMdtbData().then((res) => {
        console.log(res.data);
        setMdtbMembers(res.data);
      });
    }
    if (FType === 'kp') {
      readFasilitiData().then((res) => {
        console.log(res.data);
        setKlinik(res.data);
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

  function BusyButton() {
    return (
      <>
        <button
          type='button'
          class='inline-flex items-center text-center justify-center px-4 py-2 bg-admin3 text-adminWhite rounded-md shadow-xl p-2 hover:bg-admin1 transition-all ease-in-out duration-150 cursor-not-allowed'
          disabled=''
        >
          <svg
            class='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              class='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              stroke-width='4'
            ></circle>
            <path
              class='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            ></path>
          </svg>
          Menambah Data...
        </button>
      </>
    );
  }

  function SubmitButtton() {
    return (
      <button
        type='submit'
        className='capitalize bg-admin3 text-adminWhite rounded-md shadow-xl p-2 hover:bg-admin1 transition-all'
      >
        Tambah Data
      </button>
    );
  }

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
                      <label htmlFor='nama'>Pilih Klinik</label>
                      <select
                        onChange={(e) => {
                          const selectedKlinik = klinik.find(
                            (k) => k.kodFasiliti === e.target.value
                          );
                          console.log(selectedKlinik);
                          currentName.current = selectedKlinik.nama;
                          currentKodFasiliti.current =
                            selectedKlinik.kodFasiliti;
                          // currentKodFasiliti.current =
                          //   e.target.value.kodFasiliti;
                        }}
                        className='border-2 max-w-sm'
                      >
                        {klinik.map((m) => (
                          <option value={m.kodFasiliti}>{m.nama}</option>
                        ))}
                      </select>
                      {/* <label htmlFor='nama'>Nama Klinik</label>
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
                      /> */}
                      <label htmlFor='nama'>Emel</label>
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
                    <p>Peranan Klinik Pergigian</p>
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
                  {addingData ? <BusyButton /> : <SubmitButtton />}
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
                    {FType === 'pp' && (
                      <div className='grid gap-1'>
                        <input
                          required
                          className='border-2'
                          type='text'
                          name='Nama'
                          id='nama'
                          onChange={(e) =>
                            (currentName.current = e.target.value)
                          }
                        />
                      </div>
                    )}
                    {FType === 'jp' && (
                      <div className='grid gap-1'>
                        <select className='border-2 max-w-sm'>
                          {mdtbMembers.map((m) => (
                            <option value={m.id}>{m.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {FType === 'pp' && (
                      <>
                        <p>
                          Nombor MDC{' '}
                          <span className='font-semibold text-lg text-user6'>
                            *
                          </span>
                        </p>
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
                      </>
                    )}
                    {/* {FType === 'jp' && mdtbMembers && (
                      <>
                        <p>
                          Nombor MDTB{' '}
                          <span className='font-semibold text-lg text-user6'>
                            *
                          </span>
                        </p>
                        <select className='border-2'>
                          {mdtbMembers.map((m) => (
                            <option value={m.id}>{m.name}</option>
                          ))}
                        </select>
                      </>
                    )} */}
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
                          <option className='capitalize' value={k.kp}>
                            {k.kp}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className='grid gap-1'>
                      <p>
                        Peranan{' '}
                        <span className='font-semibold text-lg text-user6'>
                          *
                        </span>
                      </p>
                      <select
                        required
                        className='border-2'
                        onChange={(e) => (currentRole.current = e.target.value)}
                      >
                        <option value=''>Pilih Peranan</option>
                        <option value='admin'>Admin</option>
                        <option value='umum'>Umum</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.modalActions}>
                <div className={styles.actionsContainer}>
                  {addingData ? <BusyButton /> : <SubmitButtton />}
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
                            <span className='text-xs'>
                              Tarikh kemaskini:{' '}
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
                        <option className='capitalize' value={k.kp}>
                          {k.kp}
                        </option>
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
                  {addingData ? <BusyButton /> : <SubmitButtton />}
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
            <div className='flex justify-center text-center h-full w-full'>
              <div className='m-auto p-4 bg-admin4 rounded-md grid'>
                <div className='flex justify-center mb-2'>
                  <Ring color='#c44058' />
                </div>
                <span className='bg-admin3 text-kaunterWhite text-xs font-semibold px-2.5 py-0.5 rounded'>
                  Memuat..
                </span>
              </div>
            </div>
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
