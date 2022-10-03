function UserFooter() {
  return (
    <div className='absolute bottom-0 left-0 right-0 grid grid-cols-2 bg-user3 uppercase'>
      <p className='text-left ml-1 my-1 text-xs'>hak cipta kkm</p>
      <p className='text-right mr-1 my-1 text-xs whitespace-nowrap overflow-x-auto'>
        <a
          className='text-admin2 underline'
          href='https://forms.gle/v9P7w9qweTX86Nxn8'
        >
          helpdesk: borang maklumbalas
        </a>
      </p>
    </div>
  );
}

export default UserFooter;
