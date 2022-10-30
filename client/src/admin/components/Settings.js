import { useState, useLayoutEffect, useId } from 'react';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import CryptoJS from 'crypto-js';

import { useGlobalAdminAppContext } from '../context/adminAppContext';

import Loading from './Loading';
import TotpConfirmation from './TotpConfirmation';

export default function Settings() {
  const { getCurrentUser, saveCurrentUser } = useGlobalAdminAppContext();
  const [loginInfo, setLoginInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [totpConfirmation, setTotpConfirmation] = useState(false);
  const nama = useId();
  const email = useId();
  const totp = useId();

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
      totp: e.target[totp].value,
    };
    console.log(data);
    saveCurrentUser(data).then((res) => {
      console.log(res);
    });
  };

  useLayoutEffect(() => {
    getCurrentUser().then((res) => {
      setLoginInfo({ ...res.data });
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <TotpConfirmation callbackFunction={enableTotp}>
      {(confirm) => (
        <div>
          <form onSubmit={handleSubmit}>
            <p>hi im settings</p>
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
              checked={loginInfo.totp === true}
              type='radio'
              name='totpActive'
              id={totp}
              className='mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
              value={true}
              onChange={(e) =>
                setLoginInfo({ ...loginInfo, totp: e.target.value })
              }
            />
            Tidak aktif
            <input
              type='radio'
              checked={loginInfo.totp === false}
              name='totpInactive'
              id={totp}
              className='mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
              value={false}
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
