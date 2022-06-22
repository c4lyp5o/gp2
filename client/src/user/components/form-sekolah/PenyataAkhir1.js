export default function PenyataAkhir1(props) {
  return (
    <>
      <div className='p-2'>
        <div className='grid grid-cols-2'>
          <button className='flex bg-user3 p-2 w-full capitalize col-span-2'>
            <p className='ml-3 text-xl font-semibold'>Penyata Akhir 1</p>
          </button>
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
                    htmlFor='baru-jumlah-gigi-kekal-dibuat-fs'
                    className='text-sm font-m'
                  >
                    Baru
                  </label>
                  <input
                    type='text'
                    name='baru-jumlah-gigi-kekal-dibuat-fs'
                    id='baru-jumlah-gigi-kekal-dibuat-fs'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='semula-jumlah-gigi-kekal-dibuat-fs'
                    className='text-sm font-m'
                  >
                    Semula
                  </label>
                  <input
                    type='text'
                    name='semula-jumlah-gigi-kekal-dibuat-fs'
                    id='semula-jumlah-gigi-kekal-dibuat-fs'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
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
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='baru-jumlah-gigi-kekal-diberi-fv'
                    className='text-sm font-m'
                  >
                    Baru
                  </label>
                  <input
                    type='text'
                    name='baru-jumlah-gigi-kekal-diberi-fv'
                    id='baru-jumlah-gigi-kekal-diberi-fv'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
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
                    type='text'
                    name='semula-jumlah-gigi-kekal-diberi-fv'
                    id='semula-jumlah-gigi-kekal-diberi-fv'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
              </article>
              <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                  PRR Jenis 1
                </h4>
                <p className='flex flex-row pl-5 text-sm font-m col-span-2'>
                  jumlah gigi kekal diberi PRR Jenis 1
                </p>
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='baru-jumlah-gigi-kekal-diberi-prr-jenis-1'
                    className='text-sm font-m'
                  >
                    Baru
                  </label>
                  <input
                    type='text'
                    name='baru-jumlah-gigi-kekal-diberi-prr-jenis-1'
                    id='baru-jumlah-gigi-kekal-diberi-prr-jenis-1'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='semula-jumlah-gigi-kekal-diberi-prr-jenis-1'
                    className='text-sm font-m'
                  >
                    Semula
                  </label>
                  <input
                    type='text'
                    name='semula-jumlah-gigi-kekal-diberi-prr-jenis-1'
                    id='semula-jumlah-gigi-kekal-diberi-prr-jenis-1'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
              </article>
            </div>
            <div className='row-start-2 lg:row-start-1 col-start-1 lg:col-start-2'>
              <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                  Silver Diamine Fluoride
                </h4>
                <p className='flex flex-row pl-5 text-sm font-m col-span-2'>
                  Jumlah gigi yang diberi SDF:
                </p>
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='baru-jumlah-gigi-yang-diberi-sdf'
                    className='text-sm font-m'
                  >
                    Baru
                  </label>
                  <input
                    type='text'
                    name='baru-jumlah-gigi-yang-diberi-sdf'
                    id='baru-jumlah-gigi-yang-diberi-sdf'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='semula-jumlah-gigi-yang-diberi-sdf'
                    className='text-sm font-m'
                  >
                    Semula
                  </label>
                  <input
                    type='text'
                    name='semula-jumlah-gigi-yang-diberi-sdf'
                    id='semula-jumlah-gigi-yang-diberi-sdf'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
              </article>
            </div>
            <div className='grid'>
              <article className='border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                  Jumlah Tampalan Dibuat
                </h4>
                <div className='grid grid-rows-2 gap-2'>
                  <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='font-semibold flex flex-row pl-5 col-span-2'>
                      Anterior Sewarna
                    </h4>
                    <div className='flex flex-row items-center pl-5'>
                      <input
                        type='text'
                        name='gd-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                        id='gd-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                        className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                      />
                      <label
                        htmlFor='gd-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                        className='text-sm font-m ml-2 m-1'
                      >
                        GD Baru
                      </label>
                    </div>
                    <div className='flex flex-row items-center pl-5'>
                      <input
                        type='text'
                        name='gd-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                        id='gd-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                        className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                      />
                      <label
                        htmlFor='gd-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                        className='text-sm font-m ml-2 m-1'
                      >
                        GD Semula
                      </label>
                    </div>
                    <div className='flex flex-row items-center pl-5'>
                      <input
                        type='text'
                        name='gk-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                        id='gk-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                        className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                      />
                      <label
                        htmlFor='gk-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                        className='text-sm font-m ml-2 m-1'
                      >
                        GK Baru
                      </label>
                    </div>
                    <div className='flex flex-row items-center pl-5'>
                      <input
                        type='text'
                        name='gk-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                        id='gk-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                        className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                      />
                      <label
                        htmlFor='gk-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                        className='text-sm font-m ml-2 m-1'
                      >
                        GK Semula
                      </label>
                    </div>
                  </article>
                  <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='font-semibold flex flex-row pl-5 col-span-2'>
                      Posterior Sewarna
                    </h4>
                    <div className='flex flex-row items-center pl-5'>
                      <input
                        type='text'
                        name='gd-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                        id='gd-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                        className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                      />
                      <label
                        htmlFor='gd-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                        className='text-sm font-m ml-2 m-1'
                      >
                        GD Baru
                      </label>
                    </div>
                    <div className='flex flex-row items-center pl-5'>
                      <input
                        type='text'
                        name='gd-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                        id='gd-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                        className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                      />
                      <label
                        htmlFor='gd-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                        className='text-sm font-m ml-2 m-1'
                      >
                        GD Semula
                      </label>
                    </div>
                    <div className='flex flex-row items-center pl-5'>
                      <input
                        type='text'
                        name='gk-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                        id='gk-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                        className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                      />
                      <label
                        htmlFor='gk-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                        className='text-sm font-m ml-2 m-1'
                      >
                        GK Baru
                      </label>
                    </div>
                    <div className='flex flex-row items-center pl-5'>
                      <input
                        type='text'
                        name='gk-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                        id='gk-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                        className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                      />
                      <label
                        htmlFor='gk-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                        className='text-sm font-m ml-2 m-1'
                      >
                        GK Semula
                      </label>
                    </div>
                  </article>
                  <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='font-semibold flex flex-row pl-5 col-span-2'>
                      Posterior Amalgam
                    </h4>
                    <div className='flex flex-row items-center pl-5'>
                      <input
                        type='text'
                        name='gd-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                        id='gd-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                        className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                      />
                      <label
                        htmlFor='gd-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                        className='text-sm font-m ml-2 m-1'
                      >
                        GD Baru
                      </label>
                    </div>
                    <div className='flex flex-row items-center pl-5'>
                      <input
                        type='text'
                        name='gd-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                        id='gd-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                        className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                      />
                      <label
                        htmlFor='gd-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                        className='text-sm font-m ml-2 m-1'
                      >
                        GD Semula
                      </label>
                    </div>
                    <div className='flex flex-row items-center pl-5'>
                      <input
                        type='text'
                        name='gk-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                        id='gk-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                        className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                      />
                      <label
                        htmlFor='gk-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                        className='text-sm font-m ml-2 m-1'
                      >
                        GK Baru
                      </label>
                    </div>
                    <div className='flex flex-row items-center pl-5'>
                      <input
                        type='text'
                        name='gk-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                        id='gk-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                        className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                      />
                      <label
                        htmlFor='gk-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                        className='text-sm font-m ml-2 m-1'
                      >
                        GK Semula
                      </label>
                    </div>
                  </article>
                </div>
              </article>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
