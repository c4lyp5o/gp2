import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { FaSort, FaSortUp, FaSortDown, FaInfoCircle } from 'react-icons/fa';

import { useGlobalUserAppContext } from '../../context/userAppContext';

import UserModalSalahSekolah from './UserModalSalahSekolahReten';
import UserDeleteModal from '../UserDeleteModal';

export default function UserCarianSekolah() {
  const { userToken, toast, userinfo, reliefUserToken } =
    useGlobalUserAppContext();

  //salah reten sekolah
  const [modalSalahRetenSekolah, setModalSalahRetenSekolah] = useState(false);
  const [carianSekolah, setCarianSekolah] = useState('');

  //delete
  const [pilihanHapusId, setPilihanHapusId] = useState('');
  const [pilihanHapusNama, setPilihanHapusNama] = useState('');
  const [modalHapus, setModalHapus] = useState(false);

  //carian murid with name or ic
  const [searchResults, setSearchResults] = useState([]);
  const [pilihQuery, setPilihQuery] = useState('ic'); //['name', 'ic']
  const [idQuery, setIdQuery] = useState('');
  const [nameQuery, setNameQuery] = useState('');

  const [isShown, setIsShown] = useState(false);

  //handlesearch
  const handleSearch = async (e) => {
    e.preventDefault();
    if (pilihQuery === 'ic') {
      if (idQuery.trim().length <= 7) {
        toast.error('Sila masukkan nombor kad pengenalan melebihi 8 aksara');
        return;
      }
      try {
        const { data } = await axios.get(
          `/api/v1/query/sekolah?nomborId=${idQuery}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setSearchResults(data.sekolahResultQuery);
        if (data.sekolahResultQuery.length === 0) {
          toast.error('Tiada pemeriksaan dijalankan atau tiada rekod ditemui');
        } else {
          toast.success('Rekod murid ditemui');
        }
      } catch (error) {
        console.log(error);
        setSearchResults([]);
      }
    }
    if (pilihQuery === 'nama') {
      if (nameQuery.trim().length <= 4) {
        toast.error('Sila masukkan nama melebihi 5 huruf');
        return;
      }
      try {
        const { data } = await axios.get(
          `/api/v1/query/sekolah?nama=${nameQuery}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setSearchResults(data.sekolahResultQuery);
        if (data.sekolahResultQuery.length === 0) {
          toast.error('Tiada pemeriksaan dijalankan atau tiada rekod ditemui');
        } else {
          toast.success('Rekod murid ditemui');
        }
      } catch (error) {
        console.log(error);
        setSearchResults([]);
      }
    }
  };

  //handle salah sekolah .apa tah aku buat ni
  // const handleSalahSekolah = async (muridId) => {
  //   if (!modalSalahRetenSekolah) {
  //     setModalSalahRetenSekolah(true);
  //   return;
  //   }
  //   if (modalSalahRetenSekolah) {
  //     setModalSalahRetenSekolah(false);
  //   }
  // };

  const handleDelete = async (singlePelajar, reason) => {
    if (!modalHapus) {
      setModalHapus(true);
      return;
    }
    if (modalHapus) {
      let mdcMdtbNum = '';
      if (!userinfo.mdtbNumber) {
        mdcMdtbNum = userinfo.mdcNumber;
      }
      if (!userinfo.mdcNumber) {
        mdcMdtbNum = userinfo.mdtbNumber;
      }
      await toast.promise(
        axios.patch(
          `/api/v1/sekolah/delete-filled/${singlePelajar}`,
          {
            deleteReason: reason,
            createdByMdcMdtb: mdcMdtbNum,
          },
          {
            headers: {
              Authorization: `Bearer ${
                reliefUserToken ? reliefUserToken : userToken
              }`,
            },
          }
        ),
        {
          pending: 'Menghapus pesakit...',
          success: 'Pesakit berjaya dihapus',
          error: 'Pesakit gagal dihapus',
        },
        { autoClose: 5000 }
      );
      setModalHapus(false);
    }
  };

  return (
    <>
      <div>
        <h1 className='text-lg font-bold uppercase my-4'>
          SENARAI MURID SEKOLAH BAGI {userinfo.kpSkrg}
        </h1>
        <form
          onSubmit={handleSearch}
          className='flex flex-col md:flex-row justify-center gap-1 mb-2'
        >
          <div className='flex flex-row w-full md:w-96'>
            <div className='relative w-40 flex flex-row'>
              <select
                name='pilih-query'
                id='pilih-query'
                value={pilihQuery}
                onChange={(e) => {
                  setPilihQuery(e.target.value);
                }}
                className='bg-kaunter4 text-kaunterWhite appearance-none w-40 text-sm leading-7 px-2 py-1 border border-user1 focus:outline-none rounded-md shadow-md uppercase mr-2'
                data-cy='pilih-query'
              >
                <option value='ic'>PENGENALAN DIRI</option>
                <option value='nama'>NAMA</option>
              </select>
              <span>
                <FaSortDown className='absolute top-2 right-3 text-kaunterWhite' />
              </span>
            </div>
            {pilihQuery === 'nama' ? (
              <label
                className='flex w-full md:w-52'
                title='Carian nama mesti mengandungi sekurang-kurangnya 5 huruf'
              >
                <input
                  type='text'
                  value={nameQuery}
                  onChange={(event) => setNameQuery(event.target.value)}
                  className='appearance-none text-sm w-full md:w-52 leading-7 px-2 py-1 border border-user1 focus:outline-none rounded-md shadow-md uppercase'
                  data-cy='name-query'
                />
              </label>
            ) : (
              <label
                className='flex w-full md:w-52'
                title='Carian kad pengenalan mesti mengandungi sekurang-kurangnya 8 aksara'
              >
                <input
                  type='text'
                  value={idQuery}
                  onChange={(event) => setIdQuery(event.target.value)}
                  className='appearance-none w-full md:w-52 text-sm leading-7 px-2 py-1 border border-user1 focus:outline-none rounded-md shadow-md uppercase'
                  data-cy='id-query'
                />
              </label>
            )}
            <div className='relative flex items-center ml-1'>
              <FaInfoCircle
                className='text-lg text-kaunter1'
                onClick={() => setIsShown(!isShown)}
              />
              {isShown && pilihQuery === 'nama' && (
                <div className='absolute top-8 right-2 w-36 text-left z-10 bg-kaunter4 text-kaunterWhite text-sm px-2 py-1 rounded-md whitespace-pre-wrap'>
                  <p className='text-center'>
                    Carian nama hanya dihasilkan apabila melebihi lima huruf
                  </p>
                </div>
              )}
              {isShown && pilihQuery === 'ic' && (
                <div className='absolute top-8 right-2 w-36 text-left z-10 bg-kaunter4 text-kaunterWhite text-sm px-2 py-1 rounded-md whitespace-pre-wrap'>
                  <p className='text-center'>
                    Carian dengan pengenalan diri hanya dihasilkan apabila
                    melebihi lapan aksara
                  </p>
                </div>
              )}
              <div
                className={`fixed inset-0 h-full w-full ${
                  isShown ? 'block' : 'hidden'
                }`}
                onClick={() => setIsShown(!isShown)}
              />
            </div>
          </div>
          <div className='flex justify-end'>
            <button
              type='submit'
              className='appearance-none w-16 text-sm leading-7 px-2 py-1 ml-2 focus:outline-none rounded-md shadow-md uppercase bg-user2 text-userWhite hover:text-userBlack hover:bg-user3'
            >
              Cari
            </button>
          </div>
        </form>
        <div className='m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max'>
          <table className='table-auto'>
            <thead className='text-userWhite bg-user2'>
              <tr>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  BIL
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 w-80'>
                  NAMA
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 w-44'>
                  KAD PENGENALAN
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 w-44'>
                  SEKOLAH
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 w-44'>
                  TAHUN / TINGKATAN
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 w-96'>
                  TINDAKAN
                </th>
              </tr>
            </thead>
            <tbody className='bg-user4'>
              {searchResults.map((singleCarianSekolah, index) => {
                return (
                  <tr key={singleCarianSekolah._id}>
                    <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                      {index + 1}
                    </td>
                    <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                      {singleCarianSekolah.nama}
                    </td>
                    <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                      {singleCarianSekolah.nomborId}
                    </td>
                    <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                      {singleCarianSekolah.namaSekolah}
                    </td>
                    <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                      {singleCarianSekolah.tahunTingkatan}{' '}
                    </td>
                    <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                      <button
                        onClick={() => {
                          setModalSalahRetenSekolah(true);
                          setCarianSekolah(singleCarianSekolah);
                        }}
                        className='bg-user12 w-32 text-userWhite shadow-md hover:bg-user13 rounded-md p-1 m-1 transition-all'
                      >
                        SALAH RETEN
                      </button>
                      {userinfo.role === 'admin' && (
                        <button
                          className='bg-user9 w-32 text-userWhite shadow-md hover:bg-user8 rounded-md p-1 m-1 transition-all'
                          onClick={() => {
                            setModalHapus(true);
                            setPilihanHapusId(singleCarianSekolah._id);
                            setPilihanHapusNama(singleCarianSekolah.nama);
                          }}
                        >
                          HAPUS
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {modalSalahRetenSekolah && (
            <UserModalSalahSekolah
              setModalSalahRetenSekolah={setModalSalahRetenSekolah}
              carianSekolah={carianSekolah}
            />
          )}
          {modalHapus && (
            <UserDeleteModal
              handleDelete={handleDelete}
              setModalHapus={setModalHapus}
              id={pilihanHapusId}
              nama={pilihanHapusNama}
            />
          )}
        </div>
      </div>
    </>
  );
}
