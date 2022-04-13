function AdminLoginForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // some code here..
  };

  return (
    <div className='admin-form-container'>
      <div className='admin-form-box'>
        <div className='admin-form-box-header'>
          <span className='admin-form-box-header-text'>
            sila masukkan kata laluan
          </span>
        </div>
        <form className='admin-form-box-container' onSubmit={handleSubmit}>
          <input
            className='admin-form-box-input'
            type='text'
            placeholder='ID Pengguna'
          />
          <br />
          <input
            className='admin-form-box-input'
            type='text'
            placeholder='Kata Laluan'
          />
          <br />
          <a className='link-lupa' href='#lupa-kata-laluan'>
            lupa kata laluan
          </a>
          <br />
          <button type='submit' className='admin-form-box-submit'>
            log masuk
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginForm;
