import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserSharedLayout from './user/pages/UserSharedLayout';

// import './user/user.css';
import UserLogin from './user/pages/UserLogin';
import UserAfterLogin from './user/pages/UserAfterLogin';
import UserNotFound from './user/pages/UserNotFound';

// import "./admin/admin.css";
// import AdminHeader from './admin/components/AdminHeader';
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

    <BrowserRouter>
      <Routes>
        <Route element={<UserSharedLayout />}>
          <Route path='/*' element={<UserAfterLogin />} />

          <Route path='login' element={<UserLogin />} />

          <Route path='*' element={<UserNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// path available are:
// '/'
// '/dashboard'
// '/generate'
// '/*' for error

export default App;
