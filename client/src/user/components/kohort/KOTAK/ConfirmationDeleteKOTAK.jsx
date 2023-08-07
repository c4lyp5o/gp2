import { FaWindowClose, FaUserCheck } from 'react-icons/fa';

function ConfirmationDeleteKotak({
  nama,
  modalConfirmDeleteKotak,
  setModalConfirmDeleteKotak,
  melaksanakanSaringanMerokok,
  setMelaksanakanSaringanMerokok,
  statusM,
  setStatusM,
  menerimaNasihatRingkas,
  setMenerimaNasihatRingkas,
  modalHapus,
  setModalHapus,
}) {
  const submitConfirmDeleteKotak = () => {
    setModalHapus(!modalHapus);
    setModalConfirmDeleteKotak(!modalConfirmDeleteKotak);
  };

  const closeModalConfirmDeleteKotak = () => {
    setModalConfirmDeleteKotak(!modalConfirmDeleteKotak);
    setMelaksanakanSaringanMerokok('');
    setStatusM('');
    setMenerimaNasihatRingkas('');
  };

  return (
    <>
      <form
        onSubmit={submitConfirmDeleteKotak}
        className='absolute inset-x-0 inset-y-0 lg:inset-x-1/3 lg:inset-y-6 text-sm bg-userWhite z-10 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'
      >
        <FaWindowClose
          onClick={closeModalConfirmDeleteKotak}
          className='absolute mr-1 mt-1 text-xl text-userBlack right-0 hover:cursor-pointer hover:text-user2 transition-all'
        />
        <div className='grid grid-rows-[1fr_8fr_1fr] h-full'>
          <h5 className='bg-user9 text-userWhite font-semibold text-xl h-7'>
            PERHATIAN
          </h5>
          <div className='mt-1 py-1 px-4'>
            <span className='relative flex items-center justify-center mt-4'>
              <FaUserCheck className='text-4xl text-user9 mx-auto absolute animate-ping' />
              <FaUserCheck className='text-4xl text-user9 mx-auto absolute' />
            </span>
            <p className='px-1 font-semibold my-7 flex flex-col normal-case'>
              <span>
                Sila isi maklumat berikut sekiranya ingin menghapuskan pelajar
              </span>
              {nama}
            </p>
            <div className='grid grid-cols-[3fr_2fr] my-1'>
              <p className='flex flex-row text-left text-sm normal-case whitespace-pre-wrap '>
                <span>
                  Melaksanakan saringan merokok melalui Program KOTAK
                  <b className='text-user6'>*</b>
                </span>
              </p>
              <div className='grid grid-cols-2 gap-2 my-2'>
                <label
                  htmlFor='ya-melaksanakan-saringan-merokok'
                  className={`flex justify-center items-center py-1 px-1 rounded-md shadow-sm shadow-user1 ${
                    melaksanakanSaringanMerokok ===
                    'ya-melaksanakan-saringan-merokok'
                      ? ' ring ring-offset-user12 bg-user4 bg-opacity-30 transition-all duration-500'
                      : ''
                  }`}
                >
                  <input
                    required
                    type='radio'
                    name='melaksanakan-saringan-merokok'
                    id='ya-melaksanakan-saringan-merokok'
                    value='ya-melaksanakan-saringan-merokok'
                    checked={
                      melaksanakanSaringanMerokok ===
                      'ya-melaksanakan-saringan-merokok'
                        ? true
                        : false
                    }
                    onChange={(e) => {
                      setMelaksanakanSaringanMerokok(e.target.value);
                      setStatusM('');
                      setMenerimaNasihatRingkas('');
                    }}
                    className='hidden'
                  />
                  <span>Ya</span>
                </label>
                <label
                  htmlFor='tidak-melaksanakan-saringan-merokok'
                  className={`flex justify-center items-center py-1 px-1 rounded-md shadow-sm shadow-user1 ${
                    melaksanakanSaringanMerokok ===
                    'tidak-melaksanakan-saringan-merokok'
                      ? ' ring ring-offset-user12 bg-user4 bg-opacity-30 transition-all duration-500'
                      : ''
                  }`}
                >
                  <input
                    required
                    type='radio'
                    name='melaksanakan-saringan-merokok'
                    id='tidak-melaksanakan-saringan-merokok'
                    value='tidak-melaksanakan-saringan-merokok'
                    checked={
                      melaksanakanSaringanMerokok ===
                      'tidak-melaksanakan-saringan-merokok'
                        ? true
                        : false
                    }
                    onChange={(e) => {
                      setMelaksanakanSaringanMerokok(e.target.value);
                      setStatusM('');
                      setMenerimaNasihatRingkas('');
                    }}
                    className='hidden'
                  />
                  <span>tidak</span>
                </label>
              </div>
            </div>
            {melaksanakanSaringanMerokok ===
              'ya-melaksanakan-saringan-merokok' && (
              <div className='text-sm grid grid-cols-[3fr_2fr] my-1 '>
                <label
                  htmlFor='statusM'
                  className='flex items-center text-sm normal-case'
                >
                  Status Merokok<b className='text-user6'>*</b>
                </label>
                <select
                  required
                  name='statusM'
                  id='statusM'
                  value={statusM}
                  onChange={(e) => {
                    setStatusM(e.target.value);
                  }}
                  className='appearance-none text-sm uppercase w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                >
                  <option value=''></option>
                  {/* <option value='perokok-semasa'>Perokok Semasa</option> */}
                  <option value='bekas-perokok'>Bekas Perokok</option>
                  <option value='perokok-pasif'>Perokok Pasif</option>
                  <option value='bukan-perokok'>Bukan Perokok</option>
                  {/* <option value='dalam-intervensi'>
                              Dalam Intervensi
                            </option> */}
                </select>
              </div>
            )}
            {melaksanakanSaringanMerokok ===
              'ya-melaksanakan-saringan-merokok' && (
              <div className='grid grid-cols-[3fr_2fr] my-1'>
                <p className='flex items-center text-sm normal-case'>
                  Pesakit menerima nasihat ringkas?
                  <b className='text-user6'>*</b>
                </p>
                <div className='grid grid-cols-2 gap-2 my-2'>
                  <label
                    htmlFor='ya-menerima-nasihat-ringkas'
                    className={`flex justify-center items-center py-1 px-1 rounded-md shadow-sm shadow-user1 ${
                      menerimaNasihatRingkas === 'ya-menerima-nasihat-ringkas'
                        ? ' ring ring-offset-user12 bg-user4 bg-opacity-30 transition-all duration-500'
                        : ''
                    }`}
                  >
                    <input
                      required
                      type='radio'
                      name='menerima-nasihat-ringkas'
                      id='ya-menerima-nasihat-ringkas'
                      value='ya-menerima-nasihat-ringkas'
                      checked={
                        menerimaNasihatRingkas === 'ya-menerima-nasihat-ringkas'
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        setMenerimaNasihatRingkas(e.target.value);
                      }}
                      className='hidden'
                    />
                    <span>Ya</span>
                  </label>
                  <label
                    htmlFor='tidak-menerima-nasihat-ringkas'
                    className={`flex justify-center items-center py-1 px-1 rounded-md shadow-sm shadow-user1 ${
                      menerimaNasihatRingkas ===
                      'tidak-menerima-nasihat-ringkas'
                        ? ' ring ring-offset-user12 bg-user4 bg-opacity-30 transition-all duration-500'
                        : ''
                    }`}
                  >
                    <input
                      required
                      type='radio'
                      name='menerima-nasihat-ringkas'
                      id='tidak-menerima-nasihat-ringkas'
                      value='tidak-menerima-nasihat-ringkas'
                      checked={
                        menerimaNasihatRingkas ===
                        'tidak-menerima-nasihat-ringkas'
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        setMenerimaNasihatRingkas(e.target.value);
                      }}
                      className='hidden'
                    />
                    <span>tidak</span>
                  </label>
                </div>
              </div>
            )}
          </div>
          <div className='sticky grid grid-cols-2 bottom-0 right-0 left-0 m-2 mx-10 bg-userWhite px-5 py-2'>
            <button
              type='submit'
              className='capitalize bg-user9 text-userWhite rounded-md shadow-xl p-2 mr-3 hover:bg-user1 transition-all flex justify-center items-center'
            >
              TERUSKAN
            </button>
            <span
              onClick={closeModalConfirmDeleteKotak}
              className='capitalize bg-userWhite text-userBlack rounded-md p-2 ml-3 hover:bg-user5 cursor-pointer transition-all'
            >
              Tidak
            </span>
          </div>
        </div>
      </form>
      <div
        onClick={closeModalConfirmDeleteKotak}
        className='absolute inset-0 bg-user1 opacity-75 z-0'
      />
    </>
  );
}

export default ConfirmationDeleteKotak;