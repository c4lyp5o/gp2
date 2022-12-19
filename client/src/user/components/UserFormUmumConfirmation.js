import { useState } from 'react';
import {
  FaWindowClose,
  FaCheckCircle,
  FaTimesCircle,
  FaMinus,
  FaPlus,
} from 'react-icons/fa';

import styles from '../../admin/Modal.module.css';

const ConfirmModal = ({ children, data }) => {
  const [open, setOpen] = useState(false);
  const [callback, setCallback] = useState(null);

  const [showPemeriksaan, setShowPemeriksaan] = useState(true);
  const [showRawatan, setShowRawatan] = useState(false);
  const [showPromosi, setShowPromosi] = useState(false);

  const show = (callback) => (event) => {
    event.preventDefault();
    setOpen(true);
    event = {
      ...event,
      target: { ...event.target, value: event.target.value },
    };
    setCallback({
      run: () => callback(event),
    });
  };

  const hide = () => {
    setCallback(null);
    setOpen(false);
  };

  const confirm = () => {
    callback.run();
    hide();
  };

  return (
    <>
      {children(show)}
      {open && (
        <>
          <div className='absolute inset-x-10 inset-y-5 lg:inset-x-1/3 lg:inset-y-6 text-sm bg-userWhite z-20 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'>
            <FaWindowClose
              onClick={hide}
              className='absolute mr-1 mt-1 text-xl text-userBlack right-0 hover:cursor-pointer hover:text-user2 transition-all'
            />
            <h5 className='bg-user9 text-userWhite font-semibold text-xl'>
              PERHATIAN
            </h5>
            <div className='mt-3 py-1'>
              <p className='px-1 text-xs font-semibold'>
                Anda YAKIN untuk menghantar maklumat?
              </p>
              {data.statusKehadiran === false ? (
                <div>
                  <span
                    className='flex items-center bg-user1 bg-opacity-30 w-full cursor-pointer px-2 py-1 text-xs font-semibold'
                    onClick={() => {
                      setShowPemeriksaan(!showPemeriksaan);
                      setShowRawatan(false);
                    }}
                  >
                    {showPemeriksaan ? (
                      <FaMinus className='' />
                    ) : (
                      <FaPlus className='' />
                    )}
                    PEMERIKSAAN
                  </span>
                  <div
                    className={`text-xs ${
                      showPemeriksaan ? 'max-h-min' : 'max-h-0'
                    } overflow-hidden transition-all duration-500`}
                  >
                    {data.adaCleftLipPemeriksaanUmum ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Cleft Lip/Palate:
                        </p>
                        <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {data.adaCleftLipPemeriksaanUmum ? (
                            <FaCheckCircle className='text-user7 text-center mx-1' />
                          ) : (
                            <FaTimesCircle className='text-user9 text-center mx-1' />
                          )}
                        </p>
                      </div>
                    ) : null}
                    {data.yaTidakSediaAdaStatusDenturePemeriksaanUmum ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Sedia Ada Status Dentur:
                        </p>
                        <p className='text-xs p-1 flex justify-start text-left items-center border-y border-y-user1 border-opacity-10'>
                          {data.yaTidakSediaAdaStatusDenturePemeriksaanUmum ===
                          'ya-sedia-ada-status-denture-pemeriksaan-umum' ? (
                            <FaCheckCircle className='text-user7 text-center mx-1' />
                          ) : (
                            <FaTimesCircle className='text-user9 text-center mx-1' />
                          )}
                          {data.separaPenuhAtasSediaAdaDenturePemeriksaanUmum ===
                          'separa-atas-sedia-ada-denture-pemeriksaan-umum' ? (
                            <p>
                              Separa Atas:
                              <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                            </p>
                          ) : null}
                          {data.separaPenuhAtasSediaAdaDenturePemeriksaanUmum ===
                          'penuh-atas-sedia-ada-denture-pemeriksaan-umum' ? (
                            <p>
                              Penuh Atas:
                              <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                            </p>
                          ) : null}
                          {data.separaPenuhBawahSediaAdaDenturePemeriksaanUmum ===
                          'separa-bawah-sedia-ada-denture-pemeriksaan-umum' ? (
                            <p>
                              Separa Bawah:
                              <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                            </p>
                          ) : null}
                          {data.separaPenuhBawahSediaAdaDenturePemeriksaanUmum ===
                          'penuh-bawah-sedia-ada-denture-pemeriksaan-umum' ? (
                            <p>
                              Penuh Bawah:
                              <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                            </p>
                          ) : null}
                        </p>
                      </div>
                    ) : null}
                    {data.yaTidakPerluStatusDenturePemeriksaanUmum ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Perlu Ada Status Dentur:
                        </p>
                        <p className='text-xs p-1 flex justify-start text-left items-center border-y border-y-user1 border-opacity-10'>
                          {data.yaTidakPerluStatusDenturePemeriksaanUmum ===
                          'ya-perlu-status-denture-pemeriksaan-umum' ? (
                            <FaCheckCircle className='text-user7 text-center mx-1' />
                          ) : (
                            <FaTimesCircle className='text-user9 text-center mx-1' />
                          )}
                          {data.separaPenuhAtasPerluDenturePemeriksaanUmum ===
                          'separa-atas-perlu-denture-pemeriksaan-umum' ? (
                            <p>
                              Separa Atas:
                              <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                            </p>
                          ) : null}
                          {data.separaPenuhAtasPerluDenturePemeriksaanUmum ===
                          'penuh-atas-perlu-denture-pemeriksaan-umum' ? (
                            <p>
                              Penuh Atas:
                              <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                            </p>
                          ) : null}
                          {data.separaPenuhBawahPerluDenturePemeriksaanUmum ===
                          'separa-bawah-perlu-denture-pemeriksaan-umum' ? (
                            <p>
                              Separa Bawah:
                              <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                            </p>
                          ) : null}
                          {data.separaPenuhBawahPerluDenturePemeriksaanUmum ===
                          'penuh-bawah-perlu-denture-pemeriksaan-umum' ? (
                            <p>
                              Penuh Bawah:
                              <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                            </p>
                          ) : null}
                        </p>
                      </div>
                    ) : null}
                    {data.toothSurfaceLossTraumaPemeriksaanUmum ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Kehilangan Permukaan Gigi:
                        </p>
                        <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {data.toothSurfaceLossTraumaPemeriksaanUmum ? (
                            <FaCheckCircle className='text-user7 text-center mx-1' />
                          ) : (
                            <FaTimesCircle className='text-user9 text-center mx-1' />
                          )}
                        </p>
                      </div>
                    ) : null}
                    {data.fissureSealantPemeriksaanUmum ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Pengapan Fisur:
                        </p>
                        <p className='text-xs p-1 flex justify-start text-left items-center border-y border-y-user1 border-opacity-10'>
                          {data.fissureSealantPemeriksaanUmum ? (
                            <FaCheckCircle className='text-user7 text-center mx-1' />
                          ) : (
                            <FaTimesCircle className='text-user9 text-center mx-1' />
                          )}
                          {data.baruJumlahGigiKekalPerluFSRawatanUmum ? (
                            <p>
                              jumlah gigi:{' '}
                              {data.baruJumlahGigiKekalPerluFSRawatanUmum}
                            </p>
                          ) : null}
                        </p>
                      </div>
                    ) : null}
                    {data.fvPerluSapuanPemeriksaanUmum ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Perlu Sapuan:{' '}
                        </p>
                        <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {data.fvPerluSapuanPemeriksaanUmum ===
                          'ya-fv-perlu-sapuan-pemeriksaan-umum' ? (
                            <FaCheckCircle className='text-user7 text-center mx-1' />
                          ) : (
                            <FaTimesCircle className='text-user9 text-center mx-1' />
                          )}
                        </p>
                      </div>
                    ) : null}
                    {data.prrJenis1PemeriksaanUmum ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          PRR Jenis 1:{' '}
                        </p>
                        <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {data.prrJenis1PemeriksaanUmum ? (
                            <FaCheckCircle className='text-user7 text-center mx-1' />
                          ) : (
                            <FaTimesCircle className='text-user9 text-center mx-1' />
                          )}
                          {data.baruJumlahGigiKekalPerluPRRJenis1RawatanUmum ? (
                            <p>
                              jumlah gigi:{' '}
                              {
                                data.baruJumlahGigiKekalPerluPRRJenis1RawatanUmum
                              }
                            </p>
                          ) : null}
                        </p>
                      </div>
                    ) : null}
                    {data.yaTidakSilverDiamineFluoridePerluSapuanPemeriksaanUmum ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Silver Diamine Fluoride:
                        </p>
                        <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {data.yaTidakSilverDiamineFluoridePerluSapuanPemeriksaanUmum ? (
                            <FaCheckCircle className='text-user7 text-center mx-1' />
                          ) : (
                            <FaTimesCircle className='text-user9 text-center mx-1' />
                          )}
                        </p>
                      </div>
                    ) : null}
                    {data.kebersihanMulutOralHygienePemeriksaanUmum ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Gred Skor Plak:
                        </p>
                        <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {data.kebersihanMulutOralHygienePemeriksaanUmum}
                        </p>
                      </div>
                    ) : null}
                    {data.skorGisMulutOralHygienePemeriksaanUmum ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5 '>
                          GIS Skor:{' '}
                        </p>
                        <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {data.skorGisMulutOralHygienePemeriksaanUmum}
                        </p>
                      </div>
                    ) : null}
                    {data.perluPenskaleranPemeriksaanUmum ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Perlu Penskaleran:
                        </p>
                        <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {data.perluPenskaleranPemeriksaanUmum ? (
                            <FaCheckCircle className='text-user7 text-center mx-1' />
                          ) : (
                            <FaTimesCircle className='text-user9 text-center mx-1' />
                          )}
                        </p>
                      </div>
                    ) : null}
                    {data.bilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Bilangan Gigi WE :
                        </p>
                        <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {
                            data.bilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum
                          }
                        </p>
                      </div>
                    ) : null}
                    {data.adaDesidusPemeriksaanUmum ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Status Gigi Desidus:
                        </p>
                        <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                          <p>
                            Ada Gigi Desidus:
                            {data.adaDesidusPemeriksaanUmum ? (
                              <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                            ) : (
                              <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                            )}
                          </p>
                          <p className='lowercase'>
                            dfx: {data.sumDMFXDesidusUmum}
                          </p>
                        </p>
                      </div>
                    ) : null}
                    {data.adaKekalPemeriksaanUmum ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Status Gigi Kekal:
                        </p>
                        <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                          <p>
                            Ada Gigi Kekal:
                            {data.adaKekalPemeriksaanUmum ? (
                              <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                            ) : (
                              <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                            )}
                          </p>
                          DMFX:{' '}
                          {data.sumDMFXKekalUmum -
                            data.eAdaGigiKekalPemeriksaanUmum}
                        </p>
                      </div>
                    ) : null}
                    {data.jumlahFaktorRisikoPemeriksaanUmum ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Jumlah Faktor Risiko:
                        </p>
                        <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {data.jumlahFaktorRisikoPemeriksaanUmum}
                        </p>
                      </div>
                    ) : null}
                    {data.disaringProgramKanserMulutPemeriksaanUmum ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Program Kanser Mulut:
                        </p>
                        <p className='text-xs p-1 flex justify-start items-center text-left border-y border-y-user1 border-opacity-10'>
                          Disaring
                          {data.disaringProgramKanserMulutPemeriksaanUmum ? (
                            <FaCheckCircle className='text-user7 text-center mx-1' />
                          ) : (
                            <FaTimesCircle className='text-user9 text-center mx-1' />
                          )}
                        </p>
                      </div>
                    ) : null}
                    {data.lesiMulutPemeriksaanUmum ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Lesi Mulut:
                        </p>
                        <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {data.lesiMulutPemeriksaanUmum ? (
                            <FaCheckCircle className='text-user7 text-center mx-1' />
                          ) : (
                            <FaTimesCircle className='text-user9 text-center mx-1' />
                          )}
                        </p>
                      </div>
                    ) : null}
                    {data.tabiatBerisikoTinggiPemeriksaanUmum ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Tabiat Berisiko Tinggi:
                        </p>
                        <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {data.tabiatBerisikoTinggiPemeriksaanUmum ? (
                            <FaCheckCircle className='text-user7 text-center mx-1' />
                          ) : (
                            <FaTimesCircle className='text-user9 text-center mx-1' />
                          )}
                        </p>
                      </div>
                    ) : null}
                    {data.jumlahAnteriorKesEndodontikDiperlukanPemeriksaanUmum ||
                    data.jumlahPremolarKesEndodontikDiperlukanPemeriksaanUmum ||
                    data.jumlahMolarKesEndodontikDiperlukanPemeriksaanUmum ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Jumlah Kes Endodontik Diperlukan:
                        </p>
                        <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {data.jumlahAnteriorKesEndodontikDiperlukanPemeriksaanUmum ? (
                            <p>
                              Anterior:{' '}
                              {
                                data.jumlahAnteriorKesEndodontikDiperlukanPemeriksaanUmum
                              }
                            </p>
                          ) : null}
                          {data.jumlahPremolarKesEndodontikDiperlukanPemeriksaanUmum ? (
                            <p>
                              Premolar:{' '}
                              {
                                data.jumlahPremolarKesEndodontikDiperlukanPemeriksaanUmum
                              }
                            </p>
                          ) : null}
                          {data.jumlahMolarKesEndodontikDiperlukanPemeriksaanUmum ? (
                            <p>
                              Molar:{' '}
                              {
                                data.jumlahMolarKesEndodontikDiperlukanPemeriksaanUmum
                              }
                            </p>
                          ) : null}
                          {data.rawatanSemulaEndodontikDariPrimerKesEndodontikDiperlukanPemeriksaanUmum ? (
                            <p>
                              Rawatan Semula Endodontik:{' '}
                              {
                                data.rawatanSemulaEndodontikDariPrimerKesEndodontikDiperlukanPemeriksaanUmum
                              }
                            </p>
                          ) : null}
                        </p>
                      </div>
                    ) : null}
                    {data.skorBpeOralHygienePemeriksaanUmum ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          BPE Skor:{' '}
                        </p>
                        <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {data.skorBpeOralHygienePemeriksaanUmum}
                        </p>
                      </div>
                    ) : null}
                    {data.puncaRujukan ||
                    data.diabetesFaktorRisikoBpe ||
                    data.perokokFaktorRisikoBpe ||
                    data.lainLainFaktorRisikoBpe ||
                    data.pesakitMempunyaiImplanPergigian ||
                    data.periImplantitis ||
                    data.periImplantMucositis ||
                    data.engganBpeImplan ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          BPE & Pencartaan Poket Implan:
                        </p>
                        <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {data.puncaRujukan ? (
                            <p>Punca Rujukan: {data.puncaRujukan}</p>
                          ) : null}
                          {data.diabetesFaktorRisikoBpe ? (
                            <p>
                              Diabetes:{' '}
                              {data.diabetesFaktorRisikoBpe ? (
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              ) : (
                                <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                              )}
                            </p>
                          ) : null}
                          {data.perokokFaktorRisikoBpe ? (
                            <p>
                              Perokok:{' '}
                              {data.perokokFaktorRisikoBpe ? (
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              ) : (
                                <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                              )}
                            </p>
                          ) : null}
                          {data.lainLainFaktorRisikoBpe ? (
                            <p>
                              Lain-lain:{' '}
                              {data.lainLainFaktorRisikoBpe ? (
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              ) : (
                                <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                              )}
                            </p>
                          ) : null}
                          {data.pesakitMempunyaiImplanPergigian ? (
                            <p>
                              Pesakit Mempunyai Implan Pergigian:{' '}
                              {data.pesakitMempunyaiImplanPergigian ? (
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              ) : (
                                <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                              )}
                            </p>
                          ) : null}
                          {data.periImplantitis ? (
                            <p>
                              Peri-Implantitis:{' '}
                              {data.periImplantitis ? (
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              ) : (
                                <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                              )}
                            </p>
                          ) : null}
                          {data.periImplantMucositis ? (
                            <p>
                              Peri-Implant Mucositis:{' '}
                              {data.periImplantMucositis ? (
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              ) : (
                                <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                              )}
                            </p>
                          ) : null}
                          {data.engganBpeImplan ? (
                            <p>
                              Enggan BPE Implan:{' '}
                              {data.engganBpeImplan ? (
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              ) : (
                                <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                              )}
                            </p>
                          ) : null}
                        </p>
                      </div>
                    ) : null}
                  </div>
                  <span
                    className='flex items-center bg-user1 bg-opacity-30 w-full cursor-pointer px-2 py-1 text-xs font-semibold'
                    onClick={() => {
                      setShowRawatan(!showRawatan);
                      setShowPemeriksaan(false);
                    }}
                  >
                    {showRawatan ? (
                      <FaMinus className='' />
                    ) : (
                      <FaPlus className='' />
                    )}
                    RAWATAN
                  </span>
                  <div
                    className={`text-xs ${
                      showRawatan ? 'max-h-min' : 'max-h-0'
                    } overflow-hidden transition-all duration-500`}
                  ></div>
                </div>
              ) : (
                <div className='text-base text-user9 animate-pulse font-semibold p-2'>
                  Pesakit pulang sebelum sebarang pemeriksaan atau rawatan
                </div>
              )}
            </div>
            <div className='absolute grid grid-cols-2 bottom-0 right-0 left-0 m-2 mx-10'>
              <button
                className='capitalize bg-user9 text-userWhite rounded-md shadow-xl p-2 mr-3 hover:bg-user1 transition-all'
                onClick={confirm}
              >
                YA
              </button>
              <button
                className='capitalize bg-userWhite text-userBlack rounded-md p-2 ml-3 hover:bg-user5 transition-all'
                onClick={hide}
              >
                Tidak
              </button>
            </div>
          </div>
          <div
            onClick={hide}
            className='absolute inset-0 bg-user1 z-10 opacity-75'
          />
        </>
      )}
    </>
  );
};

export default ConfirmModal;
