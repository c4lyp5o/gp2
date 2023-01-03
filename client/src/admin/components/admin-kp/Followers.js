import Facebook from '../../assets/socmed/facebook.svg';
import Instagram from '../../assets/socmed/instagram.png';
import Twitter from '../../assets/socmed/twitter.svg';
import Tiktok from '../../assets/socmed/tiktok.svg';
import Youtube from '../../assets/socmed/youtube.svg';
import Lain from '../../assets/socmed/lain-lain.svg';

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
            <thead className='text-adminWhite bg-admin3'>
              <tr>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Bil.
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Jenis Platform
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Follower Bulan Terdahulu
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Follower Bulan Ini
                </th>
              </tr>
            </thead>
            <tbody className='bg-admin4'>
              {props.data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className='px-2 py-1 outline outline-1 outline-offset-1'>
                      {index + 1}
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-offset-1 grid grid-flow-col gap-2'>
                      {item.namaPlatform}{' '}
                      <img
                        width={20}
                        src={socmed
                          .filter((socmed) => socmed.name === item.namaPlatform)
                          .map((socmed) => socmed.img)}
                        alt={item.namaPlatform}
                      ></img>
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-offset-1'>
                      {item.jumlahFollowerBulanTerdahulu}
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-offset-1'>
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
