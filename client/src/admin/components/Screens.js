import { useGlobalAdminAppContext } from '../context/adminAppContext';
import { Ring } from 'react-awesome-spinners';
import styles from '../Modal.module.css';

import nothinghere from '../assets/nothinghere.png';

export function NothingHereBoi({ FType }) {
  const { Dictionary } = useGlobalAdminAppContext();
  return (
    <div className='flex justify-center text-center h-full w-full'>
      <div className='m-auto rounded-md grid'>
        <div className='rounded-lg shadow-lg bg-white max-w-sm'>
          <img
            className='rounded-t-lg'
            src={nothinghere}
            alt='There is nothing here'
          />
          <div className='p-6'>
            <h5 className='text-gray-900 text-xl font-medium mb-2'>
              Tiada Data
            </h5>
            <p className='text-gray-700 text-base mb-4'>
              Data{' '}
              {FType === 'kp' ? `Klinik Pergigian` : `${Dictionary[FType]}`}{' '}
              belum di isi...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Loading() {
  return (
    <>
      <div className={styles.darkBG} />
      <div className={styles.modalContent}>
        <div className={styles.centered}>
          <div className='m-auto p-4 bg-admin4 rounded-md grid'>
            <div className='flex justify-center mb-2'>
              <Ring color='#c44058' />
            </div>
            <span className='bg-admin3 text-kaunterWhite text-xs font-semibold px-2.5 py-0.5 rounded'>
              Memuat..
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export function LoadingSuperDark() {
  return (
    <>
      <div className={styles.superdarkBG} />
      <div className={styles.modalContent}>
        <div className={styles.centered}>
          <div className='m-auto p-4 bg-admin4 rounded-md grid'>
            <div className='flex justify-center mb-2'>
              <Ring color='#c44058' />
            </div>
            <span className='bg-admin3 text-kaunterWhite text-xs font-semibold px-2.5 py-0.5 rounded'>
              Memuat..
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
