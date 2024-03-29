import { useState } from 'react';
import { useGlobalAdminAppContext } from '../context/adminAppContext';
import styles from '../Modal.module.css';
import { RiCloseLine } from 'react-icons/ri';

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
      console.log(res);
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

  function BusyButton() {
    return (
      <>
        <button
          type='button'
          class='inline-flex items-center text-center justify-center px-4 py-2 bg-admin3 text-adminWhite rounded-md shadow-xl p-2 hover:bg-admin1 transition-all ease-in-out duration-150 cursor-not-allowed'
          disabled=''
        >
          <svg
            class='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              class='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              stroke-width='4'
            ></circle>
            <path
              class='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            ></path>
          </svg>
          Menghapus Jejakmu...
        </button>
      </>
    );
  }

  function SubmitButtton() {
    return (
      <button
        type='submit'
        onClick={handleSubmit}
        className='capitalize bg-admin3 text-adminWhite rounded-md shadow-xl p-2 hover:bg-admin1 transition-all'
      >
        HAPUS
      </button>
    );
  }

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
              {deletingData ? <BusyButton /> : <SubmitButtton />}
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
