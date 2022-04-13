// import './admin/admin.css';
// import AdminHeader from './admin/components/AdminHeader';
// import AdminNavbar from './admin/components/AdminNavbar';
// import AdminLoginForm from './admin/components/AdminLoginForm';
// import AdminSelamatDatang from './admin/components/AdminSelamatDatang';
// import AdminFooter from './admin/components/AdminFooter';

import './user/user.css';
import UserHeader from './user/components/UserHeader';
import UserNavbar from './user/components/UserNavbar';
import UserLoginForm from './user/components/UserLoginForm';
import UserSelamatDatang from './user/components/UserSelamatDatang';
import UserFooter from './user/components/UserFooter';

function App() {
  return (
    // <div className='canvas'>
    //   <AdminHeader />
    //   <AdminNavbar />
    //   <AdminLoginForm />
    //   {/* <AdminSelamatDatang /> */}
    //   <AdminFooter />
    // </div>
    <div className='user-canvas'>
      <UserHeader />
      <UserNavbar />
      <UserLoginForm />
      {/* <UserSelamatDatang /> */}
      <UserFooter />
    </div>
  );
}

export default App;
