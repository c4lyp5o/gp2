import { Link } from 'react-router-dom';
import { useGlobalAdminAppContext } from '../context/adminAppContext';

import error from '../assets/404.png';

function AdminLoggedInNotFound() {
  const { navigate } = useGlobalAdminAppContext();
  return (
    <>
      <div className='mx-auto mt-10'>
        <img className='mx-auto mb-10' src={error} alt='error' />
      </div>
      <button
        className='bg-admin3 hover:bg-admin3 border-x-admin2 text-adminWhite py-2 px-4 rounded capitalize'
        onClick={() => navigate('/pentadbir/landing')}
      >
        kembali ke halaman utama
      </button>
    </>
  );
}

export default AdminLoggedInNotFound;
