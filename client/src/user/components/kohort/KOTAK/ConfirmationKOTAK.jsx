import { useState } from 'react';
import moment from 'moment';
import {
  FaWindowClose,
  FaCheckCircle,
  FaTimesCircle,
  FaUserCheck,
  FaRegPaperPlane,
  FaMinus,
  FaPlus,
} from 'react-icons/fa';

const ConfirmModal = ({ children, data }) => {
  const [open, setOpen] = useState(false);
  const [callback, setCallback] = useState(null);

  const show = (callback) => (event) => {
    event.preventDefault();
    setOpen(true);
    event = {
      ...event,
      target: {
        ...event.target,
        value: event.target.value,
      },
    };
    setCallback({
      run: () => callback(event),
    });
  };

  const closeModal = () => {
    setCallback(null);
    setOpen(false);
  };

  const confirm = () => {
    callback.run();
    closeModal();
  };

  return (
    <>
      {children(show)}
      {open && (
        <>
          <div className='absolute inset-x-0 inset-y-0 lg:inset-x-1/3 lg:inset-y-6 text-sm bg-userWhite z-10 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'>
            <FaWindowClose
              onClick={closeModal}
              className='absolute mr-1 mt-1 text-xl text-userBlack right-0 hover:cursor-pointer hover:text-user2 transition-all'
            />
            <div className='grid grid-rows-[1fr_8fr_1fr] h-full'>
              <h5 className='bg-user9 text-userWhite font-semibold text-xl h-7'>
                PERHATIAN
              </h5>
              <div className='mt-1 py-1'>
                <span className='relative flex items-center justify-center mt-4'>
                  <FaUserCheck className='text-4xl text-user9 mx-auto absolute animate-ping' />
                  <FaUserCheck className='text-4xl text-user9 mx-auto absolute' />
                </span>
                <p className='px-1 font-semibold mt-7'>
                  Anda YAKIN untuk menghantar maklumat?
                </p>
                {data.tarikh1 ? (
                  <div className='grid grid-cols-[1fr_2fr]'>
                    <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                      Menjalani Intervensi Sesi 1 pada:{' '}
                    </p>
                    <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                      {moment(data.tarikh1).format('DD/MM/YYYY')}
                    </p>
                    {data.adaTiadaQTarikh1 === 'ada-q-tarikh1' ? (
                      <>
                        <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Mempunyai tarikh Quit Date pada:{' '}
                        </p>
                        <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {moment(data.tarikhQ).format('DD/MM/YYYY')}
                        </p>
                      </>
                    ) : null}
                  </div>
                ) : null}
                {data.tarikh2 ? (
                  <div className='grid grid-cols-[1fr_2fr]'>
                    <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                      Menjalani Intervensi Sesi 2 pada:{' '}
                    </p>
                    <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                      {moment(data.tarikh2).format('DD/MM/YYYY')}
                    </p>
                    {data.adaTiadaQTarikh2 === 'ada-q-tarikh2' ? (
                      <>
                        <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Mempunyai tarikh Quit Date pada:{' '}
                        </p>
                        <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {moment(data.tarikhQ).format('DD/MM/YYYY')}
                        </p>
                      </>
                    ) : null}
                  </div>
                ) : null}
                {data.tarikh3 ? (
                  <div className='grid grid-cols-[1fr_2fr]'>
                    <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                      Menjalani Intervensi Sesi 3 pada:{' '}
                    </p>
                    <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                      {moment(data.tarikh3).format('DD/MM/YYYY')}
                    </p>
                    {data.adaTiadaQTarikh3 === 'ada-q-tarikh3' ? (
                      <>
                        <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Mempunyai tarikh Quit Date pada:{' '}
                        </p>
                        <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {moment(data.tarikhQ).format('DD/MM/YYYY')}
                        </p>
                      </>
                    ) : null}
                  </div>
                ) : null}
                {data.rokokBiasaKotak ? (
                  <div className='grid grid-cols-[1fr_2fr]'>
                    <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5 '>
                      Menggunakan:{' '}
                    </p>
                    <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                      Rokok Biasa (Surya memang best)
                    </p>
                  </div>
                ) : null}
                {data.elektronikVapeKotak ? (
                  <div className='grid grid-cols-[1fr_2fr]'>
                    <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5 '>
                      Menggunakan:{' '}
                    </p>
                    <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                      Vape (Voltbar is the best)
                    </p>
                  </div>
                ) : null}
                {data.shishaKotak ? (
                  <div className='grid grid-cols-[1fr_2fr]'>
                    <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5 '>
                      Menggunakan:{' '}
                    </p>
                    <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                      Shisha (Golongan kaya)
                    </p>
                  </div>
                ) : null}
                {data.lainLainKotak ? (
                  <div className='grid grid-cols-[1fr_2fr]'>
                    <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5 '>
                      Menggunakan:{' '}
                    </p>
                    <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                      Lain-lain (Lambaian daun...)
                    </p>
                  </div>
                ) : null}
                {data.rujukGuruKaunseling ? (
                  <div className='grid grid-cols-[1fr_2fr]'>
                    <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                      Dirujuk Kepada Guru Kaunseling:{' '}
                    </p>
                    <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                      {data.rujukGuruKaunseling ? (
                        <FaCheckCircle className='text-user7 text-center mx-1' />
                      ) : (
                        <FaTimesCircle className='text-user9 text-center mx-1' />
                      )}
                    </p>
                  </div>
                ) : null}
                {data.statusSelepas6Bulan ? (
                  <div className='grid grid-cols-[1fr_2fr]'>
                    <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                      status selepas 6 bulan daripada tarikh kehadiran
                      intervensi sesi 1:{' '}
                    </p>
                    <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                      {data.statusSelepas6Bulan === 'berhenti' ? (
                        <FaCheckCircle className='text-user7 text-center mx-1'>
                          {' '}
                          Alhamdulillah berhenti...
                        </FaCheckCircle>
                      ) : (
                        <FaTimesCircle className='text-user9 text-center mx-1'>
                          {' '}
                          Innalillah tidak berhenti...
                        </FaTimesCircle>
                      )}
                    </p>
                  </div>
                ) : null}
              </div>
              <div className='sticky grid grid-cols-2 bottom-0 right-0 left-0 m-2 mx-10 bg-userWhite px-5 py-2'>
                <button
                  className='capitalize bg-user9 text-userWhite rounded-md shadow-xl p-2 mr-3 hover:bg-user1 transition-all flex justify-center items-center'
                  onClick={confirm}
                >
                  YA
                  <FaRegPaperPlane className='inline-flex ml-1' />
                </button>
                <button
                  className='capitalize bg-userWhite text-userBlack rounded-md p-2 ml-3 hover:bg-user5 transition-all'
                  onClick={closeModal}
                >
                  Tidak
                </button>
              </div>
            </div>
          </div>
          <div
            onClick={closeModal}
            className='fixed inset-0 bg-userBlack opacity-50 z-0'
          />
        </>
      )}
    </>
  );
};

export default ConfirmModal;
