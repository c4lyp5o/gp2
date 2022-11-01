import { useState } from 'react';
import { useGlobalAdminAppContext } from '../context/adminAppContext';
import styles from '../Modal.module.css';
import { RiCloseLine } from 'react-icons/ri';

import BusyButton from './BusyButton';
import SubmitButtton from './SubmitButton';

const Modal = ({
  FType,
  setShowDeleteModal,
  id,
  deleteCandidate,
  reload,
  setReload,
}) => {
  const { toast, deleteData } = useGlobalAdminAppContext();
  const [deletingData, setDeletingData] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    deleteData(FType, id).then((res) => {
      console.log(res.data);
      if (res.status === 200) {
        toast.info(`Data berjaya dipadam`);
        setShowDeleteModal(false);
        setDeletingData(false);
        setReload(!reload);
        return;
      }
      if (res.response.status === 409) {
        toast.error(
          `Data tidak berjaya dipadam. Anda perlu memindah ${res.response.data} ke KP lain sebelum menghapus KP sekarang`
        );
        setShowDeleteModal(false);
        setDeletingData(false);
      }
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div
          className={styles.darkBG}
          onClick={() => setShowDeleteModal(false)}
        />
        <div className={styles.centered}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h5 className={styles.heading}>AWAS!</h5>
            </div>
            <button
              className={styles.closeBtn}
              onClick={() => setShowDeleteModal(false)}
            >
              <RiCloseLine style={{ marginBottom: '-3px' }} />
            </button>
            <div className={styles.modalContent}>
              Anda YAKIN untuk menghapus {deleteCandidate}?
            </div>
            <div className={styles.modalActions}>
              <div className={styles.actionsContainer}>
                {deletingData ? (
                  <BusyButton func='del' />
                ) : (
                  <SubmitButtton func='del' />
                )}
                <button
                  className={styles.cancelBtn}
                  onClick={() => setShowDeleteModal(false)}
                >
                  Tidak
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
