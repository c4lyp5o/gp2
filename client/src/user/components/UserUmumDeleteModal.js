import { useState, useEffect } from 'react';
import axios from 'axios';
import { RiCloseLine } from 'react-icons/ri';
import styles from '../../admin/Modal.module.css';

import { useGlobalUserAppContext } from '../context/userAppContext';

export default function DeleteModal({ handleDelete, setModalHapus, id, nama }) {
  const { toast } = useGlobalUserAppContext();
  const [adminId, setAdminId] = useState('');
  const [otpQuestion, setOtpQuestion] = useState(false);
  const [otpInput, setOtpInput] = useState('');

  const handleOtpRequest = async () => {
    setOtpQuestion(true);
    try {
      console.log('id', adminId);
      await axios.get(`/api/v1/getotp?id=${adminId}`);
      toast.success('OTP telah dihantar ke emel anda');
    } catch (error) {
      console.log(error);
    }
  };

  const handleOtpVerify = async () => {
    try {
      const res = await axios.get(
        `/api/v1/getotp/verify?id=${adminId}&otp=${otpInput}`
      );
      if (res.data.msg === 'OTP verified') {
        handleDelete(id);
        setOtpQuestion(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // component
  function SubmitButtton() {
    return (
      <button
        type='submit'
        onClick={() => {
          if (!otpQuestion) {
            handleOtpRequest();
          }
          if (otpQuestion) {
            handleOtpVerify();
          }
        }}
        className='capitalize bg-admin3 text-adminWhite rounded-md shadow-xl p-2 hover:bg-admin1 transition-all'
      >
        HAPUS
      </button>
    );
  }

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userinfo'));
    if (userData) {
      setAdminId(userData._id);
    }
  }, []);

  return (
    <>
      <div className={styles.darkBG} onClick={() => setModalHapus(false)} />
      <div className={styles.centered}>
        <div className={styles.modalDelete}>
          <div className={styles.modalHeader}>
            <h5 className={styles.heading}>AWAS!</h5>
          </div>
          <button
            className={styles.closeBtn}
            onClick={() => setModalHapus(false)}
          >
            <RiCloseLine style={{ marginBottom: '-3px' }} />
          </button>
          <div className={styles.modalContent}>
            Anda YAKIN untuk menghapus {nama}?
            {otpQuestion && (
              <>
                <div className={styles.modalContent}>
                  Sila masukkan OTP yang telah dihantar ke e-mel anda.
                  <div className='flex flex-col mt-4'>
                    <label htmlFor='otp' className='text-sm'>
                      OTP
                    </label>
                    <input
                      required
                      type='text'
                      name='otp'
                      id='otp'
                      className='border border-admin3 rounded-md p-2'
                      onChange={(e) => setOtpInput(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <div className={styles.modalActions}>
            <div className={styles.actionsContainer}>
              <SubmitButtton />
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setModalHapus(false);
                }}
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
