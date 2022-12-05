import { useGlobalAdminAppContext } from '../../context/adminAppContext';

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
  const { state } = useGlobalAdminAppContext();
  const { followers } = state;

  return (
    <>
      <div className='flex flex-col items-center'>
        <h1 className='text-3xl font-bold mt-10 mb-10'>
          senarai bilangan <i>followers</i> mengikut jenis media sosial
        </h1>
      </div>
    </>
  );
}
export default Followers;
