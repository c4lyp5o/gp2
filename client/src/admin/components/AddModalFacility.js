import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { RiCloseLine } from 'react-icons/ri';
import { useGlobalAdminAppContext } from '../context/adminAppContext';
import styles from '../Modal.module.css';

import { getKP, addFacility } from '../context/Helper';

const Modal = ({ setAddOpen, jenisFacility, negeri, daerah }) => {
  const { Dictionary } = useGlobalAdminAppContext();
  const currentName = useRef();
  const currentKodSekolah = useRef();
  const currentKp = useRef();
  const currentKeppStatus = useRef();
  const currentRisiko = useRef();
  const [facility, setFacility] = useState('');
  const [KP, setKP] = useState([]);
  const [sekolah, setSekolah] = useState([]);
  const [currKp, setCurrKp] = useState('');

  const selectChangeKp = (event) => {
    const value = event.target.value;
    setCurrKp(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await addFacility(
      {
        nama: currentName.current,
        kodSekolah: currentKodSekolah.current,
        negeri: negeri,
        daerah: daerah,
        handler: currentKp.current,
        jenisFasiliti: jenisFacility,
        keppStatus: currentKeppStatus.current,
        risikoSekolahPersis: currentRisiko.current,
        // nama: facility,
        // kp: currKp,
        // jenisFacility: jenisFacility,
      },
      setAddOpen
    );
    console.log(response);
    window.location.reload();
  };

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
    getKP().then((res) => {
      console.log(res);
      setKP(res.data);
    });
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className={styles.darkBG} onClick={() => setAddOpen(false)} />
        <div className={styles.centered}>
          <div className={styles.modalAdd}>
            <div className={styles.modalHeader}>
              <h5 className={styles.heading}>Tambah {jenisFacility}</h5>
            </div>
            <span className={styles.closeBtn} onClick={() => setAddOpen(false)}>
              <RiCloseLine style={{ marginBottom: '-3px' }} />
            </span>
            <div className={styles.modalContent}>
              <div className='admin-pegawai-handler-container'>
                <div className='admin-pegawai-handler-input'>
                  <p>
                    Nama {Dictionary[jenisFacility]}{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
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
                  {KP.map((k, index) => (
                    <option value={k.nama}>{k.nama}</option>
                  ))}
                </select>
                {jenisFacility !== 'sekolah-rendah' &&
                jenisFacility !== 'sekolah-menengah' ? null : (
                  <p>
                    Risiko Sekolah (PERSiS){' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
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
                  onClick={() => setAddOpen(false)}
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
};

export default Modal;
