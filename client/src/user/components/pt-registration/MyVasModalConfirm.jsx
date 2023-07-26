import React, { useState } from 'react';

export default function MyVasModalConfirm({
  patientDataFromMyVas,
  setShowModalMyVasConfirm,
  handleDataPassMyVas,
}) {
  const [jenisIc, setJenisIc] = useState('');

  const handleConfirmMyVas = (e) => {
    e.preventDefault();
    handleDataPassMyVas(jenisIc);
    setShowModalMyVasConfirm(false);
  };

  return (
    <>
      <div className='absolute z-20 inset-x-1 lg:inset-x-1/3 inset-y-7 bg-userWhite text-user1 rounded-md shadow-md overflow-y-auto p-2'>
        <form
          onSubmit={handleConfirmMyVas}
          className='px-2 grid grid-cols-1 space-y-8'
        >
          <h1 className='text-base uppercase font-bold text-center text-user1 bg-userWhite py-2 mb-2 border-b-2 border-user1'>
            Sila Pastikan Semua Maklumat MyVAS Ini Adalah Betul
          </h1>
          <div className='space-y-2'>
            <div className='relative'>
              <label
                htmlFor='jenisIc'
                className='text-sm text-left text-user1 bg-userWhite flex flex-col rounded-md'
              >
                <span className='text-left text-user1 text-sm font-semibold'>
                  Sila pilih jenis pengenalan
                </span>
                <span>
                  Jenis Pengenalan
                  <span className='font-semibold text-user6'>*</span>
                </span>
              </label>
              <select
                required
                name='jenisIc'
                id='jenisIc'
                placeholder=' '
                className={`${
                  jenisIc
                    ? 'border-user1 focus:ring-1 focus:ring-user1'
                    : 'border-user9 focus:ring-1 focus:ring-user9'
                } appearance-none text-sm w-full px-2 py-1 text-user1 border rounded-lg shadow-sm focus:outline-none  focus:border-transparent`}
                value={jenisIc}
                onChange={(e) => {
                  setJenisIc(e.target.value);
                }}
              >
                <option value=''>SILA PILIH..</option>
                <option value='mykad-mykid'>MyKad / MyKid</option>
                <option value='passport'>
                  Passport / MyPR / MyKAS / UNHCR
                </option>
                <option value='sijil-lahir'>Sijil lahir</option>
                <option value='birth-of'>Baby Of</option>
                <option value='tiada-pengenalan'>
                  Tiada Pengenalan Yang Sah
                </option>
              </select>
            </div>
            <div className='relative'>
              <label
                htmlFor='noIc'
                className='text-sm text-left text-user1 bg-userWhite flex rounded-md'
              >
                No. Kad Pengenalan
              </label>
              <input
                disabled
                type='text'
                name='noIc'
                id='noIc'
                placeholder=' '
                className='appearance-none text-sm w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                value={patientDataFromMyVas.resource.identifier[0].value}
              />
            </div>
            <div className='relative'>
              <label
                htmlFor='nama'
                className='text-sm text-left text-user1 bg-userWhite flex rounded-md'
              >
                Nama
              </label>
              <input
                disabled
                type='text'
                name='nama'
                id='nama'
                placeholder=' '
                className='appearance-none text-sm w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                value={patientDataFromMyVas.resource.name[0].given[0]}
              />
            </div>
          </div>
          <p className='text-justify font-semibold text-user1 text-sm row-span-2 normal-case'>
            <b className='text-user9'>***</b>
            Sebahagian maklumat pesakit telah diambil dari MyVAS. Sila sahkan
            maklumat tersebut (ubah sekiranya perlu) dan tambah maklumat
            pendaftaran lain yang diperlukan
          </p>
          <div className='grid grid-cols-2 gap-2'>
            <span
              onClick={() => setShowModalMyVasConfirm(false)}
              className='text-user1 rounded-md py-1 cursor-pointer'
            >
              Batal
            </span>
            <button
              type='submit'
              className='bg-kaunter2 text-kaunterWhite rounded-md py-1 cursor-pointer hover:bg-kaunter3 hover:text-user1'
            >
              Sahkan
            </button>
          </div>
        </form>
      </div>
      <div
        onClick={() => setShowModalMyVasConfirm(false)}
        className='absolute inset-0 bg-user1 opacity-75 z-10'
      />
    </>
  );
}
