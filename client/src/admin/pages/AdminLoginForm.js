import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';

import { useGlobalAdminAppContext } from '../context/adminAppContext';

import { ToastContainer } from 'react-toastify';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { BusyButton, SubmitButton } from '../components/Buttons';
import { LoadingSuperDark } from '../components/Screens';

import CountdownTimer from '../context/countdownTimer';

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
  const [password, setPassword] = useState(null);
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [kicker, setKicker] = useState(null);

  const [data, setData] = useState(null);
  const [pilihanNegeri, setPilihanNegeri] = useState('');
  const [pilihanDaerah, setPilihanDaerah] = useState('');
  const [pilihanKlinik, setPilihanKlinik] = useState('');

  const currentUser = useRef();

  const buttonProps = {
    pilihanDaerah,
    pilihanKlinik,
    pilihanNegeri,
    userName,
  };

  const hilang = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pilihanDaerah === '' && pilihanKlinik === '') {
      currentUser.current = userName.negeri;
    } else if (pilihanKlinik === '') {
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
          await loginUser({
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
                          key={i.negeri}
                          value={i.negeri}
                          className='capitalize'
                        >
                          {i.negeri}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {pilihanNegeri && pilihanNegeri !== '' && (
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
                                key={i.daerah}
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
                {pilihanNegeri && pilihanDaerah && pilihanDaerah !== '' && (
                  <div className='w-60 flex'>
                    <label htmlFor='klinik' className='mr-7'>
                      Klinik:
                    </label>
                    <select
                      name='klinik'
                      id='klinik'
                      value={pilihanKlinik}
                      onChange={(e) => {
                        const element = document.getElementById('klinik');
                        const getKey =
                          element.options[element.selectedIndex].getAttribute(
                            'data-key'
                          );
                        setPilihanKlinik(e.target.value);
                        setUserName({
                          ...userName,
                          klinik: e.target.value,
                          klinikName: getKey,
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
                                    key={k.username}
                                    data-key={k.nama}
                                    id='klinik'
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
                  <BusyButton func='login' />
                ) : (
                  <SubmitButton func='login' level={buttonProps} />
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
