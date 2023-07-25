import React, { useState } from 'react';
import moment from 'moment';
import { useGlobalUserAppContext } from '../../context/userAppContext';

export default function MyVasModalConfirm({
  patientDataFromMyVas,
  setShowModalMyVas,
  handleDataPassMyVas,
}) {
  const [jenisIc, setJenisIc] = useState('');
  const [kumpulanEtnik, setKumpulanEtnik] = useState('');
  const [daerahAlamat, setDaerahAlamat] = useState('');

  const handleCheckMyVas = (e) => {
    e.preventDefault();
    handleDataPassMyVas(jenisIc, kumpulanEtnik, daerahAlamat);
    setShowModalMyVas(false);
  };

  return (
    <>
      <div className='absolute z-20 inset-x-1 lg:inset-x-1/3 inset-y-7 bg-userWhite text-user1 rounded-md shadow-md overflow-y-auto p-2'>
        <form
          onSubmit={handleCheckMyVas}
          className='px-2 grid grid-cols-1 gap-2'
        >
          <h1 className='text-base uppercase font-bold text-center text-user1 bg-userWhite py-2 mb-2 border-b-2 border-user1'>
            Sila Pastikan Semua Maklumat Adalah Betul
          </h1>
          <div className='relative'>
            <label
              htmlFor='jenisIc'
              className='text-sm text-left text-user1 bg-userWhite flex rounded-md'
            >
              Jenis Pengenalan
              <span className='font-semibold text-user6'>*</span>
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
              <option value='passport'>Passport / MyPR / MyKAS / UNHCR</option>
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
          <div className='relative'>
            <label
              htmlFor='tarikhLahir'
              className='text-sm text-left text-user1 bg-userWhite flex rounded-md'
            >
              Tarikh Lahir
            </label>
            <input
              disabled
              type='text'
              name='tarikhLahir'
              id='tarikhLahir'
              placeholder=' '
              className='appearance-none text-sm w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
              value={moment(patientDataFromMyVas.resource.birthDate).format(
                'DD/MM/YYYY'
              )}
            />
          </div>
          <div className='relative'>
            <label
              htmlFor='keturunan'
              className='text-sm text-left text-user1 bg-userWhite flex rounded-md'
            >
              Keturunan
              <span className='font-semibold text-user6'>*</span>
            </label>
            <select
              required
              name='keturunan'
              id='keturunan'
              placeholder=' '
              className={`${
                kumpulanEtnik
                  ? 'border-user1 focus:ring-1 focus:ring-user1'
                  : 'border-user9 focus:ring-1 focus:ring-user9'
              } appearance-none text-sm w-full px-2 py-1 text-user1 border rounded-lg shadow-sm focus:outline-none  focus:border-transparent`}
              value={kumpulanEtnik}
              onChange={(e) => {
                setKumpulanEtnik(e.target.value);
              }}
            >
              <option value=''>SILA PILIH..</option>
              <option value='melayu'>Melayu</option>
              <option value='cina'>Cina</option>
              <option value='india'>India</option>
              <option value='bajau'>Bajau</option>
              <option value='dusun'>Dusun</option>
              <option value='kadazan'>Kadazan</option>
              <option value='murut'>Murut</option>
              <option value='bumiputera sabah lain'>
                Bumiputera sabah lain
              </option>
              <option value='melanau'>Melanau</option>
              <option value='kedayan'>Kedayan</option>
              <option value='iban'>Iban</option>
              <option value='bidayuh'>Bidayuh</option>
              <option value='penan'>Penan</option>
              <option value='bumiputera sarawak lain'>
                Bumiputera sarawak lain
              </option>
              <option value='orang asli semenanjung'>
                Orang asli semenanjung
              </option>
              <option value='lain-lain'>Lain-lain</option>
              <option value='bukan warganegara'>Bukan warganegara</option>
            </select>
          </div>
          <div className='relative'>
            <label
              htmlFor='jantina'
              className='text-sm text-left text-user1 bg-userWhite flex rounded-md'
            >
              Jantina
            </label>
            <input
              disabled
              type='text'
              name='jantina'
              id='jantina'
              placeholder=' '
              className='appearance-none uppercase text-sm w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
              value={
                patientDataFromMyVas.resource.gender &&
                patientDataFromMyVas.resource.gender === 'female'
                  ? 'perempuan'
                  : 'lelaki'
              }
            />
          </div>
          <div className='relative'>
            <label
              htmlFor='alamat'
              className='text-sm text-left text-user1 bg-userWhite flex rounded-md'
            >
              Alamat
            </label>
            <input
              disabled
              type='text'
              name='alamat'
              id='alamat'
              placeholder=' '
              className='appearance-none uppercase text-sm w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
              value={
                patientDataFromMyVas.resource.address[0].line[0] &&
                patientDataFromMyVas.resource.address[0].line[0]
              }
            />
          </div>
          <div className='relative'>
            <label
              htmlFor='daerah'
              className='text-sm text-left text-user1 bg-userWhite flex rounded-md'
            >
              Daerah
              <span className='font-semibold text-user6'>*</span>
            </label>
            <input
              required
              type='text'
              name='daerah'
              id='daerah'
              placeholder=' '
              className={`${
                daerahAlamat
                  ? 'border-user1 focus:ring-1 focus:ring-user1'
                  : 'border-user9 focus:ring-1 focus:ring-user9'
              } appearance-none text-sm w-full px-2 py-1 text-user1 border rounded-lg shadow-sm focus:outline-none  focus:border-transparent`}
              value={daerahAlamat}
              onChange={(e) => {
                setDaerahAlamat(e.target.value);
              }}
            />
          </div>
          <div className='relative'>
            <label
              htmlFor='poskodNegeri'
              className='text-sm text-left text-user1 bg-userWhite flex rounded-md'
            >
              Poskod Negeri
            </label>
            <input
              disabled
              type='text'
              name='poskodNegeri'
              id='poskodNegeri'
              placeholder=' '
              className='appearance-none uppercase text-sm w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
              value={
                patientDataFromMyVas.resource.address[0].postalCode +
                ' ' +
                patientDataFromMyVas.resource.address[0].state
              }
            />
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <span
              onClick={() => setShowModalMyVas(false)}
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
        onClick={() => setShowModalMyVas(false)}
        className='absolute inset-0 bg-user1 opacity-75 z-10'
      />
    </>
  );
}
