import { useState, useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { useGlobalUserAppContext } from '../context/userAppContext';

function UserSekolah() {
  const { userToken } = useGlobalUserAppContext();

  const [isLoading, setIsLoading] = useState(false);
  const [allPersonSekolahs, setAllPersonSekolahs] = useState([]);
  const [namaSekolahs, setNamaSekolahs] = useState([]);
  const [darjah, setDarjah] = useState([]);
  const [tingkatan, setTingkatan] = useState([]);
  const [namaKelas, setNamaKelas] = useState([]);

  useEffect(() => {
    const fetchAllPersonSekolahs = async () => {
      try {
        const { data } = await axios.get('/api/v1/sekolah', {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        const allPersonSekolahs = data.allPersonSekolahs;
        const namaSekolahs = allPersonSekolahs.reduce(
          (arrNamaSekolahs, singlePersonSekolah) => {
            if (!arrNamaSekolahs.includes(singlePersonSekolah.namaSekolah)) {
              arrNamaSekolahs.push(singlePersonSekolah.namaSekolah);
            }
            return arrNamaSekolahs;
          },
          ['']
        );
        // need to check null
        const darjah = allPersonSekolahs.reduce(
          (arrDarjah, singlePersonSekolah) => {
            if (!arrDarjah.includes(singlePersonSekolah.darjah)) {
              arrDarjah.push(singlePersonSekolah.darjah);
            }
            return arrDarjah;
          },
          ['']
        );
        // need to check null
        const tingkatan = allPersonSekolahs.reduce(
          (arrTingkatan, singlePersonSekolah) => {
            if (!arrTingkatan.includes(singlePersonSekolah.tingkatan)) {
              arrTingkatan.push(singlePersonSekolah.tingkatan);
            }
            return arrTingkatan;
          },
          ['']
        );
        const namaKelas = allPersonSekolahs.reduce(
          (arrNamaKelas, singlePersonSekolah) => {
            if (!arrNamaKelas.includes(singlePersonSekolah.kelas)) {
              arrNamaKelas.push(singlePersonSekolah.kelas);
            }
            return arrNamaKelas;
          },
          ['']
        );
        setAllPersonSekolahs(allPersonSekolahs);
        setNamaSekolahs(namaSekolahs);
        setDarjah(darjah);
        setTingkatan(tingkatan);
        setNamaKelas(namaKelas);
      } catch (error) {
        console.log(error.response.data.msg);
      }
    };
    fetchAllPersonSekolahs();
  }, []);

  return (
    <>
      <div className='container px-10 h-full p-3 overflow-y-auto'>
        <div>
          <h2 className='text-xl font-semibold flex flex-row pl-12 p-2'>
            PILIH
          </h2>
          <p className='flex flex-row pl-12 p-2'>Nama Sekolah</p>
          <select className='m-auto mb-1 w-11/12 outline outline-1 outline-userBlack'>
            {namaSekolahs.map((singleNamaSekolah, index) => {
              return (
                <option value={singleNamaSekolah} key={index}>
                  {singleNamaSekolah}
                </option>
              );
            })}
          </select>
          <p className='flex flex-row pl-12 p-2'>
            Darjah / Tingkatan / Pra Sekolah (KIV) /KKI(KIV)
          </p>
          <select className='m-auto mb-1 w-11/12 outline outline-1 outline-userBlack'>
            {darjah.map((singleDarjah, index) => {
              return (
                <option value={singleDarjah} key={index}>
                  {singleDarjah}
                </option>
              );
            })}
            {tingkatan.map((singleTingkatan, index) => {
              return (
                <option value={singleTingkatan} key={index}>
                  {singleTingkatan}
                </option>
              );
            })}
          </select>
          <p className='flex flex-row pl-12 p-2'>Kelas</p>
          <select className='m-auto mb-3 w-11/12 outline outline-1 outline-userBlack'>
            {namaKelas.map((singleNamaKelas, index) => {
              return (
                <option value={singleNamaKelas} key={index}>
                  {singleNamaKelas}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <table className='m-auto mb-5 w-11/12 outline outline-1 outline-userBlack'>
            <tr className='bg-user3 p-2'>
              <th className='outline outline-1 outline-userBlack'>BIL</th>
              <th className='outline outline-1 outline-userBlack px-20'>
                NAMA
              </th>
              <th className='outline outline-1 outline-userBlack'>JANTINA</th>
              <th className='outline outline-1 outline-userBlack'>
                OPERATOR TERAKHIR
              </th>
              <th className='outline outline-1 outline-userBlack'>
                STATUS RAWATAN
              </th>
              <th className='outline outline-1 outline-userBlack'>
                STATUS KOTAK
              </th>
              <th className='outline outline-1 outline-userBlack'>ACTION</th>
            </tr>
            {allPersonSekolahs.map((singlePersonSekolah, index) => {
              return (
                <>
                  <tr>
                    <td className='outline outline-1 outline-userBlack'>
                      {index + 1}
                    </td>
                    <td className='outline outline-1 outline-userBlack'>
                      {singlePersonSekolah.nama}
                    </td>
                    <td className='outline outline-1 outline-userBlack'>
                      {singlePersonSekolah.jantina}
                    </td>
                    <td className='outline outline-1 outline-userBlack'>
                      {singlePersonSekolah.createdByUsername}
                    </td>
                    <td className='outline outline-1 outline-userBlack'>
                      BELUM MULA
                    </td>
                    <td className='outline outline-1 outline-userBlack'>
                      BELUM MULA
                    </td>
                    <td className='outline outline-1 outline-userBlack p-2'>
                      <Link
                        to={`/user/form-sekolah/${singlePersonSekolah._id}`}
                        className='bg-user3 userWhite rounded-md shadow-xl p-1 m-1 hover:bg-user1 transition-all'
                      >
                        Action
                      </Link>
                    </td>
                  </tr>
                </>
              );
            })}
          </table>
        </div>
      </div>
    </>
  );
}

export default UserSekolah;
