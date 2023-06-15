import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Spinner } from 'react-awesome-spinners';
import { MdSupervisedUserCircle, MdOutlineSmartToy } from 'react-icons/md';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

import { useGlobalUserAppContext } from '../../context/userAppContext';

export default function UserSummary() {
  const { userToken, userinfo, reliefUserToken } = useGlobalUserAppContext();
  const [bulan, setBulan] = useState('');
  const [waitForData, setWaitForData] = useState(false);
  const [filteredSummary, setFilteredSummary] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [customSummary, setCustomSummary] = useState([]);
  const [profileImage, setProfileImage] = useState(null);

  //show
  const [isShowPt, setIsShowPt] = useState(false);

  // const uploadImage = useId();

  // async function resizeImage(data) {
  //   const response = await axios.post('/api/v1/superadmin/newroute', {
  //     image: data.image.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),
  //     type: data.type,
  //     main: 'ImageResizer',
  //     Fn: 'resize',
  //     token: userToken,
  //   });
  //   return response;
  // }

  // const encodeImageFileAsURL = (e) => {
  //   const filesSelected = document.getElementById(uploadImage).files;

  //   if (filesSelected.length > 0) {
  //     const fileToLoad = filesSelected[0];
  //     if (fileToLoad.size > 1000000) {
  //       toast.error(
  //         'Gambar terlalu besar. Sila muat naik gambar yang lebih kecil. Maksimum 1MB.'
  //       );
  //       return;
  //     }
  //     const fileReader = new FileReader();
  //     fileReader.onload = async function (fileLoadedEvent) {
  //       const srcData = fileLoadedEvent.target.result;
  //       const data = {
  //         type: fileToLoad.type,
  //         image: srcData,
  //       };
  //       try {
  //         const resizedImage = await resizeImage(data);
  //         setProfileImage(resizedImage.data.imgSrc);
  //         // upload image to server
  //         const res = await axios.patch(
  //           `/api/v1/operator/${userinfo._id}`,
  //           {
  //             image: resizedImage.data.imgSrc,
  //           },
  //           {
  //             headers: { Authorization: `Bearer ${userToken}` },
  //           }
  //         );
  //         toast.success(res.data.msg);
  //       } catch (error) {
  //         toast.error('Gambar tidak sah.');
  //       }
  //     };
  //     fileReader.readAsDataURL(fileToLoad);
  //   }
  // };

  const handleMonthChange = async (pilihanBulan) => {
    setBulan(pilihanBulan);
    if (pilihanBulan === '') {
      return;
    }
    setWaitForData(true);
    const fetchSummaryData = async () => {
      const res = await axios.get(
        `/api/v1/summary?id=${
          userinfo._id
        }&bulan=${pilihanBulan}&tahun=${moment().format('YYYY')}`,
        {
          headers: {
            Authorization: `Bearer ${
              reliefUserToken ? reliefUserToken : userToken
            }`,
          },
        }
      );
      // console.log(res.data.customSummary);
      setFilteredSummary(res.data.filteredSummary);
      setCustomSummary(res.data.customSummary);
      const process = processSummaryData(res.data.filteredSummary);
      setProcessedData(process);
    };
    fetchSummaryData()
      .then(() => {
        setWaitForData(false);
      })
      .catch((err) => {
        setFilteredSummary([]);
        setCustomSummary([]);
        setWaitForData(false);
      });
  };

  const [doughnutData, setDoughnutData] = useState({
    toddler: 0,
    umum: 0,
    wargaEmas: 0,
    bersekolah: 0,
    bukanWarganegara: 0,
    ibuMengandung: 0,
    oku: 0,
    pesara: 0,
  });
  const processSummaryData = (data) => {
    const processedData = [
      { group: 'Toddler', total: 0 },
      { group: 'Umum', total: 0 },
      { group: 'Warga Emas', total: 0 },
      { group: 'Bersekolah', total: 0 },
      { group: 'Bukan Warganegara', total: 0 },
      { group: 'Ibu Mengandung', total: 0 },
      { group: 'OKU', total: 0 },
      { group: 'Pesara', total: 0 },
    ];

    data.forEach((patient) => {
      const age = moment().diff(patient.tarikhLahir, 'years');
      if (age < 5) {
        processedData[0].total++;
      } else if (age > 4) {
        processedData[1].total++;
      } else if (age > 59) {
        processedData[2].total++;
      }
      if (patient.bersekolah) {
        processedData[3].total++;
      }
      if (patient.kumpulanEtnik === 'bukan warganegara') {
        processedData[4].total++;
      }
      if (patient.ibuMengandung) {
        processedData[5].total++;
      }
      if (patient.orangKurangUpaya) {
        processedData[6].total++;
      }
      if (patient.statusPesara) {
        processedData[7].total++;
      }
      if (patient.kakitanganKerajaan) {
        processedData[8].total++;
      }
    });
    setDoughnutData({
      toddler: processedData[0].total,
      umum: processedData[1].total,
      wargaEmas: processedData[2].total,
      bersekolah: processedData[3].total,
      bukanWarganegara: processedData[4].total,
      ibuMengandung: processedData[5].total,
      oku: processedData[6].total,
      pesara: processedData[7].total,
    });
  };

  const data = {
    labels: [
      'Toddler',
      'Umum',
      'Warga Emas',
      'Bersekolah',
      'Bukan Warganegara',
      'Ibu Mengandung',
      'OKU',
      'Pesara',
    ],
    datasets: [
      {
        label: 'Jumlah',
        data: [
          doughnutData.toddler,
          doughnutData.umum,
          doughnutData.wargaEmas,
          doughnutData.bersekolah,
          doughnutData.bukanWarganegara,
          doughnutData.ibuMengandung,
          doughnutData.oku,
          doughnutData.pesara,
        ],
        backgroundColor: [
          '#e74c3c',
          '#3498db',
          '#e67e22',
          '#2ecc71',
          '#f1c40f',
          '#1abc9c',
          '#9b59b6',
          '#d35400',
        ],
        borderColor: [
          '#e74c3c',
          '#3498db',
          '#e67e22',
          '#2ecc71',
          '#f1c40f',
          '#1abc9c',
          '#9b59b6',
          '#d35400',
        ],
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const res = await axios.get(`/api/v1/operator/${userinfo._id}`, {
  //       headers: { Authorization: `Bearer ${userToken}` },
  //     });
  //     setProfileImage(res.data.singlePersonOperator.image);
  //     if (res.data.singlePersonOperator.summary.length === 0) {
  //       return setFilteredSummary([]);
  //     }
  //     setFilteredSummary(res.data.singlePersonOperator.summary);
  //   };
  //   fetchData().catch((err) => {
  //     console.log(err.response.data.msg);
  //   toast.error(
  //     'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: user-summary-fetchData'
  //   );
  //   });
  //   return () => {
  //     setFilteredSummary([]);
  //   };
  // }, [userToken]);

  // if (!data) {
  //   return (
  //     <div className='mt-5'>
  //       <Spinner />
  //     </div>
  //   );
  // }

  return (
    <>
      <div className='px-3 lg:px-10 h-full p-3 overflow-y-auto'>
        <h2 className='text-2xl font-bold'>Ringkasan Beban Kerja</h2>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-1'>
          <div className='flex flex-row justify-start border-l-8 border-user2 shadow-lg py-2 pr-2 space-y-2'>
            {/* <img
          src={profileImage}
          alt='profile'
          className='w-32 h-32 rounded-full'
          onClick={() => document.getElementById(uploadImage).click()}
        />
        <input
          hidden
          type='file'
          id={uploadImage}
          name={uploadImage}
          accept='image/*'
          onChange={(e) => {
            encodeImageFileAsURL(e);
          }}
        /> */}
            <div className='flex flex-col justify-start text-left ml-2'>
              <MdOutlineSmartToy className='text-user2 text-5xl m-1' />
              <h2 className='text-xl font-bold'>{userinfo.nama}</h2>
              <h3 className='text-base'>
                {userinfo.statusPegawai === 'pp'
                  ? 'Pegawai Pergigian'
                  : 'Juruterapi Pergigian'}{' '}
                Gred {userinfo.gred.toUpperCase()}{' '}
                {userinfo.mdcNumber ? (
                  <div>Nombor MDC: {userinfo.mdcNumber}</div>
                ) : (
                  <div>Nombor MDTB: {userinfo.mdtbNumber}</div>
                )}
              </h3>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-1 items-center'>
            <div className='border-l-8 border-user2 shadow-lg py-2 pr-2 relative'>
              <div
                onMouseEnter={() => setIsShowPt(true)}
                onMouseLeave={() => setIsShowPt(false)}
                className='flex flex-row items-center'
              >
                <MdSupervisedUserCircle className='text-user2 text-5xl m-1' />
                <div>
                  <p className='text-xs flex flex-row'>Jumlah Pesakit</p>
                  <span
                    className={`font-mono ${
                      filteredSummary.length > 0 ? 'text-5xl' : 'text-sm'
                    } flex flex-row`}
                  >
                    {filteredSummary.length > 0 ? filteredSummary.length : null}
                  </span>
                </div>
                {customSummary.length > 0 && isShowPt && (
                  <div className='absolute top-16 z-20 w-96 h-96 bg-userWhite rounded-md shadow-md shadow-user1 m-2'>
                    {/* {processedData.map((item) => (
                      <div
                        className='border-l-8 border-user2 shadow-lg py-2 pr-2'
                        key={item.group}
                      >
                        <div className='flex flex-row items-center'>
                          <MdSupervisedUserCircle className='text-user2 text-5xl m-1' />
                          <div>
                            <p className='text-xs flex flex-row'>
                              {item.group}
                            </p>
                            <span
                              className={`font-mono ${
                                processedData.length > 0
                                  ? 'text-5xl'
                                  : 'text-sm'
                              } flex flex-row`}
                            >
                              {item.total}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))} */}
                    <Doughnut data={data} className='m-2' />
                  </div>
                )}
              </div>
            </div>
            <div className='border-l-8 border-user2 shadow-lg py-2 pr-2'>
              <div className='flex flex-row items-center'>
                <MdSupervisedUserCircle className='text-user2 text-5xl m-1' />
                <div>
                  <p className='text-xs flex flex-row'>Kes Selesai</p>
                  <span
                    className={`font-mono ${
                      filteredSummary.length > 0 ? 'text-5xl' : 'text-sm'
                    } flex flex-row`}
                  >
                    {customSummary[0]?.jumlahKesSelesai}
                  </span>
                </div>
              </div>
            </div>
            <div className='border-l-8 border-user2 shadow-lg py-2 pr-2'>
              <div className='flex flex-row items-center'>
                <MdSupervisedUserCircle className='text-user2 text-5xl m-1' />
                <div>
                  <p className='text-xs flex flex-row'>Pesakit Baru</p>
                  <span
                    className={`font-mono ${
                      filteredSummary.length > 0 ? 'text-5xl' : 'text-sm'
                    } flex flex-row`}
                  >
                    {filteredSummary.length > 0
                      ? filteredSummary.filter(
                          (item) => item.kedatangan === 'baru-kedatangan'
                        ).length
                      : null}
                  </span>
                </div>
              </div>
            </div>
            <div className='border-l-8 border-user2 shadow-lg py-2 pr-2'>
              <div className='flex flex-row items-center'>
                <MdSupervisedUserCircle className='text-user2 text-5xl m-1' />
                <div>
                  <p className='text-xs flex flex-row'>Pesakit Ulangan</p>
                  <span
                    className={`font-mono ${
                      filteredSummary.length > 0 ? 'text-5xl' : 'text-sm'
                    } flex flex-row`}
                  >
                    {filteredSummary.length > 0
                      ? filteredSummary.filter(
                          (item) => item.kedatangan === 'ulangan-kedatangan'
                        ).length
                      : null}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-1 items-center'>
            <div className='border-l-8 border-user2 shadow-lg py-2 pr-2'>
              <div className='flex flex-row items-center'>
                <MdSupervisedUserCircle className='text-user2 text-5xl m-1' />
                <div>
                  <p className='text-xs flex flex-row'>Tampalan Gigi Desidus</p>
                  <span className='font-mono text-5xl flex flex-row'>
                    {customSummary[0]?.jumlahTampalanGigiDesidus}
                  </span>
                </div>
              </div>
            </div>
            <div className='border-l-8 border-user2 shadow-lg py-2 pr-2'>
              <div className='flex flex-row items-center'>
                <MdSupervisedUserCircle className='text-user2 text-5xl m-1' />
                <div>
                  <p className='text-xs flex flex-row'>Tampalan Gigi Kekal</p>
                  <span className='font-mono text-5xl flex flex-row'>
                    {customSummary[0]?.jumlahTampalanGigiKekal}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col items-center my-2'>
          <div className='flex flex-row items-center'>
            <select
              onChange={(e) => handleMonthChange(e.target.value)}
              className='border-2 border-user2 rounded-md p-1 m-1'
            >
              <option value=''>Sila Pilih Bulan...</option>
              <option value='01'>Januari</option>
              <option value='02'>Februari</option>
              <option value='03'>Mac</option>
              <option value='04'>April</option>
              <option value='05'>Mei</option>
              <option value='06'>Jun</option>
              <option value='07'>Julai</option>
              <option value='08'>Ogos</option>
              <option value='09'>September</option>
              <option value='10'>Oktober</option>
              <option value='11'>November</option>
              <option value='12'>Disember</option>
            </select>
            {/* <button
              onClick={(e) => handleMonthChange(e)}
              className='border-2 border-user2 rounded-md p-1 m-1'
            >
              Cari
            </button> */}
          </div>
        </div>
        {waitForData && (
          <div className='flex flex-auto justify-center w-full h-full'>
            <Spinner />
          </div>
        )}
        {!waitForData && filteredSummary.length > 0 ? (
          <section className='p-1'>
            <div className='m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max'>
              <table className='table-auto'>
                <thead className='text-userWhite bg-user2'>
                  <tr>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                      BIL
                    </th>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                      NAMA
                    </th>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                      TARIKH KEDATANGAN
                    </th>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1 w-30'>
                      KEDATANGAN
                    </th>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                      KAD PENGENALAN
                    </th>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                      JENIS ETNIK
                    </th>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                      CATATAN
                    </th>
                  </tr>
                </thead>
                {filteredSummary.map((item, index) => {
                  return (
                    <tbody key={item._id} className='text-userBlack bg-user4'>
                      <tr>
                        <td className='px-2 py-1 outline outline-1 outline-offset-1 outline-userWhite'>
                          {index + 1}
                        </td>
                        <td className='px-3 py-1 outline outline-1 outline-offset-1 outline-userWhite md:w-screen md:max-w-md lg:w-screen lg:max-w-screen-lg text-left'>
                          {item.nama}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-offset-1 outline-userWhite'>
                          {moment(item.tarikhKedatangan).format('DD/MM/YYYY')}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-offset-1 outline-userWhite'>
                          {item.kedatangan === 'baru-kedatangan' ? (
                            <span className='bg-user7 text-adminWhite text-md font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                              Baru
                            </span>
                          ) : (
                            <span className='bg-user9 text-adminWhite text-md font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                              Ulangan
                            </span>
                          )}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-offset-1 outline-userWhite'>
                          {item.ic}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-offset-1 outline-userWhite'>
                          {item.kumpulanEtnik.toUpperCase()}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-offset-1 outline-userWhite'>
                          {item.rawatanDibuatOperatorLain && (
                            <span className='text-md px-1.5 py-0.5 rounded whitespace-nowrap'>
                              Operator Bantuan
                            </span>
                          )}
                          {item.deleted && (
                            <span className='text-md px-1.5 py-0.5 rounded whitespace-nowrap'>
                              PESAKIT TELAH DIHAPUS
                            </span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  );
                })}
              </table>
            </div>
          </section>
        ) : (
          <div className='flex flex-col items-center mt-5'>
            <span
              className={`${
                bulan !== '' &&
                filteredSummary.length === 0 &&
                waitForData === false
                  ? 'bg-admin2 text-adminWhite text-3xl font-semibold'
                  : 'mt-3 font-mono text-xl'
              } px-1.5 py-0.5 rounded whitespace-nowrap`}
            >
              {bulan !== '' &&
                filteredSummary.length === 0 &&
                waitForData === false &&
                'Tiada rekod beban kerja'}
            </span>
          </div>
        )}
      </div>
    </>
  );
}
