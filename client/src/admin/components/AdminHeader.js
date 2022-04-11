import AdminHeaderLoggedIn from "./AdminHeaderLoggedIn";

function AdminHeader() {
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
        <AdminHeaderLoggedIn />
      </div>
    </div>
  );
}

export default AdminHeader;