import { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Default } from 'react-awesome-spinners';

// landing page import
import LandingPage from './landing/LandingPage';

// user provider import ------------------------------------------
import { UserAppProvider } from './user/context/userAppContext';

// admin provider import ------------------------------------------
import { AdminAppProvider } from './admin/context/adminAppContext';

// environment warning import
const EnvironmentWarning = lazy(() => import('./landing/EnvironmentWarning'));

// faq
const Faq = lazy(() => import('./landing/Faq'));

// kaunter import ----------------------------------------
const KaunterLogin = lazy(() => import('./user/pages/KaunterLogin'));
const KaunterProtectedRoute = lazy(() =>
  import('./user/pages/KaunterProtectedRoute')
);
const KaunterAfterLogin = lazy(() => import('./user/pages/KaunterAfterLogin'));

// pengguna import ---------------------------------------
const UserLogin = lazy(() => import('./user/pages/UserLogin'));
const UserProtectedRoute = lazy(() =>
  import('./user/pages/UserProtectedRoute')
);
const UserAfterLogin = lazy(() => import('./user/pages/UserAfterLogin'));

// pentadbir import --------------------------------------
const AdminLoginForm = lazy(() => import('./admin/pages/AdminLoginForm'));
const AdminProtectedRoute = lazy(() =>
  import('./admin/pages/AdminProtectedRoute')
);
const AdminAfterLogin = lazy(() => import('./admin/pages/AdminAfterLogin'));

const UserNotFound = lazy(() => import('./user/pages/UserNotFound'));

function Loading() {
  return (
    <div className='bg-userWhite text-center'>
      <div className='absolute top-[50%] inset-x-10'>
        <Default />
      </div>
    </div>
  );
}

function App() {
  const [showEnvironmentWarning, setShowEnvironmentWarning] = useState(true);

  return (
    <>
      {process.env.REACT_APP_ENV === 'TRAINING' && showEnvironmentWarning && (
        <Suspense fallback={<Loading />}>
          <EnvironmentWarning
            showEnvironmentWarning={showEnvironmentWarning}
            setShowEnvironmentWarning={setShowEnvironmentWarning}
          />
        </Suspense>
      )}
      <BrowserRouter>
        <UserAppProvider>
          <Routes>
            {/* landing page selection */}
            <Route path='/' element={<LandingPage />} />
            <Route
              path='/faq'
              element={
                <Suspense fallback={<Loading />}>
                  <Faq />
                </Suspense>
              }
            />
            {/* pendaftaran */}
            <Route
              path='/pendaftaran'
              element={
                <Suspense fallback={<Loading />}>
                  <KaunterLogin />
                </Suspense>
              }
            />
            <Route
              path='/pendaftaran/daftar/*'
              element={
                <Suspense fallback={<Loading />}>
                  <KaunterProtectedRoute>
                    <KaunterAfterLogin />
                  </KaunterProtectedRoute>
                </Suspense>
              }
            />
            {/* pengguna */}
            <Route
              path='/pengguna'
              element={
                <Suspense fallback={<Loading />}>
                  <UserLogin />
                </Suspense>
              }
            />
            <Route
              path='/pengguna/landing/*'
              element={
                <Suspense fallback={<Loading />}>
                  <UserProtectedRoute>
                    <UserAfterLogin />
                  </UserProtectedRoute>
                </Suspense>
              }
            />
            {/* not found */}
            <Route
              path='*'
              element={
                <Suspense fallback={<Loading />}>
                  <UserNotFound />
                </Suspense>
              }
            />
          </Routes>
        </UserAppProvider>
        <AdminAppProvider>
          <Routes>
            {/* admin */}
            <Route
              path='/pentadbir'
              element={
                <Suspense fallback={<Loading />}>
                  <AdminLoginForm />{' '}
                </Suspense>
              }
            />
            <Route
              path='/pentadbir/landing/*'
              element={
                <Suspense fallback={<Loading />}>
                  <AdminProtectedRoute>
                    <AdminAfterLogin />
                  </AdminProtectedRoute>
                </Suspense>
              }
            />
          </Routes>
        </AdminAppProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
