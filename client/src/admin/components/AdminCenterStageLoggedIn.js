import { useState, useEffect } from 'react';
import { Ring } from 'react-awesome-spinners';
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

import { useGlobalAdminAppContext } from '../context/adminAppContext';

import perlis from '../assets/flags/perlis.png';
import kedah from '../assets/flags/kedah.png';
import pulauPinang from '../assets/flags/penang.png';
import perak from '../assets/flags/perak.png';
import selangor from '../assets/flags/selangor.png';
import negeriSembilan from '../assets/flags/negeri_sembilan.png';
import melaka from '../assets/flags/malacca.png';
import johor from '../assets/flags/johor.png';
import pahang from '../assets/flags/pahang.png';
import terengganu from '../assets/flags/terengganu.png';
import kelantan from '../assets/flags/kelantan.png';
import sabah from '../assets/flags/sabah.png';
import sarawak from '../assets/flags/sarawak.png';
import labuan from '../assets/flags/labuan.png';
import putrajaya from '../assets/flags/putrajaya.png';
import kualaLumpur from '../assets/flags/kuala_lumpur.png';

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
  perlis: perlis,
  kedah: kedah,
  'pulau pinang': pulauPinang,
  perak: perak,
  selangor: selangor,
  'negeri sembilan': negeriSembilan,
  melaka: melaka,
  johor: johor,
  pahang: pahang,
  terengganu: terengganu,
  kelantan: kelantan,
  sabah: sabah,
  sarawak: sarawak,
  labuan: labuan,
  putrajaya: putrajaya,
  'kuala lumpur': kualaLumpur,
};

export default function AdminCenterStageLoggedIn() {
  const { toast, getAllNegeriAndDaerah } = useGlobalAdminAppContext();
  const [data, setData] = useState([]);
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllNegeriAndDaerah()
      .then((res) => {
        console.log(res.data);
        setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }, []);

  // const options = {
  //   responsive: true,
  //   scales: {
  //     y: {
  //       min: 0,
  //       suggestedMax: 50,
  //     },
  //   },
  //   plugins: {
  //     legend: {
  //       position: 'top',
  //     },
  //     title: {
  //       display: true,
  //       text: `Kedatangan Pesakit ke ${data.kp}`,
  //     },
  //   },
  // };
  // const labels = data.kedatanganPt.map((item) => {
  //   return item.tarikh;
  // });
  // const chartData = {
  //   labels,
  //   datasets: [
  //     {
  //       label: `Jumlah Pesakit`,
  //       data: data.kedatanganPt.map((i) => i.kedatangan),
  //       borderColor: 'rgb(255, 99, 132)',
  //       backgroundColor: 'rgba(255, 99, 132, 0.5)',
  //     },
  //   ],
  // };

  if (loading) {
    return (
      <div className='flex justify-center text-center h-full w-full'>
        <div className='m-auto p-4 bg-admin4 rounded-md grid'>
          <div className='flex justify-center mb-2'>
            <Ring color='#c44058' />
          </div>
          <span className='bg-admin3 text-kaunterWhite text-xs font-semibold px-2.5 py-0.5 rounded'>
            Memuat...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      {data.map((item) => {
        return (
          <div className='lg:flex mb-4 m-10 rounded mx-auto'>
            <div className='w-full lg:w-1/3 rounded overflow-hidden shadow-lg m-10 relative flex flex-col'>
              <img
                className='w-full'
                alt={item.namaNegeri}
                src={FlagsDictionary[item.namaNegeri]}
              />
              {item.daerah.map((item2) => {
                return (
                  <div className='px-6 py-4 h-full'>
                    <div className='mb-2 underline'>{item2.namaDaerah}</div>
                    {item2.klinik.map((item3) => {
                      return (
                        <a href={`./landing/klinik?id=${item3.kodFasiliti}`}>
                          <p className='text-user4'>{item3.namaKlinik}</p>
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
      <div className='lg:flex mb-4 m-10 rounded mx-auto'>
        <div className='w-full lg:w-1/3 rounded overflow-hidden shadow-lg m-10 relative flex flex-col'>
          {/* <Line data={chartData} options={options} /> */}
        </div>
      </div>
    </>
  );
}
