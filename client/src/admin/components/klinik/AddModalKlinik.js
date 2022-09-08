import { useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import styles from '../../Modal.module.css';

import { addKp } from '../../context/Helper';

const Modal = ({ setAddOpen, daerah, negeri }) => {
  const [newKp, setnewKp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(newKp);
    await addKp(newKp);
    setAddOpen(false);
    window.location.reload();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className={styles.darkBG} onClick={() => setAddOpen(false)} />
        <div className={styles.centered}>
          <div className={styles.modalAdd}>
            <div className={styles.modalHeader}>
              <h5 className={styles.heading}>TAMBAH KLINIK PERGIGIAN</h5>
            </div>
            <button
              className={styles.closeBtn}
              onClick={() => setAddOpen(false)}
            >
              <RiCloseLine style={{ marginBottom: '-3px' }} />
            </button>
            <div className={styles.modalContent}>
              <div className='admin-pegawai-handler-container'>
                <div className='admin-pegawai-handler-input'>
                  <p>Nama Klinik Pergigian</p>
                  <input
                    className='border-2'
                    type='text'
                    name='Nama'
                    id='nama'
                    onChange={(e) => setnewKp(e.target.value)}
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
                    <input type='checkbox' name='checkbox' value='nonactive' />
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
                <button
                  className={styles.cancelBtn}
                  onClick={() => setAddOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Modal;
