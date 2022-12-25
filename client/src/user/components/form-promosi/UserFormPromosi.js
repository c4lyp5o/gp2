import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import moment from 'moment';

import { useGlobalUserAppContext } from '../../context/userAppContext';

import UserFormPromosiConfirmation from '../UserFormPromosiConfirmation';

const optionsBahagianB = [
  { value: 'ceramah', label: 'Ceramah' },
  { value: 'lmg', label: 'Latihan Memberus Gigi' },
  { value: 'pameran-kempen', label: 'Pameran / Kempen' },
  { value: 'pertunjukan-boneka', label: 'Pertunjukan Boneka' },
  { value: 'main-peranan', label: 'Main Peranan' },
  { value: 'bercerita', label: 'Bercerita' },
  { value: 'pertandingan', label: 'Pertandingan' },
  { value: 'permainan-interaktif', label: 'Permainan Interaktif' },
  { value: 'kursus-seminar-bengkel', label: 'Kursus / Seminar / Bengkel' },
  { value: 'pertunjukan-multimedia', label: 'Pertunjukan Multimedia' },
  { value: 'dental-buskers', label: 'Dental Buskers' },
  { value: 'flashmob', label: 'Flashmob' },
  { value: 'lawatan-ke-rumah', label: 'Lawatan Ke Rumah' },
  {
    value: 'nasihat-kesihatan-pergigian',
    label: 'Nasihat Kesihatan Pergigian',
  },
  { value: 'intervensi-tabiat', label: 'Intervensi Tabiat Berisiko Tinggi' },
];

const optionsIndividu = [
  { value: 'ceramah', label: 'Ceramah' },
  { value: 'lmg', label: 'Latihan Memberus Gigi' },
  { value: 'pameran-kempen', label: 'Pameran / Kempen' },
  { value: 'pertunjukan-boneka', label: 'Pertunjukan Boneka' },
  { value: 'main-peranan', label: 'Main Peranan' },
  {
    value: 'nasihat-kesihatan-pergigian',
    label: 'Nasihat Kesihatan Pergigian',
  },
  { value: 'intervensi-tabiat', label: 'Intervensi Tabiat Berisiko Tinggi' },
];

function UserFormPromosi({ individuOrKlinik }) {
  const { userToken, reliefUserToken, useParams, toast } =
    useGlobalUserAppContext();

  const { aktivitiId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [allProgramPromosi, setAllProgramPromosi] = useState([]);
  const [singleAktivitiPromosi, setSingleAktivitiPromosi] = useState([]);

  const [pilihanPromosi, setPilihanPromosi] = useState([]);

  useEffect(() => {
    const fetchAllProgramPromosi = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get('/api/v1/promosi', {
          headers: {
            Authorization: `Bearer ${
              reliefUserToken ? reliefUserToken : userToken
            }`,
          },
        });
        setAllProgramPromosi(data.allProgramPromosi);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllProgramPromosi();
  }, []);

  useEffect(() => {
    const fetchSingleAktivitiPromosi = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `/api/v1/promosi/aktiviti/${aktivitiId}`,
          {
            headers: {
              Authorization: `Bearer ${
                reliefUserToken ? reliefUserToken : userToken
              }`,
            },
          }
        );
        setSingleAktivitiPromosi(data.singleAktivitiPromosi);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleAktivitiPromosi();
  }, []);

  const handleSubmit = async (e) => {
    await toast
      .promise(
        axios.patch(
          `/api/v1/promosi/aktiviti/${aktivitiId}`,
          { ...singleAktivitiPromosi, statusReten: 'telah diisi' },
          {
            headers: {
              Authorization: `Bearer ${
                reliefUserToken ? reliefUserToken : userToken
              }`,
            },
          }
        ),
        {
          pending: 'Menghantar...',
          success: 'Maklumat acara berjaya dihantar',
          error: 'Maklumat acara gagal dihantar',
        },
        {
          autoClose: 2000,
        }
      )
      .then(() => {
        toast.info(`Tab akan ditutup dalam masa 3 saat...`, {
          autoClose: 2000,
        });
        setTimeout(() => {
          window.opener = null;
          window.open('', '_self');
          window.close();
        }, 3000);
      });
  };

  let isDisabled = false;
  if (singleAktivitiPromosi.statusReten === 'telah diisi') {
    isDisabled = true;
  }

  return (
    <>
      <div className='h-full p-1 grid grid-rows-[1fr_7fr]'>
        {/* maklumat acara */}
        <div className='p-2'>
          <article className='outline outline-1 outline-userBlack'>
            <div className='flex flex-col'>
              <div>
                <h1 className='text-sm lg:text-base font-bold flex flex-row pl-5'>
                  maklumat acara
                </h1>
              </div>
              <div className='grid grid-cols-1 lg:grid-cols-2'>
                <p className='text-xs lg:text-sm flex flex-row items-center pl-5 whitespace-nowrap'>
                  jenis program :
                  <a className='whitespace-pre-wrap'>
                    {allProgramPromosi
                      .filter((p) =>
                        p.kodProgram.includes(singleAktivitiPromosi.kodProgram)
                      )
                      .map((p) => {
                        return <span className='ml-1'>{p.jenisProgram}</span>;
                      })}
                  </a>
                </p>
                <p className='text-xs lg:text-sm flex flex-row items-center pl-5 whitespace-nowrap'>
                  nama acara :
                  <span className='ml-1 whitespace-pre-wrap'>
                    {singleAktivitiPromosi.namaAcara}
                  </span>
                </p>
              </div>
              <div className='grid grid-cols-1 lg:grid-cols-2'>
                <p className='text-xs lg:text-sm flex flex-row items-center pl-5'>
                  tarikh mula :{' '}
                  {moment(singleAktivitiPromosi.tarikhMula).format(
                    'DD/MM/YYYY'
                  )}
                </p>
                <p className='text-xs lg:text-sm flex flex-row items-center pl-5'>
                  tarikh akhir :{' '}
                  {moment(singleAktivitiPromosi.tarikhAkhir).format(
                    'DD/MM/YYYY'
                  )}
                </p>
              </div>
            </div>
          </article>
        </div>
        {/* form promosi */}
        <div className='grid h-full overflow-scroll overflow-x-hidden gap-2 px-1'>
          <UserFormPromosiConfirmation
            data={singleAktivitiPromosi}
            callbackFunction={handleSubmit}
          >
            {(confirm) => (
              <form onSubmit={confirm(handleSubmit)}>
                <section className='grid grid-cols-1 gap-2 mt-3 mb-3 w-full col-span-2'>
                  <article className='grid grid-cols-1 lg:grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <div className='flex flex-col md:flex-row justify-start lg:col-span-2 items-center'>
                      <h1 className='text-base font-bold flex flex-row pl-5 mr-5'>
                        Adakah acara terlibat dengan media massa?
                        <span className='text-user6'>*</span>
                      </h1>
                      <div className='flex flex-row justify-start'>
                        <input
                          disabled={isDisabled}
                          required
                          type='radio'
                          name='media-massa'
                          id='media-massa-ya'
                          value='media-massa-ya'
                          checked={
                            singleAktivitiPromosi.mediaMassa ===
                            'media-massa-ya'
                              ? true
                              : false
                          }
                          onChange={(e) =>
                            setSingleAktivitiPromosi({
                              ...singleAktivitiPromosi,
                              mediaMassa: e.target.value,
                            })
                          }
                          className='peer'
                        />
                        <label
                          htmlFor='media-massa-ya'
                          className='peer-checked:bg-user1 peer-checked:bg-opacity-5 ml-2 mr-5 text-sm px-2 py-1 rounded-md cursor-pointer '
                        >
                          Ya
                        </label>
                      </div>
                      <div className='flex flex-row justify-start'>
                        <input
                          disabled={isDisabled}
                          required
                          type='radio'
                          name='media-massa'
                          id='media-massa-tidak'
                          value='media-massa-tidak'
                          checked={
                            singleAktivitiPromosi.mediaMassa ===
                            'media-massa-tidak'
                              ? true
                              : false
                          }
                          onChange={(e) =>
                            setSingleAktivitiPromosi({
                              ...singleAktivitiPromosi,
                              mediaMassa: e.target.value,
                            })
                          }
                          className='peer'
                        />
                        <label
                          htmlFor='media-massa-tidak'
                          className='peer-checked:bg-user1 peer-checked:bg-opacity-5 ml-2 mr-5 text-sm px-2 py-1 rounded-md cursor-pointer'
                        >
                          Tidak
                        </label>
                      </div>
                    </div>
                    {singleAktivitiPromosi.mediaMassa === 'media-massa-ya' && (
                      <div className='outline outline-1 outline-user1 rounded-md'>
                        <h1 className='flex flex-row text-base font-semibold pl-5'>
                          televisyen
                        </h1>
                        <div className='grid grid-cols-[1fr_3fr]'>
                          <p className='text-sm font-medium flex items-center justify-start pl-5'>
                            Bil. Aktiviti :
                          </p>
                          <input
                            disabled={isDisabled}
                            type='number'
                            name='bilangan-aktiviti-televisyen'
                            id='bilangan-aktiviti-televisyen'
                            min='0'
                            value={
                              singleAktivitiPromosi.bilanganAktivitiTelevisyen
                            }
                            onChange={(e) =>
                              setSingleAktivitiPromosi({
                                ...singleAktivitiPromosi,
                                bilanganAktivitiTelevisyen: e.target.value,
                              })
                            }
                            className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          />
                          <p className='text-sm font-medium flex items-center justify-start pl-5'>
                            Bil. Peserta :
                          </p>
                          <input
                            disabled={isDisabled}
                            type='number'
                            name='bilangan-peserta-televisyen'
                            id='bilangan-peserta-televisyen'
                            min='0'
                            value={
                              singleAktivitiPromosi.bilanganPesertaTelevisyen
                            }
                            onChange={(e) =>
                              setSingleAktivitiPromosi({
                                ...singleAktivitiPromosi,
                                bilanganPesertaTelevisyen: e.target.value,
                              })
                            }
                            className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          />
                        </div>
                      </div>
                    )}
                    {singleAktivitiPromosi.mediaMassa === 'media-massa-ya' && (
                      <div className='outline outline-1 outline-user1 rounded-md'>
                        <h1 className='flex flex-row text-base font-semibold pl-5'>
                          radio
                        </h1>
                        <div className='grid grid-cols-[1fr_3fr]'>
                          <p className='text-sm font-medium flex items-center justify-start pl-5'>
                            Bil. Aktiviti :
                          </p>
                          <input
                            disabled={isDisabled}
                            type='number'
                            name='bilangan-aktiviti-radio'
                            id='bilangan-aktiviti-radio'
                            min='0'
                            value={singleAktivitiPromosi.bilanganAktivitiRadio}
                            onChange={(e) =>
                              setSingleAktivitiPromosi({
                                ...singleAktivitiPromosi,
                                bilanganAktivitiRadio: e.target.value,
                              })
                            }
                            className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          />
                          <p className='text-sm font-medium flex items-center justify-start pl-5'>
                            Bil. Peserta :
                          </p>
                          <input
                            disabled={isDisabled}
                            type='number'
                            name='bilangan-peserta-radio'
                            id='bilangan-peserta-radio'
                            min='0'
                            value={singleAktivitiPromosi.bilanganPesertaRadio}
                            onChange={(e) =>
                              setSingleAktivitiPromosi({
                                ...singleAktivitiPromosi,
                                bilanganPesertaRadio: e.target.value,
                              })
                            }
                            className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          />
                        </div>
                      </div>
                    )}
                    {singleAktivitiPromosi.mediaMassa === 'media-massa-ya' && (
                      <div className='outline outline-1 outline-user1 rounded-md'>
                        <h1 className='flex flex-row text-base font-semibold pl-5'>
                          cetak
                        </h1>
                        <div className='grid grid-cols-[1fr_3fr]'>
                          <p className='text-sm font-medium flex items-center justify-start pl-5'>
                            Bil. Aktiviti :
                          </p>
                          <input
                            disabled={isDisabled}
                            type='number'
                            name='bilangan-aktiviti-cetak'
                            id='bilangan-aktiviti-cetak'
                            min='0'
                            value={singleAktivitiPromosi.bilanganAktivitiCetak}
                            onChange={(e) =>
                              setSingleAktivitiPromosi({
                                ...singleAktivitiPromosi,
                                bilanganAktivitiCetak: e.target.value,
                              })
                            }
                            className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          />
                        </div>
                      </div>
                    )}
                  </article>
                  <article className='grid grid-cols-1 lg:grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <div className='flex flex-row justify-start lg:col-span-2 items-center'>
                      <h1 className='text-base font-bold flex flex-row pl-5 mr-5'>
                        aktiviti pendidikan kesihatan pergigian yang dijalankan
                      </h1>
                    </div>
                    {singleAktivitiPromosi.statusReten !== 'telah diisi' ? (
                      <article className='grid border border-userBlack pl-3 px-2 p-2 rounded-md lg:col-span-2'>
                        <h1 className='flex flex-row text-base font-semibold p-1'>
                          Pilihan Aktiviti yang dijalankan
                        </h1>
                        <Select
                          isMulti
                          name='bahagian-b'
                          options={
                            individuOrKlinik === 'promosi-individu'
                              ? optionsIndividu
                              : optionsBahagianB
                          }
                          className='basic-multi-select'
                          classNamePrefix='select'
                          onChange={(e) => {
                            setPilihanPromosi(e.map((item) => item.value));
                          }}
                        />
                      </article>
                    ) : null}
                    {pilihanPromosi.includes('ceramah') ||
                    singleAktivitiPromosi.ceramahBahagianA ? (
                      <div className='grid grid-cols-[1fr_2fr] shadow-md'>
                        <div className='col-span-2 p-1 relative w-full'>
                          <input
                            disabled={isDisabled}
                            type='checkbox'
                            name='ceramah-bahagian-a'
                            id='ceramah-bahagian-a'
                            checked={singleAktivitiPromosi.ceramahBahagianA}
                            onChange={() =>
                              setSingleAktivitiPromosi({
                                ...singleAktivitiPromosi,
                                ceramahBahagianA:
                                  !singleAktivitiPromosi.ceramahBahagianA,
                              })
                            }
                            className='hidden peer'
                          />
                          <label
                            htmlFor='ceramah-bahagian-a'
                            className='text-sm text-start peer-checked:ring-2 peer-checked:ring-user2 text-userBlack text-opacity-70 px-32 py-1 bg-user4 rounded-md cursor-pointer focus:outline-none peer-checked:border-none'
                          >
                            Ceramah
                          </label>
                        </div>
                        {singleAktivitiPromosi.ceramahBahagianA && (
                          <div className='flex flex-col justify-start col-span-2'>
                            <div className='grid grid-cols-[1fr_2fr]'>
                              <div className='flex flex-row justify-end m-2'>
                                <label
                                  htmlFor='baru-ceramah-bahagian-a'
                                  className='ml-2 mr-5 text-sm flex items-center'
                                >
                                  Baru
                                </label>
                                <input
                                  disabled={isDisabled}
                                  type='checkbox'
                                  name='baru-ceramah-bahagian-a'
                                  id='baru-ceramah-bahagian-a'
                                  checked={
                                    singleAktivitiPromosi.baruCeramahBahagianA
                                  }
                                  onChange={() =>
                                    setSingleAktivitiPromosi({
                                      ...singleAktivitiPromosi,
                                      baruCeramahBahagianA:
                                        !singleAktivitiPromosi.baruCeramahBahagianA,
                                    })
                                  }
                                />
                              </div>
                              {singleAktivitiPromosi.baruCeramahBahagianA && (
                                <div>
                                  <div>
                                    <label
                                      htmlFor='bilangan-aktiviti-baru-ceramah-bahagian-a'
                                      className='ml-2 mr-3 text-sm'
                                    >
                                      bilangan aktiviti
                                    </label>
                                    <input
                                      disabled={isDisabled}
                                      type='number'
                                      name='bilangan-aktiviti-baru-ceramah-bahagian-a'
                                      id='bilangan-aktiviti-baru-ceramah-bahagian-a'
                                      min='0'
                                      value={
                                        singleAktivitiPromosi.bilanganAktivitiBaruCeramahBahagianA
                                      }
                                      onChange={(e) =>
                                        setSingleAktivitiPromosi({
                                          ...singleAktivitiPromosi,
                                          bilanganAktivitiBaruCeramahBahagianA:
                                            e.target.value,
                                        })
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
                                      disabled={isDisabled}
                                      type='number'
                                      name='bilangan-peserta-baru-ceramah-bahagian-a'
                                      id='bilangan-peserta-baru-ceramah-bahagian-a'
                                      min='0'
                                      value={
                                        singleAktivitiPromosi.bilanganPesertaBaruCeramahBahagianA
                                      }
                                      onChange={(e) =>
                                        setSingleAktivitiPromosi({
                                          ...singleAktivitiPromosi,
                                          bilanganPesertaBaruCeramahBahagianA:
                                            e.target.value,
                                        })
                                      }
                                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className='grid grid-cols-[1fr_2fr]'>
                              {allProgramPromosi
                                .filter((p) =>
                                  p.kodProgram.includes(
                                    singleAktivitiPromosi.kodProgram
                                  )
                                )
                                .find(
                                  (p) => p.jenisProgram === 'Kumpulan Sasar'
                                ) && (
                                <div className='flex flex-row justify-end m-2'>
                                  <label
                                    htmlFor='ulang-ceramah-bahagian-a'
                                    className='ml-2 mr-5 text-sm flex items-center'
                                  >
                                    Ulangan
                                  </label>
                                  <input
                                    disabled={isDisabled}
                                    type='checkbox'
                                    name='ulang-ceramah-bahagian-a'
                                    id='ulang-ceramah-bahagian-a'
                                    checked={
                                      singleAktivitiPromosi.ulangCeramahBahagianA
                                    }
                                    onChange={() =>
                                      setSingleAktivitiPromosi({
                                        ...singleAktivitiPromosi,
                                        ulangCeramahBahagianA:
                                          !singleAktivitiPromosi.ulangCeramahBahagianA,
                                      })
                                    }
                                  />
                                </div>
                              )}
                              {singleAktivitiPromosi.ulangCeramahBahagianA && (
                                <div>
                                  <div>
                                    <label
                                      htmlFor='bilangan-aktiviti-ulang-ceramah-bahagian-a'
                                      className='ml-2 mr-3 text-sm'
                                    >
                                      bilangan aktiviti
                                    </label>
                                    <input
                                      disabled={isDisabled}
                                      type='number'
                                      name='bilangan-aktiviti-ulang-ceramah-bahagian-a'
                                      id='bilangan-aktiviti-ulang-ceramah-bahagian-a'
                                      min='0'
                                      value={
                                        singleAktivitiPromosi.bilanganAktivitiUlangCeramahBahagianA
                                      }
                                      onChange={(e) =>
                                        setSingleAktivitiPromosi({
                                          ...singleAktivitiPromosi,
                                          bilanganAktivitiUlangCeramahBahagianA:
                                            e.target.value,
                                        })
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
                                      disabled={isDisabled}
                                      type='number'
                                      name='bilangan-peserta-ulang-ceramah-bahagian-a'
                                      id='bilangan-peserta-ulang-ceramah-bahagian-a'
                                      min='0'
                                      value={
                                        singleAktivitiPromosi.bilanganPesertaUlangCeramahBahagianA
                                      }
                                      onChange={(e) =>
                                        setSingleAktivitiPromosi({
                                          ...singleAktivitiPromosi,
                                          bilanganPesertaUlangCeramahBahagianA:
                                            e.target.value,
                                        })
                                      }
                                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}
                    {pilihanPromosi.includes('lmg') ||
                    singleAktivitiPromosi.latihanMemberusGigiBahagianA ? (
                      <div className='grid grid-cols-[1fr_2fr] shadow-md'>
                        <div className='col-span-2 p-1 relative w-full'>
                          <input
                            disabled={isDisabled}
                            type='checkbox'
                            name='latihan-memberus-gigi-bahagian-a'
                            id='latihan-memberus-gigi-bahagian-a'
                            checked={
                              singleAktivitiPromosi.latihanMemberusGigiBahagianA
                            }
                            onChange={() =>
                              setSingleAktivitiPromosi({
                                ...singleAktivitiPromosi,
                                latihanMemberusGigiBahagianA:
                                  !singleAktivitiPromosi.latihanMemberusGigiBahagianA,
                              })
                            }
                            className='hidden peer'
                          />
                          <label
                            htmlFor='latihan-memberus-gigi-bahagian-a'
                            className='text-sm text-start peer-checked:ring-2 peer-checked:ring-user2 text-userBlack text-opacity-70 px-20 py-1 bg-user4 rounded-md cursor-pointer focus:outline-none peer-checked:border-none'
                          >
                            Latihan Memberus Gigi
                          </label>
                        </div>
                        {singleAktivitiPromosi.latihanMemberusGigiBahagianA && (
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
                                  disabled={isDisabled}
                                  type='checkbox'
                                  name='baru-latihan-memberus-gigi-bahagian-a'
                                  id='baru-latihan-memberus-gigi-bahagian-a'
                                  checked={
                                    singleAktivitiPromosi.baruLatihanMemberusGigiBahagianA
                                  }
                                  onChange={() =>
                                    setSingleAktivitiPromosi({
                                      ...singleAktivitiPromosi,
                                      baruLatihanMemberusGigiBahagianA:
                                        !singleAktivitiPromosi.baruLatihanMemberusGigiBahagianA,
                                    })
                                  }
                                />
                              </div>
                              {singleAktivitiPromosi.baruLatihanMemberusGigiBahagianA && (
                                <div>
                                  <div>
                                    <label
                                      htmlFor='bilangan-aktiviti-baru-latihan-memberus-gigi-bahagian-a'
                                      className='ml-2 mr-3 text-sm'
                                    >
                                      bilangan aktiviti
                                    </label>
                                    <input
                                      disabled={isDisabled}
                                      type='number'
                                      name='bilangan-aktiviti-baru-latihan-memberus-gigi-bahagian-a'
                                      id='bilangan-aktiviti-baru-latihan-memberus-gigi-bahagian-a'
                                      min='0'
                                      value={
                                        singleAktivitiPromosi.bilanganAktivitiBaruLatihanMemberusGigiBahagianA
                                      }
                                      onChange={(e) =>
                                        setSingleAktivitiPromosi({
                                          ...singleAktivitiPromosi,
                                          bilanganAktivitiBaruLatihanMemberusGigiBahagianA:
                                            e.target.value,
                                        })
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
                                      disabled={isDisabled}
                                      type='number'
                                      name='bilangan-peserta-baru-latihan-memberus-gigi-bahagian-a'
                                      id='bilangan-peserta-baru-latihan-memberus-gigi-bahagian-a'
                                      min='0'
                                      value={
                                        singleAktivitiPromosi.bilanganPesertaBaruLatihanMemberusGigiBahagianA
                                      }
                                      onChange={(e) =>
                                        setSingleAktivitiPromosi({
                                          ...singleAktivitiPromosi,
                                          bilanganPesertaBaruLatihanMemberusGigiBahagianA:
                                            e.target.value,
                                        })
                                      }
                                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className='grid grid-cols-[1fr_2fr]'>
                              {allProgramPromosi
                                .filter((p) =>
                                  p.kodProgram.includes(
                                    singleAktivitiPromosi.kodProgram
                                  )
                                )
                                .find(
                                  (p) => p.jenisProgram === 'Kumpulan Sasar'
                                ) && (
                                <div className='flex flex-row justify-end'>
                                  <label
                                    htmlFor='ulang-latihan-memberus-gigi-bahagian-a'
                                    className='ml-2 mr-5 text-sm flex items-center'
                                  >
                                    Ulangan
                                  </label>
                                  <input
                                    disabled={isDisabled}
                                    type='checkbox'
                                    name='ulang-latihan-memberus-gigi-bahagian-a'
                                    id='ulang-latihan-memberus-gigi-bahagian-a'
                                    checked={
                                      singleAktivitiPromosi.ulangLatihanMemberusGigiBahagianA
                                    }
                                    onChange={() =>
                                      setSingleAktivitiPromosi({
                                        ...singleAktivitiPromosi,
                                        ulangLatihanMemberusGigiBahagianA:
                                          !singleAktivitiPromosi.ulangLatihanMemberusGigiBahagianA,
                                      })
                                    }
                                  />
                                </div>
                              )}
                              {singleAktivitiPromosi.ulangLatihanMemberusGigiBahagianA && (
                                <div>
                                  <div>
                                    <label
                                      htmlFor='bilangan-aktiviti-ulang-latihan-memberus-gigi-bahagian-a'
                                      className='ml-2 mr-3 text-sm'
                                    >
                                      bilangan aktiviti
                                    </label>
                                    <input
                                      disabled={isDisabled}
                                      type='number'
                                      name='bilangan-aktiviti-ulang-latihan-memberus-gigi-bahagian-a'
                                      id='bilangan-aktiviti-ulang-latihan-memberus-gigi-bahagian-a'
                                      min='0'
                                      value={
                                        singleAktivitiPromosi.bilanganAktivitiUlangLatihanMemberusGigiBahagianA
                                      }
                                      onChange={(e) =>
                                        setSingleAktivitiPromosi({
                                          ...singleAktivitiPromosi,
                                          bilanganAktivitiUlangLatihanMemberusGigiBahagianA:
                                            e.target.value,
                                        })
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
                                      disabled={isDisabled}
                                      type='number'
                                      name='bilangan-peserta-ulang-latihan-memberus-gigi-bahagian-a'
                                      id='bilangan-peserta-ulang-latihan-memberus-gigi-bahagian-a'
                                      min='0'
                                      value={
                                        singleAktivitiPromosi.bilanganPesertaUlangLatihanMemberusGigiBahagianA
                                      }
                                      onChange={(e) =>
                                        setSingleAktivitiPromosi({
                                          ...singleAktivitiPromosi,
                                          bilanganPesertaUlangLatihanMemberusGigiBahagianA:
                                            e.target.value,
                                        })
                                      }
                                      className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}
                    {pilihanPromosi.includes('pameran-kempen') ||
                    singleAktivitiPromosi.pameranKempenBahagianB ? (
                      <div className='outline outline-1 outline-userBlack'>
                        <div className='flex flex-row pl-5 py-2 text-lg font-semibold'>
                          <input
                            disabled={isDisabled}
                            type='checkbox'
                            name='pameran-kempen-bahagian-b'
                            id='pameran-kempen-bahagian-b'
                            checked={
                              singleAktivitiPromosi.pameranKempenBahagianB
                            }
                            onChange={() =>
                              setSingleAktivitiPromosi({
                                ...singleAktivitiPromosi,
                                pameranKempenBahagianB:
                                  !singleAktivitiPromosi.pameranKempenBahagianB,
                              })
                            }
                          />
                          <label
                            htmlFor='pameran-kempen-bahagian-b'
                            className='ml-2 mr-5 text-sm'
                          >
                            Pameran / Kempen
                          </label>
                        </div>
                        {singleAktivitiPromosi.pameranKempenBahagianB && (
                          <div className='grid grid-cols-[1fr_2fr]'>
                            <label
                              htmlFor='bilangan-aktiviti-pameran-kempen-bahagian-b'
                              className='ml-2 mr-3 text-sm flex items-center justify-end'
                            >
                              bilangan aktiviti
                            </label>
                            <input
                              disabled={isDisabled}
                              type='number'
                              name='bilangan-aktiviti-pameran-kempen-bahagian-b'
                              id='bilangan-aktiviti-pameran-kempen-bahagian-b'
                              min='0'
                              value={
                                singleAktivitiPromosi.bilanganAktivitiPameranKempenBahagianB
                              }
                              onChange={(e) =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  bilanganAktivitiPameranKempenBahagianB:
                                    e.target.value,
                                })
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
                              disabled={isDisabled}
                              type='number'
                              name='bilangan-peserta-pameran-kempen-bahagian-b'
                              id='bilangan-peserta-pameran-kempen-bahagian-b'
                              min='0'
                              value={
                                singleAktivitiPromosi.bilanganPesertaPameranKempenBahagianB
                              }
                              onChange={(e) =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  bilanganPesertaPameranKempenBahagianB:
                                    e.target.value,
                                })
                              }
                              className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                          </div>
                        )}
                      </div>
                    ) : null}
                    {pilihanPromosi.includes('pertunjukan-boneka') ||
                    singleAktivitiPromosi.pertunjukanBonekaBahagianB ? (
                      <div className='outline outline-1 outline-userBlack'>
                        <div className='flex flex-row pl-5 py-2 text-lg font-semibold'>
                          <input
                            disabled={isDisabled}
                            type='checkbox'
                            name='pertunjukan-boneka-bahagian-b'
                            id='pertunjukan-boneka-bahagian-b'
                            checked={
                              singleAktivitiPromosi.pertunjukanBonekaBahagianB
                            }
                            onChange={() =>
                              setSingleAktivitiPromosi({
                                ...singleAktivitiPromosi,
                                pertunjukanBonekaBahagianB:
                                  !singleAktivitiPromosi.pertunjukanBonekaBahagianB,
                              })
                            }
                          />
                          <label
                            htmlFor='pertunjukan-boneka-bahagian-b'
                            className='ml-2 mr-5 text-sm'
                          >
                            Pertunjukan Boneka
                          </label>
                        </div>
                        {singleAktivitiPromosi.pertunjukanBonekaBahagianB && (
                          <div className='grid grid-cols-[1fr_2fr] '>
                            <label
                              htmlFor='bilangan-aktiviti-pertunjukan-boneka-bahagian-b'
                              className='ml-2 mr-3 text-sm flex items-center justify-end'
                            >
                              bilangan aktiviti
                            </label>
                            <input
                              disabled={isDisabled}
                              type='number'
                              name='bilangan-aktiviti-pertunjukan-boneka-bahagian-b'
                              id='bilangan-aktiviti-pertunjukan-boneka-bahagian-b'
                              min='0'
                              value={
                                singleAktivitiPromosi.bilanganAktivitiPertunjukanBonekaBahagianB
                              }
                              onChange={(e) =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  bilanganAktivitiPertunjukanBonekaBahagianB:
                                    e.target.value,
                                })
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
                              disabled={isDisabled}
                              type='number'
                              name='bilangan-peserta-pertunjukan-boneka-bahagian-b'
                              id='bilangan-peserta-pertunjukan-boneka-bahagian-b'
                              min='0'
                              value={
                                singleAktivitiPromosi.bilanganPesertaPertunjukanBonekaBahagianB
                              }
                              onChange={(e) =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  bilanganPesertaPertunjukanBonekaBahagianB:
                                    e.target.value,
                                })
                              }
                              className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                          </div>
                        )}
                      </div>
                    ) : null}
                    {pilihanPromosi.includes('main-peranan') ||
                    singleAktivitiPromosi.mainPerananBahagianB ? (
                      <div className='outline outline-1 outline-userBlack'>
                        <div className='flex flex-row pl-5 py-2 text-lg font-semibold'>
                          <input
                            disabled={isDisabled}
                            type='checkbox'
                            name='main-peranan-bahagian-b'
                            id='main-peranan-bahagian-b'
                            checked={singleAktivitiPromosi.mainPerananBahagianB}
                            onChange={() =>
                              setSingleAktivitiPromosi({
                                ...singleAktivitiPromosi,
                                mainPerananBahagianB:
                                  !singleAktivitiPromosi.mainPerananBahagianB,
                              })
                            }
                          />
                          <label
                            htmlFor='main-peranan-bahagian-b'
                            className='ml-2 mr-5 text-sm'
                          >
                            Main Peranan
                          </label>
                        </div>
                        {singleAktivitiPromosi.mainPerananBahagianB && (
                          <div className='grid grid-cols-[1fr_2fr]'>
                            <label
                              htmlFor='bilangan-aktiviti-main-peranan-bahagian-b'
                              className='ml-2 mr-3 text-sm flex items-center justify-end'
                            >
                              bilangan aktiviti
                            </label>
                            <input
                              disabled={isDisabled}
                              type='number'
                              name='bilangan-aktiviti-main-peranan-bahagian-b'
                              id='bilangan-aktiviti-main-peranan-bahagian-b'
                              min='0'
                              value={
                                singleAktivitiPromosi.bilanganAktivitiMainPerananBahagianB
                              }
                              onChange={(e) =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  bilanganAktivitiMainPerananBahagianB:
                                    e.target.value,
                                })
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
                              disabled={isDisabled}
                              type='number'
                              name='bilangan-peserta-main-peranan-bahagian-b'
                              id='bilangan-peserta-main-peranan-bahagian-b'
                              min='0'
                              value={
                                singleAktivitiPromosi.bilanganPesertaMainPerananBahagianB
                              }
                              onChange={(e) =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  bilanganPesertaMainPerananBahagianB:
                                    e.target.value,
                                })
                              }
                              className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                          </div>
                        )}
                      </div>
                    ) : null}
                    {pilihanPromosi.includes('bercerita') ||
                    singleAktivitiPromosi.berceritaBahagianB ? (
                      <div className='outline outline-1 outline-userBlack'>
                        <div className='flex flex-row pl-5 py-2 text-lg font-semibold'>
                          <input
                            disabled={isDisabled}
                            type='checkbox'
                            name='bercerita-bahagian-b'
                            id='bercerita-bahagian-b'
                            checked={singleAktivitiPromosi.berceritaBahagianB}
                            onChange={() =>
                              setSingleAktivitiPromosi({
                                ...singleAktivitiPromosi,
                                berceritaBahagianB:
                                  !singleAktivitiPromosi.berceritaBahagianB,
                              })
                            }
                          />
                          <label
                            htmlFor='bercerita-bahagian-b'
                            className='ml-2 mr-5 text-sm'
                          >
                            Bercerita
                          </label>
                        </div>
                        {singleAktivitiPromosi.berceritaBahagianB && (
                          <div className='grid grid-cols-[1fr_2fr] '>
                            <label
                              htmlFor='bilangan-aktiviti-bercerita-bahagian-b'
                              className='ml-2 mr-3 text-sm flex items-center justify-end'
                            >
                              bilangan aktiviti
                            </label>
                            <input
                              disabled={isDisabled}
                              type='number'
                              name='bilangan-aktiviti-bercerita-bahagian-b'
                              id='bilangan-aktiviti-bercerita-bahagian-b'
                              min='0'
                              value={
                                singleAktivitiPromosi.bilanganAktivitiBerceritaBahagianB
                              }
                              onChange={(e) =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  bilanganAktivitiBerceritaBahagianB:
                                    e.target.value,
                                })
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
                              disabled={isDisabled}
                              type='number'
                              name='bilangan-peserta-bercerita-bahagian-b'
                              id='bilangan-peserta-bercerita-bahagian-b'
                              min='0'
                              value={
                                singleAktivitiPromosi.bilanganPesertaBerceritaBahagianB
                              }
                              onChange={(e) =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  bilanganPesertaBerceritaBahagianB:
                                    e.target.value,
                                })
                              }
                              className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                          </div>
                        )}
                      </div>
                    ) : null}
                    {pilihanPromosi.includes('pertandingan') ||
                    singleAktivitiPromosi.pertandinganBahagianB ? (
                      <div className='outline outline-1 outline-userBlack'>
                        <div className='flex flex-row pl-5 py-2 text-lg font-semibold'>
                          <input
                            disabled={isDisabled}
                            type='checkbox'
                            name='pertandingan-bahagian-b'
                            id='pertandingan-bahagian-b'
                            checked={
                              singleAktivitiPromosi.pertandinganBahagianB
                            }
                            onChange={() =>
                              setSingleAktivitiPromosi({
                                ...singleAktivitiPromosi,
                                pertandinganBahagianB:
                                  !singleAktivitiPromosi.pertandinganBahagianB,
                              })
                            }
                          />
                          <label
                            htmlFor='pertandingan-bahagian-b'
                            className='ml-2 mr-5 text-sm'
                          >
                            Pertandingan
                          </label>
                        </div>
                        {singleAktivitiPromosi.pertandinganBahagianB && (
                          <div className='grid grid-cols-[1fr_2fr]'>
                            <label
                              htmlFor='bilangan-aktiviti-pertandingan-bahagian-b'
                              className='ml-2 mr-3 text-sm flex items-center justify-end'
                            >
                              bilangan aktiviti
                            </label>
                            <input
                              disabled={isDisabled}
                              type='number'
                              name='bilangan-aktiviti-pertandingan-bahagian-b'
                              id='bilangan-aktiviti-pertandingan-bahagian-b'
                              min='0'
                              value={
                                singleAktivitiPromosi.bilanganAktivitiPertandinganBahagianB
                              }
                              onChange={(e) =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  bilanganAktivitiPertandinganBahagianB:
                                    e.target.value,
                                })
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
                              disabled={isDisabled}
                              type='number'
                              name='bilangan-peserta-pertandingan-bahagian-b'
                              id='bilangan-peserta-pertandingan-bahagian-b'
                              min='0'
                              value={
                                singleAktivitiPromosi.bilanganPesertaPertandinganBahagianB
                              }
                              onChange={(e) =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  bilanganPesertaPertandinganBahagianB:
                                    e.target.value,
                                })
                              }
                              className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                          </div>
                        )}
                      </div>
                    ) : null}
                    {pilihanPromosi.includes('permainan-interaktif') ||
                    singleAktivitiPromosi.permainanInteraktifBahagianB ? (
                      <div className='outline outline-1 outline-userBlack'>
                        <div className='flex flex-row pl-5 py-2 text-lg font-semibold'>
                          <input
                            disabled={isDisabled}
                            type='checkbox'
                            name='permainan-interaktif-bahagian-b'
                            id='permainan-interaktif-bahagian-b'
                            checked={
                              singleAktivitiPromosi.permainanInteraktifBahagianB
                            }
                            onChange={() =>
                              setSingleAktivitiPromosi({
                                ...singleAktivitiPromosi,
                                permainanInteraktifBahagianB:
                                  !singleAktivitiPromosi.permainanInteraktifBahagianB,
                              })
                            }
                          />
                          <label
                            htmlFor='permainan-interaktif-bahagian-b'
                            className='ml-2 mr-5 text-sm'
                          >
                            Permainan Interaktif
                          </label>
                        </div>
                        {singleAktivitiPromosi.permainanInteraktifBahagianB && (
                          <div className='grid grid-cols-[1fr_2fr]'>
                            <label
                              htmlFor='bilangan-aktiviti-permainan-interaktif-bahagian-b'
                              className='ml-2 mr-3 text-sm flex items-center justify-end'
                            >
                              bilangan aktiviti
                            </label>
                            <input
                              disabled={isDisabled}
                              type='number'
                              name='bilangan-aktiviti-permainan-interaktif-bahagian-b'
                              id='bilangan-aktiviti-permainan-interaktif-bahagian-b'
                              min='0'
                              value={
                                singleAktivitiPromosi.bilanganAktivitiPermainanInteraktifBahagianB
                              }
                              onChange={(e) =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  bilanganAktivitiPermainanInteraktifBahagianB:
                                    e.target.value,
                                })
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
                              disabled={isDisabled}
                              type='number'
                              name='bilangan-peserta-permainan-interaktif-bahagian-b'
                              id='bilangan-peserta-permainan-interaktif-bahagian-b'
                              min='0'
                              value={
                                singleAktivitiPromosi.bilanganPesertaPermainanInteraktifBahagianB
                              }
                              onChange={(e) =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  bilanganPesertaPermainanInteraktifBahagianB:
                                    e.target.value,
                                })
                              }
                              className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                          </div>
                        )}
                      </div>
                    ) : null}
                    {pilihanPromosi.includes('kursus-seminar-bengkel') ||
                    singleAktivitiPromosi.kursusSeminarBengkelBahagianB ? (
                      <div className='outline outline-1 outline-userBlack'>
                        <div className='flex flex-row pl-5 py-2 text-lg font-semibold'>
                          <input
                            disabled={isDisabled}
                            type='checkbox'
                            name='kursus-seminar-bengkel-bahagian-b'
                            id='kursus-seminar-bengkel-bahagian-b'
                            checked={
                              singleAktivitiPromosi.kursusSeminarBengkelBahagianB
                            }
                            onChange={() =>
                              setSingleAktivitiPromosi({
                                ...singleAktivitiPromosi,
                                kursusSeminarBengkelBahagianB:
                                  !singleAktivitiPromosi.kursusSeminarBengkelBahagianB,
                              })
                            }
                          />
                          <label
                            htmlFor='kursus-seminar-bengkel-bahagian-b'
                            className='ml-2 mr-5 text-sm'
                          >
                            Kursus / Seminar / Bengkel
                          </label>
                        </div>
                        {singleAktivitiPromosi.kursusSeminarBengkelBahagianB && (
                          <div className='grid grid-cols-[1fr_2fr]'>
                            <label
                              htmlFor='bilangan-aktiviti-kursus-seminar-bengkel-bahagian-b'
                              className='ml-2 mr-3 text-sm flex items-center justify-end'
                            >
                              bilangan aktiviti
                            </label>
                            <input
                              disabled={isDisabled}
                              type='number'
                              name='bilangan-aktiviti-kursus-seminar-bengkel-bahagian-b'
                              id='bilangan-aktiviti-kursus-seminar-bengkel-bahagian-b'
                              min='0'
                              value={
                                singleAktivitiPromosi.bilanganAktivitiKursusSeminarBengkelBahagianB
                              }
                              onChange={(e) =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  bilanganAktivitiKursusSeminarBengkelBahagianB:
                                    e.target.value,
                                })
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
                              disabled={isDisabled}
                              type='number'
                              name='bilangan-peserta-kursus-seminar-bengkel-bahagian-b'
                              id='bilangan-peserta-kursus-seminar-bengkel-bahagian-b'
                              min='0'
                              value={
                                singleAktivitiPromosi.bilanganPesertaKursusSeminarBengkelBahagianB
                              }
                              onChange={(e) =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  bilanganPesertaKursusSeminarBengkelBahagianB:
                                    e.target.value,
                                })
                              }
                              className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                          </div>
                        )}
                      </div>
                    ) : null}
                    {pilihanPromosi.includes('pertunjukan-multimedia') ||
                    singleAktivitiPromosi.pertunjukanMultimediaBahagianB ? (
                      <div className='outline outline-1 outline-userBlack'>
                        <div className='flex flex-row pl-5 py-2 text-lg font-semibold'>
                          <input
                            disabled={isDisabled}
                            type='checkbox'
                            name='pertunjukan-multimedia-bahagian-b'
                            id='pertunjukan-multimedia-bahagian-b'
                            checked={
                              singleAktivitiPromosi.pertunjukanMultimediaBahagianB
                            }
                            onChange={() =>
                              setSingleAktivitiPromosi({
                                ...singleAktivitiPromosi,
                                pertunjukanMultimediaBahagianB:
                                  !singleAktivitiPromosi.pertunjukanMultimediaBahagianB,
                              })
                            }
                          />
                          <label
                            htmlFor='pertunjukan-multimedia-bahagian-b'
                            className='ml-2 mr-5 text-sm'
                          >
                            Pertunjukan Multimedia
                          </label>
                        </div>
                        {singleAktivitiPromosi.pertunjukanMultimediaBahagianB && (
                          <div className='grid grid-cols-[1fr_2fr]'>
                            <label
                              htmlFor='bilangan-aktiviti-pertunjukan-multimedia-bahagian-b'
                              className='ml-2 mr-3 text-sm flex items-center justify-end'
                            >
                              bilangan aktiviti
                            </label>
                            <input
                              disabled={isDisabled}
                              type='number'
                              name='bilangan-aktiviti-pertunjukan-multimedia-bahagian-b'
                              id='bilangan-aktiviti-pertunjukan-multimedia-bahagian-b'
                              min='0'
                              value={
                                singleAktivitiPromosi.bilanganAktivitiPertunjukanMultimediaBahagianB
                              }
                              onChange={(e) =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  bilanganAktivitiPertunjukanMultimediaBahagianB:
                                    e.target.value,
                                })
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
                              disabled={isDisabled}
                              type='number'
                              name='bilangan-peserta-pertunjukan-multimedia-bahagian-b'
                              id='bilangan-peserta-pertunjukan-multimedia-bahagian-b'
                              min='0'
                              value={
                                singleAktivitiPromosi.bilanganPesertaPertunjukanMultimediaBahagianB
                              }
                              onChange={(e) =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  bilanganPesertaPertunjukanMultimediaBahagianB:
                                    e.target.value,
                                })
                              }
                              className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                          </div>
                        )}
                      </div>
                    ) : null}
                    {pilihanPromosi.includes('dental-buskers') ||
                    singleAktivitiPromosi.dentalBuskerBahagianB ? (
                      <div className='outline outline-1 outline-userBlack'>
                        <div className='flex flex-row pl-5 py-2 text-lg font-semibold'>
                          <input
                            disabled={isDisabled}
                            type='checkbox'
                            name='dental-busker-bahagian-b'
                            id='dental-busker-bahagian-b'
                            checked={
                              singleAktivitiPromosi.dentalBuskerBahagianB
                            }
                            onChange={() =>
                              setSingleAktivitiPromosi({
                                ...singleAktivitiPromosi,
                                dentalBuskerBahagianB:
                                  !singleAktivitiPromosi.dentalBuskerBahagianB,
                              })
                            }
                          />
                          <label
                            htmlFor='dental-busker-bahagian-b'
                            className='ml-2 mr-5 text-sm'
                          >
                            Dental Busker
                          </label>
                        </div>
                        {singleAktivitiPromosi.dentalBuskerBahagianB && (
                          <div className='grid grid-cols-[1fr_2fr]'>
                            <label
                              htmlFor='bilangan-aktiviti-dental-busker-bahagian-b'
                              className='ml-2 mr-3 text-sm flex items-center justify-end'
                            >
                              bilangan aktiviti
                            </label>
                            <input
                              disabled={isDisabled}
                              type='number'
                              name='bilangan-aktiviti-dental-busker-bahagian-b'
                              id='bilangan-aktiviti-dental-busker-bahagian-b'
                              min='0'
                              value={
                                singleAktivitiPromosi.bilanganAktivitiDentalBuskerBahagianB
                              }
                              onChange={(e) =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  bilanganAktivitiDentalBuskerBahagianB:
                                    e.target.value,
                                })
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
                              disabled={isDisabled}
                              type='number'
                              name='bilangan-peserta-dental-busker-bahagian-b'
                              id='bilangan-peserta-dental-busker-bahagian-b'
                              min='0'
                              value={
                                singleAktivitiPromosi.bilanganPesertaDentalBuskerBahagianB
                              }
                              onChange={(e) =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  bilanganPesertaDentalBuskerBahagianB:
                                    e.target.value,
                                })
                              }
                              className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                          </div>
                        )}
                      </div>
                    ) : null}
                    {pilihanPromosi.includes('flashmob') ||
                    singleAktivitiPromosi.flashmobBahagianB ? (
                      <div className='outline outline-1 outline-userBlack'>
                        <div className='flex flex-row pl-5 py-2 text-lg font-semibold'>
                          <input
                            disabled={isDisabled}
                            type='checkbox'
                            name='flashmob-bahagian-b'
                            id='flashmob-bahagian-b'
                            checked={singleAktivitiPromosi.flashmobBahagianB}
                            onChange={() =>
                              setSingleAktivitiPromosi({
                                ...singleAktivitiPromosi,
                                flashmobBahagianB:
                                  !singleAktivitiPromosi.flashmobBahagianB,
                              })
                            }
                          />
                          <label
                            htmlFor='flashmob-bahagian-b'
                            className='ml-2 mr-5 text-sm'
                          >
                            Flashmob
                          </label>
                        </div>
                        {singleAktivitiPromosi.flashmobBahagianB && (
                          <div className='grid grid-cols-[1fr_2fr]'>
                            <label
                              htmlFor='bilangan-aktiviti-flashmob-bahagian-b'
                              className='ml-2 mr-3 text-sm flex items-center justify-end'
                            >
                              bilangan aktiviti
                            </label>
                            <input
                              disabled={isDisabled}
                              type='number'
                              name='bilangan-aktiviti-flashmob-bahagian-b'
                              id='bilangan-aktiviti-flashmob-bahagian-b'
                              min='0'
                              value={
                                singleAktivitiPromosi.bilanganAktivitiFlashmobBahagianB
                              }
                              onChange={(e) =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  bilanganAktivitiFlashmobBahagianB:
                                    e.target.value,
                                })
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
                              disabled={isDisabled}
                              type='number'
                              name='bilangan-peserta-flashmob-bahagian-b'
                              id='bilangan-peserta-flashmob-bahagian-b'
                              min='0'
                              value={
                                singleAktivitiPromosi.bilanganPesertaFlashmobBahagianB
                              }
                              onChange={(e) =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  bilanganPesertaFlashmobBahagianB:
                                    e.target.value,
                                })
                              }
                              className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                          </div>
                        )}
                      </div>
                    ) : null}
                    {pilihanPromosi.includes('lawatan-ke-rumah') ||
                    singleAktivitiPromosi.lawatanKeRumahBahagianB ? (
                      <div className='outline outline-1 outline-userBlack'>
                        <div className='flex flex-row pl-5 py-2 text-lg font-semibold'>
                          <input
                            disabled={isDisabled}
                            type='checkbox'
                            name='lawatan-ke-rumah-bahagian-b'
                            id='lawatan-ke-rumah-bahagian-b'
                            checked={
                              singleAktivitiPromosi.lawatanKeRumahBahagianB
                            }
                            onChange={() =>
                              setSingleAktivitiPromosi({
                                ...singleAktivitiPromosi,
                                lawatanKeRumahBahagianB:
                                  !singleAktivitiPromosi.lawatanKeRumahBahagianB,
                              })
                            }
                          />
                          <label
                            htmlFor='lawatan-ke-rumah-bahagian-b'
                            className='ml-2 mr-5 text-sm'
                          >
                            Lawatan ke rumah
                          </label>
                        </div>
                        {singleAktivitiPromosi.lawatanKeRumahBahagianB && (
                          <div className='grid grid-cols-[1fr_2fr]'>
                            <label
                              htmlFor='bilangan-aktiviti-lawatan-ke-rumah-bahagian-b'
                              className='ml-2 mr-3 text-sm flex items-center justify-end'
                            >
                              bilangan aktiviti
                            </label>
                            <input
                              disabled={isDisabled}
                              type='number'
                              name='bilangan-aktiviti-lawatan-ke-rumah-bahagian-b'
                              id='bilangan-aktiviti-lawatan-ke-rumah-bahagian-b'
                              min='0'
                              value={
                                singleAktivitiPromosi.bilanganAktivitiLawatanKeRumahBahagianB
                              }
                              onChange={(e) =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  bilanganAktivitiLawatanKeRumahBahagianB:
                                    e.target.value,
                                })
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
                              disabled={isDisabled}
                              type='number'
                              name='bilangan-peserta-lawatan-ke-rumah-bahagian-b'
                              id='bilangan-peserta-lawatan-ke-rumah-bahagian-b'
                              min='0'
                              value={
                                singleAktivitiPromosi.bilanganPesertaLawatanKeRumahBahagianB
                              }
                              onChange={(e) =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  bilanganPesertaLawatanKeRumahBahagianB:
                                    e.target.value,
                                })
                              }
                              className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                          </div>
                        )}
                      </div>
                    ) : null}
                    {pilihanPromosi.includes('nasihat-kesihatan-pergigian') ||
                    singleAktivitiPromosi.plakGigiNasihatKesihatanPergigianBahagianB ||
                    singleAktivitiPromosi.dietPemakananNasihatKesihatanPergigianBahagianB ||
                    singleAktivitiPromosi.penjagaanKesihatanMulutNasihatKesihatanPergigianBahagianB ||
                    singleAktivitiPromosi.kanserMulutNasihatKesihatanPergigianBahagianB ? (
                      <article className='grid grid-cols-1 lg:grid-cols-2 lg:col-span-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                        <div className='flex flex-row justify-start lg:col-span-2 items-center'>
                          <h1 className='text-base font-bold flex flex-row pl-5 mr-5'>
                            Nasihat Kesihatan Pergigian
                          </h1>
                        </div>
                        <div className='outline outline-1 outline-userBlack'>
                          <div className='flex flex-row pl-5 py-2 text-lg font-semibold'>
                            <input
                              disabled={isDisabled}
                              type='checkbox'
                              name='plak-gigi-nasihat-kesihatan-pergigian-bahagian-b'
                              id='plak-gigi-nasihat-kesihatan-pergigian-bahagian-b'
                              checked={
                                singleAktivitiPromosi.plakGigiNasihatKesihatanPergigianBahagianB
                              }
                              onChange={() =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  plakGigiNasihatKesihatanPergigianBahagianB:
                                    !singleAktivitiPromosi.plakGigiNasihatKesihatanPergigianBahagianB,
                                })
                              }
                            />
                            <label
                              htmlFor='plak-gigi-nasihat-kesihatan-pergigian-bahagian-b'
                              className='ml-2 mr-5 text-sm'
                            >
                              Plak Gigi
                            </label>
                          </div>
                          {singleAktivitiPromosi.plakGigiNasihatKesihatanPergigianBahagianB && (
                            <div className='grid grid-cols-[1fr_2fr]'>
                              <label
                                htmlFor='bilangan-aktiviti-plak-gigi-nasihat-kesihatan-pergigian-bahagian-b'
                                className='ml-2 mr-3 text-sm flex items-center justify-end'
                              >
                                bilangan aktiviti
                              </label>
                              <input
                                disabled={isDisabled}
                                type='number'
                                name='bilangan-aktiviti-plak-gigi-nasihat-kesihatan-pergigian-bahagian-b'
                                id='bilangan-aktiviti-plak-gigi-nasihat-kesihatan-pergigian-bahagian-b'
                                min='0'
                                value={
                                  singleAktivitiPromosi.bilanganAktivitiPlakGigiBahagianB
                                }
                                onChange={(e) =>
                                  setSingleAktivitiPromosi({
                                    ...singleAktivitiPromosi,
                                    bilanganAktivitiPlakGigiBahagianB:
                                      e.target.value,
                                  })
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
                                disabled={isDisabled}
                                type='number'
                                name='bilangan-peserta-plak-gigi-nasihat-kesihatan-pergigian-bahagian-b'
                                id='bilangan-peserta-plak-gigi-nasihat-kesihatan-pergigian-bahagian-b'
                                min='0'
                                value={
                                  singleAktivitiPromosi.bilanganPesertaPlakGigiBahagianB
                                }
                                onChange={(e) =>
                                  setSingleAktivitiPromosi({
                                    ...singleAktivitiPromosi,
                                    bilanganPesertaPlakGigiBahagianB:
                                      e.target.value,
                                  })
                                }
                                className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              />
                            </div>
                          )}
                        </div>
                        <div className='outline outline-1 outline-userBlack'>
                          <div className='flex flex-row pl-5 py-2 text-lg font-semibold'>
                            <input
                              disabled={isDisabled}
                              type='checkbox'
                              name='diet-pemakanan-nasihat-kesihatan-pergigian-bahagian-b'
                              id='diet-pemakanan-nasihat-kesihatan-pergigian-bahagian-b'
                              checked={
                                singleAktivitiPromosi.dietPemakananNasihatKesihatanPergigianBahagianB
                              }
                              onChange={() =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  dietPemakananNasihatKesihatanPergigianBahagianB:
                                    !singleAktivitiPromosi.dietPemakananNasihatKesihatanPergigianBahagianB,
                                })
                              }
                            />
                            <label
                              htmlFor='diet-pemakanan-nasihat-kesihatan-pergigian-bahagian-b'
                              className='ml-2 mr-5 text-sm'
                            >
                              Diet Pemakanan
                            </label>
                          </div>
                          {singleAktivitiPromosi.dietPemakananNasihatKesihatanPergigianBahagianB && (
                            <div className='grid grid-cols-[1fr_2fr]'>
                              <label
                                htmlFor='bilangan-aktiviti-diet-pemakanan-nasihat-kesihatan-pergigian-bahagian-b'
                                className='ml-2 mr-3 text-sm flex items-center justify-end'
                              >
                                bilangan aktiviti
                              </label>
                              <input
                                disabled={isDisabled}
                                type='number'
                                name='bilangan-aktiviti-diet-pemakanan-nasihat-kesihatan-pergigian-bahagian-b'
                                id='bilangan-aktiviti-diet-pemakanan-nasihat-kesihatan-pergigian-bahagian-b'
                                min='0'
                                value={
                                  singleAktivitiPromosi.bilanganAktivitiDietPemakananBahagianB
                                }
                                onChange={(e) =>
                                  setSingleAktivitiPromosi({
                                    ...singleAktivitiPromosi,
                                    bilanganAktivitiDietPemakananBahagianB:
                                      e.target.value,
                                  })
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
                                disabled={isDisabled}
                                type='number'
                                name='bilangan-peserta-diet-pemakanan-nasihat-kesihatan-pergigian-bahagian-b'
                                id='bilangan-peserta-diet-pemakanan-nasihat-kesihatan-pergigian-bahagian-b'
                                min='0'
                                value={
                                  singleAktivitiPromosi.bilanganPesertaDietPemakananBahagianB
                                }
                                onChange={(e) =>
                                  setSingleAktivitiPromosi({
                                    ...singleAktivitiPromosi,
                                    bilanganPesertaDietPemakananBahagianB:
                                      e.target.value,
                                  })
                                }
                                className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              />
                            </div>
                          )}
                        </div>
                        <div className='outline outline-1 outline-userBlack'>
                          <div className='flex flex-row pl-5 py-2 text-lg font-semibold'>
                            <input
                              disabled={isDisabled}
                              type='checkbox'
                              name='penjagaan-kesihatan-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                              id='penjagaan-kesihatan-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                              checked={
                                singleAktivitiPromosi.penjagaanKesihatanMulutNasihatKesihatanPergigianBahagianB
                              }
                              onChange={() =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  penjagaanKesihatanMulutNasihatKesihatanPergigianBahagianB:
                                    !singleAktivitiPromosi.penjagaanKesihatanMulutNasihatKesihatanPergigianBahagianB,
                                })
                              }
                            />
                            <label
                              htmlFor='penjagaan-kesihatan-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                              className='ml-2 mr-5 text-sm'
                            >
                              Penjagaan Kesihatan Mulut
                            </label>
                          </div>
                          {singleAktivitiPromosi.penjagaanKesihatanMulutNasihatKesihatanPergigianBahagianB && (
                            <div className='grid grid-cols-[1fr_2fr]'>
                              <label
                                htmlFor='bilangan-aktiviti-penjagaan-kesihatan-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                                className='ml-2 mr-3 text-sm flex items-center justify-end'
                              >
                                bilangan aktiviti
                              </label>
                              <input
                                disabled={isDisabled}
                                type='number'
                                name='bilangan-aktiviti-penjagaan-kesihatan-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                                id='bilangan-aktiviti-penjagaan-kesihatan-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                                min='0'
                                value={
                                  singleAktivitiPromosi.bilanganAktivitiPenjagaanKesihatanMulutBahagianB
                                }
                                onChange={(e) =>
                                  setSingleAktivitiPromosi({
                                    ...singleAktivitiPromosi,
                                    bilanganAktivitiPenjagaanKesihatanMulutBahagianB:
                                      e.target.value,
                                  })
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
                                disabled={isDisabled}
                                type='number'
                                name='bilangan-peserta-penjagaan-kesihatan-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                                id='bilangan-peserta-penjagaan-kesihatan-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                                min='0'
                                value={
                                  singleAktivitiPromosi.bilanganPesertaPenjagaanKesihatanMulutBahagianB
                                }
                                onChange={(e) =>
                                  setSingleAktivitiPromosi({
                                    ...singleAktivitiPromosi,
                                    bilanganPesertaPenjagaanKesihatanMulutBahagianB:
                                      e.target.value,
                                  })
                                }
                                className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              />
                            </div>
                          )}
                        </div>
                        <div className='outline outline-1 outline-userBlack'>
                          <div className='flex flex-row pl-5 py-2 text-lg font-semibold'>
                            <input
                              disabled={isDisabled}
                              type='checkbox'
                              name='kanser-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                              id='kanser-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                              checked={
                                singleAktivitiPromosi.kanserMulutNasihatKesihatanPergigianBahagianB
                              }
                              onChange={() =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  kanserMulutNasihatKesihatanPergigianBahagianB:
                                    !singleAktivitiPromosi.kanserMulutNasihatKesihatanPergigianBahagianB,
                                })
                              }
                            />
                            <label
                              htmlFor='kanser-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                              className='ml-2 mr-5 text-sm'
                            >
                              Kanser Mulut
                            </label>
                          </div>
                          {singleAktivitiPromosi.kanserMulutNasihatKesihatanPergigianBahagianB && (
                            <div className='grid grid-cols-[1fr_2fr]'>
                              <label
                                htmlFor='bilangan-aktiviti-kanser-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                                className='ml-2 mr-3 text-sm flex items-center justify-end'
                              >
                                bilangan aktiviti
                              </label>
                              <input
                                disabled={isDisabled}
                                type='number'
                                name='bilangan-aktiviti-kanser-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                                id='bilangan-aktiviti-kanser-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                                min='0'
                                value={
                                  singleAktivitiPromosi.bilanganAktivitiKanserMulutBahagianB
                                }
                                onChange={(e) =>
                                  setSingleAktivitiPromosi({
                                    ...singleAktivitiPromosi,
                                    bilanganAktivitiKanserMulutBahagianB:
                                      e.target.value,
                                  })
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
                                disabled={isDisabled}
                                type='number'
                                name='bilangan-peserta-kanser-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                                id='bilangan-peserta-kanser-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                                min='0'
                                value={
                                  singleAktivitiPromosi.bilanganPesertaKanserMulutBahagianB
                                }
                                onChange={(e) =>
                                  setSingleAktivitiPromosi({
                                    ...singleAktivitiPromosi,
                                    bilanganPesertaKanserMulutBahagianB:
                                      e.target.value,
                                  })
                                }
                                className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              />
                            </div>
                          )}
                        </div>
                      </article>
                    ) : null}
                    {pilihanPromosi.includes('intervensi-tabiat') ||
                    singleAktivitiPromosi.merokokIntervensiTabiatBerisikoTinggi ||
                    singleAktivitiPromosi.mengunyahSirihIntervensiTabiatBerisikoTinggi ||
                    singleAktivitiPromosi.alkoholIntervensiTabiatBerisikoTinggi ||
                    singleAktivitiPromosi.lainLainIntervensiTabiatBerisikoTinggi ? (
                      <article className='grid grid-cols-1 lg:grid-cols-2 lg:col-span-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                        <div className='flex flex-row justify-start lg:col-span-2 items-center'>
                          <h1 className='text-base font-bold flex flex-row pl-5 mr-5'>
                            Intervensi Tabiat Berisiko Tinggi
                          </h1>
                        </div>
                        <div className='outline outline-1 outline-userBlack'>
                          <div className='flex flex-row pl-5 py-2 text-lg font-semibold'>
                            <input
                              disabled={isDisabled}
                              type='checkbox'
                              name='merokok-intervensi-tabiat-berisiko-tinggi'
                              id='merokok-intervensi-tabiat-berisiko-tinggi'
                              checked={
                                singleAktivitiPromosi.merokokIntervensiTabiatBerisikoTinggi
                              }
                              onChange={() =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  merokokIntervensiTabiatBerisikoTinggi:
                                    !singleAktivitiPromosi.merokokIntervensiTabiatBerisikoTinggi,
                                })
                              }
                            />
                            <label
                              htmlFor='merokok-intervensi-tabiat-berisiko-tinggi'
                              className='ml-2 mr-5 text-sm'
                            >
                              Merokok
                            </label>
                          </div>
                          {singleAktivitiPromosi.merokokIntervensiTabiatBerisikoTinggi && (
                            <div className='grid grid-cols-[1fr_2fr]'>
                              <label
                                htmlFor='bilangan-aktiviti-merokok-intervensi-tabiat-berisiko-tinggi'
                                className='ml-2 mr-3 text-sm flex items-center justify-end'
                              >
                                bilangan aktiviti
                              </label>
                              <input
                                disabled={isDisabled}
                                type='number'
                                name='bilangan-aktiviti-merokok-intervensi-tabiat-berisiko-tinggi'
                                id='bilangan-aktiviti-merokok-intervensi-tabiat-berisiko-tinggi'
                                min='0'
                                value={
                                  singleAktivitiPromosi.bilanganAktivitiMerokokIntervensiTabiatBerisikoTinggi
                                }
                                onChange={(e) =>
                                  setSingleAktivitiPromosi({
                                    ...singleAktivitiPromosi,
                                    bilanganAktivitiMerokokIntervensiTabiatBerisikoTinggi:
                                      e.target.value,
                                  })
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
                                disabled={isDisabled}
                                type='number'
                                name='bilangan-peserta-merokok-intervensi-tabiat-berisiko-tinggi'
                                id='bilangan-peserta-merokok-intervensi-tabiat-berisiko-tinggi'
                                min='0'
                                value={
                                  singleAktivitiPromosi.bilanganPesertaMerokokIntervensiTabiatBerisikoTinggi
                                }
                                onChange={(e) =>
                                  setSingleAktivitiPromosi({
                                    ...singleAktivitiPromosi,
                                    bilanganPesertaMerokokIntervensiTabiatBerisikoTinggi:
                                      e.target.value,
                                  })
                                }
                                className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              />
                            </div>
                          )}
                        </div>
                        <div className='outline outline-1 outline-userBlack'>
                          <div className='flex flex-row pl-5 py-2 text-lg font-semibold'>
                            <input
                              disabled={isDisabled}
                              type='checkbox'
                              name='mengunyah-sirih-intervensi-tabiat-berisiko-tinggi'
                              id='mengunyah-sirih-intervensi-tabiat-berisiko-tinggi'
                              checked={
                                singleAktivitiPromosi.mengunyahSirihIntervensiTabiatBerisikoTinggi
                              }
                              onChange={() =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  mengunyahSirihIntervensiTabiatBerisikoTinggi:
                                    !singleAktivitiPromosi.mengunyahSirihIntervensiTabiatBerisikoTinggi,
                                })
                              }
                            />
                            <label
                              htmlFor='mengunyah-sirih-intervensi-tabiat-berisiko-tinggi'
                              className='ml-2 mr-5 text-sm'
                            >
                              Mengunyah Sirih
                            </label>
                          </div>
                          {singleAktivitiPromosi.mengunyahSirihIntervensiTabiatBerisikoTinggi && (
                            <div className='grid grid-cols-[1fr_2fr]'>
                              <label
                                htmlFor='bilangan-aktiviti-mengunyah-sirih-intervensi-tabiat-berisiko-tinggi'
                                className='ml-2 mr-3 text-sm flex items-center justify-end'
                              >
                                bilangan aktiviti
                              </label>
                              <input
                                disabled={isDisabled}
                                type='number'
                                name='bilangan-aktiviti-mengunyah-sirih-intervensi-tabiat-berisiko-tinggi'
                                id='bilangan-aktiviti-mengunyah-sirih-intervensi-tabiat-berisiko-tinggi'
                                min='0'
                                value={
                                  singleAktivitiPromosi.bilanganAktivitiMengunyahSirihIntervensiTabiatBerisikoTinggi
                                }
                                onChange={(e) =>
                                  setSingleAktivitiPromosi({
                                    ...singleAktivitiPromosi,
                                    bilanganAktivitiMengunyahSirihIntervensiTabiatBerisikoTinggi:
                                      e.target.value,
                                  })
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
                                disabled={isDisabled}
                                type='number'
                                name='bilangan-peserta-mengunyah-sirih-intervensi-tabiat-berisiko-tinggi'
                                id='bilangan-peserta-mengunyah-sirih-intervensi-tabiat-berisiko-tinggi'
                                min='0'
                                value={
                                  singleAktivitiPromosi.bilanganPesertaMengunyahSirihIntervensiTabiatBerisikoTinggi
                                }
                                onChange={(e) =>
                                  setSingleAktivitiPromosi({
                                    ...singleAktivitiPromosi,
                                    bilanganPesertaMengunyahSirihIntervensiTabiatBerisikoTinggi:
                                      e.target.value,
                                  })
                                }
                                className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              />
                            </div>
                          )}
                        </div>
                        <div className='outline outline-1 outline-userBlack'>
                          <div className='flex flex-row pl-5 py-2 text-lg font-semibold'>
                            <input
                              disabled={isDisabled}
                              type='checkbox'
                              name='alkohol-intervensi-tabiat-berisiko-tinggi'
                              id='alkohol-intervensi-tabiat-berisiko-tinggi'
                              checked={
                                singleAktivitiPromosi.alkoholIntervensiTabiatBerisikoTinggi
                              }
                              onChange={() =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  alkoholIntervensiTabiatBerisikoTinggi:
                                    !singleAktivitiPromosi.alkoholIntervensiTabiatBerisikoTinggi,
                                })
                              }
                            />
                            <label
                              htmlFor='alkohol-intervensi-tabiat-berisiko-tinggi'
                              className='ml-2 mr-5 text-sm'
                            >
                              Alkohol
                            </label>
                          </div>
                          {singleAktivitiPromosi.alkoholIntervensiTabiatBerisikoTinggi && (
                            <div className='grid grid-cols-[1fr_2fr]'>
                              <label
                                htmlFor='bilangan-aktiviti-alkohol-intervensi-tabiat-berisiko-tinggi'
                                className='ml-2 mr-3 text-sm flex items-center justify-end'
                              >
                                bilangan aktiviti
                              </label>
                              <input
                                disabled={isDisabled}
                                type='number'
                                name='bilangan-aktiviti-alkohol-intervensi-tabiat-berisiko-tinggi'
                                id='bilangan-aktiviti-alkohol-intervensi-tabiat-berisiko-tinggi'
                                min='0'
                                value={
                                  singleAktivitiPromosi.bilanganAktivitiAlkoholIntervensiTabiatBerisikoTinggi
                                }
                                onChange={(e) =>
                                  setSingleAktivitiPromosi({
                                    ...singleAktivitiPromosi,
                                    bilanganAktivitiAlkoholIntervensiTabiatBerisikoTinggi:
                                      e.target.value,
                                  })
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
                                disabled={isDisabled}
                                type='number'
                                name='bilangan-peserta-alkohol-intervensi-tabiat-berisiko-tinggi'
                                id='bilangan-peserta-alkohol-intervensi-tabiat-berisiko-tinggi'
                                min='0'
                                value={
                                  singleAktivitiPromosi.bilanganPesertaAlkoholIntervensiTabiatBerisikoTinggi
                                }
                                onChange={(e) =>
                                  setSingleAktivitiPromosi({
                                    ...singleAktivitiPromosi,
                                    bilanganPesertaAlkoholIntervensiTabiatBerisikoTinggi:
                                      e.target.value,
                                  })
                                }
                                className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              />
                            </div>
                          )}
                        </div>
                        <div className='outline outline-1 outline-userBlack'>
                          <div className='flex flex-row pl-5 py-2 text-lg font-semibold'>
                            <input
                              disabled={isDisabled}
                              type='checkbox'
                              name='lain-lain-intervensi-tabiat-berisiko-tinggi'
                              id='lain-lain-intervensi-tabiat-berisiko-tinggi'
                              checked={
                                singleAktivitiPromosi.lainLainIntervensiTabiatBerisikoTinggi
                              }
                              onChange={() =>
                                setSingleAktivitiPromosi({
                                  ...singleAktivitiPromosi,
                                  lainLainIntervensiTabiatBerisikoTinggi:
                                    !singleAktivitiPromosi.lainLainIntervensiTabiatBerisikoTinggi,
                                })
                              }
                            />
                            <label
                              htmlFor='lain-lain-intervensi-tabiat-berisiko-tinggi'
                              className='ml-2 mr-5 text-sm'
                            >
                              Lain-lain
                            </label>
                          </div>
                          {singleAktivitiPromosi.lainLainIntervensiTabiatBerisikoTinggi && (
                            <div className='grid grid-cols-[1fr_2fr]'>
                              <label
                                htmlFor='bilangan-aktiviti-lain-lain-intervensi-tabiat-berisiko-tinggi'
                                className='ml-2 mr-3 text-sm flex items-center justify-end'
                              >
                                bilangan aktiviti
                              </label>
                              <input
                                disabled={isDisabled}
                                type='number'
                                name='bilangan-aktiviti-lain-lain-intervensi-tabiat-berisiko-tinggi'
                                id='bilangan-aktiviti-lain-lain-intervensi-tabiat-berisiko-tinggi'
                                min='0'
                                value={
                                  singleAktivitiPromosi.bilanganAktivitiLainLainIntervensiTabiatBerisikoTinggi
                                }
                                onChange={(e) =>
                                  setSingleAktivitiPromosi({
                                    ...singleAktivitiPromosi,
                                    bilanganAktivitiLainLainIntervensiTabiatBerisikoTinggi:
                                      e.target.value,
                                  })
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
                                disabled={isDisabled}
                                type='number'
                                name='bilangan-peserta-lain-lain-intervensi-tabiat-berisiko-tinggi'
                                id='bilangan-peserta-lain-lain-intervensi-tabiat-berisiko-tinggi'
                                min='0'
                                value={
                                  singleAktivitiPromosi.bilanganPesertaLainLainIntervensiTabiatBerisikoTinggi
                                }
                                onChange={(e) =>
                                  setSingleAktivitiPromosi({
                                    ...singleAktivitiPromosi,
                                    bilanganPesertaLainLainIntervensiTabiatBerisikoTinggi:
                                      e.target.value,
                                  })
                                }
                                className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                              />
                            </div>
                          )}
                        </div>
                      </article>
                    ) : null}
                  </article>
                </section>
                <div className='grid grid-cols-1 lg:grid-cols-2 col-start-1 md:col-start-2 gap-2 col-span-2 md:col-span-1'>
                  <div className='grid grid-cols-2 gap-3 lg:col-start-2'>
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
                    {/* <input
                disabled={isDisabled}
                disabled={
                  singleAktivitiPromosi.statusReten === 'telah diisi' && true
                }
                type='reset'
                value='set semula'
                className={`flex bg-user3 p-2 w-full capitalize justify-center  transition-all ${
                  singleAktivitiPromosi.statusReten === 'belum diisi' &&
                  'hover:bg-user1 hover:text-userWhite'
                }`}
              /> */}
                    <button
                      disabled={
                        singleAktivitiPromosi.statusReten === 'telah diisi' &&
                        true
                      }
                      type='submit'
                      className={`flex bg-user3 p-2 w-full capitalize justify-center  transition-all ${
                        singleAktivitiPromosi.statusReten === 'belum diisi' &&
                        'hover:bg-user1 hover:text-userWhite'
                      }`}
                    >
                      {singleAktivitiPromosi.statusReten === 'belum diisi' &&
                        'hantar'}
                      {singleAktivitiPromosi.statusReten === 'telah diisi' && (
                        <s>hantar</s>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </UserFormPromosiConfirmation>
        </div>
      </div>
    </>
  );
}

export default UserFormPromosi;
