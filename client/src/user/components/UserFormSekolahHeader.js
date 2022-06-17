import { useRef } from 'react';
import axios from 'axios';
import Pendaftaran from './form-sekolah/Pendaftaran';
import PemeriksaanAwal from './form-sekolah/PemeriksaanAwal';
import PerluDibuat from './form-sekolah/PerluDibuat';

function UserFormSekolah() {
  const masterForm = {};
  //pendaftaran
  masterForm.kpBergerak = useRef(null);
  masterForm.pasukanPergigianBergerak = useRef(null);
  masterForm.plateNo = useRef(null);
  masterForm.baruKedatanganPendaftaran = useRef(null);
  masterForm.ulanganKedatanganPendaftaran = useRef(null);
  masterForm.engganKedatanganPendaftaran = useRef(null);
  masterForm.tidakHadirKedatanganPendaftaran = useRef(null);
  masterForm.adaPemeriksaanPendaftaran = useRef(null);
  masterForm.tiadaPemeriksaanPendaftaran = useRef(null);
  masterForm.tinggiRisikoSekolahPendaftaran = useRef(null);
  masterForm.rendahRisikoSekolahPendaftaran = useRef(null);
  //pemeriksaan awal div 1
  masterForm.adaCleftLip = useRef(null);
  masterForm.rujukCleftLip = useRef(null);
  masterForm.adaDenture = useRef(null);
  masterForm.tidakAdaDenture = useRef(null);
  masterForm.atasSediaAdaDenture = useRef(null);
  masterForm.separaAtasSediaAdaDenture = useRef(null);
  masterForm.penuhAtasSediaAdaDenture = useRef(null);
  masterForm.bawahSediaAdaDenture = useRef(null);
  masterForm.separaBawahSediaAdaDenture = useRef(null);
  masterForm.penuhBawahSediaAdaDenture = useRef(null);
  masterForm.perluDenture = useRef(null);
  masterForm.tidakPerluDenture = useRef(null);
  masterForm.atasPerluDenture = useRef(null);
  masterForm.separaAtasPerluDenture = useRef(null);
  masterForm.penuhAtasPerluDenture = useRef(null);
  masterForm.bawahPerluDenture = useRef(null);
  masterForm.separaBawahPerluDenture = useRef(null);
  masterForm.penuhBawahPerluDenture = useRef(null);
  masterForm.toothSurfaceLossTrauma = useRef(null);
  masterForm.kecederaanGigiAnteriorTrauma = useRef(null);
  masterForm.tisuLembutTrauma = useRef(null);
  masterForm.tisuKerasTrauma = useRef(null);
  //pemeriksaan awal div 2
  masterForm.kebersihanMulutOralHygiene = useRef(null);
  masterForm.skorBpeOralHygiene = useRef(null);
  masterForm.saringanKanserMulutOralHygiene = useRef(null);
  masterForm.skorGisMulutOralHygiene = useRef(null);
  masterForm.dAdaGigiDesidus = useRef(null);
  masterForm.mAdaGigiDesidus = useRef(null);
  masterForm.fAdaGigiDesidus = useRef(null);
  masterForm.eAdaGigiDesidus = useRef(null);
  masterForm.xAdaGigiDesidus = useRef(null);
  masterForm.dAdaGigiKekal = useRef(null);
  masterForm.mAdaGigiKekal = useRef(null);
  masterForm.fAdaGigiKekal = useRef(null);
  masterForm.eAdaGigiKekal = useRef(null);
  masterForm.xAdaGigiKekal = useRef(null);
  masterForm.jumlahFaktorRisiko = useRef(null);
  //pemeriksaan awal div 3
  masterForm.gicBilanganFsDibuat3TahunLepas = useRef(null);
  masterForm.resinBilanganFsDibuat3TahunLepas = useRef(null);
  masterForm.lainLainBilanganFsDibuat3TahunLepas = useRef(null);
  masterForm.dBilanganFsDibuat3TahunLepasTerjadi = useRef(null);
  masterForm.mBilanganFsDibuat3TahunLepasTerjadi = useRef(null);
  masterForm.fBilanganFsDibuat3TahunLepasTerjadi = useRef(null);
  masterForm.eBilanganFsDibuat3TahunLepasTerjadi = useRef(null);
  masterForm.xBilanganFsDibuat3TahunLepasTerjadi = useRef(null);
  masterForm.classID = useRef(null);
  masterForm.classIID = useRef(null);
  masterForm.classIF = useRef(null);
  masterForm.classIIF = useRef(null);
  //perlu dibuat
  masterForm.baruJumlahGigiKekalPerluFs = useRef(null);
  masterForm.semulaJumlahGigiKekalPerluFs = useRef(null);
  masterForm.jumlahGigiFsGagal = useRef(null);
  masterForm.baruJumlahGigiKekalPerluFv = useRef(null);
  masterForm.semulaJumlahGigiKekalPerluFv = useRef(null);
  masterForm.baruJumlahGigiKekalPerluPrrJenis1 = useRef(null);
  masterForm.semulaJumlahGigiKekalPerluPrrJenis1 = useRef(null);
  masterForm.yaSilverDiamineFluoridePerluSapuan = useRef(null);
  masterForm.tidakSilverDiamineFluoridePerluSapuan = useRef(null);
  masterForm.baruGDAnteriorSewarna = useRef(null);
  masterForm.semulaGDAnteriorSewarna = useRef(null);
  masterForm.baruGKAnteriorSewarna = useRef(null);
  masterForm.semulaGKAnteriorSewarna = useRef(null);
  masterForm.baruGDPosteriorSewarna = useRef(null);
  masterForm.semulaGDPosteriorSewarna = useRef(null);
  masterForm.baruGKPosteriorSewarna = useRef(null);
  masterForm.semulaGKPosteriorSewarna = useRef(null);
  masterForm.baruGDPosteriorAmalgam = useRef(null);
  masterForm.semulaGDPosteriorAmalgam = useRef(null);
  masterForm.baruGKPosteriorAmalgam = useRef(null);
  masterForm.semulaGKPosteriorAmalgam = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    //pendaftaran
    console.log(masterForm.kpBergerak.current.checked);
    console.log(masterForm.pasukanPergigianBergerak.current.checked);
    console.log(masterForm.plateNo.current.value);
    console.log(masterForm.baruKedatanganPendaftaran.current.value);
    console.log(masterForm.ulanganKedatanganPendaftaran.current.value);
    console.log(masterForm.engganKedatanganPendaftaran.current.checked);
    console.log(masterForm.tidakHadirKedatanganPendaftaran.current.checked);
    console.log(masterForm.adaPemeriksaanPendaftaran.current.value);
    console.log(masterForm.tiadaPemeriksaanPendaftaran.current.value);
    console.log(masterForm.tinggiRisikoSekolahPendaftaran.current.value);
    console.log(masterForm.rendahRisikoSekolahPendaftaran.current.value);
    //pemeriksaan awal div 1
    console.log(masterForm.adaCleftLip.current.checked);
    console.log(masterForm.rujukCleftLip.current.checked);
    console.log(masterForm.adaDenture.current.value);
    console.log(masterForm.tidakAdaDenture.current.value);
    console.log(masterForm.atasSediaAdaDenture.current.checked);
    console.log(masterForm.separaAtasSediaAdaDenture.current.value);
    console.log(masterForm.penuhAtasSediaAdaDenture.current.value);
    console.log(masterForm.bawahSediaAdaDenture.current.checked);
    console.log(masterForm.separaBawahSediaAdaDenture.current.value);
    console.log(masterForm.penuhBawahSediaAdaDenture.current.value);
    console.log(masterForm.perluDenture.current.value);
    console.log(masterForm.tidakPerluDenture.current.value);
    console.log(masterForm.atasPerluDenture.current.checked);
    console.log(masterForm.separaAtasPerluDenture.current.value);
    console.log(masterForm.penuhAtasPerluDenture.current.value);
    console.log(masterForm.bawahPerluDenture.current.checked);
    console.log(masterForm.separaBawahPerluDenture.current.value);
    console.log(masterForm.penuhBawahPerluDenture.current.value);
    console.log(masterForm.toothSurfaceLossTrauma.current.checked);
    console.log(masterForm.kecederaanGigiAnteriorTrauma.current.checked);
    console.log(masterForm.tisuLembutTrauma.current.checked);
    console.log(masterForm.tisuKerasTrauma.current.checked);
    //pemeriksaan awal div 2
    console.log(masterForm.kebersihanMulutOralHygiene.current.value);
    console.log(masterForm.skorBpeOralHygiene.current.value);
    console.log(masterForm.saringanKanserMulutOralHygiene.current.checked);
    console.log(masterForm.skorGisMulutOralHygiene.current.value);
    console.log(masterForm.dAdaGigiDesidus.current.value);
    console.log(masterForm.mAdaGigiDesidus.current.value);
    console.log(masterForm.fAdaGigiDesidus.current.value);
    console.log(masterForm.eAdaGigiDesidus.current.value);
    console.log(masterForm.xAdaGigiDesidus.current.value);
    console.log(masterForm.dAdaGigiKekal.current.value);
    console.log(masterForm.mAdaGigiKekal.current.value);
    console.log(masterForm.fAdaGigiKekal.current.value);
    console.log(masterForm.eAdaGigiKekal.current.value);
    console.log(masterForm.xAdaGigiKekal.current.value);
    console.log(masterForm.jumlahFaktorRisiko.current.value);
    //pemeriksaan awal div 3
    console.log(masterForm.gicBilanganFsDibuat3TahunLepas.current.value);
    console.log(masterForm.resinBilanganFsDibuat3TahunLepas.current.value);
    console.log(masterForm.lainLainBilanganFsDibuat3TahunLepas.current.value);
    console.log(masterForm.dBilanganFsDibuat3TahunLepasTerjadi.current.value);
    console.log(masterForm.mBilanganFsDibuat3TahunLepasTerjadi.current.value);
    console.log(masterForm.fBilanganFsDibuat3TahunLepasTerjadi.current.value);
    console.log(masterForm.eBilanganFsDibuat3TahunLepasTerjadi.current.value);
    console.log(masterForm.xBilanganFsDibuat3TahunLepasTerjadi.current.value);
    console.log(masterForm.classID.current.value);
    console.log(masterForm.classIID.current.value);
    console.log(masterForm.classIF.current.value);
    console.log(masterForm.classIIF.current.value);
    //perlu dibuat
    console.log(masterForm.baruJumlahGigiKekalPerluFs.current.value);
    console.log(masterForm.semulaJumlahGigiKekalPerluFs.current.value);
    console.log(masterForm.jumlahGigiFsGagal.current.value);
    console.log(masterForm.baruJumlahGigiKekalPerluFv.current.value);
    console.log(masterForm.semulaJumlahGigiKekalPerluFv.current.value);
    console.log(masterForm.baruJumlahGigiKekalPerluPrrJenis1.current.value);
    console.log(masterForm.semulaJumlahGigiKekalPerluPrrJenis1.current.value);
    console.log(masterForm.yaSilverDiamineFluoridePerluSapuan.current.value);
    console.log(masterForm.tidakSilverDiamineFluoridePerluSapuan.current.value);
    console.log(masterForm.baruGDAnteriorSewarna.current.value);
    console.log(masterForm.semulaGDAnteriorSewarna.current.value);
    console.log(masterForm.baruGKAnteriorSewarna.current.value);
    console.log(masterForm.semulaGKAnteriorSewarna.current.value);
    console.log(masterForm.baruGDPosteriorSewarna.current.value);
    console.log(masterForm.semulaGDPosteriorSewarna.current.value);
    console.log(masterForm.baruGKPosteriorSewarna.current.value);
    console.log(masterForm.semulaGKPosteriorSewarna.current.value);
    console.log(masterForm.baruGDPosteriorAmalgam.current.value);
    console.log(masterForm.semulaGDPosteriorAmalgam.current.value);
    console.log(masterForm.baruGKPosteriorAmalgam.current.value);
  };

  const handleNext = () => {
    // do something..
  };

  return (
    <>
      <div className='container px-10 h-full p-3 overflow-y-auto'>
        <div className='p-2'>
          <article className='outline outline-1 outline-userBlack grid grid-cols-1 md:grid-cols-2'>
            <div className=''>
              <div>
                <h1 className='text-l font-bold flex flex-row pl-5 pt-5'>
                  BASIC DEMOGRAFIK
                </h1>
                <div className='text-s flex flex-row pl-5'>
                  <h2 className='font-semibold'>NAMA:</h2>
                  <p className=''>izzuddin</p>
                </div>
                <div className='text-s flex flex-row pl-5'>
                  <h2 className='font-semibold'>JANTINA:</h2>
                  <p>Lelaki</p>
                </div>
                <div className='text-s flex flex-row pl-5'>
                  <h2 className='font-semibold'>UMUR:</h2>
                  <p>28</p>
                </div>
                <div className='text-s flex flex-row pl-5'>
                  <h2 className='font-semibold'>NO IC:</h2>
                  <p>123456-10-7891</p>
                </div>
              </div>
            </div>
            <div className='md:pt-10'>
              <div className='text-s flex flex-row pl-5'>
                <h2 className='font-semibold'>NAMA SEKOLAH:</h2>
                <p className='flex flex-row'>SEKOLAH SERI HOGWART</p>
              </div>
              <div className='text-s flex flex-row pl-5'>
                <h2 className='font-semibold'>DARJAH/TINGKATAN:</h2>
                <p>1</p>
              </div>
              <div className='text-s flex flex-row pl-5'>
                <h2 className='font-semibold'>KELAS:</h2>
                <p>1 ARIF</p>
              </div>
            </div>
          </article>
        </div>
        <form onSubmit={handleSubmit}>
          {/* <Pendaftaran {...masterForm} /> */}
          {/* <PemeriksaanAwal {...masterForm} /> */}
          <PerluDibuat {...masterForm} />
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
