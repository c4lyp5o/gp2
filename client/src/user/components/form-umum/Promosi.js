export default function Promosi() {
  return (
    <>
      <div className='p-2'>
        <div className='grid grid-cols-2'>
          <span className='flex bg-user3 p-2 w-full capitalize col-span-2'>
            <p className='ml-3 text-xl font-semibold'>Promosi</p>
          </span>
          <section className='grid grid-cols-1 md:grid-cols-2  gap-2 mt-3 mb-3 w-full col-span-2'>
            <div className='grid gap-2'>
              <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                  menyertai
                </h4>
                <div className='flex flex-row items-center pl-5'>
                  <p className='text-sm font-m'>Ceramah: </p>
                  <select
                    name='ceramah-promosi-umum'
                    id='ceramah-promosi-umum'
                    className='outline outline-1 outline-userBlack w-30 m-3 text-sm font-m'
                  >
                    <option value=''></option>
                    <option value='tiada'>Tiada</option>
                    <option value='baru'>Baru</option>
                    <option value='ulangan'>Ulangan</option>
                  </select>
                </div>
                <div className='flex flex-row items-center pl-5'>
                  <p className='text-sm font-m'>LMG: </p>
                  <select
                    name='lmg-promosi-umum'
                    id='lmg-promosi-umum'
                    className='outline outline-1 outline-userBlack w-30 m-3 text-sm font-m'
                  >
                    <option value=''></option>
                    <option value='tiada'>Tiada</option>
                    <option value='baru'>Baru</option>
                    <option value='ulangan'>Ulangan</option>
                  </select>
                </div>
              </article>
              <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <div className='flex flex-row items-center pl-5 m-1'>
                  <input
                    type='checkbox'
                    name='kursus-seminar-bengkel-promosi-umum'
                    id='kursus-seminar-bengkel-promosi-umum'
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                  />
                  <label
                    htmlFor='kursus-seminar-bengkel-promosi-umum'
                    className='mx-2 text-sm font-m'
                  >
                    Kursus / Seminar / Bengkel
                  </label>
                </div>
                <div className='flex flex-row items-center pl-5 m-1'>
                  <input
                    type='checkbox'
                    name='main-peranan-promosi-umum'
                    id='main-peranan-promosi-umum'
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                  />
                  <label
                    htmlFor='main-peranan-promosi-umum'
                    className='mx-2 text-sm font-m'
                  >
                    Main Peranan
                  </label>
                </div>
                <div className='flex flex-row items-center pl-5 m-1'>
                  <input
                    type='checkbox'
                    name='pertunjukan-boneka-promosi-umum'
                    id='pertunjukan-boneka-promosi-umum'
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                  />
                  <label
                    htmlFor='pertunjukan-boneka-promosi-umum'
                    className='mx-2 text-sm font-m'
                  >
                    pertunjukan boneka
                  </label>
                </div>
                <div className='flex flex-row items-center pl-5 m-1'>
                  <input
                    type='checkbox'
                    name='bercerita-promosi-umum'
                    id='bercerita-promosi-umum'
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                  />
                  <label
                    htmlFor='bercerita-promosi-umum'
                    className='mx-2 text-sm font-m'
                  >
                    Bercerita
                  </label>
                </div>
                <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2'>
                  <h4 className='flex flex-row pl-5 text-sm font-m'>
                    nasihat pergigian individu
                  </h4>
                  <div className='flex flex-row items-center pl-5 m-1'>
                    <input
                      type='checkbox'
                      name='plak-gigi-nasihat-pergigian-individu-promosi-umum'
                      id='plak-gigi-nasihat-pergigian-individu-promosi-umum'
                      className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                    />
                    <label
                      htmlFor='plak-gigi-nasihat-pergigian-individu-promosi-umum'
                      className='mx-2 text-sm font-m'
                    >
                      Plak Gigi
                    </label>
                  </div>
                  <div className='flex flex-row items-center pl-5 m-1'>
                    <input
                      type='checkbox'
                      name='penjagaan-kesihatan-oral-nasihat-pergigian-individu-promosi-umum'
                      id='penjagaan-kesihatan-oral-nasihat-pergigian-individu-promosi-umum'
                      className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                    />
                    <label
                      htmlFor='penjagaan-kesihatan-oral-nasihat-pergigian-individu-promosi-umum'
                      className='mx-2 text-sm font-m'
                    >
                      Penjagaan Kesihatan Oral
                    </label>
                  </div>
                  <div className='flex flex-row items-center pl-5 m-1'>
                    <input
                      type='checkbox'
                      name='diet-pemakanan-nasihat-pergigian-individu-promosi-umum'
                      id='diet-pemakanan-nasihat-pergigian-individu-promosi-umum'
                      className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                    />
                    <label
                      htmlFor='diet-pemakanan-nasihat-pergigian-individu-promosi-umum'
                      className='mx-2 text-sm font-m'
                    >
                      Diet Pemakanan
                    </label>
                  </div>
                  <div className='flex flex-row items-center pl-5 m-1'>
                    <input
                      type='checkbox'
                      name='kanser-mulut-nasihat-pergigian-individu-promosi-umum'
                      id='kanser-mulut-nasihat-pergigian-individu-promosi-umum'
                      className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                    />
                    <label
                      htmlFor='kanser-mulut-nasihat-pergigian-individu-promosi-umum'
                      className='mx-2 text-sm font-m'
                    >
                      Kanser Mulut
                    </label>
                  </div>
                </article>
                <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2'>
                  <h4 className='flex flex-row pl-5 text-sm font-m'>
                    Kaunseling Pakar Public Health
                  </h4>
                  <div className='flex flex-row items-center pl-5 m-1'>
                    <input
                      type='checkbox'
                      name='dirujuk-kaunseling-pakar-public-health-promosi-umum'
                      id='dirujuk-kaunseling-pakar-public-health-promosi-umum'
                      className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                    />
                    <label
                      htmlFor='dirujuk-kaunseling-pakar-public-health-promosi-umum'
                      className='mx-2 text-sm font-m'
                    >
                      Dirujuk
                    </label>
                  </div>
                </article>
              </article>
            </div>
            <div className='grid gap-2 auto-rows-min'>
              <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row col-span-2'>
                  bilangan ibu bapa / penjaga diberi anticipatory guidance (AG)
                </h4>
                <div className='flex items-center flex-row pl-5'>
                  <p className='text-sm font-m'>umur 15-17: </p>
                  <input
                    type='number'
                    name='umur-15-17-bilangan-ibu-bapa-penjaga-diberi-anticipatory-guidance-promosi-umum'
                    id='umur-15-17-bilangan-ibu-bapa-penjaga-diberi-anticipatory-guidance-promosi-umum'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
                <div className='flex items-center flex-row pl-5'>
                  <p className='text-sm font-m'>umur 18-19: </p>
                  <input
                    type='number'
                    name='umur-18-19-bilangan-ibu-bapa-penjaga-diberi-anticipatory-guidance-promosi-umum'
                    id='umur-18-19-bilangan-ibu-bapa-penjaga-diberi-anticipatory-guidance-promosi-umum'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
                <div className='flex items-center flex-row pl-5'>
                  <p className='text-sm font-m'>umur 20-29: </p>
                  <input
                    type='number'
                    name='umur-20-29-bilangan-ibu-bapa-penjaga-diberi-anticipatory-guidance-promosi-umum'
                    id='umur-20-29-bilangan-ibu-bapa-penjaga-diberi-anticipatory-guidance-promosi-umum'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
                <div className='flex items-center flex-row pl-5'>
                  <p className='text-sm font-m'>umur 30-49: </p>
                  <input
                    type='number'
                    name='umur-30-49-bilangan-ibu-bapa-penjaga-diberi-anticipatory-guidance-promosi-umum'
                    id='umur-30-49-bilangan-ibu-bapa-penjaga-diberi-anticipatory-guidance-promosi-umum'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
                <div className='flex items-center flex-row pl-5'>
                  <p className='text-sm font-m'>umur 50-59: </p>
                  <input
                    type='number'
                    name='umur-50-59-bilangan-ibu-bapa-penjaga-diberi-anticipatory-guidance-promosi-umum'
                    id='umur-50-59-bilangan-ibu-bapa-penjaga-diberi-anticipatory-guidance-promosi-umum'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
                <div className='flex items-center flex-row pl-5'>
                  <p className='text-sm font-m'>umur 60 ke atas: </p>
                  <input
                    type='number'
                    name='umur-60-ke-atas-bilangan-ibu-bapa-penjaga-diberi-anticipatory-guidance-promosi-umum'
                    id='umur-60-ke-atas-bilangan-ibu-bapa-penjaga-diberi-anticipatory-guidance-promosi-umum'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
              </article>
              {/* hijau */}
              <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5'>
                  melaksanakan aktiviti begin
                </h4>
                <div className='flex items-center justify-evenly'>
                  <div>
                    <input
                      type='radio'
                      name='melaksanakan-aktiviti-begin-promosi-umum'
                      id='ya-melaksanakan-aktiviti-begin-promosi-umum'
                      value='ya-melaksanakan-aktiviti-begin-promosi-umum'
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                      required
                    />
                    <label
                      htmlFor='ya-melaksanakan-aktiviti-begin-promosi-umum'
                      className='m-2 text-sm font-m'
                    >
                      Ya
                    </label>
                  </div>
                  <div>
                    <input
                      type='radio'
                      name='melaksanakan-aktiviti-begin-promosi-umum'
                      id='tidak-melaksanakan-aktiviti-begin-promosi-umum'
                      value='tidak-melaksanakan-aktiviti-begin-promosi-umum'
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                    />
                    <label
                      htmlFor='tidak-melaksanakan-aktiviti-begin-promosi-umum'
                      className='m-2 text-sm font-m'
                    >
                      Tidak
                    </label>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
