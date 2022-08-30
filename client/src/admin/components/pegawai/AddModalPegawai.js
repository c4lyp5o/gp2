import { useState, useEffect, useRef } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import styles from '../../Modal.module.css';

import { getKP, addPp } from '../../context/Helper';

const Modal = ({ setAddOpen, negeri, daerah }) => {
  const currentKp = useRef();
  const currentGred = useRef();
  const currentRole = useRef();
  const currentName = useRef();
  const [KP, setKP] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await addPp(
      {
        nama: currentName.current,
        negeri: negeri,
        daerah: daerah,
        kpSkrg: currentKp.current,
        gred: currentGred.current,
        role: currentRole.current,
      },
      setAddOpen
    );
    console.log(response);
    window.location.reload();
  };

  useEffect(() => {
    getKP().then((res) => {
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
              <h5 className={styles.heading}>TAMBAH PEGAWAI</h5>
            </div>
            <span className={styles.closeBtn} onClick={() => setAddOpen(false)}>
              <RiCloseLine style={{ marginBottom: '-3px' }} />
            </span>
            <div className={styles.modalContent}>
              <div className='admin-pegawai-handler-container'>
                <div className='admin-pegawai-handler-input'>
                  <p>
                    Nama Pegawai{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
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
                    <span className='font-semibold text-lg text-user6'>*</span>
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
                  <br />
                  <p>
                    Role{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
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
                  onClick={() => setAddOpen(false)(false)}
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
