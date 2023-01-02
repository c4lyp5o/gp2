import { FaWindowClose } from 'react-icons/fa';

export default function EnvrironmentWarning({ setShowEnvironmentWarning }) {
  return (
    <div className='justify-center text-center'>
      <div className='absolute inset-x-5 inset-y-20 lg:inset-x-1/4 2xl:inset-x-1/3 2xl:inset-y-40 bg-userWhite z-20 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'>
        <FaWindowClose
          onClick={() => setShowEnvironmentWarning(false)}
          className='absolute mr-1 mt-1 text-xl text-userBlack right-0 hover:cursor-pointer hover:text-user2 transition-all'
        />
        <h5 className='bg-user9 text-userWhite font-semibold text-xl'>
          PERHATIAN !
        </h5>
        <div className='mt-5 p-1 m-auto mb-3'>
          <span className='font-semibold text-2xl'>
            <div>INI ADALAH ENVIRONMENT</div>
            <span className='text-user9 text-4xl font-bold'>TRAINING !</span>
            <div>BERTUJUAN UNTUK LATIHAN</div>
          </span>
        </div>
        <div>
          <div>SILA KE LAMAN SEBENAR</div>
          <a className='underline text-user3' href='http://giret.moh.gov.my'>
            Gi-Ret 2.0
          </a>
          <div>SEKIRANYA INGIN MENGISI MAKLUMAT YANG SEBENAR</div>
        </div>
        <div className='absolute grid bottom-0 right-0 left-0 m-2 mx-10'>
          <span
            className='capitalize bg-user9 text-userBlack rounded-md p-2 mr-3 hover:bg-user5 hover:cursor-pointer transition-all'
            onClick={() => {
              setShowEnvironmentWarning(false);
            }}
          >
            SAYA FAHAM
          </span>
        </div>
      </div>
      <div
        onClick={() => setShowEnvironmentWarning(false)}
        className='absolute inset-0 bg-user1 z-10 opacity-75'
      />
    </div>
  );
}
