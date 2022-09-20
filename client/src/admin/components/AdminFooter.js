function AdminFooter() {
  return (
    <div className='absolute bottom-0 left-0 right-0 grid grid-cols-2 bg-admin4 uppercase'>
      <span className='text-left ml-1 my-1 text-xs'>hak cipta kkm</span>
      <span className='text-right mr-1 my-1 text-xs'>
        helpdesk:
        <a href='#'> emel</a> /<a href='#'> phone</a> /
        <a href='#'> link ke borang pertanyaan</a>
      </span>
    </div>
  );
}

export default AdminFooter;
