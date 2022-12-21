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

function NegeriBox(props) {
  return (
    <div className='w-60 flex m-auto'>
      <label htmlFor='negeri' className='mr-5'>
        Negeri:
      </label>
      <select
        required
        name='negeri'
        id='negeri'
        value={props.pilihanNegeri}
        onChange={(e) => {
          props.setPilihanNegeri(e.target.value);
          props.setUserName({
            ...props.userName,
            negeri: e.target.value,
          });
        }}
        className='w-full leading-7 px-3 py-1 ring-2 ring-admin4 focus:ring-2 focus:ring-admin1 focus:outline-none rounded-md peer shadow-md capitalize'
      >
        <option value=''>Sila Pilih Negeri...</option>
        <option value='hqputrajaya' className='capitalize'>
          PKP KKM HQ
        </option>
        {props.allNegeri.map((n) => {
          return (
            <option key={n.negeri} value={n.username} className='capitalize'>
              {n.negeri}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function DaerahBox(props) {
  return (
    <div className='w-60 flex m-auto'>
      <label htmlFor='negeri' className='mr-5'>
        Daerah:
      </label>
      <select
        name='daerah'
        id='daerah'
        value={props.pilihanDaerah}
        onChange={(e) => {
          const element = document.getElementById('daerah');
          const getKey =
            element.options[element.selectedIndex].getAttribute('data-key');
          props.setPilihanDaerah(e.target.value);
          props.setUserName({
            ...props.userName,
            daerah: getKey,
          });
        }}
        className='w-full leading-7 px-3 py-1 ring-2 ring-admin4 focus:ring-2 focus:ring-admin1 focus:outline-none rounded-md peer shadow-md capitalize'
      >
        <option value=''>Sila Pilih Negeri...</option>
        {props.allDaerah.map((d) => {
          return (
            <option
              key={d.daerah}
              data-key={d.username}
              value={d.daerah}
              className='capitalize'
            >
              {d.daerah}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function KlinikBox(props) {
  return (
    <div className='w-60 flex m-auto'>
      <label htmlFor='klinik' className='mr-7'>
        Klinik:
      </label>
      <select
        name='klinik'
        id='klinik'
        value={props.pilihanKlinik}
        onChange={(e) => {
          const element = document.getElementById('klinik');
          const getKey =
            element.options[element.selectedIndex].getAttribute('data-key');
          props.setPilihanKlinik(e.target.value);
          props.setUserName({
            ...props.userName,
            klinik: e.target.value,
            klinikName: getKey,
          });
        }}
        className='w-full leading-7 px-3 py-1 ring-2 ring-admin4 focus:ring-2 focus:ring-admin1 focus:outline-none rounded-md peer shadow-md'
      >
        <option value=''>Sila Pilih Klinik</option>
        {props.allKlinik.map((k) => {
          return (
            <option
              key={k.kp}
              data-key={k.kp}
              id='klinik'
              value={k.kodFasiliti}
              className='capitalize'
            >
              {k.kp}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function AdminBox(props) {
  return (
    <div className='w-96 flex'>
      <label htmlFor='klinik' className='mr-7'>
        Pentadbir:
      </label>
      <select
        name='pentadbir'
        id='pentadbir'
        value={props.pilihanAdmin}
        onChange={(e) => {
          props.setPilihanAdmin(e.target.value);
          props.setUserName({
            ...props.userName,
            admin: e.target.value,
          });
        }}
        className='w-full leading-7 px-3 py-1 ring-2 ring-admin4 focus:ring-2 focus:ring-admin1 focus:outline-none rounded-md peer shadow-md'
      >
        <option value=''>Sila Pilih Pentadbir</option>
        {props.allAdmin.map((a) => {
          return (
            <option
              key={a.nama}
              id='admin'
              value={a.mdcNumber ? a.mdcNumber : a.mdtbNumber}
              className='capitalize'
            >
              {a.nama.toUpperCase()}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function PasswordBox({ setPassword, showPasswordBox, showPassword, hilang }) {
  const fiveMinutes = 5 * 60 * 1000;
  const nowMinutes = new Date().getTime();
  const realCountdown = nowMinutes + fiveMinutes;
  if (showPasswordBox === true) {
    return (
      <div className='flex flex-col justify-center items-center'>
        <h3 className='text-xl font-semibold mt-1'>
          sila masukkan Kunci verifikasi
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
            Kunci Verifikasi
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
  const {
    toast,
    loginUser,
    checkUser,
    navigate,
    readNegeri,
    readDaerah,
    readKlinik,
    readAdmins,
  } = useGlobalAdminAppContext();
  const [userName, setUserName] = useState({
    negeri: null,
    daerah: null,
    klinik: null,
    admin: null,
    klinikName: null,
  });
  const [password, setPassword] = useState(null);
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [kicker, setKicker] = useState(null);

  const [allNegeri, setAllNegeri] = useState([]);
  const [allDaerah, setAllDaerah] = useState([]);
  const [allKlinik, setAllKlinik] = useState([]);
  const [allAdmin, setAllAdmin] = useState([]);
  const [pilihanNegeri, setPilihanNegeri] = useState('');
  const [pilihanDaerah, setPilihanDaerah] = useState('');
  const [pilihanKlinik, setPilihanKlinik] = useState('');
  const [pilihanAdmin, setPilihanAdmin] = useState('');

  const currentUser = useRef();

  const buttonProps = {
    pilihanNegeri,
    pilihanDaerah,
    pilihanKlinik,
    userName,
  };

  const selectionBoxProps = {
    allNegeri,
    allDaerah,
    allKlinik,
    allAdmin,
    pilihanNegeri,
    setPilihanNegeri,
    pilihanDaerah,
    setPilihanDaerah,
    pilihanKlinik,
    setPilihanKlinik,
    pilihanAdmin,
    setPilihanAdmin,
    setUserName,
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
      currentUser.current = userName.admin;
    }

    if (
      showPasswordBox === false &&
      pilihanNegeri !== '' &&
      pilihanDaerah !== '' &&
      pilihanKlinik !== '' &&
      pilihanAdmin === ''
    ) {
      return toast.error('Sila pilih pentadbir klinik');
    }

    if (showPasswordBox === false) {
      try {
        setLoggingIn(true);
        const response = await checkUser(currentUser.current);
        setLoggingIn(false);
        // if kp superadmin
        if (response.data.accountType === 'kpSuperadmin') {
          toast.info(
            `Kunci Verifikasi telah dihantar ke ${response.data.email}. Sila isi di ruang Kunci Verifikasi. Mohon untuk memeriksa folder spam dan tandakan email dari Key Master sebagai bukan spam.`
          );
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
          setUserName(null);
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
        const response = await readNegeri();
        // console.log(response.data);
        setAllNegeri(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (pilihanNegeri === '' || pilihanNegeri === 'hqputrajaya') {
      return;
    }
    const getData = async () => {
      try {
        const response = await readDaerah(pilihanNegeri);
        // console.log(response.data);
        setAllDaerah(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    getData();
  }, [pilihanNegeri]);

  useEffect(() => {
    if (pilihanDaerah === '') {
      return;
    }
    const getData = async () => {
      try {
        const response = await readKlinik(pilihanDaerah);
        // console.log(response.data);
        setAllKlinik(response.data);
      } catch (e) {
        console.log(e);
        toast.error(
          'Tiada Klinik yang telah didaftarkan. Sila hubungi pentadbir daerah anda.'
        );
        setPilihanDaerah('');
      }
    };
    getData();
  }, [pilihanDaerah]);

  useEffect(() => {
    if (pilihanKlinik === '') {
      return;
    }
    const getData = async () => {
      try {
        const response = await readAdmins(pilihanKlinik);
        // console.log(response.data);
        setAllAdmin(response.data);
      } catch (e) {
        console.log(e);
        toast.error(
          'Tiada Pentadbir Klinik yang telah didaftarkan. Sila hubungi pentadbir daerah anda.'
        );
        setPilihanKlinik('');
      }
    };
    getData();
  }, [pilihanKlinik]);

  // to reset value if dropdown selection change
  useEffect(() => {
    setUserName({
      ...userName,
      daerah: null,
      klinik: null,
      admin: null,
      klinikName: null,
    });
    setPilihanDaerah('');
    setPilihanKlinik('');
    setPilihanAdmin('');
    setShowPasswordBox(false);
  }, [pilihanNegeri]);

  useEffect(() => {
    setUserName({
      ...userName,
      klinik: null,
      admin: null,
      klinikName: null,
    });
    setPilihanKlinik('');
    setPilihanAdmin('');
    setShowPasswordBox(false);
  }, [pilihanDaerah]);

  useEffect(() => {
    setUserName({
      ...userName,
      admin: null,
    });
    setPilihanAdmin('');
    setShowPasswordBox(false);
  }, [pilihanKlinik]);

  if (allNegeri.length === 0) {
    return <LoadingSuperDark />;
  }

  return (
    <>
      <Header />
      <div className='absolute inset-0 -z-10 flex bg-admin5 text-center justify-center items-center capitalize'>
        <div className='w-1/2 h-[33rem] mt-20 bg-adminWhite outline outline-1 outline-userBlack rounded-md shadow-xl'>
          <div className='login-wrapper'>
            <h3 className='text-xl font-semibold mt-7'>
              sila pilih untuk log masuk
            </h3>
            <form onSubmit={handleSubmit}>
              <div className='grid grid-rows-2 gap-5 justify-center items-center mt-5'>
                <NegeriBox {...selectionBoxProps} />
                {pilihanNegeri &&
                  pilihanNegeri !== '' &&
                  pilihanNegeri !== 'hqputrajaya' && (
                    <DaerahBox {...selectionBoxProps} />
                  )}
                {pilihanNegeri && pilihanDaerah && pilihanDaerah !== '' && (
                  <KlinikBox {...selectionBoxProps} />
                )}
                {pilihanNegeri &&
                  pilihanDaerah &&
                  pilihanKlinik &&
                  pilihanKlinik !== '' && <AdminBox {...selectionBoxProps} />}
                {PasswordBox({
                  setPassword,
                  showPasswordBox,
                  showPassword,
                  hilang,
                })}
              </div>
              <div className='grid grid-cols-2 gap-2 mt-7 ml-20 mr-20'>
                <Link
                  to='/'
                  className='capitalize bg-admin4 text-adminWhite rounded-md shadow-xl p-2 hover:bg-admin1 transition-all'
                >
                  kembali ke halaman utama
                </Link>
                {loggingIn ? (
                  <BusyButton func='pentadbir' />
                ) : (
                  <SubmitButton func='pentadbir' level={buttonProps} />
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
