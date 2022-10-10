import { useState, useEffect } from 'react';
import { Ring } from 'react-awesome-spinners';

import { useGlobalAdminAppContext } from '../context/adminAppContext';

import perlis from '../assets/flags/perlis.png';

export default function AdminCenterStageLoggedIn({ user, accountType }) {
  const { toast, getAllNegeriAndDaerah } = useGlobalAdminAppContext();
  const [data, setData] = useState([]);
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllNegeriAndDaerah()
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }, []);

  if (loading) {
    return (
      <div className='flex justify-center text-center h-full w-full'>
        <div className='m-auto p-4 bg-admin4 rounded-md grid'>
          <div className='flex justify-center mb-2'>
            <Ring color='#c44058' />
          </div>
          <span className='bg-admin3 text-kaunterWhite text-xs font-semibold px-2.5 py-0.5 rounded'>
            Memuat...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='h-full p-5 overflow-y-auto'>
        <div className='justify-center items-center text-xl font-semibold mt-10 space-y-5'>
          {data.map((item) => {
            return (
              <div className='max-w-sm rounded overflow-hidden shadow-lg'>
                <img
                  className='w-full'
                  src={perlis}
                  alt='Sunset in the mountains'
                />
                <div className='px-6 py-4'>
                  <div className='font-bold text-xl mb-2'>
                    {item.namaNegeri}
                  </div>
                  {item.daerah.map((item2) => {
                    return (
                      <>
                        <p className='text-gray-700 text-base'>
                          Daerah: {item2.namaDaerah}
                        </p>
                        {item2.klinik.map((item3) => {
                          return (
                            <div className='mt-3'>
                              <p className='text-xs  underline'>
                                {item3.namaKlinik}
                              </p>
                              <p className='text-xs '>
                                Jumlah Pesakit: {item3.pesakit.length}
                              </p>
                              <p className='text-xs '>
                                Jumlah Pesakit Baru: {item3.pesakitBaru}
                              </p>
                              <p className='text-xs '>
                                Jumlah Pesakit Ulangan: {item3.pesakitUlangan}
                              </p>
                              <p className='text-xs '>
                                Jumlah Pesakit Hari Ini: {item3.pesakitHariIni}
                              </p>
                              <p className='text-xs '>
                                Jumlah Pesakit Minggu Ini:{' '}
                                {item3.pesakitMingguIni}
                              </p>
                              <p className='text-xs '>
                                Jumlah Pesakit Bulan Ini:{' '}
                                {item3.pesakitBulanIni}
                              </p>
                            </div>
                          );
                        })}
                      </>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
