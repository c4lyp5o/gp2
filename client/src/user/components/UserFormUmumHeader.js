import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaInfoCircle } from 'react-icons/fa';

import { useGlobalUserAppContext } from '../context/userAppContext';

import Kemaskini from './form-umum/Kemaskini';
import FasilitiPerkhidmatan from './form-umum/FasilitiPerkhidmatan';
import MaklumatLanjut from './form-umum/MaklumatLanjut';
// import Pemeriksaan from './form-umum/Pemeriksaan';
import Rawatan from './form-umum/Rawatan';
import Promosi from './form-umum/Promosi';
import Kotak from './form-umum/Kotak';

function UserFormUmumHeader() {
  const { userToken, username, navigate, catchAxiosErrorAndLogout, useParams } =
    useGlobalUserAppContext();

  const { personUmumId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    const fetchSinglePersonUmum = async () => {
      try {
        const { data } = await axios.get(`/api/v1/umum/${personUmumId}`, {
          headers: { Authorization: `Bearer ${userToken}` },
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
      } catch (error) {
        console.log(error);
      }
    };
    fetchSinglePersonUmum();
  }, [showKemaskini]);

  const kemaskini = () => {
    setShowKemasKini(true);
  };

  const handleSubmit = () => {
    // fasiliti perkhidmatan
    // jenisFasiliti, kepp, jenisProgramKomuniti;
  };

  const handleNext = () => {
    // do something..
  };

  return (
    <>
      <div className='h-full p-3 px-10 overflow-y-auto'>
        <div className='p-2'>
          <article className='outline outline-1 outline-userBlack grid grid-cols-1 md:grid-cols-2'>
            <div>
              <div className='text-l font-bold flex flex-row pl-5 p-2'>
                <h1>MAKLUMAT AM PESAKIT</h1>
                <FaInfoCircle
                  className='m-1 text-lg'
                  onMouseEnter={() => setIsShown(true)}
                  onMouseLeave={() => setIsShown(false)}
                />
              </div>
              {isShown && (
                <div className='z-100 absolute float-right box-border outline outline-1 outline-userBlack left-72 p-5 bg-userWhite '>
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
                    <h2 className='font-semibold'>KUMPULAN ETNIK :</h2>
                    <p className='ml-1'>{singlePersonUmum.kumpulanEtnik}</p>
                  </div>
                  <div className='text-sm flex flex-row '>
                    <h2 className='font-semibold'>KATEGORI PESAKIT :</h2>
                    <p className='ml-1'>{singlePersonUmum.kategoriPesakit}</p>
                  </div>
                </div>
              )}
              <div className='text-s flex flex-row pl-5'>
                <h2 className='font-semibold'>NAMA :</h2>
                <p className='ml-1'>{singlePersonUmum.nama}</p>
              </div>
              <div className='text-s flex flex-row pl-5'>
                <h2 className='font-semibold'>UMUR :</h2>
                <p className='ml-1'>{singlePersonUmum.umur} tahun</p>
              </div>
            </div>
            <div className='md:pt-10'>
              <div className='text-s flex flex-row pl-5'>
                <h2 className='font-semibold'>JANTINA :</h2>
                <p className='ml-1'>{singlePersonUmum.jantina}</p>
              </div>
              <div className='text-s flex flex-row pl-5'>
                <h2 className='font-semibold'>IC/Passport :</h2>
                <p className='ml-1'>{singlePersonUmum.ic}</p>
              </div>
              <button
                onClick={kemaskini}
                className='float-right m-2 px-5 py-2 capitalize bg-user3 hover:bg-user1 hover:text-userWhite transition-all'
              >
                kemaskini
              </button>
            </div>
          </article>
        </div>
        <form onSubmit={handleSubmit}>
          <FasilitiPerkhidmatan {...masterForm} />
          <MaklumatLanjut {...masterForm} />
          {/* <Pemeriksaan {...masterForm} /> */}
          <Rawatan {...masterForm} />
          <Promosi {...masterForm} />
          <Kotak {...masterForm} />
          <div className='grid grid-cols-1 lg:grid-cols-2 col-start-1 md:col-start-2 gap-2 col-span-2 md:col-span-1'>
            <div className='grid grid-cols-3 gap-3 lg:col-start-2'>
              <button className='flex bg-user3 p-2 w-full capitalize justify-center hover:bg-user1 hover:text-userWhite transition-all'>
                kosongkan
              </button>
              <button className='flex bg-user3 p-2 w-full capitalize justify-center hover:bg-user1 hover:text-userWhite transition-all'>
                teruskan
              </button>
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
      {showKemaskini && (
        <Kemaskini
          showKemaskini={showKemaskini}
          setShowKemaskini={setShowKemasKini}
        />
      )}
    </>
  );
}

export default UserFormUmumHeader;
