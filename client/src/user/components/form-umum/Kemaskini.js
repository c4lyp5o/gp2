import axios from 'axios';
import { FaWindowClose } from 'react-icons/fa';

import { useGlobalUserAppContext } from '../../context/userAppContext';

function Kemaskini({ setShowKemaskini }) {
  const { userToken, username, navigate, catchAxiosErrorAndLogout, useParams } =
    useGlobalUserAppContext();

  const { personUmumId } = useParams();

  const closeModal = () => {
    setShowKemaskini(false);
  };

  const handleSubmit = async () => {
    try {
      // try..
    } catch (error) {
      // catch..
    }
  };

  return (
    <>
      <div className='absolute inset-20 bg-userWhite z-20 outline outline-1 outline-userBlack opacity-100'>
        <FaWindowClose
          onClick={closeModal}
          className='absolute m-2 text-4xl right-0 hover:text-5xl hover:cursor-pointer transition-all'
        />
        <form onSubmit={handleSubmit}>form kemaskini</form>
      </div>
      <div className='absolute inset-0 bg-user1 z-10 opacity-75'></div>
    </>
  );
}

export default Kemaskini;
