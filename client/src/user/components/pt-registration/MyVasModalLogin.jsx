import React, { useState } from 'react';
import { useGlobalUserAppContext } from '../../context/userAppContext';

import mysejahtera from '../../../assets/MySejahtera.png';

export default function MyVasModalLogin({ setShowModalMyVasLogin }) {
  const { navigate } = useGlobalUserAppContext();
  return (
    <>
      <div className='absolute z-20 inset-x-1 lg:inset-x-1/3 inset-y-11 bg-userWhite text-user1 rounded-md shadow-md overflow-y-auto p-2 px-4 grid grid-rows-[1fr_6fr_1fr]'>
        <div className='flex justify-center items-center text-user1 normal-case font-bold text-4xl border-b-2 border-b-user1 pb-2 mb-2 '>
          <img
            src={mysejahtera}
            alt='MySejahtera Logo'
            className='w-14 h-14 m-1 mr-5'
          />
          MyVAS
        </div>
        <h1 className='text-center text-base font-semibold normal-case px-5'>
          Sila log masuk menggunakan akaun MyVAS anda terlebih dahulu untuk
          mengakses senarai janji temu hari ini
        </h1>
        <div>
          <button
            onClick={() => {
              navigate('/pendaftaran/daftar/kp/myvas');
              setShowModalMyVasLogin(false);
            }}
            className='px-1 py-0.5 mx-1 w-64 h-10 text-userWhite font-medium text-xs normal-case rounded-md shadow-md transition-all duration-500 bg-gradient-to-r from-user1 to-[#7f8c8d] hover:from-[#3399ff] hover:via-[#3399ff] hover:to-[#3366ff] bg-[position:_0%_0%] hover:bg-[position:_100%_100%] bg-[size:_200%]'
          >
            Log Masuk
          </button>
        </div>
      </div>
      <div
        onClick={() => setShowModalMyVasLogin(false)}
        className='absolute inset-0 bg-user1 opacity-75 z-10'
      />
    </>
  );
}
