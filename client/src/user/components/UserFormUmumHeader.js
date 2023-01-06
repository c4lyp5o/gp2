import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

import Kemaskini from './form-umum/Kemaskini';
// import FasilitiPerkhidmatan from './form-umum/FasilitiPerkhidmatan';
// import MaklumatLanjut from './form-umum/MaklumatLanjut';
import Pemeriksaan from './form-umum/Pemeriksaan';
import Rawatan from './form-umum/Rawatan';
import Promosi from './form-umum/Promosi';
// import Kotak from './form-umum/Kotak';

import Confirmation from './UserFormUmumConfirmation';

import { useGlobalUserAppContext } from '../context/userAppContext';

function UserFormUmumHeader({ sekolahIdc }) {
  const {
    userToken,
    reliefUserToken,
    username,
    userinfo,
    useParams,
    toast,
    Dictionary,
  } = useGlobalUserAppContext();

  const { personUmumId, operatorLain } = useParams();

  const [submitting, setSubmitting] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isShown, setIsShown] = useState(false);
  const [singlePersonUmum, setSinglePersonUmum] = useState([]);
  const [allKPBMPBForNegeri, setAllKPBMPBForNegeri] = useState([]);
  const [showKemaskini, setShowKemasKini] = useState(false);

  // creating masterForm object to be used by the form
  const masterForm = {};
  masterForm.createdByUsername = username;
  const [statusReten, setStatusReten] = useState('');
  masterForm.statusReten = statusReten;
  masterForm.setStatusReten = setStatusReten;
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
  //pemeriksaan -------------------------------------------------------------------
  const [statusKehadiran, setStatusKehadiran] = useState(false);
  masterForm.statusKehadiran = statusKehadiran;
  masterForm.setStatusKehadiran = setStatusKehadiran;
  const [waktuDipanggil, setWaktuDipanggil] = useState('');
  masterForm.waktuDipanggil = waktuDipanggil;
  masterForm.setWaktuDipanggil = setWaktuDipanggil;
  // BARU
  const [penggunaanKPBMPB, setPenggunaanKPBMPB] = useState('');
  masterForm.penggunaanKPBMPB = penggunaanKPBMPB;
  masterForm.setPenggunaanKPBMPB = setPenggunaanKPBMPB;
  // BARU
  const [systolicTekananDarah, setSystolicTekananDarah] = useState('');
  masterForm.systolicTekananDarah = systolicTekananDarah;
  masterForm.setSystolicTekananDarah = setSystolicTekananDarah;
  const [diastolicTekananDarah, setDiastolicTekananDarah] = useState('');
  masterForm.diastolicTekananDarah = diastolicTekananDarah;
  masterForm.setDiastolicTekananDarah = setDiastolicTekananDarah;
  const [rujukKeKlinik, setRujukKeKlinik] = useState(false);
  masterForm.rujukKeKlinik = rujukKeKlinik;
  masterForm.setRujukKeKlinik = setRujukKeKlinik;
  const [engganTaskaTadika, setEngganTaskaTadika] = useState(false);
  masterForm.engganTaskaTadika = engganTaskaTadika;
  masterForm.setEngganTaskaTadika = setEngganTaskaTadika;
  const [tidakHadirTaskaTadika, setTidakHadirTaskaTadika] = useState(false);
  masterForm.tidakHadirTaskaTadika = tidakHadirTaskaTadika;
  masterForm.setTidakHadirTaskaTadika = setTidakHadirTaskaTadika;
  const [pemeriksaanTaskaTadika, setPemeriksaanTaskaTadika] = useState('');
  masterForm.pemeriksaanTaskaTadika = pemeriksaanTaskaTadika;
  masterForm.setPemeriksaanTaskaTadika = setPemeriksaanTaskaTadika;
  const [
    bilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum,
    setBilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum,
  ] = useState('');
  masterForm.bilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum =
    bilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum;
  masterForm.setBilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum =
    setBilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum;
  const [yaTidakPesakitMempunyaiGigi, setYaTidakPesakitMempunyaiGigi] =
    useState('');
  masterForm.yaTidakPesakitMempunyaiGigi = yaTidakPesakitMempunyaiGigi;
  masterForm.setYaTidakPesakitMempunyaiGigi = setYaTidakPesakitMempunyaiGigi;
  const [adaDesidusPemeriksaanUmum, setAdaDesidusPemeriksaanUmum] =
    useState(false);
  masterForm.adaDesidusPemeriksaanUmum = adaDesidusPemeriksaanUmum;
  masterForm.setAdaDesidusPemeriksaanUmum = setAdaDesidusPemeriksaanUmum;
  const [dAdaGigiDesidusPemeriksaanUmum, setDAdaGigiDesidusPemeriksaanUmum] =
    useState('');
  masterForm.dAdaGigiDesidusPemeriksaanUmum = dAdaGigiDesidusPemeriksaanUmum;
  masterForm.setDAdaGigiDesidusPemeriksaanUmum =
    setDAdaGigiDesidusPemeriksaanUmum;
  const [fAdaGigiDesidusPemeriksaanUmum, setFAdaGigiDesidusPemeriksaanUmum] =
    useState('');
  masterForm.fAdaGigiDesidusPemeriksaanUmum = fAdaGigiDesidusPemeriksaanUmum;
  masterForm.setFAdaGigiDesidusPemeriksaanUmum =
    setFAdaGigiDesidusPemeriksaanUmum;
  const [xAdaGigiDesidusPemeriksaanUmum, setXAdaGigiDesidusPemeriksaanUmum] =
    useState('');
  masterForm.xAdaGigiDesidusPemeriksaanUmum = xAdaGigiDesidusPemeriksaanUmum;
  masterForm.setXAdaGigiDesidusPemeriksaanUmum =
    setXAdaGigiDesidusPemeriksaanUmum;
  const [
    tampalanSementaraDesidusPemeriksaanUmum,
    setTampalanSementaraDesidusPemeriksaanUmum,
  ] = useState('');
  masterForm.tampalanSementaraDesidusPemeriksaanUmum =
    tampalanSementaraDesidusPemeriksaanUmum;
  masterForm.setTampalanSementaraDesidusPemeriksaanUmum =
    setTampalanSementaraDesidusPemeriksaanUmum;
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
  const [adaCleftLipPemeriksaanUmum, setAdaCleftLipPemeriksaanUmum] =
    useState(false);
  masterForm.adaCleftLipPemeriksaanUmum = adaCleftLipPemeriksaanUmum;
  masterForm.setAdaCleftLipPemeriksaanUmum = setAdaCleftLipPemeriksaanUmum;
  const [rujukCleftLipPemeriksaanUmum, setRujukCleftLipPemeriksaanUmum] =
    useState(false);
  masterForm.rujukCleftLipPemeriksaanUmum = rujukCleftLipPemeriksaanUmum;
  masterForm.setRujukCleftLipPemeriksaanUmum = setRujukCleftLipPemeriksaanUmum;
  const [
    tidakPerluRawatanPemeriksaanUmum,
    setTidakPerluRawatanPemeriksaanUmum,
  ] = useState(false);
  masterForm.tidakPerluRawatanPemeriksaanUmum =
    tidakPerluRawatanPemeriksaanUmum;
  masterForm.setTidakPerluRawatanPemeriksaanUmum =
    setTidakPerluRawatanPemeriksaanUmum;
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
  //nak guna masa depan
  // const [
  //   yaTidakSilverDiamineFluoridePerluSapuanPemeriksaanUmum,
  //   setYaTidakSilverDiamineFluoridePerluSapuanPemeriksaanUmum,
  // ] = useState('');
  // masterForm.yaTidakSilverDiamineFluoridePerluSapuanPemeriksaanUmum =
  //   yaTidakSilverDiamineFluoridePerluSapuanPemeriksaanUmum;
  // masterForm.setYaTidakSilverDiamineFluoridePerluSapuanPemeriksaanUmum =
  //   setYaTidakSilverDiamineFluoridePerluSapuanPemeriksaanUmum;
  const [
    kebersihanMulutOralHygienePemeriksaanUmum,
    setKebersihanMulutOralHygienePemeriksaanUmum,
  ] = useState('');
  masterForm.kebersihanMulutOralHygienePemeriksaanUmum =
    kebersihanMulutOralHygienePemeriksaanUmum;
  masterForm.setKebersihanMulutOralHygienePemeriksaanUmum =
    setKebersihanMulutOralHygienePemeriksaanUmum;

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
  const [
    jumlahFaktorRisikoPemeriksaanUmum,
    setJumlahFaktorRisikoPemeriksaanUmum,
  ] = useState('');
  masterForm.jumlahFaktorRisikoPemeriksaanUmum =
    jumlahFaktorRisikoPemeriksaanUmum;
  masterForm.setJumlahFaktorRisikoPemeriksaanUmum =
    setJumlahFaktorRisikoPemeriksaanUmum;
  const [
    disaringProgramKanserMulutPemeriksaanUmum,
    setDisaringProgramKanserMulutPemeriksaanUmum,
  ] = useState('');
  masterForm.disaringProgramKanserMulutPemeriksaanUmum =
    disaringProgramKanserMulutPemeriksaanUmum;
  masterForm.setDisaringProgramKanserMulutPemeriksaanUmum =
    setDisaringProgramKanserMulutPemeriksaanUmum;
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
  const [puncaRujukan, setPuncaRujukan] = useState('');
  masterForm.puncaRujukan = puncaRujukan;
  masterForm.setPuncaRujukan = setPuncaRujukan;
  const [diabetesFaktorRisikoBpe, setDiabetesFaktorRisikoBpe] = useState(false);
  masterForm.diabetesFaktorRisikoBpe = diabetesFaktorRisikoBpe;
  masterForm.setDiabetesFaktorRisikoBpe = setDiabetesFaktorRisikoBpe;
  const [perokokFaktorRisikoBpe, setPerokokFaktorRisikoBpe] = useState(false);
  masterForm.perokokFaktorRisikoBpe = perokokFaktorRisikoBpe;
  masterForm.setPerokokFaktorRisikoBpe = setPerokokFaktorRisikoBpe;
  const [lainLainFaktorRisikoBpe, setLainLainFaktorRisikoBpe] = useState(false);
  masterForm.lainLainFaktorRisikoBpe = lainLainFaktorRisikoBpe;
  masterForm.setLainLainFaktorRisikoBpe = setLainLainFaktorRisikoBpe;
  const [engganBpeImplan, setEngganBpeImplan] = useState(false);
  masterForm.engganBpeImplan = engganBpeImplan;
  masterForm.setEngganBpeImplan = setEngganBpeImplan;
  const [
    skorBpeOralHygienePemeriksaanUmum,
    setSkorBpeOralHygienePemeriksaanUmum,
  ] = useState('');
  masterForm.skorBpeOralHygienePemeriksaanUmum =
    skorBpeOralHygienePemeriksaanUmum;
  masterForm.setSkorBpeOralHygienePemeriksaanUmum =
    setSkorBpeOralHygienePemeriksaanUmum;
  // const [pesakitMempunyaiImplanPergigian, setPesakitMempunyaiImplanPergigian] =
  //   useState(false);
  // masterForm.pesakitMempunyaiImplanPergigian = pesakitMempunyaiImplanPergigian;
  // masterForm.setPesakitMempunyaiImplanPergigian =
  //   setPesakitMempunyaiImplanPergigian;
  const [periImplantMucositis, setPeriImplantMucositis] = useState(false);
  masterForm.periImplantMucositis = periImplantMucositis;
  masterForm.setPeriImplantMucositis = setPeriImplantMucositis;
  const [periImplantitis, setPeriImplantitis] = useState(false);
  masterForm.periImplantitis = periImplantitis;
  masterForm.setPeriImplantitis = setPeriImplantitis;
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
  //rawatan --------------------------------------------------------------------------
  // const [pesakitDibuatFissureSealant, setPesakitDibuatFissureSealant] =
  //   useState(false);
  // masterForm.pesakitDibuatFissureSealant = pesakitDibuatFissureSealant;
  // masterForm.setPesakitDibuatFissureSealant = setPesakitDibuatFissureSealant;
  const [
    baruJumlahGigiKekalDibuatFSRawatanUmum,
    setBaruJumlahGigiKekalDibuatFSRawatanUmum,
  ] = useState(0);
  masterForm.baruJumlahGigiKekalDibuatFSRawatanUmum =
    baruJumlahGigiKekalDibuatFSRawatanUmum;
  masterForm.setBaruJumlahGigiKekalDibuatFSRawatanUmum =
    setBaruJumlahGigiKekalDibuatFSRawatanUmum;
  const [pesakitDibuatFluorideVarnish, setPesakitDibuatFluorideVarnish] =
    useState(false);
  masterForm.pesakitDibuatFluorideVarnish = pesakitDibuatFluorideVarnish;
  masterForm.setPesakitDibuatFluorideVarnish = setPesakitDibuatFluorideVarnish;
  // const [pesakitDibuatPRRJenis1, setPesakitDibuatPRRJenis1] = useState(false);
  // masterForm.pesakitDibuatPRRJenis1 = pesakitDibuatPRRJenis1;
  // masterForm.setPesakitDibuatPRRJenis1 = setPesakitDibuatPRRJenis1;
  const [
    baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum,
    setBaruJumlahGigiKekalDiberiPRRJenis1RawatanUmum,
  ] = useState(0);
  masterForm.baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum =
    baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum;
  masterForm.setBaruJumlahGigiKekalDiberiPRRJenis1RawatanUmum =
    setBaruJumlahGigiKekalDiberiPRRJenis1RawatanUmum;
  const [cabutDesidusRawatanUmum, setCabutDesidusRawatanUmum] = useState(0);
  masterForm.cabutDesidusRawatanUmum = cabutDesidusRawatanUmum;
  masterForm.setCabutDesidusRawatanUmum = setCabutDesidusRawatanUmum;
  const [cabutKekalRawatanUmum, setCabutKekalRawatanUmum] = useState(0);
  masterForm.cabutKekalRawatanUmum = cabutKekalRawatanUmum;
  masterForm.setCabutKekalRawatanUmum = setCabutKekalRawatanUmum;
  const [
    cabutanDisebabkanPeriodontitisRawatanUmum,
    setCabutanDisebabkanPeriodontitisRawatanUmum,
  ] = useState(0);
  masterForm.cabutanDisebabkanPeriodontitisRawatanUmum =
    cabutanDisebabkanPeriodontitisRawatanUmum;
  masterForm.setCabutanDisebabkanPeriodontitisRawatanUmum =
    setCabutanDisebabkanPeriodontitisRawatanUmum;
  const [
    komplikasiSelepasCabutanRawatanUmum,
    setKomplikasiSelepasCabutanRawatanUmum,
  ] = useState(0);
  masterForm.komplikasiSelepasCabutanRawatanUmum =
    komplikasiSelepasCabutanRawatanUmum;
  masterForm.setKomplikasiSelepasCabutanRawatanUmum =
    setKomplikasiSelepasCabutanRawatanUmum;
  const [
    cabutanSurgikalPembedahanMulutRawatanUmum,
    setCabutanSurgikalPembedahanMulutRawatanUmum,
  ] = useState(0);
  masterForm.cabutanSurgikalPembedahanMulutRawatanUmum =
    cabutanSurgikalPembedahanMulutRawatanUmum;
  masterForm.setCabutanSurgikalPembedahanMulutRawatanUmum =
    setCabutanSurgikalPembedahanMulutRawatanUmum;
  const [
    yaTidakAbsesPembedahanRawatanUmum,
    setYaTidakAbsesPembedahanRawatanUmum,
  ] = useState(false);
  masterForm.yaTidakAbsesPembedahanRawatanUmum =
    yaTidakAbsesPembedahanRawatanUmum;
  masterForm.setYaTidakAbsesPembedahanRawatanUmum =
    setYaTidakAbsesPembedahanRawatanUmum;
  const [
    yaTidakFrakturPembedahanRawatanUmum,
    setYaTidakFrakturPembedahanRawatanUmum,
  ] = useState(false);
  masterForm.yaTidakFrakturPembedahanRawatanUmum =
    yaTidakFrakturPembedahanRawatanUmum;
  masterForm.setYaTidakFrakturPembedahanRawatanUmum =
    setYaTidakFrakturPembedahanRawatanUmum;
  const [
    yaTidakPembedahanKecilMulutPembedahanRawatanUmum,
    setYaTidakPembedahanKecilMulutPembedahanRawatanUmum,
  ] = useState(false);
  masterForm.yaTidakPembedahanKecilMulutPembedahanRawatanUmum =
    yaTidakPembedahanKecilMulutPembedahanRawatanUmum;
  masterForm.setYaTidakPembedahanKecilMulutPembedahanRawatanUmum =
    setYaTidakPembedahanKecilMulutPembedahanRawatanUmum;
  const [
    yaTidakTraumaPembedahanRawatanUmum,
    setYaTidakTraumaPembedahanRawatanUmum,
  ] = useState(false);
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
  // const [
  //   baruJumlahGigiYangDiberiSdfRawatanUmum,
  //   setBaruJumlahGigiYangDiberiSdfRawatanUmum,
  // ] = useState(0);
  // masterForm.baruJumlahGigiYangDiberiSdfRawatanUmum =
  //   baruJumlahGigiYangDiberiSdfRawatanUmum;
  // masterForm.setBaruJumlahGigiYangDiberiSdfRawatanUmum =
  //   setBaruJumlahGigiYangDiberiSdfRawatanUmum;
  // const [
  //   semulaJumlahGigiYangDiberiSdfRawatanUmum,
  //   setSemulaJumlahGigiYangDiberiSdfRawatanUmum,
  // ] = useState(0);
  // masterForm.semulaJumlahGigiYangDiberiSdfRawatanUmum =
  //   semulaJumlahGigiYangDiberiSdfRawatanUmum;
  // masterForm.setSemulaJumlahGigiYangDiberiSdfRawatanUmum =
  //   setSemulaJumlahGigiYangDiberiSdfRawatanUmum;
  const [
    baruJumlahCrownBridgeRawatanUmum,
    setBaruJumlahCrownBridgeRawatanUmum,
  ] = useState(0);
  masterForm.baruJumlahCrownBridgeRawatanUmum =
    baruJumlahCrownBridgeRawatanUmum;
  masterForm.setBaruJumlahCrownBridgeRawatanUmum =
    setBaruJumlahCrownBridgeRawatanUmum;
  const [
    semulaJumlahCrownBridgeRawatanUmum,
    setSemulaJumlahCrownBridgeRawatanUmum,
  ] = useState(0);
  masterForm.semulaJumlahCrownBridgeRawatanUmum =
    semulaJumlahCrownBridgeRawatanUmum;
  masterForm.setSemulaJumlahCrownBridgeRawatanUmum =
    setSemulaJumlahCrownBridgeRawatanUmum;
  const [baruJumlahPostCoreRawatanUmum, setBaruJumlahPostCoreRawatanUmum] =
    useState(0);
  masterForm.baruJumlahPostCoreRawatanUmum = baruJumlahPostCoreRawatanUmum;
  masterForm.setBaruJumlahPostCoreRawatanUmum =
    setBaruJumlahPostCoreRawatanUmum;
  const [semulaJumlahPostCoreRawatanUmum, setSemulaJumlahPostCoreRawatanUmum] =
    useState(0);
  masterForm.semulaJumlahPostCoreRawatanUmum = semulaJumlahPostCoreRawatanUmum;
  masterForm.setSemulaJumlahPostCoreRawatanUmum =
    setSemulaJumlahPostCoreRawatanUmum;
  const [
    baruPenuhJumlahDenturProstodontikRawatanUmum,
    setBaruPenuhJumlahDenturProstodontikRawatanUmum,
  ] = useState(0);
  masterForm.baruPenuhJumlahDenturProstodontikRawatanUmum =
    baruPenuhJumlahDenturProstodontikRawatanUmum;
  masterForm.setBaruPenuhJumlahDenturProstodontikRawatanUmum =
    setBaruPenuhJumlahDenturProstodontikRawatanUmum;
  const [
    semulaPenuhJumlahDenturProstodontikRawatanUmum,
    setSemulaPenuhJumlahDenturProstodontikRawatanUmum,
  ] = useState(0);
  masterForm.semulaPenuhJumlahDenturProstodontikRawatanUmum =
    semulaPenuhJumlahDenturProstodontikRawatanUmum;
  masterForm.setSemulaPenuhJumlahDenturProstodontikRawatanUmum =
    setSemulaPenuhJumlahDenturProstodontikRawatanUmum;
  const [
    baruSeparaJumlahDenturProstodontikRawatanUmum,
    setBaruSeparaJumlahDenturProstodontikRawatanUmum,
  ] = useState(0);
  masterForm.baruSeparaJumlahDenturProstodontikRawatanUmum =
    baruSeparaJumlahDenturProstodontikRawatanUmum;
  masterForm.setBaruSeparaJumlahDenturProstodontikRawatanUmum =
    setBaruSeparaJumlahDenturProstodontikRawatanUmum;
  const [
    semulaSeparaJumlahDenturProstodontikRawatanUmum,
    setSemulaSeparaJumlahDenturProstodontikRawatanUmum,
  ] = useState(0);
  masterForm.semulaSeparaJumlahDenturProstodontikRawatanUmum =
    semulaSeparaJumlahDenturProstodontikRawatanUmum;
  masterForm.setSemulaSeparaJumlahDenturProstodontikRawatanUmum =
    setSemulaSeparaJumlahDenturProstodontikRawatanUmum;
  const [
    menggunakanMakmalPergigianBergerak,
    setMenggunakanMakmalPergigianBergerak,
  ] = useState(false);
  masterForm.menggunakanMakmalPergigianBergerak =
    menggunakanMakmalPergigianBergerak;
  masterForm.setMenggunakanMakmalPergigianBergerak =
    setMenggunakanMakmalPergigianBergerak;
  const [
    immediateDenturProstodontikRawatanUmum,
    setImmediateDenturProstodontikRawatanUmum,
  ] = useState(0);
  masterForm.immediateDenturProstodontikRawatanUmum =
    immediateDenturProstodontikRawatanUmum;
  masterForm.setImmediateDenturProstodontikRawatanUmum =
    setImmediateDenturProstodontikRawatanUmum;
  const [
    pembaikanDenturProstodontikRawatanUmum,
    setPembaikanDenturProstodontikRawatanUmum,
  ] = useState(0);
  masterForm.pembaikanDenturProstodontikRawatanUmum =
    pembaikanDenturProstodontikRawatanUmum;
  masterForm.setPembaikanDenturProstodontikRawatanUmum =
    setPembaikanDenturProstodontikRawatanUmum;
  const [
    gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum,
    setGdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum,
  ] = useState(0);
  masterForm.gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  masterForm.setGdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    setGdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  const [
    gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum,
    setGdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum,
  ] = useState(0);
  masterForm.gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  masterForm.setGdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    setGdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  const [
    gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum,
    setGkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum,
  ] = useState(0);
  masterForm.gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  masterForm.setGkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    setGkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  const [
    gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum,
    setGkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum,
  ] = useState(0);
  masterForm.gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  masterForm.setGkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    setGkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  const [
    gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum,
    setGdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum,
  ] = useState(0);
  masterForm.gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  masterForm.setGdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    setGdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  const [
    gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum,
    setGdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum,
  ] = useState(0);
  masterForm.gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  masterForm.setGdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    setGdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  const [
    gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum,
    setGkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum,
  ] = useState(0);
  masterForm.gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  masterForm.setGkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    setGkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  const [
    gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum,
    setGkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum,
  ] = useState(0);
  masterForm.gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  masterForm.setGkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum =
    setGkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum;
  const [
    gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum,
    setGdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum,
  ] = useState(0);
  masterForm.gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum =
    gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum;
  masterForm.setGdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum =
    setGdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum;
  const [
    gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum,
    setGdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum,
  ] = useState(0);
  masterForm.gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum =
    gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum;
  masterForm.setGdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum =
    setGdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum;
  const [
    gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum,
    setGkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum,
  ] = useState(0);
  masterForm.gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum =
    gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum;
  masterForm.setGkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum =
    setGkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum;
  const [
    gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum,
    setGkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum,
  ] = useState(0);
  masterForm.gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum =
    gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum;
  masterForm.setGkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum =
    setGkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum;
  const [
    baruInlayOnlayJumlahTampalanDibuatRawatanUmum,
    setBaruInlayOnlayJumlahTampalanDibuatRawatanUmum,
  ] = useState(0);
  masterForm.baruInlayOnlayJumlahTampalanDibuatRawatanUmum =
    baruInlayOnlayJumlahTampalanDibuatRawatanUmum;
  masterForm.setBaruInlayOnlayJumlahTampalanDibuatRawatanUmum =
    setBaruInlayOnlayJumlahTampalanDibuatRawatanUmum;
  const [
    semulaInlayOnlayJumlahTampalanDibuatRawatanUmum,
    setSemulaInlayOnlayJumlahTampalanDibuatRawatanUmum,
  ] = useState(0);
  masterForm.semulaInlayOnlayJumlahTampalanDibuatRawatanUmum =
    semulaInlayOnlayJumlahTampalanDibuatRawatanUmum;
  masterForm.setSemulaInlayOnlayJumlahTampalanDibuatRawatanUmum =
    setSemulaInlayOnlayJumlahTampalanDibuatRawatanUmum;
  const [
    jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum,
    setJumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum,
  ] = useState(0);
  masterForm.jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum =
    jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum;
  masterForm.setJumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum =
    setJumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum;
  // const [kaunselingDiet, setKaunselingDiet] = useState(false);
  // masterForm.kaunselingDiet = kaunselingDiet;
  // masterForm.setKaunselingDiet = setKaunselingDiet;
  const [nasihatBerhentiMerokok, setNasihatBerhentiMerokok] = useState(false);
  masterForm.nasihatBerhentiMerokok = nasihatBerhentiMerokok;
  masterForm.setNasihatBerhentiMerokok = setNasihatBerhentiMerokok;
  const [lainLainPengurusanFaktorRisiko, setLainLainPengurusanFaktorRisiko] =
    useState(false);
  masterForm.lainLainPengurusanFaktorRisiko = lainLainPengurusanFaktorRisiko;
  masterForm.setLainLainPengurusanFaktorRisiko =
    setLainLainPengurusanFaktorRisiko;
  // const [ohePengurusanFaktorSetempat, setOhePengurusanFaktorSetempat] =
  //   useState(false);
  // masterForm.ohePengurusanFaktorSetempat = ohePengurusanFaktorSetempat;
  // masterForm.setOhePengurusanFaktorSetempat = setOhePengurusanFaktorSetempat;
  const [pengilapanTampalanRungkup, setPengilapanTampalanRungkup] =
    useState(false);
  masterForm.pengilapanTampalanRungkup = pengilapanTampalanRungkup;
  masterForm.setPengilapanTampalanRungkup = setPengilapanTampalanRungkup;
  const [adjustasiOklusi, setAdjustasiOklusi] = useState(false);
  masterForm.adjustasiOklusi = adjustasiOklusi;
  masterForm.setAdjustasiOklusi = setAdjustasiOklusi;
  const [cabutanPengurusanFaktorSetempat, setCabutanPengurusanFaktorSetempat] =
    useState(false);
  masterForm.cabutanPengurusanFaktorSetempat = cabutanPengurusanFaktorSetempat;
  masterForm.setCabutanPengurusanFaktorSetempat =
    setCabutanPengurusanFaktorSetempat;
  const [ektiparsiPulpa, setEktiparsiPulpa] = useState(false);
  masterForm.ektiparsiPulpa = ektiparsiPulpa;
  masterForm.setEktiparsiPulpa = setEktiparsiPulpa;
  const [
    rawatanLainPeriodontikRawatanUmum,
    setRawatanLainPeriodontikRawatanUmum,
  ] = useState(false);
  masterForm.rawatanLainPeriodontikRawatanUmum =
    rawatanLainPeriodontikRawatanUmum;
  masterForm.setRawatanLainPeriodontikRawatanUmum =
    setRawatanLainPeriodontikRawatanUmum;
  const [rujukanPakarPeriodontik, setRujukanPakarPeriodontik] = useState('');
  masterForm.rujukanPakarPeriodontik = rujukanPakarPeriodontik;
  masterForm.setRujukanPakarPeriodontik = setRujukanPakarPeriodontik;
  const [
    engganLainRujukanPakarPeriodontik,
    setEngganLainRujukanPakarPeriodontik,
  ] = useState('');
  masterForm.engganLainRujukanPakarPeriodontik =
    engganLainRujukanPakarPeriodontik;
  masterForm.setEngganLainRujukanPakarPeriodontik =
    setEngganLainRujukanPakarPeriodontik;
  const [rujukanPakarScd, setRujukanPakarScd] = useState(false);
  masterForm.rujukanPakarScd = rujukanPakarScd;
  masterForm.setRujukanPakarScd = setRujukanPakarScd;
  const [rujukanPakarUpkka, setRujukanPakarUpkka] = useState(false);
  masterForm.rujukanPakarUpkka = rujukanPakarUpkka;
  masterForm.setRujukanPakarUpkka = setRujukanPakarUpkka;
  const [kesSelesaiPeriodontium, setKesSelesaiPeriodontium] = useState(false);
  masterForm.kesSelesaiPeriodontium = kesSelesaiPeriodontium;
  masterForm.setKesSelesaiPeriodontium = setKesSelesaiPeriodontium;
  const [rawatanOrtodontikRawatanUmum, setRawatanOrtodontikRawatanUmum] =
    useState(false);
  masterForm.rawatanOrtodontikRawatanUmum = rawatanOrtodontikRawatanUmum;
  masterForm.setRawatanOrtodontikRawatanUmum = setRawatanOrtodontikRawatanUmum;
  const [kesPerubatanMulutRawatanUmum, setKesPerubatanMulutRawatanUmum] =
    useState(false);
  masterForm.kesPerubatanMulutRawatanUmum = kesPerubatanMulutRawatanUmum;
  masterForm.setKesPerubatanMulutRawatanUmum = setKesPerubatanMulutRawatanUmum;
  const [rawatanLainPeriodontik, setRawatanLainPeriodontik] = useState(false);
  masterForm.rawatanLainPeriodontik = rawatanLainPeriodontik;
  masterForm.setRawatanLainPeriodontik = setRawatanLainPeriodontik;
  const [
    bilanganXrayYangDiambilRawatanUmum,
    setBilanganXrayYangDiambilRawatanUmum,
  ] = useState(0);
  masterForm.bilanganXrayYangDiambilRawatanUmum =
    bilanganXrayYangDiambilRawatanUmum;
  masterForm.setBilanganXrayYangDiambilRawatanUmum =
    setBilanganXrayYangDiambilRawatanUmum;
  const [
    jumlahAnteriorKesEndodontikSelesaiRawatanUmum,
    setJumlahAnteriorKesEndodontikSelesaiRawatanUmum,
  ] = useState(0);
  masterForm.jumlahAnteriorKesEndodontikSelesaiRawatanUmum =
    jumlahAnteriorKesEndodontikSelesaiRawatanUmum;
  masterForm.setJumlahAnteriorKesEndodontikSelesaiRawatanUmum =
    setJumlahAnteriorKesEndodontikSelesaiRawatanUmum;
  const [
    jumlahPremolarKesEndodontikSelesaiRawatanUmum,
    setJumlahPremolarKesEndodontikSelesaiRawatanUmum,
  ] = useState(0);
  masterForm.jumlahPremolarKesEndodontikSelesaiRawatanUmum =
    jumlahPremolarKesEndodontikSelesaiRawatanUmum;
  masterForm.setJumlahPremolarKesEndodontikSelesaiRawatanUmum =
    setJumlahPremolarKesEndodontikSelesaiRawatanUmum;
  const [
    jumlahMolarKesEndodontikSelesaiRawatanUmum,
    setJumlahMolarKesEndodontikSelesaiRawatanUmum,
  ] = useState(0);
  masterForm.jumlahMolarKesEndodontikSelesaiRawatanUmum =
    jumlahMolarKesEndodontikSelesaiRawatanUmum;
  masterForm.setJumlahMolarKesEndodontikSelesaiRawatanUmum =
    setJumlahMolarKesEndodontikSelesaiRawatanUmum;
  const [
    rawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum,
    setRawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum,
  ] = useState(0);
  masterForm.rawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum =
    rawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum;
  masterForm.setRawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum =
    setRawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum;
  const [
    jumlahAnteriorRawatanSemulaKeppRawatanUmum,
    setJumlahAnteriorRawatanSemulaKeppRawatanUmum,
  ] = useState(0);
  masterForm.jumlahAnteriorRawatanSemulaKeppRawatanUmum =
    jumlahAnteriorRawatanSemulaKeppRawatanUmum;
  masterForm.setJumlahAnteriorRawatanSemulaKeppRawatanUmum =
    setJumlahAnteriorRawatanSemulaKeppRawatanUmum;
  const [
    jumlahPremolarRawatanSemulaKeppRawatanUmum,
    setJumlahPremolarRawatanSemulaKeppRawatanUmum,
  ] = useState(0);
  masterForm.jumlahPremolarRawatanSemulaKeppRawatanUmum =
    jumlahPremolarRawatanSemulaKeppRawatanUmum;
  masterForm.setJumlahPremolarRawatanSemulaKeppRawatanUmum =
    setJumlahPremolarRawatanSemulaKeppRawatanUmum;
  const [
    jumlahMolarRawatanSemulaKeppRawatanUmum,
    setJumlahMolarRawatanSemulaKeppRawatanUmum,
  ] = useState(0);
  masterForm.jumlahMolarRawatanSemulaKeppRawatanUmum =
    jumlahMolarRawatanSemulaKeppRawatanUmum;
  masterForm.setJumlahMolarRawatanSemulaKeppRawatanUmum =
    setJumlahMolarRawatanSemulaKeppRawatanUmum;
  const [
    memenuhiRditnKod3KesRujukUpprRawatanUmum,
    setMemenuhiRditnKod3KesRujukUpprRawatanUmum,
  ] = useState(false);
  masterForm.memenuhiRditnKod3KesRujukUpprRawatanUmum =
    memenuhiRditnKod3KesRujukUpprRawatanUmum;
  masterForm.setMemenuhiRditnKod3KesRujukUpprRawatanUmum =
    setMemenuhiRditnKod3KesRujukUpprRawatanUmum;
  const [
    restorasiPascaEndodontikKesRujukUpprRawatanUmum,
    setRestorasiPascaEndodontikKesRujukUpprRawatanUmum,
  ] = useState(false);
  masterForm.restorasiPascaEndodontikKesRujukUpprRawatanUmum =
    restorasiPascaEndodontikKesRujukUpprRawatanUmum;
  masterForm.setRestorasiPascaEndodontikKesRujukUpprRawatanUmum =
    setRestorasiPascaEndodontikKesRujukUpprRawatanUmum;
  const [
    komplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum,
    setKomplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum,
  ] = useState(false);
  masterForm.komplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum =
    komplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum;
  masterForm.setKomplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum =
    setKomplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum;
  const [penskaleranRawatanUmum, setPenskaleranRawatanUmum] = useState(false);
  masterForm.penskaleranRawatanUmum = penskaleranRawatanUmum;
  masterForm.setPenskaleranRawatanUmum = setPenskaleranRawatanUmum;
  const [rujukanPakarOrtodontik, setRujukanPakarOrtodontik] = useState(false);
  masterForm.rujukanPakarOrtodontik = rujukanPakarOrtodontik;
  masterForm.setRujukanPakarOrtodontik = setRujukanPakarOrtodontik;
  const [
    rujukanPakarPatologiMulutDanPerubatanMulut,
    setRujukanPakarPatologiMulutDanPerubatanMulut,
  ] = useState(false);
  masterForm.rujukanPakarPatologiMulutDanPerubatanMulut =
    rujukanPakarPatologiMulutDanPerubatanMulut;
  masterForm.setRujukanPakarPatologiMulutDanPerubatanMulut =
    setRujukanPakarPatologiMulutDanPerubatanMulut;
  const [rujukanPakarBedahMulut, setRujukanPakarBedahMulut] = useState(false);
  masterForm.rujukanPakarBedahMulut = rujukanPakarBedahMulut;
  masterForm.setRujukanPakarBedahMulut = setRujukanPakarBedahMulut;
  const [rujukanPakarPergigianPediatrik, setRujukanPakarPergigianPediatrik] =
    useState(false);
  masterForm.rujukanPakarPergigianPediatrik = rujukanPakarPergigianPediatrik;
  masterForm.setRujukanPakarPergigianPediatrik =
    setRujukanPakarPergigianPediatrik;
  const [kesSelesaiRawatanUmum, setKesSelesaiRawatanUmum] = useState(false);
  masterForm.kesSelesaiRawatanUmum = kesSelesaiRawatanUmum;
  masterForm.setKesSelesaiRawatanUmum = setKesSelesaiRawatanUmum;
  const [rawatanDibuatOperatorLain, setRawatanDibuatOperatorLain] =
    useState(false);
  masterForm.rawatanDibuatOperatorLain = rawatanDibuatOperatorLain;
  masterForm.setRawatanDibuatOperatorLain = setRawatanDibuatOperatorLain;
  //promosi --------------------------------------------------------------------------
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
  ] = useState(0);
  masterForm.umur1517BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum =
    umur1517BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum;
  masterForm.setUmur1517BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum =
    setUmur1517BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum;
  const [
    umur1819BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum,
    setUmur1819BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum,
  ] = useState(0);
  masterForm.umur1819BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum =
    umur1819BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum;
  masterForm.setUmur1819BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum =
    setUmur1819BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum;
  const [
    umur2029BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum,
    setUmur2029BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum,
  ] = useState(0);
  masterForm.umur2029BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum =
    umur2029BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum;
  masterForm.setUmur2029BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum =
    setUmur2029BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum;
  const [
    umur3049BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum,
    setUmur3049BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum,
  ] = useState(0);
  masterForm.umur3049BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum =
    umur3049BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum;
  masterForm.setUmur3049BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum =
    setUmur3049BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum;
  const [
    umur5059BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum,
    setUmur5059BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum,
  ] = useState(0);
  masterForm.umur5059BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum =
    umur5059BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum;
  masterForm.setUmur5059BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum =
    setUmur5059BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum;
  const [
    umur60KeAtasBilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum,
    setUmur60KeAtasBilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum,
  ] = useState(0);
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
        parseInt(fAdaGigiDesidusPemeriksaanUmum) +
        parseInt(xAdaGigiDesidusPemeriksaanUmum)
    );
  }, [
    dAdaGigiDesidusPemeriksaanUmum,
    fAdaGigiDesidusPemeriksaanUmum,
    xAdaGigiDesidusPemeriksaanUmum,
  ]);

  // calculate total DMFXE
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

  // pull kpbmpb data for negeri
  useEffect(() => {
    const getAllKPBMPBForNegeri = async () => {
      console.log('getAllKPBMPBNegeri');
      try {
        const { data } = await axios.get('/api/v1/query/kpbmpb', {
          headers: {
            Authorization: `Bearer ${
              reliefUserToken ? reliefUserToken : userToken
            }`,
          },
        });
        setAllKPBMPBForNegeri(data.allKPBMPBNegeri);
        console.log(data.allKPBMPBNegeri);
      } catch (error) {
        console.log(error);
      }
    };
    getAllKPBMPBForNegeri();
  }, []);
  // pull kpbmpb data for negeri

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
        setStatusReten(data.singlePersonUmum.statusReten);
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
        //map pemeriksaan ------------------------------------------------------------
        setStatusKehadiran(data.singlePersonUmum.statusKehadiran);
        setWaktuDipanggil(data.singlePersonUmum.waktuDipanggil);
        // baru
        setPenggunaanKPBMPB(data.singlePersonUmum.penggunaanKPBMPB); // <-- baru
        // baru
        setSystolicTekananDarah(data.singlePersonUmum.systolicTekananDarah);
        setDiastolicTekananDarah(data.singlePersonUmum.diastolicTekananDarah);
        setRujukKeKlinik(data.singlePersonUmum.rujukKeKlinik);
        setEngganTaskaTadika(data.singlePersonUmum.engganTaskaTadika);
        setTidakHadirTaskaTadika(data.singlePersonUmum.tidakHadirTaskaTadika);
        setPemeriksaanTaskaTadika(data.singlePersonUmum.pemeriksaanTaskaTadika);
        setBilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum(
          data.singlePersonUmum
            .bilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum
        );
        setYaTidakPesakitMempunyaiGigi(
          data.singlePersonUmum.yaTidakPesakitMempunyaiGigi
        );
        setAdaDesidusPemeriksaanUmum(
          data.singlePersonUmum.adaDesidusPemeriksaanUmum
        );
        setDAdaGigiDesidusPemeriksaanUmum(
          data.singlePersonUmum.dAdaGigiDesidusPemeriksaanUmum
        );
        setFAdaGigiDesidusPemeriksaanUmum(
          data.singlePersonUmum.fAdaGigiDesidusPemeriksaanUmum
        );
        setXAdaGigiDesidusPemeriksaanUmum(
          data.singlePersonUmum.xAdaGigiDesidusPemeriksaanUmum
        );
        setTampalanSementaraDesidusPemeriksaanUmum(
          data.singlePersonUmum.tampalanSementaraDesidusPemeriksaanUmum
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
        setAdaCleftLipPemeriksaanUmum(
          data.singlePersonUmum.adaCleftLipPemeriksaanUmum
        );
        setRujukCleftLipPemeriksaanUmum(
          data.singlePersonUmum.rujukCleftLipPemeriksaanUmum
        );
        setTidakPerluRawatanPemeriksaanUmum(
          data.singlePersonUmum.tidakPerluRawatanPemeriksaanUmum
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
        //nak guna balik
        // setYaTidakSilverDiamineFluoridePerluSapuanPemeriksaanUmum(
        //   data.singlePersonUmum
        //     .yaTidakSilverDiamineFluoridePerluSapuanPemeriksaanUmum
        // );
        setKebersihanMulutOralHygienePemeriksaanUmum(
          data.singlePersonUmum.kebersihanMulutOralHygienePemeriksaanUmum
        );
        setSkorGisMulutOralHygienePemeriksaanUmum(
          data.singlePersonUmum.skorGisMulutOralHygienePemeriksaanUmum
        );
        setPerluPenskaleranPemeriksaanUmum(
          data.singlePersonUmum.perluPenskaleranPemeriksaanUmum
        );
        setJumlahFaktorRisikoPemeriksaanUmum(
          data.singlePersonUmum.jumlahFaktorRisikoPemeriksaanUmum
        );
        setDisaringProgramKanserMulutPemeriksaanUmum(
          data.singlePersonUmum.disaringProgramKanserMulutPemeriksaanUmum
        );
        setLesiMulutPemeriksaanUmum(
          data.singlePersonUmum.lesiMulutPemeriksaanUmum
        );
        setTabiatBerisikoTinggiPemeriksaanUmum(
          data.singlePersonUmum.tabiatBerisikoTinggiPemeriksaanUmum
        );
        setPuncaRujukan(data.singlePersonUmum.puncaRujukan);
        setDiabetesFaktorRisikoBpe(
          data.singlePersonUmum.diabetesFaktorRisikoBpe
        );
        setPerokokFaktorRisikoBpe(data.singlePersonUmum.perokokFaktorRisikoBpe);
        setLainLainFaktorRisikoBpe(
          data.singlePersonUmum.lainLainFaktorRisikoBpe
        );
        setEngganBpeImplan(data.singlePersonUmum.engganBpeImplan);
        setSkorBpeOralHygienePemeriksaanUmum(
          data.singlePersonUmum.skorBpeOralHygienePemeriksaanUmum
        );
        // setPesakitMempunyaiImplanPergigian(
        //   data.singlePersonUmum.pesakitMempunyaiImplanPergigian
        // );
        setPeriImplantMucositis(data.singlePersonUmum.periImplantMucositis);
        setPeriImplantitis(data.singlePersonUmum.periImplantitis);
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
        //map rawatan -----------------------------------------------------------------
        if (!operatorLain) {
          // setPesakitDibuatFissureSealant(
          //   data.singlePersonUmum.pesakitDibuatFissureSealant
          // );
          setBaruJumlahGigiKekalDibuatFSRawatanUmum(
            data.singlePersonUmum.baruJumlahGigiKekalDibuatFSRawatanUmum
          );
          setPesakitDibuatFluorideVarnish(
            data.singlePersonUmum.pesakitDibuatFluorideVarnish
          );
          // setPesakitDibuatPRRJenis1(
          //   data.singlePersonUmum.pesakitDibuatPRRJenis1
          // );
          setBaruJumlahGigiKekalDiberiPRRJenis1RawatanUmum(
            data.singlePersonUmum.baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum
          );
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
          setCabutanSurgikalPembedahanMulutRawatanUmum(
            data.singlePersonUmum.cabutanSurgikalPembedahanMulutRawatanUmum
          );
          setYaTidakFrakturPembedahanRawatanUmum(
            data.singlePersonUmum.yaTidakFrakturPembedahanRawatanUmum
          );
          setYaTidakPembedahanKecilMulutPembedahanRawatanUmum(
            data.singlePersonUmum
              .yaTidakPembedahanKecilMulutPembedahanRawatanUmum
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
          // setBaruJumlahGigiYangDiberiSdfRawatanUmum(
          //   data.singlePersonUmum.baruJumlahGigiYangDiberiSdfRawatanUmum
          // );
          // setSemulaJumlahGigiYangDiberiSdfRawatanUmum(
          //   data.singlePersonUmum.semulaJumlahGigiYangDiberiSdfRawatanUmum
          // );
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
            data.singlePersonUmum.baruSeparaJumlahDenturProstodontikRawatanUmum
          );
          setSemulaSeparaJumlahDenturProstodontikRawatanUmum(
            data.singlePersonUmum
              .semulaSeparaJumlahDenturProstodontikRawatanUmum
          );
          setMenggunakanMakmalPergigianBergerak(
            data.singlePersonUmum.makmalPergigianBergerak
          );
          setImmediateDenturProstodontikRawatanUmum(
            data.singlePersonUmum.immediateDenturProstodontikRawatanUmum
          );
          setPembaikanDenturProstodontikRawatanUmum(
            data.singlePersonUmum.pembaikanDenturProstodontikRawatanUmum
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
          setSemulaInlayOnlayJumlahTampalanDibuatRawatanUmum(
            data.singlePersonUmum
              .semulaInlayOnlayJumlahTampalanDibuatRawatanUmum
          );
          setJumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum(
            data.singlePersonUmum
              .jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum
          );
          // setKaunselingDiet(data.singlePersonUmum.kaunselingDiet);
          setNasihatBerhentiMerokok(
            data.singlePersonUmum.nasihatBerhentiMerokok
          );
          setLainLainPengurusanFaktorRisiko(
            data.singlePersonUmum.lainLainPengurusanFaktorRisiko
          );
          // setOhePengurusanFaktorSetempat(
          //   data.singlePersonUmum.ohePengurusanFaktorSetempat
          // );
          setPengilapanTampalanRungkup(
            data.singlePersonUmum.pengilapanTampalanRungkup
          );
          setAdjustasiOklusi(data.singlePersonUmum.adjustasiOklusi);
          setCabutanPengurusanFaktorSetempat(
            data.singlePersonUmum.cabutanPengurusanFaktorSetempat
          );
          setEktiparsiPulpa(data.singlePersonUmum.ektiparsiPulpa);
          setRawatanLainPeriodontikRawatanUmum(
            data.singlePersonUmum.rawatanLainPeriodontikRawatanUmum
          );
          setRujukanPakarPeriodontik(
            data.singlePersonUmum.rujukanPakarPeriodontik
          );
          setEngganLainRujukanPakarPeriodontik(
            data.singlePersonUmum.engganLainRujukanPakarPeriodontik
          );
          setRujukanPakarScd(data.singlePersonUmum.rujukanPakarScd);
          setRujukanPakarUpkka(data.singlePersonUmum.rujukanPakarUpkka);
          setKesSelesaiPeriodontium(
            data.singlePersonUmum.kesSelesaiPeriodontium
          );
          setRawatanOrtodontikRawatanUmum(
            data.singlePersonUmum.rawatanOrtodontikRawatanUmum
          );
          setKesPerubatanMulutRawatanUmum(
            data.singlePersonUmum.kesPerubatanMulutRawatanUmum
          );
          setRawatanLainPeriodontik(
            data.singlePersonUmum.rawatanLainPeriodontik
          );
          setBilanganXrayYangDiambilRawatanUmum(
            data.singlePersonUmum.bilanganXrayYangDiambilRawatanUmum
          );
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
          setJumlahAnteriorRawatanSemulaKeppRawatanUmum(
            data.singlePersonUmum.jumlahAnteriorRawatanSemulaKeppRawatanUmum
          );
          setJumlahPremolarRawatanSemulaKeppRawatanUmum(
            data.singlePersonUmum.jumlahPremolarRawatanSemulaKeppRawatanUmum
          );
          setJumlahMolarRawatanSemulaKeppRawatanUmum(
            data.singlePersonUmum.jumlahMolarRawatanSemulaKeppRawatanUmum
          );
          setMemenuhiRditnKod3KesRujukUpprRawatanUmum(
            data.singlePersonUmum.memenuhiRditnKod3KesRujukUpprRawatanUmum
          );
          setRestorasiPascaEndodontikKesRujukUpprRawatanUmum(
            data.singlePersonUmum
              .restorasiPascaEndodontikKesRujukUpprRawatanUmum
          );
          setKomplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum(
            data.singlePersonUmum
              .komplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum
          );
          setPenskaleranRawatanUmum(
            data.singlePersonUmum.penskaleranRawatanUmum
          );
          setRujukanPakarOrtodontik(
            data.singlePersonUmum.rujukanPakarOrtodontik
          );
          setRujukanPakarPatologiMulutDanPerubatanMulut(
            data.singlePersonUmum.rujukanPakarPatologiMulutDanPerubatanMulut
          );
          setRujukanPakarBedahMulut(
            data.singlePersonUmum.rujukanPakarBedahMulut
          );
          setRujukanPakarPergigianPediatrik(
            data.singlePersonUmum.rujukanPakarPergigianPediatrik
          );
          setKesSelesaiRawatanUmum(data.singlePersonUmum.kesSelesaiRawatanUmum);
          setRawatanDibuatOperatorLain(
            data.singlePersonUmum.rawatanDibuatOperatorLain
          );
          //map promosi ----------------------------------------------------------------
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
            data.singlePersonUmum
              .dietPemakananNasihatPergigianIndividuPromosiUmum
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
          setUmur5059BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum(
            data.singlePersonUmum
              .umur5059BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum
          );
          setUmur60KeAtasBilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum(
            data.singlePersonUmum
              .umur60KeAtasBilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum
          );
          setDirujukKaunselingPakarPublicHealthPromosiUmum(
            data.singlePersonUmum.dirujukKaunselingPakarPublicHealthPromosiUmum
          );
        }
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
    let mdcMdtbNum = '';
    if (!userinfo.mdtbNumber) {
      mdcMdtbNum = userinfo.mdcNumber;
    }
    if (!userinfo.mdcNumber) {
      mdcMdtbNum = userinfo.mdtbNumber;
    }

    let statusReten = '';
    if (rawatanDibuatOperatorLain === false) {
      statusReten = 'telah diisi';
    }
    if (rawatanDibuatOperatorLain === true) {
      statusReten = 'belum diisi';
    }

    if (
      singlePersonUmum.kedatangan === 'baru-kedatangan' &&
      singlePersonUmum.jenisFasiliti === 'kp' &&
      singlePersonUmum.umur >= 18 &&
      statusKehadiran === false &&
      systolicTekananDarah === 0 &&
      diastolicTekananDarah === 0
    ) {
      toast.error('Sila isi tekanan darah');
      return;
    }

    // default initial reten
    if (!operatorLain) {
      setSubmitting(true);
      await toast
        .promise(
          axios.patch(
            `/api/v1/umum/${personUmumId}`,
            {
              createdByUsername: masterForm.createdByUsername,
              createdByMdcMdtb: mdcMdtbNum,
              statusReten,
              //fasiliti perkhidmatan
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
              //pemeriksaan -------------------------------------------------------------
              statusKehadiran,
              waktuDipanggil,
              // baru
              penggunaanKPBMPB,
              // baru
              systolicTekananDarah,
              diastolicTekananDarah,
              rujukKeKlinik,
              engganTaskaTadika,
              tidakHadirTaskaTadika,
              pemeriksaanTaskaTadika,
              bilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum,
              yaTidakPesakitMempunyaiGigi,
              adaDesidusPemeriksaanUmum,
              dAdaGigiDesidusPemeriksaanUmum,
              fAdaGigiDesidusPemeriksaanUmum,
              xAdaGigiDesidusPemeriksaanUmum,
              tampalanSementaraDesidusPemeriksaanUmum,
              adaKekalPemeriksaanUmum,
              dAdaGigiKekalPemeriksaanUmum,
              mAdaGigiKekalPemeriksaanUmum,
              fAdaGigiKekalPemeriksaanUmum,
              eAdaGigiKekalPemeriksaanUmum,
              xAdaGigiKekalPemeriksaanUmum,
              adaCleftLipPemeriksaanUmum,
              rujukCleftLipPemeriksaanUmum,
              tidakPerluRawatanPemeriksaanUmum,
              yaTidakSediaAdaStatusDenturePemeriksaanUmum,
              separaPenuhAtasSediaAdaDenturePemeriksaanUmum,
              separaPenuhBawahSediaAdaDenturePemeriksaanUmum,
              yaTidakPerluStatusDenturePemeriksaanUmum,
              separaPenuhAtasPerluDenturePemeriksaanUmum,
              separaPenuhBawahPerluDenturePemeriksaanUmum,
              toothSurfaceLossTraumaPemeriksaanUmum,
              fissureSealantPemeriksaanUmum,
              baruJumlahGigiKekalPerluFSRawatanUmum,
              fvPerluSapuanPemeriksaanUmum,
              prrJenis1PemeriksaanUmum,
              baruJumlahGigiKekalPerluPRRJenis1RawatanUmum,
              // yaTidakSilverDiamineFluoridePerluSapuanPemeriksaanUmum,
              kebersihanMulutOralHygienePemeriksaanUmum,
              skorGisMulutOralHygienePemeriksaanUmum,
              perluPenskaleranPemeriksaanUmum,
              jumlahFaktorRisikoPemeriksaanUmum,
              disaringProgramKanserMulutPemeriksaanUmum,
              lesiMulutPemeriksaanUmum,
              tabiatBerisikoTinggiPemeriksaanUmum,
              puncaRujukan,
              diabetesFaktorRisikoBpe,
              perokokFaktorRisikoBpe,
              lainLainFaktorRisikoBpe,
              engganBpeImplan,
              skorBpeOralHygienePemeriksaanUmum,
              // pesakitMempunyaiImplanPergigian,
              periImplantMucositis,
              periImplantitis,
              jumlahAnteriorKesEndodontikDiperlukanPemeriksaanUmum,
              jumlahPremolarKesEndodontikDiperlukanPemeriksaanUmum,
              jumlahMolarKesEndodontikDiperlukanPemeriksaanUmum,
              rawatanSemulaEndodontikDariPrimerKesEndodontikDiperlukanPemeriksaanUmum,
              //rawatan ----------------------------------------------------------------
              // pesakitDibuatFissureSealant,
              baruJumlahGigiKekalDibuatFSRawatanUmum,
              pesakitDibuatFluorideVarnish,
              // pesakitDibuatPRRJenis1,
              baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum,
              cabutDesidusRawatanUmum,
              cabutKekalRawatanUmum,
              komplikasiSelepasCabutanRawatanUmum,
              cabutanDisebabkanPeriodontitisRawatanUmum,
              yaTidakAbsesPembedahanRawatanUmum,
              cabutanSurgikalPembedahanMulutRawatanUmum,
              yaTidakFrakturPembedahanRawatanUmum,
              yaTidakPembedahanKecilMulutPembedahanRawatanUmum,
              yaTidakTraumaPembedahanRawatanUmum,
              kecederaanTulangMukaUmum,
              kecederaanGigiUmum,
              kecederaanTisuLembutUmum,
              // baruJumlahGigiYangDiberiSdfRawatanUmum,
              // semulaJumlahGigiYangDiberiSdfRawatanUmum,
              baruJumlahCrownBridgeRawatanUmum,
              semulaJumlahCrownBridgeRawatanUmum,
              baruJumlahPostCoreRawatanUmum,
              semulaJumlahPostCoreRawatanUmum,
              baruPenuhJumlahDenturProstodontikRawatanUmum,
              semulaPenuhJumlahDenturProstodontikRawatanUmum,
              baruSeparaJumlahDenturProstodontikRawatanUmum,
              semulaSeparaJumlahDenturProstodontikRawatanUmum,
              menggunakanMakmalPergigianBergerak,
              immediateDenturProstodontikRawatanUmum,
              pembaikanDenturProstodontikRawatanUmum,
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
              // kaunselingDiet,
              nasihatBerhentiMerokok,
              lainLainPengurusanFaktorRisiko,
              // ohePengurusanFaktorSetempat,
              pengilapanTampalanRungkup,
              adjustasiOklusi,
              cabutanPengurusanFaktorSetempat,
              ektiparsiPulpa,
              rawatanLainPeriodontikRawatanUmum,
              rujukanPakarPeriodontik,
              engganLainRujukanPakarPeriodontik,
              rujukanPakarScd,
              rujukanPakarUpkka,
              kesSelesaiPeriodontium,
              rawatanOrtodontikRawatanUmum,
              kesPerubatanMulutRawatanUmum,
              rawatanLainPeriodontik,
              bilanganXrayYangDiambilRawatanUmum,
              jumlahAnteriorKesEndodontikSelesaiRawatanUmum,
              jumlahPremolarKesEndodontikSelesaiRawatanUmum,
              jumlahMolarKesEndodontikSelesaiRawatanUmum,
              rawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum,
              jumlahAnteriorRawatanSemulaKeppRawatanUmum,
              jumlahPremolarRawatanSemulaKeppRawatanUmum,
              jumlahMolarRawatanSemulaKeppRawatanUmum,
              memenuhiRditnKod3KesRujukUpprRawatanUmum,
              restorasiPascaEndodontikKesRujukUpprRawatanUmum,
              komplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum,
              penskaleranRawatanUmum,
              rujukanPakarOrtodontik,
              rujukanPakarPatologiMulutDanPerubatanMulut,
              rujukanPakarBedahMulut,
              rujukanPakarPergigianPediatrik,
              kesSelesaiRawatanUmum,
              rawatanDibuatOperatorLain,
              //promosi ------------------------------------------------------------
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
          setSubmitting(false);
        });
    }
    // rawatan tambahan sekiranya ada operator lain pada hari yang sama
    if (operatorLain === 'rawatan-operator-lain') {
      setSubmitting(true);
      await toast
        .promise(
          axios.patch(
            `/api/v1/umum/${personUmumId}?operatorLain=${operatorLain}`,
            {
              createdByUsername: masterForm.createdByUsername,
              createdByMdcMdtb: mdcMdtbNum,
              statusReten,
              //rawatan ----------------------------------------------------------------
              // pesakitDibuatFissureSealant,
              baruJumlahGigiKekalDibuatFSRawatanUmum,
              pesakitDibuatFluorideVarnish,
              // pesakitDibuatPRRJenis1,
              baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum,
              cabutDesidusRawatanUmum,
              cabutKekalRawatanUmum,
              komplikasiSelepasCabutanRawatanUmum,
              cabutanDisebabkanPeriodontitisRawatanUmum,
              yaTidakAbsesPembedahanRawatanUmum,
              cabutanSurgikalPembedahanMulutRawatanUmum,
              yaTidakFrakturPembedahanRawatanUmum,
              yaTidakPembedahanKecilMulutPembedahanRawatanUmum,
              yaTidakTraumaPembedahanRawatanUmum,
              kecederaanTulangMukaUmum,
              kecederaanGigiUmum,
              kecederaanTisuLembutUmum,
              // baruJumlahGigiYangDiberiSdfRawatanUmum,
              // semulaJumlahGigiYangDiberiSdfRawatanUmum,
              baruJumlahCrownBridgeRawatanUmum,
              semulaJumlahCrownBridgeRawatanUmum,
              baruJumlahPostCoreRawatanUmum,
              semulaJumlahPostCoreRawatanUmum,
              baruPenuhJumlahDenturProstodontikRawatanUmum,
              semulaPenuhJumlahDenturProstodontikRawatanUmum,
              baruSeparaJumlahDenturProstodontikRawatanUmum,
              semulaSeparaJumlahDenturProstodontikRawatanUmum,
              menggunakanMakmalPergigianBergerak,
              immediateDenturProstodontikRawatanUmum,
              pembaikanDenturProstodontikRawatanUmum,
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
              // kaunselingDiet,
              nasihatBerhentiMerokok,
              lainLainPengurusanFaktorRisiko,
              // ohePengurusanFaktorSetempat,
              pengilapanTampalanRungkup,
              adjustasiOklusi,
              cabutanPengurusanFaktorSetempat,
              ektiparsiPulpa,
              rawatanLainPeriodontikRawatanUmum,
              rujukanPakarPeriodontik,
              engganLainRujukanPakarPeriodontik,
              rujukanPakarScd,
              rujukanPakarUpkka,
              kesSelesaiPeriodontium,
              rawatanOrtodontikRawatanUmum,
              kesPerubatanMulutRawatanUmum,
              rawatanLainPeriodontik,
              bilanganXrayYangDiambilRawatanUmum,
              jumlahAnteriorKesEndodontikSelesaiRawatanUmum,
              jumlahPremolarKesEndodontikSelesaiRawatanUmum,
              jumlahMolarKesEndodontikSelesaiRawatanUmum,
              rawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum,
              jumlahAnteriorRawatanSemulaKeppRawatanUmum,
              jumlahPremolarRawatanSemulaKeppRawatanUmum,
              jumlahMolarRawatanSemulaKeppRawatanUmum,
              memenuhiRditnKod3KesRujukUpprRawatanUmum,
              restorasiPascaEndodontikKesRujukUpprRawatanUmum,
              komplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum,
              penskaleranRawatanUmum,
              rujukanPakarOrtodontik,
              rujukanPakarPatologiMulutDanPerubatanMulut,
              rujukanPakarBedahMulut,
              rujukanPakarPergigianPediatrik,
              kesSelesaiRawatanUmum,
              rawatanDibuatOperatorLain,
              //promosi ------------------------------------------------------------
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
          setSubmitting(false);
        });
    }
  };

  return (
    <Confirmation
      callbackFunction={handleSubmit}
      data={masterForm}
      busyBody={setSubmitting}
    >
      {(confirm) => (
        <>
          <div className='h-full p-1 grid grid-rows-[1fr_7fr]'>
            <div className='p-2'>
              <article className='outline outline-1 outline-userBlack flex flex-col pb-2'>
                {!isLoading && (
                  <div>
                    <div className='text-l font-bold flex flex-col md:flex-row pl-5 p-2'>
                      <h1 className='flex flex-row'>MAKLUMAT AM PESAKIT</h1>
                      <div className='flex flex-row'>
                        <div className='relative md:ml-2'>
                          <span
                            className='hover:cursor-pointer text-xs font-medium bg-user8 rounded-l-md px-2 py-1 capitalize transition-all whitespace-nowrap'
                            onMouseEnter={() => setIsShown(true)}
                            onMouseLeave={() => setIsShown(false)}
                          >
                            Fasiliti :{' '}
                            {Dictionary[singlePersonUmum.jenisFasiliti]}
                          </span>
                          {isShown && (
                            <div className='z-50 absolute float-right box-border outline outline-1 outline-userBlack p-5 bg-userWhite top-8'>
                              <div className='flex flex-row text-sm whitespace-nowrap'>
                                <h2 className='font-semibold  whitespace-nowrap'>
                                  NAMA :
                                </h2>
                                <p className='ml-1 text-sm font-light'>
                                  {singlePersonUmum.nama}
                                </p>
                              </div>
                              <div className='text-sm flex flex-row whitespace-nowrap'>
                                <h2 className='font-semibold whitespace-nowrap'>
                                  IC/PASSPORT :
                                </h2>
                                <p className='ml-1 text-sm font-light'>
                                  {singlePersonUmum.ic}
                                </p>
                              </div>
                              <div className='text-sm flex flex-row whitespace-nowrap'>
                                <h2 className='font-semibold'>JANTINA :</h2>
                                <p className='ml-1 text-sm font-light'>
                                  {singlePersonUmum.jantina}
                                </p>
                              </div>
                              <div className='text-sm flex flex-row whitespace-nowrap'>
                                <h2 className='font-semibold'>
                                  TARIKH LAHIR :
                                </h2>
                                <p className='ml-1 text-sm font-light'>
                                  {moment(singlePersonUmum.tarikhLahir).format(
                                    'DD/MM/YYYY'
                                  )}
                                </p>
                              </div>
                              <div className='text-sm flex flex-row whitespace-nowrap'>
                                <h2 className='font-semibold'>UMUR :</h2>
                                <p className='ml-1 text-sm font-light'>
                                  {singlePersonUmum.umur} tahun{' '}
                                  {singlePersonUmum.umurBulan} bulan
                                </p>
                              </div>
                              <div className='text-sm flex flex-row whitespace-nowrap'>
                                <h2 className='font-semibold'>
                                  KUMPULAN ETNIK :
                                </h2>
                                <p className='ml-1 text-sm font-light'>
                                  {singlePersonUmum.kumpulanEtnik}
                                </p>
                              </div>
                              <div className='text-sm flex flex-row whitespace-nowrap'>
                                <h2 className='font-semibold'>KEDATANGAN :</h2>
                                <p className='ml-1 text-sm font-light'>
                                  {singlePersonUmum.kedatangan ===
                                  'baru-kedatangan'
                                    ? 'Baru'
                                    : 'Ulangan'}
                                </p>
                              </div>
                              {sekolahIdc === 'umum-sekolah' && (
                                <div className='text-sm flex flex-row whitespace-nowrap'>
                                  <h2 className='font-semibold'>
                                    NAMA SEKOLAH :
                                  </h2>
                                  <p className='ml-1 text-sm font-light'>
                                    {singlePersonUmum.namaProgram}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                          <span
                            // onClick={kemaskini} tutup kemaskini untuk sementara waktu
                            className='px-2 py-1 capitalize bg-user3 hover:bg-user1 hover:text-userWhite transition-all rounded-r-md text-xs font-medium cursor-pointer'
                          >
                            -
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {!isLoading && (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
                    <div className='text-s flex flex-row pl-5'>
                      <h2 className='font-semibold text-xs  whitespace-nowrap'>
                        NAMA :
                      </h2>
                      <p className='ml-1 text-xs'>{singlePersonUmum.nama}</p>
                    </div>
                    <div className=''>
                      <div className='text-s flex flex-row pl-5'>
                        <h2 className='font-semibold text-xs'>JANTINA :</h2>
                        <p className='ml-1 text-xs'>
                          {singlePersonUmum.jantina}
                        </p>
                      </div>
                    </div>
                    <div className=''>
                      <div className='text-s flex flex-row pl-5'>
                        <h2 className='font-semibold text-xs'>IC/Passport :</h2>
                        <p className='ml-1 text-xs'>{singlePersonUmum.ic}</p>
                      </div>
                    </div>
                    <div className=''>
                      <div className='text-s flex flex-row pl-5'>
                        <h2 className='font-semibold text-xs'>UMUR :</h2>
                        <p className='ml-1 text-xs'>
                          {singlePersonUmum.umur} tahun{' '}
                          {singlePersonUmum.umurBulan} bulan
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {isLoading && (
                  <>
                    <div className='grid grid-rows-2 col-span-1 md:col-span-2 lg:col-span-3 px-2 pt-2'>
                      <div className='animate-pulse w-44 h-2 bg-user1 bg-opacity-20 flex justify-center items-center m-1 p-2 rounded-lg'></div>
                      <div className='animate-pulse w-full h-2 bg-user1 bg-opacity-20 flex justify-center items-center m-1 p-2 rounded-lg'></div>
                    </div>
                  </>
                )}
              </article>
            </div>
            <div className='grid h-full overflow-scroll overflow-x-hidden gap-2'>
              <form onSubmit={confirm(handleSubmit)}>
                {/* <FasilitiPerkhidmatan {...masterForm} /> */}
                {/* <MaklumatLanjut {...masterForm} /> */}
                {!operatorLain && (
                  <>
                    <Pemeriksaan
                      {...masterForm}
                      singlePersonUmum={singlePersonUmum}
                      allKPBMPBForNegeri={allKPBMPBForNegeri}
                    />
                    <Rawatan
                      {...masterForm}
                      singlePersonUmum={singlePersonUmum}
                      operatorLain={operatorLain}
                    />
                    <Promosi
                      {...masterForm}
                      singlePersonUmum={singlePersonUmum}
                    />
                  </>
                )}
                {operatorLain === 'rawatan-operator-lain' && (
                  <>
                    <Rawatan
                      {...masterForm}
                      singlePersonUmum={singlePersonUmum}
                      operatorLain={operatorLain}
                      allKPBMPBForNegeri={allKPBMPBForNegeri}
                    />
                    <Promosi
                      {...masterForm}
                      singlePersonUmum={singlePersonUmum}
                      operatorLain={operatorLain}
                    />
                  </>
                )}
                {/* <Kotak {...masterForm} /> */}
                <div className='grid grid-cols-1 lg:grid-cols-2 col-start-1 md:col-start-2 gap-2 col-span-2 md:col-span-1'>
                  <div className='grid grid-cols-2 gap-3 lg:col-start-2'>
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
                    {/* <input
                      disabled={
                        singlePersonUmum.statusReten === 'telah diisi' && true
                      }
                      type='reset'
                      value='set semula'
                      className={`flex bg-user3 p-2 w-full capitalize justify-center  transition-all ${
                        singlePersonUmum.statusReten === 'belum diisi' &&
                        'hover:bg-user1 hover:text-userWhite'
                      }`}
                    /> */}
                    {submitting ? (
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
                        disabled={
                          singlePersonUmum.statusReten === 'telah diisi' ||
                          singlePersonUmum.statusReten === 'reten salah'
                            ? true
                            : singlePersonUmum.statusReten === 'belum diisi' &&
                              operatorLain === 'rawatan-operator-lain'
                            ? false
                            : singlePersonUmum.statusReten === 'belum diisi' &&
                              singlePersonUmum.rawatanDibuatOperatorLain ===
                                true
                            ? true
                            : singlePersonUmum.statusReten === 'belum diisi' &&
                              false
                        }
                        type='submit'
                        className={`flex bg-user3 p-2 w-full capitalize justify-center  transition-all ${
                          singlePersonUmum.statusReten === 'belum diisi' &&
                          'hover:bg-user1 hover:text-userWhite'
                        }`}
                      >
                        {singlePersonUmum.statusReten === 'telah diisi' ||
                        singlePersonUmum.statusReten === 'reten salah' ? (
                          <s>hantar</s>
                        ) : singlePersonUmum.statusReten === 'belum diisi' &&
                          operatorLain === 'rawatan-operator-lain' ? (
                          'hantar'
                        ) : singlePersonUmum.statusReten === 'belum diisi' &&
                          singlePersonUmum.rawatanDibuatOperatorLain ===
                            true ? (
                          <s>hantar</s>
                        ) : (
                          singlePersonUmum.statusReten === 'belum diisi' &&
                          'hantar'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
            {showKemaskini && (
              <Kemaskini
                showKemaskini={showKemaskini}
                setShowKemaskini={setShowKemasKini}
                toast={toast}
              />
            )}
          </div>
        </>
      )}
    </Confirmation>
  );
}

export default UserFormUmumHeader;
