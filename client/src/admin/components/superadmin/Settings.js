import { useState, useLayoutEffect, useEffect, useId } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import { useGlobalAdminAppContext } from '../../context/adminAppContext';

import { Loading } from '../Screens';
import TotpConfirmation from './TotpConfirmation';

export default function Settings({ update }) {
  const {
    getCurrentUser,
    saveCurrentUser,
    generateSecret,
    removeTotpToken,
    resizeImage,
    masterDatePicker,
    toast,
  } = useGlobalAdminAppContext();
  const [loginInfo, setLoginInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [profileImageData, setProfileImageData] = useState(null);
  const [totpImage, setTotpImage] = useState('');
  const uploadImage = useId();
  const nama = useId();
  const [tarikhLahir, setTarikhLahir] = useState('');
  const e_mail = useId();
  const totp = useId();

  // tarikh lahir pentadbir
  const [tarikhLahirDP, setTarikhLahirDP] = useState(new Date());

  const TarikhLahir = () => {
    return masterDatePicker({
      selected: tarikhLahirDP,
      onChange: (tarikhLahir) => {
        const tempDate = moment(tarikhLahir).format('YYYY-MM-DD');
        setTarikhLahirDP(tarikhLahir);
        setTarikhLahir(tempDate);
        setLoginInfo({ ...loginInfo, tarikhLahir: tempDate });
      },
      filterDate: (date) => {
        return moment() > date;
      },
      className:
        'mt-5 w-full appearance-none px-3 py-1 focus:outline-none peer',
    });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        nama: e.target[nama].value,
        tarikhLahir: tarikhLahir,
        e_mail: e.target[e_mail].value,
        totp: loginInfo.totp,
        image: profileImageData,
      };
      if (!profileImageData) {
        delete data.image;
      }
      await saveCurrentUser(data);
      toast.success('Profil berjaya dikemaskini');
    } catch (error) {
      toast.error('Profil gagal dikemaskini');
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentUser().then((res) => {
      setLoginInfo({ ...res.data });
      if (res.data.tarikhLahir) {
        setTarikhLahir(res.data.tarikhLahir);
        setTarikhLahirDP(new Date(res.data.tarikhLahir));
      }
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
                    className='hidden text-sm font-medium text-gray-700'
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
                      Muat naik gambar baru
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
                  Nama Pentadbir
                </label>
              </div>
              <div className='relative border-b border-user1'>
                <TarikhLahir />
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
                  name='e_mail'
                  id={e_mail}
                  className='mt-5 w-full appearance-none px-3 py-1 focus:outline-none peer'
                  value={loginInfo.e_mail}
                  onChange={(e) =>
                    setLoginInfo({ ...loginInfo, e_mail: e.target.value })
                  }
                />
                <label
                  htmlFor={e_mail}
                  className='absolute left-3 bottom-8 text-xs text-user1 bg-userWhite peer-placeholder-shown:text-user1 peer-placeholder-shown:bottom-1 peer-placeholder-shown:text-base peer-focus:bottom-8 peer-focus:text-xs transition-all'
                >
                  Emel
                </label>
              </div>
              <div className='relative'>
                <label
                  htmlFor='totp'
                  className='block text-sm py-2 font-medium text-user1'
                >
                  TOTP
                </label>
                <div className='flex items-center justify-center'>
                  <div>
                    <input
                      checked={loginInfo.totp === false}
                      type='radio'
                      name='totpActive'
                      id='totpTidakAktif'
                      value={loginInfo.totp}
                      className='peer hidden'
                      onChange={(e) =>
                        setLoginInfo({ ...loginInfo, totp: false })
                      }
                    />
                    <label
                      htmlFor='totpTidakAktif'
                      className='text-sm peer-checked:ring-2 peer-checked:ring-user2 text-userBlack text-opacity-70 py-2 px-4 bg-admin5 m-3 rounded-md cursor-pointer focus:outline-none peer-checked:border-none'
                    >
                      Tidak Aktif
                    </label>
                  </div>
                  <div>
                    <input
                      type='radio'
                      checked={loginInfo.totp === true}
                      name='totpInactive'
                      id={totp}
                      value={loginInfo.totp}
                      className='peer hidden'
                      onChange={confirm(enableTotp)}
                    />
                    <label
                      htmlFor={totp}
                      className='text-sm peer-checked:ring-2 peer-checked:ring-user2 text-userBlack text-opacity-70 py-2 px-4 bg-admin5 m-3 rounded-md cursor-pointer focus:outline-none peer-checked:border-none'
                    >
                      Diaktifkan
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <button
                  type='submit'
                  className='inline-flex justify-center py-2 px-4 mt-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-adminWhite bg-admin2 hover:bg-admin3 m-2'
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
