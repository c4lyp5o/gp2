import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import {
  FaWindowClose,
  FaCheckCircle,
  FaTimesCircle,
  FaMinus,
  FaPlus,
  FaRegPaperPlane,
  FaUserCheck,
} from 'react-icons/fa';

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
  const [nama, setNama] = useState('');
  const [nomborId, setNomborId] = useState('');
  const [kelasPelajar, setKelasPelajar] = useState('');
  const [tarikhLahir, setTarikhLahir] = useState('');
  const [jantina, setJantina] = useState('');
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
        const tahun = parseInt(howOldAreYouMyFriendtahunV2(tarikhLahir));
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

  const howOldAreYouMyFriendtahunV2 = (date) => {
    const years = moment(dateToday, moment.ISO_8601).diff(
      moment(date),
      'years'
    );
    return years;
  };

  const findAgeFromIc = (ic) => {
    const year = ic.substring(0, 2);
    const month = ic.substring(2, 4);
    const day = ic.substring(4, 6);
    const today = moment(dateToday, moment.ISO_8601).toDate();
    const dob19 = moment(`19${year}-${month}-${day}`).toDate(); // year 1900
    const dob20 = moment(`20${year}-${month}-${day}`).toDate(); // year 2000
    const diff = today.getTime() - dob19.getTime();
    const years = Math.floor(diff / 31556736000);
    let value;
    // it's year 1900 for years 99 and below
    if (years <= 99) {
      value = {
        dob: dob19,
      };
    }
    // it's year 2000 for years 100 and above
    if (years >= 100) {
      value = {
        dob: dob20,
      };
    }
    return value;
  };

  const handleIc = (ic) => {
    const icLength = ic.length;
    if (icLength === 12) {
      const age = findAgeFromIc(ic);
      const tempDate = moment(age.dob).format('YYYY-MM-DD');
      const tahun = parseInt(howOldAreYouMyFriendtahunV2(age.dob));
      const lasttwo = ic.substring(10, 12);
      const jantina = lasttwo % 2 === 0 ? 'PEREMPUAN' : 'LELAKI';
      setTarikhLahir(tempDate);
      setTarikhLahirDP(age.dob);
      setUmur(tahun);
      setJantina(jantina);
      // setConfirmData({
      //   ...confirmData,
      //   ic: ic,
      //   tarikhLahir: tempDate,
      //   umur: tahun,
      //   umurBulan: bulan,
      //   umurHari: hari,
      //   jantina: jantina,
      // });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmittingTambahPelajar(true);
    if (!kemaskiniPelajarId) {
      const {
        idInstitusi,
        kodSekolah,
        namaSekolah,
        sesiTakwimPelajar,
        tahunTingkatan,
      } = dataFromPilihanTahunTingkatan;

      await toast
        .promise(
          axios.post(
            '/api/v1/sekolah',
            {
              idInstitusi,
              kodSekolah,
              namaSekolah,
              sesiTakwimPelajar,
              tahunTingkatan,
              //
              nama: nama.toUpperCase(),
              nomborId,
              idIndividu: kodSekolah + nomborId, // random je ni
              kelasPelajar,
              tarikhLahir,
              jantina,
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
            loading: 'Sedang menambah pelajar',
            success: 'Berjaya menambah pelajar',
            error: 'Gagal menambah pelajar',
          }
        )
        .then((res) => {
          setModalTambahKemaskiniPelajar(false);
          setReloadState(!reloadState);
          setSubmittingTambahPelajar(false);
        })
        .catch((err) => {
          console.log(err);
          setModalTambahKemaskiniPelajar(false);
        });
    }
    if (kemaskiniPelajarId) {
      await toast
        .promise(
          axios.patch(
            `/api/v1/sekolah/ubah/${kemaskiniPelajarId}`,
            {
              // req.body patch here
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
            loading: 'Sedang mengemaskini pelajar',
            success: 'Berjaya mengemaskini pelajar',
            error: 'Gagal mengemaskini pelajar',
          }
        )
        .then((res) => {
          setModalTambahKemaskiniPelajar(false);
          setReloadState(!reloadState);
          setSubmittingTambahPelajar(false);
        })
        .catch((err) => {
          console.log(err);
          setModalTambahKemaskiniPelajar(false);
        });
    }
  };

  // fetch singlePersonSekolah to edit if kemaskiniPelajarId === true
  useEffect(() => {
    if (kemaskiniPelajarId) {
      const fetchSinglePersonSekolah = async () => {
        try {
          const { data } = await axios.get(
            `/api/v1/sekolah/${kemaskiniPelajarId}`,
            {
              headers: {
                Authorization: `Bearer ${
                  reliefUserToken ? reliefUserToken : userToken
                }`,
              },
            }
          );
          setSinglePersonSekolah(data.singlePersonSekolah);
          console.log(data); // TODO map for kemaskini to each state
        } catch (error) {
          console.log(error);
        }
      };
      fetchSinglePersonSekolah();
    }
  }, [kemaskiniPelajarId]);

  const closeModal = () => {
    setModalTambahKemaskiniPelajar(false);
    setKemaskiniPelajarId(false);
    setShowForm(false);
  };

  return (
    <>
      <div className='absolute z-10 inset-x-1 lg:inset-x-1/3 inset-y-7 bg-userWhite text-user1 rounded-md shadow-md overflow-y-auto'>
        <FaWindowClose
          onClick={closeModal}
          className='absolute mr-1 mt-1 text-xl text-userBlack right-0 hover:cursor-pointer hover:text-user2 transition-all'
        />
        <div className='grid grid-rows-[1fr_8fr_1fr] h-full'>
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
                  Kelas
                </p>
                <p className='text-xs p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                  {singlePersonSekolah.tahunTingkatan}{' '}
                  {singlePersonSekolah.kelasPelajar}
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
          {showForm && kemaskiniPelajarId ? (
            <div className='mt-1 py-1'>
              <form></form>
            </div>
          ) : (
            showForm &&
            !kemaskiniPelajarId && (
              <div className='mt-1 py-1'>
                <form
                  onSubmit={handleSubmit}
                  className='px-2 grid grid-cols-2 gap-2'
                >
                  <h1 className='col-span-2 text-base uppercase font-bold text-center text-user1 bg-userWhite rounded-md'>
                    Sila isi semua maklumat murid
                  </h1>
                  <div className='relative col-span-2'>
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
                      onChange={(e) => setNama(e.target.value)}
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
                      onChange={(e) => setWarganegara(e.target.value)}
                    >
                      <option value=''>Sila Pilih</option>
                      <option value='MALAYSIA'>MALAYSIA</option>
                      <option value='BUKAN WARGANEGARA'>
                        BUKAN WARGANEGARA
                      </option>
                    </select>
                  </div>
                  <div className='relative'>
                    <label
                      htmlFor='nomborId'
                      className='text-sm text-left text-user1 bg-userWhite flex rounded-md'
                    >
                      Nombor Kad Pengenalan
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
                          handleIc(e.target.value);
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
                      onChange={(e) => setJantina(e.target.value)}
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
                      onChange={(e) => setKeturunan(e.target.value)}
                    >
                      <option value=''>Sila Pilih</option>
                      <option value='melayu'>Melayu</option>
                      <option value='cina'>Cina</option>
                      <option value='india'>India</option>
                      <option value='bajau'>Bajau</option>
                      <option value='dusun'>Dusun</option>
                      <option value='kadazan'>Kadazan</option>
                      <option value='murut'>Murut</option>
                      <option value='bumiputera sabah lain'>
                        Bumiputera sabah lain
                      </option>
                      <option value='melanau'>Melanau</option>
                      <option value='kedayan'>Kedayan</option>
                      <option value='iban'>Iban</option>
                      <option value='bidayuh'>Bidayuh</option>
                      <option value='penan'>Penan</option>
                      <option value='bumiputera sarawak lain'>
                        Bumiputera sarawak lain
                      </option>
                      <option value='orang asli semenanjung'>
                        Orang asli semenanjung
                      </option>
                      <option value='lain-lain'>Lain-lain</option>
                      <option value='bukan warganegara'>
                        Bukan warganegara
                      </option>
                    </select>
                  </div>
                </form>
              </div>
            )
          )}
          <div className='sticky grid grid-cols-2 bottom-0 right-0 left-0 m-2 mx-10 bg-userWhite px-5 py-2'>
            {showForm ? (
              <button
                type='submit'
                className='capitalize bg-user9 text-userWhite rounded-md shadow-xl p-2 mr-3 hover:bg-user1 transition-all flex justify-center items-center'
                onClick={handleSubmit}
              >
                Hantar
                <FaRegPaperPlane className='inline-flex ml-1' />
              </button>
            ) : (
              <button
                className='capitalize bg-user3 text-userWhite rounded-md shadow-xl p-2 mr-3 hover:bg-user1 transition-all flex justify-center items-center'
                onClick={() => {
                  setShowForm(true);
                }}
              >
                Teruskan
              </button>
            )}
            <button
              className='capitalize bg-userWhite text-userBlack rounded-md p-2 ml-3 hover:bg-user5 transition-all'
              onClick={closeModal}
            >
              Tidak
            </button>
          </div>
        </div>
      </div>
      <div
        onClick={closeModal}
        className='fixed inset-0 bg-userBlack opacity-50 z-0'
      />
    </>
  );
}

export default UserTambahKemaskiniPelajarSekolah;
