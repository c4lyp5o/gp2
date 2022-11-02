import { useState, useEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';
import moment from 'moment';

import { useGlobalUserAppContext } from '../../context/userAppContext';

function UserFormSekolahKOTAK() {
  const {
    userToken,
    reliefUserToken,
    username,
    useParams,
    masterDatePicker,
    toast,
  } = useGlobalUserAppContext();

  const { personSekolahId, kotakSekolahId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isShown, setIsShown] = useState(false);
  const [singlePersonSekolah, setSinglePersonSekolah] = useState([]);

  const createdByUsername = username;
  const [rokokBiasaKotak, setRokokBiasaKotak] = useState(0);
  const [elektronikVapeKotak, setElektronikVapeKotak] = useState(0);
  const [shishaKotak, setShishaKotak] = useState(0);
  const [lainLainKotak, setLainLainKotak] = useState(0);
  const [tarikh1, setTarikh1] = useState('');
  const [adaTiadaQTarikh1, setAdaTiadaQTarikh1] = useState('');
  const [tarikh2, setTarikh2] = useState('');
  const [adaTiadaQTarikh2, setAdaTiadaQTarikh2] = useState('');
  const [tarikh3, setTarikh3] = useState('');
  const [adaTiadaQTarikh3, setAdaTiadaQTarikh3] = useState('');
  const [tarikh4, setTarikh4] = useState('');
  const [adaTiadaQTarikh4, setAdaTiadaQTarikh4] = useState('');
  const [rujukGuruKaunseling, setRujukGuruKaunseling] = useState('');
  const [tarikhQ, setTarikhQ] = useState('');
  const [statusSelepas6Bulan, setStatusSelepas6Bulan] = useState('');

  // tarikh quit date
  const [tarikhQ1DP, setTarikhQ1DP] = useState(null);
  const [tarikhQ2DP, setTarikhQ2DP] = useState(null);
  const [tarikhQ3DP, setTarikhQ3DP] = useState(null);
  const [tarikhQ4DP, setTarikhQ4DP] = useState(null);
  const [tarikhQDP, setTarikhQDP] = useState(null);

  const TarikhQ1 = () => {
    return masterDatePicker({
      selected: tarikhQ1DP,
      onChange: (date) => {
        setTarikhQ1DP(date);
        setTarikh1(moment(date).format('YYYY-MM-DD'));
      },
      className:
        'appearance-none w-36 text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md uppercase flex flex-row',
    });
  };

  const TarikhQ2 = () => {
    return masterDatePicker({
      selected: tarikhQ2DP,
      onChange: (date) => {
        setTarikhQ2DP(date);
        setTarikh2(moment(date).format('YYYY-MM-DD'));
      },
      className:
        'appearance-none w-36 text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md uppercase flex flex-row',
    });
  };

  const TarikhQ3 = () => {
    return masterDatePicker({
      selected: tarikhQ3DP,
      onChange: (date) => {
        setTarikhQ3DP(date);
        setTarikh3(moment(date).format('YYYY-MM-DD'));
      },
      className:
        'appearance-none w-36 text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md uppercase flex flex-row',
    });
  };

  const TarikhQ4 = () => {
    return masterDatePicker({
      selected: tarikhQ4DP,
      onChange: (date) => {
        setTarikhQ4DP(date);
        setTarikh4(moment(date).format('YYYY-MM-DD'));
      },
      className:
        'appearance-none w-36 text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md uppercase flex flex-row',
    });
  };

  const TarikhQ = () => {
    return masterDatePicker({
      selected: tarikhQDP,
      onChange: (date) => {
        setTarikhQDP(date);
        setTarikhQ(moment(date).format('YYYY-MM-DD'));
      },
      className:
        'appearance-none w-36 text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md uppercase flex flex-row ml-5',
    });
  };

  //reset value
  useEffect(() => {
    if (adaTiadaQTarikh1 === 'ada-q-tarikh1') {
      setTarikh2('');
      setTarikhQ2DP(null);
      setAdaTiadaQTarikh2('');
      setTarikh3('');
      setAdaTiadaQTarikh3('');
      setTarikhQ3DP(null);
      setTarikh4('');
      setAdaTiadaQTarikh4('');
      setTarikhQ4DP(null);
    }
    if (adaTiadaQTarikh2 === 'ada-q-tarikh2') {
      setTarikh3('');
      setAdaTiadaQTarikh3('');
      setTarikhQ3DP(null);
      setTarikh4('');
      setAdaTiadaQTarikh4('');
      setTarikhQ4DP(null);
    }
    if (adaTiadaQTarikh3 === 'ada-q-tarikh3') {
      setTarikh4('');
      setAdaTiadaQTarikh4('');
      setTarikhQ4DP(null);
    }
    if (adaTiadaQTarikh1 === 'tiada-q-tarikh1') {
      setTarikhQ('');
      setTarikhQDP(null);
      setStatusSelepas6Bulan('');
    }
    if (adaTiadaQTarikh2 === 'tiada-q-tarikh2') {
      setTarikhQ('');
      setTarikhQDP(null);
      setStatusSelepas6Bulan('');
    }
    if (adaTiadaQTarikh3 === 'tiada-q-tarikh3') {
      setTarikhQ('');
      setTarikhQDP(null);
      setStatusSelepas6Bulan('');
      setRujukGuruKaunseling('');
    }
    if (adaTiadaQTarikh4 === 'tiada-q-tarikh4') {
      setTarikhQ('');
      setTarikhQDP(null);
      setStatusSelepas6Bulan('');
      setRujukGuruKaunseling('');
    }
  }, [
    adaTiadaQTarikh1,
    adaTiadaQTarikh2,
    adaTiadaQTarikh3,
    adaTiadaQTarikh4,
    tarikhQ2DP,
    tarikhQ3DP,
    tarikhQ4DP,
  ]);

  // fetch singlePersonSekolah
  useEffect(() => {
    const fetchSinglePersonSekolah = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `/api/v1/sekolah/populate/${personSekolahId}`,
          {
            headers: {
              Authorization: `Bearer ${
                reliefUserToken ? reliefUserToken : userToken
              }`,
            },
          }
        );
        setSinglePersonSekolah(data.personSekolahWithPopulate);

        // map to form if kotakSekolahId exist
        if (kotakSekolahId !== 'tambah-kotak') {
          setRokokBiasaKotak(
            data.personSekolahWithPopulate.kotakSekolah.rokokBiasaKotak
          );
          setElektronikVapeKotak(
            data.personSekolahWithPopulate.kotakSekolah.elektronikVapeKotak
          );
          setShishaKotak(
            data.personSekolahWithPopulate.kotakSekolah.shishaKotak
          );
          setLainLainKotak(
            data.personSekolahWithPopulate.kotakSekolah.lainLainKotak
          );
          setTarikh1(data.personSekolahWithPopulate.kotakSekolah.tarikh1);
          setAdaTiadaQTarikh1(
            data.personSekolahWithPopulate.kotakSekolah.adaTiadaQTarikh1
          );
          setTarikh2(data.personSekolahWithPopulate.kotakSekolah.tarikh2);
          setAdaTiadaQTarikh2(
            data.personSekolahWithPopulate.kotakSekolah.adaTiadaQTarikh2
          );
          setTarikh3(data.personSekolahWithPopulate.kotakSekolah.tarikh3);
          setAdaTiadaQTarikh3(
            data.personSekolahWithPopulate.kotakSekolah.adaTiadaQTarikh3
          );
          setTarikh4(data.personSekolahWithPopulate.kotakSekolah.tarikh4);
          setAdaTiadaQTarikh4(
            data.personSekolahWithPopulate.kotakSekolah.adaTiadaQTarikh4
          );
          setRujukGuruKaunseling(
            data.personSekolahWithPopulate.kotakSekolah.rujukGuruKaunseling
          );
          setTarikhQ(data.personSekolahWithPopulate.kotakSekolah.tarikhQ);
          setStatusSelepas6Bulan(
            data.personSekolahWithPopulate.kotakSekolah.statusSelepas6Bulan
          );
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSinglePersonSekolah();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (kotakSekolahId === 'tambah-kotak') {
      await toast
        .promise(
          axios.post(
            `/api/v1/sekolah/kotak/${personSekolahId}`,
            {
              createdByUsername,
              rokokBiasaKotak,
              elektronikVapeKotak,
              shishaKotak,
              lainLainKotak,
              tarikh1,
              adaTiadaQTarikh1,
              tarikh2,
              adaTiadaQTarikh2,
              tarikh3,
              adaTiadaQTarikh3,
              tarikh4,
              adaTiadaQTarikh4,
              rujukGuruKaunseling,
              tarikhQ,
              statusSelepas6Bulan,
            },
            {
              headers: {
                Authorization: `Bearer ${
                  reliefUserToken ? reliefUserToken : userToken
                }`,
              },
            }
          ),
          {
            pending: 'Menghantar...',
            success: 'KOTAK pelajar berjaya dihantar',
            error: 'KOTAK pelajar gagal dihantar',
          },
          {
            autoClose: 2000,
          }
        )
        .then(() => {
          toast.info(`Tab akan ditutup dalam masa 3 saat...`, {
            autoClose: 2000,
          });
          setTimeout(() => {
            window.opener = null;
            window.open('', '_self');
            window.close();
          }, 3000);
        });
    }
    if (kotakSekolahId !== 'tambah-kotak') {
      await toast
        .promise(
          axios.patch(
            `/api/v1/sekolah/kotak/ubah/${kotakSekolahId}`,
            {
              createdByUsername,
              rokokBiasaKotak,
              elektronikVapeKotak,
              shishaKotak,
              lainLainKotak,
              tarikh1,
              adaTiadaQTarikh1,
              tarikh2,
              adaTiadaQTarikh2,
              tarikh3,
              adaTiadaQTarikh3,
              tarikh4,
              adaTiadaQTarikh4,
              rujukGuruKaunseling,
              tarikhQ,
              statusSelepas6Bulan,
            },
            {
              headers: {
                Authorization: `Bearer ${
                  reliefUserToken ? reliefUserToken : userToken
                }`,
              },
            }
          ),
          {
            pending: 'Mengemaskini...',
            success: 'KOTAK pelajar berjaya dikemaskini',
            error: 'KOTAK pelajar gagal dikemaskini',
          },
          {
            autoClose: 2000,
          }
        )
        .then(() => {
          toast.info(`Tab akan ditutup dalam masa 3 saat...`, {
            autoClose: 2000,
          });
          setTimeout(() => {
            window.opener = null;
            window.open('', '_self');
            window.close();
          }, 3000);
        });
    }
  };

  return (
    <>
      <div className='h-full max-h-min p-1 px-2 md:px-10 grid gap-2'>
        <article className='outline outline-1 outline-userBlack grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pb-2'>
          {!isLoading && (
            <div>
              <div className='text-sm font-bold flex flex-row pl-5 p-2'>
                <h1>MAKLUMAT AM PESAKIT</h1>
                <FaInfoCircle
                  className='hover:cursor-pointer m-1 text-lg'
                  onMouseEnter={() => setIsShown(true)}
                  onMouseLeave={() => setIsShown(false)}
                />
              </div>
              {isShown && (
                <div className='z-100 absolute float-right box-border outline outline-1 outline-userBlack left-64 p-5 bg-userWhite '>
                  <div className='text-xs flex flex-row'>
                    <h2 className='font-semibold'>NAMA :</h2>
                    <p className='ml-1'>{singlePersonSekolah.nama}</p>
                  </div>
                  <div className='text-xs flex flex-row '>
                    <h2 className='font-semibold'>NO IC :</h2>
                    <p className='ml-1'>{singlePersonSekolah.ic}</p>
                  </div>
                  <div className='text-xs flex flex-row '>
                    <h2 className='font-semibold'>JANTINA :</h2>
                    <p className='ml-1'>{singlePersonSekolah.jantina}</p>
                  </div>
                  <div className='text-xs flex flex-row '>
                    <h2 className='font-semibold'>TARIKH LAHIR :</h2>
                    <p className='ml-1'>{singlePersonSekolah.tarikhLahir}</p>
                  </div>
                  <div className='text-xs flex flex-row '>
                    <h2 className='font-semibold'>BANGSA :</h2>
                    <p className='ml-1'>{singlePersonSekolah.kumpulanEtnik}</p>
                  </div>
                </div>
              )}
              <div className='flex flex-row pl-5'>
                <h2 className='font-semibold text-xs'>NAMA :</h2>
                <p className='ml-1 text-xs'>{singlePersonSekolah.nama}</p>
              </div>
            </div>
          )}
          {!isLoading && (
            <>
              <div className='md:pt-10'>
                <div className='flex flex-row pl-5'>
                  <h2 className='font-semibold text-xs'>NAMA SEKOLAH :</h2>
                  <p className='ml-1 text-xs'>
                    {singlePersonSekolah.namaSekolah}
                  </p>
                </div>
              </div>
              <div className='lg:pt-10'>
                <div className='flex flex-row pl-5'>
                  <h2 className='font-semibold text-xs'>KELAS :</h2>
                  <p className='ml-1 text-xs'>{singlePersonSekolah.kelas}</p>
                </div>
              </div>
            </>
          )}
          {isLoading && (
            <p className='col-span-3 pt-10 text-sm font-semibold'>Loading...</p>
          )}
        </article>
        <div className='grid h-full overflow-scroll gap-2'>
          <form onSubmit={handleSubmit}>
            <span
              className='flex bg-user3 p-2 w-full capitalize col-span-2'
              title='Program Kesihatan Oral Tanpa Amalan Merokok'
            >
              <p className='ml-3 text-xl font-semibold'>KOTAK</p>
            </span>
            <section className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 mb-3 w-full col-span-2'>
              <article className='grid grid-cols-2 col-span-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold text-base flex flex-row pl-5 col-span-2'>
                  jenis rokok<span className='text-user6'>*</span>
                </h4>
                <div className='flex items-center flex-row pl-5'>
                  <input
                    type='checkbox'
                    name='rokok-biasa-kotak'
                    id='rokok-biasa-kotak'
                    checked={rokokBiasaKotak}
                    onChange={() => {
                      setRokokBiasaKotak(!rokokBiasaKotak);
                    }}
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                  />
                  <label
                    htmlFor='rokok-biasa-kotak'
                    className='m-2 text-sm font-m'
                  >
                    rokok biasa
                  </label>
                </div>
                <div className='flex items-center flex-row pl-5'>
                  <input
                    type='checkbox'
                    name='elektronik-vape-kotak'
                    id='elektronik-vape-kotak'
                    checked={elektronikVapeKotak}
                    onChange={() => {
                      setElektronikVapeKotak(!elektronikVapeKotak);
                    }}
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                  />
                  <label
                    htmlFor='elektronik-vape-kotak'
                    className='m-2 text-sm font-m'
                  >
                    elektronik / vape
                  </label>
                </div>
                <div className='flex items-center flex-row pl-5'>
                  <input
                    type='checkbox'
                    name='shisha-kotak'
                    id='shisha-kotak'
                    checked={shishaKotak}
                    onChange={() => {
                      setShishaKotak(!shishaKotak);
                    }}
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                  />
                  <label htmlFor='shisha-kotak' className='m-2 text-sm font-m'>
                    shisha
                  </label>
                </div>
                <div className='flex items-center flex-row pl-5'>
                  <input
                    type='checkbox'
                    name='lain-lain-kotak'
                    id='lain-lain-kotak'
                    checked={lainLainKotak}
                    onChange={() => {
                      setLainLainKotak(!lainLainKotak);
                    }}
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                  />
                  <label
                    htmlFor='lain-lain-kotak'
                    className='m-2 text-sm font-m'
                  >
                    lain-lain
                  </label>
                </div>
              </article>
              <div className='col-span-2'>
                <article className='flex flex-col gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                  <h4 className='font-bold flex flex-row pl-5 col-span-3'>
                    tarikh intervensi merokok
                  </h4>
                  <div className='flex pl-5 justify-center'>
                    <div className='flex items-center flex-col lg:flex-row '>
                      <p className='flex items-center flex-row lg:justify-center text-sm lg:text-base font-m whitespace-nowrap pr-3'>
                        Sesi 1:
                        <span className='text-user6 text-xl font-semibold'>
                          *
                        </span>
                      </p>
                      <TarikhQ1 />
                    </div>
                    <div className='flex items-center flex-col lg:flex-row pl-5'>
                      <label
                        htmlFor='ada-tiada-q-tarikh1'
                        className='text-xs sm:text-sm font-m pt-2 lg:p-2 '
                      >
                        tarikh berhenti merokok :
                      </label>
                      <div className='flex items-center justify-center'>
                        <input
                          required
                          type='radio'
                          name='ada-tiada-q-tarikh1'
                          id='ada-q-tarikh1'
                          value='ada-q-tarikh1'
                          checked={
                            adaTiadaQTarikh1 === 'ada-q-tarikh1' ? true : false
                          }
                          onChange={(e) => {
                            setAdaTiadaQTarikh1(e.target.value);
                          }}
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='ada-q-tarikh1'
                          className='m-2 text-xs sm:text-sm font-m'
                        >
                          ada
                        </label>
                        <input
                          required
                          type='radio'
                          name='ada-tiada-q-tarikh1'
                          id='tiada-q-tarikh1'
                          value='tiada-q-tarikh1'
                          checked={
                            adaTiadaQTarikh1 === 'tiada-q-tarikh1'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setAdaTiadaQTarikh1(e.target.value);
                          }}
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='tiada-q-tarikh1'
                          className='m-2 text-xs sm:text-sm font-m'
                        >
                          tiada
                        </label>
                      </div>
                    </div>
                  </div>
                  {adaTiadaQTarikh1 === 'tiada-q-tarikh1' && (
                    <div className='flex pl-5 justify-center'>
                      <div className='flex items-center flex-col lg:flex-row'>
                        <p className='flex items-center flex-row lg:justify-center text-sm lg:text-base font-m whitespace-nowrap pr-3'>
                          Sesi 2:
                          {tarikh2 && (
                            <span className='text-user6 text-xl font-semibold'>
                              *
                            </span>
                          )}
                        </p>
                        <TarikhQ2 />
                      </div>
                      <div className='flex items-center flex-col lg:flex-row pl-5'>
                        <label
                          htmlFor='ada-tiada-q-tarikh1'
                          className='text-xs sm:text-sm font-m pt-2 lg:p-2 '
                        >
                          tarikh berhenti merokok :
                        </label>
                        <div className='flex items-center justify-center'>
                          <input
                            required={tarikh2 ? true : false}
                            type='radio'
                            name='ada-tiada-q-tarikh2'
                            id='ada-q-tarikh2'
                            value='ada-q-tarikh2'
                            checked={
                              adaTiadaQTarikh2 === 'ada-q-tarikh2'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              setAdaTiadaQTarikh2(e.target.value);
                            }}
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          />
                          <label
                            htmlFor='ada-q-tarikh2'
                            className='m-2 text-xs sm:text-sm font-m'
                          >
                            ada
                          </label>
                          <input
                            required={tarikh2 ? true : false}
                            type='radio'
                            name='ada-tiada-q-tarikh2'
                            id='tiada-q-tarikh2'
                            value='tiada-q-tarikh2'
                            checked={
                              adaTiadaQTarikh2 === 'tiada-q-tarikh2'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              setAdaTiadaQTarikh2(e.target.value);
                            }}
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          />
                          <label
                            htmlFor='tiada-q-tarikh2'
                            className='m-2 text-xs sm:text-sm font-m'
                          >
                            tiada
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                  {adaTiadaQTarikh2 === 'tiada-q-tarikh2' && (
                    <div className='flex pl-5 justify-center'>
                      <div className='flex items-center flex-col lg:flex-row'>
                        <p className='flex items-center flex-row lg:justify-center text-sm lg:text-base font-m whitespace-nowrap pr-3'>
                          Sesi 3:
                          {tarikh3 && (
                            <span className='text-user6 text-xl font-semibold'>
                              *
                            </span>
                          )}
                        </p>
                        <TarikhQ3 />
                      </div>
                      <div className='flex items-center flex-col lg:flex-row pl-5'>
                        <label
                          htmlFor='ada-tiada-q-tarikh1'
                          className='text-xs sm:text-sm font-m pt-2 lg:p-2 '
                        >
                          tarikh berhenti merokok :
                        </label>
                        <div className='flex items-center justify-center'>
                          <input
                            required={tarikh3 ? true : false}
                            type='radio'
                            name='ada-tiada-q-tarikh3'
                            id='ada-q-tarikh3'
                            value='ada-q-tarikh3'
                            checked={
                              adaTiadaQTarikh3 === 'ada-q-tarikh3'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              setAdaTiadaQTarikh3(e.target.value);
                            }}
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          />
                          <label
                            htmlFor='ada-q-tarikh3'
                            className='m-2 text-xs sm:text-sm font-m'
                          >
                            ada
                          </label>
                          <input
                            required={tarikh3 ? true : false}
                            type='radio'
                            name='ada-tiada-q-tarikh3'
                            id='tiada-q-tarikh3'
                            value='tiada-q-tarikh3'
                            checked={
                              adaTiadaQTarikh3 === 'tiada-q-tarikh3'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              setAdaTiadaQTarikh3(e.target.value);
                            }}
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          />
                          <label
                            htmlFor='tiada-q-tarikh3'
                            className='m-2 text-xs sm:text-sm font-m'
                          >
                            tiada
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                  {adaTiadaQTarikh3 === 'tiada-q-tarikh3' && (
                    <div className='flex pl-5 justify-center'>
                      <div className='flex items-center flex-col lg:flex-row'>
                        <p className='flex items-center flex-row lg:justify-center text-sm lg:text-base font-m whitespace-nowrap pr-3'>
                          Sesi 4:
                          {tarikh3 && (
                            <span className='text-user6 text-xl font-semibold'>
                              *
                            </span>
                          )}
                        </p>
                        <TarikhQ4 />
                      </div>
                      <div className='flex items-center flex-col lg:flex-row pl-5'>
                        <label
                          htmlFor='ada-tiada-q-tarikh1'
                          className='text-xs sm:text-sm font-m pt-2 lg:p-2 '
                        >
                          tarikh berhenti merokok :
                        </label>
                        <div className='flex items-center justify-center'>
                          <input
                            required={tarikh3 ? true : false}
                            type='radio'
                            name='ada-tiada-q-tarikh4'
                            id='ada-q-tarikh4'
                            value='ada-q-tarikh4'
                            checked={
                              adaTiadaQTarikh4 === 'ada-q-tarikh4'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              setAdaTiadaQTarikh4(e.target.value);
                            }}
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          />
                          <label
                            htmlFor='ada-q-tarikh4'
                            className='m-2 text-xs sm:text-sm font-m'
                          >
                            ada
                          </label>
                          <input
                            required={tarikh3 ? true : false}
                            type='radio'
                            name='ada-tiada-q-tarikh4'
                            id='tiada-q-tarikh4'
                            value='tiada-q-tarikh4'
                            checked={
                              adaTiadaQTarikh4 === 'tiada-q-tarikh4'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              setAdaTiadaQTarikh4(e.target.value);
                            }}
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          />
                          <label
                            htmlFor='tiada-q-tarikh4'
                            className='m-2 text-xs sm:text-sm font-m'
                          >
                            tiada
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              </div>
              {adaTiadaQTarikh4 === 'tiada-q-tarikh4' ||
              adaTiadaQTarikh3 === 'tiada-q-tarikh3' ? (
                <article className='grid gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                  <h4 className='font-bold flex flex-row pl-5'>
                    status selepas intervensi
                  </h4>
                  <p className='flex flex-row pl-5 text-sm font-m'>
                    dirujuk kepada guru kaunseling
                  </p>
                  <div className='flex items-center justify-center'>
                    <input
                      required={
                        adaTiadaQTarikh4 == 'tiada-q-tarikh4' ? true : false
                      }
                      type='radio'
                      name='rujuk-guru-kaunseling'
                      id='ya-rujuk-guru-kaunseling'
                      value='ya-rujuk-guru-kaunseling'
                      checked={
                        rujukGuruKaunseling === 'ya-rujuk-guru-kaunseling'
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        setRujukGuruKaunseling(e.target.value);
                      }}
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                    />
                    <label
                      htmlFor='ya-rujuk-guru-kaunseling'
                      className='m-2 text-sm font-m'
                    >
                      Ya
                    </label>
                    <input
                      required={
                        adaTiadaQTarikh4 == 'tiada-q-tarikh4' ? true : false
                      }
                      type='radio'
                      name='rujuk-guru-kaunseling'
                      id='tidak-rujuk-guru-kaunseling'
                      value='tidak-rujuk-guru-kaunseling'
                      checked={
                        rujukGuruKaunseling === 'tidak-rujuk-guru-kaunseling'
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        setRujukGuruKaunseling(e.target.value);
                      }}
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                    />
                    <label
                      htmlFor='tidak-rujuk-guru-kaunseling'
                      className='m-2 text-sm font-m'
                    >
                      Tidak
                    </label>
                  </div>
                </article>
              ) : null}
              {adaTiadaQTarikh1 === 'ada-q-tarikh1' ||
              adaTiadaQTarikh2 === 'ada-q-tarikh2' ||
              adaTiadaQTarikh3 === 'ada-q-tarikh3' ||
              adaTiadaQTarikh4 === 'ada-q-tarikh4' ? (
                <article className='flex flex-col border border-userBlack pl-3 p-2 rounded-md col-span-2 md:col-span-1'>
                  <h4 className='font-bold flex flex-row pl-5 whitespace-nowrap p-2'>
                    tarikh quit date
                  </h4>
                  <TarikhQ />
                  {/* <input
                    type='date'
                    name='tarikhQ'
                    id='tarikhQ'
                    value={tarikhQ}
                    onChange={(e) => {
                      setTarikhQ(e.target.value);
                    }}
                    className='outline outline-1 outline-userBlack m-2 text-sm font-m ml-3'
                  /> */}
                </article>
              ) : null}
              {adaTiadaQTarikh1 === 'ada-q-tarikh1' ||
              adaTiadaQTarikh2 === 'ada-q-tarikh2' ||
              adaTiadaQTarikh3 === 'ada-q-tarikh3' ||
              adaTiadaQTarikh4 === 'ada-q-tarikh4' ? (
                <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md col-span-2 md:col-span-1'>
                  <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                    status selepas 6 bulan
                  </h4>
                  <select
                    name='status-selepas-6-bulan-kotak'
                    id='status-selepas-6-bulan-kotak'
                    value={statusSelepas6Bulan}
                    onChange={(e) => {
                      setStatusSelepas6Bulan(e.target.value);
                    }}
                    className='outline outline-1 outline-userBlack w-30 m-3 text-sm font-m'
                  >
                    <option value=''></option>
                    <option value='berhenti'>berhenti merokok</option>
                    <option value='tidakberhenti'>
                      tidak berhenti merokok
                    </option>
                  </select>
                </article>
              ) : null}
            </section>
            <div className='grid grid-cols-1 md:grid-cols-3 col-start-1 lg:col-start-2 gap-2 col-span-1 md:col-span-2'>
              <span
                onClick={() => {
                  window.opener = null;
                  window.open('', '_self');
                  window.close();
                }}
                className='flex bg-user3 p-2 w-full capitalize justify-center hover:bg-user1 hover:text-userWhite transition-all hover:cursor-pointer'
              >
                tutup
              </span>
              <input
                type='reset'
                value='reset'
                className='flex bg-user3 p-2 w-full capitalize justify-center hover:bg-user1 hover:text-userWhite transition-all hover:cursor-pointer'
              />
              <button
                type='submit'
                className='flex bg-user3 p-2 w-full capitalize justify-center hover:bg-user1 hover:text-userWhite transition-all'
              >
                hantar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default UserFormSekolahKOTAK;
