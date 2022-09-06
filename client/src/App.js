import { BrowserRouter, Routes, Route } from 'react-router-dom';

// landing page import
import LandingPage from './LandingPage';

// kaunter import ----------------------------------------
import KaunterLogin from './user/pages/KaunterLogin';
import KaunterAfterLogin from './user/pages/KaunterAfterLogin';
import KaunterProtectedRoute from './user/pages/KaunterProtectedRoute';

// user import ------------------------------------------
import { UserAppProvider } from './user/context/userAppContext';

import UserLogin from './user/pages/UserLogin';
import UserProtectedRoute from './user/pages/UserProtectedRoute';
import UserAfterLogin from './user/pages/UserAfterLogin';

import UserNotFound from './user/pages/UserNotFound';

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
            {/* landing page selection */}
            <Route path='/' element={<LandingPage />} />
            {/* kaunter */}
            <Route path='/kaunter' element={<KaunterLogin />} />
            <Route
              path='/kaunter/daftar/*'
              element={
                <KaunterProtectedRoute>
                  <KaunterAfterLogin />
                </KaunterProtectedRoute>
              }
            />
            {/* pengguna */}
            <Route path='/pengguna' element={<UserLogin />} />
            <Route
              path='/pengguna/landing/*'
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
            {/* admin */}
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
