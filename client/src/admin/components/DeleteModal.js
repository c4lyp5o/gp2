import React from "react";
import styles from "../Modal.module.css";
import { RiCloseLine } from "react-icons/ri";

const Modal = ({ setIsOpen }) => {
  return (
    <>
      <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
      <div className={styles.centered}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h5 className={styles.heading}>AWAS!</h5>
          </div>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>
          <div className={styles.modalContent}>
            Anda YAKIN untuk menghapus data ini?
          </div>
          <div className={styles.modalActions}>
            <div className={styles.actionsContainer}>
              <button
                className={styles.deleteBtn}
                onClick={() => setIsOpen(false)}
              >
                YA
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setIsOpen(false)}
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
