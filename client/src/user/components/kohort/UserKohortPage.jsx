import { useState } from 'react';
import { FaGripVertical } from 'react-icons/fa';

import { useGlobalUserAppContext } from '../../context/userAppContext';

export default function UserKohort() {
  const { navigate } = useGlobalUserAppContext();
  const [kotak, setKotak] = useState(false);
  const [kumuranFluorida, setKumuranFluorida] = useState(false);
  const [sapuanFv, setSapuanFv] = useState(false);
  const [pengapanFisur, setPengapanFisur] = useState(false);
  const [dentur, setDentur] = useState(false);
  const [ocs, setOcs] = useState(false);

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 grid-flow-row lg:grid-rows-2 auto-rows-min h-full overflow-y-auto p-3 gap-2'>
      <article className='p-2'>
        <div
          className='flex justify-start items-center p-2 bg-[#D7E2E9] text-userBlack hover:bg-user4 cursor-pointer shadow-md rounded-xl w-full h-full'
          onMouseEnter={() => setKotak(true)}
          onMouseLeave={() => setKotak(false)}
          onClick={() => {
            navigate('/pengguna/landing/kohort/kotak');
          }}
        >
          <FaGripVertical className='text-5xl text-user3' />
          <div className='flex flex-col pl-2 w-full whitespace-pre-wrap'>
            <h1 className='font-semibold text-xl text-left'>
              Program Kesihatan Oral Tanpa Amalan Merokok (KOTAK)
            </h1>
            {kotak && (
              <p className='font-light text-left pr-2'>
                Menjalani program intervensi merokok
                <p className='text-[#e84118] normal-case font-medium'>
                  (Maklumat ini adalah SULIT . DILARANG mendedahkan maklumat
                  tanpa kebenaran . Tindakan TATATERTIB akan dikenakan sekiranya
                  maklumat terdedah)
                </p>
              </p>
            )}
          </div>
        </div>
      </article>
      <article className='p-2'>
        <div
          className='flex justify-start items-center p-2 bg-[#D7E2E9] text-userBlack hover:bg-user4 cursor-pointer shadow-md rounded-xl w-full h-full'
          onMouseEnter={() => setSapuanFv(true)} // TODO nanti tukar nama variable correspond to content name, state dah ada nama setKumuranFluorida
          onMouseLeave={() => setSapuanFv(false)}
          onClick={() => {
            import.meta.env.VITE_ENV === 'UNSTABLE' ||
            import.meta.env.VITE_ENV === 'DEV'
              ? navigate('/pengguna/landing/kohort/fmr')
              : null;
          }}
        >
          <FaGripVertical className='text-5xl text-user3' />
          <div className='flex flex-col pl-2'>
            <h1 className='font-semibold text-xl text-left'>
              Program Kumuran Berfluorida <br />
              <span className='text-user6'>(akan datang)</span>
            </h1>
            {/* {sapuanFv && (
              <p className='font-light text-left'>Sapuan florida empat kali</p>
            )} */}
          </div>
        </div>
      </article>
      <article className='p-2'>
        <div
          className='flex justify-start items-center p-2 bg-[#D7E2E9] text-userBlack hover:bg-user4 cursor-pointer shadow-md rounded-xl w-full h-full'
          onMouseEnter={() => setPengapanFisur(true)}
          onMouseLeave={() => setPengapanFisur(false)}
        >
          <FaGripVertical className='text-5xl text-user3' />
          <div className='flex flex-col pl-2 w-full whitespace-pre-wrap'>
            <h1 className='font-semibold text-xl text-left'>
              Program Sapuan Florida Untuk <i>Toddler</i>
              <br />
              <span className='text-user6'>(akan datang)</span>
            </h1>
            {/* {pengapanFisur && (
              <p className='font-light text-left'>
                Menjalani program intevensi merokok bdjbk kjhdflkj hd hfdglk df
                ljgh llksjfgh ljkhfg jhgljhg slkjfhg lkjhf lgkjshf lgkjshf lkjh
                fjh lkjhf lkjh
              </p>
            )} */}
          </div>
        </div>
      </article>
      <article className='p-2'>
        <div
          className='flex justify-start items-center p-2 bg-[#D7E2E9] text-userBlack hover:bg-user4 cursor-pointer shadow-md rounded-xl w-full h-full'
          onMouseEnter={() => setDentur(true)}
          onMouseLeave={() => setDentur(false)}
        >
          <FaGripVertical className='text-5xl text-user3' />
          <div className='flex flex-col pl-2 w-full whitespace-pre-wrap'>
            <h1 className='font-semibold text-xl text-left'>
              Dentur <br />
              <span className='text-user6'>(akan datang)</span>
            </h1>
            {/* {dentur && (
              <p className='font-light text-left'>
                Menjalani program intevensi merokok bdjbk kjhdflkj hd hfdglk df
                ljgh llksjfgh ljkhfg jhgljhg slkjfhg lkjhf lgkjshf lgkjshf lkjh
                fjh lkjhf lkjh
              </p>
            )} */}
          </div>
        </div>
      </article>
      <article className='p-2'>
        <div
          className='flex justify-start items-center p-2 bg-[#D7E2E9] text-userBlack hover:bg-user4 cursor-pointer shadow-md rounded-xl w-full h-full'
          onMouseEnter={() => setOcs(true)}
          onMouseLeave={() => setOcs(false)}
        >
          <FaGripVertical className='text-5xl text-user3' />
          <div className='flex flex-col pl-2 w-full whitespace-pre-wrap'>
            <h1 className='font-semibold text-xl text-left'>
              Program Kanser Mulut
              <br />
              <span className='text-user6'>(akan datang)</span>
            </h1>
            {/* {ocs && (
              <p className='font-light text-left'>
                Menjalani program intevensi merokok bdjbk kjhdflkj hd hfdglk df
                ljgh llksjfgh ljkhfg jhgljhg slkjfhg lkjhf lgkjshf lgkjshf lkjh
                fjh lkjhf lkjh
              </p>
            )} */}
          </div>
        </div>
      </article>
      <article className='p-2'>
        <div className='flex justify-start items-center p-2 bg-[#D7E2E9] text-userBlack hover:bg-user4 cursor-pointer shadow-md rounded-xl w-full h-full'>
          <FaGripVertical className='text-5xl text-user3' />
          <div className='flex flex-col pl-2 w-full whitespace-pre-wrap'>
            <h1 className='font-semibold text-xl text-left'>
              Program <i>Fissure Sealant</i> <br />
              <span className='text-user6'>(akan datang)</span>
            </h1>
            {/* <p className='font-light text-left'>
              Menjalani program intevensi merokok bdjbk kjhdflkj hd hfdglk df
              ljgh llksjfgh ljkhfg jhgljhg slkjfhg lkjhf lgkjshf lgkjshf lkjh
              fjh lkjhf lkjh
            </p> */}
          </div>
        </div>
      </article>
    </div>
  );
}
