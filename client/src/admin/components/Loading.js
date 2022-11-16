import { Ring } from 'react-awesome-spinners';
import styles from '../Modal.module.css';

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
