export default function PemeriksaanAwal(props) {
  return (
    <>
      <div className='p-2'>
        <div className='grid grid-cols-2 '>
          <button className='flex bg-user3 p-2 w-full capitalize col-span-2'>
            <p className='ml-3 text-xl font-semibold'>Pemeriksaan Awal</p>
          </button>
          <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-3 mb-3 w-full col-span-2 '>
            <div className='grid gap-2'>
              <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md '>
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                  Cleft Lip/Palate
                </h4>
                <div className='flex flex-row items-center pl-5 pt-1'>
                  <input
                    ref={props.adaCleftLip}
                    type='checkbox'
                    name='ada-cleft-lip'
                    id='ada-cleft-lip'
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                  />
                  <label
                    htmlFor='ada-cleft-lip'
                    className='mx-2 text-sm font-m'
                  >
                    Ada
                  </label>
                </div>
                <div className='flex flex-row items-center pl-5 pt-1'>
                  <input
                    ref={props.rujukCleftLip}
                    type='checkbox'
                    name='rujuk-cleft-lip-palate'
                    id='rujuk-cleft-lip-palate'
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                  />
                  <label
                    htmlFor='rujuk-cleft-lip-palate'
                    className='mx-2 text-sm font-m'
                  >
                    Rujuk
                  </label>
                </div>
              </article>
              <article className='row-span-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5'>Status denture</h4>
                <div className='grid grid-rows-2 gap-2'>
                  <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='font-semibold'>Sedia Ada?</h4>
                    <div className='flex items-center justify-center'>
                      <input
                        ref={props.adaDenture}
                        type='radio'
                        name='sedia-ada-status-denture'
                        id='ada-sedia-ada-status-denture'
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                      />
                      <label
                        htmlFor='ada-sedia-ada-status-denture'
                        className='m-2 text-sm font-m'
                      >
                        Ada
                      </label>
                      <input
                        ref={props.tidakAdaDenture}
                        type='radio'
                        name='sedia-ada-status-denture'
                        id='tidak-sedia-ada-status-denture'
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                      />
                      <label
                        htmlFor='tidak-sedia-ada-status-denture'
                        className='m-2 text-sm font-m'
                      >
                        Tidak
                      </label>
                    </div>
                    <div className='flex items-center flex-row pl-5'>
                      <label
                        htmlFor='atas-sedia-ada-denture'
                        className='m-2 text-sm font-m'
                      >
                        Atas
                      </label>
                      <input
                        ref={props.atasSediaAdaDenture}
                        type='checkbox'
                        name='atas-sedia-ada-denture'
                        id='atas-sedia-ada-denture'
                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                      />
                    </div>
                    <div className='grid grid-cols-2'>
                      <div className='flex items-center justify-center'>
                        <input
                          ref={props.separaAtasSediaAdaDenture}
                          type='radio'
                          name='separa-penuh-atas-sedia-ada-denture'
                          id='separa-atas-sedia-ada-denture'
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='separa-atas-sedia-ada-denture'
                          className='m-2 text-sm font-m'
                        >
                          Separa
                        </label>
                      </div>
                      <div className='flex items-center justify-center'>
                        <input
                          ref={props.penuhAtasSediaAdaDenture}
                          type='radio'
                          name='separa-penuh-atas-sedia-ada-denture'
                          id='penuh-atas-sedia-ada-denture'
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='penuh-atas-sedia-ada-denture'
                          className='m-2 text-sm font-m'
                        >
                          Penuh
                        </label>
                      </div>
                    </div>
                    <div className='flex items-center flex-row pl-5'>
                      <label
                        htmlFor='bawah-sedia-ada-denture'
                        className='m-2 text-sm font-m'
                      >
                        Bawah
                      </label>
                      <input
                        ref={props.bawahSediaAdaDenture}
                        type='checkbox'
                        name='bawah-sedia-ada-denture'
                        id='bawah-sedia-ada-denture'
                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                      />
                    </div>
                    <div className='grid grid-cols-2'>
                      <div className='flex items-center justify-center'>
                        <input
                          ref={props.separaBawahSediaAdaDenture}
                          type='radio'
                          name='separa-penuh-bawah-sedia-ada-denture'
                          id='separa-bawah-sedia-ada-denture'
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='separa-bawah-sedia-ada-denture'
                          className='m-2 text-sm font-m'
                        >
                          Separa
                        </label>
                      </div>
                      <div className='flex items-center justify-center'>
                        <input
                          ref={props.penuhBawahSediaAdaDenture}
                          type='radio'
                          name='separa-penuh-bawah-sedia-ada-denture'
                          id='penuh-bawah-sedia-ada-denture'
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='penuh-bawah-sedia-ada-denture'
                          className='m-2 text-sm font-m'
                        >
                          Penuh
                        </label>
                      </div>
                    </div>
                  </article>
                  <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='font-semibold'>Perlu</h4>
                    <div className='flex items-center justify-center'>
                      <input
                        ref={props.perluDenture}
                        type='radio'
                        name='perlu-status-denture'
                        id='ada-perlu-status-denture'
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                      />
                      <label
                        htmlFor='ada-perlu-status-denture'
                        className='m-2 text-sm font-m'
                      >
                        Ada
                      </label>
                      <input
                        ref={props.tidakPerluDenture}
                        type='radio'
                        name='perlu-status-denture'
                        id='tidak-perlu-status-denture'
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                      />
                      <label
                        htmlFor='tidak-perlu-status-denture'
                        className='m-2 text-sm font-m'
                      >
                        Tidak
                      </label>
                    </div>
                    <div className='flex items-center flex-row pl-5'>
                      <label
                        htmlFor='atas-perlu-denture'
                        className='m-2 text-sm font-m'
                      >
                        Atas
                      </label>
                      <input
                        ref={props.atasPerluDenture}
                        type='checkbox'
                        name='atas-perlu-denture'
                        id='atas-perlu-denture'
                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                      />
                    </div>
                    <div className='grid grid-cols-2'>
                      <div className='flex items-center justify-center'>
                        <input
                          ref={props.separaAtasPerluDenture}
                          type='radio'
                          name='separa-penuh-atas-perlu-denture'
                          id='separa-atas-perlu-denture'
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='separa-atas-perlu-denture'
                          className='m-2 text-sm font-m'
                        >
                          Separa
                        </label>
                      </div>
                      <div className='flex items-center justify-center'>
                        <input
                          ref={props.penuhAtasPerluDenture}
                          type='radio'
                          name='separa-penuh-atas-perlu-denture'
                          id='penuh-atas-perlu-denture'
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='penuh-atas-perlu-denture'
                          className='m-2 text-sm font-m'
                        >
                          Penuh
                        </label>
                      </div>
                    </div>
                    <div className='flex items-center flex-row pl-5'>
                      <label
                        htmlFor='bawah-perlu-denture'
                        className='m-2 text-sm font-m'
                      >
                        Bawah
                      </label>
                      <input
                        ref={props.bawahPerluDenture}
                        type='checkbox'
                        name='bawah-perlu-denture'
                        id='bawah-perlu-denture'
                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                      />
                    </div>
                    <div className='grid grid-cols-2'>
                      <div className='flex items-center justify-center'>
                        <input
                          ref={props.separaBawahPerluDenture}
                          type='radio'
                          name='separa-penuh-bawah-perlu-denture'
                          id='separa-bawah-perlu-denture'
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='separa-bawah-perlu-denture'
                          className='m-2 text-sm font-m'
                        >
                          Separa
                        </label>
                      </div>
                      <div className='flex items-center justify-center'>
                        <input
                          ref={props.penuhBawahPerluDenture}
                          type='radio'
                          name='separa-penuh-bawah-perlu-denture'
                          id='penuh-bawah-perlu-denture'
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='penuh-bawah-perlu-denture'
                          className='m-2 text-sm font-m'
                        >
                          Penuh
                        </label>
                      </div>
                    </div>
                  </article>
                </div>
              </article>
              <article className='grid grid-cols-1 xl:grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5 col-span-1 xl:col-span-2'>
                  Trauma
                </h4>
                <div className='flex items-center flex-row pl-5'>
                  <input
                    ref={props.toothSurfaceLossTrauma}
                    type='checkbox'
                    name='tooth-surface-loss'
                    id='tooth-surface-loss'
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                  />
                  <label
                    htmlFor='tooth-surface-loss'
                    className='m-2 text-sm font-m'
                  >
                    Tooth Surface Loss
                  </label>
                </div>
                <div className='flex items-center flex-row pl-5'>
                  <input
                    ref={props.kecederaanGigiAnteriorTrauma}
                    type='checkbox'
                    name='kecederaan-gigi-anterior'
                    id='kecederaan-gigi-anterior'
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                  />
                  <label
                    htmlFor='kecederaan-gigi-anterior'
                    className='m-1 text-sm font-m'
                  >
                    Kecederaan Gigi Anterior
                  </label>
                </div>
                <div className='flex items-center flex-row pl-5'>
                  <input
                    ref={props.tisuLembutTrauma}
                    type='checkbox'
                    name='tisu-lembut'
                    id='tisu-lembut'
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                  />
                  <label htmlFor='tisu-lembut' className='m-2 text-sm font-m'>
                    Tisu Lembut
                  </label>
                </div>
                <div className='flex items-center flex-row pl-5'>
                  <input
                    ref={props.tisuKerasTrauma}
                    type='checkbox'
                    name='tisu-keras'
                    id='tisu-keras'
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                  />
                  <label htmlFor='tisu-keras' className='m-2 text-sm font-m'>
                    Tisu Keras
                  </label>
                </div>
              </article>
            </div>
            <div className='grid gap-2'>
              <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                  Oral Hygiene
                </h4>
                <div className='flex items-center '>
                  <p className='flex flex-row pl-5 text-sm font-m col-span-2 md:col'>
                    Kebersihan Mulut
                  </p>
                  <select
                    ref={props.kebersihanMulutOralHygiene}
                    name='kebersihan-mulut'
                    id='kebersihan-mulut'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  >
                    <option value=''></option>
                    <option value='A'>A</option>
                    <option value='C'>C</option>
                    <option value='E'>E</option>
                  </select>
                </div>
                <div className='flex items-center flex-row pl-5'>
                  <select
                    ref={props.skorBpeOralHygiene}
                    name='skor-bpe'
                    id='skor-bpe'
                    className='outline outline-1 outline-userBlack w-30 m-3 text-sm font-m'
                  >
                    <option value=''>Skor BPE</option>
                    <option value='0'>0</option>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                  </select>
                </div>
                <div className='flex items-center flex-row pl-5'>
                  <label
                    htmlFor='saringan-kanser-mulut'
                    className='text-sm font-m'
                  >
                    Saringan Kanser Mulut
                  </label>
                  <input
                    ref={props.saringanKanserMulutOralHygiene}
                    type='checkbox'
                    name='saringan-kanser-mulut'
                    id='saringan-kanser-mulut'
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 m-2'
                  />
                </div>
                <div className='flex items-center flex-row pl-5'>
                  <select
                    ref={props.skorGisMulutOralHygiene}
                    name='skor-gis'
                    id='skor-gis'
                    className='outline outline-1 outline-userBlack w-30 m-3 text-sm font-m'
                  >
                    <option value=''>Skor GIS</option>
                    <option value='0'>0</option>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                  </select>
                </div>
              </article>
              <article className=' border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5'>
                  Status Gigi Desidus
                </h4>
                <div className='flex flex-row pl-5 '>
                  <div className='grid grid-cols-2'>
                    <button className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m col-span-2'>
                      Tiada
                    </button>
                    {/* tukar ada jika tekan button hilang <p> sekali*/}
                    <p className='text-sm font-m'>
                      Klik butang di atas jika ada gigi desidus
                    </p>
                    {/* display jika ada gigi desidus */}
                    <div className='flex flex-row items-center'>
                      <p className='text-sm font-m lowercase'>d: </p>
                      <input
                        ref={props.dAdaGigiDesidus}
                        type='text'
                        name='d-ada-status-gigi-desidus'
                        id='d-ada-status-gigi-desidus'
                        className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      />
                    </div>
                    <div className='flex flex-row items-center'>
                      <p className='text-sm font-m lowercase'>m: </p>
                      <input
                        ref={props.mAdaGigiDesidus}
                        type='text'
                        name='m-ada-status-gigi-desidus'
                        id='m-ada-status-gigi-desidus'
                        className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      />
                    </div>
                    <div className='flex flex-row items-center'>
                      <p className='text-sm font-m lowercase'>f: </p>
                      <input
                        ref={props.fAdaGigiDesidus}
                        type='text'
                        name='f-ada-status-gigi-desidus'
                        id='f-ada-status-gigi-desidus'
                        className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      />
                    </div>
                    <div className='flex flex-row items-center'>
                      <p className='text-sm font-m lowercase'>e: </p>
                      <input
                        ref={props.eAdaGigiDesidus}
                        type='text'
                        name='e-ada-status-gigi-desidus'
                        id='e-ada-status-gigi-desidus'
                        className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      />
                    </div>
                    <div className='flex flex-row items-center'>
                      <p className='text-sm font-m lowercase'>x: </p>
                      <input
                        ref={props.xAdaGigiDesidus}
                        type='text'
                        name='x-ada-status-gigi-desidus'
                        id='x-ada-status-gigi-desidus'
                        className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      />
                    </div>
                  </div>
                </div>
              </article>
              <article className='border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5'>
                  Status Gigi Kekal
                </h4>
                <div className='flex flex-row pl-5 '>
                  <div className='grid grid-cols-2'>
                    <button className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m col-span-2'>
                      Tiada
                    </button>
                    {/* tukar ada jika tekan button hilang <p> sekali*/}
                    <p>Klik butang di atas jika ada gigi kekal</p>
                    {/* display jika ada gigi desidus */}
                    <div className='flex flex-row items-center'>
                      <p className='text-sm font-m '>D: </p>
                      <input
                        ref={props.dAdaGigiKekal}
                        type='text'
                        name='d-ada-status-gigi-kekal'
                        id='d-ada-status-gigi-kekal'
                        className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      />
                    </div>
                    <div className='flex flex-row items-center'>
                      <p className='text-sm font-m '>M: </p>
                      <input
                        ref={props.mAdaGigiKekal}
                        type='text'
                        name='m-ada-status-gigi-kekal'
                        id='m-ada-status-gigi-kekal'
                        className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      />
                    </div>
                    <div className='flex flex-row items-center'>
                      <p className='text-sm font-m '>F: </p>
                      <input
                        ref={props.fAdaGigiKekal}
                        type='text'
                        name='f-ada-status-gigi-kekal'
                        id='f-ada-status-gigi-kekal'
                        className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      />
                    </div>
                    <div className='flex flex-row items-center'>
                      <p className='text-sm font-m '>E: </p>
                      <input
                        ref={props.eAdaGigiKekal}
                        type='text'
                        name='e-ada-status-gigi-kekal'
                        id='e-ada-status-gigi-kekal'
                        className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      />
                    </div>
                    <div className='flex flex-row items-center'>
                      <p className='text-sm font-m '>X: </p>
                      <input
                        ref={props.xAdaGigiKekal}
                        type='text'
                        name='x-ada-status-gigi-kekal'
                        id='x-ada-status-gigi-kekal'
                        className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      />
                    </div>
                  </div>
                </div>
              </article>
              <article className='border border-userBlack pl-3 p-2 rounded-md'>
                <div className='grid grid-cols-1'>
                  <h4 className='font-bold flex flex-row pl-5'>
                    Risiko Karies
                  </h4>
                  <div className='flex flex-row'>
                    <p className='flex items-center flex-row pl-5'>
                      Jumlah Faktor Risiko:
                    </p>
                    <input
                      ref={props.jumlahFaktorRisiko}
                      type='text'
                      name='jumlah-faktor-risiko'
                      id='jumlah-faktor-risiko'
                      className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    />
                  </div>
                  <div className='grid grid-cols-3 gap-1'>
                    {/* depend on faktor risiko tukar warna */}
                    <p className='outline outline-1 outline-userBlack w-30 m-1 text-sm font-m '>
                      Rendah
                    </p>
                    <p className='outline outline-1 outline-userBlack w-30 m-1 text-sm font-m'>
                      Sederhana
                    </p>
                    <p className='outline outline-1 outline-userBlack w-30 m-1 text-sm font-m'>
                      Tinggi
                    </p>
                  </div>
                </div>
              </article>
            </div>
            <div className='grid gap-2'>
              <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                  Bilangan FS Dibuat 3 Tahun Lepas
                </h4>
                <div className='flex flex-row pl-5 items-center'>
                  <p className='text-sm font-m '>GIC: </p>
                  <input
                    ref={props.gicBilanganFsDibuat3TahunLepas}
                    type='text'
                    name='gic-bilangan-fs-dibuat-3-tahun-lepas'
                    id='gic-bilangan-fs-dibuat-3-tahun-lepas'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
                <div className='flex flex-row pl-5 items-center'>
                  <p className='text-sm font-m '>Resin: </p>
                  <input
                    ref={props.resinBilanganFsDibuat3TahunLepas}
                    type='text'
                    name='resin-bilangan-fs-dibuat-3-tahun-lepas'
                    id='resin-bilangan-fs-dibuat-3-tahun-lepas'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
                <div className='flex flex-row pl-5 items-center col-span-2 md:col-span-1'>
                  <p className='text-sm font-m '>Lain-lain: </p>
                  <input
                    ref={props.lainLainBilanganFsDibuat3TahunLepas}
                    type='text'
                    name='lain-lain-bilangan-fs-dibuat-3-tahun-lepas'
                    id='lain-lain-bilangan-fs-dibuat-3-tahun-lepas'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
              </article>
              <article className='grid grid-cols-2 md:grid-cols-3 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5 col-span-2 md:col-span-3'>
                  Bilangan FS Dibuat 3 Tahun Lepas Terjadi
                </h4>
                <div className='flex flex-row pl-5 items-center'>
                  <p className='text-sm font-m '>D: </p>
                  <input
                    ref={props.dBilanganFsDibuat3TahunLepasTerjadi}
                    type='text'
                    name='d-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                    id='d-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
                <div className='flex flex-row pl-5 items-center'>
                  <p className='text-sm font-m '>M: </p>
                  <input
                    ref={props.mBilanganFsDibuat3TahunLepasTerjadi}
                    type='text'
                    name='m-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                    id='m-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
                <div className='flex flex-row pl-5 items-center'>
                  <p className='text-sm font-m '>F: </p>
                  <input
                    ref={props.fBilanganFsDibuat3TahunLepasTerjadi}
                    type='text'
                    name='f-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                    id='f-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
                <div className='flex flex-row pl-5 items-center'>
                  <p className='text-sm font-m '>E: </p>
                  <input
                    ref={props.eBilanganFsDibuat3TahunLepasTerjadi}
                    type='text'
                    name='e-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                    id='e-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
                <div className='flex flex-row pl-5 items-center'>
                  <p className='text-sm font-m '>X: </p>
                  <input
                    ref={props.xBilanganFsDibuat3TahunLepasTerjadi}
                    type='text'
                    name='x-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                    id='x-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
              </article>
              <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>D</h4>
                <div className='flex flex-row pl-5 items-center'>
                  <p className='text-sm font-m '>Class I: </p>
                  <input
                    ref={props.classID}
                    type='text'
                    name='class-1-d'
                    id='class-1-d'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
                <div className='flex flex-row pl-5 items-center'>
                  <p className='text-sm font-m '>Class II: </p>
                  <input
                    ref={props.classIID}
                    type='text'
                    name='class-2-d'
                    id='class-2-d'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
              </article>
              <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>F</h4>
                <div className='flex flex-row pl-5 items-center'>
                  <p className='text-sm font-m '>Class I: </p>
                  <input
                    ref={props.classIF}
                    type='text'
                    name='class-1-f'
                    id='class-1-f'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
                <div className='flex flex-row pl-5 items-center'>
                  <p className='text-sm font-m '>Class II: </p>
                  <input
                    ref={props.classIIF}
                    type='text'
                    name='class-2-f'
                    id='class-2-f'
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
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
