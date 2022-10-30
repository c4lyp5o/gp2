import { useState, useId, useEffect } from 'react';
import { RiCloseLine } from 'react-icons/ri';

import { useGlobalAdminAppContext } from '../context/adminAppContext';

import styles from '../Modal.module.css';

const TotpModal = ({ children }) => {
  const { generateSecret, verifyInitialSecret } = useGlobalAdminAppContext();
  const [qrCode, setQrCode] = useState('');
  const [open, setOpen] = useState(false);
  const [callback, setCallback] = useState(null);
  const totp = useId();

  const show = (callback) => (event) => {
    event.preventDefault();
    setOpen(true);
    const secret = generateSecret();
    console.log(secret);
    setQrCode(secret.otp_auth_url);
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

  const confirm = () => {
    console.log('checking totp');
    verifyInitialSecret(totp).then((res) => {
      console.log(res);
      if (res.status === 200) {
        console.log('confirm');
        callback.run();
        hide();
      } else {
        console.log('error');
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
            <div className={styles.modal}>
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
              <div>
                <img src={qrCode} alt='QRCode' />
              </div>
              <div>
                <input id={totp} type='text' placeholder='Kod TOTP' />
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
