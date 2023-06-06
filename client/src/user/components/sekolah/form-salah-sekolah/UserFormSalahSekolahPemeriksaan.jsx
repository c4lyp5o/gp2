import { useState, useEffect } from 'react';
import {
  FaInfoCircle,
  FaTimes,
  FaCheck,
  FaRegHandPointLeft,
  FaGlobeAsia,
  FaYinYang,
} from 'react-icons/fa';
import axios from 'axios';
import { Spinner } from 'react-awesome-spinners';
import moment from 'moment';

import ConfirmCheck from './ConfirmationSalahPemeriksaan';

import { useGlobalUserAppContext } from '../../../context/userAppContext';

function UserFormSalahSekolahPemeriksaan({ salahReten }) {
  const {
    userToken,
    reliefUserToken,
    username,
    userinfo,
    useParams,
    masterDatePicker,
    toast,
  } = useGlobalUserAppContext();

  const { personSekolahId, pemeriksaanSekolahId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isShown, setIsShown] = useState(false);
  const [singlePersonSekolah, setSinglePersonSekolah] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //confirm data
  const [confirmData, setConfirmData] = useState({});

  const [showCleftLip, setShowCleftLip] = useState(false);
  const [showTrauma, setShowTrauma] = useState(false);

  const createdByUsername = username;
  const [engganTidakHadirPemeriksaan, setEngganTidakHadirPemeriksaan] =
    useState('');
  const [modalEnggan, setModalEnggan] = useState(false);
  const [modalTidakHadir, setModalTidakHadir] = useState(false);
  const [engganPemeriksaan, setEngganPemeriksaan] = useState('');
  const [kebenaranPemeriksaan, setKebenaranPemeriksaan] = useState('');
  const [tidakHadirPemeriksaan, setTidakHadirPemeriksaan] = useState('');
  const [padamPemeriksaan, setPadamPemeriksaan] = useState(false);
  const [tarikhPemeriksaanSemasa, setTarikhPemeriksaanSemasa] = useState('');
  const [statikBergerak, setStatikBergerak] = useState('');
  const [kpBergerak, setKpBergerak] = useState(false);
  const [plateNo, setPlateNo] = useState('');
  const [yaTidakSediaAdaStatusDenture, setYaTidakSediaAdaStatusDenture] =
    useState('');
  const [separaPenuhAtasSediaAdaDenture, setSeparaPenuhAtasSediaAdaDenture] =
    useState('');
  const [separaPenuhBawahSediaAdaDenture, setSeparaPenuhBawahSediaAdaDenture] =
    useState('');
  const [yaTidakPerluStatusDenture, setYaTidakPerluStatusDenture] =
    useState('');
  const [separaPenuhAtasPerluDenture, setSeparaPenuhAtasPerluDenture] =
    useState('');
  const [separaPenuhBawahPerluDenture, setSeparaPenuhBawahPerluDenture] =
    useState('');
  const [kebersihanMulutOralHygiene, setKebersihanMulutOralHygiene] =
    useState('');
  const [skorBpeOralHygiene, setSkorBpeOralHygiene] = useState('');
  const [saringanKanserMulutOralHygiene, setSaringanKanserMulutOralHygiene] =
    useState(false);
  const [skorGisMulutOralHygiene, setSkorGisMulutOralHygiene] = useState('');
  const [perluPenskaleranOralHygiene, setPerluPenskaleranOralHygiene] =
    useState(false);
  const [statusPeriodontium, setStatusPeriodontium] = useState('');
  const [yaTidakPesakitMempunyaiGigi, setYaTidakPesakitMempunyaiGigi] =
    useState('');
  const [adaDesidus, setAdaDesidus] = useState(false);
  const [dAdaGigiDesidus, setDAdaGigiDesidus] = useState(0);
  const [fAdaGigiDesidus, setFAdaGigiDesidus] = useState(0);
  const [xAdaGigiDesidus, setXAdaGigiDesidus] = useState(0);
  const [sumDMFXDesidus, setSumDMFXDesidus] = useState(0);
  const [adaKekal, setAdaKekal] = useState(false);
  const [dAdaGigiKekal, setDAdaGigiKekal] = useState(0);
  const [mAdaGigiKekal, setMAdaGigiKekal] = useState(0);
  const [fAdaGigiKekal, setFAdaGigiKekal] = useState(0);
  const [eAdaGigiKekal, setEAdaGigiKekal] = useState(0);
  const [xAdaGigiKekal, setXAdaGigiKekal] = useState(0);
  const [sumDMFXKekal, setSumDMFXKekal] = useState(0);
  const [jumlahFaktorRisiko, setJumlahFaktorRisiko] = useState('');
  const [penandaRisikoKaries, setPenandaRisikoKaries] = useState('');
  const [adaCleftLip, setAdaCleftLip] = useState(false);
  const [rujukCleftLip, setRujukCleftLip] = useState(false);
  const [kecederaanGigiAnteriorTrauma, setKecederaanGigiAnteriorTrauma] =
    useState(false);
  const [tisuLembutTrauma, setTisuLembutTrauma] = useState(false);
  const [tisuKerasTrauma, setTisuKerasTrauma] = useState(false);
  const [gicBilanganFsDibuat3TahunLepas, setGicBilanganFsDibuat3TahunLepas] =
    useState(0);
  const [
    resinBilanganFsDibuat3TahunLepas,
    setResinBilanganFsDibuat3TahunLepas,
  ] = useState(0);
  const [
    lainLainBilanganFsDibuat3TahunLepas,
    setLainLainBilanganFsDibuat3TahunLepas,
  ] = useState(0);
  const [
    dBilanganFsDibuat3TahunLepasTerjadi,
    setDBilanganFsDibuat3TahunLepasTerjadi,
  ] = useState(0);
  const [
    mBilanganFsDibuat3TahunLepasTerjadi,
    setMBilanganFsDibuat3TahunLepasTerjadi,
  ] = useState(0);
  const [
    fBilanganFsDibuat3TahunLepasTerjadi,
    setFBilanganFsDibuat3TahunLepasTerjadi,
  ] = useState(0);
  const [
    eBilanganFsDibuat3TahunLepasTerjadi,
    setEBilanganFsDibuat3TahunLepasTerjadi,
  ] = useState(0);
  const [
    xBilanganFsDibuat3TahunLepasTerjadi,
    setXBilanganFsDibuat3TahunLepasTerjadi,
  ] = useState(0);
  const [toothSurfaceLoss, setToothSurfaceLoss] = useState(false);
  const [classID, setClassID] = useState(0);
  const [classIID, setClassIID] = useState(0);
  const [sumClassD, setSumClassD] = useState(0);
  const [classIF, setClassIF] = useState(0);
  const [classIIF, setClassIIF] = useState(0);
  const [sumClassF, setSumClassF] = useState(0);
  const [baruJumlahGigiKekalPerluFs, setBaruJumlahGigiKekalPerluFs] =
    useState(0);
  const [sumPerluFs, setSumPerluFs] = useState(0);
  const [baruJumlahMuridPerluFs, setBaruJumlahMuridPerluFs] = useState(false);
  const [baruJumlahGigiKekalPerluFv, setBaruJumlahGigiKekalPerluFv] =
    useState(0);
  const [semulaJumlahGigiKekalPerluFv, setSemulaJumlahGigiKekalPerluFv] =
    useState(0);
  const [sumPerluFv, setSumPerluFv] = useState(0);
  const [baruJumlahMuridPerluFv, setBaruJumlahMuridPerluFv] = useState(false);
  const [semulaJumlahMuridPerluFv, setSemulaJumlahMuridPerluFv] = useState(0);
  const [
    baruJumlahGigiKekalPerluPrrJenis1,
    setBaruJumlahGigiKekalPerluPrrJenis1,
  ] = useState(0);
  const [
    semulaJumlahGigiKekalPerluPrrJenis1,
    setSemulaJumlahGigiKekalPerluPrrJenis1,
  ] = useState(0);
  const [sumPerluPrr, setSumPerluPrr] = useState(0);
  const [baruJumlahMuridPerluPrrJenis1, setBaruJumlahMuridPerluPrrJenis1] =
    useState(false);
  const [semulaJumlahMuridPerluPrrJenis1, setSemulaJumlahMuridPerluPrrJenis1] =
    useState(0);
  const [
    yaTidakSilverDiamineFluoridePerluSapuan,
    setYaTidakSilverDiamineFluoridePerluSapuan,
  ] = useState('');
  const [
    baruGDAnteriorSewarnaJumlahTampalanDiperlukan,
    setBaruGDAnteriorSewarnaJumlahTampalanDiperlukan,
  ] = useState(0);
  const [
    semulaGDAnteriorSewarnaJumlahTampalanDiperlukan,
    setSemulaGDAnteriorSewarnaJumlahTampalanDiperlukan,
  ] = useState(0);
  const [
    baruGKAnteriorSewarnaJumlahTampalanDiperlukan,
    setBaruGKAnteriorSewarnaJumlahTampalanDiperlukan,
  ] = useState(0);
  const [
    semulaGKAnteriorSewarnaJumlahTampalanDiperlukan,
    setSemulaGKAnteriorSewarnaJumlahTampalanDiperlukan,
  ] = useState(0);
  const [
    baruGDPosteriorSewarnaJumlahTampalanDiperlukan,
    setBaruGDPosteriorSewarnaJumlahTampalanDiperlukan,
  ] = useState(0);
  const [
    semulaGDPosteriorSewarnaJumlahTampalanDiperlukan,
    setSemulaGDPosteriorSewarnaJumlahTampalanDiperlukan,
  ] = useState(0);
  const [
    baruGKPosteriorSewarnaJumlahTampalanDiperlukan,
    setBaruGKPosteriorSewarnaJumlahTampalanDiperlukan,
  ] = useState(0);
  const [
    semulaGKPosteriorSewarnaJumlahTampalanDiperlukan,
    setSemulaGKPosteriorSewarnaJumlahTampalanDiperlukan,
  ] = useState(0);
  const [
    baruGDPosteriorAmalgamJumlahTampalanDiperlukan,
    setBaruGDPosteriorAmalgamJumlahTampalanDiperlukan,
  ] = useState(0);
  const [
    semulaGDPosteriorAmalgamJumlahTampalanDiperlukan,
    setSemulaGDPosteriorAmalgamJumlahTampalanDiperlukan,
  ] = useState(0);
  const [
    baruGKPosteriorAmalgamJumlahTampalanDiperlukan,
    setBaruGKPosteriorAmalgamJumlahTampalanDiperlukan,
  ] = useState(0);
  const [
    semulaGKPosteriorAmalgamJumlahTampalanDiperlukan,
    setSemulaGKPosteriorAmalgamJumlahTampalanDiperlukan,
  ] = useState(0);
  const [sumGigiDesidus, setSumGigiDesidus] = useState(0);
  const [sumGigiKekal, setSumGigiKekal] = useState(0);
  const [sumGigiKekalE, setSumGigiKekalE] = useState(0);
  //kes selesai
  const [kesSelesai, setKesSelesai] = useState('');
  const [kesSelesaiIcdas, setKesSelesaiIcdas] = useState('');
  //kotak
  const [statusM, setStatusM] = useState('');
  const [menerimaNasihatRingkas, setMenerimaNasihatRingkas] = useState('');
  const [melaksanakanSaringanMerokok, setMelaksanakanSaringanMerokok] =
    useState('');
  const [bersediaDirujuk, setBersediaDirujuk] = useState('');
  const [noTelMuridKotak, setNoTelMuridKotak] = useState('');

  // datepicker issue
  const [tarikhPemeriksaanSemasaDP, setTarikhPemeriksaanSemasaDP] =
    useState(null);

  //reten salah
  const [retenSalahLength, setRetenSalahLength] = useState('');
  const [dataRetenSalah, setDataRetenSalah] = useState({});
  const [pilihanDataSalah, setPilihanDataSalah] = useState({
    yaTidakSediaAdaStatusDenture: '',
    yaTidakSediaAdaStatusDentureCBox: false,
    separaPenuhAtasSediaAdaDenture: '',
    separaPenuhAtasSediaAdaDentureCBox: false,
    separaPenuhBawahSediaAdaDenture: '',
    separaPenuhBawahSediaAdaDentureCBox: false,
    yaTidakPerluStatusDenture: '',
    yaTidakPerluStatusDentureCBox: false,
    separaPenuhAtasPerluDenture: '',
    separaPenuhAtasPerluDentureCBox: false,
    separaPenuhBawahPerluDenture: '',
    separaPenuhBawahPerluDentureCBox: false,
    kebersihanMulutOralHygiene: '',
    kebersihanMulutOralHygieneCBox: false,
    skorBpeOralHygiene: '',
    skorBpeOralHygieneCBox: false,
    saringanKanserMulutOralHygiene: false,
    saringanKanserMulutOralHygieneCBox: false,
    skorGisMulutOralHygiene: '',
    skorGisMulutOralHygieneCBox: false,
    perluPenskaleranOralHygiene: false,
    perluPenskaleranOralHygieneCBox: false,
    statusPeriodontium: false,
    statusPeriodontiumCBox: false,
    yaTidakPesakitMempunyaiGigi: '',
    yaTidakPesakitMempunyaiGigiCBox: false,
    adaDesidus: false,
    adaDesidusCBox: false,
    dAdaGigiDesidus: 0,
    dAdaGigiDesidusCBox: false,
    fAdaGigiDesidus: 0,
    fAdaGigiDesidusCBox: false,
    xAdaGigiDesidus: 0,
    xAdaGigiDesidusCBox: false,
    adaKekal: false,
    adaKekalCBox: false,
    dAdaGigiKekal: 0,
    dAdaGigiKekalCBox: false,
    mAdaGigiKekal: 0,
    mAdaGigiKekalCBox: false,
    fAdaGigiKekal: 0,
    fAdaGigiKekalCBox: false,
    eAdaGigiKekal: 0,
    eAdaGigiKekalCBox: false,
    xAdaGigiKekal: 0,
    xAdaGigiKekalCBox: false,
    jumlahFaktorRisiko: '',
    jumlahFaktorRisikoCBox: false,
    penandaRisikoKaries: '',
    penandaRisikoKariesCBox: false,
    adaCleftLip: false,
    adaCleftLipCBox: false,
    rujukCleftLip: false,
    rujukCleftLipCBox: false,
    kecederaanGigiAnteriorTrauma: false,
    kecederaanGigiAnteriorTraumaCBox: false,
    tisuLembutTrauma: false,
    tisuLembutTraumaCBox: false,
    tisuKerasTrauma: false,
    tisuKerasTraumaCBox: false,
    gicBilanganFsDibuat3TahunLepas: 0,
    gicBilanganFsDibuat3TahunLepasCBox: false,
    resinBilanganFsDibuat3TahunLepas: 0,
    resinBilanganFsDibuat3TahunLepasCBox: false,
    lainLainBilanganFsDibuat3TahunLepas: 0,
    lainLainBilanganFsDibuat3TahunLepasCBox: false,
    dBilanganFsDibuat3TahunLepasTerjadi: 0,
    dBilanganFsDibuat3TahunLepasTerjadiCBox: false,
    mBilanganFsDibuat3TahunLepasTerjadi: 0,
    mBilanganFsDibuat3TahunLepasTerjadiCBox: false,
    fBilanganFsDibuat3TahunLepasTerjadi: 0,
    fBilanganFsDibuat3TahunLepasTerjadiCBox: false,
    eBilanganFsDibuat3TahunLepasTerjadi: 0,
    eBilanganFsDibuat3TahunLepasTerjadiCBox: false,
    xBilanganFsDibuat3TahunLepasTerjadi: 0,
    xBilanganFsDibuat3TahunLepasTerjadiCBox: false,
    toothSurfaceLoss: false,
    toothSurfaceLossCBox: false,
    classID: 0,
    classIDCBox: false,
    classIID: 0,
    classIIDCBox: false,
    classIF: 0,
    classIFCBox: false,
    classIIF: 0,
    classIIFCBox: false,
    baruJumlahGigiKekalPerluFs: 0,
    baruJumlahGigiKekalPerluFsCBox: false,
    baruJumlahMuridPerluFs: false,
    baruJumlahMuridPerluFsCBox: false,
    baruJumlahGigiKekalPerluFv: 0,
    baruJumlahGigiKekalPerluFvCBox: false,
    semulaJumlahGigiKekalPerluFv: 0,
    semulaJumlahGigiKekalPerluFvCBox: false,
    baruJumlahMuridPerluFv: false,
    baruJumlahMuridPerluFvCBox: false,
    baruJumlahGigiKekalPerluPrrJenis1: 0,
    baruJumlahGigiKekalPerluPrrJenis1CBox: false,
    semulaJumlahGigiKekalPerluPrrJenis1: 0,
    semulaJumlahGigiKekalPerluPrrJenis1CBox: false,
    baruJumlahMuridPerluPrrJenis1: false,
    baruJumlahMuridPerluPrrJenis1CBox: false,
    semulaJumlahMuridPerluPrrJenis1: false,
    semulaJumlahMuridPerluPrrJenis1CBox: false,
    yaTidakSilverDiamineFluoridePerluSapuan: '',
    yaTidakSilverDiamineFluoridePerluSapuanCBox: false,
    baruGDAnteriorSewarnaJumlahTampalanDiperlukan: 0,
    baruGDAnteriorSewarnaJumlahTampalanDiperlukanCBox: false,
    semulaGDAnteriorSewarnaJumlahTampalanDiperlukan: 0,
    semulaGDAnteriorSewarnaJumlahTampalanDiperlukanCBox: false,
    baruGKAnteriorSewarnaJumlahTampalanDiperlukan: 0,
    baruGKAnteriorSewarnaJumlahTampalanDiperlukanCBox: false,
    semulaGKAnteriorSewarnaJumlahTampalanDiperlukan: 0,
    semulaGKAnteriorSewarnaJumlahTampalanDiperlukanCBox: false,
    baruGDPosteriorSewarnaJumlahTampalanDiperlukan: 0,
    baruGDPosteriorSewarnaJumlahTampalanDiperlukanCBox: false,
    semulaGDPosteriorSewarnaJumlahTampalanDiperlukan: 0,
    semulaGDPosteriorSewarnaJumlahTampalanDiperlukanCBox: false,
    baruGKPosteriorSewarnaJumlahTampalanDiperlukan: 0,
    baruGKPosteriorSewarnaJumlahTampalanDiperlukanCBox: false,
    semulaGKPosteriorSewarnaJumlahTampalanDiperlukan: 0,
    semulaGKPosteriorSewarnaJumlahTampalanDiperlukanCBox: false,
    baruGDPosteriorAmalgamJumlahTampalanDiperlukan: 0,
    baruGDPosteriorAmalgamJumlahTampalanDiperlukanCBox: false,
    semulaGDPosteriorAmalgamJumlahTampalanDiperlukan: 0,
    semulaGDPosteriorAmalgamJumlahTampalanDiperlukanCBox: false,
    baruGKPosteriorAmalgamJumlahTampalanDiperlukan: 0,
    baruGKPosteriorAmalgamJumlahTampalanDiperlukanCBox: false,
    semulaGKPosteriorAmalgamJumlahTampalanDiperlukan: 0,
    semulaGKPosteriorAmalgamJumlahTampalanDiperlukanCBox: false,
    statusM: '',
    statusMCBox: false,
    menerimaNasihatRingkas: '',
    menerimaNasihatRingkasCBox: false,
    melaksanakanSaringanMerokok: '',
    melaksanakanSaringanMerokokCBox: false,
    bersediaDirujuk: '',
    bersediaDirujukCBox: false,
    noTelMuridKotak: '',
    noTelMuridKotakCBox: false,
    kesSelesai: '',
    kesSelesaiCBox: false,
    kesSelesaiIcdas: '',
    kesSelesaiIcdasCBox: false,
  });

  const TarikhPemeriksaanSemasa = () => {
    let isDisabled = false;
    if (
      singlePersonSekolah.statusRawatan === 'selesai' ||
      singlePersonSekolah.statusRawatan === 'belum selesai'
    ) {
      isDisabled = true;
    }
    return masterDatePicker({
      selected: tarikhPemeriksaanSemasaDP,
      required: true,
      onChange: (tarikhPemeriksaanSemasa) => {
        const tempDate = moment(tarikhPemeriksaanSemasa).format('YYYY-MM-DD');
        setTarikhPemeriksaanSemasa(tempDate);
        setTarikhPemeriksaanSemasaDP(tarikhPemeriksaanSemasa);
      },
      filterDate: (date) => {
        return moment() > date;
      },
      disabled: isDisabled,
      className:
        'appearance-none w-auto text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md uppercase flex flex-row ml-5',
    });
  };

  // calculate total dmfx + sm desidus
  useEffect(() => {
    setSumDMFXDesidus(
      parseInt(dAdaGigiDesidus) +
        parseInt(fAdaGigiDesidus) +
        parseInt(xAdaGigiDesidus)
    );
    setConfirmData({
      ...confirmData,
      sumDMFXDesidus:
        parseInt(dAdaGigiDesidus) +
        parseInt(fAdaGigiDesidus) +
        parseInt(xAdaGigiDesidus),
    });
  }, [dAdaGigiDesidus, fAdaGigiDesidus, xAdaGigiDesidus]);

  // calculate total DMFX kekal
  useEffect(() => {
    setSumDMFXKekal(
      parseInt(dAdaGigiKekal) +
        parseInt(mAdaGigiKekal) +
        parseInt(fAdaGigiKekal) +
        parseInt(xAdaGigiKekal)
    );
    setConfirmData({
      ...confirmData,
      sumDMFXKekal:
        parseInt(dAdaGigiKekal) +
        parseInt(mAdaGigiKekal) +
        parseInt(fAdaGigiKekal) +
        parseInt(xAdaGigiKekal),
    });
  }, [dAdaGigiKekal, mAdaGigiKekal, fAdaGigiKekal, xAdaGigiKekal]);

  // calculate total D class I & II
  useEffect(() => {
    setSumClassD(parseInt(classID) + parseInt(classIID));
  }, [classID, classIID]);

  // calculate total F class I & II
  useEffect(() => {
    setSumClassF(parseInt(classIF) + parseInt(classIIF));
  }, [classIF, classIIF]);

  // calculate total perlu FS
  useEffect(() => {
    setSumPerluFs(parseInt(baruJumlahGigiKekalPerluFs));
  }, [baruJumlahGigiKekalPerluFs]);

  // calculate total perlu FV
  useEffect(() => {
    setSumPerluFv(parseInt(baruJumlahGigiKekalPerluFv));
  }, [baruJumlahGigiKekalPerluFv, semulaJumlahGigiKekalPerluFv]);

  // calculate total perlu PRR
  useEffect(() => {
    setSumPerluPrr(parseInt(baruJumlahGigiKekalPerluPrrJenis1));
  }, [baruJumlahGigiKekalPerluPrrJenis1, semulaJumlahGigiKekalPerluPrrJenis1]);

  //calculate gigi desidus
  useEffect(() => {
    setSumGigiDesidus(
      parseInt(baruGDAnteriorSewarnaJumlahTampalanDiperlukan) +
        parseInt(semulaGDAnteriorSewarnaJumlahTampalanDiperlukan) +
        parseInt(baruGDPosteriorSewarnaJumlahTampalanDiperlukan) +
        parseInt(semulaGDPosteriorSewarnaJumlahTampalanDiperlukan) +
        parseInt(baruGDPosteriorAmalgamJumlahTampalanDiperlukan) +
        parseInt(semulaGDPosteriorAmalgamJumlahTampalanDiperlukan)
    );
  }, [
    baruGDAnteriorSewarnaJumlahTampalanDiperlukan,
    semulaGDAnteriorSewarnaJumlahTampalanDiperlukan,
    baruGDPosteriorSewarnaJumlahTampalanDiperlukan,
    semulaGDPosteriorSewarnaJumlahTampalanDiperlukan,
    baruGDPosteriorAmalgamJumlahTampalanDiperlukan,
    semulaGDPosteriorAmalgamJumlahTampalanDiperlukan,
  ]);

  //calculate gigi kekal
  useEffect(() => {
    setSumGigiKekal(
      parseInt(baruGKAnteriorSewarnaJumlahTampalanDiperlukan) +
        parseInt(semulaGKAnteriorSewarnaJumlahTampalanDiperlukan) +
        parseInt(baruGKPosteriorSewarnaJumlahTampalanDiperlukan) +
        parseInt(semulaGKPosteriorSewarnaJumlahTampalanDiperlukan) +
        parseInt(baruGKPosteriorAmalgamJumlahTampalanDiperlukan) +
        parseInt(semulaGKPosteriorAmalgamJumlahTampalanDiperlukan)
    );
  }, [
    baruGKAnteriorSewarnaJumlahTampalanDiperlukan,
    semulaGKAnteriorSewarnaJumlahTampalanDiperlukan,
    baruGKPosteriorSewarnaJumlahTampalanDiperlukan,
    semulaGKPosteriorSewarnaJumlahTampalanDiperlukan,
    baruGKPosteriorAmalgamJumlahTampalanDiperlukan,
    semulaGKPosteriorAmalgamJumlahTampalanDiperlukan,
  ]);

  //calculate gigi kekal E
  useEffect(() => {
    setSumGigiKekalE(
      parseInt(baruJumlahGigiKekalPerluFs) +
        parseInt(baruJumlahGigiKekalPerluPrrJenis1) +
        parseInt(baruJumlahGigiKekalPerluFv)
    );
  }, [
    baruJumlahGigiKekalPerluFs,
    baruJumlahGigiKekalPerluPrrJenis1,
    baruJumlahGigiKekalPerluFv,
  ]);

  //useEffect needed for change classname color & synchronous
  useEffect(() => {
    setEAdaGigiKekal(parseInt(eAdaGigiKekal));
  }, [eAdaGigiKekal]);
  useEffect(() => {
    setDAdaGigiKekal(parseInt(dAdaGigiKekal));
  }, [dAdaGigiKekal]);

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

        // map to form if pemeriksaanSekolahId exist
        if (pemeriksaanSekolahId !== 'tambah-pemeriksaan') {
          setEngganTidakHadirPemeriksaan(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .engganTidakHadirPemeriksaan
          );
          setEngganPemeriksaan(
            data.personSekolahWithPopulate.pemeriksaanSekolah.engganPemeriksaan
          );
          setKebenaranPemeriksaan(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .kebenaranPemeriksaan
          );
          setTidakHadirPemeriksaan(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .tidakHadirPemeriksaan
          );
          setTarikhPemeriksaanSemasa(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .tarikhPemeriksaanSemasa
          );
          setStatikBergerak(
            data.personSekolahWithPopulate.pemeriksaanSekolah.statikBergerak
          );
          setKpBergerak(
            data.personSekolahWithPopulate.pemeriksaanSekolah.kpBergerak
          );
          setPlateNo(data.personSekolahWithPopulate.pemeriksaanSekolah.plateNo);
          setYaTidakSediaAdaStatusDenture(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .yaTidakSediaAdaStatusDenture
          );
          setSeparaPenuhAtasSediaAdaDenture(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .separaPenuhAtasSediaAdaDenture
          );
          setSeparaPenuhBawahSediaAdaDenture(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .separaPenuhBawahSediaAdaDenture
          );
          setYaTidakPerluStatusDenture(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .yaTidakPerluStatusDenture
          );
          setSeparaPenuhAtasPerluDenture(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .separaPenuhAtasPerluDenture
          );
          setSeparaPenuhBawahPerluDenture(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .separaPenuhBawahPerluDenture
          );
          setKebersihanMulutOralHygiene(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .kebersihanMulutOralHygiene
          );
          setSkorBpeOralHygiene(
            data.personSekolahWithPopulate.pemeriksaanSekolah.skorBpeOralHygiene
          );
          setSaringanKanserMulutOralHygiene(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .saringanKanserMulutOralHygiene
          );
          setSkorGisMulutOralHygiene(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .skorGisMulutOralHygiene
          );
          setPerluPenskaleranOralHygiene(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .perluPenskaleranOralHygiene
          );
          setStatusPeriodontium(
            data.personSekolahWithPopulate.pemeriksaanSekolah.statusPeriodontium
          );
          setYaTidakPesakitMempunyaiGigi(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .yaTidakPesakitMempunyaiGigi
          );
          setAdaDesidus(
            data.personSekolahWithPopulate.pemeriksaanSekolah.adaDesidus
          );
          setDAdaGigiDesidus(
            data.personSekolahWithPopulate.pemeriksaanSekolah.dAdaGigiDesidus
          );
          setFAdaGigiDesidus(
            data.personSekolahWithPopulate.pemeriksaanSekolah.fAdaGigiDesidus
          );
          setXAdaGigiDesidus(
            data.personSekolahWithPopulate.pemeriksaanSekolah.xAdaGigiDesidus
          );
          setAdaKekal(
            data.personSekolahWithPopulate.pemeriksaanSekolah.adaKekal
          );
          setDAdaGigiKekal(
            data.personSekolahWithPopulate.pemeriksaanSekolah.dAdaGigiKekal
          );
          setMAdaGigiKekal(
            data.personSekolahWithPopulate.pemeriksaanSekolah.mAdaGigiKekal
          );
          setFAdaGigiKekal(
            data.personSekolahWithPopulate.pemeriksaanSekolah.fAdaGigiKekal
          );
          setEAdaGigiKekal(
            data.personSekolahWithPopulate.pemeriksaanSekolah.eAdaGigiKekal
          );
          setXAdaGigiKekal(
            data.personSekolahWithPopulate.pemeriksaanSekolah.xAdaGigiKekal
          );
          setJumlahFaktorRisiko(
            data.personSekolahWithPopulate.pemeriksaanSekolah.jumlahFaktorRisiko
          );
          setPenandaRisikoKaries(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .penandaRisikoKaries
          );
          setAdaCleftLip(
            data.personSekolahWithPopulate.pemeriksaanSekolah.adaCleftLip
          );
          setRujukCleftLip(
            data.personSekolahWithPopulate.pemeriksaanSekolah.rujukCleftLip
          );
          setKecederaanGigiAnteriorTrauma(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .kecederaanGigiAnteriorTrauma
          );
          setTisuLembutTrauma(
            data.personSekolahWithPopulate.pemeriksaanSekolah.tisuLembutTrauma
          );
          setTisuKerasTrauma(
            data.personSekolahWithPopulate.pemeriksaanSekolah.tisuKerasTrauma
          );
          setGicBilanganFsDibuat3TahunLepas(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .gicBilanganFsDibuat3TahunLepas
          );
          setResinBilanganFsDibuat3TahunLepas(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .resinBilanganFsDibuat3TahunLepas
          );
          setLainLainBilanganFsDibuat3TahunLepas(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .lainLainBilanganFsDibuat3TahunLepas
          );
          setDBilanganFsDibuat3TahunLepasTerjadi(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .dBilanganFsDibuat3TahunLepasTerjadi
          );
          setMBilanganFsDibuat3TahunLepasTerjadi(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .mBilanganFsDibuat3TahunLepasTerjadi
          );
          setFBilanganFsDibuat3TahunLepasTerjadi(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .fBilanganFsDibuat3TahunLepasTerjadi
          );
          setEBilanganFsDibuat3TahunLepasTerjadi(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .eBilanganFsDibuat3TahunLepasTerjadi
          );
          setXBilanganFsDibuat3TahunLepasTerjadi(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .xBilanganFsDibuat3TahunLepasTerjadi
          );
          setToothSurfaceLoss(
            data.personSekolahWithPopulate.pemeriksaanSekolah.toothSurfaceLoss
          );
          setClassID(data.personSekolahWithPopulate.pemeriksaanSekolah.classID);
          setClassIID(
            data.personSekolahWithPopulate.pemeriksaanSekolah.classIID
          );
          setClassIF(data.personSekolahWithPopulate.pemeriksaanSekolah.classIF);
          setClassIIF(
            data.personSekolahWithPopulate.pemeriksaanSekolah.classIIF
          );
          setBaruJumlahGigiKekalPerluFs(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .baruJumlahGigiKekalPerluFs
          );
          setBaruJumlahMuridPerluFs(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .baruJumlahMuridPerluFs
          );
          setBaruJumlahGigiKekalPerluFv(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .baruJumlahGigiKekalPerluFv
          );
          setSemulaJumlahGigiKekalPerluFv(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .semulaJumlahGigiKekalPerluFv
          );
          setBaruJumlahMuridPerluFv(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .baruJumlahMuridPerluFv
          );
          setSemulaJumlahMuridPerluFv(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .semulaJumlahMuridPerluFv
          );
          setBaruJumlahGigiKekalPerluPrrJenis1(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .baruJumlahGigiKekalPerluPrrJenis1
          );
          setSemulaJumlahGigiKekalPerluPrrJenis1(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .semulaJumlahGigiKekalPerluPrrJenis1
          );
          setBaruJumlahMuridPerluPrrJenis1(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .baruJumlahMuridPerluPrrJenis1
          );
          setSemulaJumlahMuridPerluPrrJenis1(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .semulaJumlahMuridPerluPrrJenis1
          );
          setYaTidakSilverDiamineFluoridePerluSapuan(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .yaTidakSilverDiamineFluoridePerluSapuan
          );
          setBaruGDAnteriorSewarnaJumlahTampalanDiperlukan(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .baruGDAnteriorSewarnaJumlahTampalanDiperlukan
          );
          setSemulaGDAnteriorSewarnaJumlahTampalanDiperlukan(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .semulaGDAnteriorSewarnaJumlahTampalanDiperlukan
          );
          setBaruGKAnteriorSewarnaJumlahTampalanDiperlukan(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .baruGKAnteriorSewarnaJumlahTampalanDiperlukan
          );
          setSemulaGKAnteriorSewarnaJumlahTampalanDiperlukan(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .semulaGKAnteriorSewarnaJumlahTampalanDiperlukan
          );
          setBaruGDPosteriorSewarnaJumlahTampalanDiperlukan(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .baruGDPosteriorSewarnaJumlahTampalanDiperlukan
          );
          setSemulaGDPosteriorSewarnaJumlahTampalanDiperlukan(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .semulaGDPosteriorSewarnaJumlahTampalanDiperlukan
          );
          setBaruGKPosteriorSewarnaJumlahTampalanDiperlukan(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .baruGKPosteriorSewarnaJumlahTampalanDiperlukan
          );
          setSemulaGKPosteriorSewarnaJumlahTampalanDiperlukan(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .semulaGKPosteriorSewarnaJumlahTampalanDiperlukan
          );
          setBaruGDPosteriorAmalgamJumlahTampalanDiperlukan(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .baruGDPosteriorAmalgamJumlahTampalanDiperlukan
          );
          setSemulaGDPosteriorAmalgamJumlahTampalanDiperlukan(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .semulaGDPosteriorAmalgamJumlahTampalanDiperlukan
          );
          setBaruGKPosteriorAmalgamJumlahTampalanDiperlukan(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .baruGKPosteriorAmalgamJumlahTampalanDiperlukan
          );
          setSemulaGKPosteriorAmalgamJumlahTampalanDiperlukan(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .semulaGKPosteriorAmalgamJumlahTampalanDiperlukan
          );
          setStatusM(data.personSekolahWithPopulate.pemeriksaanSekolah.statusM);
          setMenerimaNasihatRingkas(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .menerimaNasihatRingkas
          );
          setMelaksanakanSaringanMerokok(
            data.personSekolahWithPopulate.pemeriksaanSekolah
              .melaksanakanSaringanMerokok
          );
          setBersediaDirujuk(
            data.personSekolahWithPopulate.pemeriksaanSekolah.bersediaDirujuk
          );
          setNoTelMuridKotak(
            data.personSekolahWithPopulate.pemeriksaanSekolah.noTelMuridKotak
          );
          setKesSelesai(
            data.personSekolahWithPopulate.pemeriksaanSekolah.kesSelesai
          );
          setKesSelesaiIcdas(
            data.personSekolahWithPopulate.pemeriksaanSekolah.kesSelesaiIcdas
          );
          // datepicker issue
          setTarikhPemeriksaanSemasaDP(
            new Date(
              data.personSekolahWithPopulate.pemeriksaanSekolah.tarikhPemeriksaanSemasa
            )
          );

          //length of createdSalahreten
          const lengthOfCreatedSalahreten =
            data.personSekolahWithPopulate.pemeriksaanSekolah.createdSalahreten
              .length;
          setRetenSalahLength(lengthOfCreatedSalahreten);

          // fetch from createdSalahreten[0].dataRetenSalah
          if (lengthOfCreatedSalahreten > 0) {
            const dataRetenSalah =
              data.personSekolahWithPopulate.pemeriksaanSekolah
                .createdSalahreten[0].dataRetenSalah;
            //set all dataRetenSalah to setPilihanData
            setPilihanDataSalah(dataRetenSalah);
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        // toast.error(
        //   'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: user-form-sekolah-pemeriksaan-fetchSinglePersonSekolah'
        // );
      }
    };
    fetchSinglePersonSekolah();
  }, []);

  let isDisabled = false;
  if (singlePersonSekolah.statusRawatan !== 'belum mula') {
    isDisabled = true;
  }

  let disableSalah = false;
  if (retenSalahLength > 0 && salahReten !== 'pemeriksaan-salah') {
    disableSalah = true;
  } else if (retenSalahLength > 0 && salahReten === 'pemeriksaan-salah') {
    disableSalah = true;
  } else if (retenSalahLength === 0 && salahReten !== 'pemeriksaan-salah') {
    disableSalah = true;
  } else if (retenSalahLength === 0 && salahReten === 'pemeriksaan-salah') {
    disableSalah = false;
  }

  const handleSubmit = async (e) => {
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
          `/api/v1/sekolah/pemeriksaan/ubah/${pemeriksaanSekolahId}?personSekolahId=${personSekolahId}`,
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
          pending: 'Mengemaskini...',
          success: 'Pemeriksaan pelajar berjaya dikemaskini',
          error: 'Pemeriksaan pelajar gagal dikemaskini',
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
    <ConfirmCheck
      callbackFx={handleSubmit}
      data={confirmData}
      salahReten={salahReten}
    >
      {(confirm) => (
        <>
          <div className='h-full p-1 px-2 md:px-10 grid grid-rows-[1fr_7fr] gap-2 pb-2'>
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
                        <h2 className='font-semibold'>BANGSA :</h2>
                        <p className='ml-1'>{singlePersonSekolah.keturunan}</p>
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
                  <p className='ml-3 text-xl font-semibold'>Pemeriksaan</p>
                </span>
                <section className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 mb-3 w-full col-span-2'>
                  <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='flex flex-row items-center pl-5 font-bold col-span-2'>
                      Kedatangan<span className='text-user6'>*</span>
                    </h4>
                    {/* <div className='grid grid-rows-2'>
                      <div className='flex items-center flex-row pl-5'>
                        <input
                          disabled={isDisabled}
                          type='radio'
                          name='enggan-tidak-hadir-pemeriksaan'
                          id='enggan-pemeriksaan'
                          value='enggan-pemeriksaan'
                          checked={
                            engganTidakHadirPemeriksaan === 'enggan-pemeriksaan'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setEngganTidakHadirPemeriksaan(e.target.value);
                            setConfirmData({
                              ...confirmData,
                              engganTidakHadirPemeriksaan: e.target.value,
                            });
                            setModalEnggan(true);
                          }}
                          className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                        />
                        <label
                          htmlFor='enggan-pemeriksaan'
                          className='m-2 text-sm font-m'
                        >
                          Enggan
                        </label>
                        {!isDisabled &&
                        engganTidakHadirPemeriksaan === 'enggan-pemeriksaan' ? (
                          <span
                            className='px-2 py-1 bg-user4 text-userWhite text-xs rounded-full cursor-pointer hover:bg-user2'
                            onClick={() => {
                              setPadamPemeriksaan(true);
                            }}
                          >
                            X
                          </span>
                        ) : null}
                      </div>
                      <div className='flex items-center flex-row pl-5'>
                        <input
                          disabled={isDisabled}
                          type='radio'
                          name='enggan-tidak-hadir-pemeriksaan'
                          id='tidak-hadir-pemeriksaan'
                          value='tidak-hadir-pemeriksaan'
                          checked={
                            engganTidakHadirPemeriksaan ===
                            'tidak-hadir-pemeriksaan'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setEngganTidakHadirPemeriksaan(e.target.value);
                            setConfirmData({
                              ...confirmData,
                              engganTidakHadirPemeriksaan: e.target.value,
                            });
                            setModalTidakHadir(true);
                          }}
                          className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                        />
                        <label
                          htmlFor='tidak-hadir-pemeriksaan'
                          className='m-2 text-sm font-m'
                        >
                          Tidak Hadir
                        </label>
                        {!isDisabled &&
                        engganTidakHadirPemeriksaan ===
                          'tidak-hadir-pemeriksaan' ? (
                          <span
                            className='px-2 py-1 bg-user4 text-userWhite text-xs rounded-full cursor-pointer hover:bg-user2'
                            onClick={() => {
                              setPadamPemeriksaan(true);
                            }}
                          >
                            X
                          </span>
                        ) : null}
                      </div>
                      <div>
                        <div
                          className={` absolute z-30 inset-x-1 lg:inset-x-60 inset-y-7 lg:inset-y-28 bg-userWhite rounded-md pb-5 ${
                            modalEnggan ? 'block' : 'hidden'
                          }`}
                        >
                          <h5 className='bg-user9 text-userWhite font-semibold text-xl h-7 rounded-t-md'>
                            PERHATIAN
                          </h5>
                          <h1 className='font-bold text-xl'>ENGGAN</h1>
                          <p>
                            Murid yang <strong>Enggan</strong> Pemeriksaan
                            sehingga hari terakhir Pasukan Pergigian berada di
                            Sekolah
                          </p>
                          <div className='flex flex-row justify-center mt-2'>
                            <div>
                              <input
                                type='radio'
                                name='ya-tidak-enggan-pemeriksaan'
                                id='ya-enggan-pemeriksaan'
                                value='ya-enggan-pemeriksaan'
                                className='peer hidden'
                                checked={
                                  engganPemeriksaan === 'ya-enggan-pemeriksaan'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setEngganPemeriksaan(e.target.value);
                                  setConfirmData({
                                    ...confirmData,
                                    engganPemeriksaan: e.target.value,
                                  });
                                }}
                              />
                              <label
                                htmlFor='ya-enggan-pemeriksaan'
                                className='text-sm peer-checked:ring-2 peer-checked:ring-user2 text-userBlack text-opacity-70 py-2 px-7 bg-admin5 m-3 rounded-md cursor-pointer focus:outline-none peer-checked:border-none'
                              >
                                Ya
                              </label>
                            </div>
                            <div>
                              <input
                                type='radio'
                                name='ya-tidak-enggan-pemeriksaan'
                                id='tidak-enggan-pemeriksaan'
                                value='tidak-enggan-pemeriksaan'
                                className='peer hidden'
                                checked={
                                  engganPemeriksaan ===
                                  'tidak-enggan-pemeriksaan'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setEngganPemeriksaan(e.target.value);
                                  setConfirmData({
                                    ...confirmData,
                                    engganPemeriksaan: e.target.value,
                                  });
                                  setModalEnggan(false);
                                  setEngganTidakHadirPemeriksaan('');
                                }}
                              />
                              <label
                                htmlFor='tidak-enggan-pemeriksaan'
                                className='text-sm peer-checked:ring-2 peer-checked:ring-user2 text-userBlack text-opacity-70 py-2 px-5 bg-admin5 m-3 rounded-md cursor-pointer focus:outline-none peer-checked:border-none'
                              >
                                Tidak
                              </label>
                            </div>
                          </div>
                          {engganPemeriksaan === 'ya-enggan-pemeriksaan' ? (
                            <p className='mt-2'>
                              Adakah murid <strong>DIBERI</strong> kebenaran
                              rawatan daripada ibu bapa/penjaga?
                            </p>
                          ) : null}
                          {engganPemeriksaan === 'ya-enggan-pemeriksaan' ? (
                            <div className='flex flex-row justify-center mt-2'>
                              <div>
                                <input
                                  type='radio'
                                  name='ya-tidak-kebenaran-pemeriksaan'
                                  id='ya-kebenaran-pemeriksaan'
                                  value='ya-kebenaran-pemeriksaan'
                                  className='peer hidden'
                                  checked={
                                    kebenaranPemeriksaan ===
                                    'ya-kebenaran-pemeriksaan'
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    setKebenaranPemeriksaan(e.target.value);
                                    setConfirmData({
                                      ...confirmData,
                                      kebenaranPemeriksaan: e.target.value,
                                    });
                                    setModalEnggan(false);
                                  }}
                                />
                                <label
                                  htmlFor='ya-kebenaran-pemeriksaan'
                                  className='text-sm peer-checked:ring-2 peer-checked:ring-user2 text-userBlack text-opacity-70 py-2 px-7 bg-admin5 m-3 rounded-md cursor-pointer focus:outline-none peer-checked:border-none'
                                >
                                  Ya
                                </label>
                              </div>
                              <div>
                                <input
                                  type='radio'
                                  name='ya-tidak-kebenaran-pemeriksaan'
                                  id='tidak-kebenaran-pemeriksaan'
                                  value='tidak-kebenaran-pemeriksaan'
                                  className='peer hidden'
                                  checked={
                                    kebenaranPemeriksaan ===
                                    'tidak-kebenaran-pemeriksaan'
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    setKebenaranPemeriksaan(e.target.value);
                                    setConfirmData({
                                      ...confirmData,
                                      kebenaranPemeriksaan: e.target.value,
                                    });
                                    setModalEnggan(false);
                                  }}
                                />
                                <label
                                  htmlFor='tidak-kebenaran-pemeriksaan'
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
                            Murid yang TIDAK HADIR Pemeriksaan sehingga hari
                            terakhir Pasukan Pergigian berada di Sekolah
                          </p>
                          <div className='flex flex-row justify-center mt-2'>
                            <div>
                              <input
                                type='radio'
                                name='ya-tidak-kehadiran-pemeriksaan'
                                id='ya-kehadiran-pemeriksaan'
                                value='ya-kehadiran-pemeriksaan'
                                className='peer hidden'
                                checked={
                                  tidakHadirPemeriksaan ===
                                  'ya-kehadiran-pemeriksaan'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setTidakHadirPemeriksaan(e.target.value);
                                  setConfirmData({
                                    ...confirmData,
                                    tidakHadirPemeriksaan: e.target.value,
                                  });
                                  setModalTidakHadir(false);
                                }}
                              />
                              <label
                                htmlFor='ya-kehadiran-pemeriksaan'
                                className='text-sm peer-checked:ring-2 peer-checked:ring-user2 text-userBlack text-opacity-70 py-2 px-7 bg-admin5 m-3 rounded-md cursor-pointer focus:outline-none peer-checked:border-none'
                              >
                                Ya
                              </label>
                            </div>
                            <div>
                              <input
                                type='radio'
                                name='ya-tidak-kehadiran-pemeriksaan'
                                id='tidak-kehadiran-pemeriksaan'
                                value='tidak-kehadiran-pemeriksaan'
                                className='peer hidden'
                                checked={
                                  tidakHadirPemeriksaan ===
                                  'tidak-kehadiran-pemeriksaan'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setTidakHadirPemeriksaan(e.target.value);
                                  setConfirmData({
                                    ...confirmData,
                                    tidakHadirPemeriksaan: e.target.value,
                                  });
                                  setModalTidakHadir(false);
                                  setEngganTidakHadirPemeriksaan('');
                                }}
                              />
                              <label
                                htmlFor='tidak-kehadiran-pemeriksaan'
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
                    </div> */}
                    {tidakHadirPemeriksaan === 'ya-kehadiran-pemeriksaan' ||
                    engganPemeriksaan === 'ya-enggan-pemeriksaan' ? (
                      <div>
                        <p className='flex text-left flex-row pl-4 p-1 text-sm'>
                          {engganPemeriksaan === 'ya-enggan-pemeriksaan' ? (
                            <p className='normal-case'>
                              {kebenaranPemeriksaan ===
                              'ya-kebenaran-pemeriksaan' ? (
                                <p>
                                  Enggan pemeriksaan
                                  <span className='text-user7 font-bold mx-1'>
                                    DENGAN
                                  </span>
                                  kebenaran rawatan daripada ibu bapa/penjaga
                                </p>
                              ) : (
                                <p>
                                  Enggan pemeriksaan
                                  <span className='text-user6 font-bold mx-1'>
                                    TANPA
                                  </span>
                                  kebenaran rawatan daripada ibu bapa/penjaga
                                </p>
                              )}
                            </p>
                          ) : null}
                          {tidakHadirPemeriksaan ===
                          'ya-kehadiran-pemeriksaan' ? (
                            <p>
                              Murid <strong>TIDAK HADIR</strong> Pemeriksaan
                            </p>
                          ) : null}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className='flex items-center flex-row pl-4 p-1 text-m font-m '>
                          tarikh pemeriksaan:
                          <span className='text-user6'>*</span>
                        </p>
                        <TarikhPemeriksaanSemasa />
                      </div>
                    )}
                    {/* <div
                      className={`${
                        engganKedatanganPendaftaran ||
                        tidakHadirKedatanganPendaftaran ||
                        'hidden'
                      } outline outline-1 outline-userBlack grid grid-rows-3 col-start-2`}
                    >
                      <h4 className=' font-bold flex items-center flex-row px-2 text-clip'>
                        Pemeriksaan<span className='text-user6'>*</span>
                      </h4>
                      <div className='flex items-center flex-row px-2'>
                        <input
                          disabled={isDisabled}
                          required={
                            engganKedatanganPendaftaran ||
                            tidakHadirKedatanganPendaftaran
                              ? true
                              : false
                          }
                          type='radio'
                          name='pemeriksaan'
                          id='ada-pemeriksaan'
                          value='ada-pemeriksaan'
                          checked={
                            adaTiadaPemeriksaanPendaftaran === 'ada-pemeriksaan'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setAdaTiadaPemeriksaanPendaftaran(e.target.value);
                            setConfirmData({
                              ...confirmData,
                              adaTiadaPemeriksaanPendaftaran: e.target.value,
                            });
                          }}
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='ada-pemeriksaan'
                          className='m-2 text-sm font-m'
                        >
                          Ada
                        </label>
                      </div>
                      <div className='flex items-center flex-row px-2'>
                        <input
                          disabled={isDisabled}
                          required={
                            engganKedatanganPendaftaran ||
                            tidakHadirKedatanganPendaftaran
                              ? true
                              : false
                          }
                          type='radio'
                          name='pemeriksaan'
                          id='tiada-pemeriksaan'
                          value='tiada-pemeriksaan'
                          checked={
                            adaTiadaPemeriksaanPendaftaran ===
                            'tiada-pemeriksaan'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setAdaTiadaPemeriksaanPendaftaran(e.target.value);
                            setConfirmData({
                              ...confirmData,
                              adaTiadaPemeriksaanPendaftaran: e.target.value,
                            });
                          }}
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='tiada-pemeriksaan'
                          className='m-2 text-sm font-m'
                        >
                          Tiada
                        </label>
                      </div>
                    </div> */}
                  </article>
                  {tidakHadirPemeriksaan === 'ya-kehadiran-pemeriksaan' ||
                  engganPemeriksaan === 'ya-enggan-pemeriksaan' ? null : (
                    <article className='grid grid-cols-2 auto-rows-min border border-userBlack pl-3 p-2 rounded-md '>
                      <h4 className='font-bold flex flex-row pl-5 col-span-2 hover:cursor-pointer'>
                        Cleft Lip/Palate
                      </h4>
                      <div className='grid grid-cols-2'>
                        <div className='grid grid-rows-2  pl-5 pt-1'>
                          <div
                            className={`${
                              pilihanDataSalah.adaCleftLipCBox &&
                              'bg-user9 bg-opacity-20'
                            } flex items-center flex-row justify-center `}
                          >
                            <input
                              disabled={isDisabled}
                              type='checkbox'
                              name='ada-cleft-lip'
                              id='ada-cleft-lip'
                              checked={adaCleftLip}
                              onChange={() => {
                                setAdaCleftLip(!adaCleftLip);
                                setConfirmData({
                                  ...confirmData,
                                  adaCleftLip: !adaCleftLip,
                                });
                              }}
                              className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                            />
                            <label
                              htmlFor='ada-cleft-lip'
                              className='mx-2 text-sm font-m'
                            >
                              Ada
                            </label>
                            <div className='relative'>
                              <input
                                disabled={disableSalah}
                                type='checkbox'
                                name='ada-cleft-lip-reten-salah-cbox'
                                id='ada-cleft-lip-reten-salah-cbox'
                                checked={pilihanDataSalah.adaCleftLipCBox}
                                onChange={() => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    adaCleftLipCBox:
                                      !pilihanDataSalah.adaCleftLipCBox,
                                    adaCleftLip: !adaCleftLip,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    adaCleftLipCBox:
                                      !pilihanDataSalah.adaCleftLipCBox,
                                    adaCleftLip: !adaCleftLip,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      adaCleftLipCBox:
                                        !pilihanDataSalah.adaCleftLipCBox,
                                      adaCleftLip: !adaCleftLip,
                                    },
                                  });
                                }}
                                className='peer hidden'
                              />
                              <label
                                htmlFor='ada-cleft-lip-reten-salah-cbox'
                                className=' text-user9 h-6 w-6 rounded-full flex items-center justify-center cursor-pointer'
                              >
                                {pilihanDataSalah.adaCleftLipCBox === true ? (
                                  <FaTimes className='text-2xl' />
                                ) : (
                                  <FaRegHandPointLeft className='text-2xl' />
                                )}
                              </label>
                            </div>
                          </div>
                          {pilihanDataSalah.adaCleftLipCBox === true && (
                            <div className='flex items-center flex-row justify-center bg-user11 bg-opacity-50'>
                              <input
                                disabled
                                type='checkbox'
                                name='ada-cleft-lip-reten-salah'
                                id='ada-cleft-lip-reten-salah'
                                checked={pilihanDataSalah.adaCleftLip}
                                className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                              />
                              <label
                                htmlFor='ada-cleft-lip-reten-salah'
                                className='mx-2 text-sm font-m'
                              >
                                Ada
                              </label>
                              <span className='text-kaunter4'>
                                <FaCheck className='text-2xl' />
                              </span>
                            </div>
                          )}
                        </div>
                        <div className='grid grid-rows-2  pl-5 pt-1'>
                          <div
                            className={`${
                              pilihanDataSalah.rujukCleftLipCBox &&
                              'bg-user9 bg-opacity-20'
                            } flex items-center flex-row justify-center `}
                          >
                            <input
                              disabled={isDisabled}
                              type='checkbox'
                              name='rujuk-cleft-lip-palate'
                              id='rujuk-cleft-lip-palate'
                              checked={rujukCleftLip}
                              onChange={() => {
                                setRujukCleftLip(!rujukCleftLip);
                                setConfirmData({
                                  ...confirmData,
                                  rujukCleftLip: !rujukCleftLip,
                                });
                              }}
                              className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                            />
                            <label
                              htmlFor='rujuk-cleft-lip-palate'
                              className='mx-2 text-sm font-m'
                            >
                              Rujuk
                            </label>
                            <div className='relative'>
                              <input
                                disabled={disableSalah}
                                type='checkbox'
                                name='rujuk-cleft-lip-reten-salah-cbox'
                                id='rujuk-cleft-lip-reten-salah-cbox'
                                checked={pilihanDataSalah.rujukCleftLipCBox}
                                onChange={() => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    rujukCleftLipCBox:
                                      !pilihanDataSalah.rujukCleftLipCBox,
                                    rujukCleftLip: !rujukCleftLip,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    rujukCleftLipCBox:
                                      !pilihanDataSalah.rujukCleftLipCBox,
                                    rujukCleftLip: !rujukCleftLip,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      rujukCleftLipCBox:
                                        !pilihanDataSalah.rujukCleftLipCBox,
                                      rujukCleftLip: !rujukCleftLip,
                                    },
                                  });
                                }}
                                className='peer hidden'
                              />
                              <label
                                htmlFor='rujuk-cleft-lip-reten-salah-cbox'
                                className=' text-user9 h-6 w-6 rounded-full flex items-center justify-center cursor-pointer'
                              >
                                {pilihanDataSalah.rujukCleftLipCBox === true ? (
                                  <FaTimes className='text-2xl' />
                                ) : (
                                  <FaRegHandPointLeft className='text-2xl' />
                                )}
                              </label>
                            </div>
                          </div>
                          {pilihanDataSalah.rujukCleftLipCBox === true && (
                            <div className='flex items-center flex-row justify-center bg-user11 bg-opacity-50'>
                              <input
                                disabled
                                type='checkbox'
                                name='rujuk-cleft-lip-reten-salah'
                                id='rujuk-cleft-lip-reten-salah'
                                checked={pilihanDataSalah.rujukCleftLip}
                                className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                              />
                              <label
                                htmlFor='rujuk-cleft-lip-reten-salah'
                                className='mx-2 text-sm font-m'
                              >
                                Rujuk
                              </label>
                              <span className='text-kaunter4'>
                                <FaCheck className='text-2xl' />
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  )}
                  {/* <article className='grid grid-cols-2 gap-2 auto-rows-min border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                      Penyampaian Perkhidmatan Sekolah
                    </h4>
                    <div className='flex flex-row items-center pl-5 col-span-2'>
                      <select
                        disabled={isDisabled}
                        required
                        name='statik-bergerak'
                        id='statik-bergerak'
                        value={statikBergerak}
                        onChange={(e) => {
                          setStatikBergerak(e.target.value);
                          setConfirmData({
                            ...confirmData,
                            statikBergerak: e.target.value,
                          });
                        }}
                        className='appearance-none w-60 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                      >
                        <option value=''>Sila Pilih</option>
                        <option value='klinik-pergigian-statik'>
                          Klinik Pergigian Statik
                        </option>
                        <option value='pasukan-pergigian-bergerak'>
                          Pasukan / Klinik Pergigian Bergerak
                        </option>
                      </select>
                      <span className='text-user6'>*</span>
                    </div>
                    <div className='flex flex-row items-center pl-5'>
                      <input
                        disabled={isDisabled}
                        type='checkbox'
                        name='kp-bergerak'
                        id='kp-bergerak'
                        checked={kpBergerak}
                        onChange={() => {
                          setKpBergerak(!kpBergerak);
                          setConfirmData({
                            ...confirmData,
                            kpBergerak: !kpBergerak,
                          });
                        }}
                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                      />
                      <label
                        htmlFor='kp-bergerak'
                        className='ml-2 text-sm font-m'
                      >
                        KP Bergerak
                      </label>
                    </div>
                    <div
                      className={`${
                        !kpBergerak && 'hidden'
                      } flex flex-row items-center pl-5`}
                    >
                      <select
                        disabled={isDisabled}
                        required={kpBergerak && true}
                        name='plate-no'
                        id='plate-no'
                        value={plateNo}
                        onChange={(e) => {
                          setPlateNo(e.target.value);
                          setConfirmData({
                            ...confirmData,
                            plateNo: e.target.value,
                          });
                        }}
                        className='appearance-none w-28 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                      >
                        <option value=''>Plate No</option>
                        <option value='1'>1</option>
                      </select>
                      {kpBergerak && <span className='text-user6'>*</span>}
                    </div>
                  </article> */}
                </section>
                {tidakHadirPemeriksaan === 'ya-kehadiran-pemeriksaan' ||
                engganPemeriksaan === 'ya-enggan-pemeriksaan' ? null : (
                  <section className='grid grid-cols-1 lg:grid-cols-2 gap-2 mt-3 mb-3 w-full  '>
                    <article className='border border-userBlack pl-3 p-2 rounded-md'>
                      <h4 className='font-bold flex flex-row pl-5'>
                        Status dentur
                      </h4>
                      <div className='grid grid-cols-1 lg:grid-cols-2 gap-2 auto-rows-min'>
                        <article className='grid grid-cols-1 auto-rows-min border border-userBlack pl-3 p-2 rounded-md'>
                          <div
                            className={`${
                              pilihanDataSalah.yaTidakSediaAdaStatusDentureCBox &&
                              'bg-user9 bg-opacity-20'
                            } flex flex-row items-center pl-5 relative`}
                          >
                            <h4 className='font-semibold mr-2 flex items-center'>
                              Sedia Ada?
                            </h4>
                            <div className='flex items-center justify-center'>
                              <input
                                disabled={isDisabled}
                                type='radio'
                                name='sedia-ada-status-denture'
                                id='ya-sedia-ada-status-denture'
                                value='ya-sedia-ada-status-denture'
                                checked={
                                  yaTidakSediaAdaStatusDenture ===
                                  'ya-sedia-ada-status-denture'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setYaTidakSediaAdaStatusDenture(
                                    e.target.value
                                  );
                                  setConfirmData({
                                    ...confirmData,
                                    yaTidakSediaAdaStatusDenture:
                                      e.target.value,
                                  });
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='ya-sedia-ada-status-denture'
                                className='m-2 text-sm font-m'
                              >
                                Ya
                              </label>
                              <input
                                disabled={isDisabled}
                                type='radio'
                                name='sedia-ada-status-denture'
                                id='tidak-sedia-ada-status-denture'
                                value='tidak-sedia-ada-status-denture'
                                checked={
                                  yaTidakSediaAdaStatusDenture ===
                                  'tidak-sedia-ada-status-denture'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setYaTidakSediaAdaStatusDenture(
                                    e.target.value
                                  );
                                  setConfirmData({
                                    ...confirmData,
                                    yaTidakSediaAdaStatusDenture:
                                      e.target.value,
                                  });
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='tidak-sedia-ada-status-denture'
                                className='m-2 text-sm font-m'
                              >
                                Tidak
                              </label>
                              <div className='relative'>
                                <input
                                  disabled={disableSalah}
                                  type='checkbox'
                                  name='separa-penuh-atas-sedia-ada-denture-reten-salah-cbox'
                                  id='separa-atas-sedia-ada-denture-reten-salah-cbox'
                                  checked={
                                    pilihanDataSalah.yaTidakSediaAdaStatusDentureCBox
                                  }
                                  onChange={() => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      yaTidakSediaAdaStatusDentureCBox:
                                        !pilihanDataSalah.yaTidakSediaAdaStatusDentureCBox,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      yaTidakSediaAdaStatusDentureCBox:
                                        !pilihanDataSalah.yaTidakSediaAdaStatusDentureCBox,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        yaTidakSediaAdaStatusDentureCBox:
                                          !pilihanDataSalah.yaTidakSediaAdaStatusDentureCBox,
                                      },
                                    });
                                  }}
                                  className='peer hidden'
                                />
                                <label
                                  htmlFor='separa-atas-sedia-ada-denture-reten-salah-cbox'
                                  className={` ${
                                    disableSalah === true
                                      ? 'pointer-events-none'
                                      : 'cursor-pointer '
                                  } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                >
                                  {pilihanDataSalah.yaTidakSediaAdaStatusDentureCBox ===
                                  true ? (
                                    <FaTimes
                                      className='text-2xl'
                                      onClick={() => {
                                        setPilihanDataSalah({
                                          ...pilihanDataSalah,
                                          yaTidakSediaAdaStatusDenture: '',
                                        });
                                        setDataRetenSalah({
                                          ...dataRetenSalah,
                                          yaTidakSediaAdaStatusDenture: '',
                                        });
                                        setConfirmData({
                                          ...confirmData,
                                          pilihanDataSalah: {
                                            ...pilihanDataSalah,
                                            yaTidakSediaAdaStatusDenture: '',
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
                          </div>
                          {pilihanDataSalah.yaTidakSediaAdaStatusDentureCBox ===
                            true && (
                            <div className='flex items-center justify-center bg-user11 bg-opacity-50 mb-1'>
                              <input
                                disabled={
                                  yaTidakSediaAdaStatusDenture ===
                                  'ya-sedia-ada-status-denture'
                                    ? true
                                    : disableSalah === true
                                    ? true
                                    : false
                                }
                                type='radio'
                                name='sedia-ada-status-denture-reten-salah'
                                id='ya-sedia-ada-status-denture-reten-salah'
                                value='ya-sedia-ada-status-denture-reten-salah'
                                checked={
                                  pilihanDataSalah.yaTidakSediaAdaStatusDenture ===
                                  'ya-sedia-ada-status-denture-reten-salah'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    yaTidakSediaAdaStatusDenture:
                                      e.target.value,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    yaTidakSediaAdaStatusDenture:
                                      e.target.value,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      yaTidakSediaAdaStatusDenture:
                                        e.target.value,
                                    },
                                  });
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='ya-sedia-ada-status-denture-reten-salah'
                                className='m-2 text-sm font-m'
                              >
                                Ya
                              </label>
                              <input
                                disabled={
                                  yaTidakSediaAdaStatusDenture ===
                                  'tidak-sedia-ada-status-denture'
                                    ? true
                                    : disableSalah === true
                                    ? true
                                    : false
                                }
                                type='radio'
                                name='sedia-ada-status-denture-reten-salah'
                                id='tidak-sedia-ada-status-denture-reten-salah'
                                value='tidak-sedia-ada-status-denture-reten-salah'
                                checked={
                                  pilihanDataSalah.yaTidakSediaAdaStatusDenture ===
                                  'tidak-sedia-ada-status-denture-reten-salah'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    yaTidakSediaAdaStatusDenture:
                                      e.target.value,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    yaTidakSediaAdaStatusDenture:
                                      e.target.value,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      yaTidakSediaAdaStatusDenture:
                                        e.target.value,
                                    },
                                  });
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='tidak-sedia-ada-status-denture-reten-salah'
                                className='m-2 text-sm font-m'
                              >
                                Tidak
                              </label>
                              <input
                                disabled={
                                  yaTidakSediaAdaStatusDenture === ''
                                    ? true
                                    : disableSalah === true
                                    ? true
                                    : false
                                }
                                type='radio'
                                name='sedia-ada-status-denture-reten-salah'
                                id='tiada-sedia-ada-status-denture-reten-salah'
                                value='tiada-sedia-ada-status-denture-reten-salah'
                                checked={
                                  pilihanDataSalah.yaTidakSediaAdaStatusDenture ===
                                  'tiada-sedia-ada-status-denture-reten-salah'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    yaTidakSediaAdaStatusDenture:
                                      e.target.value,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    yaTidakSediaAdaStatusDenture:
                                      e.target.value,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      yaTidakSediaAdaStatusDenture:
                                        e.target.value,
                                    },
                                  });
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='tiada-sedia-ada-status-denture-reten-salah'
                                className='m-2 text-sm font-m'
                              >
                                Tiada
                              </label>
                              <span
                                className={` ${
                                  disableSalah === true
                                    ? 'pointer-events-none'
                                    : 'cursor-pointer '
                                } text-kaunter4`}
                                onClick={() => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    yaTidakSediaAdaStatusDenture: '',
                                    yaTidakSediaAdaStatusDentureCBox: false,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    yaTidakSediaAdaStatusDenture: '',
                                    yaTidakSediaAdaStatusDentureCBox: false,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      yaTidakSediaAdaStatusDenture: '',
                                      yaTidakSediaAdaStatusDentureCBox: false,
                                    },
                                  });
                                }}
                              >
                                <FaCheck className='text-xl' />
                              </span>
                            </div>
                          )}
                          <div
                            className={`${
                              pilihanDataSalah.separaPenuhAtasSediaAdaDentureCBox &&
                              'bg-user9 bg-opacity-20'
                            } items-center grid grid-cols-[2fr_2fr_2fr_1fr]`}
                          >
                            <label
                              htmlFor='atas-sedia-ada-denture'
                              className='m-2 text-sm font-m'
                            >
                              Atas
                            </label>
                            <div className='flex items-center justify-center'>
                              <input
                                disabled={isDisabled}
                                type='radio'
                                name='separa-penuh-atas-sedia-ada-denture'
                                id='separa-atas-sedia-ada-denture'
                                value='separa-atas-sedia-ada-denture'
                                checked={
                                  separaPenuhAtasSediaAdaDenture ===
                                  'separa-atas-sedia-ada-denture'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setSeparaPenuhAtasSediaAdaDenture(
                                    e.target.value
                                  );
                                  setConfirmData({
                                    ...confirmData,
                                    separaPenuhAtasSediaAdaDenture:
                                      e.target.value,
                                  });
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='separa-atas-sedia-ada-denture'
                                className='m-2 text-sm font-m'
                              >
                                Separa
                              </label>
                            </div>
                            <div className='flex items-center justify-center'>
                              <input
                                disabled={isDisabled}
                                type='radio'
                                name='separa-penuh-atas-sedia-ada-denture'
                                id='penuh-atas-sedia-ada-denture'
                                value='penuh-atas-sedia-ada-denture'
                                checked={
                                  separaPenuhAtasSediaAdaDenture ===
                                  'penuh-atas-sedia-ada-denture'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setSeparaPenuhAtasSediaAdaDenture(
                                    e.target.value
                                  );
                                  setConfirmData({
                                    ...confirmData,
                                    separaPenuhAtasSediaAdaDenture:
                                      e.target.value,
                                  });
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='penuh-atas-sedia-ada-denture'
                                className='m-2 text-sm font-m'
                              >
                                Penuh
                              </label>
                            </div>
                            <div className='relative'>
                              <input
                                disabled={disableSalah}
                                type='checkbox'
                                name='separa-penuh-atas-sedia-ada-denture-reten-salah'
                                id='separa-penuh-atas-sedia-ada-denture-reten-salah'
                                checked={
                                  pilihanDataSalah.separaPenuhAtasSediaAdaDentureCBox
                                }
                                onChange={() => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    separaPenuhAtasSediaAdaDentureCBox:
                                      !pilihanDataSalah.separaPenuhAtasSediaAdaDentureCBox,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    separaPenuhAtasSediaAdaDentureCBox:
                                      !dataRetenSalah.separaPenuhAtasSediaAdaDentureCBox,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      separaPenuhAtasSediaAdaDentureCBox:
                                        !pilihanDataSalah.separaPenuhAtasSediaAdaDentureCBox,
                                    },
                                  });
                                }}
                                className='peer hidden'
                              />
                              <label
                                htmlFor='separa-penuh-atas-sedia-ada-denture-reten-salah'
                                className={` ${
                                  disableSalah === true
                                    ? 'pointer-events-none'
                                    : 'cursor-pointer '
                                } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                              >
                                {pilihanDataSalah.separaPenuhAtasSediaAdaDentureCBox ===
                                true ? (
                                  <FaTimes
                                    className='text-2xl'
                                    onClick={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        separaPenuhAtasSediaAdaDenture: '',
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        separaPenuhAtasSediaAdaDenture: '',
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          separaPenuhAtasSediaAdaDenture: '',
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
                          {pilihanDataSalah.separaPenuhAtasSediaAdaDentureCBox ===
                            true && (
                            <div className='items-center grid grid-cols-[2fr_2fr_2fr_1fr] bg-user11 bg-opacity-50 mb-1'>
                              <div className='flex items-center justify-center'>
                                <input
                                  disabled={
                                    separaPenuhAtasSediaAdaDenture ===
                                    'separa-atas-sedia-ada-denture'
                                      ? true
                                      : disableSalah === true
                                      ? true
                                      : false
                                  }
                                  type='radio'
                                  name='separa-penuh-atas-sedia-ada-denture-reten-salah'
                                  id='separa-atas-sedia-ada-denture-reten-salah'
                                  value='separa-atas-sedia-ada-denture-reten-salah'
                                  checked={
                                    pilihanDataSalah.separaPenuhAtasSediaAdaDenture ===
                                    'separa-atas-sedia-ada-denture-reten-salah'
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      separaPenuhAtasSediaAdaDenture:
                                        e.target.value,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      separaPenuhAtasSediaAdaDenture:
                                        e.target.value,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        separaPenuhAtasSediaAdaDenture:
                                          e.target.value,
                                      },
                                    });
                                  }}
                                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                                />
                                <label
                                  htmlFor='separa-atas-sedia-ada-denture-reten-salah'
                                  className='m-2 text-sm font-m'
                                >
                                  Separa
                                </label>
                              </div>
                              <div className='flex items-center justify-center'>
                                <input
                                  disabled={
                                    separaPenuhAtasSediaAdaDenture ===
                                    'penuh-atas-sedia-ada-denture'
                                      ? true
                                      : disableSalah === true
                                      ? true
                                      : disableSalah === true
                                      ? true
                                      : false
                                  }
                                  type='radio'
                                  name='separa-penuh-atas-sedia-ada-denture-reten-salah'
                                  id='penuh-atas-sedia-ada-denture-reten-salah'
                                  value='penuh-atas-sedia-ada-denture-reten-salah'
                                  checked={
                                    pilihanDataSalah.separaPenuhAtasSediaAdaDenture ===
                                    'penuh-atas-sedia-ada-denture-reten-salah'
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      separaPenuhAtasSediaAdaDenture:
                                        e.target.value,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      separaPenuhAtasSediaAdaDenture:
                                        e.target.value,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        separaPenuhAtasSediaAdaDenture:
                                          e.target.value,
                                      },
                                    });
                                  }}
                                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                                />
                                <label
                                  htmlFor='penuh-atas-sedia-ada-denture-reten-salah'
                                  className='m-2 text-sm font-m'
                                >
                                  Penuh
                                </label>
                              </div>
                              <div className='flex items-center justify-center'>
                                <input
                                  disabled={
                                    separaPenuhAtasSediaAdaDenture === ''
                                      ? true
                                      : disableSalah === true
                                      ? true
                                      : false
                                  }
                                  type='radio'
                                  name='separa-penuh-atas-sedia-ada-denture-reten-salah'
                                  id='tiada-atas-sedia-ada-denture-reten-salah'
                                  value='tiada-atas-sedia-ada-denture-reten-salah'
                                  checked={
                                    pilihanDataSalah.separaPenuhAtasSediaAdaDenture ===
                                    'tiada-atas-sedia-ada-denture-reten-salah'
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      separaPenuhAtasSediaAdaDenture:
                                        e.target.value,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      separaPenuhAtasSediaAdaDenture:
                                        e.target.value,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        separaPenuhAtasSediaAdaDenture:
                                          e.target.value,
                                      },
                                    });
                                  }}
                                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                                />
                                <label
                                  htmlFor='tiada-atas-sedia-ada-denture-reten-salah'
                                  className='m-2 text-sm font-m'
                                >
                                  Tiada
                                </label>
                              </div>
                              <span
                                className={` ${
                                  disableSalah === true
                                    ? 'pointer-events-none'
                                    : 'cursor-pointer '
                                } text-kaunter4`}
                                onClick={() => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    separaPenuhAtasSediaAdaDenture: '',
                                    separaPenuhAtasSediaAdaDentureCBox: false,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    separaPenuhAtasSediaAdaDenture: '',
                                    separaPenuhAtasSediaAdaDentureCBox: false,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      separaPenuhAtasSediaAdaDenture: '',
                                      separaPenuhAtasSediaAdaDentureCBox: false,
                                    },
                                  });
                                }}
                              >
                                <FaCheck className='text-xl' />
                              </span>
                            </div>
                          )}
                          <div
                            className={` ${
                              pilihanDataSalah.separaPenuhBawahSediaAdaDentureCBox &&
                              'bg-user9 bg-opacity-20'
                            } items-center grid grid-cols-[2fr_2fr_2fr_1fr] `}
                          >
                            <label
                              htmlFor='bawah-sedia-ada-denture'
                              className='m-2 text-sm font-m'
                            >
                              Bawah
                            </label>
                            <div className='flex items-center justify-center'>
                              <input
                                disabled={isDisabled}
                                type='radio'
                                name='separa-penuh-bawah-sedia-ada-denture'
                                id='separa-bawah-sedia-ada-denture'
                                value='separa-bawah-sedia-ada-denture'
                                checked={
                                  separaPenuhBawahSediaAdaDenture ===
                                  'separa-bawah-sedia-ada-denture'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setSeparaPenuhBawahSediaAdaDenture(
                                    e.target.value
                                  );
                                  setConfirmData({
                                    ...confirmData,
                                    separaPenuhBawahSediaAdaDenture:
                                      e.target.value,
                                  });
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='separa-bawah-sedia-ada-denture'
                                className='m-2 text-sm font-m'
                              >
                                Separa
                              </label>
                            </div>
                            <div className='flex items-center justify-center'>
                              <input
                                disabled={isDisabled}
                                type='radio'
                                name='separa-penuh-bawah-sedia-ada-denture'
                                id='penuh-bawah-sedia-ada-denture'
                                value='penuh-bawah-sedia-ada-denture'
                                checked={
                                  separaPenuhBawahSediaAdaDenture ===
                                  'penuh-bawah-sedia-ada-denture'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setSeparaPenuhBawahSediaAdaDenture(
                                    e.target.value
                                  );
                                  setConfirmData({
                                    ...confirmData,
                                    separaPenuhBawahSediaAdaDenture:
                                      e.target.value,
                                  });
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='penuh-bawah-sedia-ada-denture'
                                className='m-2 text-sm font-m'
                              >
                                Penuh
                              </label>
                            </div>
                            <div className='relative'>
                              <input
                                disabled={disableSalah}
                                type='checkbox'
                                name='bawah-sedia-ada-denture-reten-salah'
                                id='bawah-sedia-ada-denture-reten-salah'
                                checked={
                                  pilihanDataSalah.separaPenuhBawahSediaAdaDentureCBox
                                }
                                onChange={() => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    separaPenuhBawahSediaAdaDentureCBox:
                                      !pilihanDataSalah.separaPenuhBawahSediaAdaDentureCBox,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    separaPenuhBawahSediaAdaDentureCBox:
                                      !pilihanDataSalah.separaPenuhBawahSediaAdaDentureCBox,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      separaPenuhBawahSediaAdaDentureCBox:
                                        !pilihanDataSalah.separaPenuhBawahSediaAdaDentureCBox,
                                    },
                                  });
                                }}
                                className='peer hidden'
                              />
                              <label
                                htmlFor='bawah-sedia-ada-denture-reten-salah'
                                className={` ${
                                  disableSalah === true
                                    ? 'pointer-events-none'
                                    : 'cursor-pointer '
                                } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                              >
                                {pilihanDataSalah.separaPenuhBawahSediaAdaDentureCBox ===
                                true ? (
                                  <FaTimes
                                    className='text-2xl'
                                    onClick={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        separaPenuhBawahSediaAdaDenture: '',
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        separaPenuhBawahSediaAdaDenture: '',
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          separaPenuhBawahSediaAdaDenture: '',
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
                          {pilihanDataSalah.separaPenuhBawahSediaAdaDentureCBox ===
                            true && (
                            <div className='items-center grid grid-cols-[2fr_2fr_2fr_1fr] bg-user11 bg-opacity-50'>
                              <div className='flex items-center justify-center'>
                                <input
                                  disabled={
                                    separaPenuhBawahSediaAdaDenture ===
                                    'separa-bawah-sedia-ada-denture'
                                      ? true
                                      : disableSalah === true
                                      ? true
                                      : false
                                  }
                                  type='radio'
                                  name='separa-penuh-bawah-sedia-ada-denture-reten-salah'
                                  id='separa-bawah-sedia-ada-denture-reten-salah'
                                  value='separa-bawah-sedia-ada-denture-reten-salah'
                                  checked={
                                    pilihanDataSalah.separaPenuhBawahSediaAdaDenture ===
                                    'separa-bawah-sedia-ada-denture-reten-salah'
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      separaPenuhBawahSediaAdaDenture:
                                        e.target.value,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      separaPenuhBawahSediaAdaDenture:
                                        e.target.value,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        separaPenuhBawahSediaAdaDenture:
                                          e.target.value,
                                      },
                                    });
                                  }}
                                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                                />
                                <label
                                  htmlFor='separa-bawah-sedia-ada-denture-reten-salah'
                                  className='m-2 text-sm font-m'
                                >
                                  Separa
                                </label>
                              </div>
                              <div className='flex items-center justify-center'>
                                <input
                                  disabled={
                                    separaPenuhBawahSediaAdaDenture ===
                                    'penuh-bawah-sedia-ada-denture'
                                      ? true
                                      : disableSalah === true
                                      ? true
                                      : false
                                  }
                                  type='radio'
                                  name='separa-penuh-bawah-sedia-ada-denture-reten-salah'
                                  id='penuh-bawah-sedia-ada-denture-reten-salah'
                                  value='penuh-bawah-sedia-ada-denture-reten-salah'
                                  checked={
                                    pilihanDataSalah.separaPenuhBawahSediaAdaDenture ===
                                    'penuh-bawah-sedia-ada-denture-reten-salah'
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      separaPenuhBawahSediaAdaDenture:
                                        e.target.value,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      separaPenuhBawahSediaAdaDenture:
                                        e.target.value,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        separaPenuhBawahSediaAdaDenture:
                                          e.target.value,
                                      },
                                    });
                                  }}
                                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                                />
                                <label
                                  htmlFor='penuh-bawah-sedia-ada-denture-reten-salah'
                                  className='m-2 text-sm font-m'
                                >
                                  Penuh
                                </label>
                              </div>
                              <div className='flex items-center justify-center'>
                                <input
                                  disabled={
                                    separaPenuhBawahSediaAdaDenture === ''
                                      ? true
                                      : disableSalah === true
                                      ? true
                                      : false
                                  }
                                  type='radio'
                                  name='separa-penuh-bawah-sedia-ada-denture-reten-salah'
                                  id='tiada-ada-bawah-sedia-ada-denture-reten-salah'
                                  value='tiada-ada-bawah-sedia-ada-denture-reten-salah'
                                  checked={
                                    pilihanDataSalah.separaPenuhBawahSediaAdaDenture ===
                                    'tiada-ada-bawah-sedia-ada-denture-reten-salah'
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      separaPenuhBawahSediaAdaDenture:
                                        e.target.value,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      separaPenuhBawahSediaAdaDenture:
                                        e.target.value,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        separaPenuhBawahSediaAdaDenture:
                                          e.target.value,
                                      },
                                    });
                                  }}
                                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                                />
                                <label
                                  htmlFor='tiada-ada-bawah-sedia-ada-denture-reten-salah'
                                  className='m-2 text-sm font-m'
                                >
                                  Tiada
                                </label>
                              </div>
                              <span
                                className={` ${
                                  disableSalah === true
                                    ? 'pointer-events-none'
                                    : 'cursor-pointer '
                                } text-kaunter4`}
                                onClick={() => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    separaPenuhBawahSediaAdaDentureCBox: false,
                                    separaPenuhBawahSediaAdaDenture: '',
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    separaPenuhBawahSediaAdaDenture: '',
                                    separaPenuhBawahSediaAdaDentureCBox: false,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      separaPenuhBawahSediaAdaDentureCBox: false,
                                      separaPenuhBawahSediaAdaDenture: '',
                                    },
                                  });
                                }}
                              >
                                <FaCheck className='text-2xl' />
                              </span>
                            </div>
                          )}
                        </article>
                        <article className='grid grid-cols-1 auto-rows-min border border-userBlack pl-3 p-2 rounded-md'>
                          <div
                            className={`${
                              pilihanDataSalah.yaTidakPerluStatusDentureCBox &&
                              'bg-user9 bg-opacity-20'
                            } flex flex-row items-center pl-5`}
                          >
                            <h4 className='font-semibold mr-2 flex items-center'>
                              Perlu
                            </h4>
                            <div className='flex items-center justify-center'>
                              <input
                                disabled={isDisabled}
                                type='radio'
                                name='perlu-status-denture'
                                id='ya-perlu-status-denture'
                                value='ya-perlu-status-denture'
                                checked={
                                  yaTidakPerluStatusDenture ===
                                  'ya-perlu-status-denture'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setYaTidakPerluStatusDenture(e.target.value);
                                  setConfirmData({
                                    ...confirmData,
                                    yaTidakPerluStatusDenture: e.target.value,
                                  });
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='ya-perlu-status-denture'
                                className='m-2 text-sm font-m'
                              >
                                Ya
                              </label>
                              <input
                                disabled={isDisabled}
                                type='radio'
                                name='perlu-status-denture'
                                id='tidak-perlu-status-denture'
                                value='tidak-perlu-status-denture'
                                checked={
                                  yaTidakPerluStatusDenture ===
                                  'tidak-perlu-status-denture'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setYaTidakPerluStatusDenture(e.target.value);
                                  setConfirmData({
                                    ...confirmData,
                                    yaTidakPerluStatusDenture: e.target.value,
                                  });
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='tidak-perlu-status-denture'
                                className='m-2 text-sm font-m'
                              >
                                Tidak
                              </label>
                              <div className='relative'>
                                <input
                                  disabled={disableSalah}
                                  type='checkbox'
                                  name='ya-tidak-perlu-denture-reten-salah-cbox'
                                  id='ya-tidak-perlu-denture-reten-salah-cbox'
                                  checked={
                                    pilihanDataSalah.yaTidakPerluStatusDentureCBox
                                  }
                                  onChange={() => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      yaTidakPerluStatusDentureCBox:
                                        !pilihanDataSalah.yaTidakPerluStatusDentureCBox,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      yaTidakPerluStatusDentureCBox:
                                        !dataRetenSalah.yaTidakPerluStatusDentureCBox,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        yaTidakPerluStatusDentureCBox:
                                          !pilihanDataSalah.yaTidakPerluStatusDentureCBox,
                                      },
                                    });
                                  }}
                                  className='peer hidden'
                                />
                                <label
                                  htmlFor='ya-tidak-perlu-denture-reten-salah-cbox'
                                  className={` ${
                                    disableSalah === true
                                      ? 'pointer-events-none'
                                      : 'cursor-pointer '
                                  } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                >
                                  {pilihanDataSalah.yaTidakPerluStatusDentureCBox ===
                                  true ? (
                                    <FaTimes
                                      className='text-2xl'
                                      onClick={() => {
                                        setPilihanDataSalah({
                                          ...pilihanDataSalah,
                                          yaTidakPerluStatusDenture: '',
                                        });
                                        setDataRetenSalah({
                                          ...dataRetenSalah,
                                          yaTidakPerluStatusDenture: '',
                                        });
                                        setConfirmData({
                                          ...confirmData,
                                          pilihanDataSalah: {
                                            ...pilihanDataSalah,
                                            yaTidakPerluStatusDenture: '',
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
                          </div>
                          {pilihanDataSalah.yaTidakPerluStatusDentureCBox ===
                            true && (
                            <div className='flex items-center justify-center bg-user11 bg-opacity-50 mb-1'>
                              <input
                                disabled={
                                  yaTidakPerluStatusDenture ===
                                  'ya-perlu-status-denture'
                                    ? true
                                    : disableSalah === true
                                    ? true
                                    : false
                                }
                                type='radio'
                                name='perlu-status-denture-reten-salah'
                                id='ya-perlu-status-denture-reten-salah'
                                value='ya-perlu-status-denture-reten-salah'
                                checked={
                                  pilihanDataSalah.yaTidakPerluStatusDenture ===
                                  'ya-perlu-status-denture-reten-salah'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    yaTidakPerluStatusDenture: e.target.value,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    yaTidakPerluStatusDenture: e.target.value,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      yaTidakPerluStatusDenture: e.target.value,
                                    },
                                  });
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='ya-perlu-status-denture-reten-salah'
                                className='m-2 text-sm font-m'
                              >
                                Ya
                              </label>
                              <input
                                disabled={
                                  yaTidakPerluStatusDenture ===
                                  'tidak-perlu-status-denture'
                                    ? true
                                    : disableSalah === true
                                    ? true
                                    : false
                                }
                                type='radio'
                                name='perlu-status-denture-reten-salah'
                                id='tidak-perlu-status-denture-reten-salah'
                                value='tidak-perlu-status-denture-reten-salah'
                                checked={
                                  pilihanDataSalah.yaTidakPerluStatusDenture ===
                                  'tidak-perlu-status-denture-reten-salah'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    yaTidakPerluStatusDenture: e.target.value,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    yaTidakPerluStatusDenture: e.target.value,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      yaTidakPerluStatusDenture: e.target.value,
                                    },
                                  });
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='tidak-perlu-status-denture-reten-salah'
                                className='m-2 text-sm font-m'
                              >
                                Tidak
                              </label>
                              <input
                                disabled={
                                  yaTidakPerluStatusDenture === ''
                                    ? true
                                    : disableSalah === true
                                    ? true
                                    : false
                                }
                                type='radio'
                                name='perlu-status-denture-reten-salah'
                                id='tiada-perlu-status-denture-reten-salah'
                                value='tiada-perlu-status-denture-reten-salah'
                                checked={
                                  pilihanDataSalah.yaTidakPerluStatusDenture ===
                                  'tiada-perlu-status-denture-reten-salah'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    yaTidakPerluStatusDenture: e.target.value,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    yaTidakPerluStatusDenture: e.target.value,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      yaTidakPerluStatusDenture: e.target.value,
                                    },
                                  });
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='tiada-perlu-status-denture-reten-salah'
                                className='m-2 text-sm font-m'
                              >
                                Tiada
                              </label>
                              <span
                                className={` ${
                                  disableSalah === true
                                    ? 'pointer-events-none'
                                    : 'cursor-pointer '
                                } text-kaunter4`}
                                onClick={() => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    yaTidakPerluStatusDenture: '',
                                    yaTidakPerluStatusDentureCBox: false,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    yaTidakPerluStatusDenture: '',
                                    yaTidakPerluStatusDentureCBox: false,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      yaTidakPerluStatusDenture: '',
                                      yaTidakPerluStatusDentureCBox: false,
                                    },
                                  });
                                }}
                              >
                                <FaCheck className='text-xl' />
                              </span>
                            </div>
                          )}
                          <div
                            className={`${
                              pilihanDataSalah.separaPenuhAtasPerluDentureCBox &&
                              'bg-user9 bg-opacity-20'
                            } items-center grid grid-cols-[2fr_2fr_2fr_1fr]`}
                          >
                            <label
                              htmlFor='atas-perlu-denture'
                              className='m-2 text-sm font-m'
                            >
                              Atas
                            </label>
                            <div className='flex items-center justify-center'>
                              <input
                                disabled={isDisabled}
                                type='radio'
                                name='separa-penuh-atas-perlu-denture'
                                id='separa-atas-perlu-denture'
                                value='separa-atas-perlu-denture'
                                checked={
                                  separaPenuhAtasPerluDenture ===
                                  'separa-atas-perlu-denture'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setSeparaPenuhAtasPerluDenture(
                                    e.target.value
                                  );
                                  setConfirmData({
                                    ...confirmData,
                                    separaPenuhAtasPerluDenture: e.target.value,
                                  });
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='separa-atas-perlu-denture'
                                className='m-2 text-sm font-m'
                              >
                                Separa
                              </label>
                            </div>
                            <div className='flex items-center justify-center'>
                              <input
                                disabled={isDisabled}
                                type='radio'
                                name='separa-penuh-atas-perlu-denture'
                                id='penuh-atas-perlu-denture'
                                value='penuh-atas-perlu-denture'
                                checked={
                                  separaPenuhAtasPerluDenture ===
                                  'penuh-atas-perlu-denture'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setSeparaPenuhAtasPerluDenture(
                                    e.target.value
                                  );
                                  setConfirmData({
                                    ...confirmData,
                                    separaPenuhAtasPerluDenture: e.target.value,
                                  });
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='penuh-atas-perlu-denture'
                                className='m-2 text-sm font-m'
                              >
                                Penuh
                              </label>
                            </div>
                            <div className='relative'>
                              <input
                                disabled={disableSalah}
                                type='checkbox'
                                name='separa-penuh-atas-perlu-denture-reten-salah'
                                id='separa-penuh-atas-perlu-denture-reten-salah'
                                checked={
                                  pilihanDataSalah.separaPenuhAtasPerluDentureCBox
                                }
                                onChange={() => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    separaPenuhAtasPerluDentureCBox:
                                      !pilihanDataSalah.separaPenuhAtasPerluDentureCBox,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    separaPenuhAtasPerluDentureCBox:
                                      !dataRetenSalah.separaPenuhAtasPerluDentureCBox,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      separaPenuhAtasPerluDentureCBox:
                                        !pilihanDataSalah.separaPenuhAtasPerluDentureCBox,
                                    },
                                  });
                                }}
                                className='peer hidden'
                              />
                              <label
                                htmlFor='separa-penuh-atas-perlu-denture-reten-salah'
                                className={` ${
                                  disableSalah === true
                                    ? 'pointer-events-none'
                                    : 'cursor-pointer '
                                } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                              >
                                {pilihanDataSalah.separaPenuhAtasPerluDentureCBox ===
                                true ? (
                                  <FaTimes
                                    className='text-2xl'
                                    onClick={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        separaPenuhAtasPerluDenture: '',
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        separaPenuhAtasPerluDenture: '',
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          separaPenuhAtasPerluDenture: '',
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
                          {pilihanDataSalah.separaPenuhAtasPerluDentureCBox ===
                            true && (
                            <div className='items-center grid grid-cols-[2fr_2fr_2fr_1fr] bg-user11 bg-opacity-50 mb-1'>
                              <div className='flex items-center justify-center'>
                                <input
                                  disabled={
                                    separaPenuhAtasPerluDenture ===
                                    'sepada-atas-perlu-denture'
                                      ? true
                                      : disableSalah === true
                                      ? true
                                      : false
                                  }
                                  type='radio'
                                  name='separa-penuh-atas-perlu-denture-reten-salah'
                                  id='separa-atas-perlu-denture-reten-salah'
                                  value='separa-atas-perlu-denture-reten-salah'
                                  checked={
                                    pilihanDataSalah.separaPenuhAtasPerluDenture ===
                                    'separa-atas-perlu-denture-reten-salah'
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      separaPenuhAtasPerluDenture:
                                        e.target.value,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      separaPenuhAtasPerluDenture:
                                        e.target.value,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        separaPenuhAtasPerluDenture:
                                          e.target.value,
                                      },
                                    });
                                  }}
                                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                                />
                                <label
                                  htmlFor='separa-atas-perlu-denture-reten-salah'
                                  className='m-2 text-sm font-m'
                                >
                                  Separa
                                </label>
                              </div>
                              <div className='flex items-center justify-center'>
                                <input
                                  disabled={
                                    separaPenuhAtasPerluDenture ===
                                    'penuh-atas-perlu-denture'
                                      ? true
                                      : disableSalah === true
                                      ? true
                                      : false
                                  }
                                  type='radio'
                                  name='separa-penuh-atas-perlu-denture-reten-salah'
                                  id='penuh-atas-perlu-denture-reten-salah'
                                  value='penuh-atas-perlu-denture-reten-salah'
                                  checked={
                                    pilihanDataSalah.separaPenuhAtasPerluDenture ===
                                    'penuh-atas-perlu-denture-reten-salah'
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      separaPenuhAtasPerluDenture:
                                        e.target.value,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      separaPenuhAtasPerluDenture:
                                        e.target.value,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        separaPenuhAtasPerluDenture:
                                          e.target.value,
                                      },
                                    });
                                  }}
                                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                                />
                                <label
                                  htmlFor='penuh-atas-perlu-denture-reten-salah'
                                  className='m-2 text-sm font-m'
                                >
                                  Penuh
                                </label>
                              </div>
                              <div className='flex items-center justify-center'>
                                <input
                                  disabled={
                                    separaPenuhAtasPerluDenture === ''
                                      ? true
                                      : disableSalah === true
                                      ? true
                                      : false
                                  }
                                  type='radio'
                                  name='separa-penuh-atas-perlu-denture-reten-salah'
                                  id='tiada-atas-perlu-denture-reten-salah'
                                  value='tiada-atas-perlu-denture-reten-salah'
                                  checked={
                                    pilihanDataSalah.separaPenuhAtasPerluDenture ===
                                    'tiada-atas-perlu-denture-reten-salah'
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      separaPenuhAtasPerluDenture:
                                        e.target.value,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      separaPenuhAtasPerluDenture:
                                        e.target.value,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        separaPenuhAtasPerluDenture:
                                          e.target.value,
                                      },
                                    });
                                  }}
                                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                                />
                                <label
                                  htmlFor='tiada-atas-perlu-denture-reten-salah'
                                  className='m-2 text-sm font-m'
                                >
                                  Tiada
                                </label>
                              </div>
                              <span
                                className={` ${
                                  disableSalah === true
                                    ? 'pointer-events-none'
                                    : 'cursor-pointer '
                                } text-kaunter4`}
                                onClick={() => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    separaPenuhAtasPerluDenture: '',
                                    separaPenuhAtasPerluDentureCBox: false,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    separaPenuhAtasPerluDenture: '',
                                    separaPenuhAtasPerluDentureCBox: false,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      separaPenuhAtasPerluDenture: '',
                                      separaPenuhAtasPerluDentureCBox: false,
                                    },
                                  });
                                }}
                              >
                                <FaCheck className='text-xl' />
                              </span>
                            </div>
                          )}
                          <div
                            className={` ${
                              pilihanDataSalah.separaPenuhBawahPerluDentureCBox &&
                              'bg-user9 bg-opacity-20'
                            } items-center grid grid-cols-[2fr_2fr_2fr_1fr] `}
                          >
                            <label
                              htmlFor='bawah-perlu-denture'
                              className='m-2 text-sm font-m'
                            >
                              Bawah
                            </label>
                            <div className='flex items-center justify-center'>
                              <input
                                disabled={isDisabled}
                                type='radio'
                                name='separa-penuh-bawah-perlu-denture'
                                id='separa-bawah-perlu-denture'
                                value='separa-bawah-perlu-denture'
                                checked={
                                  separaPenuhBawahPerluDenture ===
                                  'separa-bawah-perlu-denture'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setSeparaPenuhBawahPerluDenture(
                                    e.target.value
                                  );
                                  setConfirmData({
                                    ...confirmData,
                                    separaPenuhBawahPerluDenture:
                                      e.target.value,
                                  });
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='separa-bawah-perlu-denture'
                                className='m-2 text-sm font-m'
                              >
                                Separa
                              </label>
                            </div>
                            <div className='flex items-center justify-center'>
                              <input
                                disabled={isDisabled}
                                type='radio'
                                name='separa-penuh-bawah-perlu-denture'
                                id='penuh-bawah-perlu-denture'
                                value='penuh-bawah-perlu-denture'
                                checked={
                                  separaPenuhBawahPerluDenture ===
                                  'penuh-bawah-perlu-denture'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setSeparaPenuhBawahPerluDenture(
                                    e.target.value
                                  );
                                  setConfirmData({
                                    ...confirmData,
                                    separaPenuhBawahPerluDenture:
                                      e.target.value,
                                  });
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='penuh-bawah-perlu-denture'
                                className='m-2 text-sm font-m'
                              >
                                Penuh
                              </label>
                            </div>
                            <div className='relative'>
                              <input
                                disabled={disableSalah}
                                type='checkbox'
                                name='bawah-perlu-denture-reten-salah'
                                id='bawah-perlu-denture-reten-salah'
                                checked={
                                  pilihanDataSalah.separaPenuhBawahPerluDentureCBox
                                }
                                onChange={() => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    separaPenuhBawahPerluDentureCBox:
                                      !pilihanDataSalah.separaPenuhBawahPerluDentureCBox,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    separaPenuhBawahPerluDentureCBox:
                                      !pilihanDataSalah.separaPenuhBawahPerluDentureCBox,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      separaPenuhBawahPerluDentureCBox:
                                        !pilihanDataSalah.separaPenuhBawahPerluDentureCBox,
                                    },
                                  });
                                }}
                                className='peer hidden'
                              />
                              <label
                                htmlFor='bawah-perlu-denture-reten-salah'
                                className={` ${
                                  disableSalah === true
                                    ? 'pointer-events-none'
                                    : 'cursor-pointer '
                                } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                              >
                                {pilihanDataSalah.separaPenuhBawahPerluDentureCBox ===
                                true ? (
                                  <FaTimes
                                    className='text-2xl'
                                    onClick={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        separaPenuhBawahPerluDenture: '',
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        separaPenuhBawahPerluDenture: '',
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          separaPenuhBawahPerluDenture: '',
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
                          {pilihanDataSalah.separaPenuhBawahPerluDentureCBox ===
                            true && (
                            <div className='items-center grid grid-cols-[2fr_2fr_2fr_1fr] bg-user11 bg-opacity-50'>
                              <div className='flex items-center justify-center'>
                                <input
                                  disabled={
                                    separaPenuhBawahPerluDenture ===
                                    'separa-bawah-perlu-denture'
                                      ? true
                                      : disableSalah === true
                                      ? true
                                      : false
                                  }
                                  type='radio'
                                  name='separa-penuh-bawah-perlu-denture-reten-salah'
                                  id='separa-bawah-perlu-denture-reten-salah'
                                  value='separa-bawah-perlu-denture-reten-salah'
                                  checked={
                                    pilihanDataSalah.separaPenuhBawahPerluDenture ===
                                    'separa-bawah-perlu-denture-reten-salah'
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      separaPenuhBawahPerluDenture:
                                        e.target.value,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      separaPenuhBawahPerluDenture:
                                        e.target.value,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        separaPenuhBawahPerluDenture:
                                          e.target.value,
                                      },
                                    });
                                  }}
                                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                                />
                                <label
                                  htmlFor='separa-bawah-perlu-denture-reten-salah'
                                  className='m-2 text-sm font-m'
                                >
                                  Separa
                                </label>
                              </div>
                              <div className='flex items-center justify-center'>
                                <input
                                  disabled={
                                    separaPenuhBawahPerluDenture ===
                                    'penuh-bawah-perlu-denture'
                                      ? true
                                      : disableSalah === true
                                      ? true
                                      : false
                                  }
                                  type='radio'
                                  name='separa-penuh-bawah-perlu-denture-reten-salah'
                                  id='penuh-bawah-perlu-denture-reten-salah'
                                  value='penuh-bawah-perlu-denture-reten-salah'
                                  checked={
                                    pilihanDataSalah.separaPenuhBawahPerluDenture ===
                                    'penuh-bawah-perlu-denture-reten-salah'
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      separaPenuhBawahPerluDenture:
                                        e.target.value,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      separaPenuhBawahPerluDenture:
                                        e.target.value,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        separaPenuhBawahPerluDenture:
                                          e.target.value,
                                      },
                                    });
                                  }}
                                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                                />
                                <label
                                  htmlFor='penuh-bawah-perlu-denture-reten-salah'
                                  className='m-2 text-sm font-m'
                                >
                                  Penuh
                                </label>
                              </div>
                              <div className='flex items-center justify-center'>
                                <input
                                  disabled={
                                    separaPenuhBawahPerluDenture === ''
                                      ? true
                                      : disableSalah === true
                                      ? true
                                      : false
                                  }
                                  type='radio'
                                  name='separa-penuh-bawah-perlu-denture-reten-salah'
                                  id='tiada-bawah-perlu-denture-reten-salah'
                                  value='tiada-bawah-perlu-denture-reten-salah'
                                  checked={
                                    pilihanDataSalah.separaPenuhBawahPerluDenture ===
                                    'tiada-bawah-perlu-denture-reten-salah'
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      separaPenuhBawahPerluDenture:
                                        e.target.value,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      separaPenuhBawahPerluDenture:
                                        e.target.value,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        separaPenuhBawahPerluDenture:
                                          e.target.value,
                                      },
                                    });
                                  }}
                                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                                />
                                <label
                                  htmlFor='tiada-bawah-perlu-denture-reten-salah'
                                  className='m-2 text-sm font-m'
                                >
                                  Tiada
                                </label>
                              </div>
                              <span
                                className={` ${
                                  disableSalah === true
                                    ? 'pointer-events-none'
                                    : 'cursor-pointer '
                                } text-kaunter4`}
                                onClick={() => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    separaPenuhBawahPerluDenture: '',
                                    separaPenuhBawahPerluDentureCBox: false,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    separaPenuhBawahPerluDenture: '',
                                    separaPenuhBawahPerluDentureCBox: false,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      separaPenuhBawahPerluDenture: '',
                                      separaPenuhBawahPerluDentureCBox: false,
                                    },
                                  });
                                }}
                              >
                                <FaCheck className='text-xl' />
                              </span>
                            </div>
                          )}
                        </article>
                      </div>
                    </article>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-2'>
                      <article className='grid grid-cols-1 border border-userBlack pl-3 p-2 rounded-md auto-rows-min'>
                        <h4 className='font-bold flex flex-row pl-5'>
                          Kebersihan Mulut
                        </h4>
                        <div
                          className={`${
                            pilihanDataSalah.kebersihanMulutOralHygieneCBox &&
                            'grid-rows-2'
                          } grid pt-1`}
                        >
                          <div
                            className={`${
                              pilihanDataSalah.kebersihanMulutOralHygieneCBox &&
                              'bg-user9 bg-opacity-20'
                            } flex items-center flex-row pl-2`}
                          >
                            <p className='flex flex-row pl-5 text-sm font-m'>
                              Skor Plak<span className='text-user6'>*</span>
                            </p>
                            <select
                              disabled={isDisabled}
                              required
                              name='kebersihan-mulut'
                              id='kebersihan-mulut'
                              value={kebersihanMulutOralHygiene}
                              onChange={(e) => {
                                setKebersihanMulutOralHygiene(e.target.value);
                                setConfirmData({
                                  ...confirmData,
                                  kebersihanMulutOralHygiene: e.target.value,
                                });
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            >
                              <option value=''></option>
                              <option value='tiada'>- (Tidak Disaring)</option>
                              <option value='A'>A</option>
                              <option value='C'>C</option>
                              <option value='E'>E</option>
                            </select>
                            <div className='relative'>
                              <input
                                disabled={disableSalah}
                                type='checkbox'
                                name='kebersihan-mulut-reten-salah-cbox'
                                id='kebersihan-mulut-reten-salah-cbox'
                                checked={
                                  pilihanDataSalah.kebersihanMulutOralHygieneCBox
                                }
                                onChange={() => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    kebersihanMulutOralHygieneCBox:
                                      !pilihanDataSalah.kebersihanMulutOralHygieneCBox,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    kebersihanMulutOralHygieneCBox:
                                      !pilihanDataSalah.kebersihanMulutOralHygieneCBox,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      kebersihanMulutOralHygieneCBox:
                                        !pilihanDataSalah.kebersihanMulutOralHygieneCBox,
                                    },
                                  });
                                }}
                                className='peer hidden'
                              />
                              <label
                                htmlFor='kebersihan-mulut-reten-salah-cbox'
                                className={` ${
                                  disableSalah === true
                                    ? 'pointer-events-none'
                                    : 'cursor-pointer '
                                } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                              >
                                {pilihanDataSalah.kebersihanMulutOralHygieneCBox ===
                                true ? (
                                  <FaTimes
                                    className='text-2xl'
                                    onClick={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        kebersihanMulutOralHygiene: '',
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        kebersihanMulutOralHygiene: '',
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          kebersihanMulutOralHygiene: '',
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
                          {pilihanDataSalah.kebersihanMulutOralHygieneCBox ===
                            true && (
                            <div className='flex items-center flex-row pl-2 bg-user11 bg-opacity-50 mb-1'>
                              <p className='flex flex-row pl-5 text-sm font-m'>
                                Skor Plak<span className='text-user6'>*</span>
                              </p>
                              <select
                                name='kebersihan-mulut'
                                id='kebersihan-mulut'
                                value={
                                  pilihanDataSalah.kebersihanMulutOralHygiene
                                }
                                onChange={(e) => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    kebersihanMulutOralHygiene: e.target.value,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    kebersihanMulutOralHygiene: e.target.value,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      kebersihanMulutOralHygiene:
                                        e.target.value,
                                    },
                                  });
                                }}
                                className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              >
                                {kebersihanMulutOralHygiene === 'A' ? (
                                  <>
                                    <option value=''></option>
                                    <option value='C'>C</option>
                                    <option value='E'>E</option>
                                  </>
                                ) : kebersihanMulutOralHygiene === 'C' ? (
                                  <>
                                    <option value=''></option>
                                    <option value='A'>A</option>
                                    <option value='E'>E</option>
                                  </>
                                ) : kebersihanMulutOralHygiene === 'E' ? (
                                  <>
                                    <option value=''></option>
                                    <option value='A'>A</option>
                                    <option value='C'>C</option>
                                  </>
                                ) : (
                                  <>
                                    <option value='A'>A</option>
                                    <option value='C'>C</option>
                                    <option value='E'>E</option>
                                  </>
                                )}
                              </select>
                              <span className='text-kaunter4'>
                                <FaCheck className='text-2xl' />
                              </span>
                            </div>
                          )}
                        </div>
                        {/* <div
                        className={`${
                          singlePersonSekolah.umur < 15 && 'hidden'
                        } flex items-center flex-row pl-5`}
                      >
                        <label
                          htmlFor='saringan-kanser-mulut'
                          className='text-sm font-m'
                        >
                          Saringan Kanser Mulut
                        </label>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='saringan-kanser-mulut'
                          id='saringan-kanser-mulut'
                          checked={saringanKanserMulutOralHygiene}
                          onChange={() => {
                            setSaringanKanserMulutOralHygiene(
                              !saringanKanserMulutOralHygiene
                            );
                            setConfirmData({
                              ...confirmData,
                              saringanKanserMulutOralHygiene:
                                !saringanKanserMulutOralHygiene,
                            });
                          }}
                          className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 m-2'
                        />
                      </div> */}
                        <div
                          className={`${
                            pilihanDataSalah.perluPenskaleranOralHygieneCBox &&
                            'bg-user9 bg-opacity-20'
                          } flex items-center flex-row pl-5`}
                        >
                          <input
                            disabled={isDisabled}
                            type='checkbox'
                            name='perlu-penskaleran'
                            id='perlu-penskaleran'
                            checked={perluPenskaleranOralHygiene}
                            onChange={() => {
                              setPerluPenskaleranOralHygiene(
                                !perluPenskaleranOralHygiene
                              );
                              setConfirmData({
                                ...confirmData,
                                perluPenskaleranOralHygiene:
                                  !perluPenskaleranOralHygiene,
                              });
                            }}
                            className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                          />
                          <label
                            htmlFor='perlu-penskaleran'
                            className='m-2 text-sm font-m'
                          >
                            Perlu Penskaleran
                          </label>
                          <div className='relative'>
                            <input
                              disabled={disableSalah}
                              type='checkbox'
                              name='perlu-penskaleran-reten-salah-cbox'
                              id='perlu-penskaleran-reten-salah-cbox'
                              checked={
                                pilihanDataSalah.perluPenskaleranOralHygieneCBox
                              }
                              onChange={() => {
                                setPilihanDataSalah({
                                  ...pilihanDataSalah,
                                  perluPenskaleranOralHygieneCBox:
                                    !pilihanDataSalah.perluPenskaleranOralHygieneCBox,
                                  perluPenskaleranOralHygiene:
                                    !perluPenskaleranOralHygiene,
                                });
                                setDataRetenSalah({
                                  ...dataRetenSalah,
                                  perluPenskaleranOralHygieneCBox:
                                    !pilihanDataSalah.perluPenskaleranOralHygieneCBox,
                                  perluPenskaleranOralHygiene:
                                    !perluPenskaleranOralHygiene,
                                });
                                setConfirmData({
                                  ...confirmData,
                                  pilihanDataSalah: {
                                    ...pilihanDataSalah,
                                    perluPenskaleranOralHygieneCBox:
                                      !pilihanDataSalah.perluPenskaleranOralHygieneCBox,
                                    perluPenskaleranOralHygiene:
                                      !perluPenskaleranOralHygiene,
                                  },
                                });
                              }}
                              className='peer hidden'
                            />
                            <label
                              htmlFor='perlu-penskaleran-reten-salah-cbox'
                              className=' text-user9 h-6 w-6 rounded-full flex items-center justify-center cursor-pointer'
                            >
                              {pilihanDataSalah.perluPenskaleranOralHygieneCBox ===
                              true ? (
                                <FaTimes className='text-2xl' />
                              ) : (
                                <FaRegHandPointLeft className='text-2xl' />
                              )}
                            </label>
                          </div>
                        </div>
                        {pilihanDataSalah.perluPenskaleranOralHygieneCBox ===
                          true && (
                          <div className='flex items-center flex-row pl-5  bg-user11 bg-opacity-50'>
                            <input
                              disabled
                              type='checkbox'
                              name='perlu-penskaleran-reten-salah'
                              id='perlu-penskaleran-reten-salah'
                              checked={
                                pilihanDataSalah.perluPenskaleranOralHygiene
                              }
                              className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                            />
                            <label
                              htmlFor='perlu-penskaleran-reten-salah'
                              className='m-2 text-sm font-m'
                            >
                              Perlu Penskaleran
                            </label>
                            <span className='text-kaunter4'>
                              <FaCheck className='text-2xl' />
                            </span>
                          </div>
                        )}
                      </article>
                      <article className='border border-userBlack pl-3 p-2 rounded-md grid grid-cols-1 auto-rows-min'>
                        <h4 className='font-bold flex flex-row pl-5'>
                          Status Periodontium
                        </h4>
                        {singlePersonSekolah.umur >= 15 && (
                          <div className='flex items-center ml-2'>
                            <input
                              disabled={isDisabled}
                              type='radio'
                              name='status-periodontium'
                              id='gis-status-periodontium'
                              value='gis-status-periodontium'
                              checked={
                                statusPeriodontium === 'gis-status-periodontium'
                                  ? true
                                  : false
                              }
                              onChange={(e) => {
                                setStatusPeriodontium(e.target.value);
                                setConfirmData({
                                  ...confirmData,
                                  statusPeriodontium: e.target.value,
                                });
                              }}
                              className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 m-2'
                            />
                            <label
                              htmlFor='gis-status-periodontium'
                              className='m-2 text-sm font-m'
                            >
                              Skor GIS
                            </label>
                            <input
                              disabled={isDisabled}
                              type='radio'
                              name='status-periodontium'
                              id='bpe-status-periodontium'
                              value='bpe-status-periodontium'
                              checked={
                                statusPeriodontium === 'bpe-status-periodontium'
                                  ? true
                                  : false
                              }
                              onChange={(e) => {
                                setStatusPeriodontium(e.target.value);
                                setConfirmData({
                                  ...confirmData,
                                  statusPeriodontium: e.target.value,
                                });
                              }}
                              className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 m-2'
                            />
                            <label
                              htmlFor='bpe-status-periodontium'
                              className='m-2 text-sm font-m'
                            >
                              Skor BPE
                            </label>
                          </div>
                        )}
                        {singlePersonSekolah.umur >= 15 ? (
                          <div
                            className={`${
                              pilihanDataSalah.skorGisMulutOralHygieneCBox &&
                              'grid-rows-2'
                            } grid px-3 pt-1`}
                          >
                            <div
                              className={`${
                                pilihanDataSalah.skorGisMulutOralHygieneCBox &&
                                'bg-user9 bg-opacity-20'
                              } flex items-center flex-row pl-2`}
                            >
                              <p className='flex text-sm font-m'>Skor GIS</p>
                              <select
                                disabled={isDisabled}
                                required={
                                  skorGisMulutOralHygiene ||
                                  skorBpeOralHygiene === '1' ||
                                  skorBpeOralHygiene === '2' ||
                                  skorBpeOralHygiene === '3' ||
                                  skorBpeOralHygiene === '4'
                                    ? false
                                    : true
                                }
                                name='skor-gis'
                                id='skor-gis'
                                value={skorGisMulutOralHygiene}
                                onChange={(e) => {
                                  setSkorGisMulutOralHygiene(e.target.value);
                                  setConfirmData({
                                    ...confirmData,
                                    skorGisMulutOralHygiene: e.target.value,
                                  });
                                }}
                                className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              >
                                <option value=''></option>
                                <option value='tiada'>
                                  - (Tidak Disaring)
                                </option>
                                <option value='0'>0</option>
                                <option value='1'>1</option>
                                <option value='2'>2</option>
                                <option value='3'>3</option>
                              </select>
                              <div className='relative'>
                                <input
                                  disabled={disableSalah}
                                  type='checkbox'
                                  name='skor-gis-reten-salah-cbox'
                                  id='skor-gis-reten-salah-cbox'
                                  checked={
                                    pilihanDataSalah.skorGisMulutOralHygieneCBox
                                  }
                                  onChange={() => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      skorGisMulutOralHygieneCBox:
                                        !pilihanDataSalah.skorGisMulutOralHygieneCBox,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      skorGisMulutOralHygieneCBox:
                                        !pilihanDataSalah.skorGisMulutOralHygieneCBox,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        skorGisMulutOralHygieneCBox:
                                          !pilihanDataSalah.skorGisMulutOralHygieneCBox,
                                      },
                                    });
                                  }}
                                  className='peer hidden'
                                />
                                <label
                                  htmlFor='skor-gis-reten-salah-cbox'
                                  className={` ${
                                    disableSalah === true
                                      ? 'pointer-events-none'
                                      : 'cursor-pointer '
                                  } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                >
                                  {pilihanDataSalah.skorGisMulutOralHygieneCBox ===
                                  true ? (
                                    <FaTimes
                                      className='text-2xl'
                                      onClick={() => {
                                        setPilihanDataSalah({
                                          ...pilihanDataSalah,
                                          skorGisMulutOralHygiene: '',
                                        });
                                        setDataRetenSalah({
                                          ...dataRetenSalah,
                                          skorGisMulutOralHygiene: '',
                                        });
                                        setConfirmData({
                                          ...confirmData,
                                          pilihanDataSalah: {
                                            ...pilihanDataSalah,
                                            skorGisMulutOralHygiene: '',
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
                            {pilihanDataSalah.skorGisMulutOralHygieneCBox ===
                              true && (
                              <div className='flex items-center flex-row pl-2 bg-user11 bg-opacity-50'>
                                <p className='flex flex-row text-sm font-m'>
                                  Skor GIS
                                </p>
                                <select
                                  name='skor-gis-reten-salah'
                                  id='skor-gis-reten-salah'
                                  value={
                                    pilihanDataSalah.skorGisMulutOralHygiene
                                  }
                                  onChange={(e) => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      skorGisMulutOralHygiene: e.target.value,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      skorGisMulutOralHygiene: e.target.value,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        skorGisMulutOralHygiene: e.target.value,
                                      },
                                    });
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                >
                                  {skorGisMulutOralHygiene === '0' ? (
                                    <>
                                      <option value=''></option>
                                      <option value='1'>1</option>
                                      <option value='2'>2</option>
                                      <option value='3'>3</option>
                                    </>
                                  ) : skorGisMulutOralHygiene === '1' ? (
                                    <>
                                      <option value=''></option>
                                      <option value='0'>0</option>
                                      <option value='2'>2</option>
                                      <option value='3'>3</option>
                                    </>
                                  ) : skorGisMulutOralHygiene === '2' ? (
                                    <>
                                      <option value=''></option>
                                      <option value='0'>0</option>
                                      <option value='1'>1</option>
                                      <option value='3'>3</option>
                                    </>
                                  ) : skorGisMulutOralHygiene === '3' ? (
                                    <>
                                      <option value=''></option>
                                      <option value='0'>0</option>
                                      <option value='1'>1</option>
                                      <option value='2'>2</option>
                                    </>
                                  ) : (
                                    <>
                                      <option value='0'>0</option>
                                      <option value='1'>1</option>
                                      <option value='2'>2</option>
                                      <option value='3'>3</option>
                                    </>
                                  )}
                                </select>
                                <span className='text-kaunter4'>
                                  <FaCheck className='text-2xl' />
                                </span>
                              </div>
                            )}
                          </div>
                        ) : singlePersonSekolah.umur < 15 ? (
                          <div
                            className={`${
                              pilihanDataSalah.skorGisMulutOralHygieneCBox &&
                              'grid-rows-2'
                            } grid px-3 pt-1`}
                          >
                            <div
                              className={`${
                                pilihanDataSalah.skorGisMulutOralHygieneCBox &&
                                'bg-user9 bg-opacity-20'
                              } flex items-center flex-row pl-2`}
                            >
                              <p className='flex text-sm font-m'>Skor GIS</p>
                              <select
                                disabled={isDisabled}
                                required={
                                  skorGisMulutOralHygiene ||
                                  skorBpeOralHygiene === '1' ||
                                  skorBpeOralHygiene === '2' ||
                                  skorBpeOralHygiene === '3' ||
                                  skorBpeOralHygiene === '4'
                                    ? false
                                    : true
                                }
                                name='skor-gis'
                                id='skor-gis'
                                value={skorGisMulutOralHygiene}
                                onChange={(e) => {
                                  setSkorGisMulutOralHygiene(e.target.value);
                                  setConfirmData({
                                    ...confirmData,
                                    skorGisMulutOralHygiene: e.target.value,
                                  });
                                }}
                                className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              >
                                <option value=''></option>
                                <option value='tiada'>
                                  - (Tidak Disaring)
                                </option>
                                <option value='0'>0</option>
                                <option value='1'>1</option>
                                <option value='2'>2</option>
                                <option value='3'>3</option>
                              </select>
                              <div className='relative'>
                                <input
                                  disabled={disableSalah}
                                  type='checkbox'
                                  name='skor-gis-reten-salah-cbox'
                                  id='skor-gis-reten-salah-cbox'
                                  checked={
                                    pilihanDataSalah.skorGisMulutOralHygieneCBox
                                  }
                                  onChange={() => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      skorGisMulutOralHygieneCBox:
                                        !pilihanDataSalah.skorGisMulutOralHygieneCBox,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      skorGisMulutOralHygieneCBox:
                                        !pilihanDataSalah.skorGisMulutOralHygieneCBox,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        skorGisMulutOralHygieneCBox:
                                          !pilihanDataSalah.skorGisMulutOralHygieneCBox,
                                      },
                                    });
                                  }}
                                  className='peer hidden'
                                />
                                <label
                                  htmlFor='skor-gis-reten-salah-cbox'
                                  className={` ${
                                    disableSalah === true
                                      ? 'pointer-events-none'
                                      : 'cursor-pointer '
                                  } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                >
                                  {pilihanDataSalah.skorGisMulutOralHygieneCBox ===
                                  true ? (
                                    <FaTimes
                                      className='text-2xl'
                                      onClick={() => {
                                        setPilihanDataSalah({
                                          ...pilihanDataSalah,
                                          skorGisMulutOralHygiene: '',
                                        });
                                        setDataRetenSalah({
                                          ...dataRetenSalah,
                                          skorGisMulutOralHygiene: '',
                                        });
                                        setConfirmData({
                                          ...confirmData,
                                          pilihanDataSalah: {
                                            ...pilihanDataSalah,
                                            skorGisMulutOralHygiene: '',
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
                            {pilihanDataSalah.skorGisMulutOralHygieneCBox ===
                              true && (
                              <div className='flex items-center flex-row pl-2 bg-user11 bg-opacity-50'>
                                <p className='flex flex-row text-sm font-m'>
                                  Skor GIS
                                </p>
                                <select
                                  name='skor-gis-reten-salah'
                                  id='skor-gis-reten-salah'
                                  value={
                                    pilihanDataSalah.skorGisMulutOralHygiene
                                  }
                                  onChange={(e) => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      skorGisMulutOralHygiene: e.target.value,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      skorGisMulutOralHygiene: e.target.value,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        skorGisMulutOralHygiene: e.target.value,
                                      },
                                    });
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                >
                                  {skorGisMulutOralHygiene === '0' ? (
                                    <>
                                      <option value=''></option>
                                      <option value='1'>1</option>
                                      <option value='2'>2</option>
                                      <option value='3'>3</option>
                                    </>
                                  ) : skorGisMulutOralHygiene === '1' ? (
                                    <>
                                      <option value=''></option>
                                      <option value='0'>0</option>
                                      <option value='2'>2</option>
                                      <option value='3'>3</option>
                                    </>
                                  ) : skorGisMulutOralHygiene === '2' ? (
                                    <>
                                      <option value=''></option>
                                      <option value='0'>0</option>
                                      <option value='1'>1</option>
                                      <option value='3'>3</option>
                                    </>
                                  ) : skorGisMulutOralHygiene === '3' ? (
                                    <>
                                      <option value=''></option>
                                      <option value='0'>0</option>
                                      <option value='1'>1</option>
                                      <option value='2'>2</option>
                                    </>
                                  ) : (
                                    <>
                                      <option value='0'>0</option>
                                      <option value='1'>1</option>
                                      <option value='2'>2</option>
                                      <option value='3'>3</option>
                                    </>
                                  )}
                                </select>
                                <span className='text-kaunter4'>
                                  <FaCheck className='text-2xl' />
                                </span>
                              </div>
                            )}
                          </div>
                        ) : null}
                        {singlePersonSekolah.umur >= 15 && (
                          <div
                            className={`${
                              pilihanDataSalah.skorBpeOralHygieneCBox &&
                              'grid-rows-2'
                            } grid px-3 pt-1`}
                          >
                            <div
                              className={`${
                                pilihanDataSalah.skorBpeOralHygieneCBox &&
                                'bg-user9 bg-opacity-20'
                              } flex items-center flex-row pl-2`}
                            >
                              <p className='text-sm font-m'>Skor BPE</p>
                              <select
                                disabled={isDisabled}
                                required={
                                  skorGisMulutOralHygiene ||
                                  skorBpeOralHygiene === '1' ||
                                  skorBpeOralHygiene === '2' ||
                                  skorBpeOralHygiene === '3' ||
                                  skorBpeOralHygiene === '4'
                                    ? false
                                    : true
                                }
                                name='skor-bpe'
                                id='skor-bpe'
                                value={skorBpeOralHygiene}
                                onChange={(e) => {
                                  setSkorBpeOralHygiene(e.target.value);
                                  setConfirmData({
                                    ...confirmData,
                                    skorBpeOralHygiene: e.target.value,
                                  });
                                }}
                                className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              >
                                <option value=''></option>
                                <option value='tiada'>
                                  - (Tidak Disaring)
                                </option>
                                <option value='0'>0</option>
                                <option value='1'>1</option>
                                <option value='2'>2</option>
                                <option value='3'>3</option>
                                <option value='4'>4</option>
                              </select>
                              <div className='relative'>
                                <input
                                  disabled={disableSalah}
                                  type='checkbox'
                                  name='skor-bpe-reten-salah-cbox'
                                  id='skor-bpe-reten-salah-cbox'
                                  checked={
                                    pilihanDataSalah.skorBpeOralHygieneCBox
                                  }
                                  onChange={() => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      skorBpeOralHygieneCBox:
                                        !pilihanDataSalah.skorBpeOralHygieneCBox,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      skorBpeOralHygieneCBox:
                                        !pilihanDataSalah.skorBpeOralHygieneCBox,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        skorBpeOralHygieneCBox:
                                          !pilihanDataSalah.skorBpeOralHygieneCBox,
                                      },
                                    });
                                  }}
                                  className='peer hidden'
                                />
                                <label
                                  htmlFor='skor-bpe-reten-salah-cbox'
                                  className={` ${
                                    disableSalah === true
                                      ? 'pointer-events-none'
                                      : 'cursor-pointer '
                                  } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                >
                                  {pilihanDataSalah.skorBpeOralHygieneCBox ===
                                  true ? (
                                    <FaTimes
                                      className='text-2xl'
                                      onClick={() => {
                                        setPilihanDataSalah({
                                          ...pilihanDataSalah,
                                          skorBpeOralHygiene: '',
                                        });
                                        setDataRetenSalah({
                                          ...dataRetenSalah,
                                          skorBpeOralHygiene: '',
                                        });
                                        setConfirmData({
                                          ...confirmData,
                                          pilihanDataSalah: {
                                            ...pilihanDataSalah,
                                            skorBpeOralHygiene: '',
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
                            {pilihanDataSalah.skorBpeOralHygieneCBox ===
                              true && (
                              <div className='flex items-center flex-row pl-2 bg-user11 bg-opacity-50'>
                                <p className='flex flex-row text-sm font-m'>
                                  Skor BPE
                                </p>
                                <select
                                  name='skor-bpe'
                                  id='skor-bpe'
                                  value={pilihanDataSalah.skorBpeOralHygiene}
                                  onChange={(e) => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      skorBpeOralHygiene: e.target.value,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      skorBpeOralHygiene: e.target.value,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        skorBpeOralHygiene: e.target.value,
                                      },
                                    });
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                >
                                  {skorBpeOralHygiene === '0' ? (
                                    <>
                                      <option value=''></option>
                                      <option value='1'>1</option>
                                      <option value='2'>2</option>
                                      <option value='3'>3</option>
                                      <option value='4'>4</option>
                                    </>
                                  ) : skorBpeOralHygiene === '1' ? (
                                    <>
                                      <option value=''></option>
                                      <option value='0'>0</option>
                                      <option value='2'>2</option>
                                      <option value='3'>3</option>
                                      <option value='4'>4</option>
                                    </>
                                  ) : skorBpeOralHygiene === '2' ? (
                                    <>
                                      <option value=''></option>
                                      <option value='0'>0</option>
                                      <option value='1'>1</option>
                                      <option value='3'>3</option>
                                      <option value='4'>4</option>
                                    </>
                                  ) : skorBpeOralHygiene === '3' ? (
                                    <>
                                      <option value=''></option>
                                      <option value='0'>0</option>
                                      <option value='1'>1</option>
                                      <option value='2'>2</option>
                                      <option value='4'>4</option>
                                    </>
                                  ) : skorBpeOralHygiene === '4' ? (
                                    <>
                                      <option value=''></option>
                                      <option value='0'>0</option>
                                      <option value='1'>1</option>
                                      <option value='2'>2</option>
                                      <option value='3'>3</option>
                                    </>
                                  ) : (
                                    <>
                                      <option value='0'>0</option>
                                      <option value='1'>1</option>
                                      <option value='2'>2</option>
                                      <option value='3'>3</option>
                                    </>
                                  )}
                                </select>
                                <span className='text-kaunter4'>
                                  <FaCheck className='text-2xl' />
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </article>
                    </div>
                    <article className=' border border-userBlack pl-3 p-2 rounded-md grid grid-cols-1 lg:grid-cols-2 gap-2 auto-rows-min'>
                      <div className='flex flex-row items-center pl-5 lg:col-span-2'>
                        <h4 className='font-bold'>
                          Pesakit Mempunyai Gigi Desidus/Kekal?
                          <span className='text-user6'>*</span>
                        </h4>
                        <div className='flex items-center justify-center ml-2'>
                          <input
                            disabled={isDisabled}
                            required
                            type='radio'
                            name='pesakit-mempunyai-gigi'
                            id='ya-pesakit-mempunyai-gigi'
                            value='ya-pesakit-mempunyai-gigi'
                            checked={
                              yaTidakPesakitMempunyaiGigi ===
                              'ya-pesakit-mempunyai-gigi'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              setYaTidakPesakitMempunyaiGigi(e.target.value);
                            }}
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          />
                          <label
                            htmlFor='ya-pesakit-mempunyai-gigi'
                            className='m-2 text-sm font-m'
                          >
                            Ya
                          </label>
                          <input
                            disabled={isDisabled}
                            required
                            type='radio'
                            name='pesakit-mempunyai-gigi'
                            id='tidak-pesakit-mempunyai-gigi'
                            value='tidak-pesakit-mempunyai-gigi'
                            checked={
                              yaTidakPesakitMempunyaiGigi ===
                              'tidak-pesakit-mempunyai-gigi'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              setYaTidakPesakitMempunyaiGigi(e.target.value);
                            }}
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          />
                          <label
                            htmlFor='tidak-pesakit-mempunyai-gigi'
                            className='m-2 text-sm font-m'
                          >
                            Tidak
                          </label>
                        </div>
                      </div>
                      <div className='shadow-lg shadow-user4 rounded-md auto-rows-min'>
                        <h4 className='font-bold flex flex-row pl-5'>
                          Status Gigi Desidus
                          {adaDesidus === true || adaKekal === true ? null : (
                            <span className='text-user6'>*</span>
                          )}
                        </h4>
                        <div className='grid gap-1'>
                          <div
                            className={`${
                              pilihanDataSalah.adaDesidusCBox && 'grid-rows-2'
                            } grid px-3 pt-1`}
                          >
                            <div
                              className={`${
                                pilihanDataSalah.adaDesidusCBox &&
                                'bg-user9 bg-opacity-20'
                              } flex items-center flex-row justify-center `}
                            >
                              <input
                                disabled={isDisabled}
                                required={
                                  adaDesidus === true || adaKekal === true
                                    ? false
                                    : true
                                }
                                type='checkbox'
                                name='ada-desidus'
                                id='ada-desidus'
                                checked={adaDesidus}
                                onChange={() => {
                                  setAdaDesidus(!adaDesidus);
                                  setConfirmData({
                                    ...confirmData,
                                    adaDesidus: !adaDesidus,
                                  });
                                }}
                                className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                              />
                              <label
                                htmlFor='ada-desidus'
                                className='m-2 text-sm font-m'
                              >
                                ada gigi desidus
                              </label>
                              <div className='relative'>
                                <input
                                  disabled={disableSalah}
                                  type='checkbox'
                                  name='ada-desidus-reten-salah-cbox'
                                  id='ada-desidus-reten-salah-cbox'
                                  checked={pilihanDataSalah.adaDesidusCBox}
                                  onChange={() => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      adaDesidusCBox:
                                        !pilihanDataSalah.adaDesidusCBox,
                                      adaDesidus: !adaDesidus,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      adaDesidusCBox:
                                        !pilihanDataSalah.adaDesidusCBox,
                                      adaDesidus: !adaDesidus,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        adaDesidusCBox:
                                          !pilihanDataSalah.adaDesidusCBox,
                                        adaDesidus: !adaDesidus,
                                      },
                                    });
                                  }}
                                  className='peer hidden'
                                />
                                <label
                                  htmlFor='ada-desidus-reten-salah-cbox'
                                  className=' text-user9 h-6 w-6 rounded-full flex items-center justify-center cursor-pointer'
                                >
                                  {pilihanDataSalah.adaDesidusCBox === true ? (
                                    <FaTimes className='text-2xl' />
                                  ) : (
                                    <FaRegHandPointLeft className='text-2xl' />
                                  )}
                                </label>
                              </div>
                            </div>
                            {pilihanDataSalah.adaDesidusCBox === true && (
                              <div className='flex items-center flex-row justify-center bg-user11 bg-opacity-50'>
                                <input
                                  disabled
                                  type='checkbox'
                                  name='ada-desidus-reten-salah'
                                  id='ada-desidus-reten-salah'
                                  checked={pilihanDataSalah.adaDesidus}
                                  className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                                />
                                <label
                                  htmlFor='ada-desidus-reten-salah'
                                  className='mx-2 text-sm font-m'
                                >
                                  ada gigi desidus
                                </label>
                                <span className='text-kaunter4'>
                                  <FaCheck className='text-2xl' />
                                </span>
                              </div>
                            )}
                          </div>
                          <div className='grid grid-cols-1'>
                            <div
                              className={`${
                                pilihanDataSalah.dAdaGigiDesidusCBox &&
                                'bg-user9 bg-opacity-20'
                              } flex items-center flex-row pl-5`}
                            >
                              <p className='text-sm font-m lowercase'>d: </p>
                              <span className='text-user6'>*</span>
                              <input
                                disabled={isDisabled}
                                required
                                min='0'
                                max='20'
                                type='number'
                                name='d-ada-status-gigi-desidus'
                                id='d-ada-status-gigi-desidus'
                                value={dAdaGigiDesidus}
                                onChange={(e) => {
                                  setDAdaGigiDesidus(e.target.value);
                                  setConfirmData({
                                    ...confirmData,
                                    dAdaGigiDesidus: e.target.value,
                                  });
                                }}
                                className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              />
                              <div className='relative'>
                                <input
                                  disabled={disableSalah}
                                  type='checkbox'
                                  name='d-ada-status-gigi-desidus-reten-salah-cbox'
                                  id='d-ada-status-gigi-desidus-reten-salah-cbox'
                                  checked={pilihanDataSalah.dAdaGigiDesidusCBox}
                                  onChange={() => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      dAdaGigiDesidusCBox:
                                        !pilihanDataSalah.dAdaGigiDesidusCBox,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      dAdaGigiDesidusCBox:
                                        !pilihanDataSalah.dAdaGigiDesidusCBox,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        dAdaGigiDesidusCBox:
                                          !pilihanDataSalah.dAdaGigiDesidusCBox,
                                      },
                                    });
                                  }}
                                  className='peer hidden'
                                />
                                <label
                                  htmlFor='d-ada-status-gigi-desidus-reten-salah-cbox'
                                  className={` ${
                                    disableSalah === true
                                      ? 'pointer-events-none'
                                      : 'cursor-pointer '
                                  } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                >
                                  {pilihanDataSalah.dAdaGigiDesidusCBox ===
                                  true ? (
                                    <FaTimes
                                      className='text-2xl'
                                      onClick={() => {
                                        setPilihanDataSalah({
                                          ...pilihanDataSalah,
                                          dAdaGigiDesidus: '',
                                        });
                                        setDataRetenSalah({
                                          ...dataRetenSalah,
                                          dAdaGigiDesidus: '',
                                        });
                                        setConfirmData({
                                          ...confirmData,
                                          pilihanDataSalah: {
                                            ...pilihanDataSalah,
                                            dAdaGigiDesidus: '',
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
                            {pilihanDataSalah.dAdaGigiDesidusCBox === true && (
                              <div className='flex flex-row items-center pl-5 bg-user11 bg-opacity-50 mb-1'>
                                <p className='text-sm font-m lowercase'>d: </p>
                                <span className='text-user6'>*</span>
                                <input
                                  disabled={disableSalah}
                                  required
                                  min='0'
                                  max='20'
                                  type='number'
                                  name='d-ada-status-gigi-desidus'
                                  id='d-ada-status-gigi-desidus'
                                  value={pilihanDataSalah.dAdaGigiDesidus}
                                  onChange={(e) => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      dAdaGigiDesidus: e.target.value,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      dAdaGigiDesidus: e.target.value,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        dAdaGigiDesidus: e.target.value,
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
                            <div
                              className={`${
                                pilihanDataSalah.fAdaGigiDesidusCBox &&
                                'bg-user9 bg-opacity-20'
                              } flex items-center flex-row pl-5`}
                            >
                              <p className='text-sm font-m lowercase'>f: </p>
                              <span className='text-user6'>*</span>
                              <input
                                disabled={isDisabled}
                                required
                                min='0'
                                max='20'
                                type='number'
                                name='f-ada-status-gigi-desidus'
                                id='f-ada-status-gigi-desidus'
                                value={fAdaGigiDesidus}
                                onChange={(e) => {
                                  setFAdaGigiDesidus(e.target.value);
                                  setConfirmData({
                                    ...confirmData,
                                    fAdaGigiDesidus: e.target.value,
                                  });
                                }}
                                className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              />
                              <div className='relative'>
                                <input
                                  disabled={disableSalah}
                                  type='checkbox'
                                  name='f-ada-status-gigi-desidus-reten-salah-cbox'
                                  id='f-ada-status-gigi-desidus-reten-salah-cbox'
                                  checked={pilihanDataSalah.fAdaGigiDesidusCBox}
                                  onChange={() => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      fAdaGigiDesidusCBox:
                                        !pilihanDataSalah.fAdaGigiDesidusCBox,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      fAdaGigiDesidusCBox:
                                        !pilihanDataSalah.fAdaGigiDesidusCBox,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        fAdaGigiDesidusCBox:
                                          !pilihanDataSalah.fAdaGigiDesidusCBox,
                                      },
                                    });
                                  }}
                                  className='peer hidden'
                                />
                                <label
                                  htmlFor='f-ada-status-gigi-desidus-reten-salah-cbox'
                                  className={` ${
                                    disableSalah === true
                                      ? 'pointer-events-none'
                                      : 'cursor-pointer '
                                  } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                >
                                  {pilihanDataSalah.fAdaGigiDesidusCBox ===
                                  true ? (
                                    <FaTimes
                                      className='text-2xl'
                                      onClick={() => {
                                        setPilihanDataSalah({
                                          ...pilihanDataSalah,
                                          fAdaGigiDesidus: '',
                                        });
                                        setDataRetenSalah({
                                          ...dataRetenSalah,
                                          fAdaGigiDesidus: '',
                                        });
                                        setConfirmData({
                                          ...confirmData,
                                          pilihanDataSalah: {
                                            ...pilihanDataSalah,
                                            fAdaGigiDesidus: '',
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
                            {pilihanDataSalah.fAdaGigiDesidusCBox === true && (
                              <div className='flex flex-row items-center pl-5 bg-user11 bg-opacity-50 mb-1'>
                                <p className='text-sm font-m lowercase'>f: </p>
                                <span className='text-user6'>*</span>
                                <input
                                  disabled={disableSalah}
                                  required
                                  min='0'
                                  max='20'
                                  type='number'
                                  name='f-ada-status-gigi-desidus'
                                  id='f-ada-status-gigi-desidus'
                                  value={pilihanDataSalah.fAdaGigiDesidus}
                                  onChange={(e) => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      fAdaGigiDesidus: e.target.value,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      fAdaGigiDesidus: e.target.value,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        fAdaGigiDesidus: e.target.value,
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
                            <div
                              className={`${
                                pilihanDataSalah.xAdaGigiDesidusCBox &&
                                'bg-user9 bg-opacity-20'
                              } flex items-center flex-row pl-5`}
                            >
                              <p className='text-sm font-m lowercase'>x: </p>
                              <span className='text-user6'>*</span>
                              <input
                                disabled={isDisabled}
                                required
                                min='0'
                                max='20'
                                type='number'
                                name='x-ada-status-gigi-desidus'
                                id='x-ada-status-gigi-desidus'
                                value={xAdaGigiDesidus}
                                onChange={(e) => {
                                  setXAdaGigiDesidus(e.target.value);
                                  setConfirmData({
                                    ...confirmData,
                                    xAdaGigiDesidus: e.target.value,
                                  });
                                }}
                                className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              />
                              <div className='relative'>
                                <input
                                  disabled={disableSalah}
                                  type='checkbox'
                                  name='x-ada-status-gigi-desidus-reten-salah-cbox'
                                  id='x-ada-status-gigi-desidus-reten-salah-cbox'
                                  checked={pilihanDataSalah.xAdaGigiDesidusCBox}
                                  onChange={() => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      xAdaGigiDesidusCBox:
                                        !pilihanDataSalah.xAdaGigiDesidusCBox,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      dAdaGigiDesidusCBox:
                                        !pilihanDataSalah.xAdaGigiDesidusCBox,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        xAdaGigiDesidusCBox:
                                          !pilihanDataSalah.xAdaGigiDesidusCBox,
                                      },
                                    });
                                  }}
                                  className='peer hidden'
                                />
                                <label
                                  htmlFor='x-ada-status-gigi-desidus-reten-salah-cbox'
                                  className={` ${
                                    disableSalah === true
                                      ? 'pointer-events-none'
                                      : 'cursor-pointer '
                                  } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                >
                                  {pilihanDataSalah.xAdaGigiDesidusCBox ===
                                  true ? (
                                    <FaTimes
                                      className='text-2xl'
                                      onClick={() => {
                                        setPilihanDataSalah({
                                          ...pilihanDataSalah,
                                          xAdaGigiDesidus: '',
                                        });
                                        setDataRetenSalah({
                                          ...dataRetenSalah,
                                          xAdaGigiDesidus: '',
                                        });
                                        setConfirmData({
                                          ...confirmData,
                                          pilihanDataSalah: {
                                            ...pilihanDataSalah,
                                            xAdaGigiDesidus: '',
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
                            {pilihanDataSalah.xAdaGigiDesidusCBox === true && (
                              <div className='flex flex-row items-center pl-5 bg-user11 bg-opacity-50 mb-1'>
                                <p className='text-sm font-m lowercase'>x: </p>
                                <span className='text-user6'>*</span>
                                <input
                                  disabled={disableSalah}
                                  required
                                  min='0'
                                  max='20'
                                  type='number'
                                  name='x-ada-status-gigi-desidus'
                                  id='x-ada-status-gigi-desidus'
                                  value={pilihanDataSalah.xAdaGigiDesidus}
                                  onChange={(e) => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      xAdaGigiDesidus: e.target.value,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      xAdaGigiDesidus: e.target.value,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        xAdaGigiDesidus: e.target.value,
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
                        {sumDMFXDesidus > 20 && (
                          <p className='text-user6 font-semibold'>
                            jumlah <span className='lowercase'>dmfx</span>
                            tidak boleh melebihi 20
                          </p>
                        )}
                      </div>
                      <div className='shadow-lg shadow-user4 rounded-md auto-rows-min'>
                        <h4 className='font-bold flex flex-row pl-5'>
                          Status Gigi Kekal
                          {adaDesidus === true || adaKekal === true ? null : (
                            <span className='text-user6'>*</span>
                          )}
                        </h4>
                        <div className='grid grid-cols-1'>
                          <div
                            className={`${
                              pilihanDataSalah.adaKekalCBox && 'grid-rows-2'
                            } grid px-3 pt-1`}
                          >
                            <div
                              className={`${
                                pilihanDataSalah.adaKekalCBox &&
                                'bg-user9 bg-opacity-20'
                              } flex items-center flex-row justify-center `}
                            >
                              <input
                                disabled={isDisabled}
                                required={
                                  adaDesidus === true || adaKekal === true
                                    ? false
                                    : true
                                }
                                type='checkbox'
                                name='ada-kekal'
                                id='ada-kekal'
                                checked={adaKekal}
                                onChange={() => {
                                  setAdaKekal(!adaKekal);
                                  setConfirmData({
                                    ...confirmData,
                                    adaKekal: !adaKekal,
                                  });
                                }}
                                className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2'
                              />
                              <label
                                htmlFor='ada-kekal'
                                className='m-2 text-sm font-m'
                              >
                                ada gigi kekal
                              </label>
                              <div className='relative'>
                                <input
                                  disabled={disableSalah}
                                  type='checkbox'
                                  name='ada-kekal-reten-salah-cbox'
                                  id='ada-kekal-reten-salah-cbox'
                                  checked={pilihanDataSalah.adaKekalCBox}
                                  onChange={() => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      adaKekalCBox:
                                        !pilihanDataSalah.adaKekalCBox,
                                      adaKekal: !adaKekal,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      adaKekalCBox:
                                        !pilihanDataSalah.adaKekalCBox,
                                      adaKekal: !adaKekal,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        adaKekalCBox:
                                          !pilihanDataSalah.adaKekalCBox,
                                        adaKekal: !adaKekal,
                                      },
                                    });
                                  }}
                                  className='peer hidden'
                                />
                                <label
                                  htmlFor='ada-kekal-reten-salah-cbox'
                                  className=' text-user9 h-6 w-6 rounded-full flex items-center justify-center cursor-pointer'
                                >
                                  {pilihanDataSalah.adaKekalCBox === true ? (
                                    <FaTimes className='text-2xl' />
                                  ) : (
                                    <FaRegHandPointLeft className='text-2xl' />
                                  )}
                                </label>
                              </div>
                            </div>
                            {pilihanDataSalah.adaKekalCBox === true && (
                              <div className='flex items-center flex-row justify-center bg-user11 bg-opacity-50 mb-1'>
                                <input
                                  disabled
                                  type='checkbox'
                                  name='ada-kekal-reten-salah'
                                  id='ada-kekal-reten-salah'
                                  checked={pilihanDataSalah.adaKekal}
                                  className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                                />
                                <label
                                  htmlFor='ada-kekal-reten-salah'
                                  className='mx-2 text-sm font-m'
                                >
                                  ada gigi kekal
                                </label>
                                <span className='text-kaunter4'>
                                  <FaCheck className='text-2xl' />
                                </span>
                              </div>
                            )}
                          </div>
                          <div className='grid grid-cols-1 px-1'>
                            <article className='grid grid-cols-1 border border-userBlack p-1 rounded-md m-1'>
                              <div
                                className={`${
                                  pilihanDataSalah.dAdaGigiKekalCBox &&
                                  'bg-user9 bg-opacity-20'
                                } flex items-center flex-row pl-5`}
                              >
                                <p className='text-sm font-m '>D: </p>
                                <span className='text-user6'>*</span>
                                <input
                                  disabled={isDisabled}
                                  required
                                  min='0'
                                  max='32'
                                  type='number'
                                  name='d-ada-status-gigi-kekal'
                                  id='d-ada-status-gigi-kekal'
                                  value={dAdaGigiKekal}
                                  onChange={(e) => {
                                    setDAdaGigiKekal(e.target.value);
                                    setConfirmData({
                                      ...confirmData,
                                      dAdaGigiKekal: e.target.value,
                                    });
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                />
                                <div className='relative'>
                                  <input
                                    disabled={disableSalah}
                                    type='checkbox'
                                    name='d-ada-status-gigi-kekal-reten-salah-cbox'
                                    id='d-ada-status-gigi-kekal-reten-salah-cbox'
                                    checked={pilihanDataSalah.dAdaGigiKekalCBox}
                                    onChange={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        dAdaGigiKekalCBox:
                                          !pilihanDataSalah.dAdaGigiKekalCBox,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        dAdaGigiKekalCBox:
                                          !pilihanDataSalah.dAdaGigiKekalCBox,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          dAdaGigiKekalCBox:
                                            !pilihanDataSalah.dAdaGigiKekalCBox,
                                        },
                                      });
                                    }}
                                    className='peer hidden'
                                  />
                                  <label
                                    htmlFor='d-ada-status-gigi-kekal-reten-salah-cbox'
                                    className={` ${
                                      disableSalah === true
                                        ? 'pointer-events-none'
                                        : 'cursor-pointer '
                                    } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                  >
                                    {pilihanDataSalah.dAdaGigiKekalCBox ===
                                    true ? (
                                      <FaTimes
                                        className='text-2xl'
                                        onClick={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            dAdaGigiKekal: '',
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            dAdaGigiKekal: '',
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              dAdaGigiKekal: '',
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
                              {pilihanDataSalah.dAdaGigiKekalCBox === true && (
                                <div className='flex flex-row items-center pl-5 bg-user11 bg-opacity-50 mb-1'>
                                  <p className='text-sm font-m'>D: </p>
                                  <span className='text-user6'>*</span>
                                  <input
                                    disabled={disableSalah}
                                    required
                                    min='0'
                                    max='32'
                                    type='number'
                                    name='d-ada-status-gigi-kekal'
                                    id='d-ada-status-gigi-kekal'
                                    value={pilihanDataSalah.dAdaGigiKekal}
                                    onChange={(e) => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        dAdaGigiKekal: e.target.value,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        dAdaGigiKekal: e.target.value,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          dAdaGigiKekal: e.target.value,
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
                              <div
                                className={`${
                                  pilihanDataSalah.classIDCBox &&
                                  'bg-user9 bg-opacity-20'
                                } flex items-center flex-row pl-5`}
                              >
                                <p className='text-sm font-m '>Class I: </p>
                                <input
                                  disabled={isDisabled}
                                  min='0'
                                  max='32'
                                  type='number'
                                  name='class-1-d'
                                  id='class-1-d'
                                  value={classID}
                                  onChange={(e) => {
                                    setClassID(e.target.value);
                                    setConfirmData({
                                      ...confirmData,
                                      classID: e.target.value,
                                    });
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                />
                                <div className='relative'>
                                  <input
                                    disabled={disableSalah}
                                    type='checkbox'
                                    name='class-1-d-reten-salah-cbox'
                                    id='class-1-d-reten-salah-cbox'
                                    checked={pilihanDataSalah.classIDCBox}
                                    onChange={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        classIDCBox:
                                          !pilihanDataSalah.classIDCBox,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        classIDCBox:
                                          !pilihanDataSalah.classIDCBox,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          classIDCBox:
                                            !pilihanDataSalah.classIDCBox,
                                        },
                                      });
                                    }}
                                    className='peer hidden'
                                  />
                                  <label
                                    htmlFor='class-1-d-reten-salah-cbox'
                                    className={` ${
                                      disableSalah === true
                                        ? 'pointer-events-none'
                                        : 'cursor-pointer '
                                    } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                  >
                                    {pilihanDataSalah.classIDCBox === true ? (
                                      <FaTimes
                                        className='text-2xl'
                                        onClick={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            classID: '',
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            classID: '',
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              classID: '',
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
                              {pilihanDataSalah.classIDCBox === true && (
                                <div className='flex flex-row items-center pl-5 bg-user11 bg-opacity-50 mb-1'>
                                  <p className='text-sm font-m'>Class I: </p>
                                  <input
                                    disabled={disableSalah}
                                    required
                                    min='0'
                                    max='32'
                                    type='number'
                                    name='class-1-d'
                                    id='class-1-d'
                                    value={pilihanDataSalah.classID}
                                    onChange={(e) => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        classID: e.target.value,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        classID: e.target.value,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          classID: e.target.value,
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
                              <div
                                className={`${
                                  pilihanDataSalah.classIIDCBox &&
                                  'bg-user9 bg-opacity-20'
                                } flex items-center flex-row pl-5`}
                              >
                                <p className='text-sm font-m '>Class II: </p>
                                <input
                                  disabled={isDisabled}
                                  min='0'
                                  max='32'
                                  type='number'
                                  name='class-2-d'
                                  id='class-2-d'
                                  value={classIID}
                                  onChange={(e) => {
                                    setClassIID(e.target.value);
                                    setConfirmData({
                                      ...confirmData,
                                      classIID: e.target.value,
                                    });
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                />
                                <div className='relative'>
                                  <input
                                    disabled={disableSalah}
                                    type='checkbox'
                                    name='class-2-d-reten-salah-cbox'
                                    id='class-2-d-reten-salah-cbox'
                                    checked={pilihanDataSalah.classIIDCBox}
                                    onChange={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        classIIDCBox:
                                          !pilihanDataSalah.classIIDCBox,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        classIIDCBox:
                                          !pilihanDataSalah.classIIDCBox,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          classIIDCBox:
                                            !pilihanDataSalah.classIIDCBox,
                                        },
                                      });
                                    }}
                                    className='peer hidden'
                                  />
                                  <label
                                    htmlFor='class-2-d-reten-salah-cbox'
                                    className={` ${
                                      disableSalah === true
                                        ? 'pointer-events-none'
                                        : 'cursor-pointer '
                                    } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                  >
                                    {pilihanDataSalah.classIIDCBox === true ? (
                                      <FaTimes
                                        className='text-2xl'
                                        onClick={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            classIID: '',
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            classIID: '',
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              classIID: '',
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
                              {pilihanDataSalah.classIIDCBox === true && (
                                <div className='flex flex-row items-center pl-5 bg-user11 bg-opacity-50 mb-1'>
                                  <p className='text-sm font-m'>Class II: </p>
                                  <input
                                    disabled={disableSalah}
                                    required
                                    min='0'
                                    max='32'
                                    type='number'
                                    name='class-2-d'
                                    id='class-2-d'
                                    value={pilihanDataSalah.classIID}
                                    onChange={(e) => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        classIID: e.target.value,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        classIID: e.target.value,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          classIID: e.target.value,
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
                              {sumClassD > dAdaGigiKekal && (
                                <p className='text-user6 font-semibold'>
                                  jumlah class I + class II D tidak boleh
                                  melebihi jumlah D
                                </p>
                              )}
                            </article>
                            <div
                              className={`${
                                pilihanDataSalah.mAdaGigiKekalCBox &&
                                'bg-user9 bg-opacity-20'
                              } flex items-center flex-row pl-5 mt-1`}
                            >
                              <p className='text-sm font-m '>M: </p>
                              <span className='text-user6'>*</span>
                              <input
                                disabled={isDisabled}
                                required
                                min='0'
                                max='32'
                                type='number'
                                name='m-ada-status-gigi-kekal'
                                id='m-ada-status-gigi-kekal'
                                value={mAdaGigiKekal}
                                onChange={(e) => {
                                  setMAdaGigiKekal(e.target.value);
                                  setConfirmData({
                                    ...confirmData,
                                    mAdaGigiKekal: e.target.value,
                                  });
                                }}
                                className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              />
                              <div className='relative'>
                                <input
                                  disabled={disableSalah}
                                  type='checkbox'
                                  name='m-ada-status-gigi-kekal-reten-salah-cbox'
                                  id='m-ada-status-gigi-kekal-reten-salah-cbox'
                                  checked={pilihanDataSalah.mAdaGigiKekalCBox}
                                  onChange={() => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      mAdaGigiKekalCBox:
                                        !pilihanDataSalah.mAdaGigiKekalCBox,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      mAdaGigiKekalCBox:
                                        !pilihanDataSalah.mAdaGigiKekalCBox,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        mAdaGigiKekalCBox:
                                          !pilihanDataSalah.mAdaGigiKekalCBox,
                                      },
                                    });
                                  }}
                                  className='peer hidden'
                                />
                                <label
                                  htmlFor='m-ada-status-gigi-kekal-reten-salah-cbox'
                                  className={` ${
                                    disableSalah === true
                                      ? 'pointer-events-none'
                                      : 'cursor-pointer '
                                  } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                >
                                  {pilihanDataSalah.mAdaGigiKekalCBox ===
                                  true ? (
                                    <FaTimes
                                      className='text-2xl'
                                      onClick={() => {
                                        setPilihanDataSalah({
                                          ...pilihanDataSalah,
                                          mAdaGigiKekal: '',
                                        });
                                        setDataRetenSalah({
                                          ...dataRetenSalah,
                                          mAdaGigiKekal: '',
                                        });
                                        setConfirmData({
                                          ...confirmData,
                                          pilihanDataSalah: {
                                            ...pilihanDataSalah,
                                            mAdaGigiKekal: '',
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
                            {pilihanDataSalah.mAdaGigiKekalCBox === true && (
                              <div className='flex flex-row items-center pl-5 bg-user11 bg-opacity-50 mb-1'>
                                <p className='text-sm font-m'>M: </p>
                                <span className='text-user6'>*</span>
                                <input
                                  disabled={disableSalah}
                                  required
                                  min='0'
                                  max='32'
                                  type='number'
                                  name='m-ada-status-gigi-kekal'
                                  id='m-ada-status-gigi-kekal'
                                  value={pilihanDataSalah.mAdaGigiKekal}
                                  onChange={(e) => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      mAdaGigiKekal: e.target.value,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      mAdaGigiKekal: e.target.value,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        mAdaGigiKekal: e.target.value,
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
                            <article className='grid grid-cols-1 border border-userBlack p-2 rounded-md m-1'>
                              <div
                                className={`${
                                  pilihanDataSalah.fAdaGigiKekalCBox &&
                                  'bg-user9 bg-opacity-20'
                                } flex items-center flex-row pl-5`}
                              >
                                <p className='text-sm font-m '>F: </p>
                                <span className='text-user6'>*</span>
                                <input
                                  disabled={isDisabled}
                                  required
                                  min='0'
                                  max='32'
                                  type='number'
                                  name='f-ada-status-gigi-kekal'
                                  id='f-ada-status-gigi-kekal'
                                  value={fAdaGigiKekal}
                                  onChange={(e) => {
                                    setFAdaGigiKekal(e.target.value);
                                    setConfirmData({
                                      ...confirmData,
                                      fAdaGigiKekal: e.target.value,
                                    });
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                />
                                <div className='relative'>
                                  <input
                                    disabled={disableSalah}
                                    type='checkbox'
                                    name='f-ada-status-gigi-kekal-reten-salah-cbox'
                                    id='f-ada-status-gigi-kekal-reten-salah-cbox'
                                    checked={pilihanDataSalah.fAdaGigiKekalCBox}
                                    onChange={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        fAdaGigiKekalCBox:
                                          !pilihanDataSalah.fAdaGigiKekalCBox,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        fAdaGigiKekalCBox:
                                          !pilihanDataSalah.fAdaGigiKekalCBox,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          fAdaGigiKekalCBox:
                                            !pilihanDataSalah.fAdaGigiKekalCBox,
                                        },
                                      });
                                    }}
                                    className='peer hidden'
                                  />
                                  <label
                                    htmlFor='f-ada-status-gigi-kekal-reten-salah-cbox'
                                    className={` ${
                                      disableSalah === true
                                        ? 'pointer-events-none'
                                        : 'cursor-pointer '
                                    } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                  >
                                    {pilihanDataSalah.fAdaGigiKekalCBox ===
                                    true ? (
                                      <FaTimes
                                        className='text-2xl'
                                        onClick={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            fAdaGigiKekal: '',
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            fAdaGigiKekal: '',
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              fAdaGigiKekal: '',
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
                              {pilihanDataSalah.fAdaGigiKekalCBox === true && (
                                <div className='flex flex-row items-center pl-5 bg-user11 bg-opacity-50 mb-1'>
                                  <p className='text-sm font-m'>F: </p>
                                  <span className='text-user6'>*</span>
                                  <input
                                    disabled={disableSalah}
                                    required
                                    min='0'
                                    max='32'
                                    type='number'
                                    name='f-ada-status-gigi-kekal'
                                    id='f-ada-status-gigi-kekal'
                                    value={pilihanDataSalah.fAdaGigiKekal}
                                    onChange={(e) => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        fAdaGigiKekal: e.target.value,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        fAdaGigiKekal: e.target.value,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          fAdaGigiKekal: e.target.value,
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
                              <div
                                className={`${
                                  pilihanDataSalah.classIFCBox &&
                                  'bg-user9 bg-opacity-20'
                                } flex items-center flex-row pl-5`}
                              >
                                <p className='text-sm font-m '>Class I: </p>
                                <input
                                  disabled={isDisabled}
                                  min='0'
                                  max='32'
                                  type='number'
                                  name='class-1-f'
                                  id='class-1-f'
                                  value={classIF}
                                  onChange={(e) => {
                                    setClassIF(e.target.value);
                                    setConfirmData({
                                      ...confirmData,
                                      classIF: e.target.value,
                                    });
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                />
                                <div className='relative'>
                                  <input
                                    disabled={disableSalah}
                                    type='checkbox'
                                    name='class-1-f-reten-salah-cbox'
                                    id='class-1-f-reten-salah-cbox'
                                    checked={pilihanDataSalah.classIFCBox}
                                    onChange={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        classIFCBox:
                                          !pilihanDataSalah.classIFCBox,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        classIFCBox:
                                          !pilihanDataSalah.classIFCBox,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          classIFCBox:
                                            !pilihanDataSalah.classIFCBox,
                                        },
                                      });
                                    }}
                                    className='peer hidden'
                                  />
                                  <label
                                    htmlFor='class-1-f-reten-salah-cbox'
                                    className={` ${
                                      disableSalah === true
                                        ? 'pointer-events-none'
                                        : 'cursor-pointer '
                                    } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                  >
                                    {pilihanDataSalah.classIFCBox === true ? (
                                      <FaTimes
                                        className='text-2xl'
                                        onClick={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            classIF: '',
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            classIF: '',
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              classIF: '',
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
                              {pilihanDataSalah.classIFCBox === true && (
                                <div className='flex flex-row items-center pl-5 bg-user11 bg-opacity-50 mb-1'>
                                  <p className='text-sm font-m'>Class I: </p>
                                  <input
                                    disabled={disableSalah}
                                    required
                                    min='0'
                                    max='32'
                                    type='number'
                                    name='class-1-f'
                                    id='class-1-f'
                                    value={pilihanDataSalah.classIF}
                                    onChange={(e) => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        classIF: e.target.value,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        classIF: e.target.value,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          classIF: e.target.value,
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
                              <div
                                className={`${
                                  pilihanDataSalah.classIIFCBox &&
                                  'bg-user9 bg-opacity-20'
                                } flex items-center flex-row pl-5`}
                              >
                                <p className='text-sm font-m '>Class II: </p>
                                <input
                                  disabled={isDisabled}
                                  min='0'
                                  max='32'
                                  type='number'
                                  name='class-2-f'
                                  id='class-2-f'
                                  value={classIIF}
                                  onChange={(e) => {
                                    setClassIIF(e.target.value);
                                    setConfirmData({
                                      ...confirmData,
                                      classIIF: e.target.value,
                                    });
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                />
                                <div className='relative'>
                                  <input
                                    disabled={disableSalah}
                                    type='checkbox'
                                    name='class-2-f-reten-salah-cbox'
                                    id='class-2-f-reten-salah-cbox'
                                    checked={pilihanDataSalah.classIIFCBox}
                                    onChange={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        classIIFCBox:
                                          !pilihanDataSalah.classIIFCBox,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        classIIFCBox:
                                          !pilihanDataSalah.classIIFCBox,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          classIIFCBox:
                                            !pilihanDataSalah.classIIFCBox,
                                        },
                                      });
                                    }}
                                    className='peer hidden'
                                  />
                                  <label
                                    htmlFor='class-2-f-reten-salah-cbox'
                                    className={` ${
                                      disableSalah === true
                                        ? 'pointer-events-none'
                                        : 'cursor-pointer '
                                    } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                  >
                                    {pilihanDataSalah.classIIFCBox === true ? (
                                      <FaTimes
                                        className='text-2xl'
                                        onClick={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            classIIF: '',
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            classIIF: '',
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              classIIF: '',
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
                              {pilihanDataSalah.classIIFCBox === true && (
                                <div className='flex flex-row items-center pl-5 bg-user11 bg-opacity-50 mb-1'>
                                  <p className='text-sm font-m'>Class II: </p>
                                  <input
                                    disabled={disableSalah}
                                    required
                                    min='0'
                                    max='32'
                                    type='number'
                                    name='class-2-f'
                                    id='class-2-f'
                                    value={pilihanDataSalah.classIIF}
                                    onChange={(e) => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        classIIF: e.target.value,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        classIIF: e.target.value,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          classIIF: e.target.value,
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
                              {sumClassF > fAdaGigiKekal && (
                                <p className='text-user6 font-semibold'>
                                  jumlah class I + class II F tidak boleh
                                  melebihi jumlah F
                                </p>
                              )}
                            </article>
                            <div
                              className={`${
                                pilihanDataSalah.xAdaGigiKekalCBox &&
                                'bg-user9 bg-opacity-20'
                              } flex items-center flex-row pl-5 mt-1`}
                            >
                              <p className='text-sm font-m '>X: </p>
                              <span className='text-user6'>*</span>
                              <input
                                disabled={isDisabled}
                                required
                                min='0'
                                max='32'
                                type='number'
                                name='x-ada-status-gigi-kekal'
                                id='x-ada-status-gigi-kekal'
                                value={xAdaGigiKekal}
                                onChange={(e) => {
                                  setXAdaGigiKekal(e.target.value);
                                  setConfirmData({
                                    ...confirmData,
                                    xAdaGigiKekal: e.target.value,
                                  });
                                }}
                                className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              />
                              <div className='relative'>
                                <input
                                  disabled={disableSalah}
                                  type='checkbox'
                                  name='x-ada-status-gigi-kekal-reten-salah-cbox'
                                  id='x-ada-status-gigi-kekal-reten-salah-cbox'
                                  checked={pilihanDataSalah.xAdaGigiKekalCBox}
                                  onChange={() => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      xAdaGigiKekalCBox:
                                        !pilihanDataSalah.xAdaGigiKekalCBox,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      xAdaGigiKekalCBox:
                                        !pilihanDataSalah.xAdaGigiKekalCBox,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        xAdaGigiKekalCBox:
                                          !pilihanDataSalah.xAdaGigiKekalCBox,
                                      },
                                    });
                                  }}
                                  className='peer hidden'
                                />
                                <label
                                  htmlFor='x-ada-status-gigi-kekal-reten-salah-cbox'
                                  className={` ${
                                    disableSalah === true
                                      ? 'pointer-events-none'
                                      : 'cursor-pointer '
                                  } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                >
                                  {pilihanDataSalah.xAdaGigiKekalCBox ===
                                  true ? (
                                    <FaTimes
                                      className='text-2xl'
                                      onClick={() => {
                                        setPilihanDataSalah({
                                          ...pilihanDataSalah,
                                          xAdaGigiKekal: '',
                                        });
                                        setDataRetenSalah({
                                          ...dataRetenSalah,
                                          xAdaGigiKekal: '',
                                        });
                                        setConfirmData({
                                          ...confirmData,
                                          pilihanDataSalah: {
                                            ...pilihanDataSalah,
                                            xAdaGigiKekal: '',
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
                            {pilihanDataSalah.xAdaGigiKekalCBox === true && (
                              <div className='flex flex-row items-center pl-5 bg-user11 bg-opacity-50 mb-1'>
                                <p className='text-sm font-m'>X: </p>
                                <span className='text-user6'>*</span>
                                <input
                                  disabled={disableSalah}
                                  required
                                  min='0'
                                  max='32'
                                  type='number'
                                  name='x-ada-status-gigi-kekal'
                                  id='x-ada-status-gigi-kekal'
                                  value={pilihanDataSalah.xAdaGigiKekal}
                                  onChange={(e) => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      xAdaGigiKekal: e.target.value,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      xAdaGigiKekal: e.target.value,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        xAdaGigiKekal: e.target.value,
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
                            <div
                              className={`${
                                pilihanDataSalah.eAdaGigiKekalCBox &&
                                'bg-user9 bg-opacity-20'
                              } flex items-center flex-row pl-5 mt-1`}
                            >
                              <p className='text-sm font-m '>E: </p>
                              <span className='text-user6'>*</span>
                              <input
                                disabled={isDisabled}
                                required
                                min='0'
                                max='32'
                                type='number'
                                name='e-ada-status-gigi-kekal'
                                id='e-ada-status-gigi-kekal'
                                value={eAdaGigiKekal}
                                onChange={(e) => {
                                  setEAdaGigiKekal(e.target.value);
                                  setConfirmData({
                                    ...confirmData,
                                    eAdaGigiKekal: e.target.value,
                                  });
                                }}
                                className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              />
                              <div className='relative'>
                                <input
                                  disabled={disableSalah}
                                  type='checkbox'
                                  name='e-ada-status-gigi-kekal-reten-salah-cbox'
                                  id='e-ada-status-gigi-kekal-reten-salah-cbox'
                                  checked={pilihanDataSalah.eAdaGigiKekalCBox}
                                  onChange={() => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      eAdaGigiKekalCBox:
                                        !pilihanDataSalah.eAdaGigiKekalCBox,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      eAdaGigiKekalCBox:
                                        !pilihanDataSalah.eAdaGigiKekalCBox,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        eAdaGigiKekalCBox:
                                          !pilihanDataSalah.eAdaGigiKekalCBox,
                                      },
                                    });
                                  }}
                                  className='peer hidden'
                                />
                                <label
                                  htmlFor='e-ada-status-gigi-kekal-reten-salah-cbox'
                                  className={` ${
                                    disableSalah === true
                                      ? 'pointer-events-none'
                                      : 'cursor-pointer '
                                  } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                >
                                  {pilihanDataSalah.eAdaGigiKekalCBox ===
                                  true ? (
                                    <FaTimes
                                      className='text-2xl'
                                      onClick={() => {
                                        setPilihanDataSalah({
                                          ...pilihanDataSalah,
                                          eAdaGigiKekal: '',
                                        });
                                        setDataRetenSalah({
                                          ...dataRetenSalah,
                                          eAdaGigiKekal: '',
                                        });
                                        setConfirmData({
                                          ...confirmData,
                                          pilihanDataSalah: {
                                            ...pilihanDataSalah,
                                            eAdaGigiKekal: '',
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
                            {pilihanDataSalah.eAdaGigiKekalCBox === true && (
                              <div className='flex flex-row items-center pl-5 bg-user11 bg-opacity-50 mb-1'>
                                <p className='text-sm font-m'>E: </p>
                                <span className='text-user6'>*</span>
                                <input
                                  disabled={disableSalah}
                                  required
                                  min='0'
                                  max='32'
                                  type='number'
                                  name='e-ada-status-gigi-kekal'
                                  id='e-ada-status-gigi-kekal'
                                  value={pilihanDataSalah.eAdaGigiKekal}
                                  onChange={(e) => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      eAdaGigiKekal: e.target.value,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      eAdaGigiKekal: e.target.value,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        eAdaGigiKekal: e.target.value,
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
                        {sumDMFXKekal > 32 && (
                          <p className='text-user6 font-semibold'>
                            jumlah DMFX tidak boleh melebihi 32
                          </p>
                        )}
                      </div>
                    </article>
                    <div className='grid gap-2'>
                      <article className='border border-userBlack pl-3 p-2 rounded-md'>
                        <div className='grid grid-cols-1'>
                          <h4 className='flex flex-row pl-5 items-center'>
                            <p className='font-bold'>Risiko Karies </p>
                            <span className='text-user6 text-xl'>*</span>
                            <input
                              disabled
                              type='text'
                              name='penanda-risiko-karies'
                              id='penanda-risiko-karies'
                              value={
                                penandaRisikoKaries
                                  ? penandaRisikoKaries
                                  : 'Sila Isi Jumlah Faktor Risiko'
                              }
                              onChange={(e) => {
                                setPenandaRisikoKaries(e.target.value);
                                setConfirmData({
                                  ...confirmData,
                                  penandaRisikoKaries: e.target.value,
                                });
                              }}
                              className={`appearance-none capitalize ml-3 h-8 py-1 text-userBlack border border-user1 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent ${
                                penandaRisikoKaries === 'rendah'
                                  ? 'bg-user7 w-24 px-2 '
                                  : penandaRisikoKaries === 'sederhana'
                                  ? 'bg-user8 w-24 px-2 '
                                  : penandaRisikoKaries === 'tinggi'
                                  ? 'bg-user9 w-24 px-2 '
                                  : 'w-40 text-xs font-light px-1'
                              }`}
                            />
                          </h4>
                          <div className='flex flex-row items-center '>
                            <div
                              className={`${
                                pilihanDataSalah.jumlahFaktorRisikoCBox &&
                                'grid-rows-2'
                              } grid pt-1`}
                            >
                              <div
                                className={`${
                                  pilihanDataSalah.jumlahFaktorRisikoCBox &&
                                  'bg-user9 bg-opacity-20'
                                } flex items-center flex-row pl-2`}
                              >
                                <p className='flex items-center flex-row pl-5 text-sm'>
                                  Jumlah Faktor Risiko:
                                </p>
                                <select
                                  disabled={
                                    yaTidakPesakitMempunyaiGigi === ''
                                      ? true
                                      : isDisabled
                                  }
                                  required
                                  name='jumlah-faktor-risiko'
                                  id='jumlah-faktor-risiko'
                                  value={jumlahFaktorRisiko}
                                  onChange={(e) => {
                                    setJumlahFaktorRisiko(e.target.value);
                                    setConfirmData({
                                      ...confirmData,
                                      jumlahFaktorRisiko: e.target.value,
                                    });
                                  }}
                                  className='appearance-none w-16 border-b-4 mx-3 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                >
                                  <option value=''></option>
                                  <option value='0'>0</option>
                                  <option value='1'>1</option>
                                  <option value='2'>2</option>
                                  <option value='3'>3</option>
                                  <option value='4'>4</option>
                                  <option value='5'>5</option>
                                  <option value='6'>6</option>
                                  <option value='7'>7</option>
                                  <option value='8'>8</option>
                                </select>
                                <div className='relative'>
                                  <input
                                    disabled={disableSalah}
                                    type='checkbox'
                                    name='jumlah-faktor-risiko-reten-salah-cbox'
                                    id='jumlah-faktor-risiko-reten-salah-cbox'
                                    checked={
                                      pilihanDataSalah.jumlahFaktorRisikoCBox
                                    }
                                    onChange={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        jumlahFaktorRisikoCBox:
                                          !pilihanDataSalah.jumlahFaktorRisikoCBox,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        jumlahFaktorRisikoCBox:
                                          !pilihanDataSalah.jumlahFaktorRisikoCBox,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          jumlahFaktorRisikoCBox:
                                            !pilihanDataSalah.jumlahFaktorRisikoCBox,
                                        },
                                      });
                                    }}
                                    className='peer hidden'
                                  />
                                  <label
                                    htmlFor='jumlah-faktor-risiko-reten-salah-cbox'
                                    className={` ${
                                      disableSalah === true
                                        ? 'pointer-events-none'
                                        : 'cursor-pointer '
                                    } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                  >
                                    {pilihanDataSalah.jumlahFaktorRisikoCBox ===
                                    true ? (
                                      <FaTimes
                                        className='text-2xl'
                                        onClick={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            jumlahFaktorRisiko: '',
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            jumlahFaktorRisiko: '',
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              jumlahFaktorRisiko: '',
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
                              {pilihanDataSalah.jumlahFaktorRisikoCBox ===
                                true && (
                                <div className='flex items-center flex-row pl-2 bg-user11 bg-opacity-50 mb-1'>
                                  <p className='flex flex-row pl-5 text-sm font-m'>
                                    Jumlah Faktor Risiko:
                                  </p>
                                  <select
                                    name='jumlah-faktor-risiko'
                                    id='jumlah-faktor-risiko'
                                    value={pilihanDataSalah.jumlahFaktorRisiko}
                                    onChange={(e) => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        jumlahFaktorRisiko: e.target.value,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        jumlahFaktorRisiko: e.target.value,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          jumlahFaktorRisiko: e.target.value,
                                        },
                                      });
                                    }}
                                    className='appearance-none w-16 border-b-4 mx-3 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                  >
                                    {jumlahFaktorRisiko === '1' ? (
                                      <>
                                        <option value=''></option>
                                        <option value='0'>0</option>
                                        <option value='2'>2</option>
                                        <option value='3'>3</option>
                                        <option value='4'>4</option>
                                        <option value='5'>5</option>
                                        <option value='6'>6</option>
                                        <option value='7'>7</option>
                                        <option value='8'>8</option>
                                      </>
                                    ) : jumlahFaktorRisiko === '2' ? (
                                      <>
                                        <option value=''></option>
                                        <option value='0'>0</option>
                                        <option value='1'>1</option>
                                        <option value='3'>3</option>
                                        <option value='4'>4</option>
                                        <option value='5'>5</option>
                                        <option value='6'>6</option>
                                        <option value='7'>7</option>
                                        <option value='8'>8</option>
                                      </>
                                    ) : jumlahFaktorRisiko === '3' ? (
                                      <>
                                        <option value=''></option>
                                        <option value='0'>0</option>
                                        <option value='1'>1</option>
                                        <option value='2'>2</option>
                                        <option value='4'>4</option>
                                        <option value='5'>5</option>
                                        <option value='6'>6</option>
                                        <option value='7'>7</option>
                                        <option value='8'>8</option>
                                      </>
                                    ) : jumlahFaktorRisiko === '4' ? (
                                      <>
                                        <option value=''></option>
                                        <option value='0'>0</option>
                                        <option value='1'>1</option>
                                        <option value='2'>2</option>
                                        <option value='3'>3</option>
                                        <option value='5'>5</option>
                                        <option value='6'>6</option>
                                        <option value='7'>7</option>
                                        <option value='8'>8</option>
                                      </>
                                    ) : jumlahFaktorRisiko === '5' ? (
                                      <>
                                        <option value=''></option>
                                        <option value='0'>0</option>
                                        <option value='1'>1</option>
                                        <option value='2'>2</option>
                                        <option value='3'>3</option>
                                        <option value='4'>4</option>
                                        <option value='6'>6</option>
                                        <option value='7'>7</option>
                                        <option value='8'>8</option>
                                      </>
                                    ) : jumlahFaktorRisiko === '6' ? (
                                      <>
                                        <option value=''></option>
                                        <option value='0'>0</option>
                                        <option value='1'>1</option>
                                        <option value='2'>2</option>
                                        <option value='3'>3</option>
                                        <option value='4'>4</option>
                                        <option value='5'>5</option>
                                        <option value='7'>7</option>
                                        <option value='8'>8</option>
                                      </>
                                    ) : jumlahFaktorRisiko === '7' ? (
                                      <>
                                        <option value=''></option>
                                        <option value='0'>0</option>
                                        <option value='1'>1</option>
                                        <option value='2'>2</option>
                                        <option value='3'>3</option>
                                        <option value='4'>4</option>
                                        <option value='5'>5</option>
                                        <option value='6'>6</option>
                                        <option value='8'>8</option>
                                      </>
                                    ) : jumlahFaktorRisiko === '8' ? (
                                      <>
                                        <option value=''></option>
                                        <option value='0'>0</option>
                                        <option value='1'>1</option>
                                        <option value='2'>2</option>
                                        <option value='3'>3</option>
                                        <option value='4'>4</option>
                                        <option value='5'>5</option>
                                        <option value='6'>6</option>
                                        <option value='7'>7</option>
                                      </>
                                    ) : (
                                      <>
                                        <option value='0'>0</option>
                                        <option value='1'>1</option>
                                        <option value='2'>2</option>
                                        <option value='3'>3</option>
                                        <option value='4'>4</option>
                                        <option value='5'>5</option>
                                        <option value='6'>6</option>
                                        <option value='7'>7</option>
                                        <option value='8'>8</option>
                                      </>
                                    )}
                                  </select>
                                  <span className='text-kaunter4'>
                                    <FaCheck className='text-2xl' />
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </article>
                      <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md auto-rows-min'>
                        <h4 className='font-bold flex flex-row col-span-2  pb-2 pl-5'>
                          Kehilangan Permukaan Gigi (TSL)
                        </h4>
                        <div
                          className={`${
                            pilihanDataSalah.toothSurfaceLossCBox &&
                            'grid-rows-2'
                          } grid px-3 pl pt-1`}
                        >
                          <div
                            className={`${
                              pilihanDataSalah.toothSurfaceLossCBox &&
                              'bg-user9 bg-opacity-20 p-2'
                            } flex items-center flex-row pl-2`}
                          >
                            <input
                              disabled={isDisabled}
                              type='checkbox'
                              name='tooth-surface-loss'
                              id='tooth-surface-loss'
                              checked={toothSurfaceLoss}
                              onChange={(e) => {
                                setToothSurfaceLoss(!toothSurfaceLoss);
                                setConfirmData({
                                  ...confirmData,
                                  toothSurfaceLoss: !toothSurfaceLoss,
                                });
                              }}
                              className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                            />
                            <label
                              htmlFor='tooth-surface-loss'
                              className='text-sm font-m ml-2'
                            >
                              Kehilangan Permukaan Gigi
                            </label>
                            <div className='relative mx-2'>
                              <input
                                disabled={disableSalah}
                                type='checkbox'
                                name='tooth-surface-loss-reten-salah-cbox'
                                id='tooth-surface-loss-reten-salah-cbox'
                                checked={pilihanDataSalah.toothSurfaceLossCBox}
                                onChange={() => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    toothSurfaceLossCBox:
                                      !pilihanDataSalah.toothSurfaceLossCBox,
                                    toothSurfaceLoss: !toothSurfaceLoss,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    toothSurfaceLossCBox:
                                      !pilihanDataSalah.toothSurfaceLossCBox,
                                    toothSurfaceLoss: !toothSurfaceLoss,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      toothSurfaceLossCBox:
                                        !pilihanDataSalah.toothSurfaceLossCBox,
                                      toothSurfaceLoss: !toothSurfaceLoss,
                                    },
                                  });
                                }}
                                className='peer hidden'
                              />
                              <label
                                htmlFor='tooth-surface-loss-reten-salah-cbox'
                                className=' text-user9 h-6 w-6 rounded-full flex items-center justify-center cursor-pointer'
                              >
                                {pilihanDataSalah.toothSurfaceLossCBox ===
                                true ? (
                                  <FaTimes className='text-2xl' />
                                ) : (
                                  <FaRegHandPointLeft className='text-2xl' />
                                )}
                              </label>
                            </div>
                          </div>
                          {pilihanDataSalah.toothSurfaceLossCBox === true && (
                            <div className='flex items-center flex-row bg-user11 bg-opacity-50 p-2'>
                              <input
                                disabled
                                type='checkbox'
                                name='tooth-surface-loss-reten-salah'
                                id='tooth-surface-loss-reten-salah'
                                checked={pilihanDataSalah.toothSurfaceLoss}
                                className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                              />
                              <label
                                htmlFor='tooth-surface-loss-reten-salah'
                                className='mx-2 text-sm font-m'
                              >
                                Kehilangan Permukaan Gigi
                              </label>
                              <span className='text-kaunter4'>
                                <FaCheck className='text-2xl' />
                              </span>
                            </div>
                          )}
                        </div>
                      </article>
                      <article className='grid grid-cols-1 border border-userBlack pl-3 p-2 rounded-md auto-rows-min'>
                        <h4 className='font-bold flex flex-row pl-5'>Trauma</h4>
                        <div className='grid grid-cols-1 lg:grid-cols-2'>
                          <div
                            className={`${
                              pilihanDataSalah.kecederaanGigiAnteriorTraumaCBox &&
                              'grid-rows-2'
                            } grid px-3 pt-1`}
                          >
                            <div
                              className={`${
                                pilihanDataSalah.kecederaanGigiAnteriorTraumaCBox &&
                                'bg-user9 bg-opacity-20'
                              } flex items-center flex-row pl-2`}
                            >
                              <input
                                disabled={isDisabled}
                                type='checkbox'
                                name='kecederaan-gigi-anterior'
                                id='kecederaan-gigi-anterior'
                                checked={kecederaanGigiAnteriorTrauma}
                                onChange={() => {
                                  setKecederaanGigiAnteriorTrauma(
                                    !kecederaanGigiAnteriorTrauma
                                  );
                                  setConfirmData({
                                    ...confirmData,
                                    kecederaanGigiAnteriorTrauma:
                                      !kecederaanGigiAnteriorTrauma,
                                  });
                                }}
                                className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                              />
                              <label
                                htmlFor='kecederaan-gigi-anterior'
                                className='m-2 text-sm font-m'
                              >
                                Kecederaan Gigi
                              </label>
                              <div className='relative'>
                                <input
                                  disabled={disableSalah}
                                  type='checkbox'
                                  name='kecederaan-gigi-anterior-reten-salah-cbox'
                                  id='kecederaan-gigi-anterior-reten-salah-cbox'
                                  checked={
                                    pilihanDataSalah.kecederaanGigiAnteriorTraumaCBox
                                  }
                                  onChange={() => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      kecederaanGigiAnteriorTraumaCBox:
                                        !pilihanDataSalah.kecederaanGigiAnteriorTraumaCBox,
                                      kecederaanGigiAnteriorTrauma:
                                        !kecederaanGigiAnteriorTrauma,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      kecederaanGigiAnteriorTraumaCBox:
                                        !pilihanDataSalah.kecederaanGigiAnteriorTraumaCBox,
                                      kecederaanGigiAnteriorTrauma:
                                        !kecederaanGigiAnteriorTrauma,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        kecederaanGigiAnteriorTraumaCBox:
                                          !pilihanDataSalah.kecederaanGigiAnteriorTraumaCBox,
                                        kecederaanGigiAnteriorTrauma:
                                          !kecederaanGigiAnteriorTrauma,
                                      },
                                    });
                                  }}
                                  className='peer hidden'
                                />
                                <label
                                  htmlFor='kecederaan-gigi-anterior-reten-salah-cbox'
                                  className=' text-user9 h-6 w-6 rounded-full flex items-center justify-center cursor-pointer'
                                >
                                  {pilihanDataSalah.kecederaanGigiAnteriorTraumaCBox ===
                                  true ? (
                                    <FaTimes className='text-2xl' />
                                  ) : (
                                    <FaRegHandPointLeft className='text-2xl' />
                                  )}
                                </label>
                              </div>
                            </div>
                            {pilihanDataSalah.kecederaanGigiAnteriorTraumaCBox ===
                              true && (
                              <div className='flex items-center flex-row pl-2 bg-user11 bg-opacity-50'>
                                <input
                                  disabled
                                  type='checkbox'
                                  name='kecederaan-gigi-anterior-reten-salah'
                                  id='kecederaan-gigi-anterior-reten-salah'
                                  checked={
                                    pilihanDataSalah.kecederaanGigiAnteriorTrauma
                                  }
                                  className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                                />
                                <label
                                  htmlFor='kecederaan-gigi-anterior-reten-salah'
                                  className='mx-2 text-sm font-m'
                                >
                                  Kecederaan Gigi
                                </label>
                                <span className='text-kaunter4'>
                                  <FaCheck className='text-2xl' />
                                </span>
                              </div>
                            )}
                          </div>
                          <div
                            className={`${
                              pilihanDataSalah.tisuLembutTraumaCBox &&
                              'grid-rows-2'
                            } grid px-3 pt-1`}
                          >
                            <div
                              className={`${
                                pilihanDataSalah.tisuLembutTraumaCBox &&
                                'bg-user9 bg-opacity-20'
                              } flex items-center flex-row pl-2`}
                            >
                              <input
                                disabled={isDisabled}
                                type='checkbox'
                                name='tisu-lembut'
                                id='tisu-lembut'
                                checked={tisuLembutTrauma}
                                onChange={() => {
                                  setTisuLembutTrauma(!tisuLembutTrauma);
                                  setConfirmData({
                                    ...confirmData,
                                    tisuLembutTrauma: !tisuLembutTrauma,
                                  });
                                }}
                                className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                              />
                              <label
                                htmlFor='tisu-lembut'
                                className='m-2 text-sm font-m'
                              >
                                Kecederaan Tisu Lembut
                              </label>
                              <div className='relative'>
                                <input
                                  disabled={disableSalah}
                                  type='checkbox'
                                  name='tisu-lembut-reten-salah-cbox'
                                  id='tisu-lembut-reten-salah-cbox'
                                  checked={
                                    pilihanDataSalah.tisuLembutTraumaCBox
                                  }
                                  onChange={() => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      tisuLembutTraumaCBox:
                                        !pilihanDataSalah.tisuLembutTraumaCBox,
                                      tisuLembutTrauma: !tisuLembutTrauma,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      tisuLembutTraumaCBox:
                                        !pilihanDataSalah.tisuLembutTraumaCBox,
                                      tisuLembutTrauma: !tisuLembutTrauma,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        tisuLembutTraumaCBox:
                                          !pilihanDataSalah.tisuLembutTraumaCBox,
                                        tisuLembutTrauma: !tisuLembutTrauma,
                                      },
                                    });
                                  }}
                                  className='peer hidden'
                                />
                                <label
                                  htmlFor='tisu-lembut-reten-salah-cbox'
                                  className=' text-user9 h-6 w-6 rounded-full flex items-center justify-center cursor-pointer'
                                >
                                  {pilihanDataSalah.tisuLembutTraumaCBox ===
                                  true ? (
                                    <FaTimes className='text-2xl' />
                                  ) : (
                                    <FaRegHandPointLeft className='text-2xl' />
                                  )}
                                </label>
                              </div>
                            </div>
                            {pilihanDataSalah.tisuLembutTraumaCBox === true && (
                              <div className='flex items-center flex-row pl-2 bg-user11 bg-opacity-50'>
                                <input
                                  disabled
                                  type='checkbox'
                                  name='tisu-lembut-reten-salah'
                                  id='tisu-lembut-reten-salah'
                                  checked={pilihanDataSalah.tisuLembutTrauma}
                                  className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                                />
                                <label
                                  htmlFor='tisu-lembut-reten-salah'
                                  className='mx-2 text-sm font-m'
                                >
                                  Kecederaan Tisu Lembut
                                </label>
                                <span className='text-kaunter4'>
                                  <FaCheck className='text-2xl' />
                                </span>
                              </div>
                            )}
                          </div>
                          <div
                            className={`${
                              pilihanDataSalah.tisuKerasTraumaCBox &&
                              'grid-rows-2'
                            } grid px-3 pt-1`}
                          >
                            <div
                              className={`${
                                pilihanDataSalah.tisuKerasTraumaCBox &&
                                'bg-user9 bg-opacity-20'
                              } flex items-center flex-row pl-2`}
                            >
                              <input
                                disabled={isDisabled}
                                type='checkbox'
                                name='tisu-keras'
                                id='tisu-keras'
                                checked={tisuKerasTrauma}
                                onChange={() => {
                                  setTisuKerasTrauma(!tisuKerasTrauma);
                                  setConfirmData({
                                    ...confirmData,
                                    tisuKerasTrauma: !tisuKerasTrauma,
                                  });
                                }}
                                className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                              />
                              <label
                                htmlFor='tisu-keras'
                                className='m-2 text-sm font-m'
                              >
                                kecederaan tulang muka
                              </label>
                              <div className='relative'>
                                <input
                                  disabled={disableSalah}
                                  type='checkbox'
                                  name='tisu-keras-reten-salah-cbox'
                                  id='tisu-keras-reten-salah-cbox'
                                  checked={pilihanDataSalah.tisuKerasTraumaCBox}
                                  onChange={() => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      tisuKerasTraumaCBox:
                                        !pilihanDataSalah.tisuKerasTraumaCBox,
                                      tisuKerasTrauma: !tisuKerasTrauma,
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      tisuKerasTraumaCBox:
                                        !pilihanDataSalah.tisuKerasTraumaCBox,
                                      tisuKerasTrauma: !tisuKerasTrauma,
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        tisuKerasTraumaCBox:
                                          !pilihanDataSalah.tisuKerasTraumaCBox,
                                        tisuKerasTrauma: !tisuKerasTrauma,
                                      },
                                    });
                                  }}
                                  className='peer hidden'
                                />
                                <label
                                  htmlFor='tisu-keras-reten-salah-cbox'
                                  className=' text-user9 h-6 w-6 rounded-full flex items-center justify-center cursor-pointer'
                                >
                                  {pilihanDataSalah.tisuKerasTraumaCBox ===
                                  true ? (
                                    <FaTimes className='text-2xl' />
                                  ) : (
                                    <FaRegHandPointLeft className='text-2xl' />
                                  )}
                                </label>
                              </div>
                            </div>
                            {pilihanDataSalah.tisuKerasTraumaCBox === true && (
                              <div className='flex items-center flex-row pl-2 bg-user11 bg-opacity-50'>
                                <input
                                  disabled
                                  type='checkbox'
                                  name='tisu-keras-reten-salah'
                                  id='tisu-keras-reten-salah'
                                  checked={pilihanDataSalah.tisuKerasTrauma}
                                  className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                                />
                                <label
                                  htmlFor='tisu-keras-reten-salah'
                                  className='mx-2 text-sm font-m'
                                >
                                  kecederaan tulang muka
                                </label>
                                <span className='text-kaunter4'>
                                  <FaCheck className='text-2xl' />
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    </div>
                    <article className='grid grid-cols-3 border border-userBlack pl-3 p-2 rounded-md auto-rows-min'>
                      <h4 className='font-bold flex flex-row pl-5 text-left col-span-3'>
                        Bilangan Gigi Kekal Dibuat Pengapan Fisur 3 Tahun Lepas
                      </h4>
                      <div
                        className={`${
                          pilihanDataSalah.gicBilanganFsDibuat3TahunLepasCBox &&
                          'grid-rows-2'
                        } grid px-3 pt-1`}
                      >
                        <div
                          className={`${
                            pilihanDataSalah.gicBilanganFsDibuat3TahunLepasCBox &&
                            'bg-user9 bg-opacity-20'
                          } flex items-center flex-row pl-5 mt-2`}
                        >
                          <input
                            disabled={isDisabled}
                            min='0'
                            max='32'
                            type='number'
                            name='gic-bilangan-fs-dibuat-3-tahun-lepas'
                            id='gic-bilangan-fs-dibuat-3-tahun-lepas'
                            value={gicBilanganFsDibuat3TahunLepas}
                            onChange={(e) => {
                              setGicBilanganFsDibuat3TahunLepas(e.target.value);
                              setConfirmData({
                                ...confirmData,
                                gicBilanganFsDibuat3TahunLepas: e.target.value,
                              });
                            }}
                            className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none mr-3 drop-shadow-lg'
                          />
                          <p className='text-sm font-m '>GIC</p>
                          <div className='relative'>
                            <input
                              disabled={disableSalah}
                              type='checkbox'
                              name='gic-bilangan-fs-dibuat-3-tahun-lepas-reten-salah-cbox'
                              id='gic-bilangan-fs-dibuat-3-tahun-lepas-reten-salah-cbox'
                              checked={
                                pilihanDataSalah.gicBilanganFsDibuat3TahunLepasCBox
                              }
                              onChange={() => {
                                setPilihanDataSalah({
                                  ...pilihanDataSalah,
                                  gicBilanganFsDibuat3TahunLepasCBox:
                                    !pilihanDataSalah.gicBilanganFsDibuat3TahunLepasCBox,
                                });
                                setDataRetenSalah({
                                  ...dataRetenSalah,
                                  gicBilanganFsDibuat3TahunLepasCBox:
                                    !pilihanDataSalah.gicBilanganFsDibuat3TahunLepasCBox,
                                });
                                setConfirmData({
                                  ...confirmData,
                                  pilihanDataSalah: {
                                    ...pilihanDataSalah,
                                    gicBilanganFsDibuat3TahunLepasCBox:
                                      !pilihanDataSalah.gicBilanganFsDibuat3TahunLepasCBox,
                                  },
                                });
                              }}
                              className='peer hidden'
                            />
                            <label
                              htmlFor='gic-bilangan-fs-dibuat-3-tahun-lepas-reten-salah-cbox'
                              className={` ${
                                disableSalah === true
                                  ? 'pointer-events-none'
                                  : 'cursor-pointer '
                              } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                            >
                              {pilihanDataSalah.gicBilanganFsDibuat3TahunLepasCBox ===
                              true ? (
                                <FaTimes
                                  className='text-2xl'
                                  onClick={() => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      gicBilanganFsDibuat3TahunLepas: '',
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      gicBilanganFsDibuat3TahunLepas: '',
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        gicBilanganFsDibuat3TahunLepas: '',
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
                        {pilihanDataSalah.gicBilanganFsDibuat3TahunLepasCBox ===
                          true && (
                          <div className='flex flex-row pl-5 items-center bg-user11 bg-opacity-50 mb-1'>
                            <input
                              disabled={disableSalah}
                              min='0'
                              max='32'
                              type='number'
                              name='gic-bilangan-fs-dibuat-3-tahun-lepas'
                              id='gic-bilangan-fs-dibuat-3-tahun-lepas'
                              value={
                                pilihanDataSalah.gicBilanganFsDibuat3TahunLepas
                              }
                              onChange={(e) => {
                                setPilihanDataSalah({
                                  ...pilihanDataSalah,
                                  gicBilanganFsDibuat3TahunLepas:
                                    e.target.value,
                                });
                                setDataRetenSalah({
                                  ...dataRetenSalah,
                                  gicBilanganFsDibuat3TahunLepas:
                                    e.target.value,
                                });
                                setConfirmData({
                                  ...confirmData,
                                  pilihanDataSalah: {
                                    ...pilihanDataSalah,
                                    gicBilanganFsDibuat3TahunLepas:
                                      e.target.value,
                                  },
                                });
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none mr-3 drop-shadow-lg'
                            />
                            <p className='text-sm font-m '>GIC</p>
                            <span className='text-kaunter4'>
                              <FaCheck className='text-2xl' />
                            </span>
                          </div>
                        )}
                      </div>
                      <div
                        className={`${
                          pilihanDataSalah.resinBilanganFsDibuat3TahunLepasCBox &&
                          'grid-rows-2'
                        } grid px-3 pt-1`}
                      >
                        <div
                          className={`${
                            pilihanDataSalah.resinBilanganFsDibuat3TahunLepasCBox &&
                            'bg-user9 bg-opacity-20'
                          } flex items-center flex-row pl-5 mt-2`}
                        >
                          <input
                            disabled={isDisabled}
                            min='0'
                            max='32'
                            type='number'
                            name='resin-bilangan-fs-dibuat-3-tahun-lepas'
                            id='resin-bilangan-fs-dibuat-3-tahun-lepas'
                            value={resinBilanganFsDibuat3TahunLepas}
                            onChange={(e) => {
                              setResinBilanganFsDibuat3TahunLepas(
                                e.target.value
                              );
                              setConfirmData({
                                ...confirmData,
                                resinBilanganFsDibuat3TahunLepas:
                                  e.target.value,
                              });
                            }}
                            className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none mr-3 drop-shadow-lg'
                          />
                          <p className='text-sm font-m '>Resin</p>
                          <div className='relative'>
                            <input
                              disabled={disableSalah}
                              type='checkbox'
                              name='resin-bilangan-fs-dibuat-3-tahun-lepas-reten-salah-cbox'
                              id='resin-bilangan-fs-dibuat-3-tahun-lepas-reten-salah-cbox'
                              checked={
                                pilihanDataSalah.resinBilanganFsDibuat3TahunLepasCBox
                              }
                              onChange={() => {
                                setPilihanDataSalah({
                                  ...pilihanDataSalah,
                                  resinBilanganFsDibuat3TahunLepasCBox:
                                    !pilihanDataSalah.resinBilanganFsDibuat3TahunLepasCBox,
                                });
                                setDataRetenSalah({
                                  ...dataRetenSalah,
                                  resinBilanganFsDibuat3TahunLepasCBox:
                                    !pilihanDataSalah.resinBilanganFsDibuat3TahunLepasCBox,
                                });
                                setConfirmData({
                                  ...confirmData,
                                  pilihanDataSalah: {
                                    ...pilihanDataSalah,
                                    resinBilanganFsDibuat3TahunLepasCBox:
                                      !pilihanDataSalah.resinBilanganFsDibuat3TahunLepasCBox,
                                  },
                                });
                              }}
                              className='peer hidden'
                            />
                            <label
                              htmlFor='resin-bilangan-fs-dibuat-3-tahun-lepas-reten-salah-cbox'
                              className={` ${
                                disableSalah === true
                                  ? 'pointer-events-none'
                                  : 'cursor-pointer '
                              } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                            >
                              {pilihanDataSalah.resinBilanganFsDibuat3TahunLepasCBox ===
                              true ? (
                                <FaTimes
                                  className='text-2xl'
                                  onClick={() => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      resinBilanganFsDibuat3TahunLepas: '',
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      resinBilanganFsDibuat3TahunLepas: '',
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        resinBilanganFsDibuat3TahunLepas: '',
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
                        {pilihanDataSalah.resinBilanganFsDibuat3TahunLepasCBox ===
                          true && (
                          <div className='flex flex-row pl-5 items-center bg-user11 bg-opacity-50 mb-1'>
                            <input
                              disabled={disableSalah}
                              min='0'
                              max='32'
                              type='number'
                              name='resin-bilangan-fs-dibuat-3-tahun-lepas'
                              id='resin-bilangan-fs-dibuat-3-tahun-lepas'
                              value={
                                pilihanDataSalah.resinBilanganFsDibuat3TahunLepas
                              }
                              onChange={(e) => {
                                setPilihanDataSalah({
                                  ...pilihanDataSalah,
                                  resinBilanganFsDibuat3TahunLepas:
                                    e.target.value,
                                });
                                setDataRetenSalah({
                                  ...dataRetenSalah,
                                  resinBilanganFsDibuat3TahunLepas:
                                    e.target.value,
                                });
                                setConfirmData({
                                  ...confirmData,
                                  pilihanDataSalah: {
                                    ...pilihanDataSalah,
                                    resinBilanganFsDibuat3TahunLepas:
                                      e.target.value,
                                  },
                                });
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none mr-3 drop-shadow-lg'
                            />
                            <p className='text-sm font-m '>Resin</p>
                            <span className='text-kaunter4'>
                              <FaCheck className='text-2xl' />
                            </span>
                          </div>
                        )}
                      </div>
                      <div
                        className={`${
                          pilihanDataSalah.lainLainBilanganFsDibuat3TahunLepasCBox &&
                          'grid-rows-2'
                        } grid px-3 pt-1`}
                      >
                        <div
                          className={`${
                            pilihanDataSalah.lainLainBilanganFsDibuat3TahunLepasCBox &&
                            'bg-user9 bg-opacity-20'
                          } flex items-center flex-row pl-5 mt-2`}
                        >
                          <input
                            disabled={isDisabled}
                            min='0'
                            max='32'
                            type='number'
                            name='lain-lain-bilangan-fs-dibuat-3-tahun-lepas'
                            id='lain-lain-bilangan-fs-dibuat-3-tahun-lepas'
                            value={lainLainBilanganFsDibuat3TahunLepas}
                            onChange={(e) => {
                              setLainLainBilanganFsDibuat3TahunLepas(
                                e.target.value
                              );
                              setConfirmData({
                                ...confirmData,
                                lainLainBilanganFsDibuat3TahunLepas:
                                  e.target.value,
                              });
                            }}
                            className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none mr-3 drop-shadow-lg'
                          />
                          <p className='text-sm font-m '>Lain-lain</p>
                          <div className='relative'>
                            <input
                              disabled={disableSalah}
                              type='checkbox'
                              name='lain-lain-bilangan-fs-dibuat-3-tahun-lepas-reten-salah-cbox'
                              id='lain-lain-bilangan-fs-dibuat-3-tahun-lepas-reten-salah-cbox'
                              checked={
                                pilihanDataSalah.lainLainBilanganFsDibuat3TahunLepasCBox
                              }
                              onChange={() => {
                                setPilihanDataSalah({
                                  ...pilihanDataSalah,
                                  lainLainBilanganFsDibuat3TahunLepasCBox:
                                    !pilihanDataSalah.lainLainBilanganFsDibuat3TahunLepasCBox,
                                });
                                setDataRetenSalah({
                                  ...dataRetenSalah,
                                  lainLainBilanganFsDibuat3TahunLepasCBox:
                                    !pilihanDataSalah.lainLainBilanganFsDibuat3TahunLepasCBox,
                                });
                                setConfirmData({
                                  ...confirmData,
                                  pilihanDataSalah: {
                                    ...pilihanDataSalah,
                                    lainLainBilanganFsDibuat3TahunLepasCBox:
                                      !pilihanDataSalah.lainLainBilanganFsDibuat3TahunLepasCBox,
                                  },
                                });
                              }}
                              className='peer hidden'
                            />
                            <label
                              htmlFor='lain-lain-bilangan-fs-dibuat-3-tahun-lepas-reten-salah-cbox'
                              className={` ${
                                disableSalah === true
                                  ? 'pointer-events-none'
                                  : 'cursor-pointer '
                              } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                            >
                              {pilihanDataSalah.lainLainBilanganFsDibuat3TahunLepasCBox ===
                              true ? (
                                <FaTimes
                                  className='text-2xl'
                                  onClick={() => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      lainLainBilanganFsDibuat3TahunLepas: '',
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      lainLainBilanganFsDibuat3TahunLepas: '',
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        lainLainBilanganFsDibuat3TahunLepas: '',
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
                        {pilihanDataSalah.lainLainBilanganFsDibuat3TahunLepasCBox ===
                          true && (
                          <div className='flex flex-row pl-5 items-center bg-user11 bg-opacity-50 mb-1'>
                            <input
                              disabled={disableSalah}
                              min='0'
                              max='32'
                              type='number'
                              name='lain-lain-bilangan-fs-dibuat-3-tahun-lepas'
                              id='lain-lain-bilangan-fs-dibuat-3-tahun-lepas'
                              value={
                                pilihanDataSalah.lainLainBilanganFsDibuat3TahunLepas
                              }
                              onChange={(e) => {
                                setPilihanDataSalah({
                                  ...pilihanDataSalah,
                                  lainLainBilanganFsDibuat3TahunLepas:
                                    e.target.value,
                                });
                                setDataRetenSalah({
                                  ...dataRetenSalah,
                                  lainLainBilanganFsDibuat3TahunLepas:
                                    e.target.value,
                                });
                                setConfirmData({
                                  ...confirmData,
                                  pilihanDataSalah: {
                                    ...pilihanDataSalah,
                                    lainLainBilanganFsDibuat3TahunLepas:
                                      e.target.value,
                                  },
                                });
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none mr-3 drop-shadow-lg'
                            />
                            <p className='text-sm font-m '>Lain-lain</p>
                            <span className='text-kaunter4'>
                              <FaCheck className='text-2xl' />
                            </span>
                          </div>
                        )}
                      </div>
                    </article>
                    <article className='grid grid-cols-2 md:grid-cols-3 border border-userBlack pl-3 p-2 rounded-md'>
                      <h4 className='font-bold flex flex-row text-left pl-3 col-span-2 md:col-span-3'>
                        Bilangan Gigi Kekal Dibuat Pengapan Fisur 3 Tahun Lepas
                        Berubah Menjadi Seperti Di Bawah :
                      </h4>
                      <div
                        className={`${
                          pilihanDataSalah.dBilanganFsDibuat3TahunLepasTerjadiCBox &&
                          'grid-rows-2'
                        } grid px-3 pt-1`}
                      >
                        <div
                          className={`${
                            pilihanDataSalah.dBilanganFsDibuat3TahunLepasTerjadiCBox &&
                            'bg-user9 bg-opacity-20'
                          } flex items-center flex-row pl-5 mt-2`}
                        >
                          <p className='text-sm font-m '>D: </p>
                          <input
                            disabled={isDisabled}
                            min='0'
                            max='32'
                            type='number'
                            name='d-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                            id='d-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                            value={dBilanganFsDibuat3TahunLepasTerjadi}
                            onChange={(e) => {
                              setDBilanganFsDibuat3TahunLepasTerjadi(
                                e.target.value
                              );
                              setConfirmData({
                                ...confirmData,
                                dBilanganFsDibuat3TahunLepasTerjadi:
                                  e.target.value,
                              });
                            }}
                            className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          />
                          <div className='relative'>
                            <input
                              disabled={disableSalah}
                              type='checkbox'
                              name='d-bilangan-fs-dibuat-3-tahun-lepas-terjadi-reten-salah-cbox'
                              id='d-bilangan-fs-dibuat-3-tahun-lepas-terjadi-reten-salah-cbox'
                              checked={
                                pilihanDataSalah.dBilanganFsDibuat3TahunLepasTerjadiCBox
                              }
                              onChange={() => {
                                setPilihanDataSalah({
                                  ...pilihanDataSalah,
                                  dBilanganFsDibuat3TahunLepasTerjadiCBox:
                                    !pilihanDataSalah.dBilanganFsDibuat3TahunLepasTerjadiCBox,
                                });
                                setDataRetenSalah({
                                  ...dataRetenSalah,
                                  dBilanganFsDibuat3TahunLepasTerjadiCBox:
                                    !pilihanDataSalah.dBilanganFsDibuat3TahunLepasTerjadiCBox,
                                });
                                setConfirmData({
                                  ...confirmData,
                                  pilihanDataSalah: {
                                    ...pilihanDataSalah,
                                    dBilanganFsDibuat3TahunLepasTerjadiCBox:
                                      !pilihanDataSalah.dBilanganFsDibuat3TahunLepasTerjadiCBox,
                                  },
                                });
                              }}
                              className='peer hidden'
                            />
                            <label
                              htmlFor='d-bilangan-fs-dibuat-3-tahun-lepas-terjadi-reten-salah-cbox'
                              className={` ${
                                disableSalah === true
                                  ? 'pointer-events-none'
                                  : 'cursor-pointer '
                              } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                            >
                              {pilihanDataSalah.dBilanganFsDibuat3TahunLepasTerjadiCBox ===
                              true ? (
                                <FaTimes
                                  className='text-2xl'
                                  onClick={() => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      dBilanganFsDibuat3TahunLepasTerjadi: '',
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      dBilanganFsDibuat3TahunLepasTerjadi: '',
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        dBilanganFsDibuat3TahunLepasTerjadi: '',
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
                        {pilihanDataSalah.dBilanganFsDibuat3TahunLepasTerjadiCBox ===
                          true && (
                          <div className='flex flex-row pl-5 items-center bg-user11 bg-opacity-50 mb-1'>
                            <p className='text-sm font-m '>D: </p>
                            <input
                              disabled={disableSalah}
                              min='0'
                              max='32'
                              type='number'
                              name='d-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                              id='d-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                              value={
                                pilihanDataSalah.dBilanganFsDibuat3TahunLepasTerjadi
                              }
                              onChange={(e) => {
                                setPilihanDataSalah({
                                  ...pilihanDataSalah,
                                  dBilanganFsDibuat3TahunLepasTerjadi:
                                    e.target.value,
                                });
                                setDataRetenSalah({
                                  ...dataRetenSalah,
                                  dBilanganFsDibuat3TahunLepasTerjadi:
                                    e.target.value,
                                });
                                setConfirmData({
                                  ...confirmData,
                                  pilihanDataSalah: {
                                    ...pilihanDataSalah,
                                    dBilanganFsDibuat3TahunLepasTerjadi:
                                      e.target.value,
                                  },
                                });
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none mr-3 drop-shadow-lg'
                            />
                            <span className='text-kaunter4'>
                              <FaCheck className='text-2xl' />
                            </span>
                          </div>
                        )}
                      </div>
                      <div
                        className={`${
                          pilihanDataSalah.mBilanganFsDibuat3TahunLepasTerjadiCBox &&
                          'grid-rows-2'
                        } grid px-3 pt-1`}
                      >
                        <div
                          className={`${
                            pilihanDataSalah.mBilanganFsDibuat3TahunLepasTerjadiCBox &&
                            'bg-user9 bg-opacity-20'
                          } flex items-center flex-row pl-5 mt-2`}
                        >
                          <p className='text-sm font-m '>M: </p>
                          <input
                            disabled={isDisabled}
                            min='0'
                            max='32'
                            type='number'
                            name='m-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                            id='m-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                            value={mBilanganFsDibuat3TahunLepasTerjadi}
                            onChange={(e) => {
                              setMBilanganFsDibuat3TahunLepasTerjadi(
                                e.target.value
                              );
                              setConfirmData({
                                ...confirmData,
                                mBilanganFsDibuat3TahunLepasTerjadi:
                                  e.target.value,
                              });
                            }}
                            className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          />
                          <div className='relative'>
                            <input
                              disabled={disableSalah}
                              type='checkbox'
                              name='m-bilangan-fs-dibuat-3-tahun-lepas-terjadi-reten-salah-cbox'
                              id='m-bilangan-fs-dibuat-3-tahun-lepas-terjadi-reten-salah-cbox'
                              checked={
                                pilihanDataSalah.mBilanganFsDibuat3TahunLepasTerjadiCBox
                              }
                              onChange={() => {
                                setPilihanDataSalah({
                                  ...pilihanDataSalah,
                                  mBilanganFsDibuat3TahunLepasTerjadiCBox:
                                    !pilihanDataSalah.mBilanganFsDibuat3TahunLepasTerjadiCBox,
                                });
                                setDataRetenSalah({
                                  ...dataRetenSalah,
                                  mBilanganFsDibuat3TahunLepasTerjadiCBox:
                                    !pilihanDataSalah.mBilanganFsDibuat3TahunLepasTerjadiCBox,
                                });
                                setConfirmData({
                                  ...confirmData,
                                  pilihanDataSalah: {
                                    ...pilihanDataSalah,
                                    mBilanganFsDibuat3TahunLepasTerjadiCBox:
                                      !pilihanDataSalah.mBilanganFsDibuat3TahunLepasTerjadiCBox,
                                  },
                                });
                              }}
                              className='peer hidden'
                            />
                            <label
                              htmlFor='m-bilangan-fs-dibuat-3-tahun-lepas-terjadi-reten-salah-cbox'
                              className={` ${
                                disableSalah === true
                                  ? 'pointer-events-none'
                                  : 'cursor-pointer '
                              } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                            >
                              {pilihanDataSalah.mBilanganFsDibuat3TahunLepasTerjadiCBox ===
                              true ? (
                                <FaTimes
                                  className='text-2xl'
                                  onClick={() => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      mBilanganFsDibuat3TahunLepasTerjadi: '',
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      mBilanganFsDibuat3TahunLepasTerjadi: '',
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        mBilanganFsDibuat3TahunLepasTerjadi: '',
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
                        {pilihanDataSalah.mBilanganFsDibuat3TahunLepasTerjadiCBox ===
                          true && (
                          <div className='flex flex-row pl-5 items-center bg-user11 bg-opacity-50 mb-1'>
                            <p className='text-sm font-m '>M: </p>
                            <input
                              disabled={disableSalah}
                              min='0'
                              max='32'
                              type='number'
                              name='m-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                              id='m-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                              value={
                                pilihanDataSalah.mBilanganFsDibuat3TahunLepasTerjadi
                              }
                              onChange={(e) => {
                                setPilihanDataSalah({
                                  ...pilihanDataSalah,
                                  mBilanganFsDibuat3TahunLepasTerjadi:
                                    e.target.value,
                                });
                                setDataRetenSalah({
                                  ...dataRetenSalah,
                                  mBilanganFsDibuat3TahunLepasTerjadi:
                                    e.target.value,
                                });
                                setConfirmData({
                                  ...confirmData,
                                  pilihanDataSalah: {
                                    ...pilihanDataSalah,
                                    mBilanganFsDibuat3TahunLepasTerjadi:
                                      e.target.value,
                                  },
                                });
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none mr-3 drop-shadow-lg'
                            />
                            <span className='text-kaunter4'>
                              <FaCheck className='text-2xl' />
                            </span>
                          </div>
                        )}
                      </div>
                      <div
                        className={`${
                          pilihanDataSalah.fBilanganFsDibuat3TahunLepasTerjadiCBox &&
                          'grid-rows-2'
                        } grid px-3 pt-1`}
                      >
                        <div
                          className={`${
                            pilihanDataSalah.fBilanganFsDibuat3TahunLepasTerjadiCBox &&
                            'bg-user9 bg-opacity-20'
                          } flex items-center flex-row pl-5 mt-2`}
                        >
                          <p className='text-sm font-m '>F: </p>
                          <input
                            disabled={isDisabled}
                            min='0'
                            max='32'
                            type='number'
                            name='f-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                            id='f-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                            value={fBilanganFsDibuat3TahunLepasTerjadi}
                            onChange={(e) => {
                              setFBilanganFsDibuat3TahunLepasTerjadi(
                                e.target.value
                              );
                              setConfirmData({
                                ...confirmData,
                                fBilanganFsDibuat3TahunLepasTerjadi:
                                  e.target.value,
                              });
                            }}
                            className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          />
                          <div className='relative'>
                            <input
                              disabled={disableSalah}
                              type='checkbox'
                              name='f-bilangan-fs-dibuat-3-tahun-lepas-terjadi-reten-salah-cbox'
                              id='f-bilangan-fs-dibuat-3-tahun-lepas-terjadi-reten-salah-cbox'
                              checked={
                                pilihanDataSalah.fBilanganFsDibuat3TahunLepasTerjadiCBox
                              }
                              onChange={() => {
                                setPilihanDataSalah({
                                  ...pilihanDataSalah,
                                  fBilanganFsDibuat3TahunLepasTerjadiCBox:
                                    !pilihanDataSalah.fBilanganFsDibuat3TahunLepasTerjadiCBox,
                                });
                                setDataRetenSalah({
                                  ...dataRetenSalah,
                                  fBilanganFsDibuat3TahunLepasTerjadiCBox:
                                    !pilihanDataSalah.fBilanganFsDibuat3TahunLepasTerjadiCBox,
                                });
                                setConfirmData({
                                  ...confirmData,
                                  pilihanDataSalah: {
                                    ...pilihanDataSalah,
                                    fBilanganFsDibuat3TahunLepasTerjadiCBox:
                                      !pilihanDataSalah.fBilanganFsDibuat3TahunLepasTerjadiCBox,
                                  },
                                });
                              }}
                              className='peer hidden'
                            />
                            <label
                              htmlFor='f-bilangan-fs-dibuat-3-tahun-lepas-terjadi-reten-salah-cbox'
                              className={` ${
                                disableSalah === true
                                  ? 'pointer-events-none'
                                  : 'cursor-pointer '
                              } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                            >
                              {pilihanDataSalah.fBilanganFsDibuat3TahunLepasTerjadiCBox ===
                              true ? (
                                <FaTimes
                                  className='text-2xl'
                                  onClick={() => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      fBilanganFsDibuat3TahunLepasTerjadi: '',
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      fBilanganFsDibuat3TahunLepasTerjadi: '',
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        fBilanganFsDibuat3TahunLepasTerjadi: '',
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
                        {pilihanDataSalah.fBilanganFsDibuat3TahunLepasTerjadiCBox ===
                          true && (
                          <div className='flex flex-row pl-5 items-center bg-user11 bg-opacity-50 mb-1'>
                            <p className='text-sm font-m '>F: </p>
                            <input
                              disabled={disableSalah}
                              min='0'
                              max='32'
                              type='number'
                              name='f-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                              id='f-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                              value={
                                pilihanDataSalah.fBilanganFsDibuat3TahunLepasTerjadi
                              }
                              onChange={(e) => {
                                setPilihanDataSalah({
                                  ...pilihanDataSalah,
                                  fBilanganFsDibuat3TahunLepasTerjadi:
                                    e.target.value,
                                });
                                setDataRetenSalah({
                                  ...dataRetenSalah,
                                  fBilanganFsDibuat3TahunLepasTerjadi:
                                    e.target.value,
                                });
                                setConfirmData({
                                  ...confirmData,
                                  pilihanDataSalah: {
                                    ...pilihanDataSalah,
                                    fBilanganFsDibuat3TahunLepasTerjadi:
                                      e.target.value,
                                  },
                                });
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none mr-3 drop-shadow-lg'
                            />
                            <span className='text-kaunter4'>
                              <FaCheck className='text-2xl' />
                            </span>
                          </div>
                        )}
                      </div>
                      <div
                        className={`${
                          pilihanDataSalah.xBilanganFsDibuat3TahunLepasTerjadiCBox &&
                          'grid-rows-2'
                        } grid px-3 pt-1`}
                      >
                        <div
                          className={`${
                            pilihanDataSalah.xBilanganFsDibuat3TahunLepasTerjadiCBox &&
                            'bg-user9 bg-opacity-20'
                          } flex items-center flex-row pl-5 mt-2`}
                        >
                          <p className='text-sm font-m '>X: </p>
                          <input
                            disabled={isDisabled}
                            min='0'
                            max='32'
                            type='number'
                            name='x-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                            id='x-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                            value={xBilanganFsDibuat3TahunLepasTerjadi}
                            onChange={(e) => {
                              setXBilanganFsDibuat3TahunLepasTerjadi(
                                e.target.value
                              );
                              setConfirmData({
                                ...confirmData,
                                xBilanganFsDibuat3TahunLepasTerjadi:
                                  e.target.value,
                              });
                            }}
                            className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          />
                          <div className='relative'>
                            <input
                              disabled={disableSalah}
                              type='checkbox'
                              name='x-bilangan-fs-dibuat-3-tahun-lepas-terjadi-reten-salah-cbox'
                              id='x-bilangan-fs-dibuat-3-tahun-lepas-terjadi-reten-salah-cbox'
                              checked={
                                pilihanDataSalah.xBilanganFsDibuat3TahunLepasTerjadiCBox
                              }
                              onChange={() => {
                                setPilihanDataSalah({
                                  ...pilihanDataSalah,
                                  xBilanganFsDibuat3TahunLepasTerjadiCBox:
                                    !pilihanDataSalah.xBilanganFsDibuat3TahunLepasTerjadiCBox,
                                });
                                setDataRetenSalah({
                                  ...dataRetenSalah,
                                  xBilanganFsDibuat3TahunLepasTerjadiCBox:
                                    !pilihanDataSalah.xBilanganFsDibuat3TahunLepasTerjadiCBox,
                                });
                                setConfirmData({
                                  ...confirmData,
                                  pilihanDataSalah: {
                                    ...pilihanDataSalah,
                                    xBilanganFsDibuat3TahunLepasTerjadiCBox:
                                      !pilihanDataSalah.xBilanganFsDibuat3TahunLepasTerjadiCBox,
                                  },
                                });
                              }}
                              className='peer hidden'
                            />
                            <label
                              htmlFor='x-bilangan-fs-dibuat-3-tahun-lepas-terjadi-reten-salah-cbox'
                              className={` ${
                                disableSalah === true
                                  ? 'pointer-events-none'
                                  : 'cursor-pointer '
                              } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                            >
                              {pilihanDataSalah.xBilanganFsDibuat3TahunLepasTerjadiCBox ===
                              true ? (
                                <FaTimes
                                  className='text-2xl'
                                  onClick={() => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      xBilanganFsDibuat3TahunLepasTerjadi: '',
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      xBilanganFsDibuat3TahunLepasTerjadi: '',
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        xBilanganFsDibuat3TahunLepasTerjadi: '',
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
                        {pilihanDataSalah.xBilanganFsDibuat3TahunLepasTerjadiCBox ===
                          true && (
                          <div className='flex flex-row pl-5 items-center bg-user11 bg-opacity-50 mb-1'>
                            <p className='text-sm font-m '>X: </p>
                            <input
                              disabled={disableSalah}
                              min='0'
                              max='32'
                              type='number'
                              name='x-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                              id='x-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                              value={
                                pilihanDataSalah.xBilanganFsDibuat3TahunLepasTerjadi
                              }
                              onChange={(e) => {
                                setPilihanDataSalah({
                                  ...pilihanDataSalah,
                                  xBilanganFsDibuat3TahunLepasTerjadi:
                                    e.target.value,
                                });
                                setDataRetenSalah({
                                  ...dataRetenSalah,
                                  xBilanganFsDibuat3TahunLepasTerjadi:
                                    e.target.value,
                                });
                                setConfirmData({
                                  ...confirmData,
                                  pilihanDataSalah: {
                                    ...pilihanDataSalah,
                                    xBilanganFsDibuat3TahunLepasTerjadi:
                                      e.target.value,
                                  },
                                });
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none mr-3 drop-shadow-lg'
                            />
                            <span className='text-kaunter4'>
                              <FaCheck className='text-2xl' />
                            </span>
                          </div>
                        )}
                      </div>
                      <div
                        className={`${
                          pilihanDataSalah.eBilanganFsDibuat3TahunLepasTerjadiCBox &&
                          'grid-rows-2'
                        } grid px-3 pt-1`}
                      >
                        <div
                          className={`${
                            pilihanDataSalah.eBilanganFsDibuat3TahunLepasTerjadiCBox &&
                            'bg-user9 bg-opacity-20'
                          } flex items-center flex-row pl-5 mt-2`}
                        >
                          <p className='text-sm font-m '>E: </p>
                          <input
                            disabled={isDisabled}
                            min='0'
                            max='32'
                            type='number'
                            name='e-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                            id='e-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                            value={eBilanganFsDibuat3TahunLepasTerjadi}
                            onChange={(e) => {
                              setEBilanganFsDibuat3TahunLepasTerjadi(
                                e.target.value
                              );
                              setConfirmData({
                                ...confirmData,
                                eBilanganFsDibuat3TahunLepasTerjadi:
                                  e.target.value,
                              });
                            }}
                            className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          />
                          <div className='relative'>
                            <input
                              disabled={disableSalah}
                              type='checkbox'
                              name='e-bilangan-fs-dibuat-3-tahun-lepas-terjadi-reten-salah-cbox'
                              id='e-bilangan-fs-dibuat-3-tahun-lepas-terjadi-reten-salah-cbox'
                              checked={
                                pilihanDataSalah.eBilanganFsDibuat3TahunLepasTerjadiCBox
                              }
                              onChange={() => {
                                setPilihanDataSalah({
                                  ...pilihanDataSalah,
                                  eBilanganFsDibuat3TahunLepasTerjadiCBox:
                                    !pilihanDataSalah.eBilanganFsDibuat3TahunLepasTerjadiCBox,
                                });
                                setDataRetenSalah({
                                  ...dataRetenSalah,
                                  eBilanganFsDibuat3TahunLepasTerjadiCBox:
                                    !pilihanDataSalah.eBilanganFsDibuat3TahunLepasTerjadiCBox,
                                });
                                setConfirmData({
                                  ...confirmData,
                                  pilihanDataSalah: {
                                    ...pilihanDataSalah,
                                    eBilanganFsDibuat3TahunLepasTerjadiCBox:
                                      !pilihanDataSalah.eBilanganFsDibuat3TahunLepasTerjadiCBox,
                                  },
                                });
                              }}
                              className='peer hidden'
                            />
                            <label
                              htmlFor='e-bilangan-fs-dibuat-3-tahun-lepas-terjadi-reten-salah-cbox'
                              className={` ${
                                disableSalah === true
                                  ? 'pointer-events-none'
                                  : 'cursor-pointer '
                              } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                            >
                              {pilihanDataSalah.eBilanganFsDibuat3TahunLepasTerjadiCBox ===
                              true ? (
                                <FaTimes
                                  className='text-2xl'
                                  onClick={() => {
                                    setPilihanDataSalah({
                                      ...pilihanDataSalah,
                                      eBilanganFsDibuat3TahunLepasTerjadi: '',
                                    });
                                    setDataRetenSalah({
                                      ...dataRetenSalah,
                                      eBilanganFsDibuat3TahunLepasTerjadi: '',
                                    });
                                    setConfirmData({
                                      ...confirmData,
                                      pilihanDataSalah: {
                                        ...pilihanDataSalah,
                                        eBilanganFsDibuat3TahunLepasTerjadi: '',
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
                        {pilihanDataSalah.eBilanganFsDibuat3TahunLepasTerjadiCBox ===
                          true && (
                          <div className='flex flex-row pl-5 items-center bg-user11 bg-opacity-50 mb-1'>
                            <p className='text-sm font-m '>E: </p>
                            <input
                              disabled={disableSalah}
                              min='0'
                              max='32'
                              type='number'
                              name='e-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                              id='e-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                              value={
                                pilihanDataSalah.eBilanganFsDibuat3TahunLepasTerjadi
                              }
                              onChange={(e) => {
                                setPilihanDataSalah({
                                  ...pilihanDataSalah,
                                  eBilanganFsDibuat3TahunLepasTerjadi:
                                    e.target.value,
                                });
                                setDataRetenSalah({
                                  ...dataRetenSalah,
                                  eBilanganFsDibuat3TahunLepasTerjadi:
                                    e.target.value,
                                });
                                setConfirmData({
                                  ...confirmData,
                                  pilihanDataSalah: {
                                    ...pilihanDataSalah,
                                    eBilanganFsDibuat3TahunLepasTerjadi:
                                      e.target.value,
                                  },
                                });
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none mr-3 drop-shadow-lg'
                            />
                            <span className='text-kaunter4'>
                              <FaCheck className='text-2xl' />
                            </span>
                          </div>
                        )}
                      </div>
                    </article>
                  </section>
                )}
                {tidakHadirPemeriksaan === 'ya-kehadiran-pemeriksaan' ||
                engganPemeriksaan === 'ya-enggan-pemeriksaan' ? null : (
                  <span className='flex bg-user3 p-2 w-full capitalize col-span-1 md:col-span-2'>
                    <p className='ml-3 text-xl font-semibold'>Perlu Dibuat</p>
                  </span>
                )}
                {tidakHadirPemeriksaan === 'ya-kehadiran-pemeriksaan' ||
                engganPemeriksaan === 'ya-enggan-pemeriksaan' ? null : (
                  <section className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 mb-3 w-full col-span-1 sm:col-span-2'>
                    <div className='grid gap-2'>
                      <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                        <div className='font-bold flex flex-row items-center pl-5 col-span-2'>
                          <h4>
                            Pengapan Fisur (E10)
                            <FaInfoCircle
                              title='Fissure Sealant'
                              className='m-2 inline-flex'
                            />
                          </h4>
                          <span
                            className={`text-xs text-userWhite font-mono px-2 py-1 text-center rounded-lg ml-1 ${
                              sumGigiKekalE !== eAdaGigiKekal
                                ? 'bg-user9'
                                : 'bg-user7'
                            } `}
                          >
                            E : {eAdaGigiKekal}{' '}
                            {eAdaGigiKekal !== sumGigiKekalE ? '≠' : '='}{' '}
                            {sumGigiKekalE}
                          </span>
                        </div>
                        {/* <div className='flex flex-row items-center pl-11 col-span-2'>
                          <input
                            disabled={isDisabled}
                            type='checkbox'
                            name='baru-jumlah-murid-perlu-fs'
                            id='baru-jumlah-murid-perlu-fs'
                            checked={baruJumlahMuridPerluFs}
                            onChange={() => {
                              setBaruJumlahMuridPerluFs(
                                !baruJumlahMuridPerluFs
                              );
                              setConfirmData({
                                ...confirmData,
                                baruJumlahMuridPerluFs: !baruJumlahMuridPerluFs,
                              });
                            }}
                            className='w-4 h-4 bg-user4 rounded focus:ring-user2 mr-3'
                          />
                          <label
                            htmlFor='baru-jumlah-murid-perlu-fs'
                            className='text-sm font-m'
                          >
                            murid perlu pengapan fisur
                          </label>
                        </div> */}
                        <div
                          className={`${
                            pilihanDataSalah.baruJumlahGigiKekalPerluFsCBox &&
                            'grid-rows-2'
                          } grid px-3 pt-1 col-span-2`}
                        >
                          <div
                            className={`${
                              pilihanDataSalah.baruJumlahGigiKekalPerluFsCBox &&
                              'bg-user9 bg-opacity-20'
                            } flex items-center flex-row pl-5 mt-2 `}
                          >
                            <input
                              disabled={isDisabled}
                              min='0'
                              max='16'
                              type='number'
                              name='baru-jumlah-gigi-kekal-perlu-fs'
                              id='baru-jumlah-gigi-kekal-perlu-fs'
                              value={baruJumlahGigiKekalPerluFs}
                              onChange={(e) => {
                                setBaruJumlahGigiKekalPerluFs(e.target.value);
                                setConfirmData({
                                  ...confirmData,
                                  baruJumlahGigiKekalPerluFs: e.target.value,
                                });
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 mr-3 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                            <label
                              htmlFor='baru-jumlah-gigi-kekal-perlu-fs'
                              className='text-sm font-m'
                            >
                              jumlah gigi kekal perlu Pengapan Fisur (E10)
                            </label>
                            <div className='relative'>
                              <input
                                disabled={disableSalah}
                                type='checkbox'
                                name='baru-jumlah-gigi-kekal-perlu-fs-reten-salah-cbox'
                                id='baru-jumlah-gigi-kekal-perlu-fs-reten-salah-cbox'
                                checked={
                                  pilihanDataSalah.baruJumlahGigiKekalPerluFsCBox
                                }
                                onChange={() => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    baruJumlahGigiKekalPerluFsCBox:
                                      !pilihanDataSalah.baruJumlahGigiKekalPerluFsCBox,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    baruJumlahGigiKekalPerluFsCBox:
                                      !pilihanDataSalah.baruJumlahGigiKekalPerluFsCBox,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      baruJumlahGigiKekalPerluFsCBox:
                                        !pilihanDataSalah.baruJumlahGigiKekalPerluFsCBox,
                                    },
                                  });
                                }}
                                className='peer hidden'
                              />
                              <label
                                htmlFor='baru-jumlah-gigi-kekal-perlu-fs-reten-salah-cbox'
                                className={` ${
                                  disableSalah === true
                                    ? 'pointer-events-none'
                                    : 'cursor-pointer '
                                } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                              >
                                {pilihanDataSalah.baruJumlahGigiKekalPerluFsCBox ===
                                true ? (
                                  <FaTimes
                                    className='text-2xl'
                                    onClick={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        baruJumlahGigiKekalPerluFs: '',
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        baruJumlahGigiKekalPerluFs: '',
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          baruJumlahGigiKekalPerluFs: '',
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
                          {pilihanDataSalah.baruJumlahGigiKekalPerluFsCBox ===
                            true && (
                            <div className='flex flex-row items-center pl-5 pb-2  bg-user11 bg-opacity-50'>
                              <input
                                disabled={disableSalah}
                                min='0'
                                max='16'
                                type='number'
                                name='baru-jumlah-gigi-kekal-perlu-fs-reten-salah'
                                id='baru-jumlah-gigi-kekal-perlu-fs-reten-salah'
                                value={
                                  pilihanDataSalah.baruJumlahGigiKekalPerluFs
                                }
                                onChange={(e) => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    baruJumlahGigiKekalPerluFs: e.target.value,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    baruJumlahGigiKekalPerluFs: e.target.value,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      baruJumlahGigiKekalPerluFs:
                                        e.target.value,
                                    },
                                  });
                                }}
                                className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 mr-3 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              />
                              <label
                                htmlFor='baru-jumlah-gigi-kekal-perlu-fs-reten-salah'
                                className='text-sm font-m'
                              >
                                jumlah gigi kekal perlu Pengapan Fisur (E10)
                              </label>
                              <span className='text-kaunter4'>
                                <FaCheck className='text-2xl' />
                              </span>
                            </div>
                          )}
                        </div>
                        {sumPerluFs > 16 && (
                          <p className='col-span-2 text-user6 font-semibold'>
                            jumlah baru & semula FS tidak boleh melebihi 16
                          </p>
                        )}
                      </article>
                      <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                        <h4 className='font-bold flex flex-row items-center pl-5 col-span-2'>
                          Sapuan Fluorida (FV) (E13)
                          <FaInfoCircle
                            title='Fluoride Varnish Application'
                            className='m-2'
                          />
                          <span
                            className={`text-xs text-userWhite font-mono px-2 py-1 text-center rounded-lg ml-1 ${
                              sumGigiKekalE !== eAdaGigiKekal
                                ? 'bg-user9'
                                : 'bg-user7'
                            } `}
                          >
                            E : {eAdaGigiKekal}{' '}
                            {eAdaGigiKekal !== sumGigiKekalE ? '≠' : '='}{' '}
                            {sumGigiKekalE}
                          </span>
                        </h4>
                        {/* <div className='flex flex-row items-center pl-11 col-span-2 pb-2'>
                          <input
                            disabled={isDisabled}
                            type='checkbox'
                            name='baru-jumlah-murid-perlu-fv'
                            id='baru-jumlah-murid-perlu-fv'
                            checked={baruJumlahMuridPerluFv}
                            onChange={() => {
                              setBaruJumlahMuridPerluFv(
                                !baruJumlahMuridPerluFv
                              );
                              setConfirmData({
                                ...confirmData,
                                baruJumlahMuridPerluFv: !baruJumlahMuridPerluFv,
                              });
                            }}
                            className='w-4 h-4 bg-user4 rounded focus:ring-user2 mr-3'
                          />
                          <label
                            htmlFor='baru-jumlah-murid-perlu-fv'
                            className='text-sm font-m'
                          >
                            murid perlu Sapuan Fluorida(FV)
                          </label>
                        </div> */}
                        <div
                          className={`${
                            pilihanDataSalah.baruJumlahGigiKekalPerluFvCBox &&
                            'grid-rows-2'
                          } grid px-3 pt-1 col-span-2`}
                        >
                          <div
                            className={`${
                              pilihanDataSalah.baruJumlahGigiKekalPerluFvCBox &&
                              'bg-user9 bg-opacity-20'
                            } flex items-center flex-row pl-5 mt-2 col-span-2`}
                          >
                            <input
                              disabled={isDisabled}
                              min='0'
                              max='16'
                              type='number'
                              name='baru-jumlah-gigi-kekal-perlu-fv'
                              id='baru-jumlah-gigi-kekal-perlu-fv'
                              value={baruJumlahGigiKekalPerluFv}
                              onChange={(e) => {
                                setBaruJumlahGigiKekalPerluFv(e.target.value);
                                setConfirmData({
                                  ...confirmData,
                                  baruJumlahGigiKekalPerluFv: e.target.value,
                                });
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 mr-3 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                            <label
                              className='text-sm font-m'
                              htmlFor='baru-jumlah-gigi-kekal-perlu-fv'
                            >
                              jumlah gigi kekal perlu Sapuan Fluorida(FV) (E13)
                            </label>
                            <div className='relative'>
                              <input
                                disabled={disableSalah}
                                type='checkbox'
                                name='baru-jumlah-gigi-kekal-perlu-fv-reten-salah-cbox'
                                id='baru-jumlah-gigi-kekal-perlu-fv-reten-salah-cbox'
                                checked={
                                  pilihanDataSalah.baruJumlahGigiKekalPerluFvCBox
                                }
                                onChange={() => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    baruJumlahGigiKekalPerluFvCBox:
                                      !pilihanDataSalah.baruJumlahGigiKekalPerluFvCBox,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    baruJumlahGigiKekalPerluFvCBox:
                                      !pilihanDataSalah.baruJumlahGigiKekalPerluFvCBox,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      baruJumlahGigiKekalPerluFvCBox:
                                        !pilihanDataSalah.baruJumlahGigiKekalPerluFvCBox,
                                    },
                                  });
                                }}
                                className='peer hidden'
                              />
                              <label
                                htmlFor='baru-jumlah-gigi-kekal-perlu-fv-reten-salah-cbox'
                                className={` ${
                                  disableSalah === true
                                    ? 'pointer-events-none'
                                    : 'cursor-pointer '
                                } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                              >
                                {pilihanDataSalah.baruJumlahGigiKekalPerluFvCBox ===
                                true ? (
                                  <FaTimes
                                    className='text-2xl'
                                    onClick={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        baruJumlahGigiKekalPerluFv: '',
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        baruJumlahGigiKekalPerluFv: '',
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          baruJumlahGigiKekalPerluFv: '',
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
                          {pilihanDataSalah.baruJumlahGigiKekalPerluFvCBox ===
                            true && (
                            <div className='flex flex-row items-center pl-5 col-span-2 pb-2 bg-user11 bg-opacity-50'>
                              <input
                                disabled={disableSalah}
                                min='0'
                                max='16'
                                type='number'
                                name='baru-jumlah-gigi-kekal-perlu-fv-reten-salah'
                                id='baru-jumlah-gigi-kekal-perlu-fv-reten-salah'
                                value={
                                  pilihanDataSalah.baruJumlahGigiKekalPerluFv
                                }
                                onChange={(e) => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    baruJumlahGigiKekalPerluFv: e.target.value,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    baruJumlahGigiKekalPerluFv: e.target.value,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      baruJumlahGigiKekalPerluFv:
                                        e.target.value,
                                    },
                                  });
                                }}
                                className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 mr-3 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              />
                              <label
                                className='text-sm font-m'
                                htmlFor='baru-jumlah-gigi-kekal-perlu-fv-reten-salah'
                              >
                                jumlah gigi kekal perlu Sapuan Fluorida(FV)
                                (E13)
                              </label>
                              <span className='text-kaunter4'>
                                <FaCheck className='text-2xl' />
                              </span>
                            </div>
                          )}
                        </div>
                        {sumPerluFv > 16 && (
                          <p className='col-span-2 text-user6 font-semibold'>
                            jumlah baru & semula FV tidak boleh melebihi 16
                          </p>
                        )}
                      </article>
                      <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                        <div className='flex flex-row items-center font-bold md:pl-5 col-span-2'>
                          <h4 className='text-sm md:text-base'>
                            Resin Pencegahan Jenis 1 (PRR Type I) (E12)
                          </h4>
                          <span
                            className={`text-xs text-userWhite font-mono px-2 py-1 text-center rounded-lg ml-1 whitespace-nowrap ${
                              sumGigiKekalE !== eAdaGigiKekal
                                ? 'bg-user9'
                                : 'bg-user7'
                            } `}
                          >
                            E : {eAdaGigiKekal}{' '}
                            {eAdaGigiKekal !== sumGigiKekalE ? '≠' : '='}{' '}
                            {sumGigiKekalE}
                          </span>
                        </div>
                        {/* <div className='flex flex-row items-center pl-11 col-span-2'>
                          
                          <label
                            htmlFor='baru-jumlah-murid-perlu-prr-jenis-1'
                            className='text-sm font-m'
                          >
                            murid perlu resin Pencegahan Jenis 1 (PRR Type I)
                          </label><input
                            disabled={isDisabled}
                            type='checkbox'
                            name='baru-jumlah-murid-perlu-prr-jenis-1'
                            id='baru-jumlah-murid-perlu-prr-jenis-1'
                            checked={baruJumlahMuridPerluPrrJenis1}
                            onChange={() => {
                              setBaruJumlahMuridPerluPrrJenis1(
                                !baruJumlahMuridPerluPrrJenis1
                              );
                              setConfirmData({
                                ...confirmData,
                                baruJumlahMuridPerluPrrJenis1:
                                  !baruJumlahMuridPerluPrrJenis1,
                              });
                            }}
                            className='w-4 h-4 bg-user4 rounded focus:ring-user2 mr-3'
                          />
                        </div> */}
                        <div
                          className={`${
                            pilihanDataSalah.baruJumlahGigiKekalPerluPrrJenis1CBox &&
                            'grid-rows-2'
                          } grid px-3 pt-1 col-span-2`}
                        >
                          <div
                            className={`${
                              pilihanDataSalah.baruJumlahGigiKekalPerluPrrJenis1CBox &&
                              'bg-user9 bg-opacity-20'
                            } flex items-center flex-row pl-5 mt-2 col-span-2`}
                          >
                            <input
                              disabled={isDisabled}
                              min='0'
                              max='16'
                              type='number'
                              name='baru-jumlah-gigi-kekal-perlu-prr-jenis-1'
                              id='baru-jumlah-gigi-kekal-perlu-prr-jenis-1'
                              value={baruJumlahGigiKekalPerluPrrJenis1}
                              onChange={(e) => {
                                setBaruJumlahGigiKekalPerluPrrJenis1(
                                  e.target.value
                                );
                                setConfirmData({
                                  ...confirmData,
                                  baruJumlahGigiKekalPerluPrrJenis1:
                                    e.target.value,
                                });
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 mr-3 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                            <label
                              htmlFor='baru-jumlah-gigi-kekal-perlu-prr-jenis-1'
                              className='text-sm font-m'
                            >
                              jumlah gigi kekal perlu Resin Pencegahan Jenis 1
                              (PRR Type I) (E12)
                            </label>
                            <div className='relative'>
                              <input
                                disabled={disableSalah}
                                type='checkbox'
                                name='baru-jumlah-gigi-kekal-perlu-prr-jenis-1-reten-salah-cbox'
                                id='baru-jumlah-gigi-kekal-perlu-prr-jenis-1-reten-salah-cbox'
                                checked={
                                  pilihanDataSalah.baruJumlahGigiKekalPerluPrrJenis1CBox
                                }
                                onChange={() => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    baruJumlahGigiKekalPerluPrrJenis1CBox:
                                      !pilihanDataSalah.baruJumlahGigiKekalPerluPrrJenis1CBox,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    baruJumlahGigiKekalPerluPrrJenis1CBox:
                                      !pilihanDataSalah.baruJumlahGigiKekalPerluPrrJenis1CBox,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      baruJumlahGigiKekalPerluPrrJenis1CBox:
                                        !pilihanDataSalah.baruJumlahGigiKekalPerluPrrJenis1CBox,
                                    },
                                  });
                                }}
                                className='peer hidden'
                              />
                              <label
                                htmlFor='baru-jumlah-gigi-kekal-perlu-prr-jenis-1-reten-salah-cbox'
                                className={` ${
                                  disableSalah === true
                                    ? 'pointer-events-none'
                                    : 'cursor-pointer '
                                } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                              >
                                {pilihanDataSalah.baruJumlahGigiKekalPerluPrrJenis1CBox ===
                                true ? (
                                  <FaTimes
                                    className='text-2xl'
                                    onClick={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        baruJumlahGigiKekalPerluPrrJenis1: '',
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        baruJumlahGigiKekalPerluPrrJenis1: '',
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          baruJumlahGigiKekalPerluPrrJenis1: '',
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
                          {pilihanDataSalah.baruJumlahGigiKekalPerluPrrJenis1CBox ===
                            true && (
                            <div className='flex flex-row items-center pl-5 col-span-2 pb-2  bg-user11 bg-opacity-50'>
                              <input
                                disabled={disableSalah}
                                min='0'
                                max='16'
                                type='number'
                                name='baru-jumlah-gigi-kekal-perlu-prr-jenis-1-reten-salah'
                                id='baru-jumlah-gigi-kekal-perlu-prr-jenis-1-reten-salah'
                                value={
                                  pilihanDataSalah.baruJumlahGigiKekalPerluPrrJenis1
                                }
                                onChange={(e) => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    baruJumlahGigiKekalPerluPrrJenis1:
                                      e.target.value,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    baruJumlahGigiKekalPerluPrrJenis1:
                                      e.target.value,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      baruJumlahGigiKekalPerluPrrJenis1:
                                        e.target.value,
                                    },
                                  });
                                }}
                                className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 mr-3 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              />
                              <label
                                htmlFor='baru-jumlah-gigi-kekal-perlu-prr-jenis-1-reten-salah'
                                className='text-sm font-m'
                              >
                                jumlah gigi kekal perlu Resin Pencegahan Jenis 1
                                (PRR Type I) (E12)
                              </label>
                              <span className='text-kaunter4'>
                                <FaCheck className='text-2xl' />
                              </span>
                            </div>
                          )}
                        </div>
                        {sumPerluPrr > 16 && (
                          <p className='col-span-2 text-user6 font-semibold'>
                            jumlah baru & semula PRR tidak boleh melebihi 16
                          </p>
                        )}
                      </article>
                    </div>
                    <div className='grid auto-rows-min gap-2'>
                      {/* <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                        <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                          Silver Diamine Fluoride
                        </h4>
                        <p className='flex flex-row pl-5 text-sm font-m col-span-2'>
                          Perlu Sapuan<span className='text-user6'>*</span>
                        </p>
                        <div className='flex items-center justify-center'>
                          <input
                          disabled={isDisabled}
                            required
                            type='radio'
                            name='silver-diamine-fluoride-perlu-sapuan'
                            id='ya-silver-diamine-fluoride-perlu-sapuan'
                            value='ya-silver-diamine-fluoride-perlu-sapuan'
                            checked={
                              yaTidakSilverDiamineFluoridePerluSapuan ===
                              'ya-silver-diamine-fluoride-perlu-sapuan'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              setYaTidakSilverDiamineFluoridePerluSapuan(
                                e.target.value
                              );
                              setConfirmData({
                                ...confirmData,
                                yaTidakSilverDiamineFluoridePerluSapuan:
                                  e.target.value,
                              });
                            }}
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          />
                          <label
                            htmlFor='ya-silver-diamine-fluoride-perlu-sapuan'
                            className='m-2 text-sm font-m'
                          >
                            Ya
                          </label>
                          <input
                          disabled={isDisabled}
                            required
                            type='radio'
                            name='silver-diamine-fluoride-perlu-sapuan'
                            id='tidak-silver-diamine-fluoride-perlu-sapuan'
                            value='tidak-silver-diamine-fluoride-perlu-sapuan'
                            checked={
                              yaTidakSilverDiamineFluoridePerluSapuan ===
                              'tidak-silver-diamine-fluoride-perlu-sapuan'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              setYaTidakSilverDiamineFluoridePerluSapuan(
                                e.target.value
                              );
                              setConfirmData({
                                ...confirmData,
                                yaTidakSilverDiamineFluoridePerluSapuan:
                                  e.target.value,
                              });
                            }}
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          />
                          <label
                            htmlFor='tidak-silver-diamine-fluoride-perlu-sapuan'
                            className='m-2 text-sm font-m'
                          >
                            Tidak
                          </label>
                        </div>
                      </article> */}
                      <article className='border border-userBlack pl-3 p-2 rounded-md'>
                        <div className='font-bold flex flex-col lg:flex-row lg:pl-5 col-span-2'>
                          <h4 className='flex items-center justify-center'>
                            Jumlah Tampalan Diperlukan
                          </h4>
                          <div className='m-1 flex items-center justify-center'>
                            <span
                              className={`text-xs text-userWhite font-mono px-2 py-1 text-center rounded-lg ${
                                dAdaGigiKekal <= sumGigiKekal
                                  ? dAdaGigiKekal === 0 && sumGigiKekal > 0
                                    ? 'bg-user9'
                                    : 'bg-user7'
                                  : 'bg-user9'
                              } `}
                            >
                              D : {dAdaGigiKekal}{' '}
                              {dAdaGigiKekal <= sumGigiKekal ? '≤' : '>'}{' '}
                              {sumGigiKekal}
                            </span>
                          </div>
                        </div>
                        <div className='grid grid-rows-2 gap-2'>
                          <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                            <h4 className='font-semibold flex flex-row pl-5 col-span-2'>
                              Anterior Sewarna
                            </h4>
                            <div
                              className={`${
                                pilihanDataSalah.baruGDAnteriorSewarnaJumlahTampalanDiperlukanCBox &&
                                'grid-rows-2'
                              } grid px-3 pt-1`}
                            >
                              <div
                                className={`${
                                  pilihanDataSalah.baruGDAnteriorSewarnaJumlahTampalanDiperlukanCBox &&
                                  'bg-user9 bg-opacity-20'
                                } flex items-center flex-row `}
                              >
                                <input
                                  disabled={isDisabled}
                                  type='number'
                                  name='gd-baru-anterior-sewarna-jumlah-tampalan-diperlukan'
                                  id='gd-baru-anterior-sewarna-jumlah-tampalan-diperlukan'
                                  value={
                                    baruGDAnteriorSewarnaJumlahTampalanDiperlukan
                                  }
                                  onChange={(e) => {
                                    setBaruGDAnteriorSewarnaJumlahTampalanDiperlukan(
                                      e.target.value
                                    );
                                    setConfirmData({
                                      ...confirmData,
                                      baruGDAnteriorSewarnaJumlahTampalanDiperlukan:
                                        e.target.value,
                                    });
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                  min='0'
                                  max='32'
                                  required
                                />
                                <label
                                  htmlFor='gd-baru-anterior-sewarna-jumlah-tampalan-diperlukan'
                                  className='text-sm font-m ml-2 m-1'
                                >
                                  GD Baru
                                  <span className='text-user6'>*</span>
                                </label>
                                <div className='relative'>
                                  <input
                                    disabled={disableSalah}
                                    type='checkbox'
                                    name='gd-baru-anterior-sewarna-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    id='gd-baru-anterior-sewarna-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    checked={
                                      pilihanDataSalah.baruGDAnteriorSewarnaJumlahTampalanDiperlukanCBox
                                    }
                                    onChange={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        baruGDAnteriorSewarnaJumlahTampalanDiperlukanCBox:
                                          !pilihanDataSalah.baruGDAnteriorSewarnaJumlahTampalanDiperlukanCBox,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        baruGDAnteriorSewarnaJumlahTampalanDiperlukanCBox:
                                          !pilihanDataSalah.baruGDAnteriorSewarnaJumlahTampalanDiperlukanCBox,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          baruGDAnteriorSewarnaJumlahTampalanDiperlukanCBox:
                                            !pilihanDataSalah.baruGDAnteriorSewarnaJumlahTampalanDiperlukanCBox,
                                        },
                                      });
                                    }}
                                    className='peer hidden'
                                  />
                                  <label
                                    htmlFor='gd-baru-anterior-sewarna-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    className={` ${
                                      disableSalah === true
                                        ? 'pointer-events-none'
                                        : 'cursor-pointer '
                                    } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                  >
                                    {pilihanDataSalah.baruGDAnteriorSewarnaJumlahTampalanDiperlukanCBox ===
                                    true ? (
                                      <FaTimes
                                        className='text-2xl'
                                        onClick={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            baruGDAnteriorSewarnaJumlahTampalanDiperlukan:
                                              '',
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            baruGDAnteriorSewarnaJumlahTampalanDiperlukan:
                                              '',
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              baruGDAnteriorSewarnaJumlahTampalanDiperlukan:
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
                              {pilihanDataSalah.baruGDAnteriorSewarnaJumlahTampalanDiperlukanCBox ===
                                true && (
                                <div className='flex flex-row pl-1 items-center bg-user11 bg-opacity-50 mb-1'>
                                  <input
                                    disabled={disableSalah}
                                    min='0'
                                    max='32'
                                    type='number'
                                    name='gd-baru-anterior-sewarna-jumlah-tampalan-diperlukan'
                                    id='gd-baru-anterior-sewarna-jumlah-tampalan-diperlukan'
                                    value={
                                      pilihanDataSalah.baruGDAnteriorSewarnaJumlahTampalanDiperlukan
                                    }
                                    onChange={(e) => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        baruGDAnteriorSewarnaJumlahTampalanDiperlukan:
                                          e.target.value,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        baruGDAnteriorSewarnaJumlahTampalanDiperlukan:
                                          e.target.value,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          baruGDAnteriorSewarnaJumlahTampalanDiperlukan:
                                            e.target.value,
                                        },
                                      });
                                    }}
                                    className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none mr-3 drop-shadow-lg'
                                  />
                                  <p className='text-sm font-m '>GD Baru</p>
                                  <span className='text-kaunter4'>
                                    <FaCheck className='text-2xl ml-2' />
                                  </span>
                                </div>
                              )}
                            </div>
                            <div
                              className={`${
                                pilihanDataSalah.semulaGDAnteriorSewarnaJumlahTampalanDiperlukanCBox &&
                                'grid-rows-2'
                              } grid px-3 pt-1`}
                            >
                              <div
                                className={`${
                                  pilihanDataSalah.semulaGDAnteriorSewarnaJumlahTampalanDiperlukanCBox &&
                                  'bg-user9 bg-opacity-20'
                                } flex items-center flex-row `}
                              >
                                <input
                                  disabled={isDisabled}
                                  type='number'
                                  name='gd-semula-anterior-sewarna-jumlah-tampalan-diperlukan'
                                  id='gd-semula-anterior-sewarna-jumlah-tampalan-diperlukan'
                                  value={
                                    semulaGDAnteriorSewarnaJumlahTampalanDiperlukan
                                  }
                                  onChange={(e) => {
                                    setSemulaGDAnteriorSewarnaJumlahTampalanDiperlukan(
                                      e.target.value
                                    );
                                    setConfirmData({
                                      ...confirmData,
                                      semulaGDAnteriorSewarnaJumlahTampalanDiperlukan:
                                        e.target.value,
                                    });
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                  min='0'
                                  max='32'
                                  required
                                />
                                <label
                                  htmlFor='gd-semula-anterior-sewarna-jumlah-tampalan-diperlukan'
                                  className='text-sm font-m ml-2 m-1'
                                >
                                  GD Semula
                                  <span className='text-user6'>*</span>
                                </label>
                                <div className='relative'>
                                  <input
                                    disabled={disableSalah}
                                    type='checkbox'
                                    name='gd-semula-anterior-sewarna-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    id='gd-semula-anterior-sewarna-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    checked={
                                      pilihanDataSalah.semulaGDAnteriorSewarnaJumlahTampalanDiperlukanCBox
                                    }
                                    onChange={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        semulaGDAnteriorSewarnaJumlahTampalanDiperlukanCBox:
                                          !pilihanDataSalah.semulaGDAnteriorSewarnaJumlahTampalanDiperlukanCBox,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        semulaGDAnteriorSewarnaJumlahTampalanDiperlukanCBox:
                                          !pilihanDataSalah.semulaGDAnteriorSewarnaJumlahTampalanDiperlukanCBox,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          semulaGDAnteriorSewarnaJumlahTampalanDiperlukanCBox:
                                            !pilihanDataSalah.semulaGDAnteriorSewarnaJumlahTampalanDiperlukanCBox,
                                        },
                                      });
                                    }}
                                    className='peer hidden'
                                  />
                                  <label
                                    htmlFor='gd-semula-anterior-sewarna-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    className={` ${
                                      disableSalah === true
                                        ? 'pointer-events-none'
                                        : 'cursor-pointer '
                                    } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                  >
                                    {pilihanDataSalah.semulaGDAnteriorSewarnaJumlahTampalanDiperlukanCBox ===
                                    true ? (
                                      <FaTimes
                                        className='text-2xl'
                                        onClick={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            semulaGDAnteriorSewarnaJumlahTampalanDiperlukan:
                                              '',
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            semulaGDAnteriorSewarnaJumlahTampalanDiperlukan:
                                              '',
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              semulaGDAnteriorSewarnaJumlahTampalanDiperlukan:
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
                              {pilihanDataSalah.semulaGDAnteriorSewarnaJumlahTampalanDiperlukanCBox ===
                                true && (
                                <div className='flex flex-row pl-1 items-center bg-user11 bg-opacity-50 mb-1'>
                                  <input
                                    disabled={disableSalah}
                                    min='0'
                                    max='32'
                                    type='number'
                                    name='gd-semula-anterior-sewarna-jumlah-tampalan-diperlukan'
                                    id='gd-semula-anterior-sewarna-jumlah-tampalan-diperlukan'
                                    value={
                                      pilihanDataSalah.semulaGDAnteriorSewarnaJumlahTampalanDiperlukan
                                    }
                                    onChange={(e) => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        semulaGDAnteriorSewarnaJumlahTampalanDiperlukan:
                                          e.target.value,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        semulaGDAnteriorSewarnaJumlahTampalanDiperlukan:
                                          e.target.value,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          semulaGDAnteriorSewarnaJumlahTampalanDiperlukan:
                                            e.target.value,
                                        },
                                      });
                                    }}
                                    className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none mr-3 drop-shadow-lg'
                                  />
                                  <p className='text-sm font-m '>GD Semula</p>
                                  <span className='text-kaunter4'>
                                    <FaCheck className='text-2xl ml-2' />
                                  </span>
                                </div>
                              )}
                            </div>
                            <div
                              className={`${
                                pilihanDataSalah.baruGKAnteriorSewarnaJumlahTampalanDiperlukanCBox &&
                                'grid-rows-2'
                              } grid px-3 pt-1`}
                            >
                              <div
                                className={`${
                                  pilihanDataSalah.baruGKAnteriorSewarnaJumlahTampalanDiperlukanCBox &&
                                  'bg-user9 bg-opacity-20'
                                } flex items-center flex-row `}
                              >
                                <input
                                  disabled={isDisabled}
                                  type='number'
                                  name='gk-baru-anterior-sewarna-jumlah-tampalan-diperlukan'
                                  id='gk-baru-anterior-sewarna-jumlah-tampalan-diperlukan'
                                  value={
                                    baruGKAnteriorSewarnaJumlahTampalanDiperlukan
                                  }
                                  onChange={(e) => {
                                    setBaruGKAnteriorSewarnaJumlahTampalanDiperlukan(
                                      e.target.value
                                    );
                                    setConfirmData({
                                      ...confirmData,
                                      baruGKAnteriorSewarnaJumlahTampalanDiperlukan:
                                        e.target.value,
                                    });
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                  min='0'
                                  max='32'
                                  required
                                />
                                <label
                                  htmlFor='gk-baru-anterior-sewarna-jumlah-tampalan-diperlukan'
                                  className='text-sm font-m ml-2 m-1'
                                >
                                  GK Baru
                                  <span className='text-user6'>*</span>
                                </label>
                                <div className='relative'>
                                  <input
                                    disabled={disableSalah}
                                    type='checkbox'
                                    name='gk-baru-anterior-sewarna-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    id='gk-baru-anterior-sewarna-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    checked={
                                      pilihanDataSalah.baruGKAnteriorSewarnaJumlahTampalanDiperlukanCBox
                                    }
                                    onChange={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        baruGKAnteriorSewarnaJumlahTampalanDiperlukanCBox:
                                          !pilihanDataSalah.baruGKAnteriorSewarnaJumlahTampalanDiperlukanCBox,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        baruGKAnteriorSewarnaJumlahTampalanDiperlukanCBox:
                                          !pilihanDataSalah.baruGKAnteriorSewarnaJumlahTampalanDiperlukanCBox,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          baruGKAnteriorSewarnaJumlahTampalanDiperlukanCBox:
                                            !pilihanDataSalah.baruGKAnteriorSewarnaJumlahTampalanDiperlukanCBox,
                                        },
                                      });
                                    }}
                                    className='peer hidden'
                                  />
                                  <label
                                    htmlFor='gk-baru-anterior-sewarna-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    className={` ${
                                      disableSalah === true
                                        ? 'pointer-events-none'
                                        : 'cursor-pointer '
                                    } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                  >
                                    {pilihanDataSalah.baruGKAnteriorSewarnaJumlahTampalanDiperlukanCBox ===
                                    true ? (
                                      <FaTimes
                                        className='text-2xl'
                                        onClick={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            baruGKAnteriorSewarnaJumlahTampalanDiperlukan:
                                              '',
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            baruGKAnteriorSewarnaJumlahTampalanDiperlukan:
                                              '',
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              baruGKAnteriorSewarnaJumlahTampalanDiperlukan:
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
                              {pilihanDataSalah.baruGKAnteriorSewarnaJumlahTampalanDiperlukanCBox ===
                                true && (
                                <div className='flex flex-row pl-1 items-center bg-user11 bg-opacity-50 mb-1'>
                                  <input
                                    disabled={disableSalah}
                                    min='0'
                                    max='32'
                                    type='number'
                                    name='gk-baru-anterior-sewarna-jumlah-tampalan-diperlukan'
                                    id='gk-baru-anterior-sewarna-jumlah-tampalan-diperlukan'
                                    value={
                                      pilihanDataSalah.baruGKAnteriorSewarnaJumlahTampalanDiperlukan
                                    }
                                    onChange={(e) => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        baruGKAnteriorSewarnaJumlahTampalanDiperlukan:
                                          e.target.value,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        baruGKAnteriorSewarnaJumlahTampalanDiperlukan:
                                          e.target.value,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          baruGKAnteriorSewarnaJumlahTampalanDiperlukan:
                                            e.target.value,
                                        },
                                      });
                                    }}
                                    className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none mr-3 drop-shadow-lg'
                                  />
                                  <p className='text-sm font-m '>GK Baru</p>
                                  <span className='text-kaunter4'>
                                    <FaCheck className='text-2xl ml-2' />
                                  </span>
                                </div>
                              )}
                            </div>
                            <div
                              className={`${
                                pilihanDataSalah.semulaGKAnteriorSewarnaJumlahTampalanDiperlukanCBox &&
                                'grid-rows-2'
                              } grid px-3 pt-1`}
                            >
                              <div
                                className={`${
                                  pilihanDataSalah.semulaGKAnteriorSewarnaJumlahTampalanDiperlukanCBox &&
                                  'bg-user9 bg-opacity-20'
                                } flex items-center flex-row `}
                              >
                                <input
                                  disabled={isDisabled}
                                  type='number'
                                  name='gk-semula-anterior-sewarna-jumlah-tampalan-diperlukan'
                                  id='gk-semula-anterior-sewarna-jumlah-tampalan-diperlukan'
                                  value={
                                    semulaGKAnteriorSewarnaJumlahTampalanDiperlukan
                                  }
                                  onChange={(e) => {
                                    setSemulaGKAnteriorSewarnaJumlahTampalanDiperlukan(
                                      e.target.value
                                    );
                                    setConfirmData({
                                      ...confirmData,
                                      semulaGKAnteriorSewarnaJumlahTampalanDiperlukan:
                                        e.target.value,
                                    });
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                  min='0'
                                  max='32'
                                  required
                                />
                                <label
                                  htmlFor='gk-semula-anterior-sewarna-jumlah-tampalan-diperlukan'
                                  className='text-sm font-m ml-2 m-1'
                                >
                                  GK Semula
                                  <span className='text-user6'>*</span>
                                </label>
                                <div className='relative'>
                                  <input
                                    disabled={disableSalah}
                                    type='checkbox'
                                    name='gk-semula-anterior-sewarna-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    id='gk-semula-anterior-sewarna-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    checked={
                                      pilihanDataSalah.semulaGKAnteriorSewarnaJumlahTampalanDiperlukanCBox
                                    }
                                    onChange={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        semulaGKAnteriorSewarnaJumlahTampalanDiperlukanCBox:
                                          !pilihanDataSalah.semulaGKAnteriorSewarnaJumlahTampalanDiperlukanCBox,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        semulaGKAnteriorSewarnaJumlahTampalanDiperlukanCBox:
                                          !pilihanDataSalah.semulaGKAnteriorSewarnaJumlahTampalanDiperlukanCBox,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          semulaGKAnteriorSewarnaJumlahTampalanDiperlukanCBox:
                                            !pilihanDataSalah.semulaGKAnteriorSewarnaJumlahTampalanDiperlukanCBox,
                                        },
                                      });
                                    }}
                                    className='peer hidden'
                                  />
                                  <label
                                    htmlFor='gk-semula-anterior-sewarna-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    className={` ${
                                      disableSalah === true
                                        ? 'pointer-events-none'
                                        : 'cursor-pointer '
                                    } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                  >
                                    {pilihanDataSalah.semulaGKAnteriorSewarnaJumlahTampalanDiperlukanCBox ===
                                    true ? (
                                      <FaTimes
                                        className='text-2xl'
                                        onClick={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            semulaGKAnteriorSewarnaJumlahTampalanDiperlukan:
                                              '',
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            semulaGKAnteriorSewarnaJumlahTampalanDiperlukan:
                                              '',
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              semulaGKAnteriorSewarnaJumlahTampalanDiperlukan:
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
                              {pilihanDataSalah.semulaGKAnteriorSewarnaJumlahTampalanDiperlukanCBox ===
                                true && (
                                <div className='flex flex-row pl-1 items-center bg-user11 bg-opacity-50 mb-1'>
                                  <input
                                    disabled={disableSalah}
                                    min='0'
                                    max='32'
                                    type='number'
                                    name='gk-semula-anterior-sewarna-jumlah-tampalan-diperlukan'
                                    id='gk-semula-anterior-sewarna-jumlah-tampalan-diperlukan'
                                    value={
                                      pilihanDataSalah.semulaGKAnteriorSewarnaJumlahTampalanDiperlukan
                                    }
                                    onChange={(e) => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        semulaGKAnteriorSewarnaJumlahTampalanDiperlukan:
                                          e.target.value,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        semulaGKAnteriorSewarnaJumlahTampalanDiperlukan:
                                          e.target.value,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          semulaGKAnteriorSewarnaJumlahTampalanDiperlukan:
                                            e.target.value,
                                        },
                                      });
                                    }}
                                    className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none mr-3 drop-shadow-lg'
                                  />
                                  <p className='text-sm font-m '>GK Semula</p>
                                  <span className='text-kaunter4'>
                                    <FaCheck className='text-2xl ml-2' />
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
                                pilihanDataSalah.baruGDPosteriorSewarnaJumlahTampalanDiperlukanCBox &&
                                'grid-rows-2'
                              } grid px-3 pt-1`}
                            >
                              <div
                                className={`${
                                  pilihanDataSalah.baruGDPosteriorSewarnaJumlahTampalanDiperlukanCBox &&
                                  'bg-user9 bg-opacity-20'
                                } flex items-center flex-row `}
                              >
                                <input
                                  disabled={isDisabled}
                                  type='number'
                                  name='gd-baru-posterior-sewarna-jumlah-tampalan-diperlukan'
                                  id='gd-baru-posterior-sewarna-jumlah-tampalan-diperlukan'
                                  value={
                                    baruGDPosteriorSewarnaJumlahTampalanDiperlukan
                                  }
                                  onChange={(e) => {
                                    setBaruGDPosteriorSewarnaJumlahTampalanDiperlukan(
                                      e.target.value
                                    );
                                    setConfirmData({
                                      ...confirmData,
                                      baruGDPosteriorSewarnaJumlahTampalanDiperlukan:
                                        e.target.value,
                                    });
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                  min='0'
                                  max='32'
                                  required
                                />
                                <label
                                  htmlFor='gd-baru-posterior-sewarna-jumlah-tampalan-diperlukan'
                                  className='text-sm font-m ml-2 m-1'
                                >
                                  GD Baru
                                  <span className='text-user6'>*</span>
                                </label>
                                <div className='relative'>
                                  <input
                                    disabled={disableSalah}
                                    type='checkbox'
                                    name='gd-baru-posterior-sewarna-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    id='gd-baru-posterior-sewarna-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    checked={
                                      pilihanDataSalah.baruGDPosteriorSewarnaJumlahTampalanDiperlukanCBox
                                    }
                                    onChange={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        baruGDPosteriorSewarnaJumlahTampalanDiperlukanCBox:
                                          !pilihanDataSalah.baruGDPosteriorSewarnaJumlahTampalanDiperlukanCBox,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        baruGDPosteriorSewarnaJumlahTampalanDiperlukanCBox:
                                          !pilihanDataSalah.baruGDPosteriorSewarnaJumlahTampalanDiperlukanCBox,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          baruGDPosteriorSewarnaJumlahTampalanDiperlukanCBox:
                                            !pilihanDataSalah.baruGDPosteriorSewarnaJumlahTampalanDiperlukanCBox,
                                        },
                                      });
                                    }}
                                    className='peer hidden'
                                  />
                                  <label
                                    htmlFor='gd-baru-posterior-sewarna-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    className={` ${
                                      disableSalah === true
                                        ? 'pointer-events-none'
                                        : 'cursor-pointer '
                                    } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                  >
                                    {pilihanDataSalah.baruGDPosteriorSewarnaJumlahTampalanDiperlukanCBox ===
                                    true ? (
                                      <FaTimes
                                        className='text-2xl'
                                        onClick={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            baruGDPosteriorSewarnaJumlahTampalanDiperlukan:
                                              '',
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            baruGDPosteriorSewarnaJumlahTampalanDiperlukan:
                                              '',
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              baruGDPosteriorSewarnaJumlahTampalanDiperlukan:
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
                              {pilihanDataSalah.baruGDPosteriorSewarnaJumlahTampalanDiperlukanCBox ===
                                true && (
                                <div className='flex flex-row pl-1 items-center bg-user11 bg-opacity-50 mb-1'>
                                  <input
                                    disabled={disableSalah}
                                    min='0'
                                    max='32'
                                    type='number'
                                    name='gd-baru-posterior-sewarna-jumlah-tampalan-diperlukan'
                                    id='gd-baru-posterior-sewarna-jumlah-tampalan-diperlukan'
                                    value={
                                      pilihanDataSalah.baruGDPosteriorSewarnaJumlahTampalanDiperlukan
                                    }
                                    onChange={(e) => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        baruGDPosteriorSewarnaJumlahTampalanDiperlukan:
                                          e.target.value,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        baruGDPosteriorSewarnaJumlahTampalanDiperlukan:
                                          e.target.value,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          baruGDPosteriorSewarnaJumlahTampalanDiperlukan:
                                            e.target.value,
                                        },
                                      });
                                    }}
                                    className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none mr-3 drop-shadow-lg'
                                  />
                                  <p className='text-sm font-m '>GD Baru</p>
                                  <span className='text-kaunter4'>
                                    <FaCheck className='text-2xl ml-2' />
                                  </span>
                                </div>
                              )}
                            </div>
                            <div
                              className={`${
                                pilihanDataSalah.semulaGDPosteriorSewarnaJumlahTampalanDiperlukanCBox &&
                                'grid-rows-2'
                              } grid px-3 pt-1`}
                            >
                              <div
                                className={`${
                                  pilihanDataSalah.semulaGDPosteriorSewarnaJumlahTampalanDiperlukanCBox &&
                                  'bg-user9 bg-opacity-20'
                                } flex items-center flex-row `}
                              >
                                <input
                                  disabled={isDisabled}
                                  type='number'
                                  name='gd-semula-posterior-sewarna-jumlah-tampalan-diperlukan'
                                  id='gd-semula-posterior-sewarna-jumlah-tampalan-diperlukan'
                                  value={
                                    semulaGDPosteriorSewarnaJumlahTampalanDiperlukan
                                  }
                                  onChange={(e) => {
                                    setSemulaGDPosteriorSewarnaJumlahTampalanDiperlukan(
                                      e.target.value
                                    );
                                    setConfirmData({
                                      ...confirmData,
                                      semulaGDPosteriorSewarnaJumlahTampalanDiperlukan:
                                        e.target.value,
                                    });
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                  min='0'
                                  max='32'
                                  required
                                />
                                <label
                                  htmlFor='gd-semula-posterior-sewarna-jumlah-tampalan-diperlukan'
                                  className='text-sm font-m ml-2 m-1'
                                >
                                  GD Semula
                                  <span className='text-user6'>*</span>
                                </label>
                                <div className='relative'>
                                  <input
                                    disabled={disableSalah}
                                    type='checkbox'
                                    name='gd-semula-posterior-sewarna-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    id='gd-semula-posterior-sewarna-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    checked={
                                      pilihanDataSalah.semulaGDPosteriorSewarnaJumlahTampalanDiperlukanCBox
                                    }
                                    onChange={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        semulaGDPosteriorSewarnaJumlahTampalanDiperlukanCBox:
                                          !pilihanDataSalah.semulaGDPosteriorSewarnaJumlahTampalanDiperlukanCBox,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        semulaGDPosteriorSewarnaJumlahTampalanDiperlukanCBox:
                                          !pilihanDataSalah.semulaGDPosteriorSewarnaJumlahTampalanDiperlukanCBox,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          semulaGDPosteriorSewarnaJumlahTampalanDiperlukanCBox:
                                            !pilihanDataSalah.semulaGDPosteriorSewarnaJumlahTampalanDiperlukanCBox,
                                        },
                                      });
                                    }}
                                    className='peer hidden'
                                  />
                                  <label
                                    htmlFor='gd-semula-posterior-sewarna-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    className={` ${
                                      disableSalah === true
                                        ? 'pointer-events-none'
                                        : 'cursor-pointer '
                                    } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                  >
                                    {pilihanDataSalah.semulaGDPosteriorSewarnaJumlahTampalanDiperlukanCBox ===
                                    true ? (
                                      <FaTimes
                                        className='text-2xl'
                                        onClick={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            semulaGDPosteriorSewarnaJumlahTampalanDiperlukan:
                                              '',
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            semulaGDPosteriorSewarnaJumlahTampalanDiperlukan:
                                              '',
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              semulaGDPosteriorSewarnaJumlahTampalanDiperlukan:
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
                              {pilihanDataSalah.semulaGDPosteriorSewarnaJumlahTampalanDiperlukanCBox ===
                                true && (
                                <div className='flex flex-row pl-1 items-center bg-user11 bg-opacity-50 mb-1'>
                                  <input
                                    disabled={disableSalah}
                                    min='0'
                                    max='32'
                                    type='number'
                                    name='gd-semula-posterior-sewarna-jumlah-tampalan-diperlukan'
                                    id='gd-semula-posterior-sewarna-jumlah-tampalan-diperlukan'
                                    value={
                                      pilihanDataSalah.semulaGDPosteriorSewarnaJumlahTampalanDiperlukan
                                    }
                                    onChange={(e) => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        semulaGDPosteriorSewarnaJumlahTampalanDiperlukan:
                                          e.target.value,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        semulaGDPosteriorSewarnaJumlahTampalanDiperlukan:
                                          e.target.value,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          semulaGDPosteriorSewarnaJumlahTampalanDiperlukan:
                                            e.target.value,
                                        },
                                      });
                                    }}
                                    className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none mr-3 drop-shadow-lg'
                                  />
                                  <p className='text-sm font-m '>GD Semula</p>
                                  <span className='text-kaunter4'>
                                    <FaCheck className='text-2xl ml-2' />
                                  </span>
                                </div>
                              )}
                            </div>
                            <div
                              className={`${
                                pilihanDataSalah.baruGKPosteriorSewarnaJumlahTampalanDiperlukanCBox &&
                                'grid-rows-2'
                              } grid px-3 pt-1`}
                            >
                              <div
                                className={`${
                                  pilihanDataSalah.baruGKPosteriorSewarnaJumlahTampalanDiperlukanCBox &&
                                  'bg-user9 bg-opacity-20'
                                } flex items-center flex-row `}
                              >
                                <input
                                  disabled={isDisabled}
                                  type='number'
                                  name='gk-baru-posterior-sewarna-jumlah-tampalan-diperlukan'
                                  id='gk-baru-posterior-sewarna-jumlah-tampalan-diperlukan'
                                  value={
                                    baruGKPosteriorSewarnaJumlahTampalanDiperlukan
                                  }
                                  onChange={(e) => {
                                    setBaruGKPosteriorSewarnaJumlahTampalanDiperlukan(
                                      e.target.value
                                    );
                                    setConfirmData({
                                      ...confirmData,
                                      baruGKPosteriorSewarnaJumlahTampalanDiperlukan:
                                        e.target.value,
                                    });
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                  min='0'
                                  max='32'
                                  required
                                />
                                <label
                                  htmlFor='gk-baru-posterior-sewarna-jumlah-tampalan-diperlukan'
                                  className='text-sm font-m ml-2 m-1'
                                >
                                  GK Baru
                                  <span className='text-user6'>*</span>
                                </label>
                                <div className='relative'>
                                  <input
                                    disabled={disableSalah}
                                    type='checkbox'
                                    name='gk-baru-posterior-sewarna-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    id='gk-baru-posterior-sewarna-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    checked={
                                      pilihanDataSalah.baruGKPosteriorSewarnaJumlahTampalanDiperlukanCBox
                                    }
                                    onChange={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        baruGKPosteriorSewarnaJumlahTampalanDiperlukanCBox:
                                          !pilihanDataSalah.baruGKPosteriorSewarnaJumlahTampalanDiperlukanCBox,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        baruGKPosteriorSewarnaJumlahTampalanDiperlukanCBox:
                                          !pilihanDataSalah.baruGKPosteriorSewarnaJumlahTampalanDiperlukanCBox,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          baruGKPosteriorSewarnaJumlahTampalanDiperlukanCBox:
                                            !pilihanDataSalah.baruGKPosteriorSewarnaJumlahTampalanDiperlukanCBox,
                                        },
                                      });
                                    }}
                                    className='peer hidden'
                                  />
                                  <label
                                    htmlFor='gk-baru-posterior-sewarna-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    className={` ${
                                      disableSalah === true
                                        ? 'pointer-events-none'
                                        : 'cursor-pointer '
                                    } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                  >
                                    {pilihanDataSalah.baruGKPosteriorSewarnaJumlahTampalanDiperlukanCBox ===
                                    true ? (
                                      <FaTimes
                                        className='text-2xl'
                                        onClick={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            baruGKPosteriorSewarnaJumlahTampalanDiperlukan:
                                              '',
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            baruGKPosteriorSewarnaJumlahTampalanDiperlukan:
                                              '',
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              baruGKPosteriorSewarnaJumlahTampalanDiperlukan:
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
                              {pilihanDataSalah.baruGKPosteriorSewarnaJumlahTampalanDiperlukanCBox ===
                                true && (
                                <div className='flex flex-row pl-1 items-center bg-user11 bg-opacity-50 mb-1'>
                                  <input
                                    disabled={disableSalah}
                                    min='0'
                                    max='32'
                                    type='number'
                                    name='gk-baru-posterior-sewarna-jumlah-tampalan-diperlukan'
                                    id='gk-baru-posterior-sewarna-jumlah-tampalan-diperlukan'
                                    value={
                                      pilihanDataSalah.baruGKPosteriorSewarnaJumlahTampalanDiperlukan
                                    }
                                    onChange={(e) => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        baruGKPosteriorSewarnaJumlahTampalanDiperlukan:
                                          e.target.value,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        baruGKPosteriorSewarnaJumlahTampalanDiperlukan:
                                          e.target.value,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          baruGKPosteriorSewarnaJumlahTampalanDiperlukan:
                                            e.target.value,
                                        },
                                      });
                                    }}
                                    className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none mr-3 drop-shadow-lg'
                                  />
                                  <p className='text-sm font-m '>GK Baru</p>
                                  <span className='text-kaunter4'>
                                    <FaCheck className='text-2xl ml-2' />
                                  </span>
                                </div>
                              )}
                            </div>
                            <div
                              className={`${
                                pilihanDataSalah.semulaGKPosteriorSewarnaJumlahTampalanDiperlukanCBox &&
                                'grid-rows-2'
                              } grid px-3 pt-1`}
                            >
                              <div
                                className={`${
                                  pilihanDataSalah.semulaGKPosteriorSewarnaJumlahTampalanDiperlukanCBox &&
                                  'bg-user9 bg-opacity-20'
                                } flex items-center flex-row `}
                              >
                                <input
                                  disabled={isDisabled}
                                  type='number'
                                  name='gk-semula-posterior-sewarna-jumlah-tampalan-diperlukan'
                                  id='gk-semula-posterior-sewarna-jumlah-tampalan-diperlukan'
                                  value={
                                    semulaGKPosteriorSewarnaJumlahTampalanDiperlukan
                                  }
                                  onChange={(e) => {
                                    setSemulaGKPosteriorSewarnaJumlahTampalanDiperlukan(
                                      e.target.value
                                    );
                                    setConfirmData({
                                      ...confirmData,
                                      semulaGKPosteriorSewarnaJumlahTampalanDiperlukan:
                                        e.target.value,
                                    });
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                  min='0'
                                  max='32'
                                  required
                                />
                                <label
                                  htmlFor='gk-semula-posterior-sewarna-jumlah-tampalan-diperlukan'
                                  className='text-sm font-m ml-2 m-1'
                                >
                                  GK Semula
                                  <span className='text-user6'>*</span>
                                </label>
                                <div className='relative'>
                                  <input
                                    disabled={disableSalah}
                                    type='checkbox'
                                    name='gk-semula-posterior-sewarna-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    id='gk-semula-posterior-sewarna-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    checked={
                                      pilihanDataSalah.semulaGKPosteriorSewarnaJumlahTampalanDiperlukanCBox
                                    }
                                    onChange={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        semulaGKPosteriorSewarnaJumlahTampalanDiperlukanCBox:
                                          !pilihanDataSalah.semulaGKPosteriorSewarnaJumlahTampalanDiperlukanCBox,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        semulaGKPosteriorSewarnaJumlahTampalanDiperlukanCBox:
                                          !pilihanDataSalah.semulaGKPosteriorSewarnaJumlahTampalanDiperlukanCBox,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          semulaGKPosteriorSewarnaJumlahTampalanDiperlukanCBox:
                                            !pilihanDataSalah.semulaGKPosteriorSewarnaJumlahTampalanDiperlukanCBox,
                                        },
                                      });
                                    }}
                                    className='peer hidden'
                                  />
                                  <label
                                    htmlFor='gk-semula-posterior-sewarna-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    className={` ${
                                      disableSalah === true
                                        ? 'pointer-events-none'
                                        : 'cursor-pointer '
                                    } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                  >
                                    {pilihanDataSalah.semulaGKPosteriorSewarnaJumlahTampalanDiperlukanCBox ===
                                    true ? (
                                      <FaTimes
                                        className='text-2xl'
                                        onClick={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            semulaGKPosteriorSewarnaJumlahTampalanDiperlukan:
                                              '',
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            semulaGKPosteriorSewarnaJumlahTampalanDiperlukan:
                                              '',
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              semulaGKPosteriorSewarnaJumlahTampalanDiperlukan:
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
                              {pilihanDataSalah.semulaGKPosteriorSewarnaJumlahTampalanDiperlukanCBox ===
                                true && (
                                <div className='flex flex-row pl-1 items-center bg-user11 bg-opacity-50 mb-1'>
                                  <input
                                    disabled={disableSalah}
                                    min='0'
                                    max='32'
                                    type='number'
                                    name='gk-semula-posterior-sewarna-jumlah-tampalan-diperlukan'
                                    id='gk-semula-posterior-sewarna-jumlah-tampalan-diperlukan'
                                    value={
                                      pilihanDataSalah.semulaGKPosteriorSewarnaJumlahTampalanDiperlukan
                                    }
                                    onChange={(e) => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        semulaGKPosteriorSewarnaJumlahTampalanDiperlukan:
                                          e.target.value,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        semulaGKPosteriorSewarnaJumlahTampalanDiperlukan:
                                          e.target.value,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          semulaGKPosteriorSewarnaJumlahTampalanDiperlukan:
                                            e.target.value,
                                        },
                                      });
                                    }}
                                    className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none mr-3 drop-shadow-lg'
                                  />
                                  <p className='text-sm font-m '>GK Semula</p>
                                  <span className='text-kaunter4'>
                                    <FaCheck className='text-2xl ml-2' />
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
                                pilihanDataSalah.baruGDPosteriorAmalgamJumlahTampalanDiperlukanCBox &&
                                'grid-rows-2'
                              } grid px-3 pt-1`}
                            >
                              <div
                                className={`${
                                  pilihanDataSalah.baruGDPosteriorAmalgamJumlahTampalanDiperlukanCBox &&
                                  'bg-user9 bg-opacity-20'
                                } flex items-center flex-row `}
                              >
                                <input
                                  disabled={isDisabled}
                                  type='number'
                                  name='gd-baru-posterior-amalgam-jumlah-tampalan-diperlukan'
                                  id='gd-baru-posterior-amalgam-jumlah-tampalan-diperlukan'
                                  value={
                                    baruGDPosteriorAmalgamJumlahTampalanDiperlukan
                                  }
                                  onChange={(e) => {
                                    setBaruGDPosteriorAmalgamJumlahTampalanDiperlukan(
                                      e.target.value
                                    );
                                    setConfirmData({
                                      ...confirmData,
                                      baruGDPosteriorAmalgamJumlahTampalanDiperlukan:
                                        e.target.value,
                                    });
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                  min='0'
                                  max='32'
                                  required
                                />
                                <label
                                  htmlFor='gd-baru-posterior-amalgam-jumlah-tampalan-diperlukan'
                                  className='text-sm font-m ml-2 m-1'
                                >
                                  GD Baru
                                  <span className='text-user6'>*</span>
                                </label>
                                <div className='relative'>
                                  <input
                                    disabled={disableSalah}
                                    type='checkbox'
                                    name='gd-baru-posterior-amalgam-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    id='gd-baru-posterior-amalgam-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    checked={
                                      pilihanDataSalah.baruGDPosteriorAmalgamJumlahTampalanDiperlukanCBox
                                    }
                                    onChange={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        baruGDPosteriorAmalgamJumlahTampalanDiperlukanCBox:
                                          !pilihanDataSalah.baruGDPosteriorAmalgamJumlahTampalanDiperlukanCBox,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        baruGDPosteriorAmalgamJumlahTampalanDiperlukanCBox:
                                          !pilihanDataSalah.baruGDPosteriorAmalgamJumlahTampalanDiperlukanCBox,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          baruGDPosteriorAmalgamJumlahTampalanDiperlukanCBox:
                                            !pilihanDataSalah.baruGDPosteriorAmalgamJumlahTampalanDiperlukanCBox,
                                        },
                                      });
                                    }}
                                    className='peer hidden'
                                  />
                                  <label
                                    htmlFor='gd-baru-posterior-amalgam-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    className={` ${
                                      disableSalah === true
                                        ? 'pointer-events-none'
                                        : 'cursor-pointer '
                                    } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                  >
                                    {pilihanDataSalah.baruGDPosteriorAmalgamJumlahTampalanDiperlukanCBox ===
                                    true ? (
                                      <FaTimes
                                        className='text-2xl'
                                        onClick={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            baruGDPosteriorAmalgamJumlahTampalanDiperlukan:
                                              '',
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            baruGDPosteriorAmalgamJumlahTampalanDiperlukan:
                                              '',
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              baruGDPosteriorAmalgamJumlahTampalanDiperlukan:
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
                              {pilihanDataSalah.baruGDPosteriorAmalgamJumlahTampalanDiperlukanCBox ===
                                true && (
                                <div className='flex flex-row pl-1 items-center bg-user11 bg-opacity-50 mb-1'>
                                  <input
                                    disabled={disableSalah}
                                    min='0'
                                    max='32'
                                    type='number'
                                    name='gd-baru-posterior-amalgam-jumlah-tampalan-diperlukan'
                                    id='gd-baru-posterior-amalgam-jumlah-tampalan-diperlukan'
                                    value={
                                      pilihanDataSalah.baruGDPosteriorAmalgamJumlahTampalanDiperlukan
                                    }
                                    onChange={(e) => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        baruGDPosteriorAmalgamJumlahTampalanDiperlukan:
                                          e.target.value,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        baruGDPosteriorAmalgamJumlahTampalanDiperlukan:
                                          e.target.value,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          baruGDPosteriorAmalgamJumlahTampalanDiperlukan:
                                            e.target.value,
                                        },
                                      });
                                    }}
                                    className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none mr-3 drop-shadow-lg'
                                  />
                                  <p className='text-sm font-m '>GD Baru</p>
                                  <span className='text-kaunter4'>
                                    <FaCheck className='text-2xl ml-2' />
                                  </span>
                                </div>
                              )}
                            </div>
                            <div
                              className={`${
                                pilihanDataSalah.semulaGDPosteriorAmalgamJumlahTampalanDiperlukanCBox &&
                                'grid-rows-2'
                              } grid px-3 pt-1`}
                            >
                              <div
                                className={`${
                                  pilihanDataSalah.semulaGDPosteriorAmalgamJumlahTampalanDiperlukanCBox &&
                                  'bg-user9 bg-opacity-20'
                                } flex items-center flex-row `}
                              >
                                <input
                                  disabled={isDisabled}
                                  type='number'
                                  name='gd-semula-posterior-amalgam-jumlah-tampalan-diperlukan'
                                  id='gd-semula-posterior-amalgam-jumlah-tampalan-diperlukan'
                                  value={
                                    semulaGDPosteriorAmalgamJumlahTampalanDiperlukan
                                  }
                                  onChange={(e) => {
                                    setSemulaGDPosteriorAmalgamJumlahTampalanDiperlukan(
                                      e.target.value
                                    );
                                    setConfirmData({
                                      ...confirmData,
                                      semulaGDPosteriorAmalgamJumlahTampalanDiperlukan:
                                        e.target.value,
                                    });
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                  min='0'
                                  max='32'
                                  required
                                />
                                <label
                                  htmlFor='gd-semula-posterior-amalgam-jumlah-tampalan-diperlukan'
                                  className='text-sm font-m ml-2 m-1'
                                >
                                  GD Semula
                                  <span className='text-user6'>*</span>
                                </label>
                                <div className='relative'>
                                  <input
                                    disabled={disableSalah}
                                    type='checkbox'
                                    name='gd-semula-posterior-amalgam-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    id='gd-semula-posterior-amalgam-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    checked={
                                      pilihanDataSalah.semulaGDPosteriorAmalgamJumlahTampalanDiperlukanCBox
                                    }
                                    onChange={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        semulaGDPosteriorAmalgamJumlahTampalanDiperlukanCBox:
                                          !pilihanDataSalah.semulaGDPosteriorAmalgamJumlahTampalanDiperlukanCBox,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        semulaGDPosteriorAmalgamJumlahTampalanDiperlukanCBox:
                                          !pilihanDataSalah.semulaGDPosteriorAmalgamJumlahTampalanDiperlukanCBox,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          semulaGDPosteriorAmalgamJumlahTampalanDiperlukanCBox:
                                            !pilihanDataSalah.semulaGDPosteriorAmalgamJumlahTampalanDiperlukanCBox,
                                        },
                                      });
                                    }}
                                    className='peer hidden'
                                  />
                                  <label
                                    htmlFor='gd-semula-posterior-amalgam-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    className={` ${
                                      disableSalah === true
                                        ? 'pointer-events-none'
                                        : 'cursor-pointer '
                                    } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                  >
                                    {pilihanDataSalah.semulaGDPosteriorAmalgamJumlahTampalanDiperlukanCBox ===
                                    true ? (
                                      <FaTimes
                                        className='text-2xl'
                                        onClick={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            semulaGDPosteriorAmalgamJumlahTampalanDiperlukan:
                                              '',
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            semulaGDPosteriorAmalgamJumlahTampalanDiperlukan:
                                              '',
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              semulaGDPosteriorAmalgamJumlahTampalanDiperlukan:
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
                              {pilihanDataSalah.semulaGDPosteriorAmalgamJumlahTampalanDiperlukanCBox ===
                                true && (
                                <div className='flex flex-row pl-1 items-center bg-user11 bg-opacity-50 mb-1'>
                                  <input
                                    disabled={disableSalah}
                                    min='0'
                                    max='32'
                                    type='number'
                                    name='gd-semula-posterior-amalgam-jumlah-tampalan-diperlukan'
                                    id='gd-semula-posterior-amalgam-jumlah-tampalan-diperlukan'
                                    value={
                                      pilihanDataSalah.semulaGDPosteriorAmalgamJumlahTampalanDiperlukan
                                    }
                                    onChange={(e) => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        semulaGDPosteriorAmalgamJumlahTampalanDiperlukan:
                                          e.target.value,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        semulaGDPosteriorAmalgamJumlahTampalanDiperlukan:
                                          e.target.value,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          semulaGDPosteriorAmalgamJumlahTampalanDiperlukan:
                                            e.target.value,
                                        },
                                      });
                                    }}
                                    className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none mr-3 drop-shadow-lg'
                                  />
                                  <p className='text-sm font-m '>GD Semula</p>
                                  <span className='text-kaunter4'>
                                    <FaCheck className='text-2xl ml-2' />
                                  </span>
                                </div>
                              )}
                            </div>
                            <div
                              className={`${
                                pilihanDataSalah.baruGKPosteriorAmalgamJumlahTampalanDiperlukanCBox &&
                                'grid-rows-2'
                              } grid px-3 pt-1`}
                            >
                              <div
                                className={`${
                                  pilihanDataSalah.baruGKPosteriorAmalgamJumlahTampalanDiperlukanCBox &&
                                  'bg-user9 bg-opacity-20'
                                } flex items-center flex-row `}
                              >
                                <input
                                  disabled={isDisabled}
                                  type='number'
                                  name='gk-baru-posterior-amalgam-jumlah-tampalan-diperlukan'
                                  id='gk-baru-posterior-amalgam-jumlah-tampalan-diperlukan'
                                  value={
                                    baruGKPosteriorAmalgamJumlahTampalanDiperlukan
                                  }
                                  onChange={(e) => {
                                    setBaruGKPosteriorAmalgamJumlahTampalanDiperlukan(
                                      e.target.value
                                    );
                                    setConfirmData({
                                      ...confirmData,
                                      baruGKPosteriorAmalgamJumlahTampalanDiperlukan:
                                        e.target.value,
                                    });
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                  min='0'
                                  max='32'
                                  required
                                />
                                <label
                                  htmlFor='gk-baru-posterior-amalgam-jumlah-tampalan-diperlukan'
                                  className='text-sm font-m ml-2 m-1'
                                >
                                  GK Baru
                                  <span className='text-user6'>*</span>
                                </label>
                                <div className='relative'>
                                  <input
                                    disabled={disableSalah}
                                    type='checkbox'
                                    name='gk-baru-posterior-amalgam-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    id='gk-baru-posterior-amalgam-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    checked={
                                      pilihanDataSalah.baruGKPosteriorAmalgamJumlahTampalanDiperlukanCBox
                                    }
                                    onChange={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        baruGKPosteriorAmalgamJumlahTampalanDiperlukanCBox:
                                          !pilihanDataSalah.baruGKPosteriorAmalgamJumlahTampalanDiperlukanCBox,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        baruGKPosteriorAmalgamJumlahTampalanDiperlukanCBox:
                                          !pilihanDataSalah.baruGKPosteriorAmalgamJumlahTampalanDiperlukanCBox,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          baruGKPosteriorAmalgamJumlahTampalanDiperlukanCBox:
                                            !pilihanDataSalah.baruGKPosteriorAmalgamJumlahTampalanDiperlukanCBox,
                                        },
                                      });
                                    }}
                                    className='peer hidden'
                                  />
                                  <label
                                    htmlFor='gk-baru-posterior-amalgam-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    className={` ${
                                      disableSalah === true
                                        ? 'pointer-events-none'
                                        : 'cursor-pointer '
                                    } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                  >
                                    {pilihanDataSalah.baruGKPosteriorAmalgamJumlahTampalanDiperlukanCBox ===
                                    true ? (
                                      <FaTimes
                                        className='text-2xl'
                                        onClick={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            baruGKPosteriorAmalgamJumlahTampalanDiperlukan:
                                              '',
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            baruGKPosteriorAmalgamJumlahTampalanDiperlukan:
                                              '',
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              baruGKPosteriorAmalgamJumlahTampalanDiperlukan:
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
                              {pilihanDataSalah.baruGKPosteriorAmalgamJumlahTampalanDiperlukanCBox ===
                                true && (
                                <div className='flex flex-row pl-1 items-center bg-user11 bg-opacity-50 mb-1'>
                                  <input
                                    disabled={disableSalah}
                                    min='0'
                                    max='32'
                                    type='number'
                                    name='gk-baru-posterior-amalgam-jumlah-tampalan-diperlukan'
                                    id='gk-baru-posterior-amalgam-jumlah-tampalan-diperlukan'
                                    value={
                                      pilihanDataSalah.baruGKPosteriorAmalgamJumlahTampalanDiperlukan
                                    }
                                    onChange={(e) => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        baruGKPosteriorAmalgamJumlahTampalanDiperlukan:
                                          e.target.value,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        baruGKPosteriorAmalgamJumlahTampalanDiperlukan:
                                          e.target.value,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          baruGKPosteriorAmalgamJumlahTampalanDiperlukan:
                                            e.target.value,
                                        },
                                      });
                                    }}
                                    className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none mr-3 drop-shadow-lg'
                                  />
                                  <p className='text-sm font-m '>GK Baru</p>
                                  <span className='text-kaunter4'>
                                    <FaCheck className='text-2xl ml-2' />
                                  </span>
                                </div>
                              )}
                            </div>
                            <div
                              className={`${
                                pilihanDataSalah.semulaGKPosteriorAmalgamJumlahTampalanDiperlukanCBox &&
                                'grid-rows-2'
                              } grid px-3 pt-1`}
                            >
                              <div
                                className={`${
                                  pilihanDataSalah.semulaGKPosteriorAmalgamJumlahTampalanDiperlukanCBox &&
                                  'bg-user9 bg-opacity-20'
                                } flex items-center flex-row `}
                              >
                                <input
                                  disabled={isDisabled}
                                  type='number'
                                  name='gk-semula-posterior-amalgam-jumlah-tampalan-diperlukan'
                                  id='gk-semula-posterior-amalgam-jumlah-tampalan-diperlukan'
                                  value={
                                    semulaGKPosteriorAmalgamJumlahTampalanDiperlukan
                                  }
                                  onChange={(e) => {
                                    setSemulaGKPosteriorAmalgamJumlahTampalanDiperlukan(
                                      e.target.value
                                    );
                                    setConfirmData({
                                      ...confirmData,
                                      semulaGKPosteriorAmalgamJumlahTampalanDiperlukan:
                                        e.target.value,
                                    });
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                  min='0'
                                  max='32'
                                  required
                                />
                                <label
                                  htmlFor='gk-semula-posterior-amalgam-jumlah-tampalan-diperlukan'
                                  className='text-sm font-m ml-2 m-1'
                                >
                                  GK Semula
                                  <span className='text-user6'>*</span>
                                </label>
                                <div className='relative'>
                                  <input
                                    disabled={disableSalah}
                                    type='checkbox'
                                    name='gk-semula-posterior-amalgam-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    id='gk-semula-posterior-amalgam-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    checked={
                                      pilihanDataSalah.semulaGKPosteriorAmalgamJumlahTampalanDiperlukanCBox
                                    }
                                    onChange={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        semulaGKPosteriorAmalgamJumlahTampalanDiperlukanCBox:
                                          !pilihanDataSalah.semulaGKPosteriorAmalgamJumlahTampalanDiperlukanCBox,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        semulaGKPosteriorAmalgamJumlahTampalanDiperlukanCBox:
                                          !pilihanDataSalah.semulaGKPosteriorAmalgamJumlahTampalanDiperlukanCBox,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          semulaGKPosteriorAmalgamJumlahTampalanDiperlukanCBox:
                                            !pilihanDataSalah.semulaGKPosteriorAmalgamJumlahTampalanDiperlukanCBox,
                                        },
                                      });
                                    }}
                                    className='peer hidden'
                                  />
                                  <label
                                    htmlFor='gk-semula-posterior-amalgam-jumlah-tampalan-diperlukan-reten-salah-cbox'
                                    className={` ${
                                      disableSalah === true
                                        ? 'pointer-events-none'
                                        : 'cursor-pointer '
                                    } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                                  >
                                    {pilihanDataSalah.semulaGKPosteriorAmalgamJumlahTampalanDiperlukanCBox ===
                                    true ? (
                                      <FaTimes
                                        className='text-2xl'
                                        onClick={() => {
                                          setPilihanDataSalah({
                                            ...pilihanDataSalah,
                                            semulaGKPosteriorAmalgamJumlahTampalanDiperlukan:
                                              '',
                                          });
                                          setDataRetenSalah({
                                            ...dataRetenSalah,
                                            semulaGKPosteriorAmalgamJumlahTampalanDiperlukan:
                                              '',
                                          });
                                          setConfirmData({
                                            ...confirmData,
                                            pilihanDataSalah: {
                                              ...pilihanDataSalah,
                                              semulaGKPosteriorAmalgamJumlahTampalanDiperlukan:
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
                              {pilihanDataSalah.semulaGKPosteriorAmalgamJumlahTampalanDiperlukanCBox ===
                                true && (
                                <div className='flex flex-row pl-1 items-center bg-user11 bg-opacity-50 mb-1'>
                                  <input
                                    disabled={disableSalah}
                                    min='0'
                                    max='32'
                                    type='number'
                                    name='gk-semula-posterior-amalgam-jumlah-tampalan-diperlukan'
                                    id='gk-semula-posterior-amalgam-jumlah-tampalan-diperlukan'
                                    value={
                                      pilihanDataSalah.semulaGKPosteriorAmalgamJumlahTampalanDiperlukan
                                    }
                                    onChange={(e) => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        semulaGKPosteriorAmalgamJumlahTampalanDiperlukan:
                                          e.target.value,
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        semulaGKPosteriorAmalgamJumlahTampalanDiperlukan:
                                          e.target.value,
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          semulaGKPosteriorAmalgamJumlahTampalanDiperlukan:
                                            e.target.value,
                                        },
                                      });
                                    }}
                                    className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none mr-3 drop-shadow-lg'
                                  />
                                  <p className='text-sm font-m '>GK Semula</p>
                                  <span className='text-kaunter4'>
                                    <FaCheck className='text-2xl ml-2' />
                                  </span>
                                </div>
                              )}
                            </div>
                          </article>
                        </div>
                      </article>
                    </div>
                  </section>
                )}
                {tidakHadirPemeriksaan === 'ya-kehadiran-pemeriksaan' ||
                engganPemeriksaan === 'ya-enggan-pemeriksaan' ? null : (
                  <span className='flex bg-user3 p-2 w-full capitalize col-span-1 md:col-span-2'>
                    <p className='ml-3 text-xl font-semibold'>Lain-Lain</p>
                  </span>
                )}
                {tidakHadirPemeriksaan === 'ya-kehadiran-pemeriksaan' ||
                engganPemeriksaan === 'ya-enggan-pemeriksaan' ? null : (
                  <section className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 mb-3 w-full col-span-1 sm:col-span-2'>
                    <article className='grid grid-cols-1 gap-2 border border-userBlack pl-5 p-2 rounded-md auto-rows-min'>
                      <h4 className='font-bold flex flex-row'>
                        Program Kesihatan Oral Tanpa Amalan Merokok (KOTAK)
                        <span className='text-user6'>*</span>
                      </h4>
                      <div className='col-span-2 grid grid-cols-[3fr_2fr]'>
                        <p className='flex items-center text-sm normal-case'>
                          Melaksanakan saringan merokok melalui Program KOTAK
                          <span className='text-user6'>*</span>
                        </p>
                        <div className='flex flex-col'>
                          <div
                            className={`${
                              pilihanDataSalah.melaksanakanSaringanMerokokCBox &&
                              'bg-user9 bg-opacity-20 justify-center p-2'
                            } flex flex-row items-center relative`}
                          >
                            <input
                              disabled={isDisabled}
                              required
                              type='radio'
                              name='melaksanakan-saringan-merokok'
                              id='ya-melaksanakan-saringan-merokok'
                              value='ya-melaksanakan-saringan-merokok'
                              checked={
                                melaksanakanSaringanMerokok ===
                                'ya-melaksanakan-saringan-merokok'
                                  ? true
                                  : false
                              }
                              onChange={(e) => {
                                setMelaksanakanSaringanMerokok(e.target.value);
                                setConfirmData({
                                  ...confirmData,
                                  melaksanakanSaringanMerokok: e.target.value,
                                });
                              }}
                              className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                            />
                            <label
                              htmlFor='ya-melaksanakan-saringan-merokok'
                              className='mx-2 text-sm font-m'
                            >
                              Ya
                            </label>
                            <input
                              disabled={isDisabled}
                              required
                              type='radio'
                              name='melaksanakan-saringan-merokok'
                              id='tidak-melaksanakan-saringan-merokok'
                              value='tidak-melaksanakan-saringan-merokok'
                              checked={
                                melaksanakanSaringanMerokok ===
                                'tidak-melaksanakan-saringan-merokok'
                                  ? true
                                  : false
                              }
                              onChange={(e) => {
                                setMelaksanakanSaringanMerokok(e.target.value);
                                setConfirmData({
                                  ...confirmData,
                                  melaksanakanSaringanMerokok: e.target.value,
                                });
                              }}
                              className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                            />
                            <label
                              htmlFor='tidak-melaksanakan-saringan-merokok'
                              className='mx-2 text-sm font-m'
                            >
                              Tidak
                            </label>
                            <div className='relative'>
                              <input
                                disabled={disableSalah}
                                type='checkbox'
                                name='melaksanakan-saringan-merokok-reten-salah-cbox'
                                id='melaksanakan-saringan-merokok-reten-salah-cbox'
                                checked={
                                  pilihanDataSalah.melaksanakanSaringanMerokokCBox
                                }
                                onChange={() => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    melaksanakanSaringanMerokokCBox:
                                      !pilihanDataSalah.melaksanakanSaringanMerokokCBox,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    melaksanakanSaringanMerokokCBox:
                                      !pilihanDataSalah.melaksanakanSaringanMerokokCBox,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      melaksanakanSaringanMerokokCBox:
                                        !pilihanDataSalah.melaksanakanSaringanMerokokCBox,
                                    },
                                  });
                                }}
                                className='peer hidden'
                              />
                              <label
                                htmlFor='melaksanakan-saringan-merokok-reten-salah-cbox'
                                className={` ${
                                  disableSalah === true
                                    ? 'pointer-events-none'
                                    : 'cursor-pointer '
                                } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                              >
                                {pilihanDataSalah.melaksanakanSaringanMerokokCBox ===
                                true ? (
                                  <FaTimes
                                    className='text-2xl'
                                    onClick={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        melaksanakanSaringanMerokok: '',
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        melaksanakanSaringanMerokok: '',
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          melaksanakanSaringanMerokok: '',
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
                          {pilihanDataSalah.melaksanakanSaringanMerokokCBox ===
                            true && (
                            <div className='flex items-center justify-center bg-user11 bg-opacity-50 mb-1 p-2'>
                              <input
                                disabled={
                                  melaksanakanSaringanMerokok ===
                                  'ya-melaksanakan-saringan-merokok'
                                    ? true
                                    : disableSalah === true
                                    ? true
                                    : false
                                }
                                required
                                type='radio'
                                name='melaksanakan-saringan-merokok-reten-salah'
                                id='ya-melaksanakan-saringan-merokok-reten-salah'
                                value='ya-melaksanakan-saringan-merokok-reten-salah'
                                checked={
                                  pilihanDataSalah.melaksanakanSaringanMerokok ===
                                  'ya-melaksanakan-saringan-merokok-reten-salah'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    melaksanakanSaringanMerokok: e.target.value,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    melaksanakanSaringanMerokok: e.target.value,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      melaksanakanSaringanMerokok:
                                        e.target.value,
                                    },
                                  });
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='ya-melaksanakan-saringan-merokok-reten-salah'
                                className='mx-2 text-sm font-m'
                              >
                                Ya
                              </label>
                              <input
                                disabled={
                                  melaksanakanSaringanMerokok ===
                                  'tidak-melaksanakan-saringan-merokok'
                                    ? true
                                    : disableSalah === true
                                    ? true
                                    : false
                                }
                                required
                                type='radio'
                                name='melaksanakan-saringan-merokok-reten-salah'
                                id='tidak-melaksanakan-saringan-merokok-reten-salah'
                                value='tidak-melaksanakan-saringan-merokok-reten-salah'
                                checked={
                                  pilihanDataSalah.melaksanakanSaringanMerokok ===
                                  'tidak-melaksanakan-saringan-merokok-reten-salah'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    melaksanakanSaringanMerokok: e.target.value,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    melaksanakanSaringanMerokok: e.target.value,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      melaksanakanSaringanMerokok:
                                        e.target.value,
                                    },
                                  });
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='tidak-melaksanakan-saringan-merokok-reten-salah'
                                className='mx-2 text-sm font-m'
                              >
                                Tidak
                              </label>
                              <input
                                disabled={
                                  melaksanakanSaringanMerokok === ''
                                    ? true
                                    : disableSalah === true
                                    ? true
                                    : false
                                }
                                required
                                type='radio'
                                name='melaksanakan-saringan-merokok-reten-salah'
                                id='tiada-melaksanakan-saringan-merokok-reten-salah'
                                value='tiada-melaksanakan-saringan-merokok-reten-salah'
                                checked={
                                  pilihanDataSalah.melaksanakanSaringanMerokok ===
                                  'tiada-melaksanakan-saringan-merokok-reten-salah'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    melaksanakanSaringanMerokok: e.target.value,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    melaksanakanSaringanMerokok: e.target.value,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      melaksanakanSaringanMerokok:
                                        e.target.value,
                                    },
                                  });
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='tiada-melaksanakan-saringan-merokok-reten-salah'
                                className='mx-2 text-sm font-m'
                              >
                                Tiada
                              </label>
                              <span
                                className={` ${
                                  disableSalah === true
                                    ? 'pointer-events-none'
                                    : 'cursor-pointer '
                                } text-kaunter4`}
                                onClick={() => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    melaksanakanSaringanMerokok: '',
                                    melaksanakanSaringanMerokokCBox: false,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    melaksanakanSaringanMerokok: '',
                                    melaksanakanSaringanMerokokCBox: false,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      melaksanakanSaringanMerokok: '',
                                      melaksanakanSaringanMerokokCBox: false,
                                    },
                                  });
                                }}
                              >
                                <FaCheck className='text-xl' />
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className='text-sm grid grid-cols-[3fr_2fr] '>
                        <label
                          htmlFor='statusM'
                          className='flex items-center text-sm normal-case'
                        >
                          Status Merokok
                          <span className='text-user6'>*</span>
                        </label>
                        <div
                          className={`${
                            pilihanDataSalah.statusMCBox && 'grid-rows-2'
                          } grid pt-1`}
                        >
                          <div
                            className={`${
                              pilihanDataSalah.statusMCBox &&
                              'bg-user9 bg-opacity-20'
                            } flex items-center flex-row pl-2`}
                          >
                            <select
                              disabled={isDisabled}
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
                              className='appearance-none w-36 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            >
                              <option value=''></option>
                              <option value='perokok-semasa'>
                                Perokok Semasa
                              </option>
                              <option value='bekas-perokok'>
                                Bekas Perokok
                              </option>
                              <option value='perokok-pasif'>
                                Perokok Pasif
                              </option>
                              <option value='bukan-perokok'>
                                Bukan Perokok
                              </option>
                              <option value='dalam-intervensi'>
                                Dalam Intervensi
                              </option>
                            </select>
                            <div className='relative'>
                              <input
                                disabled={disableSalah}
                                type='checkbox'
                                name='statusM-reten-salah-cbox'
                                id='statusM-reten-salah-cbox'
                                checked={pilihanDataSalah.statusMCBox}
                                onChange={() => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    statusMCBox: !pilihanDataSalah.statusMCBox,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    statusMCBox: !pilihanDataSalah.statusMCBox,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      statusMCBox:
                                        !pilihanDataSalah.statusMCBox,
                                    },
                                  });
                                }}
                                className='peer hidden'
                              />
                              <label
                                htmlFor='statusM-reten-salah-cbox'
                                className={` ${
                                  disableSalah === true
                                    ? 'pointer-events-none'
                                    : 'cursor-pointer '
                                } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                              >
                                {pilihanDataSalah.statusMCBox === true ? (
                                  <FaTimes
                                    className='text-2xl'
                                    onClick={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        statusM: '',
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        statusM: '',
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          statusM: '',
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
                          {pilihanDataSalah.statusMCBox === true && (
                            <div className='flex items-center flex-row pl-2 bg-user11 bg-opacity-50 mb-1'>
                              <select
                                name='statusM'
                                id='statusM'
                                value={pilihanDataSalah.statusM}
                                onChange={(e) => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    statusM: e.target.value,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    statusM: e.target.value,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      statusM: e.target.value,
                                    },
                                  });
                                }}
                                className='appearance-none w-36 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              >
                                {statusM === 'perokok-semasa' ? (
                                  <>
                                    <option value=''></option>
                                    <option value='bekas-perokok'>
                                      Bekas Perokok
                                    </option>
                                    <option value='perokok-pasif'>
                                      Perokok Pasif
                                    </option>
                                    <option value='bukan-perokok'>
                                      Bukan Perokok
                                    </option>
                                    <option value='dalam-intervensi'>
                                      Dalam Intervensi
                                    </option>
                                  </>
                                ) : statusM === 'bekas-perokok' ? (
                                  <>
                                    <option value=''></option>
                                    <option value='perokok-semasa'>
                                      Perokok Semasa
                                    </option>
                                    <option value='perokok-pasif'>
                                      Perokok Pasif
                                    </option>
                                    <option value='bukan-perokok'>
                                      Bukan Perokok
                                    </option>
                                    <option value='dalam-intervensi'>
                                      Dalam Intervensi
                                    </option>
                                  </>
                                ) : statusM === 'perokok-pasif' ? (
                                  <>
                                    <option value=''></option>
                                    <option value='perokok-semasa'>
                                      Perokok Semasa
                                    </option>
                                    <option value='bekas-perokok'>
                                      Bekas Perokok
                                    </option>
                                    <option value='bukan-perokok'>
                                      Bukan Perokok
                                    </option>
                                    <option value='dalam-intervensi'>
                                      Dalam Intervensi
                                    </option>
                                  </>
                                ) : statusM === 'bukan-perokok' ? (
                                  <>
                                    <option value=''></option>
                                    <option value='perokok-semasa'>
                                      Perokok Semasa
                                    </option>
                                    <option value='bekas-perokok'>
                                      Bekas Perokok
                                    </option>
                                    <option value='perokok-pasif'>
                                      Perokok Pasif
                                    </option>
                                    <option value='dalam-intervensi'>
                                      Dalam Intervensi
                                    </option>
                                  </>
                                ) : statusM === 'dalam-intervensi' ? (
                                  <>
                                    <option value=''></option>
                                    <option value='perokok-semasa'>
                                      Perokok Semasa
                                    </option>
                                    <option value='bekas-perokok'>
                                      Bekas Perokok
                                    </option>
                                    <option value='perokok-pasif'>
                                      Perokok Pasif
                                    </option>
                                    <option value='bukan-perokok'>
                                      Bukan Perokok
                                    </option>
                                  </>
                                ) : (
                                  <>
                                    <option value='perokok-semasa'>
                                      Perokok Semasa
                                    </option>
                                    <option value='bekas-perokok'>
                                      Bekas Perokok
                                    </option>
                                    <option value='perokok-pasif'>
                                      Perokok Pasif
                                    </option>
                                    <option value='bukan-perokok'>
                                      Bukan Perokok
                                    </option>
                                    <option value='dalam-intervensi'>
                                      Dalam Intervensi
                                    </option>
                                  </>
                                )}
                              </select>
                              <span className='text-kaunter4'>
                                <FaCheck className='text-2xl' />
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className='col-span-2 grid grid-cols-[3fr_2fr]'>
                        <p className='flex items-center text-sm normal-case'>
                          Pesakit menerima nasihat ringkas?
                          <span className='text-user6'>*</span>
                        </p>
                        <div className='flex flex-col'>
                          <div
                            className={`${
                              pilihanDataSalah.menerimaNasihatRingkasCBox &&
                              'bg-user9 bg-opacity-20 justify-center p-2'
                            } flex flex-row items-center relative`}
                          >
                            <input
                              disabled={isDisabled}
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
                              className='mx-2 text-sm font-m'
                            >
                              Ya
                            </label>
                            <input
                              disabled={isDisabled}
                              required
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
                              className='mx-2 text-sm font-m'
                            >
                              Tidak
                            </label>
                            <div className='relative'>
                              <input
                                disabled={disableSalah}
                                type='checkbox'
                                name='menerima-nasihat-ringkas-reten-salah-cbox'
                                id='menerima-nasihat-ringkas-reten-salah-cbox'
                                checked={
                                  pilihanDataSalah.menerimaNasihatRingkasCBox
                                }
                                onChange={() => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    menerimaNasihatRingkasCBox:
                                      !pilihanDataSalah.menerimaNasihatRingkasCBox,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    menerimaNasihatRingkasCBox:
                                      !pilihanDataSalah.menerimaNasihatRingkasCBox,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      menerimaNasihatRingkasCBox:
                                        !pilihanDataSalah.menerimaNasihatRingkasCBox,
                                    },
                                  });
                                }}
                                className='peer hidden'
                              />
                              <label
                                htmlFor='menerima-nasihat-ringkas-reten-salah-cbox'
                                className={` ${
                                  disableSalah === true
                                    ? 'pointer-events-none'
                                    : 'cursor-pointer '
                                } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                              >
                                {pilihanDataSalah.menerimaNasihatRingkasCBox ===
                                true ? (
                                  <FaTimes
                                    className='text-2xl'
                                    onClick={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        menerimaNasihatRingkas: '',
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        menerimaNasihatRingkas: '',
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          menerimaNasihatRingkas: '',
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
                          {pilihanDataSalah.menerimaNasihatRingkasCBox ===
                            true && (
                            <div className='flex items-center justify-center bg-user11 bg-opacity-50 mb-1 p-2'>
                              <input
                                disabled={
                                  menerimaNasihatRingkas ===
                                  'ya-menerima-nasihat-ringkas'
                                    ? true
                                    : disableSalah === true
                                    ? true
                                    : false
                                }
                                required
                                type='radio'
                                name='menerima-nasihat-ringkas-reten-salah'
                                id='ya-menerima-nasihat-ringkas-reten-salah'
                                value='ya-menerima-nasihat-ringkas-reten-salah'
                                checked={
                                  pilihanDataSalah.menerimaNasihatRingkas ===
                                  'ya-menerima-nasihat-ringkas-reten-salah'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    menerimaNasihatRingkas: e.target.value,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    menerimaNasihatRingkas: e.target.value,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      menerimaNasihatRingkas: e.target.value,
                                    },
                                  });
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='ya-menerima-nasihat-ringkas-reten-salah'
                                className='mx-2 text-sm font-m'
                              >
                                Ya
                              </label>
                              <input
                                disabled={
                                  menerimaNasihatRingkas ===
                                  'tidak-menerima-nasihat-ringkas'
                                    ? true
                                    : disableSalah === true
                                    ? true
                                    : false
                                }
                                required
                                type='radio'
                                name='menerima-nasihat-ringkas-reten-salah'
                                id='tidak-menerima-nasihat-ringkas-reten-salah'
                                value='tidak-menerima-nasihat-ringkas-reten-salah'
                                checked={
                                  pilihanDataSalah.menerimaNasihatRingkas ===
                                  'tidak-menerima-nasihat-ringkas-reten-salah'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    menerimaNasihatRingkas: e.target.value,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    menerimaNasihatRingkas: e.target.value,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      menerimaNasihatRingkas: e.target.value,
                                    },
                                  });
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='tidak-menerima-nasihat-ringkas-reten-salah'
                                className='mx-2 text-sm font-m'
                              >
                                Tidak
                              </label>
                              <input
                                disabled={
                                  menerimaNasihatRingkas === ''
                                    ? true
                                    : disableSalah === true
                                    ? true
                                    : false
                                }
                                required
                                type='radio'
                                name='menerima-nasihat-ringkas-reten-salah'
                                id='tiada-menerima-nasihat-ringkas-reten-salah'
                                value='tiada-menerima-nasihat-ringkas-reten-salah'
                                checked={
                                  pilihanDataSalah.menerimaNasihatRingkas ===
                                  'tiada-menerima-nasihat-ringkas-reten-salah'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    menerimaNasihatRingkas: e.target.value,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    menerimaNasihatRingkas: e.target.value,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      menerimaNasihatRingkas: e.target.value,
                                    },
                                  });
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='tiada-menerima-nasihat-ringkas-reten-salah'
                                className='mx-2 text-sm font-m'
                              >
                                tiada
                              </label>
                              <span
                                className={` ${
                                  disableSalah === true
                                    ? 'pointer-events-none'
                                    : 'cursor-pointer '
                                } text-kaunter4`}
                                onClick={() => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    menerimaNasihatRingkas: '',
                                    menerimaNasihatRingkasCBox: false,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    menerimaNasihatRingkas: '',
                                    menerimaNasihatRingkasCBox: false,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      menerimaNasihatRingkas: '',
                                      menerimaNasihatRingkasCBox: false,
                                    },
                                  });
                                }}
                              >
                                <FaCheck className='text-xl' />
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className='col-span-2 grid grid-cols-[3fr_2fr]'>
                        <p className='flex items-center text-sm normal-case'>
                          Murid BERSETUJU untuk dirujuk menjalani intervensi?
                          <span className='text-user6'>*</span>
                        </p>
                        <div className='flex flex-col'>
                          <div
                            className={`${
                              pilihanDataSalah.bersediaDirujukCBox &&
                              'bg-user9 bg-opacity-20 justify-center p-2'
                            } flex flex-row items-center relative`}
                          >
                            <input
                              disabled={isDisabled}
                              required
                              type='radio'
                              name='bersedia-dirujuk'
                              id='ya-bersedia-dirujuk'
                              value='ya-bersedia-dirujuk'
                              checked={
                                bersediaDirujuk === 'ya-bersedia-dirujuk'
                                  ? true
                                  : false
                              }
                              onChange={(e) => {
                                setBersediaDirujuk(e.target.value);
                                setConfirmData({
                                  ...confirmData,
                                  bersediaDirujuk: e.target.value,
                                });
                              }}
                              className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                            />
                            <label
                              htmlFor='ya-bersedia-dirujuk'
                              className='mx-2 text-sm font-m'
                            >
                              Ya
                            </label>
                            <input
                              disabled={isDisabled}
                              required
                              type='radio'
                              name='bersedia-dirujuk'
                              id='tidak-bersedia-dirujuk'
                              value='tidak-bersedia-dirujuk'
                              checked={
                                bersediaDirujuk === 'tidak-bersedia-dirujuk'
                                  ? true
                                  : false
                              }
                              onChange={(e) => {
                                setBersediaDirujuk(e.target.value);
                                setConfirmData({
                                  ...confirmData,
                                  bersediaDirujuk: e.target.value,
                                });
                              }}
                              className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                            />
                            <label
                              htmlFor='tidak-menerima-nasihat-ringkas'
                              className='mx-2 text-sm font-m'
                            >
                              Tidak
                            </label>
                            <div className='relative'>
                              <input
                                disabled={disableSalah}
                                type='checkbox'
                                name='bersedia-dirujuk-reten-salah-cbox'
                                id='bersedia-dirujuk-reten-salah-cbox'
                                checked={pilihanDataSalah.bersediaDirujukCBox}
                                onChange={() => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    bersediaDirujukCBox:
                                      !pilihanDataSalah.bersediaDirujukCBox,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    bersediaDirujukCBox:
                                      !pilihanDataSalah.bersediaDirujukCBox,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      bersediaDirujukCBox:
                                        !pilihanDataSalah.bersediaDirujukCBox,
                                    },
                                  });
                                }}
                                className='peer hidden'
                              />
                              <label
                                htmlFor='bersedia-dirujuk-reten-salah-cbox'
                                className={` ${
                                  disableSalah === true
                                    ? 'pointer-events-none'
                                    : 'cursor-pointer '
                                } text-user9 h-6 w-6 rounded-full flex items-center justify-center `}
                              >
                                {pilihanDataSalah.bersediaDirujukCBox ===
                                true ? (
                                  <FaTimes
                                    className='text-2xl'
                                    onClick={() => {
                                      setPilihanDataSalah({
                                        ...pilihanDataSalah,
                                        bersediaDirujuk: '',
                                      });
                                      setDataRetenSalah({
                                        ...dataRetenSalah,
                                        bersediaDirujuk: '',
                                      });
                                      setConfirmData({
                                        ...confirmData,
                                        pilihanDataSalah: {
                                          ...pilihanDataSalah,
                                          bersediaDirujuk: '',
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
                          {pilihanDataSalah.bersediaDirujukCBox === true && (
                            <div className='flex items-center justify-center bg-user11 bg-opacity-50 mb-1 p-2'>
                              <input
                                disabled={
                                  bersediaDirujuk === 'ya-bersedia-dirujuk'
                                    ? true
                                    : disableSalah === true
                                    ? true
                                    : false
                                }
                                required
                                type='radio'
                                name='bersedia-dirujuk-reten-salah'
                                id='ya-bersedia-dirujuk-reten-salah'
                                value='ya-bersedia-dirujuk-reten-salah'
                                checked={
                                  pilihanDataSalah.bersediaDirujuk ===
                                  'ya-bersedia-dirujuk-reten-salah'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    bersediaDirujuk: e.target.value,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    bersediaDirujuk: e.target.value,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      bersediaDirujuk: e.target.value,
                                    },
                                  });
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='ya-bersedia-dirujuk-reten-salah'
                                className='mx-2 text-sm font-m'
                              >
                                Ya
                              </label>
                              <input
                                disabled={
                                  bersediaDirujuk === 'tidak-bersedia-dirujuk'
                                    ? true
                                    : disableSalah === true
                                    ? true
                                    : false
                                }
                                required
                                type='radio'
                                name='bersedia-dirujuk-reten-salah'
                                id='tidak-bersedia-dirujuk-reten-salah'
                                value='tidak-bersedia-dirujuk-reten-salah'
                                checked={
                                  pilihanDataSalah.bersediaDirujuk ===
                                  'tidak-bersedia-dirujuk-reten-salah'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    bersediaDirujuk: e.target.value,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    bersediaDirujuk: e.target.value,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      bersediaDirujuk: e.target.value,
                                    },
                                  });
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='tidak-bersedia-dirujuk-reten-salah'
                                className='mx-2 text-sm font-m'
                              >
                                Tidak
                              </label>
                              <input
                                disabled={
                                  bersediaDirujuk === ''
                                    ? true
                                    : disableSalah === true
                                    ? true
                                    : false
                                }
                                required
                                type='radio'
                                name='bersedia-dirujuk-reten-salah'
                                id='tiada-bersedia-dirujuk-reten-salah'
                                value='tiada-bersedia-dirujuk-reten-salah'
                                checked={
                                  pilihanDataSalah.bersediaDirujuk ===
                                  'tiada-bersedia-dirujuk-reten-salah'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    bersediaDirujuk: e.target.value,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    bersediaDirujuk: e.target.value,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      bersediaDirujuk: e.target.value,
                                    },
                                  });
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='tiada-bersedia-dirujuk-reten-salah'
                                className='mx-2 text-sm font-m'
                              >
                                tiada
                              </label>
                              <span
                                className={` ${
                                  disableSalah === true
                                    ? 'pointer-events-none'
                                    : 'cursor-pointer '
                                } text-kaunter4`}
                                onClick={() => {
                                  setPilihanDataSalah({
                                    ...pilihanDataSalah,
                                    bersediaDirujuk: '',
                                    bersediaDirujukCBox: false,
                                  });
                                  setDataRetenSalah({
                                    ...dataRetenSalah,
                                    bersediaDirujuk: '',
                                    bersediaDirujukCBox: false,
                                  });
                                  setConfirmData({
                                    ...confirmData,
                                    pilihanDataSalah: {
                                      ...pilihanDataSalah,
                                      bersediaDirujuk: '',
                                      bersediaDirujukCBox: false,
                                    },
                                  });
                                }}
                              >
                                <FaCheck className='text-xl' />
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* {bersediaDirujuk === 'ya-bersedia-dirujuk' && (
                        <div className='col-span-2 grid grid-cols-[3fr_2fr]'>
                          <p className='flex items-center text-sm'>
                            nombor telefon yang boleh dihubungi
                            <span className='text-user6'>*</span>
                          </p>
                          <div className='flex items-center'>
                            <input
                              disabled={isDisabled}
                              required
                              type='text'
                              pattern='[0-9]+'
                              title='Nombor telefon'
                              name='no-tel-murid-kotak'
                              id='no-tel-murid-kotak'
                              value={noTelMuridKotak}
                              onChange={(e) => {
                                setNoTelMuridKotak(e.target.value);
                                setConfirmData({
                                  ...confirmData,
                                  noTelMuridKotak: e.target.value,
                                });
                              }}
                              className='w-40 h-10 border border-userBlack rounded-md pl-2'
                              placeholder='0123456678'
                            />
                          </div>
                        </div>
                      )} */}
                    </article>
                    <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md auto-rows-min'>
                      {/* <h4 className='font-bold col-span-2 flex pl-5'>
                        Kes Selesai
                      </h4> */}
                      <div className='pl-5 col-span-2 grid grid-cols-2 lg:grid-cols-[1fr_3fr]'>
                        <p className='font-bold text-lg mr-2 flex items-center'>
                          Kes Selesai
                          <span className='text-user6'>*</span>
                        </p>{' '}
                        <div className=' flex items-center'>
                          <input
                            disabled={isDisabled}
                            required
                            type='radio'
                            name='kes-selesai'
                            id='ya-kes-selesai'
                            value='ya-kes-selesai'
                            checked={
                              kesSelesai === 'ya-kes-selesai' ? true : false
                            }
                            onChange={(e) => {
                              setKesSelesai(e.target.value);
                              setConfirmData({
                                ...confirmData,
                                kesSelesai: e.target.value,
                              });
                            }}
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          />
                          <label
                            htmlFor='ya-kes-selesai'
                            className='mx-2 text-sm font-m'
                          >
                            Ya
                          </label>
                          <input
                            disabled={isDisabled}
                            required
                            type='radio'
                            name='kes-selesai'
                            id='tidak-kes-selesai'
                            value='tidak-kes-selesai'
                            checked={
                              kesSelesai === 'tidak-kes-selesai' ? true : false
                            }
                            onChange={(e) => {
                              setKesSelesai(e.target.value);
                              setConfirmData({
                                ...confirmData,
                                kesSelesai: e.target.value,
                              });
                            }}
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          />
                          <label
                            htmlFor='tidak-kes-selesai'
                            className='mx-2 text-sm font-m'
                          >
                            Tidak
                          </label>
                        </div>
                      </div>
                      <div className='pl-5 col-span-2 grid grid-cols-2 lg:grid-cols-[1fr_3fr]'>
                        <p className='font-bold text-lg mr-2 flex items-center'>
                          Kes Selesai MMI
                          <span className='text-user6'>*</span>
                        </p>
                        <div className=' flex items-center'>
                          <input
                            disabled={isDisabled}
                            required
                            type='radio'
                            name='kes-selesai-icdas'
                            id='ya-kes-selesai-icdas'
                            value='ya-kes-selesai-icdas'
                            checked={
                              kesSelesaiIcdas === 'ya-kes-selesai-icdas'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              setKesSelesaiIcdas(e.target.value);
                              setConfirmData({
                                ...confirmData,
                                kesSelesaiIcdas: e.target.value,
                              });
                            }}
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          />
                          <label
                            htmlFor='ya-kes-selesai-icdas'
                            className='mx-2 text-sm font-m'
                          >
                            Ya
                          </label>
                          <input
                            disabled={isDisabled}
                            required
                            type='radio'
                            name='kes-selesai-icdas'
                            id='tidak-kes-selesai-icdas'
                            value='tidak-kes-selesai-icdas'
                            checked={
                              kesSelesaiIcdas === 'tidak-kes-selesai-icdas'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              setKesSelesaiIcdas(e.target.value);
                              setConfirmData({
                                ...confirmData,
                                kesSelesaiIcdas: e.target.value,
                              });
                            }}
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          />
                          <label
                            htmlFor='tidak-kes-selesai-icdas'
                            className='mx-2 text-sm font-m'
                          >
                            Tidak
                          </label>
                        </div>
                      </div>
                      {/* <div className='flex pl-5 items-center'>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='kes-selesai'
                          id='kes-selesai'
                          checked={kesSelesai}
                          onChange={() => {
                            setKesSelesai(!kesSelesai);
                            setConfirmData({
                              ...confirmData,
                              kesSelesai: !kesSelesai,
                            });
                          }}
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='kes-selesai'
                          className='mx-2 text-sm font-m'
                        >
                          kes selesai
                        </label>
                      </div> */}
                      {/* <div className='flex pl-5 items-center'>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='kes-selesai-mmi'
                          id='kes-selesai-mmi'
                          checked={kesSelesaiIcdas}
                          onChange={() => {
                            setKesSelesaiIcdas(!kesSelesaiIcdas);
                            setConfirmData({
                              ...confirmData,
                              kesSelesaiIcdas: !kesSelesaiIcdas,
                            });
                          }}
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='kes-selesai-mmi'
                          className='mx-2 text-sm font-m'
                        >
                          kes selesai MMI
                        </label>
                      </div> */}
                    </article>
                  </section>
                )}
                <div className='grid grid-cols-1 md:grid-cols-3 col-start-1 lg:col-start-2 gap-2 col-span-1 md:col-span-2'>
                  <span
                    onClick={() => {
                      window.opener = null;
                      window.open('', '_self');
                      window.close();
                    }}
                    className='flex bg-user3 p-2 w-full capitalize justify-center hover:bg-user1 hover:text-userWhite transition-all hover:cursor-pointer col-start-2'
                  >
                    tutup
                  </span>
                  {isSubmitting ? (
                    <button
                      type='button'
                      className='capitalize bg-user9 justify-center rounded-md p-2 mr-2 inline-flex cursor-not-allowed'
                      disabled
                    >
                      <FaGlobeAsia className='mr-2 my-auto animate-spin' />
                      Menghantar Data
                    </button>
                  ) : disableSalah === true ? (
                    <button
                      type='button'
                      className='capitalize bg-user9 justify-center rounded-md p-2 mr-2 inline-flex cursor-not-allowed'
                      disabled
                    >
                      <FaYinYang className='mr-2 my-auto animate-spin' />
                      <strike>SALAH RETEN</strike>
                    </button>
                  ) : (
                    <button
                      type='submit'
                      className='flex bg-user9 p-2 w-full capitalize justify-center hover:bg-user14 hover:text-userWhite transition-all'
                    >
                      SALAH RETEN
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

export default UserFormSalahSekolahPemeriksaan;
