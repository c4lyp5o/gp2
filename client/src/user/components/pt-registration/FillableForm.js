import { useState } from 'react';
import axios from 'axios';

import { useGlobalUserAppContext } from '../../context/userAppContext';

export default function FillableForm({ showForm, setShowForm, jenisFasiliti }) {
  const { kaunterToken, dateToday, toast } = useGlobalUserAppContext();

  const [tarikhKedatangan, setTarikhKedatangan] = useState(dateToday);
  const [waktuSampai, setWaktuSampai] = useState('');
  const [nama, setNama] = useState('');
  const [jenisIc, setJenisIc] = useState('');
  const [ic, setIc] = useState('');
  const [tarikhLahir, setTarikhLahir] = useState('');
  const [umur, setUmur] = useState(0);
  const [jantina, setJantina] = useState('');
  const [alamat, setAlamat] = useState('');
  const [kategoriPesakit, setKategoriPesakit] = useState('');
  const [statusPesara, setStatusPesara] = useState('');
  const [kumpulanEtnik, setKumpulanEtnik] = useState('');
  const [rujukDaripada, setRujukDaripada] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await toast
      .promise(
        axios.post(
          '/api/v1/kaunter',
          {
            createdByUsername: 'kaunter',
            tarikhKedatangan,
            waktuSampai,
            nama: nama.toLowerCase(),
            jenisIc,
            ic,
            tarikhLahir,
            umur,
            jantina,
            alamat,
            kategoriPesakit,
            statusPesara,
            kumpulanEtnik,
            rujukDaripada,
            jenisFasiliti,
          },
          { headers: { Authorization: `Bearer ${kaunterToken}` } }
        ),
        {
          pending: 'Mendaftar...',
          success: 'Pesakit berjaya didaftar',
          error: 'Pesakit gagal didaftar',
        },
        { autoClose: 2000 }
      )
      .then(() => {
        setShowForm(false);
      });
  };

  const howOldAreYouMyFriend = (date) => {
    return Math.floor((new Date() - new Date(date).getTime()) / 3.15576e10);
  };

  if (showForm) {
    return (
      <>
        <form onSubmit={handleSubmit}>
          <h1 className='bg-kaunter3 font-bold text-2xl'>pendaftaran</h1>
          <p className='font-semibold text-user6 text-left mt-3 ml-3'>
            Fasiliti: {jenisFasiliti}
          </p>
          <p className='font-semibold text-user6 text-left mt-3 ml-3'>
            * required
          </p>
          <div className='grid'>
            <div className='flex m-2 ml-auto'>
              <p className='mr-3 font-semibold'>
                tarikh kedatangan:{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              <input
                required
                value={tarikhKedatangan}
                onChange={(e) => setTarikhKedatangan(e.target.value)}
                type='date'
                name='tarikhKedatangan'
                className='outline outline-1 outline-userBlack'
              />
            </div>
            <div className='flex m-2 ml-auto'>
              <p className='mr-3 font-semibold'>
                waktu sampai:{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              <input
                required
                onChange={(e) => setWaktuSampai(e.target.value)}
                type='time'
                name='waktuSampai'
                className='outline outline-1 outline-kaunterBlack'
              />
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                nama: <span className='font-semibold text-user6'>*</span>
              </p>
              <input
                required
                onChange={(e) => setNama(e.target.value)}
                type='text'
                name='namaUmum'
                className='appearance-none w-7/12 leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
              />
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                jenis pengenalan{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              <select
                required
                name='pengenalan'
                id='pengenalan'
                onChange={(e) => setJenisIc(e.target.value)}
                className='mr-3'
              >
                <option value=''>Sila pilih..</option>
                <option value='mykad'>MyKad</option>
                <option value='passport'>Passport</option>
                <option value='tentera'>Tentera</option>
                <option value='polis'>Polis</option>
                <option value='sijil-lahir'>Sijil lahir</option>
              </select>
              <input
                required
                onChange={(e) => setIc(e.target.value)}
                type='text'
                name='ic'
                placeholder='123456-09-0987'
                className='appearance-none leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
              />
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                tarikh lahir:{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              <input
                required
                onChange={(e) => {
                  setTarikhLahir(e.target.value);
                  setUmur(parseInt(howOldAreYouMyFriend(e.target.value)));
                }}
                type='date'
                name='tarikhLahir'
              />
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                umur: <span className='font-semibold text-user6'>*</span>
              </p>
              <input
                disabled
                type='number'
                name='umur'
                value={umur}
                className='outline outline-1 outline-userBlack w-16 text-sm font-m'
              />
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                jantina: <span className='font-semibold text-user6'>*</span>
              </p>
              <select
                required
                name='jantina'
                id='jantina'
                onChange={(e) => setJantina(e.target.value)}
              >
                <option value=''>Sila pilih..</option>
                <option value='lelaki'>Lelaki</option>
                <option value='perempuan'>Perempuan</option>
              </select>
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                alamat: <span className='font-semibold text-user6'>*</span>
              </p>
              <input
                required
                onChange={(e) => setAlamat(e.target.value)}
                type='text'
                name='alamat'
                className='appearance-none w-10/12 leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
              />
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                kategori pesakit:{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              <select
                required
                name='kategoriPesakit'
                id='kategoriPesakit'
                onChange={(e) => setKategoriPesakit(e.target.value)}
              >
                <option value=''>Sila pilih..</option>
                <option value='toddler'>Toddler (0 - 4) tahun</option>
                <option value='prasekolah'>Prasekolah (5 - 6) tahun</option>
                <option value='sekolahrendah'>Sekolah rendah</option>
                <option value='sekolahmenengah'>Sekolah menengah</option>
                <option value='oku'>OKU</option>
                <option value='hamil'>Ibu mengandung</option>
                <option value='dewasa'>Dewasa</option>
                <option value='warga-tua'>Warga tua</option>
              </select>
            </div>
            <div
              className={`${
                kategoriPesakit === 'warga-tua' ? 'visible' : 'hidden'
              } flex m-2`}
            >
              <p className='mr-3 font-semibold'>
                status pesara:{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              <select
                required
                name='statusPesara'
                id='statusPesara'
                onChange={(e) => setStatusPesara(e.target.value)}
              >
                <option selected disabled>
                  Sila pilih..
                </option>
                <option value='kerajaan'>kerajaan</option>
                <option value='atm'>ATM</option>
              </select>
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                kumpulan etnik:{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              <select
                required
                name='kumpulanEtnik'
                id='kumpulanEtnik'
                onChange={(e) => {
                  setKumpulanEtnik(e.target.value);
                }}
              >
                <option value=''>Sila pilih..</option>
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
                <option value='bumiputera sarawak lain'>
                  Bumiputera sarawak lain
                </option>
                <option value='orang asli semenanjung'>
                  Orang asli semenanjung
                </option>
                <option value='lain-lain'>Lain-lain</option>
                <option value='bukan warganegara'>Bukan warganegara</option>
              </select>
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>rujuk daripada: </p>
              <select
                required
                name='rujukDaripada'
                id='rujukDaripada'
                onChange={(e) => setRujukDaripada(e.target.value)}
                className='mr-3'
              >
                <option value=''>Sila pilih..</option>
                <option value='dalaman'>Dalaman</option>
                <option value='kp'>Klinik Pergigian</option>
                <option value='kk'>Klinik Kesihatan</option>
                <option value='hospital'>Hospital</option>
                <option value='swasta'>Swasta</option>
                <option value='lain2'>Lain-lain</option>
              </select>
            </div>
          </div>
          <span
            onClick={() => setShowForm(false)}
            className='m-2 p-2 uppercase rounded bg-kaunter3 hover:bg-kaunter1 hover:text-userWhite hover:cursor-pointer shadow-md transition-all'
          >
            kembali
          </span>
          <button
            type='submit'
            className='m-2 p-2 uppercase rounded bg-kaunter3 hover:bg-kaunter1 hover:text-userWhite hover:cursor-pointer shadow-md transition-all'
          >
            daftar
          </button>
        </form>
      </>
    );
  }
}
