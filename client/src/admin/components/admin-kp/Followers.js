import Facebook from '../../assets/socmed/facebook.svg';
import Instagram from '../../assets/socmed/instagram.png';
import Twitter from '../../assets/socmed/twitter.svg';
import Tiktok from '../../assets/socmed/tiktok.svg';
import Youtube from '../../assets/socmed/youtube.svg';
import Lain from '../../assets/socmed/lain-lain.svg';

import { FaYoutube, FaTiktok } from 'react-icons/fa';

const socmed = [
  { name: 'facebook', img: Facebook },
  { name: 'instagram', img: Instagram },
  { name: 'twitter', img: Twitter },
  { name: 'tiktok', img: Tiktok },
  { name: 'youtube', img: Youtube },
  { name: 'lain', img: Lain },
];

function Followers(props) {
  return (
    <>
      <div className='flex flex-col items-center'>
        <h1 className='text-2xl font-bold mt-10 mb-10'>
          senarai bilangan <i>followers</i> mengikut jenis media sosial
        </h1>
        <div className='m-auto overflow-x-auto text-sm rounded-md h-min max-w-max mt-2'>
          <table className='table-auto'>
            <thead className='text-adminWhite bg-admin3 text-xl'>
              <tr>
                <th className='px-2 py-1 outline outline-1 outline-offset-1 text-xl'>
                  Bil.
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1 text-xl'>
                  Jenis Platform
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1 text-xl'>
                  Follower Bulan Terdahulu
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1 text-xl'>
                  Follower Bulan Ini
                </th>
              </tr>
            </thead>
            <tbody className='bg-admin4'>
              {props.data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className='px-2 py-1 outline outline-1 outline-offset-1 text-xl'>
                      {index + 1}
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-offset-1 grid grid-flow-col gap-2 text-xl'>
                      {item.namaPlatform}{' '}
                      {item.namaPlatform !== 'youtube' &&
                      item.namaPlatform !== 'tiktok' ? (
                        <img
                          width={20}
                          src={socmed
                            .filter(
                              (socmed) => socmed.name === item.namaPlatform
                            )
                            .map((socmed) => socmed.img)}
                          alt={item.namaPlatform}
                        />
                      ) : item.namaPlatform === 'youtube' ? (
                        <FaYoutube className='mt-1 text-admin3' />
                      ) : (
                        <FaTiktok className='mt-1 text-adminBlack' />
                      )}
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-offset-1 text-xl'>
                      {item.jumlahFollowerBulanTerdahulu}
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-offset-1 text-xl'>
                      {item.jumlahFollowerBulanIni}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Followers;
