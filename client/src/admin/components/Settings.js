import { useState, useLayoutEffect, useId } from 'react';
import axios from 'axios';

import { useGlobalAdminAppContext } from '../context/adminAppContext';

import Loading from './Loading';
import TotpConfirmation from './TotpConfirmation';

export default function Settings({ update }) {
  const {
    getCurrentUser,
    saveCurrentUser,
    generateSecret,
    removeTotpToken,
    toast,
  } = useGlobalAdminAppContext();
  const [loginInfo, setLoginInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [profileImageData, setProfileImageData] = useState(null);
  const [totpImage, setTotpImage] = useState('');
  const uploadImage = useId();
  const nama = useId();
  const tarikhLahir = useId();
  const email = useId();
  const totp = useId();

  const encodeImageFileAsURL = (e) => {
    const filesSelected = document.getElementById(uploadImage).files;

    if (filesSelected.length > 0) {
      const fileToLoad = filesSelected[0];
      const fileReader = new FileReader();
      fileReader.onload = function (fileLoadedEvent) {
        const srcData = fileLoadedEvent.target.result;
        const newImage = document.createElement('img');
        newImage.src = srcData;
        axios
          .post('/api/v1/superadmin/newroute', {
            image: srcData.replace(/^data:image\/(png|jpg);base64,/, ''),
            apiKey: process.env.REACT_APP_API_KEY,
            main: 'ImageResizer',
            Fn: 'resize',
          })
          .then((res) => {
            console.log(res.data);
            setProfileImageData(res.data.imgSrc);
          });
        // document.getElementById(currentImage).innerHTML = newImage.outerHTML;
        // document.getElementById('divDynamic').innerHTML = newImage.src;
      };
      fileReader.readAsDataURL(fileToLoad);
    }
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
      tarikhLahir: e.target[tarikhLahir].value,
      email: e.target[email].value,
      totp: loginInfo.totp,
      image: profileImageData,
    };
    if (!profileImageData) {
      delete data.image;
    }
    saveCurrentUser(data);
    toast.success('Profil berjaya dikemaskini');
  };

  useLayoutEffect(() => {
    getCurrentUser().then((res) => {
      setLoginInfo({ ...res.data });
      setLoading(false);
    });
    if (!loginInfo.totp) {
      generateSecret().then((res) => {
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
          <div className='w-1/3 mx-auto'>
            <form onSubmit={handleSubmit}>
              {loginInfo.accountType !== 'kpSuperadmin' ? (
                <>
                  <label
                    htmlFor={uploadImage}
                    className='block text-sm font-medium text-gray-700'
                  >
                    Muat naik gambar
                  </label>
                  <div className='mt-5 items-center'>
                    {profileImageData ? (
                      <img
                        src={profileImageData}
                        alt='profile'
                        className='w-32 h-32 rounded-full mr-auto ml-auto'
                      />
                    ) : (
                      <img
                        src={loginInfo.image}
                        alt='profile'
                        className='w-32 h-32 rounded-full mr-auto ml-auto'
                      />
                    )}
                    <input
                      type='file'
                      id={uploadImage}
                      name={uploadImage}
                      accept='image/*'
                      onChange={(e) => {
                        encodeImageFileAsURL(e);
                      }}
                    />
                  </div>
                </>
              ) : null}
              <label
                htmlFor={nama}
                className='block text-sm font-medium text-gray-700'
              >
                Nama Pengguna
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
              <label htmlFor={tarikhLahir}>Tarikh Lahir</label>
              <input
                type='date'
                name='tarikhLahir'
                id={tarikhLahir}
                className='mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                value={loginInfo.tarikhLahir}
                onChange={(e) =>
                  setLoginInfo({ ...loginInfo, tarikhLahir: e.target.value })
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
                value={loginInfo.totp}
                className='mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                onChange={(e) => setLoginInfo({ ...loginInfo, totp: false })}
              />
              Tidak aktif
              <input
                type='radio'
                checked={loginInfo.totp === true}
                name='totpInactive'
                id={totp}
                value={loginInfo.totp}
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
        </div>
      )}
    </TotpConfirmation>
  );
}
