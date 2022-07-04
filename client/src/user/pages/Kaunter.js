import UserHeader from '../components/UserHeader';
import UserFooter from '../components/UserFooter';
import PatientData from '../components/pt-registration/PatientData';
import FillableForm from '../components/pt-registration/FillableForm';
// import axios from 'axios';
import { useRef, useEffect, useState } from 'react';

function Kaunter() {
  // const form = useRef(null);
  const [showForm, setShowForm] = useState(false);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const formData = new FormData(form.current);
  //   axios
  //     .post('/api/v1/kaunter/postdata', formData)
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  return (
    <>
      <UserHeader />
      {/* <form
        ref={form}
        onClick={(e) => e.preventDefault()}
        encType='multipart/form-data'
      > */}
      <div className='absolute inset-0 -z-10 bg-user5'></div>
      <div className='absolute inset-10 top-44 -z-10 bg-userWhite text-center justify-center items-center outline outline-1 outline-userBlack rounded-md shadow-xl capitalize'>
        <div className='container px-10 h-full p-3 overflow-y-auto'>
          <PatientData showForm={showForm} setShowForm={setShowForm} />
          <FillableForm showForm={showForm} setShowForm={setShowForm} />
          {/* <input
              className='p-2 w-auto'
              type='text'
              name='carianPesakit'
              placeholder='Cari pesakit...'
            />
            <br />
            <button className='border border-1 border-userBlack bg-user3 p-2 mt-2 items-left'>
              Daftar Pesakit Baru
            </button>
            <div className='border mt-2'>
              <div className='justify-center items-center'>
                {allPesakit.map((p, index) => (
                  <>
                    <p>{p.nama}</p>
                    <p>{p.ic}</p>
                    <br />
                  </>
                ))}
              </div>
            </div> */}
          {/* <FillableForm /> */}
          {/* <strong>pendaftaran</strong>
            <br />
            <div className='text-right'>
              <p>tarikh kedatangan: </p>
              <input
                // onChange={(e) => setTarikhKedatangan(e.target.value)}
                required
                type='date'
                name='tarikhKedatangan'
              />
            </div>
            <div className='text-left'>
              <strong>nama: </strong>
              <input
                // onChange={(e) => setNama(e.target.value)}
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
                // onChange={(e) => setIc(e.target.value)}
                type='text'
                name='ic'
              />
            </div>
            <br />
            <div className='text-left'>
              <p>tarikh lahir: </p>
              <input
                // onChange={(e) => setTarikhLahir(e.target.value)}
                type='date'
                name='tarikhLahir'
              />
            </div>
            <button type='submit'>Submit</button> */}
        </div>
      </div>
      {/* </form> */}
      <UserFooter />
    </>
  );
}

export default Kaunter;
