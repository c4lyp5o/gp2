import { useState } from 'react';
import {
  FaWindowClose,
  FaCheckCircle,
  FaTimesCircle,
  FaMinus,
  FaPlus,
} from 'react-icons/fa';

const UserFormPromosiConfirmation = ({ children, data }) => {
  const [open, setOpen] = useState(false);
  const [callback, setCallback] = useState(null);

  const [showPemeriksaan, setShowPemeriksaan] = useState(true);
  const [showRawatan, setShowRawatan] = useState(true);
  const [showPromosi, setShowPromosi] = useState(true);

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
            <div className='grid grid-rows-[1fr_8fr_1fr] h-full'>
              <h5 className='bg-user9 text-userWhite font-semibold text-xl h-7'>
                PERHATIAN
              </h5>
              <div className='mt-3 py-1'>
                <p className='px-1 text-xs font-semibold'>
                  Anda YAKIN untuk menghantar maklumat?
                </p>
                <div className='h-full overflow-y-auto'>
                  <span className='flex justify-center items-center bg-user1 bg-opacity-30 w-full cursor-pointer px-2 py-1 text-xs font-semibold'>
                    Maklumat Yang Diisi
                  </span>
                  <div className='text-xs overflow-hidden transition-all duration-500'>
                    {' '}
                    <p>Kod Program: {data.kodProgram}</p>
                    <p>Nama Acara: {data.namaAcara}</p>
                    <p>Lokasi: {data.lokasi}</p>
                    <p>
                      {data.promosiIndividu ? (
                        <p className='bg-user7 text-userWhite text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap mt-1 mb-1'>
                          Promosi Individu
                        </p>
                      ) : (
                        <p className='bg-user7 text-userWhite text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap mt-1 mb-1'>
                          Promosi Klinik
                        </p>
                      )}
                    </p>
                    <div className='grid grid-cols-2'>
                      <div>
                        {data.mediaMassa === 'media-massa-ya' && (
                          <div>
                            <p className='bg-kaunter2 font-semibold rounded-md'>
                              Media Massa
                            </p>
                            <p>Aktiviti Cetak: {data.bilanganAktivitiCetak}</p>
                            <p>Aktiviti Radio: {data.bilanganAktivitiRadio}</p>
                            <p>Peserta Radio: {data.bilanganPesertaRadio}</p>
                            <p>
                              Aktiviti Televisyen:{' '}
                              {data.bilanganAktivitiTelevisyen}
                            </p>
                            <p>
                              Peserta Televisyen:{' '}
                              {data.bilanganPesertaTelevisyen}
                            </p>
                          </div>
                        )}
                        {data.ceramahBahagianA && data.baruCeramahBahagianA && (
                          <div>
                            <p className='bg-kaunter2 font-semibold rounded-md'>
                              Ceramah Baru
                            </p>
                            <p>
                              Bil. Aktiviti Ceramah Baru:{' '}
                              {data.bilanganAktivitiBaruCeramahBahagianA}
                            </p>
                            <p>
                              Bil. Peserta Ceramah Baru:{' '}
                              {data.bilanganPesertaBaruCeramahBahagianA}
                            </p>
                          </div>
                        )}
                        {data.ceramahBahagianA &&
                          data.ulangCeramahBahagianA && (
                            <div>
                              <p className='bg-kaunter2 font-semibold rounded-md'>
                                Ceramah Ulangan
                              </p>
                              <p>
                                Bil. Aktiviti Ceramah Ulangan:
                                {data.bilanganAktivitiUlangCeramahBahagianA}
                              </p>
                              <p>
                                Bil. Peserta Ceramah Ulangan:{' '}
                                {data.bilanganPesertaUlangCeramahBahagianA}
                              </p>
                            </div>
                          )}
                        {data.latihanMemberusGigiBahagianA &&
                          data.baruLatihanMemberusGigiBahagianA && (
                            <div>
                              <p className='bg-kaunter2 font-semibold rounded-md'>
                                LMG Baru
                              </p>
                              <p>
                                Bil. Aktiviti LMG Baru:{' '}
                                {
                                  data.bilanganAktivitiBaruLatihanMemberusGigiBahagianA
                                }
                              </p>
                              <p>
                                Bil. Peserta LMG Baru:{' '}
                                {
                                  data.bilanganPesertaBaruLatihanMemberusGigiBahagianA
                                }
                              </p>
                            </div>
                          )}
                        {data.latihanMemberusGigiBahagianA &&
                          data.ulangLatihanMemberusGigiBahagianA && (
                            <div>
                              <p className='bg-kaunter2 font-semibold rounded-md'>
                                LMG Ulangan
                              </p>
                              <p>
                                Bil. Aktiviti LMG Ulangan:{' '}
                                {
                                  data.bilanganAktivitiUlangLatihanMemberusGigiBahagianA
                                }
                              </p>
                              <p>
                                Bil. Peserta LMG Ulangan:{' '}
                                {
                                  data.bilanganPesertaUlangLatihanMemberusGigiBahagianA
                                }
                              </p>
                            </div>
                          )}
                        {data.berceritaBahagianB && (
                          <div>
                            <p className='bg-kaunter2 font-semibold rounded-md'>
                              Bercerita
                            </p>
                            <p>
                              Bil. Aktiviti Bercerita:{' '}
                              {data.bilanganAktivitiBerceritaBahagianB}
                            </p>
                            <p>
                              Bil. Peserta Bercerita:{' '}
                              {data.bilanganPesertaBerceritaBahagianB}
                            </p>
                          </div>
                        )}
                        {data.dentalBuskerBahagianB && (
                          <div>
                            <p className='bg-kaunter2 font-semibold rounded-md'>
                              Dental Busker
                            </p>
                            <p>
                              Bil. Aktiviti Dental Buskers:{' '}
                              {data.bilanganAktivitiDentalBuskerBahagianB}
                            </p>
                            <p>
                              Bil. Peserta Dental Buskers:{' '}
                              {data.bilanganPesertaDentalBuskerBahagianB}
                            </p>
                          </div>
                        )}
                        {data.dietPemakananNasihatKesihatanPergigianBahagianB && (
                          <div>
                            <p className='bg-kaunter2 font-semibold rounded-md'>
                              Nasihat Pemakanan
                            </p>
                            <p>
                              Bil. Aktiviti Diet Pemakanan:{' '}
                              {data.bilanganAktivitiDietPemakananBahagianB}
                            </p>
                            <p>
                              Bil. Peserta Diet Pemakanan:{' '}
                              {data.bilanganPesertaDietPemakananBahagianB}
                            </p>
                          </div>
                        )}
                        {data.flashmobBahagianB && (
                          <div>
                            <p className='bg-kaunter2 font-semibold rounded-md'>
                              Flash Mob
                            </p>
                            <p>
                              Bil. Aktiviti Flash Mob:{' '}
                              {data.bilanganAktivitiFlashmobBahagianB}
                            </p>
                            <p>
                              Bil. Peserta Flash Mob:{' '}
                              {data.bilanganPesertaFlashmobBahagianB}
                            </p>
                          </div>
                        )}
                        {data.kanserMulutNasihatKesihatanPergigianBahagianB && (
                          <div>
                            <p className='bg-kaunter2 font-semibold rounded-md'>
                              Nasihat Kanser Mulut
                            </p>
                            <p>
                              Bil. Aktiviti Nasihat Kanser Mulut:{' '}
                              {data.bilanganAktivitiKanserMulutBahagianB}
                            </p>
                            <p>
                              Bil. Peserta Nasihat Kanser Mulut:{' '}
                              {data.bilanganPesertaKanserMulutBahagianB}
                            </p>
                          </div>
                        )}
                        {data.kursusSeminarBengkelBahagianB && (
                          <div>
                            <p className='bg-kaunter2 font-semibold rounded-md'>
                              Seminar/Bengkel
                            </p>
                            <p>
                              Bil. Aktiviti Seminar/Bengkel:{' '}
                              {
                                data.bilanganAktivitiKursusSeminarBengkelBahagianB
                              }
                            </p>
                            <p>
                              Bil. Peserta Seminar/Bengkel:{' '}
                              {
                                data.bilanganPesertaKursusSeminarBengkelBahagianB
                              }
                            </p>
                          </div>
                        )}
                        {data.lainLainIntervensiTabiatBerisikoTinggi && (
                          <div>
                            <p className='bg-kaunter2 font-semibold rounded-md'>
                              Tabiat Risiko Tinggi
                            </p>
                            <p>
                              Bil. Aktiviti Tabiat Risiko Tinggi:{' '}
                              {
                                data.bilanganAktivitiLainLainIntervensiTabiatBerisikoTinggi
                              }
                            </p>
                            <p>
                              Bil. Peserta Tabiat Risiko Tinggi:{' '}
                              {
                                data.bilanganPesertaLainLainIntervensiTabiatBerisikoTinggi
                              }
                            </p>
                          </div>
                        )}
                        {data.lawatanKeRumahBahagianB && (
                          <div>
                            <p className='bg-kaunter2 font-semibold rounded-md'>
                              Lawatan Ke Rumah
                            </p>
                            <p>
                              Bil. Aktiviti LKR:{' '}
                              {data.bilanganAktivitiLawatanKeRumahBahagianB}
                            </p>
                            <p>
                              Bil. Peserta LKR:{' '}
                              {data.bilanganPesertaLawatanKeRumahBahagianB}
                            </p>
                          </div>
                        )}
                      </div>
                      <div>
                        {data.mainPerananBahagianB && (
                          <div>
                            <p className='bg-kaunter2 font-semibold rounded-md'>
                              Main Peranan
                            </p>
                            <p>
                              Bil. Aktiviti Main Peranan:{' '}
                              {data.bilanganAktivitiMainPerananBahagianB}
                            </p>
                            <p>
                              Bil. Peserta Main Peranan:{' '}
                              {data.bilanganPesertaMainPerananBahagianB}
                            </p>
                          </div>
                        )}
                        {data.mengunyahSirihIntervensiTabiatBerisikoTinggi && (
                          <div>
                            <p className='bg-kaunter2 font-semibold rounded-md'>
                              Intervensi Sirih
                            </p>
                            <p>
                              Bil. Aktiviti Intervensi Sirih:{' '}
                              {
                                data.bilanganAktivitiMengunyahSirihIntervensiTabiatBerisikoTinggi
                              }
                            </p>
                            <p>
                              Bil. Peserta Intervensi Sirih:{' '}
                              {
                                data.bilanganPesertaMengunyahSirihIntervensiTabiatBerisikoTinggi
                              }
                            </p>
                          </div>
                        )}
                        {data.merokokIntervensiTabiatBerisikoTinggi && (
                          <div>
                            <p className='bg-kaunter2 font-semibold rounded-md'>
                              Intervensi Merokok
                            </p>
                            <p>
                              Bil. Aktiviti Intervensi Merokok:{' '}
                              {
                                data.bilanganAktivitiMerokokIntervensiTabiatBerisikoTinggi
                              }
                            </p>
                            <p>
                              Bil. Peserta Intervensi Merokok:{' '}
                              {
                                data.bilanganPesertaMerokokIntervensiTabiatBerisikoTinggi
                              }
                            </p>
                          </div>
                        )}
                        {data.pameranKempenBahagianB && (
                          <div>
                            <p className='bg-kaunter2 font-semibold rounded-md'>
                              Pameran/Kempen
                            </p>
                            <p>
                              Bil. Aktiviti Pameran/Kempen:{' '}
                              {data.bilanganAktivitiPameranKempenBahagianB}
                            </p>
                            <p>
                              Bil. Peserta Pameran/Kempen:{' '}
                              {data.bilanganPesertaPameranKempenBahagianB}
                            </p>
                          </div>
                        )}
                        {data.penjagaanKesihatanMulutNasihatKesihatanPergigianBahagianB && (
                          <div>
                            <p className='bg-kaunter2 font-semibold rounded-md'>
                              Penjagaan Kesihatan Mulut
                            </p>
                            <p>
                              Bil. Aktiviti Penjagaan Kesihatan Mulut:{' '}
                              {
                                data.bilanganAktivitiPenjagaanKesihatanMulutBahagianB
                              }
                            </p>
                            <p>
                              Bil. Peserta Penjagaan Kesihatan Mulut:{' '}
                              {
                                data.bilanganPesertaPenjagaanKesihatanMulutBahagianB
                              }
                            </p>
                          </div>
                        )}
                        {data.permainanInteraktifBahagianB && (
                          <div>
                            <p className='bg-kaunter2 font-semibold rounded-md'>
                              Permainan Interaktif
                            </p>
                            <p>
                              Bil. Aktiviti Permainan Interaktif:{' '}
                              {
                                data.bilanganAktivitiPermainanInteraktifBahagianB
                              }
                            </p>
                            <p>
                              Bil. Peserta Permainan Interaktif:{' '}
                              {data.bilanganPesertaPermainanInteraktifBahagianB}
                            </p>
                          </div>
                        )}
                        {data.pertandinganBahagianB && (
                          <div>
                            <p className='bg-kaunter2 font-semibold rounded-md'>
                              Pertandingan
                            </p>
                            <p>
                              Bil. Aktiviti Pertandingan:{' '}
                              {data.bilanganAktivitiPertandinganBahagianB}
                            </p>
                            <p>
                              Bil. Peserta Pertandingan:{' '}
                              {data.bilanganPesertaPertandinganBahagianB}
                            </p>
                          </div>
                        )}
                        {data.pertunjukanBonekaBahagianB && (
                          <div>
                            <p className='bg-kaunter2 font-semibold rounded-md'>
                              Boneka
                            </p>
                            <p>
                              Bil. Aktiviti Boneka:{' '}
                              {data.bilanganAktivitiPertunjukanBonekaBahagianB}
                            </p>
                            <p>
                              Bil. Peserta Boneka:{' '}
                              {data.bilanganPesertaPertunjukanBonekaBahagianB}
                            </p>
                          </div>
                        )}
                        {data.pertunjukanMultimediaBahagianB && (
                          <div>
                            <p className='bg-kaunter2 font-semibold rounded-md'>
                              Pertunjukan Multimedia
                            </p>
                            <p>
                              Bil. Aktiviti Pertunjukan Multimedia:{' '}
                              {
                                data.bilanganAktivitiPertunjukanMultimediaBahagianB
                              }
                            </p>
                            <p>
                              Bil. Peserta Pertunjukan Multimedia:{' '}
                              {
                                data.bilanganPesertaPertunjukanMultimediaBahagianB
                              }
                            </p>
                          </div>
                        )}
                        {data.plakGigiNasihatKesihatanPergigianBahagianB && (
                          <div>
                            <p className='bg-kaunter2 font-semibold rounded-md'>
                              Nasihat Plak Gigi
                            </p>
                            <p>
                              Bil. Aktiviti Nasihat Plak Gigi:{' '}
                              {data.bilanganAktivitiPlakGigiBahagianB}
                            </p>
                            <p>
                              Bil. Peserta Nasihat Plak Gigi:{' '}
                              {data.bilanganPesertaPlakGigiBahagianB}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
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

export default UserFormPromosiConfirmation;
