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

// status harian
const UserStatusHarian = lazy(() =>
  import('../components/status-harian/UserStatusHarian')
);

// umum
const UserUmum = lazy(() => import('../components/umum/UserUmum'));
const UserFormUmumHeader = lazy(() =>
  import('../components/umum/form-umum/UserFormUmumHeader')
);

// sekolah
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
// const UserFormSekolahKOTAK = lazy(() =>
//   import('../components/sekolah/form-sekolah/UserFormSekolahKOTAK')
// );

// promosi
const UserPromosi = lazy(() => import('../components/promosi/UserPromosi'));
const UserFormPromosi = lazy(() =>
  import('../components/promosi/form-promosi/UserFormPromosi')
);

// kohort
const UserKohort = lazy(() => import('../components/kohort/UserKohortPage'));
// KOTAK
const UserKohortKotak = lazy(() => import('../components/kohort/KOTAK/Kotak'));
const UserKohortKotakForm = lazy(() =>
  import('../components/kohort/KOTAK/FormKOTAK')
);
// FMR
const UserKohortFMR = lazy(() => import('../components/kohort/FMR/FMR'));
const UserDaftarMuridMasukKohortFMR = lazy(() =>
  import('../components/kohort/FMR/DaftarMuridMasukKohortFMR')
);
const UserDaftarMuridBuatKumuranFMR = lazy(() =>
  import('../components/kohort/FMR/DaftarMuridBuatKumuranFMR')
);
const UserDaftarMuridKohortBuatKumuranFMR = lazy(() =>
  import('../components/kohort/FMR/DaftarMuridKohortBuatKumuranFMR')
);
const UserCarianMuridFMR = lazy(() =>
  import('../components/kohort/FMR/CarianFMR')
);

// carian
const UserCarianPesakit = lazy(() =>
  import('../components/carian/UserCarianPesakit')
);
const UserCarianPromosi = lazy(() =>
  import('../components/carian/UserCarianPromosi')
);
const UserCarianSekolah = lazy(() =>
  import('../components/carian/UserCarianSekolah')
);
const UserSalahFormSekolahPemeriksaan = lazy(() =>
  import('../components/sekolah/form-sekolah/UserSalahFormPemeriksaan')
);

// summary
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
                <UserUmum />
              </Suspense>
            }
          />
          <Route
            path='umum/form-umum/:personUmumId'
            element={
              <Suspense fallback={<Loading />}>
                <UserFormUmumHeader />
              </Suspense>
            }
          />
          <Route
            path='umum/form-umum/:personUmumId/:operatorLain'
            element={
              <Suspense fallback={<Loading />}>
                <UserFormUmumHeader />
              </Suspense>
            }
          />

          <Route
            path='senarai-sekolah'
            element={
              <Suspense fallback={<Loading />}>
                <UserSenaraiSekolah />
              </Suspense>
            }
          />
          <Route
            path='senarai-sekolah/sekolah/:kodSekolah'
            element={
              <Suspense fallback={<Loading />}>
                <UserSekolah />
              </Suspense>
            }
          />
          <Route
            path='senarai-sekolah/sekolah/form-sekolah/pemeriksaan/:personSekolahId/:pemeriksaanSekolahId'
            element={
              <Suspense fallback={<Loading />}>
                <UserFormSekolahPemeriksaan />
              </Suspense>
            }
          />
          <Route
            path='senarai-sekolah/sekolah/form-sekolah/rawatan/:personSekolahId'
            element={
              <Suspense fallback={<Loading />}>
                <UserFormSekolahRawatan />
              </Suspense>
            }
          />
          {/* <Route
              path='senarai-sekolah/sekolah/form-sekolah/kotak/:personSekolahId/:kotakSekolahId'
              element={
                <Suspense fallback={<Loading />}>
                  <UserFormSekolahKOTAK />
                </Suspense>
              }
            /> */}

          <Route
            path='promosi-individu'
            element={
              <Suspense fallback={<Loading />}>
                <UserPromosi individuOrKlinik='promosi-individu' />
              </Suspense>
            }
          />
          <Route
            path='promosi-individu/form-promosi/:aktivitiId'
            element={
              <Suspense fallback={<Loading />}>
                <UserFormPromosi individuOrKlinik='promosi-individu' />
              </Suspense>
            }
          />
          {userinfo.rolePromosiKlinik === true && (
            <>
              <Route
                path='promosi-klinik'
                element={
                  <Suspense fallback={<Loading />}>
                    <UserPromosi individuOrKlinik='promosi-klinik' />
                  </Suspense>
                }
              />
              <Route
                path='promosi-klinik/form-promosi/:aktivitiId'
                element={
                  <Suspense fallback={<Loading />}>
                    <UserFormPromosi individuOrKlinik='promosi-klinik' />
                  </Suspense>
                }
              />
            </>
          )}

          <Route
            path='kohort'
            element={
              <Suspense fallback={<Loading />}>
                <UserKohort />
              </Suspense>
            }
          />
          {/* kohort KOTAK */}
          <>
            <Route
              path='kohort/kotak'
              element={
                <Suspense fallback={<Loading />}>
                  <UserKohortKotak />
                </Suspense>
              }
            />
            <Route
              path='kohort/kotak/:personKohortKotakId'
              element={
                <Suspense fallback={<Loading />}>
                  <UserKohortKotakForm />
                </Suspense>
              }
            />
          </>
          {/* kohort FMR */}
          {import.meta.env.VITE_ENV === 'UNSTABLE' ||
          import.meta.env.VITE_ENV === 'DEV' ? (
            <>
              <Route
                path='kohort/fmr'
                element={
                  <Suspense fallback={<Loading />}>
                    <UserKohortFMR />
                  </Suspense>
                }
              />
              <Route
                path='kohort/fmr/daftar-murid/:singleSekolahFMRId'
                element={
                  <Suspense fallback={<Loading />}>
                    <UserDaftarMuridMasukKohortFMR />
                  </Suspense>
                }
              />
              <Route
                path='kohort/fmr/daftar-kumur'
                element={
                  <Suspense fallback={<Loading />}>
                    <UserDaftarMuridBuatKumuranFMR />
                  </Suspense>
                }
              />
              <Route
                path='kohort/fmr/daftar-kumur-kohort'
                element={
                  <Suspense fallback={<Loading />}>
                    <UserDaftarMuridKohortBuatKumuranFMR />
                  </Suspense>
                }
              />
              <Route
                path='kohort/fmr/carian'
                element={
                  <Suspense fallback={<Loading />}>
                    <UserCarianMuridFMR />
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
                <UserCarianPesakit />
              </Suspense>
            }
          />
          {import.meta.env.VITE_ENV === 'UNSTABLE' ||
          import.meta.env.VITE_ENV === 'DEV' ? (
            <>
              <Route
                path='carian/sekolah'
                element={
                  <Suspense fallback={<Loading />}>
                    <UserCarianSekolah />
                  </Suspense>
                }
              />
              <Route
                path='carian/sekolah/form-sekolah/pemeriksaan/:personSekolahId/:pemeriksaanSekolahId'
                element={
                  <Suspense fallback={<Loading />}>
                    <UserFormSekolahPemeriksaan salahReten='pemeriksaan-salah' />
                  </Suspense>
                }
              />
            </>
          ) : null}
          <Route
            path='carian/promosi'
            element={
              <Suspense fallback={<Loading />}>
                <UserCarianPromosi />{' '}
              </Suspense>
            }
          />

          <Route
            path='carian/sekolah'
            element={
              <Suspense fallback={<Loading />}>
                <UserCarianSekolah />{' '}
              </Suspense>
            }
          />
          <Route
            path='carian/sekolah/form-sekolah/pemeriksaan/:personSekolahId/:pemeriksaanSekolahId'
            element={
              <Suspense fallback={<Loading />}>
                <UserSalahFormSekolahPemeriksaan salahReten='pemeriksaan-salah' />{' '}
              </Suspense>
            }
          />

          <Route
            path='summary'
            element={
              <Suspense fallback={<Loading />}>
                <UserSummary />
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
