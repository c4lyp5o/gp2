import { useState, useEffect } from 'react';
import { FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { Spinner } from 'react-awesome-spinners';
import moment from 'moment';
import Select from 'react-select';

import ConfirmCheck from './ConfirmationRawatan';

import { useGlobalUserAppContext } from '../../../context/userAppContext';

function UserFormSekolahRawatan() {
  const {
    userToken,
    reliefUserToken,
    username,
    userinfo,
    useParams,
    dateToday,
    masterDatePicker,
    dictionaryJenisFasiliti,
    toast,
  } = useGlobalUserAppContext();

  const OptionRawatan = [
    { value: 'lihat-semua', label: 'Lihat Semua' },
    { value: 'pengapan-fisur', label: 'Pengapan Fisur' },
    { value: 'sapuan-florida', label: 'Sapuan Florida' },
    { value: 'prr-jenis-1', label: 'PRR Jenis 1' },
    { value: 'tampalan', label: 'Jumlah Tampalan Dibuat' },
    { value: 'cabutan', label: 'Cabutan' },
    { value: 'penskaleran', label: 'Penskaleran' },
    { value: 'rujukan', label: 'Rujukan' },
  ];
  const [pilihanRawatan, setPilihanRawatan] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isShown, setIsShown] = useState(false);
  const [singlePersonSekolah, setSinglePersonSekolah] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { personSekolahId } = useParams();

  //confirm data
  const [confirmData, setConfirmData] = useState({});

  //kpbmpb
  const [allUsedKPBMPB, setAllUsedKPBMPB] = useState([]);
  const [menggunakanKPBMPB, setMenggunakanKPBMPB] = useState('');
  const [penggunaanKPBMPB, setPenggunaanKPBMPB] = useState('');

  const createdByUsername = username;
  const [tarikhRawatanSemasa, setTarikhRawatanSemasa] = useState('');
  const [engganTidakHadirRawatan, setEngganTidakHadirRawatan] = useState('');
  const [modalEnggan, setModalEnggan] = useState(false);
  const [modalTidakHadir, setModalTidakHadir] = useState(false);
  const [engganRawatan, setEngganRawatan] = useState('');
  const [kebenaranRawatan, setKebenaranRawatan] = useState('');
  const [tidakHadirRawatan, setTidakHadirRawatan] = useState('');
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
  const [absesSekolahRawatan, setAbsesSekolahRawatan] = useState(false);
  const [penskaleranSekolahRawatan, setPenskaleranSekolahRawatan] =
    useState(false);
  const [kesSelesaiSekolahRawatan, setKesSelesaiSekolahRawatan] = useState('');
  const [kesSelesaiIcdasSekolahRawatan, setKesSelesaiIcdasSekolahRawatan] =
    useState('');
  const [rujukSekolahRawatan, setRujukSekolahRawatan] = useState(false);
  const [
    rujukRawatanOrtodontikSekolahRawatan,
    setRujukRawatanOrtodontikSekolahRawatan,
  ] = useState(false);
  const [
    rujukPakarPatologiSekolahRawatan,
    setRujukPakarPatologiSekolahRawatan,
  ] = useState(false);
  const [
    rujukPakarRestoratifSekolahRawatan,
    setRujukPakarRestoratifSekolahRawatan,
  ] = useState(false);
  const [
    rujukPakarBedahMulutSekolahRawatan,
    setRujukPakarBedahMulutSekolahRawatan,
  ] = useState(false);
  const [
    rujukPakarPediatrikSekolahRawatan,
    setRujukPakarPediatrikSekolahRawatan,
  ] = useState(false);
  const [rujukKlinikSekolahRawatan, setRujukKlinikSekolahRawatan] =
    useState(false);
  const [rujukKlinikRawatanEndo, setRujukKlinikRawatanEndo] = useState(false);
  const [rujukKlinikCabutanGigiKekal, setRujukKlinikCabutanGigiKekal] =
    useState(false);
  const [rujukKesTrauma, setRujukKesTrauma] = useState(false);
  const [rujukMasalahKesihatan, setRujukMasalahKesihatan] = useState(false);
  const [rujukBukanWarganegara, setRujukBukanWarganegara] = useState(false);
  const [rujukLainLain, setRujukLainLain] = useState(false);
  const [rujukLainLanjutan, setRujukLainLanjutan] = useState('');
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
      required: true,
      onChange: (tarikhRawatanSemasa) => {
        const tempDate = moment(tarikhRawatanSemasa).format('YYYY-MM-DD');
        setTarikhRawatanSemasa(tempDate);
        setTarikhRawatanSemasaDatePicker(tarikhRawatanSemasa);
      },
      filterDate: (date) => {
        return moment() > date;
      },
      minDate: moment(moment(dateToday).format('YYYY') + '-03-19').toDate(), // bulan disember nnti kena buang line ni
      className:
        'appearance-none w-auto text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md uppercase flex flex-row lg:ml-2',
    });
  };

  // pull kpbmpb data for whole negeri that is used for this kp
  useEffect(() => {
    const getAllKPBMPBForNegeri = async () => {
      try {
        const dataKPBMPB = await axios.get(
          `/api/v1/query/kpbmpb/sekolah?personSekolahId=${personSekolahId}`,
          {
            headers: {
              Authorization: `Bearer ${
                reliefUserToken ? reliefUserToken : userToken
              }`,
            },
          }
        );
        setAllUsedKPBMPB(dataKPBMPB.data.penggunaanKPBMPBForPtSekolah);
        console.log(dataKPBMPB.data.penggunaanKPBMPBForPtSekolah);
      } catch (error) {
        console.log(error);
        // toast.error(
        //   'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: user-form-umum-header-getallusedkpbmpb'
        // );
      }
    };
    getAllKPBMPBForNegeri();
  }, [reliefUserToken, userToken]);

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
    // if no data in confirmData, then return
    if (Object.keys(confirmData).length === 0) {
      toast.error('Sila pastikan anda telah mengisi data anda', {
        autoClose: 3000,
      });
      return;
    }

    let mdcMdtbNum = '';
    if (!userinfo.mdtbNumber) {
      mdcMdtbNum = userinfo.mdcNumber;
    }
    if (!userinfo.mdcNumber) {
      mdcMdtbNum = userinfo.mdtbNumber;
    }

    let statusRawatan = '';
    if (
      kesSelesaiSekolahRawatan === 'tidak-kes-selesai-penyata-akhir-2' ||
      tidakHadirRawatan !== 'ya-kehadiran-rawatan' ||
      engganRawatan !== 'ya-enggan-rawatan'
    ) {
      statusRawatan = 'belum selesai';
    }
    if (engganRawatan === 'ya-enggan-rawatan') {
      statusRawatan = 'enggan rawatan';
    }
    if (tidakHadirRawatan === 'ya-kehadiran-rawatan') {
      statusRawatan = 'tidak hadir rawatan';
    }
    if (
      kesSelesaiSekolahRawatan === 'ya-kes-selesai-penyata-akhir-2' ||
      singlePersonSekolah.statusRawatan === 'selesai'
    ) {
      statusRawatan = 'selesai';
    }
    let kesSelesaiMmi = false;
    if (
      kesSelesaiIcdasSekolahRawatan ===
        'ya-kes-selesai-icdas-penyata-akhir-2' ||
      singlePersonSekolah.kesSelesaiMmi === true
    ) {
      kesSelesaiMmi = true;
    }

    setIsSubmitting(true);
    await toast
      .promise(
        axios.post(
          `/api/v1/sekolah/rawatan/${personSekolahId}`,
          {
            createdByUsername,
            createdByMdcMdtb: mdcMdtbNum,
            //
            statusRawatan,
            kesSelesaiMmi,
            tarikhRawatanSemasa,
            menggunakanKPBMPB,
            penggunaanKPBMPB,
            engganTidakHadirRawatan,
            engganRawatan,
            kebenaranRawatan,
            tidakHadirRawatan,
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
            rujukRawatanOrtodontikSekolahRawatan,
            rujukPakarPatologiSekolahRawatan,
            rujukPakarRestoratifSekolahRawatan,
            rujukPakarBedahMulutSekolahRawatan,
            rujukPakarPediatrikSekolahRawatan,
            rujukKlinikSekolahRawatan,
            rujukKlinikRawatanEndo,
            rujukKlinikCabutanGigiKekal,
            rujukKesTrauma,
            rujukMasalahKesihatan,
            rujukBukanWarganegara,
            rujukLainLain,
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
          <div className='h-full p-1 px-2 md:px-10 grid grid-rows-[1fr_7fr] gap-2'>
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
                      {/* <div className='text-xs flex flex-row '>
                        <h2 className='font-semibold'>NO IC :</h2>
                        <p className='ml-1'>{singlePersonSekolah.nomborId}</p>
                      </div> */}
                      <div className='text-xs flex flex-row '>
                        <h2 className='font-semibold'>JANTINA :</h2>
                        <p className='ml-1'>{singlePersonSekolah.jantina}</p>
                      </div>
                      {/* <div className='text-xs flex flex-row '>
                        <h2 className='font-semibold'>TARIKH LAHIR :</h2>
                        <p className='ml-1'>
                          {singlePersonSekolah.tarikhLahir}
                        </p>
                      </div> */}
                      <div className='text-xs flex flex-row '>
                        <h2 className='font-semibold'>KETURUNAN :</h2>
                        <p className='ml-1'>{singlePersonSekolah.keturunan}</p>
                      </div>
                      <div className='text-xs flex flex-row '>
                        <h2 className='font-semibold'>WARGANEGARA :</h2>
                        <p className='ml-1'>
                          {singlePersonSekolah.warganegara}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className='flex flex-row pl-5'>
                    <h2 className='font-semibold text-xs'>NAMA :</h2>
                    <p className='ml-1 text-xs'>{singlePersonSekolah.nama}</p>
                  </div>
                  <div className='flex flex-row pl-5'>
                    <h2 className='font-semibold text-xs'>UMUR :</h2>
                    <p className='ml-1 text-xs'>{singlePersonSekolah.umur}</p>
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
                    <div className='flex flex-row pl-5'>
                      <h2 className='font-semibold text-xs'>STATUS OKU :</h2>
                      <p className='ml-1 text-xs'>
                        {singlePersonSekolah.statusOku === ':'
                          ? 'BUKAN OKU'
                          : 'OKU'}
                      </p>
                    </div>
                  </div>
                  <div className='lg:pt-10'>
                    <div className='flex flex-row pl-5'>
                      <h2 className='font-semibold text-xs'>
                        TAHUN / TINGKATAN :
                      </h2>
                      <p className='ml-1 text-xs'>
                        {singlePersonSekolah.tahunTingkatan}
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
                  <article className='grid grid-cols-1 lg:grid-cols-2 border border-userBlack pl-3 p-2 rounded-md col-span-1 md:col-span-2'>
                    <h4 className='font-bold flex flex-row pl-5 col-span-1 lg:col-span-2 pb-2'>
                      kedatangan
                    </h4>
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
                          setModalEnggan(true);
                        }}
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                      />
                      <label
                        htmlFor='enggan-rawatan'
                        className='m-2 text-sm font-m'
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
                          setModalTidakHadir(true);
                        }}
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                      />
                      <label
                        htmlFor='tidak-hadir-rawatan'
                        className='m-2 text-sm font-m'
                      >
                        tidak hadir
                      </label>
                      {engganTidakHadirRawatan ? (
                        <span
                          className='px-2 py-1 bg-user4 text-userWhite text-xs rounded-full cursor-pointer hover:bg-user2'
                          onClick={() => {
                            setEngganTidakHadirRawatan('');
                            setEngganRawatan('');
                            setKebenaranRawatan('');
                            setTidakHadirRawatan('');
                          }}
                        >
                          X
                        </span>
                      ) : null}
                    </div>
                    {tidakHadirRawatan === 'ya-kehadiran-rawatan' ||
                    engganRawatan === 'ya-enggan-rawatan' ? (
                      <div>
                        <p className='flex text-left flex-row pl-4 p-1 text-sm'>
                          {engganRawatan === 'ya-enggan-rawatan' ? (
                            <p>
                              {kebenaranRawatan === 'ya-kebenaran-rawatan' ? (
                                <p>
                                  Enggan Rawatan{' '}
                                  <span className='text-user7 font-bold'>
                                    DENGAN
                                  </span>{' '}
                                  kebenaran rawatan daripada ibu bapa/penjaga
                                </p>
                              ) : (
                                <p>
                                  Enggan Rawatan{' '}
                                  <span className='text-user6 font-bold'>
                                    TANPA
                                  </span>{' '}
                                  kebenaran rawatan daripada ibu bapa/penjaga
                                </p>
                              )}
                            </p>
                          ) : null}
                          {tidakHadirRawatan === 'ya-kehadiran-rawatan' ? (
                            <p>
                              Murid <strong>TIDAK HADIR</strong> Rawatan
                            </p>
                          ) : null}
                        </p>
                      </div>
                    ) : (
                      <div className='flex flex-row'>
                        <p className='flex items-center flex-row text-m font-m px-5 '>
                          tarikh:<span className='text-user6'>*</span>
                        </p>
                        <TarikhRawatanSemasa />
                      </div>
                    )}
                    {allUsedKPBMPB.length > 0 && (
                      <div className='flex flex-col'>
                        <div className='flex flex-row items-center pl-5'>
                          <p className='flex flex-row items-center font-bold whitespace-nowrap mr-2'>
                            Menggunakan KPB / MPB
                            <span className='font-semibold text-user6'>*</span>
                          </p>
                          <input
                            required
                            type='radio'
                            name='menggunakan-kpb-mpb'
                            id='ya-menggunakan-kpb-mpb'
                            value='ya-menggunakan-kpb-mpb'
                            checked={
                              menggunakanKPBMPB === 'ya-menggunakan-kpb-mpb'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              setMenggunakanKPBMPB(e.target.value);
                            }}
                            className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                          />
                          <label
                            htmlFor='ya-menggunakan-kpb-mpb'
                            className='m-2 text-sm font-m'
                          >
                            Ya
                          </label>
                          <input
                            required
                            type='radio'
                            name='menggunakan-kpb-mpb'
                            id='tidak-menggunakan-kpb-mpb'
                            value='tidak-menggunakan-kpb-mpb'
                            checked={
                              menggunakanKPBMPB === 'tidak-menggunakan-kpb-mpb'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              setMenggunakanKPBMPB(e.target.value);
                            }}
                            className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                          />
                          <label
                            htmlFor='tidak-menggunakan-kpb-mpb'
                            className='m-2 text-sm font-m'
                          >
                            Tidak
                          </label>
                        </div>
                        {menggunakanKPBMPB === 'ya-menggunakan-kpb-mpb' ? (
                          <div className='flex flex-row items-center'>
                            <p className='flex flex-row items-center pl-5 font-bold col-span-2 whitespace-nowrap'>
                              Penggunaan KPB / MPB :
                            </p>
                            <select
                              name='penggunaan-kpb-mpb'
                              id='penggunaan-kpb-mpb'
                              value={penggunaanKPBMPB}
                              onChange={(e) => {
                                setPenggunaanKPBMPB(e.target.value);
                              }}
                              className='appearance-none w-44 h-min leading-7 m-3 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user3 focus:outline-none shadow-md'
                            >
                              <option value=''>Pilih Jika Berkenaan</option>
                              {allUsedKPBMPB.map((kpbmpb) => (
                                <option value={kpbmpb.nama}>
                                  {
                                    dictionaryJenisFasiliti[
                                      kpbmpb.jenisFasiliti
                                    ]
                                  }{' '}
                                  | {kpbmpb.nama}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : null}
                      </div>
                    )}
                    <div>
                      <div
                        className={` absolute z-30 inset-x-1 lg:inset-x-60 inset-y-6 lg:inset-y-28 bg-userWhite rounded-md pb-5 ${
                          modalEnggan ? 'block' : 'hidden'
                        }`}
                      >
                        <h5 className='bg-user9 text-userWhite font-semibold text-xl h-7 rounded-t-md'>
                          PERHATIAN
                        </h5>
                        <h1 className='font-bold text-xl'>ENGGAN</h1>
                        <p className='p-2'>
                          Murid yang <strong>ENGGAN</strong> Rawatan sehingga
                          hari terakhir Pasukan Pergigian berada di Sekolah
                        </p>
                        <div className='flex flex-row justify-center mt-2'>
                          <div>
                            <input
                              type='radio'
                              name='ya-tidak-enggan-rawatan'
                              id='ya-enggan-rawatan'
                              value='ya-enggan-rawatan'
                              className='peer hidden'
                              checked={
                                engganRawatan === 'ya-enggan-rawatan'
                                  ? true
                                  : false
                              }
                              onChange={(e) => {
                                setEngganRawatan(e.target.value);
                                setConfirmData({
                                  ...confirmData,
                                  engganRawatan: e.target.value,
                                });
                              }}
                            />
                            <label
                              htmlFor='ya-enggan-rawatan'
                              className='text-sm peer-checked:ring-2 peer-checked:ring-user2 text-userBlack text-opacity-70 py-2 px-7 bg-admin5 m-3 rounded-md cursor-pointer focus:outline-none peer-checked:border-none'
                            >
                              Ya
                            </label>
                          </div>
                          <div>
                            <input
                              type='radio'
                              name='ya-tidak-enggan-rawatan'
                              id='tidak-enggan-rawatan'
                              value='tidak-enggan-rawatan'
                              className='peer hidden'
                              checked={
                                engganRawatan === 'tidak-enggan-rawatan'
                                  ? true
                                  : false
                              }
                              onChange={(e) => {
                                setEngganRawatan(e.target.value);
                                setConfirmData({
                                  ...confirmData,
                                  engganRawatan: e.target.value,
                                });
                                setModalEnggan(false);
                                setEngganTidakHadirRawatan('');
                              }}
                            />
                            <label
                              htmlFor='tidak-enggan-rawatan'
                              className='text-sm peer-checked:ring-2 peer-checked:ring-user2 text-userBlack text-opacity-70 py-2 px-5 bg-admin5 m-3 rounded-md cursor-pointer focus:outline-none peer-checked:border-none'
                            >
                              Tidak
                            </label>
                          </div>
                        </div>
                        {engganRawatan === 'ya-enggan-rawatan' ? (
                          <p className='mt-2'>
                            Adakah murid <strong>DIBERI</strong> kebenaran
                            rawatan daripada ibu bapa/penjaga?
                          </p>
                        ) : null}
                        {engganRawatan === 'ya-enggan-rawatan' ? (
                          <div className='flex flex-row justify-center mt-2'>
                            <div>
                              <input
                                type='radio'
                                name='ya-tidak-kebenaran-rawatan'
                                id='ya-kebenaran-rawatan'
                                value='ya-kebenaran-rawatan'
                                className='peer hidden'
                                checked={
                                  kebenaranRawatan === 'ya-kebenaran-rawatan'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setKebenaranRawatan(e.target.value);
                                  setConfirmData({
                                    ...confirmData,
                                    kebenaranRawatan: e.target.value,
                                  });
                                  setModalEnggan(false);
                                }}
                              />
                              <label
                                htmlFor='ya-kebenaran-rawatan'
                                className='text-sm peer-checked:ring-2 peer-checked:ring-user2 text-userBlack text-opacity-70 py-2 px-7 bg-admin5 m-3 rounded-md cursor-pointer focus:outline-none peer-checked:border-none'
                              >
                                Ya
                              </label>
                            </div>
                            <div>
                              <input
                                type='radio'
                                name='ya-tidak-kebenaran-rawatan'
                                id='tidak-kebenaran-rawatan'
                                value='tidak-kebenaran-rawatan'
                                className='peer hidden'
                                checked={
                                  kebenaranRawatan === 'tidak-kebenaran-rawatan'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setKebenaranRawatan(e.target.value);
                                  setConfirmData({
                                    ...confirmData,
                                    kebenaranRawatan: e.target.value,
                                  });
                                  setModalEnggan(false);
                                }}
                              />
                              <label
                                htmlFor='tidak-kebenaran-rawatan'
                                className='text-sm peer-checked:ring-2 peer-checked:ring-user2 text-userBlack text-opacity-70 py-2 px-5 bg-admin5 m-3 rounded-md cursor-pointer focus:outline-none peer-checked:border-none'
                              >
                                Tidak
                              </label>
                            </div>
                          </div>
                        ) : null}
                      </div>
                      <div
                        className={` absolute z-30 inset-x-1 lg:inset-x-60 inset-y-28 bg-userWhite rounded-md pb-5 ${
                          modalTidakHadir ? 'block' : 'hidden'
                        }`}
                      >
                        <h5 className='bg-user9 text-userWhite font-semibold text-xl h-7 rounded-t-md'>
                          PERHATIAN
                        </h5>
                        <h1 className='font-bold text-xl'>TIDAK HADIR</h1>
                        <p>
                          Murid yang TIDAK HADIR Rawatan sehingga hari terakhir
                          Pasukan Pergigian berada di Sekolah
                        </p>
                        <div className='flex flex-row justify-center mt-2'>
                          <div>
                            <input
                              type='radio'
                              name='ya-tidak-kehadiran-rawatan'
                              id='ya-kehadiran-rawatan'
                              value='ya-kehadiran-rawatan'
                              className='peer hidden'
                              checked={
                                tidakHadirRawatan === 'ya-kehadiran-rawatan'
                                  ? true
                                  : false
                              }
                              onChange={(e) => {
                                setTidakHadirRawatan(e.target.value);
                                setConfirmData({
                                  ...confirmData,
                                  tidakHadirRawatan: e.target.value,
                                });
                                setModalTidakHadir(false);
                              }}
                            />
                            <label
                              htmlFor='ya-kehadiran-rawatan'
                              className='text-sm peer-checked:ring-2 peer-checked:ring-user2 text-userBlack text-opacity-70 py-2 px-7 bg-admin5 m-3 rounded-md cursor-pointer focus:outline-none peer-checked:border-none'
                            >
                              Ya
                            </label>
                          </div>
                          <div>
                            <input
                              type='radio'
                              name='ya-tidak-kehadiran-rawatan'
                              id='tidak-kehadiran-rawatan'
                              value='tidak-kehadiran-rawatan'
                              className='peer hidden'
                              checked={
                                tidakHadirRawatan === 'tidak-kehadiran-rawatan'
                                  ? true
                                  : false
                              }
                              onChange={(e) => {
                                setTidakHadirRawatan(e.target.value);
                                setConfirmData({
                                  ...confirmData,
                                  tidakHadirRawatan: e.target.value,
                                });
                                setModalTidakHadir(false);
                                setEngganTidakHadirRawatan('');
                              }}
                            />
                            <label
                              htmlFor='tidak-kehadiran-rawatan'
                              className='text-sm peer-checked:ring-2 peer-checked:ring-user2 text-userBlack text-opacity-70 py-2 px-5 bg-admin5 m-3 rounded-md cursor-pointer focus:outline-none peer-checked:border-none'
                            >
                              Tidak
                            </label>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`absolute z-10 inset-0 bg-user1 bg-opacity-30 ${
                          modalTidakHadir ? 'block' : 'hidden'
                        }`}
                      />
                      <div
                        className={`absolute z-10 inset-0 bg-user1 bg-opacity-30 ${
                          modalEnggan ? 'block' : 'hidden'
                        }`}
                      />
                    </div>
                  </article>
                  {tidakHadirRawatan === 'ya-kehadiran-rawatan' ||
                  engganRawatan === 'ya-enggan-rawatan' ? null : (
                    <article className='border border-userBlack pl-3 p-2 rounded-md col-span-1 md:col-span-2'>
                      <h1 className='text-lg font-bold flex pl-4'>
                        Sila Pilih Rawatan
                      </h1>
                      <Select
                        isMulti
                        name='promosi'
                        options={OptionRawatan}
                        placeholder='Sila Pilih Rawatan'
                        className='basic-multi-select'
                        classNamePrefix='select'
                        onChange={(e) => {
                          setPilihanRawatan(e.map((item) => item.value));
                        }}
                      />
                    </article>
                  )}
                  {pilihanRawatan.includes('pengapan-fisur') ||
                  pilihanRawatan.includes('lihat-semua') ? (
                    <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                      <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                        Pengapan Fisur
                        <FaInfoCircle title='Fissure Sealant' className='m-2' />
                      </h4>
                      {/* <div className='flex flex-row items-center pl-11 col-span-2'>
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
                      </div> */}
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
                    </article>
                  ) : null}
                  {pilihanRawatan.includes('sapuan-florida') ||
                  pilihanRawatan.includes('lihat-semua') ? (
                    <article className='grid grid-cols-2 auto-rows-min gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                      <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                        Sapuan Fluorida (FV)
                        <FaInfoCircle
                          title='Fluoride Varnish Application'
                          className='m-2'
                        />
                      </h4>
                      <div className='flex flex-row items-center pl-5 col-span-2'>
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
                      {/* <div className='flex flex-row items-center pl-5 col-span-2'>
                        <label
                          htmlFor='baru-jumlah-murid-diberi-fv'
                          className='text-sm font-m'
                        >
                          Jumlah gigi kekal diberi Sapuan Florida (FV)
                        </label>
                        <input
                          type='number'
                          name='baru-jumlah-murid-diberi-fv'
                          id='baru-jumlah-murid-diberi-fv'
                          value={baruJumlahGigiKekalDiberiFv}
                          onChange={(e) => {
                            setBaruJumlahGigiKekalDiberiFv(e.target.value);
                            setConfirmData({
                              ...confirmData,
                              baruJumlahGigiKekalDiberiFv: e.target.value,
                            });
                          }}
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          min='0'
                          max='16'
                          required
                        />
                      </div> */}
                    </article>
                  ) : null}
                  {pilihanRawatan.includes('prr-jenis-1') ||
                  pilihanRawatan.includes('lihat-semua') ? (
                    <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                      <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                        Resin Pencegahan Jenis 1 (PRR Type I)
                      </h4>
                      {/* <div className='flex flex-row items-center pl-11 col-span-2'>
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
                          murid dibuat Resin Pencegahan Jenis 1 (PRR Type I)
                        </label>
                      </div> */}
                      <div className='flex flex-row items-center pl-5 col-span-2'>
                        <label
                          htmlFor='baru-jumlah-gigi-kekal-diberi-prr-jenis-1'
                          className='text-sm font-m'
                        >
                          jumlah gigi kekal dibuat Resin Pencegahan Jenis 1 (PRR
                          Type I)
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
                    </article>
                  ) : null}
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
                  {pilihanRawatan.includes('cabutan') ||
                  pilihanRawatan.includes('lihat-semua') ? (
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
                  ) : null}
                  {pilihanRawatan.includes('tampalan') ||
                  pilihanRawatan.includes('lihat-semua') ? (
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
                        />
                      </div>
                    </article>
                  ) : null}
                  <div className='grid gap-2'>
                    {pilihanRawatan.includes('penskaleran') ||
                    pilihanRawatan.includes('lihat-semua') ? (
                      <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md auto-rows-min'>
                        <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                          penskaleran
                        </h4>
                        {/* <div className='grid grid-cols-1 lg:grid-cols-2 col-span-2'>
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
                            <input
                              type='checkbox'
                              name='abses-penyata-akhir-2'
                              id='abses-penyata-akhir-2'
                              checked={absesSekolahRawatan}
                              onChange={(e) => {
                                setAbsesSekolahRawatan(!absesSekolahRawatan);
                                setConfirmData({
                                  ...confirmData,
                                  absesSekolahRawatan: !absesSekolahRawatan,
                                });
                              }}
                              className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                            />
                            <label
                              htmlFor='abses-penyata-akhir-2'
                              className='text-sm font-m mx-2'
                            >
                              abses
                            </label>
                          </div>
                        </div> */}
                        <div className='flex flex-row items-center pl-5 col-start-1'>
                          <input
                            type='checkbox'
                            name='penskaleran-penyata-akhir-2'
                            id='penskaleran-penyata-akhir-2'
                            checked={penskaleranSekolahRawatan}
                            onChange={(e) => {
                              setPenskaleranSekolahRawatan(
                                !penskaleranSekolahRawatan
                              );
                              setConfirmData({
                                ...confirmData,
                                penskaleranSekolahRawatan:
                                  !penskaleranSekolahRawatan,
                              });
                            }}
                            className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                          />
                          <label
                            htmlFor='penskaleran-penyata-akhir-2'
                            className='text-sm font-m mx-2'
                          >
                            Penskaleran
                          </label>
                        </div>
                      </article>
                    ) : null}
                    {pilihanRawatan.includes('rujukan') ||
                    pilihanRawatan.includes('lihat-semua') ? (
                      <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md auto-rows-min'>
                        {/* <div className='flex flex-row items-center pl-5 m-2'>
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
                            className='mx-2 font-bold'
                          >
                            rujukan
                          </label>
                        </div> */}
                        <h4 className='font-bold flex flex-row pl-5'>
                          rujukan
                        </h4>
                        <div className=' flex flex-row items-center m-2 pl-5 mt-3'>
                          <input
                            type='checkbox'
                            name='rujukan-ke-klinik'
                            id='rujukan-ke-klinik'
                            checked={rujukKlinikSekolahRawatan}
                            onChange={() => {
                              setRujukKlinikSekolahRawatan(
                                !rujukKlinikSekolahRawatan
                              );
                              setConfirmData({
                                ...confirmData,
                                rujukKlinikSekolahRawatan:
                                  !rujukKlinikSekolahRawatan,
                              });
                            }}
                            className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                          />
                          <label
                            htmlFor='rujukan-ke-klinik'
                            className='mx-2 text-sm font-m'
                          >
                            Rujukan Ke Klinik Pergigian
                          </label>
                        </div>
                        {rujukKlinikSekolahRawatan && (
                          <div className='pl-10'>
                            <div className='flex items-center pl-5'>
                              <input
                                required={
                                  rujukKlinikRawatanEndo === true ||
                                  rujukKlinikCabutanGigiKekal === true ||
                                  rujukKesTrauma === true ||
                                  rujukMasalahKesihatan === true ||
                                  rujukLainLain === true ||
                                  rujukBukanWarganegara === true
                                    ? false
                                    : true
                                }
                                onInvalid={(e) => {
                                  e.target.setCustomValidity(
                                    'Sila pilih sekurang-kurangnya satu pilihan'
                                  );
                                }}
                                onInput={(e) => {
                                  e.target.setCustomValidity('');
                                }}
                                type='checkbox'
                                name='rujuk-klinik-rawatan-endo'
                                id='rujuk-klinik-rawatan-endo'
                                checked={rujukKlinikRawatanEndo}
                                onChange={() => {
                                  setRujukKlinikRawatanEndo(
                                    !rujukKlinikRawatanEndo
                                  );
                                  setConfirmData({
                                    ...confirmData,
                                    rujukKlinikRawatanEndo:
                                      !rujukKlinikRawatanEndo,
                                  });
                                }}
                                className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                              />
                              <label
                                htmlFor='rujuk-klinik-rawatan-endo'
                                className='m-2 text-sm font-m'
                              >
                                Rawatan Endodontik
                              </label>
                            </div>
                            <div className='flex items-center pl-5'>
                              <input
                                required={
                                  rujukKlinikRawatanEndo === true ||
                                  rujukKlinikCabutanGigiKekal === true ||
                                  rujukKesTrauma === true ||
                                  rujukMasalahKesihatan === true ||
                                  rujukLainLain === true ||
                                  rujukBukanWarganegara === true
                                    ? false
                                    : true
                                }
                                onInvalid={(e) => {
                                  e.target.setCustomValidity(
                                    'Sila pilih sekurang-kurangnya satu pilihan'
                                  );
                                }}
                                onInput={(e) => {
                                  e.target.setCustomValidity('');
                                }}
                                type='checkbox'
                                name='rujuk-klinik-cabutan-gigi-kekal'
                                id='rujuk-klinik-cabutan-gigi-kekal'
                                checked={rujukKlinikCabutanGigiKekal}
                                onChange={() => {
                                  setRujukKlinikCabutanGigiKekal(
                                    !rujukKlinikCabutanGigiKekal
                                  );
                                  setConfirmData({
                                    ...confirmData,
                                    rujukKlinikCabutanGigiKekal:
                                      !rujukKlinikCabutanGigiKekal,
                                  });
                                }}
                                className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                              />
                              <label
                                htmlFor='rujuk-klinik-cabutan-gigi-kekal'
                                className='m-2 text-sm font-m'
                              >
                                Rujukan Cabutan Gigi Kekal
                              </label>
                            </div>
                            <div className='flex items-center pl-5'>
                              <input
                                required={
                                  rujukKlinikRawatanEndo === true ||
                                  rujukKlinikCabutanGigiKekal === true ||
                                  rujukKesTrauma === true ||
                                  rujukMasalahKesihatan === true ||
                                  rujukLainLain === true ||
                                  rujukBukanWarganegara === true
                                    ? false
                                    : true
                                }
                                onInvalid={(e) => {
                                  e.target.setCustomValidity(
                                    'Sila pilih sekurang-kurangnya satu pilihan'
                                  );
                                }}
                                onInput={(e) => {
                                  e.target.setCustomValidity('');
                                }}
                                type='checkbox'
                                name='rujuk-kes-trauma'
                                id='rujuk-kes-trauma'
                                checked={rujukKesTrauma}
                                onChange={() => {
                                  setRujukKesTrauma(!rujukKesTrauma);
                                  setConfirmData({
                                    ...confirmData,
                                    rujukKesTrauma: !rujukKesTrauma,
                                  });
                                }}
                                className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                              />
                              <label
                                htmlFor='rujuk-kes-trauma'
                                className='m-2 text-sm font-m'
                              >
                                Rujukan kes trauma
                              </label>
                            </div>
                            <div className='flex items-center pl-5'>
                              <input
                                required={
                                  rujukKlinikRawatanEndo === true ||
                                  rujukKlinikCabutanGigiKekal === true ||
                                  rujukKesTrauma === true ||
                                  rujukMasalahKesihatan === true ||
                                  rujukLainLain === true ||
                                  rujukBukanWarganegara === true
                                    ? false
                                    : true
                                }
                                onInvalid={(e) => {
                                  e.target.setCustomValidity(
                                    'Sila pilih sekurang-kurangnya satu pilihan'
                                  );
                                }}
                                onInput={(e) => {
                                  e.target.setCustomValidity('');
                                }}
                                type='checkbox'
                                name='rujuk-masalah-kesihatan'
                                id='rujuk-masalah-kesihatan'
                                checked={rujukMasalahKesihatan}
                                onChange={() => {
                                  setRujukMasalahKesihatan(
                                    !rujukMasalahKesihatan
                                  );
                                  setConfirmData({
                                    ...confirmData,
                                    rujukMasalahKesihatan:
                                      !rujukMasalahKesihatan,
                                  });
                                }}
                                className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                              />
                              <label
                                htmlFor='rujuk-masalah-kesihatan'
                                className='m-2 text-sm font-m'
                              >
                                Rujukan Masalah Kesihatan
                              </label>
                            </div>
                            <div className='flex items-center pl-5'>
                              <input
                                required={
                                  rujukKlinikRawatanEndo === true ||
                                  rujukKlinikCabutanGigiKekal === true ||
                                  rujukKesTrauma === true ||
                                  rujukMasalahKesihatan === true ||
                                  rujukLainLain === true ||
                                  rujukBukanWarganegara === true
                                    ? false
                                    : true
                                }
                                onInvalid={(e) => {
                                  e.target.setCustomValidity(
                                    'Sila pilih sekurang-kurangnya satu pilihan'
                                  );
                                }}
                                onInput={(e) => {
                                  e.target.setCustomValidity('');
                                }}
                                type='checkbox'
                                name='rujuk-bukan-warganegara'
                                id='rujuk-bukan-warganegara'
                                checked={rujukBukanWarganegara}
                                onChange={() => {
                                  setRujukBukanWarganegara(
                                    !rujukBukanWarganegara
                                  );
                                  setConfirmData({
                                    ...confirmData,
                                    rujukBukanWarganegara:
                                      !rujukBukanWarganegara,
                                  });
                                }}
                                className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                              />
                              <label
                                htmlFor='rujuk-bukan-warganegara'
                                className='m-2 text-sm font-m'
                              >
                                Rujukan Bukan Warganegara
                              </label>
                            </div>
                            <div className='flex items-center pl-5'>
                              <input
                                required={
                                  rujukKlinikRawatanEndo === true ||
                                  rujukKlinikCabutanGigiKekal === true ||
                                  rujukKesTrauma === true ||
                                  rujukMasalahKesihatan === true ||
                                  rujukLainLain === true ||
                                  rujukBukanWarganegara === true
                                    ? false
                                    : true
                                }
                                onInvalid={(e) => {
                                  e.target.setCustomValidity(
                                    'Sila pilih sekurang-kurangnya satu pilihan'
                                  );
                                }}
                                onInput={(e) => {
                                  e.target.setCustomValidity('');
                                }}
                                type='checkbox'
                                name='rujuk-lain-lain'
                                id='rujuk-lain-lain'
                                checked={rujukLainLain}
                                onChange={() => {
                                  setRujukLainLain(!rujukLainLain);
                                  setConfirmData({
                                    ...confirmData,
                                    rujukLainLain: !rujukLainLain,
                                  });
                                }}
                                className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                              />
                              <label
                                htmlFor='rujuk-lain-lain'
                                className='m-2 text-sm font-m'
                              >
                                Rujukan Lain-lain
                              </label>
                              {rujukLainLain && (
                                <input
                                  type='text'
                                  id='nama-umum'
                                  name='nama-umum'
                                  value={rujukLainLanjutan}
                                  onChange={(e) => {
                                    setRujukLainLanjutan(e.target.value);
                                    setConfirmData({
                                      ...confirmData,
                                      rujukLainLanjutan: e.target.value,
                                    });
                                  }}
                                  className='appearance-none w-full pl-3 pr-7 py-1 ring focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md'
                                />
                              )}
                            </div>
                            <div className='flex items-center pl-5'></div>
                          </div>
                        )}
                        <div className=' flex flex-row items-center m-2 pl-5'>
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
                            className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                          />
                          <label
                            htmlFor='rawatan-ortodontik-penyata-akhir-2'
                            className='mx-2 text-sm font-m'
                          >
                            Rujukan Ke Pakar ortodontik
                          </label>
                        </div>
                        <div className=' flex flex-row items-center m-2 pl-5'>
                          <input
                            type='checkbox'
                            name='rujukan-pakar-patologi'
                            id='rujukan-pakar-patologi'
                            checked={rujukPakarPatologiSekolahRawatan}
                            onChange={() => {
                              setRujukPakarPatologiSekolahRawatan(
                                !rujukPakarPatologiSekolahRawatan
                              );
                              setConfirmData({
                                ...confirmData,
                                rujukPakarPatologiSekolahRawatan:
                                  !rujukPakarPatologiSekolahRawatan,
                              });
                            }}
                            className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                          />
                          <label
                            htmlFor='rujukan-pakar-patologi'
                            className='mx-2 text-sm font-m'
                          >
                            Rujukan Ke Pakar Patologi Mulut dan Perubatan Mulut
                          </label>
                        </div>
                        <div className=' flex flex-row items-center m-2 pl-5'>
                          <input
                            type='checkbox'
                            name='rujukan-pakar-restoratif'
                            id='rujukan-pakar-restoratif'
                            checked={rujukPakarRestoratifSekolahRawatan}
                            onChange={() => {
                              setRujukPakarRestoratifSekolahRawatan(
                                !rujukPakarRestoratifSekolahRawatan
                              );
                              setConfirmData({
                                ...confirmData,
                                rujukPakarRestoratifSekolahRawatan:
                                  !rujukPakarRestoratifSekolahRawatan,
                              });
                            }}
                            className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                          />
                          <label
                            htmlFor='rujukan-pakar-restoratif'
                            className='mx-2 text-sm font-m'
                          >
                            Rujukan Ke Pakar Restoratif
                          </label>
                        </div>
                        <div className=' flex flex-row items-center m-2 pl-5'>
                          <input
                            type='checkbox'
                            name='rujukan-pakar-bedah-mulut'
                            id='rujukan-pakar-bedah-mulut'
                            checked={rujukPakarBedahMulutSekolahRawatan}
                            onChange={() => {
                              setRujukPakarBedahMulutSekolahRawatan(
                                !rujukPakarBedahMulutSekolahRawatan
                              );
                              setConfirmData({
                                ...confirmData,
                                rujukPakarBedahMulutSekolahRawatan:
                                  !rujukPakarBedahMulutSekolahRawatan,
                              });
                            }}
                            className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                          />
                          <label
                            htmlFor='rujukan-pakar-bedah-mulut'
                            className='mx-2 text-sm font-m'
                          >
                            Rujukan Ke Pakar bedah mulut dan maksilofasial
                          </label>
                        </div>
                        <div className=' flex flex-row items-center m-2 pl-5'>
                          <input
                            type='checkbox'
                            name='rujukan-pakar-pediatrik'
                            id='rujukan-pakar-pediatrik'
                            checked={rujukPakarPediatrikSekolahRawatan}
                            onChange={() => {
                              setRujukPakarPediatrikSekolahRawatan(
                                !rujukPakarPediatrikSekolahRawatan
                              );
                              setConfirmData({
                                ...confirmData,
                                rujukPakarPediatrikSekolahRawatan:
                                  !rujukPakarPediatrikSekolahRawatan,
                              });
                            }}
                            className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                          />
                          <label
                            htmlFor='rujukan-pakar-pediatrik'
                            className='mx-2 text-sm font-m'
                          >
                            Rujukan Ke Pakar Pergigian Pediatrik
                          </label>
                        </div>
                      </article>
                    ) : null}
                  </div>
                  {tidakHadirRawatan === 'ya-kehadiran-rawatan' ||
                  engganRawatan === 'ya-enggan-rawatan' ? null : (
                    <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md auto-rows-min col-start-1'>
                      <div className='grid grid-cols-2 lg:grid-cols-[1fr_3fr] items-center pl-5'>
                        <label
                          htmlFor='kes-selesai-penyata-akhir-2'
                          className='mr-2 text-lg font-bold flex'
                        >
                          kes selesai
                          {singlePersonSekolah.statusRawatan ===
                          'selesai' ? null : (
                            <span className='text-user9'>*</span>
                          )}
                        </label>
                        {singlePersonSekolah.statusRawatan === 'selesai' ? (
                          <FaCheckCircle className='text-user7 text-center text-lg' />
                        ) : (
                          // <input
                          //   type='checkbox'
                          //   name='kes-selesai-penyata-akhir-2'
                          //   id='kes-selesai-penyata-akhir-2'
                          //   checked={kesSelesaiSekolahRawatan}
                          //   onChange={() => {
                          //     setKesSelesaiSekolahRawatan(
                          //       !kesSelesaiSekolahRawatan
                          //     );
                          //     setConfirmData({
                          //       ...confirmData,
                          //       kesSelesaiSekolahRawatan:
                          //         !kesSelesaiSekolahRawatan,
                          //     });
                          //   }}
                          //   className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                          // />
                          <div className='flex items-center'>
                            <input
                              required
                              type='radio'
                              name='kes-selesai-penyata-akhir-2'
                              id='ya-kes-selesai-penyata-akhir-2'
                              value='ya-kes-selesai-penyata-akhir-2'
                              checked={
                                kesSelesaiSekolahRawatan ===
                                'ya-kes-selesai-penyata-akhir-2'
                                  ? true
                                  : false
                              }
                              onChange={(e) => {
                                setKesSelesaiSekolahRawatan(e.target.value);
                                setConfirmData({
                                  ...confirmData,
                                  kesSelesaiSekolahRawatan: e.target.value,
                                });
                              }}
                              className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                            />
                            <label
                              htmlFor='ya-kes-selesai-penyata-akhir-2'
                              className='mx-2 text-sm font-m'
                            >
                              Ya
                            </label>
                            <input
                              required
                              type='radio'
                              name='kes-selesai-penyata-akhir-2'
                              id='tidak-kes-selesai-penyata-akhir-2'
                              value='tidak-kes-selesai-penyata-akhir-2'
                              checked={
                                kesSelesaiSekolahRawatan ===
                                'tidak-kes-selesai-penyata-akhir-2'
                                  ? true
                                  : false
                              }
                              onChange={(e) => {
                                setKesSelesaiSekolahRawatan(e.target.value);
                                setConfirmData({
                                  ...confirmData,
                                  kesSelesaiSekolahRawatan: e.target.value,
                                });
                              }}
                              className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                            />
                            <label
                              htmlFor='tidak-kes-selesai-penyata-akhir-2'
                              className='mx-2 text-sm font-m'
                            >
                              Tidak
                            </label>
                          </div>
                        )}
                      </div>
                      <div className='grid grid-cols-2 lg:grid-cols-[1fr_3fr] items-center pl-5'>
                        <label
                          htmlFor='kes-selesai-icdas-penyata-akhir-2'
                          className='mr-2 text-lg font-bold flex'
                        >
                          kes selesai MMI
                          {singlePersonSekolah.statusRawatan ===
                          'selesai' ? null : (
                            <span className='text-user9'>*</span>
                          )}
                        </label>
                        {singlePersonSekolah.kesSelesaiMmi === true ? (
                          <FaCheckCircle className='text-user7 text-center text-lg' />
                        ) : (
                          // <input
                          //   type='checkbox'
                          //   name='kes-selesai-icdas-penyata-akhir-2'
                          //   id='kes-selesai-icdas-penyata-akhir-2'
                          //   checked={kesSelesaiIcdasSekolahRawatan}
                          //   onChange={() => {
                          //     setKesSelesaiIcdasSekolahRawatan(
                          //       !kesSelesaiIcdasSekolahRawatan
                          //     );
                          //     setConfirmData({
                          //       ...confirmData,
                          //       kesSelesaiIcdasSekolahRawatan:
                          //         !kesSelesaiIcdasSekolahRawatan,
                          //     });
                          //   }}
                          //   className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                          // />
                          <div className='flex items-center'>
                            <input
                              required
                              type='radio'
                              name='kes-selesai-icdas-penyata-akhir-2'
                              id='ya-kes-selesai-icdas-penyata-akhir-2'
                              value='ya-kes-selesai-icdas-penyata-akhir-2'
                              checked={
                                kesSelesaiIcdasSekolahRawatan ===
                                'ya-kes-selesai-icdas-penyata-akhir-2'
                                  ? true
                                  : false
                              }
                              onChange={(e) => {
                                setKesSelesaiIcdasSekolahRawatan(
                                  e.target.value
                                );
                                setConfirmData({
                                  ...confirmData,
                                  kesSelesaiIcdasSekolahRawatan: e.target.value,
                                });
                              }}
                              className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                            />
                            <label
                              htmlFor='ya-kes-selesai-icdas-penyata-akhir-2'
                              className='mx-2 text-sm font-m'
                            >
                              Ya
                            </label>
                            <input
                              required
                              type='radio'
                              name='kes-selesai-icdas-penyata-akhir-2'
                              id='tidak-kes-selesai-icdas-penyata-akhir-2'
                              value='tidak-kes-selesai-icdas-penyata-akhir-2'
                              checked={
                                kesSelesaiIcdasSekolahRawatan ===
                                'tidak-kes-selesai-icdas-penyata-akhir-2'
                                  ? true
                                  : false
                              }
                              onChange={(e) => {
                                setKesSelesaiIcdasSekolahRawatan(
                                  e.target.value
                                );
                                setConfirmData({
                                  ...confirmData,
                                  kesSelesaiIcdasSekolahRawatan: e.target.value,
                                });
                              }}
                              className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                            />
                            <label
                              htmlFor='tidak-kes-selesai-icdas-penyata-akhir-2'
                              className='mx-2 text-sm font-m'
                            >
                              Tidak
                            </label>
                          </div>
                        )}
                      </div>
                    </article>
                  )}
                </section>
                {tidakHadirRawatan === 'ya-kehadiran-rawatan' ||
                engganRawatan === 'ya-enggan-rawatan' ? null : (
                  <span className='flex bg-user3 p-2 w-full capitalize col-span-1 md:col-span-2 mb-2'>
                    <p className='ml-3 text-xl font-semibold'>
                      promosi & pendidikan kesihatan pergigian
                    </p>
                  </span>
                )}
                {tidakHadirRawatan === 'ya-kehadiran-rawatan' ||
                engganRawatan === 'ya-enggan-rawatan' ? null : (
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-2 auto-rows-min mb-2'>
                    {/* <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
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
                    </article> */}
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
                  </div>
                )}
                <div className='grid grid-cols-1 md:grid-cols-2 col-start-1 lg:col-start-2 gap-2 col-span-1 md:col-span-2 '>
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
                  {isSubmitting ? (
                    <button
                      type='button'
                      className='capitalize bg-user3 justify-center rounded-md p-2 mr-2 inline-flex cursor-not-allowed'
                      disabled
                    >
                      <svg
                        className='animate-spin ml-1 mr-3 h-5 w-5 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                      </svg>
                      Menghantar Data
                    </button>
                  ) : (
                    <button
                      type='submit'
                      className='flex bg-user3 p-2 w-full capitalize justify-center hover:bg-user1 hover:text-userWhite transition-all'
                    >
                      hantar
                    </button>
                  )}
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
