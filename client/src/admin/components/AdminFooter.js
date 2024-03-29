function AdminFooter() {
  return (
    <div className='absolute bottom-0 left-0 right-0 grid grid-cols-2 bg-admin4 uppercase'>
      <span className='text-left ml-1 my-1 text-xs'>hak cipta kkm</span>
      <span className='text-right mr-1 my-1 text-xs'>
        helpdesk:
        <a
          className='text-admin2 underline'
          href='https://forms.gle/v9P7w9qweTX86Nxn8'
        >
          {' '}
          borang maklumbalas
        </a>
      </span>
    </div>
  );
}

export default AdminFooter;
