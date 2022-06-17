import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { useGlobalUserAppContext } from '../context/userAppContext';

import Pendaftaran from './form-sekolah/Pendaftaran';
import PemeriksaanAwal from './form-sekolah/PemeriksaanAwal';
import PerluDibuat from './form-sekolah/PerluDibuat';

function UserFormSekolah() {
  const { userToken, username, useParams } = useGlobalUserAppContext();

  const { personSekolahId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [singlePersonSekolah, setSinglePersonSekolah] = useState([]);

  const masterForm = {};
  masterForm.createdByUsername = username;
  //pendaftaran
  masterForm.kpBergerak = useRef(null);
  masterForm.pasukanPergigianBergerak = useRef(null);
  masterForm.plateNo = useRef(null);
  const [
    baruUlanganKedatanganPendaftaran,
    setBaruUlanganKedatanganPendaftaran,
  ] = useState('');
  masterForm.setBaruUlanganKedatanganPendaftaran =
    setBaruUlanganKedatanganPendaftaran;
  masterForm.engganKedatanganPendaftaran = useRef(null);
  masterForm.tidakHadirKedatanganPendaftaran = useRef(null);
  const [adaTiadaPemeriksaanPendaftaran, setAdaTiadaPemeriksaanPendaftaran] =
    useState('');
  masterForm.setAdaTiadaPemeriksaanPendaftaran =
    setAdaTiadaPemeriksaanPendaftaran;
  const [
    tinggiRendahRisikoSekolahPendaftaran,
    setTinggiRendahRisikoSekolahPendaftaran,
  ] = useState('');
  masterForm.setTinggiRendahRisikoSekolahPendaftaran =
    setTinggiRendahRisikoSekolahPendaftaran;
  // //pemeriksaan awal div 1
  // masterForm.adaCleftLip = useRef(null);
  // masterForm.rujukCleftLip = useRef(null);
  // masterForm.adaDenture = useRef(null);
  // masterForm.tidakAdaDenture = useRef(null);
  // masterForm.atasSediaAdaDenture = useRef(null);
  // masterForm.separaAtasSediaAdaDenture = useRef(null);
  // masterForm.penuhAtasSediaAdaDenture = useRef(null);
  // masterForm.bawahSediaAdaDenture = useRef(null);
  // masterForm.separaBawahSediaAdaDenture = useRef(null);
  // masterForm.penuhBawahSediaAdaDenture = useRef(null);
  // masterForm.perluDenture = useRef(null);
  // masterForm.tidakPerluDenture = useRef(null);
  // masterForm.atasPerluDenture = useRef(null);
  // masterForm.separaAtasPerluDenture = useRef(null);
  // masterForm.penuhAtasPerluDenture = useRef(null);
  // masterForm.bawahPerluDenture = useRef(null);
  // masterForm.separaBawahPerluDenture = useRef(null);
  // masterForm.penuhBawahPerluDenture = useRef(null);
  // masterForm.toothSurfaceLossTrauma = useRef(null);
  // masterForm.kecederaanGigiAnteriorTrauma = useRef(null);
  // masterForm.tisuLembutTrauma = useRef(null);
  // masterForm.tisuKerasTrauma = useRef(null);
  // //pemeriksaan awal div 2
  // masterForm.kebersihanMulutOralHygiene = useRef(null);
  // masterForm.skorBpeOralHygiene = useRef(null);
  // masterForm.saringanKanserMulutOralHygiene = useRef(null);
  // masterForm.skorGisMulutOralHygiene = useRef(null);
  // masterForm.dAdaGigiDesidus = useRef(null);
  // masterForm.mAdaGigiDesidus = useRef(null);
  // masterForm.fAdaGigiDesidus = useRef(null);
  // masterForm.eAdaGigiDesidus = useRef(null);
  // masterForm.xAdaGigiDesidus = useRef(null);
  // masterForm.dAdaGigiKekal = useRef(null);
  // masterForm.mAdaGigiKekal = useRef(null);
  // masterForm.fAdaGigiKekal = useRef(null);
  // masterForm.eAdaGigiKekal = useRef(null);
  // masterForm.xAdaGigiKekal = useRef(null);
  // masterForm.jumlahFaktorRisiko = useRef(null);
  // //pemeriksaan awal div 3
  // masterForm.gicBilanganFsDibuat3TahunLepas = useRef(null);
  // masterForm.resinBilanganFsDibuat3TahunLepas = useRef(null);
  // masterForm.lainLainBilanganFsDibuat3TahunLepas = useRef(null);
  // masterForm.dBilanganFsDibuat3TahunLepasTerjadi = useRef(null);
  // masterForm.mBilanganFsDibuat3TahunLepasTerjadi = useRef(null);
  // masterForm.fBilanganFsDibuat3TahunLepasTerjadi = useRef(null);
  // masterForm.eBilanganFsDibuat3TahunLepasTerjadi = useRef(null);
  // masterForm.xBilanganFsDibuat3TahunLepasTerjadi = useRef(null);
  // masterForm.classID = useRef(null);
  // masterForm.classIID = useRef(null);
  // masterForm.classIF = useRef(null);
  // masterForm.classIIF = useRef(null);

  useEffect(() => {
    const fetchSinglePersonSekolah = async () => {
      try {
        const { data } = await axios.get(`/api/v1/sekolah/${personSekolahId}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setSinglePersonSekolah(data.singlePersonSekolah);
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
          kpBergerak: masterForm.kpBergerak.current.checked,
          pasukanPergigianBergerak:
            masterForm.pasukanPergigianBergerak.current.checked,
          plateNo: masterForm.plateNo.current.value,
          baruUlanganKedatanganPendaftaran,
          engganKedatanganPendaftaran:
            masterForm.engganKedatanganPendaftaran.current.checked,
          tidakHadirKedatanganPendaftaran:
            masterForm.tidakHadirKedatanganPendaftaran.current.checked,
          adaTiadaPemeriksaanPendaftaran,
          tinggiRendahRisikoSekolahPendaftaran,
        },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      console.log('Update success');
    } catch (error) {
      console.log(error.response.data.msg);
    }
    // //pemeriksaan awal div 1
    // console.log(masterForm.adaCleftLip.current.checked);
    // console.log(masterForm.rujukCleftLip.current.checked);
    // console.log(masterForm.adaDenture.current.value);
    // console.log(masterForm.tidakAdaDenture.current.value);
    // console.log(masterForm.atasSediaAdaDenture.current.checked);
    // console.log(masterForm.separaAtasSediaAdaDenture.current.value);
    // console.log(masterForm.penuhAtasSediaAdaDenture.current.value);
    // console.log(masterForm.bawahSediaAdaDenture.current.checked);
    // console.log(masterForm.separaBawahSediaAdaDenture.current.value);
    // console.log(masterForm.penuhBawahSediaAdaDenture.current.value);
    // console.log(masterForm.perluDenture.current.value);
    // console.log(masterForm.tidakPerluDenture.current.value);
    // console.log(masterForm.atasPerluDenture.current.checked);
    // console.log(masterForm.separaAtasPerluDenture.current.value);
    // console.log(masterForm.penuhAtasPerluDenture.current.value);
    // console.log(masterForm.bawahPerluDenture.current.checked);
    // console.log(masterForm.separaBawahPerluDenture.current.value);
    // console.log(masterForm.penuhBawahPerluDenture.current.value);
    // console.log(masterForm.toothSurfaceLossTrauma.current.checked);
    // console.log(masterForm.kecederaanGigiAnteriorTrauma.current.checked);
    // console.log(masterForm.tisuLembutTrauma.current.checked);
    // console.log(masterForm.tisuKerasTrauma.current.checked);
    // //pemeriksaan awal div 2
    // console.log(masterForm.kebersihanMulutOralHygiene.current.value);
    // console.log(masterForm.skorBpeOralHygiene.current.value);
    // console.log(masterForm.saringanKanserMulutOralHygiene.current.checked);
    // console.log(masterForm.skorGisMulutOralHygiene.current.value);
    // console.log(masterForm.dAdaGigiDesidus.current.value);
    // console.log(masterForm.mAdaGigiDesidus.current.value);
    // console.log(masterForm.fAdaGigiDesidus.current.value);
    // console.log(masterForm.eAdaGigiDesidus.current.value);
    // console.log(masterForm.xAdaGigiDesidus.current.value);
    // console.log(masterForm.dAdaGigiKekal.current.value);
    // console.log(masterForm.mAdaGigiKekal.current.value);
    // console.log(masterForm.fAdaGigiKekal.current.value);
    // console.log(masterForm.eAdaGigiKekal.current.value);
    // console.log(masterForm.xAdaGigiKekal.current.value);
    // console.log(masterForm.jumlahFaktorRisiko.current.value);
    // //pemeriksaan awal div 3
    // console.log(masterForm.gicBilanganFsDibuat3TahunLepas.current.value);
    // console.log(masterForm.resinBilanganFsDibuat3TahunLepas.current.value);
    // console.log(masterForm.lainLainBilanganFsDibuat3TahunLepas.current.value);
    // console.log(masterForm.dBilanganFsDibuat3TahunLepasTerjadi.current.value);
    // console.log(masterForm.mBilanganFsDibuat3TahunLepasTerjadi.current.value);
    // console.log(masterForm.fBilanganFsDibuat3TahunLepasTerjadi.current.value);
    // console.log(masterForm.eBilanganFsDibuat3TahunLepasTerjadi.current.value);
    // console.log(masterForm.xBilanganFsDibuat3TahunLepasTerjadi.current.value);
    // console.log(masterForm.classID.current.value);
    // console.log(masterForm.classIID.current.value);
    // console.log(masterForm.classIF.current.value);
    // console.log(masterForm.classIIF.current.value);
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
          {/* <PemeriksaanAwal {...masterForm} /> */}
          {/* <PerluDibuat /> */}
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
