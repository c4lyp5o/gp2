import { useGlobalAdminAppContext } from '../context/adminAppContext';
import { useRef, useEffect, useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import styles from '../Modal.module.css';

import { Loading } from './Screens';
import { InputKlinik, InputPegawai, InputFacility, InputEvent } from './Inputs';
import { ConfirmModalForData } from './superadmin/Confirmation';
import { SubmitButton, BusyButton } from './Buttons';

const AddModal = ({
  setShowAddModal,
  FType,
  negeri,
  daerah,
  id,
  reload,
  setReload,
}) => {
  const {
    toast,
    createData,
    readData,
    pingApdmServer,
    readSekolahData,
    readFasilitiData,
  } = useGlobalAdminAppContext();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [statusPerkhidmatan, setStatusPerkhidmatan] = useState('');
  const [kodSekolah, setKodSekolah] = useState('');
  const [kp, setKp] = useState('');
  const [kodFasiliti, setKodFasiliti] = useState('');
  const [regNumber, setRegNumber] = useState();
  const [gred, setGred] = useState('');
  const [role, setRole] = useState('');
  const currentRolePromosiKlinik = useRef();
  const [rolePromosiKlinik, setRolePromosiKlinik] = useState('');
  const currentRoleMediaSosialKlinik = useRef();
  const [risiko, setRisiko] = useState('');
  // institusi
  const [kategoriInstitusi, setKategoriInstitusi] = useState('');
  // taska
  const [kodTastad, setKodTastad] = useState('');
  const [alamatTastad, setAlamatTastad] = useState('');
  const [enrolmenTastad, setEnrolmenTastad] = useState('');
  const [govKe, setGovKe] = useState('');
  // event
  const [jenisEvent, setJenisEvent] = useState('');
  const [modPenyampaian, setModPenyampaian] = useState([]);
  const [tarikhStart, setTarikhStart] = useState(
    moment(new Date()).format('YYYY-MM-DD')
  );
  const [tarikhEnd, setTarikhEnd] = useState(
    moment(new Date()).format('YYYY-MM-DD')
  );
  const [tempat, setTempat] = useState('');
  // APDM
  const [statusApdm, setStatusApdm] = useState(false);
  // data
  const [klinik, setKlinik] = useState([]);
  const [sekolah, setSekolah] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingData, setAddingData] = useState(false);
  // pp & jp sedia ada
  const [allPegawai, setAllPegawai] = useState([]);
  const [allJp, setAllJp] = useState([]);
  // dpims & jp nama
  const [carianNama, setCarianNama] = useState('');
  const [searching, setSearching] = useState(false);
  const [noPpJp, setNoPpJp] = useState('');

  const handleSubmit = async () => {
    if (FType === 'pp' || FType === 'jp') {
      if (
        !carianNama ||
        noPpJp === 'Tiada pegawai dijumpai' ||
        noPpJp === 'Tiada juruterapi pergigian dijumpai'
      ) {
        toast.error('Tiada nama');
        return;
      }
      if (!regNumber) {
        toast.error('Klik pada butang cari');
        return;
      }
    }
    let Data = {};
    Data = {
      ...Data,
      nama: name,
      handler: kp,
      kodFasilitiHandler: kodFasiliti,
      statusPerkhidmatan: statusPerkhidmatan,
    };
    if (FType === 'program') {
      Data = {
        nama: name,
        jenisEvent,
        createdByKp: kp,
        createdByKodFasiliti: kodFasiliti,
        kategoriInstitusi,
        modPenyampaianPerkhidmatan: modPenyampaian,
        tarikhStart,
        tarikhEnd,
        tempat,
      };
    }
    if (FType === 'pp') {
      Data = {
        nama: name,
        email,
        statusPegawai: 'pp',
        mdcNumber: regNumber,
        gred,
        kpSkrg: kp,
        kodFasiliti,
        role,
        rolePromosiKlinik: currentRolePromosiKlinik.current.checked,
        activationStatus: true,
      };
    }
    if (FType === 'jp') {
      Data = {
        nama: name,
        email,
        statusPegawai: 'jp',
        mdtbNumber: regNumber,
        gred,
        kpSkrg: kp,
        kodFasiliti,
        role,
        rolePromosiKlinik: currentRolePromosiKlinik.current.checked,
        activationStatus: true,
      };
    }
    if (FType === 'kp') {
      Data = {
        kp: name,
        accountType: 'kpUser',
        email: email,
        statusRoleKlinik: role,
        statusPerkhidmatan: statusPerkhidmatan,
        kodFasiliti: kodFasiliti,
      };
    }
    if (FType === 'taska' || FType === 'tadika') {
      Data = {
        ...Data,
        kodTastad: kodTastad,
        alamatTastad: alamatTastad,
        enrolmenTastad: enrolmenTastad,
        govKe: govKe,
      };
    }
    if (FType === 'sr' || FType === 'sm') {
      Data = {
        ...Data,
        kodSekolah: kodSekolah,
        risikoSekolahPersis: risiko,
      };
    }
    if (FType === 'ins') {
      Data = {
        ...Data,
        kategoriInstitusi: kategoriInstitusi,
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

  useEffect(() => {
    if (FType === 'sr' || FType === 'sm') {
      pingApdmServer().then((res) => {
        if (res.status === 200) {
          // statusApdm.current = true;
          setStatusApdm(true);
        } else {
          // statusApdm.current = false;
          setStatusApdm(false);
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
    // if (FType === 'jp') {
    //   readMdtbData().then((res) => {
    //     setMdtbMembers(res);
    //   });
    // }
    if (FType === 'kp') {
      readFasilitiData({ negeri, daerah }).then((res) => {
        setKlinik(res.data);
      });
    }
    if (FType !== 'kp') {
      readData('kp').then((res) => {
        setKlinik(res.data);
      });
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [FType, id]);

  // useEffect(() => {
  //   if (id) {
  //     console.log('got id', id);
  //     readOneData(FType, id).then((res) => {
  //       console.log(res.data);
  //       setName(res.data.nama);
  //       setKodFasiliti(res.data.kodFasiliti);
  //       setEmail(res.data.email);
  //       setRole(res.data.role);
  //       setStatusPerkhidmatan(res.data.statusPerkhidmatan);
  //       // pegawai
  //       setNoPpJp(res.data.noPpJp);
  //       setRegNumber(res.data.regNumber);
  //       setGred(res.data.gred);
  //       setKp(res.data.kp);
  //       setRolePromosiKlinik(res.data.rolePromosiKlinik);
  //       // facility
  //       setKodSekolah(res.data.kodSekolah);
  //       setKodTastad(res.data.kodTastad);
  //       setAlamatTastad(res.data.alamatTastad);
  //       setEnrolmenTastad(res.data.enrolmenTastad);
  //       setGovKe(res.data.govKe);
  //       setKategoriInstitusi(res.data.kategoriInstitusi);
  //       setRisiko(res.data.risikoSekolahPersis);
  //     });
  //   }
  // }, [id]);

  const props = {
    FType,
    setShowAddModal,
    setName,
    setKodFasiliti,
    setEmail,
    setRole,
    setStatusPerkhidmatan,
    // pegawai
    setCarianNama,
    carianNama,
    setSearching,
    searching,
    setNoPpJp,
    noPpJp,
    setAllPegawai,
    allPegawai,
    setAllJp,
    allJp,
    setRegNumber,
    regNumber,
    setGred,
    gred,
    setKp,
    kp,
    setRolePromosiKlinik,
    rolePromosiKlinik,
    // facility
    setKodSekolah,
    kodSekolah,
    setKodTastad,
    kodTastad,
    setAlamatTastad,
    alamatTastad,
    setEnrolmenTastad,
    enrolmenTastad,
    setKategoriInstitusi,
    kategoriInstitusi,
    setRisiko,
    risiko,
    setGovKe,
    govKe,
    //event
    setJenisEvent,
    jenisEvent,
    setModPenyampaian,
    modPenyampaian,
    setTarikhStart,
    tarikhStart,
    setTarikhEnd,
    tarikhEnd,
    setTempat,
    tempat,
    //
    statusApdm,
    setAddingData,
    addingData,
    klinik,
    sekolah,
    handleSubmit,
    // ref
    currentRolePromosiKlinik,
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {FType === 'kp' && (
        <ConfirmModalForData callbackFunction={handleSubmit} func='add'>
          {(confirm) => <InputKlinik {...props} confirm={confirm} />}
        </ConfirmModalForData>
      )}
      {(FType === 'pp' || FType === 'jp') && (
        <ConfirmModalForData callbackFunction={handleSubmit} func='add'>
          {(confirm) => <InputPegawai {...props} confirm={confirm} />}
        </ConfirmModalForData>
      )}
      {FType !== 'kp' &&
        FType !== 'pp' &&
        FType !== 'jp' &&
        FType !== 'program' && (
          <ConfirmModalForData callbackFunction={handleSubmit} func='add'>
            {(confirm) => <InputFacility {...props} confirm={confirm} />}
          </ConfirmModalForData>
        )}
      {FType === 'program' && (
        <ConfirmModalForData callbackFunction={handleSubmit} func='add'>
          {(confirm) => <InputEvent {...props} confirm={confirm} />}
        </ConfirmModalForData>
      )}
    </>
  );
};

const AddModalForKp = ({
  setShowAddModal,
  FType,
  negeri,
  daerah,
  kp,
  reload,
  setReload,
}) => {
  const { masterDatePicker, toast, createDataForKp } =
    useGlobalAdminAppContext();

  const currentName = useRef();
  // const currentEmail = useRef();
  const currentStatusPerkhidmatan = useRef();
  // const currentKodSekolah = useRef();
  const currentKp = useRef();
  const currentKodFasiliti = useRef();
  // const currentRegNumber = useRef();
  // const currentGred = useRef();
  // const currentRole = useRef('');
  // const currentRolePromosiKlinik = useRef();
  // const currentRoleMediaSosialKlinik = useRef();
  // const currentRisiko = useRef();
  // institusi
  const currentKategoriInstitusi = useRef();
  // event
  const currentJenisEvent = useRef();
  const currentModPenyampaian = useRef([]);
  const currentTarikhStart = useRef(moment(new Date()).format('YYYY-MM-DD'));
  const currentTarikhEnd = useRef(moment(new Date()).format('YYYY-MM-DD'));
  const currentTempat = useRef();
  //datepicker
  const [startDateDP, setStartDateDP] = useState(new Date());
  const [endDateDP, setEndDateDP] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [addingData, setAddingData] = useState(false);

  const handleSubmit = async () => {
    let Data = {};
    Data = {
      ...Data,
      nama: currentName.current,
      handler: currentKp.current,
      kodFasilitiHandler: currentKodFasiliti.current,
      statusPerkhidmatan: currentStatusPerkhidmatan.current,
    };
    if (FType === 'program') {
      Data = {
        nama: currentName.current,
        createdByKp: kp,
        jenisEvent: currentJenisEvent.current,
        kategoriInstitusi: currentKategoriInstitusi.current,
        modPenyampaianPerkhidmatan: currentModPenyampaian.current,
        tarikhStart: currentTarikhStart.current,
        tarikhEnd: currentTarikhEnd.current,
        tempat: currentTempat.current,
      };
    }
    createDataForKp(FType, Data).then((res) => {
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
    return masterDatePicker({
      selected: startDateDP,
      onChange: (date) => {
        const tempDate = moment(date).format('YYYY-MM-DD');
        setStartDateDP(date);
        currentTarikhStart.current = tempDate;
      },
      className: 'border-2 w-full',
    });
  };

  const CustomDatePicker2 = () => {
    return masterDatePicker({
      selected: endDateDP,
      onChange: (date) => {
        const tempDate = moment(date).format('YYYY-MM-DD');
        setEndDateDP(date);
        currentTarikhEnd.current = tempDate;
      },
      className: 'border-2 w-full',
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [FType]);

  function Event({ confirm }) {
    const [jenisEventDd, setJenisEventDd] = useState('');
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
                <h5 className={styles.heading}>Tambah Program Komuniti</h5>
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
                      Tarikh Program Komuniti
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <CustomDatePicker />
                    <CustomDatePicker2 />
                    <p>
                      Jenis Program Komuniti
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <div className='grid gap-1'>
                      <select
                        required
                        className='border-2 w-full'
                        onChange={(e) => {
                          currentJenisEvent.current = e.target.value;
                          setJenisEventDd(e.target.value);
                          console.log(jenisEventDd);
                          console.log(currentJenisEvent.current);
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
                        <option value='oap'>
                          Program Orang Asli dan Penan
                        </option>
                        {/* {206,207} shaja(sementara je tpi smpai bulan 3)***data jgn buang *****data tak masuk ke program koumniti & sekolah & pg211 */}
                        <option value='incremental'>
                          Program Pergigian Sekolah Sesi 2022/2023
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
                      Nama Program Komuniti
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
      {FType === 'program' && (
        <ConfirmModalForData callbackFunction={handleSubmit} func='add'>
          {(confirm) => <Event confirm={confirm} />}
        </ConfirmModalForData>
      )}
    </>
  );
};

const EditModal = ({ setShowEditModal, FType, kp, id, reload, setReload }) => {
  const { Dictionary, toast, readData, readOneData, updateData } =
    useGlobalAdminAppContext();

  const currentKp = useRef();
  const currentKodFasiliti = useRef();
  const currentName = useRef();
  const currentEmail = useRef();
  const currentStatusPerkhidmatan = useRef();
  const currentGred = useRef();
  const currentRole = useRef();
  const currentRolePromosiKlinik = useRef();
  const currentRoleMediaSosialKlinik = useRef();
  const currentRisiko = useRef();
  // event
  const currentJenisEvent = useRef();
  const currentTempat = useRef();
  const currentTarikhMula = useRef();
  const currentTarikhTamat = useRef();
  const currentMod = useRef();
  const currentKategoriInstitusi = useRef();
  //
  const [editedEntity, setEditedEntity] = useState([]);
  const [klinik, setKlinik] = useState([]);
  const [statusPerkhidmatan, setStatusPerkhidmatan] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingData, setEditingData] = useState(false);

  useEffect(() => {
    if (FType === 'kp') {
      readOneData(FType, id).then((res) => {
        setEditedEntity(res.data);
      });
    }
    if (FType !== 'kp') {
      readData('kp').then((res) => {
        setKlinik(res.data);
      });
      readOneData(FType, id).then((res) => {
        console.log(res.data);
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
      kodFasilitiHandler: currentKodFasiliti.current,
      statusPerkhidmatan: editedEntity.statusPerkhidmatan,
    };
    if (FType === 'pp' || FType === 'jp') {
      Data = {
        // nama: currentName.current,
        email: currentEmail.current,
        gred: currentGred.current,
        kpSkrg: currentKp.current,
        kodFasiliti: currentKodFasiliti.current,
        role: currentRole.current,
        rolePromosiKlinik: currentRolePromosiKlinik.current.checked,
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
    if (FType === 'program') {
      Data = {
        ...Data,
        nama: currentName.current,
        jenisEvent: currentJenisEvent.current,
        tempat: currentTempat.current,
        tarikhMula: currentTarikhMula.current,
        tarikhTamat: currentTarikhTamat.current,
        mod: currentMod.current,
        kategoriInstitusi: currentKategoriInstitusi.current,
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
                  {FType === 'pp' && (
                    <select
                      required
                      defaultValue={editedEntity.gred}
                      className='border-2'
                      onChange={(e) => (currentGred.current = e.target.value)}
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
                      defaultValue={editedEntity.gred}
                      className='border-2'
                      onChange={(e) => (currentGred.current = e.target.value)}
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
                    defaultValue={editedEntity.kodFasiliti}
                    className='border-2'
                    onChange={(e) => {
                      const selectedKlinik = klinik.find(
                        (k) => k.kodFasiliti === e.target.value
                      );
                      currentKp.current = selectedKlinik.kp;
                      currentKodFasiliti.current = selectedKlinik.kodFasiliti;
                    }}
                  >
                    <option value=''>Pilih Klinik</option>
                    {klinik.map((k) => (
                      <option className='capitalize' value={k.kodFasiliti}>
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
                    required
                    defaultValue={editedEntity.role}
                    className='border-2'
                    onChange={(e) => (currentRole.current = e.target.value)}
                  >
                    <option value=''>Pilih Role</option>
                    <option value='admin'>Pentadbir Klinik</option>
                    <option value='umum'>Pengguna</option>
                  </select>
                </div>
                <div className='mt-3'>
                  <label htmlFor='role-promosi-klinik' className='mr-3'>
                    Pegawai promosi fasiliti?
                  </label>
                  <input
                    type='checkbox'
                    id='role-promosi-klinik'
                    checked={editedEntity.rolePromosiKlinik}
                    ref={currentRolePromosiKlinik}
                    onChange={() => {
                      setEditedEntity({
                        ...editedEntity,
                        rolePromosiKlinik: !editedEntity.rolePromosiKlinik,
                      });
                    }}
                  />
                  {/* <div className='mt-3'>
                    <label htmlFor='role-promosi-klinik' className='mr-3'>
                      Pegawai media sosial fasiliti?
                    </label>
                    <input
                      type='checkbox'
                      id='role-promosi-klinik'
                      checked={editedEntity.rolePromosiKlinik}
                      ref={currentRolePromosiKlinik}
                      onChange={() => {
                        setEditedEntity({
                          ...editedEntity,
                          rolePromosiKlinik: !editedEntity.rolePromosiKlinik,
                        });
                      }}
                    />
                  </div> */}
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
                  Klinik Bertanggungjawab{' '}
                  <span className='font-semibold text-lg text-admin3'>*</span>
                </p>
                <select
                  required
                  defaultValue={editedEntity.kodFasilitiHandler}
                  className='border-2'
                  onChange={(e) => {
                    const selectedKlinik = klinik.find(
                      (k) => k.kodFasiliti === e.target.value
                    );
                    currentKp.current = selectedKlinik.kp;
                    currentKodFasiliti.current = selectedKlinik.kodFasiliti;
                  }}
                >
                  <option value=''>Pilih Klinik Baru..</option>
                  {klinik.map((k) => (
                    <option className='capitalize' value={k.kodFasiliti}>
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
    const [jenisEventDd, setJenisEventDd] = useState('');
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
                <h5 className={styles.heading}>Tambah Program Komuniti</h5>
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
                    {/* <p>
                      Tarikh Program Komuniti
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p> */}
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
                    {/* <CustomDatePicker />
                    <CustomDatePicker2 /> */}
                    <p>
                      Jenis Program Komuniti
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <div className='grid gap-1'>
                      <select
                        required
                        className='border-2 w-full'
                        value={editedEntity.jenisEvent}
                        onChange={(e) => {
                          currentJenisEvent.current = e.target.value;
                          setJenisEventDd(e.target.value);
                          console.log(currentJenisEvent.current);
                        }}
                        name='jenisEvent'
                        id='jenisEvent'
                      >
                        <option value=''>Jenis Program / Aktiviti</option>
                        {/* <option value='projek-komuniti'>Projek Komuniti</option>
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
                        </option> */}
                        <option value='programDewasaMuda'>
                          Program Dewasa Muda
                        </option>
                        <option value='kampungAngkatPergigian'>
                          Kampung Angkat Pergigian
                        </option>
                        <option value='ppr'>Projek Perumahan Rakyat</option>
                        <option value='we'>Institusi Warga Emas</option>
                        <option value='oku'>Institusi OKU / PDK</option>
                      </select>
                    </div>
                    {jenisEventDd === 'programDewasaMuda' && (
                      <div className='grid gap-1'>
                        <p>
                          Jenis Institusi
                          <span className='font-semibold text-lg text-user6'>
                            *
                          </span>
                        </p>
                        <select
                          required
                          className='border-2'
                          value={editedEntity.jenisInstitusi}
                          onChange={(e) =>
                            (currentKategoriInstitusi.current = e.target.value)
                          }
                        >
                          <option value=''>Pilih Institusi</option>
                          <option value='kolej-komuniti'>Kolej Komuniti</option>
                          <option value='kolej-vokasional'>
                            Kolej Vokasional
                          </option>
                          <option value='ipg'>
                            Institusi Pendidikan Guru (IPG)
                          </option>
                          <option value='ipta'>
                            Institusi Pengajian Tinggi Awam
                          </option>
                          <option value='lain-lain'>
                            Lain-lain Institusi Pengajian
                          </option>
                        </select>
                      </div>
                    )}
                    {/* <p className='mt-3 font-semibold'>
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
                    </div> */}
                    <p>
                      Nama Program Komuniti
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <div className='grid gap-1'>
                      <input
                        required
                        className='border-2'
                        value={editedEntity.nama}
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
                          value={editedEntity.tempat}
                          type='text'
                          name='nama'
                          id='nama'
                          onChange={(e) =>
                            (currentTempat.current = e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <p>
                      Klinik Bertugas{' '}
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <div className='grid gap-1'>
                      <select
                        required
                        className='border-2'
                        value={editedEntity.createdByKodFasiliti}
                        onChange={(e) => {
                          const selectedKlinik = klinik.find(
                            (k) => k.kodFasiliti === e.target.value
                          );
                          currentKp.current = selectedKlinik.kp;
                          currentKodFasiliti.current =
                            selectedKlinik.kodFasiliti;
                        }}
                      >
                        <option value=''>Pilih Klinik</option>
                        {klinik.map((k) => (
                          <option className='capitalize' value={k.kodFasiliti}>
                            {k.kp}
                          </option>
                        ))}
                      </select>
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

const EditModalForKp = ({
  setShowEditModal,
  FType,
  kp,
  id,
  reload,
  setReload,
}) => {
  const {
    Dictionary,
    toast,
    readOneDataForKp,
    updateDataForKp,
    masterDatePicker,
  } = useGlobalAdminAppContext();

  const currentKp = useRef();
  const currentName = useRef();
  const currentEmail = useRef();
  const currentGred = useRef();
  const currentRole = useRef();
  const [editedEntity, setEditedEntity] = useState([]);
  const [statusCscsp, setStatusCscsp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingData, setEditingData] = useState(false);

  // event
  const currentJenisEvent = useRef();
  const currentModPenyampaian = useRef([]);
  //
  const [modPenyampaian, setModPenyampaian] = useState([]);
  const [tarikhStart, setTarikhStart] = useState(new Date('YYYY-MM-DD'));
  const [tarikhEnd, setTarikhEnd] = useState(new Date('YYYY-MM-DD'));
  //
  const currentTarikhStart = useRef(moment(new Date()).format('YYYY-MM-DD'));
  const currentTarikhEnd = useRef(moment(new Date()).format('YYYY-MM-DD'));
  const currentMasaMula = useRef();
  const currentMasaTamat = useRef();
  const currentTempat = useRef();

  // tastad
  const currentEnrolment = useRef();

  //datepicker
  const [startDateDP, setStartDateDP] = useState(new Date());
  const [endDateDP, setEndDateDP] = useState(new Date());

  const StartDate = () => {
    return masterDatePicker({
      selected: startDateDP,
      onChange: (date) => {
        const tempDate = moment(date).format('YYYY-MM-DD');
        setStartDateDP(date);
        currentTarikhStart.current = tempDate;
      },
      className: 'border-2 w-full',
    });
  };

  const EndDate = () => {
    return masterDatePicker({
      selected: endDateDP,
      onChange: (date) => {
        const tempDate = moment(date).format('YYYY-MM-DD');
        setEndDateDP(date);
        currentTarikhEnd.current = tempDate;
      },
      className: 'border-2 w-full',
    });
  };

  useEffect(() => {
    readOneDataForKp(FType, id).then((res) => {
      setEditedEntity(res.data);
      if (FType === 'pp' || FType === 'jp') {
        setStatusCscsp(res.data.cscspVerified);
      }
      setStartDateDP(new Date(res.data.tarikhStart));
      setEndDateDP(new Date(res.data.tarikhEnd));
    });
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
    if (FType === 'program') {
      Data = {
        // nama: currentName.current,
        createdByKp: kp,
        jenisEvent: currentJenisEvent.current,
        modPenyampaianPerkhidmatan: currentModPenyampaian.current,
        tarikhStart: currentTarikhStart.current,
        tarikhEnd: currentTarikhEnd.current,
        masaMula: currentMasaMula.current,
        masaTamat: currentMasaTamat.current,
        tempat: currentTempat.current,
      };
    }
    if (FType === 'pp' || FType === 'jp') {
      Data = {
        // nama: currentName.current,
        email: currentEmail.current,
        gred: currentGred.current,
        kpSkrg: currentKp.current,
        role: currentRole.current,
        cscspVerified: statusCscsp,
      };
    }
    if (FType === 'tastad') {
      if (!currentEnrolment.current) {
        toast.error(`Sila masukkan enrolment`);
        return;
      }
      Data = {
        // nama: currentName.current,
        enrolmenTastad: currentEnrolment.current,
      };
    }
    updateDataForKp(FType, id, Data).then((res) => {
      toast.info(`Data berjaya dikemaskini`);
      setShowEditModal(false);
      setEditingData(false);
      setReload(!reload);
    });
  };

  // const eventModeChecker = (e) => {
  //   if (currentModPenyampaian.current.includes(e)) {
  //     currentModPenyampaian.current.splice(
  //       currentModPenyampaian.current.indexOf(e),
  //       1
  //     );
  //     modPenyampaian.splice(modPenyampaian.indexOf(e), 1);
  //     editedEntity.modPenyampaianPerkhidmatan.splice(
  //       editedEntity.modPenyampaianPerkhidmatan.indexOf(e),
  //       1
  //     );
  //     setModPenyampaian([...modPenyampaian]);
  //     return;
  //   }
  //   if (!currentModPenyampaian.current.includes(e)) {
  //     currentModPenyampaian.current = [...currentModPenyampaian.current, e];
  //     setEditedEntity({
  //       ...editedEntity,
  //       modPenyampaianPerkhidmatan: [
  //         ...editedEntity.modPenyampaianPerkhidmatan,
  //         e,
  //       ],
  //     });
  //     setModPenyampaian([...modPenyampaian, e]);
  //   }
  // };

  const eventModeChecker = (e) => {
    if (modPenyampaian.includes(e)) {
      modPenyampaian.splice(modPenyampaian.indexOf(e), 1);
      return;
    }
    if (!modPenyampaian.includes(e)) {
      setModPenyampaian([...modPenyampaian, e]);
    }
  };

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
                      readOnly={true}
                      value={editedEntity.gred}
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
                    Role{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
                  <select
                    readOnly={true}
                    value={editedEntity.role}
                    className='border-2'
                    onChange={(e) => (currentRole.current = e.target.value)}
                  >
                    <option value=''>Pilih Role</option>
                    <option value='admin'>Pentadbir Klinik</option>
                    <option value='umum'>Pengguna</option>
                  </select>
                </div>
                <p>CSCSP Verified</p>
                <div className='grid grid-cols-2'>
                  <label htmlFor='cscspYes'>Mempunyai Sijil CSCSP</label>
                  <input
                    checked={statusCscsp === true ? true : false}
                    type='radio'
                    name='statusAktif'
                    value='true'
                    onChange={(e) => {
                      // setEditedEntity({
                      //   ...editedEntity,
                      //   cscspVerified: e.target.value,
                      // });
                      setStatusCscsp(true);
                    }}
                  />
                  <label htmlFor='cscspNo'>Tidak Mempunyai Sijil CSCSP</label>
                  <input
                    checked={statusCscsp === false ? true : false}
                    type='radio'
                    name='statusTidakAktif'
                    value='false'
                    onChange={(e) => {
                      // setEditedEntity({
                      //   ...editedEntity,
                      //   cscspVerified: e.target.value,
                      // });
                      setStatusCscsp(false);
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
                <p>
                  Nama {Dictionary[FType]}: {editedEntity.nama}{' '}
                </p>
                <p>Jenis Fasiliti: {editedEntity.jenisFasiliti}</p>
                <p>Enrolmen: </p>
                <div className='grid grid-gap-1'>
                  <input
                    autoFocus
                    type='text'
                    className='border-2'
                    value={editedEntity.enrolmenTastad}
                    onChange={(e) => {
                      currentEnrolment.current = e.target.value;
                      setEditedEntity({
                        ...editedEntity,
                        enrolmenTastad: e.target.value,
                      });
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
                      Tarikh Program Komuniti{' '}
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    {/* <input
                      readOnly
                      className='border-2'
                      type='date'
                      name='tarikh'
                      id='tarikh'
                      value={editedEntity.tarikh}
                    /> */}
                    <StartDate />
                    <EndDate />
                    <p>
                      Nama Program Komuniti
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <div className='grid gap-1'>
                      <input
                        disabled={true}
                        type='text'
                        name='jenisEvent'
                        id='jenisEvent'
                        readOnly
                        className='border-2 w-full overflow-x-hidden'
                        value={Dictionary[editedEntity.jenisEvent]}
                      />
                      {/* <select
                        disabled={true}
                        readOnly
                        className='border-2 w-full overflow-x-hidden'
                        value={editedEntity.jenisEvent}
                        // onChange={(e) => {
                        //   currentJenisEvent.current = e.target.value;
                        //   setEditedEntity({
                        //     ...editedEntity,
                        //     jenisEvent: e.target.value,
                        //   });
                        // }}
                        name='jenisEvent'
                        id='jenisEvent'
                      >
                        <option value=''>Jenis Program / Aktiviti</option>
                        <option value='projek-komuniti'>Projek Komuniti</option>
                        <option value='ppkps'>
                          Program Pemasyarakatan Perkhidmatan Klinik Pergigian
                          Sekolah
                        </option>
                        <option value='oap'>
                          Program Orang Asli dan Penan
                        </option>
                        <option value='pps20'>
                          program pergigian sekolah sesi 2022/2023
                        </option>
                      </select> */}
                    </div>
                    <p className='mt-3 font-semibold'>
                      Mod Penyampaian Perkhidmatan
                    </p>
                    <div className='grid grid-cols-2 gap-1'>
                      <label htmlFor='modPpb'>Pasukan Pergigian Bergerak</label>
                      <input
                        type='checkbox'
                        name='mod'
                        checked={editedEntity.modPenyampaianPerkhidmatan.includes(
                          'ppb'
                        )}
                        onChange={(e) => {
                          eventModeChecker(e.target.value);
                        }}
                      />
                      <label htmlFor='modKpb'>Klinik Pergigian Bergerak</label>
                      <input
                        type='checkbox'
                        name='mod'
                        checked={editedEntity.modPenyampaianPerkhidmatan.includes(
                          'kpb'
                        )}
                        onChange={(e) => {
                          eventModeChecker(e.target.value);
                        }}
                      />
                      <label htmlFor='modKpb'>Makmal Pergigian Bergerak</label>
                      <input
                        type='checkbox'
                        name='mod'
                        checked={editedEntity.modPenyampaianPerkhidmatan.includes(
                          'mpb'
                        )}
                        onChange={(e) => {
                          eventModeChecker(e.target.value);
                        }}
                      />
                    </div>
                    <p>
                      Nama Program Komuniti
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
      {(FType === 'pp' || FType === 'jp') && (
        <ConfirmModalForData callbackFunction={handleSubmit} func='edit'>
          {(confirm) => <Pegawai confirm={confirm} />}
        </ConfirmModalForData>
      )}
      {FType === 'tastad' && (
        <ConfirmModalForData callbackFunction={handleSubmit} func='edit'>
          {(confirm) => <Facility confirm={confirm} />}
        </ConfirmModalForData>
      )}
      {FType === 'program' && (
        <ConfirmModalForData callbackFunction={handleSubmit} func='edit'>
          {(confirm) => <Event confirm={confirm} />}
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
  const { toast, deleteData, deleteDataForKp } = useGlobalAdminAppContext();
  const [deletingData, setDeletingData] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (FType === 'program') {
      deleteDataForKp(FType, id).then((res) => {
        if (res.status === 200) {
          toast.info(`Data berjaya dipadam`);
          setShowDeleteModal(false);
          setDeletingData(false);
          setReload(!reload);
          return;
        }
        if (res.response.status !== 200) {
          toast.error(
            `Data tidak berjaya dipadam. Anda perlu memindah ${res.response.data} ke KP lain sebelum menghapus KP sekarang`
          );
          setShowDeleteModal(false);
          setDeletingData(false);
        }
      });
    }
    if (FType !== 'program') {
      deleteData(FType, id).then((res) => {
        if (res.status === 200) {
          toast.info(`Data berjaya dipadam`);
          setShowDeleteModal(false);
          setDeletingData(false);
          setReload(!reload);
          return;
        }
        if (res.response.status !== 200) {
          toast.error(
            `Data tidak berjaya dipadam. Anda perlu memindah ${res.response.data} ke KP lain sebelum menghapus KP sekarang`
          );
          setShowDeleteModal(false);
          setDeletingData(false);
        }
      });
    }
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

export { AddModal, AddModalForKp, EditModal, EditModalForKp, DeleteModal };
