import { useState, useLayoutEffect, useId } from 'react';

import { useGlobalAdminAppContext } from '../context/adminAppContext';

import Loading from './Loading';
import TotpConfirmation from './TotpConfirmation';

export default function Settings({ update }) {
  const {
    getCurrentUser,
    saveCurrentUser,
    generateSecret,
    removeTotpToken,
    resizeImage,
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
      if (fileToLoad.size > 1000000) {
        toast.error(
          'Gambar terlalu besar. Sila muat naik gambar yang lebih kecil. Maksimum 1MB.'
        );
        return;
      }
      const fileReader = new FileReader();
      fileReader.onload = async function (fileLoadedEvent) {
        const srcData = fileLoadedEvent.target.result;
        const data = {
          type: fileToLoad.type,
          image: srcData,
        };
        try {
          const resizedImage = await resizeImage(data);
          setProfileImageData(resizedImage.data.imgSrc);
        } catch (error) {
          toast.error('Gambar tidak sah.');
        }
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
                    <button
                      type='button'
                      className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-adminWhite bg-admin3 hover:bg-admin2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-admin4'
                      onClick={() =>
                        document.getElementById(uploadImage).click()
                      }
                    >
                      Muat naik gambar
                    </button>
                    <input
                      hidden
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
              <div className='relative border-b border-user1'>
                <input
                  type='text'
                  name='username'
                  id={nama}
                  placeholder=' '
                  className='mt-5 w-full appearance-none px-3 py-1 focus:outline-none peer'
                  value={loginInfo.username}
                  onChange={(e) =>
                    setLoginInfo({ ...loginInfo, username: e.target.value })
                  }
                />
                <label
                  htmlFor={nama}
                  className='absolute left-3 bottom-8 text-xs text-user1 bg-userWhite peer-placeholder-shown:text-user1 peer-placeholder-shown:bottom-1 peer-placeholder-shown:text-base peer-focus:bottom-8 peer-focus:text-xs transition-all'
                >
                  Nama Pengguna
                </label>
              </div>
              <div className='relative border-b border-user1'>
                <input
                  type='date'
                  name='tarikhLahir'
                  id={tarikhLahir}
                  className='mt-5 w-full appearance-none px-3 py-1 focus:outline-none peer'
                  value={loginInfo.tarikhLahir}
                  onChange={(e) =>
                    setLoginInfo({ ...loginInfo, tarikhLahir: e.target.value })
                  }
                />
                <label
                  htmlFor={tarikhLahir}
                  className='absolute left-3 bottom-8 text-xs text-user1 bg-userWhite peer-placeholder-shown:text-user1 peer-placeholder-shown:bottom-1 peer-placeholder-shown:text-base peer-focus:bottom-8 peer-focus:text-xs transition-all'
                >
                  Tarikh Lahir
                </label>
              </div>
              <div className='relative border-b border-user1'>
                <input
                  type='text'
                  name='email'
                  id={email}
                  className='mt-5 w-full appearance-none px-3 py-1 focus:outline-none peer'
                  value={loginInfo.e_mail}
                  onChange={(e) =>
                    setLoginInfo({ ...loginInfo, email: e.target.value })
                  }
                />
                <label
                  htmlFor={email}
                  className='absolute left-3 bottom-8 text-xs text-user1 bg-userWhite peer-placeholder-shown:text-user1 peer-placeholder-shown:bottom-1 peer-placeholder-shown:text-base peer-focus:bottom-8 peer-focus:text-xs transition-all'
                >
                  Emel
                </label>
              </div>
              <div className='relative border-b border-user1'>
                <label
                  htmlFor={totp}
                  className='block text-sm font-medium text-gray-700'
                >
                  TOTP
                </label>
                <div className='flex items-center justify-center'>
                  <input
                    checked={loginInfo.totp === false}
                    type='radio'
                    name='totpActive'
                    id={totp}
                    value={loginInfo.totp}
                    className='mt-1 w-4 h-4 inline-block shadow-sm border-user1 focus:ring-1 rounded-md mx-3'
                    onChange={(e) =>
                      setLoginInfo({ ...loginInfo, totp: false })
                    }
                  />
                  <label htmlFor='totpActive'>Tidak Aktif</label>
                  <input
                    type='radio'
                    checked={loginInfo.totp === true}
                    name='totpInactive'
                    id={totp}
                    value={loginInfo.totp}
                    className='mt-1 w-4 h-4 inline-block shadow-sm border-user1 focus:ring-1 rounded-md mx-3'
                    onChange={confirm(enableTotp)}
                  />
                  <label htmlFor='totpInactive'>Diaktifkan</label>
                </div>
              </div>
              <div>
                <button
                  type='submit'
                  className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-adminWhite bg-admin2 hover:bg-admin3 m-2'
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
