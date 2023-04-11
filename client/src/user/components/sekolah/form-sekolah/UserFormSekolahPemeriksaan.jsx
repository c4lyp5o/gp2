import { useState, useEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';
import { Spinner } from 'react-awesome-spinners';
import moment from 'moment';

import ConfirmCheck from './ConfirmationPemeriksaan';

import { useGlobalUserAppContext } from '../../../context/userAppContext';

function UserFormSekolahPemeriksaan() {
  const {
    userToken,
    reliefUserToken,
    username,
    useParams,
    masterDatePicker,
    toast,
  } = useGlobalUserAppContext();

  const { personSekolahId, pemeriksaanSekolahId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isShown, setIsShown] = useState(false);
  const [singlePersonSekolah, setSinglePersonSekolah] = useState([]);

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

  // datepicker issue
  const [tarikhPemeriksaanSemasaDP, setTarikhPemeriksaanSemasaDP] =
    useState(null);

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

  //cek risiko karies
  useEffect(() => {
    if (parseInt(jumlahFaktorRisiko) >= 3 && parseInt(eAdaGigiKekal) >= 1) {
      setPenandaRisikoKaries('tinggi');
    } else if (
      parseInt(jumlahFaktorRisiko) >= 1 &&
      (parseInt(dAdaGigiDesidus) >= 1 || parseInt(dAdaGigiKekal) >= 1)
    ) {
      setPenandaRisikoKaries('tinggi');
    } else if (
      parseInt(jumlahFaktorRisiko) <= 2 &&
      parseInt(eAdaGigiKekal) >= 1
    ) {
      setPenandaRisikoKaries('sederhana');
    } else if (
      parseInt(jumlahFaktorRisiko) >= 3 &&
      (parseInt(dAdaGigiDesidus) === 0 || parseInt(dAdaGigiKekal) === 0)
    ) {
      setPenandaRisikoKaries('sederhana');
    } else if (
      parseInt(jumlahFaktorRisiko) === 0 &&
      (parseInt(dAdaGigiDesidus) >= 1 || parseInt(dAdaGigiKekal) >= 1)
    ) {
      setPenandaRisikoKaries('sederhana');
    } else if (
      parseInt(jumlahFaktorRisiko) <= 2 &&
      (parseInt(dAdaGigiDesidus) === 0 || parseInt(dAdaGigiKekal) === 0)
    ) {
      setPenandaRisikoKaries('rendah');
    }
  });

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

  //reset value
  useEffect(() => {
    if (statikBergerak === 'klinik-pergigian-statik' || statikBergerak === '') {
      setKpBergerak(false);
      setPlateNo('');
    }
    if (yaTidakSediaAdaStatusDenture === 'tidak-sedia-ada-status-denture') {
      setSeparaPenuhAtasSediaAdaDenture('');
      setSeparaPenuhBawahSediaAdaDenture('');
    }
    if (yaTidakPerluStatusDenture === 'tidak-perlu-status-denture') {
      setSeparaPenuhAtasPerluDenture('');
      setSeparaPenuhBawahPerluDenture('');
    }
    if (!adaDesidus) {
      setDAdaGigiDesidus(0);
      setFAdaGigiDesidus(0);
      setXAdaGigiDesidus(0);
    }
    if (!adaKekal) {
      setDAdaGigiKekal(0);
      setMAdaGigiKekal(0);
      setFAdaGigiKekal(0);
      setEAdaGigiKekal(0);
      setXAdaGigiKekal(0);
    }
  }, [
    statikBergerak,
    yaTidakSediaAdaStatusDenture,
    yaTidakPerluStatusDenture,
    adaDesidus,
    adaKekal,
  ]);

  //reset modal
  useEffect(() => {
    if (engganTidakHadirPemeriksaan === 'tidak-hadir-pemeriksaan') {
      setEngganPemeriksaan('');
      setKebenaranPemeriksaan('');
    }
    if (engganTidakHadirPemeriksaan === 'enggan-pemeriksaan') {
      setTidakHadirPemeriksaan('');
    }
  }, [engganTidakHadirPemeriksaan]);

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

  const handleSubmit = async (e) => {
    if (sumDMFXDesidus > 20) {
      toast.error('Jumlah DMFX Desidus tidak boleh lebih dari 20', {
        autoClose: 3000,
      });
      return;
    }
    if (sumDMFXKekal > 32) {
      toast.error('Jumlah DMFX Kekal tidak boleh lebih dari 32', {
        autoClose: 3000,
      });
      return;
    }
    if (sumClassD > dAdaGigiKekal) {
      toast.error('Jumlah Class D tidak boleh lebih dari jumlah d gigi kekal', {
        autoClose: 3000,
      });
      return;
    }
    if (sumClassF > fAdaGigiKekal) {
      toast.error('Jumlah Class F tidak boleh lebih dari jumlah f gigi kekal', {
        autoClose: 3000,
      });
      return;
    }
    if (sumPerluFs > 16) {
      toast.error('Jumlah Perlu Fs tidak boleh lebih dari 16', {
        autoClose: 3000,
      });
      return;
    }
    if (sumPerluFv > 16) {
      toast.error('Jumlah Perlu Fv tidak boleh lebih dari 16', {
        autoClose: 3000,
      });
      return;
    }
    if (sumPerluPrr > 16) {
      toast.error('Jumlah Perlu Prr tidak boleh lebih dari 16', {
        autoClose: 3000,
      });
      return;
    }
    if (dAdaGigiKekal > sumGigiKekal) {
      toast.error(
        'Jumlah tampalan diperlukan gigi kekal kurang dengan jumlah D gigi kekal',
        {
          autoClose: 3000,
        }
      );
      return;
    }
    if (sumGigiKekalE !== eAdaGigiKekal) {
      toast.error(
        'Jumlah tampalan diperlukan gigi kekal ICDAS tidak sama dengan jumlah E gigi kekal',
        {
          autoClose: 3000,
        }
      );
      return;
    }
    let statusRawatan = '';
    if (
      kesSelesai !== 'ya-kes-selesai' ||
      engganPemeriksaan !== 'ya-enggan-pemeriksaan' ||
      tidakHadirPemeriksaan !== 'ya-kehadiran-pemeriksaan'
    ) {
      statusRawatan = 'belum selesai';
    }
    if (kesSelesai === 'ya-kes-selesai') {
      statusRawatan = 'selesai';
    }
    if (engganPemeriksaan === 'ya-enggan-pemeriksaan') {
      statusRawatan = 'enggan';
    }
    if (tidakHadirPemeriksaan === 'ya-kehadiran-pemeriksaan') {
      statusRawatan = 'tidak hadir';
    }
    let kesSelesaiMmi = false;
    if (kesSelesaiIcdas === 'ya-kes-selesai-icdas') {
      kesSelesaiMmi = true;
    }
    const { nama, namaKelas, namaSekolah, kodSekolah } = singlePersonSekolah;
    // return;
    if (pemeriksaanSekolahId === 'tambah-pemeriksaan') {
      await toast
        .promise(
          axios.post(
            `/api/v1/sekolah/pemeriksaan/${personSekolahId}`,
            {
              createdByUsername,
              nama,
              namaKelas,
              namaSekolah,
              kodSekolah,
              statusRawatan,
              kesSelesaiMmi,
              engganTidakHadirPemeriksaan,
              engganPemeriksaan,
              kebenaranPemeriksaan,
              tidakHadirPemeriksaan,
              tarikhPemeriksaanSemasa,
              statikBergerak,
              kpBergerak,
              plateNo,
              yaTidakSediaAdaStatusDenture,
              separaPenuhAtasSediaAdaDenture,
              separaPenuhBawahSediaAdaDenture,
              yaTidakPerluStatusDenture,
              separaPenuhAtasPerluDenture,
              separaPenuhBawahPerluDenture,
              kebersihanMulutOralHygiene,
              skorBpeOralHygiene,
              saringanKanserMulutOralHygiene,
              skorGisMulutOralHygiene,
              perluPenskaleranOralHygiene,
              yaTidakPesakitMempunyaiGigi,
              adaDesidus,
              dAdaGigiDesidus,
              fAdaGigiDesidus,
              xAdaGigiDesidus,
              adaKekal,
              dAdaGigiKekal,
              mAdaGigiKekal,
              fAdaGigiKekal,
              eAdaGigiKekal,
              xAdaGigiKekal,
              jumlahFaktorRisiko,
              adaCleftLip,
              rujukCleftLip,
              kecederaanGigiAnteriorTrauma,
              tisuLembutTrauma,
              tisuKerasTrauma,
              gicBilanganFsDibuat3TahunLepas,
              resinBilanganFsDibuat3TahunLepas,
              lainLainBilanganFsDibuat3TahunLepas,
              dBilanganFsDibuat3TahunLepasTerjadi,
              mBilanganFsDibuat3TahunLepasTerjadi,
              fBilanganFsDibuat3TahunLepasTerjadi,
              eBilanganFsDibuat3TahunLepasTerjadi,
              xBilanganFsDibuat3TahunLepasTerjadi,
              toothSurfaceLoss,
              classID,
              classIID,
              classIF,
              classIIF,
              baruJumlahGigiKekalPerluFs,
              baruJumlahMuridPerluFs,
              baruJumlahGigiKekalPerluFv,
              semulaJumlahGigiKekalPerluFv,
              baruJumlahMuridPerluFv,
              semulaJumlahMuridPerluFv,
              baruJumlahGigiKekalPerluPrrJenis1,
              semulaJumlahGigiKekalPerluPrrJenis1,
              baruJumlahMuridPerluPrrJenis1,
              semulaJumlahMuridPerluPrrJenis1,
              yaTidakSilverDiamineFluoridePerluSapuan,
              baruGDAnteriorSewarnaJumlahTampalanDiperlukan,
              semulaGDAnteriorSewarnaJumlahTampalanDiperlukan,
              baruGKAnteriorSewarnaJumlahTampalanDiperlukan,
              semulaGKAnteriorSewarnaJumlahTampalanDiperlukan,
              baruGDPosteriorSewarnaJumlahTampalanDiperlukan,
              semulaGDPosteriorSewarnaJumlahTampalanDiperlukan,
              baruGKPosteriorSewarnaJumlahTampalanDiperlukan,
              semulaGKPosteriorSewarnaJumlahTampalanDiperlukan,
              baruGDPosteriorAmalgamJumlahTampalanDiperlukan,
              semulaGDPosteriorAmalgamJumlahTampalanDiperlukan,
              baruGKPosteriorAmalgamJumlahTampalanDiperlukan,
              semulaGKPosteriorAmalgamJumlahTampalanDiperlukan,
              statusM,
              menerimaNasihatRingkas,
              melaksanakanSaringanMerokok,
              bersediaDirujuk,
              kesSelesai,
              kesSelesaiIcdas,
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
            success: 'Pemeriksaan pelajar berjaya dihantar',
            error: 'Pemeriksaan pelajar gagal dihantar',
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
    if (pemeriksaanSekolahId !== 'tambah-pemeriksaan') {
      await toast
        .promise(
          axios.patch(
            `/api/v1/sekolah/pemeriksaan/ubah/${pemeriksaanSekolahId}?personSekolahId=${personSekolahId}`,
            {
              createdByUsername,
              statusRawatan,
              kesSelesaiMmi,
              engganTidakHadirPemeriksaan,
              engganPemeriksaan,
              kebenaranPemeriksaan,
              tidakHadirPemeriksaan,
              tarikhPemeriksaanSemasa,
              statikBergerak,
              kpBergerak,
              plateNo,
              yaTidakSediaAdaStatusDenture,
              separaPenuhAtasSediaAdaDenture,
              separaPenuhBawahSediaAdaDenture,
              yaTidakPerluStatusDenture,
              separaPenuhAtasPerluDenture,
              separaPenuhBawahPerluDenture,
              kebersihanMulutOralHygiene,
              skorBpeOralHygiene,
              saringanKanserMulutOralHygiene,
              skorGisMulutOralHygiene,
              perluPenskaleranOralHygiene,
              yaTidakPesakitMempunyaiGigi,
              adaDesidus,
              dAdaGigiDesidus,
              fAdaGigiDesidus,
              xAdaGigiDesidus,
              adaKekal,
              dAdaGigiKekal,
              mAdaGigiKekal,
              fAdaGigiKekal,
              eAdaGigiKekal,
              xAdaGigiKekal,
              jumlahFaktorRisiko,
              adaCleftLip,
              rujukCleftLip,
              kecederaanGigiAnteriorTrauma,
              tisuLembutTrauma,
              tisuKerasTrauma,
              gicBilanganFsDibuat3TahunLepas,
              resinBilanganFsDibuat3TahunLepas,
              lainLainBilanganFsDibuat3TahunLepas,
              dBilanganFsDibuat3TahunLepasTerjadi,
              mBilanganFsDibuat3TahunLepasTerjadi,
              fBilanganFsDibuat3TahunLepasTerjadi,
              eBilanganFsDibuat3TahunLepasTerjadi,
              xBilanganFsDibuat3TahunLepasTerjadi,
              toothSurfaceLoss,
              classID,
              classIID,
              classIF,
              classIIF,
              baruJumlahGigiKekalPerluFs,
              baruJumlahMuridPerluFs,
              baruJumlahGigiKekalPerluFv,
              semulaJumlahGigiKekalPerluFv,
              baruJumlahMuridPerluFv,
              semulaJumlahMuridPerluFv,
              baruJumlahGigiKekalPerluPrrJenis1,
              semulaJumlahGigiKekalPerluPrrJenis1,
              baruJumlahMuridPerluPrrJenis1,
              semulaJumlahMuridPerluPrrJenis1,
              yaTidakSilverDiamineFluoridePerluSapuan,
              baruGDAnteriorSewarnaJumlahTampalanDiperlukan,
              semulaGDAnteriorSewarnaJumlahTampalanDiperlukan,
              baruGKAnteriorSewarnaJumlahTampalanDiperlukan,
              semulaGKAnteriorSewarnaJumlahTampalanDiperlukan,
              baruGDPosteriorSewarnaJumlahTampalanDiperlukan,
              semulaGDPosteriorSewarnaJumlahTampalanDiperlukan,
              baruGKPosteriorSewarnaJumlahTampalanDiperlukan,
              semulaGKPosteriorSewarnaJumlahTampalanDiperlukan,
              baruGDPosteriorAmalgamJumlahTampalanDiperlukan,
              semulaGDPosteriorAmalgamJumlahTampalanDiperlukan,
              baruGKPosteriorAmalgamJumlahTampalanDiperlukan,
              semulaGKPosteriorAmalgamJumlahTampalanDiperlukan,
              statusM,
              menerimaNasihatRingkas,
              melaksanakanSaringanMerokok,
              bersediaDirujuk,
              kesSelesai,
              kesSelesaiIcdas,
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
    }
  };

  return (
    <ConfirmCheck callbackFx={handleSubmit} data={confirmData}>
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
                        {singlePersonSekolah.tahun}{' '}
                        {singlePersonSekolah.namaKelas}
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
                    <div className='grid grid-rows-2'>
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
                              setEngganTidakHadirPemeriksaan('');
                              setEngganPemeriksaan('');
                              setKebenaranPemeriksaan('');
                              setTidakHadirPemeriksaan('');
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
                              setEngganTidakHadirPemeriksaan('');
                              setEngganPemeriksaan('');
                              setKebenaranPemeriksaan('');
                              setTidakHadirPemeriksaan('');
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
                    </div>
                    {tidakHadirPemeriksaan === 'ya-kehadiran-pemeriksaan' ||
                    engganPemeriksaan === 'ya-enggan-pemeriksaan' ? (
                      <div>
                        <p className='flex text-left flex-row pl-4 p-1 text-sm'>
                          {engganPemeriksaan === 'ya-enggan-pemeriksaan' ? (
                            <p>
                              {kebenaranPemeriksaan ===
                              'ya-kebenaran-pemeriksaan' ? (
                                <p>
                                  Enggan Pemeriksaan
                                  <span className='text-user7 font-bold'>
                                    DENGAN
                                  </span>{' '}
                                  kebenaran rawatan daripada ibu bapa/penjaga
                                </p>
                              ) : (
                                <p>
                                  Enggan Pemeriksaan
                                  <span className='text-user6 font-bold'>
                                    TANPA
                                  </span>{' '}
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
                        <div className='flex flex-row items-center pl-5 pt-1'>
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
                        </div>
                        <div className='flex flex-row items-center pl-5 pt-1'>
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
                      <div className='grid grid-rows-2 gap-2 auto-rows-min'>
                        <article className='grid grid-cols-2 auto-rows-min border border-userBlack pl-3 p-2 rounded-md'>
                          <h4 className='font-semibold'>Sedia Ada?</h4>
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
                                setYaTidakSediaAdaStatusDenture(e.target.value);
                                setConfirmData({
                                  ...confirmData,
                                  yaTidakSediaAdaStatusDenture: e.target.value,
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
                                setYaTidakSediaAdaStatusDenture(e.target.value);
                                setConfirmData({
                                  ...confirmData,
                                  yaTidakSediaAdaStatusDenture: e.target.value,
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
                          </div>
                          {yaTidakSediaAdaStatusDenture ===
                            'ya-sedia-ada-status-denture' && (
                            <div className='flex items-center flex-row pl-5'>
                              <label
                                htmlFor='atas-sedia-ada-denture'
                                className='m-2 text-sm font-m'
                              >
                                Atas
                              </label>
                            </div>
                          )}
                          {yaTidakSediaAdaStatusDenture ===
                            'ya-sedia-ada-status-denture' && (
                            <div className='grid grid-cols-2'>
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
                            </div>
                          )}
                          {yaTidakSediaAdaStatusDenture ===
                            'ya-sedia-ada-status-denture' && (
                            <div className='flex items-center flex-row pl-5'>
                              <label
                                htmlFor='bawah-sedia-ada-denture'
                                className='m-2 text-sm font-m'
                              >
                                Bawah
                              </label>
                            </div>
                          )}
                          {yaTidakSediaAdaStatusDenture ===
                            'ya-sedia-ada-status-denture' && (
                            <div className='grid grid-cols-2'>
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
                            </div>
                          )}
                        </article>
                        <article className='grid grid-cols-2 auto-rows-min border border-userBlack pl-3 p-2 rounded-md'>
                          <h4 className='font-semibold'>Perlu</h4>
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
                          </div>
                          {yaTidakPerluStatusDenture ===
                            'ya-perlu-status-denture' && (
                            <div className='flex items-center flex-row pl-5'>
                              <label
                                htmlFor='atas-perlu-denture'
                                className='m-2 text-sm font-m'
                              >
                                Atas
                              </label>
                            </div>
                          )}
                          {yaTidakPerluStatusDenture ===
                            'ya-perlu-status-denture' && (
                            <div className='grid grid-cols-2'>
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
                                      separaPenuhAtasPerluDenture:
                                        e.target.value,
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
                                      separaPenuhAtasPerluDenture:
                                        e.target.value,
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
                            </div>
                          )}
                          {yaTidakPerluStatusDenture ===
                            'ya-perlu-status-denture' && (
                            <div className='flex items-center flex-row pl-5'>
                              <label
                                htmlFor='bawah-perlu-denture'
                                className='m-2 text-sm font-m'
                              >
                                Bawah
                              </label>
                            </div>
                          )}
                          {yaTidakPerluStatusDenture ===
                            'ya-perlu-status-denture' && (
                            <div className='grid grid-cols-2'>
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
                            </div>
                          )}
                        </article>
                      </div>
                    </article>
                    <div className='grid grid-cols-2 gap-x-2'>
                      <article className='grid grid-cols-1 border border-userBlack pl-3 p-2 rounded-md auto-rows-min'>
                        <h4 className='font-bold flex flex-row pl-5'>
                          Kebersihan Mulut
                        </h4>
                        <div className='flex items-center '>
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
                            <option value='A'>A</option>
                            <option value='C'>C</option>
                            <option value='E'>E</option>
                          </select>
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
                        <div className='flex items-center flex-row pl-5'>
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
                        </div>
                      </article>
                      <article className='border border-userBlack pl-3 p-2 rounded-md grid grid-cols-1 auto-rows-min'>
                        <h4 className='font-bold flex flex-row pl-5'>
                          Status Periodontium
                        </h4>
                        <div className='flex items-center flex-row pl-5'>
                          <p className='flex text-sm font-m'>
                            Skor GIS
                            {skorGisMulutOralHygiene ||
                            skorBpeOralHygiene === '1' ||
                            skorBpeOralHygiene === '2' ||
                            skorBpeOralHygiene === '3' ||
                            skorBpeOralHygiene === '4' ? null : (
                              <span className='text-user6'>*</span>
                            )}
                          </p>
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
                            <option value='0'>0</option>
                            <option value='1'>1</option>
                            <option value='2'>2</option>
                            <option value='3'>3</option>
                          </select>
                        </div>
                        {singlePersonSekolah.umur >= 15 && (
                          <div className=' flex items-center flex-row pl-5'>
                            <p className='text-sm font-m'>
                              Skor BPE
                              {skorGisMulutOralHygiene ||
                              skorBpeOralHygiene === '1' ||
                              skorBpeOralHygiene === '2' ||
                              skorBpeOralHygiene === '3' ||
                              skorBpeOralHygiene === '4' ? null : (
                                <span className='text-user6'>*</span>
                              )}
                            </p>
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
                              className='appearance-none w-32 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            >
                              <option value=''></option>
                              <option value='0'>0</option>
                              <option value='1'>1</option>
                              <option value='2'>2</option>
                              <option value='3'>3</option>
                              <option value='4'>4</option>
                              <option value='tidak-disaring'>
                                Tidak Disaring
                              </option>
                            </select>
                          </div>
                        )}
                      </article>
                    </div>
                    <article className=' border border-userBlack pl-3 p-2 rounded-md grid grid-cols-2 gap-2 auto-rows-min'>
                      <div className='flex flex-row items-center pl-5 col-span-2'>
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
                      {yaTidakPesakitMempunyaiGigi ===
                        'ya-pesakit-mempunyai-gigi' && (
                        <div className='shadow-lg shadow-user4 rounded-md auto-rows-min'>
                          <h4 className='font-bold flex flex-row pl-5'>
                            Status Gigi Desidus
                            {adaDesidus === true || adaKekal === true ? null : (
                              <span className='text-user6'>*</span>
                            )}
                          </h4>
                          <div className='grid gap-1'>
                            <div className='flex items-center pl-5'>
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
                            </div>
                            <div
                              className={`${
                                !adaDesidus && 'hidden'
                              } grid grid-cols-1`}
                            >
                              <div className='flex flex-row items-center pl-5'>
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
                              </div>
                              <div className='flex flex-row items-center pl-5'>
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
                              </div>
                              <div className='flex flex-row items-center pl-5'>
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
                              </div>
                            </div>
                          </div>
                          {sumDMFXDesidus > 20 && (
                            <p className='text-user6 font-semibold'>
                              jumlah <span className='lowercase'>dmfx</span>
                              tidak boleh melebihi 20
                            </p>
                          )}
                        </div>
                      )}
                      {yaTidakPesakitMempunyaiGigi ===
                        'ya-pesakit-mempunyai-gigi' && (
                        <div className='shadow-lg shadow-user4 rounded-md auto-rows-min'>
                          <h4 className='font-bold flex flex-row pl-5'>
                            Status Gigi Kekal
                            {adaDesidus === true || adaKekal === true ? null : (
                              <span className='text-user6'>*</span>
                            )}
                          </h4>
                          <div className='grid grid-cols-1'>
                            <div className='flex items-center pl-5 peer-active:bg-user3'>
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
                            </div>
                            <div
                              className={`${
                                !adaKekal && 'hidden'
                              } grid grid-cols-1 gap-2`}
                            >
                              <div className='flex flex-row items-center  pl-5'>
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
                              </div>
                              {dAdaGigiKekal > 0 && (
                                <article className='grid grid-cols-2 border border-userBlack p-1 rounded-md mx-1'>
                                  <h4 className='font-bold flex flex-row col-span-2'>
                                    D
                                  </h4>
                                  <div className='flex flex-row items-center'>
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
                                  </div>
                                  <div className='flex flex-row items-center'>
                                    <p className='text-sm font-m '>
                                      Class II:{' '}
                                    </p>
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
                                  </div>
                                  {sumClassD > dAdaGigiKekal && (
                                    <p className='col-span-2 text-user6 font-semibold'>
                                      jumlah class I + class II D tidak boleh
                                      melebihi D
                                    </p>
                                  )}
                                </article>
                              )}
                              <div className='flex flex-row items-center pl-5'>
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
                              </div>
                              <div className='flex flex-row items-center pl-5'>
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
                              </div>
                              {fAdaGigiKekal > 0 && (
                                <article className='grid grid-cols-2 border border-userBlack p-2 rounded-md mx-1'>
                                  <h4 className='font-bold flex flex-row col-span-2'>
                                    F
                                  </h4>
                                  <div className='flex flex-row items-center'>
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
                                  </div>
                                  <div className='flex flex-row items-center'>
                                    <p className='text-sm font-m '>
                                      Class II:{' '}
                                    </p>
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
                                  </div>
                                  {sumClassF > fAdaGigiKekal && (
                                    <p className='col-span-2 text-user6 font-semibold'>
                                      jumlah class I + class II F tidak boleh
                                      melebihi F
                                    </p>
                                  )}
                                </article>
                              )}
                              <div className='flex flex-row items-center pl-5'>
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
                              </div>
                              <div className='flex flex-row items-center pl-5'>
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
                              </div>
                            </div>
                          </div>
                          {sumDMFXKekal > 32 && (
                            <p className='text-user6 font-semibold'>
                              jumlah DMFX tidak boleh melebihi 32
                            </p>
                          )}
                        </div>
                      )}
                    </article>
                    <article className='border border-userBlack pl-3 p-2 rounded-md'>
                      <div className='grid grid-cols-1'>
                        <h4 className='font-bold flex flex-row pl-5'>
                          Risiko Karies{' '}
                          <span className='text-user6 text-xl'>*</span>
                        </h4>
                        <div className='flex flex-row items-center'>
                          <p className='flex items-center flex-row pl-5'>
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
                            className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
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
                            className={`appearance-none capitalize h-8 py-1 text-userBlack border border-user1 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent ${
                              penandaRisikoKaries === 'rendah'
                                ? 'bg-user7 w-24 px-2 '
                                : penandaRisikoKaries === 'sederhana'
                                ? 'bg-user8 w-24 px-2 '
                                : penandaRisikoKaries === 'tinggi'
                                ? 'bg-user9 w-24 px-2 '
                                : 'w-40 text-xs px-1'
                            }`}
                          />
                        </div>
                      </div>
                    </article>
                    <article className='grid grid-cols-1 border border-userBlack pl-3 p-2 rounded-md'>
                      <h4 className='font-bold flex flex-row pl-5'>Trauma</h4>
                      <div className='grid grid-cols-1 lg:grid-cols-2'>
                        <div className='flex items-center flex-row pl-5'>
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
                        </div>
                        <div className='flex items-center flex-row pl-5'>
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
                        </div>
                        <div className='flex items-center flex-row pl-5'>
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
                        </div>
                      </div>
                    </article>
                    <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                      <h4 className='font-bold flex flex-row pl-5 col-span-2 text-left'>
                        Bilangan Gigi Kekal Dibuat Pengapan Fisur 3 Tahun Lepas
                      </h4>
                      <div className='flex flex-row pl-5 items-center'>
                        <p className='text-sm font-m '>GIC: </p>
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
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                        />
                      </div>
                      <div className='flex flex-row pl-5 items-center'>
                        <p className='text-sm font-m '>Resin: </p>
                        <input
                          disabled={isDisabled}
                          min='0'
                          max='32'
                          type='number'
                          name='resin-bilangan-fs-dibuat-3-tahun-lepas'
                          id='resin-bilangan-fs-dibuat-3-tahun-lepas'
                          value={resinBilanganFsDibuat3TahunLepas}
                          onChange={(e) => {
                            setResinBilanganFsDibuat3TahunLepas(e.target.value);
                            setConfirmData({
                              ...confirmData,
                              resinBilanganFsDibuat3TahunLepas: e.target.value,
                            });
                          }}
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                        />
                      </div>
                      <div className='flex flex-row pl-5 items-center col-span-2 md:col-span-1'>
                        <p className='text-sm font-m '>Lain-lain: </p>
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
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                        />
                      </div>
                    </article>
                    <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                      <h4 className='font-bold flex flex-row text-left pl-3 col-span-2 md:col-span-3'>
                        Bilangan Gigi Kekal Dibuat Pengapan Fisur 3 Tahun Lepas
                        Berubah Menjadi Seperti Di Bawah :
                      </h4>
                      <div className='flex flex-row pl-5 items-center'>
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
                      </div>
                      <div className='flex flex-row pl-5 items-center'>
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
                      </div>
                      <div className='flex flex-row pl-5 items-center'>
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
                      </div>
                      <div className='flex flex-row pl-5 items-center'>
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
                      </div>
                      <div className='flex flex-row pl-5 items-center'>
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
                      </div>
                    </article>
                    <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md auto-rows-min'>
                      <h4 className='font-bold flex flex-row col-span-2  pb-2 pl-5'>
                        Kehilangan Permukaan Gigi (TSL)
                      </h4>
                      <div className='flex items-center flex-row pl-5'>
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
                        <div className='flex flex-row items-center pl-5 col-span-2 pb-2'>
                          <label
                            htmlFor='baru-jumlah-gigi-kekal-perlu-fs'
                            className='text-sm font-m'
                          >
                            jumlah gigi kekal perlu Pengapan Fisur (E10)
                          </label>
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
                            className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          />
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
                        <div className='flex flex-row items-center pl-5 col-span-2 pb-2'>
                          <label
                            className='text-sm font-m'
                            htmlFor='baru-jumlah-gigi-kekal-perlu-fv'
                          >
                            jumlah gigi kekal perlu Sapuan Fluorida(FV) (E13)
                          </label>
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
                            className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          />
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
                        <div className='flex flex-row items-center pl-5 col-span-2 pb-2'>
                          <label
                            htmlFor='baru-jumlah-gigi-kekal-perlu-prr-jenis-1'
                            className='text-sm font-m'
                          >
                            jumlah gigi kekal perlu Resin Pencegahan Jenis 1
                            (PRR Type I) (E12)
                          </label>
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
                            className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          />
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
                            <div className='flex flex-row items-center pl-5'>
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
                            </div>
                            <div className='flex flex-row items-center pl-5'>
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
                            </div>
                            <div className='flex flex-row items-center pl-5'>
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
                            </div>
                            <div className='flex flex-row items-center pl-5'>
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
                            </div>
                          </article>
                          <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                            <h4 className='font-semibold flex flex-row pl-5 col-span-2'>
                              Posterior Sewarna
                            </h4>
                            <div className='flex flex-row items-center pl-5'>
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
                            </div>
                            <div className='flex flex-row items-center pl-5'>
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
                            </div>
                            <div className='flex flex-row items-center pl-5'>
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
                            </div>
                            <div className='flex flex-row items-center pl-5'>
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
                            </div>
                          </article>
                          <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                            <h4 className='font-semibold flex flex-row pl-5 col-span-2'>
                              Posterior Amalgam
                            </h4>
                            <div className='flex flex-row items-center pl-5'>
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
                            </div>
                            <div className='flex flex-row items-center pl-5'>
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
                            </div>
                            <div className='flex flex-row items-center pl-5'>
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
                            </div>
                            <div className='flex flex-row items-center pl-5'>
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
                    <article className='grid grid-cols-1 gap-2 border border-userBlack pl-5 p-2 rounded-md'>
                      <h4 className='font-bold flex flex-row'>
                        Program Kesihatan Oral Tanpa Amalan Merokok (KOTAK)
                        <span className='text-user6'>*</span>
                      </h4>
                      <div className='col-span-2 grid grid-cols-[3fr_2fr]'>
                        <p className='flex items-center text-sm normal-case'>
                          Melaksanakan saringan merokok melalui Program KOTAK
                          <span className='text-user6'>*</span>
                        </p>
                        <div className='flex items-center'>
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
                        </div>
                      </div>
                      <div className='text-sm grid grid-cols-[3fr_2fr] '>
                        <label
                          htmlFor='statusM'
                          className='flex items-center text-sm normal-case'
                        >
                          Status Merokok<span className='text-user6'>*</span>
                        </label>
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
                          className='appearance-none w-36 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none drop-shadow-lg'
                        >
                          <option value=''></option>
                          <option value='perokok-semasa'>Perokok Semasa</option>
                          <option value='bekas-perokok'>Bekas Perokok</option>
                          <option value='perokok-pasif'>Perokok Pasif</option>
                          <option value='bukan-perokok'>Bukan Perokok</option>
                          <option value='dalam-intervensi'>
                            Dalam Intervensi
                          </option>
                        </select>
                      </div>
                      <div className='col-span-2 grid grid-cols-[3fr_2fr]'>
                        <p className='flex items-center text-sm normal-case'>
                          Pesakit menerima nasihat ringkas?
                          <span className='text-user6'>*</span>
                        </p>
                        <div className='flex items-center'>
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
                        </div>
                      </div>
                      {statusM === 'perokok-semasa' && (
                        <div className='col-span-2 grid grid-cols-[3fr_2fr]'>
                          <p className='flex items-center text-sm normal-case'>
                            Murid BERSETUJU untuk dirujuk menjalani intervensi?
                            <span className='text-user6'>*</span>
                          </p>
                          <div className='flex items-center'>
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
                          </div>
                        </div>
                      )}
                    </article>
                    <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md auto-rows-min'>
                      <h4 className='font-bold col-span-2 flex pl-5'>
                        Kes Selesai
                      </h4>
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
                    className='flex bg-user3 p-2 w-full capitalize justify-center hover:bg-user1 hover:text-userWhite transition-all hover:cursor-pointer'
                  >
                    tutup
                  </span>
                  {!isDisabled && (
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

export default UserFormSekolahPemeriksaan;
