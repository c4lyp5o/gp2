import { useGlobalAdminAppContext } from '../context/adminAppContext';
import { useRef, useEffect, useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import styles from '../Modal.module.css';

import { Loading } from './Screens';
import {
  InputKlinik,
  InputPegawai,
  InputFacility,
  InputEvent,
  InputEditKlinik,
  InputEditPegawai,
  InputEditFacility,
  InputEditEvent,
  InputKpEditPegawai,
  InputKpEditFacility,
  InputKpEditEvent,
  InputKpEditInstitusi,
  InputKpEditKPBMPB,
} from './Inputs';
import { ConfirmModalForData } from './superadmin/Confirmation';
import { SubmitButton, BusyButton } from './Buttons';

const AddModal = ({
  setShowAddModal,
  FType,
  negeri,
  daerah,
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
    EmailValidator,
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
      if (!EmailValidator(email)) {
        toast.error('Email tidak sah');
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
        // modPenyampaianPerkhidmatan: modPenyampaian,
        // tarikhStart,
        // tarikhEnd,
        tempat,
        assignedByDaerah: true,
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
        roleMediaSosialKlinik: currentRoleMediaSosialKlinik.current.checked,
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
        roleMediaSosialKlinik: currentRoleMediaSosialKlinik.current.checked,
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
  }, [FType]);

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
    currentRolePromosiKlinik,
    currentRoleMediaSosialKlinik,
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

const EditModal = ({ setShowEditModal, FType, id, reload, setReload }) => {
  const { toast, readData, readOneData, updateData } =
    useGlobalAdminAppContext();

  const [editedEntity, setEditedEntity] = useState([]);
  const currentRolePromosiKlinik = useRef();
  const currentRoleMediaSosialKlinik = useRef();

  const [klinik, setKlinik] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setEditedEntity(res.data);
      });
    }
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleSubmit = async (e) => {
    let Data = {};
    Data = {
      ...Data,
      // nama: currentName.current,
      handler: editedEntity.handler,
      kodFasilitiHandler: editedEntity.kodFasilitiHandler,
      statusPerkhidmatan: editedEntity.statusPerkhidmatan,
    };
    if (FType === 'pp' || FType === 'jp') {
      Data = {
        // nama: currentName.current,
        email: editedEntity.email,
        gred: editedEntity.gred,
        kpSkrg: editedEntity.kpSkrg,
        kodFasiliti: editedEntity.kodFasiliti,
        role: editedEntity.role,
        rolePromosiKlinik: currentRolePromosiKlinik.current.checked,
        roleMediaSosialKlinik: currentRoleMediaSosialKlinik.current.checked,
      };
    }
    if (FType === 'kp') {
      // if (currentRole.current === '') {
      //   currentRole.current = 'klinik';
      // }
      Data = {
        // nama: currentName.current,
        // statusRoleKlinik: currentRole.current,
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
        risikoSekolahPersis: editedEntity.risikoSekolahPersis,
        statusPerkhidmatan: editedEntity.statusPerkhidmatan,
      };
    }
    if (FType === 'program') {
      Data = {
        jenisEvent: editedEntity.jenisEvent,
        kategoriInstitusi: editedEntity.kategoriInstitusi,
        nama: editedEntity.nama,
        tempat: editedEntity.tempat,
        createdByKp: editedEntity.createdByKp,
        createdByKodFasiliti: editedEntity.createdByKodFasiliti,
      };
    }
    updateData(FType, id, Data).then((res) => {
      console.log(res.data);
      toast.info(`Data berjaya dikemaskini`);
      setShowEditModal(false);
      setReload(!reload);
    });
  };

  const props = {
    setEditedEntity,
    editedEntity,
    currentRoleMediaSosialKlinik,
    currentRolePromosiKlinik,
    //
    klinik,
    setShowEditModal,
    FType,
    handleSubmit,
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {FType === 'kp' && (
        <ConfirmModalForData callbackFunction={handleSubmit} func='edit'>
          {(confirm) => <InputEditKlinik {...props} confirm={confirm} />}
        </ConfirmModalForData>
      )}
      {(FType === 'pp' || FType === 'jp') && (
        <ConfirmModalForData callbackFunction={handleSubmit} func='edit'>
          {(confirm) => <InputEditPegawai {...props} confirm={confirm} />}
        </ConfirmModalForData>
      )}
      {FType !== 'pp' &&
        FType !== 'kp' &&
        FType !== 'jp' &&
        FType !== 'program' && (
          <ConfirmModalForData callbackFunction={handleSubmit} func='edit'>
            {(confirm) => <InputEditFacility {...props} confirm={confirm} />}
          </ConfirmModalForData>
        )}
      {FType === 'program' && (
        <ConfirmModalForData callbackFunction={handleSubmit} func='edit'>
          {(confirm) => <InputEditEvent {...props} confirm={confirm} />}
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
  const { toast, readOneDataForKp, updateDataForKp } =
    useGlobalAdminAppContext();

  const [editedEntity, setEditedEntity] = useState([]);
  const [loading, setLoading] = useState(true);

  //datepicker
  const [startDateDP, setStartDateDP] = useState(new Date());
  const [endDateDP, setEndDateDP] = useState(new Date());

  useEffect(() => {
    readOneDataForKp(FType, id).then((res) => {
      setEditedEntity(res.data);
      setStartDateDP(new Date(res.data.tarikhStart));
      setEndDateDP(new Date(res.data.tarikhEnd));
    });
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleSubmit = async (e) => {
    if (
      editedEntity.enrolmentTastad === '' ||
      editedEntity.enrolmentTastad === 'NOT APPLICABLE'
    ) {
      toast.error(`Sila masukkan enrolment`);
      return;
    }
    if (
      editedEntity.enrolmenInstitusi === '' ||
      editedEntity.enrolmenInstitusi === 'NOT APPLICABLE'
    ) {
      toast.error(`Sila masukkan enrolment`);
      return;
    }
    let Data = {};
    // Data = {
    //   ...Data,
    //   nama: currentName.current,
    //   handler: currentKp.current,
    // };
    if (FType === 'program') {
      Data = {
        // nama: currentName.current,
        createdByKp: kp,
        jenisEvent: editedEntity.jenisEvent,
        modPenyampaianPerkhidmatan: editedEntity.modPenyampaianPerkhidmatan,
        tarikhStart: editedEntity.tarikhStart,
        tarikhEnd: editedEntity.tarikhEnd,
        tempat: editedEntity.tempat,
      };
    }
    if (FType === 'pp' || FType === 'jp') {
      Data = {
        // nama: currentName.current,
        // email: editedEntity.email,
        // gred: editedEntity.gred,
        // kpSkrg: editedEntity.kpSkrg,
        // role: editedEntity.role,
        cscspVerified: editedEntity.cscspVerified,
      };
    }
    if (FType === 'tastad') {
      Data = {
        // nama: currentName.current,
        enrolmenTastad: editedEntity.enrolmenTastad,
      };
    }
    if (FType === 'ins') {
      Data = {
        // nama: currentName.current,
        enrolmenInstitusi: editedEntity.enrolmenInstitusi,
      };
    }
    if (FType === 'kpb' || FType === 'mpb') {
      Data = {
        // nama: currentName.current,
        jumlahHariBeroperasi: editedEntity.jumlahHariBeroperasi,
        jumlahPesakitBaru: editedEntity.jumlahPesakitBaru,
        jumlahPesakitUlangan: editedEntity.jumlahPesakitUlangan,
      };
    }
    console.log(Data);
    updateDataForKp(FType, id, Data).then((res) => {
      toast.info(`Data berjaya dikemaskini`);
      setShowEditModal(false);
      setReload(!reload);
    });
  };

  const eventModeChecker = (e) => {
    console.log(e);
    if (editedEntity.modPenyampaianPerkhidmatan.includes(e)) {
      setEditedEntity({
        ...editedEntity,
        modPenyampaianPerkhidmatan:
          editedEntity.modPenyampaianPerkhidmatan.filter((item) => item !== e),
      });
      return;
    }
    if (!editedEntity.modPenyampaianPerkhidmatan.includes(e)) {
      setEditedEntity({
        ...editedEntity,
        modPenyampaianPerkhidmatan: [
          ...editedEntity.modPenyampaianPerkhidmatan,
          e,
        ],
      });
    }
  };

  const props = {
    setEditedEntity,
    editedEntity,
    setStartDateDP,
    startDateDP,
    setEndDateDP,
    endDateDP,
    //
    setShowEditModal,
    FType,
    eventModeChecker,
    handleSubmit,
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {(FType === 'pp' || FType === 'jp') && (
        <ConfirmModalForData callbackFunction={handleSubmit} func='edit'>
          {(confirm) => <InputKpEditPegawai {...props} confirm={confirm} />}
        </ConfirmModalForData>
      )}
      {FType === 'tastad' && (
        <ConfirmModalForData callbackFunction={handleSubmit} func='edit'>
          {(confirm) => <InputKpEditFacility {...props} confirm={confirm} />}
        </ConfirmModalForData>
      )}
      {FType === 'program' && (
        <ConfirmModalForData callbackFunction={handleSubmit} func='edit'>
          {(confirm) => <InputKpEditEvent {...props} confirm={confirm} />}
        </ConfirmModalForData>
      )}
      {FType === 'ins' && (
        <ConfirmModalForData callbackFunction={handleSubmit} func='edit'>
          {(confirm) => <InputKpEditInstitusi {...props} confirm={confirm} />}
        </ConfirmModalForData>
      )}
      {(FType === 'kpb' || FType === 'mpb') && (
        <ConfirmModalForData callbackFunction={handleSubmit} func='edit'>
          {(confirm) => <InputKpEditKPBMPB {...props} confirm={confirm} />}
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
