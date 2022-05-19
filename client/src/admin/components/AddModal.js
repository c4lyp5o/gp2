import React from "react";
import styles from "../Modal.module.css";
import { RiCloseLine } from "react-icons/ri";
import { useState } from "react";
import { addKp } from "../controllers/helper";

const Modal = ({ setAddOpen }) => {
  const [newKp, setnewKp] = useState("");
  const [utcrtc, setutcrtc] = useState("hidden");

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
              <RiCloseLine style={{ marginBottom: "-3px" }} />
            </button>
            <div className={styles.modalContent}>
              <div className="admin-pegawai-handler-container">
                <div className="admin-pegawai-handler-input">
                  <p>Nama Klinik Pergigian</p>
                  <input
                    className="border-2"
                    type="text"
                    name="Nama"
                    id="nama"
                    onChange={(e) => setnewKp(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className={styles.modalContent}>
              <label className="block bg-admin3 mx-24 text-white">
                <input type="checkbox" name="checkbox" value="KEPP" className="w-3.5 h-3.5 m-2 "/>KEPP
              </label>
              <br/>
              <label className="block bg-admin3 mx-24 text-white">
              <input
                type="checkbox"
                name="checkbox"
                value="RTC"
                className="w-3.5 h-3.5 m-2"
                onChange={(e) => {
                  if (utcrtc === "") {
                    setutcrtc("hidden");
                  }
                  if (utcrtc === "hidden") {
                    setutcrtc("");
                  }
                }}
              />
              RTC / UTC</label>
              <div className={utcrtc}>
              <label className="block bg-admin3 mx-24 ">
                <input type="radio" name="type" className="m-2"/>
                UTC</label>
                <label className="block bg-admin3 mx-24">
                <input type="radio" name="type"  className="m-2"/>
                RTC</label>
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
