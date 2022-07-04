import { useMutation, useQuery, gql } from '@apollo/client';
import { useEffect, useState } from 'react';
export default function FillableForm({ showForm, setShowForm }) {
  const [nama, setNama] = useState('');
  const [ic, setIc] = useState('');
  const [tarikhLahir, setTarikhLahir] = useState('');
  const [tarikhKedatangan, setTarikhKedatangan] = useState('');
  const [jantina, setJantina] = useState('?');
  const [umur, setUmur] = useState('0');
  const [alamat, setAlamat] = useState('');
  const [waktuSampai, setWaktuSampai] = useState('');
  const [kategoriPesakit, setKategoriPesakit] = useState('?');
  const [kumpulanEtnik, setKumpulanEtnik] = useState('?');
  const [rujukDaripada, setRujukDaripada] = useState('');

  const ADD_PATIENT = gql`
    mutation CreatePatient(
      $nama: String!
      $ic: String!
      $tarikhLahir: String!
      $tarikhKedatangan: String!
    ) {
      createPatient(
        patient: {
          nama: $nama
          ic: $ic
          tarikhLahir: $tarikhLahir
          tarikhKedatangan: $tarikhKedatangan
        }
      ) {
        nama
        ic
        tarikhLahir
        tarikhKedatangan
      }
    }
  `;

  const [CreatePatient, { loading, error, data }] = useMutation(ADD_PATIENT, {
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

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
                ic: ic,
                tarikhLahir: tarikhLahir,
                tarikhKedatangan: tarikhKedatangan,
                jantina: jantina,
                umur: umur,
              },
            });
            setShowForm(false);
            window.location.reload();
          }}
        >
          <button
            className='border border-1 border-userBlack bg-user3 p-2 mt-2'
            onClick={() => setShowForm(false)}
          >
            No registration por favor
          </button>
          <br />
          <br />
          <strong>pendaftaran</strong>
          <br />
          <div className='text-right'>
            <strong>tarikh kedatangan: </strong>
            <input
              onChange={(e) => setTarikhKedatangan(e.target.value)}
              required
              type='date'
              name='tarikhKedatangan'
            />
          </div>
          <div className='text-left'>
            <strong>nama: </strong>
            <input
              required
              onChange={(e) => setNama(e.target.value)}
              type='text'
              name='namaUmum'
            />
          </div>
          <br />
          <div className='text-left'>
            <select name='pengenalan' id='pengenalan'>
              <option value='mykad'>MyKad</option>
              <option value='passport'>Passport</option>
              <option value='tentera'>tentera</option>
              <option value='polis'>polis</option>
              <option value='sijil'>sijil lahir</option>
            </select>
            <input
              required
              onChange={(e) => setIc(e.target.value)}
              type='text'
              name='ic'
            />
          </div>
          <br />
          <div className='text-left'>
            <strong>tarikh lahir: </strong>
            <input
              required
              onChange={(e) => setTarikhLahir(e.target.value)}
              type='date'
              name='tarikhLahir'
            />
            <div className='text-left'>
              <strong>umur: </strong>
              <input
                required
                onChange={(e) => setUmur(e.target.value)}
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
                <option value='lelaki'>lelaki</option>
                <option value='perempuan'>perempuan</option>
              </select>
            </div>
            <div className='text-left'>
              <strong>alamat: </strong>
              <input
                required
                onChange={(e) => setAlamat(e.target.value)}
                type='text'
                name='alamat'
              />
            </div>
            <div className='text-left'>
              <strong>waktu sampai: </strong>
              <input
                required
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
                onChange={(e) => setKumpulanEtnik(e.target.value)}
              >
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
                required
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
