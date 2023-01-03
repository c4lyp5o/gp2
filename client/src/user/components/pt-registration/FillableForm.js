import { useState, useEffect } from 'react';
import CurrencyFormat from 'react-currency-format';
import { Spinner } from 'react-awesome-spinners';
import axios from 'axios';
import {
  FaCalendar,
  FaCaretSquareDown,
  FaPhoneAlt,
  FaEnvelope,
  FaHouseUser,
  FaRestroom,
  FaUserInjured,
  FaMoneyCheckAlt,
  FaPlusCircle,
  FaMinusCircle,
} from 'react-icons/fa';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

import Confirmation from './Confirmation';

import { useGlobalUserAppContext } from '../../context/userAppContext';

export default function FillableForm({
  jenisFasiliti,
  showForm,
  setShowForm,
  editId,
  setEditId,
  jenisProgram,
  namaProgram,
  setShowPilihanProgram,
  dariFormProgramKomuniti,
  setDariFormProgramKomuniti,
  fetchProgramData,
  setFetchProgramData,
  kp,
}) {
  const { kaunterToken, Dictionary, dateToday, masterDatePicker, toast } =
    useGlobalUserAppContext();

  const [editLoading, setIsEditLoading] = useState(false);
  const [addingData, setAddingData] = useState(false);
  const [kkKdAll, setKkKdAll] = useState([]);
  const [taskaTadikaAll, setTaskaTadikaAll] = useState([]);

  // for confirmation modal
  const [confirmData, setConfirmData] = useState({});

  // core
  const [kedatangan, setKedatangan] = useState('');
  const [noPendaftaranBaru, setNoPendaftaranBaru] = useState('');
  const [noPendaftaranUlangan, setNoPendaftaranUlangan] = useState('');
  const [tarikhKedatangan, setTarikhKedatangan] = useState(dateToday);
  const [waktuSampai, setWaktuSampai] = useState('');
  const [waktuSelesaiDaftar, setWaktuSelesaiDaftar] = useState('');
  const [temujanji, setTemujanji] = useState(false);
  const [nama, setNama] = useState('');
  const [jenisIc, setJenisIc] = useState('');
  const [ic, setIc] = useState('');
  const [nomborTelefon, setNomborTelefon] = useState('');
  const [tambahTelefon, setTambahTelefon] = useState(false);
  const [nomborTelefon2, setNomborTelefon2] = useState('');
  const [emel, setEmel] = useState('');
  const [tarikhLahir, setTarikhLahir] = useState('');
  const [umur, setUmur] = useState(0);
  const [umurBulan, setUmurBulan] = useState(0);
  const [umurHari, setUmurHari] = useState(0);
  const [jantina, setJantina] = useState('');
  const [kumpulanEtnik, setKumpulanEtnik] = useState('');
  const [alamat, setAlamat] = useState('');
  const [daerahAlamat, setDaerahAlamat] = useState('');
  const [negeriAlamat, setNegeriAlamat] = useState('');
  const [poskodAlamat, setPoskodAlamat] = useState('');
  const [ibuMengandung, setIbuMengandung] = useState(false);
  const [episodMengandung, setEpisodMengandung] = useState('');
  const [bookingIM, setBookingIM] = useState('');
  const [mengandungDahGravida, setMengandungDahGravida] = useState(false);
  const [orangKurangUpaya, setOrangKurangUpaya] = useState(false);
  const [bersekolah, setBersekolah] = useState(false);
  const [noOku, setNoOku] = useState('');
  const [statusPesara, setStatusPesara] = useState('');
  const [noPesara, setNoPesara] = useState('');
  const [rujukDaripada, setRujukDaripada] = useState('');
  const [gtod, setGtod] = useState(false);
  const [kakitanganKerajaan, setKakitanganKerajaan] = useState(false);
  const [noBayaran, setNoBayaran] = useState('');
  const [noResit, setNoResit] = useState('');
  const [tambahBayaran, setTambahBayaran] = useState(false);
  const [noBayaran2, setNoBayaran2] = useState('');
  const [noResit2, setNoResit2] = useState('');
  const [tambahBayaran2, setTambahBayaran2] = useState(false);
  const [noBayaran3, setNoBayaran3] = useState('');
  const [noResit3, setNoResit3] = useState('');
  const [catatan, setCatatan] = useState('');

  // kepp
  const [kepp, setKepp] = useState(false);
  const [kedatanganKepp, setKedatanganKepp] = useState('');
  const [tarikhRujukanKepp, setTarikhRujukanKepp] = useState('');
  const [tarikhRundinganPertama, setTarikhRundinganPertama] = useState('');
  const [tarikhMulaRawatanKepp, setTarikhMulaRawatanKepp] = useState('');

  // penyampaian perkhidmatan
  // const [kpBergerak, setKpBergerak] = useState(false);
  // const [labelKpBergerak, setLabelKpBergerak] = useState('');
  // const [pasukanPergigianBergerak, setPasukanPergigianBergerak] =
  //   useState(false);
  // const [makmalPergigianBergerak, setMakmalPergigianBergerak] = useState(false);
  // const [labelMakmalPergigianBergerak, setLabelMakmalPergigianBergerak] =
  //   useState('');

  // kk / kd
  const [namaFasilitiKkKd, setNamaFasilitiKkKd] = useState('');
  const [kodFasilitiKkKd, setKodFasilitiKkKd] = useState('');

  // taska / tadika
  const [fasilitiTaskaTadika, setFasilitiTaskaTadika] = useState('');
  const [kelasToddler, setKelasToddler] = useState(false);
  const [namaFasilitiTaskaTadika, setNamaFasilitiTaskaTadika] = useState('');
  const [kodFasilitiTaskaTadika, setKodFasilitiTaskaTadika] = useState('');

  // ipt / kolej
  const [iptKolej, setIptKolej] = useState('');
  const [ipg, setIpg] = useState('');
  const [kolejKomuniti, setKolejKomuniti] = useState('');
  const [politeknik, setPoliteknik] = useState('');
  const [institutLatihanKerajaan, setInstitutLatihanKerajaan] = useState('');
  const [giatmara, setGiatmara] = useState('');
  const [ipta, setIpta] = useState('');
  const [ipts, setIpts] = useState('');
  const [enrolmenIptKolej, setEnrolmenIptKolej] = useState(false);

  // institusi warga emas
  const [institusiWargaEmas, setInstitusiWargaEmas] = useState('');
  const [kerajaanInstitusiWargaEmas, setKerajaanInstitusiWargaEmas] =
    useState('');
  const [swastaInstitusiWargaEmas, setSwastaInstitusiWargaEmas] = useState('');

  // institusi OKU
  const [institusiOku, setInstitusiOku] = useState('');

  // kampung angkat
  const [kgAngkat, setKgAngkat] = useState('');

  // datepicker issues
  const [tarikhKedatanganDP, setTarikhKedatanganDP] = useState(
    new Date(dateToday)
  );
  const [tarikhLahirDP, setTarikhLahirDP] = useState(null);
  const [tarikhRujukanKeppDP, setTarikhRujukanKeppDP] = useState(null);
  const [tarikhRundinganPertamaDP, setTarikhRundinganPertamaDP] =
    useState(null);
  const [tarikhMulaRawatanKeppDP, setTarikhMulaRawatanKeppDP] = useState(null);

  // myidentity
  const [myIdVerified, setMyIdVerified] = useState(false);

  const TarikhKedatangan = () => {
    let disabled = false;
    if (jenisFasiliti === 'kp') {
      disabled = true;
    }
    return masterDatePicker({
      selected: tarikhKedatanganDP,
      onChange: (tarikhKedatangan) => {
        const tempDate = moment(tarikhKedatangan).format('YYYY-MM-DD');
        setTarikhKedatangan(tempDate);
        setTarikhKedatanganDP(tarikhKedatangan);
      },
      filterDate: (date) => {
        return moment() > date;
      },
      disabled: disabled,
      className:
        'appearance-none w-full md:w-56 text-sm leading-7 px-2 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md uppercase flex flex-row',
    });
  };

  const TarikhLahir = () => {
    return masterDatePicker({
      selected: tarikhLahirDP,
      required: true,
      onChange: (tarikhLahir) => {
        const tempDate = moment(tarikhLahir).format('YYYY-MM-DD');
        const tahun = parseInt(howOldAreYouMyFriendtahun(tempDate));
        const bulan = parseInt(howOldAreYouMyFriendbulan(tempDate));
        const hari = parseInt(howOldAreYouMyFrienddays(tempDate));
        setTarikhLahirDP(tarikhLahir);
        setTarikhLahir(tempDate);
        setUmur(tahun);
        setUmurBulan(bulan);
        setUmurHari(hari);
        setConfirmData({
          ...confirmData,
          tarikhLahir: tempDate,
          umur: tahun,
          umurBulan: bulan,
          umurHari: hari,
        });
      },
      filterDate: (date) => {
        return moment() > date;
      },
      className:
        'appearance-none w-full md:w-56 text-sm leading-7 px-2 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md uppercase flex flex-row',
    });
  };

  // kira tahun
  const howOldAreYouMyFriendtahun = (date) => {
    const today = new Date();
    const dob = new Date(date);
    const diff = today.getTime() - dob.getTime();
    const years = Math.floor(diff / 31556736000);
    const values = `${years} years`;
    return values;
  };

  // kira bulan
  const howOldAreYouMyFriendbulan = (date) => {
    const today = new Date();
    const dob = new Date(date);
    const diff = today.getTime() - dob.getTime();
    const days_diff = Math.floor((diff % 31556736000) / 86400000);
    const months = Math.floor(days_diff / 30.4167);
    const values = `${months} months`;
    return values;
  };

  //kira days
  const howOldAreYouMyFrienddays = (date) => {
    const today = new Date();
    const dob = new Date(date);
    const diff = today.getTime() - dob.getTime();
    const days_diff = Math.floor((diff % 31556736000) / 86400000);
    const values = `${days_diff} days`;
    return values;
  };

  const TarikhRujukanKepp = () => {
    return masterDatePicker({
      selected: tarikhRujukanKeppDP,
      onChange: (tarikhRujukanKepp) => {
        const tempDate = moment(tarikhRujukanKepp).format('YYYY-MM-DD');
        setTarikhRujukanKepp(tempDate);
        setTarikhRujukanKeppDP(tarikhRujukanKepp);
      },
      filterDate: (date) => {
        return moment() > date;
      },
      className:
        'appearance-none w-full md:w-56 text-sm leading-7 px-2 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md uppercase flex flex-row',
    });
  };

  const TarikhRundinganPertama = () => {
    return masterDatePicker({
      selected: tarikhRundinganPertamaDP,
      onChange: (tarikhRundinganPertama) => {
        const tempDate = moment(tarikhRundinganPertama).format('YYYY-MM-DD');
        setTarikhRundinganPertama(tempDate);
        setTarikhRundinganPertamaDP(tarikhRundinganPertama);
      },
      filterDate: (date) => {
        return moment() > date;
      },
      className:
        'appearance-none w-full md:w-56 text-sm leading-7 px-2 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md uppercase flex flex-row',
    });
  };

  const TarikhMulaRawatanKepp = () => {
    return masterDatePicker({
      selected: tarikhMulaRawatanKeppDP,
      onChange: (tarikhMulaRawatanKepp) => {
        const tempDate = moment(tarikhMulaRawatanKepp).format('YYYY-MM-DD');
        setTarikhMulaRawatanKepp(tempDate);
        setTarikhMulaRawatanKeppDP(tarikhMulaRawatanKepp);
      },
      filterDate: (date) => {
        return moment() > date;
      },
      className:
        'appearance-none w-full md:w-56 text-sm leading-7 px-2 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md uppercase flex flex-row',
    });
  };

  const findAgeFromIc = (ic) => {
    const year = ic.substring(0, 2);
    const month = ic.substring(2, 4);
    const day = ic.substring(4, 6);
    const today = new Date();
    const dob = new Date(`19${year}-${month}-${day}`);
    const dob2 = new Date(`20${year}-${month}-${day}`);
    const diff = today.getTime() - dob.getTime();
    const diff2 = today.getTime() - dob2.getTime();
    const years = Math.floor(diff / 31556736000);
    const years2 = Math.floor(diff2 / 31556736000);
    const months = Math.floor((diff % 31556736000) / 2629800000);
    let value;
    if (years > 99) {
      value = {
        dob: dob2,
        dobISO: new Date(dob2),
        years: years2,
        months: months,
      };
    }
    if (years < 100) {
      value = {
        dob: dob,
        dobISO: new Date(dob),
        years: years,
        months: months,
      };
    }
    return value;
  };

  const handleIc = (ic) => {
    const icLength = ic.length;
    if (icLength === 12) {
      const age = findAgeFromIc(ic);
      const tempDate = moment(age.dob).format('YYYY-MM-DD');
      const tahun = parseInt(howOldAreYouMyFriendtahun(tempDate));
      const bulan = parseInt(howOldAreYouMyFriendbulan(tempDate));
      const hari = parseInt(howOldAreYouMyFrienddays(tempDate));
      const last2 = ic.substring(10, 12);
      const jantina = last2 % 2 === 0 ? 'perempuan' : 'lelaki';
      setJantina(jantina);
      setTarikhLahir(tempDate);
      setTarikhLahirDP(age.dobISO);
      setUmurHari(hari);
      setUmurBulan(bulan);
      setUmur(tahun);
      setConfirmData({
        ...confirmData,
        ic: ic,
        tarikhLahir: age.dob,
        jantina: jantina,
        umur: tahun,
        umurBulan: bulan,
        umurHari: hari,
      });
    }
  };

  // const checkMyIdentity = async (ic) => {
  //   try {
  //     const res = await axios.get(
  //       `https://erkm.calypsocloud.one/mysjid?pid=${ic}`,
  //       {
  //         headers: { Authorization: `Bearer ${kaunterToken}` },
  //       }
  //     );
  //     if (!res.data.verified) {
  //       return false;
  //     }
  //     const { nama, jantina, alamat, poskod, daerah, negeri, mysjid, phone } =
  //       res.data.info;
  //     const age = findAgeFromIc(ic);
  //     setNama(nama.toLowerCase());
  //     setJantina(jantina.toLowerCase());
  //     setTarikhLahir(moment(age.dob).format('DD/MM/YYYY'));
  //     setTarikhLahirDP(new Date(age.dob));
  //     setUmur(age.years);
  //     setUmurBulan(age.months);
  //     setAlamat(alamat);
  //     setPoskodAlamat(poskod);
  //     setDaerahAlamat(daerah);
  //     setNegeriAlamat(negeri.toLowerCase());
  //     setMyIdVerified(res.data.verified);
  //     if (mysjid === phone) {
  //       setNomborTelefon(mysjid);
  //       setConfirmData({
  //         ...confirmData,
  //         nama: nama.toLowerCase(),
  //         tarikhLahir: age.dob,
  //         ic: ic,
  //         umur: age.years,
  //         umurBulan: age.months,
  //         jantina: jantina.toLowerCase(),
  //         alamat: alamat,
  //         poskodAlamat: poskod,
  //         daerahAlamat: daerah,
  //         negeriAlamat: negeri.toLowerCase(),
  //         nomborTelefon: mysjid,
  //       });
  //     }
  //     if (mysjid !== phone) {
  //       setEmel(mysjid);
  //       setConfirmData({
  //         ...confirmData,
  //         nama: nama.toLowerCase(),
  //         tarikhLahir: age.dob,
  //         ic: ic,
  //         umur: age.years,
  //         umurBulan: age.months,
  //         jantina: jantina.toLowerCase(),
  //         alamat: alamat,
  //         poskodAlamat: poskod,
  //         daerahAlamat: daerah,
  //         negeriAlamat: negeri.toLowerCase(),
  //         emel: mysjid,
  //       });
  //     }
  //     toast.success('Menggunakan data dari MyIdentity');
  //     return res.data.verified;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const checkCache = async (ic) => {
    try {
      const response = await axios.get(`/api/v1/kaunter/check/${ic}`, {
        headers: { Authorization: `Bearer ${kaunterToken}` },
      });
      const {
        nama,
        tarikhLahir,
        umur,
        umurBulan,
        umurHari,
        jantina,
        nomborTelefon,
        nomborTelefon2,
        emel,
        alamat,
        daerahAlamat,
        negeriAlamat,
        poskodAlamat,
        kumpulanEtnik,
        ibuMengandung,
        orangKurangUpaya,
        bersekolah,
        noOku,
        statusPesara,
      } = response.data.person;
      setNama(nama);
      setTarikhLahir(tarikhLahir);
      setIc(ic);
      setUmur(umur);
      setUmurBulan(umurBulan);
      setUmurHari(umurHari);
      setJantina(jantina);
      setNomborTelefon(nomborTelefon);
      setNomborTelefon2(nomborTelefon2);
      setEmel(emel);
      setAlamat(alamat);
      setDaerahAlamat(daerahAlamat);
      setNegeriAlamat(negeriAlamat);
      setPoskodAlamat(poskodAlamat);
      setKumpulanEtnik(kumpulanEtnik);
      setIbuMengandung(ibuMengandung);
      setOrangKurangUpaya(orangKurangUpaya);
      setBersekolah(bersekolah);
      setNoOku(noOku);
      setStatusPesara(statusPesara);
      //datepicker issues
      setTarikhLahirDP(new Date(tarikhLahir));
      setConfirmData({
        nama,
        tarikhLahir,
        ic,
        umur,
        umurBulan,
        umurHari,
        jantina,
        nomborTelefon,
        nomborTelefon2,
        emel,
        alamat,
        daerahAlamat,
        negeriAlamat,
        poskodAlamat,
        kumpulanEtnik,
        ibuMengandung,
        orangKurangUpaya,
        bersekolah,
        noOku,
        statusPesara,
        noPesara,
      });
      toast.success('Menggunakan data sedia ada');
      return true;
    } catch (error) {
      toast.error('Pesakit tidak pernah didaftarkan sebelum ini');
      return false;
    }
  };

  // check ic
  const checkIc = async (ic) => {
    // const res = await checkMyIdentity(ic);
    // if (!res) {
    const cache = await checkCache(ic);
    if (!cache) {
      handleIc(ic);
    }
    // }
  };

  // submission
  const handleSubmit = async (e) => {
    console.log(waktuSelesaiDaftar);
    if (!editId) {
      await toast
        .promise(
          axios.post(
            '/api/v1/kaunter',
            {
              createdByUsername: 'kaunter',
              jenisFasiliti,
              tarikhKedatangan,
              waktuSampai,
              waktuSelesaiDaftar,
              temujanji,
              kedatangan,
              noPendaftaranBaru,
              noPendaftaranUlangan,
              nama: nama.toLowerCase(),
              jenisIc,
              ic,
              nomborTelefon,
              nomborTelefon2,
              emel,
              tarikhLahir: moment(tarikhLahirDP).format('YYYY-MM-DD'),
              umur,
              umurBulan,
              umurHari,
              jantina,
              kumpulanEtnik,
              alamat,
              daerahAlamat,
              negeriAlamat,
              poskodAlamat,
              ibuMengandung,
              episodMengandung,
              bookingIM,
              mengandungDahGravida,
              orangKurangUpaya,
              bersekolah,
              noOku,
              statusPesara,
              noPesara,
              rujukDaripada,
              gtod,
              kakitanganKerajaan,
              noBayaran,
              noResit,
              noBayaran2,
              noResit2,
              noBayaran3,
              noResit3,
              catatan,
              // kepp
              kepp,
              kedatanganKepp,
              tarikhRujukanKepp,
              tarikhRundinganPertama,
              tarikhMulaRawatanKepp,
              // penyampaian perkhidmatan
              // kpBergerak,
              // labelKpBergerak,
              // pasukanPergigianBergerak,
              // makmalPergigianBergerak,
              // labelMakmalPergigianBergerak,
              // kk / kd
              namaFasilitiKkKd,
              kodFasilitiKkKd,
              // taska / tadika
              fasilitiTaskaTadika,
              kelasToddler,
              namaFasilitiTaskaTadika,
              kodFasilitiTaskaTadika,
              // ipt / kolej
              iptKolej,
              ipg,
              kolejKomuniti,
              politeknik,
              institutLatihanKerajaan,
              giatmara,
              ipta,
              ipts,
              enrolmenIptKolej,
              // institusi warga emas
              institusiWargaEmas,
              kerajaanInstitusiWargaEmas,
              swastaInstitusiWargaEmas,
              // institusi OKU
              institusiOku,
              // kampung angkat
              kgAngkat,
              // events
              jenisProgram: jenisProgram,
              namaProgram: namaProgram,
            },
            { headers: { Authorization: `Bearer ${kaunterToken}` } }
          ),
          {
            pending: 'Mendaftar...',
            success: 'Pesakit berjaya didaftar',
            error: 'Pesakit gagal didaftar',
          },
          { autoClose: 2000 }
        )
        .then(() => {
          if (jenisFasiliti === 'projek-komuniti-lain') {
            setDariFormProgramKomuniti(true);
            setFetchProgramData(!fetchProgramData);
          }
          setShowForm(false);
          setAddingData(false);
        });
    }
    if (editId) {
      await toast
        .promise(
          axios.patch(
            `/api/v1/kaunter/${editId}`,
            {
              tarikhKedatangan,
              waktuSampai,
              waktuSelesaiDaftar,
              temujanji,
              kedatangan,
              noPendaftaranBaru,
              noPendaftaranUlangan,
              nama: nama.toLowerCase(),
              jenisIc,
              ic,
              nomborTelefon,
              nomborTelefon2,
              emel,
              tarikhLahir,
              umur,
              umurBulan,
              umurHari,
              jantina,
              kumpulanEtnik,
              alamat,
              daerahAlamat,
              negeriAlamat,
              poskodAlamat,
              ibuMengandung,
              episodMengandung,
              bookingIM,
              mengandungDahGravida,
              orangKurangUpaya,
              bersekolah,
              noOku,
              statusPesara,
              noPesara,
              rujukDaripada,
              gtod,
              kakitanganKerajaan,
              noBayaran,
              noResit,
              noBayaran2,
              noResit2,
              noBayaran3,
              noResit3,
              catatan,
              // kepp
              kepp,
              kedatanganKepp,
              tarikhRujukanKepp,
              tarikhRundinganPertama,
              tarikhMulaRawatanKepp,
              // penyampaian perkhidmatan
              // kpBergerak,
              // labelKpBergerak,
              // pasukanPergigianBergerak,
              // makmalPergigianBergerak,
              // labelMakmalPergigianBergerak,
              // kk / kd
              namaFasilitiKkKd,
              kodFasilitiKkKd,
              // taska / tadika
              fasilitiTaskaTadika,
              kelasToddler,
              namaFasilitiTaskaTadika,
              kodFasilitiTaskaTadika,
              // ipt / kolej
              iptKolej,
              ipg,
              kolejKomuniti,
              politeknik,
              institutLatihanKerajaan,
              giatmara,
              ipta,
              ipts,
              enrolmenIptKolej,
              // institusi warga emas
              institusiWargaEmas,
              kerajaanInstitusiWargaEmas,
              swastaInstitusiWargaEmas,
              // institusi OKU
              institusiOku,
              // kampung angkat
              kgAngkat,
            },
            { headers: { Authorization: `Bearer ${kaunterToken}` } }
          ),
          {
            pending: 'Mengemaskini...',
            success: 'Pesakit berjaya dikemaskini',
            error: 'Pesakit gagal dikemaskini',
          },
          { autoClose: 2000 }
        )
        .then(() => {
          if (jenisFasiliti === 'projek-komuniti-lain') {
            setDariFormProgramKomuniti(true);
            setFetchProgramData(!fetchProgramData);
          }
          setShowForm(false);
          setAddingData(false);
        });
    }
  };

  // reset form when change jenisFasiliti or change showForm
  useEffect(() => {
    setTarikhKedatangan(dateToday);
    setWaktuSampai('');
    setTemujanji(false);
    setKedatangan('');
    setNoPendaftaranBaru('');
    setNoPendaftaranUlangan('');
    setNama('');
    setJenisIc('');
    setIc('');
    setNomborTelefon('');
    setNomborTelefon2('');
    setEmel('');
    setTarikhLahir('');
    setUmur(0);
    setUmurBulan(0);
    setUmurHari(0);
    setJantina('');
    setKumpulanEtnik('');
    setAlamat('');
    setDaerahAlamat('');
    setNegeriAlamat('');
    setPoskodAlamat('');
    setIbuMengandung(false);
    setEpisodMengandung('');
    setBookingIM('');
    setMengandungDahGravida(false);
    setOrangKurangUpaya(false);
    setBersekolah(false);
    setNoOku('');
    setStatusPesara('');
    setNoPesara('');
    setRujukDaripada('');
    setGtod(false);
    setKakitanganKerajaan(false);
    setNoBayaran('');
    setNoResit('');
    setNoBayaran2('');
    setNoResit2('');
    setNoBayaran3('');
    setNoResit3('');
    setCatatan('');
    // kepp
    setKepp(false);
    setKedatanganKepp('');
    setTarikhRujukanKepp('');
    setTarikhRundinganPertama('');
    setTarikhMulaRawatanKepp('');
    // penyampaian perkhidmatan
    // setKpBergerak(false);
    // setLabelKpBergerak('');
    // setPasukanPergigianBergerak(false);
    // setMakmalPergigianBergerak(false);
    // setLabelMakmalPergigianBergerak('');
    // taska / tadika
    // kk / kd
    setNamaFasilitiKkKd('');
    setKodFasilitiKkKd('');
    setFasilitiTaskaTadika('');
    setKelasToddler(false);
    setNamaFasilitiTaskaTadika('');
    setKodFasilitiTaskaTadika('');
    // ipt / kolej
    setIptKolej('');
    setIpg('');
    setKolejKomuniti('');
    setPoliteknik('');
    setInstitutLatihanKerajaan('');
    setGiatmara('');
    setIpta('');
    setIpts('');
    setEnrolmenIptKolej(false);
    // institusi warga emas
    setInstitusiWargaEmas('');
    setKerajaanInstitusiWargaEmas('');
    setSwastaInstitusiWargaEmas('');
    // institusi OKU
    setInstitusiOku('');
    // kampung angkat
    setKgAngkat('');
    //datepicker issues
    setTarikhKedatanganDP(new Date(dateToday));
    setTarikhLahirDP(null);
    setTarikhRujukanKeppDP(null);
    setTarikhRundinganPertamaDP(null);
    setTarikhMulaRawatanKeppDP(null);
    if (showForm === false) {
      // reset editId when change jenisFasiliti & showForm === false
      setEditId('');
    }
  }, [jenisFasiliti, showForm]);

  // close form when change jenisFasiliti
  useEffect(() => {
    setShowForm(false);
  }, [jenisFasiliti]);

  //reset no telefon 2 when change no telefon
  useEffect(() => {
    if (!editId) {
      setNomborTelefon2('');
    }
  }, [tambahTelefon]);

  // reset ic when change jenis ic
  useEffect(() => {
    if (!editId) {
      setIc('');
    }
  }, [jenisIc]);

  // birth of nak daftar nama ic ibu
  useEffect(() => {
    if (!editId) {
      if (jenisIc === 'birth-of') {
        setNama('B/O');
      }
      if (jenisIc !== 'birth-of') {
        setNama('');
      }
    }
  }, [jenisIc]);

  // passport terus bukan warganegara
  useEffect(() => {
    if (!editId) {
      if (jenisIc === 'passport') {
        setKumpulanEtnik('bukan warganegara');
        setConfirmData({
          ...confirmData,
          kumpulanEtnik: 'bukan warganegara',
        });
      }
      if (jenisIc !== 'passport') {
        setKumpulanEtnik('');
        setConfirmData({
          ...confirmData,
          kumpulanEtnik: '',
        });
      }
    }
  }, [jenisIc]);

  //reset bersekolah
  useEffect(() => {
    if (!editId) {
      if (umur <= 6 || umur >= 22) {
        setBersekolah(false);
      }
    }
  }, [umur]);

  // reset noOku when change kategori pesakit
  useEffect(() => {
    if (!editId) {
      setNoOku('');
    }
  }, [orangKurangUpaya]);

  // reset ibu mengandung if change jantina
  useEffect(() => {
    if (!editId) {
      setIbuMengandung(false);
    }
  }, [jantina]);

  //reset gravida
  useEffect(() => {
    if (!editId) {
      setEpisodMengandung('');
      setBookingIM('');
      setMengandungDahGravida(false);
    }
  }, [ibuMengandung]);

  //reset dah gravida
  useEffect(() => {
    if (!editId) {
      setMengandungDahGravida(false);
    }
  }, [bookingIM]);

  //reset pesara
  useEffect(() => {
    if (!editId) {
      setNoPesara('');
      setKakitanganKerajaan(false);
      setNoBayaran('');
      setNoResit('');
      setNoBayaran2('');
      setNoResit2('');
      setNoBayaran3('');
    }
  }, [statusPesara]);

  //reset bayaran
  useEffect(() => {
    if (!editId) {
      if (tambahBayaran === false) {
        setNoBayaran2('');
        setNoResit2('');
        setNoBayaran3('');
        setNoResit3('');
      }
      if (tambahBayaran2 === false) {
        setNoBayaran3('');
        setNoResit3('');
      }
    }
  }, [tambahBayaran, tambahBayaran2]);

  // reset kedatangan kepp when change kepp
  useEffect(() => {
    if (!editId) {
      setKedatanganKepp('');
    }
  }, [kepp]);

  // reset tarikh kepp when change kedatangan kepp
  useEffect(() => {
    if (!editId) {
      setTarikhRujukanKepp('');
      setTarikhRundinganPertama('');
      setTarikhMulaRawatanKepp('');
    }
  }, [kedatanganKepp]);

  // reset namaFasilitiTaskaTadika & kodFasilitiTaskaTadika  when change fasilitiTaskaTadika
  useEffect(() => {
    if (!editId) {
      setNamaFasilitiTaskaTadika('');
      setKodFasilitiTaskaTadika('');
    }
  }, [fasilitiTaskaTadika]);

  // fetch personKaunter to edit if editId === true
  useEffect(() => {
    if (editId) {
      const fetchSinglePersonKaunter = async () => {
        try {
          setIsEditLoading(true);
          const { data } = await axios.get(`/api/v1/kaunter/${editId}`, {
            headers: { Authorization: `Bearer ${kaunterToken}` },
          });
          // core
          setTarikhKedatangan(data.singlePersonKaunter.tarikhKedatangan);
          setWaktuSampai(data.singlePersonKaunter.waktuSampai);
          setTemujanji(data.singlePersonKaunter.temujanji);
          setKedatangan(data.singlePersonKaunter.kedatangan);
          setNoPendaftaranBaru(data.singlePersonKaunter.noPendaftaranBaru);
          setNoPendaftaranUlangan(
            data.singlePersonKaunter.noPendaftaranUlangan
          );
          setNama(data.singlePersonKaunter.nama);
          setJenisIc(data.singlePersonKaunter.jenisIc);
          setIc(data.singlePersonKaunter.ic);
          setNomborTelefon(data.singlePersonKaunter.nomborTelefon);
          setNomborTelefon2(data.singlePersonKaunter.nomborTelefon2);
          setEmel(data.singlePersonKaunter.emel);
          setTarikhLahir(data.singlePersonKaunter.tarikhLahir);
          setUmur(data.singlePersonKaunter.umur);
          setUmurBulan(data.singlePersonKaunter.umurBulan);
          setUmurHari(data.singlePersonKaunter.umurHari);
          setJantina(data.singlePersonKaunter.jantina);
          setKumpulanEtnik(data.singlePersonKaunter.kumpulanEtnik);
          setAlamat(data.singlePersonKaunter.alamat);
          setDaerahAlamat(data.singlePersonKaunter.daerahAlamat);
          setNegeriAlamat(data.singlePersonKaunter.negeriAlamat);
          setPoskodAlamat(data.singlePersonKaunter.poskodAlamat);
          setIbuMengandung(data.singlePersonKaunter.ibuMengandung);
          setEpisodMengandung(data.singlePersonKaunter.episodMengandung);
          setBookingIM(data.singlePersonKaunter.bookingIM);
          setMengandungDahGravida(
            data.singlePersonKaunter.mengandungDahGravida
          );
          setOrangKurangUpaya(data.singlePersonKaunter.orangKurangUpaya);
          setBersekolah(data.singlePersonKaunter.bersekolah);
          setNoOku(data.singlePersonKaunter.noOku);
          setStatusPesara(data.singlePersonKaunter.statusPesara);
          setNoPesara(data.singlePersonKaunter.noPesara);
          setRujukDaripada(data.singlePersonKaunter.rujukDaripada);
          setGtod(data.singlePersonKaunter.gtod);
          setKakitanganKerajaan(data.singlePersonKaunter.kakitanganKerajaan);
          setNoBayaran(data.singlePersonKaunter.noBayaran);
          setNoResit(data.singlePersonKaunter.noResit);
          setTambahBayaran(true);
          setNoBayaran2(data.singlePersonKaunter.noBayaran2);
          setNoResit2(data.singlePersonKaunter.noResit2);
          setNoBayaran3(data.singlePersonKaunter.noBayaran3);
          setNoResit3(data.singlePersonKaunter.noResit3);
          setCatatan(data.singlePersonKaunter.catatan);
          // kepp
          setKepp(data.singlePersonKaunter.kepp);
          setKedatanganKepp(data.singlePersonKaunter.kedatanganKepp);
          setTarikhRujukanKepp(data.singlePersonKaunter.tarikhRujukanKepp);
          setTarikhRundinganPertama(
            data.singlePersonKaunter.tarikhRundinganPertama
          );
          setTarikhMulaRawatanKepp(
            data.singlePersonKaunter.tarikhMulaRawatanKepp
          );
          // penyampaian perkhidmatan
          // setKpBergerak(data.singlePersonKaunter.kpBergerak);
          // setLabelKpBergerak(data.singlePersonKaunter.labelKpBergerak);
          // setPasukanPergigianBergerak(
          //   data.singlePersonKaunter.pasukanPergigianBergerak
          // );
          // setMakmalPergigianBergerak(
          //   data.singlePersonKaunter.makmalPergigianBergerak
          // );
          // setLabelMakmalPergigianBergerak(
          //   data.singlePersonKaunter.labelMakmalPergigianBergerak
          // );
          // kk / kd
          setNamaFasilitiKkKd(data.singlePersonKaunter.namaFasilitiKkKd);
          setKodFasilitiKkKd(data.singlePersonKaunter.kodFasilitiKkKd);
          // taska / tadika
          setFasilitiTaskaTadika(data.singlePersonKaunter.fasilitiTaskaTadika);
          setKelasToddler(data.singlePersonKaunter.kelasToddler);
          setNamaFasilitiTaskaTadika(
            data.singlePersonKaunter.namaFasilitiTaskaTadika
          );
          setKodFasilitiTaskaTadika(
            data.singlePersonKaunter.kodFasilitiTaskaTadika
          );
          // ipt / kolej
          setIptKolej(data.singlePersonKaunter.iptKolej);
          setIpg(data.singlePersonKaunter.ipg);
          setKolejKomuniti(data.singlePersonKaunter.kolejKomuniti);
          setPoliteknik(data.singlePersonKaunter.politeknik);
          setInstitutLatihanKerajaan(
            data.singlePersonKaunter.institutLatihanKerajaan
          );
          setGiatmara(data.singlePersonKaunter.giatmara);
          setIpta(data.singlePersonKaunter.ipta);
          setIpts(data.singlePersonKaunter.ipts);
          setEnrolmenIptKolej(data.singlePersonKaunter.enrolmenIptKolej);
          // institusi warga emas
          setInstitusiWargaEmas(data.singlePersonKaunter.institusiWargaEmas);
          setKerajaanInstitusiWargaEmas(
            data.singlePersonKaunter.kerajaanInstitusiWargaEmas
          );
          setSwastaInstitusiWargaEmas(
            data.singlePersonKaunter.swastaInstitusiWargaEmas
          );
          // institusi OKU
          setInstitusiOku(data.singlePersonKaunter.institusiOku);
          // kampung angkat
          setKgAngkat(data.singlePersonKaunter.kgAngkat);
          // datepicker issues
          setTarikhKedatanganDP(
            new Date(data.singlePersonKaunter.tarikhKedatangan)
          );
          setTarikhLahirDP(new Date(data.singlePersonKaunter.tarikhLahir));
          if (data.singlePersonKaunter.tarikhRujukanKepp !== '') {
            setTarikhRujukanKeppDP(
              new Date(data.singlePersonKaunter.tarikhRujukanKepp)
            );
          }
          if (data.singlePersonKaunter.tarikhRundinganPertama !== '') {
            setTarikhRundinganPertamaDP(
              new Date(data.singlePersonKaunter.tarikhRundinganPertama)
            );
          }
          if (data.singlePersonKaunter.tarikhMulaRawatanKepp !== '') {
            setTarikhMulaRawatanKeppDP(
              new Date(data.singlePersonKaunter.tarikhMulaRawatanKepp)
            );
          }
          setConfirmData({
            nama: data.singlePersonKaunter.nama,
            tarikhLahir: data.singlePersonKaunter.tarikhLahir,
            ic: data.singlePersonKaunter.ic,
            umur: data.singlePersonKaunter.umur,
            umurBulan: data.singlePersonKaunter.umurBulan,
            umurHari: data.singlePersonKaunter.umurHari,
            jantina: data.singlePersonKaunter.jantina,
            kumpulanEtnik: data.singlePersonKaunter.kumpulanEtnik,
            alamat: data.singlePersonKaunter.alamat,
            daerahAlamat: data.singlePersonKaunter.daerahAlamat,
            negeriAlamat: data.singlePersonKaunter.negeriAlamat,
            poskodAlamat: data.singlePersonKaunter.poskodAlamat,
            ibuMengandung: data.singlePersonKaunter.ibuMengandung,
            orangKurangUpaya: data.singlePersonKaunter.orangKurangUpaya,
            bersekolah: data.singlePersonKaunter.bersekolah,
            noOku: data.singlePersonKaunter.noOku,
            statusPesara: data.singlePersonKaunter.statusPersara,
            noPesara: data.singlePersonKaunter.noPesara,
            noBayaran: data.singlePersonKaunter.noBayaran,
            noResit: data.singlePersonKaunter.noResit,
            noBayaran2: data.singlePersonKaunter.noBayaran2,
            noResit2: data.singlePersonKaunter.noResit2,
            noBayaran3: data.singlePersonKaunter.noBayaran3,
            noResit3: data.singlePersonKaunter.noResit3,
            catatan: data.singlePersonKaunter.catatan,
          });
          setIsEditLoading(false);
        } catch (error) {
          console.log(error);
        }
      };
      fetchSinglePersonKaunter();
    }
  }, [editId]);

  // fetch kkia/kd if jenisFasiliti kk-kd only
  useEffect(() => {
    if (jenisFasiliti === 'kk-kd') {
      const fetchKkKd = async () => {
        try {
          const { data } = await axios.get(`/api/v1/query/kaunter/kk-kd`, {
            headers: { Authorization: `Bearer ${kaunterToken}` },
          });
          setKkKdAll(data.kkKdAll);
        } catch (error) {
          console.log(error);
        }
      };
      fetchKkKd();
    }
  }, [jenisFasiliti]);

  // fetch taska/tadika if jenisFasiliti taska-tadika only
  useEffect(() => {
    if (jenisFasiliti === 'taska-tadika') {
      const fetchTaskaTadika = async () => {
        try {
          const { data } = await axios.get(
            `/api/v1/query/kaunter/taska-tadika`,
            {
              headers: { Authorization: `Bearer ${kaunterToken}` },
            }
          );
          setTaskaTadikaAll(data.taskaTadikaAll);
        } catch (error) {
          console.log(error);
        }
      };
      fetchTaskaTadika();
    }
  }, [jenisFasiliti]);

  // buttons
  function BusyButton() {
    return (
      <>
        <button
          type='button'
          className='m-2 p-2 w-44 uppercase rounded bg-kaunter3 shadow-md inline-flex cursor-not-allowed'
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
          Menambah...
        </button>
      </>
    );
  }

  function SubmitButtton() {
    return (
      <button
        type='submit'
        className='m-2 p-2 w-44 uppercase rounded bg-kaunter3 hover:bg-kaunter1 hover:text-userWhite hover:cursor-pointer shadow-md transition-all'
      >
        Tambah Data
      </button>
    );
  }

  if (editLoading) {
    return (
      <div className='mt-20'>
        <Spinner />
      </div>
    );
  }

  if (showForm) {
    return (
      <Confirmation
        callbackFunction={handleSubmit}
        lookBusyGuys={setAddingData}
        data={confirmData}
        isEdit={editId}
        setWaktuSelesaiDaftar={setWaktuSelesaiDaftar}
      >
        {(confirm) => (
          <>
            <form onSubmit={confirm(handleSubmit)}>
              <h1 className='bg-kaunter3 font-bold text-2xl'>pendaftaran</h1>
              <div className='grid grid-cols-1 lg:grid-cols-2'>
                <p className='font-semibold text-user6 mt-3 ml-3 lg:mr-auto'>
                  * mandatori
                </p>
                <div className='font-semibold text-user6 lg:mt-3 lg:ml-auto'>
                  <p className='lg:flex flex-row'>
                    Fasiliti: {Dictionary[jenisFasiliti]}
                  </p>
                  {jenisFasiliti === 'projek-komuniti-lain' ? (
                    <p className='lg:flex flex-row'>
                      Nama Program: {namaProgram}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className='grid lg:grid-cols-2'>
                <div className='grid grid-cols-[1fr_2fr] m-2 auto-rows-min'>
                  <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-4 md:whitespace-nowrap bg-user1 bg-opacity-5'>
                    tarikh kedatangan:{' '}
                    <span className='font-semibold text-user6'>*</span>
                  </p>
                  <div className='relative w-full md:w-56'>
                    <TarikhKedatangan />
                    <span>
                      <FaCalendar className='absolute top-2 right-2 text-kaunter3' />
                    </span>
                  </div>
                </div>
                <div className='grid grid-cols-[1fr_2fr] m-2'>
                  <p className='text-xs md:text-sm flex justify-end items-center mr-4 font-semibold whitespace-nowrap bg-user1 bg-opacity-5'>
                    waktu tiba:{' '}
                    <span className='font-semibold text-user6'>*</span>
                  </p>
                  <div className='flex flex-col justify-start'>
                    <input
                      required
                      value={waktuSampai}
                      onChange={(e) => setWaktuSampai(e.target.value)}
                      type='time'
                      name='waktuSampai'
                      className='appearance-none w-full md:w-56 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md'
                    />
                    {jenisFasiliti === 'kp' ? (
                      <div className='flex justify-start mt-2'>
                        <input
                          type='checkbox'
                          name='temujanji'
                          id='temujanji'
                          value='temujanji'
                          checked={temujanji}
                          onChange={() => {
                            setTemujanji(!temujanji);
                          }}
                          className='mr-2'
                        />
                        <label
                          htmlFor='temujanji'
                          className='inline-flex text-sm'
                        >
                          Pesakit Janji Temu
                        </label>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className='grid grid-cols-[1fr_2fr] m-2 auto-rows-min'>
                  <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-4 md:whitespace-nowrap bg-user1 bg-opacity-5'>
                    jenis pengenalan:{' '}
                    <span className='font-semibold text-user6'>*</span>
                  </p>
                  <div className='flex flex-col'>
                    <div className='relative w-full md:w-56'>
                      <select
                        required
                        disabled={editId ? true : false}
                        id='pengenalan'
                        name='pengenalan'
                        value={jenisIc}
                        onChange={(e) => {
                          setJenisIc(e.target.value);
                        }}
                        className='appearance-none w-full md:w-56 leading-7 px-2 py-1 pr-6 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md my-2 mr-2'
                      >
                        <option value=''>SILA PILIH..</option>
                        <option value='mykad-mykid'>MyKad / MyKid</option>
                        <option value='passport'>
                          Passport / MyPR / MyKAS / UNHCR
                        </option>
                        {/* <option value='tentera'>Tentera</option>
                        <option value='polis'>Polis</option> */}
                        <option value='sijil-lahir'>Sijil lahir</option>
                        <option value='birth-of'>
                          <i>Baby Of</i>
                        </option>
                        <option value='tiada-pengenalan'>
                          Tiada Pengenalan Yang Sah
                        </option>
                      </select>
                      <span>
                        <FaCaretSquareDown className='absolute top-4 right-2 text-kaunter3' />
                      </span>
                    </div>
                    {jenisIc === 'mykad-mykid' && (
                      <input
                        disabled={editId ? true : false}
                        required
                        type='text'
                        name='ic'
                        pattern='[0-9]+'
                        title='12 numbers MyKad / MyKid'
                        minLength={12}
                        maxLength={12}
                        value={ic}
                        onChange={(e) => {
                          setIc(e.target.value);
                          if (e.target.value.length === 12) {
                            checkIc(e.target.value);
                          }
                        }}
                        placeholder='901223015432'
                        className='appearance-none w-full md:w-56 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md my-2'
                      />
                    )}
                    {jenisIc !== 'mykad-mykid' &&
                      jenisIc !== 'tiada-pengenalan' &&
                      jenisIc !== '' && (
                        <input
                          disabled={editId ? true : false}
                          required
                          type='text'
                          name='ic'
                          value={ic}
                          onChange={(e) => {
                            setIc(e.target.value);
                            setConfirmData({
                              ...confirmData,
                              ic: e.target.value,
                            });
                          }}
                          placeholder={
                            jenisIc === 'birth-of'
                              ? 'Isi pengenalan ibu..'
                              : 'Isi pengenalan diri..'
                          }
                          className='appearance-none w-full md:w-56 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md my-2'
                        />
                      )}
                  </div>
                </div>
                <div className='grid grid-cols-[1fr_2fr] m-2 auto-rows-min'>
                  {/* mySejahtera */}
                  <div className='flex justify-end items-center mr-4 bg-user1 bg-opacity-5'>
                    <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center'>
                      Maklumat Tambahan :
                      {/* <span className='font-semibold text-user6'>*</span> */}
                    </p>
                    {/* myIdentity */}
                    {/* kalau ada myIdentity jadi betul then vice versa */}
                    {/* <span>
                      {myIdVerified ? (
                        <FaCheckCircle className='text-lg text-user7' />
                      ) : (
                        <FaTimesCircle className='text-lg text-user9' />
                      )}
                    </span> */}
                  </div>
                  <div className='flex flex-col'>
                    <div className='flex flex-row items-center'>
                      <div className='flex flex-col justify-start'>
                        <label
                          htmlFor='nombor-telefon'
                          className='mr-1 flex text-left flex-row text-xs md:text-sm'
                        >
                          no. tel :
                        </label>
                        <div className='relative w-full md:w-56'>
                          <input
                            value={nomborTelefon}
                            type='text'
                            name='nombor-telefon'
                            id='nombor-telefon'
                            maxLength={15}
                            className='appearance-none w-full md:w-56 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md my-1'
                            onChange={(e) => {
                              setNomborTelefon(e.target.value);
                              setConfirmData({
                                ...confirmData,
                                nomborTelefon: e.target.value,
                              });
                            }}
                          />
                          <span>
                            <FaPhoneAlt className='absolute top-3 right-2 text-kaunter3' />
                          </span>
                        </div>
                      </div>
                      <span className='text-lg md:text-2xl flex items-center ml-1 mt-3'>
                        {tambahTelefon ? (
                          <FaMinusCircle
                            className='text-kaunter3 cursor-pointer'
                            onClick={() => {
                              setTambahTelefon(false);
                            }}
                          />
                        ) : (
                          <FaPlusCircle
                            className='text-kaunter3 cursor-pointer'
                            onClick={() => {
                              setTambahTelefon(true);
                            }}
                          />
                        )}
                      </span>
                    </div>
                    {tambahTelefon && (
                      <div className='flex flex-col justify-start'>
                        <label
                          htmlFor='nombor-telefon2'
                          className='mr-1 flex text-left flex-row text-xs md:text-sm'
                        >
                          no. tel 2 :
                        </label>
                        <div className='relative w-full md:w-56'>
                          <input
                            value={nomborTelefon2}
                            type='text'
                            name='nombor-telefon2'
                            id='nombor-telefon2'
                            maxLength={15}
                            className='appearance-none w-full md:w-56 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md my-1'
                            onChange={(e) => {
                              setNomborTelefon2(e.target.value);
                              setConfirmData({
                                ...confirmData,
                                nomborTelefon2: e.target.value,
                              });
                            }}
                          />
                          <span>
                            <FaPhoneAlt className='absolute top-3 right-2 text-kaunter3' />
                          </span>
                        </div>
                      </div>
                    )}
                    <div className='flex flex-col justify-start'>
                      <label
                        htmlFor='email-mysj'
                        className='mr-4 flex text-left flex-row text-xs md:text-sm'
                      >
                        emel :
                      </label>
                      <div className='relative w-full md:w-56'>
                        <input
                          value={emel}
                          type='email'
                          name='email-mysj'
                          id='email-mysj'
                          className='appearance-none w-full md:w-56 leading-7 pl-3 pr-7 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md my-1'
                          onChange={(e) => {
                            setEmel(e.target.value);
                            setConfirmData({
                              ...confirmData,
                              emel: e.target.value,
                            });
                          }}
                        />
                        <span>
                          <FaEnvelope className='absolute top-3 right-2 text-kaunter3' />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-[1fr_2fr] m-2'>
                  <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-4 bg-user1 bg-opacity-5'>
                    nama:{' '}
                    {jenisIc === 'birth-of' ? null : (
                      <span className='font-semibold text-user6'>*</span>
                    )}
                  </p>
                  <div className='relative w-full'>
                    <input
                      required={jenisIc === 'birth-of' ? false : true}
                      type='text'
                      id='nama-umum'
                      name='nama-umum'
                      placeholder={
                        jenisIc === 'birth-of' || jenisIc === 'tiada-pengenalan'
                          ? 'isi nama'
                          : 'isi nama penuh mengikut pengenalan diri'
                      }
                      value={nama}
                      onChange={(e) => {
                        setNama(e.target.value);
                        setConfirmData({
                          ...confirmData,
                          nama: e.target.value,
                        });
                      }}
                      className='appearance-none w-full leading-7 pl-3 pr-7 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md uppercase'
                    />
                    <span>
                      <FaUserInjured className='absolute top-3 right-2 text-kaunter3' />
                    </span>
                  </div>
                </div>
                <div className='grid grid-cols-[1fr_2fr] m-2'>
                  <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-4 bg-user1 bg-opacity-5'>
                    umur: <span className='font-semibold text-user6'>*</span>
                  </p>
                  <div className='flex'>
                    <div className='relative'>
                      <input
                        disabled
                        placeholder='tahun'
                        type='number'
                        name='umur'
                        id='umur'
                        value={umur}
                        className='appearance-none w-16 md:w-20 py-1 px-2 ring-2 ring-kaunter3 outline-r-hidden focus:ring-2 focus:ring-kaunter3 focus:outline-none rounded-l-md peer'
                      />
                      <label
                        htmlFor='umur'
                        className='absolute left-3 bottom-7 text-xs text-kaunter1 bg-userWhite peer-placeholder-shown:text-kaunter3 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-7 peer-focus:text-xs transition-all'
                      >
                        Tahun
                      </label>
                    </div>
                    <div className='relative'>
                      <input
                        disabled
                        placeholder='bulan'
                        type='number'
                        name='umurBulan'
                        id='umurBulan'
                        value={umurBulan}
                        className='appearance-none w-16 md:w-20 py-1 px-2 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter3 focus:outline-none peer'
                      />
                      <label
                        htmlFor='umurBulan'
                        className='absolute left-3 bottom-7 text-xs text-kaunter1 bg-userWhite peer-placeholder-shown:text-kaunter3 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-7 peer-focus:text-xs transition-all'
                      >
                        Bulan
                      </label>
                    </div>
                    <div className='relative'>
                      <input
                        disabled
                        placeholder='bulan'
                        type='number'
                        name='umurHari'
                        id='umurHari'
                        value={umurHari}
                        className='appearance-none w-16 md:w-20 py-1 px-2 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter3 focus:outline-none rounded-r-md peer'
                      />
                      <label
                        htmlFor='umurHari'
                        className='absolute left-3 bottom-7 text-xs text-kaunter1 bg-userWhite peer-placeholder-shown:text-kaunter3 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-7 peer-focus:text-xs transition-all'
                      >
                        Hari
                      </label>
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-[1fr_2fr] m-2'>
                  <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-4 md:whitespace-nowrap bg-user1 bg-opacity-5'>
                    tarikh lahir{jenisIc === 'birth-of' && ' anak'}:
                    <span className='font-semibold text-user6'>*</span>
                  </p>
                  <div className='relative w-full md:w-56'>
                    <TarikhLahir />
                    <span className='absolute top-2 right-2 text-kaunter3'>
                      <FaCalendar />
                    </span>
                  </div>
                </div>
                <div className='grid grid-cols-[1fr_2fr] m-2'>
                  <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-4 bg-user1 bg-opacity-5'>
                    jantina:
                    {jenisIc === 'birth-of' ||
                    jenisIc === 'tiada-pengenalan' ? null : (
                      <span className='font-semibold text-user6'>*</span>
                    )}
                  </p>
                  <div className='relative w-full md:w-56'>
                    <select
                      required={
                        jenisIc === 'birth-of' || jenisIc === 'tiada-pengenalan'
                          ? false
                          : true
                      }
                      name='jantina'
                      id='jantina'
                      value={jantina}
                      onChange={(e) => {
                        setJantina(e.target.value);
                        setConfirmData({
                          ...confirmData,
                          jantina: e.target.value,
                        });
                      }}
                      className='appearance-none w-full md:w-56 text-sm leading-7 px-2 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md uppercase'
                    >
                      <option value=''>SILA PILIH..</option>
                      <option value='lelaki'>Lelaki</option>
                      <option value='perempuan'>Perempuan</option>
                    </select>
                    <span>
                      <FaRestroom className='absolute top-2 right-2 text-kaunter3' />
                    </span>
                  </div>
                </div>
                <div className='grid grid-cols-[1fr_2fr] m-2'>
                  <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-4 md:whitespace-nowrap bg-user1 bg-opacity-5'>
                    kumpulan etnik:{' '}
                    {jenisIc === 'birth-of' ||
                    jenisIc === 'tiada-pengenalan' ? null : (
                      <span className='font-semibold text-user6'>*</span>
                    )}
                  </p>
                  <div className='relative w-full md:w-56'>
                    <select
                      required={
                        jenisIc === 'birth-of' || jenisIc === 'tiada-pengenalan'
                          ? false
                          : true
                      }
                      name='kumpulanEtnik'
                      id='kumpulanEtnik'
                      value={kumpulanEtnik}
                      onChange={(e) => {
                        setKumpulanEtnik(e.target.value);
                        setConfirmData({
                          ...confirmData,
                          kumpulanEtnik: e.target.value,
                        });
                      }}
                      className='appearance-none w-full md:w-56 text-sm leading-7 px-2 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md uppercase'
                    >
                      <option value=''>SILA PILIH..</option>
                      <option value='melayu'>Melayu</option>
                      <option value='cina'>Cina</option>
                      <option value='india'>India</option>
                      <option value='bajau'>Bajau</option>
                      <option value='dusun'>Dusun</option>
                      <option value='kadazan'>Kadazan</option>
                      <option value='murut'>Murut</option>
                      <option value='bumiputera sabah lain'>
                        Bumiputera sabah lain
                      </option>
                      <option value='melanau'>Melanau</option>
                      <option value='kedayan'>Kedayan</option>
                      <option value='iban'>Iban</option>
                      <option value='bidayuh'>Bidayuh</option>
                      <option value='penan'>Penan</option>
                      <option value='bumiputera sarawak lain'>
                        Bumiputera sarawak lain
                      </option>
                      <option value='orang asli semenanjung'>
                        Orang asli semenanjung
                      </option>
                      <option value='lain-lain'>Lain-lain</option>
                      <option value='bukan warganegara'>
                        Bukan warganegara
                      </option>
                    </select>
                    <span>
                      <FaCaretSquareDown className='absolute top-3 right-2 text-kaunter3' />
                    </span>
                  </div>
                </div>
                <div className='grid grid-cols-[1fr_2fr] lg:col-start-1 m-2'>
                  <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-4 md:whitespace-nowrap bg-user1 bg-opacity-5'>
                    alamat:{' '}
                    {jenisIc === 'birth-of' ||
                    jenisIc === 'tiada-pengenalan' ? null : (
                      <span className='font-semibold text-user6'>*</span>
                    )}
                  </p>
                  <div className='relative w-full'>
                    <input
                      required={
                        jenisIc === 'birth-of' || jenisIc === 'tiada-pengenalan'
                          ? false
                          : true
                      }
                      value={alamat}
                      onChange={(e) => {
                        setAlamat(e.target.value);
                        setConfirmData({
                          ...confirmData,
                          alamat: e.target.value,
                        });
                      }}
                      type='text'
                      name='alamat'
                      className='appearance-none w-full leading-7 pl-3 pr-7 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md'
                    />
                    <span>
                      <FaHouseUser className='absolute top-3 right-2 text-kaunter3' />
                    </span>
                  </div>
                </div>
                <div className='grid grid-cols-[1fr_2fr] m-2'>
                  <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-4 md:whitespace-nowrap bg-user1 bg-opacity-5'>
                    daerah:{' '}
                    {jenisIc === 'birth-of' ||
                    jenisIc === 'tiada-pengenalan' ? null : (
                      <span className='font-semibold text-user6'>*</span>
                    )}
                  </p>
                  <div className='relative w-full md:w-56'>
                    <input
                      required={
                        jenisIc === 'birth-of' || jenisIc === 'tiada-pengenalan'
                          ? false
                          : true
                      }
                      value={daerahAlamat}
                      onChange={(e) => {
                        setDaerahAlamat(e.target.value);
                        setConfirmData({
                          ...confirmData,
                          daerahAlamat: e.target.value,
                        });
                      }}
                      type='text'
                      name='daerah-alamat'
                      className='appearance-none w-full md:w-56 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md'
                    />
                    <span>
                      <FaHouseUser className='absolute top-3 right-2 text-kaunter3' />
                    </span>
                  </div>
                </div>
                <div className='text-right grid grid-cols-[1fr_2fr] m-2'>
                  <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-4 md:whitespace-nowrap bg-user1 bg-opacity-5'>
                    negeri:{' '}
                    {jenisIc === 'birth-of' ||
                    jenisIc === 'tiada-pengenalan' ? null : (
                      <span className='font-semibold text-user6'>*</span>
                    )}
                  </p>
                  <div className='relative w-full md:w-56'>
                    <select
                      required={
                        jenisIc === 'birth-of' || jenisIc === 'tiada-pengenalan'
                          ? false
                          : true
                      }
                      value={negeriAlamat}
                      onChange={(e) => {
                        setNegeriAlamat(e.target.value);
                        setConfirmData({
                          ...confirmData,
                          negeriAlamat: e.target.value,
                        });
                      }}
                      className='appearance-none w-full md:w-56 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md'
                    >
                      <option value=''>SILA PILIH..</option>
                      <option value='johor'>Johor</option>
                      <option value='kedah'>Kedah</option>
                      <option value='kelantan'>Kelantan</option>
                      <option value='melaka'>Melaka</option>
                      <option value='negeri sembilan'>Negeri Sembilan</option>
                      <option value='pahang'>Pahang</option>
                      <option value='perak'>Perak</option>
                      <option value='perlis'>Perlis</option>
                      <option value='pulau pinang'>Pulau Pinang</option>
                      <option value='sabah'>Sabah</option>
                      <option value='sarawak'>Sarawak</option>
                      <option value='selangor'>Selangor</option>
                      <option value='terengganu'>Terengganu</option>
                      <option value='wp kuala lumpur'>WP Kuala Lumpur</option>
                      <option value='wp labuan'>WP Labuan</option>
                      <option value='wp putrajaya'>WP Putrajaya</option>
                    </select>
                    <span>
                      <FaHouseUser className='absolute top-3 right-2 text-kaunter3' />
                    </span>
                  </div>
                </div>
                <div className='grid grid-cols-[1fr_2fr] m-2 auto-rows-min'>
                  <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-4 md:whitespace-nowrap bg-user1 bg-opacity-5'>
                    poskod:{' '}
                    {jenisIc === 'birth-of' ||
                    jenisIc === 'tiada-pengenalan' ? null : (
                      <span className='font-semibold text-user6'>*</span>
                    )}
                  </p>
                  <div className='relative w-full md:w-56'>
                    <input
                      required={
                        jenisIc === 'birth-of' || jenisIc === 'tiada-pengenalan'
                          ? false
                          : true
                      }
                      type='text'
                      name='poskod-alamat'
                      pattern='[0-9]+'
                      title='5 numbers poskod'
                      minLength={5}
                      maxLength={5}
                      value={poskodAlamat}
                      onChange={(e) => {
                        setPoskodAlamat(e.target.value);
                        setConfirmData({
                          ...confirmData,
                          poskodAlamat: e.target.value,
                        });
                      }}
                      placeholder='62519'
                      className='appearance-none w-full md:w-56 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md'
                    />
                    <span>
                      <FaHouseUser className='absolute top-3 right-2 text-kaunter3' />
                    </span>
                  </div>
                </div>
                <div className='grid grid-cols-[1fr_2fr] m-2 auto-rows-min'>
                  <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-4 bg-user1 bg-opacity-5'>
                    status pesakit:
                  </p>
                  <div className=''>
                    {jantina === 'perempuan' && umur >= 8 && (
                      <div className='flex flex-col pl-2 md:pl-5'>
                        <div className='flex flex-row items-center'>
                          <input
                            type='checkbox'
                            name='hamil'
                            id='hamil'
                            value='hamil'
                            checked={ibuMengandung}
                            onChange={() => {
                              setIbuMengandung(!ibuMengandung);
                              setConfirmData({
                                ...confirmData,
                                ibuMengandung: !ibuMengandung,
                              });
                            }}
                            className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                          />
                          <label htmlFor='hamil' className='m-2 text-sm font-m'>
                            Ibu mengandung
                          </label>
                        </div>
                        {ibuMengandung === true && (
                          <div className='flex flex-col outline outline-1 outline-userBlack p-2'>
                            <div className='flex flex-col md:flex-row text-xs md:text-sm'>
                              <label
                                htmlFor='episod-mengandung'
                                className='m-2 text-left font-light'
                              >
                                Gravida Mengandung
                              </label>
                              <div className='relative w-full md:w-48'>
                                <select
                                  name='episod-mengandung'
                                  id='episod-mengandung'
                                  value={episodMengandung}
                                  className='appearance-none w-full md:w-48 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md'
                                  onChange={(e) => {
                                    setEpisodMengandung(e.target.value);
                                    setConfirmData({
                                      ...confirmData,
                                      episodMengandung: e.target.value,
                                    });
                                  }}
                                >
                                  <option value=''>SILA PILIH..</option>
                                  <option value='1'>1</option>
                                  <option value='2'>2</option>
                                  <option value='3'>3</option>
                                  <option value='4'>4</option>
                                  <option value='5'>5</option>
                                  <option value='6'>6</option>
                                  <option value='7'>7</option>
                                  <option value='8'>8</option>
                                  <option value='9'>9</option>
                                  <option value='10'>10</option>
                                  <option value='11'>11</option>
                                  <option value='12'>12</option>
                                  <option value='13'>13</option>
                                  <option value='14'>14</option>
                                  <option value='15'>15</option>
                                  <option value='16'>16</option>
                                  <option value='17'>17</option>
                                  <option value='18'>18</option>
                                  <option value='19'>19</option>
                                  <option value='20'>20</option>
                                  <option value='21'>21</option>
                                  <option value='22'>22</option>
                                </select>
                                <span>
                                  <FaCaretSquareDown className='absolute top-3 right-2 text-kaunter3' />
                                </span>
                              </div>
                            </div>
                            <div className='flex flex-col md:flex-row text-xs md:text-sm'>
                              <p className='text-left font-light m-2'>
                                didaftarkan di KKIA pada tahun semasa
                              </p>
                              <div className='flex items-center'>
                                <input
                                  type='radio'
                                  name='booking-im'
                                  id='ya-booking-im'
                                  value='ya-booking-im'
                                  checked={
                                    bookingIM === 'ya-booking-im' ? true : false
                                  }
                                  onChange={(e) => setBookingIM(e.target.value)}
                                  className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                                />
                                <label
                                  htmlFor='ya-booking-im'
                                  className='m-2 text-xs md:text-sm font-light'
                                >
                                  ya
                                </label>
                              </div>
                              <div className='flex items-center'>
                                <input
                                  type='radio'
                                  name='booking-im'
                                  id='tidak-booking-im'
                                  value='tidak-booking-im'
                                  checked={
                                    bookingIM === 'tidak-booking-im'
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => setBookingIM(e.target.value)}
                                  className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                                />
                                <label
                                  htmlFor='tidak-booking-im'
                                  className='m-2 text-xs md:text-sm font-light'
                                >
                                  tidak
                                </label>
                              </div>
                            </div>
                            {bookingIM === 'ya-booking-im' && (
                              <div>
                                <input
                                  type='checkbox'
                                  name='mengandung-dah-gravida'
                                  id='mengandung-dah-gravida'
                                  value='mengandung-dah-gravida'
                                  checked={mengandungDahGravida ? true : false}
                                  onChange={() => {
                                    setMengandungDahGravida(
                                      !mengandungDahGravida
                                    );
                                    setConfirmData({
                                      ...confirmData,
                                      mengandungDahGravida:
                                        !mengandungDahGravida,
                                    });
                                  }}
                                  className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                                />
                                <label
                                  htmlFor='mengandung-dah-gravida'
                                  className='m-2 text-xs md:text-sm font-light'
                                >
                                  Telah diperiksa dalam gravida yang sama
                                </label>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    {umur >= 7 && umur <= 21 && (
                      <div className='flex items-center flex-row pl-2 md:pl-5'>
                        <input
                          type='checkbox'
                          name='bersekolah'
                          id='bersekolah'
                          value='bersekolah'
                          checked={bersekolah}
                          onChange={() => {
                            setBersekolah(!bersekolah);
                            setConfirmData({
                              ...confirmData,
                              bersekolah: !bersekolah,
                            });
                          }}
                          className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                        />
                        <label
                          htmlFor='bersekolah'
                          className='m-2 text-sm font-m'
                        >
                          Bersekolah
                        </label>
                      </div>
                    )}
                    <div className='flex items-center flex-row pl-2 md:pl-5'>
                      <input
                        type='checkbox'
                        name='oku'
                        id='oku'
                        value='oku'
                        checked={orangKurangUpaya}
                        onChange={() => {
                          setOrangKurangUpaya(!orangKurangUpaya);
                          setConfirmData({
                            ...confirmData,
                            orangKurangUpaya: !orangKurangUpaya,
                          });
                        }}
                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 mr-1 md:mr-0'
                      />
                      <label htmlFor='oku' className='md:m-2 text-sm font-m'>
                        Orang Kurang Upaya (OKU)
                      </label>
                    </div>
                  </div>
                  {orangKurangUpaya === true && (
                    <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-4 bg-user1 bg-opacity-5 mt-2'>
                      no. OKU:
                      <span className='font-semibold text-user6'>*</span>
                    </p>
                  )}
                  {orangKurangUpaya === true && (
                    <input
                      required
                      value={noOku}
                      onChange={(e) => setNoOku(e.target.value)}
                      type='text'
                      name='no-oku'
                      className='appearance-none w-full md:w-56 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md mt-2'
                    />
                  )}
                </div>
                <div className='grid grid-cols-[1fr_2fr] m-2 auto-rows-min'>
                  <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-4 bg-user1 bg-opacity-5'>
                    status pesara:
                  </p>
                  <div className='relative w-full md:w-56'>
                    <select
                      name='statusPesara'
                      id='statusPesara'
                      value={statusPesara}
                      onChange={(e) => {
                        setStatusPesara(e.target.value);
                        setConfirmData({
                          ...confirmData,
                          statusPesara: e.target.value,
                        });
                      }}
                      className='appearance-none w-full md:w-56 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md'
                    >
                      <option value=''>SILA PILIH..</option>
                      <option value='pesara-kerajaan'>Pesara kerajaan</option>
                      <option value='pesara-atm'>Pesara ATM</option>
                    </select>
                    <span>
                      <FaCaretSquareDown className='absolute top-3 right-2 text-kaunter3' />
                    </span>
                  </div>
                  {statusPesara !== '' && (
                    <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-4 bg-user1 bg-opacity-5 mt-2'>
                      No. Pesara:{' '}
                      <span className='font-semibold text-user6'>*</span>
                    </p>
                  )}
                  {statusPesara !== '' && (
                    <input
                      required
                      value={noPesara}
                      onChange={(e) => setNoPesara(e.target.value)}
                      type='text'
                      name='no-pesara'
                      className='appearance-none w-full md:w-56 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md mt-2'
                    />
                  )}
                </div>
                <div className='grid grid-cols-[1fr_2fr] m-2 auto-rows-min'>
                  <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-4 bg-user1 bg-opacity-5'>
                    rujuk daripada:{' '}
                  </p>
                  <div className='relative w-full md:w-56'>
                    <select
                      name='rujukDaripada'
                      id='rujukDaripada'
                      value={rujukDaripada}
                      onChange={(e) => {
                        setRujukDaripada(e.target.value);
                        setConfirmData({
                          ...confirmData,
                          rujukDaripada: e.target.value,
                        });
                      }}
                      className='appearance-none w-full md:w-56 leading-7 pl-3 pr-7 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md'
                    >
                      <option value=''>SILA PILIH..</option>
                      <option value='dalaman'>Dalaman</option>
                      <option value='kp'>Klinik Pergigian Kerajaan</option>
                      <option value='kk'>Klinik Kesihatan Kerajaan</option>
                      <option value='hospital/institusi-kerajaan'>
                        Hospital / Institusi Kerajaan
                      </option>
                      <option value='swasta'>Swasta</option>
                      <option value='lain-lain'>Lain-lain</option>
                    </select>
                    <span>
                      <FaCaretSquareDown className='absolute top-3 right-2 text-kaunter3' />
                    </span>
                    {(rujukDaripada === 'lain-lain' ||
                      rujukDaripada === 'swasta') &&
                      umur <= 4 && (
                        <div className='flex items-center flex-row pl-2 md:pl-5'>
                          <input
                            type='checkbox'
                            name='gtod'
                            id='gtod'
                            value='gtod'
                            checked={gtod}
                            onChange={() => {
                              setGtod(!gtod);
                              setConfirmData({
                                ...confirmData,
                                gtod: !gtod,
                              });
                            }}
                            className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 mr-1 md:mr-0'
                          />
                          <label
                            htmlFor='gtod'
                            className='md:m-2 text-sm font-m'
                          >
                            G-Tod
                          </label>
                        </div>
                      )}
                  </div>
                </div>
                <div className='grid grid-cols-[1fr_2fr] m-2 auto-rows-min'>
                  <div className='text-xs md:text-sm text-right font-semibold flex flex-col mr-4 pt-2 bg-user1 bg-opacity-5'>
                    <p>catatan : </p>
                    {(jenisFasiliti === 'kp' ||
                      jenisFasiliti === 'projek-komuniti-lain') && (
                      <div>
                        <p className='pt-4 md:pt-3 text-xs md:text-sm font-light md:font-normal'>
                          bayaran pendaftaran :
                        </p>
                        {tambahBayaran && (
                          <p className='pt-9 md:pt-8 text-xs md:text-sm font-light md:font-normal'>
                            bayaran rawatan :
                          </p>
                        )}
                        {tambahBayaran2 && (
                          <p className='pt-9 md:pt-9 text-xs md:text-sm font-light md:font-normal'>
                            bayaran tambahan :
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    {statusPesara === '' &&
                      (jenisFasiliti === 'kp' ||
                        jenisFasiliti === 'projek-komuniti-lain') && (
                        <div className='flex flex-row'>
                          <input
                            type='checkbox'
                            name='kakitangankerajaan'
                            id='kakitangankerajaan'
                            checked={kakitanganKerajaan ? true : false}
                            onChange={() => {
                              setKakitanganKerajaan(!kakitanganKerajaan);
                              setConfirmData({
                                ...confirmData,
                                kakitanganKerajaan: !kakitanganKerajaan,
                              });
                            }}
                            className='mr-2'
                          />
                          <label
                            htmlFor='kakitangankerajaan'
                            className='normal-case'
                          >
                            e-GL
                          </label>
                        </div>
                      )}
                    {(jenisFasiliti === 'kp' ||
                      jenisFasiliti === 'projek-komuniti-lain') && (
                      <div>
                        <div className='flex flex-row justify-start'>
                          <div
                            className='relative w-20 my-2'
                            title='Bayaran dalam RM'
                          >
                            <CurrencyFormat
                              value={noBayaran}
                              thousandSeparator={true}
                              prefix={'RM '}
                              name='no-bayaran'
                              id='no-bayaran'
                              placeholder=' '
                              decimalScale={0}
                              className='appearance-none w-20 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-l-md peer'
                              onChange={(e) => {
                                setNoBayaran(e.target.value);
                                setConfirmData({
                                  ...confirmData,
                                  noBayaran: e.target.value,
                                });
                              }}
                            />
                            <label
                              htmlFor='no-bayaran'
                              className='absolute left-3 bottom-7 text-xs text-kaunter1 bg-userWhite peer-placeholder-shown:text-kaunter3 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-7 peer-focus:text-xs transition-all duration-500'
                            >
                              Bayaran
                            </label>
                          </div>
                          <div
                            className='relative w-full md:w-60 my-2'
                            title='No. Resit'
                          >
                            <input
                              type='text'
                              name='no-resit'
                              id='no-resit'
                              placeholder=' '
                              value={noResit}
                              onChange={(e) => {
                                setNoResit(e.target.value);
                                setConfirmData({
                                  ...confirmData,
                                  noResit: e.target.value,
                                });
                              }}
                              className='appearance-none w-full md:w-60 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-r-md peer'
                            />
                            <label
                              htmlFor='no-resit'
                              className='absolute left-3 bottom-7 text-xs text-kaunter1 bg-userWhite peer-placeholder-shown:text-kaunter3 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-7 peer-focus:text-xs transition-all duration-500'
                            >
                              No. Resit
                            </label>
                            <span>
                              <FaMoneyCheckAlt className='absolute top-3 right-2 text-kaunter3' />
                            </span>
                          </div>
                          {tambahBayaran2 === false ? (
                            <span className='text-lg md:text-2xl flex items-center ml-1'>
                              {tambahBayaran ? (
                                <FaMinusCircle
                                  className='text-kaunter3 cursor-pointer'
                                  onClick={() => {
                                    setTambahBayaran(false);
                                  }}
                                />
                              ) : (
                                <FaPlusCircle
                                  className='text-kaunter3 cursor-pointer'
                                  onClick={() => {
                                    setTambahBayaran(true);
                                  }}
                                />
                              )}
                            </span>
                          ) : (
                            <span className='text-lg md:text-2xl flex items-center ml-1'>
                              <FaMinusCircle className='text-kaunter3' />
                            </span>
                          )}
                        </div>
                        {tambahBayaran && (
                          <div className='flex flex-row justify-start'>
                            <div
                              className='relative w-20 my-2'
                              title='Bayaran dalam RM'
                            >
                              <CurrencyFormat
                                value={noBayaran2}
                                thousandSeparator={true}
                                prefix={'RM '}
                                name='no-bayaran-2'
                                id='no-bayaran-2'
                                placeholder=' '
                                decimalScale={0}
                                className='appearance-none w-20 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-l-md peer'
                                onChange={(e) => {
                                  setNoBayaran2(e.target.value);
                                  setConfirmData({
                                    ...confirmData,
                                    noBayaran2: e.target.value,
                                  });
                                }}
                              />
                              <label
                                htmlFor='no-bayaran-2'
                                className='absolute left-3 bottom-7 text-xs text-kaunter1 bg-userWhite peer-placeholder-shown:text-kaunter3 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-7 peer-focus:text-xs transition-all duration-500'
                              >
                                Bayaran
                              </label>
                            </div>
                            <div
                              className='relative w-full md:w-60 my-2'
                              title='No. Resit'
                            >
                              <input
                                type='text'
                                name='no-resit-2'
                                id='no-resit-2'
                                placeholder=' '
                                value={noResit2}
                                onChange={(e) => {
                                  setNoResit2(e.target.value);
                                  setConfirmData({
                                    ...confirmData,
                                    noResit2: e.target.value,
                                  });
                                }}
                                className='appearance-none w-full md:w-60 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-r-md peer'
                              />
                              <label
                                htmlFor='no-resit-2'
                                className='absolute left-3 bottom-7 text-xs text-kaunter1 bg-userWhite peer-placeholder-shown:text-kaunter3 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-7 peer-focus:text-xs transition-all duration-500'
                              >
                                No. Resit
                              </label>
                              <span>
                                <FaMoneyCheckAlt className='absolute top-3 right-2 text-kaunter3' />
                              </span>
                            </div>
                            <span className='text-lg md:text-2xl flex items-center ml-1'>
                              {tambahBayaran2 ? (
                                <FaMinusCircle
                                  className='text-kaunter3 cursor-pointer'
                                  onClick={() => {
                                    setTambahBayaran2(false);
                                  }}
                                />
                              ) : (
                                <FaPlusCircle
                                  className='text-kaunter3 cursor-pointer'
                                  onClick={() => {
                                    setTambahBayaran2(true);
                                  }}
                                />
                              )}
                            </span>
                          </div>
                        )}
                        {tambahBayaran2 && (
                          <div className='flex flex-row justify-start'>
                            <div
                              className='relative w-20 my-2'
                              title='Bayaran dalam RM'
                            >
                              <CurrencyFormat
                                value={noBayaran3}
                                thousandSeparator={true}
                                prefix={'RM '}
                                name='no-bayaran-3'
                                id='no-bayaran-3'
                                placeholder=' '
                                decimalScale={0}
                                className='appearance-none w-20 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-l-md peer'
                                onChange={(e) => {
                                  setNoBayaran3(e.target.value);
                                  setConfirmData({
                                    ...confirmData,
                                    noBayaran3: e.target.value,
                                  });
                                }}
                              />
                              <label
                                htmlFor='no-bayaran-3'
                                className='absolute left-3 bottom-7 text-xs text-kaunter1 bg-userWhite peer-placeholder-shown:text-kaunter3 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-7 peer-focus:text-xs transition-all duration-500'
                              >
                                Bayaran
                              </label>
                            </div>
                            <div
                              className='relative w-full md:w-60 my-2'
                              title='No. Resit'
                            >
                              <input
                                type='text'
                                name='no-resit-3'
                                id='no-resit-3'
                                placeholder=' '
                                value={noResit3}
                                onChange={(e) => {
                                  setNoResit3(e.target.value);
                                  setConfirmData({
                                    ...confirmData,
                                    noResit3: e.target.value,
                                  });
                                }}
                                className='appearance-none w-full md:w-60 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-r-md peer'
                              />
                              <label
                                htmlFor='no-resit-3'
                                className='absolute left-3 bottom-7 text-xs text-kaunter1 bg-userWhite peer-placeholder-shown:text-kaunter3 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-7 peer-focus:text-xs transition-all duration-500'
                              >
                                No. Resit
                              </label>
                              <span>
                                <FaMoneyCheckAlt className='absolute top-3 right-2 text-kaunter3' />
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <div
                      className='relative w-full mt-2'
                      title='No. Slip Cuti Sakit/Lain-lain Catatan Penting'
                    >
                      <input
                        type='text'
                        name='catatan'
                        id='catatan'
                        placeholder=' '
                        value={catatan}
                        onChange={(e) => {
                          setCatatan(e.target.value);
                          setConfirmData({
                            ...confirmData,
                            catatan: e.target.value,
                          });
                        }}
                        className='appearance-none w-full leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md peer'
                      />
                      <label
                        htmlFor='catatan'
                        className='absolute left-3 bottom-7 text-xs text-kaunter1 bg-userWhite peer-placeholder-shown:text-kaunter3 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-7 peer-focus:text-xs transition-all duration-500'
                      >
                        Lain-lain
                      </label>
                      <span>
                        <FaMoneyCheckAlt className='absolute top-3 right-2 text-kaunter3' />
                      </span>
                    </div>
                  </div>
                </div>
                {jenisFasiliti === 'kp' && (
                  <>
                    <article className='grid grid-cols-[1fr_2fr] px-1 auto-rows-min'>
                      <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-4 py-1 bg-user1 bg-opacity-5'>
                        Perkhidmatan Pergigian Endodontik Di Klinik Pergigian
                        Primer (KEPP) :
                      </p>
                      <div className='grid justify-start border border-userBlack pl-3 p-2 rounded-md'>
                        <div className='flex items-center flex-row pl-1 md:pl-5'>
                          <input
                            type='checkbox'
                            id='kepp'
                            name='kepp'
                            checked={kepp}
                            onChange={() => {
                              setKepp(!kepp);
                            }}
                            className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                          />
                          <label htmlFor='kepp' className='ml-2 text-sm font-m'>
                            KEPP
                          </label>
                        </div>
                        {kepp && (
                          <>
                            <div className='flex items-center flex-row pl-5 '>
                              <p className='font-semibold'>
                                kedatangan KEPP{' '}
                                <span className='font-semibold text-user6'>
                                  *
                                </span>
                              </p>
                            </div>
                            <div className='flex items-center flex-row pl-5 '>
                              <input
                                required
                                type='radio'
                                name='kedatangan-kepp'
                                id='baru-kedatangan-kepp'
                                value='baru-kedatangan-kepp'
                                checked={
                                  kedatanganKepp === 'baru-kedatangan-kepp'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setKedatanganKepp(e.target.value);
                                }}
                                className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='baru-kedatangan-kepp'
                                className='m-2 text-sm font-m'
                              >
                                baru
                              </label>
                            </div>
                            <div className='flex items-center flex-row pl-5 '>
                              <input
                                required
                                type='radio'
                                name='kedatangan-kepp'
                                id='ulangan-kedatangan-kepp'
                                value='ulangan-kedatangan-kepp'
                                checked={
                                  kedatanganKepp === 'ulangan-kedatangan-kepp'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setKedatanganKepp(e.target.value);
                                }}
                                className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='ulangan-kedatangan-kepp'
                                className='m-2 text-sm font-m'
                              >
                                ulangan
                              </label>
                            </div>
                          </>
                        )}
                        <div
                          className={`${
                            kedatanganKepp === 'baru-kedatangan-kepp'
                              ? 'visible'
                              : 'hidden'
                          } flex flex-col pl-5`}
                        >
                          <label className='m-2 text-sm flex text-left flex-row justify-start'>
                            tarikh rujukan
                          </label>
                          <TarikhRujukanKepp />
                        </div>
                        <div
                          className={`${
                            kedatanganKepp === 'ulangan-kedatangan-kepp'
                              ? 'visible'
                              : 'hidden'
                          } flex flex-col pl-5`}
                        >
                          <label className='m-2 text-sm flex text-left flex-row justify-start'>
                            tarikh perundingan pertama
                          </label>
                          <TarikhRundinganPertama />
                        </div>
                        <div
                          className={`${
                            kedatanganKepp === 'ulangan-kedatangan-kepp'
                              ? 'visible'
                              : 'hidden'
                          } flex flex-col pl-5`}
                        >
                          <label className='m-2 text-sm flex text-left flex-row justify-start'>
                            tarikh mula rawatan
                          </label>
                          <TarikhMulaRawatanKepp />
                        </div>
                      </div>
                    </article>
                    {/* <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                      <p className='font-semibold col-span-2'>
                        penyampaian perkhidmatan
                      </p>
                      <div className='flex items-center flex-row pl-5 '>
                        <input
                          type='checkbox'
                          id='kp-bergerak-maklumat-lanjut-umum'
                          name='kp-bergerak-maklumat-lanjut-umum'
                          checked={kpBergerak ? true : false}
                          onChange={() => {
                            setKpBergerak(!kpBergerak);
                          }}
                          className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='kp-bergerak-maklumat-lanjut-umum'
                          className='m-2 text-sm font-m'
                        >
                          KP bergerak
                        </label>
                        <select
                          name='label-kp-bergerak-maklumat-lanjut-umum'
                          id='label-kp-bergerak-maklumat-lanjut-umum'
                          value={labelKpBergerak}
                          onChange={(e) => {
                            setLabelKpBergerak(e.target.value);
                          }}
                          className='outline outline-1 outline-userBlack m-2 text-sm font-m'
                        >
                          <option value=''>Label</option>
                          <option value='apa??'>Apa?</option>
                        </select>
                      </div>
                      <div className='flex items-center flex-row pl-5 '>
                        <input
                          type='checkbox'
                          id='pasukan-pergigian-bergerak-maklumat-lanjut-umum'
                          name='pasukan-pergigian-bergerak-maklumat-lanjut-umum'
                          checked={pasukanPergigianBergerak ? true : false}
                          onChange={() => {
                            setPasukanPergigianBergerak(
                              !pasukanPergigianBergerak
                            );
                          }}
                          className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='pasukan-pergigian-bergerak-maklumat-lanjut-umum'
                          className='m-2 text-sm font-m'
                        >
                          pasukan pergigian bergerak
                        </label>
                      </div>
                      <div className='flex items-center flex-row pl-5 '>
                        <input
                          type='checkbox'
                          id='makmal-pergigian-bergerak-maklumat-lanjut-umum'
                          name='makmal-pergigian-bergerak-maklumat-lanjut-umum'
                          checked={makmalPergigianBergerak ? true : false}
                          onChange={() => {
                            setMakmalPergigianBergerak(
                              !makmalPergigianBergerak
                            );
                          }}
                          className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='makmal-pergigian-bergerak-maklumat-lanjut-umum'
                          className='m-2 text-sm font-m'
                        >
                          makmal pergigian bergerak
                        </label>
                        <select
                          name='label-makmal-pergigian-bergerak-maklumat-lanjut-umum'
                          id='label-makmal-pergigian-bergerak-maklumat-lanjut-umum'
                          value={labelMakmalPergigianBergerak}
                          onChange={(e) => {
                            setLabelMakmalPergigianBergerak(e.target.value);
                          }}
                          className='outline outline-1 outline-userBlack m-2 text-sm font-m'
                        >
                          <option value=''>Label</option>
                          <option value='apa??'>Apa?</option>
                        </select>
                      </div>
                    </article> */}
                  </>
                )}
                {jenisFasiliti === 'kk-kd' && (
                  <div className='row-span-4 border border-userBlack pl-3 p-2 rounded-md'>
                    <p className='font-semibold'>
                      nama fasiliti KKIA / KD{' '}
                      <span className='font-semibold text-user6'>*</span>
                    </p>
                    <select
                      required
                      name='nama-fasiliti-taska-tadika'
                      id='nama-fasiliti-taska-tadika'
                      value={kodFasilitiKkKd}
                      onChange={(e) => {
                        const selectedKkKd = kkKdAll.find(
                          (kkkd) => kkkd.kodKkiaKd === e.target.value
                        );
                        setNamaFasilitiKkKd(selectedKkKd.nama);
                        setKodFasilitiKkKd(selectedKkKd.kodKkiaKd);
                      }}
                      className='w-11/12 outline outline-1 outline-userBlack'
                    >
                      <option value=''>Pilih</option>
                      {kkKdAll.map((kkkd) => {
                        return (
                          <option value={kkkd.kodKkiaKd}>{kkkd.nama}</option>
                        );
                      })}
                    </select>
                  </div>
                )}
                {jenisFasiliti === 'taska-tadika' && (
                  <div className='row-span-4 border border-userBlack pl-3 p-2 rounded-md'>
                    <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                      <div>
                        <p className='font-semibold'>
                          fasiliti taska / tadika{' '}
                          <span className='font-semibold text-user6'>*</span>
                        </p>
                        <select
                          required
                          name='fasiliti-taska-tadika'
                          id='fasiliti-taska-tadika'
                          value={fasilitiTaskaTadika}
                          onChange={(e) => {
                            setFasilitiTaskaTadika(e.target.value);
                          }}
                          className='outline outline-1 outline-userBlack m-2 text-sm font-m'
                        >
                          <option value=''>Pilih</option>
                          <option value='taska'>Taska</option>
                          <option value='tadika'>Tadika</option>
                        </select>
                      </div>
                      <div className='overflow-x-auto'>
                        <input
                          type='checkbox'
                          id='kelas-toddler'
                          name='kelas-toddler'
                          value='kelas-toddler'
                          checked={kelasToddler}
                          onChange={() => {
                            setKelasToddler(!kelasToddler);
                          }}
                          className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                        />
                        <label
                          htmlFor='kelas-toddler'
                          className='ml-2 text-sm font-m'
                        >
                          Kelas toddler
                        </label>
                      </div>
                    </article>
                    <p className='font-semibold'>
                      nama fasiliti{' '}
                      <span className='font-semibold text-user6'>*</span>
                    </p>
                    <select
                      required
                      name='nama-fasiliti-taska-tadika'
                      id='nama-fasiliti-taska-tadika'
                      value={kodFasilitiTaskaTadika}
                      onChange={(e) => {
                        const selectedTastad = taskaTadikaAll.find(
                          (tt) => tt.kodTastad === e.target.value
                        );
                        setNamaFasilitiTaskaTadika(selectedTastad.nama);
                        setKodFasilitiTaskaTadika(selectedTastad.kodTastad);
                      }}
                      className='w-11/12 outline outline-1 outline-userBlack'
                    >
                      <option value=''>Pilih</option>
                      {taskaTadikaAll
                        .filter(
                          (tt) => tt.jenisFasiliti === fasilitiTaskaTadika
                        )
                        .map((tt) => {
                          return (
                            <option value={tt.kodTastad}>{tt.nama}</option>
                          );
                        })}
                    </select>
                  </div>
                )}
                {jenisFasiliti === 'ipt-kolej' && (
                  <div className='row-span-3'>
                    <article className='grid grid-cols-3 border border-userBlack pl-3 p-2 rounded-md'>
                      <div>
                        <p className='font-semibold'>
                          institusi pengajian tinggi / kolej
                        </p>
                      </div>
                      <div className='grid'>
                        <div className='flex items-center flex-row pl-5 '>
                          <input
                            type='radio'
                            name='institusi-pengajian-tinggi-kolej'
                            id='ipg-institusi-pengajian-tinggi-kolej'
                            value='ipg-institusi-pengajian-tinggi-kolej'
                            checked={
                              iptKolej ===
                              'ipg-institusi-pengajian-tinggi-kolej'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              setIptKolej(e.target.value);
                            }}
                            className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          />
                          <label
                            htmlFor='ipg-institusi-pengajian-tinggi-kolej'
                            className='m-2 text-sm font-m'
                          >
                            IPG
                          </label>
                        </div>
                        <div className='flex items-center flex-row pl-5 '>
                          <input
                            type='radio'
                            name='institusi-pengajian-tinggi-kolej'
                            id='kolej-komuniti-institusi-pengajian-tinggi-kolej'
                            value='kolej-komuniti-institusi-pengajian-tinggi-kolej'
                            checked={
                              iptKolej ===
                              'kolej-komuniti-institusi-pengajian-tinggi-kolej'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              setIptKolej(e.target.value);
                            }}
                            className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          />
                          <label
                            htmlFor='kolej-komuniti-institusi-pengajian-tinggi-kolej'
                            className='m-2 text-sm font-m'
                          >
                            kolej komuniti
                          </label>
                        </div>
                        <div className='flex items-center flex-row pl-5 '>
                          <input
                            type='radio'
                            name='institusi-pengajian-tinggi-kolej'
                            id='politeknik-institusi-pengajian-tinggi-kolej'
                            value='politeknik-institusi-pengajian-tinggi-kolej'
                            checked={
                              iptKolej ===
                              'politeknik-institusi-pengajian-tinggi-kolej'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              setIptKolej(e.target.value);
                            }}
                            className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          />
                          <label
                            htmlFor='politeknik-institusi-pengajian-tinggi-kolej'
                            className='m-2 text-sm font-m'
                          >
                            politeknik
                          </label>
                        </div>
                        <div className='flex items-center flex-row pl-5 '>
                          <input
                            type='radio'
                            name='institusi-pengajian-tinggi-kolej'
                            id='institut-latihan-kerajaan-institusi-pengajian-tinggi-kolej'
                            value='institut-latihan-kerajaan-institusi-pengajian-tinggi-kolej'
                            checked={
                              iptKolej ===
                              'institut-latihan-kerajaan-institusi-pengajian-tinggi-kolej'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              setIptKolej(e.target.value);
                            }}
                            className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          />
                          <label
                            htmlFor='institut-latihan-kerajaan-institusi-pengajian-tinggi-kolej'
                            className='m-2 text-sm font-m'
                          >
                            institut latihan kerajaan
                          </label>
                        </div>
                        <div className='flex items-center flex-row pl-5 '>
                          <input
                            type='radio'
                            name='institusi-pengajian-tinggi-kolej'
                            id='giatmara-institusi-pengajian-tinggi-kolej'
                            value='giatmara-institusi-pengajian-tinggi-kolej'
                            checked={
                              iptKolej ===
                              'giatmara-institusi-pengajian-tinggi-kolej'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              setIptKolej(e.target.value);
                            }}
                            className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          />
                          <label
                            htmlFor='giatmara-institusi-pengajian-tinggi-kolej'
                            className='m-2 text-sm font-m'
                          >
                            giatmara
                          </label>
                        </div>
                        <div className='flex items-center flex-row pl-5 '>
                          <input
                            type='radio'
                            name='institusi-pengajian-tinggi-kolej'
                            id='ipta-institusi-pengajian-tinggi-kolej'
                            value='ipta-institusi-pengajian-tinggi-kolej'
                            checked={
                              iptKolej ===
                              'ipta-institusi-pengajian-tinggi-kolej'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              setIptKolej(e.target.value);
                            }}
                            className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          />
                          <label
                            htmlFor='ipta-institusi-pengajian-tinggi-kolej'
                            className='m-2 text-sm font-m'
                          >
                            IPTA
                          </label>
                        </div>
                        <div className='flex items-center flex-row pl-5 '>
                          <input
                            type='radio'
                            name='institusi-pengajian-tinggi-kolej'
                            id='ipts-institusi-pengajian-tinggi-kolej'
                            value='ipts-institusi-pengajian-tinggi-kolej'
                            checked={
                              iptKolej ===
                              'ipts-institusi-pengajian-tinggi-kolej'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              setIptKolej(e.target.value);
                            }}
                            className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          />
                          <label
                            htmlFor='ipts-institusi-pengajian-tinggi-kolej'
                            className='m-2 text-sm font-m'
                          >
                            IPTS
                          </label>
                        </div>
                      </div>
                      <div className='grid justify-start'>
                        <div className='flex items-center flex-row pl-5 '>
                          <select
                            name='ipg-institusi-pengajian-tinggi-kolej'
                            id='ipg-institusi-pengajian-tinggi-kolej'
                            value={ipg}
                            onChange={(e) => {
                              setIpg(e.target.value);
                            }}
                            className='ml-5'
                          >
                            <option value=''>Label</option>
                            <option value='apa??'>Apa?</option>
                          </select>
                        </div>
                        <div className='flex items-center flex-row pl-5 '>
                          <select
                            name='kolej-komuniti-institusi-pengajian-tinggi-kolej'
                            id='kolej-komuniti-institusi-pengajian-tinggi-kolej'
                            value={kolejKomuniti}
                            onChange={(e) => {
                              setKolejKomuniti(e.target.value);
                            }}
                            className='ml-5'
                          >
                            <option value=''>Label</option>
                            <option value='apa??'>Apa?</option>
                          </select>
                        </div>
                        <div className='flex items-center flex-row pl-5 '>
                          <select
                            name='politeknik-institusi-pengajian-tinggi-kolej'
                            id='politeknik-institusi-pengajian-tinggi-kolej'
                            value={politeknik}
                            onChange={(e) => {
                              setPoliteknik(e.target.value);
                            }}
                            className='ml-5'
                          >
                            <option value=''>Label</option>
                            <option value='apa??'>Apa?</option>
                          </select>
                        </div>
                        <div className='flex items-center flex-row pl-5 '>
                          <select
                            name='institut-latihan-kerajaan-institusi-pengajian-tinggi-kolej'
                            id='institut-latihan-kerajaan-institusi-pengajian-tinggi-kolej'
                            value={institutLatihanKerajaan}
                            onChange={(e) => {
                              setInstitutLatihanKerajaan(e.target.value);
                            }}
                            className='ml-5'
                          >
                            <option value=''>Label</option>
                            <option value='apa??'>Apa?</option>
                          </select>
                        </div>
                        <div className='flex items-center flex-row pl-5 '>
                          <select
                            name='giatmara-institusi-pengajian-tinggi-kolej'
                            id='giatmara-institusi-pengajian-tinggi-kolej'
                            value={giatmara}
                            onChange={(e) => {
                              setGiatmara(e.target.value);
                            }}
                            className='ml-5'
                          >
                            <option value=''>Label</option>
                            <option value='apa??'>Apa?</option>
                          </select>
                        </div>
                        <div className='flex items-center flex-row pl-5 '>
                          <select
                            name='ipta-institusi-pengajian-tinggi-kolej'
                            id='ipta-institusi-pengajian-tinggi-kolej'
                            value={ipta}
                            onChange={(e) => {
                              setIpta(e.target.value);
                            }}
                            className='ml-5'
                          >
                            <option value=''>Label</option>
                            <option value='apa??'>Apa?</option>
                          </select>
                        </div>
                        <div className='flex items-center flex-row pl-5 '>
                          <select
                            name='ipts-institusi-pengajian-tinggi-kolej'
                            id='ipts-institusi-pengajian-tinggi-kolej'
                            value={ipts}
                            onChange={(e) => {
                              setIpts(e.target.value);
                            }}
                            className='ml-5'
                          >
                            <option value=''>Label</option>
                            <option value='apa??'>Apa?</option>
                          </select>
                        </div>
                      </div>
                      <div className='flex items-center flex-row pl-5 '>
                        <label
                          htmlFor='enrolmen-institusi-pengajian-tinggi-kolej'
                          className='m-2 text-sm font-m'
                        >
                          enrolmen
                        </label>
                        <input
                          type='checkbox'
                          id='enrolmen-institusi-pengajian-tinggi-kolej'
                          name='enrolmen-institusi-pengajian-tinggi-kolej'
                          value='enrolmen-institusi-pengajian-tinggi-kolej'
                          checked={enrolmenIptKolej}
                          onChange={() => {
                            setEnrolmenIptKolej(!enrolmenIptKolej);
                          }}
                          className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                      </div>
                    </article>
                  </div>
                )}
                {jenisFasiliti === 'insitusi-warga-emas' && (
                  <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <div>
                      <p className='font-semibold'>institusi warga emas</p>
                    </div>
                    <div className='grid'>
                      <div className='flex items-center flex-row pl-5 '>
                        <input
                          type='radio'
                          name='institusi-warga-emas'
                          id='kerajaan-institusi-warga-emas'
                          value='kerajaan-institusi-warga-emas'
                          checked={
                            institusiWargaEmas ===
                            'kerajaan-institusi-warga-emas'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setInstitusiWargaEmas(e.target.value);
                          }}
                          className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='kerajaan-institusi-warga-emas'
                          className='m-2 text-sm font-m'
                        >
                          kerajaan
                        </label>
                        <select
                          name='kerajaan-institusi-warga-emas'
                          id='kerajaan-institusi-warga-emas'
                          value={kerajaanInstitusiWargaEmas}
                          onChange={(e) => {
                            setKerajaanInstitusiWargaEmas(e.target.value);
                          }}
                          className='ml-3'
                        >
                          <option value=''>Label</option>
                          <option value='apa??'>Apa?</option>
                        </select>
                      </div>
                      <div className='flex items-center flex-row pl-5 '>
                        <input
                          type='radio'
                          name='institusi-warga-emas'
                          id='swasta-institusi-warga-emas'
                          value='swasta-institusi-warga-emas'
                          checked={
                            institusiWargaEmas === 'swasta-institusi-warga-emas'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setInstitusiWargaEmas(e.target.value);
                          }}
                          className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='swasta-institusi-warga-emas'
                          className='m-2 text-sm font-m'
                        >
                          swasta
                        </label>
                        <select
                          name='swasta-institusi-warga-emas'
                          id='swasta-institusi-warga-emas'
                          value={swastaInstitusiWargaEmas}
                          onChange={(e) => {
                            setSwastaInstitusiWargaEmas(e.target.value);
                          }}
                          className='ml-5'
                        >
                          <option value=''>Label</option>
                          <option value='apa??'>Apa?</option>
                        </select>
                      </div>
                    </div>
                  </article>
                )}
                {jenisFasiliti === 'institusi-oku' && (
                  <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <div>
                      <p className='font-semibold'>institusi OKU</p>
                    </div>
                    <div className='grid'>
                      <div className='flex items-center flex-row pl-5 '>
                        <input
                          type='radio'
                          name='institusi-oku'
                          id='pdk-institusi-oku'
                          value='pdk-institusi-oku'
                          checked={
                            institusiOku === 'pdk-institusi-oku' ? true : false
                          }
                          onChange={(e) => {
                            setInstitusiOku(e.target.value);
                          }}
                          className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='pdk-institusi-oku'
                          className='m-2 text-sm font-m'
                        >
                          PDK
                        </label>
                      </div>
                      <div className='flex items-center flex-row pl-5 '>
                        <input
                          type='radio'
                          name='institusi-oku'
                          id='non-pdk-institusi-oku'
                          value='non-pdk-institusi-oku'
                          checked={
                            institusiOku === 'non-pdk-institusi-oku'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setInstitusiOku(e.target.value);
                          }}
                          className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='non-pdk-institusi-oku'
                          className='m-2 text-sm font-m'
                        >
                          non - PDK
                        </label>
                      </div>
                    </div>
                  </article>
                )}
                {jenisFasiliti === 'kampung-angkat' && (
                  <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <div>
                      <p className='font-semibold'>KG angkat</p>
                    </div>
                    <div className='grid'>
                      <div className='flex items-center flex-row pl-5 '>
                        <input
                          type='radio'
                          name='kg-angkat'
                          id='komuniti-kg-angkat'
                          value='komuniti-kg-angkat'
                          checked={
                            kgAngkat === 'komuniti-kg-angkat' ? true : false
                          }
                          onChange={(e) => {
                            setKgAngkat(e.target.value);
                          }}
                          className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='komuniti-kg-angkat'
                          className='m-2 text-sm font-m'
                        >
                          komuniti
                        </label>
                      </div>
                      <div className='flex items-center flex-row pl-5 '>
                        <input
                          type='radio'
                          name='kg-angkat'
                          id='lawatan-ke-rumah-kg-angkat'
                          value='lawatan-ke-rumah-kg-angkat'
                          checked={
                            kgAngkat === 'lawatan-ke-rumah-kg-angkat'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setKgAngkat(e.target.value);
                          }}
                          className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='lawatan-ke-rumah-kg-angkat'
                          className='m-2 text-sm font-m'
                        >
                          lawatan ke rumah
                        </label>
                      </div>
                    </div>
                  </article>
                )}
              </div>
              <button
                onClick={() => {
                  if (jenisFasiliti === 'projek-komuniti-lain') {
                    setDariFormProgramKomuniti(true);
                    setFetchProgramData(!fetchProgramData);
                  }
                  setShowForm(false);
                }}
                className='m-2 p-2 w-44 uppercase rounded bg-kaunter3 hover:bg-kaunter1 hover:text-userWhite hover:cursor-pointer shadow-md transition-all'
              >
                kembali
              </button>
              {addingData ? <BusyButton /> : <SubmitButtton />}
            </form>
          </>
        )}
      </Confirmation>
    );
  }
}
