import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Ring } from 'react-awesome-spinners';
import axios from 'axios';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function DataKlinik({ data }) {
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
        text: `Kedatangan Pesakit ke ${data.kp}`,
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
    <div className='justify-center items-center mt-10'>
      <div className='max-w rounded overflow-hidden shadow-lg'>
        <div className='px-6 py-4'>
          <div className='font-bold text-xl mb-2 underline'>{data.kp}</div>
          <Line data={chartData} options={options} />
          <p className='underline'>Statistik</p>
          <p className='text-xs'>
            Jumlah Pesakit sehingga {new Date().toLocaleDateString()}:{' '}
            {data.jumlahPt}
          </p>
          <p className='text-xs'>Jumlah Pesakit Hari Ini: {data.ptHariIni}</p>
          <p className='text-xs'>
            Jumlah Pesakit Minggu Ini: {data.ptMingguIni}
          </p>
          <p className='text-xs'>Jumlah Pesakit Bulan Ini: {data.ptBulanIni}</p>
          <p className='text-xs'>Jumlah Pesakit Baru: {data.ptBaru}</p>
          <p className='text-xs'>Jumlah Pesakit Ulangan: {data.ptUlangan}</p>
        </div>
      </div>
    </div>
  );
}

function JanaReten({ data }) {
  const { toast, dateToday } = useGlobalAdminAppContext();

  const saveFile = (blob, reten) => {
    const link = document.createElement('a');
    link.download = `${reten}-${data.kp}.xlsx`;
    link.href = URL.createObjectURL(new Blob([blob]));
    link.addEventListener('click', () => {
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
      }, 100);
    });
    link.click();
  };

  const handleJana = async (reten) => {
    await toast
      .promise(
        axios.get(
          `/api/v1/generate/download?jenisReten=${reten}&tarikhMula=2022-01-01&tarikhAkhir=${dateToday}&bulan=${dateToday}&formatFile=xlsx`,
          {
            headers: {
              klinikid: `${data.kp}`,
              klinikdaerah: `${data.daerah}`,
              kliniknegeri: `${data.negeri}`,
            },
            responseType: 'blob',
          }
        ),
        {
          pending: 'Menghasilkan reten...',
          success: 'Reten berjaya dihasilkan',
          error: 'Reten tidak berjaya dihasilkan',
        },
        { autoClose: 2000 }
      )
      .then((blob) => {
        saveFile(blob.data, reten);
      });
  };

  return (
    <div className='justify-center items-center mt-10'>
      <div className='max-w rounded overflow-hidden shadow-lg'>
        <div className='px-6 py-4'>
          <div className='font-bold text-xl mb-2 underline'>Pusat Kawalan</div>
          <div>Jana Reten</div>
          <button
            value='PG101'
            onClick={(e) => {
              handleJana(e.target.value);
            }}
            className='bg-admin3 text-kaunterWhite text-xs font-semibold px-2.5 py-0.5 rounded mr-3'
          >
            PG101
          </button>
          <button
            value='PG211'
            onClick={(e) => {
              handleJana(e.target.value);
            }}
            className='bg-admin3 text-kaunterWhite text-xs font-semibold px-2.5 py-0.5 rounded'
          >
            PG211
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Klinik() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const { toast, getKlinikData } = useGlobalAdminAppContext();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getKlinikData(id)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }, []);

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
      <div className='h-full w-full p-5 overflow-y-auto'>
        <div className='grid grid-cols-2 gap-2'>
          <DataKlinik data={data} />
          <JanaReten data={data} />
        </div>
      </div>
    </>
  );
}
