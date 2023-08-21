import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import { useGlobalAdminAppContext } from '../../context/adminAppContext';
import { useHqUtils } from '../../context/admin-hooks/useHqUtils';
import { useLogininfo } from '../../context/useLogininfo';

import { Loading } from '../Screens';

import johor from '../../assets/flags/johor.png';
import kedah from '../../assets/flags/kedah.png';
import kelantan from '../../assets/flags/kelantan.png';
import melaka from '../../assets/flags/malacca.png';
import negeriSembilan from '../../assets/flags/negeri_sembilan.png';
import pahang from '../../assets/flags/pahang.png';
import pulauPinang from '../../assets/flags/penang.png';
import perak from '../../assets/flags/perak.png';
import perlis from '../../assets/flags/perlis.png';
import selangor from '../../assets/flags/selangor.png';
import terengganu from '../../assets/flags/terengganu.png';
import sabah from '../../assets/flags/sabah.png';
import sarawak from '../../assets/flags/sarawak.png';
import kualaLumpur from '../../assets/flags/kuala_lumpur.png';
import labuan from '../../assets/flags/labuan.png';
import putrajaya from '../../assets/flags/putrajaya.png';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FlagsDictionary = {
  Johor: johor,
  Kedah: kedah,
  Kelantan: kelantan,
  Melaka: melaka,
  'Negeri Sembilan': negeriSembilan,
  Pahang: pahang,
  'Pulau Pinang': pulauPinang,
  Perak: perak,
  Perlis: perlis,
  Selangor: selangor,
  Terengganu: terengganu,
  Sabah: sabah,
  Sarawak: sarawak,
  'WP Kuala Lumpur': kualaLumpur,
  'WP Labuan': labuan,
  'WP Putrajaya': putrajaya,
};

function MainChart({ data, accountType }) {
  const currentTitle = (data, accountType) => {
    if (accountType !== 'daerahSuperadmin') {
      return `Kedatangan Pesakit di Negeri ${data.namaNegeri.toUpperCase()}`;
    }
    if (accountType === 'daerahSuperadmin') {
      return `Kedatangan Pesakit di Daerah ${data.daerah[0].namaDaerah.toUpperCase()}`;
    }
  };
  const options = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        suggestedMax: 50,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: currentTitle(data, accountType),
      },
    },
  };
  const labels = data.kedatanganPt.map((item) => {
    return item.tarikh;
  });
  const chartData = {
    labels,
    datasets: [
      {
        label: `Jumlah Pesakit`,
        data: data.kedatanganPt.map((i) => i.kedatangan),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <div className='chart-container'>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default function AdminCenterStage(props) {
  const { toast, navigate } = useGlobalAdminAppContext();
  const { getAllNegeriAndDaerah } = useHqUtils();
  const { loginInfo } = useLogininfo();

  const [data, setData] = useState(null);

  const init = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllNegeriAndDaerah();
      setData(res.data);
    };
    if (init.current === false) {
      fetchData().catch((err) => {
        toast.error(err.response.data.message);
      });
      init.current = true;
    }
  }, []);

  if (!data) {
    return <Loading />;
  }

  return (
    <>
      <div className='justify-center items-center text-xl font-semibold mt-10 space-y-5'>
        {loginInfo.accountType === 'daerahSuperadmin' ||
        loginInfo.accountType === 'negeriSuperadmin' ? (
          <h1>
            Selamat datang, pentadbir{' '}
            {loginInfo.accountType === 'daerahSuperadmin' ? (
              <span>daerah {loginInfo.daerah}</span>
            ) : (
              <span>negeri {loginInfo.negeri}</span>
            )}
          </h1>
        ) : (
          <h1 data-cy='big-boss'>Selamat datang, BIG BOSS</h1>
        )}
        <p>Hari ini {moment(new Date()).format('DD/MM/YYYY')}</p>
      </div>
      <div className='grid grid-cols-5 mb-4 m-10 rounded justify-center'>
        {data.map((item) => {
          return (
            <div className='w-72 rounded overflow-hidden shadow-xl m-2 justify-center flex flex-col'>
              <img
                className={`w-1/2 mx-auto ${
                  loginInfo.accountType !== 'daerahSuperadmin'
                    ? 'hover:cursor-pointer hover:outline-admin3 hover:outline-none hover:outline-solid hover:outline-2'
                    : ''
                } mt-3`}
                alt={item.namaNegeri}
                src={FlagsDictionary[item.namaNegeri]}
                onClick={() => {
                  if (loginInfo.accountType !== 'daerahSuperadmin') {
                    navigate(
                      `/pentadbir/landing/negeri?idn=${item.namaNegeri}`
                    );
                  }
                }}
              />
              {item.daerah.map((daerah, index) => {
                return (
                  <div className='px-6 py-4 h-full'>
                    <div
                      key={index}
                      className='mb-2 underline hover:bg-admin3 hover:text-adminWhite hover:rounded-md hover:cursor-pointer hover:outline-admin3 hover:outline-none hover:outline-solid hover:outline-2'
                      onClick={() => {
                        navigate(
                          `/pentadbir/landing/daerah?idn=${item.namaNegeri}&idd=${daerah.namaDaerah}`
                        );
                      }}
                    >
                      {daerah.namaDaerah}
                    </div>
                    {daerah.klinik.map((klinik, index) => {
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            navigate(
                              `/pentadbir/landing/klinik?id=${klinik.kodFasiliti}`
                            );
                          }}
                        >
                          <p className='text-user1 hover:bg-admin4 hover:rounded-md hover:text-adminWhite hover:cursor-pointer'>
                            {klinik.namaKlinik}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {/* {data.map((item) => {
        return (
          <div className='flex mb-4 m-10 rounded mx-auto justify-center'>
            <div className='w-1/2 rounded overflow-hidden shadow-lg relative flex flex-col'>
              {data.length > 0 && (
                <MainChart
                  data={item}
                  accountType={loginInfo.accountType}
                />
              )}
            </div>
          </div>
        );
      })} */}
    </>
  );
}
