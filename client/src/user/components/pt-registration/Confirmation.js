import { useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import axios from 'axios';
import moment from 'moment';

import { useGlobalUserAppContext } from '../../context/userAppContext';

import styles from '../../../admin/Modal.module.css';

const ConfirmModal = ({ children, lookBusyGuys, data, isEdit, klinik }) => {
  const { kaunterToken, dateToday, formatTime } = useGlobalUserAppContext();

  const [open, setOpen] = useState(false);
  const [callback, setCallback] = useState(null);
  const [duplicate, setDuplicate] = useState(false);
  const [duplicateData, setDuplicateData] = useState([]);

  const checkDuplicate = async () => {
    const uniqueId = createUniqueId(data, klinik);
    try {
      const res = await axios.get(
        `/api/v1/query/kaunter?tarikhKedatangan=${dateToday}&uniqueId=${uniqueId}`,
        { headers: { Authorization: `Bearer ${kaunterToken}` } }
      );
      if (res.data.kaunterResultQuery.length > 0) {
        setDuplicate(true);
        setDuplicateData(res.data.kaunterResultQuery);
      } else {
        setDuplicate(false);
        setDuplicateData([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createUniqueId = (data, klinik) => {
    let uniqueId = '';
    const simplifiedKp = klinik.split(' ');
    for (let i = 0; i < simplifiedKp.length; i++) {
      uniqueId += simplifiedKp[i].charAt(0);
    }
    uniqueId += '-';
    const simplifiedName = data.nama.toLowerCase().split(' ');
    for (let i = 0; i < simplifiedName.length; i++) {
      uniqueId += simplifiedName[i].charAt(0);
    }
    uniqueId += '-';
    const dateOfBirth = data.tarikhLahir.split('-').join('');
    uniqueId += dateOfBirth;
    return uniqueId;
  };

  const show = (callback) => (event) => {
    event.preventDefault();
    lookBusyGuys(true);
    checkDuplicate().then(() => {
      setOpen(true);
    });
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
    lookBusyGuys(false);
    setOpen(false);
  };

  const confirm = () => {
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
                {isEdit ? (
                  <p>Anda YAKIN untuk mengemaskini data?</p>
                ) : (
                  <p>Anda YAKIN untuk menambah data?</p>
                )}
                <div className='mt-3'>
                  <p>Nama: {data.nama}</p>
                  <p>No. Pengenalan Diri: {data.ic}</p>
                  <p>
                    Tarikh Lahir:{' '}
                    {moment(data.tarikhLahir).format('DD/MM/YYYY')}
                  </p>
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
              {duplicate && !isEdit ? (
                <div className={styles.modalContent}>
                  <div className='border border-black'>
                    <p className='text-bold text-kaunter1 text-xl'>AWAS!</p>{' '}
                    <span>
                      Pesakit yang sama telah didaftarkan pada hari ini pada{' '}
                      {formatTime(duplicateData[0].waktuSampai)}
                    </span>{' '}
                    <p className='text-bold text-kaunter1 text-xl'>AWAS!</p>
                  </div>
                </div>
              ) : null}
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
