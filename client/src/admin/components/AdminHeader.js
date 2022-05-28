import { useEffect } from 'react';
import { useGlobalAdminAppContext } from '../context/adminAppContext';

function AdminHeader() {
  const { admin } = useGlobalAdminAppContext();

  useEffect(() => {
    console.log(admin);
  }, []);

  function LoggedIn() {
    return (
      <>
        <div className='admin-header-gambar'>
          <img
            width={100}
            height={100}
            src='https://www.rubiks.com/media/catalog/product/cache/9c57e2fe71f8a58f6afba681a0a15dd4/r/u/rubik-4x4-solved_4.jpg'
            alt='logo'
          />
        </div>
        <div className='admin-header-info'>
          <p>User: c4lyp5o</p>
          <br />
          <p>KP: KP Datuk Kumbar</p>
        </div>
        <div className='admin-header-logout'>
          <button className='admin-header-logout-button'>LOGOUT</button>
        </div>
      </>
    );
  }

  return (
    <div className='admin-header-container'>
      <div className='jata-container'>
        <img
          width={100}
          height={100}
          src='https://upload.wikimedia.org/wikipedia/commons/9/94/Jata_MalaysiaV2.svg'
          alt='missing jata negara'
        />
        <p>kementerian kesihatan malaysia</p>
        <p>program kesihatan pergigian</p>
      </div>
      <div className='text-container'>
        <h1>admin sistem gi-Ret PSY 2.0</h1>
      </div>
      <div className='admin-header-logged-in-container'>
        <LoggedIn />
      </div>
    </div>
  );
}

export default AdminHeader;
