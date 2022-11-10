import { useState, useEffect } from 'react';
import { Spinner } from 'react-awesome-spinners';
import axios from 'axios';
import { FaInfoCircle, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

import Confirmation from './Confirmation';

import { useGlobalUserAppContext } from '../../context/userAppContext';

export default function FillableForm({
  showForm,
  setShowForm,
  editId,
  setEditId,
  jenisFasiliti,
  namaProgram,
  jenisProgram,
  kp,
}) {
  const { kaunterToken, Dictionary, dateToday, masterDatePicker, toast } =
    useGlobalUserAppContext();

  const [checkingIc, setCheckingIc] = useState(false);
  const [editLoading, setIsEditLoading] = useState(false);
  const [addingData, setAddingData] = useState(false);
  const [taskaTadikaAll, setTaskaTadikaAll] = useState([]);

  // for confirmation modal
  const [confirmData, setConfirmData] = useState({});

  // core
  const [tarikhKedatangan, setTarikhKedatangan] = useState(dateToday);
  const [waktuSampai, setWaktuSampai] = useState('');
  const [kedatangan, setKedatangan] = useState('');
  const [noPendaftaranBaru, setNoPendaftaranBaru] = useState('');
  const [noPendaftaranUlangan, setNoPendaftaranUlangan] = useState('');
  const [nama, setNama] = useState('');
  const [jenisIc, setJenisIc] = useState('');
  const [ic, setIc] = useState('');
  const [tarikhLahir, setTarikhLahir] = useState('');
  const [umur, setUmur] = useState(0);
  const [umurBulan, setUmurBulan] = useState(0);
  const [jantina, setJantina] = useState('');
  const [kumpulanEtnik, setKumpulanEtnik] = useState('');
  const [alamat, setAlamat] = useState('');
  const [daerahAlamat, setDaerahAlamat] = useState('');
  const [negeriAlamat, setNegeriAlamat] = useState('');
  const [poskodAlamat, setPoskodAlamat] = useState('');
  const [ibuMengandung, setIbuMengandung] = useState(false);
  const [episodMengandung, setEpisodMengandung] = useState('');
  const [bookingIM, setBookingIM] = useState(false);
  const [orangKurangUpaya, setOrangKurangUpaya] = useState(false);
  const [bersekolah, setBersekolah] = useState(false);
  const [noOku, setNoOku] = useState('');
  const [statusPesara, setStatusPesara] = useState('');
  const [rujukDaripada, setRujukDaripada] = useState('');
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

  // taska / tadika
  const [fasilitiTaskaTadika, setFasilitiTaskaTadika] = useState('');
  const [kelasToddler, setKelasToddler] = useState(false);
  const [namaFasilitiTaskaTadika, setNamaFasilitiTaskaTadika] = useState('');
  const [enrolmenTaskaTadika, setEnrolmenTaskaTadika] = useState(false);

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

  const TarikhKedatangan = () => {
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
      className:
        'appearance-none w-36 text-sm leading-7 px-2 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md uppercase flex flex-row',
    });
  };

  const TarikhLahir = () => {
    return masterDatePicker({
      selected: tarikhLahirDP,
      onChange: (tarikhLahir) => {
        const tempDate = moment(tarikhLahir).format('YYYY-MM-DD');
        const tahun = parseInt(howOldAreYouMyFriendtahun(tempDate));
        const bulan = parseInt(howOldAreYouMyFriendbulan(tempDate));
        setTarikhLahirDP(tarikhLahir);
        setTarikhLahir(tempDate);
        setUmur(tahun);
        setUmurBulan(bulan);
        setConfirmData({
          ...confirmData,
          tarikhLahir: tempDate,
        });
      },
      filterDate: (date) => {
        return moment() > date;
      },
      className:
        'appearance-none w-36 text-sm leading-7 px-2 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md uppercase flex flex-row',
    });
  };

  // kira tahun
  const howOldAreYouMyFriendtahun = (date) => {
    const today = new Date();
    const dob = new Date(date);
    const diff = today.getTime() - dob.getTime();
    const years = Math.floor(diff / 31556736000);
    const days_diff = Math.floor((diff % 31556736000) / 86400000);
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
        'appearance-none w-36 text-sm leading-7 px-2 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md uppercase flex flex-row',
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
        'appearance-none w-36 text-sm leading-7 px-2 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md uppercase flex flex-row',
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
        'appearance-none w-36 text-sm leading-7 px-2 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md uppercase flex flex-row',
    });
  };

  // check ic
  const checkIc = async (ic) => {
    setCheckingIc(true);
    try {
      const response = await axios.post(
        '/api/v1/kaunter/check',
        {
          ic,
        },
        {
          headers: { Authorization: `Bearer ${kaunterToken}` },
        }
      );
      toast.success('Pesakit pernah didaftarkan. Menggunakan data sedia ada');
      const {
        nama,
        tarikhLahir,
        umur,
        umurBulan,
        jantina,
        kumpulanEtnik,
        alamat,
        daerahAlamat,
        negeriAlamat,
        poskodAlamat,
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
      setJantina(jantina);
      setKumpulanEtnik(kumpulanEtnik);
      setAlamat(alamat);
      setDaerahAlamat(daerahAlamat);
      setNegeriAlamat(negeriAlamat);
      setPoskodAlamat(poskodAlamat);
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
        jantina,
        kumpulanEtnik,
        alamat,
        daerahAlamat,
        negeriAlamat,
        poskodAlamat,
        ibuMengandung,
        orangKurangUpaya,
        bersekolah,
        noOku,
        statusPesara,
      });
    } catch (error) {
      toast.error('Pesakit tidak pernah didaftarkan sebelum ini');
    }
    setCheckingIc(false);
  };

  // submission
  const handleSubmit = async (e) => {
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
              kedatangan,
              noPendaftaranBaru,
              noPendaftaranUlangan,
              nama: nama.toLowerCase(),
              jenisIc,
              ic,
              tarikhLahir,
              umur,
              umurBulan,
              jantina,
              kumpulanEtnik,
              alamat,
              daerahAlamat,
              negeriAlamat,
              poskodAlamat,
              ibuMengandung,
              orangKurangUpaya,
              bersekolah,
              noOku,
              statusPesara,
              rujukDaripada,
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
              // taska / tadika
              fasilitiTaskaTadika,
              kelasToddler,
              namaFasilitiTaskaTadika,
              enrolmenTaskaTadika,
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
              kedatangan,
              noPendaftaranBaru,
              noPendaftaranUlangan,
              nama: nama.toLowerCase(),
              jenisIc,
              ic,
              tarikhLahir,
              umur,
              umurBulan,
              jantina,
              kumpulanEtnik,
              alamat,
              daerahAlamat,
              negeriAlamat,
              poskodAlamat,
              ibuMengandung,
              orangKurangUpaya,
              bersekolah,
              noOku,
              statusPesara,
              rujukDaripada,
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
              // taska / tadika
              fasilitiTaskaTadika,
              kelasToddler,
              namaFasilitiTaskaTadika,
              enrolmenTaskaTadika,
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
          setShowForm(false);
          setAddingData(false);
        });
    }
  };

  // reset form when change jenisFasiliti or change showForm
  useEffect(() => {
    setTarikhKedatangan(dateToday);
    setWaktuSampai('');
    setKedatangan('');
    setNoPendaftaranBaru('');
    setNoPendaftaranUlangan('');
    setNama('');
    setJenisIc('');
    setIc('');
    setTarikhLahir('');
    setUmur(0);
    setUmurBulan(0);
    setJantina('');
    setKumpulanEtnik('');
    setAlamat('');
    setDaerahAlamat('');
    setNegeriAlamat('');
    setPoskodAlamat('');
    setIbuMengandung(false);
    setOrangKurangUpaya(false);
    setBersekolah(false);
    setNoOku('');
    setStatusPesara('');
    setRujukDaripada('');
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
    setFasilitiTaskaTadika('');
    setKelasToddler(false);
    setNamaFasilitiTaskaTadika('');
    setEnrolmenTaskaTadika(false);
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

  // reset ic when change jenis ic
  useEffect(() => {
    if (!editId) {
      setIc('');
    }
  }, [jenisIc]);

  // reset noOku when change kategori pesakit
  useEffect(() => {
    if (!editId) {
      setNoOku('');
    }
  }, [orangKurangUpaya]);

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

  // reset namaFasilitiTaskaTadika when change fasilitiTaskaTadika
  useEffect(() => {
    if (!editId) {
      setNamaFasilitiTaskaTadika('');
    }
  }, [fasilitiTaskaTadika]);

  // reset ibu mengandung if change jantina
  useEffect(() => {
    if (!editId) {
      setIbuMengandung(false);
    }
  }, [jantina]);

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
          setKedatangan(data.singlePersonKaunter.kedatangan);
          setNoPendaftaranBaru(data.singlePersonKaunter.noPendaftaranBaru);
          setNoPendaftaranUlangan(
            data.singlePersonKaunter.noPendaftaranUlangan
          );
          setNama(data.singlePersonKaunter.nama);
          setJenisIc(data.singlePersonKaunter.jenisIc);
          setIc(data.singlePersonKaunter.ic);
          setTarikhLahir(data.singlePersonKaunter.tarikhLahir);
          setUmur(data.singlePersonKaunter.umur);
          setUmurBulan(data.singlePersonKaunter.umurBulan);
          setJantina(data.singlePersonKaunter.jantina);
          setKumpulanEtnik(data.singlePersonKaunter.kumpulanEtnik);
          setAlamat(data.singlePersonKaunter.alamat);
          setDaerahAlamat(data.singlePersonKaunter.daerahAlamat);
          setNegeriAlamat(data.singlePersonKaunter.negeriAlamat);
          setPoskodAlamat(data.singlePersonKaunter.poskodAlamat);
          setIbuMengandung(data.singlePersonKaunter.ibuMengandung);
          setOrangKurangUpaya(data.singlePersonKaunter.orangKurangUpaya);
          setBersekolah(data.singlePersonKaunter.bersekolah);
          setNoOku(data.singlePersonKaunter.noOku);
          setStatusPesara(data.singlePersonKaunter.statusPesara);
          setRujukDaripada(data.singlePersonKaunter.rujukDaripada);
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
          // taska / tadika
          setFasilitiTaskaTadika(data.singlePersonKaunter.fasilitiTaskaTadika);
          setKelasToddler(data.singlePersonKaunter.kelasToddler);
          setNamaFasilitiTaskaTadika(
            data.singlePersonKaunter.namaFasilitiTaskaTadika
          );
          setEnrolmenTaskaTadika(data.singlePersonKaunter.enrolmenTaskaTadika);
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
          });
          setIsEditLoading(false);
        } catch (error) {
          console.log(error);
        }
      };
      fetchSinglePersonKaunter();
    }
  }, [editId]);

  // fetch taska/tadika if jenis fasiliti taska-tadika only
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
          className='inline-flex items-center text-center justify-center m-2 p-2 uppercase rounded bg-kaunter3 hover:bg-kaunter1 hover:text-userWhite hover:cursor-pointer shadow-md ease-in-out duration-150 cursor-not-allowed'
          disabled=''
        >
          <svg
            className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
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
          Menambah Data...
        </button>
      </>
    );
  }

  function SubmitButtton() {
    return (
      <button
        type='submit'
        className='m-2 p-2 uppercase rounded bg-kaunter3 hover:bg-kaunter1 hover:text-userWhite hover:cursor-pointer shadow-md transition-all'
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
        klinik={kp}
      >
        {(confirm) => (
          <>
            <form onSubmit={confirm(handleSubmit)}>
              <h1 className='bg-kaunter3 font-bold text-2xl'>pendaftaran</h1>
              <div className='grid grid-cols-1 lg:grid-cols-2'>
                <p className='font-semibold text-user6 mt-3 ml-3 mr-auto'>
                  * mandatori
                </p>
                <p className='font-semibold text-user6 lg:mt-3 lg:ml-auto'>
                  Fasiliti: {Dictionary[jenisFasiliti]}
                </p>
              </div>
              <div className='grid gap-1'>
                <div className='flex m-2 '>
                  <p className='mr-3 font-semibold flex flex-row items-center whitespace-nowrap'>
                    tarikh kedatangan:{' '}
                    <span className='font-semibold text-user6'>*</span>
                  </p>
                  <TarikhKedatangan />
                </div>
                <div className='flex m-2'>
                  <p className='mr-3 font-semibold'>
                    waktu tiba:{' '}
                    <span className='font-semibold text-user6'>*</span>
                  </p>
                  <input
                    required
                    value={waktuSampai}
                    onChange={(e) => setWaktuSampai(e.target.value)}
                    type='time'
                    name='waktuSampai'
                    className='appearance-none w-auto leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md'
                  />
                </div>
                <div className='flex m-2 flex-col md:flex-row'>
                  <div className='flex flex-row'>
                    <p className='mr-3 font-semibold flex text-center items-center'>
                      jenis pengenalan:{' '}
                      <span className='font-semibold text-user6'>*</span>
                    </p>
                    <select
                      required
                      id='pengenalan'
                      name='pengenalan'
                      value={jenisIc}
                      onChange={(e) => setJenisIc(e.target.value)}
                      className='appearance-none leading-7 px-2 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md m-1 inline-flex'
                    >
                      <option value=''>Sila pilih..</option>
                      <option value='mykad-mykid'>MyKad / MyKid</option>
                      <option value='passport'>Passport</option>
                      <option value='tentera'>Tentera</option>
                      <option value='polis'>Polis</option>
                      <option value='sijil-lahir'>Sijil lahir</option>
                    </select>
                  </div>
                  {jenisIc === 'mykad-mykid' && (
                    <input
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
                        setConfirmData({
                          ...confirmData,
                          ic: e.target.value,
                        });
                        if (e.target.value.length === 12) {
                          checkIc(e.target.value);
                        }
                      }}
                      placeholder='123456090987'
                      className='appearance-none leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md m-1'
                    />
                  )}
                  {/* myIdentity */}
                  <div>
                    {/* kalau ada myIdentity jadi betul then vice versa */}
                    <span>
                      <FaThumbsUp className='text-lg text-user7' />
                      <FaThumbsDown className='text-lg text-user9' />
                    </span>
                  </div>
                  {jenisIc !== 'mykad-mykid' && jenisIc !== '' && (
                    <input
                      required
                      type='text'
                      name='ic'
                      value={ic}
                      onChange={(e) => setIc(e.target.value)}
                      placeholder='123456121234'
                      className='appearance-none leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md m-1'
                    />
                  )}
                </div>
                <div className='flex flex-row m-2'>
                  {/* mySejahtera */}
                  <p className='mr-3 font-semibold flex text-center items-center'>
                    mySejahtera
                    <span className='font-semibold text-user6'>*</span>
                  </p>
                  <div>
                    <label htmlFor='nombor-telefon'>no. tel</label>
                    <input
                      type='text'
                      name='nombor-telefon'
                      id='nombor-telefon'
                      className='appearance-none leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md m-1'
                    />
                  </div>
                  <div>
                    <label htmlFor='email-mysj'>email </label>
                    <input
                      type='email'
                      name='email-mysj'
                      id='email-mysj'
                      className='appearance-none leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md m-1'
                    />
                  </div>
                </div>
                <div className='flex m-2'>
                  <p className='mr-2 font-semibold flex flex-row items-center'>
                    nama: <span className='font-semibold text-user6'>*</span>
                  </p>
                  <input
                    required
                    type='text'
                    id='nama-umum'
                    name='nama-umum'
                    value={nama}
                    onChange={(e) => {
                      setNama(e.target.value);
                      setConfirmData({ ...confirmData, nama: e.target.value });
                    }}
                    className='appearance-none w-full leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md uppercase'
                  />
                </div>
                <div className='flex m-2'>
                  <p className='mr-3 font-semibold flex flex-row items-center whitespace-nowrap'>
                    tarikh lahir:{' '}
                    <span className='font-semibold text-user6'>*</span>
                  </p>
                  <TarikhLahir />
                </div>
                <div className='flex m-2'>
                  <p className='mr-3 font-semibold'>
                    umur: <span className='font-semibold text-user6'>*</span>
                  </p>
                  <div className='relative'>
                    <input
                      disabled
                      placeholder='tahun'
                      type='number'
                      name='umur'
                      id='umur'
                      value={umur}
                      className='appearance-none w-20 py-1 px-2 ring-2 ring-kaunter3 outline-r-hidden focus:ring-2 focus:ring-kaunter3 focus:outline-none rounded-l-md peer'
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
                      className='appearance-none w-20 py-1 px-2 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter3 focus:outline-none rounded-r-md peer'
                    />
                    <label
                      htmlFor='umurBulan'
                      className='absolute left-3 bottom-7 text-xs text-kaunter1 bg-userWhite peer-placeholder-shown:text-kaunter3 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-7 peer-focus:text-xs transition-all'
                    >
                      Bulan
                    </label>
                  </div>
                </div>
                <div className='flex m-2'>
                  <p className='mr-3 font-semibold flex items-center'>
                    jantina: <span className='font-semibold text-user6'>*</span>
                  </p>
                  <select
                    required
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
                    className='appearance-none w-36 text-sm leading-7 px-2 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md uppercase m-1'
                  >
                    <option value=''>Sila pilih..</option>
                    <option value='lelaki'>Lelaki</option>
                    <option value='perempuan'>Perempuan</option>
                  </select>
                </div>
                <div className='flex m-2'>
                  <p className='mr-3 font-semibold flex items-center whitespace-nowrap'>
                    kumpulan etnik:{' '}
                    <span className='font-semibold text-user6'>*</span>
                  </p>
                  <select
                    required
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
                    <option value=''>Sila pilih..</option>
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
                    <option value='bukan warganegara'>Bukan warganegara</option>
                  </select>
                </div>
                <div className='flex m-2'>
                  <p className='mr-3 font-semibold whitespace-nowrap'>
                    alamat: <span className='font-semibold text-user6'>*</span>
                  </p>
                  <input
                    required
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
                    className='appearance-none w-full leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md'
                  />
                </div>
                <div className='flex m-2'>
                  <p className='mr-3 font-semibold flex items-center whitespace-nowrap'>
                    daerah: <span className='font-semibold text-user6'>*</span>
                  </p>
                  <input
                    required
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
                    className='appearance-none w-36 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md'
                  />
                </div>
                <div className='flex m-2'>
                  <p className='mr-3 font-semibold flex items-center whitespace-nowrap'>
                    negeri: <span className='font-semibold text-user6'>*</span>
                  </p>
                  <select
                    required
                    value={negeriAlamat}
                    onChange={(e) => {
                      setNegeriAlamat(e.target.value);
                      setConfirmData({
                        ...confirmData,
                        negeriAlamat: e.target.value,
                      });
                    }}
                    className='appearance-none w-36 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md'
                  >
                    <option value=''>Sila pilih..</option>
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
                    <option value='kuala lumpur'>WP Kuala Lumpur</option>
                    <option value='labuan'>WP Labuan</option>
                    <option value='putrajaya'>WP Putrajaya</option>
                  </select>
                </div>
                <div className='flex m-2'>
                  <p className='mr-3 font-semibold flex items-center whitespace-nowrap'>
                    poskod: <span className='font-semibold text-user6'>*</span>
                  </p>
                  <input
                    required
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
                    className='appearance-none w-36 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md'
                  />
                </div>
                <div className='flex m-2 flex-col md:flex-row'>
                  <p className='mr-3 font-semibold flex flex-row'>
                    status pesakit:
                  </p>
                  <div>
                    {jantina === 'perempuan' && (
                      <div className='flex flex-col pl-5'>
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
                            <div className='flex flex-row'>
                              <label
                                htmlFor='episod-mengandung'
                                className='m-2 text-sm font-m'
                              >
                                Gravida Mengandung
                              </label>
                              <select
                                name='episod-mengandung'
                                id='episod-mengandung'
                                className='appearance-none w-36 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md'
                              >
                                <option value=''>Sila pilih..</option>
                                <option value='1'>1</option>
                                <option value='2'>2</option>
                                <option value='3'>3</option>
                                <option value='4'>4</option>
                                <option value='5'>5</option>
                                <option value='6'>6</option>
                                <option value='7'>7</option>
                                <option value='8'>8</option>
                              </select>
                            </div>
                            <div className='flex flex-row'>
                              <p className='flex flex-row items-center text-sm font-m m-2'>
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
                                  className='m-2 text-sm font-m'
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
                                  className='m-2 text-sm font-m'
                                >
                                  tidak
                                </label>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <div className='flex items-center flex-row pl-5'>
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
                    <div className='flex items-center flex-row pl-5'>
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
                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                      />
                      <label htmlFor='oku' className='m-2 text-sm font-m'>
                        Orang Kurang Upaya (OKU)
                      </label>
                    </div>
                  </div>
                </div>
                {orangKurangUpaya === true && (
                  <div className='flex m-2'>
                    <p className='mr-3 font-semibold'>
                      no. OKU:{' '}
                      <span className='font-semibold text-user6'>*</span>
                    </p>
                    <input
                      required
                      value={noOku}
                      onChange={(e) => setNoOku(e.target.value)}
                      type='text'
                      name='no-oku'
                      className='appearance-none w-36 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md'
                    />
                  </div>
                )}
                <div className='flex m-2'>
                  <p className='mr-3 font-semibold'>status pesara:</p>
                  <select
                    // required
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
                    className='appearance-none w-36 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md'
                  >
                    <option value=''>Sila pilih..</option>
                    <option value='pesara-kerajaan'>Pesara kerajaan</option>
                    <option value='pesara-atm'>Pesara ATM</option>
                  </select>
                </div>
                <div className='flex m-2'>
                  <p className='mr-3 font-semibold'>rujuk daripada: </p>
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
                    className='appearance-none w-36 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md'
                  >
                    <option value=''>Sila pilih..</option>
                    <option value='dalaman'>Dalaman</option>
                    <option value='kp'>Klinik Pergigian Kerajaan</option>
                    <option value='kk'>Klinik Kesihatan Kerajaan</option>
                    <option value='hospital/institusi-kerajaan'>
                      Hospital / Institusi Kerajaan
                    </option>
                    <option value='swasta'>Swasta</option>
                    <option value='lain-lain'>Lain-lain</option>
                  </select>
                </div>
                <div className='flex m-2'>
                  <p className='font-semibold'>catatan </p>
                  <FaInfoCircle
                    className='text-userBlack text-sm cursor-pointer flex items-center justify-center m-1 mt-2'
                    title='No resit/Pengecualian bayaran/no.kad OKU/no. kad pesara/no. GL/no. slip cuti sakit/nama perawat/lain-lain catatan penting'
                  />
                  <p className='font-semibold mr-2'>
                    :
                    {statusPesara !== '' && (
                      <span className='font-semibold text-user6'>*</span>
                    )}
                  </p>
                  <input
                    type='text'
                    name='catatan'
                    id='catatan'
                    value={catatan}
                    required={statusPesara !== '' ? true : false}
                    onChange={(e) => {
                      setCatatan(e.target.value);
                      setConfirmData({
                        ...confirmData,
                        catatan: e.target.value,
                      });
                    }}
                    className='appearance-none w-full leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md shadow-md'
                  />
                </div>
                {jenisFasiliti === 'kp' && (
                  <>
                    <article className='grid justify-start border border-userBlack pl-3 p-2 rounded-md'>
                      <div className='grid'>
                        <div className='flex items-center flex-row pl-5'>
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
                      </div>
                      <div
                        className={`${
                          kedatanganKepp === 'baru-kedatangan-kepp'
                            ? 'visible'
                            : 'hidden'
                        } flex items-center flex-row pl-5`}
                      >
                        <label className='m-2 text-sm'>tarikh rujukan</label>
                        <TarikhRujukanKepp />
                      </div>
                      <div
                        className={`${
                          kedatanganKepp === 'ulangan-kedatangan-kepp'
                            ? 'visible'
                            : 'hidden'
                        } flex items-center flex-row pl-5`}
                      >
                        <label className='m-2 text-sm'>
                          tarikh perundingan pertama
                        </label>
                        <TarikhRundinganPertama />
                      </div>
                      <div
                        className={`${
                          kedatanganKepp === 'ulangan-kedatangan-kepp'
                            ? 'visible'
                            : 'hidden'
                        } flex items-center flex-row pl-5`}
                      >
                        <label className='m-2 text-sm'>
                          tarikh mula rawatan
                        </label>
                        <TarikhMulaRawatanKepp />
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
                {jenisFasiliti === 'taska-tadika' && (
                  <div className='row-span-4 border border-userBlack pl-3 p-2 rounded-md'>
                    <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                      <div>
                        <p className='font-semibold'>
                          fasiliti taska / tadika{' '}
                        </p>
                        <select
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
                    <p className='font-semibold'>nama fasiliti</p>
                    <select
                      name='nama-fasiliti-taska-tadika'
                      id='nama-fasiliti-taska-tadika'
                      value={namaFasilitiTaskaTadika}
                      onChange={(e) => {
                        setNamaFasilitiTaskaTadika(e.target.value);
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
                    <div className='flex items-center flex-row pl-5 '>
                      <label
                        htmlFor='enrolmen-taska-tadika'
                        className='m-2 text-sm font-m'
                      >
                        enrolmen
                      </label>
                      <input
                        type='checkbox'
                        id='enrolmen-taska-tadika'
                        name='enrolmen-taska-tadika'
                        value='enrolmen-taska-tadika'
                        checked={enrolmenTaskaTadika}
                        onChange={() => {
                          setEnrolmenTaskaTadika(!enrolmenTaskaTadika);
                        }}
                        className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                      />
                    </div>
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
              <span
                onClick={() => setShowForm(false)}
                className='m-2 p-2 uppercase rounded bg-kaunter3 hover:bg-kaunter1 hover:text-userWhite hover:cursor-pointer shadow-md transition-all'
              >
                kembali
              </span>
              {addingData ? <BusyButton /> : <SubmitButtton />}
            </form>
          </>
        )}
      </Confirmation>
    );
  }
}
