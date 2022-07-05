import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaInfoCircle } from 'react-icons/fa';

import { useGlobalUserAppContext } from '../context/userAppContext';

import Kemaskini from './form-umum/Kemaskini';
import FasilitiPerkhidmatan from './form-umum/FasilitiPerkhidmatan';
import MaklumatLanjut from './form-umum/MaklumatLanjut';
// import Pemeriksaan from './form-umum/Pemeriksaan';
// import Rawatan from './form-umum/Rawatan';
// import Promosi from './form-umum/Promosi';
// import Kotak from './form-umum/Kotak';

function UserFormUmumHeader() {
  const { userToken, username, navigate, catchAxiosErrorAndLogout, useParams } =
    useGlobalUserAppContext();

  const { personUmumId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const [singlePersonUmum, setSinglePersonUmum] = useState([]);
  const [showKemaskini, setShowKemasKini] = useState(false);

  // creating masterForm object to be used by the form
  const masterForm = {};

  useEffect(() => {
    const fetchSinglePersonUmum = async () => {
      try {
        const { data } = await axios.get(`/api/v1/umum/${personUmumId}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setSinglePersonUmum(data.singlePersonUmum);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSinglePersonUmum();
  }, [showKemaskini]);

  const kemaskini = () => {
    setShowKemasKini(true);
  };

  const handleSubmit = () => {
    // do something..
  };

  const handleNext = () => {
    // do something..
  };

  return (
    <>
      <div className='h-full p-3 px-10 overflow-y-auto'>
        <div className='p-2'>
          <article className='outline outline-1 outline-userBlack grid grid-cols-1 md:grid-cols-2'>
            <div>
              <div className='text-l font-bold flex flex-row pl-5 p-2'>
                <h1>MAKLUMAT AM PESAKIT</h1>
                <FaInfoCircle
                  className='m-1 text-lg'
                  onMouseEnter={() => setIsShown(true)}
                  onMouseLeave={() => setIsShown(false)}
                />
              </div>
              {isShown && (
                <div className='z-100 absolute float-right box-border outline outline-1 outline-userBlack left-72 p-5 bg-userWhite '>
                  <div className='flex flex-row text-sm'>
                    <h2 className='font-semibold'>NAMA :</h2>
                    <p className='ml-1'>{singlePersonUmum.nama}</p>
                  </div>
                  <div className='text-sm flex flex-row '>
                    <h2 className='font-semibold'>IC/PASSPORT :</h2>
                    <p className='ml-1'>{singlePersonUmum.ic}</p>
                  </div>
                  <div className='text-sm flex flex-row '>
                    <h2 className='font-semibold'>JANTINA :</h2>
                    <p className='ml-1'>{singlePersonUmum.jantina}</p>
                  </div>
                  <div className='text-sm flex flex-row '>
                    <h2 className='font-semibold'>TARIKH LAHIR :</h2>
                    <p className='ml-1'>{singlePersonUmum.tarikhLahir}</p>
                  </div>
                  <div className='text-sm flex flex-row '>
                    <h2 className='font-semibold'>KUMPULAN ETNIK :</h2>
                    <p className='ml-1'>{singlePersonUmum.kumpulanEtnik}</p>
                  </div>
                  <div className='text-sm flex flex-row '>
                    <h2 className='font-semibold'>KATEGORI PESAKIT :</h2>
                    <p className='ml-1'>{singlePersonUmum.kategoriPesakit}</p>
                  </div>
                </div>
              )}
              <div className='text-s flex flex-row pl-5'>
                <h2 className='font-semibold'>NAMA :</h2>
                <p className='ml-1'>{singlePersonUmum.nama}</p>
              </div>
              <div className='text-s flex flex-row pl-5'>
                <h2 className='font-semibold'>UMUR :</h2>
                <p className='ml-1'>{singlePersonUmum.umur} tahun</p>
              </div>
            </div>
            <div className='md:pt-10'>
              <div className='text-s flex flex-row pl-5'>
                <h2 className='font-semibold'>JANTINA :</h2>
                <p className='ml-1'>{singlePersonUmum.jantina}</p>
              </div>
              <div className='text-s flex flex-row pl-5'>
                <h2 className='font-semibold'>IC/Passport :</h2>
                <p className='ml-1'>{singlePersonUmum.ic}</p>
              </div>
              <button
                onClick={kemaskini}
                className='float-right m-2 px-5 py-2 capitalize bg-user3 hover:bg-user1 hover:text-userWhite transition-all'
              >
                kemaskini
              </button>
            </div>
          </article>
        </div>
        <form onSubmit={handleSubmit}>
          <FasilitiPerkhidmatan {...masterForm} />
          <MaklumatLanjut {...masterForm} />
          {/* <Pemeriksaan {...masterForm} /> */}
          {/* <Rawatan {...masterForm} /> */}
          {/* <Promosi {...masterForm} /> */}
          {/* <Kotak {...masterForm} /> */}
          <div className='grid grid-cols-1 lg:grid-cols-2 col-start-1 md:col-start-2 gap-2 col-span-2 md:col-span-1'>
            <div className='grid grid-cols-3 gap-3 lg:col-start-2'>
              <button className='flex bg-user3 p-2 w-full capitalize justify-center hover:bg-user1 hover:text-userWhite transition-all'>
                kosongkan
              </button>
              <button className='flex bg-user3 p-2 w-full capitalize justify-center hover:bg-user1 hover:text-userWhite transition-all'>
                teruskan
              </button>
              <button
                type='submit'
                className='flex bg-user3 p-2 w-full capitalize justify-center hover:bg-user1 hover:text-userWhite transition-all'
              >
                hantar
              </button>
            </div>
          </div>
        </form>
      </div>
      {showKemaskini && (
        <Kemaskini
          showKemaskini={showKemaskini}
          setShowKemaskini={setShowKemasKini}
        />
      )}
    </>
  );
}

export default UserFormUmumHeader;
