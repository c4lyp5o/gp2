import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

function Faq() {
  // Pentadbir
  const [showPentadbir, setShowPentadbir] = useState(false);
  const [showSubPentadbir1, setShowSubPentadbir1] = useState(false);
  const [showSubPentadbir2, setShowSubPentadbir2] = useState(false);
  const [showSubPentadbir3, setShowSubPentadbir3] = useState(false);
  const [showSubPentadbir4, setShowSubPentadbir4] = useState(false);
  const [showSubPentadbir5, setShowSubPentadbir5] = useState(false);
  const [showSubPentadbir6, setShowSubPentadbir6] = useState(false);
  const [showSubPentadbir7, setShowSubPentadbir7] = useState(false);
  const [showSubPentadbir8, setShowSubPentadbir8] = useState(false);
  const [showSubPentadbir9, setShowSubPentadbir9] = useState(false);
  const [showSubPentadbir10, setShowSubPentadbir10] = useState(false);

  // Register
  const [showPendaftaran, setShowPendaftaran] = useState(false);
  const [showSubPendaftaran1, setShowSubPendaftaran1] = useState(false);
  const [showSubPendaftaran2, setShowSubPendaftaran2] = useState(false);
  const [showSubPendaftaran3, setShowSubPendaftaran3] = useState(false);
  const [showSubPendaftaran4, setShowSubPendaftaran4] = useState(false);
  const [showSubPendaftaran5, setShowSubPendaftaran5] = useState(false);
  const [showSubPendaftaran6, setShowSubPendaftaran6] = useState(false);
  const [showSubPendaftaran7, setShowSubPendaftaran7] = useState(false);
  const [showSubPendaftaran8, setShowSubPendaftaran8] = useState(false);
  const [showSubPendaftaran9, setShowSubPendaftaran9] = useState(false);
  const [showSubPendaftaran10, setShowSubPendaftaran10] = useState(false);
  const [showSubPendaftaran11, setShowSubPendaftaran11] = useState(false);
  const [showSubPendaftaran12, setShowSubPendaftaran12] = useState(false);
  const [showSubPendaftaran13, setShowSubPendaftaran13] = useState(false);
  const [showSubPendaftaran14, setShowSubPendaftaran14] = useState(false);
  const [showSubPendaftaran15, setShowSubPendaftaran15] = useState(false);
  const [showSubPendaftaran16, setShowSubPendaftaran16] = useState(false);

  // Pengguna
  const [showPengguna, setShowPengguna] = useState(false);
  const [showSubPengguna1, setShowSubPengguna1] = useState(false);
  const [showSubPengguna2, setShowSubPengguna2] = useState(false);
  const [showSubPengguna3, setShowSubPengguna3] = useState(false);
  const [showSubPengguna4, setShowSubPengguna4] = useState(false);
  const [showSubPengguna5, setShowSubPengguna5] = useState(false);
  const [showSubPengguna6, setShowSubPengguna6] = useState(false);
  const [showSubPengguna7, setShowSubPengguna7] = useState(false);
  const [showSubPengguna8, setShowSubPengguna8] = useState(false);
  const [showSubPengguna9, setShowSubPengguna9] = useState(false);
  const [showSubPengguna10, setShowSubPengguna10] = useState(false);
  const [showSubPengguna11, setShowSubPengguna11] = useState(false);
  const [showSubPengguna12, setShowSubPengguna12] = useState(false);
  const [showSubPengguna13, setShowSubPengguna13] = useState(false);
  const [showSubPengguna14, setShowSubPengguna14] = useState(false);
  const [showSubPengguna15, setShowSubPengguna15] = useState(false);
  const [showSubPengguna16, setShowSubPengguna16] = useState(false);
  const [showSubPengguna17, setShowSubPengguna17] = useState(false);
  const [showSubPengguna18, setShowSubPengguna18] = useState(false);
  const [showSubPengguna19, setShowSubPengguna19] = useState(false);
  const [showSubPengguna20, setShowSubPengguna20] = useState(false);
  const [showSubPengguna21, setShowSubPengguna21] = useState(false);
  const [showSubPengguna22, setShowSubPengguna22] = useState(false);
  const [showSubPengguna23, setShowSubPengguna23] = useState(false);
  const [showSubPengguna24, setShowSubPengguna24] = useState(false);
  const [showSubPengguna25, setShowSubPengguna25] = useState(false);

  // unUsed
  const [showUnused, setShowUnused] = useState(true);

  return (
    <>
      {/*header*/}
      <div className='absolute top-0 left-0 right-0 grid grid-cols-1 md:grid-cols-2 grid-rows-1 items-center h-28 bg-[#2c3e50] text-userWhite font-sans capitalize justify-evenly'>
        <div className='grid grid-cols-1 md:grid-cols-2'>
          <div className='grid grid-rows-[50px_10px_10px] md:gap-1 text-center col-start-1 md:col-start-2 md:justify-end'>
            <img
              className='w-full h-full'
              src='https://upload.wikimedia.org/wikipedia/commons/9/94/Jata_MalaysiaV2.svg'
              alt='missing jata negara'
            />
            <p className='uppercase text-[0.55rem] lg:text-[0.65rem]'>
              kementerian kesihatan malaysia
            </p>
            <p className='uppercase text-[0.55rem] lg:text-[0.65rem]'>
              program kesihatan pergigian
            </p>
            <h1 className='md:hidden text-lg font-semibold'>Soalan Lazim</h1>
          </div>
        </div>
        <div className='hidden md:grid grid-rows-2 text-3xl font-bold text-start'>
          <h1 className='row-span-2 mb-3'>Soalan Lazim</h1>
        </div>
      </div>
      {/* content */}
      <div className='absolute inset-0 -z-10 flex bg-user5 text-center justify-center items-center capitalize'>
        <div className='w-full h-4/6 md:h-3/4 mx-2 mt-24 bg-userWhite outline outline-1 outline-use rounded-md shadow-xl overflow-auto'>
          <div className='grid'>
            <div className='justify-center items-center text-xl font-bold mt-7'>
              <h1>Soalan Lazim Gi-Ret 2.0</h1>
            </div>
            <p className='lg:hidden text-sm text-user6 mt-3'></p>
          </div>
          <div className='px-2 grid grid-cols-3'>
            {/* tajuk modul */}
            <div>
              <button
                className='flex text-kaunterWhite text-sm lg:text-lg font-semibold justify-center bg-admin2 bg-opacity-70 active:bg-opacity-100 focus:bg-opacity-100 hover:bg-opacity-100 p-1 w-full capitalize cursor-pointer rounded-t-md'
                onClick={() => {
                  setShowPentadbir(!showPentadbir);
                  setShowPendaftaran(false);
                  setShowPengguna(false);
                  setShowUnused(false);
                }}
              >
                PENTADBIR
              </button>
            </div>
            <div>
              <button
                className='flex text-kaunterWhite text-sm lg:text-lg font-semibold justify-center bg-kaunter1 bg-opacity-70 active:bg-opacity-100 focus:bg-opacity-100 hover:bg-opacity-100 p-1 w-full capitalize cursor-pointer rounded-t-md '
                onClick={() => {
                  setShowPendaftaran(!showPendaftaran);
                  setShowPentadbir(false);
                  setShowPengguna(false);
                  setShowUnused(false);
                }}
              >
                PENDAFTARAN
              </button>
            </div>
            <div>
              <button
                className='flex text-kaunterWhite text-sm lg:text-lg font-semibold justify-center bg-user2 bg-opacity-70 active:bg-opacity-100 focus:bg-opacity-100 hover:bg-opacity-100 p-1 w-full capitalize cursor-pointer rounded-t-md '
                onClick={() => {
                  setShowPengguna(!showPengguna);
                  setShowPentadbir(false);
                  setShowPendaftaran(false);
                  setShowUnused(false);
                }}
              >
                PENGGUNA
              </button>
            </div>
            {/* modul pentadbir */}
            <article
              className={`flex flex-col transition-all col-span-3 bg-admin5 bg-opacity-70 rounded-b-md ${
                showPentadbir
                  ? 'max-h-full overflow-y-auto'
                  : 'max-h-0 overflow-y-hidden'
              } `}
            >
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-admin1 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPentadbir1(!showSubPentadbir1);
                    setShowSubPentadbir2(false);
                    setShowSubPentadbir3(false);
                    setShowSubPentadbir4(false);
                  }}
                >
                  {showSubPentadbir1 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Adakah Pentadbir Negeri boleh turut serta menjadi Pentadbir
                  Klinik?
                </span>
                <p
                  className={`flex flex-row transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPentadbir1
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Boleh, jika Pentadbir Negeri tersebut merupakan PPYM/ Sister/
                  JP yang bertugas di Klinik berkenaan.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-admin1 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPentadbir2(!showSubPentadbir2);
                    setShowSubPentadbir1(false);
                    setShowSubPentadbir3(false);
                    setShowSubPentadbir4(false);
                  }}
                >
                  {showSubPentadbir2 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Berapa orang pentadbir bagi satu-satu daerah? Kalau lebih dari
                  satu orang pentadbir, adalah perlu didaftarkan 3 e-mel
                  berbeza?
                </span>
                <p
                  className={`flex flex-row transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPentadbir2
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Tiada had Pentadbir Daerah. Guna hanya 1 e-mel sahaja yang
                  dikongsi antara Pentadbir Daerah. Key verifikasi akan dihantar
                  ke e-mel tersebut bagi membolehkan Pentadbir Daerah log masuk
                  ke Modul Pentadbir Daerah.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-admin1 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPentadbir3(!showSubPentadbir3);
                    setShowSubPentadbir1(false);
                    setShowSubPentadbir2(false);
                    setShowSubPentadbir4(false);
                  }}
                >
                  {showSubPentadbir3 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Bagaimana nak cipta lebih dari 1 peranan? Contoh peranan
                  Pentadbir Daerah dan juga pengguna?
                </span>
                <p
                  className={`flex flex-row transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPentadbir3
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Tidak perlu cipta 2 peranan. Jika Pegawai A adalah pentadbir
                  daerah B dan merupakan pegawai bertugas di Klinik C, semasa
                  pendaftaran pegawai pergigian di Modul Pentadbir, pilih
                  sebagai Pengguna di Klinik C. Tugas sebagai Pentadbir Daerah
                  adalah mengemaskini data klinik, pegawai pergigian, juruterapi
                  pergigian, taska & tadika dan lain-lain di Modul Pentadbir
                  Daerah.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-admin1 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPentadbir4(!showSubPentadbir4);
                    setShowSubPentadbir1(false);
                    setShowSubPentadbir2(false);
                    setShowSubPentadbir3(false);
                  }}
                >
                  {showSubPentadbir4 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Untuk e-mel pegawai pergigian dan juruterapi pergigian, guna 1
                  e-mel khas untuk klinik atau e-mel personal? perlu
                  verification ke semasa pengguna log in?
                </span>
                <p
                  className={`flex flex-row transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPentadbir4
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Sila guna e-mel personal masing-masing.Kata Laluan bagi Modul
                  Pengguna dan Modul Pendaftaran adalah kata laluan tetap yang
                  diberikan di Modul Pentadbir Daerah. Bagi pengisian reten
                  individu (Pengguna), no. MDC/MDTB akan digunakan. Bagi
                  Pentadbir Klinik, kunci verifikasi akan dihantar ke dalam
                  e-mel Pentadbir Klinik.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-admin1 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPentadbir5(!showSubPentadbir5);
                    setShowSubPentadbir1(false);
                    setShowSubPentadbir2(false);
                    setShowSubPentadbir3(false);
                    setShowSubPentadbir4(false);
                  }}
                >
                  {showSubPentadbir5 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Nama klinik saya salah ejaan
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPentadbir5
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  }`}
                >
                  Nama klinik diambil berdasarkan ejaan di PIK. Sekiranya ada
                  perubahan, mohon untuk membuat permohonan kepada pihak PIK
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-admin1 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPentadbir6(!showSubPentadbir6);
                    setShowSubPentadbir1(false);
                    setShowSubPentadbir2(false);
                    setShowSubPentadbir3(false);
                    setShowSubPentadbir4(false);
                    setShowSubPentadbir5(false);
                  }}
                >
                  {showSubPentadbir6 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  1 pegawai boleh didaftarkan di KP utama dan KP Visiting ke?
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPentadbir6
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  }`}
                >
                  Pegawai didaftarkan mengikut klinik utama beliau bertugas.
                  Jika pegawai ke KP Visiting secara berkala (bukan setiap hari
                  & bukan ditetapkan secara tetap di KP Vsiting), pilih sebagai
                  pegawai relief di Modul Pengguna dan pilih nama KP Visiting
                  tersebut.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-admin1 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPentadbir7(!showSubPentadbir7);
                    setShowSubPentadbir1(false);
                    setShowSubPentadbir2(false);
                    setShowSubPentadbir3(false);
                    setShowSubPentadbir4(false);
                    setShowSubPentadbir5(false);
                    setShowSubPentadbir6(false);
                  }}
                >
                  {showSubPentadbir7 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Bagaimana cara nak tambah nama dalam senarai juruterapi?
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPentadbir7
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  }`}
                >
                  Jika ada no. MDTB, sila guna butang Tambah di sebelah kanan
                  pada fungsi bar Juruterapi Pergigian di Modul Pentadbir
                  Daerah. Manakala jika tiada no. MDTB, sila tentukan secara
                  manual pemegang JP1 hingga JP5. Juruterapi tersebut perlu
                  mengisi reten mengikut JP1 hingga JP5 seperti yang telah
                  ditetapkan oleh daerah.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-admin1 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPentadbir8(!showSubPentadbir8);
                    setShowSubPentadbir1(false);
                    setShowSubPentadbir2(false);
                    setShowSubPentadbir3(false);
                    setShowSubPentadbir4(false);
                    setShowSubPentadbir5(false);
                    setShowSubPentadbir6(false);
                    setShowSubPentadbir7(false);
                  }}
                >
                  {showSubPentadbir8 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Berapa orang maksimum untuk Pentadbir Klinik?
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPentadbir8
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  }`}
                >
                  2-3 orang sahaja, PPYM dan Sister/JP yang akan memantau reten
                  klinik
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-admin1 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPentadbir9(!showSubPentadbir9);
                    setShowSubPentadbir1(false);
                    setShowSubPentadbir2(false);
                    setShowSubPentadbir3(false);
                    setShowSubPentadbir4(false);
                    setShowSubPentadbir5(false);
                    setShowSubPentadbir6(false);
                    setShowSubPentadbir7(false);
                    setShowSubPentadbir8(false);
                  }}
                >
                  {showSubPentadbir9 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Adakah Pentadbir Klinik (PPYM) boleh berperanan sebagai
                  pengguna atau perlu daftar sebagai pengguna
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPentadbir9
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  }`}
                >
                  Ya. Pentadbir Klinik secara automatik juga sebagai pengguna.
                  Tidak perlu daftar 2 kali
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-admin1 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPentadbir10(!showSubPentadbir10);
                    setShowSubPentadbir1(false);
                    setShowSubPentadbir2(false);
                    setShowSubPentadbir3(false);
                    setShowSubPentadbir4(false);
                    setShowSubPentadbir5(false);
                    setShowSubPentadbir6(false);
                    setShowSubPentadbir7(false);
                    setShowSubPentadbir8(false);
                    setShowSubPentadbir9(false);
                  }}
                >
                  {showSubPentadbir10 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Bolehkah guna semula e-mel pentadbir daerah untuk Klinik
                  Pergigian? atau perlu guna e-mel yang lain?
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPentadbir10
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  }`}
                >
                  Sila guna e-mel berbeza untuk pentadbir daerah dan pentadbir
                  klinik. Kunci verifikasi untuk buka Modul Pentadbir Daerah
                  akan dihantar ke e-mel Pentadbir Daerah.
                </p>
              </article>
            </article>
            {/* modul pendaftaran */}
            <article
              className={`flex flex-col transition-all col-span-3 bg-kaunter3 bg-opacity-70 rounded-b-md ${
                showPendaftaran
                  ? 'max-h-full overflow-y-auto'
                  : 'max-h-0 overflow-y-hidden'
              } `}
            >
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-kaunter2 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPendaftaran1(!showSubPendaftaran1);
                    setShowSubPendaftaran2(false);
                    setShowSubPendaftaran3(false);
                    setShowSubPendaftaran4(false);
                  }}
                >
                  {showSubPendaftaran1 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Bagi klinik yang menggunakan Sistem OHCIS atau TPC OHCIS,
                  masih perlu guna Sistem Gi-Ret 2.0 untuk pendaftaran tahun
                  2023?
                </span>
                <p
                  className={`flex flex-row transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPendaftaran1
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Ya, pesakit perlu didaftarkan di Sistem Gi-Ret 2.0 juga
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-kaunter2 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPendaftaran2(!showSubPendaftaran2);
                    setShowSubPendaftaran1(false);
                    setShowSubPendaftaran3(false);
                    setShowSubPendaftaran4(false);
                  }}
                >
                  {showSubPendaftaran2 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  bagi primer, pendaftaran adalah 100% melalui Sistem Gi-ret
                  2.0? Tak perlu daftar di PG101?
                </span>
                <p
                  className={`flex flex-row transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPendaftaran2
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Ya. Bagi PG101A, ianya boleh dijana melalui Sistem Gi-Ret 2.0
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-kaunter2 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPendaftaran3(!showSubPendaftaran3);
                    setShowSubPendaftaran1(false);
                    setShowSubPendaftaran2(false);
                    setShowSubPendaftaran4(false);
                  }}
                >
                  {showSubPendaftaran3 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Bagaimana nak dapatkan kata laluan bagi Modul Pendaftaran? dan
                  Kata Laluan itu kita boleh tukar sendiri?
                </span>
                <p
                  className={`flex flex-row transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPendaftaran3
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Sila rujuk Pentadbir Daerah untuk mendapatkan kata laluan
                  Modul Pendaftaran dan Modul Pengguna.Buat masa ini, kata
                  laluan kami tidak buka lagi untuk membuat pertukaran. Akan ada
                  tatacara yang tertentu bagi menentukan siapa yang akan
                  bertanggungjawab menukar kata laluan pendaftaran dan
                  penggunan.
                </p>
              </article>
              {/* copy starts here */}
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-kaunter2 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPendaftaran4(!showSubPendaftaran4);
                    setShowSubPendaftaran1(false);
                    setShowSubPendaftaran2(false);
                    setShowSubPendaftaran3(false);
                  }}
                >
                  {showSubPendaftaran4 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Jika pesakit pergi dua klinik berbeza dalam hari yang sama,
                  adakah klinik kedua dapat mengesan pesakit tersebut sebagai
                  pesakit ulangan atau perlu daftar sebagai pesakit baru semula
                  ?
                </span>
                <p
                  className={`flex flex-row transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPendaftaran4
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Pesakit akan didaftarkan mengikut fasiliti. Jika pesakit tidak
                  pernah datang ke fasiliti tersebut,maka pesakit tersebut
                  adalah pesakit baru.
                </p>
              </article>
              {/* copy ends here*/}
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-kaunter2 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPendaftaran5(!showSubPendaftaran5);
                    setShowSubPendaftaran1(false);
                    setShowSubPendaftaran2(false);
                    setShowSubPendaftaran3(false);
                    setShowSubPendaftaran4(false);
                  }}
                >
                  {showSubPendaftaran5 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Macam mana nak tahu pesakit didaftarkan baru atau ulangan?
                </span>
                <p
                  className={`flex flex-row transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPendaftaran5
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Sistem akan menentukan sama ada pesakit itu adalah pesakit
                  baru atau ulangan. Pesakit baru mempunyai ikon berwarna hijau
                  di sebelah nombor pendaftaran,manakala warna merah untuk
                  pesakit ulangan. Sila rujuk pada LP8 pesakit juga.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-kaunter2 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPendaftaran6(!showSubPendaftaran6);
                    setShowSubPendaftaran1(false);
                    setShowSubPendaftaran2(false);
                    setShowSubPendaftaran3(false);
                    setShowSubPendaftaran4(false);
                    setShowSubPendaftaran5(false);
                  }}
                >
                  {showSubPendaftaran6 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Adakah nombor pendaftaran (RN) bagi warganegara berbeza dengan
                  bukan warganegara?
                </span>
                <p
                  className={`flex flex-row transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPendaftaran6
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Nombor pendaftaran (RN) bagi warganegara dan bukan warganegara
                  adalah sama & berturutan.Perbezaan antara dua tersebut
                  hanyalah jenis pengenalan.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-kaunter2 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPendaftaran7(!showSubPendaftaran7);
                    setShowSubPendaftaran1(false);
                    setShowSubPendaftaran2(false);
                    setShowSubPendaftaran3(false);
                    setShowSubPendaftaran4(false);
                    setShowSubPendaftaran5(false);
                    setShowSubPendaftaran6(false);
                  }}
                >
                  {showSubPendaftaran7 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Bagaimana pendaftaran jika pesakit tidak mempunyai sebarang
                  pengenalan diri?
                </span>
                <p
                  className={`flex flex-row transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPendaftaran7
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Pilih Jenis Pengenalan: Tiada Pengenalan Yang Sah
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-kaunter2 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPendaftaran8(!showSubPendaftaran8);
                    setShowSubPendaftaran1(false);
                    setShowSubPendaftaran2(false);
                    setShowSubPendaftaran3(false);
                    setShowSubPendaftaran4(false);
                    setShowSubPendaftaran5(false);
                    setShowSubPendaftaran6(false);
                    setShowSubPendaftaran7(false);
                  }}
                >
                  {showSubPendaftaran8 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Bagaimana pendaftaran bagi pesakit bayi yang tiada surat
                  beranak lagi?
                </span>
                <p
                  className={`flex flex-row transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPendaftaran8
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Pilih Jenis Pengenalan: Baby Of, Kemudian masukkan nombor kad
                  pengenalan ibu bayi tersebut.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-kaunter2 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPendaftaran9(!showSubPendaftaran9);
                    setShowSubPendaftaran1(false);
                    setShowSubPendaftaran2(false);
                    setShowSubPendaftaran3(false);
                    setShowSubPendaftaran4(false);
                    setShowSubPendaftaran5(false);
                    setShowSubPendaftaran6(false);
                    setShowSubPendaftaran7(false);
                    setShowSubPendaftaran8(false);
                  }}
                >
                  {showSubPendaftaran9 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Fungsi auto-fill hanya ada untuk MyKad/MyKid sahaja? Kerana
                  pesakit didaftarkan dengan passport, tiada auto-fill untuk
                  pesakit sama semasa ulangan.
                </span>
                <p
                  className={`flex flex-row transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPendaftaran9
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Nombor passport boleh berubah dan ini menghadkan fungsi
                  auto-fill. Setakat ini, fungsi auto-fill hanya dapat dilakukan
                  untuk jenis pengenalan menggunakan myKad/MyKid. Namun, kami
                  mengambil maklum perkara ini dan akan melihat semula peluang
                  untuk menambah baik.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-kaunter2 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPendaftaran10(!showSubPendaftaran10);
                    setShowSubPendaftaran1(false);
                    setShowSubPendaftaran2(false);
                    setShowSubPendaftaran3(false);
                    setShowSubPendaftaran4(false);
                    setShowSubPendaftaran5(false);
                    setShowSubPendaftaran6(false);
                    setShowSubPendaftaran7(false);
                    setShowSubPendaftaran8(false);
                    setShowSubPendaftaran9(false);
                  }}
                >
                  {showSubPendaftaran10 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Status pesakit bersekolah ditanda untuk kategori pesakit umur
                  berapa?
                </span>
                <p
                  className={`flex flex-row transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPendaftaran10
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Kedatangan pesakit yang masih bersekolah (bagi sekolah rendah
                  dan sekolah menengah) perlu ditanda 'Bersekolah'. Sila rujuk
                  glosari.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-kaunter2 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPendaftaran11(!showSubPendaftaran11);
                    setShowSubPendaftaran1(false);
                    setShowSubPendaftaran2(false);
                    setShowSubPendaftaran3(false);
                    setShowSubPendaftaran4(false);
                    setShowSubPendaftaran5(false);
                    setShowSubPendaftaran6(false);
                    setShowSubPendaftaran7(false);
                    setShowSubPendaftaran8(false);
                    setShowSubPendaftaran9(false);
                    setShowSubPendaftaran10(false);
                  }}
                >
                  {showSubPendaftaran11 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Permanent Residence (PR) didaftarkan menggunakan IC merah.
                  Macam mana nak tahu dia Bukan Warganegara?
                </span>
                <p
                  className={`flex flex-row transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPendaftaran11
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Mengikut JPN, selagi seseorang yang berada di Malaysia yang
                  memegang MyPR, maka dia masih Bukan Warganegara, sehinggalah
                  pemohonan menjadi warganegara diluluskan dan bertukar ke kad
                  pengenalan biru. Maka dalam sistem, buat masa ini, boleh
                  menggunakan jenis pengenalan Passport/ MyPR/ MyKAS/UNHCR untuk
                  proses daftar di Modul Pendaftaran.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-kaunter2 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPendaftaran12(!showSubPendaftaran12);
                    setShowSubPendaftaran1(false);
                    setShowSubPendaftaran2(false);
                    setShowSubPendaftaran3(false);
                    setShowSubPendaftaran4(false);
                    setShowSubPendaftaran5(false);
                    setShowSubPendaftaran6(false);
                    setShowSubPendaftaran7(false);
                    setShowSubPendaftaran8(false);
                    setShowSubPendaftaran9(false);
                    setShowSubPendaftaran10(false);
                    setShowSubPendaftaran11(false);
                  }}
                >
                  {showSubPendaftaran12 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Jika terdapat kekangan masa untuk pendaftaran, bolehkah
                  maklumat ditambah pada hari keesokkannya?
                </span>
                <p
                  className={`flex flex-row transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPendaftaran12
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Bagi Pendaftaran di Klinik Pergigian, pendaftaran WAJIB
                  dilakukan pada hari tersebut bagi mengelakkan kecelaruan
                  nombor pendaftaran pesakit. Pengemaskinian data pesakit di
                  bahagian pendaftaran juga hanya boleh dilakukan pada hari yang
                  sama sahaja.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-kaunter2 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPendaftaran13(!showSubPendaftaran13);
                    setShowSubPendaftaran1(false);
                    setShowSubPendaftaran2(false);
                    setShowSubPendaftaran3(false);
                    setShowSubPendaftaran4(false);
                    setShowSubPendaftaran5(false);
                    setShowSubPendaftaran6(false);
                    setShowSubPendaftaran7(false);
                    setShowSubPendaftaran8(false);
                    setShowSubPendaftaran9(false);
                    setShowSubPendaftaran10(false);
                    setShowSubPendaftaran11(false);
                    setShowSubPendaftaran12(false);
                  }}
                >
                  {showSubPendaftaran13 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Pada ruang catatan, nombor resit perlu ditulis penuh ke?
                </span>
                <p
                  className={`flex flex-row transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPendaftaran13
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Ruang catatan tersebut perlu ditulis sebagaimana yang ditulis
                  sebelum ini, mengikut pentetapan daerah masing-masing.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-kaunter2 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPendaftaran14(!showSubPendaftaran14);
                    setShowSubPendaftaran1(false);
                    setShowSubPendaftaran2(false);
                    setShowSubPendaftaran3(false);
                    setShowSubPendaftaran4(false);
                    setShowSubPendaftaran5(false);
                    setShowSubPendaftaran6(false);
                    setShowSubPendaftaran7(false);
                    setShowSubPendaftaran8(false);
                    setShowSubPendaftaran9(false);
                    setShowSubPendaftaran10(false);
                    setShowSubPendaftaran11(false);
                    setShowSubPendaftaran12(false);
                    setShowSubPendaftaran13(false);
                  }}
                >
                  {showSubPendaftaran14 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Jika pesakit telah berjaya didaftarkan dalam sistem adakah
                  data tersebut boleh dihapuskan?
                </span>
                <p
                  className={`flex flex-row transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPendaftaran14
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Hanya Pentadbir KP sahaja boleh menghapuskan data tersebut,
                  tetapi perlu justifikasi dan alasan yang kukuh supaya tidak
                  menjejaskan kualiti data yang akan dilaporkan.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-kaunter2 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPendaftaran15(!showSubPendaftaran15);
                    setShowSubPendaftaran1(false);
                    setShowSubPendaftaran2(false);
                    setShowSubPendaftaran3(false);
                    setShowSubPendaftaran4(false);
                    setShowSubPendaftaran5(false);
                    setShowSubPendaftaran6(false);
                    setShowSubPendaftaran7(false);
                    setShowSubPendaftaran8(false);
                    setShowSubPendaftaran9(false);
                    setShowSubPendaftaran10(false);
                    setShowSubPendaftaran11(false);
                    setShowSubPendaftaran12(false);
                    setShowSubPendaftaran13(false);
                    setShowSubPendaftaran14(false);
                  }}
                >
                  {showSubPendaftaran15 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Jika pesakit KKIA yang telah didaftarkan dibawah KKIA/KD, dan
                  pesakit tersebut datang semula untuk rawatan di KP,
                  bagaimanakah pendaftaran dilakukan? Adakah nombor pendaftaran
                  sama akan diberi sewaktu pendaftaran di KKIA/KD?
                </span>
                <p
                  className={`flex flex-row transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPendaftaran15
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Sila daftar di Modul Pendaftaran Klinik Pergigian. Nombor
                  pendaftaran pesakit tidak akan sama kerana perbezaan fasiliti.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-kaunter2 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPendaftaran16(!showSubPendaftaran16);
                    setShowSubPendaftaran1(false);
                    setShowSubPendaftaran2(false);
                    setShowSubPendaftaran3(false);
                    setShowSubPendaftaran4(false);
                    setShowSubPendaftaran5(false);
                    setShowSubPendaftaran6(false);
                    setShowSubPendaftaran7(false);
                    setShowSubPendaftaran8(false);
                    setShowSubPendaftaran9(false);
                    setShowSubPendaftaran10(false);
                    setShowSubPendaftaran11(false);
                    setShowSubPendaftaran12(false);
                    setShowSubPendaftaran13(false);
                    setShowSubPendaftaran14(false);
                    setShowSubPendaftaran15(false);
                  }}
                >
                  {showSubPendaftaran16 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Jika pesakit hadir di KKIA/KD, siapakah yang akan daftar dalam
                  sistem Gi-Ret 2.0
                </span>
                <p
                  className={`flex flex-row transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPendaftaran16
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Anggota pergigian yang membuat pemeriksaan di KKIA/KD
                </p>
              </article>
            </article>
            {/* modul pengguna */}
            <article
              className={`flex flex-col transition-all col-span-3 bg-user5 bg-opacity-70 rounded-b-md ${
                showPengguna
                  ? 'max-h-full overflow-y-auto'
                  : 'max-h-0 overflow-y-hidden'
              } `}
            >
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-semibold bg-user3 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPengguna1(!showSubPengguna1);
                    setShowSubPengguna2(false);
                    setShowSubPengguna3(false);
                    setShowSubPengguna4(false);
                    setShowSubPengguna4(false);
                    setShowSubPengguna5(false);
                    setShowSubPengguna6(false);
                    setShowSubPengguna7(false);
                    setShowSubPengguna8(false);
                    setShowSubPengguna9(false);
                    setShowSubPengguna10(false);
                    setShowSubPengguna11(false);
                    setShowSubPengguna12(false);
                    setShowSubPengguna13(false);
                    setShowSubPengguna14(false);
                    setShowSubPengguna15(false);
                    setShowSubPengguna16(false);
                    setShowSubPengguna17(false);
                    setShowSubPengguna18(false);
                  }}
                >
                  {showSubPengguna1 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Pegawai A bertugas sebagai ganti/relief di Klinik Pergigian B,
                  bagaimanakah cara untuk memasukkan reten?
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 te xt-xs lg:text-base font-normal ${
                    showSubPengguna1
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Pegawai A perlu membuka Modul Pengguna beliau & tick sebagai
                  pegawai relief, seterusnya pilih nama Klinik B untuk membuat
                  pengisian reten pegawai.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-semibold bg-user3 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPengguna2(!showSubPengguna2);
                    setShowSubPengguna1(false);
                    setShowSubPengguna3(false);
                    setShowSubPengguna4(false);
                    setShowSubPengguna4(false);
                    setShowSubPengguna5(false);
                    setShowSubPengguna6(false);
                    setShowSubPengguna7(false);
                    setShowSubPengguna8(false);
                    setShowSubPengguna9(false);
                    setShowSubPengguna10(false);
                    setShowSubPengguna11(false);
                    setShowSubPengguna12(false);
                    setShowSubPengguna13(false);
                    setShowSubPengguna14(false);
                    setShowSubPengguna15(false);
                    setShowSubPengguna16(false);
                    setShowSubPengguna17(false);
                    setShowSubPengguna18(false);
                  }}
                >
                  {showSubPengguna2 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Klinik visiting yang tiada pegawai,adakah perlu tick relief?
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPengguna2
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Ya betul, kerana tiada pegawai yang berada di klinik tersebut.
                  Maka pegawai yang relief perlu sign in di klinik asalnya, dan
                  tick relief, kemudian pilih klinik visiting tersebut.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-semibold bg-user3 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPengguna3(!showSubPengguna3);
                    setShowSubPengguna1(false);
                    setShowSubPengguna2(false);
                    setShowSubPengguna4(false);
                    setShowSubPengguna5(false);
                    setShowSubPengguna6(false);
                    setShowSubPengguna7(false);
                    setShowSubPengguna8(false);
                    setShowSubPengguna9(false);
                    setShowSubPengguna10(false);
                    setShowSubPengguna11(false);
                    setShowSubPengguna12(false);
                    setShowSubPengguna13(false);
                    setShowSubPengguna14(false);
                    setShowSubPengguna15(false);
                    setShowSubPengguna16(false);
                    setShowSubPengguna17(false);
                    setShowSubPengguna18(false);
                  }}
                >
                  {showSubPengguna3 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Apakah maksud tempoh 3 hari memasukkan data?
                </span>
                <p
                  className={`flex flex-row text-left transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPengguna3
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Tempoh 3 hari memasukkan data adalah 3 HARI BEKERJA untuk
                  memasukkan data di Modul Pengguna,termasuk hari pesakit
                  diperiksa. Data masih WAJIB dimasukkan pada hari ke-4 tetapi
                  tidak akan dikira ke dalam laporan. Maka komitmen memasukkan
                  data secara terus adalah amat digalakkan bagi mengelakkan
                  kehilangan data.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-semibold bg-user3 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPengguna4(!showSubPengguna4);
                    setShowSubPengguna1(false);
                    setShowSubPengguna2(false);
                    setShowSubPengguna3(false);
                    setShowSubPengguna5(false);
                    setShowSubPengguna6(false);
                    setShowSubPengguna7(false);
                    setShowSubPengguna8(false);
                    setShowSubPengguna9(false);
                    setShowSubPengguna10(false);
                    setShowSubPengguna11(false);
                    setShowSubPengguna12(false);
                    setShowSubPengguna13(false);
                    setShowSubPengguna14(false);
                    setShowSubPengguna15(false);
                    setShowSubPengguna16(false);
                    setShowSubPengguna17(false);
                    setShowSubPengguna18(false);
                  }}
                >
                  {showSubPengguna4 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  3 hari termasuk Sabtu & Ahad ?
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPengguna4
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  3 HARI BEKERJA mengikut negeri yang bekerja pada hari Jumaat
                  dan Ahad.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-semibold bg-user3 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPengguna5(!showSubPengguna5);
                    setShowSubPengguna1(false);
                    setShowSubPengguna2(false);
                    setShowSubPengguna3(false);
                    setShowSubPengguna4(false);
                    setShowSubPengguna6(false);
                    setShowSubPengguna7(false);
                    setShowSubPengguna8(false);
                    setShowSubPengguna9(false);
                    setShowSubPengguna10(false);
                    setShowSubPengguna11(false);
                    setShowSubPengguna12(false);
                    setShowSubPengguna13(false);
                    setShowSubPengguna14(false);
                    setShowSubPengguna15(false);
                    setShowSubPengguna16(false);
                    setShowSubPengguna17(false);
                    setShowSubPengguna18(false);
                  }}
                >
                  {showSubPengguna5 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Bagi negeri yang bercuti pada Sabtu & Ahad, pesakit datang
                  pada hari Jumaat, maka pengisian data boleh di-isi sehingga
                  Rabu?
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPengguna5
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Pendaftaran di Modul Pendaftaran mesti dibuat terus pada
                  Jumaat, iaitu hari yang sama pesakit datang ke klinik.Manakala
                  bagi pengisian data pemeriksaan/rawatan pesakit pula,
                  dibenarkan sehingga selasa sahaja.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-semibold bg-user3 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPengguna6(!showSubPengguna6);
                    setShowSubPengguna1(false);
                    setShowSubPengguna2(false);
                    setShowSubPengguna3(false);
                    setShowSubPengguna4(false);
                    setShowSubPengguna5(false);
                    setShowSubPengguna7(false);
                    setShowSubPengguna8(false);
                    setShowSubPengguna9(false);
                    setShowSubPengguna10(false);
                    setShowSubPengguna11(false);
                    setShowSubPengguna12(false);
                    setShowSubPengguna13(false);
                    setShowSubPengguna14(false);
                    setShowSubPengguna15(false);
                    setShowSubPengguna16(false);
                    setShowSubPengguna17(false);
                    setShowSubPengguna18(false);
                  }}
                >
                  {showSubPengguna6 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Adakah Sistem Gi-Ret 2.0 mempunyai fungsi autosave?
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPengguna6
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Sistem ini TIDAK mempunyai fungsi autosave.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-semibold bg-user3 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPengguna7(!showSubPengguna7);
                    setShowSubPengguna1(false);
                    setShowSubPengguna2(false);
                    setShowSubPengguna3(false);
                    setShowSubPengguna4(false);
                    setShowSubPengguna5(false);
                    setShowSubPengguna6(false);
                    setShowSubPengguna8(false);
                    setShowSubPengguna9(false);
                    setShowSubPengguna10(false);
                    setShowSubPengguna11(false);
                    setShowSubPengguna12(false);
                    setShowSubPengguna13(false);
                    setShowSubPengguna14(false);
                    setShowSubPengguna15(false);
                    setShowSubPengguna16(false);
                    setShowSubPengguna17(false);
                    setShowSubPengguna18(false);
                  }}
                >
                  {showSubPengguna7 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Bagaimanakah jika pesakit baru diperiksa oleh Dr A/JP A,
                  tetapi dirujuk untuk membuat rawatan kepada Dr B di klinik
                  yang sama?
                </span>
                <p
                  className={`flex flex-row text-left transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPengguna7
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Pihak pembangun telah membuat penambahbaikan kepada sistem
                  ini. Dr A/ JP A perlu mengisi ruang pemeriksaan dan klik pada
                  check box di ruang rawatan: Rawatan Dibuat Oleh Operator Lain
                  (Rawatan Ada Dibuat Oleh Operator Lain Pada Hari Yang Sama
                  Sahaja) dan tekan butang Hantar. Apabila Dr B membuka Modul
                  Pengguna, beliau boleh memilih pesakit yang sama untuk mengisi
                  rawatan yang telah dijalankan pada hari tersebut.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-semibold bg-user3 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPengguna8(!showSubPengguna8);
                    setShowSubPengguna1(false);
                    setShowSubPengguna2(false);
                    setShowSubPengguna3(false);
                    setShowSubPengguna4(false);
                    setShowSubPengguna5(false);
                    setShowSubPengguna6(false);
                    setShowSubPengguna7(false);
                    setShowSubPengguna9(false);
                    setShowSubPengguna10(false);
                    setShowSubPengguna11(false);
                    setShowSubPengguna12(false);
                    setShowSubPengguna13(false);
                    setShowSubPengguna14(false);
                    setShowSubPengguna15(false);
                    setShowSubPengguna16(false);
                    setShowSubPengguna17(false);
                    setShowSubPengguna18(false);
                  }}
                >
                  {showSubPengguna8 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Adakah reten BP dan reten BPE boleh dijana dari Sistem Gi-Ret
                  2.0?
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPengguna8
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Reten BPE dan BP boleh dijana melalui Sistem Gi-Ret 2.0.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-semibold bg-user3 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPengguna9(!showSubPengguna9);
                    setShowSubPengguna1(false);
                    setShowSubPengguna2(false);
                    setShowSubPengguna3(false);
                    setShowSubPengguna4(false);
                    setShowSubPengguna5(false);
                    setShowSubPengguna6(false);
                    setShowSubPengguna7(false);
                    setShowSubPengguna8(false);
                    setShowSubPengguna10(false);
                    setShowSubPengguna11(false);
                    setShowSubPengguna12(false);
                    setShowSubPengguna13(false);
                    setShowSubPengguna14(false);
                    setShowSubPengguna15(false);
                    setShowSubPengguna16(false);
                    setShowSubPengguna17(false);
                    setShowSubPengguna18(false);
                  }}
                >
                  {showSubPengguna9 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Jika berlaku pertukaran maklumat (sebagai contoh: pertambahan
                  karies/sejarah perubatan), bagaimanakah hendak mengemaskini
                  semasa kedatangan ulangan?
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPengguna9
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Maklumat tersebut perlu dikemaskini dalam kad rawatan LP8
                  sahaja, tidak perlu dikemaskini dalam Sistem Gi-Ret 2.0
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-semibold bg-user3 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPengguna10(!showSubPengguna10);
                    setShowSubPengguna1(false);
                    setShowSubPengguna2(false);
                    setShowSubPengguna3(false);
                    setShowSubPengguna4(false);
                    setShowSubPengguna5(false);
                    setShowSubPengguna6(false);
                    setShowSubPengguna7(false);
                    setShowSubPengguna8(false);
                    setShowSubPengguna9(false);
                    setShowSubPengguna11(false);
                    setShowSubPengguna12(false);
                    setShowSubPengguna13(false);
                    setShowSubPengguna14(false);
                    setShowSubPengguna15(false);
                    setShowSubPengguna16(false);
                    setShowSubPengguna17(false);
                    setShowSubPengguna18(false);
                  }}
                >
                  {showSubPengguna10 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Sekiranya terdapat kesalahan mengisi ruangan rawatan pesakit
                  selepas klik dihantar, adakah boleh dikemaskini semula?
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPengguna10
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Reten yang telah diisi di Modul Pengguna, TIDAK BOLEH
                  dikemaskini lagi. Sila peka terhadap data sebelum klik butang
                  Hantar.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-semibold bg-user3 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPengguna11(!showSubPengguna11);
                    setShowSubPengguna1(false);
                    setShowSubPengguna2(false);
                    setShowSubPengguna3(false);
                    setShowSubPengguna4(false);
                    setShowSubPengguna5(false);
                    setShowSubPengguna6(false);
                    setShowSubPengguna7(false);
                    setShowSubPengguna8(false);
                    setShowSubPengguna9(false);
                    setShowSubPengguna10(false);
                    setShowSubPengguna12(false);
                    setShowSubPengguna13(false);
                    setShowSubPengguna14(false);
                    setShowSubPengguna15(false);
                    setShowSubPengguna16(false);
                    setShowSubPengguna17(false);
                    setShowSubPengguna18(false);
                  }}
                >
                  {showSubPengguna11 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Apakah maksud KEPP? dan adakah Tingkatan 6 termasuk dalam
                  kategori dewasa muda?
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPengguna11
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  KEPP bermaksud Klinik Endodontik Pergigian Primer, manakala
                  Tingkatan 6 termasuk dalam kategori dewasa muda
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-semibold bg-user3 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPengguna12(!showSubPengguna12);
                    setShowSubPengguna1(false);
                    setShowSubPengguna2(false);
                    setShowSubPengguna3(false);
                    setShowSubPengguna4(false);
                    setShowSubPengguna5(false);
                    setShowSubPengguna6(false);
                    setShowSubPengguna7(false);
                    setShowSubPengguna8(false);
                    setShowSubPengguna9(false);
                    setShowSubPengguna10(false);
                    setShowSubPengguna11(false);
                    setShowSubPengguna13(false);
                    setShowSubPengguna14(false);
                    setShowSubPengguna15(false);
                    setShowSubPengguna16(false);
                    setShowSubPengguna17(false);
                    setShowSubPengguna18(false);
                  }}
                >
                  {showSubPengguna12 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Untuk pesakit yang sudah diclaim kes selesai dan pesakit
                  datang semula untuk masalah yang lain, adakah pengisian
                  rawatan dibenarkan ?
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPengguna12
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Pengisian rawatan dibenarkan untuk dibuat hari yang sama.
                  Namun tidak dibenarkan untuk claim kes selesai sekali lagi
                  kerana ianya hanya boleh dikira sekali sahaja dalam setahun.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-semibold bg-user3 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPengguna13(!showSubPengguna13);
                    setShowSubPengguna1(false);
                    setShowSubPengguna2(false);
                    setShowSubPengguna3(false);
                    setShowSubPengguna4(false);
                    setShowSubPengguna5(false);
                    setShowSubPengguna6(false);
                    setShowSubPengguna7(false);
                    setShowSubPengguna8(false);
                    setShowSubPengguna9(false);
                    setShowSubPengguna10(false);
                    setShowSubPengguna11(false);
                    setShowSubPengguna12(false);
                    setShowSubPengguna14(false);
                    setShowSubPengguna15(false);
                    setShowSubPengguna16(false);
                    setShowSubPengguna17(false);
                    setShowSubPengguna18(false);
                  }}
                >
                  {showSubPengguna13 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Bagi kes Endodontik,sekiranya rawatan pada hari tersebut
                  adalah "cleaning and shaping" bagaimanakah pengisian rawatan
                  dibuat, kerana hanya kes selesai endodontik sahaja dalam
                  pilihan.
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPengguna13
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Untuk langkah "cleaning & shaping, pegawai perlu claim
                  kedatangan ulangan & rawatan tampalan sementara. Rawatan
                  endodontik dipilih sekiranya obturation telah selesai dibuat.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-semibold bg-user3 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPengguna14(!showSubPengguna14);
                    setShowSubPengguna1(false);
                    setShowSubPengguna2(false);
                    setShowSubPengguna3(false);
                    setShowSubPengguna4(false);
                    setShowSubPengguna5(false);
                    setShowSubPengguna6(false);
                    setShowSubPengguna7(false);
                    setShowSubPengguna8(false);
                    setShowSubPengguna9(false);
                    setShowSubPengguna10(false);
                    setShowSubPengguna11(false);
                    setShowSubPengguna12(false);
                    setShowSubPengguna13(false);
                    setShowSubPengguna15(false);
                    setShowSubPengguna16(false);
                    setShowSubPengguna17(false);
                    setShowSubPengguna18(false);
                  }}
                >
                  {showSubPengguna14 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Bagi Sapuan flourida, tiada pilihan untuk sapuan ke berapa?
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPengguna14
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Tiada. Reten FV Kohot akan dimasukkan di dalam fasa
                  seterusnya.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-semibold bg-user3 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPengguna15(!showSubPengguna15);
                    setShowSubPengguna1(false);
                    setShowSubPengguna2(false);
                    setShowSubPengguna3(false);
                    setShowSubPengguna4(false);
                    setShowSubPengguna5(false);
                    setShowSubPengguna6(false);
                    setShowSubPengguna7(false);
                    setShowSubPengguna8(false);
                    setShowSubPengguna9(false);
                    setShowSubPengguna10(false);
                    setShowSubPengguna11(false);
                    setShowSubPengguna12(false);
                    setShowSubPengguna13(false);
                    setShowSubPengguna14(false);
                    setShowSubPengguna16(false);
                    setShowSubPengguna17(false);
                    setShowSubPengguna18(false);
                  }}
                >
                  {showSubPengguna15 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Mengapakah tiada butang hapus di dalam Modul Pengguna?
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPengguna15
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Butang Hapus hanya akan didapati oleh Pentadbir Klinik sahaja,
                  di Modul Pengguna.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-semibold bg-user3 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPengguna16(!showSubPengguna16);
                    setShowSubPengguna1(false);
                    setShowSubPengguna2(false);
                    setShowSubPengguna3(false);
                    setShowSubPengguna4(false);
                    setShowSubPengguna5(false);
                    setShowSubPengguna6(false);
                    setShowSubPengguna7(false);
                    setShowSubPengguna8(false);
                    setShowSubPengguna9(false);
                    setShowSubPengguna10(false);
                    setShowSubPengguna11(false);
                    setShowSubPengguna12(false);
                    setShowSubPengguna13(false);
                    setShowSubPengguna14(false);
                    setShowSubPengguna15(false);
                    setShowSubPengguna17(false);
                    setShowSubPengguna18(false);
                  }}
                >
                  {showSubPengguna16 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Jika tiada pilihan rawatan yang boleh diisi seperti yang ada
                  di dalam glosari, bolehkan klik butang hantar tanpa mengisi
                  ruang rawatan?
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPengguna16
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Boleh,dan jika ada memberikan Nasihat Kesihatan Pergigian
                  Individu, boleh isi ruangan ini. Jika tiada, abaikan.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-semibold bg-user3 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPengguna1(false);
                    setShowSubPengguna2(false);
                    setShowSubPengguna3(false);
                    setShowSubPengguna4(false);
                    setShowSubPengguna5(false);
                    setShowSubPengguna6(false);
                    setShowSubPengguna7(false);
                    setShowSubPengguna8(false);
                    setShowSubPengguna9(false);
                    setShowSubPengguna10(false);
                    setShowSubPengguna11(false);
                    setShowSubPengguna12(false);
                    setShowSubPengguna13(false);
                    setShowSubPengguna14(false);
                    setShowSubPengguna15(false);
                    setShowSubPengguna16(false);
                    setShowSubPengguna17(!showSubPengguna17);
                    setShowSubPengguna18(false);
                  }}
                >
                  {showSubPengguna17 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Siapakah yang perlu tutup & compile reten pada hujung bulan?
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPengguna17
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Sistem Gi-Ret 2.0 diwujudkan untuk mengurangkan beban compile
                  reten. Reten tidak perlu ditutup atau dikumpulkan oleh sesiapa
                  kerana reten boleh dijana secara automatik.
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-semibold bg-user3 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPengguna18(!showSubPengguna18);
                    setShowSubPengguna1(false);
                    setShowSubPengguna2(false);
                    setShowSubPengguna3(false);
                    setShowSubPengguna4(false);
                    setShowSubPengguna5(false);
                    setShowSubPengguna6(false);
                    setShowSubPengguna7(false);
                    setShowSubPengguna8(false);
                    setShowSubPengguna9(false);
                    setShowSubPengguna10(false);
                    setShowSubPengguna11(false);
                    setShowSubPengguna12(false);
                    setShowSubPengguna13(false);
                    setShowSubPengguna14(false);
                    setShowSubPengguna15(false);
                    setShowSubPengguna16(false);
                    setShowSubPengguna17(false);
                  }}
                >
                  {showSubPengguna18 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Adakah Sistem Gi-ret 2.0 boleh menjana reten individu supaya
                  datanya boleh digunakan bagi kegunaan SKU?
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPengguna18
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Data individu boleh dijana oleh pengguna sendiri dari Sistem
                  Gi-ret 2.0. Data di peringkat klinik pergigian juga boleh
                  dijana oleh Pentadbir Klinik.
                </p>
              </article>
            </article>
            <article
              className={`flex flex-col transition-all col-span-3 bg-user5 bg-opacity-70 rounded-b-md ${
                showUnused ||
                (showPentadbir === false &&
                  showPendaftaran === false &&
                  showPengguna === false)
                  ? 'max-h-full overflow-y-auto'
                  : 'max-h-0 overflow-y-hidden'
              } `}
            >
              <p className='text-xl font-thin'>
                sila pilih modul yang dikehendaki
              </p>
            </article>
          </div>
        </div>
      </div>
      {/* footer */}
      <div className='absolute bottom-0 left-0 right-0 grid grid-cols-2 bg-[#95a5a6] uppercase'>
        <p className='text-left ml-1 my-1 text-xs pl-1'>
          hak cipta kementerian kesihatan malaysia
        </p>
        <p className='text-right mr-1 my-1 pr-1 text-xs whitespace-nowrap overflow-x-auto'>
          <a
            className='mr-3 underline'
            href='https://forms.gle/v9P7w9qweTX86Nxn8'
          >
            borang maklumbalas
          </a>
        </p>
      </div>
    </>
  );
}
export default Faq;
