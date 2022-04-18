function UserPilihFasiliti() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // some code here..
  };

  return (
    <>
      <h3 className='text-xl font-semibold mt-10'>
        <h3>pilih fasiliti relief anda</h3>
      </h3>
      <form onSubmit={handleSubmit}>
        <select
          className='mt-12 leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-xl hover:cursor-pointer'
          name='user-pilih-fasiliti'
          id='user-pilih-fasiliti'
          required
        >
          <option selected disabled>
            SILA PILIH NAMA FASILITI RELIEF
          </option>
          <option value='kp jalan putra'>KP JALAN PUTRA</option>
          <option value='kp datuk kumbar'>KP DATUK KUMBAR</option>
          <option value='kp terbaik dan tercantik'>
            KP TERBAIK DAN TERCANTIK
          </option>
        </select>
        <br />
        <br />
        <button
          type='submit'
          className='capitalize ml-5 bg-user3 text-userWhite rounded-md shadow-xl px-5 py-2 hover:bg-user1 transition-all'
        >
          pilih
        </button>
      </form>
    </>
  );
}

export default UserPilihFasiliti;
