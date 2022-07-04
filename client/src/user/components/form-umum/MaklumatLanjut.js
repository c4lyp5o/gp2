function MaklumatLanjut(props) {
  return (
    <>
      <div className='p-2'>
        <span className='flex bg-user3 p-2 w-full col-span-2'>
          <p className='ml-3 text-xl font-semibold'>maklumat lanjut</p>
        </span>
        <section className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 mb-3 w-full'>
          <article className='flex justify-center border border-userBlack pl-3 p-2 rounded-md'>
            <div className='flex items-center flex-row pl-5 '>
              <p className='font-semibold'>kedatangan</p>
            </div>
            <div className='flex items-center flex-row pl-5 '>
              <input
                required
                type='radio'
                name='kedatangan'
                id='baru-kedatangan'
                value='baru-kedatangan'
                className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
              />
              <label htmlFor='baru-kedatangan' className='m-2 text-sm font-m'>
                baru
              </label>
            </div>
            <div className='flex items-center flex-row pl-5 '>
              <input
                required
                type='radio'
                name='kedatangan'
                id='ulangan-kedatangan'
                value='ulangan-kedatangan'
                className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
              />
              <label
                htmlFor='ulangan-kedatangan'
                className='m-2 text-sm font-m'
              >
                ulangan
              </label>
            </div>
          </article>
          <div className='row-span-4 border border-userBlack pl-3 p-2 rounded-md'>
            <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
              <div>
                <p className='font-semibold'>fasiliti taska / tadika</p>
                <select name='fasiliti' id='fasiliti'>
                  <option value=''>Pilih</option>
                  <option value='taska'>Taska</option>
                  <option value='tadika'>Tadika</option>
                </select>
              </div>
              {/* buang className ni nnti */}
              <div className='overflow-x-auto'>
                <select name='jenis-taska-tadika' id='jenis-taska-tadika'>
                  <option value=''>Pilih</option>
                  <option value='wuuttttt?'>
                    Taska & Tadika Ada Pilihan Kerajaan & Swasta??
                  </option>
                </select>
                <input
                  type='checkbox'
                  id='kelas-toddler'
                  className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                />
                <label htmlFor='kelas-toddler' className='ml-2 text-sm font-m'>
                  kelas toddler
                </label>
              </div>
            </article>
            <p className='font-semibold'>nama fasiliti</p>
            <select name='nama-fasiliti' id='nama-fasiliti' className='w-11/12'>
              <option value=''>Pilih</option>
              <option value='taska perak'>Taska Perak</option>
              <option value='tadika emas'>Tadika Emas</option>
            </select>
            <div className='flex items-center flex-row pl-5 '>
              <label
                htmlFor='enrolmen-taska-tadika'
                className='m-2 text-sm font-m'
              >
                enrolmen
              </label>
              <input
                required
                type='checkbox'
                id='enrolmen-taska-tadika'
                className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
              />
            </div>
            <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
              <h4 className='flex flex-row items-center pl-5 font-bold col-span-2'>
                kedatangan taska / tadika
              </h4>
              <div className='grid grid-rows-2 col-span-2 lg:col-span-1'>
                <div className='flex items-center flex-row pl-5 '>
                  <input
                    required
                    type='radio'
                    name='kedatangan-taska-tadika'
                    id='baru-kedatangan-taska-tadika'
                    value='baru-kedatangan-taska-tadika'
                    className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                  />
                  <label
                    htmlFor='baru-kedatangan-taska-tadika'
                    className='m-2 text-sm font-m'
                  >
                    baru
                  </label>
                </div>
                <div className='flex items-center flex-row pl-5'>
                  <input
                    required
                    type='radio'
                    name='kedatangan-taska-tadika'
                    id='ulangan-kedatangan-taska-tadika'
                    value='ulangan-kedatangan-taska-tadika'
                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                  />
                  <label
                    htmlFor='ulangan-kedatangan-taska-tadika'
                    className='m-2 text-sm font-m'
                  >
                    ulangan
                  </label>
                </div>
              </div>
              <div className='grid grid-rows-2'>
                <div className='flex items-center flex-row pl-5'>
                  <input
                    type='checkbox'
                    name='enggan-taska-tadika'
                    id='enggan-taska-tadika'
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                  />
                  <label
                    htmlFor='enggan-taska-tadika'
                    className='m-2 text-sm font-m'
                  >
                    enggan
                  </label>
                </div>
                <div className='flex items-center flex-row pl-5'>
                  <input
                    type='checkbox'
                    name='tidak-hadir-taska-tadika'
                    id='tidak-hadir-taska-tadika'
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                  />
                  <label
                    htmlFor='tidak-hadir-taska-tadika'
                    className='m-2 text-sm font-m'
                  >
                    tidak hadir
                  </label>
                </div>
              </div>
              <div className=' outline outline-1 outline-userBlack grid grid-rows-3 col-start-2'>
                <h4 className=' font-bold flex items-center flex-row px-2 text-clip'>
                  pemeriksaan
                </h4>
                <div className='flex items-center flex-row px-2'>
                  <input
                    type='radio'
                    name='pemeriksaan-taska-tadika'
                    id='ada-pemeriksaan-taska-tadika'
                    value='ada-pemeriksaan-taska-tadika'
                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                  />
                  <label
                    htmlFor='ada-pemeriksaan-taska-tadika'
                    className='m-2 text-sm font-m'
                  >
                    ada
                  </label>
                </div>
                <div className='flex items-center flex-row px-2'>
                  <input
                    type='radio'
                    name='pemeriksaan-taska-tadika'
                    id='tiada-pemeriksaan-taska-tadika'
                    value='tiada-pemeriksaan-taska-tadika'
                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                  />
                  <label
                    htmlFor='tiada-pemeriksaan-taska-tadika'
                    className='m-2 text-sm font-m'
                  >
                    tiada
                  </label>
                </div>
              </div>
            </article>
          </div>
          <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
            <div>
              <p className='font-semibold'>ibu mengandung</p>
            </div>
            <div className='grid grid-cols-2'>
              <div className='flex items-center flex-row pl-5 '>
                <input
                  required
                  type='radio'
                  name='ya-tidak-ibu-mengandung'
                  id='ya-ibu-mengandung'
                  value='ya-ibu-mengandung'
                  className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                />
                <label
                  htmlFor='ya-ibu-mengandung'
                  className='m-2 text-sm font-m'
                >
                  ya
                </label>
              </div>
              <div className='flex items-center flex-row pl-5 '>
                <input
                  required
                  type='radio'
                  name='ya-tidak-ibu-mengandung'
                  id='tidak-ibu-mengandung'
                  value='tidak-ibu-mengandung'
                  className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                />
                <label
                  htmlFor='tidak-ibu-mengandung'
                  className='m-2 text-sm font-m'
                >
                  tidak
                </label>
              </div>
              <div className='flex items-center flex-row pl-5 '>
                <input
                  required
                  type='radio'
                  name='baru-ulangan-ibu-mengandung'
                  id='baru-ibu-mengandung'
                  value='baru-ibu-mengandung'
                  className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                />
                <label
                  htmlFor='baru-ibu-mengandung'
                  className='m-2 text-sm font-m'
                >
                  baru
                </label>
              </div>
              <div className='flex items-center flex-row pl-5 '>
                <input
                  required
                  type='radio'
                  name='baru-ulangan-ibu-mengandung'
                  id='ulangan-ibu-mengandung'
                  value='ulangan-ibu-mengandung'
                  className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                />
                <label
                  htmlFor='ulangan-ibu-mengandung'
                  className='m-2 text-sm font-m'
                >
                  ulangan
                </label>
              </div>
            </div>
          </article>
          <article className='grid justify-center border border-userBlack pl-3 p-2 rounded-md'>
            <div className='flex'>
              <div className='flex items-center flex-row pl-5 '>
                <p className='font-semibold'>kedatangan KEPP</p>
              </div>
              <div className='flex items-center flex-row pl-5 '>
                <input
                  required
                  type='radio'
                  name='kedatangan-kepp'
                  id='baru-kedatangan-kepp'
                  value='baru-kedatangan-kepp'
                  className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                />
                <label
                  htmlFor='baru-kedatangan-kepp'
                  className='m-2 text-sm font-m'
                >
                  baru
                </label>
              </div>
              <div className='flex items-center flex-row pl-5 '>
                <input
                  required
                  type='radio'
                  name='kedatangan-kepp'
                  id='ulangan-kedatangan-kepp'
                  value='ulangan-kedatangan-kepp'
                  className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                />
                <label
                  htmlFor='ulangan-kedatangan-kepp'
                  className='m-2 text-sm font-m'
                >
                  ulangan
                </label>
              </div>
            </div>
            <div className='flex items-center flex-row pl-5 '>
              <label htmlFor='tarikh-rujukan' className='m-2 text-sm font-m'>
                tarikh rujukan
              </label>
              <input
                type='date'
                name='tarikh-rujukan'
                id='tarikh-rujukan'
                className='outline outline-1 outline-userBlack m-2 text-sm font-m'
              />
            </div>
            <div className='flex items-center flex-row pl-5 '>
              <label
                htmlFor='tarikh-mula-rawatan'
                className='m-2 text-sm font-m'
              >
                tarikh mula rawatan
              </label>
              <input
                type='date'
                name='tarikh-mula-rawatan'
                id='tarikh-mula-rawatan'
                className='outline outline-1 outline-userBlack m-2 text-sm font-m'
              />
            </div>
          </article>
          <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
            <p className='font-semibold col-span-2'>penyampaian perkhidmatan</p>
            <div className='flex items-center flex-row pl-5 '>
              <input
                required
                type='checkbox'
                id='kp-bergerak'
                className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
              />
              <label htmlFor='kp-bergerak' className='m-2 text-sm font-m'>
                KP bergerak
              </label>
              <select name='kp-bergerak' id='kp-bergerak'>
                <option value=''>Label</option>
                <option value='apa??'>Apa?</option>
              </select>
            </div>
            <div className='flex items-center flex-row pl-5 '>
              <input
                required
                type='checkbox'
                id='pasukan-pergigian-bergerak'
                className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
              />
              <label
                htmlFor='pasukan-pergigian-bergerak'
                className='m-2 text-sm font-m'
              >
                pasukan pergigian bergerak
              </label>
            </div>
            <div className='flex items-center flex-row pl-5 '>
              <input
                required
                type='checkbox'
                id='makmal-pergigian-bergerak'
                className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
              />
              <label
                htmlFor='makmal-pergigian-bergerak'
                className='m-2 text-sm font-m'
              >
                makmal pergigian bergerak
              </label>
              <select
                name='makmal-pergigian-bergerak'
                id='makmal-pergigian-bergerak'
              >
                <option value=''>Label</option>
                <option value='apa??'>Apa?</option>
              </select>
            </div>
          </article>
          <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
            <div>
              <p className='font-semibold'>KG angkat</p>
            </div>
            <div className='grid'>
              <div className='flex items-center flex-row pl-5 '>
                <input
                  required
                  type='radio'
                  name='kg-angkat'
                  id='komuniti-kg-angkat'
                  value='komuniti-kg-angkat'
                  className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                />
                <label
                  htmlFor='komuniti-kg-angkat'
                  className='m-2 text-sm font-m'
                >
                  komuniti
                </label>
              </div>
              <div className='flex items-center flex-row pl-5 '>
                <input
                  required
                  type='radio'
                  name='kg-angkat'
                  id='lawatan-ke-rumah-kg-angkat'
                  value='lawatan-ke-rumah-kg-angkat'
                  className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                />
                <label
                  htmlFor='lawatan-ke-rumah-kg-angkat'
                  className='m-2 text-sm font-m'
                >
                  lawatan ke rumah
                </label>
              </div>
            </div>
          </article>
          <div className='row-span-3'>
            <article className='grid grid-cols-3 border border-userBlack pl-3 p-2 rounded-md'>
              <div>
                <p className='font-semibold'>
                  institusi pengajian tinggi / kolej
                </p>
              </div>
              <div className='grid'>
                <div className='flex items-center flex-row pl-5 '>
                  <input
                    required
                    type='radio'
                    name='institusi-pengajian-tinggi-kolej'
                    id='ipg-institusi-pengajian-tinggi-kolej'
                    value='ipg-institusi-pengajian-tinggi-kolej'
                    className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                  />
                  <label
                    htmlFor='ipg-institusi-pengajian-tinggi-kolej'
                    className='m-2 text-sm font-m'
                  >
                    IPG
                  </label>
                </div>
                <div className='flex items-center flex-row pl-5 '>
                  <input
                    required
                    type='radio'
                    name='institusi-pengajian-tinggi-kolej'
                    id='kolej-komuniti-institusi-pengajian-tinggi-kolej'
                    value='kolej-komuniti-institusi-pengajian-tinggi-kolej'
                    className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                  />
                  <label
                    htmlFor='kolej-komuniti-institusi-pengajian-tinggi-kolej'
                    className='m-2 text-sm font-m'
                  >
                    kolej komuniti
                  </label>
                </div>
                <div className='flex items-center flex-row pl-5 '>
                  <input
                    required
                    type='radio'
                    name='institusi-pengajian-tinggi-kolej'
                    id='politeknik-institusi-pengajian-tinggi-kolej'
                    value='politeknik-institusi-pengajian-tinggi-kolej'
                    className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                  />
                  <label
                    htmlFor='politeknik-institusi-pengajian-tinggi-kolej'
                    className='m-2 text-sm font-m'
                  >
                    politeknik
                  </label>
                </div>
                <div className='flex items-center flex-row pl-5 '>
                  <input
                    required
                    type='radio'
                    name='institusi-pengajian-tinggi-kolej'
                    id='institut-latihan-kerajaan-institusi-pengajian-tinggi-kolej'
                    value='institut-latihan-kerajaan-institusi-pengajian-tinggi-kolej'
                    className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                  />
                  <label
                    htmlFor='institut-latihan-kerajaan-institusi-pengajian-tinggi-kolej'
                    className='m-2 text-sm font-m'
                  >
                    institut latihan kerajaan
                  </label>
                </div>
                <div className='flex items-center flex-row pl-5 '>
                  <input
                    required
                    type='radio'
                    name='institusi-pengajian-tinggi-kolej'
                    id='giatmara-institusi-pengajian-tinggi-kolej'
                    value='giatmara-institusi-pengajian-tinggi-kolej'
                    className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                  />
                  <label
                    htmlFor='giatmara-institusi-pengajian-tinggi-kolej'
                    className='m-2 text-sm font-m'
                  >
                    giatmara
                  </label>
                </div>
              </div>
              <div className='grid justify-start'>
                <div className='flex items-center flex-row pl-5 '>
                  <select
                    name='ipg-institusi-pengajian-tinggi-kolej'
                    id='ipg-institusi-pengajian-tinggi-kolej'
                    className='ml-5'
                  >
                    <option value=''>Label</option>
                    <option value='apa??'>Apa?</option>
                  </select>
                </div>
                <div className='flex items-center flex-row pl-5 '>
                  <select
                    name='kolej-komuniti-institusi-pengajian-tinggi-kolej'
                    id='kolej-komuniti-institusi-pengajian-tinggi-kolej'
                    className='ml-5'
                  >
                    <option value=''>Label</option>
                    <option value='apa??'>Apa?</option>
                  </select>
                </div>
                <div className='flex items-center flex-row pl-5 '>
                  <select
                    name='politeknik-institusi-pengajian-tinggi-kolej'
                    id='politeknik-institusi-pengajian-tinggi-kolej'
                    className='ml-5'
                  >
                    <option value=''>Label</option>
                    <option value='apa??'>Apa?</option>
                  </select>
                </div>
                <div className='flex items-center flex-row pl-5 '>
                  <select
                    name='institut-latihan-kerajaan-institusi-pengajian-tinggi-kolej'
                    id='institut-latihan-kerajaan-institusi-pengajian-tinggi-kolej'
                    className='ml-5'
                  >
                    <option value=''>Label</option>
                    <option value='apa??'>Apa?</option>
                  </select>
                </div>
                <div className='flex items-center flex-row pl-5 '>
                  <select
                    name='giatmara-institusi-pengajian-tinggi-kolej'
                    id='giatmara-institusi-pengajian-tinggi-kolej'
                    className='ml-5'
                  >
                    <option value=''>Label</option>
                    <option value='apa??'>Apa?</option>
                  </select>
                </div>
              </div>
              <div className='flex items-center flex-row pl-5 '>
                <label
                  htmlFor='enrolmen-institusi-pengajian-tinggi-kolej'
                  className='m-2 text-sm font-m'
                >
                  enrolmen
                </label>
                <input
                  required
                  type='checkbox'
                  id='enrolmen-institusi-pengajian-tinggi-kolej'
                  className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                />
              </div>
            </article>
          </div>
          <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
            <div>
              <p className='font-semibold'>institusi OKU</p>
            </div>
            <div className='grid'>
              <div className='flex items-center flex-row pl-5 '>
                <input
                  required
                  type='radio'
                  name='institusi-oku'
                  id='pdk-institusi-oku'
                  value='pdk-institusi-oku'
                  className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                />
                <label
                  htmlFor='pdk-institusi-oku'
                  className='m-2 text-sm font-m'
                >
                  PDK
                </label>
              </div>
              <div className='flex items-center flex-row pl-5 '>
                <input
                  required
                  type='radio'
                  name='institusi-oku'
                  id='non-pdk-institusi-oku'
                  value='non-pdk-institusi-oku'
                  className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                />
                <label
                  htmlFor='non-pdk-institusi-oku'
                  className='m-2 text-sm font-m'
                >
                  non - PDK
                </label>
              </div>
            </div>
          </article>
          <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
            <div>
              <p className='font-semibold'>institusi warga emas</p>
            </div>
            <div className='grid'>
              <div className='flex items-center flex-row pl-5 '>
                <input
                  required
                  type='radio'
                  name='institusi-warga-emas'
                  id='kerajaan-institusi-warga-emas'
                  value='kerajaan-institusi-warga-emas'
                  className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                />
                <label
                  htmlFor='kerajaan-institusi-warga-emas'
                  className='m-2 text-sm font-m'
                >
                  kerajaan
                </label>
                <select
                  name='kerajaan-institusi-warga-emas'
                  id='kerajaan-institusi-warga-emas'
                  className='ml-3'
                >
                  <option value=''>Label</option>
                  <option value='apa??'>Apa?</option>
                </select>
              </div>
              <div className='flex items-center flex-row pl-5 '>
                <input
                  required
                  type='radio'
                  name='institusi-warga-emas'
                  id='swasta-institusi-warga-emas'
                  value='swasta-institusi-warga-emas'
                  className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                />
                <label
                  htmlFor='swasta-institusi-warga-emas'
                  className='m-2 text-sm font-m'
                >
                  swasta
                </label>
                <select
                  name='swasta-institusi-warga-emas'
                  id='swasta-institusi-warga-emas'
                  className='ml-5'
                >
                  <option value=''>Label</option>
                  <option value='apa??'>Apa?</option>
                </select>
              </div>
            </div>
          </article>
        </section>
      </div>
    </>
  );
}

export default MaklumatLanjut;
