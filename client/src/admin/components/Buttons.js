export function BusyButton({ func }) {
  return (
    <>
      <button
        type='button'
        className={`inline-flex items-center text-center justify-center px-4 py-2 order-first lg:order-last capitalize rounded-md shadow-xl p-2 transition-all ease-in-out duration-150 cursor-not-allowed 
      ${func === 'pengguna' ? 'bg-user3 text-userWhite hover:bg-user1' : null} 
      ${
        func === 'pendaftaran'
          ? 'bg-kaunter2 text-userWhite hover:bg-kaunter1'
          : null
      }
      ${
        func === 'pentadbir'
          ? 'bg-admin3 text-adminWhite hover:bg-admin1'
          : null
      }
      `}
        disabled=''
      >
        <svg
          className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
        >
          <circle
            className='opacity-25'
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='4'
          ></circle>
          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
          ></path>
        </svg>
        {func === 'add' ? 'Menambah Maklumat' : null}
        {func === 'del' ? 'Menghapus Maklumat' : null}
        {func === 'edit' ? 'Mengemaskini Maklumat' : null}
        {func === 'pengguna' || func === 'pendaftaran' || func === 'pentadbir'
          ? 'Sedang log masuk'
          : null}
      </button>
    </>
  );
}

export function SubmitButton({ func, level }) {
  return (
    <button
      type='submit'
      className={`order-first lg:order-last capitalize rounded-md shadow-xl p-2 transition-all 
      ${func === 'pengguna' ? 'bg-user3 text-userWhite hover:bg-user1' : null} 
      ${
        func === 'pendaftaran'
          ? 'bg-kaunter2 text-userWhite hover:bg-kaunter1'
          : null
      }
      ${
        func === 'pentadbir' ||
        func === 'add' ||
        func === 'edit' ||
        func === 'del'
          ? 'bg-admin3 text-adminWhite hover:bg-admin1'
          : null
      }
      `}
    >
      {func === 'add' ? 'Tambah Maklumat' : null}
      {func === 'del' ? 'Hapus Maklumat' : null}
      {func === 'edit' ? 'Kemaskini Maklumat' : null}
      {func === 'pengguna' || func === 'pendaftaran' ? 'Log Masuk' : null}
      {func === 'pentadbir' &&
      level.pilihanNegeri === '' &&
      level.pilihanDaerah === '' &&
      level.pilihanKlinik === ''
        ? 'Sila Pilih Pentadbir'
        : null}
      {func === 'pentadbir' &&
      level.pilihanNegeri === 'hqputrajaya' &&
      level.pilihanDaerah === '' &&
      level.pilihanKlinik === ''
        ? `Log masuk sebagai PKP KKM HQ`
        : null}
      {func === 'pentadbir' &&
      level.pilihanNegeri !== '' &&
      level.pilihanNegeri !== 'hqputrajaya' &&
      level.pilihanDaerah === '' &&
      level.pilihanKlinik === ''
        ? `Log masuk sebagai pentadbir negeri ${
            level.pilihanNegeri.split('negeri')[1]
          }`
        : null}
      {func === 'pentadbir' &&
      level.pilihanNegeri !== '' &&
      level.pilihanDaerah !== '' &&
      level.pilihanKlinik === ''
        ? `Log masuk sebagai pentadbir daerah ${level.pilihanDaerah}`
        : null}
      {func === 'pentadbir' &&
      level.pilihanNegeri !== '' &&
      level.pilihanDaerah !== '' &&
      level.pilihanKlinik !== ''
        ? `Log masuk sebagai pentadbir ${level.userName.klinikName}`
        : null}
    </button>
  );
}
