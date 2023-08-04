import Facebook from '../../assets/socmed/facebook.svg';
import Instagram from '../../assets/socmed/instagram.png';
import Twitter from '../../assets/socmed/twitter.svg';
import Tiktok from '../../assets/socmed/tiktok.svg';
import Youtube from '../../assets/socmed/youtube.svg';
import Lain from '../../assets/socmed/lain-lain.svg';

import moment from 'moment';

import { FaYoutube, FaTiktok } from 'react-icons/fa';

import { useGlobalAdminAppContext } from '../../context/adminAppContext';
import { useUtils } from '../../context/useUtils';

const socmed = [
  { name: 'facebook', img: Facebook },
  { name: 'instagram', img: Instagram },
  { name: 'twitter', img: Twitter },
  { name: 'tiktok', img: Tiktok },
  { name: 'youtube', img: Youtube },
  { name: 'lain', img: Lain },
];

function Followers(props) {
  const { percentageCalc } = useUtils();
  return (
    <>
      <div className='flex flex-col items-center'>
        <h1 className='text-2xl font-bold mt-10 mb-10'>
          senarai bilangan <i>followers</i> mengikut jenis media sosial
        </h1>
        <div className='m-auto overflow-x-auto text-sm rounded-md h-min max-w-max mt-2'>
          <table className='table-auto'>
            <thead className='text-adminWhite bg-admin3 outline-adminWhite'>
              <tr>
                <th className='px-2 py-1 outline outline-1 outline-offset-1 outline-adminWhite'>
                  Bil.
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1 outline-adminWhite w-48'>
                  Jenis Platform
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1 outline-adminWhite w-48'>
                  Follower Bulan Terdahulu
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1 outline-adminWhite w-48'>
                  Follower Bulan Ini
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1 outline-adminWhite w-48'>
                  Jumlah peningkatan atau penurunan
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1 outline-adminWhite w-48'>
                  Peratus peningkatan atau penurunan
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1 outline-adminWhite w-48'>
                  Tarikh Mula
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1 outline-adminWhite w-48'>
                  Tarikh Akhir
                </th>
              </tr>
            </thead>
            <tbody className='bg-admin4'>
              {props.data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className='px-2 py-1 outline outline-1 outline-offset-1 outline-adminWhite'>
                      {index + 1}
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-offset-1 grid grid-flow-col gap-2 outline-adminWhite'>
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
                    <td className='px-2 py-1 outline outline-1 outline-offset-1 outline-adminWhite'>
                      {item.jumlahFollowerBulanTerdahulu}
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-offset-1 outline-adminWhite'>
                      {item.jumlahFollowerBulanIni}
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-offset-1 outline-adminWhite'>
                      {item.jumlahFollowerBulanIni -
                        item.jumlahFollowerBulanTerdahulu}
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-offset-1 outline-adminWhite'>
                      {percentageCalc(
                        item.jumlahFollowerBulanIni,
                        item.jumlahFollowerBulanTerdahulu
                      )}
                      %
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-offset-1 outline-adminWhite'>
                      {item.tarikhMula
                        ? moment(item.tarikhMula).format('DD/MM/YYYY')
                        : '-'}
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-offset-1 outline-adminWhite'>
                      {item.tarikhAkhir
                        ? moment(item.tarikhAkhir).format('DD/MM/YYYY')
                        : '-'}
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
