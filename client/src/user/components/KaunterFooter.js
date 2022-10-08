function UserFooter() {
  return (
    <div className='absolute bottom-0 left-0 right-0 grid grid-cols-2 bg-kaunter1 uppercase'>
      <span className='text-left ml-5 my-1 text-xs'>hak cipta kkm</span>
      <span className='text-right mr-5 my-1 text-xs whitespace-nowrap overflow-x-auto'>
        <a
          className='text-admin2 underline'
          href='https://forms.gle/v9P7w9qweTX86Nxn8'
        >
          helpdesk: borang maklumbalas
        </a>
      </span>
    </div>
  );
}

export default UserFooter;
