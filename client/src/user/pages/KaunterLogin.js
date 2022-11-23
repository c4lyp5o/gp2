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
          `/api/v1/auth/find?kodFasiliti=${pilihanKlinik}&accountType=kaunterUser`,
          {
            headers: { Authorization: `${process.env.REACT_APP_API_KEY}` },
          }
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
                    name='negeri'
                    id='negeri'
                    value={pilihanNegeri}
                    onChange={(e) => {
                      setPilihanNegeri(e.target.value);
                    }}
                    className='w-full leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md'
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
                    <option value='Kuala Lumpur'>WP Kuala Lumpur</option>
                    <option value='Labuan'>WP Labuan</option>
                    <option value='Putrajaya'>WP Putrajaya</option>
                  </select>
                </div>
                {pilihanNegeri && listDaerah.length >= 1 && (
                  <div className='w-60 flex mr-3'>
                    <label htmlFor='daerah' className='mr-4'>
                      Daerah:
                    </label>
                    <select
                      name='daerah'
                      id='daerah'
                      value={pilihanDaerah}
                      onChange={(e) => {
                        setPilihanDaerah(e.target.value);
                      }}
                      className='w-full leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md'
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
                      name='klinik'
                      id='klinik'
                      value={pilihanKlinik}
                      onChange={(e) => {
                        setPilihanKlinik(e.target.value);
                      }}
                      className='w-full leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md'
                    >
                      <option value=''></option>
                      {listKlinik.map((k) => {
                        return <option value={k.kodFasiliti}>{k.nama}</option>;
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
                  <BusyButton func='pendaftaran' />
                ) : (
                  <SubmitButton func='pendaftaran' />
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
