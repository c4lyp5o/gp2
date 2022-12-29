import { useEffect, useState } from 'react';
import { useGlobalAdminAppContext } from '../../context/adminAppContext';

import { Loading } from '../Screens';

import Facebook from '../../assets/socmed/facebook.svg';
import Instagram from '../../assets/socmed/instagram.png';
import Twitter from '../../assets/socmed/twitter.svg';
import Tiktok from '../../assets/socmed/tiktok.svg';
import Youtube from '../../assets/socmed/youtube.svg';
import Lain from '../../assets/socmed/lain-lain.svg';

const socmed = [
  { name: 'Facebook', img: Facebook },
  { name: 'Instagram', img: Instagram },
  { name: 'Twitter', img: Twitter },
  { name: 'Tiktok', img: Tiktok },
  { name: 'Youtube', img: Youtube },
  { name: 'Lain', img: Lain },
];

function Followers() {
  const { readDataForKp } = useGlobalAdminAppContext();
  const [data, setData] = useState(null);

  useEffect(() => {
    readDataForKp('followers')
      .then((res) => {
        console.log(res);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (!data) return <Loading />;

  return (
    <>
      <div className='flex flex-col items-center'>
        <h1 className='text-2xl font-bold mt-10 mb-10'>
          senarai bilangan <i>followers</i> mengikut jenis media sosial
        </h1>
        <div className='flex flex-col items-center'>
          {data.map((item, index) => {
            return (
              <p>
                {item.namaPlatform}: {item.jumlahFollowerBulanIni},{' '}
                {item.jumlahFollowerBulanTerdahulu}
              </p>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Followers;
