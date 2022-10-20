import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaInfoCircle } from 'react-icons/fa';
import { Spinner } from 'react-awesome-spinners';

import { useGlobalUserAppContext } from '../context/userAppContext';

import Kemaskini from './form-umum/Kemaskini';
// import FasilitiPerkhidmatan from './form-umum/FasilitiPerkhidmatan';
// import MaklumatLanjut from './form-umum/MaklumatLanjut';
import Pemeriksaan from './form-umum/Pemeriksaan';
import Rawatan from './form-umum/Rawatan';
import Promosi from './form-umum/Promosi';
// import Kotak from './form-umum/Kotak';

function UserFormUmumHeader() {
  const {
    userToken,
    reliefUserToken,
    username,
    navigate,
    catchAxiosErrorAndLogout,
    useParams,
    toast,
  } = useGlobalUserAppContext();

  const { personUmumId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isShown, setIsShown] = useState(false);
  const [singlePersonUmum, setSinglePersonUmum] = useState([]);
  const [showKemaskini, setShowKemasKini] = useState(false);

  // creating masterForm object to be used by the form
  const masterForm = {};
  masterForm.createdByUsername = username;
  //fasiliti perkhidmatan
  const [jenisFasiliti, setJenisFasiliti] = useState('');
  masterForm.jenisFasiliti = jenisFasiliti;
  masterForm.setJenisFasiliti = setJenisFasiliti;
  const [kepp, setKepp] = useState(false);
  masterForm.kepp = kepp;
  masterForm.setKepp = setKepp;
  const [jenisProgramKomuniti, setJenisProgramKomuniti] = useState('');
  masterForm.jenisProgramKomuniti = jenisProgramKomuniti;
  masterForm.setJenisProgramKomuniti = setJenisProgramKomuniti;
  //maklumat lanjut
  const [kedatangan, setKedatangan] = useState('');
  masterForm.kedatangan = kedatangan;
  masterForm.setKedatangan = setKedatangan;
  const [tarikhKedatangan, setTarikhKedatangan] = useState('');
  masterForm.tarikhKedatangan = tarikhKedatangan;
  masterForm.setTarikhKedatangan = setTarikhKedatangan;
  const [fasilitiTaskaTadika, setFasilitiTaskaTadika] = useState('');
  masterForm.fasilitiTaskaTadika = fasilitiTaskaTadika;
  masterForm.setFasilitiTaskaTadika = setFasilitiTaskaTadika;
  const [jenisTaskaTadika, setJenisTaskaTadika] = useState('');
  masterForm.jenisTaskaTadika = jenisTaskaTadika;
  masterForm.setJenisTaskaTadika = setJenisTaskaTadika;
  const [kelasToddler, setKelasToddler] = useState(false);
  masterForm.kelasToddler = kelasToddler;
  masterForm.setKelasToddler = setKelasToddler;
  const [namaFasilitiTaskaTadika, setNamaFasilitiTaskaTadika] = useState('');
  masterForm.namaFasilitiTaskaTadika = namaFasilitiTaskaTadika;
  masterForm.setNamaFasilitiTaskaTadika = setNamaFasilitiTaskaTadika;
  const [enrolmenTaskaTadika, setEnrolmenTaskaTadika] = useState(false);
  masterForm.enrolmenTaskaTadika = enrolmenTaskaTadika;
  masterForm.setEnrolmenTaskaTadika = setEnrolmenTaskaTadika;
  const [kedatanganTaskaTadika, setKedatanganTaskaTadika] = useState('');
  masterForm.kedatanganTaskaTadika = kedatanganTaskaTadika;
  masterForm.setKedatanganTaskaTadika = setKedatanganTaskaTadika;
  const [engganTaskaTadika, setEngganTaskaTadika] = useState(false);
  masterForm.engganTaskaTadika = engganTaskaTadika;
  masterForm.setEngganTaskaTadika = setEngganTaskaTadika;
  const [tidakHadirTaskaTadika, setTidakHadirTaskaTadika] = useState(false);
  masterForm.tidakHadirTaskaTadika = tidakHadirTaskaTadika;
  masterForm.setTidakHadirTaskaTadika = setTidakHadirTaskaTadika;
  const [pemeriksaanTaskaTadika, setPemeriksaanTaskaTadika] = useState('');
  masterForm.pemeriksaanTaskaTadika = pemeriksaanTaskaTadika;
  masterForm.setPemeriksaanTaskaTadika = setPemeriksaanTaskaTadika;
  const [yaTidakIbuMengandung, setYaTidakIbuMengandung] = useState('');
  masterForm.yaTidakIbuMengandung = yaTidakIbuMengandung;
  masterForm.setYaTidakIbuMengandung = setYaTidakIbuMengandung;
  const [baruUlanganIbuMengandung, setBaruUlanganIbuMengandung] = useState('');
  masterForm.baruUlanganIbuMengandung = baruUlanganIbuMengandung;
  masterForm.setBaruUlanganIbuMengandung = setBaruUlanganIbuMengandung;
  const [kedatanganKepp, setKedatanganKepp] = useState('');
  masterForm.kedatanganKepp = kedatanganKepp;
  masterForm.setKedatanganKepp = setKedatanganKepp;
  const [tarikhRujukanKepp, setTarikhRujukanKepp] = useState('');
  masterForm.tarikhRujukanKepp = tarikhRujukanKepp;
  masterForm.setTarikhRujukanKepp = setTarikhRujukanKepp;
  const [tarikhRundinganPertama, setTarikhRundinganPertama] = useState('');
  masterForm.tarikhRundinganPertama = tarikhRundinganPertama;
  masterForm.setTarikhRundinganPertama = setTarikhRundinganPertama;
  const [tarikhMulaRawatanKepp, setTarikhMulaRawatanKepp] = useState('');
  masterForm.tarikhMulaRawatanKepp = tarikhMulaRawatanKepp;
  masterForm.setTarikhMulaRawatanKepp = setTarikhMulaRawatanKepp;
  const [kpBergerakMaklumatLanjutUmum, setKpBergerakMaklumatLanjutUmum] =
    useState(false);
  masterForm.kpBergerakMaklumatLanjutUmum = kpBergerakMaklumatLanjutUmum;
  masterForm.setKpBergerakMaklumatLanjutUmum = setKpBergerakMaklumatLanjutUmum;
  const [
    labelKpBergerakMaklumatLanjutUmum,
    setLabelKpBergerakMaklumatLanjutUmum,
  ] = useState('');
  masterForm.labelKpBergerakMaklumatLanjutUmum =
    labelKpBergerakMaklumatLanjutUmum;
  masterForm.setLabelKpBergerakMaklumatLanjutUmum =
    setLabelKpBergerakMaklumatLanjutUmum;
  const [
    pasukanPergigianBergerakMaklumatLanjutUmum,
    setPasukanPergigianBergerakMaklumatLanjutUmum,
  ] = useState(false);
  masterForm.pasukanPergigianBergerakMaklumatLanjutUmum =
    pasukanPergigianBergerakMaklumatLanjutUmum;
  masterForm.setPasukanPergigianBergerakMaklumatLanjutUmum =
    setPasukanPergigianBergerakMaklumatLanjutUmum;
  const [
    makmalPergigianBergerakMaklumatLanjutUmum,
    setMakmalPergigianBergerakMaklumatLanjutUmum,
  ] = useState(false);
  masterForm.makmalPergigianBergerakMaklumatLanjutUmum =
    makmalPergigianBergerakMaklumatLanjutUmum;
  masterForm.setMakmalPergigianBergerakMaklumatLanjutUmum =
    setMakmalPergigianBergerakMaklumatLanjutUmum;
  const [
    labelMakmalPergigianBergerakMaklumatLanjutUmum,
    setLabelMakmalPergigianBergerakMaklumatLanjutUmum,
  ] = useState('');
  masterForm.labelMakmalPergigianBergerakMaklumatLanjutUmum =
    labelMakmalPergigianBergerakMaklumatLanjutUmum;
  masterForm.setLabelMakmalPergigianBergerakMaklumatLanjutUmum =
    setLabelMakmalPergigianBergerakMaklumatLanjutUmum;
  const [kgAngkat, setKgAngkat] = useState('');
  masterForm.kgAngkat = kgAngkat;
  masterForm.setKgAngkat = setKgAngkat;
  const [institusiPengajianTinggiKolej, setInstitusiPengajianTinggiKolej] =
    useState('');
  masterForm.institusiPengajianTinggiKolej = institusiPengajianTinggiKolej;
  masterForm.setInstitusiPengajianTinggiKolej =
    setInstitusiPengajianTinggiKolej;
  const [
    ipgInstitusiPengajianTinggiKolej,
    setIpgInstitusiPengajianTinggiKolej,
  ] = useState('');
  masterForm.ipgInstitusiPengajianTinggiKolej =
    ipgInstitusiPengajianTinggiKolej;
  masterForm.setIpgInstitusiPengajianTinggiKolej =
    setIpgInstitusiPengajianTinggiKolej;
  const [
    kolejKomunitiInstitusiPengajianTinggiKolej,
    setKolejKomunitiInstitusiPengajianTinggiKolej,
  ] = useState('');
  masterForm.kolejKomunitiInstitusiPengajianTinggiKolej =
    kolejKomunitiInstitusiPengajianTinggiKolej;
  masterForm.setKolejKomunitiInstitusiPengajianTinggiKolej =
    setKolejKomunitiInstitusiPengajianTinggiKolej;
  const [
    politeknikInstitusiPengajianTinggiKolej,
    setPoliteknikInstitusiPengajianTinggiKolej,
  ] = useState('');
  masterForm.politeknikInstitusiPengajianTinggiKolej =
    politeknikInstitusiPengajianTinggiKolej;
  masterForm.setPoliteknikInstitusiPengajianTinggiKolej =
    setPoliteknikInstitusiPengajianTinggiKolej;
  const [
    institutLatihanKerajaanInstitusiPengajianTinggiKolej,
    setInstitutLatihanKerajaanInstitusiPengajianTinggiKolej,
  ] = useState('');
  masterForm.institutLatihanKerajaanInstitusiPengajianTinggiKolej =
    institutLatihanKerajaanInstitusiPengajianTinggiKolej;
  masterForm.setInstitutLatihanKerajaanInstitusiPengajianTinggiKolej =
    setInstitutLatihanKerajaanInstitusiPengajianTinggiKolej;
  const [
    giatmaraInstitusiPengajianTinggiKolej,
    setGiatmaraInstitusiPengajianTinggiKolej,
  ] = useState('');
  masterForm.giatmaraInstitusiPengajianTinggiKolej =
    giatmaraInstitusiPengajianTinggiKolej;
  masterForm.setGiatmaraInstitusiPengajianTinggiKolej =
    setGiatmaraInstitusiPengajianTinggiKolej;
  const [
    iptaInstitusiPengajianTinggiKolej,
    setIptaInstitusiPengajianTinggiKolej,
  ] = useState('');
  masterForm.iptaInstitusiPengajianTinggiKolej =
    iptaInstitusiPengajianTinggiKolej;
  masterForm.setIptaInstitusiPengajianTinggiKolej =
    setIptaInstitusiPengajianTinggiKolej;
  const [
    iptsInstitusiPengajianTinggiKolej,
    setIptsInstitusiPengajianTinggiKolej,
  ] = useState('');
  masterForm.iptsInstitusiPengajianTinggiKolej =
    iptsInstitusiPengajianTinggiKolej;
  masterForm.setIptsInstitusiPengajianTinggiKolej =
    setIptsInstitusiPengajianTinggiKolej;
  const [
    enrolmenInstitusiPengajianTinggiKolej,
    setEnrolmenInstitusiPengajianTinggiKolej,
  ] = useState(false);
  masterForm.enrolmenInstitusiPengajianTinggiKolej =
    enrolmenInstitusiPengajianTinggiKolej;
  masterForm.setEnrolmenInstitusiPengajianTinggiKolej =
    setEnrolmenInstitusiPengajianTinggiKolej;
  const [institusiOku, setInstitusiOku] = useState('');
  masterForm.institusiOku = institusiOku;
  masterForm.setInstitusiOku = setInstitusiOku;
  const [institusiWargaEmas, setInstitusiWargaEmas] = useState('');
  masterForm.institusiWargaEmas = institusiWargaEmas;
  masterForm.setInstitusiWargaEmas = setInstitusiWargaEmas;
  const [kerajaanInstitusiWargaEmas, setKerajaanInstitusiWargaEmas] =
    useState('');
  masterForm.kerajaanInstitusiWargaEmas = kerajaanInstitusiWargaEmas;
  masterForm.setKerajaanInstitusiWargaEmas = setKerajaanInstitusiWargaEmas;
  const [swastaInstitusiWargaEmas, setSwastaInstitusiWargaEmas] = useState('');
  masterForm.swastaInstitusiWargaEmas = swastaInstitusiWargaEmas;
  masterForm.setSwastaInstitusiWargaEmas = setSwastaInstitusiWargaEmas;
  //pemeriksaan
  const [adaCleftLipPemeriksaanUmum, setAdaCleftLipPemeriksaanUmum] =
    useState(false);
  masterForm.adaCleftLipPemeriksaanUmum = adaCleftLipPemeriksaanUmum;
  masterForm.setAdaCleftLipPemeriksaanUmum = setAdaCleftLipPemeriksaanUmum;
  const [rujukCleftLipPemeriksaanUmum, setRujukCleftLipPemeriksaanUmum] =
    useState(false);
  masterForm.rujukCleftLipPemeriksaanUmum = rujukCleftLipPemeriksaanUmum;
  masterForm.setRujukCleftLipPemeriksaanUmum = setRujukCleftLipPemeriksaanUmum;
  const [
    yaTidakSediaAdaStatusDenturePemeriksaanUmum,
    setYaTidakSediaAdaStatusDenturePemeriksaanUmum,
  ] = useState('');
  masterForm.yaTidakSediaAdaStatusDenturePemeriksaanUmum =
    yaTidakSediaAdaStatusDenturePemeriksaanUmum;
  masterForm.setYaTidakSediaAdaStatusDenturePemeriksaanUmum =
    setYaTidakSediaAdaStatusDenturePemeriksaanUmum;
  const [
    separaPenuhAtasSediaAdaDenturePemeriksaanUmum,
    setSeparaPenuhAtasSediaAdaDenturePemeriksaanUmum,
  ] = useState('');
  masterForm.separaPenuhAtasSediaAdaDenturePemeriksaanUmum =
    separaPenuhAtasSediaAdaDenturePemeriksaanUmum;
  masterForm.setSeparaPenuhAtasSediaAdaDenturePemeriksaanUmum =
    setSeparaPenuhAtasSediaAdaDenturePemeriksaanUmum;
  const [
    separaPenuhBawahSediaAdaDenturePemeriksaanUmum,
    setSeparaPenuhBawahSediaAdaDenturePemeriksaanUmum,
  ] = useState('');
  masterForm.separaPenuhBawahSediaAdaDenturePemeriksaanUmum =
    separaPenuhBawahSediaAdaDenturePemeriksaanUmum;
  masterForm.setSeparaPenuhBawahSediaAdaDenturePemeriksaanUmum =
    setSeparaPenuhBawahSediaAdaDenturePemeriksaanUmum;
  const [
    yaTidakPerluStatusDenturePemeriksaanUmum,
    setYaTidakPerluStatusDenturePemeriksaanUmum,
  ] = useState('');
  masterForm.yaTidakPerluStatusDenturePemeriksaanUmum =
    yaTidakPerluStatusDenturePemeriksaanUmum;
  masterForm.setYaTidakPerluStatusDenturePemeriksaanUmum =
    setYaTidakPerluStatusDenturePemeriksaanUmum;
  const [
    separaPenuhAtasPerluDenturePemeriksaanUmum,
    setSeparaPenuhAtasPerluDenturePemeriksaanUmum,
  ] = useState('');
  masterForm.separaPenuhAtasPerluDenturePemeriksaanUmum =
    separaPenuhAtasPerluDenturePemeriksaanUmum;
  masterForm.setSeparaPenuhAtasPerluDenturePemeriksaanUmum =
    setSeparaPenuhAtasPerluDenturePemeriksaanUmum;
  const [
    separaPenuhBawahPerluDenturePemeriksaanUmum,
    setSeparaPenuhBawahPerluDenturePemeriksaanUmum,
  ] = useState('');
  masterForm.separaPenuhBawahPerluDenturePemeriksaanUmum =
    separaPenuhBawahPerluDenturePemeriksaanUmum;
  masterForm.setSeparaPenuhBawahPerluDenturePemeriksaanUmum =
    setSeparaPenuhBawahPerluDenturePemeriksaanUmum;
  const [
    toothSurfaceLossTraumaPemeriksaanUmum,
    setToothSurfaceLossTraumaPemeriksaanUmum,
  ] = useState(false);
  masterForm.toothSurfaceLossTraumaPemeriksaanUmum =
    toothSurfaceLossTraumaPemeriksaanUmum;
  masterForm.setToothSurfaceLossTraumaPemeriksaanUmum =
    setToothSurfaceLossTraumaPemeriksaanUmum;
  // const [
  //   kecederaanGigiAnteriorTraumaPemeriksaanUmum,
  //   setKecederaanGigiAnteriorTraumaPemeriksaanUmum,
  // ] = useState(false);
  // masterForm.kecederaanGigiAnteriorTraumaPemeriksaanUmum =
  //   kecederaanGigiAnteriorTraumaPemeriksaanUmum;
  // masterForm.setKecederaanGigiAnteriorTraumaPemeriksaanUmum =
  //   setKecederaanGigiAnteriorTraumaPemeriksaanUmum;
  // const [tisuLembutTraumaPemeriksaanUmum, setTisuLembutTraumaPemeriksaanUmum] =
  //   useState(false);
  // masterForm.tisuLembutTraumaPemeriksaanUmum = tisuLembutTraumaPemeriksaanUmum;
  // masterForm.setTisuLembutTraumaPemeriksaanUmum =
  //   setTisuLembutTraumaPemeriksaanUmum;
  // const [tisuKerasTraumaPemeriksaanUmum, setTisuKerasTraumaPemeriksaanUmum] =
  //   useState(false);
  // masterForm.tisuKerasTraumaPemeriksaanUmum = tisuKerasTraumaPemeriksaanUmum;
  // masterForm.setTisuKerasTraumaPemeriksaanUmum =
  //   setTisuKerasTraumaPemeriksaanUmum;
  const [fissureSealantPemeriksaanUmum, setFissureSealantPemeriksaanUmum] =
    useState(false);
  masterForm.fissureSealantPemeriksaanUmum = fissureSealantPemeriksaanUmum;
  masterForm.setFissureSealantPemeriksaanUmum =
    setFissureSealantPemeriksaanUmum;
  const [
    baruJumlahGigiKekalPerluFSRawatanUmum,
    setBaruJumlahGigiKekalPerluFSRawatanUmum,
  ] = useState('');
  masterForm.baruJumlahGigiKekalPerluFSRawatanUmum =
    baruJumlahGigiKekalPerluFSRawatanUmum;
  masterForm.setBaruJumlahGigiKekalPerluFSRawatanUmum =
    setBaruJumlahGigiKekalPerluFSRawatanUmum;
  const [fvPerluSapuanPemeriksaanUmum, setFvPerluSapuanPemeriksaanUmum] =
    useState('');
  masterForm.fvPerluSapuanPemeriksaanUmum = fvPerluSapuanPemeriksaanUmum;
  masterForm.setFvPerluSapuanPemeriksaanUmum = setFvPerluSapuanPemeriksaanUmum;
  const [prrJenis1PemeriksaanUmum, setPrrJenis1PemeriksaanUmum] =
    useState(false);
  masterForm.prrJenis1PemeriksaanUmum = prrJenis1PemeriksaanUmum;
  masterForm.setPrrJenis1PemeriksaanUmum = setPrrJenis1PemeriksaanUmum;
  const [
    baruJumlahGigiKekalPerluPRRJenis1RawatanUmum,
    setBaruJumlahGigiKekalPerluPRRJenis1RawatanUmum,
  ] = useState('');
  masterForm.baruJumlahGigiKekalPerluPRRJenis1RawatanUmum =
    baruJumlahGigiKekalPerluPRRJenis1RawatanUmum;
  masterForm.setBaruJumlahGigiKekalPerluPRRJenis1RawatanUmum =
    setBaruJumlahGigiKekalPerluPRRJenis1RawatanUmum;
  const [
    yaTidakSilverDiamineFluoridePerluSapuanPemeriksaanUmum,
    setYaTidakSilverDiamineFluoridePerluSapuanPemeriksaanUmum,
  ] = useState('');
  masterForm.yaTidakSilverDiamineFluoridePerluSapuanPemeriksaanUmum =
    yaTidakSilverDiamineFluoridePerluSapuanPemeriksaanUmum;
  masterForm.setYaTidakSilverDiamineFluoridePerluSapuanPemeriksaanUmum =
    setYaTidakSilverDiamineFluoridePerluSapuanPemeriksaanUmum;
  //kotak masuk sini sbb kotak ada sini
  const [statusMPemeriksaanUmum, setStatusMPemeriksaanUmum] = useState('');
  masterForm.statusMPemeriksaanUmum = statusMPemeriksaanUmum;
  masterForm.setStatusMPemeriksaanUmum = setStatusMPemeriksaanUmum;
  const [jenisRPemeriksaanUmum, setJenisRPemeriksaanUmum] = useState('');
  masterForm.jenisRPemeriksaanUmum = jenisRPemeriksaanUmum;
  masterForm.setJenisRPemeriksaanUmum = setJenisRPemeriksaanUmum;
  const [
    kebersihanMulutOralHygienePemeriksaanUmum,
    setKebersihanMulutOralHygienePemeriksaanUmum,
  ] = useState('');
  masterForm.kebersihanMulutOralHygienePemeriksaanUmum =
    kebersihanMulutOralHygienePemeriksaanUmum;
  masterForm.setKebersihanMulutOralHygienePemeriksaanUmum =
    setKebersihanMulutOralHygienePemeriksaanUmum;
  const [
    skorBpeOralHygienePemeriksaanUmum,
    setSkorBpeOralHygienePemeriksaanUmum,
  ] = useState('');
  masterForm.skorBpeOralHygienePemeriksaanUmum =
    skorBpeOralHygienePemeriksaanUmum;
  masterForm.setSkorBpeOralHygienePemeriksaanUmum =
    setSkorBpeOralHygienePemeriksaanUmum;
  const [
    skorGisMulutOralHygienePemeriksaanUmum,
    setSkorGisMulutOralHygienePemeriksaanUmum,
  ] = useState('');
  masterForm.skorGisMulutOralHygienePemeriksaanUmum =
    skorGisMulutOralHygienePemeriksaanUmum;
  masterForm.setSkorGisMulutOralHygienePemeriksaanUmum =
    setSkorGisMulutOralHygienePemeriksaanUmum;
  const [perluPenskaleranPemeriksaanUmum, setPerluPenskaleranPemeriksaanUmum] =
    useState(false);
  masterForm.perluPenskaleranPemeriksaanUmum = perluPenskaleranPemeriksaanUmum;
  masterForm.setPerluPenskaleranPemeriksaanUmum =
    setPerluPenskaleranPemeriksaanUmum;
  const [adaDesidusPemeriksaanUmum, setAdaDesidusPemeriksaanUmum] =
    useState(false);
  masterForm.adaDesidusPemeriksaanUmum = adaDesidusPemeriksaanUmum;
  masterForm.setAdaDesidusPemeriksaanUmum = setAdaDesidusPemeriksaanUmum;
  const [dAdaGigiDesidusPemeriksaanUmum, setDAdaGigiDesidusPemeriksaanUmum] =
    useState('');
  masterForm.dAdaGigiDesidusPemeriksaanUmum = dAdaGigiDesidusPemeriksaanUmum;
  masterForm.setDAdaGigiDesidusPemeriksaanUmum =
    setDAdaGigiDesidusPemeriksaanUmum;
  const [mAdaGigiDesidusPemeriksaanUmum, setMAdaGigiDesidusPemeriksaanUmum] =
    useState('');
  masterForm.mAdaGigiDesidusPemeriksaanUmum = mAdaGigiDesidusPemeriksaanUmum;
  masterForm.setMAdaGigiDesidusPemeriksaanUmum =
    setMAdaGigiDesidusPemeriksaanUmum;
  const [fAdaGigiDesidusPemeriksaanUmum, setFAdaGigiDesidusPemeriksaanUmum] =
    useState('');
  masterForm.fAdaGigiDesidusPemeriksaanUmum = fAdaGigiDesidusPemeriksaanUmum;
  masterForm.setFAdaGigiDesidusPemeriksaanUmum =
    setFAdaGigiDesidusPemeriksaanUmum;
  // const [smAdaGigiDesidusPemeriksaanUmum, setSmAdaGigiDesidusPemeriksaanUmum] =
  //   useState('');
  // masterForm.smAdaGigiDesidusPemeriksaanUmum = smAdaGigiDesidusPemeriksaanUmum;
  // masterForm.setSmAdaGigiDesidusPemeriksaanUmum =
  //   setSmAdaGigiDesidusPemeriksaanUmum;
  const [xAdaGigiDesidusPemeriksaanUmum, setXAdaGigiDesidusPemeriksaanUmum] =
    useState('');
  masterForm.xAdaGigiDesidusPemeriksaanUmum = xAdaGigiDesidusPemeriksaanUmum;
  masterForm.setXAdaGigiDesidusPemeriksaanUmum =
    setXAdaGigiDesidusPemeriksaanUmum;
  const [sumDMFXDesidusUmum, setSumDMFXDesidusUmum] = useState(0);
  masterForm.sumDMFXDesidusUmum = sumDMFXDesidusUmum;
  const [adaKekalPemeriksaanUmum, setAdaKekalPemeriksaanUmum] = useState(false);
  masterForm.adaKekalPemeriksaanUmum = adaKekalPemeriksaanUmum;
  masterForm.setAdaKekalPemeriksaanUmum = setAdaKekalPemeriksaanUmum;
  const [dAdaGigiKekalPemeriksaanUmum, setDAdaGigiKekalPemeriksaanUmum] =
    useState('');
  masterForm.dAdaGigiKekalPemeriksaanUmum = dAdaGigiKekalPemeriksaanUmum;
  masterForm.setDAdaGigiKekalPemeriksaanUmum = setDAdaGigiKekalPemeriksaanUmum;
  const [mAdaGigiKekalPemeriksaanUmum, setMAdaGigiKekalPemeriksaanUmum] =
    useState('');
  masterForm.mAdaGigiKekalPemeriksaanUmum = mAdaGigiKekalPemeriksaanUmum;
  masterForm.setMAdaGigiKekalPemeriksaanUmum = setMAdaGigiKekalPemeriksaanUmum;
  const [fAdaGigiKekalPemeriksaanUmum, setFAdaGigiKekalPemeriksaanUmum] =
    useState('');
  masterForm.fAdaGigiKekalPemeriksaanUmum = fAdaGigiKekalPemeriksaanUmum;
  masterForm.setFAdaGigiKekalPemeriksaanUmum = setFAdaGigiKekalPemeriksaanUmum;
  const [eAdaGigiKekalPemeriksaanUmum, setEAdaGigiKekalPemeriksaanUmum] =
    useState('');
  masterForm.eAdaGigiKekalPemeriksaanUmum = eAdaGigiKekalPemeriksaanUmum;
  masterForm.setEAdaGigiKekalPemeriksaanUmum = setEAdaGigiKekalPemeriksaanUmum;
  const [xAdaGigiKekalPemeriksaanUmum, setXAdaGigiKekalPemeriksaanUmum] =
    useState('');
  masterForm.xAdaGigiKekalPemeriksaanUmum = xAdaGigiKekalPemeriksaanUmum;
  masterForm.setXAdaGigiKekalPemeriksaanUmum = setXAdaGigiKekalPemeriksaanUmum;
  const [sumDMFXKekalUmum, setSumDMFXKekalUmum] = useState(0);
  masterForm.sumDMFXKekalUmum = sumDMFXKekalUmum;
  const [
    jumlahFaktorRisikoPemeriksaanUmum,
    setJumlahFaktorRisikoPemeriksaanUmum,
  ] = useState('');
  masterForm.jumlahFaktorRisikoPemeriksaanUmum =
    jumlahFaktorRisikoPemeriksaanUmum;
  masterForm.setJumlahFaktorRisikoPemeriksaanUmum =
    setJumlahFaktorRisikoPemeriksaanUmum;
  // const [
  //   edentulousWargaEmasPemeriksaanUmum,
  //   setEdentulousWargaEmasPemeriksaanUmum,
  // ] = useState('');
  // masterForm.edentulousWargaEmasPemeriksaanUmum =
  //   edentulousWargaEmasPemeriksaanUmum;
  // masterForm.setEdentulousWargaEmasPemeriksaanUmum =
  //   setEdentulousWargaEmasPemeriksaanUmum;
  // const [
  //   mempunyai20GigiEdentulousWargaEmasPemeriksaanUmum,
  //   setMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum,
  // ] = useState('');
  // masterForm.mempunyai20GigiEdentulousWargaEmasPemeriksaanUmum =
  //   mempunyai20GigiEdentulousWargaEmasPemeriksaanUmum;
  // masterForm.setMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum =
  //   setMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum;
  const [
    bilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum,
    setBilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum,
  ] = useState('');
  masterForm.bilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum =
    bilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum;
  masterForm.setBilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum =
    setBilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum;
  const [
    disaringProgramKanserMulutPemeriksaanUmum,
    setDisaringProgramKanserMulutPemeriksaanUmum,
  ] = useState('');
  masterForm.disaringProgramKanserMulutPemeriksaanUmum =
    disaringProgramKanserMulutPemeriksaanUmum;
  masterForm.setDisaringProgramKanserMulutPemeriksaanUmum =
    setDisaringProgramKanserMulutPemeriksaanUmum;
  const [
    dirujukProgramKanserMulutPemeriksaanUmum,
    setDirujukProgramKanserMulutPemeriksaanUmum,
  ] = useState('');
  masterForm.dirujukProgramKanserMulutPemeriksaanUmum =
    dirujukProgramKanserMulutPemeriksaanUmum;
  masterForm.setDirujukProgramKanserMulutPemeriksaanUmum =
    setDirujukProgramKanserMulutPemeriksaanUmum;
  const [lesiMulutPemeriksaanUmum, setLesiMulutPemeriksaanUmum] =
    useState(false);
  masterForm.lesiMulutPemeriksaanUmum = lesiMulutPemeriksaanUmum;
  masterForm.setLesiMulutPemeriksaanUmum = setLesiMulutPemeriksaanUmum;
  const [
    tabiatBerisikoTinggiPemeriksaanUmum,
    setTabiatBerisikoTinggiPemeriksaanUmum,
  ] = useState(false);
  masterForm.tabiatBerisikoTinggiPemeriksaanUmum =
    tabiatBerisikoTinggiPemeriksaanUmum;
  masterForm.setTabiatBerisikoTinggiPemeriksaanUmum =
    setTabiatBerisikoTinggiPemeriksaanUmum;
  const [
    jumlahAnteriorKesEndodontikDiperlukanPemeriksaanUmum,
    setJumlahAnteriorKesEndodontikDiperlukanPemeriksaanUmum,
  ] = useState('');
  masterForm.jumlahAnteriorKesEndodontikDiperlukanPemeriksaanUmum =
    jumlahAnteriorKesEndodontikDiperlukanPemeriksaanUmum;
  masterForm.setJumlahAnteriorKesEndodontikDiperlukanPemeriksaanUmum =
    setJumlahAnteriorKesEndodontikDiperlukanPemeriksaanUmum;
  const [
    jumlahPremolarKesEndodontikDiperlukanPemeriksaanUmum,
    setJumlahPremolarKesEndodontikDiperlukanPemeriksaanUmum,
  ] = useState('');
  masterForm.jumlahPremolarKesEndodontikDiperlukanPemeriksaanUmum =
    jumlahPremolarKesEndodontikDiperlukanPemeriksaanUmum;
  masterForm.setJumlahPremolarKesEndodontikDiperlukanPemeriksaanUmum =
    setJumlahPremolarKesEndodontikDiperlukanPemeriksaanUmum;
  const [
    jumlahMolarKesEndodontikDiperlukanPemeriksaanUmum,
    setJumlahMolarKesEndodontikDiperlukanPemeriksaanUmum,
  ] = useState('');
  masterForm.jumlahMolarKesEndodontikDiperlukanPemeriksaanUmum =
    jumlahMolarKesEndodontikDiperlukanPemeriksaanUmum;
  masterForm.setJumlahMolarKesEndodontikDiperlukanPemeriksaanUmum =
    setJumlahMolarKesEndodontikDiperlukanPemeriksaanUmum;
  const [
    rawatanSemulaEndodontikDariPrimerKesEndodontikDiperlukanPemeriksaanUmum,
    setRawatanSemulaEndodontikDariPrimerKesEndodontikDiperlukanPemeriksaanUmum,
  ] = useState('');
  masterForm.rawatanSemulaEndodontikDariPrimerKesEndodontikDiperlukanPemeriksaanUmum =
    rawatanSemulaEndodontikDariPrimerKesEndodontikDiperlukanPemeriksaanUmum;
  masterForm.setRawatanSemulaEndodontikDariPrimerKesEndodontikDiperlukanPemeriksaanUmum =
    setRawatanSemulaEndodontikDariPrimerKesEndodontikDiperlukanPemeriksaanUmum;
  const [
    rawatanLainKesEndodontikDiperlukanPemeriksaanUmum,
    setRawatanLainKesEndodontikDiperlukanPemeriksaanUmum,
  ] = useState('');
  masterForm.rawatanLainKesEndodontikDiperlukanPemeriksaanUmum =
    rawatanLainKesEndodontikDiperlukanPemeriksaanUmum;
  masterForm.setRawatanLainKesEndodontikDiperlukanPemeriksaanUmum =
    setRawatanLainKesEndodontikDiperlukanPemeriksaanUmum;
  const [
    cabutanKesEndodontikDiperlukanPemeriksaanUmum,
    setCabutanKesEndodontikDiperlukanPemeriksaanUmum,
  ] = useState('');
  masterForm.cabutanKesEndodontikDiperlukanPemeriksaanUmum =
    cabutanKesEndodontikDiperlukanPemeriksaanUmum;
  masterForm.setCabutanKesEndodontikDiperlukanPemeriksaanUmum =
    setCabutanKesEndodontikDiperlukanPemeriksaanUmum;
  const [
    tampalanKesEndodontikDiperlukanPemeriksaanUmum,
    setTampalanKesEndodontikDiperlukanPemeriksaanUmum,
  ] = useState('');
  masterForm.tampalanKesEndodontikDiperlukanPemeriksaanUmum =
    tampalanKesEndodontikDiperlukanPemeriksaanUmum;
  masterForm.setTampalanKesEndodontikDiperlukanPemeriksaanUmum =
    setTampalanKesEndodontikDiperlukanPemeriksaanUmum;
  //rawatan
  const [pesakitDibuatFissureSealant, setPesakitDibuatFissureSealant] =
    useState(false);
  masterForm.pesakitDibuatFissureSealant = pesakitDibuatFissureSealant;
  masterForm.setPesakitDibuatFissureSealant = setPesakitDibuatFissureSealant;
  const [
    baruJumlahGigiKekalDibuatFSRawatanUmum,
    setBaruJumlahGigiKekalDibuatFSRawatanUmum,
  ] = useState('');
  masterForm.baruJumlahGigiKekalDibuatFSRawatanUmum =
    baruJumlahGigiKekalDibuatFSRawatanUmum;
  masterForm.setBaruJumlahGigiKekalDibuatFSRawatanUmum =
    setBaruJumlahGigiKekalDibuatFSRawatanUmum;
  // const [
  //   semulaJumlahGigiKekalDibuatFSRawatanUmum,
  //   setSemulaJumlahGigiKekalDibuatFSRawatanUmum,
  // ] = useState('');
  // masterForm.semulaJumlahGigiKekalDibuatFSRawatanUmum =
  //   semulaJumlahGigiKekalDibuatFSRawatanUmum;
  // masterForm.setSemulaJumlahGigiKekalDibuatFSRawatanUmum =
  //   setSemulaJumlahGigiKekalDibuatFSRawatanUmum;
  // const [
  //   baruJumlahMuridDibuatFsRawatanUmum,
  //   setBaruJumlahMuridDibuatFsRawatanUmum,
  // ] = useState('');
  // masterForm.baruJumlahMuridDibuatFsRawatanUmum =
  //   baruJumlahMuridDibuatFsRawatanUmum;
  // masterForm.setBaruJumlahMuridDibuatFsRawatanUmum =
  //   setBaruJumlahMuridDibuatFsRawatanUmum;
  // const [
  //   semulaJumlahMuridDibuatFsRawatanUmum,
  //   setSemulaJumlahMuridDibuatFsRawatanUmum,
  // ] = useState('');
  // masterForm.semulaJumlahMuridDibuatFsRawatanUmum =
  //   semulaJumlahMuridDibuatFsRawatanUmum;
  // masterForm.setSemulaJumlahMuridDibuatFsRawatanUmum =
  //   setSemulaJumlahMuridDibuatFsRawatanUmum;
  const [pesakitDibuatFluorideVarnish, setPesakitDibuatFluorideVarnish] =
    useState(false);
  masterForm.pesakitDibuatFluorideVarnish = pesakitDibuatFluorideVarnish;
  masterForm.setPesakitDibuatFluorideVarnish = setPesakitDibuatFluorideVarnish;
  // const [
  //   baruJumlahGigiKekalDiberiFVRawatanUmum,
  //   setBaruJumlahGigiKekalDiberiFVRawatanUmum,
  // ] = useState('');
  // masterForm.baruJumlahGigiKekalDiberiFVRawatanUmum =
  //   baruJumlahGigiKekalDiberiFVRawatanUmum;
  // masterForm.setBaruJumlahGigiKekalDiberiFVRawatanUmum =
  //   setBaruJumlahGigiKekalDiberiFVRawatanUmum;
  // const [
  //   semulaJumlahGigiKekalDiberiFVRawatanUmum,
  //   setSemulaJumlahGigiKekalDiberiFVRawatanUmum,
  // ] = useState('');
  // masterForm.semulaJumlahGigiKekalDiberiFVRawatanUmum =
  //   semulaJumlahGigiKekalDiberiFVRawatanUmum;
  // masterForm.setSemulaJumlahGigiKekalDiberiFVRawatanUmum =
  //   setSemulaJumlahGigiKekalDiberiFVRawatanUmum;
  // const [
  //   baruJumlahMuridDibuatFVRawatanUmum,
  //   setBaruJumlahMuridDibuatFVRawatanUmum,
  // ] = useState('');
  // masterForm.baruJumlahMuridDibuatFVRawatanUmum =
  //   baruJumlahMuridDibuatFVRawatanUmum;
  // masterForm.setBaruJumlahMuridDibuatFVRawatanUmum =
  //   setBaruJumlahMuridDibuatFVRawatanUmum;
  // const [
  //   semulaJumlahMuridDibuatFVRawatanUmum,
  //   setSemulaJumlahMuridDibuatFVRawatanUmum,
  // ] = useState('');
  // masterForm.semulaJumlahMuridDibuatFVRawatanUmum =
  //   semulaJumlahMuridDibuatFVRawatanUmum;
  // masterForm.setSemulaJumlahMuridDibuatFVRawatanUmum =
  //   setSemulaJumlahMuridDibuatFVRawatanUmum;
  const [pesakitDibuatPRRJenis1, setPesakitDibuatPRRJenis1] = useState(false);
  masterForm.pesakitDibuatPRRJenis1 = pesakitDibuatPRRJenis1;
  masterForm.setPesakitDibuatPRRJenis1 = setPesakitDibuatPRRJenis1;
  const [
    baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum,
    setBaruJumlahGigiKekalDiberiPRRJenis1RawatanUmum,
  ] = useState('');
  masterForm.baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum =
    baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum;
  masterForm.setBaruJumlahGigiKekalDiberiPRRJenis1RawatanUmum =
    setBaruJumlahGigiKekalDiberiPRRJenis1RawatanUmum;
  // const [
  //   semulaJumlahGigiKekalDiberiPRRJenis1RawatanUmum,
  //   setSemulaJumlahGigiKekalDiberiPRRJenis1RawatanUmum,
  // ] = useState('');
  // masterForm.semulaJumlahGigiKekalDiberiPRRJenis1RawatanUmum =
  //   semulaJumlahGigiKekalDiberiPRRJenis1RawatanUmum;
  // masterForm.setSemulaJumlahGigiKekalDiberiPRRJenis1RawatanUmum =
  //   setSemulaJumlahGigiKekalDiberiPRRJenis1RawatanUmum;
  // const [
  //   baruJumlahMuridDiberiPrrJenis1RawatanUmum,
  //   setBaruJumlahMuridDiberiPrrJenis1RawatanUmum,
  // ] = useState('');
  // masterForm.baruJumlahMuridDiberiPrrJenis1RawatanUmum =
  //   baruJumlahMuridDiberiPrrJenis1RawatanUmum;
  // masterForm.setBaruJumlahMuridDiberiPrrJenis1RawatanUmum =
  //   setBaruJumlahMuridDiberiPrrJenis1RawatanUmum;
  // const [
  //   semulaJumlahMuridDiberiPrrJenis1RawatanUmum,
  //   setSemulaJumlahMuridDiberiPrrJenis1RawatanUmum,
  // ] = useState('');
  // masterForm.semulaJumlahMuridDiberiPrrJenis1RawatanUmum =
  //   semulaJumlahMuridDiberiPrrJenis1RawatanUmum;
  // masterForm.setSemulaJumlahMuridDiberiPrrJenis1RawatanUmum =
  //   setSemulaJumlahMuridDiberiPrrJenis1RawatanUmum;
  const [cabutDesidusRawatanUmum, setCabutDesidusRawatanUmum] = useState('');
  masterForm.cabutDesidusRawatanUmum = cabutDesidusRawatanUmum;
  masterForm.setCabutDesidusRawatanUmum = setCabutDesidusRawatanUmum;
  const [cabutKekalRawatanUmum, setCabutKekalRawatanUmum] = useState('');
  masterForm.cabutKekalRawatanUmum = cabutKekalRawatanUmum;
  masterForm.setCabutKekalRawatanUmum = setCabutKekalRawatanUmum;
  const [
    komplikasiSelepasCabutanRawatanUmum,
    setKomplikasiSelepasCabutanRawatanUmum,
  ] = useState('');
  masterForm.komplikasiSelepasCabutanRawatanUmum =
    komplikasiSelepasCabutanRawatanUmum;
  masterForm.setKomplikasiSelepasCabutanRawatanUmum =
    setKomplikasiSelepasCabutanRawatanUmum;
  const [
    cabutanDisebabkanPeriodontitisRawatanUmum,
    setCabutanDisebabkanPeriodontitisRawatanUmum,
  ] = useState('');
  masterForm.cabutanDisebabkanPeriodontitisRawatanUmum =
    cabutanDisebabkanPeriodontitisRawatanUmum;
  masterForm.setCabutanDisebabkanPeriodontitisRawatanUmum =
    setCabutanDisebabkanPeriodontitisRawatanUmum;
  const [
    yaTidakAbsesPembedahanRawatanUmum,
    setYaTidakAbsesPembedahanRawatanUmum,
  ] = useState('');
  masterForm.yaTidakAbsesPembedahanRawatanUmum =
    yaTidakAbsesPembedahanRawatanUmum;
  masterForm.setYaTidakAbsesPembedahanRawatanUmum =
    setYaTidakAbsesPembedahanRawatanUmum;
  // const [
  //   baruSemulaAbsesPembedahanRawatanUmum,
  //   setBaruSemulaAbsesPembedahanRawatanUmum,
  // ] = useState('');
  // masterForm.baruSemulaAbsesPembedahanRawatanUmum =
  //   baruSemulaAbsesPembedahanRawatanUmum;
  // masterForm.setBaruSemulaAbsesPembedahanRawatanUmum =
  //   setBaruSemulaAbsesPembedahanRawatanUmum;
  const [
    cabutanSurgikalPembedahanMulutRawatanUmum,
    setCabutanSurgikalPembedahanMulutRawatanUmum,
  ] = useState('');
  masterForm.cabutanSurgikalPembedahanMulutRawatanUmum =
    cabutanSurgikalPembedahanMulutRawatanUmum;
  masterForm.setCabutanSurgikalPembedahanMulutRawatanUmum =
    setCabutanSurgikalPembedahanMulutRawatanUmum;
  const [
    yaTidakFrakturPembedahanRawatanUmum,
    setYaTidakFrakturPembedahanRawatanUmum,
  ] = useState('');
  masterForm.yaTidakFrakturPembedahanRawatanUmum =
    yaTidakFrakturPembedahanRawatanUmum;
  masterForm.setYaTidakFrakturPembedahanRawatanUmum =
    setYaTidakFrakturPembedahanRawatanUmum;
  const [
    yaTidakPembedahanKecilMulutPembedahanRawatanUmum,
    setYaTidakPembedahanKecilMulutPembedahanRawatanUmum,
  ] = useState('');
  masterForm.yaTidakPembedahanKecilMulutPembedahanRawatanUmum =
    yaTidakPembedahanKecilMulutPembedahanRawatanUmum;
  masterForm.setYaTidakPembedahanKecilMulutPembedahanRawatanUmum =
    setYaTidakPembedahanKecilMulutPembedahanRawatanUmum;
  const [
    yaTidakTraumaPembedahanRawatanUmum,
    setYaTidakTraumaPembedahanRawatanUmum,
  ] = useState('');
  masterForm.yaTidakTraumaPembedahanRawatanUmum =
    yaTidakTraumaPembedahanRawatanUmum;
  masterForm.setYaTidakTraumaPembedahanRawatanUmum =
    setYaTidakTraumaPembedahanRawatanUmum;
  const [kecederaanTulangMukaUmum, setKecederaanTulangMukaUmum] =
    useState(false);
  masterForm.kecederaanTulangMukaUmum = kecederaanTulangMukaUmum;
  masterForm.setKecederaanTulangMukaUmum = setKecederaanTulangMukaUmum;
  const [kecederaanGigiUmum, setKecederaanGigiUmum] = useState(false);
  masterForm.kecederaanGigiUmum = kecederaanGigiUmum;
  masterForm.setKecederaanGigiUmum = setKecederaanGigiUmum;
  const [kecederaanTisuLembutUmum, setKecederaanTisuLembutUmum] =
    useState(false);
  masterForm.kecederaanTisuLembutUmum = kecederaanTisuLembutUmum;
  masterForm.setKecederaanTisuLembutUmum = setKecederaanTisuLembutUmum;
  const [
    baruJumlahGigiYangDiberiSdfRawatanUmum,
    setBaruJumlahGigiYangDiberiSdfRawatanUmum,
  ] = useState('');
  masterForm.baruJumlahGigiYangDiberiSdfRawatanUmum =
    baruJumlahGigiYangDiberiSdfRawatanUmum;
  masterForm.setBaruJumlahGigiYangDiberiSdfRawatanUmum =
    setBaruJumlahGigiYangDiberiSdfRawatanUmum;
  const [
    semulaJumlahGigiYangDiberiSdfRawatanUmum,
    setSemulaJumlahGigiYangDiberiSdfRawatanUmum,
  ] = useState('');
  masterForm.semulaJumlahGigiYangDiberiSdfRawatanUmum =
    semulaJumlahGigiYangDiberiSdfRawatanUmum;
  masterForm.setSemulaJumlahGigiYangDiberiSdfRawatanUmum =
    setSemulaJumlahGigiYangDiberiSdfRawatanUmum;
  const [
    baruJumlahCrownBridgeRawatanUmum,
    setBaruJumlahCrownBridgeRawatanUmum,
  ] = useState('');
  masterForm.baruJumlahCrownBridgeRawatanUmum =
    baruJumlahCrownBridgeRawatanUmum;
  masterForm.setBaruJumlahCrownBridgeRawatanUmum =
    setBaruJumlahCrownBridgeRawatanUmum;
  const [
    semulaJumlahCrownBridgeRawatanUmum,
    setSemulaJumlahCrownBridgeRawatanUmum,
  ] = useState('');
  masterForm.semulaJumlahCrownBridgeRawatanUmum =
    semulaJumlahCrownBridgeRawatanUmum;
  masterForm.setSemulaJumlahCrownBridgeRawatanUmum =
    setSemulaJumlahCrownBridgeRawatanUmum;
  const [baruJumlahPostCoreRawatanUmum, setBaruJumlahPostCoreRawatanUmum] =
    useState('');
  masterForm.baruJumlahPostCoreRawatanUmum = baruJumlahPostCoreRawatanUmum;
  masterForm.setBaruJumlahPostCoreRawatanUmum =
    setBaruJumlahPostCoreRawatanUmum;
  const [semulaJumlahPostCoreRawatanUmum, setSemulaJumlahPostCoreRawatanUmum] =
    useState('');
  masterForm.semulaJumlahPostCoreRawatanUmum = semulaJumlahPostCoreRawatanUmum;
  masterForm.setSemulaJumlahPostCoreRawatanUmum =
    setSemulaJumlahPostCoreRawatanUmum;
  const [
    baruPenuhJumlahDenturProstodontikRawatanUmum,
    setBaruPenuhJumlahDenturProstodontikRawatanUmum,
  ] = useState('');
  masterForm.baruPenuhJumlahDenturProstodontikRawatanUmum =
    baruPenuhJumlahDenturProstodontikRawatanUmum;
  masterForm.setBaruPenuhJumlahDenturProstodontikRawatanUmum =
    setBaruPenuhJumlahDenturProstodontikRawatanUmum;
  const [
    semulaPenuhJumlahDenturProstodontikRawatanUmum,
    setSemulaPenuhJumlahDenturProstodontikRawatanUmum,
  ] = useState('');
  masterForm.semulaPenuhJumlahDenturProstodontikRawatanUmum =
    semulaPenuhJumlahDenturProstodontikRawatanUmum;
  masterForm.setSemulaPenuhJumlahDenturProstodontikRawatanUmum =
    setSemulaPenuhJumlahDenturProstodontikRawatanUmum;
  const [
    baruSeparaJumlahDenturProstodontikRawatanUmum,
    setBaruSeparaJumlahDenturProstodontikRawatanUmum,
  ] = useState('');
  masterForm.baruSeparaJumlahDenturProstodontikRawatanUmum =
    baruSeparaJumlahDenturProstodontikRawatanUmum;
  masterForm.setBaruSeparaJumlahDenturProstodontikRawatanUmum =
    setBaruSeparaJumlahDenturProstodontikRawatanUmum;
  const [
    semulaSeparaJumlahDenturProstodontikRawatanUmum,
    setSemulaSeparaJumlahDenturProstodontikRawatanUmum,
  ] = useState('');
  masterForm.semulaSeparaJumlahDenturProstodontikRawatanUmum =
    semulaSeparaJumlahDenturProstodontikRawatanUmum;
  masterForm.setSemulaSeparaJumlahDenturProstodontikRawatanUmum =
    setSemulaSeparaJumlahDenturProstodontikRawatanUmum;
  const [
    immediateDenturProstodontikRawatanUmum,
    setImmediateDenturProstodontikRawatanUmum,
  ] = useState('');
  masterForm.immediateDenturProstodontikRawatanUmum =
    immediateDenturProstodontikRawatanUmum;
  masterForm.setImmediateDenturProstodontikRawatanUmum =
    setImmediateDenturProstodontikRawatanUmum;
  const [
    pembaikanDenturProstodontikRawatanUmum,
    setPembaikanDenturProstodontikRawatanUmum,
  ] = useState('');
  masterForm.pembaikanDenturProstodontikRawatanUmum =
    pembaikanDenturProstodontikRawatanUmum;
  masterForm.setPembaikanDenturProstodontikRawatanUmum =
    setPembaikanDenturProstodontikRawatanUmum;
  const [penskaleranRawatanUmum, setPenskaleranRawatanUmum] = useState(false);
  masterForm.penskaleranRawatanUmum = penskaleranRawatanUmum;
  masterForm.setPenskaleranRawatanUmum = setPenskaleranRawatanUmum;
  const [
    rawatanLainPeriodontikRawatanUmum,
    setRawatanLainPeriodontikRawatanUmum,
  ] = useState(false);
  masterForm.rawatanLainPeriodontikRawatanUmum =
    rawatanLainPeriodontikRawatanUmum;
  masterForm.setRawatanLainPeriodontikRawatanUmum =
    setRawatanLainPeriodontikRawatanUmum;
  const [rawatanOrtodontikRawatanUmum, setRawatanOrtodontikRawatanUmum] =
    useState(false);
  masterForm.rawatanOrtodontikRawatanUmum = rawatanOrtodontikRawatanUmum;
  masterForm.setRawatanOrtodontikRawatanUmum = setRawatanOrtodontikRawatanUmum;
  const [kesPerubatanMulutRawatanUmum, setKesPerubatanMulutRawatanUmum] =
    useState(false);
  masterForm.kesPerubatanMulutRawatanUmum = kesPerubatanMulutRawatanUmum;
  masterForm.setKesPerubatanMulutRawatanUmum = setKesPerubatanMulutRawatanUmum;
  const [
    bilanganXrayYangDiambilRawatanUmum,
    setBilanganXrayYangDiambilRawatanUmum,
  ] = useState('');
  masterForm.bilanganXrayYangDiambilRawatanUmum =
    bilanganXrayYangDiambilRawatanUmum;
  masterForm.setBilanganXrayYangDiambilRawatanUmum =
    setBilanganXrayYangDiambilRawatanUmum;
  const [
    gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum,
    setGdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum,
  ] = useState('');
  masterForm.gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  masterForm.setGdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    setGdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  const [
    gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum,
    setGdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum,
  ] = useState('');
  masterForm.gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  masterForm.setGdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    setGdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  const [
    gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum,
    setGkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum,
  ] = useState('');
  masterForm.gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  masterForm.setGkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    setGkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  const [
    gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum,
    setGkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum,
  ] = useState('');
  masterForm.gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  masterForm.setGkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    setGkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  const [
    gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum,
    setGdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum,
  ] = useState('');
  masterForm.gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  masterForm.setGdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    setGdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  const [
    gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum,
    setGdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum,
  ] = useState('');
  masterForm.gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  masterForm.setGdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    setGdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  const [
    gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum,
    setGkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum,
  ] = useState('');
  masterForm.gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  masterForm.setGkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    setGkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  const [
    gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum,
    setGkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum,
  ] = useState('');
  masterForm.gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  masterForm.setGkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    setGkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  const [
    gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum,
    setGdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum,
  ] = useState('');
  masterForm.gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum =
    gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum;
  masterForm.setGdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum =
    setGdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum;
  const [
    gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum,
    setGdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum,
  ] = useState('');
  masterForm.gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum =
    gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum;
  masterForm.setGdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum =
    setGdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum;
  const [
    gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum,
    setGkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum,
  ] = useState('');
  masterForm.gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum =
    gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum;
  masterForm.setGkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum =
    setGkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum;
  const [
    gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum,
    setGkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum,
  ] = useState('');
  masterForm.gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum =
    gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum;
  masterForm.setGkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum =
    setGkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum;
  const [
    baruInlayOnlayJumlahTampalanDibuatRawatanUmum,
    setBaruInlayOnlayJumlahTampalanDibuatRawatanUmum,
  ] = useState('');
  masterForm.baruInlayOnlayJumlahTampalanDibuatRawatanUmum =
    baruInlayOnlayJumlahTampalanDibuatRawatanUmum;
  masterForm.setBaruInlayOnlayJumlahTampalanDibuatRawatanUmum =
    setBaruInlayOnlayJumlahTampalanDibuatRawatanUmum;
  const [
    semulaInlayOnlayJumlahTampalanDibuatRawatanUmum,
    setSemulaInlayOnlayJumlahTampalanDibuatRawatanUmum,
  ] = useState('');
  masterForm.semulaInlayOnlayJumlahTampalanDibuatRawatanUmum =
    semulaInlayOnlayJumlahTampalanDibuatRawatanUmum;
  masterForm.setSemulaInlayOnlayJumlahTampalanDibuatRawatanUmum =
    setSemulaInlayOnlayJumlahTampalanDibuatRawatanUmum;
  const [
    jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum,
    setJumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum,
  ] = useState('');
  masterForm.jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum =
    jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum;
  masterForm.setJumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum =
    setJumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum;
  // const [
  //   jumlahAnteriorRawatanSemulaKeppRawatanUmum,
  //   setJumlahAnteriorRawatanSemulaKeppRawatanUmum,
  // ] = useState('');
  // masterForm.jumlahAnteriorRawatanSemulaKeppRawatanUmum =
  //   jumlahAnteriorRawatanSemulaKeppRawatanUmum;
  // masterForm.setJumlahAnteriorRawatanSemulaKeppRawatanUmum =
  //   setJumlahAnteriorRawatanSemulaKeppRawatanUmum;
  // const [
  //   jumlahPremolarRawatanSemulaKeppRawatanUmum,
  //   setJumlahPremolarRawatanSemulaKeppRawatanUmum,
  // ] = useState('');
  // masterForm.jumlahPremolarRawatanSemulaKeppRawatanUmum =
  //   jumlahPremolarRawatanSemulaKeppRawatanUmum;
  // masterForm.setJumlahPremolarRawatanSemulaKeppRawatanUmum =
  //   setJumlahPremolarRawatanSemulaKeppRawatanUmum;
  // const [
  //   jumlahMolarRawatanSemulaKeppRawatanUmum,
  //   setJumlahMolarRawatanSemulaKeppRawatanUmum,
  // ] = useState('');
  // masterForm.jumlahMolarRawatanSemulaKeppRawatanUmum =
  //   jumlahMolarRawatanSemulaKeppRawatanUmum;
  // masterForm.setJumlahMolarRawatanSemulaKeppRawatanUmum =
  //   setJumlahMolarRawatanSemulaKeppRawatanUmum;
  const [
    jumlahAnteriorKesEndodontikSelesaiRawatanUmum,
    setJumlahAnteriorKesEndodontikSelesaiRawatanUmum,
  ] = useState('');
  masterForm.jumlahAnteriorKesEndodontikSelesaiRawatanUmum =
    jumlahAnteriorKesEndodontikSelesaiRawatanUmum;
  masterForm.setJumlahAnteriorKesEndodontikSelesaiRawatanUmum =
    setJumlahAnteriorKesEndodontikSelesaiRawatanUmum;
  const [
    jumlahPremolarKesEndodontikSelesaiRawatanUmum,
    setJumlahPremolarKesEndodontikSelesaiRawatanUmum,
  ] = useState('');
  masterForm.jumlahPremolarKesEndodontikSelesaiRawatanUmum =
    jumlahPremolarKesEndodontikSelesaiRawatanUmum;
  masterForm.setJumlahPremolarKesEndodontikSelesaiRawatanUmum =
    setJumlahPremolarKesEndodontikSelesaiRawatanUmum;
  const [
    jumlahMolarKesEndodontikSelesaiRawatanUmum,
    setJumlahMolarKesEndodontikSelesaiRawatanUmum,
  ] = useState('');
  masterForm.jumlahMolarKesEndodontikSelesaiRawatanUmum =
    jumlahMolarKesEndodontikSelesaiRawatanUmum;
  masterForm.setJumlahMolarKesEndodontikSelesaiRawatanUmum =
    setJumlahMolarKesEndodontikSelesaiRawatanUmum;
  const [
    rawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum,
    setRawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum,
  ] = useState('');
  masterForm.rawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum =
    rawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum;
  masterForm.setRawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum =
    setRawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum;
  const [
    memenuhiRditnKod3KesRujukUpprRawatanUmum,
    setMemenuhiRditnKod3KesRujukUpprRawatanUmum,
  ] = useState('');
  masterForm.memenuhiRditnKod3KesRujukUpprRawatanUmum =
    memenuhiRditnKod3KesRujukUpprRawatanUmum;
  masterForm.setMemenuhiRditnKod3KesRujukUpprRawatanUmum =
    setMemenuhiRditnKod3KesRujukUpprRawatanUmum;
  const [
    restorasiPascaEndodontikKesRujukUpprRawatanUmum,
    setRestorasiPascaEndodontikKesRujukUpprRawatanUmum,
  ] = useState('');
  masterForm.restorasiPascaEndodontikKesRujukUpprRawatanUmum =
    restorasiPascaEndodontikKesRujukUpprRawatanUmum;
  masterForm.setRestorasiPascaEndodontikKesRujukUpprRawatanUmum =
    setRestorasiPascaEndodontikKesRujukUpprRawatanUmum;
  const [
    komplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum,
    setKomplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum,
  ] = useState('');
  masterForm.komplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum =
    komplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum;
  masterForm.setKomplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum =
    setKomplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum;
  const [kesSelesaiRawatanUmum, setKesSelesaiRawatanUmum] = useState(false);
  masterForm.kesSelesaiRawatanUmum = kesSelesaiRawatanUmum;
  masterForm.setKesSelesaiRawatanUmum = setKesSelesaiRawatanUmum;
  //promosi
  const [ceramahPromosiUmum, setCeramahPromosiUmum] = useState('');
  masterForm.ceramahPromosiUmum = ceramahPromosiUmum;
  masterForm.setCeramahPromosiUmum = setCeramahPromosiUmum;
  const [lmgPromosiUmum, setLmgPromosiUmum] = useState('');
  masterForm.lmgPromosiUmum = lmgPromosiUmum;
  masterForm.setLmgPromosiUmum = setLmgPromosiUmum;
  const [
    melaksanakanAktivitiBeginPromosiUmum,
    setMelaksanakanAktivitiBeginPromosiUmum,
  ] = useState('');
  masterForm.melaksanakanAktivitiBeginPromosiUmum =
    melaksanakanAktivitiBeginPromosiUmum;
  masterForm.setMelaksanakanAktivitiBeginPromosiUmum =
    setMelaksanakanAktivitiBeginPromosiUmum;
  const [lawatanKeRumahPromosiUmum, setLawatanKeRumahPromosiUmum] =
    useState('');
  masterForm.lawatanKeRumahPromosiUmum = lawatanKeRumahPromosiUmum;
  masterForm.setLawatanKeRumahPromosiUmum = setLawatanKeRumahPromosiUmum;
  const [
    plakGigiNasihatPergigianIndividuPromosiUmum,
    setPlakGigiNasihatPergigianIndividuPromosiUmum,
  ] = useState(false);
  masterForm.plakGigiNasihatPergigianIndividuPromosiUmum =
    plakGigiNasihatPergigianIndividuPromosiUmum;
  masterForm.setPlakGigiNasihatPergigianIndividuPromosiUmum =
    setPlakGigiNasihatPergigianIndividuPromosiUmum;
  const [
    penjagaanKesihatanOralNasihatPergigianIndividuPromosiUmum,
    setPenjagaanKesihatanOralNasihatPergigianIndividuPromosiUmum,
  ] = useState(false);
  masterForm.penjagaanKesihatanOralNasihatPergigianIndividuPromosiUmum =
    penjagaanKesihatanOralNasihatPergigianIndividuPromosiUmum;
  masterForm.setPenjagaanKesihatanOralNasihatPergigianIndividuPromosiUmum =
    setPenjagaanKesihatanOralNasihatPergigianIndividuPromosiUmum;
  const [
    dietPemakananNasihatPergigianIndividuPromosiUmum,
    setDietPemakananNasihatPergigianIndividuPromosiUmum,
  ] = useState(false);
  masterForm.dietPemakananNasihatPergigianIndividuPromosiUmum =
    dietPemakananNasihatPergigianIndividuPromosiUmum;
  masterForm.setDietPemakananNasihatPergigianIndividuPromosiUmum =
    setDietPemakananNasihatPergigianIndividuPromosiUmum;
  const [
    kanserMulutNasihatPergigianIndividuPromosiUmum,
    setKanserMulutNasihatPergigianIndividuPromosiUmum,
  ] = useState(false);
  masterForm.kanserMulutNasihatPergigianIndividuPromosiUmum =
    kanserMulutNasihatPergigianIndividuPromosiUmum;
  masterForm.setKanserMulutNasihatPergigianIndividuPromosiUmum =
    setKanserMulutNasihatPergigianIndividuPromosiUmum;
  const [
    umur1517BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum,
    setUmur1517BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum,
  ] = useState('');
  masterForm.umur1517BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum =
    umur1517BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum;
  masterForm.setUmur1517BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum =
    setUmur1517BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum;
  const [
    umur1819BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum,
    setUmur1819BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum,
  ] = useState('');
  masterForm.umur1819BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum =
    umur1819BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum;
  masterForm.setUmur1819BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum =
    setUmur1819BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum;
  const [
    umur2029BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum,
    setUmur2029BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum,
  ] = useState('');
  masterForm.umur2029BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum =
    umur2029BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum;
  masterForm.setUmur2029BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum =
    setUmur2029BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum;
  const [
    umur3049BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum,
    setUmur3049BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum,
  ] = useState('');
  masterForm.umur3049BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum =
    umur3049BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum;
  masterForm.setUmur3049BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum =
    setUmur3049BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum;
  const [
    umur5059BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum,
    setUmur5059BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum,
  ] = useState('');
  masterForm.umur5059BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum =
    umur5059BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum;
  masterForm.setUmur5059BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum =
    setUmur5059BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum;
  const [
    umur60KeAtasBilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum,
    setUmur60KeAtasBilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum,
  ] = useState('');
  masterForm.umur60KeAtasBilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum =
    umur60KeAtasBilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum;
  masterForm.setUmur60KeAtasBilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum =
    setUmur60KeAtasBilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum;
  const [
    dirujukKaunselingPakarPublicHealthPromosiUmum,
    setDirujukKaunselingPakarPublicHealthPromosiUmum,
  ] = useState(false);
  masterForm.dirujukKaunselingPakarPublicHealthPromosiUmum =
    dirujukKaunselingPakarPublicHealthPromosiUmum;
  masterForm.setDirujukKaunselingPakarPublicHealthPromosiUmum =
    setDirujukKaunselingPakarPublicHealthPromosiUmum;
  //kotak
  const [statusMUmum, setStatusMUmum] = useState('');
  masterForm.statusMUmum = statusMUmum;
  masterForm.setStatusMUmum = setStatusMUmum;
  const [jenisRUmum, setJenisRUmum] = useState('');
  masterForm.jenisRUmum = jenisRUmum;
  masterForm.setJenisRUmum = setJenisRUmum;
  const [tarikh1Umum, setTarikh1Umum] = useState('');
  masterForm.tarikh1Umum = tarikh1Umum;
  masterForm.setTarikh1Umum = setTarikh1Umum;
  const [tarikh2Umum, setTarikh2Umum] = useState('');
  masterForm.tarikh2Umum = tarikh2Umum;
  masterForm.setTarikh2Umum = setTarikh2Umum;
  const [tarikh3Umum, setTarikh3Umum] = useState('');
  masterForm.tarikh3Umum = tarikh3Umum;
  masterForm.setTarikh3Umum = setTarikh3Umum;
  const [tarikh4Umum, setTarikh4Umum] = useState('');
  masterForm.tarikh4Umum = tarikh4Umum;
  masterForm.setTarikh4Umum = setTarikh4Umum;
  const [adaQUmum, setAdaQUmum] = useState(false);
  masterForm.adaQUmum = adaQUmum;
  masterForm.setAdaQUmum = setAdaQUmum;
  const [tiadaQUmum, setTiadaQUmum] = useState(false);
  masterForm.tiadaQUmum = tiadaQUmum;
  masterForm.setTiadaQUmum = setTiadaQUmum;
  const [rujukGUmum, setRujukGUmum] = useState(false);
  masterForm.rujukGUmum = rujukGUmum;
  masterForm.setRujukGUmum = setRujukGUmum;
  const [tarikhQUmum, setTarikhQUmum] = useState('');
  masterForm.tarikhQUmum = tarikhQUmum;
  masterForm.setTarikhQUmum = setTarikhQUmum;
  const [statusSelepas6BulanUmum, setStatusSelepas6BulanUmum] = useState('');
  masterForm.statusSelepas6BulanUmum = statusSelepas6BulanUmum;
  masterForm.setStatusSelepas6BulanUmum = setStatusSelepas6BulanUmum;

  // calculate total dmfx + sm desidus
  useEffect(() => {
    setSumDMFXDesidusUmum(
      parseInt(dAdaGigiDesidusPemeriksaanUmum) +
        parseInt(mAdaGigiDesidusPemeriksaanUmum) +
        parseInt(fAdaGigiDesidusPemeriksaanUmum) +
        parseInt(xAdaGigiDesidusPemeriksaanUmum)
    );
  }, [
    dAdaGigiDesidusPemeriksaanUmum,
    mAdaGigiDesidusPemeriksaanUmum,
    fAdaGigiDesidusPemeriksaanUmum,
    xAdaGigiDesidusPemeriksaanUmum,
  ]);

  // calculate total DMFEX
  useEffect(() => {
    setSumDMFXKekalUmum(
      parseInt(dAdaGigiKekalPemeriksaanUmum) +
        parseInt(mAdaGigiKekalPemeriksaanUmum) +
        parseInt(fAdaGigiKekalPemeriksaanUmum) +
        parseInt(xAdaGigiKekalPemeriksaanUmum) +
        parseInt(eAdaGigiKekalPemeriksaanUmum)
    );
  }, [
    dAdaGigiKekalPemeriksaanUmum,
    mAdaGigiKekalPemeriksaanUmum,
    fAdaGigiKekalPemeriksaanUmum,
    xAdaGigiKekalPemeriksaanUmum,
    eAdaGigiKekalPemeriksaanUmum,
  ]);

  useEffect(() => {
    const fetchSinglePersonUmum = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/api/v1/umum/${personUmumId}`, {
          headers: {
            Authorization: `Bearer ${
              reliefUserToken ? reliefUserToken : userToken
            }`,
          },
        });
        setSinglePersonUmum(data.singlePersonUmum);
        //map fasiliti perkhidmatan
        setJenisFasiliti(data.singlePersonUmum.jenisFasiliti);
        setKepp(data.singlePersonUmum.kepp);
        setJenisProgramKomuniti(data.singlePersonUmum.jenisProgramKomuniti);
        //map maklumat lanjut
        setKedatangan(data.singlePersonUmum.kedatangan);
        setFasilitiTaskaTadika(data.singlePersonUmum.fasilitiTaskaTadika);
        setJenisTaskaTadika(data.singlePersonUmum.jenisTaskaTadika);
        setKelasToddler(data.singlePersonUmum.kelasToddler);
        setNamaFasilitiTaskaTadika(
          data.singlePersonUmum.namaFasilitiTaskaTadika
        );
        setEnrolmenTaskaTadika(data.singlePersonUmum.enrolmenTaskaTadika);
        setKedatanganTaskaTadika(data.singlePersonUmum.kedatanganTaskaTadika);
        setEngganTaskaTadika(data.singlePersonUmum.engganTaskaTadika);
        setTidakHadirTaskaTadika(data.singlePersonUmum.tidakHadirTaskaTadika);
        setPemeriksaanTaskaTadika(data.singlePersonUmum.pemeriksaanTaskaTadika);
        setYaTidakIbuMengandung(data.singlePersonUmum.yaTidakIbuMengandung);
        setBaruUlanganIbuMengandung(
          data.singlePersonUmum.baruUlanganIbuMengandung
        );
        setKedatanganKepp(data.singlePersonUmum.kedatanganKepp);
        setTarikhRujukanKepp(data.singlePersonUmum.tarikhRujukan);
        setTarikhMulaRawatanKepp(data.singlePersonUmum.tarikhMulaRawatan);
        setKpBergerakMaklumatLanjutUmum(
          data.singlePersonUmum.kpBergerakMaklumatLanjutUmum
        );
        setLabelKpBergerakMaklumatLanjutUmum(
          data.singlePersonUmum.labelKpBergerakMaklumatLanjutUmum
        );
        setPasukanPergigianBergerakMaklumatLanjutUmum(
          data.singlePersonUmum.pasukanPergigianBergerakMaklumatLanjutUmum
        );
        setMakmalPergigianBergerakMaklumatLanjutUmum(
          data.singlePersonUmum.makmalPergigianBergerakMaklumatLanjutUmum
        );
        setLabelMakmalPergigianBergerakMaklumatLanjutUmum(
          data.singlePersonUmum.labelMakmalPergigianBergerakMaklumatLanjutUmum
        );
        setKgAngkat(data.singlePersonUmum.kgAngkat);
        setInstitusiPengajianTinggiKolej(
          data.singlePersonUmum.institusiPengajianTinggiKolej
        );
        setIpgInstitusiPengajianTinggiKolej(
          data.singlePersonUmum.ipgInstitusiPengajianTinggiKolej
        );
        setKolejKomunitiInstitusiPengajianTinggiKolej(
          data.singlePersonUmum.kolejKomunitiInstitusiPengajianTinggiKolej
        );
        setPoliteknikInstitusiPengajianTinggiKolej(
          data.singlePersonUmum.politeknikInstitusiPengajianTinggiKolej
        );
        setInstitutLatihanKerajaanInstitusiPengajianTinggiKolej(
          data.singlePersonUmum
            .institutLatihanKerajaanInstitusiPengajianTinggiKolej
        );
        setGiatmaraInstitusiPengajianTinggiKolej(
          data.singlePersonUmum.giatmaraInstitusiPengajianTinggiKolej
        );
        setEnrolmenInstitusiPengajianTinggiKolej(
          data.singlePersonUmum.enrolmenInstitusiPengajianTinggiKolej
        );
        setInstitusiOku(data.singlePersonUmum.institusiOku);
        setInstitusiWargaEmas(data.singlePersonUmum.institusiWargaEmas);
        setKerajaanInstitusiWargaEmas(
          data.singlePersonUmum.kerajaanInstitusiWargaEmas
        );
        setSwastaInstitusiWargaEmas(
          data.singlePersonUmum.swastaInstitusiWargaEmas
        );
        //map pemeriksaan
        setAdaCleftLipPemeriksaanUmum(
          data.singlePersonUmum.adaCleftLipPemeriksaanUmum
        );
        setRujukCleftLipPemeriksaanUmum(
          data.singlePersonUmum.rujukCleftLipPemeriksaanUmum
        );
        setYaTidakSediaAdaStatusDenturePemeriksaanUmum(
          data.singlePersonUmum.yaTidakSediaAdaStatusDenturePemeriksaanUmum
        );
        setSeparaPenuhAtasSediaAdaDenturePemeriksaanUmum(
          data.singlePersonUmum.separaPenuhAtasSediaAdaDenturePemeriksaanUmum
        );
        setSeparaPenuhBawahSediaAdaDenturePemeriksaanUmum(
          data.singlePersonUmum.separaPenuhBawahSediaAdaDenturePemeriksaanUmum
        );
        setYaTidakPerluStatusDenturePemeriksaanUmum(
          data.singlePersonUmum.yaTidakPerluStatusDenturePemeriksaanUmum
        );
        setSeparaPenuhAtasPerluDenturePemeriksaanUmum(
          data.singlePersonUmum.separaPenuhAtasPerluDenturePemeriksaanUmum
        );
        setSeparaPenuhBawahPerluDenturePemeriksaanUmum(
          data.singlePersonUmum.separaPenuhBawahPerluDenturePemeriksaanUmum
        );
        setToothSurfaceLossTraumaPemeriksaanUmum(
          data.singlePersonUmum.toothSurfaceLossTraumaPemeriksaanUmum
        );
        // setKecederaanGigiAnteriorTraumaPemeriksaanUmum(
        //   data.singlePersonUmum.kecederaanGigiAnteriorTraumaPemeriksaanUmum
        // );
        // setTisuLembutTraumaPemeriksaanUmum(
        //   data.singlePersonUmum.tisuLembutTraumaPemeriksaanUmum
        // );
        // setTisuKerasTraumaPemeriksaanUmum(
        //   data.singlePersonUmum.tisuKerasTraumaPemeriksaanUmum
        // );
        setFissureSealantPemeriksaanUmum(data.singlePersonUmum.fissureSealant);
        setBaruJumlahGigiKekalPerluFSRawatanUmum(
          data.singlePersonUmum.baruJumlahGigiKekalPerluFSRawatanUmum
        );
        setFvPerluSapuanPemeriksaanUmum(
          data.singlePersonUmum.fvPerluSapuanPemeriksaanUmum
        );
        setPrrJenis1PemeriksaanUmum(
          data.singlePersonUmum.prrJenis1PemeriksaanUmum
        );
        setBaruJumlahGigiKekalPerluPRRJenis1RawatanUmum(
          data.singlePersonUmum.baruJumlahGigiKekalPerluPRRJenis1RawatanUmum
        );
        setYaTidakSilverDiamineFluoridePerluSapuanPemeriksaanUmum(
          data.singlePersonUmum
            .yaTidakSilverDiamineFluoridePerluSapuanPemeriksaanUmum
        );
        // kotak masuk sini
        setStatusMPemeriksaanUmum(data.singlePersonUmum.statusMPemeriksaanUmum);
        setJenisRPemeriksaanUmum(data.singlePersonUmum.jenisRPemeriksaanUmum);
        setKebersihanMulutOralHygienePemeriksaanUmum(
          data.singlePersonUmum.kebersihanMulutOralHygienePemeriksaanUmum
        );
        setSkorBpeOralHygienePemeriksaanUmum(
          data.singlePersonUmum.skorBpeOralHygienePemeriksaanUmum
        );
        setSkorGisMulutOralHygienePemeriksaanUmum(
          data.singlePersonUmum.skorGisMulutOralHygienePemeriksaanUmum
        );
        setPerluPenskaleranPemeriksaanUmum(
          data.singlePersonUmum.perluPenskaleranPemeriksaanUmum
        );
        setAdaDesidusPemeriksaanUmum(
          data.singlePersonUmum.adaDesidusPemeriksaanUmum
        );
        setDAdaGigiDesidusPemeriksaanUmum(
          data.singlePersonUmum.dAdaGigiDesidusPemeriksaanUmum
        );
        setMAdaGigiDesidusPemeriksaanUmum(
          data.singlePersonUmum.mAdaGigiDesidusPemeriksaanUmum
        );
        setFAdaGigiDesidusPemeriksaanUmum(
          data.singlePersonUmum.fAdaGigiDesidusPemeriksaanUmum
        );
        // setSmAdaGigiDesidusPemeriksaanUmum(
        //   data.singlePersonUmum.smAdaGigiDesidusPemeriksaanUmum
        // );
        setXAdaGigiDesidusPemeriksaanUmum(
          data.singlePersonUmum.xAdaGigiDesidusPemeriksaanUmum
        );
        setAdaKekalPemeriksaanUmum(
          data.singlePersonUmum.adaKekalPemeriksaanUmum
        );
        setDAdaGigiKekalPemeriksaanUmum(
          data.singlePersonUmum.dAdaGigiKekalPemeriksaanUmum
        );
        setMAdaGigiKekalPemeriksaanUmum(
          data.singlePersonUmum.mAdaGigiKekalPemeriksaanUmum
        );
        setFAdaGigiKekalPemeriksaanUmum(
          data.singlePersonUmum.fAdaGigiKekalPemeriksaanUmum
        );
        setEAdaGigiKekalPemeriksaanUmum(
          data.singlePersonUmum.eAdaGigiKekalPemeriksaanUmum
        );
        setXAdaGigiKekalPemeriksaanUmum(
          data.singlePersonUmum.xAdaGigiKekalPemeriksaanUmum
        );
        setJumlahFaktorRisikoPemeriksaanUmum(
          data.singlePersonUmum.jumlahFaktorRisikoPemeriksaanUmum
        );
        // setEdentulousWargaEmasPemeriksaanUmum(
        //   data.singlePersonUmum.edentulousWargaEmasPemeriksaanUmum
        // );
        // setMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum(
        //   data.singlePersonUmum
        //     .mempunyai20GigiEdentulousWargaEmasPemeriksaanUmum
        // );
        setBilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum(
          data.singlePersonUmum
            .bilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum
        );
        setDisaringProgramKanserMulutPemeriksaanUmum(
          data.singlePersonUmum.disaringProgramKanserMulutPemeriksaanUmum
        );
        setDirujukProgramKanserMulutPemeriksaanUmum(
          data.singlePersonUmum.dirujukProgramKanserMulutPemeriksaanUmum
        );
        setLesiMulutPemeriksaanUmum(
          data.singlePersonUmum.lesiMulutPemeriksaanUmum
        );
        setTabiatBerisikoTinggiPemeriksaanUmum(
          data.singlePersonUmum.tabiatBerisikoTinggiPemeriksaanUmum
        );
        setJumlahAnteriorKesEndodontikDiperlukanPemeriksaanUmum(
          data.singlePersonUmum
            .jumlahAnteriorKesEndodontikDiperlukanPemeriksaanUmum
        );
        setJumlahPremolarKesEndodontikDiperlukanPemeriksaanUmum(
          data.singlePersonUmum
            .jumlahPremolarKesEndodontikDiperlukanPemeriksaanUmum
        );
        setJumlahMolarKesEndodontikDiperlukanPemeriksaanUmum(
          data.singlePersonUmum
            .jumlahMolarKesEndodontikDiperlukanPemeriksaanUmum
        );
        setRawatanSemulaEndodontikDariPrimerKesEndodontikDiperlukanPemeriksaanUmum(
          data.singlePersonUmum
            .rawatanSemulaEndodontikDariPrimerKesEndodontikDiperlukanPemeriksaanUmum
        );
        setRawatanLainKesEndodontikDiperlukanPemeriksaanUmum(
          data.singlePersonUmum
            .rawatanLainKesEndodontikDiperlukanPemeriksaanUmum
        );
        setCabutanKesEndodontikDiperlukanPemeriksaanUmum(
          data.singlePersonUmum.cabutanKesEndodontikDiperlukanPemeriksaanUmum
        );
        setTampalanKesEndodontikDiperlukanPemeriksaanUmum(
          data.singlePersonUmum.tampalanKesEndodontikDiperlukanPemeriksaanUmum
        );
        //map rawatan umum
        setPesakitDibuatFissureSealant(
          data.singlePersonUmum.pesakitDibuatFissureSealant
        );
        setBaruJumlahGigiKekalDibuatFSRawatanUmum(
          data.singlePersonUmum.baruJumlahGigiKekalDibuatFSRawatanUmum
        );
        // setSemulaJumlahGigiKekalDibuatFSRawatanUmum(
        //   data.singlePersonUmum.semulaJumlahGigiKekalDibuatFSRawatanUmum
        // );
        // setBaruJumlahMuridDibuatFsRawatanUmum(
        //   data.singlePersonUmum.baruJumlahMuridDibuatFsRawatanUmum
        // );
        // setSemulaJumlahMuridDibuatFsRawatanUmum(
        //   data.singlePersonUmum.semulaJumlahMuridDibuatFsRawatanUmum
        // );
        setPesakitDibuatFluorideVarnish(
          data.singlePersonUmum.pesakitDibuatFluorideVarnish
        );
        // setBaruJumlahGigiKekalDiberiFVRawatanUmum(
        //   data.singlePersonUmum.baruJumlahGigiKekalDiberiFVRawatanUmum
        // );
        // setSemulaJumlahGigiKekalDiberiFVRawatanUmum(
        //   data.singlePersonUmum.semulaJumlahGigiKekalDiberiFVRawatanUmum
        // );
        // setBaruJumlahMuridDibuatFVRawatanUmum(
        //   data.singlePersonUmum.baruJumlahMuridDibuatFVRawatanUmum
        // );
        // setSemulaJumlahMuridDibuatFVRawatanUmum(
        //   data.singlePersonUmum.semulaJumlahMuridDibuatFVRawatanUmum
        // );
        setPesakitDibuatPRRJenis1(data.singlePersonUmum.pesakitDibuatPRRJenis1);
        setBaruJumlahGigiKekalDiberiPRRJenis1RawatanUmum(
          data.singlePersonUmum.baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum
        );
        // setSemulaJumlahGigiKekalDiberiPRRJenis1RawatanUmum(
        //   data.singlePersonUmum.semulaJumlahGigiKekalDiberiPRRJenis1RawatanUmum
        // );
        // setBaruJumlahMuridDiberiPrrJenis1RawatanUmum(
        //   data.singlePersonUmum.baruJumlahMuridDiberiPrrJenis1RawatanUmum
        // );
        // setSemulaJumlahMuridDiberiPrrJenis1RawatanUmum(
        //   data.singlePersonUmum.semulaJumlahMuridDiberiPrrJenis1RawatanUmum
        // );
        setCabutDesidusRawatanUmum(
          data.singlePersonUmum.cabutDesidusRawatanUmum
        );
        setCabutKekalRawatanUmum(data.singlePersonUmum.cabutKekalRawatanUmum);
        setKomplikasiSelepasCabutanRawatanUmum(
          data.singlePersonUmum.komplikasiSelepasCabutanRawatanUmum
        );
        setCabutanDisebabkanPeriodontitisRawatanUmum(
          data.singlePersonUmum.cabutanDisebabkanPeriodontitisRawatanUmum
        );
        setYaTidakAbsesPembedahanRawatanUmum(
          data.singlePersonUmum.yaTidakAbsesPembedahanRawatanUmum
        );
        // setBaruSemulaAbsesPembedahanRawatanUmum(
        //   data.singlePersonUmum.baruSemulaAbsesPembedahanRawatanUmum
        // );
        setCabutanSurgikalPembedahanMulutRawatanUmum(
          data.singlePersonUmum.cabutanSurgikalPembedahanMulutRawatanUmum
        );
        setYaTidakFrakturPembedahanRawatanUmum(
          data.singlePersonUmum.yaTidakFrakturPembedahanRawatanUmum
        );
        setYaTidakPembedahanKecilMulutPembedahanRawatanUmum(
          data.singlePersonUmum.yaTidakPembedahanKecilMulutPembedahanRawatanUmum
        );
        setYaTidakTraumaPembedahanRawatanUmum(
          data.singlePersonUmum.yaTidakTraumaPembedahanRawatanUmum
        );
        setKecederaanTulangMukaUmum(
          data.singlePersonUmum.kecederaanTulangMukaUmum
        );
        setKecederaanGigiUmum(data.singlePersonUmum.kecederaanGigiUmum);
        setKecederaanTisuLembutUmum(
          data.singlePersonUmum.kecederaanTisuLembutUmum
        );
        setBaruJumlahGigiYangDiberiSdfRawatanUmum(
          data.singlePersonUmum.baruJumlahGigiYangDiberiSdfRawatanUmum
        );
        setSemulaJumlahGigiYangDiberiSdfRawatanUmum(
          data.singlePersonUmum.semulaJumlahGigiYangDiberiSdfRawatanUmum
        );
        setBaruJumlahCrownBridgeRawatanUmum(
          data.singlePersonUmum.baruJumlahCrownBridgeRawatanUmum
        );
        setSemulaJumlahCrownBridgeRawatanUmum(
          data.singlePersonUmum.semulaJumlahCrownBridgeRawatanUmum
        );
        setBaruJumlahPostCoreRawatanUmum(
          data.singlePersonUmum.baruJumlahPostCoreRawatanUmum
        );
        setSemulaJumlahPostCoreRawatanUmum(
          data.singlePersonUmum.semulaJumlahPostCoreRawatanUmum
        );
        setBaruPenuhJumlahDenturProstodontikRawatanUmum(
          data.singlePersonUmum.baruPenuhJumlahDenturProstodontikRawatanUmum
        );
        setSemulaPenuhJumlahDenturProstodontikRawatanUmum(
          data.singlePersonUmum.semulaPenuhJumlahDenturProstodontikRawatanUmum
        );
        setBaruSeparaJumlahDenturProstodontikRawatanUmum(
          data.singlePersonUmum.baruseparaJumlahDenturProstodontikRawatanUmum
        );
        setSemulaSeparaJumlahDenturProstodontikRawatanUmum(
          data.singlePersonUmum.semulaSeparaJumlahDenturProstodontikRawatanUmum
        );
        setImmediateDenturProstodontikRawatanUmum(
          data.singlePersonUmum.immediateDenturProstodontikRawatanUmum
        );
        setPembaikanDenturProstodontikRawatanUmum(
          data.singlePersonUmum.pembaikanDenturProstodontikRawatanUmum
        );
        setPenskaleranRawatanUmum(data.singlePersonUmum.penskaleranRawatanUmum);
        setRawatanLainPeriodontikRawatanUmum(
          data.singlePersonUmum.rawatanLainPeriodontikRawatanUmum
        );
        setRawatanOrtodontikRawatanUmum(
          data.singlePersonUmum.rawatanOrtodontikRawatanUmum
        );
        setKesPerubatanMulutRawatanUmum(
          data.singlePersonUmum.kesPerubatanMulutRawatanUmum
        );
        setBilanganXrayYangDiambilRawatanUmum(
          data.singlePersonUmum.bilanganXrayYangDiambilRawatanUmum
        );
        setGdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum(
          data.singlePersonUmum
            .gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum
        );
        setGdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum(
          data.singlePersonUmum
            .gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum
        );
        setGkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum(
          data.singlePersonUmum
            .gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum
        );
        setGkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum(
          data.singlePersonUmum
            .gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum
        );
        setGdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum(
          data.singlePersonUmum
            .gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum
        );
        setGdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum(
          data.singlePersonUmum
            .gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum
        );
        setGkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum(
          data.singlePersonUmum
            .gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum
        );
        setGkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum(
          data.singlePersonUmum
            .gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum
        );
        setGdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum(
          data.singlePersonUmum
            .gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum
        );
        setGdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum(
          data.singlePersonUmum
            .gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum
        );
        setGkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum(
          data.singlePersonUmum
            .gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum
        );
        setGkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum(
          data.singlePersonUmum
            .gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum
        );
        setBaruInlayOnlayJumlahTampalanDibuatRawatanUmum(
          data.singlePersonUmum.baruInlayOnlayJumlahTampalanDibuatRawatanUmum
        );
        setJumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum(
          data.singlePersonUmum
            .jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum
        );
        // setJumlahAnteriorRawatanSemulaKeppRawatanUmum(
        //   data.singlePersonUmum.jumlahAnteriorRawatanSemulaKeppRawatanUmum
        // );
        // setJumlahPremolarRawatanSemulaKeppRawatanUmum(
        //   data.singlePersonUmum.jumlahPremolarRawatanSemulaKeppRawatanUmum
        // );
        // setJumlahMolarRawatanSemulaKeppRawatanUmum(
        //   data.singlePersonUmum.jumlahMolarRawatanSemulaKeppRawatanUmum
        // );
        setJumlahAnteriorKesEndodontikSelesaiRawatanUmum(
          data.singlePersonUmum.jumlahAnteriorKesEndodontikSelesaiRawatanUmum
        );
        setJumlahPremolarKesEndodontikSelesaiRawatanUmum(
          data.singlePersonUmum.jumlahPremolarKesEndodontikSelesaiRawatanUmum
        );
        setJumlahMolarKesEndodontikSelesaiRawatanUmum(
          data.singlePersonUmum.jumlahMolarKesEndodontikSelesaiRawatanUmum
        );
        setRawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum(
          data.singlePersonUmum
            .rawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum
        );
        setMemenuhiRditnKod3KesRujukUpprRawatanUmum(
          data.singlePersonUmum.memenuhiRditnKod3KesRujukUpprRawatanUmum
        );
        setRestorasiPascaEndodontikKesRujukUpprRawatanUmum(
          data.singlePersonUmum.restorasiPascaEndodontikKesRujukUpprRawatanUmum
        );
        setKomplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum(
          data.singlePersonUmum
            .komplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum
        );
        setKesSelesaiRawatanUmum(data.singlePersonUmum.kesSelesaiRawatanUmum);
        //map promosi
        setCeramahPromosiUmum(data.singlePersonUmum.ceramahPromosiUmum);
        setLmgPromosiUmum(data.singlePersonUmum.lmgPromosiUmum);
        setMelaksanakanAktivitiBeginPromosiUmum(
          data.singlePersonUmum.melaksanakanAktivitiBeginPromosiUmum
        );
        setLawatanKeRumahPromosiUmum(
          data.singlePersonUmum.lawatanKeRumahPromosiUmum
        );
        setPlakGigiNasihatPergigianIndividuPromosiUmum(
          data.singlePersonUmum.plakGigiNasihatPergigianIndividuPromosiUmum
        );
        setPenjagaanKesihatanOralNasihatPergigianIndividuPromosiUmum(
          data.singlePersonUmum
            .penjagaanKesihatanOralNasihatPergigianIndividuPromosiUmum
        );
        setDietPemakananNasihatPergigianIndividuPromosiUmum(
          data.singlePersonUmum.dietPemakananNasihatPergigianIndividuPromosiUmum
        );
        setKanserMulutNasihatPergigianIndividuPromosiUmum(
          data.singlePersonUmum.kanserMulutNasihatPergigianIndividuPromosiUmum
        );
        setUmur1517BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum(
          data.singlePersonUmum
            .umur1517BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum
        );
        setUmur1819BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum(
          data.singlePersonUmum
            .umur1819BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum
        );
        setUmur2029BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum(
          data.singlePersonUmum
            .umur2029BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum
        );
        setUmur3049BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum(
          data.singlePersonUmum
            .umur3049BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum
        );
        setUmur60KeAtasBilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum(
          data.singlePersonUmum
            .umur60KeAtasBilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum
        );
        setDirujukKaunselingPakarPublicHealthPromosiUmum(
          data.singlePersonUmum.dirujukKaunselingPakarPublicHealthPromosiUmum
        );
        //map kotak
        setStatusMUmum(data.singlePersonUmum.statusMUmum);
        setJenisRUmum(data.singlePersonUmum.jenisRUmum);
        setTarikh1Umum(data.singlePersonUmum.tarikh1Umum);
        setTarikh2Umum(data.singlePersonUmum.tarikh2Umum);
        setTarikh3Umum(data.singlePersonUmum.tarikh3Umum);
        setTarikh4Umum(data.singlePersonUmum.tarikh4Umum);
        setAdaQUmum(data.singlePersonUmum.adaQUmum);
        setTiadaQUmum(data.singlePersonUmum.tiadaQUmum);
        setRujukGUmum(data.singlePersonUmum.rujukGUmum);
        setTarikhQUmum(data.singlePersonUmum.tarikhQUmum);
        setStatusSelepas6BulanUmum(
          data.singlePersonUmum.statusSelepas6BulanUmum
        );
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSinglePersonUmum();
  }, [showKemaskini]);

  const kemaskini = () => {
    setShowKemasKini(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await toast
      .promise(
        axios.patch(
          `/api/v1/umum/${personUmumId}`,
          {
            createdByUsername: masterForm.createdByUsername,
            // fasiliti perkhidmatan
            jenisFasiliti,
            kepp,
            jenisProgramKomuniti,
            //maklumat lanjut
            kedatangan,
            fasilitiTaskaTadika,
            jenisTaskaTadika,
            kelasToddler,
            namaFasilitiTaskaTadika,
            enrolmenTaskaTadika,
            kedatanganTaskaTadika,
            engganTaskaTadika,
            tidakHadirTaskaTadika,
            pemeriksaanTaskaTadika,
            yaTidakIbuMengandung,
            baruUlanganIbuMengandung,
            kedatanganKepp,
            tarikhRujukanKepp,
            tarikhMulaRawatanKepp,
            kpBergerakMaklumatLanjutUmum,
            labelKpBergerakMaklumatLanjutUmum,
            pasukanPergigianBergerakMaklumatLanjutUmum,
            makmalPergigianBergerakMaklumatLanjutUmum,
            labelMakmalPergigianBergerakMaklumatLanjutUmum,
            kgAngkat,
            institusiPengajianTinggiKolej,
            ipgInstitusiPengajianTinggiKolej,
            kolejKomunitiInstitusiPengajianTinggiKolej,
            politeknikInstitusiPengajianTinggiKolej,
            institutLatihanKerajaanInstitusiPengajianTinggiKolej,
            giatmaraInstitusiPengajianTinggiKolej,
            enrolmenInstitusiPengajianTinggiKolej,
            institusiOku,
            institusiWargaEmas,
            kerajaanInstitusiWargaEmas,
            swastaInstitusiWargaEmas,
            // pemeriksaan
            adaCleftLipPemeriksaanUmum,
            rujukCleftLipPemeriksaanUmum,
            yaTidakSediaAdaStatusDenturePemeriksaanUmum,
            separaPenuhAtasSediaAdaDenturePemeriksaanUmum,
            separaPenuhBawahSediaAdaDenturePemeriksaanUmum,
            yaTidakPerluStatusDenturePemeriksaanUmum,
            separaPenuhAtasPerluDenturePemeriksaanUmum,
            separaPenuhBawahPerluDenturePemeriksaanUmum,
            toothSurfaceLossTraumaPemeriksaanUmum,
            // kecederaanGigiAnteriorTraumaPemeriksaanUmum,
            // tisuLembutTraumaPemeriksaanUmum,
            // tisuKerasTraumaPemeriksaanUmum,
            fissureSealantPemeriksaanUmum,
            baruJumlahGigiKekalPerluFSRawatanUmum,
            fvPerluSapuanPemeriksaanUmum,
            prrJenis1PemeriksaanUmum,
            baruJumlahGigiKekalPerluPRRJenis1RawatanUmum,
            yaTidakSilverDiamineFluoridePerluSapuanPemeriksaanUmum,
            // kotak masuk sini
            statusMPemeriksaanUmum,
            jenisRPemeriksaanUmum,
            kebersihanMulutOralHygienePemeriksaanUmum,
            skorBpeOralHygienePemeriksaanUmum,
            skorGisMulutOralHygienePemeriksaanUmum,
            perluPenskaleranPemeriksaanUmum,
            adaDesidusPemeriksaanUmum,
            dAdaGigiDesidusPemeriksaanUmum,
            mAdaGigiDesidusPemeriksaanUmum,
            fAdaGigiDesidusPemeriksaanUmum,
            // smAdaGigiDesidusPemeriksaanUmum,
            xAdaGigiDesidusPemeriksaanUmum,
            adaKekalPemeriksaanUmum,
            dAdaGigiKekalPemeriksaanUmum,
            mAdaGigiKekalPemeriksaanUmum,
            fAdaGigiKekalPemeriksaanUmum,
            eAdaGigiKekalPemeriksaanUmum,
            xAdaGigiKekalPemeriksaanUmum,
            jumlahFaktorRisikoPemeriksaanUmum,
            // edentulousWargaEmasPemeriksaanUmum,
            // mempunyai20GigiEdentulousWargaEmasPemeriksaanUmum,
            bilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum,
            disaringProgramKanserMulutPemeriksaanUmum,
            dirujukProgramKanserMulutPemeriksaanUmum,
            lesiMulutPemeriksaanUmum,
            tabiatBerisikoTinggiPemeriksaanUmum,
            jumlahAnteriorKesEndodontikDiperlukanPemeriksaanUmum,
            jumlahPremolarKesEndodontikDiperlukanPemeriksaanUmum,
            jumlahMolarKesEndodontikDiperlukanPemeriksaanUmum,
            rawatanSemulaEndodontikDariPrimerKesEndodontikDiperlukanPemeriksaanUmum,
            rawatanLainKesEndodontikDiperlukanPemeriksaanUmum,
            cabutanKesEndodontikDiperlukanPemeriksaanUmum,
            tampalanKesEndodontikDiperlukanPemeriksaanUmum,
            //rawatan
            pesakitDibuatFissureSealant,
            baruJumlahGigiKekalDibuatFSRawatanUmum,
            // semulaJumlahGigiKekalDibuatFSRawatanUmum,
            // baruJumlahMuridDibuatFsRawatanUmum,
            // semulaJumlahMuridDibuatFsRawatanUmum,
            pesakitDibuatFluorideVarnish,
            // baruJumlahGigiKekalDiberiFVRawatanUmum,
            // semulaJumlahGigiKekalDiberiFVRawatanUmum,
            // baruJumlahMuridDibuatFVRawatanUmum,
            // semulaJumlahMuridDibuatFVRawatanUmum,
            pesakitDibuatPRRJenis1,
            baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum,
            // semulaJumlahGigiKekalDiberiPRRJenis1RawatanUmum,
            // baruJumlahMuridDiberiPrrJenis1RawatanUmum,
            // semulaJumlahMuridDiberiPrrJenis1RawatanUmum,
            cabutDesidusRawatanUmum,
            cabutKekalRawatanUmum,
            komplikasiSelepasCabutanRawatanUmum,
            cabutanDisebabkanPeriodontitisRawatanUmum,
            yaTidakAbsesPembedahanRawatanUmum,
            // baruSemulaAbsesPembedahanRawatanUmum,
            cabutanSurgikalPembedahanMulutRawatanUmum,
            yaTidakFrakturPembedahanRawatanUmum,
            yaTidakPembedahanKecilMulutPembedahanRawatanUmum,
            yaTidakTraumaPembedahanRawatanUmum,
            kecederaanTulangMukaUmum,
            kecederaanGigiUmum,
            kecederaanTisuLembutUmum,
            baruJumlahGigiYangDiberiSdfRawatanUmum,
            semulaJumlahGigiYangDiberiSdfRawatanUmum,
            baruJumlahCrownBridgeRawatanUmum,
            semulaJumlahCrownBridgeRawatanUmum,
            baruJumlahPostCoreRawatanUmum,
            semulaJumlahPostCoreRawatanUmum,
            baruPenuhJumlahDenturProstodontikRawatanUmum,
            semulaPenuhJumlahDenturProstodontikRawatanUmum,
            baruSeparaJumlahDenturProstodontikRawatanUmum,
            semulaSeparaJumlahDenturProstodontikRawatanUmum,
            immediateDenturProstodontikRawatanUmum,
            pembaikanDenturProstodontikRawatanUmum,
            penskaleranRawatanUmum,
            rawatanLainPeriodontikRawatanUmum,
            rawatanOrtodontikRawatanUmum,
            kesPerubatanMulutRawatanUmum,
            bilanganXrayYangDiambilRawatanUmum,
            gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum,
            gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum,
            gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum,
            gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum,
            gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum,
            gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum,
            gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum,
            gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum,
            gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum,
            gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum,
            gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum,
            gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum,
            baruInlayOnlayJumlahTampalanDibuatRawatanUmum,
            semulaInlayOnlayJumlahTampalanDibuatRawatanUmum,
            jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum,
            // jumlahAnteriorRawatanSemulaKeppRawatanUmum,
            // jumlahPremolarRawatanSemulaKeppRawatanUmum,
            // jumlahMolarRawatanSemulaKeppRawatanUmum,
            jumlahAnteriorKesEndodontikSelesaiRawatanUmum,
            jumlahPremolarKesEndodontikSelesaiRawatanUmum,
            jumlahMolarKesEndodontikSelesaiRawatanUmum,
            rawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum,
            memenuhiRditnKod3KesRujukUpprRawatanUmum,
            restorasiPascaEndodontikKesRujukUpprRawatanUmum,
            komplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum,
            kesSelesaiRawatanUmum,
            //promosi
            ceramahPromosiUmum,
            lmgPromosiUmum,
            melaksanakanAktivitiBeginPromosiUmum,
            lawatanKeRumahPromosiUmum,
            plakGigiNasihatPergigianIndividuPromosiUmum,
            penjagaanKesihatanOralNasihatPergigianIndividuPromosiUmum,
            dietPemakananNasihatPergigianIndividuPromosiUmum,
            kanserMulutNasihatPergigianIndividuPromosiUmum,
            umur1517BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum,
            umur1819BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum,
            umur2029BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum,
            umur3049BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum,
            umur5059BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum,
            umur60KeAtasBilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum,
            dirujukKaunselingPakarPublicHealthPromosiUmum,
            //kotak
            statusMUmum,
            jenisRUmum,
            tarikh1Umum,
            tarikh2Umum,
            tarikh3Umum,
            tarikh4Umum,
            adaQUmum,
            tiadaQUmum,
            rujukGUmum,
            tarikhQUmum,
            statusSelepas6BulanUmum,
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
          success: 'Maklumat pesakit berjaya dihantar',
          error: 'Maklumat pesakit gagal dihantar',
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
    <>
      <div className='h-full p-1 grid'>
        <div className='p-2'>
          <article className='outline outline-1 outline-userBlack grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 pb-2'>
            {!isLoading && (
              <div>
                <div className='text-l font-bold flex flex-row pl-5 p-2'>
                  <h1>MAKLUMAT AM PESAKIT</h1>
                  <FaInfoCircle
                    className='hover:cursor-pointer m-1 text-lg'
                    onMouseEnter={() => setIsShown(true)}
                    onMouseLeave={() => setIsShown(false)}
                  />
                  <button
                    onClick={kemaskini}
                    className='float-left px-2 py-1 capitalize bg-user3 hover:bg-user1 hover:text-userWhite transition-all rounded-md text-xs font-medium'
                  >
                    kemaskini
                  </button>
                </div>
                {isShown && (
                  <div className='z-100 absolute float-right box-border outline outline-1 outline-userBlack left-64 p-5 bg-userWhite '>
                    <div className='flex flex-row text-sm'>
                      <h2 className='font-semibold'>NAMA :</h2>
                      <p className='ml-1'>{singlePersonUmum.nama}</p>
                    </div>
                    <div className='text-sm flex flex-row '>
                      <h2 className='font-semibold'>IC/PASSPORT :</h2>
                      <p className='ml-1'>{singlePersonUmum.ic}</p>
                    </div>
                    <div className='text-sm flex flex-row '>
                      <h2 className='font-semibold'>JANTINA :</h2>
                      <p className='ml-1'>{singlePersonUmum.jantina}</p>
                    </div>
                    <div className='text-sm flex flex-row '>
                      <h2 className='font-semibold'>TARIKH LAHIR :</h2>
                      <p className='ml-1'>{singlePersonUmum.tarikhLahir}</p>
                    </div>
                    <div className='text-sm flex flex-row '>
                      <h2 className='font-semibold'>UMUR :</h2>
                      <p className='ml-1'>
                        {singlePersonUmum.umur} tahun{' '}
                        {singlePersonUmum.umurBulan} bulan
                      </p>
                    </div>
                    <div className='text-sm flex flex-row '>
                      <h2 className='font-semibold'>KUMPULAN ETNIK :</h2>
                      <p className='ml-1'>{singlePersonUmum.kumpulanEtnik}</p>
                    </div>
                    <div className='text-sm flex flex-row '>
                      <h2 className='font-semibold'>KEDATANGAN :</h2>
                      <p className='ml-1'>{singlePersonUmum.kedatangan}</p>
                    </div>
                  </div>
                )}
                <div className='text-s flex flex-row pl-5'>
                  <h2 className='font-semibold text-xs'>NAMA :</h2>
                  <p className='ml-1 text-xs'>{singlePersonUmum.nama}</p>
                </div>
              </div>
            )}
            {!isLoading && (
              <>
                <div className='md:pt-11'>
                  <div className='text-s flex flex-row pl-5'>
                    <h2 className='font-semibold text-xs'>JANTINA :</h2>
                    <p className='ml-1 text-xs'>{singlePersonUmum.jantina}</p>
                  </div>
                </div>
                <div className='lg:pt-11'>
                  <div className='text-s flex flex-row pl-5'>
                    <h2 className='font-semibold text-xs'>IC/Passport :</h2>
                    <p className='ml-1 text-xs'>{singlePersonUmum.ic}</p>
                  </div>
                </div>
                <div className='lg:pt-11'>
                  <div className='text-s flex flex-row pl-5'>
                    <h2 className='font-semibold text-xs'>UMUR :</h2>
                    <p className='ml-1 text-xs'>
                      {singlePersonUmum.umur} tahun {singlePersonUmum.umurBulan}{' '}
                      bulan
                    </p>
                  </div>
                </div>
              </>
            )}
            {isLoading && (
              <p className='col-span-3 py-[15px] text-base font-semibold'>
                <Spinner color='#1f315f' />
              </p>
            )}
          </article>
        </div>
        <div className='grid h-full overflow-scroll overflow-x-hidden gap-2'>
          <form onSubmit={handleSubmit}>
            {/* <FasilitiPerkhidmatan {...masterForm} /> */}
            {/* <MaklumatLanjut {...masterForm} /> */}
            {singlePersonUmum.kedatangan !== 'ulangan-kedatangan' && (
              <Pemeriksaan
                {...masterForm}
                singlePersonUmum={singlePersonUmum}
              />
            )}
            <Rawatan {...masterForm} />
            <Promosi {...masterForm} singlePersonUmum={singlePersonUmum} />
            {/* <Kotak {...masterForm} /> */}
            <div className='grid grid-cols-1 lg:grid-cols-2 col-start-1 md:col-start-2 gap-2 col-span-2 md:col-span-1'>
              <div className='grid grid-cols-3 gap-3 lg:col-start-2'>
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
            </div>
          </form>
        </div>
      </div>
      {showKemaskini && (
        <Kemaskini
          showKemaskini={showKemaskini}
          setShowKemaskini={setShowKemasKini}
          toast={toast}
        />
      )}
    </>
  );
}

export default UserFormUmumHeader;
