import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaWindowClose } from 'react-icons/fa';
import { FaInfoCircle } from 'react-icons/fa';
import moment from 'moment';

import { useGlobalUserAppContext } from '../../context/userAppContext';

function Kemaskini({ showKemaskini, setShowKemaskini, toast }) {
  const {
    userToken,
    reliefUserToken,
    useParams,
    masterDatePicker,
    Dictionary,
  } = useGlobalUserAppContext();

  const { personUmumId } = useParams();

  const [taskaTadikaAll, setTaskaTadikaAll] = useState([]);
  const [events, setEvents] = useState([]);

  // core
  const [jenisFasiliti, setJenisFasiliti] = useState('');
  const [tarikhKedatangan, setTarikhKedatangan] = useState('');
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

  // events
  const [jenisEvent, setJenisEvent] = useState('');
  const [namaEvent, setPilihanEvent] = useState('');

  // datepicker issues
  const [tarikhKedatanganDP, setTarikhKedatanganDP] = useState(new Date());
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
        'appearance-none w-36 text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md uppercase flex flex-row',
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
      },
      filterDate: (date) => {
        return moment() > date;
      },
      className:
        'appearance-none w-36 text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md uppercase flex flex-row',
    });
  };

  // kira tahun
  const howOldAreYouMyFriendtahun = (date) => {
    const today = new Date();
    const dob = new Date(date);
    const diff = today.getTime() - dob.getTime();
    const years = Math.floor(diff / 31556736000);
    const days_diff = Math.floor((diff % 31556736000) / 86400000);
    const months = Math.floor(days_diff / 30.4167);
    const days = Math.floor(days_diff % 30.4167);
    const values = `${years} years`;
    return values;
  };

  // kira bulan
  const howOldAreYouMyFriendbulan = (date) => {
    const today = new Date();
    const dob = new Date(date);
    const diff = today.getTime() - dob.getTime();
    const years = Math.floor(diff / 31556736000);
    const days_diff = Math.floor((diff % 31556736000) / 86400000);
    const months = Math.floor(days_diff / 30.4167);
    const days = Math.floor(days_diff % 30.4167);
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
        'appearance-none w-36 text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md uppercase flex flex-row',
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
        'appearance-none w-36 text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md uppercase flex flex-row',
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
        'appearance-none w-36 text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md uppercase flex flex-row',
    });
  };

  const closeModal = () => {
    setShowKemaskini(false);
  };

  useEffect(() => {
    const fetchSinglePersonUmum = async () => {
      try {
        const { data } = await axios.get(`/api/v1/umum/${personUmumId}`, {
          headers: {
            Authorization: `Bearer ${
              reliefUserToken ? reliefUserToken : userToken
            }`,
          },
        });
        setJenisFasiliti(data.singlePersonUmum.jenisFasiliti);
        // core
        setTarikhKedatangan(data.singlePersonUmum.tarikhKedatangan);
        setWaktuSampai(data.singlePersonUmum.waktuSampai);
        setKedatangan(data.singlePersonUmum.kedatangan);
        setNoPendaftaranBaru(data.singlePersonUmum.noPendaftaranBaru);
        setNoPendaftaranUlangan(data.singlePersonUmum.noPendaftaranUlangan);
        setNama(data.singlePersonUmum.nama);
        setJenisIc(data.singlePersonUmum.jenisIc);
        setIc(data.singlePersonUmum.ic);
        setTarikhLahir(data.singlePersonUmum.tarikhLahir);
        setUmur(data.singlePersonUmum.umur);
        setUmurBulan(data.singlePersonUmum.umurBulan);
        setJantina(data.singlePersonUmum.jantina);
        setKumpulanEtnik(data.singlePersonUmum.kumpulanEtnik);
        setAlamat(data.singlePersonUmum.alamat);
        setDaerahAlamat(data.singlePersonUmum.daerahAlamat);
        setNegeriAlamat(data.singlePersonUmum.negeriAlamat);
        setPoskodAlamat(data.singlePersonUmum.poskodAlamat);
        setIbuMengandung(data.singlePersonUmum.ibuMengandung);
        setOrangKurangUpaya(data.singlePersonUmum.orangKurangUpaya);
        setBersekolah(data.singlePersonUmum.bersekolah);
        setNoOku(data.singlePersonUmum.noOku);
        setStatusPesara(data.singlePersonUmum.statusPesara);
        setRujukDaripada(data.singlePersonUmum.rujukDaripada);
        setCatatan(data.singlePersonUmum.catatan);
        // kepp
        setKepp(data.singlePersonUmum.kepp);
        setKedatanganKepp(data.singlePersonUmum.kedatanganKepp);
        setTarikhRujukanKepp(data.singlePersonUmum.tarikhRujukanKepp);
        setTarikhRundinganPertama(data.singlePersonUmum.tarikhRundinganPertama);
        setTarikhMulaRawatanKepp(data.singlePersonUmum.tarikhMulaRawatanKepp);
        // penyampaian perkhidmatan
        // setKpBergerak(data.singlePersonUmum.kpBergerak);
        // setLabelKpBergerak(data.singlePersonUmum.labelKpBergerak);
        // setPasukanPergigianBergerak(
        //   data.singlePersonUmum.pasukanPergigianBergerak
        // );
        // setMakmalPergigianBergerak(
        //   data.singlePersonUmum.makmalPergigianBergerak
        // );
        // setLabelMakmalPergigianBergerak(
        //   data.singlePersonUmum.labelMakmalPergigianBergerak
        // );
        // taska / tadika
        setFasilitiTaskaTadika(data.singlePersonUmum.fasilitiTaskaTadika);
        setKelasToddler(data.singlePersonUmum.kelasToddler);
        setNamaFasilitiTaskaTadika(
          data.singlePersonUmum.namaFasilitiTaskaTadika
        );
        setEnrolmenTaskaTadika(data.singlePersonUmum.enrolmenTaskaTadika);
        // ipt / kolej
        setIptKolej(data.singlePersonUmum.iptKolej);
        setIpg(data.singlePersonUmum.ipg);
        setKolejKomuniti(data.singlePersonUmum.kolejKomuniti);
        setPoliteknik(data.singlePersonUmum.politeknik);
        setInstitutLatihanKerajaan(
          data.singlePersonUmum.institutLatihanKerajaan
        );
        setGiatmara(data.singlePersonUmum.giatmara);
        setIpta(data.singlePersonUmum.ipta);
        setIpts(data.singlePersonUmum.ipts);
        setEnrolmenIptKolej(data.singlePersonUmum.enrolmenIptKolej);
        // institusi warga emas
        setInstitusiWargaEmas(data.singlePersonUmum.institusiWargaEmas);
        setKerajaanInstitusiWargaEmas(
          data.singlePersonUmum.kerajaanInstitusiWargaEmas
        );
        setSwastaInstitusiWargaEmas(
          data.singlePersonUmum.swastaInstitusiWargaEmas
        );
        // institusi OKU
        setInstitusiOku(data.singlePersonUmum.institusiOku);
        // kampung angkat
        setKgAngkat(data.singlePersonUmum.kgAngkat);
        // events
        setJenisEvent(data.singlePersonUmum.jenisEvent);
        setPilihanEvent(data.singlePersonUmum.namaEvent);
        // datepicker issues
        setTarikhKedatanganDP(new Date(data.singlePersonUmum.tarikhKedatangan));
        setTarikhLahirDP(new Date(data.singlePersonUmum.tarikhLahir));
        if (data.singlePersonUmum.tarikhRujukanKepp !== '') {
          setTarikhRujukanKeppDP(
            new Date(data.singlePersonUmum.tarikhRujukanKepp)
          );
        }
        if (data.singlePersonUmum.tarikhRundinganPertama !== '') {
          setTarikhRundinganPertamaDP(
            new Date(data.singlePersonUmum.tarikhRundinganPertama)
          );
        }
        if (data.singlePersonUmum.tarikhMulaRawatanKepp !== '') {
          setTarikhMulaRawatanKeppDP(
            new Date(data.singlePersonUmum.tarikhMulaRawatanKepp)
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSinglePersonUmum();
  }, [showKemaskini]);

  // fetch taska/tadika if jenis fasiliti taska-tadika only
  useEffect(() => {
    if (jenisFasiliti === 'taska-tadika') {
      const fetchTaskaTadika = async () => {
        try {
          const { data } = await axios.get(`/api/v1/query/umum/taska-tadika`, {
            headers: {
              Authorization: `Bearer ${
                reliefUserToken ? reliefUserToken : userToken
              }`,
            },
          });
          setTaskaTadikaAll(data.taskaTadikaAll);
        } catch (error) {
          console.log(error);
        }
      };
      fetchTaskaTadika();
    }
  }, [jenisFasiliti]);

  // fetch events if jenis fasiliti === projek-komuniti-lain
  useEffect(() => {
    if (jenisFasiliti === 'projek-komuniti-lain') {
      const fetchEvents = async () => {
        try {
          const { data } = await axios.get(`/api/v1/query/events`, {
            headers: {
              Authorization: `Bearer ${
                reliefUserToken ? reliefUserToken : userToken
              }`,
            },
          });
          setEvents(data);
          console.log(data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchEvents();
    }
  }, [jenisFasiliti]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `/api/v1/umum/${personUmumId}`,
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
          // events
          jenisEvent,
          namaEvent,
        },
        {
          headers: {
            Authorization: `Bearer ${
              reliefUserToken ? reliefUserToken : userToken
            }`,
          },
        }
      );
      toast.info(`Pesakit berjaya dikemaskini`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setShowKemaskini(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className='absolute inset-2 lg:inset-16 bg-userWhite z-20 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'>
        <div className='sticky top-0 z-50'>
          <FaWindowClose
            onClick={closeModal}
            className='absolute mr-1 mt-1 text-xl text-userBlack right-0 hover:cursor-pointer hover:text-user6 transition-all'
          />
          <h1 className='bg-user3 text-userWhite font-semibold text-xl'>
            kemaskini
          </h1>
        </div>
        <form onSubmit={handleSubmit} className='p-3'>
          <div className='flex'>
            <p className='font-semibold text-user3 mt-3 ml-3'>
              <span className='text-user9 text-xl'>*</span>mandatori
            </p>
            <p className='font-semibold text-user3 mt-3 mr-3 ml-auto '>
              Fasiliti: {Dictionary[jenisFasiliti]}
            </p>
          </div>
          <div className='grid gap-1'>
            <div className='flex m-2 '>
              <p className='mr-3 font-semibold flex text-center items-center whitespace-nowrap'>
                tarikh kedatangan:{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              <TarikhKedatangan />
              {/* <input
                required
                value={tarikhKedatangan}
                onChange={(e) => setTarikhKedatangan(e.target.value)}
                type='date'
                name='tarikhKedatangan'
                className='appearance-none w-36 leading-7 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md'
              /> */}
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold flex text-center items-center'>
                waktu tiba: <span className='font-semibold text-user6'>*</span>
              </p>
              <input
                required
                value={waktuSampai}
                onChange={(e) => setWaktuSampai(e.target.value)}
                type='time'
                name='waktuSampai'
                className='appearance-none w-auto leading-7 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md'
              />
            </div>
            {/* <div className='flex m-2'>
              <div className='flex items-center flex-row '>
                <p className='font-semibold'>
                  kedatangan <span className='font-semibold text-user6'>*</span>
                </p>
              </div>
              <div className='flex items-center flex-row pl-5'>
                <input
                  required
                  type='radio'
                  name='kedatangan'
                  id='baru-kedatangan'
                  value='baru-kedatangan'
                  checked={kedatangan === 'baru-kedatangan' ? true : false}
                  onChange={(e) => {
                    setKedatangan(e.target.value);
                  }}
                  className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                />
                <label htmlFor='baru-kedatangan' className='m-2 text-sm font-m'>
                  baru
                </label>
              </div>
              <div className='flex items-center flex-row '>
                <input
                  required
                  type='radio'
                  name='kedatangan'
                  id='ulangan-kedatangan'
                  value='ulangan-kedatangan'
                  checked={kedatangan === 'ulangan-kedatangan' ? true : false}
                  onChange={(e) => {
                    setKedatangan(e.target.value);
                  }}
                  className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                />
                <label
                  htmlFor='ulangan-kedatangan'
                  className='m-2 text-sm font-m'
                >
                  ulangan
                </label>
              </div>
            </div> */}
            {/* <div className='flex m-2'>
              <p className='mr-3 text-sm font-semibold flex items-center'>
                no. pendaftaran{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              {kedatangan === 'baru-kedatangan' && (
                // auto generate no pendaftaran
                <input
                  disabled
                  type='number'
                  name='no-pendaftaran-baru'
                  id='no-pendaftaran-baru'
                  value={noPendaftaranBaru}
                  className='outline outline-1 outline-userBlack w-16 text-sm font-m'
                />
              )}
              {kedatangan === 'ulangan-kedatangan' && (
                <input
                  type='number'
                  name='no-pendaftaran-ulangan'
                  id='no-pendaftaran-ulangan'
                  value={noPendaftaranUlangan}
                  onChange={(e) => setNoPendaftaranUlangan(e.target.value)}
                  className='outline outline-1 outline-userBlack w-16 text-sm font-m'
                />
              )}
            </div> */}
            <div className='flex m-2'>
              <p className='mr-3 font-semibold flex flex-row items-center'>
                nama: <span className='font-semibold text-user6'>*</span>
              </p>
              <input
                required
                type='text'
                id='nama-umum'
                name='nama-umum'
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className='appearance-none w-full leading-7 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md uppercase'
              />
            </div>
            <div className='flex m-2 flex-col md:flex-row'>
              <div className='flex flex-row'>
                <p className='mr-3 font-semibold flex text-center items-center'>
                  jenis pengenalan{' '}
                  <span className='font-semibold text-user6'>*</span>
                </p>
                <select
                  required
                  id='pengenalan'
                  name='pengenalan'
                  value={jenisIc}
                  onChange={(e) => setJenisIc(e.target.value)}
                  className='appearance-none leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md m-1 inline-flex'
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
                  onChange={(e) => setIc(e.target.value)}
                  placeholder='123456090987'
                  className='appearance-none leading-7 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md m-1'
                />
              )}
              {jenisIc !== 'mykad-mykid' && jenisIc !== '' && (
                <input
                  required
                  type='text'
                  name='ic'
                  value={ic}
                  onChange={(e) => setIc(e.target.value)}
                  placeholder='123456121234'
                  className='appearance-none leading-7 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md m-1'
                />
              )}
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold flex flex-row items-center whitespace-nowrap'>
                tarikh lahir:{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              <TarikhLahir />
              {/* <input
                required
                value={tarikhLahir}
                onChange={(e) => {
                  setTarikhLahir(e.target.value);
                  setUmur(parseInt(howOldAreYouMyFriendtahun(e.target.value)));
                  setUmurBulan(
                    parseInt(howOldAreYouMyFriendbulan(e.target.value))
                  );
                }}
                type='date'
                name='tarikhLahir'
                className='appearance-none w-36 text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md uppercase'
              /> */}
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
                  className='appearance-none w-20 py-1 px-2 ring-2 ring-user3 outline-r-hidden focus:ring-2 focus:ring-user3 focus:outline-none rounded-l-md peer'
                />
                <label
                  htmlFor='umur'
                  className='absolute left-3 bottom-7 text-xs text-user2 bg-userWhite peer-placeholder-shown:text-user3 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-7 peer-focus:text-xs transition-all'
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
                  className='appearance-none w-20 py-1 px-2 ring-2 ring-user3 focus:ring-2 focus:ring-user3 focus:outline-none rounded-r-md peer'
                />
                <label
                  htmlFor='umurBulan'
                  className='absolute left-3 bottom-7 text-xs text-user2 bg-userWhite peer-placeholder-shown:text-user3 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-7 peer-focus:text-xs transition-all'
                >
                  Bulan
                </label>
              </div>
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                jantina: <span className='font-semibold text-user6'>*</span>
              </p>
              <select
                required
                name='jantina'
                id='jantina'
                value={jantina}
                onChange={(e) => setJantina(e.target.value)}
                className='appearance-none w-36 text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md uppercase m-1'
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
                }}
                className='appearance-none w-full md:w-56 text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md uppercase'
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
                onChange={(e) => setAlamat(e.target.value)}
                type='text'
                name='alamat'
                className='appearance-none w-full leading-7 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md'
              />
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold flex items-center whitespace-nowrap'>
                daerah: <span className='font-semibold text-user6'>*</span>
              </p>
              <input
                required
                value={daerahAlamat}
                onChange={(e) => setDaerahAlamat(e.target.value)}
                type='text'
                name='daerah-alamat'
                className='appearance-none w-36 leading-7 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md'
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
                }}
                className='appearance-none w-36 leading-7 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md'
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
                <option value='kuala lumpur'>Kuala Lumpur</option>
                <option value='labuan'>Labuan</option>
                <option value='putrajaya'>Putrajaya</option>
              </select>
              {/* <input
                required
                value={negeriAlamat}
                onChange={(e) => setNegeriAlamat(e.target.value)}
                type='text'
                name='negeri-alamat'
                className='appearance-none w-2/12 leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
              /> */}
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
                onChange={(e) => setPoskodAlamat(e.target.value)}
                placeholder='62519'
                className='appearance-none w-36 leading-7 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md'
              />
            </div>
            {/* <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                kategori pesakit:{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              <select
                required
                name='kategoriPesakit'
                id='kategoriPesakit'
                value={kategoriPesakit}
                onChange={(e) => setKategoriPesakit(e.target.value)}
              >
                <option value=''>Sila pilih..</option>
                <option value='toddler'>Toddler (0 - 4) tahun</option>
                <option value='prasekolah'>Prasekolah (5 - 6) tahun</option>
                <option value='sekolahrendah'>Sekolah rendah</option>
                <option value='sekolahmenengah'>Sekolah menengah</option>
                <option value='oku'>OKU</option>
                <option value='hamil'>Ibu mengandung</option>
                <option value='dewasa'>Dewasa</option>
                <option value='warga-tua'>Warga tua</option>
              </select>
            </div> */}
            <div className='flex m-2 flex-col md:flex-row'>
              <p className='mr-3 font-semibold flex flex-row'>
                status pesakit:
              </p>
              <div>
                <div className='flex items-center flex-row pl-5'>
                  <input
                    type='checkbox'
                    name='hamil'
                    id='hamil'
                    value='hamil'
                    checked={ibuMengandung}
                    onChange={() => {
                      setIbuMengandung(!ibuMengandung);
                    }}
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                  />
                  <label htmlFor='hamil' className='m-2 text-sm font-m'>
                    Ibu mengandung
                  </label>
                </div>
                <div className='flex items-center flex-row pl-5'>
                  <input
                    type='checkbox'
                    name='bersekolah'
                    id='bersekolah'
                    value='bersekolah'
                    checked={bersekolah}
                    onChange={() => {
                      setBersekolah(!bersekolah);
                    }}
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                  />
                  <label htmlFor='bersekolah' className='m-2 text-sm font-m'>
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
                  no. OKU: <span className='font-semibold text-user6'>*</span>
                </p>
                <input
                  required
                  value={noOku}
                  onChange={(e) => setNoOku(e.target.value)}
                  type='text'
                  name='no-oku'
                  className='appearance-none w-36 leading-7 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md'
                />
              </div>
            )}
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                status pesara:{' '}
                {/* <span className='font-semibold text-user6'>*</span> */}
              </p>
              <select
                // required
                name='statusPesara'
                id='statusPesara'
                value={statusPesara}
                onChange={(e) => setStatusPesara(e.target.value)}
                className='appearance-none w-36 leading-7 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md'
              >
                <option value=''>Sila pilih..</option>
                {/* <option value='bukan-pesara'>Bukan pesara</option> */}
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
                onChange={(e) => setRujukDaripada(e.target.value)}
                className='appearance-none w-36 leading-7 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md'
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
                onChange={(e) => setCatatan(e.target.value)}
                className='appearance-none w-full leading-7 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md'
              />
            </div>
            {jenisFasiliti === 'kp' && (
              <>
                <article className='grid justify-center border border-userBlack pl-3 p-2 rounded-md'>
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
                            <span className='font-semibold text-user6'>*</span>
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
                    <label
                      htmlFor='tarikh-rujukan'
                      className='m-2 text-sm font-m whitespace-nowrap'
                    >
                      tarikh rujukan
                    </label>
                    <TarikhRujukanKepp />
                    {/* <input
                      type='date'
                      name='tarikh-rujukan-kepp'
                      id='tarikh-rujukan-kepp'
                      value={tarikhRujukanKepp}
                      onChange={(e) => {
                        setTarikhRujukanKepp(e.target.value);
                      }}
                      className='outline outline-1 outline-userBlack m-2 text-sm font-m'
                    /> */}
                  </div>
                  <div
                    className={`${
                      kedatanganKepp === 'ulangan-kedatangan-kepp'
                        ? 'visible'
                        : 'hidden'
                    } flex items-center flex-row pl-5`}
                  >
                    <label
                      htmlFor='tarikh-rujukan'
                      className='m-2 text-sm font-m whitespace-nowrap'
                    >
                      tarikh perundingan pertama
                    </label>
                    <TarikhRundinganPertama />
                    {/* <input
                      type='date'
                      name='tarikh-rujukan-kepp'
                      id='tarikh-rujukan-kepp'
                      value={tarikhRundinganPertama}
                      onChange={(e) => {
                        setTarikhRundinganPertama(e.target.value);
                      }}
                      className='outline outline-1 outline-userBlack m-2 text-sm font-m'
                    /> */}
                  </div>
                  <div
                    className={`${
                      kedatanganKepp === 'ulangan-kedatangan-kepp'
                        ? 'visible'
                        : 'hidden'
                    } flex items-center flex-row pl-5`}
                  >
                    <label
                      htmlFor='tarikh-mula-rawatan'
                      className='m-2 text-sm font-m whitespace-nowrap'
                    >
                      tarikh mula rawatan
                    </label>
                    <TarikhMulaRawatanKepp />
                    {/* <input
                      type='date'
                      name='tarikh-mula-rawatan-kepp'
                      id='tarikh-mula-rawatan-kepp'
                      value={tarikhMulaRawatanKepp}
                      onChange={(e) => {
                        setTarikhMulaRawatanKepp(e.target.value);
                      }}
                      className='outline outline-1 outline-userBlack m-2 text-sm font-m'
                    /> */}
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
                        setPasukanPergigianBergerak(!pasukanPergigianBergerak);
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
                        setMakmalPergigianBergerak(!makmalPergigianBergerak);
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
                    <p className='font-semibold'>fasiliti taska / tadika </p>
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
                    {/* <select
                      name='jenis-taska-tadika'
                      id='jenis-taska-tadika'
                      value={jenisTaskaTadika}
                      onChange={(e) => {
                        setJenisTaskaTadika(e.target.value);
                      }}
                      className='outline outline-1 outline-userBlack m-2 text-sm font-m'
                    >
                      <option value=''>Pilih jenis taska / tadika</option>
                      <option value='kemas'>KEMAS </option>
                      <option value='perpaduan'>Perpaduan </option>
                      <option value='lain-lain'>Lain-lain</option>
                      <option value='swasta'>Swasta</option>
                    </select>
                    <br /> */}
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
                    .filter((tt) => tt.jenisFasiliti === fasilitiTaskaTadika)
                    .map((tt) => {
                      return <option value={tt.kodTastad}>{tt.nama}</option>;
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
                {/* <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                  <h4 className='flex flex-row items-center pl-5 font-bold col-span-2'>
                    kedatangan taska / tadika
                  </h4>
                  <div className='grid grid-rows-2'>
                    <div className='flex items-center flex-row pl-5'>
                      <input
                        type='checkbox'
                        name='enggan-taska-tadika'
                        id='enggan-taska-tadika'
                        value='enggan-taska-tadika'
                        checked={engganTaskaTadika}
                        onChange={() => {
                          setEngganTaskaTadika(!engganTaskaTadika);
                        }}
                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                      />
                      <label
                        htmlFor='enggan-taska-tadika'
                        className='m-2 text-sm font-m'
                      >
                        enggan
                      </label>
                    </div>
                    <div className='flex items-center flex-row pl-5'>
                      <input
                        type='checkbox'
                        name='tidak-hadir-taska-tadika'
                        id='tidak-hadir-taska-tadika'
                        value='tidak-hadir-taska-tadika'
                        checked={tidakHadirTaskaTadika}
                        onChange={() => {
                          setTidakHadirTaskaTadika(!tidakHadirTaskaTadika);
                        }}
                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                      />
                      <label
                        htmlFor='tidak-hadir-taska-tadika'
                        className='m-2 text-sm font-m'
                      >
                        tidak hadir
                      </label>
                    </div>
                  </div>
                  <div
                    className={`${
                      engganTaskaTadika || tidakHadirTaskaTadika || 'hidden'
                    } outline outline-1 outline-userBlack grid grid-rows-3 col-start-2`}
                  >
                    <h4 className=' font-bold flex items-center flex-row px-2 text-clip'>
                      pemeriksaan
                    </h4>
                    <div className='flex items-center flex-row px-2'>
                      <input
                        type='radio'
                        name='pemeriksaan-taska-tadika'
                        id='ada-pemeriksaan-taska-tadika'
                        value='ada-pemeriksaan-taska-tadika'
                        checked={
                          pemeriksaanTaskaTadika ===
                          'ada-pemeriksaan-taska-tadika'
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          setPemeriksaanTaskaTadika(e.target.value);
                        }}
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                      />
                      <label
                        htmlFor='ada-pemeriksaan-taska-tadika'
                        className='m-2 text-sm font-m'
                      >
                        ada
                      </label>
                    </div>
                    <div className='flex items-center flex-row px-2'>
                      <input
                        type='radio'
                        name='pemeriksaan-taska-tadika'
                        id='tiada-pemeriksaan-taska-tadika'
                        value='tiada-pemeriksaan-taska-tadika'
                        checked={
                          pemeriksaanTaskaTadika ===
                          'tiada-pemeriksaan-taska-tadika'
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          setPemeriksaanTaskaTadika(e.target.value);
                        }}
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                      />
                      <label
                        htmlFor='tiada-pemeriksaan-taska-tadika'
                        className='m-2 text-sm font-m'
                      >
                        tiada
                      </label>
                    </div>
                  </div>
                </article> */}
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
                          iptKolej === 'ipg-institusi-pengajian-tinggi-kolej'
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
                          iptKolej === 'ipta-institusi-pengajian-tinggi-kolej'
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
                          iptKolej === 'ipts-institusi-pengajian-tinggi-kolej'
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
                        institusiWargaEmas === 'kerajaan-institusi-warga-emas'
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
                        institusiOku === 'non-pdk-institusi-oku' ? true : false
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
                      checked={kgAngkat === 'komuniti-kg-angkat' ? true : false}
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
                        kgAngkat === 'lawatan-ke-rumah-kg-angkat' ? true : false
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
            type='submit'
            className='m-2 p-2 capitalize bg-user3 hover:bg-user1 hover:text-userWhite transition-all'
          >
            kemaskini
          </button>
        </form>
      </div>
      <div
        onClick={closeModal}
        className='absolute inset-0 bg-user1 z-10 opacity-75'
      />
    </>
  );
}

export default Kemaskini;
