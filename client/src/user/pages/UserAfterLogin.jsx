import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Default } from 'react-awesome-spinners';

import UserHeader from '../components/UserHeader';
import UserNavbar from '../components/UserNavbar';
import UserHeaderLoggedIn from '../components/UserHeaderLoggedIn';

import UserDashboard from '../components/UserDashboard';

import UserLoggedInNotFound from './UserLoggedInNotFound';

import UserFooter from '../components/UserFooter';

import { useGlobalUserAppContext } from '../context/userAppContext';

// status harian, umum, sekolah, promosi, kohort, carian, summary
const UserStatusHarian = lazy(() =>
  import('../components/status-harian/UserStatusHarian')
);

const UserUmum = lazy(() => import('../components/umum/UserUmum'));
const UserFormUmumHeader = lazy(() =>
  import('../components/umum/form-umum/UserFormUmumHeader')
);

const UserSenaraiSekolah = lazy(() =>
  import('../components/sekolah/UserSenaraiSekolah')
);
const UserSekolah = lazy(() => import('../components/sekolah/UserSekolah'));
const UserFormSekolahPemeriksaan = lazy(() =>
  import('../components/sekolah/form-sekolah/UserFormSekolahPemeriksaan')
);
const UserFormSekolahRawatan = lazy(() =>
  import('../components/sekolah/form-sekolah/UserFormSekolahRawatan')
);
const UserFormSekolahKOTAK = lazy(() =>
  import('../components/sekolah/form-sekolah/UserFormSekolahKOTAK')
);

const UserPromosi = lazy(() => import('../components/promosi/UserPromosi'));
const UserFormPromosi = lazy(() =>
  import('../components/promosi/form-promosi/UserFormPromosi')
);

const UserKohort = lazy(() => import('../components/kohort/UserKohortPage'));

const UserKohortKotak = lazy(() => import('../components/kohort/KOTAK/Kotak'));
const UserKohortKotakForm = lazy(() =>
  import('../components/kohort/KOTAK/FormKOTAK')
);

const UserCarianPesakit = lazy(() =>
  import('../components/carian/UserCarianPesakit')
);
const UserCarianPromosi = lazy(() =>
  import('../components/carian/UserCarianPromosi')
);

const UserSummary = lazy(() => import('../components/summary/UserSummary'));

function Loading() {
  return (
    <div className='absolute inset-0 bg-user5 text-center rounded-md'>
      <div className='absolute top-[45%] inset-x-10'>
        <Default />
      </div>
    </div>
  );
}

function UserAfterLogin() {
  const { userinfo, ToastContainer } = useGlobalUserAppContext();

  return (
    <>
      <ToastContainer />
      <UserHeader />
      <div className='absolute inset-0 -z-10 bg-user5'></div>
      <UserNavbar />
      <UserHeaderLoggedIn />
      <div className='absolute inset-2 top-[7.5rem] bottom-[2rem] -z-10 bg-userWhite text-center justify-center items-center outline outline-1 outline-userBlack rounded-md shadow-xl capitalize'>
        <Routes>
          <Route index element={<UserDashboard />} />

          <Route
            path='status-harian'
            element={
              <Suspense fallback={<Loading />}>
                <UserStatusHarian />
              </Suspense>
            }
          />

          <Route
            path='umum'
            element={
              <Suspense fallback={<Loading />}>
                <UserUmum />{' '}
              </Suspense>
            }
          />
          <Route
            path='umum/form-umum/:personUmumId'
            element={
              <Suspense fallback={<Loading />}>
                <UserFormUmumHeader />{' '}
              </Suspense>
            }
          />
          <Route
            path='umum/form-umum/:personUmumId/:operatorLain'
            element={
              <Suspense fallback={<Loading />}>
                <UserFormUmumHeader />{' '}
              </Suspense>
            }
          />

          {import.meta.env.VITE_ENV === 'TRAINING' ||
          import.meta.env.VITE_ENV === 'UNSTABLE' ||
          import.meta.env.VITE_ENV === 'DEV' ? (
            <>
              <Route
                path='senarai-sekolah'
                element={
                  <Suspense fallback={<Loading />}>
                    <UserSenaraiSekolah />{' '}
                  </Suspense>
                }
              />
              <Route
                path='senarai-sekolah/sekolah/:singleSekolahId'
                element={
                  <Suspense fallback={<Loading />}>
                    <UserSekolah />{' '}
                  </Suspense>
                }
              />
              <Route
                path='senarai-sekolah/sekolah/form-sekolah/pemeriksaan/:personSekolahId/:pemeriksaanSekolahId'
                element={
                  <Suspense fallback={<Loading />}>
                    <UserFormSekolahPemeriksaan />{' '}
                  </Suspense>
                }
              />
              <Route
                path='senarai-sekolah/sekolah/form-sekolah/rawatan/:personSekolahId'
                element={
                  <Suspense fallback={<Loading />}>
                    <UserFormSekolahRawatan />{' '}
                  </Suspense>
                }
              />
              <Route
                path='senarai-sekolah/sekolah/form-sekolah/kotak/:personSekolahId/:kotakSekolahId'
                element={
                  <Suspense fallback={<Loading />}>
                    <UserFormSekolahKOTAK />{' '}
                  </Suspense>
                }
              />
            </>
          ) : null}

          {/* sampai mac2023 je */}
          {/* <Route
            path='umum-sekolah'
            element={<UserUmum sekolahIdc='umum-sekolah' />}
          />
          <Route
            path='umum-sekolah/form-umum/:personUmumId'
            element={<UserFormUmumHeader sekolahIdc='umum-sekolah' />}
          />
          <Route
            path='umum-sekolah/form-umum/:personUmumId/:operatorLain'
            element={<UserFormUmumHeader sekolahIdc='umum-sekolah' />}
          /> */}

          <Route
            path='promosi-individu'
            element={
              <Suspense fallback={<Loading />}>
                <UserPromosi individuOrKlinik='promosi-individu' />{' '}
              </Suspense>
            }
          />
          <Route
            path='promosi-individu/form-promosi/:aktivitiId'
            element={
              <Suspense fallback={<Loading />}>
                <UserFormPromosi individuOrKlinik='promosi-individu' />{' '}
              </Suspense>
            }
          />
          {userinfo.rolePromosiKlinik === true && (
            <>
              <Route
                path='promosi-klinik'
                element={
                  <Suspense fallback={<Loading />}>
                    <UserPromosi individuOrKlinik='promosi-klinik' />{' '}
                  </Suspense>
                }
              />
              <Route
                path='promosi-klinik/form-promosi/:aktivitiId'
                element={
                  <Suspense fallback={<Loading />}>
                    <UserFormPromosi individuOrKlinik='promosi-klinik' />{' '}
                  </Suspense>
                }
              />
            </>
          )}

          {import.meta.env.VITE_ENV === 'UNSTABLE' ||
          import.meta.env.VITE_ENV === 'DEV' ? (
            <>
              <Route
                path='kohort'
                element={
                  <Suspense fallback={<Loading />}>
                    <UserKohort />{' '}
                  </Suspense>
                }
              />
              {/* kotak */}
              <Route
                path='kohort/kotak'
                element={
                  <Suspense fallback={<Loading />}>
                    <UserKohortKotak />{' '}
                  </Suspense>
                }
              />
              <Route
                path='kohort/kotak/:personKohortKotakId'
                element={
                  <Suspense fallback={<Loading />}>
                    <UserKohortKotakForm />{' '}
                  </Suspense>
                }
              />
            </>
          ) : null}

          {/* {reliefUserToken ? null : (
            <>
              <Route
                path='generate-individu'
                element={<UserGenerateIndividu />}
              />
              <Route path='generate-klinik' element={<UserGenerateKlinik />} />
            </>
          )} */}

          <Route
            path='carian/pesakit'
            element={
              <Suspense fallback={<Loading />}>
                <UserCarianPesakit />{' '}
              </Suspense>
            }
          />

          <Route
            path='carian/promosi'
            element={
              <Suspense fallback={<Loading />}>
                <UserCarianPromosi />{' '}
              </Suspense>
            }
          />

          <Route
            path='summary'
            element={
              <Suspense fallback={<Loading />}>
                <UserSummary />{' '}
              </Suspense>
            }
          />

          <Route path='*' element={<UserLoggedInNotFound />} />
        </Routes>
      </div>
      <UserFooter />
    </>
  );
}

export default UserAfterLogin;
