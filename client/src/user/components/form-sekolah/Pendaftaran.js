export default function Pendaftaran(props) {
  return (
    <>
      <div className='p-2'>
        <div className='grid grid-cols-2'>
          <button className='flex bg-user3 p-2 w-full capitalize col-span-2'>
            <p className='ml-3 text-xl font-semibold'>Pendaftaran</p>
          </button>
          <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-3 mb-3 w-full col-span-2'>
            <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
              <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                Penyampaian Perkhidmatan
              </h4>
              <div className='flex flex-row items-center pl-5'>
                <input
                  ref={props.kpBergerak}
                  checked={props.toMap.isKpBergerakChecked}
                  onChange={() => {
                    props.toMap.setIsKpBergerakChecked(
                      !props.toMap.isKpBergerakChecked
                    );
                  }}
                  type='checkbox'
                  name='kp-bergerak'
                  id='kp-bergerak'
                  className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                />
                <label htmlFor='kp-bergerak' className='ml-2 text-sm font-m'>
                  KP Bergerak
                </label>
              </div>
              <div className='flex flex-row items-center pl-5 col-span-2'>
                <input
                  ref={props.pasukanPergigianBergerak}
                  checked={props.toMap.isPasukanPergigianBergerakChecked}
                  onChange={() => {
                    props.toMap.setIsPasukanPergigianBergerakChecked(
                      !props.toMap.isPasukanPergigianBergerakChecked
                    );
                  }}
                  type='checkbox'
                  name='pasukan-pergigian-bergerak'
                  id='pasukan-pergigian-bergerak'
                  className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                />
                <label
                  htmlFor='pasukan-pergigian-bergerak'
                  className='ml-2 text-sm font-m '
                >
                  Pasukan Pergigian Bergerak
                </label>
              </div>
              <div className='flex flex-row items-center pl-5'>
                <select
                  ref={props.plateNo}
                  value={props.toMap.plateNo}
                  onChange={(e) => {
                    props.toMap.setPlateNo(e.target.value);
                  }}
                  name='plate-no'
                  id='plate-no'
                  className='outline outline-1 outline-userBlack w-auto text-sm font-m'
                >
                  <option value=''>Plate No</option>
                  <option value='1'>1</option>
                </select>
              </div>
            </article>
            <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
              <h4 className='flex flex-row items-center pl-5 font-bold col-span-2'>
                Kedatangan
              </h4>
              <div className='grid grid-rows-2 col-span-2 lg:col-span-1'>
                <div className='flex items-center flex-row pl-5 '>
                  <input
                    type='radio'
                    name='kedatangan'
                    id='baru-kedatangan-pendaftaran'
                    value='baru-kedatangan-pendaftaran'
                    checked={
                      props.baruUlanganKedatanganPendaftaran ===
                      'baru-kedatangan-pendaftaran'
                        ? true
                        : false
                    }
                    className='w-4 h-4 inline-block text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                    onChange={(e) => {
                      props.setBaruUlanganKedatanganPendaftaran(e.target.value);
                    }}
                  />
                  <label
                    htmlFor='baru-kedatangan-pendaftaran'
                    className='m-2 text-sm font-m'
                  >
                    Baru
                  </label>
                </div>
                <div className='flex items-center flex-row pl-5'>
                  <input
                    type='radio'
                    name='kedatangan'
                    id='ulangan-kedatangan-pendaftaran'
                    value='ulangan-kedatangan-pendaftaran'
                    checked={
                      props.baruUlanganKedatanganPendaftaran ===
                      'ulangan-kedatangan-pendaftaran'
                        ? true
                        : false
                    }
                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                    onChange={(e) => {
                      props.setBaruUlanganKedatanganPendaftaran(e.target.value);
                    }}
                  />
                  <label
                    htmlFor='ulangan-kedatangan-pendaftaran'
                    className='m-2 text-sm font-m'
                  >
                    Ulangan
                  </label>
                </div>
              </div>
              <div className='grid grid-rows-2'>
                <div className='flex items-center flex-row pl-5'>
                  <input
                    ref={props.engganKedatanganPendaftaran}
                    type='checkbox'
                    name='enggan-kedatangan'
                    id='enggan-kedatangan'
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                  />
                  <label
                    htmlFor='enggan-kedatangan'
                    className='m-2 text-sm font-m'
                  >
                    Enggan
                  </label>
                </div>
                <div className='flex items-center flex-row pl-5'>
                  <input
                    ref={props.tidakHadirKedatanganPendaftaran}
                    type='checkbox'
                    name='tidak-hadir-kedatangan'
                    id='tidak-hadir-kedatangan'
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                  />
                  <label
                    htmlFor='tidak-hadir-kedatangan'
                    className='m-2 text-sm font-m'
                  >
                    Tidak Hadir
                  </label>
                </div>
              </div>
              <div className='outline outline-1 outline-userBlack grid grid-rows-3 col-start-2'>
                <h4 className=' font-bold flex items-center flex-row px-2 text-clip'>
                  Pemeriksaan
                </h4>
                <div className='flex items-center flex-row px-2'>
                  <input
                    type='radio'
                    name='pemeriksaan'
                    id='ada-pemeriksaan'
                    value='ada-pemeriksaan'
                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                    onChange={(e) => {
                      props.setAdaTiadaPemeriksaanPendaftaran(e.target.value);
                    }}
                  />
                  <label
                    htmlFor='ada-pemeriksaan'
                    className='m-2 text-sm font-m'
                  >
                    Ada
                  </label>
                </div>
                <div className='flex items-center flex-row px-2'>
                  <input
                    type='radio'
                    name='pemeriksaan'
                    id='tiada-pemeriksaan'
                    value='tiada-pemeriksaan'
                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                    onChange={(e) => {
                      props.setAdaTiadaPemeriksaanPendaftaran(e.target.value);
                    }}
                  />
                  <label
                    htmlFor='tiada-pemeriksaan'
                    className='m-2 text-sm font-m'
                  >
                    Tiada
                  </label>
                </div>
              </div>
            </article>
            <article className='grid grid-cols-2 border border-userBlack pl-5 rounded-md'>
              <h4 className='font-bold flex flex-row items-center pl-5 col-span-2'>
                Risiko Sekolah (PERSiS)
              </h4>
              <div className='flex items-center flex-row pl-5'>
                <input
                  type='radio'
                  name='risiko-sekolah'
                  id='tinggi-risiko-sekolah'
                  value='tinggi-risiko-sekolah'
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                  onChange={(e) => {
                    props.setTinggiRendahRisikoSekolahPendaftaran(
                      e.target.value
                    );
                  }}
                />
                <label
                  htmlFor='tinggi-risiko-sekolah'
                  className='m-2 text-sm font-m'
                >
                  Tinggi
                </label>
              </div>
              <div className='flex items-center flex-row pl-5'>
                <input
                  type='radio'
                  name='risiko-sekolah'
                  id='rendah-risiko-sekolah'
                  value='rendah-risiko-sekolah'
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                  onChange={(e) => {
                    props.setTinggiRendahRisikoSekolahPendaftaran(
                      e.target.value
                    );
                  }}
                />
                <label
                  htmlFor='rendah-risiko-sekolah'
                  className='m-2 text-sm font-m'
                >
                  Rendah
                </label>
              </div>
            </article>
          </section>
        </div>
      </div>
    </>
  );
}
