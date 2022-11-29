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
  const { DictionarySosMedParam, DictionarySosMedAcronym } =
    useGlobalAdminAppContext();
  return (
    <div className='w-1/3 rounded overflow-hidden shadow-lg'>
      <img className='h-20 mx-auto mt-2 p-4' src={current.img} alt='logo' />
      <div className='px-6 py-4'>
        <div className='font-bold text-xl mb-2'>{current.name}</div>
        {props.data.map((item) => {
          if (item.name === current.name) {
            return (
              <div className='grid grid-row-2 mx-auto'>
                {item.data.map((type) => {
                  return (
                    <div className='flex flex-row justify-between'>
                      <p className='text-gray-700 text-xs'>
                        {type.name === 'live' && item.name !== 'Twitter' ? (
                          <div className='mb-2'>
                            <span className='bg-admin3 text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                              {DictionarySosMedAcronym(type.name)}
                            </span>
                            {type.data.map((live) => {
                              return (
                                <div>
                                  <p className='text-gray-700 text-xs mt-1'>
                                    {Object.keys(live).map((key) => {
                                      return (
                                        <div>
                                          <p className='text-gray-700 text-xs mt-1'>
                                            {DictionarySosMedAcronym(
                                              key.split('_')[0]
                                            )}{' '}
                                            {DictionarySosMedParam(key)}:{' '}
                                            {live[key]}
                                          </p>
                                        </div>
                                      );
                                    })}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        ) : null}
                        {type.name === 'poster' &&
                        item.name !== 'Youtube' &&
                        item.name !== 'Tiktok' ? (
                          <div className='mb-2'>
                            <span className='bg-admin3 text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                              {type.name}
                            </span>
                            {type.data.map((live) => {
                              return (
                                <div>
                                  <p className='text-gray-700 text-xs mt-1'>
                                    {Object.keys(live).map((key) => {
                                      return (
                                        <div>
                                          <p className='text-gray-700 text-xs mt-1'>
                                            {DictionarySosMedAcronym(
                                              key.split('_')[0]
                                            )}{' '}
                                            {DictionarySosMedParam(key)}:{' '}
                                            {live[key]}
                                          </p>
                                        </div>
                                      );
                                    })}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        ) : null}
                        {type.name === 'video' ? (
                          <div className='mb-2'>
                            <span className='bg-admin3 text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                              {type.name}
                            </span>
                            {type.data.map((live) => {
                              return (
                                <div>
                                  <p className='text-gray-700 text-xs mt-1'>
                                    {Object.keys(live).map((key) => {
                                      return (
                                        <div>
                                          <p className='text-gray-700 text-xs mt-1'>
                                            {DictionarySosMedAcronym(
                                              key.split('_')[0]
                                            )}{' '}
                                            {DictionarySosMedParam(key)}:{' '}
                                            {live[key]}
                                          </p>
                                        </div>
                                      );
                                    })}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        ) : null}
                      </p>
                    </div>
                  );
                })}
              </div>
            );
          }
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
          <div className='flex flex-auto m-2'>{renderCards(props)}</div>
        </div>
        <div className='m-3'>
          <button
            className='bg-user9 text-userWhite text-sm rounded-md px-2 py-1 hover:bg-user6 hover:cursor-pointer transition-all'
            onClick={() =>
              props.setShowSosMedDataModal(!props.showSosMedDataModal)
            }
          >
            Lihat data berdasarkan kod program
          </button>
        </div>
      </div>
    );
  }
}
