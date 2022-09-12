import { useGlobalAdminAppContext } from '../context/adminAppContext';
import { useEffect, useRef, useState } from 'react';
import { Ring } from 'react-awesome-spinners';
import { RiCloseLine } from 'react-icons/ri';
import styles from '../Modal.module.css';

const Modal = ({ setShowEditModal, id, FType }) => {
  const { toast, readOneData, readKpData, updateData } =
    useGlobalAdminAppContext();

  const currentKp = useRef();
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
    if (FType === 'peg') {
      Data = {
        // nama: currentName.current,
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
        </form>
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
          <div className={styles.modalEdit}>
            <div className={styles.modalHeader}>
              <h5 className={styles.heading}>MANAGE PEGAWAI</h5>
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
                  <p>Nama Pegawai: {editedEntity.nama}</p>
                  <br />
                  <p>
                    Gred{' '}
                    <span className='font-semibold text-lg text-admin3'>*</span>
                  </p>
                  <select
                    required
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
                  <br />
                  <p>
                    Klinik Bertugas{' '}
                    <span className='font-semibold text-lg text-admin3'>*</span>
                  </p>
                  <select
                    required
                    className='border-2'
                    onChange={(e) => {
                      currentKp.current = e.target.value;
                    }}
                  >
                    <option value=''>Pilih Klinik</option>
                    {klinik.map((k, index) => (
                      <option value={k.nama}>{k.nama}</option>
                    ))}
                  </select>
                  <br />
                  <p>
                    Role{' '}
                    <span className='font-semibold text-lg text-admin3'>*</span>
                  </p>
                  <select
                    required
                    className='border-2'
                    onChange={(e) => {
                      currentRole.current = e.target.value;
                    }}
                  >
                    <option value=''>Pilih Role</option>
                    <option>Admin</option>
                    <option>Marhaen</option>
                  </select>
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
              <h5 className={styles.heading}>MANAGE </h5>
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
                    className='border-2'
                    onChange={(e) => (currentKp.current = e.target.value)}
                  >
                    <option value=''>Pilih Klinik Baru..</option>
                    {klinik.map((k) => (
                      <option value={k.nama}>{k.nama}</option>
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
      {FType === 'peg' && <Pegawai />}
      {FType !== 'peg' && FType !== 'kp' && <Facility />}
    </>
  );
};

export default Modal;
