function AdminLoginForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // some code here..
  };

  return (
    <div className='user-form-container'>
      <div className='user-form-box'>
        <div className='user-form-box-header'>
          <span className='user-form-box-header-text'>
            sila masukkan kata laluan
          </span>
        </div>
        <form className='user-form-box-container' onSubmit={handleSubmit}>
          <input
            className='user-form-box-input'
            type='text'
            placeholder='ID Pengguna'
          />
          <br />
          <input
            className='user-form-box-input'
            type='text'
            placeholder='Kata Laluan'
          />
          <br />
          <a className='link-lupa' href='#lupa-kata-laluan'>
            lupa kata laluan
          </a>
          <br />
          <button type='submit' className='user-form-box-submit'>
            log masuk
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginForm;
