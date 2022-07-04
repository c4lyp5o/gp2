export default function Rawatan() {
  return (
    <>
      <div className='p-2'>
        <div className='grid grid-cols-2'>
          <span className='flex bg-user3 p-2 w-full capitalize col-span-2'>
            <p className='ml-3 text-xl font-semibold'>Rawatan</p>
          </span>
          <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-3 mb-3 w-full col-span-2'>
            <div className='grid gap-2'>
              <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                  Fisur Sealan
                </h4>
                <p className='flex flex-row pl-5 text-sm font-m col-span-2'>
                  jumlah gigi kekal dibuat FS
                </p>
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='baru-jumlah-gigi-kekal-dibuat-fs-rawatan-umum'
                    className='text-sm font-m'
                  >
                    Baru
                  </label>
                  <input
                    type='number'
                    name='baru-jumlah-gigi-kekal-dibuat-fs-rawatan-umum'
                    id='baru-jumlah-gigi-kekal-dibuat-fs-rawatan-umum'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='16'
                  />
                </div>
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='semula-jumlah-gigi-kekal-dibuat-fs-rawatan-umum'
                    className='text-sm font-m'
                  >
                    Semula
                  </label>
                  <input
                    type='number'
                    name='semula-jumlah-gigi-kekal-dibuat-fs-rawatan-umum'
                    id='semula-jumlah-gigi-kekal-dibuat-fs-rawatan-umum'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='16'
                  />
                </div>
              </article>
              <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                  Fluoride Varnish
                </h4>
                <p className='flex flex-row pl-5 text-sm font-m col-span-2'>
                  jumlah gigi kekal diberi FV
                </p>
                {/* <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='baru-jumlah-gigi-kekal-diberi-fv'
                    className='text-sm font-m'
                  >
                    Baru
                  </label>
                  <input
                    type='number'
                    name='baru-jumlah-gigi-kekal-diberi-fv'
                    id='baru-jumlah-gigi-kekal-diberi-fv'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='32'
                    required
                  />
                </div>
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='semula-jumlah-gigi-kekal-diberi-fv'
                    className='text-sm font-m'
                  >
                    Semula
                  </label>
                  <input
                    type='number'
                    name='semula-jumlah-gigi-kekal-diberi-fv'
                    id='semula-jumlah-gigi-kekal-diberi-fv'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='32'
                    required
                  />
                </div> */}
              </article>
              <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                  PRR Jenis 1
                </h4>
                <p className='flex flex-row pl-5 text-sm font-m col-span-2'>
                  jumlah gigi diberi PRR Jenis 1
                </p>
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='baru-jumlah-gigi-kekal-diberi-prr-jenis-1-rawatan-umum'
                    className='text-sm font-m'
                  >
                    Baru
                  </label>
                  <input
                    type='number'
                    name='baru-jumlah-gigi-kekal-diberi-prr-jenis-1-rawatan-umum'
                    id='baru-jumlah-gigi-kekal-diberi-prr-jenis-1-rawatan-umum'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='16'
                  />
                </div>
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='semula-jumlah-gigi-kekal-diberi-prr-jenis-1-rawatan-umum'
                    className='text-sm font-m'
                  >
                    Semula
                  </label>
                  <input
                    type='number'
                    name='semula-jumlah-gigi-kekal-diberi-prr-jenis-1-rawatan-umum'
                    id='semula-jumlah-gigi-kekal-diberi-prr-jenis-1-rawatan-umum'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='16'
                  />
                </div>
              </article>
              <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                  cabutan
                </h4>
                <p className='flex items-center flex-row pl-5 text-m font-m col-span-2'>
                  Jumlah gigi telah dicabut
                </p>
                <div className='flex items-center justify-center'>
                  <p className='text-sm font-m'>Desidus: </p>
                  <input
                    type='number'
                    name='cabut-desidus-rawatan-umum'
                    id='cabut-desidus-rawatan-umum'
                    className='outline outline-1 outline-userBlack w-10 m-1 text-sm font-m'
                    min='0'
                    max='20'
                  />
                </div>
                <div className='flex items-center justify-center'>
                  <p className='text-sm font-m'>Kekal: </p>
                  <input
                    type='number'
                    name='cabut-kekal-rawatan-umum'
                    id='cabut-kekal-rawatan-umum'
                    className='outline outline-1 outline-userBlack w-10 m-1 text-sm font-m'
                    min='0'
                    max='32'
                  />
                </div>
                <div className='flex items-center flex-row col-span-2 pl-5'>
                  <p className='text-sm font-m'>Komplikasi selepas cabutan: </p>
                  <input
                    type='number'
                    name='komplikasi-selepas-cabutan-rawatan-umum'
                    id='komplikasi-selepas-cabutan-rawatan-umum'
                    className='outline outline-1 outline-userBlack w-10 m-1 text-sm font-m'
                    min='0'
                    max='32'
                  />
                </div>
                <div className='flex items-center flex-row col-span-2 pl-5'>
                  <p className='text-sm font-m'>
                    Cabutan disebabkan periodontitis:
                  </p>
                  <input
                    type='number'
                    name='cabutan-disebabkan-periodontitis-rawatan-umum'
                    id='cabutan-disebabkan-periodontitis-rawatan-umum'
                    className='outline outline-1 outline-userBlack w-10 m-1 text-sm font-m'
                    min='0'
                    max='32'
                  />
                </div>
              </article>
              <article className='grid grid-cols-2 border border-userBlack rounded-md'>
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                  Pembedahan Mulut
                </h4>
                <article className='grid grid-cols-2 col-span-2  border border-userBlack pl-3 m-1 mx-2'>
                  <p className='flex flex-row items-center pl-5 text-sm font-m'>
                    Abses
                  </p>
                  <div className='flex items-center justify-evenly'>
                    <div>
                      <input
                        required
                        type='radio'
                        name='ya-tidak-abses-pembedahan-rawatan-umum'
                        id='ya-abses-pembedahan-rawatan-umum'
                        value='ya-abses-pembedahan-rawatan-umum'
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                      />
                      <label
                        htmlFor='ya-abses-pembedahan-rawatan-umum'
                        className='m-2 text-sm font-m'
                      >
                        Ya
                      </label>
                    </div>
                    <div>
                      <input
                        required
                        type='radio'
                        name='ya-tidak-abses-pembedahan-rawatan-umum'
                        id='tidak-abses-pembedahan-rawatan-umum'
                        value='tidak-abses-pembedahan-rawatan-umum'
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                      />
                      <label
                        htmlFor='tidak-abses-pembedahan-rawatan-umum'
                        className='m-2 text-sm font-m'
                      >
                        Tidak
                      </label>
                    </div>
                  </div>
                  <div className='flex items-center justify-evenly col-start-2'>
                    <div>
                      <input
                        required
                        type='radio'
                        name='baru-semula-abses-pembedahan-rawatan-umum'
                        id='baru-abses-pembedahan-rawatan-umum'
                        value='baru-abses-pembedahan-rawatan-umum'
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                      />
                      <label
                        htmlFor='baru-abses-pembedahan-rawatan-umum'
                        className='m-2 text-sm font-m'
                      >
                        baru
                      </label>
                    </div>
                    <div>
                      <input
                        required
                        type='radio'
                        name='baru-semula-abses-pembedahan-rawatan-umum'
                        id='semula-abses-pembedahan-rawatan-umum'
                        value='semula-abses-pembedahan-rawatan-umum'
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                      />
                      <label
                        htmlFor='semula-abses-pembedahan-rawatan-umum'
                        className='m-2 text-sm font-m'
                      >
                        semula
                      </label>
                    </div>
                  </div>
                </article>
                <div className='flex items-center flex-row col-span-2 pl-5'>
                  <p className='text-sm font-m'>Cabutan surgikal :</p>
                  <input
                    type='number'
                    name='cabutan-surgikal-pembedahan-mulut-rawatan-umum'
                    id='cabutan-surgikal-pembedahan-mulut-rawatan-umum'
                    className='outline outline-1 outline-userBlack w-10 m-1 text-sm font-m'
                    min='0'
                    max='32'
                  />
                </div>
                <p className='flex flex-row items-center pl-5 text-sm font-m'>
                  fraktur
                </p>
                <div className='flex items-center justify-evenly'>
                  <div>
                    <input
                      required
                      type='radio'
                      name='ya-tidak-fraktur-pembedahan-rawatan-umum'
                      id='ya-fraktur-pembedahan-rawatan-umum'
                      value='ya-fraktur-pembedahan-rawatan-umum'
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                    />
                    <label
                      htmlFor='ya-fraktur-pembedahan-rawatan-umum'
                      className='m-2 text-sm font-m'
                    >
                      Ya
                    </label>
                  </div>
                  <div>
                    <input
                      required
                      type='radio'
                      name='ya-tidak-fraktur-pembedahan-rawatan-umum'
                      id='tidak-fraktur-pembedahan-rawatan-umum'
                      value='tidak-fraktur-pembedahan-rawatan-umum'
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                    />
                    <label
                      htmlFor='tidak-fraktur-pembedahan-rawatan-umum'
                      className='m-2 text-sm font-m'
                    >
                      Tidak
                    </label>
                  </div>
                </div>
                <p className='flex flex-row items-center pl-5 text-sm font-m'>
                  trauma
                </p>
                <div className='flex items-center justify-evenly'>
                  <div>
                    <input
                      required
                      type='radio'
                      name='ya-tidak-trauma-pembedahan-rawatan-umum'
                      id='ya-trauma-pembedahan-rawatan-umum'
                      value='ya-trauma-pembedahan-rawatan-umum'
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                    />
                    <label
                      htmlFor='ya-trauma-pembedahan-rawatan-umum'
                      className='m-2 text-sm font-m'
                    >
                      Ya
                    </label>
                  </div>
                  <div>
                    <input
                      required
                      type='radio'
                      name='ya-tidak-trauma-pembedahan-rawatan-umum'
                      id='tidak-trauma-pembedahan-rawatan-umum'
                      value='tidak-trauma-pembedahan-rawatan-umum'
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                    />
                    <label
                      htmlFor='tidak-trauma-pembedahan-rawatan-umum'
                      className='m-2 text-sm font-m'
                    >
                      Tidak
                    </label>
                  </div>
                </div>
                <p className='flex flex-row items-center pl-5 text-sm font-m'>
                  pembedahan kecil mulut
                </p>
                <div className='flex items-center justify-evenly'>
                  <div>
                    <input
                      required
                      type='radio'
                      name='ya-tidak-pembedahan-kecil-mulut-pembedahan-rawatan-umum'
                      id='ya-pembedahan-kecil-mulut-pembedahan-rawatan-umum'
                      value='ya-pembedahan-kecil-mulut-pembedahan-rawatan-umum'
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                    />
                    <label
                      htmlFor='ya-pembedahan-kecil-mulut-pembedahan-rawatan-umum'
                      className='m-2 text-sm font-m'
                    >
                      Ya
                    </label>
                  </div>
                  <div>
                    <input
                      required
                      type='radio'
                      name='ya-tidak-pembedahan-kecil-mulut-pembedahan-rawatan-umum'
                      id='tidak-pembedahan-kecil-mulut-pembedahan-rawatan-umum'
                      value='tidak-pembedahan-kecil-mulut-pembedahan-rawatan-umum'
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                    />
                    <label
                      htmlFor='tidak-pembedahan-kecil-mulut-pembedahan-rawatan-umum'
                      className='m-2 text-sm font-m'
                    >
                      Tidak
                    </label>
                  </div>
                </div>
              </article>
              <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5'>status rawatan</h4>
                <div className='flex flex-row items-center pl-5 m-1'>
                  <input
                    type='checkbox'
                    name='kes-selesai-rawatan-umum'
                    id='kes-selesai-rawatan-umum'
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                  />
                  <label
                    htmlFor='kes-selesai-rawatan-umum'
                    className='mx-2 text-sm font-m'
                  >
                    kes selesai
                  </label>
                </div>
                <div className='flex flex-row items-center pl-5 m-1'>
                  <input
                    type='checkbox'
                    name='tpr-rawatan-umum'
                    id='tpr-rawatan-umum'
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                  />
                  <label
                    htmlFor='tpr-rawatan-umum'
                    className='mx-2 text-sm font-m'
                  >
                    TPR
                  </label>
                </div>
                <div className='flex flex-row items-center pl-5 m-1'>
                  <input
                    type='checkbox'
                    name='kes-selesai-periodontium-rawatan-umum'
                    id='kes-selesai-periodontium-rawatan-umum'
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                  />
                  <label
                    htmlFor='kes-selesai-periodontium-rawatan-umum'
                    className='mx-2 text-sm font-m'
                  >
                    kes selesai periodontium
                  </label>
                </div>
              </article>
            </div>
            <div className='grid gap-2 auto-rows-min'>
              <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                  Silver Diamine Fluoride
                </h4>
                <p className='flex flex-row pl-5 text-sm font-m col-span-2'>
                  Jumlah gigi yang diberi SDF:
                </p>
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='baru-jumlah-gigi-yang-diberi-sdf-rawatan-umum'
                    className='text-sm font-m'
                  >
                    Baru
                  </label>
                  <input
                    type='number'
                    name='baru-jumlah-gigi-yang-diberi-sdf-rawatan-umum'
                    id='baru-jumlah-gigi-yang-diberi-sdf-rawatan-umum'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='16'
                    required
                  />
                </div>
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='semula-jumlah-gigi-yang-diberi-sdf-rawatan-umum'
                    className='text-sm font-m'
                  >
                    Semula
                  </label>
                  <input
                    type='number'
                    name='semula-jumlah-gigi-yang-diberi-sdf-rawatan-umum'
                    id='semula-jumlah-gigi-yang-diberi-sdf-rawatan-umum'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='16'
                    required
                  />
                </div>
              </article>
              <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                  Prostodontik
                </h4>
                <p className='flex flex-row pl-5 text-sm font-m col-span-2'>
                  crown / bridge:
                </p>
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='baru-jumlah-crown-bridge-rawatan-umum'
                    className='text-sm font-m'
                  >
                    Baru
                  </label>
                  <input
                    type='number'
                    name='baru-jumlah-crown-bridge-rawatan-umum'
                    id='baru-jumlah-crown-bridge-rawatan-umum'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='32'
                  />
                </div>
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='semula-jumlah-crown-bridge-rawatan-umum'
                    className='text-sm font-m'
                  >
                    Semula
                  </label>
                  <input
                    type='number'
                    name='semula-jumlah-crown-bridge-rawatan-umum'
                    id='semula-jumlah-crown-bridge-rawatan-umum'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='32'
                  />
                </div>
                <p className='flex flex-row pl-5 text-sm font-m col-span-2'>
                  post & core:
                </p>
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='baru-jumlah-post-core-rawatan-umum'
                    className='text-sm font-m'
                  >
                    Baru
                  </label>
                  <input
                    type='number'
                    name='baru-jumlah-post-core-rawatan-umum'
                    id='baru-jumlah-post-core-rawatan-umum'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='32'
                  />
                </div>
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='semula-jumlah-post-core-rawatan-umum'
                    className='text-sm font-m'
                  >
                    Semula
                  </label>
                  <input
                    type='number'
                    name='semula-jumlah-post-core-rawatan-umum'
                    id='semula-jumlah-post-core-rawatan-umum'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='32'
                  />
                </div>
                <article className='grid grid-cols-2 col-span-2  border border-userBlack p-2 m-1 mx-1'>
                  <p className='flex flex-row pl-5 text-sm font-m col-span-2'>
                    Dentur
                  </p>
                  <div className='flex flex-row items-center p-1'>
                    <label
                      htmlFor='penuh-jumlah-dentur-prostodontik-rawatan-umum'
                      className='text-sm font-m'
                    >
                      penuh
                    </label>
                    <input
                      type='number'
                      name='penuh-jumlah-dentur-prostodontik-rawatan-umum'
                      id='penuh-jumlah-dentur-prostodontik-rawatan-umum'
                      className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      min='0'
                      max='2'
                    />
                  </div>
                  <div className='flex flex-row items-center p-1'>
                    <label
                      htmlFor='sebahagian-jumlah-dentur-prostodontik-rawatan-umum'
                      className='text-sm font-m'
                    >
                      sebahagian
                    </label>
                    <input
                      type='number'
                      name='sebahagian-jumlah-dentur-prostodontik-rawatan-umum'
                      id='sebahagian-jumlah-dentur-prostodontik-rawatan-umum'
                      className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      min='0'
                      max='2'
                    />
                  </div>
                </article>
                <div className='flex flex-row items-center pl-5 col-span-2'>
                  <label
                    htmlFor='immediate-dentur-prostodontik-rawatan-umum'
                    className='text-sm font-m'
                  >
                    immediate denture
                  </label>
                  <input
                    type='number'
                    name='immediate-dentur-prostodontik-rawatan-umum'
                    id='immediate-dentur-prostodontik-rawatan-umum'
                    className='outline outline-1 outline-userBlack w-10 ml-3 text-sm font-m'
                    min='0'
                    max='2'
                  />
                </div>
                <div className='flex flex-row items-center pl-5 col-span-2'>
                  <label
                    htmlFor='pembaikan-dentur-prostodontik-rawatan-umum'
                    className='text-sm font-m'
                  >
                    pembaikan denture
                  </label>
                  <input
                    type='number'
                    name='pembaikan-dentur-prostodontik-rawatan-umum'
                    id='pembaikan-dentur-prostodontik-rawatan-umum'
                    className='outline outline-1 outline-userBlack w-10 ml-3 text-sm font-m'
                    min='0'
                    max='2'
                  />
                </div>
              </article>
              <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                  rawatan periodontik
                </h4>
                <div className='flex flex-row items-center pl-5 m-1'>
                  <input
                    type='checkbox'
                    name='penskaleran-rawatan-umum'
                    id='penskaleran-rawatan-umum'
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                  />
                  <label
                    htmlFor='penskaleran-rawatan-umum'
                    className='mx-2 text-sm font-m'
                  >
                    penskaleran
                  </label>
                </div>
                <div className='flex flex-row items-center pl-5 m-1'>
                  <input
                    type='checkbox'
                    name='rawatan-lain-periodontik-rawatan-umum'
                    id='rawatan-lain-periodontik-rawatan-umum'
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                  />
                  <label
                    htmlFor='rawatan-lain-periodontik-rawatan-umum'
                    className='mx-2 text-sm font-m'
                  >
                    rawatan lain
                  </label>
                </div>
              </article>
              <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5'>
                  bilangan x-ray yang diambil
                </h4>
                <input
                  type='number'
                  name='bilangan-xray-yang-diambil-rawatan-umum'
                  id='bilangan-xray-yang-diambil-rawatan-umum'
                  className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                />
              </article>
            </div>
            <div className='grid gap-2 auto-rows-min'>
              <article className='border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                  Jumlah Tampalan Dibuat
                </h4>
                <div className='grid grid-rows-2 gap-2'>
                  <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='font-semibold flex flex-row pl-3 col-span-2'>
                      Anterior Sewarna
                    </h4>
                    <div className='flex flex-row items-center pl-3'>
                      <input
                        type='number'
                        name='gd-baru-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        id='gd-baru-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                      />
                      <label
                        htmlFor='gd-baru-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        className='text-sm font-m ml-2 m-1'
                      >
                        GD Baru
                      </label>
                    </div>
                    <div className='flex flex-row items-center pl-3'>
                      <input
                        type='number'
                        name='gd-semula-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        id='gd-semula-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                      />
                      <label
                        htmlFor='gd-semula-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        className='text-sm font-m ml-2 m-1'
                      >
                        GD Semula
                      </label>
                    </div>
                    <div className='flex flex-row items-center pl-3'>
                      <input
                        type='number'
                        name='gk-baru-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        id='gk-baru-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                      />
                      <label
                        htmlFor='gk-baru-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        className='text-sm font-m ml-2 m-1'
                      >
                        GK Baru
                      </label>
                    </div>
                    <div className='flex flex-row items-center pl-3'>
                      <input
                        type='number'
                        name='gk-semula-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        id='gk-semula-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                      />
                      <label
                        htmlFor='gk-semula-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        className='text-sm font-m ml-2 m-1'
                      >
                        GK Semula
                      </label>
                    </div>
                  </article>
                  <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='font-semibold flex flex-row pl-3 col-span-2'>
                      Posterior Sewarna
                    </h4>
                    <div className='flex flex-row items-center pl-3'>
                      <input
                        type='number'
                        name='gd-baru-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        id='gd-baru-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                      />
                      <label
                        htmlFor='gd-baru-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        className='text-sm font-m ml-2 m-1'
                      >
                        GD Baru
                      </label>
                    </div>
                    <div className='flex flex-row items-center pl-3'>
                      <input
                        type='number'
                        name='gd-semula-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        id='gd-semula-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                      />
                      <label
                        htmlFor='gd-semula-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        className='text-sm font-m ml-2 m-1'
                      >
                        GD Semula
                      </label>
                    </div>
                    <div className='flex flex-row items-center pl-3'>
                      <input
                        type='number'
                        name='gk-baru-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        id='gk-baru-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                      />
                      <label
                        htmlFor='gk-baru-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        className='text-sm font-m ml-2 m-1'
                      >
                        GK Baru
                      </label>
                    </div>
                    <div className='flex flex-row items-center pl-3'>
                      <input
                        type='number'
                        name='gk-semula-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        id='gk-semula-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                      />
                      <label
                        htmlFor='gk-semula-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        className='text-sm font-m ml-2 m-1'
                      >
                        GK Semula
                      </label>
                    </div>
                  </article>
                  <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='font-semibold flex flex-row pl-3 col-span-2'>
                      Posterior Amalgam
                    </h4>
                    <div className='flex flex-row items-center pl-3'>
                      <input
                        type='number'
                        name='gd-baru-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                        id='gd-baru-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                        className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                      />
                      <label
                        htmlFor='gd-baru-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                        className='text-sm font-m ml-2 m-1'
                      >
                        GD Baru
                      </label>
                    </div>
                    <div className='flex flex-row items-center pl-3'>
                      <input
                        type='number'
                        name='gd-semula-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                        id='gd-semula-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                        className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                      />
                      <label
                        htmlFor='gd-semula-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                        className='text-sm font-m ml-2 m-1'
                      >
                        GD Semula
                      </label>
                    </div>
                    <div className='flex flex-row items-center pl-3'>
                      <input
                        type='number'
                        name='gk-baru-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                        id='gk-baru-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                        className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                      />
                      <label
                        htmlFor='gk-baru-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                        className='text-sm font-m ml-2 m-1'
                      >
                        GK Baru
                      </label>
                    </div>
                    <div className='flex flex-row items-center pl-3'>
                      <input
                        type='number'
                        name='gk-semula-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                        id='gk-semula-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                        className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                      />
                      <label
                        htmlFor='gk-semula-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                        className='text-sm font-m ml-2 m-1'
                      >
                        GK Semula
                      </label>
                    </div>
                  </article>
                  <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='font-semibold flex flex-row pl-3 col-span-2'>
                      inlay / onlay
                    </h4>
                    <div className='flex flex-row items-center pl-3'>
                      <input
                        type='number'
                        name='baru-inlay-onlay-jumlah-tampalan-dibuat-rawatan-umum'
                        id='baru-inlay-onlay-jumlah-tampalan-dibuat-rawatan-umum'
                        className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                      />
                      <label
                        htmlFor='baru-inlay-onlay-jumlah-tampalan-dibuat-rawatan-umum'
                        className='text-sm font-m ml-2 m-1'
                      >
                        Baru
                      </label>
                    </div>
                    <div className='flex flex-row items-center pl-3'>
                      <input
                        type='number'
                        name='semula-inlay-onlay-jumlah-tampalan-dibuat-rawatan-umum'
                        id='semula-inlay-onlay-jumlah-tampalan-dibuat-rawatan-umum'
                        className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                      />
                      <label
                        htmlFor='semula-inlay-onlay-jumlah-tampalan-dibuat-rawatan-umum'
                        className='text-sm font-m ml-2 m-1'
                      >
                        Semula
                      </label>
                    </div>
                  </article>
                  <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='font-semibold flex flex-row pl-3'>
                      tampalan sementara
                    </h4>
                    <div className='flex flex-row items-center pl-3'>
                      <label
                        htmlFor='jumlah-tampalan-sementara-jumlah-tampalan-dibuat-rawatan-umum'
                        className='text-sm font-m m-1'
                      >
                        jumlah tampalan sementara :
                      </label>
                      <input
                        type='number'
                        name='jumlah-tampalan-sementara-jumlah-tampalan-dibuat-rawatan-umum'
                        id='jumlah-tampalan-sementara-jumlah-tampalan-dibuat-rawatan-umum'
                        className='outline outline-1 outline-userBlack w-10 text-sm font-m ml-3'
                      />
                    </div>
                  </article>
                </div>
              </article>
              {/* pink */}
              <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-semibold flex flex-row pl-3'>
                  rawatan semula di KEPP
                </h4>
                <div className='flex flex-row items-center pl-3'>
                  <label
                    htmlFor='jumlah-anterior-rawatan-semula-kepp-rawatan-umum'
                    className='text-sm font-m m-1'
                  >
                    anterior :
                  </label>
                  <input
                    type='number'
                    name='jumlah-anterior-rawatan-semula-kepp-rawatan-umum'
                    id='jumlah-anterior-rawatan-semula-kepp-rawatan-umum'
                    className='outline outline-1 outline-userBlack w-10 text-sm font-m ml-3'
                  />
                </div>
                <div className='flex flex-row items-center pl-3'>
                  <label
                    htmlFor='jumlah-premolar-rawatan-semula-kepp-rawatan-umum'
                    className='text-sm font-m m-1'
                  >
                    premolar :
                  </label>
                  <input
                    type='number'
                    name='jumlah-premolar-rawatan-semula-kepp-rawatan-umum'
                    id='jumlah-premolar-rawatan-semula-kepp-rawatan-umum'
                    className='outline outline-1 outline-userBlack w-10 text-sm font-m ml-3'
                  />
                </div>
                <div className='flex flex-row items-center pl-3'>
                  <label
                    htmlFor='jumlah-molar-rawatan-semula-kepp-rawatan-umum'
                    className='text-sm font-m m-1'
                  >
                    molar :
                  </label>
                  <input
                    type='number'
                    name='jumlah-molar-rawatan-semula-kepp-rawatan-umum'
                    id='jumlah-molar-rawatan-semula-kepp-rawatan-umum'
                    className='outline outline-1 outline-userBlack w-10 text-sm font-m ml-3'
                  />
                </div>
              </article>
              {/* pink */}
              <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-semibold flex flex-row pl-3'>
                  kes endodontik selesai
                </h4>
                <div className='flex flex-row items-center pl-3'>
                  <label
                    htmlFor='jumlah-anterior-kes-endodontik-selesai-rawatan-umum'
                    className='text-sm font-m m-1'
                  >
                    anterior :
                  </label>
                  <input
                    type='number'
                    name='jumlah-anterior-kes-endodontik-selesai-rawatan-umum'
                    id='jumlah-anterior-kes-endodontik-selesai-rawatan-umum'
                    className='outline outline-1 outline-userBlack w-10 text-sm font-m ml-3'
                  />
                </div>
                <div className='flex flex-row items-center pl-3'>
                  <label
                    htmlFor='jumlah-premolar-kes-endodontik-selesai-rawatan-umum'
                    className='text-sm font-m m-1'
                  >
                    premolar :
                  </label>
                  <input
                    type='number'
                    name='jumlah-premolar-kes-endodontik-selesai-rawatan-umum'
                    id='jumlah-premolar-kes-endodontik-selesai-rawatan-umum'
                    className='outline outline-1 outline-userBlack w-10 text-sm font-m ml-3'
                  />
                </div>
                <div className='flex flex-row items-center pl-3'>
                  <label
                    htmlFor='jumlah-molar-kes-endodontik-selesai-rawatan-umum'
                    className='text-sm font-m m-1'
                  >
                    molar :
                  </label>
                  <input
                    type='number'
                    name='jumlah-molar-kes-endodontik-selesai-rawatan-umum'
                    id='jumlah-molar-kes-endodontik-selesai-rawatan-umum'
                    className='outline outline-1 outline-userBlack w-10 text-sm font-m ml-3'
                  />
                </div>
                <div className='flex flex-row items-center pl-3'>
                  <label
                    htmlFor='rawatan-semula-endodontik-dari-primer-kes-endodontik-selesai-rawatan-umum'
                    className='text-sm font-m m-1'
                  >
                    rawatan semula endodontik dari primer :
                  </label>
                  <input
                    type='number'
                    name='rawatan-semula-endodontik-dari-primer-kes-endodontik-selesai-rawatan-umum'
                    id='rawatan-semula-endodontik-dari-primer-kes-endodontik-selesai-rawatan-umum'
                    className='outline outline-1 outline-userBlack w-10 text-sm font-m ml-3'
                  />
                </div>
              </article>
              {/* pink */}
              <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-semibold flex flex-row pl-3'>
                  kes rujuk UPPR
                </h4>
                <div className='flex flex-row items-center pl-3'>
                  <label
                    htmlFor='memenuhi-rditn-kod3-kes-rujuk-uppr-rawatan-umum'
                    className='text-sm font-m m-1'
                  >
                    memenuhi RDITN kod 3 :
                  </label>
                  <input
                    type='number'
                    name='memenuhi-rditn-kod3-kes-rujuk-uppr-rawatan-umum'
                    id='memenuhi-rditn-kod3-kes-rujuk-uppr-rawatan-umum'
                    className='outline outline-1 outline-userBlack w-10 text-sm font-m ml-3'
                  />
                </div>
                <div className='flex flex-row items-center pl-3'>
                  <label
                    htmlFor='restorasi-pasca-endodontik-kes-rujuk-uppr-rawatan-umum'
                    className='text-sm font-m m-1'
                  >
                    restorasi pasca endodontik :
                  </label>
                  <input
                    type='number'
                    name='restorasi-pasca-endodontik-kes-rujuk-uppr-rawatan-umum'
                    id='restorasi-pasca-endodontik-kes-rujuk-uppr-rawatan-umum'
                    className='outline outline-1 outline-userBlack w-10 text-sm font-m ml-3'
                  />
                </div>
                <div className='flex flex-row items-center pl-3'>
                  <label
                    htmlFor='komplikasi-semasa-rawatan-kepp-kes-rujuk-uppr-rawatan-umum'
                    className='text-sm font-m m-1'
                  >
                    komplikasi semasa rawatan KEPP :
                  </label>
                  <input
                    type='number'
                    name='komplikasi-semasa-rawatan-kepp-kes-rujuk-uppr-rawatan-umum'
                    id='komplikasi-semasa-rawatan-kepp-kes-rujuk-uppr-rawatan-umum'
                    className='outline outline-1 outline-userBlack w-10 text-sm font-m ml-3'
                  />
                </div>
              </article>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
