import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import jatanegara from '../../src/assets/Jata_MalaysiaV2.svg';

function Faq() {
  //search
  const [search, setSearch] = useState('');
  // Pentadbir
  const [showPentadbir, setShowPentadbir] = useState(false);
  const [showSubPentadbir, setShowSubPentadbir] = useState(null);

  // Register
  const [showPendaftaran, setShowPendaftaran] = useState(false);
  const [showSubPendaftaran, setShowSubPendaftaran] = useState(null);

  // Pengguna
  const [showPengguna, setShowPengguna] = useState(false);
  const [showSubPengguna, setShowSubPengguna] = useState(null);

  // unUsed
  const [showUnused, setShowUnused] = useState(true);

  //handleAccordion showSubPentadbir
  const handleAccordionPentadbir = (itemId) => {
    if (itemId === showSubPentadbir) {
      setShowSubPentadbir(null);
    } else {
      setShowSubPentadbir(itemId);
    }
  };

  //handleAccordion showSubPendaftaran
  const handleAccordionPendaftaran = (itemId) => {
    if (itemId === showSubPendaftaran) {
      setShowSubPendaftaran(null);
    } else {
      setShowSubPendaftaran(itemId);
    }
  };

  //handleAccordion showSubPengguna
  const handleAccordionPengguna = (itemId) => {
    if (itemId === showSubPengguna) {
      setShowSubPengguna(null);
    } else {
      setShowSubPengguna(itemId);
    }
  };

  return (
    <>
      {/*header*/}
      <div className='absolute top-0 left-0 right-0 grid grid-cols-1 md:grid-cols-2 grid-rows-1 items-center h-28 bg-[#2c3e50] text-userWhite font-sans capitalize justify-evenly'>
        <div className='grid grid-cols-1 md:grid-cols-2'>
          <div className='grid grid-rows-[50px_10px_10px] md:gap-1 text-center col-start-1 md:col-start-2 md:justify-end'>
            <img
              className='w-full h-full'
              src={jatanegara}
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
          </div>
          <div className='px-2 grid grid-cols-3'>
            <div className='my-4 col-span-3 relative'>
              <input
                type='search'
                className={` ${
                  showPendaftaran
                    ? 'text-user6 placeholder-user6 border-user6 focus:ring-user6 '
                    : showPengguna
                    ? 'text-user2 placeholder-user2 border-user2 focus:ring-user2 '
                    : showPentadbir
                    ? 'text-admin2 placeholder-admin2 border-admin2 focus:ring-admin2 '
                    : 'text-user1 placeholder-user1 border-user1 focus:ring-user1 '
                }
                w-full h-10 px-5 text-base  border  rounded-full outline-none focus:outline-none focus:ring-1 focus:border-transparent`}
                placeholder={` ${
                  showPendaftaran
                    ? 'Carian Pendaftaran'
                    : showPengguna
                    ? 'Carian Pengguna'
                    : showPentadbir
                    ? 'Carian Pentadbir'
                    : 'Carian'
                }`}
                onChange={(e) => setSearch(e.target.value.toLowerCase())}
              />
              <input
                type='text'
                disabled
                className={` ${
                  showPentadbir || showPendaftaran || showPengguna
                    ? 'hidden'
                    : 'block'
                }
                absolute top-0 left-0 w-full h-10 px-5 text-base text-userWhite bg-user1 placeholder-userWhite border border-user1 rounded-full`}
                placeholder='Carian : Sila Pilih Modul'
              />
            </div>
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
              {pentadbirData
                .filter((item) => item.title.toLowerCase().includes(search))
                .map((item, index) => {
                  return (
                    <article className='my-1' key={index}>
                      <span
                        className='flex text-left text-xs lg:text-base items-center text-adminWhite font-bold bg-admin1 pl-3 p-1 w-full capitalize cursor-pointer'
                        onClick={() => {
                          handleAccordionPentadbir(index);
                        }}
                      >
                        {showSubPentadbir === index ? (
                          <FaMinus className='pt-1' />
                        ) : (
                          <FaPlus className='pt-1' />
                        )}
                        {item.title}
                      </span>
                      <p
                        className={`flex flex-row text-left transition-all bg-user5 pl-3 text-xs lg:text-base font-normal normal-case ${
                          showSubPentadbir === index
                            ? 'max-h-full overflow-y-auto'
                            : 'max-h-0 overflow-hidden'
                        }`}
                      >
                        {item.content}
                      </p>
                    </article>
                  );
                })}
            </article>
            <article
              className={`flex flex-col transition-all col-span-3 bg-kaunter3 bg-opacity-70 rounded-b-md ${
                showPendaftaran
                  ? 'max-h-full overflow-y-auto'
                  : 'max-h-0 overflow-y-hidden'
              } `}
            >
              {pendaftaranData
                .filter((item) => item.title.toLowerCase().includes(search))
                .map((item, index) => {
                  return (
                    <article className='my-1' key={index}>
                      <span
                        className='flex text-left text-xs lg:text-base items-center text-adminWhite font-bold bg-kaunter2 pl-3 p-1 w-full capitalize cursor-pointer'
                        onClick={() => {
                          handleAccordionPendaftaran(index);
                        }}
                      >
                        {showSubPendaftaran === index ? (
                          <FaMinus className='pt-1' />
                        ) : (
                          <FaPlus className='pt-1' />
                        )}
                        {item.title}
                      </span>
                      <p
                        className={`flex flex-row text-left transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                          showSubPendaftaran === index
                            ? 'max-h-full overflow-y-auto'
                            : 'max-h-0 overflow-hidden'
                        } `}
                      >
                        {item.content}
                      </p>
                    </article>
                  );
                })}
            </article>
            <article
              className={`flex flex-col transition-all col-span-3 bg-user5 bg-opacity-70 rounded-b-md ${
                showPengguna
                  ? 'max-h-full overflow-y-auto'
                  : 'max-h-0 overflow-y-hidden'
              } `}
            >
              {penggunaData
                .filter((item) => item.title.toLowerCase().includes(search))
                .map((item, index) => {
                  return (
                    <article className='my-1' key={index}>
                      <span
                        className='flex text-left text-xs lg:text-base items-center text-adminWhite font-semibold bg-user3 pl-3 p-1 w-full capitalize cursor-pointer'
                        onClick={() => {
                          handleAccordionPengguna(index);
                        }}
                      >
                        {showSubPengguna === index ? (
                          <FaMinus className='pt-1' />
                        ) : (
                          <FaPlus className='pt-1' />
                        )}
                        {item.title}
                      </span>
                      <p
                        className={`flex flex-row text-left transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                          showSubPengguna === index
                            ? 'max-h-full overflow-y-auto'
                            : 'max-h-0 overflow-hidden'
                        } `}
                      >
                        {item.content}
                      </p>
                    </article>
                  );
                })}
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

const pentadbirData = [
  {
    id: 1,
    title:
      'Adakah Pentadbir Negeri boleh turut serta menjadi Pentadbir Klinik?',
    content:
      'Boleh, jika Pentadbir Negeri tersebut merupakan PPYM / Sister / JP yang bertugas di Klinik berkenaan',
  },
  {
    id: 2,
    title:
      'Berapa had Pentadbir bagi satu-satu Daerah? Jika lebih dari satu orang Pentadbir, adakah perlu didaftarkan 2 e-mel berbeza?',
    content:
      'Tiada had Pentadbir Daerah. Guna hanya 1 e-mel sahaja yang dikongsi antara Pentadbir Daerah. Key verifikasi akan dihantar ke e-mel tersebut bagi membolehkan Pentadbir Daerah log masuk ke Modul Pentadbir Daerah.',
  },
  {
    id: 3,
    title:
      'Bagaimana nak cipta lebih dari 1 peranan? Contoh peranan Pentadbir Daerah dan juga Pengguna?',
    content:
      'Tidak perlu cipta 2 peranan. Jika Pegawai A adalah Pentadbir Daerah B dan merupakan pegawai yang bertugas di Klinik C, semasa pendaftaran pegawai pergigian di Modul Pentadbir, pilih sebagai Pengguna di Klinik C. Tugas sebagai Pentadbir Daerah adalah mengemaskini data klinik, pegawai pergigian, juruterapi pergigian, taska & tadika dan lain-lain di Modul Pentadbir Daerah.',
  },
  {
    id: 4,
    title:
      'Untuk e-mel pegawai pergigian dan juruterapi pergigian, guna 1 e-mel khas untuk klinik atau e-mel personal ? perlu verification ke semasa pengguna log masuk ?',
    content:
      'Sila guna e-mel personal masing-masing.Kata Laluan bagi Modul Pengguna dan Modul Pendaftaran adalah kata laluan tetap yang diberikan di Modul Pentadbir Daerah. Bagi pengisian reten individu (Pengguna), no. MDC/MDTB akan digunakan. Bagi Pentadbir Klinik, kunci verifikasi akan dihantar ke dalam e-mel Pentadbir Klinik.',
  },
  {
    id: 5,
    title: 'Nama klinik saya salah ejaan',
    content:
      'Nama klinik diambil berdasarkan ejaan di PIK. Sekiranya ada perubahan, mohon untuk membuat pembetulan kepada pihak PIK',
  },
  {
    id: 6,
    title: '1 pegawai boleh didaftarkan di KP utama dan KP Visiting ke?',
    content:
      'Pegawai didaftarkan mengikut klinik utama beliau bertugas. Jika pegawai ke KP Visiting secara berkala (bukan setiap hari & bukan ditetapkan secara tetap di KP Vsiting), pilih sebagai pegawai relief di Modul Pengguna dan pilih nama KP Visiting tersebut.',
  },
  {
    id: 7,
    title: 'Bagaimana cara nak tambah nama dalam senarai juruterapi?',
    content:
      'Jika ada no. MDTB, sila guna butang Tambah di sebelah kanan pada fungsi bar Juruterapi Pergigian di Modul Pentadbir Daerah. Manakala jika tiada no. MDTB, sila tentukan secara manual pemegang JP1 hingga JP5. Juruterapi tersebut perlu mengisi reten mengikut JP1 hingga JP5 seperti yang telah ditetapkan oleh Daerah.',
  },
  {
    id: 8,
    title: 'Berapa orang maksimum untuk Pentadbir Klinik?',
    content:
      '2-3 orang sahaja, PPYM dan Sister/JP yang akan memantau reten klinik',
  },
  {
    id: 9,
    title:
      'Adakah Pentadbir Klinik (PPYM) boleh berperanan sebagai pengguna atau perlu daftar sebagai pengguna ?',
    content:
      'Ya. Pentadbir Klinik secara automatik adalah Pengguna juga. Tidak perlu daftar 2 kali',
  },
  {
    id: 10,
    title:
      'Bolehkah guna semula e-mel pentadbir daerah untuk Klinik Pergigian? atau perlu guna e-mel yang lain?',
    content:
      'Sila guna e-mel berbeza untuk pentadbir daerah dan pentadbir klinik. Kunci verifikasi untuk masuk ke Modul Pentadbir Daerah akan dihantar ke e-mel Pentadbir Daerah.',
  },
];

const pendaftaranData = [
  {
    id: 1,
    title:
      'Bagi klinik yang menggunakan Sistem OHCIS atau TPC OHCIS, masih perlu guna Sistem Gi-Ret 2.0 untuk pendaftaran tahun 2023?',
    content: 'Ya, pesakit perlu didaftarkan di Sistem Gi-Ret 2.0 juga',
  },
  {
    id: 2,
    title:
      'Bagi primer, pendaftaran adalah 100% melalui Sistem Gi-ret 2.0,tak perlu daftar di PG101?',
    content: 'Ya, bagi PG101, ianya boleh dijana melalui sistem Gi-Ret 2.0',
  },

  {
    id: 3,
    title:
      'Bagaimana nak dapatkan kata laluan bagi Modul Pendaftaran? dan adakah kata laluan itu kita boleh tukar sendiri?',
    content:
      'Sila rujuk Pentadbir Daerah untuk mendapatkan kata laluan bagi Modul Pendaftaran dan Modul Pengguna.Buat masa ini, kata laluan kami tidak buka lagi untuk membuat pertukaran.Dalam perancangan, akan ada tatacara yang tertentu bagi menentukan siapa yang bertanggungjawab menukar kata laluan pendaftaran dan pengguna.',
  },
  {
    id: 4,
    title:
      'Jika pesakit pergi dua klinik berbeza dalam hari yang sama, adakah klinik kedua dapat mengesan pesakit tersebut sebagai pesakit ulangan atau perlu daftar sebagai pesakit baru semula?',
    content:
      'Pesakit akan didaftarkan mengikut fasiliti. Jika pesakit tidak pernah datang ke fasiliti tersebut, maka pesakit tersebut dikira pesakit baru.',
  },
  {
    id: 5,
    title: 'Macam mana nak tahu pesakit didaftarkan sebagai baru atau ulangan?',
    content:
      'Sistem akan menentukan sama ada pesakit itu adalah pesakit baru atau ulangan. Pesakit baru mempunyai ikon berwarna hijau di sebelah nombor pendaftaran, manakala warna merah untuk pesakit ulangan.Sila rujuk pada LP8 pesakit juga.',
  },
  {
    id: 6,
    title:
      'Adakah nombor pendaftaran (RN) bagi warganegara berbeza dengan bukan warganegara?',
    content:
      'Nombor pendaftaran (RN) bagi warganegara dan bukan warganegara adalah sama & berturutan.Perbezaan antara dua tersebut hanyalah jenis pengenalan.',
  },
  {
    id: 7,
    title:
      'Bagaimanakah pendaftaran dilakukan jika pesakit tidak mempunyai sebarang pengenalan diri?',
    content: 'Pilih Jenis Pengenalan: Tiada pengenalan yang sah',
  },
  {
    id: 8,
    title:
      'Bagaimanakah pendaftaran bagi pesakit bayi yang tiada surat beranak lagi?',
    content:
      'Pilih jenis pengenalan: Baby of, kemudian masukkan nombor kad pengenalan ibu bayi tersebut.',
  },
  {
    id: 9,
    title:
      'Fungsi auto-fill hanya ada untuk MyKad/MyKid sahaja?Kerana pesakit didaftarkan dengan passport, tiada auto-fill untuk pesakit sama semasa ulangan.',
    content:
      'Nombor passport boleh berubah dan ini menghadkan fungsi auto-fill.Setakat ini, fungsi auto-fill hanya dapat dilakukan untuk jenis pengenalan menggunakan MyKad/MyKid. Namun, kami mengambil maklum perkara ini dan akan melihat semula peluang untuk menambah baik.',
  },
  {
    id: 10,
    title:
      'Status pesakit bersekolah ditanda untuk kategori pesakit umur berapa?',
    content:
      'Kedatangan pesakit yang masih bersekolah (bagi sekolah rendah dan sekolah menengah) perlu ditanda [Bersekolah]. Sila rujuk glosari.',
  },
  {
    id: 11,
    title:
      'Permanent residence (PR) didaftarkan menggunakan IC merah.Macam mana nak tahu dia Bukan Warganegara?',
    content:
      'Mengikut JPN, selagi seseorang yang berada di Malaysia yang memegang MyPR, maka dia masih Bukan Warganegara, sehinggalah pemohon menjadi warganegara diluluskan dan bertukar ke kad pengenalan biru. Maka dalam sistem, buat masa ini, boleh menggunakan jenis pengenalan Passport/MyPR/MyKAS/UNHCR untuk proses daftar di Modul Pendaftaran',
  },
  {
    id: 12,
    title:
      'Jika terdapat kekangan masa untuk pendaftaran, bolehkah maklumat ditambah pada hari keesokannya?',
    content:
      'Bagi Pendaftaran di Klinik Pergigian, pendaftaran WAJIB dilakukan pada hari tersebut bagi mengelakkan kecelaruan nombor pendaftaran pesakit. Pengemaskinian data pesakit di bahagian pendaftaran juga hanya boleh dilakukan pada hari yang sama sahaja.',
  },
  {
    id: 13,
    title: 'Pada ruangan catatan, nombor resit perlu ditulis penuh?',
    content:
      'Ruang catatan tersebut perlu ditulis sebagaimana yang ditulis sebelum ini, mengikut penetapan daerah masing-masing',
  },
  {
    id: 14,
    title:
      'Jika pesakit telah berjaya didaftarkan dalam sistem, adakah data tersebut boleh dihapuskan?',
    content:
      'Hanya pentadbir KP sahaja boleh menghapuskan data tersebut tetapi perlu justifikasi dan alasan yang kukuh supaya tidak menjejaskan kualiti data yang akan dilaporkan',
  },
  {
    id: 15,
    title:
      'Jika pesakit KKIA yang telah didaftarkan dibawah KKIA/KD, dan pesakit tersebut datang semula untuk rawatan untuk rawatan di KP, bagaimanakah pendaftaran dilakukan, adakah nombor pendaftaran sama akan diberi sewaktu pendaftaran di KKIA/KD?',
    content:
      'Sila daftar di Modul Pendaftaran Klinik Pergigian. Nombor pendaftaran pesakit tidak akan sama kerana perbezaan fasiliti.',
  },
  {
    id: 16,
    title:
      'Jika pesakit hadir di KKIA/KD, siapakah yang akan daftar dalam sistem Gi-Ret 2.0?',
    content: 'Anggota pergigian yang membuat pemerikasaan di KKIA/KD',
  },
];

const penggunaData = [
  {
    id: 1,
    title:
      'Pegawai A bertugas sebagai ganti/relief di Klinik Pergigian B, bagaimanakah cara untuk memasukkan reten?',
    content:
      'Pegawai A perlu membuka Modul Pengguna beliau & tick sebagai pegawai relief, seterusnya pilih nama Klinik B untuk membuat pengisian reten pegawai.',
  },
  {
    id: 2,
    title: 'Klinik visiting yang tiada pegawai, adakah perlu tick relief?',
    content:
      'Ya betul, kerana tiada pegawai yang berada di klinik tersebut. Maka pegawai yang relief perlu sign in di klinik asalnya, dan tick relief, kemudian pilih klinik visiting tersebut.',
  },
  {
    id: 3,
    title: 'Apakah maksud tempoh 3 hari memasukkan data?',
    content:
      'Tempoh memasukkan data adalah 3 hari bekerja untuk memasukkan data di Modul Pengguna, termasuk hari pesakit diperiksa. Data masih WAJIB dimasukkan pada hari ke-4 tetapi tidak akan dikira ke dalam laporan. Maka komitmen bagi memasukkan data secara terus adalah amat digalakan bagi mengelakkan kehilangan data.',
  },
  {
    id: 4,
    title: '3 hari pengisian data termasuk Sabtu & Ahad?',
    content:
      '3 HARI BEKERJA mengikut negeri yang bekerja pada hari Jumaat dan Ahad.',
  },
  {
    id: 5,
    title:
      'Bagi negeri yang bercuti pada Sabtu & ahad, pesakit datang pada hari Jumaat, maka pengisian data boleh di-isi sehingga Rabu?',
    content:
      'Pendaftaran di Modul Pendaftaran mesti dibuat terus pada Jumaat, iaitu hari yang sama pesakit datang ke klinik.Manakala bagi pengisian data pemeriksaan/rawatan pesakit pula, dibenerkan sehingga hari selasa sahaja(3 hari)',
  },
  {
    id: 6,
    title: 'Adakah sistem Gi-Ret 2.0 mempunyai fungsi autosave?',
    content: 'Sistem ini tidak mempunyai fungsi autosave.',
  },
  {
    id: 7,
    title:
      'Bagaimanakah jika pesakit baru diperiksa oleh Dr A/JP A, tetapi dirujuk untuk membuat rawatan kepada Dr B di klinik yang sama?',
    content:
      'Pihak pembangun telah membuat penambahbaikan kepada sistem ini. Dr A/JP A perlu mengisi ruang pemeriksaan dan klinik pada check box di ruang rawatan: Rawatan Dibuat Oleh Operator Lain (pada hari yang sama sahaja) dan tekan butang hantar. Apabila Dr B membuka Modul Pengguna, beliau boleh memilih pesakit yang sama untuk mengisi rawatan yang telah dijalankan pada hari tersebut.',
  },
  {
    id: 8,
    title: 'Adakah reten BP dan reten BPE boleh dijana dari Sistem Gi-Ret 2.0?',
    content: 'Reten BPE DAN BP boleh dijana melalui Sistem Gi-Ret 2.0',
  },
  {
    id: 9,
    title:
      'Jika berlaku pertukaran maklumat (sebagai contoh: pertambahan karies/sejarah perubatan), bagaimanakah hendak mengemaskini semasa kedatangan ulangan?',
    content:
      'Maklumat tersebut perlu dikemaskini dalam kad rawatan LP8 sahaja, tidak perlu dikemaskini dalam Sistem Gi-Ret 2.0',
  },
  {
    id: 10,
    title:
      'Sekiranya terdapat kesalahan mengisi ruangan rawatan pesakit selepas klik dihantar, adakah boleh dikemaskini semula?',
    content:
      'Reten yang telah di-isi di Modul Pengguna, TIDAK BOLEH dikemaskini lagi. Sila peka terhadap data sebelum klik butang Hantar.',
  },
  {
    id: 11,
    title:
      'Apakah maksud KEPP? dan adakah Tingkatan 6 termasuk dalam kategori bersekolah?',
    content:
      'KEPP bermaksud Klinik Endodontik Pergigian Primer, manakala Tingkatan 6 termasuk dalam kategori dewasa muda',
  },
  {
    id: 12,
    title:
      'Untuk pesakit yang sudah diclaim kes selesai dan pesakit datang semula pada hari yang lain, adakah pengisian rawatan dibenarkan?',
    content:
      'Pengisian rawatan dibenarkan dan dikira ulangan , namun tidak dibenarkan untuk claim kes selesai sekali lagi ',
  },
  {
    id: 13,
    title:
      'Bagi kes Endodontik, sekiranya rawatan pada hari tersebut adalah [cleaning and shaping], bagaimanakah pengisian rawatan dibuat? kerana hanya kes selesai endodontik sahaja ada dalam pilihan.',
    content:
      'Untuk langkah [cleaning and shaping], pegawai perlu claim rawatan tampalan sementara. Rawatan endodontik dipilih sekiranya obturation telah selesai dibuat',
  },
  {
    id: 14,
    title: 'Bagi sapuan florida, tiada pilihan untuk sapuan ke-berapa?',
    content: 'Tiada, Reten FV Kohort akan dimasukkan di dalam fasa seterusnya.',
  },
  {
    id: 15,
    title: 'Mengapakah tiada butang hapus di dalam Modul Pengguna?',
    content:
      'Butang hapus hanya didapati oleh Pentadbir Klinik sahaja, di Modul Pengguna.',
  },
  {
    id: 16,
    title:
      'Jika tiada pilihan rawatan yang boleh di-isi seperti yang ada di dalam glosari, bolehkan klik butang hantar tanpa mengisi ruang rawatan?',
    content:
      'Boleh, dan jika ada memberikan Nasihat Kesihatan Pergigian Individu, boleh isi ruangan ini. Jika tiada, abaikan.',
  },
  {
    id: 17,
    title: 'Siapakah yang perlu tutup & compile reten pada hujung bulan?',
    content:
      'Sistem Gi-Ret 2.0 diwujudkan untuk mengurangkan beban compile reten. Reten tidak perlu ditutup atau dikumpulkan oleh sesiapa kerana reten boleh dijana secara automatik',
  },
  {
    id: 18,
    title:
      'Adakah sistem Gi-RET 2.0 boleh menjana reten individu supaya datanya boleh digunakan bagi pengisian SKU?',
    content:
      'Data individu boleh dijana melalui pentadbir daerah di Modul Pentadbir',
  },
];

export default Faq;
