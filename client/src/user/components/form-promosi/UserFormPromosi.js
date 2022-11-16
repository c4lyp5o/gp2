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
  const [pilihanBahagianB, setPilihanBahagianB] = useState([]);

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
                    className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                  />
                </div>
                <div className='grid grid-cols-[1fr_2fr] outline outline-1 outline-userBlack'>
                  <div className='col-span-2 flex flex-row pl-5 pt-2 text-lg font-semibold'>
                    <input
                      type='checkbox'
                      name='diet-pemakanan-nasihat-kesihatan-pergigian-bahagian-b'
                      id='diet-pemakanan-nasihat-kesihatan-pergigian-bahagian-b'
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
                    className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                  />
                </div>
                <div className='grid grid-cols-[1fr_2fr] outline outline-1 outline-userBlack'>
                  <div className='col-span-2 flex flex-row pl-5 pt-2 text-lg font-semibold'>
                    <input
                      type='checkbox'
                      name='penjagaan-kesihatan-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                      id='penjagaan-kesihatan-mulut-nasihat-kesihatan-pergigian-bahagian-b'
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
                    className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                  />
                </div>
                <div className='grid grid-cols-[1fr_2fr] outline outline-1 outline-userBlack'>
                  <div className='col-span-2 flex flex-row pl-5 pt-2 text-lg font-semibold'>
                    <input
                      type='checkbox'
                      name='kanser-mulut-nasihat-kesihatan-pergigian-bahagian-b'
                      id='kanser-mulut-nasihat-kesihatan-pergigian-bahagian-b'
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
                    className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                  />
                </div>
                <div className='grid grid-cols-[1fr_2fr] outline outline-1 outline-userBlack'>
                  <div className='col-span-2 flex flex-row pl-5 pt-2 text-lg font-semibold'>
                    <input
                      type='checkbox'
                      name='mengunyah-sirih-intervensi-tabiat-berisiko-tinggi'
                      id='mengunyah-sirih-intervensi-tabiat-berisiko-tinggi'
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
                    className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                  />
                </div>
                <div className='grid grid-cols-[1fr_2fr] outline outline-1 outline-userBlack'>
                  <div className='col-span-2 flex flex-row pl-5 pt-2 text-lg font-semibold'>
                    <input
                      type='checkbox'
                      name='alkohol-intervensi-tabiat-berisiko-tinggi'
                      id='alkohol-intervensi-tabiat-berisiko-tinggi'
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
                    className='appearance-none w-24 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                  />
                </div>
                <div className='grid grid-cols-[1fr_2fr] outline outline-1 outline-userBlack'>
                  <div className='col-span-2 flex flex-row pl-5 pt-2 text-lg font-semibold'>
                    <input
                      type='checkbox'
                      name='lain-lain-intervensi-tabiat-berisiko-tinggi'
                      id='lain-lain-intervensi-tabiat-berisiko-tinggi'
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
