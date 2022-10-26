import { useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';

import styles from '../../../admin/Modal.module.css';

const ConfirmModal = ({ children, data }) => {
  const [open, setOpen] = useState(false);
  const [callback, setCallback] = useState(null);

  const show = (callback) => (event) => {
    event.preventDefault();
    setOpen(true);
    event = {
      ...event,
      target: { ...event.target, value: event.target.value },
    };
    setCallback({
      run: () => callback(event),
    });
  };

  const hide = () => {
    setCallback(null);
    setOpen(false);
  };

  const confirm = () => {
    console.log('confirm');
    callback.run();
    hide();
  };

  return (
    <>
      {children(show)}
      {open && (
        <>
          <div className={styles.darkBG} onClick={hide} />
          <div className={styles.centered}>
            <div className={styles.modalAdd}>
              <div className={styles.modalHeader}>
                <h5 className={styles.heading}>PERHATIAN</h5>
              </div>
              <button className={styles.closeBtn} onClick={hide}>
                <RiCloseLine style={{ marginBottom: '-3px' }} />
              </button>
              <div className={styles.modalContent}>
                <p>Anda YAKIN untuk menambah data?</p>
                <div className='mt-3'>
                  <p>Nama: {data.nama}</p>
                  <p>No. Pengenalan Diri: {data.ic}</p>
                  <p>Tarikh Lahir: {data.tarikhLahir}</p>
                  <p>Jantina: {data.jantina}</p>
                  <p>Kumpulan Etnik: {data.kumpulanEtnik}</p>
                  <p>
                    Alamat: {data.alamat}, {data.daerahAlamat},{' '}
                    {data.poskodAlamat}, {data.negeriAlamat}
                  </p>
                  <p>Ibu Mengandung: {data.ibuMengandung ? 'Ya' : 'Tidak'}</p>
                  <p>Bersekolah: {data.bersekolah ? 'Ya' : 'Tidak'}</p>
                  <p>OKU: {data.oku ? 'Ya' : 'Tidak'}</p>
                  {data.statusPesara ? (
                    <p>Pesara: {data.statusPesara}</p>
                  ) : null}
                  {data.rujukDaripada ? (
                    <p>Rujuk Daripada: {data.rujukDaripada}</p>
                  ) : null}
                  {data.catatan ? <p>Catatan: {data.catatan}</p> : null}
                </div>
              </div>
              <div className={styles.modalActions}>
                <div className={styles.actionsContainer}>
                  <button className={styles.deleteBtn} onClick={confirm}>
                    YA
                  </button>
                  <button className={styles.cancelBtn} onClick={hide}>
                    Tidak
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ConfirmModal;
