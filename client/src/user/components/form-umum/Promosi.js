export default function Promosi(props) {
  let isDisabled = false;
  if (
    props.statusReten === 'telah diisi' ||
    props.statusReten === 'reten salah' ||
    (props.singlePersonUmum.rawatanDibuatOperatorLain === true &&
      !props.operatorLain)
  ) {
    isDisabled = true;
  }
  return (
    <>
      <div className='p-2'>
        {props.statusKehadiran === false ? (
          <div className='grid grid-cols-2'>
            <span className='flex bg-user3 p-2 w-full capitalize col-span-2'>
              <p className='ml-3 text-xl font-semibold'>
                promosi & pendidikan kesihatan pergigian
              </p>
            </span>
            <section className='grid grid-cols-1 lg:grid-cols-2 gap-2 mt-3 mb-3 w-full col-span-2'>
              <div className='grid gap-2 auto-rows-min'>
                {props.singlePersonUmum.umur <= 12 ? (
                  <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='font-bold flex flex-row pl-5'>
                      melaksanakan aktiviti
                    </h4>
                    <div className='flex items-center flex-row pl-5'>
                      <p className='text-sm font-semibold flex items-center justify-center pr-3'>
                        BEGIN:
                      </p>
                      <div className='flex items-center justify-center'>
                        <input
                          disabled={isDisabled}
                          type='radio'
                          name='melaksanakan-aktiviti-begin-promosi-umum'
                          id='ya-melaksanakan-aktiviti-begin-promosi-umum'
                          value='ya-melaksanakan-aktiviti-begin-promosi-umum'
                          checked={
                            props.melaksanakanAktivitiBeginPromosiUmum ===
                            'ya-melaksanakan-aktiviti-begin-promosi-umum'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            props.setMelaksanakanAktivitiBeginPromosiUmum(
                              e.target.value
                            );
                          }}
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          required={
                            props.singlePersonUmum.umur <= 12 ? false : true
                          }
                        />
                        <label
                          htmlFor='ya-melaksanakan-aktiviti-begin-promosi-umum'
                          className='m-2 text-sm font-m'
                        >
                          Ya
                        </label>
                        <input
                          disabled={isDisabled}
                          type='radio'
                          name='melaksanakan-aktiviti-begin-promosi-umum'
                          id='tidak-melaksanakan-aktiviti-begin-promosi-umum'
                          value='tidak-melaksanakan-aktiviti-begin-promosi-umum'
                          checked={
                            props.melaksanakanAktivitiBeginPromosiUmum ===
                            'tidak-melaksanakan-aktiviti-begin-promosi-umum'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            props.setMelaksanakanAktivitiBeginPromosiUmum(
                              e.target.value
                            );
                          }}
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
                ) : props.jenisFasiliti === 'taska-tadika' ||
                  props.jenisFasiliti === 'kp' ||
                  props.jenisFasiliti === 'kk-kd' ||
                  props.jenisFasiliti === 'ipt-kolej' ? null : (
                  <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='font-bold flex flex-row pl-5'>
                      melaksanakan aktiviti
                    </h4>
                    <div className='flex items-center flex-row pl-5'>
                      <p className='text-sm font-semibold flex items-center justify-center pr-3'>
                        lawatan ke rumah :
                      </p>
                      <div className='flex items-center justify-center'>
                        <input
                          disabled={isDisabled}
                          type='radio'
                          name='lawatan-ke-rumah-promosi-umum'
                          id='ya-lawatan-ke-rumah-promosi-umum'
                          value='ya-lawatan-ke-rumah-promosi-umum'
                          checked={
                            props.lawatanKeRumahPromosiUmum ===
                            'ya-lawatan-ke-rumah-promosi-umum'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            props.setLawatanKeRumahPromosiUmum(e.target.value);
                          }}
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='ya-lawatan-ke-rumah-promosi-umum'
                          className='m-2 text-sm font-m'
                        >
                          Ya
                        </label>
                        <input
                          disabled={isDisabled}
                          type='radio'
                          name='lawatan-ke-rumah-promosi-umum'
                          id='tidak-lawatan-ke-rumah-promosi-umum'
                          value='tidak-lawatan-ke-rumah-promosi-umum'
                          checked={
                            props.lawatanKeRumahPromosiUmum ===
                            'tidak-lawatan-ke-rumah-promosi-umum'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            props.setLawatanKeRumahPromosiUmum(e.target.value);
                          }}
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
                )}
                <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                  <h4 className='font-bold flex flex-row pl-5'>
                    menerima nasihat kesihatan pergigian individu
                  </h4>
                  <div className='flex flex-row items-center pl-5 m-1'>
                    <input
                      disabled={isDisabled}
                      type='checkbox'
                      name='plak-gigi-nasihat-pergigian-individu-promosi-umum'
                      id='plak-gigi-nasihat-pergigian-individu-promosi-umum'
                      value='plak-gigi-nasihat-pergigian-individu-promosi-umum'
                      checked={
                        props.plakGigiNasihatPergigianIndividuPromosiUmum
                      }
                      onChange={() => {
                        props.setPlakGigiNasihatPergigianIndividuPromosiUmum(
                          !props.plakGigiNasihatPergigianIndividuPromosiUmum
                        );
                      }}
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
                      disabled={isDisabled}
                      type='checkbox'
                      name='penjagaan-kesihatan-oral-nasihat-pergigian-individu-promosi-umum'
                      id='penjagaan-kesihatan-oral-nasihat-pergigian-individu-promosi-umum'
                      value='penjagaan-kesihatan-oral-nasihat-pergigian-individu-promosi-umum'
                      checked={
                        props.penjagaanKesihatanOralNasihatPergigianIndividuPromosiUmum
                      }
                      onChange={() => {
                        props.setPenjagaanKesihatanOralNasihatPergigianIndividuPromosiUmum(
                          !props.penjagaanKesihatanOralNasihatPergigianIndividuPromosiUmum
                        );
                      }}
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
                      disabled={isDisabled}
                      type='checkbox'
                      name='diet-pemakanan-nasihat-pergigian-individu-promosi-umum'
                      id='diet-pemakanan-nasihat-pergigian-individu-promosi-umum'
                      value='diet-pemakanan-nasihat-pergigian-individu-promosi-umum'
                      checked={
                        props.dietPemakananNasihatPergigianIndividuPromosiUmum
                      }
                      onChange={() => {
                        props.setDietPemakananNasihatPergigianIndividuPromosiUmum(
                          !props.dietPemakananNasihatPergigianIndividuPromosiUmum
                        );
                      }}
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
                      disabled={isDisabled}
                      type='checkbox'
                      name='kanser-mulut-nasihat-pergigian-individu-promosi-umum'
                      id='kanser-mulut-nasihat-pergigian-individu-promosi-umum'
                      value='kanser-mulut-nasihat-pergigian-individu-promosi-umum'
                      checked={
                        props.kanserMulutNasihatPergigianIndividuPromosiUmum
                      }
                      onChange={() => {
                        props.setKanserMulutNasihatPergigianIndividuPromosiUmum(
                          !props.kanserMulutNasihatPergigianIndividuPromosiUmum
                        );
                      }}
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
              </div>
              <div className='grid gap-2 auto-rows-min'>
                {props.singlePersonUmum.umur <= 4 && (
                  <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='font-bold flex flex-row col-span-2'>
                      bilangan ibu bapa / penjaga diberi anticipatory guidance
                      (AG)
                    </h4>
                    <div className='flex items-center flex-row pl-5'>
                      <p className='text-sm font-m'>umur 15-17: </p>
                      <input
                        disabled={isDisabled}
                        type='number'
                        name='umur-15-17-bilangan-ibu-bapa-penjaga-diberi-anticipatory-guidance-promosi-umum'
                        id='umur-15-17-bilangan-ibu-bapa-penjaga-diberi-anticipatory-guidance-promosi-umum'
                        value={
                          props.umur1517BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum
                        }
                        onChange={(e) => {
                          props.setUmur1517BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum(
                            e.target.value
                          );
                        }}
                        min='0'
                        max='10'
                        className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      />
                    </div>
                    <div className='flex items-center flex-row pl-5'>
                      <p className='text-sm font-m'>umur 18-19: </p>
                      <input
                        disabled={isDisabled}
                        type='number'
                        name='umur-18-19-bilangan-ibu-bapa-penjaga-diberi-anticipatory-guidance-promosi-umum'
                        id='umur-18-19-bilangan-ibu-bapa-penjaga-diberi-anticipatory-guidance-promosi-umum'
                        value={
                          props.umur1819BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum
                        }
                        onChange={(e) => {
                          props.setUmur1819BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum(
                            e.target.value
                          );
                        }}
                        min='0'
                        max='10'
                        className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      />
                    </div>
                    <div className='flex items-center flex-row pl-5'>
                      <p className='text-sm font-m'>umur 20-29: </p>
                      <input
                        disabled={isDisabled}
                        type='number'
                        name='umur-20-29-bilangan-ibu-bapa-penjaga-diberi-anticipatory-guidance-promosi-umum'
                        id='umur-20-29-bilangan-ibu-bapa-penjaga-diberi-anticipatory-guidance-promosi-umum'
                        value={
                          props.umur2029BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum
                        }
                        onChange={(e) => {
                          props.setUmur2029BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum(
                            e.target.value
                          );
                        }}
                        min='0'
                        max='10'
                        className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      />
                    </div>
                    <div className='flex items-center flex-row pl-5'>
                      <p className='text-sm font-m'>umur 30-49: </p>
                      <input
                        disabled={isDisabled}
                        type='number'
                        name='umur-30-49-bilangan-ibu-bapa-penjaga-diberi-anticipatory-guidance-promosi-umum'
                        id='umur-30-49-bilangan-ibu-bapa-penjaga-diberi-anticipatory-guidance-promosi-umum'
                        value={
                          props.umur3049BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum
                        }
                        onChange={(e) => {
                          props.setUmur3049BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum(
                            e.target.value
                          );
                        }}
                        min='0'
                        max='10'
                        className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      />
                    </div>
                    <div className='flex items-center flex-row pl-5'>
                      <p className='text-sm font-m'>umur 50-59: </p>
                      <input
                        disabled={isDisabled}
                        type='number'
                        name='umur-50-59-bilangan-ibu-bapa-penjaga-diberi-anticipatory-guidance-promosi-umum'
                        id='umur-50-59-bilangan-ibu-bapa-penjaga-diberi-anticipatory-guidance-promosi-umum'
                        value={
                          props.umur5059BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum
                        }
                        onChange={(e) => {
                          props.setUmur5059BilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum(
                            e.target.value
                          );
                        }}
                        min='0'
                        max='10'
                        className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      />
                    </div>
                    <div className='flex items-center flex-row pl-5'>
                      <p className='text-sm font-m'>umur 60 ke atas: </p>
                      <input
                        disabled={isDisabled}
                        type='number'
                        name='umur-60-ke-atas-bilangan-ibu-bapa-penjaga-diberi-anticipatory-guidance-promosi-umum'
                        id='umur-60-ke-atas-bilangan-ibu-bapa-penjaga-diberi-anticipatory-guidance-promosi-umum'
                        value={
                          props.umur60KeAtasBilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum
                        }
                        onChange={(e) => {
                          props.setUmur60KeAtasBilanganIbuBapaPenjagaDiberiAnticipatoryGuidancePromosiUmum(
                            e.target.value
                          );
                        }}
                        min='0'
                        max='10'
                        className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      />
                    </div>
                  </article>
                )}
                {/* <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                  <h4 className='flex flex-row pl-5 text-sm font-bold'>
                    khidmat rundingan pakar pergigian kesihatan awam
                  </h4>
                  <div className='flex flex-row items-center pl-5 m-1'>
                    <input
                      disabled={isDisabled}
                      type='checkbox'
                      name='dirujuk-kaunseling-pakar-public-health-promosi-umum'
                      id='dirujuk-kaunseling-pakar-public-health-promosi-umum'
                      value='dirujuk-kaunseling-pakar-public-health-promosi-umum'
                      checked={
                        props.dirujukKaunselingPakarPublicHealthPromosiUmum
                      }
                      onChange={() => {
                        props.setDirujukKaunselingPakarPublicHealthPromosiUmum(
                          !props.dirujukKaunselingPakarPublicHealthPromosiUmum
                        );
                      }}
                      className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                    />
                    <label
                      htmlFor='dirujuk-kaunseling-pakar-public-health-promosi-umum'
                      className='mx-2 text-sm font-m'
                    >
                      Dirujuk
                    </label>
                  </div>
                </article> */}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </>
  );
}
