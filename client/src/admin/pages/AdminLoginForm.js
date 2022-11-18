import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';

import { useGlobalAdminAppContext } from '../context/adminAppContext';

import { ToastContainer } from 'react-toastify';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { LoadingSuperDark } from '../components/Screens';

import CountdownTimer from '../context/countdownTimer';

function userIDBox({ setUserName, showUserIDBox }) {
  if (showUserIDBox === true) {
    return (
      <div className='flex justify-center items-center'>
        <div className='relative'>
          <input
            className='mt-5 appearance-none leading-7 px-3 py-1 ring-2 ring-admin4 focus:ring-2 focus:ring-admin1 focus:outline-none rounded-md peer'
            type='text'
            placeholder=' '
            name='usernameAdmin'
            id='usernameAdmin'
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <label
            htmlFor='usernameAdmin'
            className='absolute left-3 bottom-8 text-xs text-admin1 bg-userWhite peer-placeholder-shown:text-admin4 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-8 peer-focus:text-xs transition-all'
          >
            ID Pengguna
          </label>
        </div>
      </div>
    );
  }
}

function passwordBox({ setPassword, showPasswordBox, showPassword, hilang }) {
  const fiveMinutes = 5 * 60 * 1000;
  const nowMinutes = new Date().getTime();
  const realCountdown = nowMinutes + fiveMinutes;
  if (showPasswordBox === true) {
    return (
      <div className='flex flex-col justify-center items-center'>
        <h3 className='text-xl font-semibold mt-5'>
          sila masukkan Key verifikasi
        </h3>
        <div className='relative'>
          <input
            className='mt-5 appearance-none leading-7 px-3 py-1 ring-2 ring-admin4 focus:ring-2 focus:ring-admin1 focus:outline-none rounded-md peer'
            type={showPassword ? 'text' : 'password'}
            name='passwordAdmin'
            id='passwordAdmin'
            placeholder=' '
            onChange={(e) => {
              setPassword(e.target.value);
              console.log(e.target.value);
            }}
            required
          />
          <label
            htmlFor='passwordAdmin'
            className='absolute left-3 bottom-8 text-xs text-admin1 bg-userWhite peer-placeholder-shown:text-admin1 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-8 peer-focus:text-xs transition-all'
          >
            Kata Laluan
          </label>
          <div className='absolute top-7 right-3 text-xl text-admin1'>
            {showPassword ? (
              <AiFillEye onClick={hilang} />
            ) : (
              <AiFillEyeInvisible onClick={hilang} />
            )}
          </div>
        </div>
        <div className='mt-2'>
          <CountdownTimer deadline={realCountdown} />
        </div>
      </div>
    );
  }
}

export default function AdminLoginForm() {
  const { toast, loginUser, checkUser, navigate, readSuperadminData } =
    useGlobalAdminAppContext();
  const [userName, setUserName] = useState(null);
  const [showUserIDBox, setShowUserIDBox] = useState(true);
  const [password, setPassword] = useState(null);
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [kicker, setKicker] = useState(null);

  const [data, setData] = useState(null);
  const [pilihanNegeri, setPilihanNegeri] = useState(null);
  const [pilihanDaerah, setPilihanDaerah] = useState(null);
  const [pilihanKlinik, setPilihanKlinik] = useState(null);

  const currentUser = useRef();

  const hilang = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pilihanDaerah && !pilihanKlinik) {
      currentUser.current = userName.negeri;
    } else if (!pilihanKlinik) {
      currentUser.current = userName.daerah;
    } else {
      currentUser.current = userName.klinik;
    }

    if (showPasswordBox === false) {
      try {
        const response = await checkUser(currentUser.current);
        // if kp superadmin
        if (response.data.accountType === 'kpSuperadmin') {
          toast.info(`Sila isi password`);
          setShowPasswordBox(true);
          return;
        }
        // if superadmin biasa
        // if using TOTP
        if (
          response.data.accountType !== 'kpSuperadmin' &&
          response.data.totp
        ) {
          toast.info(`Sila isi TOTP dari aplikasi yang anda gunakan`);
          setShowPasswordBox(true);
          return;
        }
        // if using email
        toast.info(
          `Key Verifikasi telah dihantar ke ${response.data.email}. Sila isi di ruang Key Verifikasi. Mohon untuk memeriksa folder spam dan tandakan email dari Key Master sebagai bukan spam.`
        );
        const numkicker = setTimeout(() => {
          toast.error(
            'Masa untuk login telah habis. Sila masukkan ID semula untuk login!'
          );
          setUserName('');
          setShowPasswordBox(false);
          navigate('/pentadbir');
        }, 1000 * 60 * 5);
        setKicker(numkicker);
        setShowPasswordBox(true);
      } catch (e) {
        toast.error(e.response.data.message);
      }
    }

    if (showPasswordBox === true) {
      setLoggingIn(true);
      setTimeout(async () => {
        try {
          const response = await loginUser({
            username: currentUser.current,
            password,
          });
          setLoggingIn(false);
          clearTimeout(kicker);
          navigate('/pentadbir/landing');
        } catch (e) {
          toast.error(e.response.data.message);
          setLoggingIn(false);
        }
      }, 1000);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await readSuperadminData();
        console.log(response);
        return response;
      } catch (e) {
        console.log(e);
      }
    };
    getData().then((res) => {
      setData(res.data);
    });
  }, []);

  if (!data) {
    return <LoadingSuperDark />;
  }

  return (
    <>
      <Header />
      <div className='absolute inset-0 -z-10 flex bg-admin5 text-center justify-center items-center capitalize'>
        <div className='w-1/2 h-[25rem] mt-20 mb-5 bg-adminWhite outline outline-1 outline-userBlack rounded-md shadow-xl'>
          <div className='login-wrapper'>
            <h3 className='text-xl font-semibold mt-10'>
              sila masukkan ID pentadbir
            </h3>
            <form onSubmit={handleSubmit}>
              {/* {userIDBox({ setUserName, showUserIDBox })}
              {passwordBox({
                setPassword,
                showPasswordBox,
                showPassword,
                hilang,
              })} */}
              <div className='grid grid-rows-2 gap-5 justify-center items-center mt-5'>
                <div className='w-60 flex'>
                  <label htmlFor='negeri' className='mr-5'>
                    Negeri:
                  </label>
                  <select
                    name='negeri'
                    id='negeri'
                    value={pilihanNegeri}
                    onChange={(e) => {
                      setPilihanNegeri(e.target.value);
                      setUserName({
                        ...userName,
                        negeri: `negeri${e.target.value}`,
                      });
                    }}
                    className='w-full leading-7 px-3 py-1 ring-2 ring-admin4 focus:ring-2 focus:ring-admin1 focus:outline-none rounded-md peer shadow-md capitalize'
                  >
                    <option value=''>Sila Pilih Negeri...</option>
                    {data.map((i) => {
                      return (
                        <option
                          key={i.id}
                          value={i.negeri}
                          className='capitalize'
                        >
                          {i.negeri}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {pilihanNegeri && (
                  <div className='w-60 flex mr-3'>
                    <label htmlFor='daerah' className='mr-4'>
                      Daerah:
                    </label>
                    <select
                      name='daerah'
                      id='daerah'
                      value={pilihanDaerah}
                      onChange={(e) => {
                        const element = document.getElementById('daerah');
                        const getKey =
                          element.options[element.selectedIndex].getAttribute(
                            'data-key'
                          );
                        console.log(getKey);
                        setPilihanDaerah(e.target.value);
                        setUserName({
                          ...userName,
                          daerah: getKey,
                        });
                      }}
                      className='w-full leading-7 px-3 py-1 ring-2 ring-admin4 focus:ring-2 focus:ring-admin1 focus:outline-none rounded-md peer shadow-md capitalize'
                    >
                      <option value=''>Sila Pilih Daerah...</option>
                      {data.map((d) => {
                        if (d.negeri === pilihanNegeri) {
                          return d.daerah.map((i) => {
                            return (
                              <option
                                id='daerah'
                                data-key={i.username}
                                value={i.daerah}
                                className='capitalize'
                              >
                                {i.daerah}
                              </option>
                            );
                          });
                        }
                      })}
                    </select>
                  </div>
                )}
                {pilihanNegeri && pilihanDaerah && (
                  <div className='w-60 flex'>
                    <label htmlFor='klinik' className='mr-7'>
                      Klinik:
                    </label>
                    <select
                      name='klinik'
                      id='klinik'
                      value={pilihanKlinik}
                      onChange={(e) => {
                        setPilihanKlinik(e.target.value);
                        setUserName({
                          ...userName,
                          klinik: e.target.value,
                        });
                      }}
                      className='w-full leading-7 px-3 py-1 ring-2 ring-admin4 focus:ring-2 focus:ring-admin1 focus:outline-none rounded-md peer shadow-md'
                    >
                      <option value=''>Sila Pilih Klinik</option>
                      {data.map((d) => {
                        if (d.negeri === pilihanNegeri) {
                          return d.daerah.map((i) => {
                            if (i.daerah === pilihanDaerah) {
                              return i.klinik.map((k) => {
                                return (
                                  <option
                                    key={k.id}
                                    value={k.username}
                                    className='capitalize'
                                  >
                                    {k.nama}
                                  </option>
                                );
                              });
                            }
                          });
                        }
                      })}
                    </select>
                  </div>
                )}
                {/* {isLoading && (
                  <p className='text-xs font-semibold flex justify-center'>
                    <Spinner />
                  </p>
                )} */}
                {/* {showPasswordBox && pilihanKlinik !== '' && (
                  <div className='relative'>
                    <input
                      className='mt-3 appearance-none leading-7 px-3 py-1 ring-2 ring-kaunter2 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md peer'
                      type={showPassword ? 'text' : 'password'}
                      placeholder=' '
                      id='password-pendaftaran'
                      name='password-pendaftaran'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <label
                      htmlFor='password-pendaftaran'
                      className='absolute left-7 bottom-8 text-xs text-kaunter2 bg-userWhite peer-placeholder-shown:text-kaunter2 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-8 peer-focus:text-xs transition-all'
                    >
                      Kata Laluan
                    </label>
                    <div className='absolute top-5 right-7 text-xl text-kaunter2'>
                      {showPassword ? (
                        <AiFillEye onClick={hilang} />
                      ) : (
                        <AiFillEyeInvisible onClick={hilang} />
                      )}
                    </div>
                  </div>
                )} */}
                {passwordBox({
                  setPassword,
                  showPasswordBox,
                  showPassword,
                  hilang,
                })}
              </div>
              <div className='grid grid-cols-2 gap-2 mt-5 ml-20 mr-20'>
                <Link
                  to='/'
                  className='capitalize bg-admin4 text-adminWhite rounded-md shadow-xl p-2 hover:bg-admin1 transition-all'
                >
                  kembali ke halaman utama
                </Link>
                {loggingIn ? (
                  <button
                    type='button'
                    className='inline-flex items-center text-center justify-center px-4 py-2 bg-admin3 text-adminWhite rounded-md shadow-xl p-2 hover:bg-admin1 transition-all ease-in-out duration-150 cursor-not-allowed'
                    disabled=''
                  >
                    <svg
                      className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    Sedang Log Masuk...
                  </button>
                ) : (
                  <button
                    type='submit'
                    className='capitalize bg-admin3 text-adminWhite rounded-md shadow-xl p-2 hover:bg-admin1 transition-all'
                  >
                    log masuk
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}
