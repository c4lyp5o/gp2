import React from "react";
import styles from "../Modal.module.css";
import { RiCloseLine } from "react-icons/ri";

const Modal = ({ setEditOpen }) => {
  return (
    <>
      <div className={styles.darkBG} onClick={() => setEditOpen(false)} />
      <div className={styles.centered}>
        <div className={styles.modalEdit}>
          <div className={styles.modalHeader}>
            <h5 className={styles.heading}>MANAGE TASKA/SEKOLAH/INSTITUSI</h5>
          </div>
          <button
            className={styles.closeBtn}
            onClick={() => setEditOpen(false)}
          >
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>
          <div className={styles.modalContent}>
            <div className="admin-pegawai-handler-container">
              <div className="admin-pegawai-handler-input">
                <p>Nama</p>
                <input className="border-2" type="text" name="Nama" id="nama" />
                <br />
                <br />
                <p>Nama Klinik Pergigian</p>
                <select className="border-2" name="" id="">
                  Sila pilih
                  <option value="">Role</option>
                  <option value="">HeheBoi2</option>
                  <option value="">HeheBoi2</option>
                </select>
              </div>
            </div>
          </div>
          <div className={styles.modalActions}>
            <div className={styles.actionsContainer}>
              <button
                className={styles.deleteBtn}
                onClick={() => setEditOpen(false)}
              >
                Delete
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
