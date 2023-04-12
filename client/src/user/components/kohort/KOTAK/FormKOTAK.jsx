import { useState, useEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';
import moment from 'moment';

import ConfirmCheck from './ConfirmationKOTAK';

import { useGlobalUserAppContext } from '../../../context/userAppContext';

function UserFormKohortKOTAK() {
  const {
    userToken,
    reliefUserToken,
    username,
    useParams,
    masterDatePicker,
    toast,
  } = useGlobalUserAppContext();

  const { personKohortKotakId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isShown, setIsShown] = useState(false);
  const [singlePersonKohortKotak, setSinglePersonKohortKotak] = useState([]);
  const [statusKotak, setStatusKotak] = useState('');
  const [isJenisRokokRequired, setIsJenisRokokRequired] = useState(true);

  //confirm data
  const [confirmData, setConfirmData] = useState({});

  const createdByUsername = username;
  const [dalamPemantauanKohort, setDalamPemantauanKohort] = useState('');
  const [statusM, setStatusM] = useState('');
  const [inginMelakukanIntervensiMerokok, setInginMelakukanIntervensiMerokok] =
    useState('');
  const [menerimaNasihatRingkas, setMenerimaNasihatRingkas] = useState('');
  const [rokokBiasaKotak, setRokokBiasaKotak] = useState(false);
  const [elektronikVapeKotak, setElektronikVapeKotak] = useState(false);
  const [shishaKotak, setShishaKotak] = useState(false);
  const [lainLainKotak, setLainLainKotak] = useState(false);
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
  const [noTel2, setNoTel2] = useState('');
  const [noTel3, setNoTel3] = useState('');
  const [statusSelepas6Bulan, setStatusSelepas6Bulan] = useState('');

  // datepicker issue
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
        setConfirmData({
          ...confirmData,
          tarikh1: moment(date).format('YYYY-MM-DD'),
        });
      },
      required: true,
      filterDate: (date) => {
        return moment() > date;
      },
      disabled: statusKotak !== 'tambah kotak' ? true : false,
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
        setConfirmData({
          ...confirmData,
          tarikh2: moment(date).format('YYYY-MM-DD'),
        });
      },
      filterDate: (date) => {
        return moment() > date;
      },
      disabled: tarikh1 !== '' && tarikh3 === '' ? false : true,
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
        setConfirmData({
          ...confirmData,
          tarikh3: moment(date).format('YYYY-MM-DD'),
        });
      },
      filterDate: (date) => {
        return moment() > date;
      },
      disabled:
        (tarikh1 === '' && tarikh2 === '') || (tarikh1 !== '' && tarikh2 === '')
          ? true
          : false,
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
        setConfirmData({
          ...confirmData,
          tarikhQ: moment(date).format('YYYY-MM-DD'),
        });
      },
      className:
        'appearance-none w-36 text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md uppercase flex flex-row ml-5',
    });
  };

  //reset value
  useEffect(() => {
    if (
      statusM === 'perokok-pasif' ||
      statusM === 'bekas-perokok' ||
      statusM === 'bukan-perokok' ||
      statusM === ''
    ) {
      setInginMelakukanIntervensiMerokok('');
    }
    // if (adaTiadaQTarikh1 === 'ada-q-tarikh1') {
    //   setTarikh2('');
    //   setTarikhQ2DP(null);
    //   setAdaTiadaQTarikh2('');
    //   setTarikh3('');
    //   setAdaTiadaQTarikh3('');
    //   setTarikhQ3DP(null);
    //   setTarikh4('');
    //   setAdaTiadaQTarikh4('');
    //   setTarikhQ4DP(null);
    // }
    // if (adaTiadaQTarikh2 === 'ada-q-tarikh2') {
    //   setTarikh3('');
    //   setAdaTiadaQTarikh3('');
    //   setTarikhQ3DP(null);
    //   setTarikh4('');
    //   setAdaTiadaQTarikh4('');
    //   setTarikhQ4DP(null);
    // }
    // if (adaTiadaQTarikh3 === 'ada-q-tarikh3') {
    //   setTarikh4('');
    //   setAdaTiadaQTarikh4('');
    //   setTarikhQ4DP(null);
    // }
    // if (adaTiadaQTarikh1 === 'tiada-q-tarikh1') {
    //   setTarikhQ('');
    //   setTarikhQDP(null);
    //   setStatusSelepas6Bulan('');
    // }
    // if (adaTiadaQTarikh2 === 'tiada-q-tarikh2') {
    //   setTarikhQ('');
    //   setTarikhQDP(null);
    //   setStatusSelepas6Bulan('');
    // }
    // if (adaTiadaQTarikh3 === 'tiada-q-tarikh3') {
    //   setTarikhQ('');
    //   setTarikhQDP(null);
    //   setStatusSelepas6Bulan('');
    //   setRujukGuruKaunseling('');
    // }
    // if (adaTiadaQTarikh4 === 'tiada-q-tarikh4') {
    //   setTarikhQ('');
    //   setTarikhQDP(null);
    //   setStatusSelepas6Bulan('');
    //   setRujukGuruKaunseling('');
    // }
  }, [
    statusM,
    adaTiadaQTarikh1,
    adaTiadaQTarikh2,
    adaTiadaQTarikh3,
    adaTiadaQTarikh4,
    tarikhQ2DP,
    tarikhQ3DP,
    tarikhQ4DP,
  ]);

  // set isJenisRokokRequired to true or false
  useEffect(() => {
    if (
      rokokBiasaKotak ||
      elektronikVapeKotak ||
      shishaKotak ||
      lainLainKotak
    ) {
      setIsJenisRokokRequired(false);
    }
    if (
      !rokokBiasaKotak &&
      !elektronikVapeKotak &&
      !shishaKotak &&
      !lainLainKotak
    ) {
      setIsJenisRokokRequired(true);
    }
  }, [rokokBiasaKotak, elektronikVapeKotak, shishaKotak, lainLainKotak]);

  // fetch singlePersonKohortKotak
  useEffect(() => {
    const fetchSinglePersonKohortKotak = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `/api/v1/kohort/kotak/${personKohortKotakId}`,
          {
            headers: {
              Authorization: `Bearer ${
                reliefUserToken ? reliefUserToken : userToken
              }`,
            },
          }
        );
        setSinglePersonKohortKotak(data.singlePersonKohortKotak);
        setStatusKotak(data.singlePersonKohortKotak.statusKotak);
        // map to form if status kotak tak sama dengan tambah kotak
        if (statusKotak !== 'tambah kotak') {
          setDalamPemantauanKohort(
            data.singlePersonKohortKotak.dalamPemantauanKohort
          );
          setStatusM(data.singlePersonKohortKotak.statusM);
          setMenerimaNasihatRingkas(
            data.singlePersonKohortKotak.menerimaNasihatRingkas
          );
          setInginMelakukanIntervensiMerokok(
            data.singlePersonKohortKotak.inginMelakukanIntervensiMerokok
          );
          setRokokBiasaKotak(data.singlePersonKohortKotak.rokokBiasaKotak);
          setElektronikVapeKotak(
            data.singlePersonKohortKotak.elektronikVapeKotak
          );
          setShishaKotak(data.singlePersonKohortKotak.shishaKotak);
          setLainLainKotak(data.singlePersonKohortKotak.lainLainKotak);
          setTarikh1(data.singlePersonKohortKotak.tarikhIntervensi1);
          setAdaTiadaQTarikh1(data.singlePersonKohortKotak.adaTiadaQTarikh1);
          setTarikh2(data.singlePersonKohortKotak.tarikhIntervensi2);
          setAdaTiadaQTarikh2(data.singlePersonKohortKotak.adaTiadaQTarikh2);
          setTarikh3(data.singlePersonKohortKotak.tarikhIntervensi3);
          setAdaTiadaQTarikh3(data.singlePersonKohortKotak.adaTiadaQTarikh3);
          setTarikh4(data.singlePersonKohortKotak.tarikhIntervensi4);
          setAdaTiadaQTarikh4(data.singlePersonKohortKotak.adaTiadaQTarikh4);
          setRujukGuruKaunseling(
            data.singlePersonKohortKotak.rujukGuruKaunseling
          );
          setTarikhQ(data.singlePersonKohortKotak.tarikhQ);
          setStatusSelepas6Bulan(
            data.singlePersonKohortKotak.statusSelepas6Bulan
          );
          // datepicker issue
          if (data.singlePersonKohortKotak.tarikhIntervensi1 !== '') {
            setTarikhQ1DP(
              new Date(data.singlePersonKohortKotak.tarikhIntervensi1)
            );
          }
          if (data.singlePersonKohortKotak.tarikhIntervensi2 !== '') {
            setTarikhQ2DP(
              new Date(data.singlePersonKohortKotak.tarikhIntervensi2)
            );
          }
          if (data.singlePersonKohortKotak.tarikhIntervensi3 !== '') {
            setTarikhQ3DP(
              new Date(data.singlePersonKohortKotak.tarikhIntervensi3)
            );
          }
          if (data.singlePersonKohortKotak.tarikhIntervensi4 !== '') {
            setTarikhQ4DP(
              new Date(data.singlePersonKohortKotak.tarikhIntervensi4)
            );
          }
          if (data.singlePersonKohortKotak.tarikhQ !== '') {
            setTarikhQDP(new Date(data.singlePersonKohortKotak.tarikhQ));
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        // toast.error(
        //   'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: user-form-sekolah-kotak-fetchsinglePersonKohortKotak'
        // );
      }
    };
    fetchSinglePersonKohortKotak();
  }, []);

  const handleSubmit = async () => {
    let statusKotak = '';
    if (tarikh1 !== '') {
      statusKotak = 'selesai sesi 1';
    }
    if (tarikh2 !== '') {
      statusKotak = 'selesai sesi 2';
    }
    if (tarikh3 !== '') {
      statusKotak = 'selesai sesi 3';
    }
    await toast
      .promise(
        axios.patch(
          `/api/v1/kohort/kotak/${personKohortKotakId}`,
          {
            createdByUsername,
            statusKotak,
            dalamPemantauanKohort,
            statusM,
            menerimaNasihatRingkas,
            inginMelakukanIntervensiMerokok,
            rokokBiasaKotak,
            elektronikVapeKotak,
            shishaKotak,
            lainLainKotak,
            tarikhIntervensi1: tarikh1,
            adaTiadaQTarikh1,
            tarikhIntervensi2: tarikh2,
            adaTiadaQTarikh2,
            tarikhIntervensi3: tarikh3,
            adaTiadaQTarikh3,
            tarikhIntervensi4: tarikh4,
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
  };

  return (
    <ConfirmCheck callbackFx={handleSubmit} data={confirmData}>
      {(confirm) => (
        <>
          <div className='h-full max-h-min p-1 px-2 md:px-10 grid gap-2 grid-rows-[1fr_7fr]'>
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
                        <p className='ml-1'>{singlePersonKohortKotak.nama}</p>
                      </div>
                      <div className='text-xs flex flex-row '>
                        <h2 className='font-semibold'>NO IC :</h2>
                        <p className='ml-1'>{singlePersonKohortKotak.ic}</p>
                      </div>
                      <div className='text-xs flex flex-row '>
                        <h2 className='font-semibold'>JANTINA :</h2>
                        <p className='ml-1'>
                          {singlePersonKohortKotak.jantina}
                        </p>
                      </div>
                      <div className='text-xs flex flex-row '>
                        <h2 className='font-semibold'>TARIKH LAHIR :</h2>
                        <p className='ml-1'>
                          {singlePersonKohortKotak.tarikhLahir}
                        </p>
                      </div>
                      <div className='text-xs flex flex-row '>
                        <h2 className='font-semibold'>BANGSA :</h2>
                        <p className='ml-1'>
                          {singlePersonKohortKotak.kumpulanEtnik}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className='flex flex-row pl-5'>
                    <h2 className='font-semibold text-xs'>NAMA :</h2>
                    <p className='ml-1 text-xs'>
                      {singlePersonKohortKotak.nama}
                    </p>
                  </div>
                </div>
              )}
              {!isLoading && (
                <>
                  <div className='md:pt-10'>
                    <div className='flex flex-row pl-5'>
                      <h2 className='font-semibold text-xs'>NAMA SEKOLAH :</h2>
                      <p className='ml-1 text-xs'>
                        {singlePersonKohortKotak.namaSekolah}
                      </p>
                    </div>
                  </div>
                  <div className='lg:pt-10'>
                    <div className='flex flex-row pl-5'>
                      <h2 className='font-semibold text-xs'>KELAS :</h2>
                      <p className='ml-1 text-xs'>
                        {singlePersonKohortKotak.kelas}
                      </p>
                    </div>
                  </div>
                </>
              )}
              {isLoading && (
                <>
                  <div className='grid grid-rows-2 col-span-1 md:col-span-2 lg:col-span-3 px-2'>
                    <div className='animate-pulse w-32 h-2 bg-user1 bg-opacity-20 flex justify-center items-center m-1 p-2 rounded-lg'></div>
                    <div className='animate-pulse w-full h-2 bg-user1 bg-opacity-20 flex justify-center items-center m-1 p-2 rounded-lg'></div>
                  </div>
                </>
              )}
            </article>
            <div className='grid h-full overflow-scroll gap-2'>
              <form onSubmit={confirm(handleSubmit)}>
                <span
                  className='flex bg-user3 p-2 w-full capitalize col-span-2'
                  title='Program Kesihatan Oral Tanpa Amalan Merokok'
                >
                  <p className='ml-3 text-xl font-semibold'>Program KOTAK</p>
                </span>
                <section className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 mb-3 w-full col-span-2'>
                  {/* <article className='grid grid-cols-2 auto-rows-min gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                      Program KOTAK<span className='text-user6'>*</span>
                    </h4>
                    <div className='flex flex-row items-center text-sm font-m col-span-2'>
                      <p className='flex flex-row pl-5 '>
                        dalam pemantauan kohort
                        <span className='text-user6'>*</span>
                      </p>
                      <div className='flex items-center justify-center ml-2'>
                        <input
                          required
                          type='radio'
                          name='dalam-pemantauan-kohort'
                          id='ya-dalam-pemantauan-kohort'
                          value='ya-dalam-pemantauan-kohort'
                          checked={
                            dalamPemantauanKohort ===
                            'ya-dalam-pemantauan-kohort'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setDalamPemantauanKohort(e.target.value);
                            setConfirmData({
                              ...confirmData,
                              dalamPemantauanKohort: e.target.value,
                            });
                          }}
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='ya-dalam-pemantauan-kohort'
                          className='m-2 text-sm font-m'
                        >
                          Ya
                        </label>
                        <input
                          required
                          type='radio'
                          name='dalam-pemantauan-kohort'
                          id='tidak-dalam-pemantauan-kohort'
                          value='tidak-dalam-pemantauan-kohort'
                          checked={
                            dalamPemantauanKohort ===
                            'tidak-dalam-pemantauan-kohort'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setDalamPemantauanKohort(e.target.value);
                            setConfirmData({
                              ...confirmData,
                              dalamPemantauanKohort: e.target.value,
                            });
                          }}
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='tidak-dalam-pemantauan-kohort'
                          className='m-2 text-sm font-m'
                        >
                          Tidak
                        </label>
                      </div>
                    </div>
                    {dalamPemantauanKohort ===
                      'tidak-dalam-pemantauan-kohort' && (
                      <div className='flex flex-col pl-5 col-span-2'>
                        <h4 className='font-bold flex flex-row'>
                          status merokok<span className='text-user6'>*</span>
                        </h4>
                        <select
                          required
                          name='statusM'
                          id='statusM'
                          value={statusM}
                          onChange={(e) => {
                            setStatusM(e.target.value);
                            setConfirmData({
                              ...confirmData,
                              statusM: e.target.value,
                            });
                          }}
                          className='outline outline-1 outline-userBlack w-32 my-1 text-sm font-normal'
                        >
                          <option value=''></option>
                          <option value='perokok-semasa'>Perokok Semasa</option>
                          <option value='bekas-perokok'>Bekas Perokok</option>
                          <option value='perokok-pasif'>Perokok Pasif</option>
                          <option value='bukan-perokok'>Bukan Perokok</option>
                        </select>
                      </div>
                    )}
                    <div className='col-span-2 flex flex-row'>
                      <p className='flex items-center pl-5 text-sm font-m col-span-2'>
                        adakah pesakit menerima nasihat ringkas?
                        <span className='text-user6'>*</span>
                      </p>
                      <div className='flex items-center pl-5'>
                        <input
                          required
                          type='radio'
                          name='menerima-nasihat-ringkas'
                          id='ya-menerima-nasihat-ringkas'
                          value='ya-menerima-nasihat-ringkas'
                          checked={
                            menerimaNasihatRingkas ===
                            'ya-menerima-nasihat-ringkas'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setMenerimaNasihatRingkas(e.target.value);
                            setConfirmData({
                              ...confirmData,
                              menerimaNasihatRingkas: e.target.value,
                            });
                          }}
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='ya-menerima-nasihat-ringkas'
                          className='m-2 text-sm font-m'
                        >
                          Ya
                        </label>
                        <input
                          required={statusM === 'perokok-semasa' ? true : false}
                          type='radio'
                          name='menerima-nasihat-ringkas'
                          id='tidak-menerima-nasihat-ringkas'
                          value='tidak-menerima-nasihat-ringkas'
                          checked={
                            menerimaNasihatRingkas ===
                            'tidak-menerima-nasihat-ringkas'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setMenerimaNasihatRingkas(e.target.value);
                            setConfirmData({
                              ...confirmData,
                              menerimaNasihatRingkas: e.target.value,
                            });
                          }}
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='tidak-menerima-nasihat-ringkas'
                          className='m-2 text-sm font-m'
                        >
                          Tidak
                        </label>
                      </div>
                    </div>
                    <div
                      className={`${
                        statusM === 'perokok-semasa' ? 'visible' : 'hidden'
                      } col-span-2`}
                    >
                      <p className='flex items-center justify-center pl-5 text-sm font-m col-span-2'>
                        ingin melakukan intervensi merokok?
                        <span className='text-user6'>*</span>
                      </p>
                      <div className='flex items-center justify-center'>
                        <input
                          required={statusM === 'perokok-semasa' ? true : false}
                          type='radio'
                          name='ingin-melakukan-intervensi-merokok'
                          id='ya-ingin-melakukan-intervensi-merokok'
                          value='ya-ingin-melakukan-intervensi-merokok'
                          checked={
                            inginMelakukanIntervensiMerokok ===
                            'ya-ingin-melakukan-intervensi-merokok'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setInginMelakukanIntervensiMerokok(e.target.value);
                            setConfirmData({
                              ...confirmData,
                              inginMelakukanIntervensiMerokok: e.target.value,
                            });
                          }}
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='ya-ingin-melakukan-intervensi-merokok'
                          className='m-2 text-sm font-m'
                        >
                          Ya
                        </label>
                        <input
                          required={statusM === 'perokok-semasa' ? true : false}
                          type='radio'
                          name='ingin-melakukan-intervensi-merokok'
                          id='tidak-ingin-melakukan-intervensi-merokok'
                          value='tidak-ingin-melakukan-intervensi-merokok'
                          checked={
                            inginMelakukanIntervensiMerokok ===
                            'tidak-ingin-melakukan-intervensi-merokok'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setInginMelakukanIntervensiMerokok(e.target.value);
                            setConfirmData({
                              ...confirmData,
                              inginMelakukanIntervensiMerokok: e.target.value,
                            });
                          }}
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='tidak-ingin-melakukan-intervensi-merokok'
                          className='m-2 text-sm font-m'
                        >
                          Tidak
                        </label>
                      </div>
                    </div>
                  </article> */}
                  <div className='col-span-2'>
                    <article className='flex flex-col gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                      <h4 className='font-bold flex flex-row pl-5 col-span-3'>
                        Nombor Telefon Untuk Dihubungi
                      </h4>
                      <div className='flex pl-5 justify-center'>
                        <div className='flex items-center flex-col lg:flex-row mx-2'>
                          <p className='flex items-center flex-row lg:justify-center text-sm lg:text-base font-m whitespace-nowrap pr-3'>
                            No. Telefon 1:
                            <span className='text-user6 text-xl font-semibold'>
                              *
                            </span>
                          </p>
                          <input
                            readOnly
                            type='text'
                            pattern='[0-9]+'
                            title='Nombor telefon'
                            name='no-tel-1'
                            id='no-tel-1'
                            value={singlePersonKohortKotak.noTelefon}
                            className='w-40 h-10 border border-userBlack rounded-md pl-2 focus:outline-none'
                            placeholder='0123456678'
                          />
                        </div>
                        <div className='flex items-center flex-col lg:flex-row mx-2'>
                          <p className='flex items-center flex-row lg:justify-center text-sm lg:text-base font-m whitespace-nowrap pr-3'>
                            No. Telefon 2:
                          </p>
                          <input
                            type='text'
                            pattern='[0-9]+'
                            title='Nombor telefon'
                            name='no-tel-2'
                            id='no-tel-2'
                            value={noTel2}
                            onChange={(e) => {
                              setNoTel2(e.target.value);
                              setConfirmData({
                                ...confirmData,
                                noTel2: e.target.value,
                              });
                            }}
                            className='w-40 h-10 border border-userBlack rounded-md pl-2'
                            placeholder='0123456678'
                          />
                        </div>
                        <div className='flex items-center flex-col lg:flex-row mx-2'>
                          <p className='flex items-center flex-row lg:justify-center text-sm lg:text-base font-m whitespace-nowrap pr-3'>
                            No. Telefon 3:
                          </p>
                          <input
                            type='text'
                            pattern='[0-9]+'
                            title='Nombor telefon'
                            name='no-tel-3'
                            id='no-tel-3'
                            value={noTel3}
                            onChange={(e) => {
                              setNoTel3(e.target.value);
                              setConfirmData({
                                ...confirmData,
                                noTel3: e.target.value,
                              });
                            }}
                            className='w-40 h-10 border border-userBlack rounded-md pl-2'
                            placeholder='0123456678'
                          />
                        </div>
                      </div>
                    </article>
                  </div>
                  {dalamPemantauanKohort !== 'ya-dalam-pemantauan-kohort' ? (
                    <div className='col-span-2 grid grid-cols-1 lg:grid-cols-3 gap-2'>
                      <article className='grid grid-cols-1 col-span-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                        <h4 className='font-bold flex flex-row pl-5'>
                          tarikh intervensi dilaksanakan
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
                              tarikh rancang berhenti merokok :
                            </label>
                            <div className='flex items-center justify-center'>
                              <input
                                required
                                disabled={tarikh1 === '' ? true : false}
                                type='radio'
                                name='ada-tiada-q-tarikh1'
                                id='ada-q-tarikh1'
                                value='ada-q-tarikh1'
                                checked={
                                  adaTiadaQTarikh1 === 'ada-q-tarikh1'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setAdaTiadaQTarikh1(e.target.value);
                                  setConfirmData({
                                    ...confirmData,
                                    adaTiadaQTarikh1: e.target.value,
                                  });
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
                                disabled={tarikh1 === '' ? true : false}
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
                                  setConfirmData({
                                    ...confirmData,
                                    adaTiadaQTarikh1: e.target.value,
                                  });
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
                              tarikh rancang berhenti merokok :
                            </label>
                            <div className='flex items-center justify-center'>
                              <input
                                required={tarikh2 ? true : false}
                                disabled={tarikh2 === '' ? true : false}
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
                                  setConfirmData({
                                    ...confirmData,
                                    adaTiadaQTarikh2: e.target.value,
                                  });
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
                                disabled={tarikh2 === '' ? true : false}
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
                                  setConfirmData({
                                    ...confirmData,
                                    adaTiadaQTarikh2: e.target.value,
                                  });
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
                              tarikh rancang berhenti merokok :
                            </label>
                            <div className='flex items-center justify-center'>
                              <input
                                required={tarikh3 ? true : false}
                                disabled={tarikh3 === '' ? true : false}
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
                                  setConfirmData({
                                    ...confirmData,
                                    adaTiadaQTarikh3: e.target.value,
                                  });
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
                                disabled={tarikh3 === '' ? true : false}
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
                                  setConfirmData({
                                    ...confirmData,
                                    adaTiadaQTarikh3: e.target.value,
                                  });
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
                      </article>
                      <article className='grid gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                        <h4 className='font-bold text-base flex flex-row text-left '>
                          jenis rokok (hanya dilengkapkan setelah menjalani
                          intervensi sesi 1)
                          <strong className='text-user6'>*</strong>{' '}
                        </h4>
                        <div className='flex items-center flex-row pl-5'>
                          <input
                            type='checkbox'
                            name='rokok-biasa-kotak'
                            id='rokok-biasa-kotak'
                            required={isJenisRokokRequired}
                            checked={rokokBiasaKotak}
                            onChange={() => {
                              setRokokBiasaKotak(!rokokBiasaKotak);
                              setConfirmData({
                                ...confirmData,
                                rokokBiasaKotak: !rokokBiasaKotak,
                              });
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
                            required={isJenisRokokRequired}
                            checked={elektronikVapeKotak}
                            onChange={() => {
                              setElektronikVapeKotak(!elektronikVapeKotak);
                              setConfirmData({
                                ...confirmData,
                                elektronikVapeKotak: !elektronikVapeKotak,
                              });
                            }}
                            className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                          />
                          <label
                            htmlFor='elektronik-vape-kotak'
                            className='m-2 text-sm font-m'
                          >
                            peranti rokok elektronik / <i>Vape</i>
                          </label>
                        </div>
                        <div className='flex items-center flex-row pl-5'>
                          <input
                            type='checkbox'
                            name='shisha-kotak'
                            id='shisha-kotak'
                            required={isJenisRokokRequired}
                            checked={shishaKotak}
                            onChange={() => {
                              setShishaKotak(!shishaKotak);
                              setConfirmData({
                                ...confirmData,
                                shishaKotak: !shishaKotak,
                              });
                            }}
                            className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                          />
                          <label
                            htmlFor='shisha-kotak'
                            className='m-2 text-sm font-m'
                          >
                            shisha
                          </label>
                        </div>
                        <div className='flex items-center flex-row pl-5'>
                          <input
                            type='checkbox'
                            name='lain-lain-kotak'
                            id='lain-lain-kotak'
                            required={isJenisRokokRequired}
                            checked={lainLainKotak}
                            onChange={() => {
                              setLainLainKotak(!lainLainKotak);
                              setConfirmData({
                                ...confirmData,
                                lainLainKotak: !lainLainKotak,
                              });
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
                    </div>
                  ) : null}
                  {adaTiadaQTarikh4 === 'tiada-q-tarikh4' ||
                  adaTiadaQTarikh3 === 'tiada-q-tarikh3' ? (
                    <article className='grid gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                      <h4 className='font-bold flex flex-row pl-5'>
                        tindakan selepas intervensi sesi 3
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
                            setConfirmData({
                              ...confirmData,
                              rujukGuruKaunseling: e.target.value,
                            });
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
                            rujukGuruKaunseling ===
                            'tidak-rujuk-guru-kaunseling'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setRujukGuruKaunseling(e.target.value);
                            setConfirmData({
                              ...confirmData,
                              rujukGuruKaunseling: e.target.value,
                            });
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
                  {dalamPemantauanKohort === 'ya-dalam-pemantauan-kohort' ||
                  adaTiadaQTarikh1 === 'ada-q-tarikh1' ||
                  adaTiadaQTarikh2 === 'ada-q-tarikh2' ||
                  adaTiadaQTarikh3 === 'ada-q-tarikh3' ||
                  adaTiadaQTarikh4 === 'ada-q-tarikh4' ? (
                    <article className='flex flex-col border border-userBlack pl-3 p-2 rounded-md col-span-2 md:col-span-1'>
                      <h4 className='font-bold flex flex-row pl-5 whitespace-nowrap p-2'>
                        tarikh rancang berhenti merokok
                      </h4>
                      <TarikhQ />
                    </article>
                  ) : null}
                  {dalamPemantauanKohort === 'ya-dalam-pemantauan-kohort' ||
                  adaTiadaQTarikh1 === 'ada-q-tarikh1' ||
                  adaTiadaQTarikh2 === 'ada-q-tarikh2' ||
                  adaTiadaQTarikh3 === 'ada-q-tarikh3' ||
                  adaTiadaQTarikh4 === 'ada-q-tarikh4' ? (
                    <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md col-span-2 md:col-span-1 auto-rows-min'>
                      <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                        status selepas 6 bulan daripada tarikh kehadiran
                        intervensi sesi 1
                      </h4>
                      <select
                        name='status-selepas-6-bulan-kotak'
                        id='status-selepas-6-bulan-kotak'
                        value={statusSelepas6Bulan}
                        onChange={(e) => {
                          setStatusSelepas6Bulan(e.target.value);
                          setConfirmData({
                            ...confirmData,
                            statusSelepas6Bulan: e.target.value,
                          });
                        }}
                        className='outline outline-1 outline-userBlack w-30 m-3 text-sm font-m'
                      >
                        <option value=''></option>
                        <option value='berhenti'>Berhenti Merokok</option>
                        <option value='tidakberhenti'>
                          Tidak Berhenti Merokok
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
      )}
    </ConfirmCheck>
  );
}

export default UserFormKohortKOTAK;
