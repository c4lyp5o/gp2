import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaWindowClose } from 'react-icons/fa';

import { useGlobalUserAppContext } from '../../../context/userAppContext';

export default function HapusFMRModal({ setModalHapusFMR, singlePerson }) {
  const { userToken, userinfo, reliefUserToken, toast } =
    useGlobalUserAppContext();
  const { id, nama, kelas, dalamPemantauanKohort } = singlePerson;

  useEffect(() => {
    console.log(singlePerson);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const regbaru = await axios.get(
        `/api/v1/kohort/fmr/hapus?personKohortFMRId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${
              reliefUserToken ? reliefUserToken : userToken
            }`,
          },
        }
      );
      console.log(regbaru);
      setModalHapusFMR(false);
      toast.success('Maklumat kohort murid tahun 1 telah didaftarkan!');
    } catch (error) {
      console.log(error);
      setModalHapusFMR(false);
      toast.error('Gagal mendaftar maklumat kohort murid tahun 1!');
    }
  };
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className='absolute inset-x-5 inset-y-10 lg:inset-x-1/4 2xl:inset-x-1/3 2xl:inset-y-20 bg-userWhite z-20 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'
      >
        <FaWindowClose
          onClick={() => setModalRegisterSekolah(false)}
          className='absolute mr-1 mt-1 text-xl text-userBlack right-0 hover:cursor-pointer hover:text-user2 transition-all'
        />
        <h5 className='bg-user9 text-userWhite font-semibold text-xl'>AWAS!</h5>
        <div className='mt-5 mx-5 p-1'>
          <span className='font-semibold'>
            Anda YAKIN untuk menghapus maklumat kohort murid ini? Maklumat yang
            telah sah hapus tidak boleh dikembalikan!{' '}
          </span>
          <div className='mt-2'>
            <span className='font-semibold'>Kod Sekolah: </span>
            <span className='font-semibold text-user9'>
              {currentKodSekolah}
            </span>
            <span className='font-semibold'>Kelas: </span>
            <span className='font-semibold text-user9'>1</span>
            <span className='font-semibold'>Bilangan murid: </span>
            <span className='font-semibold text-user9'>0</span>
            <span className='font-semibold text-user9'>Kohort: </span>
            <span className='font-semibold'>
              Tahun 1 {new Date().getFullYear()}
            </span>
          </div>
        </div>
        <div className='absolute grid grid-cols-2 bottom-0 right-0 left-0 m-2 mx-10'>
          <span
            className='capitalize bg-userWhite text-userBlack rounded-md p-2 mr-3 hover:bg-user5 hover:cursor-pointer transition-all'
            onClick={() => {
              setModalRegisterSekolah(false);
            }}
          >
            Tidak
          </span>
          <button
            type='submit'
            className='capitalize bg-user9 text-userWhite rounded-md shadow-xl p-2 ml-3 hover:bg-user1 transition-all'
          >
            YA
          </button>
        </div>
      </form>
      <div
        onClick={() => setModalRegisterSekolah(false)}
        className='absolute inset-0 bg-user1 z-10 opacity-75'
      />
    </>
  );
}
