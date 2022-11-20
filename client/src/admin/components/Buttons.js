export function BusyButton({ func }) {
  return (
    <>
      <button
        type='button'
        className='inline-flex items-center text-center justify-center px-4 py-2 bg-admin3 text-adminWhite rounded-md shadow-xl p-2 hover:bg-admin1 transition-all ease-in-out duration-150 cursor-not-allowed'
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
        {func === 'edit' ? 'Mengubah Maklumat' : null}
        {func === 'login' ? 'Sedang log masuk' : null}
      </button>
    </>
  );
}

export function SubmitButton({ func, level }) {
  return (
    <button
      type='submit'
      className='capitalize bg-admin3 text-adminWhite rounded-md shadow-xl p-2 hover:bg-admin1 transition-all'
    >
      {func === 'add' ? 'Tambah Maklumat' : null}
      {func === 'del' ? 'Hapus Maklumat' : null}
      {func === 'edit' ? 'Kemaskini Maklumat' : null}
      {func === 'login' &&
      level.pilihanNegeri === '' &&
      level.pilihanDaerah === '' &&
      level.pilihanKlinik === ''
        ? 'Sila Pilih Pentadbir'
        : null}
      {func === 'login' &&
      level.pilihanNegeri !== '' &&
      level.pilihanDaerah === '' &&
      level.pilihanKlinik === ''
        ? `Log masuk sebagai pentadbir negeri ${level.pilihanNegeri}`
        : null}
      {func === 'login' &&
      level.pilihanNegeri !== '' &&
      level.pilihanDaerah !== '' &&
      level.pilihanKlinik === ''
        ? `Log masuk sebagai pentadbir daerah ${level.pilihanDaerah}`
        : null}
      {func === 'login' &&
      level.pilihanNegeri !== '' &&
      level.pilihanDaerah !== '' &&
      level.pilihanKlinik !== ''
        ? `Log masuk sebagai pentadbir ${level.userName.klinikName}`
        : null}
    </button>
  );
}
