function AdminHeader() {
  function LoggedIn() {
    return (
      <>
        <div className="admin-header-gambar">
          <img
            width={100}
            height={100}
            src="https://1.bp.blogspot.com/-Nx8gwxIE8lY/WQ3oDqCov-I/AAAAAAAABOo/qPrUlx8Qjs4sezUqF4qTdOLA5Dk67cEdwCLcB/s640/rubick%2B%2528Dota%2B2%2529.jpg"
            alt="logo"
          />
        </div>
        <div className="admin-header-info">
          <p>User: c4lyp5o</p>
          <br />
          <p>KP: KP Datuk Kumbar</p>
        </div>
        <div className="admin-header-logout">
          <button className="admin-header-logout-button">LOGOUT</button>
        </div>
      </>
    );
  }

  function NotLoggedIn() {
    return (
      <>
        <div className="admin-header-gambar">
          {/* <img
            width={100}
            height={100}
            src="https://1.bp.blogspot.com/-Nx8gwxIE8lY/WQ3oDqCov-I/AAAAAAAABOo/qPrUlx8Qjs4sezUqF4qTdOLA5Dk67cEdwCLcB/s640/rubick%2B%2528Dota%2B2%2529.jpg"
            alt="logo"
          /> */}
        </div>
        <div className="admin-header-info">
          {/* <p>User: c4lyp5o</p> */}
          <br />
          {/* <p>KP: KP Datuk Kumbar</p> */}
        </div>
        <div className="admin-header-logout">
          {/* <button className="admin-header-logout-button">LOGOUT</button> */}
        </div>
      </>
    );
  }

  return (
    <div className="admin-header-container">
      <div className="jata-container">
        <img
          width={100}
          height={100}
          src="https://upload.wikimedia.org/wikipedia/commons/9/94/Jata_MalaysiaV2.svg"
          alt="missing jata negara"
        />
        <p>kementerian kesihatan malaysia</p>
        <p>program kesihatan pergigian</p>
      </div>
      <div className="text-container">
        <h1>admin sistem gi-Ret PSY 2.0</h1>
      </div>
      <div className="admin-header-logged-in-container">
        {/* <NotLoggedIn /> */}
        <LoggedIn />
      </div>
    </div>
  );
}

export default AdminHeader;
