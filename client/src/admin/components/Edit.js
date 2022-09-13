import { useGlobalAdminAppContext } from '../context/adminAppContext';
import { useEffect, useRef, useState } from 'react';
import { Ring } from 'react-awesome-spinners';
import { RiCloseLine } from 'react-icons/ri';
import styles from '../Modal.module.css';

const Modal = ({ setShowEditModal, id, FType }) => {
  const { Dictionary, toast, readOneData, readKpData, updateData } =
    useGlobalAdminAppContext();

  const currentKp = useRef();
  const currentName = useRef();
  const currentStatusPerkhidmatan = useRef();
  const currentGred = useRef();
  const currentRole = useRef();
  const currentRisiko = useRef();
  const [editedEntity, setEditedEntity] = useState([]);
  const [klinik, setKlinik] = useState([]);
  const [loading, setLoading] = useState(true);

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
    e.preventDefault();
    let Data = {};
    Data = {
      ...Data,
      // nama: currentName.current,
      handler: currentKp.current,
    };
    if (FType === 'pp' || FType === 'jp') {
      Data = {
        // nama: currentName.current,
        gred: currentGred.current,
        kpSkrg: currentKp.current,
        role: currentRole.current,
      };
    }
    // if (FType === 'jp') {
    //   Data = {
    //     // nama: currentName.current,
    //     gred: currentGred.current,
    //     kpSkrg: currentKp.current,
    //     role: currentRole.current,
    //   };
    // }
    if (FType === 'kp') {
      if (currentRole.current === '') {
        currentRole.current = 'klinik';
      }
      Data = {
        // nama: currentName.current,
        statusRoleKlinik: currentRole.current,
        statusPerkhidmatan: currentStatusPerkhidmatan.current,
      };
    }
    // if (FType === 'sr' || FType === 'sm') {
    //   Data = {
    //     ...Data,
    //     kodSekolah: currentKodSekolah.current,
    //     risikoSekolahPersis: currentRisiko.current,
    //   };
    // }
    console.log(Data);
    updateData(FType, id, Data).then((res) => {
      console.log(res);
      toast.info(`Data berjaya dikemaskini`);
      setShowEditModal(false);
    });
  };

  function Klinik() {
    return (
      <>
        <form onSubmit={handleSubmit}>
          <div
            className={styles.darkBG}
            onClick={() => setShowEditModal(false)}
          />
          <div className={styles.centered}>
            <div className={styles.modalAdd}>
              <div className={styles.modalHeader}>
                <h5 className={styles.heading}>TAMBAH KLINIK PERGIGIAN</h5>
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
                        required
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
                      <label htmlFor='nama'>KEPP</label>
                      <input
                        type='radio'
                        id='role'
                        name='role'
                        value='KEPP'
                        // onChange={(e) => (currentRole.current = e.target.value)}
                      />
                      <label htmlFor='nama'>UTC</label>
                      <input
                        type='radio'
                        id='role'
                        name='role'
                        value='UTC'
                        // onChange={(e) => (currentRole.current = e.target.value)}
                      />
                      <label htmlFor='nama'>RTC</label>
                      <input
                        type='radio'
                        id='role'
                        name='role'
                        value='RTC'
                        // onChange={(e) => (currentRole.current = e.target.value)}
                      />
                      <label htmlFor='nama'>Visiting</label>
                      <input
                        type='radio'
                        id='role'
                        name='role'
                        value='visiting'
                        // onChange={(e) => (currentRole.current = e.target.value)}
                      />
                    </div>
                    <p>Status Klinik Pergigian</p>
                    <div className='grid grid-cols-2'>
                      <label htmlFor='nama'>Aktif</label>
                      <input
                        defaultChecked={
                          editedEntity.statusPerkhidmatan === 'active'
                            ? true
                            : false
                        }
                        type='checkbox'
                        name='checkbox'
                        value='active'
                        onChange={(e) =>
                          (currentStatusPerkhidmatan.current = e.target.value)
                        }
                      />
                      <label htmlFor='nama'>Tidak Aktif</label>
                      <input
                        defaultChecked={
                          editedEntity.statusPerkhidmatan === 'non-active'
                            ? true
                            : false
                        }
                        type='checkbox'
                        name='checkbox'
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
                    UBAH
                  </button>
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
        {/* <form onSubmit={handleSubmit}>
          <div
            className={styles.darkBG}
            onClick={() => setShowEditModal(false)}
          />
          <div className={styles.centered}>
            <div className={styles.modalAdd}>
              <div className={styles.modalHeader}>
                <h5 className={styles.heading}>TAMBAH KLINIK PERGIGIAN</h5>
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
                    <p>Nama Klinik Pergigian</p>
                    <input
                      className='border-2'
                      defaultValue={editedEntity.nama}
                      type='text'
                      name='Nama'
                      id='nama'
                      // onChange={(e) => (currentName.current = e.target.value)}
                    />
                    <br />
                    <p>Role Klinik Pergigian</p>
                    <div className='items-center'>
                      <input
                        defaultChecked={
                          editedEntity.statusRoleKlinik === 'KEPP'
                            ? true
                            : false
                        }
                        type='radio'
                        id='role'
                        name='role'
                        value='KEPP'
                        onChange={(e) => (currentRole.current = e.target.value)}
                      />
                      KEPP
                      <input
                        defaultChecked={
                          editedEntity.statusRoleKlinik === 'UTC' ? true : false
                        }
                        type='radio'
                        id='role'
                        name='role'
                        value='UTC'
                        onChange={(e) => (currentRole.current = e.target.value)}
                      />
                      UTC
                      <input
                        defaultChecked={
                          editedEntity.statusRoleKlinik === 'RTC' ? true : false
                        }
                        type='radio'
                        id='role'
                        name='role'
                        value='RTC'
                        onChange={(e) => (currentRole.current = e.target.value)}
                      />
                      RTC
                      <input
                        defaultChecked={
                          editedEntity.statusRoleKlinik === 'visiting'
                            ? true
                            : false
                        }
                        type='radio'
                        id='role'
                        name='role'
                        value='visiting'
                        onChange={(e) => (currentRole.current = e.target.value)}
                      />
                      Visiting
                    </div>
                    <br />
                    <p>Status Klinik Pergigian</p>
                    <div className={styles.modalContent}>
                      <input
                        defaultChecked={
                          editedEntity.statusPerkhidmatan === 'active'
                            ? true
                            : false
                        }
                        id='statusPerkhidmatan'
                        name='statusPerkhidmatan'
                        type='radio'
                        value='active'
                        onChange={(e) =>
                          (currentStatusPerkhidmatan.current = e.target.value)
                        }
                      />
                      Aktif
                      <br />
                      <input
                        defaultChecked={
                          editedEntity.statusPerkhidmatan === 'non-active'
                            ? true
                            : false
                        }
                        id='statusPerkhidmatan'
                        name='statusPerkhidmatan'
                        type='radio'
                        value='non-active'
                        onChange={(e) =>
                          (currentStatusPerkhidmatan.current = e.target.value)
                        }
                      />
                      Tidak Aktif
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
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form> */}
      </>
    );
  }

  function Pegawai() {
    return (
      <form onSubmit={handleSubmit}>
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
              <div className='admin-pegawai-handler-container'>
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
                  <div className='grid gap-1'>
                    <p>
                      Gred{' '}
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
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
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <select
                      defaultValue={editedEntity.kpSkrg}
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
                <button className={styles.deleteBtn} type='submit'>
                  TAMBAH
                </button>
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

  function Facility() {
    return (
      <form onSubmit={handleSubmit}>
        <div
          className={styles.darkBG}
          onClick={() => setShowEditModal(false)}
        />
        <div className={styles.centered}>
          <div className={styles.modalEdit}>
            <div className={styles.modalHeader}>
              <h5 className={styles.heading}>MANAGE {Dictionary[FType]} </h5>
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
                  <p>Nama Fasiliti: {editedEntity.nama} </p>
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
                      <option value={k.kp}>{k.kp}</option>
                    ))}
                  </select>
                  {FType !== 'sr' && FType !== 'sm' ? null : (
                    <p>
                      Risiko Sekolah (PERSiS){' '}
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                  )}
                  {FType !== 'sr' && FType !== 'sm' ? null : (
                    <select
                      required
                      className='border-2'
                      onChange={(e) => (currentRisiko.current = e.target.value)}
                    >
                      <option value=''>Pilih Risiko</option>
                      <option value='rendah'>Rendah</option>
                      <option value='tinggi'>Tinggi</option>
                    </select>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.modalActions}>
              <div className={styles.actionsContainer}>
                <button className={styles.deleteBtn} type='submit'>
                  UBAH
                </button>
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
      {FType !== 'pp' && FType !== 'kp' && FType !== 'jp' && <Facility />}
    </>
  );
};

export default Modal;
