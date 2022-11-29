import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <div className='absolute bottom-0 left-0 right-0 grid grid-cols-2 bg-admin4 uppercase'>
      <span className='text-left ml-1 my-1 text-xs'>hak cipta kkm</span>
      <p className='text-right mr-1 my-1 text-xs whitespace-nowrap overflow-x-auto'>
        <Link target='_blank' to='/faq' className='underline'>
          bantuan perkhidmatan: soalan lazim giret 2.0
        </Link>
      </p>
    </div>
  );
}
