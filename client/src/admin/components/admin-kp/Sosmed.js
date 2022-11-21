import { useGlobalAdminAppContext } from '../../context/adminAppContext';

import Facebook from '../../assets/socmed/facebook.svg';
import Instagram from '../../assets/socmed/instagram.png';
import Twitter from '../../assets/socmed/twitter.svg';
import Tiktok from '../../assets/socmed/tiktok.svg';
import Youtube from '../../assets/socmed/youtube.svg';

const socmed = [
  { name: 'Facebook', img: Facebook },
  { name: 'Instagram', img: Instagram },
  { name: 'Twitter', img: Twitter },
  { name: 'Tiktok', img: Tiktok },
  { name: 'Youtube', img: Youtube },
];

const SosmedCards = (current, props) => {
  return (
    <div className='w-1/3 rounded overflow-hidden shadow-lg'>
      <img className='w-1/3 mx-auto mt-2' src={current.img} alt='logo' />
      <div className='px-6 py-4'>
        <div className='font-bold text-xl mb-2'>{current.name}</div>
        <p className='text-gray-700 text-xs'>Data for {current.name}</p>
        {props.data.map((item) => {
          return (
            <div className='grid grid-row-2 mx-auto'>
              {item.data.map((sosmed) => {
                return (
                  <div className='flex flex-row justify-between'>
                    <p className='text-gray-700 text-xs'>
                      {Object.keys(sosmed).map((key) => {
                        if (key.includes(current.name)) {
                          return (
                            <div>
                              <p className='text-gray-700 text-xs'>
                                {key}: {sosmed[key]}
                              </p>
                            </div>
                          );
                        }
                      })}
                    </p>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const renderCards = (props) => {
  return socmed.map((name) => {
    return SosmedCards(name, props);
  });
};

export default function Sosmed(props) {
  if (props.data.length > 0) {
    return (
      <div className='flex flex-col items-center gap-5'>
        <h1 className='text-3xl font-bold mt-10 mb-10'>
          Senarai Media Sosial {props.kp}
        </h1>
        <div className='m-auto overflow-x-auto text-sm rounded-md h-min max-w-max'>
          {/* <div className='flex flex-auto m-2'>
            <SosmedCards />
            <SosmedCards />
            <SosmedCards />
          </div>
          <div className='flex flex-auto m-2'>
            <SosmedCards />
            <SosmedCards />
          </div> */}
          <div className='flex flex-auto m-2'>{renderCards(props)}</div>
        </div>
        {/* <div>
          <button
            className='bg-admin3 relative top-0 right-0 p-1 w-35 rounded-md text-white shadow-xl m-2'
            onClick={() => {
              props.setShowSosMedModal(true);
            }}
          >
            Tambah Aktiviti Media Sosial
          </button>
        </div> */}
      </div>
    );
  }
}
