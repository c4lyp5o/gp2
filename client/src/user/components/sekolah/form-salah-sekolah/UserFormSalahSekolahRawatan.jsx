import { useState, useEffect } from 'react';
import {
  FaWindowClose,
  FaEdit,
  FaInfoCircle,
  FaMinus,
  FaPlus,
  FaTooth,
  FaCheckCircle,
  FaRegHandPointLeft,
  FaTimes,
  FaCheck,
} from 'react-icons/fa';
import { GiBee, GiBeehive } from 'react-icons/gi';
import axios from 'axios';
import { Spinner } from 'react-awesome-spinners';
import moment from 'moment';
import Select from 'react-select';

import ConfirmCheck from './ConfirmationSalahRawatan';

import { useGlobalUserAppContext } from '../../../context/userAppContext';

function UserFormSekolahRawatan({ pilihRawatan }) {
  const {
    userToken,
    reliefUserToken,
    username,
    userinfo,
    useParams,
    masterDatePicker,
    toast,
  } = useGlobalUserAppContext();

  const OptionRawatan = [
    { value: 'lihat-semua', label: 'Lihat Semua' },
    { value: 'pengapan-fisur', label: 'Pengapan Fisur' },
    { value: 'sapuan-florida', label: 'Sapuan Florida' },
    { value: 'prr-jenis-1', label: 'PRR Jenis 1' },
    { value: 'tampalan', label: 'Jumlah Tampalan Dibuat' },
    { value: 'cabutan', label: 'Cabutan' },
    { value: 'rawatan-lain', label: 'Rawatan Lain' },
    { value: 'rujukan', label: 'Rujukan' },
  ];
  const [pilihanRawatan, setPilihanRawatan] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isShown, setIsShown] = useState(false);
  const [singlePersonSekolah, setSinglePersonSekolah] = useState([]);
  const [singleRawatanSekolah, setSingleRawatanSekolah] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rawatanId, setRawatanId] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { personSekolahId } = useParams();

  //confirm data
  const [confirmData, setConfirmData] = useState({});

  //accordian
  const [accordian, setAccordian] = useState([]);

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

  //reten salah
  const [dataRetenSalah, setDataRetenSalah] = useState({});
  const [pilihanDataSalah, setPilihanDataSalah] = useState({
    baruJumlahGigiKekalDibuatFs: 0,
    baruJumlahGigiKekalDibuatFsCBox: false,
    muridDibuatFs: false,
    muridDibuatFsCBox: false,
    muridDiberiFv: false,
    muridDiberiFvCBox: false,
    baruJumlahGigiKekalDiberiFv: 0,
    baruJumlahGigiKekalDiberiFvCBox: false,
    muridDiberiPrrJenis1: false,
    muridDiberiPrrJenis1CBox: false,
    baruJumlahGigiKekalDiberiPrrJenis1: 0,
    baruJumlahGigiKekalDiberiPrrJenis1CBox: false,
    baruJumlahGigiYangDiberiSdf: 0,
    baruJumlahGigiYangDiberiSdfCBox: false,
    semulaJumlahGigiYangDiberiSdf: 0,
    semulaJumlahGigiYangDiberiSdfCBox: false,
    gdBaruAnteriorSewarnaJumlahTampalanDibuat: 0,
    gdBaruAnteriorSewarnaJumlahTampalanDibuatCBox: false,
    gdSemulaAnteriorSewarnaJumlahTampalanDibuat: 0,
    gdSemulaAnteriorSewarnaJumlahTampalanDibuatCBox: false,
    gkBaruAnteriorSewarnaJumlahTampalanDibuat: 0,
    gkBaruAnteriorSewarnaJumlahTampalanDibuatCBox: false,
    gkSemulaAnteriorSewarnaJumlahTampalanDibuat: 0,
    gkSemulaAnteriorSewarnaJumlahTampalanDibuatCBox: false,
    gdBaruPosteriorSewarnaJumlahTampalanDibuat: 0,
    gdBaruPosteriorSewarnaJumlahTampalanDibuatCBox: false,
    gdSemulaPosteriorSewarnaJumlahTampalanDibuat: 0,
    gdSemulaPosteriorSewarnaJumlahTampalanDibuatCBox: false,
    gkBaruPosteriorSewarnaJumlahTampalanDibuat: 0,
    gkBaruPosteriorSewarnaJumlahTampalanDibuatCBox: false,
    gkSemulaPosteriorSewarnaJumlahTampalanDibuat: 0,
    gkSemulaPosteriorSewarnaJumlahTampalanDibuatCBox: false,
    gdBaruPosteriorAmalgamJumlahTampalanDibuat: 0,
    gdBaruPosteriorAmalgamJumlahTampalanDibuatCBox: false,
    gdSemulaPosteriorAmalgamJumlahTampalanDibuat: 0,
    gdSemulaPosteriorAmalgamJumlahTampalanDibuatCBox: false,
    gkBaruPosteriorAmalgamJumlahTampalanDibuat: 0,
    gkBaruPosteriorAmalgamJumlahTampalanDibuatCBox: false,
    gkSemulaPosteriorAmalgamJumlahTampalanDibuat: 0,
    gkSemulaPosteriorAmalgamJumlahTampalanDibuatCBox: false,
    cabutDesidusSekolahRawatan: 0,
    cabutDesidusSekolahRawatanCBox: false,
    cabutKekalSekolahRawatan: 0,
    cabutKekalSekolahRawatanCBox: false,
    jumlahTampalanSementaraSekolahRawatan: 0,
    jumlahTampalanSementaraSekolahRawatanCBox: false,
    pulpotomiSekolahRawatan: 0,
    pulpotomiSekolahRawatanCBox: false,
    endodontikSekolahRawatan: 0,
    endodontikSekolahRawatanCBox: false,
    absesSekolahRawatan: false,
    absesSekolahRawatanCBox: false,
    penskaleranSekolahRawatan: false,
    penskaleranSekolahRawatanCBox: false,
    kesSelesaiSekolahRawatan: '',
    kesSelesaiSekolahRawatanCBox: false,
    kesSelesaiIcdasSekolahRawatan: '',
    kesSelesaiIcdasSekolahRawatanCBox: false,
    rujukSekolahRawatan: false,
    rujukSekolahRawatanCBox: false,
    rujukRawatanOrtodontikSekolahRawatan: false,
    rujukRawatanOrtodontikSekolahRawatanCBox: false,
    rujukPakarPatologiSekolahRawatan: false,
    rujukPakarPatologiSekolahRawatanCBox: false,
    rujukPakarRestoratifSekolahRawatan: false,
    rujukPakarRestoratifSekolahRawatanCBox: false,
    rujukPakarBedahMulutSekolahRawatan: false,
    rujukPakarBedahMulutSekolahRawatanCBox: false,
    rujukPakarPediatrikSekolahRawatan: false,
    rujukPakarPediatrikSekolahRawatanCBox: false,
    rujukKlinikSekolahRawatan: false,
    rujukKlinikSekolahRawatanCBox: false,
    yaTidakMelaksanakanAktivitiBeginPromosiSekolahRawatan: '',
    yaTidakMelaksanakanAktivitiBeginPromosiSekolahRawatanCBox: false,
    yaTidakLawatanKeRumahPromosiSekolahRawatan: '',
    yaTidakLawatanKeRumahPromosiSekolahRawatanCBox: false,
    plakGigiNasihatPergigianIndividuPromosiSekolahRawatan: false,
    plakGigiNasihatPergigianIndividuPromosiSekolahRawatanCBox: false,
    dietPemakananNasihatPergigianIndividuPromosiSekolahRawatan: false,
    dietPemakananNasihatPergigianIndividuPromosiSekolahRawatanCBox: false,
    penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan: false,
    penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatanCBox: false,
    kanserMulutNasihatPergigianIndividuPromosiSekolahRawatan: false,
    kanserMulutNasihatPergigianIndividuPromosiSekolahRawatanCBox: false,
  });

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
        setSingleRawatanSekolah(data.personSekolahWithPopulate.rawatanSekolah);

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

  const handleAccordian = (e) => {
    if (accordian.includes(e)) {
      setAccordian(accordian.filter((a) => a !== e));
    } else {
      setAccordian([...accordian, e]);
    }
  };

  const handleSubmit = async (e) => {
    // if no data in confirmData, then return
    if (Object.keys(confirmData).length === 0) {
      toast.error('Sila pastikan anda telah mengisi data anda', {
        autoClose: 3000,
      });
      return;
    }

    let mdcMdtbNumSalah = '';
    if (!userinfo.mdtbNumber) {
      mdcMdtbNumSalah = userinfo.mdcNumber;
    }
    if (!userinfo.mdcNumber) {
      mdcMdtbNumSalah = userinfo.mdtbNumber;
    }

    setIsSubmitting(true);
    await toast
      .promise(
        axios.patch(
          `/api/v1/sekolah/rawatan/ubah/${rawatanId}`,
          {
            createdByUsernameSalah: userinfo.nama,
            createdByMdcMdtbSalah: mdcMdtbNumSalah,
            dataRetenSalah,
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
                      <div className='text-xs flex flex-row '>
                        <h2 className='font-semibold'>NO IC :</h2>
                        <p className='ml-1'>{singlePersonSekolah.nomborId}</p>
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
                        <h2 className='font-semibold'>KUMPULAN ETNIK :</h2>
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
            <div className=' h-full overflow-y-scroll'>
              {singleRawatanSekolah.map((rawatan, index) => {
                // sum rawatan
                const semuaGD = [
                  rawatan.gdBaruAnteriorSewarnaJumlahTampalanDibuat,
                  rawatan.gdSemulaAnteriorSewarnaJumlahTampalanDibuat,
                  rawatan.gdBaruPosteriorSewarnaJumlahTampalanDibuat,
                  rawatan.gdSemulaPosteriorSewarnaJumlahTampalanDibuat,
                  rawatan.gdBaruPosteriorAmalgamJumlahTampalanDibuat,
                  rawatan.gdSemulaPosteriorAmalgamJumlahTampalanDibuat,
                ];
                const semuaGK = [
                  rawatan.gkBaruAnteriorSewarnaJumlahTampalanDibuat,
                  rawatan.gkSemulaAnteriorSewarnaJumlahTampalanDibuat,
                  rawatan.gkBaruPosteriorSewarnaJumlahTampalanDibuat,
                  rawatan.gkSemulaPosteriorSewarnaJumlahTampalanDibuat,
                  rawatan.gkBaruPosteriorAmalgamJumlahTampalanDibuat,
                  rawatan.gkSemulaPosteriorAmalgamJumlahTampalanDibuat,
                ];
                const semuaICDAS = [
                  rawatan.baruJumlahGigiKekalDibuatFs,
                  rawatan.baruJumlahGigiKekalDiberiFv,
                  rawatan.baruJumlahGigiKekalDiberiPrrJenis1,
                ];
                let sumGigiDesidus = 0;
                semuaGD.forEach((rawatan) => {
                  sumGigiDesidus += rawatan;
                });
                let sumGigiKekal = 0;
                semuaGK.forEach((rawatan) => {
                  sumGigiKekal += rawatan;
                });
                let sumICDAS = 0;
                semuaICDAS.forEach((rawatan) => {
                  sumICDAS += rawatan;
                });
                return (
                  <div key={rawatan._id} className='flex flex-col'>
                    {!showForm && (
                      <h1
                        onClick={() => handleAccordian(index)}
                        className='text-start font-semibold bg-user2 text-userWhite shadow-md flex flex-row items-center rounded-md p-1 m-1 cursor-pointer'
                      >
                        {accordian.includes(index) ? (
                          <FaMinus className='m-1' />
                        ) : (
                          <FaPlus className='m-1' />
                        )}
                        Kedatangan {index + 1} -{' '}
                        {moment(rawatan.tarikhRawatanSemasa).format(
                          'DD/MM/YYYY'
                        )}
                      </h1>
                    )}
                    {!showForm && accordian.includes(index) && (
                      <div className='grid grid-cols-2 lg:grid-cols-[2fr_4fr_1fr] gap-2 m-1 px-1 text-sm'>
                        <div className='shadow-md shadow-user1 rounded-md flex flex-row border-l-8 border-user3 p-2'>
                          <span className='font-semibold text-start flex justify-start items-center'>
                            <GiBee className='mr-2 text-3xl text-user3' />
                          </span>
                          <span className='font-semibold text-start flex flex-col justify-start text-user1'>
                            <h1 className='font-bold text-xs text-left '>
                              Operator
                            </h1>
                            {rawatan.createdByUsername}
                          </span>
                        </div>
                        <div className='shadow-md shadow-user1 rounded-md flex flex-row border-l-8 border-user3 p-2'>
                          <div className='flex items-center'>
                            <GiBeehive className='text-4xl text-user3' />
                          </div>
                          <div className='flex flex-col text-user1'>
                            <h1 className='font-bold text-xs text-left'>
                              Rawatan
                            </h1>
                            {rawatan.cabutDesidusSekolahRawatan >= 1 && (
                              <span className='font-medium text-left flex justify-start'>
                                cabut desidus :
                                {rawatan.cabutDesidusSekolahRawatan}
                              </span>
                            )}
                            {rawatan.cabutKekalSekolahRawatan >= 1 && (
                              <span className='font-medium text-left flex flex-row items-center'>
                                cabut Kekal :{rawatan.cabutKekalSekolahRawatan}
                              </span>
                            )}
                            {sumGigiDesidus >= 1 && (
                              <span className='font-medium text-left flex flex-row items-center'>
                                tampalan gigi desidus : {sumGigiDesidus}
                              </span>
                            )}
                            {sumGigiKekal >= 1 && (
                              <span className='font-medium text-left flex flex-row items-center'>
                                tampalan gigi kekal : {sumGigiKekal}
                              </span>
                            )}
                            {sumICDAS >= 1 && (
                              <span className='font-medium text-left flex justify-start'>
                                MMI : {sumICDAS}
                              </span>
                            )}
                            {rawatan.jumlahTampalanSementaraSekolahRawatan >=
                              1 && (
                              <span className='font-medium text-left flex flex-row items-center'>
                                tampalan sementara :{' '}
                                {rawatan.jumlahTampalanSementaraSekolahRawatan}
                              </span>
                            )}
                            {rawatan.pulpotomiSekolahRawatan >= 1 && (
                              <span className='font-medium text-left flex flex-row items-center'>
                                pulpotomi : {rawatan.pulpotomiSekolahRawatan}
                              </span>
                            )}
                            {rawatan.endodontikSekolahRawatan >= 1 && (
                              <span className='font-medium text-left flex flex-row items-center'>
                                endodontik : {rawatan.endodontikSekolahRawatan}
                              </span>
                            )}
                            {rawatan.absesSekolahRawatan === true && (
                              <span className='font-medium text-left flex flex-row items-center'>
                                abses :{' '}
                                <FaCheckCircle className='text-user7 text-center mx-1' />
                              </span>
                            )}
                            {rawatan.penskaleranSekolahRawatan === true && (
                              <span className='font-medium text-left flex flex-row items-center'>
                                penskaleran :{' '}
                                <FaCheckCircle className='text-user7 text-center mx-1' />
                              </span>
                            )}
                            {rawatan.rujukKlinikSekolahRawatan === true && (
                              <span className='font-medium text-left flex flex-row items-center'>
                                rujuk klinik :{' '}
                                <FaCheckCircle className='text-user7 text-center mx-1' />
                              </span>
                            )}
                            {rawatan.rujukRawatanOrtodontikSekolahRawatan ===
                              true && (
                              <span className='font-medium text-left flex flex-row items-center'>
                                rujuk ortodontik :{' '}
                                <FaCheckCircle className='text-user7 text-center mx-1' />
                              </span>
                            )}
                            {rawatan.rujukPakarPatologiSekolahRawatan ===
                              true && (
                              <span className='font-medium text-left flex flex-row items-center'>
                                rujuk pakar patologi :{' '}
                                <FaCheckCircle className='text-user7 text-center mx-1' />
                              </span>
                            )}
                            {rawatan.rujukPakarRestoratifSekolahRawatan ===
                              true && (
                              <span className='font-medium text-left flex flex-row items-center'>
                                rujuk pakar restoratif :{' '}
                                <FaCheckCircle className='text-user7 text-center mx-1' />
                              </span>
                            )}
                            {rawatan.rujukPakarBedahMulutSekolahRawatan ===
                              true && (
                              <span className='font-medium text-left flex flex-row items-center'>
                                rujuk pakar bedah mulut :{' '}
                                <FaCheckCircle className='text-user7 text-center mx-1' />
                              </span>
                            )}
                            {rawatan.rujukPakarPediatrikSekolahRawatan ===
                              true && (
                              <span className='font-medium text-left flex flex-row items-center'>
                                rujuk pakar pediatrik :{' '}
                                <FaCheckCircle className='text-user7 text-center mx-1' />
                              </span>
                            )}
                            {rawatan.kesSelesaiSekolahRawatan ===
                              'ya-kes-selesai-penyata-akhir-2' && (
                              <span className='font-medium text-left flex items-center'>
                                kes selesai{' '}
                                <FaCheckCircle className='text-user7 inline-flex text-center ml-1' />
                              </span>
                            )}
                            {rawatan.kesSelesaiIcdasSekolahRawatan ===
                              'ya-kes-selesai-icdas-penyata-akhir-2' && (
                              <span className='font-medium text-left flex items-center'>
                                kes selesai MMI{' '}
                                <FaCheckCircle className='text-user7 inline-flex text-center ml-1' />
                              </span>
                            )}
                          </div>
                        </div>
                        <div className='flex items-end'>
                          <button
                            type='button'
                            className='bg-user3 shadow-md shadow-user1 hover:bg-opacity-70 hover:shadow-none text-userWhite text-sm whitespace-nowrap rounded-md px-2 py-1 mt-2 flex flex-row justify-center items-center'
                            onClick={() => {
                              setRawatanId(rawatan._id);
                              setShowForm({
                                ...showForm,
                                [rawatan._id]: true,
                              });
                            }}
                          >
                            TANDA RETEN SALAH
                            <FaEdit className='m-2' />
                          </button>
                        </div>
                      </div>
                    )}
                    <div
                      className={`${
                        showForm[rawatan._id] ? 'block' : 'hidden'
                      } grid h-full gap-2`}
                    >
                      <form onSubmit={confirm(handleSubmit)}>
                        <span className='flex bg-user3 p-2 w-full capitalize col-span-2'>
                          <p className='ml-3 text-xl font-semibold'>Rawatan</p>
                        </span>
                        <section className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 mb-3 w-full col-span-2'>
                          <article className='grid grid-cols-1 lg:grid-cols-2 border border-userBlack pl-3 p-2 rounded-md col-span-1 md:col-span-2'>
                            <h4 className='font-bold flex flex-row pl-5 col-span-1 lg:col-span-2 pb-2'>
                              kedatangan
                            </h4>
                            {/* <div className='flex items-center flex-row pl-5'>
                              <input
                                disabled
                                type='radio'
                                name='enggan-tidak-hadir-rawatan'
                                id='enggan-rawatan'
                                value='enggan-rawatan'
                                checked={
                                  rawatan.engganTidakHadirRawatan ===
                                  'enggan-rawatan'
                                    ? true
                                    : false
                                }
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='enggan-rawatan'
                                className='m-2 text-sm font-m'
                              >
                                enggan
                              </label>
                              <input
                                disabled
                                type='radio'
                                name='enggan-tidak-hadir-rawatan'
                                id='tidak-hadir-rawatan'
                                value='tidak-hadir-rawatan'
                                checked={
                                  rawatan.engganTidakHadirRawatan ===
                                  'tidak-hadir-rawatan'
                                    ? true
                                    : false
                                }
                                // onChange={(e) => {
                                //   setEngganTidakHadirRawatan(e.target.value);
                                //   setConfirmData({
                                //     ...confirmData,
                                //     engganTidakHadirRawatan: e.target.value,
                                //   });
                                //   setModalTidakHadir(true);
                                // }}
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
                                      {kebenaranRawatan ===
                                      'ya-kebenaran-rawatan' ? (
                                        <p>
                                          Enggan Rawatan{' '}
                                          <span className='text-user7 font-bold'>
                                            DENGAN
                                          </span>{' '}
                                          kebenaran rawatan daripada ibu
                                          bapa/penjaga
                                        </p>
                                      ) : (
                                        <p>
                                          Enggan Rawatan{' '}
                                          <span className='text-user6 font-bold'>
                                            TANPA
                                          </span>{' '}
                                          kebenaran rawatan daripada ibu
                                          bapa/penjaga
                                        </p>
                                      )}
                                    </p>
                                  ) : null}
                                  {tidakHadirRawatan ===
                                  'ya-kehadiran-rawatan' ? (
                                    <p>
                                      Murid <strong>TIDAK HADIR</strong> Rawatan
                                    </p>
                                  ) : null}
                                </p>
                              </div>
                            ) : (
                              <div className='flex flex-row'>
                                <p className='flex items-center flex-row text-m font-m px-5 '>
                                  tarikh:
                                </p>
                                {showForm[rawatan._id] ? (
                                  <p className='flex items-center flex-row text-m font-m px-5 '>
                                    {moment(rawatan.tarikhRawatanSemasa).format(
                                      'DD/MM/YYYY'
                                    )}
                                  </p>
                                ) : (
                                  <TarikhRawatanSemasa />
                                )}
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
                                  Murid yang <strong>ENGGAN</strong> Rawatan
                                  sehingga hari terakhir Pasukan Pergigian
                                  berada di Sekolah
                                </p>
                                <div className='flex flex-row justify-center mt-2'>
                                  <div>
                                    <input
                                      disabled
                                      type='radio'
                                      name='ya-tidak-enggan-rawatan'
                                      id='ya-enggan-rawatan'
                                      value='ya-enggan-rawatan'
                                      className='peer hidden'
                                      checked={
                                        rawatan.engganRawatan ===
                                        'ya-enggan-rawatan'
                                          ? true
                                          : false
                                      }
                                      // onChange={(e) => {
                                      //   setEngganRawatan(e.target.value);
                                      //   setConfirmData({
                                      //     ...confirmData,
                                      //     engganRawatan: e.target.value,
                                      //   });
                                      // }}
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
                                      disabled
                                      type='radio'
                                      name='ya-tidak-enggan-rawatan'
                                      id='tidak-enggan-rawatan'
                                      value='tidak-enggan-rawatan'
                                      className='peer hidden'
                                      checked={
                                        rawatan.engganRawatan ===
                                        'tidak-enggan-rawatan'
                                          ? true
                                          : false
                                      }
                                      // onChange={(e) => {
                                      //   setEngganRawatan(e.target.value);
                                      //   setConfirmData({
                                      //     ...confirmData,
                                      //     engganRawatan: e.target.value,
                                      //   });
                                      //   setModalEnggan(false);
                                      //   setEngganTidakHadirRawatan('');
                                      // }}
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
                                    Adakah murid <strong>DIBERI</strong>{' '}
                                    kebenaran rawatan daripada ibu bapa/penjaga?
                                  </p>
                                ) : null}
                                {engganRawatan === 'ya-enggan-rawatan' ? (
                                  <div className='flex flex-row justify-center mt-2'>
                                    <div>
                                      <input
                                        disabled
                                        type='radio'
                                        name='ya-tidak-kebenaran-rawatan'
                                        id='ya-kebenaran-rawatan'
                                        value='ya-kebenaran-rawatan'
                                        className='peer hidden'
                                        checked={
                                          kebenaranRawatan ===
                                          'ya-kebenaran-rawatan'
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
                                        disabled
                                        type='radio'
                                        name='ya-tidak-kebenaran-rawatan'
                                        id='tidak-kebenaran-rawatan'
                                        value='tidak-kebenaran-rawatan'
                                        className='peer hidden'
                                        checked={
                                          rawatan.kebenaranRawatan ===
                                          'tidak-kebenaran-rawatan'
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
                                <h1 className='font-bold text-xl'>
                                  TIDAK HADIR
                                </h1>
                                <p>
                                  Murid yang TIDAK HADIR Rawatan sehingga hari
                                  terakhir Pasukan Pergigian berada di Sekolah
                                </p>
                                <div className='flex flex-row justify-center mt-2'>
                                  <div>
                                    <input
                                      disabled
                                      type='radio'
                                      name='ya-tidak-kehadiran-rawatan'
                                      id='ya-kehadiran-rawatan'
                                      value='ya-kehadiran-rawatan'
                                      className='peer hidden'
                                      checked={
                                        rawatan.tidakHadirRawatan ===
                                        'ya-kehadiran-rawatan'
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
                                      disabled
                                      type='radio'
                                      name='ya-tidak-kehadiran-rawatan'
                                      id='tidak-kehadiran-rawatan'
                                      value='tidak-kehadiran-rawatan'
                                      className='peer hidden'
                                      checked={
                                        rawatan.tidakHadirRawatan ===
                                        'tidak-kehadiran-rawatan'
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
                            </div> */}
                            <p className='flex items-center flex-row text-m font-m px-5 '>
                              {moment(rawatan.tarikhRawatanSemasa).format(
                                'DD/MM/YYYY'
                              )}
                            </p>
                          </article>
                          <article className='grid gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                            <h4 className='font-bold flex flex-row pl-5'>
                              Pengapan Fisur
                              <FaInfoCircle
                                title='Fissure Sealant'
                                className='m-2'
                              />
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
                            <div
                              className={`${
                                pilihanDataSalah.baruJumlahGigiKekalDibuatFsCBox &&
                                'grid-rows-2'
                              } grid px-3 pt-1`}
                            >
                              <div
                                className={`${
                                  pilihanDataSalah.baruJumlahGigiKekalDibuatFsCBox &&
                                  'bg-user9 bg-opacity-20'
                                } flex items-center flex-row pl-5 mt-2`}
                              >
                                <label
                                  htmlFor='baru-jumlah-gigi-kekal-dibuat-fs'
                                  className='text-sm font-m'
                                >
                                  Jumlah gigi kekal dibuat pengapan fisur
                                </label>
                                <input
                                  disabled
                                  type='number'
                                  name='baru-jumlah-gigi-kekal-dibuat-fs'
                                  id='baru-jumlah-gigi-kekal-dibuat-fs'
                                  value={rawatan.baruJumlahGigiKekalDibuatFs}
                                  onChange={(e) => {
                                    setBaruJumlahGigiKekalDibuatFs(
                                      e.target.value
                                    );
                                    setConfirmData({
                                      ...confirmData,
                                      baruJumlahGigiKekalDibuatFs:
                                        e.target.value,
                                    });
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                  min='0'
                                  max='16'
                                  required
                                />
                                <div className='relative'>
                                  <input
                                    // disabled={disableSalah}
                                    type='checkbox'
                                    name='baru-jumlah-gigi-kekal-dibuat-fs-reten-salah-cbox'
                                    id='baru-jumlah-gigi-kekal-dibuat-fs-reten-salah-cbox'
                                    checked={
                                      pilihanDataSalah.baruJumlahGigiKekalDibuatFsCBox
                                    }
                                    onChange={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        baruJumlahGigiKekalDibuatFsCBox:
                                          !pilihanDataSalah.baruJumlahGigiKekalDibuatFsCBox,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        baruJumlahGigiKekalDibuatFsCBox:
                                          !pilihanDataSalah.baruJumlahGigiKekalDibuatFsCBox,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          baruJumlahGigiKekalDibuatFsCBox:
                                            !pilihanDataSalah.baruJumlahGigiKekalDibuatFsCBox,
                                        },
                                      });
                                    }}
                                    className='peer hidden'
                                  />
                                  <label
                                    htmlFor='baru-jumlah-gigi-kekal-dibuat-fs-reten-salah-cbox'
                                    className={`text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                  >
                                    {pilihanDataSalah.baruJumlahGigiKekalDibuatFsCBox ===
                                    true ? (
                                      <FaTimes
                                        className='text-2xl'
                                        onClick={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            baruJumlahGigiKekalDibuatFs: '',
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            baruJumlahGigiKekalDibuatFs: '',
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              baruJumlahGigiKekalDibuatFs: '',
                                            },
                                          });
                                        }}
                                      />
                                    ) : (
                                      <FaRegHandPointLeft className='text-2xl' />
                                    )}
                                  </label>
                                </div>
                              </div>
                              {pilihanDataSalah.baruJumlahGigiKekalDibuatFsCBox ===
                                true && (
                                <div className='flex flex-row pl-5 items-center bg-user11 bg-opacity-50 mb-1'>
                                  <p className='text-sm font-m '>
                                    Jumlah gigi kekal dibuat pengapan fisur
                                  </p>
                                  <input
                                    // disabled={disableSalah}
                                    min='0'
                                    max='32'
                                    type='number'
                                    name='baru-jumlah-gigi-kekal-dibuat-fs'
                                    id='baru-jumlah-gigi-kekal-dibuat-fs'
                                    value={
                                      pilihanDataSalah.baruJumlahGigiKekalDibuatFs
                                    }
                                    onChange={(e) => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        baruJumlahGigiKekalDibuatFs:
                                          e.target.value,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        baruJumlahGigiKekalDibuatFs:
                                          e.target.value,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          baruJumlahGigiKekalDibuatFs:
                                            e.target.value,
                                        },
                                      });
                                    }}
                                    className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                  />
                                  <span className='text-kaunter4'>
                                    <FaCheck className='text-2xl' />
                                  </span>
                                </div>
                              )}
                            </div>
                          </article>
                          <article className='grid auto-rows-min gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                            <h4 className='font-bold flex flex-row pl-5'>
                              Sapuan Fluorida (FV)
                              <FaInfoCircle
                                title='Fluoride Varnish Application'
                                className='m-2'
                              />
                            </h4>
                            <div
                              className={`${
                                pilihanDataSalah.muridDiberiFvCBox &&
                                'grid-rows-2'
                              } grid px-3 pl pt-1`}
                            >
                              <div
                                className={`${
                                  pilihanDataSalah.muridDiberiFvCBox &&
                                  'bg-user9 bg-opacity-20 p-2'
                                } flex items-center flex-row pl-2`}
                              >
                                <input
                                  disabled
                                  type='checkbox'
                                  name='murid-diberi-fv'
                                  id='murid-diberi-fv'
                                  checked={rawatan.muridDiberiFv}
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
                                <div className='relative mx-2'>
                                  <input
                                    // disabled={disableSalah}
                                    type='checkbox'
                                    name='murid-diberi-fv-reten-salah-cbox'
                                    id='murid-diberi-fv-reten-salah-cbox'
                                    checked={pilihanDataSalah.muridDiberiFvCBox}
                                    onChange={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        muridDiberiFvCBox:
                                          !pilihanDataSalah.muridDiberiFvCBox,
                                        muridDiberiFv: !rawatan.muridDiberiFv,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        muridDiberiFvCBox:
                                          !pilihanDataSalah.muridDiberiFvCBox,
                                        muridDiberiFv: !rawatan.muridDiberiFv,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          muridDiberiFvCBox:
                                            !pilihanDataSalah.muridDiberiFvCBox,
                                          muridDiberiFv: !rawatan.muridDiberiFv,
                                        },
                                      });
                                    }}
                                    className='peer hidden'
                                  />
                                  <label
                                    htmlFor='murid-diberi-fv-reten-salah-cbox'
                                    className=' text-user9 h-6 w-6 rounded-full flex items-center justify-center cursor-pointer'
                                  >
                                    {pilihanDataSalah.muridDiberiFvCBox ===
                                    true ? (
                                      <FaTimes className='text-2xl' />
                                    ) : (
                                      <FaRegHandPointLeft className='text-2xl' />
                                    )}
                                  </label>
                                </div>
                              </div>
                              {pilihanDataSalah.muridDiberiFvCBox === true && (
                                <div className='flex items-center flex-row bg-user11 bg-opacity-50 p-2'>
                                  <input
                                    disabled
                                    type='checkbox'
                                    name='murid-diberi-fv-reten-salah'
                                    id='murid-diberi-fv-reten-salah'
                                    checked={pilihanDataSalah.muridDiberiFv}
                                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 mr-3'
                                  />
                                  <label
                                    htmlFor='murid-diberi-fv-reten-salah'
                                    className='text-sm font-m'
                                  >
                                    murid diberi Sapuan Florida(FV)
                                  </label>
                                  <span className='text-kaunter4 mx-2'>
                                    <FaCheck className='text-2xl' />
                                  </span>
                                </div>
                              )}
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
                          <article className='grid  gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                            <h4 className='font-bold flex flex-row pl-5 '>
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
                            <div
                              className={`${
                                pilihanDataSalah.baruJumlahGigiKekalDiberiPrrJenis1CBox &&
                                'grid-rows-2'
                              } grid px-3 pt-1`}
                            >
                              <div
                                className={`${
                                  pilihanDataSalah.baruJumlahGigiKekalDiberiPrrJenis1CBox &&
                                  'bg-user9 bg-opacity-20'
                                } flex items-center flex-row pl-5 mt-2`}
                              >
                                <label
                                  htmlFor='baru-jumlah-gigi-kekal-diberi-prr-jenis-1'
                                  className='text-sm font-m'
                                >
                                  jumlah gigi kekal dibuat Resin Pencegahan
                                  Jenis 1 (PRR Type I)
                                </label>
                                <input
                                  disabled
                                  type='number'
                                  name='baru-jumlah-gigi-kekal-diberi-prr-jenis-1'
                                  id='baru-jumlah-gigi-kekal-diberi-prr-jenis-1'
                                  value={
                                    rawatan.baruJumlahGigiKekalDiberiPrrJenis1
                                  }
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
                                <div className='relative'>
                                  <input
                                    // disabled={disableSalah}
                                    type='checkbox'
                                    name='baru-jumlah-gigi-kekal-diberi-prr-jenis-1-reten-salah-cbox'
                                    id='baru-jumlah-gigi-kekal-diberi-prr-jenis-1-reten-salah-cbox'
                                    checked={
                                      pilihanDataSalah.baruJumlahGigiKekalDiberiPrrJenis1CBox
                                    }
                                    onChange={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        baruJumlahGigiKekalDiberiPrrJenis1CBox:
                                          !pilihanDataSalah.baruJumlahGigiKekalDiberiPrrJenis1CBox,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        baruJumlahGigiKekalDiberiPrrJenis1CBox:
                                          !pilihanDataSalah.baruJumlahGigiKekalDiberiPrrJenis1CBox,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          baruJumlahGigiKekalDiberiPrrJenis1CBox:
                                            !pilihanDataSalah.baruJumlahGigiKekalDiberiPrrJenis1CBox,
                                        },
                                      });
                                    }}
                                    className='peer hidden'
                                  />
                                  <label
                                    htmlFor='baru-jumlah-gigi-kekal-diberi-prr-jenis-1-reten-salah-cbox'
                                    className={`text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                  >
                                    {pilihanDataSalah.baruJumlahGigiKekalDiberiPrrJenis1CBox ===
                                    true ? (
                                      <FaTimes
                                        className='text-2xl'
                                        onClick={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            baruJumlahGigiKekalDiberiPrrJenis1:
                                              '',
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            baruJumlahGigiKekalDiberiPrrJenis1:
                                              '',
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              baruJumlahGigiKekalDiberiPrrJenis1:
                                                '',
                                            },
                                          });
                                        }}
                                      />
                                    ) : (
                                      <FaRegHandPointLeft className='text-2xl' />
                                    )}
                                  </label>
                                </div>
                              </div>
                              {pilihanDataSalah.baruJumlahGigiKekalDiberiPrrJenis1CBox ===
                                true && (
                                <div className='flex flex-row pl-5 items-center bg-user11 bg-opacity-50 mb-1'>
                                  <p className='text-sm font-m '>
                                    jumlah gigi kekal dibuat Resin Pencegahan
                                    Jenis 1 (PRR Type I)
                                  </p>
                                  <input
                                    // disabled={disableSalah}
                                    min='0'
                                    max='32'
                                    type='number'
                                    name='baru-jumlah-gigi-kekal-diberi-prr-jenis-1'
                                    id='baru-jumlah-gigi-kekal-diberi-prr-jenis-1'
                                    value={
                                      pilihanDataSalah.baruJumlahGigiKekalDiberiPrrJenis1
                                    }
                                    onChange={(e) => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        baruJumlahGigiKekalDiberiPrrJenis1:
                                          e.target.value,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        baruJumlahGigiKekalDiberiPrrJenis1:
                                          e.target.value,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          baruJumlahGigiKekalDiberiPrrJenis1:
                                            e.target.value,
                                        },
                                      });
                                    }}
                                    className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                  />
                                  <span className='text-kaunter4'>
                                    <FaCheck className='text-2xl' />
                                  </span>
                                </div>
                              )}
                            </div>
                          </article>
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
                          <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                            <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                              cabutan
                            </h4>
                            <p className='flex items-center flex-row pl-5 text-m font-m col-span-2'>
                              gigi telah dicabut
                            </p>
                            <div
                              className={`${
                                pilihanDataSalah.cabutDesidusSekolahRawatanCBox &&
                                'grid-rows-2'
                              } grid px-3 pt-1`}
                            >
                              <div
                                className={`${
                                  pilihanDataSalah.cabutDesidusSekolahRawatanCBox &&
                                  'bg-user9 bg-opacity-20'
                                } flex items-center flex-row pl-5 mt-2`}
                              >
                                <p className='text-sm font-m'>Desidus: </p>
                                <input
                                  disabled
                                  type='number'
                                  name='cabut-desidus-sekolah-rawatan'
                                  id='cabut-desidus-sekolah-rawatan'
                                  value={rawatan.cabutDesidusSekolahRawatan}
                                  // onChange={(e) => {
                                  //   setCabutDesidusSekolahRawatan(e.target.value);
                                  //   setConfirmData({
                                  //     ...confirmData,
                                  //     cabutDesidusSekolahRawatan: e.target.value,
                                  //   });
                                  // }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                  min='0'
                                  max='20'
                                />
                                <div className='relative'>
                                  <input
                                    // disabled={disableSalah}
                                    type='checkbox'
                                    name='cabut-desidus-sekolah-rawatan-reten-salah-cbox'
                                    id='cabut-desidus-sekolah-rawatan-reten-salah-cbox'
                                    checked={
                                      pilihanDataSalah.cabutDesidusSekolahRawatanCBox
                                    }
                                    onChange={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        cabutDesidusSekolahRawatanCBox:
                                          !pilihanDataSalah.cabutDesidusSekolahRawatanCBox,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        cabutDesidusSekolahRawatanCBox:
                                          !pilihanDataSalah.cabutDesidusSekolahRawatanCBox,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          cabutDesidusSekolahRawatanCBox:
                                            !pilihanDataSalah.cabutDesidusSekolahRawatanCBox,
                                        },
                                      });
                                    }}
                                    className='peer hidden'
                                  />
                                  <label
                                    htmlFor='cabut-desidus-sekolah-rawatan-reten-salah-cbox'
                                    className={`text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                  >
                                    {pilihanDataSalah.cabutDesidusSekolahRawatanCBox ===
                                    true ? (
                                      <FaTimes
                                        className='text-2xl'
                                        onClick={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            cabutDesidusSekolahRawatan: '',
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            cabutDesidusSekolahRawatan: '',
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              cabutDesidusSekolahRawatan: '',
                                            },
                                          });
                                        }}
                                      />
                                    ) : (
                                      <FaRegHandPointLeft className='text-2xl' />
                                    )}
                                  </label>
                                </div>
                              </div>
                              {pilihanDataSalah.cabutDesidusSekolahRawatanCBox ===
                                true && (
                                <div className='flex flex-row pl-5 items-center bg-user11 bg-opacity-50 mb-1'>
                                  <p className='text-sm font-m '>Desidus:</p>
                                  <input
                                    // disabled={disableSalah}
                                    min='0'
                                    max='32'
                                    type='number'
                                    name='cabut-desidus-sekolah-rawatan'
                                    id='cabut-desidus-sekolah-rawatan'
                                    value={
                                      pilihanDataSalah.cabutDesidusSekolahRawatan
                                    }
                                    onChange={(e) => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        cabutDesidusSekolahRawatan:
                                          e.target.value,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        cabutDesidusSekolahRawatan:
                                          e.target.value,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          cabutDesidusSekolahRawatan:
                                            e.target.value,
                                        },
                                      });
                                    }}
                                    className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                  />
                                  <span className='text-kaunter4'>
                                    <FaCheck className='text-2xl' />
                                  </span>
                                </div>
                              )}
                            </div>
                            <div
                              className={`${
                                pilihanDataSalah.cabutKekalSekolahRawatanCBox &&
                                'grid-rows-2'
                              } grid px-3 pt-1`}
                            >
                              <div
                                className={`${
                                  pilihanDataSalah.cabutKekalSekolahRawatanCBox &&
                                  'bg-user9 bg-opacity-20'
                                } flex items-center flex-row pl-5 mt-2`}
                              >
                                <p className='text-sm font-m'>Kekal: </p>
                                <input
                                  disabled
                                  type='number'
                                  name='cabut-kekal-penyata-akhir-2'
                                  id='cabut-kekal-penyata-akhir-2'
                                  value={rawatan.cabutKekalSekolahRawatan}
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
                                <div className='relative'>
                                  <input
                                    // disabled={disableSalah}
                                    type='checkbox'
                                    name='cabut-kekal-penyata-akhir-2-reten-salah-cbox'
                                    id='cabut-kekal-penyata-akhir-2-reten-salah-cbox'
                                    checked={
                                      pilihanDataSalah.cabutKekalSekolahRawatanCBox
                                    }
                                    onChange={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        cabutKekalSekolahRawatanCBox:
                                          !pilihanDataSalah.cabutKekalSekolahRawatanCBox,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        cabutKekalSekolahRawatanCBox:
                                          !pilihanDataSalah.cabutKekalSekolahRawatanCBox,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          cabutKekalSekolahRawatanCBox:
                                            !pilihanDataSalah.cabutKekalSekolahRawatanCBox,
                                        },
                                      });
                                    }}
                                    className='peer hidden'
                                  />
                                  <label
                                    htmlFor='cabut-kekal-penyata-akhir-2-reten-salah-cbox'
                                    className={`text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                  >
                                    {pilihanDataSalah.cabutKekalSekolahRawatanCBox ===
                                    true ? (
                                      <FaTimes
                                        className='text-2xl'
                                        onClick={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            cabutKekalSekolahRawatan: '',
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            cabutKekalSekolahRawatan: '',
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              cabutKekalSekolahRawatan: '',
                                            },
                                          });
                                        }}
                                      />
                                    ) : (
                                      <FaRegHandPointLeft className='text-2xl' />
                                    )}
                                  </label>
                                </div>
                              </div>
                              {pilihanDataSalah.cabutKekalSekolahRawatanCBox ===
                                true && (
                                <div className='flex flex-row pl-5 items-center bg-user11 bg-opacity-50 mb-1'>
                                  <p className='text-sm font-m '>Kekal:</p>
                                  <input
                                    // disabled={disableSalah}
                                    min='0'
                                    max='32'
                                    type='number'
                                    name='cabut-kekal-penyata-akhir-2'
                                    id='cabut-kekal-penyata-akhir-2'
                                    value={
                                      pilihanDataSalah.cabutKekalSekolahRawatan
                                    }
                                    onChange={(e) => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        cabutKekalSekolahRawatan:
                                          e.target.value,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        cabutKekalSekolahRawatan:
                                          e.target.value,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          cabutKekalSekolahRawatan:
                                            e.target.value,
                                        },
                                      });
                                    }}
                                    className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                  />
                                  <span className='text-kaunter4'>
                                    <FaCheck className='text-2xl' />
                                  </span>
                                </div>
                              )}
                            </div>
                          </article>
                          <article className='border border-userBlack pl-3 p-2 rounded-md'>
                            <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                              Jumlah Tampalan Dibuat
                            </h4>
                            <div className='grid grid-rows-2 gap-2'>
                              <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                                <h4 className='font-semibold flex flex-row pl-5 col-span-2'>
                                  Anterior Sewarna
                                </h4>
                                <div
                                  className={`${
                                    pilihanDataSalah.gdBaruAnteriorSewarnaJumlahTampalanDibuatCBox &&
                                    'grid-rows-2'
                                  } grid pt-1`}
                                >
                                  <div
                                    className={`${
                                      pilihanDataSalah.gdBaruAnteriorSewarnaJumlahTampalanDibuatCBox &&
                                      'bg-user9 bg-opacity-20'
                                    } flex items-center flex-row pl-5 mt-2`}
                                  >
                                    <input
                                      disabled
                                      type='number'
                                      name='gd-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                                      id='gd-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                                      value={
                                        rawatan.gdBaruAnteriorSewarnaJumlahTampalanDibuat
                                      }
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
                                    <div className='relative'>
                                      <input
                                        // disabled={disableSalah}
                                        type='checkbox'
                                        name='gd-baru-anterior-sewarna-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        id='gd-baru-anterior-sewarna-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        checked={
                                          pilihanDataSalah.gdBaruAnteriorSewarnaJumlahTampalanDibuatCBox
                                        }
                                        onChange={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            gdBaruAnteriorSewarnaJumlahTampalanDibuatCBox:
                                              !pilihanDataSalah.gdBaruAnteriorSewarnaJumlahTampalanDibuatCBox,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            gdBaruAnteriorSewarnaJumlahTampalanDibuatCBox:
                                              !pilihanDataSalah.gdBaruAnteriorSewarnaJumlahTampalanDibuatCBox,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              gdBaruAnteriorSewarnaJumlahTampalanDibuatCBox:
                                                !pilihanDataSalah.gdBaruAnteriorSewarnaJumlahTampalanDibuatCBox,
                                            },
                                          });
                                        }}
                                        className='peer hidden'
                                      />
                                      <label
                                        htmlFor='gd-baru-anterior-sewarna-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        className={`text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                      >
                                        {pilihanDataSalah.gdBaruAnteriorSewarnaJumlahTampalanDibuatCBox ===
                                        true ? (
                                          <FaTimes
                                            className='text-2xl'
                                            onClick={() => {
                                              setPilihanDataSalah({
                                                ...pilihanDataSalah,
                                                gdBaruAnteriorSewarnaJumlahTampalanDibuat:
                                                  '',
                                              });
                                              setDataRetenSalah({
                                                ...dataRetenSalah,
                                                gdBaruAnteriorSewarnaJumlahTampalanDibuat:
                                                  '',
                                              });
                                              setConfirmData({
                                                ...confirmData,
                                                pilihanDataSalah: {
                                                  ...pilihanDataSalah,
                                                  gdBaruAnteriorSewarnaJumlahTampalanDibuat:
                                                    '',
                                                },
                                              });
                                            }}
                                          />
                                        ) : (
                                          <FaRegHandPointLeft className='text-2xl' />
                                        )}
                                      </label>
                                    </div>
                                  </div>
                                  {pilihanDataSalah.gdBaruAnteriorSewarnaJumlahTampalanDibuatCBox ===
                                    true && (
                                    <div className='flex flex-row pl-5 items-center bg-user11 bg-opacity-50 mb-1'>
                                      <input
                                        // disabled={disableSalah}
                                        min='0'
                                        max='32'
                                        type='number'
                                        name='gd-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                                        id='gd-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                                        value={
                                          pilihanDataSalah.gdBaruAnteriorSewarnaJumlahTampalanDibuat
                                        }
                                        onChange={(e) => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            gdBaruAnteriorSewarnaJumlahTampalanDibuat:
                                              e.target.value,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            gdBaruAnteriorSewarnaJumlahTampalanDibuat:
                                              e.target.value,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              gdBaruAnteriorSewarnaJumlahTampalanDibuat:
                                                e.target.value,
                                            },
                                          });
                                        }}
                                        className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                      />
                                      <label
                                        htmlFor='gd-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                                        className='text-sm font-m ml-2 m-1'
                                      >
                                        GD Baru
                                      </label>
                                      <span className='text-kaunter4'>
                                        <FaCheck className='text-2xl' />
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div
                                  className={`${
                                    pilihanDataSalah.gdSemulaAnteriorSewarnaJumlahTampalanDibuatCBox &&
                                    'grid-rows-2'
                                  } grid pt-1`}
                                >
                                  <div
                                    className={`${
                                      pilihanDataSalah.gdSemulaAnteriorSewarnaJumlahTampalanDibuatCBox &&
                                      'bg-user9 bg-opacity-20'
                                    } flex items-center flex-row pl-5 mt-2`}
                                  >
                                    <input
                                      disabled
                                      type='number'
                                      name='gd-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                                      id='gd-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                                      value={
                                        rawatan.gdSemulaAnteriorSewarnaJumlahTampalanDibuat
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
                                    <div className='relative'>
                                      <input
                                        // disabled={disableSalah}
                                        type='checkbox'
                                        name='gd-semula-anterior-sewarna-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        id='gd-semula-anterior-sewarna-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        checked={
                                          pilihanDataSalah.gdSemulaAnteriorSewarnaJumlahTampalanDibuatCBox
                                        }
                                        onChange={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            gdSemulaAnteriorSewarnaJumlahTampalanDibuatCBox:
                                              !pilihanDataSalah.gdSemulaAnteriorSewarnaJumlahTampalanDibuatCBox,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            gdSemulaAnteriorSewarnaJumlahTampalanDibuatCBox:
                                              !pilihanDataSalah.gdSemulaAnteriorSewarnaJumlahTampalanDibuatCBox,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              gdSemulaAnteriorSewarnaJumlahTampalanDibuatCBox:
                                                !pilihanDataSalah.gdSemulaAnteriorSewarnaJumlahTampalanDibuatCBox,
                                            },
                                          });
                                        }}
                                        className='peer hidden'
                                      />
                                      <label
                                        htmlFor='gd-semula-anterior-sewarna-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        className={`text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                      >
                                        {pilihanDataSalah.gdSemulaAnteriorSewarnaJumlahTampalanDibuatCBox ===
                                        true ? (
                                          <FaTimes
                                            className='text-2xl'
                                            onClick={() => {
                                              setPilihanDataSalah({
                                                ...pilihanDataSalah,
                                                gdSemulaAnteriorSewarnaJumlahTampalanDibuat:
                                                  '',
                                              });
                                              setDataRetenSalah({
                                                ...dataRetenSalah,
                                                gdSemulaAnteriorSewarnaJumlahTampalanDibuat:
                                                  '',
                                              });
                                              setConfirmData({
                                                ...confirmData,
                                                pilihanDataSalah: {
                                                  ...pilihanDataSalah,
                                                  gdSemulaAnteriorSewarnaJumlahTampalanDibuat:
                                                    '',
                                                },
                                              });
                                            }}
                                          />
                                        ) : (
                                          <FaRegHandPointLeft className='text-2xl' />
                                        )}
                                      </label>
                                    </div>
                                  </div>
                                  {pilihanDataSalah.gdSemulaAnteriorSewarnaJumlahTampalanDibuatCBox ===
                                    true && (
                                    <div className='flex flex-row pl-5 items-center bg-user11 bg-opacity-50 mb-1'>
                                      <input
                                        // disabled={disableSalah}
                                        min='0'
                                        max='32'
                                        type='number'
                                        name='gd-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                                        id='gd-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                                        value={
                                          pilihanDataSalah.gdSemulaAnteriorSewarnaJumlahTampalanDibuat
                                        }
                                        onChange={(e) => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            gdSemulaAnteriorSewarnaJumlahTampalanDibuat:
                                              e.target.value,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            gdSemulaAnteriorSewarnaJumlahTampalanDibuat:
                                              e.target.value,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              gdSemulaAnteriorSewarnaJumlahTampalanDibuat:
                                                e.target.value,
                                            },
                                          });
                                        }}
                                        className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                      />
                                      <label
                                        htmlFor='gd-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                                        className='text-sm font-m ml-2 m-1'
                                      >
                                        GD Semula
                                      </label>
                                      <span className='text-kaunter4'>
                                        <FaCheck className='text-2xl' />
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div
                                  className={`${
                                    pilihanDataSalah.gkBaruAnteriorSewarnaJumlahTampalanDibuatCBox &&
                                    'grid-rows-2'
                                  } grid pt-1`}
                                >
                                  <div
                                    className={`${
                                      pilihanDataSalah.gkBaruAnteriorSewarnaJumlahTampalanDibuatCBox &&
                                      'bg-user9 bg-opacity-20'
                                    } flex items-center flex-row pl-5 mt-2`}
                                  >
                                    <input
                                      disabled
                                      type='number'
                                      name='gk-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                                      id='gk-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                                      value={
                                        rawatan.gkBaruAnteriorSewarnaJumlahTampalanDibuat
                                      }
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
                                    <div className='relative'>
                                      <input
                                        // disabled={disableSalah}
                                        type='checkbox'
                                        name='gk-baru-anterior-sewarna-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        id='gk-baru-anterior-sewarna-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        checked={
                                          pilihanDataSalah.gkBaruAnteriorSewarnaJumlahTampalanDibuatCBox
                                        }
                                        onChange={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            gkBaruAnteriorSewarnaJumlahTampalanDibuatCBox:
                                              !pilihanDataSalah.gkBaruAnteriorSewarnaJumlahTampalanDibuatCBox,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            gkBaruAnteriorSewarnaJumlahTampalanDibuatCBox:
                                              !pilihanDataSalah.gkBaruAnteriorSewarnaJumlahTampalanDibuatCBox,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              gkBaruAnteriorSewarnaJumlahTampalanDibuatCBox:
                                                !pilihanDataSalah.gkBaruAnteriorSewarnaJumlahTampalanDibuatCBox,
                                            },
                                          });
                                        }}
                                        className='peer hidden'
                                      />
                                      <label
                                        htmlFor='gk-baru-anterior-sewarna-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        className={`text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                      >
                                        {pilihanDataSalah.gkBaruAnteriorSewarnaJumlahTampalanDibuatCBox ===
                                        true ? (
                                          <FaTimes
                                            className='text-2xl'
                                            onClick={() => {
                                              setPilihanDataSalah({
                                                ...pilihanDataSalah,
                                                gkBaruAnteriorSewarnaJumlahTampalanDibuat:
                                                  '',
                                              });
                                              setDataRetenSalah({
                                                ...dataRetenSalah,
                                                gkBaruAnteriorSewarnaJumlahTampalanDibuat:
                                                  '',
                                              });
                                              setConfirmData({
                                                ...confirmData,
                                                pilihanDataSalah: {
                                                  ...pilihanDataSalah,
                                                  gkBaruAnteriorSewarnaJumlahTampalanDibuat:
                                                    '',
                                                },
                                              });
                                            }}
                                          />
                                        ) : (
                                          <FaRegHandPointLeft className='text-2xl' />
                                        )}
                                      </label>
                                    </div>
                                  </div>
                                  {pilihanDataSalah.gkBaruAnteriorSewarnaJumlahTampalanDibuatCBox ===
                                    true && (
                                    <div className='flex flex-row pl-5 items-center bg-user11 bg-opacity-50 mb-1'>
                                      <input
                                        // disabled={disableSalah}
                                        min='0'
                                        max='32'
                                        type='number'
                                        name='gk-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                                        id='gk-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                                        value={
                                          pilihanDataSalah.gkBaruAnteriorSewarnaJumlahTampalanDibuat
                                        }
                                        onChange={(e) => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            gkBaruAnteriorSewarnaJumlahTampalanDibuat:
                                              e.target.value,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            gkBaruAnteriorSewarnaJumlahTampalanDibuat:
                                              e.target.value,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              gkBaruAnteriorSewarnaJumlahTampalanDibuat:
                                                e.target.value,
                                            },
                                          });
                                        }}
                                        className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                      />
                                      <label
                                        htmlFor='gk-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                                        className='text-sm font-m ml-2 m-1'
                                      >
                                        GK Baru
                                      </label>
                                      <span className='text-kaunter4'>
                                        <FaCheck className='text-2xl' />
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div
                                  className={`${
                                    pilihanDataSalah.gkSemulaAnteriorSewarnaJumlahTampalanDibuatCBox &&
                                    'grid-rows-2'
                                  } grid pt-1`}
                                >
                                  <div
                                    className={`${
                                      pilihanDataSalah.gkSemulaAnteriorSewarnaJumlahTampalanDibuatCBox &&
                                      'bg-user9 bg-opacity-20'
                                    } flex items-center flex-row pl-5 mt-2`}
                                  >
                                    <input
                                      disabled
                                      type='number'
                                      name='gk-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                                      id='gk-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                                      value={
                                        rawatan.gkSemulaAnteriorSewarnaJumlahTampalanDibuat
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
                                    <div className='relative'>
                                      <input
                                        // disabled={disableSalah}
                                        type='checkbox'
                                        name='gk-semula-anterior-sewarna-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        id='gk-semula-anterior-sewarna-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        checked={
                                          pilihanDataSalah.gkSemulaAnteriorSewarnaJumlahTampalanDibuatCBox
                                        }
                                        onChange={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            gkSemulaAnteriorSewarnaJumlahTampalanDibuatCBox:
                                              !pilihanDataSalah.gkSemulaAnteriorSewarnaJumlahTampalanDibuatCBox,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            gkSemulaAnteriorSewarnaJumlahTampalanDibuatCBox:
                                              !pilihanDataSalah.gkSemulaAnteriorSewarnaJumlahTampalanDibuatCBox,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              gkSemulaAnteriorSewarnaJumlahTampalanDibuatCBox:
                                                !pilihanDataSalah.gkSemulaAnteriorSewarnaJumlahTampalanDibuatCBox,
                                            },
                                          });
                                        }}
                                        className='peer hidden'
                                      />
                                      <label
                                        htmlFor='gk-semula-anterior-sewarna-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        className={`text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                      >
                                        {pilihanDataSalah.gkSemulaAnteriorSewarnaJumlahTampalanDibuatCBox ===
                                        true ? (
                                          <FaTimes
                                            className='text-2xl'
                                            onClick={() => {
                                              setPilihanDataSalah({
                                                ...pilihanDataSalah,
                                                gkSemulaAnteriorSewarnaJumlahTampalanDibuat:
                                                  '',
                                              });
                                              setDataRetenSalah({
                                                ...dataRetenSalah,
                                                gkSemulaAnteriorSewarnaJumlahTampalanDibuat:
                                                  '',
                                              });
                                              setConfirmData({
                                                ...confirmData,
                                                pilihanDataSalah: {
                                                  ...pilihanDataSalah,
                                                  gkSemulaAnteriorSewarnaJumlahTampalanDibuat:
                                                    '',
                                                },
                                              });
                                            }}
                                          />
                                        ) : (
                                          <FaRegHandPointLeft className='text-2xl' />
                                        )}
                                      </label>
                                    </div>
                                  </div>
                                  {pilihanDataSalah.gkSemulaAnteriorSewarnaJumlahTampalanDibuatCBox ===
                                    true && (
                                    <div className='flex flex-row pl-5 items-center bg-user11 bg-opacity-50 mb-1'>
                                      <input
                                        // disabled={disableSalah}
                                        min='0'
                                        max='32'
                                        type='number'
                                        name='gk-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                                        id='gk-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                                        value={
                                          pilihanDataSalah.gkSemulaAnteriorSewarnaJumlahTampalanDibuat
                                        }
                                        onChange={(e) => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            gkSemulaAnteriorSewarnaJumlahTampalanDibuat:
                                              e.target.value,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            gkSemulaAnteriorSewarnaJumlahTampalanDibuat:
                                              e.target.value,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              gkSemulaAnteriorSewarnaJumlahTampalanDibuat:
                                                e.target.value,
                                            },
                                          });
                                        }}
                                        className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                      />
                                      <label
                                        htmlFor='gk-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                                        className='text-sm font-m ml-2 m-1'
                                      >
                                        GK Semula
                                      </label>
                                      <span className='text-kaunter4'>
                                        <FaCheck className='text-2xl' />
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </article>
                              <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                                <h4 className='font-semibold flex flex-row pl-5 col-span-2'>
                                  Posterior Sewarna
                                </h4>
                                <div
                                  className={`${
                                    pilihanDataSalah.gdBaruPosteriorSewarnaJumlahTampalanDibuatCBox &&
                                    'grid-rows-2'
                                  } grid pt-1`}
                                >
                                  <div
                                    className={`${
                                      pilihanDataSalah.gdBaruPosteriorSewarnaJumlahTampalanDibuatCBox &&
                                      'bg-user9 bg-opacity-20'
                                    } flex items-center flex-row pl-5 mt-2`}
                                  >
                                    <input
                                      disabled
                                      type='number'
                                      name='gd-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                                      id='gd-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                                      value={
                                        rawatan.gdBaruPosteriorSewarnaJumlahTampalanDibuat
                                      }
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
                                    <div className='relative'>
                                      <input
                                        // disabled={disableSalah}
                                        type='checkbox'
                                        name='gd-baru-posterior-sewarna-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        id='gd-baru-posterior-sewarna-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        checked={
                                          pilihanDataSalah.gdBaruPosteriorSewarnaJumlahTampalanDibuatCBox
                                        }
                                        onChange={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            gdBaruPosteriorSewarnaJumlahTampalanDibuatCBox:
                                              !pilihanDataSalah.gdBaruPosteriorSewarnaJumlahTampalanDibuatCBox,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            gdBaruPosteriorSewarnaJumlahTampalanDibuatCBox:
                                              !pilihanDataSalah.gdBaruPosteriorSewarnaJumlahTampalanDibuatCBox,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              gdBaruPosteriorSewarnaJumlahTampalanDibuatCBox:
                                                !pilihanDataSalah.gdBaruPosteriorSewarnaJumlahTampalanDibuatCBox,
                                            },
                                          });
                                        }}
                                        className='peer hidden'
                                      />
                                      <label
                                        htmlFor='gd-baru-posterior-sewarna-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        className={`text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                      >
                                        {pilihanDataSalah.gdBaruPosteriorSewarnaJumlahTampalanDibuatCBox ===
                                        true ? (
                                          <FaTimes
                                            className='text-2xl'
                                            onClick={() => {
                                              setPilihanDataSalah({
                                                ...pilihanDataSalah,
                                                gdBaruPosteriorSewarnaJumlahTampalanDibuat:
                                                  '',
                                              });
                                              setDataRetenSalah({
                                                ...dataRetenSalah,
                                                gdBaruPosteriorSewarnaJumlahTampalanDibuat:
                                                  '',
                                              });
                                              setConfirmData({
                                                ...confirmData,
                                                pilihanDataSalah: {
                                                  ...pilihanDataSalah,
                                                  gdBaruPosteriorSewarnaJumlahTampalanDibuat:
                                                    '',
                                                },
                                              });
                                            }}
                                          />
                                        ) : (
                                          <FaRegHandPointLeft className='text-2xl' />
                                        )}
                                      </label>
                                    </div>
                                  </div>
                                  {pilihanDataSalah.gdBaruPosteriorSewarnaJumlahTampalanDibuatCBox ===
                                    true && (
                                    <div className='flex flex-row pl-5 items-center bg-user11 bg-opacity-50 mb-1'>
                                      <input
                                        // disabled={disableSalah}
                                        min='0'
                                        max='32'
                                        type='number'
                                        name='gd-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                                        id='gd-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                                        value={
                                          pilihanDataSalah.gdBaruPosteriorSewarnaJumlahTampalanDibuat
                                        }
                                        onChange={(e) => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            gdBaruPosteriorSewarnaJumlahTampalanDibuat:
                                              e.target.value,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            gdBaruPosteriorSewarnaJumlahTampalanDibuat:
                                              e.target.value,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              gdBaruPosteriorSewarnaJumlahTampalanDibuat:
                                                e.target.value,
                                            },
                                          });
                                        }}
                                        className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                      />
                                      <label
                                        htmlFor='gd-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                                        className='text-sm font-m ml-2 m-1'
                                      >
                                        GD Baru
                                      </label>
                                      <span className='text-kaunter4'>
                                        <FaCheck className='text-2xl' />
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div
                                  className={`${
                                    pilihanDataSalah.gdSemulaPosteriorSewarnaJumlahTampalanDibuatCBox &&
                                    'grid-rows-2'
                                  } grid pt-1`}
                                >
                                  <div
                                    className={`${
                                      pilihanDataSalah.gdSemulaPosteriorSewarnaJumlahTampalanDibuatCBox &&
                                      'bg-user9 bg-opacity-20'
                                    } flex items-center flex-row pl-5 mt-2`}
                                  >
                                    <input
                                      disabled
                                      type='number'
                                      name='gd-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                                      id='gd-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                                      value={
                                        rawatan.gdSemulaPosteriorSewarnaJumlahTampalanDibuat
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
                                    <div className='relative'>
                                      <input
                                        // disabled={disableSalah}
                                        type='checkbox'
                                        name='gd-semula-posterior-sewarna-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        id='gd-semula-posterior-sewarna-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        checked={
                                          pilihanDataSalah.gdSemulaPosteriorSewarnaJumlahTampalanDibuatCBox
                                        }
                                        onChange={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            gdSemulaPosteriorSewarnaJumlahTampalanDibuatCBox:
                                              !pilihanDataSalah.gdSemulaPosteriorSewarnaJumlahTampalanDibuatCBox,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            gdSemulaPosteriorSewarnaJumlahTampalanDibuatCBox:
                                              !pilihanDataSalah.gdSemulaPosteriorSewarnaJumlahTampalanDibuatCBox,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              gdSemulaPosteriorSewarnaJumlahTampalanDibuatCBox:
                                                !pilihanDataSalah.gdSemulaPosteriorSewarnaJumlahTampalanDibuatCBox,
                                            },
                                          });
                                        }}
                                        className='peer hidden'
                                      />
                                      <label
                                        htmlFor='gd-semula-posterior-sewarna-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        className={`text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                      >
                                        {pilihanDataSalah.gdSemulaPosteriorSewarnaJumlahTampalanDibuatCBox ===
                                        true ? (
                                          <FaTimes
                                            className='text-2xl'
                                            onClick={() => {
                                              setPilihanDataSalah({
                                                ...pilihanDataSalah,
                                                gdSemulaPosteriorSewarnaJumlahTampalanDibuat:
                                                  '',
                                              });
                                              setDataRetenSalah({
                                                ...dataRetenSalah,
                                                gdSemulaPosteriorSewarnaJumlahTampalanDibuat:
                                                  '',
                                              });
                                              setConfirmData({
                                                ...confirmData,
                                                pilihanDataSalah: {
                                                  ...pilihanDataSalah,
                                                  gdSemulaPosteriorSewarnaJumlahTampalanDibuat:
                                                    '',
                                                },
                                              });
                                            }}
                                          />
                                        ) : (
                                          <FaRegHandPointLeft className='text-2xl' />
                                        )}
                                      </label>
                                    </div>
                                  </div>
                                  {pilihanDataSalah.gdSemulaPosteriorSewarnaJumlahTampalanDibuatCBox ===
                                    true && (
                                    <div className='flex flex-row pl-5 items-center bg-user11 bg-opacity-50 mb-1'>
                                      <input
                                        // disabled={disableSalah}
                                        min='0'
                                        max='32'
                                        type='number'
                                        name='gd-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                                        id='gd-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                                        value={
                                          pilihanDataSalah.gdSemulaPosteriorSewarnaJumlahTampalanDibuat
                                        }
                                        onChange={(e) => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            gdSemulaPosteriorSewarnaJumlahTampalanDibuat:
                                              e.target.value,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            gdSemulaPosteriorSewarnaJumlahTampalanDibuat:
                                              e.target.value,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              gdSemulaPosteriorSewarnaJumlahTampalanDibuat:
                                                e.target.value,
                                            },
                                          });
                                        }}
                                        className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                      />
                                      <label
                                        htmlFor='gd-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                                        className='text-sm font-m ml-2 m-1'
                                      >
                                        GD Semula
                                      </label>
                                      <span className='text-kaunter4'>
                                        <FaCheck className='text-2xl' />
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div
                                  className={`${
                                    pilihanDataSalah.gkBaruPosteriorSewarnaJumlahTampalanDibuatCBox &&
                                    'grid-rows-2'
                                  } grid pt-1`}
                                >
                                  <div
                                    className={`${
                                      pilihanDataSalah.gkBaruPosteriorSewarnaJumlahTampalanDibuatCBox &&
                                      'bg-user9 bg-opacity-20'
                                    } flex items-center flex-row pl-5 mt-2`}
                                  >
                                    <input
                                      disabled
                                      type='number'
                                      name='gk-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                                      id='gk-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                                      value={
                                        rawatan.gkBaruPosteriorSewarnaJumlahTampalanDibuat
                                      }
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
                                    <div className='relative'>
                                      <input
                                        // disabled={disableSalah}
                                        type='checkbox'
                                        name='gk-baru-posterior-sewarna-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        id='gk-baru-posterior-sewarna-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        checked={
                                          pilihanDataSalah.gkBaruPosteriorSewarnaJumlahTampalanDibuatCBox
                                        }
                                        onChange={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            gkBaruPosteriorSewarnaJumlahTampalanDibuatCBox:
                                              !pilihanDataSalah.gkBaruPosteriorSewarnaJumlahTampalanDibuatCBox,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            gkBaruPosteriorSewarnaJumlahTampalanDibuatCBox:
                                              !pilihanDataSalah.gkBaruPosteriorSewarnaJumlahTampalanDibuatCBox,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              gkBaruPosteriorSewarnaJumlahTampalanDibuatCBox:
                                                !pilihanDataSalah.gkBaruPosteriorSewarnaJumlahTampalanDibuatCBox,
                                            },
                                          });
                                        }}
                                        className='peer hidden'
                                      />
                                      <label
                                        htmlFor='gk-baru-posterior-sewarna-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        className={`text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                      >
                                        {pilihanDataSalah.gkBaruPosteriorSewarnaJumlahTampalanDibuatCBox ===
                                        true ? (
                                          <FaTimes
                                            className='text-2xl'
                                            onClick={() => {
                                              setPilihanDataSalah({
                                                ...pilihanDataSalah,
                                                gkBaruPosteriorSewarnaJumlahTampalanDibuat:
                                                  '',
                                              });
                                              setDataRetenSalah({
                                                ...dataRetenSalah,
                                                gkBaruPosteriorSewarnaJumlahTampalanDibuat:
                                                  '',
                                              });
                                              setConfirmData({
                                                ...confirmData,
                                                pilihanDataSalah: {
                                                  ...pilihanDataSalah,
                                                  gkBaruPosteriorSewarnaJumlahTampalanDibuat:
                                                    '',
                                                },
                                              });
                                            }}
                                          />
                                        ) : (
                                          <FaRegHandPointLeft className='text-2xl' />
                                        )}
                                      </label>
                                    </div>
                                  </div>
                                  {pilihanDataSalah.gkBaruPosteriorSewarnaJumlahTampalanDibuatCBox ===
                                    true && (
                                    <div className='flex flex-row pl-5 items-center bg-user11 bg-opacity-50 mb-1'>
                                      <input
                                        // disabled={disableSalah}
                                        min='0'
                                        max='32'
                                        type='number'
                                        name='gk-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                                        id='gk-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                                        value={
                                          pilihanDataSalah.gkBaruPosteriorSewarnaJumlahTampalanDibuat
                                        }
                                        onChange={(e) => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            gkBaruPosteriorSewarnaJumlahTampalanDibuat:
                                              e.target.value,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            gkBaruPosteriorSewarnaJumlahTampalanDibuat:
                                              e.target.value,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              gkBaruPosteriorSewarnaJumlahTampalanDibuat:
                                                e.target.value,
                                            },
                                          });
                                        }}
                                        className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                      />
                                      <label
                                        htmlFor='gk-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                                        className='text-sm font-m ml-2 m-1'
                                      >
                                        GK Baru
                                      </label>
                                      <span className='text-kaunter4'>
                                        <FaCheck className='text-2xl' />
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div
                                  className={`${
                                    pilihanDataSalah.gkSemulaPosteriorSewarnaJumlahTampalanDibuatCBox &&
                                    'grid-rows-2'
                                  } grid pt-1`}
                                >
                                  <div
                                    className={`${
                                      pilihanDataSalah.gkSemulaPosteriorSewarnaJumlahTampalanDibuatCBox &&
                                      'bg-user9 bg-opacity-20'
                                    } flex items-center flex-row pl-5 mt-2`}
                                  >
                                    <input
                                      disabled
                                      type='number'
                                      name='gk-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                                      id='gk-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                                      value={
                                        rawatan.gkSemulaPosteriorSewarnaJumlahTampalanDibuat
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
                                    <div className='relative'>
                                      <input
                                        // disabled={disableSalah}
                                        type='checkbox'
                                        name='gk-semula-posterior-sewarna-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        id='gk-semula-posterior-sewarna-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        checked={
                                          pilihanDataSalah.gkSemulaPosteriorSewarnaJumlahTampalanDibuatCBox
                                        }
                                        onChange={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            gkSemulaPosteriorSewarnaJumlahTampalanDibuatCBox:
                                              !pilihanDataSalah.gkSemulaPosteriorSewarnaJumlahTampalanDibuatCBox,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            gkSemulaPosteriorSewarnaJumlahTampalanDibuatCBox:
                                              !pilihanDataSalah.gkSemulaPosteriorSewarnaJumlahTampalanDibuatCBox,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              gkSemulaPosteriorSewarnaJumlahTampalanDibuatCBox:
                                                !pilihanDataSalah.gkSemulaPosteriorSewarnaJumlahTampalanDibuatCBox,
                                            },
                                          });
                                        }}
                                        className='peer hidden'
                                      />
                                      <label
                                        htmlFor='gk-semula-posterior-sewarna-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        className={`text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                      >
                                        {pilihanDataSalah.gkSemulaPosteriorSewarnaJumlahTampalanDibuatCBox ===
                                        true ? (
                                          <FaTimes
                                            className='text-2xl'
                                            onClick={() => {
                                              setPilihanDataSalah({
                                                ...pilihanDataSalah,
                                                gkSemulaPosteriorSewarnaJumlahTampalanDibuat:
                                                  '',
                                              });
                                              setDataRetenSalah({
                                                ...dataRetenSalah,
                                                gkSemulaPosteriorSewarnaJumlahTampalanDibuat:
                                                  '',
                                              });
                                              setConfirmData({
                                                ...confirmData,
                                                pilihanDataSalah: {
                                                  ...pilihanDataSalah,
                                                  gkSemulaPosteriorSewarnaJumlahTampalanDibuat:
                                                    '',
                                                },
                                              });
                                            }}
                                          />
                                        ) : (
                                          <FaRegHandPointLeft className='text-2xl' />
                                        )}
                                      </label>
                                    </div>
                                  </div>
                                  {pilihanDataSalah.gkSemulaPosteriorSewarnaJumlahTampalanDibuatCBox ===
                                    true && (
                                    <div className='flex flex-row pl-5 items-center bg-user11 bg-opacity-50 mb-1'>
                                      <input
                                        // disabled={disableSalah}
                                        min='0'
                                        max='32'
                                        type='number'
                                        name='gk-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                                        id='gk-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                                        value={
                                          pilihanDataSalah.gkSemulaPosteriorSewarnaJumlahTampalanDibuat
                                        }
                                        onChange={(e) => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            gkSemulaPosteriorSewarnaJumlahTampalanDibuat:
                                              e.target.value,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            gkSemulaPosteriorSewarnaJumlahTampalanDibuat:
                                              e.target.value,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              gkSemulaPosteriorSewarnaJumlahTampalanDibuat:
                                                e.target.value,
                                            },
                                          });
                                        }}
                                        className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                      />
                                      <label
                                        htmlFor='gk-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                                        className='text-sm font-m ml-2 m-1'
                                      >
                                        GK Semula
                                      </label>
                                      <span className='text-kaunter4'>
                                        <FaCheck className='text-2xl' />
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </article>
                              <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                                <h4 className='font-semibold flex flex-row pl-5 col-span-2'>
                                  Posterior Amalgam
                                </h4>
                                <div
                                  className={`${
                                    pilihanDataSalah.gdBaruPosteriorAmalgamJumlahTampalanDibuatCBox &&
                                    'grid-rows-2'
                                  } grid pt-1`}
                                >
                                  <div
                                    className={`${
                                      pilihanDataSalah.gdBaruPosteriorAmalgamJumlahTampalanDibuatCBox &&
                                      'bg-user9 bg-opacity-20'
                                    } flex items-center flex-row pl-5 mt-2`}
                                  >
                                    <input
                                      disabled
                                      type='number'
                                      name='gd-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                                      id='gd-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                                      value={
                                        rawatan.gdBaruPosteriorAmalgamJumlahTampalanDibuat
                                      }
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
                                    <div className='relative'>
                                      <input
                                        // disabled={disableSalah}
                                        type='checkbox'
                                        name='gd-baru-posterior-amalgam-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        id='gd-baru-posterior-amalgam-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        checked={
                                          pilihanDataSalah.gdBaruPosteriorAmalgamJumlahTampalanDibuatCBox
                                        }
                                        onChange={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            gdBaruPosteriorAmalgamJumlahTampalanDibuatCBox:
                                              !pilihanDataSalah.gdBaruPosteriorAmalgamJumlahTampalanDibuatCBox,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            gdBaruPosteriorAmalgamJumlahTampalanDibuatCBox:
                                              !pilihanDataSalah.gdBaruPosteriorAmalgamJumlahTampalanDibuatCBox,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              gdBaruPosteriorAmalgamJumlahTampalanDibuatCBox:
                                                !pilihanDataSalah.gdBaruPosteriorAmalgamJumlahTampalanDibuatCBox,
                                            },
                                          });
                                        }}
                                        className='peer hidden'
                                      />
                                      <label
                                        htmlFor='gd-baru-posterior-amalgam-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        className={`text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                      >
                                        {pilihanDataSalah.gdBaruPosteriorAmalgamJumlahTampalanDibuatCBox ===
                                        true ? (
                                          <FaTimes
                                            className='text-2xl'
                                            onClick={() => {
                                              setPilihanDataSalah({
                                                ...pilihanDataSalah,
                                                gdBaruPosteriorAmalgamJumlahTampalanDibuat:
                                                  '',
                                              });
                                              setDataRetenSalah({
                                                ...dataRetenSalah,
                                                gdBaruPosteriorAmalgamJumlahTampalanDibuat:
                                                  '',
                                              });
                                              setConfirmData({
                                                ...confirmData,
                                                pilihanDataSalah: {
                                                  ...pilihanDataSalah,
                                                  gdBaruPosteriorAmalgamJumlahTampalanDibuat:
                                                    '',
                                                },
                                              });
                                            }}
                                          />
                                        ) : (
                                          <FaRegHandPointLeft className='text-2xl' />
                                        )}
                                      </label>
                                    </div>
                                  </div>
                                  {pilihanDataSalah.gdBaruPosteriorAmalgamJumlahTampalanDibuatCBox ===
                                    true && (
                                    <div className='flex flex-row pl-5 items-center bg-user11 bg-opacity-50 mb-1'>
                                      <input
                                        // disabled={disableSalah}
                                        min='0'
                                        max='32'
                                        type='number'
                                        name='gd-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                                        id='gd-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                                        value={
                                          pilihanDataSalah.gdBaruPosteriorAmalgamJumlahTampalanDibuat
                                        }
                                        onChange={(e) => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            gdBaruPosteriorAmalgamJumlahTampalanDibuat:
                                              e.target.value,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            gdBaruPosteriorAmalgamJumlahTampalanDibuat:
                                              e.target.value,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              gdBaruPosteriorAmalgamJumlahTampalanDibuat:
                                                e.target.value,
                                            },
                                          });
                                        }}
                                        className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                      />
                                      <label
                                        htmlFor='gd-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                                        className='text-sm font-m ml-2 m-1'
                                      >
                                        GD Baru
                                      </label>
                                      <span className='text-kaunter4'>
                                        <FaCheck className='text-2xl' />
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div
                                  className={`${
                                    pilihanDataSalah.gdSemulaPosteriorAmalgamJumlahTampalanDibuatCBox &&
                                    'grid-rows-2'
                                  } grid pt-1`}
                                >
                                  <div
                                    className={`${
                                      pilihanDataSalah.gdSemulaPosteriorAmalgamJumlahTampalanDibuatCBox &&
                                      'bg-user9 bg-opacity-20'
                                    } flex items-center flex-row pl-5 mt-2`}
                                  >
                                    <input
                                      disabled
                                      type='number'
                                      name='gd-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                                      id='gd-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                                      value={
                                        rawatan.gdSemulaPosteriorAmalgamJumlahTampalanDibuat
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
                                    <div className='relative'>
                                      <input
                                        // disabled={disableSalah}
                                        type='checkbox'
                                        name='gd-semula-posterior-amalgam-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        id='gd-semula-posterior-amalgam-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        checked={
                                          pilihanDataSalah.gdSemulaPosteriorAmalgamJumlahTampalanDibuatCBox
                                        }
                                        onChange={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            gdSemulaPosteriorAmalgamJumlahTampalanDibuatCBox:
                                              !pilihanDataSalah.gdSemulaPosteriorAmalgamJumlahTampalanDibuatCBox,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            gdSemulaPosteriorAmalgamJumlahTampalanDibuatCBox:
                                              !pilihanDataSalah.gdSemulaPosteriorAmalgamJumlahTampalanDibuatCBox,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              gdSemulaPosteriorAmalgamJumlahTampalanDibuatCBox:
                                                !pilihanDataSalah.gdSemulaPosteriorAmalgamJumlahTampalanDibuatCBox,
                                            },
                                          });
                                        }}
                                        className='peer hidden'
                                      />
                                      <label
                                        htmlFor='gd-semula-posterior-amalgam-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        className={`text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                      >
                                        {pilihanDataSalah.gdSemulaPosteriorAmalgamJumlahTampalanDibuatCBox ===
                                        true ? (
                                          <FaTimes
                                            className='text-2xl'
                                            onClick={() => {
                                              setPilihanDataSalah({
                                                ...pilihanDataSalah,
                                                gdSemulaPosteriorAmalgamJumlahTampalanDibuat:
                                                  '',
                                              });
                                              setDataRetenSalah({
                                                ...dataRetenSalah,
                                                gdSemulaPosteriorAmalgamJumlahTampalanDibuat:
                                                  '',
                                              });
                                              setConfirmData({
                                                ...confirmData,
                                                pilihanDataSalah: {
                                                  ...pilihanDataSalah,
                                                  gdSemulaPosteriorAmalgamJumlahTampalanDibuat:
                                                    '',
                                                },
                                              });
                                            }}
                                          />
                                        ) : (
                                          <FaRegHandPointLeft className='text-2xl' />
                                        )}
                                      </label>
                                    </div>
                                  </div>
                                  {pilihanDataSalah.gdSemulaPosteriorAmalgamJumlahTampalanDibuatCBox ===
                                    true && (
                                    <div className='flex flex-row pl-5 items-center bg-user11 bg-opacity-50 mb-1'>
                                      <input
                                        // disabled={disableSalah}
                                        min='0'
                                        max='32'
                                        type='number'
                                        name='gd-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                                        id='gd-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                                        value={
                                          pilihanDataSalah.gdSemulaPosteriorAmalgamJumlahTampalanDibuat
                                        }
                                        onChange={(e) => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            gdSemulaPosteriorAmalgamJumlahTampalanDibuat:
                                              e.target.value,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            gdSemulaPosteriorAmalgamJumlahTampalanDibuat:
                                              e.target.value,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              gdSemulaPosteriorAmalgamJumlahTampalanDibuat:
                                                e.target.value,
                                            },
                                          });
                                        }}
                                        className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                      />
                                      <label
                                        htmlFor='gd-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                                        className='text-sm font-m ml-2 m-1'
                                      >
                                        GD Semula
                                      </label>
                                      <span className='text-kaunter4'>
                                        <FaCheck className='text-2xl' />
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div
                                  className={`${
                                    pilihanDataSalah.gkBaruPosteriorAmalgamJumlahTampalanDibuatCBox &&
                                    'grid-rows-2'
                                  } grid pt-1`}
                                >
                                  <div
                                    className={`${
                                      pilihanDataSalah.gkBaruPosteriorAmalgamJumlahTampalanDibuatCBox &&
                                      'bg-user9 bg-opacity-20'
                                    } flex items-center flex-row pl-5 mt-2`}
                                  >
                                    <input
                                      disabled
                                      type='number'
                                      name='gk-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                                      id='gk-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                                      value={
                                        rawatan.gkBaruPosteriorAmalgamJumlahTampalanDibuat
                                      }
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
                                    <div className='relative'>
                                      <input
                                        // disabled={disableSalah}
                                        type='checkbox'
                                        name='gk-baru-posterior-amalgam-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        id='gk-baru-posterior-amalgam-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        checked={
                                          pilihanDataSalah.gkBaruPosteriorAmalgamJumlahTampalanDibuatCBox
                                        }
                                        onChange={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            gkBaruPosteriorAmalgamJumlahTampalanDibuatCBox:
                                              !pilihanDataSalah.gkBaruPosteriorAmalgamJumlahTampalanDibuatCBox,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            gkBaruPosteriorAmalgamJumlahTampalanDibuatCBox:
                                              !pilihanDataSalah.gkBaruPosteriorAmalgamJumlahTampalanDibuatCBox,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              gkBaruPosteriorAmalgamJumlahTampalanDibuatCBox:
                                                !pilihanDataSalah.gkBaruPosteriorAmalgamJumlahTampalanDibuatCBox,
                                            },
                                          });
                                        }}
                                        className='peer hidden'
                                      />
                                      <label
                                        htmlFor='gk-baru-posterior-amalgam-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        className={`text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                      >
                                        {pilihanDataSalah.gkBaruPosteriorAmalgamJumlahTampalanDibuatCBox ===
                                        true ? (
                                          <FaTimes
                                            className='text-2xl'
                                            onClick={() => {
                                              setPilihanDataSalah({
                                                ...pilihanDataSalah,
                                                gkBaruPosteriorAmalgamJumlahTampalanDibuat:
                                                  '',
                                              });
                                              setDataRetenSalah({
                                                ...dataRetenSalah,
                                                gkBaruPosteriorAmalgamJumlahTampalanDibuat:
                                                  '',
                                              });
                                              setConfirmData({
                                                ...confirmData,
                                                pilihanDataSalah: {
                                                  ...pilihanDataSalah,
                                                  gkBaruPosteriorAmalgamJumlahTampalanDibuat:
                                                    '',
                                                },
                                              });
                                            }}
                                          />
                                        ) : (
                                          <FaRegHandPointLeft className='text-2xl' />
                                        )}
                                      </label>
                                    </div>
                                  </div>
                                  {pilihanDataSalah.gkBaruPosteriorAmalgamJumlahTampalanDibuatCBox ===
                                    true && (
                                    <div className='flex flex-row pl-5 items-center bg-user11 bg-opacity-50 mb-1'>
                                      <input
                                        // disabled={disableSalah}
                                        min='0'
                                        max='32'
                                        type='number'
                                        name='gk-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                                        id='gk-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                                        value={
                                          pilihanDataSalah.gkBaruPosteriorAmalgamJumlahTampalanDibuat
                                        }
                                        onChange={(e) => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            gkBaruPosteriorAmalgamJumlahTampalanDibuat:
                                              e.target.value,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            gkBaruPosteriorAmalgamJumlahTampalanDibuat:
                                              e.target.value,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              gkBaruPosteriorAmalgamJumlahTampalanDibuat:
                                                e.target.value,
                                            },
                                          });
                                        }}
                                        className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                      />
                                      <label
                                        htmlFor='gk-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                                        className='text-sm font-m ml-2 m-1'
                                      >
                                        GK Baru
                                      </label>
                                      <span className='text-kaunter4'>
                                        <FaCheck className='text-2xl' />
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div
                                  className={`${
                                    pilihanDataSalah.gkSemulaPosteriorAmalgamJumlahTampalanDibuatCBox &&
                                    'grid-rows-2'
                                  } grid pt-1`}
                                >
                                  <div
                                    className={`${
                                      pilihanDataSalah.gkSemulaPosteriorAmalgamJumlahTampalanDibuatCBox &&
                                      'bg-user9 bg-opacity-20'
                                    } flex items-center flex-row pl-5 mt-2`}
                                  >
                                    <input
                                      disabled
                                      type='number'
                                      name='gk-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                                      id='gk-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                                      value={
                                        rawatan.gkSemulaPosteriorAmalgamJumlahTampalanDibuat
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
                                    <div className='relative'>
                                      <input
                                        // disabled={disableSalah}
                                        type='checkbox'
                                        name='gk-semula-posterior-amalgam-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        id='gk-semula-posterior-amalgam-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        checked={
                                          pilihanDataSalah.gkSemulaPosteriorAmalgamJumlahTampalanDibuatCBox
                                        }
                                        onChange={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            gkSemulaPosteriorAmalgamJumlahTampalanDibuatCBox:
                                              !pilihanDataSalah.gkSemulaPosteriorAmalgamJumlahTampalanDibuatCBox,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            gkSemulaPosteriorAmalgamJumlahTampalanDibuatCBox:
                                              !pilihanDataSalah.gkSemulaPosteriorAmalgamJumlahTampalanDibuatCBox,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              gkSemulaPosteriorAmalgamJumlahTampalanDibuatCBox:
                                                !pilihanDataSalah.gkSemulaPosteriorAmalgamJumlahTampalanDibuatCBox,
                                            },
                                          });
                                        }}
                                        className='peer hidden'
                                      />
                                      <label
                                        htmlFor='gk-semula-posterior-amalgam-jumlah-tampalan-dibuat-reten-salah-cbox'
                                        className={`text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                      >
                                        {pilihanDataSalah.gkSemulaPosteriorAmalgamJumlahTampalanDibuatCBox ===
                                        true ? (
                                          <FaTimes
                                            className='text-2xl'
                                            onClick={() => {
                                              setPilihanDataSalah({
                                                ...pilihanDataSalah,
                                                gkSemulaPosteriorAmalgamJumlahTampalanDibuat:
                                                  '',
                                              });
                                              setDataRetenSalah({
                                                ...dataRetenSalah,
                                                gkSemulaPosteriorAmalgamJumlahTampalanDibuat:
                                                  '',
                                              });
                                              setConfirmData({
                                                ...confirmData,
                                                pilihanDataSalah: {
                                                  ...pilihanDataSalah,
                                                  gkSemulaPosteriorAmalgamJumlahTampalanDibuat:
                                                    '',
                                                },
                                              });
                                            }}
                                          />
                                        ) : (
                                          <FaRegHandPointLeft className='text-2xl' />
                                        )}
                                      </label>
                                    </div>
                                  </div>
                                  {pilihanDataSalah.gkSemulaPosteriorAmalgamJumlahTampalanDibuatCBox ===
                                    true && (
                                    <div className='flex flex-row pl-5 items-center bg-user11 bg-opacity-50 mb-1'>
                                      <input
                                        // disabled={disableSalah}
                                        min='0'
                                        max='32'
                                        type='number'
                                        name='gk-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                                        id='gk-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                                        value={
                                          pilihanDataSalah.gkSemulaPosteriorAmalgamJumlahTampalanDibuat
                                        }
                                        onChange={(e) => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            gkSemulaPosteriorAmalgamJumlahTampalanDibuat:
                                              e.target.value,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            gkSemulaPosteriorAmalgamJumlahTampalanDibuat:
                                              e.target.value,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              gkSemulaPosteriorAmalgamJumlahTampalanDibuat:
                                                e.target.value,
                                            },
                                          });
                                        }}
                                        className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                      />
                                      <label
                                        htmlFor='gk-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                                        className='text-sm font-m ml-2 m-1'
                                      >
                                        GK Semula
                                      </label>
                                      <span className='text-kaunter4'>
                                        <FaCheck className='text-2xl' />
                                      </span>
                                    </div>
                                  )}
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
                              <div
                                className={`${
                                  pilihanDataSalah.jumlahTampalanSementaraSekolahRawatanCBox &&
                                  'grid-rows-2'
                                } grid pt-1`}
                              >
                                <div
                                  className={`${
                                    pilihanDataSalah.jumlahTampalanSementaraSekolahRawatanCBox &&
                                    'bg-user9 bg-opacity-20'
                                  } flex items-center flex-row pl-5 mt-2`}
                                >
                                  <input
                                    disabled
                                    type='number'
                                    name='jumlah-tampalan-sementara-penyata-akhir-2'
                                    id='jumlah-tampalan-sementara-penyata-akhir-2'
                                    value={
                                      rawatan.jumlahTampalanSementaraSekolahRawatan
                                    }
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
                                  <div className='relative'>
                                    <input
                                      // disabled={disableSalah}
                                      type='checkbox'
                                      name='jumlah-tampalan-sementara-penyata-akhir-2-reten-salah-cbox'
                                      id='jumlah-tampalan-sementara-penyata-akhir-2-reten-salah-cbox'
                                      checked={
                                        pilihanDataSalah.jumlahTampalanSementaraSekolahRawatanCBox
                                      }
                                      onChange={() => {
                                        setPilihanDataSalah({
                                          ...pilihanDataSalah,
                                          jumlahTampalanSementaraSekolahRawatanCBox:
                                            !pilihanDataSalah.jumlahTampalanSementaraSekolahRawatanCBox,
                                        });
                                        setDataRetenSalah({
                                          ...dataRetenSalah,
                                          jumlahTampalanSementaraSekolahRawatanCBox:
                                            !pilihanDataSalah.jumlahTampalanSementaraSekolahRawatanCBox,
                                        });
                                        setConfirmData({
                                          ...confirmData,
                                          pilihanDataSalah: {
                                            ...pilihanDataSalah,
                                            jumlahTampalanSementaraSekolahRawatanCBox:
                                              !pilihanDataSalah.jumlahTampalanSementaraSekolahRawatanCBox,
                                          },
                                        });
                                      }}
                                      className='peer hidden'
                                    />
                                    <label
                                      htmlFor='jumlah-tampalan-sementara-penyata-akhir-2-reten-salah-cbox'
                                      className={`text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                    >
                                      {pilihanDataSalah.jumlahTampalanSementaraSekolahRawatanCBox ===
                                      true ? (
                                        <FaTimes
                                          className='text-2xl'
                                          onClick={() => {
                                            setPilihanDataSalah({
                                              ...pilihanDataSalah,
                                              jumlahTampalanSementaraSekolahRawatan:
                                                '',
                                            });
                                            setDataRetenSalah({
                                              ...dataRetenSalah,
                                              jumlahTampalanSementaraSekolahRawatan:
                                                '',
                                            });
                                            setConfirmData({
                                              ...confirmData,
                                              pilihanDataSalah: {
                                                ...pilihanDataSalah,
                                                jumlahTampalanSementaraSekolahRawatan:
                                                  '',
                                              },
                                            });
                                          }}
                                        />
                                      ) : (
                                        <FaRegHandPointLeft className='text-2xl' />
                                      )}
                                    </label>
                                  </div>
                                </div>
                                {pilihanDataSalah.jumlahTampalanSementaraSekolahRawatanCBox ===
                                  true && (
                                  <div className='flex flex-row pl-5 items-center bg-user11 bg-opacity-50 mb-1'>
                                    <input
                                      // disabled={disableSalah}
                                      min='0'
                                      max='32'
                                      type='number'
                                      name='jumlah-tampalan-sementara-penyata-akhir-2'
                                      id='jumlah-tampalan-sementara-penyata-akhir-2'
                                      value={
                                        pilihanDataSalah.jumlahTampalanSementaraSekolahRawatan
                                      }
                                      onChange={(e) => {
                                        setPilihanDataSalah({
                                          ...pilihanDataSalah,
                                          jumlahTampalanSementaraSekolahRawatan:
                                            e.target.value,
                                        });
                                        setDataRetenSalah({
                                          ...dataRetenSalah,
                                          jumlahTampalanSementaraSekolahRawatan:
                                            e.target.value,
                                        });
                                        setConfirmData({
                                          ...confirmData,
                                          pilihanDataSalah: {
                                            ...pilihanDataSalah,
                                            jumlahTampalanSementaraSekolahRawatan:
                                              e.target.value,
                                          },
                                        });
                                      }}
                                      className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                    />
                                    <span className='text-kaunter4'>
                                      <FaCheck className='text-2xl' />
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </article>
                          <div className='grid gap-2'>
                            <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md auto-rows-min'>
                              <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                                rawatan lain yang telah dilakukan
                              </h4>
                              <div className='grid grid-cols-1 lg:grid-cols-2 col-span-2'>
                                {/* <div className='flex items-center flex-row pl-5'>
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
                          </div> */}
                                {/* <div className='flex items-center flex-row pl-5'>
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
                          </div> */}
                                <div
                                  className={`${
                                    pilihanDataSalah.absesSekolahRawatanCBox &&
                                    'grid-rows-2'
                                  } grid px-3 pl pt-1`}
                                >
                                  <div
                                    className={`${
                                      pilihanDataSalah.absesSekolahRawatanCBox &&
                                      'bg-user9 bg-opacity-20 p-2'
                                    } flex items-center flex-row pl-2`}
                                  >
                                    <input
                                      disabled
                                      type='checkbox'
                                      name='abses-penyata-akhir-2'
                                      id='abses-penyata-akhir-2'
                                      checked={rawatan.absesSekolahRawatan}
                                      onChange={(e) => {
                                        setAbsesSekolahRawatan(
                                          !absesSekolahRawatan
                                        );
                                        setConfirmData({
                                          ...confirmData,
                                          absesSekolahRawatan:
                                            !absesSekolahRawatan,
                                        });
                                      }}
                                      className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 mr-3'
                                    />
                                    <label
                                      htmlFor='abses-penyata-akhir-2'
                                      className='text-sm font-m'
                                    >
                                      abses
                                    </label>
                                    <div className='relative mx-2'>
                                      <input
                                        // disabled={disableSalah}
                                        type='checkbox'
                                        name='abses-penyata-akhir-2-reten-salah-cbox'
                                        id='abses-penyata-akhir-2-reten-salah-cbox'
                                        checked={
                                          pilihanDataSalah.absesSekolahRawatanCBox
                                        }
                                        onChange={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            absesSekolahRawatanCBox:
                                              !pilihanDataSalah.absesSekolahRawatanCBox,
                                            absesSekolahRawatan:
                                              !rawatan.absesSekolahRawatan,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            absesSekolahRawatanCBox:
                                              !pilihanDataSalah.absesSekolahRawatanCBox,
                                            absesSekolahRawatan:
                                              !rawatan.absesSekolahRawatan,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              absesSekolahRawatanCBox:
                                                !pilihanDataSalah.absesSekolahRawatanCBox,
                                              absesSekolahRawatan:
                                                !rawatan.absesSekolahRawatan,
                                            },
                                          });
                                        }}
                                        className='peer hidden'
                                      />
                                      <label
                                        htmlFor='abses-penyata-akhir-2-reten-salah-cbox'
                                        className=' text-user9 h-6 w-6 rounded-full flex items-center justify-center cursor-pointer'
                                      >
                                        {pilihanDataSalah.absesSekolahRawatanCBox ===
                                        true ? (
                                          <FaTimes className='text-2xl' />
                                        ) : (
                                          <FaRegHandPointLeft className='text-2xl' />
                                        )}
                                      </label>
                                    </div>
                                  </div>
                                  {pilihanDataSalah.absesSekolahRawatanCBox ===
                                    true && (
                                    <div className='flex items-center flex-row bg-user11 bg-opacity-50 p-2'>
                                      <input
                                        disabled
                                        type='checkbox'
                                        name='abses-penyata-akhir-2-reten-salah'
                                        id='abses-penyata-akhir-2-reten-salah'
                                        checked={
                                          pilihanDataSalah.absesSekolahRawatan
                                        }
                                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 mr-3'
                                      />
                                      <label
                                        htmlFor='abses-penyata-akhir-2-reten-salah'
                                        className='text-sm font-m'
                                      >
                                        abses
                                      </label>
                                      <span className='text-kaunter4 mx-2'>
                                        <FaCheck className='text-2xl' />
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div
                                className={`${
                                  pilihanDataSalah.penskaleranSekolahRawatanCBox &&
                                  'grid-rows-2'
                                } grid px-3 pl pt-1`}
                              >
                                <div
                                  className={`${
                                    pilihanDataSalah.penskaleranSekolahRawatanCBox &&
                                    'bg-user9 bg-opacity-20 p-2'
                                  } flex items-center flex-row pl-2`}
                                >
                                  <input
                                    disabled
                                    type='checkbox'
                                    name='penskaleran-penyata-akhir-2'
                                    id='penskaleran-penyata-akhir-2'
                                    checked={rawatan.penskaleranSekolahRawatan}
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
                                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 mr-3'
                                  />
                                  <label
                                    htmlFor='penskaleran-penyata-akhir-2'
                                    className='text-sm font-m'
                                  >
                                    Penskaleran
                                  </label>
                                  <div className='relative mx-2'>
                                    <input
                                      // disabled={disableSalah}
                                      type='checkbox'
                                      name='penskaleran-penyata-akhir-2-reten-salah-cbox'
                                      id='penskaleran-penyata-akhir-2-reten-salah-cbox'
                                      checked={
                                        pilihanDataSalah.penskaleranSekolahRawatanCBox
                                      }
                                      onChange={() => {
                                        setPilihanDataSalah({
                                          ...pilihanDataSalah,
                                          penskaleranSekolahRawatanCBox:
                                            !pilihanDataSalah.penskaleranSekolahRawatanCBox,
                                          penskaleranSekolahRawatan:
                                            !rawatan.penskaleranSekolahRawatan,
                                        });
                                        setDataRetenSalah({
                                          ...dataRetenSalah,
                                          penskaleranSekolahRawatanCBox:
                                            !pilihanDataSalah.penskaleranSekolahRawatanCBox,
                                          penskaleranSekolahRawatan:
                                            !rawatan.penskaleranSekolahRawatan,
                                        });
                                        setConfirmData({
                                          ...confirmData,
                                          pilihanDataSalah: {
                                            ...pilihanDataSalah,
                                            penskaleranSekolahRawatanCBox:
                                              !pilihanDataSalah.penskaleranSekolahRawatanCBox,
                                            penskaleranSekolahRawatan:
                                              !rawatan.penskaleranSekolahRawatan,
                                          },
                                        });
                                      }}
                                      className='peer hidden'
                                    />
                                    <label
                                      htmlFor='penskaleran-penyata-akhir-2-reten-salah-cbox'
                                      className=' text-user9 h-6 w-6 rounded-full flex items-center justify-center cursor-pointer'
                                    >
                                      {pilihanDataSalah.penskaleranSekolahRawatanCBox ===
                                      true ? (
                                        <FaTimes className='text-2xl' />
                                      ) : (
                                        <FaRegHandPointLeft className='text-2xl' />
                                      )}
                                    </label>
                                  </div>
                                </div>
                                {pilihanDataSalah.penskaleranSekolahRawatanCBox ===
                                  true && (
                                  <div className='flex items-center flex-row bg-user11 bg-opacity-50 p-2'>
                                    <input
                                      disabled
                                      type='checkbox'
                                      name='penskaleran-penyata-akhir-2-reten-salah'
                                      id='penskaleran-penyata-akhir-2-reten-salah'
                                      checked={
                                        pilihanDataSalah.penskaleranSekolahRawatan
                                      }
                                      className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 mr-3'
                                    />
                                    <label
                                      htmlFor='penskaleran-penyata-akhir-2-reten-salah'
                                      className='text-sm font-m'
                                    >
                                      Penskaleran
                                    </label>
                                    <span className='text-kaunter4 mx-2'>
                                      <FaCheck className='text-2xl' />
                                    </span>
                                  </div>
                                )}
                              </div>
                            </article>
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
                              <h1 className='font-bold flex flex-row pl-5'>
                                Rujukan
                              </h1>
                              <div
                                className={`${
                                  pilihanDataSalah.rujukKlinikSekolahRawatanCBox &&
                                  'grid-rows-2'
                                } grid px-3 pl pt-1`}
                              >
                                <div
                                  className={`${
                                    pilihanDataSalah.rujukKlinikSekolahRawatanCBox &&
                                    'bg-user9 bg-opacity-20 p-2'
                                  } flex items-center flex-row pl-2`}
                                >
                                  <input
                                    disabled
                                    type='checkbox'
                                    name='rujukan-ke-klinik'
                                    id='rujukan-ke-klinik'
                                    checked={rawatan.rujukKlinikSekolahRawatan}
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
                                  <div className='relative mx-2'>
                                    <input
                                      // disabled={disableSalah}
                                      type='checkbox'
                                      name='rujukan-ke-klinik-reten-salah-cbox'
                                      id='rujukan-ke-klinik-reten-salah-cbox'
                                      checked={
                                        pilihanDataSalah.rujukKlinikSekolahRawatanCBox
                                      }
                                      onChange={() => {
                                        setPilihanDataSalah({
                                          ...pilihanDataSalah,
                                          rujukKlinikSekolahRawatanCBox:
                                            !pilihanDataSalah.rujukKlinikSekolahRawatanCBox,
                                          rujukKlinikSekolahRawatan:
                                            !rawatan.rujukKlinikSekolahRawatan,
                                        });
                                        setDataRetenSalah({
                                          ...dataRetenSalah,
                                          rujukKlinikSekolahRawatanCBox:
                                            !pilihanDataSalah.rujukKlinikSekolahRawatanCBox,
                                          rujukKlinikSekolahRawatan:
                                            !rawatan.rujukKlinikSekolahRawatan,
                                        });
                                        setConfirmData({
                                          ...confirmData,
                                          pilihanDataSalah: {
                                            ...pilihanDataSalah,
                                            rujukKlinikSekolahRawatanCBox:
                                              !pilihanDataSalah.rujukKlinikSekolahRawatanCBox,
                                            rujukKlinikSekolahRawatan:
                                              !rawatan.rujukKlinikSekolahRawatan,
                                          },
                                        });
                                      }}
                                      className='peer hidden'
                                    />
                                    <label
                                      htmlFor='rujukan-ke-klinik-reten-salah-cbox'
                                      className=' text-user9 h-6 w-6 rounded-full flex items-center justify-center cursor-pointer'
                                    >
                                      {pilihanDataSalah.rujukKlinikSekolahRawatanCBox ===
                                      true ? (
                                        <FaTimes className='text-2xl' />
                                      ) : (
                                        <FaRegHandPointLeft className='text-2xl' />
                                      )}
                                    </label>
                                  </div>
                                </div>
                                {pilihanDataSalah.rujukKlinikSekolahRawatanCBox ===
                                  true && (
                                  <div className='flex items-center flex-row bg-user11 bg-opacity-50 p-2'>
                                    <input
                                      disabled
                                      type='checkbox'
                                      name='rujukan-ke-klinik-reten-salah'
                                      id='rujukan-ke-klinik-reten-salah'
                                      checked={
                                        pilihanDataSalah.rujukKlinikSekolahRawatan
                                      }
                                      className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                                    />
                                    <label
                                      htmlFor='rujukan-ke-klinik-reten-salah'
                                      className='text-sm font-m mx-2'
                                    >
                                      Rujukan Ke Klinik Pergigian
                                    </label>
                                    <span className='text-kaunter4 mx-2'>
                                      <FaCheck className='text-2xl' />
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div
                                className={`${
                                  pilihanDataSalah.rujukRawatanOrtodontikSekolahRawatanCBox &&
                                  'grid-rows-2'
                                } grid px-3 pl pt-1`}
                              >
                                <div
                                  className={`${
                                    pilihanDataSalah.rujukRawatanOrtodontikSekolahRawatanCBox &&
                                    'bg-user9 bg-opacity-20 p-2'
                                  } flex items-center flex-row pl-2`}
                                >
                                  <input
                                    disabled
                                    type='checkbox'
                                    name='rawatan-ortodontik-penyata-akhir-2'
                                    id='rawatan-ortodontik-penyata-akhir-2'
                                    checked={
                                      rawatan.rujukRawatanOrtodontikSekolahRawatan
                                    }
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
                                  <div className='relative mx-2'>
                                    <input
                                      // disabled={disableSalah}
                                      type='checkbox'
                                      name='rawatan-ortodontik-penyata-akhir-2-reten-salah-cbox'
                                      id='rawatan-ortodontik-penyata-akhir-2-reten-salah-cbox'
                                      checked={
                                        pilihanDataSalah.rujukRawatanOrtodontikSekolahRawatanCBox
                                      }
                                      onChange={() => {
                                        setPilihanDataSalah({
                                          ...pilihanDataSalah,
                                          rujukRawatanOrtodontikSekolahRawatanCBox:
                                            !pilihanDataSalah.rujukRawatanOrtodontikSekolahRawatanCBox,
                                          rujukRawatanOrtodontikSekolahRawatan:
                                            !rawatan.rujukRawatanOrtodontikSekolahRawatan,
                                        });
                                        setDataRetenSalah({
                                          ...dataRetenSalah,
                                          rujukRawatanOrtodontikSekolahRawatanCBox:
                                            !pilihanDataSalah.rujukRawatanOrtodontikSekolahRawatanCBox,
                                          rujukRawatanOrtodontikSekolahRawatan:
                                            !rawatan.rujukRawatanOrtodontikSekolahRawatan,
                                        });
                                        setConfirmData({
                                          ...confirmData,
                                          pilihanDataSalah: {
                                            ...pilihanDataSalah,
                                            rujukRawatanOrtodontikSekolahRawatanCBox:
                                              !pilihanDataSalah.rujukRawatanOrtodontikSekolahRawatanCBox,
                                            rujukRawatanOrtodontikSekolahRawatan:
                                              !rawatan.rujukRawatanOrtodontikSekolahRawatan,
                                          },
                                        });
                                      }}
                                      className='peer hidden'
                                    />
                                    <label
                                      htmlFor='rawatan-ortodontik-penyata-akhir-2-reten-salah-cbox'
                                      className=' text-user9 h-6 w-6 rounded-full flex items-center justify-center cursor-pointer'
                                    >
                                      {pilihanDataSalah.rujukRawatanOrtodontikSekolahRawatanCBox ===
                                      true ? (
                                        <FaTimes className='text-2xl' />
                                      ) : (
                                        <FaRegHandPointLeft className='text-2xl' />
                                      )}
                                    </label>
                                  </div>
                                </div>
                                {pilihanDataSalah.rujukRawatanOrtodontikSekolahRawatanCBox ===
                                  true && (
                                  <div className='flex items-center flex-row bg-user11 bg-opacity-50 p-2'>
                                    <input
                                      disabled
                                      type='checkbox'
                                      name='rawatan-ortodontik-penyata-akhir-2-reten-salah'
                                      id='rawatan-ortodontik-penyata-akhir-2-reten-salah'
                                      checked={
                                        pilihanDataSalah.rujukRawatanOrtodontikSekolahRawatan
                                      }
                                      className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                                    />
                                    <label
                                      htmlFor='rawatan-ortodontik-penyata-akhir-2-reten-salah'
                                      className='text-sm font-m mx-2'
                                    >
                                      Rujukan Ke Pakar ortodontik
                                    </label>
                                    <span className='text-kaunter4 mx-2'>
                                      <FaCheck className='text-2xl' />
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div
                                className={`${
                                  pilihanDataSalah.rujukPakarPatologiSekolahRawatanCBox &&
                                  'grid-rows-2'
                                } grid px-3 pl pt-1`}
                              >
                                <div
                                  className={`${
                                    pilihanDataSalah.rujukPakarPatologiSekolahRawatanCBox &&
                                    'bg-user9 bg-opacity-20 p-2'
                                  } flex items-center flex-row pl-2`}
                                >
                                  <input
                                    disabled
                                    type='checkbox'
                                    name='rujukan-pakar-patologi'
                                    id='rujukan-pakar-patologi'
                                    checked={
                                      rawatan.rujukPakarPatologiSekolahRawatan
                                    }
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
                                    Rujukan Ke Pakar Patologi Mulut dan
                                    Perubatan Mulut
                                  </label>
                                  <div className='relative mx-2'>
                                    <input
                                      // disabled={disableSalah}
                                      type='checkbox'
                                      name='rujukan-pakar-patologi-reten-salah-cbox'
                                      id='rujukan-pakar-patologi-reten-salah-cbox'
                                      checked={
                                        pilihanDataSalah.rujukPakarPatologiSekolahRawatanCBox
                                      }
                                      onChange={() => {
                                        setPilihanDataSalah({
                                          ...pilihanDataSalah,
                                          rujukPakarPatologiSekolahRawatanCBox:
                                            !pilihanDataSalah.rujukPakarPatologiSekolahRawatanCBox,
                                          rujukPakarPatologiSekolahRawatan:
                                            !rawatan.rujukPakarPatologiSekolahRawatan,
                                        });
                                        setDataRetenSalah({
                                          ...dataRetenSalah,
                                          rujukPakarPatologiSekolahRawatanCBox:
                                            !pilihanDataSalah.rujukPakarPatologiSekolahRawatanCBox,
                                          rujukPakarPatologiSekolahRawatan:
                                            !rawatan.rujukPakarPatologiSekolahRawatan,
                                        });
                                        setConfirmData({
                                          ...confirmData,
                                          pilihanDataSalah: {
                                            ...pilihanDataSalah,
                                            rujukPakarPatologiSekolahRawatanCBox:
                                              !pilihanDataSalah.rujukPakarPatologiSekolahRawatanCBox,
                                            rujukPakarPatologiSekolahRawatan:
                                              !rawatan.rujukPakarPatologiSekolahRawatan,
                                          },
                                        });
                                      }}
                                      className='peer hidden'
                                    />
                                    <label
                                      htmlFor='rujukan-pakar-patologi-reten-salah-cbox'
                                      className=' text-user9 h-6 w-6 rounded-full flex items-center justify-center cursor-pointer'
                                    >
                                      {pilihanDataSalah.rujukPakarPatologiSekolahRawatanCBox ===
                                      true ? (
                                        <FaTimes className='text-2xl' />
                                      ) : (
                                        <FaRegHandPointLeft className='text-2xl' />
                                      )}
                                    </label>
                                  </div>
                                </div>
                                {pilihanDataSalah.rujukPakarPatologiSekolahRawatanCBox ===
                                  true && (
                                  <div className='flex items-center flex-row bg-user11 bg-opacity-50 p-2'>
                                    <input
                                      disabled
                                      type='checkbox'
                                      name='rujukan-pakar-patologi-reten-salah'
                                      id='rujukan-pakar-patologi-reten-salah'
                                      checked={
                                        pilihanDataSalah.rujukPakarPatologiSekolahRawatan
                                      }
                                      className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                                    />
                                    <label
                                      htmlFor='rujukan-pakar-patologi-reten-salah'
                                      className='text-sm font-m mx-2'
                                    >
                                      Rujukan Ke Pakar Patologi Mulut dan
                                      Perubatan Mulut
                                    </label>
                                    <span className='text-kaunter4 mx-2'>
                                      <FaCheck className='text-2xl' />
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div
                                className={`${
                                  pilihanDataSalah.rujukPakarRestoratifSekolahRawatanCBox &&
                                  'grid-rows-2'
                                } grid px-3 pl pt-1`}
                              >
                                <div
                                  className={`${
                                    pilihanDataSalah.rujukPakarRestoratifSekolahRawatanCBox &&
                                    'bg-user9 bg-opacity-20 p-2'
                                  } flex items-center flex-row pl-2`}
                                >
                                  <input
                                    disabled
                                    type='checkbox'
                                    name='rujukan-pakar-restoratif'
                                    id='rujukan-pakar-restoratif'
                                    checked={
                                      rawatan.rujukPakarRestoratifSekolahRawatan
                                    }
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
                                  <div className='relative mx-2'>
                                    <input
                                      // disabled={disableSalah}
                                      type='checkbox'
                                      name='rujukan-pakar-restoratif-reten-salah-cbox'
                                      id='rujukan-pakar-restoratif-reten-salah-cbox'
                                      checked={
                                        pilihanDataSalah.rujukPakarRestoratifSekolahRawatanCBox
                                      }
                                      onChange={() => {
                                        setPilihanDataSalah({
                                          ...pilihanDataSalah,
                                          rujukPakarRestoratifSekolahRawatanCBox:
                                            !pilihanDataSalah.rujukPakarRestoratifSekolahRawatanCBox,
                                          rujukPakarRestoratifSekolahRawatan:
                                            !rawatan.rujukPakarRestoratifSekolahRawatan,
                                        });
                                        setDataRetenSalah({
                                          ...dataRetenSalah,
                                          rujukPakarRestoratifSekolahRawatanCBox:
                                            !pilihanDataSalah.rujukPakarRestoratifSekolahRawatanCBox,
                                          rujukPakarRestoratifSekolahRawatan:
                                            !rawatan.rujukPakarRestoratifSekolahRawatan,
                                        });
                                        setConfirmData({
                                          ...confirmData,
                                          pilihanDataSalah: {
                                            ...pilihanDataSalah,
                                            rujukPakarRestoratifSekolahRawatanCBox:
                                              !pilihanDataSalah.rujukPakarRestoratifSekolahRawatanCBox,
                                            rujukPakarRestoratifSekolahRawatan:
                                              !rawatan.rujukPakarRestoratifSekolahRawatan,
                                          },
                                        });
                                      }}
                                      className='peer hidden'
                                    />
                                    <label
                                      htmlFor='rujukan-pakar-restoratif-reten-salah-cbox'
                                      className=' text-user9 h-6 w-6 rounded-full flex items-center justify-center cursor-pointer'
                                    >
                                      {pilihanDataSalah.rujukPakarRestoratifSekolahRawatanCBox ===
                                      true ? (
                                        <FaTimes className='text-2xl' />
                                      ) : (
                                        <FaRegHandPointLeft className='text-2xl' />
                                      )}
                                    </label>
                                  </div>
                                </div>
                                {pilihanDataSalah.rujukPakarRestoratifSekolahRawatanCBox ===
                                  true && (
                                  <div className='flex items-center flex-row bg-user11 bg-opacity-50 p-2'>
                                    <input
                                      disabled
                                      type='checkbox'
                                      name='rujukan-pakar-restoratif-reten-salah'
                                      id='rujukan-pakar-restoratif-reten-salah'
                                      checked={
                                        pilihanDataSalah.rujukPakarRestoratifSekolahRawatan
                                      }
                                      className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                                    />
                                    <label
                                      htmlFor='rujukan-pakar-restoratif-reten-salah'
                                      className='text-sm font-m mx-2'
                                    >
                                      Rujukan Ke Pakar Restoratif
                                    </label>
                                    <span className='text-kaunter4 mx-2'>
                                      <FaCheck className='text-2xl' />
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div
                                className={`${
                                  pilihanDataSalah.rujukPakarBedahMulutSekolahRawatanCBox &&
                                  'grid-rows-2'
                                } grid px-3 pl pt-1`}
                              >
                                <div
                                  className={`${
                                    pilihanDataSalah.rujukPakarBedahMulutSekolahRawatanCBox &&
                                    'bg-user9 bg-opacity-20 p-2'
                                  } flex items-center flex-row pl-2`}
                                >
                                  <input
                                    disabled
                                    type='checkbox'
                                    name='rujukan-pakar-bedah-mulut'
                                    id='rujukan-pakar-bedah-mulut'
                                    checked={
                                      rawatan.rujukPakarBedahMulutSekolahRawatan
                                    }
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
                                    Rujukan Ke Pakar bedah mulut dan
                                    maksilofasial
                                  </label>
                                  <div className='relative mx-2'>
                                    <input
                                      // disabled={disableSalah}
                                      type='checkbox'
                                      name='rujukan-pakar-bedah-mulut-reten-salah-cbox'
                                      id='rujukan-pakar-bedah-mulut-reten-salah-cbox'
                                      checked={
                                        pilihanDataSalah.rujukPakarBedahMulutSekolahRawatanCBox
                                      }
                                      onChange={() => {
                                        setPilihanDataSalah({
                                          ...pilihanDataSalah,
                                          rujukPakarBedahMulutSekolahRawatanCBox:
                                            !pilihanDataSalah.rujukPakarBedahMulutSekolahRawatanCBox,
                                          rujukPakarBedahMulutSekolahRawatan:
                                            !rawatan.rujukPakarBedahMulutSekolahRawatan,
                                        });
                                        setDataRetenSalah({
                                          ...dataRetenSalah,
                                          rujukPakarBedahMulutSekolahRawatanCBox:
                                            !pilihanDataSalah.rujukPakarBedahMulutSekolahRawatanCBox,
                                          rujukPakarBedahMulutSekolahRawatan:
                                            !rawatan.rujukPakarBedahMulutSekolahRawatan,
                                        });
                                        setConfirmData({
                                          ...confirmData,
                                          pilihanDataSalah: {
                                            ...pilihanDataSalah,
                                            rujukPakarBedahMulutSekolahRawatanCBox:
                                              !pilihanDataSalah.rujukPakarBedahMulutSekolahRawatanCBox,
                                            rujukPakarBedahMulutSekolahRawatan:
                                              !rawatan.rujukPakarBedahMulutSekolahRawatan,
                                          },
                                        });
                                      }}
                                      className='peer hidden'
                                    />
                                    <label
                                      htmlFor='rujukan-pakar-bedah-mulut-reten-salah-cbox'
                                      className=' text-user9 h-6 w-6 rounded-full flex items-center justify-center cursor-pointer'
                                    >
                                      {pilihanDataSalah.rujukPakarBedahMulutSekolahRawatanCBox ===
                                      true ? (
                                        <FaTimes className='text-2xl' />
                                      ) : (
                                        <FaRegHandPointLeft className='text-2xl' />
                                      )}
                                    </label>
                                  </div>
                                </div>
                                {pilihanDataSalah.rujukPakarBedahMulutSekolahRawatanCBox ===
                                  true && (
                                  <div className='flex items-center flex-row bg-user11 bg-opacity-50 p-2'>
                                    <input
                                      disabled
                                      type='checkbox'
                                      name='rujukan-pakar-bedah-mulut-reten-salah'
                                      id='rujukan-pakar-bedah-mulut-reten-salah'
                                      checked={
                                        pilihanDataSalah.rujukPakarBedahMulutSekolahRawatan
                                      }
                                      className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                                    />
                                    <label
                                      htmlFor='rujukan-pakar-bedah-mulut-reten-salah'
                                      className='text-sm font-m mx-2'
                                    >
                                      Rujukan Ke Pakar bedah mulut dan
                                      maksilofasial
                                    </label>
                                    <span className='text-kaunter4 mx-2'>
                                      <FaCheck className='text-2xl' />
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div
                                className={`${
                                  pilihanDataSalah.rujukPakarPediatrikSekolahRawatanCBox &&
                                  'grid-rows-2'
                                } grid px-3 pl pt-1`}
                              >
                                <div
                                  className={`${
                                    pilihanDataSalah.rujukPakarPediatrikSekolahRawatanCBox &&
                                    'bg-user9 bg-opacity-20 p-2'
                                  } flex items-center flex-row pl-2`}
                                >
                                  <input
                                    disabled
                                    type='checkbox'
                                    name='rujukan-pakar-pediatrik'
                                    id='rujukan-pakar-pediatrik'
                                    checked={
                                      rawatan.rujukPakarPediatrikSekolahRawatan
                                    }
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
                                  <div className='relative mx-2'>
                                    <input
                                      // disabled={disableSalah}
                                      type='checkbox'
                                      name='rujukan-pakar-pediatrik-reten-salah-cbox'
                                      id='rujukan-pakar-pediatrik-reten-salah-cbox'
                                      checked={
                                        pilihanDataSalah.rujukPakarPediatrikSekolahRawatanCBox
                                      }
                                      onChange={() => {
                                        setPilihanDataSalah({
                                          ...pilihanDataSalah,
                                          rujukPakarPediatrikSekolahRawatanCBox:
                                            !pilihanDataSalah.rujukPakarPediatrikSekolahRawatanCBox,
                                          rujukPakarPediatrikSekolahRawatan:
                                            !rawatan.rujukPakarPediatrikSekolahRawatan,
                                        });
                                        setDataRetenSalah({
                                          ...dataRetenSalah,
                                          rujukPakarPediatrikSekolahRawatanCBox:
                                            !pilihanDataSalah.rujukPakarPediatrikSekolahRawatanCBox,
                                          rujukPakarPediatrikSekolahRawatan:
                                            !rawatan.rujukPakarPediatrikSekolahRawatan,
                                        });
                                        setConfirmData({
                                          ...confirmData,
                                          pilihanDataSalah: {
                                            ...pilihanDataSalah,
                                            rujukPakarPediatrikSekolahRawatanCBox:
                                              !pilihanDataSalah.rujukPakarPediatrikSekolahRawatanCBox,
                                            rujukPakarPediatrikSekolahRawatan:
                                              !rawatan.rujukPakarPediatrikSekolahRawatan,
                                          },
                                        });
                                      }}
                                      className='peer hidden'
                                    />
                                    <label
                                      htmlFor='rujukan-pakar-pediatrik-reten-salah-cbox'
                                      className=' text-user9 h-6 w-6 rounded-full flex items-center justify-center cursor-pointer'
                                    >
                                      {pilihanDataSalah.rujukPakarPediatrikSekolahRawatanCBox ===
                                      true ? (
                                        <FaTimes className='text-2xl' />
                                      ) : (
                                        <FaRegHandPointLeft className='text-2xl' />
                                      )}
                                    </label>
                                  </div>
                                </div>
                                {pilihanDataSalah.rujukPakarPediatrikSekolahRawatanCBox ===
                                  true && (
                                  <div className='flex items-center flex-row bg-user11 bg-opacity-50 p-2'>
                                    <input
                                      disabled
                                      type='checkbox'
                                      name='rujukan-pakar-pediatrik-reten-salah'
                                      id='rujukan-pakar-pediatrik-reten-salah'
                                      checked={
                                        pilihanDataSalah.rujukPakarPediatrikSekolahRawatan
                                      }
                                      className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                                    />
                                    <label
                                      htmlFor='rujukan-pakar-pediatrik-reten-salah'
                                      className='text-sm font-m mx-2'
                                    >
                                      Rujukan Ke Pakar Pergigian Pediatrik
                                    </label>
                                    <span className='text-kaunter4 mx-2'>
                                      <FaCheck className='text-2xl' />
                                    </span>
                                  </div>
                                )}
                              </div>
                            </article>
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
                                {singlePersonSekolah.statusRawatan ===
                                'selesai' ? (
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
                                      disabled
                                      type='radio'
                                      name='kes-selesai-penyata-akhir-2'
                                      id='ya-kes-selesai-penyata-akhir-2'
                                      value='ya-kes-selesai-penyata-akhir-2'
                                      checked={
                                        rawatan.kesSelesaiSekolahRawatan ===
                                        'ya-kes-selesai-penyata-akhir-2'
                                          ? true
                                          : false
                                      }
                                      onChange={(e) => {
                                        setKesSelesaiSekolahRawatan(
                                          e.target.value
                                        );
                                        setConfirmData({
                                          ...confirmData,
                                          kesSelesaiSekolahRawatan:
                                            e.target.value,
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
                                      disabled
                                      type='radio'
                                      name='kes-selesai-penyata-akhir-2'
                                      id='tidak-kes-selesai-penyata-akhir-2'
                                      value='tidak-kes-selesai-penyata-akhir-2'
                                      checked={
                                        rawatan.kesSelesaiSekolahRawatan ===
                                        'tidak-kes-selesai-penyata-akhir-2'
                                          ? true
                                          : false
                                      }
                                      onChange={(e) => {
                                        setKesSelesaiSekolahRawatan(
                                          e.target.value
                                        );
                                        setConfirmData({
                                          ...confirmData,
                                          kesSelesaiSekolahRawatan:
                                            e.target.value,
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
                                      disabled
                                      type='radio'
                                      name='kes-selesai-icdas-penyata-akhir-2'
                                      id='ya-kes-selesai-icdas-penyata-akhir-2'
                                      value='ya-kes-selesai-icdas-penyata-akhir-2'
                                      checked={
                                        rawatan.kesSelesaiIcdasSekolahRawatan ===
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
                                          kesSelesaiIcdasSekolahRawatan:
                                            e.target.value,
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
                                      disabled
                                      type='radio'
                                      name='kes-selesai-icdas-penyata-akhir-2'
                                      id='tidak-kes-selesai-icdas-penyata-akhir-2'
                                      value='tidak-kes-selesai-icdas-penyata-akhir-2'
                                      checked={
                                        rawatan.kesSelesaiIcdasSekolahRawatan ===
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
                                          kesSelesaiIcdasSekolahRawatan:
                                            e.target.value,
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
                                <div
                                  className={`${
                                    pilihanDataSalah.plakGigiNasihatPergigianIndividuPromosiSekolahRawatanCBox &&
                                    'grid-rows-2'
                                  } grid px-3 pl pt-1`}
                                >
                                  <div
                                    className={`${
                                      pilihanDataSalah.plakGigiNasihatPergigianIndividuPromosiSekolahRawatanCBox &&
                                      'bg-user9 bg-opacity-20 p-2'
                                    } flex items-center flex-row pl-2`}
                                  >
                                    <input
                                      disabled
                                      type='checkbox'
                                      name='plak-gigi-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                                      id='plak-gigi-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                                      checked={
                                        rawatan.plakGigiNasihatPergigianIndividuPromosiSekolahRawatan
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
                                    <div className='relative mx-2'>
                                      <input
                                        // disabled={disableSalah}
                                        type='checkbox'
                                        name='plak-gigi-nasihat-pergigian-individu-promosi-penyata-akhir-2-reten-salah-cbox'
                                        id='plak-gigi-nasihat-pergigian-individu-promosi-penyata-akhir-2-reten-salah-cbox'
                                        checked={
                                          pilihanDataSalah.plakGigiNasihatPergigianIndividuPromosiSekolahRawatanCBox
                                        }
                                        onChange={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            plakGigiNasihatPergigianIndividuPromosiSekolahRawatanCBox:
                                              !pilihanDataSalah.plakGigiNasihatPergigianIndividuPromosiSekolahRawatanCBox,
                                            plakGigiNasihatPergigianIndividuPromosiSekolahRawatan:
                                              !rawatan.plakGigiNasihatPergigianIndividuPromosiSekolahRawatan,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            plakGigiNasihatPergigianIndividuPromosiSekolahRawatanCBox:
                                              !pilihanDataSalah.plakGigiNasihatPergigianIndividuPromosiSekolahRawatanCBox,
                                            plakGigiNasihatPergigianIndividuPromosiSekolahRawatan:
                                              !rawatan.plakGigiNasihatPergigianIndividuPromosiSekolahRawatan,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              plakGigiNasihatPergigianIndividuPromosiSekolahRawatanCBox:
                                                !pilihanDataSalah.plakGigiNasihatPergigianIndividuPromosiSekolahRawatanCBox,
                                              plakGigiNasihatPergigianIndividuPromosiSekolahRawatan:
                                                !rawatan.plakGigiNasihatPergigianIndividuPromosiSekolahRawatan,
                                            },
                                          });
                                        }}
                                        className='peer hidden'
                                      />
                                      <label
                                        htmlFor='plak-gigi-nasihat-pergigian-individu-promosi-penyata-akhir-2-reten-salah-cbox'
                                        className=' text-user9 h-6 w-6 rounded-full flex items-center justify-center cursor-pointer'
                                      >
                                        {pilihanDataSalah.plakGigiNasihatPergigianIndividuPromosiSekolahRawatanCBox ===
                                        true ? (
                                          <FaTimes className='text-2xl' />
                                        ) : (
                                          <FaRegHandPointLeft className='text-2xl' />
                                        )}
                                      </label>
                                    </div>
                                  </div>
                                  {pilihanDataSalah.plakGigiNasihatPergigianIndividuPromosiSekolahRawatanCBox ===
                                    true && (
                                    <div className='flex items-center flex-row bg-user11 bg-opacity-50 p-2'>
                                      <input
                                        disabled
                                        type='checkbox'
                                        name='plak-gigi-nasihat-pergigian-individu-promosi-penyata-akhir-2-reten-salah'
                                        id='plak-gigi-nasihat-pergigian-individu-promosi-penyata-akhir-2-reten-salah'
                                        checked={
                                          pilihanDataSalah.plakGigiNasihatPergigianIndividuPromosiSekolahRawatan
                                        }
                                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                                      />
                                      <label
                                        htmlFor='plak-gigi-nasihat-pergigian-individu-promosi-penyata-akhir-2-reten-salah'
                                        className='text-sm font-m mx-2'
                                      >
                                        nasihat berkaitan plak gigi
                                      </label>
                                      <span className='text-kaunter4 mx-2'>
                                        <FaCheck className='text-2xl' />
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div
                                  className={`${
                                    pilihanDataSalah.dietPemakananNasihatPergigianIndividuPromosiSekolahRawatanCBox &&
                                    'grid-rows-2'
                                  } grid px-3 pl pt-1`}
                                >
                                  <div
                                    className={`${
                                      pilihanDataSalah.dietPemakananNasihatPergigianIndividuPromosiSekolahRawatanCBox &&
                                      'bg-user9 bg-opacity-20 p-2'
                                    } flex items-center flex-row pl-2`}
                                  >
                                    <input
                                      disabled
                                      type='checkbox'
                                      name='diet-pemakanan-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                                      id='diet-pemakanan-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                                      checked={
                                        rawatan.dietPemakananNasihatPergigianIndividuPromosiSekolahRawatan
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
                                    <div className='relative mx-2'>
                                      <input
                                        // disabled={disableSalah}
                                        type='checkbox'
                                        name='diet-pemakanan-nasihat-pergigian-individu-promosi-penyata-akhir-2-reten-salah-cbox'
                                        id='diet-pemakanan-nasihat-pergigian-individu-promosi-penyata-akhir-2-reten-salah-cbox'
                                        checked={
                                          pilihanDataSalah.dietPemakananNasihatPergigianIndividuPromosiSekolahRawatanCBox
                                        }
                                        onChange={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            dietPemakananNasihatPergigianIndividuPromosiSekolahRawatanCBox:
                                              !pilihanDataSalah.dietPemakananNasihatPergigianIndividuPromosiSekolahRawatanCBox,
                                            dietPemakananNasihatPergigianIndividuPromosiSekolahRawatan:
                                              !rawatan.dietPemakananNasihatPergigianIndividuPromosiSekolahRawatan,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            dietPemakananNasihatPergigianIndividuPromosiSekolahRawatanCBox:
                                              !pilihanDataSalah.dietPemakananNasihatPergigianIndividuPromosiSekolahRawatanCBox,
                                            dietPemakananNasihatPergigianIndividuPromosiSekolahRawatan:
                                              !rawatan.dietPemakananNasihatPergigianIndividuPromosiSekolahRawatan,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              dietPemakananNasihatPergigianIndividuPromosiSekolahRawatanCBox:
                                                !pilihanDataSalah.dietPemakananNasihatPergigianIndividuPromosiSekolahRawatanCBox,
                                              dietPemakananNasihatPergigianIndividuPromosiSekolahRawatan:
                                                !rawatan.dietPemakananNasihatPergigianIndividuPromosiSekolahRawatan,
                                            },
                                          });
                                        }}
                                        className='peer hidden'
                                      />
                                      <label
                                        htmlFor='diet-pemakanan-nasihat-pergigian-individu-promosi-penyata-akhir-2-reten-salah-cbox'
                                        className=' text-user9 h-6 w-6 rounded-full flex items-center justify-center cursor-pointer'
                                      >
                                        {pilihanDataSalah.dietPemakananNasihatPergigianIndividuPromosiSekolahRawatanCBox ===
                                        true ? (
                                          <FaTimes className='text-2xl' />
                                        ) : (
                                          <FaRegHandPointLeft className='text-2xl' />
                                        )}
                                      </label>
                                    </div>
                                  </div>
                                  {pilihanDataSalah.dietPemakananNasihatPergigianIndividuPromosiSekolahRawatanCBox ===
                                    true && (
                                    <div className='flex items-center flex-row bg-user11 bg-opacity-50 p-2'>
                                      <input
                                        disabled
                                        type='checkbox'
                                        name='diet-pemakanan-nasihat-pergigian-individu-promosi-penyata-akhir-2-reten-salah'
                                        id='diet-pemakanan-nasihat-pergigian-individu-promosi-penyata-akhir-2-reten-salah'
                                        checked={
                                          pilihanDataSalah.dietPemakananNasihatPergigianIndividuPromosiSekolahRawatan
                                        }
                                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                                      />
                                      <label
                                        htmlFor='diet-pemakanan-nasihat-pergigian-individu-promosi-penyata-akhir-2-reten-salah'
                                        className='text-sm font-m mx-2'
                                      >
                                        nasihat berkaitan diet pemakanan
                                      </label>
                                      <span className='text-kaunter4 mx-2'>
                                        <FaCheck className='text-2xl' />
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div
                                  className={`${
                                    pilihanDataSalah.penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatanCBox &&
                                    'grid-rows-2'
                                  } grid px-3 pl pt-1`}
                                >
                                  <div
                                    className={`${
                                      pilihanDataSalah.penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatanCBox &&
                                      'bg-user9 bg-opacity-20 p-2'
                                    } flex items-center flex-row pl-2`}
                                  >
                                    <input
                                      disabled
                                      type='checkbox'
                                      name='penjagaan-kesihatan-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                                      id='penjagaan-kesihatan-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                                      checked={
                                        rawatan.penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan
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
                                    <div className='relative mx-2'>
                                      <input
                                        // disabled={disableSalah}
                                        type='checkbox'
                                        name='penjagaan-kesihatan-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2-reten-salah-cbox'
                                        id='penjagaan-kesihatan-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2-reten-salah-cbox'
                                        checked={
                                          pilihanDataSalah.penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatanCBox
                                        }
                                        onChange={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatanCBox:
                                              !pilihanDataSalah.penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatanCBox,
                                            penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan:
                                              !rawatan.penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatanCBox:
                                              !pilihanDataSalah.penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatanCBox,
                                            penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan:
                                              !rawatan.penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatanCBox:
                                                !pilihanDataSalah.penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatanCBox,
                                              penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan:
                                                !rawatan.penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan,
                                            },
                                          });
                                        }}
                                        className='peer hidden'
                                      />
                                      <label
                                        htmlFor='penjagaan-kesihatan-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2-reten-salah-cbox'
                                        className=' text-user9 h-6 w-6 rounded-full flex items-center justify-center cursor-pointer'
                                      >
                                        {pilihanDataSalah.penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatanCBox ===
                                        true ? (
                                          <FaTimes className='text-2xl' />
                                        ) : (
                                          <FaRegHandPointLeft className='text-2xl' />
                                        )}
                                      </label>
                                    </div>
                                  </div>
                                  {pilihanDataSalah.penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatanCBox ===
                                    true && (
                                    <div className='flex items-center flex-row bg-user11 bg-opacity-50 p-2'>
                                      <input
                                        disabled
                                        type='checkbox'
                                        name='penjagaan-kesihatan-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2-reten-salah'
                                        id='penjagaan-kesihatan-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2-reten-salah'
                                        checked={
                                          pilihanDataSalah.penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan
                                        }
                                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                                      />
                                      <label
                                        htmlFor='penjagaan-kesihatan-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2-reten-salah'
                                        className='text-sm font-m mx-2'
                                      >
                                        nasihat berkaitan penjagaan kesihatan
                                        oral
                                      </label>
                                      <span className='text-kaunter4 mx-2'>
                                        <FaCheck className='text-2xl' />
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div
                                  className={`${
                                    pilihanDataSalah.kanserMulutNasihatPergigianIndividuPromosiSekolahRawatanCBox &&
                                    'grid-rows-2'
                                  } grid px-3 pl pt-1`}
                                >
                                  <div
                                    className={`${
                                      pilihanDataSalah.kanserMulutNasihatPergigianIndividuPromosiSekolahRawatanCBox &&
                                      'bg-user9 bg-opacity-20 p-2'
                                    } flex items-center flex-row pl-2`}
                                  >
                                    <input
                                      disabled
                                      type='checkbox'
                                      name='kanser-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                                      id='kanser-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                                      checked={
                                        rawatan.kanserMulutNasihatPergigianIndividuPromosiSekolahRawatan
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
                                    <div className='relative mx-2'>
                                      <input
                                        // disabled={disableSalah}
                                        type='checkbox'
                                        name='kanser-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2-reten-salah-cbox'
                                        id='kanser-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2-reten-salah-cbox'
                                        checked={
                                          pilihanDataSalah.kanserMulutNasihatPergigianIndividuPromosiSekolahRawatanCBox
                                        }
                                        onChange={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            kanserMulutNasihatPergigianIndividuPromosiSekolahRawatanCBox:
                                              !pilihanDataSalah.kanserMulutNasihatPergigianIndividuPromosiSekolahRawatanCBox,
                                            kanserMulutNasihatPergigianIndividuPromosiSekolahRawatan:
                                              !rawatan.kanserMulutNasihatPergigianIndividuPromosiSekolahRawatan,
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            kanserMulutNasihatPergigianIndividuPromosiSekolahRawatanCBox:
                                              !pilihanDataSalah.kanserMulutNasihatPergigianIndividuPromosiSekolahRawatanCBox,
                                            kanserMulutNasihatPergigianIndividuPromosiSekolahRawatan:
                                              !rawatan.kanserMulutNasihatPergigianIndividuPromosiSekolahRawatan,
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              kanserMulutNasihatPergigianIndividuPromosiSekolahRawatanCBox:
                                                !pilihanDataSalah.kanserMulutNasihatPergigianIndividuPromosiSekolahRawatanCBox,
                                              kanserMulutNasihatPergigianIndividuPromosiSekolahRawatan:
                                                !rawatan.kanserMulutNasihatPergigianIndividuPromosiSekolahRawatan,
                                            },
                                          });
                                        }}
                                        className='peer hidden'
                                      />
                                      <label
                                        htmlFor='kanser-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2-reten-salah-cbox'
                                        className=' text-user9 h-6 w-6 rounded-full flex items-center justify-center cursor-pointer'
                                      >
                                        {pilihanDataSalah.kanserMulutNasihatPergigianIndividuPromosiSekolahRawatanCBox ===
                                        true ? (
                                          <FaTimes className='text-2xl' />
                                        ) : (
                                          <FaRegHandPointLeft className='text-2xl' />
                                        )}
                                      </label>
                                    </div>
                                  </div>
                                  {pilihanDataSalah.kanserMulutNasihatPergigianIndividuPromosiSekolahRawatanCBox ===
                                    true && (
                                    <div className='flex items-center flex-row bg-user11 bg-opacity-50 p-2'>
                                      <input
                                        disabled
                                        type='checkbox'
                                        name='kanser-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2-reten-salah'
                                        id='kanser-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2-reten-salah'
                                        checked={
                                          pilihanDataSalah.kanserMulutNasihatPergigianIndividuPromosiSekolahRawatan
                                        }
                                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                                      />
                                      <label
                                        htmlFor='kanser-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2-reten-salah'
                                        className='text-sm font-m mx-2'
                                      >
                                        nasihat berkaitan kanser mulut
                                      </label>
                                      <span className='text-kaunter4 mx-2'>
                                        <FaCheck className='text-2xl' />
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </article>
                          </div>
                        )}
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
                          <span
                            onClick={() => {
                              setShowForm(false);
                            }}
                            className='flex bg-user3 p-2 w-full capitalize justify-center hover:bg-user1 hover:text-userWhite transition-all hover:cursor-pointer'
                          >
                            kembali
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
                );
              })}
            </div>
          </div>
        </>
      )}
    </ConfirmCheck>
  );
}

export default UserFormSekolahRawatan;
