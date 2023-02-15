import { useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';

import { useGlobalAdminAppContext } from '../../context/adminAppContext';

import styles from '../../Modal.module.css';

const TotpModal = ({ children, image }) => {
  const { toast, verifyInitialSecret } = useGlobalAdminAppContext();
  const [totp, setTotp] = useState('');
  const [open, setOpen] = useState(false);
  const [callback, setCallback] = useState(null);

  const show = (callback) => (event) => {
    event.preventDefault();
    setOpen(true);
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
    setOpen(false);
  };

  const confirm = (e) => {
    verifyInitialSecret(totp).then((res) => {
      if (res.status === 200) {
        toast.info('Kod TOTP berjaya disahkan');
        callback.run();
        hide();
      } else {
        toast.error('Kod TOTP tidak sah. SIla isi sekali lagi.');
      }
    });
  };

  return (
    <>
      {children(show)}
      {open && (
        <>
          <div className={styles.darkBG} onClick={hide} />
          <div className={styles.centered}>
            <div className={styles.modalEdit}>
              <div className={styles.modalHeader}>
                <h5 className={styles.heading}>AWAS!</h5>
              </div>
              <button className={styles.closeBtn} onClick={hide}>
                <RiCloseLine style={{ marginBottom: '-3px' }} />
              </button>
              <div className={styles.modalContent}>
                <p>
                  Sila scan QRCode pada aplikasi Authenticator (Google
                  Authenticator) dan isi kod TOTP yang sedang dipaparkan
                </p>
              </div>
              <div className={styles.modalContent}>
                <div className={styles.imagesCentered}>
                  <img src={image} alt='QRCode' />
                </div>
                <div className='mt-6'>
                  <input
                    type='text'
                    placeholder='Kod TOTP'
                    onChange={(e) => setTotp(e.target.value)}
                    className='appearance-none leading-7 px-3 py-1 ring-2 ring-admin3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md m-1'
                  />
                </div>
              </div>
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

export default TotpModal;
