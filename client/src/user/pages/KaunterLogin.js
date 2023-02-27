import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { Spinner } from 'react-awesome-spinners';
import axios from 'axios';

import { useGlobalUserAppContext } from '../context/userAppContext';

import KaunterHeader from '../components/KaunterHeader';
import KaunterFooter from '../components/KaunterFooter';
import { BusyButton, SubmitButton } from '../../admin/components/Buttons';

function KaunterLogin() {
  const {
    loginErrorMessage,
    isLoginError,
    loginKaunter,
    dictionaryDaerah,
    ToastContainer,
    toast,
    loggingInKaunter,
  } = useGlobalUserAppContext();

  const [pilihanNegeri, setPilihanNegeri] = useState('');
  const [listDaerah, setListDaerah] = useState([]);
  const [pilihanDaerah, setPilihanDaerah] = useState('');
  const [listKlinik, setListKlinik] = useState([]);
  const [pilihanKlinik, setPilihanKlinik] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // fetch dictionary daerah
  useEffect(() => {
    setListDaerah(dictionaryDaerah[pilihanNegeri]);
    setPilihanDaerah('');
    setPilihanKlinik('');
    setUsername('');
  }, [pilihanNegeri]);

  // fetch klinik base on negeri & daerah
  useEffect(() => {
    const fetchKlinik = async () => {
      try {
        const { data } = await axios.get(
          `https://gpass.nocturnal.quest/api/getfs?negeri=${pilihanNegeri}&daerah=${pilihanDaerah}`
        );
        setListKlinik(data);
      } catch (error) {
        console.log(error);
        // toast.error(
        //   'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: kaunter-login-fetchKlinik'
        // );
      }
    };
    fetchKlinik();
    setPilihanKlinik('');
    setUsername('');
  }, [pilihanDaerah]);

  // fetch id klinik
  useEffect(() => {
    const fetchIdKlinik = async () => {
      setShowPasswordBox(false);
      setIsLoading(true);
      try {
        const { data } = await axios.get(
          `/api/v1/auth/find?kodFasiliti=${pilihanKlinik}&accountType=kaunterUser`
        );
        setUsername(data.username);
        setShowPasswordBox(true);
      } catch (error) {
        console.log(error);
        toast.error('Klinik belum didaftarkan di modul Pentadbir Daerah');
      }
      setIsLoading(false);
    };
    if (pilihanKlinik !== '') {
      fetchIdKlinik();
    }
  }, [pilihanKlinik]);

  const hilang = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      loginKaunter({ username, password });
    }, 1000);
  };

  return (
    <>
      <ToastContainer />
      <KaunterHeader />
      <div className='absolute inset-0 -z-10 flex bg-kaunter3 text-center justify-center items-center capitalize'>
        <div className='w-5/6 lg:w-1/2 h-[30rem] lg:h-[25rem] mt-20 mb-5 bg-kaunterWhite outline outline-1 outline-kaunterBlack rounded-md shadow-xl'>
          <div>
            <h3 className='text-xl font-semibold mt-7'>
              sila pilih klinik anda
            </h3>
            <form onSubmit={handleSubmit}>
              <div className='grid grid-rows-2 gap-5 justify-center items-center mt-5'>
                <div className='w-60 flex'>
                  <label htmlFor='negeri' className='mr-5'>
                    Negeri:
                  </label>
                  <select
                    required
                    name='negeri'
                    id='negeri'
                    value={pilihanNegeri}
                    onChange={(e) => {
                      setPilihanNegeri(e.target.value);
                    }}
                    className='w-full leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md'
                    data-cy='negeri'
                  >
                    <option value=''></option>
                    <option value='Johor'>Johor</option>
                    <option value='Kedah'>Kedah</option>
                    <option value='Kelantan'>Kelantan</option>
                    <option value='Melaka'>Melaka</option>
                    <option value='Negeri Sembilan'>Negeri Sembilan</option>
                    <option value='Pahang'>Pahang</option>
                    <option value='Pulau Pinang'>Pulau Pinang</option>
                    <option value='Perak'>Perak</option>
                    <option value='Perlis'>Perlis</option>
                    <option value='Selangor'>Selangor</option>
                    <option value='Terengganu'>Terengganu</option>
                    <option value='Sabah'>Sabah</option>
                    <option value='Sarawak'>Sarawak</option>
                    <option value='WP Kuala Lumpur'>WP Kuala Lumpur</option>
                    <option value='WP Labuan'>WP Labuan</option>
                    <option value='WP Putrajaya'>WP Putrajaya</option>
                    <option value='ILK'>PPKK & ILKKM (Pergigian)</option>
                  </select>
                </div>
                {pilihanNegeri && listDaerah.length >= 1 && (
                  <div className='w-60 flex mr-3'>
                    <label htmlFor='daerah' className='mr-4'>
                      Daerah:
                    </label>
                    <select
                      required
                      name='daerah'
                      id='daerah'
                      value={pilihanDaerah}
                      onChange={(e) => {
                        setPilihanDaerah(e.target.value);
                      }}
                      className='w-full leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md'
                      data-cy='daerah'
                    >
                      <option value=''></option>
                      {listDaerah.map((d) => {
                        return (
                          <option value={d}>
                            {d === 'ILK' ? 'PPKK & ILKKM (Pergigian)' : `${d}`}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
                {pilihanNegeri && pilihanDaerah && listKlinik.length >= 1 && (
                  <div className='w-60 flex'>
                    <label htmlFor='klinik' className='mr-7'>
                      Klinik:
                    </label>
                    <select
                      required
                      name='klinik'
                      id='klinik'
                      value={pilihanKlinik}
                      onChange={(e) => {
                        setPilihanKlinik(e.target.value);
                      }}
                      className='w-full leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md'
                      data-cy='klinik'
                    >
                      <option value=''></option>
                      {listKlinik.map((k) => {
                        return (
                          <option value={k.kodFasilitiGiret}>{k.nama}</option>
                        );
                      })}
                    </select>
                  </div>
                )}
                {isLoading && (
                  <p className='text-xs font-semibold flex justify-center'>
                    <Spinner />
                  </p>
                )}
                {showPasswordBox && pilihanKlinik !== '' && (
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
                      data-cy='password'
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
                )}
              </div>
              {isLoginError && (
                <p className='max-w-max mx-auto mt-5 text-sm text-kaunter6'>
                  {loginErrorMessage}
                </p>
              )}
              <div className='grid lg:grid-cols-2 gap-2 mt-7 ml-20 mr-20'>
                <Link
                  to='/'
                  className='order-last lg:order-first capitalize bg-kaunter3 text-userWhite rounded-md shadow-xl p-2 hover:bg-kaunter1 transition-all'
                >
                  kembali ke halaman utama
                </Link>
                {loggingInKaunter ? (
                  <button
                    type='button'
                    className='inline-flex items-center text-center justify-center px-4 py-2 capitalize bg-kaunter2 text-userWhite rounded-md shadow-xl p-2 hover:bg-kaunter1 transition-all ease-in-out duration-150 cursor-not-allowed'
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
                    className='order-first lg:order-last capitalize bg-kaunter2 text-userWhite rounded-md shadow-xl p-2 hover:bg-kaunter1 transition-all'
                    data-cy='submit'
                  >
                    log masuk
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      <KaunterFooter />
    </>
  );
}

export default KaunterLogin;
