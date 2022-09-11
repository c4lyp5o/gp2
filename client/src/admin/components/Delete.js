import { useGlobalAdminAppContext } from '../context/adminAppContext';
import { Ring } from 'react-awesome-spinners';
import styles from '../Modal.module.css';
import { RiCloseLine } from 'react-icons/ri';

const Modal = ({ FType, setShowDeleteModal, id, deleteCandidate }) => {
  const { getTokenized, toast, main } = useGlobalAdminAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/v1/superadmin/newroute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'x-api-key': process.env.REACT_APP_API_KEY,
      },
      body: JSON.stringify({
        main: main,
        token: getTokenized(),
        FType: FType,
        Fn: 'delete',
        Id: id,
      }),
    });
    const data = await res.json();
    console.log(data);
    toast.info(`Data berjaya dipadam`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setShowDeleteModal(false);
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
