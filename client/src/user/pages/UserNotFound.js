import { Link } from 'react-router-dom';

function UserNotFound() {
  return (
    <>
      <div className='absolute inset-0 -z-10 flex bg-user4 text-center justify-center items-center capitalize'>
        <div className='w-1/2 h-[25rem] mt-20 mb-5 bg-userWhite outline outline-1 outline-userBlack rounded-md shadow-xl'>
          <div>Page not found</div>
          <Link to='/login'>Back to login</Link>
        </div>
      </div>
    </>
  );
}

export default UserNotFound;
