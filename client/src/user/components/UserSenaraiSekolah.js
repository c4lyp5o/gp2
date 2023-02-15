import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Spinner } from 'react-awesome-spinners';

import { useGlobalUserAppContext } from '../context/userAppContext';

function UserSekolahList() {
  const { userToken, reliefUserToken, refreshTimer, setRefreshTimer, toast } =
    useGlobalUserAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [allPersonSekolahs, setAllPersonSekolahs] = useState([]);
  const [namaSekolahs, setNamaSekolahs] = useState([]);
  const [enrolmen, setEnrolmen] = useState([]);
  const [kedatanganBaru, setKedatanganBaru] = useState([]);

  useEffect(() => {
    const fetchFasilitiSekolahs = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get('/api/v1/sekolah', {
          headers: {
            Authorization: `Bearer ${
              reliefUserToken ? reliefUserToken : userToken
            }`,
          },
        });
        setAllPersonSekolahs(data.allPersonSekolahs);
        setNamaSekolahs(data.fasilitiSekolahs);
        data.fasilitiSekolahs.forEach((singleSekolah) => {
          // kira enrolmen
          const tempEnrolmen = () => {
            return data.allPersonSekolahs.filter((person) =>
              person.namaSekolah.includes(singleSekolah.nama)
            ).length;
          };
          setEnrolmen((current) => [...current, tempEnrolmen()]);

          // kira kedatangan baru
          let tempKedatanganBaru = 0;
          data.allPersonSekolahs
            .filter((person) => person.namaSekolah.includes(singleSekolah.nama))
            .forEach((person) => {
              if (person.pemeriksaanSekolah /*&& person.rawatanSekolah[0]*/) {
                tempKedatanganBaru += 1;
              }
              // if (person.pemeriksaanSekolah && person.rawatanSekolah[0]) {
              //   if (
              //     person.pemeriksaanSekolah.tarikhPemeriksaanSemasa ===
              //     person.rawatanSekolah[0].tarikhRawatanSemasa
              //   ) {
              //     tempKedatanganBaru += 1;
              //   }
              // }
            });
          setKedatanganBaru((current) => [...current, tempKedatanganBaru]);
        });
        setRefreshTimer(!refreshTimer);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        toast.error(
          'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: user-senarai-sekolah-fetchFasilitiSekolahs'
        );
      }
    };
    fetchFasilitiSekolahs();
  }, []);

  const selesaiSekolah = async (idSekolah) => {
    alert('**WARNING PLACEHOLDER** Anda pasti selesai sekolah? ' + idSekolah);
    try {
      const { data } = await axios.patch(
        `/api/v1/sekolah/fasiliti/${idSekolah}`,
        { sekolahSelesaiReten: true },
        {
          headers: {
            Authorization: `Bearer ${
              reliefUserToken ? reliefUserToken : userToken
            }`,
          },
        }
      );
    } catch (error) {
      console.log(error);
      toast.error(
        'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: user-senarai-sekolah-selesaiSekolah'
      );
    }
  };

  return (
    <>
      <div className='px-3 lg:px-7 h-full p-3 overflow-y-auto'>
        <h1 className='my-3 text-xl font-semibold'>STATUS SEKOLAH</h1>
        <div className='flex m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max'>
          <table className='table-auto'>
            <thead className='text-userWhite bg-user2'>
              <tr>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  BIL
                </th>
                <th className='outline outline-1 outline-offset-1 py-1 px-10 lg:px-20'>
                  NAMA SEKOLAH
                </th>
              </tr>
            </thead>
            <tbody className='bg-user4'>
              {namaSekolahs.map((singleNamaSekolah, index) => {
                return (
                  <tr>
                    <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                      {index + 1}
                    </td>
                    <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                      {singleNamaSekolah.nama}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <table className='table-auto'>
            <thead className='text-userWhite bg-user2'>
              <tr>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 whitespace-nowrap'>
                  ENROLMEN
                </th>
              </tr>
            </thead>
            <tbody className='bg-user4'>
              {enrolmen.map((singleValue) => {
                return (
                  <tr>
                    <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                      {singleValue}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <table className='table-auto'>
            <thead className='text-userWhite bg-user2'>
              <tr>
                <th className='outline outline-1 outline-offset-1 px-5 py-1'>
                  KEDATANGAN BARU
                </th>
              </tr>
            </thead>
            <tbody className='bg-user4'>
              {kedatanganBaru.map((singleValue) => {
                return (
                  <tr>
                    <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                      {singleValue}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <table className='table-auto'>
            <thead className='text-userWhite bg-user2'>
              <tr>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  SELESAI
                </th>
              </tr>
            </thead>
            <tbody className='bg-user4'>
              {namaSekolahs.map((singleNamaSekolah) => {
                return (
                  <tr>
                    <button
                      disabled={true}
                      onClick={() => {
                        selesaiSekolah(singleNamaSekolah._id);
                      }}
                    >
                      sekolah selesai:{' '}
                      {singleNamaSekolah.sekolahSelesaiReten ? 'ya' : 'tidak'}
                    </button>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* <th className='outline outline-1 outline-offset-1 px-2 py-1'>
            KES SELESAI
          </th> */}
        </div>
        {isLoading && (
          <p className='text-xl font-semibold'>
            <Spinner color='#1f315f' />
          </p>
        )}
        <div className='mt-5'>
          <Link
            to='sekolah'
            className='uppercase bg-user3 text-base text-userWhite rounded-md shadow-md p-2 hover:bg-user1 transition-all'
          >
            filter pelajar di setiap sekolah
          </Link>
        </div>
      </div>
    </>
  );
}

export default UserSekolahList;
