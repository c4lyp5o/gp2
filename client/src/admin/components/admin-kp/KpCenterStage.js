import { useEffect, useState } from 'react';
import moment from 'moment';
import { useGlobalAdminAppContext } from '../../context/adminAppContext';

import { Loading } from '../Screens';

export default function KpCenterStage(props) {
  const { toast, readDataForKp } = useGlobalAdminAppContext();
  const today = new Date().toLocaleDateString();

  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState([]);

  useEffect(() => {
    const getProgramForKp = async () => {
      const { data } = await readDataForKp('program');
      console.log(data);
      setProgram(data);
    };
    getProgramForKp()
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        // navigate('/pentadbir');
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='justify-center items-center text-xl font-semibold mt-10 space-y-5'>
      <h1>
        Selamat datang, {props.loginInfo.officername} dari {props.loginInfo.kp}
      </h1>
      <p>Hari ini {today}</p>
      <div className='grid grid-cols gap-2'>
        {program.length > 0 ? (
          <>
            <div className='bg-admin3 border-2yu p-2 rounded-lg'>
              <h1 className='bg-admin4 text-2xl font-mono p-2'>
                Program Yang Belum Ditetapkan Tarikh
              </h1>
              <div className='grid grid-cols-5 gap-2 mt-2'>
                {program.map((item) => {
                  if (!item.tarikhStart) {
                    return (
                      <div className='bg-admin4 border-admin2 border-l-admin2 p-2 rounded-lg'>
                        <h1 className='text-xl font-semibold'>{item.nama}</h1>
                        <p>Tempat: {item.tempat}</p>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </>
        ) : null}
        {program.length > 0 ? (
          <>
            <div className='bg-admin3 border-2yu p-2 rounded-lg'>
              <h1 className='bg-admin4 text-2xl font-mono p-2'>
                Program Yang Sedang Berlangsung
              </h1>
              <div className='grid grid-cols-5 gap-2 mt-2'>
                {program.map((item) => {
                  if (
                    moment(today).isBetween(
                      moment(item.tarikhStart).format('DD/MM/YYYY'),
                      moment(item.tarikhEnd).format('DD/MM/YYYY')
                    )
                  ) {
                    return (
                      <div className='bg-admin4 border-admin2 border-l-admin2 p-2 rounded-lg'>
                        <h1 className='text-xl font-semibold'>{item.nama}</h1>
                        <p>Tempat: {item.tempat}</p>
                        <p>Tarikh Mula: {item.tarikhStart}</p>
                        <p>Tarikh Tamat: {item.tarikhEnd}</p>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </>
        ) : null}
        {/* {program.length > 0 ? (
          <>
            <div className='bg-admin3 border-2yu p-2 rounded-lg'>
              <h1 className='text-2xl font-semibold'>
                Program Yang Telah Tamat
              </h1>
              <div className='grid grid-cols-5 gap-2 mt-2'>
                {program.map((item) => {
                  if (moment(today).isAfter(item.tarikhEnd)) {
                    return (
                      <div className='bg-admin4 border-admin2 border-l-admin2 p-2 rounded-lg'>
                        <h1 className='font-semibold'>{item.nama}</h1>
                        <p>Tempat: {item.tempat}</p>
                        <p>Tarikh Mula: {item.tarikhStart}</p>
                        <p>Tarikh Tamat: {item.tarikhEnd}</p>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </>
        ) : null} */}
      </div>
    </div>
  );
}
