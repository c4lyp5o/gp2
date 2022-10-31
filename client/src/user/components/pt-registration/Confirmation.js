import { useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { FaWindowClose } from 'react-icons/fa';
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
    if (!isEdit) {
      checkDuplicate();
    }
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
          <div className='absolute inset-x-14 inset-y-20 lg:inset-x-1/3 bg-userWhite z-20 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'>
            <FaWindowClose
              onClick={hide}
              className='absolute mr-1 mt-1 text-xl text-userBlack right-0 hover:cursor-pointer hover:text-user2 transition-all'
            />
            <h5 className='bg-user9 text-userWhite font-semibold text-xl'>
              PERHATIAN
            </h5>
            <div className='mt-5 p-1'>
              {isEdit ? (
                <p className='font-semibold'>
                  Anda YAKIN{' '}
                  <span className='lowercase'>untuk mengemaskini data</span>?
                </p>
              ) : (
                <p className='font-semibold'>
                  Anda YAKIN{' '}
                  <span className='lowercase'>untuk menambah data?</span>
                </p>
              )}
              <div className='grid grid-cols-1 mt-3'>
                <p>Nama: {data.nama}</p>
                <p>No. Pengenalan Diri: {data.ic}</p>
                <p>
                  Tarikh Lahir: {moment(data.tarikhLahir).format('DD/MM/YYYY')}
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
                {data.statusPesara ? <p>Pesara: {data.statusPesara}</p> : null}
                {data.rujukDaripada ? (
                  <p>Rujuk Daripada: {data.rujukDaripada}</p>
                ) : null}
                {data.catatan ? <p>Catatan: {data.catatan}</p> : null}
                {data.pilihanEvent ? <p>Event: {data.pilihanEvent}</p> : null}
              </div>
            </div>
            {duplicate && !isEdit ? (
              <div className='border border-black m-3 p-3'>
                <p className='text-bold text-kaunter1 text-xl'>AWAS!</p>
                <span>Pesakit </span>
                <span className='lowercase'>
                  yang sama telah didaftarkan pada hari ini pada{' '}
                  {formatTime(duplicateData[0].waktuSampai)}
                </span>{' '}
              </div>
            ) : null}
            <div className='absolute grid grid-cols-2 bottom-0 right-0 left-0 m-2 mx-10'>
              <button
                className='capitalize bg-user9 text-userWhite rounded-md shadow-xl p-2 mr-3 hover:bg-kaunter2 transition-all'
                onClick={confirm}
              >
                YA
              </button>
              <button
                className='capitalize bg-userWhite text-userBlack rounded-md p-2 ml-3 hover:bg-user5 transition-all'
                onClick={hide}
              >
                Tidak
              </button>
            </div>
          </div>
          <div
            onClick={hide}
            className='absolute inset-0 bg-user1 z-10 opacity-75'
          />
        </>
      )}
    </>
  );
};

export default ConfirmModal;
