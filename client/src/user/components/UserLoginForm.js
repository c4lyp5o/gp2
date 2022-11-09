import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import axios from 'axios';

import { useGlobalUserAppContext } from '../context/userAppContext';

import UserForgotPassword from './UserForgotPassword';

function UserLoginForm() {
  const {
    loginErrorMessage,
    isLoginError,
    loginUser,
    dictionaryDaerah,
    loggingInUser,
  } = useGlobalUserAppContext();

  const [pilihanNegeri, setPilihanNegeri] = useState('');
  const [listDaerah, setListDaerah] = useState([]);
  const [pilihanDaerah, setPilihanDaerah] = useState('');
  const [listKlinik, setListKlinik] = useState([]);
  const [pilihanKlinik, setPilihanKlinik] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
      try {
        const { data } = await axios.get(
          `/api/v1/auth/find?kodFasiliti=${pilihanKlinik}&accountType=kpUser`,
          {
            headers: { Authorization: `${process.env.REACT_APP_API_KEY}` },
          }
        );
        setUsername(data.username);
      } catch (error) {
        console.log(error);
      }
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
      <h3 className='text-xl font-semibold mt-10'>sila masukkan kata laluan</h3>
      <form onSubmit={handleSubmit}>
        <div className='grid grid-rows-2 gap-2 justify-center items-center'>
          <div>
            <label htmlFor='negeri'>Negeri</label>
            <select
              name='negeri'
              id='negeri'
              value={pilihanNegeri}
              onChange={(e) => {
                setPilihanNegeri(e.target.value);
              }}
            >
              <option value=''></option>
              <option value='Johor'>Johor</option>
              <option value='Kedah'>Kedah</option>
              <option value='Kelantan'>Kelantan</option>
              <option value='Melaka'>Melaka</option>
              <option value='Negeri sembilan'>Negeri Sembilan</option>
              <option value='Pahang'>Pahang</option>
              <option value='Pulau pinang'>Pulau Pinang</option>
              <option value='Perak'>Perak</option>
              <option value='Perlis'>Perlis</option>
              <option value='Selangor'>Selangor</option>
              <option value='Terengganu'>Terengganu</option>
              <option value='Sabah'>Sabah</option>
              <option value='Sarawak'>Sarawak</option>
              <option value='Kuala lumpur'>Kuala Lumpur</option>
              <option value='Labuan'>Labuan</option>
              <option value='Putrajaya'>Putrajaya</option>
            </select>
          </div>
          {pilihanNegeri && listDaerah.length >= 1 && (
            <div>
              <label htmlFor='daerah'>Daerah</label>
              <select
                name='daerah'
                id='daerah'
                value={pilihanDaerah}
                onChange={(e) => {
                  setPilihanDaerah(e.target.value);
                }}
                className='capitalize'
              >
                <option value=''></option>
                {listDaerah.map((d) => {
                  return <option value={d}>{d}</option>;
                })}
              </select>
            </div>
          )}
          {pilihanNegeri && pilihanDaerah && listKlinik.length >= 1 && (
            <div>
              <label htmlFor='klinik'>Klinik</label>
              <select
                name='klinik'
                id='klinik'
                value={pilihanKlinik}
                onChange={(e) => {
                  setPilihanKlinik(e.target.value);
                }}
              >
                <option value=''></option>
                {listKlinik.map((k) => {
                  return <option value={k.kodFasiliti}>{k.nama}</option>;
                })}
              </select>
            </div>
          )}
          <div className='relative'>
            <input
              className='mt-5 appearance-none leading-7 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user3 focus:outline-none rounded-md peer'
              type='text'
              placeholder=' '
              id='username'
              name='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label
              htmlFor='username'
              className='absolute left-3 bottom-8 text-xs text-user3 bg-userWhite peer-placeholder-shown:text-user3 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-8 peer-focus:text-xs transition-all'
            >
              ID Pengguna
            </label>
          </div>
          <div className='relative'>
            <input
              className='mt-5 appearance-none leading-7 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user3 focus:outline-none rounded-md peer'
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
              className='absolute left-3 bottom-8 text-xs text-user3 bg-userWhite peer-placeholder-shown:text-user3 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-8 peer-focus:text-xs transition-all'
            >
              Kata Laluan
            </label>
            <div className='absolute top-7 right-3 text-xl text-user3'>
              {showPassword ? (
                <AiFillEye onClick={hilang} />
              ) : (
                <AiFillEyeInvisible onClick={hilang} />
              )}
            </div>
          </div>
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
