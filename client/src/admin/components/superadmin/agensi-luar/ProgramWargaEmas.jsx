import { useState, useEffect } from 'react';

import { useGlobalAdminAppContext } from '../../../context/adminAppContext';

import { SubmitButton, BusyButton } from '../../Buttons';

export default function ProgramGTod() {
  const {
    loginInfo,
    readData,
    createData,
    updateData,
    newRouteCreateData,
    newRouteUpdateData,
    newRouteDeleteData,
    toast,
  } = useGlobalAdminAppContext();

  return (
    <>
      <div className='flex flex-col items-center gap-5'>
        <h1 className='text-3xl font-bold mt-10 mb-10'>Program Warga Emas</h1>
      </div>
    </>
  );
}
