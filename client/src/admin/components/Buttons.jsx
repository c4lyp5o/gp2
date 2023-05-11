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
        func === 'pentadbir' ||
        func === 'add' ||
        func === 'edit' ||
        func === 'del'
          ? 'bg-admin3 text-adminWhite hover:bg-admin1'
          : null
      }
      `}
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
        {func === 'add' && 'Menambah Maklumat'}
        {func === 'del' && 'Menghapus Maklumat'}
        {func === 'edit' && 'Mengemaskini Maklumat'}
        {(func === 'pengguna' ||
          func === 'pendaftaran' ||
          func === 'pentadbir') &&
          'Sedang log masuk'}
      </button>
    </>
  );
}

export function SubmitButton({ func, level }) {
  let buttonText = '';
  let buttonClass = '';

  switch (func) {
    case 'add':
      buttonText = 'Tambah Maklumat';
      buttonClass = 'bg-admin3 text-adminWhite hover:bg-admin1';
      break;
    case 'del':
      buttonText = 'Hapus Maklumat';
      buttonClass = 'bg-admin3 text-adminWhite hover:bg-admin1';
      break;
    case 'edit':
      buttonText = 'Kemaskini Maklumat';
      buttonClass = 'bg-admin3 text-adminWhite hover:bg-admin1';
      break;
    case 'pengguna':
      buttonText = 'Log Masuk';
      buttonClass = 'bg-user3 text-userWhite hover:bg-user1';
      break;
    case 'pendaftaran':
      buttonText = 'Log Masuk';
      buttonClass = 'bg-kaunter2 text-userWhite hover:bg-kaunter1';
      break;
    case 'pentadbir':
      if (
        level.pilihanNegeri === '' &&
        level.pilihanDaerah === '' &&
        level.pilihanKlinik === ''
      ) {
        buttonText = 'Sila Pilih Pentadbir';
      } else if (level.pilihanNegeri === 'hqputrajaya') {
        buttonText = 'Log masuk sebagai PKP KKM';
      } else if (
        level.pilihanNegeri !== '' &&
        level.pilihanNegeri !== 'hqputrajaya' &&
        level.pilihanDaerah === ''
      ) {
        buttonText = `Log masuk sebagai pentadbir negeri ${
          level.pilihanNegeri.split('negeri')[1]
        }`;
      } else if (
        level.pilihanNegeri !== '' &&
        level.pilihanDaerah !== '' &&
        level.pilihanKlinik === ''
      ) {
        buttonText = `Log masuk sebagai pentadbir daerah ${level.pilihanDaerah}`;
      } else {
        buttonText = `Log masuk sebagai pentadbir ${level.userName.klinikName}`;
      }
      buttonClass = 'bg-admin3 text-adminWhite hover:bg-admin1';
      break;
    default:
      buttonText = '';
      buttonClass = '';
  }

  return (
    <button
      type='submit'
      className={`order-first lg:order-last capitalize rounded-md shadow-xl p-2 transition-all ${buttonClass}`}
      data-cy='submit-button-pentadbir'
    >
      {buttonText}
    </button>
  );
}
