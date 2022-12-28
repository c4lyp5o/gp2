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
  InputKpAddEvent,
  InputKpEditPegawai,
  InputKpEditFacility,
  InputKpEditEvent,
  InputKpEditEventFromDaerah,
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
    // misc
    statusApdm,
    setAddingData,
    addingData,
    klinik,
    sekolah,
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

const AddModalForKp = ({ setShowAddModal, FType, reload, setReload }) => {
  const { toast, createDataForKp } = useGlobalAdminAppContext();

  const [name, setName] = useState('');
  // event
  const [jenisEvent, setJenisEvent] = useState('');
  const [tempat, setTempat] = useState('');
  //datepicker
  const [loading, setLoading] = useState(true);

  const handleSubmit = async () => {
    let Data = {};
    if (FType === 'program') {
      Data = {
        nama: name,
        jenisEvent: jenisEvent,
        tempat: tempat,
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
  const [startDateDP, setStartDateDP] = useState(null);
  const [endDateDP, setEndDateDP] = useState(null);

  useEffect(() => {
    readOneDataForKp(FType, id).then((res) => {
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
  }, []);

  // reset tarikhEnd if change tarikhStart
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
      Data = {
        // nama: currentName.current,
        createdByKp: kp,
        jenisEvent: editedEntity.jenisEvent,
        enrolmenInstitusi: editedEntity.enrolmenInstitusi,
        penggunaanKpb: editedEntity.penggunaanKpb,
        penggunaanMpb: editedEntity.penggunaanMpb,
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
      }
      if (e.includes('mpb')) {
        reset.penggunaanMpb = 'NOT APPLICABLE';
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
