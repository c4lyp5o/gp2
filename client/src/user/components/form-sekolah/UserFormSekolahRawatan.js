import { useState, useEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';
import { Spinner } from 'react-awesome-spinners';
import moment from 'moment';

import ConfirmCheck from './ConfirmationRawatan';

import { useGlobalUserAppContext } from '../../context/userAppContext';

function UserFormSekolahRawatan() {
  const {
    userToken,
    reliefUserToken,
    dateToday,
    username,
    useParams,
    masterDatePicker,
    toast,
  } = useGlobalUserAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isShown, setIsShown] = useState(false);
  const [singlePersonSekolah, setSinglePersonSekolah] = useState([]);

  const { personSekolahId } = useParams();

  //confirm data
  const [confirmData, setConfirmData] = useState({});

  const createdByUsername = username;
  const [tarikhRawatanSemasa, setTarikhRawatanSemasa] = useState('');
  const [engganTidakHadirRawatan, setEngganTidakHadirRawatan] = useState('');
  const [muridDibuatFs, setMuridDibuatFs] = useState(false);
  const [baruJumlahGigiKekalDibuatFs, setBaruJumlahGigiKekalDibuatFs] =
    useState(0);
  const [muridDiberiFv, setMuridDiberiFv] = useState(false);
  const [baruJumlahGigiKekalDiberiFv, setBaruJumlahGigiKekalDiberiFv] =
    useState(0);
  const [muridDiberiPrrJenis1, setMuridDiberiPrrJenis1] = useState(false);
  const [
    baruJumlahGigiKekalDiberiPrrJenis1,
    setBaruJumlahGigiKekalDiberiPrrJenis1,
  ] = useState(0);
  const [baruJumlahGigiYangDiberiSdf, setBaruJumlahGigiYangDiberiSdf] =
    useState(0);
  const [semulaJumlahGigiYangDiberiSdf, setSemulaJumlahGigiYangDiberiSdf] =
    useState(0);
  const [
    gdBaruAnteriorSewarnaJumlahTampalanDibuat,
    setGdBaruAnteriorSewarnaJumlahTampalanDibuat,
  ] = useState(0);
  const [
    gdSemulaAnteriorSewarnaJumlahTampalanDibuat,
    setGdSemulaAnteriorSewarnaJumlahTampalanDibuat,
  ] = useState(0);
  const [
    gkBaruAnteriorSewarnaJumlahTampalanDibuat,
    setGkBaruAnteriorSewarnaJumlahTampalanDibuat,
  ] = useState(0);
  const [
    gkSemulaAnteriorSewarnaJumlahTampalanDibuat,
    setGkSemulaAnteriorSewarnaJumlahTampalanDibuat,
  ] = useState(0);
  const [
    gdBaruPosteriorSewarnaJumlahTampalanDibuat,
    setGdBaruPosteriorSewarnaJumlahTampalanDibuat,
  ] = useState(0);
  const [
    gdSemulaPosteriorSewarnaJumlahTampalanDibuat,
    setGdSemulaPosteriorSewarnaJumlahTampalanDibuat,
  ] = useState(0);
  const [
    gkBaruPosteriorSewarnaJumlahTampalanDibuat,
    setGkBaruPosteriorSewarnaJumlahTampalanDibuat,
  ] = useState(0);
  const [
    gkSemulaPosteriorSewarnaJumlahTampalanDibuat,
    setGkSemulaPosteriorSewarnaJumlahTampalanDibuat,
  ] = useState(0);
  const [
    gdBaruPosteriorAmalgamJumlahTampalanDibuat,
    setGdBaruPosteriorAmalgamJumlahTampalanDibuat,
  ] = useState(0);
  const [
    gdSemulaPosteriorAmalgamJumlahTampalanDibuat,
    setGdSemulaPosteriorAmalgamJumlahTampalanDibuat,
  ] = useState(0);
  const [
    gkBaruPosteriorAmalgamJumlahTampalanDibuat,
    setGkBaruPosteriorAmalgamJumlahTampalanDibuat,
  ] = useState(0);
  const [
    gkSemulaPosteriorAmalgamJumlahTampalanDibuat,
    setGkSemulaPosteriorAmalgamJumlahTampalanDibuat,
  ] = useState(0);
  const [cabutDesidusSekolahRawatan, setCabutDesidusSekolahRawatan] =
    useState(0);
  const [cabutKekalSekolahRawatan, setCabutKekalSekolahRawatan] = useState(0);
  const [
    jumlahTampalanSementaraSekolahRawatan,
    setJumlahTampalanSementaraSekolahRawatan,
  ] = useState(0);
  const [pulpotomiSekolahRawatan, setPulpotomiSekolahRawatan] = useState(0);
  const [endodontikSekolahRawatan, setEndodontikSekolahRawatan] = useState(0);
  const [absesSekolahRawatan, setAbsesSekolahRawatan] = useState(0);
  const [penskaleranSekolahRawatan, setPenskaleranSekolahRawatan] = useState(0);
  const [kesSelesaiSekolahRawatan, setKesSelesaiSekolahRawatan] =
    useState(false);
  const [kesSelesaiIcdasSekolahRawatan, setKesSelesaiIcdasSekolahRawatan] =
    useState(false);
  const [rujukSekolahRawatan, setRujukSekolahRawatan] = useState(false);
  const [
    rujukCabutanGigiKekalSekolahRawatan,
    setRujukCabutanGigiKekalSekolahRawatan,
  ] = useState(false);
  const [
    rujukRawatanEndodontikSekolahRawatan,
    setRujukRawatanEndodontikSekolahRawatan,
  ] = useState(false);
  const [
    rujukRawatanOrtodontikSekolahRawatan,
    setRujukRawatanOrtodontikSekolahRawatan,
  ] = useState(false);
  const [
    rujukRawatanPeriodontikSekolahRawatan,
    setRujukRawatanPeriodontikSekolahRawatan,
  ] = useState(false);
  const [rujukLainLainSekolahRawatan, setRujukLainLainSekolahRawatan] =
    useState(false);
  const [
    rujukLainLainTulisSekolahRawatan,
    setRujukLainLainTulisSekolahRawatan,
  ] = useState('');
  const [
    yaTidakMelaksanakanAktivitiBeginPromosiSekolahRawatan,
    setYaTidakMelaksanakanAktivitiBeginPromosiSekolahRawatan,
  ] = useState('');
  const [
    yaTidakLawatanKeRumahPromosiSekolahRawatan,
    setYaTidakLawatanKeRumahPromosiSekolahRawatan,
  ] = useState('');
  const [
    plakGigiNasihatPergigianIndividuPromosiSekolahRawatan,
    setPlakGigiNasihatPergigianIndividuPromosiSekolahRawatan,
  ] = useState(false);
  const [
    dietPemakananNasihatPergigianIndividuPromosiSekolahRawatan,
    setDietPemakananNasihatPergigianIndividuPromosiSekolahRawatan,
  ] = useState(false);
  const [
    penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan,
    setPenjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan,
  ] = useState(false);
  const [
    kanserMulutNasihatPergigianIndividuPromosiSekolahRawatan,
    setKanserMulutNasihatPergigianIndividuPromosiSekolahRawatan,
  ] = useState(false);

  // tarikh rawatan
  const [tarikhRawatanSemasaDatePicker, setTarikhRawatanSemasaDatePicker] =
    useState(null);
  const TarikhRawatanSemasa = () => {
    return masterDatePicker({
      selected: tarikhRawatanSemasaDatePicker,
      onChange: (tarikhRawatanSemasa) => {
        const tempDate = moment(tarikhRawatanSemasa).format('YYYY-MM-DD');
        setTarikhRawatanSemasa(tempDate);
        setTarikhRawatanSemasaDatePicker(tarikhRawatanSemasa);
      },
      filterDate: (date) => {
        return moment() > date;
      },
      className:
        'appearance-none w-auto text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md uppercase flex flex-row lg:ml-2',
    });
  };

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
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        // toast.error(
        //   'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: user-form-sekolah-rawatan-fetchSinglePersonSekolah'
        // );
      }
    };
    fetchSinglePersonSekolah();
  }, []);

  const handleSubmit = async (e) => {
    let statusRawatan = '';
    if (kesSelesaiSekolahRawatan === true) {
      statusRawatan = 'selesai';
    }
    if (kesSelesaiSekolahRawatan === false) {
      statusRawatan = 'belum selesai';
    }
    await toast
      .promise(
        axios.post(
          `/api/v1/sekolah/rawatan/${personSekolahId}`,
          {
            createdByUsername,
            statusRawatan,
            tarikhRawatanSemasa,
            baruJumlahGigiKekalDibuatFs,
            muridDibuatFs,
            muridDiberiFv,
            baruJumlahGigiKekalDiberiFv,
            muridDiberiPrrJenis1,
            baruJumlahGigiKekalDiberiPrrJenis1,
            baruJumlahGigiYangDiberiSdf,
            semulaJumlahGigiYangDiberiSdf,
            gdBaruAnteriorSewarnaJumlahTampalanDibuat,
            gdSemulaAnteriorSewarnaJumlahTampalanDibuat,
            gkBaruAnteriorSewarnaJumlahTampalanDibuat,
            gkSemulaAnteriorSewarnaJumlahTampalanDibuat,
            gdBaruPosteriorSewarnaJumlahTampalanDibuat,
            gdSemulaPosteriorSewarnaJumlahTampalanDibuat,
            gkBaruPosteriorSewarnaJumlahTampalanDibuat,
            gkSemulaPosteriorSewarnaJumlahTampalanDibuat,
            gdBaruPosteriorAmalgamJumlahTampalanDibuat,
            gdSemulaPosteriorAmalgamJumlahTampalanDibuat,
            gkBaruPosteriorAmalgamJumlahTampalanDibuat,
            gkSemulaPosteriorAmalgamJumlahTampalanDibuat,
            cabutDesidusSekolahRawatan,
            cabutKekalSekolahRawatan,
            jumlahTampalanSementaraSekolahRawatan,
            pulpotomiSekolahRawatan,
            endodontikSekolahRawatan,
            absesSekolahRawatan,
            penskaleranSekolahRawatan,
            kesSelesaiSekolahRawatan,
            kesSelesaiIcdasSekolahRawatan,
            rujukSekolahRawatan,
            rujukCabutanGigiKekalSekolahRawatan,
            rujukRawatanEndodontikSekolahRawatan,
            rujukRawatanOrtodontikSekolahRawatan,
            rujukRawatanPeriodontikSekolahRawatan,
            rujukLainLainSekolahRawatan,
            rujukLainLainTulisSekolahRawatan,
            yaTidakMelaksanakanAktivitiBeginPromosiSekolahRawatan,
            yaTidakLawatanKeRumahPromosiSekolahRawatan,
            plakGigiNasihatPergigianIndividuPromosiSekolahRawatan,
            dietPemakananNasihatPergigianIndividuPromosiSekolahRawatan,
            penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan,
            kanserMulutNasihatPergigianIndividuPromosiSekolahRawatan,
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
          success: 'Rawatan pelajar berjaya dihantar',
          error: 'Rawatan pelajar gagal dihantar',
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
          <div className='h-full p-1 px-2 md:px-10 grid gap-2'>
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
                        <p className='ml-1'>
                          {singlePersonSekolah.tarikhLahir}
                        </p>
                      </div>
                      <div className='text-xs flex flex-row '>
                        <h2 className='font-semibold'>BANGSA :</h2>
                        <p className='ml-1'>
                          {singlePersonSekolah.kumpulanEtnik}
                        </p>
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
                      <p className='ml-1 text-xs'>
                        {singlePersonSekolah.kelas}
                      </p>
                    </div>
                  </div>
                </>
              )}
              {isLoading && (
                <p className='col-span-3 py-[19px] text-sm font-semibold'>
                  <Spinner color='#1f315f' />
                </p>
              )}
            </article>
            <div className='grid h-full overflow-scroll gap-2'>
              <form onSubmit={confirm(handleSubmit)}>
                <span className='flex bg-user3 p-2 w-full capitalize col-span-2'>
                  <p className='ml-3 text-xl font-semibold'>Rawatan</p>
                </span>
                <section className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 mb-3 w-full col-span-2'>
                  <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md col-span-1 md:col-span-2'>
                    <h4 className='font-bold flex flex-row pl-5 col-span-2 pb-2'>
                      kedatangan
                    </h4>
                    <div className='flex flex-row'>
                      <p className='flex items-center flex-row text-m font-m px-5 '>
                        tarikh:<span className='text-user6'>*</span>
                      </p>
                      <TarikhRawatanSemasa />
                    </div>
                    <div className='flex items-center flex-row pl-5'>
                      <input
                        type='radio'
                        name='enggan-tidak-hadir-rawatan'
                        id='enggan-rawatan'
                        value='enggan-rawatan'
                        checked={
                          engganTidakHadirRawatan === 'enggan-rawatan'
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          setEngganTidakHadirRawatan(e.target.value);
                          setConfirmData({
                            ...confirmData,
                            engganTidakHadirRawatan: e.target.value,
                          });
                        }}
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                      />
                      <label
                        htmlFor='enggan-rawatan'
                        className='m-2 text-xs sm:text-sm font-m'
                      >
                        enggan
                      </label>
                      <input
                        type='radio'
                        name='enggan-tidak-hadir-rawatan'
                        id='tidak-hadir-rawatan'
                        value='tidak-hadir-rawatan'
                        checked={
                          engganTidakHadirRawatan === 'tidak-hadir-rawatan'
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          setEngganTidakHadirRawatan(e.target.value);
                          setConfirmData({
                            ...confirmData,
                            engganTidakHadirRawatan: e.target.value,
                          });
                        }}
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                      />
                      <label
                        htmlFor='tidak-hadir-rawatan'
                        className='m-2 text-xs sm:text-sm font-m'
                      >
                        tidak hadir
                      </label>
                      {engganTidakHadirRawatan ? (
                        <span
                          className='px-2 py-1 bg-user4 text-userWhite text-xs rounded-full cursor-pointer hover:bg-user2'
                          onClick={() => {
                            setEngganTidakHadirRawatan('');
                          }}
                        >
                          X
                        </span>
                      ) : null}
                    </div>
                  </article>
                  <div className='grid gap-1 auto-rows-min'>
                    <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                      <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                        Pengapan Fisur{' '}
                        <FaInfoCircle title='Fissure Sealant' className='m-2' />
                      </h4>
                      <div className='flex flex-row items-center pl-11 col-span-2'>
                        <input
                          type='checkbox'
                          name='baru-jumlah-murid-dibuat-fs'
                          id='baru-jumlah-murid-dibuat-fs'
                          checked={muridDibuatFs}
                          onChange={() => {
                            setMuridDibuatFs(!muridDibuatFs);
                            setConfirmData({
                              ...confirmData,
                              muridDibuatFs: !muridDibuatFs,
                            });
                          }}
                          className='w-4 h-4 bg-user4 rounded focus:ring-user2 mr-3'
                        />
                        <label
                          htmlFor='baru-jumlah-murid-dibuat-fs'
                          className='text-sm font-m'
                        >
                          murid dibuat pengapan fisur
                        </label>
                      </div>
                      {muridDibuatFs && (
                        <div className='flex flex-row items-center pl-5 col-span-2'>
                          <label
                            htmlFor='baru-jumlah-gigi-kekal-dibuat-fs'
                            className='text-sm font-m'
                          >
                            Jumlah gigi kekal dibuat pengapan fisur
                          </label>
                          <input
                            type='number'
                            name='baru-jumlah-gigi-kekal-dibuat-fs'
                            id='baru-jumlah-gigi-kekal-dibuat-fs'
                            value={baruJumlahGigiKekalDibuatFs}
                            onChange={(e) => {
                              setBaruJumlahGigiKekalDibuatFs(e.target.value);
                              setConfirmData({
                                ...confirmData,
                                baruJumlahGigiKekalDibuatFs: e.target.value,
                              });
                            }}
                            className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            min='0'
                            max='16'
                            required
                          />
                        </div>
                      )}
                    </article>
                    <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                      <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                        Sapuan Fluorida(FV)
                        <FaInfoCircle
                          title='Fluoride Varnish Application'
                          className='m-2'
                        />
                      </h4>
                      <div className='flex flex-row items-center pl-11 col-span-2'>
                        <input
                          type='checkbox'
                          name='murid-diberi-fv'
                          id='murid-diberi-fv'
                          checked={muridDiberiFv}
                          onChange={() => {
                            setMuridDiberiFv(!muridDiberiFv);
                            setConfirmData({
                              ...confirmData,
                              muridDiberiFv: !muridDiberiFv,
                            });
                          }}
                          className='w-4 h-4 bg-user4 rounded focus:ring-user2 mr-3'
                        />
                        <label
                          htmlFor='murid-diberi-fv'
                          className='text-sm font-m'
                        >
                          murid diberi Sapuan Florida(FV)
                        </label>
                      </div>
                    </article>
                    <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                      <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                        Tampalan Resin Pencegahan Jenis 1 (PRR Type I)
                      </h4>
                      <div className='flex flex-row items-center pl-11 col-span-2'>
                        <input
                          type='checkbox'
                          name='baru-jumlah-murid-diberi-prr-jenis-1'
                          id='baru-jumlah-murid-diberi-prr-jenis-1'
                          checked={muridDiberiPrrJenis1}
                          onChange={() => {
                            setMuridDiberiPrrJenis1(!muridDiberiPrrJenis1);
                            setConfirmData({
                              ...confirmData,
                              muridDiberiPrrJenis1: !muridDiberiPrrJenis1,
                            });
                          }}
                          className='w-4 h-4 bg-user4 rounded focus:ring-user2 mr-3'
                        />
                        <label
                          htmlFor='baru-jumlah-murid-diberi-prr-jenis-1'
                          className='text-sm font-m'
                        >
                          murid diberi Tampalan Resin Pencegahan Jenis 1 (PRR
                          Type I)
                        </label>
                      </div>
                      {muridDiberiPrrJenis1 && (
                        <div className='flex flex-row items-center pl-5 col-span-2'>
                          <label
                            htmlFor='baru-jumlah-gigi-kekal-diberi-prr-jenis-1'
                            className='text-sm font-m'
                          >
                            jumlah gigi kekal perlu Tampalan Resin Pencegahan
                            Jenis 1 (PRR Type I)
                          </label>
                          <input
                            type='number'
                            name='baru-jumlah-gigi-kekal-diberi-prr-jenis-1'
                            id='baru-jumlah-gigi-kekal-diberi-prr-jenis-1'
                            value={baruJumlahGigiKekalDiberiPrrJenis1}
                            onChange={(e) => {
                              setBaruJumlahGigiKekalDiberiPrrJenis1(
                                e.target.value
                              );
                              setConfirmData({
                                ...confirmData,
                                baruJumlahGigiKekalDiberiPrrJenis1:
                                  e.target.value,
                              });
                            }}
                            className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            min='0'
                            max='16'
                            required
                          />
                        </div>
                      )}
                    </article>
                  </div>
                  <div className='grid gap-1 auto-rows-min'>
                    {/* <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                  <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                    Silver Diamine Fluoride
                  </h4>
                  <p className='flex flex-row pl-5 text-sm font-m col-span-2'>
                    Jumlah gigi yang diberi SDF:
                  </p>
                  <div className='flex flex-row items-center pl-5'>
                    <label
                      htmlFor='baru-jumlah-gigi-yang-diberi-sdf'
                      className='text-sm font-m'
                    >
                      Baru
                    </label>
                    <input
                      type='number'
                      name='baru-jumlah-gigi-yang-diberi-sdf'
                      id='baru-jumlah-gigi-yang-diberi-sdf'
                      value={baruJumlahGigiYangDiberiSdf}
                      onChange={(e) => {
                        setBaruJumlahGigiYangDiberiSdf(e.target.value);
                        setConfirmData({
                          ...confirmData,
                          baruJumlahGigiYangDiberiSdf: e.target.value,
                        });
                      }}
                      className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                      min='0'
                      max='16'
                      required
                    />
                  </div>
                  <div className='flex flex-row items-center pl-5'>
                    <label
                      htmlFor='semula-jumlah-gigi-yang-diberi-sdf'
                      className='text-sm font-m'
                    >
                      Semula
                    </label>
                    <input
                      type='number'
                      name='semula-jumlah-gigi-yang-diberi-sdf'
                      id='semula-jumlah-gigi-yang-diberi-sdf'
                      value={semulaJumlahGigiYangDiberiSdf}
                      onChange={(e) => {
                        setSemulaJumlahGigiYangDiberiSdf(e.target.value);
                        setConfirmData({
                          ...confirmData,
                          semulaJumlahGigiYangDiberiSdf: e.target.value,
                        });
                      }}
                      className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                      min='0'
                      max='16'
                      required
                    />
                  </div>
                </article> */}
                    <article className='border border-userBlack pl-3 p-2 rounded-md'>
                      <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                        Jumlah Tampalan Dibuat
                      </h4>
                      <div className='grid grid-rows-2 gap-2'>
                        <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                          <h4 className='font-semibold flex flex-row pl-5 col-span-2'>
                            Anterior Sewarna
                          </h4>
                          <div className='flex flex-row items-center pl-5'>
                            <input
                              type='number'
                              name='gd-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                              id='gd-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                              value={gdBaruAnteriorSewarnaJumlahTampalanDibuat}
                              onChange={(e) => {
                                setGdBaruAnteriorSewarnaJumlahTampalanDibuat(
                                  e.target.value
                                );
                                setConfirmData({
                                  ...confirmData,
                                  gdBaruAnteriorSewarnaJumlahTampalanDibuat:
                                    e.target.value,
                                });
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              min='0'
                              max='12'
                            />
                            <label
                              htmlFor='gd-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                              className='text-sm font-m ml-2 m-1'
                            >
                              GD Baru
                            </label>
                          </div>
                          <div className='flex flex-row items-center pl-5'>
                            <input
                              type='number'
                              name='gd-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                              id='gd-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                              value={
                                gdSemulaAnteriorSewarnaJumlahTampalanDibuat
                              }
                              onChange={(e) => {
                                setGdSemulaAnteriorSewarnaJumlahTampalanDibuat(
                                  e.target.value
                                );
                                setConfirmData({
                                  ...confirmData,
                                  gdSemulaAnteriorSewarnaJumlahTampalanDibuat:
                                    e.target.value,
                                });
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              min='0'
                              max='12'
                            />
                            <label
                              htmlFor='gd-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                              className='text-sm font-m ml-2 m-1'
                            >
                              GD Semula
                            </label>
                          </div>
                          <div className='flex flex-row items-center pl-5'>
                            <input
                              type='number'
                              name='gk-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                              id='gk-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                              value={gkBaruAnteriorSewarnaJumlahTampalanDibuat}
                              onChange={(e) => {
                                setGkBaruAnteriorSewarnaJumlahTampalanDibuat(
                                  e.target.value
                                );
                                setConfirmData({
                                  ...confirmData,
                                  gkBaruAnteriorSewarnaJumlahTampalanDibuat:
                                    e.target.value,
                                });
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              min='0'
                              max='12'
                            />
                            <label
                              htmlFor='gk-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                              className='text-sm font-m ml-2 m-1'
                            >
                              GK Baru
                            </label>
                          </div>
                          <div className='flex flex-row items-center pl-5'>
                            <input
                              type='number'
                              name='gk-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                              id='gk-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                              value={
                                gkSemulaAnteriorSewarnaJumlahTampalanDibuat
                              }
                              onChange={(e) => {
                                setGkSemulaAnteriorSewarnaJumlahTampalanDibuat(
                                  e.target.value
                                );
                                setConfirmData({
                                  ...confirmData,
                                  gkSemulaAnteriorSewarnaJumlahTampalanDibuat:
                                    e.target.value,
                                });
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              min='0'
                              max='20'
                            />
                            <label
                              htmlFor='gk-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                              className='text-sm font-m ml-2 m-1'
                            >
                              GK Semula
                            </label>
                          </div>
                        </article>
                        <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                          <h4 className='font-semibold flex flex-row pl-5 col-span-2'>
                            Posterior Sewarna
                          </h4>
                          <div className='flex flex-row items-center pl-5'>
                            <input
                              type='number'
                              name='gd-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                              id='gd-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                              value={gdBaruPosteriorSewarnaJumlahTampalanDibuat}
                              onChange={(e) => {
                                setGdBaruPosteriorSewarnaJumlahTampalanDibuat(
                                  e.target.value
                                );
                                setConfirmData({
                                  ...confirmData,
                                  gdBaruPosteriorSewarnaJumlahTampalanDibuat:
                                    e.target.value,
                                });
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              min='0'
                              max='8'
                            />
                            <label
                              htmlFor='gd-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                              className='text-sm font-m ml-2 m-1'
                            >
                              GD Baru
                            </label>
                          </div>
                          <div className='flex flex-row items-center pl-5'>
                            <input
                              type='number'
                              name='gd-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                              id='gd-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                              value={
                                gdSemulaPosteriorSewarnaJumlahTampalanDibuat
                              }
                              onChange={(e) => {
                                setGdSemulaPosteriorSewarnaJumlahTampalanDibuat(
                                  e.target.value
                                );
                                setConfirmData({
                                  ...confirmData,
                                  gdSemulaPosteriorSewarnaJumlahTampalanDibuat:
                                    e.target.value,
                                });
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              min='0'
                              max='8'
                            />
                            <label
                              htmlFor='gd-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                              className='text-sm font-m ml-2 m-1'
                            >
                              GD Semula
                            </label>
                          </div>
                          <div className='flex flex-row items-center pl-5'>
                            <input
                              type='number'
                              name='gk-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                              id='gk-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                              value={gkBaruPosteriorSewarnaJumlahTampalanDibuat}
                              onChange={(e) => {
                                setGkBaruPosteriorSewarnaJumlahTampalanDibuat(
                                  e.target.value
                                );
                                setConfirmData({
                                  ...confirmData,
                                  gkBaruPosteriorSewarnaJumlahTampalanDibuat:
                                    e.target.value,
                                });
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              min='0'
                              max='8'
                            />
                            <label
                              htmlFor='gk-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                              className='text-sm font-m ml-2 m-1'
                            >
                              GK Baru
                            </label>
                          </div>
                          <div className='flex flex-row items-center pl-5'>
                            <input
                              type='number'
                              name='gk-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                              id='gk-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                              value={
                                gkSemulaPosteriorSewarnaJumlahTampalanDibuat
                              }
                              onChange={(e) => {
                                setGkSemulaPosteriorSewarnaJumlahTampalanDibuat(
                                  e.target.value
                                );
                                setConfirmData({
                                  ...confirmData,
                                  gkSemulaPosteriorSewarnaJumlahTampalanDibuat:
                                    e.target.value,
                                });
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              min='0'
                              max='20'
                            />
                            <label
                              htmlFor='gk-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                              className='text-sm font-m ml-2 m-1'
                            >
                              GK Semula
                            </label>
                          </div>
                        </article>
                        <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                          <h4 className='font-semibold flex flex-row pl-5 col-span-2'>
                            Posterior Amalgam
                          </h4>
                          <div className='flex flex-row items-center pl-5'>
                            <input
                              type='number'
                              name='gd-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                              id='gd-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                              value={gdBaruPosteriorAmalgamJumlahTampalanDibuat}
                              onChange={(e) => {
                                setGdBaruPosteriorAmalgamJumlahTampalanDibuat(
                                  e.target.value
                                );
                                setConfirmData({
                                  ...confirmData,
                                  gdBaruPosteriorAmalgamJumlahTampalanDibuat:
                                    e.target.value,
                                });
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              min='0'
                              max='8'
                            />
                            <label
                              htmlFor='gd-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                              className='text-sm font-m ml-2 m-1'
                            >
                              GD Baru
                            </label>
                          </div>
                          <div className='flex flex-row items-center pl-5'>
                            <input
                              type='number'
                              name='gd-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                              id='gd-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                              value={
                                gdSemulaPosteriorAmalgamJumlahTampalanDibuat
                              }
                              onChange={(e) => {
                                setGdSemulaPosteriorAmalgamJumlahTampalanDibuat(
                                  e.target.value
                                );
                                setConfirmData({
                                  ...confirmData,
                                  gdSemulaPosteriorAmalgamJumlahTampalanDibuat:
                                    e.target.value,
                                });
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              min='0'
                              max='8'
                            />
                            <label
                              htmlFor='gd-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                              className='text-sm font-m ml-2 m-1'
                            >
                              GD Semula
                            </label>
                          </div>
                          <div className='flex flex-row items-center pl-5'>
                            <input
                              type='number'
                              name='gk-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                              id='gk-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                              value={gkBaruPosteriorAmalgamJumlahTampalanDibuat}
                              onChange={(e) => {
                                setGkBaruPosteriorAmalgamJumlahTampalanDibuat(
                                  e.target.value
                                );
                                setConfirmData({
                                  ...confirmData,
                                  gkBaruPosteriorAmalgamJumlahTampalanDibuat:
                                    e.target.value,
                                });
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              min='0'
                              max='20'
                            />
                            <label
                              htmlFor='gk-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                              className='text-sm font-m ml-2 m-1'
                            >
                              GK Baru
                            </label>
                          </div>
                          <div className='flex flex-row items-center pl-5'>
                            <input
                              type='number'
                              name='gk-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                              id='gk-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                              value={
                                gkSemulaPosteriorAmalgamJumlahTampalanDibuat
                              }
                              onChange={(e) => {
                                setGkSemulaPosteriorAmalgamJumlahTampalanDibuat(
                                  e.target.value
                                );
                                setConfirmData({
                                  ...confirmData,
                                  gkSemulaPosteriorAmalgamJumlahTampalanDibuat:
                                    e.target.value,
                                });
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              min='0'
                              max='20'
                            />
                            <label
                              htmlFor='gk-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                              className='text-sm font-m ml-2 m-1'
                            >
                              GK Semula
                            </label>
                          </div>
                        </article>
                      </div>
                    </article>
                  </div>
                </section>
                <section className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 mb-3 w-full col-span-2'>
                  <div className='grid gap-2 auto-rows-min'>
                    <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                      <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                        cabutan
                      </h4>
                      <p className='flex items-center flex-row pl-5 text-m font-m col-span-2'>
                        gigi telah dicabut
                      </p>
                      <div className='flex items-center justify-center'>
                        <p className='text-sm font-m'>Desidus: </p>
                        <input
                          type='number'
                          name='cabut-desidus-sekolah-rawatan'
                          id='cabut-desidus-sekolah-rawatan'
                          value={cabutDesidusSekolahRawatan}
                          onChange={(e) => {
                            setCabutDesidusSekolahRawatan(e.target.value);
                            setConfirmData({
                              ...confirmData,
                              cabutDesidusSekolahRawatan: e.target.value,
                            });
                          }}
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          min='0'
                          max='20'
                        />
                      </div>
                      <div className='flex items-center justify-center'>
                        <p className='text-sm font-m'>Kekal: </p>
                        <input
                          type='number'
                          name='cabut-kekal-penyata-akhir-2'
                          id='cabut-kekal-penyata-akhir-2'
                          value={cabutKekalSekolahRawatan}
                          onChange={(e) => {
                            setCabutKekalSekolahRawatan(e.target.value);
                            setConfirmData({
                              ...confirmData,
                              cabutKekalSekolahRawatan: e.target.value,
                            });
                          }}
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          min='0'
                          max='32'
                        />
                      </div>
                    </article>
                    <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                      <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                        tampalan sementara
                      </h4>
                      <div className='flex items-center flex-row pl-5 col-span-2'>
                        <p className='text-sm font-m'>
                          jumlah tampalan sementara:{' '}
                        </p>
                        <input
                          type='number'
                          name='jumlah-tampalan-sementara-penyata-akhir-2'
                          id='jumlah-tampalan-sementara-penyata-akhir-2'
                          value={jumlahTampalanSementaraSekolahRawatan}
                          onChange={(e) => {
                            setJumlahTampalanSementaraSekolahRawatan(
                              e.target.value
                            );
                            setConfirmData({
                              ...confirmData,
                              jumlahTampalanSementaraSekolahRawatan:
                                e.target.value,
                            });
                          }}
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          min='0'
                          max='20'
                        />
                      </div>
                    </article>
                    <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                      <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                        rawatan lain yang telah dilakukan
                      </h4>
                      <div className='grid grid-cols-1 lg:grid-cols-3 col-span-2'>
                        <div className='flex items-center flex-row pl-5'>
                          <p className='text-sm font-m'>pulpotomi: </p>
                          <input
                            type='number'
                            name='pulpotomi-penyata-akhir-2'
                            id='pulpotomi-penyata-akhir-2'
                            value={pulpotomiSekolahRawatan}
                            onChange={(e) => {
                              setPulpotomiSekolahRawatan(e.target.value);
                              setConfirmData({
                                ...confirmData,
                                pulpotomiSekolahRawatan: e.target.value,
                              });
                            }}
                            className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            min='0'
                            max='20'
                          />
                        </div>
                        <div className='flex items-center flex-row pl-5'>
                          <p className='text-sm font-m'>endodontik: </p>
                          <input
                            type='number'
                            name='endodontik-penyata-akhir-2'
                            id='endodontik-penyata-akhir-2'
                            value={endodontikSekolahRawatan}
                            onChange={(e) => {
                              setEndodontikSekolahRawatan(e.target.value);
                              setConfirmData({
                                ...confirmData,
                                endodontikSekolahRawatan: e.target.value,
                              });
                            }}
                            className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            min='0'
                            max='32'
                          />
                        </div>
                        <div className='flex items-center flex-row pl-5'>
                          <p className='text-sm font-m'>abses: </p>
                          <input
                            type='number'
                            name='abses-penyata-akhir-2'
                            id='abses-penyata-akhir-2'
                            value={absesSekolahRawatan}
                            onChange={(e) => {
                              setAbsesSekolahRawatan(e.target.value);
                              setConfirmData({
                                ...confirmData,
                                absesSekolahRawatan: e.target.value,
                              });
                            }}
                            className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            min='0'
                            max='1'
                          />
                        </div>
                      </div>
                      <div className='flex flex-row items-center pl-5'>
                        <p className='text-sm font-m'>Penskaleran:</p>
                        <input
                          type='number'
                          name='penskaleran-penyata-akhir-2'
                          id='penskaleran-penyata-akhir-2'
                          value={penskaleranSekolahRawatan}
                          onChange={(e) => {
                            setPenskaleranSekolahRawatan(e.target.value);
                            setConfirmData({
                              ...confirmData,
                              penskaleranSekolahRawatan: e.target.value,
                            });
                          }}
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          min='0'
                          max='4'
                        />
                      </div>
                    </article>
                    <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                      <h4 className='font-bold flex flex-row pl-5'>
                        status rawatan
                      </h4>
                      <div className='flex flex-row items-center pl-5 m-2'>
                        <input
                          type='checkbox'
                          name='kes-selesai-penyata-akhir-2'
                          id='kes-selesai-penyata-akhir-2'
                          checked={kesSelesaiSekolahRawatan}
                          onChange={() => {
                            setKesSelesaiSekolahRawatan(
                              !kesSelesaiSekolahRawatan
                            );
                            setConfirmData({
                              ...confirmData,
                              kesSelesaiSekolahRawatan:
                                !kesSelesaiSekolahRawatan,
                            });
                          }}
                          className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                        />
                        <label
                          htmlFor='kes-selesai-penyata-akhir-2'
                          className='mx-2 text-sm font-m'
                        >
                          kes selesai
                        </label>
                      </div>
                      <div
                        className={`${
                          !kesSelesaiSekolahRawatan && 'hidden'
                        } flex flex-row items-center pl-5 m-2`}
                      >
                        <input
                          type='checkbox'
                          name='kes-selesai-icdas-penyata-akhir-2'
                          id='kes-selesai-icdas-penyata-akhir-2'
                          checked={kesSelesaiIcdasSekolahRawatan}
                          onChange={() => {
                            setKesSelesaiIcdasSekolahRawatan(
                              !kesSelesaiIcdasSekolahRawatan
                            );
                            setConfirmData({
                              ...confirmData,
                              kesSelesaiIcdasSekolahRawatan:
                                !kesSelesaiIcdasSekolahRawatan,
                            });
                          }}
                          className='ml-7 w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                        />
                        <label
                          htmlFor='kes-selesai-icdas-penyata-akhir-2'
                          className='mx-2 text-sm font-m'
                        >
                          kes selesai ICDAS
                        </label>
                      </div>
                      <div className='flex flex-row items-center pl-5 m-2'>
                        <input
                          type='checkbox'
                          name='rujuk-penyata-akhir-2'
                          id='rujuk-penyata-akhir-2'
                          checked={rujukSekolahRawatan}
                          onChange={() => {
                            setRujukSekolahRawatan(!rujukSekolahRawatan);
                            setConfirmData({
                              ...confirmData,
                              rujukSekolahRawatan: !rujukSekolahRawatan,
                            });
                          }}
                          className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                        />
                        <label
                          htmlFor='rujuk-penyata-akhir-2'
                          className='mx-2 text-sm font-m'
                        >
                          rujuk
                        </label>
                      </div>
                      <div
                        className={`${
                          !rujukSekolahRawatan && 'hidden'
                        } flex flex-row items-center pl-5 m-2`}
                      >
                        <input
                          type='checkbox'
                          name='rujuk-cabutan-gigi-kekal-penyata-akhir-2'
                          id='rujuk-cabutan-gigi-kekal-penyata-akhir-2'
                          checked={rujukCabutanGigiKekalSekolahRawatan}
                          onChange={() => {
                            setRujukCabutanGigiKekalSekolahRawatan(
                              !rujukCabutanGigiKekalSekolahRawatan
                            );
                            setConfirmData({
                              ...confirmData,
                              rujukCabutanGigiKekalSekolahRawatan:
                                !rujukCabutanGigiKekalSekolahRawatan,
                            });
                          }}
                          className='ml-7 w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                        />
                        <label
                          htmlFor='rujuk-cabutan-gigi-kekal-penyata-akhir-2'
                          className='mx-2 text-sm font-m'
                        >
                          cabutan gigi kekal
                        </label>
                      </div>
                      <div
                        className={`${
                          !rujukSekolahRawatan && 'hidden'
                        } flex flex-row items-center pl-5 m-2`}
                      >
                        <input
                          type='checkbox'
                          name='rujuk-rawatan-endodontik-penyata-akhir-2'
                          id='rujuk-rawatan-endodontik-penyata-akhir-2'
                          checked={rujukRawatanEndodontikSekolahRawatan}
                          onChange={() => {
                            setRujukRawatanEndodontikSekolahRawatan(
                              !rujukRawatanEndodontikSekolahRawatan
                            );
                            setConfirmData({
                              ...confirmData,
                              rujukRawatanEndodontikSekolahRawatan:
                                !rujukRawatanEndodontikSekolahRawatan,
                            });
                          }}
                          className='ml-7 w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                        />
                        <label
                          htmlFor='rujuk-rawatan-endodontik-penyata-akhir-2'
                          className='mx-2 text-sm font-m'
                        >
                          rawatan endodontik
                        </label>
                      </div>
                      <div
                        className={`${
                          !rujukSekolahRawatan && 'hidden'
                        } flex flex-row items-center pl-5 m-2`}
                      >
                        <input
                          type='checkbox'
                          name='rawatan-ortodontik-penyata-akhir-2'
                          id='rawatan-ortodontik-penyata-akhir-2'
                          checked={rujukRawatanOrtodontikSekolahRawatan}
                          onChange={() => {
                            setRujukRawatanOrtodontikSekolahRawatan(
                              !rujukRawatanOrtodontikSekolahRawatan
                            );
                            setConfirmData({
                              ...confirmData,
                              rujukRawatanOrtodontikSekolahRawatan:
                                !rujukRawatanOrtodontikSekolahRawatan,
                            });
                          }}
                          className='ml-7 w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                        />
                        <label
                          htmlFor='rawatan-ortodontik-penyata-akhir-2'
                          className='mx-2 text-sm font-m'
                        >
                          rawatan ortodontik
                        </label>
                      </div>
                      <div
                        className={`${
                          !rujukSekolahRawatan && 'hidden'
                        } flex flex-row items-center pl-5 m-2`}
                      >
                        <input
                          type='checkbox'
                          name='rujuk-rawatan-periodontik-penyata-akhir-2'
                          id='rujuk-rawatan-periodontik-penyata-akhir-2'
                          checked={rujukRawatanPeriodontikSekolahRawatan}
                          onChange={() => {
                            setRujukRawatanPeriodontikSekolahRawatan(
                              !rujukRawatanPeriodontikSekolahRawatan
                            );
                            setConfirmData({
                              ...confirmData,
                              rujukRawatanPeriodontikSekolahRawatan:
                                !rujukRawatanPeriodontikSekolahRawatan,
                            });
                          }}
                          className='ml-7 w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                        />
                        <label
                          htmlFor='rujuk-rawatan-periodontik-penyata-akhir-2'
                          className='mx-2 text-sm font-m'
                        >
                          rawatan periodontik
                        </label>
                      </div>
                      <div
                        className={`${
                          !rujukSekolahRawatan && 'hidden'
                        } flex flex-row items-center pl-5 m-2`}
                      >
                        <input
                          type='checkbox'
                          name='rujuk-lain-lain-penyata-akhir-2'
                          id='rujuk-lain-lain-penyata-akhir-2'
                          checked={rujukLainLainSekolahRawatan}
                          onChange={() => {
                            setRujukLainLainSekolahRawatan(
                              !rujukLainLainSekolahRawatan
                            );
                            setConfirmData({
                              ...confirmData,
                              rujukLainLainSekolahRawatan:
                                !rujukLainLainSekolahRawatan,
                            });
                          }}
                          className='ml-7 w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                        />
                        <label
                          htmlFor='rujuk-lain-lain-penyata-akhir-2'
                          className='mx-2 text-sm font-m'
                        >
                          lain-lain
                        </label>
                        <div
                          className={`${
                            !rujukSekolahRawatan && 'hidden'
                          } flex flex-row items-center`}
                        >
                          <input
                            type='text'
                            name='rujuk-lain-lain-tulis-rawatan'
                            id='rujuk-lain-lain-tulis-rawatan'
                            value={rujukLainLainTulisSekolahRawatan}
                            onChange={(e) => {
                              setRujukLainLainTulisSekolahRawatan(
                                e.target.value
                              );
                              setConfirmData({
                                ...confirmData,
                                rujukLainLainTulisSekolahRawatan:
                                  e.target.value,
                              });
                            }}
                            className='ml-4 px-2 py-1 ring-1 ring-user3 rounded-md focus:ring-2 focus:ring-user3 focus:outline-none'
                          />
                        </div>
                      </div>
                    </article>
                  </div>
                  <div className='grid gap-2 auto-rows-min'>
                    <article className='grid gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                      <h4 className='font-bold flex flex-row pl-5'>
                        promosi & pendidikan kesihatan pergigian
                      </h4>
                      <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                        <h4 className='font-bold flex flex-row pl-5'>
                          melaksanakan aktiviti
                        </h4>
                        <div className='flex items-center flex-row pl-5'>
                          <p className='text-sm font-semibold flex items-center justify-center pr-3'>
                            BEGIN:{' '}
                          </p>
                          <div className='flex items-center justify-center'>
                            <input
                              type='radio'
                              name='melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                              id='ya-melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                              value='ya-melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                              checked={
                                yaTidakMelaksanakanAktivitiBeginPromosiSekolahRawatan ===
                                'ya-melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                                  ? true
                                  : false
                              }
                              onChange={(e) => {
                                setYaTidakMelaksanakanAktivitiBeginPromosiSekolahRawatan(
                                  e.target.value
                                );
                                setConfirmData({
                                  ...confirmData,
                                  yaTidakMelaksanakanAktivitiBeginPromosiSekolahRawatan:
                                    e.target.value,
                                });
                              }}
                              className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                            />
                            <label
                              htmlFor='ya-melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                              className='m-2 text-sm font-m'
                            >
                              Ya
                            </label>

                            <input
                              type='radio'
                              name='melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                              id='tidak-melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                              value='tidak-melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                              checked={
                                yaTidakMelaksanakanAktivitiBeginPromosiSekolahRawatan ===
                                'tidak-melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                                  ? true
                                  : false
                              }
                              onChange={(e) => {
                                setYaTidakMelaksanakanAktivitiBeginPromosiSekolahRawatan(
                                  e.target.value
                                );
                                setConfirmData({
                                  ...confirmData,
                                  yaTidakMelaksanakanAktivitiBeginPromosiSekolahRawatan:
                                    e.target.value,
                                });
                              }}
                              className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                            />
                            <label
                              htmlFor='tidak-melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                              className='m-2 text-sm font-m'
                            >
                              Tidak
                            </label>
                          </div>
                        </div>
                      </article>
                      <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                        <h4 className='font-bold flex flex-row pl-5'>
                          menerima aktiviti nasihat pergigian individu
                        </h4>
                        <div className='grid grid-cols-1'>
                          <div className='flex items-center flex-row pl-5'>
                            <input
                              type='checkbox'
                              name='plak-gigi-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                              id='plak-gigi-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                              checked={
                                plakGigiNasihatPergigianIndividuPromosiSekolahRawatan
                              }
                              onChange={() => {
                                setPlakGigiNasihatPergigianIndividuPromosiSekolahRawatan(
                                  !plakGigiNasihatPergigianIndividuPromosiSekolahRawatan
                                );
                                setConfirmData({
                                  ...confirmData,
                                  plakGigiNasihatPergigianIndividuPromosiSekolahRawatan:
                                    !plakGigiNasihatPergigianIndividuPromosiSekolahRawatan,
                                });
                              }}
                              className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                            />
                            <label
                              htmlFor='plak-gigi-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                              className='m-2 text-sm font-m'
                            >
                              nasihat berkaitan plak gigi
                            </label>
                          </div>
                          <div className='flex items-center flex-row pl-5'>
                            <input
                              type='checkbox'
                              name='diet-pemakanan-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                              id='diet-pemakanan-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                              checked={
                                dietPemakananNasihatPergigianIndividuPromosiSekolahRawatan
                              }
                              onChange={() => {
                                setDietPemakananNasihatPergigianIndividuPromosiSekolahRawatan(
                                  !dietPemakananNasihatPergigianIndividuPromosiSekolahRawatan
                                );
                                setConfirmData({
                                  ...confirmData,
                                  dietPemakananNasihatPergigianIndividuPromosiSekolahRawatan:
                                    !dietPemakananNasihatPergigianIndividuPromosiSekolahRawatan,
                                });
                              }}
                              className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                            />
                            <label
                              htmlFor='diet-pemakanan-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                              className='m-2 text-sm font-m'
                            >
                              nasihat berkaitan diet pemakanan
                            </label>
                          </div>
                          <div className='flex items-center flex-row pl-5'>
                            <input
                              type='checkbox'
                              name='penjagaan-kesihatan-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                              id='penjagaan-kesihatan-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                              checked={
                                penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan
                              }
                              onChange={() => {
                                setPenjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan(
                                  !penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan
                                );
                                setConfirmData({
                                  ...confirmData,
                                  penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan:
                                    !penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan,
                                });
                              }}
                              className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                            />
                            <label
                              htmlFor='penjagaan-kesihatan-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                              className='m-2 text-sm font-m'
                            >
                              nasihat berkaitan penjagaan kesihatan oral
                            </label>
                          </div>
                          <div className='flex items-center flex-row pl-5'>
                            <input
                              type='checkbox'
                              name='kanser-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                              id='kanser-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                              checked={
                                kanserMulutNasihatPergigianIndividuPromosiSekolahRawatan
                              }
                              onChange={() => {
                                setKanserMulutNasihatPergigianIndividuPromosiSekolahRawatan(
                                  !kanserMulutNasihatPergigianIndividuPromosiSekolahRawatan
                                );
                                setConfirmData({
                                  ...confirmData,
                                  kanserMulutNasihatPergigianIndividuPromosiSekolahRawatan:
                                    !kanserMulutNasihatPergigianIndividuPromosiSekolahRawatan,
                                });
                              }}
                              className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                            />
                            <label
                              htmlFor='kanser-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                              className='m-2 text-sm font-m'
                            >
                              nasihat berkaitan kanser mulut
                            </label>
                          </div>
                        </div>
                      </article>
                    </article>
                  </div>
                </section>
                <div className='grid grid-cols-1 md:grid-cols-3 col-start-1 lg:col-start-2 gap-2 col-span-1 md:col-span-2 '>
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

export default UserFormSekolahRawatan;
