import { useState, useEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';

function UserFormSekolahRawatan(props) {
  const [isShown, setIsShown] = useState(false);

  return (
    <>
      <div className='h-full p-1 px-10 grid gap-2'>
        <article className='outline outline-1 outline-userBlack grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pb-2'>
          <div>
            <div className='text-l font-bold flex flex-row pl-5 p-2'>
              <h1>MAKLUMAT AM PESAKIT</h1>
              <FaInfoCircle
                className='m-1 text-lg'
                onMouseEnter={() => setIsShown(true)}
                onMouseLeave={() => setIsShown(false)}
              />
            </div>
            {isShown && (
              <div className='z-100 absolute float-right box-border outline outline-1 outline-userBlack left-72 p-5 bg-userWhite '>
                <div className='flex flex-row'>
                  <h2 className='font-semibold'>NAMA :</h2>
                  <p className='ml-1'>stone cold</p>
                </div>
                <div className='text-sm flex flex-row '>
                  <h2 className='font-semibold'>NO IC :</h2>
                  <p className='ml-1'>123456121234</p>
                </div>
                <div className='text-sm flex flex-row '>
                  <h2 className='font-semibold'>JANTINA :</h2>
                  <p className='ml-1'>perempuan</p>
                </div>
                <div className='text-sm flex flex-row '>
                  <h2 className='font-semibold'>TARIKH LAHIR :</h2>
                  <p className='ml-1'>2/12/2022</p>
                </div>
                <div className='text-sm flex flex-row '>
                  <h2 className='font-semibold'>WARGANEGARA :</h2>
                  <p className='ml-1'>malaysia</p>
                </div>
                <div className='text-sm flex flex-row '>
                  <h2 className='font-semibold'>BANGSA :</h2>
                  <p className='ml-1'>pan-asia</p>
                </div>
              </div>
            )}
            <div className='flex flex-row pl-5'>
              <h2 className='font-semibold text-xs'>NAMA :</h2>
              <p className='ml-1 text-xs'>stone cold</p>
            </div>
          </div>
          <div className='md:pt-10'>
            <div className='text-s flex flex-row pl-5'>
              <h2 className='font-semibold text-xs'>NAMA SEKOLAH :</h2>
              <p className='ml-1 text-xs'>sk hogwart</p>
            </div>
          </div>
          <div className='lg:pt-10'>
            <div className='text-s flex flex-row pl-5'>
              <h2 className='font-semibold text-xs'>KELAS :</h2>
              <p className='ml-1 text-xs'>2 amal</p>
            </div>
          </div>
        </article>
        <div className='grid grid-cols-2 h-full overflow-scroll gap-2'>
          <span className='flex bg-user3 p-2 w-full capitalize col-span-2'>
            <p className='ml-3 text-xl font-semibold'>Rawatan</p>
          </span>
          <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md col-span-2'>
            <h4 className='font-bold flex flex-row pl-5 col-span-2'>
              tarikh pemeriksaan
            </h4>
            <div className='grid grid-cols-2'>
              <p className='flex items-center justify-center text-m font-m'>
                tarikh:<span className='text-user6'>*</span>
              </p>
              <input
                required
                type='date'
                name='tarikh-rawatan'
                id='tarikh-rawatan'
                value={props.tarikhRawatanSemasa}
                onChange={(e) => {
                  props.setTarikhRawatanSemasa(e.target.value);
                }}
                className='outline outline-1 outline-userBlack m-2 text-sm font-m'
              />
            </div>
          </article>
          <section className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 mb-3 w-full col-span-2'>
            <div className='grid gap-1'>
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
                    type='number'
                    name='baru-jumlah-gigi-kekal-dibuat-fs'
                    id='baru-jumlah-gigi-kekal-dibuat-fs'
                    value={props.baruJumlahGigiKekalDibuatFs}
                    onChange={(e) => {
                      props.setBaruJumlahGigiKekalDibuatFs(e.target.value);
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='16'
                    required
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
                    type='number'
                    name='semula-jumlah-gigi-kekal-dibuat-fs'
                    id='semula-jumlah-gigi-kekal-dibuat-fs'
                    value={props.semulaJumlahGigiKekalDibuatFs}
                    onChange={(e) => {
                      props.setSemulaJumlahGigiKekalDibuatFs(e.target.value);
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='16'
                    required
                  />
                </div>
                {props.sumDibuatFs > 16 && (
                  <p className='col-span-2 text-user6 font-semibold'>
                    jumlah baru & semula FS tidak boleh melebihi 16
                  </p>
                )}
                <p className='flex flex-row pl-5 text-sm font-m col-span-2'>
                  murid dibuat FS
                </p>
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='baru-jumlah-murid-dibuat-fs'
                    className='text-sm font-m'
                  >
                    Baru
                  </label>
                  <input
                    type='number'
                    name='baru-jumlah-murid-dibuat-fs'
                    id='baru-jumlah-murid-dibuat-fs'
                    value={props.baruJumlahMuridDibuatFs}
                    onChange={(e) => {
                      props.setBaruJumlahMuridDibuatFs(e.target.value);
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='16'
                    // required
                  />
                </div>
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='semula-jumlah-murid-dibuat-fs'
                    className='text-sm font-m'
                  >
                    Semula
                  </label>
                  <input
                    type='number'
                    name='semula-jumlah-murid-dibuat-fs'
                    id='semula-jumlah-murid-dibuat-fs'
                    value={props.semulaJumlahMuridDibuatFs}
                    onChange={(e) => {
                      props.setSemulaJumlahMuridDibuatFs(e.target.value);
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='16'
                    // required
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
                    type='number'
                    name='baru-jumlah-gigi-kekal-diberi-fv'
                    id='baru-jumlah-gigi-kekal-diberi-fv'
                    value={props.baruJumlahGigiKekalDiberiFv}
                    onChange={(e) => {
                      props.setBaruJumlahGigiKekalDiberiFv(e.target.value);
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='16'
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
                    value={props.semulaJumlahGigiKekalDiberiFv}
                    onChange={(e) => {
                      props.setSemulaJumlahGigiKekalDiberiFv(e.target.value);
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='16'
                    required
                  />
                </div>
                {props.sumDiberiFv > 16 && (
                  <p className='col-span-2 text-user6 font-semibold'>
                    jumlah baru & semula FV tidak boleh melebihi 16
                  </p>
                )}
                <p className='flex flex-row pl-5 text-sm font-m col-span-2'>
                  murid diberi FV
                </p>
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='baru-jumlah-murid-diberi-fv'
                    className='text-sm font-m'
                  >
                    Baru
                  </label>
                  <input
                    type='number'
                    name='baru-jumlah-murid-diberi-fv'
                    id='baru-jumlah-murid-diberi-fv'
                    value={props.baruJumlahMuridDiberiFv}
                    onChange={(e) => {
                      props.setBaruJumlahMuridDiberiFv(e.target.value);
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='16'
                    // required
                  />
                </div>
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='semula-jumlah-murid-diberi-fv'
                    className='text-sm font-m'
                  >
                    Semula
                  </label>
                  <input
                    type='number'
                    name='semula-jumlah-murid-diberi-fv'
                    id='semula-jumlah-murid-diberi-fv'
                    value={props.semulaJumlahMuridDiberiFv}
                    onChange={(e) => {
                      props.setSemulaJumlahMuridDiberiFv(e.target.value);
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='16'
                    // required
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
                    type='number'
                    name='baru-jumlah-gigi-kekal-diberi-prr-jenis-1'
                    id='baru-jumlah-gigi-kekal-diberi-prr-jenis-1'
                    value={props.baruJumlahGigiKekalDiberiPrrJenis1}
                    onChange={(e) => {
                      props.setBaruJumlahGigiKekalDiberiPrrJenis1(
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
                    htmlFor='semula-jumlah-gigi-kekal-diberi-prr-jenis-1'
                    className='text-sm font-m'
                  >
                    Semula
                  </label>
                  <input
                    type='number'
                    name='semula-jumlah-gigi-kekal-diberi-prr-jenis-1'
                    id='semula-jumlah-gigi-kekal-diberi-prr-jenis-1'
                    value={props.semulaJumlahGigiKekalDiberiPrrJenis1}
                    onChange={(e) => {
                      props.setSemulaJumlahGigiKekalDiberiPrrJenis1(
                        e.target.value
                      );
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='16'
                    required
                  />
                </div>
                {props.sumDiberiPrr > 16 && (
                  <p className='col-span-2 text-user6 font-semibold'>
                    jumlah baru & semula PRR tidak boleh melebihi 16
                  </p>
                )}
                <p className='flex flex-row pl-5 text-sm font-m col-span-2'>
                  murid diberi PRR Jenis 1
                </p>
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='baru-jumlah-murid-diberi-prr-jenis-1'
                    className='text-sm font-m'
                  >
                    Baru
                  </label>
                  <input
                    type='number'
                    name='baru-jumlah-murid-diberi-prr-jenis-1'
                    id='baru-jumlah-murid-diberi-prr-jenis-1'
                    value={props.baruJumlahMuridDiberiPrrJenis1}
                    onChange={(e) => {
                      props.setBaruJumlahMuridDiberiPrrJenis1(e.target.value);
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='16'
                    // required
                  />
                </div>
                <div className='flex flex-row items-center pl-5'>
                  <label
                    htmlFor='semula-jumlah-murid-diberi-prr-jenis-1'
                    className='text-sm font-m'
                  >
                    Semula
                  </label>
                  <input
                    type='number'
                    name='semula-jumlah-murid-diberi-prr-jenis-1'
                    id='semula-jumlah-murid-diberi-prr-jenis-1'
                    value={props.semulaJumlahMuridDiberiPrrJenis1}
                    onChange={(e) => {
                      props.setSemulaJumlahMuridDiberiPrrJenis1(e.target.value);
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='16'
                    // required
                  />
                </div>
              </article>
            </div>
            <div className='grid gap-1'>
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
                    type='number'
                    name='baru-jumlah-gigi-yang-diberi-sdf'
                    id='baru-jumlah-gigi-yang-diberi-sdf'
                    value={props.baruJumlahGigiYangDiberiSdf}
                    onChange={(e) => {
                      props.setBaruJumlahGigiYangDiberiSdf(e.target.value);
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='16'
                    required
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
                    type='number'
                    name='semula-jumlah-gigi-yang-diberi-sdf'
                    id='semula-jumlah-gigi-yang-diberi-sdf'
                    value={props.semulaJumlahGigiYangDiberiSdf}
                    onChange={(e) => {
                      props.setSemulaJumlahGigiYangDiberiSdf(e.target.value);
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                    max='16'
                    required
                  />
                </div>
              </article>
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
                        type='number'
                        name='gd-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                        id='gd-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                        value={props.gdBaruAnteriorSewarnaJumlahTampalanDibuat}
                        onChange={(e) => {
                          props.setGdBaruAnteriorSewarnaJumlahTampalanDibuat(
                            e.target.value
                          );
                        }}
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
                        type='number'
                        name='gd-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                        id='gd-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                        value={
                          props.gdSemulaAnteriorSewarnaJumlahTampalanDibuat
                        }
                        onChange={(e) => {
                          props.setGdSemulaAnteriorSewarnaJumlahTampalanDibuat(
                            e.target.value
                          );
                        }}
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
                        type='number'
                        name='gk-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                        id='gk-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                        value={props.gkBaruAnteriorSewarnaJumlahTampalanDibuat}
                        onChange={(e) => {
                          props.setGkBaruAnteriorSewarnaJumlahTampalanDibuat(
                            e.target.value
                          );
                        }}
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
                        type='number'
                        name='gk-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                        id='gk-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                        value={
                          props.gkSemulaAnteriorSewarnaJumlahTampalanDibuat
                        }
                        onChange={(e) => {
                          props.setGkSemulaAnteriorSewarnaJumlahTampalanDibuat(
                            e.target.value
                          );
                        }}
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
                        type='number'
                        name='gd-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                        id='gd-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                        value={props.gdBaruPosteriorSewarnaJumlahTampalanDibuat}
                        onChange={(e) => {
                          props.setGdBaruPosteriorSewarnaJumlahTampalanDibuat(
                            e.target.value
                          );
                        }}
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
                        type='number'
                        name='gd-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                        id='gd-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                        value={
                          props.gdSemulaPosteriorSewarnaJumlahTampalanDibuat
                        }
                        onChange={(e) => {
                          props.setGdSemulaPosteriorSewarnaJumlahTampalanDibuat(
                            e.target.value
                          );
                        }}
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
                        type='number'
                        name='gk-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                        id='gk-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                        value={props.gkBaruPosteriorSewarnaJumlahTampalanDibuat}
                        onChange={(e) => {
                          props.setGkBaruPosteriorSewarnaJumlahTampalanDibuat(
                            e.target.value
                          );
                        }}
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
                        type='number'
                        name='gk-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                        id='gk-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                        value={
                          props.gkSemulaPosteriorSewarnaJumlahTampalanDibuat
                        }
                        onChange={(e) => {
                          props.setGkSemulaPosteriorSewarnaJumlahTampalanDibuat(
                            e.target.value
                          );
                        }}
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
                        type='number'
                        name='gd-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                        id='gd-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                        value={props.gdBaruPosteriorAmalgamJumlahTampalanDibuat}
                        onChange={(e) => {
                          props.setGdBaruPosteriorAmalgamJumlahTampalanDibuat(
                            e.target.value
                          );
                        }}
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
                        type='number'
                        name='gd-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                        id='gd-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                        value={
                          props.gdSemulaPosteriorAmalgamJumlahTampalanDibuat
                        }
                        onChange={(e) => {
                          props.setGdSemulaPosteriorAmalgamJumlahTampalanDibuat(
                            e.target.value
                          );
                        }}
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
                        type='number'
                        name='gk-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                        id='gk-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                        value={props.gkBaruPosteriorAmalgamJumlahTampalanDibuat}
                        onChange={(e) => {
                          props.setGkBaruPosteriorAmalgamJumlahTampalanDibuat(
                            e.target.value
                          );
                        }}
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
                        type='number'
                        name='gk-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                        id='gk-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                        value={
                          props.gkSemulaPosteriorAmalgamJumlahTampalanDibuat
                        }
                        onChange={(e) => {
                          props.setGkSemulaPosteriorAmalgamJumlahTampalanDibuat(
                            e.target.value
                          );
                        }}
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
          <section className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 mb-3 w-full col-span-2'>
            <div className='grid gap-2 auto-rows-min'>
              <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                  cabutan
                </h4>
                <p className='flex items-center flex-row pl-5 text-m font-m col-span-2'>
                  gigi telah dicabut
                </p>
                <div className='flex items-center justify-center'>
                  <p className='text-sm font-m'>Desidus: </p>
                  <input
                    type='number'
                    name='cabut-desidus-penyata-akhir-2'
                    id='cabut-desidus-penyata-akhir-2'
                    value={props.cabutDesidusPenyataAkhir2}
                    onChange={(e) => {
                      props.setCabutDesidusPenyataAkhir2(e.target.value);
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
                    name='cabut-kekal-penyata-akhir-2'
                    id='cabut-kekal-penyata-akhir-2'
                    value={props.cabutKekalPenyataAkhir2}
                    onChange={(e) => {
                      props.setCabutKekalPenyataAkhir2(e.target.value);
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-1 text-sm font-m'
                    min='0'
                    max='32'
                  />
                </div>
              </article>
              <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                  tampalan sementara
                </h4>
                <div className='flex items-center flex-row pl-5 col-span-2'>
                  <p className='text-sm font-m'>jumlah tampalan sementara: </p>
                  <input
                    type='number'
                    name='jumlah-tampalan-sementara-penyata-akhir-2'
                    id='jumlah-tampalan-sementara-penyata-akhir-2'
                    value={props.jumlahTampalanSementaraPenyataAkhir2}
                    onChange={(e) => {
                      props.setJumlahTampalanSementaraPenyataAkhir2(
                        e.target.value
                      );
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                  />
                </div>
              </article>
              <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                  rawatan lain yang telah dilakukan
                </h4>
                <div className='grid grid-cols-1 lg:grid-cols-3 col-span-2'>
                  <div className='flex items-center flex-row pl-5'>
                    <p className='text-sm font-m'>pulpotomi: </p>
                    <input
                      type='number'
                      name='pulpotomi-penyata-akhir-2'
                      id='pulpotomi-penyata-akhir-2'
                      value={props.pulpotomiPenyataAkhir2}
                      onChange={(e) => {
                        props.setPulpotomiPenyataAkhir2(e.target.value);
                      }}
                      className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      min='0'
                      max='20'
                    />
                  </div>
                  <div className='flex items-center flex-row pl-5'>
                    <p className='text-sm font-m'>endodontik: </p>
                    <input
                      type='number'
                      name='endodontik-penyata-akhir-2'
                      id='endodontik-penyata-akhir-2'
                      value={props.endodontikPenyataAkhir2}
                      onChange={(e) => {
                        props.setEndodontikPenyataAkhir2(e.target.value);
                      }}
                      className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      min='0'
                      max='32'
                    />
                  </div>
                  <div className='flex items-center flex-row pl-5'>
                    <p className='text-sm font-m'>abses: </p>
                    <input
                      type='number'
                      name='abses-penyata-akhir-2'
                      id='abses-penyata-akhir-2'
                      value={props.absesPenyataAkhir2}
                      onChange={(e) => {
                        props.setAbsesPenyataAkhir2(e.target.value);
                      }}
                      className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      min='0'
                      max='1'
                    />
                  </div>
                </div>
                <div className='flex flex-row items-center pl-5'>
                  <p className='text-sm font-m'>Penskaleran:</p>
                  <input
                    type='number'
                    name='penskaleran-penyata-akhir-2'
                    id='penskaleran-penyata-akhir-2'
                    value={props.penskaleranPenyataAkhir2}
                    onChange={(e) => {
                      props.setPenskaleranPenyataAkhir2(e.target.value);
                    }}
                    className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    min='0'
                  />
                </div>
              </article>
              <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5'>status rawatan</h4>
                <div className='flex flex-row items-center pl-5 m-2'>
                  <input
                    type='checkbox'
                    name='kes-selesai-penyata-akhir-2'
                    id='kes-selesai-penyata-akhir-2'
                    checked={props.kesSelesaiPenyataAkhir2}
                    onChange={() => {
                      props.setKesSelesaiPenyataAkhir2(
                        !props.kesSelesaiPenyataAkhir2
                      );
                    }}
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                  />
                  <label
                    htmlFor='kes-selesai-penyata-akhir-2'
                    className='mx-2 text-sm font-m'
                  >
                    kes selesai
                  </label>
                </div>
                <div
                  className={`${
                    !props.kesSelesaiPenyataAkhir2 && 'hidden'
                  } flex flex-row items-center pl-5 m-2`}
                >
                  <input
                    type='checkbox'
                    name='kes-selesai-icdas-penyata-akhir-2'
                    id='kes-selesai-icdas-penyata-akhir-2'
                    checked={props.kesSelesaiIcdasPenyataAkhir2}
                    onChange={() => {
                      props.setKesSelesaiIcdasPenyataAkhir2(
                        !props.kesSelesaiIcdasPenyataAkhir2
                      );
                    }}
                    className='ml-7 w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                  />
                  <label
                    htmlFor='kes-selesai-icdas-penyata-akhir-2'
                    className='mx-2 text-sm font-m'
                  >
                    kes selesai ICDAS
                  </label>
                </div>
                <div className='flex flex-row items-center pl-5 m-2'>
                  <input
                    type='checkbox'
                    name='rujuk-penyata-akhir-2'
                    id='rujuk-penyata-akhir-2'
                    checked={props.rujukPenyataAkhir2}
                    onChange={() => {
                      props.setRujukPenyataAkhir2(!props.rujukPenyataAkhir2);
                    }}
                    className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                  />
                  <label
                    htmlFor='rujuk-penyata-akhir-2'
                    className='mx-2 text-sm font-m'
                  >
                    rujuk
                  </label>
                </div>
              </article>
            </div>
            <div className='grid gap-2 auto-rows-min'>
              <article className='grid gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                <h4 className='font-bold flex flex-row pl-5'>promosi</h4>
                <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                  <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                    menyertai
                  </h4>
                  <div className='grid grid-cols-1 lg:grid-cols-2'>
                    <div className='flex flex-row items-center pl-5'>
                      <p className='text-sm font-m'>Ceramah: </p>
                      <select
                        name='ceramah-promosi-penyata-akhir-2'
                        id='ceramah-promosi-penyata-akhir-2'
                        value={props.ceramahPromosiPenyataAkhir2}
                        onChange={(e) => {
                          props.setCeramahPromosiPenyataAkhir2(e.target.value);
                        }}
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
                        name='lmg-promosi-penyata-akhir-2'
                        id='lmg-promosi-penyata-akhir-2'
                        value={props.lmgPromosiPenyataAkhir2}
                        onChange={(e) => {
                          props.setLmgPromosiPenyataAkhir2(e.target.value);
                        }}
                        className='outline outline-1 outline-userBlack w-30 m-3 text-sm font-m'
                      >
                        <option value=''></option>
                        <option value='tiada'>Tiada</option>
                        <option value='baru'>Baru</option>
                        <option value='ulangan'>Ulangan</option>
                      </select>
                    </div>
                  </div>
                </article>
                <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                  <h4 className='font-bold flex flex-row pl-5'>
                    melaksanakan aktiviti begin
                  </h4>
                  <div className='flex items-center justify-evenly'>
                    <div>
                      <input
                        type='radio'
                        name='melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                        id='ya-melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                        value='ya-melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                        checked={
                          props.yaTidakMelaksanakanAktivitiBeginPromosiPenyataAkhir2 ===
                          'ya-melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          props.setYaTidakMelaksanakanAktivitiBeginPromosiPenyataAkhir2(
                            e.target.value
                          );
                        }}
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        required
                      />
                      <label
                        htmlFor='ya-melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                        className='m-2 text-sm font-m'
                      >
                        Ya
                      </label>
                    </div>
                    <div>
                      <input
                        type='radio'
                        name='melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                        id='tidak-melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                        value='tidak-melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                        checked={
                          props.yaTidakMelaksanakanAktivitiBeginPromosiPenyataAkhir2 ===
                          'tidak-melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          props.setYaTidakMelaksanakanAktivitiBeginPromosiPenyataAkhir2(
                            e.target.value
                          );
                        }}
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                      />
                      <label
                        htmlFor='tidak-melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                        className='m-2 text-sm font-m'
                      >
                        Tidak
                      </label>
                    </div>
                  </div>
                </article>
                <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                  <h4 className='font-bold flex flex-row pl-5'>
                    nasihat pergigian individu
                  </h4>
                  <div className='grid grid-cols-1'>
                    <div className='flex items-center flex-row pl-5'>
                      <label
                        htmlFor='plak-gigi-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                        className='m-2 text-sm font-m'
                      >
                        plak gigi
                      </label>
                      <input
                        type='checkbox'
                        name='plak-gigi-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                        id='plak-gigi-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                        checked={
                          props.plakGigiNasihatPergigianIndividuPromosiPenyataAkhir2
                        }
                        onChange={() => {
                          props.setPlakGigiNasihatPergigianIndividuPromosiPenyataAkhir2(
                            !props.plakGigiNasihatPergigianIndividuPromosiPenyataAkhir2
                          );
                        }}
                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                      />
                    </div>
                    <div className='flex items-center flex-row pl-5'>
                      <label
                        htmlFor='diet-pemakanan-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                        className='m-2 text-sm font-m'
                      >
                        diet pemakanan
                      </label>
                      <input
                        type='checkbox'
                        name='diet-pemakanan-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                        id='diet-pemakanan-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                        checked={
                          props.dietPemakananNasihatPergigianIndividuPromosiPenyataAkhir2
                        }
                        onChange={() => {
                          props.setDietPemakananNasihatPergigianIndividuPromosiPenyataAkhir2(
                            !props.dietPemakananNasihatPergigianIndividuPromosiPenyataAkhir2
                          );
                        }}
                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                      />
                    </div>
                    <div className='flex items-center flex-row pl-5'>
                      <label
                        htmlFor='penjagaan-kesihatan-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                        className='m-2 text-sm font-m'
                      >
                        penjagaan kesihatan mulut
                      </label>
                      <input
                        type='checkbox'
                        name='penjagaan-kesihatan-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                        id='penjagaan-kesihatan-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                        checked={
                          props.penjagaanKesihatanMulutNasihatPergigianIndividuPromosiPenyataAkhir2
                        }
                        onChange={() => {
                          props.setPenjagaanKesihatanMulutNasihatPergigianIndividuPromosiPenyataAkhir2(
                            !props.penjagaanKesihatanMulutNasihatPergigianIndividuPromosiPenyataAkhir2
                          );
                        }}
                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                      />
                    </div>
                    <div className='flex items-center flex-row pl-5'>
                      <label
                        htmlFor='kanser-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                        className='m-2 text-sm font-m'
                      >
                        kanser mulut
                      </label>
                      <input
                        type='checkbox'
                        name='kanser-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                        id='kanser-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                        checked={
                          props.kanserMulutNasihatPergigianIndividuPromosiPenyataAkhir2
                        }
                        onChange={() => {
                          props.setKanserMulutNasihatPergigianIndividuPromosiPenyataAkhir2(
                            !props.kanserMulutNasihatPergigianIndividuPromosiPenyataAkhir2
                          );
                        }}
                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                      />
                    </div>
                  </div>
                </article>
              </article>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default UserFormSekolahRawatan;
