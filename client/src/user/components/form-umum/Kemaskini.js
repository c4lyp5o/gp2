import { useState } from 'react';
import axios from 'axios';
import { FaWindowClose } from 'react-icons/fa';

import { useGlobalUserAppContext } from '../../context/userAppContext';

function Kemaskini({ setShowKemaskini }) {
  const { userToken, username, navigate, catchAxiosErrorAndLogout, useParams } =
    useGlobalUserAppContext();

  const { personUmumId } = useParams();

  const masterForm = {};

  const closeModal = () => {
    setShowKemaskini(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(masterForm);
    // try {
    //   const { data } = await axios.patch(
    //     `/api/v1/umum/${personUmumId}`,
    //     masterForm,
    //     { headers: { Authorization: `Bearer ${userToken}` } }
    //   );
    //   alert('kemaskini success');
    // } catch (error) {
    //   console.log(error);
    // }
  };

  return (
    <>
      <div className='absolute inset-20 bg-userWhite z-20 outline outline-1 outline-userBlack opacity-100'>
        <FaWindowClose
          onClick={closeModal}
          className='absolute m-2 text-4xl right-0 hover:text-5xl hover:cursor-pointer transition-all'
        />
        <form onSubmit={handleSubmit}>
          <br />
          <br />
          <strong>pendaftaran</strong>
          <br />
          <div className='text-right'>
            <strong>tarikh kedatangan: </strong>
            <input
              type='date'
              name='tarikhKedatangan'
              onChange={(e) => {
                masterForm.tarikhKedatangan = e.target.value;
              }}
            />
          </div>
          <div className='text-left'>
            <strong>nama: </strong>
            <input type='text' name='namaUmum' />
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
            <input type='text' name='ic' />
          </div>
          <br />
          <div className='text-left'>
            <strong>tarikh lahir: </strong>
            <input type='date' name='tarikhLahir' />
            <div className='text-left'>
              <strong>umur: </strong>
              <input type='number' name='umur' />
            </div>
            <div className='text-left'>
              <strong>jantina: </strong>
              <select name='jantina' id='jantina'>
                <option value='lelaki'>lelaki</option>
                <option value='perempuan'>perempuan</option>
              </select>
            </div>
            <div className='text-left'>
              <strong>alamat: </strong>
              <input type='text' name='alamat' />
            </div>
            <div className='text-left'>
              <strong>waktu sampai: </strong>
              <input type='time' name='waktuSampai' />
            </div>
            <div className='text-left'>
              <strong>kategori pesakit:</strong>
              <select name='kategoriPesakit' id='kategoriPesakit'>
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
              <select name='kumpulanEtnik' id='kumpulanEtnik'>
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
              <input type='text' name='rujukDaripada' />
            </div>
          </div>
          <button
            className='border border-1 border-userBlack bg-user3 p-2 mt-2 items-left'
            type='submit'
          >
            Submit
          </button>
        </form>
      </div>
      <div className='absolute inset-0 bg-user1 z-10 opacity-75'></div>
    </>
  );
}

export default Kemaskini;
