import { useState } from 'react';
import {
  FaWindowClose,
  FaCheckCircle,
  FaTimesCircle,
  FaMinus,
  FaPlus,
  FaRegPaperPlane,
  FaUserCheck,
} from 'react-icons/fa';

const ConfirmModal = ({ children, data }) => {
  const [open, setOpen] = useState(false);
  const [openSelesai, setOpenSelesai] = useState(false);
  const [callback, setCallback] = useState(null);

  const show = (callback) => (event) => {
    event.preventDefault();
    setOpen(true);
    event = {
      ...event,
      target: {
        ...event.target,
        value: event.target.value,
      },
    };
    setCallback({
      run: () => callback(event),
    });
  };

  const closeModal = () => {
    setCallback(null);
    setOpen(false);
  };

  const confirm = () => {
    callback.run();
    closeModal();
    setOpenSelesai(false);
  };

  const showSelesai = () => {
    setOpenSelesai(true);
  };

  const closeSelesai = () => {
    setOpenSelesai(false);
    setOpen(false);
  };

  return (
    <>
      {children(show)}
      {open && (
        <>
          <div className='absolute inset-x-0 inset-y-0 lg:inset-x-1/3 lg:inset-y-6 text-sm bg-userWhite z-10 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'>
            <FaWindowClose
              onClick={closeModal}
              className='absolute mr-1 mt-1 text-xl text-userBlack right-0 hover:cursor-pointer hover:text-user2 transition-all'
            />
            <div className='grid grid-rows-[1fr_8fr_1fr] h-full'>
              <h5 className='bg-user9 text-userWhite font-semibold text-xl h-7'>
                PERHATIAN
              </h5>
              <div className='mt-1 py-1'>
                <span className='relative flex items-center justify-center mt-4'>
                  <FaUserCheck className='text-4xl text-user9 mx-auto absolute animate-ping' />
                  <FaUserCheck className='text-4xl text-user9 mx-auto absolute' />
                </span>
                <p className='px-1 font-semibold mt-7'>
                  Anda YAKIN untuk menghantar maklumat?
                </p>
                {data.engganTidakHadirPemeriksaan ? (
                  <p>
                    Pesakit
                    {data.engganTidakHadirPemeriksaan ===
                    'enggan-pemeriksaan' ? (
                      <span className='text-user9 mx-1'>ENGGAN</span>
                    ) : null}
                    {data.engganTidakHadirPemeriksaan ===
                    'tidak-hadir-pemeriksaan' ? (
                      <span className='text-user9 mx-1'>TIDAK HADIR</span>
                    ) : null}
                    untuk Pemeriksaan
                  </p>
                ) : (
                  <div className='h-full overflow-y-auto'>
                    <span className='flex items-center bg-user1 bg-opacity-30 w-full cursor-pointer px-2 py-1 text-xs font-semibold'>
                      <FaMinus className='mr-1' />
                      <span className='font-semibold'>Pemeriksaan</span>
                    </span>
                    <div className='text-xs overflow-hidden transition-all duration-500'>
                      {data.yaTidakSediaAdaStatusDenture ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Status Dentur:
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.yaTidakSediaAdaStatusDenture ||
                            data.yaTidakPerluStatusDenture ? (
                              <p>
                                Sedia Ada Dentur:
                                {data.yaTidakSediaAdaStatusDenture ===
                                'ya-sedia-ada-status-denture' ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                            {data.separaPenuhAtasSediaAdaDenture ===
                            'separa-atas-sedia-ada-denture' ? (
                              <p>
                                -Separa Atas:
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              </p>
                            ) : null}
                            {data.separaPenuhAtasSediaAdaDenture ===
                            'penuh-atas-sedia-ada-denture' ? (
                              <p>
                                -Penuh Atas:
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              </p>
                            ) : null}
                            {data.separaPenuhBawahSediaAdaDenture ===
                            'separa-bawah-sedia-ada-denture' ? (
                              <p>
                                -Separa Bawah:
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              </p>
                            ) : null}
                            {data.separaPenuhBawahSediaAdaDenture ===
                            'penuh-bawah-sedia-ada-denture' ? (
                              <p>
                                -Penuh Bawah:
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              </p>
                            ) : null}
                            {data.yaTidakPerluStatusDenture ? (
                              <p className='border-t border-t-user1 border-opacity-10'>
                                Perlu Dentur:
                                {data.yaTidakPerluStatusDenture ===
                                'ya-perlu-status-denture' ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                            {data.separaPenuhAtasPerluDenture ===
                            'separa-atas-perlu-denture' ? (
                              <p>
                                -Separa Atas:
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              </p>
                            ) : null}
                            {data.separaPenuhAtasPerluDenture ===
                            'penuh-atas-perlu-denture' ? (
                              <p>
                                -Penuh Atas:
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              </p>
                            ) : null}
                            {data.separaPenuhBawahPerluDenture ===
                            'separa-bawah-perlu-denture' ? (
                              <p>
                                -Separa Bawah:
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              </p>
                            ) : null}
                            {data.separaPenuhBawahPerluDenture ===
                            'penuh-bawah-perlu-denture' ? (
                              <p>
                                -Penuh Bawah:
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              </p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                      {data.kebersihanMulutOralHygiene ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Gred Skor Plak:
                          </p>
                          <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.kebersihanMulutOralHygiene}
                          </p>
                        </div>
                      ) : null}
                      {data.skorBpeOralHygiene ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            BPE Skor:
                          </p>
                          <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.skorBpeOralHygiene}
                          </p>
                        </div>
                      ) : null}
                      {data.skorGisMulutOralHygiene ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5 '>
                            GIS Skor:{' '}
                          </p>
                          <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.skorGisMulutOralHygiene}
                          </p>
                        </div>
                      ) : null}
                      {data.perluPenskaleranOralHygiene === true ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Perlu Penskaleran:
                          </p>
                          <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.perluPenskaleranOralHygiene === true ? (
                              <FaCheckCircle className='text-user7 text-center mx-1' />
                            ) : (
                              <FaTimesCircle className='text-user9 text-center mx-1' />
                            )}
                          </p>
                        </div>
                      ) : null}
                      {data.adaDesidus === true ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Status Gigi Desidus:
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            <p>
                              Ada Gigi Desidus:
                              {data.adaDesidus ? (
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              ) : (
                                <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                              )}
                            </p>
                            <p className='lowercase'>
                              dfx: {data.sumDMFXDesidus}
                            </p>
                            {data.smAdaGigiDesidus && (
                              <p className='lowercase'>
                                sm: {data.smAdaGigiDesidus}
                              </p>
                            )}
                          </p>
                        </div>
                      ) : null}
                      {data.adaKekal === true ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Status Gigi Kekal:
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            <p>
                              Ada Gigi Kekal:
                              {data.adaKekal ? (
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              ) : (
                                <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                              )}
                            </p>
                            DMFX: {data.sumDMFXKekal}
                            {data.eAdaGigiKekal ? (
                              <p className='uppercase'>
                                E: {data.eAdaGigiKekal}
                              </p>
                            ) : null}
                            {data.classID ? (
                              <p>Class I D: {data.classID}</p>
                            ) : null}
                            {data.classIID ? (
                              <p>Class II D: {data.classIID}</p>
                            ) : null}
                            {data.classIF ? (
                              <p>Class I F: {data.classIF}</p>
                            ) : null}
                            {data.classIIF ? (
                              <p>Class II F: {data.classIIF}</p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                      {data.jumlahFaktorRisiko ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Jumlah Faktor Risiko:
                          </p>
                          <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.jumlahFaktorRisiko}
                          </p>
                        </div>
                      ) : null}
                      {data.adaCleftLip === true ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Cleft Lip/Palate:
                          </p>
                          <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.adaCleftLip ? (
                              <FaCheckCircle className='text-user7 text-center mx-1' />
                            ) : (
                              <FaTimesCircle className='text-user9 text-center mx-1' />
                            )}
                          </p>
                        </div>
                      ) : null}
                      {data.kecederaanGigiAnteriorTrauma ||
                      data.tisuLembutTrauma ||
                      data.tisuKerasTrauma ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Trauma:
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.kecederaanGigiAnteriorTrauma ? (
                              <p className='flex flex-row'>
                                Kecederaan Gigi :{' '}
                                {data.kecederaanGigiAnteriorTrauma ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1' />
                                )}
                              </p>
                            ) : null}
                            {data.tisuLembutTrauma ? (
                              <p className='flex flex-row'>
                                Kecederaan Tisu Lembut:{' '}
                                {data.tisuLembutTrauma ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1' />
                                )}
                              </p>
                            ) : null}
                            {data.tisuKerasTrauma ? (
                              <p className='flex flex-row'>
                                kecederaan tulang muka:{' '}
                                {data.tisuKerasTrauma ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1' />
                                )}
                              </p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                      {data.gicBilanganFsDibuat3TahunLepas ||
                      data.resinBilanganFsDibuat3TahunLepas ||
                      data.lainLainBilanganFsDibuat3TahunLepas ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Bilangan Gigi Kekal Dibuat Pengapan Fisur 3 Tahun
                            Lepas:
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.gicBilanganFsDibuat3TahunLepas ? (
                              <p>GIC: {data.gicBilanganFsDibuat3TahunLepas}</p>
                            ) : null}
                            {data.resinBilanganFsDibuat3TahunLepas ? (
                              <p>
                                Resin: {data.resinBilanganFsDibuat3TahunLepas}
                              </p>
                            ) : null}
                            {data.lainLainBilanganFsDibuat3TahunLepas ? (
                              <p>
                                Lain-lain:{' '}
                                {data.lainLainBilanganFsDibuat3TahunLepas}
                              </p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                      {data.dBilanganFsDibuat3TahunLepasTerjadi ||
                      data.mBilanganFsDibuat3TahunLepasTerjadi ||
                      data.fBilanganFsDibuat3TahunLepasTerjadi ||
                      data.xBilanganFsDibuat3TahunLepasTerjadi ||
                      data.eBilanganFsDibuat3TahunLepasTerjadi ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Bilangan Gigi Kekal Dibuat Pengapan Fisur 3 Tahun
                            Lepas Berubah Menjadi :
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.dBilanganFsDibuat3TahunLepasTerjadi ? (
                              <p>
                                D: {data.dBilanganFsDibuat3TahunLepasTerjadi}
                              </p>
                            ) : null}
                            {data.mBilanganFsDibuat3TahunLepasTerjadi ? (
                              <p>
                                M: {data.mBilanganFsDibuat3TahunLepasTerjadi}
                              </p>
                            ) : null}
                            {data.fBilanganFsDibuat3TahunLepasTerjadi ? (
                              <p>
                                F: {data.fBilanganFsDibuat3TahunLepasTerjadi}
                              </p>
                            ) : null}
                            {data.xBilanganFsDibuat3TahunLepasTerjadi ? (
                              <p>
                                X: {data.xBilanganFsDibuat3TahunLepasTerjadi}
                              </p>
                            ) : null}
                            {data.eBilanganFsDibuat3TahunLepasTerjadi ? (
                              <p>
                                E: {data.eBilanganFsDibuat3TahunLepasTerjadi}
                              </p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                      {data.toothSurfaceLoss ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Kehilangan Permukaan Gigi :
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.toothSurfaceLoss ? (
                              <p>
                                TSL :
                                <FaCheckCircle className='text-user7 text-center mx-1' />
                              </p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                      {data.baruJumlahGigiKekalPerluFs ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Murid Perlu Pengapan Fisur (E10):
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            <p className='flex flex-row'>
                              Perlu :
                              {data.baruJumlahGigiKekalPerluFs > 0 ? (
                                <FaCheckCircle className='text-user7 text-center mx-1' />
                              ) : (
                                <FaTimesCircle className='text-user9 text-center mx-1' />
                              )}
                            </p>
                            <p>
                              jumlah gigi kekal :
                              {data.baruJumlahGigiKekalPerluFs}
                            </p>
                          </p>
                        </div>
                      ) : null}
                      {data.baruJumlahGigiKekalPerluFv ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Murid Perlu Sapuan Fluorida (FV) (E13):
                          </p>
                          <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                            <p className='flex flex-row'>
                              Perlu :
                              {data.baruJumlahGigiKekalPerluFv > 0 ? (
                                <FaCheckCircle className='text-user7 text-center mx-1' />
                              ) : (
                                <FaTimesCircle className='text-user9 text-center mx-1' />
                              )}
                            </p>
                            <p>
                              jumlah gigi kekal :
                              {data.baruJumlahGigiKekalPerluFv}
                            </p>
                          </p>
                        </div>
                      ) : null}
                      {data.baruJumlahGigiKekalPerluPrrJenis1 ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            murid perlu Resin Pencegahan Jenis 1 (PRR Type I)
                            (E12)
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            <p className='flex flex-row'>
                              Perlu :
                              {data.baruJumlahGigiKekalPerluPrrJenis1 > 0 ? (
                                <FaCheckCircle className='text-user7 text-center mx-1' />
                              ) : (
                                <FaTimesCircle className='text-user9 text-center mx-1' />
                              )}
                            </p>
                            <p>
                              jumlah gigi kekal :
                              {data.baruJumlahGigiKekalPerluPrrJenis1}
                            </p>
                          </p>
                        </div>
                      ) : null}
                      {data.baruGDAnteriorSewarnaJumlahTampalanDiperlukan ||
                      data.semulaGDAnteriorSewarnaJumlahTampalanDiperlukan ||
                      data.baruGKAnteriorSewarnaJumlahTampalanDiperlukan ||
                      data.semulaGKAnteriorSewarnaJumlahTampalanDiperlukan ||
                      data.baruGDPosteriorSewarnaJumlahTampalanDiperlukan ||
                      data.semulaGDPosteriorSewarnaJumlahTampalanDiperlukan ||
                      data.baruGKPosteriorSewarnaJumlahTampalanDiperlukan ||
                      data.semulaGKPosteriorSewarnaJumlahTampalanDiperlukan ||
                      data.baruGDPosteriorAmalgamJumlahTampalanDiperlukan ||
                      data.semulaGDPosteriorAmalgamJumlahTampalanDiperlukan ||
                      data.baruGKPosteriorAmalgamJumlahTampalanDiperlukan ||
                      data.semulaGKPosteriorAmalgamJumlahTampalanDiperlukan ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Jumlah Tampalan Diperlukan:
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.baruGDAnteriorSewarnaJumlahTampalanDiperlukan ? (
                              <p className='flex flex-row'>
                                Baru Gigi Desidus Anterior Sewarna :
                                {
                                  data.baruGDAnteriorSewarnaJumlahTampalanDiperlukan
                                }
                              </p>
                            ) : null}
                            {data.semulaGDAnteriorSewarnaJumlahTampalanDiperlukan ? (
                              <p className='flex flex-row'>
                                Semula Gigi Desidus Anterior Sewarna :
                                {
                                  data.semulaGDAnteriorSewarnaJumlahTampalanDiperlukan
                                }
                              </p>
                            ) : null}
                            {data.baruGKAnteriorSewarnaJumlahTampalanDiperlukan ? (
                              <p className='flex flex-row'>
                                Baru Gigi Kekal Anterior Sewarna :
                                {
                                  data.baruGKAnteriorSewarnaJumlahTampalanDiperlukan
                                }
                              </p>
                            ) : null}
                            {data.semulaGKAnteriorSewarnaJumlahTampalanDiperlukan ? (
                              <p className='flex flex-row'>
                                Semula Gigi Kekal Anterior Sewarna :
                                {
                                  data.semulaGKAnteriorSewarnaJumlahTampalanDiperlukan
                                }
                              </p>
                            ) : null}
                            {data.baruGDPosteriorSewarnaJumlahTampalanDiperlukan ? (
                              <p className='flex flex-row'>
                                Baru Gigi Desidus Posterior Sewarna :
                                {
                                  data.baruGDPosteriorSewarnaJumlahTampalanDiperlukan
                                }
                              </p>
                            ) : null}
                            {data.semulaGDPosteriorSewarnaJumlahTampalanDiperlukan ? (
                              <p className='flex flex-row'>
                                Semula Gigi Desidus Posterior Sewarna :
                                {
                                  data.semulaGDPosteriorSewarnaJumlahTampalanDiperlukan
                                }
                              </p>
                            ) : null}
                            {data.baruGKPosteriorSewarnaJumlahTampalanDiperlukan ? (
                              <p className='flex flex-row'>
                                Baru Gigi Kekal Posterior Sewarna :
                                {
                                  data.baruGKPosteriorSewarnaJumlahTampalanDiperlukan
                                }
                              </p>
                            ) : null}
                            {data.semulaGKPosteriorSewarnaJumlahTampalanDiperlukan ? (
                              <p className='flex flex-row'>
                                Semula Gigi Kekal Posterior Sewarna :
                                {
                                  data.semulaGKPosteriorSewarnaJumlahTampalanDiperlukan
                                }
                              </p>
                            ) : null}
                            {data.baruGDPosteriorAmalgamJumlahTampalanDiperlukan ? (
                              <p className='flex flex-row'>
                                Baru Gigi Desidus Posterior Amalgam :
                                {
                                  data.baruGDPosteriorAmalgamJumlahTampalanDiperlukan
                                }
                              </p>
                            ) : null}
                            {data.semulaGDPosteriorAmalgamJumlahTampalanDiperlukan ? (
                              <p className='flex flex-row'>
                                Semula Gigi Desidus Posterior Amalgam :
                                {
                                  data.semulaGDPosteriorAmalgamJumlahTampalanDiperlukan
                                }
                              </p>
                            ) : null}
                            {data.baruGKPosteriorAmalgamJumlahTampalanDiperlukan ? (
                              <p className='flex flex-row'>
                                Baru Gigi Kekal Posterior Amalgam :
                                {
                                  data.baruGKPosteriorAmalgamJumlahTampalanDiperlukan
                                }
                              </p>
                            ) : null}
                            {data.semulaGKPosteriorAmalgamJumlahTampalanDiperlukan ? (
                              <p className='flex flex-row'>
                                Semula Gigi Kekal Posterior Amalgam :
                                {
                                  data.semulaGKPosteriorAmalgamJumlahTampalanDiperlukan
                                }
                              </p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                      {data.statusM ||
                      data.menerimaNasihatRingkas ||
                      data.melaksanakanSaringanMerokok ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            KOTAK
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.melaksanakanSaringanMerokok ? (
                              <p className='flex flex-row items-center'>
                                Melaksanakan Saringan Merokok :{' '}
                                {data.melaksanakanSaringanMerokok ===
                                'ya-melaksanakan-saringan-merokok' ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1' />
                                )}
                              </p>
                            ) : null}
                            {data.statusM ? (
                              <p className='flex flex-row items-center'>
                                Status M :{' '}
                                <FaCheckCircle className='text-user7 text-center mx-1' />{' '}
                                {data.statusM}
                              </p>
                            ) : null}
                            {data.menerimaNasihatRingkas ===
                            'ya-menerima-nasihat-ringkas' ? (
                              <p className='flex flex-row items-center'>
                                Menerima Nasihat Ringkas :{' '}
                                <FaCheckCircle className='text-user7 text-center mx-1' />
                              </p>
                            ) : null}
                            {data.bersediaDirujuk === 'ya-bersedia-dirujuk' ? (
                              <p className='flex flex-row items-center'>
                                Bersedia Dirujuk menjalani intervensi:{' '}
                                <FaCheckCircle className='text-user7 text-center mx-1' />
                              </p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                      {data.kesSelesai ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Kes Selesai:
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.kesSelesai === 'ya-kes-selesai' ? (
                              <p className='flex flex-row'>Ya, Kes Selesai</p>
                            ) : null}
                            {data.kesSelesai === 'tidak-kes-selesai' ? (
                              <p className='flex flex-row'>
                                Tidak, Kes Selesai
                              </p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                      {data.kesSelesaiIcdas ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Kes Selesai MMI:
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.kesSelesaiIcdas === 'ya-kes-selesai-icdas' ? (
                              <p className='flex flex-row'>Ya, Kes Selesai</p>
                            ) : null}
                            {data.kesSelesaiIcdas ===
                            'tidak-kes-selesai-icdas' ? (
                              <p className='flex flex-row'>
                                Tidak, Kes Selesai
                              </p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
              <div className='sticky grid grid-cols-2 bottom-0 right-0 left-0 m-2 mx-10 bg-userWhite px-5 py-2'>
                <button
                  className='capitalize bg-user9 text-userWhite rounded-md shadow-xl p-2 mr-3 hover:bg-user1 transition-all flex justify-center items-center'
                  onClick={() => {
                    if (data.kesSelesai === 'ya-kes-selesai') {
                      setOpenSelesai(true);
                    } else {
                      confirm();
                    }
                  }}
                >
                  YA
                  <FaRegPaperPlane className='inline-flex ml-1' />
                </button>
                <button
                  className='capitalize bg-userWhite text-userBlack rounded-md p-2 ml-3 hover:bg-user5 transition-all'
                  onClick={closeModal}
                >
                  Tidak
                </button>
              </div>
            </div>
          </div>
          <div
            onClick={closeModal}
            className='fixed inset-0 bg-userBlack opacity-50 z-0'
          />
        </>
      )}
      {openSelesai && (
        <>
          <form
            onSubmit={confirm}
            className='absolute inset-x-10 inset-y-5 lg:inset-x-60 lg:inset-y-14 2xl:inset-x-1/3 text-sm bg-userWhite z-50 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'
          >
            <FaWindowClose
              onClick={closeSelesai}
              className='absolute mr-1 mt-1 text-xl text-userBlack right-0 hover:cursor-pointer hover:text-user2 transition-all'
            />
            <h5 className='bg-user9 text-userWhite font-semibold text-xl h-7'>
              PERHATIAN
            </h5>
            <div className='rounded-md p-5'>
              <div className='flex flex-col justify-center mb-3 2xl:mb-10'>
                <span className='relative flex justify-center items-center mt-8'>
                  <FaUserCheck className='text-7xl text-user9 mx-auto absolute animate-ping' />
                  <FaUserCheck className='text-7xl text-user9 mx-auto absolute' />
                </span>
                <p className='text-center text-xl font-bold mt-14'>
                  Adakah anda yakin?
                </p>
                <p className='text-center text-sm normal-case'>
                  Data ini tidak boleh diubah lagi dan status murid adalah
                  <strong className='text-user9 mx-1'>SELESAI</strong>setelah
                  BUTANG YA ditekan
                </p>
              </div>
              <div className='max-[1024px]:absolute min-[1536px]:absolute grid grid-cols-2 bottom-0 right-0 left-0 m-2 mx-10'>
                <button
                  type='submit'
                  className='capitalize bg-user9 text-userWhite rounded-md shadow-xl p-2 mr-3 hover:bg-kaunter2 transition-all flex items-center justify-center'
                  data-cy='submit-confirm-2'
                >
                  YA
                  <FaRegPaperPlane className='inline-flex ml-1' />
                </button>
                <button
                  className='capitalize bg-userWhite text-userBlack rounded-md p-2 ml-3 hover:bg-user5 transition-all'
                  onClick={closeSelesai}
                >
                  Tidak
                </button>
              </div>
            </div>
          </form>
          <div
            onClick={closeSelesai}
            className='absolute inset-0 bg-user1 z-40 opacity-75'
          />
        </>
      )}
    </>
  );
};

export default ConfirmModal;
