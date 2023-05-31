import { useState, useEffect } from 'react';

import { useGlobalAdminAppContext } from '../../context/adminAppContext';

export default function OndemandSetting() {
  const { readOndemandSetting, saveOndemandSetting, semuaJenisReten, toast } =
    useGlobalAdminAppContext();

  const [ondemandSetting, setOndemandSetting] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(ondemandSetting);
    saveOndemandSetting(ondemandSetting).then((res) => {
      console.log(res);
      toast.success('Berjaya mengemaskini status laman pentadbir');
    });
  };

  useEffect(() => {
    readOndemandSetting().then((res) => {
      setOndemandSetting(res.data.currentOndemandSetting);
    });
  }, []);

  return (
    <div className='flex flex-col items-center gap-5'>
      <h1 className='text-3xl font-bold m-5'>
        Selamat datang ke laman G-OD (Gi-Ret 2.0 On-Demand)
      </h1>
      <form onSubmit={handleSubmit}>
        <div className='m-auto overflow-x-auto text-sm rounded-md h-min max-w-max'>
          <h1 className='text-2xl font-bold'>Status Laman Pentadbir</h1>
          <div
            className={`${
              ondemandSetting?.adminPage ? 'bg-user7' : 'bg-user9'
            } rounded-full w-full h-10 flex items-center justify-center`}
          >
            <h1 className='text-2xl font-bold'>
              {ondemandSetting?.adminPage ? 'Buka' : 'Tutup'}
            </h1>
            <input
              type='checkbox'
              className='ml-10'
              checked={ondemandSetting?.adminPage}
              onChange={(e) => {
                setOndemandSetting({
                  ...ondemandSetting,
                  adminPage: e.target.checked,
                });
              }}
            />
          </div>
        </div>
        <div className='grid grid-cols-2 outline outline-1 outline-adminWhite rounded-md gap-5'>
          <div className='m-auto overflow-x-auto text-sm rounded-md h-min max-w-max'>
            <h1 className='text-2xl font-bold'>Status Penjanaan Tarikh</h1>
            <div
              className={`${
                ondemandSetting?.janaTarikh ? 'bg-user7' : 'bg-user9'
              } rounded-full w-full h-10 flex items-center justify-center`}
            >
              <h1 className='text-2xl font-bold'>
                {ondemandSetting?.janaTarikh ? 'Buka' : 'Tutup'}
              </h1>
              <input
                type='checkbox'
                className='ml-10'
                checked={ondemandSetting?.janaTarikh}
                onChange={(e) => {
                  setOndemandSetting({
                    ...ondemandSetting,
                    janaTarikh: e.target.checked,
                  });
                }}
              />
            </div>
          </div>
          <div className='m-auto overflow-x-auto text-sm rounded-md h-min max-w-max'>
            <h1 className='text-2xl font-bold'>Status Penjanaan Bulan</h1>
            <div
              className={`${
                ondemandSetting?.janaBulan ? 'bg-user7' : 'bg-user9'
              } rounded-full w-full h-10 flex items-center justify-center`}
            >
              <h1 className='text-2xl font-bold'>
                {ondemandSetting?.janaBulan ? 'Buka' : 'Tutup'}
              </h1>
              <input
                type='checkbox'
                className='ml-10'
                checked={ondemandSetting?.janaBulan}
                onChange={(e) => {
                  setOndemandSetting({
                    ...ondemandSetting,
                    janaBulan: e.target.checked,
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className='m-auto overflow-x-auto text-sm rounded-md h-min max-w-max mt-2'>
          <table className='table-auto'>
            <thead className='text-adminWhite bg-admin3'>
              <tr>
                <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                  Bil.
                </th>
                <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                  Jenis Reten
                </th>
                <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className='bg-admin4'>
              {semuaJenisReten.map((jenisReten, index) => (
                <>
                  <tr>
                    <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {index + 1}
                    </td>
                    <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {jenisReten.kodRingkas}
                    </td>
                    <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      <label className='switch'>
                        <input
                          type='checkbox'
                          checked={ondemandSetting?.[jenisReten.kodRingkas]}
                          onChange={(e) => {
                            setOndemandSetting({
                              ...ondemandSetting,
                              [jenisReten.kodRingkas]: e.target.checked,
                            });
                          }}
                        />
                      </label>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
        {ondemandSetting && (
          <button
            type='submit'
            className='bg-admin3 text-adminWhite rounded-md px-2 py-1 mt-2'
          >
            Simpan
          </button>
        )}
      </form>
    </div>
  );
}
