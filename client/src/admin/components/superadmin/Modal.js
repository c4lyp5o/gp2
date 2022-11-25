import { useGlobalAdminAppContext } from '../../context/adminAppContext';
import { useRef, useEffect, useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import styles from '../../Modal.module.css';

import { Loading } from '../Screens';
import { ConfirmModalForData } from './Confirmation';
import { SubmitButton, BusyButton } from '../Buttons';

const AddModal = ({
  setShowAddModal,
  FType,
  kp,
  daerah,
  reload,
  setReload,
}) => {
  const {
    Dictionary,
    toast,
    createData,
    readSekolahData,
    readKpData,
    readDpimsData,
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
  const currentAlamatTastad = useRef();
  const currentEnrolmenTastad = useRef();
  const currentGovKe = useRef();
  // event
  const currentJenisEvent = useRef();
  const currentModPenyampaian = useRef([]);
  const currentTarikh = useRef(moment(new Date()).format('YYYY-MM-DD'));
  const currentTempat = useRef();
  //datepicker
  const [date, setDate] = useState(new Date());

  // APDM
  const statusApdm = useRef();
  // data
  const [klinik, setKlinik] = useState([]);
  const [sekolah, setSekolah] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingData, setAddingData] = useState(false);
  // MDTB
  const [mdtbMembers, setMdtbMembers] = useState([]);
  // pp sedia ada
  const [allPegawai, setAllPegawai] = useState([]);
  // dpims nama
  const [carianNama, setCarianNama] = useState('');
  const [searching, setSearching] = useState(false);
  const [noPp, setNoPp] = useState('');

  const handleSubmit = async () => {
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
        email: currentEmail.current,
        statusPegawai: 'pp',
        mdcNumber: currentRegNumber.current,
        gred: currentGred.current,
        kpSkrg: currentKp.current,
        role: currentRole.current,
        activationStatus: true,
      };
    }
    if (FType === 'jp') {
      Data = {
        nama: currentName.current,
        email: currentEmail.current,
        statusPegawai: 'jp',
        mdtbNumber: currentRegNumber.current,
        gred: currentGred.current,
        kpSkrg: currentKp.current,
        role: currentRole.current,
        activationStatus: true,
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
    if (FType === 'program') {
      if (currentModPenyampaian.current.length < 1) {
        toast.error(
          'Sila pilih sekurang-kurangnya 1 kaedah penyampaian perkhidmatan'
        );
        setAddingData(false);
        return;
      }
      Data = {
        nama: currentName.current,
        createdByKp: kp,
        jenisEvent: currentJenisEvent.current,
        modPenyampaianPerkhidmatan: currentModPenyampaian.current,
        tarikh: currentTarikh.current,
        tempat: currentTempat.current,
      };
    }
    if (FType === 'taska' || FType === 'tadika') {
      Data = {
        ...Data,
        kodTastad: currentKodTastad.current,
        alamatTastad: currentAlamatTastad.current,
        enrolmenTastad: currentEnrolmenTastad.current,
        govKe: currentGovKe.current,
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
      console.log(res.data);
      if (res.status === 200) {
        toast.info(`Data berjaya ditambah`);
        setReload(!reload);
      } else {
        toast.error(`Data tidak berjaya ditambah`);
      }
      setShowAddModal(false);
      setAddingData(false);
    });
  };

  const eventModeChecker = (e) => {
    if (currentModPenyampaian.current.includes(e)) {
      currentModPenyampaian.current.splice(
        currentModPenyampaian.current.indexOf(e),
        1
      );
      return;
    }
    if (!currentModPenyampaian.current.includes(e)) {
      currentModPenyampaian.current = [...currentModPenyampaian.current, e];
    }
  };

  const CustomDatePicker = () => {
    return (
      <DatePicker
        dateFormat='dd/MM/yyyy'
        selected={date}
        onChange={(date) => {
          const tempDate = moment(date).format('YYYY-MM-DD');
          setDate(date);
          currentTarikh.current = tempDate;
        }}
        peekNextMonth
        showMonthDropdown
        showYearDropdown
        dropdownMode='select'
        className='border-2'
      />
    );
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
        setSekolah(res);
      });
    }
    // if (FType === 'pp') {
    //   readPegawaiData().then((res) => {
    //     setAllPegawai(res);
    //   });
    // }
    if (FType === 'jp') {
      readMdtbData().then((res) => {
        setMdtbMembers(res);
      });
    }
    if (FType === 'kp') {
      readFasilitiData().then((res) => {
        setKlinik(res.data);
      });
    }
    if (FType !== 'kp' && FType !== 'program') {
      readKpData().then((res) => {
        setKlinik(res.data);
      });
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [FType]);

  function Klinik({ confirm }) {
    return (
      <>
        <form onSubmit={confirm(handleSubmit)}>
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
                          currentName.current = selectedKlinik.nama;
                          currentKodFasiliti.current =
                            selectedKlinik.kodFasiliti;
                        }}
                        className='border-2 max-w-sm'
                      >
                        <option value=''>Pilih Klinik</option>
                        {klinik
                          .filter((ak) => {
                            let upperCased =
                              daerah[0].toUpperCase() + daerah.substring(1);
                            return ak.daerah.includes(upperCased);
                          })
                          .map((k) => (
                            <option key={k.bil} value={k.kodFasiliti}>
                              {k.nama}
                            </option>
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
                    <p className='mt-3 font-semibold'>
                      Peranan Klinik Pergigian
                    </p>
                    <div className='grid grid-cols-4 gap-1'>
                      <label htmlFor='nama'>KEPP</label>
                      <input
                        required
                        type='radio'
                        id='role'
                        name='checkbox'
                        value='kepp'
                        onChange={(e) => (currentRole.current = e.target.value)}
                      />
                      <label htmlFor='nama'>UTC</label>
                      <input
                        required
                        type='radio'
                        id='role'
                        name='checkbox'
                        value='utc'
                        onChange={(e) => (currentRole.current = e.target.value)}
                      />
                      <label htmlFor='nama'>RTC</label>
                      <input
                        required
                        type='radio'
                        id='role'
                        name='checkbox'
                        value='rtc'
                        onChange={(e) => (currentRole.current = e.target.value)}
                      />
                      <label htmlFor='nama'>Visiting</label>
                      <input
                        required
                        type='radio'
                        id='role'
                        name='checkbox'
                        value='visiting'
                        onChange={(e) => (currentRole.current = e.target.value)}
                      />
                      <div className='col-span-4'>
                        <label htmlFor='nama' className='m-3'>
                          Bukan pilihan di atas
                        </label>
                        <input
                          required
                          type='radio'
                          id='role'
                          name='checkbox'
                          value=''
                          onChange={(e) =>
                            (currentRole.current = e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <p className='mt-3 font-semibold'>
                      Status Klinik Pergigian
                    </p>
                    <div className='grid grid-cols-2 gap-1'>
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
                  {addingData ? (
                    <BusyButton func='add' />
                  ) : (
                    <SubmitButton func='add' />
                  )}
                  <span
                    className={styles.cancelBtn}
                    onClick={() => setShowAddModal(false)}
                  >
                    Kembali
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </>
    );
  }

  function Pegawai({ confirm }) {
    return (
      <>
        <form onSubmit={confirm(handleSubmit)}>
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
                    {FType === 'pp' ? (
                      <div className='grid gap-1'>
                        <label
                          for='default-search'
                          className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300'
                        >
                          Search
                        </label>
                        <div className='relative'>
                          <div class='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
                            <svg
                              aria-hidden='true'
                              className='w-5 h-3 text-gray-500 dark:text-gray-400'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                stroke-linecap='round'
                                stroke-linejoin='round'
                                strokeWidth='2'
                                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                              ></path>
                            </svg>
                          </div>
                          <input
                            autoFocus
                            value={carianNama}
                            type='search'
                            className='block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                            placeholder='Cari pegawai...'
                            onChange={(e) => {
                              currentName.current = e.target.value;
                              setCarianNama(e.target.value);
                            }}
                          />
                          {searching === false ? (
                            <button
                              type='button'
                              class='text-white absolute right-2.5 bottom-2.5 bg-admin3 hover:bg-admin4 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2'
                              onClick={async (e) => {
                                e.preventDefault();
                                setSearching(true);
                                setNoPp('');
                                setAllPegawai([]);
                                const res = await readDpimsData(
                                  currentName.current
                                );
                                if (res) {
                                  setAllPegawai(res);
                                }
                                if (!res) {
                                  setNoPp('Tiada pegawai dijumpai');
                                }
                                setSearching(false);
                              }}
                            >
                              Search
                            </button>
                          ) : (
                            <>
                              <button
                                type='button'
                                className='text-white absolute right-2.5 bottom-2.5 bg-admin3 hover:bg-admin4 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2'
                                disabled={true}
                              >
                                <svg
                                  className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                                  xmlns='http://www.w3.org/2000/svg'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                >
                                  <circle
                                    className='opacity-25'
                                    cx='12'
                                    cy='12'
                                    r='10'
                                    stroke='currentColor'
                                    strokeWidth='4'
                                  ></circle>
                                  <path
                                    className='opacity-75'
                                    fill='currentColor'
                                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                  ></path>
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                        {allPegawai.length > 0 ? (
                          <select
                            className='border-2 max-w-sm'
                            onChange={(e) => {
                              const selectedPp = allPegawai.find(
                                (p) => p.nomborMdc === e.target.value
                              );
                              currentName.current = selectedPp.nama;
                              currentRegNumber.current = selectedPp.nomborMdc;
                            }}
                          >
                            <option key='no-value' value=''>
                              Pilih Pegawai...
                            </option>
                            {allPegawai.map((p) => (
                              <option
                                className='capitalize'
                                key={p.bil}
                                value={p.nomborMdc}
                              >
                                {p.nama}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span>{noPp}</span>
                        )}
                      </div>
                    ) : (
                      <div className='grid gap-1'>
                        <select
                          className='border-2 max-w-sm'
                          onChange={(e) => {
                            const selectedJp = mdtbMembers.find(
                              (m) => m.registrationnumber === e.target.value
                            );
                            currentName.current = selectedJp.name;
                            currentRegNumber.current =
                              selectedJp.registrationnumber;
                          }}
                        >
                          <option key='no-value' value=''>
                            Pilih JP...
                          </option>
                          {mdtbMembers.map((m) => (
                            <option key={m.number} value={m.registrationnumber}>
                              {m.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <p>
                      Emel{' '}
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <div className='grid gap-1'>
                      <input
                        required
                        className='border-2'
                        type='text'
                        name='nama'
                        id='nama'
                        onChange={(e) =>
                          (currentEmail.current = e.target.value)
                        }
                      />
                    </div>
                    {/* {FType === 'pp' && (
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
                    )} */}
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
                    <p>
                      Gred{' '}
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <div className='grid gap-1'>
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
                  {addingData ? (
                    <BusyButton func='add' />
                  ) : (
                    <SubmitButton func='add' />
                  )}
                  <span
                    className={styles.cancelBtn}
                    onClick={() => setShowAddModal(false)}
                  >
                    Kembali
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </>
    );
  }

  function Facility({ confirm }) {
    return (
      <>
        <form onSubmit={confirm(handleSubmit)}>
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
                          Alamat {Dictionary[FType]}
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
                            (currentAlamatTastad.current = e.target.value)
                          }
                        />
                        <div>
                          <p>
                            Enrolmen {Dictionary[FType]}
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
                            name='enrolmen'
                            id='enrolmen'
                            onChange={(e) =>
                              (currentEnrolmenTastad.current = e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </>
                  )}
                  <p>Status {Dictionary[FType]}</p>
                  <div className='grid grid-cols-2'>
                    <label htmlFor='nama'>Aktif</label>
                    <input
                      required
                      type='radio'
                      id='act-stat'
                      name='checkbox'
                      value='active'
                      onChange={(e) =>
                        (currentStatusPerkhidmatan.current = e.target.value)
                      }
                    />
                    <label htmlFor='nama'>Tidak Aktif</label>
                    <input
                      required
                      type='radio'
                      id='act-stat'
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
                  {addingData ? (
                    <BusyButton func='add' />
                  ) : (
                    <SubmitButton func='add' />
                  )}
                  <span
                    className={styles.cancelBtn}
                    onClick={() => setShowAddModal(false)}
                  >
                    Kembali
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </>
    );
  }

  function Event({ confirm }) {
    return (
      <>
        <form onSubmit={confirm(handleSubmit)}>
          <div
            className={styles.darkBG}
            onClick={() => setShowAddModal(false)}
          />
          <div className={styles.centered}>
            <div className={styles.modalEvent}>
              <div className={styles.modalHeader}>
                <h5 className={styles.heading}>Tambah Program / Aktiviti</h5>
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
                    <p>
                      Tarikh Program / Aktiviti{' '}
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    {/* <input
                        required
                        className='border-2'
                        type='date'
                        name='tarikh'
                        id='tarikh'
                        onChange={(e) =>
                          (currentTarikh.current = e.target.value)
                        }
                      /> */}
                    <CustomDatePicker />
                    <p>
                      Nama Program
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <div className='grid gap-1'>
                      <select
                        required
                        className='border-2 w-fit'
                        onChange={(e) =>
                          (currentJenisEvent.current = e.target.value)
                        }
                        name='jenisEvent'
                        id='jenisEvent'
                      >
                        <option value=''>Jenis Program / Aktiviti</option>
                        <option value='projek-komuniti'>Projek Komuniti</option>
                        <option value='ppkps'>
                          Program Pemasyarakatan Perkhidmatan Klinik Pergigian
                          Sekolah
                        </option>
                        <option value='kgangkat'>
                          Kampung Angkat Pergigian
                        </option>
                        <option value='ppr'>Projek Perumahan Rakyat</option>
                        <option value='we'>Institusi Warga Emas</option>
                        <option value='oku'>Institusi OKU / PDK</option>
                        <option value='oap'>
                          Program Orang Asli dan Penan
                        </option>
                      </select>
                    </div>
                    <p className='mt-3 font-semibold'>
                      Mod Penyampaian Perkhidmatan
                    </p>
                    <div className='grid grid-cols-2 gap-1'>
                      <label htmlFor='modPpb'>Pasukan Pergigian Bergerak</label>
                      <input
                        type='checkbox'
                        name='mod'
                        value='ppb'
                        onChange={(e) => {
                          eventModeChecker(e.target.value);
                        }}
                      />
                      <label htmlFor='modKpb'>Klinik Pergigian Bergerak</label>
                      <input
                        type='checkbox'
                        name='mod'
                        value='kpb'
                        onChange={(e) => {
                          eventModeChecker(e.target.value);
                        }}
                      />
                      <label htmlFor='modKpb'>Makmal Pergigian Bergerak</label>
                      <input
                        type='checkbox'
                        name='mod'
                        value='mpb'
                        onChange={(e) => {
                          eventModeChecker(e.target.value);
                        }}
                      />
                    </div>
                    <p>
                      Nama Program / Aktiviti
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <div className='grid gap-1'>
                      <input
                        required
                        className='border-2'
                        type='text'
                        name='nama'
                        id='nama'
                        onChange={(e) => (currentName.current = e.target.value)}
                      />
                    </div>
                    <div className='grid gap-1'>
                      <p>
                        Tempat
                        <span className='font-semibold text-lg text-user6'>
                          *
                        </span>
                      </p>
                      <div className='grid gap-1'>
                        <input
                          required
                          className='border-2'
                          type='text'
                          name='nama'
                          id='nama'
                          onChange={(e) =>
                            (currentTempat.current = e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.modalActions}>
                  <div className={styles.actionsContainer}>
                    {addingData ? (
                      <BusyButton func='add' />
                    ) : (
                      <SubmitButton func='add' />
                    )}
                    <span
                      className={styles.cancelBtn}
                      onClick={() => setShowAddModal(false)}
                    >
                      Kembali
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </>
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {FType === 'kp' && (
        <ConfirmModalForData callbackFunction={handleSubmit} func='add'>
          {(confirm) => <Klinik confirm={confirm} />}
        </ConfirmModalForData>
      )}
      {(FType === 'pp' || FType === 'jp') && (
        <ConfirmModalForData callbackFunction={handleSubmit} func='add'>
          {(confirm) => <Pegawai confirm={confirm} />}
        </ConfirmModalForData>
      )}
      {FType !== 'kp' &&
        FType !== 'pp' &&
        FType !== 'jp' &&
        FType !== 'program' && (
          <ConfirmModalForData callbackFunction={handleSubmit} func='add'>
            {(confirm) => <Facility confirm={confirm} />}
          </ConfirmModalForData>
        )}
      {FType === 'program' && (
        <ConfirmModalForData callbackFunction={handleSubmit} func='add'>
          {(confirm) => <Event confirm={confirm} />}
        </ConfirmModalForData>
      )}
    </>
  );
};

const EditModal = ({ setShowEditModal, FType, kp, id, reload, setReload }) => {
  const {
    Dictionary,
    toast,
    readKpData,
    readOneData,
    updateData,
    readOneDataForKp,
    updateDataForKp,
  } = useGlobalAdminAppContext();

  const currentKp = useRef();
  const currentName = useRef();
  const currentEmail = useRef();
  const currentStatusPerkhidmatan = useRef();
  const currentGred = useRef();
  const currentRole = useRef();
  const currentRisiko = useRef();
  const [editedEntity, setEditedEntity] = useState([]);
  const [klinik, setKlinik] = useState([]);
  const [statusPerkhidmatan, setStatusPerkhidmatan] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingData, setEditingData] = useState(false);

  // event
  const currentJenisEvent = useRef();
  const currentModPenyampaian = useRef();
  const currentTarikh = useRef();
  const currentMasaMula = useRef();
  const currentMasaTamat = useRef();
  const currentTempat = useRef();

  useEffect(() => {
    if (FType === 'kp') {
      readOneData(FType, id).then((res) => {
        setEditedEntity(res.data);
      });
    }
    if (FType === 'program') {
      readOneDataForKp(FType, id).then((res) => {
        setEditedEntity(res.data);
      });
    }
    if (FType !== 'program') {
      readKpData().then((res) => {
        setKlinik(res.data);
      });
      readOneData(FType, id).then((res) => {
        setEditedEntity(res.data);
      });
    }
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleSubmit = async (e) => {
    setEditingData(true);
    let Data = {};
    Data = {
      ...Data,
      // nama: currentName.current,
      handler: currentKp.current,
    };
    if (FType === 'pp' || FType === 'jp') {
      Data = {
        // nama: currentName.current,
        email: currentEmail.current,
        gred: currentGred.current,
        kpSkrg: currentKp.current,
        role: currentRole.current,
      };
    }
    if (FType === 'program') {
      Data = {
        // nama: currentName.current,
        createdByKp: kp,
        jenisEvent: currentJenisEvent.current,
        modPenyampaianPerkhidmatan: currentModPenyampaian.current,
        tarikh: currentTarikh.current,
        masaMula: currentMasaMula.current,
        masaTamat: currentMasaTamat.current,
        tempat: currentTempat.current,
      };
    }
    if (FType === 'kp') {
      if (currentRole.current === '') {
        currentRole.current = 'klinik';
      }
      Data = {
        // nama: currentName.current,
        statusRoleKlinik: currentRole.current,
        statusPerkhidmatan: editedEntity.statusPerkhidmatan,
      };
    }
    if (
      FType === 'sr' ||
      FType === 'sm' ||
      FType === 'taska' ||
      FType === 'tadika'
    ) {
      Data = {
        ...Data,
        risikoSekolahPersis: currentRisiko.current,
        statusPerkhidmatan: editedEntity.statusPerkhidmatan,
      };
    }
    console.log(Data);
    updateData(FType, id, Data).then((res) => {
      console.log(res.data);
      toast.info(`Data berjaya dikemaskini`);
      setShowEditModal(false);
      setEditingData(false);
      setReload(!reload);
    });
  };

  function Klinik({ confirm }) {
    return (
      <>
        <form onSubmit={confirm(handleSubmit)}>
          <div
            className={styles.darkBG}
            onClick={() => setShowEditModal(false)}
          />
          <div className={styles.centered}>
            <div className={styles.modalAdd}>
              <div className={styles.modalHeader}>
                <h5 className={styles.heading}>UBAH KLINIK PERGIGIAN</h5>
              </div>
              <span
                className={styles.closeBtn}
                onClick={() => setShowEditModal(false)}
              >
                <RiCloseLine style={{ marginBottom: '-3px' }} />
              </span>
              <div className={styles.modalContent}>
                <div className='admin-pegawai-handler-container'>
                  <div className='admin-pegawai-handler-input'>
                    <div className='grid gap-1'>
                      <label htmlFor='nama'>Nama Klinik</label>
                      <input
                        readOnly={true}
                        value={editedEntity.kp}
                        className='border-2'
                        type='text'
                        name='nama'
                        id='nama'
                        onChange={(e) => (currentName.current = e.target.value)}
                      />
                      <label htmlFor='nama'>Kod Fasiliti</label>
                      <input
                        readOnly={true}
                        value={editedEntity.kodFasiliti}
                        className='border-2'
                        type='text'
                        name='kod'
                        id='kod'
                      />
                      <label htmlFor='nama'>Email</label>
                      <input
                        readOnly={true}
                        value={editedEntity.email}
                        className='border-2'
                        type='text'
                        name='email'
                        id='email'
                      />
                    </div>
                    <p>Role Klinik Pergigian</p>
                    <div className='grid grid-cols-4 gap-1'>
                      <label htmlFor='role'>KEPP</label>
                      <input
                        readOnly={true}
                        checked={editedEntity.role === 'kepp'}
                        type='radio'
                        id='role'
                        name='role'
                        value='kepp'
                        // onChange={(e) => (currentRole.current = e.target.value)}
                      />
                      <label htmlFor='role'>UTC</label>
                      <input
                        readOnly={true}
                        checked={editedEntity.role === 'utc'}
                        type='radio'
                        id='role'
                        name='role'
                        value='utc'
                        // onChange={(e) => (currentRole.current = e.target.value)}
                      />
                      <label htmlFor='role'>RTC</label>
                      <input
                        readOnly={true}
                        checked={editedEntity.role === 'rtc'}
                        type='radio'
                        id='role'
                        name='role'
                        value='rtc'
                        // onChange={(e) => (currentRole.current = e.target.value)}
                      />
                      <label htmlFor='role'>Visiting</label>
                      <input
                        readOnly={true}
                        checked={editedEntity.role === 'visiting'}
                        type='radio'
                        id='role'
                        name='role'
                        value='visiting'
                        // onChange={(e) => (currentRole.current = e.target.value)}
                      />
                      <div className='col-span-4'>
                        <label htmlFor='role' className='m-3'>
                          Klinik Pergigian
                        </label>
                        <input
                          readOnly={true}
                          checked={
                            editedEntity.statusRoleKlinik === 'klinik'
                              ? true
                              : false
                          }
                          type='radio'
                          id='role'
                          name='role'
                          value=''
                          // onChange={(e) =>
                          //   (currentRole.current = e.target.value)
                          // }
                        />
                      </div>
                    </div>
                    <p>Status Klinik Pergigian</p>
                    <div className='grid grid-cols-2'>
                      <label htmlFor='statusAktif'>Aktif</label>
                      <input
                        checked={
                          editedEntity.statusPerkhidmatan === 'active'
                            ? true
                            : false
                        }
                        type='radio'
                        name='statusAktif'
                        value='active'
                        onChange={(e) => {
                          setEditedEntity({
                            ...editedEntity,
                            statusPerkhidmatan: e.target.value,
                          });
                          setStatusPerkhidmatan(e.target.value);
                        }}
                      />
                      <label htmlFor='statusTidakAktif'>Tidak Aktif</label>
                      <input
                        checked={
                          editedEntity.statusPerkhidmatan === 'non-active'
                            ? true
                            : false
                        }
                        type='radio'
                        name='statusTidakAktif'
                        value='non-active'
                        onChange={(e) => {
                          setEditedEntity({
                            ...editedEntity,
                            statusPerkhidmatan: e.target.value,
                          });
                          setStatusPerkhidmatan(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.modalActions}>
                <div className={styles.actionsContainer}>
                  {editingData ? (
                    <BusyButton func='edit' />
                  ) : (
                    <SubmitButton func='edit' />
                  )}
                  <span
                    className={styles.cancelBtn}
                    onClick={() => setShowEditModal(false)}
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

  function Pegawai({ confirm }) {
    return (
      <form onSubmit={confirm(handleSubmit)}>
        <div
          className={styles.darkBG}
          onClick={() => setShowEditModal(false)}
        />
        <div className={styles.centered}>
          <div className={styles.modalAdd}>
            <div className={styles.modalHeader}>
              <h5 className={styles.heading}>UBAH {Dictionary[FType]}</h5>
            </div>
            <span
              className={styles.closeBtn}
              onClick={() => setShowEditModal(false)}
            >
              <RiCloseLine style={{ marginBottom: '-3px' }} />
            </span>
            <div className={styles.modalContent}>
              <div className='admin-pegawai-handler-input'>
                <p>
                  Nama Pegawai{' '}
                  <span className='font-semibold text-lg text-user6'>*</span>
                </p>
                <div className='grid gap-1'>
                  <input
                    readOnly={true}
                    defaultValue={editedEntity.nama}
                    className='border-2'
                    type='text'
                    name='nama'
                    id='nama'
                    onChange={(e) => (currentName.current = e.target.value)}
                  />
                </div>
                {FType === 'pp' && (
                  <p>
                    Nombor MDC{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
                )}
                {FType === 'jp' && (
                  <p>
                    Nombor MDTB{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
                )}
                <div className='grid gap-1'>
                  <input
                    readOnly={true}
                    defaultValue={
                      FType === 'pp'
                        ? editedEntity.mdcNumber
                        : editedEntity.mdtbNumber
                    }
                    className='border-2'
                    type='text'
                    name='mdc'
                    id='mdc'
                  />
                </div>
                <p>
                  Emel{' '}
                  <span className='font-semibold text-lg text-user6'>*</span>
                </p>
                <div className='grid gap-1'>
                  <input
                    required
                    defaultValue={editedEntity.email}
                    className='border-2'
                    type='text'
                    name='email'
                    id='email'
                    onChange={(e) => (currentEmail.current = e.target.value)}
                  />
                </div>
                <div className='grid gap-1'>
                  <p>
                    Gred{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
                  {FType === 'pp' ? (
                    <select
                      defaultValue={editedEntity.gred}
                      className='border-2'
                      // onChange={(e) => (currentGred.current = e.target.value)}
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
                  ) : (
                    <select
                      defaultValue={editedEntity.gred}
                      className='border-2'
                      // onChange={(e) => (currentGred.current = e.target.value)}
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
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
                  <select
                    defaultValue={editedEntity.kpSkrg}
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
                    Role{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
                  <select
                    defaultValue={editedEntity.role}
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
              {editingData ? (
                <BusyButton func='edit' />
              ) : (
                <SubmitButton func='edit' />
              )}
              <span
                className={styles.cancelBtn}
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </span>
            </div>
          </div>
        </div>
      </form>
    );
  }

  function Facility({ confirm }) {
    return (
      <form onSubmit={confirm(handleSubmit)}>
        <div
          className={styles.darkBG}
          onClick={() => setShowEditModal(false)}
        />
        <div className={styles.centered}>
          <div className={styles.modalEdit}>
            <div className={styles.modalHeader}>
              <h5 className={styles.heading}>UBAH {Dictionary[FType]} </h5>
            </div>
            <span
              className={styles.closeBtn}
              onClick={() => setShowEditModal(false)}
            >
              <RiCloseLine style={{ marginBottom: '-3px' }} />
            </span>
            <div className={styles.modalContent}>
              <div className='grid gap-1'>
                {FType !== 'kpb' && FType !== 'mp' ? (
                  <p>
                    Nama {Dictionary[FType]}: {editedEntity.nama}{' '}
                  </p>
                ) : (
                  <p>
                    Nombor Plat {Dictionary[FType]}: {editedEntity.nama}{' '}
                  </p>
                )}
                <br />
                <p>
                  Klinik Bertugas{' '}
                  <span className='font-semibold text-lg text-admin3'>*</span>
                </p>
                <select
                  required
                  defaultValue={editedEntity.handler}
                  className='border-2'
                  onChange={(e) => (currentKp.current = e.target.value)}
                >
                  <option value=''>Pilih Klinik Baru..</option>
                  {klinik.map((k) => (
                    <option className='capitalize' value={k.kp}>
                      {k.kp}
                    </option>
                  ))}
                </select>
                {FType !== 'sr' && FType !== 'sm' ? null : (
                  <p>
                    Risiko Sekolah (PERSiS){' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
                )}
                {FType !== 'sr' && FType !== 'sm' ? null : (
                  <select
                    required
                    className='border-2'
                    value={editedEntity.risikoSekolahPersis}
                    onChange={(e) => (currentRisiko.current = e.target.value)}
                  >
                    <option value=''>Pilih Risiko</option>
                    <option value='rendah'>Rendah</option>
                    <option value='tinggi'>Tinggi</option>
                  </select>
                )}
                <p>Status {Dictionary[FType]}</p>
                <div className='grid grid-cols-2'>
                  <label htmlFor='statusAktif'>Aktif</label>
                  <input
                    checked={
                      editedEntity.statusPerkhidmatan === 'active'
                        ? true
                        : false
                    }
                    type='radio'
                    name='statusAktif'
                    value='active'
                    onChange={(e) => {
                      setEditedEntity({
                        ...editedEntity,
                        statusPerkhidmatan: e.target.value,
                      });
                      setStatusPerkhidmatan(e.target.value);
                    }}
                  />
                  <label htmlFor='statusTidakAktif'>Tidak Aktif</label>
                  <input
                    checked={
                      editedEntity.statusPerkhidmatan === 'non-active'
                        ? true
                        : false
                    }
                    type='radio'
                    name='statusTidakAktif'
                    value='non-active'
                    onChange={(e) => {
                      setEditedEntity({
                        ...editedEntity,
                        statusPerkhidmatan: e.target.value,
                      });
                      setStatusPerkhidmatan(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className={styles.modalActions}>
              <div className={styles.actionsContainer}>
                {editingData ? (
                  <BusyButton func='edit' />
                ) : (
                  <SubmitButton func='edit' />
                )}
                <span
                  className={styles.cancelBtn}
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }

  function Event({ confirm }) {
    return (
      <>
        <form onSubmit={confirm(handleSubmit)}>
          <div
            className={styles.darkBG}
            onClick={() => setShowEditModal(false)}
          />
          <div className={styles.centered}>
            <div className={styles.modalEvent}>
              <div className={styles.modalHeader}>
                <h5 className={styles.heading}>Kemaskini Program / Aktiviti</h5>
              </div>
              <span
                className={styles.closeBtn}
                onClick={() => setShowEditModal(false)}
              >
                <RiCloseLine style={{ marginBottom: '-3px' }} />
              </span>
              <div className={styles.modalContent}>
                <div className='admin-pegawai-handler-container'>
                  <div className='mb-3'>
                    <p>
                      Tarikh Program / Aktiviti{' '}
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <input
                      readOnly
                      className='border-2'
                      type='date'
                      name='tarikh'
                      id='tarikh'
                      value={editedEntity.tarikh}
                    />
                    <p>
                      Nama Program
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <div className='grid gap-1'>
                      <select
                        readOnly
                        className='border-2 w-fit overflow-x-hidden'
                        value={editedEntity.jenisEvent}
                        onChange={(e) => {
                          currentJenisEvent.current = e.target.value;
                          setEditedEntity({
                            ...editedEntity,
                            jenisEvent: e.target.value,
                          });
                        }}
                        name='jenisEvent'
                        id='jenisEvent'
                      >
                        <option value=''>Jenis Program / Aktiviti</option>
                        <option value='projek-komuniti'>Projek Komuniti</option>
                        <option value='ppkps'>
                          Program Pemasyarakatan Perkhidmatan Klinik Pergigian
                          Sekolah
                        </option>
                        <option value='kgangkat'>
                          Kampung Angkat Pergigian
                        </option>
                        <option value='ppr'>Projek Perumahan Rakyat</option>
                        <option value='we'>Institusi Warga Emas</option>
                        <option value='oku'>Institusi OKU / PDK</option>
                        <option value='oap'>
                          Program Orang Asli dan Penan
                        </option>
                      </select>
                    </div>
                    <p className='mt-3 font-semibold'>
                      Mod Penyampaian Perkhidmatan
                    </p>
                    <div className='grid grid-cols-2 gap-1'>
                      <label htmlFor='modPpb'>Pasukan Pergigian Bergerak</label>
                      <input
                        readOnly
                        type='checkbox'
                        name='mod'
                        checked={editedEntity.modPenyampaianPerkhidmatan.includes(
                          'ppb'
                        )}
                      />
                      <label htmlFor='modKpb'>Klinik Pergigian Bergerak</label>
                      <input
                        readOnly
                        type='checkbox'
                        name='mod'
                        checked={editedEntity.modPenyampaianPerkhidmatan.includes(
                          'kpb'
                        )}
                      />
                      <label htmlFor='modKpb'>Makmal Pergigian Bergerak</label>
                      <input
                        readOnly
                        type='checkbox'
                        name='mod'
                        checked={editedEntity.modPenyampaianPerkhidmatan.includes(
                          'mpb'
                        )}
                      />
                    </div>
                    <p>
                      Nama Program / Aktiviti
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <div className='grid gap-1'>
                      <input
                        readOnly
                        className='border-2'
                        type='text'
                        name='nama'
                        id='nama'
                        value={editedEntity.nama}
                      />
                    </div>
                    <div className='grid gap-1'>
                      <p>
                        Tempat
                        <span className='font-semibold text-lg text-user6'>
                          *
                        </span>
                      </p>
                      <div className='grid gap-1'>
                        <input
                          readOnly
                          className='border-2'
                          type='text'
                          name='nama'
                          id='nama'
                          value={editedEntity.tempat}
                          onChange={(e) => {
                            currentTempat.current = e.target.value;
                            setEditedEntity({
                              ...editedEntity,
                              tempat: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.modalActions}>
                  <div className={styles.actionsContainer}>
                    {editingData ? (
                      <BusyButton func='edit' />
                    ) : (
                      <SubmitButton func='edit' />
                    )}
                    <span
                      className={styles.cancelBtn}
                      onClick={() => setShowEditModal(false)}
                    >
                      Kembali
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </>
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {FType === 'kp' && (
        <ConfirmModalForData callbackFunction={handleSubmit} func='edit'>
          {(confirm) => <Klinik confirm={confirm} />}
        </ConfirmModalForData>
      )}
      {(FType === 'pp' || FType === 'jp') && (
        <ConfirmModalForData callbackFunction={handleSubmit} func='edit'>
          {(confirm) => <Pegawai confirm={confirm} />}
        </ConfirmModalForData>
      )}
      {FType === 'program' && (
        <ConfirmModalForData callbackFunction={handleSubmit} func='edit'>
          {(confirm) => <Event confirm={confirm} />}
        </ConfirmModalForData>
      )}
      {FType !== 'pp' &&
        FType !== 'kp' &&
        FType !== 'jp' &&
        FType !== 'program' && (
          <ConfirmModalForData callbackFunction={handleSubmit} func='edit'>
            {(confirm) => <Facility confirm={confirm} />}
          </ConfirmModalForData>
        )}
    </>
  );
};

const DeleteModal = ({
  FType,
  setShowDeleteModal,
  id,
  deleteCandidate,
  reload,
  setReload,
}) => {
  const { toast, deleteData } = useGlobalAdminAppContext();
  const [deletingData, setDeletingData] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    deleteData(FType, id).then((res) => {
      if (res.status === 200) {
        toast.info(`Data berjaya dipadam`);
        setShowDeleteModal(false);
        setDeletingData(false);
        setReload(!reload);
        return;
      }
      if (res.response.status === 409) {
        toast.error(
          `Data tidak berjaya dipadam. Anda perlu memindah ${res.response.data} ke KP lain sebelum menghapus KP sekarang`
        );
        setShowDeleteModal(false);
        setDeletingData(false);
      }
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div
          className={styles.darkBG}
          onClick={() => setShowDeleteModal(false)}
        />
        <div className={styles.centered}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h5 className={styles.heading}>AWAS!</h5>
            </div>
            <button
              className={styles.closeBtn}
              onClick={() => setShowDeleteModal(false)}
            >
              <RiCloseLine style={{ marginBottom: '-3px' }} />
            </button>
            <div className={styles.modalContent}>
              Anda YAKIN untuk menghapus {deleteCandidate}?
            </div>
            <div className={styles.modalActions}>
              <div className={styles.actionsContainer}>
                {deletingData ? (
                  <BusyButton func='del' />
                ) : (
                  <SubmitButton func='del' />
                )}
                <button
                  className={styles.cancelBtn}
                  onClick={() => setShowDeleteModal(false)}
                >
                  Tidak
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export { AddModal, EditModal, DeleteModal };
