import { useState, useLayoutEffect, useId } from 'react';

import { useGlobalAdminAppContext } from '../context/adminAppContext';

import Loading from './Loading';
import TotpConfirmation from './TotpConfirmation';

export default function Settings() {
  const { getCurrentUser, saveCurrentUser, generateSecret, removeTotpToken } =
    useGlobalAdminAppContext();
  const [loginInfo, setLoginInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [totpImage, setTotpImage] = useState('');
  const nama = useId();
  const email = useId();
  const totp = useId();

  const generateTotpSecret = async () => {
    const secret = await generateSecret();
    return secret;
  };

  const enableTotp = () => {
    setLoginInfo({
      ...loginInfo,
      totp: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      nama: e.target[nama].value,
      email: e.target[email].value,
      totp: loginInfo.totp,
    };
    saveCurrentUser(data).then((res) => {
      console.log(res);
    });
  };

  useLayoutEffect(() => {
    getCurrentUser().then((res) => {
      setLoginInfo({ ...res.data });
      setLoading(false);
    });
    if (!loginInfo.totp) {
      generateTotpSecret().then((res) => {
        setTotpImage(res.data.qrcode);
      });
    }
    return () => removeTotpToken();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <TotpConfirmation callbackFunction={enableTotp} image={totpImage}>
      {(confirm) => (
        <div>
          <form onSubmit={handleSubmit}>
            <label
              htmlFor={nama}
              className='block text-sm font-medium text-gray-700'
            >
              Username
            </label>
            <input
              type='text'
              name='username'
              id={nama}
              className='mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
              value={loginInfo.username}
              onChange={(e) =>
                setLoginInfo({ ...loginInfo, username: e.target.value })
              }
            />
            <label
              htmlFor={email}
              className='block text-sm font-medium text-gray-700'
            >
              Emel
            </label>
            <input
              type='text'
              name='email'
              id={email}
              className='mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
              value={loginInfo.e_mail}
              onChange={(e) =>
                setLoginInfo({ ...loginInfo, email: e.target.value })
              }
            />
            <label
              htmlFor={totp}
              className='block text-sm font-medium text-gray-700'
            >
              TOTP
            </label>
            <input
              checked={loginInfo.totp === false}
              type='radio'
              name='totpActive'
              id={totp}
              value={false}
              className='mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
              onChange={(e) => setLoginInfo({ ...loginInfo, totp: false })}
            />
            Tidak aktif
            <input
              type='radio'
              checked={loginInfo.totp === true}
              name='totpInactive'
              id={totp}
              value={true}
              className='mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
              onChange={confirm(enableTotp)}
            />
            Diaktifkan
            <div>
              <button
                type='submit'
                className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </TotpConfirmation>
  );
}
