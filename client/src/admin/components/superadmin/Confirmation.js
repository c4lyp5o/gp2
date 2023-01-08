import { useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';

import styles from '../../Modal.module.css';

export const ConfirmModalForData = ({ children, func }) => {
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
          <div className='fixed bottom-56 md:bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center z-50'>
            <div className='fixed inset-0 transition-opacity'>
              <div
                className='absolute inset-0 bg-userBlack opacity-75'
                onClick={hide}
              ></div>
            </div>
            <div className='bg-adminWhite rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full'>
              <div className='bg-adminWhite px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                <div className='mt-3 text-center sm:mt-5'>
                  <h3 className='text-xl leading-6 text-user9 font-bold text-bold animate-pulse'>
                    AWAS!
                  </h3>
                  <div className='mt-2'>
                    <p className='text-sm leading-5 text-gray-500'>
                      {func === 'add'
                        ? 'Anda YAKIN untuk menambah maklumat?'
                        : 'Anda YAKIN untuk mengemaskini maklumat?'}
                    </p>
                  </div>
                </div>
              </div>
              <div className='bg-kaunter5 px-4 py-2 sm:px-6 flex flex-row-reverse justify-start'>
                <span className='flex rounded-md shadow-sm ml-3 w-auto'>
                  <button
                    type='button'
                    className='inline-flex justify-center w-16 rounded-md border border-transparent px-4 py-1 bg-user9 text-base leading-6 font-medium text-adminWhite shadow-sm hover:bg-admin2 focus:outline-none focus:border-kaunter1 focus:shadow-outline-red active:bg-admin3'
                    onClick={hide}
                  >
                    Batal
                  </button>
                </span>
                <span className='mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto'>
                  <button
                    type='button'
                    className='inline-flex justify-center w-16 rounded-md border border-transparent px-4 py-1 bg-user7 text-base leading-6 font-medium text-adminWhite shadow-sm hover:bg-user8 focus:outline-none focus:border-user8 focus:shadow-outline-green active:bg-user7'
                    onClick={confirm}
                  >
                    YA
                  </button>
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export const ConfirmModalForLogOut = ({ children }) => {
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
          <div className='absolute bottom-56 md:bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center'>
            <div className='fixed inset-0 transition-opacity'>
              <div
                className='absolute inset-0 bg-userBlack opacity-75'
                onClick={hide}
              ></div>
            </div>
            <div className='bg-adminWhite rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full'>
              <div className='bg-adminWhite px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                <div className='mt-3 text-center sm:mt-5'>
                  <h3 className='text-xl leading-6 text-user9 font-bold text-bold animate-pulse'>
                    AWAS!
                  </h3>
                  <div className='mt-2'>
                    <p className='text-sm leading-5 text-gray-500'>
                      Anda YAKIN untuk log keluar?
                    </p>
                  </div>
                </div>
              </div>
              <div className='bg-kaunter5 px-4 py-2 sm:px-6 flex flex-row-reverse justify-start'>
                <span className='flex rounded-md shadow-sm ml-3 w-auto'>
                  <button
                    type='button'
                    className='inline-flex justify-center w-16 rounded-md border border-transparent px-4 py-1 bg-user9 text-base leading-6 font-medium text-adminWhite shadow-sm hover:bg-admin2 focus:outline-none focus:border-kaunter1 focus:shadow-outline-red active:bg-admin3'
                    onClick={hide}
                  >
                    Batal
                  </button>
                </span>
                <span className='flex rounded-md shadow-sm sm:mt-0 w-auto'>
                  <button
                    type='button'
                    className='inline-flex justify-center w-16 rounded-md border border-transparent px-4 py-1 bg-user7 text-base leading-6 font-medium text-adminWhite shadow-sm hover:bg-user8 focus:outline-none focus:border-user8 focus:shadow-outline-green active:bg-user7'
                    onClick={confirm}
                  >
                    YA
                  </button>
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export const ConfirmModalForTukarPengguna = ({ children }) => {
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
          <div className='fixed bottom-56 md:bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center'>
            <div className='fixed inset-0 transition-opacity'>
              <div
                className='absolute inset-0 bg-userBlack opacity-75'
                onClick={hide}
              ></div>
            </div>
            <div className='bg-adminWhite rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full'>
              <div className='bg-adminWhite px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                <div className='mt-3 text-center sm:mt-5'>
                  <h3 className='text-xl leading-6 text-user9 font-bold text-bold animate-pulse'>
                    AWAS!
                  </h3>
                  <div className='mt-2'>
                    <p className='text-sm leading-5 text-gray-500'>
                      Anda YAKIN untuk menukar pengguna?
                    </p>
                  </div>
                </div>
              </div>
              <div className='bg-kaunter5 px-4 py-2 sm:px-6 flex flex-row-reverse justify-start'>
                <span className='flex rounded-md shadow-sm ml-3 w-auto'>
                  <button
                    type='button'
                    className='inline-flex justify-center w-16 rounded-md border border-transparent px-4 py-1 bg-user9 text-base leading-6 font-medium text-adminWhite shadow-sm hover:bg-admin2 focus:outline-none focus:border-kaunter1 focus:shadow-outline-red active:bg-admin3'
                    onClick={hide}
                  >
                    Batal
                  </button>
                </span>
                <span className='flex rounded-md shadow-sm sm:mt-0 w-auto'>
                  <button
                    type='button'
                    className='inline-flex justify-center w-16 rounded-md border border-transparent px-4 py-1 bg-user7 text-base leading-6 font-medium text-adminWhite shadow-sm hover:bg-user8 focus:outline-none focus:border-user8 focus:shadow-outline-green active:bg-user7'
                    onClick={confirm}
                  >
                    YA
                  </button>
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
