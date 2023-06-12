import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { FaWindowClose, FaRegPaperPlane, FaYinYang } from 'react-icons/fa';

import { useGlobalUserAppContext } from '../../context/userAppContext';

function UserTambahKemaskiniPelajarSekolah({
  modalTambahKemaskiniPelajar,
  setModalTambahKemaskiniPelajar,
  kemaskiniPelajarId,
  setKemaskiniPelajarId,
  submittingTambahPelajar,
  setSubmittingTambahPelajar,
  reloadState,
  setReloadState,
  dataFromPilihanTahunTingkatan,
}) {
  const {
    userToken,
    userinfo,
    reliefUserToken,
    masterDatePicker,
    toast,
    dateToday,
  } = useGlobalUserAppContext();

  const [singlePersonSekolah, setSinglePersonSekolah] = useState([]);

  //form
  const [showForm, setShowForm] = useState(false);
  const [nomborId, setNomborId] = useState('');
  const [nama, setNama] = useState('');
  const [jantina, setJantina] = useState('');
  const [statusOku, setStatusOku] = useState('');
  const [tarikhLahir, setTarikhLahir] = useState('');
  const [umur, setUmur] = useState('');
  const [keturunan, setKeturunan] = useState('');
  const [warganegara, setWarganegara] = useState('');

  //datepicker issues
  const [tarikhLahirDP, setTarikhLahirDP] = useState(null);

  const TarikhLahir = () => {
    return masterDatePicker({
      selected: tarikhLahirDP,
      required: true,
      onChange: (tarikhLahir) => {
        const tempDate = moment(tarikhLahir).format('YYYY-MM-DD');
        const tahun = parseInt(getAge(tarikhLahir));
        setTarikhLahir(tempDate);
        setTarikhLahirDP(tarikhLahir);
        setUmur(tahun);
      },
      filterDate: (date) => {
        return moment() > date;
      },
      className:
        'appearance-none text-sm uppercase w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent',
    });
  };

  const getAge = (date) => {
    const years =
      parseInt(moment().format('YYYY')) - parseInt(moment(date).format('YYYY'));
    return years;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmittingTambahPelajar(true);
    // if (!kemaskiniPelajarId) {
    const {
      idInstitusi,
      kodSekolah,
      namaSekolah,
      sesiTakwimPelajar,
      tahunTingkatan,
    } = dataFromPilihanTahunTingkatan;

    if (umur <= 4) {
      toast.error('Umur pelajar tidak boleh kurang dari 4 tahun', {
        autoClose: 3000,
      });
      return;
    }

    await toast
      .promise(
        axios.post(
          '/api/v1/sekolah',
          {
            idInstitusi,
            kodSekolah,
            namaSekolah,
            //
            nomborId,
            nama: nama.toUpperCase(),
            sesiTakwimPelajar,
            tahunTingkatan,
            jantina,
            statusOku,
            tarikhLahir,
            umur,
            keturunan: keturunan.toUpperCase(),
            warganegara,
          },
          {
            headers: {
              Authorization: `Bearer ${
                reliefUserToken ? reliefUserToken : userToken
              }`,
            },
          }
        ),
        {
          pending: 'Sedang menambah pelajar',
          success: 'Berjaya menambah pelajar',
          error: {
            render({ data }) {
              if (data.response.status === 409) {
                return data.response.data.msg;
              } else {
                return 'Gagal menambah pelajar';
              }
            },
          },
        },
        { autoClose: 5000 }
      )
      .then(() => {
        setReloadState(!reloadState);
        setSubmittingTambahPelajar(false);
        setModalTambahKemaskiniPelajar(false);
      })
      .catch((err) => {
        console.log(err);
        // setReloadState(!reloadState);
        setSubmittingTambahPelajar(false);
        // setModalTambahKemaskiniPelajar(false);
      });
    // }

    // if (kemaskiniPelajarId) {
    //   await toast
    //     .promise(
    //       axios.patch(
    //         `/api/v1/sekolah/ubah/${kemaskiniPelajarId}`,
    //         {
    //           nomborId,
    //           nama: nama.toUpperCase(),
    //           jantina,
    //           statusOku,
    //           tarikhLahir,
    //           umur,
    //           keturunan: keturunan.toUpperCase(),
    //           warganegara,
    //         },
    //         {
    //           headers: {
    //             Authorization: `Bearer ${
    //               reliefUserToken ? reliefUserToken : userToken
    //             }`,
    //           },
    //         }
    //       ),
    //       {
    //         pending: 'Sedang mengemaskini pelajar',
    //         success: 'Berjaya mengemaskini pelajar',
    //         error: {
    //           render({ data }) {
    //             if (data.response.status === 409) {
    //               return data.response.data.msg;
    //             } else {
    //               return 'Gagal mengemaskini pelajar';
    //             }
    //           },
    //         },
    //       },
    //       { autoClose: 5000 }
    //     )
    //     .then(() => {
    //       setReloadState(!reloadState);
    //       setSubmittingTambahPelajar(false);
    //       setModalTambahKemaskiniPelajar(false);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       // setReloadState(!reloadState);
    //       setSubmittingTambahPelajar(false);
    //       // setModalTambahKemaskiniPelajar(false);
    //     });
    // }
  };

  // fetch singlePersonSekolah to edit if kemaskiniPelajarId === true
  // useEffect(() => {
  //   if (kemaskiniPelajarId) {
  //     const fetchSinglePersonSekolah = async () => {
  //       try {
  //         const { data } = await axios.get(
  //           `/api/v1/sekolah/${kemaskiniPelajarId}`,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${
  //                 reliefUserToken ? reliefUserToken : userToken
  //               }`,
  //             },
  //           }
  //         );
  //         setSinglePersonSekolah(data.singlePersonSekolah);

  //         setNama(data.singlePersonSekolah.nama);
  //         setNomborId(data.singlePersonSekolah.nomborId);
  //         setStatusOku(data.singlePersonSekolah.statusOku);
  //         setTarikhLahir(data.singlePersonSekolah.tarikhLahir);
  //         setTarikhLahirDP(new Date(data.singlePersonSekolah.tarikhLahir));
  //         setJantina(data.singlePersonSekolah.jantina);
  //         setUmur(data.singlePersonSekolah.umur);
  //         setKeturunan(data.singlePersonSekolah.keturunan);
  //         setWarganegara(data.singlePersonSekolah.warganegara);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     };
  //     fetchSinglePersonSekolah();
  //   }
  // }, [kemaskiniPelajarId]);

  const closeModal = () => {
    setModalTambahKemaskiniPelajar(false);
    setKemaskiniPelajarId('');
    setShowForm(false);
  };

  return (
    <>
      <div className='absolute z-10 inset-x-1 lg:inset-x-1/4 inset-y-7 bg-userWhite text-user1 rounded-md shadow-md overflow-y-auto'>
        <FaWindowClose
          onClick={closeModal}
          className='absolute mr-1 mt-1 text-xl text-userBlack right-0 hover:cursor-pointer hover:text-user2 transition-all'
        />
        <form
          onSubmit={handleSubmit}
          className='grid grid-rows-[1fr_8fr_1fr] h-full'
        >
          <h5 className='bg-user3 text-userWhite font-semibold text-xl h-7'>
            {kemaskiniPelajarId ? 'Kemaskini Pelajar' : 'Tambah Pelajar'}
          </h5>
          {kemaskiniPelajarId && !showForm ? (
            <div className='mt-1 py-1'>
              <p className='flex justify-center text-lg font-bold p-3'>
                Anda pasti untuk mengemaskini pelajar ini?
              </p>
              <div className='grid grid-cols-[1fr_2fr]'>
                <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                  Nama
                </p>
                <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                  {singlePersonSekolah.nama}
                </p>
                <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                  Nombor Kad Pengenalan
                </p>
                <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                  {singlePersonSekolah.nomborId}
                </p>
                <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                  Tarikh Lahir
                </p>
                <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                  {moment(singlePersonSekolah.tarikhLahir).format('DD/MM/YYYY')}
                </p>
                <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                  Jantina
                </p>
                <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                  {singlePersonSekolah.jantina}
                </p>
                <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                  Umur
                </p>
                <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                  {singlePersonSekolah.umur}
                </p>
                <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                  Tahun / Tingkatan
                </p>
                <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                  {singlePersonSekolah.tahunTingkatan}
                </p>
                <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                  warganegara
                </p>
                <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                  {singlePersonSekolah.warganegara}
                </p>
                <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                  Status Rawatan
                </p>
                <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10 uppercase'>
                  {singlePersonSekolah.statusRawatan}
                </p>
              </div>
            </div>
          ) : (
            !showForm && (
              <div className='mt-1 py-1'>
                <p className='flex justify-center text-lg font-bold p-3'>
                  Pendaftaran ini adalah untuk pelajar di sekolah dan tahun /
                  tingkatan ini
                </p>
                <div className='grid grid-cols-[1fr_2fr]'>
                  <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                    Nama Sekolah
                  </p>
                  <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                    {dataFromPilihanTahunTingkatan.namaSekolah}
                  </p>
                  <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                    Takwim Pelajar
                  </p>
                  <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                    {dataFromPilihanTahunTingkatan.sesiTakwimPelajar}
                  </p>
                  <p className='text-xs p-1 flex justify-end text-right bg-user1 bg-opacity-5'>
                    Tahun / Tingkatan
                  </p>
                  <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                    {dataFromPilihanTahunTingkatan.tahunTingkatan}
                  </p>
                </div>
              </div>
            )
          )}
          {showForm && (
            <div className='mt-1 py-1'>
              <div className='px-2 grid grid-cols-2 gap-2'>
                <h1 className='col-span-2 text-base uppercase font-bold text-center text-user1 bg-userWhite rounded-md'>
                  Sila isi semua maklumat murid
                </h1>
                <div className='relative'>
                  <label
                    htmlFor='nama'
                    className='text-sm text-left text-user1 bg-userWhite flex rounded-md'
                  >
                    Nama<span className='font-semibold text-user6'>*</span>
                  </label>
                  <input
                    required
                    type='text'
                    name='nama'
                    id='nama'
                    placeholder=' '
                    className='appearance-none text-sm uppercase w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                    value={nama}
                    onChange={(e) => {
                      setNama(e.target.value);
                    }}
                  />
                </div>
                <div className='relative'>
                  <label
                    htmlFor='warganegara'
                    className='text-sm text-left text-user1 bg-userWhite flex rounded-md'
                  >
                    Warganegara
                    <span className='font-semibold text-user6'>*</span>
                  </label>
                  <select
                    required
                    name='warganegara'
                    id='warganegara'
                    placeholder=' '
                    className='appearance-none text-sm w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                    value={warganegara}
                    onChange={(e) => {
                      setWarganegara(e.target.value);
                    }}
                  >
                    <option value=''>Sila Pilih</option>
                    <option value='MALAYSIA'>MALAYSIA</option>
                    <option value='BUKAN WARGANEGARA'>BUKAN WARGANEGARA</option>
                    {kemaskiniPelajarId && warganegara !== 'MALAYSIA' && (
                      <option value={warganegara}>{warganegara}</option>
                    )}
                  </select>
                </div>
                <div className='relative'>
                  <label
                    htmlFor='nomborId'
                    className='text-sm text-left text-user1 bg-userWhite flex rounded-md'
                  >
                    Nombor Kad Pengenalan
                    <span className='font-semibold text-user6'>*</span>
                  </label>
                  {warganegara === 'MALAYSIA' ? (
                    <input
                      disabled={warganegara === '' ? true : false}
                      type='text'
                      name='nomborId'
                      id='nomborId'
                      placeholder=' '
                      pattern='[0-9]+'
                      title='12 numbers MyKad / MyKid'
                      minLength={12}
                      maxLength={12}
                      className='appearance-none text-sm w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                      value={nomborId}
                      onChange={(e) => {
                        setNomborId(e.target.value);
                        // handleIc(e.target.value);
                      }}
                    />
                  ) : (
                    <input
                      disabled={warganegara === '' ? true : false}
                      type='text'
                      name='nomborId'
                      id='nomborId'
                      placeholder=' '
                      className='appearance-none text-sm w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                      value={nomborId}
                      onChange={(e) => {
                        setNomborId(e.target.value);
                      }}
                    />
                  )}
                </div>
                <div className='relative'>
                  <label
                    htmlFor='tarikhLahir'
                    className='text-sm text-left text-user1 bg-userWhite flex rounded-md'
                  >
                    Tarikh Lahir
                    <span className='font-semibold text-user6'>*</span>
                  </label>
                  <TarikhLahir />
                </div>
                <div className='relative '>
                  <label
                    htmlFor='umur'
                    className='text-sm text-left text-user1 bg-userWhite flex rounded-md'
                  >
                    Umur
                  </label>
                  {/* <label
                      htmlFor='umurBulan'
                      className='text-sm text-left text-user1 bg-userWhite flex rounded-md'
                    >
                      Bulan
                    </label>
                    <label
                      htmlFor='umurHari'
                      className='text-sm text-left text-user1 bg-userWhite flex rounded-md'
                    >
                      Hari
                    </label> */}
                  <input
                    disabled
                    type='number'
                    name='umur'
                    id='umur'
                    placeholder=' '
                    className='appearance-none text-sm w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                    value={umur}
                  />
                  {/* <input
                      disabled
                      type='number'
                      name='umurBulan'
                      id='umurBulan'
                      placeholder=' '
                      className='appearance-none w-full px-2 py-1 text-user1 border border-user1 shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                      value={umurBulan}
                    />
                    <input
                      disabled
                      type='number'
                      name='umurHari'
                      id='umurHari'
                      placeholder=' '
                      className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-r-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                      value={umurHari}
                    /> */}
                </div>
                <div className='relative'>
                  <label
                    htmlFor='jantina'
                    className='text-sm text-left text-user1 bg-userWhite flex rounded-md'
                  >
                    Jantina<span className='font-semibold text-user6'>*</span>
                  </label>
                  <select
                    required
                    name='jantina'
                    id='jantina'
                    className='appearance-none text-sm w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                    value={jantina}
                    onChange={(e) => {
                      setJantina(e.target.value);
                    }}
                  >
                    <option value=''>Sila Pilih</option>
                    <option value='LELAKI'>LELAKI</option>
                    <option value='PEREMPUAN'>PEREMPUAN</option>
                  </select>
                </div>
                <div className='relative'>
                  <label
                    htmlFor='keturunan'
                    className='text-sm text-left text-user1 bg-userWhite flex rounded-md'
                  >
                    Keturunan
                    <span className='font-semibold text-user6'>*</span>
                  </label>
                  <select
                    required
                    name='keturunan'
                    id='keturunan'
                    placeholder=' '
                    className='appearance-none text-sm w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                    value={keturunan}
                    onChange={(e) => {
                      setKeturunan(e.target.value);
                    }}
                  >
                    {keturunanList.map((keturunan) => (
                      <option key={keturunan.id} value={keturunan.value}>
                        {keturunan.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='relative'>
                  <label
                    htmlFor='statusOku'
                    className='text-sm text-left text-user1 bg-userWhite flex rounded-md'
                  >
                    Status OKU
                    <span className='font-semibold text-user6'>*</span>
                  </label>
                  <select
                    required
                    name='statusOku'
                    id='statusOku'
                    placeholder=' '
                    className='appearance-none text-sm w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                    value={statusOku}
                    onChange={(e) => {
                      setStatusOku(e.target.value);
                    }}
                  >
                    <option value=''>Sila Pilih</option>
                    <option value='OKU'>OKU</option>
                    <option value=':'>BUKAN OKU</option>
                    {kemaskiniPelajarId && statusOku !== ':' && (
                      <option value={statusOku}>{statusOku}</option>
                    )}
                  </select>
                </div>
              </div>
            </div>
          )}
          <div className='sticky grid grid-cols-2 bottom-0 right-0 left-0 m-2 mx-10 bg-userWhite px-5 py-2'>
            {showForm ? (
              submittingTambahPelajar ? (
                <span
                  className='capitalize bg-user9 justify-center rounded-md p-2 mr-2 inline-flex cursor-not-allowed'
                  disabled
                >
                  <FaYinYang className='mr-2 my-auto animate-spin' />
                  Menghantar Data
                </span>
              ) : (
                <button
                  type='submit'
                  className='capitalize bg-user2 text-userWhite rounded-md shadow-xl p-2 mr-3 hover:bg-user1 transition-all flex justify-center items-center'
                >
                  Hantar
                  <FaRegPaperPlane className='inline-flex ml-1' />
                </button>
              )
            ) : (
              <span
                className='capitalize bg-user3 text-userWhite rounded-md shadow-xl p-2 mr-3 hover:bg-user1 transition-all flex justify-center items-center cursor-pointer'
                onClick={() => {
                  setShowForm(true);
                }}
              >
                Teruskan
              </span>
            )}
            <span
              className='capitalize bg-userWhite text-userBlack rounded-md p-2 ml-3 hover:bg-user5 transition-all cursor-pointer'
              onClick={closeModal}
            >
              Tidak
            </span>
          </div>
        </form>
      </div>
      <div
        onClick={closeModal}
        className='fixed inset-0 bg-userBlack opacity-50 z-0'
      />
    </>
  );
}

const keturunanList = [
  {
    id: '',
    value: '',
    label: 'Sila Pilih',
  },
  {
    id: '0100',
    value: 'MELAYU',
    label: 'MELAYU',
  },
  {
    id: '0101',
    value: 'BUGIS',
    label: 'BUGIS',
  },
  {
    id: '0102',
    value: 'BOYAN',
    label: 'BOYAN',
  },
  {
    id: '0103',
    value: 'BANJAR',
    label: 'BANJAR',
  },
  {
    id: '0104',
    value: 'JAWA',
    label: 'JAWA',
  },
  {
    id: '0105',
    value: 'JAWI PEKAN',
    label: 'JAWI PEKAN',
  },
  {
    id: '0106',
    value: 'MINANGKABAU',
    label: 'MINANGKABAU',
  },
  {
    id: '0200',
    value: 'CINA',
    label: 'CINA',
  },
  {
    id: '0201',
    value: 'CANTONESE',
    label: 'CANTONESE',
  },
  {
    id: '0202',
    value: 'FOOCHOW',
    label: 'FOOCHOW',
  },
  {
    id: '0203',
    value: 'HAINANESE',
    label: 'HAINANESE',
  },
  {
    id: '0204',
    value: 'HENGHUA',
    label: 'HENGHUA',
  },
  {
    id: '0205',
    value: 'HOKCHIA',
    label: 'HOKCHIA',
  },
  {
    id: '0206',
    value: 'HOKCHIU',
    label: 'HOKCHIU',
  },
  {
    id: '0207',
    value: 'HOKKIEN',
    label: 'HOKKIEN',
  },
  {
    id: '0208',
    value: 'KHEK (HAKKA)',
    label: 'KHEK (HAKKA)',
  },
  {
    id: '0209',
    value: 'KWONGSAI',
    label: 'KWONGSAI',
  },
  {
    id: '0210',
    value: 'TEOCHEW',
    label: 'TEOCHEW',
  },
  {
    id: '0211',
    value: 'KONGFOO',
    label: 'KONGFOO',
  },
  {
    id: '0212',
    value: 'HYLAM',
    label: 'HYLAM',
  },
  {
    id: '0213',
    value: 'KENGCHU',
    label: 'KENGCHU',
  },
  {
    id: '0214',
    value: 'KOCHOU',
    label: 'KOCHOU',
  },
  {
    id: '0300',
    value: 'INDIA',
    label: 'INDIA',
  },
  {
    id: '0301',
    value: 'MALAYALI',
    label: 'MALAYALI',
  },
  {
    id: '0302',
    value: 'PUNJABI',
    label: 'PUNJABI',
  },
  {
    id: '0303',
    value: 'SIKH',
    label: 'SIKH',
  },
  {
    id: '0304',
    value: 'TAMIL',
    label: 'TAMIL',
  },
  {
    id: '0305',
    value: 'TELEGU',
    label: 'TELEGU',
  },
  {
    id: '0306',
    value: 'MALABARI',
    label: 'MALABARI',
  },
  {
    id: '0307',
    value: 'INDIA MUSLIM',
    label: 'INDIA MUSLIM',
  },
  {
    id: '0308',
    value: 'TELUGU',
    label: 'TELUGU',
  },
  {
    id: '0309',
    value: 'ORISSA',
    label: 'ORISSA',
  },
  {
    id: '0400',
    value: 'BANGLADESHI',
    label: 'BANGLADESHI',
  },
  {
    id: '0500',
    value: 'PAKISTANI',
    label: 'PAKISTANI',
  },
  {
    id: '0600',
    value: 'SRI LANKA',
    label: 'SRI LANKA',
  },
  {
    id: '0601',
    value: 'TAMIL SRI LANKA',
    label: 'TAMIL SRI LANKA',
  },
  {
    id: '0602',
    value: 'MELAYU SRI LANKA',
    label: 'MELAYU SRI LANKA',
  },
  {
    id: '0603',
    value: 'SINHALESE',
    label: 'SINHALESE',
  },
  {
    id: '0604',
    value: 'CEYLONESE',
    label: 'CEYLONESE',
  },
  {
    id: '0700',
    value: 'INDONESIA',
    label: 'INDONESIA',
  },
  {
    id: '0701',
    value: 'TIDUNG',
    label: 'TIDUNG',
  },
  {
    id: '0800',
    value: 'ETNIK SABAH',
    label: 'ETNIK SABAH',
  },
  {
    id: '0801',
    value: 'BAJAU',
    label: 'BAJAU',
  },
  {
    id: '0802',
    value: 'DUSUN',
    label: 'DUSUN',
  },
  {
    id: '0803',
    value: 'KADAZAN',
    label: 'KADAZAN',
  },
  {
    id: '0804',
    value: 'MURUT',
    label: 'MURUT',
  },
  {
    id: '0805',
    value: 'SINO-NATIVE',
    label: 'SINO-NATIVE',
  },
  {
    id: '0806',
    value: 'SULUK',
    label: 'SULUK',
  },
  {
    id: '0807',
    value: 'TIDUNG',
    label: 'TIDUNG',
  },
  {
    id: '0901',
    value: 'BINADAN',
    label: 'BINADAN',
  },
  {
    id: '0902',
    value: 'BISAYA',
    label: 'BISAYA',
  },
  {
    id: '0903',
    value: 'BONGOL',
    label: 'BONGOL',
  },
  {
    id: '0904',
    value: 'BRUNEI',
    label: 'BRUNEI',
  },
  {
    id: '0905',
    value: 'DUMPAS',
    label: 'DUMPAS',
  },
  {
    id: '0906',
    value: 'IRANUN',
    label: 'IRANUN',
  },
  {
    id: '0907',
    value: 'IDAHAN',
    label: 'IDAHAN',
  },
  {
    id: '0908',
    value: 'KWIJAU',
    label: 'KWIJAU',
  },
  {
    id: '0909',
    value: 'KEDAYAN',
    label: 'KEDAYAN',
  },
  {
    id: '0910',
    value: 'LINGKABAU',
    label: 'LINGKABAU',
  },
  {
    id: '0911',
    value: 'LUNDAYEH',
    label: 'LUNDAYEH',
  },
  {
    id: '0912',
    value: 'LASAU',
    label: 'LASAU',
  },
  {
    id: '0913',
    value: 'MELANAU',
    label: 'MELANAU',
  },
  {
    id: '0914',
    value: 'MANGKAAK',
    label: 'MANGKAAK',
  },
  {
    id: '0915',
    value: 'MATAGANG',
    label: 'MATAGANG',
  },
  {
    id: '0916',
    value: 'MINOKOK',
    label: 'MINOKOK',
  },
  {
    id: '0917',
    value: 'MELAYU SABAH',
    label: 'MELAYU SABAH',
  },
  {
    id: '0918',
    value: 'MOMOGUN',
    label: 'MOMOGUN',
  },
  {
    id: '0919',
    value: 'PAITAN',
    label: 'PAITAN',
  },
  {
    id: '0920',
    value: 'RUMANAU',
    label: 'RUMANAU',
  },
  {
    id: '0921',
    value: 'RUNGUS',
    label: 'RUNGUS',
  },
  {
    id: '0922',
    value: 'SUNGAI',
    label: 'SUNGAI',
  },
  {
    id: '0923',
    value: 'SONSONGAN',
    label: 'SONSONGAN',
  },
  {
    id: '0924',
    value: 'SINULIHAN',
    label: 'SINULIHAN',
  },
  {
    id: '0925',
    value: 'TOMBONUO',
    label: 'TOMBONUO',
  },
  {
    id: '0926',
    value: 'TAGAL',
    label: 'TAGAL',
  },
  {
    id: '0927',
    value: 'TINAGAS',
    label: 'TINAGAS',
  },
  {
    id: '0928',
    value: 'COCOS',
    label: 'COCOS',
  },
  {
    id: '0929',
    value: 'KIMARAGANG',
    label: 'KIMARAGANG',
  },
  {
    id: '0930',
    value: 'BOLONGAN',
    label: 'BOLONGAN',
  },
  {
    id: '0931',
    value: 'BUTON',
    label: 'BUTON',
  },
  {
    id: '0932',
    value: 'KAGAYAN',
    label: 'KAGAYAN',
  },
  {
    id: '0933',
    value: 'BALABAK',
    label: 'BALABAK',
  },
  {
    id: '0934',
    value: 'KADAZAN-SINO',
    label: 'KADAZAN-SINO',
  },
  {
    id: '0935',
    value: 'DUSUN-SINO',
    label: 'DUSUN-SINO',
  },
  {
    id: '0936',
    value: 'BAJAU-SINO',
    label: 'BAJAU-SINO',
  },
  {
    id: '0937',
    value: 'MURUT-SINO',
    label: 'MURUT-SINO',
  },
  {
    id: '0938',
    value: 'BRUNEI-SINO',
    label: 'BRUNEI-SINO',
  },
  {
    id: '0939',
    value: 'RUNGUS-SINO',
    label: 'RUNGUS-SINO',
  },
  {
    id: '0940',
    value: 'BISAYA-SINO',
    label: 'BISAYA-SINO',
  },
  {
    id: '0941',
    value: 'IDAHAN-SINO',
    label: 'IDAHAN-SINO',
  },
  {
    id: '0942',
    value: 'IRANUN-SINO',
    label: 'IRANUN-SINO',
  },
  {
    id: '0943',
    value: 'KEDAYAN-SINO',
    label: 'KEDAYAN-SINO',
  },
  {
    id: '0944',
    value: 'SUNGAI-SINO',
    label: 'SUNGAI-SINO',
  },
  {
    id: '0945',
    value: 'LUNDAYEH-SINO',
    label: 'LUNDAYEH-SINO',
  },
  {
    id: '0946',
    value: 'SULUK-SINO',
    label: 'SULUK-SINO',
  },
  {
    id: '0947',
    value: 'TIDUNG-SINO',
    label: 'TIDUNG-SINO',
  },
  {
    id: '0948',
    value: 'BOLONGAN-SINO',
    label: 'BOLONGAN-SINO',
  },
  {
    id: '0949',
    value: 'BALABAK-SINO',
    label: 'BALABAK-SINO',
  },
  {
    id: '1000',
    value: 'BUMIPUTERA',
    label: 'BUMIPUTERA',
  },
  {
    id: '1001',
    value: 'MELAYU',
    label: 'MELAYU',
  },
  {
    id: '1002',
    value: 'MELANAU',
    label: 'MELANAU',
  },
  {
    id: '1003',
    value: 'KEDAYAN',
    label: 'KEDAYAN',
  },
  {
    id: '1004',
    value: 'IBAN ATAU SEA DAYAK',
    label: 'IBAN ATAU SEA DAYAK',
  },
  {
    id: '1005',
    value: 'BIDAYUH ATAU LAND DAYAK',
    label: 'BIDAYUH ATAU LAND DAYAK',
  },
  {
    id: '1006',
    value: 'KAYAN',
    label: 'KAYAN',
  },
  {
    id: '1007',
    value: 'KENYAH',
    label: 'KENYAH',
  },
  {
    id: '1008',
    value: 'MURUT ATAU LUN BAWANG',
    label: 'MURUT ATAU LUN BAWANG',
  },
  {
    id: '1009',
    value: 'KELABIT',
    label: 'KELABIT',
  },
  {
    id: '1010',
    value: 'PUNAN',
    label: 'PUNAN',
  },
  {
    id: '1011',
    value: 'PENAN',
    label: 'PENAN',
  },
  {
    id: '1012',
    value: 'TRING',
    label: 'TRING',
  },
  {
    id: '1013',
    value: 'LOGAT',
    label: 'LOGAT',
  },
  {
    id: '1014',
    value: 'BAH MALI',
    label: 'BAH MALI',
  },
  {
    id: '1015',
    value: 'NAROM',
    label: 'NAROM',
  },
  {
    id: '1016',
    value: 'BAKONG',
    label: 'BAKONG',
  },
  {
    id: '1017',
    value: 'MIRIEK',
    label: 'MIRIEK',
  },
  {
    id: '1018',
    value: 'DALI',
    label: 'DALI',
  },
  {
    id: '1019',
    value: 'SEGAN',
    label: 'SEGAN',
  },
  {
    id: '1101',
    value: 'BISAYA',
    label: 'BISAYA',
  },
  {
    id: '1102',
    value: 'BERAWAN',
    label: 'BERAWAN',
  },
  {
    id: '1103',
    value: 'BELOT',
    label: 'BELOT',
  },
  {
    id: '1104',
    value: 'BHUKETATAU UKIT',
    label: 'BHUKETATAU UKIT',
  },
  {
    id: '1105',
    value: 'BALAU',
    label: 'BALAU',
  },
  {
    id: '1106',
    value: 'BATANG AI',
    label: 'BATANG AI',
  },
  {
    id: '1107',
    value: 'BATU ELAH',
    label: 'BATU ELAH',
  },
  {
    id: '1108',
    value: 'BAKETAN',
    label: 'BAKETAN',
  },
  {
    id: '1109',
    value: 'BINTULU',
    label: 'BINTULU',
  },
  {
    id: '1110',
    value: 'BADENG',
    label: 'BADENG',
  },
  {
    id: '1111',
    value: 'DUSUN',
    label: 'DUSUN',
  },
  {
    id: '1112',
    value: 'JAGOI',
    label: 'JAGOI',
  },
  {
    id: '1113',
    value: 'LAKIPUT',
    label: 'LAKIPUT',
  },
  {
    id: '1114',
    value: 'KAJANG',
    label: 'KAJANG',
  },
  {
    id: '1115',
    value: 'KEJAMAN',
    label: 'KEJAMAN',
  },
  {
    id: '1116',
    value: 'KANOWIT',
    label: 'KANOWIT',
  },
  {
    id: '1117',
    value: 'LIRONG',
    label: 'LIRONG',
  },
  {
    id: '1118',
    value: 'LEMANAK',
    label: 'LEMANAK',
  },
  {
    id: '1119',
    value: 'LAHANAN',
    label: 'LAHANAN',
  },
  {
    id: '1120',
    value: 'LISUM ATAU LUGUM',
    label: 'LISUM ATAU LUGUM',
  },
  {
    id: '1121',
    value: 'MATU',
    label: 'MATU',
  },
  {
    id: '1122',
    value: 'MEMALOH',
    label: 'MEMALOH',
  },
  {
    id: '1123',
    value: 'MELIKIN',
    label: 'MELIKIN',
  },
  {
    id: '1124',
    value: 'MELAING',
    label: 'MELAING',
  },
  {
    id: '1125',
    value: 'NGORIK ATAU MUREK',
    label: 'NGORIK ATAU MUREK',
  },
  {
    id: '1126',
    value: 'MENONDO',
    label: 'MENONDO',
  },
  {
    id: '1127',
    value: 'JAMOK',
    label: 'JAMOK',
  },
  {
    id: '1128',
    value: 'SEBOP',
    label: 'SEBOP',
  },
  {
    id: '1129',
    value: 'SEDUAN',
    label: 'SEDUAN',
  },
  {
    id: '1130',
    value: 'SEKAPAN',
    label: 'SEKAPAN',
  },
  {
    id: '1131',
    value: 'SEGALANG',
    label: 'SEGALANG',
  },
  {
    id: '1132',
    value: 'SIHAN',
    label: 'SIHAN',
  },
  {
    id: '1133',
    value: 'SEPING',
    label: 'SEPING',
  },
  {
    id: '1134',
    value: 'SARIBAS',
    label: 'SARIBAS',
  },
  {
    id: '1135',
    value: 'SEBUYAU',
    label: 'SEBUYAU',
  },
  {
    id: '1136',
    value: 'SKRANG',
    label: 'SKRANG',
  },
  {
    id: '1137',
    value: 'SABAN',
    label: 'SABAN',
  },
  {
    id: '1138',
    value: 'SELAKAN',
    label: 'SELAKAN',
  },
  {
    id: '1139',
    value: 'SELAKO',
    label: 'SELAKO',
  },
  {
    id: '1140',
    value: 'TAGAL',
    label: 'TAGAL',
  },
  {
    id: '1141',
    value: 'TABUN',
    label: 'TABUN',
  },
  {
    id: '1142',
    value: 'TUTONG',
    label: 'TUTONG',
  },
  {
    id: '1143',
    value: 'TANJONG',
    label: 'TANJONG',
  },
  {
    id: '1144',
    value: 'TATAU',
    label: 'TATAU',
  },
  {
    id: '1145',
    value: 'TAUP',
    label: 'TAUP',
  },
  {
    id: '1146',
    value: 'UKIT',
    label: 'UKIT',
  },
  {
    id: '1147',
    value: 'UNKOP',
    label: 'UNKOP',
  },
  {
    id: '1148',
    value: 'ULU AI',
    label: 'ULU AI',
  },
  {
    id: '1149',
    value: 'TORAJA',
    label: 'TORAJA',
  },
  {
    id: '1150',
    value: 'TIMOR',
    label: 'TIMOR',
  },
  {
    id: '1151',
    value: 'MENADO',
    label: 'MENADO',
  },
  {
    id: '1152',
    value: 'MANURA',
    label: 'MANURA',
  },
  {
    id: '1153',
    value: 'BATAK',
    label: 'BATAK',
  },
  {
    id: '1154',
    value: 'PATHAN',
    label: 'PATHAN',
  },
  {
    id: '1155',
    value: 'TONGANS',
    label: 'TONGANS',
  },
  {
    id: '1200',
    value: 'ORANG ASLI (SEMENANJUNG)',
    label: 'ORANG ASLI (SEMENANJUNG)',
  },
  {
    id: '1201',
    value: 'JAKUN',
    label: 'JAKUN',
  },
  {
    id: '1202',
    value: 'NEGRITO',
    label: 'NEGRITO',
  },
  {
    id: '1203',
    value: 'SAKAI',
    label: 'SAKAI',
  },
  {
    id: '1204',
    value: 'SEMAI',
    label: 'SEMAI',
  },
  {
    id: '1205',
    value: 'SEMALAI',
    label: 'SEMALAI',
  },
  {
    id: '1206',
    value: 'TEMIAR',
    label: 'TEMIAR',
  },
  {
    id: '1207',
    value: 'SENOI',
    label: 'SENOI',
  },
  {
    id: '1300',
    value: 'LAIN-LAIN ASIA',
    label: 'LAIN-LAIN ASIA',
  },
  {
    id: '1301',
    value: 'ARAB',
    label: 'ARAB',
  },
  {
    id: '1302',
    value: 'BURMESE',
    label: 'BURMESE',
  },
  {
    id: '1303',
    value: 'EURASIAN',
    label: 'EURASIAN',
  },
  {
    id: '1304',
    value: 'FIJIAN',
    label: 'FIJIAN',
  },
  {
    id: '1305',
    value: 'FILIPINO',
    label: 'FILIPINO',
  },
  {
    id: '1306',
    value: 'GURKHA',
    label: 'GURKHA',
  },
  {
    id: '1307',
    value: 'JAPANESE',
    label: 'JAPANESE',
  },
  {
    id: '1308',
    value: 'KHMER',
    label: 'KHMER',
  },
  {
    id: '1309',
    value: 'KOREAN',
    label: 'KOREAN',
  },
  {
    id: '1310',
    value: 'MALTESE',
    label: 'MALTESE',
  },
  {
    id: '1311',
    value: 'PORTUGESE',
    label: 'PORTUGESE',
  },
  {
    id: '1312',
    value: 'THAI',
    label: 'THAI',
  },
  {
    id: '1313',
    value: 'VIETNAMESE',
    label: 'VIETNAMESE',
  },
  {
    id: '1314',
    value: 'IRANIAN',
    label: 'IRANIAN',
  },
  {
    id: '1315',
    value: 'AFGHAN',
    label: 'AFGHAN',
  },
  {
    id: '1316',
    value: 'CAUCASIAN',
    label: 'CAUCASIAN',
  },
  {
    id: '1317',
    value: 'KYRGYZ',
    label: 'KYRGYZ',
  },
  {
    id: '1318',
    value: 'UBIAN',
    label: 'UBIAN',
  },
  {
    id: '1319',
    value: 'UZBEKISTAN',
    label: 'UZBEKISTAN',
  },
  {
    id: '1320',
    value: 'AZERBAIJAN',
    label: 'AZERBAIJAN',
  },
  {
    id: '1321',
    value: 'SIAM',
    label: 'SIAM',
  },
  {
    id: '1322',
    value: 'KAZAKHSTAN',
    label: 'KAZAKHSTAN',
  },
  {
    id: '1323',
    value: 'TAJIKISTAN',
    label: 'TAJIKISTAN',
  },
  {
    id: '1400',
    value: 'EUROPEAN',
    label: 'EUROPEAN',
  },
  {
    id: '1401',
    value: 'BRITISH',
    label: 'BRITISH',
  },
  {
    id: '1402',
    value: 'ALGERIA',
    label: 'ALGERIA',
  },
  {
    id: '1403',
    value: 'ANTIGUA-BARBUDA',
    label: 'ANTIGUA-BARBUDA',
  },
  {
    id: '1404',
    value: 'AUSTRALIA',
    label: 'AUSTRALIA',
  },
  {
    id: '1405',
    value: 'ANGOLA',
    label: 'ANGOLA',
  },
  {
    id: '1406',
    value: 'ARGENTINA',
    label: 'ARGENTINA',
  },
  {
    id: '1407',
    value: 'ALBANIA',
    label: 'ALBANIA',
  },
  {
    id: '1408',
    value: 'AUSTRIA',
    label: 'AUSTRIA',
  },
  {
    id: '1410',
    value: 'MIDDLE AFRICA',
    label: 'MIDDLE AFRICA',
  },
  {
    id: '1411',
    value: 'SOUTH AFRICA',
    label: 'SOUTH AFRICA',
  },
  {
    id: '1412',
    value: 'BAHRAIN',
    label: 'BAHRAIN',
  },
  {
    id: '1413',
    value: 'BAHAMAS',
    label: 'BAHAMAS',
  },
  {
    id: '1414',
    value: 'BARBADOS',
    label: 'BARBADOS',
  },
  {
    id: '1415',
    value: 'BELIZE',
    label: 'BELIZE',
  },
  {
    id: '1416',
    value: 'BOTSWANA',
    label: 'BOTSWANA',
  },
  {
    id: '1418',
    value: 'BENIN',
    label: 'BENIN',
  },
  {
    id: '1419',
    value: 'BHUTAN',
    label: 'BHUTAN',
  },
  {
    id: '1420',
    value: 'BOLIVIA',
    label: 'BOLIVIA',
  },
  {
    id: '1421',
    value: 'BRAZIL',
    label: 'BRAZIL',
  },
  {
    id: '1422',
    value: 'BURUNDI',
    label: 'BURUNDI',
  },
  {
    id: '1423',
    value: 'BULGARIA',
    label: 'BULGARIA',
  },
  {
    id: '1424',
    value: 'BELGIUM',
    label: 'BELGIUM',
  },
  {
    id: '1425',
    value: 'BELARUS',
    label: 'BELARUS',
  },
  {
    id: '1427',
    value: 'BOSNIA-HERZEGOVINA',
    label: 'BOSNIA-HERZEGOVINA',
  },
  {
    id: '1428',
    value: 'CAMEROON',
    label: 'CAMEROON',
  },
  {
    id: '1429',
    value: 'CHAD',
    label: 'CHAD',
  },
  {
    id: '1430',
    value: 'CANADA',
    label: 'CANADA',
  },
  {
    id: '1431',
    value: 'CYPRUS',
    label: 'CYPRUS',
  },
  {
    id: '1432',
    value: 'CAPE VERDE',
    label: 'CAPE VERDE',
  },
  {
    id: '1433',
    value: 'CROTIA',
    label: 'CROTIA',
  },
  {
    id: '1434',
    value: 'CHILE',
    label: 'CHILE',
  },
  {
    id: '1435',
    value: 'COLOMBIA',
    label: 'COLOMBIA',
  },
  {
    id: '1436',
    value: 'COMOROS',
    label: 'COMOROS',
  },
  {
    id: '1437',
    value: 'COSTA-RICA',
    label: 'COSTA-RICA',
  },
  {
    id: '1438',
    value: 'CUBA',
    label: 'CUBA',
  },
  {
    id: '1439',
    value: 'DJBOUTI',
    label: 'DJBOUTI',
  },
  {
    id: '1440',
    value: 'DOMINICA',
    label: 'DOMINICA',
  },
  {
    id: '1441',
    value: 'DAHOMEY',
    label: 'DAHOMEY',
  },
  {
    id: '1442',
    value: 'DENMARK',
    label: 'DENMARK',
  },
  {
    id: '1443',
    value: 'EQUADOR',
    label: 'EQUADOR',
  },
  {
    id: '1444',
    value: 'EL SALVADOR',
    label: 'EL SALVADOR',
  },
  {
    id: '1445',
    value: 'EQUATORIAL GUINEA',
    label: 'EQUATORIAL GUINEA',
  },
  {
    id: '1446',
    value: 'ETOPIA',
    label: 'ETOPIA',
  },
  {
    id: '1448',
    value: 'FRANCE',
    label: 'FRANCE',
  },
  {
    id: '1449',
    value: 'FINLAND',
    label: 'FINLAND',
  },
  {
    id: '1451',
    value: 'GABON',
    label: 'GABON',
  },
  {
    id: '1452',
    value: 'GAMBIA',
    label: 'GAMBIA',
  },
  {
    id: '1453',
    value: 'GUINEA',
    label: 'GUINEA',
  },
  {
    id: '1454',
    value: 'GUINEA-BISSAU',
    label: 'GUINEA-BISSAU',
  },
  {
    id: '1455',
    value: 'GHANA',
    label: 'GHANA',
  },
  {
    id: '1456',
    value: 'GRENADA',
    label: 'GRENADA',
  },
  {
    id: '1457',
    value: 'GUYANA',
    label: 'GUYANA',
  },
  {
    id: '1458',
    value: 'GUATEMALA',
    label: 'GUATEMALA',
  },
  {
    id: '1459',
    value: 'GREECE',
    label: 'GREECE',
  },
  {
    id: '1460',
    value: 'GERMANY',
    label: 'GERMANY',
  },
  {
    id: '1461',
    value: 'HAITI',
    label: 'HAITI',
  },
  {
    id: '1462',
    value: 'HONDURAS',
    label: 'HONDURAS',
  },
  {
    id: '1463',
    value: 'HUNGARY',
    label: 'HUNGARY',
  },
  {
    id: '1464',
    value: 'HONG KONG',
    label: 'HONG KONG',
  },
  {
    id: '1466',
    value: 'IRAQ',
    label: 'IRAQ',
  },
  {
    id: '1467',
    value: 'IVORY COAST',
    label: 'IVORY COAST',
  },
  {
    id: '1468',
    value: 'ISRAEL',
    label: 'ISRAEL',
  },
  {
    id: '1469',
    value: 'IRELAND',
    label: 'IRELAND',
  },
  {
    id: '1470',
    value: 'ITALY',
    label: 'ITALY',
  },
  {
    id: '1471',
    value: 'ICELAND',
    label: 'ICELAND',
  },
  {
    id: '1472',
    value: 'JORDAN',
    label: 'JORDAN',
  },
  {
    id: '1473',
    value: 'JAMAICA',
    label: 'JAMAICA',
  },
  {
    id: '1475',
    value: 'KUWAIT',
    label: 'KUWAIT',
  },
  {
    id: '1476',
    value: 'KENYA',
    label: 'KENYA',
  },
  {
    id: '1477',
    value: 'KIRIBATI',
    label: 'KIRIBATI',
  },
  {
    id: '1479',
    value: 'KOREA(UTARA)',
    label: 'KOREA(UTARA)',
  },
  {
    id: '1480',
    value: 'KEMBOJA',
    label: 'KEMBOJA',
  },
  {
    id: '1481',
    value: 'LEBANON',
    label: 'LEBANON',
  },
  {
    id: '1482',
    value: 'LIBYA',
    label: 'LIBYA',
  },
  {
    id: '1483',
    value: 'LESOTHO',
    label: 'LESOTHO',
  },
  {
    id: '1484',
    value: 'LAOS',
    label: 'LAOS',
  },
  {
    id: '1485',
    value: 'LIBERIA',
    label: 'LIBERIA',
  },
  {
    id: '1486',
    value: 'LUXEMBOURG',
    label: 'LUXEMBOURG',
  },
  {
    id: '1487',
    value: 'MALI',
    label: 'MALI',
  },
  {
    id: '1488',
    value: 'MALDIVES',
    label: 'MALDIVES',
  },
  {
    id: '1489',
    value: 'MAURITANIA',
    label: 'MAURITANIA',
  },
  {
    id: '1490',
    value: 'MOROCCO',
    label: 'MOROCCO',
  },
  {
    id: '1491',
    value: 'MALAWI',
    label: 'MALAWI',
  },
  {
    id: '1493',
    value: 'MADAGASCAR',
    label: 'MADAGASCAR',
  },
  {
    id: '1494',
    value: 'MAURITIUS',
    label: 'MAURITIUS',
  },
  {
    id: '1495',
    value: 'MEXICO',
    label: 'MEXICO',
  },
  {
    id: '1496',
    value: 'MOZAMBIQUE',
    label: 'MOZAMBIQUE',
  },
  {
    id: '1497',
    value: 'MONGOLIA',
    label: 'MONGOLIA',
  },
  {
    id: '1498',
    value: 'MESIR',
    label: 'MESIR',
  },
  {
    id: '1499',
    value: 'MYANMAR',
    label: 'MYANMAR',
  },
  {
    id: '1500',
    value: 'LAIN-LAIN',
    label: 'LAIN-LAIN',
  },
  {
    id: '1501',
    value: 'NAMIBIA',
    label: 'NAMIBIA',
  },
  {
    id: '1502',
    value: 'NAURU',
    label: 'NAURU',
  },
  {
    id: '1503',
    value: 'NEW ZEALAND',
    label: 'NEW ZEALAND',
  },
  {
    id: '1504',
    value: 'NIGERIA',
    label: 'NIGERIA',
  },
  {
    id: '1505',
    value: 'NEPAL',
    label: 'NEPAL',
  },
  {
    id: '1506',
    value: 'NICARAGUA',
    label: 'NICARAGUA',
  },
  {
    id: '1507',
    value: 'NETHERLAND',
    label: 'NETHERLAND',
  },
  {
    id: '1508',
    value: 'NORWAY',
    label: 'NORWAY',
  },
  {
    id: '1509',
    value: 'OMAN',
    label: 'OMAN',
  },
  {
    id: '1510',
    value: 'PAPUA NEW GUINEA',
    label: 'PAPUA NEW GUINEA',
  },
  {
    id: '1511',
    value: 'PALESTIN',
    label: 'PALESTIN',
  },
  {
    id: '1512',
    value: 'PANAMA',
    label: 'PANAMA',
  },
  {
    id: '1513',
    value: 'PARAGUAY',
    label: 'PARAGUAY',
  },
  {
    id: '1514',
    value: 'PERU',
    label: 'PERU',
  },
  {
    id: '1515',
    value: 'POLAND',
    label: 'POLAND',
  },
  {
    id: '1517',
    value: 'QATAR',
    label: 'QATAR',
  },
  {
    id: '1518',
    value: 'ROMANIA',
    label: 'ROMANIA',
  },
  {
    id: '1519',
    value: 'RWANDA',
    label: 'RWANDA',
  },
  {
    id: '1520',
    value: 'REPUBLIK CZECH',
    label: 'REPUBLIK CZECH',
  },
  {
    id: '1521',
    value: 'REPUBLIK SLOVAKIA',
    label: 'REPUBLIK SLOVAKIA',
  },
  {
    id: '1522',
    value: 'SENEGAL',
    label: 'SENEGAL',
  },
  {
    id: '1523',
    value: 'SIERRA LEONE',
    label: 'SIERRA LEONE',
  },
  {
    id: '1524',
    value: 'SOMALIA',
    label: 'SOMALIA',
  },
  {
    id: '1525',
    value: 'SUDAN',
    label: 'SUDAN',
  },
  {
    id: '1526',
    value: 'SYRIA',
    label: 'SYRIA',
  },
  {
    id: '1527',
    value: 'ST.LUCIA',
    label: 'ST.LUCIA',
  },
  {
    id: '1528',
    value: 'ST.VINCENT',
    label: 'ST.VINCENT',
  },
  {
    id: '1529',
    value: 'SYCHELLES',
    label: 'SYCHELLES',
  },
  {
    id: '1530',
    value: 'SOLOMON ISLAND',
    label: 'SOLOMON ISLAND',
  },
  {
    id: '1531',
    value: 'SRI LANKA',
    label: 'SRI LANKA',
  },
  {
    id: '1532',
    value: 'SWAZILAND',
    label: 'SWAZILAND',
  },
  {
    id: '1533',
    value: 'SAMOA',
    label: 'SAMOA',
  },
  {
    id: '1534',
    value: 'SAO TOME & PRINCIPE',
    label: 'SAO TOME & PRINCIPE',
  },
  {
    id: '1535',
    value: 'SURINAM',
    label: 'SURINAM',
  },
  {
    id: '1536',
    value: 'SAMOA BARAT',
    label: 'SAMOA BARAT',
  },
  {
    id: '1537',
    value: 'SWEDEN',
    label: 'SWEDEN',
  },
  {
    id: '1538',
    value: 'SPAIN',
    label: 'SPAIN',
  },
  {
    id: '1539',
    value: 'SWITZERLAND',
    label: 'SWITZERLAND',
  },
  {
    id: '1540',
    value: 'TUNISIA',
    label: 'TUNISIA',
  },
  {
    id: '1541',
    value: 'TURKEY',
    label: 'TURKEY',
  },
  {
    id: '1542',
    value: 'TANZANIA',
    label: 'TANZANIA',
  },
  {
    id: '1543',
    value: 'TONGA',
    label: 'TONGA',
  },
  {
    id: '1544',
    value: 'TRINIDAD &amp; TOBAGO',
    label: 'TRINIDAD &amp; TOBAGO',
  },
  {
    id: '1545',
    value: 'TUVALI',
    label: 'TUVALI',
  },
  {
    id: '1547',
    value: 'TOGO',
    label: 'TOGO',
  },
  {
    id: '1548',
    value: 'TAIWAN',
    label: 'TAIWAN',
  },
  {
    id: '1549',
    value: 'UGANDA',
    label: 'UGANDA',
  },
  {
    id: '1550',
    value: 'UNITED ARAB EMIRATES',
    label: 'UNITED ARAB EMIRATES',
  },
  {
    id: '1551',
    value: 'UPPER VOLTA',
    label: 'UPPER VOLTA',
  },
  {
    id: '1552',
    value: 'URUGUAY',
    label: 'URUGUAY',
  },
  {
    id: '1553',
    value: 'RUSSIA',
    label: 'RUSSIA',
  },
  {
    id: '1554',
    value: 'UKRAINE',
    label: 'UKRAINE',
  },
  {
    id: '1555',
    value: 'UNITED STATES',
    label: 'UNITED STATES',
  },
  {
    id: '1556',
    value: 'VANUATU',
    label: 'VANUATU',
  },
  {
    id: '1557',
    value: 'VENEZUELA',
    label: 'VENEZUELA',
  },
  {
    id: '1559',
    value: 'YEMEN',
    label: 'YEMEN',
  },
  {
    id: '1560',
    value: 'YUGOSLAVIA',
    label: 'YUGOSLAVIA',
  },
  {
    id: '1561',
    value: 'MACEDONIA',
    label: 'MACEDONIA',
  },
  {
    id: '1562',
    value: 'ZAIRE',
    label: 'ZAIRE',
  },
  {
    id: '1563',
    value: 'ZAMBIA',
    label: 'ZAMBIA',
  },
  {
    id: '1564',
    value: 'ZIMBABWE',
    label: 'ZIMBABWE',
  },
  {
    id: '1565',
    value: 'SLOVENIA',
    label: 'SLOVENIA',
  },
  {
    id: '1566',
    value: 'TURKMENISTAN',
    label: 'TURKMENISTAN',
  },
  {
    id: '9999',
    value: 'MAKLUMAT TIADA',
    label: 'MAKLUMAT TIADA',
  },
  {
    id: '9998',
    value: 'MAKLUMAT TIDAK DIPEROLEHI',
    label: 'MAKLUMAT TIDAK DIPEROLEHI',
  },
];

export default UserTambahKemaskiniPelajarSekolah;
