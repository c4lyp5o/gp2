import { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';

import { useGlobalUserAppContext } from '../../context/userAppContext';

export default function FillableForm({ showForm, setShowForm }) {
  const { dateToday } = useGlobalUserAppContext();

  const [nama, setNama] = useState('');
  const [jenisIc, setJenisIc] = useState('');
  const [ic, setIc] = useState('');
  const [umur, setUmur] = useState('');
  const [tarikhLahir, setTarikhLahir] = useState('');
  const [tarikhKedatangan, setTarikhKedatangan] = useState(dateToday);
  const [jantina, setJantina] = useState('');
  const [alamat, setAlamat] = useState('');
  const [waktuSampai, setWaktuSampai] = useState('');
  const [kategoriPesakit, setKategoriPesakit] = useState('');
  const [kumpulanEtnik, setKumpulanEtnik] = useState('');
  const [rujukDaripada, setRujukDaripada] = useState('');

  const ADD_PATIENT = gql`
    mutation CreatePatient(
      $nama: String
      $jenisIc: String
      $ic: String
      $tarikhLahir: String
      $jantina: String
      $tarikhKedatangan: String
      $umur: Int
      $rujukDaripada: String
      $alamat: String
      $waktuSampai: String
      $kategoriPesakit: String
      $kumpulanEtnik: String
    ) {
      createPatient(
        patient: {
          nama: $nama
          jenisIc: $jenisIc
          ic: $ic
          tarikhLahir: $tarikhLahir
          tarikhKedatangan: $tarikhKedatangan
          jantina: $jantina
          umur: $umur
          alamat: $alamat
          waktuSampai: $waktuSampai
          kategoriPesakit: $kategoriPesakit
          kumpulanEtnik: $kumpulanEtnik
          rujukDaripada: $rujukDaripada
        }
      ) {
        nama
        jenisIc
        ic
        tarikhLahir
        tarikhKedatangan
        jantina
        umur
        alamat
        waktuSampai
        kategoriPesakit
        kumpulanEtnik
        rujukDaripada
      }
    }
  `;

  const [CreatePatient, { loading, error, data }] = useMutation(ADD_PATIENT);

  const handleSubmit = (e) => {
    e.preventDefault();
    CreatePatient({
      variables: {
        nama: nama.toLowerCase(),
        jenisIc: jenisIc,
        ic: ic,
        tarikhLahir: tarikhLahir,
        tarikhKedatangan: tarikhKedatangan,
        jantina: jantina,
        umur: umur,
        alamat: alamat.toLowerCase(),
        waktuSampai: waktuSampai,
        kategoriPesakit: kategoriPesakit,
        kumpulanEtnik: kumpulanEtnik,
        rujukDaripada: rujukDaripada.toLowerCase(),
      },
    });
    setShowForm(false);
  };

  if (loading) return <p>Submitting...</p>;
  if (error) return <p>Error :(</p>;

  if (showForm) {
    return (
      <>
        <form onSubmit={handleSubmit}>
          <h1 className='bg-user3 font-bold text-2xl'>pendaftaran</h1>
          <div className='grid'>
            <div className='flex m-2 ml-auto'>
              <p className='mr-3 font-semibold'>tarikh kedatangan: </p>
              <input
                required
                onChange={(e) => setTarikhKedatangan(e.target.value)}
                type='date'
                name='tarikhKedatangan'
                className='outline outline-1 outline-userBlack'
                value={tarikhKedatangan}
              />
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>nama: </p>
              <input
                required
                onChange={(e) => setNama(e.target.value)}
                type='text'
                name='namaUmum'
                className='appearance-none w-7/12 leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
              />
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>jenis pengenalan</p>
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
              <p className='mr-3 font-semibold'>tarikh lahir: </p>
              <input
                required
                onChange={(e) => setTarikhLahir(e.target.value)}
                type='date'
                name='tarikhLahir'
              />
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>umur: </p>
              <input
                required
                onChange={(e) => setUmur(parseInt(e.target.value))}
                type='number'
                name='umur'
                className='outline outline-1 outline-userBlack w-16 text-sm font-m'
              />
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>jantina: </p>
              <select
                required
                name='jantina'
                id='jantina'
                onChange={(e) => setJantina(e.target.value)}
              >
                <option value=''>Sila pilih..</option>
                <option value='lelaki'>lelaki</option>
                <option value='perempuan'>perempuan</option>
              </select>
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>alamat: </p>
              <input
                required
                onChange={(e) => setAlamat(e.target.value)}
                type='text'
                name='alamat'
                className='appearance-none w-10/12 leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
              />
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>waktu sampai: </p>
              <input
                required
                onChange={(e) => setWaktuSampai(e.target.value)}
                type='time'
                name='waktuSampai'
                className='outline outline-1 outline-userBlack'
              />
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>kategori pesakit:</p>
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
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>kumpulan etnik:</p>
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
                <option value='bumiputera-sabah-lain'>
                  Bumiputera sabah lain
                </option>
                <option value='melanau'>Melanau</option>
                <option value='kedayan'>Kedayan</option>
                <option value='iban'>Iban</option>
                <option value='bidayuh'>Bidayuh</option>
                <option value='bumiputera-sarawak-lain'>
                  Bumiputera sarawak lain
                </option>
                <option value='orang-asli-semenanjung'>
                  Orang asli semenanjung
                </option>
                <option value='lain-lain'>Lain-lain</option>
                <option value='bukan-warganegara'>Bukan warganegara</option>
              </select>
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>rujuk daripada:</p>
              <input
                onChange={(e) => setRujukDaripada(e.target.value)}
                type='text'
                name='rujukDaripada'
                className='appearance-none leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
              />
            </div>
          </div>
          <span
            onClick={() => setShowForm(false)}
            className='m-2 p-2 capitalize bg-user3 hover:bg-user1 hover:text-userWhite hover:cursor-pointer transition-all'
          >
            kembali
          </span>
          <button
            type='submit'
            className='m-2 p-2 capitalize bg-user3 hover:bg-user1 hover:text-userWhite transition-all'
          >
            Submit
          </button>
        </form>
      </>
    );
  }
}
