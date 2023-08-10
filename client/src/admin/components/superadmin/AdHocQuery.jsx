import React, { useEffect, useState, useRef } from 'react';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import 'chart.js/auto';
// import { Chart } from 'react-chartjs-2';
import moment from 'moment';

import { useGlobalAdminAppContext } from '../../context/adminAppContext';

import { Loading } from '../Screens';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// function MainChart({ data, axis, accountType }) {
//   const currentTitle = (data, accountType) => {
//     if (accountType !== 'daerahSuperadmin') {
//       return `Kedatangan Pesakit di Negeri ${data.namaNegeri.toUpperCase()}`;
//     }
//     if (accountType === 'daerahSuperadmin') {
//       return `Kedatangan Pesakit di Daerah ${data.daerah[0].namaDaerah.toUpperCase()}`;
//     }
//   };

//   const options = {
//     responsive: true,
//     scales: {
//       y: {
//         min: 0,
//         suggestedMax: 50,
//       },
//     },
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: true,
//         text: 'test',
//       },
//     },
//   };

//   const labels = data.map((i) => {
//     return i._id;
//   });

//   const constructedData = data.map((key, index) =>
//     axis
//       .filter((axisY) => {
//         return axisY.checked === true;
//       })
//       .map((axisItem, axisIndex) => key[axisItem.value])
//   );

//   const chartData = {
//     labels,
//     datasets: [
//       {
//         label: `Jumlah Pesakit`,
//         data: constructedData,
//         borderColor: 'rgb(255, 99, 132)',
//         backgroundColor: 'rgba(255, 99, 132, 0.5)',
//       },
//     ],
//   };

//   return (
//     <div className='chart-container'>
//       <Chart type='bar' data={chartData} />
//     </div>
//   );
// }

const style = {
  width: 400,
};

const AdHocQuery = () => {
  const { toast, adhocQuery, masterDatePicker } = useGlobalAdminAppContext();

  const defaultYAxis = [
    {
      text: 'Jumlah Semua Pesakit',
      value: 'jumlahPesakit',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Pesakit Baru',
      value: 'jumlahPesakitBaru',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Pesakit Ulangan',
      value: 'jumlahPesakitUlangan',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Lelaki',
      value: 'jumlahLelaki',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Perempuan',
      value: 'jumlahPerempuan',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Melayu',
      value: 'jumlahMelayu',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Cina',
      value: 'jumlahCina',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah India',
      value: 'jumlahIndia',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Bajau',
      value: 'jumlahBajau',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Dusun',
      value: 'jumlahDusun',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Kadazan',
      value: 'jumlahKadazan',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah BMSL',
      value: 'jumlahBMSL',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Melanau',
      value: 'jumlahMelanau',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Kedayan',
      value: 'jumlahKedayan',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Iban',
      value: 'jumlahIban',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Bidayuh',
      value: 'jumlahBidayuh',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Penan',
      value: 'jumlahPenan',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah BMSwL',
      value: 'jumlahBMSwL',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah OA',
      value: 'jumlahOA',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Lain-lain',
      value: 'jumlahLainlain',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah BW',
      value: 'jumlahBukanWarganegara',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Ibu Mengandung',
      value: 'jumlahIbuMengandung',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Bersekolah',
      value: 'jumlahBersekolah',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah OKU',
      value: 'jumlahOKU',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Pesara Kerajaan',
      value: 'jumlahPesaraKerajaan',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Pesara ATM',
      value: 'jumlahPesaraATM',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Rujukan Dalaman',
      value: 'jumlahRujukanDalaman',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Rujukan KP',
      value: 'jumlahRujukanKP',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Rujukan KK',
      value: 'jumlahRujukanKK',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Rujukan Hospital',
      value: 'jumlahRujukanHospital',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Rujukan Swasta',
      value: 'jumlahRujukanSwasta',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Rujukan Lain-lain',
      value: 'jumlahRujukanLainlain',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah d',
      value: 'jumlahd',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah f',
      value: 'jumlahf',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah x',
      value: 'jumlahx',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah dfx',
      value: 'jumlahdfx',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah D',
      value: 'jumlahD',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah M',
      value: 'jumlahM',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah F',
      value: 'jumlahF',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah X',
      value: 'jumlahX',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah DMFX',
      value: 'jumlahDMFX',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah MBK',
      value: 'jumlahMBK',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Status Bebas Karies',
      value: 'statusBebasKaries',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah TPR',
      value: 'TPR',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Skor GIS = 0',
      value: 'skorGISZero',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Skor GIS bukan 0',
      value: 'skorGISMoreThanZero',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Skor BPE = 0',
      value: 'skorBPEZero',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Skor BPE bukan 0',
      value: 'skorBPEMoreThanZero',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah TSL',
      value: 'adaTSL',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Perlu Sapuan Fluorida',
      value: 'perluSapuanFluorida',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Perlu Jumlah Pesakit Prr Jenis1',
      value: 'perluJumlahPesakitPrrJenis1',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Perlu Jumlah Gigi Prr Jenis1',
      value: 'perluJumlahGigiPrrJenis1',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Pesakit Perlu FS',
      value: 'perluJumlahPesakitFS',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Gigi Perlu FS',
      value: 'perluJumlahGigiFS',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Perlu Penskaleran',
      value: 'perluPenskaleran',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Perlu Endo Anterior',
      value: 'perluEndoAnterior',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Perlu Endo Premolar',
      value: 'perluEndoPremolar',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Perlu Endo Molar',
      value: 'perluEndoMolar',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Perlu Dentur Penuh',
      value: 'jumlahPerluDenturPenuh',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Perlu Dentur Separa',
      value: 'jumlahPerluDenturSepara',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Pesakit Disaring OC',
      value: 'pesakitDisaringOC',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Pesakit Dibuat Sapuan Florida',
      value: 'sapuanFluorida',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Pesakit Prr Jenis 1',
      value: 'jumlahPesakitPrrJenis1',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Gigi Prr Jenis 1',
      value: 'jumlahGigiPrrJenis1',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Pesakit Di Buat FS',
      value: 'jumlahPesakitDiBuatFs',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Gigi Di Buat FS',
      value: 'jumlahGigiDibuatFs',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Tampalan Anterior GD Baru',
      value: 'tampalanAntGdBaru',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Tampalan Anterior GD Semula',
      value: 'tampalanAntGdSemula',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Tampalan Anterior GK Baru',
      value: 'tampalanAntGkBaru',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Tampalan Anterior GK Semula',
      value: 'tampalanAntGkSemula',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Tampalan Posterior GD Baru',
      value: 'tampalanPostGdBaru',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Tampalan Posterior GD Semula',
      value: 'tampalanPostGdSemula',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Tampalan Posterior GK Baru',
      value: 'tampalanPostGkBaru',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Tampalan Posterior GK Semula',
      value: 'tampalanPostGkSemula',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Tampalan Posterior Amalgam GD Baru',
      value: 'tampalanPostAmgGdBaru',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Tampalan Posterior Amalgam GD Semula',
      value: 'tampalanPostAmgGdSemula',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Tampalan Posterior Amalgam GK Baru',
      value: 'tampalanPostAmgGkBaru',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Tampalan Posterior Amalgam GK Semula',
      value: 'tampalanPostAmgGkSemula',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Inlay/Onlay Baru',
      value: 'inlayOnlayBaru',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Inlay/Onlay Semula',
      value: 'inlayOnlaySemula',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Tampalan Sementara',
      value: 'tampalanSementara',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Cabutan GD',
      value: 'cabutanGd',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Cabutan GK',
      value: 'cabutanGk',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Komplikasi Selepas Cabutan',
      value: 'komplikasiSelepasCabutan',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Penskaleran',
      value: 'penskaleran',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Rawatan Perio Lain',
      value: 'rawatanPerioLain',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Rawatan Endo Anterior',
      value: 'rawatanEndoAnterior',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Rawatan Endo Premolar',
      value: 'rawatanEndoPremolar',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Rawatan Endo Molar',
      value: 'rawatanEndoMolar',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Rawatan Ortho',
      value: 'rawatanOrtho',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Kes Perubatan',
      value: 'kesPerubatan',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Abses',
      value: 'abses',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Kecederaan Tulang Muka',
      value: 'kecederaanTulangMuka',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Kecederaan Gigi',
      value: 'kecederaanGigi',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Kecederaan Tisu Lembut',
      value: 'kecederaanTisuLembut',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Cabutan Surgikal',
      value: 'cabutanSurgical',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Pembedahan Kecil Mulut',
      value: 'pembedahanKecilMulut',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Crown/Bridge Baru',
      value: 'crownBridgeBaru',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Crown/Bridge Semula',
      value: 'crownBridgeSemula',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Post/Core Baru',
      value: 'postCoreBaru',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Post/Core Semula',
      value: 'postCoreSemula',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Dentur Penuh Baru',
      value: 'prosthodontikPenuhDenturBaru',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Dentur Penuh Semula',
      value: 'prosthodontikPenuhDenturSemula',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Pesakit Buat Dentur Penuh',
      value: 'jumlahPesakitBuatDenturPenuh',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Dentur Separa Baru',
      value: 'prosthodontikSeparaDenturBaru',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Dentur Separa Semula',
      value: 'prosthodontikSeparaDenturSemula',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Pesakit Buat Dentur Separa',
      value: 'jumlahPesakitBuatDenturSepara',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Immediate Denture',
      value: 'immediateDenture',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Pembaikan Denture',
      value: 'pembaikanDenture',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah Kes Selesai',
      value: 'kesSelesai',
      axis: 'y',
      checked: false,
    },
    {
      text: 'Jumlah X-Ray Diambil',
      value: 'xrayDiambil',
      axis: 'y',
      checked: false,
    },
  ];
  const defaultXAxis = [
    {
      text: 'Masa',
      axis: 'x',
      checked: false,
    },
    {
      text: 'Umur',
      axis: 'x',
      checked: false,
    },
    {
      text: 'Kumpulan Etnik',
      axis: 'x',
      checked: false,
    },
    {
      text: 'Pegawai',
      axis: 'x',
      checked: false,
    },
    {
      text: 'Klinik',
      axis: 'x',
      checked: false,
    },
    {
      text: 'Daerah',
      axis: 'x',
      checked: false,
    },
    {
      text: 'Negeri',
      axis: 'x',
      checked: false,
    },
  ];

  const [Yaxis, setYaxis] = useState(
    defaultYAxis.map((i, index) => ({ id: index, ...i }))
  );
  const [Xaxis, setXaxis] = useState(
    defaultXAxis.map((i, index) => ({ id: index, ...i }))
  );

  const TarikhAwal = () => {
    return masterDatePicker({
      selected: startDatePicker,
      selectsStart: true,
      startDate: startDatePicker,
      endDate: endDatePicker,
      onChange: (startDate) => {
        startDateRef.current = moment(startDate).format('YYYY-MM-DD');
        setStartDatePicker(startDate);
      },
      filterDate: (date) => {
        return moment() > date;
      },
      required: true,
      className:
        'appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent',
    });
  };

  const TarikhAkhir = () => {
    return masterDatePicker({
      selected: endDatePicker,
      selectsEnd: true,
      startDate: startDatePicker,
      endDate: endDatePicker,
      minDate: startDatePicker,
      onChange: (endDate) => {
        endDateRef.current = moment(endDate).format('YYYY-MM-DD');
        setEndDatePicker(endDate);
      },
      filterDate: (date) => {
        return moment() > date;
      },
      required: true,
      className:
        'appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent',
    });
  };

  const startDateRef = useRef('');
  const endDateRef = useRef('');

  const [startDatePicker, setStartDatePicker] = useState(null);
  const [endDatePicker, setEndDatePicker] = useState(null);

  const [loading, setLoading] = useState(false);

  const [bigData, setBigData] = useState([]);

  // checkboxes
  const [checkboxSelection, setCheckboxSelection] = useState({
    y: [...Yaxis],
    x: [...Xaxis],
  });

  const handleCheckboxChangeY = (e) => {
    const { name, value } = e.target;
    const newSelection = { ...checkboxSelection };
    newSelection['y'].forEach((i) => {
      if (i.text === name) {
        i.text = value;
        i.checked = !i.checked;
      }
    });
    console.log(newSelection);
    setCheckboxSelection(newSelection);
    setYaxis(newSelection.y);
  };

  const handleCheckboxChangeX = (e) => {
    const { name, value } = e.target;
    const newSelection = { ...checkboxSelection };
    newSelection['x'].forEach((i) => {
      if (i.text === name) {
        i.text = value;
        i.checked = !i.checked;
      } else {
        i.checked = false;
      }
    });
    console.log(newSelection);
    setCheckboxSelection(newSelection);
    setXaxis(newSelection.x);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // construst payload
    const payload = {
      tarikhMula: startDateRef.current,
      tarikhAkhir: endDateRef.current,
      checkboxSelection,
    };
    // start
    try {
      setLoading(true);
      console.log(payload);
      const { data: query } = await adhocQuery(payload);
      console.log(query);
      setBigData(query);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const renderCheckbox = (selection) => {
    return (
      <div>
        {selection.map((item) => (
          <div key={item.id}>
            <input
              type='checkbox'
              className='mr-2'
              name={item.text}
              value={item.text}
              checked={item.checked}
              onChange={(e) =>
                item.axis === 'y'
                  ? handleCheckboxChangeY(e)
                  : handleCheckboxChangeX(e)
              }
            />
            <label>{item.text}</label>
          </div>
        ))}
      </div>
    );
  };

  const renderTableHeader = () => {
    return (
      <>
        {checkboxSelection.x
          .filter((key) => {
            return key.checked === true;
          })
          .map((key, index) => (
            <th
              className='px-1 py-1 outline outline-1 outline-offset-1'
              key={index}
            >
              {key.text}
            </th>
          ))}
        {checkboxSelection.y
          .filter((key) => {
            return key.checked === true;
          })
          .map((key, index) => (
            <th
              className='px-1 py-1 outline outline-1 outline-offset-1'
              key={index}
            >
              {key.text}
            </th>
          ))}
      </>
    );
  };

  const renderTableData = (data) => {
    return (
      <>
        {data.map((key, index) => (
          <tr key={index}>
            <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
              {key._id}
            </td>
            {checkboxSelection.y
              .filter((axis) => {
                return axis.checked === true;
              })
              .map((axis, index) => (
                <td
                  className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'
                  key={index}
                >
                  {key[axis.value]}
                </td>
              ))}
          </tr>
        ))}
      </>
    );
  };

  const resetter = () => {
    setBigData([]);
    setYaxis(defaultYAxis);
    setXaxis(defaultXAxis);
    setCheckboxSelection({ y: [...Yaxis], x: [...Xaxis] });
    setStartDatePicker(null);
    setEndDatePicker(null);
    startDateRef.current = '';
    endDateRef.current = '';
  };

  useEffect(() => {
    return () => resetter();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-2 gap-2 mb-3'>
          <div className='px-3 py-1'>
            <label
              htmlFor='tarikhMula'
              className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
            >
              Daripada:
            </label>
            <TarikhAwal />
          </div>
          <div className='px-3 py-1'>
            <label
              htmlFor='tarikhAkhir'
              className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
            >
              Sehingga:
            </label>
            <TarikhAkhir />
          </div>
        </div>
        <div className='flex flex-col mb-3'>
          <div className='grid grid-cols-2 mb-3'>
            <div className='grid grid-cols-2'>
              <div style={style}>
                <p>Pembolehubah Y</p>
                {renderCheckbox(Yaxis)}
              </div>
            </div>
            <div className='grid grid-cols-2'>
              <div style={style}>
                <p>Pembolehubah X</p>
                {renderCheckbox(Xaxis)}
              </div>
            </div>
          </div>
          {/* <div>
            {bigData.length !== 0 ? (
              <MainChart data={bigData} axis={checkboxSelection.y} />
            ) : null}
          </div> */}
          <div className='grid grid-cols-2 mb-3'>
            <button
              type='button'
              className='capitalize bg-user9 text-userWhite rounded-md shadow-xl p-2 mr-3 hover:bg-kaunter2 transition-all'
              onClick={resetter}
            >
              Reset
            </button>
            <button
              type='submit'
              className='capitalize bg-user9 text-userWhite rounded-md shadow-xl p-2 mr-3 hover:bg-kaunter2 transition-all'
            >
              Kira
            </button>
          </div>
          <div className='m-auto overflow-x-auto text-sm rounded-md h-min max-w-max'>
            {bigData.length > 0 ? (
              <table className='table-auto'>
                <thead className='text-adminWhite bg-admin3'>
                  {renderTableHeader()}
                </thead>
                <tbody className='bg-admin4'>{renderTableData(bigData)}</tbody>
              </table>
            ) : (
              <span>Waiting for data...</span>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

export default AdHocQuery;
