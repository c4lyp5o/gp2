import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

import { useGlobalAdminAppContext } from '../../context/adminAppContext';

const Generate = (props) => {
  const {
    toast,
    adminToken,
    masterDatePicker,
    readAllDaerahInNegeri,
    readAllKlinikInDaerah,
  } = useGlobalAdminAppContext();
  const [jenisReten, setJenisReten] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [month, setMonth] = useState('');
  const [formatFile, setFormatFile] = useState('xlsx');
  const [pilihanSekolah, setPilihanSekolah] = useState('');
  const [allPersonSekolahs, setAllPersonSekolahs] = useState([]);
  const [namaSekolahs, setNamaSekolahs] = useState([]);
  const [kp, setKp] = useState('');

  // masalah negara
  const [daerah, setDaerah] = useState([]);
  const [klinik, setKlinik] = useState([]);
  const [namaKlinik, setNamaKlinik] = useState('');
  const [pilihanNegeri, setPilihanNegeri] = useState('');
  const [pilihanDaerah, setPilihanDaerah] = useState('');
  const [pilihanKlinik, setPilihanKlinik] = useState('');

  //datepicker range
  const [startDatePicker, setStartDatePicker] = useState(null);
  const [endDatePicker, setEndDatePicker] = useState(null);

  const TarikhAwal = () => {
    return masterDatePicker({
      selected: startDatePicker,
      selectsStart: true,
      startDate: startDatePicker,
      endDate: endDatePicker,
      onChange: (startDate) => {
        setStartDate(moment(startDate).format('YYYY-MM-DD'));
        setStartDatePicker(startDate);
      },
      filterDate: (date) => {
        return moment() > date;
      },
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
        setEndDate(moment(endDate).format('YYYY-MM-DD'));
        setEndDatePicker(endDate);
      },
      filterDate: (date) => {
        return moment() > date;
      },
      className:
        'appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent',
    });
  };

  // reset endDate if change startDate
  useEffect(() => {
    setEndDate('');
    setEndDatePicker(null);
  }, [startDate]);

  // reset stuff
  useEffect(() => {
    if (pilihanKlinik === '') {
      setPilihanDaerah('');
    }
  }, [pilihanKlinik]);

  useEffect(() => {
    setPilihanKlinik('');
  }, [pilihanDaerah]);

  useEffect(() => {
    setPilihanDaerah('');
    setPilihanKlinik('');
  }, [jenisReten]);

  const fileName = () => {
    let file = '';
    if (pilihanDaerah !== 'all' && pilihanKlinik !== 'all') {
      console.log('1');
      file = `${jenisReten}-${namaKlinik}-${startDate}.${formatFile}`;
    }
    if (pilihanDaerah !== 'all' && pilihanKlinik === 'all') {
      console.log('2');
      file = `${jenisReten}-${props.loginInfo.daerah.toUpperCase()}-${startDate}.${formatFile}`;
    }
    if (pilihanDaerah === 'all') {
      console.log('3');
      file = `${jenisReten}-${props.loginInfo.negeri.toUpperCase()}-${startDate}.${formatFile}`;
    }
    // if (!endDate) {
    //   file = `${jenisReten}-${kp}-${startDate}.${formatFile}`;
    // }
    return file;
  };

  const saveFile = (blob) => {
    const link = document.createElement('a');
    link.download = fileName();
    link.href = URL.createObjectURL(new Blob([blob]));
    link.addEventListener('click', (e) => {
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
      }, 100);
    });
    link.click();
  };

  const handleJana = async (e) => {
    e.preventDefault();
    await toast
      .promise(
        axios.get(
          `/api/v1/generate/download?jenisReten=${jenisReten}&negeri=${
            props.loginInfo.negeri
          }&daerah=${
            props.loginInfo.daerah
          }&klinik=${pilihanKlinik}&tarikhMula=${startDate}&tarikhAkhir=${endDate}&bulan=${new Date().getFullYear()}-${month}&formatFile=${formatFile}`,
          {
            headers: {
              Authorization: adminToken,
            },
            responseType: 'blob',
          }
        ),
        {
          pending: 'Menghasilkan reten...',
          success: 'Reten berjaya dihasilkan',
          error: 'Tiada data untuk tarikh yang dipilih',
        },
        { autoClose: 2000 }
      )
      .then((blob) => {
        saveFile(blob.data);
      });
  };

  useEffect(() => {
    if (props.loginInfo.accountType === 'negeriSuperadmin') {
      // setPilihanNegeri(props.loginInfo.negeri);
      readAllDaerahInNegeri().then((res) => {
        setDaerah(res.data);
      });
    }
    if (props.loginInfo.accountType === 'daerahSuperadmin') {
      // setPilihanNegeri(props.loginInfo.negeri);
      // setPilihanDaerah(props.loginInfo.daerah);
      readAllKlinikInDaerah(props.loginInfo.daerah).then((res) => {
        setKlinik(res.data);
      });
    }
  }, []);

  return (
    <>
      <div className='p-2'>
        <h1 className='font-bold text-lg text-user1 '>Penjanaan Laporan</h1>
        <form onSubmit={handleJana}>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-2'>
            <div className='px-3 py-1'>
              <label
                htmlFor='jenisReten'
                className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
              >
                Laporan:
              </label>
              <select
                required
                name='jenisReten'
                id='jenisReten'
                onChange={(e) => setJenisReten(e.target.value)}
                className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
              >
                <option value=''>Sila pilih reten</option>
                <option value='PG101A'>PG101A</option>
                <option value='PG101C'>PG101C</option>
                <option value='PG206'>PG206</option>
                <option value='PG207'>PG207</option>
                <option value='PG211A'>PG211A</option>
                <option value='PG211C'>PG211C</option>
                <option value='PG214'>PG214</option>
                {/* <option value='BEGIN'>BEGIN 01/2020</option>
                <option value='PGS203'>PGS203 (Pind. 1/2021)</option>
                <option value='CPPC1'>CPPC 1</option>
                <option value='CPPC2'>CPPC 2</option>
                <option value='PG201A'>PG201A</option>
                <option value='MMI1'>BORANG MMI/1</option>
                <option value='FV'>FV</option>
                <option value='PG201'>PG201</option>
                <option value='PG201SMKP'>PG201 SMKP</option>
                <option value='GIS'>GIS</option>
                <option value='PERSIS1'>PERSiS-1</option>
                <option value='PPIM03'>PPIM 03-2020</option>
                <option value='PPIM04'>PPIM 04</option>
                <option value='PPIM05'>PPIM 05-2020</option>
                <option value='PPKPS'>PPKPS</option>
                <option value='MGH'>MGH</option> */}
              </select>
            </div>
            {/* <div className='px-3 py-1'>
              <label
                htmlFor='sekolah'
                className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
              >
                Sekolah:
              </label>
              <select
                name='sekolah'
                id='sekolah'
                value={pilihanSekolah}
                onChange={(e) => {
                  setPilihanSekolah(e.target.value);
                }}
                className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
              >
                <option value=''>Sila pilih..</option>
                {namaSekolahs.map((singleNamaSekolah, index) => {
                  return (
                    <option
                      value={singleNamaSekolah}
                      key={index}
                      className='capitalize'
                    >
                      {singleNamaSekolah}
                    </option>
                  );
                })}
              </select>
            </div> */}
            {(jenisReten === 'PG101A' || jenisReten === 'PG101C') && (
              <>
                <div className='px-3 py-1'>
                  <label
                    htmlFor='tarikhMula'
                    className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                  >
                    Daripada:
                  </label>
                  <TarikhAwal />
                  {/* <input
                    required
                    type='date'
                    name='tarikhMula'
                    id='tarikhMula'
                    onChange={(e) => setStartDate(e.target.value)}
                    className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  /> */}
                </div>
                <div className='px-3 py-1'>
                  <label
                    htmlFor='tarikhAkhir'
                    className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                  >
                    Sehingga:
                  </label>
                  <TarikhAkhir />
                  {/* <input
                    type='date'
                    name='tarikhAkhir'
                    id='tarikhAkhir'
                    onChange={(e) => setEndDate(e.target.value)}
                    className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  /> */}
                </div>
                {props.loginInfo.accountType === 'negeriSuperadmin' ? (
                  <div className='px-3 py-1'>
                    <label
                      htmlFor='daerah'
                      className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                    >
                      Daerah:
                    </label>
                    <select
                      required
                      name='daerah'
                      id='daerah'
                      onChange={async (e) => {
                        setPilihanDaerah(e.target.value);
                        await readAllKlinikInDaerah(e.target.value).then(
                          (res) => {
                            setKlinik(res.data);
                          }
                        );
                      }}
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent capitalize'
                    >
                      <option value=''>Sila pilih..</option>
                      <option value='all'>Semua daerah (Jana Negeri)</option>
                      {daerah.map((d, index) => {
                        return (
                          <option value={d} key={index} className='capitalize'>
                            {d}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                ) : null}
                {props.loginInfo.accountType === 'daerahSuperadmin' ||
                (pilihanDaerah !== '' && pilihanDaerah !== 'all') ? (
                  <div className='px-3 py-1'>
                    <label
                      htmlFor='klinik'
                      className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                    >
                      Klinik:
                    </label>
                    <select
                      required
                      name='klinik'
                      id='klinik'
                      onChange={(e) => {
                        setPilihanKlinik(e.target.value);
                        setNamaKlinik(
                          e.target.options[e.target.selectedIndex].getAttribute(
                            'data-key'
                          )
                        );
                      }}
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                    >
                      <option value=''>Sila pilih..</option>
                      <option value='all'>Semua klinik (Jana Daerah)</option>
                      {klinik.map((k, index) => {
                        return (
                          <option
                            key={index}
                            data-key={k.kp}
                            value={k.kodFasiliti}
                            className='capitalize'
                          >
                            {k.kp}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                ) : null}
              </>
            )}
            {(jenisReten === 'PG211A' ||
              jenisReten === 'PG211C' ||
              jenisReten === 'PG214' ||
              jenisReten === 'PG206' ||
              jenisReten === 'PG207') && (
              <>
                <div className='px-3 py-1'>
                  <label
                    htmlFor='bulanpg211'
                    className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                  >
                    Sila pilih bulan
                  </label>
                  <select
                    required
                    name='bulanpg211'
                    id='bulanpg211'
                    className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                    onChange={(e) => {
                      setMonth(e.target.value);
                    }}
                  >
                    <option value=''>Sila pilih bulan</option>
                    <option value='01-01'>Januari</option>
                    <option value='02-01'>Februari</option>
                    <option value='03-01'>Mac</option>
                    <option value='04-01'>April</option>
                    <option value='05-01'>Mei</option>
                    <option value='06-01'>Jun</option>
                    <option value='07-01'>Julai</option>
                    <option value='08-01'>Ogos</option>
                    <option value='09-01'>September</option>
                    <option value='10-01'>Oktober</option>
                    <option value='11-01'>November</option>
                    <option value='12-01'>Disember</option>
                  </select>
                </div>
                {props.loginInfo.accountType === 'negeriSuperadmin' ? (
                  <div className='px-3 py-1'>
                    <label
                      htmlFor='daerah'
                      className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                    >
                      Daerah:
                    </label>
                    <select
                      required
                      name='klinik'
                      id='klinik'
                      onChange={async (e) => {
                        setPilihanDaerah(e.target.value);
                        await readAllKlinikInDaerah(e.target.value).then(
                          (res) => {
                            setKlinik(res.data);
                          }
                        );
                      }}
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent capitalize'
                    >
                      <option value=''>Sila pilih..</option>
                      <option value='all'>Semua daerah (Jana Negeri)</option>
                      {daerah.map((d, index) => {
                        return (
                          <option value={d} key={index} className='capitalize'>
                            {d}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                ) : null}
                {props.loginInfo.accountType === 'daerahSuperadmin' ||
                (pilihanDaerah !== '' && pilihanDaerah !== 'all') ? (
                  <div className='px-3 py-1'>
                    <label
                      htmlFor='klinik'
                      className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                    >
                      Klinik:
                    </label>
                    <select
                      required
                      name='klinik'
                      id='klinik'
                      onChange={(e) => setPilihanKlinik(e.target.value)}
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                    >
                      <option value=''>Sila pilih..</option>
                      <option value='all'>Semua klinik (Jana Daerah)</option>
                      {klinik.map((k, index) => {
                        return (
                          <option value={k} key={index} className='capitalize'>
                            {k}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                ) : null}
              </>
            )}
          </div>
          <div className='grid grid-cols-3 lg:grid-cols-5'>
            {/* <button className='capitalize bg-user3 text-userWhite rounded-md shadow-xl p-2 mr-2 hover:bg-user1 transition-all'>
              cetak
            </button> */}
            {/* <div className='col-start-2 lg:col-start-3 px-3 py-1'>
              <label
                htmlFor='formatFile'
                className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
              >
                Format:
              </label>
              <select
                required
                name='formatFile'
                id='formatFile'
                onChange={(e) => setFormatFile(e.target.value)}
                className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
              >
                <option value=''>Sila pilih format file</option>
                <option value='xlsx'>Excel</option>
                <option value='pdf'>PDF</option>
              </select>
            </div> */}
            <button
              className='capitalize bg-admin3 text-userWhite rounded-md shadow-xl px-3 py-2 mx-3 my-2 hover:bg-user1 transition-all col-start-2 lg:col-start-3'
              type='submit'
            >
              jana
            </button>
          </div>
          {/* <div className='p-2 items-center mt-2'>
            <iframe
              className='w-full'
              height='400'
              title='iframe'
              src=''
              frameBorder='0'
            ></iframe>
          </div> */}
        </form>
      </div>
    </>
  );
};

export default Generate;
