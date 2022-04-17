function UserPilihNama() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // some code here..
  };

  return (
    <>
      <h3 className='text-xl font-semibold mt-10'>
        selamat datang klinik pergigian alor janggus
      </h3>
      <form onSubmit={handleSubmit}>
        <select
          className='capitalize mt-12 leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-xl hover:cursor-pointer'
          name='user-pilih-nama-pengguna'
          id='user-pilih-nama-pengguna'
          required
        >
          <option selected disabled>
            SILA PILIH NAMA PENGGUNA
          </option>
          <option value='dr muhammad izyan'>DR MUHAMMAD IZYAN</option>
          <option value='dr aimaan'>DR AIMAAN</option>
          <option value='dr hensem kacak bergaya'>
            DR HENSEM KACAK BERGAYA
          </option>
        </select>
        <br />
        <br />
        <label
          htmlFor='user-pilih-nama-pengguna-relief'
          className='m-5 text-sm hover:cursor-pointer'
        >
          saya pegawai / staff relief
        </label>
        <input
          type='checkbox'
          id='user-pilih-nama-pengguna-relief'
          className='checked:ring-2 checked:ring-user1 checked:outline-none hover:cursor-pointer'
        />
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

export default UserPilihNama;
