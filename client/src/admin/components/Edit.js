import { useGlobalAdminAppContext } from '../context/adminAppContext';
import { useEffect, useRef, useState } from 'react';
import { Ring, Spinner } from 'react-awesome-spinners';
import { RiCloseLine } from 'react-icons/ri';
import styles from '../Modal.module.css';

const Modal = ({ setShowEditModal, id, FType }) => {
  const { Dictionary, getTokenized } = useGlobalAdminAppContext();

  const currentKp = useRef();
  const currentGred = useRef();
  const currentRole = useRef();
  const currentRisiko = useRef();
  const [editedEntity, setEditedEntity] = useState([]);
  const [klinik, setKlinik] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOne = async () => {
      const response = await fetch(`/api/v1/superadmin/newroute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${getTokenized()}`,
        },
        body: JSON.stringify({
          Fn: 'readOne',
          FType: FType,
          Id: id,
          token: getTokenized(),
        }),
      });
      const data = await response.json();
      setEditedEntity(data);
      console.log(data);
    };
    const getKlinik = async () => {
      const response = await fetch(`/api/v1/superadmin/newroute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${getTokenized()}`,
        },
        body: JSON.stringify({
          Fn: 'read',
          FType: 'kp',
          token: getTokenized(),
        }),
      });
      const data = await response.json();
      setKlinik(data);
    };
    getOne().then(() => getKlinik().then(() => setLoading(false)));
  }, [id, FType, getTokenized]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (jenisFacility !== 'pegawai') {
    //   await updateFacility({
    //     variables: {
    //       _id: id,
    //       nama: data.facOrPeg.nama,
    //       negeri: data.facOrPeg.negeri,
    //       daerah: daerah,
    //       handler: currentKp.current,
    //       jenisFasiliti: jenisFacility,
    //       keppStatus: data.facOrPeg.keppStatus,
    //       risikoSekolahPersis: currentRisiko.current,
    //     },
    //   });
    //   refetchFacilities();
    // }
    // if (jenisFacility === 'pegawai') {
    //   await updateOperator({
    //     variables: {
    //       _id: id,
    //       nama: data.facOrPeg.nama,
    //       negeri: data.facOrPeg.negeri,
    //       daerah: data.facOrPeg.daerah,
    //       kpSkrg: currentKp.current,
    //       gred: currentGred.current,
    //       role: currentRole.current,
    //     },
    //   });
    //   refetchOperators();
    // }
    setShowEditModal(false);
    // toast.info(`Data berjaya dikemaskini`, {
    //   position: 'top-right',
    //   autoClose: 5000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   progress: undefined,
    // });
  };

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
        <div className={styles.centered}>
          <div className={styles.modalEdit}>
            <div className={styles.modalHeader}>
              <h5 className={styles.heading}>Loading</h5>
            </div>
            <button className={styles.closeBtn}>
              <RiCloseLine style={{ marginBottom: '-3px' }} />
            </button>
            <div className={styles.modalContent}>
              <div className='admin-pegawai-handler-container'>
                <div className='admin-pegawai-handler-input'>
                  <Ring size={100} />
                </div>
              </div>
            </div>
            <div className={styles.modalActions}>
              <div className={styles.actionsContainer}></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // if (error) {
  //   return <div>Error!</div>;
  // }

  return (
    <>
      {FType !== 'peg' && <Facility />}
      {FType === 'peg' && <Pegawai />}
    </>
  );
};

export default Modal;
