import { useState } from 'react';
import { FaWindowClose } from 'react-icons/fa';
import moment from 'moment';

const UserModalPromosiConfirmation = ({ children, data }) => {
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

  const confirm = () => {
    callback.run();
    hide();
  };

  return (
    <>
      {children(show)}
      {open && (
        <>
          <div className='absolute inset-x-10 inset-y-5 lg:inset-x-1/3 lg:inset-y-14 text-sm bg-userWhite z-20 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'>
            <FaWindowClose
              onClick={hide}
              className='absolute mr-1 mt-1 text-xl text-userBlack right-0 hover:cursor-pointer hover:text-user2 transition-all'
            />
            <div className='grid grid-rows-[1fr_8fr_1fr] h-full'>
              <h5 className='bg-user9 text-userWhite font-semibold text-xl h-7'>
                PERHATIAN
              </h5>
              <div className='mt-3 py-1'>
                <p className='px-1 text-xs font-semibold'>
                  Anda YAKIN untuk menghantar maklumat?
                </p>
                <div className='h-full overflow-y-auto mt-5'>
                  <span className='flex items-center bg-user1 bg-opacity-30 w-full cursor-pointer px-2 py-1 text-xs font-semibold'>
                    Maklumat Yang Diisi
                  </span>
                  <div
                    className={`text-xs mt-5 overflow-hidden transition-all duration-500`}
                  >
                    <p>Kod Prorgram: {data.kodProgram}</p>
                    <p>Nama Acara: {data.namaAcara}</p>
                    <p>
                      Tarikh Mula:{' '}
                      {moment(data.tarikhMula).format('DD/MM/YYYY')}
                    </p>
                    <p>
                      Tarikh Akhir:{' '}
                      {moment(data.tarikhAkhir).format('DD/MM/YYYY')}
                    </p>
                    <p>Tempat: {data.lokasi}</p>
                  </div>
                </div>
              </div>
              <div className='sticky grid grid-cols-2 bottom-0 right-0 left-0 m-2 mx-10 bg-userWhite px-5 py-2'>
                <button
                  className='capitalize bg-user9 text-userWhite rounded-md shadow-xl p-2 mr-3 hover:bg-user1 transition-all'
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

export default UserModalPromosiConfirmation;
