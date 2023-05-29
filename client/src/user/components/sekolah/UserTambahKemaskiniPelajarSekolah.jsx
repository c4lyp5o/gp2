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
  const { userToken, userinfo, reliefUserToken, masterDatePicker, toast } =
    useGlobalUserAppContext();

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
          <h5 className='bg-user9 text-userWhite font-semibold text-xl h-7'>
            PERHATIAN
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
                  {singlePersonSekolah.tarikhLahir.split(' ')[0]}
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
                <form className='p-3'>
                  <div className='relative'>
                    <label
                      htmlFor='nama'
                      className='text-sm text-left text-user1 bg-userWhite flex rounded-md'
                    >
                      Nama
                    </label>
                    <input
                      type='text'
                      name='nama'
                      id='nama'
                      placeholder=' '
                      className='appearance-none uppercase w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                    />
                  </div>
                  <div className='relative'>
                    <label
                      htmlFor='nomborId'
                      className='text-sm text-left text-user1 bg-userWhite flex rounded-md'
                    >
                      Nombor Kad Pengenalan
                    </label>
                    <input
                      type='text'
                      name='nomborId'
                      id='nomborId'
                      placeholder=' '
                      className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                      value={nomborId}
                      onChange={(e) => setNomborId(e.target.value)}
                    />
                  </div>
                  <div className='relative'>
                    <label
                      htmlFor='jantina'
                      className='text-sm text-left text-user1 bg-userWhite flex rounded-md'
                    >
                      Jantina
                    </label>
                    <select
                      name='jantina'
                      id='jantina'
                      className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
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
                    </label>
                    <select
                      name='keturunan'
                      id='keturunan'
                      placeholder=' '
                      className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
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
                  <div className='relative'>
                    <label
                      htmlFor='warganegara'
                      className='text-sm text-left text-user1 bg-userWhite flex rounded-md'
                    >
                      Warganegara
                    </label>
                    <select
                      name='warganegara'
                      id='warganegara'
                      placeholder=' '
                      className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                      value={warganegara}
                      onChange={(e) => setWarganegara(e.target.value)}
                    >
                      <option value=''>SILA PILIH</option>
                      <option value='MALAYSIA'>MALAYSIA</option>
                      <option value='BUKAN WARGANEGARA'>
                        BUKAN WARGANEGARA
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
                className='capitalize bg-user9 text-userWhite rounded-md shadow-xl p-2 mr-3 hover:bg-user1 transition-all flex justify-center items-center'
                onClick={handleSubmit}
              >
                Hantar
                <FaRegPaperPlane className='inline-flex ml-1' />
              </button>
            ) : (
              <button
                className='capitalize bg-user9 text-userWhite rounded-md shadow-xl p-2 mr-3 hover:bg-user1 transition-all flex justify-center items-center'
                onClick={() => {
                  setShowForm(true);
                }}
              >
                Teruskan
                <FaRegPaperPlane className='inline-flex ml-1' />
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
