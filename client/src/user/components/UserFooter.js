import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { FaArrowAltCircleUp } from 'react-icons/fa';

function UserFooter() {
  const [showFooter, setShowFooter] = useState(false);

  let footerRef = useRef();

  useEffect(() => {
    let tutupFooter = (e) => {
      if (!footerRef.current.contains(e.target)) {
        setShowFooter(false);
      }
    };
    document.addEventListener('mousedown', tutupFooter);
    return () => {
      document.removeEventListener('mousedown', tutupFooter);
    };
  });

  return (
    <div ref={footerRef}>
      <div className='absolute bottom-0 left-0 right-0 grid bg-user3 uppercase'>
        <div className='hidden lg:grid grid-cols-2 justify-start'>
          <p className='text-left ml-1 my-1 text-xs pl-2 whitespace-nowrap overflow-x-auto'>
            hak cipta kementerian kesihatan malaysia
          </p>
          <div className='hidden lg:flex flex-row justify-end pr-2'>
            <p className='flex justify-center text-center my-1 text-xs whitespace-nowrap overflow-x-auto pr-3'>
              <a
                target='_blank'
                className='underline'
                href='https://forms.gle/v9P7w9qweTX86Nxn8'
              >
                meja bantuan
              </a>
            </p>
            <p className='text-right mr-1 my-1 text-xs whitespace-nowrap overflow-x-auto'>
              <Link target='_blank' to='/faq' className='underline'>
                soalan lazim
              </Link>
            </p>
          </div>
        </div>
        <div className='lg:hidden grid justify-start'>
          <div
            className='flex flex-row items-center justify-evenly cursor-pointer'
            onClick={() => setShowFooter(!showFooter)}
          >
            <p className='text-left ml-1 my-1 text-xs pl-2 whitespace-nowrap overflow-x-auto'>
              hak cipta kementerian kesihatan malaysia
            </p>
            <FaArrowAltCircleUp
              className={`ml-3 items-center text-right transition-all ${
                showFooter && 'rotate-180'
              }`}
            />
          </div>
          <div
            className={`absolute z-10 bg-user4 bottom-5 right-0 w-full flex flex-col justify-center items-center text-center text-xs rounded-t-lg space-y-1 transition-all duration-500 ${
              showFooter
                ? 'max-h-min -translate-y-1'
                : 'max-h-0 overflow-hidden'
            }`}
          >
            <p className='flex justify-center text-center my-1 pb-2 py-1 text-xs whitespace-nowrap overflow-x-auto w-full border-b border-b-user1 border-opacity-50'>
              <a
                target='_blank'
                className='underline'
                href='https://forms.gle/v9P7w9qweTX86Nxn8'
              >
                meja bantuan
              </a>
            </p>
            <p className='text-center text-xs whitespace-nowrap overflow-x-auto py-1'>
              <Link target='_blank' to='/faq' className='underline'>
                soalan lazim
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserFooter;
