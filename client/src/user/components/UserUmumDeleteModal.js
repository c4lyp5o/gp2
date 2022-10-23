import { RiCloseLine } from 'react-icons/ri';
import styles from '../../admin/Modal.module.css';

export default function DeleteModal({ handleDelete, setModalHapus, id, nama }) {
  // component
  function SubmitButtton() {
    return (
      <button
        type='submit'
        onClick={() => {
          console.log(id);
          handleDelete(id);
        }}
        className='capitalize bg-admin3 text-adminWhite rounded-md shadow-xl p-2 hover:bg-admin1 transition-all'
      >
        HAPUS
      </button>
    );
  }

  return (
    <>
      <div className={styles.darkBG} onClick={() => setModalHapus(false)} />
      <div className={styles.centered}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h5 className={styles.heading}>AWAS!</h5>
          </div>
          <button
            className={styles.closeBtn}
            onClick={() => setModalHapus(false)}
          >
            <RiCloseLine style={{ marginBottom: '-3px' }} />
          </button>
          <div className={styles.modalContent}>
            Anda YAKIN untuk menghapus {nama}?
          </div>
          <div className={styles.modalActions}>
            <div className={styles.actionsContainer}>
              <SubmitButtton />
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setModalHapus(false);
                }}
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
