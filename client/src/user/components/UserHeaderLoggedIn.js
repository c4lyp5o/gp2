function UserHeaderLoggedIn() {
  return (
    <div className='absolute flex w-auto h-16 top-10 right-7 capitalize text-xs'>
      <img
        className='w-full h-full aspect-square rounded-full shadow-xl outline outline-1 outline-user4'
        src='https://miro.medium.com/max/1400/1*X7n_UtdTaFoY4wZ4VIS7Dw.jpeg'
        alt='logo'
      />
      <div className='m-5'>
        <p className='w-max'>user: dr muhammad izyan</p>
        <p className='w-max'>KP : KP alor janggus</p>
      </div>
      <button
        type='button'
        className='mt-5 mb-5 p-1 text-user2 bg-user3 hover:bg-opacity-80 rounded-sm shadow-xl outline outline-1 outline-user4 transition-all'
      >
        LOGOUT
      </button>
    </div>
  );
}

export default UserHeaderLoggedIn;
