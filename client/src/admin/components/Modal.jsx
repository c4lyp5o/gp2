import { useGlobalAdminAppContext } from '../context/adminAppContext';
import { useRef, useEffect, useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import styles from '../Modal.module.css';

import { Loading } from './Screens';
import {
  InputKlinik,
  InputKkiakd,
  InputPegawai,
  InputFacility,
  InputEvent,
  InputEditKlinik,
  InputEditKkiakd,
  InputEditPegawai,
  InputEditFacility,
  InputEditEvent,
  InputKpAddEvent,
  InputKpEditPegawai,
  InputKpEditFacility,
  InputKpEditEvent,
  InputKpEditEventFromDaerah,
  InputKpEditKPBMPB,
} from './Inputs';
import { ConfirmModalForData } from './Confirmation';
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
    // pingMOEISServer,
    readSekolahData,
    readFasilitiData,
    readKkiaData,
    DictionaryHurufNegeri,
    EmailValidator,
  } = useGlobalAdminAppContext();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [statusPerkhidmatan, setStatusPerkhidmatan] = useState('');
  const [kp, setKp] = useState('');
  const [kodFasiliti, setKodFasiliti] = useState('');
  const [kodKkiaKd, setKodKkiaKd] = useState('');
  const [regNumber, setRegNumber] = useState();
  const [gred, setGred] = useState('');
  const [role, setRole] = useState('');
  const currentRolePromosiKlinik = useRef();
  const currentRoleMediaSosialKlinik = useRef();
  const [risiko, setRisiko] = useState('');
  // institusi
  const [kategoriInstitusi, setKategoriInstitusi] = useState('');
  // taska
  const [kodTastadTengah, setKodTastadTengah] = useState('');
  const [kodTastadHujung, setKodTastadHujung] = useState('');
  const [alamatTastad, setAlamatTastad] = useState('');
  const [enrolmenTastad, setEnrolmenTastad] = useState('');
  const [govKe, setGovKe] = useState('');
  // sekolah
  const [idInstitusi, setIdInstitusi] = useState('');
  const [kodSekolah, setKodSekolah] = useState('');
  const [jenisPerkhidmatanSekolah, setJenisPerkhidmatanSekolah] = useState('');
  // kpb mpb
  const [subJenisKPBMPB, setSubJenisKPBMPB] = useState('');
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
  // MOEIS
  const [isLoadingMOEIS, setIsLoadingMOEIS] = useState(true);
  const [statusMOEIS, setStatusMOEIS] = useState(false);
  // data
  const [klinik, setKlinik] = useState([]);
  const [kkia, setKkia] = useState([]);
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
  // sekolah
  const [filteredSekolah, setFilteredSekolah] = useState([]);

  const handleSubmit = async () => {
    setAddingData(true);
    switch (FType) {
      case 'pp':
      case 'jp':
        if (
          !carianNama ||
          noPpJp === 'Tiada pegawai dijumpai' ||
          noPpJp === 'Tiada juruterapi pergigian dijumpai'
        ) {
          toast.error('Tiada nama');
          setAddingData(false);
          return;
        }
        if (!regNumber) {
          toast.error('Klik pada butang cari');
          setAddingData(false);
          return;
        }
        if (!EmailValidator(email)) {
          toast.error('Email tidak sah');
          setAddingData(false);
          return;
        }
        break;
      case 'sr':
      case 'sm':
        if (!carianNama) {
          toast.error('Tiada nama sekolah');
          setAddingData(false);
          return;
        }
        if (!kodSekolah) {
          toast.error('Klik pada butang cari');
          setAddingData(false);
          return;
        }
        break;
      default:
        break;
    }
    // start build data
    let Data = {};
    Data = {
      ...Data,
      nama: name,
      handler: kp,
      kodFasilitiHandler: kodFasiliti,
      statusPerkhidmatan: 'active',
    };
    switch (FType) {
      case 'kp':
        Data = {
          kp: name,
          accountType: 'kpUser',
          email: email,
          statusRoleKlinik: role,
          statusPerkhidmatan: statusPerkhidmatan,
          kodFasiliti: kodFasiliti,
        };
        break;
      case 'pp':
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
        break;
      case 'jp':
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
        break;
      case 'kkiakd':
        Data = {
          ...Data,
          kodKkiaKd: kodKkiaKd,
        };
        break;
      case 'taska':
      case 'tadika':
        const kodTastadSebenar = `${FType.substring(0, 3).toUpperCase()}-${
          DictionaryHurufNegeri[negeri]
        }${kodTastadTengah}-${
          govKe === 'Kerajaan' ? 'K' : 'S'
        }${kodTastadHujung}`;
        Data = {
          ...Data,
          kodTastad: kodTastadSebenar,
          alamatTastad: alamatTastad,
          // enrolmenTastad: enrolmenTastad, //enrolmentTastad ditetapkan di Pentadbir Klinik
          govKe: govKe,
        };
        break;
      case 'sr':
      case 'sm':
        Data = {
          ...Data,
          idInstitusi: idInstitusi,
          kodSekolah: kodSekolah,
          risikoSekolahPersis: risiko,
          jenisPerkhidmatanSekolah,
        };
        break;
      case 'kpb':
      case 'mpb':
        const jenisKPBMPBCapitalized = subJenisKPBMPB
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        Data = {
          ...Data,
          subJenisKPBMPB: jenisKPBMPBCapitalized,
        };
        break;
      case 'program':
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
        break;
      default:
        break;
    }
    createData(FType, Data).then((res) => {
      if (res.status === 200) {
        toast.info(`Data berjaya ditambah`);
        setReload(!reload);
      } else {
        if (FType === 'taska' || FType === 'tadika') {
          toast.error(res.response.data.message);
          return;
        } else {
          if (FType === 'kpb' || FType === 'mpb') {
            toast.error(res.response.data.message);
            return;
          }
        }
        toast.error(`Data tidak berjaya ditambah`);
      }
      setShowAddModal(false);
      setAddingData(false);
    });
  };

  useEffect(() => {
    if (FType === 'sr' || FType === 'sm') {
      readSekolahData(FType)
        .then((res) => {
          setStatusMOEIS(true);
          setIsLoadingMOEIS(false);
          setSekolah(res);
        })
        .catch((err) => {
          setStatusMOEIS(false);
          setIsLoadingMOEIS(false);
          console.log(err);
        });
    }
    if (FType === 'kp') {
      readFasilitiData({ negeri, daerah }).then((res) => {
        setKlinik(res.data);
      });
    }
    if (FType === 'kkiakd') {
      readKkiaData({ negeri, daerah }).then((res) => {
        setKkia(res.data);
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
    // from parent
    FType,
    setShowAddModal,
    //
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
    // kkia
    setKodKkiaKd,
    kodKkiaKd,
    // facility
    setIdInstitusi,
    idInstitusi,
    setKodSekolah,
    kodSekolah,
    setJenisPerkhidmatanSekolah,
    jenisPerkhidmatanSekolah,
    setKodTastadTengah,
    kodTastadTengah,
    setKodTastadHujung,
    kodTastadHujung,
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
    setSubJenisKPBMPB,
    subJenisKPBMPB,
    // sekolah
    setFilteredSekolah,
    filteredSekolah,
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
    // misc
    isLoadingMOEIS,
    statusMOEIS,
    setAddingData,
    addingData,
    klinik,
    kkia,
    sekolah,
    negeri,
    handleSubmit,
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
      {FType === 'kkiakd' && (
        <ConfirmModalForData callbackFunction={handleSubmit} func='add'>
          {(confirm) => <InputKkiakd {...props} confirm={confirm} />}
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
        FType !== 'program' &&
        FType !== 'kkiakd' && (
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

const AddModalForKp = ({ setShowAddModal, FType, reload, setReload }) => {
  const { toast, createDataForKp } = useGlobalAdminAppContext();

  const [name, setName] = useState('');
  // event
  const [jenisEvent, setJenisEvent] = useState('');
  const [tempat, setTempat] = useState('');
  //datepicker
  const [loading, setLoading] = useState(true);

  const handleSubmit = async () => {
    setAddingData(true);
    let Data = {};
    if (FType === 'program') {
      Data = {
        nama: name,
        jenisEvent: jenisEvent,
        tempat: tempat,
      };
    }
    createDataForKp(FType, Data).then((res) => {
      if (res.status === 200) {
        toast.info(`Data berjaya ditambah`);
        setReload(!reload);
      } else {
        toast.error(`Data tidak berjaya ditambah`);
      }
      setShowAddModal(false);
    });
  };

  const props = {
    setName,
    name,
    setJenisEvent,
    jenisEvent,
    setTempat,
    tempat,
    //
    setShowAddModal,
    handleSubmit,
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [FType]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {FType === 'program' && (
        <ConfirmModalForData callbackFunction={handleSubmit} func='add'>
          {(confirm) => <InputKpAddEvent {...props} confirm={confirm} />}
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

  const handleSubmit = async () => {
    let Data = {};
    Data = {
      ...Data,
      // nama: currentName.current,
      handler: editedEntity.handler,
      kodFasilitiHandler: editedEntity.kodFasilitiHandler,
      statusPerkhidmatan: editedEntity.statusPerkhidmatan,
    };
    switch (FType) {
      case 'pp':
      case 'jp':
        Data = {
          email: editedEntity.email,
          gred: editedEntity.gred,
          kpSkrg: editedEntity.kpSkrg,
          kodFasiliti: editedEntity.kodFasiliti,
          role: editedEntity.role,
          rolePromosiKlinik: currentRolePromosiKlinik.current.checked,
          roleMediaSosialKlinik: currentRoleMediaSosialKlinik.current.checked,
        };
        break;
      case 'kp':
        Data = {
          statusPerkhidmatan: editedEntity.statusPerkhidmatan,
        };
        break;
      case 'taska':
      case 'tadika':
        Data = {
          govKe: editedEntity.govKe,
          statusPerkhidmatan: editedEntity.statusPerkhidmatan,
        };
        break;
      case 'sr':
      case 'sm':
        Data = {
          risikoSekolahPersis: editedEntity.risikoSekolahPersis,
          jenisPerkhidmatanSekolah: editedEntity.jenisPerkhidmatanSekolah,
          sekolahMmi: editedEntity.sekolahMmi,
          statusFMRSekolah: editedEntity.statusFMRSekolah,
          statusPerkhidmatan: editedEntity.statusPerkhidmatan,
        };
        break;
      case 'program':
        Data = {
          jenisEvent: editedEntity.jenisEvent,
          kategoriInstitusi: editedEntity.kategoriInstitusi,
          nama: editedEntity.nama,
          tempat: editedEntity.tempat,
          createdByKp: editedEntity.createdByKp,
          createdByKodFasiliti: editedEntity.createdByKodFasiliti,
        };
        break;
      default:
        break;
    }
    updateData(FType, id, Data).then((res) => {
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
      {FType === 'kkiakd' && (
        <ConfirmModalForData callbackFunction={handleSubmit} func='add'>
          {(confirm) => <InputEditKkiakd {...props} confirm={confirm} />}
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
        FType !== 'program' &&
        FType !== 'kkiakd' && (
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
  const { toast, readDataForKp, readOneDataForKp, updateDataForKp } =
    useGlobalAdminAppContext();

  const [tempatPenggunaan, setTempatPenggunaan] = useState('');
  const [allKlinik, setAllKlinik] = useState([]);
  const [allKkiaKd, setAllKkiaKd] = useState([]);
  const [allTastad, setAllTastad] = useState([]);
  const [allSR, setAllSR] = useState([]);
  const [allSM, setAllSM] = useState([]);
  const [editedEntity, setEditedEntity] = useState([]);
  const [showSubProgram, setShowSubProgram] = useState(false); // kena pass state showSubProgram yang first dari atas sebab nak catch dalam handleSubmit
  const [loading, setLoading] = useState(true);

  //datepicker
  const [startDateDP, setStartDateDP] = useState(null);
  const [endDateDP, setEndDateDP] = useState(null);

  const init = useRef(false);

  useEffect(() => {
    if (init.current === false) {
      if (FType === 'kpb' || FType === 'mpb') {
        readDataForKp('kpallnegeri').then((res) => {
          setAllKlinik(res.data);
        });
        readDataForKp('kkiakdallnegeri').then((res) => {
          setAllKkiaKd(res.data);
        });
        readDataForKp('tastadallnegeri').then((res) => {
          setAllTastad(res.data);
        });
        readDataForKp('sr').then((res) => {
          setAllSR(res.data);
        });
        readDataForKp('sm').then((res) => {
          setAllSM(res.data);
        });
      }
      readOneDataForKp(FType, id).then((res) => {
        if (FType === 'tastad') {
          // workaround to stick enrolmenTastad with type String. Data enrolmen yang sedia ada dah masuk dalam string dah...
          if (
            res.data.enrolmenTastad === 'NOT APPLICABLE' ||
            res.data.enrolmenTastad === null ||
            res.data.enrolmenTastad === undefined
          ) {
            res.data.enrolmenTastad = 0;
          }
          if (
            res.data.enrolmenKurang4Tahun === 'NOT APPLICABLE' ||
            res.data.enrolmenKurang4Tahun === null ||
            res.data.enrolmenKurang4Tahun === undefined
          ) {
            res.data.enrolmenKurang4Tahun = 0;
          }
          if (
            res.data.enrolmen5Tahun === 'NOT APPLICABLE' ||
            res.data.enrolmen5Tahun === null ||
            res.data.enrolmen5Tahun === undefined
          ) {
            res.data.enrolmen5Tahun = 0;
          }
          if (
            res.data.enrolmen6Tahun === 'NOT APPLICABLE' ||
            res.data.enrolmen6Tahun === null ||
            res.data.enrolmen6Tahun === undefined
          ) {
            res.data.enrolmen6Tahun = 0;
          }
          if (
            res.data.enrolmenMuridBerkeperluanKhas === 'NOT APPLICABLE' ||
            res.data.enrolmenMuridBerkeperluanKhas === null ||
            res.data.enrolmenMuridBerkeperluanKhas === undefined
          ) {
            res.data.enrolmenMuridBerkeperluanKhas = 0;
          }
          if (
            res.data.enrolmenMuridOaPenan === 'NOT APPLICABLE' ||
            res.data.enrolmenMuridOaPenan === null ||
            res.data.enrolmenMuridOaPenan === undefined
          ) {
            res.data.enrolmenMuridOaPenan = 0;
          }
          if (
            res.data.jumlahEngganTasTad === 'NOT APPLICABLE' ||
            res.data.jumlahEngganTasTad === null ||
            res.data.jumlahEngganTasTad === undefined
          ) {
            res.data.jumlahEngganTasTad = 0;
          }
          if (
            res.data.jumlahTidakHadirTasTad === 'NOT APPLICABLE' ||
            res.data.jumlahTidakHadirTasTad === null ||
            res.data.jumlahTidakHadirTasTad === undefined
          ) {
            res.data.jumlahTidakHadirTasTad = 0;
          }
        }
        // console.log(res.data);
        setEditedEntity(res.data);
        res.data.tarikhStart
          ? setStartDateDP(new Date(res.data.tarikhStart))
          : setStartDateDP(null);
        res.data.tarikhEnd
          ? setEndDateDP(new Date(res.data.tarikhEnd))
          : setEndDateDP(null);
      });
      setTimeout(() => {
        setLoading(false);
      }, 500);
      init.current = true;
    }
  }, []);

  // resetting tarikhEnd kalau ubah tarikh start. A MUST TO NOT LET USER PICK tarikhStart LATER THAN tarikhEnd. Yup currently kalau buka kemaskini tarikhEnd tu akan reset kat display. Tapi ni lah cara buat masa ni untuk guard daripada user yang salah masuk tarikhStart terlebih dari tarikhEnd
  useEffect(() => {
    setEditedEntity({ ...props.editedEntity, tarikhEnd: '' });
    setEndDateDP(null);
  }, [editedEntity.tarikhStart]);

  const handleSubmit = async (e) => {
    let Data = {};
    // Data = {
    //   ...Data,
    //   nama: currentName.current,
    //   handler: currentKp.current,
    // };
    if (FType === 'program') {
      if (editedEntity.modPenyampaianPerkhidmatan.includes('kpb')) {
        if (editedEntity.penggunaanKpb === 'NOT APPLICABLE') {
          toast.error('Sila masukkan penggunaan KPB');
          return;
        }
      }
      if (editedEntity.modPenyampaianPerkhidmatan.includes('mpb')) {
        if (editedEntity.penggunaanMpb === 'NOT APPLICABLE') {
          toast.error('Sila masukkan penggunaan MPB');
          return;
        }
      }
      if (showSubProgram) {
        if (
          editedEntity.subProgram.length === 0 ||
          editedEntity.subProgram[0] === 'NOT APPLICABLE' ||
          editedEntity.subProgram[1] === 'NOT APPLICABLE' ||
          editedEntity.subProgram[2] === 'NOT APPLICABLE'
        ) {
          toast.error('Sila masukkan sub program');
          return;
        }
      }
      Data = {
        // nama: currentName.current,
        createdByKp: kp,
        jenisEvent: editedEntity.jenisEvent,
        subProgram: editedEntity.subProgram,
        enrolmenInstitusi: editedEntity.enrolmenInstitusi,
        penggunaanKpb: editedEntity.penggunaanKpb,
        penggunaanKpb2: editedEntity.penggunaanKpb2,
        penggunaanKpb3: editedEntity.penggunaanKpb3,
        penggunaanMpb: editedEntity.penggunaanMpb,
        penggunaanMpb2: editedEntity.penggunaanMpb2,
        penggunaanMpb3: editedEntity.penggunaanMpb3,
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
      if (editedEntity.enrolmenTastad === 0) {
        return toast.error('Jumlah enrolmen taska/tadika tidak boleh 0');
      }
      Data = {
        // nama: currentName.current,
        enrolmenTastad: editedEntity.enrolmenTastad,
        enrolmenKurang4Tahun: editedEntity.enrolmenKurang4Tahun,
        enrolmen5Tahun: editedEntity.enrolmen5Tahun,
        enrolmen6Tahun: editedEntity.enrolmen6Tahun,
        enrolmenMuridBerkeperluanKhas:
          editedEntity.enrolmenMuridBerkeperluanKhas,
        enrolmenMuridOaPenan: editedEntity.enrolmenMuridOaPenan,
        jenisTadikaKerajaan: editedEntity.jenisTadikaKerajaan,
        jumlahEngganTasTad: editedEntity.jumlahEngganTasTad,
        jumlahTidakHadirTasTad: editedEntity.jumlahTidakHadirTasTad,
      };
    }
    if (FType === 'kpb' || FType === 'mpb') {
      Data = {
        // nama: currentName.current,
        // jumlahHariBeroperasi: editedEntity.jumlahHariBeroperasi,
        // jumlahPesakitBaru: editedEntity.jumlahPesakitBaru,
        // jumlahPesakitUlangan: editedEntity.jumlahPesakitUlangan,
        tarikhStart: editedEntity.tarikhStart,
        tarikhEnd: editedEntity.tarikhEnd,
        tempatPenggunaan: tempatPenggunaan,
        klinikBertanggungjawab: editedEntity.handlerKp,
        kodKlinikBertanggungjawab: editedEntity.kodKpHandler,
        kkiaKdBertanggungjawab: editedEntity.handlerKkiaKd,
        kodKkiaKdBertanggungjawab: editedEntity.kodKkiaKdHandler,
        tastadBertanggungjawab: editedEntity.handlerTastad,
        kodTastadBertanggungjawab: editedEntity.kodTastadHandler,
        SRbertanggungjawab: editedEntity.handlerSR,
        SMbertanggungjawab: editedEntity.handlerSM,
        kodSekolahBertanggungjawab: editedEntity.kodSekolahHandler,
      };
    }
    updateDataForKp(FType, id, Data).then(() => {
      toast.info(`Data berjaya dikemaskini`);
      setShowEditModal(false);
      setReload(!reload);
    });
  };

  const eventModeChecker = (e) => {
    if (editedEntity.modPenyampaianPerkhidmatan.includes(e)) {
      let reset = {};
      if (e.includes('kpb')) {
        reset.penggunaanKpb = 'NOT APPLICABLE';
        reset.penggunaanKpb2 = 'NOT APPLICABLE';
        reset.penggunaanKpb3 = 'NOT APPLICABLE';
      }
      if (e.includes('mpb')) {
        reset.penggunaanMpb = 'NOT APPLICABLE';
        reset.penggunaanMpb2 = 'NOT APPLICABLE';
        reset.penggunaanMpb3 = 'NOT APPLICABLE';
      }
      setEditedEntity({
        ...editedEntity,
        ...reset,
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
    showSubProgram,
    setShowSubProgram,
    // ---
    setShowEditModal,
    tempatPenggunaan,
    setTempatPenggunaan,
    allKlinik,
    allKkiaKd,
    allTastad,
    allSR,
    allSM,
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
      {FType === 'program' && !editedEntity.assignedByDaerah && (
        <ConfirmModalForData callbackFunction={handleSubmit} func='edit'>
          {(confirm) => <InputKpEditEvent {...props} confirm={confirm} />}
        </ConfirmModalForData>
      )}
      {FType === 'program' && editedEntity.assignedByDaerah && (
        <ConfirmModalForData callbackFunction={handleSubmit} func='edit'>
          {(confirm) => (
            <InputKpEditEventFromDaerah {...props} confirm={confirm} />
          )}
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
  const { toast, getCurrentUser, deleteData, deleteDataForKp } =
    useGlobalAdminAppContext();
  const [deletingData, setDeletingData] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    getCurrentUser().then((user) => {
      switch (user.data.accountType) {
        case 'kpUser':
          deleteDataForKp(FType, id).then((res) => {
            if (res.status === 200) {
              toast.info(`Data berjaya dipadam`);
              setShowDeleteModal(false);
              setDeletingData(false);
              setReload(!reload);
              return;
            }
            if (res.response.status !== 200) {
              setShowDeleteModal(false);
              setDeletingData(false);
              toast.error(`${res.response.data.msg}`);
            }
          });
          break;
        case 'negeriSuperadmin':
        case 'daerahSuperadmin':
          setDeletingData(true);
          deleteData(FType, id).then((res) => {
            if (res.status === 200) {
              toast.info(`Data berjaya dipadam`);
              setShowDeleteModal(false);
              setDeletingData(false);
              setReload(!reload);
              return;
            }
            if (res.response.status !== 200) {
              switch (FType) {
                case 'program':
                  toast.error(`${res.response.data.msg}`);
                  break;

                case 'sm':
                case 'sr':
                  toast.error(`${res.response.data.msg}`);
                  break;

                case 'kp':
                  toast.error(
                    `Data tidak berjaya dipadam. Anda perlu memindah ${res.response.data} ke KP lain sebelum menghapus KP sekarang`
                  );
                  break;
                default:
                  console.log('Nope');
              }
              setShowDeleteModal(false);
              setDeletingData(false);
            }
          });
          break;
        default:
          break;
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
          <div className={styles.modalDelete}>
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
              Anda YAKIN untuk menghapus{' '}
              <span className='text-xl font-bold text-admin2 mt-2'>
                {deleteCandidate}?
              </span>
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
