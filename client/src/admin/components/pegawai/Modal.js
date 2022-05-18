import React from "react";
import styles from "../../Modal.module.css";
import { RiCloseLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import { getKP, addPp } from "../../controllers/helper";

const Modal = ({ setAddOpen }) => {
  const [newPp, setnewPp] = useState("");
  const [KP, setKP] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(newPp);
    await addPp(newPp);
    setAddOpen(false);
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
            <button
              className={styles.closeBtn}
              onClick={() => setAddOpen(false)}
            >
              <RiCloseLine style={{ marginBottom: "-3px" }} />
            </button>
            <div className={styles.modalContent}>
              <div className="admin-pegawai-handler-container">
                <div className="admin-pegawai-handler-input">
                  <p>Nama Pegawai</p>
                  <input
                    className="border-2"
                    type="text"
                    name="Nama"
                    id="nama"
                    onChange={(e) => setnewPp(e.target.value)}
                  />
                  <br />
                  <p>Gred</p>
                  <input
                    className="border-2"
                    type="text"
                    name="Nama"
                    id="nama"
                    onChange={(e) => setnewPp(e.target.value)}
                  />
                  <br />
                  <p>Klinik Bertugas</p>
                  <select className="border-2">
                    {KP.map((k, index) => (
                      <option>{k.nama}</option>
                    ))}
                  </select>
                  <br />
                  <p>Role</p>
                  <select className="border-2">
                    <option>Admin</option>
                    <option>Marhaen</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={styles.modalActions}>
              <div className={styles.actionsContainer}>
                <button className={styles.deleteBtn} type="submit">
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
