import { useGlobalAdminAppContext } from '../context/adminAppContext';
import { useEffect, useRef, useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import styles from '../Modal.module.css';

import LoadingScreen from './Loading';
import Confirmation from './Confirmation';
import BusyButton from './BusyButton';
import SubmitButtton from './SubmitButton';

const Modal = ({ setShowEditModal, id, FType, reload, setReload }) => {
  const { Dictionary, toast, readOneData, readKpData, updateData } =
    useGlobalAdminAppContext();

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

  useEffect(() => {
    readKpData().then((res) => {
      console.log(res);
      setKlinik(res.data);
    });
    readOneData(FType, id).then((res) => {
      console.log(res);
      setEditedEntity(res.data);
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
    if (FType === 'pp' || FType === 'jp') {
      Data = {
        // nama: currentName.current,
        email: currentEmail.current,
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
        // nama: currentName.current,
        statusRoleKlinik: currentRole.current,
        statusPerkhidmatan: editedEntity.statusPerkhidmatan,
      };
    }
    if (FType === 'sr' || FType === 'sm') {
      Data = {
        ...Data,
        risikoSekolahPersis: currentRisiko.current,
        statusPerkhidmatan: editedEntity.statusPerkhidmatan,
      };
    }
    console.log(Data);
    updateData(FType, id, Data).then((res) => {
      console.log(res);
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
                        defaultValue={editedEntity.kp}
                        className='border-2'
                        type='text'
                        name='nama'
                        id='nama'
                        onChange={(e) => (currentName.current = e.target.value)}
                      />
                      <label htmlFor='nama'>Kod Fasiliti</label>
                      <input
                        readOnly={true}
                        defaultValue={editedEntity.kodFasiliti}
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
                        checked={editedEntity.role === 'kepp'}
                        type='radio'
                        id='role'
                        name='role'
                        value='kepp'
                        // onChange={(e) => (currentRole.current = e.target.value)}
                      />
                      <label htmlFor='role'>UTC</label>
                      <input
                        checked={editedEntity.role === 'utc'}
                        type='radio'
                        id='role'
                        name='role'
                        value='utc'
                        // onChange={(e) => (currentRole.current = e.target.value)}
                      />
                      <label htmlFor='role'>RTC</label>
                      <input
                        checked={editedEntity.role === 'rtc'}
                        type='radio'
                        id='role'
                        name='role'
                        value='rtc'
                        // onChange={(e) => (currentRole.current = e.target.value)}
                      />
                      <label htmlFor='role'>Visiting</label>
                      <input
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
                          required
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
                          console.log('act');
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
                          console.log('non');
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
                    <SubmitButtton func='edit' />
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
                    required
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
                <SubmitButtton func='edit' />
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
                      console.log('act');
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
                      console.log('non');
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
                  <SubmitButtton func='edit' />
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

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {FType === 'kp' && (
        <Confirmation callbackFunction={handleSubmit} func='edit'>
          {(confirm) => <Klinik confirm={confirm} />}
        </Confirmation>
      )}
      {(FType === 'pp' || FType === 'jp') && (
        <Confirmation callbackFunction={handleSubmit} func='edit'>
          {(confirm) => <Pegawai confirm={confirm} />}
        </Confirmation>
      )}
      {FType !== 'pp' && FType !== 'kp' && FType !== 'jp' && (
        <Confirmation callbackFunction={handleSubmit} func='edit'>
          {(confirm) => <Facility confirm={confirm} />}
        </Confirmation>
      )}
    </>
  );
};

export default Modal;
