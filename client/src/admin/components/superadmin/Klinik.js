import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Ring } from 'react-awesome-spinners';
import { TbArrowBigLeftLine } from 'react-icons/tb';
import {
  MdSupervisedUserCircle,
  MdChangeCircle,
  MdOutlineSupervisedUserCircle,
  MdRunCircle,
} from 'react-icons/md';
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

import { useGlobalAdminAppContext } from '../../context/adminAppContext';
import moment from 'moment/moment';

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
    return moment(item.tarikh).format('DD/MM/YYYY');
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
    <div className='justify-center items-center col-span-2'>
      <div className='max-w rounded overflow-hidden shadow-lg'>
        <div className='px-6 py-4'>
          <Line data={chartData} options={options} />
          {/* <p className='underline'>Statistik</p>
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
          <p className='text-xs'>Jumlah Pesakit Ulangan: {data.ptUlangan}</p> */}
        </div>
      </div>
    </div>
  );
}

function Statistik({ data }) {
  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='w-full h-full rounded overflow-hidden '>
        <div className='grid grid-cols-2 gap-3 py-4'>
          <p className='col-span-2 text-2xl font-semibold'>Jumlah</p>
          <div className='flex flex-col col-span-2 border-l-8 border-admin4 shadow-lg py-2'>
            <span className='font-mono text-8xl'>{data.jumlahPt}</span>
            <p className='text-xs'>
              Pesakit sehingga {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className='border-l-8 border-admin4 shadow-lg py-2'>
            <div className='flex flex-row items-center'>
              <MdSupervisedUserCircle className='text-admin4 text-5xl m-1' />
              <div>
                <p className='text-xs flex flex-row'>Pesakit Hari Ini</p>
                <span className='font-mono text-5xl flex flex-row'>
                  {data.ptHariIni}
                </span>
              </div>
            </div>
          </div>
          <div className='flex flex-col border-l-8 border-admin4 shadow-lg py-2'>
            <div className='flex flex-row items-center'>
              <MdOutlineSupervisedUserCircle className='text-admin4 text-5xl m-1' />
              <div>
                <p className='text-xs flex flex-row'>Pesakit Minggu Ini</p>
                <span className='font-mono text-5xl flex flex-row'>
                  {data.ptMingguIni}
                </span>
              </div>
            </div>
          </div>
          <div className='flex flex-col border-l-8 border-admin4 shadow-lg py-2'>
            <div className='flex flex-row items-center'>
              <MdOutlineSupervisedUserCircle className='text-admin4 text-5xl m-1' />
              <div>
                <p className='text-xs flex flex-row'>Pesakit Bulan Ini</p>
                <span className='font-mono text-5xl flex flex-row'>
                  {data.ptBulanIni}
                </span>
              </div>
            </div>
          </div>
          <div className='flex flex-col border-l-8 border-admin4 shadow-lg py-2'>
            <div className='flex flex-row items-center'>
              <MdRunCircle className='text-admin4 text-5xl m-1' />
              <div>
                <p className='text-xs flex flex-row'>Pesakit Baru</p>
                <span className='font-mono text-5xl flex flex-row'>
                  {data.ptBaru}
                </span>
              </div>
            </div>
          </div>
          <div className='flex flex-col border-l-8 border-admin4 shadow-lg py-2'>
            <div className='flex flex-row items-center'>
              <MdChangeCircle className='text-admin4 text-5xl m-1' />
              <div>
                <p className='text-xs flex flex-row'>Pesakit Ulangan</p>
                <span className='font-mono text-5xl flex flex-row'>
                  {data.ptUlangan}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JanaReten({ data, id }) {
  const { toast, navigate, adminToken } = useGlobalAdminAppContext();

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
    const dateInISO = new Date().toISOString();
    await toast
      .promise(
        axios.get(
          `/api/v1/generate/download?jenisReten=${reten}&klinik=${id}&tarikhMula=2023-01-01&tarikhAkhir=${
            dateInISO.split('T')[0]
          }&bulan=${dateInISO.split('T')[0]}&formatFile=xlsx`,
          {
            headers: {
              Authorization: adminToken,
            },
          },
          {
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
    <div className='justify-center items-center col-span-3'>
      <div className='max-w rounded overflow-hidden shadow-lg'>
        <div className='px-6 py-4'>
          {/* back */}
          <span
            className='absolute top-5 left-2 text-admin2 text-lg h-96 cursor-pointer'
            onClick={() => {
              navigate(-1);
            }}
          >
            <TbArrowBigLeftLine />
          </span>
          <div className='font-bold text-xl mb-2 underline'>{data.kp}</div>
          {/* <div className='font-bold text-xl mb-2 underline'>Pusat Kawalan</div> */}
          <div>Jana Reten</div>
          <button
            value='PG101A'
            onClick={(e) => {
              handleJana(e.target.value);
            }}
            className='bg-admin3 text-kaunterWhite text-xs font-semibold px-2.5 py-0.5 rounded mr-3'
          >
            PG101A
          </button>
          <button
            value='PG101C'
            onClick={(e) => {
              handleJana(e.target.value);
            }}
            className='bg-admin3 text-kaunterWhite text-xs font-semibold px-2.5 py-0.5 rounded mr-3'
          >
            PG101C
          </button>
          <button
            value='PG211A'
            onClick={(e) => {
              handleJana(e.target.value);
            }}
            className='bg-admin3 text-kaunterWhite text-xs font-semibold px-2.5 py-0.5 rounded mr-3'
          >
            PG211A
          </button>
          <button
            value='PG211C'
            onClick={(e) => {
              handleJana(e.target.value);
            }}
            className='bg-admin3 text-kaunterWhite text-xs font-semibold px-2.5 py-0.5 rounded mr-3'
          >
            PG211C
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
        <div className='grid grid-cols-3 gap-2'>
          {/* <JanaReten data={data} id={id} /> */}
          <Statistik data={data} />
          <DataKlinik data={data} />
        </div>
      </div>
    </>
  );
}
