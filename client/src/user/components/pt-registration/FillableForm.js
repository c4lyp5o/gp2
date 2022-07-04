import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

export default function FillableForm({ showForm, setShowForm }) {
  const [nama, setNama] = useState('');
  const [jenisIc, setJenisIc] = useState('');
  const [ic, setIc] = useState('');
  const [umur, setUmur] = useState('');
  const [tarikhLahir, setTarikhLahir] = useState('');
  const [tarikhKedatangan, setTarikhKedatangan] = useState('');
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

  if (loading) return <p>Submitting...</p>;
  if (error) return <p>Error :(</p>;

  if (showForm) {
    return (
      <>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            CreatePatient({
              variables: {
                nama: nama,
                jenisIc: jenisIc,
                ic: ic,
                tarikhLahir: tarikhLahir,
                tarikhKedatangan: tarikhKedatangan,
                jantina: jantina,
                umur: umur,
                alamat: alamat,
                waktuSampai: waktuSampai,
                kategoriPesakit: kategoriPesakit,
                kumpulanEtnik: kumpulanEtnik,
                rujukDaripada: rujukDaripada,
              },
            });
            setShowForm(false);
          }}
        >
          <span
            className='border border-1 border-userBlack bg-user3 p-2 mt-2 hover:cursor-pointer'
            onClick={() => setShowForm(false)}
          >
            kembali
          </span>
          <br />
          <br />
          <strong>pendaftaran</strong>
          <br />
          <div className='text-right'>
            <strong>tarikh kedatangan: </strong>
            <input
              onChange={(e) => setTarikhKedatangan(e.target.value)}
              type='date'
              name='tarikhKedatangan'
            />
          </div>
          <div className='text-left'>
            <strong>nama: </strong>
            <input
              onChange={(e) => setNama(e.target.value)}
              type='text'
              name='namaUmum'
            />
          </div>
          <br />
          <div className='text-left'>
            <select
              name='pengenalan'
              id='pengenalan'
              onChange={(e) => setJenisIc(e.target.value)}
            >
              <option value='plsSlct'>Sila pilih..</option>
              <option value='mykad'>MyKad</option>
              <option value='passport'>Passport</option>
              <option value='tentera'>tentera</option>
              <option value='polis'>polis</option>
              <option value='sijil'>sijil lahir</option>
            </select>
            <input
              onChange={(e) => setIc(e.target.value)}
              type='text'
              name='ic'
            />
          </div>
          <br />
          <div className='text-left'>
            <strong>tarikh lahir: </strong>
            <input
              onChange={(e) => setTarikhLahir(e.target.value)}
              type='date'
              name='tarikhLahir'
            />
            <div className='text-left'>
              <strong>umur: </strong>
              <input
                onChange={(e) => setUmur(parseInt(e.target.value))}
                type='number'
                name='umur'
              />
            </div>
            <div className='text-left'>
              <strong>jantina: </strong>
              <select
                name='jantina'
                id='jantina'
                onChange={(e) => setJantina(e.target.value)}
              >
                <option value='plsSlct'>Sila pilih..</option>
                <option value='lelaki'>lelaki</option>
                <option value='perempuan'>perempuan</option>
              </select>
            </div>
            <div className='text-left'>
              <strong>alamat: </strong>
              <input
                onChange={(e) => setAlamat(e.target.value)}
                type='text'
                name='alamat'
              />
            </div>
            <div className='text-left'>
              <strong>waktu sampai: </strong>
              <input
                onChange={(e) => setWaktuSampai(e.target.value)}
                type='time'
                name='waktuSampai'
              />
            </div>
            <div className='text-left'>
              <strong>kategori pesakit:</strong>
              <select
                name='kategoriPesakit'
                id='kategoriPesakit'
                onChange={(e) => setKategoriPesakit(e.target.value)}
              >
                <option value='plsSlct'>Sila pilih..</option>
                <option value='toddler'>toddler (0 - 4) tahun</option>
                <option value='prasek'>prasekolah (5 - 6) tahun</option>
                <option value='sekolahrendah'>sekolah rendah</option>
                <option value='sekolahmenengah'>sekolah menengah</option>
                <option value='oku'>oku</option>
                <option value='hamil'>ibu mengandung</option>
                <option value='dewasa'>dewasa</option>
                <option value='wargatua'>warga tua</option>
              </select>
            </div>
            <div className='text-left'>
              <strong>kumpulan etnik:</strong>
              <select
                name='kumpulanEtnik'
                id='kumpulanEtnik'
                onChange={(e) => {
                  setKumpulanEtnik(e.target.value);
                }}
              >
                <option value='plsSlct'>Sila pilih..</option>
                <option value='melayu'>melayu</option>
                <option value='cina'>cina</option>
                <option value='india'>india</option>
                <option value='bajau'>bajau</option>
                <option value='dusun'>dusun</option>
                <option value='kadazan'>kadazan</option>
                <option value='murut'>murut</option>
                <option value='bumiputerasabahlain'>
                  bumiputera sabah lain
                </option>
                <option value='melanau'>melanau</option>
                <option value='kedayan'>kedayan</option>
                <option value='iban'>iban</option>
                <option value='bidayuh'>bidayuh</option>
                <option value='bumiputerasarawaklain'>
                  bumiputera sarawak lain
                </option>
                <option value='orangAsli'>orang asli semenanjung</option>
                <option value='lain-lain'>lain-lain</option>
                <option value='non'>bukan warganegara</option>
              </select>
            </div>
            <div className='text-left mt-2'>
              <strong>rujuk daripada:</strong>
              <input
                onChange={(e) => setRujukDaripada(e.target.value)}
                type='text'
                name='rujukDaripada'
              />
            </div>
          </div>
          <button
            className='border border-1 border-userBlack bg-user3 p-2 mt-2 items-left'
            type='submit'
          >
            Submit
          </button>
        </form>
      </>
    );
  }
}
