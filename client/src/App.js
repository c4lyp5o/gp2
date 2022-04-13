// import './admin/admin.css';
// import AdminHeader from './admin/components/AdminHeader';
// import AdminNavbar from './admin/components/AdminNavbar';
// import AdminLoginForm from './admin/components/AdminLoginForm';
// import AdminFooter from './admin/components/AdminFooter';

import './user/user.css';
import UserHeader from './user/components/UserHeader';
import UserNavbar from './user/components/UserNavbar';
import UserLoginForm from './user/components/UserLoginForm';
import UserPilihNama from './user/components/UserPilihNama';
import UserFooter from './user/components/UserFooter';

function App() {
  return (
    // <div className='admin-canvas'>
    //   <AdminHeader />
    //   <AdminNavbar />
    //   <AdminLoginForm />
    //   <AdminFooter />
    // </div>
    <div className='user-canvas'>
      <UserHeader />
      <UserNavbar />
      {/* <UserLoginForm /> */}
      <UserPilihNama />
      <UserFooter />
    </div>
  );
}

export default App;
