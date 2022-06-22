import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { useGlobalUserAppContext } from '../context/userAppContext';

import Pendaftaran from './form-sekolah/Pendaftaran';
import PemeriksaanAwal from './form-sekolah/PemeriksaanAwal';
import PerluDibuat from './form-sekolah/PerluDibuat';
import PenyataAkhir1 from './form-sekolah/PenyataAkhir1';
import PenyataAkhir2 from './form-sekolah/PenyataAkhir2';
import Kotak from './form-sekolah/Kotak';

function UserFormSekolah() {
  const { userToken, username, useParams } = useGlobalUserAppContext();

  const { personSekolahId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [singlePersonSekolah, setSinglePersonSekolah] = useState([]);

  // creating masterForm object to be used by the form
  const masterForm = {};
  masterForm.createdByUsername = username;
  // pendaftaran
  const [kpBergerak, setKpBergerak] = useState(false);
  masterForm.kpBergerak = kpBergerak;
  masterForm.setKpBergerak = setKpBergerak;
  const [pasukanPergigianBergerak, setPasukanPergigianBergerak] =
    useState(false);
  masterForm.pasukanPergigianBergerak = pasukanPergigianBergerak;
  masterForm.setPasukanPergigianBergerak = setPasukanPergigianBergerak;
  const [plateNo, setPlateNo] = useState('');
  masterForm.plateNo = plateNo;
  masterForm.setPlateNo = setPlateNo;
  const [
    baruUlanganKedatanganPendaftaran,
    setBaruUlanganKedatanganPendaftaran,
  ] = useState('');
  masterForm.baruUlanganKedatanganPendaftaran =
    baruUlanganKedatanganPendaftaran;
  masterForm.setBaruUlanganKedatanganPendaftaran =
    setBaruUlanganKedatanganPendaftaran;
  const [engganKedatanganPendaftaran, setEngganKedatanganPendaftaran] =
    useState(false);
  masterForm.engganKedatanganPendaftaran = engganKedatanganPendaftaran;
  masterForm.setEngganKedatanganPendaftaran = setEngganKedatanganPendaftaran;
  const [tidakHadirKedatanganPendaftaran, setTidakHadirKedatanganPendaftaran] =
    useState(false);
  masterForm.tidakHadirKedatanganPendaftaran = tidakHadirKedatanganPendaftaran;
  masterForm.setTidakHadirKedatanganPendaftaran =
    setTidakHadirKedatanganPendaftaran;
  const [adaTiadaPemeriksaanPendaftaran, setAdaTiadaPemeriksaanPendaftaran] =
    useState('');
  masterForm.adaTiadaPemeriksaanPendaftaran = adaTiadaPemeriksaanPendaftaran;
  masterForm.setAdaTiadaPemeriksaanPendaftaran =
    setAdaTiadaPemeriksaanPendaftaran;
  const [
    tinggiRendahRisikoSekolahPendaftaran,
    setTinggiRendahRisikoSekolahPendaftaran,
  ] = useState('');
  masterForm.tinggiRendahRisikoSekolahPendaftaran =
    tinggiRendahRisikoSekolahPendaftaran;
  masterForm.setTinggiRendahRisikoSekolahPendaftaran =
    setTinggiRendahRisikoSekolahPendaftaran;
  // pemeriksaan awal div 1
  const [adaCleftLip, setAdaCleftLip] = useState(false);
  masterForm.adaCleftLip = adaCleftLip;
  masterForm.setAdaCleftLip = setAdaCleftLip;
  const [rujukCleftLip, setRujukCleftLip] = useState(false);
  masterForm.rujukCleftLip = rujukCleftLip;
  masterForm.setRujukCleftLip = setRujukCleftLip;
  const [yaTidakSediaAdaStatusDenture, setYaTidakSediaAdaStatusDenture] =
    useState('');
  masterForm.yaTidakSediaAdaStatusDenture = yaTidakSediaAdaStatusDenture;
  masterForm.setYaTidakSediaAdaStatusDenture = setYaTidakSediaAdaStatusDenture;
  const [atasSediaAdaDenture, setAtasSediaAdaDenture] = useState(false);
  masterForm.atasSediaAdaDenture = atasSediaAdaDenture;
  masterForm.setAtasSediaAdaDenture = setAtasSediaAdaDenture;
  const [separaPenuhAtasSediaAdaDenture, setSeparaPenuhAtasSediaAdaDenture] =
    useState('');
  masterForm.separaPenuhAtasSediaAdaDenture = separaPenuhAtasSediaAdaDenture;
  masterForm.setSeparaPenuhAtasSediaAdaDenture =
    setSeparaPenuhAtasSediaAdaDenture;
  const [bawahSediaAdaDenture, setBawahSediaAdaDenture] = useState(false);
  masterForm.bawahSediaAdaDenture = bawahSediaAdaDenture;
  masterForm.setBawahSediaAdaDenture = setBawahSediaAdaDenture;
  const [separaPenuhBawahSediaAdaDenture, setSeparaPenuhBawahSediaAdaDenture] =
    useState('');
  masterForm.separaPenuhBawahSediaAdaDenture = separaPenuhBawahSediaAdaDenture;
  masterForm.setSeparaPenuhBawahSediaAdaDenture =
    setSeparaPenuhBawahSediaAdaDenture;
  const [yaTidakPerluStatusDenture, setYaTidakPerluStatusDenture] =
    useState('');
  masterForm.yaTidakPerluStatusDenture = yaTidakPerluStatusDenture;
  masterForm.setYaTidakPerluStatusDenture = setYaTidakPerluStatusDenture;
  const [atasPerluDenture, setAtasPerluDenture] = useState(false);
  masterForm.atasPerluDenture = atasPerluDenture;
  masterForm.setAtasPerluDenture = setAtasPerluDenture;
  const [separaPenuhAtasPerluDenture, setSeparaPenuhAtasPerluDenture] =
    useState('');
  masterForm.separaPenuhAtasPerluDenture = separaPenuhAtasPerluDenture;
  masterForm.setSeparaPenuhAtasPerluDenture = setSeparaPenuhAtasPerluDenture;
  const [bawahPerluDenture, setBawahPerluDenture] = useState(false);
  masterForm.bawahPerluDenture = bawahPerluDenture;
  masterForm.setBawahPerluDenture = setBawahPerluDenture;
  const [separaPenuhBawahPerluDenture, setSeparaPenuhBawahPerluDenture] =
    useState('');
  masterForm.separaPenuhBawahPerluDenture = separaPenuhBawahPerluDenture;
  masterForm.setSeparaPenuhBawahPerluDenture = setSeparaPenuhBawahPerluDenture;
  const [toothSurfaceLossTrauma, setToothSurfaceLossTrauma] = useState(false);
  masterForm.toothSurfaceLossTrauma = toothSurfaceLossTrauma;
  masterForm.setToothSurfaceLossTrauma = setToothSurfaceLossTrauma;
  const [kecederaanGigiAnteriorTrauma, setKecederaanGigiAnteriorTrauma] =
    useState(false);
  masterForm.kecederaanGigiAnteriorTrauma = kecederaanGigiAnteriorTrauma;
  masterForm.setKecederaanGigiAnteriorTrauma = setKecederaanGigiAnteriorTrauma;
  const [tisuLembutTrauma, setTisuLembutTrauma] = useState(false);
  masterForm.tisuLembutTrauma = tisuLembutTrauma;
  masterForm.setTisuLembutTrauma = setTisuLembutTrauma;
  const [tisuKerasTrauma, setTisuKerasTrauma] = useState(false);
  masterForm.tisuKerasTrauma = tisuKerasTrauma;
  masterForm.setTisuKerasTrauma = setTisuKerasTrauma;
  //pemeriksaan awal div 2
  const [kebersihanMulutOralHygiene, setKebersihanMulutOralHygiene] =
    useState('');
  masterForm.kebersihanMulutOralHygiene = kebersihanMulutOralHygiene;
  masterForm.setKebersihanMulutOralHygiene = setKebersihanMulutOralHygiene;
  const [skorBpeOralHygiene, setSkorBpeOralHygiene] = useState('');
  masterForm.skorBpeOralHygiene = skorBpeOralHygiene;
  masterForm.setSkorBpeOralHygiene = setSkorBpeOralHygiene;
  const [saringanKanserMulutOralHygiene, setSaringanKanserMulutOralHygiene] =
    useState(false);
  masterForm.saringanKanserMulutOralHygiene = saringanKanserMulutOralHygiene;
  masterForm.setSaringanKanserMulutOralHygiene =
    setSaringanKanserMulutOralHygiene;
  const [skorGisMulutOralHygiene, setSkorGisMulutOralHygiene] = useState('');
  masterForm.skorGisMulutOralHygiene = skorGisMulutOralHygiene;
  masterForm.setSkorGisMulutOralHygiene = setSkorGisMulutOralHygiene;
  const [dAdaGigiDesidus, setDAdaGigiDesidus] = useState('');
  masterForm.dAdaGigiDesidus = dAdaGigiDesidus;
  masterForm.setDAdaGigiDesidus = setDAdaGigiDesidus;
  const [mAdaGigiDesidus, setMAdaGigiDesidus] = useState('');
  masterForm.mAdaGigiDesidus = mAdaGigiDesidus;
  masterForm.setMAdaGigiDesidus = setMAdaGigiDesidus;
  const [fAdaGigiDesidus, setFAdaGigiDesidus] = useState('');
  masterForm.fAdaGigiDesidus = fAdaGigiDesidus;
  masterForm.setFAdaGigiDesidus = setFAdaGigiDesidus;
  const [eAdaGigiDesidus, setEAdaGigiDesidus] = useState('');
  masterForm.eAdaGigiDesidus = eAdaGigiDesidus;
  masterForm.setEAdaGigiDesidus = setEAdaGigiDesidus;
  const [xAdaGigiDesidus, setXAdaGigiDesidus] = useState('');
  masterForm.xAdaGigiDesidus = xAdaGigiDesidus;
  masterForm.setXAdaGigiDesidus = setXAdaGigiDesidus;
  const [dAdaGigiKekal, setDAdaGigiKekal] = useState('');
  masterForm.dAdaGigiKekal = dAdaGigiKekal;
  masterForm.setDAdaGigiKekal = setDAdaGigiKekal;
  const [mAdaGigiKekal, setMAdaGigiKekal] = useState('');
  masterForm.mAdaGigiKekal = mAdaGigiKekal;
  masterForm.setMAdaGigiKekal = setMAdaGigiKekal;
  const [fAdaGigiKekal, setFAdaGigiKekal] = useState('');
  masterForm.fAdaGigiKekal = fAdaGigiKekal;
  masterForm.setFAdaGigiKekal = setFAdaGigiKekal;
  const [eAdaGigiKekal, setEAdaGigiKekal] = useState('');
  masterForm.eAdaGigiKekal = eAdaGigiKekal;
  masterForm.setEAdaGigiKekal = setEAdaGigiKekal;
  const [xAdaGigiKekal, setXAdaGigiKekal] = useState('');
  masterForm.xAdaGigiKekal = xAdaGigiKekal;
  masterForm.setXAdaGigiKekal = setXAdaGigiKekal;
  const [jumlahFaktorRisiko, setJumlahFaktorRisiko] = useState('');
  masterForm.jumlahFaktorRisiko = jumlahFaktorRisiko;
  masterForm.setJumlahFaktorRisiko = setJumlahFaktorRisiko;
  //pemeriksaan awal div 3
  const [gicBilanganFsDibuat3TahunLepas, setGicBilanganFsDibuat3TahunLepas] =
    useState('');
  masterForm.gicBilanganFsDibuat3TahunLepas = gicBilanganFsDibuat3TahunLepas;
  masterForm.setGicBilanganFsDibuat3TahunLepas =
    setGicBilanganFsDibuat3TahunLepas;
  const [
    resinBilanganFsDibuat3TahunLepas,
    setResinBilanganFsDibuat3TahunLepas,
  ] = useState('');
  masterForm.resinBilanganFsDibuat3TahunLepas =
    resinBilanganFsDibuat3TahunLepas;
  masterForm.setResinBilanganFsDibuat3TahunLepas =
    setResinBilanganFsDibuat3TahunLepas;
  const [
    lainLainBilanganFsDibuat3TahunLepas,
    setLainLainBilanganFsDibuat3TahunLepas,
  ] = useState('');
  masterForm.lainLainBilanganFsDibuat3TahunLepas =
    lainLainBilanganFsDibuat3TahunLepas;
  masterForm.setLainLainBilanganFsDibuat3TahunLepas =
    setLainLainBilanganFsDibuat3TahunLepas;
  const [
    dBilanganFsDibuat3TahunLepasTerjadi,
    setDBilanganFsDibuat3TahunLepasTerjadi,
  ] = useState('');
  masterForm.dBilanganFsDibuat3TahunLepasTerjadi =
    dBilanganFsDibuat3TahunLepasTerjadi;
  masterForm.setDBilanganFsDibuat3TahunLepasTerjadi =
    setDBilanganFsDibuat3TahunLepasTerjadi;
  const [
    mBilanganFsDibuat3TahunLepasTerjadi,
    setMBilanganFsDibuat3TahunLepasTerjadi,
  ] = useState('');
  masterForm.mBilanganFsDibuat3TahunLepasTerjadi =
    mBilanganFsDibuat3TahunLepasTerjadi;
  masterForm.setMBilanganFsDibuat3TahunLepasTerjadi =
    setMBilanganFsDibuat3TahunLepasTerjadi;
  const [
    fBilanganFsDibuat3TahunLepasTerjadi,
    setFBilanganFsDibuat3TahunLepasTerjadi,
  ] = useState('');
  masterForm.fBilanganFsDibuat3TahunLepasTerjadi =
    fBilanganFsDibuat3TahunLepasTerjadi;
  masterForm.setFBilanganFsDibuat3TahunLepasTerjadi =
    setFBilanganFsDibuat3TahunLepasTerjadi;
  const [
    eBilanganFsDibuat3TahunLepasTerjadi,
    setEBilanganFsDibuat3TahunLepasTerjadi,
  ] = useState('');
  masterForm.eBilanganFsDibuat3TahunLepasTerjadi =
    eBilanganFsDibuat3TahunLepasTerjadi;
  masterForm.setEBilanganFsDibuat3TahunLepasTerjadi =
    setEBilanganFsDibuat3TahunLepasTerjadi;
  const [
    xBilanganFsDibuat3TahunLepasTerjadi,
    setXBilanganFsDibuat3TahunLepasTerjadi,
  ] = useState('');
  masterForm.xBilanganFsDibuat3TahunLepasTerjadi =
    xBilanganFsDibuat3TahunLepasTerjadi;
  masterForm.setXBilanganFsDibuat3TahunLepasTerjadi =
    setXBilanganFsDibuat3TahunLepasTerjadi;
  const [classID, setClassID] = useState('');
  masterForm.classID = classID;
  masterForm.setClassID = setClassID;
  const [classIID, setClassIID] = useState('');
  masterForm.classIID = classIID;
  masterForm.setClassIID = setClassIID;
  const [classIF, setClassIF] = useState('');
  masterForm.classIF = classIF;
  masterForm.setClassIF = setClassIF;
  const [classIIF, setClassIIF] = useState('');
  masterForm.classIIF = classIIF;
  masterForm.setClassIIF = setClassIIF;
  //perlu dibuat
  const [baruJumlahGigiKekalPerluFs, setBaruJumlahGigiKekalPerluFs] =
    useState('');
  masterForm.baruJumlahGigiKekalPerluFs = baruJumlahGigiKekalPerluFs;
  masterForm.setBaruJumlahGigiKekalPerluFs = setBaruJumlahGigiKekalPerluFs;
  const [semulaJumlahGigiKekalPerluFs, setSemulaJumlahGigiKekalPerluFs] =
    useState('');
  masterForm.semulaJumlahGigiKekalPerluFs = semulaJumlahGigiKekalPerluFs;
  masterForm.setSemulaJumlahGigiKekalPerluFs = setSemulaJumlahGigiKekalPerluFs;
  const [jumlahGigiFsGagal, setJumlahGigiFsGagal] = useState('');
  masterForm.jumlahGigiFsGagal = jumlahGigiFsGagal;
  masterForm.setJumlahGigiFsGagal = setJumlahGigiFsGagal;
  const [baruJumlahGigiKekalPerluFv, setBaruJumlahGigiKekalPerluFv] =
    useState('');
  masterForm.baruJumlahGigiKekalPerluFv = baruJumlahGigiKekalPerluFv;
  masterForm.setBaruJumlahGigiKekalPerluFv = setBaruJumlahGigiKekalPerluFv;
  const [semulaJumlahGigiKekalPerluFv, setSemulaJumlahGigiKekalPerluFv] =
    useState('');
  masterForm.semulaJumlahGigiKekalPerluFv = semulaJumlahGigiKekalPerluFv;
  masterForm.setSemulaJumlahGigiKekalPerluFv = setSemulaJumlahGigiKekalPerluFv;
  const [
    baruJumlahGigiKekalPerluPrrJenis1,
    setBaruJumlahGigiKekalPerluPrrJenis1,
  ] = useState('');
  masterForm.baruJumlahGigiKekalPerluPrrJenis1 =
    baruJumlahGigiKekalPerluPrrJenis1;
  masterForm.setBaruJumlahGigiKekalPerluPrrJenis1 =
    setBaruJumlahGigiKekalPerluPrrJenis1;
  const [
    semulaJumlahGigiKekalPerluPrrJenis1,
    setSemulaJumlahGigiKekalPerluPrrJenis1,
  ] = useState('');
  masterForm.semulaJumlahGigiKekalPerluPrrJenis1 =
    semulaJumlahGigiKekalPerluPrrJenis1;
  masterForm.setSemulaJumlahGigiKekalPerluPrrJenis1 =
    setSemulaJumlahGigiKekalPerluPrrJenis1;
  const [
    yaTidakSilverDiamineFluoridePerluSapuan,
    setYaTidakSilverDiamineFluoridePerluSapuan,
  ] = useState('');
  masterForm.yaTidakSilverDiamineFluoridePerluSapuan =
    yaTidakSilverDiamineFluoridePerluSapuan;
  masterForm.setYaTidakSilverDiamineFluoridePerluSapuan =
    setYaTidakSilverDiamineFluoridePerluSapuan;
  const [
    baruGDAnteriorSewarnaJumlahTampalanDiperlukan,
    setBaruGDAnteriorSewarnaJumlahTampalanDiperlukan,
  ] = useState('');
  masterForm.baruGDAnteriorSewarnaJumlahTampalanDiperlukan =
    baruGDAnteriorSewarnaJumlahTampalanDiperlukan;
  masterForm.setBaruGDAnteriorSewarnaJumlahTampalanDiperlukan =
    setBaruGDAnteriorSewarnaJumlahTampalanDiperlukan;
  const [
    semulaGDAnteriorSewarnaJumlahTampalanDiperlukan,
    setSemulaGDAnteriorSewarnaJumlahTampalanDiperlukan,
  ] = useState('');
  masterForm.semulaGDAnteriorSewarnaJumlahTampalanDiperlukan =
    semulaGDAnteriorSewarnaJumlahTampalanDiperlukan;
  masterForm.setSemulaGDAnteriorSewarnaJumlahTampalanDiperlukan =
    setSemulaGDAnteriorSewarnaJumlahTampalanDiperlukan;
  const [
    baruGKAnteriorSewarnaJumlahTampalanDiperlukan,
    setBaruGKAnteriorSewarnaJumlahTampalanDiperlukan,
  ] = useState('');
  masterForm.baruGKAnteriorSewarnaJumlahTampalanDiperlukan =
    baruGKAnteriorSewarnaJumlahTampalanDiperlukan;
  masterForm.setBaruGKAnteriorSewarnaJumlahTampalanDiperlukan =
    setBaruGKAnteriorSewarnaJumlahTampalanDiperlukan;
  const [
    semulaGKAnteriorSewarnaJumlahTampalanDiperlukan,
    setSemulaGKAnteriorSewarnaJumlahTampalanDiperlukan,
  ] = useState('');
  masterForm.semulaGKAnteriorSewarnaJumlahTampalanDiperlukan =
    semulaGKAnteriorSewarnaJumlahTampalanDiperlukan;
  masterForm.setSemulaGKAnteriorSewarnaJumlahTampalanDiperlukan =
    setSemulaGKAnteriorSewarnaJumlahTampalanDiperlukan;
  const [
    baruGDPosteriorSewarnaJumlahTampalanDiperlukan,
    setBaruGDPosteriorSewarnaJumlahTampalanDiperlukan,
  ] = useState('');
  masterForm.baruGDPosteriorSewarnaJumlahTampalanDiperlukan =
    baruGDPosteriorSewarnaJumlahTampalanDiperlukan;
  masterForm.setBaruGDPosteriorSewarnaJumlahTampalanDiperlukan =
    setBaruGDPosteriorSewarnaJumlahTampalanDiperlukan;
  const [
    semulaGDPosteriorSewarnaJumlahTampalanDiperlukan,
    setSemulaGDPosteriorSewarnaJumlahTampalanDiperlukan,
  ] = useState('');
  masterForm.semulaGDPosteriorSewarnaJumlahTampalanDiperlukan =
    semulaGDPosteriorSewarnaJumlahTampalanDiperlukan;
  masterForm.setSemulaGDPosteriorSewarnaJumlahTampalanDiperlukan =
    setSemulaGDPosteriorSewarnaJumlahTampalanDiperlukan;
  const [
    baruGKPosteriorSewarnaJumlahTampalanDiperlukan,
    setBaruGKPosteriorSewarnaJumlahTampalanDiperlukan,
  ] = useState('');
  masterForm.baruGKPosteriorSewarnaJumlahTampalanDiperlukan =
    baruGKPosteriorSewarnaJumlahTampalanDiperlukan;
  masterForm.setBaruGKPosteriorSewarnaJumlahTampalanDiperlukan =
    setBaruGKPosteriorSewarnaJumlahTampalanDiperlukan;
  const [
    semulaGKPosteriorSewarnaJumlahTampalanDiperlukan,
    setSemulaGKPosteriorSewarnaJumlahTampalanDiperlukan,
  ] = useState('');
  masterForm.semulaGKPosteriorSewarnaJumlahTampalanDiperlukan =
    semulaGKPosteriorSewarnaJumlahTampalanDiperlukan;
  masterForm.setSemulaGKPosteriorSewarnaJumlahTampalanDiperlukan =
    setSemulaGKPosteriorSewarnaJumlahTampalanDiperlukan;
  const [
    baruGDPosteriorAmalgamJumlahTampalanDiperlukan,
    setBaruGDPosteriorAmalgamJumlahTampalanDiperlukan,
  ] = useState('');
  masterForm.baruGDPosteriorAmalgamJumlahTampalanDiperlukan =
    baruGDPosteriorAmalgamJumlahTampalanDiperlukan;
  masterForm.setBaruGDPosteriorAmalgamJumlahTampalanDiperlukan =
    setBaruGDPosteriorAmalgamJumlahTampalanDiperlukan;
  const [
    semulaGDPosteriorAmalgamJumlahTampalanDiperlukan,
    setSemulaGDPosteriorAmalgamJumlahTampalanDiperlukan,
  ] = useState('');
  masterForm.semulaGDPosteriorAmalgamJumlahTampalanDiperlukan =
    semulaGDPosteriorAmalgamJumlahTampalanDiperlukan;
  masterForm.setSemulaGDPosteriorAmalgamJumlahTampalanDiperlukan =
    setSemulaGDPosteriorAmalgamJumlahTampalanDiperlukan;
  const [
    baruGKPosteriorAmalgamJumlahTampalanDiperlukan,
    setBaruGKPosteriorAmalgamJumlahTampalanDiperlukan,
  ] = useState('');
  masterForm.baruGKPosteriorAmalgamJumlahTampalanDiperlukan =
    baruGKPosteriorAmalgamJumlahTampalanDiperlukan;
  masterForm.setBaruGKPosteriorAmalgamJumlahTampalanDiperlukan =
    setBaruGKPosteriorAmalgamJumlahTampalanDiperlukan;
  const [
    semulaGKPosteriorAmalgamJumlahTampalanDiperlukan,
    setSemulaGKPosteriorAmalgamJumlahTampalanDiperlukan,
  ] = useState('');
  masterForm.semulaGKPosteriorAmalgamJumlahTampalanDiperlukan =
    semulaGKPosteriorAmalgamJumlahTampalanDiperlukan;
  masterForm.setSemulaGKPosteriorAmalgamJumlahTampalanDiperlukan =
    setSemulaGKPosteriorAmalgamJumlahTampalanDiperlukan;
  // penyata akhir 1
  const [baruJumlahGigiKekalDibuatFs, setBaruJumlahGigiKekalDibuatFs] =
    useState('');
  masterForm.baruJumlahGigiKekalDibuatFs = baruJumlahGigiKekalDibuatFs;
  masterForm.setBaruJumlahGigiKekalDibuatFs = setBaruJumlahGigiKekalDibuatFs;
  const [semulaJumlahGigiKekalDibuatFs, setSemulaJumlahGigiKekalDibuatFs] =
    useState('');
  masterForm.semulaJumlahGigiKekalDibuatFs = semulaJumlahGigiKekalDibuatFs;
  masterForm.setSemulaJumlahGigiKekalDibuatFs =
    setSemulaJumlahGigiKekalDibuatFs;
  const [baruJumlahGigiKekalDiberiFv, setBaruJumlahGigiKekalDiberiFv] =
    useState('');
  masterForm.baruJumlahGigiKekalDiberiFv = baruJumlahGigiKekalDiberiFv;
  masterForm.setBaruJumlahGigiKekalDiberiFv = setBaruJumlahGigiKekalDiberiFv;
  const [semulaJumlahGigiKekalDiberiFv, setSemulaJumlahGigiKekalDiberiFv] =
    useState('');
  masterForm.semulaJumlahGigiKekalDiberiFv = semulaJumlahGigiKekalDiberiFv;
  masterForm.setSemulaJumlahGigiKekalDiberiFv =
    setSemulaJumlahGigiKekalDiberiFv;
  const [
    baruJumlahGigiKekalDiberiPrrJenis1,
    setBaruJumlahGigiKekalDiberiPrrJenis1,
  ] = useState('');
  masterForm.baruJumlahGigiKekalDiberiPrrJenis1 =
    baruJumlahGigiKekalDiberiPrrJenis1;
  masterForm.setBaruJumlahGigiKekalDiberiPrrJenis1 =
    setBaruJumlahGigiKekalDiberiPrrJenis1;
  const [
    semulaJumlahGigiKekalDiberiPrrJenis1,
    setSemulaJumlahGigiKekalDiberiPrrJenis1,
  ] = useState('');
  masterForm.semulaJumlahGigiKekalDiberiPrrJenis1 =
    semulaJumlahGigiKekalDiberiPrrJenis1;
  masterForm.setSemulaJumlahGigiKekalDiberiPrrJenis1 =
    setSemulaJumlahGigiKekalDiberiPrrJenis1;
  const [baruJumlahGigiYangDiberiSdf, setBaruJumlahGigiYangDiberiSdf] =
    useState('');
  masterForm.baruJumlahGigiYangDiberiSdf = baruJumlahGigiYangDiberiSdf;
  masterForm.setBaruJumlahGigiYangDiberiSdf = setBaruJumlahGigiYangDiberiSdf;
  const [semulaJumlahGigiYangDiberiSdf, setSemulaJumlahGigiYangDiberiSdf] =
    useState('');
  masterForm.semulaJumlahGigiYangDiberiSdf = semulaJumlahGigiYangDiberiSdf;
  masterForm.setSemulaJumlahGigiYangDiberiSdf =
    setSemulaJumlahGigiYangDiberiSdf;
  const [
    gdBaruAnteriorSewarnaJumlahTampalanDibuat,
    setGdBaruAnteriorSewarnaJumlahTampalanDibuat,
  ] = useState('');
  masterForm.gdBaruAnteriorSewarnaJumlahTampalanDibuat =
    gdBaruAnteriorSewarnaJumlahTampalanDibuat;
  masterForm.setGdBaruAnteriorSewarnaJumlahTampalanDibuat =
    setGdBaruAnteriorSewarnaJumlahTampalanDibuat;
  const [
    gdSemulaAnteriorSewarnaJumlahTampalanDibuat,
    setGdSemulaAnteriorSewarnaJumlahTampalanDibuat,
  ] = useState('');
  masterForm.gdSemulaAnteriorSewarnaJumlahTampalanDibuat =
    gdSemulaAnteriorSewarnaJumlahTampalanDibuat;
  masterForm.setGdSemulaAnteriorSewarnaJumlahTampalanDibuat =
    setGdSemulaAnteriorSewarnaJumlahTampalanDibuat;
  const [
    gkBaruAnteriorSewarnaJumlahTampalanDibuat,
    setGkBaruAnteriorSewarnaJumlahTampalanDibuat,
  ] = useState('');
  masterForm.gkBaruAnteriorSewarnaJumlahTampalanDibuat =
    gkBaruAnteriorSewarnaJumlahTampalanDibuat;
  masterForm.setGkBaruAnteriorSewarnaJumlahTampalanDibuat =
    setGkBaruAnteriorSewarnaJumlahTampalanDibuat;
  const [
    gkSemulaAnteriorSewarnaJumlahTampalanDibuat,
    setGkSemulaAnteriorSewarnaJumlahTampalanDibuat,
  ] = useState('');
  masterForm.gkSemulaAnteriorSewarnaJumlahTampalanDibuat =
    gkSemulaAnteriorSewarnaJumlahTampalanDibuat;
  masterForm.setGkSemulaAnteriorSewarnaJumlahTampalanDibuat =
    setGkSemulaAnteriorSewarnaJumlahTampalanDibuat;
  const [
    gdBaruPosteriorSewarnaJumlahTampalanDibuat,
    setGdBaruPosteriorSewarnaJumlahTampalanDibuat,
  ] = useState('');
  masterForm.gdBaruPosteriorSewarnaJumlahTampalanDibuat =
    gdBaruPosteriorSewarnaJumlahTampalanDibuat;
  masterForm.setGdBaruPosteriorSewarnaJumlahTampalanDibuat =
    setGdBaruPosteriorSewarnaJumlahTampalanDibuat;
  const [
    gdSemulaPosteriorSewarnaJumlahTampalanDibuat,
    setGdSemulaPosteriorSewarnaJumlahTampalanDibuat,
  ] = useState('');
  masterForm.gdSemulaPosteriorSewarnaJumlahTampalanDibuat =
    gdSemulaPosteriorSewarnaJumlahTampalanDibuat;
  masterForm.setGdSemulaPosteriorSewarnaJumlahTampalanDibuat =
    setGdSemulaPosteriorSewarnaJumlahTampalanDibuat;
  const [
    gkBaruPosteriorSewarnaJumlahTampalanDibuat,
    setGkBaruPosteriorSewarnaJumlahTampalanDibuat,
  ] = useState('');
  masterForm.gkBaruPosteriorSewarnaJumlahTampalanDibuat =
    gkBaruPosteriorSewarnaJumlahTampalanDibuat;
  masterForm.setGkBaruPosteriorSewarnaJumlahTampalanDibuat =
    setGkBaruPosteriorSewarnaJumlahTampalanDibuat;
  const [
    gkSemulaPosteriorSewarnaJumlahTampalanDibuat,
    setGkSemulaPosteriorSewarnaJumlahTampalanDibuat,
  ] = useState('');
  masterForm.gkSemulaPosteriorSewarnaJumlahTampalanDibuat =
    gkSemulaPosteriorSewarnaJumlahTampalanDibuat;
  masterForm.setGkSemulaPosteriorSewarnaJumlahTampalanDibuat =
    setGkSemulaPosteriorSewarnaJumlahTampalanDibuat;
  const [
    gdBaruPosteriorAmalgamJumlahTampalanDibuat,
    setGdBaruPosteriorAmalgamJumlahTampalanDibuat,
  ] = useState('');
  masterForm.gdBaruPosteriorAmalgamJumlahTampalanDibuat =
    gdBaruPosteriorAmalgamJumlahTampalanDibuat;
  masterForm.setGdBaruPosteriorAmalgamJumlahTampalanDibuat =
    setGdBaruPosteriorAmalgamJumlahTampalanDibuat;
  const [
    gdSemulaPosteriorAmalgamJumlahTampalanDibuat,
    setGdSemulaPosteriorAmalgamJumlahTampalanDibuat,
  ] = useState('');
  masterForm.gdSemulaPosteriorAmalgamJumlahTampalanDibuat =
    gdSemulaPosteriorAmalgamJumlahTampalanDibuat;
  masterForm.setGdSemulaPosteriorAmalgamJumlahTampalanDibuat =
    setGdSemulaPosteriorAmalgamJumlahTampalanDibuat;
  const [
    gkBaruPosteriorAmalgamJumlahTampalanDibuat,
    setGkBaruPosteriorAmalgamJumlahTampalanDibuat,
  ] = useState('');
  masterForm.gkBaruPosteriorAmalgamJumlahTampalanDibuat =
    gkBaruPosteriorAmalgamJumlahTampalanDibuat;
  masterForm.setGkBaruPosteriorAmalgamJumlahTampalanDibuat =
    setGkBaruPosteriorAmalgamJumlahTampalanDibuat;
  const [
    gkSemulaPosteriorAmalgamJumlahTampalanDibuat,
    setGkSemulaPosteriorAmalgamJumlahTampalanDibuat,
  ] = useState('');
  masterForm.gkSemulaPosteriorAmalgamJumlahTampalanDibuat =
    gkSemulaPosteriorAmalgamJumlahTampalanDibuat;
  masterForm.setGkSemulaPosteriorAmalgamJumlahTampalanDibuat =
    setGkSemulaPosteriorAmalgamJumlahTampalanDibuat;

  useEffect(() => {
    const fetchSinglePersonSekolah = async () => {
      try {
        const { data } = await axios.get(`/api/v1/sekolah/${personSekolahId}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setSinglePersonSekolah(data.singlePersonSekolah);
        // map pendaftaran
        setKpBergerak(data.singlePersonSekolah.kpBergerak);
        setPasukanPergigianBergerak(
          data.singlePersonSekolah.pasukanPergigianBergerak
        );
        setPlateNo(data.singlePersonSekolah.plateNo);
        setBaruUlanganKedatanganPendaftaran(
          data.singlePersonSekolah.baruUlanganKedatanganPendaftaran
        );
        setEngganKedatanganPendaftaran(
          data.singlePersonSekolah.engganKedatanganPendaftaran
        );
        setTidakHadirKedatanganPendaftaran(
          data.singlePersonSekolah.tidakHadirKedatanganPendaftaran
        );
        setAdaTiadaPemeriksaanPendaftaran(
          data.singlePersonSekolah.adaTiadaPemeriksaanPendaftaran
        );
        setTinggiRendahRisikoSekolahPendaftaran(
          data.singlePersonSekolah.tinggiRendahRisikoSekolahPendaftaran
        );
        // map pemeriksaan awal div 1
        setAdaCleftLip(data.singlePersonSekolah.adaCleftLip);
        setRujukCleftLip(data.singlePersonSekolah.rujukCleftLip);
        setYaTidakSediaAdaStatusDenture(
          data.singlePersonSekolah.yaTidakSediaAdaStatusDenture
        );
        setAtasSediaAdaDenture(data.singlePersonSekolah.atasSediaAdaDenture);
        setSeparaPenuhAtasSediaAdaDenture(
          data.singlePersonSekolah.separaPenuhAtasSediaAdaDenture
        );
        setBawahSediaAdaDenture(data.singlePersonSekolah.bawahSediaAdaDenture);
        setSeparaPenuhBawahSediaAdaDenture(
          data.singlePersonSekolah.separaPenuhBawahSediaAdaDenture
        );
        setYaTidakPerluStatusDenture(
          data.singlePersonSekolah.yaTidakPerluStatusDenture
        );
        setAtasPerluDenture(data.singlePersonSekolah.atasPerluDenture);
        setSeparaPenuhAtasPerluDenture(
          data.singlePersonSekolah.separaPenuhAtasPerluDenture
        );
        setBawahPerluDenture(data.singlePersonSekolah.bawahPerluDenture);
        setSeparaPenuhBawahPerluDenture(
          data.singlePersonSekolah.separaPenuhBawahPerluDenture
        );
        setToothSurfaceLossTrauma(
          data.singlePersonSekolah.toothSurfaceLossTrauma
        );
        setKecederaanGigiAnteriorTrauma(
          data.singlePersonSekolah.kecederaanGigiAnteriorTrauma
        );
        setTisuLembutTrauma(data.singlePersonSekolah.tisuLembutTrauma);
        setTisuKerasTrauma(data.singlePersonSekolah.tisuKerasTrauma);
        // map pemeriksaan awal div 2
        setKebersihanMulutOralHygiene(
          data.singlePersonSekolah.kebersihanMulutOralHygiene
        );
        setSkorBpeOralHygiene(data.singlePersonSekolah.skorBpeOralHygiene);
        setSaringanKanserMulutOralHygiene(
          data.singlePersonSekolah.saringanKanserMulutOralHygiene
        );
        setSkorGisMulutOralHygiene(
          data.singlePersonSekolah.skorGisMulutOralHygiene
        );
        setDAdaGigiDesidus(data.singlePersonSekolah.dAdaGigiDesidus);
        setMAdaGigiDesidus(data.singlePersonSekolah.mAdaGigiDesidus);
        setFAdaGigiDesidus(data.singlePersonSekolah.fAdaGigiDesidus);
        setEAdaGigiDesidus(data.singlePersonSekolah.eAdaGigiDesidus);
        setXAdaGigiDesidus(data.singlePersonSekolah.xAdaGigiDesidus);
        setDAdaGigiKekal(data.singlePersonSekolah.dAdaGigiKekal);
        setMAdaGigiKekal(data.singlePersonSekolah.mAdaGigiKekal);
        setFAdaGigiKekal(data.singlePersonSekolah.fAdaGigiKekal);
        setEAdaGigiKekal(data.singlePersonSekolah.eAdaGigiKekal);
        setXAdaGigiKekal(data.singlePersonSekolah.xAdaGigiKekal);
        setJumlahFaktorRisiko(data.singlePersonSekolah.jumlahFaktorRisiko);
        // map pemeriksaan awal div 3
        setGicBilanganFsDibuat3TahunLepas(
          data.singlePersonSekolah.gicBilanganFsDibuat3TahunLepas
        );
        setResinBilanganFsDibuat3TahunLepas(
          data.singlePersonSekolah.resinBilanganFsDibuat3TahunLepas
        );
        setLainLainBilanganFsDibuat3TahunLepas(
          data.singlePersonSekolah.lainLainBilanganFsDibuat3TahunLepas
        );
        setDBilanganFsDibuat3TahunLepasTerjadi(
          data.singlePersonSekolah.dBilanganFsDibuat3TahunLepasTerjadi
        );
        setMBilanganFsDibuat3TahunLepasTerjadi(
          data.singlePersonSekolah.mBilanganFsDibuat3TahunLepasTerjadi
        );
        setFBilanganFsDibuat3TahunLepasTerjadi(
          data.singlePersonSekolah.fBilanganFsDibuat3TahunLepasTerjadi
        );
        setEBilanganFsDibuat3TahunLepasTerjadi(
          data.singlePersonSekolah.eBilanganFsDibuat3TahunLepasTerjadi
        );
        setXBilanganFsDibuat3TahunLepasTerjadi(
          data.singlePersonSekolah.xBilanganFsDibuat3TahunLepasTerjadi
        );
        setClassID(data.singlePersonSekolah.classID);
        setClassIID(data.singlePersonSekolah.classIID);
        setClassIF(data.singlePersonSekolah.classIF);
        setClassIIF(data.singlePersonSekolah.classIIF);
        // map perlu dibuat
        setBaruJumlahGigiKekalPerluFs(
          data.singlePersonSekolah.baruJumlahGigiKekalPerluFs
        );
        setSemulaJumlahGigiKekalPerluFs(
          data.singlePersonSekolah.semulaJumlahGigiKekalPerluFs
        );
        setJumlahGigiFsGagal(data.singlePersonSekolah.jumlahGigiFsGagal);
        setBaruJumlahGigiKekalPerluFv(
          data.singlePersonSekolah.baruJumlahGigiKekalPerluFv
        );
        setSemulaJumlahGigiKekalPerluFv(
          data.singlePersonSekolah.semulaJumlahGigiKekalPerluFv
        );
        setBaruJumlahGigiKekalPerluPrrJenis1(
          data.singlePersonSekolah.baruJumlahGigiKekalPerluPrrJenis1
        );
        setSemulaJumlahGigiKekalPerluPrrJenis1(
          data.singlePersonSekolah.semulaJumlahGigiKekalPerluPrrJenis1
        );
        setYaTidakSilverDiamineFluoridePerluSapuan(
          data.singlePersonSekolah.yaTidakSilverDiamineFluoridePerluSapuan
        );
        setBaruGDAnteriorSewarnaJumlahTampalanDiperlukan(
          data.singlePersonSekolah.baruGDAnteriorSewarnaJumlahTampalanDiperlukan
        );
        setSemulaGDAnteriorSewarnaJumlahTampalanDiperlukan(
          data.singlePersonSekolah
            .semulaGDAnteriorSewarnaJumlahTampalanDiperlukan
        );
        setBaruGKAnteriorSewarnaJumlahTampalanDiperlukan(
          data.singlePersonSekolah.baruGKAnteriorSewarnaJumlahTampalanDiperlukan
        );
        setSemulaGKAnteriorSewarnaJumlahTampalanDiperlukan(
          data.singlePersonSekolah
            .semulaGKAnteriorSewarnaJumlahTampalanDiperlukan
        );
        setBaruGDPosteriorSewarnaJumlahTampalanDiperlukan(
          data.singlePersonSekolah
            .baruGDPosteriorSewarnaJumlahTampalanDiperlukan
        );
        setSemulaGDPosteriorSewarnaJumlahTampalanDiperlukan(
          data.singlePersonSekolah
            .semulaGDPosteriorSewarnaJumlahTampalanDiperlukan
        );
        setBaruGKPosteriorSewarnaJumlahTampalanDiperlukan(
          data.singlePersonSekolah
            .baruGKPosteriorSewarnaJumlahTampalanDiperlukan
        );
        setSemulaGKPosteriorSewarnaJumlahTampalanDiperlukan(
          data.singlePersonSekolah
            .semulaGKPosteriorSewarnaJumlahTampalanDiperlukan
        );
        setBaruGDPosteriorAmalgamJumlahTampalanDiperlukan(
          data.singlePersonSekolah
            .baruGDPosteriorAmalgamJumlahTampalanDiperlukan
        );
        setSemulaGDPosteriorAmalgamJumlahTampalanDiperlukan(
          data.singlePersonSekolah
            .semulaGDPosteriorAmalgamJumlahTampalanDiperlukan
        );
        setBaruGKPosteriorAmalgamJumlahTampalanDiperlukan(
          data.singlePersonSekolah
            .baruGKPosteriorAmalgamJumlahTampalanDiperlukan
        );
        setSemulaGKPosteriorAmalgamJumlahTampalanDiperlukan(
          data.singlePersonSekolah
            .semulaGKPosteriorAmalgamJumlahTampalanDiperlukan
        );
        // map penyata akhir 1
        setBaruJumlahGigiKekalDibuatFs(
          data.singlePersonSekolah.baruJumlahGigiKekalDibuatFs
        );
        setSemulaJumlahGigiKekalDibuatFs(
          data.singlePersonSekolah.semulaJumlahGigiKekalDibuatFs
        );
        setBaruJumlahGigiKekalDiberiFv(
          data.singlePersonSekolah.baruJumlahGigiKekalDiberiFv
        );
        setSemulaJumlahGigiKekalDiberiFv(
          data.singlePersonSekolah.semulaJumlahGigiKekalDiberiFv
        );
        setBaruJumlahGigiKekalDiberiPrrJenis1(
          data.singlePersonSekolah.baruJumlahGigiKekalDiberiPrrJenis1
        );
        setSemulaJumlahGigiKekalDiberiPrrJenis1(
          data.singlePersonSekolah.semulaJumlahGigiKekalDiberiPrrJenis1
        );
        setBaruJumlahGigiYangDiberiSdf(
          data.singlePersonSekolah.baruJumlahGigiYangDiberiSdf
        );
        setSemulaJumlahGigiYangDiberiSdf(
          data.singlePersonSekolah.semulaJumlahGigiYangDiberiSdf
        );
        setGdBaruAnteriorSewarnaJumlahTampalanDibuat(
          data.singlePersonSekolah.gdBaruAnteriorSewarnaJumlahTampalanDibuat
        );
        setGdSemulaAnteriorSewarnaJumlahTampalanDibuat(
          data.singlePersonSekolah.gdSemulaAnteriorSewarnaJumlahTampalanDibuat
        );
        setGkBaruAnteriorSewarnaJumlahTampalanDibuat(
          data.singlePersonSekolah.gkBaruAnteriorSewarnaJumlahTampalanDibuat
        );
        setGkSemulaAnteriorSewarnaJumlahTampalanDibuat(
          data.singlePersonSekolah.gkSemulaAnteriorSewarnaJumlahTampalanDibuat
        );
        setGdBaruPosteriorSewarnaJumlahTampalanDibuat(
          data.singlePersonSekolah.gdBaruPosteriorSewarnaJumlahTampalanDibuat
        );
        setGdSemulaPosteriorSewarnaJumlahTampalanDibuat(
          data.singlePersonSekolah.gdSemulaPosteriorSewarnaJumlahTampalanDibuat
        );
        setGkBaruPosteriorSewarnaJumlahTampalanDibuat(
          data.singlePersonSekolah.gkBaruPosteriorSewarnaJumlahTampalanDibuat
        );
        setGkSemulaPosteriorSewarnaJumlahTampalanDibuat(
          data.singlePersonSekolah.gkSemulaPosteriorSewarnaJumlahTampalanDibuat
        );
        setGdBaruPosteriorAmalgamJumlahTampalanDibuat(
          data.singlePersonSekolah.gdBaruPosteriorAmalgamJumlahTampalanDibuat
        );
        setGdSemulaPosteriorAmalgamJumlahTampalanDibuat(
          data.singlePersonSekolah.gdSemulaPosteriorAmalgamJumlahTampalanDibuat
        );
        setGkBaruPosteriorAmalgamJumlahTampalanDibuat(
          data.singlePersonSekolah.gkBaruPosteriorAmalgamJumlahTampalanDibuat
        );
        setGkSemulaPosteriorAmalgamJumlahTampalanDibuat(
          data.singlePersonSekolah.gkSemulaPosteriorAmalgamJumlahTampalanDibuat
        );
      } catch (error) {
        console.log(error.response.data.msg);
      }
    };
    fetchSinglePersonSekolah();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `/api/v1/sekolah/${personSekolahId}`,
        {
          createdByUsername: masterForm.createdByUsername,
          // pendaftaran
          kpBergerak,
          pasukanPergigianBergerak,
          plateNo,
          baruUlanganKedatanganPendaftaran,
          engganKedatanganPendaftaran,
          tidakHadirKedatanganPendaftaran,
          adaTiadaPemeriksaanPendaftaran,
          tinggiRendahRisikoSekolahPendaftaran,
          // pemeriksaan awal
          adaCleftLip,
          rujukCleftLip,
          yaTidakSediaAdaStatusDenture,
          atasSediaAdaDenture,
          separaPenuhAtasSediaAdaDenture,
          bawahSediaAdaDenture,
          separaPenuhBawahSediaAdaDenture,
          yaTidakPerluStatusDenture,
          atasPerluDenture,
          separaPenuhAtasPerluDenture,
          bawahPerluDenture,
          separaPenuhBawahPerluDenture,
          toothSurfaceLossTrauma,
          kecederaanGigiAnteriorTrauma,
          tisuLembutTrauma,
          tisuKerasTrauma,
          // map pemeriksaan awal div 2
          kebersihanMulutOralHygiene,
          skorBpeOralHygiene,
          saringanKanserMulutOralHygiene,
          skorGisMulutOralHygiene,
          dAdaGigiDesidus,
          mAdaGigiDesidus,
          fAdaGigiDesidus,
          eAdaGigiDesidus,
          xAdaGigiDesidus,
          dAdaGigiKekal,
          mAdaGigiKekal,
          fAdaGigiKekal,
          eAdaGigiKekal,
          xAdaGigiKekal,
          jumlahFaktorRisiko,
          // map pemeriksaan awal div 3
          gicBilanganFsDibuat3TahunLepas,
          resinBilanganFsDibuat3TahunLepas,
          lainLainBilanganFsDibuat3TahunLepas,
          dBilanganFsDibuat3TahunLepasTerjadi,
          mBilanganFsDibuat3TahunLepasTerjadi,
          fBilanganFsDibuat3TahunLepasTerjadi,
          eBilanganFsDibuat3TahunLepasTerjadi,
          xBilanganFsDibuat3TahunLepasTerjadi,
          classID,
          classIID,
          classIF,
          classIIF,
          // map perlu dibuat
          baruJumlahGigiKekalPerluFs,
          semulaJumlahGigiKekalPerluFs,
          jumlahGigiFsGagal,
          baruJumlahGigiKekalPerluFv,
          semulaJumlahGigiKekalPerluFv,
          baruJumlahGigiKekalPerluPrrJenis1,
          semulaJumlahGigiKekalPerluPrrJenis1,
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
          // map penyata akhir 1
          baruJumlahGigiKekalDibuatFs,
          semulaJumlahGigiKekalDibuatFs,
          baruJumlahGigiKekalDiberiFv,
          semulaJumlahGigiKekalDiberiFv,
          baruJumlahGigiKekalDiberiPrrJenis1,
          semulaJumlahGigiKekalDiberiPrrJenis1,
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
        },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      console.log('Update success');
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };

  const handleNext = () => {
    // do something..
  };

  return (
    <>
      <div className='container px-10 h-full p-3 overflow-y-auto'>
        <div className='p-2'>
          <article className='outline outline-1 outline-userBlack grid grid-cols-1 md:grid-cols-2'>
            <div>
              <h1 className='text-l font-bold flex flex-row pl-5 pt-5'>
                BASIC DEMOGRAFIK
              </h1>
              <div className='text-s flex flex-row pl-5'>
                <h2 className='font-semibold'>NAMA :</h2>
                <p className='ml-1'>{singlePersonSekolah.nama}</p>
              </div>
              <div className='text-s flex flex-row pl-5'>
                <h2 className='font-semibold'>JANTINA :</h2>
                <p className='ml-1'>{singlePersonSekolah.jantina}</p>
              </div>
              <div className='text-s flex flex-row pl-5'>
                <h2 className='font-semibold'>UMUR :</h2>
                <p className='ml-1'>{singlePersonSekolah.umur} tahun</p>
              </div>
              <div className='text-s flex flex-row pl-5'>
                <h2 className='font-semibold'>NO IC :</h2>
                <p className='ml-1'>{singlePersonSekolah.ic}</p>
              </div>
            </div>
            <div className='md:pt-10'>
              <div className='text-s flex flex-row pl-5'>
                <h2 className='font-semibold'>NAMA SEKOLAH :</h2>
                <p className='ml-1'>{singlePersonSekolah.namaSekolah}</p>
              </div>
              <div className='text-s flex flex-row pl-5'>
                <h2 className='font-semibold'>
                  {(singlePersonSekolah.darjah && 'DARJAH') ||
                    (singlePersonSekolah.tingkatan && 'TINGKATAN')}{' '}
                  :
                </h2>
                <p className='ml-1'>
                  {singlePersonSekolah.darjah || singlePersonSekolah.tingkatan}
                </p>
              </div>
              <div className='text-s flex flex-row pl-5'>
                <h2 className='font-semibold'>KELAS :</h2>
                <p className='ml-1'>{singlePersonSekolah.kelas}</p>
              </div>
            </div>
          </article>
        </div>
        <form onSubmit={handleSubmit}>
          <Pendaftaran {...masterForm} />
          <PemeriksaanAwal {...masterForm} />
          <PerluDibuat {...masterForm} />
          <PenyataAkhir1 {...masterForm} />
          <PenyataAkhir2 />
          <Kotak {...masterForm} />
          <div className='grid grid-cols-1 lg:grid-cols-2 col-start-1 md:col-start-2 gap-2 col-span-2 md:col-span-1'>
            <div className='grid grid-cols-3 gap-3 lg:col-start-2'>
              <button className='flex bg-user3 p-2 w-full capitalize justify-center hover:bg-user1 hover:text-userWhite'>
                clear
              </button>
              <button className='flex bg-user3 p-2 w-full capitalize justify-center hover:bg-user1 hover:text-userWhite'>
                next
              </button>
              <button
                type='submit'
                className='flex bg-user3 p-2 w-full capitalize justify-center hover:bg-user1 hover:text-userWhite'
              >
                submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default UserFormSekolah;
