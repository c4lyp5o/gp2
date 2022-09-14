import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaWindowClose } from 'react-icons/fa';

import { useGlobalUserAppContext } from '../../context/userAppContext';

function Kemaskini({ showKemaskini, setShowKemaskini, toast }) {
  const { userToken, useParams, Dictionary } = useGlobalUserAppContext();

  const { personUmumId } = useParams();

  // core
  const [jenisFasiliti, setJenisFasiliti] = useState('');
  const [tarikhKedatangan, setTarikhKedatangan] = useState('');
  const [waktuSampai, setWaktuSampai] = useState('');
  const [kedatangan, setKedatangan] = useState('');
  const [nama, setNama] = useState('');
  const [jenisIc, setJenisIc] = useState('');
  const [ic, setIc] = useState('');
  const [tarikhLahir, setTarikhLahir] = useState('');
  const [umur, setUmur] = useState('');
  const [umurBulan, setUmurBulan] = useState('');
  const [jantina, setJantina] = useState('');
  const [alamat, setAlamat] = useState('');
  const [daerahAlamat, setDaerahAlamat] = useState('');
  const [negeriAlamat, setNegeriAlamat] = useState('');
  const [poskodAlamat, setPoskodAlamat] = useState('');
  const [kategoriPesakit, setKategoriPesakit] = useState('');
  const [noOku, setNoOku] = useState('');
  const [statusPesara, setStatusPesara] = useState('');
  const [kumpulanEtnik, setKumpulanEtnik] = useState('');
  const [rujukDaripada, setRujukDaripada] = useState('');

  // kepp
  const [kepp, setKepp] = useState(false);
  const [kedatanganKepp, setKedatanganKepp] = useState('');
  const [tarikhRujukanKepp, setTarikhRujukanKepp] = useState('');
  const [tarikhRundinganPertama, setTarikhRundinganPertama] = useState('');
  const [tarikhMulaRawatanKepp, setTarikhMulaRawatanKepp] = useState('');

  // penyampaian perkhidmatan
  const [kpBergerak, setKpBergerak] = useState(false);
  const [labelKpBergerak, setLabelKpBergerak] = useState('');
  const [pasukanPergigianBergerak, setPasukanPergigianBergerak] =
    useState(false);
  const [makmalPergigianBergerak, setMakmalPergigianBergerak] = useState(false);
  const [labelMakmalPergigianBergerak, setLabelMakmalPergigianBergerak] =
    useState('');

  // taska / tadika
  const [fasilitiTaskaTadika, setFasilitiTaskaTadika] = useState('');
  const [jenisTaskaTadika, setJenisTaskaTadika] = useState('');
  const [kelasToddler, setKelasToddler] = useState(false);
  const [namaFasilitiTaskaTadika, setNamaFasilitiTaskaTadika] = useState('');
  const [enrolmenTaskaTadika, setEnrolmenTaskaTadika] = useState(false);
  const [engganTaskaTadika, setEngganTaskaTadika] = useState(false);
  const [tidakHadirTaskaTadika, setTidakHadirTaskaTadika] = useState(false);
  const [pemeriksaanTaskaTadika, setPemeriksaanTaskaTadika] = useState('');

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

  const howOldAreYouMyFriend = (date) => {
    const today = new Date();
    const dob = new Date(date);
    const diff = today.getTime() - dob.getTime();
    const years = Math.floor(diff / 31556736000);
    const days_diff = Math.floor((diff % 31556736000) / 86400000);
    const months = Math.floor(days_diff / 30.4167);
    const days = Math.floor(days_diff % 30.4167);
    return { tahun: years, bulan: months };
  };

  const closeModal = () => {
    setShowKemaskini(false);
  };

  useEffect(() => {
    const fetchSinglePersonUmum = async () => {
      try {
        const { data } = await axios.get(`/api/v1/umum/${personUmumId}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        //kaunter
        setJenisFasiliti(data.singlePersonUmum.jenisFasiliti);
        setTarikhKedatangan(data.singlePersonUmum.tarikhKedatangan);
        setWaktuSampai(data.singlePersonUmum.waktuSampai);
        setKedatangan(data.singlePersonUmum.kedatangan);
        setNama(data.singlePersonUmum.nama);
        setJenisIc(data.singlePersonUmum.jenisIc);
        setIc(data.singlePersonUmum.ic);
        setTarikhLahir(data.singlePersonUmum.tarikhLahir);
        setUmur(data.singlePersonUmum.umur);
        setUmurBulan(data.singlePersonUmum.umurBulan);
        setJantina(data.singlePersonUmum.jantina);
        setAlamat(data.singlePersonUmum.alamat);
        setDaerahAlamat(data.singlePersonUmum.daerahAlamat);
        setNegeriAlamat(data.singlePersonUmum.negeriAlamat);
        setPoskodAlamat(data.singlePersonUmum.poskodAlamat);
        setKategoriPesakit(data.singlePersonUmum.kategoriPesakit);
        setNoOku(data.singlePersonUmum.noOku);
        setStatusPesara(data.singlePersonUmum.statusPesara);
        setKumpulanEtnik(data.singlePersonUmum.kumpulanEtnik);
        setRujukDaripada(data.singlePersonUmum.rujukDaripada);
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
        setKpBergerak(data.singlePersonKaunter.kpBergerak);
        setLabelKpBergerak(data.singlePersonKaunter.labelKpBergerak);
        setPasukanPergigianBergerak(
          data.singlePersonKaunter.pasukanPergigianBergerak
        );
        setMakmalPergigianBergerak(
          data.singlePersonKaunter.makmalPergigianBergerak
        );
        setLabelMakmalPergigianBergerak(
          data.singlePersonKaunter.labelMakmalPergigianBergerak
        );
        // taska / tadika
        setFasilitiTaskaTadika(data.singlePersonKaunter.fasilitiTaskaTadika);
        setJenisTaskaTadika(data.singlePersonKaunter.jenisTaskaTadika);
        setKelasToddler(data.singlePersonKaunter.kelasToddler);
        setNamaFasilitiTaskaTadika(
          data.singlePersonKaunter.namaFasilitiTaskaTadika
        );
        setEnrolmenTaskaTadika(data.singlePersonKaunter.enrolmenTaskaTadika);
        setEngganTaskaTadika(data.singlePersonKaunter.engganTaskaTadika);
        setTidakHadirTaskaTadika(
          data.singlePersonKaunter.tidakHadirTaskaTadika
        );
        setPemeriksaanTaskaTadika(
          data.singlePersonKaunter.pemeriksaanTaskaTadika
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
      } catch (error) {
        console.log(error);
      }
    };
    fetchSinglePersonUmum();
  }, [showKemaskini]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `/api/v1/umum/${personUmumId}`,
        {
          tarikhKedatangan,
          waktuSampai,
          kedatangan,
          nama,
          jenisIc,
          ic,
          tarikhLahir,
          umur,
          umurBulan,
          jantina,
          alamat,
          daerahAlamat,
          negeriAlamat,
          poskodAlamat,
          kategoriPesakit,
          noOku,
          statusPesara,
          kumpulanEtnik,
          rujukDaripada,
          // kepp
          kepp,
          kedatanganKepp,
          tarikhRujukanKepp,
          tarikhRundinganPertama,
          tarikhMulaRawatanKepp,
          // penyampaian perkhidmatan
          kpBergerak,
          labelKpBergerak,
          pasukanPergigianBergerak,
          makmalPergigianBergerak,
          labelMakmalPergigianBergerak,
          // taska / tadika
          fasilitiTaskaTadika,
          jenisTaskaTadika,
          kelasToddler,
          namaFasilitiTaskaTadika,
          enrolmenTaskaTadika,
          engganTaskaTadika,
          tidakHadirTaskaTadika,
          pemeriksaanTaskaTadika,
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
        { headers: { Authorization: `Bearer ${userToken}` } }
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
      <div className='absolute inset-16 bg-userWhite z-20 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'>
        <div className='sticky top-0'>
          <FaWindowClose
            onClick={closeModal}
            className='absolute mr-1 mt-1 text-xl text-userBlack right-0 hover:cursor-pointer hover:text-user6 transition-all'
          />
          <h1 className='bg-user3 font-semibold text-xl'>kemaskini</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <p className='font-semibold text-user6 text-left mt-3 ml-3'>
              * required
            </p>
            <p className='font-semibold text-user6 mt-3 mr-3 ml-auto'>
              Fasiliti: {Dictionary[jenisFasiliti]}
            </p>
          </div>
          <div className='grid'>
            <div className='flex m-2 ml-auto'>
              <p className='mr-3 font-semibold'>
                tarikh kedatangan:{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              <input
                required
                value={tarikhKedatangan}
                onChange={(e) => setTarikhKedatangan(e.target.value)}
                type='date'
                name='tarikhKedatangan'
                className='outline outline-1 outline-userBlack'
              />
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                waktu sampai:{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              <input
                required
                value={waktuSampai}
                onChange={(e) => setWaktuSampai(e.target.value)}
                type='time'
                name='waktuSampai'
                className='outline outline-1 outline-userBlack'
              />
            </div>
            <div className='flex m-2'>
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
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                nama: <span className='font-semibold text-user6'>*</span>
              </p>
              <input
                required
                value={nama.toLowerCase()}
                onChange={(e) => setNama(e.target.value)}
                type='text'
                name='namaUmum'
                className='capitalize appearance-none w-7/12 leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
              />
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                jenis pengenalan{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              <select
                required
                name='pengenalan'
                id='pengenalan'
                value={jenisIc}
                onChange={(e) => setJenisIc(e.target.value)}
                className='mr-3'
              >
                <option value=''>Sila pilih..</option>
                <option value='mykad-mykid'>MyKad / MyKid</option>
                <option value='passport'>Passport</option>
                <option value='tentera'>Tentera</option>
                <option value='polis'>Polis</option>
                <option value='sijil-lahir'>Sijil lahir</option>
              </select>
              <input
                required
                value={ic}
                onChange={(e) => setIc(e.target.value)}
                type='text'
                name='ic'
                placeholder='123456090987'
                className='appearance-none leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
              />
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                tarikh lahir:{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              <input
                required
                value={tarikhLahir}
                onChange={(e) => {
                  setTarikhLahir(e.target.value);
                  setUmur(howOldAreYouMyFriend(e.target.value));
                }}
                type='date'
                name='tarikhLahir'
              />
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                umur: <span className='font-semibold text-user6'>*</span>
              </p>
              <input
                disabled
                type='number'
                name='umur'
                value={umur}
                className='outline outline-1 outline-userBlack w-16 text-sm font-m'
              />
              <p className='mx-3'>tahun</p>
              <input
                disabled
                type='number'
                name='umur'
                value={umurBulan}
                className='outline outline-1 outline-userBlack w-16 text-sm font-m'
              />
              <p className='mx-3'>bulan</p>
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                jantina: <span className='font-semibold text-user6'>*</span>
              </p>
              <select
                required
                value={jantina}
                name='jantina'
                id='jantina'
                onChange={(e) => setJantina(e.target.value)}
              >
                <option value=''>Sila pilih..</option>
                <option value='lelaki'>Lelaki</option>
                <option value='perempuan'>Perempuan</option>
              </select>
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                alamat: <span className='font-semibold text-user6'>*</span>
              </p>
              <input
                required
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                type='text'
                name='alamat'
                className='appearance-none w-10/12 leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
              />
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                daerah: <span className='font-semibold text-user6'>*</span>
              </p>
              <input
                required
                value={daerahAlamat}
                onChange={(e) => setDaerahAlamat(e.target.value)}
                type='text'
                name='daerah-alamat'
                className='appearance-none w-3/12 leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
              />
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                negeri: <span className='font-semibold text-user6'>*</span>
              </p>
              <input
                required
                value={negeriAlamat}
                onChange={(e) => setNegeriAlamat(e.target.value)}
                type='text'
                name='negeri-alamat'
                className='appearance-none w-2/12 leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
              />
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
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
                className='appearance-none w-1/12 leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
              />
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                kategori pesakit:{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              <select
                required
                value={kategoriPesakit}
                name='kategoriPesakit'
                id='kategoriPesakit'
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
            </div>
            {kategoriPesakit === 'oku' && (
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
                  className='appearance-none w-2/12 leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
                />
              </div>
            )}
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                status pesara:{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              <select
                required
                name='statusPesara'
                id='statusPesara'
                value={statusPesara}
                onChange={(e) => setStatusPesara(e.target.value)}
              >
                <option value=''>Sila pilih..</option>
                <option value='bukan-pesara'>Bukan pesara</option>
                <option value='pesara-kerajaan'>Pesara kerajaan</option>
                <option value='pesara-atm'>Pesara ATM</option>
              </select>
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                kumpulan etnik:{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              <select
                required
                value={kumpulanEtnik}
                name='kumpulanEtnik'
                id='kumpulanEtnik'
                onChange={(e) => {
                  setKumpulanEtnik(e.target.value);
                }}
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
              <p className='mr-3 font-semibold'>rujuk daripada: </p>
              <select
                name='rujukDaripada'
                id='rujukDaripada'
                value={rujukDaripada}
                onChange={(e) => setRujukDaripada(e.target.value)}
                className='mr-3'
              >
                <option value=''>Sila pilih..</option>
                <option value='dalaman'>Dalaman</option>
                <option value='kp'>Klinik Pergigian Kerajaan</option>
                <option value='kk'>Klinik Kesihatan Kerajaan</option>
                <option value='hospital'>Hospital / Institusi Kerajaan</option>
                <option value='swasta'>Swasta</option>
                <option value='lain-lain'>Lain-lain</option>
              </select>
            </div>
            {jenisFasiliti === 'kp' && (
              <>
                <article className='grid justify-center border border-userBlack pl-3 p-2 rounded-md mx-2'>
                  <div className='flex'>
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
                      className='m-2 text-sm font-m'
                    >
                      tarikh rujukan
                    </label>
                    <input
                      type='date'
                      name='tarikh-rujukan-kepp'
                      id='tarikh-rujukan-kepp'
                      value={tarikhRujukanKepp}
                      onChange={(e) => {
                        setTarikhRujukanKepp(e.target.value);
                      }}
                      className='outline outline-1 outline-userBlack m-2 text-sm font-m'
                    />
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
                      className='m-2 text-sm font-m'
                    >
                      tarikh perundingan pertama
                    </label>
                    <input
                      type='date'
                      name='tarikh-rujukan-kepp'
                      id='tarikh-rujukan-kepp'
                      value={tarikhRundinganPertama}
                      onChange={(e) => {
                        setTarikhRundinganPertama(e.target.value);
                      }}
                      className='outline outline-1 outline-userBlack m-2 text-sm font-m'
                    />
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
                      className='m-2 text-sm font-m'
                    >
                      tarikh mula rawatan
                    </label>
                    <input
                      type='date'
                      name='tarikh-mula-rawatan-kepp'
                      id='tarikh-mula-rawatan-kepp'
                      value={tarikhMulaRawatanKepp}
                      onChange={(e) => {
                        setTarikhMulaRawatanKepp(e.target.value);
                      }}
                      className='outline outline-1 outline-userBlack m-2 text-sm font-m'
                    />
                  </div>
                </article>
                <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md mx-2'>
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
                    >
                      <option value=''>Label</option>
                      <option value='apa??'>Apa?</option>
                    </select>
                  </div>
                </article>
              </>
            )}
            {jenisFasiliti === 'taska-tadika' && (
              <div className='row-span-4 border border-userBlack pl-3 p-2 rounded-md mx-2'>
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
                    >
                      <option value=''>Pilih</option>
                      <option value='taska'>Taska</option>
                      <option value='tadika'>Tadika</option>
                    </select>
                  </div>
                  {/* buang className ni nnti */}
                  <div className='overflow-x-auto'>
                    <select
                      name='jenis-taska-tadika'
                      id='jenis-taska-tadika'
                      value={jenisTaskaTadika}
                      onChange={(e) => {
                        setJenisTaskaTadika(e.target.value);
                      }}
                    >
                      <option value=''>Pilih jenis taska / tadika</option>
                      <option value='taska'>KEMAS </option>
                      <option value='tadika'>Perpaduan </option>
                      <option value='taska'>Lain-lain</option>
                      <option value='tadika'>Swasta</option>
                    </select>
                    <br />
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
                  className='w-11/12'
                >
                  <option value=''>Pilih</option>
                  <option value='taska perak'>Taska Perak</option>
                  <option value='tadika emas'>Tadika Emas</option>
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
                <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
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
                  <div className=' outline outline-1 outline-userBlack grid grid-rows-3 col-start-2'>
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
                </article>
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
      <div className='absolute inset-0 bg-user1 z-10 opacity-75'></div>
    </>
  );
}

export default Kemaskini;
