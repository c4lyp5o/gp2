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
                    type='checkbox'
                    name='ada-cleft-lip'
                    id='ada-cleft-lip'
                    checked={props.adaCleftLip}
                    onChange={() => {
                      props.setAdaCleftLip(!props.adaCleftLip);
                    }}
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
                    type='checkbox'
                    name='rujuk-cleft-lip-palate'
                    id='rujuk-cleft-lip-palate'
                    checked={props.rujukCleftLip}
                    onChange={() => {
                      props.setRujukCleftLip(!props.rujukCleftLip);
                    }}
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
                        type='radio'
                        name='sedia-ada-status-denture'
                        id='ya-sedia-ada-status-denture'
                        value='ya-sedia-ada-status-denture'
                        checked={
                          props.yaTidakSediaAdaStatusDenture ===
                          'ya-sedia-ada-status-denture'
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          props.setYaTidakSediaAdaStatusDenture(e.target.value);
                        }}
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                      />
                      <label
                        htmlFor='ya-sedia-ada-status-denture'
                        className='m-2 text-sm font-m'
                      >
                        Ya
                      </label>
                      <input
                        type='radio'
                        name='sedia-ada-status-denture'
                        id='tidak-sedia-ada-status-denture'
                        value='tidak-sedia-ada-status-denture'
                        checked={
                          props.yaTidakSediaAdaStatusDenture ===
                          'tidak-sedia-ada-status-denture'
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          props.setYaTidakSediaAdaStatusDenture(e.target.value);
                        }}
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
                        type='checkbox'
                        name='atas-sedia-ada-denture'
                        id='atas-sedia-ada-denture'
                        checked={props.atasSediaAdaDenture}
                        onChange={() => {
                          props.setAtasSediaAdaDenture(
                            !props.atasSediaAdaDenture
                          );
                        }}
                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                      />
                    </div>
                    <div className='grid grid-cols-2'>
                      <div className='flex items-center justify-center'>
                        <input
                          type='radio'
                          name='separa-penuh-atas-sedia-ada-denture'
                          id='separa-atas-sedia-ada-denture'
                          value='separa-atas-sedia-ada-denture'
                          checked={
                            props.separaPenuhAtasSediaAdaDenture ===
                            'separa-atas-sedia-ada-denture'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            props.setSeparaPenuhAtasSediaAdaDenture(
                              e.target.value
                            );
                          }}
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
                          type='radio'
                          name='separa-penuh-atas-sedia-ada-denture'
                          id='penuh-atas-sedia-ada-denture'
                          value='penuh-atas-sedia-ada-denture'
                          checked={
                            props.separaPenuhAtasSediaAdaDenture ===
                            'penuh-atas-sedia-ada-denture'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            props.setSeparaPenuhAtasSediaAdaDenture(
                              e.target.value
                            );
                          }}
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
                        type='checkbox'
                        name='bawah-sedia-ada-denture'
                        id='bawah-sedia-ada-denture'
                        checked={props.bawahSediaAdaDenture}
                        onChange={() => {
                          props.setBawahSediaAdaDenture(
                            !props.bawahSediaAdaDenture
                          );
                        }}
                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                      />
                    </div>
                    <div className='grid grid-cols-2'>
                      <div className='flex items-center justify-center'>
                        <input
                          type='radio'
                          name='separa-penuh-bawah-sedia-ada-denture'
                          id='separa-bawah-sedia-ada-denture'
                          value='separa-bawah-sedia-ada-denture'
                          checked={
                            props.separaPenuhBawahSediaAdaDenture ===
                            'separa-bawah-sedia-ada-denture'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            props.setSeparaPenuhBawahSediaAdaDenture(
                              e.target.value
                            );
                          }}
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
                          type='radio'
                          name='separa-penuh-bawah-sedia-ada-denture'
                          id='penuh-bawah-sedia-ada-denture'
                          value='penuh-bawah-sedia-ada-denture'
                          checked={
                            props.separaPenuhBawahSediaAdaDenture ===
                            'penuh-bawah-sedia-ada-denture'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            props.setSeparaPenuhBawahSediaAdaDenture(
                              e.target.value
                            );
                          }}
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
                        type='radio'
                        name='perlu-status-denture'
                        id='ya-perlu-status-denture'
                        value='ya-perlu-status-denture'
                        checked={
                          props.yaTidakPerluStatusDenture ===
                          'ya-perlu-status-denture'
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          props.setYaTidakPerluStatusDenture(e.target.value);
                        }}
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                      />
                      <label
                        htmlFor='ya-perlu-status-denture'
                        className='m-2 text-sm font-m'
                      >
                        Ya
                      </label>
                      <input
                        type='radio'
                        name='perlu-status-denture'
                        id='tidak-perlu-status-denture'
                        value='tidak-perlu-status-denture'
                        checked={
                          props.yaTidakPerluStatusDenture ===
                          'tidak-perlu-status-denture'
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          props.setYaTidakPerluStatusDenture(e.target.value);
                        }}
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
                        type='checkbox'
                        name='atas-perlu-denture'
                        id='atas-perlu-denture'
                        checked={props.atasPerluDenture}
                        onChange={() => {
                          props.setAtasPerluDenture(!props.atasPerluDenture);
                        }}
                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                      />
                    </div>
                    <div className='grid grid-cols-2'>
                      <div className='flex items-center justify-center'>
                        <input
                          type='radio'
                          name='separa-penuh-atas-perlu-denture'
                          id='separa-atas-perlu-denture'
                          value='separa-atas-perlu-denture'
                          checked={
                            props.separaPenuhAtasPerluDenture ===
                            'separa-atas-perlu-denture'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            props.setSeparaPenuhAtasPerluDenture(
                              e.target.value
                            );
                          }}
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
                          type='radio'
                          name='separa-penuh-atas-perlu-denture'
                          id='penuh-atas-perlu-denture'
                          value='penuh-atas-perlu-denture'
                          checked={
                            props.separaPenuhAtasPerluDenture ===
                            'penuh-atas-perlu-denture'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            props.setSeparaPenuhAtasPerluDenture(
                              e.target.value
                            );
                          }}
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
                        type='checkbox'
                        name='bawah-perlu-denture'
                        id='bawah-perlu-denture'
                        checked={props.bawahPerluDenture}
                        onChange={() => {
                          props.setBawahPerluDenture(!props.bawahPerluDenture);
                        }}
                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                      />
                    </div>
                    <div className='grid grid-cols-2'>
                      <div className='flex items-center justify-center'>
                        <input
                          type='radio'
                          name='separa-penuh-bawah-perlu-denture'
                          id='separa-bawah-perlu-denture'
                          value='separa-bawah-perlu-denture'
                          checked={
                            props.separaPenuhBawahPerluDenture ===
                            'separa-bawah-perlu-denture'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            props.setSeparaPenuhBawahPerluDenture(
                              e.target.value
                            );
                          }}
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
                          type='radio'
                          name='separa-penuh-bawah-perlu-denture'
                          id='penuh-bawah-perlu-denture'
                          value='penuh-bawah-perlu-denture'
                          checked={
                            props.separaPenuhBawahPerluDenture ===
                            'penuh-bawah-perlu-denture'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            props.setSeparaPenuhBawahPerluDenture(
                              e.target.value
                            );
                          }}
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
                    type='checkbox'
                    name='tooth-surface-loss'
                    id='tooth-surface-loss'
                    checked={props.toothSurfaceLossTrauma}
                    onChange={() => {
                      props.setToothSurfaceLossTrauma(
                        !props.toothSurfaceLossTrauma
                      );
                    }}
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
                    type='checkbox'
                    name='kecederaan-gigi-anterior'
                    id='kecederaan-gigi-anterior'
                    checked={props.kecederaanGigiAnteriorTrauma}
                    onChange={() => {
                      props.setKecederaanGigiAnteriorTrauma(
                        !props.kecederaanGigiAnteriorTrauma
                      );
                    }}
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
                    type='checkbox'
                    name='tisu-lembut'
                    id='tisu-lembut'
                    checked={props.tisuLembutTrauma}
                    onChange={() => {
                      props.setTisuLembutTrauma(!props.tisuLembutTrauma);
                    }}
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                  />
                  <label htmlFor='tisu-lembut' className='m-2 text-sm font-m'>
                    Tisu Lembut
                  </label>
                </div>
                <div className='flex items-center flex-row pl-5'>
                  <input
                    type='checkbox'
                    name='tisu-keras'
                    id='tisu-keras'
                    checked={props.tisuKerasTrauma}
                    onChange={() => {
                      props.setTisuKerasTrauma(!props.tisuKerasTrauma);
                    }}
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
                    name='kebersihan-mulut'
                    id='kebersihan-mulut'
                    value={props.kebersihanMulutOralHygiene}
                    onChange={(e) => {
                      props.setKebersihanMulutOralHygiene(e.target.value);
                    }}
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
                    name='skor-bpe'
                    id='skor-bpe'
                    value={props.skorBpeOralHygiene}
                    onChange={(e) => {
                      props.setSkorBpeOralHygiene(e.target.value);
                    }}
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
                    type='checkbox'
                    name='saringan-kanser-mulut'
                    id='saringan-kanser-mulut'
                    checked={props.saringanKanserMulutOralHygiene}
                    onChange={() => {
                      props.setSaringanKanserMulutOralHygiene(
                        !props.saringanKanserMulutOralHygiene
                      );
                    }}
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 m-2'
                  />
                </div>
                <div className='flex items-center flex-row pl-5'>
                  <select
                    name='skor-gis'
                    id='skor-gis'
                    value={props.skorGisMulutOralHygiene}
                    onChange={(e) => {
                      props.setSkorGisMulutOralHygiene(e.target.value);
                    }}
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
                        type='number'
                        name='d-ada-status-gigi-desidus'
                        id='d-ada-status-gigi-desidus'
                        value={props.dAdaGigiDesidus}
                        onChange={(e) => {
                          props.setDAdaGigiDesidus(e.target.value);
                        }}
                        className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      />
                    </div>
                    <div className='flex flex-row items-center'>
                      <p className='text-sm font-m lowercase'>m: </p>
                      <input
                        type='number'
                        name='m-ada-status-gigi-desidus'
                        id='m-ada-status-gigi-desidus'
                        value={props.mAdaGigiDesidus}
                        onChange={(e) => {
                          props.setMAdaGigiDesidus(e.target.value);
                        }}
                        className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      />
                    </div>
                    <div className='flex flex-row items-center'>
                      <p className='text-sm font-m lowercase'>f: </p>
                      <input
                        type='number'
                        name='f-ada-status-gigi-desidus'
                        id='f-ada-status-gigi-desidus'
                        value={props.fAdaGigiDesidus}
                        onChange={(e) => {
                          props.setFAdaGigiDesidus(e.target.value);
                        }}
                        className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      />
                    </div>
                    <div className='flex flex-row items-center'>
                      <p className='text-sm font-m lowercase'>e: </p>
                      <input
                        type='number'
                        name='e-ada-status-gigi-desidus'
                        id='e-ada-status-gigi-desidus'
                        value={props.eAdaGigiDesidus}
                        onChange={(e) => {
                          props.setEAdaGigiDesidus(e.target.value);
                        }}
                        className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      />
                    </div>
                    <div className='flex flex-row items-center'>
                      <p className='text-sm font-m lowercase'>x: </p>
                      <input
                        type='number'
                        name='x-ada-status-gigi-desidus'
                        id='x-ada-status-gigi-desidus'
                        value={props.xAdaGigiDesidus}
                        onChange={(e) => {
                          props.setXAdaGigiDesidus(e.target.value);
                        }}
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
                        type='number'
                        name='d-ada-status-gigi-kekal'
                        id='d-ada-status-gigi-kekal'
                        value={props.dAdaGigiKekal}
                        onChange={(e) => {
                          props.setDAdaGigiKekal(e.target.value);
                        }}
                        className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      />
                    </div>
                    <div className='flex flex-row items-center'>
                      <p className='text-sm font-m '>M: </p>
                      <input
                        type='number'
                        name='m-ada-status-gigi-kekal'
                        id='m-ada-status-gigi-kekal'
                        value={props.mAdaGigiKekal}
                        onChange={(e) => {
                          props.setMAdaGigiKekal(e.target.value);
                        }}
                        className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      />
                    </div>
                    <div className='flex flex-row items-center'>
                      <p className='text-sm font-m '>F: </p>
                      <input
                        type='number'
                        name='f-ada-status-gigi-kekal'
                        id='f-ada-status-gigi-kekal'
                        value={props.fAdaGigiKekal}
                        onChange={(e) => {
                          props.setFAdaGigiKekal(e.target.value);
                        }}
                        className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      />
                    </div>
                    <div className='flex flex-row items-center'>
                      <p className='text-sm font-m '>E: </p>
                      <input
                        type='number'
                        name='e-ada-status-gigi-kekal'
                        id='e-ada-status-gigi-kekal'
                        value={props.eAdaGigiKekal}
                        onChange={(e) => {
                          props.setEAdaGigiKekal(e.target.value);
                        }}
                        className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      />
                    </div>
                    <div className='flex flex-row items-center'>
                      <p className='text-sm font-m '>X: </p>
                      <input
                        type='number'
                        name='x-ada-status-gigi-kekal'
                        id='x-ada-status-gigi-kekal'
                        value={props.xAdaGigiKekal}
                        onChange={(e) => {
                          props.setXAdaGigiKekal(e.target.value);
                        }}
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
                      type='number'
                      name='jumlah-faktor-risiko'
                      id='jumlah-faktor-risiko'
                      value={props.jumlahFaktorRisiko}
                      onChange={(e) => {
                        props.setJumlahFaktorRisiko(e.target.value);
                      }}
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
                    type='number'
                    name='gic-bilangan-fs-dibuat-3-tahun-lepas'
                    id='gic-bilangan-fs-dibuat-3-tahun-lepas'
                    value={props.gicBilanganFsDibuat3TahunLepas}
                    onChange={(e) => {
                      props.setGicBilanganFsDibuat3TahunLepas(e.target.value);
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
                <div className='flex flex-row pl-5 items-center'>
                  <p className='text-sm font-m '>Resin: </p>
                  <input
                    type='number'
                    name='resin-bilangan-fs-dibuat-3-tahun-lepas'
                    id='resin-bilangan-fs-dibuat-3-tahun-lepas'
                    value={props.resinBilanganFsDibuat3TahunLepas}
                    onChange={(e) => {
                      props.setResinBilanganFsDibuat3TahunLepas(e.target.value);
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
                <div className='flex flex-row pl-5 items-center col-span-2 md:col-span-1'>
                  <p className='text-sm font-m '>Lain-lain: </p>
                  <input
                    type='number'
                    name='lain-lain-bilangan-fs-dibuat-3-tahun-lepas'
                    id='lain-lain-bilangan-fs-dibuat-3-tahun-lepas'
                    value={props.lainLainBilanganFsDibuat3TahunLepas}
                    onChange={(e) => {
                      props.setLainLainBilanganFsDibuat3TahunLepas(
                        e.target.value
                      );
                    }}
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
                    type='number'
                    name='d-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                    id='d-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                    value={props.dBilanganFsDibuat3TahunLepasTerjadi}
                    onChange={(e) => {
                      props.setdBilanganFsDibuat3TahunLepasTerjadi(
                        e.target.value
                      );
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
                <div className='flex flex-row pl-5 items-center'>
                  <p className='text-sm font-m '>M: </p>
                  <input
                    type='number'
                    name='m-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                    id='m-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                    value={props.mBilanganFsDibuat3TahunLepasTerjadi}
                    onChange={(e) => {
                      props.setmBilanganFsDibuat3TahunLepasTerjadi(
                        e.target.value
                      );
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
                <div className='flex flex-row pl-5 items-center'>
                  <p className='text-sm font-m '>F: </p>
                  <input
                    type='number'
                    name='f-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                    id='f-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                    value={props.fBilanganFsDibuat3TahunLepasTerjadi}
                    onChange={(e) => {
                      props.setfBilanganFsDibuat3TahunLepasTerjadi(
                        e.target.value
                      );
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
                <div className='flex flex-row pl-5 items-center'>
                  <p className='text-sm font-m '>E: </p>
                  <input
                    type='number'
                    name='e-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                    id='e-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                    value={props.eBilanganFsDibuat3TahunLepasTerjadi}
                    onChange={(e) => {
                      props.seteBilanganFsDibuat3TahunLepasTerjadi(
                        e.target.value
                      );
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
                <div className='flex flex-row pl-5 items-center'>
                  <p className='text-sm font-m '>X: </p>
                  <input
                    type='number'
                    name='x-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                    id='x-bilangan-fs-dibuat-3-tahun-lepas-terjadi'
                    value={props.xBilanganFsDibuat3TahunLepasTerjadi}
                    onChange={(e) => {
                      props.setxBilanganFsDibuat3TahunLepasTerjadi(
                        e.target.value
                      );
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
              </article>
              <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>D</h4>
                <div className='flex flex-row pl-5 items-center'>
                  <p className='text-sm font-m '>Class I: </p>
                  <input
                    type='number'
                    name='class-1-d'
                    id='class-1-d'
                    value={props.classID}
                    onChange={(e) => {
                      props.setClassID(e.target.value);
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
                <div className='flex flex-row pl-5 items-center'>
                  <p className='text-sm font-m '>Class II: </p>
                  <input
                    type='number'
                    name='class-2-d'
                    id='class-2-d'
                    value={props.classII}
                    onChange={(e) => {
                      props.setClassII(e.target.value);
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
              </article>
              <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>F</h4>
                <div className='flex flex-row pl-5 items-center'>
                  <p className='text-sm font-m '>Class I: </p>
                  <input
                    type='number'
                    name='class-1-f'
                    id='class-1-f'
                    value={props.classIF}
                    onChange={(e) => {
                      props.setClassIF(e.target.value);
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
                <div className='flex flex-row pl-5 items-center'>
                  <p className='text-sm font-m '>Class II: </p>
                  <input
                    type='number'
                    name='class-2-f'
                    id='class-2-f'
                    value={props.classIIF}
                    onChange={(e) => {
                      props.setClassIIF(e.target.value);
                    }}
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
