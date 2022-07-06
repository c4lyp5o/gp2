import { useQuery, useMutation, gql } from '@apollo/client';
import { useState } from 'react';

import UserHeader from '../components/UserHeader';
import UserFooter from '../components/UserFooter';
import KaunterHeaderLoggedIn from '../components/KaunterHeaderLoggedIn';
import FillableForm from '../components/pt-registration/FillableForm';

export default function KaunterEdit({ ptID }) {
  const [umur, setUmur] = useState('');
  const GET_PATIENT_DATA = gql`
    query getPatientData($id: String!) {
      patient(_id: $id) {
        _id
        nama
        jenisIc
        ic
        tarikhLahir
        umur
        jantina
        tarikhKedatangan
        alamat
        waktuSampai
        kategoriPesakit
        kumpulanEtnik
        rujukDaripada
      }
    }
  `;

  const UPDATE_PATIENT = gql`
    mutation updatePatient($patient: PatientInput!) {
      updatePatient(patient: $patient) {
        _id
        nama
        jenisIc
        ic
        tarikhLahir
        umur
        jantina
        tarikhKedatangan
        alamat
        waktuSampai
        kategoriPesakit
        kumpulanEtnik
        rujukDaripada
        createdAt
      }
    }
  `;

  const [updatePatient] = useMutation(UPDATE_PATIENT);

  const { loading, error, data } = useQuery(GET_PATIENT_DATA, {
    variables: {
      id: `${ptID}`,
    },
  });

  const [patient, setPatient] = useState(data.patient);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updatePatient({ variables: { patient } });
  };

  return (
    <>
      <UserHeader />
      <div className='absolute inset-0 -z-10 bg-user5'></div>
      <KaunterHeaderLoggedIn />
      <div className='absolute inset-10 top-44 -z-10 bg-userWhite text-center justify-center items-center outline outline-1 outline-userBlack rounded-md shadow-xl capitalize'>
        <div className='px-10 h-full p-3 overflow-y-auto'>
          <form onSubmit={handleSubmit}>
            <h1 className='bg-user3 font-bold text-2xl'>pendaftaran</h1>
            <div className='grid'>
              <div className='flex m-2 ml-auto'>
                <p className='mr-3 font-semibold'>tarikh kedatangan: </p>
                <input
                  required
                  onChange={(e) => handleChange(e)}
                  type='date'
                  name='tarikhKedatangan'
                  className='outline outline-1 outline-userBlack'
                  value={patient.tarikhKedatangan}
                />
              </div>
              <div className='flex m-2'>
                <p className='mr-3 font-semibold'>nama: </p>
                <input
                  required
                  onChange={(e) => handleChange(e)}
                  type='text'
                  name='nama'
                  value={patient.nama}
                  className='appearance-none w-7/12 leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
                />
              </div>
              <div className='flex m-2'>
                <p className='mr-3 font-semibold'>jenis pengenalan</p>
                <select
                  required
                  name='jenisIc'
                  id='jenisIc'
                  onChange={(e) => handleChange(e)}
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
                  onChange={(e) => handleChange(e)}
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
                  onChange={(e) => handleChange(e)}
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
                  onChange={(e) => handleChange(e)}
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
                  onChange={(e) => handleChange(e)}
                  type='text'
                  name='alamat'
                  className='appearance-none w-10/12 leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
                />
              </div>
              <div className='flex m-2'>
                <p className='mr-3 font-semibold'>waktu sampai: </p>
                <input
                  required
                  onChange={(e) => handleChange(e)}
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
                  onChange={(e) => handleChange(e)}
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
                    handleChange(e);
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
                  onChange={(e) => handleChange(e)}
                  type='text'
                  name='rujukDaripada'
                  className='appearance-none leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
                />
              </div>
            </div>
            <span className='m-2 p-2 capitalize bg-user3 hover:bg-user1 hover:text-userWhite hover:cursor-pointer transition-all'>
              kembali
            </span>
            <button
              type='submit'
              className='m-2 p-2 capitalize bg-user3 hover:bg-user1 hover:text-userWhite transition-all'
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <UserFooter />
    </>
  );
}
