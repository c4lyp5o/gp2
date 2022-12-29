import { useState, useEffect } from 'react';
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
  const { toast, getAllNegeriAndDaerah, navigate } = useGlobalAdminAppContext();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllNegeriAndDaerah();
      setData(res.data);
    };
    fetchData().catch((err) => {
      toast.error(err.response.data.message);
      navigate('/pentadbir');
    });
  }, []);

  if (!data) {
    return <Loading />;
  }

  return (
    <>
      {data.map((item) => {
        return (
          <div className='flex mb-4 m-10 rounded mx-auto justify-center'>
            <div className='w-72 rounded overflow-hidden shadow-xl m-2 justify-center flex flex-col'>
              <img
                className='w-1/2 mx-auto'
                alt={item.namaNegeri}
                src={FlagsDictionary[item.namaNegeri]}
              />
              {item.daerah.map((item2, index) => {
                return (
                  <div className='px-6 py-4 h-full'>
                    <div key={index} className='mb-2 underline'>
                      {item2.namaDaerah}
                    </div>
                    {item2.klinik.map((item3, index) => {
                      return (
                        <a
                          key={index}
                          href={`./landing/klinik?id=${item3.kodFasiliti}`}
                        >
                          <p className='text-user1 hover:bg-admin4 hover:rounded-md hover:text-adminWhite'>
                            {item3.namaKlinik}
                          </p>
                        </a>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      {data.map((item) => {
        return (
          <div className='flex mb-4 m-10 rounded mx-auto justify-center'>
            <div className='w-1/2 rounded overflow-hidden shadow-lg relative flex flex-col'>
              {data.length > 0 && (
                <MainChart
                  data={item}
                  accountType={props.loginInfo.accountType}
                />
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
