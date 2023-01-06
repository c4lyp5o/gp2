import { useState } from 'react';
import {
  FaWindowClose,
  FaCheckCircle,
  FaTimesCircle,
  FaMinus,
  FaPlus,
} from 'react-icons/fa';

import styles from '../../admin/Modal.module.css';

const ConfirmModal = ({ children, data, busyBody }) => {
  const [open, setOpen] = useState(false);
  const [callback, setCallback] = useState(null);

  const [showPemeriksaan, setShowPemeriksaan] = useState(true);
  const [showRawatan, setShowRawatan] = useState(true);
  const [showPromosi, setShowPromosi] = useState(true);

  const show = (callback) => (event) => {
    event.preventDefault();
    busyBody(true);
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
    busyBody(false);
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
            <div className='grid grid-rows-[1fr_8fr_1fr] h-full'>
              <h5 className='bg-user9 text-userWhite font-semibold text-xl h-7'>
                PERHATIAN
              </h5>
              <div className='mt-1 py-1'>
                <p className='px-1 text-xs font-semibold'>
                  Anda YAKIN untuk menghantar maklumat?
                </p>
                <p className='px-1 text-xs'>
                  Maklumat yang telah dihantar tidak boleh diubah. Sila
                  berhubung dengan Pentadbir Klinik sekiranya mempunyai masalah.
                </p>
                {data.statusKehadiran === false ? (
                  <div className='h-full overflow-y-auto'>
                    <span
                      className='flex items-center bg-user1 bg-opacity-30 w-full cursor-pointer px-2 py-1 text-xs font-semibold'
                      // onClick={() => {
                      //   setShowPemeriksaan(!showPemeriksaan);
                      //   setShowRawatan(false);
                      // }}
                    >
                      {showPemeriksaan ? (
                        <FaMinus className='mr-1' />
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
                      {data.bilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Bilangan Gigi Kekal Yang Ada :
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
                            {data.eAdaGigiKekalPemeriksaanUmum ? (
                              <p className='lowercase'>
                                e: {data.eAdaGigiKekalPemeriksaanUmum}
                              </p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
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
                      {data.tidakPerluRawatanPemeriksaanUmum ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Tidak Perlu Rawatan:
                          </p>
                          <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                            TPR
                            {data.tidakPerluRawatanPemeriksaanUmum ? (
                              <FaCheckCircle className='text-user7 text-center mx-1' />
                            ) : (
                              <FaTimesCircle className='text-user9 text-center mx-1' />
                            )}
                          </p>
                        </div>
                      ) : null}
                      {data.yaTidakSediaAdaStatusDenturePemeriksaanUmum ||
                      data.yaTidakPerluStatusDenturePemeriksaanUmum ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Status Dentur:
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.yaTidakSediaAdaStatusDenturePemeriksaanUmum ? (
                              <p>
                                Sedia Ada Dentur:
                                {data.yaTidakSediaAdaStatusDenturePemeriksaanUmum ===
                                'ya-sedia-ada-status-denture-pemeriksaan-umum' ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                            {data.separaPenuhAtasSediaAdaDenturePemeriksaanUmum ===
                            'separa-atas-sedia-ada-denture-pemeriksaan-umum' ? (
                              <p>
                                -Separa Atas:
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              </p>
                            ) : null}
                            {data.separaPenuhAtasSediaAdaDenturePemeriksaanUmum ===
                            'penuh-atas-sedia-ada-denture-pemeriksaan-umum' ? (
                              <p>
                                -Penuh Atas:
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              </p>
                            ) : null}
                            {data.separaPenuhBawahSediaAdaDenturePemeriksaanUmum ===
                            'separa-bawah-sedia-ada-denture-pemeriksaan-umum' ? (
                              <p>
                                -Separa Bawah:
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              </p>
                            ) : null}
                            {data.separaPenuhBawahSediaAdaDenturePemeriksaanUmum ===
                            'penuh-bawah-sedia-ada-denture-pemeriksaan-umum' ? (
                              <p>
                                -Penuh Bawah:
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              </p>
                            ) : null}
                            {data.yaTidakPerluStatusDenturePemeriksaanUmum ? (
                              <p className='border-t border-t-user1 border-opacity-10'>
                                Perlu Dentur:
                                {data.yaTidakPerluStatusDenturePemeriksaanUmum ===
                                'ya-perlu-status-denture-pemeriksaan-umum' ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                            {data.separaPenuhAtasPerluDenturePemeriksaanUmum ===
                            'separa-atas-perlu-denture-pemeriksaan-umum' ? (
                              <p>
                                -Separa Atas:
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              </p>
                            ) : null}
                            {data.separaPenuhAtasPerluDenturePemeriksaanUmum ===
                            'penuh-atas-perlu-denture-pemeriksaan-umum' ? (
                              <p>
                                -Penuh Atas:
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              </p>
                            ) : null}
                            {data.separaPenuhBawahPerluDenturePemeriksaanUmum ===
                            'separa-bawah-perlu-denture-pemeriksaan-umum' ? (
                              <p>
                                -Separa Bawah:
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              </p>
                            ) : null}
                            {data.separaPenuhBawahPerluDenturePemeriksaanUmum ===
                            'penuh-bawah-perlu-denture-pemeriksaan-umum' ? (
                              <p>
                                -Penuh Bawah:
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
                      {data.fissureSealantPemeriksaanUmum ||
                      data.baruJumlahGigiKekalPerluFSRawatanUmum >= 1 ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Pengapan Fisur:
                          </p>
                          <p className='text-xs p-1 flex justify-start text-left items-center border-y border-y-user1 border-opacity-10'>
                            {/* {data.fissureSealantPemeriksaanUmum ? (
                              <FaCheckCircle className='text-user7 text-center mx-1' />
                            ) : (
                              <FaTimesCircle className='text-user9 text-center mx-1' />
                            )} */}
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
                            Perlu Sapuan Fluorida:{' '}
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
                      {data.prrJenis1PemeriksaanUmum ||
                      data.baruJumlahGigiKekalPerluPRRJenis1RawatanUmum >= 1 ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            PRR Jenis 1:{' '}
                          </p>
                          <p className='text-xs p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {/* {data.prrJenis1PemeriksaanUmum ? (
                              <FaCheckCircle className='text-user7 text-center mx-1' />
                            ) : (
                              <FaTimesCircle className='text-user9 text-center mx-1' />
                            )} */}
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
                            {data.disaringProgramKanserMulutPemeriksaanUmum ===
                            'ya-disaring-program-kanser-mulut-pemeriksaan-umum' ? (
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
                      {data.puncaRujukan ||
                      data.diabetesFaktorRisikoBpe ||
                      data.perokokFaktorRisikoBpe ||
                      data.lainLainFaktorRisikoBpe ||
                      data.pesakitMempunyaiImplanPergigian ||
                      data.periImplantitis ||
                      data.periImplantMucositis ||
                      data.engganBpeImplan ||
                      data.skorBpeOralHygienePemeriksaanUmum ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Pengurusan Penyakit dan kondisi periodontium serta
                            peri-implan pergigian:
                          </p>
                          <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.puncaRujukan ? (
                              <p>
                                pesakit mempunyai rujukan T2DM (
                                <i> Type II Diabetes Mellitus</i>) ?:{' '}
                                {data.puncaRujukan}
                              </p>
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
                            {/* {data.pesakitMempunyaiImplanPergigian ? (
                              <p>
                                Pesakit Mempunyai Implan Pergigian:{' '}
                                {data.pesakitMempunyaiImplanPergigian ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null} */}
                            {data.periImplantitis ? (
                              <p>
                                <i>Peri-Implantitis ≥ 6mm :</i>
                                {data.periImplantitis ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                            {data.periImplantMucositis ? (
                              <p>
                                <i>Peri-Implant Mucositis {` < `} 6mm :</i>
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
                            {data.skorBpeOralHygienePemeriksaanUmum ? (
                              <p>
                                Skor BPE :{' '}
                                {data.skorBpeOralHygienePemeriksaanUmum}
                              </p>
                            ) : null}
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
                    </div>
                    <span
                      className='flex items-center bg-user1 bg-opacity-30 w-full cursor-pointer px-2 py-1 text-xs font-semibold'
                      // onClick={() => {
                      //   setShowRawatan(!showRawatan);
                      //   setShowPemeriksaan(false);
                      // }}
                    >
                      {showRawatan ? (
                        <FaMinus className='mr-1' />
                      ) : (
                        <FaPlus className='' />
                      )}
                      RAWATAN
                    </span>
                    <div
                      className={`text-xs ${
                        showRawatan ? 'max-h-min' : 'max-h-0'
                      } overflow-hidden transition-all duration-500`}
                    >
                      {data.pesakitDibuatFissureSealant ||
                      data.baruJumlahGigiKekalDibuatFSRawatanUmum >= 1 ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Pengapan Fisur:
                          </p>
                          <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {/* {data.pesakitDibuatFissureSealant ? (
                              <p>
                                Pesakit Dibuat:
                                {data.pesakitDibuatFissureSealant === true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null} */}
                            {data.baruJumlahGigiKekalDibuatFSRawatanUmum ? (
                              <p>
                                Jumlah Gigi Kekal Dibuat:{' '}
                                {data.baruJumlahGigiKekalDibuatFSRawatanUmum}
                              </p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                      {data.pesakitDibuatFluorideVarnish ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Sapuan Florida:
                          </p>
                          <p className='p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.pesakitDibuatFluorideVarnish ? (
                              <p>
                                Pesakit Diberi:
                                {data.pesakitDibuatFluorideVarnish === true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                      {data.pesakitDibuatPRRJenis1 ||
                      data.baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum >=
                        1 ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            PRR Jenis 1:
                          </p>
                          <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {/* {data.pesakitDibuatPRRJenis1 ? (
                              <p>
                                Pesakit Diberi:
                                {data.pesakitDibuatPRRJenis1 === true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null} */}
                            {data.baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum ? (
                              <p>
                                Jumlah Gigi Kekal Diberi:{' '}
                                {
                                  data.baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum
                                }
                              </p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                      {data.cabutDesidusRawatanUmum ||
                      data.cabutKekalRawatanUmum ||
                      data.komplikasiSelepasCabutanRawatanUmum ||
                      data.cabutanDisebabkanPeriodontitisRawatanUmum ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Cabutan:
                          </p>
                          <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.cabutDesidusRawatanUmum ? (
                              <p>Desidus: {data.cabutDesidusRawatanUmum}</p>
                            ) : null}
                            {data.cabutKekalRawatanUmum ? (
                              <p>Kekal: {data.cabutKekalRawatanUmum}</p>
                            ) : null}
                            {data.komplikasiSelepasCabutanRawatanUmum ? (
                              <p>
                                Komplikasi Selepas Cabutan:{' '}
                                {data.komplikasiSelepasCabutanRawatanUmum}
                              </p>
                            ) : null}
                            {data.cabutanDisebabkanPeriodontitisRawatanUmum ? (
                              <p>
                                Cabutan Disebabkan Periodontitis:{' '}
                                {data.cabutanDisebabkanPeriodontitisRawatanUmum}
                              </p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                      {data.yaTidakAbsesPembedahanRawatanUmum ||
                      data.cabutanSurgikalPembedahanMulutRawatanUmum ||
                      data.yaTidakFrakturPembedahanRawatanUmum ||
                      data.yaTidakPembedahanKecilMulutPembedahanRawatanUmum ||
                      data.yaTidakTraumaPembedahanRawatanUmum ||
                      data.kecederaanTulangMukaUmum ||
                      data.kecederaanGigiUmum ||
                      data.kecederaanTisuLembutUmum ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Pembedahan Mulut:
                          </p>
                          <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.yaTidakAbsesPembedahanRawatanUmum ? (
                              <p>
                                Abses:{' '}
                                {data.yaTidakAbsesPembedahanRawatanUmum ===
                                true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : null}
                              </p>
                            ) : null}
                            {data.cabutanSurgikalPembedahanMulutRawatanUmum ? (
                              <p>
                                Cabutan Surgikal:{' '}
                                {data.cabutanSurgikalPembedahanMulutRawatanUmum}
                              </p>
                            ) : null}
                            {data.yaTidakFrakturPembedahanRawatanUmum ? (
                              <p>
                                Fraktur:{' '}
                                {data.yaTidakFrakturPembedahanRawatanUmum ===
                                true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : null}
                              </p>
                            ) : null}
                            {data.yaTidakPembedahanKecilMulutPembedahanRawatanUmum ? (
                              <p>
                                Pembedahan Kecil Mulut:{' '}
                                {data.yaTidakPembedahanKecilMulutPembedahanRawatanUmum ===
                                true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : null}
                              </p>
                            ) : null}
                            {data.yaTidakTraumaPembedahanRawatanUmum ? (
                              <p>
                                Trauma:{' '}
                                {data.yaTidakTraumaPembedahanRawatanUmum ===
                                true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : null}
                              </p>
                            ) : null}
                            {data.kecederaanTulangMukaUmum ? (
                              <p>
                                Kecederaan Tulang Muka:{' '}
                                {data.kecederaanTulangMukaUmum === true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                            {data.kecederaanGigiUmum ? (
                              <p>
                                Kecederaan Gigi:{' '}
                                {data.kecederaanGigiUmum === true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                            {data.kecederaanTisuLembutUmum ? (
                              <p>
                                Kecederaan Tisu Lembut:{' '}
                                {data.kecederaanTisuLembutUmum === true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                      {data.baruJumlahGigiYangDiberiSdfRawatanUmum ||
                      data.semulaJumlahGigiYangDiberiSdfRawatanUmum ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Silver Diamine Fluoride:
                          </p>
                          <p className='p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                            Baru: {data.baruJumlahGigiYangDiberiSdfRawatanUmum}
                            Semula:
                            {data.semulaJumlahGigiYangDiberiSdfRawatanUmum}
                          </p>
                        </div>
                      ) : null}
                      {data.baruJumlahCrownBridgeRawatanUmum ||
                      data.semulaJumlahCrownBridgeRawatanUmum ||
                      data.baruJumlahPostCoreRawatanUmum ||
                      data.semulaJumlahPostCoreRawatanUmum ||
                      data.baruPenuhJumlahDenturProstodontikRawatanUmum ||
                      data.semulaPenuhJumlahDenturProstodontikRawatanUmum ||
                      data.baruSeparaJumlahDenturProstodontikRawatanUmum ||
                      data.semulaSeparaJumlahDenturProstodontikRawatanUmum ||
                      data.menggunakanMakmalPergigianBergerak ||
                      data.immediateDenturProstodontikRawatanUmum ||
                      data.pembaikanDenturProstodontikRawatanUmum ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Prostodontik:
                          </p>
                          <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.baruJumlahCrownBridgeRawatanUmum ? (
                              <p>
                                Baru Crown Bridge:{' '}
                                {data.baruJumlahCrownBridgeRawatanUmum}
                              </p>
                            ) : null}
                            {data.semulaJumlahCrownBridgeRawatanUmum ? (
                              <p>
                                Semula Crown Bridge:{' '}
                                {data.semulaJumlahCrownBridgeRawatanUmum}
                              </p>
                            ) : null}
                            {data.baruJumlahPostCoreRawatanUmum ? (
                              <p>
                                Baru Post Core:{' '}
                                {data.baruJumlahPostCoreRawatanUmum}
                              </p>
                            ) : null}
                            {data.semulaJumlahPostCoreRawatanUmum ? (
                              <p>
                                Semula Post Core:{' '}
                                {data.semulaJumlahPostCoreRawatanUmum}
                              </p>
                            ) : null}
                            {data.baruPenuhJumlahDenturProstodontikRawatanUmum ? (
                              <p>
                                Baru Penuh Dentur :{' '}
                                {
                                  data.baruPenuhJumlahDenturProstodontikRawatanUmum
                                }
                              </p>
                            ) : null}
                            {data.semulaPenuhJumlahDenturProstodontikRawatanUmum ? (
                              <p>
                                Semula Penuh Dentur :{' '}
                                {
                                  data.semulaPenuhJumlahDenturProstodontikRawatanUmum
                                }
                              </p>
                            ) : null}
                            {data.baruSeparaJumlahDenturProstodontikRawatanUmum ? (
                              <p>
                                Baru Separa Dentur :{' '}
                                {
                                  data.baruSeparaJumlahDenturProstodontikRawatanUmum
                                }
                              </p>
                            ) : null}
                            {data.semulaSeparaJumlahDenturProstodontikRawatanUmum ? (
                              <p>
                                Semula Separa Dentur :{' '}
                                {
                                  data.semulaSeparaJumlahDenturProstodontikRawatanUmum
                                }
                              </p>
                            ) : null}
                            {data.menggunakanMakmalPergigianBergerak ? (
                              <p>
                                Menggunakan Makmal Pergigian Bergerak :{' '}
                                {data.menggunakanMakmalPergigianBergerak ===
                                true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                            {data.immediateDenturProstodontikRawatanUmum ? (
                              <p>
                                Immediate Dentur :{' '}
                                {data.immediateDenturProstodontikRawatanUmum}
                              </p>
                            ) : null}
                            {data.pembaikanDenturProstodontikRawatanUmum ? (
                              <p>
                                Pembaikan Dentur :{' '}
                                {data.pembaikanDenturProstodontikRawatanUmum}
                              </p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                      {data.gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum ||
                      data.gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum ||
                      data.gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum ||
                      data.gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum ||
                      data.gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum ||
                      data.gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum ||
                      data.gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum ||
                      data.gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum ||
                      data.gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum ||
                      data.gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum ||
                      data.gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum ||
                      data.gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum ||
                      data.baruInlayOnlayJumlahTampalanDibuatRawatanUmum ||
                      data.semulaInlayOnlayJumlahTampalanDibuatRawatanUmum ||
                      data.jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Jumlah Tampalan Dibuat:
                          </p>
                          <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum ? (
                              <p>
                                GD Baru Anterior Sewarna:{' '}
                                {
                                  data.gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum
                                }
                              </p>
                            ) : null}
                            {data.gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum ? (
                              <p>
                                GD Semula Anterior Sewarna:{' '}
                                {
                                  data.gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum
                                }
                              </p>
                            ) : null}
                            {data.gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum ? (
                              <p>
                                GK Baru Anterior Sewarna:{' '}
                                {
                                  data.gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum
                                }
                              </p>
                            ) : null}
                            {data.gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum ? (
                              <p>
                                GK Semula Anterior Sewarna:{' '}
                                {
                                  data.gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum
                                }
                              </p>
                            ) : null}
                            {data.gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum ? (
                              <p>
                                GD Baru Posterior Sewarna:{' '}
                                {
                                  data.gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum
                                }
                              </p>
                            ) : null}
                            {data.gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum ? (
                              <p>
                                GD Semula Posterior Sewarna:{' '}
                                {
                                  data.gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum
                                }
                              </p>
                            ) : null}
                            {data.gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum ? (
                              <p>
                                GK Baru Posterior Sewarna:{' '}
                                {
                                  data.gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum
                                }
                              </p>
                            ) : null}
                            {data.gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum ? (
                              <p>
                                GK Semula Posterior Sewarna:{' '}
                                {
                                  data.gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum
                                }
                              </p>
                            ) : null}
                            {data.gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum ? (
                              <p>
                                GD Baru Posterior Amalgam:{' '}
                                {
                                  data.gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum
                                }
                              </p>
                            ) : null}
                            {data.gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum ? (
                              <p>
                                GD Semula Posterior Amalgam:{' '}
                                {
                                  data.gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum
                                }
                              </p>
                            ) : null}
                            {data.gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum ? (
                              <p>
                                GK Baru Posterior Amalgam:{' '}
                                {
                                  data.gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum
                                }
                              </p>
                            ) : null}
                            {data.gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum ? (
                              <p>
                                GK Semula Posterior Amalgam:{' '}
                                {
                                  data.gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum
                                }
                              </p>
                            ) : null}
                            {data.baruInlayOnlayJumlahTampalanDibuatRawatanUmum ? (
                              <p>
                                Baru Inlay Onlay:{' '}
                                {
                                  data.baruInlayOnlayJumlahTampalanDibuatRawatanUmum
                                }
                              </p>
                            ) : null}
                            {data.semulaInlayOnlayJumlahTampalanDibuatRawatanUmum ? (
                              <p>
                                Semula Inlay Onlay:{' '}
                                {
                                  data.semulaInlayOnlayJumlahTampalanDibuatRawatanUmum
                                }
                              </p>
                            ) : null}
                            {data.jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum ? (
                              <p>
                                Jumlah Tampalan Sementara:{' '}
                                {
                                  data.jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum
                                }
                              </p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                      {data.kaunselingDiet ||
                      data.nasihatBerhentiMerokok ||
                      data.lainLainPengurusanFaktorRisiko ||
                      data.ohePengurusanFaktorSetempat ||
                      data.pengilapanTampalanRungkup ||
                      data.adjustasiOklusi ||
                      data.cabutanPengurusanFaktorSetempat ||
                      data.ektiparsiPulpa ||
                      data.rawatanLainPeriodontikRawatanUmum ||
                      data.rujukanPakarPeriodontik ||
                      data.engganLainRujukanPakarPeriodontik ||
                      data.rujukanPakarScd ||
                      data.rujukanPakarUpkka ||
                      data.kesSelesaiPeriodontium ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Terapi Periodontium
                          </p>
                          <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {/* {data.kaunselingDiet ? (
                              <p>
                                Kaunseling Diet:{' '}
                                {data.kaunselingDiet === true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null} */}
                            {data.nasihatBerhentiMerokok ? (
                              <p>
                                Nasihat Berhenti Merokok:{' '}
                                {data.nasihatBerhentiMerokok === true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                            {data.lainLainPengurusanFaktorRisiko ? (
                              <p>
                                Lain-Lain Pengurusan Faktor Risiko:{' '}
                                {data.lainLainPengurusanFaktorRisiko ===
                                true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                            {/* {data.ohePengurusanFaktorSetempat ? (
                              <p>
                                OHE Pengurusan Faktor Setempat:{' '}
                                {data.ohePengurusanFaktorSetempat === true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null} */}
                            {data.pengilapanTampalanRungkup ? (
                              <p>
                                Pengilapan Tampalan Rungkup:{' '}
                                {data.pengilapanTampalanRungkup === true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                            {data.adjustasiOklusi ? (
                              <p>
                                Adjustasi Oklusi:{' '}
                                {data.adjustasiOklusi === true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                            {data.cabutanPengurusanFaktorSetempat ? (
                              <p>
                                Cabutan Pengurusan Faktor Setempat:{' '}
                                {data.cabutanPengurusanFaktorSetempat ===
                                true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                            {data.ektiparsiPulpa ? (
                              <p>
                                Ekstirpasi Disebabkan Periodontitis :
                                {data.ektiparsiPulpa === true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                            {data.rawatanLainPeriodontikRawatanUmum ? (
                              <p>
                                Lain-lain:{' '}
                                {data.rawatanLainPeriodontikRawatanUmum ===
                                true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                            {data.rujukanPakarPeriodontik ? (
                              <p>
                                Rujukan Pakar Periodontik:{' '}
                                {data.rujukanPakarPeriodontik ===
                                'ya-rujukan-pakar-periodontik' ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : null}
                                {data.rujukanPakarPeriodontik ===
                                'tidak-rujukan-pakar-periodontik' ? (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                ) : null}
                              </p>
                            ) : null}
                            {data.engganLainRujukanPakarPeriodontik ===
                            'enggan-rujukan-pakar-periodontik' ? (
                              <p>
                                Enggan Rujukan Pakar Periodontik:{' '}
                                {data.engganLainRujukanPakarPeriodontik ===
                                'enggan-rujukan-pakar-periodontik' ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : null}
                              </p>
                            ) : null}
                            {data.engganLainRujukanPakarPeriodontik ===
                            'lain-lain-rujukan-pakar-periodontik' ? (
                              <p>
                                Lain-lain Rujukan Pakar Periodontik:{' '}
                                {data.engganLainRujukanPakarPeriodontik ===
                                'lain-lain-rujukan-pakar-periodontik' ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : null}
                              </p>
                            ) : null}
                            {data.rujukanPakarScd ? (
                              <p>
                                Rujukan Pakar Pergigian Penjagaan Khas:{' '}
                                {data.rujukanPakarScd === true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                            {data.rujukanPakarUpkka ? (
                              <p>
                                Rujukan Pakar Pergigian Kesihatan Awam :
                                {data.rujukanPakarUpkka === true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                            {data.kesSelesaiPeriodontium ? (
                              <p>
                                Kes Selesai Periodontium:
                                {data.kesSelesaiPeriodontium === true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                      {data.rawatanOrtodontikRawatanUmum ||
                      data.kesPerubatanMulutRawatanUmum ||
                      data.rawatanLainPeriodontik ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Rawatan Lain
                          </p>
                          <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.rawatanOrtodontikRawatanUmum === true ? (
                              <p>
                                Rawatan Ortodontik:{' '}
                                {data.rawatanOrtodontikRawatanUmum === true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                            {data.kesPerubatanMulutRawatanUmum === true ? (
                              <p>
                                Kes Perubatan Mulut:{' '}
                                {data.kesPerubatanMulutRawatanUmum === true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                            {data.rawatanLainPeriodontik === true ? (
                              <p>
                                Rawatan Lain Periodontik:{' '}
                                {data.rawatanLainPeriodontik === true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                      {data.bilanganXrayYangDiambilRawatanUmum ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Bilangan X-Ray Yang Diambil
                          </p>
                          <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.bilanganXrayYangDiambilRawatanUmum}
                          </p>
                        </div>
                      ) : null}
                      {data.jumlahAnteriorKesEndodontikSelesaiRawatanUmum ||
                      data.jumlahPremolarKesEndodontikSelesaiRawatanUmum ||
                      data.jumlahMolarKesEndodontikSelesaiRawatanUmum ||
                      data.rawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum ||
                      data.jumlahAnteriorRawatanSemulaKeppRawatanUmum ||
                      data.jumlahPremolarRawatanSemulaKeppRawatanUmum ||
                      data.jumlahMolarRawatanSemulaKeppRawatanUmum ? (
                        <div className='grid grid-cols-[1fr_2fr]'>
                          <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Kes Endodontik Selesai
                          </p>
                          <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.jumlahAnteriorKesEndodontikSelesaiRawatanUmum ? (
                              <p>
                                Jumlah Anterior:{' '}
                                {
                                  data.jumlahAnteriorKesEndodontikSelesaiRawatanUmum
                                }
                              </p>
                            ) : null}
                            {data.jumlahPremolarKesEndodontikSelesaiRawatanUmum ? (
                              <p>
                                Jumlah Premolar:{' '}
                                {
                                  data.jumlahPremolarKesEndodontikSelesaiRawatanUmum
                                }
                              </p>
                            ) : null}
                            {data.jumlahMolarKesEndodontikSelesaiRawatanUmum ? (
                              <p>
                                Jumlah Molar:{' '}
                                {
                                  data.jumlahMolarKesEndodontikSelesaiRawatanUmum
                                }
                              </p>
                            ) : null}
                            {data.rawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum ? (
                              <p>
                                Rawatan Semula Endodontik Dari Primer:{' '}
                                {
                                  data.rawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum
                                }
                              </p>
                            ) : null}
                            {data.jumlahAnteriorRawatanSemulaKeppRawatanUmum ? (
                              <p>
                                Jumlah Anterior:{' '}
                                {
                                  data.jumlahAnteriorRawatanSemulaKeppRawatanUmum
                                }
                              </p>
                            ) : null}
                            {data.jumlahPremolarRawatanSemulaKeppRawatanUmum ? (
                              <p>
                                Jumlah Premolar:{' '}
                                {
                                  data.jumlahPremolarRawatanSemulaKeppRawatanUmum
                                }
                              </p>
                            ) : null}
                            {data.jumlahMolarRawatanSemulaKeppRawatanUmum ? (
                              <p>
                                Jumlah Molar:{' '}
                                {data.jumlahMolarRawatanSemulaKeppRawatanUmum}
                              </p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                      {data.memenuhiRditnKod3KesRujukUpprRawatanUmum ||
                      data.restorasiPascaEndodontikKesRujukUpprRawatanUmum ||
                      data.komplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum ? (
                        <div className='grid grid-cols-[1fr_2fr] text-xs'>
                          <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            kes rujuk Unit Pakar Pergigian Restoratif
                          </p>
                          <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.memenuhiRditnKod3KesRujukUpprRawatanUmum ? (
                              <p>
                                Memenuhi Rditn Kod 3:{' '}
                                {data.memenuhiRditnKod3KesRujukUpprRawatanUmum ===
                                true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                            {data.restorasiPascaEndodontikKesRujukUpprRawatanUmum ? (
                              <p>
                                Restorasi Pasca Endodontik:{' '}
                                {data.restorasiPascaEndodontikKesRujukUpprRawatanUmum ===
                                true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                            {data.komplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum ? (
                              <p>
                                Komplikasi Semasa Rawatan Kepp:{' '}
                                {data.komplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum ===
                                true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                      {data.penskaleranRawatanUmum ? (
                        <div className='grid grid-cols-[1fr_2fr] text-xs'>
                          <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Penskaleran
                          </p>
                          <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.penskaleranRawatanUmum === true ? (
                              <p>
                                Penskaleran
                                {data.penskaleranRawatanUmum === true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                      {data.rujukanPakarBedahMulut ||
                      data.rujukanPakarOrtodontik ||
                      data.rujukanPakarPatologiMulutDanPerubatanMulut ||
                      data.rujukanPakarPergigianPediatrik ? (
                        <div className='grid grid-cols-[1fr_2fr] text-xs'>
                          <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Rujukan
                          </p>
                          <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.rujukanPakarOrtodontik ? (
                              <p>
                                Rujukan Pakar Ortodontik:{' '}
                                {data.rujukanPakarOrtodontik === true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                            {data.rujukanPakarBedahMulut ? (
                              <p>
                                Rujukan Pakar Bedah Mulut dan Maksilofasial:{' '}
                                {data.rujukanPakarBedahMulut === true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                            {data.rujukanPakarPatologiMulutDanPerubatanMulut ? (
                              <p>
                                Rujukan Pakar Patologi Mulut Dan Perubatan
                                Mulut:{' '}
                                {data.rujukanPakarPatologiMulutDanPerubatanMulut ===
                                true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                            {data.rujukanPakarPergigianPediatrik ? (
                              <p>
                                Rujukan Pakar Pergigian Pediatrik:{' '}
                                {data.rujukanPakarPergigianPediatrik ===
                                true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                      {data.kesSelesaiRawatanUmum ? (
                        <div className='grid grid-cols-[1fr_2fr] text-xs'>
                          <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Kes Selesai
                          </p>
                          <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.kesSelesaiRawatanUmum === true ? (
                              <p>
                                Kes Selesai:
                                {data.kesSelesaiRawatanUmum === true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                      {data.rawatanDibuatOperatorLain ? (
                        <div className='grid grid-cols-[1fr_2fr] text-xs'>
                          <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Rawatan Dibuat Oleh Operator Lain
                          </p>
                          <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.rawatanDibuatOperatorLain === true ? (
                              <p>
                                Rawatan Dibuat Oleh Operator Lain:
                                {data.rawatanDibuatOperatorLain === true ? (
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

                    <span className='flex items-center bg-user1 bg-opacity-30 w-full cursor-pointer px-2 py-1 text-xs font-semibold'>
                      {showPromosi ? (
                        <FaMinus className='mr-1' />
                      ) : (
                        <FaPlus className='' />
                      )}
                      PROMOSI & PENDIDIKAN KESIHATAN PERGIGIAN
                    </span>
                    <div
                      className={`text-xs ${
                        showPromosi ? 'max-h-min' : 'max-h-0'
                      } overflow-hidden transition-all duration-500`}
                    >
                      {data.melaksanakanAktivitiBeginPromosiUmum ? (
                        <div className='grid grid-cols-[1fr_2fr] text-xs'>
                          <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            BEGIN
                          </p>
                          <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.melaksanakanAktivitiBeginPromosiUmum ===
                            'ya-melaksanakan-aktiviti-begin-promosi-umum' ? (
                              <p>
                                Melaksanakan Aktiviti:
                                {data.melaksanakanAktivitiBeginPromosiUmum ===
                                'ya-melaksanakan-aktiviti-begin-promosi-umum' ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                      {data.lawatanKeRumahPromosiUmum ? (
                        <div className='grid grid-cols-[1fr_2fr] text-xs'>
                          <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            Lawatan Ke Rumah
                          </p>
                          <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.lawatanKeRumahPromosiUmum ===
                            'ya-lawatan-ke-rumah-promosi-umum' ? (
                              <p>
                                Lawatan Ke Rumah:
                                {data.lawatanKeRumahPromosiUmum ===
                                'ya-lawatan-ke-rumah-promosi-umum' ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                      {data.plakGigiNasihatPergigianIndividuPromosiUmum ||
                      data.penjagaanKesihatanOralNasihatPergigianIndividuPromosiUmum ||
                      data.dietPemakananNasihatPergigianIndividuPromosiUmum ||
                      data.kanserMulutNasihatPergigianIndividuPromosiUmum ? (
                        <div className='grid grid-cols-[1fr_2fr] text-xs'>
                          <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            menerima nasihat kesihatan pergigian individu
                          </p>
                          <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.plakGigiNasihatPergigianIndividuPromosiUmum ===
                            true ? (
                              <p>
                                Plak Gigi:
                                {data.plakGigiNasihatPergigianIndividuPromosiUmum ===
                                true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                            {data.penjagaanKesihatanOralNasihatPergigianIndividuPromosiUmum ===
                            true ? (
                              <p>
                                Penjagaan Kesihatan Oral:
                                {data.penjagaanKesihatanOralNasihatPergigianIndividuPromosiUmum ===
                                true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                            {data.dietPemakananNasihatPergigianIndividuPromosiUmum ===
                            true ? (
                              <p>
                                Diet Pemakanan:
                                {data.dietPemakananNasihatPergigianIndividuPromosiUmum ===
                                true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                            {data.kanserMulutNasihatPergigianIndividuPromosiUmum ===
                            true ? (
                              <p>
                                Kanser Mulut:
                                {data.kanserMulutNasihatPergigianIndividuPromosiUmum ===
                                true ? (
                                  <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                ) : (
                                  <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                )}
                              </p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                      {data.umur1517BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum ||
                      data.umur1819BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum ||
                      data.umur2029BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum ||
                      data.umur3049BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum ||
                      data.umur5059BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum ||
                      data.umur60KeAtasBilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum ? (
                        <div className='grid grid-cols-[1fr_2fr] text-xs'>
                          <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            bilangan ibu bapa / penjaga diberi anticipatory
                            guidance (AG)
                          </p>
                          <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.umur1517BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum ? (
                              <p>
                                Umur 15-17:
                                {
                                  data.umur1517BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum
                                }
                              </p>
                            ) : null}
                            {data.umur1819BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum ? (
                              <p>
                                Umur 18-19:
                                {
                                  data.umur1819BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum
                                }
                              </p>
                            ) : null}
                            {data.umur2029BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum ? (
                              <p>
                                Umur 20-29:
                                {
                                  data.umur2029BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum
                                }
                              </p>
                            ) : null}
                            {data.umur3049BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum ? (
                              <p>
                                Umur 30-49:
                                {
                                  data.umur3049BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum
                                }
                              </p>
                            ) : null}
                            {data.umur5059BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum ? (
                              <p>
                                Umur 50-59:
                                {
                                  data.umur5059BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum
                                }
                              </p>
                            ) : null}

                            {data.umur60KeAtasBilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum ? (
                              <p>
                                Umur 60 ke atas:
                                {
                                  data.umur60KeAtasBilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum
                                }
                              </p>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                      {data.dirujukKaunselingPakarPublicHealthPromosiUmum ? (
                        <div className='grid grid-cols-[1fr_2fr] text-xs'>
                          <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                            dirujuk kaunseling Pakar Kesihatan Awam
                          </p>
                          <p className='p-1 flex justify-start text-left border-y border-y-user1 border-opacity-10'>
                            {data.dirujukKaunselingPakarPublicHealthPromosiUmum ===
                            true ? (
                              <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                            ) : (
                              <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                            )}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div className='text-base text-user9 animate-pulse font-semibold p-2'>
                    Pesakit pulang sebelum sebarang pemeriksaan atau rawatan
                  </div>
                )}
              </div>
              <div className='sticky grid grid-cols-2 bottom-0 right-0 left-0 m-2 mx-10 bg-userWhite px-5 py-2'>
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
