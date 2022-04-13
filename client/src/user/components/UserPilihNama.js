function UserPilihNama() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // some code here..
  };

  return (
    <>
      <div className='user-pilih-nama-header'>
        <h3>selamat datang klinik pergigian alor janggus</h3>
      </div>
      <form
        className='user-form-pilih-nama-pengguna-container'
        onSubmit={handleSubmit}
      >
        <select
          className='user-pilih-nama-pengguna-option'
          name='user-pilih-nama-pengguna-option'
          id='user-pilih-nama-pengguna-option'
        >
          <option selected disabled>
            sila pilih nama pengguna
          </option>
          <option value='officer 1'>officer 1</option>
          <option value='staff 2'>staff 2</option>
          <option value='officer 3'>officer 3</option>
        </select>
        <button type='submit' className='user-pilih-nama-pengguna-btn'>
          pilih
        </button>
        <br />
        <label htmlFor='user-pilih-nama-pengguna-relief'>
          saya pegawai / staff relief
        </label>
        <input type='checkbox' id='user-pilih-nama-pengguna-relief' />
      </form>
    </>
  );
}

export default UserPilihNama;
