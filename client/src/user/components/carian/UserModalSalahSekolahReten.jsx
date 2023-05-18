import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaWindowClose } from 'react-icons/fa';

import { useGlobalUserAppContext } from '../../context/userAppContext';

export default function UserModalSalahSekolah({
  carianSekolah,
  setModalSalahRetenSekolah,
}) {
  const { userToken, userinfo, reliefUserToken, toast } =
    useGlobalUserAppContext();

  //accordian
  const [accordian, setAccordian] = useState([]);

  const handleAccordian = (e) => {
    if (accordian.includes(e)) {
      setAccordian(accordian.filter((a) => a !== e));
    } else {
      setAccordian([...accordian, e]);
    }
  };

  return (
    <>
      <form
        // onSubmit={handleSubmit}
        className='absolute z-30 inset-x-1 lg:inset-x-1/3 inset-y-7 bg-userWhite text-user1 rounded-md shadow-md overflow-y-auto'
      >
        <FaWindowClose
          className='absolute top-2 right-2 text-2xl cursor-pointer'
          onClick={() => setModalSalahRetenSekolah(false)}
        />
        <div className='h-10 bg-user9 flex justify-center items-center text-userWhite uppercase font-bold text-lg rounded-t-md'>
          Pengesahan
        </div>
        <div className='flex flex-col items-center justify-center px-3'>
          <h1 className='text-2xl font-bold text-center mt-3 border-b border-b-user1 py-3'>
            Anda perlu memilih reten untuk menanda reten salah murid ini
          </h1>
          <div className='mt-5 flex flex-col'>
            <p className='my-2 font-semibold'>
              Sila pilih mengikut pilihan anda
            </p>
            <Link
              target='_blank'
              rel='noreferrer'
              to={`/pengguna/landing/carian/sekolah/form-sekolah/pemeriksaan/${
                carianSekolah._id
              }/${
                carianSekolah.pemeriksaanSekolah
                  ? carianSekolah.pemeriksaanSekolah._id
                  : 'tambah-pemeriksaan'
              }`}
              className={`${
                carianSekolah.statusRawatan === 'enggan'
                  ? 'pointer-events-none text-userBlack shadow-none'
                  : carianSekolah.statusRawatan === 'tidak hadir'
                  ? 'pointer-events-none text-userBlack shadow-none'
                  : carianSekolah.pemeriksaanSekolah
                  ? 'bg-user7 text-userWhite shadow-md'
                  : filteredFasilitiSekolah.sekolahSelesaiReten === true
                  ? 'pointer-events-none text-userWhite bg-user4 shadow-none'
                  : 'bg-user6 text-userWhite shadow-md'
              } hover:bg-user8 rounded-sm p-1 m-1 transition-all`}
              onClick={() => setModalSalahRetenSekolah(false)}
            >
              {carianSekolah.statusRawatan === 'enggan'
                ? 'Enggan'
                : carianSekolah.statusRawatan === 'tidak hadir'
                ? 'Tidak Hadir'
                : carianSekolah.pemeriksaanSekolah
                ? 'lihat pemeriksaan'
                : 'Tambah Pemeriksaan'}
            </Link>
            <Link
              target='_blank'
              rel='noreferrer'
              to={`/pengguna/landing/carian/sekolah/form-sekolah/rawatan/${
                carianSekolah._id
              }/${
                carianSekolah.rawatanSekolah
                  ? carianSekolah.rawatanSekolah._id
                  : 'tambah-rawatan'
              }`}
              className={`${
                carianSekolah.statusRawatan === 'enggan'
                  ? 'pointer-events-none text-userBlack shadow-none'
                  : carianSekolah.statusRawatan === 'tidak hadir'
                  ? 'pointer-events-none text-userBlack shadow-none'
                  : carianSekolah.statusRawatan === 'enggan rawatan'
                  ? 'pointer-events-none text-userBlack shadow-none'
                  : carianSekolah.statusRawatan === 'tidak hadir rawatan'
                  ? 'pointer-events-none text-userBlack shadow-none'
                  : carianSekolah.statusRawatan === 'selesai'
                  ? ' bg-user7 text-userWhite shadow-md hover:bg-user8'
                  : !carianSekolah.pemeriksaanSekolah
                  ? 'pointer-events-none text-userWhite bg-user4 shadow-none'
                  : 'bg-user3 text-userWhite hover:bg-user2 shadow-md'
              } rounded-sm  p-1 m-1 transition-all`}
            >
              {carianSekolah.statusRawatan === 'enggan'
                ? 'Enggan'
                : carianSekolah.statusRawatan === 'tidak hadir'
                ? 'Tidak Hadir'
                : carianSekolah.statusRawatan === 'enggan rawatan'
                ? 'Enggan Rawatan'
                : carianSekolah.statusRawatan === 'tidak hadir rawatan'
                ? 'Tidak Hadir Rawatan'
                : carianSekolah.statusRawatan === 'selesai'
                ? 'selesai rawatan'
                : 'Lihat rawatan'}
            </Link>
          </div>
        </div>
      </form>
      <div
        onClick={() => setModalSalahRetenSekolah(false)}
        className='absolute inset-0 bg-user1 opacity-75 z-10'
      />
    </>
  );
}
