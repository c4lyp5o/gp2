import { useState } from 'react';
import {
  FaWindowClose,
  FaCheckCircle,
  FaTimesCircle,
  FaMinus,
  FaPlus,
} from 'react-icons/fa';

const ConfirmModal = ({ children, data }) => {
  const [open, setOpen] = useState(false);
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
  };

  return (
    <>
      {children(show)}
      {open && (
        <>
          <div className='absolute inset-x-0 inset-y-0 lg:inset-x-1/3 lg:inset-y-6 text-sm bg-userWhite z-20 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'>
            <FaWindowClose
              onClick={closeModal}
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
                <span className='flex items-center bg-user1 bg-opacity-30 w-full cursor-pointer px-2 py-1 text-xs font-semibold'>
                  <FaMinus className='mr-1' />
                  RAWATAN
                </span>
                {data.engganTidakHadirRawatan ? (
                  <p>
                    Pesakit
                    {data.engganTidakHadirRawatan === 'enggan-rawatan' ? (
                      <span className='text-user9'>ENGGAN</span>
                    ) : null}
                    {data.engganTidakHadirRawatan === 'tidak-hadir-rawatan' ? (
                      <span className='text-user9'>TIDAK HADIR</span>
                    ) : null}
                    untuk rawatan
                  </p>
                ) : (
                  <div className='text-xs overflow-y-auto'>
                    {data.muridDibuatFs ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Pengapan Fisur:
                        </p>
                        <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {data.muridDibuatFs ? (
                            <p>
                              Pesakit Dibuat:
                              {data.muridDibuatFs ? (
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              ) : (
                                <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                              )}
                            </p>
                          ) : null}
                          {data.baruJumlahGigiKekalDibuatFs ? (
                            <p>
                              Jumlah Gigi Kekal Dibuat:
                              {data.baruJumlahGigiKekalDibuatFs}
                            </p>
                          ) : null}
                        </p>
                      </div>
                    ) : null}
                    {data.muridDiberiFv ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Sapuan Florida (FV):
                        </p>
                        <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {data.muridDiberiFv ? (
                            <p>
                              Pesakit Diberi:
                              {data.muridDiberiFv ? (
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              ) : (
                                <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                              )}
                            </p>
                          ) : null}
                        </p>
                      </div>
                    ) : null}
                    {data.muridDiberiPrrJenis1 ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Pengapian Resin (PRR):
                        </p>
                        <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {data.muridDiberiPrrJenis1 ? (
                            <p>
                              Pesakit Diberi:
                              {data.muridDiberiPrrJenis1 ? (
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              ) : (
                                <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                              )}
                            </p>
                          ) : null}
                          {data.baruJumlahGigiKekalDiberiPrrJenis1 ? (
                            <p>
                              Jumlah Gigi Kekal Diberi:
                              {data.baruJumlahGigiKekalDiberiPrrJenis1}
                            </p>
                          ) : null}
                        </p>
                      </div>
                    ) : null}
                    {data.gdBaruAnteriorSewarnaJumlahTampalanDibuat ||
                    data.gdSemulaAnteriorSewarnaJumlahTampalanDibuat ||
                    data.gkBaruAnteriorSewarnaJumlahTampalanDibuat ||
                    data.gkSemulaAnteriorSewarnaJumlahTampalanDibuat ||
                    data.gdBaruPosteriorSewarnaJumlahTampalanDibuat ||
                    data.gdSemulaPosteriorSewarnaJumlahTampalanDibuat ||
                    data.gkBaruPosteriorSewarnaJumlahTampalanDibuat ||
                    data.gkSemulaPosteriorSewarnaJumlahTampalanDibuat ||
                    data.gdBaruPosteriorAmalgamJumlahTampalanDibuat ||
                    data.gdSemulaPosteriorAmalgamJumlahTampalanDibuat ||
                    data.gkBaruPosteriorAmalgamJumlahTampalanDibuat ||
                    data.gkSemulaPosteriorAmalgamJumlahTampalanDibuat ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Jumlah Tampalan Dibuat:
                        </p>
                        <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {data.gdBaruAnteriorSewarnaJumlahTampalanDibuat ? (
                            <p>
                              GD Baru Anterior Sewarna:{' '}
                              {data.gdBaruAnteriorSewarnaJumlahTampalanDibuat}
                            </p>
                          ) : null}
                          {data.gdSemulaAnteriorSewarnaJumlahTampalanDibuat ? (
                            <p>
                              GD Semula Anterior Sewarna:{' '}
                              {data.gdSemulaAnteriorSewarnaJumlahTampalanDibuat}
                            </p>
                          ) : null}
                          {data.gkBaruAnteriorSewarnaJumlahTampalanDibuat ? (
                            <p>
                              GK Baru Anterior Sewarna:{' '}
                              {data.gkBaruAnteriorSewarnaJumlahTampalanDibuat}
                            </p>
                          ) : null}
                          {data.gkSemulaAnteriorSewarnaJumlahTampalanDibuat ? (
                            <p>
                              GK Semula Anterior Sewarna:{' '}
                              {data.gkSemulaAnteriorSewarnaJumlahTampalanDibuat}
                            </p>
                          ) : null}
                          {data.gdBaruPosteriorSewarnaJumlahTampalanDibuat ? (
                            <p>
                              GD Baru Posterior Sewarna:{' '}
                              {data.gdBaruPosteriorSewarnaJumlahTampalanDibuat}
                            </p>
                          ) : null}
                          {data.gdSemulaPosteriorSewarnaJumlahTampalanDibuat ? (
                            <p>
                              GD Semula Posterior Sewarna:{' '}
                              {
                                data.gdSemulaPosteriorSewarnaJumlahTampalanDibuat
                              }
                            </p>
                          ) : null}
                          {data.gkBaruPosteriorSewarnaJumlahTampalanDibuat ? (
                            <p>
                              GK Baru Posterior Sewarna:{' '}
                              {data.gkBaruPosteriorSewarnaJumlahTampalanDibuat}
                            </p>
                          ) : null}
                          {data.gkSemulaPosteriorSewarnaJumlahTampalanDibuat ? (
                            <p>
                              GK Semula Posterior Sewarna:{' '}
                              {
                                data.gkSemulaPosteriorSewarnaJumlahTampalanDibuat
                              }
                            </p>
                          ) : null}
                          {data.gdBaruPosteriorAmalgamJumlahTampalanDibuat ? (
                            <p>
                              GD Baru Posterior Amalgam:{' '}
                              {data.gdBaruPosteriorAmalgamJumlahTampalanDibuat}
                            </p>
                          ) : null}
                          {data.gdSemulaPosteriorAmalgamJumlahTampalanDibuat ? (
                            <p>
                              GD Semula Posterior Amalgam:{' '}
                              {
                                data.gdSemulaPosteriorAmalgamJumlahTampalanDibuat
                              }
                            </p>
                          ) : null}
                          {data.gkBaruPosteriorAmalgamJumlahTampalanDibuat ? (
                            <p>
                              GK Baru Posterior Amalgam:{' '}
                              {data.gkBaruPosteriorAmalgamJumlahTampalanDibuat}
                            </p>
                          ) : null}
                          {data.gkSemulaPosteriorAmalgamJumlahTampalanDibuat ? (
                            <p>
                              GK Semula Posterior Amalgam:{' '}
                              {
                                data.gkSemulaPosteriorAmalgamJumlahTampalanDibuat
                              }
                            </p>
                          ) : null}
                        </p>
                      </div>
                    ) : null}
                    {data.cabutDesidusSekolahRawatan ||
                    data.cabutKekalSekolahRawatan ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Cabutan :
                        </p>
                        <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {data.cabutDesidusSekolahRawatan ? (
                            <p>Desidus: {data.cabutDesidusSekolahRawatan}</p>
                          ) : null}
                          {data.cabutKekalSekolahRawatan ? (
                            <p>Kekal: {data.cabutKekalSekolahRawatan}</p>
                          ) : null}
                        </p>
                      </div>
                    ) : null}
                    {data.jumlahTampalanSementaraSekolahRawatan ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Tampalan Sementara:
                        </p>
                        <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {data.jumlahTampalanSementaraSekolahRawatan}
                        </p>
                      </div>
                    ) : null}
                    {data.pulpotomiSekolahRawatan ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Pulpotomi :
                        </p>
                        <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {data.pulpotomiSekolahRawatan}
                        </p>
                      </div>
                    ) : null}
                    {data.endodontikSekolahRawatan ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Endodontik :
                        </p>
                        <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {data.endodontikSekolahRawatan}
                        </p>
                      </div>
                    ) : null}
                    {data.absesSekolahRawatan ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Abses :
                        </p>
                        <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {data.absesSekolahRawatan}
                        </p>
                      </div>
                    ) : null}
                    {data.penskaleranSekolahRawatan ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Penskaleran :
                        </p>
                        <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {data.penskaleranSekolahRawatan}
                        </p>
                      </div>
                    ) : null}
                    {data.kesSelesaiSekolahRawatan ||
                    data.rujukSekolahRawatan ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Status Rawatan :
                        </p>
                        <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {data.kesSelesaiSekolahRawatan ? (
                            <p>
                              Kes Selesai
                              {data.kesSelesaiSekolahRawatan === true ? (
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              ) : (
                                <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                              )}
                            </p>
                          ) : null}
                          {data.kesSelesaiIcdasSekolahRawatan ? (
                            <p>
                              Kes Selesai ICDAS:
                              {data.kesSelesaiIcdasSekolahRawatan === true ? (
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              ) : (
                                <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                              )}
                            </p>
                          ) : null}
                          {data.rujukSekolahRawatan ? (
                            <p>
                              Rujuk:
                              {data.rujukSekolahRawatan === true ? (
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              ) : (
                                <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                              )}
                              untuk{' '}
                              {data.rujukCabutanGigiKekalSekolahRawatan === true
                                ? 'cabutan ,'
                                : ''}
                              {data.rujukRawatanEndodontikSekolahRawatan ===
                              true
                                ? 'rawatan endodontik ,'
                                : ''}
                              {data.rujukRawatanOrtodontikSekolahRawatan ===
                              true
                                ? 'rawatan penskaleran ,'
                                : ''}
                              {data.rujukRawatanPeriodontikSekolahRawatan ===
                              true
                                ? 'rawatan periodontik ,'
                                : ''}
                              {data.rujukLainLainSekolahRawatan === true
                                ? data.rujukLainLainTulisSekolahRawatan
                                : ''}
                            </p>
                          ) : null}
                        </p>
                      </div>
                    ) : null}
                    {data.yaTidakMelaksanakanAktivitiBeginPromosiSekolahRawatan ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          Aktiviti Begin :
                        </p>
                        <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {data.yaTidakMelaksanakanAktivitiBeginPromosiSekolahRawatan ===
                          'ya-melaksanakan-aktiviti-begin-promosi-penyata-akhir-2' ? (
                            <p>
                              Ya, Melaksanakan Aktiviti Begin Promosi
                              <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                            </p>
                          ) : (
                            <p>
                              Tidak, Melaksanakan Aktiviti Begin Promosi
                              <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                            </p>
                          )}
                        </p>
                      </div>
                    ) : null}
                    {data.plakGigiNasihatPergigianIndividuPromosiSekolahRawatan ||
                    data.dietPemakananNasihatPergigianIndividuPromosiSekolahRawatan ||
                    data.penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan ||
                    data.kanserMulutNasihatPergigianIndividuPromosiSekolahRawatan ? (
                      <div className='grid grid-cols-[1fr_2fr]'>
                        <p className='p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                          menerima aktiviti nasihat pergigian individu :
                        </p>
                        <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                          {data.plakGigiNasihatPergigianIndividuPromosiSekolahRawatan ? (
                            <p>
                              nasihat berkaitan plak gigi
                              {data.plakGigiNasihatPergigianIndividuPromosiSekolahRawatan ===
                              true ? (
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              ) : (
                                <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                              )}
                            </p>
                          ) : null}
                          {data.dietPemakananNasihatPergigianIndividuPromosiSekolahRawatan ? (
                            <p>
                              nasihat berkaitan diet pemakanan
                              {data.dietPemakananNasihatPergigianIndividuPromosiSekolahRawatan ===
                              true ? (
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              ) : (
                                <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                              )}
                            </p>
                          ) : null}
                          {data.penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan ? (
                            <p>
                              nasihat berkaitan penjagaan kesihatan oral
                              {data.penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan ===
                              true ? (
                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                              ) : (
                                <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                              )}
                            </p>
                          ) : null}
                          {data.kanserMulutNasihatPergigianIndividuPromosiSekolahRawatan ? (
                            <p>
                              nasihat berkaitan kanser mulut
                              {data.kanserMulutNasihatPergigianIndividuPromosiSekolahRawatan ===
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
                  onClick={closeModal}
                >
                  Tidak
                </button>
              </div>
            </div>
          </div>
          <div
            onClick={closeModal}
            className='fixed inset-0 bg-userBlack opacity-50 z-10'
          />
        </>
      )}
    </>
  );
};

export default ConfirmModal;
