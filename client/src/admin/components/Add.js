import { useGlobalAdminAppContext } from '../context/adminAppContext';
import { useRef, useEffect, useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { Ring } from 'react-awesome-spinners';
import axios from 'axios';
// import { useToast } from 'react-toastify';
import styles from '../Modal.module.css';

const Modal = ({ setShowAddModal, FType, daerah }) => {
  const { Dictionary, getTokenized } = useGlobalAdminAppContext();

  const currentName = useRef();
  const currentKodSekolah = useRef();
  const currentKp = useRef();
  const currentGred = useRef();
  const currentRole = useRef();
  const currentKeppStatus = useRef();
  const currentRisiko = useRef();
  const [klinik, setKlinik] = useState([]);
  const [loading, setLoading] = useState(true);
  //   const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let Data = {};
    Data = {
      ...Data,
      nama: currentName.current,
      handler: currentKp.current,
    };
    if (FType === 'peg') {
      Data = {
        nama: currentName.current,
        gred: currentGred.current,
        kpSkrg: currentKp.current,
        role: currentRole.current,
      };
    }
    if (FType === 'kp') {
      Data = { nama: currentName.current };
    }
    if (FType === 'sr' || FType === 'sm') {
      Data = {
        ...Data,
        kodSekolah: currentKodSekolah.current,
        risikoSekolahPersis: currentRisiko.current,
      };
    }
    const token = getTokenized();
    console.log(Data);
    const res = await axios.post(`/api/v1/superadmin/newroute`, {
      Fn: 'create',
      FType,
      Data,
      token,
    });
    console.log(res);
    // toast.info(`Data berjaya ditambah`, {
    //   position: 'top-right',
    //   autoClose: 5000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   progress: undefined,
    // });
    setShowAddModal(false);
  };

  const [sekolah, setSekolah] = useState([]);

  useEffect(() => {
    const getSR = () => {
      try {
        axios.get('https://erkm.calypsocloud.one/data').then((res) => {
          if (FType === 'sr') {
            setSekolah(res.data.sekolahRendah);
            return;
          }
          if (FType === 'sm') {
            setSekolah(res.data.sekolahMenengah);
            return;
          }
        });
      } catch (error) {
        console.log(error);
      }
    };
    const fetchKlinik = async () => {
      try {
        const response = await fetch(`/api/v1/superadmin/newroute`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 'x-api-key': process.env.REACT_APP_API_KEY,
          },
          body: JSON.stringify({
            token: getTokenized(),
            Fn: 'read',
            FType: 'kp',
          }),
        });
        const json = await response.json();
        setKlinik(json);
      } catch (error) {
        console.log(error);
      }
    };
    if (FType === 'sr' || FType === 'sm') {
      getSR();
    }
    if (FType !== 'kp') {
      fetchKlinik();
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [FType, getTokenized]);

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
                    <p>Nama Klinik Pergigian</p>
                    <input
                      className='border-2'
                      type='text'
                      name='Nama'
                      id='nama'
                      onChange={(e) => (currentName.current = e.target.value)}
                    />
                    <br />
                    <p>Role Klinik Pergigian</p>
                    <div className='flex items-center'>
                      <input
                        className='mr-2'
                        type='checkbox'
                        name='checkbox'
                        value='KEPP'
                      />
                      KEPP
                      <input
                        className='mr-2'
                        type='checkbox'
                        name='checkbox'
                        value='UTC'
                      />
                      UTC
                      <input
                        className='mr-2'
                        type='checkbox'
                        name='checkbox'
                        value='RTC'
                      />
                      RTC
                      <input
                        className='mr-2'
                        type='checkbox'
                        name='checkbox'
                        value='Visiting'
                      />
                      Visiting
                    </div>
                    <br />
                    <p>Status Klinik Pergigian</p>
                    <div className={styles.modalContent}>
                      <input type='checkbox' name='checkbox' value='active' />
                      Aktif
                      <br />
                      <input
                        type='checkbox'
                        name='checkbox'
                        value='nonactive'
                      />
                      Tidak Aktif
                    </div>
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
                      className='border-2'
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
                      {klinik.map((k, index) => (
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
                      <option value='umum'>Umum</option>
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
                  <div className='admin-pegawai-handler-input'>
                    <p>
                      Nama {Dictionary[FType]}{' '}
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    {FType !== 'sr' && FType !== 'sm' ? (
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
                    {klinik.map((k, index) => (
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

  //   if (!loading) {
  //     return (
  //       <div>
  //         <Ring />
  //       </div>
  //     );
  //   }

  //   if (!klinik) {
  //     return <div>Error!</div>;
  //   }

  return (
    <>
      {FType === 'kp' && <AddKlinik />}
      {FType === 'peg' && <AddPegawai />}
      {FType !== 'kp' && FType !== 'peg' && <AddFacility />}
    </>
  );
};

export default Modal;
