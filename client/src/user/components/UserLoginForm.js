import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { Spinner } from 'react-awesome-spinners';
import axios from 'axios';

import { useGlobalUserAppContext } from '../context/userAppContext';

import UserForgotPassword from './UserForgotPassword';
import { BusyButton, SubmitButton } from '../../admin/components/Buttons';

function UserLoginForm() {
  const {
    loginErrorMessage,
    isLoginError,
    loginUser,
    dictionaryDaerah,
    toast,
    loggingInUser,
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

  const [isForgotPassword, setIsForgotPassword] = useState(false);

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
          `https://erkm.calypsocloud.one/fasiliti?negeri=${pilihanNegeri}&daerah=${pilihanDaerah}`
        );
        setListKlinik(data.data);
      } catch (error) {
        console.log(error);
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
          `/api/v1/auth/find?kodFasiliti=${pilihanKlinik}&accountType=kpUser`
        );
        setUsername(data.username);
        setShowPasswordBox(true);
      } catch (error) {
        toast.error('Klinik belum didaftarkan di modul Pentadbir');
        console.log(error);
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
      loginUser({ username, password });
    }, 1000);
  };

  if (isForgotPassword === true) {
    return <UserForgotPassword setIsForgotPassword={setIsForgotPassword} />;
  }

  return (
    <>
      <h3 className='text-xl font-semibold mt-7'>sila pilih klinik anda</h3>
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
              className='w-full leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
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
              <option value='ILK'>PPKK & ILKKM</option>
            </select>
          </div>
          {pilihanNegeri && listDaerah.length >= 1 && (
            <div className='w-60 flex'>
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
                className='w-full leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
              >
                <option value=''></option>
                {listDaerah.map((d) => {
                  return <option value={d}>{d}</option>;
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
                className='w-full leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
              >
                <option value=''></option>
                {listKlinik.map((k) => {
                  return <option value={k.kodFasilitiGiret}>{k.nama}</option>;
                })}
              </select>
            </div>
          )}
          {isLoading && (
            <p className='text-xs font-semibold flex justify-center'>
              <Spinner color='#1f315f' />
            </p>
          )}
          {showPasswordBox && pilihanKlinik !== '' && (
            <div className='relative'>
              <input
                className='mt-3 appearance-none leading-7 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user3 focus:outline-none rounded-md peer'
                type={showPassword ? 'text' : 'password'}
                placeholder=' '
                value={password}
                id='password'
                name='password'
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label
                htmlFor='password'
                className='absolute left-5 bottom-8 text-xs text-user3 bg-userWhite peer-placeholder-shown:text-user3 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-8 peer-focus:text-xs transition-all'
              >
                Kata Laluan
              </label>
              <div className='absolute top-5 right-5 text-xl text-user3'>
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
          <p className='max-w-max mx-auto mt-5 text-sm text-user6'>
            {loginErrorMessage}
          </p>
        )}
        {/* <p
          className='max-w-max mx-auto mt-5 mb-3 text-xs text-user6 underline hover:cursor-pointer'
          onClick={() => setIsForgotPassword(true)}
        >
          lupa kata laluan
        </p> */}
        <div className='grid lg:grid-cols-2 gap-2 mt-7 ml-20 mr-20'>
          <Link
            to='/'
            className='order-last lg:order-first capitalize bg-user6 text-userWhite rounded-md shadow-xl p-2 hover:bg-user1 transition-all'
          >
            kembali ke halaman utama
          </Link>
          {loggingInUser ? (
            <button
              type='button'
              className='inline-flex items-center text-center justify-center px-4 py-2 order-first lg:order-last capitalize bg-user3 text-userWhite rounded-md shadow-xl p-2 hover:bg-user1 transition-all ease-in-out duration-150 cursor-not-allowed'
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
              className='order-first lg:order-last capitalize bg-user3 text-userWhite rounded-md shadow-xl p-2 hover:bg-user1 transition-all'
            >
              log masuk
            </button>
          )}
        </div>
      </form>
    </>
  );
}

export default UserLoginForm;
