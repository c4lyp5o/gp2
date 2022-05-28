import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { UserAppProvider } from './user/context/userAppContext';
import { AdminAppProvider } from './admin/context/adminAppContext';

import Redirector from './user/pages/Redirector';
import UserSharedLayout from './user/pages/UserSharedLayout';
import UserAfterLogin from './user/pages/UserAfterLogin';
import UserLogin from './user/pages/UserLogin';
import UserNotFound from './user/pages/UserNotFound';

import './admin/admin.css';
import AdminHeader from './admin/components/AdminHeader';
// import AdminNavbar from './admin/components/AdminNavbar';
// import AdminLoginForm from './admin/components/AdminLoginForm';
// import AdminSelamatDatang from './admin/components/AdminSelamatDatang';
// import AdminFooter from './admin/components/AdminFooter';

function App() {
  return (
    // <>
    //   <UserHeader />
    //   <UserLogin />
    //   <UserAfterLogin />
    //   <UserFooter />
    // </>
    <>
      <BrowserRouter>
        <UserAppProvider>
          <Routes>
            <Route path='/' element={<Redirector />}>
              <Route element={<UserSharedLayout />}>
                <Route path='user/*' element={<UserAfterLogin />} />

                <Route path='login' element={<UserLogin />} />

                <Route path='*' element={<UserNotFound />} />
              </Route>
            </Route>
          </Routes>
        </UserAppProvider>
        <AdminAppProvider>
          <Routes>
            <Route path='/admin' element={<AdminHeader />} />
          </Routes>
        </AdminAppProvider>
      </BrowserRouter>
    </>
  );
}

// path available are:
// '/'
// '/dashboard'
// '/generate'
// '/*' for error

export default App;
