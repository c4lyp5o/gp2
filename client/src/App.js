import { BrowserRouter, Routes, Route } from 'react-router-dom';

// user import ------------------------------------------
import { UserAppProvider } from './user/context/userAppContext';

import UserLogin from './user/pages/UserLogin';
import UserProtectedRoute from './user/pages/UserProtectedRoute';
import UserAfterLogin from './user/pages/UserAfterLogin';

import UserNotFound from './user/pages/UserNotFound';

// kaunter import ----------------------------------------
import KaunterLogin from './user/pages/Kaunter';

// admin import ------------------------------------------
import { AdminAppProvider } from './admin/context/adminAppContext';

import AdminLoginForm from './admin/pages/AdminLoginForm';
import AdminProtectedRoute from './admin/pages/AdminProtectedRoute';
import AdminAfterLogin from './admin/pages/AdminAfterLogin';

function App() {
  return (
    <>
      <BrowserRouter>
        <UserAppProvider>
          <Routes>
            <Route path='/' element={<UserLogin />} />
            <Route path='/kaunter/*' element={<KaunterLogin />} />
            {/* <Route path='/kaunter/daftar' element={<KaunterDaftar />} /> */}
            <Route
              path='/user/*'
              element={
                <UserProtectedRoute>
                  <UserAfterLogin />
                </UserProtectedRoute>
              }
            />
            <Route path='*' element={<UserNotFound />} />
          </Routes>
        </UserAppProvider>
        <AdminAppProvider>
          <Routes>
            <Route path='/admin' element={<AdminLoginForm />} />
            <Route
              path='/admin/landing/*'
              element={
                <AdminProtectedRoute>
                  <AdminAfterLogin />
                </AdminProtectedRoute>
              }
            />
          </Routes>
        </AdminAppProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
