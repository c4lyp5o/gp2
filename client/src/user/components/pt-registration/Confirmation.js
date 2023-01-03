import { useState } from 'react';
import { FaWindowClose } from 'react-icons/fa';
import axios from 'axios';
import moment from 'moment';

import { useGlobalUserAppContext } from '../../context/userAppContext';

const ConfirmModal = ({ children, lookBusyGuys, data, isEdit }) => {
  const { kaunterToken, dateToday, formatTime } = useGlobalUserAppContext();

  const [open, setOpen] = useState(false);
  const [callback, setCallback] = useState(null);
  const [checkingDuplicate, setCheckingDuplicate] = useState(true);
  const [duplicate, setDuplicate] = useState(false);
  const [duplicateData, setDuplicateData] = useState(null);

  const checkDuplicate = async () => {
    try {
      setCheckingDuplicate(true);
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
      setCheckingDuplicate(false);
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
    setCallback(null);
    setOpen(false);
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
            <h5 className='bg-kaunter1 text-userWhite font-semibold text-xl'>
              PERHATIAN
            </h5>
            <div className='mt-3 p-1'>
              {isEdit ? (
                <p className='font-semibold'>
                  Anda YAKIN{' '}
                  <span className='lowercase'>
                    untuk mengemaskini maklumat?
                  </span>
                  ?
                </p>
              ) : (
                <p className='font-semibold'>
                  Anda YAKIN{' '}
                  <span className='lowercase'>untuk menghantar maklumat?</span>
                </p>
              )}
              <div className='grid grid-cols-[1fr_2fr] mt-3'>
                <p className='text-sm p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                  Nama:
                </p>
                <p className='text-sm p-1 flex justify-start text-left uppercase'>
                  {data.nama}
                </p>
                <p className='text-sm p-1 flex justify-end text-right'>
                  Pengenalan Diri:
                </p>
                <p className='text-sm p-1 flex justify-start text-left  bg-user1 bg-opacity-5'>
                  {data.ic}
                </p>
                <p className='text-sm p-1 flex justify-end text-right bg-user1 bg-opacity-5 '>
                  Maklumat Tambahan :
                </p>
                {data.nomborTelefon || data.emel || data.nomborTelefon2 ? (
                  <p className='text-sm p-1 flex justify-start text-left normal-case'>
                    {data.nomborTelefon ? `${data.nomborTelefon}` : null}
                    {data.nomborTelefon2 ? `, ${data.nomborTelefon2}` : null}
                    {data.emel ? `/${data.emel}` : null}
                  </p>
                ) : (
                  <p className='text-sm p-1 flex justify-start text-left normal-case'>
                    Tiada Maklumat{' '}
                  </p>
                )}
                <p className='text-sm p-1 flex justify-end text-right'>
                  Tarikh Lahir:
                </p>
                <p className='text-sm p-1 flex justify-start text-left bg-user1 bg-opacity-5'>
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
                {data.catatan ||
                data.noBayaran ||
                data.noResit ||
                data.noBayaran2 ||
                data.noResit2 ||
                data.noBayaran3 ||
                data.noResit3 ? (
                  <p className='text-sm p-1 flex justify-end text-right bg-user1 bg-opacity-5 my-1'>
                    Catatan:
                  </p>
                ) : null}
                {data.catatan ||
                data.noBayaran ||
                data.noResit ||
                data.noBayaran2 ||
                data.noResit2 ||
                data.noBayaran3 ||
                data.noResit3 ? (
                  <p className='text-sm p-1 flex justify-start text-left my-1'>
                    {data.noBayaran || data.noResit
                      ? `${data.noBayaran} - ${data.noResit}`
                      : null}
                    {data.noBayaran2 || data.noResit2
                      ? `, ${data.noBayaran2} - ${data.noResit2}`
                      : null}
                    {data.noBayaran3 || data.noResit3
                      ? `, ${data.noBayaran3} - ${data.noResit3}`
                      : null}
                    {data.catatan ? `, ${data.catatan}` : null}
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
              {checkingDuplicate && !isEdit ? (
                <button
                  type='button'
                  className='capitalize bg-kaunter3 rounded-md p-2 mr-2 inline-flex cursor-not-allowed'
                  disabled
                >
                  <svg
                    className='animate-spin ml-1 mr-3 h-5 w-5 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Menyemak...
                </button>
              ) : (
                <button
                  className='capitalize bg-kaunter1 text-userWhite rounded-md shadow-xl p-2 mr-3 hover:bg-kaunter2 transition-all'
                  onClick={confirm}
                >
                  YA
                </button>
              )}
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
