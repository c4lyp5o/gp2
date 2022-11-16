import { Link } from 'react-router-dom';

function UserPromosi() {
  return (
    <>
      <div className='px-3 lg:px-10 h-full p-3 overflow-y-auto'>
        {/* carian */}
        <p>placeholder</p>
        <br />
        <Link
          to='form-promosi'
          className='uppercase bg-user3 text-base text-userWhite rounded-md shadow-md p-2 hover:bg-user1 transition-all'
        >
          ke form promosi
        </Link>
      </div>
    </>
  );
}

export default UserPromosi;
