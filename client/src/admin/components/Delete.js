import { useGlobalAdminAppContext } from '../context/adminAppContext';
import styles from '../Modal.module.css';
import { RiCloseLine } from 'react-icons/ri';

const Modal = ({ FType, setShowDeleteModal, id, deleteCandidate }) => {
  const { toast, deleteData } = useGlobalAdminAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    deleteData(FType, id).then((res) => {
      console.log(res);
      setShowDeleteModal(false);
      toast.info(`Data berjaya dipadam`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
  };

  return (
    <>
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
              <button className={styles.deleteBtn} onClick={handleSubmit}>
                YA
              </button>
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
    </>
  );
};

export default Modal;
