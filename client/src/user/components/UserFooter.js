function UserFooter() {
  return (
    <div className='absolute bottom-0 left-0 right-0 grid grid-cols-2 bg-user3 uppercase'>
      <span className='text-left ml-5 my-1 text-xs sm:text-sm'>
        hak cipta kkm
      </span>
      <span className='text-right mr-1 sm:mr-5 my-1 text-xs sm:text-sm truncate'>
        helpdesk : emel / phone / link ke borang pertanyaan
      </span>
    </div>
  );
}

export default UserFooter;
