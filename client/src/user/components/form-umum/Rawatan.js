export default function Rawatan(props) {
  return (
    <>
      <div className='p-2'>
        <div className='grid grid-cols-2'>
          <span className='flex bg-user3 p-2 w-full capitalize col-span-2'>
            <p className='ml-3 text-xl font-semibold'>Rawatan</p>
          </span>
          <section className='grid grid-cols-1 lg:grid-cols-2 gap-2 mt-3 mb-3 w-full col-span-2'>
            <div className='grid gap-2 auto-rows-min'>
              <article
                className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'
                title='Fissure Sealant'
              >
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                  Pengapan Fisur
                </h4>
                <div className='flex flex-row items-center pl-5 pt-1 col-span-2'>
                  <input
                    type='checkbox'
                    name='pesakit-dibuat-fissure-sealant'
                    id='pesakit-dibuat-fissure-sealant'
                    value='pesakit-dibuat-fissure-sealant'
                    checked={props.pesakitDibuatFissureSealant}
                    onChange={() => {
                      props.setPesakitDibuatFissureSealant(
                        !props.pesakitDibuatFissureSealant
                      );
                    }}
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                  />
                  <label className='mx-2 text-sm font-m'>
                    pesakit dibuat Pengapan Fisur
                  </label>
                </div>
                <p className='flex flex-row pl-5 text-sm font-m col-span-2'>
                  jumlah gigi kekal dibuat Pengapan Fisur
                </p>
                <div className='flex flex-row items-center pl-5'>
                  {/* <label
                    htmlFor='baru-jumlah-gigi-kekal-dibuat-fs-rawatan-umum'
                    className='text-sm font-m'
                  >
                    Baru
                  </label> */}
                  <input
                    type='number'
                    name='baru-jumlah-gigi-kekal-dibuat-fs-rawatan-umum'
                    id='baru-jumlah-gigi-kekal-dibuat-fs-rawatan-umum'
                    value={props.baruJumlahGigiKekalDibuatFSRawatanUmum}
                    onChange={(e) => {
                      props.setBaruJumlahGigiKekalDibuatFSRawatanUmum(
                        e.target.value
                      );
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='32'
                  />
                </div>
                {/* <div className='flex flex-row items-center pl-5'>
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
                    value={props.semulaJumlahGigiKekalDibuatFSRawatanUmum}
                    onChange={(e) => {
                      props.setSemulaJumlahGigiKekalDibuatFSRawatanUmum(
                        e.target.value
                      );
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='16'
                  />
                </div> */}
                {/* <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='baru-jumlah-murid-dibuat-fs-rawatan-umum'
                    className='text-sm font-m'
                  >
                    Baru
                  </label>
                  <input
                    type='number'
                    name='baru-jumlah-murid-dibuat-fs-rawatan-umum'
                    id='baru-jumlah-murid-dibuat-fs-rawatan-umum'
                    value={props.baruJumlahMuridDibuatFsRawatanUmum}
                    onChange={(e) => {
                      props.setBaruJumlahMuridDibuatFsRawatanUmum(
                        e.target.value
                      );
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='16'
                    required
                  />
                </div>
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='semula-jumlah-murid-dibuat-fs-rawatan-umum'
                    className='text-sm font-m'
                  >
                    Semula
                  </label>
                  <input
                    type='number'
                    name='semula-jumlah-murid-dibuat-fs-rawatan-umum'
                    id='semula-jumlah-murid-dibuat-fs-rawatan-umum'
                    value={props.semulaJumlahMuridDibuatFsRawatanUmum}
                    onChange={(e) => {
                      props.setSemulaJumlahMuridDibuatFsRawatanUmum(
                        e.target.value
                      );
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='16'
                    required
                  />
                </div> */}
              </article>
              <article
                className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'
                title='Fluoride Varnish'
              >
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                  Sapuan Florida
                </h4>
                <div className='flex flex-row items-center pl-5 pt-1 col-span-2'>
                  <input
                    type='checkbox'
                    name='pesakit-dibuat-fluoride-varnish'
                    id='pesakit-dibuat-fluoride-varnish'
                    value='pesakit-dibuat-fluoride-varnish'
                    checked={props.pesakitDibuatFluorideVarnish}
                    onChange={() => {
                      props.setPesakitDibuatFluorideVarnish(
                        !props.pesakitDibuatFluorideVarnish
                      );
                    }}
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                  />
                  <label className='mx-2 text-sm font-m'>
                    Pesakit diberi Sapuan Florida
                  </label>
                </div>
                {/* <p className='flex flex-row pl-5 text-sm font-m col-span-2'>
                  jumlah gigi kekal diberi Sapuan Florida
                </p>
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='baru-jumlah-gigi-kekal-diberi-fv-rawatan-umum'
                    className='text-sm font-m'
                  >
                    Baru
                  </label>
                  <input
                    type='number'
                    name='baru-jumlah-gigi-kekal-diberi-fv-rawatan-umum'
                    id='baru-jumlah-gigi-kekal-diberi-fv-rawatan-umum'
                    value={props.baruJumlahGigiKekalDiberiFVRawatanUmum}
                    onChange={(e) => {
                      props.setBaruJumlahGigiKekalDiberiFVRawatanUmum(
                        e.target.value
                      );
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='32'
                  />
                </div>
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='semula-jumlah-gigi-kekal-diberi-fv-rawatan-umum'
                    className='text-sm font-m'
                  >
                    Semula
                  </label>
                  <input
                    type='number'
                    name='semula-jumlah-gigi-kekal-diberi-fv-rawatan-umum'
                    id='semula-jumlah-gigi-kekal-diberi-fv-rawatan-umum'
                    value={props.semulaJumlahGigiKekalDiberiFVRawatanUmum}
                    onChange={(e) => {
                      props.setSemulaJumlahGigiKekalDiberiFVRawatanUmum(
                        e.target.value
                      );
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='32'
                  />
                </div>
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='baru-jumlah-murid-dibuat-fv-rawatan-umum'
                    className='text-sm font-m'
                  >
                    Baru
                  </label>
                  <input
                    type='number'
                    name='baru-jumlah-murid-dibuat-fv-rawatan-umum'
                    id='baru-jumlah-murid-dibuat-fv-rawatan-umum'
                    value={props.baruJumlahMuridDibuatFVRawatanUmum}
                    onChange={(e) => {
                      props.setBaruJumlahMuridDibuatFVRawatanUmum(
                        e.target.value
                      );
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='semula-jumlah-murid-dibuat-fv-rawatan-umum'
                    className='text-sm font-m'
                  >
                    Semula
                  </label>
                  <input
                    type='number'
                    name='semula-jumlah-murid-dibuat-fv-rawatan-umum'
                    id='semula-jumlah-murid-dibuat-fv-rawatan-umum'
                    value={props.semulaJumlahMuridDibuatFVRawatanUmum}
                    onChange={(e) => {
                      props.setSemulaJumlahMuridDibuatFVRawatanUmum(
                        e.target.value
                      );
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div> */}
              </article>
              <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                  PRR Jenis 1
                </h4>
                <div className='flex flex-row items-center pl-5 pt-1 col-span-2'>
                  <input
                    type='checkbox'
                    name='pesakit-dibuat-prr-jenis-1'
                    id='pesakit-dibuat-prr-jenis-1'
                    value='pesakit-dibuat-prr-jenis-1'
                    checked={props.pesakitDibuatPRRJenis1}
                    onChange={() => {
                      props.setPesakitDibuatPRRJenis1(
                        !props.pesakitDibuatPRRJenis1
                      );
                    }}
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                  />
                  <label className='mx-2 text-sm font-m'>
                    pesakit diberi PRR jenis 1
                  </label>
                </div>
                <p className='flex flex-row pl-5 text-sm font-m col-span-2'>
                  jumlah gigi diberi PRR Jenis 1
                </p>
                <div className='flex flex-row items-center pl-5'>
                  {/* <label
                    htmlFor='baru-jumlah-gigi-kekal-diberi-prr-jenis-1-rawatan-umum'
                    className='text-sm font-m'
                  >
                    Baru
                  </label> */}
                  <input
                    type='number'
                    name='baru-jumlah-gigi-kekal-diberi-prr-jenis-1-rawatan-umum'
                    id='baru-jumlah-gigi-kekal-diberi-prr-jenis-1-rawatan-umum'
                    value={props.baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum}
                    onChange={(e) => {
                      props.setBaruJumlahGigiKekalDiberiPRRJenis1RawatanUmum(
                        e.target.value
                      );
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='32'
                  />
                </div>
                {/* <div className='flex flex-row items-center pl-5'>
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
                    value={
                      props.semulaJumlahGigiKekalDiberiPRRJenis1RawatanUmum
                    }
                    onChange={(e) => {
                      props.setSemulaJumlahGigiKekalDiberiPRRJenis1RawatanUmum(
                        e.target.value
                      );
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='16'
                  />
                </div> */}
                {/* <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='baru-jumlah-murid-diberi-prr-jenis-1-rawatan-umum'
                    className='text-sm font-m'
                  >
                    Baru
                  </label>
                  <input
                    type='number'
                    name='baru-jumlah-murid-diberi-prr-jenis-1-rawatan-umum'
                    id='baru-jumlah-murid-diberi-prr-jenis-1-rawatan-umum'
                    value={props.baruJumlahMuridDiberiPrrJenis1RawatanUmum}
                    onChange={(e) => {
                      props.setBaruJumlahMuridDiberiPrrJenis1RawatanUmum(
                        e.target.value
                      );
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='16'
                    required
                  />
                </div>
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='semula-jumlah-murid-diberi-prr-jenis-1-rawatan-umum'
                    className='text-sm font-m'
                  >
                    Semula
                  </label>
                  <input
                    type='number'
                    name='semula-jumlah-murid-diberi-prr-jenis-1-rawatan-umum'
                    id='semula-jumlah-murid-diberi-prr-jenis-1-rawatan-umum'
                    value={props.semulaJumlahMuridDiberiPrrJenis1RawatanUmum}
                    onChange={(e) => {
                      props.setSemulaJumlahMuridDiberiPrrJenis1RawatanUmum(
                        e.target.value
                      );
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='16'
                    required
                  />
                </div> */}
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
                    value={props.cabutDesidusRawatanUmum}
                    onChange={(e) => {
                      props.setCabutDesidusRawatanUmum(e.target.value);
                    }}
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
                    value={props.cabutKekalRawatanUmum}
                    onChange={(e) => {
                      props.setCabutKekalRawatanUmum(e.target.value);
                    }}
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
                    value={props.komplikasiSelepasCabutanRawatanUmum}
                    onChange={(e) => {
                      props.setKomplikasiSelepasCabutanRawatanUmum(
                        e.target.value
                      );
                    }}
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
                    value={props.cabutanDisebabkanPeriodontitisRawatanUmum}
                    onChange={(e) => {
                      props.setCabutanDisebabkanPeriodontitisRawatanUmum(
                        e.target.value
                      );
                    }}
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
                <p className='flex flex-row items-center pl-5 text-sm font-m'>
                  Abses
                </p>
                <div className='flex items-center justify-evenly'>
                  <div>
                    <input
                      type='radio'
                      name='ya-tidak-abses-pembedahan-rawatan-umum'
                      id='ya-abses-pembedahan-rawatan-umum'
                      value='ya-abses-pembedahan-rawatan-umum'
                      checked={
                        props.yaTidakAbsesPembedahanRawatanUmum ===
                        'ya-abses-pembedahan-rawatan-umum'
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        props.setYaTidakAbsesPembedahanRawatanUmum(
                          e.target.value
                        );
                      }}
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
                      type='radio'
                      name='ya-tidak-abses-pembedahan-rawatan-umum'
                      id='tidak-abses-pembedahan-rawatan-umum'
                      value='tidak-abses-pembedahan-rawatan-umum'
                      checked={
                        props.yaTidakAbsesPembedahanRawatanUmum ===
                        'tidak-abses-pembedahan-rawatan-umum'
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        props.setYaTidakAbsesPembedahanRawatanUmum(
                          e.target.value
                        );
                      }}
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
                {/* <div className='flex items-center justify-evenly col-start-2'>
                    <div>
                      <input
                        type='radio'
                        name='baru-semula-abses-pembedahan-rawatan-umum'
                        id='baru-abses-pembedahan-rawatan-umum'
                        value='baru-abses-pembedahan-rawatan-umum'
                        checked={
                          props.baruSemulaAbsesPembedahanRawatanUmum ===
                          'baru-abses-pembedahan-rawatan-umum'
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          props.setBaruSemulaAbsesPembedahanRawatanUmum(
                            e.target.value
                          );
                        }}
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
                        type='radio'
                        name='baru-semula-abses-pembedahan-rawatan-umum'
                        id='semula-abses-pembedahan-rawatan-umum'
                        value='semula-abses-pembedahan-rawatan-umum'
                        checked={
                          props.baruSemulaAbsesPembedahanRawatanUmum ===
                          'semula-abses-pembedahan-rawatan-umum'
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          props.setBaruSemulaAbsesPembedahanRawatanUmum(
                            e.target.value
                          );
                        }}
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                      />
                      <label
                        htmlFor='semula-abses-pembedahan-rawatan-umum'
                        className='m-2 text-sm font-m'
                      >
                        semula
                      </label>
                    </div>
                  </div> */}
                <div className='flex items-center flex-row col-span-2 pl-5'>
                  <p className='text-sm font-m'>Cabutan surgikal :</p>
                  <input
                    type='number'
                    name='cabutan-surgikal-pembedahan-mulut-rawatan-umum'
                    id='cabutan-surgikal-pembedahan-mulut-rawatan-umum'
                    value={props.cabutanSurgikalPembedahanMulutRawatanUmum}
                    onChange={(e) => {
                      props.setCabutanSurgikalPembedahanMulutRawatanUmum(
                        e.target.value
                      );
                    }}
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
                      type='radio'
                      name='ya-tidak-fraktur-pembedahan-rawatan-umum'
                      id='ya-fraktur-pembedahan-rawatan-umum'
                      value='ya-fraktur-pembedahan-rawatan-umum'
                      checked={
                        props.yaTidakFrakturPembedahanRawatanUmum ===
                        'ya-fraktur-pembedahan-rawatan-umum'
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        props.setYaTidakFrakturPembedahanRawatanUmum(
                          e.target.value
                        );
                      }}
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
                      type='radio'
                      name='ya-tidak-fraktur-pembedahan-rawatan-umum'
                      id='tidak-fraktur-pembedahan-rawatan-umum'
                      value='tidak-fraktur-pembedahan-rawatan-umum'
                      checked={
                        props.yaTidakFrakturPembedahanRawatanUmum ===
                        'tidak-fraktur-pembedahan-rawatan-umum'
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        props.setYaTidakFrakturPembedahanRawatanUmum(
                          e.target.value
                        );
                      }}
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
                  pembedahan kecil mulut
                </p>
                <div className='flex items-center justify-evenly'>
                  <div>
                    <input
                      type='radio'
                      name='ya-tidak-pembedahan-kecil-mulut-pembedahan-rawatan-umum'
                      id='ya-pembedahan-kecil-mulut-pembedahan-rawatan-umum'
                      value='ya-pembedahan-kecil-mulut-pembedahan-rawatan-umum'
                      checked={
                        props.yaTidakPembedahanKecilMulutPembedahanRawatanUmum ===
                        'ya-pembedahan-kecil-mulut-pembedahan-rawatan-umum'
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        props.setYaTidakPembedahanKecilMulutPembedahanRawatanUmum(
                          e.target.value
                        );
                      }}
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
                      type='radio'
                      name='ya-tidak-pembedahan-kecil-mulut-pembedahan-rawatan-umum'
                      id='tidak-pembedahan-kecil-mulut-pembedahan-rawatan-umum'
                      value='tidak-pembedahan-kecil-mulut-pembedahan-rawatan-umum'
                      checked={
                        props.yaTidakPembedahanKecilMulutPembedahanRawatanUmum ===
                        'tidak-pembedahan-kecil-mulut-pembedahan-rawatan-umum'
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        props.setYaTidakPembedahanKecilMulutPembedahanRawatanUmum(
                          e.target.value
                        );
                      }}
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
                <p className='flex flex-row items-center pl-5 text-sm font-m'>
                  trauma
                </p>
                <div className='flex items-center justify-evenly'>
                  <div>
                    <input
                      type='radio'
                      name='ya-tidak-trauma-pembedahan-rawatan-umum'
                      id='ya-trauma-pembedahan-rawatan-umum'
                      value='ya-trauma-pembedahan-rawatan-umum'
                      checked={
                        props.yaTidakTraumaPembedahanRawatanUmum ===
                        'ya-trauma-pembedahan-rawatan-umum'
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        props.setYaTidakTraumaPembedahanRawatanUmum(
                          e.target.value
                        );
                      }}
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
                      type='radio'
                      name='ya-tidak-trauma-pembedahan-rawatan-umum'
                      id='tidak-trauma-pembedahan-rawatan-umum'
                      value='tidak-trauma-pembedahan-rawatan-umum'
                      checked={
                        props.yaTidakTraumaPembedahanRawatanUmum ===
                        'tidak-trauma-pembedahan-rawatan-umum'
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        props.setYaTidakTraumaPembedahanRawatanUmum(
                          e.target.value
                        );
                      }}
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
                {props.yaTidakTraumaPembedahanRawatanUmum ===
                'ya-trauma-pembedahan-rawatan-umum' ? (
                  <article className='grid grid-cols-1 border border-userBlack pl-3 p-2 col-span-2 m-2'>
                    <h4 className='font-bold flex flex-row pl-2'>Trauma</h4>
                    <div className='flex items-center flex-row pl-2'>
                      <input
                        type='checkbox'
                        name='kecederaan-tulang-muka-umum'
                        id='kecederaan-tulang-muka-umum'
                        checked={props.kecederaanTulangMukaUmum}
                        onChange={() => {
                          props.setKecederaanTulangMukaUmum(
                            !props.kecederaanTulangMukaUmum
                          );
                        }}
                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                      />
                      <label
                        htmlFor='kecederaan-tulang-muka-umum'
                        className='m-2 text-sm font-m'
                      >
                        Kecederaan tulang muka
                      </label>
                    </div>
                    <div className='flex items-center flex-row pl-2'>
                      <input
                        type='checkbox'
                        name='kecederaan-gigi-umum'
                        id='kecederaan-gigi-umum'
                        checked={props.kecederaanGigiUmum}
                        onChange={() => {
                          props.setKecederaanGigiUmum(
                            !props.kecederaanGigiUmum
                          );
                        }}
                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                      />
                      <label
                        htmlFor='kecederaan-gigi-umum'
                        className='m-2 text-sm font-m'
                      >
                        Kecederaan gigi
                      </label>
                    </div>
                    <div className='flex items-center flex-row pl-2'>
                      <input
                        type='checkbox'
                        name='kecederaan-tisu-lembut-umum'
                        id='kecederaan-tisu-lembut-umum'
                        checked={props.kecederaanTisuLembutUmum}
                        onChange={() => {
                          props.setKecederaanTisuLembutUmum(
                            !props.kecederaanTisuLembutUmum
                          );
                        }}
                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                      />
                      <label
                        htmlFor='kecederaan-tisu-lembut-umum'
                        className='m-2 text-sm font-m'
                      >
                        Kecederaan tisu lembut
                      </label>
                    </div>
                  </article>
                ) : null}
              </article>
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
                    value={props.baruJumlahGigiYangDiberiSdfRawatanUmum}
                    onChange={(e) => {
                      props.setBaruJumlahGigiYangDiberiSdfRawatanUmum(
                        e.target.value
                      );
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='16'
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
                    value={props.semulaJumlahGigiYangDiberiSdfRawatanUmum}
                    onChange={(e) => {
                      props.setSemulaJumlahGigiYangDiberiSdfRawatanUmum(
                        e.target.value
                      );
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='16'
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
                    value={props.baruJumlahCrownBridgeRawatanUmum}
                    onChange={(e) => {
                      props.setBaruJumlahCrownBridgeRawatanUmum(e.target.value);
                    }}
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
                    value={props.semulaJumlahCrownBridgeRawatanUmum}
                    onChange={(e) => {
                      props.setSemulaJumlahCrownBridgeRawatanUmum(
                        e.target.value
                      );
                    }}
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
                    value={props.baruJumlahPostCoreRawatanUmum}
                    onChange={(e) => {
                      props.setBaruJumlahPostCoreRawatanUmum(e.target.value);
                    }}
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
                    value={props.semulaJumlahPostCoreRawatanUmum}
                    onChange={(e) => {
                      props.setSemulaJumlahPostCoreRawatanUmum(e.target.value);
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='32'
                  />
                </div>
                <article className='grid grid-cols-2 col-span-2  border border-userBlack p-2 m-1 mx-1'>
                  <p className='flex flex-row pl-1 text-sm font-semibold col-span-2'>
                    dentur penuh
                  </p>
                  <div className='flex flex-row items-center p-1'>
                    <label
                      htmlFor='baru-penuh-jumlah-dentur-prostodontik-rawatan-umum'
                      className='text-sm font-m'
                    >
                      baru
                    </label>
                    <input
                      type='number'
                      name='baru-penuh-jumlah-dentur-prostodontik-rawatan-umum'
                      id='baru-penuh-jumlah-dentur-prostodontik-rawatan-umum'
                      value={props.baruPenuhJumlahDenturProstodontikRawatanUmum}
                      onChange={(e) => {
                        props.setBaruPenuhJumlahDenturProstodontikRawatanUmum(
                          e.target.value
                        );
                      }}
                      className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      min='0'
                      max='2'
                    />
                  </div>
                  <div className='flex flex-row items-center p-1'>
                    <label
                      htmlFor='semula-penuh-jumlah-dentur-prostodontik-rawatan-umum'
                      className='text-sm font-m'
                    >
                      semula
                    </label>
                    <input
                      type='number'
                      name='semula-penuh-jumlah-dentur-prostodontik-rawatan-umum'
                      id='semula-penuh-jumlah-dentur-prostodontik-rawatan-umum'
                      value={
                        props.semulaPenuhJumlahDenturProstodontikRawatanUmum
                      }
                      onChange={(e) => {
                        props.setSemulaPenuhJumlahDenturProstodontikRawatanUmum(
                          e.target.value
                        );
                      }}
                      className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      min='0'
                      max='2'
                    />
                  </div>
                  <p className='flex flex-row pl-1 text-sm font-semibold col-span-2'>
                    dentur separa
                  </p>
                  <div className='flex flex-row items-center p-1'>
                    <label
                      htmlFor='baru-separa-jumlah-dentur-prostodontik-rawatan-umum'
                      className='text-sm font-m'
                    >
                      baru
                    </label>
                    <input
                      type='number'
                      name='baru-separa-jumlah-dentur-prostodontik-rawatan-umum'
                      id='baru-separa-jumlah-dentur-prostodontik-rawatan-umum'
                      value={
                        props.baruSeparaJumlahDenturProstodontikRawatanUmum
                      }
                      onChange={(e) => {
                        props.setBaruSeparaJumlahDenturProstodontikRawatanUmum(
                          e.target.value
                        );
                      }}
                      className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      min='0'
                      max='2'
                    />
                  </div>
                  <div className='flex flex-row items-center p-1'>
                    <label
                      htmlFor='semula-separa-jumlah-dentur-prostodontik-rawatan-umum'
                      className='text-sm font-m'
                    >
                      semula
                    </label>
                    <input
                      type='number'
                      name='semula-separa-jumlah-dentur-prostodontik-rawatan-umum'
                      id='semula-separa-jumlah-dentur-prostodontik-rawatan-umum'
                      value={
                        props.semulaSeparaJumlahDenturProstodontikRawatanUmum
                      }
                      onChange={(e) => {
                        props.setSemulaSeparaJumlahDenturProstodontikRawatanUmum(
                          e.target.value
                        );
                      }}
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
                    immediate dentur
                  </label>
                  <input
                    type='number'
                    name='immediate-dentur-prostodontik-rawatan-umum'
                    id='immediate-dentur-prostodontik-rawatan-umum'
                    value={props.immediateDenturProstodontikRawatanUmum}
                    onChange={(e) => {
                      props.setImmediateDenturProstodontikRawatanUmum(
                        e.target.value
                      );
                    }}
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
                    pembaikan dentur
                  </label>
                  <input
                    type='number'
                    name='pembaikan-dentur-prostodontik-rawatan-umum'
                    id='pembaikan-dentur-prostodontik-rawatan-umum'
                    value={props.pembaikanDenturProstodontikRawatanUmum}
                    onChange={(e) => {
                      props.setPembaikanDenturProstodontikRawatanUmum(
                        e.target.value
                      );
                    }}
                    className='outline outline-1 outline-userBlack w-10 ml-3 text-sm font-m'
                    min='0'
                    max='2'
                  />
                </div>
              </article>
            </div>
            <div className='grid gap-2 auto-rows-min'>
              <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                  rawatan periodontik
                </h4>
                <div className='flex flex-row items-center pl-5 m-1'>
                  <input
                    type='checkbox'
                    name='penskaleran-rawatan-umum'
                    id='penskaleran-rawatan-umum'
                    checked={props.penskaleranRawatanUmum ? true : false}
                    onChange={() => {
                      props.setPenskaleranRawatanUmum(
                        !props.penskaleranRawatanUmum
                      );
                    }}
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
                    checked={
                      props.rawatanLainPeriodontikRawatanUmum ? true : false
                    }
                    onChange={() => {
                      props.setRawatanLainPeriodontikRawatanUmum(
                        !props.rawatanLainPeriodontikRawatanUmum
                      );
                    }}
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
              <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                  rawatan lain
                </h4>
                <div className='flex flex-row items-center pl-5 m-1'>
                  <input
                    type='checkbox'
                    name='rawatan-ortodontik-rawatan-umum'
                    id='rawatan-ortodontik-rawatan-umum'
                    checked={props.rawatanOrtodontikRawatanUmum ? true : false}
                    onChange={() => {
                      props.setRawatanOrtodontikRawatanUmum(
                        !props.rawatanOrtodontikRawatanUmum
                      );
                    }}
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                  />
                  <label
                    htmlFor='rawatan-ortodontik-rawatan-umum'
                    className='mx-2 text-sm font-m'
                  >
                    rawatan ortodontik
                  </label>
                </div>
                <div className='flex flex-row items-center pl-5 m-1'>
                  <input
                    type='checkbox'
                    name='kes-perubatan-mulut-rawatan-umum'
                    id='kes-perubatan-mulut-rawatan-umum'
                    checked={props.kesPerubatanMulutRawatanUmum ? true : false}
                    onChange={() => {
                      props.setKesPerubatanMulutRawatanUmum(
                        !props.kesPerubatanMulutRawatanUmum
                      );
                    }}
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                  />
                  <label
                    htmlFor='kes-perubatan-mulut-rawatan-umum'
                    className='mx-2 text-sm font-m'
                  >
                    kes perubatan mulut
                  </label>
                </div>
              </article>
              <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5'>
                  bilangan x-ray yang diambil
                </h4>
                <input
                  min='0'
                  max='32'
                  type='number'
                  name='bilangan-xray-yang-diambil-rawatan-umum'
                  id='bilangan-xray-yang-diambil-rawatan-umum'
                  value={props.bilanganXrayYangDiambilRawatanUmum}
                  onChange={(e) => {
                    props.setBilanganXrayYangDiambilRawatanUmum(e.target.value);
                  }}
                  className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                />
              </article>
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
                        min='0'
                        max='12'
                        type='number'
                        name='gd-baru-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        id='gd-baru-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        value={
                          props.gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum
                        }
                        onChange={(e) => {
                          props.setGdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum(
                            e.target.value
                          );
                        }}
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
                        min='0'
                        max='12'
                        type='number'
                        name='gd-semula-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        id='gd-semula-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        value={
                          props.gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum
                        }
                        onChange={(e) => {
                          props.setGdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum(
                            e.target.value
                          );
                        }}
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
                        min='0'
                        max='12'
                        type='number'
                        name='gk-baru-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        id='gk-baru-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        value={
                          props.gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum
                        }
                        onChange={(e) => {
                          props.setGkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum(
                            e.target.value
                          );
                        }}
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
                        min='0'
                        max='20'
                        type='number'
                        name='gk-semula-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        id='gk-semula-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        value={
                          props.gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum
                        }
                        onChange={(e) => {
                          props.setGkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum(
                            e.target.value
                          );
                        }}
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
                        min='0'
                        max='8'
                        type='number'
                        name='gd-baru-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        id='gd-baru-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        value={
                          props.gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum
                        }
                        onChange={(e) => {
                          props.setGdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum(
                            e.target.value
                          );
                        }}
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
                        min='0'
                        max='8'
                        type='number'
                        name='gd-semula-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        id='gd-semula-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        value={
                          props.gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum
                        }
                        onChange={(e) => {
                          props.setGdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum(
                            e.target.value
                          );
                        }}
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
                        min='0'
                        max='20'
                        type='number'
                        name='gk-baru-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        id='gk-baru-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        value={
                          props.gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum
                        }
                        onChange={(e) => {
                          props.setGkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum(
                            e.target.value
                          );
                        }}
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
                        min='0'
                        max='20'
                        type='number'
                        name='gk-semula-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        id='gk-semula-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                        value={
                          props.gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum
                        }
                        onChange={(e) => {
                          props.setGkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum(
                            e.target.value
                          );
                        }}
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
                        min='0'
                        max='8'
                        type='number'
                        name='gd-baru-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                        id='gd-baru-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                        value={
                          props.gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum
                        }
                        onChange={(e) => {
                          props.setGdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum(
                            e.target.value
                          );
                        }}
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
                        min='0'
                        max='8'
                        type='number'
                        name='gd-semula-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                        id='gd-semula-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                        value={
                          props.gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum
                        }
                        onChange={(e) => {
                          props.setGdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum(
                            e.target.value
                          );
                        }}
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
                        min='0'
                        max='20'
                        type='number'
                        name='gk-baru-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                        id='gk-baru-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                        value={
                          props.gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum
                        }
                        onChange={(e) => {
                          props.setGkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum(
                            e.target.value
                          );
                        }}
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
                        min='0'
                        max='20'
                        type='number'
                        name='gk-semula-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                        id='gk-semula-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                        value={
                          props.gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum
                        }
                        onChange={(e) => {
                          props.setGkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum(
                            e.target.value
                          );
                        }}
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
                        min='0'
                        max='20'
                        type='number'
                        name='baru-inlay-onlay-jumlah-tampalan-dibuat-rawatan-umum'
                        id='baru-inlay-onlay-jumlah-tampalan-dibuat-rawatan-umum'
                        value={
                          props.baruInlayOnlayJumlahTampalanDibuatRawatanUmum
                        }
                        onChange={(e) => {
                          props.setBaruInlayOnlayJumlahTampalanDibuatRawatanUmum(
                            e.target.value
                          );
                        }}
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
                        min='0'
                        max='20'
                        type='number'
                        name='semula-inlay-onlay-jumlah-tampalan-dibuat-rawatan-umum'
                        id='semula-inlay-onlay-jumlah-tampalan-dibuat-rawatan-umum'
                        value={
                          props.semulaInlayOnlayJumlahTampalanDibuatRawatanUmum
                        }
                        onChange={(e) => {
                          props.setSemulaInlayOnlayJumlahTampalanDibuatRawatanUmum(
                            e.target.value
                          );
                        }}
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
                        min='0'
                        max='32'
                        type='number'
                        name='jumlah-tampalan-sementara-jumlah-tampalan-dibuat-rawatan-umum'
                        id='jumlah-tampalan-sementara-jumlah-tampalan-dibuat-rawatan-umum'
                        value={
                          props.jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum
                        }
                        onChange={(e) => {
                          props.setJumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum(
                            e.target.value
                          );
                        }}
                        className='outline outline-1 outline-userBlack w-10 text-sm font-m ml-3'
                      />
                    </div>
                  </article>
                </div>
              </article>
              {/* pink */}
              {/* {props.kepp === true ? (
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
                      min='0'
                      max='12'
                      type='number'
                      name='jumlah-anterior-rawatan-semula-kepp-rawatan-umum'
                      id='jumlah-anterior-rawatan-semula-kepp-rawatan-umum'
                      value={props.jumlahAnteriorRawatanSemulaKeppRawatanUmum}
                      onChange={(e) => {
                        props.setJumlahAnteriorRawatanSemulaKeppRawatanUmum(
                          e.target.value
                        );
                      }}
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
                      min='0'
                      max='8'
                      type='number'
                      name='jumlah-premolar-rawatan-semula-kepp-rawatan-umum'
                      id='jumlah-premolar-rawatan-semula-kepp-rawatan-umum'
                      value={props.jumlahPremolarRawatanSemulaKeppRawatanUmum}
                      onChange={(e) => {
                        props.setJumlahPremolarRawatanSemulaKeppRawatanUmum(
                          e.target.value
                        );
                      }}
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
                      min='0'
                      max='12'
                      type='number'
                      name='jumlah-molar-rawatan-semula-kepp-rawatan-umum'
                      id='jumlah-molar-rawatan-semula-kepp-rawatan-umum'
                      value={props.jumlahMolarRawatanSemulaKeppRawatanUmum}
                      onChange={(e) => {
                        props.setJumlahMolarRawatanSemulaKeppRawatanUmum(
                          e.target.value
                        );
                      }}
                      className='outline outline-1 outline-userBlack w-10 text-sm font-m ml-3'
                    />
                  </div>
                </article>
              ) : null} */}
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
                    min='0'
                    max='12'
                    type='number'
                    name='jumlah-anterior-kes-endodontik-selesai-rawatan-umum'
                    id='jumlah-anterior-kes-endodontik-selesai-rawatan-umum'
                    value={props.jumlahAnteriorKesEndodontikSelesaiRawatanUmum}
                    onChange={(e) => {
                      props.setJumlahAnteriorKesEndodontikSelesaiRawatanUmum(
                        e.target.value
                      );
                    }}
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
                    min='0'
                    max='8'
                    type='number'
                    name='jumlah-premolar-kes-endodontik-selesai-rawatan-umum'
                    id='jumlah-premolar-kes-endodontik-selesai-rawatan-umum'
                    value={props.jumlahPremolarKesEndodontikSelesaiRawatanUmum}
                    onChange={(e) => {
                      props.setJumlahPremolarKesEndodontikSelesaiRawatanUmum(
                        e.target.value
                      );
                    }}
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
                    min='0'
                    max='12'
                    type='number'
                    name='jumlah-molar-kes-endodontik-selesai-rawatan-umum'
                    id='jumlah-molar-kes-endodontik-selesai-rawatan-umum'
                    value={props.jumlahMolarKesEndodontikSelesaiRawatanUmum}
                    onChange={(e) => {
                      props.setJumlahMolarKesEndodontikSelesaiRawatanUmum(
                        e.target.value
                      );
                    }}
                    className='outline outline-1 outline-userBlack w-10 text-sm font-m ml-3'
                  />
                </div>
                <div className='flex flex-row items-center pl-3'>
                  <label
                    htmlFor='rawatan-semula-endodontik-dari-primer-kes-endodontik-selesai-rawatan-umum'
                    className='text-sm font-m m-1'
                  >
                    rawatan semula endodontik :
                  </label>
                  <input
                    min='0'
                    max='32'
                    type='number'
                    name='rawatan-semula-endodontik-dari-primer-kes-endodontik-selesai-rawatan-umum'
                    id='rawatan-semula-endodontik-dari-primer-kes-endodontik-selesai-rawatan-umum'
                    value={
                      props.rawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum
                    }
                    onChange={(e) => {
                      props.setRawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum(
                        e.target.value
                      );
                    }}
                    className='outline outline-1 outline-userBlack w-10 text-sm font-m ml-3'
                  />
                </div>
              </article>
              {/* pink */}
              {props.kepp === true ? (
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
                      min='0'
                      max='10'
                      type='number'
                      name='memenuhi-rditn-kod3-kes-rujuk-uppr-rawatan-umum'
                      id='memenuhi-rditn-kod3-kes-rujuk-uppr-rawatan-umum'
                      value={props.memenuhiRditnKod3KesRujukUpprRawatanUmum}
                      onChange={(e) => {
                        props.setMemenuhiRditnKod3KesRujukUpprRawatanUmum(
                          e.target.value
                        );
                      }}
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
                      min='0'
                      max='32'
                      type='number'
                      name='restorasi-pasca-endodontik-kes-rujuk-uppr-rawatan-umum'
                      id='restorasi-pasca-endodontik-kes-rujuk-uppr-rawatan-umum'
                      value={
                        props.restorasiPascaEndodontikKesRujukUpprRawatanUmum
                      }
                      onChange={(e) => {
                        props.setRestorasiPascaEndodontikKesRujukUpprRawatanUmum(
                          e.target.value
                        );
                      }}
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
                      min='0'
                      max='32'
                      type='number'
                      name='komplikasi-semasa-rawatan-kepp-kes-rujuk-uppr-rawatan-umum'
                      id='komplikasi-semasa-rawatan-kepp-kes-rujuk-uppr-rawatan-umum'
                      value={
                        props.komplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum
                      }
                      onChange={(e) => {
                        props.setKomplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum(
                          e.target.value
                        );
                      }}
                      className='outline outline-1 outline-userBlack w-10 text-sm font-m ml-3'
                    />
                  </div>
                </article>
              ) : null}
              <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5'>status rawatan</h4>
                <div className='flex flex-row items-center pl-5 m-1'>
                  <input
                    type='checkbox'
                    name='kes-selesai-rawatan-umum'
                    id='kes-selesai-rawatan-umum'
                    checked={props.kesSelesaiRawatanUmum ? true : false}
                    onChange={() => {
                      props.setKesSelesaiRawatanUmum(
                        !props.kesSelesaiRawatanUmum
                      );
                    }}
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                  />
                  <label
                    htmlFor='kes-selesai-rawatan-umum'
                    className='mx-2 text-sm font-m'
                  >
                    kes selesai
                  </label>
                </div>
              </article>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
