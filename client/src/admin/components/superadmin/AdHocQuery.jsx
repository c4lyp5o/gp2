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

import { FaWindowClose } from 'react-icons/fa';

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

const Dictionary = {
  0: 'Bawah 1 Tahun',
  1: '1 - 4 Tahun',
  5: '5 - 6 Tahun',
  7: '7 - 9 Tahun',
  10: '10 - 12 Tahun',
  13: '13 - 14 Tahun',
  15: '15 - 17 Tahun',
  18: '18 - 19 Tahun',
  20: '20 - 29 Tahun',
  30: '30 - 39 Tahun',
  40: '40 - 49 Tahun',
  50: '50 - 59 Tahun',
  60: '60 Tahun',
  61: '61 - 64 Tahun',
  65: '65 Tahun',
  66: '66 - 69 Tahun',
  70: '70 - 74 Tahun',
  75: '75 Tahun Keatas',
};

const Disclaimer = ({ setDisclaimer }) => {
  return (
    <div className='justify-center text-center'>
      <div className='absolute inset-x-5 inset-y-20 lg:inset-x-1/4 2xl:inset-x-1/3 2xl:inset-y-40 bg-userWhite z-20 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'>
        <FaWindowClose
          onClick={() => setDisclaimer(false)}
          className='absolute mr-1 mt-1 text-xl text-userBlack right-0 hover:cursor-pointer hover:text-user2 transition-all'
        />
        <h5 className='bg-user9 text-userWhite font-semibold text-xl'>
          PERHATIAN !
        </h5>
        <div className='mt-5 p-1 m-auto mb-3'>
          <span className='font-semibold text-2xl'>
            <div>Fungsi</div>
            <span className='text-user9 text-4xl font-bold'>Ad-Hoc Query</span>
            <div>masih dalam pengujian</div>
          </span>
        </div>
        <div>
          <div className='text-lg p-3'>
            Sila berikan maklumbalas tentang kesalahan, ketidakakuran dan
            anomali data ke helpdesk untuk membantu kami memperbaiki fungsi ini.
            Segala kerjasama yang di berikan kami ucapkan dengan jutaan terima
            kasih!
          </div>
        </div>
        <div className='absolute grid bottom-0 right-0 left-0 m-2 mx-10'>
          <span
            className='capitalize bg-user9 text-userBlack rounded-md p-2 mr-3 hover:bg-user5 hover:cursor-pointer transition-all'
            onClick={() => {
              setDisclaimer(false);
            }}
          >
            TERUSKAN
          </span>
        </div>
      </div>
      <div
        onClick={() => setDisclaimer(false)}
        className='absolute inset-0 bg-user1 z-10 opacity-75'
      />
    </div>
  );
};

const AdHocQuery = () => {
  const { toast, adhocQuery, downloadAdhocQuery, masterDatePicker } =
    useGlobalAdminAppContext();

  const defaultYAxis = [
    {
      text: 'Jumlah Semua Pesakit',
      value: 'jumlahPesakit',
    },
    {
      text: 'Jumlah Pesakit Baru',
      value: 'jumlahPesakitBaru',
    },
    {
      text: 'Jumlah Pesakit Ulangan',
      value: 'jumlahPesakitUlangan',
    },
    {
      text: 'Jumlah Lelaki',
      value: 'jumlahLelaki',
    },
    {
      text: 'Jumlah Perempuan',
      value: 'jumlahPerempuan',
    },
    {
      text: 'Jumlah Melayu',
      value: 'jumlahMelayu',
    },
    {
      text: 'Jumlah Cina',
      value: 'jumlahCina',
    },
    {
      text: 'Jumlah India',
      value: 'jumlahIndia',
    },
    {
      text: 'Jumlah Bajau',
      value: 'jumlahBajau',
    },
    {
      text: 'Jumlah Dusun',
      value: 'jumlahDusun',
    },
    {
      text: 'Jumlah Kadazan',
      value: 'jumlahKadazan',
    },
    {
      text: 'Jumlah BMSL',
      value: 'jumlahBMSL',
    },
    {
      text: 'Jumlah Melanau',
      value: 'jumlahMelanau',
    },
    {
      text: 'Jumlah Kedayan',
      value: 'jumlahKedayan',
    },
    {
      text: 'Jumlah Iban',
      value: 'jumlahIban',
    },
    {
      text: 'Jumlah Bidayuh',
      value: 'jumlahBidayuh',
    },
    {
      text: 'Jumlah Penan',
      value: 'jumlahPenan',
    },
    {
      text: 'Jumlah BMSwL',
      value: 'jumlahBMSwL',
    },
    {
      text: 'Jumlah OA',
      value: 'jumlahOA',
    },
    {
      text: 'Jumlah Lain-lain',
      value: 'jumlahLainlain',
    },
    {
      text: 'Jumlah BW',
      value: 'jumlahBukanWarganegara',
    },
    {
      text: 'Jumlah Ibu Mengandung',
      value: 'jumlahIbuMengandung',
    },
    {
      text: 'Jumlah Bersekolah',
      value: 'jumlahBersekolah',
    },
    {
      text: 'Jumlah OKU',
      value: 'jumlahOKU',
    },
    {
      text: 'Jumlah Pesara Kerajaan',
      value: 'jumlahPesaraKerajaan',
    },
    {
      text: 'Jumlah Pesara ATM',
      value: 'jumlahPesaraATM',
    },
    {
      text: 'Jumlah Rujukan Dalaman',
      value: 'jumlahRujukanDalaman',
    },
    {
      text: 'Jumlah Rujukan KP',
      value: 'jumlahRujukanKP',
    },
    {
      text: 'Jumlah Rujukan KK',
      value: 'jumlahRujukanKK',
    },
    {
      text: 'Jumlah Rujukan Hospital',
      value: 'jumlahRujukanHospital',
    },
    {
      text: 'Jumlah Rujukan Swasta',
      value: 'jumlahRujukanSwasta',
    },
    {
      text: 'Jumlah Rujukan Lain-lain',
      value: 'jumlahRujukanLainlain',
    },
    {
      text: 'Jumlah d',
      value: 'jumlahd',
    },
    {
      text: 'Jumlah f',
      value: 'jumlahf',
    },
    {
      text: 'Jumlah x',
      value: 'jumlahx',
    },
    {
      text: 'Jumlah dfx',
      value: 'jumlahdfx',
    },
    {
      text: 'Jumlah D',
      value: 'jumlahD',
    },
    {
      text: 'Jumlah M',
      value: 'jumlahM',
    },
    {
      text: 'Jumlah F',
      value: 'jumlahF',
    },
    {
      text: 'Jumlah X',
      value: 'jumlahX',
    },
    {
      text: 'Jumlah DMFX',
      value: 'jumlahDMFX',
    },
    {
      text: 'Jumlah MBK',
      value: 'jumlahMBK',
    },
    {
      text: 'Jumlah Status Bebas Karies',
      value: 'statusBebasKaries',
    },
    {
      text: 'Jumlah TPR',
      value: 'TPR',
    },
    {
      text: 'Jumlah Skor GIS = 0',
      value: 'skorGISZero',
    },
    {
      text: 'Jumlah Skor GIS bukan 0',
      value: 'skorGISMoreThanZero',
    },
    {
      text: 'Skor BPE = 0',
      value: 'skorBPEZero',
    },
    {
      text: 'Skor BPE bukan 0',
      value: 'skorBPEMoreThanZero',
    },
    {
      text: 'Jumlah TSL',
      value: 'adaTSL',
    },
    {
      text: 'Jumlah Perlu Sapuan Fluorida',
      value: 'perluSapuanFluorida',
    },
    {
      text: 'Jumlah Perlu Jumlah Pesakit Prr Jenis1',
      value: 'perluJumlahPesakitPrrJenis1',
    },
    {
      text: 'Jumlah Perlu Jumlah Gigi Prr Jenis1',
      value: 'perluJumlahGigiPrrJenis1',
    },
    {
      text: 'Jumlah Pesakit Perlu FS',
      value: 'perluJumlahPesakitFS',
    },
    {
      text: 'Jumlah Gigi Perlu FS',
      value: 'perluJumlahGigiFS',
    },
    {
      text: 'Jumlah Perlu Penskaleran',
      value: 'perluPenskaleran',
    },
    {
      text: 'Jumlah Perlu Endo Anterior',
      value: 'perluEndoAnterior',
    },
    {
      text: 'Jumlah Perlu Endo Premolar',
      value: 'perluEndoPremolar',
    },
    {
      text: 'Jumlah Perlu Endo Molar',
      value: 'perluEndoMolar',
    },
    {
      text: 'Jumlah Perlu Dentur Penuh',
      value: 'jumlahPerluDenturPenuh',
    },
    {
      text: 'Jumlah Perlu Dentur Separa',
      value: 'jumlahPerluDenturSepara',
    },
    {
      text: 'Jumlah Pesakit Disaring OC',
      value: 'pesakitDisaringOC',
    },
    {
      text: 'Jumlah Pesakit Dibuat Sapuan Florida',
      value: 'sapuanFluorida',
    },
    {
      text: 'Jumlah Pesakit Prr Jenis 1',
      value: 'jumlahPesakitPrrJenis1',
    },
    {
      text: 'Jumlah Gigi Prr Jenis 1',
      value: 'jumlahGigiPrrJenis1',
    },
    {
      text: 'Jumlah Pesakit Di Buat FS',
      value: 'jumlahPesakitDiBuatFs',
    },
    {
      text: 'Jumlah Gigi Di Buat FS',
      value: 'jumlahGigiDibuatFs',
    },
    {
      text: 'Jumlah Tampalan Anterior GD Baru',
      value: 'tampalanAntGdBaru',
    },
    {
      text: 'Jumlah Tampalan Anterior GD Semula',
      value: 'tampalanAntGdSemula',
    },
    {
      text: 'Jumlah Tampalan Anterior GK Baru',
      value: 'tampalanAntGkBaru',
    },
    {
      text: 'Jumlah Tampalan Anterior GK Semula',
      value: 'tampalanAntGkSemula',
    },
    {
      text: 'Jumlah Tampalan Posterior GD Baru',
      value: 'tampalanPostGdBaru',
    },
    {
      text: 'Jumlah Tampalan Posterior GD Semula',
      value: 'tampalanPostGdSemula',
    },
    {
      text: 'Jumlah Tampalan Posterior GK Baru',
      value: 'tampalanPostGkBaru',
    },
    {
      text: 'Jumlah Tampalan Posterior GK Semula',
      value: 'tampalanPostGkSemula',
    },
    {
      text: 'Jumlah Tampalan Posterior Amalgam GD Baru',
      value: 'tampalanPostAmgGdBaru',
    },
    {
      text: 'Jumlah Tampalan Posterior Amalgam GD Semula',
      value: 'tampalanPostAmgGdSemula',
    },
    {
      text: 'Jumlah Tampalan Posterior Amalgam GK Baru',
      value: 'tampalanPostAmgGkBaru',
    },
    {
      text: 'Jumlah Tampalan Posterior Amalgam GK Semula',
      value: 'tampalanPostAmgGkSemula',
    },
    {
      text: 'Jumlah Inlay/Onlay Baru',
      value: 'inlayOnlayBaru',
    },
    {
      text: 'Jumlah Inlay/Onlay Semula',
      value: 'inlayOnlaySemula',
    },
    {
      text: 'Jumlah Tampalan Sementara',
      value: 'tampalanSementara',
    },
    {
      text: 'Jumlah Cabutan GD',
      value: 'cabutanGd',
    },
    {
      text: 'Jumlah Cabutan GK',
      value: 'cabutanGk',
    },
    {
      text: 'Jumlah Komplikasi Selepas Cabutan',
      value: 'komplikasiSelepasCabutan',
    },
    {
      text: 'Jumlah Penskaleran',
      value: 'penskaleran',
    },
    {
      text: 'Jumlah Rawatan Perio Lain',
      value: 'rawatanPerioLain',
    },
    {
      text: 'Jumlah Rawatan Endo Anterior',
      value: 'rawatanEndoAnterior',
    },
    {
      text: 'Jumlah Rawatan Endo Premolar',
      value: 'rawatanEndoPremolar',
    },
    {
      text: 'Jumlah Rawatan Endo Molar',
      value: 'rawatanEndoMolar',
    },
    {
      text: 'Jumlah Rawatan Ortho',
      value: 'rawatanOrtho',
    },
    {
      text: 'Jumlah Kes Perubatan',
      value: 'kesPerubatan',
    },
    {
      text: 'Jumlah Abses',
      value: 'abses',
    },
    {
      text: 'Jumlah Kecederaan Tulang Muka',
      value: 'kecederaanTulangMuka',
    },
    {
      text: 'Jumlah Kecederaan Gigi',
      value: 'kecederaanGigi',
    },
    {
      text: 'Jumlah Kecederaan Tisu Lembut',
      value: 'kecederaanTisuLembut',
    },
    {
      text: 'Jumlah Cabutan Surgikal',
      value: 'cabutanSurgical',
    },
    {
      text: 'Jumlah Pembedahan Kecil Mulut',
      value: 'pembedahanKecilMulut',
    },
    {
      text: 'Jumlah Crown/Bridge Baru',
      value: 'crownBridgeBaru',
    },
    {
      text: 'Jumlah Crown/Bridge Semula',
      value: 'crownBridgeSemula',
    },
    {
      text: 'Jumlah Post/Core Baru',
      value: 'postCoreBaru',
    },
    {
      text: 'Jumlah Post/Core Semula',
      value: 'postCoreSemula',
    },
    {
      text: 'Jumlah Dentur Penuh Baru',
      value: 'prosthodontikPenuhDenturBaru',
    },
    {
      text: 'Jumlah Dentur Penuh Semula',
      value: 'prosthodontikPenuhDenturSemula',
    },
    {
      text: 'Jumlah Pesakit Buat Dentur Penuh',
      value: 'jumlahPesakitBuatDenturPenuh',
    },
    {
      text: 'Jumlah Dentur Separa Baru',
      value: 'prosthodontikSeparaDenturBaru',
    },
    {
      text: 'Jumlah Dentur Separa Semula',
      value: 'prosthodontikSeparaDenturSemula',
    },
    {
      text: 'Jumlah Pesakit Buat Dentur Separa',
      value: 'jumlahPesakitBuatDenturSepara',
    },
    {
      text: 'Jumlah Immediate Denture',
      value: 'immediateDenture',
    },
    {
      text: 'Jumlah Pembaikan Denture',
      value: 'pembaikanDenture',
    },
    {
      text: 'Jumlah Kes Selesai',
      value: 'kesSelesai',
    },
    {
      text: 'Jumlah X-Ray Diambil',
      value: 'xrayDiambil',
    },
  ].map(({ text, value }) => ({ text, value, axis: 'y', checked: false }));
  const defaultXAxis = [
    'Masa',
    'Umur',
    'Jantina',
    'Kumpulan Etnik',
    'Pegawai',
    'Klinik',
    'Daerah',
    'Negeri',
    'Malaysia',
  ].map((text) => ({ text, axis: 'x', checked: false }));
  const defaultSearchOptions = [
    { opt: 'cutoff', text: 'Gunakan cutoff', checked: true },
    { opt: 'deleted', text: 'Termasuk data yang dihapus', checked: false },
    {
      opt: 'statusRetenBelumDiisi',
      text: 'Termasuk data reten yang belum diisi',
      checked: false,
    },
    {
      opt: 'statusRetenTelahDiisi',
      text: 'Termasuk data reten yang telah diisi',
      checked: true,
    },
    {
      opt: 'statusRetenSalah',
      text: 'Termasuk data reten yang salah',
      checked: true,
    },
    { opt: 'onCall', text: 'Termasuk data On Call', checked: false },
    {
      opt: 'incremental',
      text: 'Termasuk data Incremental',
      checked: false,
    },
  ];

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

  const [disclaimer, setDisclaimer] = useState(true);

  const [loading, setLoading] = useState(false);

  const [bigData, setBigData] = useState(null);

  // checkboxes
  const [checkboxSelection, setCheckboxSelection] = useState({
    y: defaultYAxis.map((i, index) => ({ id: index, ...i })),
    x: defaultXAxis.map((i, index) => ({ id: index, ...i })),
  });
  const [searchOptionsSelection, setSearchOptionsSelection] = useState(
    defaultSearchOptions.map((i, index) => ({ id: index, ...i }))
  );

  const handleSearchOptionsChange = (e) => {
    const { name, value } = e.target;
    const newSelection = [...searchOptionsSelection];
    newSelection.forEach((i) => {
      if (i.opt === name) {
        i.value = value;
        i.checked = !i.checked;
      }
    });
    // console.log(newSelection);
    setSearchOptionsSelection(newSelection);
  };

  const handleCheckboxChangeY = (e) => {
    const { name, value } = e.target;
    const newSelection = { ...checkboxSelection };
    newSelection['y'].forEach((i) => {
      if (i.text === name) {
        i.text = value;
        i.checked = !i.checked;
      }
    });
    // console.log(newSelection);
    setCheckboxSelection(newSelection);
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
    // console.log(newSelection);
    setCheckboxSelection(newSelection);
  };

  const saveFile = (blob) => {
    const link = document.createElement('a');
    link.download = `Laporan Ad Hoc Query ${moment().format(
      'DD-MM-YYYY'
    )}.xlsx`;
    link.href = URL.createObjectURL(new Blob([blob]));
    link.addEventListener('click', (e) => {
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
      }, 100);
    });
    link.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // construst payload
    const payload = {
      tarikhMula: startDateRef.current,
      tarikhAkhir: endDateRef.current,
      searchOptionsSelection,
      checkboxSelection,
    };
    // start
    try {
      setLoading(true);
      console.log(payload);
      const { data } = await adhocQuery(payload);
      setBigData(data);
      toast.success('Berjaya mendapatkan data');
    } catch (error) {
      console.log(error);
      toast.error('Gagal mendapatkan data');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (e) => {
    const payload = {
      lastQuery: bigData,
      checkboxSelection,
      tarikhMula: startDateRef.current,
      tarikhAkhir: endDateRef.current,
    };
    try {
      setLoading(true);
      const { data } = await downloadAdhocQuery(payload);
      saveFile(data);
      toast.success('Berjaya muat turun laporan');
    } catch (error) {
      console.log(error);
      toast.error('Gagal muat turun laporan');
    } finally {
      setLoading(false);
    }
  };

  const renderSearchOptions = (selection) => {
    return (
      <div className='grid grid-flow-col outline-1 outline-admin2 mb-3'>
        {selection.map((i, index) => (
          <div key={index} className='flex flex-row items-center'>
            <input
              type='checkbox'
              className='mr-2'
              name={i.opt}
              value={i.value}
              checked={i.checked}
              onChange={(e) => handleSearchOptionsChange(e)}
            />
            <label>{i.text}</label>
          </div>
        ))}
      </div>
    );
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
      <tr>
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
      </tr>
    );
  };

  const renderTableData = (data) => {
    return (
      <>
        {data.map((key, index) => (
          <tr key={index}>
            <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
              {checkboxSelection.x.some((item) => item.text === 'Umur')
                ? `${Dictionary[key._id]}`
                : key._id}
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
    setBigData(null);
    setCheckboxSelection({
      y: defaultYAxis.map((i, index) => ({ id: index, ...i })),
      x: defaultXAxis.map((i, index) => ({ id: index, ...i })),
    });
    setSearchOptionsSelection(
      defaultSearchOptions.map((i, index) => ({ id: index, ...i }))
    );
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

  if (disclaimer) {
    return <Disclaimer setDisclaimer={setDisclaimer} />;
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-2 gap-2 border border-admin2 rounded-md p-4 mb-3'>
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
          <div className='grid grid-flow-row text-center border border-admin2 rounded-md p-4 mb-3'>
            <p className='text-sm font-semibold text-user1 flex flex-row items-center'>
              Pilihan Carian:
            </p>
            {renderSearchOptions(searchOptionsSelection)}
          </div>
          <div className='grid grid-cols-2 border border-admin2 rounded-md p-4 mb-3'>
            <div className='grid grid-cols-2'>
              <div>
                <p className='mb-2'>Pembolehubah Y</p>
                {renderCheckbox(checkboxSelection.y)}
              </div>
            </div>
            <div className='grid grid-cols-2'>
              <div>
                <p className='mb-2'>Pembolehubah X</p>
                {renderCheckbox(checkboxSelection.x)}
              </div>
            </div>
          </div>
          {/* <div>
            {bigData ? (
              <MainChart data={bigData} axis={checkboxSelection.y} />
            ) : null}
          </div> */}
          <div className='grid grid-cols-3 mb-3'>
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
            {bigData ? (
              <button
                type='button'
                className='capitalize bg-user9 text-userWhite rounded-md shadow-xl p-2 mr-3 hover:bg-kaunter2 transition-all'
                onClick={handleDownload}
              >
                Muat Turun
              </button>
            ) : null}
          </div>
          <div className='m-auto overflow-x-auto text-sm rounded-md border border-admin2 p-2 h-min max-w-max'>
            {bigData ? (
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
