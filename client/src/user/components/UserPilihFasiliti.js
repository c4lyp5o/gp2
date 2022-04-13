function UserPilihFasiliti() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // some code here..
  };

  return (
    <>
      <div className='user-pilih-fasiliti-header'>
        <h3>pilih fasiliti relief anda</h3>
      </div>
      <form
        className='user-form-pilih-fasiliti-container'
        onSubmit={handleSubmit}
      >
        <select
          className='user-pilih-fasiliti-option'
          name='user-pilih-fasiliti-option'
          id='user-pilih-fasiliti-option'
        >
          <option selected disabled>
            sila pilih nama fasiliti relief
          </option>
          <option value='fasiliti 1'>fasiliti 1</option>
          <option value='fasiliti 2'>fasiliti 2</option>
          <option value='fasiliti 3'>fasiliti 3</option>
        </select>
        <button type='submit' className='user-pilih-fasiliti-btn'>
          pilih
        </button>
      </form>
    </>
  );
}

export default UserPilihFasiliti;
