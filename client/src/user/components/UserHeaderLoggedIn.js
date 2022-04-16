function AdminHeaderLoggedIn() {
  return (
    <div className='absolute top-14 right-20 grid grid-cols-[3.5rem_auto_auto] grid-rows-2 gap-5 font-sans capitalize text-xs w-48 h-14'>
      <img
        className='row-span-2 w-full h-full aspect-square rounded-full shadow-xl outline outline-1 outline-user4'
        src='https://miro.medium.com/max/1400/1*X7n_UtdTaFoY4wZ4VIS7Dw.jpeg'
        alt='logo'
      />
      <p className='w-max'>User: Dr Izyan asdlfkjklasdfjksldfj</p>
      <button
        type='button'
        className='row-span-2 mt-3 mb-3 p-1 text-user2 bg-user3 hover:bg-opacity-80 rounded-sm shadow-xl outline outline-1 outline-user4'
      >
        LOGOUT
      </button>
      <p className='w-max'>KP : KP alor janggus</p>
    </div>
  );
}

export default AdminHeaderLoggedIn;
