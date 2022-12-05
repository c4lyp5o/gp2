/* eslint-disable no-lone-blocks */
import React, { useEffect, useState, useCallback } from 'react';
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
import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';

import update from 'immutability-helper';

import { useGlobalAdminAppContext } from '../../context/adminAppContext';

import Card from './Card';
import { Loading } from '../Screens';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
        text: 'test',
      },
    },
  };

  const labels = data.map((i) => {
    return i._id;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: `Jumlah Pesakit`,
        data: data.map((i) => i.jumlah),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <div className='chart-container'>
      <Chart type='bar' data={chartData} />
    </div>
  );
}

const style = {
  width: 400,
};
const Container = () => {
  const [Yaxis, setYaxis] = useState([
    {
      id: 1,
      text: 'Jumlah Pesakit Baru',
      axis: 'y',
    },
    {
      id: 2,
      text: 'Jumlah Pesakit Ulangan',
      axis: 'y',
    },
    {
      id: 3,
      text: 'Jumlah Semua Pesakit',
      axis: 'y',
    },
    // {
    //   id: 4,
    //   text: 'Jumlah Ibu Mengandung',
    //   axis: 'y',
    // },
    // {
    //   id: 5,
    //   text: 'Jumlah OKU',
    //   axis: 'y',
    // },
    // {
    //   id: 6,
    //   text: 'Jumlah Bersekolah',
    //   axis: 'y',
    // },
  ]);
  const [Xaxis, setXaxis] = useState([
    {
      id: 7,
      text: 'Masa',
      axis: 'x',
    },
    {
      id: 8,
      text: 'Pegawai',
      axis: 'x',
    },
    {
      id: 9,
      text: 'Klinik',
      axis: 'x',
    },
  ]);
  const { toast, adhocQuery } = useGlobalAdminAppContext();

  const [cards2, setCards2] = useState([{}, {}, {}, {}, {}, {}, {}]);
  const [cards3, setCards3] = useState([{}, {}]);
  const [pilihanYAxis, setPilihanYAxis] = useState([{}]);
  const [pilihanXAxis, setPilihanXAxis] = useState([{}]);
  const [loading, setLoading] = useState(false);
  const [bigData, setBigData] = useState([]);

  useEffect(() => {
    setCards2(Yaxis);
    setCards3(Xaxis);
    setPilihanYAxis([{}]);
    setPilihanXAxis([{}]);
  }, []);

  const moveCardY = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCard = cards2[dragIndex];
      setPilihanYAxis(
        update(pilihanYAxis, {
          $set: [dragCard],
          //   $splice: [
          //     [dragIndex, 1],
          //     [0, 0, dragCard],
          //   ],
        })
      );
      setCards2(
        update(cards2, {
          $splice: [[dragIndex, 1]],
        })
      );
    },
    [cards2, pilihanYAxis]
  );

  const moveCardX = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCard = cards3[dragIndex];
      setPilihanXAxis(
        update(pilihanYAxis, {
          $set: [dragCard],
          //   $splice: [
          //     [dragIndex, 1],
          //     [0, 0, dragCard],
          //   ],
        })
      );
      setCards3(
        update(cards3, {
          $splice: [[dragIndex, 1]],
        })
      );
    },
    [cards3, pilihanXAxis]
  );

  const KiraPilihan = async () => {
    const pilihanY = pilihanYAxis[0].text;
    const pilihanX = pilihanXAxis[0].text;
    if (pilihanY === undefined && pilihanX === undefined) {
      toast.error('Sila pilih pilihan Y dan X');
      return;
    }
    if (pilihanY === undefined) {
      toast.error('Sila pilih pilihan Y');
      return;
    }
    if (pilihanX === undefined) {
      toast.error('Sila pilih pilihan X');
      return;
    }
    setLoading(true);
    setBigData([]);
    const { data: query } = await adhocQuery(pilihanY, pilihanX);
    setBigData(query);
    setLoading(false);
  };

  const renderCard = (card, index) => {
    return (
      <Card
        key={card.id}
        index={index}
        id={card.id}
        text={card.text}
        axis={card.axis}
        moveCardX={moveCardX}
        moveCardY={moveCardY}
      />
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className='hidden' style={style}>
        {Yaxis.map((card, i) => renderCard(card, i))}
      </div>
      <div className='hidden' style={style}>
        {Xaxis.map((card, i) => renderCard(card, i))}
      </div>
      <div className='grid grid-row-2'>
        <div className='text-left'>Pembolehubah Y</div>{' '}
        <div style={style}>{cards2.map((card, i) => renderCard(card, i))}</div>
        <div className='text-left'>Pilihan Y Axis</div>{' '}
        <div style={style}>
          {pilihanYAxis.map((card, i) => renderCard(card, i))}
        </div>
        <div className='text-left'>Pembolehubah X</div>{' '}
        <div style={style}>{cards3.map((card, i) => renderCard(card, i))}</div>
        <div className='text-left'>Pilihan X Axis</div>{' '}
        <div style={style}>
          {pilihanXAxis.map((card, i) => renderCard(card, i))}
        </div>
      </div>
      <div className='flex'>
        <button
          onClick={() => {
            setCards2([...Yaxis]);
            setCards3([...Xaxis]);
            setPilihanYAxis([{}]);
            setPilihanXAxis([{}]);
            setBigData([]);
          }}
          className='capitalize bg-user9 text-userWhite rounded-md shadow-xl p-2 mr-3 hover:bg-kaunter2 transition-all'
        >
          Reset
        </button>
        <button
          onClick={KiraPilihan}
          className='capitalize bg-user9 text-userWhite rounded-md shadow-xl p-2 mr-3 hover:bg-kaunter2 transition-all'
        >
          Kira
        </button>
      </div>
      <div>{bigData.length !== 0 ? <MainChart data={bigData} /> : null}</div>
    </>
  );
};

export default Container;
