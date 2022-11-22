import { useState } from 'react';
import Select from 'react-select';

const optionsBahagianB = [
  { value: 'pameran-kempen', label: 'Pameran / Kempen' },
  { value: 'pertunjukan-boneka', label: 'Pertunjukan Boneka' },
  { value: 'main-peranan', label: 'Main Peranan' },
  { value: 'bercerita', label: 'Bercerita' },
  { value: 'pertandingan', label: 'Pertandingan' },
  { value: 'permainan-interaktif', label: 'Permainan Interaktif' },
  { value: 'kursus-seminar-bengkel', label: 'Kursus / Seminar / Bengkel' },
  { value: 'pertunjukan-multimedia', label: 'Pertunjukan Multimedia' },
  { value: 'dental-buskers', label: 'Dental Buskers' },
  { value: 'flashmob', label: 'flashmob' },
  { value: 'lawatan-ke-rumah', label: 'Lawatan Ke Rumah' },
];

function UserFormPromosi() {
  // maklumat acara
  const [mediaMassa, setMediaMassa] = useState('');
  const [bilanganAktivitiTelevisyen, setBilanganAktivitiTelevisyen] =
    useState(0);
  const [bilanganPesertaTelevisyen, setBilanganPesertaTelevisyen] = useState(0);
  const [bilanganAktivitiRadio, setBilanganAktivitiRadio] = useState(0);
  const [bilanganPesertaRadio, setBilanganPesertaRadio] = useState(0);
  // bahagian a
  const [ceramahBahagianA, setCeramahBahagianA] = useState(false);
  const [baruCeramahBahagianA, setBaruCeramahBahagianA] = useState(false);
  const [
    bilanganAktivitiBaruCeramahBahagianA,
    setBilanganAktivitiBaruCeramahBahagianA,
  ] = useState(0);
  const [
    bilanganPesertaBaruCeramahBahagianA,
    setBilanganPesertaBaruCeramahBahagianA,
  ] = useState(0);
  const [ulangCeramahBahagianA, setUlangCeramahBahagianA] = useState(false);
  const [
    bilanganAktivitiUlangCeramahBahagianA,
    setBilanganAktivitiUlangCeramahBahagianA,
  ] = useState(0);
  const [
    bilanganPesertaUlangCeramahBahagianA,
    setBilanganPesertaUlangCeramahBahagianA,
  ] = useState(0);
  const [latihanMemberusGigiBahagianA, setLatihanMemberusGigiBahagianA] =
    useState(false);
  const [
    baruLatihanMemberusGigiBahagianA,
    setBaruLatihanMemberusGigiBahagianA,
  ] = useState(false);
  const [
    bilanganAktivitiBaruLatihanMemberusGigiBahagianA,
    setBilanganAktivitiBaruLatihanMemberusGigiBahagianA,
  ] = useState(0);
  const [
    bilanganPesertaBaruLatihanMemberusGigiBahagianA,
    setBilanganPesertaBaruLatihanMemberusGigiBahagianA,
  ] = useState(0);
  const [
    ulangLatihanMemberusGigiBahagianA,
    setUlangLatihanMemberusGigiBahagianA,
  ] = useState(false);
  const [
    bilanganAktivitiUlangLatihanMemberusGigiBahagianA,
    setBilanganAktivitiUlangLatihanMemberusGigiBahagianA,
  ] = useState(0);
  const [
    bilanganPesertaUlangLatihanMemberusGigiBahagianA,
    setBilanganPesertaUlangLatihanMemberusGigiBahagianA,
  ] = useState(0);
  // bahagian b
  const [pilihanBahagianB, setPilihanBahagianB] = useState([]);
  const [pameranKempenBahagianB, setPameranKempenBahagianB] = useState(false);
  const [
    bilanganAktivitiPameranKempenBahagianB,
    setBilanganAktivitiPameranKempenBahagianB,
  ] = useState(0);
  const [
    bilanganPesertaPameranKempenBahagianB,
    setBilanganPesertaPameranKempenBahagianB,
  ] = useState(0);
  const [pertunjukanBonekaBahagianB, setPertunjukanBonekaBahagianB] =
    useState(false);
  const [
    bilanganAktivitiPertunjukanBonekaBahagianB,
    setBilanganAktivitiPertunjukanBonekaBahagianB,
  ] = useState(0);
  const [
    bilanganPesertaPertunjukanBonekaBahagianB,
    setBilanganPesertaPertunjukanBonekaBahagianB,
  ] = useState(0);
  const [mainPerananBahagianB, setMainPerananBahagianB] = useState(false);
  const [
    bilanganAktivitiMainPerananBahagianB,
    setBilanganAktivitiMainPerananBahagianB,
  ] = useState(0);
  const [
    bilanganPesertaMainPerananBahagianB,
    setBilanganPesertaMainPerananBahagianB,
  ] = useState(0);
  const [berceritaBahagianB, setBerceritaBahagianB] = useState(false);
  const [
    bilanganAktivitiBerceritaBahagianB,
    setBilanganAktivitiBerceritaBahagianB,
  ] = useState(0);
  const [
    bilanganPesertaBerceritaBahagianB,
    setBilanganPesertaBerceritaBahagianB,
  ] = useState(0);
  const [pertandinganBahagianB, setPertandinganBahagianB] = useState(false);
  const [
    bilanganAktivitiPertandinganBahagianB,
    setBilanganAktivitiPertandinganBahagianB,
  ] = useState(0);
  const [
    bilanganPesertaPertandinganBahagianB,
    setBilanganPesertaPertandinganBahagianB,
  ] = useState(0);
  const [permainanInteraktifBahagianB, setPermainanInteraktifBahagianB] =
    useState(false);
  const [
    bilanganAktivitiPermainanInteraktifBahagianB,
    setBilanganAktivitiPermainanInteraktifBahagianB,
  ] = useState(0);
  const [
    bilanganPesertaPermainanInteraktifBahagianB,
    setBilanganPesertaPermainanInteraktifBahagianB,
  ] = useState(0);
  const [kursusSeminarBengkelBahagianB, setKursusSeminarBengkelBahagianB] =
    useState(false);
  const [
    bilanganAktivitiKursusSeminarBengkelBahagianB,
    setBilanganAktivitiKursusSeminarBengkelBahagianB,
  ] = useState(0);
  const [
    bilanganPesertaKursusSeminarBengkelBahagianB,
    setBilanganPesertaKursusSeminarBengkelBahagianB,
  ] = useState(0);
  const [pertunjukanMultimediaBahagianB, setPertunjukanMultimediaBahagianB] =
    useState(false);
  const [
    bilanganAktivitiPertunjukanMultimediaBahagianB,
    setBilanganAktivitiPertunjukanMultimediaBahagianB,
  ] = useState(0);
  const [
    bilanganPesertaPertunjukanMultimediaBahagianB,
    setBilanganPesertaPertunjukanMultimediaBahagianB,
  ] = useState(0);
  const [dentalBuskerBahagianB, setDentalBuskerBahagianB] = useState(false);
  const [
    bilanganAktivitiDentalBuskerBahagianB,
    setBilanganAktivitiDentalBuskerBahagianB,
  ] = useState(0);
  const [
    bilanganPesertaDentalBuskerBahagianB,
    setBilanganPesertaDentalBuskerBahagianB,
  ] = useState(0);
  const [flashmobBahagianB, setFlashmobBahagianB] = useState(false);
  const [
    bilanganAktivitiFlashmobBahagianB,
    setBilanganAktivitiFlashmobBahagianB,
  ] = useState(0);
  const [
    bilanganPesertaFlashmobBahagianB,
    setBilanganPesertaFlashmobBahagianB,
  ] = useState(0);
  const [lawatanKeRumahBahagianB, setLawatanKeRumahBahagianB] = useState(false);
  const [
    bilanganAktivitiLawatanKeRumahBahagianB,
    setBilanganAktivitiLawatanKeRumahBahagianB,
  ] = useState(0);
  const [
    bilanganPesertaLawatanKeRumahBahagianB,
    setBilanganPesertaLawatanKeRumahBahagianB,
  ] = useState(0);
  // nasihat kesihatan pergigian
  const [
    plakGigiNasihatKesihatanPergigianBahagianB,
    setPlakGigiNasihatKesihatanPergigianBahagianB,
  ] = useState(false);
  const [
    bilanganAktivitiPlakGigiBahagianB,
    setBilanganAktivitiPlakGigiBahagianB,
  ] = useState(0);
  const [
    bilanganPesertaPlakGigiBahagianB,
    setBilanganPesertaPlakGigiBahagianB,
  ] = useState(0);
  const [
    dietPemakananNasihatKesihatanPergigianBahagianB,
    setDietPemakananNasihatKesihatanPergigianBahagianB,
  ] = useState(false);
  const [
    bilanganAktivitiDietPemakananBahagianB,
    setBilanganAktivitiDietPemakananBahagianB,
  ] = useState(0);
  const [
    bilanganPesertaDietPemakananBahagianB,
    setBilanganPesertaDietPemakananBahagianB,
  ] = useState(0);
  const [
    penjagaanKesihatanMulutNasihatKesihatanPergigianBahagianB,
    setPenjagaanKesihatanMulutNasihatKesihatanPergigianBahagianB,
  ] = useState(false);
  const [
    bilanganAktivitiPenjagaanKesihatanMulutBahagianB,
    setBilanganAktivitiPenjagaanKesihatanMulutBahagianB,
  ] = useState(0);
  const [
    bilanganPesertaPenjagaanKesihatanMulutBahagianB,
    setBilanganPesertaPenjagaanKesihatanMulutBahagianB,
  ] = useState(0);
  const [
    kanserMulutNasihatKesihatanPergigianBahagianB,
    setKanserMulutNasihatKesihatanPergigianBahagianB,
  ] = useState(false);
  const [
    bilanganAktivitiKanserMulutBahagianB,
    setBilanganAktivitiKanserMulutBahagianB,
  ] = useState(0);
  const [
    bilanganPesertaKanserMulutBahagianB,
    setBilanganPesertaKanserMulutBahagianB,
  ] = useState(0);
  // intervensi tabiat berisiko tinggi
  const [
    merokokIntervensiTabiatBerisikoTinggi,
    setMerokokIntervensiTabiatBerisikoTinggi,
  ] = useState(false);
  const [
    bilanganAktivitiMerokokIntervensiTabiatBerisikoTinggi,
    setBilanganAktivitiMerokokIntervensiTabiatBerisikoTinggi,
  ] = useState(0);
  const [
    bilanganPesertaMerokokIntervensiTabiatBerisikoTinggi,
    setBilanganPesertaMerokokIntervensiTabiatBerisikoTinggi,
  ] = useState(0);
  const [
    mengunyahSirihIntervensiTabiatBerisikoTinggi,
    setMengunyahSirihIntervensiTabiatBerisikoTinggi,
  ] = useState(false);
  const [
    bilanganAktivitiMengunyahSirihIntervensiTabiatBerisikoTinggi,
    setBilanganAktivitiMengunyahSirihIntervensiTabiatBerisikoTinggi,
  ] = useState(0);
  const [
    bilanganPesertaMengunyahSirihIntervensiTabiatBerisikoTinggi,
    setBilanganPesertaMengunyahSirihIntervensiTabiatBerisikoTinggi,
  ] = useState(0);
  const [
    alkoholIntervensiTabiatBerisikoTinggi,
    setAlkoholIntervensiTabiatBerisikoTinggi,
  ] = useState(false);
  const [
    bilanganAktivitiAlkoholIntervensiTabiatBerisikoTinggi,
    setBilanganAktivitiAlkoholIntervensiTabiatBerisikoTinggi,
  ] = useState(0);
  const [
    bilanganPesertaAlkoholIntervensiTabiatBerisikoTinggi,
    setBilanganPesertaAlkoholIntervensiTabiatBerisikoTinggi,
  ] = useState(0);
  const [
    lainLainIntervensiTabiatBerisikoTinggi,
    setLainLainIntervensiTabiatBerisikoTinggi,
  ] = useState(false);
  const [
    bilanganAktivitiLainLainIntervensiTabiatBerisikoTinggi,
    setBilanganAktivitiLainLainIntervensiTabiatBerisikoTinggi,
  ] = useState(0);
  const [
    bilanganPesertaLainLainIntervensiTabiatBerisikoTinggi,
    setBilanganPesertaLainLainIntervensiTabiatBerisikoTinggi,
  ] = useState(0);

  return (
    <>
      <div className='h-full p-1 grid'>
        {/* maklumat acara */}
        <div className='p-2'>
          <article className='outline outline-1 outline-userBlack'>
            <div className='flex flex-col'>
              <div>
                <h1 className='text-base font-bold flex flex-row pl-5'>
                  maklumat acara
                </h1>
              </div>
              <div className='grid grid-cols-2'>
                <p className='text-sm flex flex-row items-center pl-5'>
                  jenis program :
                </p>
                <p className='text-sm flex flex-row items-center pl-5'>
                  nama acara :
                </p>
              </div>
              <div className='grid grid-cols-2'>
                <p className='text-sm flex flex-row items-center pl-5'>
                  tarikh mula :
                </p>
                <p className='text-sm flex flex-row items-center pl-5'>
                  tarikh akhir :
                </p>
              </div>
            </div>
          </article>
        </div>
        {/* form promosi */}
        <div className='grid h-full overflow-scroll overflow-x-hidden gap-2 px-1'>
          <form>
            <section className='grid grid-cols-1 gap-2 mt-3 mb-3 w-full col-span-2'>
              <article className='grid grid-cols-1 lg:grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <div className='flex flex-row justify-start lg:col-span-2 items-center'>
                  <h1 className='text-base font-bold flex flex-row pl-5 mr-5'>
                    Adakah acara terlibat dengan media massa?
                  </h1>
                  <input
                    type='radio'
                    name='media-massa'
                    id='media-massa-ya'
                    value='media-massa-ya'
                    checked={mediaMassa === 'media-massa-ya' ? true : false}
                    onChange={(e) => setMediaMassa(e.target.value)}
                    className='peer'
                  />
                  <label
                    htmlFor='media-massa-ya'
                    className='peer ml-2 mr-5 text-sm'
                  >
                    Ya
                  </label>
                  <input
                    type='radio'
                    name='media-massa'
                    id='media-massa-tidak'
                    value='media-massa-tidak'
                    checked={mediaMassa === 'media-massa-tidak' ? true : false}
                    onChange={(e) => setMediaMassa(e.target.value)}
                    className='peer'
                  />
                  <label
                    htmlFor='media-massa-tidak'
                    className='peer ml-2 mr-5 text-sm'
                  >
                    Tidak
                  </label>
                </div>
                <div className='outline outline-1 outline-user1 rounded-md'>
                  <h1 className='flex flex-row text-base font-semibold pl-5'>
                    televisyen
                  </h1>
                  <div className='grid grid-cols-[1fr_3fr]'>
                    <p className='text-sm font-medium flex items-center justify-start pl-5'>
                      Bil. Aktiviti :
                    </p>
                    <input
                      type='number'
                      name='bilangan-aktiviti-televisyen'
                      id='bilangan-aktiviti-televisyen'
                      min='0'
                      value={bilanganAktivitiTelevisyen}
                      onChange={(e) =>
                        setBilanganAktivitiTelevisyen(e.target.value)
                      }
                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                    />
                    <p className='text-sm font-medium flex items-center justify-start pl-5'>
                      Bil. Peserta :
                    </p>
                    <input
                      type='number'
                      name='bilangan-peserta-televisyen'
                      id='bilangan-peserta-televisyen'
                      min='0'
                      value={bilanganPesertaTelevisyen}
                      onChange={(e) =>
                        setBilanganPesertaTelevisyen(e.target.value)
                      }
                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                    />
                  </div>
                </div>
                <div className='outline outline-1 outline-user1 rounded-md'>
                  <h1 className='flex flex-row text-base font-semibold pl-5'>
                    radio
                  </h1>
                  <div className='grid grid-cols-[1fr_3fr]'>
                    <p className='text-sm font-medium flex items-center justify-start pl-5'>
                      Bil. Aktiviti :
                    </p>
                    <input
                      type='number'
                      name='bilangan-aktiviti-radio'
                      id='bilangan-aktiviti-radio'
                      min='0'
                      value={bilanganAktivitiRadio}
                      onChange={(e) => setBilanganAktivitiRadio(e.target.value)}
                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                    />
                    <p className='text-sm font-medium flex items-center justify-start pl-5'>
                      Bil. Peserta :
                    </p>
                    <input
                      type='number'
                      name='bilangan-peserta-radio'
                      id='bilangan-peserta-radio'
                      min='0'
                      value={bilanganPesertaRadio}
                      onChange={(e) => setBilanganPesertaRadio(e.target.value)}
                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                    />
                  </div>
                </div>
              </article>
              <article className='grid grid-cols-1 lg:grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <div className='flex flex-row justify-start lg:col-span-2 items-center'>
                  <h1 className='text-base font-bold flex flex-row pl-5 mr-5'>
                    Bahagian A
                  </h1>
                </div>
                <div className='grid grid-cols-[1fr_2fr] outline outline-1 outline-userBlack'>
                  <div className='col-span-2'>
                    <input
                      type='checkbox'
                      name='ceramah-bahagian-a'
                      id='ceramah-bahagian-a'
                      checked={ceramahBahagianA}
                      onChange={() => setCeramahBahagianA(!ceramahBahagianA)}
                    />
                    <label
                      htmlFor='ceramah-bahagian-a'
                      className='ml-2 mr-5 text-sm'
                    >
                      Ceramah
                    </label>
                  </div>
                  <div className='flex flex-col justify-start col-span-2'>
                    <div className='grid grid-cols-[1fr_2fr]'>
                      <div className='flex flex-row justify-end'>
                        <label
                          htmlFor='baru-ceramah-bahagian-a'
                          className='ml-2 mr-5 text-sm flex items-center'
                        >
                          Baru
                        </label>
                        <input
                          type='checkbox'
                          name='baru-ceramah-bahagian-a'
                          id='baru-ceramah-bahagian-a'
                          checked={baruCeramahBahagianA}
                          onChange={() =>
                            setBaruCeramahBahagianA(!baruCeramahBahagianA)
                          }
                        />
                      </div>
                      <div>
                        <div>
                          <label
                            htmlFor='bilangan-aktiviti-baru-ceramah-bahagian-a'
                            className='ml-2 mr-3 text-sm'
                          >
                            bilangan aktiviti
                          </label>
                          <input
                            type='number'
                            name='bilangan-aktiviti-baru-ceramah-bahagian-a'
                            id='bilangan-aktiviti-baru-ceramah-bahagian-a'
                            min='0'
                            value={bilanganAktivitiBaruCeramahBahagianA}
                            onChange={(e) =>
                              setBilanganAktivitiBaruCeramahBahagianA(
                                e.target.value
                              )
                            }
                            className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          />
                        </div>
                        <div>
                          <label
                            htmlFor='bilangan-peserta-baru-ceramah-bahagian-a'
                            className='ml-2 mr-3 text-sm'
                          >
                            bilangan peserta
                          </label>
                          <input
                            type='number'
                            name='bilangan-peserta-baru-ceramah-bahagian-a'
                            id='bilangan-peserta-baru-ceramah-bahagian-a'
                            min='0'
                            value={bilanganPesertaBaruCeramahBahagianA}
                            onChange={(e) =>
                              setBilanganPesertaBaruCeramahBahagianA(
                                e.target.value
                              )
                            }
                            className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='grid grid-cols-[1fr_2fr]'>
                      <div className='flex flex-row justify-end'>
                        <label
                          htmlFor='ulang-ceramah-bahagian-a'
                          className='ml-2 mr-5 text-sm flex items-center'
                        >
                          Ulangan
                        </label>
                        <input
                          type='checkbox'
                          name='ulang-ceramah-bahagian-a'
                          id='ulang-ceramah-bahagian-a'
                          checked={ulangCeramahBahagianA}
                          onChange={() =>
                            setUlangCeramahBahagianA(!ulangCeramahBahagianA)
                          }
                        />
                      </div>
                      <div>
                        <div>
                          <label
                            htmlFor='bilangan-aktiviti-ulang-ceramah-bahagian-a'
                            className='ml-2 mr-3 text-sm'
                          >
                            bilangan aktiviti
                          </label>
                          <input
                            type='number'
                            name='bilangan-aktiviti-ulang-ceramah-bahagian-a'
                            id='bilangan-aktiviti-ulang-ceramah-bahagian-a'
                            min='0'
                            value={bilanganAktivitiUlangCeramahBahagianA}
                            onChange={(e) =>
                              setBilanganAktivitiUlangCeramahBahagianA(
                                e.target.value
                              )
                            }
                            className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          />
                        </div>
                        <div>
                          <label
                            htmlFor='bilangan-peserta-ulang-ceramah-bahagian-a'
                            className='ml-2 mr-3 text-sm'
                          >
                            bilangan peserta
                          </label>
                          <input
                            type='number'
                            name='bilangan-peserta-ulang-ceramah-bahagian-a'
                            id='bilangan-peserta-ulang-ceramah-bahagian-a'
                            min='0'
                            value={bilanganPesertaUlangCeramahBahagianA}
                            onChange={(e) =>
                              setBilanganPesertaUlangCeramahBahagianA(
                                e.target.value
                              )
                            }
                            className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-[1fr_2fr] outline outline-1 outline-userBlack'>
                  <div className='col-span-2'>
                    <input
                      type='checkbox'
                      name='latihan-memberus-gigi-bahagian-a'
                      id='latihan-memberus-gigi-bahagian-a'
                      checked={latihanMemberusGigiBahagianA}
                      onChange={() =>
                        setLatihanMemberusGigiBahagianA(
                          !latihanMemberusGigiBahagianA
                        )
                      }
                    />
                    <label
                      htmlFor='latihan-memberus-gigi-bahagian-a'
                      className='ml-2 mr-5 text-sm'
                    >
                      Latihan Memberus Gigi
                    </label>
                  </div>
                  <div className='flex flex-col justify-start col-span-2'>
                    <div className='grid grid-cols-[1fr_2fr]'>
                      <div className='flex flex-row justify-end'>
                        <label
                          htmlFor='baru-latihan-memberus-gigi-bahagian-a'
                          className='ml-2 mr-5 text-sm flex items-center'
                        >
                          Baru
                        </label>
                        <input
                          type='checkbox'
                          name='baru-latihan-memberus-gigi-bahagian-a'
                          id='baru-latihan-memberus-gigi-bahagian-a'
                          checked={baruLatihanMemberusGigiBahagianA}
                          onChange={() =>
                            setBaruLatihanMemberusGigiBahagianA(
                              !baruLatihanMemberusGigiBahagianA
                            )
                          }
                        />
                      </div>
                      <div>
                        <div>
                          <label
                            htmlFor='bilangan-aktiviti-baru-latihan-memberus-gigi-bahagian-a'
                            className='ml-2 mr-3 text-sm'
                          >
                            bilangan aktiviti
                          </label>
                          <input
                            type='number'
                            name='bilangan-aktiviti-baru-latihan-memberus-gigi-bahagian-a'
                            id='bilangan-aktiviti-baru-latihan-memberus-gigi-bahagian-a'
                            min='0'
                            value={
                              bilanganAktivitiBaruLatihanMemberusGigiBahagianA
                            }
                            onChange={(e) =>
                              setBilanganAktivitiBaruLatihanMemberusGigiBahagianA(
                                e.target.value
                              )
                            }
                            className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          />
                        </div>
                        <div>
                          <label
                            htmlFor='bilangan-peserta-baru-latihan-memberus-gigi-bahagian-a'
                            className='ml-2 mr-3 text-sm'
                          >
                            bilangan peserta
                          </label>
                          <input
                            type='number'
                            name='bilangan-peserta-baru-latihan-memberus-gigi-bahagian-a'
                            id='bilangan-peserta-baru-latihan-memberus-gigi-bahagian-a'
                            min='0'
                            value={
                              bilanganPesertaBaruLatihanMemberusGigiBahagianA
                            }
                            onChange={(e) =>
                              setBilanganPesertaBaruLatihanMemberusGigiBahagianA(
                                e.target.value
                              )
                            }
                            className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='grid grid-cols-[1fr_2fr]'>
                      <div className='flex flex-row justify-end'>
                        <label
                          htmlFor='ulang-latihan-memberus-gigi-bahagian-a'
                          className='ml-2 mr-5 text-sm flex items-center'
                        >
                          Ulangan
                        </label>
                        <input
                          type='checkbox'
                          name='ulang-latihan-memberus-gigi-bahagian-a'
                          id='ulang-latihan-memberus-gigi-bahagian-a'
                          checked={ulangLatihanMemberusGigiBahagianA}
                          onChange={() =>
                            setUlangLatihanMemberusGigiBahagianA(
                              !ulangLatihanMemberusGigiBahagianA
                            )
                          }
                        />
                      </div>
                      <div>
                        <div>
                          <label
                            htmlFor='bilangan-aktiviti-ulang-latihan-memberus-gigi-bahagian-a'
                            className='ml-2 mr-3 text-sm'
                          >
                            bilangan aktiviti
                          </label>
                          <input
                            type='number'
                            name='bilangan-aktiviti-ulang-latihan-memberus-gigi-bahagian-a'
                            id='bilangan-aktiviti-ulang-latihan-memberus-gigi-bahagian-a'
                            min='0'
                            value={
                              bilanganAktivitiUlangLatihanMemberusGigiBahagianA
                            }
                            onChange={(e) =>
                              setBilanganAktivitiUlangLatihanMemberusGigiBahagianA(
                                e.target.value
                              )
                            }
                            className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          />
                        </div>
                        <div>
                          <label
                            htmlFor='bilangan-peserta-ulang-latihan-memberus-gigi-bahagian-a'
                            className='ml-2 mr-3 text-sm'
                          >
                            bilangan peserta
                          </label>
                          <input
                            type='number'
                            name='bilangan-peserta-ulang-latihan-memberus-gigi-bahagian-a'
                            id='bilangan-peserta-ulang-latihan-memberus-gigi-bahagian-a'
                            min='0'
                            value={
                              bilanganPesertaUlangLatihanMemberusGigiBahagianA
                            }
                            onChange={(e) =>
                              setBilanganPesertaUlangLatihanMemberusGigiBahagianA(
                                e.target.value
                              )
                            }
                            className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
              <article className='grid grid-cols-1 lg:grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <div className='flex flex-row justify-start lg:col-span-2 items-center'>
                  <h1 className='text-base font-bold flex flex-row pl-5 mr-5'>
                    Bahagian B
                  </h1>
                </div>
                <article className='grid border border-userBlack pl-3 px-2 p-2 rounded-md lg:col-span-2'>
                  <h1 className='flex flex-row text-base font-semibold p-1'>
                    Aktiviti yang dijalankan
                  </h1>
                  <Select
                    isMulti
                    name='bahagian-b'
                    options={optionsBahagianB}
                    className='basic-multi-select'
                    classNamePrefix='select'
                    onChange={(e) => {
                      setPilihanBahagianB(e.map((item) => item.value));
                    }}
                  />
                </article>
                {pilihanBahagianB.includes('pameran-kempen') ? (
                  <div className='grid grid-cols-[1fr_2fr] outline outline-1 outline-userBlack'>
                    <div className='col-span-2 flex flex-row pl-5 pt-2 text-lg font-semibold'>
                      <input
                        type='checkbox'
                        name='pameran-kempen-bahagian-b'
                        id='pameran-kempen-bahagian-b'
                        checked={pameranKempenBahagianB}
                        onChange={() =>
                          setPameranKempenBahagianB(!pameranKempenBahagianB)
                        }
                      />
                      <label
                        htmlFor='pameran-kempen-bahagian-b'
                        className='ml-2 mr-5 text-sm'
                      >
                        Pameran / Kempen
                      </label>
                    </div>
                    <label
                      htmlFor='bilangan-aktiviti-pameran-kempen-bahagian-b'
                      className='ml-2 mr-3 text-sm flex items-center justify-end'
                    >
                      bilangan aktiviti
                    </label>
                    <input
                      type='number'
                      name='bilangan-aktiviti-pameran-kempen-bahagian-b'
                      id='bilangan-aktiviti-pameran-kempen-bahagian-b'
                      min='0'
                      value={bilanganAktivitiPameranKempenBahagianB}
                      onChange={(e) =>
                        setBilanganAktivitiPameranKempenBahagianB(
                          e.target.value
                        )
                      }
                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                    />
                    <label
                      htmlFor='bilangan-peserta-pameran-kempen-bahagian-b'
                      className='ml-2 mr-3 text-sm flex items-center justify-end'
                    >
                      bilangan peserta
                    </label>
                    <input
                      type='number'
                      name='bilangan-peserta-pameran-kempen-bahagian-b'
                      id='bilangan-peserta-pameran-kempen-bahagian-b'
                      min='0'
                      value={bilanganPesertaPameranKempenBahagianB}
                      onChange={(e) =>
                        setBilanganPesertaPameranKempenBahagianB(e.target.value)
                      }
                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                    />
                  </div>
                ) : null}
                {pilihanBahagianB.includes('pertunjukan-boneka') ? (
                  <div className='grid grid-cols-[1fr_2fr] outline outline-1 outline-userBlack'>
                    <div className='col-span-2 flex flex-row pl-5 pt-2 text-lg font-semibold'>
                      <input
                        type='checkbox'
                        name='pertunjukan-boneka-bahagian-b'
                        id='pertunjukan-boneka-bahagian-b'
                        checked={pertunjukanBonekaBahagianB}
                        onChange={() =>
                          setPertunjukanBonekaBahagianB(
                            !pertunjukanBonekaBahagianB
                          )
                        }
                      />
                      <label
                        htmlFor='pertunjukan-boneka-bahagian-b'
                        className='ml-2 mr-5 text-sm'
                      >
                        Pertunjukan Boneka
                      </label>
                    </div>
                    <label
                      htmlFor='bilangan-aktiviti-pertunjukan-boneka-bahagian-b'
                      className='ml-2 mr-3 text-sm flex items-center justify-end'
                    >
                      bilangan aktiviti
                    </label>
                    <input
                      type='number'
                      name='bilangan-aktiviti-pertunjukan-boneka-bahagian-b'
                      id='bilangan-aktiviti-pertunjukan-boneka-bahagian-b'
                      min='0'
                      value={bilanganAktivitiPertunjukanBonekaBahagianB}
                      onChange={(e) =>
                        setBilanganAktivitiPertunjukanBonekaBahagianB(
                          e.target.value
                        )
                      }
                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                    />
                    <label
                      htmlFor='bilangan-peserta-pertunjukan-boneka-bahagian-b'
                      className='ml-2 mr-3 text-sm flex items-center justify-end'
                    >
                      bilangan peserta
                    </label>
                    <input
                      type='number'
                      name='bilangan-peserta-pertunjukan-boneka-bahagian-b'
                      id='bilangan-peserta-pertunjukan-boneka-bahagian-b'
                      min='0'
                      value={bilanganPesertaPertunjukanBonekaBahagianB}
                      onChange={(e) =>
                        setBilanganPesertaPertunjukanBonekaBahagianB(
                          e.target.value
                        )
                      }
                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                    />
                  </div>
                ) : null}
                {pilihanBahagianB.includes('main-peranan') ? (
                  <div className='grid grid-cols-[1fr_2fr] outline outline-1 outline-userBlack'>
                    <div className='col-span-2 flex flex-row pl-5 pt-2 text-lg font-semibold'>
                      <input
                        type='checkbox'
                        name='main-peranan-bahagian-b'
                        id='main-peranan-bahagian-b'
                        checked={mainPerananBahagianB}
                        onChange={() =>
                          setMainPerananBahagianB(!mainPerananBahagianB)
                        }
                      />
                      <label
                        htmlFor='main-peranan-bahagian-b'
                        className='ml-2 mr-5 text-sm'
                      >
                        Main Peranan
                      </label>
                    </div>
                    <label
                      htmlFor='bilangan-aktiviti-main-peranan-bahagian-b'
                      className='ml-2 mr-3 text-sm flex items-center justify-end'
                    >
                      bilangan aktiviti
                    </label>
                    <input
                      type='number'
                      name='bilangan-aktiviti-main-peranan-bahagian-b'
                      id='bilangan-aktiviti-main-peranan-bahagian-b'
                      min='0'
                      value={bilanganAktivitiMainPerananBahagianB}
                      onChange={(e) =>
                        setBilanganAktivitiMainPerananBahagianB(e.target.value)
                      }
                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                    />
                    <label
                      htmlFor='bilangan-peserta-main-peranan-bahagian-b'
                      className='ml-2 mr-3 text-sm flex items-center justify-end'
                    >
                      bilangan peserta
                    </label>
                    <input
                      type='number'
                      name='bilangan-peserta-main-peranan-bahagian-b'
                      id='bilangan-peserta-main-peranan-bahagian-b'
                      min='0'
                      value={bilanganPesertaMainPerananBahagianB}
                      onChange={(e) =>
                        setBilanganPesertaMainPerananBahagianB(e.target.value)
                      }
                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                    />
                  </div>
                ) : null}
                {pilihanBahagianB.includes('bercerita') ? (
                  <div className='grid grid-cols-[1fr_2fr] outline outline-1 outline-userBlack'>
                    <div className='col-span-2 flex flex-row pl-5 pt-2 text-lg font-semibold'>
                      <input
                        type='checkbox'
                        name='bercerita-bahagian-b'
                        id='bercerita-bahagian-b'
                        checked={berceritaBahagianB}
                        onChange={() =>
                          setBerceritaBahagianB(!berceritaBahagianB)
                        }
                      />
                      <label
                        htmlFor='bercerita-bahagian-b'
                        className='ml-2 mr-5 text-sm'
                      >
                        Bercerita
                      </label>
                    </div>
                    <label
                      htmlFor='bilangan-aktiviti-bercerita-bahagian-b'
                      className='ml-2 mr-3 text-sm flex items-center justify-end'
                    >
                      bilangan aktiviti
                    </label>
                    <input
                      type='number'
                      name='bilangan-aktiviti-bercerita-bahagian-b'
                      id='bilangan-aktiviti-bercerita-bahagian-b'
                      min='0'
                      value={bilanganAktivitiBerceritaBahagianB}
                      onChange={(e) =>
                        setBilanganAktivitiBerceritaBahagianB(e.target.value)
                      }
                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                    />
                    <label
                      htmlFor='bilangan-peserta-bercerita-bahagian-b'
                      className='ml-2 mr-3 text-sm flex items-center justify-end'
                    >
                      bilangan peserta
                    </label>
                    <input
                      type='number'
                      name='bilangan-peserta-bercerita-bahagian-b'
                      id='bilangan-peserta-bercerita-bahagian-b'
                      min='0'
                      value={bilanganPesertaBerceritaBahagianB}
                      onChange={(e) =>
                        setBilanganPesertaBerceritaBahagianB(e.target.value)
                      }
                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                    />
                  </div>
                ) : null}
                {pilihanBahagianB.includes('pertandingan') ? (
                  <div className='grid grid-cols-[1fr_2fr] outline outline-1 outline-userBlack'>
                    <div className='col-span-2 flex flex-row pl-5 pt-2 text-lg font-semibold'>
                      <input
                        type='checkbox'
                        name='pertandingan-bahagian-b'
                        id='pertandingan-bahagian-b'
                        checked={pertandinganBahagianB}
                        onChange={() =>
                          setPertandinganBahagianB(!pertandinganBahagianB)
                        }
                      />
                      <label
                        htmlFor='pertandingan-bahagian-b'
                        className='ml-2 mr-5 text-sm'
                      >
                        Pertandingan
                      </label>
                    </div>
                    <label
                      htmlFor='bilangan-aktiviti-pertandingan-bahagian-b'
                      className='ml-2 mr-3 text-sm flex items-center justify-end'
                    >
                      bilangan aktiviti
                    </label>
                    <input
                      type='number'
                      name='bilangan-aktiviti-pertandingan-bahagian-b'
                      id='bilangan-aktiviti-pertandingan-bahagian-b'
                      min='0'
                      value={bilanganAktivitiPertandinganBahagianB}
                      onChange={(e) =>
                        setBilanganAktivitiPertandinganBahagianB(e.target.value)
                      }
                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                    />
                    <label
                      htmlFor='bilangan-peserta-pertandingan-bahagian-b'
                      className='ml-2 mr-3 text-sm flex items-center justify-end'
                    >
                      bilangan peserta
                    </label>
                    <input
                      type='number'
                      name='bilangan-peserta-pertandingan-bahagian-b'
                      id='bilangan-peserta-pertandingan-bahagian-b'
                      min='0'
                      value={bilanganPesertaPertandinganBahagianB}
                      onChange={(e) =>
                        setBilanganPesertaPertandinganBahagianB(e.target.value)
                      }
                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                    />
                  </div>
                ) : null}
                {pilihanBahagianB.includes('permainan-interaktif') ? (
                  <div className='grid grid-cols-[1fr_2fr] outline outline-1 outline-userBlack'>
                    <div className='col-span-2 flex flex-row pl-5 pt-2 text-lg font-semibold'>
                      <input
                        type='checkbox'
                        name='permainan-interaktif-bahagian-b'
                        id='permainan-interaktif-bahagian-b'
                        checked={permainanInteraktifBahagianB}
                        onChange={() =>
                          setPermainanInteraktifBahagianB(
                            !permainanInteraktifBahagianB
                          )
                        }
                      />
                      <label
                        htmlFor='permainan-interaktif-bahagian-b'
                        className='ml-2 mr-5 text-sm'
                      >
                        Permainan Interaktif
                      </label>
                    </div>
                    <label
                      htmlFor='bilangan-aktiviti-permainan-interaktif-bahagian-b'
                      className='ml-2 mr-3 text-sm flex items-center justify-end'
                    >
                      bilangan aktiviti
                    </label>
                    <input
                      type='number'
                      name='bilangan-aktiviti-permainan-interaktif-bahagian-b'
                      id='bilangan-aktiviti-permainan-interaktif-bahagian-b'
                      min='0'
                      value={bilanganAktivitiPermainanInteraktifBahagianB}
                      onChange={(e) =>
                        setBilanganAktivitiPermainanInteraktifBahagianB(
                          e.target.value
                        )
                      }
                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                    />
                    <label
                      htmlFor='bilangan-peserta-permainan-interaktif-bahagian-b'
                      className='ml-2 mr-3 text-sm flex items-center justify-end'
                    >
                      bilangan peserta
                    </label>
                    <input
                      type='number'
                      name='bilangan-peserta-permainan-interaktif-bahagian-b'
                      id='bilangan-peserta-permainan-interaktif-bahagian-b'
                      min='0'
                      value={bilanganPesertaPermainanInteraktifBahagianB}
                      onChange={(e) =>
                        setBilanganPesertaPermainanInteraktifBahagianB(
                          e.target.value
                        )
                      }
                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                    />
                  </div>
                ) : null}
                {pilihanBahagianB.includes('kursus-seminar-bengkel') ? (
                  <div className='grid grid-cols-[1fr_2fr] outline outline-1 outline-userBlack'>
                    <div className='col-span-2 flex flex-row pl-5 pt-2 text-lg font-semibold'>
                      <input
                        type='checkbox'
                        name='kursus-seminar-bengkel-bahagian-b'
                        id='kursus-seminar-bengkel-bahagian-b'
                        checked={kursusSeminarBengkelBahagianB}
                        onChange={() =>
                          setKursusSeminarBengkelBahagianB(
                            !kursusSeminarBengkelBahagianB
                          )
                        }
                      />
                      <label
                        htmlFor='kursus-seminar-bengkel-bahagian-b'
                        className='ml-2 mr-5 text-sm'
                      >
                        Kursus / Seminar / Bengkel
                      </label>
                    </div>
                    <label
                      htmlFor='bilangan-aktiviti-kursus-seminar-bengkel-bahagian-b'
                      className='ml-2 mr-3 text-sm flex items-center justify-end'
                    >
                      bilangan aktiviti
                    </label>
                    <input
                      type='number'
                      name='bilangan-aktiviti-kursus-seminar-bengkel-bahagian-b'
                      id='bilangan-aktiviti-kursus-seminar-bengkel-bahagian-b'
                      min='0'
                      value={bilanganAktivitiKursusSeminarBengkelBahagianB}
                      onChange={(e) =>
                        setBilanganAktivitiKursusSeminarBengkelBahagianB(
                          e.target.value
                        )
                      }
                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                    />
                    <label
                      htmlFor='bilangan-peserta-kursus-seminar-bengkel-bahagian-b'
                      className='ml-2 mr-3 text-sm flex items-center justify-end'
                    >
                      bilangan peserta
                    </label>
                    <input
                      type='number'
                      name='bilangan-peserta-kursus-seminar-bengkel-bahagian-b'
                      id='bilangan-peserta-kursus-seminar-bengkel-bahagian-b'
                      min='0'
                      value={bilanganPesertaKursusSeminarBengkelBahagianB}
                      onChange={(e) =>
                        setBilanganPesertaKursusSeminarBengkelBahagianB(
                          e.target.value
                        )
                      }
                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                    />
                  </div>
                ) : null}
                {pilihanBahagianB.includes('pertunjukan-multimedia') ? (
                  <div className='grid grid-cols-[1fr_2fr] outline outline-1 outline-userBlack'>
                    <div className='col-span-2 flex flex-row pl-5 pt-2 text-lg font-semibold'>
                      <input
                        type='checkbox'
                        name='pertunjukan-multimedia-bahagian-b'
                        id='pertunjukan-multimedia-bahagian-b'
                        checked={pertunjukanMultimediaBahagianB}
                        onChange={() =>
                          setPertunjukanMultimediaBahagianB(
                            !pertunjukanMultimediaBahagianB
                          )
                        }
                      />
                      <label
                        htmlFor='pertunjukan-multimedia-bahagian-b'
                        className='ml-2 mr-5 text-sm'
                      >
                        Pertunjukan Multimedia
                      </label>
                    </div>
                    <label
                      htmlFor='bilangan-aktiviti-pertunjukan-multimedia-bahagian-b'
                      className='ml-2 mr-3 text-sm flex items-center justify-end'
                    >
                      bilangan aktiviti
                    </label>
                    <input
                      type='number'
                      name='bilangan-aktiviti-pertunjukan-multimedia-bahagian-b'
                      id='bilangan-aktiviti-pertunjukan-multimedia-bahagian-b'
                      min='0'
                      value={bilanganAktivitiPertunjukanMultimediaBahagianB}
                      onChange={(e) =>
                        setBilanganAktivitiPertunjukanMultimediaBahagianB(
                          e.target.value
                        )
                      }
                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                    />
                    <label
                      htmlFor='bilangan-peserta-pertunjukan-multimedia-bahagian-b'
                      className='ml-2 mr-3 text-sm flex items-center justify-end'
                    >
                      bilangan peserta
                    </label>
                    <input
                      type='number'
                      name='bilangan-peserta-pertunjukan-multimedia-bahagian-b'
                      id='bilangan-peserta-pertunjukan-multimedia-bahagian-b'
                      min='0'
                      value={bilanganPesertaPertunjukanMultimediaBahagianB}
                      onChange={(e) =>
                        setBilanganPesertaPertunjukanMultimediaBahagianB(
                          e.target.value
                        )
                      }
                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                    />
                  </div>
                ) : null}
                {pilihanBahagianB.includes('dental-buskers') ? (
                  <div className='grid grid-cols-[1fr_2fr] outline outline-1 outline-userBlack'>
                    <div className='col-span-2 flex flex-row pl-5 pt-2 text-lg font-semibold'>
                      <input
                        type='checkbox'
                        name='dental-busker-bahagian-b'
                        id='dental-busker-bahagian-b'
                        checked={dentalBuskerBahagianB}
                        onChange={() =>
                          setDentalBuskerBahagianB(!dentalBuskerBahagianB)
                        }
                      />
                      <label
                        htmlFor='dental-busker-bahagian-b'
                        className='ml-2 mr-5 text-sm'
                      >
                        Dental Busker
                      </label>
                    </div>
                    <label
                      htmlFor='bilangan-aktiviti-dental-busker-bahagian-b'
                      className='ml-2 mr-3 text-sm flex items-center justify-end'
                    >
                      bilangan aktiviti
                    </label>
                    <input
                      type='number'
                      name='bilangan-aktiviti-dental-busker-bahagian-b'
                      id='bilangan-aktiviti-dental-busker-bahagian-b'
                      min='0'
                      value={bilanganAktivitiDentalBuskerBahagianB}
                      onChange={(e) =>
                        setBilanganAktivitiDentalBuskerBahagianB(e.target.value)
                      }
                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                    />
                    <label
                      htmlFor='bilangan-peserta-dental-busker-bahagian-b'
                      className='ml-2 mr-3 text-sm flex items-center justify-end'
                    >
                      bilangan peserta
                    </label>
                    <input
                      type='number'
                      name='bilangan-peserta-dental-busker-bahagian-b'
                      id='bilangan-peserta-dental-busker-bahagian-b'
                      min='0'
                      value={bilanganPesertaDentalBuskerBahagianB}
                      onChange={(e) =>
                        setBilanganPesertaDentalBuskerBahagianB(e.target.value)
                      }
                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                    />
                  </div>
                ) : null}
                {pilihanBahagianB.includes('flashmob') ? (
                  <div className='grid grid-cols-[1fr_2fr] outline outline-1 outline-userBlack'>
                    <div className='col-span-2 flex flex-row pl-5 pt-2 text-lg font-semibold'>
                      <input
                        type='checkbox'
                        name='flashmob-bahagian-b'
                        id='flashmob-bahagian-b'
                        checked={flashmobBahagianB}
                        onChange={() =>
                          setFlashmobBahagianB(!flashmobBahagianB)
                        }
                      />
                      <label
                        htmlFor='flashmob-bahagian-b'
                        className='ml-2 mr-5 text-sm'
                      >
                        Flashmob
                      </label>
                    </div>
                    <label
                      htmlFor='bilangan-aktiviti-flashmob-bahagian-b'
                      className='ml-2 mr-3 text-sm flex items-center justify-end'
                    >
                      bilangan aktiviti
                    </label>
                    <input
                      type='number'
                      name='bilangan-aktiviti-flashmob-bahagian-b'
                      id='bilangan-aktiviti-flashmob-bahagian-b'
                      min='0'
                      value={bilanganAktivitiFlashmobBahagianB}
                      onChange={(e) =>
                        setBilanganAktivitiFlashmobBahagianB(e.target.value)
                      }
                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                    />
                    <label
                      htmlFor='bilangan-peserta-flashmob-bahagian-b'
                      className='ml-2 mr-3 text-sm flex items-center justify-end'
                    >
                      bilangan peserta
                    </label>
                    <input
                      type='number'
                      name='bilangan-peserta-flashmob-bahagian-b'
                      id='bilangan-peserta-flashmob-bahagian-b'
                      min='0'
                      value={bilanganPesertaFlashmobBahagianB}
                      onChange={(e) =>
                        setBilanganPesertaFlashmobBahagianB(e.target.value)
                      }
                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                    />
                  </div>
                ) : null}
                {pilihanBahagianB.includes('lawatan-ke-rumah') ? (
                  <div className='grid grid-cols-[1fr_2fr] outline outline-1 outline-userBlack'>
                    <div className='col-span-2 flex flex-row pl-5 pt-2 text-lg font-semibold'>
                      <input
                        type='checkbox'
                        name='lawatan-ke-rumah-bahagian-b'
                        id='lawatan-ke-rumah-bahagian-b'
                        checked={lawatanKeRumahBahagianB}
                        onChange={() =>
                          setLawatanKeRumahBahagianB(!lawatanKeRumahBahagianB)
                        }
                      />
                      <label
                        htmlFor='lawatan-ke-rumah-bahagian-b'
                        className='ml-2 mr-5 text-sm'
                      >
                        Lawatan ke rumah
                      </label>
                    </div>
                    <label
                      htmlFor='bilangan-aktiviti-lawatan-ke-rumah-bahagian-b'
                      className='ml-2 mr-3 text-sm flex items-center justify-end'
                    >
                      bilangan aktiviti
                    </label>
                    <input
                      type='number'
                      name='bilangan-aktiviti-lawatan-ke-rumah-bahagian-b'
                      id='bilangan-aktiviti-lawatan-ke-rumah-bahagian-b'
                      min='0'
                      value={bilanganAktivitiLawatanKeRumahBahagianB}
                      onChange={(e) =>
                        setBilanganAktivitiLawatanKeRumahBahagianB(
                          e.target.value
                        )
                      }
                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                    />
                    <label
                      htmlFor='bilangan-peserta-lawatan-ke-rumah-bahagian-b'
                      className='ml-2 mr-3 text-sm flex items-center justify-end'
                    >
                      bilangan peserta
                    </label>
                    <input
                      type='number'
                      name='bilangan-peserta-lawatan-ke-rumah-bahagian-b'
                      id='bilangan-peserta-lawatan-ke-rumah-bahagian-b'
                      min='0'
                      value={bilanganPesertaLawatanKeRumahBahagianB}
                      onChange={(e) =>
                        setBilanganPesertaLawatanKeRumahBahagianB(
                          e.target.value
                        )
                      }
                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                    />
                  </div>
                ) : null}
              </article>
              <article className='grid grid-cols-1 lg:grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <div className='flex flex-row justify-start lg:col-span-2 items-center'>
                  <h1 className='text-base font-bold flex flex-row pl-5 mr-5'>
                    Nasihat Kesihatan Pergigian
                  </h1>
                </div>
                <div className='grid grid-cols-[1fr_2fr] outline outline-1 outline-userBlack'>
                  <div className='col-span-2 flex flex-row pl-5 pt-2 text-lg font-semibold'>
                    <input
                      type='checkbox'
                      name='plak-gigi-nasihat-kesihatan-pergigian-bahagian-b'
                      id='plak-gigi-nasihat-kesihatan-pergigian-bahagian-b'
                      checked={plakGigiNasihatKesihatanPergigianBahagianB}
                      onChange={() =>
                        setPlakGigiNasihatKesihatanPergigianBahagianB(
                          !plakGigiNasihatKesihatanPergigianBahagianB
                        )
                      }
                    />
                    <label
                      htmlFor='plak-gigi-nasihat-kesihatan-pergigian-bahagian-b'
                      className='ml-2 mr-5 text-sm'
                    >
                      Plak Gigi
                    </label>
                  </div>
                  <label
                    htmlFor='bilangan-aktiviti-plak-gigi-nasihat-kesihatan-pergigian-bahagian-b'
                    className='ml-2 mr-3 text-sm flex items-center justify-end'
                  >
                    bilangan aktiviti
                  </label>
                  <input
                    type='number'
                    name='bilangan-aktiviti-plak-gigi-nasihat-kesihatan-pergigian-bahagian-b'
                    id='bilangan-aktiviti-plak-gigi-nasihat-kesihatan-pergigian-bahagian-b'
                    min='0'
                    value={bilanganAktivitiPlakGigiBahagianB}
                    onChange={(e) =>
                      setBilanganAktivitiPlakGigiBahagianB(e.target.value)
                    }
                    className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                  />
                  <label
                    htmlFor='bilangan-peserta-plak-gigi-nasihat-kesihatan-pergigian-bahagian-b'
                    className='ml-2 mr-3 text-sm flex items-center justify-end'
                  >
                    bilangan peserta
                  </label>
                  <input
                    type='number'
                    name='bilangan-peserta-plak-gigi-nasihat-kesihatan-pergigian-bahagian-b'
                    id='bilangan-peserta-plak-gigi-nasihat-kesihatan-pergigian-bahagian-b'
                    min='0'
                    value={bilanganPesertaPlakGigiBahagianB}
                    onChange={(e) =>
                      setBilanganPesertaPlakGigiBahagianB(e.target.value)
                    }
                    className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                  />
                </div>
                <div className='grid grid-cols-[1fr_2fr] outline outline-1 outline-userBlack'>
                  <div className='col-span-2 flex flex-row pl-5 pt-2 text-lg font-semibold'>
                    <input
                      type='checkbox'
                      name='diet-pemakanan-nasihat-kesihatan-pergigian-bahagian-b'
                      id='diet-pemakanan-nasihat-kesihatan-pergigian-bahagian-b'
                      checked={dietPemakananNasihatKesihatanPergigianBahagianB}
                      onChange={() =>
                        setDietPemakananNasihatKesihatanPergigianBahagianB(
                          !dietPemakananNasihatKesihatanPergigianBahagianB
                        )
                      }
                    />
                    <label
                      htmlFor='diet-pemakanan-nasihat-kesihatan-pergigian-bahagian-b'
                      className='ml-2 mr-5 text-sm'
                    >
                      Diet Pemakanan
                    </label>
                  </div>
                  <label
                    htmlFor='bilangan-aktiviti-diet-pemakanan-nasihat-kesihatan-pergigian-bahagian-b'
                    className='ml-2 mr-3 text-sm flex items-center justify-end'
                  >
                    bilangan aktiviti
                  </label>
                  <input
                    type='number'
                    name='bilangan-aktiviti-diet-pemakanan-nasihat-kesihatan-pergigian-bahagian-b'
                    id='bilangan-aktiviti-diet-pemakanan-nasihat-kesihatan-pergigian-bahagian-b'
                    min='0'
                    value={bilanganAktivitiDietPemakananBahagianB}
                    onChange={(e) =>
                      setBilanganAktivitiDietPemakananBahagianB(e.target.value)
                    }
                    className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                  />
                  <label
                    htmlFor='bilangan-peserta-diet-pemakanan-nasihat-kesihatan-pergigian-bahagian-b'
                    className='ml-2 mr-3 text-sm flex items-center justify-end'
                  >
                    bilangan peserta
                  </label>
                  <input
                    type='number'
                    name='bilangan-peserta-diet-pemakanan-nasihat-kesihatan-pergigian-bahagian-b'
                    id='bilangan-peserta-diet-pemakanan-nasihat-kesihatan-pergigian-bahagian-b'
                    min='0'
                    value={bilanganPesertaDietPemakananBahagianB}
                    onChange={(e) =>
                      setBilanganPesertaDietPemakananBahagianB(e.target.value)
                    }
                    className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                  />
                </div>
                <div className='grid grid-cols-[1fr_2fr] outline outline-1 outline-userBlack'>
                  <div className='col-span-2 flex flex-row pl-5 pt-2 text-lg font-semibold'>
                    <input
                      type='checkbox'
                      name='penjagaan-kesihatan-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                      id='penjagaan-kesihatan-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                      checked={
                        penjagaanKesihatanMulutNasihatKesihatanPergigianBahagianB
                      }
                      onChange={() =>
                        setPenjagaanKesihatanMulutNasihatKesihatanPergigianBahagianB(
                          !penjagaanKesihatanMulutNasihatKesihatanPergigianBahagianB
                        )
                      }
                    />
                    <label
                      htmlFor='penjagaan-kesihatan-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                      className='ml-2 mr-5 text-sm'
                    >
                      Penjagaan Kesihatan Mulut
                    </label>
                  </div>
                  <label
                    htmlFor='bilangan-aktiviti-penjagaan-kesihatan-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                    className='ml-2 mr-3 text-sm flex items-center justify-end'
                  >
                    bilangan aktiviti
                  </label>
                  <input
                    type='number'
                    name='bilangan-aktiviti-penjagaan-kesihatan-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                    id='bilangan-aktiviti-penjagaan-kesihatan-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                    min='0'
                    value={bilanganAktivitiPenjagaanKesihatanMulutBahagianB}
                    onChange={(e) =>
                      setBilanganAktivitiPenjagaanKesihatanMulutBahagianB(
                        e.target.value
                      )
                    }
                    className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                  />
                  <label
                    htmlFor='bilangan-peserta-penjagaan-kesihatan-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                    className='ml-2 mr-3 text-sm flex items-center justify-end'
                  >
                    bilangan peserta
                  </label>
                  <input
                    type='number'
                    name='bilangan-peserta-penjagaan-kesihatan-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                    id='bilangan-peserta-penjagaan-kesihatan-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                    min='0'
                    value={bilanganPesertaPenjagaanKesihatanMulutBahagianB}
                    onChange={(e) =>
                      setBilanganPesertaPenjagaanKesihatanMulutBahagianB(
                        e.target.value
                      )
                    }
                    className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                  />
                </div>
                <div className='grid grid-cols-[1fr_2fr] outline outline-1 outline-userBlack'>
                  <div className='col-span-2 flex flex-row pl-5 pt-2 text-lg font-semibold'>
                    <input
                      type='checkbox'
                      name='kanser-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                      id='kanser-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                      checked={kanserMulutNasihatKesihatanPergigianBahagianB}
                      onChange={() =>
                        setKanserMulutNasihatKesihatanPergigianBahagianB(
                          !kanserMulutNasihatKesihatanPergigianBahagianB
                        )
                      }
                    />
                    <label
                      htmlFor='kanser-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                      className='ml-2 mr-5 text-sm'
                    >
                      Kanser Mulut
                    </label>
                  </div>
                  <label
                    htmlFor='bilangan-aktiviti-kanser-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                    className='ml-2 mr-3 text-sm flex items-center justify-end'
                  >
                    bilangan aktiviti
                  </label>
                  <input
                    type='number'
                    name='bilangan-aktiviti-kanser-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                    id='bilangan-aktiviti-kanser-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                    min='0'
                    value={bilanganAktivitiKanserMulutBahagianB}
                    onChange={(e) =>
                      setBilanganAktivitiKanserMulutBahagianB(e.target.value)
                    }
                    className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                  />
                  <label
                    htmlFor='bilangan-peserta-kanser-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                    className='ml-2 mr-3 text-sm flex items-center justify-end'
                  >
                    bilangan peserta
                  </label>
                  <input
                    type='number'
                    name='bilangan-peserta-kanser-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                    id='bilangan-peserta-kanser-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                    min='0'
                    value={bilanganPesertaKanserMulutBahagianB}
                    onChange={(e) =>
                      setBilanganPesertaKanserMulutBahagianB(e.target.value)
                    }
                    className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                  />
                </div>
              </article>
              <article className='grid grid-cols-1 lg:grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <div className='flex flex-row justify-start lg:col-span-2 items-center'>
                  <h1 className='text-base font-bold flex flex-row pl-5 mr-5'>
                    Intervensi Tabiat Berisiko Tinggi
                  </h1>
                </div>
                <div className='grid grid-cols-[1fr_2fr] outline outline-1 outline-userBlack'>
                  <div className='col-span-2 flex flex-row pl-5 pt-2 text-lg font-semibold'>
                    <input
                      type='checkbox'
                      name='merokok-intervensi-tabiat-berisiko-tinggi'
                      id='merokok-intervensi-tabiat-berisiko-tinggi'
                      checked={merokokIntervensiTabiatBerisikoTinggi}
                      onChange={() =>
                        setMerokokIntervensiTabiatBerisikoTinggi(
                          !merokokIntervensiTabiatBerisikoTinggi
                        )
                      }
                    />
                    <label
                      htmlFor='merokok-intervensi-tabiat-berisiko-tinggi'
                      className='ml-2 mr-5 text-sm'
                    >
                      Merokok
                    </label>
                  </div>
                  <label
                    htmlFor='bilangan-aktiviti-merokok-intervensi-tabiat-berisiko-tinggi'
                    className='ml-2 mr-3 text-sm flex items-center justify-end'
                  >
                    bilangan aktiviti
                  </label>
                  <input
                    type='number'
                    name='bilangan-aktiviti-merokok-intervensi-tabiat-berisiko-tinggi'
                    id='bilangan-aktiviti-merokok-intervensi-tabiat-berisiko-tinggi'
                    min='0'
                    value={
                      bilanganAktivitiMerokokIntervensiTabiatBerisikoTinggi
                    }
                    onChange={(e) =>
                      setBilanganAktivitiMerokokIntervensiTabiatBerisikoTinggi(
                        e.target.value
                      )
                    }
                    className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                  />
                  <label
                    htmlFor='bilangan-peserta-merokok-intervensi-tabiat-berisiko-tinggi'
                    className='ml-2 mr-3 text-sm flex items-center justify-end'
                  >
                    bilangan peserta
                  </label>
                  <input
                    type='number'
                    name='bilangan-peserta-merokok-intervensi-tabiat-berisiko-tinggi'
                    id='bilangan-peserta-merokok-intervensi-tabiat-berisiko-tinggi'
                    min='0'
                    value={bilanganPesertaMerokokIntervensiTabiatBerisikoTinggi}
                    onChange={(e) =>
                      setBilanganPesertaMerokokIntervensiTabiatBerisikoTinggi(
                        e.target.value
                      )
                    }
                    className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                  />
                </div>
                <div className='grid grid-cols-[1fr_2fr] outline outline-1 outline-userBlack'>
                  <div className='col-span-2 flex flex-row pl-5 pt-2 text-lg font-semibold'>
                    <input
                      type='checkbox'
                      name='mengunyah-sirih-intervensi-tabiat-berisiko-tinggi'
                      id='mengunyah-sirih-intervensi-tabiat-berisiko-tinggi'
                      checked={mengunyahSirihIntervensiTabiatBerisikoTinggi}
                      onChange={() =>
                        setMengunyahSirihIntervensiTabiatBerisikoTinggi(
                          !mengunyahSirihIntervensiTabiatBerisikoTinggi
                        )
                      }
                    />
                    <label
                      htmlFor='mengunyah-sirih-intervensi-tabiat-berisiko-tinggi'
                      className='ml-2 mr-5 text-sm'
                    >
                      Mengunyah Sirih
                    </label>
                  </div>
                  <label
                    htmlFor='bilangan-aktiviti-mengunyah-sirih-intervensi-tabiat-berisiko-tinggi'
                    className='ml-2 mr-3 text-sm flex items-center justify-end'
                  >
                    bilangan aktiviti
                  </label>
                  <input
                    type='number'
                    name='bilangan-aktiviti-mengunyah-sirih-intervensi-tabiat-berisiko-tinggi'
                    id='bilangan-aktiviti-mengunyah-sirih-intervensi-tabiat-berisiko-tinggi'
                    min='0'
                    value={
                      bilanganAktivitiMengunyahSirihIntervensiTabiatBerisikoTinggi
                    }
                    onChange={(e) =>
                      setBilanganAktivitiMengunyahSirihIntervensiTabiatBerisikoTinggi(
                        e.target.value
                      )
                    }
                    className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                  />
                  <label
                    htmlFor='bilangan-peserta-mengunyah-sirih-intervensi-tabiat-berisiko-tinggi'
                    className='ml-2 mr-3 text-sm flex items-center justify-end'
                  >
                    bilangan peserta
                  </label>
                  <input
                    type='number'
                    name='bilangan-peserta-mengunyah-sirih-intervensi-tabiat-berisiko-tinggi'
                    id='bilangan-peserta-mengunyah-sirih-intervensi-tabiat-berisiko-tinggi'
                    min='0'
                    value={
                      bilanganPesertaMengunyahSirihIntervensiTabiatBerisikoTinggi
                    }
                    onChange={(e) =>
                      setBilanganPesertaMengunyahSirihIntervensiTabiatBerisikoTinggi(
                        e.target.value
                      )
                    }
                    className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                  />
                </div>
                <div className='grid grid-cols-[1fr_2fr] outline outline-1 outline-userBlack'>
                  <div className='col-span-2 flex flex-row pl-5 pt-2 text-lg font-semibold'>
                    <input
                      type='checkbox'
                      name='alkohol-intervensi-tabiat-berisiko-tinggi'
                      id='alkohol-intervensi-tabiat-berisiko-tinggi'
                      checked={alkoholIntervensiTabiatBerisikoTinggi}
                      onChange={() =>
                        setAlkoholIntervensiTabiatBerisikoTinggi(
                          !alkoholIntervensiTabiatBerisikoTinggi
                        )
                      }
                    />
                    <label
                      htmlFor='alkohol-intervensi-tabiat-berisiko-tinggi'
                      className='ml-2 mr-5 text-sm'
                    >
                      Alkohol
                    </label>
                  </div>
                  <label
                    htmlFor='bilangan-aktiviti-alkohol-intervensi-tabiat-berisiko-tinggi'
                    className='ml-2 mr-3 text-sm flex items-center justify-end'
                  >
                    bilangan aktiviti
                  </label>
                  <input
                    type='number'
                    name='bilangan-aktiviti-alkohol-intervensi-tabiat-berisiko-tinggi'
                    id='bilangan-aktiviti-alkohol-intervensi-tabiat-berisiko-tinggi'
                    min='0'
                    value={
                      bilanganAktivitiAlkoholIntervensiTabiatBerisikoTinggi
                    }
                    onChange={(e) =>
                      setBilanganAktivitiAlkoholIntervensiTabiatBerisikoTinggi(
                        e.target.value
                      )
                    }
                    className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                  />
                  <label
                    htmlFor='bilangan-peserta-alkohol-intervensi-tabiat-berisiko-tinggi'
                    className='ml-2 mr-3 text-sm flex items-center justify-end'
                  >
                    bilangan peserta
                  </label>
                  <input
                    type='number'
                    name='bilangan-peserta-alkohol-intervensi-tabiat-berisiko-tinggi'
                    id='bilangan-peserta-alkohol-intervensi-tabiat-berisiko-tinggi'
                    min='0'
                    value={bilanganPesertaAlkoholIntervensiTabiatBerisikoTinggi}
                    onChange={(e) =>
                      setBilanganPesertaAlkoholIntervensiTabiatBerisikoTinggi(
                        e.target.value
                      )
                    }
                    className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                  />
                </div>
                <div className='grid grid-cols-[1fr_2fr] outline outline-1 outline-userBlack'>
                  <div className='col-span-2 flex flex-row pl-5 pt-2 text-lg font-semibold'>
                    <input
                      type='checkbox'
                      name='lain-lain-intervensi-tabiat-berisiko-tinggi'
                      id='lain-lain-intervensi-tabiat-berisiko-tinggi'
                      checked={lainLainIntervensiTabiatBerisikoTinggi}
                      onChange={() =>
                        setLainLainIntervensiTabiatBerisikoTinggi(
                          !lainLainIntervensiTabiatBerisikoTinggi
                        )
                      }
                    />
                    <label
                      htmlFor='lain-lain-intervensi-tabiat-berisiko-tinggi'
                      className='ml-2 mr-5 text-sm'
                    >
                      Lain-lain
                    </label>
                  </div>
                  <label
                    htmlFor='bilangan-aktiviti-lain-lain-intervensi-tabiat-berisiko-tinggi'
                    className='ml-2 mr-3 text-sm flex items-center justify-end'
                  >
                    bilangan aktiviti
                  </label>
                  <input
                    type='number'
                    name='bilangan-aktiviti-lain-lain-intervensi-tabiat-berisiko-tinggi'
                    id='bilangan-aktiviti-lain-lain-intervensi-tabiat-berisiko-tinggi'
                    min='0'
                    value={
                      bilanganAktivitiLainLainIntervensiTabiatBerisikoTinggi
                    }
                    onChange={(e) =>
                      setBilanganAktivitiLainLainIntervensiTabiatBerisikoTinggi(
                        e.target.value
                      )
                    }
                    className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                  />
                  <label
                    htmlFor='bilangan-peserta-lain-lain-intervensi-tabiat-berisiko-tinggi'
                    className='ml-2 mr-3 text-sm flex items-center justify-end'
                  >
                    bilangan peserta
                  </label>
                  <input
                    type='number'
                    name='bilangan-peserta-lain-lain-intervensi-tabiat-berisiko-tinggi'
                    id='bilangan-peserta-lain-lain-intervensi-tabiat-berisiko-tinggi'
                    min='0'
                    value={
                      bilanganPesertaLainLainIntervensiTabiatBerisikoTinggi
                    }
                    onChange={(e) =>
                      setBilanganPesertaLainLainIntervensiTabiatBerisikoTinggi(
                        e.target.value
                      )
                    }
                    className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                  />
                </div>
              </article>
            </section>
            <div className='grid grid-cols-1 md:grid-cols-3 col-start-1 lg:col-start-2 gap-2 col-span-1 md:col-span-2'>
              <span
                onClick={() => {
                  window.opener = null;
                  window.open('', '_self');
                  window.close();
                }}
                className='flex bg-user3 p-2 w-full capitalize justify-center hover:bg-user1 hover:text-userWhite transition-all hover:cursor-pointer'
              >
                tutup
              </span>
              <input
                type='reset'
                value='reset'
                className='flex bg-user3 p-2 w-full capitalize justify-center hover:bg-user1 hover:text-userWhite transition-all hover:cursor-pointer'
              />
              <button
                type='submit'
                className='flex bg-user3 p-2 w-full capitalize justify-center hover:bg-user1 hover:text-userWhite transition-all'
              >
                hantar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default UserFormPromosi;
