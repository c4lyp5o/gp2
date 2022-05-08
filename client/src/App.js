import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserLoginPage from './user/pages/UserLoginPage';
import UserSharedHomeLayout from './user/pages/UserSharedHomeLayout';

// import './user/user.css';
import UserHeader from './user/components/UserHeader';
import UserNavbar from './user/components/UserNavbar';
import UserHeaderLoggedIn from './user/components/UserHeaderLoggedIn';
import UserLogin from './user/components/UserLogin';
import UserAfterLogin from './user/components/UserAfterLogin';
import UserFooter from './user/components/UserFooter';

// import "./admin/admin.css";
// import AdminHeader from './admin/components/AdminHeader';
// import AdminNavbar from './admin/components/AdminNavbar';
// import AdminLoginForm from './admin/components/AdminLoginForm';
// import AdminSelamatDatang from './admin/components/AdminSelamatDatang';
// import AdminFooter from './admin/components/AdminFooter';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<UserLoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
