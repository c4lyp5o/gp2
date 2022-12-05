import { useState } from 'react';
import { FaWindowClose } from 'react-icons/fa';
import axios from 'axios';
import moment from 'moment';

import { useGlobalUserAppContext } from '../../context/userAppContext';

const ConfirmModal = ({ children, lookBusyGuys, data, isEdit }) => {
  const { kaunterToken, dateToday, formatTime } = useGlobalUserAppContext();

  const [open, setOpen] = useState(false);
  const [callback, setCallback] = useState(null);
  const [duplicate, setDuplicate] = useState(false);
  const [duplicateData, setDuplicateData] = useState(null);

  const checkDuplicate = async () => {
    try {
      const res = await axios.get(
        `/api/v1/query/kaunter?tarikhKedatangan=${dateToday}&ic=${data.ic}`,
        { headers: { Authorization: `Bearer ${kaunterToken}` } }
      );
      if (res.data.kaunterResultQuery.length > 0) {
        const lastIndex = res.data.kaunterResultQuery.length - 1;
        setDuplicate(true);
        setDuplicateData(res.data.kaunterResultQuery[lastIndex]);
      } else {
        setDuplicate(false);
        setDuplicateData({});
      }
    } catch (error) {
      console.log(error);
    }
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
          <div className='absolute inset-x-10 inset-y-5 lg:inset-x-1/3 lg:inset-y-6 text-sm bg-userWhite z-20 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'>
            <FaWindowClose
              onClick={hide}
              className='absolute mr-1 mt-1 text-xl text-userBlack right-0 hover:cursor-pointer hover:text-user2 transition-all'
            />
            <h5 className='bg-user9 text-userWhite font-semibold text-xl'>
              PERHATIAN
            </h5>
            <div className='mt-3 p-1'>
              {isEdit ? (
                <p className='font-semibold'>
                  Anda YAKIN{' '}
                  <span className='lowercase'>untuk mengemaskini data</span>?
                </p>
              ) : (
                <p className='font-semibold'>
                  Anda YAKIN{' '}
                  <span className='lowercase'>untuk menghantar data?</span>
                </p>
              )}
              <div className='grid grid-cols-[1fr_2fr] mt-3'>
                <p className='text-sm p-1 flex justify-end text-right'>Nama:</p>
                <p className='text-sm p-1 flex justify-start text-left bg-user1 bg-opacity-5 uppercase'>
                  {data.nama}
                </p>
                <p className='text-sm p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                  No. Pengenalan Diri:
                </p>
                <p className='text-sm p-1 flex justify-start text-left'>
                  {data.ic}
                </p>
                <p className='text-sm p-1 flex justify-end text-right'>
                  MySejahtera ID:
                </p>
                <p className='text-sm p-1 flex justify-start text-left bg-user1 bg-opacity-5 normal-case'>
                  {data.nomborTelefon ? `${data.nomborTelefon}` : null}
                  {''}
                  {data.emel ? `/${data.emel}` : null}
                </p>
                <p className='text-sm p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                  Tarikh Lahir:
                </p>
                <p className='text-sm p-1 flex justify-start text-left'>
                  {moment(data.tarikhLahir).format('DD/MM/YYYY')}
                </p>
                <p className='text-sm p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                  Umur:
                </p>
                <p className='text-sm p-1 flex justify-start text-left'>
                  {data.umur} tahun, {data.umurBulan} bulan
                </p>
                <p className='text-sm p-1 flex justify-end text-right'>
                  Jantina:{' '}
                </p>
                <p className='text-sm p-1 flex justify-start text-left bg-user1 bg-opacity-5'>
                  {data.jantina}
                </p>
                <p className='text-sm p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                  Kumpulan Etnik:
                </p>
                <p className='text-sm p-1 flex justify-start text-left'>
                  {data.kumpulanEtnik}
                </p>
                <p className='text-sm p-1 flex justify-end text-right'>
                  Alamat:
                </p>
                <p className='text-sm p-1 flex justify-start text-left bg-user1 bg-opacity-5'>
                  {data.alamat}, {data.daerahAlamat}, {data.poskodAlamat},{' '}
                  {data.negeriAlamat}
                </p>
                {data.ibuMengandung ? (
                  <p className='text-sm p-1 flex justify-end text-right bg-user1 bg-opacity-5 my-1'>
                    Ibu Mengandung:
                  </p>
                ) : null}
                {data.ibuMengandung ? (
                  <p className='text-sm p-1 flex justify-start text-left my-1'>
                    Ya
                  </p>
                ) : null}
                {data.bersekolah ? (
                  <p className='text-sm p-1 flex justify-end text-right bg-user1 bg-opacity-5 my-1'>
                    Bersekolah:
                  </p>
                ) : null}
                {data.bersekolah ? (
                  <p className='text-sm p-1 flex justify-start text-left my-1'>
                    Ya
                  </p>
                ) : null}
                {data.orangKurangUpaya ? (
                  <p className='text-sm p-1 flex justify-end text-right bg-user1 bg-opacity-5 my-1'>
                    Orang Kurang Upaya:
                  </p>
                ) : null}
                {data.orangKurangUpaya ? (
                  <p className='text-sm p-1 flex justify-start text-left my-1'>
                    Ya
                  </p>
                ) : null}
                {data.statusPesara ? (
                  <p className='text-sm p-1 flex justify-end text-right bg-user1 bg-opacity-5 my-1'>
                    Pesara:
                  </p>
                ) : null}
                {data.statusPesara ? (
                  <p className='text-sm p-1 flex justify-start text-left my-1'>
                    {data.statusPesara === 'pesara-kerajaan'
                      ? 'pesara kerajaan'
                      : 'pesara ATM'}
                  </p>
                ) : null}
                {data.rujukDaripada ? (
                  <p className='text-sm p-1 flex justify-end text-right bg-user1 bg-opacity-5 my-1'>
                    Rujuk Daripada:
                  </p>
                ) : null}
                {data.rujukDaripada ? (
                  <p className='text-sm p-1 flex justify-start text-left my-1'>
                    {data.rujukDaripada}
                  </p>
                ) : null}
                {data.catatan ? (
                  <p className='text-sm p-1 flex justify-end text-right bg-user1 bg-opacity-5 my-1'>
                    Catatan:
                  </p>
                ) : null}
                {data.catatan ? (
                  <p className='text-sm p-1 flex justify-start text-left my-1'>
                    {data.catatan}
                  </p>
                ) : null}
                {data.pilihanEvent ? (
                  <p className='text-sm p-1 flex justify-end text-right bg-user1 bg-opacity-5 my-1'>
                    Event:
                  </p>
                ) : null}
                {data.pilihanEvent ? (
                  <p className='text-sm p-1 flex justify-start text-left my-1'>
                    {data.pilihanEvent}
                  </p>
                ) : null}
              </div>
            </div>
            {duplicate && !isEdit ? (
              <div className='border border-black m-3 p-3'>
                <p className='text-bold text-kaunter1 text-xl'>AWAS!</p>
                <span>Pesakit </span>
                <span className='lowercase'>
                  yang sama telah didaftarkan pada hari ini pada{' '}
                  {formatTime(duplicateData.waktuSampai)}
                </span>{' '}
              </div>
            ) : null}
            <div className='max-[1024px]:absolute min-[1536px]:absolute grid grid-cols-2 bottom-0 right-0 left-0 m-2 mx-10'>
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
