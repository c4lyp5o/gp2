import { useGlobalAdminAppContext } from '../context/adminAppContext';
import { useRef, useEffect, useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import styles from '../Modal.module.css';

import LoadingScreen from './Loading';
import Confirmation from './Confirmation';
import BusyButton from './BusyButton';
import SubmitButtton from './SubmitButton';

const Modal = ({ setShowAddModal, FType, kp, daerah, reload, setReload }) => {
  const {
    Dictionary,
    toast,
    createData,
    readSekolahData,
    readKpData,
    pingApdmServer,
    readPegawaiData,
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

  const handleSubmit = async (e) => {
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
    if (FType === 'event') {
      if (currentModPenyampaian.current.length === 0) {
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
    if (FType === 'pp') {
      readPegawaiData().then((res) => {
        setAllPegawai(res);
      });
    }
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
    if (FType !== 'kp' && FType !== 'event') {
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
                    <SubmitButtton func='add' />
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
                        <select
                          className='border-2 max-w-sm'
                          onChange={(e) => {
                            const selectedPp = allPegawai.find(
                              (p) => p.mdcNumber === parseInt(e.target.value)
                            );
                            console.log(selectedPp);
                            currentName.current = selectedPp.nama;
                            currentRegNumber.current = selectedPp.mdcNumber;
                            currentGred.current = selectedPp.gred;
                          }}
                        >
                          <option key='no-value' value=''>
                            Pilih Pegawai...
                          </option>
                          {allPegawai.map((p) => (
                            <option
                              className='capitalize'
                              key={p.bil}
                              value={p.mdcNumber}
                            >
                              {p.nama}
                            </option>
                          ))}
                        </select>
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
                    <div className='grid gap-1'>
                      {FType === 'nantilahitu' && (
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
                        <>
                          <p>
                            Gred{' '}
                            <span className='font-semibold text-lg text-user6'>
                              *
                            </span>
                          </p>
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
                        </>
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
                    <SubmitButtton func='add' />
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
                    <SubmitButtton func='add' />
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
                      Nama Program
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <div className='grid gap-1'>
                      <select
                        required
                        className='border-2'
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
                      <SubmitButtton func='add' />
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
    return <LoadingScreen />;
  }

  return (
    <>
      {FType === 'kp' && (
        <Confirmation callbackFunction={handleSubmit} func='add'>
          {(confirm) => <Klinik confirm={confirm} />}
        </Confirmation>
      )}
      {(FType === 'pp' || FType === 'jp') && (
        <Confirmation callbackFunction={handleSubmit} func='add'>
          {(confirm) => <Pegawai confirm={confirm} />}
        </Confirmation>
      )}
      {FType !== 'kp' && FType !== 'pp' && FType !== 'jp' && FType !== 'event' && (
        <Confirmation callbackFunction={handleSubmit} func='add'>
          {(confirm) => <Facility confirm={confirm} />}
        </Confirmation>
      )}
      {FType === 'event' && (
        <Confirmation callbackFunction={handleSubmit} func='add'>
          {(confirm) => <Event confirm={confirm} />}
        </Confirmation>
      )}
    </>
  );
};

export default Modal;
