import { useGlobalAdminAppContext } from '../context/adminAppContext';
import { useRef, useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { RiCloseLine } from 'react-icons/ri';
import { Ring } from 'react-awesome-spinners';
import axios from 'axios';
import styles from '../Modal.module.css';

const Modal = ({
  setShowAddModal,
  daerah,
  negeri,
  jenisFacility,
  refetchFacilities,
  refetchOperators,
  toast,
}) => {
  const {
    Dictionary,
    GET_KLINIK_FOR_DAERAH,
    CREATE_OPERATOR,
    CREATE_FACILITY,
  } = useGlobalAdminAppContext();

  const {
    data: klinikData,
    loading: klinikLoading,
    error: klinikError,
  } = useQuery(GET_KLINIK_FOR_DAERAH, {
    variables: { daerah: daerah },
    fetchPolicy: 'no-cache',
  });

  const [createOperator] = useMutation(CREATE_OPERATOR);
  const [createFacility] = useMutation(CREATE_FACILITY);
  const currentName = useRef();
  const currentKodSekolah = useRef();
  const currentKp = useRef();
  const currentGred = useRef();
  const currentRole = useRef();
  const currentKeppStatus = useRef();
  const currentRisiko = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (jenisFacility !== 'pegawai') {
      await createFacility({
        variables: {
          nama: currentName.current,
          kodSekolah: currentKodSekolah.current,
          negeri: negeri,
          daerah: daerah,
          handler: currentKp.current,
          jenisFasiliti: jenisFacility,
          keppStatus: currentKeppStatus.current,
        },
      });
      refetchFacilities();
    }
    if (jenisFacility === 'pegawai') {
      await createOperator({
        variables: {
          nama: currentName.current,
          negeri: negeri,
          daerah: daerah,
          kpSkrg: currentKp.current,
          gred: currentGred.current,
          role: currentRole.current,
        },
      });
      refetchOperators();
    }
    setShowAddModal(false);
    toast.info(`Data berjaya ditambah`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const [sekolah, setSekolah] = useState([]);

  useEffect(() => {
    const getSR = () => {
      try {
        axios.get('https://erkm.calypsocloud.one/data').then((res) => {
          if (jenisFacility === 'sekolah-rendah') {
            setSekolah(res.data.sekolahRendah);
            return;
          }
          if (jenisFacility === 'sekolah-menengah') {
            setSekolah(res.data.sekolahMenengah);
            return;
          }
        });
      } catch (error) {
        console.log(error);
      }
    };
    getSR();
  }, []);

  function AddKlinik() {
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
                    <p>
                      Nama Klinik Pergigian{' '}
                      <span className='font-semibold text-lg text-admin3'>
                        *
                      </span>
                    </p>
                    <input
                      className='border-2'
                      type='text'
                      name='Nama'
                      id='nama'
                      onChange={(e) => (currentName.current = e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className={styles.modalContent}>
                <input
                  type='checkbox'
                  name='checkbox'
                  value='KEPP'
                  onChange={(e) => (currentKeppStatus.current = true)}
                />
                KEPP
                <br />
                <input type='checkbox' name='checkbox' value='UTC' />
                UTC
                <br />
                <input type='checkbox' name='checkbox' value='visiting' />
                Visiting
              </div>
              <div className={styles.modalActions}>
                <div className={styles.actionsContainer}>
                  <button className={styles.deleteBtn} type='submit'>
                    TAMBAH
                  </button>
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

  function AddPegawai() {
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
                <h5 className={styles.heading}>TAMBAH PEGAWAI</h5>
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
                      Nama Pegawai{' '}
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <input
                      required
                      className='border-2 uppercase'
                      placeholder='nama seperti di IC'
                      type='text'
                      name='Nama'
                      id='nama'
                      onChange={(e) => (currentName.current = e.target.value)}
                    />
                    <br />
                    <p>
                      Gred{' '}
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <select
                      required
                      className='border-2'
                      onChange={(e) => (currentGred.current = e.target.value)}
                    >
                      <option value=''>Pilih Klinik</option>
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
                      {klinikData.klinik.map((k, index) => (
                        <option value={k.nama}>{k.nama}</option>
                      ))}
                    </select>
                    <br />
                    <p>
                      Role{' '}
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <select
                      required
                      className='border-2'
                      onChange={(e) => (currentRole.current = e.target.value)}
                    >
                      <option value=''>Pilih Role</option>
                      <option value='admin'>Admin</option>
                      <option value='marhean'>Marhaen</option>
                    </select>
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
                    onClick={() => setShowAddModal(false)(false)}
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

  function AddFacility() {
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
                <h5 className={styles.heading}>
                  Tambah {Dictionary[jenisFacility]}
                </h5>
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
                      Nama {Dictionary[jenisFacility]}{' '}
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    {jenisFacility !== 'sekolah-rendah' &&
                    jenisFacility !== 'sekolah-menengah' ? (
                      <input
                        required
                        className='border-2'
                        type='text'
                        name='nama'
                        id='nama'
                        onChange={(e) => (currentName.current = e.target.value)}
                      />
                    ) : (
                      <select
                        className='border-2'
                        name='kp'
                        onChange={(e) => {
                          currentName.current = e.target.value;
                          const index = e.target.selectedIndex;
                          const el = e.target.childNodes[index];
                          currentKodSekolah.current = el.getAttribute('id');
                        }}
                      >
                        <option value=''>Pilih Sekolah</option>
                        {sekolah
                          .filter((s) => s.daerah === daerah)
                          .map((s, index) => (
                            <option value={s.nama} id={s.kodSekolah}>
                              {s.nama}
                            </option>
                          ))}
                      </select>
                    )}
                  </div>
                  <p>
                    Klinik Bertugas{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
                  <select
                    required
                    className='border-2'
                    onChange={(e) => (currentKp.current = e.target.value)}
                  >
                    <option value=''>Pilih Klinik</option>
                    {klinikData.klinik.map((k, index) => (
                      <option value={k.nama}>{k.nama}</option>
                    ))}
                  </select>
                  {jenisFacility !== 'sekolah-rendah' &&
                  jenisFacility !== 'sekolah-menengah' ? null : (
                    <p>
                      Risiko Sekolah (PERSiS){' '}
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                  )}
                  {jenisFacility !== 'sekolah-rendah' &&
                  jenisFacility !== 'sekolah-menengah' ? null : (
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
              <div className={styles.modalActions}>
                <div className={styles.actionsContainer}>
                  <button className={styles.deleteBtn} type='submit'>
                    TAMBAH
                  </button>
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

  if (klinikLoading) {
    return (
      <div>
        <Ring />
      </div>
    );
  }

  if (klinikError) {
    return <div>Error!</div>;
  }

  return (
    <>
      {jenisFacility === 'klinik' && <AddKlinik />}
      {jenisFacility === 'pegawai' && <AddPegawai />}
      {jenisFacility !== 'klinik' && jenisFacility !== 'pegawai' && (
        <AddFacility />
      )}
    </>
  );
};

export default Modal;
