function AdminHeaderLoggedIn() {
  return (
    <>
      <div className='user-header-gambar'>
        <img
          width={100}
          height={100}
          src='https://www.rubiks.com/media/catalog/product/cache/9c57e2fe71f8a58f6afba681a0a15dd4/r/u/rubik-4x4-solved_4.jpg'
          alt='logo'
        />
      </div>
      <div className='user-header-info'>
        <p>hehe boi</p>
        <p>hehe boi</p>
      </div>
      <div className='user-header-logout'>
        <button className='user-header-logout-button'>LOGOUT</button>
      </div>
    </>
  );
}

export default AdminHeaderLoggedIn;
