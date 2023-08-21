import { useState, useEffect } from 'react';

import { useGlobalAdminAppContext } from '../../../context/adminAppContext';
import { useAdminData } from '../../../context/admin-hooks/useAdminData';

export default function ModalDeleteGtod({
  setShowModalDelete,
  setShowTable,
  idGTod,
  setIdGTod,
  singleAgensiLuarGTod,
  reloadState,
  setReloadState,
}) {
  const { toast } = useGlobalAdminAppContext();
  const { deleteData } = useAdminData();

  const [captchaValue, setCaptchaValue] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');

  useEffect(() => {
    generateCaptcha();
  }, [singleAgensiLuarGTod]);

  const generateCaptcha = () => {
    const captcha =
      singleAgensiLuarGTod &&
      singleAgensiLuarGTod.namaTaskaTadika
        .split(' ')
        .slice(0, 3)
        .map((word) => word)
        .join('');
    setGeneratedCaptcha(captcha);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (captchaValue.toLowerCase() !== generatedCaptcha.toLowerCase()) {
      toast.error('Captcha tidak sah');
      setShowModalDelete(true);
      return;
    }

    await toast
      .promise(
        deleteData('gtod', idGTod),
        {
          pending: 'Memproses ...',
          success: 'Berjaya memadam data agensi luar',
          error: 'Gagal memadam data agensi luar',
        },
        {
          autoclose: 3000,
        }
      )
      .then((result) => {
        // reload page
        // window.location.reload();
        setReloadState(!reloadState);
        setShowModalDelete(false);
        // if (captchaValue.toUpperCase() === generatedCaptcha) {
        //   setShowModalDelete(false);
        // }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCancel = () => {
    setReloadState(!reloadState);
    setIdGTod('');
    setShowModalDelete(false);
    setShowTable(true);
  };

  return (
    <>
      <form onSubmit={handleDelete}>
        <div
          className='absolute inset-0 bg-user1 z-0 bg-opacity-75'
          onClick={handleCancel}
        />
        <div className='bg-adminWhite shadow-md shadow-user1 absolute inset-x-2 lg:inset-x-1/3 inset-y-10 mt-5 z-20 overflow-y-auto rounded-lg px-4'>
          <div className='border-b-2 border-b-admin2 my-4 py-3'>
            <h1 className='font-semibold text-lg'>
              Adakah anda pasti untuk menghapus data berikut?
            </h1>
          </div>
          <div className='flex flex-col justify-center items-center'>
            <p className='text-xl font-semibold flex flex-col text-left pr-5'>
              <span className='text-xs font-light'>Nama Agensi Luar</span>
              {singleAgensiLuarGTod && singleAgensiLuarGTod.namaAgensiLuar}
              <span className='text-xs font-light'>Nama Taska/Tadika</span>
              {singleAgensiLuarGTod && singleAgensiLuarGTod.namaTaskaTadika}
            </p>
            <div className='flex flex-col items-center my-4 space-y-2'>
              <p className='text-xs'>
                Sila isi semula nama taska/tadika di bawah
              </p>
              <span className=' bg-admin4 bg-opacity-60 text-xl font-mono oldstyle-nums px-7 py-2 text-opacity-75 lowercase'>
                {generatedCaptcha}
              </span>
              <input
                type='text'
                value={captchaValue}
                onChange={(e) => setCaptchaValue(e.target.value)}
                className='ml-2 border border-user1 rounded-md px-2 py-1 lowercase'
              />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <span
              className='hover:bg-user1 hover:bg-opacity-50 rounded-md flex justify-center items-center cursor-pointer'
              onClick={handleCancel}
            >
              Tutup
            </span>
            <button
              type='submit'
              className='px-3 py-1 bg-admin4 hover:bg-admin2 hover:text-adminWhite rounded-md'
            >
              Padam
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
