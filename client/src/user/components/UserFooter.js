import { Link } from 'react-router-dom';

function UserFooter() {
  return (
    <div className='absolute bottom-0 left-0 right-0 grid grid-cols-2 bg-user3 uppercase'>
      <p className='text-left ml-1 my-1 text-xs'>hak cipta kkm</p>
      <p className='text-right mr-1 my-1 text-xs whitespace-nowrap overflow-x-auto'>
        <Link target='_blank' to='/faq' className='underline'>
          meja bantuan: soalan lazim giret 2.0
        </Link>
      </p>
    </div>
  );
}

export default UserFooter;
