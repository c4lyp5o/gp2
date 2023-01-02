import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// environment warning import
import EnvironmentWarning from './landing/EnvironmentWarning';

// landing page import
import LandingPage from './landing/LandingPage';
import Faq from './landing/faq';

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
  const [showEnvironmentWarning, setShowEnvironmentWarning] = useState(true);

  return (
    <>
      {process.env.REACT_APP_ENV === 'TRAINING' && showEnvironmentWarning && (
        <EnvironmentWarning
          showEnvironmentWarning={showEnvironmentWarning}
          setShowEnvironmentWarning={setShowEnvironmentWarning}
        />
      )}
      <BrowserRouter>
        <UserAppProvider>
          <Routes>
            {/* landing page selection */}
            <Route path='/' element={<LandingPage />} />
            <Route path='/faq' element={<Faq />} />
            {/* pendaftaran */}
            <Route path='/pendaftaran' element={<KaunterLogin />} />
            <Route
              path='/pendaftaran/daftar/*'
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
            <Route path='/pentadbir' element={<AdminLoginForm />} />
            <Route
              path='/pentadbir/landing/*'
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
